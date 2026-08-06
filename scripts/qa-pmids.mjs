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

// EVERY surface that can carry a citation. This script previously hardcoded src/content/peptides,
// so data/source-packs (which RENDERS via DossierLayout + /trials) and src/content/blog were never
// verified once — more identifiers lived outside the gate than inside it, which is exactly where
// the 2026-07-24 fabrication audit found 253 of its 265 findings.
//
// DELIBERATELY NOT AN ENUMERATED LIST. Enumerating collections is the bug that caused this: the
// site has 12 content collections and any hand-maintained list drifts the moment someone adds a
// 13th. We walk all of src/content/** instead, so a new collection is covered the day it appears.
const SURFACES = [
  { dir: 'src/content', ext: /\.mdx?$/ },
  { dir: 'data/source-packs', ext: /\.json$/ },
];

// Recursive so a nested collection (e.g. blog/2026/) can never silently escape the gate.
function walkDir(abs, ext, out = []) {
  if (!fs.existsSync(abs)) return out;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const p = path.join(abs, e.name);
    if (e.isDirectory()) walkDir(p, ext, out);
    else if (ext.test(e.name)) out.push(p);
  }
  return out;
}

// unit = { file (repo-relative label), data (frontmatter|parsed JSON), content (MDX body|'') }
const units = [];
for (const s of SURFACES) {
  for (const abs of walkDir(path.resolve(s.dir), s.ext)) {
    const label = path.relative(process.cwd(), abs).replace(/\\/g, '/');
    const raw = fs.readFileSync(abs, 'utf-8');
    if (abs.endsWith('.json')) {
      try {
        units.push({ file: label, data: JSON.parse(raw), content: '' });
      } catch (e) {
        console.error(`FAIL: ${label} is not valid JSON (${e.message})`);
        process.exit(1);
      }
    } else {
      const { data, content } = matter(raw);
      units.push({ file: label, data, content });
    }
  }
}

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
// DOI suffixes legitimately contain parentheses — Elsevier/Lancet ids look like
// 10.1016/S0140-6736(21)01324-6, and 47 such DOIs are cited here. A regex that stops at ")"
// silently truncates them into ids that resolve to nothing, so the gate then reports a real
// citation as fabricated. Capture through parens, then drop only UNBALANCED trailing ones, which
// is what prose like "(see 10.1234/abc)" produces.
const trimDoi = (s) => {
  let d = String(s).replace(/[.,;]+$/, '');
  while (d.endsWith(')') && (d.match(/\(/g) || []).length < (d.match(/\)/g) || []).length) d = d.slice(0, -1);
  return d;
};
const addDoi = (id, file) => {
  id = trimDoi(id);
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
    for (const mm of s.matchAll(/(?:doi\.org\/|DOI:\s*)(10\.\d{4,9}\/[^\s"'\]]+)/gi)) addDoi(mm[1], file);
    if (CITATION_KEYS.has(key) && s && !isResolvableCitation(s)) badCites.push({ file, key, value: s });
    return;
  }
  if (Array.isArray(node)) return node.forEach((n) => walk(n, file, key)); // items inherit parent key
  if (typeof node === 'object') return Object.entries(node).forEach(([k, n]) => walk(n, file, k));
}

for (const { file, data, content } of units) {
  walk(data, file, null);
  // Body: PMID:123 and pubmed.ncbi.nlm.nih.gov/123
  for (const m of content.matchAll(/(?:PMID:?\s*|pubmed\.ncbi\.nlm\.nih\.gov\/)(\d{6,9})/gi)) add(m[1], file);
  for (const m of content.matchAll(/\bNCT\d{8}\b/gi)) addNct(m[0], file);
  for (const m of content.matchAll(/(?:doi\.org\/|DOI:\s*)(10\.\d{4,9}\/[^\s"'\]]+)/gi)) addDoi(m[1], file);
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
console.log(`Citation guard: ${pmids.length} PMIDs · ${nctIds.length} NCTs · ${doiIds.length} DOIs across ${units.length} files (${SURFACES.map((s) => s.dir).join(', ')}).`);

const UA = { 'User-Agent': 'PepCodex-qa-pmids/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Every external call is abort-bounded so a slow/blocked API can NEVER hang a build —
// a timeout throws, which each resolver catches and treats as a graceful outage (skips, never fails).
async function fetchT(url, opts = {}, ms = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}
const failures = []; // { type, id, files }
// Coverage tracking. A resolver that throws part-way has NOT verified its class — recording
// failures inside the try would skip that step and let the script print PASS on zero findings,
// i.e. the gate silently degrades to a no-op under exactly the rate-limit load a big sweep
// creates. Coverage is therefore tracked explicitly and the gate FAILS CLOSED on incomplete
// verification (escape hatch: ALLOW_INCOMPLETE_CITATION_CHECK=1 for an emergency deploy).
const incomplete = []; // class names whose verification did not complete

// --- PMIDs: NCBI esummary, 150/batch. Resolves iff a result entry exists with no `error`. ---
let pmidResolved = null; // null => verification did not complete
try {
  const resolved = new Set();
  for (let i = 0; i < pmids.length; i += 150) {
    const batch = pmids.slice(i, i + 150);
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${batch.join(',')}`;
    const res = await fetchT(url, { headers: UA });
    if (!res.ok) throw new Error(`esummary HTTP ${res.status}`);
    const r = (await res.json()).result || {};
    for (const id of (r.uids || [])) if (r[id] && !r[id].error) resolved.add(id);
    await sleep(400);
  }
  pmidResolved = resolved;
} catch (e) {
  incomplete.push('PMID');
  console.error(`\nWARN: PMID verification INCOMPLETE (${e.message}) — NCBI unreachable.`);
}
if (pmidResolved) for (const p of pmids) if (!pmidResolved.has(p)) failures.push({ type: 'PMID', id: p, files: pmidFiles.get(p) });

// --- NCTs: ClinicalTrials.gov v2 filter.ids batch. A requested NCT absent from the response = not found. ---
let nctFound = null; // null => verification did not complete
try {
  const found = new Set();
  for (let i = 0; i < nctIds.length; i += 50) {
    const batch = nctIds.slice(i, i + 50);
    const url = `https://clinicaltrials.gov/api/v2/studies?filter.ids=${batch.join(',')}&fields=NCTId&pageSize=100`;
    const res = await fetchT(url, { headers: UA });
    if (!res.ok) throw new Error(`CT.gov HTTP ${res.status}`);
    for (const st of ((await res.json()).studies || [])) {
      const id = st?.protocolSection?.identificationModule?.nctId;
      if (id) found.add(id.toUpperCase());
    }
    await sleep(300);
  }
  nctFound = found;
} catch (e) {
  incomplete.push('NCT');
  console.error(`\nWARN: NCT verification INCOMPLETE (${e.message}) — CT.gov unreachable.`);
}
if (nctFound) for (const id of nctIds) if (!nctFound.has(id)) failures.push({ type: 'NCT', id, files: nctFiles.get(id) });

// --- DOIs: Crossref /agency (200 = exists, 404 = not). ---
let doiBad = null; // null => verification did not complete
try {
  const bad = [];
  for (const doi of doiIds) {
    const res = await fetchT(`https://api.crossref.org/works/${encodeURI(doi)}/agency?mailto=admin@pepcodex.com`, { headers: UA });
    if (res.status === 404) bad.push(doi);
    else if (res.status !== 200) throw new Error(`Crossref HTTP ${res.status}`);
    await sleep(150);
  }
  doiBad = bad;
} catch (e) {
  incomplete.push('DOI');
  console.error(`\nWARN: DOI verification INCOMPLETE (${e.message}) — Crossref unreachable.`);
}
if (doiBad) for (const doi of doiBad) failures.push({ type: 'DOI', id: doi, files: doiFiles.get(doi) });

if (failures.length) {
  console.error(`\n${STRICT ? 'FAIL' : 'WARN'}: ${failures.length} citation(s) do NOT resolve:`);
  for (const f of failures.sort((a, b) => (a.type + a.id).localeCompare(b.type + b.id))) {
    console.error(`  ✗ ${f.type}:${f.id}  (in: ${[...f.files].join(', ')})`);
  }
  process.exit(STRICT ? 1 : 0);
}

// FAIL CLOSED on incomplete verification. "No failures found" is only meaningful if every class
// was actually checked — otherwise an outage/rate-limit would print PASS while verifying nothing.
if (incomplete.length) {
  const escape = process.env.ALLOW_INCOMPLETE_CITATION_CHECK === '1';
  console.error(`\n${escape ? 'WARN' : 'FAIL'}: citation verification INCOMPLETE for: ${incomplete.join(', ')}.`);
  console.error('  No failures were found in the classes that DID complete, but coverage is partial —');
  console.error('  this is NOT a pass. Re-run when the API is reachable, or set');
  console.error('  ALLOW_INCOMPLETE_CITATION_CHECK=1 to deploy anyway (emergency only).');
  if (STRICT && !escape) process.exit(1);
  process.exit(0);
}

console.log(`PASS: every cited PMID (${pmids.length}), NCT (${nctIds.length}), and DOI (${doiIds.length}) resolves.`);
