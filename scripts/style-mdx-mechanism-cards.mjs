#!/usr/bin/env node
/**
 * One-off: restyle the flattened MDX mechanism cards from flat full-border sand
 * boxes to a cleaner "callout" — paper-2 fill + a cobalt left accent rule.
 * Scoped to cards (matched only when immediately followed by the title div).
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { argv } from 'node:process';

const dirs = argv.slice(2);
if (dirs.length === 0) { console.error('usage: node style-mdx-mechanism-cards.mjs <dir> [...]'); process.exit(1); }

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (e.endsWith('.mdx') || e.endsWith('.md')) out.push(p);
  }
  return out;
}

const CARD = /<div class="bg-\[color:var\(--paper-2\)\] rounded-lg p-5 border-l-\[3px\] border-l-\[color:var\(--primary-c\)\]">(\s*<div class="font-semibold)/g;
const NEW = '<div class="bg-[color:var(--primary-soft)] rounded-lg p-5 border border-[color:var(--primary-border)]">$1';

let filesChanged = 0, total = 0;
for (const file of dirs.flatMap(walk)) {
  const before = readFileSync(file, 'utf8');
  let subs = 0;
  const after = before.replace(CARD, (m, tail) => { subs++; return NEW.replace('$1', tail); });
  if (after !== before) { writeFileSync(file, after); filesChanged++; total += subs; }
}
console.log(`Files changed: ${filesChanged}`);
console.log(`Mechanism cards restyled: ${total}`);
