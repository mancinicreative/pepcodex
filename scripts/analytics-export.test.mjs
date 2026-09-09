import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { exportOptions, createExport, collectGsc, collectGa4, comparisonWindows, publishSuccessful, safeError } from './lib/analytics-export.mjs';
import { runGsc, GSC_CUTS } from './gsc-repull.mjs';
import { runGa4, REPORTS } from './ga4-pull.mjs';
import { loadMeasurement } from './crawl-graph-measurement.mjs';

const SITE = 'https://www.pepcodex.com/';
const DATES = { startDate: '2026-08-04', endDate: '2026-08-31' };
const SHORT_DATES = { startDate: '2026-08-04', endDate: '2026-08-05' };
const SHORT_PREVIOUS = { startDate: '2026-08-02', endDate: '2026-08-03' };
const TOKEN = 'synthetic-fixture-token';
function temporary(t) {
  const root = fs.realpathSync(os.tmpdir());
  const dir = fs.mkdtempSync(path.join(root, 'pepcodex-analytics-test-'));
  t.after(() => {
    const resolved = fs.realpathSync(dir);
    assert.equal(path.dirname(resolved), root, 'cleanup must remain directly within OS tmp');
    assert.match(path.basename(resolved), /^pepcodex-analytics-test-/);
    fs.rmSync(resolved, { recursive: true, force: true });
  });
  return dir;
}
const options = (t, suffix = 'export') => ({ ...DATES, out: path.join(temporary(t), suffix), maxPages: 3 });
const gscOptions = t => ({ ...options(t), ...SHORT_DATES });
const read = (dir, file) => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
const gscRow = keys => ({ keys, clicks: 1, impressions: 10, ctr: 0.1, position: 4 });
const gscBody = { ...DATES, dimensions: ['page'], type: 'web', dataState: 'final', aggregationType: 'auto' };
const gaBody = { dateRanges: [DATES], dimensions: [{ name: 'hostName' }], metrics: [{ name: 'sessions' }] };
function gaResponse(body, count = 1, values = ['www.pepcodex.com'], metadata = {}) {
  return {
    dimensionHeaders: body.dimensions.map(d => ({ name: d.name })),
    metricHeaders: body.metrics.map(m => ({ name: m.name, type: 'TYPE_INTEGER' })),
    rows: values.map(value => ({ dimensionValues: body.dimensions.map(() => ({ value })), metricValues: body.metrics.map(() => ({ value: '3' })) })),
    rowCount: count,
    metadata: { timeZone: 'America/Toronto', subjectToThresholding: false, ...metadata },
    propertyQuota: { tokensPerDay: { consumed: 1, remaining: 100 } },
  };
}

test('options preserve explicit dates and use completed Pacific days; invalid dates/options reject', () => {
  const now = new Date('2026-09-05T02:00:00Z');
  assert.deepEqual(exportOptions([], now), { startDate: '2026-08-05', endDate: '2026-09-01', maxPages: 10 });
  assert.equal(exportOptions(['--start=2026-08-04', '--end=2026-08-31'], now).startDate, DATES.startDate);
  for (const args of [['--start=2026-02-30'], ['--end=2026-09-04'], ['--max-pages=0'], ['--end=2026-08-31', '--end=2026-08-30'], ['--unknown=yes']]) {
    assert.throws(() => exportOptions(args, now));
  }
});

test('safeError never echoes server/auth payloads and preserves only allowlisted codes', async t => {
  const canary = 'DO_NOT_ECHO_SYNTHETIC_ERROR_SECRET';
  const malicious = {
    message: `${canary} access_token=fixture`,
    code: canary,
    response: { status: 401, data: { error_description: canary, error: { message: canary } }, config: { headers: { Authorization: `Bearer ${canary}` } } },
    safeGoogleError: { code: canary, message: canary, action: canary },
  };
  assert.deepEqual(safeError(malicious), { code: 401, message: 'Authentication failed; renew Google authorization.' });
  assert.deepEqual(safeError({ ...malicious, response: { ...malicious.response, status: 500 } }), { code: 500, message: 'Google service request failed.' });
  const trusted = { ...malicious, safeGoogleError: { code: 'REAUTH_REQUIRED', message: canary, action: canary } };
  assert.deepEqual(safeError(trusted), { code: 'REAUTH_REQUIRED', message: 'Owner must renew desktop ADC using .planning/GOOGLE-API-SETUP.md.' });
  for (const error of [malicious, trusted, { message: canary }, { safeGoogleError: { code: '__proto__', message: canary } }]) {
    assert.equal(JSON.stringify(safeError(error)).includes(canary), false);
  }
  const run = await runGsc(gscOptions(t), { tokenProvider: async () => { throw trusted; } });
  assert.equal(run.manifest.status, 'FAILED');
  const manifestText = fs.readFileSync(path.join(run.out, 'manifest.json'), 'utf8');
  assert.equal(manifestText.includes(canary), false);
  assert.equal(read(run.out, 'manifest.json').errors[0].code, 'REAUTH_REQUIRED');
});

