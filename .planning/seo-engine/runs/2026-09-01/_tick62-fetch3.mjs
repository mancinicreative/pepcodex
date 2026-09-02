/**
 * TICK62 fetch3: full protocol enrollment + other names (no fields filter).
 */
async function ctgovNct(nct) {
  const url = "https://clinicaltrials.gov/api/v2/studies/" + nct;
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick62/1.0 (integrity; cited-only compare)" },
  });
  const json = await res.json();
  const s = json?.protocolSection ? json : (json?.studies && json.studies[0]) || json;
  const proto = s.protocolSection || {};
  const statusM = proto.statusModule || {};
  const id = proto.identificationModule || {};
  const row = {
    nct: id.nctId,
    status: res.status,
    enrollKeys: statusM ? Object.keys(statusM) : [],
    enrollmentInfo: statusM.enrollmentInfo,
    enrollmentCount: statusM.enrollmentCount,
    overallStatus: statusM.overallStatus,
    primaryCompletion: statusM.primaryCompletionDateStruct,
    hasResults: s.hasResults,
    otherNames: id.officialTitle,
    aliases: proto.identificationModule,
  };
  console.log("\n===", nct, "STATUS", res.status, "===");
  console.log(JSON.stringify({
    nct: id.nctId,
    brief: id.briefTitle,
    overallStatus: statusM.overallStatus,
    enrollmentInfo: statusM.enrollmentInfo,
    primaryCompletion: statusM.primaryCompletionDateStruct,
    hasResults: s.hasResults,
    orgStudyId: id.orgStudyIdInfo,
    nctAliases: id.nctIdAliases,
    secondaryIds: id.secondaryIdInfos,
    sponsor: proto.sponsorCollaboratorsModule?.leadSponsor,
    collaborators: proto.sponsorCollaboratorsModule?.collaborators,
  }, null, 2));
}

async function main() {
  for (const nct of ["NCT04838405", "NCT06525935", "NCT06628362", "NCT07351045", "NCT07351058"]) {
    await ctgovNct(nct);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
