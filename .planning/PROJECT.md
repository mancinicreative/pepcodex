# PepCodex

## What This Is

An evidence-based peptide education website that synthesizes research from PubMed, clinical trials, and global literature into comprehensive dossiers. ~593 pages live with automated content pipeline using n8n workflows.

## Core Value

**Become the authoritative, citation-heavy resource for peptide research** — no dosing, no protocols, no sourcing. Pure evidence synthesis that researchers, clinicians, and educated consumers can trust.

## Current Milestone: v4.0 Content Expansion

**Goal:** Scale from ~593 to ~1,132 high-quality indexable pages through massive content expansion while maintaining evidence-first standards.

**Key Decision:** Replace original competitive feature focus (interactions, UX overhaul) with aggressive content expansion strategy for SEO dominance.

**Target features:**
- 235 new comparison pages
- 141 new glossary terms
- 20 bioregulator dossiers (Khavinson peptides)
- 78 weekly news blog posts (6 months backdated)
- 15 condition hub pages
- 50 calculator URL routes
- Schema deployments (FAQ, HowTo, Drug)

## Requirements

### Validated (v1.0)

- ✓ Astro site with content collections — Phase 1
- ✓ 12-section dossier template with evidence grading — Phase 2
- ✓ Citation system with paywall flags — Phase 2
- ✓ n8n source pack workflow (PubMed, Europe PMC, ClinicalTrials.gov) — Phase 3
- ✓ n8n draft generator workflow (Claude API) — Phase 3
- ✓ n8n QA gate workflow (citation validation, banned content scan) — Phase 3
- ✓ n8n publisher workflow — Phase 3
- ✓ Beehiiv newsletter integration — Phase 4
- ✓ Pagefind search — Phase 4
- ✓ Trial tracker page — Phase 4
- ✓ 188 pages indexed (exceeded 45 target) — Phase 5

### Validated (v2.0)

- ✓ Deploy to Vercel with custom domain — Phase 6
- ✓ Configure Squarespace DNS → Vercel — Phase 6
- ✓ Set up Google Analytics 4 tracking (G-1M56CNL8CK) — Phase 7
- ✓ Submit sitemap to Google Search Console — Phase 7
- ✓ Establish main/develop branch workflow — Phase 6
- ✓ Beehiiv newsletter integration working — Phase 6

### Validated (v4.0 Pre-existing)

- ✓ Legal pages (disclaimer, privacy, terms) — exists
- ✓ Calculators (reconstitution, blend, accumulation) — exists
- ✓ FAQSchema component — exists (not deployed)
- ✓ ComparisonLayout template — exists

### On Hold (v3.0 Operations & Growth)

*Paused to prioritize content expansion. Resume after v4.0.*

- [ ] Operations infrastructure (templates, calendars, SOPs)
- [ ] Content production system (batch workflow, repurposing)
- [ ] Distribution system (Instagram, newsletter growth)
- [ ] Monetization foundation (directory, pricing, outreach)

### Active (v4.0 Content Expansion)

**Phase 23: Comparisons Batch 1 + Condition Hubs**
- [ ] COMP-01: Generate 55 high-priority comparison pages
- [ ] COND-01: Create ConditionLayout template
- [ ] COND-02 through COND-16: Create 15 condition hub pages

**Phase 24: Schema Deployments**
- [ ] SCHEMA-01: Deploy FAQSchema to top 20 peptide dossiers
- [ ] SCHEMA-02: Create HowToSchema component
- [ ] SCHEMA-03: Deploy HowToSchema to calculators
- [ ] SCHEMA-04: Create DrugSchema component
- [ ] SCHEMA-05: Deploy DrugSchema to dossiers
- [ ] SCHEMA-06: Add FAQs to comparison pages

**Phase 25: Glossary Expansion**
- [ ] GLOSS-01 through GLOSS-05: Add 141 glossary terms

**Phase 26: Bioregulators Batch 1**
- [ ] BIOREG-01 through BIOREG-10: Create 10 bioregulator dossiers
- [ ] BIOREG-21: Create bioregulators category page

