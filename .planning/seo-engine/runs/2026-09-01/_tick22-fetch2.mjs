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
    console.log("===== PMID", pm, "=====");
    console.log("TITLE:", title);
    console.log(abstracts.join("\n\n").slice(0, 1800));
    console.log("");
  }
}

const extra = "37364590,36883831,34288673,33894838";
const e = await get(
  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${extra}`
);
console.log("===== EFETCH EXTRA STATUS", e.status, "=====");
printAbstracts(e.text);

await new Promise((r) => setTimeout(r, 400));
const nct = "NCT06131437";
const ct = await get(`https://clinicaltrials.gov/api/v2/studies/${nct}`);
console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
try {
  const j = JSON.parse(ct.text);
  const proto = j.protocolSection || {};
  const id = proto.identificationModule || {};
  const status = proto.statusModule || {};
  const design = proto.designModule || {};
  const enroll = proto.designModule?.enrollmentInfo || {};
  console.log(
    JSON.stringify(
      {
        nctId: id.nctId,
        briefTitle: id.briefTitle,
        officialTitle: id.officialTitle,
        overallStatus: status.overallStatus,
        hasResults: j.hasResults,
        phases: design.phases,
        enrollment: enroll,
        start: status.startDateStruct,
        complete: status.completionDateStruct,
        primaryComplete: status.primaryCompletionDateStruct,
      },
      null,
      2
    )
  );
} catch {
  console.log(ct.text.slice(0, 2500));
}

await new Promise((r) => setTimeout(r, 400));
const fda = await get(
  "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:cagrilintide&limit=3"
);
console.log("===== OPENFDA CAGRILINTIDE STATUS", fda.status, "=====");
console.log(fda.text.slice(0, 600));

await new Promise((r) => setTimeout(r, 400));
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
