const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const extraIds = "42503495,42009015,41328546,40544432";
const eurl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${extraIds}`;
const e = await get(eurl);
console.log("===== EFETCH REDEFINE4-HITS STATUS", e.status, "=====");
const parts = e.text.split(/<PubmedArticle[ >]/).slice(1);
for (const c of parts) {
  const pm = (c.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
  const title = ((c.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || "")
    .replace(/<[^>]+>/g, "")
    .trim();
  const nct = [...c.matchAll(/NCT\d+/g)].map((x) => x[0]);
  console.log("PMID", pm, "|", title, "| NCT", [...new Set(nct)].join(", "));
}

for (const name of ["cagrilintide", "semaglutide"]) {
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
            forms: [...new Set((r.products || []).map((p) => p.dosage_form))],
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

for (const brand of ["OZEMPIC", "WEGOVY", "RYBELSUS"]) {
  await sleep(400);
  const fda = await get(
    `https://api.fda.gov/drug/drugsfda.json?search=products.brand_name:%22${brand}%22&limit=8`
  );
  console.log("===== OPENFDA BRAND", brand, "STATUS", fda.status, "=====");
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
            forms: [...new Set((r.products || []).map((p) => p.dosage_form))],
            routes: [...new Set((r.products || []).flatMap((p) => p.route || []))],
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
