/**
 * TICK56 per-alias fetch. Not OR-joined. Title-match before quote.
 * Amycretin + SLU-PP-332 / ERR agonist 332.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, 400));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick56/1.0 (integrity; cited-only compare)" },
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
    headers: { "User-Agent": "pepcodex-tick56/1.0 (integrity; cited-only compare)" },
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
  console.log(text.slice(0, 3500));
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

const sluNeedles = ["slu-pp-332", "slu-pp332", "slupp332", "slu pp-332"];
const amyNeedles = ["amycretin"];

async function main() {
  console.log("TICK56 fetch start", new Date().toISOString());

  const aliasTerms = [
    '"amycretin"',
    '"SLU-PP-332"',
    '"SLU-PP332"',
    '"SLUPP332"',
    '"SLU PP-332"',
    "36988910",
    "40550229[uid]",
    "40550231[uid]",
    '"amycretin" AND "SLU-PP-332"',
  ];
  const searchHits = {};
  for (const term of aliasTerms) {
    searchHits[term] = await esearch(term);
    await sleep(350);
  }

  const known = ["40550229", "40550231", "36988910"];
  const sluIds = [
    ...new Set([
      ...known,
      ...(searchHits['"SLU-PP-332"']?.ids || []),
      ...(searchHits['"SLU-PP332"']?.ids || []),
      ...(searchHits['"SLUPP332"']?.ids || []),
      ...(searchHits['"SLU PP-332"']?.ids || []),
      ...(searchHits["36988910"]?.ids || []),
      ...(searchHits['"amycretin" AND "SLU-PP-332"']?.ids || []),
    ]),
  ].slice(0, 25);

  console.log("\n=== known + slu candidate esummary ===");
  const sum = await esummary(sluIds);
  await sleep(350);

  console.log("\n=== TITLE_MATCH slu or amycretin ===");
  const matched = (sum.rows || []).filter((r) =>
    titleMatch(r.title, sluNeedles.concat(amyNeedles))
  );
  console.log(matched.map((r) => r.pmid + " | " + r.title).join("\n"));

  for (const id of known) {
    await efetch(id);
    await sleep(350);
  }

  const extra = (sum.rows || [])
    .filter((r) => titleMatch(r.title, sluNeedles) && !known.includes(r.pmid))
    .slice(0, 10)
    .map((r) => r.pmid);
  console.log("\n=== extra slu title-match ids ===", extra.join(","));
  for (const id of extra) {
    await efetch(id);
    await sleep(350);
  }

  const h2h = searchHits['"amycretin" AND "SLU-PP-332"'];
  if (h2h?.ids?.length) {
    console.log("\n=== H2H esummary ===");
    const h2hSum = await esummary(h2h.ids);
    await sleep(300);
    for (const r of h2hSum.rows || []) {
      console.log("H2H", r.pmid, r.title);
    }
  } else {
    console.log("\n=== H2H count ===", h2h?.count, "ids", (h2h?.ids || []).join(","));
  }

  for (const nctTerm of ["amycretin", "SLU-PP-332", "SLU-PP332", "SLUPP332"]) {
    await ctgov(nctTerm);
    await sleep(250);
  }

  for (const nct of ["NCT05369390", "NCT06064006"]) {
    await ctgovNct(nct);
    await sleep(200);
  }

  for (const g of ["amycretin", "slu-pp-332", "slupp332"]) {
    await openfda(g);
    await sleep(200);
  }

  console.log("\nTICK56 fetch end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
