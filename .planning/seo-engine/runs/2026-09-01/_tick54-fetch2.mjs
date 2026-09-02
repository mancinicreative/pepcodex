/**
 * TICK54 fetch2: full abstracts + NCT detail + MOMENTUM PubMed 0 + enroll.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, 400));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick54/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _parseError: true, _rawHead: text.slice(0, 240) };
  }
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, json, text };
}

async function getText(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick54/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} len=${text.length} ===`);
  return { status: res.status, text };
}

async function efetchFull(id) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=" +
    id;
  const { status, text } = await getText(url, `efetch-full ${id}`);
  console.log(text);
  return { status, text };
}

async function esearch(term) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=10&term=" +
    encodeURIComponent(term);
  const { status, json } = await getJson(url, `esearch ${term}`);
  const ids = json?.esearchresult?.idlist || [];
  const count = json?.esearchresult?.count;
  console.log(`count=${count} ids=${ids.join(",")}`);
  return { status, count, ids };
}

async function ctgovNct(nct) {
  const url = "https://clinicaltrials.gov/api/v2/studies/" + nct + "?fields=NCTId,BriefTitle,OfficialTitle,Acronym,OverallStatus,Phase,EnrollmentInfo,HasResults,PrimaryOutcomeMeasure,LeadSponsorName,Condition,InterventionName";
  const { status, json } = await getJson(url, `CT.gov ${nct}`);
  const s = json?.protocolSection ? json : (json?.studies && json.studies[0]) || json;
  const proto = s.protocolSection || {};
  const id = proto.identificationModule || {};
  const statusM = proto.statusModule || {};
  const design = proto.designModule || {};
  const outcomes = proto.outcomesModule || {};
  const cond = proto.conditionsModule || {};
  const row = {
    nct: id.nctId,
    brief: id.briefTitle,
    official: id.officialTitle,
    acronym: id.acronym,
    status: statusM.overallStatus,
    phase: (design.phases || []).join("/"),
    enrollType: statusM.enrollmentInfo?.type,
    enrollCount: statusM.enrollmentInfo?.count,
    hasResults: s.hasResults ?? json.hasResults,
    primary: (outcomes.primaryOutcomes || []).map((o) => ({
      measure: o.measure,
      timeFrame: o.timeFrame,
    })),
    sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
    conditions: cond.conditions,
  };
  console.log(JSON.stringify(row, null, 2));
  return { status, row };
}

async function main() {
  console.log("TICK54 fetch2 start", new Date().toISOString());

  for (const id of ["40550229", "40550231", "41237796"]) {
    await efetchFull(id);
    await sleep(400);
  }

  for (const term of [
    "NCT05369390",
    "NCT06064006",
    "NCT05989711",
    "NCT05295875",
    "NCT05006885",
    "NCT05292911",
    "NCT07795164",
    '"MOMENTUM" AND pemvidutide',
    '"MOMENTUM Trial" AND (pemvidutide OR ALT-801)',
  ]) {
    await esearch(term);
    await sleep(350);
  }

  for (const nct of [
    "NCT05369390",
    "NCT06064006",
    "NCT05989711",
    "NCT05295875",
    "NCT05006885",
    "NCT05292911",
    "NCT07795164",
  ]) {
    await ctgovNct(nct);
    await sleep(250);
  }

  console.log("\nTICK54 fetch2 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
