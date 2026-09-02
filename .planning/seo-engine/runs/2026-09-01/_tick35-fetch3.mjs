await new Promise((r) => setTimeout(r, 1500));
const res = await fetch(
  'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=33567185&rettype=abstract&retmode=xml',
  { headers: { 'User-Agent': 'pepcodex-tick35/1.0' } },
);
console.log('STATUS', res.status);
const xml = await res.text();
const parts = [...xml.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)];
const abs = parts
  .map((p) => {
    const label = (p[1].match(/Label="([^"]+)"/) || [])[1];
    const body = p[2].replace(/<[^>]+>/g, '');
    return label ? `${label}: ${body}` : body;
  })
  .join('\n');
console.log(abs.slice(0, 1800));
console.log('---N---');
console.log((abs.match(/1961|random|enrolled|participants/gi) || []).slice(0, 20).join(','));

const ncts = ['NCT05607680', 'NCT06164873', 'NCT06124807', 'NCT03548935', 'NCT03574597'];
for (const nct of ncts) {
  await new Promise((r) => setTimeout(r, 300));
  const r2 = await fetch(`https://clinicaltrials.gov/api/v2/studies/${nct}`, {
    headers: { 'User-Agent': 'pepcodex-tick35/1.0' },
  });
  const j = await r2.json();
  const des = j.protocolSection?.designModule || {};
  const st = j.protocolSection?.statusModule || {};
  console.log(
    nct,
    'STATUS',
    r2.status,
    'enrollDesign',
    JSON.stringify(des.enrollmentInfo),
    'enrollStatus',
    JSON.stringify(st.enrollmentInfo),
    'hasResults',
    j.hasResults,
    'overall',
    st.overallStatus,
  );
}
