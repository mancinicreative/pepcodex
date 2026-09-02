const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const ncts = ["NCT05369390", "NCT06064006", "NCT05869903", "NCT05051579"];
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
          primaryCompletion: statusM.primaryCompletionDateStruct,
          primaryOutcomes: (outcomes.primaryOutcomes || []).slice(0, 3).map((o) => o.measure),
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
  console.log("");
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

const generics = ["amycretin", "orforglipron"];
for (const name of generics) {
  await sleep(250);
  const fda = await get(
    `https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22${name}%22&limit=8`
  );
  console.log("===== OPENFDA GENERIC", name.toUpperCase(), "STATUS", fda.status, "=====");
  try {
    const j = JSON.parse(fda.text);
    console.log(
      JSON.stringify(
        {
          total: j.meta?.results?.total,
          error: j.error,
          apps: (j.results || []).map((r) => ({
            appl: r.application_number,
            sponsor: r.sponsor_name,
            brands: [...new Set((r.products || []).map((p) => p.brand_name))],
            submissions: (r.submissions || [])
              .filter((s) => s.submission_type === "ORIG" && s.submission_status === "AP")
              .map((s) => ({
                type: s.submission_type,
                number: s.submission_number,
                status: s.submission_status,
                date: s.submission_status_date,
              })),
          })),
        },
        null,
        2
      )
    );
  } catch {
    console.log(fda.text.slice(0, 800));
  }
}

const brands = ["Foundayo"];
for (const name of brands) {
  await sleep(250);
  const fda = await get(
    `https://api.fda.gov/drug/drugsfda.json?search=openfda.brand_name:%22${name}%22&limit=8`
  );
  console.log("===== OPENFDA BRAND", name.toUpperCase(), "STATUS", fda.status, "=====");
  try {
    const j = JSON.parse(fda.text);
    console.log(
      JSON.stringify(
        {
          total: j.meta?.results?.total,
          error: j.error,
          apps: (j.results || []).map((r) => ({
            appl: r.application_number,
            sponsor: r.sponsor_name,
            brands: [...new Set((r.products || []).map((p) => p.brand_name))],
            submissions: (r.submissions || [])
              .filter((s) => s.submission_type === "ORIG" && s.submission_status === "AP")
              .map((s) => ({
                type: s.submission_type,
                number: s.submission_number,
                status: s.submission_status,
                date: s.submission_status_date,
              })),
          })),
        },
        null,
        2
      )
    );
  } catch {
    console.log(fda.text.slice(0, 800));
  }
}

await sleep(250);
const nda = await get("https://api.fda.gov/drug/drugsfda.json?search=application_number:NDA220934&limit=5");
console.log("===== OPENFDA NDA220934 STATUS", nda.status, "=====");
try {
  const j = JSON.parse(nda.text);
  console.log(
    JSON.stringify(
      {
        total: j.meta?.results?.total,
        error: j.error,
        apps: (j.results || []).map((r) => ({
          appl: r.application_number,
          sponsor: r.sponsor_name,
          products: (r.products || []).map((p) => ({
            brand: p.brand_name,
            generic: p.generic_name,
            active: p.active_ingredients,
          })),
          submissions: (r.submissions || [])
            .filter((s) => s.submission_type === "ORIG")
            .map((s) => ({
              type: s.submission_type,
              number: s.submission_number,
              status: s.submission_status,
              date: s.submission_status_date,
            })),
        })),
      },
      null,
      2
    )
  );
} catch {
  console.log(nda.text.slice(0, 1500));
}