test('evidence directories are never overwritten, even if previously empty', t => {
  const opts = options(t);
  const run = createExport('fixture', opts);
  fs.writeFileSync(path.join(run.out, 'existing.txt'), 'original');
  assert.throws(() => createExport('fixture', opts), /EEXIST/);
  assert.equal(fs.readFileSync(path.join(run.out, 'existing.txt'), 'utf8'), 'original');
  const empty = path.join(path.dirname(run.out), 'empty');
  fs.mkdirSync(empty);
  assert.throws(() => createExport('fixture', { ...opts, out: empty }), /EEXIST/);
});

test('comparison windows are equally long, inclusive, adjacent and nonoverlapping', () => {
  assert.deepEqual(comparisonWindows(DATES), { current: DATES, previous: { startDate: '2026-07-07', endDate: '2026-08-03' } });
  assert.deepEqual(comparisonWindows(SHORT_DATES), { current: SHORT_DATES, previous: SHORT_PREVIOUS });
  assert.deepEqual(comparisonWindows({ startDate: '2026-01-01', endDate: '2026-01-01' }).previous, { startDate: '2025-12-31', endDate: '2025-12-31' });
});

test('latest-successful validates completion and points to immutable manifest bytes', t => {
  const opts = options(t);
  const run = createExport('gsc', opts);
  const pointerFile = path.join(path.dirname(run.out), 'latest-successful-gsc-www-pepcodex-com.json');
  for (const status of ['RUNNING', 'FAILED', 'INCOMPLETE']) {
    run.manifest.status = status;
    assert.throws(() => publishSuccessful(run, SITE), /complete/);
    assert.equal(fs.existsSync(pointerFile), false);
  }
  run.manifest.status = 'COMPLETE';
  run.manifest.finishedAt = '2026-09-05T12:00:00Z';
  run.checkpoint();
  publishSuccessful(run, SITE);
  const pointer = read(path.dirname(run.out), path.basename(pointerFile));
  assert.equal(pointer.run, path.basename(run.out));
  assert.equal(pointer.manifestSha256, createHash('sha256').update(fs.readFileSync(path.join(run.out, 'manifest.json'))).digest('hex'));
  assert.deepEqual(pointer.scope, run.manifest.scope);
  assert.equal(fs.readdirSync(path.dirname(run.out)).some(file => file.endsWith('.tmp')), false);
});

test('GSC pagination preserves final scope, uses offsets and retains every raw page', async () => {
  const requests = [], captured = [];
  const result = await collectGsc(async query => {
    requests.push(query);
    return { responseAggregationType: 'byPage', rows: query.startRow === 0 ? [gscRow([SITE + 'a']), gscRow([SITE + 'b'])] : [gscRow([SITE + 'c'])] };
  }, gscBody, { rowLimit: 2, onPage: (...args) => captured.push(args) });
  assert.equal(result.rows.length, 3);
  assert.deepEqual(requests.map(r => r.startRow), [0, 2]);
  for (const query of requests) assert.deepEqual(query, { ...gscBody, rowLimit: 2, startRow: query.startRow });
  assert.equal(captured.length, 2);
  assert.equal(captured[1][2].rows[0].keys[0], SITE + 'c');
});

test('GSC rejects duplicate pages, caps, malformed rows and aggregation drift', async () => {
  await assert.rejects(collectGsc(async () => ({ rows: [gscRow(['a'])] }), gscBody, { rowLimit: 1, maxPages: 2 }), /Repeated/);
  await assert.rejects(collectGsc(async q => ({ rows: [gscRow([String(q.startRow)])] }), gscBody, { rowLimit: 1, maxPages: 2 }), /max-pages/);
  for (const result of [{ rows: {} }, { rows: [{ ...gscRow(['a']), impressions: '10' }] }, { rows: [gscRow([])] }, { rows: [gscRow(['a']), gscRow(['b'])] }]) {
    await assert.rejects(collectGsc(async () => result, gscBody, { rowLimit: 1 }), /Malformed|exceeded/);
  }
  await assert.rejects(collectGsc(async q => ({ rows: q.startRow ? [] : [gscRow(['a'])], responseAggregationType: q.startRow ? 'byProperty' : 'byPage' }), gscBody, { rowLimit: 1 }), /aggregation changed/);
});

