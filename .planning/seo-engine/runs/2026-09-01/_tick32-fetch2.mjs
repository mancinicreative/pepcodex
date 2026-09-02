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
    console.log("NCT:", [...new Set(nct)].join(", "));
    console.log(abstracts.join("\n\n") || "(no abstract)");
    console.log("");
  }
}

const stepIds = "33667417,33625476";
const e1 = await get(
  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${stepIds}`
);
console.log("===== EFETCH STEP2/3 STATUS", e1.status, "=====");
printAbstracts(e1.text);

await new Promise((r) => setTimeout(r, 400));

const sm5Queries = [
  '"SURMOUNT-5"[Title]',
  "tirzepatide versus semaglutide once weekly[Title]",
  "Aronne SURMOUNT-5",
];
for (const q of sm5Queries) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=10&term=${encodeURIComponent(q)}`;
  const { status, text } = await get(url);
  console.log("===== ESEARCH", q, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 400));
  }
  await new Promise((r) => setTimeout(r, 400));
}

const sm5Ids = "42683151,42434924,42235948,42131512,40353578";
const sumUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${sm5Ids}`;
const s = await get(sumUrl);
console.log("===== ESUMMARY SURMOUNT-5 CANDIDATES STATUS", s.status, "=====");
try {
  const j = JSON.parse(s.text);
  for (const id of sm5Ids.split(",")) {
    const rec = j.result?.[id];
    console.log(id, rec?.title, "|", rec?.fulljournalname, rec?.pubdate);
  }
} catch {
  console.log(s.text.slice(0, 800));
}
