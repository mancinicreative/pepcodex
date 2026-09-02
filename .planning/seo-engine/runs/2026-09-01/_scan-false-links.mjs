import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function slugs(dir) {
  if (!fs.existsSync(dir)) return new Set();
  return new Set(
    fs
      .readdirSync(dir)
      .filter((f) => /\.mdx?$/.test(f))
      .map((f) => f.replace(/\.mdx?$/, ''))
  );
}

const peptideSlugs = slugs('src/content/peptides');
const glossarySlugs = slugs('src/content/glossary');
const guideSlugs = slugs('src/content/guides');
const safetySlugs = slugs('src/content/safety');
const compareSlugs = slugs('src/content/comparisons');
const blogSlugs = slugs('src/content/blog');
const protocolSlugs = slugs('src/content/protocols');
const conditionSlugs = slugs('src/content/conditions');

const rel = (f) => f.replace(/\\/g, '/');

const divergences = [];
for (const f of fs.readdirSync('src/content/peptides').filter((x) => x.endsWith('.mdx'))) {
  const slug = f.replace(/\.mdx$/, '');
  const { data } = matter(fs.readFileSync(path.join('src/content/peptides', f), 'utf8'));
  const derived = String(data.name || '').toLowerCase().replace(/\s+/g, '-');
  if (derived !== slug) divergences.push({ slug, name: data.name, derived });
}

const liveDupes = [];
const seen = new Set();
for (const s of compareSlugs) {
  const i = s.indexOf('-vs-');
  if (i < 0) continue;
  const a = s.slice(0, i);
  const b = s.slice(i + 4);
  const rev = `${b}-vs-${a}`;
  if (compareSlugs.has(rev) && !seen.has(s) && !seen.has(rev)) {
    liveDupes.push([s, rev]);
    seen.add(s);
    seen.add(rev);
  }
}

const bodyLinks = {
  guides: [],
  trailing: [],
  mdx: [],
  peptidesMissing: [],
  glossaryMissing: [],
  compareMissing: [],
  safetyMissing: [],
  guideMissing: [],
  blogMissing: [],
  protocolsMissing: [],
};

function classifyInternal(url, file, line, kind) {
  const u = url.split('#')[0].split('?')[0];
  const rec = { file: rel(file), url, line, kind };
  if (u.includes('.mdx')) bodyLinks.mdx.push(rec);
  if (/^\/guides(\/|$)/.test(u)) bodyLinks.guides.push(rec);
  if (u.length > 1 && u.endsWith('/')) bodyLinks.trailing.push(rec);
  const mPep = u.match(/^\/peptides\/([^/]+)(?:\/([^/]+))?\/?$/);
  if (mPep && mPep[1] && !peptideSlugs.has(mPep[1])) bodyLinks.peptidesMissing.push(rec);
  const mGl = u.match(/^\/glossary\/([^/]+)\/?$/);
  if (mGl && !glossarySlugs.has(mGl[1])) bodyLinks.glossaryMissing.push(rec);
  const mC = u.match(/^\/compare\/([^/]+)\/?$/);
  if (mC && !compareSlugs.has(mC[1])) bodyLinks.compareMissing.push(rec);
  const mS = u.match(/^\/safety\/([^/]+)\/?$/);
  if (mS && !safetySlugs.has(mS[1])) bodyLinks.safetyMissing.push(rec);
  const mG = u.match(/^\/guide\/([^/]+)\/?$/);
  if (mG && !guideSlugs.has(mG[1])) bodyLinks.guideMissing.push(rec);
  const mB = u.match(/^\/blog\/([^/]+)\/?$/);
  if (mB && !blogSlugs.has(mB[1])) bodyLinks.blogMissing.push(rec);
  const mP = u.match(/^\/protocols\/([^/]+)\/?$/);
  if (mP && !protocolSlugs.has(mP[1])) bodyLinks.protocolsMissing.push(rec);
}

const contentFiles = walk('src/content').filter((f) => /\.mdx?$/.test(f));
for (const f of contentFiles) {
  const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    const re1 = /\]\((\/[^)\s]+)\)/g;
    let m;
    while ((m = re1.exec(line))) classifyInternal(m[1], f, i + 1, 'md');
    const re2 = /href=["'](\/[^"']+)["']/g;
    while ((m = re2.exec(line))) classifyInternal(m[1], f, i + 1, 'href');
  });
}

