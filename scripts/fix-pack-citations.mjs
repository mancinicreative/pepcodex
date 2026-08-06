/**
 * Resolve and repair every bad citation record found by verify-pack-citations.mjs — anywhere in the
 * pack, including all 34 coreLibrary arrays.
 *
 * PRIMARY METHOD: PubMed's ecitmatch, which resolves journal|year|volume|firstpage|author to a PMID.
 * This exists precisely for matching formatted citations and needs no title, which matters because
 * many stored records have none ("Dhillo WS, et al. J Clin Endocrinol Metab 2005;90(12):6609-6615").
 * An earlier title-containment approach would have deleted 221 records including Dhillo 2005 JCEM,
 * Seminara 2003 NEJM and Frias 2021 NEJM (SURPASS-2) — all real landmark papers. Title matching also
 * silently failed because the per-peptide corpus was capped at 800 while tirzepatide has 2,286
 * indexed papers and kisspeptin 3,824.
 *
 * FALLBACK: title containment against the peptide's PubMed corpus, for citations ecitmatch can't
 * parse. DELETE only when both methods fail — i.e. the citation matches no paper that exists.
 *
 * Dry-run by default; pass --apply to write.
 */
import fs from 'fs';
import path from 'path';

const APPLY = process.argv.includes('--apply');
const OUT_DIR = '.planning/citation-audit';
const UA = { 'User-Agent': 'PepCodex-fixcite/2.0 (mailto:admin@pepcodex.com)' };
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
const contained = (title, citation) => {
  const A = new Set(norm(title)), B = new Set(norm(citation));
  if (A.size < 4 || !B.size) return 0;
  let i = 0; for (const w of A) if (B.has(w)) i++;
  return i / A.size;
};

/** "Frias JP, et al. <Title>. N Engl J Med. 2021;385(6):503-515." -> parts for ecitmatch */
function parseCitation(cit) {
  const s = String(cit || '').replace(/\s+/g, ' ').trim();
  const m = s.match(/((?:19|20)\d{2})\s*;\s*(\d+)\s*(?:\([^)]*\))?\s*:\s*([A-Za-z]?\d+)/);
  if (!m) return null;
  const [full, year, volume, firstPage] = m;
  const before = s.slice(0, s.indexOf(full));
  // journal = last sentence-ish segment before the year
  const seg = before.split(/\.\s+/).map((x) => x.trim()).filter(Boolean);
  let journal = seg[seg.length - 1] || '';
  journal = journal.replace(/[.,;]+$/, '').trim();
  if (!journal || journal.length > 60) return null;
  const a = s.match(/^([A-Z][a-zA-Z'’-]+)\s+([A-Z]{1,3})\b/);
  const author = a ? `${a[1]} ${a[2]}`.toLowerCase() : '';
  if (!author) return null;
  return { journal, year, volume, firstPage: String(firstPage).replace(/^[A-Za-z]/, ''), author };
}

const verified = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'pack-citations.json'), 'utf-8'));
const bad = verified.filter((r) => ['TITLE_MISMATCH', 'DOI_DEAD', 'PMID_DEAD'].includes(r.klass));
console.log(`Repairing ${bad.length} bad citation records`);

// --- pass 1: ecitmatch ---
const parsed = bad.map((r, i) => ({ r, i, p: parseCitation(r.title) }));
const usable = parsed.filter((x) => x.p);
console.log(`  parsed ${usable.length}/${bad.length} citations into structured form`);
const foundPmid = new Map(); // index -> pmid
for (let i = 0; i < usable.length; i += 50) {
  const chunk = usable.slice(i, i + 50);
  const bdata = chunk.map((x) =>
    `${x.p.journal}|${x.p.year}|${x.p.volume}|${x.p.firstPage}|${x.p.author}|ref${x.i}|`
      .replace(/\s/g, '+')).join('%0D');
  try {
    const res = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/ecitmatch.cgi?db=pubmed&retmode=xml&bdata=${bdata}`);
    if (res.ok) {
      for (const line of (await res.text()).split('\n')) {
        const mm = line.trim().match(/\|ref(\d+)\|(\d{6,9})$/);
        if (mm) foundPmid.set(Number(mm[1]), mm[2]);
      }
    }
  } catch (e) { console.error(`  WARN ecitmatch batch ${i / 50 + 1}: ${e.message}`); }
  await sleep(400);
  process.stdout.write(`\r  ecitmatch ${Math.min(i + 50, usable.length)}/${usable.length}`);
}
console.log(`\n  ecitmatch resolved ${foundPmid.size}`);

// --- pass 2: corpus fallback for the rest ---
const unresolved = parsed.filter((x) => !foundPmid.has(x.i));
const fbSlugs = [...new Set(unresolved.map((x) => x.r.slug))];
const corpora = {};
for (const slug of fbSlugs) {
  const aliases = [...new Set([slug.replace(/-/g, ' '), ...(MATCH_ALIASES[slug] || [])])];
  const term = encodeURIComponent(aliases.map((a) => `"${a}"`).join(' OR '));
  let ids = [];
  try {
    const es = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=3000&term=${term}`);
    if (es.ok) ids = ((await es.json()).esearchresult || {}).idlist || [];
  } catch (e) { /* fall through */ }
  await sleep(400);
  const papers = [];
  for (let i = 0; i < ids.length; i += 200) {
    try {
      const su = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.slice(i, i + 200).join(',')}`);
      const j = su.ok ? (await su.json()).result || {} : {};
      for (const id of j.uids || []) {
        if (!j[id] || j[id].error) continue;
        const aid = (j[id].articleids || []).find((a) => a.idtype === 'doi');
        papers.push({ pmid: id, title: j[id].title || '', doi: aid ? aid.value : null });
      }
    } catch (e) { /* partial */ }
    await sleep(350);
  }
  corpora[slug] = papers;
  console.log(`  fallback corpus ${slug.padEnd(15)} ${papers.length}`);
}
for (const x of unresolved) {
  let best = null;
  for (const p of corpora[x.r.slug] || []) {
    const s = contained(p.title, x.r.title);
    if (!best || s > best.score) best = { ...p, score: +s.toFixed(2) };
  }
  if (best && best.score >= 0.75) foundPmid.set(x.i, best.pmid);
}
console.log(`  after fallback: ${foundPmid.size}/${bad.length} resolved`);

// --- fetch truth for every resolved pmid (need the real DOI) ---
const pmids = [...new Set([...foundPmid.values()])];
const truth = {};
for (let i = 0; i < pmids.length; i += 150) {
  try {
    const su = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${pmids.slice(i, i + 150).join(',')}`);
    const j = su.ok ? (await su.json()).result || {} : {};
    for (const id of j.uids || []) if (j[id] && !j[id].error) {
      const aid = (j[id].articleids || []).find((a) => a.idtype === 'doi');
      truth[id] = { pmid: id, doi: aid ? aid.value : null, title: j[id].title || '' };
    }
  } catch (e) { /* */ }
  await sleep(400);
}

