const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const q = encodeURIComponent("SYNCHRONIZE-MASLD");
const url = `https://clinicaltrials.gov/api/v2/studies?query.term=${q}&pageSize=10`;
const r = await fetch(url, { headers: UA });
console.log("STATUS", r.status);
const j = await r.json();
for (const s of j.studies || []) {
  const id = s.protocolSection?.identificationModule || {};
  const st = s.protocolSection?.statusModule || {};
  const d = s.protocolSection?.designModule || {};
  console.log(
    [
      id.nctId,
      id.briefTitle,
      st.overallStatus,
      "enroll=" + (d.enrollmentInfo?.count ?? "?"),
      "hasResults=" + s.hasResults,
    ].join(" | ")
  );
}
