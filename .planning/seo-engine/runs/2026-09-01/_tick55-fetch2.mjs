/**
 * TICK55 fetch2: full phase-2 + TRIUMPH abstracts, H2H titles, NCT extras, openFDA retry.
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
  for (const c of parts) {
    const pm = (c.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
    const title = ((c.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || "")
      .replace(/<[^>]+>/g, "")
      .trim();
    const year = (c.match(/<Year>(\d{4})<\/Year>/) || [])[1];
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
    console.log("TITLE:", title);
    console.log("PUBTYPES:", pubtypes.join("; "));
    console.log("TITLE_MATCH:", titleMatch, "need:", need.join(","));
    console.log("NCT:", [...new Set(nct)].join(", "));
    console.log(abstracts.join("\n\n") || "(no abstract)");
    console.log("");
  }
}

const p2 = await get(
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=37366315,41090431"
);
console.log("===== EFETCH P2+TRIUMPH STATUS", p2.status, "len", p2.text.length, "=====");
printAbstracts(p2.text, { "37366315": ["retatrutide"], "41090431": ["retatrutide"] });

await sleep(400);
const h2h = "41054801,42208956,40206909,40081498,41948476,40949933,42444567,42673585";
const h2hNeed = {};
for (const id of h2h.split(",")) h2hNeed[id] = ["amycretin"];
const h = await get(
  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${h2h}`
);
console.log("===== EFETCH H2H STATUS", h.status, "len", h.text.length, "=====");
printAbstracts(h.text, h2hNeed);

await sleep(400);
const extras = "41589220,41216380,41201783,38858523,22759797";
const e = await get(
  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${extras}`
);
console.log("===== EFETCH EXTRAS STATUS", e.status, "len", e.text.length, "=====");
printAbstracts(e.text, {
  "41589220": ["retatrutide"],
  "41216380": ["retatrutide"],
  "41201783": ["retatrutide"],
  "38858523": ["retatrutide"],
  "22759797": ["retatrutide"],
});

for (const name of ["amycretin", "retatrutide"]) {
  await sleep(500);
  try {
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
  } catch (err) {
    console.log("===== OPENFDA GENERIC", name.toUpperCase(), "ERROR", err.cause?.code || err.message, "=====");
  }
}
