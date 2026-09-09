import test from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { initializeAffiliateMeasurement } from '../src/scripts/affiliate-browser.mjs';

function dispatch(target, name, values = {}) {
  const event = new Event(name, { cancelable: true });
  for (const [key, value] of Object.entries(values)) Object.defineProperty(event, key, { value });
  target.dispatchEvent(event);
  return event;
}
function fixture({ consent = true, transport = true, host = 'www.pepcodex.com', present = true } = {}) {
  const win = new EventTarget(), doc = new EventTarget();
  let now = 0, id = 0;
  const timers = new Map(), observers = [], events = [];
  function makeModule() {
    const anchor = new EventTarget();
    return { anchor, isConnected: true, querySelector: () => anchor };
  }
  let element = present ? makeModule() : null;
  doc.querySelector = () => element;
  doc.visibilityState = 'visible';
  win.document = doc;
  win.location = { hostname: host, pathname: '/guide/how-to-read-peptide-research' };
  win.performance = { now: () => now };
  win.setTimeout = (fn, delay) => { const key = ++id; timers.set(key, { fn, at: now + delay }); return key; };
  win.clearTimeout = key => timers.delete(key);
  win.IntersectionObserver = class {
    constructor(fn) { this.fn = fn; this.connected = false; observers.push(this); }
    observe(target) { this.target = target; this.connected = true; }
    disconnect() { this.connected = false; }
    report(ratio) { this.fn([{ target: this.target, isIntersecting: ratio > 0, intersectionRatio: ratio }]); }
  };
  win.pepcodexAnalytics = {
    readConsent: () => ({ analytics: consent, timestamp: Date.now() }),
    track: (name, params) => {
      if (!transport || !consent) return false;
      events.push({ name, params }); return true;
    },
  };
  const options = { window: win, enabled: true, environment: 'production' };
  return {
    win, doc, options, timers, observers, events,
    get element() { return element; },
    initialize: (extra = {}) => initializeAffiliateMeasurement({ ...options, ...extra }),
    advance(ms) {
      const end = now + ms;
      for (;;) {
        const next = [...timers].filter(([,t]) => t.at <= end).sort((a,b) => a[1].at - b[1].at)[0];
        if (!next) break;
        const [key, value] = next; timers.delete(key); now = value.at; value.fn();
      }
      now = end;
    },
    view: ratio => observers.filter(o => o.connected).at(-1)?.report(ratio),
    click(type = 'click', button = 0) {
      const event = dispatch(element.anchor, type, { button });
      this.advance(0);
      return event;
    },
    consent(value) { consent = value; dispatch(win, 'pepcodex:analytics-consent', { detail: { analytics: value } }); },
    transport(value) { transport = value; },
    visible(value) { doc.visibilityState = value ? 'visible' : 'hidden'; dispatch(doc, 'visibilitychange'); },
    replace() { if (element) element.isConnected = false; element = makeModule(); },
  };
}

