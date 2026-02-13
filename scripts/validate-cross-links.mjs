import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Build slug sets from each collection directory
function getSlugs(dir) {
  const fullDir = path.resolve(dir);
  if (!fs.existsSync(fullDir)) return new Set();
  return new Set(
    fs.readdirSync(fullDir)
      .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
      .map(f => f.replace(/\.(mdx?|md)$/, ''))
  );
}

const collections = {
  peptides: getSlugs('src/content/peptides'),
  glossary: getSlugs('src/content/glossary'),
  comparisons: getSlugs('src/content/comparisons'),
  blog: getSlugs('src/content/blog'),
  guides: getSlugs('src/content/guides'),
  safety: getSlugs('src/content/safety'),
  protocols: getSlugs('src/content/protocols'),
  conditions: getSlugs('src/content/conditions'),
};

console.log('Collection sizes:');
for (const [name, slugs] of Object.entries(collections)) {
  console.log(`  ${name}: ${slugs.size} items`);
}
console.log('');

// Validation rules: which fields in which collections reference which target collections
const validationRules = [
  { collection: 'peptides', field: 'comparators', target: 'peptides', type: 'array' },
  { collection: 'peptides', field: 'relatedTerms', target: 'glossary', type: 'array' },
  { collection: 'peptides', field: 'interactions', target: 'peptides', type: 'nested', subfield: 'peptide' },
  { collection: 'blog', field: 'relatedPeptides', target: 'peptides', type: 'array' },
  { collection: 'blog', field: 'relatedGlossary', target: 'glossary', type: 'array' },
  { collection: 'glossary', field: 'relatedPeptides', target: 'peptides', type: 'array' },
  { collection: 'glossary', field: 'relatedTerms', target: 'glossary', type: 'array' },
  { collection: 'guides', field: 'relatedTerms', target: 'glossary', type: 'array' },
  { collection: 'safety', field: 'peptides', target: 'peptides', type: 'array' },
  { collection: 'protocols', field: 'peptides', target: 'peptides', type: 'array' },
  { collection: 'conditions', field: 'relatedConditions', target: 'conditions', type: 'array' },
];

let totalErrors = 0;
let totalChecked = 0;

for (const rule of validationRules) {
  const dir = path.resolve(`src/content/${rule.collection}`);
  if (!fs.existsSync(dir)) continue;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));
  const targetSlugs = collections[rule.target];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);

    let slugsToCheck = [];

    if (rule.type === 'array') {
      slugsToCheck = data[rule.field] || [];
    } else if (rule.type === 'nested' && rule.subfield) {
      const items = data[rule.field] || [];
      slugsToCheck = items.map(item => item[rule.subfield]).filter(Boolean);
    }

    for (const slug of slugsToCheck) {
      totalChecked++;
      if (!targetSlugs.has(slug)) {
        totalErrors++;
        console.error(`  X ${rule.collection}/${file} -> ${rule.field}: "${slug}" not found in ${rule.target}`);
      }
    }
  }
}

console.log(`\nValidation complete:`);
console.log(`  References checked: ${totalChecked}`);
console.log(`  Broken references: ${totalErrors}`);

if (totalErrors > 0) {
  console.error(`\nFound ${totalErrors} broken cross-link reference(s)`);
  process.exit(1);
} else {
  console.log('\nAll cross-link references valid');
}
