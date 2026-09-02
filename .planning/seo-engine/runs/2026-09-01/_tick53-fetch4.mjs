const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  let last;
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: UA });
      const text = await r.text();
      return { status: r.status, text };
    } catch (err) {
      last = err;
      console.log("RETRY", i + 1, url.slice(0, 80), err.cause?.code || err.message);
      await sleep(1500 * (i + 1));
    }
  }
  throw last;
}

function printApps(j) {
  return {
    total: j.meta?.results?.total,
    error: j.error,
    apps: (j.results || []).map((r) => ({
      appl: r.application_number,
      sponsor: r.sponsor_name,
      products: (r.products || []).slice(0, 4).map((p) => ({
        brand: p.brand_name,
        generic: p.generic_name,
      })),
      submissions: (r.submissions || [])
        .filter((s) => s.submission_type === "ORIG")
        .map((s) => ({
          type: s.submission_type,
          number: s.submission_number,
          status: s.submission_status,
          date: s.submission_status_date,
        })),
    })),
  };
}

const queries = [
  ["GENERIC amycretin", "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22amycretin%22&limit=8"],
  ["GENERIC orforglipron", "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22orforglipron%22&limit=8"],
  ["BRAND Foundayo", "https://api.fda.gov/drug/drugsfda.json?search=openfda.brand_name:%22Foundayo%22&limit=8"],
  ["NDA220934", "https://api.fda.gov/drug/drugsfda.json?search=application_number:NDA220934&limit=5"],
];
for (const [name, url] of queries) {
  await sleep(400);
  const fda = await get(url);
  console.log("===== OPENFDA", name, "STATUS", fda.status, "=====");
  try {
    console.log(JSON.stringify(printApps(JSON.parse(fda.text)), null, 2));
  } catch {
    console.log(fda.text.slice(0, 800));
  }
}
