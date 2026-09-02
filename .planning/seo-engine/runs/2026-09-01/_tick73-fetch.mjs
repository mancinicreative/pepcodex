/**
 * TICK73 fetch: 5-amino-1mq vs pemvidutide.
 * Per-alias. Not OR-joined. Title-match before quote.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, 450));

async function retry(fn, n = 5) {
  let last;
  for (let i = 1; i <= n; i++) {
    try {
      last = await fn();
      if (last.status === 200 || last.status === 404) return last;
      console.log("retry", i, "status", last.status);
    } catch (e) {
      console.log("retry", i, "error", e.cause?.code || e.message);
      last = { status: 0, json: null, text: "" };
    }
    await sleep(800 * i);
  }
  return last;
}

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick73/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _parseError: true, _rawHead: text.slice(0, 200) };
  }
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, json, text };
}

async function getText(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick73/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, text };
}

async function esearch(term, retmax = 20) {
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

function titleMatch(title, needles) {
  const t = (title || "").toLowerCase();
  return needles.some((n) => t.includes(n.toLowerCase()));
}

async function esummary(ids) {
  if (!ids.length) return { rows: [] };
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

async function efetchXml(id) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=xml&id=" +
    id;
  const { status, text } = await retry(() => getText(url, `efetch xml ${id}`));
  const title = (text.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || "";
  const abstracts = [...text.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)].map((m) => {
    const label = (m[1].match(/Label="([^"]+)"/) || [])[1] || "";
    const body = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return (label ? label + ": " : "") + body;
  });
  const doi = (text.match(/<ArticleId IdType="doi">([^<]+)<\/ArticleId>/) || [])[1] || "";
  const nct = [...new Set([...text.matchAll(/NCT\d{8}/g)].map((m) => m[0]))];
  console.log("TITLE:", title.replace(/\s+/g, " ").trim());
  console.log("DOI:", doi);
  console.log("NCT:", nct.join(","));
  console.log("ABSTRACT:\n" + abstracts.join("\n\n"));
  return { status, title };
}

async function ctgov(term) {
  const url = "https://clinicaltrials.gov/api/v2/studies?pageSize=8&query.term=" + encodeURIComponent(term);
  const { status, json } = await retry(() => getJson(url, `CT.gov search ${term}`));
  const studies = json?.studies || [];
  const rows = studies.map((s) => {
    const proto = s.protocolSection || {};
    return {
      nct: proto.identificationModule?.nctId,
      title: proto.identificationModule?.briefTitle,
      acronym: proto.identificationModule?.acronym,
      status: proto.statusModule?.overallStatus,
      phase: (proto.designModule?.phases || []).join("/"),
      enroll: proto.statusModule?.enrollmentInfo,
      hasResults: s.hasResults,
    };
  });
  console.log(`n=${studies.length}`);
  console.log(JSON.stringify(rows, null, 2));
}

async function ctgovNct(nct) {
  const url = "https://clinicaltrials.gov/api/v2/studies/" + nct;
  const { status, json } = await retry(() => getJson(url, `CT.gov ${nct}`));
  const s = json?.protocolSection ? json : (json?.studies && json.studies[0]) || json;
  const proto = s.protocolSection || {};
  console.log(
    JSON.stringify(
      {
        nct: proto.identificationModule?.nctId,
        brief: proto.identificationModule?.briefTitle,
        acronym: proto.identificationModule?.acronym,
        status: proto.statusModule?.overallStatus,
        phase: (proto.designModule?.phases || []).join("/"),
        enroll: proto.statusModule?.enrollmentInfo,
        primaryCompletion: proto.statusModule?.primaryCompletionDateStruct,
        hasResults: s.hasResults ?? json.hasResults,
        sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
      },
      null,
      2
    )
  );
}

async function openfda(field, value) {
  const url =
    "https://api.fda.gov/drug/drugsfda.json?limit=1&search=" +
    encodeURIComponent(`openfda.${field}:"${value}"`);
  const { status, json } = await retry(() => getJson(url, `openFDA ${field} ${value}`));
  if (json?.error) {
    console.log(`error=${json.error.code} ${json.error.message || ""}`);
    return;
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
}

async function main() {
  console.log("TICK73 fetch start", new Date().toISOString());

  const aminoTerms = ['"5-Amino-1MQ"', '"5-amino-1-MQ"', '"5-Amino-1-methylquinolinium"'];
  const pemTerms = ['"pemvidutide"', '"ALT-801"', "41237796[uid]", "35013352[uid]", "NCT05989711"];
  const h2hTerms = ['"5-Amino-1MQ" AND "pemvidutide"', '"5-amino-1-methylquinolinium" AND "pemvidutide"'];
  const momentumTerms = ['"pemvidutide" AND MOMENTUM', "NCT05295875"];

  const hits = {};
  for (const term of [...aminoTerms, ...pemTerms, ...h2hTerms, ...momentumTerms]) {
    hits[term] = await esearch(term);
    await sleep(400);
  }

  const aminoIds = [...new Set(aminoTerms.flatMap((t) => hits[t]?.ids || []))];
  const pemIds = [
    ...new Set([
      "41237796",
      ...(hits['"pemvidutide"']?.ids || []),
      ...(hits["41237796[uid]"]?.ids || []),
      ...(hits["NCT05989711"]?.ids || []),
    ]),
  ].slice(0, 20);

  console.log("\n=== amino esummary ===");
  const aminoSum = await esummary(["35013352", ...aminoIds.filter((id) => id !== "35013352")].slice(0, 8));
  await sleep(400);
  console.log("\n=== TITLE_MATCH amino ===");
  for (const r of aminoSum.rows || []) {
    console.log(
      r.pmid +
        (titleMatch(r.title, ["5-amino", "methylquinolinium", "nnmt"]) ? " | TITLE_MATCH | " : " | MISS | ") +
        r.title
    );
  }

  console.log("\n=== pem esummary ===");
  const pemSum = await esummary(pemIds);
  await sleep(400);
  console.log("\n=== TITLE_MATCH pem ===");
  for (const r of pemSum.rows || []) {
    console.log(
      r.pmid +
        (titleMatch(r.title, ["pemvidutide", "alt-801", "impact"]) ? " | TITLE_MATCH | " : " | MISS | ") +
        r.title
    );
  }

  console.log("\n=== H2H ids ===", [...new Set(h2hTerms.flatMap((t) => hits[t]?.ids || []))].join(",") || "(none)");

  for (const id of ["35013352", "41237796"]) {
    await efetchXml(id);
    await sleep(400);
  }

  for (const term of ["5-Amino-1MQ", "5-amino-1-methylquinolinium", "NNMT 5-amino", "pemvidutide", "ALT-801", "MOMENTUM pemvidutide"]) {
    await ctgov(term);
    await sleep(250);
  }
  for (const nct of ["NCT05989711", "NCT05295875"]) {
    await ctgovNct(nct);
    await sleep(200);
  }
  for (const g of ["5-amino-1mq", "5-amino-1-methylquinolinium", "pemvidutide", "alt-801"]) {
    await openfda("generic_name", g);
    await sleep(250);
  }
  console.log("\nTICK73 fetch end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
