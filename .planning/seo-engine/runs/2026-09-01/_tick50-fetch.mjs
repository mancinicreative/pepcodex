/**
 * TICK50 per-alias fetch. Not OR-joined. Title-match before quote.
 * Amycretin + MariTide / AMG 133 / maridebart cafraglutide.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick50/1.0 (integrity; cited-only compare)" },
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
    headers: { "User-Agent": "pepcodex-tick50/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, text };
}

function titleMatch(title, needles) {
  const t = (title || "").toLowerCase();
  return needles.some((n) => t.includes(n.toLowerCase()));
}

async function esearch(term) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=20&term=" +
    encodeURIComponent(term);
  const { status, json } = await getJson(url, `esearch ${term}`);
  const ids = json?.esearchresult?.idlist || [];
  const count = json?.esearchresult?.count;
  console.log(`count=${count} ids=${ids.join(",")}`);
  return { status, count, ids };
}

async function esummary(ids) {
  if (!ids.length) return [];
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
  console.log(text.slice(0, 2200));
  return { status, text };
}

async function ctgov(term) {
  const url =
    "https://clinicaltrials.gov/api/v2/studies?pageSize=8&query.term=" +
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
  const apps = (hit?.products || []).slice(0, 2);
  console.log(
    JSON.stringify(
      {
        found: !!hit,
        brand: hit?.openfda?.brand_name,
        generic: hit?.openfda?.generic_name,
        appNo: hit?.application_number,
        products: apps.map((p) => p.brand_name),
      },
      null,
      2
    )
  );
  return { status, found: !!hit };
}

const amyNeedles = ["amycretin"];
const mariNeedles = [
  "maritide",
  "mariTide",
  "amg 133",
  "amg133",
  "amg-133",
  "maridebart",
  "cafraglutide",
];

async function main() {
  console.log("TICK50 fetch start", new Date().toISOString());

  const aliasTerms = [
    '"amycretin"',
    '"MariTide"',
    '"maritide"',
    '"AMG 133"',
    '"AMG133"',
    '"AMG-133"',
    '"maridebart cafraglutide"',
    '"maridebart"',
  ];
  const searchHits = {};
  for (const term of aliasTerms) {
    searchHits[term] = await esearch(term);
    await sleep(400);
  }

  const known = ["40550229", "40550231"];
  const mariIds = [
    ...new Set(
      [
        ...(searchHits['"MariTide"']?.ids || []),
        ...(searchHits['"maritide"']?.ids || []),
        ...(searchHits['"AMG 133"']?.ids || []),
        ...(searchHits['"AMG133"']?.ids || []),
        ...(searchHits['"AMG-133"']?.ids || []),
        ...(searchHits['"maridebart cafraglutide"']?.ids || []),
        ...(searchHits['"maridebart"']?.ids || []),
      ]
    ),
  ].slice(0, 12);

  console.log("\n=== known amycretin esummary ===");
  await esummary(known);
  await sleep(350);
  console.log("\n=== mari candidate esummary ===");
  const mariSum = await esummary(mariIds);
  await sleep(350);

  for (const id of known) {
    await efetch(id);
    await sleep(350);
  }

  const mariMatch = (mariSum.rows || []).filter((r) => titleMatch(r.title, mariNeedles));
  console.log(
    "\n=== TITLE_MATCH mari ===",
    mariMatch.map((r) => r.pmid + " | " + r.title)
  );
  const toFetch = mariMatch.slice(0, 6).map((r) => r.pmid);
  for (const id of toFetch) {
    await efetch(id);
    await sleep(350);
  }

  for (const term of ['amycretin', 'MariTide', 'maritide', 'AMG 133', 'AMG133', 'maridebart cafraglutide']) {
    await ctgov(term);
    await sleep(250);
  }

  for (const nct of ["NCT05369390", "NCT06064006"]) {
    await ctgovNct(nct);
    await sleep(200);
  }

  for (const g of ["amycretin", "maritide", "maridebart", "maridebart cafraglutide", "amg 133", "amg133"]) {
    await openfda(g);
    await sleep(200);
  }

  console.log("\nTICK50 fetch end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
