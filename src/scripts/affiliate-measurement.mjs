/**
 * Revision 2, per-document counters. No cookies, storage, gtag or network calls.
 * R04 supplies an accepted consent/transport adapter at activation time.
 * The sender must synchronously return true only when it accepts an enqueue.
 * Acceptance is not server delivery. Navigation never waits on the transport.
 */
export function createAffiliateMeasurement({ allowed = () => false, emit, clock = () => performance.now() } = {}) {
  let exposed = false;
  let clicked = false;
  let visibleSince = null;
  let disposed = false;
  let sending = false;
  const payload = Object.freeze({ schema_version: 2, campaign_id: 'growth_p01', placement_id: 'reading_guide', variant: 'worksheet_tool' });

  function eligible() {
    if (disposed || sending || typeof emit !== 'function') return false;
    try { return allowed() === true; } catch { return false; }
  }

  function send(name, fields) {
    sending = true;
    try { return emit(name, fields) === true; }
    catch { return false; }
    finally { sending = false; }
  }

  function exposure() {
    if (!exposed) exposed = send('growth_module_view', payload);
    return exposed;
  }

  return {
    // The adapter calls this on visibility changes AND at its one-second timer.
    // Supply document visibility too, so background tabs do not earn timed views.
    visibility(ratio, documentVisible = true) {
      if (!eligible() || !documentVisible || !Number.isFinite(ratio) || ratio < .5) {
        visibleSince = null;
        return;
      }
      const now = clock();
      if (visibleSince === null) visibleSince = now;
      if (now - visibleSince >= 1000) exposure();
    },
    activate() {
      if (!eligible() || clicked) return;
      if (!exposure()) return;
      // Consent could be revoked synchronously by the exposure adapter.
      if (!eligible()) return;
      clicked = send('growth_outbound_click', Object.freeze({ ...payload, destination_id: 'readwise' }));
    },
    consentChanged() { visibleSince = null; },
    // Dispose on navigation; create a fresh instance for a new document lifecycle.
    // BFCache restoration of the same document keeps this instance and its flags.
    dispose() { disposed = true; visibleSince = null; },
  };
}
