import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.dirname(fileURLToPath(import.meta.url));

const xml = await (await fetch('https://www.pepcodex.com/sitemap-0.xml')).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
fs.writeFileSync(
  path.join(OUT, 'LIVE-SITEMAP-URLS.json'),
  JSON.stringify({ fetched_at: new Date().toISOString(), count: urls.length, urls }, null, 2),
);
console.log('live sitemap urls', urls.length);

const robots = await (await fetch('https://www.pepcodex.com/robots.txt')).text();
fs.writeFileSync(path.join(OUT, 'LIVE-ROBOTS.txt'), robots);

async function probe(url) {
  const res = await fetch(url, { redirect: 'manual' });
  return { url, status: res.status, location: res.headers.get('location') };
}

const probes = [];
for (const u of [
  'https://www.pepcodex.com/',
  'https://pepcodex.com/',
  'https://www.pepcodex.com/clinics',
  'https://www.pepcodex.com/directory',
  'https://www.pepcodex.com/blog/2025-glp1-year-review',
  'https://www.pepcodex.com/peptides/semaglutide',
  'https://www.pepcodex.com/peptides/bpc-157',
]) {
  probes.push(await probe(u));
}
fs.writeFileSync(path.join(OUT, 'LIVE-PROBES.json'), JSON.stringify(probes, null, 2));
console.log(JSON.stringify(probes, null, 2));
