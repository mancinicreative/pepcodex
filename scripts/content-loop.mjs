/**
 * The content freshness loop — one command that runs the whole graph and reports what needs a human
 * or an agent.
 *
 * This is the deterministic half of the system. It discovers, verifies and measures; it never
 * writes content. Everything it emits carries an identifier fetched from a registry during the run,
 * so the agents that consume its output can only choose among real things. That separation is the
 * structural defence against the fabrication class this whole codebase exists to prevent: an agent
 * that both searches and writes can produce a citation that fits its narrative, and an agent that
 * can only pick from a fetched worklist cannot.
 *
 * THE GRAPH
 *
 *   Layer 0  SELF-TEST     every matcher against labelled real cases; ABORT if any fails
 *   Layer 1  INTEGRITY     offline contradictions — counts, duplicates, identity, staleness
 *   Layer 2  LEDGER        re-enumerate and verify every identifier; must converge
 *   Layer 3  DISCOVERY     what is new for what we cover, and what we do not cover at all
 *   Layer 4  ASSESS        classify findings into HEAL / DISPATCH / ESCALATE
 *
 * Layer 0 aborts the run rather than proceeding, because a checker that has not been shown to work
 * cannot be used to decide what is real — and a broken matcher does not produce an error, it
 * produces confident garbage.
 *
 * Layer 2 must run BEFORE anything counts identifiers. The ledger goes stale the moment an agent
 * adds a citation, and counting against a stale ledger silently undercounts — that happened, and
 * produced a dossier reporting 4 sources on a page displaying 7.
 *
 * SELF-HEALING vs SELF-IMPROVING, which are different things:
 *   HEAL      a defect with one mechanically correct answer, applied by a repair script.
 *   LEARN     a defect the checkers did not catch. The fix is a new fixture or a new gate, not a
 *             content edit — otherwise the same class returns next month.
 *   ESCALATE  a defect whose resolution needs judgement or a source. Reported, never guessed.
 *
 * Usage:
 *   node scripts/content-loop.mjs                 # full cycle, 60-day window
 *   node scripts/content-loop.mjs --days 30
 *   node scripts/content-loop.mjs --offline       # layers 0-1 only, no network
 *   node scripts/content-loop.mjs --heal          # additionally apply the safe repairs
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const DAYS = args.includes('--days') ? args[args.indexOf('--days') + 1] : '60';
const OFFLINE = args.includes('--offline');
const HEAL = args.includes('--heal');
const TODAY = new Date().toISOString().slice(0, 10);

const run = (cmd, { allowFail = false } = {}) => {
  try {
    const out = execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });
    return { ok: true, out };
  } catch (e) {
    if (!allowFail) throw new Error(`${cmd}\n${(e.stdout || '') + (e.stderr || '')}`);
    return { ok: false, out: (e.stdout || '') + (e.stderr || '') };
  }
};

const report = { date: TODAY, days: Number(DAYS), heal: [], dispatch: [], escalate: [], learn: [] };
const banner = (n, t) => console.log(`\n${'═'.repeat(70)}\n  LAYER ${n} — ${t}\n${'═'.repeat(70)}`);

// ── Layer 0 ────────────────────────────────────────────────────────────────────────────────────
banner(0, 'SELF-TEST — a checker that is not verified cannot verify anything');
for (const cmd of ['node scripts/verify-graph.mjs --self-test',
                   'node scripts/source-thin-dossiers.mjs --self-test',
                   'node scripts/qa-staleness.mjs --self-test']) {
  const r = run(cmd, { allowFail: true });
  const line = (r.out.match(/(\d+ ?\/ ?\d+|\d+ passed · \d+ failed)/) || ['?'])[0];
  console.log(`  ${r.ok ? 'ok  ' : 'FAIL'} ${cmd.split('/').pop().padEnd(38)} ${line}`);
  if (!r.ok) {
    console.error('\nABORT: a matcher self-test failed. Fix the matcher before trusting any finding below.');
    process.exit(1);
  }
}

// ── Layer 1 ────────────────────────────────────────────────────────────────────────────────────
banner(1, 'INTEGRITY — offline contradictions in our own data');
const gates = [
  ['consistency', 'node scripts/qa-internal-consistency.mjs --strict'],
  ['identity', 'node scripts/qa-identity-integrity.mjs'],
  ['comparison counts', 'node scripts/qa-comparison-counts.mjs'],
  ['staleness', 'node scripts/qa-staleness.mjs'],
  ['cross-links', 'node scripts/validate-cross-links.mjs'],
  ['scoring', 'node scripts/qa-scoring.mjs'],
];
for (const [name, cmd] of gates) {
  const r = run(cmd, { allowFail: true });
  const fails = (r.out.match(/(?:FAIL|WARN): (\d+)/) || [])[1];
  console.log(`  ${r.ok && !fails ? 'PASS' : 'FLAG'} ${name.padEnd(20)} ${fails ? `${fails} finding(s)` : 'clean'}`);
  if (fails) report.escalate.push({ gate: name, findings: Number(fails) });
}

// Repairs that have exactly one correct answer.
if (HEAL) {
  console.log('\n  HEAL — applying repairs with a single mechanically correct answer:');
  for (const [what, cmd] of [
    ['duplicate trials', 'node scripts/dedupe-trials.mjs --apply'],
    ['source counts', 'node scripts/reconcile-source-counts.mjs --apply'],
    ['comparison counts', 'node scripts/refresh-comparison-counts.mjs --apply'],
  ]) {
    const r = run(cmd, { allowFail: true });
    const summary = (r.out.split('\n').filter((l) => /APPLIED|Wrote|updated/.test(l))[0] || '').trim();
    console.log(`    ${what.padEnd(20)} ${summary || (r.ok ? 'nothing to do' : 'FAILED')}`);
    report.heal.push({ what, summary });
  }
}

if (OFFLINE) {
  console.log('\n--offline: stopping before network layers.');
  fs.mkdirSync('.planning/loop', { recursive: true });
  fs.writeFileSync(`.planning/loop/${TODAY}.json`, JSON.stringify(report, null, 2) + '\n');
  process.exit(0);
}

// ── Layer 2 ────────────────────────────────────────────────────────────────────────────────────
banner(2, 'LEDGER — every identifier re-verified; must run before anything counts them');
const loop = run('node scripts/verify-loop.mjs --loop', { allowFail: true });
const conv = (loop.out.match(/CONVERGED after (\d+) round/) || [])[1];
const cov = (loop.out.match(/COVERAGE: ([\d/]+ live identifiers verified \([\d.]+%\))/) || [])[1];
console.log(`  ${conv ? `converged in ${conv} round(s)` : 'DID NOT CONVERGE'}`);
console.log(`  ${cov || 'coverage unknown'}`);
if (!conv) report.escalate.push({ gate: 'ledger', findings: 'did not converge — do not trust counts until it does' });

// ── Layer 3 ────────────────────────────────────────────────────────────────────────────────────
banner(3, `DISCOVERY — ${DAYS}-day window`);
const scan = run(`node scripts/monthly-research-scan.mjs --days ${DAYS}`, { allowFail: true });
const tot = scan.out.match(/peptides (\d+) · new papers (\d+) · new trials (\d+) · updated trials (\d+)/);
if (tot) {
  console.log(`  covered peptides : ${tot[2]} new papers · ${tot[3]} new trials · ${tot[4]} updated`);
  report.dispatch.push({ agent: 'Evidence', input: `.planning/research-scan/${TODAY}/`, papers: +tot[2] });
  report.dispatch.push({ agent: 'Trials', input: `.planning/research-scan/${TODAY}/`, trials: +tot[3] + +tot[4] });
}
// Anything flagged by the scan's own guards is a LEARN signal, not a content finding.
const suspect = (scan.out.match(/suspectGenericAliases/g) || []).length;
if (suspect) report.learn.push({ signal: 'suspect generic aliases dropped by the scan', count: suspect });

const gaps = run(`node scripts/discover-coverage-gaps.mjs --days ${DAYS}`, { allowFail: true });
const gapN = (gaps.out.match(/Candidates with no dossier \(>= \d+ refs\): (\d+)/) || [])[1];
if (gapN) {
  console.log(`  uncovered compounds : ${gapN} candidate(s) with no dossier`);
  report.dispatch.push({ agent: 'Coverage', input: `.planning/coverage/${TODAY}/SUMMARY.md`, candidates: +gapN });
}

// ── Layer 4 ────────────────────────────────────────────────────────────────────────────────────
banner(4, 'ASSESS');
fs.mkdirSync('.planning/loop', { recursive: true });
fs.writeFileSync(`.planning/loop/${TODAY}.json`, JSON.stringify(report, null, 2) + '\n');

const line = (label, arr) => console.log(`  ${label.padEnd(10)} ${arr.length}`);
line('HEAL', report.heal);
line('DISPATCH', report.dispatch);
line('ESCALATE', report.escalate);
line('LEARN', report.learn);
report.escalate.forEach((e) => console.log(`    escalate: ${e.gate} — ${e.findings}`));
report.learn.forEach((l) => console.log(`    learn:    ${l.signal} (${l.count})`));
console.log(`\nState: .planning/loop/${TODAY}.json`);
console.log('Worklists are inputs for the specialist agents; this script never writes content.');
