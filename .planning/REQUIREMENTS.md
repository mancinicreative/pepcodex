# Requirements: Peptide Library

**Defined:** 2026-01-19
**Core Value:** Authoritative, citation-heavy peptide research resource

## v1 Requirements

### Site Foundation

- [ ] **SITE-01**: Astro project with Tailwind, MDX, sitemap integrations
- [ ] **SITE-02**: Base layouts (BaseLayout, DossierLayout, HubLayout)
- [ ] **SITE-03**: Core components (EvidenceBadge, CitationTable, SearchBar, NewsletterForm)
- [ ] **SITE-04**: Content collections schema for peptides, comparisons, guides, safety, pages
- [ ] **SITE-05**: Trust core pages (methodology, editorial, about, ads policy, newsletter)
- [ ] **SITE-06**: Category hub pages (metabolic, repair-recovery, hormonal)
- [ ] **SITE-07**: A-Z peptide index with filters
- [ ] **SITE-08**: Dynamic peptide dossier pages ([slug].astro)

### Content Templates

- [ ] **TMPL-01**: 12-section dossier template matching Prompt A structure
- [ ] **TMPL-02**: Comparison page template
- [ ] **TMPL-03**: "What is X" guide template
- [ ] **TMPL-04**: Safety/trials page template
- [ ] **TMPL-05**: Evidence strength badges (high/moderate/low/very-low)
- [ ] **TMPL-06**: Citation rendering with paywall flags

### Pipeline Infrastructure

- [ ] **PIPE-01**: Source pack JSON schema
- [ ] **PIPE-02**: n8n Workflow 1: Source Pack Builder (PubMed, Europe PMC, ClinicalTrials.gov)
- [ ] **PIPE-03**: n8n Workflow 2: Draft Generator (Claude API)
- [ ] **PIPE-04**: n8n Workflow 3: QA Gate (citation validation, banned content scan)
- [ ] **PIPE-05**: n8n Workflow 4: Publisher (git commit, deploy trigger)
- [ ] **PIPE-06**: n8n Workflow 5: Batch Orchestrator

### QA Validation

- [ ] **QA-01**: Citation validation script (every claim maps to source pack)
- [ ] **QA-02**: Banned content scanner (dosing, protocols, sourcing patterns)
- [ ] **QA-03**: Overclaim scanner (proven, guaranteed, cures)
- [ ] **QA-04**: Evidence labeling checker (animal/in-vitro studies marked)

### Features

- [ ] **FEAT-01**: Beehiiv newsletter integration
- [ ] **FEAT-02**: Pagefind search implementation
- [ ] **FEAT-03**: Trial tracker with Turso database
- [ ] **FEAT-04**: Sponsor/partner page template

### First Content Batch

- [ ] **CONT-01**: Source packs for first 15 peptides (GLP-1 cluster priority)
- [ ] **CONT-02**: 15 peptide dossiers generated and QA'd
- [ ] **CONT-03**: 30 long-tail pages (10 "what is", 10 comparisons, 10 safety)

### Deployment

- [ ] **DEPLOY-01**: Vercel deployment configured
- [ ] **DEPLOY-02**: Sitemap.xml auto-generation
- [ ] **DEPLOY-03**: robots.txt configured

## v2 Requirements

Deferred to future batches.

- **SCALE-01**: Daily publishing cadence automation
- **SCALE-02**: Internal linking automation
- **SCALE-03**: Scale to 150-250 pages
- **ENH-01**: Advanced trial tracker filtering
- **ENH-02**: Comparison page generator

## Out of Scope

| Feature | Reason |
|---------|--------|
| Dosing/protocol information | Safety and legal risk |
| Sourcing/vendor information | Legal risk |
| Medical advice | Liability |
| User accounts | Unnecessary for v1 |
| Comments/community | Moderation overhead |
| Open/click tracking | Unnecessary complexity |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SITE-01 | Phase 1 | Complete |
| SITE-02 | Phase 1 | Complete |
| SITE-03 | Phase 1 | Complete |
| SITE-04 | Phase 1 | Needs fix (slug field) |
| SITE-05 | Phase 1 | Complete |
| SITE-06 | Phase 1 | Complete |
| SITE-07 | Phase 1 | Complete |
| SITE-08 | Phase 1 | Complete |
| TMPL-01 | Phase 2 | Pending |
| TMPL-02 | Phase 2 | Pending |
| TMPL-03 | Phase 2 | Pending |
| TMPL-04 | Phase 2 | Pending |
| TMPL-05 | Phase 1 | Complete |
| TMPL-06 | Phase 1 | Complete |
| PIPE-01 | Phase 3 | Pending |
| PIPE-02 | Phase 3 | Pending |
| PIPE-03 | Phase 3 | Pending |
| PIPE-04 | Phase 3 | Pending |
| PIPE-05 | Phase 3 | Pending |
| PIPE-06 | Phase 3 | Pending |
| QA-01 | Phase 3 | Pending |
| QA-02 | Phase 3 | Pending |
| QA-03 | Phase 3 | Pending |
| QA-04 | Phase 3 | Pending |
| FEAT-01 | Phase 1 | Partial (form exists, API pending) |
| FEAT-02 | Phase 4 | Pending |
| FEAT-03 | Phase 4 | Pending |
| FEAT-04 | Phase 4 | Pending |
| CONT-01 | Phase 5 | Pending |
| CONT-02 | Phase 5 | Pending |
| CONT-03 | Phase 5 | Pending |
| DEPLOY-01 | Phase 1 | Pending |
| DEPLOY-02 | Phase 1 | Complete |
| DEPLOY-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 31 total
- Mapped to phases: 31
- Unmapped: 0

---
*Requirements defined: 2026-01-19*
