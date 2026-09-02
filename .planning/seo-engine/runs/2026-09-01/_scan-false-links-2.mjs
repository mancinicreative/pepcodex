import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function slugs(dir) {
  return new Set(
    fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, ''))
  );
}

const peptideSlugs = slugs('src/content/peptides');
const compareSlugs = slugs('src/content/comparisons');
const glossarySlugs = slugs('src/content/glossary');

const diverging = [
  'amycretin',
  'hcg',
  'melanotan-i',
  'mrna-4157',
  'na-selank-amidate',
  'na-semax-amidate',
];

const cmpFor = {};
for (const slug of diverging) {
  cmpFor[slug] = [...compareSlugs].filter(
    (s) => s.startsWith(`${slug}-vs-`) || s.endsWith(`-vs-${slug}`)
  );
}

const oldOrder = [
  'ipamorelin-vs-cjc-1295',
  'cjc-1295-vs-mk-677',
  'semaglutide-vs-liraglutide',
  'tirzepatide-vs-liraglutide',
  'sermorelin-vs-mk-677',
  'ss-31-vs-mots-c',
  'retatrutide-vs-tirzepatide',
  'semaglutide-vs-tirzepatide',
  'sermorelin-vs-tesamorelin',
  'thymalin-vs-thymosin-alpha-1',
];

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const oldHits = [];
const files = [
  ...walk('src'),
  ...walk('src/content'),
].filter((f) => /\.(astro|mdx|md|ts|js|mjs)$/.test(f));
const unique = [...new Set(files)];
for (const f of unique) {
  const text = fs.readFileSync(f, 'utf8');
  for (const slug of oldOrder) {
    if (text.includes(`/compare/${slug}`)) {
      oldHits.push({ file: f.replace(/\\/g, '/'), slug });
    }
  }
}

// warning class counts (same rules as validate-cross-links)
const rules = [
  { collection: 'blog', field: 'relatedPeptides', target: peptideSlugs, type: 'array' },
  { collection: 'blog', field: 'relatedGlossary', target: glossarySlugs, type: 'array' },
  { collection: 'glossary', field: 'relatedPeptides', target: peptideSlugs, type: 'array' },
  { collection: 'glossary', field: 'relatedTerms', target: glossarySlugs, type: 'array' },
  { collection: 'peptides', field: 'relatedTerms', target: glossarySlugs, type: 'array' },
  { collection: 'peptides', field: 'interactions', target: peptideSlugs, type: 'nested', subfield: 'peptide' },
];
const warn = {};
const uniqueMissing = {};
for (const rule of rules) {
  const key = `${rule.collection}.${rule.field}`;
  warn[key] = 0;
  uniqueMissing[key] = new Set();
  const dir = path.resolve(`src/content/${rule.collection}`);
  for (const file of fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f))) {
    const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
    let vals = [];
    if (rule.type === 'array') vals = data[rule.field] || [];
    else if (rule.type === 'nested') vals = (data[rule.field] || []).map((i) => i[rule.subfield]).filter(Boolean);
    for (const slug of vals) {
      if (!rule.target.has(slug)) {
        warn[key]++;
        uniqueMissing[key].add(slug);
      }
    }
  }
}

const warnOut = {};
for (const k of Object.keys(warn)) {
  warnOut[k] = { count: warn[k], unique: [...uniqueMissing[k]].sort() };
}

// JSON-LD trailing in layouts
const jsonLd = [];
for (const f of walk('src/layouts').concat(walk('src/pages'))) {
  if (!f.endsWith('.astro')) continue;
  const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    if (/url:\s*`\$\{.*(siteBase|Astro\.site)[^`]*\/`/.test(line) || /url:\s*'https:\/\/www\.pepcodex\.com\/[^']+\/'/.test(line) || /url:\s*`https:\/\/www\.pepcodex\.com\/[^`]+\/`/.test(line)) {
      jsonLd.push({ file: f.replace(/\\/g, '/'), line: i + 1, text: line.trim().slice(0, 160) });
    }
  });
}

const out = { cmpFor, oldHits, warnOut, jsonLd };
fs.writeFileSync('.planning/seo-engine/runs/2026-09-01/_scan-false-links-2.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify({
  cmpFor,
  oldHits,
  warnCounts: Object.fromEntries(Object.entries(warnOut).map(([k, v]) => [k, { count: v.count, uniqueN: v.unique.length }])),
  jsonLdN: jsonLd.length,
}, null, 2));
