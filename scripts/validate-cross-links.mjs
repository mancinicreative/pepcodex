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

// Severity levels:
//   'error'   — structural integrity issue (comparison refs to missing peptides) → exit 1
//   'warning' — content quality issue (blog/glossary refs to missing slugs) → reported, exit 0
//   'info'    — expected by design (comparators referencing non-peptide drugs) → only shown with --verbose
const validationRules = [
  // ERRORS: structural — these break page generation or core navigation
  { collection: 'comparisons', field: 'peptideA', target: 'peptides', type: 'scalar', severity: 'error' },
  { collection: 'comparisons', field: 'peptideB', target: 'peptides', type: 'scalar', severity: 'error' },
  { collection: 'safety', field: 'peptides', target: 'peptides', type: 'array', severity: 'error' },
  { collection: 'protocols', field: 'peptides', target: 'peptides', type: 'array', severity: 'error' },
  { collection: 'conditions', field: 'relatedConditions', target: 'conditions', type: 'array', severity: 'error' },

  // WARNINGS: content quality — broken cross-links reduce discoverability but pages still render
  { collection: 'blog', field: 'relatedPeptides', target: 'peptides', type: 'array', severity: 'warning' },
  { collection: 'blog', field: 'relatedGlossary', target: 'glossary', type: 'array', severity: 'warning' },
  { collection: 'glossary', field: 'relatedPeptides', target: 'peptides', type: 'array', severity: 'warning' },
  { collection: 'glossary', field: 'relatedTerms', target: 'glossary', type: 'array', severity: 'warning' },
  { collection: 'peptides', field: 'relatedTerms', target: 'glossary', type: 'array', severity: 'warning' },
  { collection: 'peptides', field: 'interactions', target: 'peptides', type: 'nested', subfield: 'peptide', severity: 'warning' },

  // INFO: expected by design — comparators intentionally reference non-peptide drugs, guide relatedTerms use display strings
  { collection: 'peptides', field: 'comparators', target: 'peptides', type: 'array', severity: 'info' },
  { collection: 'guides', field: 'relatedTerms', target: 'glossary', type: 'array', severity: 'info' },
];

const verbose = process.argv.includes('--verbose');
const strict = process.argv.includes('--strict');

const counts = { error: 0, warning: 0, info: 0 };
let totalChecked = 0;
const issues = { error: [], warning: [], info: [] };

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

    if (rule.type === 'scalar') {
      const val = data[rule.field];
      if (val) slugsToCheck = [val];
    } else if (rule.type === 'array') {
      slugsToCheck = data[rule.field] || [];
    } else if (rule.type === 'nested' && rule.subfield) {
      const items = data[rule.field] || [];
      slugsToCheck = items.map(item => item[rule.subfield]).filter(Boolean);
    }

    for (const slug of slugsToCheck) {
      totalChecked++;
      if (!targetSlugs.has(slug)) {
        counts[rule.severity]++;
        issues[rule.severity].push(
          `${rule.collection}/${file} -> ${rule.field}: "${slug}" not found in ${rule.target}`
        );
      }
    }
  }
}

// Print errors always
if (counts.error > 0) {
  console.log(`ERRORS (${counts.error}) — structural issues that need fixing:`);
  for (const issue of issues.error) {
    console.error(`  ✗ ${issue}`);
  }
  console.log('');
}

// Print warnings always
if (counts.warning > 0) {
  console.log(`WARNINGS (${counts.warning}) — content quality (missing cross-links):`);
  for (const issue of issues.warning) {
    console.warn(`  ⚠ ${issue}`);
  }
  console.log('');
}

// Print info only with --verbose
if (counts.info > 0) {
  if (verbose) {
    console.log(`INFO (${counts.info}) — expected by design (external drug comparators, display strings):`);
    for (const issue of issues.info) {
      console.log(`  ○ ${issue}`);
    }
    console.log('');
  } else {
    console.log(`INFO: ${counts.info} expected non-matching refs (comparators, guide terms) — use --verbose to see`);
    console.log('');
  }
}

// Summary
console.log(`Validation complete:`);
console.log(`  References checked: ${totalChecked}`);
console.log(`  Errors:   ${counts.error}`);
console.log(`  Warnings: ${counts.warning}`);
console.log(`  Info:     ${counts.info}`);

// Exit code: fail only on errors (or warnings in --strict mode)
if (counts.error > 0) {
  console.error(`\nFAIL: ${counts.error} structural error(s) found`);
  process.exit(1);
} else if (strict && counts.warning > 0) {
  console.error(`\nFAIL (--strict): ${counts.warning} warning(s) found`);
  process.exit(1);
} else {
  console.log('\nPASS: No structural errors');
  if (counts.warning > 0) {
    console.log(`  (${counts.warning} warnings — content quality improvements available)`);
  }
}
