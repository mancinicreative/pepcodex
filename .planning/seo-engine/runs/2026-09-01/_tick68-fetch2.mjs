/**
 * TICK68 fetch2: REDEFINE abstracts (skip collaborator dump) + AOD review misses.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getText(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick68/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} len=${text.length} ===`);
  return { status: res.status, text };
}

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

function printWindow(text, startNeedle, chars = 2800) {
  const idx = text.toUpperCase().indexOf(startNeedle.toUpperCase());
  if (idx < 0) {
    console.log("(needle not found)", startNeedle);
    console.log(text.slice(-2000));
    return;
  }
  console.log(text.slice(idx, idx + chars));
}

async function efetch(id) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=" +
    id;
  return retry(() => getText(url, `efetch ${id}`));
}

async function ctgovNct(nct) {
  const url = "https://clinicaltrials.gov/api/v2/studies/" + nct;
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick68/1.0 (integrity; cited-only compare)" },
  });
  const json = await res.json();
  const s = json?.protocolSection ? json : (json?.studies && json.studies[0]) || json;
  const proto = s.protocolSection || {};
  const statusM = proto.statusModule || {};
  const design = proto.designModule || {};
  console.log(
    `\n=== CT.gov ${nct} STATUS ${res.status} ===\n` +
      JSON.stringify(
        {
          nct: proto.identificationModule?.nctId,
          acronym: proto.identificationModule?.acronym,
          status: statusM.overallStatus,
          phase: (design.phases || []).join("/"),
          enroll: statusM.enrollmentInfo,
          hasResults: s.hasResults ?? json.hasResults,
          sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
        },
        null,
        2
      )
  );
}

async function main() {
  for (const id of ["40544433", "40544432", "16931496"]) {
    const { text } = await efetch(id);
    console.log(`\n----- ${id} BACKGROUND+ -----`);
    printWindow(text, "BACKGROUND", 3500);
    await sleep(500);
  }
  await ctgovNct("NCT05567796");
  await sleep(250);
  await ctgovNct("NCT05394519");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
