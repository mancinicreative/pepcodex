// Diagnoses WHY pages are invisible in search, using the GSC URL Inspection API.
// Quantifies coverage first (sitemap vs pages with any impression), then inspects a
// stratified sample of silent pages to get Google's own verdict per URL.
//
//   node scripts/gsc-index-diagnose.mjs [--sample=60]
//
// URL Inspection is rate-limited (~2000/day, 600/min) so we sample rather than sweep.
import fs from 'fs';
import path from 'path';
import { mintToken } from './gsc-probe.mjs';

const V2 = path.join('.planning', 'data', 'v2');
const SITE = 'https://www.pepcodex.com/'; // inspect against the CURRENT property
const SAMPLE = Number((process.argv.slice(2).find((a) => a.startsWith('--sample=')) || '').split('=')[1]) || 60;

const load = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')) : []);
const norm = (u) => u.replace(/^https?:\/\/(www\.)?pepcodex\.com/, '').replace(/\/$/, '') || '/';
const section = (p) => {
  const parts = p.split('/').filter(Boolean);
  return parts.length ? `/${parts[0]}/` : '/(home)';
};

async function inspect(token, url) {
  const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE }),
  });
  const j = await res.json();
  if (j.error) return { error: `${j.error.code} ${j.error.message.slice(0, 90)}` };
  const r = j.inspectionResult?.indexStatusResult ?? {};
  return {
    verdict: r.verdict,
    coverageState: r.coverageState,
    robotsTxtState: r.robotsTxtState,
    indexingState: r.indexingState,
    pageFetchState: r.pageFetchState,
    lastCrawlTime: r.lastCrawlTime,
    googleCanonical: r.googleCanonical,
    userCanonical: r.userCanonical,
    referringUrls: (r.referringUrls || []).length,
  };
}

const main = async () => {
  const token = await mintToken();

  // ---------- coverage ----------
  const crawl = load(path.join('.planning', 'data', 'crawl-baseline.json'));
  const seen = new Set();
  for (const tag of ['pepcodex-com', 'www-pepcodex-com']) {
    for (const r of load(path.join(V2, `gsc-${tag}-page.json`))) {
      if (r.impressions > 0) seen.add(norm(r.page));
    }
  }
  const all = crawl.map((r) => norm(r.url));
  const silent = all.filter((u) => !seen.has(u));

  console.log('================ COVERAGE ================');
  console.log(`pages in sitemap/crawl : ${all.length}`);
  console.log(`with >=1 impression    : ${all.length - silent.length}  (${(((all.length - silent.length) / all.length) * 100).toFixed(1)}%)`);
  console.log(`NEVER seen in search   : ${silent.length}  (${((silent.length / all.length) * 100).toFixed(1)}%)`);

  const bySec = {};
  for (const u of all) {
    const s = section(u);
    bySec[s] ??= { total: 0, silent: 0 };
    bySec[s].total++;
    if (!seen.has(u)) bySec[s].silent++;
  }
  console.log('\nSECTION          TOTAL  SILENT   % silent');
  Object.entries(bySec)
    .filter(([, v]) => v.total >= 3)
    .sort((a, b) => b[1].silent - a[1].silent)
    .forEach(([s, v]) =>
      console.log(s.padEnd(16) + String(v.total).padStart(6) + String(v.silent).padStart(8) + String(((v.silent / v.total) * 100).toFixed(0) + '%').padStart(11))
    );

  // ---------- stratified sample of silent pages ----------
  const bucket = {};
  for (const u of silent) (bucket[section(u)] ??= []).push(u);
  const picks = [];
  const sections = Object.keys(bucket);
  let i = 0;
  while (picks.length < Math.min(SAMPLE, silent.length)) {
    const s = sections[i % sections.length];
    const b = bucket[s];
    if (b && b.length) picks.push(b.shift());
    i++;
    if (i > silent.length * 2) break;
  }

  console.log(`\n================ INSPECTING ${picks.length} SILENT PAGES ================`);
  const results = [];
  for (const [n, u] of picks.entries()) {
    const url = `https://www.pepcodex.com${u}`;
    const r = await inspect(token, url);
    results.push({ url: u, ...r });
    if (r.error) console.log(`  ${String(n + 1).padStart(3)}. ERROR ${r.error}`);
    else console.log(`  ${String(n + 1).padStart(3)}. ${String(r.coverageState || r.verdict || '?').padEnd(42)} ${u.slice(0, 46)}`);
  }

  fs.writeFileSync(path.join(V2, 'index-inspection.json'), JSON.stringify(results, null, 2));

  // ---------- verdict tally ----------
  console.log('\n================ WHY THEY ARE INVISIBLE ================');
  const tally = {};
  for (const r of results) {
    const k = r.error ? `ERROR: ${r.error}` : r.coverageState || r.verdict || 'unknown';
    tally[k] = (tally[k] || 0) + 1;
  }
  Object.entries(tally)
    .sort((a, b) => b[1] - a[1])
    .forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));

  const canonMismatch = results.filter((r) => r.googleCanonical && r.userCanonical && r.googleCanonical !== r.userCanonical);
  if (canonMismatch.length) {
    console.log(`\n  CANONICAL DISAGREEMENTS (Google picked a different URL): ${canonMismatch.length}`);
    canonMismatch.slice(0, 6).forEach((r) => console.log(`    ${r.url}\n      you: ${r.userCanonical}\n      Google: ${r.googleCanonical}`));
  }

  const never = results.filter((r) => !r.lastCrawlTime && !r.error);
  console.log(`\n  never crawled at all: ${never.length} of ${results.length}`);

  console.log(`\nwrote ${V2}/index-inspection.json`);
};

main().catch((e) => {
  console.error('FAILED:', String(e.message ?? e).split('\n')[0]);
  process.exit(1);
});
