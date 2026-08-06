/**
 * Final convergence pass: every identifier left in the packs must resolve to a paper that actually
 * matches its citation. Anything else has its identifier stripped and is flagged unverified.
 *
 * WHY THIS IS NEEDED — it fixes a flaw introduced by my own repair pass. ecitmatch resolves on
 * citation COORDINATES (journal|year|volume|firstPage|author). When those coordinates are themselves
 * fabricated it happily returns a real but unrelated paper, so repointing without re-checking the
 * result can replace an obviously-dead identifier with a plausible wrong one — strictly worse,
 * because it now looks verified. Example: bpc-157's "Safety of Intravenous Infusion of BPC157"
 * ended up on 10.3390/jpm15040131, a dual-energy CT adrenal imaging paper.
 *
 * MATCH RULE (deliberately two-signal, to avoid over-stripping):
 *   accept if the resolved title is >=50% contained in the citation,
 *   OR the resolved first-author surname appears in the citation and the year agrees within 1.
 * The second clause protects correct citations whose stored subtitle differs from the registry's —
 * e.g. "Brain-gut Axis and Pentadecapeptide BPC 157: Gastrointestinal..." vs the registry's
 * "...: Theoretical and Practical Implications". Same paper, different tail.
 *
 * Dry-run by default; pass --apply to write.
 */
import fs from 'fs';
import path from 'path';

const APPLY = process.argv.includes('--apply');
const OUT_DIR = '.planning/citation-audit';
const UA = { 'User-Agent': 'PepCodex-quarantine/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchT(url, ms = 25000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: UA, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 3);
const contained = (title, citation) => {
  const A = new Set(norm(title)), B = new Set(norm(citation));
  if (!A.size || !B.size) return 0;
  let i = 0; for (const w of A) if (B.has(w)) i++;
  return i / A.size;
};

const verified = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'pack-citations.json'), 'utf-8'));
const suspect = verified.filter((r) => ['TITLE_MISMATCH', 'DOI_DEAD', 'PMID_DEAD'].includes(r.klass));
console.log(`Checking ${suspect.length} suspect identifiers`);

// fetch authors + title for each suspect's resolved record
const info = new Map();
for (const r of suspect) {
  const k = `${r.file}|${r.jsonPath}`;
  try {
    if (r.pmid && /^\d{6,9}$/.test(r.pmid)) {
      const res = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${r.pmid}`);
      const j = res.ok ? (await res.json()).result || {} : {};
      const d = j[r.pmid];
      if (d && !d.error) info.set(k, { title: d.title || '', year: (d.pubdate || '').slice(0, 4),
        author: ((d.authors || [])[0] || {}).name || '' });
      await sleep(380);
    } else if (r.doi) {
      const res = await fetchT(`https://api.crossref.org/works/${encodeURIComponent(r.doi)}?mailto=admin@pepcodex.com`);
      if (res.ok) {
        const m = (await res.json()).message || {};
        info.set(k, { title: (m.title || [])[0] || '',
          year: String((m.issued?.['date-parts'] || [[]])[0][0] || ''),
          author: (m.author || [])[0] ? `${(m.author || [])[0].family || ''}` : '' });
      }
      await sleep(160);
    }
  } catch (e) { /* no info -> treated as unmatched, which strips */ }
}

const strip = new Set();
const kept = [];
for (const r of suspect) {
  const k = `${r.file}|${r.jsonPath}`;
  const t = info.get(k);
  const cit = String(r.title || '');
  const citWords = new Set(norm(cit));
  const surname = (t?.author || '').split(/[\s,]+/)[0] || '';
  const authorHit = surname.length > 3 && citWords.has(surname.toLowerCase());
  const yr = (cit.match(/\b(19|20)\d{2}\b/) || [])[0];
  const yearOk = t?.year && yr ? Math.abs(Number(yr) - Number(t.year)) <= 1 : false;
  const titleOk = t ? contained(t.title, cit) >= 0.5 : false;
  if (titleOk || (authorHit && yearOk)) kept.push({ ...r, why: titleOk ? 'title' : 'author+year' });
  else strip.add(k);
}
console.log(`  keep ${kept.length} (false alarms) · strip ${strip.size}`);

const TODAY = new Date().toISOString().slice(0, 10);
const perFile = {};
const quarantined = [];
for (const f of fs.readdirSync('data/source-packs').filter((x) => x.endsWith('.json'))) {
  const file = `data/source-packs/${f}`;
  const pack = JSON.parse(fs.readFileSync(file, 'utf-8'));
  let touched = false;
  (function walk(node, p) {
    if (node == null || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach((x, i) => walk(x, `${p}[${i}]`));
    if (strip.has(`${file}|${p}`)) {
      quarantined.push({ pack: f, jsonPath: p, citation: String(node.citation || node.title || '').slice(0, 170),
        removedPmid: node.pmid || node.id || null, removedDoi: node.doi || null });
      delete node.pmid; delete node.doi;
      if (typeof node.id === 'string' && /^PMID:?/i.test(node.id)) delete node.id;
      delete node.verifiedAt; delete node.verifiedAgainst;
      node.verified = false;
      node.needsVerification = true;
      node.note = 'Identifier resolved to a different paper than this citation describes; removed as unverifiable. Do not cite until re-verified.';
      touched = true;
      perFile[f] = (perFile[f] || 0) + 1;
    }
    Object.entries(node).forEach(([k, v]) => walk(v, `${p}.${k}`));
  })(pack, '');
  if (touched && APPLY) fs.writeFileSync(file, JSON.stringify(pack, null, 2) + '\n');
}

console.log(`\n${APPLY ? 'APPLIED' : 'DRY RUN'} — quarantined ${quarantined.length} identifiers`);
for (const [f, n] of Object.entries(perFile).sort((a, b) => b[1] - a[1])) console.log(`  ${f.padEnd(20)} ${n}`);
console.log('\nkept as false alarms:');
for (const k of kept.slice(0, 8)) console.log(`  [${k.slug}] via ${k.why}: ${String(k.title).slice(0, 80)}`);
if (APPLY) fs.writeFileSync(path.join(OUT_DIR, 'quarantined-identifiers.json'), JSON.stringify(quarantined, null, 2));
if (!APPLY) console.log('\nNo files written. Re-run with --apply.');
