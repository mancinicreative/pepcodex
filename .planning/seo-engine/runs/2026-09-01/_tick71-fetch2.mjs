/**
 * TICK71 fetch2: XML abstracts for SCALE/LEADER/H2H reviews + openFDA retry.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getText(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick71/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, text };
}

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick71/1.0 (integrity; cited-only compare)" },
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _parseError: true, _rawHead: text.slice(0, 240) };
  }
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { status: res.status, json };
}

async function retry(fn, n = 5) {
  let last;
  for (let i = 1; i <= n; i++) {
    try {
      last = await fn();
      if (last.status === 200) return last;
      console.log("retry", i, "status", last.status);
    } catch (e) {
      console.log("retry", i, "error", e.cause?.code || e.message);
      last = { status: 0, error: String(e) };
    }
    await sleep(1200 * i);
  }
  return last;
}

function abstractFromXml(xml) {
  const titles = [...xml.matchAll(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, "")
  );
  const abs = [...xml.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)].map((m) => {
    const label = (m[1].match(/Label="([^"]+)"/) || [])[1] || "";
    const body = m[2].replace(/<[^>]+>/g, "");
    return (label ? label + ": " : "") + body;
  });
  const nct = [...xml.matchAll(/NCT\d+/g)].map((m) => m[0]);
  const doi = (xml.match(/<ELocationID[^>]*EIdType="doi"[^>]*>([\s\S]*?)<\/ELocationID>/i) || [])[1];
  return { titles, nct: [...new Set(nct)], doi, abs };
}

async function efetchXml(id) {
  const url =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=xml&id=" +
    id;
  const { status, text } = await retry(() => getText(url, `efetch-xml ${id}`));
  const parsed = abstractFromXml(text || "");
  console.log(JSON.stringify(parsed, null, 2));
  return { status, parsed };
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
      .map((s) => ({ date: s.submission_status_date, type: s.submission_type })),
  }));
  console.log(JSON.stringify({ found: apps.length > 0, apps }, null, 2));
  return { status, found: apps.length > 0, apps };
}

async function ctgovNct(nct) {
  const url = "https://clinicaltrials.gov/api/v2/studies/" + nct;
  const { status, json } = await retry(() => getJson(url, `CT.gov ${nct}`));
  const s = json?.protocolSection ? json : (json?.studies && json.studies[0]) || json;
  const proto = s.protocolSection || {};
  const statusM = proto.statusModule || {};
  const row = {
    nct: proto.identificationModule?.nctId,
    status: statusM.overallStatus,
    enroll: statusM.enrollmentInfo || null,
    hasResults: s.hasResults ?? json.hasResults,
    sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
    phase: (proto.designModule?.phases || []).join("/"),
  };
  console.log(JSON.stringify(row, null, 2));
  return { status, row };
}

async function main() {
  console.log("TICK71 fetch2 start", new Date().toISOString());

  for (const id of ["26132939", "27295427", "14571286", "26510028"]) {
    await efetchXml(id);
    await sleep(400);
  }

  for (const nct of ["NCT01272219", "NCT01179048"]) {
    await ctgovNct(nct);
    await sleep(250);
  }

  for (const [field, value] of [
    ["openfda.generic_name", "aod-9604"],
    ["openfda.generic_name", "aod9604"],
    ["openfda.generic_name", "liraglutide"],
    ["openfda.brand_name", "victoza"],
    ["openfda.brand_name", "saxenda"],
    ["application_number", "NDA022341"],
    ["application_number", "NDA206321"],
  ]) {
    await openfda(field, value);
    await sleep(400);
  }

  console.log("\nTICK71 fetch2 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
