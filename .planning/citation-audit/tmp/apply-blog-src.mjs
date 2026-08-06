import fs from 'fs'; import path from 'path'; import matter from 'gray-matter';
const APPLY=process.argv.includes('--apply');
const res=JSON.parse(fs.readFileSync('.planning/citation-audit/blog-source-resolution.json','utf8'));
const byFile={}; for(const r of res.filter(x=>x.verdict==='RESOLVED')) (byFile[r.file]??=[]).push(r);
let n=0;
for(const [f,items] of Object.entries(byFile)){
  const p=path.join('src/content/blog',f);
  let raw=fs.readFileSync(p,'utf8'); const fm=matter(raw);
  let changed=false;
  for(const it of items){
    const s=fm.data.sources?.[it.index]; if(!s) continue;
    const m=it.match;
    if(m.kind==='pmid'){ s.url=`https://pubmed.ncbi.nlm.nih.gov/${m.id}/`; if(m.doi) s.doi=m.doi; }
    else if(m.kind==='doi'){ s.url=`https://doi.org/${m.id}`; s.doi=m.id; }
    else if(m.kind==='nct'){ s.url=`https://clinicaltrials.gov/study/${m.id}`; s.nctId=m.id; }
    s.verifiedAt='2026-07-24';
    changed=true; n++;
  }
  if(changed&&APPLY) fs.writeFileSync(p, matter.stringify(fm.content, fm.data));
}
console.log(`${APPLY?'APPLIED':'DRY RUN'} — attached verified identifiers to ${n} blog source entries across ${Object.keys(byFile).length} posts`);
