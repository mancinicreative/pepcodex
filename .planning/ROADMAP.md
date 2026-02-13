# Roadmap: PepCodex

## Overview

v5.0 Hardening & Enhancement — Fix security blockers, optimize performance, improve accessibility, and deploy deferred UX features. Preceded by v4.0 Content Expansion (1,048+ URLs shipped).

## Milestones

### v1.0 Content Foundation (COMPLETE)
- [x] **Phase 1: Site Foundation** - Fix build, complete core site structure
- [x] **Phase 2: Content Templates** - Full dossier template, comparison/guide templates
- [x] **Phase 3: Pipeline Infrastructure** - n8n workflows for automated content generation
- [x] **Phase 4: Features + Polish** - Search, trial tracker, sponsor pages
- [x] **Phase 5: First Content Batch** - 188 pages indexed (exceeded 45 target)

### v2.0 Production Launch (COMPLETE)
- [x] **Phase 6: Deploy Infrastructure** - GitHub, Vercel, DNS, development workflow
- [x] **Phase 7: Analytics Setup** - GA4, Google Search Console
- [ ] **Phase 8: Production Verification** - Test all features on live site (partial)

### v3.0 Operations & Growth (ON HOLD)
*Paused to prioritize v4.0 content expansion. Resume after v4.0.*
- [ ] **Phase 9: Operations Infrastructure** - Templates, calendars, SOPs
- [ ] **Phase 10: Content Production System** - Batch workflow, repurposing
- [ ] **Phase 11: Distribution System** - Instagram, email capture, newsletters
- [ ] **Phase 12: Monetization Foundation** - Directory, pricing, outreach

### v4.0 Content Expansion (COMPLETE)
- [x] **Phase 23: Comparisons Batch 1 + Condition Hubs** - 55 comparisons + 15 condition hubs
- [x] **Phase 24: Schema Deployments** - FAQ, HowTo, Drug schema markup
- [x] **Phase 25: Glossary Expansion** - 116 new glossary terms
- [x] **Phase 26: Bioregulators Batch 1** - 10 Khavinson peptide dossiers + category page
- [x] **Phase 27: Bioregulators Batch 2** - 10 more bioregulator dossiers
- [x] **Phase 28: Weekly News Blog** - 78 backdated news posts (6 months)
- [x] **Phase 28.1: QA Audit** - Evidence level audit + comparison accuracy fixes
- [x] **Phase 29: Comparisons Batch 2 + Calculators** - 179 comparisons + 144 calculator URLs

### v5.0 Hardening & Enhancement (PLANNED)
*Informed by Full Studio Pipeline Evaluation (2026-02-12). Quality scorecard: 62.5% → target 75%.*

#### Phase A: Security Hardening (BLOCKER — must fix first)
- [ ] **SEC-001: Security headers** — Add CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy to vercel.json
- [ ] **SEC-002: Rate limiting** — Add rate limiting to `/api/subscribe` (Vercel Edge Middleware or Upstash)
- [ ] **SEC-003: Health endpoint** — Remove config info exposure from `/api/health`
- [ ] **SEC-004: CORS restriction** — Change `Access-Control-Allow-Origin: *` to `https://pepcodex.com`
- [ ] **SEC-005: Bot protection** — Add honeypot field to newsletter form

#### Phase B: Performance Optimization (score 2→3)
- [ ] **PERF-001: Static output** — Switch `output: 'server'` → `'static'` (or `'hybrid'`), add `prerender: false` to 3 API routes
- [ ] **PERF-002: Font loading** — Move `@import url()` to `<link rel="preload">` in BaseLayout, add preconnect hints
- [ ] **PERF-003: Font optimization** — Reduce from 6 weights (300-800) to 4 weights (400-700)
- [ ] **PERF-004: Shiki theme** — Change `github-light` → `github-dark` or `one-dark-pro`
- [ ] **PERF-005: Dead CSS** — Remove legacy aliases (`.glass-panel`, `.glass-card-default`, etc.)

