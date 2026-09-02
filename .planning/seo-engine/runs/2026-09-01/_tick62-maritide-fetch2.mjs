/**
 * TICK62 fetch2: retry H2H + NCT04478708 pubmed + openFDA after 429/timeout.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, 700));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick62/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _parseError: true, _rawHead: text.slice(0, 180) };
  }
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, json };
}

async function retry(fn, n = 5) {
  let last;
  for (let i = 1; i <= n; i++) {
    last = await fn();
    if (last.status === 200 || last.status === 404) return last;
    console.log("retry", i, "status", last.status);
    await sleep(1000 * i);
  }
  return last;
}

async function esearch(term) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=8&term=" +
    encodeURIComponent(term);
  const { status, json } = await retry(() => getJson(url, `esearch ${term}`));
  console.log(`count=${json?.esearchresult?.count} ids=${(json?.esearchresult?.idlist || []).join(",")}`);
}

async function openfda(generic) {
  const url =
    "https://api.fda.gov/drug/drugsfda.json?limit=1&search=" +
    encodeURIComponent(`openfda.generic_name:"${generic}"`);
  const { status, json } = await retry(() => getJson(url, `openFDA generic ${generic}`));
  if (json?.error) {
    console.log(`error=${json.error.code} ${json.error.message}`);
    return;
  }
  const hit = json?.results?.[0];
  console.log(JSON.stringify({ found: !!hit, brand: hit?.openfda?.brand_name, appNo: hit?.application_number }, null, 2));
}

async function main() {
  for (const term of [
    '"5-Amino-1MQ" AND "MariTide"',
    '"maritide"',
    '"AMG 133"',
    "NCT04478708",
  ]) {
    await esearch(term);
    await sleep(600);
  }
  for (const g of [
    "5-amino-1mq",
    "5-amino-1-methylquinolinium",
    "maritide",
    "maridebart",
    "maridebart cafraglutide",
    "amg 133",
    "amg133",
  ]) {
    await openfda(g);
    await sleep(400);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
