import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';
import * as pagefind from 'pagefind';
import { buildSearchIndex } from './build-search-index.mjs';

const hash = data => createHash('sha256').update(data).digest('hex');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pepcodex-pagefind-'));
  t.after(() => {
    assert.equal(path.dirname(root), path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith('pepcodex-pagefind-'));
    fs.rmSync(root, { recursive: true, force: true });
  });
  const client = path.join(root, 'dist/client'), deploy = path.join(root, '.vercel/output/static');
  const html = title => `<html lang="en"><head><title>${title}</title></head><body><main data-pagefind-body><h1>${title}</h1><p>Distinctivefixture search evidence.</p></main></body></html>`;
  for (const dir of [client, deploy]) {
    fs.mkdirSync(path.join(dir, 'peptides/fixture'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html('Fixture home'));
    fs.writeFileSync(path.join(dir, 'peptides/fixture/index.html'), html('Fixture dossier'));
    fs.writeFileSync(path.join(dir, 'google-test.html'), 'google-site-verification: google-test.html');
    fs.writeFileSync(path.join(dir, 'unrelated.txt'), 'preserve outside bundle');
    fs.mkdirSync(path.join(dir, 'pagefind'));
    fs.writeFileSync(path.join(dir, 'pagefind/operator-note.txt'), 'preserve inside bundle');
    fs.writeFileSync(path.join(dir, 'pagefind/pagefind.js'), 'old fixture bundle');
  }
  return { root, client, deploy };
}
test('actual Pagefind HTML index is packaged identically for client and Vercel with root-relative result URLs', async t => {
  const { root, client, deploy } = fixture(t);
  const report = await buildSearchIndex({ projectRoot: root });
  assert.equal(report.status, 'COMPLETE');
  assert.equal(report.pagefindVersion, '1.4.0');
  assert.equal(report.indexedPages, 2);
  assert.deepEqual(report.resultUrls, ['/', '/peptides/fixture']);
  assert.equal(report.inputs.length, 3);
  for (const entry of report.assets) {
    const local = fs.readFileSync(path.join(client, 'pagefind', entry.path));
    const deployed = fs.readFileSync(path.join(deploy, 'pagefind', entry.path));
    assert.deepEqual(deployed, local);
    assert.equal(hash(deployed), entry.sha256);
    assert.equal(deployed.length, entry.bytes);
  }
  const bundle = path.join(deploy, 'pagefind');
  const manifest = JSON.parse(fs.readFileSync(path.join(bundle, 'pagefind-entry.json')));
  assert.ok(fs.statSync(path.join(bundle, `pagefind.${manifest.languages.en.hash}.pf_meta`)).size > 0);
  assert.ok(fs.statSync(path.join(bundle, `wasm.${manifest.languages.en.wasm}.pagefind`)).size > 0);
  const module = fs.readFileSync(path.join(bundle, 'pagefind.js'), 'utf8');
  assert.match((await transform(module, { loader: 'js', format: 'esm' })).code, /export\s*\{/);
  const fragments = report.assets.filter(asset => asset.path.endsWith('.pf_fragment')).map(asset => JSON.parse(gunzipSync(fs.readFileSync(path.join(bundle, asset.path))).toString().slice('pagefind_dcd'.length)));
  assert.deepEqual(fragments.map(fragment => fragment.url).sort(), ['/', '/peptides/fixture']);
  assert.ok(fragments.every(fragment => fragment.content.includes('Distinctivefixture')));
  assert.ok(report.assets.some(asset => asset.path.startsWith('index/') && asset.path.endsWith('.pf_index')));
  assert.equal(report.assets.some(asset => asset.path.startsWith('playground/')), false);
  for (const dir of [client, deploy]) {
    assert.equal(fs.readFileSync(path.join(dir, 'unrelated.txt'), 'utf8'), 'preserve outside bundle');
    assert.equal(fs.readFileSync(path.join(dir, 'pagefind/operator-note.txt'), 'utf8'), 'preserve inside bundle');
    assert.equal(fs.readdirSync(dir).some(name => /^\.pagefind-(stage|backup)-/.test(name)), false);
  }
  assert.equal(fs.existsSync(path.join(root, 'dist/pagefind')), false);
});

test('missing or stale deployment HTML fails before replacing either existing bundle', async t => {
  for (const mode of ['missing', 'different']) {
    const { root, client, deploy } = fixture(t);
    const file = path.join(deploy, 'peptides/fixture/index.html');
    if (mode === 'missing') fs.unlinkSync(file); else fs.writeFileSync(file, 'stale build');
    await assert.rejects(buildSearchIndex({ projectRoot: root }), /Required .*Vercel HTML/);
    for (const dir of [client, deploy]) assert.equal(fs.readFileSync(path.join(dir, 'pagefind/pagefind.js'), 'utf8'), 'old fixture bundle');
    assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'dist/search-index-manifest.json'))).status, 'FAILED');
  }
});

