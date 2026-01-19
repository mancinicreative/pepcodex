# Project State: Peptide Library

## Current Phase

**Phase 1: Site Foundation** — Fix build, complete core site structure

## Active Plan

**01-01: Fix build errors and verify site works**
- Status: In Progress
- Known issue: Content schema has `slug` field but Astro auto-generates from filename

## What's Done

### Code Written (Previous Session)
- Astro project initialized with Tailwind, MDX, sitemap
- Directory structure created
- Content collections schema (needs fix)
- Layouts: BaseLayout, DossierLayout, HubLayout
- Components: EvidenceBadge, CitationTable, SearchBar, NewsletterForm, PeptideCard, ComparisonCard, TableOfContents
- Pages: homepage, peptides index, category hubs, trust core pages
- Sample dossier: tirzepatide.mdx (needs fix)

### What's Broken
- Build fails: `slug: Required` error in content schema
- Fix: Remove `slug` from schema and tirzepatide.mdx frontmatter

## What's Next

1. Fix content schema (remove slug field)
2. Fix tirzepatide.mdx (remove slug from frontmatter)
3. Verify build passes
4. Add robots.txt
5. Mark Phase 1 complete

## Context for Resume

The site structure is ~80% complete from a previous session. The main blocker is a build error where the content schema requires a `slug` field but Astro auto-generates this from the filename. After fixing the build, Phase 1 will be complete and we can move to Phase 2 (Content Templates) or Phase 3 (Pipeline Infrastructure).

## Blockers

- [ ] Build error: slug field in content schema

## Session Log

- 2026-01-19: GSD structure initialized, capturing existing code state

---
*Last updated: 2026-01-19*
