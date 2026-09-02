/**
 * TICK64 abstract-only re-fetch. Collaborator lists truncated fetch1.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, 500));

async function retry(fn, n = 5) {
  let last;
  for (let i = 1; i <= n; i++) {
    last = await fn();
    if (last.status === 200) return last;
    console.log("retry", i, "status", last.status);
    await sleep(800 * i);
  }
  return last;
}

async function efetchXml(id) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=xml&id=" +
    id;
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick64/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== efetch xml ${id} STATUS ${res.status} ===`);
  const title = (text.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || "";
  const abstracts = [...text.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)].map(
    (m) => {
      const label = (m[1].match(/Label="([^"]+)"/) || [])[1] || "";
      const body = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      return (label ? label + ": " : "") + body;
    }
  );
  const doi = (text.match(/<ArticleId IdType="doi">([^<]+)<\/ArticleId>/) || [])[1] || "";
  const nct = [...text.matchAll(/NCT\d{8}/g)].map((m) => m[0]);
  console.log("TITLE:", title.replace(/\s+/g, " ").trim());
  console.log("DOI:", doi);
  console.log("NCT:", [...new Set(nct)].join(","));
  console.log("ABSTRACT:\n" + abstracts.join("\n\n"));
  return { status: res.status, title, abstracts, doi, nct };
}

async function main() {
  console.log("TICK64 fetch3 start", new Date().toISOString());
  for (const id of ["26132939", "27295427", "35013352"]) {
    await retry(() => efetchXml(id));
    await sleep(400);
  }
  console.log("\nTICK64 fetch3 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
