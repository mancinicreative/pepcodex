import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { build, transform } from 'esbuild';
import { transform as compileAstro } from '@astrojs/compiler';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { parseFragment } from 'parse5';

const root = fileURLToPath(new URL('../', import.meta.url));
const asModule = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const helperCode = (await transform(await fs.readFile(path.join(root, 'src/lib/evidence-inventory.ts'), 'utf8'), { loader: 'ts', format: 'esm' })).code;
const helperUrl = asModule(helperCode);
const { evidenceInventory } = await import(helperUrl);
const context = 'Parent-compound reports & biomarker associations only; <img src=x onerror="alert(1)"> is literal fixture text. No intervention inference.';
const fixturePeptide = sources => ({ slug: 'fixture', body: 'Fixture content', data: {
  name: 'Fixture peptide', aliases: [], category: 'other', evidenceStrength: 'very-low', summary: 'Fixture summary',
  conditions: [{ slug: 'fixture-condition', name: 'Fixture condition' }], sources,
} });
const sourcesCases = [{ count: 4, human: 2, preclinical: 2, context }, { count: 0, human: 0, preclinical: 0 }, undefined, null, { human: '2', count: -1 }];
function nodes(html) {
  const collected = [];
  function walk(node) { collected.push(node); for (const child of node.childNodes || []) walk(child); }
  walk(parseFragment(html));
  return collected;
}
function checkContext(html) {
  const tree = nodes(html);
  assert.equal(tree.filter(node => node.tagName === 'img' || node.tagName === 'script').length, 0);
  const paragraph = tree.find(node => node.tagName === 'p' && node.childNodes?.some(child => child.value?.includes('Evidence context:')));
  assert.ok(paragraph, 'context is visible paragraph text, not a title-only or hidden qualifier');
  assert.equal(paragraph.childNodes.map(node => node.value || '').join('').trim(), `Evidence context: ${context}`);
  assert.equal(paragraph.attrs.some(attr => attr.name === 'aria-hidden' || attr.name === 'hidden'), false);
  assert.equal(paragraph.attrs.some(attr => attr.name === 'class' && /line-clamp|truncate/.test(attr.value)), false);
}

test('inventory distinguishes known zero from absent, null, and invalid counts', () => {
  assert.equal(evidenceInventory({ human: 0 }).humanLabel, '0 human evidence entries');
  assert.equal(evidenceInventory({ human: 2 }).humanLabel, '2 human evidence entries');
  for (const human of [undefined, null, NaN, Infinity, -1, 0.5, '2']) {
    assert.equal(evidenceInventory({ human }).humanLabel, 'Human evidence count unknown');
  }
  for (const sources of [undefined, null, {}]) assert.equal(evidenceInventory(sources).totalLabel, 'Source count unknown');
  assert.equal(evidenceInventory({ context: '  ' }).context, undefined);
});

async function searchRenderer(component) {
  const source = await fs.readFile(path.join(root, `src/components/${component}.astro`), 'utf8');
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1];
  // Execute actual rendering/search definitions; skip unrelated initialization and event wiring.
  const end = component === 'SearchBar' ? '  // Initialize\n' : '  // --- Modal Logic ---';
  const normalized = script.replaceAll('\r\n', '\n');
  assert.ok(normalized.includes(end));
  const compiled = await build({ stdin: { contents: normalized.slice(0, normalized.indexOf(end)) + '\n globalThis.renderFixtureResults = renderResults;', loader: 'ts', resolveDir: path.join(root, 'src/components') }, bundle: true, write: false, format: 'iife', platform: 'browser', logLevel: 'silent' });
  // Minimal text-node DOM fixture exercises the component's own escapeHtml function.
  const document = { createElement() { return { textContent: '', get innerHTML() { return this.textContent.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); } }; } };
  const sandbox = vm.createContext({ document });
  vm.runInContext(compiled.outputFiles[0].text, sandbox);
  return sources => sandbox.renderFixtureResults([{ peptide: { ...fixturePeptide(sources).data, slug: 'fixture', url: '/peptides/fixture' }, matchType: 'name' }], 'fixture');
}
for (const component of ['SearchBar', 'SearchModal']) {
  test(`${component} actual result renderer preserves context as escaped visible text and missing counts as unknown`, async () => {
    const render = await searchRenderer(component);
    for (const sources of sourcesCases) {
      const html = render(sources);
      assert.doesNotMatch(html, /human studies|preclinical studies|undefined sources|null sources/);
      assert.ok(html.includes(evidenceInventory(sources).humanLabel));
      assert.ok(html.includes(evidenceInventory(sources).totalLabel));
      if (sources?.context) checkContext(html); else assert.doesNotMatch(html, /Evidence context:/);
    }
  });
}

