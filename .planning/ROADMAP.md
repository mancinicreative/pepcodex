# Roadmap: PepCodex

## Overview

v4.0 Competitive Enhancement + SEO Domination — Close feature gaps with competitors while maintaining credibility positioning, then dominate SEO with programmatic pages.

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
*Paused to prioritize v4.0 competitive features. Resume after v4.0.*
- [ ] **Phase 9: Operations Infrastructure** - Templates, calendars, SOPs
- [ ] **Phase 10: Content Production System** - Batch workflow, repurposing
- [ ] **Phase 11: Distribution System** - Instagram, email capture, newsletters
- [ ] **Phase 12: Monetization Foundation** - Directory, pricing, outreach

### v4.0 Competitive Enhancement + SEO Domination (ACTIVE)
- [ ] **Phase 13: Legal Foundation** - 5 essential pages + disclaimers
- [ ] **Phase 14: Calculator Suite** - Reconstitution, blend, accumulation
- [ ] **Phase 15: Peptide Interactions** - Synergy matrix with color coding
- [ ] **Phase 16: Dossier UX Overhaul** - Molecular viz, evidence chains
- [ ] **Phase 17: Content Migration** - Guides/safety → blog with redirects
- [ ] **Phase 18: Multi-Peptide Protocols** - Research-based protocol pages
- [ ] **Phase 19: Enhanced UX** - Timeline, quality checklist
- [ ] **Phase 20: Programmatic SEO - Conditions** - [Peptide] + [Condition] pages
- [ ] **Phase 21: Location SEO - Cities** - Peptide clinics in [City] pages
- [ ] **Phase 22: SEO Polish + Launch** - Schema markup, internal linking, launch

---

## v4.0 Phase Details

### Phase 13: Legal Foundation
**Goal**: Essential legal protection for the site
**Requirements**: LEGL-01 through LEGL-07 (7 requirements)
**Success Criteria**:
1. All 5 legal pages exist and are accessible
2. Disclaimer banner visible on every page
3. Cookie consent popup appears on first visit

