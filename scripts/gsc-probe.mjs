// Mints an impersonated service-account token and reports what it can actually reach.
// Auth chain: user ADC (cloud-platform) -> IAM generateAccessToken -> SA token with
// webmasters/analytics scopes. No SA key needed (org policy blocks those).
import path from 'path';
import { GoogleAuth } from 'google-auth-library';

const SA_EMAIL =
  process.env.PEPCODEX_SA ||
  'pepcodex-reader@wired-dahlia-496320-e6.iam.gserviceaccount.com';
const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly',
];

export async function mintToken() {
  const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  const client = await auth.getClient();
  const res = await client.request({
    url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${SA_EMAIL}:generateAccessToken`,
    method: 'POST',
    data: { scope: SCOPES, lifetime: '3600s' },
  });
  return res.data.accessToken;
}

async function main() {
  const token = await mintToken();
  console.log(`token minted (${token.length} chars)\n`);

  const info = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`).then((r) => r.json());
  console.log('scopes on token:');
  (info.scope || '').split(' ').filter(Boolean).forEach((s) => console.log('  ' + s));

  console.log('\n=== SEARCH CONSOLE PROPERTIES VISIBLE ===');
  const sites = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

  if (sites.error) {
    console.log('  ERROR', sites.error.code, sites.error.message);
  } else if (!sites.siteEntry?.length) {
    console.log('  (none — service account not yet added as a user on any property)');
  } else {
    sites.siteEntry.forEach((e) => console.log(`  ${e.permissionLevel.padEnd(16)} ${e.siteUrl}`));
  }

  console.log('\n=== GA4 PROPERTIES VISIBLE ===');
  const admin = await fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries', {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

  if (admin.error) {
    console.log(`  ${admin.error.code} ${admin.error.status}`);
    if (/SERVICE_DISABLED|has not been used/.test(admin.error.message)) {
      console.log('  (Analytics Admin API not enabled — enable analyticsadmin.googleapis.com to auto-discover)');
    } else {
      console.log('  ' + admin.error.message.slice(0, 160));
    }
  } else if (!admin.accountSummaries?.length) {
    console.log('  (none — service account not yet added in GA4 Property access management)');
  } else {
    for (const a of admin.accountSummaries) {
      console.log(`  account: ${a.displayName}`);
      (a.propertySummaries || []).forEach((p) =>
        console.log(`     ${p.property.padEnd(28)} ${p.displayName}`)
      );
    }
  }
}

// Only run the probe when invoked directly — other scripts import mintToken().
const invokedDirectly = process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]));
if (invokedDirectly) {
  main().catch((e) => {
    console.error('FAILED:', String(e.message ?? e).split('\n')[0]);
    process.exit(1);
  });
}
