import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { transform as compileAstro } from '@astrojs/compiler';
import { transform as compileTypeScript } from 'esbuild';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

// Render the actual component tree without a full site build.
const cache = new Map();
async function componentModule(file) {
  if (cache.has(file.href)) return cache.get(file.href);
  const { code: astroCode } = await compileAstro(await fs.readFile(file, 'utf8'), {
    filename: file.href, internalURL: 'astro/compiler-runtime', resultScopedSlot: true, renderScript: true,
    resolvePath: specifier => specifier,
  });
  let { code } = await compileTypeScript(astroCode, { loader: 'ts', format: 'esm', target: 'node20' });
  for (const match of [...code.matchAll(/from\s+["']([^"']+)["']/g)]) {
    const specifier = match[1];
    const resolved = specifier.endsWith('.astro')
      ? await componentModule(new URL(specifier, file))
      : import.meta.resolve(specifier);
    code = code.replaceAll(JSON.stringify(specifier), JSON.stringify(resolved));
  }
  const module = `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
  cache.set(file.href, module);
  return module;
}
async function render(name, props) {
  const { default: component } = await import(await componentModule(new URL(`../src/components/SEO/${name}.astro`, import.meta.url)));
  const container = await AstroContainer.create();
  const html = await container.renderToString(component, { props });
  const scripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1, 'one parseable JSON-LD node from this component');
  return { html, data: JSON.parse(scripts[0][1]) };
}
const props = { name: 'Example peptide', description: 'Research evidence summary.', url: 'https://www.pepcodex.com/peptides/example' };

test('legacy wrapper emits informational page and neutral subject only', async () => {
  const { data } = await render('DrugSchema', { ...props, alternateName: ['Example alias'], drugClass: 'Legacy class', mechanismOfAction: 'Legacy mechanism', activeIngredient: 'Legacy ingredient', administrationRoute: 'Legacy route', legalStatus: 'Legacy status', manufacturer: 'Legacy manufacturer', nonProprietaryName: 'Legacy generic', molecularWeight: 'Legacy weight' });
  assert.deepEqual(data, {
    '@context': 'https://schema.org', '@type': 'MedicalWebPage', '@id': props.url,
    ...props, about: { '@type': 'Thing', name: props.name, alternateName: ['Example alias'] },
  });
  assert.doesNotMatch(JSON.stringify(data), /Legacy|"Drug"|"Product"|offers|aggregateRating|reviewedBy|lastReviewed/);
});

test('direct page schema omits unknown aliases, dates, reviews and product claims', async () => {
  const { data } = await render('MedicalWebPageSchema', props);
  assert.deepEqual(data.about, { '@type': 'Thing', name: props.name });
  assert.equal(data.datePublished, undefined);
  assert.equal(data.dateModified, undefined);
  assert.equal(data.reviewedBy, undefined);
});

test('shared JsonLd renderer safely preserves script-like source text', async () => {
  const name = '</script><script>alert("fixture")</script>';
  const { html, data } = await render('DrugSchema', { ...props, name });
  assert.equal(data.about.name, name);
  assert.equal((html.match(/<script\b/g) || []).length, 1);
});

test('Article keeps verified modification date without inventing publication date', async () => {
  const dateModified = new Date('2026-08-01T00:00:00.000Z');
  const article = { title: props.name, description: props.description, url: props.url, dateModified };
  const { data } = await render('ArticleSchema', article);
  assert.equal(data['@type'], 'Article');
  assert.equal(data.dateModified, dateModified.toISOString());
  assert.equal(Object.hasOwn(data, 'datePublished'), false);
  const published = new Date('2026-01-01T00:00:00.000Z');
  const explicit = await render('ArticleSchema', { ...article, datePublished: published });
  assert.equal(explicit.data.datePublished, published.toISOString());
});

test('shared renderer preserves breadcrumb URLs, names and ordering', async () => {
  const items = [{ name: 'Home', url: 'https://www.pepcodex.com' }, { name: 'Peptides', url: 'https://www.pepcodex.com/peptides' }, { name: props.name, url: props.url }];
  const { data } = await render('BreadcrumbSchema', { items });
  assert.equal(data['@type'], 'BreadcrumbList');
  assert.deepEqual(data.itemListElement, items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })));
});
