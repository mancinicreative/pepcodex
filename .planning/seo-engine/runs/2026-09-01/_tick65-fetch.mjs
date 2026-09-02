/**
 * TICK65 per-alias fetch. Not OR-joined. Title-match before quote.
 * 5-Amino-1MQ + tirzepatide (SURMOUNT-1).
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick65/1.0 (integrity; cited-only compare)" },
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
    headers: { "User-Agent": "pepcodex-tick65/1.0 (integrity; cited-only compare)" },
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

async function esearch(term, retmax = 8) {
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
  console.log(text.slice(0, 4500));
  return { status, text };
}

async function ctgov(term) {
  const url =
    "https://clinicaltrials.gov/api/v2/studies?pageSize=6&query.term=" +
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
    primary: (outcomes.primaryOutcomes || []).map((o) => o.measure),
    sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
    primaryCompletion: statusM.primaryCompletionDateStruct,
  };
  console.log(JSON.stringify(row, null, 2));
  return { status, row };
}

async function openfda(field, value) {
  const url =
    "https://api.fda.gov/drug/drugsfda.json?limit=8&search=" +
    encodeURIComponent(`openfda.${field}:"${value}"`);
  const { status, json } = await getJson(url, `openFDA ${field} ${value}`);
  if (json?.error) {
    console.log(`error=${json.error.code} ${json.error.message}`);
    return { status, found: false };
  }
  const apps = (json?.results || []).map((r) => ({
    appl: r.application_number,
    sponsor: r.sponsor_name,
    brands: [...new Set((r.products || []).map((p) => p.brand_name))],
    submissions: (r.submissions || [])
      .filter((s) => /APPROVAL/i.test(s.submission_type || "") || /AP/i.test(s.submission_status || ""))
      .slice(0, 8)
      .map((s) => ({
        type: s.submission_type,
        status: s.submission_status,
        date: s.submission_status_date,
      })),
  }));
  console.log(JSON.stringify({ total: json?.meta?.results?.total, apps }, null, 2));
  return { status, found: apps.length > 0, apps };
}

async function main() {
  console.log("TICK65 fetch start", new Date().toISOString());

  const aliasTerms = [
    '"5-Amino-1MQ"',
    '"5-amino-1-MQ"',
    '"5-Amino-1-methylquinolinium"',
    '"5-amino-1-methylquinolinium"',
    '"SURMOUNT-1"',
    '"SURMOUNT 1" AND tirzepatide',
    "35658024[uid]",
    "NCT04184622",
    '"5-Amino-1MQ" AND "tirzepatide"',
    '"5-amino-1-methylquinolinium" AND "tirzepatide"',
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
    ]),
  ];
  const tirzIds = [
    ...new Set([
      "35658024",
      ...(searchHits['"SURMOUNT-1"']?.ids || []),
      ...(searchHits['"SURMOUNT 1" AND tirzepatide']?.ids || []),
      ...(searchHits["35658024[uid]"]?.ids || []),
      ...(searchHits["NCT04184622"]?.ids || []).slice(0, 8),
    ]),
  ];

  console.log("\n=== amino candidate esummary ===");
  const aminoSum = await esummary(aminoIds);
  await sleep(400);
  console.log("\n=== TITLE_MATCH amino ===");
  const aminoNeedles = ["5-amino", "1-methylquinolinium", "1mq", "nnmt"];
  for (const r of aminoSum.rows || []) {
    console.log(
      r.pmid + " | " + (titleMatch(r.title, aminoNeedles) ? "TITLE_MATCH" : "MISS") + " | " + r.title
    );
  }

  console.log("\n=== tirzepatide candidate esummary ===");
  const tirzSum = await esummary(tirzIds);
  await sleep(400);
  console.log("\n=== TITLE_MATCH tirzepatide ===");
  const tirzNeedles = ["tirzepatide", "surmount"];
  for (const r of tirzSum.rows || []) {
    console.log(
      r.pmid + " | " + (titleMatch(r.title, tirzNeedles) ? "TITLE_MATCH" : "MISS") + " | " + r.title
    );
  }

  const h2hIds = [
    ...new Set([
      ...(searchHits['"5-Amino-1MQ" AND "tirzepatide"']?.ids || []),
      ...(searchHits['"5-amino-1-methylquinolinium" AND "tirzepatide"']?.ids || []),
    ]),
  ];
  console.log("\n=== H2H ids ===", h2hIds.join(",") || "(none)");

  const toFetch = [
    ...new Set(["35013352", "39067875", "33645410", "35658024", ...aminoIds, ...h2hIds]),
  ];
  for (const id of toFetch) {
    await efetch(id);
    await sleep(400);
  }

  for (const term of ["5-Amino-1MQ", "5-amino-1-methylquinolinium", "NNMT 5-amino"]) {
    await ctgov(term);
    await sleep(250);
  }

  await ctgovNct("NCT04184622");
  await sleep(200);

  for (const g of ["5-amino-1mq", "5-amino-1-methylquinolinium", "tirzepatide"]) {
    await openfda("generic_name", g);
    await sleep(200);
  }
  for (const b of ["mounjaro", "zepbound"]) {
    await openfda("brand_name", b);
    await sleep(200);
  }

  console.log("\nTICK65 fetch end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
