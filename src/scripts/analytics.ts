/**
 * GA4 Custom Event Tracking for PepCodex
 * Loaded in BaseLayout — tracks key user interactions.
 */

function track(name: string, params: Record<string, unknown>) {
  window.pepcodexAnalytics?.track(name, params);
}

// Track search usage (Pagefind)
function trackSearch() {
  // Target the real search field rendered by src/components/SearchModal.astro.
  // The previous selectors (`#search-modal input[type="search"]`, `.pagefind-ui__search-input`)
  // matched nothing — that overlay is `#search-modal-overlay` and the Pagefind default UI is unused.
  const searchInput = document.querySelector('#modal-search-input') as HTMLInputElement | null;
  if (!searchInput) return;

  let debounce: ReturnType<typeof setTimeout>;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      if (searchInput.value.length >= 3) {
        // Free text can contain personal health information; measure use, not the query.
        track('site_search_used', {});
      }
    }, 1000);
  });
}

// Track comparison clicks
function trackComparisons() {
  document.querySelectorAll('a[href*="/compare/"]').forEach((link) => {
    link.addEventListener('click', () => {
      const href = (link as HTMLAnchorElement).pathname;
      const comparison = href.split('/compare/')[1]?.replace(/\/$/, '') || 'unknown';
      track('comparison_click', { comparison_slug: comparison });
    });
  });
}

// Track external link clicks
function trackExternalLinks() {
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    const anchor = link as HTMLAnchorElement;
    if (anchor.hostname === window.location.hostname || anchor.relList.contains('sponsored')) return;
    anchor.addEventListener('click', () => {
      track('external_link_click', {
        link_url: anchor.origin + anchor.pathname,
        link_domain: anchor.hostname,
        page_path: window.location.pathname,
      });
    });
  });
}

// Track scroll depth milestones
function trackScrollDepth() {
  const milestones = [25, 50, 75, 90];
  const reached = new Set<number>();

  function check() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    const percent = Math.round((window.scrollY / scrollHeight) * 100);

    for (const milestone of milestones) {
      if (percent >= milestone && !reached.has(milestone)) {
        reached.add(milestone);
        track('scroll_depth', {
          depth_percent: milestone,
          page_path: window.location.pathname,
        });
      }
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        check();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// Initialize all tracking after DOM is ready
function init() {
  trackSearch();
  trackComparisons();
  trackExternalLinks();
  trackScrollDepth();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
