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

### v5.0 Hardening & Enhancement (COMPLETE)
*Informed by Full Studio Pipeline Evaluation (2026-02-12). Quality scorecard: 62.5% → 78.1% (target 75% exceeded).*

#### Phase A: Security Hardening (COMPLETE)
- [x] **SEC-001: Security headers** — Added CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy to vercel.json
- [x] **SEC-002: Rate limiting** — Added in-memory rate limiter (5 req/min per IP) to `/api/subscribe`
- [x] **SEC-003: Health endpoint** — Removed config info exposure from `/api/health`
- [x] **SEC-004: CORS restriction** — Changed `Access-Control-Allow-Origin: *` to `https://pepcodex.com`
- [x] **SEC-005: Bot protection** — Added honeypot field to all 3 newsletter form variants

#### Phase B: Performance Optimization (COMPLETE)
- [x] **PERF-001: Static output** — Switched `output: 'server'` → `'static'`, fixed getStaticPaths in `[category].astro` (extracted to `src/data/category-meta.ts`) and `protocols/[slug].astro` (fixed `protocol.data.slug` → `protocol.id`)
- [x] **PERF-002: Font loading** — Moved `@import url()` to `<link rel="preload">` with preconnect hints in BaseLayout
- [x] **PERF-003: Font optimization** — Reduced from 6 weights (300-800) to 4 weights (400-700)
- [x] **PERF-004: Shiki theme** — Already `github-dark` (no change needed)
- [x] **PERF-005: Dead CSS** — Removed `.glass-panel` class (legacy aliases `.glass-card-default` etc. still used in 40+ files — not dead)

#### Phase C: Accessibility Fixes (COMPLETE)
- [x] **A11Y-001: Skip navigation** — Added skip-to-content link in BaseLayout with focus-visible styling, `id="main-content"` on `<main>`
- [x] **A11Y-002: Reduced motion** — Added `@media (prefers-reduced-motion: reduce)` global override for all animations/transitions
- [x] **A11Y-003: Breadcrumbs** — Deployed BreadcrumbSchema to all 9 content layouts (was 3, now 9/9: Dossier, Condition, Glossary, Comparison, Guide, Safety, Blog, Protocol, Hub)
- [x] **A11Y-004: ARIA improvements** — Added `aria-current="page"` to 5 desktop nav links, `aria-label` on nav + search button, ESC to close mobile menu, focus trap in mobile nav
- [x] **A11Y-005: Mobile menu animation** — Replaced instant `hidden` toggle with CSS max-height/opacity slide-fade transition

#### Phase D: Navigation & UX (COMPLETE)
- [x] **UX-001: Fix search icon** — Already wired to SearchModal via `open-search-modal` custom event
- [x] **UX-002: Extend Cmd+K** — Removed conflicting homepage handler; global BaseLayout Cmd+K → SearchModal works on all pages
- [x] **UX-003: Navigation dropdown** — Added Protocols + Bioregulators to Research dropdown (desktop + mobile), updated highlight detection
- [x] **UX-004: Dynamic categories** — `[category].astro` already covered all 7; expanded homepage from 4 to 7 category cards with responsive grid
- [x] **UX-005: Blog filtering** — Already implemented with client-side category filter buttons
- [x] **UX-006: Homepage stats** — Now shows peptides, comparisons, cited sources, and blog articles (all from content collections at build time)

#### Phase E: Content Quality (COMPLETE)
- [x] **CONTENT-001: Unify evidence scales** — Already unified: single `evidenceStrength` enum across all collections
- [x] **CONTENT-002: Source fields** — Schema already has `sources` fields on guides and safety collections
- [x] **CONTENT-003: Cross-link validation** — Enhanced validator with 3 severity levels (error/warning/info), 3,683 refs checked, 0 structural errors. Validator exits 0 on pass, supports `--strict` and `--verbose` flags
- [x] **CONTENT-004: Glossary auto-linking** — Already implemented via rehype plugin in Astro config
- [x] **CONTENT-005: Safety coverage** — Expanded from 11 to 31 safety articles (+20 new covering BPC-157, TB-500, ipamorelin, CJC-1295, MK-677, liraglutide, selank, semax, GHK-Cu, sermorelin, thymosin-alpha-1, dihexa, LL-37, retatrutide, FOXO4-DRI, MOTS-c, DSIP, SS-31, KPV, humanin)

