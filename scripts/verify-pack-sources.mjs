/**
 * Verify every data/source-packs/*.json `sources[]` record against PubMed.
 *
 * sources[] renders NOWHERE — but it is read as trusted "already verified research" by content
 * agents, so a fabrication here launders itself into dossiers on the next content pass. That makes
 * it the highest-leverage surface to clean before adding new claims on top.
 *
 * For each record we ask three separate questions, because they have different remedies:
 *   1. Does the PMID resolve?                        no  -> DEAD, delete
 *   2. Is the paper about this peptide?              no  -> UNRELATED, the citation is void
 *   3. Do stored title/journal/year/doi match it?    no  -> METADATA_WRONG, repairable from PubMed
 *
 * A stored DOI is only trustworthy when PubMed agrees; PubMed's articleids is authoritative and is
 * used both to check and to repair.
 *
 * Output: .planning/citation-audit/source-verification.json + SOURCE-VERIFICATION.md
 * Usage:  node scripts/verify-pack-sources.mjs
 */
import fs from 'fs';
import path from 'path';

const DIR = 'data/source-packs';
const OUT_DIR = '.planning/citation-audit';
const UA = { 'User-Agent': 'PepCodex-srcverify/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MATCH_ALIASES = JSON.parse(fs.readFileSync('data/trial-match-aliases.json', 'utf-8'));

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

const records = [];
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
  const slug = f.replace(/\.json$/, '');
  const pack = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf-8'));
  (pack.sources || []).forEach((s, i) => {
    records.push({
      slug, file: `${DIR}/${f}`, index: i,
      pmid: s.pmid ? String(s.pmid).trim() : null,
      doi: s.doi ? String(s.doi).trim() : null,
      title: s.title || '', journal: s.journal || '', year: s.year || '',
    });
  });
}
const ids = [...new Set(records.filter((r) => /^\d{6,9}$/.test(r.pmid || '')).map((r) => r.pmid))];
console.log(`Sources: ${records.length} records across ${new Set(records.map((r) => r.slug)).size} packs · ${ids.length} unique PMIDs`);

// --- PubMed ground truth ---
const meta = {};
let incomplete = false;
for (let i = 0; i < ids.length; i += 150) {
  const b = ids.slice(i, i + 150);
  try {
    const res = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${b.join(',')}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = (await res.json()).result || {};
    for (const id of j.uids || []) {
      if (!j[id] || j[id].error) continue;
      const aid = (j[id].articleids || []).find((a) => a.idtype === 'doi');
      meta[id] = {
        title: j[id].title || '', journal: j[id].fulljournalname || j[id].source || '',
        year: (j[id].pubdate || '').slice(0, 4), doi: aid ? aid.value : null,
        authors: (j[id].authors || []).map((a) => a.name).join('; '),
      };
    }
  } catch (e) { incomplete = true; console.error(`WARN batch ${i / 150 + 1}: ${e.message}`); }
  await sleep(400);
}

const out = [];
for (const r of records) {
  const aliases = [r.slug, r.slug.replace(/-/g, ' '), ...(MATCH_ALIASES[r.slug] || [])]
    .map((s) => s.toLowerCase()).filter((s) => s.length >= 3);
  if (!/^\d{6,9}$/.test(r.pmid || '')) { out.push({ ...r, klass: 'NO_PMID' }); continue; }
  const m = meta[r.pmid];
  if (!m) { out.push({ ...r, klass: incomplete ? 'UNVERIFIED' : 'DEAD' }); continue; }

  const titleSim = sim(r.title, m.title);
  // Topical test on the real paper's own title: does it name the peptide or a known alias?
  const onTopic = aliases.some((a) => m.title.toLowerCase().includes(a));
  const doiOk = r.doi && m.doi ? r.doi.toLowerCase() === m.doi.toLowerCase() : null;

  let klass;
  if (titleSim >= 0.45) klass = doiOk === false ? 'DOI_WRONG' : 'OK';
  else if (onTopic) klass = 'METADATA_WRONG';   // right paper, invented title/journal/year
  else klass = 'UNRELATED';                      // the PMID is not this paper at all

  out.push({ ...r, klass, titleSim: +titleSim.toFixed(2), onTopic, doiOk,
    realTitle: m.title, realJournal: m.journal, realYear: m.year, realDoi: m.doi, realAuthors: m.authors });
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'source-verification.json'), JSON.stringify(out, null, 2));

const counts = out.reduce((a, r) => ((a[r.klass] = (a[r.klass] || 0) + 1), a), {});
console.log('\n=== SOURCE CLASSIFICATION ===');
for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(String(v).padStart(5), k);

const perPack = {};
for (const r of out) (perPack[r.slug] ||= {})[r.klass] = (perPack[r.slug][r.klass] || 0) + 1;
console.log('\n=== PER PACK ===');
for (const [k, v] of Object.entries(perPack)) {
  const bad = (v.UNRELATED || 0) + (v.DEAD || 0);
  const tot = Object.values(v).reduce((x, y) => x + y, 0);
  console.log(`${k.padEnd(14)} ${String(tot).padStart(3)} records  ${JSON.stringify(v)}${bad / tot >= 0.8 ? '   <-- WHOLESALE FABRICATION' : ''}`);
}
if (incomplete) { console.error('\nFAIL: PubMed coverage incomplete.'); process.exit(1); }
console.log(`\nWrote ${OUT_DIR}/source-verification.json`);
