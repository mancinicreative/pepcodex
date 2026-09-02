/**
 * One-run fetch for W2-F High slice 2: PubMed efetch + CT.gov v2.
 * Slugs: pf-08653944, ct-388, amycretin. Do not treat as truth without topical match.
 */
const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const UA = { 'User-Agent': 'PepCodex-verify/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PMIDs = ['42673585'];

const NCTs = [
  // pf-08653944 new
  'NCT07794774', 'NCT07794761', 'NCT07792954', 'NCT07519135',
  // pf-08653944 updated
  'NCT07400653', 'NCT07311850', 'NCT07575932', 'NCT07400679',
  'NCT07508241', 'NCT07595549',
  // ct-388 updated (no newTrials in scan)
  'NCT07670416', 'NCT07589686', 'NCT07351058', 'NCT06628362',
  'NCT07626515', 'NCT07351045', 'NCT06525935',
];

async function fetchT(url, ms = 30000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: { ...UA, accept: 'application/json' }, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

function parsePubmed(xml) {
  const out = {};
  for (const c of xml.split(/<PubmedArticle[ >]/).slice(1)) {
    const pm = (c.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
    if (!pm) continue;
    const abs = ((c.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/) || [])[1] || '')
      .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const absAll = [...c.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)]
      .map((m) => {
        const label = (m[1].match(/Label="([^"]+)"/) || [])[1] || '';
        const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        return label ? `${label}: ${text}` : text;
      })
      .join(' ');
    out[pm] = {
      pmid: pm,
      title: ((c.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || '').replace(/<[^>]+>/g, '').trim(),
      year: (c.match(/<PubDate>[\s\S]*?<Year>(\d{4})<\/Year>/) || [])[1] || '',
      journal: ((c.match(/<Title>([\s\S]*?)<\/Title>/) || [])[1] || '').replace(/<[^>]+>/g, '').trim(),
      ptypes: [...c.matchAll(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g)].map((m) => m[1]),
      abstract: absAll || abs,
    };
  }
  return out;
}

const papers = {};
for (let i = 0; i < PMIDs.length; i += 8) {
  const batch = PMIDs.slice(i, i + 8);
  const url = `${EUTILS}/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${batch.join(',')}`;
  const r = await fetchT(url);
  console.log(`pubmed batch ${batch.join(',')} status=${r.status}`);
  if (r.ok) Object.assign(papers, parsePubmed(await r.text()));
  await sleep(400);
}

const trials = {};
for (const nct of NCTs) {
  const url = `https://clinicaltrials.gov/api/v2/studies/${nct}?format=json`;
  try {
    const r = await fetchT(url);
    console.log(`ctgov ${nct} status=${r.status}`);
    if (!r.ok) {
      trials[nct] = { error: r.status };
      await sleep(200);
      continue;
    }
    const j = await r.json();
    const ps = j.protocolSection || {};
    const idm = ps.identificationModule || {};
    const stm = ps.statusModule || {};
    const dm = ps.designModule || {};
    const cm = ps.conditionsModule || {};
    const aim = ps.armsInterventionsModule || {};
    const om = ps.outcomesModule || {};
    const primaries = (om.primaryOutcomes || []).map((o) => o.measure).filter(Boolean);
    trials[nct] = {
      nctId: idm.nctId,
      briefTitle: idm.briefTitle,
      officialTitle: idm.officialTitle,
      acronym: idm.acronym || '',
      overallStatus: stm.overallStatus,
      hasResults: Boolean(j.hasResults),
      phase: dm.phases || [],
      enrollment: dm.enrollmentInfo || {},
      conditions: cm.conditions || [],
      interventions: (aim.interventions || []).map((i) => ({
        type: i.type,
        name: i.name,
        otherNames: i.otherNames || [],
      })),
      startDate: stm.startDateStruct?.date || null,
      primaryCompletionDate: stm.primaryCompletionDateStruct?.date || null,
      completionDate: stm.completionDateStruct?.date || null,
      lastUpdatePostDate: stm.lastUpdatePostDateStruct?.date || null,
      primaryOutcomes: primaries.slice(0, 3),
    };
  } catch (e) {
    trials[nct] = { error: String(e) };
  }
  await sleep(200);
}

const out = {
  fetchedAt: new Date().toISOString(),
  papers,
  trials,
};
const { writeFileSync } = await import('node:fs');
writeFileSync(new URL('./_fetch-fresh-high-2.json', import.meta.url), JSON.stringify(out, null, 2));
console.log(`wrote papers=${Object.keys(papers).length} trials=${Object.keys(trials).length}`);
