const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  return { status: r.status, text: await r.text() };
}

const terms = [
  '"pemvidutide" AND MOMENTUM',
  '"pemvidutide" AND obesity AND "48"',
  '"ALT-801" AND obesity',
  '"pemvidutide"[Title] AND (obesity[Title] OR weight[Title])',
];
for (const term of terms) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=10&term=${encodeURIComponent(term)}`;
  const { status, text } = await get(url);
  const j = JSON.parse(text);
  console.log("ESEARCH", term, "STATUS", status, "count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  await sleep(400);
}

const ncts = ["NCT05006885"];
for (const nct of ncts) {
  const url = `https://clinicaltrials.gov/api/v2/studies/${nct}`;
  const { status, text } = await get(url);
  const j = JSON.parse(text);
  const proto = j.protocolSection || {};
  console.log(
    "CT.GOV",
    nct,
    status,
    JSON.stringify(
      {
        title: proto.identificationModule?.briefTitle,
        status: proto.statusModule?.overallStatus,
        hasResults: j.hasResults,
        phase: proto.designModule?.phases,
        enroll: proto.designModule?.enrollmentInfo,
        primary: (proto.outcomesModule?.primaryOutcomes || []).map((o) => o.measure),
      },
      null,
      2
    )
  );
}

const ctSearch = await get(
  "https://clinicaltrials.gov/api/v2/studies?query.term=tirzepatide%20AND%20(NASH%20OR%20MASH)&pageSize=5&fields=NCTId,BriefTitle,OverallStatus,Phase,HasResults"
);
console.log("CT SEARCH tirzepatide NASH/MASH", ctSearch.status);
console.log(ctSearch.text.slice(0, 2500));
