// SEO canonical-integrity guard.
// Catches the regression class that collapsed indexing in spring 2026:
//   - canonical host drift (non-www URLs once the site serves on www)
//   - trailingSlash config disagreement between Astro and Vercel
//   - trailing-slash URL drift vs the no-slash canonical form
//
// ERROR  -> exit 1 (blocks build via `npm run check` / prebuild)
// WARNING-> reported, exit 0 (use --strict to fail on warnings too)
import fs from 'fs';
import path from 'path';

const CANONICAL_ORIGIN = 'https://www.pepcodex.com';
const WRONG_ORIGIN = 'https://pepcodex.com'; // non-canonical host as a URL literal

const strict = process.argv.includes('--strict');
const errors = [];
const warnings = [];

// --- collect files to scan: all of src/ + a few root config/static files ---
const SRC_EXT = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs', '.cjs', '.md', '.mdx', '.txt']);
function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (SRC_EXT.has(path.extname(entry.name))) acc.push(full);
  }
  return acc;
}
const files = walk('src');
for (const extra of ['public/robots.txt', 'vercel.json', 'astro.config.mjs']) {
  if (fs.existsSync(extra)) files.push(extra);
}

// --- ERROR 1: astro.config site must be the canonical origin ---
const astroConfig = fs.readFileSync('astro.config.mjs', 'utf-8');
const siteMatch = astroConfig.match(/site:\s*['"]([^'"]+)['"]/);
const siteValue = siteMatch?.[1];
if (siteValue !== CANONICAL_ORIGIN) {
  errors.push(`astro.config.mjs site is "${siteValue ?? '(missing)'}", expected "${CANONICAL_ORIGIN}"`);
}

// --- ERROR 2: no wrong-host URL literal anywhere in scanned files ---
// (https://www.pepcodex.com does NOT contain https://pepcodex.com, so no false positives)
for (const file of files) {
  const lines = fs.readFileSync(file, 'utf-8').split('\n');
  lines.forEach((line, i) => {
    if (line.includes(WRONG_ORIGIN)) {
      errors.push(`${file}:${i + 1} uses non-canonical host "${WRONG_ORIGIN}"`);
    }
  });
}

// --- ERROR 3: robots.txt Sitemap line must use the canonical host ---
if (fs.existsSync('public/robots.txt')) {
  const robots = fs.readFileSync('public/robots.txt', 'utf-8');
  const sitemapLine = robots.split('\n').find((l) => /^sitemap:/i.test(l.trim()));
  if (!sitemapLine) {
    errors.push('public/robots.txt has no Sitemap directive');
  } else if (!sitemapLine.includes(CANONICAL_ORIGIN)) {
    errors.push(`public/robots.txt Sitemap does not use canonical host: "${sitemapLine.trim()}"`);
  }
}

// --- ERROR 4: trailingSlash agreement between Astro and Vercel ---
const astroTS = astroConfig.match(/trailingSlash:\s*['"](\w+)['"]/)?.[1];
let vercelTS;
try {
  vercelTS = JSON.parse(fs.readFileSync('vercel.json', 'utf-8')).trailingSlash;
} catch {}
const agree =
  astroTS === 'ignore' ||
  astroTS === undefined ||
  vercelTS === undefined ||
  (astroTS === 'never' && vercelTS === false) ||
  (astroTS === 'always' && vercelTS === true);
if (!agree) {
  errors.push(
    `trailingSlash mismatch: astro.config="${astroTS}" but vercel.json=${JSON.stringify(vercelTS)} ` +
      `(astro 'never' must pair with vercel false; 'always' with true)`
  );
}

// --- WARNING: trailing-slash URL drift vs the no-slash canonical form ---
const driftRe = new RegExp(`${CANONICAL_ORIGIN.replace(/[.]/g, '\\.')}/[^\\s"'\`)\\]]+/(?=["'\`\\s)\\]]|$)`, 'g');
for (const file of files) {
  if (file === 'public/robots.txt') continue; // sitemap URL legitimately ends in .xml
  const text = fs.readFileSync(file, 'utf-8');
  const hits = text.match(driftRe);
  if (hits) {
    const sample = hits.slice(0, 2).join(', ');
    warnings.push(`${file}: ${hits.length} trailing-slash URL(s) vs no-slash canonical (e.g. ${sample})`);
  }
}

// --- report ---
if (errors.length) {
  console.log(`ERRORS (${errors.length}) — canonical integrity:`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.log('');
}
if (warnings.length) {
  console.log(`WARNINGS (${warnings.length}) — trailing-slash drift (cosmetic, not index-blocking):`);
  for (const w of warnings) console.warn(`  ⚠ ${w}`);
  console.log('');
}

console.log('SEO guard complete:');
console.log(`  Files scanned: ${files.length}`);
console.log(`  Canonical origin: ${CANONICAL_ORIGIN}`);
console.log(`  Errors:   ${errors.length}`);
console.log(`  Warnings: ${warnings.length}`);

if (errors.length) {
  console.error(`\nFAIL: ${errors.length} canonical-integrity error(s)`);
  process.exit(1);
} else if (strict && warnings.length) {
  console.error(`\nFAIL (--strict): ${warnings.length} warning(s)`);
  process.exit(1);
} else {
  console.log('\nPASS: canonical integrity OK');
}
