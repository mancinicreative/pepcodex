/**
 * TICK63 fetch2: full abstracts + ORIG AP + enrollment.
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
  for (let i = 1; i <= 4; i++) {
    last = await fn();
    if (last.status === 200) return last;
    console.log("retry", i, "status", last.status);
    await sleep(800 * i);
  }
  return last;
}

async function efetch(id) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=" +
    id;
  const { text } = await retry(() => get(url, `efetch ${id}`));
  console.log(text);
}

async function ctgovNct(nct) {
  const url = "https://clinicaltrials.gov/api/v2/studies/" + nct;
  const { text } = await retry(() => get(url, `CT.gov ${nct}`));
  const json = JSON.parse(text);
  const proto = json.protocolSection || {};
  const statusM = proto.statusModule || {};
  const design = proto.designModule || {};
  console.log(
    JSON.stringify(
      {
        nct: proto.identificationModule?.nctId,
        hasResults: json.hasResults,
        status: statusM.overallStatus,
        phase: design.phases,
        enrollStatus: statusM.enrollmentInfo,
        enrollDesign: design.enrollmentInfo,
        start: statusM.startDateStruct,
        primaryCompletion: statusM.primaryCompletionDateStruct,
        completion: statusM.completionDateStruct,
      },
      null,
      2
    )
  );
}

async function openfdaApp(appNo) {
  const url =
    "https://api.fda.gov/drug/drugsfda.json?limit=1&search=" +
    encodeURIComponent(`application_number:"${appNo}"`);
  const { text } = await retry(() => get(url, `openFDA app ${appNo}`));
  const json = JSON.parse(text);
  const r = json.results?.[0] || {};
  const orig = (r.submissions || []).filter((s) => s.submission_type === "ORIG");
  console.log(
    JSON.stringify(
      {
        appl: r.application_number,
        sponsor: r.sponsor_name,
        brands: r.openfda?.brand_name || [...new Set((r.products || []).map((p) => p.brand_name))],
        generic: r.openfda?.generic_name,
        orig,
      },
      null,
      2
    )
  );
}

async function main() {
  for (const id of ["35013352", "39067875", "33645410", "26132939", "27295427", "26510028"]) {
    await efetch(id);
    await sleep(350);
  }
  for (const nct of ["NCT01272219", "NCT01179048"]) {
    await ctgovNct(nct);
    await sleep(250);
  }
  for (const app of ["NDA022341", "NDA206321"]) {
    await openfdaApp(app);
    await sleep(200);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
