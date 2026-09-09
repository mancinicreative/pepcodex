/**
 * Update the source-count numbers inside EXISTING comparison pages, in place.
 *
 * WHY NOT REGENERATE: scripts/generate-comparisons.mjs deliberately skips files that already exist,
 * and that is the right behaviour — these pages have since been hand-corrected in ways a generator
 * cannot reproduce. The regulatory audit rewrote 51 of them to remove false "Both X and Y are
 * FDA-approved" claims, the link-up pass attached 131 verified citations to their frontmatter, and
 * the Livagen identity fix corrected five. Deleting and regenerating would silently revert all of
 * it. So this script touches ONLY the numbers that derive from each dossier's `sources` block, and
 * leaves every other byte alone.
 *
 * The strings below are the generator's own output templates, so an updated page stays
 * byte-identical to what the generator would produce today for those fields — and nothing else
 * moves.
 *
 * Usage:
 *   node scripts/refresh-comparison-counts.mjs            # dry run
 *   node scripts/refresh-comparison-counts.mjs --apply
 *   node scripts/refresh-comparison-counts.mjs --apply --file reviewed-pair.mdx
 *
 * A semantic preflight rejects the whole selected apply batch before any write
 * when known unsafe FAQ wording or unresolved pair metadata needs review.
 * Explicit --file batches are limited to ten; a dry run remains read-only.
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { inspectComparisonSemantics } from './lib/comparison-semantics.mjs';

const APPLY = process.argv.includes('--apply');
const PEP = 'src/content/peptides';
const CMP = 'src/content/comparisons';
const selected = [];
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--apply') continue;
  if (process.argv[i] !== '--file' || !/^[a-z0-9-]+\.mdx$/.test(process.argv[i + 1] || '')) throw new Error('Use --apply and/or --file <comparison-slug.mdx>.');
  selected.push(process.argv[++i]);
}
if (new Set(selected).size > 10) throw new Error('Explicit review batches are limited to ten comparison files.');
const files = [...new Set(selected.length ? selected : fs.readdirSync(CMP).filter(x => x.endsWith('.mdx')))];

const dossiers = new Map();
for (const f of fs.readdirSync(PEP).filter((x) => x.endsWith('.mdx'))) {
  const d = matter(fs.readFileSync(path.join(PEP, f), 'utf-8')).data;
  dossiers.set(f.replace(/\.mdx$/, ''), { name: d.name, sources: d.sources });
}

const validCounts = P => P?.sources && ['count', 'human', 'preclinical'].every(field => Number.isSafeInteger(P.sources[field]) && P.sources[field] >= 0);

const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let changedFiles = 0, edits = 0;
const missing = new Set();

// Validate the entire requested batch before the first write. Updating numbers
// inside legacy winner/tie prose can preserve or create a false statement.
// Repair its wording through the reviewed content workflow, then refresh counts.
const semanticProblems = [];
for (const file of files) {
  const page = matter(fs.readFileSync(path.join(CMP, file), 'utf-8')).data;
  const A = dossiers.get(page.peptideA), B = dossiers.get(page.peptideB);
  for (const finding of inspectComparisonSemantics(page, A, B)) {
    semanticProblems.push(`${file}: ${finding.code}: ${finding.detail}`);
  }
  if ((A && !validCounts(A)) || (B && !validCounts(B))) semanticProblems.push(`${file}: SOURCE_COUNTS_INVALID: Required dossier count fields must be nonnegative safe integers; unavailable counts are not zero.`);
}
if (semanticProblems.length) {
  console.error(`SEMANTIC_REVIEW_REQUIRED: ${semanticProblems.length} signal(s) in the selected batch.`);
  semanticProblems.slice(0, 20).forEach(problem => console.error(`  ${problem}`));
  if (semanticProblems.length > 20) console.error('Use qa-comparison-semantics.mjs --json for the complete review queue.');
  if (APPLY) {
    console.error('No comparison files written. Repair/review the flagged wording or pair metadata before refreshing this batch.');
    process.exit(1);
  }
}

for (const f of files) {
  const p = path.join(CMP, f);
  const raw = fs.readFileSync(p, 'utf-8');
  const fm = matter(raw);
  const A = dossiers.get(fm.data.peptideA);
  const B = dossiers.get(fm.data.peptideB);
  if (!A || !B) { missing.add(`${f} (${fm.data.peptideA} / ${fm.data.peptideB})`); continue; }
  if (!validCounts(A) || !validCounts(B)) continue;

  const ws = (s) => s.split(' ').map(esc).join('\\s+');
  /* The peptide NAME can itself wrap mid-phrase inside a YAML block scalar — "Melanotan
      II
   * has 26 sources", "Thymosin
      Alpha-1 has 42". Escaping the name but leaving its internal
   * space literal missed exactly those, so multi-word names must match flexibly too. */
  const nm = (P) => ws(P.name);
  let out = raw;
  const before = out;
  const n = (x) => `\\d+`;

  // Table rows — the generator emits these with a fixed label and two numeric cells.
  const row = (label, a, b) => {
    // Parent-only context is supported on explicit inventory rows. Never convert
    // a qualified observational/RCT study count into an identifier count.
    const inventoryLabel = /identifiers$|entries$/.test(label) || label === 'Sources in dossier';
    const qualifier = inventoryLabel ? '(?:[ \\t]+\\([^|\\r\\n]*\\))?' : '';
    const re = new RegExp(`(\\|\\s*\\*\\*${esc(label)}\\*\\*\\s*\\|\\s*)\\d+(${qualifier}\\s*\\|\\s*)\\d+(${qualifier}\\s*\\|)`, 'g');
    out = out.replace(re, `$1${a}$2${b}$3`);
  };
  row('Human Studies', A.sources.human, B.sources.human);
  row('Human-tagged identifiers', A.sources.human, B.sources.human);
  row('Human evidence entries', A.sources.human, B.sources.human);
  row('Preclinical Studies', A.sources.preclinical, B.sources.preclinical);
  row('Preclinical-tagged identifiers', A.sources.preclinical, B.sources.preclinical);
  row('Preclinical evidence entries', A.sources.preclinical, B.sources.preclinical);
  row('Total Sources', A.sources.count, B.sources.count);
  row('Source identifiers', A.sources.count, B.sources.count);
  row('Sources in dossier', A.sources.count, B.sources.count);

  // "- **Name:** <label> evidence with N total sources (M human)"
  for (const P of [A, B]) {
    out = out.replace(
      new RegExp(`(\\*\\*${nm(P)}:\\*\\*[^\\n]*?evidence with )\\d+( total sources \\()\\d+( human\\))`, 'g'),
      `$1${P.sources.count}$2${P.sources.human}$3`);
  }

  /* WHITESPACE-FLEXIBLE. These sentences live in YAML block scalars that wrap at ~72 chars, so a
   * newline plus indentation can fall between ANY two words — "Ovagen has\n      Low evidence
   * (10 sources)". A pattern written with single spaces silently misses those, which left a table
   * reading 6 next to an FAQ still reading 10 in the same file. Every literal space in these
   * patterns therefore matches any run of whitespace. */

  for (const P of [A, B]) {
    const other = P === A ? B : A;
    // "Name has <label> evidence (N sources)"
    out = out.replace(
      new RegExp(`(${nm(P)}\\s+has\\s+[A-Za-z-]+(?:\\s+[A-Za-z-]+)?\\s+evidence\\s+\\()\\d+(\\s+sources\\))`, 'g'),
      `$1${P.sources.count}$2`);
    // "Name has N sources (M human studies)"
    out = out.replace(
      new RegExp(`(${nm(P)}\\s+has\\s+)\\d+(\\s+sources\\s+\\()\\d+(\\s+human\\s+studies\\))`, 'g'),
      `$1${P.sources.count}$2${P.sources.human}$3`);
    // "Name has more clinical evidence with N human studies compared to M for Other"
    out = out.replace(
      new RegExp(`(${nm(P)}\\s+${ws('has more clinical evidence with')}\\s+)\\d+(\\s+${ws('human studies compared to')}\\s+)\\d+`, 'g'),
      `$1${P.sources.human}$2${other.sources.human}`);
  }
  // "Both have similar numbers of human studies (N each)"
  if (A.sources.human === B.sources.human) {
    out = out.replace(new RegExp(`(${ws('Both have similar numbers of human studies')}\\s+\\()\\d+(\\s+each\\))`, 'g'),
      `$1${A.sources.human}$2`);
  }

  if (out !== before) {
    changedFiles++;
    edits += out.split('\n').filter((l, i) => l !== before.split('\n')[i]).length;
    if (APPLY) fs.writeFileSync(p, out);
  }
}

console.log(`${APPLY ? 'APPLIED' : 'DRY RUN'} — ${changedFiles} comparison files updated (${edits} lines).`);
if (missing.size) {
  console.warn(`\n${missing.size} comparison(s) reference a peptide with no dossier — left untouched:`);
  [...missing].slice(0, 10).forEach((m) => console.warn(`  ${m}`));
}
if (!APPLY) console.log('\nNo files written. Re-run with --apply.');
