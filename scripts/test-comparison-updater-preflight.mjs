import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const scripts = path.dirname(fileURLToPath(import.meta.url));
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(),'pepcodex-semantic-preflight-'));
  t.after(()=>{
    const resolved=path.resolve(root);
    assert.equal(path.dirname(resolved),path.resolve(os.tmpdir()));
    assert.ok(path.basename(resolved).startsWith('pepcodex-semantic-preflight-'));
    fs.rmSync(resolved,{recursive:true,force:true});
  });
  fs.mkdirSync(path.join(root,'src/content/peptides'),{recursive:true});
  fs.mkdirSync(path.join(root,'src/content/comparisons'),{recursive:true});
  for (const [slug,human] of [['a',4],['b',7]]) fs.writeFileSync(path.join(root,`src/content/peptides/${slug}.mdx`),`---\r\nname: Fixture ${slug.toUpperCase()}\r\nsources:\r\n  count: 20\r\n  human: ${human}\r\n  preclinical: 0\r\n---\r\n`);
  const write=(name,body)=>{const file=path.join(root,'src/content/comparisons',name);fs.writeFileSync(file,body);return file;};
  const run=(...args)=>spawnSync(process.execPath,[path.join(scripts,'refresh-comparison-counts.mjs'),...args],{cwd:root,encoding:'utf8'});
  return {root,write,run};
}
const page=answer=>`---\r\npeptideA: a\r\npeptideB: b\r\nfaqs:\r\n  - question: Evidence?\r\n    answer: ${answer}\r\n---\r\n`;
const staleTable='---\r\npeptideA: a\r\npeptideB: b\r\n---\r\n| **Human evidence entries** | 99 | 99 |\r\n';
test('whole apply batch is untouched for winner, tie, grade and unresolved-pair signals',t=>{
  for (const bad of [
    page('Fixture A has more clinical evidence with 9 human studies compared to 3 for Fixture B.'),
    page('Both have similar numbers of human studies (9 each).'),
    page('Both are categorized under Metabolic, but they differ in evidence strength. Fixture A has High evidence (20 sources), while Fixture B has High evidence (20 sources).'),
    '-\r\npeptideA: a\r\npeptideB: b\r\n---\r\n',
  ]) {
    const f=fixture(t), first=f.write('aaa-clean.mdx',staleTable), second=f.write('zzz-review.mdx',bad);
    const result=f.run('--apply');
    assert.equal(result.status,1,result.stderr);
    assert.ok(result.stderr.includes('No comparison files written'));
    assert.equal(fs.readFileSync(first,'utf8'),staleTable);
    assert.equal(fs.readFileSync(second,'utf8'),bad);
  }
});
test('explicit reviewed batch updates only selected safe file and is idempotent',t=>{
  const f=fixture(t), good=f.write('reviewed.mdx',staleTable), badText=page('Both have similar numbers of human studies (9 each).'), bad=f.write('later-review.mdx',badText);
  assert.equal(f.run('--apply','--file','reviewed.mdx').status,0);
  const updated=fs.readFileSync(good,'utf8');
  assert.equal(updated,staleTable.replace('99 | 99','4 | 7'));
  assert.equal(fs.readFileSync(bad,'utf8'),badText);
  assert.equal(f.run('--apply','--file','reviewed.mdx').status,0);
  assert.equal(fs.readFileSync(good,'utf8'),updated);
});
test('dry-run remains read-only and invalid selectors fail before mutation',t=>{
  const f=fixture(t), file=f.write('reviewed.mdx',staleTable);
  assert.equal(f.run().status,0);
  assert.equal(fs.readFileSync(file,'utf8'),staleTable);
  for(const args of [['--apply','--file','../escape.mdx'],['--apply','--file','absent.mdx']]) {
    assert.notEqual(f.run(...args).status,0);
    assert.equal(fs.readFileSync(file,'utf8'),staleTable);
  }
  const names=Array.from({length:11},(_,i)=>`pair-${i}.mdx`);
  const files=names.map(name=>f.write(name,staleTable));
  const tooMany=f.run('--apply',...names.flatMap(name=>['--file',name]));
  assert.equal(tooMany.status,1);
  assert.ok(tooMany.stderr.includes('limited to ten comparison files'),tooMany.stderr);
  for(const selected of files) assert.equal(fs.readFileSync(selected,'utf8'),staleTable);
  assert.equal(f.run('--apply',...names.slice(0,10).flatMap(name=>['--file',name])).status,0);
  assert.equal(fs.readFileSync(files[10],'utf8'),staleTable);
});
test('missing source metadata is not converted to zero during semantic preflight',t=>{
  const f=fixture(t), original=page('Both have similar numbers of human studies (0 each).'), file=f.write('missing-counts.mdx',original);
  fs.writeFileSync(path.join(f.root,'src/content/peptides/a.mdx'),'---\nname: Fixture A\n---\n');
  const result=f.run('--apply');
  assert.equal(result.status,1);
  assert.ok(result.stderr.includes('HUMAN_COUNT_UNAVAILABLE'));
  assert.ok(result.stderr.includes('SOURCE_COUNTS_INVALID'));
  assert.equal(fs.readFileSync(file,'utf8'),original);
  assert.equal(f.run().status,0);
  assert.equal(fs.readFileSync(file,'utf8'),original);
});
