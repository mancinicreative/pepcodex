const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  return { status: r.status, text: await r.text() };
}

await sleep(300);
const extra = await get(
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=41328546",
);
console.log("ESUMMARY 41328546 STATUS", extra.status);
try {
  const j = JSON.parse(extra.text);
  const rec = j.result?.["41328546"];
  console.log("title:", rec?.title);
  console.log("source:", rec?.source, rec?.pubdate);
} catch {
  console.log(extra.text.slice(0, 400));
}

await sleep(400);
const ef = await get(
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=41328546",
);
console.log("EFETCH 41328546 STATUS", ef.status, "len", ef.text.length);
console.log(ef.text.slice(0, 2200));
