/**
 * TICK54 fetch4: dump statusModule + pubmed nct title match for MASLD papers.
 */
async function main() {
  for (const nct of ["NCT05989711", "NCT05295875", "NCT05369390", "NCT06064006"]) {
    const res = await fetch("https://clinicaltrials.gov/api/v2/studies/" + nct, {
      headers: { "User-Agent": "pepcodex-tick54/1.0 (integrity; cited-only compare)" },
    });
    const json = await res.json();
    const keys = Object.keys(json);
    const protoKeys = Object.keys(json.protocolSection || {});
    const statusM = json.protocolSection?.statusModule || json.studies?.[0]?.protocolSection?.statusModule;
    console.log("\n===", nct, "STATUS", res.status, "topKeys", keys.join(","), "===");
    console.log("protoKeys", protoKeys.join(","));
    console.log("statusModule", JSON.stringify(statusM, null, 2));
    console.log("hasResults", json.hasResults);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
