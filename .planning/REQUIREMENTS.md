# Requirements: PepCodex

**Defined:** 2026-01-19 | **Updated:** 2026-01-30
**Core Value:** Become the authoritative, citation-heavy resource for peptide research — no dosing, no protocols, no sourcing. Pure evidence synthesis.

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

## v2 Requirements (COMPLETE)

Production launch completed in Phases 6-8.

### Infrastructure ✓

- [x] **INFRA-01**: Code committed to GitHub repository (mancinicreative/pepcodex)
- [x] **INFRA-02**: Site deployed to Vercel (mancinicreative-pepcodex)
- [x] **INFRA-03**: Custom domain (pepcodex.com) connected and serving HTTPS
- [x] **INFRA-04**: DNS configured in Squarespace pointing to Vercel
- [x] **INFRA-05**: Development branch (develop) created with preview deployments
- [x] **INFRA-06**: Environment variables configured in Vercel (Beehiiv, GA)

### Analytics ✓

- [x] **ANLY-01**: Google Analytics 4 property created
- [x] **ANLY-02**: GA4 tracking ID added (G-1M56CNL8CK)
- [x] **ANLY-03**: Google Search Console property verified
- [x] **ANLY-04**: Sitemap submitted to Google Search Console

### Verification (Partial)

- [ ] **VERF-01**: All 188 pages load correctly on production
- [ ] **VERF-02**: Search functionality works on production
- [ ] **VERF-03**: Newsletter signup works on production
- [ ] **VERF-04**: Mobile responsive design verified
- [ ] **VERF-05**: Site speed acceptable (>70 PageSpeed score)

---

## v3 Requirements (ON HOLD)

*v3.0 Operations & Growth paused to prioritize v4.0 competitive features. Resume after v4.0.*

### Phase 9: Operations Infrastructure (Paused)

- [ ] **OPS-01**: Content calendar template (monthly + weekly view)
- [ ] **OPS-02**: Instagram carousel template
- [ ] **OPS-03**: Instagram story template
- [ ] **OPS-04**: Newsletter template (Beehiiv format)
- [ ] **OPS-05**: Blog post template (research summary format)
- [ ] **OPS-06**: Weekly operations checklist
- [ ] **OPS-07**: Editorial calendar seeded with 4 weeks of content

### Phase 10-12 (Paused)

See `.planning/_archive/v3-requirements.md` for full v3 requirements.

---

## v4 Requirements (ACTIVE)

Competitive Enhancement + SEO Domination. Maps to Phases 13-22.

### Phase 13: Legal Foundation

- [ ] **LEGL-01**: Site has disclaimer page covering educational purpose, no medical advice, no doctor-patient relationship
- [ ] **LEGL-02**: Site has privacy policy page covering analytics, cookies, data handling
- [ ] **LEGL-03**: Site has terms of service page
- [ ] **LEGL-04**: Site has FDA notice page stating products not FDA approved/evaluated
- [ ] **LEGL-05**: Site has cookie policy page for EU compliance
- [ ] **LEGL-06**: Site displays persistent disclaimer banner on all pages
- [ ] **LEGL-07**: Site shows cookie consent popup on first visit

### Phase 14: Calculator Suite

- [ ] **CALC-01**: User can calculate reconstitution (peptide mg + water mL → concentration)
- [ ] **CALC-02**: Reconstitution calculator shows visual syringe with draw volume
- [ ] **CALC-03**: User can calculate blend concentrations for multi-peptide combinations
- [ ] **CALC-04**: User can calculate accumulation based on half-life
- [ ] **CALC-05**: All calculators display "for research purposes only" disclaimer

### Phase 15: Peptide Interactions

- [ ] **INTR-01**: Peptide schema supports interactions array (peptide, type, description, source)
- [ ] **INTR-02**: Dossier pages display interaction matrix with color-coded badges
- [ ] **INTR-03**: Top 20 peptides have interaction data populated

### Phase 16: Dossier UX Overhaul

- [ ] **DOSS-01**: Peptide schema supports molecular info (weight, chain length, sequence, amino acids)
- [ ] **DOSS-02**: Dossier pages display molecular structure visualization with color-coded amino acids
- [ ] **DOSS-03**: Peptide schema supports evidence-chained benefits (mechanism, benefit, evidence breakdown)
- [ ] **DOSS-04**: Dossier pages display evidence chain component showing study type breakdown
- [ ] **DOSS-05**: Dossier page sections reorganized for better flow

### Phase 17: Content Migration

- [ ] **MIGR-01**: 11 guide pages reformatted to blog post format
- [ ] **MIGR-02**: 11 safety pages reformatted to blog post format
- [ ] **MIGR-03**: Blog has categories (Guides, Safety, Research Digest)
- [ ] **MIGR-04**: 301 redirects work from /guide/[slug] to /blog/[slug]
- [ ] **MIGR-05**: 301 redirects work from /safety/[slug] to /blog/[slug]
- [ ] **MIGR-06**: All internal links updated to new URLs

