/**
 * TICK66 fetch2: NCT details + openFDA (fetch1 timed out on openFDA).
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick66/1.0 (integrity; cited-only compare)" },
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
  const { status, text } = await retry(() =>
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

function printFda(text) {
  try {
    const j = JSON.parse(text);
    if (j.error) {
      console.log(`error=${j.error.code} ${j.error.message}`);
      return;
    }
    console.log(
      JSON.stringify(
        {
          total: j.meta?.results?.total,
          apps: (j.results || []).map((r) => ({
            appl: r.application_number,
            sponsor: r.sponsor_name,
            brands: [...new Set((r.products || []).map((p) => p.brand_name))],
            origAp: (r.submissions || [])
              .filter((s) => s.submission_type === "ORIG" && s.submission_status === "AP")
              .map((s) => ({ number: s.submission_number, date: s.submission_status_date })),
          })),
        },
        null,
        2
      )
    );
  } catch {
    console.log(text.slice(0, 800));
  }
}

async function main() {
  console.log("TICK66 fetch2 start", new Date().toISOString());

  for (const nct of ["NCT05869903", "NCT05051579"]) {
    await ctgovNct(nct);
    await sleep(350);
    await pubmedNct(nct);
    await sleep(350);
  }

  const fdaQueries = [
    ["GENERIC aod-9604", "openfda.generic_name:\"aod-9604\""],
    ["GENERIC aod9604", "openfda.generic_name:\"aod9604\""],
    ["GENERIC orforglipron", "openfda.generic_name:\"orforglipron\""],
    ["BRAND Foundayo", "openfda.brand_name:\"Foundayo\""],
    ["NDA220934", "application_number:NDA220934"],
  ];
  for (const [label, q] of fdaQueries) {
    const { text } = await retry(() =>
      get(`https://api.fda.gov/drug/drugsfda.json?limit=5&search=${encodeURIComponent(q)}`, `openFDA ${label}`)
    );
    printFda(text);
    await sleep(400);
  }

  console.log("\nTICK66 fetch2 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
