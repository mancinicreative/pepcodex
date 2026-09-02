import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const matter = require('gray-matter');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CONTENT = path.join(ROOT, 'src/content');
const OUT = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://www.pepcodex.com';
const surfaces = [];
let n = 0;
const sid = (type) =>
  type.toUpperCase().replace(/[^A-Z0-9]+/g, '-') + '-' + String(++n).padStart(4, '0');

function add(rec) {
  surfaces.push({
    surface_id: rec.surface_id || sid(rec.type),
    type: rec.type,
    url: rec.url ?? null,
    file: rec.file || null,
    title: rec.title || null,
    indexable: rec.indexable ?? true,
    sitemap_expected: rec.sitemap_expected ?? true,
    robots: rec.robots || (rec.indexable === false ? 'noindex' : 'index'),
    notes: rec.notes || [],
    lastUpdated: rec.lastUpdated || null,
    extra: rec.extra || {},
  });
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f)).map((f) => path.join(dir, f));
}

function rel(file) {
  return path.relative(ROOT, file).replaceAll('\\', '/');
}

function readFm(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  return { data, content, words: content.split(/\s+/).filter(Boolean).length };
}

const COLLS = [
  { dir: 'peptides', prefix: '/peptides', type: 'peptide' },
  { dir: 'comparisons', prefix: '/compare', type: 'comparison' },
  { dir: 'guides', prefix: '/guide', type: 'guide' },
  { dir: 'safety', prefix: '/safety', type: 'safety' },
  { dir: 'glossary', prefix: '/glossary', type: 'glossary' },
  { dir: 'blog', prefix: '/blog', type: 'blog' },
  { dir: 'protocols', prefix: '/protocols', type: 'protocol' },
  { dir: 'conditions', prefix: '/conditions', type: 'condition' },
];

for (const c of COLLS) {
  for (const file of walk(path.join(CONTENT, c.dir))) {
    const slug = path.basename(file).replace(/\.mdx?$/, '');
    const { data, words } = readFm(file);
    const noindex = data.robots === 'noindex' || data.noindex === true;
    const url = SITE + c.prefix + '/' + slug;
    add({
      type: c.type,
      url,
      file: rel(file),
      title: data.title || data.name || data.term || slug,
      indexable: !noindex,
      sitemap_expected: !noindex,
      robots: noindex ? 'noindex' : data.robots || 'index',
      lastUpdated: data.lastUpdated
        ? String(data.lastUpdated)
        : data.publishDate
          ? String(data.publishDate)
          : null,
      extra: {
        slug,
        words,
        category: data.category || null,
        evidenceStrength: data.evidenceStrength || data.evidenceLevel || null,
        robots_fm: data.robots || null,
        noindex_fm: data.noindex || false,
        featured: data.featured || false,
        conditions: Array.isArray(data.conditions)
          ? data.conditions.map((x) => x.slug || x)
          : [],
        peptides: data.peptides || data.relatedPeptides || null,
      },
    });
    if (c.type === 'peptide' && Array.isArray(data.conditions)) {
      for (const cond of data.conditions) {
        if (!cond?.slug) continue;
        add({
          type: 'peptide-condition',
          url: SITE + '/peptides/' + slug + '/' + cond.slug,
          file: rel(file),
          title: (data.name || slug) + ' / ' + (cond.name || cond.slug),
          lastUpdated: data.lastUpdated ? String(data.lastUpdated) : null,
          extra: { peptide: slug, condition: cond.slug },
        });
      }
    }
  }
}

for (const file of walk(path.join(CONTENT, 'calculators'))) {
  const { data } = readFm(file);
  if (data.peptideSlug && data.calculatorType === 'reconstitution') {
    add({
      type: 'calculator',
      url: SITE + '/calculator/reconstitution/' + data.peptideSlug,
      file: rel(file),
      title: data.name || data.peptideSlug,
      lastUpdated: data.lastUpdated ? String(data.lastUpdated) : null,
      extra: { peptideSlug: data.peptideSlug, calculatorType: data.calculatorType },
    });
  } else {
    add({
      type: 'calculator-unrouted',
      url: null,
      file: rel(file),
      title: data.name || path.basename(file),
      sitemap_expected: false,
      indexable: false,
      notes: ['calculator file without reconstitution route mapping'],
      extra: { peptideSlug: data.peptideSlug, calculatorType: data.calculatorType },
    });
  }
}

