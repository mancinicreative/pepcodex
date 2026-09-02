/**
 * TICK76 per-alias fetch. Not OR-joined. Title-match before quote.
 * 5-Amino-1MQ + survodutide / SYNCHRONIZE-1.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick76/1.0 (integrity; cited-only compare)" },
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
    headers: { "User-Agent": "pepcodex-tick76/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, text };
}

async function retry(fn, n = 5) {
  let last;
  for (let i = 1; i <= n; i++) {
    last = await fn();
    if (last.status === 200) return last;
    console.log("retry", i, "status", last.status);
    await sleep(900 * i);
  }
  return last;
}

function titleMatch(title, needles) {
  const t = (title || "").toLowerCase();
  return needles.some((n) => t.includes(n.toLowerCase()));
}

async function esearch(term, retmax = 12) {
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
  console.log(text.slice(0, 5000));
  return { status, text };
}

async function ctgov(term) {
  const url =
    "https://clinicaltrials.gov/api/v2/studies?pageSize=10&query.term=" +
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

async function ctgovNct(nct) {
  const url = "https://clinicaltrials.gov/api/v2/studies/" + nct;
  const { status, json } = await getJson(url, `CT.gov ${nct}`);
  const s = json?.protocolSection ? json : (json?.studies && json.studies[0]) || json;
  const proto = s.protocolSection || {};
  const id = proto.identificationModule || {};
  const statusM = proto.statusModule || {};
  const design = proto.designModule || {};
  const outcomes = proto.outcomesModule || {};
  const row = {
    nct: id.nctId,
    brief: id.briefTitle,
    official: id.officialTitle,
    acronym: id.acronym,
    status: statusM.overallStatus,
    phase: (design.phases || []).join("/"),
    enroll: statusM.enrollmentInfo,
    hasResults: s.hasResults ?? json.hasResults,
    primaryCompletion: statusM.primaryCompletionDateStruct,
    primary: (outcomes.primaryOutcomes || []).map((o) => o.measure),
    sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
    collaborator: (proto.sponsorCollaboratorsModule?.collaborators || []).map((c) => c.name),
  };
  console.log(JSON.stringify(row, null, 2));
  return { status, row };
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
  console.log("TICK76 fetch start", new Date().toISOString());

  const aliasTerms = [
    '"5-Amino-1MQ"',
    '"5-amino-1-MQ"',
    '"5-Amino-1-methylquinolinium"',
    '"5-amino-1-methylquinolinium"',
    '"survodutide"',
    '"BI 456906"',
    '"BI456906"',
    '"SYNCHRONIZE-1"',
    '"SYNCHRONIZE 1"',
    '"SYNCHRONY"',
    '"5-Amino-1MQ" AND survodutide',
    '"5-amino-1-methylquinolinium" AND survodutide',
    '"5-Amino-1MQ" AND "SYNCHRONIZE-1"',
    "42253238[uid]",
    "38330987[uid]",
    "38095657[uid]",
    "35013352[uid]",
    "NCT06066515",
    "NCT04667377",
    "NCT04153929",
  ];
  const searchHits = {};
  for (const term of aliasTerms) {
    searchHits[term] = await esearch(term);
    await sleep(450);
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
  const survIds = [
    ...new Set([
      "42253238",
      "38330987",
      "38095657",
      ...(searchHits['"survodutide"']?.ids || []),
      ...(searchHits['"BI 456906"']?.ids || []),
      ...(searchHits['"BI456906"']?.ids || []),
      ...(searchHits['"SYNCHRONIZE-1"']?.ids || []),
      ...(searchHits['"SYNCHRONIZE 1"']?.ids || []),
      ...(searchHits["42253238[uid]"]?.ids || []),
      ...(searchHits["38330987[uid]"]?.ids || []),
      ...(searchHits["38095657[uid]"]?.ids || []),
      ...(searchHits["NCT06066515"]?.ids || []),
      ...(searchHits["NCT04667377"]?.ids || []),
      ...(searchHits["NCT04153929"]?.ids || []),
    ]),
  ];

  console.log("\n=== amino candidate esummary ===");
  const aminoSum = await esummary(aminoIds);
  await sleep(400);
  console.log("\n=== TITLE_MATCH amino ===");
  const aminoNeedles = ["5-amino", "1-methylquinolinium", "1mq", "nnmt"];
  const aminoMatch = (aminoSum.rows || []).filter((r) => titleMatch(r.title, aminoNeedles));
  console.log(aminoMatch.map((r) => r.pmid + " | TITLE_MATCH | " + r.title).join("\n") || "(none)");
  console.log("\n=== amino titles not matched ===");
  for (const r of aminoSum.rows || []) {
    if (!titleMatch(r.title, aminoNeedles)) console.log(r.pmid + " | MISS | " + r.title);
  }

  console.log("\n=== survodutide candidate esummary (capped 20) ===");
  const survCap = survIds.slice(0, 20);
  const survSum = await esummary(survCap);
  await sleep(400);
  console.log("\n=== TITLE_MATCH survodutide / SYNCHRONIZE ===");
  const survNeedles = ["survodutide", "bi 456906", "bi456906", "synchronize"];
  const survMatch = (survSum.rows || []).filter((r) => titleMatch(r.title, survNeedles));
  console.log(survMatch.map((r) => r.pmid + " | TITLE_MATCH | " + r.title).join("\n") || "(none)");
  console.log("\n=== surv titles not matched ===");
  for (const r of survSum.rows || []) {
    if (!titleMatch(r.title, survNeedles)) console.log(r.pmid + " | MISS | " + r.title);
  }

  const synchronyIds = searchHits['"SYNCHRONY"']?.ids || [];
  console.log("\n=== SYNCHRONY ids (wrong family; do not quote as survodutide) ===", synchronyIds.join(",") || "(none)");
  if (synchronyIds.length) {
    await esummary(synchronyIds.slice(0, 8));
  }

  const h2hIds = [
    ...new Set([
      ...(searchHits['"5-Amino-1MQ" AND survodutide']?.ids || []),
      ...(searchHits['"5-amino-1-methylquinolinium" AND survodutide']?.ids || []),
      ...(searchHits['"5-Amino-1MQ" AND "SYNCHRONIZE-1"']?.ids || []),
    ]),
  ];
  console.log("\n=== H2H ids ===", h2hIds.join(",") || "(none)");

  const toFetch = [
    ...new Set([
      "42253238",
      "38330987",
      "38095657",
      "35013352",
      "39067875",
      "33645410",
      ...aminoIds,
      ...h2hIds,
    ]),
  ].slice(0, 12);
  for (const id of toFetch) {
    await efetch(id);
    await sleep(450);
  }

  for (const term of [
    "5-Amino-1MQ",
    "5-amino-1-methylquinolinium",
    "NNMT 5-amino",
    "survodutide",
    "BI 456906",
    "SYNCHRONIZE-1",
    "SYNCHRONY",
  ]) {
    await ctgov(term);
    await sleep(250);
  }

  for (const nct of ["NCT06066515", "NCT04667377", "NCT04153929"]) {
    await ctgovNct(nct);
    await sleep(200);
  }

  for (const g of ["5-amino-1mq", "5-amino-1-methylquinolinium", "survodutide", "bi456906"]) {
    await openfda(g);
    await sleep(200);
  }

  console.log("\nTICK76 fetch end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
