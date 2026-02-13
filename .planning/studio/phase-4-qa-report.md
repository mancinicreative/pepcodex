# Phase 4: QA Report — Feature Map & Quality Scorecard

**Skill:** `/functional-qa`
**Date:** 2026-02-12
**Evaluator:** Studio Pipeline (retroactive)

---

## Feature Map

### Content Features

| ID | Feature | Status | Functional | Notes |
|---|---|---|---|---|
| F01 | Peptide dossiers (92) | Shipped | Yes | Full evidence chains, molecular data, interactions |
| F02 | Comparison pages (279) | Shipped | Yes | A-vs-B format with summaries |
| F03 | Blog system (151) | Shipped | Yes | 7 categories, sources, evidence levels |
| F04 | Glossary (215) | Shipped | Yes | Cross-linked to peptides and other terms |
| F05 | Guides (36) | Shipped | Yes | Topic-based educational content |
| F06 | Safety profiles (11) | Shipped | Yes | Dedicated layout and content |
| F07 | Calculator suite | Shipped | Yes | 3 types with per-peptide variants |
| F08 | Condition hubs (15) | Shipped | Yes | Condition-focused content aggregation |
| F09 | Protocols (3) | Shipped | Yes | Multi-peptide research overviews |
| F10 | Clinical trials tracker | Shipped | Yes | TrialTable component |
| F11 | Clinic directory (10) | Shipped | Partial | Thin data for 60 city pages |
| F12 | City landing pages (60) | Shipped | Yes | Local SEO coverage |

### Platform Features

| ID | Feature | Status | Functional | Notes |
|---|---|---|---|---|
| F13 | Search (Pagefind) | Shipped | Yes | Build-time index, works on all content |
| F14 | Search (API) | Shipped | Partial | Only indexes peptides, not all content |
| F15 | Newsletter subscribe | Shipped | Yes | Beehiiv API integration |
| F16 | Cookie consent | Shipped | Yes | Persistent dismissal |
| F17 | Disclaimer system | Shipped | Yes | Banner + dedicated pages |
| F18 | Mobile navigation | Shipped | Yes | Hamburger menu |
| F19 | Structured data (SEO) | Shipped | Yes | 8 schema types |
| F20 | Analytics (GA4 + Vercel) | Shipped | Yes | Dual tracking |
| F21 | Sitemap | Shipped | Yes | Auto-generated |
| F22 | 301 Redirects | Shipped | Yes | 14 redirects in vercel.json |

### UX Features

| ID | Feature | Status | Functional | Notes |
|---|---|---|---|---|
| F23 | Table of Contents | Shipped | Yes | 7 of 10 layouts |
| F24 | Breadcrumbs (visual) | Shipped | Partial | 3 of 10 layouts + 5 pages |
| F25 | Evidence badges | Shipped | Yes | Color-coded strength indicators |
| F26 | Interaction matrix | Shipped | Yes | Synergistic/compatible/caution/avoid |
| F27 | Molecular visualization | Shipped | Yes | Color-coded amino acid display |
| F28 | Quality checklist | Shipped | Yes | Expandable with animations |
| F29 | Timeline | Shipped | Yes | "What to expect" with fade-in |
| F30 | Header search icon | Shipped | No | Non-functional (no handler) |

---

## Functional Test Results

### Critical User Flows

| Flow | Steps | Result | Issues |
|---|---|---|---|
| Browse peptides | Homepage → Peptides → Dossier | PASS | — |
| Search peptide | Homepage → Pagefind search → Result | PASS | Header search icon broken |
| Read comparison | Homepage → Compare → Comparison page | PASS | No breadcrumbs |
| Subscribe newsletter | Any page → Newsletter form → Submit | PASS | No rate limiting |
| Browse by category | Homepage → Category card → Category page | PARTIAL | Only 3 of 7 categories have pages |
| Read blog | Homepage → Blog → Post | PASS | No prev/next navigation |
| Use calculator | Homepage → Calculator → Reconstitution | PASS | — |
| Find clinic | Homepage → Directory → City → Clinic | PASS | Thin clinic data |
| Read glossary | Footer → Glossary → Term | PASS | Not in main nav |
| Read guide | Footer → Guides → Guide | PASS | Not in main nav |

### Edge Cases

| Test | Result | Notes |
|---|---|---|
| 404 page | PASS | Custom 404 with navigation back |
| Invalid peptide slug | PASS | Redirects to 404 |
| Empty search results | PASS | Pagefind shows "no results" |
| Newsletter duplicate email | PASS | Returns "already subscribed" |
| Newsletter invalid email | PASS | Client-side validation |
| Cmd+K keyboard shortcut | PARTIAL | Only works on homepage |
| Mobile menu toggle | PASS | aria-expanded toggles correctly |
| Mobile menu close | PARTIAL | No close on outside click or ESC |

---

## Cross-Linking Integrity

### Content Reference Validation

