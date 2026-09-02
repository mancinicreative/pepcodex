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
    const doi = ((c.match(/<ELocationID[^>]*EIdType="doi"[^>]*>([\s\S]*?)<\/ELocationID>/) || [])[1] || "").trim();
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
    console.log("DOI:", doi);
    console.log("TITLE:", title);
    console.log("NCT:", [...new Set(nct)].join(", "));
    console.log(abstracts.join("\n\n") || "(no abstract)");
    console.log("");
  }
}

const known = "26132939,26510028,27295427,41054801,42208956,40206909,42175595,40949933,42673585";
const eurl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${known}`;
const e = await get(eurl);
console.log("===== EFETCH LIRA + H2H STATUS", e.status, "len", e.text.length, "=====");
printAbstracts(e.text);

await sleep(400);
const nctSearch = await get(
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=" +
    encodeURIComponent("26132939[uid]")
);
console.log("===== ESEARCH SCALE UID STATUS", nctSearch.status, "=====");
try {
  console.log(JSON.stringify(JSON.parse(nctSearch.text).esearchresult));
} catch {
  console.log(nctSearch.text.slice(0, 400));
}

const ncts = ["NCT01272219", "NCT01179048"];
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
          officialTitle: id.officialTitle,
          overallStatus: statusM.overallStatus,
          hasResults: j.hasResults,
          phases: design.phases,
          enrollment: enroll,
          leadSponsor: proto.sponsorCollaboratorsModule?.leadSponsor,
          primaryCompletion: statusM.primaryCompletionDateStruct,
          primaryOutcomes: (outcomes.primaryOutcomes || []).slice(0, 4).map((o) => o.measure),
          interventions: (proto.armsInterventionsModule?.interventions || []).map((i) => i.name),
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

const brandQueries = [
  ["brand Victoza", "openfda.brand_name:%22VICTOZA%22"],
  ["brand Saxenda", "openfda.brand_name:%22SAXENDA%22"],
  ["appl NDA022341", "application_number:%22NDA022341%22"],
  ["appl NDA206321", "application_number:%22NDA206321%22"],
];
for (const [name, q] of brandQueries) {
  await sleep(250);
  const fda = await get(`https://api.fda.gov/drug/drugsfda.json?search=${q}&limit=3`);
  console.log("===== OPENFDA", name, "STATUS", fda.status, "=====");
  try {
    const j = JSON.parse(fda.text);
    const apps = (j.results || []).map((r) => {
      const orig = (r.submissions || []).filter((s) => s.submission_type === "ORIG");
      const first = [...(r.submissions || [])].sort((a, b) =>
        String(a.submission_status_date || "").localeCompare(String(b.submission_status_date || ""))
      )[0];
      return {
        appl: r.application_number,
        sponsor: r.sponsor_name,
        brands: [...new Set((r.products || []).map((p) => p.brand_name))],
        orig: orig.map((s) => ({
          type: s.submission_type,
          status: s.submission_status,
          date: s.submission_status_date,
          class: s.review_priority,
        })),
        earliest: first
          ? {
              type: first.submission_type,
              status: first.submission_status,
              date: first.submission_status_date,
            }
          : null,
      };
    });
    console.log(JSON.stringify({ total: j.meta?.results?.total, error: j.error, apps }, null, 2));
  } catch {
    console.log(fda.text.slice(0, 1200));
  }
}
