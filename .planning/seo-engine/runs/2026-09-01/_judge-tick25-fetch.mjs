// Independent Quality Judge re-fetch for L4-TICK25. Run date 2026-09-02.
// Fetches PubMed efetch abstracts + CT.gov v2 records for every identifier
// quoted on src/content/comparisons/retatrutide-vs-survodutide.mdx.
// Does not read the implementer's fetch artifacts.

const PMIDS = ['37366315', '42253238', '38847460', '42252333', '38330987', '41090431'];
const NCTS = ['NCT06309992', 'NCT06632457', 'NCT06066515', 'NCT04881760', 'NCT04667377', 'NCT04771273'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function efetch(pmid) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmid}&rettype=abstract&retmode=text`;
  const res = await fetch(url);
  const text = await res.text();
  return { pmid, status: res.status, text };
}

async function ctgov(nct) {
  const url = `https://clinicaltrials.gov/api/v2/studies/${nct}?fields=protocolSection.identificationModule,protocolSection.statusModule,protocolSection.designModule,hasResults`;
  const res = await fetch(url);
  const json = res.status === 200 ? await res.json() : null;
  return { nct, status: res.status, json };
}

const out = { runDate: '2026-09-02', pubmed: [], ctgov: [] };

for (const pmid of PMIDS) {
  const r = await efetch(pmid);
  out.pubmed.push(r);
  console.log(`\n===== PMID ${pmid} (HTTP ${r.status}) =====`);
  console.log(r.text.slice(0, 3500));
  await sleep(400);
}

for (const nct of NCTS) {
  const r = await ctgov(nct);
  const p = r.json?.protocolSection;
  const brief = p
    ? {
        nctId: p.identificationModule?.nctId,
        briefTitle: p.identificationModule?.briefTitle,
        officialTitle: p.identificationModule?.officialTitle,
        overallStatus: p.statusModule?.overallStatus,
        enrollment: p.designModule?.enrollmentInfo,
        hasResults: r.json?.hasResults,
      }
    : null;
  out.ctgov.push({ nct, status: r.status, brief });
  console.log(`\n===== CT.gov ${nct} (HTTP ${r.status}) =====`);
  console.log(JSON.stringify(brief, null, 2));
  await sleep(400);
}

import { writeFileSync } from 'node:fs';
writeFileSync(new URL('./_judge-tick25-fetch.json', import.meta.url), JSON.stringify(out, null, 2));
console.log('\nWROTE _judge-tick25-fetch.json');
