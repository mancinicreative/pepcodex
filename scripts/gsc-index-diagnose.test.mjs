import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { inspectionOptions, parseSampleCsv, loadInspectionSample, inspectionFields, runInspection, INSPECTION_ENDPOINT } from './gsc-index-diagnose.mjs';

const SITE = 'https://www.pepcodex.com/';
const URLS = [SITE, SITE + 'guide', SITE + 'peptides/semaglutide'];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = (out, file) => JSON.parse(fs.readFileSync(path.join(out, file), 'utf8'));
function temporary(t) {
  const root = fs.realpathSync(os.tmpdir());
  const dir = fs.mkdtempSync(path.join(root, 'pepcodex-inspection-test-'));
  t.after(() => {
    const resolved = fs.realpathSync(dir);
    assert.equal(path.dirname(resolved), root);
    assert.match(path.basename(resolved), /^pepcodex-inspection-test-/);
    fs.rmSync(resolved, { recursive: true, force: true });
  });
  return dir;
}
function fixture(t, data = URLS, extension = 'json') {
  const dir = temporary(t);
  const sampleFile = path.join(dir, `sample.${extension}`);
  fs.writeFileSync(sampleFile, extension === 'json' ? JSON.stringify(data) : data);
  return { sampleFile, site: SITE, out: path.join(dir, 'run'), maxUrls: 200 };
}
const observed = (values = {}) => ({ inspectionResult: { indexStatusResult: { verdict: 'PASS', coverageState: 'Submitted and indexed', ...values } } });

test('inspection options require exact explicit input and reject old or invalid flags', () => {
  const parsed = inspectionOptions(['--sample-file=sample.csv', `--site=${SITE}`]);
  assert.equal(parsed.maxUrls, 200);
  assert.equal(parsed.sampleFile, 'sample.csv');
  for (const args of [[], ['--sample=30'], ['--sample-file=x'], [`--site=${SITE}`], ['--sample-file=x', `--site=${SITE}`, '--max-urls=0'], ['--sample-file=x', `--site=${SITE}`, '--max-urls=2001'], ['--sample-file=x', `--site=${SITE}`, `--site=${SITE}`]]) {
    assert.throws(() => inspectionOptions(args));
  }
});

test('CSV parser preserves BOM, quoted commas, escaped quotes and embedded CRLF', () => {
  const csv = '\uFEFFsample_id,url,note\r\n"one","https://www.pepcodex.com/guide","a comma, and ""quote""\r\nnext line"\r\n';
  assert.deepEqual(parseSampleCsv(csv), [{ sample_id: 'one', url: SITE + 'guide', note: 'a comma, and "quote"\r\nnext line' }]);
  for (const invalid of ['url,url\na,b', 'not-url\na', 'url,note\na', 'url\n"unclosed', 'url\n"closed"junk', 'url\na"b']) assert.throws(() => parseSampleCsv(invalid));
});

test('a wide R08-shaped 30-URL CSV parses without loading historical metrics', t => {
  const columns = ['sample_id', 'stratum', 'url', 'path_key', 'selection_reason', 'secondary_cohorts', 'winning_url_frozen', 'freeze_rule', 'parent_ui_page_status', 'parent_ui_clicks', 'parent_ui_impressions', 'parent_ui_window_start', 'parent_ui_window_end', 'parent_ui_observed_date', 'parent_ui_source', 'parent_ui_source_sha256', 'parent_product_example', 'parent_product_issue', 'parent_product_report_updated', 'parent_product_observed_date', 'parent_product_source', 'parent_product_source_sha256', 'historical_property', 'historical_returned_window_start', 'historical_returned_window_end', 'historical_pulled_at', 'historical_scope', 'historical_row_status', 'historical_clicks', 'historical_impressions', 'historical_ctr_pct', 'historical_position', 'historical_metrics_file', 'historical_metrics_sha256', 'source_snapshot_sha', 'source_paths', 'source_sha256', 'initial_source_content_sha256', 'initial_source_title', 'source_expected_status', 'source_expected_target_canonical', 'source_expected_robots', 'source_expected_sitemap', 'source_contract', 'saved_http_status', 'saved_http_chain', 'saved_http_retrieved_at', 'saved_http_final_url', 'saved_http_body_sha256', 'saved_http_body_file', 'saved_final_header_robots', 'saved_final_meta_robots', 'saved_final_canonical', 'current_url_inspection', 'current_index_status', 'current_http', 'current_performance', 'integrated_graph_depth', 'verification_gate', 'experiment_status'];
  const quote = value => `"${String(value).replaceAll('"', '""')}"`;
  const rows = Array.from({ length: 30 }, (_, index) => ({
    sample_id: `FIXTURE-${index + 1}`, url: `${SITE}fixture-${index + 1}`, path_key: `/fixture-${index + 1}`,
    selection_reason: 'Synthetic example, with "quoted" text\r\nand a second line.',
    historical_property: SITE, historical_clicks: String(index + 100), historical_impressions: String(index + 1000),
    historical_scope: 'Synthetic dated evidence only; not inspection state', current_index_status: 'UNKNOWN_NOT_INSPECTED',
  }));
  const csv = '\uFEFF' + [columns.map(quote).join(','), ...rows.map(row => columns.map(column => quote(row[column] ?? '')).join(','))].join('\r\n') + '\r\n';
  const { sampleFile } = fixture(t, csv, 'csv');
  const parsed = parseSampleCsv(fs.readFileSync(sampleFile, 'utf8'));
  assert.equal(parsed.length, 30);
  assert.equal(Object.keys(parsed[0]).length, 60);
  assert.equal(parsed[0].selection_reason, rows[0].selection_reason);
  const loaded = loadInspectionSample({ sampleFile, site: SITE });
  assert.equal(loaded.rows.length, 30);
  assert.equal(new Set(loaded.rows.map(row => row.url)).size, 30);
  assert.deepEqual(loaded.rows.map(row => row.url), rows.map(row => row.url));
  assert.ok(loaded.rows.every(row => Object.keys(row).sort().join(',') === 'sampleId,url'));
  assert.equal(loaded.sha256, hash(fs.readFileSync(sampleFile)));
});

