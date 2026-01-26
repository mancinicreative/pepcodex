# PepCodex

## What This Is

An evidence-based peptide education website that synthesizes research from PubMed, clinical trials, and global literature into comprehensive dossiers. 188 pages live with automated content pipeline using n8n workflows.

## Core Value

**Become the authoritative, citation-heavy resource for peptide research** — no dosing, no protocols, no sourcing. Pure evidence synthesis that researchers, clinicians, and educated consumers can trust.

## Current Milestone: v2.0 Production Launch

**Goal:** Deploy site to production, configure analytics, establish development workflow, and begin outreach operations.

**Target features:**
- Live production site at pepcodex.com
- Google Analytics 4 tracking
- Development/staging workflow with Vercel preview URLs
- Google Search Console indexing
- Initial outreach system (sponsors + listings)

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

### Active (v2.0)

- [ ] Deploy to Vercel with custom domain
- [ ] Configure Squarespace DNS → Vercel
- [ ] Set up Google Analytics 4 tracking
- [ ] Submit sitemap to Google Search Console
- [ ] Establish main/develop branch workflow
- [ ] Create sponsor outreach templates
- [ ] Create listing outreach templates

### Out of Scope

- Dosing/protocol information — safety/legal risk
- Sourcing/vendor information — legal risk
- Medical advice — liability
- User accounts — defer to v3
- Comments/community features — moderation overhead
- Heart/interest system — defer to v3 (spec ready)

## Context

**Brand:**
- Domain: pepcodex.com (Squarespace)
- Email: info@pepcodex.com
- Hosting: Vercel (pending setup)

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

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Next.js | Content-focused, fastest SSG builds | ✓ Good |
| MDX Content Collections | Git-based, perfect for programmatic generation | ✓ Good |
| n8n over custom scripts | Visual workflows, native integrations | ✓ Good |
| Vercel for hosting | Free tier, preview URLs, easy custom domains | — Pending |
| Squarespace DNS | Domain already purchased there | — Pending |
| GA4 over alternatives | Industry standard, free, deep insights | — Pending |

---
*Last updated: 2026-01-26 after v2.0 milestone start*
