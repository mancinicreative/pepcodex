const ncts = [
  'NCT05669599',
  'NCT04478708',
  'NCT06858839',
  'NCT06858878',
  'NCT03548935',
  'NCT03574597',
];
for (const nct of ncts) {
  const res = await fetch(`https://clinicaltrials.gov/api/v2/studies/${nct}`, {
    headers: { 'User-Agent': 'pepcodex-tick38/1.0' },
  });
  const j = await res.json();
  const des = j.protocolSection?.designModule || {};
  const idm = j.protocolSection?.identificationModule || {};
  console.log(
    `STATUS ${res.status} ${nct} acronym=${idm.acronym} enroll=${JSON.stringify(des.enrollmentInfo)} hasResults=${j.hasResults}`,
  );
  await new Promise((r) => setTimeout(r, 250));
}
