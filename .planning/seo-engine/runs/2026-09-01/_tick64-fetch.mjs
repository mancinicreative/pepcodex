/**
 * TICK64 per-alias fetch. Not OR-joined. Title-match before quote.
 * 5-Amino-1MQ + liraglutide (SCALE / LEADER).
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, 400));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick64/1.0 (integrity; cited-only compare)" },
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
    headers: { "User-Agent": "pepcodex-tick64/1.0 (integrity; cited-only compare)" },
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
  };
  console.log(JSON.stringify(row, null, 2));
  return { status, row };
}

async function openfda(field, value) {
  const url =
    "https://api.fda.gov/drug/drugsfda.json?limit=1&search=" +
    encodeURIComponent(`openfda.${field}:"${value}"`);
  const { status, json } = await getJson(url, `openFDA ${field} ${value}`);
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
  console.log("TICK64 fetch start", new Date().toISOString());

  const aliasTerms = [
    '"5-Amino-1MQ"',
    '"5-amino-1-MQ"',
    '"5-Amino-1-methylquinolinium"',
    '"5-Amino-1MQ" AND "liraglutide"',
    '"5-amino-1-methylquinolinium" AND "liraglutide"',
    "35013352[uid]",
    "26132939[uid]",
    "27295427[uid]",
    "NCT01272219",
    "NCT01179048",
    "Pi-Sunyer[Author] AND liraglutide[Title] AND 2015[pdat] AND \"N Engl J Med\"[Journal]",
    "Marso[Author] AND liraglutide[Title] AND 2016[pdat] AND \"N Engl J Med\"[Journal]",
    "SCALE[Title] AND liraglutide[Title] AND obesity[Title]",
    "LEADER[Title] AND liraglutide[Title] AND cardiovascular[Title]",
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
      ...(searchHits["35013352[uid]"]?.ids || []),
    ]),
  ];
  const liraIds = [
    ...new Set([
      ...(searchHits["26132939[uid]"]?.ids || []),
      ...(searchHits["27295427[uid]"]?.ids || []),
      ...(searchHits["NCT01272219"]?.ids || []),
      ...(searchHits["NCT01179048"]?.ids || []),
      ...(searchHits['Pi-Sunyer[Author] AND liraglutide[Title] AND 2015[pdat] AND "N Engl J Med"[Journal]']?.ids || []),
      ...(searchHits['Marso[Author] AND liraglutide[Title] AND 2016[pdat] AND "N Engl J Med"[Journal]']?.ids || []),
      ...(searchHits["SCALE[Title] AND liraglutide[Title] AND obesity[Title]"]?.ids || []),
      ...(searchHits["LEADER[Title] AND liraglutide[Title] AND cardiovascular[Title]"]?.ids || []),
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

  console.log("\n=== liraglutide candidate esummary ===");
  const liraSum = await esummary(liraIds);
  await sleep(400);
  console.log("\n=== TITLE_MATCH liraglutide ===");
  const liraNeedles = ["liraglutide", "scale", "leader"];
  const liraMatch = (liraSum.rows || []).filter((r) => titleMatch(r.title, liraNeedles));
  console.log(liraMatch.map((r) => r.pmid + " | TITLE_MATCH | " + r.title).join("\n") || "(none)");
  console.log("\n=== lira titles not matched ===");
  for (const r of liraSum.rows || []) {
    if (!titleMatch(r.title, liraNeedles)) console.log(r.pmid + " | MISS | " + r.title);
  }

  const h2hIds = [
    ...new Set([
      ...(searchHits['"5-Amino-1MQ" AND "liraglutide"']?.ids || []),
      ...(searchHits['"5-amino-1-methylquinolinium" AND "liraglutide"']?.ids || []),
    ]),
  ];
  console.log("\n=== H2H ids ===", h2hIds.join(",") || "(none)");

  const toFetch = [
    ...new Set([
      "35013352",
      "39067875",
      "33645410",
      "26132939",
      "27295427",
      ...aminoIds,
      ...liraIds,
      ...h2hIds,
    ]),
  ].slice(0, 12);
  for (const id of toFetch) {
    await efetch(id);
    await sleep(400);
  }

  for (const term of [
    "5-Amino-1MQ",
    "5-amino-1-methylquinolinium",
    "NNMT 5-amino",
    "NCT01272219",
    "NCT01179048",
  ]) {
    await ctgov(term);
    await sleep(250);
  }

  for (const nct of ["NCT01272219", "NCT01179048"]) {
    await ctgovNct(nct);
    await sleep(200);
  }

  for (const g of ["5-amino-1mq", "5-amino-1-methylquinolinium", "liraglutide"]) {
    await openfda("generic_name", g);
    await sleep(200);
  }
  for (const b of ["Saxenda", "Victoza"]) {
    await openfda("brand_name", b);
    await sleep(200);
  }

  console.log("\nTICK64 fetch end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
