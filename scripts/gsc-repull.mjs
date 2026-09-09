// Daily final-data exports with an equal preceding comparison window.
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { exportOptions, createExport, propertyTag, collectGsc, exportRequest, safeError, shiftDate, comparisonWindows, publishSuccessful } from './lib/analytics-export.mjs';

export const GSC_CUTS = [
  ['totals', []], ['date', ['date']], ['page', ['page']], ['query', ['query']],
  ['device', ['device']], ['country', ['country']], ['appearance', ['searchAppearance']],
  ['date-device', ['date', 'device']], ['page-device', ['page', 'device']],
  ['page-query', ['page', 'query']], ['page-date', ['page', 'date']],
  ['page-date-device-country', ['page', 'date', 'device', 'country']],
];

// Aggregate only matching dimensions within one property, cut and window.
// Position is impression-weighted; CTR is recomputed, never averaged.
function summarize(rows, dimensions) {
  const groups = new Map();
  for (const row of rows) {
    const key = JSON.stringify(row.keys ?? []);
    const entry = groups.get(key) ?? { ...Object.fromEntries(dimensions.map((dim, i) => [dim, row.keys[i]])), clicks: 0, impressions: 0, positionNumerator: 0 };
    entry.clicks += row.clicks; entry.impressions += row.impressions; entry.positionNumerator += row.position * row.impressions;
    groups.set(key, entry);
  }
  return [...groups.values()].map(({ positionNumerator, ...row }) => ({ ...row, ctr: row.impressions ? row.clicks / row.impressions * 100 : 0, position: row.impressions ? positionNumerator / row.impressions : 0 }));
}

export async function runGsc(options, dependencies = {}) {
  const site = options.site ?? 'https://www.pepcodex.com/';
  if (!['https://www.pepcodex.com/', 'https://pepcodex.com/', 'sc-domain:pepcodex.com'].includes(site)) throw new Error('Select an exact PepCodex GSC property with --site.');
  if (options.property) throw new Error('GSC uses --site, not --property.');
  const run = createExport('gsc', options);
  Object.assign(run.manifest.scope, { site, type: 'web', dataState: 'final', timezone: 'America/Los_Angeles' });
  run.manifest.windows = comparisonWindows(options);
  run.manifest.limitations = ['COMPLETE means all required API requests succeeded below exposed limits, not an exhaustive census.', 'GSC exposes at most 50,000 daily rows per site/search type; hitting this cap fails the cut.', 'Query privacy and internal top-row exclusions remain.', 'Absent rows are unknown; empty daily responses are recorded explicitly.', 'Page aggregation is distinct from property totals; appearance types can overlap.'];
  const property = { requested: run.manifest.windows.current, cuts: {}, previous: { requested: run.manifest.windows.previous, cuts: {} } };
  run.manifest.properties = { [site]: property };
  run.checkpoint();
  let stage = 'authentication', activeCut;
  try {
    const request = await exportRequest(dependencies);
    stage = 'property_access';
    const sites = await request('https://www.googleapis.com/webmasters/v3/sites');
    run.write('raw/sites.json', { fetchedAt: new Date().toISOString(), response: sites });
    const access = sites.siteEntry?.find(entry => entry.siteUrl === site);
    if (!access) throw new Error('Selected property is not visible.');
    property.permissionLevel = access.permissionLevel;
    const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
    for (const [windowName, dates] of Object.entries(run.manifest.windows)) {
      const details = windowName === 'current' ? property : property.previous;
      const prefix = windowName === 'current' ? '' : 'previous-';
      const collectCut = async (name, dimensions, filters = []) => {
        const cut = details.cuts[name] = { status: 'RUNNING', dimensions, filters, daily: [], rows: 0, exposedDailyRowCap: 50000 };
        activeCut = cut;
        const combined = [], aggregations = new Set();
        for (let day = dates.startDate; day <= dates.endDate; day = shiftDate(day, 1)) {
          stage = `${windowName}/${name}/${day}`;
          const daily = { date: day, status: 'RUNNING', rows: 0, pages: 0 };
          cut.daily.push(daily); run.checkpoint();
          const body = { startDate: day, endDate: day, dimensions, type: 'web', dataState: 'final', aggregationType: 'auto', ...(filters.length ? { dimensionFilterGroups: [{ groupType: 'and', filters }] } : {}) };
          try {
            const result = await collectGsc(query => request(url, query), body, {
              maxPages: options.maxPages,
              onPage: (page, query, response) => {
                run.write(`raw/${prefix}${name}-${day}-${page}.json`, { fetchedAt: new Date().toISOString(), request: query, response });
                daily.pages++; daily.rows += response?.rows?.length ?? 0;
              },
            });
            if (dimensions.includes('date') && result.rows.some(row => row.keys[dimensions.indexOf('date')] !== day)) throw new Error('GSC date row lies outside the requested day.');
            if (result.responseAggregationType) aggregations.add(result.responseAggregationType);
            if (aggregations.size > 1) throw new Error('GSC aggregation changed between days.');
            combined.push(...result.rows);
            daily.status = 'COMPLETE';
          } catch (error) { daily.status = 'INCOMPLETE'; throw error; }
        }
        const rows = summarize(combined, dimensions);
        Object.assign(cut, { status: 'COMPLETE', ...run.write(`gsc-${propertyTag(site)}-${prefix}${name}.json`, rows), rows: rows.length, pages: cut.daily.reduce((sum, day) => sum + day.pages, 0), responseAggregationType: [...aggregations][0] ?? null, aggregationMethod: 'sum daily counts; recompute CTR; impression-weight position' });
        run.checkpoint();
        return rows;
      };
      for (const [name, dimensions] of GSC_CUTS) {
        const rows = await collectCut(name, dimensions);
        if (name === 'totals') details.totals = rows[0] ?? { clicks: 0, impressions: 0, ctr: null, position: null };
        if (name === 'date') { const days = rows.map(row => row.date).sort(); Object.assign(details, { first: days[0] ?? null, last: days.at(-1) ?? null, days: days.length }); }
        if (name === 'appearance') {
          // Discover supported types first; then filter each type independently.
          for (const [index, row] of rows.entries()) {
            const filters = [{ dimension: 'searchAppearance', operator: 'equals', expression: row.searchAppearance }];
            await collectCut(`appearance-${index}-page-query`, ['page', 'query'], filters);
          }
        }
      }
    }
    run.manifest.status = 'COMPLETE';
  } catch (error) {
    run.manifest.status = activeCut ? 'INCOMPLETE' : 'FAILED';
    if (activeCut) activeCut.status = 'INCOMPLETE';
    run.manifest.errors.push({ stage, ...safeError(error) });
  }
  run.manifest.finishedAt = new Date().toISOString(); run.checkpoint();
  if (run.manifest.status === 'COMPLETE') publishSuccessful(run, site);
  console.log(`${run.manifest.status}: ${run.out}`);
  return run;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    (await import('./lib/google-auth.mjs')).loadEnvironment();
    const run = await runGsc(exportOptions(process.argv.slice(2)));
    if (run.manifest.status !== 'COMPLETE') { console.error(run.manifest.errors); process.exitCode = 1; }
  } catch (error) { console.error(safeError(error).message); process.exitCode = 1; }
}
