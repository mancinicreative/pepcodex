/** JUDGE fetch 2: CT.gov detail fields (primaryCompletionDateStruct, acronym, officialTitle, design time frames, eligibility). */
const UA = { 'User-Agent': 'PepCodex-judge/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ctgov(nct) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30000);
  try {
    const r = await fetch(`https://clinicaltrials.gov/api/v2/studies/${nct}`, { headers: UA, signal: ctrl.signal });
    if (!r.ok) return { nct, error: `HTTP ${r.status}` };
    const j = await r.json();
    const p = j.protocolSection || {};
    const id = p.identificationModule || {};
    const st = p.statusModule || {};
    const de = p.designModule || {};
    const el = p.eligibilityModule || {};
    const outcomes = (p.outcomesModule?.primaryOutcomes || []).map((o) => ({ measure: o.measure, timeFrame: o.timeFrame }));
    return {
      nct,
      briefTitle: id.briefTitle,
      officialTitle: id.officialTitle,
      acronym: id.acronym || null,
      overallStatus: st.overallStatus,
      startDate: st.startDateStruct,
      primaryCompletionDateStruct: st.primaryCompletionDateStruct,
      completionDateStruct: st.completionDateStruct,
      enrollment: de.enrollmentInfo,
      hasResults: j.hasResults,
      phases: de.phases,
      studyType: de.studyType,
      primaryOutcomes: outcomes,
      healthyVolunteers: el.healthyVolunteers,
      eligibilityCriteria: (el.eligibilityCriteria || '').slice(0, 900),
      briefSummary: (p.descriptionModule?.briefSummary || '').slice(0, 900),
    };
  } finally { clearTimeout(t); }
}

const out = {};
for (const nct of ['NCT06068946', 'NCT05203237', 'NCT06828055', 'NCT07104500', 'NCT07104383']) {
  out[nct] = await ctgov(nct);
  console.log(`\n===== ${nct} =====`);
  console.log(JSON.stringify(out[nct], null, 2));
  await sleep(400);
}
import { writeFileSync } from 'node:fs';
writeFileSync(new URL('./_judge-tick33-fetch2.json', import.meta.url), JSON.stringify(out, null, 2));
console.log('\nWROTE _judge-tick33-fetch2.json');
