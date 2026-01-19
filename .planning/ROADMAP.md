# Roadmap: Peptide Library

## Overview

Build evidence-based peptide education site with automated content pipeline. Existing code provides head start on site foundation. Focus remaining work on fixing build, completing features, and building n8n pipeline.

## Phases

- [~] **Phase 1: Site Foundation** - Fix build, complete core site structure
- [ ] **Phase 2: Content Templates** - Full dossier template, comparison/guide templates
- [ ] **Phase 3: Pipeline Infrastructure** - n8n workflows for automated content generation
- [ ] **Phase 4: Features + Polish** - Search, trial tracker, sponsor pages
- [ ] **Phase 5: First Content Batch** - 45 pages live

## Phase Details

### Phase 1: Site Foundation
**Goal**: Working Astro site with all pages rendering correctly
**Depends on**: Nothing (first phase)
**Requirements**: SITE-01 through SITE-08, TMPL-05, TMPL-06, FEAT-01 (partial), DEPLOY-02
**Status**: ~80% complete from previous session
**Success Criteria** (what must be TRUE):
  1. `npm run build` succeeds with zero errors
  2. All trust core pages render (methodology, editorial, about, ads policy, newsletter)
  3. Category hubs display placeholder content
  4. A-Z index page works
  5. Sample peptide dossier (tirzepatide) renders with evidence badge and citations

**Remaining Work:**
- Fix content schema (remove `slug` field - Astro auto-generates)
- Remove `slug` from tirzepatide.mdx frontmatter
- Verify build passes
- Add robots.txt

Plans:
- [~] 01-01: Fix build errors and verify site works

### Phase 2: Content Templates
**Goal**: Complete templates for all content types matching production requirements
**Depends on**: Phase 1 (site must build)
**Requirements**: TMPL-01, TMPL-02, TMPL-03, TMPL-04
**Success Criteria** (what must be TRUE):
  1. Dossier template has all 12 sections from Prompt A
  2. Comparison template renders side-by-side peptide data
  3. Guide template works for "What is X" pages
  4. Safety template displays clinical trial information

Plans:
- [ ] 02-01: Enhance dossier template to full 12-section structure
- [ ] 02-02: Create comparison and guide templates

### Phase 3: Pipeline Infrastructure
**Goal**: n8n workflows that automate source gathering, draft generation, and QA
**Depends on**: Phase 2 (need templates for drafts to target)
**Requirements**: PIPE-01 through PIPE-06, QA-01 through QA-04
**Success Criteria** (what must be TRUE):
  1. Source pack workflow fetches from PubMed, Europe PMC, ClinicalTrials.gov
  2. Draft generator produces valid MDX from source packs via Claude API
  3. QA gate catches missing citations and banned content
  4. Publisher commits and triggers Vercel deploy
  5. Full pipeline tested end-to-end with 1 peptide

Plans:
- [ ] 03-01: Create source pack schema and builder workflow
- [ ] 03-02: Create draft generator workflow with Claude API
- [ ] 03-03: Create QA gate and publisher workflows

### Phase 4: Features + Polish
**Goal**: Search, trial tracker, and sponsor pages complete
**Depends on**: Phase 1 (site foundation)
**Requirements**: FEAT-01 (complete), FEAT-02, FEAT-03, FEAT-04
**Success Criteria** (what must be TRUE):
  1. Beehiiv newsletter captures subscribers
  2. Pagefind search returns relevant results
  3. Trial tracker displays clinical trial data
  4. Sponsor page template ready

Plans:
- [ ] 04-01: Complete Beehiiv API integration
- [ ] 04-02: Implement Pagefind search
- [ ] 04-03: Build trial tracker with Turso

### Phase 5: First Content Batch
**Goal**: 45 pages live - 15 dossiers + 30 long-tail
**Depends on**: Phase 3 (pipeline), Phase 4 (features)
**Requirements**: CONT-01, CONT-02, CONT-03, DEPLOY-01, DEPLOY-03
**Success Criteria** (what must be TRUE):
  1. 15 peptide dossiers published (GLP-1 cluster priority)
  2. 30 long-tail pages published (10 each: what-is, comparisons, safety)
  3. All pages pass QA validation
  4. Site deployed to Vercel
  5. Sitemap includes all 45+ pages

Plans:
- [ ] 05-01: Generate source packs for first 15 peptides
- [ ] 05-02: Run pipeline for all content
- [ ] 05-03: Deploy to Vercel

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Site Foundation | 0/1 | In Progress | - |
| 2. Content Templates | 0/2 | Not started | - |
| 3. Pipeline Infrastructure | 0/3 | Not started | - |
| 4. Features + Polish | 0/3 | Not started | - |
| 5. First Content Batch | 0/3 | Not started | - |

## First 15 Peptides (Priority Order)

1. **Tirzepatide** (Mounjaro/Zepbound) - sample exists
2. **Semaglutide** (Ozempic/Wegovy)
3. **Retatrutide** - emerging GLP-1
4. **BPC-157** - high search, recovery
5. **TB-500** - pairs with BPC-157
6. **Ipamorelin** - growth hormone
7. **CJC-1295** - GH releasing
8. **Tesamorelin** - FDA approved GH
9. **PT-141** - sexual health
10. **Melanotan II** - tanning/libido
11. **AOD-9604** - fat loss peptide
12. **GHRP-6** - GH secretagogue
13. **Sermorelin** - GH releasing
14. **Epithalon** - longevity interest
15. **GHK-Cu** - skin/healing

---
*Created: 2026-01-19*
*Target: 45 pages Week 1*
