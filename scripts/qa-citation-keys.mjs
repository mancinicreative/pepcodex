// Fails the build when body text cites a [key] that does not exist in the post's own
// frontmatter `sources:` — i.e. a claim with no source behind it at all.
//
//   node scripts/qa-citation-keys.mjs                   # report
//   node scripts/qa-citation-keys.mjs --strict          # exit 1 on NEW offenders
//   node scripts/qa-citation-keys.mjs --update-baseline
//
// WHY THIS EXISTS
// `thymosin-alpha1-elderly-immune` described an RCT of 240 adults that does not exist. Its body
// cited [ta1-elderly-2025], [immunosenescence-review] and [ta1-approval-status] — none of which
// appear in its frontmatter. Every quantitative claim in the post had nothing behind it, and both
// existing gates passed it, because they only inspect sources that ARE declared. A dangling key
// is the cheapest possible signal that a claim was written first and sourced never.
//
// Validated on the 2026-08-17 claim audit: 2 of the 14 posts this finds were independently
// audited, and BOTH were classified defective (CONTRADICTED and MISATTRIBUTED). 2/2.
import fs from 'fs';
import path from 'path';

const STRICT = process.argv.includes('--strict');
const ROOT = path.join('src', 'content');
const COLLECTIONS = ['blog', 'peptides', 'comparisons', 'safety', 'guides', 'protocols', 'conditions'];

// A citation key looks like [some-key] NOT followed by `(` — that would be a markdown link.
// Requires a leading letter and 4+ chars so it does not match [x] or array syntax in code blocks.
const KEY_RE = /\[([a-z][a-z0-9-]{3,})\](?!\()/g;

const offenders = [];
let filesScanned = 0;
let keysScanned = 0;

for (const col of COLLECTIONS) {
  const dir = path.join(ROOT, col);
  if (!fs.existsSync(dir)) continue;

  for (const file of fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f))) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    // Content files are CRLF — split on either ending or the frontmatter is never found.
    const parts = raw.split(/\r?\n---\r?\n/);
    if (parts.length < 2) continue;
    const fm = parts[0];
    // Strip code before scanning — `[foo-bar]` inside a code sample is not a citation.
    // Inline spans matter as much as fenced blocks here: this site quotes PubMed query syntax
    // like `semax AND humans[mesh]`, where [mesh] is a MeSH field tag, not a citation key.
    const body = parts
      .slice(1)
      .join('\n---\n')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`\n]*`/g, '');

    filesScanned++;

    const declared = new Set(
      [...fm.matchAll(/^\s*-?\s*id:\s*['"]?([A-Za-z0-9._:-]+)/gm)].map((m) => m[1])
    );

    const used = [...new Set([...body.matchAll(KEY_RE)].map((m) => m[1]))];
    keysScanned += used.length;

    for (const key of used) {
      if (!declared.has(key)) offenders.push({ file: `${col}/${file}`, key });
    }
  }
}

const byFile = offenders.reduce((a, o) => {
  (a[o.file] ??= []).push(o.key);
  return a;
}, {});

console.log(`\nCITATION KEY CHECK`);
console.log(`  files scanned            : ${filesScanned}`);
console.log(`  body citation keys       : ${keysScanned}`);
console.log(`  DANGLING (no such source): ${offenders.length}  across ${Object.keys(byFile).length} file(s)`);

if (offenders.length) {
  console.log(`\n  Claims with no source behind them:`);
  Object.entries(byFile)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 40)
    .forEach(([f, keys]) => console.log(`    ${String(keys.length).padStart(2)}  ${f}  ->  ${keys.join(', ')}`));
}

// ---------------------------------------------------------------------------
// RATCHET — baseline the known backlog, fail only on NEW violations.
// ---------------------------------------------------------------------------
const BASELINE = path.join('.planning', 'citation-key-baseline.json');
const key = (o) => `${o.file}::${o.key}`;
const current = new Set(offenders.map(key));

if (process.argv.includes('--update-baseline')) {
  fs.mkdirSync(path.dirname(BASELINE), { recursive: true });
  fs.writeFileSync(
    BASELINE,
    JSON.stringify(
      { updated: new Date().toISOString().slice(0, 10), count: current.size, entries: [...current].sort() },
      null,
      2
    )
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

  if (fixed.length) console.log(`\n  ${fixed.length} previously-dangling key(s) resolved since the baseline.`);

  if (added.length) {
    console.error(`\n  FAIL: ${added.length} NEW citation key(s) with no matching source:`);
    added.slice(0, 20).forEach((k) => console.error(`    ${k}`));
    console.error(`\n  The claim citing it has nothing behind it. Add the source, or cut the claim.`);
    process.exit(1);
  }
  console.log(`\n  PASS (ratchet): no new dangling citation keys. Backlog: ${current.size}.\n`);
} else {
  console.log(offenders.length ? '\n  (report only — use --strict for the ratchet)\n' : '\n  PASS: every cited key resolves to a declared source.\n');
}
