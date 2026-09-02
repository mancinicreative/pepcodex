const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const queries = [
  ["appl-213051", "application_number:213051"],
  ["appl-209637", "application_number:209637"],
  ["appl-215256", "application_number:215256"],
  ["prod-wegovy", 'products.brand_name:"WEGOVY"'],
  ["prod-ozempic", 'products.brand_name:"OZEMPIC"'],
];

for (const [name, q] of queries) {
  await sleep(350);
  try {
    const url = `https://api.fda.gov/drug/drugsfda.json?search=${encodeURIComponent(q)}&limit=5`;
    const fda = await get(url);
    console.log("===== OPENFDA", name, "STATUS", fda.status, "=====");
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
            substances: r.openfda?.substance_name,
            generics: r.openfda?.generic_name,
          })),
        },
        null,
        2
      )
    );
  } catch (err) {
    console.log("===== OPENFDA", name, "FAIL", err.cause?.code || err.message, "=====");
  }
}
