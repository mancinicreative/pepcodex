/**
 * TICK63 fetch3: ORIG AP for Victoza / Saxenda only.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick63/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, text };
}

async function retry(fn) {
  let last;
  for (let i = 1; i <= 5; i++) {
    try {
      last = await fn();
      if (last.status === 200) return last;
      console.log("retry", i, "status", last.status);
    } catch (e) {
      console.log("retry", i, "error", e.cause?.code || e.message);
    }
    await sleep(1200 * i);
  }
  return last;
}

async function openfdaApp(appNo) {
  const url =
    "https://api.fda.gov/drug/drugsfda.json?limit=1&search=" +
    encodeURIComponent(`application_number:"${appNo}"`);
  const { text } = await retry(() => get(url, `openFDA app ${appNo}`));
  const json = JSON.parse(text);
  const r = json.results?.[0] || {};
  const orig = (r.submissions || []).filter((s) => s.submission_type === "ORIG");
  const firstAp = (r.submissions || [])
    .filter((s) => s.submission_status === "AP")
    .sort((a, b) => String(a.submission_status_date).localeCompare(String(b.submission_status_date)))
    .slice(0, 3);
  console.log(
    JSON.stringify(
      {
        appl: r.application_number,
        sponsor: r.sponsor_name,
        brands: r.openfda?.brand_name || [...new Set((r.products || []).map((p) => p.brand_name))],
        generic: r.openfda?.generic_name,
        orig,
        earliestAp: firstAp,
      },
      null,
      2
    )
  );
}

async function main() {
  for (const app of ["NDA022341", "NDA206321"]) {
    await openfdaApp(app);
    await sleep(400);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
