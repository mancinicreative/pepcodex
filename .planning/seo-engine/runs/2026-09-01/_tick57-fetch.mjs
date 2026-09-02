/**
 * TICK57 cited-only fetch. Per-alias esearch (never OR-joined).
 * Amycretin oral/SC + SYNCHRONIZE-1 + phase 2 + MASH + H2H + SYNCHRONY trap.
 */
const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

function printAbstracts(xml, needMap) {
  const parts = xml.split(/<PubmedArticle[ >]/).slice(1);
  console.log("ARTICLE_COUNT", parts.length);
  for (const c of parts) {
    const pm = (c.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
    const title = ((c.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || "")
      .replace(/<[^>]+>/g, "")
      .trim();
    const year = (c.match(/<Year>(\d{4})<\/Year>/) || [])[1];
    const journal = ((c.match(/<Title>([\s\S]*?)<\/Title>/) || [])[1] || "").replace(/<[^>]+>/g, "");
    const doi = ((c.match(/<ELocationID[^>]*EIdType="doi"[^>]*>([\s\S]*?)<\/ELocationID>/) || [])[1] || "").trim();
    const pubtypes = [...c.matchAll(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g)]
      .map((m) => m[1].replace(/<[^>]+>/g, "").trim());
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
    const titleLower = title.toLowerCase();
    const need = needMap[pm] || [];
    const titleMatch = need.length ? need.every((w) => titleLower.includes(w.toLowerCase())) : "n/a";
    console.log("===== PMID", pm, year, "=====");
    console.log("JOURNAL:", journal);
    console.log("DOI:", doi);
    console.log("TITLE:", title);
    console.log("PUBTYPES:", pubtypes.join("; "));
    console.log("TITLE_MATCH:", titleMatch, "need:", need.join(","));
    console.log("NCT:", [...new Set(nct)].join(", "));
    console.log(abstracts.join("\n\n") || "(no abstract)");
    console.log("");
  }
}

const aliases = [
  ["amycretin", `"amycretin"`],
  ["survodutide", `"survodutide"`],
  ["amycretin AND survodutide", `"amycretin" AND "survodutide"`],
  ["SYNCHRONIZE-1 survodutide", `"SYNCHRONIZE-1" survodutide`],
  ["SYNCHRONIZE-1 title", `"SYNCHRONIZE-1"[Title]`],
  ["SYNCHRONY survodutide", `"SYNCHRONY" survodutide`],
  ["SYNCHRONY title", `"SYNCHRONY"[Title]`],
  ["survodutide 18.7", `survodutide[Title] AND 18.7`],
  ["survodutide 19.5", `survodutide[Title] AND 19.5`],
  ["survodutide 12.2", `survodutide[Title] AND 12.2`],
  ["oral uid", "40550229[uid]"],
  ["sc uid", "40550231[uid]"],
  ["sync1 uid", "42253238[uid]"],
  ["p2 uid", "38330987[uid]"],
  ["mash uid", "38847460[uid]"],
  ["sync masld uid", "42252333[uid]"],
  ["t2d uid", "38095657[uid]"],
];

for (const [name, term] of aliases) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=12&sort=relevance&term=${encodeURIComponent(term)}`;
  const { status, text } = await get(url);
  console.log("===== ESEARCH", name, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 400));
  }
  await sleep(400);
}

const needMap = {
  "40550229": ["amycretin"],
  "40550231": ["amycretin"],
  "42253238": ["synchronize"],
  "38330987": ["survodutide"],
  "38847460": ["survodutide"],
  "42252333": ["synchronize"],
  "38095657": ["survodutide"],
};

const known = "40550229,40550231,42253238,38330987,38847460,42252333,38095657";
const eurl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${known}`;
const e = await get(eurl);
console.log("===== EFETCH CORE STATUS", e.status, "len", e.text.length, "=====");
printAbstracts(e.text, needMap);

const ncts = ["NCT05369390", "NCT06064006", "NCT06066515", "NCT04667377", "NCT04771273"];
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

for (const name of ["amycretin", "survodutide"]) {
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
