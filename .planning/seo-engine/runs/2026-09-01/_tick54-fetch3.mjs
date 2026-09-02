/**
 * TICK54 fetch3: IMPACT findings slice + enrollment counts.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, 350));

async function main() {
  console.log("TICK54 fetch3 start", new Date().toISOString());

  const absRes = await fetch(
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=41237796",
    { headers: { "User-Agent": "pepcodex-tick54/1.0 (integrity; cited-only compare)" } }
  );
  const abs = await absRes.text();
  console.log("\n=== efetch 41237796 STATUS", absRes.status, "len", abs.length, "===");
  const start = abs.indexOf("FINDINGS:");
  const end = abs.indexOf("FUNDING:");
  console.log(abs.slice(start >= 0 ? start : 0, end > start ? end : abs.length));

  await sleep(300);

  for (const nct of [
    "NCT05369390",
    "NCT06064006",
    "NCT05989711",
    "NCT05295875",
    "NCT05006885",
    "NCT05292911",
    "NCT07795164",
  ]) {
    const res = await fetch("https://clinicaltrials.gov/api/v2/studies/" + nct, {
      headers: { "User-Agent": "pepcodex-tick54/1.0 (integrity; cited-only compare)" },
    });
    const json = await res.json();
    const s = json.protocolSection ? json : (json.studies && json.studies[0]) || json;
    const proto = s.protocolSection || {};
    const statusM = proto.statusModule || {};
    console.log(
      "\n=== CT.gov",
      nct,
      "STATUS",
      res.status,
      "===\n",
      JSON.stringify(
        {
          nct: proto.identificationModule?.nctId,
          acronym: proto.identificationModule?.acronym,
          status: statusM.overallStatus,
          enroll: statusM.enrollmentInfo,
          hasResults: s.hasResults ?? json.hasResults,
          sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
        },
        null,
        2
      )
    );
    await sleep(250);
  }

  console.log("\nTICK54 fetch3 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
