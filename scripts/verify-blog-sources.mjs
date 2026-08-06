/**
 * Verify blog `sources[]` entries that carry no URL and no identifier.
 *
 * 198 of 492 blog source entries are a bare {title, type} with nothing to check them against — and
 * they RENDER (src/layouts/BlogLayout.astro). That is exactly the shape the fabricated
 * oral-tirzepatide post used: source "Eli Lilly Initiates Phase 1 Study of Oral Tirzepatide",
 * type news, no URL, describing a trial that does not exist.
 *
 * Two of the four types are mechanically checkable, and those are the two that assert science:
 *   type: journal -> resolve the title against PubMed, then Crossref
 *   type: trial   -> resolve the title against ClinicalTrials.gov
 * `news` and `regulatory` cannot be resolved this way; they are reported separately as a manual
 * worklist rather than silently treated as fine.
 *
 * Proposes only; writes nothing. Output: .planning/citation-audit/blog-source-resolution.json
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const OUT_DIR = '.planning/citation-audit';
const UA = { 'User-Agent': 'PepCodex-blogsrc/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function fetchT(url, ms = 25000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: UA, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 3);
// symmetric: "is this the same document", so a generic stored title cannot score 1.0 against a
// longer unrelated one the way containment would.
const jac = (a, b) => {
  const A = new Set(norm(a)), B = new Set(norm(b));
  if (!A.size || !B.size) return 0;
  let i = 0; for (const w of A) if (B.has(w)) i++;
  return i / (A.size + B.size - i);
};

const records = [];
for (const f of fs.readdirSync('src/content/blog').filter((x) => /\.mdx?$/.test(x))) {
  const d = matter(fs.readFileSync(path.join('src/content/blog', f), 'utf-8')).data;
  (d.sources || []).forEach((s, i) => {
    const blob = JSON.stringify(s);
    const hasId = /(10\.\d{4,9}\/|NCT\d{8})/i.test(blob) || /"\d{6,9}"/.test(blob);
    if (!s.url && !hasId) records.push({ file: f, index: i, id: s.id, title: s.title || '', type: s.type || 'none' });
  });
}
console.log(`Unverifiable blog sources: ${records.length}`);
const checkable = records.filter((r) => r.type === 'journal' || r.type === 'trial');
console.log(`  mechanically checkable (journal/trial): ${checkable.length}`);

const results = [];
for (const r of records) {
  if (r.type !== 'journal' && r.type !== 'trial') {
    results.push({ ...r, verdict: 'MANUAL', reason: `type "${r.type}" needs a URL — cannot be resolved against a registry` });
    continue;
  }
  let match = null;
  try {
    if (r.type === 'journal') {
      const es = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=${encodeURIComponent(r.title)}[Title]`);
      let ids = es.ok ? ((await es.json()).esearchresult || {}).idlist || [] : [];
      await sleep(380);
      if (!ids.length) {
        const es2 = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=${encodeURIComponent(r.title)}`);
        ids = es2.ok ? ((await es2.json()).esearchresult || {}).idlist || [] : [];
        await sleep(380);
      }
      if (ids.length) {
        const su = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(',')}`);
        const j = su.ok ? (await su.json()).result || {} : {};
        const cands = (j.uids || []).filter((x) => j[x] && !j[x].error).map((x) => {
          const aid = (j[x].articleids || []).find((a) => a.idtype === 'doi');
          return { kind: 'pmid', id: x, doi: aid ? aid.value : null, title: j[x].title || '', score: +jac(r.title, j[x].title || '').toFixed(2) };
        }).sort((a, b) => b.score - a.score);
        if (cands[0]?.score >= 0.55) match = cands[0];
        await sleep(380);
      }
      if (!match) {
        const cr = await fetchT(`https://api.crossref.org/works?rows=5&select=DOI,title&query.bibliographic=${encodeURIComponent(r.title)}&mailto=admin@pepcodex.com`);
        if (cr.ok) {
          const items = ((await cr.json()).message || {}).items || [];
          const cands = items.map((m) => ({ kind: 'doi', id: m.DOI, title: (m.title || [])[0] || '', score: +jac(r.title, (m.title || [])[0] || '').toFixed(2) }))
            .sort((a, b) => b.score - a.score);
          if (cands[0]?.score >= 0.55) match = cands[0];
        }
        await sleep(200);
      }
    } else {
      const ct = await fetchT(`https://clinicaltrials.gov/api/v2/studies?query.titles=${encodeURIComponent(r.title)}&fields=NCTId,BriefTitle&pageSize=5`);
      if (ct.ok) {
        const cands = ((await ct.json()).studies || []).map((st) => {
          const idm = st.protocolSection.identificationModule;
          return { kind: 'nct', id: idm.nctId, title: idm.briefTitle || '', score: +jac(r.title, idm.briefTitle || '').toFixed(2) };
        }).sort((a, b) => b.score - a.score);
        if (cands[0]?.score >= 0.55) match = cands[0];
      }
      await sleep(300);
    }
  } catch (e) { /* unresolved -> reported below */ }

  results.push({ ...r, verdict: match ? 'RESOLVED' : 'UNFOUND', match });
  process.stdout.write(`\r  ${results.length}/${records.length}`);
}
console.log('');

fs.writeFileSync(path.join(OUT_DIR, 'blog-source-resolution.json'), JSON.stringify(results, null, 2));
const c = results.reduce((a, r) => ((a[r.verdict] = (a[r.verdict] || 0) + 1), a), {});
console.log('\n=== BLOG SOURCE RESOLUTION ===');
for (const [k, v] of Object.entries(c)) console.log(String(v).padStart(4), k);
console.log('\nUNFOUND journal/trial sources (assert science, resolve to nothing):');
for (const r of results.filter((x) => x.verdict === 'UNFOUND').slice(0, 25)) console.log(`  [${r.type}] ${r.title.slice(0, 78)}  (${r.file})`);
console.log(`\nWrote ${OUT_DIR}/blog-source-resolution.json`);
