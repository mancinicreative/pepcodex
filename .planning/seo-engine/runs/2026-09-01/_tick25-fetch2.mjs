const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

function parseArticles(xml) {
  const parts = xml.split(/<PubmedArticle[ >]/).slice(1);
  return parts.map((c) => {
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
    return { pm, title, nct: [...new Set(nct)], abstracts };
  });
}

const mashIds = "38857788,39663847,40963161,42545725,42254697";
const fetchUrl =
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=" + mashIds;
const fetched = await get(fetchUrl);
console.log("EFETCH MASH STATUS", fetched.status);
for (const a of parseArticles(fetched.text)) {
  console.log("===== PMID", a.pm, "=====");
  console.log("TITLE:", a.title);
  console.log("NCT:", a.nct.join(", "));
  const joined = a.abstracts.join("\n\n");
  console.log(joined.slice(0, 1800));
  console.log("");
}

const ncts = ["NCT04881760", "NCT04667377", "NCT06066515", "NCT06632457"];
for (const nct of ncts) {
  const url = `https://clinicaltrials.gov/api/v2/studies/${nct}?fields=protocolSection,hasResults`;
  const { status, text } = await get(url);
  let summary = "parse-fail";
  try {
    const j = JSON.parse(text);
    const id = j.protocolSection?.identificationModule || {};
    const statusMod = j.protocolSection?.statusModule || {};
    const design = j.protocolSection?.designModule || {};
    summary = [
      id.briefTitle,
      statusMod.overallStatus,
      "enroll=" + (design.enrollmentInfo?.count ?? "?"),
      "hasResults=" + j.hasResults,
      "primary=" + (statusMod.primaryCompletionDateStruct?.date ?? "?"),
      "complete=" + (statusMod.completionDateStruct?.date ?? "?"),
    ].join(" | ");
  } catch (e) {
    summary = e.message;
  }
  console.log("CTGOV", status, nct, summary);
  await new Promise((r) => setTimeout(r, 300));
}

for (const name of ["retatrutide", "survodutide"]) {
  const url = `https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:"${name}"&limit=1`;
  const { status, text } = await get(url);
  console.log("OPENFDA", name, status, text.slice(0, 180).replace(/\s+/g, " "));
  await new Promise((r) => setTimeout(r, 300));
}
