const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
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
    const journal = ((c.match(/<Title>([\s\S]*?)<\/Title>/) || [])[1] || "").trim();
    const year = ((c.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/) || [])[1] || "").trim();
    const doi = ((c.match(/<ELocationID[^>]*EIdType="doi"[^>]*>([\s\S]*?)<\/ELocationID>/) || [])[1] || "").trim();
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
    console.log("DOI:", doi);
    console.log("NCT:", [...new Set(nct)].join(", "));
    console.log((abstracts.join("\n\n") || "(no abstract)").slice(0, 8000));
    console.log("");
  }
}

const aliases = [
  "5-Amino-1MQ",
  "5-amino-1-MQ",
  "5-Amino-1-methylquinolinium",
  "5-amino-1-methylquinolinium",
];

const extra = [
  ["STEP1 UID", "33567185[uid]"],
  ["SELECT UID", "37952131[uid]"],
  ["STEP2 UID", "33667417[uid]"],
  ["Wilding STEP1", "Wilding Once-Weekly Semaglutide Overweight Obesity 2021"],
  ["Lincoff SELECT", "Lincoff Semaglutide Cardiovascular Outcomes Obesity 2023"],
];

async function main() {
  for (const a of aliases) {
    const term = `"${a}"`;
    const url = `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=8&sort=relevance&term=${encodeURIComponent(term)}`;
    const { status, text } = await get(url);
    console.log("===== ESEARCH", a, "STATUS", status, "=====");
    try {
      const j = JSON.parse(text);
      console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
    } catch {
      console.log(text.slice(0, 400));
    }
    await sleep(400);
  }

  for (const [name, term] of extra) {
    const url = `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=${encodeURIComponent(term)}`;
    const { status, text } = await get(url);
    console.log("===== ESEARCH", name, "STATUS", status, "=====");
    try {
      const j = JSON.parse(text);
      console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
    } catch {
      console.log(text.slice(0, 400));
    }
    await sleep(350);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
