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

const known = "41319798,34176426";
const eurl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${known}`;
const e = await get(eurl);
console.log("===== EFETCH CT388 STATUS", e.status, "len", e.text.length, "=====");
printAbstracts(e.text);

const extra = [
  ["Carmot CT-388", `"Carmot" AND "CT-388"`],
  ["Roche CT-388", `"Roche" AND "CT-388"`],
];
for (const [name, term] of extra) {
  await sleep(400);
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=8&term=${encodeURIComponent(term)}`;
  const { status, text } = await get(url);
  console.log("===== ESEARCH", name, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 400));
  }
}

const ctQueries = [
  ["AREA[InterventionName]CT-388", "https://clinicaltrials.gov/api/v2/studies?query.term=AREA%5BInterventionName%5DCT-388&pageSize=20"],
  ["AREA[InterventionName]CT388", "https://clinicaltrials.gov/api/v2/studies?query.term=AREA%5BInterventionName%5DCT388&pageSize=20"],
  ["query CT-388", "https://clinicaltrials.gov/api/v2/studies?query.term=CT-388&pageSize=20"],
];
for (const [name, url] of ctQueries) {
  await sleep(400);
  const { status, text } = await get(url);
  console.log("===== CT.GOV SEARCH", name, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    const rows = (j.studies || []).map((s) => {
      const proto = s.protocolSection || {};
      const id = proto.identificationModule || {};
      const statusM = proto.statusModule || {};
      const design = proto.designModule || {};
      const enroll = design.enrollmentInfo || {};
      return {
        nctId: id.nctId,
        briefTitle: id.briefTitle,
        acronym: id.acronym,
        overallStatus: statusM.overallStatus,
        hasResults: s.hasResults,
        phases: design.phases,
        enrollment: enroll,
        primaryCompletion: statusM.primaryCompletionDateStruct,
        interventions: (proto.armsInterventionsModule?.interventions || []).map((i) => i.name),
      };
    });
    console.log(JSON.stringify(rows, null, 2));
  } catch {
    console.log(text.slice(0, 1500));
  }
}