#### Phase C: Accessibility Fixes (score 2→3)
- [ ] **A11Y-001: Skip navigation** — Add skip-link to BaseLayout before `<nav>`
- [ ] **A11Y-002: Reduced motion** — Add `@media (prefers-reduced-motion)` to global.css
- [ ] **A11Y-003: Breadcrumbs** — Deploy BreadcrumbSchema to all 10 layouts
- [ ] **A11Y-004: ARIA improvements** — Add `aria-current="page"`, focus trap on mobile menu, ESC to close
- [ ] **A11Y-005: Mobile menu animation** — Add slide/fade transition instead of instant toggle

#### Phase D: Navigation & UX (score 3→4)
- [ ] **UX-001: Fix search icon** — Wire header search button to Pagefind or scroll to SearchBar
- [ ] **UX-002: Extend Cmd+K** — Make keyboard shortcut work on all pages
- [ ] **UX-003: Navigation dropdown** — Add "Research" dropdown with all 12 content types
- [ ] **UX-004: Dynamic categories** — Replace 3 hardcoded category pages with `[category].astro` covering all 7
- [ ] **UX-005: Blog filtering** — Add category filter UI to blog index
- [ ] **UX-006: Homepage stats** — Generate from content collections at build time

#### Phase E: Content Quality (deferred enhancements)
- [ ] **CONTENT-001: Unify evidence scales** — Pick one scale across all collections
- [ ] **CONTENT-002: Source fields** — Add sources to guides and safety collections
- [ ] **CONTENT-003: Cross-link validation** — Build-time slug reference validation
- [ ] **CONTENT-004: Glossary auto-linking** — Remark/rehype plugin for auto-linking terms
- [ ] **CONTENT-005: Safety coverage** — Expand from 11 to 30+ safety articles

#### Phase F: Feature Enhancements (from original v5.0 plan)
- [ ] **FEAT-001: Content migration** — Guides/safety → blog with redirects
- [ ] **FEAT-002: Protocol expansion** — Expand from 3 to 15+ protocols
- [ ] **FEAT-003: Clinic expansion** — Expand from 10 to 50+ clinic listings
- [ ] **FEAT-004: Related peptides** — Add related dossier suggestions to DossierLayout
- [ ] **FEAT-005: Blog navigation** — Add prev/next post navigation

### v6.0 Growth & Monetization (DEFERRED)
*Resume v3.0 operations work + new growth features.*
- [ ] **Phase 9: Operations Infrastructure** — Templates, calendars, SOPs
- [ ] **Phase 10: Content Production System** — Batch workflow, repurposing
- [ ] **Phase 11: Distribution System** — Instagram, email capture, newsletters
- [ ] **Phase 12: Monetization Foundation** — Directory, pricing, outreach

---

## v4.0 Phase Details

### Phase 23: Comparisons Batch 1 + Condition Hubs
**Goal**: URL multiplication with highest-value comparison pages and condition hubs
**Requirements**: COMP-01, COND-01 through COND-16 (17 requirements)
**Success Criteria**:
1. All 55 high-priority comparisons build successfully
2. ConditionLayout template created and working
3. All 15 condition hubs link to relevant peptide dossiers
4. Internal cross-linking verified

**Deliverables**:
- 55 comparison pages (GLP-1, GH, healing, cognitive categories)
- `ConditionLayout.astro` template
- 15 condition hub pages (weight-loss, muscle-growth, healing, etc.)
- Cross-links to peptide dossiers

**High-Priority Comparison Pairs**:
- GLP-1: retatrutide-vs-tirzepatide, survodutide-vs-semaglutide, mazdutide-vs-semaglutide
- Growth Hormone: ghrp-6-vs-ghrp-2, tesamorelin-vs-sermorelin, cjc-1295-vs-sermorelin
- Healing: bpc-157-vs-tb-500, bpc-157-vs-ghk-cu, tb-500-vs-thymosin-alpha-1
- Cognitive: semax-vs-na-semax-amidate, selank-vs-na-selank-amidate, dihexa-vs-semax
- Bioregulators: epithalon-vs-pinealon, thymalin-vs-thymogen

---

### Phase 24: Schema Deployments
**Goal**: SERP feature eligibility through structured data
**Requirements**: SCHEMA-01 through SCHEMA-06 (6 requirements)
**Depends on**: Phase 23 (comparisons for FAQs)
**Success Criteria**:
1. FAQSchema deployed to top 20 peptide dossiers
2. HowToSchema deployed to all 3 calculators
3. DrugSchema deployed to all peptide dossiers
4. Google Rich Results Test passes for sample pages

