/**
 * Propose review candidates from a bounded PubMed alias search.
 *
 * An earlier version searched PubMed for each stored title verbatim and branded anything with no
 * hit a "phantom". That was wrong and dangerous: PubMed ANDs every term, so a paraphrased or
 * translated title returns zero results even when the paper plainly exists — "selank" alone has 135
 * indexed records and "BI 456906" has 9, yet full-title queries for both returned nothing. Acting
 * on that would have deleted real citations.
 *
 * Alias coverage, PubMed coverage and fuzzy title matching are incomplete. No match means
 * UNRESOLVED, never nonexistent. Even a high fuzzy score requires independent identity review.
 *
 * Covers NO_PMID, DEAD, and UNRELATED records — an UNRELATED record has a real title with the wrong
 * PMID attached, and the correct paper is usually sitting in the corpus.
 *
 * Writes audit output only, never source packs. Coverage errors return a nonzero exit.
 */
import fs from 'fs';
import path from 'path';
import { isDocumentSource, safeSourcePackPath, resolutionVerdict } from './lib/source-records.mjs';

const OUT_DIR = '.planning/citation-audit';
const UA = { 'User-Agent': 'PepCodex-srcresolve/2.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MATCH_ALIASES = JSON.parse(fs.readFileSync('data/trial-match-aliases.json', 'utf-8'));

async function fetchT(url, ms = 30000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: UA, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 3);
// Symmetric (Jaccard): tests "is this the same paper", so a short generic stored title must not
// score perfectly against a long unrelated one the way containment would.
const jac = (a, b) => {
  const A = new Set(norm(a)), B = new Set(norm(b));
  if (!A.size || !B.size) return 0;
  let i = 0; for (const w of A) if (B.has(w)) i++;
  return i / (A.size + B.size - i);
};

const verification = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'source-verification.json'), 'utf-8'));
const targets = verification.filter((r) => {
  if (!['NO_PMID', 'DEAD', 'UNRELATED', 'UNVERIFIED', 'EXTERNAL_SOURCE_REVIEW'].includes(r.klass) || !r.title) return false;
  // Inspect current data too: stale pre-migration audit files cannot send documents to PubMed.
  const pack = JSON.parse(fs.readFileSync(safeSourcePackPath(r.file), 'utf8'));
  const source = pack.sources?.[r.index];
  return source && !isDocumentSource(source);
});
const slugs = [...new Set(targets.map((r) => r.slug))];
console.log(`Resolving ${targets.length} records across ${slugs.length} packs, via per-peptide PubMed corpora`);

// --- build one corpus per peptide ---
const corpora = {};
const coverage = {};
let incomplete = false;
for (const slug of slugs) {
  const aliases = [slug.replace(/-/g, ' '), ...(MATCH_ALIASES[slug] || [])];
  const term = encodeURIComponent([...new Set(aliases)].map((a) => `"${a}"`).join(' OR '));
  let ids = [];
  const scope = coverage[slug] = { term: decodeURIComponent(term), requestedLimit: 600, totalCount: null, returnedIds: 0, summarizedIds: 0, status: 'PARTIAL', errors: [], limitations: ['Alias and PubMed coverage cannot establish nonexistence.'] };
  try {
    const es = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=600&term=${term}`);
    if (!es.ok) throw new Error(`HTTP ${es.status}`);
    const result = (await es.json()).esearchresult;
    if (!result || !Array.isArray(result.idlist) || !Number.isFinite(Number(result.count))) throw new Error('Missing or malformed ESearch result.');
    ids = result.idlist;
    scope.totalCount = Number(result.count); scope.returnedIds = ids.length;
    scope.queryTranslation = result.querytranslation || null;
    scope.warnings = result.warninglist || null;
    if (result.errorlist || result.ERROR) scope.errors.push('PubMed query reported errors.');
    if (scope.totalCount > ids.length) scope.errors.push('ESearch result truncated at the bounded retrieval limit.');
  } catch (e) { scope.errors.push(e.message); console.error(`  WARN corpus ${slug}: ${e.message}`); }
  await sleep(400);

  const papers = [];
  for (let i = 0; i < ids.length; i += 150) {
    try {
      const su = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.slice(i, i + 150).join(',')}`);
      if (!su.ok) throw new Error(`HTTP ${su.status}`);
      const j = (await su.json()).result || {};
      if (ids.slice(i, i + 150).some(id => !j[id] || j[id].error)) scope.errors.push(`Missing summary records in batch ${i / 150 + 1}.`);
      for (const id of j.uids || []) {
        if (!j[id] || j[id].error) continue;
        const aid = (j[id].articleids || []).find((a) => a.idtype === 'doi');
        papers.push({ pmid: id, title: j[id].title || '', journal: j[id].fulljournalname || j[id].source || '',
          year: (j[id].pubdate || '').slice(0, 4), doi: aid ? aid.value : null,
          authors: (j[id].authors || []).map((a) => a.name).slice(0, 6).join('; ') });
      }
    } catch (e) { scope.errors.push(e.message); console.error(`  WARN summary ${slug}: ${e.message}`); }
    await sleep(400);
  }
  corpora[slug] = papers;
  scope.summarizedIds = papers.length;
  scope.status = scope.errors.length || papers.length !== ids.length || scope.totalCount === null ? 'PARTIAL' : 'COMPLETE';
  if (scope.status !== 'COMPLETE') incomplete = true;
  console.log(`  ${slug.padEnd(14)} corpus: ${papers.length} papers`);
}

// --- match ---
const results = [];
for (const r of targets) {
  const corpus = corpora[r.slug] || [];
  const scored = corpus.map((p) => ({ ...p, score: +jac(r.title, p.title).toFixed(2) }))
    .sort((a, b) => b.score - a.score);
  const top = scored[0];
  results.push({
    slug: r.slug, file: r.file, index: r.index, priorClass: r.klass,
    storedTitle: r.title, storedPmid: r.pmid, storedDoi: r.doi,
    ...resolutionVerdict(top, coverage[r.slug]?.status === 'COMPLETE'),
    sourceFingerprint: r.sourceFingerprint || null,
    match: top && top.score >= 0.35 ? top : null,
    alternatives: scored.slice(1, 3).filter((s) => s.score >= 0.3),
    corpusSize: corpus.length,
  });
}

fs.writeFileSync(path.join(OUT_DIR, 'source-resolution.json'), JSON.stringify(results, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'source-resolution-coverage.json'), JSON.stringify({ checkedAt: new Date().toISOString(), status: incomplete ? 'PARTIAL' : 'COMPLETE_REVIEW_REQUIRED', coverage, claimSupport: 'NOT_ASSESSED' }, null, 2));
const c = results.reduce((a, r) => ((a[r.verdict] = (a[r.verdict] || 0) + 1), a), {});
console.log('\n=== RESOLUTION ===');
for (const [k, v] of Object.entries(c)) console.log(String(v).padStart(4), k);
const perPack = {};
for (const r of results) (perPack[r.slug] ||= {})[r.verdict] = (perPack[r.slug][r.verdict] || 0) + 1;
console.log('\nper pack:');
for (const [k, v] of Object.entries(perPack)) console.log(`  ${k.padEnd(14)} corpus=${String(corpora[k]?.length ?? 0).padStart(3)}  ${JSON.stringify(v)}`);
console.log(`\nWrote ${OUT_DIR}/source-resolution.json`);
if (incomplete) { console.error('PARTIAL: unresolved/truncated/failed coverage requires review. No absence or deletion conclusion is permitted.'); process.exitCode = 1; }
