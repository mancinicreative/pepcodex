/**
 * TICK60 fetch3: remaining openFDA. 404 = NOT_FOUND (success).
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function openfda(generic) {
  const url =
    "https://api.fda.gov/drug/drugsfda.json?limit=1&search=" +
    encodeURIComponent(`openfda.generic_name:"${generic}"`);
  for (let i = 1; i <= 4; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "pepcodex-tick60/1.0 (integrity; cited-only compare)" },
      });
      const text = await res.text();
      console.log(`\n=== openFDA ${generic} try ${i} STATUS ${res.status} ===`);
      if (res.status === 404) {
        console.log("NOT_FOUND");
        return { status: 404, found: false };
      }
      if (res.status === 200) {
        const json = JSON.parse(text);
        if (json?.error) {
          console.log(`error=${json.error.code} ${json.error.message}`);
          return { status: 200, found: false };
        }
        const hit = json?.results?.[0];
        console.log(JSON.stringify({ found: !!hit, appNo: hit?.application_number }, null, 2));
        return { status: 200, found: !!hit };
      }
    } catch (e) {
      console.log("try", i, e.cause?.code || e.message);
    }
    await sleep(1200 * i);
  }
  return { status: 0, found: null };
}

async function main() {
  console.log("TICK60 fetch3 start", new Date().toISOString());
  for (const g of [
    "5-amino-1-methylquinolinium",
    "ct-388",
    "ct388",
    "enicepatide",
    "ro7795068",
  ]) {
    await openfda(g);
    await sleep(400);
  }
  console.log("\nTICK60 fetch3 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
