import fs from 'fs'; import path from 'path';
const dir='data/source-packs';
const recs=[];
for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.json'))){
  const j=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
  for(const s of (j.sources||[])) if(s.pmid&&/^\d{6,9}$/.test(String(s.pmid)))
    recs.push({file:f,pmid:String(s.pmid),title:s.title||'',journal:s.journal||'',year:s.year||''});
}
const ids=[...new Set(recs.map(r=>r.pmid))];
console.log(`pack PMIDs: ${recs.length} records, ${ids.length} unique`);
const meta={};
for(let i=0;i<ids.length;i+=150){
  const b=ids.slice(i,i+150);
  const r=await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${b.join(',')}`);
  const j=(await r.json()).result||{};
  for(const id of (j.uids||[])) if(j[id]&&!j[id].error) meta[id]={title:j[id].title||'',journal:j[id].fulljournalname||j[id].source||'',year:(j[id].pubdate||'').slice(0,4)};
  await new Promise(z=>setTimeout(z,400));
}
const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9 ]+/g,' ').split(/\s+/).filter(w=>w.length>3);
const sim=(a,b)=>{const A=new Set(norm(a)),B=new Set(norm(b));if(!A.size||!B.size)return 0;let i=0;for(const w of A)if(B.has(w))i++;return i/Math.min(A.size,B.size);};
let dead=0,mism=[],ok=0;
for(const r of recs){
  const m=meta[r.pmid];
  if(!m){dead++;continue;}
  const s=sim(r.title,m.title);
  if(s<0.45) mism.push({...r,realTitle:m.title,realJournal:m.journal,realYear:m.year,sim:s.toFixed(2)});
  else ok++;
}
console.log(`\nRESULT  ok=${ok}  titleMismatch=${mism.length}  deadPMID=${dead}`);
const perFile={}; for(const m of mism) perFile[m.file]=(perFile[m.file]||0)+1;
console.log('\nmismatches per pack:');
Object.entries(perFile).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log(String(v).padStart(4),k));
console.log('\n--- first 15 examples ---');
for(const m of mism.slice(0,15)) console.log(`\nPMID ${m.pmid} (${m.file}) sim=${m.sim}\n  STORED: ${m.title}\n          [${m.journal} ${m.year}]\n  REAL  : ${m.realTitle}\n          [${m.realJournal} ${m.realYear}]`);
fs.writeFileSync('.planning/citation-audit/pmid-title-mismatches.json',JSON.stringify(mism,null,2));
