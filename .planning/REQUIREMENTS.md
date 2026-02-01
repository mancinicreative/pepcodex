# Requirements: PepCodex

**Defined:** 2026-01-19 | **Updated:** 2026-02-01
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

*v3.0 Operations & Growth paused to prioritize v4.0 content expansion. Resume after v4.0.*

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

**Content Expansion for SEO Domination. Maps to Phases 23-29.**

Goal: Scale from ~593 to ~1,132 high-quality indexable pages.

### COMP — Comparison Pages (+235)

- [ ] **COMP-01**: Generate 55 high-priority comparison pages (GLP-1, GH, healing, cognitive)
- [ ] **COMP-02**: Generate 180 additional comparison pages (all valid pairs)
- [ ] **COMP-03**: Add FAQs to each comparison for schema markup
- [ ] **COMP-04**: Cross-link comparisons to both peptide dossiers

### GLOSS — Glossary Expansion (+141)

- [ ] **GLOSS-01**: Add 40 mechanism terms (receptor agonism, signal transduction, etc.)
- [ ] **GLOSS-02**: Add 20 study type terms (meta-analysis, RCT, cohort, etc.)
- [ ] **GLOSS-03**: Add 30 peptide terms (bioavailability, reconstitution, etc.)
- [ ] **GLOSS-04**: Add 20 regulatory terms (IND, NDA, Phase I/II/III, etc.)
- [ ] **GLOSS-05**: Add 31 chemistry terms (amino acid, N-terminus, etc.)

### BIOREG — Bioregulator Dossiers (+20)

- [ ] **BIOREG-01**: Create Vilon dossier (thymus dipeptide Lys-Glu)
- [ ] **BIOREG-02**: Create Prostatilen dossier (prostate peptide complex)
- [ ] **BIOREG-03**: Create Retinalamin dossier (retinal peptide)
- [ ] **BIOREG-04**: Create Livagen dossier (liver tripeptide Lys-Glu-Asp)
- [ ] **BIOREG-05**: Create Kristagen dossier (immune tripeptide Glu-Asp-Gly)
- [ ] **BIOREG-06**: Create Vesugen dossier (vascular tripeptide Lys-Glu-Asp)
- [ ] **BIOREG-07**: Create Cardiogen dossier (cardiac tripeptide Ala-Glu-Asp)
- [ ] **BIOREG-08**: Create Bronchogen dossier (bronchial tripeptide Ala-Glu-Asp-Leu)
- [ ] **BIOREG-09**: Create Chonluten dossier (GI tract tripeptide Glu-Asp-Gly)
- [ ] **BIOREG-10**: Create Testagen dossier (testicular tripeptide)
- [ ] **BIOREG-11**: Create Ovagen dossier (hepatic tripeptide Glu-Asp-Leu)
- [ ] **BIOREG-12**: Create Pancragen dossier (pancreatic tripeptide Lys-Glu-Asp-Trp)
- [ ] **BIOREG-13**: Create Stamakort dossier (gastric mucosa peptide)
- [ ] **BIOREG-14**: Create Vladonix dossier (thymus cytamin)
- [ ] **BIOREG-15**: Create Endoluten dossier (pineal cytamin)
- [ ] **BIOREG-16**: Create Cerluten dossier (brain cytamin)
- [ ] **BIOREG-17**: Create Ventfort dossier (vascular cytamin)
- [ ] **BIOREG-18**: Create Svetinorm dossier (liver cytamin)
- [ ] **BIOREG-19**: Create Suprefort dossier (pancreatic cytamin)
- [ ] **BIOREG-20**: Create Sigumir dossier (cartilage cytamin)
- [ ] **BIOREG-21**: Create bioregulators category page

### BLOG — Weekly News Posts (+78)

- [ ] **BLOG-01**: Research and write 36 posts for weeks 1-12 (months 1-3 back)
- [ ] **BLOG-02**: Research and write 42 posts for weeks 13-26 (months 4-6 back)
- [ ] **BLOG-03**: Backdate all posts appropriately (Mon/Wed/Fri per week)
- [ ] **BLOG-04**: Cross-link posts to relevant peptide dossiers
- [ ] **BLOG-05**: Add peptide tags and category frontmatter

### COND — Condition Hub Pages (+15)

