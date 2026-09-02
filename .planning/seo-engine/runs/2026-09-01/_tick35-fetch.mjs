/**
 * TICK35 cited-only fetch. Per-alias esearch (never OR-joined).
 * NCBI then CT.gov then openFDA.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, label) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'pepcodex-tick35/1.0 (integrity; mailto:unused)' },
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
      const body = p[2].replace(/<[^>]+>/g, '');
      return label ? `${label}: ${body}` : body;
    })
    .join('\n');
}

const pmids = [
  { id: '40421736', tag: 'GLORY-1', need: ['mazdutide', 'GLORY'] },
  { id: '42251595', tag: 'GLORY-2', need: ['mazdutide'] },
  { id: '42628555', tag: 'Hsia-US-P2', need: ['mazdutide'] },
  { id: '33567185', tag: 'STEP-1', need: ['semaglutide'] },
  { id: '37952131', tag: 'SELECT', need: ['semaglutide'] },
];

const aliases = [
  'mazdutide',
  'IBI362',
  'semaglutide',
  'GLORY-1',
  'GLORY-2',
  'SELECT semaglutide',
];

console.log('=== NCBI esearch per-alias ===');
for (const a of aliases) {
  const q = encodeURIComponent(`"${a}"[Title]`);
  const { status, text } = await get(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${q}&retmode=json&retmax=5`,
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
        `SUMMARY ${p.tag} PMID ${p.id}: title=${u?.title} source=${u?.source} pubdate=${u?.pubdate} nct=${(u?.articleids || [])
          .filter((x) => x.idtype === 'pmc' || x.idtype === 'doi' || x.idtype === 'pubmed')
          .map((x) => `${x.idtype}:${x.value}`)
          .join(';')}`,
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
    const hit = p.need.every((w) => (title + ' ' + abs).toLowerCase().includes(w.toLowerCase()));
    console.log(`TITLE ${p.tag}: ${title}`);
    console.log(`TOPICAL ${p.tag}: ${hit ? 'YES' : 'NO'} need=${p.need.join(',')}`);
    console.log(`ABSTRACT ${p.tag}:\n${abs}\n---`);
  }
  await sleep(400);
}

console.log('\n=== CT.gov v2 individual records ===');
const ncts = [
  'NCT05607680',
  'NCT06164873',
  'NCT06124807',
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
        `CT ${nct} brief=${idm.briefTitle} official=${idm.officialTitle} acronym=${idm.acronym} status=${st.overallStatus} phase=${JSON.stringify(des.phases)} enroll=${JSON.stringify(st.enrollmentInfo)} hasResults=${j.hasResults} start=${st.startDateStruct?.date} primaryComp=${st.primaryCompletionDateStruct?.date}`,
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
  ['mazdutide', 'openfda.generic_name:mazdutide'],
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

console.log('\nDONE TICK35 fetch');
