const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
async function get(url) {
  const r = await fetch(url, { headers: UA });
  return { status: r.status, text: await r.text() };
}
const terms = [
  'NCT06131437',
  '"REDEFINE 4" cagrilintide tirzepatide',
  '"REDEFINE-4" cagrilintide',
];
for (const term of terms) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=10&term=${encodeURIComponent(term)}`;
  const { status, text } = await get(url);
  console.log("===== ESEARCH", term, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 400));
  }
  await new Promise((r) => setTimeout(r, 400));
}
