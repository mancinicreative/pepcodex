// Proves the impersonated credential BEFORE any real data pull.
// Run: node scripts/verify-google-auth.mjs
//
// Checks, in order:
//   1. token mints at all (impersonation chain works)
//   2. token carries webmasters.readonly + analytics.readonly, and is the SA
//   3. Search Console sites.list  -> real property list
//   4. Search Console searchanalytics.query -> real rows
//   5. GA4 accountSummaries.list -> numeric property id
//   6. GA4 runReport -> real rows
// Exits 1 on the first hard failure. Prints exact remediation per failure.
import { pathToFileURL } from 'node:url';
import {
  TARGET_SA,
  SCOPES,
  getAccessTokenWithRetry,
  searchConsole,
  analyticsAdmin,
  ga4,
} from './google-auth.mjs';

const ok = (m) => console.log(`  PASS  ${m}`);
const bad = (m, hint) => {
  console.error(`  FAIL  ${m}`);
  if (hint) console.error(`        -> ${hint}`);
};

async function main() {
  let failed = false;

  // ---- 1 + 2: mint and introspect the token --------------------------------
  console.log(`\nImpersonating ${TARGET_SA}`);
  let token;
  try {
    token = await getAccessTokenWithRetry();
    ok(`token minted (${token.slice(0, 12)}...)`);
  } catch (err) {
    bad(`could not mint token: ${err.message}`,
      'Check: gcloud auth application-default login has run, and ' +
      'roles/iam.serviceAccountTokenCreator is bound to user:info@pepcodex.com ON the SA.');
    process.exit(1);
  }

  const info = await (
    await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`)
  ).json();
  console.log(`  scopes  : ${info.scope}`);
  console.log(`  identity: ${info.email || info.azp || '(service account)'}`);
  for (const s of SCOPES) {
    if ((info.scope || '').includes(s)) ok(`scope present: ${s}`);
    else { bad(`scope MISSING: ${s}`, 'targetScopes did not reach generateAccessToken.'); failed = true; }
  }
  if (failed) process.exit(1);

  // ---- 3 + 4: Search Console ----------------------------------------------
  let sites = [];
  try {
    const sc = await searchConsole();
    const { data } = await sc.sites.list({});
    sites = (data.siteEntry || []).map((s) => s.siteUrl);
    if (sites.length) ok(`GSC properties visible: ${sites.join(' | ')}`);
    else { bad('GSC returned zero properties', `Add ${TARGET_SA} as a user on each property in Search Console.`); failed = true; }

    if (sites.length) {
      const end = new Date(Date.now() - 3 * 864e5).toISOString().slice(0, 10);
      const start = new Date(Date.now() - 33 * 864e5).toISOString().slice(0, 10);
      const { data: q } = await sc.searchanalytics.query({
        siteUrl: sites[0],
        requestBody: { startDate: start, endDate: end, dimensions: ['query'], rowLimit: 5 },
      });
      ok(`GSC searchanalytics.query on ${sites[0]}: ${(q.rows || []).length} rows`);
      for (const r of q.rows || []) console.log(`        "${r.keys[0]}" imp=${r.impressions} pos=${r.position.toFixed(1)}`);
    }
  } catch (err) {
    bad(`Search Console: ${err.message}`,
      'A 403 here means the SA is not a property user, OR siteUrl does not match byte-for-byte.');
    failed = true;
  }

  // ---- 5 + 6: GA4 ----------------------------------------------------------
  let propertyId = process.env.GA4_PROPERTY_ID;
  try {
    const admin = await analyticsAdmin();
    const { data } = await admin.accountSummaries.list({});
    const props = (data.accountSummaries || []).flatMap((a) => a.propertySummaries || []);
    if (props.length) {
      propertyId = propertyId || props[0].property.split('/')[1];
      ok(`GA4 properties visible: ${props.map((p) => `${p.displayName}=${p.property}`).join(' | ')}`);
    } else {
      bad('GA4 accountSummaries returned nothing',
        `Add ${TARGET_SA} as Viewer: analytics.google.com -> Admin -> Property access management -> +`);
      failed = true;
    }
  } catch (err) {
    bad(`GA4 Admin: ${err.message}`, 'Same fix: add the SA as Viewer on the GA4 property.');
    failed = true;
  }

  if (propertyId) {
    try {
      const analytics = await ga4();
      const [rep] = await analytics.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '28daysAgo', endDate: 'yesterday' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        limit: 5,
      });
      ok(`GA4 runReport on properties/${propertyId}: ${(rep.rows || []).length} rows`);
      for (const r of rep.rows || []) console.log(`        ${r.dimensionValues[0].value} = ${r.metricValues[0].value}`);
    } catch (err) {
      // code 7 = PERMISSION_DENIED (authenticated, not authorized) — grant missing.
      // code 16 = UNAUTHENTICATED — the credential itself is broken.
      bad(`GA4 runReport (gRPC code ${err.code}): ${err.message}`,
        err.code === 16
          ? 'UNAUTHENTICATED = credential wiring broken, not a permission gap.'
          : `Add ${TARGET_SA} as Viewer on GA4 property ${propertyId}.`);
      failed = true;
    }
  }

  console.log(failed ? '\nRESULT: FAILED\n' : '\nRESULT: ALL GREEN\n');
  process.exit(failed ? 1 : 0);
}

// pathToFileURL is mandatory on Windows: `file://${process.argv[1]}` never matches.
if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
