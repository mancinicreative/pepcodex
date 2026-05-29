#!/usr/bin/env node
/**
 * One-off: flatten the MDX "mechanism step" cards to the mockup's clean style —
 * drop the big 1–4 number tile, keep title + description. Title row becomes a
 * plain heading. Touches only the number-tile + title row inside these cards.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { argv } from 'node:process';

const dirs = argv.slice(2);
if (dirs.length === 0) { console.error('usage: node flatten-mdx-mechanism-cards.mjs <dir> [...]'); process.exit(1); }

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (e.endsWith('.mdx') || e.endsWith('.md')) out.push(p);
  }
  return out;
}

// number-tile + title row  →  plain title
const ROW = /<div class="flex items-center gap-3 mb-3">\s*<div class="w-8 h-8 rounded-lg [^"]*">\d+<\/div>\s*<div class="font-semibold text-\[color:var\(--ink\)\]">([\s\S]*?)<\/div>\s*<\/div>/g;

let filesChanged = 0, totalSubs = 0;
for (const file of dirs.flatMap(walk)) {
  const before = readFileSync(file, 'utf8');
  let subs = 0;
  const after = before.replace(ROW, (_m, title) => {
    subs++;
    return `<div class="font-semibold text-[color:var(--ink)] mb-2">${title.trim()}</div>`;
  });
  if (after !== before) { writeFileSync(file, after); filesChanged++; totalSubs += subs; }
}
console.log(`Files changed: ${filesChanged}`);
console.log(`Mechanism cards flattened: ${totalSubs}`);