for (const file of walk(path.join(CONTENT, 'cities'))) {
  const slug = path.basename(file).replace(/\.mdx?$/, '');
  const { data } = readFm(file);
  add({
    type: 'city-clinic-page',
    url: SITE + '/clinics/' + slug,
    file: rel(file),
    title: data.name ? data.name + ', ' + (data.stateAbbr || data.state || '') : slug,
    indexable: false,
    sitemap_expected: false,
    robots: 'noindex',
    notes: [
      'template src/pages/clinics/[city].astro forces robots=noindex; excluded from sitemap',
    ],
    extra: { city: data.name, state: data.state, population: data.population },
  });
}

for (const file of walk(path.join(CONTENT, 'clinics'))) {
  const slug = path.basename(file).replace(/\.mdx?$/, '');
  const { data } = readFm(file);
  add({
    type: 'clinic-record',
    url: null,
    file: rel(file),
    title: data.name || slug,
    indexable: false,
    sitemap_expected: false,
    robots: 'noindex',
    notes: [
      'clinic MDX is a data record rendered on city pages, not a standalone URL',
    ],
    extra: {
      slug,
      city: data.city,
      state: data.state,
      address: data.address || null,
      phone: data.phone || null,
      website: data.website || null,
      services: data.services || [],
      peptides: data.peptides || [],
      featured: !!data.featured,
      verifiedListing: !!data.verifiedListing,
      placeholderWebsite:
        typeof data.website === 'string' && data.website.includes('example.com'),
      placeholderPhone: typeof data.phone === 'string' && /555-/.test(data.phone),
    },
  });
}

const STATIC = [
  ['/', 'home', 'src/pages/index.astro'],
  ['/about', 'trust', 'src/pages/about.astro'],
  ['/advertising-policy', 'trust', 'src/pages/advertising-policy.astro'],
  ['/bioregulators', 'hub', 'src/pages/bioregulators.astro'],
  ['/blog', 'index', 'src/pages/blog/index.astro'],
  ['/compare', 'index', 'src/pages/compare/index.astro'],
  ['/conditions', 'index', 'src/pages/conditions/index.astro'],
  ['/contact', 'trust', 'src/pages/contact.astro'],
  ['/cookie-policy', 'trust', 'src/pages/cookie-policy.astro'],
  ['/directory', 'directory', 'src/pages/directory.astro'],
  ['/disclaimer', 'trust', 'src/pages/disclaimer.astro'],
  ['/editorial-policy', 'trust', 'src/pages/editorial-policy.astro'],
  ['/fda-notice', 'trust', 'src/pages/fda-notice.astro'],
  ['/glossary', 'index', 'src/pages/glossary/index.astro'],
  ['/guide', 'index', 'src/pages/guide/index.astro'],
  ['/methodology', 'trust', 'src/pages/methodology.astro'],
  ['/newsletter', 'conversion', 'src/pages/newsletter.astro'],
  ['/peptides', 'index', 'src/pages/peptides/index.astro'],
  ['/privacy', 'trust', 'src/pages/privacy.astro'],
  ['/protocols', 'index', 'src/pages/protocols/index.astro'],
  ['/regulatory-tracker', 'tool', 'src/pages/regulatory-tracker.astro'],
  ['/safety', 'index', 'src/pages/safety/index.astro'],
  ['/terms', 'trust', 'src/pages/terms.astro'],
  ['/trials', 'tool', 'src/pages/trials/index.astro'],
  ['/clinics', 'directory', 'src/pages/clinics/index.astro'],
];
for (const [p, type, file] of STATIC) {
  const noindex = p === '/clinics';
  add({
    type,
    url: SITE + (p === '/' ? '' : p),
    file,
    title: p,
    indexable: !noindex,
    sitemap_expected: !noindex,
    robots: noindex ? 'noindex' : 'index',
  });
}

const CATS = [
  'cognitive',
  'hormonal',
  'immune',
  'longevity',
  'metabolic',
  'other',
  'repair-recovery',
];
for (const cat of CATS) {
  add({
    type: 'category',
    url: SITE + '/category/' + cat,
    file: 'src/pages/category/[category].astro',
    title: cat,
  });
}

