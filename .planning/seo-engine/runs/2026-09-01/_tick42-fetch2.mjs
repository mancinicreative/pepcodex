const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  return { status: r.status, text: await r.text() };
}

const searches = [
  "Marso semaglutide SUSTAIN-6 2016",
  "Davies Semaglutide 2.4 mg type 2 diabetes STEP 2 2021",
];
const ids = ["27633186", "33625476"];

async function main() {
  for (const q of searches) {
    const { status, text } = await get(
      `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=${encodeURIComponent(q)}`,
    );
    console.log("===== ESEARCH", q, "STATUS", status, "=====");
    try {
      const j = JSON.parse(text);
      console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
    } catch {
      console.log(text.slice(0, 400));
    }
    await sleep(800);
  }
  for (const id of ids) {
    const { status, text } = await get(`${EUTILS}/esummary.fcgi?db=pubmed&retmode=json&id=${id}`);
    console.log("\n==== ESUMMARY", id, "STATUS", status);
    try {
      const j = JSON.parse(text);
      const rec = j.result?.[id];
      console.log("title:", rec?.title);
      console.log("source:", rec?.source, rec?.pubdate, rec?.elocationid);
    } catch {
      console.log(text.slice(0, 400));
    }
    await sleep(800);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
