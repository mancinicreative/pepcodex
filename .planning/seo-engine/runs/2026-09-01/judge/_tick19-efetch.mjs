/* L4-TICK19-ORFOR-TIRZ judge fetch — independent re-fetch, 2026-09-02.
 * PMIDs: 40960239 (ATTAIN-1), 37351564 (orforglipron ph2), 35658024 (SURMOUNT-1)
 * openFDA: drugsfda application_number NDA220934
 */
const UA = { 'User-Agent': 'PepCodex-verify/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  return { ok: r.ok, status: r.status, text: await r.text() };
}

const pmids = ['40960239', '37351564', '35658024'];
const r1 = await get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${pmids.join(',')}`);
console.log('=== PUBMED EFETCH status', r1.status, '===');
for (const c of r1.text.split(/<PubmedArticle[ >]/).slice(1)) {
  const pm = (c.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
  const title = ((c.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || '').replace(/<[^>]+>/g, '').trim();
  const journal = ((c.match(/<Title>([\s\S]*?)<\/Title>/) || [])[1] || '').replace(/<[^>]+>/g, '').trim();
  const year = (c.match(/<PubDate>[\s\S]*?<Year>(\d{4})<\/Year>/) || [])[1] || '';
  const blob = c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log(`\n----- PMID ${pm} | ${journal} | ${year} -----`);
  console.log('TITLE:', title);
  // print abstract-ish window: first 2600 chars of blob after title
  console.log('BLOB:', blob.slice(0, 2600));
}
await sleep(500);

const r2 = await get('https://api.fda.gov/drug/drugsfda.json?search=products.application_number:"NDA220934"&limit=1');
console.log('\n=== OPENFDA DRUGSFDA status', r2.status, '===');
if (r2.ok) {
  const j = JSON.parse(r2.text);
  const rec = j.results?.[0];
  if (rec) {
    console.log('application_number:', rec.application_number);
    console.log('sponsor:', rec.sponsor_name);
    for (const p of rec.products || []) {
      console.log('product:', p.brand_name, '|', p.active_ingredients?.map(a => `${a.name} ${a.strength}`).join('; '), '|', p.route, '|', p.marketing_status);
    }
    for (const s of rec.submissions || []) {
      console.log('submission:', s.submission_type, s.submission_number, '| status:', s.submission_status, '| date:', s.submission_status_date, '| class:', s.submission_class_code, s.submission_class_code_description || '');
    }
  }
} else {
  console.log(r2.text.slice(0, 500));
}
