// Fails the build on any frontmatter `sources:` entry that carries NO verifiable identifier
// (pmid / doi / url / NCT).
//
//   node scripts/qa-source-identifiers.mjs           # report
//   node scripts/qa-source-identifiers.mjs --strict  # exit 1 on any offender
//
// WHY THIS EXISTS
// `qa-pmids.mjs --strict` verifies that every identifier which EXISTS resolves — and it passes:
// 682 PMIDs, 48 NCTs, 11 DOIs all resolve. But a citation with no identifier at all has nothing
// to resolve, so it sails through. That blind spot let 67 of 155 blog posts ship with sources
// like `- id: dsip-clinical-trial / title: "DSIP Effects on Sleep Architecture: An RCT"` and no
// PMID, DOI or URL — unverifiable by construction, on a site whose entire positioning is
// evidence-based. Prose rules did not prevent it; this check does.
import fs from 'fs';
import path from 'path';

const STRICT = process.argv.includes('--strict');
const ROOT = path.join('src', 'content');
// Collections whose frontmatter carries a `sources:` block.
const COLLECTIONS = ['blog', 'peptides', 'comparisons', 'safety', 'guides', 'protocols', 'conditions'];

const hasIdentifier = (entry) =>
  /(^|\s)(pmid|doi)\s*:/i.test(entry) ||
  /(^|\s)url\s*:\s*\S+/i.test(entry) ||
  /https?:\/\//i.test(entry) ||
  /\bNCT\d{6,}\b/i.test(entry) ||
  /(^|\s)id\s*:\s*['"]?(pmid[-:]?\d+|10\.\d{4,})/i.test(entry);

const offenders = [];
let filesScanned = 0;
let sourcesScanned = 0;
let sourcesOk = 0;

for (const col of COLLECTIONS) {
  const dir = path.join(ROOT, col);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f))) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    // Content files are CRLF — split on either ending or the frontmatter is never found.
    const fm = raw.split(/\r?\n---\r?\n/)[0];
    const at = fm.search(/\r?\nsources:/);
    if (at < 0) continue;
    filesScanned++;

    // Take the sources block up to the next top-level key.
    const rest = fm.slice(at).replace(/^\r?\nsources:\r?\n/, '');
    const lines = rest.split(/\r?\n/);
    const block = [];
    for (const line of lines) {
      if (/^[A-Za-z_][A-Za-z0-9_]*\s*:/.test(line)) break; // next top-level key
      block.push(line);
    }

    // Split into individual `- id:` entries.
    const entries = [];
    let cur = null;
    for (const line of block) {
      if (/^\s*-\s/.test(line)) {
        if (cur) entries.push(cur);
        cur = line;
      } else if (cur !== null) cur += '\n' + line;
    }
    if (cur) entries.push(cur);

    for (const e of entries) {
      sourcesScanned++;
      if (hasIdentifier(e)) sourcesOk++;
      else {
        const id = (e.match(/id\s*:\s*(.+)/) || [])[1]?.trim() ?? '(no id)';
        offenders.push({ file: `${col}/${file}`, id });
      }
    }
  }
}

const byFile = offenders.reduce((a, o) => {
  (a[o.file] ??= []).push(o.id);
  return a;
}, {});

console.log(`\nSOURCE IDENTIFIER CHECK`);
console.log(`  files with a sources block : ${filesScanned}`);
console.log(`  source entries scanned     : ${sourcesScanned}`);
console.log(`  with pmid/doi/url/NCT      : ${sourcesOk}`);
console.log(`  WITHOUT any identifier     : ${offenders.length}  across ${Object.keys(byFile).length} file(s)`);

if (offenders.length) {
  console.log(`\n  Unverifiable citations (a reader cannot check these):`);
  Object.entries(byFile)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 40)
    .forEach(([f, ids]) => console.log(`    ${String(ids.length).padStart(2)}  ${f}`));
  const more = Object.keys(byFile).length - 40;
  if (more > 0) console.log(`    ... and ${more} more file(s)`);
}

// ---------------------------------------------------------------------------
// RATCHET MODE
// A gate that fails on all 211 known offenders would fail every build and get
// switched off within a day. Instead we baseline the known backlog and fail only on
// NEW violations — so the number can only go down. Remediate a file, re-run with
// --update-baseline, and it can never regress.
// ---------------------------------------------------------------------------
const BASELINE = path.join('.planning', 'citation-baseline.json');
const key = (o) => `${o.file}::${o.id}`;
const current = new Set(offenders.map(key));

if (process.argv.includes('--update-baseline')) {
  fs.mkdirSync(path.dirname(BASELINE), { recursive: true });
  fs.writeFileSync(
    BASELINE,
    JSON.stringify({ updated: new Date().toISOString().slice(0, 10), count: current.size, entries: [...current].sort() }, null, 2)
  );
  console.log(`\n  baseline written: ${current.size} known offenders -> ${BASELINE}\n`);
  process.exit(0);
}

if (STRICT) {
  if (!fs.existsSync(BASELINE)) {
    console.error(`\n  FAIL: no baseline at ${BASELINE}. Run with --update-baseline first.`);
    process.exit(1);
  }
  const baseline = new Set(JSON.parse(fs.readFileSync(BASELINE, 'utf8')).entries);
  const added = [...current].filter((k) => !baseline.has(k));
  const fixed = [...baseline].filter((k) => !current.has(k));

  if (fixed.length) console.log(`\n  ${fixed.length} previously-flagged citation(s) fixed since the baseline.`);

  if (added.length) {
    console.error(`\n  FAIL: ${added.length} NEW citation(s) with no PMID, DOI, URL or NCT id:`);
    added.slice(0, 20).forEach((k) => console.error(`    ${k}`));
    console.error(`\n  Every factual claim must trace to something a reader can verify.`);
    console.error(`  Fix the citation, or run --update-baseline only if this is a deliberate,`);
    console.error(`  reviewed exception.`);
    process.exit(1);
  }
  console.log(`\n  PASS (ratchet): no new unverifiable citations. Backlog: ${current.size}.\n`);
} else {
  console.log(offenders.length ? '\n  (report only — use --strict for the ratchet)\n' : '\n  PASS: every cited source carries a verifiable identifier.\n');
}
