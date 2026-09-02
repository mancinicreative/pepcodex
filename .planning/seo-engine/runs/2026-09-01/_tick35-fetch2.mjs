const ids = ['42628555', '33567185', '40421736'];
for (const id of ids) {
  const res = await fetch(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${id}&rettype=abstract&retmode=xml`,
    { headers: { 'User-Agent': 'pepcodex-tick35/1.0' } },
  );
  const xml = await res.text();
  const parts = [...xml.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)];
  const abs = parts
    .map((p) => {
      const label = (p[1].match(/Label="([^"]+)"/) || [])[1];
      const body = p[2].replace(/<[^>]+>/g, '');
      return label ? `${label}: ${body}` : body;
    })
    .join('\n');
  const nct = (xml.match(/NCT\d+/g) || []).join(',');
  const nMatch = abs.match(/\b(?:n\s*=\s*|random(?:ly assigned|ised)|enrolled|participants)[^\n.]{0,80}/gi);
  console.log(`\n===== PMID ${id} STATUS ${res.status} NCT ${nct} =====`);
  console.log(abs);
  console.log('N-HINTS', nMatch);
  await new Promise((r) => setTimeout(r, 400));
}
