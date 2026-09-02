const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

async function main() {
  await sleep(1500);
  const url = `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=8&sort=relevance&term=${encodeURIComponent('"amycretin"')}`;
  const { status, text } = await get(url);
  console.log("===== ESEARCH amycretin RETRY STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 400));
  }

  await sleep(400);
  const nct = "NCT06049329";
  const ct = await get(`https://clinicaltrials.gov/api/v2/studies/${nct}`);
  console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
  try {
    const j = JSON.parse(ct.text);
    const proto = j.protocolSection || {};
    const id = proto.identificationModule || {};
    const statusM = proto.statusModule || {};
    const design = proto.designModule || {};
    const enroll = design.enrollmentInfo || {};
    const outcomes = proto.outcomesModule || {};
    console.log(
      JSON.stringify(
        {
          nctId: id.nctId,
          briefTitle: id.briefTitle,
          officialTitle: id.officialTitle,
          overallStatus: statusM.overallStatus,
          hasResults: j.hasResults,
          phases: design.phases,
          enrollment: enroll,
          primaryOutcomes: (outcomes.primaryOutcomes || []).slice(0, 4).map((o) => o.measure),
          interventions: (proto.armsInterventionsModule?.interventions || []).map((i) => i.name),
        },
        null,
        2
      )
    );
  } catch {
    console.log(ct.text.slice(0, 1500));
  }

  await sleep(350);
  const nctPm = await get(
    `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=8&term=${encodeURIComponent("NCT06049329")}`
  );
  console.log("===== PUBMED NCT06049329 STATUS", nctPm.status, "=====");
  try {
    const j = JSON.parse(nctPm.text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(nctPm.text.slice(0, 400));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
