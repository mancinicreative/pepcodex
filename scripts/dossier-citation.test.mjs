import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { transform } from 'esbuild';
import { transform as compileAstro } from '@astrojs/compiler';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { parseFragment } from 'parse5';

const source = fs.readFileSync(new URL('../src/layouts/DossierLayout.astro', import.meta.url), 'utf8');
const declarations = source.match(/const citationYear = [^\r\n]+;\r?\nconst citationText = [^\r\n]+;/)?.[0];
const markup = source.match(/<div[^>]*data-citation=\{citationText\}>[\s\S]*?<\/div>/)?.[0];
const script = source.match(/<script>\s*\/\/ Breadcrumb Cite \/ Share \/ Save actions([\s\S]*?)<\/script>/)?.[1];
assert.ok(declarations && markup && script, 'Actual citation declarations, markup and handler must be available');
const compiled = await compileAstro(`---\nconst { name, lastUpdated, articleUrl } = Astro.props;\n${declarations}\n---\n${markup}`, {
  filename: 'DossierCitationFixture.astro', internalURL: 'astro/compiler-runtime', resultScopedSlot: true, resolvePath: specifier => specifier,
});
assert.equal(compiled.diagnostics.filter(d => d.severity === 1).length, 0);
let code = (await transform(compiled.code, { loader: 'ts', format: 'esm' })).code;
for (const match of [...code.matchAll(/from\s+["']([^"']+)["']/g)]) code = code.replaceAll(JSON.stringify(match[1]), JSON.stringify(import.meta.resolve(match[1])));
const { default: Component } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const container = await AstroContainer.create();
const clientCode = (await transform(script, { loader: 'ts', format: 'iife' })).code;
function nodes(html) {
  const found = [];
  function visit(node) { found.push(node); for (const child of node.childNodes || []) visit(child); }
  visit(parseFragment(html)); return found;
}
const attribute = (node, name) => node.attrs?.find(attr => attr.name === name)?.value;
const name = 'Fixture & <dossier> "title"';
const articleUrl = 'https://www.pepcodex.com/peptides/fixture';
async function render(lastUpdated) {
  const html = await container.renderToString(Component, { props: { name, articleUrl, lastUpdated } });
  const tree = nodes(html), group = tree.find(node => attribute(node, 'data-citation') !== undefined);
  return { html, tree, citation: attribute(group, 'data-citation') };
}
async function clickCitation(citation, fail = false) {
  const copied = [], timers = [], label = { textContent: 'Cite' }; let click;
  const button = { getAttribute: () => 'cite', querySelector: () => label, classList: { add() {}, remove() {} },
    addEventListener(event, callback) { assert.equal(event, 'click'); click = callback; } };
  const document = { title: name,
    addEventListener(event, callback) { assert.equal(event, 'DOMContentLoaded'); callback(); },
    querySelector(selector) { return selector === '[data-citation]' && citation !== null ? { getAttribute: () => citation } : null; },
    querySelectorAll() { return [button]; } };
  vm.runInNewContext(clientCode, { document, window: { location: { href: articleUrl } }, localStorage: { getItem: () => null },
    navigator: { clipboard: { async writeText(text) { if (fail) throw new Error('fixture clipboard denied'); copied.push(text); } } },
    setTimeout(callback) { timers.push(callback); } });
  assert.ok(click); await click();
  const immediateLabel = label.textContent; timers.forEach(callback => callback());
  return { copied, immediateLabel, restoredLabel: label.textContent };
}

test('actual citation markup uses known revision year, title and canonical link without an invented retrieval date', async () => {
  const rendered = await render(new Date('2026-01-01T00:00:00Z'));
  assert.equal(rendered.citation, `PepCodex. (2026). ${name}: Evidence Dossier. ${articleUrl}`);
  assert.doesNotMatch(rendered.html, /Retrieved|Accessed|retrieved|accessed/);
  assert.equal(rendered.tree.filter(node => node.tagName === 'button').length, 3);
  assert.equal(rendered.tree.find(node => attribute(node, 'data-action') === 'cite').attrs.find(attr => attr.name === 'aria-label').value, 'Copy citation');
  assert.equal(rendered.tree.filter(node => node.tagName === 'dossier').length, 0, 'Citation title remains escaped');
  assert.ok(rendered.tree.some(node => node.value === 'Cite'));
});

test('unknown or invalid revision dates are explicit n.d.; citation generation never reads the build clock', async () => {
  for (const value of [undefined, null, 'invalid']) assert.equal((await render(value)).citation, `PepCodex. (n.d.). ${name}: Evidence Dossier. ${articleUrl}`);
  class NoBuildClock extends Date { constructor(...args) { assert.ok(args.length, 'Build/access clock must not be read'); super(...args); } }
  for (const date of ['2026-01-01', '2025-12-31']) {
    const citation = vm.runInNewContext(`${declarations}\ncitationText`, { name, articleUrl, lastUpdated: date, Date: NoBuildClock });
    assert.match(citation, new RegExp(`\\(${date.slice(0, 4)}\\)`));
  }
});

test('actual clipboard handler copies rendered citation exactly and preserves success/failure button behavior', async () => {
  const { citation } = await render(new Date('2026-01-01T00:00:00Z'));
  const success = await clickCitation(citation);
  assert.deepEqual(success.copied, [citation]); assert.equal(success.immediateLabel, 'Copied'); assert.equal(success.restoredLabel, 'Cite');
  const failed = await clickCitation(citation, true);
  assert.deepEqual(failed.copied, []); assert.equal(failed.immediateLabel, 'Cite');
  assert.deepEqual((await clickCitation(null)).copied, [articleUrl], 'Existing missing-citation link fallback is preserved');
});
