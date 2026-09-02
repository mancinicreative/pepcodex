#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const rows = JSON.parse(fs.readFileSync(path.join(HERE, '_work/coverage-rows.json'), 'utf8'));

const INSPECTED_FILES = new Set([
  'src/layouts/BaseLayout.astro',
  'src/layouts/DossierLayout.astro',
  'src/layouts/ComparisonLayout.astro',
  'src/layouts/CalculatorLayout.astro',
  'src/layouts/BlogLayout.astro',
  'src/components/SEO/OrganizationSchema.astro',
  'src/components/SEO/DrugSchema.astro',
  'src/components/SEO/FAQSchema.astro',
  'src/components/SEO/HowToSchema.astro',
  'src/components/SEO/ArticleSchema.astro',
  'src/components/SEO/BreadcrumbSchema.astro',
  'src/components/SEO/ItemListSchema.astro',
  'src/components/ExitIntentPopup.astro',
  'src/components/CookieConsent.astro',
  'src/components/AppWaitlistCTA.astro',
  'src/components/FeaturedClinicCard.astro',
  'src/pages/clinics/[city].astro',
  'src/pages/clinics/index.astro',
  'src/pages/directory.astro',
  'src/pages/index.astro',
  'src/pages/about.astro',
  'src/pages/methodology.astro',
  'src/pages/editorial-policy.astro',
  'src/pages/advertising-policy.astro',
  'src/pages/disclaimer.astro',
  'src/pages/fda-notice.astro',
  'src/pages/privacy.astro',
  'src/pages/404.astro',
  'src/pages/peptides/index.astro',
  'src/pages/peptides/[peptide]/[condition].astro',
  'src/pages/llms.txt.ts',
  'src/scripts/analytics.ts',
  'src/content/calculators/tesamorelin-reconstitution.mdx',
  'src/content/comparisons/aod-9604-vs-semaglutide.mdx',
  'src/content/comparisons/tirzepatide-vs-semaglutide.mdx',
  'src/content/blog/what-is-bpc-157.mdx',
  'src/content/guides/what-is-bpc-157.mdx',
  'src/content/peptides/semaglutide.mdx',
  'src/content/peptides/bpc-157.mdx',
  'src/content/peptides/pancragen.mdx',
  'src/content/glossary/a1c.mdx',
  'src/content/cities/miami.mdx',
  'astro.config.mjs',
  'vercel.json',
  'public/robots.txt',
]);

const INSPECTED_URLS = new Set([
  'https://www.pepcodex.com/',
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
  'https://www.pepcodex.com/llms.txt',
  'https://www.pepcodex.com/llms-full.txt',
  'https://www.pepcodex.com/api/health',
]);

const DEEP_PEPTIDE_SLUGS = new Set([
  'semaglutide','tirzepatide','retatrutide','bpc-157','tb-500','tesamorelin','semax','epithalon','melanotan-ii','pt-141','orforglipron','cagrilintide','liraglutide','mk-677','ipamorelin','ghk-cu','thymosin-alpha-1','ss-31','mots-c','sermorelin',
]);

const out = rows.map((r) => {
  let status = 'SAMPLED';
  let reason = r.reason;
  const fileHit = r.file && INSPECTED_FILES.has(r.file);
  const urlHit = r.url && INSPECTED_URLS.has(r.url);
  if (fileHit || urlHit) {
    status = 'INSPECTED';
    reason = 'full or substantial file/live read in Audit B';
  } else if (r.type === 'clinic-record') {
    status = 'SAMPLED';
    reason = 'inventory extra fields (website/phone/verified/placeholder) for all 52; individual MDX bodies not line-read';
  } else if (r.type === 'guide' || r.type === 'safety') {
    status = 'SAMPLED';
    reason = '100% frontmatter + first/last claim + word count + blog/guide/safety overlap map; full body not line-read';
  } else if (r.type === 'peptide') {
    const slug = (r.url || '').split('/').pop();
    if (DEEP_PEPTIDE_SLUGS.has(slug) && (slug === 'semaglutide' || slug === 'bpc-157' || slug === 'pancragen')) {
      status = 'INSPECTED';
      reason = 'frontmatter + opening claims read';
    } else if (DEEP_PEPTIDE_SLUGS.has(slug)) {
      status = 'SAMPLED';
      reason = 'named-peptide mandate: inventory extra + title/description/dates/robots; full dossier body not line-read';
    } else {
      status = 'SAMPLED';
      reason = 'frontmatter + first/last claim + word count (≥20% and actually 100% of type)';
    }
  } else if (r.type === 'source-pack') {
    status = 'SAMPLED';
    reason = 'inventory presence only; not used as public URL; citation accuracy is Audit A';
  } else if (r.type === 'template') {
    status = 'SAMPLED';
    reason = 'listed in frozen inventory; file not fully read in this pass';
  } else {
    status = 'SAMPLED';
    reason = '100% of type received title/description/dates/robots + H1 + first/last claim extraction';
  }
  return {
    surface_id: r.surface_id,
    type: r.type,
    url: r.url,
    file: r.file,
    title: r.title,
    indexable: r.indexable,
    robots: r.robots,
    status,
    reason,
    fm: r.fm
      ? {
          title: r.fm.title,
          descLen: r.fm.descLen,
          lastUpdated: r.fm.lastUpdated,
          robots: r.fm.robots,
          noindex: r.fm.noindex,
          words: r.fm.words,
          h1: r.fm.h1,
        }
      : null,
  };
});

const byStatus = {};
const byType = {};
for (const r of out) {
  byStatus[r.status] = (byStatus[r.status] || 0) + 1;
  byType[r.type] ||= { total: 0, INSPECTED: 0, SAMPLED: 0, INACCESSIBLE: 0, OMITTED: 0 };
  byType[r.type].total++;
  byType[r.type][r.status]++;
}

const coverage = {
  auditor: 'B',
  specialization: 'Technical SEO, information architecture, content strategy, accessibility, analytics',
  audit_date: '2026-09-02',
  frozen_at: '2026-09-02T19:47:18.517Z',
  total_surfaces: out.length,
  by_status: byStatus,
  by_type: byType,
  inspection_notes: {
    minimum_applied_to_all_mdx: true,
    live_urls_probed: 52,
    graph_source: '.planning/data/v2/graph-latest.json (local dist snapshot; GSC impressions not joined — all indexable marked silent with 0 impressions)',
    gsc_ga4: 'LIVE PULL BLOCKED invalid_rapt; historical artifacts dated 2026-07-24/25 only',
    core_web_vitals: 'BASELINE UNAVAILABLE — no CrUX/PSI instrumentation this pass',
    contrast_instrumentation: 'BASELINE UNAVAILABLE — no axe/lighthouse contrast audit this pass',
  },
  surfaces: out,
};

fs.writeFileSync(path.join(HERE, 'COVERAGE.json'), JSON.stringify(coverage, null, 2));
console.log(JSON.stringify({ total: out.length, byStatus, byType }, null, 2));
