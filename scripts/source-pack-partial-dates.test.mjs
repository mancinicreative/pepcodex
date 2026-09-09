import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { transform } from 'esbuild';
import { validateSourcePack, validateSourcePackData } from './validate-source-pack.js';

const schema = JSON.parse(fs.readFileSync(new URL('../data/schemas/source-pack.schema.json', import.meta.url)));
const ajv = new Ajv({ allErrors: true }); addFormats(ajv);
const trialFields = schema.properties.trials.items.properties;
const fields = Object.fromEntries(['startDate', 'completionDate'].map(key => [key, ajv.compile(trialFields[key])]));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const fixture = name => new URL(`./fixtures/source-pack-partial-dates/${name}.json`, import.meta.url);

test('both trial fields accept a recorded year, month or valid full date without changing strings', () => {
  for (const value of ['0001', '1900', '2026', '9999', '2026-01', '2026-12', '0001-01', '9999-12', '2026-09-05']) {
    for (const [name, validate] of Object.entries(fields)) {
      assert.equal(validate(value), true, `${name}: ${value}`);
      const data = JSON.parse(fs.readFileSync(fixture('oveporexton')));
      data.trials[0][name] = value;
      const before = JSON.stringify(data);
      assert.equal(validateSourcePackData(data).valid, true, `${name}: ${value}`);
      assert.equal(JSON.stringify(data), before, 'Validation cannot expand date precision or mutate metadata');
    }
  }
});

test('malformed partial dates, non-calendar values and impossible full dates are rejected', () => {
  for (const value of ['', '0000', '0000-01', '202', '10000', '2026-00', '2026-13', '2026-1', '2026-02-30',
    '2026-04-31', '2026-01-00', '2026-01-32', '2026-13-01', '2026-09-5', '2026-09-05T00:00:00Z',
    ' 2026', '2026 ', '2026-unknown', 2026, false, {}, [], { status: 'unknown' }]) {
    for (const [name, validate] of Object.entries(fields)) assert.equal(validate(value), false, `${name}: ${JSON.stringify(value)}`);
  }
});

test('full-date branch retains Gregorian leap-day validation including century rules', () => {
  for (const validate of Object.values(fields)) {
    for (const value of ['2000-02-29', '2024-02-29', '2400-02-29']) assert.equal(validate(value), true, value);
    for (const value of ['1900-02-29', '2025-02-29', '2100-02-29']) assert.equal(validate(value), false, value);
  }
});

test('existing completion null and optional-field behavior remain intact; start null stays invalid', () => {
  assert.equal(fields.completionDate(null), true);
  assert.equal(fields.startDate(null), false);
  const data = JSON.parse(fs.readFileSync(fixture('oveporexton')));
  delete data.trials[0].startDate; delete data.trials[0].completionDate;
  assert.equal(validateSourcePackData(data).valid, true);
  data.trials[0].completionDate = null;
  assert.equal(validateSourcePackData(data).valid, true);
});

test('every previously accepted full-date contract remains an unchanged validation branch', () => {
  assert.deepEqual(trialFields.startDate.anyOf[0], { type: 'string', format: 'date' });
  assert.deepEqual(trialFields.completionDate.anyOf[0], { type: ['string', 'null'], format: 'date' });
  const old = ajv.compile({ type: 'string', format: 'date' });
  for (const year of ['0000', '0001', '1900', '2000', '2024', '2025', '2026', '2100', '9999']) {
    for (const month of ['01', '02', '04', '12']) for (const day of ['01', '28', '29', '30', '31']) {
      const value = `${year}-${month}-${day}`;
      for (const validate of Object.values(fields)) assert.equal(validate(value), old(value), value);
    }
  }
});

test('unchanged real ecnoglutide/pemvidutide month fixtures pass and oveporexton stays valid', () => {
  for (const [name, pointer, value] of [['ecnoglutide', 3, '2028-03'], ['pemvidutide', 0, '2028-12'], ['oveporexton', 0, '2025-06-03']]) {
    const file = fixture(name), before = fs.readFileSync(file), data = JSON.parse(before);
    assert.equal(data.trials[pointer].completionDate, value);
    const result = validateSourcePack(file);
    assert.equal(result.valid, true, `${name}: ${JSON.stringify(result.errors)}`);
    assert.match(result.verification, /NOT_ASSESSED/);
    assert.equal(sha(fs.readFileSync(file)), sha(before), `${name} fixture bytes changed`);
  }
});

test('existing TrialTable renders year/month precision without an invented month or day', async () => {
  const source = fs.readFileSync(new URL('../src/components/TrialTable.astro', import.meta.url), 'utf8');
  const functionSource = source.slice(source.indexOf('function formatDate('), source.indexOf('\n---', source.indexOf('function formatDate(')));
  assert.ok(functionSource.startsWith('function formatDate('));
  const compiled = await transform(`${functionSource}\nglobalThis.formatFixtureDate = formatDate;`, { loader: 'ts', format: 'iife' });
  const sandbox = vm.createContext({}); vm.runInContext(compiled.code, sandbox);
  for (const [input, output] of [['2028', '2028'], ['2028-03', 'Mar 2028'], ['2028-12', 'Dec 2028'], ['2024-02-29', 'Feb 2024'], ['2025-02-29', '-'], [null, '-']]) {
    assert.equal(sandbox.formatFixtureDate(input), output);
  }
});
