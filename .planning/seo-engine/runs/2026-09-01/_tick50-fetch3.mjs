/**
 * TICK50 fetch3 — enrollment + Phase 1 NCT04478708 + PubMed NCT map.
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
    json = { _parseError: true, _rawHead: text.slice(0, 200) };
  }
  console.log(`\n=== ${label} STATUS ${res.status} ===`);
  return { json, status: res.status };
}

async function main() {
  for (const nct of ["NCT05669599", "NCT04478708", "NCT05369390", "NCT06064006", "NCT06858878"]) {
    const { json } = await getJson(
      "https://clinicaltrials.gov/api/v2/studies/" + nct,
      "CT.gov " + nct
    );
    const s = json?.protocolSection ? json : json?.studies?.[0] || json;
    const proto = s.protocolSection || {};
    const statusM = proto.statusModule || {};
    const design = proto.designModule || {};
    console.log(
      JSON.stringify(
        {
          nct: proto.identificationModule?.nctId,
          status: statusM.overallStatus,
          phase: design.phases,
          enroll: statusM.enrollmentInfo,
          hasResults: s.hasResults ?? json.hasResults,
          primary: (proto.outcomesModule?.primaryOutcomes || []).map((o) => o.measure),
          sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name,
        },
        null,
        2
      )
    );
    await sleep(200);
  }

  for (const term of ["NCT04478708", "NCT06858878"]) {
    const { json } = await getJson(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=" +
        encodeURIComponent(term),
      "esearch " + term
    );
    console.log(`count=${json?.esearchresult?.count} ids=${(json?.esearchresult?.idlist || []).join(",")}`);
    await sleep(350);
  }

  console.log("TICK50 fetch3 end");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
