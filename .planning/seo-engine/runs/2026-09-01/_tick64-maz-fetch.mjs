/**
 * TICK64 mazdutide fetch after TICK63 took liraglutide.
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
    headers: { "User-Agent": "pepcodex-tick64/1.0 (integrity; cited-only compare)" },
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
    headers: { "User-Agent": "pepcodex-tick64/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, text };
}

async function esearch(term, retmax = 6) {
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
    return { pmid: id, title: r.title, source: r.source, pubdate: r.pubdate, doi: (r.elocationid || "").replace(/^doi:\s*/i, "") };
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
  const url = "https://clinicaltrials.gov/api/v2/studies?pageSize=5&query.term=" + encodeURIComponent(term);
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
  console.log(JSON.stringify({ found: !!hit, brand: hit?.openfda?.brand_name, generic: hit?.openfda?.generic_name, appNo: hit?.application_number }, null, 2));
}

async function main() {
  console.log("TICK64 maz fetch start", new Date().toISOString());
  const terms = [
    '"5-Amino-1MQ" AND "mazdutide"',
    '"5-amino-1-methylquinolinium" AND "mazdutide"',
    '"mazdutide" AND GLORY-1[Title]',
    '"mazdutide" AND GLORY-2[Title]',
    "40421736[uid]",
    "42251595[uid]",
    "42628555[uid]",
    "NCT05607680",
    "NCT06164873",
    "NCT06124807",
  ];
  const hits = {};
  for (const term of terms) {
    hits[term] = await esearch(term);
    await sleep(400);
  }

  const mazIds = [
    ...new Set([
      "40421736",
      "42251595",
      "42628555",
      ...(hits["40421736[uid]"]?.ids || []),
      ...(hits["42251595[uid]"]?.ids || []),
      ...(hits["42628555[uid]"]?.ids || []),
      ...(hits['"mazdutide" AND GLORY-1[Title]']?.ids || []),
      ...(hits['"mazdutide" AND GLORY-2[Title]']?.ids || []),
      ...(hits["NCT05607680"]?.ids || []),
      ...(hits["NCT06164873"]?.ids || []),
      ...(hits["NCT06124807"]?.ids || []),
    ]),
  ].slice(0, 10);

  console.log("\n=== maz esummary ===");
  const sum = await esummary(mazIds);
  await sleep(400);
  const needles = ["mazdutide", "ibi362", "ly3305677", "glory"];
  console.log("\n=== TITLE_MATCH maz ===");
  for (const r of sum.rows || []) {
    console.log(r.pmid + (titleMatch(r.title, needles) ? " | TITLE_MATCH | " : " | MISS | ") + r.title);
  }

  const h2h = [
    ...new Set([
      ...(hits['"5-Amino-1MQ" AND "mazdutide"']?.ids || []),
      ...(hits['"5-amino-1-methylquinolinium" AND "mazdutide"']?.ids || []),
    ]),
  ];
  console.log("\n=== H2H ids ===", h2h.join(",") || "(none)");

  for (const id of ["40421736", "42251595", "42628555"]) {
    await efetchXml(id);
    await sleep(400);
  }

  for (const term of ["mazdutide", "IBI362", "NCT05607680", "NCT06164873", "NCT06124807"]) {
    await ctgov(term);
    await sleep(250);
  }
  for (const nct of ["NCT05607680", "NCT06164873", "NCT06124807"]) {
    await ctgovNct(nct);
    await sleep(200);
  }
  for (const g of ["mazdutide", "ibi362", "ly3305677"]) {
    await openfda("generic_name", g);
    await sleep(250);
  }
  console.log("\nTICK64 maz fetch end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
