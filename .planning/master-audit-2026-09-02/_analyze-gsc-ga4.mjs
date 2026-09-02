import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DATA = path.join(ROOT, '.planning/data');
const OUT = path.dirname(fileURLToPath(import.meta.url));

const load = (name) => {
  const j = JSON.parse(fs.readFileSync(path.join(DATA, name), 'utf8'));
  if (Array.isArray(j)) return { rows: j, range: null };
  if (j.rows) return j;
  return { rows: [], raw: j, range: j.range || null };
};

const gscDate = load('gsc-www-pepcodex-com-by-date.json');
const gscPage = load('gsc-www-pepcodex-com-by-page.json');
const gscQuery = load('gsc-www-pepcodex-com-by-query.json');
const gscPQ = load('gsc-www-pepcodex-com-by-page-query.json');
const gscDev = load('gsc-www-pepcodex-com-by-device.json');
const gscCtry = load('gsc-www-pepcodex-com-by-country.json');
const ga4DailyF = load('ga4-daily.json');
const ga4Land = load('ga4-landing-pages.json').rows;
const ga4Chan = load('ga4-channels.json').rows;
const ga4Dev = load('ga4-devices.json').rows;
const ga4Ctry = load('ga4-country.json').rows;
const ga4Host = load('ga4-hostname.json').rows;
const ga4Src = load('ga4-sources.json').rows;
const ga4Ev = load('ga4-events.json').rows;
const ga4Daily = ga4DailyF.rows;
const sitemap = JSON.parse(
  fs.readFileSync(path.join(OUT, 'LIVE-SITEMAP-URLS.json'), 'utf8'),
);

const pages = gscPage.rows || [];
const queries = gscQuery.rows || [];
const pq = gscPQ.rows || [];
const dates = (gscDate.rows || []).slice().sort((a, b) => a.date.localeCompare(b.date));

const sum = (rows, k) => rows.reduce((a, r) => a + (Number(r[k]) || 0), 0);
const pathOf = (u) => {
  try {
    return new URL(u).pathname.replace(/\/$/, '') || '/';
  } catch {
    return u;
  }
};
const prefix = (u) => {
  const p = pathOf(u).split('/').filter(Boolean)[0] || 'home';
  return p;
};
const brandQ = (q) => /pepcodex|pep.?codex|pep tracker|peptracker/i.test(q);

const monthMap = {};
for (const r of dates) {
  const m = r.date.slice(0, 7);
  if (!monthMap[m]) monthMap[m] = { month: m, clicks: 0, impressions: 0, days: 0 };
  monthMap[m].clicks += r.clicks;
  monthMap[m].impressions += r.impressions;
  monthMap[m].days += 1;
}
const months = Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));
for (const m of months) m.ctr = m.impressions ? +((m.clicks / m.impressions) * 100).toFixed(3) : 0;

const last28 = dates.slice(-28);
const prev28 = dates.slice(-56, -28);

const byPrefix = {};
for (const r of pages) {
  const p = prefix(r.page);
  if (!byPrefix[p]) byPrefix[p] = { prefix: p, pages: 0, clicks: 0, impressions: 0 };
  byPrefix[p].pages += 1;
  byPrefix[p].clicks += r.clicks;
  byPrefix[p].impressions += r.impressions;
}

const sitemapSet = new Set((sitemap.urls || []).map((u) => u.replace(/\/$/, '')));
const impressed = pages.filter((r) => r.impressions > 0);
const silentSitemap = (sitemap.urls || []).filter((u) => {
  const n = u.replace(/\/$/, '');
  return !pages.some((p) => p.page.replace(/\/$/, '') === n);
});

const highImpLowCtr = pages
  .filter((r) => r.impressions >= 200 && r.ctr < 1 && r.position <= 20)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 25);

const striking = pages
  .filter((r) => r.position >= 4 && r.position <= 15 && r.impressions >= 50)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 25);

const losing = pages
  .filter((r) => r.impressions >= 80 && r.clicks <= 1)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 20);

const topClick = pages.slice().sort((a, b) => b.clicks - a.clicks).slice(0, 20);
const topImp = pages.slice().sort((a, b) => b.impressions - a.impressions).slice(0, 20);

const brandQueries = queries.filter((r) => brandQ(r.query));
const nonBrand = queries.filter((r) => !brandQ(r.query));

const queryCannibal = {};
for (const r of pq) {
  if (!queryCannibal[r.query]) queryCannibal[r.query] = [];
  queryCannibal[r.query].push({ page: r.page, clicks: r.clicks, impressions: r.impressions, position: r.position });
}
const cannibals = Object.entries(queryCannibal)
  .filter(([, arr]) => arr.length >= 3 && sum(arr, 'impressions') >= 40)
  .map(([query, arr]) => ({
    query,
    urls: arr.length,
    impressions: sum(arr, 'impressions'),
    clicks: sum(arr, 'clicks'),
    top: arr.sort((a, b) => b.impressions - a.impressions).slice(0, 4),
  }))
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 20);

const watchUrls = [
  '/blog/cagrilintide-semaglutide-approval',
  '/peptides/semaglutide',
  '/peptides/orforglipron',
  '/peptides/bpc-157',
  '/protocols/bpc-157-tb-500',
  '/directory',
  '/clinics',
  '/compare/tirzepatide-vs-semaglutide',
  '/blog/semaglutide-vs-tirzepatide-2026',
];
const watched = watchUrls.map((p) => {
  const hits = pages.filter((r) => pathOf(r.page) === p || pathOf(r.page).startsWith(p));
  return { path: p, rows: hits, clicks: sum(hits, 'clicks'), impressions: sum(hits, 'impressions') };
});

