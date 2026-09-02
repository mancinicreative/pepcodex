const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const extra = [
  ["enicepatide", `"enicepatide"`],
  ["RO7795068", `"RO7795068"`],
  ["NCT04838405 UID", "NCT04838405"],
  ["NCT06525935 UID", "NCT06525935"],
  ["NCT06628362 UID", "NCT06628362"],
  ["NCT07351045 UID", "NCT07351045"],
  ["NCT07351058 UID", "NCT07351058"],
];
for (const [name, term] of extra) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=8&term=${encodeURIComponent(term)}`;
  const { status, text } = await get(url);
  console.log("===== ESEARCH", name, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 400));
  }
  await sleep(400);
}

const ncts = ["NCT04838405", "NCT06525935", "NCT06628362"];
for (const nct of ncts) {
  await sleep(350);
  const url = `https://clinicaltrials.gov/api/v2/studies/${nct}`;
  const { status, text } = await get(url);
  console.log("===== CT.GOV", nct, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    const proto = j.protocolSection || {};
    const id = proto.identificationModule || {};
    const statusM = proto.statusModule || {};
    const design = proto.designModule || {};
    const enroll = design.enrollmentInfo || {};
    const outcomes = proto.outcomesModule || {};
    console.log(
      JSON.stringify(
        {
          nctId: id.nctId,
          briefTitle: id.briefTitle,
          officialTitle: id.officialTitle,
          acronym: id.acronym,
          overallStatus: statusM.overallStatus,
          hasResults: j.hasResults,
          phases: design.phases,
          enrollment: enroll,
          start: statusM.startDateStruct,
          primaryCompletion: statusM.primaryCompletionDateStruct,
          primaryOutcomes: (outcomes.primaryOutcomes || []).slice(0, 4).map((o) => o.measure),
          secondaryOutcomes: (outcomes.secondaryOutcomes || []).slice(0, 6).map((o) => o.measure),
          interventions: (proto.armsInterventionsModule?.interventions || []).map((i) => ({
            name: i.name,
            otherNames: i.otherNames,
          })),
        },
        null,
        2
      )
    );
  } catch {
    console.log(text.slice(0, 1500));
  }
}

for (const name of ["enicepatide", "ro7795068"]) {
  await sleep(200);
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
  } catch {
    console.log(fda.text.slice(0, 800));
  }
}
