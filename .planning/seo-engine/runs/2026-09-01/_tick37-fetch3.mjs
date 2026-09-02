const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };

const r = await fetch("https://clinicaltrials.gov/api/v2/studies/NCT06131437", {
  headers: UA,
});
console.log("STATUS", r.status);
const j = await r.json();
const proto = j.protocolSection || {};
console.log("acronym", proto.identificationModule?.acronym);
console.log("designInfo", JSON.stringify(proto.designModule?.designInfo, null, 2));
console.log("hasResults", j.hasResults);
console.log("overallStatus", proto.statusModule?.overallStatus);
const desc = proto.descriptionModule || {};
console.log("briefSummary", (desc.briefSummary || "").slice(0, 800));
console.log("officialTitle", proto.identificationModule?.officialTitle);
