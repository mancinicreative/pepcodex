const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const terms = [
  ["NCT05369390", "NCT05369390"],
  ["NCT06064006", "NCT06064006"],
  ["NCT06068946", "NCT06068946"],
  ["NCT05203237", "NCT05203237"],
  ["NCT06828055", "NCT06828055"],
  ["NCT07104500", "NCT07104500"],
  ["NCT07104383", "NCT07104383"],
  ["VANQUISH-1", `"VANQUISH-1"`],
  ["VANQUISH-2", `"VANQUISH-2"`],
];

for (const [name, term] of terms) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=${encodeURIComponent(term)}`;
  const { status, text } = await get(url);
  console.log("===== ESEARCH", name, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 400));
  }
  await sleep(350);
}
