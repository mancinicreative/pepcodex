// Dated, non-overwriting GA4 exports. Raw response metadata stays with every page.
// npm run ga4:pull -- --start=2026-08-04 --end=2026-08-31 --property=521749549
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { exportOptions, createExport, collectGa4, exportRequest, safeError, comparisonWindows, publishSuccessful } from './lib/analytics-export.mjs';

function toRows(j) {
  const dims = (j.dimensionHeaders || []).map((h) => h.name);
  const mets = (j.metricHeaders || []).map((h) => h.name);
  return (j.rows || []).map((r) => {
    const o = {};
    dims.forEach((d, i) => (o[d] = r.dimensionValues[i].value));
    mets.forEach((m, i) => {
      const v = r.metricValues[i].value;
      o[m] = isNaN(Number(v)) ? v : Number(v);
    });
    return o;
  });
}

export const REPORTS = [
  { name: 'ga4-totals', body: { dimensions: [], metrics: [{ name: 'sessions' }, { name: 'engagedSessions' }, { name: 'screenPageViews' }] } },
  { name: 'ga4-daily', body: { dimensions: [{ name: 'date' }], metrics: [{ name: 'sessions' }, { name: 'engagedSessions' }], orderBys: [{ dimension: { dimensionName: 'date' } }] } },
  { name: 'ga4-hostname-channel-device-country', body: { dimensions: ['hostName', 'sessionDefaultChannelGroup', 'sessionSource', 'deviceCategory', 'country'].map(name => ({ name })), metrics: ['sessions', 'engagedSessions', 'bounceRate', 'averageSessionDuration'].map(name => ({ name })) } },
  {
    name: 'ga4-monthly',
    body: {
      dimensions: [{ name: 'yearMonth' }],
      metrics: [
        { name: 'sessions' }, { name: 'totalUsers' }, { name: 'screenPageViews' },
        { name: 'engagedSessions' }, { name: 'averageSessionDuration' }, { name: 'bounceRate' },
      ],
      orderBys: [{ dimension: { dimensionName: 'yearMonth' } }],
    },
  },
  {
    name: 'ga4-landing-pages',
    body: {
      dimensions: [{ name: 'landingPage' }],
      metrics: [
        { name: 'sessions' }, { name: 'engagedSessions' }, { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 200,
    },
  },
  {
    name: 'ga4-channels',
    body: {
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'engagedSessions' }, { name: 'bounceRate' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    },
  },
  {
    name: 'ga4-events',
    body: {
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 40,
    },
  },
  {
    name: 'ga4-devices',
    body: {
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }, { name: 'bounceRate' }, { name: 'averageSessionDuration' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    },
  },
  {
    name: 'ga4-country',
    body: {
      dimensions: [{ name: 'country' }],
      metrics: [
        { name: 'sessions' }, { name: 'engagedSessions' }, { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 50,
    },
  },
  {
    name: 'ga4-city',
    body: {
      dimensions: [{ name: 'city' }, { name: 'country' }],
      metrics: [{ name: 'sessions' }, { name: 'bounceRate' }, { name: 'averageSessionDuration' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 80,
    },
  },
  {
    name: 'ga4-hostname',
    body: {
      dimensions: [{ name: 'hostName' }],
      metrics: [{ name: 'sessions' }, { name: 'bounceRate' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 30,
    },
  },
  {
    name: 'ga4-sources',
    body: {
      dimensions: [{ name: 'sessionSource' }],
      metrics: [
        { name: 'sessions' }, { name: 'engagedSessions' }, { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 80,
    },
  },
  {
    name: 'ga4-referrer',
    body: {
      dimensions: [{ name: 'pageReferrer' }],
      metrics: [{ name: 'sessions' }, { name: 'bounceRate' }, { name: 'averageSessionDuration' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 100,
    },
  },
  {
    name: 'ga4-new-returning',
    body: {
      dimensions: [{ name: 'newVsReturning' }],
      metrics: [
        { name: 'sessions' }, { name: 'engagedSessions' }, { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    },
  },
];

export async function runGa4(options, dependencies = {}) {
  const property = options.property ?? process.env.GA4_PROPERTY_ID ?? '521749549';
  if (!/^\d+$/.test(property)) throw new Error('GA4 --property must be a numeric property ID.');
  if (options.site) throw new Error('GA4 uses --property, not --site.');
  const run = createExport('ga4', options);
  Object.assign(run.manifest.scope, { property, timezone: null });
  run.manifest.reports = {};
  run.manifest.windows = comparisonWindows(options);
  run.manifest.limitations = ['Hostname filtering does not identify humans.', 'No country or source channel excluded.', 'Full page metadata preserves thresholding, sampling and data-loss signals.', 'Session attribution can differ across dimension scopes; do not subtract independent cuts.'];
  run.checkpoint();
  let stage = 'authentication';
  try {
    const request = await exportRequest(dependencies);
    const productionReports = REPORTS.filter(r => ['ga4-totals', 'ga4-daily', 'ga4-channels', 'ga4-landing-pages'].includes(r.name)).map(r => ({
      name: r.name + '-www', body: { ...r.body, dimensionFilter: { filter: { fieldName: 'hostName', stringFilter: { matchType: 'EXACT', value: 'www.pepcodex.com', caseSensitive: false } } } },
    }));
    for (const [windowName, dates] of Object.entries(run.manifest.windows)) {
    for (const sourceReport of [...REPORTS, ...productionReports]) {
      const report = { ...sourceReport, name: (windowName === 'current' ? '' : 'previous-') + sourceReport.name };
      stage = report.name;
      const { limit: _oldLimit, ...reportBody } = report.body;
      const body = { ...reportBody, dateRanges: [dates], returnPropertyQuota: true };
      const result = await collectGa4(query => request(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`, query), body, {
        maxPages: options.maxPages,
        onPage: (page, query, response) => run.write(`raw/${report.name}-${page}.json`, { fetchedAt: new Date().toISOString(), request: query, response }),
      });
      const rows = toRows(result);
      const file = run.write(report.name + '.json', rows); // [] is a valid recorded empty report
      run.manifest.reports[report.name] = { status: 'COMPLETE', ...file, rowCount: result.rowCount ?? 0, pages: result.pages, dimensions: body.dimensions, metrics: body.metrics, filter: body.dimensionFilter ?? null, metadata: result.metadata ?? null, metadataPages: result.metadataPages };
      if (result.metadata?.timeZone) {
        if (run.manifest.scope.timezone && run.manifest.scope.timezone !== result.metadata.timeZone) throw new Error('GA4 timezone changed between reports.');
        run.manifest.scope.timezone = result.metadata.timeZone;
      }
      Object.assign(run.manifest.reports[report.name], { window: windowName, dateRange: dates, metadataPages: result.metadataPages });
      run.checkpoint();
      console.log(`${report.name}: ${rows.length} rows (${result.pages} requests)`);
    }
    }
    run.manifest.status = 'COMPLETE';
  } catch (error) {
    run.manifest.status = Object.keys(run.manifest.reports).length ? 'INCOMPLETE' : 'FAILED';
    if (stage !== 'authentication') run.manifest.reports[stage] = { status: 'FAILED' };
    run.manifest.errors.push({ stage, ...safeError(error) });
  }
  run.manifest.finishedAt = new Date().toISOString(); run.checkpoint();
  if (run.manifest.status === 'COMPLETE') publishSuccessful(run, property);
  console.log(`${run.manifest.status}: ${run.out}`);
  return run;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    (await import('./lib/google-auth.mjs')).loadEnvironment();
    const options = exportOptions(process.argv.slice(2));
    const run = await runGa4(options);
    if (run.manifest.status !== 'COMPLETE') { console.error(run.manifest.errors); process.exitCode = 1; }
  } catch (error) { console.error(safeError(error).message); process.exitCode = 1; }
}