test('whole sample validation rejects cross-host, duplicates, fragments and oversize before API or outputs', async t => {
  const variants = [
    { data: ['https://pepcodex.com/guide'] },
    { data: [SITE + 'guide', SITE + 'guide'] },
    { data: [SITE + 'guide#references'] },
    { data: ['https://www.pepcodex.com.evil.example/guide'] },
    { data: ['https://user:password@www.pepcodex.com/guide'] },
    { data: [{ sample_id: 'same', url: URLS[0] }, { sample_id: 'same', url: URLS[1] }] },
    { data: [] },
    { data: URLS, maxUrls: 2 },
    { data: Array.from({ length: 201 }, (_, i) => `${SITE}fixture-${i}`) },
    { data: URLS, site: 'sc-domain:pepcodex.com' },
  ];
  for (const { data, ...overrides } of variants) {
    const opts = { ...fixture(t, data), ...overrides };
    let calls = 0;
    await assert.rejects(runInspection(opts, { request: async () => { calls++; return observed(); } }));
    assert.equal(calls, 0);
    assert.equal(fs.existsSync(opts.out), false);
  }
  const apex = fixture(t, ['https://pepcodex.com/guide']);
  assert.equal(loadInspectionSample({ ...apex, site: 'https://pepcodex.com/' }).rows.length, 1);
});

test('successful three-URL run preserves exact input and raw response hashes; missing crawl stays null', async t => {
  const csv = '\uFEFFsample_id,url,note\r\n' + URLS.map((url, i) => `"id-${i}","${url}","historical clicks, not loaded"`).join('\r\n') + '\r\n';
  const opts = fixture(t, csv, 'csv');
  const requests = [];
  const run = await runInspection(opts, { request: async (url, body) => {
    requests.push({ url, body });
    return observed(requests.length === 1 ? { lastCrawlTime: '2026-09-01T12:00:00Z', referringUrls: [SITE + 'guide'] } : {});
  } });
  assert.equal(run.manifest.status, 'COMPLETE');
  assert.deepEqual(run.manifest.counts, { OBSERVED: 3, UNAVAILABLE: 0, ERROR: 0, NOT_ATTEMPTED: 0 });
  assert.deepEqual(requests.map(request => request.body.inspectionUrl), URLS);
  for (const request of requests) assert.deepEqual(request, { url: INSPECTION_ENDPOINT, body: { inspectionUrl: request.body.inspectionUrl, siteUrl: SITE, languageCode: 'en-US' } });
  assert.deepEqual(fs.readFileSync(path.join(run.out, run.manifest.input.preservedFile)), fs.readFileSync(opts.sampleFile));
  assert.equal(run.manifest.input.sha256, hash(fs.readFileSync(opts.sampleFile)));
  const rows = read(run.out, 'index-inspection.json');
  assert.deepEqual(rows.map(row => row.sampleId), ['id-0', 'id-1', 'id-2']);
  assert.equal(rows[1].lastCrawlTime, null);
  assert.equal(rows[1].googleCanonical, null);
  assert.equal(rows[1].referringUrls, null);
  for (const row of rows) {
    assert.equal(row.raw.sha256, hash(fs.readFileSync(path.join(run.out, row.raw.file))));
    assert.equal(row.status, 'OBSERVED');
    assert.equal(Object.hasOwn(row, 'neverCrawled'), false);
    assert.equal(Object.hasOwn(row, 'clicks'), false);
  }
  assert.equal(run.manifest.results.sha256, hash(fs.readFileSync(path.join(run.out, run.manifest.results.file))));
});

