/**
 * Second-chance recovery for citation records removed by fix-pack-citations.mjs.
 *
 * ecitmatch is precise but brittle: it needs journal + year + volume + first page + author in
 * exactly the right shape. Real citations fail it routinely — "Raun K et al. Eur J Endocrinol. 1998"
 * (the foundational ipamorelin paper) has no volume or page at all, and compound issue numbers like
 * "95(1-6):529" trip the parser. Deleting on a single strict method's say-so throws away genuine
 * evidence, so every removed record gets a second pass with looser strategies before it stays gone.
 *
 *   A. fielded esearch  <author>[Author] AND <year>[DP] AND <journal>[TA]
 *   B. title search     the citation's title segment against [Title]
 *   C. free-text        distinctive words from the citation
 *
 * A candidate is accepted only if its real title is substantially contained in the stored citation,
 * so a loose search cannot attach the wrong paper. Recovered records are appended back to their
 * original array with a verified PMID/DOI.
 *
 * Dry-run by default; pass --apply to write.
 */
import fs from 'fs';
import path from 'path';

const APPLY = process.argv.includes('--apply');
const OUT_DIR = '.planning/citation-audit';
const UA = { 'User-Agent': 'PepCodex-recover/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchT(url, ms = 30000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: UA, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 3);
const contained = (title, citation) => {
  const A = new Set(norm(title)), B = new Set(norm(citation));
  if (A.size < 3 || !B.size) return 0;
  let i = 0; for (const w of A) if (B.has(w)) i++;
  return i / A.size;
};

/** best-effort title segment: drop a leading author block and a trailing journal/year block */
function titleSegment(cit) {
  let s = String(cit || '').replace(/\s+/g, ' ').trim();
  s = s.replace(/^([A-Z][a-zA-Z'’-]+ [A-Z]{1,3}(,| and|;)?\s*)+(et al\.?,?\s*)?/, '');
  const segs = s.split(/\.\s+/).map((x) => x.trim()).filter(Boolean);
  if (!segs.length) return '';
  // the title is usually the longest early segment that isn't a journal/date tail
  return segs.filter((x) => !/^\(?(19|20)\d{2}/.test(x)).sort((a, b) => b.length - a.length)[0] || segs[0];
}
const authorOf = (c) => (String(c).match(/^([A-Z][a-zA-Z'’-]+)\s+([A-Z]{1,3})\b/) || []).slice(1, 3).join(' ');
const yearOf = (c) => (String(c).match(/\b(19|20)\d{2}\b/) || [])[0] || '';
const journalOf = (c) => {
  const s = String(c).replace(/\s+/g, ' ');
  const m = s.match(/((?:19|20)\d{2})/);
  const before = m ? s.slice(0, s.indexOf(m[0])) : s;
  const segs = before.split(/\.\s+/).map((x) => x.trim()).filter(Boolean);
  const j = (segs[segs.length - 1] || '').replace(/[.,;]+$/, '');
  return j.length && j.length <= 60 ? j : '';
};

async function esearch(term, retmax = 8) {
  const res = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=${retmax}&term=${encodeURIComponent(term)}`);
  if (!res.ok) return [];
  return ((await res.json()).esearchresult || {}).idlist || [];
}
async function summaries(ids) {
  if (!ids.length) return [];
  const res = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(',')}`);
  if (!res.ok) return [];
  const j = (await res.json()).result || {};
  return (j.uids || []).filter((id) => j[id] && !j[id].error).map((id) => {
    const aid = (j[id].articleids || []).find((a) => a.idtype === 'doi');
    return { pmid: id, title: j[id].title || '', doi: aid ? aid.value : null };
  });
}

const removed = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'corelibrary-to-recite.json'), 'utf-8'));
console.log(`Second-chance recovery on ${removed.length} removed records`);

const recovered = [];
const stillGone = [];
for (const r of removed) {
  const cit = r.citation;
  const author = authorOf(cit), year = yearOf(cit), journal = journalOf(cit), title = titleSegment(cit);
  let hits = [];
  const tries = [];
  if (author && year) tries.push(`${author}[Author] AND ${year}[DP]${journal ? ` AND "${journal}"[TA]` : ''}`);
  if (title && title.length > 25) tries.push(`"${title}"[Title]`);
  if (title && title.length > 25) tries.push(title);

  for (const t of tries) {
    try {
      const ids = await esearch(t);
      await sleep(360);
      if (ids.length) { hits = await summaries(ids); await sleep(360); }
    } catch (e) { /* try next */ }
    if (hits.length) {
      const scored = hits.map((h) => ({ ...h, score: +contained(h.title, cit).toFixed(2) }))
        .sort((a, b) => b.score - a.score);
      if (scored[0].score >= 0.6) { hits = scored; break; }
      hits = [];
    }
  }

  if (hits.length && hits[0].score >= 0.6) recovered.push({ ...r, match: hits[0] });
  else stillGone.push(r);
  process.stdout.write(`\r  ${recovered.length + stillGone.length}/${removed.length}  (recovered ${recovered.length})`);
}
console.log('');

// --- reinsert ---
const TODAY = new Date().toISOString().slice(0, 10);
// Restore BOTH groups, but assert nothing we cannot prove.
//   recovered -> real PMID/DOI attached, marked verified
//   unfound   -> citation text kept, fabricated identifier STRIPPED, marked verified:false
//
// Binary keep-or-delete was the wrong frame. In these records the citation text is usually genuine
// and only the identifier is invented (Sikiric in J Physiol Paris, Wang PMID 30116973 and Judak
// PMID 35298973 all exist; the stored ids pointed elsewhere). Deleting them destroys real leads,
// while keeping the id ships a false link. Dropping only the id asserts nothing untrue, keeps the
// lead for re-citation, and — because these entries carry verified:false — bars them from being
// used as evidence by anything downstream.
const byFile = {};
for (const r of recovered) (byFile[`data/source-packs/${r.slug}.json`] ||= []).push({ ...r, ok: true });
for (const r of stillGone) (byFile[`data/source-packs/${r.slug}.json`] ||= []).push({ ...r, ok: false });

for (const [file, items] of Object.entries(byFile)) {
  if (!fs.existsSync(file)) continue;
  const pack = JSON.parse(fs.readFileSync(file, 'utf-8'));
  for (const it of items) {
    // ".coreLibrary.primaryStudies[3]" -> ["coreLibrary","primaryStudies"]
    const parts = it.jsonPath.replace(/\[\d+\]$/, '').split('.').filter(Boolean);
    let node = pack;
    for (const p of parts) { if (node && typeof node === 'object') node = node[p]; }
    if (!Array.isArray(node)) continue;
    node.push(it.ok
      ? { citation: it.citation, pmid: it.match.pmid, ...(it.match.doi ? { doi: it.match.doi } : {}),
          verified: true, verifiedAt: TODAY, verifiedAgainst: 'pubmed/esearch' }
      : { citation: it.citation, verified: false, needsVerification: true,
          note: 'Stored PMID/DOI did not match this citation and could not be confirmed; the unverifiable identifier was removed. Do not cite until re-verified.' });
  }
  if (APPLY) fs.writeFileSync(file, JSON.stringify(pack, null, 2) + '\n');
}

console.log(`\n${APPLY ? 'APPLIED' : 'DRY RUN'} — recovered ${recovered.length} · still unfound ${stillGone.length}`);
const per = {};
for (const r of recovered) per[r.slug] = (per[r.slug] || 0) + 1;
console.log('\nrecovered per pack:');
for (const [k, v] of Object.entries(per).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(16)} ${v}`);
if (APPLY) fs.writeFileSync(path.join(OUT_DIR, 'citations-unrecoverable.json'), JSON.stringify(stillGone, null, 2));
console.log('\nstill unfound (sample):');
stillGone.slice(0, 10).forEach((s) => console.log(`  [${s.slug}] ${s.citation.slice(0, 95)}`));
if (!APPLY) console.log('\nNo files written. Re-run with --apply.');
