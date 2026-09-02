/**
 * TICK61 per-alias fetch. Not OR-joined. Title-match before quote.
 * 5-Amino-1MQ + AOD-9604. Human RCT / Phase 3 searches included.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick61/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _parseError: true, _rawHead: text.slice(0, 240) };
  }
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, json, text };
}

async function getText(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick61/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, text };
}

async function retry(fn, n = 4) {
  let last;
  for (let i = 1; i <= n; i++) {
    last = await fn();
    if (last.status === 200) return last;
    console.log("retry", i, "status", last.status);
    await sleep(800 * i);
  }
  return last;
}

function titleMatch(title, needles) {
  const t = (title || "").toLowerCase();
  return needles.some((n) => t.includes(n.toLowerCase()));
}

async function esearch(term, retmax = 25) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=" +
    retmax +
    "&term=" +
    encodeURIComponent(term);
  const { status, json } = await retry(() => getJson(url, `esearch ${term}`));
  const ids = json?.esearchresult?.idlist || [];
  const count = json?.esearchresult?.count;
  console.log(`count=${count} ids=${ids.join(",")}`);
  return { status, count, ids };
}

async function esummary(ids) {
  if (!ids.length) return { status: null, rows: [] };
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=" +
    ids.join(",");
  const { status, json } = await retry(() => getJson(url, `esummary ${ids.join(",")}`));
  const result = json?.result || {};
  const rows = (json?.result?.uids || ids).map((id) => {
    const r = result[id] || {};
    return {
      pmid: id,
      title: r.title,
      source: r.source,
      pubdate: r.pubdate,
      doi: (r.elocationid || "").replace(/^doi:\s*/i, ""),
    };
  });
  console.log(JSON.stringify(rows, null, 2));
  return { status, rows };
}

async function efetch(id) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=" +
    id;
  const { status, text } = await retry(() => getText(url, `efetch ${id}`));
  console.log(text.slice(0, 4000));
  return { status, text };
}

async function ctgov(term) {
  const url =
    "https://clinicaltrials.gov/api/v2/studies?pageSize=8&query.term=" +
    encodeURIComponent(term);
  const { status, json } = await getJson(url, `CT.gov search ${term}`);
  const studies = json?.studies || [];
  const rows = studies.map((s) => {
    const proto = s.protocolSection || {};
    const id = proto.identificationModule || {};
    const statusM = proto.statusModule || {};
    const design = proto.designModule || {};
    return {
      nct: id.nctId,
      title: id.officialTitle || id.briefTitle,
      acronym: id.acronym,
      status: statusM.overallStatus,
      phase: (design.phases || []).join("/"),
      enroll: statusM.enrollmentInfo,
      hasResults: s.hasResults,
    };
  });
  console.log(`n=${studies.length}`);
  console.log(JSON.stringify(rows, null, 2));
  return { status, rows };
}

async function openfda(generic) {
  const url =
    "https://api.fda.gov/drug/drugsfda.json?limit=1&search=" +
    encodeURIComponent(`openfda.generic_name:"${generic}"`);
  const { status, json } = await getJson(url, `openFDA generic ${generic}`);
  if (json?.error) {
    console.log(`error=${json.error.code} ${json.error.message}`);
    return { status, found: false };
  }
  const hit = json?.results?.[0];
  console.log(
    JSON.stringify(
      {
        found: !!hit,
        brand: hit?.openfda?.brand_name,
        generic: hit?.openfda?.generic_name,
        appNo: hit?.application_number,
      },
      null,
      2
    )
  );
  return { status, found: !!hit };
}