**Deliverables**:
- FAQ frontmatter added to top 20 peptides
- `HowToSchema.astro` component
- `DrugSchema.astro` component
- Schema validation passing

---

### Phase 25: Glossary Expansion
**Goal**: Authority building through comprehensive terminology coverage
**Requirements**: GLOSS-01 through GLOSS-05 (5 requirements)
**Depends on**: None
**Success Criteria**:
1. All 141 new glossary terms created
2. Terms follow existing glossary MDX format
3. Cross-links to relevant dossiers included
4. Build completes without errors

**Deliverables**:
- 40 mechanism terms (receptor agonism, signal transduction, etc.)
- 20 study type terms (meta-analysis, RCT, cohort, etc.)
- 30 peptide terms (bioavailability, reconstitution, etc.)
- 20 regulatory terms (IND, NDA, Phase I/II/III, etc.)
- 31 chemistry terms (amino acid, N-terminus, etc.)

---

### Phase 26: Bioregulators Batch 1
**Goal**: Establish niche authority with Khavinson peptide coverage
**Requirements**: BIOREG-01 through BIOREG-10, BIOREG-21 (12 requirements)
**Depends on**: None
**Success Criteria**:
1. 10 bioregulator dossiers follow existing template structure
2. Evidence limitations properly flagged (small trials, non-indexed sources)
3. Russian/CIS sources cited with appropriate trust labeling
4. Bioregulators category page links to all entries

**Deliverables**:
- Vilon dossier (thymus dipeptide Lys-Glu)
- Prostatilen dossier (prostate peptide complex)
- Retinalamin dossier (retinal peptide)
- Livagen dossier (liver tripeptide)
- Kristagen dossier (immune tripeptide)
- Vesugen dossier (vascular tripeptide)
- Cardiogen dossier (cardiac tripeptide)
- Bronchogen dossier (bronchial tripeptide)
- Chonluten dossier (GI tract tripeptide)
- Testagen dossier (testicular tripeptide)
- `/bioregulators` category page

**Research Sources**:
- PubMed/Europe PMC for indexed studies
- Khavinson publications (khavinson.info/publications)
- Search terms: "пептидные биорегуляторы", "Хавинсон пептиды"

---

### Phase 27: Bioregulators Batch 2
**Goal**: Complete bioregulator module
**Requirements**: BIOREG-11 through BIOREG-20 (10 requirements)
**Depends on**: Phase 26 (category page exists)
**Success Criteria**:
1. 10 more bioregulator dossiers complete
2. All 20 bioregulators linked from category page
3. Bioregulator comparisons added to comparison network

**Deliverables**:
- Ovagen dossier (hepatic tripeptide)
- Pancragen dossier (pancreatic tripeptide)
- Stamakort dossier (gastric mucosa peptide)
- Vladonix dossier (thymus cytamin)
- Endoluten dossier (pineal cytamin)
- Cerluten dossier (brain cytamin)
- Ventfort dossier (vascular cytamin)
- Svetinorm dossier (liver cytamin)
- Suprefort dossier (pancreatic cytamin)
- Sigumir dossier (cartilage cytamin)

---

### Phase 28: Weekly News Blog
**Goal**: Fresh content with traffic potential through news synthesis
**Requirements**: BLOG-01 through BLOG-05 (5 requirements)
**Depends on**: None
**Success Criteria**:
1. 78 blog posts created (3/week × 26 weeks)
2. All posts follow "What [news] means for [peptide/industry]" format
3. Dates properly backdated and ordered on blog index
4. Cross-links to relevant peptide dossiers included
5. No duplicate topics

**Deliverables**:
- 36 posts (weeks 1-12, months 1-3 back)
- 42 posts (weeks 13-26, months 4-6 back)
- Mon/Wed/Fri publishing schedule per week
- Peptide tags and category frontmatter

**Content Sources**:
- `.planning/RESEARCH-LOG.md` — 200+ PMIDs
- `.planning/CONTENT-BACKLOG.md` — Topic ideas
- `.planning/CONTENT-IDEA-BACKLOG.md` — Detailed plans

