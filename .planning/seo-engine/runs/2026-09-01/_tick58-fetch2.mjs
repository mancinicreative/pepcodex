/**
 * TICK58 fetch2: full abstracts + CT.gov enrollment for cited NCTs.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function retryGet(url, label) {
  for (let i = 1; i <= 4; i++) {
    const res = await fetch(url, {
      headers: { "User-Agent": "pepcodex-tick58/1.0 (integrity; cited-only compare)" },
    });
    const text = await res.text();
    console.log(`\n=== ${label} try ${i} STATUS ${res.status} len ${text.length} ===`);
    if (res.status === 200 && text.length > 200) return { status: res.status, text };
    await sleep(800 * i);
  }
  return { status: 0, text: "" };
}

async function main() {
  for (const id of ["34798060", "40544433", "33645410", "41328546"]) {
    const url =
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=" +
      id;
    const { text } = await retryGet(url, "efetch " + id);
    console.log(text);
    await sleep(400);
  }

  for (const nct of ["NCT03856047", "NCT05567796"]) {
    const url = "https://clinicaltrials.gov/api/v2/studies/" + nct;
    const { text } = await retryGet(url, "CT.gov " + nct);
    try {
      const j = JSON.parse(text);
      const proto = j.protocolSection || {};
      const statusM = proto.statusModule || {};
      const design = proto.designModule || {};
      console.log(
        JSON.stringify(
          {
            nct,
            status: statusM.overallStatus,
            hasResults: j.hasResults,
            phases: design.phases,
            enrollStatus: statusM.enrollmentInfo,
            enrollDesign: design.enrollmentInfo,
            start: statusM.startDateStruct,
            primaryCompletion: statusM.primaryCompletionDateStruct,
          },
          null,
          2
        )
      );
    } catch (e) {
      console.log(text.slice(0, 400), e.message);
    }
    await sleep(250);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
