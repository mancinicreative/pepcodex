const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30000);
  try {
    const r = await fetch(url, { headers: UA, signal: ctrl.signal });
    const text = await r.text();
    return { status: r.status, text };
  } finally {
    clearTimeout(t);
  }
}

const queries = [
  ["brand wegovy products", 'products.brand_name:"WEGOVY"'],
  ["brand ozempic products", 'products.brand_name:"OZEMPIC"'],
  ["brand rybelsus products", 'products.brand_name:"RYBELSUS"'],
];

for (const [label, q] of queries) {
  const url = `https://api.fda.gov/drug/drugsfda.json?search=${encodeURIComponent(q)}&limit=8`;
  try {
    const fda = await get(url);
    console.log("===== OPENFDA", label, "STATUS", fda.status, "=====");
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
    console.log("===== OPENFDA", label, "FAIL", err.cause?.code || err.message, "=====");
  }
  await sleep(500);
}
