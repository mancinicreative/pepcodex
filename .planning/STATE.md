# Project State: Peptide Library

## Current Phase

**Phase 4: Features + Polish** — COMPLETE

## Active Plan

None — Phase 4 complete

## What's Done

### Phase 1: Site Foundation
- Fixed content schema (removed `slug` field)
- Fixed tirzepatide.mdx frontmatter
- Fixed Pagefind dynamic import
- Fixed [slug].astro dynamic route
- Build passes: 11 pages generated
- robots.txt added
- Sitemap auto-generated

### Phase 2: Content Templates (COMPLETE)
- **DossierLayout:** Enhanced with 12-section navigation and scroll highlighting
- **ComparisonLayout:** Side-by-side peptide comparison view
- **GuideLayout:** Educational "What is X" format
- **SafetyLayout:** Clinical trial safety information with warnings
- **Sample content:** tirzepatide.mdx (12 sections), comparison, guide, safety pages
- **Dynamic routes:** /compare/, /guide/, /safety/
- Build passes: 14 pages generated

### Phase 3: Pipeline Infrastructure (COMPLETE)
- **03-01:** Source pack JSON schema and validation script
- **03-02:** QA validation scripts (banned content, citations, evidence labels)
- **03-03:** QA orchestrator combining all validation
- **03-04/05:** n8n workflow JSONs for full automation pipeline

**n8n Workflows Created:**
- `source-pack-builder.json` - PubMed/EuropePMC/ClinicalTrials API integration
- `draft-generator.json` - Claude API with 12-section dossier template
- `qa-gate.json` - runs qa-validate.js, triggers publisher on pass
- `publisher.json` - git add/commit/push with optional Vercel deploy
- `batch-orchestrator.json` - loops peptide list through full pipeline

### Phase 4: Features + Polish (COMPLETE)
- **Beehiiv Newsletter Integration:** src/lib/beehiiv.ts, /api/subscribe endpoint, NewsletterForm component
- **Pagefind Search:** postbuild indexing script, SearchBar integration (15 pages indexed)
- **Trial Tracker Page:** /trials page with TrialTable component, filtering by status/phase/peptide
- **Node Adapter:** Added @astrojs/node for API routes support

### Existing Code
- Astro project with Tailwind, MDX, sitemap, Node adapter
- Layouts: BaseLayout, DossierLayout, HubLayout, ComparisonLayout, GuideLayout, SafetyLayout
- Components: EvidenceBadge, CitationTable, SearchBar, NewsletterForm, PeptideCard, ComparisonCard, TableOfContents, TrialTable
- Pages: homepage, peptides index, category hubs, trust core pages, compare, guide, safety, trials, newsletter
- Sample dossier: tirzepatide.mdx (12 sections)

## What's Next

**Ready for Production:**
- Import n8n workflows and configure credentials
- Run batch processing for initial peptide set
- Configure deployment (Vercel, Netlify, or self-hosted Node)
- Set BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID environment variables

## Context for Resume

Phase 3 complete with full automation pipeline:

**Local Scripts (Node.js):**
- `scripts/validate-source-pack.js` - validates source pack JSON
- `scripts/qa-banned-content.js` - scans for dosing/sourcing language
- `scripts/qa-citations.js` - validates citations against source pack
- `scripts/qa-evidence-labels.js` - checks animal/in-vitro labeling
- `scripts/qa-validate.js` - orchestrates all QA checks

**n8n Workflows:**
- Source Pack Builder: 3 API sources, auto-formats to schema
- Draft Generator: Claude API with 12-section template, saves MDX
- QA Gate: Runs validation, logs failures, triggers publisher
- Publisher: Git workflow with optional Vercel deploy hook
- Batch Orchestrator: Full pipeline with rate limiting and reporting

**Sample Data:**
- `data/source-packs/tirzepatide.json` with 12 real citations and 4 clinical trials
- `data/schemas/source-pack.schema.json` for validation

## Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Use ajv for JSON Schema validation | Standard Node.js validator, supports draft-07 | 2026-01-19 |
| Separate QA scripts for modularity | Each can run standalone and be combined | 2026-01-19 |
| JSON output flag for machine use | Enables n8n/automation integration | 2026-01-19 |
| 12-section dossier structure | Matches Prompt A requirements for comprehensive coverage | 2026-01-19 |
| Scroll-based section highlighting | Improves navigation UX on long dossier pages | 2026-01-19 |
| Amber color accent for safety pages | Visual differentiation for safety-critical content | 2026-01-19 |
| Webhook triggers for n8n workflows | Enables chaining and external invocation | 2026-01-19 |
| Rate limiting between API calls | Respects PubMed/CT.gov rate limits | 2026-01-19 |
| Node adapter for static+server | Enables API routes in static builds | 2026-01-19 |
| Trial data from source packs | Single source of truth for peptide data | 2026-01-19 |

## Progress

```
Phase 1: Site Foundation      [========] 100%
Phase 2: Content Templates    [========] 100%
Phase 3: Pipeline Infra       [========] 100%
Phase 4: Features + Polish    [========] 100%  <-- JUST COMPLETED
```

## Blockers

None

## Session Log

- 2026-01-19: GSD structure initialized
- 2026-01-19: Phase 1 completed - build fixed, all pages rendering
- 2026-01-19: Phase 3 plans 03-01, 03-02, 03-03 completed - QA scripts working
- 2026-01-19: Phase 2 plan 02-01 completed - all 4 template types with sample content
- 2026-01-19: Phase 3 n8n workflows completed - 5 workflow JSONs created
- 2026-01-19: Phase 4 completed - Beehiiv, Pagefind, Trial Tracker features

---
*Last updated: 2026-01-19*
