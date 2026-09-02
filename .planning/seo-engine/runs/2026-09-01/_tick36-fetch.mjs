const UA = { 'User-Agent': 'PepCodex-verify/1.0 (mailto:admin@pepcodex.com)' };
const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PMIDS = [
  { id: '33567185', expect: /semaglutide/i, label: 'STEP 1' },
  { id: '35658024', expect: /tirzepatide/i, label: 'SURMOUNT-1' },
  { id: '37952131', expect: /semaglutide/i, label: 'SELECT' },
  { id: '40353578', expect: /tirzepatide|semaglutide/i, label: 'SURMOUNT-5' },
  { id: '34170647', expect: /tirzepatide|semaglutide/i, label: 'SURPASS-2' },
  { id: '41406444', expect: /tirzepatide/i, label: 'SURPASS-CVOT' },
];

async function fetchT(url) {
  const r = await fetch(url, { headers: UA });
  return { status: r.status, text: await r.text() };
}

async function main() {
  const search = await fetchT(
    `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=${encodeURIComponent('Aronne SURMOUNT-5')}`,
  );
  console.log('ESEARCH Aronne SURMOUNT-5 STATUS', search.status);
  try {
    const j = JSON.parse(search.text);
    console.log('ESEARCH ids', j.esearchresult?.idlist, 'count', j.esearchresult?.count);
  } catch (e) {
    console.log('ESEARCH parse fail', search.text.slice(0, 200));
  }
  await sleep(400);

  for (const p of PMIDS) {
    const sum = await fetchT(
      `${EUTILS}/esummary.fcgi?db=pubmed&retmode=json&id=${p.id}`,
    );
    console.log('\n====', p.label, 'PMID', p.id, 'ESUMMARY', sum.status);
    let title = '';
    try {
      const j = JSON.parse(sum.text);
      const rec = j.result?.[p.id];
      title = rec?.title || '';
      console.log('title:', title);
      console.log('source:', rec?.source, rec?.pubdate, rec?.elocationid);
    } catch (e) {
      console.log('esummary parse fail', sum.text.slice(0, 300));
    }
    const titleOk = p.expect.test(title);
    console.log('TITLE_MATCH', titleOk);
    await sleep(400);

    const ef = await fetchT(
      `${EUTILS}/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=${p.id}`,
    );
    console.log('EFETCH', ef.status);
    console.log(ef.text);
    await sleep(400);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
