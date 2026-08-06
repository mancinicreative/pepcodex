// Weekly integrity loop: flag any cited PMID/DOI that has since been RETRACTED.
// Resolution (qa-pmids) confirms a citation points to a real record; this confirms the record
// wasn't later retracted — resolution alone misses retractions. Source: the Retraction Watch
// dataset (Crossref Labs). Review-queue output, NOT a per-build gate by default (the dataset is
// ~70k rows and changes slowly) — run weekly via the scheduler; --strict makes it build-breaking.
// It only ever FLAGS a citation for human correction; it never edits content.
//
// Usage: node scripts/qa-retractions.mjs            (report + worklist; exit 0)
//        node scripts/qa-retractions.mjs --strict   (exit 1 if any cited source is retracted)
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const STRICT = process.argv.includes('--strict');
const RW_URL = 'https://api.labs.crossref.org/data/retractionwatch?mailto=admin@pepcodex.com';
const dir = path.resolve('src/content/peptides');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')) : [];

// --- collect cited PMIDs + DOIs (file-attributed), mirroring qa-pmids' extraction ---
const pmidFiles = new Map();
const doiFiles = new Map();
const addP = (id, f) => { if (!pmidFiles.has(id)) pmidFiles.set(id, new Set()); pmidFiles.get(id).add(f); };
const addD = (id, f) => { id = id.toLowerCase(); if (!doiFiles.has(id)) doiFiles.set(id, new Set()); doiFiles.get(id).add(f); };

function walk(node, file) {
  if (node == null) return;
  if (typeof node === 'string') {
    const s = node.trim();
    if (/^\d{6,9}$/.test(s)) addP(s, file);
    const pm = s.match(/PMID:\s*(\d{6,9})/i);
    if (pm) addP(pm[1], file);
    const dm = s.match(/^(?:DOI:\s*)?(10\.\d{4,9}\/\S+)$/i);
    if (dm) addD(dm[1], file);
    for (const m of s.matchAll(/(?:doi\.org\/|DOI:\s*)(10\.\d{4,9}\/[^\s"')\]]+)/gi)) addD(m[1], file);
    return;
  }
  if (Array.isArray(node)) return node.forEach((n) => walk(n, file));
  if (typeof node === 'object') return Object.values(node).forEach((n) => walk(n, file));
}

for (const file of files) {
  const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf-8'));
  walk(data, file);
  for (const m of content.matchAll(/(?:PMID:?\s*|pubmed\.ncbi\.nlm\.nih\.gov\/)(\d{6,9})/gi)) addP(m[1], file);
  for (const m of content.matchAll(/(?:doi\.org\/|DOI:\s*)(10\.\d{4,9}\/[^\s"')\]]+)/gi)) addD(m[1], file);
}

console.log(`Retraction watch: checking ${pmidFiles.size} PMIDs + ${doiFiles.size} DOIs against the Retraction Watch dataset.`);

// --- minimal RFC4180 CSV parser (handles quoted fields with embedded commas/newlines/quotes) ---
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

let retractedPmids = new Set();
let retractedDois = new Set();
try {
  const res = await fetch(RW_URL, { headers: { 'User-Agent': 'PepCodex-qa-retractions/1.0 (mailto:admin@pepcodex.com)' } });
  if (!res.ok) throw new Error(`Retraction Watch HTTP ${res.status}`);
  const rows = parseCsv(await res.text());
  const header = rows[0] || [];
  const iDoi = header.indexOf('OriginalPaperDOI');
  const iPmid = header.indexOf('OriginalPaperPubMedID');
  const iNature = header.indexOf('RetractionNature');
  if (iDoi < 0 || iPmid < 0 || iNature < 0) throw new Error('unexpected Retraction Watch columns');
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    // Only true retractions — not Corrections / Expressions of Concern / Reinstatements.
    if (!/^retraction$/i.test((row[iNature] || '').trim())) continue;
    const pmid = (row[iPmid] || '').trim();
    if (pmid && pmid !== '0') retractedPmids.add(pmid);
    const doi = (row[iDoi] || '').trim().toLowerCase();
    if (doi && doi !== '0' && doi !== 'unavailable') retractedDois.add(doi);
  }
} catch (e) {
  console.error(`\nWARN: Retraction Watch check skipped (${e.message}) — dataset unreachable.`);
  process.exit(0); // never fail the build on a dataset/network outage
}

const hits = [];
for (const [pmid, fset] of pmidFiles) if (retractedPmids.has(pmid)) hits.push({ type: 'PMID', id: pmid, files: fset });
for (const [doi, fset] of doiFiles) if (retractedDois.has(doi)) hits.push({ type: 'DOI', id: doi, files: fset });

if (hits.length) {
  console.error(`\n${STRICT ? 'FAIL' : 'WORKLIST'}: ${hits.length} cited source(s) appear RETRACTED — human review/correction needed:`);
  for (const h of hits.sort((a, b) => (a.type + a.id).localeCompare(b.type + b.id))) {
    console.error(`  ✗ ${h.type}:${h.id}  (in: ${[...h.files].join(', ')})`);
  }
  process.exit(STRICT ? 1 : 0);
}
console.log(`PASS: no cited PMID/DOI is in the Retraction Watch retracted set (${retractedPmids.size} retracted PMIDs / ${retractedDois.size} DOIs scanned).`);
