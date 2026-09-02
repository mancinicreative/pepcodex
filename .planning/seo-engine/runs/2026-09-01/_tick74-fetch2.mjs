/**
 * TICK74 fetch2: VENTURE abstract, enrollment from designModule, openFDA retry.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick74/1.0 (integrity; cited-only compare)" },
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
    headers: { "User-Agent": "pepcodex-tick74/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, text };
}

async function retry(fn, n = 5) {
  let last;
  for (let i = 1; i <= n; i++) {
    try {
      last = await fn();
      if (last.status === 200 || last.status === 404) return last;
      console.log("retry", i, "status", last.status);
    } catch (e) {
      console.log("retry", i, "error", e.cause?.code || e.message);
      last = { status: 0, json: null, text: String(e) };
    }
    await sleep(1000 * i);
  }
  return last;
}

async function main() {
  console.log("TICK74 fetch2 start", new Date().toISOString());

  const { status, text } = await retry(() =>
    getText(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=41508550",
      "efetch 41508550"
    )
  );
  console.log("efetch_status", status);
  console.log(text);

  for (const nct of [
    "NCT06068946",
    "NCT05203237",
    "NCT06828055",
    "NCT07104500",
    "NCT07104383",
  ]) {
    const { json } = await retry(() =>
      getJson("https://clinicaltrials.gov/api/v2/studies/" + nct, `CT.gov ${nct}`)
    );
    const s = json?.protocolSection ? json : (json?.studies && json.studies[0]) || json;
    const proto = s.protocolSection || {};
    const design = proto.designModule || {};
    const statusM = proto.statusModule || {};
    const id = proto.identificationModule || {};
    console.log(
      JSON.stringify(
        {
          nct: id.nctId,
          acronym: id.acronym,
          brief: id.briefTitle,
          status: statusM.overallStatus,
          hasResults: s.hasResults ?? json.hasResults,
          enrollDesign: design.enrollmentInfo,
          enrollStatus: statusM.enrollmentInfo,
          primaryCompletion: statusM.primaryCompletionDateStruct,
        },
        null,
        2
      )
    );
    await sleep(250);
  }

  for (const g of ["5-amino-1mq", "5-amino-1-methylquinolinium", "vk2735"]) {
    const url =
      "https://api.fda.gov/drug/drugsfda.json?limit=4&search=" +
      encodeURIComponent(`openfda.generic_name:"${g}"`);
    const r = await retry(() => getJson(url, `openFDA generic ${g}`));
    if (r.json?.error) console.log("error", r.json.error.code, r.json.error.message);
    else console.log(JSON.stringify({ total: r.json?.meta?.results?.total }, null, 2));
    await sleep(400);
  }

  console.log("\nTICK74 fetch2 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
