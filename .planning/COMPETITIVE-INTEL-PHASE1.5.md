# PHASE 1.5: TECHNICAL SEO & INDEXATION AUDIT
## Pepcodex Competitive Intelligence

**Generated:** 2026-02-01
**Your Product:** pepcodex.com | Evidence-based peptide research database

---

## Evidence Classification

- **KNOWN** = Verified from direct observation (robots.txt, sitemap, page source)
- **LIKELY** = Strong inference from observable patterns
- **UNKNOWN** = Requires paid tools or field data for verification

---

# ROBOTS.TXT ANALYSIS

## peptide-db.com

| Directive | Value | Analysis |
|-----------|-------|----------|
| User-agent | * | Universal rules |
| Allow | / | Full site access |
| Disallow | /api/ | API endpoints blocked |
| Sitemap | /sitemap.xml | Standard location |

**Bot Blocking:**
- Blocks: `AhrefsBot`, `MJ12bot` (Majestic), `DotBot`
- **Allows**: Googlebot, Bingbot, ClaudeBot

**Assessment:** Standard configuration. Blocking SEO tool bots suggests awareness of competitive analysis.

---

## peptibase.dev

| Directive | Value | Analysis |
|-----------|-------|----------|
| User-agent | * | Universal rules |
| Allow | / | Full site access |
| Disallow | /api/ | API endpoints blocked |
| Sitemap | /sitemap.xml | Standard location |

**Bot Blocking:**
- Blocks: None observed
- **Explicitly allows**: All bots including ClaudeBot

**Assessment:** More permissive configuration. Either less concerned about competitive analysis or prioritizing AI indexing.

---

## Pepcodex Opportunity

| Action | Priority |
|--------|----------|
| Ensure sitemap declared in robots.txt | High |
| Consider blocking AhrefsBot/MJ12bot (optional) | Low |
| Keep ClaudeBot allowed for AI visibility | Medium |

---

# SITEMAP ANALYSIS

## peptide-db.com (726 URLs)

### URL Distribution

| Content Type | Count | Percentage |
|--------------|-------|------------|
| Peptide pages | 126 | 17% |
| Calculator URLs | ~250 | 34% |
| Category filters | 10 | 1% |
| Guide articles | 3 | 0.4% |
| Blend calculator | 3 | 0.4% |
| Other/static | ~334 | 46% |
| **Total** | **726** | 100% |

### Sitemap Structure
- **Format:** Flat XML (single sitemap, no index)
- **Update frequency:** Monthly (`changefreq: monthly`)
- **Priority range:** 0.3 - 1.0
  - Homepage: 1.0
  - Peptide pages: 0.8
  - Calculator pages: 0.6
  - Static pages: 0.3

### Key Observation
**Calculator URL Multiplication Strategy:**
- 250 URLs for `/calculator/accumulation?peptide=[slug]`
- Each peptide gets its own calculator landing page
- Captures "[peptide name] calculator" search queries

---

## peptibase.dev (841 URLs)

### URL Distribution

| Content Type | Count | Percentage |
|--------------|-------|------------|
| Peptide main pages | 71 | 8% |
| How-to-use subpages | 71 | 8% |
| Alternatives subpages | 71 | 8% |
| Comparison pages | 66 | 8% |
| Best-for pages | 6 | 0.7% |
| Tool pages | 4 | 0.5% |
| Category pages | 11 | 1% |
| Other/static | ~541 | 64% |
| **Total** | **841** | 100% |

### Sitemap Structure
- **Format:** Sitemap index with multiple sitemaps (LIKELY)
- **Update frequency:** Not specified in source
- **Last modified:** Dynamic per page

### Key Observation
**Subpage Tripling Strategy:**
- Every peptide generates 3 URLs:
  - `/peptides/[slug]` (main)
  - `/peptides/[slug]/how-to-use` (practical guide)
  - `/peptides/[slug]/alternatives` (related peptides)
- 71 peptides × 3 = **213 peptide-related URLs**

**Comparison Page Network:**
- 66 dedicated comparison pages
- Pattern: `/compare/[peptide-a]-vs-[peptide-b]`
- Captures "[A] vs [B]" search intent

