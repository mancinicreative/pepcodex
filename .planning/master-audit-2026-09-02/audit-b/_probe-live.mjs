#!/usr/bin/env node
/**
 * Bounded live HTTP probes for Audit B. No aggressive crawl.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, '_work');
fs.mkdirSync(OUT, { recursive: true });

const URLS = [
  'https://www.pepcodex.com/',
  'https://pepcodex.com/',
  'https://www.pepcodex.com/robots.txt',
  'https://www.pepcodex.com/sitemap-index.xml',
  'https://www.pepcodex.com/sitemap-0.xml',
  'https://www.pepcodex.com/sitemap.xml',
  'https://www.pepcodex.com/llms.txt',
  'https://www.pepcodex.com/llms-full.txt',
  'https://www.pepcodex.com/clinics',
  'https://www.pepcodex.com/clinics/miami',
  'https://www.pepcodex.com/directory',
  'https://www.pepcodex.com/peptides/semaglutide',
  'https://www.pepcodex.com/peptides/bpc-157',
  'https://www.pepcodex.com/peptides/semaglutide/obesity',
  'https://www.pepcodex.com/compare/tirzepatide-vs-semaglutide',
  'https://www.pepcodex.com/glossary/a1c',
  'https://www.pepcodex.com/glossary/off-label',
  'https://www.pepcodex.com/glossary/off-label-use',
  'https://www.pepcodex.com/blog/2025-glp1-year-review',
  'https://www.pepcodex.com/blog/what-is-bpc-157',
  'https://www.pepcodex.com/blog/antimicrobial-peptide-funding',
  'https://www.pepcodex.com/guide/what-is-bpc-157',
  'https://www.pepcodex.com/safety/bpc-157-safety',
  'https://www.pepcodex.com/calculator/reconstitution/bpc-157',
  'https://www.pepcodex.com/calculator/reconstitution/tesamorelin',
  'https://www.pepcodex.com/about',
  'https://www.pepcodex.com/methodology',
  'https://www.pepcodex.com/editorial-policy',
  'https://www.pepcodex.com/advertising-policy',
  'https://www.pepcodex.com/disclaimer',
  'https://www.pepcodex.com/fda-notice',
  'https://www.pepcodex.com/privacy',
  'https://www.pepcodex.com/terms',
  'https://www.pepcodex.com/cookie-policy',
  'https://www.pepcodex.com/newsletter',
  'https://www.pepcodex.com/contact',
  'https://www.pepcodex.com/regulatory-tracker',
  'https://www.pepcodex.com/trials',
  'https://www.pepcodex.com/peptides',
  'https://www.pepcodex.com/blog',
  'https://www.pepcodex.com/compare',
  'https://www.pepcodex.com/guide',
  'https://www.pepcodex.com/glossary',
  'https://www.pepcodex.com/protocols',
  'https://www.pepcodex.com/category/metabolic',
  'https://www.pepcodex.com/logo.png',
  'https://www.pepcodex.com/og-default.png',
  'https://www.pepcodex.com/api/health',
  'https://www.pepcodex.com/peptide/semaglutide',
  'https://www.pepcodex.com/semaglutide',
  'https://www.pepcodex.com/ozempic',
  'https://www.pepcodex.com/this-page-should-404-audit-b',
];

function parseHeaders(raw) {
  const lines = raw.split(/\r?\n/);
  const statusLine = lines[0] || '';
  const headers = {};
  for (const line of lines.slice(1)) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    const k = line.slice(0, i).trim().toLowerCase();
    const v = line.slice(i + 1).trim();
    headers[k] = headers[k] ? headers[k] + ', ' + v : v;
  }
  const m = statusLine.match(/HTTP\/[\d.]+\s+(\d+)/);
  return { status: m ? Number(m[1]) : null, statusLine, headers };
}

async function probe(url) {
  const res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'PepCodex-AuditB/2026-09-02 (read-only technical SEO audit)' } });
  const headers = {};
  res.headers.forEach((v, k) => {
    headers[k.toLowerCase()] = v;
  });
  let bodySnippet = null;
  let metaRobots = null;
  let canonical = null;
  let title = null;
  let h1 = null;
  let jsonldTypes = [];
  let xrobots = headers['x-robots-tag'] || null;
  const ct = headers['content-type'] || '';
  if (/html|xml|text|json/i.test(ct) && res.status !== 308 && res.status !== 301 && res.status !== 302) {
    const text = await res.text();
    bodySnippet = text.slice(0, 2500);
    const robotsM = text.match(/<meta[^>]+name=["']robots["'][^>]*>/i);
    metaRobots = robotsM ? robotsM[0] : null;
    const canM = text.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
    canonical = canM ? canM[0] : null;
    const tM = text.match(/<title>([^<]*)<\/title>/i);
    title = tM ? tM[1] : null;
    const h1M = text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    h1 = h1M ? h1M[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : null;
    const ld = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
    for (const m of ld) {
      try {
        const j = JSON.parse(m[1]);
        jsonldTypes.push(j['@type'] || (Array.isArray(j['@graph']) ? 'graph' : typeof j));
      } catch {
        jsonldTypes.push('PARSE_ERROR');
      }
    }
    return {
      url,
      status: res.status,
      location: headers['location'] || null,
      xRobotsTag: xrobots,
      contentType: ct,
      metaRobots,
      canonical,
      title,
      h1,
      jsonldTypes,
      bodySnippet: bodySnippet.slice(0, 1200),
      lastmodHint: null,
    };
  }
  return {
    url,
    status: res.status,
    location: headers['location'] || null,
    xRobotsTag: xrobots,
    contentType: ct,
    metaRobots,
    canonical,
    title,
    h1,
    jsonldTypes,
    bodySnippet: null,
    lastmodHint: null,
  };
}

const results = [];
for (const url of URLS) {
  try {
    const r = await probe(url);
    results.push(r);
    console.log(r.status, r.xRobotsTag, r.location || '', url);
  } catch (e) {
    results.push({ url, error: String(e) });
    console.error('ERR', url, e.message);
  }
}

// sitemap lastmod sample
try {
  const sm = await fetch('https://www.pepcodex.com/sitemap-0.xml', { headers: { 'User-Agent': 'PepCodex-AuditB/2026-09-02' } });
  const xml = await sm.text();
  const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].slice(0, 25).map((m) => {
    const loc = (m[1].match(/<loc>([^<]+)<\/loc>/) || [])[1];
    const lastmod = (m[1].match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1] || null;
    return { loc, lastmod };
  });
  const count = (xml.match(/<url>/g) || []).length;
  const withLastmod = (xml.match(/<lastmod>/g) || []).length;
  fs.writeFileSync(path.join(OUT, 'live-sitemap-sample.json'), JSON.stringify({ status: sm.status, count, withLastmod, sample: urls }, null, 2));
} catch (e) {
  fs.writeFileSync(path.join(OUT, 'live-sitemap-sample.json'), JSON.stringify({ error: String(e) }, null, 2));
}

fs.writeFileSync(path.join(OUT, 'live-probes.json'), JSON.stringify({ probed_at: new Date().toISOString(), results }, null, 2));
console.log('wrote', results.length, 'probes');
