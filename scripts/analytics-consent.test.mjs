import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { transform } from 'esbuild';
import { initializeAnalytics } from '../src/scripts/analytics-bootstrap.mjs';

const config = { measurementId: 'G-TEST123', environment: 'production', hostnames: ['www.pepcodex.com'] };
function browser({ host = 'www.pepcodex.com', saved = null, storageError = false } = {}) {
  const scripts = [];
  const cookies = [];
  const handlers = {};
  const win = {
    location: { hostname: host, origin: `https://${host}`, pathname: '/guide', search: '?email=private@example.com' },
    document: {
      referrer: 'https://example.com/private?token=secret',
      head: { appendChild: s => scripts.push(s) },
      createElement: () => ({}),
      get cookie() { return '_ga=old; _ga_TEST123=old; required=yes'; },
      set cookie(value) { cookies.push(value); },
    },
    localStorage: { getItem() { if (storageError) throw new Error('unavailable'); return saved; }, setItem(key, value) { saved = value; } },
    addEventListener(name, callback) { handlers[name] = callback; },
  };
  return { win, scripts, cookies, handlers };
}
const commands = win => (win.dataLayer || []).map(args => Array.from(args));
test('new and returning-denied visitors never load or configure the tag', () => {
  for (const saved of [null, JSON.stringify({ analytics: false, timestamp: Date.now() })]) {
    const { win, scripts } = browser({ saved });
    initializeAnalytics(config, win);
    assert.equal(scripts.length, 0);
    assert.equal(commands(win).some(c => c[0] === 'config'), false);
    assert.equal(win.pepcodexAnalytics.track('generate_lead', {}), false);
    assert.deepEqual(commands(win)[0].slice(0, 2), ['consent', 'default']);
  }
});
test('default then grant precede exactly one config/load on repeated acceptance', () => {
  const { win, scripts } = browser();
  initializeAnalytics(config, win);
  win.pepcodexAnalytics.setConsent(true);
  win.pepcodexAnalytics.setConsent(true);
  assert.equal(scripts.length, 1);
  const queue = commands(win);
  assert.deepEqual(queue[0].slice(0, 2), ['consent', 'default']);
  assert.equal(queue[1][2].analytics_storage, 'granted');
  assert.equal(queue.filter(c => c[0] === 'config').length, 1);
  const conf = queue.find(c => c[0] === 'config')[2];
  assert.equal(conf.page_location, 'https://www.pepcodex.com/guide');
  assert.equal(conf.page_referrer, 'https://example.com');
});
test('saved acceptance initializes after consent, malformed state remains denied', () => {
  for (const saved of ['garbage', '{}', JSON.stringify({ analytics: 'yes', timestamp: Date.now() }), JSON.stringify({ analytics: true, timestamp: Date.now() - 366 * 86400000 }), JSON.stringify({ analytics: true, timestamp: Date.now() + 86400000 })]) {
    const { win, scripts } = browser({ saved });
    initializeAnalytics(config, win);
    assert.equal(scripts.length, 0);
  }
  const { win, scripts } = browser({ saved: JSON.stringify({ analytics: true, timestamp: Date.now() }) });
  initializeAnalytics(config, win);
  assert.equal(scripts.length, 1);
  assert.equal(commands(win)[1][2].analytics_storage, 'granted');
});
test('preview, localhost, LAN, default domain and malformed IDs do not collect', () => {
  for (const host of ['localhost', '127.0.0.1', '192.168.1.10', 'pepcodex.vercel.app', 'preview.vercel.app']) {
    const { win, scripts } = browser({ host });
    initializeAnalytics(config, win);
    win.pepcodexAnalytics.setConsent(true);
    assert.equal(scripts.length, 0);
    assert.equal(win.pepcodexAnalytics.track('test', {}), false);
  }
  for (const changed of [{ environment: 'preview' }, { measurementId: 'G-bad<script>' }]) {
    const { win, scripts } = browser();
    initializeAnalytics({ ...config, ...changed }, win);
    win.pepcodexAnalytics.setConsent(true);
    assert.equal(scripts.length, 0);
  }
});
test('revocation suppresses custom events and expires host and apex GA cookies', () => {
  const { win, cookies } = browser();
  initializeAnalytics(config, win);
  win.pepcodexAnalytics.setConsent(true);
  assert.equal(win.pepcodexAnalytics.track('test', {}), true);
  win.pepcodexAnalytics.setConsent(false);
  assert.equal(win['ga-disable-G-TEST123'], true);
  assert.equal(win.pepcodexAnalytics.track('test', {}), false);
  assert.equal(commands(win).filter(c => c[0] === 'event').length, 1);
  assert.ok(cookies.some(c => c.includes('domain=.pepcodex.com')));
  assert.equal(cookies.some(c => c.startsWith('required=')), false);
});
test('storage failure does not cause analytics or block the consent API', () => {
  const { win, scripts } = browser({ storageError: true });
  initializeAnalytics(config, win);
  assert.equal(scripts.length, 0);
  win.pepcodexAnalytics.setConsent(true);
  assert.equal(scripts.length, 1);
});

