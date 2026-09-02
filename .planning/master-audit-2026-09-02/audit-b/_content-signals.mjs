#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const matter = require('gray-matter');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const OUT = path.join(HERE, '_work');

function walk(dir) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs).filter((f) => /\.mdx?$/.test(f)).map((f) => path.join(dir, f).replaceAll('\\', '/'));
}
function read(file) {
  const raw = fs.readFileSync(path.join(ROOT, file), 'utf8');
  return matter(raw);
}

// Comparisons: body hash / first 120 chars / word count / title pattern
const comps = walk('src/content/comparisons').map((file) => {
  const { data, content } = read(file);
  const body = content.replace(/\s+/g, ' ').trim();
  const words = body.split(/\s+/).filter(Boolean).length;
  const first = body.slice(0, 160);
  const h2s = [...content.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
  return {
    file,
    slug: path.basename(file, path.extname(file)),
    title: data.title,
    metaTitle: data.metaTitle || null,
    desc: data.metaDescription || data.summary || null,
    words,
    h2s,
    first,
    lastUpdated: data.lastUpdated ? String(data.lastUpdated) : null,
    peptideA: data.peptideA?.slug || data.peptideA,
    peptideB: data.peptideB?.slug || data.peptideB,
  };
});
const firstBuckets = {};
for (const c of comps) {
  const key = c.first.slice(0, 80);
  (firstBuckets[key] ||= []).push(c.slug);
}
const similarOpeners = Object.entries(firstBuckets).filter(([, slugs]) => slugs.length >= 3).sort((a, b) => b[1].length - a[1].length);

const wordHist = { lt200: 0, lt300: 0, lt500: 0, ge500: 0 };
for (const c of comps) {
  if (c.words < 200) wordHist.lt200++;
  else if (c.words < 300) wordHist.lt300++;
  else if (c.words < 500) wordHist.lt500++;
  else wordHist.ge500++;
}

// Peptide conditions uniqueness
const peptides = walk('src/content/peptides').map((file) => {
  const { data, content } = read(file);
  const conds = Array.isArray(data.conditions) ? data.conditions : [];
  return {
    slug: path.basename(file, path.extname(file)),
    name: data.name,
    words: content.split(/\s+/).filter(Boolean).length,
    lastUpdated: data.lastUpdated ? String(data.lastUpdated) : null,
    evidence: data.evidenceStrength,
    category: data.category,
    condCount: conds.length,
    conds: conds.map((c) => ({
      slug: c.slug,
      name: c.name,
      summaryLen: (c.researchSummary || '').length,
      summary: (c.researchSummary || '').slice(0, 180),
      studies: Array.isArray(c.relevantStudies) ? c.relevantStudies.length : 0,
    })),
    title: data.title || data.name,
    descLen: (data.metaDescription || data.summary || '').length,
  };
});
const conds = peptides.flatMap((p) => p.conds.map((c) => ({ peptide: p.slug, ...c })));
const thinConds = conds.filter((c) => c.summaryLen < 120);
const zeroStudyConds = conds.filter((c) => c.studies === 0);

// Glossary noindex vs index word
const gloss = walk('src/content/glossary').map((file) => {
  const { data, content } = read(file);
  return {
    slug: path.basename(file, path.extname(file)),
    term: data.term || data.title,
    noindex: data.noindex === true,
    words: content.split(/\s+/).filter(Boolean).length,
    desc: data.metaDescription || data.definition || null,
    descLen: (data.metaDescription || data.definition || '').length,
  };
});

// Blog vs guide overlap
const blogs = walk('src/content/blog').map((file) => path.basename(file, path.extname(file)));
const guides = walk('src/content/guides').map((file) => path.basename(file, path.extname(file)));
const safety = walk('src/content/safety').map((file) => path.basename(file, path.extname(file)));
const overlap = {
  blogGuide: blogs.filter((b) => guides.includes(b)),
  blogSafety: blogs.filter((b) => safety.includes(b.replace(/^what-is-/, '') + '-safety') || safety.includes(b + '-safety')),
  guideSafety: guides.filter((g) => safety.includes(g.replace(/^what-is-/, '') + '-safety') || safety.includes(g + '-safety')),
};

// Clinics
const clinics = walk('src/content/clinics').map((file) => {
  const { data } = read(file);
  return {
    slug: path.basename(file, path.extname(file)),
    name: data.name,
    city: data.city,
    website: data.website,
    phone: data.phone,
    verified: !!data.verifiedListing,
    featured: !!data.featured,
    placeholderWeb: typeof data.website === 'string' && /example\.com/i.test(data.website),
    placeholderPhone: typeof data.phone === 'string' && /555-/.test(data.phone),
    services: data.services || [],
    peptides: data.peptides || [],
  };
});
const cities = walk('src/content/cities').map((file) => {
  const { data } = read(file);
  return {
    slug: path.basename(file, path.extname(file)),
    name: data.name,
    state: data.stateAbbr || data.state,
    pop: data.population,
    meta: data.metaDescription,
    metaLen: (data.metaDescription || '').length,
    contentLen: (data.content || '').length,
  };
});

// Graph unreachable indexable
const graph = JSON.parse(fs.readFileSync(path.join(ROOT, '.planning/data/v2/graph-latest.json'), 'utf8'));
const unreachable = graph.rows.filter((r) => r.depth == null);
const unreachableIndexable = unreachable.filter((r) => !r.noindex);
const lowInIndexable = graph.rows.filter((r) => !r.noindex && r.inbound <= 1);
const pcRows = graph.rows.filter((r) => /^\/peptides\/[^/]+\/[^/]+$/.test(r.path));
const cmpRows = graph.rows.filter((r) => r.path.startsWith('/compare/') && r.path !== '/compare');

// lastUpdated year buckets peptides
const lu = {};
for (const p of peptides) {
  const y = p.lastUpdated ? p.lastUpdated.slice(0, 7) : 'none';
  lu[y] = (lu[y] || 0) + 1;
}

const out = {
  comparisons: {
    n: comps.length,
    wordHist,
    medianWords: comps.map((c) => c.words).sort((a, b) => a - b)[Math.floor(comps.length / 2)],
    similarOpeners: similarOpeners.slice(0, 12).map(([k, slugs]) => ({ opener: k, n: slugs.length, sample: slugs.slice(0, 8) })),
    thinnest: [...comps].sort((a, b) => a.words - b.words).slice(0, 12).map((c) => ({ slug: c.slug, words: c.words, title: c.title })),
    thickest: [...comps].sort((a, b) => b.words - a.words).slice(0, 6).map((c) => ({ slug: c.slug, words: c.words })),
  },
  peptideConditions: {
    n: conds.length,
    thinSummary: thinConds.length,
    zeroStudies: zeroStudyConds.length,
    summaryLen: {
      min: Math.min(...conds.map((c) => c.summaryLen)),
      median: conds.map((c) => c.summaryLen).sort((a, b) => a - b)[Math.floor(conds.length / 2)],
      max: Math.max(...conds.map((c) => c.summaryLen)),
    },
    thinSample: thinConds.slice(0, 12),
    peptidesWithManyConds: peptides.filter((p) => p.condCount >= 5).map((p) => ({ slug: p.slug, n: p.condCount, words: p.words })),
  },
  glossary: {
    n: gloss.length,
    noindex: gloss.filter((g) => g.noindex).length,
    noindexMedianWords: (() => {
      const a = gloss.filter((g) => g.noindex).map((g) => g.words).sort((a, b) => a - b);
      return a[Math.floor(a.length / 2)];
    })(),
    indexMedianWords: (() => {
      const a = gloss.filter((g) => !g.noindex).map((g) => g.words).sort((a, b) => a - b);
      return a[Math.floor(a.length / 2)];
    })(),
  },
  overlap,
  clinics: {
    n: clinics.length,
    verified: clinics.filter((c) => c.verified).length,
    featured: clinics.filter((c) => c.featured).length,
    placeholderWeb: clinics.filter((c) => c.placeholderWeb).length,
    placeholderPhone: clinics.filter((c) => c.placeholderPhone).length,
    citiesWithZeroClinics: cities.filter((city) => !clinics.some((c) => (c.city || '').toLowerCase() === (city.name || '').toLowerCase())).map((c) => c.slug),
  },
  cities: {
    n: cities.length,
    metaLenMedian: cities.map((c) => c.metaLen).sort((a, b) => a - b)[Math.floor(cities.length / 2)],
    contentLenMedian: cities.map((c) => c.contentLen).sort((a, b) => a - b)[Math.floor(cities.length / 2)],
    contentLenMin: Math.min(...cities.map((c) => c.contentLen)),
    sampleMeta: cities.slice(0, 5).map((c) => ({ slug: c.slug, meta: c.meta, contentLen: c.contentLen })),
  },
  graph: {
    unreachable: unreachable.map((r) => ({ path: r.path, inbound: r.inbound, noindex: r.noindex })),
    unreachableIndexable: unreachableIndexable.map((r) => r.path),
    lowInIndexableCount: lowInIndexable.length,
    lowInIndexableSample: lowInIndexable.slice(0, 25).map((r) => ({ path: r.path, inbound: r.inbound, depth: r.depth })),
    pc: {
      n: pcRows.length,
      depth: pcRows.reduce((a, r) => ((a[r.depth] = (a[r.depth] || 0) + 1), a), {}),
      inboundMedian: pcRows.map((r) => r.inbound).sort((a, b) => a - b)[Math.floor(pcRows.length / 2)],
      wordsMedian: pcRows.map((r) => r.words).sort((a, b) => a - b)[Math.floor(pcRows.length / 2)],
    },
    compare: {
      n: cmpRows.length,
      inboundMedian: cmpRows.map((r) => r.inbound).sort((a, b) => a - b)[Math.floor(cmpRows.length / 2)],
      wordsMedian: cmpRows.map((r) => r.words).sort((a, b) => a - b)[Math.floor(cmpRows.length / 2)],
    },
  },
  peptideLastUpdated: lu,
  thinPeptides: peptides.filter((p) => p.words < 200).map((p) => ({ slug: p.slug, words: p.words, evidence: p.evidence })),
};
fs.writeFileSync(path.join(OUT, 'content-signals.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify({
  comps: out.comparisons.wordHist,
  similar: out.comparisons.similarOpeners.slice(0, 5),
  conds: { n: conds.length, thin: thinConds.length, zero: zeroStudyConds.length },
  overlap,
  clinics: out.clinics,
  unreachableIndexable: out.graph.unreachableIndexable,
  thinPeptides: out.thinPeptides,
  lu,
}, null, 2));
