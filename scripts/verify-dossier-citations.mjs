/**
 * Verify every PMID cited in a dossier's frontmatter against PubMed — not just that it resolves,
 * but that the paper it points to is the one the dossier says it is.
 *
 * Dossiers store citations as `{study: "Sorli C et al. 2017 (SUSTAIN 1)", finding: "...", pmid}`.
 * The `study` field is an author+year label, so it can be checked without a stored title.
 *
 * MATCHING NOTES (each of these produced false accusations in a first pass):
 *   - fold diacritics: stored "Jette L" vs PubMed "Jetté L", "Pyorala S" vs "Pyörälä S".
 *   - the `study` field is not always an author: it may be a journal ("Nature Communications 2025"),
 *     a descriptive label ("Multicenter pediatric study 2018"), or a consortium ("... Study Group").
 *     Only apply the author test when the field actually looks like a surname + initials.
 *   - collective authors: PubMed lists "International Recombinant Human Chorionic Gonadotropin
 *     Study Group" as the author, which will never match a person-shaped label.
 * Anything that fails BOTH author and year is reported for human review, not auto-changed.
 *
 * Usage: node scripts/verify-dossier-citations.mjs [--strict]
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const STRICT = process.argv.includes('--strict');
const DIR = 'src/content/peptides';
const OUT = '.planning/citation-audit';
const UA = { 'User-Agent': 'PepCodex-dossiercite/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function fetchT(url, ms = 25000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: UA, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}
// NFD strips combining accents (Jetté -> Jette) but does NOT decompose standalone letters like
// ø, æ, ß, ł — so "Vilsbøll" would never match a stored "Vilsboll". Transliterate those explicitly.
const fold = (s) => String(s || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/ø/gi, 'o').replace(/æ/gi, 'ae').replace(/œ/gi, 'oe')
  .replace(/ß/g, 'ss').replace(/đ/gi, 'd').replace(/ł/gi, 'l').replace(/ð/gi, 'd').replace(/þ/gi, 'th')
  .toLowerCase();

const records = [];
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.mdx'))) {
  const d = matter(fs.readFileSync(path.join(DIR, f), 'utf-8')).data;
  (function walk(n) {
    if (n == null || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(walk);
    if (n.pmid && /^\d{6,9}$/.test(String(n.pmid)) && (n.study || n.finding)) {
      records.push({ file: f, pmid: String(n.pmid), study: n.study || '', finding: String(n.finding || '').slice(0, 110) });
    }
    Object.values(n).forEach(walk);
  })(d);
}
const ids = [...new Set(records.map((r) => r.pmid))];
console.log(`Dossier citations: ${records.length} records · ${ids.length} unique PMIDs across ${new Set(records.map((r) => r.file)).size} dossiers`);

const meta = {};
let incomplete = false;
for (let i = 0; i < ids.length; i += 150) {
  try {
    const res = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.slice(i, i + 150).join(',')}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = (await res.json()).result || {};
    for (const id of j.uids || []) if (j[id] && !j[id].error) {
      meta[id] = { title: j[id].title || '', year: (j[id].pubdate || '').slice(0, 4),
        authors: (j[id].authors || []).map((a) => a.name).join('; '),
        journal: j[id].fulljournalname || j[id].source || '' };
    }
  } catch (e) { incomplete = true; console.error(`WARN batch ${i / 150 + 1}: ${e.message}`); }
  await sleep(400);
}

// Does the label look like a person? "Sorli C", "Jetté L", "de Roux N" — surname + initials.
const looksLikeAuthor = (s) => /^[A-Z][a-zA-Z'’\-]+(\s+[a-z]{2,3})?\s+[A-Z]{1,3}\b/.test(String(s).trim());

let ok = 0, dead = 0;
const suspects = [];
for (const r of records) {
  const m = meta[r.pmid];
  if (!m) { dead++; suspects.push({ ...r, why: 'PMID does not resolve' }); continue; }
  // A year must be a standalone token. Without the lookarounds, "TAK-861-2001" (a trial protocol
  // code) yields "2001" and every oveporexton citation is falsely accused of a 24-year error.
  const storedYear = (r.study.match(/(?<![-\d/])((?:19|20)\d{2})(?![-\d/])/) || [])[0];
  const yearOk = !storedYear || !m.year || Math.abs(Number(storedYear) - Number(m.year)) <= 1;
  let authorOk = true;
  if (looksLikeAuthor(r.study)) {
    const surname = (r.study.match(/^([A-Z][a-zA-Z'’\-]+)/) || [])[1] || '';
    authorOk = surname.length >= 2 && fold(m.authors).includes(fold(surname)); // >=2: Ng, El, Lu, Wu are real surnames
  }
  if (authorOk && yearOk) ok++;
  else suspects.push({ ...r, why: !authorOk && !yearOk ? 'author AND year disagree' : !authorOk ? 'author disagrees' : 'year disagrees',
    realFirstAuthor: (m.authors.split(';')[0] || '').trim(), realYear: m.year, realTitle: m.title, realJournal: m.journal });
}

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'dossier-citation-suspects.json'), JSON.stringify(suspects, null, 2));
console.log(`\nRESULT  ok=${ok}  suspect=${suspects.length}  dead=${dead}`);
if (suspects.length) {
  const per = {}; for (const s of suspects) per[s.file] = (per[s.file] || 0) + 1;
  console.log('\nper dossier:');
  Object.entries(per).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(3)} ${k}`));
  console.log('\ndetail:');
  for (const s of suspects.slice(0, 30)) {
    console.log(`\n  ${s.file} PMID ${s.pmid} — ${s.why}`);
    console.log(`    stored : ${s.study}`);
    console.log(`    real   : ${s.realFirstAuthor || '?'} (${s.realYear || '?'}) — ${String(s.realTitle || '').slice(0, 95)}`);
  }
}
if (incomplete) { console.error('\nFAIL: PubMed coverage incomplete.'); process.exit(1); }
console.log(`\nWrote ${OUT}/dossier-citation-suspects.json`);
process.exit(STRICT && (suspects.length || dead) ? 1 : 0);