### Phase 18: Multi-Peptide Protocols

- [ ] **PROT-01**: Protocols content collection exists with proper schema
- [ ] **PROT-02**: BPC-157 + TB-500 Research Overview page exists with study citations
- [ ] **PROT-03**: CJC-1295 + Ipamorelin Research page exists with study citations
- [ ] **PROT-04**: GH Secretagogue Combinations page exists with study citations

### Phase 19: Enhanced UX

- [ ] **ENUX-01**: Peptide schema supports timeline array (period, effects based on studies)
- [ ] **ENUX-02**: Dossier pages display "What to Expect" timeline component
- [ ] **ENUX-03**: Peptide schema supports quality checklist (good/warning/bad signs)
- [ ] **ENUX-04**: Dossier pages display quality checklist with traffic light styling
- [ ] **ENUX-05**: Top 10 peptides have timeline and checklist data

### Phase 20: Programmatic SEO - Conditions

- [ ] **PSEO-01**: Peptide schema supports conditions array (slug, name, research summary, studies)
- [ ] **PSEO-02**: Condition page template exists at /peptides/[peptide]/[condition]
- [ ] **PSEO-03**: At least 100 condition pages generated
- [ ] **PSEO-04**: Peptide pages link to their condition pages
- [ ] **PSEO-05**: Condition pages link back to peptide and related peptides

### Phase 21: Location SEO - Cities

- [ ] **LSEO-01**: Clinic content collection exists with proper schema
- [ ] **LSEO-02**: City page template exists at /clinics/[city]
- [ ] **LSEO-03**: At least 50 city pages generated
- [ ] **LSEO-04**: City pages support featured listings for monetization

### Phase 22: SEO Polish + Launch

- [ ] **SPOL-01**: FAQPage schema markup on peptide Q&A sections
- [ ] **SPOL-02**: HowTo schema markup on calculator/reconstitution pages
- [ ] **SPOL-03**: LocalBusiness schema markup on clinic pages
- [ ] **SPOL-04**: Internal linking audit complete with fixes applied
- [ ] **SPOL-05**: Sitemap includes all new pages (1000+)
- [ ] **SPOL-06**: Core Web Vitals pass on mobile

---

## v5 Requirements (Deferred)

### Community Features

- **COMM-01**: User can create account with email/password
- **COMM-02**: User can submit experiences per peptide
- **COMM-03**: Aggregated community results display on dossier pages
- **COMM-04**: User can participate in discussion threads
- **COMM-05**: Moderation queue for admin review

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Dosing/protocol information | Maintains credibility positioning; avoids weak sources |
| Sourcing/vendor information | Legal risk |
| Medical advice | Liability |
| User-generated content (v4.0) | Moderation overhead; defer to v5.0 |
| Comments/community (v4.0) | Moderation overhead; defer to v5.0 |
| Real-time features | Static site, not needed |
| Mobile app | Web-first, possibly never |
| Supplement affiliates | Conflict of interest |

---

## Traceability

### v4 Requirements → Phases

| Requirement | Phase | Status |
|-------------|-------|--------|
| LEGL-01 to LEGL-07 | Phase 13 | Pending |
| CALC-01 to CALC-05 | Phase 14 | Pending |
| INTR-01 to INTR-03 | Phase 15 | Pending |
| DOSS-01 to DOSS-05 | Phase 16 | Pending |
| MIGR-01 to MIGR-06 | Phase 17 | Pending |
| PROT-01 to PROT-04 | Phase 18 | Pending |
| ENUX-01 to ENUX-05 | Phase 19 | Pending |
| PSEO-01 to PSEO-05 | Phase 20 | Pending |
| LSEO-01 to LSEO-04 | Phase 21 | Pending |
| SPOL-01 to SPOL-06 | Phase 22 | Pending |

**Coverage:**
- v4 requirements: 48 total
- Phase 13: 7 requirements (Legal)
- Phase 14: 5 requirements (Calculators)
- Phase 15: 3 requirements (Interactions)
- Phase 16: 5 requirements (Dossier UX)
- Phase 17: 6 requirements (Migration)
- Phase 18: 4 requirements (Protocols)
- Phase 19: 5 requirements (Enhanced UX)
- Phase 20: 5 requirements (Condition SEO)
- Phase 21: 4 requirements (City SEO)
- Phase 22: 6 requirements (SEO Polish)
- Unmapped: 0 ✓

---

*Requirements defined: 2026-01-19*
*Last updated: 2026-01-30 after v4.0 milestone start*
