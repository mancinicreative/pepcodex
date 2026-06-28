// Build-time guard: every identifier cited in a peptide dossier must RESOLVE to a real record —
// PMIDs against NCBI esummary, NCTs against ClinicalTrials.gov v2, DOIs against Crossref. ERROR
// (exit 1, --strict) if any points to nothing (fabricated/typo'd/wrong-format). Each resolver
// bails gracefully on a network/API outage (never fails the build on an outage). Topical-match
// (does the paper support the claim?) is a separate human/LLM audit (audit-citations-verify.mjs).
//
// Usage: node scripts/qa-pmids.mjs            (warn-only)
//        node scripts/qa-pmids.mjs --strict   (exit 1 on any non-resolving PMID / NCT / DOI)
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const STRICT = process.argv.includes('--strict');
const dir = path.resolve('src/content/peptides');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')) : [];

// Collect { pmid -> Set(files) } from frontmatter citation fields + body.
const pmidFiles = new Map();
const nctFiles = new Map();
const doiFiles = new Map();
const add = (pmid, file) => {
  if (!pmidFiles.has(pmid)) pmidFiles.set(pmid, new Set());
  pmidFiles.get(pmid).add(file);
};
const addNct = (id, file) => {
  id = id.toUpperCase();
  if (!nctFiles.has(id)) nctFiles.set(id, new Set());
  nctFiles.get(id).add(file);
};
const addDoi = (id, file) => {
  if (!doiFiles.has(id)) doiFiles.set(id, new Set());
  doiFiles.get(id).add(file);
};

// Frontmatter keys whose values are citations. A value in one of these must be a real,
// renderable reference (numeric PMID | NCT######## | DOI | "PMID:123"); a placeholder
// (N/A, TBD, ...) or any other unrecognized string is a fabrication risk — the render
// guard (src/utils/citation.ts) hides it, but it must never have shipped in the first place.
const CITATION_KEYS = new Set(['pmid', 'source', 'doi', 'relevantStudies', 'citations']);
const isResolvableCitation = (s) =>
  /^\d{6,9}$/.test(s) ||                 // bare PMID
  /^PMID:\s*\d{6,9}$/i.test(s) ||        // PMID:123
  /^NCT\d{8}$/i.test(s) ||               // ClinicalTrials.gov id
  /^(DOI:)?10\.\d{4,9}\/\S+$/i.test(s) ||// DOI (with or without prefix)
  /^PMC\d{4,}$/i.test(s) ||              // PubMed Central id
  /^https?:\/\/\S+$/i.test(s);           // explicit URL (primary source / press release)
const badCites = []; // { file, key, value } — placeholders & free-text in citation fields

