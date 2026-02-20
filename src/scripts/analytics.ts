/**
 * GA4 Custom Event Tracking for PepCodex
 * Loaded in BaseLayout — tracks key user interactions.
 */

declare global {
  function gtag(...args: unknown[]): void;
}

// Track search usage (Pagefind)
function trackSearch() {
  const searchInput = document.querySelector('#search-modal input[type="search"], .pagefind-ui__search-input') as HTMLInputElement | null;
  if (!searchInput) return;

  let debounce: ReturnType<typeof setTimeout>;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      if (searchInput.value.length >= 3) {
        gtag('event', 'search', { search_term: searchInput.value });
      }
    }, 1000);
  });
}

// Track calculator interactions
function trackCalculators() {
  const calcForms = document.querySelectorAll('[data-calculator]');
  calcForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      const calcType = (e.currentTarget as HTMLElement).dataset.calculator || 'unknown';
      gtag('event', 'calculator_use', { calculator_type: calcType });
    });
  });

  // Also track calculate button clicks
  document.querySelectorAll('button[type="submit"]').forEach((btn) => {
    const form = btn.closest('[data-calculator]');
    if (form) {
      btn.addEventListener('click', () => {
        gtag('event', 'calculator_use', {
          calculator_type: (form as HTMLElement).dataset.calculator || 'unknown',
        });
      });
    }
  });
}

// Track comparison clicks
function trackComparisons() {
  document.querySelectorAll('a[href*="/compare/"]').forEach((link) => {
    link.addEventListener('click', () => {
      const href = (link as HTMLAnchorElement).pathname;
      const comparison = href.split('/compare/')[1]?.replace(/\/$/, '') || 'unknown';
      gtag('event', 'comparison_click', { comparison_slug: comparison });
    });
  });
}

// Track newsletter signups
function trackNewsletter() {
  document.querySelectorAll('form[action*="subscribe"], form[action*="newsletter"], [data-newsletter-form]').forEach((form) => {
    form.addEventListener('submit', () => {
      gtag('event', 'newsletter_signup', { location: window.location.pathname });
    });
  });
}

// Track external link clicks
function trackExternalLinks() {
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    const anchor = link as HTMLAnchorElement;
    if (anchor.hostname === window.location.hostname) return;
    anchor.addEventListener('click', () => {
      gtag('event', 'external_link_click', {
        link_url: anchor.href,
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
        gtag('event', 'scroll_depth', {
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
  if (typeof gtag === 'undefined') return;
  trackSearch();
  trackCalculators();
  trackComparisons();
  trackNewsletter();
  trackExternalLinks();
  trackScrollDepth();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
