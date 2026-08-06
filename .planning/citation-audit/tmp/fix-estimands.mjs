/**
 * Replace sponsor efficacy-estimand figures with the published treatment-regimen results.
 * Each target value was verified from the paper's own abstract in this session:
 *   SURMOUNT-1 (PMID 35658024): 15 mg -20.9% vs -3.1% placebo   (efficacy estimand: 22.5%)
 *   SURMOUNT-2 (PMID 37385275): 15 mg -14.7% vs -3.2% placebo   (efficacy estimand: 15.7%)
 * Context-gated per line so an unrelated 22.5% elsewhere is not rewritten.
 */
import fs from 'fs';
import path from 'path';

const APPLY = process.argv.includes('--apply');

function walk(d, out = []) {
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.mdx?$/.test(e.name)) out.push(p);
  }
  return out;
}

const RULES = [
  { find: /15\.7\s?%/g, to: '14.7%', ctx: /SURMOUNT[-\s]?2/i, label: 'SURMOUNT-2' },
  { find: /22\.5\s?%/g, to: '20.9%', ctx: /SURMOUNT[-\s]?1|tirzepatide/i, label: 'SURMOUNT-1' },
];

let total = 0;
const touched = {};
for (const f of walk('src/content')) {
  const lines = fs.readFileSync(f, 'utf-8').split('\n');
  let c = 0;
  for (let i = 0; i < lines.length; i++) {
    for (const r of RULES) {
      if (!r.ctx.test(lines[i])) continue;
      const before = lines[i];
      lines[i] = lines[i].replace(r.find, r.to);
      if (lines[i] !== before) c++;
    }
  }
  if (c) {
    if (APPLY) fs.writeFileSync(f, lines.join('\n'));
    total += c;
    touched[path.relative('src/content', f).split(path.sep).join('/')] = c;
  }
}
console.log(`${APPLY ? 'APPLIED' : 'DRY RUN'} — ${total} estimand corrections across ${Object.keys(touched).length} files`);
Object.entries(touched).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(2)}  ${k}`));
if (!APPLY) console.log('\nRe-run with --apply.');
