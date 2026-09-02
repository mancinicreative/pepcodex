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
    console.log(abstracts.join("\n\n") || "(no abstract text)");
    console.log("");
  }
}

const topical = "15134286,11146367,11713213,11673763,16625817,26275694,24124033,16931496,22435392,17971763,25208511";
const eurl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${topical}`;
const e = await get(eurl);
console.log("===== EFETCH AOD TOPICAL STATUS", e.status, "len", e.text.length, "=====");
printAbstracts(e.text);

const extraSearches = [
  ["AOD9604 clinical", `"AOD9604" clinical`],
  ["AOD-9604 trial", `"AOD-9604" trial`],
  ["AOD9604 obese", `"AOD9604" obese`],
  ["AOD9604 phase", `"AOD9604" phase`],
];
for (const [name, term] of extraSearches) {
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

const ctTerms = ["AOD9604", "AOD 9604", "AOD-9604", "tyr-hGH"];
for (const t of ctTerms) {
  await sleep(350);
  try {
    const url = `https://clinicaltrials.gov/api/v2/studies?query.term=${encodeURIComponent(t)}&pageSize=10`;
    const { status, text } = await get(url);
    console.log("===== CT.GOV SEARCH", t, "STATUS", status, "=====");
    const j = JSON.parse(text);
    const studies = j.studies || [];
    console.log("nStudies", studies.length);
    for (const st of studies.slice(0, 8)) {
      const proto = st.protocolSection || {};
      const id = proto.identificationModule || {};
      const statusM = proto.statusModule || {};
      const design = proto.designModule || {};
      console.log(
        JSON.stringify({
          nctId: id.nctId,
          briefTitle: id.briefTitle,
          overallStatus: statusM.overallStatus,
          hasResults: st.hasResults,
          phases: design.phases,
          enrollment: design.enrollmentInfo,
        })
      );
    }
  } catch (err) {
    console.log("===== CT.GOV SEARCH", t, "ERROR", String(err), "=====");
  }
}
