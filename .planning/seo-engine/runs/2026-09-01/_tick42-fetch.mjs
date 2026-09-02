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

const searches = [
  "Wilding Once-Weekly Semaglutide Overweight Obesity 2021",
  "Marso semaglutide SUSTAIN-6 2016",
  "Lincoff Semaglutide Cardiovascular Outcomes Obesity 2023",
  "Davies Semaglutide 2.4 mg type 2 diabetes STEP 2 2021",
  "Wadden Subcutaneous Semaglutide Intensive Behavioral STEP 3",
  "Sorli Efficacy safety once-weekly semaglutide monotherapy SUSTAIN 1",
];

const known = [
  { id: "33567185", expect: /semaglutide/i, label: "STEP-1" },
  { id: "27633186", expect: /semaglutide/i, label: "SUSTAIN-6" },
  { id: "37952131", expect: /semaglutide/i, label: "SELECT" },
  { id: "33667417", expect: /semaglutide/i, label: "STEP-2" },
  { id: "33625476", expect: /semaglutide/i, label: "STEP-3" },
  { id: "28110911", expect: /semaglutide/i, label: "SUSTAIN-1" },
];

async function main() {
  for (const q of searches) {
    const url = `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=${encodeURIComponent(q)}`;
    const { status, text } = await get(url);
    console.log("===== ESEARCH", q, "STATUS", status, "=====");
    try {
      const j = JSON.parse(text);
      console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
    } catch {
      console.log(text.slice(0, 400));
    }
    await sleep(400);
  }

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
    await sleep(400);
  }

  const eurl = `${EUTILS}/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${known.map((p) => p.id).join(",")}`;
  const e = await get(eurl);
  console.log("===== EFETCH KNOWN STATUS", e.status, "=====");
  printAbstracts(e.text);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