test('missing required Vercel output produces a nonzero real CLI exit and no success claim', t => {
  const { root, client, deploy } = fixture(t);
  fs.renameSync(deploy, path.join(root, '.vercel/output/static-unavailable'));
  const run = spawnSync(process.execPath, [fileURLToPath(new URL('./build-search-index.mjs', import.meta.url))], { cwd: root, encoding: 'utf8', timeout: 20000 });
  assert.equal(run.status, 1, run.stderr);
  assert.match(run.stderr, /SEARCH_INDEX_FAILED/);
  assert.doesNotMatch(run.stdout, /identical bundle verified/);
  assert.equal(fs.readFileSync(path.join(client, 'pagefind/pagefind.js'), 'utf8'), 'old fixture bundle');
});

test('Pagefind error responses and missing emitted assets never publish partial success', async t => {
  for (const mode of ['index-error', 'files-error', 'missing-module', 'missing-fragments', 'unsafe-path']) {
    const { root, client, deploy } = fixture(t);
    const api = { close: pagefind.close, createIndex: async config => {
      const created = await pagefind.createIndex(config);
      const actual = created.index;
      return { ...created, index: { ...actual,
        addHTMLFile: mode === 'index-error' ? async () => ({ errors: ['injected indexing failure'] }) : actual.addHTMLFile,
        getFiles: async () => {
          const result = await actual.getFiles();
          if (mode === 'files-error') return { errors: ['injected output failure'] };
          if (mode === 'missing-module') result.files = result.files.filter(file => file.path !== 'pagefind.js');
          if (mode === 'missing-fragments') result.files = result.files.filter(file => !file.path.endsWith('.pf_fragment'));
          if (mode === 'unsafe-path') result.files.push({ path: '../escape.js', content: new Uint8Array([1]) });
          return result;
        },
      } };
    } };
    await assert.rejects(buildSearchIndex({ projectRoot: root, api }));
    for (const dir of [client, deploy]) assert.equal(fs.readFileSync(path.join(dir, 'pagefind/pagefind.js'), 'utf8'), 'old fixture bundle');
    assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'dist/search-index-manifest.json'))).status, 'FAILED');
  }
});

test('non-directory deployment bundle leaves both old outputs intact', async t => {
  const { root, client, deploy } = fixture(t);
  const bundle = path.join(deploy, 'pagefind');
  fs.renameSync(bundle, path.join(deploy, 'preserved-pagefind-fixture'));
  fs.writeFileSync(bundle, 'unrelated file collision');
  await assert.rejects(buildSearchIndex({ projectRoot: root }), /ordinary build directory/);
  assert.equal(fs.readFileSync(bundle, 'utf8'), 'unrelated file collision');
  assert.equal(fs.readFileSync(path.join(client, 'pagefind/pagefind.js'), 'utf8'), 'old fixture bundle');
  assert.equal(fs.readdirSync(client).some(name => name.startsWith('.pagefind-stage-')), false);
});

test('Pagefind deleteIndex and close failures are reported before either bundle is replaced', async t => {
  for (const mode of ['delete-index', 'close']) {
    const { root, client, deploy } = fixture(t);
    const api = {
      createIndex: async config => {
        const created = await pagefind.createIndex(config);
        const actual = created.index;
        return { ...created, index: { ...actual, deleteIndex: async () => {
          await actual.deleteIndex();
          if (mode === 'delete-index') throw new Error('injected deleteIndex failure');
        } } };
      },
      close: async () => {
        await pagefind.close();
        if (mode === 'close') throw new Error('injected close failure');
      },
    };
    await assert.rejects(buildSearchIndex({ projectRoot: root, api }), /injected .* failure/);
    for (const dir of [client, deploy]) {
      assert.equal(fs.readFileSync(path.join(dir, 'pagefind/pagefind.js'), 'utf8'), 'old fixture bundle');
      assert.equal(fs.readdirSync(dir).some(name => /^\.pagefind-(stage|backup)-/.test(name)), false);
    }
    assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'dist/search-index-manifest.json'))).status, 'FAILED');
  }
});

test('failure deleting the second backup retains both verified new bundles after commit', async t => {
  const { root, client, deploy } = fixture(t);
  const originalRmSync = fs.rmSync;
  let injected = false;
  fs.rmSync = (target, options) => {
    if (path.dirname(String(target)) === deploy && path.basename(String(target)).startsWith('.pagefind-backup-')) {
      injected = true;
      throw new Error('injected second backup cleanup failure');
    }
    return originalRmSync(target, options);
  };
  try {
    await assert.rejects(buildSearchIndex({ projectRoot: root }), /injected second backup cleanup failure/);
  } finally {
    fs.rmSync = originalRmSync;
  }
  assert.equal(injected, true);
  const report = JSON.parse(fs.readFileSync(path.join(root, 'dist/search-index-manifest.json')));
  assert.equal(report.status, 'FAILED');
  for (const dir of [client, deploy]) {
    assert.notEqual(fs.readFileSync(path.join(dir, 'pagefind/pagefind.js'), 'utf8'), 'old fixture bundle');
    for (const asset of report.assets) assert.equal(hash(fs.readFileSync(path.join(dir, 'pagefind', asset.path))), asset.sha256);
    assert.equal(fs.readFileSync(path.join(dir, 'pagefind/operator-note.txt'), 'utf8'), 'preserve inside bundle');
  }
  assert.equal(fs.readdirSync(client).some(name => name.startsWith('.pagefind-backup-')), false);
  assert.equal(fs.readdirSync(deploy).filter(name => name.startsWith('.pagefind-backup-')).length, 1);
});
