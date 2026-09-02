// Judge independent re-fetch for L4-TICK21 (2026-09-02). Written by Judge, not Implementer.
const pmids = ['41237796', '39002641', '41113119', '35658024', '37385275'];
const ncts = ['NCT05989711', 'NCT05006885', 'NCT05292911', 'NCT04184622', 'NCT04657003', 'NCT05295875'];

const get = async (url) => {
  const r = await fetch(url, { headers: { 'User-Agent': 'pepcodex-judge/1.0' } });
  return { status: r.status, body: await r.text() };
};

const out = { fetchedAt: new Date().toISOString(), esummary: {}, efetch: {}, esearch: {}, ctgov: {} };

// 1. esummary titles
const sum = await get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=json`);
out.esummary.status = sum.status;
try {
  const j = JSON.parse(sum.body);
  for (const id of pmids) {
    const rec = j.result?.[id];
    out.esummary[id] = rec ? { title: rec.title, pubdate: rec.pubdate, source: rec.source } : 'MISSING';
  }
} catch (e) { out.esummary.parseError = String(e); }

await new Promise(r => setTimeout(r, 400));

// 2. efetch abstracts for IMPACT + SURMOUNT-1 (number verification)
for (const id of ['41237796', '35658024']) {
  const f = await get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${id}&rettype=abstract&retmode=text`);
  out.efetch[id] = { status: f.status, text: f.body };
  await new Promise(r => setTimeout(r, 400));
}

// 3. esearch pemvidutide AND MOMENTUM
const s = await get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=pemvidutide%20AND%20MOMENTUM&retmode=json');
try { out.esearch['pemvidutide AND MOMENTUM'] = { status: s.status, count: JSON.parse(s.body).esearchresult?.count }; }
catch (e) { out.esearch['pemvidutide AND MOMENTUM'] = { status: s.status, parseError: String(e) }; }

await new Promise(r => setTimeout(r, 400));

// 4. CT.gov v2 records
for (const nct of ncts) {
  const c = await get(`https://clinicaltrials.gov/api/v2/studies/${nct}`);
  if (c.status === 200) {
    try {
      const j = JSON.parse(c.body);
      const p = j.protocolSection || {};
      out.ctgov[nct] = {
        status: c.status,
        hasResults: j.hasResults,
        title: p.identificationModule?.briefTitle,
        acronym: p.identificationModule?.acronym,
        phase: p.designModule?.phases,
        enrollment: p.designModule?.enrollmentInfo,
        overallStatus: p.statusModule?.overallStatus,
        primaryCompletion: p.statusModule?.primaryCompletionDateStruct,
        interventions: (p.armsInterventionsModule?.interventions || []).map(i => i.name),
      };
    } catch (e) { out.ctgov[nct] = { status: c.status, parseError: String(e) }; }
  } else {
    out.ctgov[nct] = { status: c.status };
  }
  await new Promise(r => setTimeout(r, 300));
}

console.log(JSON.stringify(out, null, 2));
