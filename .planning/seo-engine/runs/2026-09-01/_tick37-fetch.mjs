const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
    const year = (c.match(/<Year>(\d{4})<\/Year>/) || [])[1];
    const journal = ((c.match(/<Title>([\s\S]*?)<\/Title>/) || [])[1] || "").replace(/<[^>]+>/g, "");
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
    console.log("===== PMID", pm, year, "=====");
    console.log("JOURNAL:", journal);
    console.log("TITLE:", title);
    console.log("NCT:", [...new Set(nct)].join(", "));
    console.log(abstracts.join("\n\n"));
    console.log("");
  }
}

const searches = [
  { label: "CagriSema", term: '"CagriSema"' },
  { label: "cagrisema", term: '"cagrisema"' },
  { label: "REDEFINE 1", term: '"REDEFINE 1" AND cagrilintide' },
  { label: "REDEFINE 4 cagrilintide tirzepatide", term: '"REDEFINE 4" AND cagrilintide AND tirzepatide' },
  { label: "REDEFINE-4 cagrilintide", term: '"REDEFINE-4" AND cagrilintide' },
  { label: "NCT06131437", term: "NCT06131437" },
  { label: "STEP 1 semaglutide 33567185 check", term: '"Once-Weekly Semaglutide in Adults with Overweight or Obesity"' },
];

for (const s of searches) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=10&sort=relevance&term=${encodeURIComponent(s.term)}`;
  const { status, text } = await get(url);
  console.log("===== ESEARCH", s.label, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 400));
  }
  await sleep(400);
}

const known = "40544433,33567185";
const eurl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${known}`;
const e = await get(eurl);
console.log("===== EFETCH KNOWN STATUS", e.status, "=====");
printAbstracts(e.text);

await sleep(400);
const nct = "NCT06131437";
const ct = await get(
  `https://clinicaltrials.gov/api/v2/studies/${nct}?fields=NCTId,BriefTitle,OfficialTitle,OverallStatus,Phase,EnrollmentInfo,HasResults,PrimaryOutcomeMeasures,StartDateStruct,CompletionDateStruct,Conditions,Interventions,ArmGroups,StudyType`
);
console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
console.log(ct.text.slice(0, 5000));
console.log("");

await sleep(400);
const fdaCagri = await get(
  "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:cagrilintide+OR+products.brand_name:CagriSema+OR+products.brand_name:cagrisema&limit=5"
);
console.log("===== OPENFDA CAGRILINTIDE/CAGRISEMA STATUS", fdaCagri.status, "=====");
console.log(fdaCagri.text.slice(0, 800));
console.log("");

await sleep(400);
const fdaSema = await get(
  'https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:semaglutide&limit=8'
);
console.log("===== OPENFDA SEMAGLUTIDE STATUS", fdaSema.status, "=====");
try {
  const j = JSON.parse(fdaSema.text);
  const rows = (j.results || []).map((r) => ({
    appl: r.application_number,
    sponsor: r.sponsor_name,
    products: (r.products || []).slice(0, 6).map((p) => p.brand_name),
  }));
  console.log(JSON.stringify({ count: j.meta?.results?.total, rows }, null, 2));
} catch {
  console.log(fdaSema.text.slice(0, 800));
}
