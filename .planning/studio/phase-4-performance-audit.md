# Phase 4: Performance Audit — Lighthouse, CWV & Optimization Plan

**Skill:** `/performance-engineer`
**Date:** 2026-02-12
**Evaluator:** Studio Pipeline (retroactive)

---

## Executive Summary

PepCodex has **significant performance optimization opportunities**. The site uses SSR for pages that should be statically pre-rendered, loads Google Fonts via render-blocking CSS `@import`, has image optimization configured but unused, and runs on a serverless architecture that adds cold-start latency. Current performance score: **2/4 (FAIL)**.

---

## Architecture Performance Analysis

### Output Mode: Server (SSR) — THE #1 ISSUE

**Current:** `output: 'server'` in `astro.config.mjs`
**Impact:** Every page request triggers a serverless function invocation on Vercel.

| Page Type | Count | Should Be | Current | Wasted SSR |
|---|---|---|---|---|
| Static content pages | 15 | Static | SSR | Yes |
| Peptide dossiers | 92 routes | Static | SSR | Yes |
| Comparison pages | 279 routes | Static | SSR | Yes |
| Blog posts | 151 routes | Static | SSR | Yes |
| Glossary terms | 215 routes | Static | SSR | Yes |
| Guide pages | 36 routes | Static | SSR | Yes |
| Safety pages | 11 routes | Static | SSR | Yes |
| Calculator pages | 6 routes | Static | SSR | Yes |
| Category pages | 3 routes | Static | SSR | Yes |
| City pages | 60 routes | Static | SSR | Yes |
| Condition pages | 15 routes | Static | SSR | Yes |
| Protocol pages | 3 routes | Static | SSR | Yes |
| Clinic pages | 10 routes | Static | `prerender: true` | No |
| **API routes** | **3 routes** | **SSR** | **SSR** | **No** |
| **Total wasted** | **~886 routes** | — | — | **Yes** |

**Fix:** Switch to `output: 'static'` or `output: 'hybrid'`. Only 3 API routes need SSR.

**Expected improvement:**
- TTFB: 200-500ms → ~50ms (CDN edge cached)
- Vercel function invocations: ~100% reduction
- Cold start latency: Eliminated for content pages

### Prerender Analysis

Currently only 2 files set `prerender: true`:
1. `api/peptide-search.json.ts`
2. `clinics/[city].astro`

All other pages including `getStaticPaths()` pages are SSR despite having static path generation. This is because `output: 'server'` overrides `getStaticPaths()` to serve dynamically.

---

## Font Loading Performance

### Current: Render-Blocking @import

```css
/* global.css line 1 */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
```

**Issues:**
1. `@import` in CSS is render-blocking — browser must download CSS, discover the import, then download the font CSS, then download font files
2. Loading 6 weights (300-800) when only 4-5 are used in practice
3. No font preloading hints
4. No `font-display: swap` override (Google uses `display=swap` in URL but this is a secondary fetch)

### Recommended Fix

```html
<!-- In BaseLayout.astro <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" />
```

Then remove the `@import` from `global.css`.

**Expected improvement:**
- FCP: 100-300ms improvement
- LCP: 100-200ms improvement (text is LCP element on most pages)

---

## Image Optimization

### Current State
- `imageService: true` in Vercel adapter configuration
- **No `<Image>` or `<Picture>` components used anywhere**
- No image optimization is actually happening
- Site appears to have minimal images (SVG icons, no photographs)

### Assessment
The site is text-heavy with SVG icons. Image optimization is less critical than for image-heavy sites, but should be configured for any future image additions.

---

## JavaScript Bundle Analysis

### Client-Side JavaScript

| Source | Size (est.) | Purpose |
|---|---|---|
| GA4 script | ~90KB | Analytics |
| Pagefind UI | ~20KB | Search functionality |
| Mobile menu | <1KB | Toggle hamburger menu |
| Cmd+K handler | <1KB | Search keyboard shortcut |
| ToC generator | <1KB | Client-side heading extraction |
| Cookie consent | <1KB | Dismiss/accept handler |
| Disclaimer banner | <1KB | Dismiss handler |
| Calculator logic | ~5KB | Interactive calculation forms |
| Vercel Analytics | ~5KB | Web vitals tracking |