test('GSC exposed daily cap is incomplete even when another request would be empty', async () => {
  const calls = [];
  await assert.rejects(collectGsc(async query => {
    calls.push(query.startRow);
    return { rows: query.startRow < 4 ? [gscRow([String(query.startRow)]), gscRow([String(query.startRow + 1)])] : [] };
  }, gscBody, { rowLimit: 2, maxRows: 4, maxPages: 3 }), /daily row cap=4/);
  assert.deepEqual(calls, [0, 2]);
});

function fakeGsc(calls, failDimension) {
  return async (url, token, body) => {
    assert.equal(token, TOKEN);
    calls.push({ url, body });
    if (!body) return { siteEntry: [{ siteUrl: SITE, permissionLevel: 'siteFullUser' }, { siteUrl: 'https://pepcodex.com/', permissionLevel: 'siteFullUser' }] };
    if (failDimension && body.dimensions[0] === failDimension) throw new Error('Synthetic cut failure');
    const keys = body.dimensions.map(dim => dim === 'page' ? SITE + 'page' : dim === 'date' ? body.startDate : dim === 'searchAppearance' ? 'none' : 'fixture');
    return { rows: body.dimensions.includes('searchAppearance') ? [] : [gscRow(keys)], responseAggregationType: body.dimensions.includes('page') ? 'byPage' : 'byProperty' };
  };
}

test('GSC run binds selected property/date scope to preserved files, including empty cuts', async t => {
  const calls = [];
  const request = fakeGsc(calls);
  const run = await runGsc(gscOptions(t), { request: (url, body) => request(url, TOKEN, body) });
  assert.equal(run.manifest.status, 'COMPLETE', JSON.stringify(run.manifest.errors));
  assert.deepEqual(Object.keys(run.manifest.properties), [SITE]);
  assert.deepEqual(run.manifest.scope, { ...SHORT_DATES, site: SITE, type: 'web', dataState: 'final', timezone: 'America/Los_Angeles' });
  assert.equal(calls.length, GSC_CUTS.length * 4 + 1);
  for (const { url, body } of calls.filter(c => c.body)) {
    assert.match(url, new RegExp(encodeURIComponent(SITE)));
    assert.equal(body.startDate, body.endDate, 'each API request covers one calendar day');
    assert.ok(['2026-08-02', '2026-08-03', '2026-08-04', '2026-08-05'].includes(body.startDate));
    assert.equal(body.dataState, 'final');
    assert.equal(body.type, 'web');
    assert.equal(body.startRow, 0);
  }
  const cut = run.manifest.properties[SITE].cuts.appearance;
  assert.equal(cut.status, 'COMPLETE');
  assert.deepEqual(read(run.out, cut.file), []);
  assert.equal(read(run.out, 'raw/page-2026-08-04-0.json').request.dataState, 'final');
  assert.equal(read(run.out, 'raw/previous-page-2026-08-02-0.json').request.startDate, '2026-08-02');
  const currentPage = run.manifest.properties[SITE].cuts.page;
  assert.equal(currentPage.daily.length, 2);
  assert.ok(currentPage.daily.every(day => day.status === 'COMPLETE'));
  assert.deepEqual(run.manifest.properties[SITE].previous.requested, SHORT_PREVIOUS);
  assert.equal(run.manifest.properties[SITE].previous.cuts.page.daily.length, 2);
  assert.equal(read(run.out, currentPage.file)[0].impressions, 20);
  assert.equal(loadMeasurement({ dataDir: run.out, property: SITE }).status, 'AVAILABLE', 'real exporter output must join graph contract');
});

