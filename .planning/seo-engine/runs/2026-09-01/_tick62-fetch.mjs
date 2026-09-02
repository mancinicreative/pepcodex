/**
 * TICK62 per-alias fetch. Not OR-joined. Title-match before quote.
 * 5-Amino-1MQ + CT-388 / enicepatide.
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
  console.log(text.slice(0, 4500));
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
  const names = proto.identificationModule?.orgStudyIdInfo;
  const row = {
    nct: id.nctId,
    brief: id.briefTitle,
    official: id.officialTitle,
    acronym: id.acronym,
    otherNames: id.organization,
    status: statusM.overallStatus,
    phase: (design.phases || []).join("/"),
    enroll: statusM.enrollmentInfo,
    primaryCompletion: statusM.primaryCompletionDateStruct,
    start: statusM.startDateStruct,
    hasResults: s.hasResults ?? json.hasResults,
    primary: (outcomes.primaryOutcomes || []).map((o) => o.measure),
    secondary: (outcomes.secondaryOutcomes || []).slice(0, 6).map((o) => o.measure),
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
  console.log("TICK62 fetch start", new Date().toISOString());

  const aliasTerms = [
    '"5-Amino-1MQ"',
    '"5-amino-1-MQ"',
    '"5-Amino-1-methylquinolinium"',
    '"CT-388"',
    '"CT388"',
    '"CT 388"',
    '"enicepatide"',
    '"RO7795068"',
    '"5-Amino-1MQ" AND "CT-388"',
    '"5-amino-1-methylquinolinium" AND "CT-388"',
    '"5-Amino-1MQ" AND "enicepatide"',
    "41319798[uid]",
    "35013352[uid]",
    "NCT04838405",
    "NCT06525935",
    "NCT06628362",
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
  const ctIds = [
    ...new Set([
      ...(searchHits['"CT-388"']?.ids || []),
      ...(searchHits['"CT388"']?.ids || []),
      ...(searchHits['"CT 388"']?.ids || []),
      ...(searchHits['"enicepatide"']?.ids || []),
      ...(searchHits['"RO7795068"']?.ids || []),
      ...(searchHits["41319798[uid]"]?.ids || []),
      ...(searchHits["NCT04838405"]?.ids || []),
      ...(searchHits["NCT06525935"]?.ids || []),
      ...(searchHits["NCT06628362"]?.ids || []),
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

  console.log("\n=== CT-388 candidate esummary ===");
  const ctSum = await esummary(ctIds);
  await sleep(400);
  console.log("\n=== TITLE_MATCH CT-388 / enicepatide ===");
  const ctNeedles = ["ct-388", "ct388", "ct 388", "enicepatide", "ro7795068"];
  for (const r of ctSum.rows || []) {
    const m = titleMatch(r.title, ctNeedles);
    console.log(r.pmid + (m ? " | TITLE_MATCH | " : " | MISS | ") + r.title);
  }

  const h2hIds = [
    ...new Set([
      ...(searchHits['"5-Amino-1MQ" AND "CT-388"']?.ids || []),
      ...(searchHits['"5-amino-1-methylquinolinium" AND "CT-388"']?.ids || []),
      ...(searchHits['"5-Amino-1MQ" AND "enicepatide"']?.ids || []),
    ]),
  ];
  console.log("\n=== H2H ids ===", h2hIds.join(",") || "(none)");

  const toFetch = [...new Set([...aminoIds, ...ctIds, ...h2hIds])].slice(0, 10);
  for (const id of toFetch) {
    await efetch(id);
    await sleep(400);
  }

  for (const term of [
    "5-Amino-1MQ",
    "5-amino-1-methylquinolinium",
    "NNMT 5-amino",
    "CT-388",
    "enicepatide",
    "RO7795068",
  ]) {
    await ctgov(term);
    await sleep(250);
  }

  for (const nct of ["NCT04838405", "NCT06525935", "NCT06628362"]) {
    await ctgovNct(nct);
    await sleep(200);
  }

  for (const g of [
    "5-amino-1mq",
    "5-amino-1-methylquinolinium",
    "ct-388",
    "ct388",
    "enicepatide",
    "ro7795068",
  ]) {
    await openfda(g);
    await sleep(200);
  }

  console.log("\nTICK62 fetch end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
