/**
 * TICK65 fetch2: full SURMOUNT-1 abstract, amino abstracts, Zepbound ORIG, NCT enroll.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, label) {
  const res = await fetch(url, {
    headers: { "User-Agent": "pepcodex-tick65/1.0 (integrity; cited-only compare)" },
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
    headers: { "User-Agent": "pepcodex-tick65/1.0 (integrity; cited-only compare)" },
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

async function main() {
  for (const id of ["35658024", "35013352", "39067875", "33645410"]) {
    const { text } = await retry(() =>
      getText(
        "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&retmode=text&id=" +
          id,
        `efetch ${id}`
      )
    );
    console.log(text);
    await sleep(400);
  }

  const nct = await retry(() =>
    getJson("https://clinicaltrials.gov/api/v2/studies/NCT04184622", "CT.gov NCT04184622")
  );
  const proto = (nct.json?.protocolSection ? nct.json : nct.json?.studies?.[0] || nct.json)
    .protocolSection;
  const statusM = proto?.statusModule || {};
  console.log(
    JSON.stringify(
      {
        enroll: statusM.enrollmentInfo,
        overall: statusM.overallStatus,
        hasResults: nct.json?.hasResults,
        start: statusM.startDateStruct,
        completion: statusM.completionDateStruct,
      },
      null,
      2
    )
  );

  for (const appl of ["NDA215866", "NDA217806"]) {
    const url =
      "https://api.fda.gov/drug/drugsfda.json?limit=1&search=" +
      encodeURIComponent(`application_number:"${appl}"`);
    const { json } = await retry(() => getJson(url, `openFDA appl ${appl}`));
    const r = json?.results?.[0] || {};
    const orig = (r.submissions || []).filter(
      (s) => s.submission_type === "ORIG" && /AP/i.test(s.submission_status || "")
    );
    console.log(
      JSON.stringify(
        {
          appl: r.application_number,
          brands: [...new Set((r.products || []).map((p) => p.brand_name))],
          orig,
          firstDates: (r.submissions || [])
            .map((s) => ({
              type: s.submission_type,
              status: s.submission_status,
              date: s.submission_status_date,
            }))
            .sort((a, b) => String(a.date).localeCompare(String(b.date)))
            .slice(0, 8),
        },
        null,
        2
      )
    );
    await sleep(200);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
