import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { parseFragment, serialize } from 'parse5';

export const sourceRoot = fileURLToPath(new URL('../', import.meta.url));
export function nodes(html) {
  const found = [];
  const visit = node => { found.push(node); for (const child of node.childNodes || []) visit(child); };
  visit(parseFragment(html)); return found;
}
export const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const textOf = html => nodes(html).filter(node => node.nodeName === '#text').map(node => node.value).join('');
export const ordinary = [
  { name: 'Alpha peptide', aliases: ['Alpha alternative'], slug: 'alpha', url: '/peptides/alpha', category: 'other',
    evidenceStrength: 'low', summary: 'Alpha repair research summary.', content: 'Alpha repair research.', sources: { count: 2, human: 0, context: 'Preclinical entries only.' } },
  { name: 'Beta peptide', aliases: [], slug: 'beta', url: '/peptides/beta?mode=summary&lang=en#sources', category: 'metabolic',
    evidenceStrength: 'very-low', summary: 'Beta metabolic research summary.', content: 'Beta repair experiment.', sources: { count: 1, human: 1 } },
];

/** Execute the actual component script, including input/debounce/fallback wiring. No browser/network.
 * parse5 text serialization supplies browser-equivalent text-node escaping for the small DOM stub.
 */
export async function loadHarness(root = sourceRoot) {
  const source = fs.readFileSync(path.join(root, 'src/components/SearchModal.astro'), 'utf8');
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1];
  const code = await build({ stdin: { contents: script + `\n globalThis.fixture = {
    format: typeof formatPagefindExcerpt === 'function' ? formatPagefindExcerpt : null,
    renderPagefind: typeof renderPagefindResults === 'function' ? renderPagefindResults : null,
    renderPrimary: renderResults, searchPrimary: searchPeptides, highlightPrimary: highlightTerms, escapeHtml, safeInternalUrl,
    setInputs(index, fallback) { peptideIndex = index; pagefind = fallback; }
  };`, loader: 'ts', resolveDir: path.join(root, 'src/components') }, bundle: true, write: false, format: 'iife', platform: 'browser', logLevel: 'silent' });
  const elements = new Map(), timers = new Map(); let nextTimer = 0;
  function element(id) {
    if (!elements.has(id)) elements.set(id, { innerHTML: '', value: '', listeners: new Map(), style: {},
      classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, focus() {}, querySelector: () => null, querySelectorAll: () => [],
      addEventListener(event, callback) { this.listeners.set(event, callback); } });
    return elements.get(id);
  }
  const document = { body: { style: {} }, activeElement: null, getElementById: element, addEventListener() {},
    createElement() { return { textContent: '', get innerHTML() {
      return serialize({ nodeName: '#document-fragment', childNodes: [{ nodeName: '#text', value: String(this.textContent ?? '') }] });
    } }; } };
  const sandbox = vm.createContext({ document, console, requestAnimationFrame(callback) { callback(); },
    fetch() { throw new Error('Unexpected fixture network request'); },
    setTimeout(callback) { const id = ++nextTimer; timers.set(id, callback); return id; }, clearTimeout(id) { timers.delete(id); } });
  vm.runInContext(code.outputFiles[0].text, sandbox);
  return { api: sandbox.fixture, async run(query, index = [], records = []) {
    const searches = []; let loaded = 0;
    sandbox.fixture.setInputs(index, { async search(value) {
      searches.push(value); return { results: records.map(record => ({ async data() { loaded++; return record; } })) };
    } });
    const input = element('modal-search-input'); input.value = query;
    input.listeners.get('input')({ target: input });
    for (const [id, callback] of [...timers]) { timers.delete(id); await callback(); }
    return { html: element('modal-search-results-list').innerHTML, searches, loaded };
  } };
}

test('actual fallback input handler renders Pagefind highlights as attribute-free mark nodes', async () => {
  const harness = await loadHarness();
  const result = await harness.run('repair', [], [{ url: '/peptides/alpha', meta: { title: 'Alpha' }, excerpt: 'Research into <mark>repair</mark> and <mark>recovery</mark>.' }]);
  assert.deepEqual(result.searches, ['repair']); assert.equal(result.loaded, 1);
  const tree = nodes(result.html), marks = tree.filter(node => node.tagName === 'mark');
  assert.equal(marks.length, 2); assert.ok(marks.every(node => node.attrs.length === 0));
  assert.equal(textOf(serialize(marks[0])), 'repair'); assert.doesNotMatch(textOf(result.html), /<mark>/);
  assert.equal(attr(tree.find(node => node.tagName === 'a'), 'href'), '/peptides/alpha');
});

