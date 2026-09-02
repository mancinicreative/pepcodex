/* Independent Judge fetch for L4-TICK36. esummary + efetch per PMID, topical match by eye. */
const UA = { 'User-Agent': 'PepCodex-judge/1.0 (mailto:admin@pepcodex.com)' };
const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PMIDS = ['33567185', '35658024', '37952131', '40353578', '34170647', '41406444'];

async function get(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30000);
  try {
    const r = await fetch(url, { headers: UA, signal: ctrl.signal });
    return { status: r.status, body: await r.text() };
  } finally { clearTimeout(t); }
}

for (const pmid of PMIDS) {
  const s = await get(`${EUTILS}/esummary.fcgi?db=pubmed&retmode=json&id=${pmid}`);
  let title = '(esummary parse failed)';
  try { title = JSON.parse(s.body).result?.[pmid]?.title ?? '(missing)'; } catch {}
  console.log(`\n===== PMID ${pmid} | esummary STATUS ${s.status} =====`);
  console.log(`TITLE: ${title}`);
  await sleep(400);

  const f = await get(`${EUTILS}/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${pmid}`);
  console.log(`efetch STATUS ${f.status}`);
  const m = f.body.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g) || [];
  const abs = m.map((x) => x.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).join(' ');
  console.log(`ABSTRACT: ${abs.slice(0, 4200)}`);
  await sleep(400);
}
