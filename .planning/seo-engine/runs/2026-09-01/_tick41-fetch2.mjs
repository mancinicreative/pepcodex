const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

async function retry(label, url, n = 4) {
  for (let i = 1; i <= n; i++) {
    try {
      const out = await get(url);
      console.log(label, "try", i, "STATUS", out.status, "len", out.text.length);
      if (out.status === 200 && out.text.length > 200) return out;
    } catch (e) {
      console.log(label, "try", i, "ERR", e.cause?.code || e.message);
    }
    await sleep(800 * i);
  }
  return { status: 0, text: "" };
}

const ids = ["40550229", "40550231", "34798060", "40544433"];
for (const id of ids) {
  await sleep(500);
  const sum = await retry(
    "ESUMMARY " + id,
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${id}`,
  );
  try {
    const j = JSON.parse(sum.text);
    const rec = j.result?.[id];
    console.log("title:", rec?.title);
    console.log("source:", rec?.source, rec?.pubdate, rec?.elocationid);
  } catch {
    console.log(sum.text.slice(0, 300));
  }
  await sleep(400);
  const ef = await retry(
    "EFETCH " + id,
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=${id}`,
  );
  console.log(ef.text);
  console.log("");
}

for (const name of ["amycretin", "cagrilintide"]) {
  await sleep(300);
  try {
    const fda = await get(
      `https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22${name}%22&limit=4`,
    );
    console.log("===== OPENFDA GENERIC", name.toUpperCase(), "STATUS", fda.status, "=====");
    console.log(fda.text.slice(0, 600));
  } catch (e) {
    console.log("===== OPENFDA GENERIC", name.toUpperCase(), "ERR", e.cause?.code || e.message, "=====");
  }
}

await sleep(300);
const oral = await retry(
  "ESEARCH ORAL",
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=3&term=" +
    encodeURIComponent("40550229[uid]"),
);
try {
  const j = JSON.parse(oral.text);
  console.log("ESEARCH ORAL ids", j.esearchresult?.idlist, "count", j.esearchresult?.count);
} catch {
  console.log(oral.text.slice(0, 200));
}
