const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const ncts = ["NCT06858839", "NCT06858852"];
for (const nct of ncts) {
  const ct = await get(
    `https://clinicaltrials.gov/api/v2/studies/${nct}?fields=NCTId,BriefTitle,OfficialTitle,Acronym,OverallStatus,Phase,EnrollmentInfo,HasResults,PrimaryCompletionDateStruct,CompletionDateStruct`
  );
  console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
  console.log(ct.text.slice(0, 1600));
  console.log("");
}

const search = await get(
  "https://clinicaltrials.gov/api/v2/studies?query.term=MARITIME-2%20maridebart&pageSize=6&fields=NCTId,BriefTitle,Acronym,OverallStatus,Phase,HasResults,EnrollmentInfo"
);
console.log("===== CT SEARCH MARITIME-2 STATUS", search.status, "=====");
console.log(search.text.slice(0, 2200));
console.log("");

for (const q of ["NCT06858839", "NCT06858852", '"MARITIME-2" maridebart']) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=${encodeURIComponent(q)}`;
  const { status, text } = await get(url);
  console.log("===== PUBMED", q, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    console.log("count", j.esearchresult?.count, "ids", (j.esearchresult?.idlist || []).join(","));
  } catch {
    console.log(text.slice(0, 250));
  }
  await new Promise((r) => setTimeout(r, 350));
}
