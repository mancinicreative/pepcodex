const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const ncts = [
  "NCT06066515",
  "NCT04667377",
  "NCT03548935",
  "NCT03574597",
  "NCT04153929",
  "NCT04771273",
  "NCT06309992",
  "NCT06632457",
];

for (const nct of ncts) {
  const url = `https://clinicaltrials.gov/api/v2/studies/${nct}`;
  const ct = await get(url);
  console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
  try {
    const j = JSON.parse(ct.text);
    const proto = j.protocolSection || {};
    const id = proto.identificationModule || {};
    const statusM = proto.statusModule || {};
    const arms = (proto.armsInterventionsModule?.interventions || []).map((i) => ({
      type: i.type,
      name: i.name,
    }));
    console.log(
      JSON.stringify(
        {
          nctId: id.nctId,
          briefTitle: id.briefTitle,
          officialTitle: id.officialTitle,
          acronym: id.acronym,
          overallStatus: statusM.overallStatus,
          hasResults: j.hasResults,
          phase: proto.designModule?.phases,
          enrollment: proto.designModule?.enrollmentInfo,
          interventions: arms,
        },
        null,
        2
      )
    );
  } catch {
    console.log(ct.text.slice(0, 600));
  }
  await sleep(400);
}

const searches = [
  ["pmid 42253238", "42253238[PMID]"],
  ["pmid 33567185", "33567185[PMID]"],
  ["pmid 37952131", "37952131[PMID]"],
  ["survodutide[Title] obesity once weekly", "survodutide[Title] AND obesity AND once weekly"],
  ["STEP 1 ClinicalTrials NCT03548935", "NCT03548935"],
  ["SELECT NCT03574597", "NCT03574597"],
];

for (const [label, term] of searches) {
  const q = encodeURIComponent(term);
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=${q}`;
  const { status, text } = await get(url);
  let ids = [];
  try {
    ids = JSON.parse(text)?.esearchresult?.idlist || [];
  } catch {
    ids = ["PARSE_FAIL"];
  }
  console.log("ESEARCH", status, label, "n=" + ids.length, ids.join(","));
  await sleep(400);
}

for (const name of ["survodutide", "semaglutide"]) {
  await sleep(300);
  const fda = await get(
    `https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22${name}%22&limit=8`
  );
  console.log("===== OPENFDA GENERIC", name.toUpperCase(), "STATUS", fda.status, "=====");
  try {
    const j = JSON.parse(fda.text);
    console.log(
      JSON.stringify(
        {
          total: j.meta?.results?.total,
          error: j.error,
          apps: (j.results || []).map((r) => ({
            appl: r.application_number,
            sponsor: r.sponsor_name,
            brands: [...new Set((r.products || []).map((p) => p.brand_name))],
          })),
        },
        null,
        2
      )
    );
  } catch (err) {
    console.log("FAIL", err.message);
  }
}
