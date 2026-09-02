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
    const journal = ((c.match(/<Title>([\s\S]*?)<\/Title>/) || [])[1] || "").trim();
    const year = ((c.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/) || [])[1] || "").trim();
    const pubTypes = [...c.matchAll(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g)].map(
      (m) => m[1]
    );
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
    console.log("JOURNAL:", journal, year);
    console.log("PUBTYPES:", pubTypes.join("; "));
    console.log("NCT:", [...new Set(nct)].join(", "));
    console.log((abstracts.join("\n\n") || "(no abstract)").slice(0, 6000));
    console.log("");
  }
}

const e = await get(
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=41508550"
);
console.log("===== EFETCH 41508550 STATUS", e.status, "=====");
printAbstracts(e.text);

const pubmedQueries = [
  "NCT06068946",
  "NCT05203237",
  "NCT06828055",
  "NCT07104500",
  "NCT07104383",
  "VENTURE[Title] VK2735",
  "VK2735 obesity",
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
  "NCT06068946",
  "NCT05203237",
  "NCT06828055",
  "NCT07104500",
  "NCT07104383",
];
for (const nct of ncts) {
  const ct = await get(
    `https://clinicaltrials.gov/api/v2/studies/${nct}?fields=NCTId,BriefTitle,OfficialTitle,Acronym,OverallStatus,Phase,EnrollmentInfo,HasResults,PrimaryCompletionDateStruct,CompletionDateStruct,StartDateStruct,InterventionNames,ArmGroupLabels,PrimaryOutcomeMeasures`
  );
  console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
  console.log(ct.text.slice(0, 2500));
  console.log("");
  await new Promise((r) => setTimeout(r, 250));
}

const more = await get(
  "https://clinicaltrials.gov/api/v2/studies?query.intr=VK2735&pageSize=25&fields=NCTId,BriefTitle,Acronym,OverallStatus,Phase,HasResults,EnrollmentInfo"
);
console.log("===== CT SEARCH INTR VK2735 STATUS", more.status, "=====");
console.log(more.text.slice(0, 4000));
console.log("");

for (const term of [
  "openfda.generic_name:%22vk2735%22",
  "openfda.brand_name:%22vk2735%22",
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
