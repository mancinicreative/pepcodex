/** Basic consent mode: no Google tag is loaded until analytics is accepted. */
export function initializeAnalytics(config, win) {
  const key = 'pepcodex_cookie_consent';
  const id = String(config.measurementId || '').trim();
  const enabled = config.environment === 'production'
    && config.hostnames.includes(win.location.hostname)
    && /^G-[A-Z0-9]+$/.test(id);
  let consent = false;
  let configured = false;
  const denied = {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied',
  };
  function readConsent() {
    try {
      const saved = JSON.parse(win.localStorage.getItem(key) || 'null');
      const age = Date.now() - saved?.timestamp;
      if (typeof saved?.analytics === 'boolean' && Number.isFinite(age) && age >= 0 && age < 365 * 86400000) return saved;
    } catch { /* unavailable or invalid storage */ }
    return null;
  }
  function clearCookies() {
    const domains = ['', win.location.hostname, '.pepcodex.com'];
    for (const cookie of win.document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (!/^_(ga|gid|gat)(_|$)/.test(name)) continue;
      for (const domain of domains) {
        win.document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''}`;
      }
    }
  }
  function setConsent(value) {
    consent = value === true;
    win.dispatchEvent?.(new CustomEvent('pepcodex:analytics-consent', { detail: { analytics: consent && enabled } }));
    if (!enabled) return;
    win[`ga-disable-${id}`] = !consent;
    win.gtag('consent', 'update', { ...denied, analytics_storage: consent ? 'granted' : 'denied' });
    if (!consent) { clearCookies(); return; }
    if (configured) return;
    configured = true;
    win.gtag('js', new Date());
    let referrer = '';
    try { referrer = new URL(win.document.referrer).origin; } catch { /* no valid referrer */ }
    win.gtag('config', id, {
      page_location: win.location.origin + (config.pagePath || win.location.pathname),
      page_referrer: referrer,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    const script = win.document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    win.document.head.appendChild(script);
  }
  // Every custom event uses this guard, including events after a denied choice.
  win.pepcodexAnalytics = {
    setConsent,
    readConsent,
    track(name, params = {}) {
      if (!enabled || !consent || !configured) return false;
      const safeParams = { ...params };
      if ('page_path' in safeParams) safeParams.page_path = config.pagePath || win.location.pathname;
      if ('page_location' in safeParams) safeParams.page_location = win.location.origin + (config.pagePath || win.location.pathname);
      if ('page_referrer' in safeParams) {
        try { safeParams.page_referrer = new URL(String(safeParams.page_referrer)).origin; }
        catch { safeParams.page_referrer = ''; }
      }
      win.gtag('event', name, safeParams);
      return true;
    },
  };
  if (!enabled) return;
  win.dataLayer = win.dataLayer || [];
  win.gtag = function () { win.dataLayer.push(arguments); };
  win.gtag('consent', 'default', denied);
  const saved = readConsent();
  if (saved) setConsent(saved.analytics);
  const synchronizeConsent = () => setConsent(readConsent()?.analytics === true);
  win.addEventListener('storage', event => {
    if (event.key === key || event.key === null) synchronizeConsent();
  });
  win.addEventListener('focus', synchronizeConsent);
  win.addEventListener('pageshow', synchronizeConsent);
}
