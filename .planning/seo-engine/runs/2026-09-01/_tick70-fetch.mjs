/**
 * TICK70 per-alias fetch. Not OR-joined. Title-match before quote.
 * AOD-9604 + tirzepatide. Human RCT / Phase 3 searches included.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick70/1.0 (integrity; cited-only compare)" },
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
    headers: { "User-Agent": "pepcodex-tick70/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, text };
}

async function retry(fn, n = 6) {
  let last;
  for (let i = 1; i <= n; i++) {
    try {
      last = await fn();
      if (last.status === 200 || last.status === 404) return last;
      console.log("retry", i, "status", last.status);
    } catch (err) {
      last = { status: 0, error: String(err) };
      console.log("retry", i, "network", err?.cause?.code || err.message);
    }
    await sleep(1200 * i);
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
  console.log(text.slice(0, 4500));
  return { status, text };
}

async function ctgov(term) {
  const url =
    "https://clinicaltrials.gov/api/v2/studies?pageSize=8&query.term=" +
    encodeURIComponent(term);
  const { status, json } = await retry(() => getJson(url, `CT.gov search ${term}`));
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
  const { status, json } = await retry(() => getJson(url, `CT.gov ${nct}`));
  const s = json?.protocolSection ? json : json?.studies?.[0];
  const proto = s?.protocolSection || {};
  const id = proto.identificationModule || {};
  const statusM = proto.statusModule || {};
  const design = proto.designModule || {};
  const row = {
    nct: id.nctId,
    title: id.officialTitle || id.briefTitle,
    acronym: id.acronym,
    status: statusM.overallStatus,
    phase: (design.phases || []).join("/"),
    enroll: statusM.enrollmentInfo,
    hasResults: s?.hasResults,
    sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
    primaryCompletion: statusM.primaryCompletionDateStruct,
  };
  console.log(JSON.stringify(row, null, 2));
  return { status, row };
}

async function openfda(field, value) {
  const url =
    "https://api.fda.gov/drug/drugsfda.json?limit=3&search=" +
    encodeURIComponent(`${field}:"${value}"`);
  const { status, json } = await retry(() => getJson(url, `openFDA ${field} ${value}`));
  if (json?.error) {
    console.log(`error=${json.error.code} ${json.error.message}`);
    return { status, found: false };
  }
  const apps = (json?.results || []).map((r) => ({
    appl: r.application_number,
    sponsor: r.sponsor_name,
    brands: [...new Set((r.products || []).map((p) => p.brand_name))],
    origAp: (r.submissions || [])
      .filter((s) => s.submission_type === "ORIG" && s.submission_status === "AP")
      .map((s) => s.submission_status_date),
  }));
  console.log(JSON.stringify({ found: apps.length > 0, apps }, null, 2));
  return { status, found: apps.length > 0, apps };
}

async function main() {
  console.log("TICK70 fetch start", new Date().toISOString());

  const aliasTerms = [
    '"AOD-9604"',
    '"AOD9604"',
    '"AOD 9604"',
    '"tirzepatide"',
    '"SURMOUNT-1"',
    '"AOD-9604" AND "tirzepatide"',
    '"AOD9604" AND "tirzepatide"',
    '"AOD-9604" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III" OR "phase 2")',
    '"AOD9604" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III" OR "phase 2")',
    "15134286[uid]",
    "11146367[uid]",
    "11673763[uid]",
    "16625817[uid]",
    "25208511[uid]",
    "35658024[uid]",
    "NCT04184622",
  ];
  const searchHits = {};
  for (const term of aliasTerms) {
    searchHits[term] = await esearch(term, term === '"tirzepatide"' ? 5 : 25);
    await sleep(400);
  }

  const aodIds = [
    ...new Set([
      ...(searchHits['"AOD-9604"']?.ids || []),
      ...(searchHits['"AOD9604"']?.ids || []),
      ...(searchHits['"AOD 9604"']?.ids || []),
      ...(searchHits['"AOD-9604" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III" OR "phase 2")']?.ids || []),
      ...(searchHits['"AOD9604" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III" OR "phase 2")']?.ids || []),
      ...(searchHits["15134286[uid]"]?.ids || []),
      ...(searchHits["11146367[uid]"]?.ids || []),
      ...(searchHits["11673763[uid]"]?.ids || []),
      ...(searchHits["16625817[uid]"]?.ids || []),
      ...(searchHits["25208511[uid]"]?.ids || []),
    ]),
  ];
  const tirzIds = [
    ...new Set([
      ...(searchHits["35658024[uid]"]?.ids || []),
      ...(searchHits['"SURMOUNT-1"']?.ids || []).slice(0, 8),
      ...(searchHits["NCT04184622"]?.ids || []).slice(0, 8),
    ]),
  ];

  console.log("\n=== AOD candidate esummary ===");
  const aodSum = await esummary(aodIds);
  await sleep(400);
  console.log("\n=== TITLE_MATCH AOD ===");
  const aodNeedles = ["aod-9604", "aod9604", "aod 9604"];
  for (const r of aodSum.rows || []) {
    const ok = titleMatch(r.title, aodNeedles);
    console.log(r.pmid + (ok ? " | TITLE_MATCH | " : " | MISS | ") + r.title);
  }

  console.log("\n=== tirzepatide candidate esummary ===");
  const tirzSum = await esummary(tirzIds);
  await sleep(400);
  console.log("\n=== TITLE_MATCH tirzepatide/SURMOUNT ===");
  const tirzNeedles = ["tirzepatide", "surmount"];
  for (const r of tirzSum.rows || []) {
    const ok = titleMatch(r.title, tirzNeedles);
    console.log(r.pmid + (ok ? " | TITLE_MATCH | " : " | MISS | ") + r.title);
  }

  const h2hIds = [
    ...new Set([
      ...(searchHits['"AOD-9604" AND "tirzepatide"']?.ids || []),
      ...(searchHits['"AOD9604" AND "tirzepatide"']?.ids || []),
    ]),
  ];
  console.log("\n=== H2H ids ===", h2hIds.join(",") || "(none)");

  const toFetch = [
    ...new Set([
      "15134286",
      "11146367",
      "11673763",
      "16625817",
      "25208511",
      "35658024",
      ...aodIds,
      ...h2hIds,
    ]),
  ].slice(0, 22);
  for (const id of toFetch) {
    await efetch(id);
    await sleep(400);
  }

  for (const term of ["AOD-9604", "AOD9604", "AOD 9604", "SURMOUNT-1", "NCT04184622"]) {
    await ctgov(term);
    await sleep(250);
  }
  await ctgovNct("NCT04184622");
  await sleep(250);

  for (const [field, value] of [
    ["openfda.generic_name", "aod-9604"],
    ["openfda.generic_name", "aod9604"],
    ["openfda.generic_name", "tirzepatide"],
  ]) {
    await openfda(field, value);
    await sleep(200);
  }

  console.log("\nTICK70 fetch end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
