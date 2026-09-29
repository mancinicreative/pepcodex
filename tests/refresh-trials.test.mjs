import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../scripts/refresh-trials.mjs', import.meta.url));

function refresh(slug, trials, studies) {
  const dir = mkdtempSync(join(tmpdir(), 'pepcodex-trial-refresh-'));
  const packPath = join(dir, 'data', 'source-packs', `${slug}.json`);
  try {
    mkdirSync(dirname(packPath), { recursive: true });
    writeFileSync(packPath, JSON.stringify({ peptide: slug, trials }));
    const fixture = `globalThis.fetch = async () => ({ ok: true, json: async () => (${JSON.stringify({ totalCount: studies.length, studies })}) });`;
    const preload = `data:text/javascript,${encodeURIComponent(fixture)}`;
    const output = execFileSync(process.execPath, ['--import', preload, script, slug, '--apply'], {
      cwd: dir,
      encoding: 'utf8',
    });
    return { pack: JSON.parse(readFileSync(packPath, 'utf8')), output };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function study(id, studyDate, studyType, primaryDate) {
  return {
    protocolSection: {
      identificationModule: { nctId: id, briefTitle: id },
      statusModule: {
        overallStatus: 'COMPLETED',
        completionDateStruct: studyDate ? { date: studyDate, type: studyType } : undefined,
        primaryCompletionDateStruct: { date: primaryDate, type: 'ACTUAL' },
      },
      designModule: { phases: ['PHASE2'] },
    },
  };
}

test('refresh keeps Study Completion date and type together, including type-only changes', () => {
  const { pack, output } = refresh('test-peptide', [
    { id: 'NCT00000001', completionDate: '2026-06', completionDateType: 'ACTUAL' },
    { id: 'NCT00000002', completionDate: '2025-01', completionDateType: 'ACTUAL' },
    { id: 'NCT00000003', completionDate: '2025-02', completionDateType: 'ACTUAL' },
  ], [
    study('NCT00000001', '2026-06', 'ESTIMATED', '2025-03'),
    study('NCT00000002', '2026-07', 'ACTUAL', '2025-04'),
    study('NCT00000003', '2026-08', undefined, '2025-05'),
    study('NCT00000004', '2026-09', undefined, '2025-06'),
  ]);
  assert.match(output, /updated: 3/);
  assert.equal(pack.trials[0].completionDate, '2026-06');
  assert.equal(pack.trials[0].completionDateType, 'ESTIMATED');
  assert.equal(pack.trials[1].completionDate, '2026-07');
  assert.equal(pack.trials[1].completionDateType, 'ACTUAL');
  assert.equal(pack.trials[2].completionDate, '2026-08');
  assert.equal('completionDateType' in pack.trials[2], false);
  assert.equal(pack.trials[3].completionDate, '2026-09');
  assert.equal('completionDateType' in pack.trials[3], false);
});

test('TB-500 automatic apply rejects parent-trial updates before fetch or sync stamp', () => {
  assert.throws(
    () => refresh('tb-500', [], [study('NCT00000005', '2026-09', 'ESTIMATED', '2025-06')]),
    (error) => error.status === 1 && /automatic refresh is disabled/.test(String(error.stderr)),
  );
});
