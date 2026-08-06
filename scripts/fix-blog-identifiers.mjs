/**
 * Repair blog `sources[]` whose attached identifier points at the wrong document.
 *
 * Input: .planning/citation-audit/attached-identifier-audit.json (from audit-attached-identifiers.mjs)
 *
 * These are real, resolving PMIDs/DOIs/NCTs — which is why the resolution gate never caught them —
 * that simply describe a different paper: "Anxiolytic action of Selank" carried a PMID for a study
 * on simulation fidelity in learning transfer. A resolving-but-wrong identifier is the worst state,
 * because it renders as an authoritative link.
 *
 * For each, search PubMed by the STORED title (which is usually the real paper's title, the
 * identifier being the fabricated part) and:
 *   - repoint to the correct PMID when a confident title match is found
 *   - otherwise strip the identifier and the url, keeping the citation text, and mark it unverified
 *
 * NCT records are judged on drug/topic rather than title, because a stored NCT label is often a
 * short name ("SURMOUNT-1 Trial Registration") that will never string-match a registry title.
 *
 * Dry-run by default; pass --apply to write.
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const APPLY = process.argv.includes('--apply');
const OUT = '.planning/citation-audit';
const UA = { 'User-Agent': 'PepCodex-blogfix/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function fetchT(url, ms = 25000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: UA, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 3);
const jac = (a, b) => {
  const A = new Set(norm(a)), B = new Set(norm(b));
  if (!A.size || !B.size) return 0;
  let i = 0; for (const w of A) if (B.has(w)) i++;
  return i / (A.size + B.size - i);
};

const audit = JSON.parse(fs.readFileSync(path.join(OUT, 'attached-identifier-audit.json'), 'utf-8'));
// NCT label-vs-title mismatches are judged separately; a short registry label is not evidence of error.
const targets = audit.filter((r) => ['MISMATCH', 'WRONG_TYPE', 'DEAD'].includes(r.verdict) && !r.nct);
const nctFlagged = audit.filter((r) => r.verdict !== 'OK' && r.nct);
console.log(`Repairing ${targets.length} wrong identifiers (${nctFlagged.length} NCT label-variances reported separately)`);

const decisions = [];
for (const r of targets) {
  let match = null;
  const title = String(r.title || '');
  if (title.length > 20) {
    try {
      // strip trailing parenthetical journal hints like "(PLoS Medicine)" that defeat [Title] search
      const q = title.replace(/\s*\([^)]*\)\s*$/, '').trim();
      let ids = [];
      const es = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=${encodeURIComponent(q)}[Title]`);
      if (es.ok) ids = ((await es.json()).esearchresult || {}).idlist || [];
      await sleep(380);
      if (!ids.length) {
        const es2 = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=${encodeURIComponent(q)}`);
        if (es2.ok) ids = ((await es2.json()).esearchresult || {}).idlist || [];
        await sleep(380);
      }
      if (ids.length) {
        const su = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(',')}`);
        const j = su.ok ? (await su.json()).result || {} : {};
        const cands = (j.uids || []).filter((x) => j[x] && !j[x].error).map((x) => {
          const aid = (j[x].articleids || []).find((a) => a.idtype === 'doi');
          return { pmid: x, doi: aid ? aid.value : null, title: j[x].title || '', score: +jac(title, j[x].title || '').toFixed(2) };
        }).sort((a, b) => b.score - a.score);
        if (cands[0]?.score >= 0.5) match = cands[0];
      }
      await sleep(200);
    } catch (e) { /* falls through to strip */ }
  }
  decisions.push({ ...r, action: match ? 'REPOINT' : 'STRIP', to: match });
  process.stdout.write(`\r  ${decisions.length}/${targets.length}`);
}
console.log('');

const byFile = {};
for (const d of decisions) (byFile[d.file] ||= []).push(d);
let repointed = 0, stripped = 0;

for (const [file, items] of Object.entries(byFile)) {
  const p = path.join('src/content/blog', file);
  if (!fs.existsSync(p)) continue;
  const fm = matter(fs.readFileSync(p, 'utf-8'));
  for (const it of items) {
    const s = fm.data.sources?.[it.index];
    if (!s) continue;
    if (it.action === 'REPOINT') {
      s.pmid = it.to.pmid;
      s.url = `https://pubmed.ncbi.nlm.nih.gov/${it.to.pmid}/`;
      if (it.to.doi) s.doi = it.to.doi; else delete s.doi;
      s.verifiedAt = '2026-07-25';
      repointed++;
    } else {
      // Keep the citation text; remove only the part that was false.
      delete s.pmid; delete s.doi; delete s.nctId; delete s.verifiedAt;
      if (s.url && /pubmed|doi\.org|clinicaltrials/i.test(s.url)) delete s.url;
      s.verified = false;
      s.note = 'Stored identifier resolved to a different document; removed as unverifiable. Do not cite until re-verified.';
      stripped++;
    }
  }
  if (APPLY) fs.writeFileSync(p, matter.stringify(fm.content, fm.data));
}

fs.writeFileSync(path.join(OUT, 'blog-identifier-repairs.json'), JSON.stringify(decisions, null, 2));
console.log(`\n${APPLY ? 'APPLIED' : 'DRY RUN'} — repointed ${repointed} · stripped ${stripped}`);
console.log('\nrepointed examples:');
for (const d of decisions.filter((x) => x.action === 'REPOINT').slice(0, 12)) {
  console.log(`  ${d.file}: "${d.title.slice(0, 55)}"`);
  console.log(`      ${d.pmid || d.doi} -> PMID ${d.to.pmid} (${d.to.score}) ${d.to.title.slice(0, 55)}`);
}
if (nctFlagged.length) {
  console.log('\nNCT label-variances (identifier likely fine, stored label is a short name):');
  for (const n of nctFlagged) console.log(`  ${n.file} ${n.nct} stored "${n.title.slice(0, 50)}" vs "${String(n.realTitle).slice(0, 50)}"`);
}
if (!APPLY) console.log('\nNo files written. Re-run with --apply.');
