// Read-only inspection of an explicit sample against one GSC URL-prefix property.
// node scripts/gsc-index-diagnose.mjs --sample-file=sample-30.csv --site=https://www.pepcodex.com/
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { createExport, exportRequest, safeError } from './lib/analytics-export.mjs';

export const INSPECTION_ENDPOINT = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
export function inspectionOptions(args) {
  const values = {};
  for (const arg of args) {
    const match = arg.match(/^--(sample-file|site|out|max-urls)=(.+)$/);
    if (!match || values[match[1]] !== undefined) throw new Error('Invalid or duplicate inspection option.');
    values[match[1]] = match[2];
  }
  if (!values['sample-file'] || !values.site) throw new Error('An explicit sample file and property are required.');
  const maxUrls = Number(values['max-urls'] ?? 200);
  if (!Number.isInteger(maxUrls) || maxUrls < 1 || maxUrls > 2000) throw new Error('max-urls must be an integer from 1 to 2000.');
  return { sampleFile: values['sample-file'], site: values.site, out: values.out, maxUrls };
}

// RFC4180-style quoted fields, escaped quotes and embedded newlines. No eval or
// spreadsheet interpretation: only the exact url and optional sample_id columns.
export function parseSampleCsv(input) {
  const text = input.replace(/^\uFEFF/, ''), records = [];
  let row = [], value = '', quoted = false, closed = false;
  const finishField = () => { row.push(value); value = ''; closed = false; };
  const finishRow = () => { finishField(); if (row.some(field => field !== '')) records.push(row); row = []; };
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { value += '"'; i++; }
      else if (char === '"') { quoted = false; closed = true; }
      else value += char;
    } else if (char === ',' || char === '\n' || char === '\r') {
      if (char === ',') finishField();
      else { if (char === '\r' && text[i + 1] === '\n') i++; finishRow(); }
    } else if (closed) throw new Error('Unexpected text after a quoted CSV field.');
    else if (char === '"') { if (value) throw new Error('Unexpected quote in a CSV field.'); quoted = true; }
    else value += char;
  }
  if (quoted) throw new Error('Unclosed CSV quote.');
  if (value || row.length || closed) finishRow();
  const headers = records.shift()?.map(header => header.trim().toLowerCase());
  if (!headers || new Set(headers).size !== headers.length || !headers.includes('url')) throw new Error('CSV needs one unambiguous url column.');
  return records.map(record => {
    if (record.length !== headers.length) throw new Error('CSV row width differs from header.');
    return Object.fromEntries(headers.map((header, i) => [header, record[i]]));
  });
}

export function loadInspectionSample(options) {
  if (!['https://www.pepcodex.com/', 'https://pepcodex.com/'].includes(options.site)) throw new Error('Choose one exact supported URL-prefix property.');
  if (!Number.isInteger(options.maxUrls ?? 200) || (options.maxUrls ?? 200) < 1 || (options.maxUrls ?? 200) > 2000) throw new Error('Invalid maximum sample size.');
  const inputFile = path.resolve(options.sampleFile), bytes = fs.readFileSync(inputFile);
  const text = bytes.toString('utf8').replace(/^\uFEFF/, '');
  const extension = path.extname(inputFile).toLowerCase();
  const parsed = extension === '.csv' ? parseSampleCsv(text) : extension === '.json' ? JSON.parse(text) : null;
  if (!Array.isArray(parsed) || !parsed.length || parsed.length > (options.maxUrls ?? 200)) throw new Error('Provide a nonempty CSV/JSON array within max-urls; the sample is never truncated.');
  const seen = new Set(), ids = new Set();
  const rows = parsed.map((record, index) => {
    const value = typeof record === 'string' ? record : record?.url;
    if (typeof value !== 'string') throw new Error('Sample URL must be a string.');
    const url = value.trim(), parsedUrl = new URL(url);
    if (parsedUrl.href !== url || !url.startsWith(options.site) || parsedUrl.origin + '/' !== options.site || parsedUrl.username || parsedUrl.password || parsedUrl.hash) throw new Error('Sample URLs must be exact absolute URLs inside the selected property, without fragments or credentials.');
    if (seen.has(url)) throw new Error('Duplicate sample URL.');
    seen.add(url);
    const sampleId = typeof record === 'object' && record?.sample_id ? record.sample_id : String(index + 1);
    if (typeof sampleId !== 'string' || ids.has(sampleId)) throw new Error('Sample IDs must be unique strings.');
    ids.add(sampleId);
    return { sampleId, url };
  });
  return { inputFile, bytes, extension, sha256: createHash('sha256').update(bytes).digest('hex'), rows };
}

