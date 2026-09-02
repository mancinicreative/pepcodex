// JUDGE independent re-fetch for L4-TICK24 — 2026-09-02
// Verifies: PMID 41237796 (IMPACT), 33567185 (STEP 1), 37952131 (SELECT),
//           39002641 (MASLD 12wk), 41113119 (MASLD 24wk ext)
//           NCT05295875 (MOMENTUM hasResults), plus page-cited NCTs resolve.
const PMIDS = ['41237796', '33567185', '37952131', '39002641', '41113119'];
const NCTS = ['NCT05295875', 'NCT05989711', 'NCT05006885', 'NCT05292911', 'NCT03548935', 'NCT03574597'];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'pepcodex-judge/1.0' } });
  return { status: res.status, text: await res.text() };
}

for (const pmid of PMIDS) {
  const s = await getJson(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json`);
  console.log(`\n===== PMID ${pmid} esummary STATUS ${s.status} =====`);
  try {
    const j = JSON.parse(s.text);
    const r = j.result[pmid];
    console.log('TITLE:', r.title);
    console.log('JOURNAL:', r.fulljournalname, '| PUBDATE:', r.pubdate);
  } catch { console.log('PARSE FAIL', s.text.slice(0, 300)); }
  await sleep(400);
  const f = await getJson(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmid}&rettype=abstract&retmode=text`);
  console.log(`----- PMID ${pmid} efetch STATUS ${f.status} -----`);
  console.log(f.text.slice(0, 4500));
  await sleep(400);
}

for (const nct of NCTS) {
  const r = await getJson(`https://clinicaltrials.gov/api/v2/studies/${nct}`);
  console.log(`\n===== ${nct} CT.gov STATUS ${r.status} =====`);
  try {
    const j = JSON.parse(r.text);
    const p = j.protocolSection;
    console.log('TITLE:', p.identificationModule.briefTitle);
    console.log('STATUS:', p.statusModule.overallStatus, '| ENROLL:', p.designModule?.enrollmentInfo?.count, p.designModule?.enrollmentInfo?.type);
    console.log('PHASES:', JSON.stringify(p.designModule?.phases));
    console.log('hasResults:', j.hasResults);
    const ints = (p.armsInterventionsModule?.interventions || []).map(i => i.name).join('; ');
    console.log('INTERVENTIONS:', ints);
  } catch { console.log('PARSE FAIL', r.text.slice(0, 300)); }
  await sleep(400);
}
