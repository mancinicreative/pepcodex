// Build-time guard: every PMID cited in a peptide dossier must RESOLVE on PubMed.
// Resolves all dossier PMIDs against NCBI esummary in batches. ERROR (exit 1) if any
// PMID returns no record (fabricated/typo'd). Topical-match + retraction checks are a
// separate human/LLM audit (see scripts/audit-citations-verify.mjs); this guard only
// catches the highest-confidence failure: a citation that points to nothing.
//
// Usage: node scripts/qa-pmids.mjs            (warn-only unless --strict)
//        node scripts/qa-pmids.mjs --strict   (exit 1 on any non-resolving PMID)
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const STRICT = process.argv.includes('--strict');
const dir = path.resolve('src/content/peptides');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')) : [];

// Collect { pmid -> Set(files) } from frontmatter citation fields + body.
const pmidFiles = new Map();
const add = (pmid, file) => {
  if (!pmidFiles.has(pmid)) pmidFiles.set(pmid, new Set());
  pmidFiles.get(pmid).add(file);
};

// Walk arbitrary frontmatter, collecting bare-number PMIDs (pmid:, relevantStudies[],
// scoring.citations[]) and "PMID:123" strings. DOIs/URLs are ignored by these patterns.
function walk(node, file) {
  if (node == null) return;
  if (typeof node === 'string') {
    const s = node.trim();
    if (/^\d{6,9}$/.test(s)) add(s, file);
    const m = s.match(/PMID:\s*(\d{6,9})/i);
    if (m) add(m[1], file);
    return;
  }
  if (Array.isArray(node)) return node.forEach((n) => walk(n, file));
  if (typeof node === 'object') return Object.values(node).forEach((n) => walk(n, file));
}

for (const file of files) {
  const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf-8'));
  walk(data, file);
  // Body: PMID:123 and pubmed.ncbi.nlm.nih.gov/123
  for (const m of content.matchAll(/(?:PMID:?\s*|pubmed\.ncbi\.nlm\.nih\.gov\/)(\d{6,9})/gi)) add(m[1], file);
}

const pmids = [...pmidFiles.keys()];
console.log(`PMID guard: ${pmids.length} unique PMIDs across ${files.length} dossiers.`);

async function resolve(batch) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${batch.join(',')}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'PepCodex-qa-pmids/1.0' } });
  if (!res.ok) throw new Error(`esummary HTTP ${res.status}`);
  const json = await res.json();
  const r = json.result || {};
  // A PMID resolves iff it has a result entry with no `error` field.
  return new Set((r.uids || []).filter((id) => r[id] && !r[id].error));
}

const nonResolving = [];
const BATCH = 150;
try {
  for (let i = 0; i < pmids.length; i += BATCH) {
    const batch = pmids.slice(i, i + BATCH);
    const ok = await resolve(batch);
    for (const p of batch) if (!ok.has(p)) nonResolving.push(p);
    await new Promise((r) => setTimeout(r, 400)); // NCBI courtesy delay
  }
} catch (e) {
  console.error(`\nWARN: PMID resolution could not complete (${e.message}). Skipping guard (network).`);
  process.exit(0); // never fail the build on a network/NCBI outage
}

if (nonResolving.length) {
  console.error(`\n${STRICT ? 'FAIL' : 'WARN'}: ${nonResolving.length} PMID(s) do NOT resolve on PubMed:`);
  for (const p of nonResolving.sort()) {
    console.error(`  ✗ ${p}  (in: ${[...pmidFiles.get(p)].join(', ')})`);
  }
  process.exit(STRICT ? 1 : 0);
}
console.log('PASS: every cited PMID resolves on PubMed.');
