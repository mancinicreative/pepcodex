import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { transform } from 'esbuild';

// Exercise the actual component script, with no outbound requests or subscriptions.
const component = await fs.readFile(new URL('../src/components/NewsletterForm.astro', import.meta.url), 'utf8');
const source = component.match(/<script>([\s\S]*?)<\/script>/)[1];
const { code } = await transform(source, { loader: 'ts', format: 'iife' });
function setup({ status = 200, data = { success: true, subscriptionStatus: 'accepted' }, valid = true, website = '', fetcher } = {}) {
  const events = [], requests = [], children = [];
  const button = { textContent: 'Subscribe', setAttribute() {}, removeAttribute() {} };
  const form = {
    handler: null,
    addEventListener(name, fn) { if (name === 'submit') this.handler = fn; },
    reportValidity: () => valid,
    querySelector: selector => selector === 'button' ? button : null,
    replaceChildren() { children.length = 0; },
    appendChild(child) { children.push(child); },
  };
  const document = {
    querySelectorAll: () => [form],
    createElement: () => ({ setAttribute() {}, className: '', textContent: '' }),
  };
  const window = { location: { pathname: '/guide' }, pepcodexAnalytics: { track: (...args) => events.push(args) } };
  const fetch = async (...args) => {
    requests.push(args);
    return fetcher ? fetcher(...args) : { ok: status >= 200 && status < 300, json: async () => data };
  };
  class FormData { get(key) { return ({ email: 'private@example.com', source: 'test', website })[key]; } }
  vm.runInNewContext(code, { document, window, fetch, FormData });
  return { events, requests, form, children, submit: () => form.handler({ preventDefault() {}, target: form }) };
}
test('accepted server response emits once without personal form data', async () => {
  const state = setup();
  await state.submit();
  await state.submit();
  assert.equal(state.requests.length, 1);
  assert.equal(state.events.length, 1);
  assert.equal(state.events[0][0], 'generate_lead');
  assert.equal(state.events[0][1].lead_stage, 'request_accepted');
  assert.equal(JSON.stringify(state.events).includes('private@example.com'), false);
});
test('invalid, rejected, existing and honeypot outcomes never emit a lead', async () => {
  for (const options of [
    { valid: false }, { status: 500 }, { data: { success: false } },
    { data: { success: true, subscriptionStatus: 'existing' } },
    { data: { success: true } }, { website: 'spam' },
    { fetcher: async () => { throw new Error('network'); } },
  ]) {
    const state = setup(options);
    await state.submit();
    assert.equal(state.events.length, 0, JSON.stringify(options));
    if (options.valid === false) assert.equal(state.requests.length, 0);
  }
});
test('a double submit while request is pending only sends one request', async () => {
  let release;
  const state = setup({ fetcher: () => new Promise(resolve => { release = resolve; }) });
  const first = state.submit();
  await state.submit();
  assert.equal(state.requests.length, 1);
  release({ ok: true, json: async () => ({ success: true, subscriptionStatus: 'accepted' }) });
  await first;
  assert.equal(state.events.length, 1);
});
test('a failed request can be retried successfully', async () => {
  let attempts = 0;
  const state = setup({ fetcher: async () => {
    if (++attempts === 1) throw new Error('network');
    return { ok: true, json: async () => ({ success: true, subscriptionStatus: 'accepted' }) };
  } });
  await state.submit();
  await state.submit();
  assert.equal(state.requests.length, 2);
  assert.equal(state.events.length, 1);
});

