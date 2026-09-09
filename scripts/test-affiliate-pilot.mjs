import test from 'node:test';
import assert from 'node:assert/strict';
import { affiliatePilot, approvedPilotUrl } from '../src/config/affiliate-pilot.mjs';
import { createAffiliateMeasurement } from '../src/scripts/affiliate-measurement.mjs';

const approved = { enabled: true, referralUrl: 'https://example.com/referral?campaign=generic', approvedOrigin: 'https://example.com', approvals: { pageReview: true, productTest: true, partnerTerms: true, privacyAndMeasurement: true, release: true } };

test('real configuration cannot publish a commercial URL', () => {
  assert.equal(approvedPilotUrl(affiliatePilot), null);
});
test('each evidence gate independently prevents activation', () => {
  for (const key of Object.keys(approved.approvals)) {
    assert.equal(approvedPilotUrl({ ...approved, approvals: { ...approved.approvals, [key]: false } }), null);
  }
  assert.equal(approvedPilotUrl(approved), approved.referralUrl);
});
test('rejects unsafe and unapproved destinations', () => {
  for (const referralUrl of ['', 'javascript:alert(1)', 'http://example.com/', 'https://example.com.evil.test/', 'https://user:pass@example.com/', 'https://example.com/#private']) {
    assert.equal(approvedPilotUrl({ ...approved, referralUrl }), null);
  }
});

function setup() {
  let time = 0, consent = true, production = true;
  const events = [];
  const counter = createAffiliateMeasurement({ allowed: () => consent && production, emit: (name, fields) => { events.push({ name, fields }); return true; }, clock: () => time });
  return { counter, events, tick: n => { time = n; }, consent: value => { consent = value; counter.consentChanged(); }, production: value => { production = value; } };
}
test('continuous visible second counts once; repeated activation has one exposure and click', () => {
  const s = setup();
  s.counter.visibility(.5); s.tick(999); s.counter.visibility(.5); assert.equal(s.events.length, 0);
  s.tick(1000); s.counter.visibility(.5); s.counter.visibility(1);
  s.counter.activate(); s.counter.activate();
  assert.deepEqual(s.events.map(e => e.name), ['growth_module_view', 'growth_outbound_click']);
});
test('immediate keyboard or pointer activation emits exposure before click', () => {
  const s = setup(); s.counter.activate();
  assert.deepEqual(s.events.map(e => e.name), ['growth_module_view', 'growth_outbound_click']);
  assert.deepEqual(Object.keys(s.events[1].fields).sort(), ['campaign_id', 'destination_id', 'placement_id', 'schema_version', 'variant']);
});
test('denied consent and nonproduction host produce no events', () => {
  const s = setup(); s.consent(false); s.counter.activate(); s.counter.visibility(1); s.tick(2000); s.counter.visibility(1);
  s.consent(true); s.production(false); s.counter.activate();
  assert.equal(s.events.length, 0);
});
test('interrupted visibility and hidden tab restart the timer', () => {
  const s = setup(); s.counter.visibility(1); s.tick(800); s.counter.visibility(.2); s.tick(1000); s.counter.visibility(1);
  s.tick(1800); s.counter.visibility(1, false); s.tick(2000); s.counter.visibility(1); s.tick(2999); s.counter.visibility(1);
  assert.equal(s.events.length, 0); s.tick(3000); s.counter.visibility(1); assert.equal(s.events.length, 1);
});
test('revocation clears pending visibility and reacceptance does not duplicate prior events', () => {
  const s = setup(); s.counter.visibility(1); s.tick(800); s.consent(false); s.tick(1500); s.consent(true); s.counter.visibility(1);
  s.tick(2499); s.counter.visibility(1); assert.equal(s.events.length, 0);
  s.counter.activate(); s.consent(false); s.counter.activate(); s.consent(true); s.counter.activate();
  assert.equal(s.events.length, 2);
});
test('disposed instances and missing adapters are inert; a new lifecycle can count', () => {
  const s = setup(); s.counter.dispose(); s.counter.activate(); assert.equal(s.events.length, 0);
  assert.doesNotThrow(() => createAffiliateMeasurement().activate());
  const next = setup(); next.counter.activate(); assert.equal(next.events.length, 2);
});
test('transport and consent failures do not throw into navigation handlers', () => {
  assert.doesNotThrow(() => createAffiliateMeasurement({ allowed: () => true, emit: () => { throw Error('offline'); } }).activate());
  assert.doesNotThrow(() => createAffiliateMeasurement({ allowed: () => { throw Error('unavailable'); }, emit: () => assert.fail() }).activate());
});

test('rejected exposure prevents click; a later real activation can retry', () => {
  let accepting = false;
  const calls = [];
  const counter = createAffiliateMeasurement({ allowed: () => true, emit: name => { calls.push(name); return accepting; } });
  counter.activate();
  assert.deepEqual(calls, ['growth_module_view']);
  accepting = true; counter.activate(); counter.activate();
  assert.deepEqual(calls, ['growth_module_view', 'growth_module_view', 'growth_outbound_click']);
});
test('rejected click can retry without a second accepted exposure', () => {
  let acceptingClick = false;
  const calls = [];
  const counter = createAffiliateMeasurement({ allowed: () => true, emit: name => { calls.push(name); return name === 'growth_module_view' || acceptingClick; } });
  counter.activate(); acceptingClick = true; counter.activate(); counter.activate();
  assert.deepEqual(calls, ['growth_module_view', 'growth_outbound_click', 'growth_outbound_click']);
});
test('throws, missing receipts and reentrant callbacks cannot fabricate accepted counters', () => {
  for (const receipt of [false, undefined, 1, 'true']) {
    const calls = [];
    const counter = createAffiliateMeasurement({ allowed: () => true, emit: name => { calls.push(name); return receipt; } });
    counter.activate(); counter.activate();
    assert.deepEqual(calls, ['growth_module_view', 'growth_module_view']);
  }
  const calls = [];
  const counter = createAffiliateMeasurement({ allowed: () => true, emit: name => { calls.push(name); counter.activate(); return true; } });
  counter.activate();
  assert.deepEqual(calls, ['growth_module_view', 'growth_outbound_click']);
});
