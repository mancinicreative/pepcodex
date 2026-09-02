const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
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
    const journal = ((c.match(/<Title>([\s\S]*?)<\/Title>/) || [])[1] || "").trim();
    const year = ((c.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/) || [])[1] || "").trim();
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
    console.log("===== PMID", pm, "=====");
    console.log("TITLE:", title);
    console.log("JOURNAL:", journal, year);
    console.log("DOI:", doi);
    console.log("NCT:", [...new Set(nct)].join(", "));
    console.log((abstracts.join("\n\n") || "(no abstract)").slice(0, 8000));
    console.log("");
  }
}

const known = [
  { id: "39067875", expect: /methylquinolinium|NNMT|5-amino/i, label: "5AMQ-39067875" },
  { id: "33645410", expect: /methylquinolinium|NNMT|5-amino/i, label: "5AMQ-33645410" },
  { id: "35013352", expect: /methylquinolinium|NNMT|5-amino/i, label: "5AMQ-35013352" },
  { id: "33567185", expect: /semaglutide/i, label: "STEP-1" },
  { id: "37952131", expect: /semaglutide/i, label: "SELECT" },
];

async function main() {
  for (const p of known) {
    const sum = await get(`${EUTILS}/esummary.fcgi?db=pubmed&retmode=json&id=${p.id}`);
    console.log("\n====", p.label, "PMID", p.id, "ESUMMARY", sum.status);
    let title = "";
    try {
      const j = JSON.parse(sum.text);
      const rec = j.result?.[p.id];
      title = rec?.title || "";
      console.log("title:", title);
      console.log("source:", rec?.source, rec?.pubdate, rec?.elocationid);
    } catch {
      console.log("esummary parse fail", sum.text.slice(0, 300));
    }
    console.log("TITLE_MATCH", p.expect.test(title));
    await sleep(350);
  }

  const eurl = `${EUTILS}/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${known.map((p) => p.id).join(",")}`;
  const e = await get(eurl);
  console.log("===== EFETCH KNOWN STATUS", e.status, "len", e.text.length, "=====");
  printAbstracts(e.text);

  const ctQueries = [
    "5-Amino-1MQ",
    "5-amino-1-methylquinolinium",
    "NNMT 5-amino",
  ];
  for (const q of ctQueries) {
    await sleep(350);
    const url = `https://clinicaltrials.gov/api/v2/studies?query.term=${encodeURIComponent(q)}&pageSize=5`;
    const { status, text } = await get(url);
    console.log("===== CT.GOV SEARCH", q, "STATUS", status, "=====");
    try {
      const j = JSON.parse(text);
      const studies = j.studies || [];
      console.log("count", studies.length);
      for (const s of studies) {
        const proto = s.protocolSection || {};
        const id = proto.identificationModule || {};
        const statusM = proto.statusModule || {};
        console.log(
          JSON.stringify({
            nctId: id.nctId,
            briefTitle: id.briefTitle,
            overallStatus: statusM.overallStatus,
            hasResults: s.hasResults,
          })
        );
      }
    } catch {
      console.log(text.slice(0, 800));
    }
  }

  for (const name of ["5-amino-1mq", "5-amino-1-methylquinolinium", "semaglutide"]) {
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
            apps: (j.results || []).slice(0, 6).map((r) => ({
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