---

## Comparative Analysis

| Metric | peptide-db.com | peptibase.dev | pepcodex.com |
|--------|----------------|---------------|--------------|
| Total URLs | 726 | 841 | 188 |
| Peptide main pages | 126 | 71 | ~45 |
| URLs per peptide | 1 + calculator | 3 (main + 2 subpages) | 1 |
| Comparison pages | 0 | 66 | 11 |
| Calculator pages | 250+ | 4 | 3 |
| "Best for" pages | 0 | 6 | 0 |

### URL Surface Multiplier

| Site | Peptides | URL Multiplier | Total Peptide URLs |
|------|----------|----------------|-------------------|
| peptide-db.com | 126 | ~2.5x (calculator) | ~315 |
| peptibase.dev | 71 | 3x (subpages) | 213 |
| pepcodex.com | 45 | 1x | 45 |

**Gap:** Pepcodex has 4-7x fewer peptide-related URLs than competitors.

---

# SCHEMA MARKUP AUDIT

## peptide-db.com (BASIC)

### Schema Types Found

| Schema Type | Present | Quality |
|-------------|---------|---------|
| Article | ✓ | Basic (empty fields) |
| Organization | ✓ | Embedded in Article |
| BreadcrumbList | ✗ | Missing |
| FAQPage | ✗ | Missing |
| Drug | ✗ | Missing |
| MedicalWebPage | ✗ | Missing |
| HowTo | ✗ | Missing |

### Sample Implementation
```json
{
  "@type": "Article",
  "headline": "BPC-157 Overview, Dosing & Safety",
  "author": {"@type": "Organization", "name": "Peptide Database"},
  "publisher": {"@type": "Organization", "name": "Peptide Database"},
  "keywords": "healing, longevity"
}
```

**Issues:**
- Many fields empty (`name`, `url`, `image`, `logo.url`)
- No BreadcrumbList despite having navigation
- No Drug schema despite medical content
- No FAQPage despite Q&A content

---

## peptibase.dev (COMPREHENSIVE)

### Schema Types Found

| Schema Type | Present | Quality |
|-------------|---------|---------|
| Organization | ✓ | Complete |
| WebSite | ✓ | With SearchAction |
| MedicalWebPage | ✓ | Complete with lastReviewed |
| Drug | ✓ | With legalStatus, mechanism |
| FAQPage | ✓ | 5 Q&A pairs per page |
| BreadcrumbList | ✓ | 3-level hierarchy |
| Article | ✓ | On comparison pages |

### Notable Implementations

**Drug Schema:**
```json
{
  "@type": "Drug",
  "name": "Semaglutide",
  "alternateName": ["Ozempic", "Wegovy", "Rybelsus"],
  "drugClass": "Weight Loss",
  "legalStatus": "FDA Approved",
  "mechanismOfAction": "Mimics GLP-1 hormone..."
}
```

**MedicalWebPage Schema:**
```json
{
  "@type": "MedicalWebPage",
  "lastReviewed": "2026-02-01",
  "audience": ["Researcher", "Clinician", "Patient"],
  "specialty": "Pharmacology"
}
```

**FAQPage Schema:**
- 5 questions per peptide page
- 3 questions per comparison page
- Captures featured snippets

---

## Schema Gap Analysis

| Schema Type | peptide-db | peptibase | Pepcodex Target |
|-------------|------------|-----------|-----------------|
| Organization | Basic | Complete | ✓ Match peptibase |
| WebSite | ✗ | Complete | ✓ Add SearchAction |
| MedicalWebPage | ✗ | Complete | ✓ Critical for E-E-A-T |
| Drug | ✗ | Complete | ✓ Add with evidence grade |
| FAQPage | ✗ | Complete | ✓ Add 5 FAQs per page |
| BreadcrumbList | ✗ | Complete | ✓ Add to all pages |
| HowTo | ✗ | ✗ | ✓ Own this gap |
| Article | Basic | Complete | ✓ Match peptibase |

**Opportunity:** Peptibase has the most complete schema. Match their implementation, then add HowTo schema (neither competitor uses this).

