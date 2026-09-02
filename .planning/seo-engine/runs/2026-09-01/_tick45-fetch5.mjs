const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };

async function get(url) {
  const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(40000) });
  const text = await r.text();
  return { status: r.status, text };
}

const queries = [
  ["GENERIC 5-amino-1mq", "openfda.generic_name:%225-amino-1mq%22"],
  ["BRAND WEGOVY", "openfda.brand_name:%22WEGOVY%22"],
  ["BRAND OZEMPIC", "openfda.brand_name:%22OZEMPIC%22"],
];

for (const [name, q] of queries) {
  try {
    const url = `https://api.fda.gov/drug/drugsfda.json?search=${q}&limit=5`;
    const { status, text } = await get(url);
    console.log("===== OPENFDA", name, "STATUS", status, "=====");
    const j = JSON.parse(text);
    console.log(
      JSON.stringify(
        {
          total: j.meta?.results?.total,
          error: j.error,
          apps: (j.results || []).slice(0, 5).map((r) => ({
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
    console.log("===== OPENFDA", name, "ERROR", err.cause?.code || err.message, "=====");
  }
}
