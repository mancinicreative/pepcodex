const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const nct = "NCT03574597";
const url = `https://clinicaltrials.gov/api/v2/studies/${nct}`;
const ct = await get(url);
console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
try {
  const j = JSON.parse(ct.text);
  const proto = j.protocolSection || {};
  const id = proto.identificationModule || {};
  const statusM = proto.statusModule || {};
  console.log(
    JSON.stringify(
      {
        nctId: id.nctId,
        briefTitle: id.briefTitle,
        acronym: id.acronym,
        overallStatus: statusM.overallStatus,
        hasResults: j.hasResults,
        enrollment: proto.designModule?.enrollmentInfo,
      },
      null,
      2
    )
  );
} catch {
  console.log(ct.text.slice(0, 800));
}

await sleep(400);

for (const name of ["pemvidutide", "semaglutide"]) {
  await sleep(300);
  try {
    const fda = await get(
      `https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22${name}%22&limit=8`
    );
    console.log("===== OPENFDA", name.toUpperCase(), "STATUS", fda.status, "=====");
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
    console.log("===== OPENFDA", name.toUpperCase(), "FAIL", err.cause?.code || err.message, "=====");
  }
}
