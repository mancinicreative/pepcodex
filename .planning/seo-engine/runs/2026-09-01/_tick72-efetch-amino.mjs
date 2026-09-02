const ids = ["35013352", "39067875"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function efetch(id) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=" +
    id;
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick72/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== efetch ${id} STATUS ${res.status} ===`);
  console.log(text);
}

async function main() {
  for (const id of ids) {
    await efetch(id);
    await sleep(500);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