---

### Phase 29: Comparisons Batch 2 + Calculators
**Goal**: Complete URL multiplication
**Requirements**: COMP-02 through COMP-04, CALC-01 through CALC-05 (9 requirements)
**Depends on**: Phase 23 (comparison template working)
**Success Criteria**:
1. 180 additional comparison pages generated
2. All comparisons have FAQs for schema
3. Calculator dynamic routes working for 50 peptides
4. Total page count exceeds 1,100
5. Build completes successfully

**Deliverables**:
- 180 comparison pages (all valid peptide pairs)
- FAQs added to all comparisons
- Cross-linking audit complete
- `/calculator/reconstitution/[peptide].astro`
- `/calculator/blend/[peptide].astro`
- `/calculator/accumulation/[peptide].astro`
- getStaticPaths for top 50 peptides

---

## Page Count Projection

| Content Type | Current | Add | Target |
|--------------|---------|-----|--------|
| Peptide dossiers | 72 | +20 | 92 |
| Blog posts | 73 | +78 | 151 |
| Comparisons | 45 | +235 | 280 |
| Glossary | 99 | +141 | 240 |
| Condition subpages | 255 | — | 255 |
| Condition hubs | 0 | +15 | 15 |
| Calculator URLs | 3 | +50 | 53 |
| Supporting pages | ~46 | — | 46 |
| **TOTAL** | **~593** | **+539** | **~1,132** |

---

## Execution Sequence

```
Phase 23 → 24 → 25 → 26 → 27 → 28 → 29
   │        │      │      │      │      │      │
   └─ URL   └─SERP └─Auth └─Niche└─Depth└─Fresh└─Complete
     mult.  features ority        │      content  mult.
                                  └──────┘
                              Bioregulators
```

---

## Progress

| Phase | Status | Requirements | Completed |
|-------|--------|--------------|-----------|
| 1. Site Foundation | Complete | 8/8 | 2026-01-19 |
| 2. Content Templates | Complete | 6/6 | 2026-01-19 |
| 3. Pipeline Infrastructure | Complete | 6/6 | 2026-01-19 |
| 4. Features + Polish | Complete | 4/4 | 2026-01-19 |
| 5. First Content Batch | Complete | 3/3 | 2026-01-19 |
| 6. Deploy Infrastructure | Complete | 6/6 | 2026-01-27 |
| 7. Analytics Setup | Complete | 4/4 | 2026-01-27 |
| 8. Production Verification | Partial | 0/5 | — |
| 9-12. v3.0 Operations | On Hold | 0/40 | — |
| 23. Comparisons + Conditions | Complete | 17/17 | 2026-02-01 |
| 24. Schema Deployments | Complete | 6/6 | 2026-02-01 |
| 25. Glossary Expansion | Complete | 5/5 | 2026-02-01 |
| 26. Bioregulators Batch 1 | Complete | 12/12 | 2026-02-01 |
| 27. Bioregulators Batch 2 | Complete | 10/10 | 2026-02-02 |
| 28. Weekly News Blog | Complete | 5/5 | 2026-02-02 |
| 28.1. QA Audit | Complete | — | 2026-02-12 |
| 29. Comparisons + Calculators | Complete | 9/9 | 2026-02-12 |

---

## Quality Gates

1. **No thin content** — Every page provides unique value
2. **Evidence grading** — All claims maintain grading system
3. **No banned patterns** — No dosing, sourcing, medical advice
4. **Schema validation** — Google Rich Results Test passes
5. **Build success** — `npm run build` completes without errors
6. **Internal linking** — All cross-links resolve

---

## Key Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Skip dosing permanently | Maintains credibility, avoids weak sources | 2026-01-30 |
| Calculators as utility | Provides value without liability | 2026-01-30 |
| Content expansion over features | SEO dominance through scale | 2026-02-01 |
| Bioregulator module | Niche authority in Khavinson peptides | 2026-02-01 |
| Weekly news backdating | Fresh content signal for SEO | 2026-02-01 |
| Defer interactions/UX to v5.0 | Content scale more impactful than features | 2026-02-01 |

---
*Created: 2026-01-19*
*Updated: 2026-02-12 — v4.0 Content Expansion COMPLETE*
