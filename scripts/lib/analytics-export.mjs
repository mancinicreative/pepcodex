import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const ymd = date => date.toISOString().slice(0, 10);
export const shiftDate = (date, days) => ymd(new Date(Date.parse(date + 'T12:00:00Z') + days * 86400000));
export const propertyTag = site => site.replace(/^sc-domain:/, 'domain-').replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '').toLowerCase();
export function comparisonWindows(options) {
  const days = Math.round((Date.parse(options.endDate) - Date.parse(options.startDate)) / 86400000) + 1;
  return { current: { startDate: options.startDate, endDate: options.endDate }, previous: { startDate: shiftDate(options.startDate, -days), endDate: shiftDate(options.startDate, -1) } };
}

// The production transport refreshes credentials for every request. The legacy
// injection is retained only for callers/tests already supplying a token provider.
export async function exportRequest({ request, tokenProvider } = {}) {
  if (tokenProvider) {
    const token = await tokenProvider();
    return (url, body) => (request ?? requestJson)(url, token, body);
  }
  if (request) return request;
  return (await (await import('./google-auth.mjs')).createGoogleAccess()).request;
}

export function exportOptions(args, now = new Date()) {
  const options = {};
  for (const arg of args) {
    const match = arg.match(/^--(start|end|out|site|property|max-pages|months)=(.+)$/);
    if (!match) throw new Error(`Unknown option: ${arg}. Use --start=YYYY-MM-DD --end=YYYY-MM-DD --out=NEW_DIRECTORY.`);
    if (options[match[1]] !== undefined) throw new Error(`Duplicate option: --${match[1]}`);
    options[match[1]] = match[2];
  }
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const valid = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && ymd(new Date(value)) === value;
  const endDate = options.end ?? shiftDate(today, -3);
  if (!valid(endDate) || endDate >= today) throw new Error('End date must be a real, completed Pacific calendar day.');
  let startDate = options.start ?? shiftDate(endDate, -27);
  if (options.months) {
    const months = Number(options.months);
    if (options.start || !Number.isInteger(months) || months < 1 || months > 16) throw new Error('--months requires 1–16 and cannot be combined with --start.');
    const date = new Date(endDate + 'T12:00:00Z');
    const day = date.getUTCDate(); date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() - months);
    date.setUTCDate(Math.min(day, new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate()));
    startDate = ymd(date);
  }
  if (!valid(startDate) || startDate > endDate) throw new Error('Start date must be a real date on or before end date.');
  const maxPages = Number(options['max-pages'] ?? 10);
  if (!Number.isInteger(maxPages) || maxPages < 1 || maxPages > 100) throw new Error('--max-pages must be an integer from 1 to 100.');
  return { ...options, startDate, endDate, maxPages };
}

// Never replace evidence, even when a previous pull failed or returned no rows.
export function createExport(product, options) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const out = path.resolve(options.out ?? path.join('.planning', 'data', 'runs', `${stamp}-${product}`));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.mkdirSync(out); // EEXIST is intentional, including for an empty directory.
  fs.mkdirSync(path.join(out, 'raw'));
  const manifest = { schemaVersion: 2, product, status: 'RUNNING', pulledAt: new Date().toISOString(), scope: { startDate: options.startDate, endDate: options.endDate }, errors: [] };
  const write = (file, value) => {
    const data = JSON.stringify(value, null, 2) + '\n';
    fs.writeFileSync(path.join(out, file), data);
    return { file, sha256: crypto.createHash('sha256').update(data).digest('hex') };
  };
  const checkpoint = () => write('manifest.json', manifest);
  checkpoint();
  return { out, manifest, write, checkpoint };
}

export function publishSuccessful(run, scopeKey) {
  if (run.manifest.status !== 'COMPLETE') throw new Error('Only a complete export can update latest-successful.');
  const target = path.join(path.dirname(run.out), `latest-successful-${run.manifest.product}-${propertyTag(scopeKey)}.json`);
  const temporary = `${target}.${crypto.randomUUID()}.tmp`;
  const manifestSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(run.out, 'manifest.json'))).digest('hex');
  fs.writeFileSync(temporary, JSON.stringify({ schemaVersion: 1, run: path.basename(run.out), manifestSha256, scope: run.manifest.scope, finishedAt: run.manifest.finishedAt }, null, 2) + '\n', { flag: 'wx' });
  fs.renameSync(temporary, target); // Same-directory atomic replacement; failed runs never reach here.
}

export function safeError(error) {
  // Auth errors contain request configs and tokens: never serialize the full error.
  const fixed = {
    REAUTH_REQUIRED: 'Owner must renew desktop ADC using .planning/GOOGLE-API-SETUP.md.',
    MISSING_SCOPE: 'Renew ADC with the documented read-only scopes.',
    API_DISABLED: 'Check API enablement in the configured project.',
    QUOTA_PROJECT: 'Check the configured quota project and existing permission.',
    TOKEN_REJECTED: 'Renew the configured credentials and verify read-only data scopes.',
    PROPERTY_PERMISSION: 'Check access to the exact selected Google property.',
    RATE_LIMITED: 'Bounded retries exhausted; the previous baseline is preserved.',
    RUNTIME_OR_CREDENTIAL_FILE: 'Check runtime/file access and documented ADC setup.',
    NETWORK_TIMEOUT: 'Check network access; this does not prove an account permission failure.',
    SERVICE_UNAVAILABLE: 'Google service unavailable after bounded retries.',
    AUTH_CONFIGURATION: 'Check the explicitly selected Google authentication configuration.',
    REQUEST_FAILED: 'Google request failed; no data was promoted.',
  };
  const code = error?.safeGoogleError?.code;
  if (Object.hasOwn(fixed, code)) return { code, message: fixed[code] };
  const status = Number(error?.response?.status ?? error?.status);
  const message = status === 401 ? 'Authentication failed; renew Google authorization.' : status === 403 ? 'Google access or permission check failed.' : status === 429 ? 'Google quota limit reached; export is incomplete.' : status >= 500 ? 'Google service request failed.' : 'Export failed; inspect the recorded stage and validated raw responses.';
  return { code: Number.isInteger(status) && status >= 100 && status <= 599 ? status : 'EXPORT_FAILED', message };
}

