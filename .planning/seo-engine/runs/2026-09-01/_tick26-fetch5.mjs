const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const r = await fetch(
  "https://clinicaltrials.gov/api/v2/studies/NCT06858878?fields=NCTId,BriefTitle,OfficialTitle,Acronym,OverallStatus,Phase,EnrollmentInfo,HasResults,PrimaryCompletionDateStruct,CompletionDateStruct",
  { headers: UA }
);
console.log("===== CT.GOV NCT06858878 STATUS", r.status, "=====");
console.log(await r.text());
const p = await fetch(
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=5&term=" +
    encodeURIComponent("NCT06858878")
);
console.log("===== PUBMED NCT06858878 STATUS", p.status, "=====");
console.log(await p.text());
