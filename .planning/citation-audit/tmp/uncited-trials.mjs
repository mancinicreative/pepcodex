/**
 * Which pages name a specific clinical trial but carry no citation at all?
 * Each is a factual claim a reader cannot check and that no gate has verified.
 */
import fs from 'fs';
import path from 'path';

function walk(d, out = []) {
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.mdx?$/.test(e.name)) out.push(p);
  }
  return out;
}

const TRIAL = /\b(STEP|SURMOUNT|SURPASS|REDEFINE|SUSTAIN|SELECT|ATTAIN|TRIUMPH|SYNCHRONIZE|PIONEER|OASIS|SCALE)[-\s]?(\d[A-Za-z]?|CVOT)\b/g;
const rows = [];
for (const c of ['comparisons', 'glossary', 'guides', 'safety', 'conditions', 'protocols']) {
  for (const f of walk(path.join('src/content', c))) {
    const raw = fs.readFileSync(f, 'utf-8');
    const cited = /pmid|doi\.org|NCT\d{8}/i.test(raw);
    const trials = [...new Set((raw.match(TRIAL) || []).map((x) => x.replace(/[-\s]+/g, '-').toUpperCase()))];
    if (trials.length && !cited) {
      rows.push({ f: path.relative('src/content', f).split(path.sep).join('/'), n: trials.length, trials });
    }
  }
}
rows.sort((a, b) => b.n - a.n);
console.log(`Files naming a specific trial with ZERO citations: ${rows.length}`);
const perCol = {};
for (const r of rows) { const c = r.f.split('/')[0]; perCol[c] = (perCol[c] || 0) + 1; }
console.log('by collection:', JSON.stringify(perCol));
console.log('');
for (const r of rows.slice(0, 15)) console.log(`  ${String(r.n).padStart(2)}  ${r.f.padEnd(50)} ${r.trials.slice(0, 5).join(', ')}`);
fs.writeFileSync('.planning/citation-audit/uncited-trial-claims.json', JSON.stringify(rows, null, 2));
console.log(`\nWrote .planning/citation-audit/uncited-trial-claims.json (${rows.length} files)`);
