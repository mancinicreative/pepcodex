/**
 * TICK38 fetch2: retry failed NCBI/openFDA; enrollment; leftover abstracts.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, label) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'pepcodex-tick38/1.0 (integrity; mailto:unused)' },
    });
    const text = await res.text();
    console.log(`STATUS ${res.status} ${label} ${Date.now() - t0}ms`);
    return { status: res.status, text };
  } catch (err) {
    console.log(`FAIL ${label} ${err.message}`);
    return { status: 0, text: String(err) };
  }
}

const aliases = [
  'maridebart cafraglutide',
  'maridebart',
  'MariTide',
  'AMG 133',
  'MARITIME-1',
  'MARITIME-2',
];

console.log('=== NCBI esearch retry (title) ===');
for (const a of aliases) {
  const q = encodeURIComponent(`"${a}"[Title]`);
  const { status, text } = await get(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${q}&retmode=json&retmax=8`,
    `esearch ${a}`,
  );
  if (status === 200) {
    const j = JSON.parse(text);
    console.log(`COUNT "${a}" = ${j.esearchresult?.count} ids=${(j.esearchresult?.idlist || []).join(',')}`);
  } else {
    console.log(`BODY ${a}: ${text.slice(0, 200)}`);
  }
  await sleep(500);
}

console.log('\n=== NCBI esearch NCT retry ===');
for (const term of ['NCT06858839', 'NCT06858878', 'NCT05669599', 'NCT04478708']) {
  const { status, text } = await get(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${term}&retmode=json&retmax=5`,
    `esearch ${term}`,
  );
  if (status === 200) {
    const j = JSON.parse(text);
    console.log(`COUNT ${term} = ${j.esearchresult?.count} ids=${(j.esearchresult?.idlist || []).join(',')}`);
  } else {
    console.log(`BODY ${term}: ${text.slice(0, 200)}`);
  }
  await sleep(500);
}

console.log('\n=== SELECT + STEP-1 remainder abstracts ===');
for (const id of ['37952131', '33567185']) {
  const { status, text } = await get(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${id}&rettype=abstract&retmode=xml`,
    `efetch ${id}`,
  );
  if (status === 200) {
    const parts = [...text.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)];
    const abs = parts
      .map((p) => {
        const label = (p[1].match(/Label="([^"]+)"/) || [])[1];
        const body = p[2].replace(/<[^>]+>/g, '');
        return label ? `${label}: ${body}` : body;
      })
      .join('\n');
    console.log(`\n===== PMID ${id} =====\n${abs}\n---`);
  }
  await sleep(400);
}

console.log('\n=== CT.gov enrollment (full status module) ===');
for (const nct of ['NCT05669599', 'NCT04478708', 'NCT06858839', 'NCT06858878', 'NCT03548935', 'NCT03574597']) {
  const { status, text } = await get(
    `https://clinicaltrials.gov/api/v2/studies/${nct}`,
    `ctfull ${nct}`,
  );
  if (status === 200) {
    const j = JSON.parse(text);
    const st = j.protocolSection?.statusModule || {};
    const idm = j.protocolSection?.identificationModule || {};
    const des = j.protocolSection?.designModule || {};
    const prim = (j.protocolSection?.outcomesModule?.primaryOutcomes || [])
      .slice(0, 2)
      .map((o) => o.measure)
      .join(' | ');
    console.log(
      `CT ${nct} acronym=${idm.acronym} status=${st.overallStatus} enrollType=${st.enrollmentInfo?.type} enrollCount=${st.enrollmentInfo?.count} hasResults=${j.hasResults} phase=${JSON.stringify(des.phases)} primary=${prim} primaryComp=${st.primaryCompletionDateStruct?.date}`,
    );
  } else {
    console.log(`BODY ${nct}: ${text.slice(0, 250)}`);
  }
  await sleep(300);
}

console.log('\n=== openFDA maridebart retry ===');
for (const q of [
  'openfda.generic_name:maridebart',
  'openfda.substance_name:maridebart',
  'openfda.brand_name:MARITIDE',
]) {
  const { status, text } = await get(
    `https://api.fda.gov/drug/drugsfda.json?search=${encodeURIComponent(q)}&limit=3`,
    `fda ${q}`,
  );
  console.log(`FDA ${q} STATUS ${status} BODY ${text.slice(0, 180)}`);
  await sleep(300);
}

console.log('\nDONE TICK38 fetch2');
