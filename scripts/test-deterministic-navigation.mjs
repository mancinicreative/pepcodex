import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';import {transform} from 'esbuild';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const related=read('src/components/RelatedEntities.astro');
let relatedCode=related.slice(related.indexOf('import { getCollection'),related.indexOf('const hasContent')).replace("import { getCollection } from 'astro:content';",'');
relatedCode=(await transform(relatedCode,{loader:'ts',format:'esm'})).code;
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const evaluate=new AsyncFunction('Astro','getCollection',relatedCode+'return {peptides:peptidesToShow.map(x=>x.slug),guides:guidesToShow.map(x=>x.slug),comparisons:comparisonsToShow.map(x=>x.slug)};');
const select=(astro,getCollection)=>evaluate({...astro,url:new URL('/peptides/current','https://www.pepcodex.com')},getCollection);
const dossier=read('src/layouts/DossierLayout.astro');const start=dossier.indexOf('const comparatorSlugs = new Set(comparators.map');const end=dossier.indexOf('return related.length > 0',start);assert.ok(start>0&&end>start);
const same=new Function('allPeptides','comparators','category','currentSlug',dossier.slice(start,end)+'return related.map(x=>x.slug);');
const blog=read('src/pages/blog/[slug].astro');const expression=blog.match(/const sorted = (posts\.sort\([\s\S]*?\));/)[1];const chronology=new Function('posts',`return ${expression}.map(x=>x.slug);`);
const item=(slug,data)=>({slug,data});
const collections={peptides:['z','b','a','c','current','excluded','wrong'].map(slug=>item(slug,{category:slug==='wrong'?'other':'test',comparators:['z','a']})),guides:['z','b','a','c','wrong'].map(slug=>item(slug,{peptide:slug==='wrong'?'other':'current'})),comparisons:['z','b','a','c','wrong'].map(slug=>item(slug,{peptideA:slug==='wrong'?'other':'current',peptideB:'other'}))};
function shuffle(input,seed){const copy=[...input];let state=seed;for(let i=copy.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=state%(i+1);[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
let permutations=0;
for(let seed=1;seed<=32;seed++){
 const c=Object.fromEntries(Object.entries(collections).map(([name,entries])=>[name,shuffle(entries,seed)]));
 assert.deepEqual(await select({props:{category:'test',currentPeptide:'current'}},async name=>c[name]),{peptides:['a','b','c'],guides:['a','b'],comparisons:['a','b']});
 assert.deepEqual(await select({props:{category:'test',currentPeptide:'current',relatedPeptides:['z','missing','a','b'],relatedGuides:['z','a','missing']}},async name=>c[name]),{peptides:['z','a','b'],guides:['z','a'],comparisons:['a','b']});
 assert.deepEqual(await select({props:{currentPeptide:'current'}},async name=>c[name]),{peptides:['z','a'],guides:['a','b'],comparisons:['a','b']});
 assert.deepEqual(same(c.peptides,['Excluded'],'test','current'),['a','b','c','z']);
 const posts=[item('z',{publishDate:new Date('2026-01-02')}),item('a',{publishDate:new Date('2026-01-02')}),item('b',{publishDate:new Date('2026-01-01')}),item('old',{publishDate:new Date('2025-01-01')})];
 assert.deepEqual(chronology(shuffle(posts,seed)),['a','z','b','old']);permutations++;
}
const empty=async()=>[];assert.deepEqual(await select({props:{category:'none'}},empty),{peptides:[],guides:[],comparisons:[]});assert.deepEqual(same([],[],'test','current'),[]);assert.deepEqual(chronology([]),[]);
const small={peptides:[item('z',{category:'test'})],guides:[item('z',{peptide:'current'})],comparisons:[item('z',{peptideB:'current'})]};
assert.deepEqual(await select({props:{category:'test',currentPeptide:'current',maxItems:1}},async name=>small[name]),{peptides:['z'],guides:['z'],comparisons:['z']});
const many=Array.from({length:10},(_,i)=>item(String(i),{category:'test'}));assert.deepEqual(same(many.reverse(),[],'test','current'),['0','1','2','3','4','5']);
console.log(JSON.stringify({status:'PASS',shuffledPermutations:permutations,actualSourceSelectors:true,checks:['implicit selection stable','explicit arrays preserve order','filters and exclusions retained','chronology descending with slug ties','empty and under-limit collections','same-category six-item limit'],scope:'Selector regression only; no generated-page, graph, clinical or production acceptance'},null,2));
