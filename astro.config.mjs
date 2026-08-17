// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import rehypeAutoGlossary from './plugins/rehype-auto-glossary.mjs';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// @astrojs/sitemap only emits a per-URL <lastmod> from values set on each item, and its
// top-level `lastmod` option stamps the sitemap *index* rather than individual URLs — so
// per-URL dates have to come through `serialize`. Build a pathname -> date map straight
// from content frontmatter. Collection dir -> URL prefix mirrors each page's getStaticPaths.
const CONTENT_ROUTES = {
  peptides: '/peptides',
  comparisons: '/compare',
  guides: '/guide',
  safety: '/safety',
  glossary: '/glossary',
  blog: '/blog',
  protocols: '/protocols',
  conditions: '/conditions',
};

function buildLastmodMap() {
  const map = new Map();
  const contentDir = path.resolve('./src/content');
  const dateOf = (d) => d.lastUpdated ?? d.publishDate ?? null;

  for (const [dir, prefix] of Object.entries(CONTENT_ROUTES)) {
    const abs = path.join(contentDir, dir);
    if (!fs.existsSync(abs)) continue;
    for (const file of fs.readdirSync(abs)) {
      if (!/\.mdx?$/.test(file)) continue;
      const { data } = matter(fs.readFileSync(path.join(abs, file), 'utf8'));
      const d = dateOf(data);
      if (!d) continue;
      const slug = file.replace(/\.mdx?$/, '');
      map.set(`${prefix}/${slug}`, new Date(d));
      // /peptides/<slug>/<condition> pages are generated from the dossier, so they
      // inherit the dossier's date.
      if (dir === 'peptides' && Array.isArray(data.conditions)) {
        for (const c of data.conditions) {
          if (c?.slug) map.set(`${prefix}/${slug}/${c.slug}`, new Date(d));
        }
      }
    }
  }

  // Calculators route on frontmatter `peptideSlug`, not the filename.
  const calcDir = path.join(contentDir, 'calculators');
  if (fs.existsSync(calcDir)) {
    for (const file of fs.readdirSync(calcDir)) {
      if (!/\.mdx?$/.test(file)) continue;
      const { data } = matter(fs.readFileSync(path.join(calcDir, file), 'utf8'));
      const d = dateOf(data);
      if (d && data.peptideSlug && data.calculatorType === 'reconstitution') {
        map.set(`/calculator/reconstitution/${data.peptideSlug}`, new Date(d));
      }
    }
  }

  return map;
}

const lastmodMap = buildLastmodMap();

// /glossary/off-label duplicates /glossary/off-label-use (identical term + metaTitle).
// It 301s to the survivor in vercel.json, so it must not be advertised in the sitemap.
// A `noindex` meta tag does NOT save crawl budget on its own — Google still has to fetch
// the page to read the tag. Dropping these from the sitemap is what actually stops the site
// advertising them for crawl. They stay published and internally linked for readers.
// Blog posts placed on citation-integrity hold (frontmatter `robots: noindex`). An Aug-2026
// audit checked every claim in 67 posts against PubMed and ClinicalTrials.gov; 31 describe
// studies that do not exist. They stay published for anyone holding a link, but must not be
// advertised for crawl or indexing until rewritten from real sources.
function noindexedBlogUrls() {
  const urls = new Set();
  const dir = path.resolve('./src/content/blog');
  if (!fs.existsSync(dir)) return urls;
  for (const file of fs.readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (data.robots === 'noindex') {
      urls.add(`https://www.pepcodex.com/blog/${file.replace(/\.mdx?$/, '')}`);
    }
  }
  return urls;
}

function noindexedGlossaryUrls() {
  const urls = new Set();
  const dir = path.resolve('./src/content/glossary');
  if (!fs.existsSync(dir)) return urls;
  for (const file of fs.readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (data.noindex === true) {
      urls.add(`https://www.pepcodex.com/glossary/${file.replace(/\.mdx?$/, '')}`);
    }
  }
  return urls;
}

const SITEMAP_EXCLUDE = new Set([
  'https://www.pepcodex.com/glossary/off-label',
  ...noindexedGlossaryUrls(),
  ...noindexedBlogUrls(),
]);

// https://astro.build/config
export default defineConfig({
  site: 'https://www.pepcodex.com',
  trailingSlash: 'never',
  output: 'static',
  adapter: vercel({
    imageService: true,
  }),
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [mdx(), sitemap({
    // /clinics/ is deindexed (see src/pages/clinics/[city].astro) — keep it out of the
    // sitemap too, since a noindex tag alone still costs a crawl to discover.
    filter: (page) =>
      !page.includes('.mdx') &&
      !/\/clinics(\/|$)/.test(page) &&
      !SITEMAP_EXCLUDE.has(page.replace(/\/$/, '')),
    // NOTE: must return the item — returning undefined drops the URL from the sitemap.
    serialize(item) {
      const pathname = new URL(item.url).pathname.replace(/\/$/, '') || '/';
      const d = lastmodMap.get(pathname);
      if (d) item.lastmod = d.toISOString();
      return item;
    },
  })],
  markdown: {
    rehypePlugins: [rehypeAutoGlossary],
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});