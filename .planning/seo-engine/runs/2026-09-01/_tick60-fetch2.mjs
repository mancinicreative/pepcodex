/**
 * TICK60 fetch2: CT.gov enrollment + openFDA retry.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick60/1.0 (integrity; cited-only compare)" },
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

async function retry(fn, n = 5) {
  let last;
  for (let i = 1; i <= n; i++) {
    last = await fn();
    if (last.status === 200 && !last.json?._parseError) return last;
    console.log("retry", i, "status", last.status);
    await sleep(1000 * i);
  }
  return last;
}

async function ctgovNct(nct) {
  const url = "https://clinicaltrials.gov/api/v2/studies/" + nct;
  const { status, json } = await retry(() => getJson(url, `CT.gov ${nct}`));
  const s = json?.protocolSection ? json : (json?.studies && json.studies[0]) || json;
  const proto = s.protocolSection || {};
  const id = proto.identificationModule || {};
  const statusM = proto.statusModule || {};
  const design = proto.designModule || {};
  const outcomes = proto.outcomesModule || {};
  const row = {
    nct: id.nctId,
    brief: id.briefTitle,
    acronym: id.acronym,
    status: statusM.overallStatus,
    phase: (design.phases || []).join("/"),
    enrollStatus: statusM.enrollmentInfo,
    enrollDesign: design.enrollmentInfo,
    hasResults: s.hasResults ?? json.hasResults,
    primary: (outcomes.primaryOutcomes || []).map((o) => o.measure),
    primaryCompletion: statusM.primaryCompletionDateStruct,
    sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
    collaborator: (proto.sponsorCollaboratorsModule?.collaborators || []).map((c) => c.name),
  };
  console.log(JSON.stringify(row, null, 2));
  return { status, row };
}

async function openfda(generic) {
  const url =
    "https://api.fda.gov/drug/drugsfda.json?limit=1&search=" +
    encodeURIComponent(`openfda.generic_name:"${generic}"`);
  const { status, json } = await retry(() => getJson(url, `openFDA generic ${generic}`));
  if (json?.error) {
    console.log(`error=${json.error.code} ${json.error.message}`);
    return { status, found: false };
  }
  const hit = json?.results?.[0];
  console.log(
    JSON.stringify(
      {
        found: !!hit,
        brand: hit?.openfda?.brand_name,
        generic: hit?.openfda?.generic_name,
        appNo: hit?.application_number,
      },
      null,
      2
    )
  );
  return { status, found: !!hit };
}

async function main() {
  console.log("TICK60 fetch2 start", new Date().toISOString());
  for (const nct of ["NCT04838405", "NCT06525935", "NCT06628362", "NCT07351045", "NCT07351058"]) {
    await ctgovNct(nct);
    await sleep(300);
  }
  for (const g of [
    "5-amino-1mq",
    "5-amino-1-methylquinolinium",
    "ct-388",
    "ct388",
    "enicepatide",
    "ro7795068",
  ]) {
    await openfda(g);
    await sleep(300);
  }
  console.log("\nTICK60 fetch2 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
