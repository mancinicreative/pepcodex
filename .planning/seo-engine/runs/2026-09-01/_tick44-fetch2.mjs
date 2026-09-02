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

function printSummaries(xml) {
  const docs = xml.split(/<DocSum>/).slice(1);
  for (const d of docs) {
    const id = (d.match(/<Id>(\d+)<\/Id>/) || [])[1];
    const title = ((d.match(/<Item Name="Title"[^>]*>([\s\S]*?)<\/Item>/) || [])[1] || "").trim();
    const source = ((d.match(/<Item Name="Source"[^>]*>([\s\S]*?)<\/Item>/) || [])[1] || "").trim();
    const pubdate = ((d.match(/<Item Name="PubDate"[^>]*>([\s\S]*?)<\/Item>/) || [])[1] || "").trim();
    console.log("-----", id, pubdate, source);
    console.log(title);
  }
}

const ids = [
  "15134286",
  "41490200",
  "41966639",
  "24124033",
  "26213263",
  "16625817",
  "24906629",
  "15834452",
  "14685303",
  "14571286",
  "25208511",
  "25382550",
  "26275694",
  "11146367",
  "11713213",
  "24976118",
  "26578461",
  "11673763",
  "22435392",
  "16931496",
  "17971763",
];
const unique = [...new Set(ids)];
const surl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=xml&id=${unique.join(",")}`;
const s = await get(surl);
console.log("===== ESUMMARY AOD STATUS", s.status, "len", s.text.length, "=====");
printSummaries(s.text);

for (const name of ["amycretin", "aod-9604", "aod9604"]) {
  await sleep(400);
  try {
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
  } catch (err) {
    console.log("===== OPENFDA GENERIC", name.toUpperCase(), "ERROR", String(err), "=====");
  }
}

try {
  const ctq = encodeURIComponent("AOD-9604");
  const ctSearch = await get(
    `https://clinicaltrials.gov/api/v2/studies?query.term=${ctq}&pageSize=20`
  );
  console.log("===== CT.GOV SEARCH AOD-9604 STATUS", ctSearch.status, "=====");
  const j = JSON.parse(ctSearch.text);
  const studies = j.studies || [];
  console.log("nStudies", studies.length);
  for (const st of studies) {
    const proto = st.protocolSection || {};
    const id = proto.identificationModule || {};
    const statusM = proto.statusModule || {};
    const design = proto.designModule || {};
    const enroll = design.enrollmentInfo || {};
    console.log(
      JSON.stringify({
        nctId: id.nctId,
        briefTitle: id.briefTitle,
        overallStatus: statusM.overallStatus,
        hasResults: st.hasResults,
        phases: design.phases,
        enrollment: enroll,
      })
    );
  }
} catch (err) {
  console.log("===== CT.GOV SEARCH ERROR", String(err), "=====");
}
