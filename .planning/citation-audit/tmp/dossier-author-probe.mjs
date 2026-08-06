import fs from 'fs'; import path from 'path'; import matter from 'gray-matter';
const dir='src/content/peptides';
const recs=[];
for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.mdx'))){
  const d=matter(fs.readFileSync(path.join(dir,f),'utf8')).data;
  const walk=(n)=>{ if(!n||typeof n!=='object')return;
    if(Array.isArray(n))return n.forEach(walk);
    if(n.pmid&&/^\d{6,9}$/.test(String(n.pmid))&&(n.study||n.finding))
      recs.push({file:f,pmid:String(n.pmid),study:n.study||'',finding:(n.finding||'').slice(0,90)});
    Object.values(n).forEach(walk); };
  walk(d);
}
const ids=[...new Set(recs.map(r=>r.pmid))];
console.log(`dossier keyFinding PMIDs: ${recs.length} records, ${ids.length} unique`);
const meta={};
for(let i=0;i<ids.length;i+=150){
  const b=ids.slice(i,i+150);
  const r=await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${b.join(',')}`);
  const j=(await r.json()).result||{};
  for(const id of (j.uids||[])) if(j[id]&&!j[id].error)
    meta[id]={title:j[id].title||'',year:(j[id].pubdate||'').slice(0,4),
              a1:((j[id].authors||[])[0]||{}).name||'',authors:(j[id].authors||[]).map(a=>a.name).join('; ')};
  await new Promise(z=>setTimeout(z,400));
}
let ok=0,dead=0; const bad=[];
for(const r of recs){
  const m=meta[r.pmid]; if(!m){dead++;continue;}
  // stored "Sorli C et al. 2017 (SUSTAIN 1)" -> surname = first token
  const surname=(r.study.match(/^([A-Z][a-zA-Z\-']+)/)||[])[1]||'';
  const yr=(r.study.match(/\b(19|20)\d{2}\b/)||[])[0]||'';
  const realSur=(m.a1.split(' ')[0]||'');
  const authOk = surname && m.authors.toLowerCase().includes(surname.toLowerCase());
  const yearOk = !yr || !m.year || Math.abs(+yr - +m.year)<=1;
  if((surname&&!authOk)||!yearOk) bad.push({...r,realTitle:m.title,realFirst:m.a1,realYear:m.year,authOk,yearOk});
  else ok++;
}
console.log(`\nRESULT  ok=${ok}  suspect=${bad.length}  dead=${dead}`);
const pf={}; for(const b of bad) pf[b.file]=(pf[b.file]||0)+1;
console.log('\nsuspect per dossier (top 20):');
Object.entries(pf).sort((a,b)=>b[1]-a[1]).slice(0,20).forEach(([k,v])=>console.log(String(v).padStart(4),k));
console.log('\n--- 10 examples ---');
for(const b of bad.slice(0,10)) console.log(`\n${b.file} PMID ${b.pmid} authOk=${b.authOk} yearOk=${b.yearOk}\n  STORED study: ${b.study}\n  REAL : ${b.realFirst} (${b.realYear}) — ${b.realTitle.slice(0,100)}`);
fs.writeFileSync('.planning/citation-audit/dossier-author-suspects.json',JSON.stringify(bad,null,2));