// --- decide ---
const decisions = new Map();
let nRepoint = 0, nDelete = 0;
const worklist = [];
for (const x of parsed) {
  const pm = foundPmid.get(x.i);
  const key = `${x.r.file}|${x.r.jsonPath}`;
  if (pm && truth[pm]) { decisions.set(key, { action: 'REPOINT', to: truth[pm] }); nRepoint++; }
  else {
    decisions.set(key, { action: 'DELETE' });
    worklist.push({ slug: x.r.slug, jsonPath: x.r.jsonPath, citation: String(x.r.title).slice(0, 180),
      storedPmid: x.r.pmid, storedDoi: x.r.doi, klass: x.r.klass, parsed: !!x.p });
    nDelete++;
  }
}

// --- apply ---
const TODAY = new Date().toISOString().slice(0, 10);
const perFile = {};
for (const f of fs.readdirSync('data/source-packs').filter((x) => x.endsWith('.json'))) {
  const file = `data/source-packs/${f}`;
  const pack = JSON.parse(fs.readFileSync(file, 'utf-8'));
  let touched = false;
  (function walk(node, p) {
    if (node == null || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((x, i) => walk(x, `${p}[${i}]`));
      const keep = node.filter((x, i) => decisions.get(`${file}|${p}[${i}]`)?.action !== 'DELETE');
      if (keep.length !== node.length) {
        touched = true;
        (perFile[file] ||= {}).DELETE = ((perFile[file] || {}).DELETE || 0) + (node.length - keep.length);
        node.length = 0; node.push(...keep);
      }
      return;
    }
    const d = decisions.get(`${file}|${p}`);
    if (d?.action === 'REPOINT') {
      if (node.pmid !== undefined) node.pmid = d.to.pmid;
      if (typeof node.id === 'string' && /^PMID:?/i.test(node.id)) node.id = `PMID:${d.to.pmid}`;
      if (node.pmid === undefined && node.id === undefined) node.pmid = d.to.pmid;
      if (d.to.doi) node.doi = d.to.doi; else delete node.doi;
      node.verifiedAt = TODAY; node.verifiedAgainst = 'pubmed/ecitmatch';
      touched = true;
      (perFile[file] ||= {}).REPOINT = ((perFile[file] || {}).REPOINT || 0) + 1;
    }
    Object.entries(node).forEach(([k, v]) => walk(v, `${p}.${k}`));
  })(pack, '');
  if (touched && APPLY) fs.writeFileSync(file, JSON.stringify(pack, null, 2) + '\n');
}

console.log(`\n${APPLY ? 'APPLIED' : 'DRY RUN'} — repointed ${nRepoint} · deleted ${nDelete}`);
console.log('\nper pack:');
for (const [f, c] of Object.entries(perFile)) console.log(`  ${path.basename(f).padEnd(20)} ${JSON.stringify(c)}`);
if (APPLY) {
  fs.writeFileSync(path.join(OUT_DIR, 'corelibrary-to-recite.json'), JSON.stringify(worklist, null, 2));
  console.log(`\nWrote ${OUT_DIR}/corelibrary-to-recite.json (${worklist.length} removed)`);
}
if (!APPLY) console.log('\nNo files written. Re-run with --apply.');
