/**
 * TICK69 enrollment + design fields omitted from fetch1 NCT dump.
 */
const ncts = [
  "NCT04838405",
  "NCT06525935",
  "NCT06628362",
  "NCT07351045",
  "NCT07351058",
];

async function main() {
  for (const nct of ncts) {
    const url = "https://clinicaltrials.gov/api/v2/studies/" + nct;
    const res = await fetch(url, {
      headers: { "User-Agent": "pepcodex-tick69/1.0 (integrity; cited-only compare)" },
    });
    const json = await res.json();
    const s = json?.protocolSection ? json : json?.studies?.[0] || json;
    const proto = s.protocolSection || {};
    const statusM = proto.statusModule || {};
    console.log(
      JSON.stringify(
        {
          status: res.status,
          nct: proto.identificationModule?.nctId,
          enroll: statusM.enrollmentInfo,
          start: statusM.startDateStruct,
          primaryCompletion: statusM.primaryCompletionDateStruct,
          completion: statusM.completionDateStruct,
          hasResults: s.hasResults ?? json.hasResults,
        },
        null,
        2
      )
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
