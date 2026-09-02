/**
 * TICK72 per-alias fetch. Not OR-joined. Title-match before quote.
 * 5-Amino-1MQ + orforglipron (ATTAIN-1).
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick72/1.0 (integrity; cited-only compare)" },
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
    headers: { "User-Agent": "pepcodex-tick72/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, text };
}

async function retry(fn, n = 5) {
  let last;
  for (let i = 1; i <= n; i++) {
    try {
      last = await fn();
      if (last.status === 200 || last.status === 404) return last;
      console.log("retry", i, "status", last.status);
    } catch (e) {
      console.log("retry", i, "error", e.cause?.code || e.message);
      last = { status: 0, json: null, text: String(e) };
    }
    await sleep(1000 * i);
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

async function main() {
  console.log("TICK72 fetch start", new Date().toISOString());

  const aliasTerms = [
    '"5-Amino-1MQ"',
    '"5-amino-1-MQ"',
    '"5-Amino-1-methylquinolinium"',
    '"5-amino-1-methylquinolinium"',
    '"orforglipron"',
    '"LY3502970"',
    '"ATTAIN-1"',
    '"Foundayo"',
    '"5-Amino-1MQ" AND "orforglipron"',
    '"5-amino-1-methylquinolinium" AND "orforglipron"',
    '"5-Amino-1MQ" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III")',
    '"5-amino-1-methylquinolinium" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III")',
    "35013352[uid]",
    "39067875[uid]",
    "33645410[uid]",
    "40960239[uid]",
    "37351564[uid]",
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
      ...(searchHits['"5-Amino-1MQ" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III")']?.ids || []),
      ...(searchHits['"5-amino-1-methylquinolinium" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III")']?.ids || []),
      ...(searchHits["35013352[uid]"]?.ids || []),
      ...(searchHits["39067875[uid]"]?.ids || []),
      ...(searchHits["33645410[uid]"]?.ids || []),
    ]),
  ];
  const orfIds = [
    ...new Set([
      ...(searchHits['"orforglipron"']?.ids || []).slice(0, 8),
      ...(searchHits['"LY3502970"']?.ids || []).slice(0, 6),
      ...(searchHits['"ATTAIN-1"']?.ids || []),
      ...(searchHits["40960239[uid]"]?.ids || []),
      ...(searchHits["37351564[uid]"]?.ids || []),
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

  console.log("\n=== orforglipron candidate esummary ===");
  const orfSum = await esummary(orfIds);
  await sleep(400);
  console.log("\n=== TITLE_MATCH orforglipron ===");
  const orfNeedles = ["orforglipron", "ly3502970", "attain-1", "attain 1"];
  for (const r of orfSum.rows || []) {
    console.log(
      r.pmid + " | " + (titleMatch(r.title, orfNeedles) ? "TITLE_MATCH" : "MISS") + " | " + r.title
    );
  }

  const h2hIds = [
    ...new Set([
      ...(searchHits['"5-Amino-1MQ" AND "orforglipron"']?.ids || []),
      ...(searchHits['"5-amino-1-methylquinolinium" AND "orforglipron"']?.ids || []),
    ]),
  ];
  console.log("\n=== H2H ids ===", h2hIds.join(",") || "(none)");

  const toFetch = [
    ...new Set(["35013352", "39067875", "33645410", "40960239", "37351564", ...aminoIds, ...h2hIds]),
  ];
  for (const id of toFetch) {
    await efetch(id);
    await sleep(400);
  }

  for (const term of ["5-Amino-1MQ", "5-amino-1-methylquinolinium", "NNMT 5-amino"]) {
    await ctgov(term);
    await sleep(250);
  }

  console.log("\nTICK72 fetch end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
