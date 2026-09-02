/**
 * TICK59 fetch2: full abstracts + CT.gov enrollment for cited NCTs.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, 400));

async function retryGet(url, label) {
  for (let i = 1; i <= 4; i++) {
    const res = await fetch(url, {
      headers: { "User-Agent": "pepcodex-tick59/1.0 (integrity; cited-only compare)" },
    });
    const text = await res.text();
    console.log(`\n=== ${label} try ${i} STATUS ${res.status} len ${text.length} ===`);
    if (res.status === 200 && text.length > 200) return { status: res.status, text };
    await sleep(800 * i);
  }
  return { status: 0, text: "" };
}

async function main() {
  for (const id of ["35013352", "40544433", "40544432", "41328546"]) {
    const url =
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=" +
      id;
    const { text } = await retryGet(url, "efetch " + id);
    console.log(text);
    await sleep(400);
  }

  for (const nct of ["NCT05567796", "NCT05394519"]) {
    const url = "https://clinicaltrials.gov/api/v2/studies/" + nct;
    const { text } = await retryGet(url, "CT.gov " + nct);
    try {
      const j = JSON.parse(text);
      const proto = j.protocolSection || {};
      const statusM = proto.statusModule || {};
      const design = proto.designModule || {};
      const id = proto.identificationModule || {};
      console.log(
        JSON.stringify(
          {
            nct,
            brief: id.briefTitle,
            acronym: id.acronym,
            status: statusM.overallStatus,
            phase: (design.phases || []).join("/"),
            enroll: statusM.enrollmentInfo,
            hasResults: j.hasResults,
            start: statusM.startDateStruct,
            lastUpdate: statusM.lastUpdatePostDateStruct,
          },
          null,
          2
        )
      );
    } catch (e) {
      console.log("parse fail", e.message);
    }
    await sleep(200);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
