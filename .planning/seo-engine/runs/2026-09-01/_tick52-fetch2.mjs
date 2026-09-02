/**
 * TICK52 second pass: full GLORY-1 abstract + H2H title-match.
 */
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
        .replace(/&#x2009;/g, " ")
        .replace(/&#xd7;/g, "x")
        .replace(/&#x2265;/g, ">=")
        .trim();
      return (label ? label + ": " : "") + text;
    });
    const nct = [...c.matchAll(/NCT\d+/g)].map((x) => x[0]);
    const titleLower = title.toLowerCase();
    const namesAmy = titleLower.includes("amycretin");
    const namesMaz = titleLower.includes("mazdutide");
    console.log("===== PMID", pm, year, "=====");
    console.log("JOURNAL:", journal);
    console.log("DOI:", doi);
    console.log("TITLE:", title);
    console.log("TITLE_HAS_AMYCRETIN:", namesAmy, "TITLE_HAS_MAZDUTIDE:", namesMaz);
    console.log("NCT:", [...new Set(nct)].join(", "));
    console.log(abstracts.join("\n\n") || "(no abstract)");
    console.log("");
  }
}

const glory1 = await get(
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=40421736"
);
console.log("===== EFETCH GLORY-1 STATUS", glory1.status, "len", glory1.text.length, "=====");
printAbstracts(glory1.text);

await sleep(400);
const h2h = await get(
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=41054801,42208956,40081498,41948476"
);
console.log("===== EFETCH H2H STATUS", h2h.status, "len", h2h.text.length, "=====");
printAbstracts(h2h.text);

await sleep(350);
const sum = await get(
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=40421736,42251595,42628555,40550229,40550231"
);
console.log("===== ESUMMARY CORE STATUS", sum.status, "=====");
try {
  const j = JSON.parse(sum.text);
  for (const id of ["40421736", "42251595", "42628555", "40550229", "40550231"]) {
    const r = j.result?.[id];
    console.log(
      JSON.stringify(
        {
          pmid: id,
          title: r?.title,
          source: r?.source,
          pubdate: r?.pubdate,
          elocationid: r?.elocationid,
        },
        null,
        2
      )
    );
  }
} catch {
  console.log(sum.text.slice(0, 800));
}
