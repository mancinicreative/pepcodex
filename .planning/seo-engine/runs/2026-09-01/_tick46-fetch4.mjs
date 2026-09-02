const UA = { "User-Agent": "PepCodex-verify/1.0 (mailto:admin@pepcodex.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: UA });
  const text = await r.text();
  return { status: r.status, text };
}

const ncts = ["NCT04838405", "NCT06525935", "NCT06628362", "NCT05369390", "NCT06064006"];
for (const nct of ncts) {
  await sleep(300);
  const { status, text } = await get(`https://clinicaltrials.gov/api/v2/studies/${nct}`);
  console.log("===== SPONSOR", nct, "STATUS", status, "=====");
  try {
    const j = JSON.parse(text);
    const proto = j.protocolSection || {};
    const sponsor = proto.sponsorCollaboratorsModule || {};
    console.log(
      JSON.stringify(
        {
          lead: sponsor.leadSponsor,
          collaborators: sponsor.collaborators,
        },
        null,
        2
      )
    );
  } catch {
    console.log(text.slice(0, 800));
  }
}
