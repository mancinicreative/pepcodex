import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { transformSync } from 'esbuild';

const root = fileURLToPath(new URL('../', import.meta.url));
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
  ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
const expressionPattern = /(?:new Date\([^)]*\)|[\w.]+)\.toLocaleDateString\('en-US',\s*\{[^}]*\}\)/g;
const calls = walk(path.join(root, 'src')).filter(file => file.endsWith('.astro')).flatMap(file => {
  const source = fs.readFileSync(file, 'utf8');
  return [...source.matchAll(expressionPattern)].map(match => ({ file: path.relative(root, file).replaceAll('\\', '/'),
    expression: match[0], receiver: match[0].split('.toLocaleDateString')[0],
    line: source.slice(0, match.index).split('\n').length }));
});
const styleByCall = {
  'src/components/BlogCard.astro:publishDate': 'short',
  'src/components/RatingCard.astro:new Date(scoring.lastScored)': 'monthLong',
  'src/components/RatingCard.astro:ratings.lastReviewed': 'monthLong',
  'src/components/TrialTable.astro:date': 'monthShort',
  'src/layouts/BlogLayout.astro:publishDate': 'long',
  'src/layouts/BlogLayout.astro:lastUpdated': 'long',
  'src/layouts/CalculatorLayout.astro:lastUpdated': 'long',
  'src/layouts/ComparisonLayout.astro:lastUpdated': 'long',
  'src/layouts/ConditionLayout.astro:lastUpdated': 'monthShort',
  'src/layouts/DossierLayout.astro:new Date(lastUpdated)': 'short',
  'src/layouts/GlossaryLayout.astro:lastUpdated': 'long',
  'src/layouts/GuideLayout.astro:lastUpdated': 'long',
  'src/layouts/ProtocolLayout.astro:lastUpdated': 'long',
  'src/layouts/SafetyLayout.astro:lastUpdated': 'long',
  'src/pages/regulatory-tracker.astro:lastUpdatedDate': 'monthLong',
};
const samples = [
  { date: '2026-01-28', long: 'January 28, 2026', short: 'Jan 28, 2026', monthLong: 'January 2026', monthShort: 'Jan 2026' },
  { date: '2026-01-01', long: 'January 1, 2026', short: 'Jan 1, 2026', monthLong: 'January 2026', monthShort: 'Jan 2026' },
  { date: '2024-03-01', long: 'March 1, 2024', short: 'Mar 1, 2024', monthLong: 'March 2024', monthShort: 'Mar 2024' },
  { date: '2024-02-29', long: 'February 29, 2024', short: 'Feb 29, 2024', monthLong: 'February 2024', monthShort: 'Feb 2024' },
  { date: '2026-12-31', long: 'December 31, 2026', short: 'Dec 31, 2026', monthLong: 'December 2026', monthShort: 'Dec 2026' },
  { date: '2027-01-01', long: 'January 1, 2027', short: 'Jan 1, 2027', monthLong: 'January 2027', monthShort: 'Jan 2027' },
  { date: '2026-03-08', long: 'March 8, 2026', short: 'Mar 8, 2026', monthLong: 'March 2026', monthShort: 'Mar 2026' },
  { date: '2026-11-01', long: 'November 1, 2026', short: 'Nov 1, 2026', monthLong: 'November 2026', monthShort: 'Nov 2026' },
];
const child = `
import fs from 'node:fs'; import vm from 'node:vm';
const input = JSON.parse(fs.readFileSync(0, 'utf8'));
const NativeDate = Date;
class FixedDate extends NativeDate { constructor(...args) { super(...(args.length ? args : ['2026-01-01T00:30:00Z'])); } }
const rendered = input.calls.map(call => ({ ...call, values: input.samples.map(sample => {
  const date = new NativeDate(sample.date);
  return vm.runInNewContext(call.expression, { Date: FixedDate, date, publishDate: input.publishDate ? new NativeDate(input.publishDate) : date, lastUpdated: date,
    lastUpdatedDate: date, scoring: { lastScored: sample.date }, ratings: { lastReviewed: date } });
}) }));
const context = {}; vm.createContext(context); vm.runInContext(input.trialFunctions, context);
const trials = ['2026-01-01','2026-03','2024-02-29',undefined,'2026','2023-02-29','2026-02-30','2026-04-31',
  '2026-00','2026-13','2026-01-00','2026-01-32','invalid','','0000','2026-1','2026-01-01T00:00:00Z'].map(value => context.formatDate(value));
const labels = ['ACTUAL','ESTIMATED',undefined].map(value => context.completionLabel(value));
process.stdout.write(JSON.stringify({ rendered, trials, labels }));
`;
function evaluate(timeZone, publishDate) {
  const source = fs.readFileSync(path.join(root, 'src/components/TrialTable.astro'), 'utf8');
  const functions = ['formatDate', 'completionLabel'].map(name => {
    const match = source.match(new RegExp(`function ${name}\\([\\s\\S]*?^}`, 'm'));
    assert.ok(match, `Actual TrialTable ${name} function is available`);
    return match[0];
  }).join('\n');
  const trialFunctions = transformSync(functions, { loader: 'ts', target: 'es2022' }).code;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', child], { cwd: root,
    env: { ...process.env, TZ: timeZone }, input: JSON.stringify({ calls, samples, trialFunctions, publishDate }), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test('all15 actual locale-date callsites are classified and calendar precision remains unchanged', () => {
  assert.equal(calls.length, 15);
  assert.deepEqual(calls.map(call => `${call.file}:${call.receiver}`).sort(), Object.keys(styleByCall).sort());
  for (const call of calls) {
    const style = styleByCall[`${call.file}:${call.receiver}`];
    assert.match(call.expression, /timeZone: 'UTC'/, `${call.file}:${call.line}`);
    assert.equal(/day:/.test(call.expression), ['short', 'long'].includes(style), `Precision changed: ${call.file}:${call.line}`);
  }
});

test('actual component calendar expressions render exact day/month/year boundaries in Toronto and UTC', () => {
  for (const zone of ['America/Toronto', 'UTC']) {
    for (const call of evaluate(zone).rendered) {
      const style = styleByCall[`${call.file}:${call.receiver}`];
      assert.deepEqual(call.values, samples.map(sample => sample[style]), `${zone} ${call.file}:${call.line}`);
    }
  }
});

test('actual Guide date fixes Jan28 regression in Toronto and UTC', () => {
  const toronto = evaluate('America/Toronto'), utc = evaluate('UTC');
  assert.equal(toronto.rendered.find(call => call.file.endsWith('/GuideLayout.astro')).values[0], 'January 28, 2026');
  assert.equal(utc.rendered.find(call => call.file.endsWith('/GuideLayout.astro')).values[0], 'January 28, 2026');
});

test('actual TrialTable preserves year/month precision, rejects impossible dates and retains actual/estimated labels', () => {
  for (const zone of ['America/Toronto', 'UTC']) {
    const result = evaluate(zone);
    assert.deepEqual(result.trials, ['Jan 2026', 'Mar 2026', 'Feb 2024', '-', '2026', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']);
    assert.deepEqual(result.labels, ['Actual', 'Estimated', 'Completion']);
  }
});

// Keep publication and revision dates distinct: this executes the added template expression.
test('actual Blog lastUpdated renders the revision date independently of publication in Toronto and UTC', () => {
  for (const zone of ['America/Toronto', 'UTC']) {
    const updated = evaluate(zone, '1999-12-31').rendered.find(call =>
      call.file === 'src/layouts/BlogLayout.astro' && call.receiver === 'lastUpdated');
    assert.ok(updated, 'Accepted G05 template supplies an explicit revision-date expression');
    assert.deepEqual(updated.values, samples.map(sample => sample.long));
    assert.ok(updated.values.every(value => !value.includes('1999')), 'Publication date cannot substitute for revision date');
  }
});