**Phase 27: Bioregulators Batch 2**
- [ ] BIOREG-11 through BIOREG-20: Create 10 more bioregulator dossiers

**Phase 28: Weekly News Blog**
- [ ] BLOG-01: Write 36 posts (months 1-3 back)
- [ ] BLOG-02: Write 42 posts (months 4-6 back)
- [ ] BLOG-03 through BLOG-05: Backdate, cross-link, tag

**Phase 29: Comparisons Batch 2 + Calculators**
- [ ] COMP-02: Generate 180 additional comparisons
- [ ] COMP-03, COMP-04: FAQs and cross-linking
- [ ] CALC-01 through CALC-05: Calculator dynamic routes

### Deferred (Original v4.0 → v5.0)

*Original v4.0 features deferred to focus on content expansion:*

- [ ] Peptide interactions matrix
- [ ] Dossier UX overhaul (molecular viz, evidence chains)
- [ ] Content migration (guides/safety → blog)
- [ ] Multi-peptide protocols
- [ ] City pages (location SEO)

### Out of Scope

- Dosing/protocol information — maintains credibility positioning
- Sourcing/vendor information — legal risk
- Medical advice — liability
- User accounts — defer to v5
- Comments/community features — moderation overhead, defer to v5
- User-generated content — defer to v5

## Context

**Brand:**
- Domain: pepcodex.com (live)
- Email: info@pepcodex.com
- Hosting: Vercel (mancinicreative-pepcodex)
- GitHub: mancinicreative/pepcodex

**Current State:**
- ~593 pages live and indexed
- Calculators and legal pages exist
- ComparisonLayout and FAQSchema exist
- 72 peptide dossiers, 45 comparisons, 99 glossary terms

**Target State (v4.0):**
- ~1,132 pages
- 92 peptide dossiers (+20 bioregulators)
- 280 comparisons (+235)
- 240 glossary terms (+141)
- 151 blog posts (+78 weekly news)
- 15 condition hubs
- 53 calculator URLs (+50)

**Markets:** US + Canada first → Global
**Time Budget:** 10+ hours/week

**Revenue Model:**
1. Paid listings (clinics, telehealth) — $99-499/mo
2. Sponsors (category, site-wide) — $300-1,500/mo
3. Newsletter sponsors — $50-200/send
4. Affiliates (testing services, books, courses only)

**Content Model:**
- Peptide dossiers: 12-section format
- Evidence grading: High / Moderate / Low / Very Low
- Citations: PMID, DOI, NCT identifiers with paywall flags

**Safety Gates (HARD REQUIREMENTS):**
- NO dosing, protocols, cycles, stacks
- NO sourcing, vendors, where to buy
- NO medical advice, treatment recommendations
- All animal/in-vitro studies clearly labeled

**Stack:**
- Framework: Astro 4 with Content Collections
- Styling: Tailwind CSS
- Content: MDX
- Search: Pagefind
- Newsletter: Beehiiv API
- Pipeline: n8n
- Deploy: Vercel

## Constraints

- **Content Safety**: Hard gates on dosing/sourcing/medical advice
- **Citation Integrity**: Every claim must map to source pack
- **Evidence Labeling**: Animal/in-vitro studies must be marked
- **Automation First**: Pipeline must scale to 100+ pages
- **No Thin Content**: Every page must provide unique value

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Next.js | Content-focused, fastest SSG builds | ✓ Good |
| MDX Content Collections | Git-based, perfect for programmatic generation | ✓ Good |
| n8n over custom scripts | Visual workflows, native integrations | ✓ Good |
| Vercel for hosting | Free tier, preview URLs, easy custom domains | ✓ Good |
| Skip dosing permanently | Maintains credibility, avoids weak sources | ✓ Good |
| Calculators as utility | Provides value without liability | ✓ Good |
| Content expansion over features | SEO dominance through scale | — Pending |
| Bioregulator module | Niche authority in Khavinson peptides | — Pending |
| Weekly news backdating | Fresh content signal for SEO | — Pending |

---
*Last updated: 2026-02-01 after v4.0 Content Expansion milestone pivot*
