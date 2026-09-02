// Honest GSC re-pull: detects the REAL date range rather than assuming, and pulls the
// dimensions the first pass missed (device, country, searchAppearance, page+query).
//
//   node scripts/gsc-repull.mjs
//
// Writes .planning/data/v2/gsc-<prop>-<cut>.json
import fs from 'fs';
import path from 'path';
import { mintToken } from './gsc-probe.mjs';

const OUT = path.join('.planning', 'data', 'v2');
const ymd = (d) => d.toISOString().slice(0, 10);

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

// Ask for a deliberately over-wide window, then read back what Google actually returned.
async function realRange(token, site) {
  const rows = await query(token, site, {
    startDate: '2024-01-01',
    endDate: ymd(new Date()),
    dimensions: ['date'],
    rowLimit: 25000,
  });
  if (!rows.length) return null;
  const dates = rows.map((r) => r.keys[0]).sort();
  return { first: dates[0], last: dates.at(-1), days: dates.length };
}

const flat = (rows, dims) =>
  rows.map((r) => {
    const o = {};
    dims.forEach((d, i) => (o[d] = r.keys[i]));
    o.clicks = r.clicks;
    o.impressions = r.impressions;
    o.ctr = +(r.ctr * 100).toFixed(3);
    o.position = +r.position.toFixed(1);
    return o;
  });

const slug = (s) =>
  s.replace(/^sc-domain:/, 'domain-').replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '').toLowerCase();

const main = async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const token = await mintToken();

  const sites = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
  const props = (sites.siteEntry ?? []).map((e) => e.siteUrl);

  const manifest = { pulledAt: new Date().toISOString(), properties: {} };

  for (const site of props) {
    const tag = slug(site);
    const range = await realRange(token, site);
    if (!range) {
      console.log(`\n### ${site} — NO DATA`);
      continue;
    }
    console.log(`\n### ${site}`);
    console.log(`    REAL data range: ${range.first} -> ${range.last}  (${range.days} days with data)`);
    manifest.properties[site] = range;

    const dates = { startDate: range.first, endDate: range.last };
    const cuts = [
      ['page', ['page']],
      ['query', ['query']],
      ['date', ['date']],
      ['device', ['device']],
      ['country', ['country']],
      ['appearance', ['searchAppearance']],
      ['date-device', ['date', 'device']],
      ['page-device', ['page', 'device']],
      ['page-query', ['page', 'query']],
    ];

    for (const [name, dims] of cuts) {
      try {
        const rows = await query(token, site, { ...dates, dimensions: dims, rowLimit: 25000, dataState: 'final' });
        const data = flat(rows, dims);
        fs.writeFileSync(path.join(OUT, `gsc-${tag}-${name}.json`), JSON.stringify(data, null, 2));
        const i = data.reduce((a, r) => a + r.impressions, 0);
        const c = data.reduce((a, r) => a + r.clicks, 0);
        console.log(`    ${name.padEnd(12)} ${String(data.length).padStart(5)} rows   impr ${String(i).padStart(6)}  clicks ${String(c).padStart(4)}`);
      } catch (e) {
        console.log(`    ${name.padEnd(12)} FAILED: ${String(e.message).slice(0, 80)}`);
      }
    }

    const tot = await query(token, site, { ...dates, dimensions: [], dataState: 'final' });
    if (tot.length) {
      const t = tot[0];
      manifest.properties[site].totals = {
        clicks: t.clicks, impressions: t.impressions,
        ctr: +(t.ctr * 100).toFixed(3), position: +t.position.toFixed(1),
      };
      console.log(`    TOTALS       clicks=${t.clicks} impressions=${t.impressions} ctr=${(t.ctr * 100).toFixed(2)}% pos=${t.position.toFixed(1)}`);
    }
  }

  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nwrote ${OUT}/  (manifest.json records the REAL date ranges)`);
};

main().catch((e) => {
  console.error('FAILED:', String(e.message ?? e).split('\n')[0]);
  process.exit(1);
});