test('another tab revocation, storage removal and suspended-tab expiry stop collection', () => {
  for (const trigger of ['storage', 'focus', 'pageshow']) {
    const { win, handlers } = browser({ saved: JSON.stringify({ analytics: true, timestamp: Date.now() }) });
    initializeAnalytics(config, win);
    assert.equal(win.pepcodexAnalytics.track('before'), true);
    win.localStorage.setItem('pepcodex_cookie_consent', trigger === 'storage' ? 'null' : JSON.stringify({ analytics: false, timestamp: Date.now() }));
    handlers[trigger]({ key: 'pepcodex_cookie_consent' });
    assert.equal(win.pepcodexAnalytics.track('after'), false);
    assert.equal(win['ga-disable-G-TEST123'], true);
  }
});

test('storage clear and expired saved acceptance revoke; unrelated storage events do not', () => {
  for (const saved of ['null', JSON.stringify({ analytics: true, timestamp: Date.now() - 366 * 86400000 })]) {
    const { win, handlers } = browser({ saved: JSON.stringify({ analytics: true, timestamp: Date.now() }) });
    initializeAnalytics(config, win);
    win.localStorage.setItem('pepcodex_cookie_consent', saved);
    handlers.storage({ key: 'unrelated_setting' });
    assert.equal(win.pepcodexAnalytics.track('before_relevant_signal'), true);
    handlers.storage({ key: null });
    assert.equal(win.pepcodexAnalytics.track('after_clear_or_expiry'), false);
  }
});

const notFoundComponent = await fs.readFile(new URL('../src/pages/404.astro', import.meta.url), 'utf8');
const notFoundSource = notFoundComponent.match(/<script>([\s\S]*?)<\/script>/)[1];
const { code: notFoundCode } = await transform(notFoundSource, { loader: 'ts', format: 'iife' });

test('actual 404 script respects denied/accepted consent and never transmits private attempted URL', () => {
  const canary = 'PRIVATE404CANARY';
  for (const accepted of [false, true]) {
    const { win, scripts } = browser({ saved: JSON.stringify({ analytics: accepted, timestamp: Date.now() }) });
    win.location.pathname = `/missing/${canary}`;
    win.location.search = `?email=${canary}%40example.test`;
    win.location.hash = `#${canary}`;
    win.location.href = `https://www.pepcodex.com${win.location.pathname}${win.location.search}${win.location.hash}`;
    win.document.getElementById = () => null;
    initializeAnalytics({ ...config, pagePath: '/404' }, win);
    vm.runInNewContext(notFoundCode, { window: win, document: win.document });
    const queue = commands(win), events = queue.filter(c => c[0] === 'event');
    assert.equal(events.length, accepted ? 1 : 0);
    assert.equal(scripts.length, accepted ? 1 : 0);
    assert.equal(JSON.stringify(queue).includes(canary), false);
    if (accepted) {
      assert.equal(events[0][1], 'page_not_found');
      assert.deepEqual(JSON.parse(JSON.stringify(events[0][2])), { page_type: '404' });
      assert.equal(queue.find(c => c[0] === 'config')[2].page_location, 'https://www.pepcodex.com/404');
    }
  }
});

test('actual 404 script safely executes without an analytics bootstrap', () => {
  assert.doesNotThrow(() => vm.runInNewContext(notFoundCode, { window: { location: {} }, document: { getElementById: () => null } }));
});

test('events on a 404 page use the rendered route and strip private referrer details', () => {
  const { win } = browser({ saved: JSON.stringify({ analytics: true, timestamp: Date.now() }) });
  initializeAnalytics({ ...config, pagePath: '/404' }, win);
  win.pepcodexAnalytics.track('scroll_depth', {
    page_path: '/PRIVATE_EVENT_PATH', page_location: 'https://www.pepcodex.com/PRIVATE_EVENT_PATH?secret=1',
    page_referrer: 'https://example.com/PRIVATE_EVENT_PATH?secret=1', depth_percent: 25,
  });
  const event = commands(win).find(c => c[0] === 'event');
  assert.equal(event[2].page_path, '/404');
  assert.equal(event[2].page_location, 'https://www.pepcodex.com/404');
  assert.equal(event[2].page_referrer, 'https://example.com');
  assert.equal(JSON.stringify(commands(win)).includes('PRIVATE_EVENT_PATH'), false);
});

test('serialized bootstrap runs in a clean browser context and emits effective consent changes', () => {
  const { win, scripts, handlers } = browser();
  const notifications = [];
  win.dispatchEvent = event => { notifications.push({ type: event.type, detail: event.detail }); return true; };
  class CustomEvent { constructor(type, options) { this.type = type; this.detail = options.detail; } }
  const serialized = `(${initializeAnalytics.toString()})(${JSON.stringify({ ...config, pagePath: '/guide' })}, window);`;
  vm.runInNewContext(serialized, { window: win, CustomEvent, URL, Date });
  assert.equal(scripts.length, 0);
  win.pepcodexAnalytics.setConsent(true);
  assert.equal(scripts.length, 1);
  assert.equal(notifications.at(-1).type, 'pepcodex:analytics-consent');
  assert.equal(notifications.at(-1).detail.analytics, true);
  win.localStorage.setItem('pepcodex_cookie_consent', JSON.stringify({ analytics: false, timestamp: Date.now() }));
  handlers.pageshow();
  assert.equal(notifications.at(-1).detail.analytics, false);
  assert.equal(win.pepcodexAnalytics.track('revoked'), false);
  assert.equal(commands(win).filter(c => c[0] === 'config').length, 1);
});