const ga4Sessions = sum(ga4Daily, 'sessions');
const ga4Users = sum(ga4Daily, 'totalUsers');
const sg = (ga4Ctry || []).find((r) => /singapore/i.test(r.country || r.countryId || ''));
const organic = (ga4Chan || []).find((r) => /organic/i.test(r.sessionDefaultChannelGroup || r.sessionDefaultChannelGrouping || Object.values(r)[0] || ''));

const out = {
  pulled: {
    gsc_range: gscDate.range || { start: dates[0]?.date, end: dates.at(-1)?.date },
    gsc_property: 'https://www.pepcodex.com/',
    gsc_apex: 'NOT IN THIS ACCOUNT',
    ga4_property: '521749549',
    access_date: '2026-09-02',
  },
  gsc_totals: {
    days: dates.length,
    first: dates[0]?.date,
    last: dates.at(-1)?.date,
    clicks: sum(dates, 'clicks'),
    impressions: sum(dates, 'impressions'),
    ctr: +((sum(dates, 'clicks') / sum(dates, 'impressions')) * 100).toFixed(3),
    pages_with_impressions: impressed.length,
    queries: queries.length,
    live_sitemap_urls: sitemap.count,
    sitemap_with_zero_gsc_rows: silentSitemap.length,
  },
  last28: {
    clicks: sum(last28, 'clicks'),
    impressions: sum(last28, 'impressions'),
    ctr: last28.length ? +((sum(last28, 'clicks') / (sum(last28, 'impressions') || 1)) * 100).toFixed(3) : 0,
  },
  prev28: {
    clicks: sum(prev28, 'clicks'),
    impressions: sum(prev28, 'impressions'),
  },
  months,
  devices: gscDev.rows,
  countries_top: (gscCtry.rows || []).slice().sort((a, b) => b.clicks - a.clicks).slice(0, 15),
  by_prefix: Object.values(byPrefix).sort((a, b) => b.impressions - a.impressions),
  brand: {
    queries: brandQueries.length,
    clicks: sum(brandQueries, 'clicks'),
    impressions: sum(brandQueries, 'impressions'),
    nonbrand_queries: nonBrand.length,
    nonbrand_clicks: sum(nonBrand, 'clicks'),
    nonbrand_impressions: sum(nonBrand, 'impressions'),
  },
  top_pages_clicks: topClick,
  top_pages_impressions: topImp,
  high_imp_low_ctr: highImpLowCtr,
  striking_distance: striking,
  high_imp_almost_no_clicks: losing,
  top_queries: queries.slice().sort((a, b) => b.clicks - a.clicks).slice(0, 30),
  top_queries_impressions: queries.slice().sort((a, b) => b.impressions - a.impressions).slice(0, 30),
  cannibal_queries: cannibals,
  watched,
  silent_sitemap_sample: silentSitemap.slice(0, 40),
  ga4: {
    sessions: ga4Sessions,
    users: ga4Users,
    daily_rows: ga4Daily.length,
    channels: ga4Chan,
    devices: ga4Dev,
    hostname: ga4Host,
    events: ga4Ev,
    country_top: (ga4Ctry || []).slice().sort((a, b) => (b.sessions || 0) - (a.sessions || 0)).slice(0, 12),
    singapore: sg || null,
    organic: organic || null,
    landing_top: (ga4Land || []).slice().sort((a, b) => (b.sessions || 0) - (a.sessions || 0)).slice(0, 20),
    sources_top: (ga4Src || []).slice().sort((a, b) => (b.sessions || 0) - (a.sessions || 0)).slice(0, 15),
  },
};

fs.writeFileSync(path.join(OUT, 'FIRST-PARTY-STATS.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify({
  gsc: out.gsc_totals,
  last28: out.last28,
  prev28: out.prev28,
  brand: out.brand,
  months: out.months,
  devices: out.devices,
  by_prefix: out.by_prefix,
  watched: out.watched,
  ga4_sessions: ga4Sessions,
  ga4_users: ga4Users,
  ga4_channels: ga4Chan,
  ga4_host: ga4Host,
  top_click_paths: topClick.map((r) => [pathOf(r.page), r.clicks, r.impressions, r.ctr, r.position]),
  top_imp_paths: topImp.map((r) => [pathOf(r.page), r.impressions, r.clicks, r.ctr, r.position]),
  high_imp_low_ctr: highImpLowCtr.map((r) => [pathOf(r.page), r.impressions, r.clicks, r.ctr, r.position]),
  striking: striking.map((r) => [pathOf(r.page), r.impressions, r.clicks, r.position]),
  top_q_click: queries.slice().sort((a, b) => b.clicks - a.clicks).slice(0, 15).map((r) => [r.query, r.clicks, r.impressions, r.position]),
  top_q_imp: queries.slice().sort((a, b) => b.impressions - a.impressions).slice(0, 15).map((r) => [r.query, r.impressions, r.clicks, r.position]),
  cannibals: cannibals.slice(0, 8).map((c) => [c.query, c.urls, c.impressions, c.clicks]),
  ga4_landing: (ga4Land || []).slice().sort((a, b) => (b.sessions || 0) - (a.sessions || 0)).slice(0, 12),
  ga4_country: (ga4Ctry || []).slice(0, 8),
  ga4_events: ga4Ev,
}, null, 2));
