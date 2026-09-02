import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.dirname(fileURLToPath(import.meta.url));
const inv = JSON.parse(fs.readFileSync(path.join(OUT, 'INVENTORY.json'), 'utf8'));
const live = JSON.parse(fs.readFileSync(path.join(OUT, 'LIVE-SITEMAP-URLS.json'), 'utf8'));

const repoUrls = new Set(
  inv.surfaces.filter((s) => s.url && s.sitemap_expected).map((s) => s.url.replace(/\/$/, '')),
);
const liveUrls = new Set(live.urls.map((u) => u.replace(/\/$/, '')));

const inLiveNotRepo = [...liveUrls].filter((u) => !repoUrls.has(u)).sort();
const inRepoNotLive = [...repoUrls].filter((u) => !liveUrls.has(u)).sort();
const both = [...repoUrls].filter((u) => liveUrls.has(u)).sort();

const clinicRecords = inv.surfaces.filter((s) => s.type === 'clinic-record');
const clinicCsv = [
  'surface_id,name,file,city,state,website,phone,featured,verifiedListing,placeholderWebsite,placeholderPhone',
  ...clinicRecords.map((s) =>
    [
      s.surface_id,
      JSON.stringify(s.title),
      s.file,
      JSON.stringify(s.extra.city || ''),
      JSON.stringify(s.extra.state || ''),
      s.extra.website || '',
      s.extra.phone || '',
      s.extra.featured,
      s.extra.verifiedListing,
      s.extra.placeholderWebsite,
      s.extra.placeholderPhone,
    ].join(','),
  ),
].join('\n');

const compact = inv.surfaces.map((s) => ({
  surface_id: s.surface_id,
  type: s.type,
  url: s.url,
  file: s.file,
  title: s.title,
  indexable: s.indexable,
  sitemap_expected: s.sitemap_expected,
  robots: s.robots,
  lastUpdated: s.lastUpdated,
}));

const recon = {
  frozen_at: inv.summary.frozen_at,
  live_sitemap_fetched_at: live.fetched_at,
  repo_sitemap_expected: repoUrls.size,
  live_sitemap: liveUrls.size,
  intersection: both.length,
  live_not_in_repo: inLiveNotRepo.length,
  repo_not_in_live: inRepoNotLive.length,
  coverage_note:
    'Live sitemap is production (main). Repo inventory is the working tree (may be feat/scoring-and-freshness). Differences are expected and must not be guessed away.',
  live_not_in_repo_urls: inLiveNotRepo,
  repo_not_in_live_sample: inRepoNotLive.slice(0, 200),
  repo_not_in_live_count: inRepoNotLive.length,
  repo_not_in_live_by_prefix: inRepoNotLive.reduce((acc, u) => {
    const p = new URL(u).pathname.split('/').filter(Boolean)[0] || 'home';
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {}),
  live_not_in_repo_by_prefix: inLiveNotRepo.reduce((acc, u) => {
    const p = new URL(u).pathname.split('/').filter(Boolean)[0] || 'home';
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {}),
};

fs.writeFileSync(path.join(OUT, 'RECONCILIATION.json'), JSON.stringify(recon, null, 2));
fs.writeFileSync(path.join(OUT, 'INVENTORY-COMPACT.json'), JSON.stringify(compact, null, 2));
fs.writeFileSync(path.join(OUT, 'CLINIC-RECORDS.csv'), clinicCsv);
fs.writeFileSync(
  path.join(OUT, 'REPO-NOT-IN-LIVE.txt'),
  inRepoNotLive.join('\n'),
);
fs.writeFileSync(path.join(OUT, 'LIVE-NOT-IN-REPO.txt'), inLiveNotRepo.join('\n'));
console.log(JSON.stringify({
  repo_sitemap_expected: repoUrls.size,
  live_sitemap: liveUrls.size,
  intersection: both.length,
  live_not_in_repo: inLiveNotRepo.length,
  repo_not_in_live: inRepoNotLive.length,
  live_not_in_repo_by_prefix: recon.live_not_in_repo_by_prefix,
  repo_not_in_live_by_prefix: recon.repo_not_in_live_by_prefix,
}, null, 2));
