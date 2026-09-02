const ncts = ["NCT04478708", "NCT06858878"];
for (const nct of ncts) {
  const res = await fetch("https://clinicaltrials.gov/api/v2/studies/" + nct, {
    headers: { "User-Agent": "pepcodex-tick50/1.0 (integrity; cited-only compare)" },
  });
  const json = await res.json();
  const s = json.protocolSection ? json : json.studies?.[0] || json;
  const id = s.protocolSection?.identificationModule || {};
  console.log("STATUS", res.status, nct);
  console.log(JSON.stringify({
    nct: id.nctId,
    brief: id.briefTitle,
    official: id.officialTitle,
    acronym: id.acronym,
  }, null, 2));
}