test('disabled, preview and wrong-host installations produce no observers or events', () => {
  for (const extra of [{ enabled: false }, { environment: 'preview' }, { environment: undefined }]) {
    const f = fixture(); f.initialize(extra); f.click(); assert.equal(f.observers.length, 0); assert.equal(f.events.length, 0);
  }
  for (const host of ['localhost', '127.0.0.1', 'preview.vercel.app', 'pepcodex.com', '192.168.0.1']) {
    const f = fixture({ host }); f.initialize(); f.click(); assert.equal(f.events.length, 0); assert.equal(f.observers.length, 0);
  }
});
test('no module or missing API causes no collection', () => {
  const absent = fixture({ present: false }); absent.initialize(); assert.equal(absent.observers.length, 0);
  const f = fixture(); delete f.win.pepcodexAnalytics; f.initialize(); f.click(); assert.equal(f.events.length, 0);
});
test('timer measures continuous visible time without restarting on above-threshold notifications', () => {
  const f = fixture(); f.initialize(); f.view(.5); f.advance(800); f.view(.8); f.advance(199); assert.equal(f.events.length, 0);
  f.advance(1); assert.deepEqual(f.events.map(e => e.name), ['growth_module_view']);
  f.view(1); f.advance(1000); assert.equal(f.events.length, 1);
});
test('keyboard/pointer and middle-click count once without blocking navigation', () => {
  const f = fixture(); f.initialize(); const event = f.click(); f.click('auxclick', 1);
  assert.equal(event.defaultPrevented, false);
  assert.deepEqual(f.events.map(e => e.name), ['growth_module_view', 'growth_outbound_click']);
  assert.deepEqual(f.events[1].params, { schema_version: 2, campaign_id: 'growth_p01', placement_id: 'reading_guide', variant: 'worksheet_tool', destination_id: 'readwise' });
  const middle = fixture(); middle.initialize(); middle.click('auxclick', 1); assert.equal(middle.events.length, 2);
});
test('canceled links and right-click do not count', () => {
  const f = fixture(); f.element.anchor.addEventListener('click', event => event.preventDefault()); f.initialize();
  f.click(); f.click('auxclick', 2); assert.equal(f.events.length, 0);
});
test('later same-target cancellation suppresses ordinary and middle-click events', () => {
  for (const [type, button] of [['click', 0], ['auxclick', 1]]) {
    const f = fixture(); f.initialize();
    f.element.anchor.addEventListener(type, event => event.preventDefault());
    const event = dispatch(f.element.anchor, type, { button });
    assert.equal(event.defaultPrevented, true); assert.equal(f.events.length, 0);
    f.advance(0); assert.equal(f.events.length, 0);
  }
});
test('activation waits for dispatch completion and uncanceled events retain ordering', () => {
  for (const [type, button] of [['click', 0], ['auxclick', 1]]) {
    const f = fixture(); f.initialize();
    const event = dispatch(f.element.anchor, type, { button });
    assert.equal(event.defaultPrevented, false); assert.equal(f.events.length, 0);
    f.advance(0);
    assert.deepEqual(f.events.map(e => e.name), ['growth_module_view', 'growth_outbound_click']);
  }
});
test('pending activation is discarded across consent revocation, pagehide and disposal', () => {
  for (const invalidate of [f => { f.consent(false); f.consent(true); }, f => { dispatch(f.win, 'pagehide', { persisted: true }); dispatch(f.win, 'pageshow', { persisted: true }); }, f => dispatch(f.doc, 'astro:before-swap')]) {
    const f = fixture(); f.initialize(); dispatch(f.element.anchor, 'click', { button: 0 });
    invalidate(f); f.advance(0); assert.equal(f.events.length, 0);
  }
});
test('deferred activation rechecks connection, current consent and final transport', () => {
  for (const invalidate of [f => { f.element.isConnected = false; }, f => { f.win.pepcodexAnalytics.readConsent = () => null; }, f => f.transport(false)]) {
    const f = fixture(); f.initialize(); dispatch(f.element.anchor, 'click', { button: 0 });
    invalidate(f); f.advance(0); assert.equal(f.events.length, 0);
  }
  const f = fixture({ consent: false }); f.initialize(); dispatch(f.element.anchor, 'click', { button: 0 });
  f.consent(true); f.advance(0); assert.equal(f.events.length, 0);
});
test('consent denial clears timers and late old observer callbacks cannot replay activity', () => {
  const f = fixture(); f.initialize(); f.view(1); f.advance(700); const old = f.observers.at(-1);
  f.consent(false); assert.equal(f.timers.size, 0); old.report(1); f.advance(2000); f.click(); assert.equal(f.events.length, 0);
  f.consent(true); f.view(1); f.advance(999); assert.equal(f.events.length, 0); f.advance(1); f.click();
  f.consent(false); f.consent(true); f.click(); assert.equal(f.events.length, 2);
});
test('hidden documents reset visibility; returning visible needs a fresh second', () => {
  const f = fixture(); f.initialize(); f.view(1); f.advance(900); f.visible(false); f.advance(2000);
  f.visible(true); f.view(1); f.advance(999); assert.equal(f.events.length, 0); f.advance(1); assert.equal(f.events.length, 1);
});
test('BFCache suspends pending visibility but retains accepted counters', () => {
  const f = fixture(); f.initialize(); f.click(); dispatch(f.win, 'pagehide', { persisted: true }); f.click();
  dispatch(f.win, 'pageshow', { persisted: true }); f.view(1); f.advance(1000); f.click(); assert.equal(f.events.length, 2);
});
test('Astro navigation disposes old observers/listeners and new page instance can count', () => {
  const f = fixture(); f.initialize(); f.view(1); const old = f.element, observer = f.observers.at(-1);
  dispatch(f.doc, 'astro:before-swap'); f.replace(); dispatch(f.doc, 'astro:page-load'); dispatch(f.doc, 'astro:page-load');
  dispatch(old.anchor, 'click', { button: 0 }); observer.report(1); f.advance(1000); assert.equal(f.events.length, 0);
  f.click(); assert.equal(f.events.length, 2);
});
test('duplicate initialization is idempotent and dispose prevents further activity', () => {
  const f = fixture(); const stop = f.initialize(); assert.equal(f.initialize(), stop); assert.equal(f.observers.length, 1);
  stop(); f.view(1); f.click(); dispatch(f.doc, 'astro:page-load'); f.advance(1000); assert.equal(f.events.length, 0);
  f.initialize(); f.click(); assert.equal(f.events.length, 2);
});
test('shared final transport guard rejection does not consume the click', () => {
  const f = fixture({ transport: false }); f.initialize(); f.click(); assert.equal(f.events.length, 0);
  f.transport(true); f.click(); assert.equal(f.events.length, 2);
});
test('wrong page and disconnected modules do not collect', () => {
  const f = fixture(); f.win.location.pathname = '/another-page'; f.initialize(); f.click(); assert.equal(f.events.length, 0);
  const g = fixture(); g.initialize(); g.element.isConnected = false; g.click(); assert.equal(g.events.length, 0);
});

