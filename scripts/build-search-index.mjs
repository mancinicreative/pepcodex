import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { pathToFileURL } from 'node:url';
import * as pagefind from 'pagefind';

const hash = data => createHash('sha256').update(data).digest('hex');
const exists = file => fs.existsSync(file);
function directory(dir) {
  const stat = fs.lstatSync(dir);
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`Expected an ordinary build directory: ${dir}`);
}
function filesUnder(root) {
  const files = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), stat = fs.lstatSync(file);
      if (stat.isSymbolicLink()) throw new Error(`Linked build asset is not eligible for packaging: ${file}`);
      if (stat.isDirectory()) walk(file);
      else if (stat.isFile()) files.push(path.relative(root, file).split(path.sep).join('/'));
      else throw new Error(`Non-regular build asset: ${file}`);
    }
  }
  walk(root);
  return files;
}
function checkedResponse(result, operation) {
  if (!result || !Array.isArray(result.errors) || result.errors.length) throw new Error(`Pagefind ${operation} failed: ${(result?.errors || ['malformed response']).join('; ')}`);
  return result;
}
function removeOwnedTemporary(dir, parent) {
  if (path.dirname(dir) !== parent || !/^\.pagefind-(stage|backup)-/.test(path.basename(dir))) throw new Error('Refusing cleanup outside the generated temporary bundle directory.');
  if (exists(dir)) fs.rmSync(dir, { recursive: true, force: true });
}
function assetPath(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_./-]+$/.test(value) || value.startsWith('/') || value.split('/').some(part => !part || part === '.' || part === '..')) throw new Error('Pagefind returned an unsafe bundle asset path.');
  return value;
}
function validateBundle(rawFiles, inputUrls) {
  if (!Array.isArray(rawFiles) || !rawFiles.length) throw new Error('Pagefind returned an empty bundle.');
  const seen = new Set();
  const files = rawFiles.map(file => {
    const name = assetPath(file.path);
    if (seen.has(name.toLowerCase())) throw new Error('Pagefind returned duplicate bundle asset paths.');
    seen.add(name.toLowerCase());
    if (!(file.content instanceof Uint8Array) || !file.content.length) throw new Error(`Pagefind returned an empty/invalid asset: ${name}`);
    return { path: name, content: Buffer.from(file.content) };
  });
  const byPath = new Map(files.map(file => [file.path, file.content]));
  for (const name of ['pagefind.js', 'pagefind-entry.json']) if (!byPath.has(name)) throw new Error(`Pagefind bundle is missing ${name}`);
  const entry = JSON.parse(byPath.get('pagefind-entry.json').toString('utf8'));
  const languages = Object.values(entry.languages || {});
  const pages = languages.reduce((count, language) => count + Number(language.page_count), 0);
  if (!Number.isSafeInteger(pages) || pages <= 0) throw new Error('Pagefind indexed no searchable pages.');
  for (const language of languages) {
    if (!byPath.has(`pagefind.${language.hash}.pf_meta`) || !byPath.has(`wasm.${language.wasm}.pagefind`)) throw new Error('Pagefind language metadata or WebAssembly asset is missing.');
  }
  if (!files.some(file => file.path.startsWith('index/') && file.path.endsWith('.pf_index'))) throw new Error('Pagefind search index assets are missing.');
  const urls = [];
  for (const file of files.filter(file => file.path.endsWith('.pf_fragment'))) {
    const decoded = gunzipSync(file.content).toString('utf8');
    if (!decoded.startsWith('pagefind_dcd')) throw new Error('Unexpected Pagefind fragment encoding.');
    const fragment = JSON.parse(decoded.slice('pagefind_dcd'.length));
    if (!inputUrls.has(fragment.url)) throw new Error(`Pagefind result URL does not match an input page: ${fragment.url}`);
    urls.push(fragment.url);
  }
  if (urls.length !== pages || new Set(urls).size !== pages) throw new Error('Pagefind fragment count/URLs do not reconcile with its entry manifest.');
  return { files, pages, urls: urls.sort(), version: entry.version };
}

