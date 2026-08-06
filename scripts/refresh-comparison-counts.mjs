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
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const APPLY = process.argv.includes('--apply');
const PEP = 'src/content/peptides';
const CMP = 'src/content/comparisons';

const dossiers = new Map();
for (const f of fs.readdirSync(PEP).filter((x) => x.endsWith('.mdx'))) {
  const d = matter(fs.readFileSync(path.join(PEP, f), 'utf-8')).data;
  dossiers.set(f.replace(/\.mdx$/, ''), { name: d.name, sources: d.sources || { count: 0, human: 0, preclinical: 0 } });
}

const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let changedFiles = 0, edits = 0;
const missing = new Set();

for (const f of fs.readdirSync(CMP).filter((x) => x.endsWith('.mdx'))) {
  const p = path.join(CMP, f);
  const raw = fs.readFileSync(p, 'utf-8');
  const fm = matter(raw);
  const A = dossiers.get(fm.data.peptideA);
  const B = dossiers.get(fm.data.peptideB);
  if (!A || !B) { missing.add(`${f} (${fm.data.peptideA} / ${fm.data.peptideB})`); continue; }

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
    const re = new RegExp(`(\\|\\s*\\*\\*${esc(label)}\\*\\*\\s*\\|\\s*)\\d+(\\s*\\|\\s*)\\d+(\\s*\\|)`, 'g');
    out = out.replace(re, `$1${a}$2${b}$3`);
  };
  row('Human Studies', A.sources.human, B.sources.human);
  row('Preclinical Studies', A.sources.preclinical, B.sources.preclinical);
  row('Total Sources', A.sources.count, B.sources.count);

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
