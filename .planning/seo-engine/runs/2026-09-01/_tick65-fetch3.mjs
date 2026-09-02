/**
 * TICK65 fetch3: Zepbound ORIG + NCT enroll (openFDA timed out in fetch2).
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick65/1.0 (integrity; cited-only compare)" },
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
      if (last.status === 200) return last;
      console.log("retry", i, "status", last.status);
    } catch (e) {
      console.log("retry", i, "err", e.cause?.code || e.message);
      last = { status: 0, json: { error: String(e) } };
    }
    await sleep(1200 * i);
  }
  return last;
}

async function main() {
  const nct = await retry(() =>
    getJson(
      "https://clinicaltrials.gov/api/v2/studies/NCT04184622?fields=NCTId,BriefTitle,EnrollmentInfo,HasResults,OverallStatus,LeadSponsorName,Phase",
      "CT.gov NCT04184622 fields"
    )
  );
  const proto = nct.json?.protocolSection || nct.json?.studies?.[0]?.protocolSection || {};
  console.log(
    JSON.stringify(
      {
        nct: proto.identificationModule?.nctId,
        enroll: proto.statusModule?.enrollmentInfo,
        hasResults: nct.json?.hasResults,
        sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
      },
      null,
      2
    )
  );

  await sleep(400);

  for (const appl of ["NDA215866", "NDA217806"]) {
    const url =
      "https://api.fda.gov/drug/drugsfda.json?limit=1&search=" +
      encodeURIComponent(`application_number:"${appl}"`);
    const { json } = await retry(() => getJson(url, `openFDA appl ${appl}`));
    const r = json?.results?.[0] || {};
    const orig = (r.submissions || []).filter((s) => s.submission_type === "ORIG");
    console.log(
      JSON.stringify(
        {
          appl: r.application_number,
          sponsor: r.sponsor_name,
          brands: [...new Set((r.products || []).map((p) => p.brand_name))],
          orig,
        },
        null,
        2
      )
    );
    await sleep(300);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
