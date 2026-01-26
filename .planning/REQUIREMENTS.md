# Requirements: PepCodex

**Defined:** 2026-01-19 | **Updated:** 2026-01-26
**Core Value:** Authoritative, citation-heavy peptide research resource

---

## v1 Requirements (COMPLETE)

All v1 requirements completed in Phases 1-5.

### Site Foundation ✓

- [x] **SITE-01**: Astro project with Tailwind, MDX, sitemap integrations
- [x] **SITE-02**: Base layouts (BaseLayout, DossierLayout, HubLayout)
- [x] **SITE-03**: Core components (EvidenceBadge, CitationTable, SearchBar, NewsletterForm)
- [x] **SITE-04**: Content collections schema for peptides, comparisons, guides, safety, pages
- [x] **SITE-05**: Trust core pages (methodology, editorial, about, ads policy, newsletter)
- [x] **SITE-06**: Category hub pages (metabolic, repair-recovery, hormonal)
- [x] **SITE-07**: A-Z peptide index with filters
- [x] **SITE-08**: Dynamic peptide dossier pages ([slug].astro)

### Content Templates ✓

- [x] **TMPL-01**: 12-section dossier template matching Prompt A structure
- [x] **TMPL-02**: Comparison page template
- [x] **TMPL-03**: "What is X" guide template
- [x] **TMPL-04**: Safety/trials page template
- [x] **TMPL-05**: Evidence strength badges (high/moderate/low/very-low)
- [x] **TMPL-06**: Citation rendering with paywall flags

### Pipeline Infrastructure ✓

- [x] **PIPE-01**: Source pack JSON schema
- [x] **PIPE-02**: n8n Workflow 1: Source Pack Builder (PubMed, Europe PMC, ClinicalTrials.gov)
- [x] **PIPE-03**: n8n Workflow 2: Draft Generator (Claude API)
- [x] **PIPE-04**: n8n Workflow 3: QA Gate (citation validation, banned content scan)
- [x] **PIPE-05**: n8n Workflow 4: Publisher (git commit, deploy trigger)
- [x] **PIPE-06**: n8n Workflow 5: Batch Orchestrator

### QA Validation ✓

- [x] **QA-01**: Citation validation script (every claim maps to source pack)
- [x] **QA-02**: Banned content scanner (dosing, protocols, sourcing patterns)
- [x] **QA-03**: Overclaim scanner (proven, guaranteed, cures)
- [x] **QA-04**: Evidence labeling checker (animal/in-vitro studies marked)

### Features ✓

- [x] **FEAT-01**: Beehiiv newsletter integration
- [x] **FEAT-02**: Pagefind search implementation
- [x] **FEAT-03**: Trial tracker page
- [x] **FEAT-04**: Sponsor/partner page template

### First Content Batch ✓

- [x] **CONT-01**: Source packs for first 15 peptides (GLP-1 cluster priority)
- [x] **CONT-02**: 15 peptide dossiers generated and QA'd
- [x] **CONT-03**: 33 long-tail pages (11 guides, 11 comparisons, 11 safety)

---

## v2 Requirements (ACTIVE)

Requirements for production launch. Maps to Phases 6-8.

### Infrastructure

- [ ] **INFRA-01**: Code committed to GitHub repository
- [ ] **INFRA-02**: Site deployed to Vercel with working preview URL
- [ ] **INFRA-03**: Custom domain (pepcodex.com) connected and serving HTTPS
- [ ] **INFRA-04**: DNS configured in Squarespace pointing to Vercel
- [ ] **INFRA-05**: Development branch (develop) created with preview deployments
- [ ] **INFRA-06**: Environment variables configured in Vercel (Beehiiv, GA)

### Analytics

- [ ] **ANLY-01**: Google Analytics 4 property created
- [ ] **ANLY-02**: GA4 tracking ID added to environment variables
- [ ] **ANLY-03**: Google Search Console property verified
- [ ] **ANLY-04**: Sitemap submitted to Google Search Console

### Verification

- [ ] **VERF-01**: All 188 pages load correctly on production
- [ ] **VERF-02**: Search functionality works on production
- [ ] **VERF-03**: Newsletter signup works on production
- [ ] **VERF-04**: Mobile responsive design verified
- [ ] **VERF-05**: Site speed acceptable (>70 PageSpeed score)

---

## v3 Requirements (Deferred)

### Community Features

- **COMM-01**: Heart/interest system for peptides (spec in LAUNCH-OPERATIONS.md)
- **COMM-02**: User accounts for saving favorites
- **COMM-03**: Sponsor management dashboard

### Monetization

- **MNTZ-01**: Stripe payment integration for listings
- **MNTZ-02**: Self-service listing management

### Scale

- **SCALE-01**: Daily publishing cadence automation
- **SCALE-02**: Internal linking automation
- **SCALE-03**: Scale to 150-250 pages

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Dosing/protocol information | Safety and legal risk |
| Sourcing/vendor information | Legal risk |
| Medical advice | Liability |
| Comments/community | Moderation overhead |
| Real-time features | Static site, not needed |
| Mobile app | Web-first, possibly never |

---

## Traceability

### v2 Requirements → Phases

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 6 | Pending |
| INFRA-02 | Phase 6 | Pending |
| INFRA-03 | Phase 6 | Pending |
| INFRA-04 | Phase 6 | Pending |
| INFRA-05 | Phase 6 | Pending |
| INFRA-06 | Phase 6 | Pending |
| ANLY-01 | Phase 7 | Pending |
| ANLY-02 | Phase 7 | Pending |
| ANLY-03 | Phase 7 | Pending |
| ANLY-04 | Phase 7 | Pending |
| VERF-01 | Phase 8 | Pending |
| VERF-02 | Phase 8 | Pending |
| VERF-03 | Phase 8 | Pending |
| VERF-04 | Phase 8 | Pending |
| VERF-05 | Phase 8 | Pending |

**Coverage:**
- v2 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-19*
*Last updated: 2026-01-26 after v2 milestone start*
