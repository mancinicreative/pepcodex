/**
 * TICK64 openFDA submissions dates + CT.gov enroll. Not assumed from overwrite.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, 500));

async function retry(fn, n = 5) {
  let last;
  for (let i = 1; i <= n; i++) {
    try {
      last = await fn();
      if (last.status === 200 || last.status === 404) return last;
      console.log("retry", i, "status", last.status);
    } catch (e) {
      console.log("retry", i, "error", e.cause?.code || e.message);
      last = { status: 0, json: null };
    }
    await sleep(900 * i);
  }
  return last;
}

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick64/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _parseError: true, _rawHead: text.slice(0, 200) };
  }
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, json };
}

async function openfdaApp(appNo) {
  const url =
    "https://api.fda.gov/drug/drugsfda.json?limit=1&search=" +
    encodeURIComponent(`application_number:"${appNo}"`);
  const { status, json } = await retry(() => getJson(url, `openFDA app ${appNo}`));
  if (json?.error) {
    console.log("error", json.error);
    return;
  }
  const hit = json?.results?.[0];
  const submissions = (hit?.submissions || []).slice(0, 8).map((s) => ({
    type: s.submission_type,
    status: s.submission_status,
    statusDate: s.submission_status_date,
    class: s.submission_class_code,
  }));
  console.log(
    JSON.stringify(
      {
        appNo: hit?.application_number,
        brand: hit?.openfda?.brand_name,
        generic: hit?.openfda?.generic_name,
        submissions,
      },
      null,
      2
    )
  );
}

async function ctgovNct(nct) {
  const url = "https://clinicaltrials.gov/api/v2/studies/" + nct;
  const { status, json } = await retry(() => getJson(url, `CT.gov ${nct}`));
  const s = json?.protocolSection ? json : (json?.studies && json.studies[0]) || json;
  const proto = s.protocolSection || {};
  const statusM = proto.statusModule || {};
  console.log(
    JSON.stringify(
      {
        nct: proto.identificationModule?.nctId,
        status: statusM.overallStatus,
        enroll: statusM.enrollmentInfo,
        hasResults: s.hasResults ?? json.hasResults,
      },
      null,
      2
    )
  );
}

async function main() {
  console.log("TICK64 fetch4 start", new Date().toISOString());
  for (const app of ["NDA022341", "NDA206321", "ANDA217590"]) {
    await openfdaApp(app);
    await sleep(400);
  }
  for (const nct of ["NCT01272219", "NCT01179048"]) {
    await ctgovNct(nct);
    await sleep(300);
  }
  console.log("\nTICK64 fetch4 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
