const url =
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=40550229,40550231,35658024";
const r = await fetch(url, {
  headers: { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" },
});
console.log("STATUS", r.status);
const xml = await r.text();
const parts = xml.split(/<PubmedArticle[ >]/).slice(1);
for (const c of parts) {
  const pm = (c.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
  const title = ((c.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || "")
    .replace(/<[^>]+>/g, "")
    .trim();
  const abstracts = [...c.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)].map((m) => {
    const label = (m[1].match(/Label="([^"]+)"/) || [])[1] || "";
    const text = m[2]
      .replace(/<[^>]+>/g, "")
      .replace(/&#xb7;/g, ".")
      .replace(/&#x2013;/g, "-")
      .replace(/&#x2212;/g, "-")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();
    return (label ? label + ": " : "") + text;
  });
  const nct = [...c.matchAll(/NCT\d+/g)].map((x) => x[0]);
  console.log("===== PMID", pm, "=====");
  console.log("TITLE:", title);
  console.log("NCT:", [...new Set(nct)].join(", "));
  console.log(abstracts.join("\n\n"));
  console.log("");
}
