import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const scripts = path.dirname(fileURLToPath(import.meta.url));
const counts = {a: {count: 43, human: 7, preclinical: 3}, b: {count: 15, human: 4, preclinical: 2}};
const labels = {
  'Source identifiers': 'count', 'Sources in dossier': 'count',
  'Human-tagged identifiers': 'human', 'Human evidence entries': 'human',
  'Preclinical-tagged identifiers': 'preclinical', 'Preclinical evidence entries': 'preclinical',
  'Total Sources': 'count', 'Human Studies': 'human', 'Preclinical Studies': 'preclinical',
};

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pepcodex-count-labels-'));
  t.after(() => {
    const resolved = path.resolve(root);
    assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()));
    assert.ok(path.basename(resolved).startsWith('pepcodex-count-labels-'));
    fs.rmSync(resolved, {recursive: true, force: true});
  });
  fs.mkdirSync(path.join(root, 'src/content/peptides'), {recursive: true});
  fs.mkdirSync(path.join(root, 'src/content/comparisons'), {recursive: true});
  for (const [slug, c] of Object.entries(counts)) {
    fs.writeFileSync(path.join(root, `src/content/peptides/${slug}.mdx`), `---\nname: Fixture ${slug}\nsources:\n  count: ${c.count}\n  human: ${c.human}\n  preclinical: ${c.preclinical}\n---\n`);
  }
  const file = path.join(root, 'src/content/comparisons/a-vs-b.mdx');
  const write = body => fs.writeFileSync(file, `---\r\npeptideA: a\r\npeptideB: b\r\n---\r\n${body}\r\n`);
  const call = (script, ...args) => spawnSync(process.execPath, [path.join(scripts, script), ...args], {cwd: root, encoding: 'utf8'});
  return {file, write, call};
}

test('each supported numeric row rejects drift in either column and repairs only counts', t => {
  const f = fixture(t);
  for (const [label, field] of Object.entries(labels)) {
    const valid = `| **${label}** | ${counts.a[field]} | ${counts.b[field]} |`;
    f.write(valid);
    const original = fs.readFileSync(f.file, 'utf8');
    assert.equal(f.call('qa-comparison-counts.mjs', '--strict').status, 0, label);
    for (const side of ['a', 'b']) {
      f.write(`| **${label}** | ${side === 'a' ? 999 : counts.a[field]} | ${side === 'b' ? 999 : counts.b[field]} |`);
      const rejected = f.call('qa-comparison-counts.mjs', '--strict');
      assert.equal(rejected.status, 1, `${label}/${side}: ${rejected.stderr}`);
      assert.ok(rejected.stderr.includes(label), rejected.stderr);
      assert.equal(f.call('refresh-comparison-counts.mjs', '--apply').status, 0);
      assert.equal(fs.readFileSync(f.file, 'utf8'), original, label);
    }
  }
});

test('explicit inventory cells retain parent-only qualifiers in either column', t => {
  const f = fixture(t);
  const valid = '| **Human evidence entries** | 7 (parent Selank) | 4 (other source context) |';
  f.write(valid);
  const original = fs.readFileSync(f.file, 'utf8');
  for (const changed of [valid.replace('7 (', '999 ('), valid.replace('4 (', '999 (')]) {
    f.write(changed);
    assert.equal(f.call('qa-comparison-counts.mjs', '--strict').status, 1);
    assert.equal(f.call('refresh-comparison-counts.mjs', '--apply').status, 0);
    assert.equal(fs.readFileSync(f.file, 'utf8'), original);
  }
});

test('qualified study counts and RCT/trial counts are not rewritten as inventory counts', t => {
  const f = fixture(t);
  f.write('| **Human Studies** | 5 (observational) | 8 (observational) |\r\n| **Human Studies** | 6 (biomarker/correlational) | 10 (biomarker/correlational) |\r\n| **Human RCTs** | 0 | 0 |\r\n| **Human Trials** | 0 | 1 |');
  const original = fs.readFileSync(f.file, 'utf8');
  assert.equal(f.call('qa-comparison-counts.mjs', '--strict').status, 0);
  assert.equal(f.call('refresh-comparison-counts.mjs', '--apply').status, 0);
  assert.equal(fs.readFileSync(f.file, 'utf8'), original);
});
