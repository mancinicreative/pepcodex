const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const ncts = ["NCT04881760", "NCT03548935", "NCT03611582", "NCT03693430", "NCT03574597"];
for (const nct of ncts) {
  const ct = await get(
    `https://clinicaltrials.gov/api/v2/studies/${nct}?fields=NCTId,BriefTitle,OfficialTitle,OverallStatus,Phase,EnrollmentInfo,HasResults,PrimaryOutcomeMeasures,StartDateStruct,CompletionDateStruct,Conditions,Interventions`
  );
  console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
  console.log(ct.text.slice(0, 2200));
  console.log("");
  await new Promise((r) => setTimeout(r, 300));
}

const search = await get(
  "https://clinicaltrials.gov/api/v2/studies?query.term=TRIUMPH%20retatrutide&pageSize=8&fields=NCTId,BriefTitle,OverallStatus,Phase,HasResults,EnrollmentInfo"
);
console.log("===== CT.GOV SEARCH TRIUMPH retatrutide STATUS", search.status, "=====");
console.log(search.text.slice(0, 3500));
console.log("");

const fdaR = await get(
  "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:retatrutide+OR+openfda.brand_name:retatrutide+OR+products.brand_name:retatrutide&limit=5"
);
console.log("===== OPENFDA RETATRUTIDE STATUS", fdaR.status, "=====");
console.log(fdaR.text.slice(0, 800));
console.log("");

const fdaS = await get(
  "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:semaglutide&limit=10"
);
console.log("===== OPENFDA SEMAGLUTIDE STATUS", fdaS.status, "=====");
try {
  const j = JSON.parse(fdaS.text);
  const rows = (j.results || []).map((r) => ({
    appl: r.application_number,
    sponsor: r.sponsor_name,
    products: (r.products || []).slice(0, 8).map((p) => ({
      brand: p.brand_name,
      form: p.dosage_form,
      route: p.route,
      marketing: p.marketing_status,
    })),
  }));
  console.log(JSON.stringify({ count: j.meta?.results?.total, rows }, null, 2));
} catch {
  console.log(fdaS.text.slice(0, 1200));
}