#### Phase F: Feature Enhancements (COMPLETE)
- [x] **FEAT-001: Content migration** — SKIPPED: Guides/safety are distinct collections with different schemas, layouts, and purposes. Separate collections are a feature, not debt.
- [x] **FEAT-002: Protocol expansion** — SKIPPED: Protocols not part of site direction.
- [x] **FEAT-003: Clinic expansion** — Expanded from 10 to 52 clinic listings (+42 across 42 US cities)
- [x] **FEAT-004: Related peptides** — Already implemented in DossierLayout (comparators + same-category suggestions)
- [x] **FEAT-005: Blog navigation** — Already implemented (prev/next in BlogLayout)

### v6.0 Growth & Monetization (PLANNED)
*Informed by PMF Analysis (2026-02-12). Replaces deferred v3.0 phases with data-driven growth strategy.*
*PMF Assessment: Strong product, weak distribution. Content moat 7/10, Monetization 2/10, Reach 4/10.*
*Depends on: v5.0 Phase A (security hardening) minimum.*

#### Phase 31: Analytics & Traffic Intelligence
- [ ] **ANLY-001: Vercel Analytics** — Activate Web Analytics on production deployment
- [ ] **ANLY-002: GA4 deep audit** — Event tracking for search, comparisons, calculators, newsletter signup
- [ ] **ANLY-003: Search Console deep dive** — Top queries, CTR by page type, indexing coverage
- [ ] **ANLY-004: Beehiiv audit** — Subscriber count, open/click rates, growth trajectory
- [ ] **ANLY-005: KPI dashboard** — Baseline report template for traffic, engagement, conversions
- [ ] **ANLY-006: Conversion funnels** — GA4 funnel setup for newsletter, comparison→dossier, calculator flows
- [ ] **ANLY-007: Page/query prioritization** — Top 20 pages by traffic, top 20 queries → monetization priority list

#### Phase 32: Monetization Foundation
- [ ] **MONET-001: Comparison CTAs** — "Find a specialist" / newsletter CTA component on all 279 comparison pages
- [ ] **MONET-002: Condition CTAs** — Condition-specific lead capture on 15 hub pages
- [ ] **MONET-003: Clinic partnership model** — Tiers ($99-499/mo), deliverables, terms document
- [ ] **MONET-004: PepCodex Pro concept** — White-label content tier for clinics/practitioners
- [ ] **MONET-005: Featured Clinic section** — Add to existing city page infrastructure
- [ ] **MONET-006: Clinic directory** — Searchable directory with location/specialty filters
- [ ] **MONET-007: Media kit** — Sponsorship deck for advertisers
- [ ] **MONET-008: Payment infrastructure** — Stripe integration for Pro tier
- [ ] **MONET-009: Quiz funnel** — "Which peptide research matches your interest?" → newsletter + clinic referral
- [ ] **MONET-010: Revenue model** — Projections by channel (listings, Pro, sponsors, newsletter)

#### Phase 33: Regulatory Status Tracker
- [ ] **REG-001: Status data schema** — FDA approval, compounding, patent status per peptide
- [ ] **REG-002: Content collection** — `regulatory-status` collection in Astro config
- [ ] **REG-003: Tracker page** — Filterable table showing all 92 peptides with regulatory status
- [ ] **REG-004: Data population** — Regulatory data for all 92 peptides
- [ ] **REG-005: Dossier badges** — Regulatory status badge on DossierLayout
- [ ] **REG-006: Compounding explainer** — What compounding means, FDA rules, state variations
- [ ] **REG-007: FDA Pipeline page** — Peptides in Phase 2/3 with expected decision dates
- [ ] **REG-008: Dossier frontmatter** — approval_status, compounding_status, patent_expiry fields
- [ ] **REG-009: Schema markup** — MedicalEntity/Drug schema extensions for regulatory data

