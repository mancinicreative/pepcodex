// Pulls GA4 behavioural data using the impersonated service-account token.
//   node scripts/ga4-pull.mjs [--months=16]
import fs from 'fs';
import path from 'path';
import { mintToken } from './gsc-probe.mjs';

const OUT = path.join('.planning', 'data');
const PROPERTY = process.env.GA4_PROPERTY_ID || '521749549';
const MONTHS = Math.min(
  Number((process.argv.slice(2).find((a) => a.startsWith('--months=')) || '').split('=')[1]) || 16,
  16
);

const ymd = (d) => d.toISOString().slice(0, 10);
const end = new Date();
const start = new Date(end);
start.setMonth(start.getMonth() - MONTHS);

async function runReport(token, body) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ dateRanges: [{ startDate: ymd(start), endDate: ymd(end) }], ...body }),
    }
  );
  const j = await res.json();
  if (j.error) throw new Error(`${j.error.code} ${j.error.message}`);
  return j;
}

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

function writeCsv(name, rows) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const esc = (v) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  fs.writeFileSync(
    path.join(OUT, `${name}.csv`),
    [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n')
  );
  fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(rows, null, 2));
}

const REPORTS = [
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
];

const main = async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const token = await mintToken();
  console.log(`GA4 property ${PROPERTY}   window ${ymd(start)} -> ${ymd(end)}\n`);

  for (const r of REPORTS) {
    try {
      const rows = toRows(await runReport(token, r.body));
      writeCsv(r.name, rows);
      console.log(`  ${r.name.padEnd(20)} ${String(rows.length).padStart(4)} rows`);
    } catch (e) {
      console.log(`  ${r.name.padEnd(20)} FAILED: ${String(e.message).slice(0, 100)}`);
    }
  }
  console.log(`\nwrote ${OUT}/ga4-*.{json,csv}`);
};

main().catch((e) => {
  console.error('FAILED:', String(e.message ?? e).split('\n')[0]);
  process.exit(1);
});