---

# CANONICAL & META DIRECTIVES

## peptide-db.com

| Directive | Implementation |
|-----------|----------------|
| Canonical | Self-referencing on all pages |
| Meta robots | Default (index, follow) |
| Hreflang | Not observed |

---

## peptibase.dev

| Directive | Implementation |
|-----------|----------------|
| Canonical | Self-referencing on all pages |
| Meta robots | `index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1` |
| Hreflang | Not observed |

**Notable:** Peptibase uses expanded Google robots directives to maximize snippet display.

---

## Pepcodex Opportunity

| Action | Priority |
|--------|----------|
| Add expanded meta robots (max-snippet:-1) | Medium |
| Ensure self-referencing canonicals | High |
| Consider hreflang if expanding internationally | Low (future) |

---

# CORE WEB VITALS

## Data Availability

| Site | CrUX Data | Reason |
|------|-----------|--------|
| peptide-db.com | UNKNOWN | Not in public CrUX database |
| peptibase.dev | UNKNOWN | Not in public CrUX database |
| pepcodex.com | UNKNOWN | Needs manual PageSpeed test |

**Note:** Both competitor sites lack public Core Web Vitals data, suggesting either low traffic volume or recent launch. Manual testing via [PageSpeed Insights](https://pagespeed.web.dev/) recommended.

### Expected Performance (Based on Stack)

| Site | Stack | Expected Performance |
|------|-------|---------------------|
| peptide-db.com | SvelteKit | Fast (SSR/SSG) |
| peptibase.dev | Unknown (likely Next.js or Astro) | Fast (modern framework) |
| pepcodex.com | Astro | Very fast (islands architecture) |

---

# INDEXATION STRATEGY

## peptide-db.com

| Strategy | Implementation |
|----------|----------------|
| Primary indexation | Peptide pages via sitemap |
| URL multiplication | Calculator parameter pages |
| Thin content risk | 250 calculator pages may be thin |
| Internal linking | 40+ links per page |

---

## peptibase.dev

| Strategy | Implementation |
|----------|----------------|
| Primary indexation | Peptide pages + subpages |
| URL multiplication | 3x via how-to + alternatives |
| Thin content risk | Subpages may have templated content |
| Internal linking | 17+ links per page |
| Comparison network | 66 dedicated pages |

---

# KEY TAKEAWAYS

## What Competitors Do Well (Technical)

1. **peptibase.dev Schema Depth** — 6 schema types including Drug, FAQPage, MedicalWebPage
2. **peptibase.dev Subpage Strategy** — 3x URL surface per peptide
3. **peptide-db.com Calculator URLs** — 250+ pages capturing "[peptide] calculator" queries
4. **peptibase.dev Meta Directives** — Optimized for maximum snippet display
5. **Both Sites** — Self-referencing canonicals, clean URL structures

## What Neither Does Well (Gaps to Own)

1. **HowTo Schema** — Neither competitor uses this; opportunity for calculator pages
2. **Author Schema** — No PersonalProfile or author credentials visible
3. **Visible Methodology** — No transparent evidence grading in schema
4. **Review Schema** — Could add for quality signals
5. **Core Web Vitals Focus** — No public data suggests low prioritization

## Pepcodex Technical SEO Priorities

| Priority | Action | Impact |
|----------|--------|--------|
| 1 | Implement 6+ schema types (match peptibase) | High |
| 2 | Add FAQPage schema to all dossier pages | High |
| 3 | Add HowTo schema to calculator pages | Medium |
| 4 | Add subpage strategy (/how-to-research, /evidence-summary) | High |
| 5 | Generate comparison page network (50-100 pages) | High |
| 6 | Add MedicalWebPage with lastReviewed dates | Medium |
| 7 | Optimize meta robots for snippets | Low |
| 8 | Test and optimize Core Web Vitals | Medium |

---

## NEXT: Phase 2 - Programmatic SEO Reverse Engineering

Ready to analyze competitor content templates and identify patterns for programmatic page generation.

---

*Phase 1.5 Complete | Generated 2026-02-01*
