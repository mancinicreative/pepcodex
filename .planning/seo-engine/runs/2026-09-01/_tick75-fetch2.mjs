/**
 * TICK75 fetch2: truncated abstracts + CT.gov enrollment.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function retry(fn, n = 4) {
  let last;
  for (let i = 1; i <= n; i++) {
    last = await fn();
    if (last.status === 200) return last;
    console.log("retry", i, "status", last.status);
    await sleep(800 * i);
  }
  return last;
}

async function efetch(id) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=" +
    id;
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick75/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== efetch ${id} STATUS ${res.status} ===`);
  console.log(text);
  return { status: res.status, text };
}

async function ctgovNct(nct) {
  const url = "https://clinicaltrials.gov/api/v2/studies/" + nct;
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick75/1.0 (integrity; cited-only compare)" },
  });
  const json = await res.json();
  const s = json?.protocolSection ? json : (json?.studies && json.studies[0]) || json;
  const proto = s.protocolSection || {};
  const statusM = proto.statusModule || {};
  console.log(`\n=== CT.gov ${nct} STATUS ${res.status} ===`);
  console.log(
    JSON.stringify(
      {
        nct: proto.identificationModule?.nctId,
        status: statusM.overallStatus,
        enroll: statusM.enrollmentInfo,
        hasResults: s.hasResults ?? json.hasResults,
        sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
      },
      null,
      2
    )
  );
  return { status: res.status };
}

async function main() {
  for (const id of ["37366315", "41090431", "39067875", "33645410"]) {
    await retry(() => efetch(id));
    await sleep(400);
  }
  for (const nct of ["NCT04881760", "NCT06354660"]) {
    await ctgovNct(nct);
    await sleep(200);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