/** Build once from Astro's client HTML, then publish the same bytes to both hosts. */
export async function buildSearchIndex({ projectRoot = process.cwd(), api = pagefind } = {}) {
  const project = path.resolve(projectRoot);
  const site = path.join(project, 'dist/client');
  const deployment = path.join(project, '.vercel/output/static');
  const reportPath = path.join(project, 'dist/search-index-manifest.json');
  const report = { startedAt: new Date().toISOString(), status: 'FAILED', site, deployment, inputs: [], outputs: [] };
  let index;
  let closed = false;
  let committed = false;
  const staged = [];
  try {
    directory(site); directory(deployment);
    const realProject = fs.realpathSync(project);
    for (const dir of [site, deployment]) {
      const relative = path.relative(realProject, fs.realpathSync(dir));
      if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Build output resolves outside the project.');
    }
    const inventory = filesUnder(site);
    if (inventory.some(file => /^\.pagefind-(stage|backup)-/.test(file))) throw new Error('Interrupted Pagefind staging output requires inspection before packaging.');
    const htmlFiles = inventory.filter(file => file.endsWith('.html') && !file.startsWith('pagefind/'));
    if (!htmlFiles.includes('index.html')) throw new Error('Astro client homepage is missing.');
    const pages = htmlFiles.map(file => {
      const content = fs.readFileSync(path.join(site, file));
      const deployedFile = path.join(deployment, file);
      if (!exists(deployedFile) || fs.lstatSync(deployedFile).isSymbolicLink() || !fs.lstatSync(deployedFile).isFile()) throw new Error(`Required ordinary Vercel HTML is absent: ${file}`);
      const deployedRelative = path.relative(fs.realpathSync(deployment), fs.realpathSync(deployedFile));
      if (deployedRelative.startsWith('..') || path.isAbsolute(deployedRelative) || hash(fs.readFileSync(deployedFile)) !== hash(content)) throw new Error(`Required Vercel HTML differs from the client output or escapes deployment: ${file}`);
      // Astro's index.html outputs are served without /index.html or trailing slash.
      const route = file === 'index.html' ? '/' : '/' + file.replace(/\/index\.html$/, '');
      const url = encodeURI(route);
      report.inputs.push({ path: file, sha256: hash(content), url });
      return { url, content: content.toString('utf8') };
    });
    index = checkedResponse(await api.createIndex({ writePlayground: false }), 'createIndex').index;
    if (!index) throw new Error('Pagefind did not create an index.');
    for (const page of pages) checkedResponse(await index.addHTMLFile(page), 'addHTMLFile');
    const bundle = validateBundle(checkedResponse(await index.getFiles(), 'getFiles').files, new Set(pages.map(page => page.url)));
    report.pagefindVersion = bundle.version;
    report.indexedPages = bundle.pages;
    report.resultUrls = bundle.urls;
    report.assets = bundle.files.map(file => ({ path: file.path, bytes: file.content.length, sha256: hash(file.content) }));
    await index.deleteIndex(); index = undefined;
    await api.close(); closed = true;

    // Stage and verify both complete bundles before replacing either target.
    for (const parent of [site, deployment]) {
      const target = path.join(parent, 'pagefind');
      const stage = fs.mkdtempSync(path.join(parent, '.pagefind-stage-'));
      const item = { parent, target, stage, backup: path.join(parent, `.pagefind-backup-${randomUUID()}`), moved: false, published: false };
      staged.push(item);
      if (exists(target)) { directory(target); filesUnder(target); fs.cpSync(target, stage, { recursive: true }); }
      // Retain unrelated files already inside the bundle folder; overwrite only returned assets.
      for (const file of bundle.files) {
        const destination = path.join(stage, file.path);
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.writeFileSync(destination, file.content);
        if (hash(fs.readFileSync(destination)) !== hash(file.content)) throw new Error('Staged Pagefind asset failed byte verification.');
      }
    }
    for (const item of staged) {
      if (exists(item.target)) { fs.renameSync(item.target, item.backup); item.moved = true; }
      fs.renameSync(item.stage, item.target); item.published = true;
    }
    for (const item of staged) {
      for (const file of bundle.files) if (hash(fs.readFileSync(path.join(item.target, file.path))) !== hash(file.content)) throw new Error('Published Pagefind asset failed byte verification.');
      report.outputs.push({ directory: item.target, assets: bundle.files.length });
    }
    committed = true;
    for (const item of staged) if (item.moved) removeOwnedTemporary(item.backup, item.parent);
    report.status = 'COMPLETE';
    report.completedAt = new Date().toISOString();
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
    return report;
  } catch (error) {
    report.status = 'FAILED'; report.error = error.message; report.completedAt = new Date().toISOString();
    for (const item of committed ? [] : staged.toReversed()) {
      if (item.published) {
        // Rename the new directory back to our stage name before bounded cleanup.
        fs.renameSync(item.target, item.stage);
      }
      if (item.moved && exists(item.backup)) fs.renameSync(item.backup, item.target);
      removeOwnedTemporary(item.stage, item.parent);
    }
    if (exists(path.dirname(reportPath))) fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
    throw error;
  } finally {
    if (!closed) {
      try { if (index) await index.deleteIndex(); }
      finally { await api.close(); }
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const report = await buildSearchIndex();
    console.log(`Pagefind ${report.pagefindVersion}: ${report.indexedPages} pages; identical bundle verified in dist/client/pagefind and .vercel/output/static/pagefind.`);
  } catch (error) {
    console.error(`SEARCH_INDEX_FAILED: ${error.message}`);
    process.exitCode = 1;
  }
}
