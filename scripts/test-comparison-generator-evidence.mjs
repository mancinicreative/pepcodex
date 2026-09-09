import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import matter from 'gray-matter';
import {inspectComparisonSemantics} from './lib/comparison-semantics.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function fixture(t, aHuman, bHuman, aGrade='high', bGrade='high', bCategory='metabolic') {
  // Inside the repository so copied scripts resolve the same installed dependencies.
  const root = fs.mkdtempSync(path.join(repo,'.comparison-generator-test-'));
  t.after(()=>{
    const resolved = path.resolve(root);
    assert.equal(path.dirname(resolved),repo);
    assert.ok(path.basename(resolved).startsWith('.comparison-generator-test-'));
    fs.rmSync(resolved,{recursive:true,force:true});
  });
  for (const dir of ['scripts','src/content/peptides','src/content/comparisons']) fs.mkdirSync(path.join(root,dir),{recursive:true});
  fs.copyFileSync(path.join(repo,'scripts/generate-comparisons.mjs'),path.join(root,'scripts/generate-comparisons.mjs'));
  const A = {name:'Fixture A',category:'metabolic',evidenceStrength:aGrade,summary:'Fixture A summary.',comparators:['b'],sources:{count:20,human:aHuman,preclinical:2,openAccess:5}};
  const B = {name:'Fixture B',category:bCategory,evidenceStrength:bGrade,summary:'Fixture B summary.',comparators:['a'],sources:{count:30,human:bHuman,preclinical:3,openAccess:5}};
  for (const [slug,data] of [['a',A],['b',B]]) fs.writeFileSync(path.join(root,`src/content/peptides/${slug}.mdx`),matter.stringify('',data).replace(/\r?\n/g,'\r\n'));
  const run = (...args)=>spawnSync(process.execPath,[path.join(root,'scripts/generate-comparisons.mjs'),...args],{cwd:root,encoding:'utf8'});
  return {root,A,B,run,file:path.join(root,'src/content/comparisons/a-vs-b.mdx')};
}

test('actual generator evidence FAQs avoid count winners for either ordering and ties',t=>{
  for (const [a,b] of [[4,7],[7,4],[7,7],[0,0]]) {
    const f = fixture(t,a,b);
    const result = f.run('--limit','1');
    assert.equal(result.status,0,result.stderr);
    const raw = fs.readFileSync(f.file,'utf8'), page = matter(raw).data;
    assert.equal(page.faqs.length,4);
    assert.ok(page.faqs[0].answer.includes('recorded dossier classifications'));
    assert.ok(!page.faqs[0].answer.includes('differ in evidence strength'));
    assert.ok(page.faqs[1].answer.includes('Source counts alone do not establish'));
    assert.deepEqual(inspectComparisonSemantics({...page,faqs:page.faqs.slice(0,2)},f.A,f.B),[]);
    assert.ok(raw.includes(`| **Human evidence entries** | ${a} | ${b} |`));
    assert.ok(raw.includes('| **Preclinical evidence entries** | 2 | 3 |'));
    assert.ok(raw.includes('| **Sources in dossier** | 20 | 30 |'));
    assert.ok(!raw.includes('**Human Studies**'));
    assert.ok(raw.includes('https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-05'));
    const numerical = spawnSync(process.execPath,[path.join(repo,'scripts/qa-comparison-counts.mjs'),'--strict'],{cwd:f.root,encoding:'utf8'});
    assert.equal(numerical.status,0,numerical.stderr);
  }
});
test('actual generator preserves distinct recorded categories and grades without a winner',t=>{
  const f = fixture(t,4,7,'very-low','moderate','cognitive');
  assert.equal(f.run('--limit','1').status,0);
  const page = matter(fs.readFileSync(f.file,'utf8')).data;
  assert.ok(page.faqs[0].answer.includes('Metabolic with a Very Low evidence grade'));
  assert.ok(page.faqs[0].answer.includes('Cognitive with a Moderate evidence grade'));
  assert.ok(!page.faqs[1].answer.includes('has more clinical evidence'));
});
test('dry run creates no pages and subsequent runs preserve independently edited output',t=>{
  const f = fixture(t,4,7);
  assert.equal(f.run('--dry-run','--limit','1').status,0);
  assert.equal(fs.existsSync(f.file),false);
  assert.equal(f.run('--limit','1').status,0);
  const edited='---\r\npeptideA: a\r\npeptideB: b\r\n---\r\nIndependently reviewed content.\r\n';
  fs.writeFileSync(f.file,edited);
  assert.equal(f.run('--limit','1').status,0);
  assert.equal(fs.readFileSync(f.file,'utf8'),edited);
});
test('overview extraction retains decimal values instead of truncating at their first period',t=>{
  const f=fixture(t,4,7);
  const dossier=path.join(f.root,'src/content/peptides/a.mdx');
  const data=matter(fs.readFileSync(dossier,'utf8')).data;
  data.summary='A fixture acquired through a $2.7 billion transaction with a 0.05 example value. A separate second sentence.';
  fs.writeFileSync(dossier,matter.stringify('',data));
  assert.equal(f.run('--limit','1').status,0);
  const generated=fs.readFileSync(f.file,'utf8');
  assert.ok(generated.includes('**Fixture A:** A fixture acquired through a $2.7 billion transaction with a 0.05 example value.'));
  assert.ok(!generated.includes('A separate second sentence'));
});
