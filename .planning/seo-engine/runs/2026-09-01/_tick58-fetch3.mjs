const url =
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=40544433";
const res = await fetch(url, {
  headers: { "User-Agent": "pepcodex-tick58/1.0 (integrity; cited-only compare)" },
});
const text = await res.text();
console.log("STATUS", res.status, "len", text.length);
const start = text.search(/BACKGROUND:|Abstract/i);
console.log(text.slice(Math.max(0, start), text.length));