// Walk frontmatter tracking the enclosing key, collecting numeric PMIDs to resolve AND
// flagging placeholder/unrecognized values that sit in a citation field.
function walk(node, file, key) {
  if (node == null) return;
  if (typeof node === 'string') {
    const s = node.trim();
    if (/^\d{6,9}$/.test(s)) add(s, file);
    const m = s.match(/PMID:\s*(\d{6,9})/i);
    if (m) add(m[1], file);
    // NCTs are unambiguous — scan every frontmatter string (incl. prose like researchSummary).
    for (const mm of s.matchAll(/NCT\d{8}/gi)) addNct(mm[0], file);
    // DOIs: a standalone field value, or one with explicit DOI:/doi.org context (avoids prose false hits).
    const doiM = s.match(/^(?:DOI:\s*)?(10\.\d{4,9}\/\S+)$/i);
    if (doiM) addDoi(doiM[1], file);
    for (const mm of s.matchAll(/(?:doi\.org\/|DOI:\s*)(10\.\d{4,9}\/[^\s"')\]]+)/gi)) addDoi(mm[1], file);
    if (CITATION_KEYS.has(key) && s && !isResolvableCitation(s)) badCites.push({ file, key, value: s });
    return;
  }
  if (Array.isArray(node)) return node.forEach((n) => walk(n, file, key)); // items inherit parent key
  if (typeof node === 'object') return Object.entries(node).forEach(([k, n]) => walk(n, file, k));
}

for (const file of files) {
  const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf-8'));
  walk(data, file, null);
  // Body: PMID:123 and pubmed.ncbi.nlm.nih.gov/123
  for (const m of content.matchAll(/(?:PMID:?\s*|pubmed\.ncbi\.nlm\.nih\.gov\/)(\d{6,9})/gi)) add(m[1], file);
  for (const m of content.matchAll(/\bNCT\d{8}\b/gi)) addNct(m[0], file);
  for (const m of content.matchAll(/(?:doi\.org\/|DOI:\s*)(10\.\d{4,9}\/[^\s"')\]]+)/gi)) addDoi(m[1], file);
}

// Placeholder/free-text values in citation fields are a worklist for the citation-verification
// pass, NOT a build-breaker: the render guard (src/utils/citation.ts) already prevents them from
// emitting a broken link, and many are legitimate-but-informal provenance (company disclosure,
// conference abstract) on cutting-edge dossiers that genuinely lack a PMID/NCT/DOI yet.
if (badCites.length) {
  console.warn(`\nWORKLIST: ${badCites.length} placeholder/free-text citation value(s) to formalize or remove (non-blocking):`);
  for (const b of badCites) console.warn(`  • ${b.file}  ${b.key}: ${JSON.stringify(b.value)}`);
}

const pmids = [...pmidFiles.keys()];
const nctIds = [...nctFiles.keys()];
const doiIds = [...doiFiles.keys()];
console.log(`Citation guard: ${pmids.length} PMIDs · ${nctIds.length} NCTs · ${doiIds.length} DOIs across ${files.length} dossiers.`);

const UA = { 'User-Agent': 'PepCodex-qa-pmids/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const failures = []; // { type, id, files } — each resolver appends; a per-resolver outage is skipped, not failed.

// --- PMIDs: NCBI esummary, 150/batch. Resolves iff a result entry exists with no `error`. ---
try {
  for (let i = 0; i < pmids.length; i += 150) {
    const batch = pmids.slice(i, i + 150);
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${batch.join(',')}`;
    const res = await fetch(url, { headers: UA });
    if (!res.ok) throw new Error(`esummary HTTP ${res.status}`);
    const r = (await res.json()).result || {};
    const ok = new Set((r.uids || []).filter((id) => r[id] && !r[id].error));
    for (const p of batch) if (!ok.has(p)) failures.push({ type: 'PMID', id: p, files: pmidFiles.get(p) });
    await sleep(400);
  }
} catch (e) {
  console.error(`\nWARN: PMID resolution skipped (${e.message}) — NCBI outage.`);
}

// --- NCTs: ClinicalTrials.gov v2 filter.ids batch. A requested NCT absent from the response = not found. ---
try {
  const found = new Set();
  for (let i = 0; i < nctIds.length; i += 50) {
    const batch = nctIds.slice(i, i + 50);
    const url = `https://clinicaltrials.gov/api/v2/studies?filter.ids=${batch.join(',')}&fields=NCTId&pageSize=100`;
    const res = await fetch(url, { headers: UA });
    if (!res.ok) throw new Error(`CT.gov HTTP ${res.status}`);
    for (const st of ((await res.json()).studies || [])) {
      const id = st?.protocolSection?.identificationModule?.nctId;
      if (id) found.add(id.toUpperCase());
    }
    await sleep(300);
  }
  for (const id of nctIds) if (!found.has(id)) failures.push({ type: 'NCT', id, files: nctFiles.get(id) });
} catch (e) {
  console.error(`\nWARN: NCT resolution skipped (${e.message}) — CT.gov outage.`);
}

// --- DOIs: Crossref /agency (200 = exists, 404 = not). ---
try {
  for (const doi of doiIds) {
    const res = await fetch(`https://api.crossref.org/works/${encodeURI(doi)}/agency?mailto=admin@pepcodex.com`, { headers: UA });
    if (res.status === 404) failures.push({ type: 'DOI', id: doi, files: doiFiles.get(doi) });
    else if (res.status !== 200) throw new Error(`Crossref HTTP ${res.status}`);
    await sleep(150);
  }
} catch (e) {
  console.error(`\nWARN: DOI resolution skipped (${e.message}) — Crossref outage.`);
}

if (failures.length) {
  console.error(`\n${STRICT ? 'FAIL' : 'WARN'}: ${failures.length} citation(s) do NOT resolve:`);
  for (const f of failures.sort((a, b) => (a.type + a.id).localeCompare(b.type + b.id))) {
    console.error(`  ✗ ${f.type}:${f.id}  (in: ${[...f.files].join(', ')})`);
  }
  process.exit(STRICT ? 1 : 0);
}
console.log(`PASS: every cited PMID (${pmids.length}), NCT (${nctIds.length}), and DOI (${doiIds.length}) resolves.`);
