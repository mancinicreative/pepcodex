/**
 * JUDGE independent re-fetch for L4-TICK33 (vk2735-vs-semaglutide.mdx).
 * Run date: 2026-09-02. Judge did not write the increment; this script is the independent check.
 * NCBI eutils + CT.gov v2. Per-alias esearch only (no OR-joins).
 */
const UA = { 'User-Agent': 'PepCodex-judge/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

async function fetchT(url, ms = 30000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: UA, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

async function efetch(pmid) {
  const r = await fetchT(`${EUTILS}/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${pmid}`);
  if (!r.ok) return { pmid, error: `HTTP ${r.status}` };
  const xml = await r.text();
  const title = ((xml.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || '').replace(/<[^>]+>/g, '').trim();
  const blob = xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  return { pmid, status: r.status, title, blob };
}

async function esearchCount(term) {
  const r = await fetchT(`${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=0&term=${encodeURIComponent(term)}`);
  if (!r.ok) return { term, error: `HTTP ${r.status}` };
  const j = await r.json();
  return { term, count: Number(j.esearchresult?.count ?? 0) };
}

async function ctgov(nct) {
  const r = await fetchT(`https://clinicaltrials.gov/api/v2/studies/${nct}`);
  if (!r.ok) return { nct, error: `HTTP ${r.status}` };
  const j = await r.json();
  const p = j.protocolSection || {};
  const id = p.identificationModule || {};
  const st = p.statusModule || {};
  const de = p.designModule || {};
  return {
    nct,
    status: r.status,
    title: id.briefTitle,
    overallStatus: st.overallStatus,
    startDate: st.startDateStruct?.date,
    startType: st.startDateStruct?.type,
    primaryCompletion: st.completionDateStruct?.date,
    primaryCompletionType: st.completionDateStruct?.type,
    enrollment: de.enrollmentInfo?.count,
    enrollmentType: de.enrollmentInfo?.type,
    hasResults: j.hasResults,
    phases: de.phases,
  };
}

const out = { runDate: '2026-09-02', pmids: {}, searches: [], ctgov: {} };

for (const pmid of ['41508550', '33567185', '37952131', '37385278']) {
  out.pmids[pmid] = await efetch(pmid);
  console.log(`\n===== PMID ${pmid} =====`);
  console.log('TITLE:', out.pmids[pmid].title);
  console.log('BLOB:', (out.pmids[pmid].blob || out.pmids[pmid].error || '').slice(0, 4500));
  await sleep(400);
}

for (const term of ['"VK2735"', '"VK-2735"', 'NCT05203237', 'NCT06828055', 'NCT07104500', 'NCT07104383', 'NCT06068946']) {
  const res = await esearchCount(term);
  out.searches.push(res);
  console.log(`\nESEARCH ${term} => ${res.count ?? res.error}`);
  await sleep(400);
}

for (const nct of ['NCT06068946', 'NCT05203237', 'NCT06828055', 'NCT07104500', 'NCT07104383']) {
  out.ctgov[nct] = await ctgov(nct);
  console.log(`\n===== CT.gov ${nct} =====`);
  console.log(JSON.stringify(out.ctgov[nct], null, 2));
  await sleep(400);
}

import { writeFileSync } from 'node:fs';
writeFileSync(new URL('./_judge-tick33-fetch.json', import.meta.url), JSON.stringify(out, null, 2));
console.log('\nWROTE _judge-tick33-fetch.json');
