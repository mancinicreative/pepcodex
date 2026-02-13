# Phase 2: Architecture Assessment — ADRs & Tech Stack Analysis

**Skill:** `/system-architect`
**Date:** 2026-02-12
**Evaluator:** Studio Pipeline (retroactive)

---

## Tech Stack Summary

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Astro | ^5.16.11 | Static-first web framework |
| CSS | Tailwind CSS | ^4.1.18 | Utility-first CSS |
| Content | MDX | ^4.3.13 | Markdown + components |
| Hosting | Vercel | — | Edge deployment |
| Adapter | @astrojs/vercel | ^9.0.4 | SSR + ISR support |
| Search | Pagefind | ^1.4.0 | Build-time search index |
| Schema validation | Zod | (via Astro) | Content schema enforcement |
| Content validation | AJV | ^8.17.1 | JSON schema validation |
| Newsletter | Beehiiv API | — | Email subscription management |
| Analytics | GA4 + Vercel | — | Traffic tracking |
| SEO | Sitemap | ^3.7.0 | XML sitemap generation |

**Assessment: Solid, modern stack. No unnecessary dependencies. Total: 11 packages (6 deps + 5 devDeps).**

---

## ADR-001: Server-Side Rendering vs Static Site Generation

### Decision
The project uses `output: 'server'` (SSR by default) with selective `prerender: true` on specific pages.

### Context
- Astro supports three output modes: `static`, `server`, `hybrid`
- The site is primarily content-driven with 872 static content files
- Only 3 routes need dynamic behavior: `/api/health`, `/api/subscribe`, `/api/peptide-search.json`

### Current State
- **SSR (default):** All 48 page routes render on every request
- **Prerender exceptions:** Only `peptide-search.json.ts` and `clinics/[city].astro` have `prerender: true`
- **Impact:** ~45 pages that could be static are being server-rendered on every request

### Recommendation
Switch to `output: 'static'` (or `hybrid`) and use `prerender: false` only on the 3 API routes. This would:
- Eliminate ~45 unnecessary SSR invocations per page load
- Reduce Vercel serverless function costs
- Improve TTFB significantly
- Enable CDN edge caching for all content pages

### Priority: HIGH

---

## ADR-002: Content Architecture (Astro Content Collections)

### Decision
Content is organized into 12 Astro Content Collections with Zod-validated schemas.

### Assessment

**Strengths:**
- Every collection has comprehensive Zod schemas with proper types
- SEO fields standardized across all collections via `seoFields` spread
- Evidence grading built into schemas (`evidenceStrength`, `evidenceLevel`, `mechanismConfidence`)
- Cross-linking via slug references (`relatedPeptides`, `relatedTerms`, `comparators`)
- Rich data structures: `molecularInfo`, `evidenceChainedBenefits`, `interactions`, `timeline`, `qualityChecklist`

**Concerns:**
- `conditions` collection maps to `conditionHubs` but exported as `conditions` — slight naming inconsistency
- `pages` collection is empty (0 files) — unused collection
- `clinics` collection has verification fields (`verifiedListing`) but only 10 entries
- No versioning or changelog tracking on content files

### Score: 4/4 — Excellent content architecture

---

## ADR-003: Layout Architecture

### Decision
10 specialized layouts, each extending BaseLayout with content-type-specific structure.

### Layout Inventory

| Layout | Used By | Has ToC | Has Breadcrumbs | Has Schema |
|---|---|---|---|---|
| BaseLayout | All pages | — | — | Organization |
| DossierLayout | Peptide pages | Yes | Yes | Drug, Breadcrumb, FAQ |
| ComparisonLayout | Compare pages | No | No | Article |
| BlogLayout | Blog posts | Yes | No | Article |
| GuideLayout | Guide pages | Yes | No | — |
| GlossaryLayout | Glossary terms | Yes | Yes | Breadcrumb |
| SafetyLayout | Safety articles | Yes | No | — |
| ConditionLayout | Condition hubs | Yes | Yes | Breadcrumb |
| HubLayout | Hub pages | No | No | — |
| ProtocolLayout | Protocol pages | Yes | No | — |

### Gaps
- **Breadcrumbs missing from 7/10 layouts** — ComparisonLayout, BlogLayout, GuideLayout, SafetyLayout, HubLayout, ProtocolLayout need BreadcrumbSchema
- **ToC missing from 2 layouts** — ComparisonLayout and HubLayout should have ToC for long-form content
- **Schema types inconsistent** — Only 3 layouts have structured data beyond Organization

### Priority: MEDIUM

---

## ADR-004: API Architecture

### Decision
3 API routes implemented as Astro API routes in `src/pages/api/`.

### Route Assessment