test('empty, unspecified or malformed inspection results are unavailable, never success', async t => {
  for (const response of [{}, { inspectionResult: {} }, { inspectionResult: { indexStatusResult: {} } }, { inspectionResult: { indexStatusResult: { verdict: 'VERDICT_UNSPECIFIED' } } }, observed({ lastCrawlTime: 42 }), observed({ referringUrls: ['ok', null] })]) {
    assert.equal(inspectionFields(response).status, 'UNAVAILABLE');
  }
  const run = await runInspection(fixture(t, [URLS[0]]), { request: async () => ({}) });
  assert.equal(run.manifest.status, 'INCOMPLETE');
  assert.deepEqual(run.manifest.counts, { OBSERVED: 0, UNAVAILABLE: 1, ERROR: 0, NOT_ATTEMPTED: 0 });
  assert.equal(read(run.out, 'index-inspection.json')[0].reason, 'INDEX_STATUS_NOT_RETURNED');
  assert.equal(fs.existsSync(path.join(run.out, 'raw/inspection-1.json')), true);
});

test('authentication failure leaves all URLs not attempted and never echoes secret payloads', async t => {
  const canary = 'SYNTHETIC_INSPECTION_AUTH_CANARY';
  let calls = 0;
  const run = await runInspection(fixture(t), { tokenProvider: async () => { throw { message: canary, response: { data: { error_description: canary } }, safeGoogleError: { code: 'REAUTH_REQUIRED', message: canary } }; }, request: async () => { calls++; } });
  assert.equal(calls, 0);
  assert.equal(run.manifest.status, 'FAILED');
  assert.equal(run.manifest.counts.NOT_ATTEMPTED, 3);
  assert.equal(run.manifest.errors[0].code, 'REAUTH_REQUIRED');
  assert.equal(JSON.stringify(run.manifest).includes(canary), false);
  assert.equal(fs.readdirSync(path.join(run.out, 'raw')).length, 1);
});

test('fatal partial failure preserves observation and leaves remaining URLs not attempted', async t => {
  const canary = 'SYNTHETIC_INSPECTION_SERVER_CANARY';
  let calls = 0;
  const run = await runInspection(fixture(t), { request: async () => {
    calls++;
    if (calls === 2) throw { status: 403, message: canary, response: { status: 403, data: { error: { message: canary } } } };
    return observed();
  } });
  assert.equal(calls, 2);
  assert.equal(run.manifest.status, 'INCOMPLETE');
  assert.deepEqual(read(run.out, 'index-inspection.json').map(row => row.status), ['OBSERVED', 'ERROR', 'NOT_ATTEMPTED']);
  assert.equal(run.manifest.stoppedReason, 403);
  assert.equal(fs.existsSync(path.join(run.out, 'raw/inspection-2.json')), false);
  assert.equal(JSON.stringify(run.manifest).includes(canary), false);
  assert.equal(fs.readFileSync(path.join(run.out, 'index-inspection.json'), 'utf8').includes(canary), false);
});

test('injected API error payload is excluded from raw files and cannot count as observation', async t => {
  const canary = 'SYNTHETIC_RAW_RESPONSE_CANARY';
  let calls = 0;
  const run = await runInspection(fixture(t), { request: async () => ++calls === 2 ? { error: { code: 400, message: canary, access_token: canary } } : observed() });
  assert.equal(run.manifest.status, 'INCOMPLETE');
  assert.deepEqual(read(run.out, 'index-inspection.json').map(row => row.status), ['OBSERVED', 'ERROR', 'OBSERVED']);
  assert.equal(fs.existsSync(path.join(run.out, 'raw/inspection-2.json')), false);
  assert.equal(JSON.stringify(run.manifest).includes(canary), false);
});

test('shared API-disabled and quota-project blockers stop remaining sample requests', async t => {
  for (const code of ['API_DISABLED', 'QUOTA_PROJECT']) {
    let calls = 0;
    const run = await runInspection(fixture(t), { request: async () => {
      calls++;
      throw { safeGoogleError: { code, message: 'SYNTHETIC_CONFIG_CANARY' } };
    } });
    assert.equal(calls, 1, `${code} must stop futile requests for the same property`);
    assert.equal(run.manifest.status, 'FAILED');
    assert.deepEqual(read(run.out, 'index-inspection.json').map(row => row.status), ['ERROR', 'NOT_ATTEMPTED', 'NOT_ATTEMPTED']);
    assert.equal(run.manifest.stoppedReason, code);
    assert.equal(JSON.stringify(run.manifest).includes('SYNTHETIC_CONFIG_CANARY'), false);
  }
});

test('existing export directory stays frozen and no API is called', async t => {
  const opts = fixture(t);
  fs.mkdirSync(opts.out);
  const existing = path.join(opts.out, 'existing.txt');
  fs.writeFileSync(existing, 'preserved');
  let calls = 0;
  await assert.rejects(runInspection(opts, { request: async () => { calls++; return observed(); } }), /EEXIST/);
  assert.equal(calls, 0);
  assert.equal(fs.readFileSync(existing, 'utf8'), 'preserved');
  assert.deepEqual(fs.readdirSync(opts.out), ['existing.txt']);
});
