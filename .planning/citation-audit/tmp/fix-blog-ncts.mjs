import fs from 'fs'; import path from 'path'; import matter from 'gray-matter';
const APPLY=process.argv.includes('--apply');
const MA=JSON.parse(fs.readFileSync('data/trial-match-aliases.json','utf8'));
const audit=JSON.parse(fs.readFileSync('.planning/citation-audit/attached-identifier-audit.json','utf8'));
const targets=audit.filter(r=>r.verdict!=='OK'&&r.nct);
const UA={'User-Agent':'PepCodex-blognct/1.0 (mailto:admin@pepcodex.com)'};
let fixed=0,strip=0;
const byFile={}; for(const t of targets)(byFile[t.file]??=[]).push(t);
for(const [file,items] of Object.entries(byFile)){
  const p=path.join('src/content/blog',file); if(!fs.existsSync(p))continue;
  const fm=matter(fs.readFileSync(p,'utf8'));
  const peps=(fm.data.relatedPeptides||[]);
  // Drug names also come from the post SLUG and TITLE, not just relatedPeptides. Deriving them
  // only from relatedPeptides nearly stripped NCT05869903 (genuinely orforglipron) and
  // NCT04561245 (genuinely pemvidutide, registered under its ALT-801 code) — the posts simply
  // did not list those peptides in frontmatter. A thin alias list destroys correct data.
  const fromName=[...file.replace(/.mdx?$/,'').split('-'), ...String(fm.data.title||'').split(/[^A-Za-z0-9]+/)]
    .map(x=>x.toLowerCase()).filter(x=>x.length>=6);
  const aliases=[...new Set([...peps.flatMap(s=>[s.replace(/-/g,' '),...(MA[s]||[])]), ...fromName])].map(x=>x.toLowerCase());
  for(const it of items){
    const r=await fetch(`https://clinicaltrials.gov/api/v2/studies?filter.ids=${it.nct}&fields=NCTId,BriefTitle,OfficialTitle,InterventionName`,{headers:UA});
    const st=r.ok?((await r.json()).studies||[])[0]:null;
    await new Promise(z=>setTimeout(z,320));
    const s=fm.data.sources?.[it.index]; if(!s)continue;
    if(!st){ delete s.nctId; delete s.url; s.verified=false; s.note='NCT does not exist; removed as fabricated.'; strip++; continue; }
    const ps=st.protocolSection, idm=ps.identificationModule;
    const hay=(idm.briefTitle+' '+(idm.officialTitle||'')+' '+(ps.armsInterventionsModule?.interventions||[]).map(x=>x.name).join(' ')).toLowerCase();
    const drugOk=aliases.some(a=>a.length>=4&&hay.includes(a));
    if(drugOk){ s.title=idm.briefTitle; s.url='https://clinicaltrials.gov/study/'+it.nct; s.nctId=it.nct; s.verifiedAt='2026-07-25'; fixed++;
      console.log(`  KEEP  ${file} ${it.nct} -> "${idm.briefTitle.slice(0,60)}"`); }
    else { delete s.nctId; if(s.url&&/clinicaltrials/i.test(s.url))delete s.url; s.verified=false;
      s.note=`Stored NCT ${it.nct} registers a different study ("${idm.briefTitle.slice(0,70)}"); removed as unverifiable.`; strip++;
      console.log(`  STRIP ${file} ${it.nct} is actually "${idm.briefTitle.slice(0,55)}"`); }
  }
  if(APPLY) fs.writeFileSync(p, matter.stringify(fm.content, fm.data));
}
console.log(`\n${APPLY?'APPLIED':'DRY RUN'} — relabelled from registry ${fixed} · stripped wrong-drug/nonexistent ${strip}`);
