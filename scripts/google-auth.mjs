// Keyless Google credentials for PepCodex SEO pulls.
//
// WHY IMPERSONATION: org policy iam.disableServiceAccountKeyCreation blocks
// downloadable SA keys, and gcloud's shared ADC client (764086051850-...) is
// registered only for Cloud scopes, so
// `gcloud auth application-default login --scopes=webmasters.readonly,...`
// returns "This app is blocked". Impersonation is Google's own documented
// remedy: the user's plain ADC (which carries cloud-platform) calls
// iamcredentials.generateAccessToken to mint an SA token carrying ARBITRARY
// scopes. The request-body `scope` field has no Cloud-only allowlist.
//
// NEVER use `gcloud auth application-default login --impersonate-service-account`.
// Scopes are not persisted in the impersonated_service_account ADC file format
// and silently collapse to cloud-platform only (google-analytics-mcp#80).
// Building Impersonated in code with explicit targetScopes sidesteps that.
import { GoogleAuth, Impersonated } from 'google-auth-library';

export const GCP_PROJECT = process.env.GCP_PROJECT_ID || 'wired-dahlia-496320-e6';
export const TARGET_SA =
  process.env.GCP_IMPERSONATE_SA ||
  'pepcodex-reader@wired-dahlia-496320-e6.iam.gserviceaccount.com';

// webmasters.readonly is correct — no "searchconsole" scope exists.
export const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly',
];

let _client;

/** Impersonated SA credential. Auto-refreshes; token lifetime 3600s. */
export async function getImpersonatedClient() {
  if (_client) return _client;
  // No scopes here on purpose: an authorized_user ADC ignores them, and the
  // caller-side requirement (cloud-platform) is already met by gcloud defaults.
  const sourceClient = await new GoogleAuth().getClient();
  _client = new Impersonated({
    sourceClient,
    targetPrincipal: TARGET_SA,
    targetScopes: SCOPES,
    lifetime: 3600,
    delegates: [],
  });
  return _client;
}

/**
 * Mint a token, retrying through IAM propagation. Measured propagation on this
 * org was ~80s after binding roles/iam.serviceAccountTokenCreator, so a bare
 * first call can 403 on a freshly-granted binding.
 */
export async function getAccessTokenWithRetry({ tries = 8, delayMs = 20000 } = {}) {
  const client = await getImpersonatedClient();
  let last;
  for (let i = 1; i <= tries; i++) {
    try {
      const { token } = await client.getAccessToken();
      if (token) return token;
      throw new Error('empty token');
    } catch (err) {
      last = err;
      const msg = String(err?.message || err);
      const propagating = /PERMISSION_DENIED|does not have permission|caller does not have/i.test(msg);
      if (!propagating || i === tries) throw err;
      console.log(`  IAM propagating (attempt ${i}/${tries}) — retrying in ${delayMs / 1000}s`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw last;
}

/** Search Console v1 client. googleapis accepts any OAuth2Client subclass. */
export async function searchConsole() {
  const { google } = await import('googleapis');
  return google.searchconsole({ version: 'v1', auth: await getImpersonatedClient() });
}

/** GA4 Admin client — used to discover the numeric property id. */
export async function analyticsAdmin() {
  const { google } = await import('googleapis');
  return google.analyticsadmin({ version: 'v1beta', auth: await getImpersonatedClient() });
}

/**
 * GA4 Data API client.
 * MUST wrap in GoogleAuth: google-gax's GrpcClient calls this.auth.getClient()
 * and this.auth.getUniverseDomain(), which a bare AuthClient does not implement.
 * GoogleAuth({authClient}) caches our Impersonated instance and returns it from
 * getClient(), satisfying gax on the gRPC path (fallback is false under Node).
 */
export async function ga4() {
  const { BetaAnalyticsDataClient } = await import('@google-analytics/data');
  const authClient = await getImpersonatedClient();
  const auth = new GoogleAuth({ authClient, projectId: GCP_PROJECT });
  return new BetaAnalyticsDataClient({ auth, projectId: GCP_PROJECT });
}
