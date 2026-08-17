// Pulls Search Console data for every property the impersonated SA can reach.
// Writes .planning/data/gsc-<property>-<dimension>.{json,csv}
//
//   node scripts/gsc-pull.mjs [--months=16]
import fs from 'fs';
import path from 'path';
import { mintToken } from './gsc-probe.mjs';

const OUT = path.join('.planning', 'data');
const args = process.argv.slice(2);
const MONTHS = Math.min(Number((args.find((a) => a.startsWith('--months=')) || '').split('=')[1]) || 16, 16);

const ymd = (d) => d.toISOString().slice(0, 10);
function range(months) {
  const end = new Date();
  end.setDate(end.getDate() - 2); // GSC lags ~2 days
  const start = new Date(end);
  start.setMonth(start.getMonth() - months);
  return { startDate: ymd(start), endDate: ymd(end) };
}

const slug = (s) =>
  s.replace(/^sc-domain:/, 'domain-').replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '').toLowerCase();

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
}

async function query(token, siteUrl, body) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await res.json();
  if (j.error) throw new Error(`${j.error.code} ${j.error.message}`);
  return j.rows ?? [];
}

const main = async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const token = await mintToken();
  const dates = range(MONTHS);
  console.log(`window: ${dates.startDate} -> ${dates.endDate} (${MONTHS} months)\n`);

  const sites = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

  const props = (sites.siteEntry ?? []).map((e) => e.siteUrl);
  if (!props.length) return console.log('no properties visible');

  for (const site of props) {
    console.log(`\n########## ${site} ##########`);
    const tag = slug(site);

    for (const dims of [['page'], ['query'], ['date']]) {
      const rows = await query(token, site, {
        ...dates,
        dimensions: dims,
        rowLimit: 25000,
        dataState: 'final',
      });
      const flat = rows.map((r) => {
        const o = {};
        dims.forEach((d, i) => (o[d] = r.keys[i]));
        o.clicks = r.clicks;
        o.impressions = r.impressions;
        o.ctr = +(r.ctr * 100).toFixed(2);
        o.position = +r.position.toFixed(1);
        return o;
      });
      const name = `gsc-${tag}-${dims.join('-')}`;
      fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(flat, null, 2));
      writeCsv(name, flat);
      console.log(`  ${dims.join('+').padEnd(6)} ${String(flat.length).padStart(6)} rows -> ${name}.csv`);
    }

    // headline totals
    const tot = await query(token, site, { ...dates, dimensions: [], dataState: 'final' });
    if (tot.length) {
      const t = tot[0];
      console.log(
        `  TOTALS  clicks=${t.clicks}  impressions=${t.impressions}  ctr=${(t.ctr * 100).toFixed(2)}%  avgPos=${t.position.toFixed(1)}`
      );
    }
  }
};

main().catch((e) => {
  console.error('FAILED:', String(e.message ?? e).split('\n')[0]);
  process.exit(1);
});
