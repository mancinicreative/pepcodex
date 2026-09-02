/**
 * TICK38 cited-only fetch for maritide-vs-semaglutide.
 * Per-alias esearch (never OR-joined). NCBI then CT.gov then openFDA.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, label) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'pepcodex-tick38/1.0 (integrity; mailto:unused)' },
    });
    const text = await res.text();
    console.log(`STATUS ${res.status} ${label} ${Date.now() - t0}ms ${url}`);
    return { status: res.status, text };
  } catch (err) {
    console.log(`FAIL ${label} ${err.message} ${url}`);
    return { status: 0, text: String(err) };
  }
}

function titleOfXml(xml) {
  const m = xml.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/);
  return m ? m[1].replace(/<[^>]+>/g, '') : '';
}

function abstractOfXml(xml) {
  const parts = [...xml.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)];
  if (!parts.length) return '';
  return parts
    .map((p) => {
      const label = (p[1].match(/Label="([^"]+)"/) || [])[1];
      const body = p[2]
        .replace(/<[^>]+>/g, '')
        .replace(/&#xb7;/g, '.')
        .replace(/&#x2013;/g, '-')
        .replace(/&#x2212;/g, '-')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
      return label ? `${label}: ${body}` : body;
    })
    .join('\n');
}

const aliases = [
  'maridebart cafraglutide',
  'maridebart',
  'MariTide',
  'AMG 133',
  'MARITIME-1',
  'MARITIME-2',
  'semaglutide',
];

console.log('=== NCBI esearch per-alias ===');
for (const a of aliases) {
  const q = encodeURIComponent(`"${a}"[Title]`);
  const { status, text } = await get(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${q}&retmode=json&retmax=8`,
    `esearch ${a}`,
  );
  if (status === 200) {
    try {
      const j = JSON.parse(text);
      const ids = j.esearchresult?.idlist || [];
      const count = j.esearchresult?.count;
      console.log(`COUNT "${a}" = ${count} ids=${ids.join(',')}`);
    } catch (e) {
      console.log(`PARSE esearch ${a}: ${e.message}`);
    }
  }
  await sleep(400);
}

const extraSearches = [
  ['NCT06858839', 'NCT06858839'],
  ['NCT06858878', 'NCT06858878'],
  ['NCT05669599', 'NCT05669599'],
  ['MARITIME-1 maridebart', '"MARITIME-1" maridebart'],
  ['MARITIME-2 maridebart', '"MARITIME-2" maridebart'],
];
console.log('\n=== NCBI esearch NCT / MARITIME (not title-restricted) ===');
for (const [tag, term] of extraSearches) {
  const { status, text } = await get(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(term)}&retmode=json&retmax=5`,
    `esearch ${tag}`,
  );
  if (status === 200) {
    try {
      const j = JSON.parse(text);
      console.log(`COUNT ${tag} = ${j.esearchresult?.count} ids=${(j.esearchresult?.idlist || []).join(',')}`);
    } catch (e) {
      console.log(`PARSE esearch ${tag}: ${e.message}`);
    }
  }
  await sleep(400);
}

const pmids = [
  { id: '40549887', tag: 'P2-maridebart', need: ['maridebart'] },
  { id: '38316982', tag: 'P1-AMG133', need: ['GIP'] },
  { id: '33567185', tag: 'STEP-1', need: ['semaglutide'] },
  { id: '37952131', tag: 'SELECT', need: ['semaglutide'] },
];

console.log('\n=== NCBI esummary + efetch ===');
for (const p of pmids) {
  const sum = await get(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${p.id}&retmode=json`,
    `esummary ${p.tag}`,
  );
  if (sum.status === 200) {
    try {
      const j = JSON.parse(sum.text);
      const u = j.result?.[p.id];
      console.log(
        `SUMMARY ${p.tag} PMID ${p.id}: title=${u?.title} source=${u?.source} pubdate=${u?.pubdate}`,
      );
    } catch (e) {
      console.log(`PARSE esummary ${p.tag}: ${e.message}`);
    }
  }
  await sleep(400);
  const fet = await get(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${p.id}&rettype=abstract&retmode=xml`,
    `efetch ${p.tag}`,
  );
  if (fet.status === 200) {
    const title = titleOfXml(fet.text);
    const abs = abstractOfXml(fet.text);
    const blob = (title + ' ' + abs).toLowerCase();
    const hit = p.need.every((w) => blob.includes(w.toLowerCase()));
    const ncts = [...new Set(fet.text.match(/NCT\d+/g) || [])];
    console.log(`TITLE ${p.tag}: ${title}`);
    console.log(`NCT-IN-XML ${p.tag}: ${ncts.join(',') || '(none)'}`);
    console.log(`TOPICAL ${p.tag}: ${hit ? 'YES' : 'NO'} need=${p.need.join(',')}`);
    console.log(`ABSTRACT ${p.tag}:\n${abs}\n---`);
  }
  await sleep(400);
}

console.log('\n=== CT.gov v2 search MARITIME / maridebart ===');
const searches = [
  'MARITIME-1',
  'MARITIME-2',
  'maridebart',
  'AMG 133',
];
for (const q of searches) {
  const { status, text } = await get(
    `https://clinicaltrials.gov/api/v2/studies?query.term=${encodeURIComponent(q)}&pageSize=8&fields=protocolSection.identificationModule,protocolSection.statusModule,hasResults`,
    `ctsearch ${q}`,
  );
  if (status === 200) {
    try {
      const j = JSON.parse(text);
      for (const s of j.studies || []) {
        const idm = s.protocolSection?.identificationModule || {};
        const st = s.protocolSection?.statusModule || {};
        console.log(
          `HIT ${q} nct=${idm.nctId} acronym=${idm.acronym} brief=${idm.briefTitle} status=${st.overallStatus} hasResults=${s.hasResults}`,
        );
      }
      console.log(`HITCOUNT ${q} = ${(j.studies || []).length}`);
    } catch (e) {
      console.log(`PARSE ctsearch ${q}: ${e.message} snippet=${text.slice(0, 300)}`);
    }
  } else {
    console.log(`CT SEARCH BODY ${q}: ${text.slice(0, 400)}`);
  }
  await sleep(300);
}

console.log('\n=== CT.gov v2 individual records ===');
const ncts = [
  'NCT05669599',
  'NCT04478708',
  'NCT06858839',
  'NCT06858878',
  'NCT03548935',
  'NCT03574597',
];
for (const nct of ncts) {
  const { status, text } = await get(
    `https://clinicaltrials.gov/api/v2/studies/${nct}?fields=protocolSection.identificationModule,protocolSection.statusModule,protocolSection.designModule,hasResults`,
    `ctgov ${nct}`,
  );
  if (status === 200) {
    try {
      const j = JSON.parse(text);
      const idm = j.protocolSection?.identificationModule || {};
      const st = j.protocolSection?.statusModule || {};
      const des = j.protocolSection?.designModule || {};
      console.log(
        `CT ${nct} brief=${idm.briefTitle} acronym=${idm.acronym} status=${st.overallStatus} phase=${JSON.stringify(des.phases)} enroll=${JSON.stringify(st.enrollmentInfo)} hasResults=${j.hasResults} start=${st.startDateStruct?.date} primaryComp=${st.primaryCompletionDateStruct?.date} complete=${st.completionDateStruct?.date}`,
      );
    } catch (e) {
      console.log(`PARSE ctgov ${nct}: ${e.message} snippet=${text.slice(0, 400)}`);
    }
  } else {
    console.log(`CT BODY ${nct}: ${text.slice(0, 400)}`);
  }
  await sleep(300);
}

console.log('\n=== openFDA drugsfda ===');
const fda = [
  ['maridebart', 'openfda.generic_name:maridebart'],
  ['maritide', 'openfda.generic_name:maritide'],
  ['semaglutide-generic', 'openfda.generic_name:semaglutide'],
  ['ozempic-brand', 'products.brand_name:"OZEMPIC"'],
  ['wegovy-brand', 'products.brand_name:"WEGOVY"'],
  ['rybelsus-brand', 'products.brand_name:"RYBELSUS"'],
];
for (const [tag, q] of fda) {
  const { status, text } = await get(
    `https://api.fda.gov/drug/drugsfda.json?search=${encodeURIComponent(q)}&limit=5`,
    `fda ${tag}`,
  );
  if (status === 200) {
    try {
      const j = JSON.parse(text);
      for (const rec of j.results || []) {
        const apps = rec.application_number;
        const products = (rec.products || [])
          .slice(0, 8)
          .map((p) => `${p.brand_name}/${p.dosage_form}/${p.marketing_status}`)
          .join(' | ');
        const orig = (rec.submissions || []).find(
          (s) => s.submission_type === 'ORIG' && s.submission_status === 'AP',
        );
        console.log(
          `FDA ${tag} app=${apps} sponsor=${rec.sponsor_name} origAP=${orig?.submission_status_date} products=${products}`,
        );
      }
    } catch (e) {
      console.log(`PARSE fda ${tag}: ${e.message}`);
    }
  } else {
    console.log(`FDA BODY ${tag}: ${text.slice(0, 300)}`);
  }
  await sleep(250);
}

console.log('\nDONE TICK38 fetch');
