/**
 * TICK70 follow-up: full SURMOUNT-1 abstract + NCT enrollment.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function retry(fn, n = 6) {
  let last;
  for (let i = 1; i <= n; i++) {
    try {
      last = await fn();
      if (last.status === 200 || last.status === 404) return last;
      console.log("retry", i, "status", last.status);
    } catch (err) {
      last = { status: 0 };
      console.log("retry", i, "network", err?.cause?.code || err.message);
    }
    await sleep(1200 * i);
  }
  return last;
}

async function getText(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick70/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, text };
}

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick70/1.0 (integrity; cited-only compare)" },
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
  const { text } = await retry(() =>
    getText(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=35658024",
      "efetch 35658024 full"
    )
  );
  console.log(text);
  console.log("\n=== ABSTRACT TAIL ===");
  const idx = text.toLowerCase().indexOf("results:");
  console.log(idx >= 0 ? text.slice(idx) : text.slice(-2500));

  await sleep(400);
  const { json } = await retry(() =>
    getJson("https://clinicaltrials.gov/api/v2/studies/NCT04184622", "CT.gov NCT04184622 full")
  );
  const proto = json?.protocolSection || {};
  console.log(
    JSON.stringify(
      {
        nct: proto.identificationModule?.nctId,
        status: proto.statusModule?.overallStatus,
        phase: proto.designModule?.phases,
        enroll: proto.statusModule?.enrollmentInfo,
        hasResults: json?.hasResults,
        sponsor: proto.sponsorCollaboratorsModule?.leadSponsor,
        primaryCompletion: proto.statusModule?.primaryCompletionDateStruct,
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
