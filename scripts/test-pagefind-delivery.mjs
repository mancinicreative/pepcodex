import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import pagefindSearch from '../plugins/pagefind-search.mjs';

const logger = { info() {}, warn() {} };
const hook = pagefindSearch().hooks['astro:build:generated'];
const run = promisify(execFile);
const integrationUrl = new URL('../plugins/pagefind-search.mjs', import.meta.url).href;
const isolatedHook = (cwd, site, env = {}) => run(process.execPath, ['--input-type=module', '--eval',
  `import integration from ${JSON.stringify(integrationUrl)}; await integration().hooks['astro:build:generated']({dir:new URL(${JSON.stringify(pathToFileURL(site + path.sep).href)}),logger:{info(){},warn(){}}});`,
], { cwd, env: { ...process.env, ...env }, windowsHide: true });
const html = (title, text) => `<!doctype html><html lang="en"><head><title>${title}</title></head><body><main>${text}</main></body></html>`;
async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'pepcodex-pagefind-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  return root;
}
async function write(file, text) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, text);
}
async function fragments(site) {
  const dir = path.join(site, 'pagefind', 'fragment');
  return Promise.all((await fs.readdir(dir)).map(async name => {
    const data = gunzipSync(await fs.readFile(path.join(dir, name))).toString();
    assert.ok(data.startsWith('pagefind_dcd'));
    return JSON.parse(data.slice('pagefind_dcd'.length));
  }));
}

test('indexes actual client root before adapter copy with correct result paths', async t => {
  const root = await fixture(t);
  const site = path.join(root, 'dist', 'client');
  await write(path.join(site, 'index.html'), html('Fixture home', 'Searchable home orchid'));
  await write(path.join(site, 'peptides', 'example', 'index.html'), html('Fixture dossier', 'Unique evidence marigold'));
  // A sibling is not public HTML and must not enter the client index.
  await write(path.join(root, 'dist', 'server', 'private.html'), html('Server only', 'Not public'));
  await hook({ dir: pathToFileURL(site + path.sep), logger });
  const records = await fragments(site);
  assert.deepEqual(records.map(r => r.url).sort(), ['/', '/peptides/example/']);
  assert.ok(records.some(r => r.content.includes('marigold')));
  const entry = JSON.parse(await fs.readFile(path.join(site, 'pagefind/pagefind-entry.json'), 'utf8'));
  assert.equal(entry.languages.en.page_count, 2);
  assert.ok((await fs.stat(path.join(site, 'pagefind/pagefind.js'))).size > 0);
  // Model the adapter's later client copy; actual adapter/build/browser is a separate gate.
  const target = path.join(root, '.vercel/output/static');
  await fs.cp(site, target, { recursive: true });
  assert.deepEqual(await fragments(target), records);
  await assert.rejects(fs.stat(path.join(root, 'dist/pagefind/pagefind.js')), { code: 'ENOENT' });
});

test('uses supplied custom static output and removes obsolete bundle files', async t => {
  const root = await fixture(t);
  const site = path.join(root, 'custom public output');
  await write(path.join(site, 'index.html'), html('Initial', 'Obsolete sunflower'));
  await hook({ dir: pathToFileURL(site + path.sep), logger });
  await write(path.join(site, 'pagefind', 'obsolete-sentinel.txt'), 'old bundle');
  await write(path.join(site, 'index.html'), html('Replacement', 'Fresh magnolia'));
  await hook({ dir: pathToFileURL(site + path.sep), logger });
  await assert.rejects(fs.stat(path.join(site, 'pagefind/obsolete-sentinel.txt')), { code: 'ENOENT' });
  const records = await fragments(site);
  assert.equal(records.length, 1);
  assert.ok(records[0].content.includes('magnolia'));
  assert.ok(!records[0].content.includes('sunflower'));
});

test('empty index cannot pass using an old successful bundle', async t => {
  const site = await fixture(t);
  await write(path.join(site, 'index.html'), html('Initial', 'Searchable content'));
  await hook({ dir: pathToFileURL(site + path.sep), logger });
  await fs.unlink(path.join(site, 'index.html'));
  await assert.rejects(hook({ dir: pathToFileURL(site + path.sep), logger }));
  await assert.rejects(fs.stat(path.join(site, 'pagefind')), { code: 'ENOENT' });
});

test('invalid input directory rejects rather than reaching adapter copy', async t => {
  const root = await fixture(t);
  await assert.rejects(hook({ dir: pathToFileURL(path.join(root, 'missing') + path.sep), logger }), { code: 'ENOENT' });
  await write(path.join(root, 'file'), 'not a directory');
  await assert.rejects(hook({ dir: pathToFileURL(path.join(root, 'file')), logger }), /must be a directory/);
});

test('linked bundle is refused without modifying its target', async t => {
  const root = await fixture(t);
  const site = path.join(root, 'client');
  const target = path.join(root, 'protected');
  await write(path.join(site, 'index.html'), html('Fixture', 'Searchable content'));
  await write(path.join(target, 'sentinel.txt'), 'preserve');
  await fs.symlink(target, path.join(site, 'pagefind'), process.platform === 'win32' ? 'junction' : 'dir');
  await assert.rejects(hook({ dir: pathToFileURL(site + path.sep), logger }), /linked Pagefind/);
  assert.equal(await fs.readFile(path.join(target, 'sentinel.txt'), 'utf8'), 'preserve');
});

test('configuration cannot redirect output outside the generated directory', async t => {
  const root = await fixture(t);
  const site = path.join(root, 'client');
  await write(path.join(site, 'index.html'), html('Fixture', 'Searchable content'));
  await write(path.join(root, 'pagefind.yml'), 'output_path: ./outside\n');
  await isolatedHook(root, site);
  assert.equal((await fragments(site)).length, 1);
  await assert.rejects(fs.stat(path.join(root, 'outside')), { code: 'ENOENT' });
});

test('a real CLI failure rejects and removes the old bundle', async t => {
  const root = await fixture(t);
  const site = path.join(root, 'client');
  await write(path.join(site, 'index.html'), html('Fixture', 'Searchable content'));
  await isolatedHook(root, site);
  await assert.rejects(isolatedHook(root, site, {
    PAGEFIND_EXTENDED_BINARY_PATH: path.join(root, 'nonexistent-binary'),
  }), error => typeof error.code === 'number' && error.code !== 0);
  await assert.rejects(fs.stat(path.join(site, 'pagefind')), { code: 'ENOENT' });
});
