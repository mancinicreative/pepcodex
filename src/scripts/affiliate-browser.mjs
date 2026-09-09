import { createAffiliateMeasurement } from './affiliate-measurement.mjs';

const guidePath = '/guide/how-to-read-peptide-research';
const moduleSelector = '[data-growth-pilot="reading_guide"]';
const installations = new WeakMap();

/** Explicitly invoked by integration only after pilot activation requirements pass.
 * No top-level browser effects. Missing enablement/environment/API means no events.
 * Uses R04's final enqueue guard; never loads a tag, reads storage or sends a request.
 */
export function initializeAffiliateMeasurement({ window: win = globalThis.window, environment, enabled = false } = {}) {
  const noop = () => {};
  if (!win || enabled !== true || environment !== 'production' || win.location.hostname !== 'www.pepcodex.com') return noop;
  if (installations.has(win)) return installations.get(win);
  const doc = win.document;
  let current = null;
  let destroyed = false;

  function mount(element) {
    const anchor = element.querySelector('[data-growth-outbound="readwise"]');
    if (!anchor) return null;
    let timer = null, observer = null, suspended = false, effectiveConsent = null;
    let stopped = false;
    const activations = new Set();
    function cancelActivations() {
      for (const pending of activations) win.clearTimeout(pending);
      activations.clear();
    }
    function allowed() {
      if (stopped || suspended || !element.isConnected || effectiveConsent === false) return false;
      if (win.location.hostname !== 'www.pepcodex.com' || win.location.pathname !== guidePath) return false;
      try {
        return typeof win.pepcodexAnalytics?.track === 'function'
          && win.pepcodexAnalytics.readConsent()?.analytics === true;
      } catch { return false; }
    }
    const counter = createAffiliateMeasurement({
      allowed,
      emit: (name, fields) => win.pepcodexAnalytics?.track(name, fields) === true,
      clock: () => win.performance.now(),
    });
    function resetVisibility() {
      if (timer !== null) win.clearTimeout(timer);
      timer = null;
      observer?.disconnect(); observer = null;
      counter.consentChanged();
    }
    function observe() {
      resetVisibility();
      if (!allowed() || doc.visibilityState !== 'visible' || typeof win.IntersectionObserver !== 'function') return;
      const fresh = new win.IntersectionObserver(entries => {
        // Ignore callbacks queued by an observer replaced after consent/navigation.
        if (observer !== fresh) return;
        const entry = entries.filter(item => item.target === element).at(-1);
        if (!entry) return;
        const ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
        counter.visibility(ratio, doc.visibilityState === 'visible');
        if (ratio < .5 || !allowed() || doc.visibilityState !== 'visible') {
          if (timer !== null) win.clearTimeout(timer);
          timer = null;
        } else if (timer === null) {
          timer = win.setTimeout(() => {
            timer = null;
            if (observer === fresh) counter.visibility(ratio, doc.visibilityState === 'visible');
          }, 1000);
        }
      }, { threshold: [0, .5] });
      observer = fresh;
      fresh.observe(element);
    }
    function activate(event) {
      if (event.defaultPrevented || !allowed()) return;
      if ((event.type === 'click' && event.button !== 0) || (event.type === 'auxclick' && event.button !== 1)) return;
      // A later target or bubbling listener may still cancel this activation.
      // Use a later task, not a microtask between native event listeners. Never
      // delay navigation; a document that leaves first may lose this measurement.
      const pending = win.setTimeout(() => {
        activations.delete(pending);
        if (!event.defaultPrevented && allowed()) counter.activate();
      }, 0);
      activations.add(pending);
    }
    function consentChanged(event) {
      cancelActivations();
      effectiveConsent = event.detail?.analytics === true;
      observe();
    }
    function pagehide(event) {
      cancelActivations();
      if (!event.persisted) { unmount(); return; }
      suspended = true; resetVisibility();
    }
    function pageshow() { suspended = false; observe(); }
    function unmount() {
      if (stopped) return;
      cancelActivations();
      stopped = true; resetVisibility(); counter.dispose();
      anchor.removeEventListener('click', activate);
      anchor.removeEventListener('auxclick', activate);
      win.removeEventListener('pepcodex:analytics-consent', consentChanged);
      win.removeEventListener('pagehide', pagehide);
      win.removeEventListener('pageshow', pageshow);
      doc.removeEventListener('visibilitychange', observe);
    }
    anchor.addEventListener('click', activate);
    anchor.addEventListener('auxclick', activate);
    win.addEventListener('pepcodex:analytics-consent', consentChanged);
    win.addEventListener('pagehide', pagehide);
    win.addEventListener('pageshow', pageshow);
    doc.addEventListener('visibilitychange', observe);
    observe();
    return { element, unmount };
  }
  function unmountCurrent() { current?.unmount(); current = null; }
  function pageLoad() {
    if (destroyed) return;
    const element = win.location.pathname === guidePath ? doc.querySelector(moduleSelector) : null;
    if (current?.element === element) return;
    unmountCurrent();
    if (element) current = mount(element);
  }
  doc.addEventListener('astro:before-swap', unmountCurrent);
  doc.addEventListener('astro:page-load', pageLoad);
  doc.addEventListener('DOMContentLoaded', pageLoad);
  pageLoad();
  const dispose = () => {
    destroyed = true; unmountCurrent();
    doc.removeEventListener('astro:before-swap', unmountCurrent);
    doc.removeEventListener('astro:page-load', pageLoad);
    doc.removeEventListener('DOMContentLoaded', pageLoad);
    installations.delete(win);
  };
  installations.set(win, dispose);
  return dispose;
}
