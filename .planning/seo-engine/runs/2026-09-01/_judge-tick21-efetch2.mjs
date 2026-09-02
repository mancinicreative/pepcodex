// Judge fetch round 2: MASLD abstracts (39002641, 41113119) number verification.
const get = async (url) => {
  const r = await fetch(url, { headers: { 'User-Agent': 'pepcodex-judge/1.0' } });
  return { status: r.status, body: await r.text() };
};
const out = {};
for (const id of ['39002641', '41113119']) {
  const f = await get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${id}&rettype=abstract&retmode=text`);
  out[id] = { status: f.status, text: f.body };
  await new Promise(r => setTimeout(r, 400));
}
console.log(JSON.stringify(out, null, 2));
