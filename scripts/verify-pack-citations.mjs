/**
 * Verify EVERY citation-bearing record in data/source-packs/*.json — wherever it lives.
 *
 * The packs keep their bibliography under `coreLibrary`, spread across 34 differently-named arrays
 * (primaryStudies, croatianResearchGroup, ophthalmology, australianVeterinary, ...). Only 54 of 466
 * records are in `sources[]`. Any verifier written against known field names checks the small part
 * and declares victory — the same enumeration mistake that let qa-pmids miss whole collections for
 * months. So this walks the JSON structurally: any object carrying a `pmid` or `doi` is a citation,
 * whatever its parent is called, and a newly invented array name is covered the day it appears.
 *
 * Ground truth: Crossref /works for DOIs (title, journal, year, authors), PubMed esummary for PMIDs.
 * Checks resolution AND title agreement — a DOI that resolves to a different paper than the one we
 * claim is the exact failure mode that survives every resolution-only gate.
 *
 * Output: .planning/citation-audit/pack-citations.json + PACK-CITATIONS.md
 */
import fs from 'fs';
import path from 'path';

const DIR = 'data/source-packs';
const OUT_DIR = '.planning/citation-audit';
const UA = { 'User-Agent': 'PepCodex-packcite/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchT(url, ms = 25000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: UA, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 3);
const sim = (a, b) => {
  const A = new Set(norm(a)), B = new Set(norm(b));
  if (!A.size || !B.size) return 0;
  let i = 0; for (const w of A) if (B.has(w)) i++;
  return i / Math.min(A.size, B.size);
};

// --- structural walk: any object with a pmid or doi is a citation record ---
const records = [];
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
  const slug = f.replace(/\.json$/, '');
  const pack = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf-8'));
  (function walk(node, p) {
    if (node == null || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach((x, i) => walk(x, `${p}[${i}]`));
    // Field names vary across the packs: `sources[]` uses {pmid, title}, `coreLibrary.*` uses
    // {id: "PMID:37952131", citation: "<authors>. <Title>. <Journal>. <year>;<vol>:<pages>."}.
    // Reading only {pmid,title} scored genuine records (SELECT, STEP 1) as unverifiable.
    const idPmid = String(node.id || '').match(/^PMID:?\s*(\d{6,9})$/i);
    const pmid = node.pmid ? String(node.pmid).trim() : idPmid ? idPmid[1] : null;
    if (pmid || node.doi) {
      records.push({ slug, file: `${DIR}/${f}`, jsonPath: p, pmid,
        doi: node.doi ? String(node.doi).trim().replace(/^doi:/i, '') : null,
        title: node.title || node.citation || '', titleField: node.title ? 'title' : node.citation ? 'citation' : null,
        journal: node.journal || '', year: node.year || '' });
    }
    Object.entries(node).forEach(([k, v]) => walk(v, `${p}.${k}`));
  })(pack, '');
}
const dois = [...new Set(records.filter((r) => r.doi).map((r) => r.doi))];
const pmids = [...new Set(records.filter((r) => /^\d{6,9}$/.test(r.pmid || '')).map((r) => r.pmid))];
console.log(`Pack citations: ${records.length} records · ${dois.length} unique DOIs · ${pmids.length} unique PMIDs`);

// --- Crossref ---
const doiMeta = {};
let incomplete = false;
let done = 0;
for (const d of dois) {
  try {
    const res = await fetchT(`https://api.crossref.org/works/${encodeURIComponent(d)}?mailto=admin@pepcodex.com`);
    if (res.status === 404) doiMeta[d] = { missing: true };
    else if (res.ok) {
      const m = (await res.json()).message || {};
      doiMeta[d] = { missing: false, title: (m.title || [])[0] || '',
        journal: (m['container-title'] || [])[0] || '',
        year: String((m.issued?.['date-parts'] || [[]])[0][0] || ''),
        authors: (m.author || []).slice(0, 5).map((a) => `${a.family || ''} ${a.given || ''}`.trim()).join('; ') };
    } else throw new Error(`HTTP ${res.status}`);
  } catch (e) { incomplete = true; doiMeta[d] = null; }
  if (++done % 50 === 0) process.stdout.write(`\r  crossref ${done}/${dois.length}`);
  await sleep(120);
}
console.log('');

// --- PubMed ---
const pmMeta = {};
for (let i = 0; i < pmids.length; i += 150) {
  try {
    const res = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${pmids.slice(i, i + 150).join(',')}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = (await res.json()).result || {};
    for (const id of j.uids || []) if (j[id] && !j[id].error) {
      const aid = (j[id].articleids || []).find((a) => a.idtype === 'doi');
      pmMeta[id] = { title: j[id].title || '', journal: j[id].fulljournalname || j[id].source || '',
        year: (j[id].pubdate || '').slice(0, 4), doi: aid ? aid.value : null,
        authors: ((j[id].authors || [])[0] || {}).name || '' };
    }
  } catch (e) { incomplete = true; }
  await sleep(400);
}

const out = [];
for (const r of records) {
  const dm = r.doi ? doiMeta[r.doi] : undefined;
  const pm = r.pmid && /^\d{6,9}$/.test(r.pmid) ? pmMeta[r.pmid] : undefined;

  if (r.doi && dm === null) { out.push({ ...r, klass: 'UNVERIFIED' }); continue; }
  if (r.doi && dm?.missing) { out.push({ ...r, klass: 'DOI_DEAD' }); continue; }
  if (r.pmid && /^\d{6,9}$/.test(r.pmid) && !pm) { out.push({ ...r, klass: 'PMID_DEAD' }); continue; }

  const truth = dm && !dm.missing ? dm : pm;
  if (!truth) { out.push({ ...r, klass: 'NO_ID' }); continue; }
  // Asymmetric on purpose: ask "is the registry's real title present in what we stored". A stored
  // `citation` string legitimately carries authors/journal/volume/pages around the title, so
  // symmetric similarity would penalise a perfectly correct citation for the extra words.
  const A = new Set(norm(truth.title)), B = new Set(norm(r.title));
  let hit = 0; for (const w of A) if (B.has(w)) hit++;
  const s = A.size ? hit / A.size : 0;
  // Two-signal, matching quarantine-unverified.mjs: a citation is confirmed either by title overlap
  // OR by first-author surname + year agreement. Title alone wrongly condemns real citations whose
  // stored form is abbreviated or subtitle-less — "Dhillo WS, et al. J Clin Endocrinol Metab
  // 2005;90(12):6609-6615" carries no title at all yet is a genuine landmark kisspeptin paper.
  const surname = String(truth.authors || '').split(/[\s,]+/)[0] || '';
  const authorHit = surname.length > 3 && B.has(surname.toLowerCase());
  const yr = (String(r.title).match(/\b(19|20)\d{2}\b/) || [])[0];
  const yearOk = truth.year && yr ? Math.abs(Number(yr) - Number(truth.year)) <= 1 : false;
  const confirmed = s >= 0.6 || (authorHit && yearOk);
  out.push({ ...r, klass: !r.title ? 'NO_TITLE' : confirmed ? 'OK' : 'TITLE_MISMATCH',
    titleSim: +s.toFixed(2), confirmedBy: s >= 0.6 ? 'title' : authorHit && yearOk ? 'author+year' : null,
    realTitle: truth.title, realJournal: truth.journal, realYear: truth.year });
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'pack-citations.json'), JSON.stringify(out, null, 2));
const counts = out.reduce((a, r) => ((a[r.klass] = (a[r.klass] || 0) + 1), a), {});
console.log('\n=== PACK CITATION CLASSIFICATION ===');
for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(String(v).padStart(5), k);
const perPack = {};
for (const r of out) if (r.klass !== 'OK') (perPack[r.slug] ||= {})[r.klass] = (perPack[r.slug][r.klass] || 0) + 1;
console.log('\n=== PACKS WITH ISSUES ===');
Object.entries(perPack).sort((a, b) => Object.values(b[1]).reduce((x, y) => x + y, 0) - Object.values(a[1]).reduce((x, y) => x + y, 0))
  .forEach(([k, v]) => console.log(`  ${k.padEnd(16)} ${JSON.stringify(v)}`));
if (incomplete) console.error('\nWARN: some lookups failed — coverage partial.');
console.log(`\nWrote ${OUT_DIR}/pack-citations.json`);
