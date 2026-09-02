const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const ids = "42208956,41948476,41054801,40081498";
const eurl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${ids}`;
const e = await get(eurl);
console.log("===== EFETCH H2H STATUS", e.status, "len", e.text.length, "=====");
const parts = e.text.split(/<PubmedArticle[ >]/).slice(1);
for (const c of parts) {
  const pm = (c.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
  const title = ((c.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || "")
    .replace(/<[^>]+>/g, "")
    .trim();
  const types = [...c.matchAll(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, "")
  );
  const nct = [...c.matchAll(/NCT\d+/g)].map((x) => x[0]);
  console.log("PMID", pm);
  console.log("TITLE:", title);
  console.log("TYPES:", types.join(" | "));
  console.log("NCT:", [...new Set(nct)].join(", ") || "(none)");
  console.log("");
}

try {
  const fda = await get(
    "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22amycretin%22&limit=8"
  );
  console.log("===== OPENFDA GENERIC AMYCRETIN STATUS", fda.status, "=====");
  console.log(fda.text.slice(0, 600));
} catch (err) {
  console.log("===== OPENFDA GENERIC AMYCRETIN ERROR", err.cause?.code || err.message, "=====");
}