const tplHits = {
  guides: [],
  trailingHtml: [],
  mdxHref: [],
  cityId: [],
  protocolSlug: [],
  currentSlug: [],
  unguardedPeptideHref: [],
};
const templateFiles = [...walk('src/layouts'), ...walk('src/pages'), ...walk('src/components')].filter((f) =>
  /\.(astro|ts|tsx|js|mjs)$/.test(f)
);
for (const f of templateFiles) {
  const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    const rec = { file: rel(f), line: i + 1, text: line.trim().slice(0, 200) };
    if (/\/guides(\/|"|'|`)/.test(line) && !line.includes('guides:') && !line.includes("'guides'") && !line.includes('"guides"')) {
      tplHits.guides.push(rec);
    }
    if (/href=\{`\/[^`]+\/`\}/.test(line) || /href="\/[^"]+\/"/.test(line) || /href='\/[^']+\/'/.test(line)) {
      if (!line.includes('http') && !line.includes('pubmed') && !line.includes('clinicaltrials')) {
        tplHits.trailingHtml.push(rec);
      }
    }
    if (/\.mdx/.test(line) && /(href|city\.id|clinic\.id|p\.id)/.test(line)) tplHits.mdxHref.push(rec);
    if (/city\.id/.test(line)) tplHits.cityId.push(rec);
    if (/protocol\.data\.slug/.test(line)) tplHits.protocolSlug.push(rec);
    if (/\bcurrentSlug\b/.test(line)) tplHits.currentSlug.push(rec);
  });
}

const guidePeptideMiss = [];
for (const f of fs.readdirSync('src/content/guides').filter((x) => x.endsWith('.mdx'))) {
  const { data } = matter(fs.readFileSync(path.join('src/content/guides', f), 'utf8'));
  if (data.peptide && !peptideSlugs.has(data.peptide)) {
    guidePeptideMiss.push({ file: f, peptide: data.peptide });
  }
}

const safetyMiss = [];
for (const f of fs.readdirSync('src/content/safety').filter((x) => x.endsWith('.mdx'))) {
  const { data } = matter(fs.readFileSync(path.join('src/content/safety', f), 'utf8'));
  for (const p of data.peptides || []) {
    if (!peptideSlugs.has(p)) safetyMiss.push({ file: f, peptide: p });
  }
}

const protoMiss = [];
for (const f of fs.readdirSync('src/content/protocols').filter((x) => x.endsWith('.mdx'))) {
  const { data } = matter(fs.readFileSync(path.join('src/content/protocols', f), 'utf8'));
  for (const p of data.peptides || []) {
    if (!peptideSlugs.has(p)) protoMiss.push({ file: f, peptide: p });
  }
}

const cmpMiss = [];
for (const f of fs.readdirSync('src/content/comparisons').filter((x) => x.endsWith('.mdx'))) {
  const { data } = matter(fs.readFileSync(path.join('src/content/comparisons', f), 'utf8'));
  if (data.peptideA && !peptideSlugs.has(data.peptideA)) cmpMiss.push({ file: f, field: 'peptideA', v: data.peptideA });
  if (data.peptideB && !peptideSlugs.has(data.peptideB)) cmpMiss.push({ file: f, field: 'peptideB', v: data.peptideB });
}

function summarize(arr, n = 15) {
  return { count: arr.length, sample: arr.slice(0, n) };
}

const out = {
  collections: {
    peptides: peptideSlugs.size,
    glossary: glossarySlugs.size,
    comparisons: compareSlugs.size,
    blog: blogSlugs.size,
    guides: guideSlugs.size,
    safety: safetySlugs.size,
    protocols: protocolSlugs.size,
    conditions: conditionSlugs.size,
  },
  divergences,
  liveDupes,
  guidePeptideMiss,
  safetyMiss,
  protoMiss,
  cmpMiss,
  body: Object.fromEntries(Object.entries(bodyLinks).map(([k, v]) => [k, summarize(v)])),
  tpl: Object.fromEntries(Object.entries(tplHits).map(([k, v]) => [k, summarize(v, 25)])),
};

const outPath = '.planning/seo-engine/runs/2026-09-01/_scan-false-links.json';
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(
  JSON.stringify(
    {
      divergences: divergences.length,
      liveDupes,
      guidePeptideMiss,
      safetyMissCount: safetyMiss.length,
      protoMissCount: protoMiss.length,
      cmpMissCount: cmpMiss.length,
      bodyCounts: Object.fromEntries(Object.entries(bodyLinks).map(([k, v]) => [k, v.length])),
      tplCounts: Object.fromEntries(Object.entries(tplHits).map(([k, v]) => [k, v.length])),
    },
    null,
    2
  )
);
console.log('wrote', outPath);
