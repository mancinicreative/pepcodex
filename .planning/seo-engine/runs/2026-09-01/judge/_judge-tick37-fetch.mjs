/* Independent Judge fetch for L4-TICK37. esummary + efetch per PMID, CT.gov v2 full study, openFDA drugsfda. */
import { writeFileSync } from 'node:fs';
const UA = { 'User-Agent': 'PepCodex-judge/1.0 (mailto:admin@pepcodex.com)' };
const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = '.planning/seo-engine/runs/2026-09-01/judge';

async function get(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30000);
  try {
    const r = await fetch(url, { headers: UA, signal: ctrl.signal });
    return { status: r.status, body: await r.text() };
  } finally { clearTimeout(t); }
}

// 1) PMIDs
for (const pmid of ['40544433', '33567185']) {
  const s = await get(`${EUTILS}/esummary.fcgi?db=pubmed&retmode=json&id=${pmid}`);
  let title = '(esummary parse failed)';
  try { title = JSON.parse(s.body).result?.[pmid]?.title ?? '(missing)'; } catch {}
  console.log(`\n===== PMID ${pmid} | esummary STATUS ${s.status} =====`);
  console.log(`TITLE: ${title}`);
  await sleep(500);

  const f = await get(`${EUTILS}/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${pmid}`);
  console.log(`efetch STATUS ${f.status}`);
  writeFileSync(`${OUT}/_tick37-efetch-${pmid}.xml`, f.body);
  const m = f.body.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g) || [];
  const abs = m.map((x) => x.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).join(' ');
  console.log(`ABSTRACT: ${abs.slice(0, 5000)}`);
  await sleep(500);
}

// 2) PubMed searches the page claims returned 0 (dated 2026-09-02)
for (const term of ['NCT06131437', '"REDEFINE 4" AND cagrilintide AND tirzepatide', '"REDEFINE-4" AND cagrilintide']) {
  const r = await get(`${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&term=${encodeURIComponent(term)}`);
  let count = '(parse failed)';
  try { count = JSON.parse(r.body).esearchresult?.count ?? '(missing)'; } catch {}
  console.log(`\nESEARCH [${term}] STATUS ${r.status} COUNT ${count}`);
  await sleep(500);
}

// 3) CT.gov v2 full study NCT06131437
const ct = await get('https://clinicaltrials.gov/api/v2/studies/NCT06131437');
console.log(`\n===== CT.gov NCT06131437 STATUS ${ct.status} =====`);
writeFileSync(`${OUT}/_tick37-NCT06131437.json`, ct.body);
try {
  const j = JSON.parse(ct.body);
  const p = j.protocolSection;
  console.log(`TITLE: ${p?.identificationModule?.briefTitle}`);
  console.log(`ACRONYM: ${p?.identificationModule?.acronym ?? '(empty)'}`);
  console.log(`STATUS: ${p?.statusModule?.overallStatus}`);
  console.log(`ENROLLMENT: ${p?.designModule?.enrollmentInfo?.count} (${p?.designModule?.enrollmentInfo?.type})`);
  console.log(`PHASES: ${JSON.stringify(p?.designModule?.phases)}`);
  console.log(`MASKING: ${JSON.stringify(p?.designModule?.designInfo?.maskingInfo)}`);
  console.log(`ALLOCATION: ${p?.designModule?.designInfo?.allocation}; MODEL: ${p?.designModule?.designInfo?.interventionModel}`);
  console.log(`ARMS: ${JSON.stringify((p?.armsInterventionsModule?.armGroups || []).map(a => a.label))}`);
  console.log(`PRIMARY: ${JSON.stringify((p?.outcomesModule?.primaryOutcomes || []).map(o => ({ m: o.measure, f: o.timeFrame, d: (o.description || '').slice(0, 300) })))}`);
  console.log(`hasResults: ${j.hasResults}`);
} catch (e) { console.log('CT.gov parse error: ' + e.message); }
await sleep(500);

// 4) openFDA drugsfda: cagrilintide (expect no match) + semaglutide brand queries
const fdaQueries = {
  cagrilintide_generic: 'https://api.fda.gov/drug/drugsfda.json?search=products.active_ingredients.name:%22cagrilintide%22',
  cagrilintide_brand: 'https://api.fda.gov/drug/drugsfda.json?search=products.brand_name:%22cagrisema%22',
  ozempic: 'https://api.fda.gov/drug/drugsfda.json?search=products.brand_name:%22OZEMPIC%22',
  rybelsus: 'https://api.fda.gov/drug/drugsfda.json?search=products.brand_name:%22RYBELSUS%22',
  wegovy: 'https://api.fda.gov/drug/drugsfda.json?search=products.brand_name:%22WEGOVY%22',
};
const fdaOut = {};
for (const [k, url] of Object.entries(fdaQueries)) {
  const r = await get(url);
  console.log(`\nopenFDA [${k}] STATUS ${r.status}`);
  fdaOut[k] = { status: r.status };
  if (r.status === 200) {
    try {
      const j = JSON.parse(r.body);
      const apps = (j.results || []).map(x => ({ app: x.application_number, sponsor: x.sponsor_name, brands: (x.products || []).map(p => p.brand_name) }));
      console.log(JSON.stringify(apps, null, 1).slice(0, 1500));
      fdaOut[k].apps = apps;
    } catch (e) { console.log('parse error ' + e.message); }
  } else {
    console.log(r.body.slice(0, 200));
  }
  await sleep(500);
}
writeFileSync(`${OUT}/_tick37-openfda.json`, JSON.stringify(fdaOut, null, 2));
console.log('\nDONE');
