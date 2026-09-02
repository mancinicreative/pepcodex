/**
 * TICK76 fetch2: full SYNCHRONIZE-1 abstract + openFDA retry.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function retry(fn, n = 6) {
  let last;
  for (let i = 1; i <= n; i++) {
    try {
      last = await fn();
      if (last.status === 200) return last;
      console.log("retry", i, "status", last.status);
    } catch (e) {
      console.log("retry", i, "error", e.cause?.code || e.message);
      last = { status: 0, text: String(e), json: null };
    }
    await sleep(1200 * i);
  }
  return last;
}

async function getText(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick76/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} len=${text.length} ===`);
  return { status: res.status, text };
}

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick76/1.0 (integrity; cited-only compare)" },
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

async function main() {
  console.log("TICK76 fetch2 start", new Date().toISOString());

  const { text } = await retry(() =>
    getText(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=42253238",
      "efetch 42253238"
    )
  );
  console.log("\n--- FULL 42253238 ---");
  console.log(text);
  console.log("--- END 42253238 ---\n");

  const nct = await retry(() =>
    getJson("https://clinicaltrials.gov/api/v2/studies/NCT06066515", "CT.gov NCT06066515 enroll")
  );
  const proto = nct.json?.protocolSection || {};
  console.log(
    JSON.stringify(
      {
        nct: proto.identificationModule?.nctId,
        acronym: proto.identificationModule?.acronym,
        enroll: proto.statusModule?.enrollmentInfo,
        hasResults: nct.json?.hasResults,
        status: proto.statusModule?.overallStatus,
        phase: proto.designModule?.phases,
      },
      null,
      2
    )
  );

  for (const g of ["5-amino-1mq", "5-amino-1-methylquinolinium", "survodutide", "bi456906"]) {
    const url =
      "https://api.fda.gov/drug/drugsfda.json?limit=1&search=" +
      encodeURIComponent(`openfda.generic_name:"${g}"`);
    const { status, json } = await retry(() => getJson(url, `openFDA generic ${g}`));
    if (json?.error) console.log(`error=${json.error.code} ${json.error.message}`);
    else {
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
    }
    await sleep(400);
  }

  console.log("TICK76 fetch2 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