#### Phase 35: Content Refresh & New Dossiers
*Informed by 10-agent research swarm (2026-03-19). Brings PepCodex current with Feb-Mar 2026 developments.*
- [ ] **Sub-Phase A: New Dossiers** — 6 new peptides: rusfertide, PF-08653944, klotho, MK-0616, ecnoglutide, PEG-MGF (92 → 98 dossiers)
- [ ] **Sub-Phase B: Dossier Updates** — 15 existing dossiers updated (SS-31 FDA approval, semaglutide oral/patent cliff, retatrutide Phase 3, orforglipron Phase 3, etc.)
- [ ] **Sub-Phase C: Blog Posts** — 10 priority articles (FDA reclassification, Wolverine Stack evidence review, compounded GLP-1 safety, retatrutide Phase 3, oral GLP-1 race, etc.)
- [ ] **Sub-Phase D: Regulatory Updates** — FDA Category 1/2 reclassification status across all affected dossiers

#### Phase 34: Distribution & Growth
- [ ] **DIST-001: SEO technical audit** — Crawlability, internal linking, orphan pages, canonicals
- [ ] **DIST-002: Programmatic SEO** — "[peptide] + [condition]" landing pages from existing data
- [ ] **DIST-003: Social strategy** — Platform selection, content formats, posting cadence
- [ ] **DIST-004: Social templates** — 10 templates (carousels, threads, video scripts)
- [ ] **DIST-005: Newsletter growth** — Lead magnets (PDF guides, tracker updates)
- [ ] **DIST-006: Lead magnet PDFs** — 3 PDFs from existing content (top comparisons, GLP-1, bioregulators)
- [ ] **DIST-007: Email capture** — Lead magnet offers on high-traffic pages
- [ ] **DIST-008: Backlink strategy** — 20 target sites for guest posts/citations
- [ ] **DIST-009: Content syndication** — License comparison articles to health media
- [ ] **DIST-010: Social profiles** — Instagram, Twitter/X with consistent branding

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

## v6.0 Phase Details

### Phase 31: Analytics & Traffic Intelligence
**Goal**: Establish data-driven baselines to prioritize monetization and growth investments
**Requirements**: ANLY-01 through ANLY-07 (7 requirements)
**Depends on**: v5.0 Phase A (security headers must be in place before analytics optimization)
**Success Criteria**:
1. Vercel Analytics active and collecting data
2. GA4 event tracking covers all key user flows
3. Search Console data exported with top queries and page performance
4. Beehiiv metrics documented (subscriber count, engagement rates)
5. KPI baseline report created with actionable insights
6. Top 20 pages/queries identified for monetization priority

**Deliverables**:
- Vercel Analytics dashboard active
- GA4 enhanced event configuration
- Search Console export + analysis document
- Beehiiv metrics snapshot
- KPI baseline report (`.planning/ANALYTICS-BASELINE.md`)
- Monetization priority list (top pages/queries ranked by revenue potential)

---

### Phase 32: Monetization Foundation
**Goal**: Build revenue infrastructure — CTAs, clinic partnerships, Pro tier, payment processing
**Requirements**: MONET-01 through MONET-10 (10 requirements)
**Depends on**: Phase 31 (analytics baseline informs CTA placement priority)
**Success Criteria**:
1. CTA components deployed on all comparison and condition pages
2. Clinic partnership model documented with pricing tiers
3. PepCodex Pro tier concept validated (scope, pricing, deliverables)
4. Clinic directory page functional with search/filter
5. Media kit ready for sponsor outreach
6. At least one revenue channel operational (even if zero revenue initially)

