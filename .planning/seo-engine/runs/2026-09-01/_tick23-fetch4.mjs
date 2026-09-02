const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const ncts = ["NCT04881760", "NCT06354660"];
for (const nct of ncts) {
  const ct = await get(`https://clinicaltrials.gov/api/v2/studies/${nct}`);
  console.log("===== CT.GOV", nct, "STATUS", ct.status, "=====");
  try {
    const j = JSON.parse(ct.text);
    const proto = j.protocolSection || {};
    const id = proto.identificationModule || {};
    const status = proto.statusModule || {};
    const design = proto.designModule || {};
    console.log(
      JSON.stringify(
        {
          nctId: id.nctId,
          briefTitle: id.briefTitle,
          overallStatus: status.overallStatus,
          hasResults: j.hasResults,
          phases: design.phases,
          enrollment: design.enrollmentInfo,
          start: status.startDateStruct,
          completion: status.completionDateStruct,
        },
        null,
        2
      )
    );
  } catch {
    console.log(ct.text.slice(0, 1500));
  }
  console.log("");
  await new Promise((r) => setTimeout(r, 300));
}
