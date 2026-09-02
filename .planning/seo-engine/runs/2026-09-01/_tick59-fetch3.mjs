/**
 * TICK59 fetch3: REDEFINE 1 remainder + enrollment counts.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, 300));

async function main() {
  const absUrl =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=40544433";
  const abs = await (await fetch(absUrl, { headers: { "User-Agent": "pepcodex-tick59/1.0" } })).text();
  const results = abs.split(/RESULTS:/i)[1] || abs;
  console.log("=== REDEFINE 1 RESULTS+ ===");
  console.log(results.slice(0, 2500));

  for (const nct of ["NCT05567796", "NCT05394519"]) {
    const url = "https://clinicaltrials.gov/api/v2/studies/" + nct;
    const j = await (await fetch(url, { headers: { "User-Agent": "pepcodex-tick59/1.0" } })).json();
    const proto = j.protocolSection || {};
    console.log(
      "\n=== " +
        nct +
        " ===\n" +
        JSON.stringify(
          {
            nct,
            status: proto.statusModule?.overallStatus,
            phase: proto.designModule?.phases,
            enroll: proto.statusModule?.enrollmentInfo,
            hasResults: j.hasResults,
            sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
          },
          null,
          2
        )
    );
    await sleep(200);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
