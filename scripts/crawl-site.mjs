// Crawls every URL in the production sitemap and records the SEO signals that
// decide whether a page can rank at all. Needs no Google credentials.
//
//   node scripts/crawl-site.mjs [--limit=N] [--concurrency=8]
//
// Writes .planning/data/crawl-baseline.{json,csv} + prints a summary.
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.join('.planning', 'data');
const SITEMAP = 'https://www.pepcodex.com/sitemap-0.xml';
const args = process.argv.slice(2);
const argVal = (n, d) => {
  const hit = args.find((a) => a.startsWith(`--${n}=`));
  return hit ? Number(hit.split('=')[1]) : d;
};
const LIMIT = argVal('limit', Infinity);
const CONCURRENCY = argVal('concurrency', 8);

const text = (html, re) => {
  const m = html.match(re);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
};

async function getSitemapUrls() {
  const res = await fetch(SITEMAP);
  if (!res.ok) throw new Error(`sitemap ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function crawlOne(url) {
  const row = { url, status: 0, redirectedTo: '', canonical: '', title: '', titleLen: 0,
    metaDesc: '', metaDescLen: 0, robots: '', h1Count: 0, wordCount: 0, internalLinks: 0,
    hasSchema: false, error: '' };
  try {
    const res = await fetch(url, { redirect: 'follow' });
    row.status = res.status;
    if (res.url !== url) row.redirectedTo = res.url;
    const html = await res.text();

    row.canonical = text(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    row.title = text(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    row.titleLen = row.title.length;
    row.metaDesc = text(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
    row.metaDescLen = row.metaDesc.length;
    row.robots = text(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
    row.h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    row.hasSchema = /application\/ld\+json/i.test(html);

    const body = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
    row.wordCount = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
    row.internalLinks = [...html.matchAll(/<a[^>]+href=["'](\/[^"'#?]*|https:\/\/www\.pepcodex\.com[^"'#?]*)["']/gi)].length;
  } catch (e) {
    row.error = String(e.message ?? e).slice(0, 120);
  }
  return row;
}

async function pool(items, n, fn, onTick) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    for (;;) {
      const idx = i++;
      if (idx >= items.length) return;
      out[idx] = await fn(items[idx]);
      onTick?.(idx + 1, items.length);
    }
  }));
  return out;
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let urls = await getSitemapUrls();
  if (Number.isFinite(LIMIT)) urls = urls.slice(0, LIMIT);
  console.log(`crawling ${urls.length} URLs @ concurrency ${CONCURRENCY}\n`);

  let last = 0;
  const rows = await pool(urls, CONCURRENCY, crawlOne, (done, total) => {
    if (done - last >= 100 || done === total) { last = done; console.log(`  ${done}/${total}`); }
  });

  fs.writeFileSync(path.join(OUT_DIR, 'crawl-baseline.json'), JSON.stringify(rows, null, 2));
  const cols = Object.keys(rows[0]);
  const esc = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  fs.writeFileSync(path.join(OUT_DIR, 'crawl-baseline.csv'),
    [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n'));

  // ---- findings ----
  const norm = (u) => (u || '').replace(/\/$/, '');
  const bad = rows.filter((r) => r.status !== 200);
  const redirected = rows.filter((r) => r.redirectedTo);
  const canonMismatch = rows.filter((r) => r.status === 200 && r.canonical && norm(r.canonical) !== norm(r.url));
  const noindex = rows.filter((r) => /noindex/i.test(r.robots));
  const noTitle = rows.filter((r) => r.status === 200 && !r.title);
  const longTitle = rows.filter((r) => r.titleLen > 60);
  const noDesc = rows.filter((r) => r.status === 200 && !r.metaDesc);
  const thin = rows.filter((r) => r.status === 200 && r.wordCount < 300);
  const noSchema = rows.filter((r) => r.status === 200 && !r.hasSchema);
  const multiH1 = rows.filter((r) => r.h1Count > 1);
  const noH1 = rows.filter((r) => r.status === 200 && r.h1Count === 0);
  const errored = rows.filter((r) => r.error);

  const dupTitles = Object.entries(
    rows.filter((r) => r.title).reduce((a, r) => { (a[r.title] ||= []).push(r.url); return a; }, {})
  ).filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length);

  const line = (label, arr) => console.log(`  ${label.padEnd(34)} ${String(arr.length).padStart(5)}`);
  console.log(`\n===== CRAWL SUMMARY (${rows.length} URLs) =====`);
  line('non-200 status', bad);
  line('redirected (sitemap != final)', redirected);
  line('canonical != own URL', canonMismatch);
  line('noindex', noindex);
  line('fetch errors', errored);
  console.log('  --- content quality ---');
  line('missing <title>', noTitle);
  line('title > 60 chars (truncated in SERP)', longTitle);
  line('missing meta description', noDesc);
  line('thin (<300 words)', thin);
  line('no JSON-LD schema', noSchema);
  line('missing H1', noH1);
  line('multiple H1', multiH1);
  console.log(`  duplicate title groups            ${String(dupTitles.length).padStart(5)}`);

  if (dupTitles.length) {
    console.log('\n  worst duplicate titles:');
    dupTitles.slice(0, 5).forEach(([t, us]) => console.log(`    ${us.length}x  ${t.slice(0, 70)}`));
  }
  if (canonMismatch.length) {
    console.log('\n  canonical mismatches (first 5):');
    canonMismatch.slice(0, 5).forEach((r) => console.log(`    ${r.url}\n      -> ${r.canonical}`));
  }
  if (bad.length) {
    console.log('\n  non-200 (first 10):');
    bad.slice(0, 10).forEach((r) => console.log(`    ${r.status}  ${r.url}`));
  }

  const orphans = rows.filter((r) => r.status === 200 && r.internalLinks < 5);
  line('\n  very few internal links (<5)', orphans);
  console.log(`\nwrote ${OUT_DIR}/crawl-baseline.{json,csv}\n`);
})();
