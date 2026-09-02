const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const ncts = [
  "NCT06068946",
  "NCT05203237",
  "NCT06828055",
  "NCT07104500",
  "NCT07104383",
];
for (const nct of ncts) {
  const ct = await get(
    `https://clinicaltrials.gov/api/v2/studies/${nct}?fields=NCTId,BriefTitle,OfficialTitle,Acronym,OverallStatus,Phase,EnrollmentInfo,HasResults,PrimaryCompletionDateStruct,CompletionDateStruct,StartDateStruct`
  );
  console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
  console.log(ct.text.slice(0, 2500));
  console.log("");
  await new Promise((r) => setTimeout(r, 250));
}

for (const term of [
  "openfda.generic_name:%22semaglutide%22",
  "openfda.brand_name:%22ozempic%22",
]) {
  try {
    const fda = await get(`https://api.fda.gov/drug/drugsfda.json?search=${term}&limit=6`);
    console.log("===== OPENFDA", term, "STATUS", fda.status, "=====");
    const j = JSON.parse(fda.text);
    const rows = (j.results || []).map((r) => ({
      appl: r.application_number,
      sponsor: r.sponsor_name,
      products: (r.products || []).slice(0, 8).map((p) => `${p.brand_name}|${p.active_ingredients?.[0]?.name || ""}`),
    }));
    console.log(JSON.stringify({ count: j.meta?.results?.total, error: j.error, rows }, null, 2));
  } catch (err) {
    console.log("===== OPENFDA", term, "FAIL", err.message, "=====");
  }
  await new Promise((r) => setTimeout(r, 600));
}
