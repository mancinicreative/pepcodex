const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const ncts = ["NCT04881760", "NCT03548935", "NCT03611582", "NCT03693430", "NCT03574597", "NCT06383390"];
for (const nct of ncts) {
  const ct = await get(
    `https://clinicaltrials.gov/api/v2/studies/${nct}?fields=NCTId,BriefTitle,OfficialTitle,OverallStatus,Phase,EnrollmentInfo,HasResults,StartDateStruct,CompletionDateStruct`
  );
  console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
  console.log(ct.text.slice(0, 1800));
  console.log("");
  await new Promise((r) => setTimeout(r, 250));
}

const searches = [
  "TRIUMPH-1 retatrutide",
  "TRIUMPH-2 retatrutide",
  "TRIUMPH-3 retatrutide",
  "TRIUMPH-4 retatrutide",
  "retatrutide obesity phase 3",
];
for (const q of searches) {
  const u = `https://clinicaltrials.gov/api/v2/studies?query.term=${encodeURIComponent(q)}&pageSize=5&fields=NCTId,BriefTitle,OverallStatus,Phase,HasResults,EnrollmentInfo`;
  const r = await get(u);
  console.log("===== CT.GOV SEARCH", q, "STATUS", r.status, "=====");
  console.log(r.text.slice(0, 1600));
  console.log("");
  await new Promise((r) => setTimeout(r, 250));
}

const brands = [
  'openfda.brand_name:"OZEMPIC"',
  'openfda.brand_name:"WEGOVY"',
  'openfda.brand_name:"RYBELSUS"',
  "openfda.generic_name:semaglutide",
];
for (const q of brands) {
  const fda = await get(
    `https://api.fda.gov/drug/drugsfda.json?search=${encodeURIComponent(q)}&limit=5`
  );
  console.log("===== OPENFDA", q, "STATUS", fda.status, "=====");
  try {
    const j = JSON.parse(fda.text);
    const rows = (j.results || []).map((r) => ({
      appl: r.application_number,
      sponsor: r.sponsor_name,
      products: (r.products || []).slice(0, 10).map((p) => ({
        brand: p.brand_name,
        form: p.dosage_form,
        route: p.route,
        marketing: p.marketing_status,
        active: p.active_ingredients,
      })),
    }));
    console.log(JSON.stringify({ count: j.meta?.results?.total, rows }, null, 2));
  } catch {
    console.log(fda.text.slice(0, 800));
  }
  console.log("");
  await new Promise((r) => setTimeout(r, 250));
}
