/**
 * TICK57 fetch2: H2H titles, 18.7 hit, SYNCHRONIZE extras, openFDA retry.
 */
const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

function printAbstracts(xml, needMap) {
  const parts = xml.split(/<PubmedArticle[ >]/).slice(1);
  console.log("ARTICLE_COUNT", parts.length);
  for (const c of parts) {
    const pm = (c.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
    const title = ((c.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || "")
      .replace(/<[^>]+>/g, "")
      .trim();
    const year = (c.match(/<Year>(\d{4})<\/Year>/) || [])[1];
    const journal = ((c.match(/<Title>([\s\S]*?)<\/Title>/) || [])[1] || "").replace(/<[^>]+>/g, "");
    const pubtypes = [...c.matchAll(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g)]
      .map((m) => m[1].replace(/<[^>]+>/g, "").trim());
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
    const titleLower = title.toLowerCase();
    const need = needMap[pm] || [];
    const titleMatch = need.length ? need.every((w) => titleLower.includes(w.toLowerCase())) : "n/a";
    console.log("===== PMID", pm, year, "=====");
    console.log("JOURNAL:", journal);
    console.log("TITLE:", title);
    console.log("PUBTYPES:", pubtypes.join("; "));
    console.log("TITLE_MATCH:", titleMatch, "need:", need.join(","));
    console.log("NCT:", [...new Set(nct)].join(", "));
    console.log(abstracts.join("\n\n") || "(no abstract)");
    console.log("");
  }
}

const needMap = {
  "41054801": [],
  "42208956": [],
  "40081498": [],
  "41948476": [],
  "40963161": ["survodutide"],
  "41187967": [],
  "39495965": [],
  "41424209": [],
  "39453356": [],
  "41216778": [],
};

const ids = "41054801,42208956,40081498,41948476,40963161,41187967,39495965,41424209,39453356,41216778";
const e = await get(
  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${ids}`
);
console.log("===== EFETCH EXTRAS STATUS", e.status, "len", e.text.length, "=====");
printAbstracts(e.text, needMap);

await sleep(500);
for (const name of ["amycretin", "survodutide"]) {
  await sleep(400);
  const fda = await get(
    `https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22${name}%22&limit=8`
  );
  console.log("===== OPENFDA GENERIC", name.toUpperCase(), "STATUS", fda.status, "=====");
  try {
    const j = JSON.parse(fda.text);
    console.log(
      JSON.stringify(
        {
          total: j.meta?.results?.total,
          error: j.error,
          apps: (j.results || []).map((r) => ({
            appl: r.application_number,
            sponsor: r.sponsor_name,
            brands: [...new Set((r.products || []).map((p) => p.brand_name))],
          })),
        },
        null,
        2
      )
    );
  } catch {
    console.log(fda.text.slice(0, 800));
  }
}
