#!/usr/bin/env node
/**
 * Trials freshness orchestrator (V1 loop, Phase 1).
 * Runs refresh-trials.mjs across EVERY source pack on a schedule so the trials tracker
 * stays current instead of drifting (recon: only 16/23 packs were current). Reuses the
 * single-slug script verbatim — one throttled CT.gov fetch per pack — and never fabricates.
 *
 * Dry-run by default; --apply writes the packs (each stamps its own trialsLastSynced).
 *
 * Usage:
 *   node scripts/refresh-trials-all.mjs                 # dry run, all packs
 *   node scripts/refresh-trials-all.mjs --apply         # write all packs
 *   node scripts/refresh-trials-all.mjs --apply --only retatrutide,semaglutide
 */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 && args[onlyIdx + 1] ? args[onlyIdx + 1].split(',').map((s) => s.trim()) : null;
// Forwarded to refresh-trials.mjs: --max-add 0 = updates-only (refresh existing trials, add none);
// --phase 2,3 = only Phase 2/3 trials (cuts noise on broad-named compounds).
const passthru = [];
for (const f of ['--max-add', '--phase', '--max']) {
  const i = args.indexOf(f);
  if (i >= 0 && args[i + 1]) passthru.push(f, args[i + 1]);
}

const packDir = join(process.cwd(), 'data', 'source-packs');
let slugs = readdirSync(packDir).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));
if (only) slugs = slugs.filter((s) => only.includes(s));
slugs.sort();

console.log(`Trials orchestrator: ${slugs.length} pack(s) · ${APPLY ? 'APPLY' : 'DRY RUN'}\n`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let totUpdated = 0;
let totAdded = 0;
const changed = [];
const failed = [];

for (const slug of slugs) {
  try {
    const cmd = ['scripts/refresh-trials.mjs', slug, ...(APPLY ? ['--apply'] : []), ...passthru];
    const out = execFileSync('node', cmd, { encoding: 'utf8' });
    const m = out.match(/updated:\s*(\d+)\s+added:\s*(\d+)/);
    const u = m ? +m[1] : 0;
    const a = m ? +m[2] : 0;
    totUpdated += u;
    totAdded += a;
    if (u || a) changed.push(`${slug}  (+${a} new, ${u} updated)`);
    process.stdout.write(`  ${slug.padEnd(28)} updated ${String(u).padStart(2)}  added ${String(a).padStart(2)}\n`);
  } catch (e) {
    failed.push(slug);
    process.stdout.write(`  ${slug.padEnd(28)} FAILED (${String(e.message).split('\n')[0]})\n`);
  }
  await sleep(800); // CT.gov courtesy delay between packs
}

console.log(`\n${APPLY ? 'APPLIED' : 'DRY RUN'} — ${slugs.length} packs · ${totUpdated} trials updated · ${totAdded} new trials added`);
if (changed.length) {
  console.log('Changed packs:');
  for (const c of changed) console.log(`  • ${c}`);
}
if (failed.length) console.log(`\nFailed (${failed.length}): ${failed.join(', ')}`);