test('formatter escapes malicious tags/attributes and never decodes entities into active markup', async () => {
  const { api } = await loadHarness();
  const hostile = ['<img src=x onerror="canary()">', '<svg onload="canary()"></svg>', '<script>canary()</script>',
    '<mark onclick="canary()">text</mark>', '<mark class=x>text</mark>', '<MARK>text</MARK>', '<mark >text</mark >',
    '&lt;mark&gt;text&lt;/mark&gt;', '&#60;img src=x onerror=canary()&#62;', '&amp;lt;script&amp;gt;'];
  for (const excerpt of hostile) {
    const output = api.format(excerpt), tree = nodes(output);
    assert.equal(tree.filter(node => node.tagName).length, 0, excerpt);
    assert.equal(textOf(output), excerpt, 'Non-permitted markup/entities retain literal text');
  }
  const inside = api.format('<mark><img src=x onerror="canary()"> &lt;svg&gt;</mark>');
  assert.deepEqual(nodes(inside).filter(node => node.tagName).map(node => node.tagName), ['mark']);
  assert.equal(textOf(inside), '<img src=x onerror="canary()"> &lt;svg&gt;');
  assert.equal(api.format(null), ''); assert.equal(api.format({ excerpt: 'unexpected object' }), '');
});

test('unbalanced or nested exact markers fall back to escaped text without leaking highlight structure', async () => {
  const { api } = await loadHarness();
  for (const excerpt of ['<mark>open', 'close</mark>', '<mark>a<mark>b</mark></mark>', '<mark>a</mark></mark>',
    '<mark>a</mark><mark>b', '<mark>x</mark >']) {
    const rendered = api.format(excerpt);
    assert.equal(nodes(rendered).filter(node => node.tagName).length, 0, excerpt);
    assert.equal(textOf(rendered), excerpt);
  }
  assert.equal(api.format('<mark></mark><mark>a</mark>'), '<mark></mark><mark>a</mark>');
});

test('fallback title, excerpt and empty-query output remain escaped; only allowed highlights render', async () => {
  const harness = await loadHarness();
  const result = await harness.run('probe', [], [{ url: '/peptides/alpha', meta: { title: '<img src=x onerror="titleCanary()">' },
    excerpt: '<mark>safe</mark><svg onload="excerptCanary()"></svg>' }]);
  const tree = nodes(result.html);
  assert.deepEqual(tree.filter(node => node.tagName).map(node => node.tagName), ['li', 'a', 'div', 'div', 'mark']);
  assert.ok(tree.every(node => !(node.attrs || []).some(attribute => /^on/i.test(attribute.name))));
  assert.match(textOf(result.html), /<img src=x onerror="titleCanary\(\)">/);
  const empty = await harness.run('<img src=x onerror="queryCanary()">');
  assert.equal(nodes(empty.html).filter(node => node.tagName === 'img').length, 0);
  assert.match(textOf(empty.html), /No results found for/);
  assert.equal((await harness.run('probe', [], [{}])).html.includes('Untitled'), true);
});

test('shared URL guard rejects external, backslash, controls and quote breakout without normalizing valid paths', async () => {
  const harness = await loadHarness();
  for (const url of ['https://external.invalid/', '//external.invalid/', 'javascript:canary()', '/\\external.invalid/path',
    '/" onmouseenter="canary', "/' onclick='canary", '/\n/external.invalid/', '/x\tvalue', '/x\u007fvalue', null]) {
    assert.equal(harness.api.safeInternalUrl(url), '/', String(url));
    const result = await harness.run('probe', [], [{ url, meta: { title: 'Title' }, excerpt: '<mark>probe</mark>' }]);
    const tree = nodes(result.html), link = tree.find(node => node.tagName === 'a');
    assert.equal(attr(link, 'href'), '/'); assert.ok(tree.every(node => !(node.attrs || []).some(attribute => /^on/i.test(attribute.name))));
  }
  for (const url of ['/peptides/alpha', '/a%20b?x=%22', '/peptides/beta?mode=summary&lang=en#sources', '/']) {
    assert.equal(harness.api.safeInternalUrl(url), url);
    assert.equal(new URL(url, 'https://www.pepcodex.com').origin, 'https://www.pepcodex.com');
    const result = await harness.run('probe', [], [{ url, meta: { title: 'Title' }, excerpt: '' }]);
    assert.equal(attr(nodes(result.html).find(node => node.tagName === 'a'), 'href'), url);
  }
  const attributes = parseFragment(`<a data-fixture="${harness.api.escapeHtml('" autofocus onfocus="canary & <tag>')}" href="/">x</a>`).childNodes[0].attrs;
  assert.deepEqual(attributes.map(item => item.name), ['data-fixture', 'href']);
});

