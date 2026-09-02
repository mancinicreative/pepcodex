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
    console.log((abstracts.join("\n\n") || "(no abstract)").slice(0, 7000));
    console.log("");
  }
}

const aliases = ["VK2735", "VK-2735", "Viking 2735"];
for (const a of aliases) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=25&sort=relevance&term=${encodeURIComponent(`"${a}"`)}`;
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

const extraQueries = [
  "VK2735[Title]",
  '"VENTURE" VK2735',
  '"VANQUISH" VK2735',
  "NCT07104383",
  "NCT07104500",
  "NCT06828055",
  "NCT05203237",
  "NCT06068946",
];
for (const q of extraQueries) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=15&term=${encodeURIComponent(q)}`;
  const { status, text } = await get(url);
  console.log("===== ESEARCH", q, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 300));
  }
  await new Promise((r) => setTimeout(r, 400));
}

const ids = "41508550,33567185,37952131,37385278";
const eurl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${ids}`;
const e = await get(eurl);
console.log("===== EFETCH STATUS", e.status, "=====");
printAbstracts(e.text);

const esum = await get(
  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids}`
);
console.log("===== ESUMMARY STATUS", esum.status, "=====");
try {
  const j = JSON.parse(esum.text);
  for (const id of ids.split(",")) {
    const r = j.result?.[id];
    console.log(
      id,
      r?.title,
      "|",
      r?.fulljournalname,
      r?.pubdate,
      "|",
      r?.elocationid,
      "|",
      (r?.pubtype || []).join("; ")
    );
  }
} catch {
  console.log(esum.text.slice(0, 800));
}
