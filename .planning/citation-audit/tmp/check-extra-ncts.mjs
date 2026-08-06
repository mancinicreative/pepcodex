import fs from 'fs';
const MA=JSON.parse(fs.readFileSync('data/trial-match-aliases.json','utf8'));
const recs=[];
for(const f of fs.readdirSync('data/source-packs').filter(x=>x.endsWith('.json'))){
  const slug=f.replace(/\.json$/,'');
  const j=JSON.parse(fs.readFileSync('data/source-packs/'+f,'utf8'));
  (function w(o,p){ if(!o||typeof o!=='object')return; if(Array.isArray(o))return o.forEach((x,i)=>w(x,p+'['+i+']'));
    const nct=o.nctId||o.nct||(typeof o.id==='string'&&/^NCT\d{8}$/i.test(o.id)?o.id:null);
    if(nct&&!p.startsWith('.trials'))recs.push({slug,file:'data/source-packs/'+f,jsonPath:p,nctId:String(nct).toUpperCase(),title:o.title||''});
    Object.entries(o).forEach(([k,v])=>w(v,p+'.'+k));})(j,'');
}
const ids=[...new Set(recs.map(r=>r.nctId))];
const gt={};
for(let i=0;i<ids.length;i+=50){
  const r=await fetch(`https://clinicaltrials.gov/api/v2/studies?filter.ids=${ids.slice(i,i+50).join(',')}&fields=NCTId,BriefTitle,OfficialTitle,Acronym,InterventionName&pageSize=100`);
  for(const st of ((await r.json()).studies||[])){const idm=st.protocolSection.identificationModule;
    gt[idm.nctId.toUpperCase()]={brief:idm.briefTitle||'',official:idm.officialTitle||'',acronym:idm.acronym||'',
      intr:(st.protocolSection.armsInterventionsModule?.interventions||[]).map(x=>x.name||'')};}
  await new Promise(z=>setTimeout(z,300));
}
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]+/g,' ').split(/\s+/).filter(w=>w.length>3);
const sim=(a,b)=>{const A=new Set(norm(a)),B=new Set(norm(b));if(!A.size||!B.size)return 0;let i=0;for(const w of A)if(B.has(w))i++;return i/Math.min(A.size,B.size);};
let ok=0;const bad=[];
for(const r of recs){
  const g=gt[r.nctId];
  if(!g){bad.push({...r,why:'DOES NOT EXIST'});continue;}
  const al=[r.slug.replace(/-/g,' '),...(MA[r.slug]||[])].map(s=>s.toLowerCase());
  const hay=(g.brief+' '+g.official+' '+g.acronym+' '+g.intr.join(' ')).toLowerCase();
  const drug=al.some(a=>hay.includes(a));
  const t=Math.max(sim(r.title,g.brief),sim(r.title,g.official));
  if(drug&&(t>=0.45||!r.title))ok++; else bad.push({...r,why:drug?'title mismatch':'WRONG DRUG',real:g.brief,intr:g.intr.join(', ')});
}
console.log(`extra NCT records: ${recs.length} | ok ${ok} | bad ${bad.length}`);
for(const b of bad) console.log(`\n[${b.slug}] ${b.nctId} ${b.why}\n  path: ${b.jsonPath}\n  STORED: ${String(b.title).slice(0,80)}\n  REAL  : ${String(b.real||'').slice(0,80)} [${String(b.intr||'').slice(0,55)}]`);
fs.writeFileSync('.planning/citation-audit/extra-nct-findings.json',JSON.stringify(bad,null,2));
