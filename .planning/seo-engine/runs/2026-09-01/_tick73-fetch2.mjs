/**
 * TICK73 fetch2: MASLD abstracts + MOMENTUM/PERFORMA registry detail.
 * Per-alias. Not OR-joined. Title-match before quote.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, 450));

async function retry(fn, n = 5) {
  let last;
  for (let i = 1; i <= n; i++) {
    try {
      last = await fn();
      if (last.status === 200 || last.status === 404) return last;
      console.log("retry", i, "status", last.status);
    } catch (e) {
      console.log("retry", i, "error", e.cause?.code || e.message);
      last = { status: 0, json: null, text: "" };
    }
    await sleep(800 * i);
  }
  return last;
}

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick73/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _parseError: true, _rawHead: text.slice(0, 200) };
  }
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, json, text };
}

async function getText(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick73/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, text };
}

async function efetchXml(id) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=xml&id=" +
    id;
  const { status, text } = await retry(() => getText(url, `efetch xml ${id}`));
  const title = (text.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || "";
  const abstracts = [...text.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)].map((m) => {
    const label = (m[1].match(/Label="([^"]+)"/) || [])[1] || "";
    const body = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return (label ? label + ": " : "") + body;
  });
  const doi = (text.match(/<ArticleId IdType="doi">([^<]+)<\/ArticleId>/) || [])[1] || "";
  const nct = [...new Set([...text.matchAll(/NCT\d{8}/g)].map((m) => m[0]))];
  console.log("TITLE:", title.replace(/\s+/g, " ").trim());
  console.log("DOI:", doi);
  console.log("NCT:", nct.join(","));
  console.log("ABSTRACT:\n" + abstracts.join("\n\n"));
  return { status, title };
}

async function ctgovNct(nct) {
  const url = "https://clinicaltrials.gov/api/v2/studies/" + nct;
  const { status, json } = await retry(() => getJson(url, `CT.gov ${nct}`));
  const s = json?.protocolSection ? json : (json?.studies && json.studies[0]) || json;
  const proto = s.protocolSection || {};
  console.log(
    JSON.stringify(
      {
        nct: proto.identificationModule?.nctId,
        brief: proto.identificationModule?.briefTitle,
        acronym: proto.identificationModule?.acronym,
        official: proto.identificationModule?.officialTitle,
        status: proto.statusModule?.overallStatus,
        phase: (proto.designModule?.phases || []).join("/"),
        enroll: proto.statusModule?.enrollmentInfo,
        start: proto.statusModule?.startDateStruct,
        primaryCompletion: proto.statusModule?.primaryCompletionDateStruct,
        completion: proto.statusModule?.completionDateStruct,
        hasResults: s.hasResults ?? json.hasResults,
        sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
        conditions: proto.conditionsModule?.conditions,
        interventions: (proto.armsInterventionsModule?.interventions || []).map((i) => i.name),
      },
      null,
      2
    )
  );
}

async function main() {
  console.log("TICK73 fetch2 start", new Date().toISOString());
  for (const id of ["39002641", "41113119"]) {
    await efetchXml(id);
    await sleep(400);
  }
  for (const nct of ["NCT05295875", "NCT07795164", "NCT05006885", "NCT05292911", "NCT05989711"]) {
    await ctgovNct(nct);
    await sleep(250);
  }
  console.log("\nTICK73 fetch2 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