test('GSC failed authentication and partial exports retain truthful manifests', async t => {
  let called = false;
  const failed = await runGsc(gscOptions(t), { tokenProvider: async () => { throw new Error('Synthetic auth failure'); }, request: async () => { called = true; } });
  assert.equal(failed.manifest.status, 'FAILED');
  assert.equal(read(failed.out, 'manifest.json').errors[0].stage, 'authentication');
  assert.equal(called, false);
  const partial = await runGsc(gscOptions(t), { tokenProvider: async () => TOKEN, request: fakeGsc([], 'page') });
  assert.equal(partial.manifest.status, 'INCOMPLETE');
  assert.equal(partial.manifest.properties[SITE].cuts.totals.status, 'COMPLETE');
  assert.equal(partial.manifest.properties[SITE].cuts.page.status, 'INCOMPLETE');
  assert.equal(partial.manifest.properties[SITE].cuts.page.daily[0].status, 'INCOMPLETE');
  assert.equal(fs.existsSync(path.join(partial.out, 'gsc-www-pepcodex-com-page.json')), false);
  assert.equal(loadMeasurement({ dataDir: partial.out, property: SITE }).status, 'INVALID');
});

test('GA4 pagination follows rowCount and retains threshold/quota metadata in captured responses', async () => {
  const captured = [];
  const result = await collectGa4(async query => gaResponse(query, 3, query.offset ? ['third'] : ['first', 'second'], { subjectToThresholding: true, samplingMetadatas: [{ samplesReadCount: '50', samplingSpaceSize: '100' }] }), gaBody, { limit: 2, onPage: (...args) => captured.push(args) });
  assert.equal(result.rows.length, 3);
  assert.deepEqual(captured.map(c => c[1].offset), [0, 2]);
  assert.equal(result.metadata.subjectToThresholding, true);
  assert.equal(result.metadata.samplingMetadatas[0].samplesReadCount, '50');
  assert.equal(result.metadataPages.length, 2);
  assert.equal(result.metadataPages[1].subjectToThresholding, true);
  assert.equal(captured[1][2].propertyQuota.tokensPerDay.consumed, 1);
  assert.deepEqual(captured[1][1].dateRanges, [DATES]);
});

test('GA4 rejects duplicate rows, rowCount/schema drift, premature empty pages and caps', async () => {
  await assert.rejects(collectGa4(async q => gaResponse(q, 2, ['same']), gaBody, { limit: 1 }), /Repeated/);
  await assert.rejects(collectGa4(async q => gaResponse(q, q.offset ? 3 : 2, [String(q.offset)]), gaBody, { limit: 1 }), /row count changed/);
  await assert.rejects(collectGa4(async q => ({ ...gaResponse(q, 2, [String(q.offset)]), metricHeaders: [{ name: q.offset ? 'users' : 'sessions' }] }), gaBody, { limit: 1 }), /schema|headers/);
  await assert.rejects(collectGa4(async q => gaResponse(q, 2, [String(q.offset)], { timeZone: q.offset ? 'UTC' : 'America/Toronto' }), gaBody, { limit: 1 }), /timezone changed/);
  await assert.rejects(collectGa4(async q => gaResponse(q, 2, q.offset ? [] : ['first']), gaBody, { limit: 1 }), /before rowCount/);
  await assert.rejects(collectGa4(async q => gaResponse(q, 3, [String(q.offset)]), gaBody, { limit: 1, maxPages: 2 }), /max-pages/);
});

test('GA4 malformed counts, headers, and metrics cannot be marked complete', async () => {
  const valid = gaResponse(gaBody);
  const missingCount = structuredClone(valid); delete missingCount.rowCount;
  const missingHeaders = structuredClone(valid); delete missingHeaders.metricHeaders;
  const badMetric = structuredClone(valid); badMetric.rows[0].metricValues[0].value = 'not-a-number';
  const missingDimension = structuredClone(valid); missingDimension.rows[0].dimensionValues = [];
  for (const response of [missingCount, missingHeaders, badMetric, missingDimension, { ...valid, rowCount: -1 }]) {
    await assert.rejects(collectGa4(async () => response, gaBody), /Malformed|rowCount|schema|metric|header/i);
  }
});

function fakeGa4(calls, failOnCall) {
  return async (url, token, body) => {
    assert.equal(token, TOKEN);
    calls.push({ url, body });
    if (calls.length === failOnCall) throw new Error('Synthetic report failure');
    const empty = body.metrics[0].name === 'eventCount';
    return gaResponse(body, empty ? 0 : 1, empty ? [] : ['www.pepcodex.com'], { subjectToThresholding: true, dataLossFromOtherRow: true });
  };
}

