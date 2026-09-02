/**
 * TICK54 per-alias fetch. Not OR-joined. Title-match before quote.
 * Amycretin + pemvidutide / ALT-801 / IMPACT / MOMENTUM.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, 400));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick54/1.0 (integrity; cited-only compare)" },
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
    headers: { "User-Agent": "pepcodex-tick54/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, text };
}

function titleMatch(title, needles) {
  const t = (title || "").toLowerCase();
  return needles.some((n) => t.includes(n.toLowerCase()));
}

async function esearch(term, retmax = 20) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=" +
    retmax +
    "&term=" +
    encodeURIComponent(term);
  const { status, json } = await getJson(url, `esearch ${term}`);
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
  const { status, json } = await getJson(url, `esummary ${ids.join(",")}`);
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
  const { status, text } = await getText(url, `efetch ${id}`);
  console.log(text.slice(0, 2800));
  return { status, text };
}

async function ctgov(term) {
  const url =
    "https://clinicaltrials.gov/api/v2/studies?pageSize=12&query.term=" +
    encodeURIComponent(term);
  const { status, json } = await getJson(url, `CT.gov ${term}`);
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
    secondary: (outcomes.secondaryOutcomes || []).slice(0, 6).map((o) => o.measure),
    sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
  };
  console.log(JSON.stringify(row, null, 2));
  return { status, row };
}

async function openfda(generic) {
  const url =
    "https://api.fda.gov/drug/drugsfda.json?limit=1&search=" +
    encodeURIComponent(`openfda.generic_name:"${generic}"`);
  const { status, json } = await getJson(url, `openFDA ${generic}`);
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

const pemNeedles = [
  "pemvidutide",
  "alt-801",
  "alt801",
  "alt 801",
];

async function main() {
  console.log("TICK54 fetch start", new Date().toISOString());

  const aliasTerms = [
    '"amycretin"',
    '"pemvidutide"',
    '"ALT-801"',
    '"ALT801"',
    "pemvidutide AND IMPACT",
    "pemvidutide AND MOMENTUM",
    "pemvidutide AND MASLD",
    "pemvidutide AND MASH",
    '"amycretin" AND "pemvidutide"',
    "41237796",
  ];
  const searchHits = {};
  for (const term of aliasTerms) {
    searchHits[term] = await esearch(term);
    await sleep(350);
  }

  const known = ["40550229", "40550231", "41237796"];
  const pemIds = [
    ...new Set([
      ...known,
      ...(searchHits['"pemvidutide"']?.ids || []),
      ...(searchHits['"ALT-801"']?.ids || []),
      ...(searchHits['"ALT801"']?.ids || []),
      ...(searchHits["pemvidutide AND IMPACT"]?.ids || []),
      ...(searchHits["pemvidutide AND MOMENTUM"]?.ids || []),
      ...(searchHits["pemvidutide AND MASLD"]?.ids || []),
      ...(searchHits["pemvidutide AND MASH"]?.ids || []),
      ...(searchHits['"amycretin" AND "pemvidutide"']?.ids || []),
    ]),
  ].slice(0, 20);

  console.log("\n=== known + pem candidate esummary ===");
  const sum = await esummary(pemIds);
  await sleep(350);

  console.log("\n=== TITLE_MATCH pem ===");
  const pemMatch = (sum.rows || []).filter((r) => titleMatch(r.title, pemNeedles.concat(["amycretin", "impact"])));
  console.log(pemMatch.map((r) => r.pmid + " | " + r.title).join("\n"));

  for (const id of known) {
    await efetch(id);
    await sleep(350);
  }

  const extra = (sum.rows || [])
    .filter((r) => titleMatch(r.title, pemNeedles) && !known.includes(r.pmid))
    .slice(0, 8)
    .map((r) => r.pmid);
  for (const id of extra) {
    await efetch(id);
    await sleep(350);
  }

  const h2h = searchHits['"amycretin" AND "pemvidutide"'];
  if (h2h?.ids?.length) {
    console.log("\n=== H2H esummary ===");
    const h2hSum = await esummary(h2h.ids);
    await sleep(300);
    for (const r of h2hSum.rows || []) {
      console.log("H2H", r.pmid, r.title);
    }
  }

  for (const nctTerm of ["amycretin", "pemvidutide", "ALT-801", "IMPACT pemvidutide", "MOMENTUM pemvidutide"]) {
    await ctgov(nctTerm);
    await sleep(250);
  }

  for (const nct of ["NCT05369390", "NCT06064006"]) {
    await ctgovNct(nct);
    await sleep(200);
  }

  for (const g of ["amycretin", "pemvidutide", "alt-801", "alt801"]) {
    await openfda(g);
    await sleep(200);
  }

  console.log("\nTICK54 fetch end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
