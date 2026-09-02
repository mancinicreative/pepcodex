/**
 * TICK75 fetch3: TRANSCEND abstract + CT.gov enrollment fields.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function retry(fn, n = 4) {
  let last;
  for (let i = 1; i <= n; i++) {
    last = await fn();
    if (last.status === 200) return last;
    console.log("retry", i, "status", last.status);
    await sleep(800 * i);
  }
  return last;
}

async function main() {
  const pmidUrl =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=42250575";
  const a = await retry(async () => {
    const res = await fetch(pmidUrl, {
      headers: { "User-Agent": "pepcodex-tick75/1.0 (integrity; cited-only compare)" },
    });
    const text = await res.text();
    console.log("=== efetch 42250575 STATUS", res.status, "===");
    console.log(text);
    return { status: res.status };
  });

  for (const nct of ["NCT04881760", "NCT06354660"]) {
    const url = "https://clinicaltrials.gov/api/v2/studies/" + nct + "?fields=NCTId,BriefTitle,OverallStatus,Phase,EnrollmentInfo,HasResults,LeadSponsorName";
    const res = await fetch(url, {
      headers: { "User-Agent": "pepcodex-tick75/1.0 (integrity; cited-only compare)" },
    });
    const json = await res.json();
    console.log("\n=== CT.gov fields", nct, "STATUS", res.status, "===");
    console.log(JSON.stringify(json, null, 2).slice(0, 4000));
    await sleep(200);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
