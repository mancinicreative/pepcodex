const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const queries = [
  ["generic survodutide", 'openfda.generic_name:"survodutide"'],
  ["generic semaglutide", 'openfda.generic_name:"semaglutide"'],
  ["brand wegovy products", 'products.brand_name:"WEGOVY"'],
  ["brand ozempic products", 'products.brand_name:"OZEMPIC"'],
  ["brand rybelsus products", 'products.brand_name:"RYBELSUS"'],
  ["openfda brand wegovy", 'openfda.brand_name:"WEGOVY"'],
];

for (const [label, q] of queries) {
  const url = `https://api.fda.gov/drug/drugsfda.json?search=${encodeURIComponent(q)}&limit=8`;
  const fda = await get(url);
  console.log("===== OPENFDA", label, "STATUS", fda.status, "=====");
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
  } catch (err) {
    console.log("FAIL", err.message, fda.text.slice(0, 200));
  }
  await sleep(350);
}
