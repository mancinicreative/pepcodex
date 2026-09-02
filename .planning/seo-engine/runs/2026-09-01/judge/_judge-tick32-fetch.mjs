/**
 * Judge independent re-fetch for L4-TICK32 (wegovy-vs-zepbound.mdx).
 * Fetches every PMID quoted on the page via the repo's canonical pubmed primitives.
 * Run: node .planning/seo-engine/runs/2026-09-01/judge/_judge-tick32-fetch.mjs
 */
import { fetchRecords } from '../../../../../verification/pubmed.mjs';

const PMIDS = [
  '33567185', // STEP 1
  '35658024', // SURMOUNT-1
  '37952131', // SELECT
  '40353578', // SURMOUNT-5
  '33667417', // STEP 2
  '33625476', // STEP 3
  '33755728', // STEP 4
  '37385275', // SURMOUNT-2
  '37840095', // SURMOUNT-3
  '38078870', // SURMOUNT-4
];

const recs = await fetchRecords(PMIDS);
console.log('FETCH DATE:', new Date().toISOString().slice(0, 10));
console.log('RETURNED IDS:', Object.keys(recs).join(','));
for (const pm of PMIDS) {
  const r = recs[pm];
  if (!r) { console.log(`\n=== PMID ${pm}: NOT RETURNED ===`); continue; }
  console.log(`\n=== PMID ${pm} | ${r.journal} ${r.year} | ${r.ptypes.join('; ')} ===`);
  console.log('TITLE:', r.title);
  console.log('ABSTRACT:', r.blob.replace(/\s+/g, ' ').trim());
}