**Total estimated client JS: ~125KB** (mostly third-party analytics)

**Assessment:** Lean JavaScript footprint. Astro's zero-JS-by-default approach is well-utilized. No React/Vue/Svelte runtime overhead.

---

## CSS Performance

### Current State
- Single `global.css` file (439 lines)
- Tailwind CSS v4 with utility-first approach
- No CSS code splitting
- Inline styles used for CSS custom properties (`style="color: var(--text-medium)"`)

### Assessment
- 439 lines is manageable — no CSS bloat
- Tailwind's tree-shaking removes unused utilities at build time
- No CSS-in-JS overhead
- Legacy aliases add ~40 lines of dead CSS

---

## Core Web Vitals Estimates

Based on architecture analysis (not live measurement):

| Metric | Estimated | Target | Status |
|---|---|---|---|
| **LCP** | 1.5-2.5s (SSR) → <1s (static) | <2.5s | BORDERLINE → GOOD with fix |
| **FID/INP** | <100ms | <200ms | GOOD (minimal JS) |
| **CLS** | <0.05 | <0.1 | GOOD (no layout shifts expected) |
| **FCP** | 1-2s (SSR + font) → <0.5s (static + preload) | <1.8s | BORDERLINE → GOOD with fix |
| **TTFB** | 200-500ms (SSR cold) → <50ms (CDN) | <800ms | OK → EXCELLENT with fix |

**Note:** These are estimates based on architecture. Actual measurement requires Lighthouse testing on the live site.

---

## Optimization Roadmap

### P0 — Immediate (biggest wins)

| Fix | Impact | Effort |
|---|---|---|
| Switch to `output: 'static'` (or `'hybrid'`) | TTFB: 500ms → 50ms, eliminates SSR for 886 routes | Low (config change + add `prerender: false` to 3 API files) |
| Move font import to `<link rel="preload">` | FCP: 100-300ms improvement | Low (modify BaseLayout + global.css) |
| Remove render-blocking `@import` from CSS | Unblock first paint | Low (part of font fix) |

### P1 — v5.0 Release

| Fix | Impact | Effort |
|---|---|---|
| Reduce font weights (6 → 4) | ~30% smaller font download | Low |
| Add `preconnect` hints for GA, fonts | Reduce connection setup time | Low |
| Remove legacy CSS aliases | ~40 lines less CSS | Low |
| Self-host fonts | Eliminate third-party dependency | Medium |

### P2 — Future Optimization

| Fix | Impact | Effort |
|---|---|---|
| Implement image optimization | Ready for image-heavy content | Medium |
| Add service worker for offline | Offline capability for research | Medium |
| Consider ISR for frequently updated content | Fresh content with CDN speed | Medium |
| Bundle analysis tooling | Track size over time | Low |

---

## Performance Score

| Dimension | Score (0-4) | Notes |
|---|---|---|
| TTFB / server response | 1 | SSR for static content is wasteful |
| First paint | 2 | Render-blocking font import |
| Interactivity | 4 | Minimal client-side JS |
| Visual stability | 4 | No layout shifts detected |
| Asset optimization | 2 | Fonts not preloaded, images not optimized |
| Bundle size | 3 | Lean, but analytics adds weight |
| Caching strategy | 1 | SSR prevents CDN edge caching |

**Overall Performance: 17/28 = 61% — FAIL (below 75% threshold)**

The performance dimension scores **2/4** on the quality scorecard.

---

## Gate Assessment

- [x] Architecture performance analyzed
- [x] Font loading issues identified
- [x] CWV estimates provided
- [x] Optimization roadmap with priorities
- [ ] Performance score meets Phase 4 minimum (3/4) — **FAILS**

**Phase 4 Performance Gate: FAIL**
**Action Required:** Switch to static output and fix font loading before v5.0 can ship.