| Route | Method | Prerender | Purpose | Issues |
|---|---|---|---|---|
| `/api/health` | GET | No | Health check | Leaks config info (hasBeehiivKey, hasBeehiivPubId) |
| `/api/subscribe` | POST | No | Newsletter subscription | No rate limiting, no CSRF, CORS: `*` |
| `/api/peptide-search.json` | GET | Yes | Search index | Only indexes peptides (not all content) |

### Security Concerns (see Phase 4 for details)
1. Health endpoint exposes internal configuration
2. Subscribe endpoint has no abuse prevention
3. No input sanitization beyond basic email regex
4. CORS allows any origin

### Priority: CRITICAL (security)

---

## ADR-005: Component Architecture

### Decision
29 components organized flat in `src/components/` with an `SEO/` subdirectory for schema components.

### Component Categories

**UI Components (14):**
BlogCard, CitationTable, ClinicCard, ComparisonCard, CookieConsent, DisclaimerBanner, EvidenceBadge, EvidenceChain, InteractionMatrix, MolecularStructure, NewsletterForm, PeptideCard, QualityChecklist, SafetyBanner

**Navigation Components (4):**
OverviewSection, RelatedEntities, SearchBar, TableOfContents

**Data Display Components (3):**
FeaturedClinicCard, Timeline, TrialTable

**SEO Components (8):**
ArticleSchema, BreadcrumbSchema, DrugSchema, FAQSchema, HowToSchema, ItemListSchema, JsonLd, OrganizationSchema

### Assessment
- Good separation between UI and SEO concerns
- Components are Astro-only (no React/Vue/Svelte) — simpler architecture
- No component library or Storybook — components only testable in context
- Some components may be built but not deployed (needs verification in Phase 3)

### Score: 3/4 — Good, could benefit from better organization

---

## ADR-006: Styling Architecture

### Decision
Tailwind CSS v4 with CSS custom properties for design tokens, defined in `global.css`.

### Token System

**Color tokens:** HSL-based for Tailwind compatibility
- Core: background, foreground, card, primary, secondary, muted, accent, destructive
- Semantic: success, warning, error
- Text opacity: 3 levels (high/medium/low)
- Glass surfaces: 3 levels (default/hover/active)
- Glow shadows: 3 levels (sm/md/lg)

**Typography:** Single font family (Outfit) for sans, display, and tech
**Spacing:** Custom scale from `--space-1` (4px) to `--space-24` (96px)
**Radius:** Single `--radius` variable with sm/md/lg computed variants

### Patterns
- Glass card system with 3 variants (base, hover, interactive)
- Button system with 4 variants (primary, secondary, ghost) and 3 sizes
- Badge system with 6 color variants
- Section header pattern
- Prose styling for markdown content

### Concerns
- Legacy aliases still present (`.glass-card-default`, `.glass-card-hoverable`, `.glass-panel`) — dead code
- `@import url()` for Google Fonts is render-blocking
- Dark-mode only design (no light mode variant)

### Score: 3/4 — Well-organized, minor cleanup needed

---

## ADR-007: Build & Deploy Pipeline

### Decision
Astro builds to Vercel with Pagefind postbuild for search indexing.

### Pipeline
```
npm run build → astro build → postbuild: pagefind --site dist → Deploy to Vercel
```

### Configuration
- Vercel adapter with `imageService: true` (image optimization available)
- Sitemap integration (automatic)
- MDX integration for rich content
- Markdown syntax highlighting via Shiki (github-light theme)

### Concerns
- `imageService: true` is configured but not utilized (no `<Image>` components found)
- Build output is SSR (serverless functions) instead of static assets for most pages
- No CI/CD configuration visible (relies on Vercel Git integration)
- No build health checks or lint pipeline

### Score: 2/4 — Functional but underutilized (SSR waste, image optimization unused)

---

## Architecture Quality Summary

| Dimension | Score (0-4) | Notes |
|---|---|---|
| Stack selection | 4 | Modern, appropriate for content site |
| Content architecture | 4 | 12 collections with rich Zod schemas |
| Component architecture | 3 | Good structure, needs better organization |
| Layout architecture | 3 | Comprehensive, inconsistent feature coverage |
| API design | 2 | Functional but security gaps |
| Styling/tokens | 3 | Well-organized, minor cleanup needed |
| Build pipeline | 2 | SSR waste, unused image optimization |
| Overall | **21/28 = 75%** | Solid foundation, performance + security gaps |

---

## Gate Assessment

- [x] All architectural decisions documented as ADRs
- [x] Tech stack assessed with versions
- [x] Security concerns flagged for Phase 4
- [x] Performance concerns flagged for Phase 4
- [x] Component inventory complete

**Phase 2 Architecture Gate: PASS**
