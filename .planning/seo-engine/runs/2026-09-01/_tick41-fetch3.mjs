const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  return { status: r.status, text: await r.text() };
}

await sleep(400);
const ef = await get(
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=34798060",
);
console.log("EFETCH 34798060 STATUS", ef.status, "len", ef.text.length);
console.log(ef.text);

await sleep(400);
const sc = await get(
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=40550231",
);
console.log("EFETCH 40550231 STATUS", sc.status, "len", sc.text.length);
const idx = sc.text.indexOf("FINDINGS:");
console.log(sc.text.slice(idx));
