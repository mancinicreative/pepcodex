import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const script = join(dirname(fileURLToPath(import.meta.url)), 'refresh-trials.mjs');
const excluded = 'NCT00000001';
const included = 'NCT00000002';

function study(id, overrides = {}) {
  return {
    hasResults: false,
    protocolSection: {
      identificationModule: { nctId: id, briefTitle: 'Synthetic registry fixture' },
      designModule: { phases: ['PHASE2'], enrollmentInfo: { count: 12, type: 'ACTUAL' } },
      statusModule: {
        overallStatus: 'ACTIVE_NOT_RECRUITING',
        startDateStruct: { date: '2025-01', type: 'ACTUAL' },
        primaryCompletionDateStruct: { date: '2026-03', type: 'ACTUAL' },
        completionDateStruct: { date: '2027-02', type: 'ESTIMATED' },
        lastUpdatePostDateStruct: { date: '2026-09-28', type: 'ACTUAL' },
      },
      conditionsModule: { conditions: ['Fixture condition'] },
      armsInterventionsModule: { interventions: [{ name: 'Fixture intervention' }] },
      ...overrides,
    },
  };
}

function run(pack, studies, args = ['--apply']) {
  const dir = mkdtempSync(join(tmpdir(), 'pepcodex-trial-refresh-'));
  try {
    const packs = join(dir, 'data', 'source-packs');
    mkdirSync(packs, { recursive: true });
    const file = join(packs, 'fixture.json');
    const before = JSON.stringify(pack, null, 2) + '\n';
    writeFileSync(file, before);
    const mock = join(dir, 'mock-fetch.mjs');
    // Inject only the public API response; run the actual CLI in an isolated pack directory.
    writeFileSync(mock, `globalThis.fetch = async () => ({ ok: true, json: async () => (${JSON.stringify({ studies, totalCount: studies.length })}) });`);
    const result = spawnSync(process.execPath, ['--import', pathToFileURL(mock).href, script, 'fixture', ...args], {
      cwd: dir, encoding: 'utf8', timeout: 15000,
    });
    assert.ifError(result.error);
    const after = readFileSync(file, 'utf8');
    return { ...result, before, after, pack: JSON.parse(after) };
  } finally {
    assert.equal(dirname(resolve(dir)), resolve(tmpdir()));
    assert.match(basename(dir), /^pepcodex-trial-refresh-/);
    rmSync(dir, { recursive: true, force: true });
  }
}

test('refresh honors reviewed exclusions for existing and newly discovered rows', () => {
  const result = run({
    peptide: 'Fixture',
    trials: [{ id: excluded, title: 'Old excluded row' }],
    trialExclusions: [{ nctId: excluded, reason: 'Explicitly mock protocol in authoritative record' }],
  }, [study(excluded), study(included)]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.pack.trials.map(row => row.id), [included]);
  assert.equal(result.pack.trialExclusions[0].nctId, excluded);
  assert.match(result.stdout, /removed from existing entries: 1/);
});

test('refresh preserves official status, study completion type and actual enrollment', () => {
  const result = run({ peptide: 'Fixture', trials: [{
    id: included, title: 'Curated title', regions: ['Curated region'],
    enrollmentTarget: 99, completionDate: '2024-01', completionDateType: 'ACTUAL',
  }] }, [study(included)]);
  assert.equal(result.status, 0, result.stderr);
  const row = result.pack.trials[0];
  assert.equal(row.title, 'Curated title');
  assert.deepEqual(row.regions, ['Curated region']);
  assert.equal(row.status, 'active not recruiting');
  assert.equal(row.completionDate, '2027-02');
  assert.equal(row.completionDateType, 'ESTIMATED');
  assert.equal(row.startDateType, 'ACTUAL');
  assert.equal(row.enrollment, 12);
  assert.equal(row.enrollmentType, 'ACTUAL');
  assert.equal('enrollmentTarget' in row, false);
});

test('refresh keeps enrollment by invitation and early phase distinctions', () => {
  const value = study(included);
  value.protocolSection.statusModule.overallStatus = 'ENROLLING_BY_INVITATION';
  value.protocolSection.designModule = { phases: ['EARLY_PHASE1'], enrollmentInfo: { count: 24, type: 'ESTIMATED' } };
  const result = run({ peptide: 'Fixture', trials: [] }, [value]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.pack.trials[0].status, 'enrolling by invitation');
  assert.equal(result.pack.trials[0].phase, 'early 1');
  assert.equal(result.pack.trials[0].enrollmentTarget, 24);
});

test('missing study completion never inherits primary completion or stale qualifiers', () => {
  const value = study(included);
  delete value.protocolSection.statusModule.completionDateStruct;
  const result = run({ peptide: 'Fixture', trials: [{ id: included, completionDate: '2026-01', completionDateType: 'ACTUAL' }] }, [value]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal('completionDate' in result.pack.trials[0], false);
  assert.equal('completionDateType' in result.pack.trials[0], false);
});

test('dry run leaves source bytes unchanged including excluded rows', () => {
  const result = run({ peptide: 'Fixture', trials: [{ id: excluded }], trialExclusions: [{ nctId: excluded, reason: 'Fixture exclusion' }] }, [study(included)], []);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.after, result.before);
});

test('malformed exclusion stops before rewriting a source pack', () => {
  const result = run({ peptide: 'Fixture', trials: [], trialExclusions: [{ nctId: excluded }] }, [study(excluded)]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Invalid trialExclusions/);
  assert.equal(result.after, result.before);
});
