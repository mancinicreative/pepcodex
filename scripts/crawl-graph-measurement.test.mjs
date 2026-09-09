import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { loadMeasurement, pageMeasurement, comparableMeasurement, digest } from './crawl-graph-measurement.mjs';

const property = 'https://www.pepcodex.com/';
const apex = 'https://pepcodex.com/';
const zero = { page: `${property}zero`, impressions: 0, clicks: 0 };
function workspace(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pepcodex-graph-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function exportRows(dir, rows, { modern = false, patch = {} } = {}) {
  const file = 'gsc-www-pepcodex-com-page.json';
  const bytes = JSON.stringify(rows);
  fs.writeFileSync(path.join(dir, file), bytes);
  const manifest = { pulledAt: '2026-09-02T22:04:55Z', properties: { [property]: { first: '2026-08-04', last: '2026-08-31' }, [apex]: { first: '2026-07-07', last: '2026-08-31' } } };
  if (modern) {
    Object.assign(manifest, { schemaVersion: 2, scope: { site: property, startDate: '2026-08-04', endDate: '2026-08-31', type: 'web', dataState: 'final', timezone: 'America/Los_Angeles' } });
    manifest.properties[property].cuts = { page: { status: 'COMPLETE', file, sha256: digest(bytes), rows: rows.length } };
  }
  Object.assign(manifest, patch);
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest));
  return manifest;
}

test('missing measurement and property selection are unknown, not zero', (t) => {
  const dir = workspace(t);
  for (const opts of [{ dataDir: dir }, { dataDir: dir, property }]) {
    const result = loadMeasurement(opts);
    assert.equal(result.status, 'UNAVAILABLE');
    assert.deepEqual(pageMeasurement(result, '/zero'), { impressions: null, clicks: null, silent: null, measurement: 'UNAVAILABLE' });
  }
});

test('explicit observed zero differs from unreturned pages; apex is never added', (t) => {
  const dir = workspace(t);
  exportRows(dir, [zero, { page: `${property}seen`, impressions: 5, clicks: 1 }]);
  fs.writeFileSync(path.join(dir, 'gsc-pepcodex-com-page.json'), JSON.stringify([{ page: `${apex}zero`, impressions: 900, clicks: 90 }]));
  const result = loadMeasurement({ dataDir: dir, property });
  assert.equal(result.status, 'AVAILABLE');
  assert.equal(pageMeasurement(result, '/zero').silent, true);
  assert.equal(pageMeasurement(result, '/seen').impressions, 5);
  assert.equal(pageMeasurement(result, '/absent').measurement, 'NOT_RETURNED');
  assert.equal(pageMeasurement(result, '/absent').impressions, null);
  assert.equal(result.scope.startDate, '2026-08-04');
  assert.match(result.provenance.legacyScopeAssumptions, /legacy/);
  assert.equal(loadMeasurement({ dataDir: dir }).status, 'UNAVAILABLE');
});

test('malformed exports invalidate the entire join rather than partly counting', (t) => {
  const dir = workspace(t);
  for (const rows of [null, {}, [zero, { page: `${property}bad`, impressions: '4', clicks: 0 }], [zero, { page: `${property}bad`, impressions: -1, clicks: 0 }], [zero, zero], [zero, { page: `${apex}foreign`, impressions: 1, clicks: 0 }]]) {
    exportRows(dir, rows);
    const result = loadMeasurement({ dataDir: dir, property });
    assert.equal(result.status, 'INVALID');
    assert.equal(result.seen.size, 0);
    assert.equal(pageMeasurement(result, '/zero').silent, null);
  }
  fs.writeFileSync(path.join(dir, 'manifest.json'), '{bad json');
  assert.equal(loadMeasurement({ dataDir: dir, property }).status, 'INVALID');
});

test('malformed measurement JSON cannot leak raw manifest or export snippets', (t) => {
  const dir = workspace(t);
  const canary = 'DO_NOT_ECHO_SYNTHETIC_MEASUREMENT_SECRET';
  for (const file of ['manifest.json', 'gsc-www-pepcodex-com-page.json']) {
    exportRows(dir, [zero]);
    fs.writeFileSync(path.join(dir, file), `${canary}{malformed-json`);
    const result = loadMeasurement({ dataDir: dir, property });
    assert.equal(result.status, 'INVALID');
    assert.equal(result.reason, 'Cannot validate measurement input; check manifest structure, dates and selected files.');
    assert.equal(JSON.stringify(result).includes(canary), false);
    assert.equal(result.seen.size, 0);
  }
});

