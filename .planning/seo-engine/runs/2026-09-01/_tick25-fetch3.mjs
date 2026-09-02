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

const searches = [
  ["NCT04771273", "NCT04771273"],
  ["Sanyal survodutide", "Sanyal[Author] AND survodutide[Title]"],
  ["survodutide NASH phase 2", "survodutide[Title] AND (NASH[Title] OR MASH[Title]) AND trial"],
];

for (const [label, term] of searches) {
  const q = encodeURIComponent(term);
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=8&term=${q}`;
  const { status, text } = await get(url);
  let ids = [];
  try {
    ids = JSON.parse(text)?.esearchresult?.idlist || [];
  } catch {
    ids = ["PARSE_FAIL"];
  }
  console.log("ESEARCH", status, label, "n=" + ids.length, ids.join(","));
  await new Promise((r) => setTimeout(r, 400));
}

const nctUrl =
  "https://clinicaltrials.gov/api/v2/studies/NCT04771273?fields=protocolSection,hasResults";
const ct = await get(nctUrl);
console.log("\nCTGOV NCT04771273 STATUS", ct.status);
try {
  const j = JSON.parse(ct.text);
  const id = j.protocolSection?.identificationModule || {};
  const statusMod = j.protocolSection?.statusModule || {};
  const design = j.protocolSection?.designModule || {};
  console.log(
    [
      id.briefTitle,
      statusMod.overallStatus,
      "enroll=" + (design.enrollmentInfo?.count ?? "?"),
      "hasResults=" + j.hasResults,
    ].join(" | ")
  );
} catch (e) {
  console.log(e.message);
}
