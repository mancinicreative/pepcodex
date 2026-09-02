/**
 * TICK61 openFDA retry + leftover AOD abstracts if first script truncated.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick61/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _parseError: true, _rawHead: text.slice(0, 240) };
  }
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, json, text };
}

async function getText(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick61/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, text };
}

async function retry(fn, n = 6) {
  let last;
  for (let i = 1; i <= n; i++) {
    try {
      last = await fn();
      if (last.status === 200 || last.status === 404) return last;
      console.log("retry", i, "status", last.status);
    } catch (e) {
      console.log("retry", i, "err", e.cause?.code || e.message);
      last = { status: 0, json: null, text: String(e) };
    }
    await sleep(1200 * i);
  }
  return last;
}

async function efetch(id) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=" +
    id;
  const { status, text } = await retry(() => getText(url, `efetch ${id}`));
  console.log(text.slice(0, 4500));
  return { status, text };
}

async function openfda(generic) {
  const url =
    "https://api.fda.gov/drug/drugsfda.json?limit=1&search=" +
    encodeURIComponent(`openfda.generic_name:"${generic}"`);
  const { status, json } = await retry(() => getJson(url, `openFDA generic ${generic}`));
  if (json?.error) {
    console.log(`error=${json.error.code} ${json.error.message}`);
    return { status, found: false };
  }
  const hit = json?.results?.[0];
  console.log(
    JSON.stringify(
      {
        found: !!hit,
        brand: hit?.openfda?.brand_name,
        generic: hit?.openfda?.generic_name,
        appNo: hit?.application_number,
      },
      null,
      2
    )
  );
  return { status, found: !!hit };
}

async function main() {
  console.log("TICK61 fetch2 start", new Date().toISOString());
  for (const id of [
    "15134286",
    "11146367",
    "11673763",
    "16625817",
    "25208511",
    "16931496",
    "17971763",
    "22435392",
    "26275694",
    "24976118",
    "24124033",
    "11713213",
  ]) {
    await efetch(id);
    await sleep(400);
  }
  for (const g of ["5-amino-1mq", "5-amino-1-methylquinolinium", "aod-9604", "aod9604"]) {
    await openfda(g);
    await sleep(400);
  }
  console.log("\nTICK61 fetch2 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
