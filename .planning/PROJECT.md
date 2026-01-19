# Peptide Library

## What This Is

An evidence-based peptide education website that synthesizes research from PubMed, clinical trials, and global literature into comprehensive dossiers. Automated content pipeline using n8n workflows with Claude API for draft generation and QA gates.

## Core Value

**Become the authoritative, citation-heavy resource for peptide research** — no dosing, no protocols, no sourcing. Pure evidence synthesis that researchers, clinicians, and educated consumers can trust.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Build Astro site with content collections for peptide dossiers
- [ ] Create 12-section dossier template with evidence grading
- [ ] Implement citation system with paywall flags
- [ ] Build n8n source pack workflow (PubMed, Europe PMC, ClinicalTrials.gov)
- [ ] Build n8n draft generator workflow (Claude API)
- [ ] Build n8n QA gate workflow (citation validation, banned content scan)
- [ ] Build n8n publisher workflow
- [ ] Integrate Beehiiv newsletter
- [ ] Create trial tracker with Turso
- [ ] Implement Pagefind search
- [ ] Deploy to Vercel

### Out of Scope

- Dosing/protocol information — safety/legal risk
- Sourcing/vendor information — legal risk
- Medical advice — liability
- User accounts — unnecessary for v1
- Comments/community features — moderation overhead

## Context

**Content Model:**
- Peptide dossiers: 12-section format (overview, mechanisms, research summary, human trials, safety, etc.)
- Evidence grading: High / Moderate / Low / Very Low
- Citations: PMID, DOI, NCT identifiers with paywall flags
- Source packs: JSON bundles of research per peptide

**Safety Gates (HARD REQUIREMENTS):**
- NO dosing, protocols, cycles, stacks
- NO sourcing, vendors, where to buy
- NO medical advice, treatment recommendations
- All animal/in-vitro studies clearly labeled
- Overclaim scanning (no "proven", "cures", "guaranteed")

**Content Pipeline:**
1. Source Pack Builder → PubMed/Europe PMC/ClinicalTrials.gov APIs
2. Draft Generator → Claude API with Prompt A template
3. QA Gate → Citation validation, banned content scan
4. Publisher → Git commit, sitemap update, Vercel deploy

**Target Scale:**
- Week 1: 45 pages (15 dossiers + 30 long-tail)
- Week 2: 150-250 pages total
- First 15: GLP-1 cluster + high-search peptides

**Stack:**
- Framework: Astro 4 with Content Collections
- Styling: Tailwind CSS
- Content: MDX
- Database: Turso (SQLite) for trial tracker
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
| Astro over Next.js | Content-focused, fastest SSG builds | — Pending |
| MDX Content Collections | Git-based, perfect for programmatic generation | — Pending |
| Turso for trial tracker | Edge-ready SQLite, simple for read-heavy | — Pending |
| n8n over custom scripts | Visual workflows, native integrations | — Pending |
| No open/click tracking | Unnecessary complexity for content site | — Pending |

---
*Last updated: 2026-01-19 after initialization*
