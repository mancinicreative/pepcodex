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

const e = await get(
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=38316982,36509857,38388678"
);
console.log("===== EFETCH P1 STATUS", e.status, "=====");
printAbstracts(e.text);

const pubmedQueries = [
  "NCT05669599",
  "NCT04478708",
  '"MARITIME-1" maridebart',
  '"MARITIME 1" maridebart',
  "maridebart tirzepatide",
];
for (const q of pubmedQueries) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=10&term=${encodeURIComponent(q)}`;
  const { status, text } = await get(url);
  console.log("===== PUBMED", q, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 300));
  }
  await new Promise((r) => setTimeout(r, 350));
}

const ncts = [
  "NCT05669599",
  "NCT04478708",
  "NCT07037459",
  "NCT07575399",
  "NCT07684235",
  "NCT07684144",
];
for (const nct of ncts) {
  const ct = await get(
    `https://clinicaltrials.gov/api/v2/studies/${nct}?fields=NCTId,BriefTitle,OfficialTitle,Acronym,OverallStatus,Phase,EnrollmentInfo,HasResults,PrimaryCompletionDateStruct,CompletionDateStruct,StartDateStruct`
  );
  console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
  console.log(ct.text.slice(0, 1800));
  console.log("");
  await new Promise((r) => setTimeout(r, 250));
}

const maritime = await get(
  "https://clinicaltrials.gov/api/v2/studies?query.term=MARITIME-1%20maridebart&pageSize=8&fields=NCTId,BriefTitle,Acronym,OverallStatus,Phase,HasResults,EnrollmentInfo"
);
console.log("===== CT SEARCH MARITIME-1 STATUS", maritime.status, "=====");
console.log(maritime.text.slice(0, 2500));
console.log("");

for (const term of [
  "openfda.generic_name:%22maridebart%22",
  "openfda.generic_name:%22maritide%22",
  "openfda.generic_name:%22tirzepatide%22",
]) {
  const fda = await get(`https://api.fda.gov/drug/drugsfda.json?search=${term}&limit=3`);
  console.log("===== OPENFDA", term, "STATUS", fda.status, "=====");
  try {
    const j = JSON.parse(fda.text);
    const rows = (j.results || []).map((r) => ({
      appl: r.application_number,
      sponsor: r.sponsor_name,
      products: (r.products || []).slice(0, 4).map((p) => p.brand_name),
    }));
    console.log(JSON.stringify({ count: j.meta?.results?.total, error: j.error, rows }, null, 2));
  } catch {
    console.log(fda.text.slice(0, 500));
  }
}