// Execute the actual API implementation with only explicitly fake credentials. No process.env,
// real provider client, network, newsletter membership, or mail-sending mechanism is used.
const apiSource = await fs.readFile(new URL('../src/pages/api/subscribe.ts', import.meta.url), 'utf8');
const { code: apiCode } = await transform(apiSource, {
  loader: 'ts', format: 'cjs',
  define: { 'import.meta.env': JSON.stringify({
    BEEHIIV_API_KEY: 'fixture-key-not-a-secret', BEEHIIV_PUBLICATION_ID: 'fixture-publication',
    PEPCODEX_ALLOWED_ORIGINS: 'https://www.pepcodex.com',
  }) },
});
function api({ providerStatus = 200, providerBody = '{}', providerError = null } = {}) {
  const requests = [], logs = [], module = { exports: {} };
  const providerFetch = async (...args) => {
    requests.push(args);
    if (providerError) throw providerError;
    return new Response(providerBody, { status: providerStatus, headers: { 'Content-Type': 'application/json' } });
  };
  vm.runInNewContext(apiCode, { module, exports: module.exports, URL, Response, fetch: providerFetch,
    console: { error: (...args) => logs.push(args) } });
  const submit = body => module.exports.POST({
    request: new Request('https://www.pepcodex.com/api/subscribe', { method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://www.pepcodex.com' }, body: JSON.stringify(body) }),
    clientAddress: '192.0.2.20',
  });
  return { requests, logs, submit };
}

test('actual subscription API classifies provider acceptance versus existing subscription', async () => {
  for (const [providerStatus, expected] of [[200, 'accepted'], [201, 'accepted'], [409, 'existing']]) {
    const state = api({ providerStatus });
    const response = await state.submit({ email: 'PRIVATEAPI@example.test', source: 'fixture' });
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.success, true);
    assert.equal(body.subscriptionStatus, expected);
    assert.equal(state.requests.length, 1);
    assert.equal(state.requests[0][0], 'https://api.beehiiv.com/v2/publications/fixture-publication/subscriptions');
    assert.equal(JSON.stringify(body).includes('PRIVATEAPI'), false);
  }
});

test('actual API provider errors do not masquerade as accepted leads or expose provider body to browser', async () => {
  for (const options of [{ providerStatus: 400 }, { providerStatus: 429 }, { providerStatus: 500 }, { providerError: new Error('fixture network failure') }]) {
    const state = api({ ...options, providerBody: '{"message":"PRIVATE_PROVIDER_CANARY"}' });
    const response = await state.submit({ email: 'private@example.test' });
    assert.equal(response.status, 500);
    const body = await response.json();
    assert.equal(body.success, false);
    assert.equal(body.subscriptionStatus, undefined);
    assert.equal(JSON.stringify(body).includes('PRIVATE_PROVIDER_CANARY'), false);
    assert.equal(state.requests.length, 1);
  }
});

test('actual API honeypot and invalid email never call provider and cannot classify accepted', async () => {
  for (const body of [{ email: 'private@example.test', website: 'spam' }, { email: 'invalid' }]) {
    const state = api();
    const response = await state.submit(body), result = await response.json();
    assert.equal(response.status, body.website ? 200 : 400);
    assert.equal(result.success, Boolean(body.website));
    assert.equal(result.subscriptionStatus, undefined);
    assert.equal(state.requests.length, 0);
  }
});

test('actual component plus actual API emits exactly one lead only for provider acceptance', async () => {
  for (const options of [{ providerStatus: 200 }, { providerStatus: 409 }, { providerStatus: 500 }, { providerStatus: 200, website: 'spam' }]) {
    const server = api(options);
    const client = setup({ website: options.website || '', fetcher: async (url, request) => {
      assert.equal(url, '/api/subscribe');
      return server.submit(JSON.parse(request.body));
    } });
    await client.submit();
    const expected = options.providerStatus === 200 && !options.website ? 1 : 0;
    assert.equal(client.events.length, expected);
    if (expected) {
      await client.submit();
      assert.equal(client.events.length, 1);
      assert.equal(server.requests.length, 1);
      assert.equal(client.events[0][1].lead_stage, 'request_accepted');
    }
    assert.equal(JSON.stringify(client.events).includes('private@example.com'), false);
  }
});
