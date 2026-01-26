# Roadmap: PepCodex

## Overview

v2.0 Production Launch — Deploy the 188-page peptide research library to production, configure analytics and SEO tools, and establish development workflow.

## Milestones

### v1.0 Content Foundation (COMPLETE)
- [x] **Phase 1: Site Foundation** - Fix build, complete core site structure
- [x] **Phase 2: Content Templates** - Full dossier template, comparison/guide templates
- [x] **Phase 3: Pipeline Infrastructure** - n8n workflows for automated content generation
- [x] **Phase 4: Features + Polish** - Search, trial tracker, sponsor pages
- [x] **Phase 5: First Content Batch** - 188 pages indexed (exceeded 45 target)

### v2.0 Production Launch (ACTIVE)
- [ ] **Phase 6: Deploy Infrastructure** - GitHub, Vercel, DNS, development workflow
- [ ] **Phase 7: Analytics Setup** - GA4, Google Search Console
- [ ] **Phase 8: Production Verification** - Test all features on live site

---

## Phase Details

### Phase 6: Deploy Infrastructure
**Goal**: Site live at pepcodex.com with proper development workflow
**Depends on**: Phase 5 (content ready)
**Requirements**: INFRA-01 through INFRA-06
**Success Criteria** (what must be TRUE):
  1. Code pushed to GitHub repository
  2. Vercel deployment accessible at preview URL
  3. pepcodex.com serves the site over HTTPS
  4. DNS configured correctly in Squarespace
  5. develop branch exists with preview deployments enabled
  6. Environment variables (Beehiiv, GA) configured in Vercel

Plans:
- [ ] 06-01: Push to GitHub, deploy to Vercel, configure DNS

### Phase 7: Analytics Setup
**Goal**: Tracking and SEO tools configured
**Depends on**: Phase 6 (site must be live)
**Requirements**: ANLY-01 through ANLY-04
**Success Criteria** (what must be TRUE):
  1. GA4 property created and tracking code deployed
  2. GA4 receiving page view data
  3. Google Search Console verified
  4. Sitemap submitted and indexing started

Plans:
- [ ] 07-01: Configure GA4 and Google Search Console

### Phase 8: Production Verification
**Goal**: Verify all features work correctly on production
**Depends on**: Phase 7 (analytics configured)
**Requirements**: VERF-01 through VERF-05
**Success Criteria** (what must be TRUE):
  1. All 188 pages load without errors
  2. Search returns relevant results
  3. Newsletter form submits successfully
  4. Mobile experience is responsive
  5. PageSpeed score > 70

Plans:
- [ ] 08-01: Run verification tests on production

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Site Foundation | 1/1 | Complete | 2026-01-19 |
| 2. Content Templates | 2/2 | Complete | 2026-01-19 |
| 3. Pipeline Infrastructure | 5/5 | Complete | 2026-01-19 |
| 4. Features + Polish | 3/3 | Complete | 2026-01-19 |
| 5. First Content Batch | 2/2 | Complete | 2026-01-19 |
| 6. Deploy Infrastructure | 0/1 | **Active** | — |
| 7. Analytics Setup | 0/1 | Pending | — |
| 8. Production Verification | 0/1 | Pending | — |

---
*Created: 2026-01-19*
*Updated: 2026-01-26 for v2.0 milestone*
