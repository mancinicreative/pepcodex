import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { trialStatusKey, formatTrialMonth, formatTrialCompletion, isNctId, trialPeptidePresentation } from '../src/lib/trial-display.mjs';

test('registry month and first-day dates retain their calendar month across time zones', () => {
  const moduleUrl = new URL('../src/lib/trial-display.mjs', import.meta.url).href;
  const code = `import {formatTrialMonth} from ${JSON.stringify(moduleUrl)}; console.log(JSON.stringify(['2009-01','2026-01-01','2026-04-30'].map(formatTrialMonth)));`;
  for (const tz of ['UTC','America/Toronto','America/Los_Angeles','Asia/Tokyo']) {
    const result = execFileSync(process.execPath,['--input-type=module','-e',code],{env:{...process.env,TZ:tz},encoding:'utf8'});
    assert.deepEqual(JSON.parse(result),['Jan 2009','Jan 2026','Apr 2026'],tz);
  }
});

test('missing and invalid completion dates have no invented date', () => {
  assert.equal(formatTrialMonth(undefined),'-');
  assert.equal(formatTrialMonth('not a date'),'-');
});

test('official and human-readable active-not-recruiting statuses share the Active filter', () => {
  for (const value of ['ACTIVE_NOT_RECRUITING','active not recruiting','active']) assert.equal(trialStatusKey(value),'active');
  assert.equal(trialStatusKey('RECRUITING'),'recruiting');
  assert.equal(trialStatusKey('NOT_YET_RECRUITING'),'not yet recruiting');
  assert.equal(trialStatusKey('TERMINATED'),'terminated');
  assert.equal(trialStatusKey(''), '');
});

test('completion estimates remain distinguishable from actual or untyped dates', () => {
  assert.equal(formatTrialCompletion('2028-05-17','ESTIMATED'),'May 2028 (estimated)');
  assert.equal(formatTrialCompletion('2009-01','ACTUAL'),'Jan 2009');
  assert.equal(formatTrialCompletion('2009-01',undefined),'Jan 2009 (date type unverified)');
  assert.equal(formatTrialCompletion('2027-02-14',undefined),'Feb 2027 (date type unverified)');
  assert.equal(formatTrialCompletion('2027-02-14','UNKNOWN'),'Feb 2027 (date type unverified)');
  assert.equal(formatTrialCompletion(undefined,'ESTIMATED'),'-');
});

test('historical descriptions and other registries cannot become ClinicalTrials.gov links', () => {
  for (const value of ['Historical', 'PLIVA-IBD-Trials', 'jRCT2031210504', 'CTR20211515', 'Unknown', 'NCT123', 'NCT123456789', undefined]) assert.equal(isNctId(value), false);
  for (const value of ['NCT02637284', 'NCT06373731']) assert.equal(isNctId(value), true);
});

test('parent thymosin beta-4 trials are not labelled or linked as TB-500', () => {
  assert.deepEqual(trialPeptidePresentation('tb-500', 'TB-500'), {
    label: 'Thymosin beta-4 (parent; not TB-500)', href: null,
  });
  assert.deepEqual(trialPeptidePresentation('tb-500', 'TB-500', 'NCT02668055'), {
    label: 'TB4-labelled scaffold (identity unverified)', href: null,
  });
  assert.deepEqual(trialPeptidePresentation('ghk-cu', 'GHK-Cu'), {
    label: 'GHK-Cu', href: '/peptides/ghk-cu',
  });
});
