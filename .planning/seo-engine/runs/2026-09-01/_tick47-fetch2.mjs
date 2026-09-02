const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

async function main() {
  const id = "39067875";
  const sum = await get(`${EUTILS}/esummary.fcgi?db=pubmed&retmode=json&id=${id}`);
  console.log("===== RETRY ESUMMARY", id, "STATUS", sum.status, "=====");
  try {
    const j = JSON.parse(sum.text);
    const rec = j.result?.[id];
    const title = rec?.title || "";
    console.log("title:", title);
    console.log("source:", rec?.source, rec?.pubdate, rec?.elocationid);
    console.log("TITLE_MATCH", /methylquinolinium|NNMT|5-amino/i.test(title));
  } catch {
    console.log(sum.text.slice(0, 400));
  }

  await sleep(400);
  const nct = "NCT06049329";
  const ct = await get(`https://clinicaltrials.gov/api/v2/studies/${nct}`);
  console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
  try {
    const j = JSON.parse(ct.text);
    const proto = j.protocolSection || {};
    const idm = proto.identificationModule || {};
    const statusM = proto.statusModule || {};
    const design = proto.designModule || {};
    const enroll = design.enrollmentInfo || {};
    const outcomes = proto.outcomesModule || {};
    console.log(
      JSON.stringify(
        {
          nctId: idm.nctId,
          briefTitle: idm.briefTitle,
          officialTitle: idm.officialTitle,
          overallStatus: statusM.overallStatus,
          hasResults: j.hasResults,
          phases: design.phases,
          enrollment: enroll,
          primaryOutcomes: (outcomes.primaryOutcomes || []).slice(0, 3).map((o) => o.measure),
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
    `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=8&term=${encodeURIComponent(nct)}`
  );
  console.log("===== PUBMED NCT", nct, "STATUS", nctPm.status, "=====");
  try {
    const j = JSON.parse(nctPm.text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(nctPm.text.slice(0, 400));
  }

  await sleep(350);
  const nnmti = await get(
    `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=8&sort=relevance&term=${encodeURIComponent('"NNMTi"')}`
  );
  console.log("===== ESEARCH NNMTi STATUS", nnmti.status, "=====");
  try {
    const j = JSON.parse(nnmti.text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(nnmti.text.slice(0, 400));
  }

  await sleep(350);
  for (const n of ["NCT05369390", "NCT06064006"]) {
    const r = await get(
      `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=8&term=${encodeURIComponent(n)}`
    );
    console.log("===== PUBMED NCT", n, "STATUS", r.status, "=====");
    try {
      const j = JSON.parse(r.text);
      console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
    } catch {
      console.log(r.text.slice(0, 400));
    }
    await sleep(350);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