async function main() {
  console.log("TICK61 fetch start", new Date().toISOString());

  const aliasTerms = [
    '"5-Amino-1MQ"',
    '"5-amino-1-MQ"',
    '"5-Amino-1-methylquinolinium"',
    '"5-amino-1-methylquinolinium"',
    '"AOD-9604"',
    '"AOD9604"',
    '"AOD 9604"',
    '"5-Amino-1MQ" AND "AOD-9604"',
    '"5-amino-1-methylquinolinium" AND "AOD9604"',
    '"AOD-9604" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III" OR "phase 2")',
    '"AOD9604" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III")',
    '"AOD-9604" AND (human OR humans OR "healthy volunteers")',
    "35013352[uid]",
    "15134286[uid]",
    "11146367[uid]",
    "11673763[uid]",
    "16625817[uid]",
    "25208511[uid]",
  ];
  const searchHits = {};
  for (const term of aliasTerms) {
    searchHits[term] = await esearch(term);
    await sleep(400);
  }

  const aminoIds = [
    ...new Set([
      ...(searchHits['"5-Amino-1MQ"']?.ids || []),
      ...(searchHits['"5-amino-1-MQ"']?.ids || []),
      ...(searchHits['"5-Amino-1-methylquinolinium"']?.ids || []),
      ...(searchHits['"5-amino-1-methylquinolinium"']?.ids || []),
      ...(searchHits["35013352[uid]"]?.ids || []),
    ]),
  ];
  const aodIds = [
    ...new Set([
      ...(searchHits['"AOD-9604"']?.ids || []),
      ...(searchHits['"AOD9604"']?.ids || []),
      ...(searchHits['"AOD 9604"']?.ids || []),
      ...(searchHits['"AOD-9604" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III" OR "phase 2")']?.ids || []),
      ...(searchHits['"AOD9604" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III")']?.ids || []),
      ...(searchHits['"AOD-9604" AND (human OR humans OR "healthy volunteers")']?.ids || []),
      ...(searchHits["15134286[uid]"]?.ids || []),
      ...(searchHits["11146367[uid]"]?.ids || []),
      ...(searchHits["11673763[uid]"]?.ids || []),
      ...(searchHits["16625817[uid]"]?.ids || []),
      ...(searchHits["25208511[uid]"]?.ids || []),
    ]),
  ];

  console.log("\n=== amino candidate esummary ===");
  const aminoSum = await esummary(aminoIds);
  await sleep(400);
  console.log("\n=== TITLE_MATCH amino ===");
  const aminoNeedles = ["5-amino", "1-methylquinolinium", "1mq", "nnmt"];
  for (const r of aminoSum.rows || []) {
    const ok = titleMatch(r.title, aminoNeedles);
    console.log(r.pmid + (ok ? " | TITLE_MATCH | " : " | MISS | ") + r.title);
  }

  console.log("\n=== AOD candidate esummary ===");
  const aodSum = await esummary(aodIds);
  await sleep(400);
  console.log("\n=== TITLE_MATCH AOD ===");
  const aodNeedles = ["aod-9604", "aod9604", "aod 9604"];
  for (const r of aodSum.rows || []) {
    const ok = titleMatch(r.title, aodNeedles);
    console.log(r.pmid + (ok ? " | TITLE_MATCH | " : " | MISS | ") + r.title);
  }

  const h2hIds = [
    ...new Set([
      ...(searchHits['"5-Amino-1MQ" AND "AOD-9604"']?.ids || []),
      ...(searchHits['"5-amino-1-methylquinolinium" AND "AOD9604"']?.ids || []),
    ]),
  ];
  console.log("\n=== H2H ids ===", h2hIds.join(",") || "(none)");

  const toFetch = [
    ...new Set([
      "35013352",
      "39067875",
      "33645410",
      "15134286",
      "11146367",
      "11673763",
      "16625817",
      "25208511",
      ...aminoIds,
      ...aodIds,
      ...h2hIds,
    ]),
  ].slice(0, 22);
  for (const id of toFetch) {
    await efetch(id);
    await sleep(400);
  }

  for (const term of [
    "5-Amino-1MQ",
    "5-amino-1-methylquinolinium",
    "NNMT 5-amino",
    "AOD-9604",
    "AOD9604",
    "AOD 9604",
  ]) {
    await ctgov(term);
    await sleep(250);
  }

  for (const g of [
    "5-amino-1mq",
    "5-amino-1-methylquinolinium",
    "aod-9604",
    "aod9604",
  ]) {
    await openfda(g);
    await sleep(200);
  }

  console.log("\nTICK61 fetch end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
