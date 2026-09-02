/**
 * TICK50 fetch2 — full abstracts + missed AMG 133 Phase 1 + NCT05669599.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick50/1.0 (integrity; cited-only compare)" },
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
    headers: { "User-Agent": "pepcodex-tick50/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, text };
}

async function esearch(term) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=8&term=" +
    encodeURIComponent(term);
  const { status, json } = await getJson(url, `esearch ${term}`);
  const ids = json?.esearchresult?.idlist || [];
  console.log(`count=${json?.esearchresult?.count} ids=${ids.join(",")}`);
  return { status, ids };
}

async function esummary(ids) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=" +
    ids.join(",");
  const { status, json } = await getJson(url, `esummary ${ids.join(",")}`);
  const result = json?.result || {};
  const rows = (json?.result?.uids || ids).map((id) => ({
    pmid: id,
    title: result[id]?.title,
    source: result[id]?.source,
    pubdate: result[id]?.pubdate,
    doi: (result[id]?.elocationid || "").replace(/^doi:\s*/i, ""),
  }));
  console.log(JSON.stringify(rows, null, 2));
  return { status, rows };
}

async function efetch(id) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=" +
    id;
  const { status, text } = await getText(url, `efetch FULL ${id}`);
  console.log(text);
  return { status, text };
}

async function ctgovNct(nct) {
  const url = "https://clinicaltrials.gov/api/v2/studies/" + nct;
  const { status, json } = await getJson(url, `CT.gov ${nct}`);
  const s = json?.protocolSection ? json : (json?.studies && json.studies[0]) || json;
  const proto = s.protocolSection || {};
  const id = proto.identificationModule || {};
  const statusM = proto.statusModule || {};
  const design = proto.designModule || {};
  const outcomes = proto.outcomesModule || {};
  const row = {
    nct: id.nctId,
    brief: id.briefTitle,
    official: id.officialTitle,
    otherNames: id.orgStudyIdInfo,
    status: statusM.overallStatus,
    phase: (design.phases || []).join("/"),
    enroll: statusM.enrollmentInfo,
    start: statusM.startDateStruct,
    primaryCompletion: statusM.primaryCompletionDateStruct,
    hasResults: s.hasResults ?? json.hasResults,
    primary: (outcomes.primaryOutcomes || []).slice(0, 4).map((o) => o.measure),
    secondary: (outcomes.secondaryOutcomes || []).slice(0, 6).map((o) => o.measure),
    sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
    conditions: proto.conditionsModule?.conditions,
  };
  console.log(JSON.stringify(row, null, 2));
  return { status, row };
}

async function main() {
  const moreIds = ["38316982", "36608818", "36509857", "38871982", "38388678", "41941715"];
  await esummary(moreIds);
  await sleep(350);

  for (const id of [
    "40550229",
    "40550231",
    "40549887",
    "38316982",
    "36608818",
    "36509857",
    "38388678",
    "41941715",
  ]) {
    await efetch(id);
    await sleep(400);
  }

  for (const nct of ["NCT05669599", "NCT05369390", "NCT06064006", "NCT06858878"]) {
    await ctgovNct(nct);
    await sleep(250);
  }

  for (const nct of ["NCT05669599", "NCT05369390", "NCT06064006"]) {
    await esearch(nct);
    await sleep(350);
  }

  console.log("\nTICK50 fetch2 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
