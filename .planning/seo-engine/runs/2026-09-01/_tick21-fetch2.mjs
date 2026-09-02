const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

function printAbstracts(xml) {
  const parts = xml.split(/<PubmedArticle[ >]/).slice(1);
  for (const c of parts) {
    const pm = (c.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
    const title = ((c.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || "")
      .replace(/<[^>]+>/g, "")
      .trim();
    const year = (c.match(/<Year>(\d{4})<\/Year>/) || [])[1];
    const journal = ((c.match(/<Title>([\s\S]*?)<\/Title>/) || [])[1] || "").replace(/<[^>]+>/g, "");
    const abstracts = [...c.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)].map((m) => {
      const label = (m[1].match(/Label="([^"]+)"/) || [])[1] || "";
      const text = m[2]
        .replace(/<[^>]+>/g, "")
        .replace(/&#xb7;/g, ".")
        .replace(/&#x2013;/g, "-")
        .replace(/&#x2212;/g, "-")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();
      return (label ? label + ": " : "") + text;
    });
    const nct = [...c.matchAll(/NCT\d+/g)].map((x) => x[0]);
    console.log("===== PMID", pm, year, "=====");
    console.log("JOURNAL:", journal);
    console.log("TITLE:", title);
    console.log("NCT:", [...new Set(nct)].join(", "));
    console.log(abstracts.join("\n\n"));
    console.log("");
  }
}

const ids = "39002641,41352959,40081498,41362110,39676791,40734920,40063921,35461369";
const eurl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${ids}`;
const e = await get(eurl);
console.log("===== EFETCH MORE STATUS", e.status, "=====");
printAbstracts(e.text);

const ncts = ["NCT05295875", "NCT05989711", "NCT05292911"];
for (const nct of ncts) {
  await sleep(300);
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
          start: statusM.startDateStruct,
          primaryCompletion: statusM.primaryCompletionDateStruct,
          completion: statusM.completionDateStruct,
          primaryOutcomes: (outcomes.primaryOutcomes || []).map((o) => o.measure),
          interventions: (proto.armsInterventionsModule?.interventions || []).map((i) => i.name),
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

try {
  const fda = await get(
    "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22pemvidutide%22&limit=1"
  );
  console.log("===== OPENFDA PEMVIDUTIDE STATUS", fda.status, "=====");
  console.log(fda.text.slice(0, 800));
} catch (err) {
  console.log("===== OPENFDA PEMVIDUTIDE FAIL", err.cause?.code || err.message, "=====");
}

try {
  const fda2 = await get(
    "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22tirzepatide%22&limit=5"
  );
  console.log("===== OPENFDA TIRZEPATIDE STATUS", fda2.status, "=====");
  const j = JSON.parse(fda2.text);
  console.log(
    JSON.stringify(
      {
        total: j.meta?.results?.total,
        apps: (j.results || []).map((r) => ({
          appl: r.application_number,
          sponsor: r.sponsor_name,
          brands: [...new Set((r.products || []).map((p) => p.brand_name))],
        })),
      },
      null,
      2
    )
  );
} catch (err) {
  console.log("===== OPENFDA TIRZEPATIDE FAIL", err.cause?.code || err.message, "=====");
}
