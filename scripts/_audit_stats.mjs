import fs from 'fs';
const d = JSON.parse(fs.readFileSync('.planning/citation-audit/extract.json', 'utf8'));
console.log('CANONICAL FILES:', d.files);
console.log('TOTAL OCCURRENCES:', d.records.length);
console.log('UNIQUE PMIDS (all):', d.allPmids.length);
console.log('UNIQUE PMIDS (non-scoring target):', d.targetPmids.length);
const nonScoring = d.records.filter(r => !r.inScoring);
console.log('NON-SCORING OCCURRENCES:', nonScoring.length);
console.log('IN-SCORING OCCURRENCES:', d.records.length - nonScoring.length);
// malformed pmids (not 8-digit-ish, or suspicious)
const bad = d.records.filter(r => !/^\d{7,8}$/.test(r.pmid));
console.log('SHORT/ODD PMIDS (<7 digits):', [...new Set(bad.map(r=>r.pmid))].slice(0,40).join(', '));
