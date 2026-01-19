# Project State: Peptide Library

## Current Phase

**Phase 3: Pipeline Infrastructure** — QA scripts and source pack schema complete

## Active Plan

Plans 03-01, 03-02, 03-03 COMPLETE

## What's Done

### Phase 1: Site Foundation
- Fixed content schema (removed `slug` field)
- Fixed tirzepatide.mdx frontmatter
- Fixed Pagefind dynamic import
- Fixed [slug].astro dynamic route
- Build passes: 11 pages generated
- robots.txt added
- Sitemap auto-generated

### Phase 3: Pipeline Infrastructure (Partial)
- **03-01:** Source pack JSON schema and validation script
- **03-02:** QA validation scripts (banned content, citations, evidence labels)
- **03-03:** QA orchestrator combining all validation

### Existing Code
- Astro project with Tailwind, MDX, sitemap
- Layouts: BaseLayout, DossierLayout, HubLayout
- Components: EvidenceBadge, CitationTable, SearchBar, NewsletterForm, PeptideCard, ComparisonCard, TableOfContents
- Pages: homepage, peptides index, category hubs, trust core pages
- Sample dossier: tirzepatide.mdx

## What's Next

**Phase 3 Remaining (n8n workflows):**
- 03-04: Source Pack Builder n8n workflow
- 03-05: Draft Generator + QA Gate n8n workflows

**Phase 2: Content Templates** (can run in parallel)
1. Enhance dossier template to full 12-section structure
2. Create comparison page template
3. Create "What is X" guide template
4. Create safety page template

## Context for Resume

Phase 3 local scripts complete:
- `scripts/validate-source-pack.js` - validates source pack JSON
- `scripts/qa-banned-content.js` - scans for dosing/sourcing language
- `scripts/qa-citations.js` - validates citations against source pack
- `scripts/qa-evidence-labels.js` - checks animal/in-vitro labeling
- `scripts/qa-validate.js` - orchestrates all QA checks

Sample source pack exists: `data/source-packs/tirzepatide.json` with 12 real citations and 4 clinical trials.

**Note:** Current tirzepatide.mdx fails QA due to dosing section - this is expected, content needs cleaning.

## Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Use ajv for JSON Schema validation | Standard Node.js validator, supports draft-07 | 2026-01-19 |
| Separate QA scripts for modularity | Each can run standalone and be combined | 2026-01-19 |
| JSON output flag for machine use | Enables n8n/automation integration | 2026-01-19 |

## Blockers

None

## Session Log

- 2026-01-19: GSD structure initialized
- 2026-01-19: Phase 1 completed - build fixed, all pages rendering
- 2026-01-19: Phase 3 plans 03-01, 03-02, 03-03 completed - QA scripts working

---
*Last updated: 2026-01-19*