export function inspectionFields(response) {
  const result = response?.inspectionResult?.indexStatusResult;
  if (!result || typeof result !== 'object' || Array.isArray(result)) return { status: 'UNAVAILABLE', reason: 'INDEX_STATUS_NOT_RETURNED' };
  const fields = ['verdict', 'coverageState', 'robotsTxtState', 'indexingState', 'pageFetchState', 'lastCrawlTime', 'googleCanonical', 'userCanonical'];
  if (fields.some(key => result[key] !== undefined && typeof result[key] !== 'string') || (result.referringUrls !== undefined && (!Array.isArray(result.referringUrls) || result.referringUrls.some(url => typeof url !== 'string')))) return { status: 'UNAVAILABLE', reason: 'MALFORMED_INDEX_STATUS' };
  if (result.verdict !== undefined && !['VERDICT_UNSPECIFIED', 'PASS', 'PARTIAL', 'FAIL', 'NEUTRAL'].includes(result.verdict)) return { status: 'UNAVAILABLE', reason: 'MALFORMED_INDEX_VERDICT' };
  if (result.lastCrawlTime && !Number.isFinite(Date.parse(result.lastCrawlTime))) return { status: 'UNAVAILABLE', reason: 'MALFORMED_CRAWL_TIMESTAMP' };
  const informative = ['PASS', 'PARTIAL', 'FAIL', 'NEUTRAL'].includes(result.verdict) || Boolean(result.coverageState?.trim());
  if (!informative) return { status: 'UNAVAILABLE', reason: 'INDEX_STATUS_UNSPECIFIED' };
  return { status: 'OBSERVED', ...Object.fromEntries(fields.map(key => [key, result[key] || null])), referringUrls: result.referringUrls ?? null };
}

export async function runInspection(options, dependencies = {}) {
  const sample = loadInspectionSample(options); // No network or output before validating the entire sample.
  const run = createExport('url-inspection', options);
  Object.assign(run.manifest.scope, { site: options.site, languageCode: 'en-US', sampling: 'explicit-file', selectedUrls: sample.rows.length });
  run.manifest.input = { file: sample.inputFile, sha256: sample.sha256, preservedFile: `raw/sample-input${sample.extension}` };
  fs.writeFileSync(path.join(run.out, run.manifest.input.preservedFile), sample.bytes, { flag: 'wx' });
  run.manifest.limitations = ['Google indexed-version information, not a live URL test.', 'Explicit sample only; not an index census or random population estimate.', 'Missing crawl timestamps remain unknown, never interpreted as never crawled.', 'No historical search metrics are loaded, joined or inferred.', 'No indexing submission or account changes.'];
  const results = sample.rows.map(row => ({ ...row, status: 'NOT_ATTEMPTED' }));
  const checkpoint = () => { run.manifest.results = run.write('index-inspection.json', results); run.checkpoint(); };
  checkpoint();
  let stage = 'authentication';
  try {
    const request = await exportRequest(dependencies);
    for (const [index, row] of results.entries()) {
      stage = `inspection-${index + 1}`;
      const body = { inspectionUrl: row.url, siteUrl: options.site, languageCode: 'en-US' };
      try {
        const response = await request(INSPECTION_ENDPOINT, body);
        // Shared transport already rejects error responses. Enforce the same
        // boundary for injected transports before preserving successful raw data.
        if (response?.error) {
          const status = Number(response.error.code);
          throw Object.assign(new Error('Inspection API returned an error.'), Number.isInteger(status) && status >= 100 && status <= 599 ? { status } : {});
        }
        row.fetchedAt = new Date().toISOString();
        row.raw = run.write(`raw/inspection-${index + 1}.json`, { fetchedAt: row.fetchedAt, request: body, response });
        Object.assign(row, inspectionFields(response));
      } catch (error) {
        row.status = 'ERROR'; row.error = safeError(error);
        run.manifest.errors.push({ stage, ...row.error });
        const fatal = ['REAUTH_REQUIRED', 'MISSING_SCOPE', 'TOKEN_REJECTED', 'PROPERTY_PERMISSION', 'RATE_LIMITED', 'RUNTIME_OR_CREDENTIAL_FILE', 'NETWORK_TIMEOUT', 'SERVICE_UNAVAILABLE', 'AUTH_CONFIGURATION', 'API_DISABLED', 'QUOTA_PROJECT'].includes(row.error.code) || [401, 403, 429].includes(row.error.code) || (typeof row.error.code === 'number' && row.error.code >= 500);
        if (fatal) { run.manifest.stoppedReason = row.error.code; checkpoint(); break; }
      }
      checkpoint();
      console.log(`${index + 1}/${results.length}: ${row.status}`);
    }
  } catch (error) {
    run.manifest.errors.push({ stage, ...safeError(error) });
  }
  const counts = Object.fromEntries(['OBSERVED', 'UNAVAILABLE', 'ERROR', 'NOT_ATTEMPTED'].map(status => [status, results.filter(row => row.status === status).length]));
  run.manifest.counts = counts;
  run.manifest.status = counts.OBSERVED === results.length ? 'COMPLETE' : counts.OBSERVED || counts.UNAVAILABLE ? 'INCOMPLETE' : 'FAILED';
  run.manifest.finishedAt = new Date().toISOString(); checkpoint();
  console.log(`${run.manifest.status}: ${run.out}`);
  return run;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const options = inspectionOptions(process.argv.slice(2));
    (await import('./lib/google-auth.mjs')).loadEnvironment();
    const run = await runInspection(options);
    if (run.manifest.status !== 'COMPLETE') process.exitCode = 1;
  } catch (error) {
    console.error(safeError(error));
    console.error('Usage: --sample-file=sample.csv|sample.json --site=https://www.pepcodex.com/ [--out=NEW_DIRECTORY] [--max-urls=200]');
    process.exitCode = 1;
  }
}
