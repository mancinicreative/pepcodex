# Phase 1: UX Assessment — User Flow Gaps & Persona Validation

**Skill:** `/ux-researcher`
**Date:** 2026-02-12
**Evaluator:** Studio Pipeline (retroactive)

---

## Primary User Personas

### Persona 1: The Researcher
**Who:** Biohackers, health-conscious individuals researching peptides
**Goal:** Find evidence-based information on specific peptides
**Frequency:** Weekly/monthly deep dives

**Flow assessment:**
1. Land on homepage → Search or browse categories → Read dossier → Check evidence chain → Read related comparisons
2. **Strength:** Deep content with evidence grading, molecular info, interaction matrices
3. **Gap:** No "save for later" or bookmarking. No personalized reading history.

### Persona 2: The Comparer
**Who:** People deciding between peptide options
**Goal:** Compare two or more peptides for their specific condition
**Frequency:** Occasional (decision-making phase)

**Flow assessment:**
1. Land on homepage → Navigate to comparisons → Find relevant A-vs-B → Read comparison → Read individual dossiers
2. **Strength:** 279 comparisons covering extensive combinations
3. **Gap:** No dynamic comparison tool (can only view pre-built comparisons). No comparison by condition filter.

### Persona 3: The Learner
**Who:** Newcomers to peptide research
**Goal:** Understand basic concepts and terminology
**Frequency:** Initial deep learning period

**Flow assessment:**
1. Land on homepage → Browse guides → Read glossary terms → Explore blog → Subscribe to newsletter
2. **Strength:** 215 glossary terms, 36 guides, 151 blog posts, clear evidence grading
3. **Gap:** No onboarding flow. No "start here" pathway. Glossary terms aren't auto-linked in dossier content.

### Persona 4: The Clinic Seeker
**Who:** People looking for peptide therapy clinics
**Goal:** Find a clinic near them
**Frequency:** One-time or periodic

**Flow assessment:**
1. Land on homepage → Navigate to Directory → Browse city pages → View clinic listings
2. **Strength:** 60 city pages, 10 clinic listings
3. **Gap:** Very thin clinic data (only 10 listings for 60 cities). No reviews, ratings, or verification badges in practice.

---

## User Flow Audit

### Flow 1: Peptide Research (Primary)

```
Homepage → Peptides Index → Peptide Dossier → Evidence Chain → Related Comparisons
                                            → Interaction Matrix
                                            → Timeline
                                            → Quality Checklist
                                            → Condition Pages (programmatic)
```

**Status:** COMPLETE
**Quality:** High — rich data, well-structured layouts, multiple data visualization components
**Issues:**
- BreadcrumbSchema missing on comparison pages (user loses context)
- No "related peptides" component on dossier pages (user must navigate back)
- Homepage stats say "45+ Peptide Dossiers" but there are actually 92

### Flow 2: Content Discovery

```
Homepage → Blog Index → Blog Post → Related Peptides → Dossier
                                   → Related Glossary Terms
         → Guide Index → Guide → Related Terms
         → Glossary Index → Glossary Term → Related Peptides
```