| From | To | Mechanism | Integrity |
|---|---|---|---|
| Peptide → Comparisons | `comparators` slug array | Assumed valid (build would fail on invalid slugs if queried) |
| Peptide → Conditions | `conditions` array with slugs | Programmatic page generation |
| Blog → Peptides | `relatedPeptides` slug array | Display only (no build-time validation) |
| Blog → Glossary | `relatedGlossary` slug array | Display only (no build-time validation) |
| Glossary → Peptides | `relatedPeptides` slug array | Display only |
| Glossary → Glossary | `relatedTerms` slug array | Display only |
| Guide → Peptide | `peptide` slug (optional) | Display only |

**Concern:** Slug references in blog, glossary, and guide collections are not validated at build time. A typo in a slug would create a broken cross-link without error. The `comparators` field on peptides and the `conditions` array likely have the same issue.

**Recommendation:** Add build-time validation that all slug references resolve to actual content entries.

---

## Quality Scorecard

### Scoring (0-4 scale per quality-gates.md)

| Dimension | Score | Phase 4 Min | Status | Evidence |
|---|---|---|---|---|
| **Functional** | 3 | 3 | PASS | All core features work, minor issues (search icon, 3/7 categories) |
| **Performance** | 2 | 3 | FAIL | SSR waste, render-blocking fonts (see performance audit) |
| **Usability** | 3 | 3 | PASS | Good content depth, navigation gaps identified |
| **Accessibility** | 2 | 3 | FAIL | No skip-link, no prefers-reduced-motion, missing ARIA |
| **Security** | 1 | 3 | BLOCKER | No security headers, no rate limiting, info leakage |
| **Reliability** | 3 | 3 | PASS | Stable build, graceful error handling, Vercel uptime |
| **Maintainability** | 3 | 2 | PASS | Clean architecture, Zod schemas, minimal deps |
| **UX/Polish** | 3 | 3 | PASS | Cohesive design, glass morphism, good component library |

### Score Calculation

| Dimension | Score | Weight | Weighted |
|---|---|---|---|
| Functional | 3 | 1 | 3 |
| Performance | 2 | 1 | 2 |
| Usability | 3 | 1 | 3 |
| Accessibility | 2 | 1 | 2 |
| Security | 1 | 1 | 1 |
| Reliability | 3 | 1 | 3 |
| Maintainability | 3 | 1 | 3 |
| UX/Polish | 3 | 1 | 3 |

**Total: 20/32 = 62.5%**
**Target: 75% (24/32)**
**Gap: 4 points needed**

### Path to 75%

To reach 75% (24/32), need +4 points. Minimum fixes:

| Dimension | Current | Target | Fix Required |
|---|---|---|---|
| Security | 1 → 3 | +2 | Add security headers + rate limiting + fix health endpoint |
| Performance | 2 → 3 | +1 | Switch to static output + fix font loading |
| Accessibility | 2 → 3 | +1 | Add skip-link + prefers-reduced-motion + breadcrumbs |

This brings total to **24/32 = 75%** — exactly at threshold.

---

## Blocker Assessment

Per `quality-gates.md` blocker rules:

1. **Any dimension at 0** = stop and fix immediately → No dimension at 0 ✓
2. **Overall score < 75%** at Phase 4 gate = rework required → **62.5% < 75% = REWORK REQUIRED** ✗
3. **Security at 0 or 1** at Phase 4 = absolute blocker → **Security at 1 = ABSOLUTE BLOCKER** ✗
4. **Functional at 0** at any phase = absolute blocker → Functional at 3 ✓

---

## Bug Register

| ID | Severity | Description | Component |
|---|---|---|---|
| BUG-001 | Medium | Header search icon non-functional | BaseLayout |
| BUG-002 | Low | Homepage stats hardcoded (45+ vs actual 92) | index.astro |
| BUG-003 | Low | Cmd+K shortcut only works on homepage | index.astro script |
| BUG-004 | Low | Mobile menu doesn't close on outside click | BaseLayout |
| BUG-005 | Low | Shiki theme `github-light` on dark site | astro.config.mjs |
| BUG-006 | Info | Empty `pages` collection defined but unused | config.ts |

---

## Gate Assessment

- [x] Feature map complete (30 features assessed)
- [x] Critical user flows tested
- [x] Cross-linking integrity evaluated
- [x] Quality scorecard completed with evidence
- [x] Blocker rules applied
- [ ] Overall score >= 75% — **FAILS (62.5%)**
- [ ] Security >= 3 — **FAILS (1/4 BLOCKER)**

**Phase 4 QA Gate: FAIL**
**Blockers:** Security (1/4), Performance (2/4), Accessibility (2/4)
**Required actions before v5.0 ship:**
1. Security headers + rate limiting + health endpoint fix → Security 1→3
2. Static output + font preloading → Performance 2→3
3. Skip-link + prefers-reduced-motion → Accessibility 2→3
