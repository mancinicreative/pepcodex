import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createGoogleAccess, classifyGoogleError, loadEnvironment } from './lib/google-auth.mjs';

function fixture(t, { type = 'authorized_user', client = {}, fetcher, mode, sa } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pepcodex-auth-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const adc = path.join(dir, 'adc.json');
  fs.writeFileSync(adc, JSON.stringify({ type, refresh_token: 'FAKE-TEST-REFRESH-NOT-A-CREDENTIAL' }));
  let options;
  class Auth { constructor(value) { options = value; } async getClient() { return { transporter: { defaults: {} }, getAccessToken: async () => ({ token: 'FAKE-TEST-ACCESS' }), ...client }; } }
  return { config: { env: { PEPCODEX_GOOGLE_ADC_FILE: adc, ...(mode ? { PEPCODEX_GOOGLE_AUTH_MODE: mode } : {}), ...(sa ? { PEPCODEX_SA: sa } : {}) }, GoogleAuthClass: Auth, fetcher, sleep: async () => {} }, options: () => options, dir };
}
const response = (status, data) => ({ status, ok: status >= 200 && status < 300, json: async () => data });

test('error reports classify auth, scopes, API, permission, quota, runtime and network without leaking values', () => {
  for (const [input, expected] of [
    [{ message: 'invalid_grant invalid_rapt SECRET' }, 'REAUTH_REQUIRED'],
    [{ status: 403, message: 'ACCESS_TOKEN_SCOPE_INSUFFICIENT SECRET' }, 'MISSING_SCOPE'],
    [{ status: 403, message: 'SERVICE_DISABLED SECRET' }, 'API_DISABLED'],
    [{ status: 403 }, 'PROPERTY_PERMISSION'], [{ status: 429 }, 'RATE_LIMITED'],
    [{ code: 'EPERM', message: 'SECRET' }, 'RUNTIME_OR_CREDENTIAL_FILE'],
    [{ message: 'fetch failed SECRET' }, 'NETWORK_TIMEOUT'],
    [{ message: 'USER_PROJECT_DENIED SECRET' }, 'QUOTA_PROJECT'],
  ]) {
    const actual = classifyGoogleError(input);
    assert.equal(actual.code, expected); assert.ok(!JSON.stringify(actual).includes('SECRET'));
  }
});
test('desktop is default, requests no cloud scope and refresh-capable token retrieval happens for each request', async t => {
  let calls = 0; const seen = [];
  const f = fixture(t, { client: { getAccessToken: async () => ({ token: `FAKE-${++calls}` }) }, fetcher: async (_, init) => { seen.push(init.headers.Authorization); return response(200, { ok: true }); } });
  const access = await createGoogleAccess(f.config);
  await access.request('https://example.test'); await access.request('https://example.test');
  assert.equal(access.mode, 'desktop-adc'); assert.ok(f.options().scopes.every(s => !s.includes('cloud-platform')));
  assert.deepEqual(seen, ['Bearer FAKE-1', 'Bearer FAKE-2']);
  assert.match(access.grantedScopes, /UNKNOWN/);
});
test('reauth failure has one attempt, no API call and no secret in actionable result', async t => {
  let tokens = 0, requests = 0;
  const f = fixture(t, { client: { getAccessToken: async () => { tokens++; throw { response: { data: { error: 'invalid_grant', error_subtype: 'invalid_rapt', access_token: 'SECRET' } } }; } }, fetcher: async () => { requests++; } });
  const access = await createGoogleAccess(f.config);
  await assert.rejects(access.request('https://example.test'), e => classifyGoogleError(e).code === 'REAUTH_REQUIRED' && !JSON.stringify(e).includes('SECRET'));
  assert.equal(tokens, 1); assert.equal(requests, 0);
});
test('429/503 retry then succeed; persistent 429 stops after three calls', async t => {
  let calls = 0;
  const f = fixture(t, { fetcher: async () => response(++calls < 3 ? (calls === 1 ? 429 : 503) : 200, calls < 3 ? { error: { message: 'temporary' } } : { rows: [] }) });
  const access = await createGoogleAccess(f.config);
  assert.deepEqual(await access.request('https://example.test'), { rows: [] }); assert.equal(calls, 3);
  calls = 0; const bad = await createGoogleAccess({ ...f.config, fetcher: async () => { calls++; return response(429, { error: { message: 'SECRET' } }); } });
  await assert.rejects(bad.request('https://example.test'), e => classifyGoogleError(e).code === 'RATE_LIMITED'); assert.equal(calls, 3);
});
test('permission error does not retry; missing identity scope is separate from data scope success', async t => {
  let calls = 0;
  const f = fixture(t, { fetcher: async url => { calls++; return url.endsWith('userinfo') ? response(403, { error: { message: 'insufficient authentication scopes' } }) : response(200, { siteEntry: [] }); } });
  const access = await createGoogleAccess(f.config);
  await assert.rejects(access.request('https://example.test/userinfo'), e => classifyGoogleError(e).code === 'MISSING_SCOPE');
  assert.equal(calls, 1); assert.deepEqual(await access.request('https://example.test/sites'), { siteEntry: [] });
});
test('service-account keys and hidden override cannot be selected accidentally', async t => {
  const f = fixture(t, { type: 'service_account' });
  await assert.rejects(createGoogleAccess(f.config), /authorized_user/);
  await assert.rejects(createGoogleAccess({ ...f.config, env: { ...f.config.env, GOOGLE_APPLICATION_CREDENTIALS: 'secret.json' } }), /Unset GOOGLE_APPLICATION_CREDENTIALS/);
  await assert.rejects(createGoogleAccess({ ...f.config, env: { ...f.config.env, PEPCODEX_GOOGLE_AUTH_MODE: 'iam-impersonation' } }), /requires PEPCODEX_SA/);
});
test('deliberate impersonation scopes and cached expiry are explicit', async t => {
  let minted = 0, request;
  const f = fixture(t, { mode: 'iam-impersonation', sa: 'reader@example.test', client: { request: async options => { request = options; minted++; return { data: { accessToken: 'FAKE-SA', expireTime: new Date(Date.now() + 3600000).toISOString() } }; } } });
  const access = await createGoogleAccess(f.config);
  assert.equal(await access.token(), 'FAKE-SA'); assert.equal(await access.token(), 'FAKE-SA'); assert.equal(minted, 1);
  assert.equal(request.timeout, 20000); assert.ok(request.data.scope.every(s => s.endsWith('.readonly')));
});
test('environment loader respects shell overrides and ignores comments', t => {
  const f = fixture(t); const env = { GA4_PROPERTY_ID: '123' }; const file = path.join(f.dir, '.env');
  fs.writeFileSync(file, '#comment\r\nGA4_PROPERTY_ID=456\r\nPEPCODEX_GOOGLE_AUTH_MODE="desktop-adc"\r\n');
  loadEnvironment(file, env); assert.equal(env.GA4_PROPERTY_ID, '123'); assert.equal(env.PEPCODEX_GOOGLE_AUTH_MODE, 'desktop-adc');
});
