// Judge fetch: openFDA drugsfda for tirzepatide + pemvidutide.
const one = async (name) => {
  const url = `https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:"${name}"&limit=5`;
  const r = await fetch(url);
  if (r.status !== 200) return { name, status: r.status };
  const j = await r.json();
  return { name, status: r.status, apps: j.results.map(x => ({ app: x.application_number, brand: x.openfda?.brand_name })) };
};
console.log(JSON.stringify([await one('tirzepatide'), await one('pemvidutide')], null, 2));
