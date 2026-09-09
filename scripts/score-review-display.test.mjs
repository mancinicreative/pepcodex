import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {transform} from 'esbuild';
import {transform as compileAstro} from '@astrojs/compiler';
import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import {parseFragment} from 'parse5';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const asModule=code=>`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const contentUrl=asModule(`import {z} from ${JSON.stringify(import.meta.resolve('zod'))};export {z};export const defineCollection=x=>x;export const getCollection=async()=>[];export const getEntry=async()=>undefined;`);
const schemaCode=(await transform(read('src/content/config.ts'),{loader:'ts',format:'esm'})).code.replace('"astro:content"',JSON.stringify(contentUrl));
const schema=(await import(asModule(schemaCode))).collections.peptides.schema;
const scoring={rubricVersion:'2.4',evidence:{researchDepth:71,mechanism:72,plausibility:73,globalCoverage:74,communityExperience:75,overall:76,label:'emerging'},effectiveness:{basis:'clinical',score:67,confidence:'moderate',primaryIndication:'Recorded indication'},lastScored:'2025-08-31',citations:[],notes:'Historical scoring note'};
const ratings={researchDepth:2,globalCoverage:3,mechanismPlausibility:4,anecdotalEvidence:5,overall:3.4,lastReviewed:'2025-09-30',reviewNotes:'Historical legacy note'};
const base={name:'Fixture',category:'metabolic',evidenceStrength:'high',lastUpdated:'2026-09-09',summary:'Synthetic render fixture',sources:{count:2,human:1,preclinical:1,openAccess:1}};
const review=status=>({status,summary:'Numeric assessment is incomplete.',...(status==='withheld'?{reasons:['incomplete-assessment']}: {})});
const parsed=(fields={})=>schema.parse({...base,...fields});
let slotUrl;
async function compile(source,filename,extra={}){
  const result=await compileAstro(source,{filename,internalURL:'astro/compiler-runtime',resultScopedSlot:true,resolvePath:s=>s});
  assert.deepEqual(result.diagnostics.filter(d=>d.severity===1),[],`${filename} diagnostics`);
  let code=(await transform(result.code,{loader:'ts',format:'esm'})).code.replace(/^import .*\?astro&type=style.*;\r?\n/gm,'');
  for(const m of [...code.matchAll(/from\s+["']([^"']+)["']/g)]){
    const spec=m[1];const url=extra[spec]||(spec==='astro:content'?contentUrl:spec.endsWith('.astro')?slotUrl:import.meta.resolve(spec));
    code=code.replaceAll(JSON.stringify(spec),JSON.stringify(url));
  }
  return asModule(code);
}
slotUrl=await compile('<slot />','fixture-slot.astro');
const cardUrl=await compile(read('src/components/RatingCard.astro'),'RatingCard.astro');
const Card=(await import(cardUrl)).default;
const container=await AstroContainer.create();
const renderCard=fields=>container.renderToString(Card,{props:parsed(fields)});
function nodes(html){const out=[];function walk(n){out.push(n);for(const c of n.childNodes||[])walk(c);}walk(parseFragment(html));return out;}
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>(n.value||'')+(n.childNodes||[]).map(text).join('');
const textOf=html=>nodes(html).filter(n=>n.nodeName==='#text').map(n=>n.value).join(' ');
const hasClass=(n,c)=>(attr(n,'class')||'').split(/\s+/).includes(c);
function noScores(html){
  assert.doesNotMatch(html,/\/100|\/5|width:|confidence|Historical scoring note|Historical legacy note|Evidence Score|Overall Score|Historical editorial rating/);
}

test('actual collection schema retains each supported state without inventing review metadata or altering numeric/catalogue data',()=>{
  const historical=parsed({scoring,ratings});assert.equal(historical.scoreReview,undefined);
  for(const status of ['unreviewed','under-review','withheld']){
    const scoreReview=review(status);const result=parsed({scoring,ratings,scoreReview});
    assert.deepEqual(result.scoreReview,scoreReview);assert.deepEqual(result.scoring,historical.scoring);assert.deepEqual(result.ratings,historical.ratings);assert.equal(result.evidenceStrength,'high');
    assert.equal(result.scoreReview.updatedAt,undefined);assert.equal(result.scoreReview.context,undefined);
  }
});
test('assessed, unknown states, empty summaries, unsupported fields and missing/invalid withholding reasons fail closed',()=>{
  for(const scoreReview of [review('assessed'),review('approved'),{...review('withheld'),reasons:[]},{status:'withheld',summary:'Incomplete'}, {...review('withheld'),reasons:['benefit-absent']},{...review('unreviewed'),summary:'   '},{...review('under-review'),reviewedAt:'2026-09-09'},null]){
    assert.equal(schema.safeParse({...base,scoring,ratings,scoreReview}).success,false,JSON.stringify(scoreReview));
  }
});
test('status dates are optional exact calendar dates with real leap/day validation and no Date coercion',()=>{
  for(const updatedAt of ['2024-02-29','2026-09-09','2026-12-31'])assert.equal(parsed({scoreReview:{...review('unreviewed'),updatedAt}}).scoreReview.updatedAt,updatedAt);
  for(const updatedAt of ['2025-02-29','2026-02-30','2026-04-31','2026-13-01','2026-00-01','2026-01-00','2026','2026-09','2026-09-09T00:00:00Z',new Date('2026-09-09'),null,0])assert.equal(schema.safeParse({...base,scoreReview:{...review('unreviewed'),updatedAt}}).success,false);
});
test('context remains optional, strict and nonblank; no implicit not-applicable or inferred assessment context',()=>{
  const context={compoundFormulation:'Recorded formulation',indication:'Recorded indication',population:'Recorded population',comparator:'Recorded comparator',outcome:'Recorded outcome',timepoint:'Recorded timepoint'};
  assert.deepEqual(parsed({scoreReview:{...review('under-review'),context}}).scoreReview.context,context);
  for(const context of [{outcome:''},{population:'  '},{unknown:'value'},{timepoint:12},null])assert.equal(schema.safeParse({...base,scoreReview:{...review('under-review'),context}}).success,false);
});
for(const status of ['unreviewed','under-review','withheld'])test(`${status} suppresses both score formats with both, either, or neither stored`,async()=>{
  for(const payload of [{scoring,ratings},{scoring},{ratings},{}]){
    const html=await renderCard({...payload,scoreReview:review(status)});noScores(html);
    assert.match(html,new RegExp(`data-score-state="${status}"`));assert.doesNotMatch(html,/Not recorded/);assert.match(html,/not a measured absence of benefit/);assert.match(html,/does not re-review the separately recorded catalogue classification/);
  }
});
test('historical scoring keeps exact numbers, indication and basis caveat; absent context and review stay explicit',async()=>{
  const html=await renderCard({scoring,ratings});const words=textOf(html);
  assert.match(words,/Historical editorial rating/);assert.match(words,/Recorded primary indication:.*Recorded indication/);assert.match(words,/Not recorded in this score record/);assert.match(words,/outcomes depend on population and endpoint/);
  for(const value of [71,72,73,74,75,76,67])assert.ok(words.includes(String(value)));
  assert.doesNotMatch(html,/Historical legacy note/);assert.match(html,/Scored August 2025/);
});
test('historical legacy and neither payload retain migration behavior; no historical rating is fabricated',async()=>{
  const html=await renderCard({ratings});assert.match(textOf(html),/Historical editorial rating/);assert.match(textOf(html),/3.4/);assert.match(textOf(html),/Recorded primary indication:.*Not recorded/);assert.match(html,/Last reviewed September 2025/);
  assert.equal((await renderCard({})).trim(),'');
});
test('community dimension caveat is adjacent and visually subordinate in both numeric formats without changing its value',async()=>{
  for(const payload of [{scoring},{ratings}]){
    const all=nodes(await renderCard(payload));const dimension=all.find(n=>hasClass(n,'community-score'));assert.ok(dimension);
    assert.match(text(dimension),/Community Experience.*Community usage signal; not evidence of efficacy or safety/s);
    const descendants=[];function walk(n){descendants.push(n);for(const c of n.childNodes||[])walk(c);}walk(dimension);
    assert.ok(descendants.some(n=>hasClass(n,'h-1')));assert.ok(descendants.some(n=>(attr(n,'style')||'').includes('background: var(--ink-dim)')));
    assert.ok(text(dimension).includes(payload.scoring?'75/100':'5/5'));
  }
});
test('Not Established and community reported effectiveness remain distinct from editorial status',async()=>{
  const html=await renderCard({scoring:{...scoring,effectiveness:{basis:'not-established'}}});assert.match(html,/Not Established/);assert.match(html,/data-score-state="historical"/);assert.doesNotMatch(html,/Evidence score pending review/);
  const community=await renderCard({scoring:{...scoring,effectiveness:{basis:'community-reported',score:67,confidence:'low'}}});assert.match(community,/community-reported · not clinically demonstrated/);assert.match(community,/Summary of community reports/);
});
test('actual rendering escapes summary and every context field including hostile primary indication',async()=>{
  const hostile='<img src=x onerror="alert(1)"> & <script>alert(2)</script>';
  const context=Object.fromEntries(['compoundFormulation','indication','population','comparator','outcome','timepoint'].map(k=>[k,hostile]));
  const html=await renderCard({scoring,ratings,scoreReview:{...review('withheld'),summary:hostile,context,updatedAt:'2024-02-29'}});noScores(html);
  const all=nodes(html);assert.equal(all.filter(n=>n.tagName==='img'||n.tagName==='script').length,0);assert.equal(all.filter(n=>n.nodeName==='#text'&&n.value===hostile).length,7);assert.ok(all.some(n=>n.tagName==='time'&&attr(n,'datetime')==='2024-02-29'));
  const old=await renderCard({scoring:{...scoring,effectiveness:{...scoring.effectiveness,primaryIndication:hostile}}});assert.equal(nodes(old).filter(n=>n.tagName==='img'||n.tagName==='script').length,0);assert.ok(textOf(old).includes(hostile));
});
test('schema-derived rating props replace any and include review at route and layout mount',()=>{
  for(const file of ['src/components/RatingCard.astro','src/layouts/DossierLayout.astro']){const source=read(file);assert.match(source,/import type \{ Ratings, Scoring, ScoreReview(?:, EvidenceDisplay)? \}/);assert.match(source,/scoreReview\?: ScoreReview/);assert.doesNotMatch(source,/scoring\?: any/);}
  assert.match(read('src/pages/peptides/[slug].astro'),/scoreReview=\{peptide.data.scoreReview\}/);
  assert.match(read('src/layouts/DossierLayout.astro'),/\(scoreReview \|\| scoring \|\| ratings\)/);
});

// Execute the complete current route and layout, with actual RatingCard. Unrelated
// Astro children are slot stubs, collections empty, filesystem reads disabled.
const fsUrl=asModule('export default {existsSync:()=>false};');
const citationUrl=asModule('export const resolveCitation=()=>({});');
const trialUrl=asModule('export const toTrialDisplay=()=>{throw new Error("Unexpected source-pack ingestion")};');
const layoutUrl=await compile(read('src/layouts/DossierLayout.astro'),'DossierLayout.astro',{'../components/RatingCard.astro':cardUrl,'node:fs':fsUrl,'../utils/citation':citationUrl,'../lib/trial-display':trialUrl,'../lib/evidence-binding':asModule('export const loadEvidencePresentation=()=>({selected:false});')});
const routeUrl=await compile(read('src/pages/peptides/[slug].astro'),'peptide-route.astro',{'../../layouts/DossierLayout.astro':layoutUrl});
const Route=(await import(routeUrl)).default;
test('full actual route → layout → card retains schema-parsed status, suppresses fallback and mounts without scores',async()=>{
  for(const payload of [{scoring,ratings},{}]){
    const data=parsed({...payload,scoreReview:review('withheld')});
    const html=await container.renderToString(Route,{props:{peptide:{slug:'fixture',data,render:async()=>({Content:(await import(slotUrl)).default})}},request:new Request('https://www.pepcodex.com/peptides/fixture')});
    const panel=nodes(html).find(n=>attr(n,'data-score-state')==='withheld');assert.ok(panel);assert.match(text(panel),/Evidence score pending review/);
    assert.doesNotMatch(html,/Historical scoring note|Historical legacy note|Evidence Score|Overall Score|Historical editorial rating/);
    assert.ok(nodes(html).some(n=>n.tagName==='span'&&text(n).trim()==='High'),'Separately recorded catalogue classification preserved');
  }
});
