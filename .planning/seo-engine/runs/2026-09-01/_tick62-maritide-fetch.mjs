/**
 * TICK62 per-alias fetch. Not OR-joined. Title-match before quote.
 * 5-Amino-1MQ + MariTide / maridebart cafraglutide / AMG 133.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, 400));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick62/1.0 (integrity; cited-only compare)" },
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
    headers: { "User-Agent": "pepcodex-tick62/1.0 (integrity; cited-only compare)" },
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
    "https://clinicaltrials.gov/api/v2/studies?pageSize=12&query.term=" +
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
    primaryCompletion: statusM.primaryCompletionDateStruct,
    hasResults: s.hasResults ?? json.hasResults,
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
  console.log("TICK62 maritide fetch start", new Date().toISOString());

  const aliasTerms = [
    '"5-Amino-1MQ"',
    '"5-amino-1-MQ"',
    '"5-Amino-1-methylquinolinium"',
    '"MariTide"',
    '"maritide"',
    '"AMG 133"',
    '"AMG-133"',
    '"AMG133"',
    '"maridebart cafraglutide"',
    '"maridebart"',
    '"5-Amino-1MQ" AND "MariTide"',
    '"5-amino-1-methylquinolinium" AND "MariTide"',
    '"5-Amino-1MQ" AND "maridebart"',
    "40549887[uid]",
    "35013352[uid]",
    "NCT05669599",
    "NCT04478708",
    "NCT06858878",
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
  const mariIds = [
    ...new Set([
      ...(searchHits['"MariTide"']?.ids || []),
      ...(searchHits['"maritide"']?.ids || []),
      ...(searchHits['"AMG 133"']?.ids || []),
      ...(searchHits['"AMG-133"']?.ids || []),
      ...(searchHits['"AMG133"']?.ids || []),
      ...(searchHits['"maridebart cafraglutide"']?.ids || []),
      ...(searchHits['"maridebart"']?.ids || []),
      ...(searchHits["40549887[uid]"]?.ids || []),
      ...(searchHits["NCT05669599"]?.ids || []),
      ...(searchHits["NCT04478708"]?.ids || []),
      ...(searchHits["NCT06858878"]?.ids || []),
    ]),
  ];

  console.log("\n=== amino candidate esummary ===");
  const aminoSum = await esummary(aminoIds);
  await sleep(400);
  console.log("\n=== TITLE_MATCH amino ===");
  const aminoNeedles = ["5-amino", "1-methylquinolinium", "1mq", "nnmt"];
  for (const r of aminoSum.rows || []) {
    const m = titleMatch(r.title, aminoNeedles);
    console.log(r.pmid + (m ? " | TITLE_MATCH | " : " | MISS | ") + r.title);
  }

  console.log("\n=== MariTide candidate esummary ===");
  const mariSum = await esummary(mariIds.slice(0, 20));
  await sleep(400);
  console.log("\n=== TITLE_MATCH MariTide / AMG 133 / maridebart ===");
  const mariNeedles = ["maritide", "amg 133", "amg-133", "amg133", "maridebart"];
  for (const r of mariSum.rows || []) {
    const m = titleMatch(r.title, mariNeedles);
    console.log(r.pmid + (m ? " | TITLE_MATCH | " : " | MISS | ") + r.title);
  }

  const h2hIds = [
    ...new Set([
      ...(searchHits['"5-Amino-1MQ" AND "MariTide"']?.ids || []),
      ...(searchHits['"5-amino-1-methylquinolinium" AND "MariTide"']?.ids || []),
      ...(searchHits['"5-Amino-1MQ" AND "maridebart"']?.ids || []),
    ]),
  ];
  console.log("\n=== H2H ids ===", h2hIds.join(",") || "(none)");

  const priority = ["35013352", "39067875", "33645410", "40549887", "41941715", "38316982", "38388678"];
  const toFetch = [...new Set([...priority, ...aminoIds, ...h2hIds, ...mariIds])].slice(0, 10);
  for (const id of toFetch) {
    await efetch(id);
    await sleep(400);
  }

  for (const term of [
    "5-Amino-1MQ",
    "5-amino-1-methylquinolinium",
    "NNMT 5-amino",
    "MariTide",
    "maridebart cafraglutide",
    "AMG 133",
  ]) {
    await ctgov(term);
    await sleep(250);
  }

  for (const nct of ["NCT05669599", "NCT04478708", "NCT06858878"]) {
    await ctgovNct(nct);
    await sleep(200);
  }

  for (const g of [
    "5-amino-1mq",
    "5-amino-1-methylquinolinium",
    "maritide",
    "maridebart",
    "maridebart cafraglutide",
    "amg 133",
    "amg133",
  ]) {
    await openfda(g);
    await sleep(200);
  }

  console.log("\nTICK62 maritide fetch end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
