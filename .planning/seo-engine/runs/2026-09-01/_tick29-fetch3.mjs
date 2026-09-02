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
  "NCT04184622",
];
for (const nct of ncts) {
  const ct = await get(
    `https://clinicaltrials.gov/api/v2/studies/${nct}?fields=NCTId,BriefTitle,OfficialTitle,Acronym,OverallStatus,Phase,EnrollmentInfo,HasResults,PrimaryCompletionDateStruct,CompletionDateStruct,StartDateStruct`
  );
  console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
  console.log(ct.text.slice(0, 2200));
  console.log("");
  await new Promise((r) => setTimeout(r, 250));
}

const esum = await get(
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=41508550,35658024"
);
console.log("===== ESUMMARY STATUS", esum.status, "=====");
try {
  const j = JSON.parse(esum.text);
  for (const id of ["41508550", "35658024"]) {
    const r = j.result?.[id];
    console.log(
      id,
      r?.title,
      "|",
      r?.fulljournalname,
      r?.pubdate,
      "|",
      r?.elocationid,
      "|",
      (r?.pubtype || []).join("; ")
    );
  }
} catch {
  console.log(esum.text.slice(0, 800));
}

await new Promise((r) => setTimeout(r, 400));

for (const term of [
  "openfda.generic_name:%22vk2735%22",
  "openfda.generic_name:%22tirzepatide%22",
]) {
  try {
    const fda = await get(`https://api.fda.gov/drug/drugsfda.json?search=${term}&limit=3`);
    console.log("===== OPENFDA", term, "STATUS", fda.status, "=====");
    const j = JSON.parse(fda.text);
    const rows = (j.results || []).map((r) => ({
      appl: r.application_number,
      sponsor: r.sponsor_name,
      products: (r.products || []).slice(0, 4).map((p) => p.brand_name),
    }));
    console.log(JSON.stringify({ count: j.meta?.results?.total, error: j.error, rows }, null, 2));
  } catch (err) {
    console.log("===== OPENFDA", term, "FAIL", err.message, "=====");
  }
  await new Promise((r) => setTimeout(r, 500));
}