**Status:** COMPLETE
**Quality:** Good — cross-linking between content types exists
**Issues:**
- Blog layout has ToC but no breadcrumbs (user can't navigate back to index easily)
- Guide layout has ToC but no breadcrumbs
- No tag/category filtering on blog index
- No "next/previous" navigation between blog posts

### Flow 3: Calculator Usage

```
Homepage → Calculator Index → Reconstitution / Accumulation / Blend
                             → Per-Peptide Calculator (dynamic routes)
```

**Status:** COMPLETE
**Quality:** Good — three calculator types with peptide-specific variants
**Issues:**
- Calculator pages use RelatedEntities for cross-linking (good)
- No calculator results sharing/exporting

### Flow 4: Safety Research

```
Homepage → Safety Index → Safety Article → Related Peptides
```

**Status:** COMPLETE
**Quality:** Good — dedicated safety layout
**Issues:**
- SafetyLayout has ToC but no breadcrumbs
- Only 11 safety articles for 92 peptides (coverage gap)

### Flow 5: Search

```
Any Page → Click Search Icon / Cmd+K → Search Results → Navigate
```

**Status:** PARTIAL
**Quality:** Mixed
**Issues:**
- Search button in header is non-functional (no link, no onclick)
- Pagefind search (postbuild) is separate from the API search endpoint
- API search (`peptide-search.json`) only indexes peptides, not comparisons/blog/glossary
- Cmd+K shortcut only works on homepage (targets `#search-input`)

### Flow 6: Newsletter Subscription

```
Any Page → Newsletter CTA (homepage or footer) → Submit Email → Beehiiv API → Confirmation
```

**Status:** COMPLETE
**Quality:** Good — proper error handling, email validation
**Issues:**
- CORS is `Access-Control-Allow-Origin: *` (security concern, not UX)
- No rate limiting (potential for abuse)

---

## Navigation Assessment

### Desktop Navigation
- **Primary nav:** Peptides, Trials, Calculators, Blog, Directory
- **Right actions:** Search (icon), Contact (button), Subscribe (CTA)
- **Footer:** Browse, Research (7 links), Disclaimer, Legal (5 links), About/Methodology/Editorial

**Issues:**
- Compare, Glossary, Guides, Safety, Conditions, Protocols are only in footer — not in main nav
- Search icon in header appears to be non-functional (button with no handler)
- No mega-menu or dropdown for deep navigation
- Missing nav items for 6 of 12 content types

### Mobile Navigation
- Hamburger menu with same 5 links as desktop
- Contact + Subscribe buttons
- **Same gaps:** 6 content types only accessible via footer

### Accessibility (Navigation)
- Mobile menu uses `aria-expanded` correctly
- Missing `role="navigation"` on mobile nav container
- No skip-link to bypass navigation
- No `aria-current="page"` on active nav items
- Focus trap not implemented on mobile menu overlay

---

## Information Architecture Issues

### 1. Content Discoverability
The site has 12 content types but only 5 are in the main nav:
- **In nav:** Peptides, Trials, Calculators, Blog, Directory
- **Footer only:** Compare, Glossary, Guides, Safety, Conditions, Protocols
- **Not linked:** Bioregulators page

**Recommendation:** Add a "Research" dropdown or mega-menu with all content types

### 2. Cross-Linking Gaps
- Dossiers don't link to related dossiers (only comparisons and conditions)
- Blog posts reference peptides via `relatedPeptides` but rendering depends on layout
- Glossary terms reference `relatedPeptides` and `relatedTerms` — good
- No "recently viewed" or "popular" sections

### 3. Stale Data on Homepage
- Stats section shows "45+ Peptide Dossiers" — should be "90+"
- "950+ Cited Sources" — needs verification
- These should be dynamically generated from content collections

---

## UX Scorecard

| Dimension | Score (0-4) | Notes |
|---|---|---|
| Content depth | 4 | Exceptional — evidence chains, molecular data, interactions |
| Navigation | 2 | 6/12 content types hidden in footer only |
| Search | 2 | Search icon non-functional, Cmd+K homepage-only |
| Cross-linking | 3 | Good between related types, gaps between sibling content |
| Onboarding | 1 | No "start here", no progressive disclosure |
| Accessibility | 2 | Basic semantics present, missing skip-link/ARIA patterns |
| Mobile experience | 3 | Responsive layout, but same nav gaps as desktop |
| Error handling | 3 | 404 page exists, API errors handled gracefully |

**Overall UX Score: 20/32 = 62.5%**

---

## Priority Recommendations for v5.0

1. **Fix search functionality** — Make header search icon work, extend search to all content types
2. **Improve navigation** — Add dropdown/mega-menu for all 12 content types
3. **Add breadcrumbs everywhere** — Currently missing from 7 layouts
4. **Update homepage stats** — Make dynamic or update hardcoded values
5. **Add skip navigation link** — Accessibility requirement
6. **Improve onboarding** — "Start Here" guide for newcomers
7. **Blog navigation** — Add category filtering, next/previous posts

---

## Gate Assessment

- [x] User flows mapped for all primary personas
- [x] Navigation gaps identified
- [x] Content discoverability issues documented
- [x] Accessibility gaps flagged
- [x] Priority recommendations for v5.0 listed

**Phase 1 UX Gate: PASS (with noted issues for v5.0)**