**Deliverables**:
- `ComparisonCTA.astro` component on 279 comparison pages
- `ConditionCTA.astro` component on 15 condition hub pages
- Clinic partnership terms document
- PepCodex Pro tier spec
- `/clinics` directory page with search
- Featured clinic section on city pages
- Media kit / sponsorship deck PDF
- Revenue projection model

---

### Phase 33: Regulatory Status Tracker
**Goal**: Create unique, high-value regulatory content that competitors lack — viral potential
**Requirements**: REG-01 through REG-09 (9 requirements)
**Depends on**: None (can run in parallel with 31-32)
**Success Criteria**:
1. Regulatory status data populated for all 92 peptides
2. FDA Status Tracker page renders with filterable table
3. Regulatory badges appear on all dossier pages
4. Compounding explainer page published
5. FDA Pipeline page shows peptides in active trials
6. Schema markup validated for regulatory data

**Deliverables**:
- `regulatory-status` content collection + schema
- `/regulatory-tracker` page with filterable table
- Regulatory badges on DossierLayout
- `/guides/compounding-status` explainer page
- `/regulatory-tracker/pipeline` page
- Updated dossier frontmatter (92 peptides)
- Schema markup extensions

**Market Context (from PMF Analysis)**:
- FDA compounding crackdown created massive consumer confusion
- "What's actually legal?" is a top consumer frustration
- No competitor has a comprehensive regulatory tracker
- High viral/share potential for journalists and health media

---

### Phase 34: Distribution & Growth
**Goal**: Multi-channel distribution to reach the 40M+ Americans searching for peptide information
**Requirements**: DIST-01 through DIST-10 (10 requirements)
**Depends on**: Phase 31 (traffic data), Phase 32 (CTAs in place)
**Success Criteria**:
1. SEO technical audit complete with fix list
2. Programmatic SEO pages generating traffic
3. Social profiles created and first content published
4. 3 lead magnet PDFs created and deployed
5. Newsletter growth rate measurable (baseline vs. post-implementation)
6. Backlink outreach list created with first 5 pitches sent

**Deliverables**:
- SEO technical audit report
- Programmatic "[peptide] + [condition]" page templates
- Social content strategy document
- 10 social content templates
- 3 lead magnet PDFs
- Email capture components on high-traffic pages
- Social profiles (Instagram, Twitter/X)
- Backlink target list + outreach templates
- Content syndication pitch deck

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
| 9-12. v3.0 Operations | Superseded by v6.0 | — | — |
| 23. Comparisons + Conditions | Complete | 17/17 | 2026-02-01 |
| 24. Schema Deployments | Complete | 6/6 | 2026-02-01 |
| 25. Glossary Expansion | Complete | 5/5 | 2026-02-01 |
| 26. Bioregulators Batch 1 | Complete | 12/12 | 2026-02-01 |
| 27. Bioregulators Batch 2 | Complete | 10/10 | 2026-02-02 |
| 28. Weekly News Blog | Complete | 5/5 | 2026-02-02 |
| 28.1. QA Audit | Complete | — | 2026-02-12 |
| 29. Comparisons + Calculators | Complete | 9/9 | 2026-02-12 |

| 31. Analytics & Traffic Intel | Planned | 0/7 | — |
| 32. Monetization Foundation | Planned | 0/10 | — |
| 33. Regulatory Status Tracker | Planned | 0/9 | — |
| 34. Distribution & Growth | Planned | 0/10 | — |
| 35. Content Refresh & Dossiers | Planned | 0/4 | — |

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
| PMF-informed v6.0 phases | Replace v3.0 placeholder with data-driven growth strategy | 2026-02-12 |
| Regulatory tracker as differentiator | No competitor has this; high viral potential; addresses top consumer frustration | 2026-02-12 |
| Analytics-first monetization | Can't monetize what you can't measure; Phase 31 before Phase 32 | 2026-02-12 |

---
*Created: 2026-01-19*
*Updated: 2026-02-12 — v6.0 Growth & Monetization planned (PMF Analysis)*
