#!/usr/bin/env node
/**
 * One-off: map off-brand Tailwind color utilities + white-on-paper text in MDX
 * content bodies to the PepTracker brand palette. Colours mapped by MEANING
 * (green→research, red→danger, amber→compound, blue/purple/cyan/etc→cobalt) so
 * any genuinely-semantic callouts keep their meaning while decorative rainbow
 * blocks collapse onto the single cobalt accent. Touches class strings only.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { argv } from 'node:process';

const dirs = argv.slice(2);
if (dirs.length === 0) {
  console.error('usage: node fix-mdx-brand-colors.mjs <dir> [<dir>...]');
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (e.endsWith('.mdx') || e.endsWith('.md')) out.push(p);
  }
  return out;
}

const POS = '(?:emerald|green|lime)';
const NEG = '(?:red|rose)';
const WARN = '(?:amber|yellow|orange)';
const COBALT = '(?:blue|sky|cyan|indigo|violet|purple|fuchsia|pink|teal)';
const ANY = '(?:emerald|green|lime|red|rose|amber|yellow|orange|blue|sky|cyan|indigo|violet|purple|fuchsia|pink|teal)';

const rules = [
  // 1) gradient cards → solid paper-2 (drop the gradient + both stops)
  [new RegExp(`bg-gradient-to-\\w+\\s+from-${ANY}-\\d+(?:\\/\\d+)?\\s+to-${ANY}-\\d+(?:\\/\\d+)?`, 'g'), 'bg-[color:var(--paper-2)]'],

  // 2) borders by meaning
  [new RegExp(`border-${POS}-\\d+(?:\\/\\d+)?`, 'g'), 'border-[rgba(20,118,74,0.30)]'],
  [new RegExp(`border-${NEG}-\\d+(?:\\/\\d+)?`, 'g'), 'border-[rgba(185,61,66,0.28)]'],
  [new RegExp(`border-${WARN}-\\d+(?:\\/\\d+)?`, 'g'), 'border-[rgba(203,135,52,0.32)]'],
  [new RegExp(`border-${COBALT}-\\d+(?:\\/\\d+)?`, 'g'), 'border-[color:var(--border-c)]'],

  // 3) backgrounds by meaning (tints)
  [new RegExp(`bg-${POS}-\\d+(?:\\/\\d+)?`, 'g'), 'bg-[rgba(20,118,74,0.10)]'],
  [new RegExp(`bg-${NEG}-\\d+(?:\\/\\d+)?`, 'g'), 'bg-[rgba(185,61,66,0.10)]'],
  [new RegExp(`bg-${WARN}-\\d+(?:\\/\\d+)?`, 'g'), 'bg-[rgba(203,135,52,0.12)]'],
  [new RegExp(`bg-${COBALT}-\\d+(?:\\/\\d+)?`, 'g'), 'bg-[color:var(--primary-soft)]'],

  // 4) text by meaning
  [new RegExp(`text-${POS}-\\d+(?:\\/\\d+)?`, 'g'), 'text-[#14764a]'],
  [new RegExp(`text-${NEG}-\\d+(?:\\/\\d+)?`, 'g'), 'text-[#b93d42]'],
  [new RegExp(`text-${WARN}-\\d+(?:\\/\\d+)?`, 'g'), 'text-[#9a6418]'],
  [new RegExp(`text-${COBALT}-\\d+(?:\\/\\d+)?`, 'g'), 'text-[color:var(--primary-c)]'],

  // 5) leftover gradient stops
  [new RegExp(`\\bfrom-${ANY}-\\d+(?:\\/\\d+)?\\s*`, 'g'), ''],
  [new RegExp(`\\bto-${ANY}-\\d+(?:\\/\\d+)?\\s*`, 'g'), ''],

  // 6) white / black on paper
  [/text-white\/\d+/g, 'text-[color:var(--ink-muted)]'],
  [/text-white(?![-\w])/g, 'text-[color:var(--ink)]'],
  [/bg-white\/\d+/g, 'bg-[color:var(--paper-2)]'],
  [/border-white\/\d+/g, 'border-[color:var(--border-c)]'],
  [/bg-black\/\d+/g, 'bg-[color:var(--paper-2)]'],
];

let filesChanged = 0;
let totalSubs = 0;
const files = dirs.flatMap((d) => walk(d));

for (const file of files) {
  let src = readFileSync(file, 'utf8');
  const before = src;
  let subs = 0;
  for (const [re, rep] of rules) {
    src = src.replace(re, (m) => { subs++; return rep; });
  }
  if (src !== before) {
    writeFileSync(file, src);
    filesChanged++;
    totalSubs += subs;
  }
}

console.log(`Files changed: ${filesChanged} / ${files.length}`);
console.log(`Total class substitutions: ${totalSubs}`);
