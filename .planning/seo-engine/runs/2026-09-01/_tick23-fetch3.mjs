const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

function printAbstracts(xml) {
  const parts = xml.split(/<PubmedArticle[ >]/).slice(1);
  for (const c of parts) {
    const pm = (c.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
    const title = ((c.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || "")
      .replace(/<[^>]+>/g, "")
      .trim();
    console.log("===== PMID", pm, "=====");
    console.log("TITLE:", title);
    console.log("");
  }
}

const extra = "40563436,41160422,38323122";
const e = await get(
  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${extra}`
);
console.log("===== EFETCH TRIUMPH-SEARCH HITS STATUS", e.status, "=====");
printAbstracts(e.text);

const ncts = ["NCT04881760", "NCT06354660"];
for (const nct of ncts) {
  const ct = await get(
    `https://clinicaltrials.gov/api/v2/studies/${nct}?fields=NCTId,BriefTitle,OfficialTitle,OverallStatus,Phase,EnrollmentInfo,HasResults,PrimaryOutcomeMeasures,StartDateStruct,CompletionDateStruct,Conditions,Interventions`
  );
  console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
  console.log(ct.text.slice(0, 2500));
  console.log("");
  await new Promise((r) => setTimeout(r, 300));
}

const fda = await get(
  "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:retatrutide+OR+openfda.brand_name:retatrutide+OR+products.brand_name:retatrutide&limit=5"
);
console.log("===== OPENFDA RETATRUTIDE STATUS", fda.status, "=====");
console.log(fda.text.slice(0, 800));
console.log("");

const fda2 = await get(
  "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:tirzepatide&limit=2"
);
console.log("===== OPENFDA TIRZEPATIDE STATUS", fda2.status, "=====");
try {
  const j = JSON.parse(fda2.text);
  const rows = (j.results || []).map((r) => ({
    appl: r.application_number,
    sponsor: r.sponsor_name,
    products: (r.products || []).slice(0, 4).map((p) => p.brand_name),
  }));
  console.log(JSON.stringify({ count: j.meta?.results?.total, rows }, null, 2));
} catch {
  console.log(fda2.text.slice(0, 800));
}