test('search API passes context unchanged and does not synthesize zero counts or discard missing inventories', async () => {
  const fixture = sourcesCases.map((sources, index) => ({ ...fixturePeptide(sources), slug: `fixture-${index}` }));
  const contentUrl = asModule(`export async function getCollection() { return ${JSON.stringify(fixture)}; }`);
  const source = await fs.readFile(path.join(root, 'src/pages/api/peptide-search.json.ts'), 'utf8');
  const compiled = (await transform(source, { loader: 'ts', format: 'esm' })).code.replace('"astro:content"', JSON.stringify(contentUrl));
  const api = await import(asModule(compiled));
  const response = await api.GET();
  assert.equal(response.status, 200);
  const rows = await response.json();
  assert.equal(rows.length, sourcesCases.length);
  assert.equal(rows[0].sources.context, context);
  assert.equal(rows[1].sources.human, 0);
  assert.equal(Object.hasOwn(rows[2], 'sources'), false);
  assert.equal(rows[3].sources, null);
});

test('actual ConditionLayout renders evidence context safely without treating inventory entries as trials', async () => {
  const fixture = sourcesCases.map((sources, index) => ({ ...fixturePeptide(sources), slug: `fixture-${index}` }));
  const contentUrl = asModule(`export async function getCollection(name) { return name === 'peptides' ? ${JSON.stringify(fixture)} : []; }`);
  async function compile(source, filename) {
    const result = await compileAstro(source, { filename, internalURL: 'astro/compiler-runtime', resultScopedSlot: true, resolvePath: specifier => specifier });
    assert.equal(result.diagnostics.filter(d => d.severity === 1).length, 0);
    let code = (await transform(result.code, { loader: 'ts', format: 'esm' })).code.replace(/^import .*\?astro&type=style.*;\r?\n/gm, '');
    for (const match of [...code.matchAll(/from\s+["']([^"']+)["']/g)]) {
      const specifier = match[1];
      const url = specifier === 'astro:content' ? contentUrl
        : specifier === '../lib/evidence-inventory' ? helperUrl
        : specifier.endsWith('.astro') ? slotUrl
        : import.meta.resolve(specifier);
      code = code.replaceAll(JSON.stringify(specifier), JSON.stringify(url));
    }
    return asModule(code);
  }
  // Stub only unrelated layout/schema/newsletter/source children; render the real card markup.
  const slotUrl = await compile('<slot />', 'fixture-slot.astro');
  // Installed Container omits pipeline.site: substitute only this explicit site-config fixture.
  const source = (await fs.readFile(path.join(root, 'src/layouts/ConditionLayout.astro'), 'utf8'))
    .replaceAll('Astro.site', 'new URL("https://www.pepcodex.com")');
  const { default: Component } = await import(await compile(source, 'ConditionLayout.astro'));
  const container = await AstroContainer.create();
  const html = await container.renderToString(Component, { request: new Request('https://www.pepcodex.com/conditions/fixture-condition'), props: { title: 'Fixture', conditionName: 'Fixture condition', conditionSlug: 'fixture-condition', description: 'Fixture', researchOverview: 'Fixture', lastUpdated: new Date('2026-09-01T00:00:00Z') } });
  assert.match(html, /2 human evidence entries/);
  assert.match(html, /0 human evidence entries/);
  assert.equal((html.match(/Human evidence count unknown/g) || []).length, 3);
  assert.doesNotMatch(html, /human studies|preclinical studies/);
  checkContext(html);
  assert.match(html, /Sep 2026/);
});
