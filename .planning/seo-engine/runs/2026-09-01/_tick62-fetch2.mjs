/**
 * TICK62 fetch2: NCT enrollment + other names + PubMed 0 for Phase 2/3.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, 350));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick62/1.0 (integrity; cited-only compare)" },
  });
  const json = await res.json();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, json };
}

async function esearch(term) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=" +
    encodeURIComponent(term);
  const { status, json } = await getJson(url, `esearch ${term}`);
  console.log(`count=${json?.esearchresult?.count} ids=${(json?.esearchresult?.idlist || []).join(",")}`);
}

async function ctgovNct(nct) {
  const url = "https://clinicaltrials.gov/api/v2/studies/" + nct + "?fields=NCTId,BriefTitle,OfficialTitle,Acronym,OverallStatus,Phase,EnrollmentCount,EnrollmentType,HasResults,LeadSponsorName,OrgFullName,PrimaryCompletionDate,PrimaryCompletionDateType,StartDate,Condition,InterventionName,PrimaryOutcomeMeasure,SecondaryId,OrgStudyId";
  const { status, json } = await getJson(url, `CT.gov ${nct}`);
  const s = json?.protocolSection ? json : (json?.studies && json.studies[0]) || json;
  const proto = s.protocolSection || {};
  const id = proto.identificationModule || {};
  const statusM = proto.statusModule || {};
  const design = proto.designModule || {};
  const arms = proto.armsInterventionsModule || {};
  const row = {
    nct: id.nctId,
    brief: id.briefTitle,
    acronym: id.acronym,
    orgStudyId: id.orgStudyIdInfo,
    secondaryIds: id.secondaryIdInfos,
    status: statusM.overallStatus,
    phase: design.phases || s.protocolSection?.designModule?.phases,
    enroll: statusM.enrollmentInfo,
    enrollRaw: json?.protocolSection?.statusModule?.enrollmentInfo,
    hasResults: s.hasResults ?? json.hasResults,
    sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
    collaborator: (proto.sponsorCollaboratorsModule?.collaborators || []).map((c) => c.name),
    interventions: (arms.interventions || []).map((i) => ({ name: i.name, other: i.otherNames })),
  };
  console.log(JSON.stringify(row, null, 2));
}

async function main() {
  for (const nct of [
    "NCT04838405",
    "NCT06525935",
    "NCT06628362",
    "NCT07351045",
    "NCT07351058",
  ]) {
    await ctgovNct(nct);
    await sleep(250);
  }
  for (const term of [
    "NCT07351045",
    "NCT07351058",
    "NCT07670416",
    '"Enith1"',
    '"Enith2"',
  ]) {
    await esearch(term);
    await sleep(350);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
