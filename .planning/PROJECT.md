# PepCodex

## What This Is

An evidence-based peptide education website that synthesizes research from PubMed, clinical trials, and global literature into comprehensive dossiers. 188 pages live with automated content pipeline using n8n workflows.

## Core Value

**Become the authoritative, citation-heavy resource for peptide research** — no dosing, no protocols, no sourcing. Pure evidence synthesis that researchers, clinicians, and educated consumers can trust.

## Current Milestone: v4.0 Competitive Enhancement + SEO Domination

**Goal:** Close feature gaps with competitors while maintaining credibility positioning, then dominate SEO with programmatic pages.

**Key Decision:** Skip dosing information entirely — calculators provide utility without liability, evidence-chained benefits provide transparency competitors lack.

**Target features:**
- Legal foundation (5 essential pages + disclaimers)
- Calculator suite (reconstitution, blend, accumulation)
- Peptide interactions matrix
- Dossier UX overhaul (molecular viz, evidence chains)
- Content migration (guides/safety → blog)
- Multi-peptide protocols (research-based, NOT dosing)
- Programmatic SEO (condition pages, city pages)

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

### On Hold (v3.0 Operations & Growth)

*Paused to prioritize competitive features. Resume after v4.0.*

- [ ] Operations infrastructure (templates, calendars, SOPs)
- [ ] Content production system (batch workflow, repurposing)
- [ ] Distribution system (Instagram, newsletter growth)
- [ ] Monetization foundation (directory, pricing, outreach)

### Active (v4.0)

**Phase 13: Legal Foundation**
- [ ] Disclaimer page (general + medical combined)
- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] FDA notice page
- [ ] Cookie policy page
- [ ] Site-wide disclaimer banner component
- [ ] Cookie consent popup component

**Phase 14: Calculator Suite**
- [ ] Reconstitution calculator with syringe visual
- [ ] Blend calculator for multi-peptide combinations
- [ ] Accumulation calculator for half-life tracking
- [ ] Calculator disclaimer component

**Phase 15: Peptide Interactions**
- [ ] Interactions schema (synergistic/compatible/caution/avoid)
- [ ] InteractionMatrix component with color coding
- [ ] Populate interaction data for major peptides

**Phase 16: Dossier UX Overhaul**
- [ ] MolecularStructure component (amino acid visualization)
- [ ] EvidenceChain component (mechanism → benefit → evidence)
- [ ] Reorganize dossier page sections
- [ ] Add molecular data to peptide schema
- [ ] Add evidence-chained benefits to peptide schema

**Phase 17: Content Migration**
- [ ] Reformat 11 guide pages to blog format
- [ ] Reformat 11 safety pages to blog format
- [ ] Create blog categories (Guides, Safety, Research Digest)
- [ ] Set up 301 redirects from old URLs
- [ ] Update internal links site-wide

**Phase 18: Multi-Peptide Protocols**
- [ ] Create protocols content collection
- [ ] BPC-157 + TB-500 Research Overview page
- [ ] CJC-1295 + Ipamorelin Research page
- [ ] GH Secretagogue Combinations page

**Phase 19: Enhanced UX**
- [ ] Timeline component ("What to Expect" based on studies)
- [ ] QualityChecklist component
- [ ] Add timeline/checklist data to top peptides

**Phase 20: Programmatic SEO - Conditions**
- [ ] Add condition mappings to peptide schema
- [ ] Create condition page template
- [ ] Generate [Peptide] + [Condition] pages (500-1000+)
- [ ] Internal linking automation

**Phase 21: Location SEO - Cities**
- [ ] Create clinic content collection
- [ ] Create city page template
- [ ] Generate top 100 US city pages
- [ ] Featured listing system for monetization

**Phase 22: SEO Polish + Launch**
- [ ] Schema markup (FAQPage, HowTo, LocalBusiness)
- [ ] Internal linking audit
- [ ] Sitemap optimization for 1000+ pages
- [ ] Core Web Vitals optimization
- [ ] Launch v4.0

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
- 188 pages live and indexed
- Competitive analysis complete (vs Peptide-db.com)
- Key differentiator: Evidence transparency + no dosing = credibility

**Competitor Analysis (Peptide-db.com):**
- 95 peptides vs our 188 (we have 2x content)
- They have: dosing, calculators, community, interactions
- We have: more content, better evidence grading, source quality scores
- Our strategy: Close feature gaps EXCEPT dosing to maintain credibility edge

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
- NO dosing, protocols, cycles, stacks (MAINTAINED in v4.0)
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

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Next.js | Content-focused, fastest SSG builds | ✓ Good |
| MDX Content Collections | Git-based, perfect for programmatic generation | ✓ Good |
| n8n over custom scripts | Visual workflows, native integrations | ✓ Good |
| Vercel for hosting | Free tier, preview URLs, easy custom domains | ✓ Good |
| Skip dosing in v4.0 | Maintains credibility, avoids weak sources | — Pending |
| Calculators as utility | Provides value without liability | — Pending |
| Evidence-chained benefits | Differentiates from competitor's bold claims | — Pending |
| Programmatic SEO | Scale to 1000+ pages for traffic | — Pending |

---
*Last updated: 2026-01-30 after v4.0 milestone start*
