const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const extras = [
  "5-amino-1-methylquinolinium iodide",
  "NNMTi",
  "5MQ NNMT",
];

async function main() {
  for (const a of extras) {
    const term = a.includes(" ") && !a.startsWith("5-") ? a : `"${a}"`;
    const url = `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=8&sort=relevance&term=${encodeURIComponent(`"${a}"`)}`;
    const { status, text } = await get(url);
    console.log("===== ESEARCH", a, "STATUS", status, "=====");
    try {
      const j = JSON.parse(text);
      console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
    } catch {
      console.log(text.slice(0, 400));
    }
    await sleep(400);
  }

  for (const nct of ["NCT03548935", "NCT03574597"]) {
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
      console.log(
        JSON.stringify(
          {
            nctId: id.nctId,
            briefTitle: id.briefTitle,
            acronym: id.acronym,
            overallStatus: statusM.overallStatus,
            hasResults: j.hasResults,
            phases: design.phases,
            enrollment: enroll,
            primaryCompletion: statusM.primaryCompletionDateStruct,
          },
          null,
          2
        )
      );
    } catch {
      console.log(text.slice(0, 1500));
    }
  }

  for (const nct of ["NCT03548935", "NCT03574597"]) {
    await sleep(350);
    const url = `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=${encodeURIComponent(nct)}`;
    const { status, text } = await get(url);
    console.log("===== PUBMED NCT", nct, "STATUS", status, "=====");
    try {
      const j = JSON.parse(text);
      console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
    } catch {
      console.log(text.slice(0, 400));
    }
  }

  for (const name of ["5-amino-1mq", "5-amino-1-methylquinolinium", "semaglutide"]) {
    await sleep(300);
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
            apps: (j.results || []).slice(0, 8).map((r) => ({
              appl: r.application_number,
              sponsor: r.sponsor_name,
              brands: [...new Set((r.products || []).map((p) => p.brand_name))],
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
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
