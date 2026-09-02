const nct = 'NCT06858839';
const res = await fetch(`https://clinicaltrials.gov/api/v2/studies/${nct}`, {
  headers: { 'User-Agent': 'pepcodex-tick38/1.0' },
});
const j = await res.json();
const st = j.protocolSection?.statusModule || {};
console.log('STATUS', res.status);
console.log('statusModule keys', Object.keys(st));
console.log('enrollmentInfo', JSON.stringify(st.enrollmentInfo, null, 2));
console.log('statusJSON sample', JSON.stringify(st, null, 2).slice(0, 2500));
const ds = j.protocolSection?.designModule || {};
console.log('design keys', Object.keys(ds));
console.log('enrollmentInfo design', JSON.stringify(ds.enrollmentInfo, null, 2));