test('primary search still outranks fallback, retains evidence context and safely renders hostile fields', async () => {
  const harness = await loadHarness(), result = await harness.run('alpha', ordinary, [{ excerpt: 'must not load' }]);
  assert.deepEqual(result.searches, []); assert.equal(result.loaded, 0);
  assert.match(result.html, /Preclinical entries only\./); assert.match(result.html, /0 human evidence entries/);
  const ranked = harness.api.searchPrimary('alpha', ordinary);
  assert.equal(ranked[0].peptide.slug, 'alpha'); assert.equal(ranked[0].score, 800);
  const hostile = { ...ordinary[0], name: 'Alpha <img src=x onerror="primaryCanary()">', aliases: ['<svg onload="aliasCanary()">'],
    url: '/" onmouseover="urlCanary', summary: '<mark>Alpha</mark><script>summaryCanary()</script>',
    sources: { context: '<img src=x onerror="contextCanary()">' } };
  const actual = await harness.run('alpha', [hostile]);
  const tree = nodes(actual.html);
  assert.ok(!tree.some(node => ['img', 'svg', 'script'].includes(node.tagName)));
  assert.ok(tree.every(node => !(node.attrs || []).some(attribute => /^on/i.test(attribute.name))));
  assert.equal(attr(tree.find(node => node.tagName === 'a'), 'href'), '/');
});

test('fallback keeps eight-result cap and short-query behavior', async () => {
  const harness = await loadHarness();
  const records = Array.from({ length: 10 }, (_, index) => ({ url: `/peptides/${index}`, excerpt: `<mark>match${index}</mark>` }));
  const result = await harness.run('match', [], records);
  assert.equal(result.loaded, 8); assert.equal(nodes(result.html).filter(node => node.tagName === 'li').length, 8);
  const short = await harness.run('x', [], records);
  assert.equal(short.html, ''); assert.deepEqual(short.searches, []); assert.equal(short.loaded, 0);
});

test('primary highlights raw text without matching escaped quote entities or generated markup', async () => {
  const harness = await loadHarness();
  const cases = [
    ['Researchers\' "39" results.', '39', ['39']],
    ['Researchers\' "quot" results.', 'quot', ['quot']],
    ['An apostrophe\' and "quotes" only.', '39 quot', ['quot']],
    ['Literal &#39; &quot; and <img src=x onerror="canary()">.', '39 quot img', ['39', 'quot', 'img']],
    ['Alpha repair: mark class primary ink.', 'alpha repair mark class primary ink', ['Alpha', 'repair', 'mark', 'class', 'primary', 'ink']],
    ['Alpha repair.', 'alpha alpha alp repair', ['Alpha', 'repair']],
    ['Literal a+b and [x].', 'a+b [x]', ['a+b', '[x]']],
  ];
  for (const [text, query, expectedMarks] of cases) {
    const html = harness.api.highlightPrimary(text, query), tree = nodes(html);
    assert.equal(textOf(html), text, query);
    const marks = tree.filter(node => node.tagName === 'mark');
    assert.deepEqual(marks.map(node => textOf(serialize(node))), expectedMarks, query);
    assert.ok(tree.every(node => !node.tagName || node.tagName === 'mark'));
    assert.ok(marks.every(node => node.attrs.length === 1 && node.attrs[0].name === 'class'));
    assert.ok(marks.every(node => !node.childNodes.some(child => child.tagName === 'mark')), 'No nested generated highlights');
  }
  for (const query of ['39', 'quot']) {
    const record = { ...ordinary[0], name: `Alpha ${query} research`, summary: `Researchers' "${query}" results.`, content: `Alpha ${query} research` };
    const result = await harness.run(query, [record]);
    assert.ok(textOf(result.html).includes(record.summary));
    assert.doesNotMatch(textOf(result.html), /&#39;|&quot;/);
  }
});
