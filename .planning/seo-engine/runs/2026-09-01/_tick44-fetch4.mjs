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
    const year = (c.match(/<Year>(\d{4})<\/Year>/) || [])[1];
    const journal = ((c.match(/<Title>([\s\S]*?)<\/Title>/) || [])[1] || "").replace(/<[^>]+>/g, "");
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
    console.log("===== PMID", pm, year, "=====");
    console.log("JOURNAL:", journal);
    console.log("TITLE:", title);
    console.log("NCT:", [...new Set(nct)].join(", "));
    console.log(abstracts.join("\n\n") || "(no abstract text)");
    console.log("");
  }
}

const ids = "42395176,15834452,14685303,14571286,41490200,41966639";
const eurl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${ids}`;
const e = await get(eurl);
console.log("===== EFETCH FOLLOWUP STATUS", e.status, "len", e.text.length, "=====");
printAbstracts(e.text);
