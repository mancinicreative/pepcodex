# Phase 5: Retrospective — PepCodex v4.0

**Skill:** `/retrospective`
**Date:** 2026-02-12
**Evaluator:** Studio Pipeline

---

## v4.0 Summary

PepCodex v4.0 shipped a comprehensive evidence-based peptide research platform with **872 content files**, **48 page routes**, **29 components**, and **12 content collections**. The site serves as a research reference for biohackers and health-conscious individuals, built on Astro 5 + Tailwind CSS 4 + Vercel.

---

## What Went Well

### 1. Content Scale & Quality
- **872 content files** across 12 collections — exceeding all targets by 56%
- Comprehensive Zod schemas enforce data quality at build time
- Evidence-chained benefits provide unprecedented research transparency
- CLAUDE.md guardrails prevent content fabrication

### 2. Design System Cohesion
- Glass morphism design language is consistent across all 29 components
- CSS custom properties provide clean token system
- WCAG AA contrast compliance across all text/background combinations
- Single font family (Outfit) maintains visual consistency

### 3. SEO Architecture
- 8 structured data schema types for rich results
- Comprehensive meta tags (OG, Twitter, canonical, robots)
- FAQ schema on dossiers and comparisons for search visibility
- Sitemap generation, redirect management, Search Console verification

### 4. Content Architecture
- 12 typed content collections with validated schemas
- Cross-linking system between content types
- Evidence grading built into data model
- Source citation requirements enforced at schema level

### 5. Minimal Technical Footprint
- Only 11 npm packages — lean dependency tree
- No React/Vue/Svelte runtime — pure Astro server components
- Zero client-side JS for most pages (Astro islands architecture)

---

## What Needs Improvement

### 1. Security (BLOCKER — Score: 1/4)
- No security headers shipped at all (CSP, HSTS, X-Frame-Options)
- API endpoints have no rate limiting or CSRF protection
- Health endpoint leaks configuration information
- CORS is fully permissive (`*`)

**Lesson: ALWAYS add security headers before first deploy. Security should be Phase 0, not Phase 4.**

### 2. Performance (FAIL — Score: 2/4)
- SSR for 886 static routes wastes server resources and adds latency
- Google Fonts loaded via render-blocking `@import`
- Image optimization configured but never utilized
- No font preloading or preconnect hints

**Lesson: ALWAYS configure output mode correctly from the start. Static sites should use static output.**

### 3. Accessibility (FAIL — Score: 2/4)
- No skip navigation link
- No `prefers-reduced-motion` support
- BreadcrumbSchema missing from 7 of 10 layouts
- Missing `aria-current="page"` on active nav items
- Mobile menu lacks focus trap and ESC dismiss

**Lesson: ALWAYS include accessibility basics in the base layout template before building content layouts.**

### 4. Navigation & Discoverability
- 6 of 12 content types only accessible via footer
- Header search icon is non-functional
- Cmd+K shortcut only works on homepage
- No content type filtering on index pages

**Lesson: ALWAYS audit navigation against content inventory. Every content type deserves a nav path.**

### 5. Content Consistency
- Two different evidence grading scales (evidenceStrength vs evidenceLevel)
- Two different source formats (object vs array)
- Some collections missing source fields entirely (guides, safety)

**Lesson: ALWAYS define content schemas holistically before creating individual collections.**

---

## Coverage Table: Planned vs Shipped vs Deferred

| Area | Planned | Shipped | Deferred | Dropped |
|---|---|---|---|---|
| **Content Collections** | 12 | 12 | 0 | 0 |
| **Content Files** | ~560 | 872 | 0 | 0 |
| **Core UI Features** | 24 | 24 | 0 | 0 |
| **Security Features** | 4 | 0 | 4 | 0 |
| **Performance Optimizations** | 4 | 1 | 3 | 0 |
| **Accessibility Features** | 3 | 1 | 2 | 0 |
| **SEO Features** | 9 | 9 | 0 | 0 |
| **Legal/Compliance** | 11 | 11 | 0 | 0 |
| **Enhancement Features** | 8 | 5 | 3 | 0 |
| **TOTAL** | 75 | 63 | 12 | 0 |

**Coverage: 63/75 = 84% shipped, 12 deferred (all in security/performance/accessibility)**

---

## Lessons Learned (ALWAYS/NEVER Format)

### Security
- ALWAYS add security headers (CSP, HSTS, X-Frame-Options) in the first deploy configuration
- NEVER expose internal configuration via health endpoints
- ALWAYS restrict CORS to the actual domain, never use `*` in production
- ALWAYS add rate limiting to any public API endpoint
- NEVER ship an API route without considering abuse scenarios

### Performance
- ALWAYS match the Astro output mode to the content type (static for content, server for API)
- ALWAYS use `<link rel="preload">` for web fonts, never CSS `@import url()`
- NEVER load more font weights than actually used in the design
- ALWAYS verify that configured optimizations (imageService) are actually utilized

### Accessibility
- ALWAYS include a skip navigation link in the base layout
- ALWAYS add `prefers-reduced-motion` support when using animations
- ALWAYS include breadcrumbs on all content pages, not just some
- NEVER ship a navigation element without proper ARIA attributes

### Architecture
- ALWAYS define content schemas holistically before individual collections
- ALWAYS use dynamic routes (`[category].astro`) instead of hardcoded category pages
- NEVER leave empty collections or dead code in production
- ALWAYS validate slug cross-references at build time

### Content
- ALWAYS use the same evidence grading scale across all content types
- ALWAYS include source citation fields in every content schema
- NEVER hardcode statistics that can be computed from content collections

---

## Phase Scores Summary

| Phase | Score | Status |
|---|---|---|
| Phase 1: Discover & Define | PRD 78%, UX 62.5% | PASS |
| Phase 2: Architect & Design | Architecture 75%, Brand PASS, Content 81% | PASS |
| Phase 3: Build | Code 69%, Design PASS, Motion 71% | PASS |
| Phase 4: Harden & Ship | **Overall 62.5%** (target 75%) | **FAIL** |

### Quality Scorecard Final

| Dimension | Score | Phase 4 Min | Status |
|---|---|---|---|
| Functional | 3 | 3 | PASS |
| Performance | 2 | 3 | FAIL |
| Usability | 3 | 3 | PASS |
| Accessibility | 2 | 3 | FAIL |
| Security | 1 | 3 | **BLOCKER** |
| Reliability | 3 | 3 | PASS |
| Maintainability | 3 | 2 | PASS |
| UX/Polish | 3 | 3 | PASS |

**Overall: 20/32 = 62.5% → Need 24/32 (75%) to pass**

---

## Gate Assessment

- [x] v4.0 retrospective covers all phases
- [x] What went well / what needs improvement documented
- [x] Lessons in ALWAYS/NEVER format
- [x] Coverage table: planned vs shipped vs deferred
- [x] Iteration plan written (see ROADMAP.md)

**Phase 5 Retrospective Gate: PASS**
