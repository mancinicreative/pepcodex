/**
 * TICK64 openFDA retry after fetch1 connect-timeout.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, 600));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick64/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _parseError: true, _rawHead: text.slice(0, 240) };
  }
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, json };
}

async function retry(fn, n = 5) {
  let last;
  for (let i = 1; i <= n; i++) {
    try {
      last = await fn();
      if (last.status === 200 || last.status === 404) return last;
      console.log("retry", i, "status", last.status);
    } catch (e) {
      console.log("retry", i, "error", e.cause?.code || e.message);
      last = { status: 0, json: { error: { code: String(e.cause?.code || e.message) } } };
    }
    await sleep(1000 * i);
  }
  return last;
}

async function openfda(field, value) {
  const url =
    "https://api.fda.gov/drug/drugsfda.json?limit=1&search=" +
    encodeURIComponent(`openfda.${field}:"${value}"`);
  const { status, json } = await retry(() => getJson(url, `openFDA ${field} ${value}`));
  if (json?.error) {
    console.log(`error=${json.error.code} ${json.error.message || ""}`);
    return { status, found: false };
  }
  const hit = json?.results?.[0];
  console.log(
    JSON.stringify(
      {
        found: !!hit,
        brand: hit?.openfda?.brand_name,
        generic: hit?.openfda?.generic_name,
        appNo: hit?.application_number,
      },
      null,
      2
    )
  );
  return { status, found: !!hit };
}

async function main() {
  console.log("TICK64 fetch2 start", new Date().toISOString());
  for (const g of ["5-amino-1mq", "5-amino-1-methylquinolinium", "liraglutide"]) {
    await openfda("generic_name", g);
    await sleep(400);
  }
  for (const b of ["Saxenda", "Victoza"]) {
    await openfda("brand_name", b);
    await sleep(400);
  }
  console.log("\nTICK64 fetch2 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
