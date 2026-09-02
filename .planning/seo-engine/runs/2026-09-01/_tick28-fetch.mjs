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
  ["SYNCHRONIZE-1 title survodutide", "SYNCHRONIZE-1[Title] AND survodutide"],
  ["SYNCHRONY title survodutide", "SYNCHRONY[Title] AND survodutide"],
  ["survodutide obesity 46", "survodutide[Title] AND obesity AND 46"],
  ["survodutide MASH", "survodutide[Title] AND MASH"],
  ["survodutide SYNCHRONIZE-MASLD", "SYNCHRONIZE-MASLD[Title] AND survodutide"],
  ["STEP 1 semaglutide obesity", "Once-Weekly Semaglutide in Adults with Overweight or Obesity[Title]"],
  ["SELECT semaglutide CV", "Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes[Title]"],
  ["survodutide diabetes HbA1c", "survodutide[Title] AND diabetes"],
  ["semaglutide MASH title", "semaglutide[Title] AND MASH"],
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

const ids = "42253238,38330987,33567185,37952131,38095657,38847460,42252333";
const fetchUrl =
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=" + ids;
const fetched = await get(fetchUrl);
console.log("\nEFETCH STATUS", fetched.status);
for (const a of parseArticles(fetched.text)) {
  console.log("===== PMID", a.pm, "=====");
  console.log("TITLE:", a.title);
  console.log("NCT:", a.nct.join(", "));
  console.log(a.abstracts.join("\n\n"));
  console.log("");
}