- [ ] **COND-01**: Create ConditionLayout template
- [ ] **COND-02**: Create peptides-for-weight-loss hub
- [ ] **COND-03**: Create peptides-for-muscle-growth hub
- [ ] **COND-04**: Create peptides-for-healing hub
- [ ] **COND-05**: Create peptides-for-anti-aging hub
- [ ] **COND-06**: Create peptides-for-sleep hub
- [ ] **COND-07**: Create peptides-for-gut-health hub
- [ ] **COND-08**: Create peptides-for-hair-growth hub
- [ ] **COND-09**: Create peptides-for-skin hub
- [ ] **COND-10**: Create peptides-for-inflammation hub
- [ ] **COND-11**: Create peptides-for-joint-pain hub
- [ ] **COND-12**: Create peptides-for-cognition hub
- [ ] **COND-13**: Create peptides-for-immune-support hub
- [ ] **COND-14**: Create peptides-for-fat-loss hub
- [ ] **COND-15**: Create peptides-for-injury-recovery hub
- [ ] **COND-16**: Create peptides-for-longevity hub

### SCHEMA — Schema Deployments

- [ ] **SCHEMA-01**: Deploy FAQSchema to top 20 peptide dossiers
- [ ] **SCHEMA-02**: Create HowToSchema component for calculators
- [ ] **SCHEMA-03**: Deploy HowToSchema to all 3 calculators
- [ ] **SCHEMA-04**: Create DrugSchema component for dossiers
- [ ] **SCHEMA-05**: Deploy DrugSchema to all peptide dossiers
- [ ] **SCHEMA-06**: Add FAQs to comparison pages for schema

### CALC — Calculator Dynamic Routes (+50)

- [ ] **CALC-01**: Create /calculator/reconstitution/[peptide].astro
- [ ] **CALC-02**: Create /calculator/blend/[peptide].astro
- [ ] **CALC-03**: Create /calculator/accumulation/[peptide].astro
- [ ] **CALC-04**: Implement getStaticPaths for top 50 peptides
- [ ] **CALC-05**: Add internal links from dossier pages

---

## v5 Requirements (Deferred)

*Original v4.0 features + Community deferred to v5.0 to prioritize content expansion.*

### Original v4.0 Features (Deferred)

- [ ] **LEGL-01** to **LEGL-07**: Legal pages (disclaimer, privacy, terms, FDA, cookie) — *Already exists*
- [ ] **CALC-01** to **CALC-05**: Calculator features — *Already exists*
- [ ] **INTR-01** to **INTR-03**: Peptide interactions matrix
- [ ] **DOSS-01** to **DOSS-05**: Dossier UX overhaul (molecular viz, evidence chains)
- [ ] **MIGR-01** to **MIGR-06**: Content migration (guides/safety → blog)
- [ ] **PROT-01** to **PROT-04**: Multi-peptide protocols
- [ ] **ENUX-01** to **ENUX-05**: Enhanced UX (timelines, quality checklists)
- [ ] **LSEO-01** to **LSEO-04**: City pages (location SEO)

### Community Features (Deferred)

- [ ] **COMM-01**: User can create account with email/password
- [ ] **COMM-02**: User can submit experiences per peptide
- [ ] **COMM-03**: Aggregated community results display on dossier pages
- [ ] **COMM-04**: User can participate in discussion threads
- [ ] **COMM-05**: Moderation queue for admin review

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
| COMP-01, COND-01 to COND-16 | Phase 23 | Pending |
| SCHEMA-01 to SCHEMA-06 | Phase 24 | Pending |
| GLOSS-01 to GLOSS-05 | Phase 25 | Pending |
| BIOREG-01 to BIOREG-10, BIOREG-21 | Phase 26 | Pending |
| BIOREG-11 to BIOREG-20 | Phase 27 | Pending |
| BLOG-01 to BLOG-05 | Phase 28 | Pending |
| COMP-02 to COMP-04, CALC-01 to CALC-05 | Phase 29 | Pending |

**Coverage:**
- v4 requirements: 62 total
- Phase 23: 17 requirements (Comparisons Batch 1 + Condition Hubs)
- Phase 24: 6 requirements (Schema Deployments)
- Phase 25: 5 requirements (Glossary Expansion)
- Phase 26: 12 requirements (Bioregulators Batch 1)
- Phase 27: 10 requirements (Bioregulators Batch 2)
- Phase 28: 5 requirements (Weekly News Blog)
- Phase 29: 9 requirements (Comparisons Batch 2 + Calculators)
- Unmapped: 0 ✓

---

*Requirements defined: 2026-01-19*
*Last updated: 2026-02-01 after v4.0 Content Expansion pivot*
