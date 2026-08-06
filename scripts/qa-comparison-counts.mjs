/**
 * Gate: every source-count number printed on a comparison page must match the dossier it describes.
 *
 * These pages state the same figure in up to five places — a table row, a "Key Differences" row, a
 * summary bullet, and two FAQ answers — and each is produced by a separate template. An in-place
 * updater that misses one leaves a page whose table says 6 and whose FAQ says 10, which is worse
 * than either number being stale: a reader who notices has no way to tell which to believe.
 *
 * That is not hypothetical. The first run of refresh-comparison-counts.mjs did exactly that on
 * livagen-vs-ovagen, because the FAQ sentence wraps mid-phrase inside a YAML block scalar and the
 * pattern assumed single spaces. This gate exists so that class of near-miss fails loudly instead
 * of shipping.
 *
 * Usage: node scripts/qa-comparison-counts.mjs [--strict]
 */
import fs from 'fs';
import matter from 'gray-matter';

const STRICT = process.argv.includes('--strict');
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const dossiers = new Map();
for (const f of fs.readdirSync('src/content/peptides').filter((x) => x.endsWith('.mdx'))) {
  const d = matter(fs.readFileSync(`src/content/peptides/${f}`, 'utf-8')).data;
  dossiers.set(f.replace(/\.mdx$/, ''), { name: d.name, s: d.sources || { count: 0, human: 0, preclinical: 0 } });
}

const problems = [];
let checked = 0;

for (const f of fs.readdirSync('src/content/comparisons').filter((x) => x.endsWith('.mdx'))) {
  const raw = fs.readFileSync(`src/content/comparisons/${f}`, 'utf-8');
  const fm = matter(raw);
  const A = dossiers.get(fm.data.peptideA);
  const B = dossiers.get(fm.data.peptideB);
  if (!A || !B) continue;
  checked++;
  // Collapse whitespace so wrapped YAML scalars read as one line.
  const t = raw.replace(/\s+/g, ' ');

  for (const P of [A, B]) {
    const n = esc(P.name);
    for (const m of t.matchAll(new RegExp(`${n} has [A-Za-z-]+(?: [A-Za-z-]+)? evidence \\((\\d+) sources\\)`, 'g'))) {
      if (+m[1] !== P.s.count) problems.push(`${f}: FAQ says ${P.name} has ${m[1]} sources; dossier says ${P.s.count}`);
    }
    for (const m of t.matchAll(new RegExp(`${n} has (\\d+) sources \\((\\d+) human studies\\)`, 'g'))) {
      if (+m[1] !== P.s.count || +m[2] !== P.s.human) problems.push(`${f}: FAQ says ${P.name} ${m[1]}/${m[2]}; dossier ${P.s.count}/${P.s.human}`);
    }
    for (const m of t.matchAll(new RegExp(`\\*\\*${n}:\\*\\* [A-Za-z ]*evidence with (\\d+) total sources \\((\\d+) human\\)`, 'g'))) {
      if (+m[1] !== P.s.count || +m[2] !== P.s.human) problems.push(`${f}: summary says ${P.name} ${m[1]}/${m[2]}; dossier ${P.s.count}/${P.s.human}`);
    }
    for (const m of t.matchAll(new RegExp(`${n} has more clinical evidence with (\\d+) human studies compared to (\\d+)`, 'g'))) {
      const other = P === A ? B : A;
      if (+m[1] !== P.s.human || +m[2] !== other.s.human) problems.push(`${f}: FAQ human comparison ${m[1]}/${m[2]}; dossiers ${P.s.human}/${other.s.human}`);
    }
  }

  const rows = [
    ['Total Sources', A.s.count, B.s.count],
    ['Human Studies', A.s.human, B.s.human],
    ['Preclinical Studies', A.s.preclinical, B.s.preclinical],
  ];
  for (const [label, a, b] of rows) {
    for (const m of t.matchAll(new RegExp(`\\| \\*\\*${esc(label)}\\*\\* \\| (\\d+) \\| (\\d+) \\|`, 'g'))) {
      if (+m[1] !== a || +m[2] !== b) problems.push(`${f}: "${label}" row ${m[1]}/${m[2]}; dossiers ${a}/${b}`);
    }
  }
}

console.log(`Comparison counts: ${checked} pages checked against their dossiers.`);
if (!problems.length) { console.log('PASS: every printed count matches its dossier.'); process.exit(0); }
console.error(`\n${STRICT ? 'FAIL' : 'WARN'}: ${problems.length} mismatch(es)\n`);
problems.slice(0, 40).forEach((p) => console.error(`  • ${p}`));
if (problems.length > 40) console.error(`  ... and ${problems.length - 40} more`);
process.exit(STRICT ? 1 : 0);
