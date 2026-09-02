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

const aliases = ["cagrilintide", "CagriSema", "AM833"];
for (const a of aliases) {
  const term = `"${a}"`;
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=20&sort=relevance&term=${encodeURIComponent(term)}`;
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

const extra = [
  ["LAU", "34798060[uid]"],
  ["REDEFINE1", "40544433[uid]"],
  ["STEP1", "33567185[uid]"],
  ["SELECT", "37952131[uid]"],
  ["NCT06131437", "NCT06131437"],
  ["REDEFINE4", '"REDEFINE 4" cagrilintide'],
  ["REDEFINE4H", '"REDEFINE-4" cagrilintide'],
];
for (const [name, term] of extra) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=10&term=${encodeURIComponent(term)}`;
  const { status, text } = await get(url);
  console.log("===== ESEARCH", name, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 400));
  }
  await sleep(350);
}

const known = "34798060,40544433,33567185,37952131";
const eurl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${known}`;
const e = await get(eurl);
console.log("===== EFETCH KNOWN STATUS", e.status, "=====");
printAbstracts(e.text);

const ncts = ["NCT06131437", "NCT03856047", "NCT05567796", "NCT03548935", "NCT03574597"];
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
          acronym: id.acronym,
          overallStatus: statusM.overallStatus,
          hasResults: j.hasResults,
          phases: design.phases,
          enrollment: enroll,
          primaryCompletion: statusM.primaryCompletionDateStruct,
          completion: statusM.completionDateStruct,
          primaryOutcomes: (outcomes.primaryOutcomes || []).slice(0, 3).map((o) => o.measure),
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

for (const name of ["cagrilintide", "semaglutide"]) {
  await sleep(200);
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
            forms: [...new Set((r.products || []).map((p) => p.dosage_form))],
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

for (const brand of ["OZEMPIC", "WEGOVY", "RYBELSUS"]) {
  await sleep(200);
  const fda = await get(
    `https://api.fda.gov/drug/drugsfda.json?search=products.brand_name:%22${brand}%22&limit=8`
  );
  console.log("===== OPENFDA BRAND", brand, "STATUS", fda.status, "=====");
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
            forms: [...new Set((r.products || []).map((p) => p.dosage_form))],
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
