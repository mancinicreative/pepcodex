const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const queries = [
  "application_number:NDA209637",
  "application_number:NDA215256",
  "application_number:NDA213051",
  "application_number:NDA218808",
  'products.brand_name:"WEGOVY"',
  'products.brand_name:"OZEMPIC"',
  'products.brand_name:"RYBELSUS"',
  "openfda.substance_name:SEMAGLUTIDE",
];

for (const q of queries) {
  const fda = await get(
    `https://api.fda.gov/drug/drugsfda.json?search=${encodeURIComponent(q)}&limit=3`
  );
  console.log("===== OPENFDA", q, "STATUS", fda.status, "=====");
  try {
    const j = JSON.parse(fda.text);
    const rows = (j.results || []).map((r) => ({
      appl: r.application_number,
      sponsor: r.sponsor_name,
      submissions: (r.submissions || []).slice(0, 2).map((s) => ({
        type: s.submission_type,
        status: s.submission_status,
        date: s.submission_status_date,
      })),
      products: (r.products || []).slice(0, 8).map((p) => ({
        brand: p.brand_name,
        form: p.dosage_form,
        route: p.route,
        marketing: p.marketing_status,
      })),
      openfda: r.openfda
        ? {
            brand: r.openfda.brand_name,
            generic: r.openfda.generic_name,
            route: r.openfda.route,
          }
        : null,
    }));
    console.log(JSON.stringify({ count: j.meta?.results?.total, rows }, null, 2));
  } catch {
    console.log(fda.text.slice(0, 600));
  }
  console.log("");
  await new Promise((r) => setTimeout(r, 300));
}