test('GA4 raw and only-www hostname views coexist with scope and empty reports persisted', async t => {
  const calls = [];
  const request = fakeGa4(calls);
  const run = await runGa4(options(t), { request: (url, body) => request(url, TOKEN, body) });
  assert.equal(run.manifest.status, 'COMPLETE');
  assert.equal(run.manifest.scope.timezone, 'America/Toronto');
  assert.equal(run.manifest.scope.property, '521749549');
  assert.equal(Object.keys(run.manifest.reports).length, (REPORTS.length + 4) * 2);
  const filtered = calls.filter(c => c.body.dimensionFilter);
  assert.equal(filtered.length, 8);
  for (const { body } of filtered) assert.deepEqual(body.dimensionFilter, { filter: { fieldName: 'hostName', stringFilter: { matchType: 'EXACT', value: 'www.pepcodex.com', caseSensitive: false } } });
  for (const { url, body } of calls) {
    assert.match(url, /properties\/521749549:runReport$/);
    assert.ok([JSON.stringify([DATES]), JSON.stringify([comparisonWindows(DATES).previous])].includes(JSON.stringify(body.dateRanges)));
    assert.equal(body.limit, 10000, 'old low row limits must not truncate exports');
    assert.equal(body.offset, 0);
    assert.equal(body.metricFilter, undefined, 'no hidden channel/country filtering');
  }
  assert.equal(run.manifest.reports['ga4-totals'].filter, null);
  assert.equal(run.manifest.reports['ga4-totals-www'].filter.filter.fieldName, 'hostName');
  assert.deepEqual(run.manifest.reports['previous-ga4-totals-www'].dateRange, comparisonWindows(DATES).previous);
  assert.equal(run.manifest.reports['previous-ga4-totals-www'].window, 'previous');
  assert.equal(run.manifest.reports['previous-ga4-totals-www'].metadataPages[0].subjectToThresholding, true);
  assert.deepEqual(read(run.out, 'ga4-events.json'), []);
  const raw = read(run.out, 'raw/ga4-events-0.json');
  assert.equal(raw.response.rowCount, 0);
  assert.equal(raw.response.metadata.subjectToThresholding, true);
  assert.equal(raw.response.metadata.dataLossFromOtherRow, true);
  assert.equal(raw.response.propertyQuota.tokensPerDay.remaining, 100);
  assert.equal(run.manifest.reports['ga4-events'].status, 'COMPLETE');
  assert.deepEqual(read(run.out, 'previous-ga4-events.json'), []);
});

test('GSC discovers appearance types before filtered page/query cuts and weights daily metrics', async t => {
  const calls = [];
  const run = await runGsc(gscOptions(t), { request: async (url, body) => {
    if (!body) return { siteEntry: [{ siteUrl: SITE }] };
    calls.push(body);
    const keys = body.dimensions.map(dim => dim === 'page' ? SITE + 'page' : dim === 'date' ? body.startDate : dim === 'searchAppearance' ? 'RICH_RESULTS' : 'fixture');
    const first = body.startDate === SHORT_DATES.startDate;
    return { rows: [{ keys, impressions: first ? 10 : 30, clicks: first ? 1 : 9, ctr: first ? 0.1 : 0.3, position: first ? 2 : 6 }], responseAggregationType: 'byPage' };
  } });
  assert.equal(run.manifest.status, 'COMPLETE', JSON.stringify(run.manifest.errors));
  for (const [details, dates] of [[run.manifest.properties[SITE], SHORT_DATES], [run.manifest.properties[SITE].previous, SHORT_PREVIOUS]]) {
    const discovery = details.cuts.appearance;
    const cut = details.cuts['appearance-0-page-query'];
    assert.equal(discovery.status, 'COMPLETE');
    assert.equal(cut.status, 'COMPLETE');
    assert.deepEqual(cut.dimensions, ['page', 'query']);
    assert.deepEqual(cut.filters, [{ dimension: 'searchAppearance', operator: 'equals', expression: 'RICH_RESULTS' }]);
    const discoveryIndex = calls.findIndex(body => body.startDate === dates.startDate && body.dimensions.includes('searchAppearance'));
    const filteredIndex = calls.findIndex(body => body.startDate === dates.startDate && body.dimensionFilterGroups);
    assert.ok(discoveryIndex >= 0 && filteredIndex > discoveryIndex);
  }
  for (const body of calls.filter(body => body.dimensionFilterGroups)) {
    assert.deepEqual(body.dimensions, ['page', 'query']);
    assert.deepEqual(body.dimensionFilterGroups, [{ groupType: 'and', filters: [{ dimension: 'searchAppearance', operator: 'equals', expression: 'RICH_RESULTS' }] }]);
  }
  const combined = read(run.out, run.manifest.properties[SITE].cuts.page.file)[0];
  assert.deepEqual({ clicks: combined.clicks, impressions: combined.impressions, ctr: combined.ctr, position: combined.position }, { clicks: 10, impressions: 40, ctr: 25, position: 5 });
});

