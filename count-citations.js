const fs = require('fs');
const path = require('path');

const sourcePackDir = './data/source-packs';
const files = fs.readdirSync(sourcePackDir).filter(f => f.endsWith('.json'));

let totalCitations = 0;
let results = [];

function countCitations(obj, depth = 0) {
  let count = 0;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (item && typeof item === 'object') {
        // Count items that look like citations (have 'citation' or 'id' with PMID/DOI/NCT)
        if (item.citation || (item.id && (item.id.includes('PMID') || item.id.includes('NCT') || item.id.includes('PMC')))) {
          count++;
        } else {
          count += countCitations(item, depth + 1);
        }
      }
    }
  } else if (obj && typeof obj === 'object') {
    const skipKeys = ['metadata', 'evidenceSummary', 'studyQualityRubric', 'searchStrategy', 'paywallMap', 'gapsAndNextResearch', 'appliedRubricScores', 'regulatoryStatus'];
    for (const key of Object.keys(obj)) {
      if (!skipKeys.includes(key)) {
        count += countCitations(obj[key], depth + 1);
      }
    }
  }
  return count;
}

for (const file of files) {
  const filePath = path.join(sourcePackDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const peptide = data.peptide || file.replace('.json', '');
  const citations = countCitations(data);
  results.push({ peptide, citations, claimedTotal: data.metadata?.totalSources || 'N/A' });
  totalCitations += citations;
}

// Sort by citation count descending
results.sort((a, b) => b.citations - a.citations);

console.log('PEPTIDE              | ACTUAL | CLAIMED');
console.log('---------------------|--------|--------');
for (const r of results) {
  console.log(`${r.peptide.padEnd(20)} | ${String(r.citations).padStart(6)} | ${String(r.claimedTotal).padStart(6)}`);
}
console.log('---------------------|--------|--------');
console.log(`${'TOTAL'.padEnd(20)} | ${String(totalCitations).padStart(6)} |`);
