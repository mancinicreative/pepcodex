#!/usr/bin/env node
/**
 * Read-only Audit B analysis. Writes JSON under audit-b/_work only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const matter = require('gray-matter');

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const INV = path.join(HERE, '..', 'INVENTORY.json');
const COMPACT = path.join(HERE, '..', 'INVENTORY-COMPACT.json');
const OUT = path.join(HERE, '_work');
fs.mkdirSync(OUT, { recursive: true });

const inventory = JSON.parse(fs.readFileSync(INV, 'utf8'));
const surfaces = inventory.surfaces;
const byType = {};
for (const s of surfaces) {
  (byType[s.type] ||= []).push(s);
}

function readFm(file) {
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) return { missing: true };
  const raw = fs.readFileSync(abs, 'utf8');
  const { data, content } = matter(raw);
  const headings = [...content.matchAll(/^#{1,3}\s+(.+)$/gm)].map((m) => m[1].trim());
  const paras = content
    .replace(/^---[\s\S]*?---/, '')
    .split(/\n\s*\n/)
    .map((p) => p.replace(/[#>*_`\[\]]/g, ' ').replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 40);
  return {
    missing: false,
    data,
    words: content.split(/\s+/).filter(Boolean).length,
    h1: headings.find((h) => true) || null,
    headings: headings.slice(0, 8),
    firstClaim: paras[0] || null,
    lastClaim: paras.length ? paras[paras.length - 1] : null,
    title: data.title || data.name || data.term || null,
    description: data.description || data.metaDescription || data.excerpt || null,
    lastUpdated: data.lastUpdated ? String(data.lastUpdated) : null,
    publishDate: data.publishDate ? String(data.publishDate) : null,
    robots: data.robots || (data.noindex === true ? 'noindex' : null),
    noindex: data.noindex === true || data.robots === 'noindex',
    category: data.category || null,
    evidence: data.evidenceStrength || data.evidenceLevel || data.evidenceGrade || null,
  };
}

// Stratified sample: first/last alpha, noindex items, then every Nth to hit >=20%
function sampleIds(list, minPct = 0.2) {
  const ids = new Set();
  if (!list.length) return ids;
  const sorted = [...list].sort((a, b) => (a.url || a.file || '').localeCompare(b.url || b.file || ''));
  ids.add(sorted[0].surface_id);
  ids.add(sorted[sorted.length - 1].surface_id);
  for (const s of list) {
    if (s.robots === 'noindex' || s.indexable === false) ids.add(s.surface_id);
  }
  const need = Math.max(Math.ceil(list.length * minPct), Math.min(list.length, 1));
  const step = Math.max(1, Math.floor(list.length / need));
  for (let i = 0; i < list.length; i += step) ids.add(sorted[i].surface_id);
  // pad if still short
  for (const s of sorted) {
    if (ids.size >= need) break;
    ids.add(s.surface_id);
  }
  return ids;
}

const MUST_DEEP = new Set();
const DEEP_TYPES = new Set([
  'trust',
  'home',
  'hub',
  'directory',
  'calculator',
  'protocol',
  'template',
  'conversion',
  'tool',
  'machine',
  'api',
  'error',
  'index',
  'category',
]);
const DEEP_PEPTIDES = new Set([
  'semaglutide',
  'tirzepatide',
  'retatrutide',
  'bpc-157',
  'tb-500',
  'tesamorelin',
  'semax',
  'epithalon',
  'melanotan-ii',
  'pt-141',
  'orforglipron',
  'cagrilintide',
  'liraglutide',
  'mk-677',
  'ipamorelin',
  'ghk-cu',
  'thymosin-alpha-1',
  'ss-31',
  'mots-c',
  'sermorelin',
]);

for (const s of surfaces) {
  if (DEEP_TYPES.has(s.type)) MUST_DEEP.add(s.surface_id);
  if (s.type === 'guide' || s.type === 'safety' || s.type === 'clinic-record') MUST_DEEP.add(s.surface_id);
  if (s.type === 'peptide') {
    const slug = s.extra?.slug || (s.url || '').split('/').pop();
    if (DEEP_PEPTIDES.has(slug)) MUST_DEEP.add(s.surface_id);
  }
}

const sampledByType = {};
const coverage = [];
const fmStats = { titles: [], descLens: [], titleDups: {}, wordByType: {}, missingFiles: [] };

for (const [type, list] of Object.entries(byType)) {
  const sample = sampleIds(list, 0.2);
  sampledByType[type] = [...sample];
  for (const s of list) {
    let status = 'SAMPLED';
    let reason = 'stratified ≥20% frontmatter + first/last claim';
    if (MUST_DEEP.has(s.surface_id)) {
      status = 'INSPECTED';
      reason = 'mandate deep-read type or named peptide';
    } else if (!sample.has(s.surface_id)) {
      status = 'SAMPLED';
      reason = 'minimum: title/description/dates/robots + H1 + first/last claim';
    }
    let fm = null;
    if (s.file && s.file.endsWith('.mdx') || (s.file && /\.mdx?$/.test(s.file))) {
      fm = readFm(s.file);
      if (fm.missing) fmStats.missingFiles.push(s.surface_id);
    }
    coverage.push({
      surface_id: s.surface_id,
      type: s.type,
      url: s.url,
      file: s.file,
      title: s.title,
      indexable: s.indexable,
      robots: s.robots,
      status,
      reason,
      fm: fm && !fm.missing
        ? {
            title: fm.title,
            description: fm.description,
            descLen: fm.description ? fm.description.length : 0,
            lastUpdated: fm.lastUpdated,
            publishDate: fm.publishDate,
            robots: fm.robots,
            noindex: fm.noindex,
            words: fm.words,
            h1: fm.h1,
            firstClaim: fm.firstClaim ? fm.firstClaim.slice(0, 280) : null,
            lastClaim: fm.lastClaim ? fm.lastClaim.slice(0, 280) : null,
            category: fm.category,
            evidence: fm.evidence,
          }
        : null,
    });
    if (fm && !fm.missing) {
      (fmStats.wordByType[type] ||= []).push(fm.words);
      if (fm.title) {
        (fmStats.titleDups[fm.title] ||= []).push(s.surface_id);
        fmStats.titles.push({ id: s.surface_id, type, title: fm.title, len: fm.title.length });
      }
      if (fm.description) fmStats.descLens.push({ id: s.surface_id, type, len: fm.description.length });
    }
  }
}

function stats(arr) {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const sum = s.reduce((a, b) => a + b, 0);
  return {
    n: s.length,
    min: s[0],
    p25: s[Math.floor(s.length * 0.25)],
    median: s[Math.floor(s.length * 0.5)],
    p75: s[Math.floor(s.length * 0.75)],
    max: s[s.length - 1],
    mean: Math.round(sum / s.length),
  };
}

const wordStats = {};
for (const [t, arr] of Object.entries(fmStats.wordByType)) wordStats[t] = stats(arr);

const titleDup = Object.entries(fmStats.titleDups)
  .filter(([, ids]) => ids.length > 1)
  .map(([title, ids]) => ({ title, n: ids.length, ids }));

const shortTitles = fmStats.titles.filter((t) => t.len < 20);
const longTitles = fmStats.titles.filter((t) => t.len > 60);
const shortDesc = fmStats.descLens.filter((d) => d.len < 70);
const longDesc = fmStats.descLens.filter((d) => d.len > 160);

// Graph
const graphPath = path.join(ROOT, '.planning/data/v2/graph-latest.json');
const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
const rows = graph.rows;
const orphans = rows.filter((r) => r.inbound === 0 && !r.noindex);
const unreachable = rows.filter((r) => r.depth == null);
const lowIn = rows.filter((r) => r.inbound > 0 && r.inbound <= 2 && !r.noindex);
const deep = rows.filter((r) => r.depth != null && r.depth > 3);
const depthHist = {};
const prefixDepth = {};
for (const r of rows) {
  const d = r.depth == null ? 'null' : String(r.depth);
  depthHist[d] = (depthHist[d] || 0) + 1;
  const pref = (r.path.split('/')[1] || r.path) + '/';
  if (!prefixDepth[pref]) prefixDepth[pref] = { n: 0, depths: {}, noindex: 0, lowIn: 0, words: [] };
  prefixDepth[pref].n++;
  prefixDepth[pref].depths[d] = (prefixDepth[pref].depths[d] || 0) + 1;
  if (r.noindex) prefixDepth[pref].noindex++;
  if (r.inbound <= 2) prefixDepth[pref].lowIn++;
  if (typeof r.words === 'number') prefixDepth[pref].words.push(r.words);
}
const prefixStats = {};
for (const [k, v] of Object.entries(prefixDepth)) {
  prefixStats[k] = {
    n: v.n,
    noindex: v.noindex,
    lowIn: v.lowIn,
    depths: v.depths,
    words: stats(v.words),
  };
}

const thinComparisons = rows.filter((r) => r.path.startsWith('/compare/') && r.path !== '/compare' && r.words < 400);
const thinGlossary = rows.filter((r) => r.path.startsWith('/glossary/') && r.words < 200);
const thinPc = rows.filter((r) => /^\/peptides\/[^/]+\/[^/]+$/.test(r.path) && r.words < 250);
const thinPeptides = rows.filter((r) => /^\/peptides\/[^/]+$/.test(r.path) && r.words < 400);

const coverageCounts = {};
for (const c of coverage) {
  coverageCounts[c.status] = (coverageCounts[c.status] || 0) + 1;
}
const byTypeCoverage = {};
for (const c of coverage) {
  byTypeCoverage[c.type] ||= { total: 0, INSPECTED: 0, SAMPLED: 0, INACCESSIBLE: 0, OMITTED: 0 };
  byTypeCoverage[c.type].total++;
  byTypeCoverage[c.type][c.status]++;
}

fs.writeFileSync(
  path.join(OUT, 'coverage-rows.json'),
  JSON.stringify(
    coverage.map((c) => ({
      surface_id: c.surface_id,
      type: c.type,
      url: c.url,
      file: c.file,
      status: c.status,
      reason: c.reason,
      indexable: c.indexable,
      robots: c.robots,
      title: c.title,
      fm: c.fm,
    })),
    null,
    2
  )
);
fs.writeFileSync(
  path.join(OUT, 'graph-analysis.json'),
  JSON.stringify(
    {
      summary: graph.summary,
      depthHist,
      prefixStats,
      orphans: orphans.map((r) => r.path),
      unreachable: unreachable.map((r) => ({ path: r.path, inbound: r.inbound, noindex: r.noindex })),
      lowInboundSample: lowIn.slice(0, 40).map((r) => ({ path: r.path, inbound: r.inbound, depth: r.depth, words: r.words })),
      lowInboundCount: lowIn.length,
      deep: deep.map((r) => r.path),
      thin: {
        comparisons_lt400: thinComparisons.length,
        glossary_lt200: thinGlossary.length,
        peptideCondition_lt250: thinPc.length,
        peptides_lt400: thinPeptides.length,
        comparisonSample: thinComparisons.slice(0, 15).map((r) => ({ path: r.path, words: r.words, inbound: r.inbound })),
        pcSample: thinPc.slice(0, 15).map((r) => ({ path: r.path, words: r.words, inbound: r.inbound })),
        peptideSample: thinPeptides.slice(0, 15).map((r) => ({ path: r.path, words: r.words, inbound: r.inbound })),
      },
    },
    null,
    2
  )
);
fs.writeFileSync(
  path.join(OUT, 'fm-stats.json'),
  JSON.stringify(
    {
      wordStats,
      titleDupCount: titleDup.length,
      titleDup: titleDup.slice(0, 40),
      shortTitles: shortTitles.slice(0, 30),
      longTitlesCount: longTitles.length,
      longTitles: longTitles.slice(0, 30),
      shortDescCount: shortDesc.length,
      longDescCount: longDesc.length,
      missingFiles: fmStats.missingFiles,
    },
    null,
    2
  )
);
fs.writeFileSync(
  path.join(OUT, 'coverage-summary.json'),
  JSON.stringify(
    {
      total: coverage.length,
      coverageCounts,
      byTypeCoverage,
      sampledCounts: Object.fromEntries(
        Object.entries(sampledByType).map(([t, ids]) => [t, ids.length])
      ),
      mustDeep: MUST_DEEP.size,
    },
    null,
    2
  )
);
console.log(JSON.stringify({ total: coverage.length, coverageCounts, byTypeCoverage, wordStats, orphans: orphans.map((r) => r.path), unreachableCount: unreachable.length, thin: { c: thinComparisons.length, g: thinGlossary.length, pc: thinPc.length, p: thinPeptides.length } }, null, 2));
