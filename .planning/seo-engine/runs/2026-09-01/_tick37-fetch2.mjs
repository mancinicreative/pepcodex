const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const nct = "NCT06131437";
const ct = await get(`https://clinicaltrials.gov/api/v2/studies/${nct}`);
console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
try {
  const j = JSON.parse(ct.text);
  const proto = j.protocolSection || {};
  const id = proto.identificationModule || {};
  const status = proto.statusModule || {};
  const design = proto.designModule || {};
  const arms = proto.armsInterventionsModule || {};
  const outcomes = proto.outcomesModule || {};
  const primaries = (outcomes.primaryOutcomes || []).map((o) => ({
    measure: o.measure,
    timeFrame: o.timeFrame,
    description: (o.description || "").slice(0, 400),
  }));
  console.log(
    JSON.stringify(
      {
        nctId: id.nctId,
        briefTitle: id.briefTitle,
        officialTitle: id.officialTitle,
        acronym: id.acronym,
        overallStatus: status.overallStatus,
        hasResults: j.hasResults,
        studyType: design.studyType,
        phases: design.phases,
        allocation: design.designInfo?.allocation,
        masking: design.designInfo?.masking,
        interventionModel: design.designInfo?.interventionModel,
        enrollment: design.enrollmentInfo,
        start: status.startDateStruct,
        complete: status.completionDateStruct,
        primaryComplete: status.primaryCompletionDateStruct,
        armLabels: (arms.armGroups || []).map((a) => a.label),
        interventions: (arms.interventions || []).map((i) => ({
          type: i.type,
          name: i.name,
        })),
        primaries,
      },
      null,
      2
    )
  );
} catch (err) {
  console.log("PARSE FAIL", err.message);
  console.log(ct.text.slice(0, 2500));
}

await sleep(400);
const fdaC = await get(
  "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22cagrilintide%22&limit=3"
);
console.log("===== OPENFDA CAGRILINTIDE STATUS", fdaC.status, "=====");
console.log(fdaC.text.slice(0, 700));

await sleep(400);
const fdaS = await get(
  "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22semaglutide%22&limit=8"
);
console.log("===== OPENFDA SEMAGLUTIDE STATUS", fdaS.status, "=====");
try {
  const j = JSON.parse(fdaS.text);
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
  console.log(fdaS.text.slice(0, 800));
}

await sleep(400);
for (const brand of ["OZEMPIC", "WEGOVY", "RYBELSUS"]) {
  const q = `products.brand_name:"${brand}"`;
  const fdaB = await get(
    `https://api.fda.gov/drug/drugsfda.json?search=${encodeURIComponent(q)}&limit=3`
  );
  console.log("===== OPENFDA BRAND", brand, "STATUS", fdaB.status, "=====");
  try {
    const j = JSON.parse(fdaB.text);
    console.log(
      JSON.stringify(
        {
          total: j.meta?.results?.total,
          error: j.error,
          apps: (j.results || []).map((r) => ({
            appl: r.application_number,
            brands: [...new Set((r.products || []).map((p) => p.brand_name))],
          })),
        },
        null,
        2
      )
    );
  } catch {
    console.log(fdaB.text.slice(0, 400));
  }
  await sleep(350);
}
