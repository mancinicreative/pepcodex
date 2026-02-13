import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.resolve('src/content/blog');
const mapping = {
  'known': 'high',
  'suggestive': 'moderate',
  'early': 'low',
  'unknown': 'very-low',
};

// Pre-migration manifest
const manifest = { known: 0, suggestive: 0, early: 0, unknown: 0, none: 0, total: 0 };
const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

console.log(`Found ${files.length} blog files`);
console.log('\n--- PRE-MIGRATION MANIFEST ---');

// Count current values
for (const file of files) {
  manifest.total++;
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
  const { data } = matter(raw);
  if (data.evidenceLevel && mapping[data.evidenceLevel]) {
    manifest[data.evidenceLevel]++;
  } else if (!data.evidenceLevel) {
    manifest.none++;
  }
}

console.log(JSON.stringify(manifest, null, 2));

// Migrate
let migrated = 0;
let skipped = 0;
const errors = [];

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  if (data.evidenceLevel && mapping[data.evidenceLevel]) {
    const oldValue = data.evidenceLevel;
    data.evidenceLevel = mapping[oldValue];
    const updated = matter.stringify(content, data);
    fs.writeFileSync(filePath, updated);
    migrated++;
    console.log(`  migrated ${file}: ${oldValue} -> ${data.evidenceLevel}`);
  } else {
    skipped++;
  }
}

console.log('\n--- POST-MIGRATION SUMMARY ---');
console.log(`Migrated: ${migrated}`);
console.log(`Skipped (no evidenceLevel): ${skipped}`);
console.log(`Errors: ${errors.length}`);

// Verify - scan again
const postManifest = { high: 0, moderate: 0, low: 0, 'very-low': 0, none: 0, old_values: 0 };
for (const file of files) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
  const { data } = matter(raw);
  if (['high', 'moderate', 'low', 'very-low'].includes(data.evidenceLevel)) {
    postManifest[data.evidenceLevel]++;
  } else if (['known', 'suggestive', 'early', 'unknown'].includes(data.evidenceLevel)) {
    postManifest.old_values++;
    console.error(`  FAILED: ${file} still has old value: ${data.evidenceLevel}`);
  } else {
    postManifest.none++;
  }
}

console.log('\nPost-migration counts:', JSON.stringify(postManifest, null, 2));

if (postManifest.old_values > 0) {
  console.error('\nMIGRATION INCOMPLETE: Some files still have old values!');
  process.exit(1);
} else {
  console.log('\nMigration complete. Zero files with old values.');
}