test('actual captured R04 module accepts, rejects and reaccepts without stale counters', { skip: !process.env.PEPCODEX_R04_MODULE }, async () => {
  const { initializeAnalytics } = await import(pathToFileURL(process.env.PEPCODEX_R04_MODULE).href);
  const f = fixture();
  let saved = { essential: true, analytics: true, timestamp: Date.now() };
  const scripts = [];
  f.win.localStorage = { getItem: () => JSON.stringify(saved) };
  f.win.location.origin = 'https://www.pepcodex.com';
  f.doc.referrer = ''; f.doc.cookie = '';
  f.doc.createElement = () => ({});
  f.doc.head = { appendChild: value => scripts.push(value) };
  initializeAnalytics({ environment: 'production', hostnames: ['www.pepcodex.com'], measurementId: 'G-TEST123', pagePath: '/guide/how-to-read-peptide-research' }, f.win);
  f.initialize();
  const eventRows = () => f.win.dataLayer.filter(args => args[0] === 'event');
  saved = { ...saved, analytics: false }; f.win.pepcodexAnalytics.setConsent(false);
  f.click(); assert.equal(eventRows().length, 0);
  saved = { ...saved, analytics: true }; f.win.pepcodexAnalytics.setConsent(true);
  f.click(); f.click();
  assert.deepEqual(eventRows().map(args => args[1]), ['growth_module_view', 'growth_outbound_click']);
  assert.equal(scripts.length, 1, 'shared module initializes one simulated tag; affiliate adds none');
  assert.deepEqual(Object.keys(eventRows()[1][2]).sort(), ['campaign_id', 'destination_id', 'placement_id', 'schema_version', 'variant']);
  saved = { ...saved, analytics: false }; dispatch(f.win, 'storage', { key: 'pepcodex_cookie_consent' });
  dispatch(f.doc, 'astro:before-swap'); f.replace(); dispatch(f.doc, 'astro:page-load'); f.click();
  assert.equal(eventRows().length, 2);
  saved = { ...saved, analytics: true }; dispatch(f.win, 'storage', { key: 'pepcodex_cookie_consent' });
  f.click(); assert.equal(eventRows().length, 4);
});
