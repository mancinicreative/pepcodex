/**
 * Audit every identifier that was ATTACHED to a blog source by automation, by re-fetching it and
 * confirming it matches the source's stated title.
 *
 * WHY: an earlier auto-attach pass in this repo matched a source title to a PubMed/Crossref record
 * at a 0.55 similarity threshold — too loose. It produced at least three wrong attachments that a
 * human reviewer later caught: a DOI that resolved to a conference listing rather than the paper,
 * a DOI that redirects to Crossref's `deleted_DOI` placeholder, and a PMID that is a one-paragraph
 * correspondence rather than the trial it was cited for. Each looked verified.
 *
 * A wrong identifier is worse than a missing one, so anything that does not clearly match is
 * reported for removal rather than left in place.
 *
 * Usage: node scripts/audit-attached-identifiers.mjs
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DIR = 'src/content/blog';
const OUT = '.planning/citation-audit';
const UA = { 'User-Agent': 'PepCodex-attachaudit/1.0 (mailto:admin@pepcodex.com)' };
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

const records = [];
for (const f of fs.readdirSync(DIR).filter((x) => /\.mdx?$/.test(x))) {
  const d = matter(fs.readFileSync(path.join(DIR, f), 'utf-8')).data;
  (d.sources || []).forEach((s, i) => {
    const pmid = s.pmid || (String(s.url || '').match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d{6,9})/) || [])[1];
    const doi = s.doi || (String(s.url || '').match(/doi\.org\/(10\.[^\s/]+\/\S+)/) || [])[1];
    const nct = s.nctId || (String(s.url || '').match(/(NCT\d{8})/i) || [])[1];
    if (pmid || doi || nct) records.push({ file: f, index: i, title: s.title || '', type: s.type, pmid, doi, nct });
  });
}
console.log(`Blog sources carrying an identifier: ${records.length}`);

const results = [];
for (const r of records) {
  let real = null, kind = null, dead = false;
  try {
    if (r.pmid) {
      const res = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${r.pmid}`);
      const j = res.ok ? (await res.json()).result || {} : {};
      const d = j[r.pmid];
      if (d && !d.error) { real = d.title || ''; kind = `PMID:${r.pmid}`;
        // A correspondence/comment is not the trial it comments on.
        if ((d.pubtype || []).some((t) => /comment|letter|editorial/i.test(t))) kind += ' [COMMENT/LETTER]';
      } else dead = true;
      await sleep(380);
    } else if (r.doi) {
      const res = await fetchT(`https://api.crossref.org/works/${encodeURIComponent(r.doi)}?mailto=admin@pepcodex.com`);
      if (res.status === 404) dead = true;
      else if (res.ok) {
        const m = (await res.json()).message || {};
        real = (m.title || [])[0] || '';
        kind = `DOI:${r.doi}`;
        if (/deleted/i.test(real) || !real) dead = true;
      }
      await sleep(180);
    } else if (r.nct) {
      const res = await fetchT(`https://clinicaltrials.gov/api/v2/studies?filter.ids=${r.nct}&fields=NCTId,BriefTitle`);
      const s = res.ok ? ((await res.json()).studies || [])[0] : null;
      if (s) { real = s.protocolSection.identificationModule.briefTitle || ''; kind = `NCT:${r.nct}`; }
      else dead = true;
      await sleep(300);
    }
  } catch (e) { /* treated as unverified below */ }

  const score = real ? +jac(r.title, real).toFixed(2) : 0;
  // Publication type only matters when the TITLE also fails. A paper can carry a "Comment" pubtype
  // simply because someone published a comment ON it — PMID 28340339 is the FOXO4-DRI paper (Baar,
  // Cell 2017) and its title matches exactly. Case reports and letters are likewise legitimate
  // sources for a safety observation. Flagging on type alone condemns correct citations.
  const verdict = dead ? 'DEAD' : !real ? 'UNVERIFIED'
    : score >= 0.35 ? 'OK'
    : /COMMENT|LETTER/.test(kind || '') ? 'WRONG_TYPE'
    : 'MISMATCH';
  results.push({ ...r, kind, realTitle: real, score, verdict });
  process.stdout.write(`\r  ${results.length}/${records.length}`);
}
console.log('');

fs.writeFileSync(path.join(OUT, 'attached-identifier-audit.json'), JSON.stringify(results, null, 2));
const c = results.reduce((a, r) => ((a[r.verdict] = (a[r.verdict] || 0) + 1), a), {});
console.log('\n=== ATTACHED IDENTIFIER AUDIT ===');
for (const [k, v] of Object.entries(c).sort((a, b) => b[1] - a[1])) console.log(String(v).padStart(4), k);
const bad = results.filter((r) => r.verdict !== 'OK');
if (bad.length) {
  console.log('\nNEEDS ACTION:');
  for (const b of bad) {
    console.log(`\n  [${b.verdict}] ${b.file} #${b.index}  ${b.kind || b.pmid || b.doi || b.nct}`);
    console.log(`    stored: ${b.title.slice(0, 90)}`);
    console.log(`    real  : ${String(b.realTitle || '(not found)').slice(0, 90)}  (score ${b.score})`);
  }
}
console.log(`\nWrote ${OUT}/attached-identifier-audit.json`);
