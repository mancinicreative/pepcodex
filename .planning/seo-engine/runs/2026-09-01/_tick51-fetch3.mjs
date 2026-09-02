const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const ncts = ["NCT05607680", "NCT06164873", "NCT06124807"];
for (const nct of ncts) {
  await sleep(350);
  const url = `https://clinicaltrials.gov/api/v2/studies/${nct}`;
  const { status, text } = await get(url);
  console.log("===== CT.GOV", nct, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
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
          acronym: id.acronym,
          overallStatus: statusM.overallStatus,
          hasResults: j.hasResults,
          phases: design.phases,
          enrollment: enroll,
          leadSponsor: proto.sponsorCollaboratorsModule?.leadSponsor,
          collaborators: proto.sponsorCollaboratorsModule?.collaborators,
          primaryCompletion: statusM.primaryCompletionDateStruct,
          primaryOutcomes: (outcomes.primaryOutcomes || []).slice(0, 4).map((o) => o.measure),
          interventions: (proto.armsInterventionsModule?.interventions || []).map((i) => ({
            name: i.name,
            otherNames: i.otherNames,
          })),
        },
        null,
        2
      )
    );
  } catch {
    console.log(text.slice(0, 1500));
  }
}

for (const nct of ncts) {
  await sleep(350);
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=8&term=${encodeURIComponent(nct)}`;
  const { status, text } = await get(url);
  console.log("===== PUBMED NCT", nct, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 400));
  }
}

const h2h = `"amycretin" AND "mazdutide"`;
{
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=8&term=${encodeURIComponent(h2h)}`;
  const { status, text } = await get(url);
  console.log("===== ESEARCH H2H STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 400));
  }
}

await sleep(400);
try {
  const fda = await get(
    "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22amycretin%22&limit=8"
  );
  console.log("===== OPENFDA GENERIC AMYCRETIN STATUS", fda.status, "=====");
  console.log(fda.text.slice(0, 600));
} catch (err) {
  console.log("===== OPENFDA GENERIC AMYCRETIN ERROR", err.cause?.code || err.message, "=====");
}