export async function requestJson(url, token, body, fetcher = fetch) {
  const response = await fetcher(url, { method: body ? 'POST' : 'GET', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(20000) });
  const data = await response.json();
  if (!response.ok || data?.error) { const error = new Error('Google API request failed.'); error.status = response.status; throw error; }
  return data;
}

export async function collectGsc(request, body, { maxPages = 10, rowLimit = 25000, maxRows = 50000, onPage = () => {} } = {}) {
  const rows = [], keys = new Set(), aggregations = new Set();
  for (let page = 0; page < maxPages; page++) {
    const query = { ...body, rowLimit, startRow: rows.length };
    const result = await request(query); onPage(page, query, result);
    if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('Malformed GSC response.');
    if (result.rows !== undefined && !Array.isArray(result.rows)) throw new Error('Malformed GSC rows.');
    const batch = result.rows ?? [];
    if (batch.length > rowLimit) throw new Error('GSC response exceeded requested row limit.');
    for (const row of batch) {
      if (!Array.isArray(row.keys ?? []) || (row.keys ?? []).length !== body.dimensions.length || !['clicks', 'impressions', 'ctr', 'position'].every(key => Number.isFinite(row[key]) && row[key] >= 0)) throw new Error('Malformed GSC metric or dimension row.');
      const key = JSON.stringify(row.keys ?? []);
      if (keys.has(key)) throw new Error('Repeated GSC row across pages; export cannot be considered complete.');
      keys.add(key);
    }
    rows.push(...batch);
    if (rows.length >= maxRows) throw new Error(`GSC exposed daily row cap=${maxRows} reached; completeness cannot be established.`);
    if (result.responseAggregationType) aggregations.add(result.responseAggregationType);
    if (aggregations.size > 1) throw new Error('GSC aggregation changed during pagination.');
    if (batch.length < rowLimit) return { rows, pages: page + 1, responseAggregationType: [...aggregations][0] ?? null };
  }
  throw new Error(`GSC pagination hit max-pages=${maxPages}; incomplete export retained in raw/.`);
}

export async function collectGa4(request, body, { maxPages = 10, limit = 10000, onPage = () => {} } = {}) {
  const rows = [], keys = new Set(), metadataPages = []; let first, expectedCount;
  for (let page = 0; page < maxPages; page++) {
    const query = { ...body, limit, offset: rows.length };
    const result = await request(query); onPage(page, query, result);
    if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('Malformed GA4 response.');
    const dimensions = result.dimensionHeaders ?? [];
    const metrics = result.metricHeaders ?? [];
    if (!Array.isArray(dimensions) || !Array.isArray(metrics) || dimensions.length !== (body.dimensions?.length ?? 0) || metrics.length !== body.metrics.length || dimensions.some((header, i) => header.name !== body.dimensions[i].name) || metrics.some((header, i) => header.name !== body.metrics[i].name)) throw new Error('Malformed GA4 response headers.');
    const count = Number(result.rowCount ?? 0);
    if (!Number.isInteger(count) || count < 0 || (result.rows !== undefined && !Array.isArray(result.rows))) throw new Error('Malformed GA4 response.');
    if (!first) { first = result; expectedCount = count; }
    if (count !== expectedCount || JSON.stringify(result.dimensionHeaders) !== JSON.stringify(first.dimensionHeaders) || JSON.stringify(result.metricHeaders) !== JSON.stringify(first.metricHeaders)) throw new Error('GA4 schema or row count changed during pagination.');
    metadataPages.push(result.metadata ?? null);
    const timezones = new Set(metadataPages.map(metadata => metadata?.timeZone).filter(Boolean));
    if (timezones.size > 1) throw new Error('GA4 timezone changed during pagination.');
    const batch = result.rows ?? [];
    if (!batch.length && rows.length < expectedCount) throw new Error('GA4 pagination ended before rowCount.');
    for (const row of batch) {
      if ((row.dimensionValues?.length ?? 0) !== (body.dimensions?.length ?? 0) || row.metricValues?.length !== body.metrics.length) throw new Error('Malformed GA4 row.');
      if ((row.dimensionValues ?? []).some(value => typeof value.value !== 'string') || row.metricValues.some(value => typeof value.value !== 'string' || value.value.trim() === '' || !Number.isFinite(Number(value.value)))) throw new Error('Malformed GA4 dimension or metric value.');
      const key = JSON.stringify(row.dimensionValues ?? []);
      if (keys.has(key)) throw new Error('Repeated GA4 row across pages.');
      keys.add(key);
    }
    rows.push(...batch);
    if (rows.length > expectedCount) throw new Error('GA4 rows exceed declared rowCount.');
    if (rows.length === expectedCount) return { ...first, rows, pages: page + 1, metadataPages };
  }
  throw new Error(`GA4 pagination hit max-pages=${maxPages}; incomplete export retained in raw/.`);
}
