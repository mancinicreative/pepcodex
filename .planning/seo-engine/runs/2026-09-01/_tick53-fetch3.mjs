const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const ids = "42673585,41948476,41054801,40949933";
const eurl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${ids}`;
const e = await get(eurl);
console.log("===== EFETCH H2H STATUS", e.status, "len", e.text.length, "=====");

const parts = e.text.split(/<PubmedArticle[ >]/).slice(1);
for (const c of parts) {
  const pm = (c.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
  const title = ((c.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || "")
    .replace(/<[^>]+>/g, "")
    .trim();
  const pubType = [...c.matchAll(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g)]
    .map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  const abstracts = [...c.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)].map((m) => {
    const text = m[2].replace(/<[^>]+>/g, "").trim();
    return text.slice(0, 400);
  });
  const titleL = title.toLowerCase();
  const namesAmy = titleL.includes("amycretin");
  const namesOrfor = titleL.includes("orforglipron");
  console.log("===== PMID", pm, "=====");
  console.log("TITLE:", title);
  console.log("TYPES:", pubType.join(" | "));
  console.log("TITLE_MATCH_AMYCRETIN", namesAmy, "ORFORGLIPRON", namesOrfor);
  console.log("ABS:", abstracts.join(" | ") || "(no abstract)");
  console.log("");
}
