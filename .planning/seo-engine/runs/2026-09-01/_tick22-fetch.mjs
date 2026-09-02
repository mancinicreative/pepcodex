const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, r));

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
    const abstracts = [...c.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)].map((m) => {
      const label = (m[1].match(/Label="([^"]+)"/) || [])[1] || "";
      const text = m[2]
        .replace(/<[^>]+>/g, "")
        .replace(/&#xb7;/g, ".")
        .replace(/&#x2013;/g, "-")
        .replace(/&#x2212;/g, "-")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();
      return (label ? label + ": " : "") + text;
    });
    const nct = [...c.matchAll(/NCT\d+/g)].map((x) => x[0]);
    console.log("===== PMID", pm, "=====");
    console.log("TITLE:", title);
    console.log("NCT:", [...new Set(nct)].join(", "));
    console.log(abstracts.join("\n\n"));
    console.log("");
  }
}

const aliases = ["cagrilintide", "AM833", "NN9838"];
for (const a of aliases) {
  const term = `"${a}"`;
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=20&sort=relevance&term=${encodeURIComponent(term)}`;
  const { status, text } = await get(url);
  console.log("===== ESEARCH", a, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 400));
  }
  await new Promise((r) => setTimeout(r, 400));
}

const known = "40544433,35658024,34798060,34739660,37506727";
const eurl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${known}`;
const e = await get(eurl);
console.log("===== EFETCH KNOWN STATUS", e.status, "=====");
printAbstracts(e.text);

await new Promise((r) => setTimeout(r, 400));
const nct = "NCT06131437";
const ct = await get(
  `https://clinicaltrials.gov/api/v2/studies/${nct}?fields=NCTId,BriefTitle,OfficialTitle,OverallStatus,Phase,EnrollmentInfo,HasResults,PrimaryOutcomeMeasures,StartDateStruct,CompletionDateStruct,Conditions,Interventions,ArmGroups`
);
console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
console.log(ct.text.slice(0, 3500));
console.log("");

const fda = await get(
  "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:cagrilintide+OR+openfda.brand_name:cagrilintide+OR+products.brand_name:cagrilintide&limit=5"
);
console.log("===== OPENFDA CAGRILINTIDE STATUS", fda.status, "=====");
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