**Deliverables**:
- `/disclaimer` - General + medical disclaimer
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/fda-notice` - FDA compliance notice
- `/cookie-policy` - Cookie/tracking disclosure
- `DisclaimerBanner.astro` component
- `CookieConsent.astro` component

---

### Phase 14: Calculator Suite
**Goal**: Practical calculation tools without dosing advice
**Requirements**: CALC-01 through CALC-05 (5 requirements)
**Depends on**: None
**Success Criteria**:
1. User can calculate reconstitution with visual syringe
2. User can calculate blend concentrations
3. User can calculate accumulation curves
4. All calculators show research disclaimer

**Deliverables**:
- `/calculator/reconstitution` page with visual syringe
- `/calculator/blend` page for multi-peptide math
- `/calculator/accumulation` page for half-life tracking
- Calculator hub page at `/calculator`

---

### Phase 15: Peptide Interactions
**Goal**: Show research-based peptide synergies
**Requirements**: INTR-01 through INTR-03 (3 requirements)
**Depends on**: None
**Success Criteria**:
1. Schema supports interactions array
2. Dossier pages show color-coded interaction matrix
3. Top 20 peptides have interaction data

**Deliverables**:
- Updated `peptideSchema` in content/config.ts
- `InteractionMatrix.astro` component
- Interaction data for 20 peptides

---

### Phase 16: Dossier UX Overhaul
**Goal**: Match/exceed competitor organization + evidence transparency
**Requirements**: DOSS-01 through DOSS-05 (5 requirements)
**Depends on**: None
**Success Criteria**:
1. Molecular structure visualization on dossier pages
2. Evidence-chained benefits showing study breakdown
3. Reorganized dossier sections for better flow

**Deliverables**:
- `MolecularStructure.astro` component
- `EvidenceChain.astro` component
- Updated `DossierLayout.astro`
- Schema additions for molecular and evidence data

---

### Phase 17: Content Migration
**Goal**: Consolidate guides/safety into blog with redirects
**Requirements**: MIGR-01 through MIGR-06 (6 requirements)
**Depends on**: None
**Success Criteria**:
1. All 22 pages migrated to blog format
2. Blog categories working (Guides, Safety, Research Digest)
3. 301 redirects preserving old URLs
4. No broken internal links

**Deliverables**:
- 11 guide pages reformatted
- 11 safety pages reformatted
- Blog category system
- Redirect configuration
- Updated internal links

---

### Phase 18: Multi-Peptide Protocols
**Goal**: Document research combinations (NOT dosing advice)
**Requirements**: PROT-01 through PROT-04 (4 requirements)
**Depends on**: None
**Success Criteria**:
1. Protocols content collection exists
2. At least 3 protocol pages with study citations
3. Clear distinction from dosing recommendations

**Deliverables**:
- `protocols` content collection
- BPC-157 + TB-500 Research Overview
- CJC-1295 + Ipamorelin Research
- GH Secretagogue Combinations

---

### Phase 19: Enhanced UX
**Goal**: Better user experience components
**Requirements**: ENUX-01 through ENUX-05 (5 requirements)
**Depends on**: Phase 16 (Dossier UX)
**Success Criteria**:
1. Timeline component showing study-based expectations
2. Quality checklist with traffic light styling
3. Top 10 peptides have this data

**Deliverables**:
- `Timeline.astro` component
- `QualityChecklist.astro` component
- Data for 10 peptides

---

### Phase 20: Programmatic SEO - Conditions
**Goal**: Generate 100+ condition-specific pages
**Requirements**: PSEO-01 through PSEO-05 (5 requirements)
**Depends on**: Phase 16 (schema work)
**Success Criteria**:
1. Condition page template works
2. At least 100 pages generated
3. Bidirectional linking working

**Deliverables**:
- `conditions` schema addition
- `/peptides/[peptide]/[condition].astro` template
- 100+ generated pages
- Internal linking system

---

### Phase 21: Location SEO - Cities
**Goal**: Generate 50+ city pages for clinic monetization
**Requirements**: LSEO-01 through LSEO-04 (4 requirements)
**Depends on**: None
**Success Criteria**:
1. City page template works
2. At least 50 city pages generated
3. Featured listing system ready

**Deliverables**:
- `clinics` content collection
- `/clinics/[city].astro` template
- 50+ city pages
- Featured listing component

---

### Phase 22: SEO Polish + Launch
**Goal**: Final optimization and v4.0 launch
**Requirements**: SPOL-01 through SPOL-06 (6 requirements)
**Depends on**: All previous phases
**Success Criteria**:
1. Schema markup on all relevant pages
2. Internal linking audit complete
3. Sitemap includes all new pages
4. Core Web Vitals passing

**Deliverables**:
- FAQPage, HowTo, LocalBusiness schema
- Internal linking fixes
- Updated sitemap
- Performance optimizations
- v4.0 launch

---

## Timeline

| Week | Focus | Phases |
|------|-------|--------|
| 1-2 | Foundation | 13 (Legal), 14 (Calculators) |
| 3-4 | Content System | 15 (Interactions), 16 (Dossier UX), 17 (Migration) |
| 5 | Protocols & UX | 18 (Protocols), 19 (Enhanced UX) |
| 6-8 | SEO Expansion | 20 (Conditions), 21 (Cities), 22 (Polish + Launch) |

**Total: 10 phases over 8 weeks**

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
| 13. Legal Foundation | **Pending** | 0/7 | — |
| 14. Calculator Suite | Pending | 0/5 | — |
| 15. Peptide Interactions | Pending | 0/3 | — |
| 16. Dossier UX Overhaul | Pending | 0/5 | — |
| 17. Content Migration | Pending | 0/6 | — |
| 18. Multi-Peptide Protocols | Pending | 0/4 | — |
| 19. Enhanced UX | Pending | 0/5 | — |
| 20. Condition Pages | Pending | 0/5 | — |
| 21. City Pages | Pending | 0/4 | — |
| 22. SEO Polish + Launch | Pending | 0/6 | — |

---

## Key Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Skip dosing in v4.0 | Maintains credibility, avoids weak sources | 2026-01-30 |
| Calculators as utility | Provides value without liability | 2026-01-30 |
| Evidence-chained benefits | Differentiates from competitor's bold claims | 2026-01-30 |
| Pause v3.0 for v4.0 | Competitive features more urgent than operations | 2026-01-30 |

---
*Created: 2026-01-19*
*Updated: 2026-01-30 for v4.0 milestone*