test('GSC out-of-day date rows preserve raw evidence and fail the cut', async t => {
  const request = fakeGsc([]);
  const run = await runGsc(gscOptions(t), { request: async (url, body) => {
    const response = await request(url, TOKEN, body);
    if (body?.dimensions.includes('date')) response.rows[0].keys[body.dimensions.indexOf('date')] = '2026-01-01';
    return response;
  } });
  assert.equal(run.manifest.status, 'INCOMPLETE');
  assert.equal(run.manifest.properties[SITE].cuts.date.daily[0].status, 'INCOMPLETE');
  assert.equal(read(run.out, 'raw/date-2026-08-04-0.json').response.rows[0].keys[0], '2026-01-01');
});

test('successful GSC pointer remains byte-identical after failed auth or partial next run', async t => {
  const dir = temporary(t);
  const opts = { ...SHORT_DATES, out: path.join(dir, 'complete'), maxPages: 3 };
  const request = fakeGsc([]);
  const good = await runGsc(opts, { request: (url, body) => request(url, TOKEN, body) });
  assert.equal(good.manifest.status, 'COMPLETE');
  const pointerPath = path.join(dir, 'latest-successful-gsc-www-pepcodex-com.json');
  const before = fs.readFileSync(pointerPath, 'utf8');
  const badAuth = await runGsc({ ...opts, out: path.join(dir, 'failed') }, { tokenProvider: async () => { throw new Error('Synthetic auth failure'); } });
  assert.equal(badAuth.manifest.status, 'FAILED');
  assert.equal(fs.readFileSync(pointerPath, 'utf8'), before);
  const partial = await runGsc({ ...opts, out: path.join(dir, 'partial') }, { tokenProvider: async () => TOKEN, request: fakeGsc([], 'page') });
  assert.equal(partial.manifest.status, 'INCOMPLETE');
  assert.equal(fs.readFileSync(pointerPath, 'utf8'), before);
});

test('GA4 prior-window failure cannot replace last successful pointer', async t => {
  const dir = temporary(t);
  const opts = { ...SHORT_DATES, out: path.join(dir, 'complete'), maxPages: 3 };
  const request = fakeGa4([]);
  const good = await runGa4(opts, { request: (url, body) => request(url, TOKEN, body) });
  assert.equal(good.manifest.status, 'COMPLETE');
  const pointerPath = path.join(dir, 'latest-successful-ga4-521749549.json');
  const before = fs.readFileSync(pointerPath, 'utf8');
  assert.equal(JSON.parse(before).run, 'complete');
  const partial = await runGa4({ ...opts, out: path.join(dir, 'partial') }, { request: async (url, body) => {
    if (body.dateRanges[0].endDate < SHORT_DATES.startDate) throw new Error('Synthetic prior-window failure');
    return request(url, TOKEN, body);
  } });
  assert.equal(partial.manifest.status, 'INCOMPLETE');
  assert.equal(partial.manifest.reports['previous-ga4-totals'].status, 'FAILED');
  assert.equal(fs.readFileSync(pointerPath, 'utf8'), before);
  const failed = await runGa4({ ...opts, out: path.join(dir, 'failed') }, { tokenProvider: async () => { throw new Error('Synthetic auth failure'); } });
  assert.equal(failed.manifest.status, 'FAILED');
  assert.equal(fs.readFileSync(pointerPath, 'utf8'), before);
});

test('GA4 failed authentication and partial report failures remain FAILED/INCOMPLETE', async t => {
  let called = false;
  const failed = await runGa4(options(t), { tokenProvider: async () => { throw new Error('Synthetic auth failure'); }, request: async () => { called = true; } });
  assert.equal(failed.manifest.status, 'FAILED');
  assert.equal(called, false);
  assert.equal(read(failed.out, 'manifest.json').errors[0].stage, 'authentication');
  const partial = await runGa4(options(t), { tokenProvider: async () => TOKEN, request: fakeGa4([], 2) });
  assert.equal(partial.manifest.status, 'INCOMPLETE');
  assert.equal(partial.manifest.reports['ga4-totals'].status, 'COMPLETE');
  assert.equal(partial.manifest.reports['ga4-daily'].status, 'FAILED');
  assert.equal(fs.existsSync(path.join(partial.out, 'ga4-daily.json')), false);
});