test('v2 export is bound to scope, complete cut and bytes', (t) => {
  const dir = workspace(t);
  const manifest = exportRows(dir, [zero], { modern: true });
  const result = loadMeasurement({ dataDir: dir, property });
  assert.equal(result.status, 'AVAILABLE');
  assert.equal(result.provenance.legacyScopeAssumptions, null);
  fs.appendFileSync(path.join(dir, 'gsc-www-pepcodex-com-page.json'), ' ');
  assert.equal(loadMeasurement({ dataDir: dir, property }).status, 'INVALID');
  manifest.properties[property].cuts.page.status = 'FAILED';
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest));
  assert.equal(loadMeasurement({ dataDir: dir, property }).status, 'INVALID');
});

test('measurement comparison excludes mismatched windows, properties and built-page cohorts', () => {
  const current = { graphCohort: 'a', measurement: { status: 'AVAILABLE', scope: { property, startDate: '2026-08-04', endDate: '2026-08-31' } } };
  assert.equal(comparableMeasurement(current, structuredClone(current)), true);
  for (const previous of [undefined, { ...current, graphCohort: 'b' }, { ...current, measurement: { ...current.measurement, status: 'UNAVAILABLE' } }, { ...current, measurement: { ...current.measurement, scope: { ...current.measurement.scope, property: apex } } }, { ...current, measurement: { ...current.measurement, scope: { ...current.measurement.scope, startDate: '2026-07-07' } } }]) {
    assert.equal(comparableMeasurement(previous, current), false);
  }
});

test('invalid or conflicting dates and failed files never produce observed zero', (t) => {
  const dir = workspace(t);
  for (const invalid of ['2026-08-99', 'unknown', '2026-09-01']) {
    const manifest = exportRows(dir, [zero]);
    manifest.properties[property].first = invalid;
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest));
    assert.equal(loadMeasurement({ dataDir: dir, property }).status, 'INVALID');
  }
  const manifest = exportRows(dir, [zero], { modern: true });
  manifest.scope.startDate = '2026-08-05';
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest));
  assert.equal(loadMeasurement({ dataDir: dir, property }).status, 'INVALID');
  exportRows(dir, []);
  const empty = loadMeasurement({ dataDir: dir, property });
  assert.equal(empty.status, 'AVAILABLE');
  assert.equal(pageMeasurement(empty, '/zero').impressions, null);
  fs.unlinkSync(path.join(dir, 'gsc-www-pepcodex-com-page.json'));
  assert.equal(loadMeasurement({ dataDir: dir, property }).status, 'UNAVAILABLE');
});

const script = fileURLToPath(new URL('./crawl-graph.mjs', import.meta.url));
function runGraph(t, pages, args = []) {
  const dir = workspace(t);
  const dist = path.join(dir, 'dist');
  fs.mkdirSync(dist);
  for (const [route, links] of Object.entries(pages)) {
    const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `<html><title>Fixture</title>${links.map((link) => `<a href="${link}">Link</a>`).join('')}</html>`);
  }
  const output = path.join(dir, 'output');
  const result = spawnSync(process.execPath, [script, `--dist=${dist}`, `--data-dir=${dir}`, `--output-dir=${output}`, '--check', ...args], { encoding: 'utf8' });
  assert.equal(result.error, undefined);
  return { ...result, snapshot: JSON.parse(fs.readFileSync(path.join(output, 'graph-latest.json'), 'utf8')) };
}

test('graph checks pass without analytics while unknown values remain explicit', (t) => {
  const result = runGraph(t, { '/': ['/a'], '/a': ['/'] });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.snapshot.summary.observedImpressions, null);
  assert.equal(result.snapshot.summary.silent, null);
  assert.equal(result.snapshot.summary.unknownPages, 2);
  assert.match(result.stdout, /UNKNOWN/);
});

test('measurement-required mode fails independently from graph-only checks', (t) => {
  const result = runGraph(t, { '/': ['/a'], '/a': ['/'] }, ['--require-measurement']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /MEASUREMENT CHECK FAILED/);
});

test('unreachable gate catches an isolated linked cycle with no orphans or deep nodes', (t) => {
  const result = runGraph(t, { '/': ['/a'], '/a': ['/'], '/b': ['/c'], '/c': ['/b'] });
  assert.equal(result.snapshot.summary.orphans, 0);
  assert.equal(result.snapshot.summary.deep, 0);
  assert.equal(result.snapshot.summary.unreachable, 2);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /unreachable from homepage/);
});

test('existing broken-link, orphan and depth gates still fail', (t) => {
  for (const [pages, diagnostic] of [
    [{ '/': ['/a', '/missing'], '/a': ['/'] }, /broken internal link/],
    [{ '/': ['/a'], '/a': ['/'], '/orphan': ['/'] }, /orphan page/],
    [{ '/': ['/a'], '/a': ['/b', '/'], '/b': ['/c'], '/c': ['/d'], '/d': ['/'] }, /more than 3 clicks/],
  ]) {
    const result = runGraph(t, pages);
    assert.equal(result.status, 1);
    assert.match(result.stderr, diagnostic);
  }
});
