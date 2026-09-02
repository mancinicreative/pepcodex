const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, ms = 25000) {
  const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(ms) });
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
    console.log("===== PMID", pm, "=====");
    console.log("TITLE:", title);
    console.log((abstracts.join("\n\n") || "(no abstract)").slice(0, 6000));
    console.log("");
  }
}

const ids = [
  "30753815",
  "34153425",
  "33707534",
  "40089784",
  "38838088",
];

async function main() {
  for (const id of ids) {
    const sum = await get(`${EUTILS}/esummary.fcgi?db=pubmed&retmode=json&id=${id}`);
    console.log("==== ESUMMARY", id, sum.status);
    try {
      const j = JSON.parse(sum.text);
      const rec = j.result?.[id];
      const title = rec?.title || "";
      console.log("title:", title);
      console.log("source:", rec?.source, rec?.pubdate);
      const topical = /5-amino|methylquinolinium|5MQ|NNMTi|NNMT/i.test(title);
      console.log("TITLE_TOPICAL", topical);
    } catch {
      console.log(sum.text.slice(0, 300));
    }
    await sleep(300);
  }

  const eurl = `${EUTILS}/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${ids.join(",")}`;
  const e = await get(eurl);
  console.log("===== EFETCH NEW STATUS", e.status, "len", e.text.length, "=====");
  printAbstracts(e.text);

  for (const name of ["semaglutide", "5-amino-1-methylquinolinium"]) {
    await sleep(400);
    try {
      const fda = await get(
        `https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22${name}%22&limit=5`,
        40000
      );
      console.log("===== OPENFDA GENERIC", name.toUpperCase(), "STATUS", fda.status, "=====");
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
    } catch (err) {
      console.log("===== OPENFDA GENERIC", name.toUpperCase(), "ERROR", err.cause?.code || err.message, "=====");
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
