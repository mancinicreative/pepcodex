// One read-only authentication path. Never log third-party error objects or tokens.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const DATA_SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly', 'https://www.googleapis.com/auth/analytics.readonly'];
export const IDENTITY_SCOPE = 'https://www.googleapis.com/auth/userinfo.email';
export function loadEnvironment(file = '.env', env = process.env) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || env[match[1]] !== undefined) continue;
    env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2').replace(/\s+#.*$/, '');
  }
}
export function classifyGoogleError(error) {
  if (error?.safeGoogleError) return error.safeGoogleError;
  const status = Number(error?.response?.status ?? error?.status ?? error?.code) || null;
  const data = error?.response?.data ?? {};
  const detail = JSON.stringify([data, error?.message, error?.code]); // inspect only, never emit
  let code = 'REQUEST_FAILED', action = 'Inspect network/runtime availability; no data was promoted.';
  if (/invalid_rapt|invalid_grant|reauth/i.test(detail)) [code, action] = ['REAUTH_REQUIRED', 'Owner must renew desktop ADC using .planning/GOOGLE-API-SETUP.md. Do not retry interactively in a loop.'];
  else if (/insufficient.*scope|ACCESS_TOKEN_SCOPE_INSUFFICIENT/i.test(detail)) [code, action] = ['MISSING_SCOPE', 'Renew ADC with the documented read-only scopes. Identity scope is optional for data reads.'];
  else if (/SERVICE_DISABLED|has not been used|accessNotConfigured/i.test(detail)) [code, action] = ['API_DISABLED', 'Owner should check API enablement in the existing OAuth project.'];
  else if (/quota.project|USER_PROJECT_DENIED|user project/i.test(detail)) [code, action] = ['QUOTA_PROJECT', 'Check the configured quota project and existing permission; do not broaden OAuth scopes automatically.'];
  else if (status === 401) [code, action] = ['TOKEN_REJECTED', 'Renew the configured credentials and verify the requested data scopes.'];
  else if (status === 403) [code, action] = ['PROPERTY_PERMISSION', 'Check this Google identity has access to the exact GSC/GA4 property.'];
  else if (status === 429) [code, action] = ['RATE_LIMITED', 'Bounded retries exhausted; preserve the prior baseline and retry a new run later.'];
  else if (/EPERM|EACCES|MODULE_NOT_FOUND|ENOENT/i.test(detail)) [code, action] = ['RUNTIME_OR_CREDENTIAL_FILE', 'Check runtime/file access and local ADC setup before diagnosing account permission.'];
  else if (/timeout|abort|ENOTFOUND|ECONN|fetch failed/i.test(detail)) [code, action] = ['NETWORK_TIMEOUT', 'Check network access; this is not evidence of missing account permission.'];
  else if (status >= 500) [code, action] = ['SERVICE_UNAVAILABLE', 'Bounded retries exhausted; retry a new run later.'];
  return { code, status, action };
}
export function safeError(code, action, status = null) {
  return Object.assign(new Error(action), { safeGoogleError: { code, status, action } });
}
export async function createGoogleAccess({ env = process.env, GoogleAuthClass, fetcher = fetch, sleep = ms => new Promise(r => setTimeout(r, ms)) } = {}) {
  const mode = env.PEPCODEX_GOOGLE_AUTH_MODE || 'desktop-adc';
  if (!['desktop-adc', 'iam-impersonation'].includes(mode)) throw safeError('AUTH_CONFIGURATION', 'Choose desktop-adc or explicitly configured iam-impersonation.');
  if (env.GOOGLE_APPLICATION_CREDENTIALS) throw safeError('AUTH_CONFIGURATION', 'Unset GOOGLE_APPLICATION_CREDENTIALS. These scripts use local user ADC, never service-account keys.');
  if (mode === 'iam-impersonation' && !env.PEPCODEX_SA) throw safeError('AUTH_CONFIGURATION', 'Explicit iam-impersonation requires PEPCODEX_SA; no implicit service account is selected.');
  const adcPath = env.PEPCODEX_GOOGLE_ADC_FILE || path.join(env.APPDATA || path.join(os.homedir(), '.config'), 'gcloud', 'application_default_credentials.json');
  let credentials;
  try { credentials = JSON.parse(fs.readFileSync(adcPath, 'utf8').replace(/^\uFEFF/, '')); }
  catch (e) { throw safeError('RUNTIME_OR_CREDENTIAL_FILE', 'Cannot read local ADC. Use the documented owner renewal command.'); }
  if (credentials.type !== 'authorized_user') throw safeError('AUTH_CONFIGURATION', 'Expected authorized_user ADC. Service-account keys and implicit impersonation credentials are not accepted.');
  const Auth = GoogleAuthClass || (await import('google-auth-library')).GoogleAuth;
  const requestedScopes = mode === 'desktop-adc' ? [...DATA_SCOPES, IDENTITY_SCOPE] : ['https://www.googleapis.com/auth/cloud-platform'];
  const client = await new Auth({ credentials, scopes: requestedScopes }).getClient();
  // OAuth refresh itself must be bounded, not just the subsequent data API call.
  if (client.transporter?.defaults) Object.assign(client.transporter.defaults, { timeout: 20000, retry: false });
  let impersonated;
  async function token() {
    if (mode === 'desktop-adc') {
      const result = await client.getAccessToken();
      const value = typeof result === 'string' ? result : result?.token;
      if (!value) throw safeError('TOKEN_REJECTED', 'No access token returned. Renew desktop ADC.');
      return value;
    }
    if (!impersonated || Date.parse(impersonated.expireTime) - Date.now() < 60000) {
      const response = await client.request({ url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${encodeURIComponent(env.PEPCODEX_SA)}:generateAccessToken`, method: 'POST', data: { scope: DATA_SCOPES, lifetime: '3600s' }, timeout: 20000, retry: false });
      impersonated = response.data;
    }
    if (!impersonated?.accessToken) throw safeError('TOKEN_REJECTED', 'Impersonation did not return a token.');
    return impersonated.accessToken;
  }
  async function request(url, body, { attempts = 3 } = {}) {
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        // getAccessToken refreshes expiring direct credentials on every request.
        const bearer = await token();
        const response = await fetcher(url, { method: body ? 'POST' : 'GET', headers: { Authorization: `Bearer ${bearer}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(25000) });
        const data = await response.json();
        if (!response.ok || data.error) throw { status: response.status, response: { status: response.status, data } };
        return data;
      } catch (error) {
        const safe = classifyGoogleError(error);
        if (attempt + 1 < attempts && (safe.status === 429 || safe.status >= 500 || safe.code === 'NETWORK_TIMEOUT')) { await sleep(500 * 2 ** attempt); continue; }
        throw Object.assign(new Error(safe.action), { safeGoogleError: safe });
      }
    }
  }
  return { mode, requestedScopes, grantedScopes: 'UNKNOWN: verified by individual API calls, not inferred from requested scopes', token, request };
}