add({
  type: 'error',
  url: SITE + '/404',
  file: 'src/pages/404.astro',
  title: '404',
  indexable: false,
  sitemap_expected: false,
  robots: 'noindex',
});
add({
  type: 'machine',
  url: SITE + '/llms.txt',
  file: 'src/pages/llms.txt.ts',
  title: 'llms.txt',
  sitemap_expected: false,
});
add({
  type: 'machine',
  url: SITE + '/llms-full.txt',
  file: 'src/pages/llms-full.txt.ts',
  title: 'llms-full.txt',
  sitemap_expected: false,
});
add({
  type: 'api',
  url: SITE + '/api/health',
  file: 'src/pages/api/health.ts',
  sitemap_expected: false,
  indexable: false,
});
add({
  type: 'api',
  url: SITE + '/api/peptide-search.json',
  file: 'src/pages/api/peptide-search.json.ts',
  sitemap_expected: false,
  indexable: false,
});
add({
  type: 'api',
  url: SITE + '/api/subscribe',
  file: 'src/pages/api/subscribe.ts',
  sitemap_expected: false,
  indexable: false,
});

const TEMPLATES = [
  'src/layouts/BaseLayout.astro',
  'src/layouts/BlogLayout.astro',
  'src/layouts/CalculatorLayout.astro',
  'src/layouts/ComparisonLayout.astro',
  'src/layouts/ConditionLayout.astro',
  'src/layouts/DossierLayout.astro',
  'src/layouts/GlossaryLayout.astro',
  'src/layouts/GuideLayout.astro',
  'src/layouts/HubLayout.astro',
  'src/layouts/ProtocolLayout.astro',
  'src/layouts/SafetyLayout.astro',
  'src/components/DisclaimerBanner.astro',
  'src/components/SafetyBanner.astro',
  'src/components/EvidenceBadge.astro',
  'src/components/EvidenceChain.astro',
  'src/components/ClinicCard.astro',
  'src/components/FeaturedClinicCard.astro',
  'src/components/ExitIntentPopup.astro',
  'src/components/CookieConsent.astro',
  'src/components/AppWaitlistCTA.astro',
  'src/components/SEO/OrganizationSchema.astro',
  'src/components/SEO/DrugSchema.astro',
  'src/components/SEO/FAQSchema.astro',
  'src/components/SEO/ArticleSchema.astro',
  'src/components/SEO/HowToSchema.astro',
  'src/components/SEO/ItemListSchema.astro',
  'src/components/SEO/BreadcrumbSchema.astro',
  'src/components/RatingCard.astro',
  'src/components/QualityChecklist.astro',
  'src/components/SourcesList.astro',
  'src/components/TrialTable.astro',
  'src/pages/clinics/[city].astro',
];
for (const file of TEMPLATES) {
  add({
    type: 'template',
    url: null,
    file,
    title: path.basename(file),
    sitemap_expected: false,
    indexable: false,
    notes: ['reusable component/layout capable of placing claims on many pages'],
  });
}

const packDir = path.join(ROOT, 'data/source-packs');
if (fs.existsSync(packDir)) {
  for (const f of fs.readdirSync(packDir).filter((x) => x.endsWith('.json'))) {
    add({
      type: 'source-pack',
      url: null,
      file: 'data/source-packs/' + f,
      title: f.replace(/\.json$/, ''),
      sitemap_expected: false,
      indexable: false,
      notes: ['renders via DossierLayout /trials; not a public URL'],
    });
  }
}

const byType = {};
for (const s of surfaces) byType[s.type] = (byType[s.type] || 0) + 1;

const summary = {
  frozen_at: new Date().toISOString(),
  audit_date: '2026-09-02',
  project_path: ROOT,
  live_website: SITE,
  operating_mode: 'AUDIT ONLY',
  counts: byType,
  total_surfaces: surfaces.length,
  indexable: surfaces.filter((s) => s.indexable).length,
  noindex: surfaces.filter((s) => s.indexable === false).length,
  clinic_placeholder_websites: surfaces.filter(
    (s) => s.extra && s.extra.placeholderWebsite,
  ).length,
  clinic_placeholder_phones: surfaces.filter(
    (s) => s.extra && s.extra.placeholderPhone,
  ).length,
  clinic_verified_true: surfaces.filter(
    (s) => s.type === 'clinic-record' && s.extra && s.extra.verifiedListing,
  ).length,
  glossary_noindex: surfaces.filter(
    (s) => s.type === 'glossary' && s.robots === 'noindex',
  ).length,
  blog_noindex: surfaces.filter((s) => s.type === 'blog' && s.robots === 'noindex')
    .length,
};

fs.writeFileSync(path.join(OUT, 'INVENTORY.json'), JSON.stringify({ summary, surfaces }, null, 2));
fs.writeFileSync(path.join(OUT, 'INVENTORY-SUMMARY.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
