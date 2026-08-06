/**
 * Resolve unverified source records by matching them against the peptide's ENTIRE PubMed corpus.
 *
 * An earlier version searched PubMed for each stored title verbatim and branded anything with no
 * hit a "phantom". That was wrong and dangerous: PubMed ANDs every term, so a paraphrased or
 * translated title returns zero results even when the paper plainly exists — "selank" alone has 135
 * indexed records and "BI 456906" has 9, yet full-title queries for both returned nothing. Acting
 * on that would have deleted real citations.
 *
 * So: pull every PubMed record for the peptide once (aliases OR'd), then match each stored record
 * against that corpus. Now "no match" means "no such paper exists in this peptide's literature",
 * which is a claim worth acting on.
 *
 * Covers NO_PMID, DEAD, and UNRELATED records — an UNRELATED record has a real title with the wrong
 * PMID attached, and the correct paper is usually sitting in the corpus.
 *
 * Proposes only; writes nothing. Output: .planning/citation-audit/source-resolution.json
 */
import fs from 'fs';
import path from 'path';

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
const targets = verification.filter((r) => ['NO_PMID', 'DEAD', 'UNRELATED'].includes(r.klass) && r.title);
const slugs = [...new Set(targets.map((r) => r.slug))];
console.log(`Resolving ${targets.length} records across ${slugs.length} packs, via per-peptide PubMed corpora`);

// --- build one corpus per peptide ---
const corpora = {};
for (const slug of slugs) {
  const aliases = [slug.replace(/-/g, ' '), ...(MATCH_ALIASES[slug] || [])];
  const term = encodeURIComponent([...new Set(aliases)].map((a) => `"${a}"`).join(' OR '));
  let ids = [];
  try {
    const es = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=600&term=${term}`);
    if (es.ok) ids = ((await es.json()).esearchresult || {}).idlist || [];
  } catch (e) { console.error(`  WARN corpus ${slug}: ${e.message}`); }
  await sleep(400);

  const papers = [];
  for (let i = 0; i < ids.length; i += 150) {
    try {
      const su = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.slice(i, i + 150).join(',')}`);
      const j = su.ok ? (await su.json()).result || {} : {};
      for (const id of j.uids || []) {
        if (!j[id] || j[id].error) continue;
        const aid = (j[id].articleids || []).find((a) => a.idtype === 'doi');
        papers.push({ pmid: id, title: j[id].title || '', journal: j[id].fulljournalname || j[id].source || '',
          year: (j[id].pubdate || '').slice(0, 4), doi: aid ? aid.value : null,
          authors: (j[id].authors || []).map((a) => a.name).slice(0, 6).join('; ') });
      }
    } catch (e) { console.error(`  WARN summary ${slug}: ${e.message}`); }
    await sleep(400);
  }
  corpora[slug] = papers;
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
    verdict: top && top.score >= 0.6 ? 'RESOLVED' : top && top.score >= 0.35 ? 'REVIEW' : 'PHANTOM',
    match: top && top.score >= 0.35 ? top : null,
    alternatives: scored.slice(1, 3).filter((s) => s.score >= 0.3),
    corpusSize: corpus.length,
  });
}

fs.writeFileSync(path.join(OUT_DIR, 'source-resolution.json'), JSON.stringify(results, null, 2));
const c = results.reduce((a, r) => ((a[r.verdict] = (a[r.verdict] || 0) + 1), a), {});
console.log('\n=== RESOLUTION ===');
for (const [k, v] of Object.entries(c)) console.log(String(v).padStart(4), k);
const perPack = {};
for (const r of results) (perPack[r.slug] ||= {})[r.verdict] = (perPack[r.slug][r.verdict] || 0) + 1;
console.log('\nper pack:');
for (const [k, v] of Object.entries(perPack)) console.log(`  ${k.padEnd(14)} corpus=${String(corpora[k]?.length ?? 0).padStart(3)}  ${JSON.stringify(v)}`);
console.log(`\nWrote ${OUT_DIR}/source-resolution.json`);
