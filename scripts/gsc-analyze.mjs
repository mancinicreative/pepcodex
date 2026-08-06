// Diagnostic read of the pulled GSC data. Read-only.
import fs from 'fs';
import path from 'path';

const OUT = path.join('.planning', 'data');
const load = (n) => {
  const p = path.join(OUT, `${n}.json`);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')) : [];
};
const sum = (a, k) => a.reduce((t, r) => t + (r[k] || 0), 0);
const pct = (n, d) => (d ? ((n / d) * 100).toFixed(2) : '0.00');

const PROPS = [
  { tag: 'pepcodex-com', label: 'apex  https://pepcodex.com/' },
  { tag: 'www-pepcodex-com', label: 'www   https://www.pepcodex.com/' },
];

// ---------- combined headline ----------
console.log('=============== COMBINED (both properties) ===============');
let allPages = [];
let allQueries = [];
for (const p of PROPS) {
  allPages = allPages.concat(load(`gsc-${p.tag}-page`));
  allQueries = allQueries.concat(load(`gsc-${p.tag}-query`));
}
const C = sum(allPages, 'clicks');
const I = sum(allPages, 'impressions');
console.log(`clicks ${C}   impressions ${I}   CTR ${pct(C, I)}%`);
console.log(`(healthy site CTR at these positions would be 1.5-3%+)\n`);

// ---------- position distribution ----------
console.log('=============== WHERE PAGES RANK ===============');
const buckets = [
  ['1-3    (top of page 1)', (p) => p <= 3],
  ['4-10   (rest of page 1)', (p) => p > 3 && p <= 10],
  ['11-20  (page 2 - STRIKING DISTANCE)', (p) => p > 10 && p <= 20],
  ['21-50  (page 3-5)', (p) => p > 20 && p <= 50],
  ['51+    (effectively invisible)', (p) => p > 50],
];
for (const [label, fn] of buckets) {
  const rows = allPages.filter((r) => fn(r.position));
  const c = sum(rows, 'clicks');
  const i = sum(rows, 'impressions');
  console.log(
    `  ${label.padEnd(38)} pages ${String(rows.length).padStart(4)}   impr ${String(i).padStart(6)}   clicks ${String(c).padStart(4)}   CTR ${pct(c, i)}%`
  );
}

// ---------- biggest opportunities ----------
console.log('\n=============== HIGH IMPRESSIONS, ZERO CLICKS ===============');
console.log('(Google shows these; nobody clicks. Title/description problem, or wrong intent.)');
allPages
  .filter((r) => r.clicks === 0)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 15)
  .forEach((r) =>
    console.log(`  ${String(r.impressions).padStart(5)} impr  pos ${String(r.position).padStart(5)}  ${r.page.replace('https://www.pepcodex.com', '').replace('https://pepcodex.com', '')}`)
  );

console.log('\n=============== STRIKING DISTANCE (pos 11-20, most impressions) ===============');
console.log('(Closest to page 1 — the cheapest wins available.)');
allPages
  .filter((r) => r.position > 10 && r.position <= 20)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 12)
  .forEach((r) =>
    console.log(`  ${String(r.impressions).padStart(5)} impr  pos ${String(r.position).padStart(5)}  clicks ${String(r.clicks).padStart(3)}  ${r.page.replace(/^https:\/\/(www\.)?pepcodex\.com/, '')}`)
  );

console.log('\n=============== TOP PAGES BY CLICKS ===============');
allPages
  .sort((a, b) => b.clicks - a.clicks)
  .slice(0, 10)
  .forEach((r) =>
    console.log(`  ${String(r.clicks).padStart(4)} clicks  ${String(r.impressions).padStart(5)} impr  CTR ${String(r.ctr).padStart(5)}%  pos ${String(r.position).padStart(5)}  ${r.page.replace(/^https:\/\/(www\.)?pepcodex\.com/, '')}`)
  );

console.log('\n=============== TOP QUERIES BY IMPRESSIONS ===============');
const qAgg = {};
for (const r of allQueries) {
  qAgg[r.query] ??= { query: r.query, clicks: 0, impressions: 0, pos: [] };
  qAgg[r.query].clicks += r.clicks;
  qAgg[r.query].impressions += r.impressions;
  qAgg[r.query].pos.push(r.position);
}
Object.values(qAgg)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 20)
  .forEach((q) => {
    const avg = (q.pos.reduce((a, b) => a + b, 0) / q.pos.length).toFixed(1);
    console.log(`  ${String(q.impressions).padStart(5)} impr  ${String(q.clicks).padStart(3)} clk  pos ${String(avg).padStart(5)}  ${q.query.slice(0, 60)}`);
  });

// ---------- trend ----------
console.log('\n=============== TREND (monthly) ===============');
const monthly = {};
for (const p of PROPS) {
  for (const r of load(`gsc-${p.tag}-date`)) {
    const m = r.date.slice(0, 7);
    monthly[m] ??= { clicks: 0, impressions: 0 };
    monthly[m].clicks += r.clicks;
    monthly[m].impressions += r.impressions;
  }
}
const months = Object.keys(monthly).sort();
const maxI = Math.max(...months.map((m) => monthly[m].impressions), 1);
for (const m of months) {
  const v = monthly[m];
  const bar = '#'.repeat(Math.round((v.impressions / maxI) * 40));
  console.log(`  ${m}  impr ${String(v.impressions).padStart(6)}  clicks ${String(v.clicks).padStart(4)}  ${bar}`);
}

// ---------- split evidence ----------
console.log('\n=============== THE APEX / WWW SPLIT ===============');
for (const p of PROPS) {
  const pages = load(`gsc-${p.tag}-page`);
  const c = sum(pages, 'clicks');
  const i = sum(pages, 'impressions');
  const dates = load(`gsc-${p.tag}-date`).map((d) => d.date).sort();
  console.log(
    `  ${p.label.padEnd(34)} clicks ${String(c).padStart(4)}  impr ${String(i).padStart(6)}  CTR ${pct(c, i).padStart(5)}%  days ${dates.length}`
  );
  if (dates.length) console.log(`  ${''.padEnd(34)} data ${dates[0]} -> ${dates.at(-1)}`);
}
