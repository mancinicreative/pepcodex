import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { transform } from 'esbuild';

const indexSource = fs.readFileSync(new URL('../src/pages/trials/index.astro', import.meta.url), 'utf8');
const tableSource = fs.readFileSync(new URL('../src/components/TrialTable.astro', import.meta.url), 'utf8');
// Execute the real source-pack ingestion block, without unrelated Astro rendering/browser code.
const frontmatter = indexSource.slice(indexSource.indexOf('---') + 3, indexSource.indexOf('// Sort by status'))
  .replace(/^import[^\n]+\r?\n/gm, '');
assert.ok(frontmatter.includes('allTrials.push'));
const mappingCode = (await transform(`${frontmatter}\nglobalThis.mappedTrials = allTrials;`, { loader: 'ts', format: 'iife' })).code;
const labelStart = tableSource.indexOf('function completionLabel(');
assert.ok(labelStart >= 0);
const labelCode = (await transform(tableSource.slice(labelStart, tableSource.indexOf('function formatDate(', labelStart)) +
  '\nglobalThis.label = completionLabel;', { loader: 'ts', format: 'iife' })).code;
const labels = vm.createContext({}); vm.runInContext(labelCode, labels);
function ingest(trials) {
  const pack = { peptide: 'Fixture', trials }, before = JSON.stringify(pack), errors = [];
  const sandbox = vm.createContext({ path, process: { cwd: () => '/fixture' },
    fs: { readdirSync: () => ['fixture.json'], readFileSync: () => JSON.stringify(pack) },
    console: { error: (...args) => errors.push(args) } });
  vm.runInContext(mappingCode, sandbox);
  assert.deepEqual(errors, []);
  assert.equal(JSON.stringify(pack), before, 'Source values must not be changed by mapping');
  return sandbox.mappedTrials;
}
const trial = values => ({ nctId: 'NCT12345678', title: 'Fixture trial', status: 'completed', phase: '2', conditions: [], interventions: [], ...values });

test('actual/estimated types survive actual trials-index ingestion and reach the existing table labels', () => {
  for (const [type, label] of [['ACTUAL', 'Actual'], ['ESTIMATED', 'Estimated'], ['actual', 'Actual'], ['estimated', 'Estimated']]) {
    const row = ingest([trial({ completionDate: '2028-03', completionDateType: type })])[0];
    assert.equal(row.completionDateType, type);
    assert.equal(row.completionDate, '2028-03');
    assert.equal(labels.label(row.completionDateType), label);
  }
});

test('missing, malformed or unrecognized date types remain unclassified rather than inferred', () => {
  for (const type of [undefined, null, '', 'UNKNOWN', 42, true, false, {}, [], { toLowerCase: 'ACTUAL' }]) {
    const input = trial({ completionDate: '2028', ...(type === undefined ? {} : { completionDateType: type }) });
    const row = ingest([input])[0];
    assert.equal(JSON.stringify(row.completionDateType), JSON.stringify(type));
    assert.equal(row.completionDate, '2028');
    assert.equal(labels.label(row.completionDateType), 'Completion');
  }
});

test('mapping preserves start/completion strings, null completion and source array order', () => {
  const inputs = [trial({ title: 'First', startDate: '2026', completionDate: null, completionDateType: 'ACTUAL' }),
    trial({ title: 'Second', startDate: '2026-09', completionDate: '2028-03-12', completionDateType: 'ESTIMATED' })];
  const rows = ingest(inputs);
  for (const [index, row] of rows.entries()) {
    assert.equal(row.title, inputs[index].title);
    assert.equal(row.startDate, inputs[index].startDate);
    assert.equal(row.completionDate, inputs[index].completionDate);
    assert.equal(row.completionDateType, inputs[index].completionDateType);
  }
});
