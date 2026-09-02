/**
 * TICK67 fetch2: full abstracts that truncated + NCT details + PubMed NCT.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick67/1.0 (integrity; cited-only compare)" },
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
      last = { status: 0, text: String(e) };
    }
    await sleep(1200 * i);
  }
  return last;
}

async function efetch(id) {
  const { status, text } = await retry(() =>
    get(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=${id}`,
      `efetch ${id}`
    )
  );
  console.log(text);
  return { status, text };
}

async function ctgovNct(nct) {
  const { status, text } = await retry(() =>
    get(`https://clinicaltrials.gov/api/v2/studies/${nct}`, `CT.gov ${nct}`)
  );
  try {
    const j = JSON.parse(text);
    const proto = j.protocolSection || {};
    const id = proto.identificationModule || {};
    const statusM = proto.statusModule || {};
    const design = proto.designModule || {};
    console.log(
      JSON.stringify(
        {
          nctId: id.nctId,
          briefTitle: id.briefTitle,
          officialTitle: id.officialTitle,
          acronym: id.acronym,
          overallStatus: statusM.overallStatus,
          hasResults: j.hasResults,
          phases: design.phases,
          enrollment: statusM.enrollmentInfo || design.enrollmentInfo,
          leadSponsor: proto.sponsorCollaboratorsModule?.leadSponsor,
        },
        null,
        2
      )
    );
  } catch {
    console.log(text.slice(0, 800));
  }
}

async function pubmedNct(nct) {
  const { text } = await retry(() =>
    get(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=8&term=${encodeURIComponent(nct)}`,
      `PubMed ${nct}`
    )
  );
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 400));
  }
}

async function main() {
  console.log("TICK67 fetch2 start", new Date().toISOString());
  for (const id of ["34798060", "40544433"]) {
    await efetch(id);
    await sleep(400);
  }
  for (const nct of ["NCT03856047", "NCT05567796"]) {
    await ctgovNct(nct);
    await sleep(350);
    await pubmedNct(nct);
    await sleep(350);
  }
  console.log("\nTICK67 fetch2 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
