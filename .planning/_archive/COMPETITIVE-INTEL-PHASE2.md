# PHASE 2: PROGRAMMATIC SEO TEMPLATES
## Pepcodex Competitive Intelligence

**Generated:** 2026-02-01
**Your Product:** pepcodex.com | Evidence-based peptide research database

---

## Purpose

Reverse-engineer competitor page templates to identify:
1. URL patterns and title formulas
2. Content modules and word counts
3. Internal linking strategies
4. Scalable template patterns for programmatic generation

---

# TEMPLATE A: SUBPAGE - HOW TO USE

## Source: peptibase.dev/peptides/[slug]/how-to-use

### URL Pattern
```
/peptides/{peptide-slug}/how-to-use
```

### Title Formula
```
H1: "How to Use {Peptide Name}"
Subtitle: "Complete guide to {Peptide Name} dosing, administration, timing, and protocol recommendations."
Meta Title (LIKELY): "How to Use {Peptide Name} - Dosing & Administration Guide | Peptibase"
```

### Content Sections (in order)

| Section | Est. Words | Content Type |
|---------|-----------|--------------|
| Quick Overview | 25 | 2-3 sentence summary |
| Dosing Guidelines | 75 | Range, frequency, units |
| Administration Method | 10 | Injection type (SubQ/IM) |
| Best Time to Take | 35 | Timing recommendations |
| Protocol Duration | 10 | Cycle length |
| Possible Side Effects | 45 | Bulleted list |
| Frequently Asked Questions | 80 | 3-5 Q&A pairs |
| **Total** | **~280** | — |

### Internal Linking

| Link Type | Destination | Purpose |
|-----------|-------------|---------|
| Breadcrumb | Home → Peptides → {Peptide} → How to Use | Navigation |
| Primary CTA | /peptides/{slug} | "View Full Profile" |
| Secondary CTA | /tools/reconstitution-calculator | "Dosing Calculator" |

### Template Components

| Component | Pattern |
|-----------|---------|
| Layout | Card-based modular grid |
| Icons | Consistent icon per section type |
| FAQ | Schema.org FAQPage markup |
| Disclaimer | Standard footer disclaimer |

### Pepcodex Adaptation

**CRITICAL:** Pepcodex cannot include dosing information due to credibility positioning.

**Alternative Template: "Research Summary"**
```
/peptides/{slug}/research-summary

Sections:
- Quick Overview (same)
- Research Highlights (replaces dosing - key study findings)
- Mechanism Summary (simplified from main page)
- Evidence Quality (evidence grade + study breakdown)
- Research Timeline (when studies were published)
- FAQs (research-focused questions)
- CTA: View Full Evidence Profile
```

---

# TEMPLATE B: SUBPAGE - ALTERNATIVES

## Source: peptibase.dev/peptides/[slug]/alternatives

### URL Pattern
```
/peptides/{peptide-slug}/alternatives
```

### Title Formula
```
H1: "{Peptide Name} Alternatives"
Meta Title (LIKELY): "{Peptide Name} Alternatives - Similar Peptides | Peptibase"
```

### Content Sections (in order)

| Section | Est. Words | Content Type |
|---------|-----------|--------------|
| Original Peptide Card | 50 | Featured peptide summary |
| Similar Peptides | 300 | 4-6 peptide cards |
| All {Category} Peptides | 200 | Category-specific list |
| Quick Comparison Table | 150 | Tabular comparison |
| Navigation CTAs | 50 | View Profile / Compare buttons |
| **Total** | **~800-1000** | — |

### Presentation Formats

| Section | Format | Columns |
|---------|--------|---------|
| Similar Peptides | Grid cards | 1-3 responsive |
| Category List | Vertical list | 1 column |
| Comparison | Table | 3-4 columns |

### Data Per Alternative

| Field | Source |
|-------|--------|
| Peptide Name | Database |
| Category | Database |
| Brief Description | 2-3 sentences |
| FDA Status | Database (where applicable) |
| Action Buttons | View Profile, Compare |

### Internal Linking

| Link Type | Destination |
|-----------|-------------|
| Peptide Profile | /peptides/{alt-slug} |
| Comparison Page | /compare/{original}-vs-{alternative} |
| Back to Main | /peptides/{slug} |
| Category Browse | /peptides?category={category} |

### Pepcodex Adaptation

**Template: "Related Research"**
```
/peptides/{slug}/related-research

Sections:
- This Peptide (evidence grade, key mechanism)
- Similar Mechanisms (peptides with related pathways)
- Same Research Area (by condition/category)
- Evidence Comparison Table (evidence grades side-by-side)
- CTA: Compare Research Profiles
```

---

# TEMPLATE C: COMPARISON PAGES

## Source: peptibase.dev/compare/[peptide-a]-vs-[peptide-b]

### URL Pattern
```
/compare/{peptide-a-slug}-vs-{peptide-b-slug}
```

**Canonicalization:** Alphabetical ordering (e.g., `/compare/bpc-157-vs-tb-500`, never `/compare/tb-500-vs-bpc-157`)

### Title Formula
```
H1: "{Peptide A} vs {Peptide B}"
Subtitle: "Comprehensive side-by-side comparison of mechanisms, dosing, side effects, and research"
Meta Title (LIKELY): "{Peptide A} vs {Peptide B} - Complete Comparison | Peptibase"
```

### Content Sections (in order)

| Section | Est. Words | Content Type |
|---------|-----------|--------------|
| Overview Cards | 100 | Side-by-side peptide summaries |
| Key Comparison Insights | 75 | 3-5 bullet points |
| Detailed Comparison Table | 400 | Multi-row attribute table |
| Frequently Asked Questions | 150 | 3 Q&A pairs |
| Related Comparisons | 100 | Links to similar comparisons |
| Full Profile CTAs | 50 | View Profile buttons |
| Disclaimer | 50 | Educational disclaimer |
| **Total** | **~1,200-1,400** | — |

### Comparison Table Attributes

| Attribute | Type |
|-----------|------|
| Category | Text |
| FDA Status | Badge |
| Clinical Status | Badge/Text |
| Mechanism of Action | Text (50-75 words) |
| Common Dosing | Text (pepcodex: N/A) |
| Administration | Text |
| Typical Duration | Text |
| Best Time to Take | Text |
| Possible Side Effects | Bulleted list |
| Research Summary | Text (75-100 words) |

### Schema Markup

| Schema Type | Purpose |
|-------------|---------|
| Article | Page structure |
| BreadcrumbList | Navigation |
| FAQPage | Q&A structured data |
| Drug (x2) | Both peptides |

### Internal Linking

| Link Type | Count | Destination |
|-----------|-------|-------------|
| Peptide Profiles | 2 | /peptides/{slug} |
| Related Comparisons | 4-6 | /compare/{a}-vs-{b} |
| Category Pages | 1-2 | /peptides?category={x} |

### Pepcodex Adaptation

**Template: "Research Comparison"**
```
/compare/{peptide-a}-vs-{peptide-b}

Sections:
- Overview Cards (with evidence grades)
- Key Research Insights (mechanism differences)
- Evidence Comparison Table:
  - Category
  - Evidence Grade (High/Moderate/Low)
  - Clinical Status
  - Mechanism of Action
  - Key Research Areas
  - Study Count (human vs animal)
  - Citation Count
  - Research Summary
- Research Questions (FAQs)
- Related Research Comparisons
- Full Research Profiles CTAs
```

**Differentiator:** Include evidence grades prominently — neither competitor does this.

---

# TEMPLATE D: CALCULATOR PAGES

## Source: peptide-db.com/calculator

### URL Patterns

| Pattern | Count | Purpose |
|---------|-------|---------|
| /calculator | 1 | Hub page with all calculators |
| /calculator/blend | 1 | Multi-peptide calculator |
| /calculator/accumulation | 1 | Half-life tracking |
| /calculator/accumulation?peptide={slug} | ~250 | Peptide-specific landing |

### Hub Page Structure

| Section | Content |
|---------|---------|
| Tab Navigation | Reconstitution, Blend, Accumulation |
| Calculator Interface | Inputs, visualization, results |
| Educational Sidebar | Tips, syringe guide, vial sizes |
| Peptide Selector | Dropdown with 100+ peptides |
| Disclaimer | Educational purposes only |

### Peptide-Specific Calculator Content

| Element | Source |
|---------|--------|
| Peptide Name | Database |
| Half-Life | Database (with override option) |
| Default Values | Pre-filled from peptide data |
| Visualization | Dynamic concentration graph |

### SEO Value of 250 URLs

Each `/calculator/accumulation?peptide={slug}` URL captures:
- "{Peptide Name} calculator"
- "{Peptide Name} dosing calculator"
- "{Peptide Name} half-life calculator"

### Internal Linking (Gap Identified)

**Current:** No direct links back to peptide research pages
**Opportunity:** Add "View {Peptide} Research" CTA on calculator pages

### Pepcodex Adaptation

**Replicate the URL multiplication strategy:**
```
/calculator/reconstitution?peptide={slug} → 188 URLs
/calculator/accumulation?peptide={slug} → 188 URLs

Each page:
- Pre-filled calculator for that peptide
- "View Research Profile" CTA linking to /peptides/{slug}
- Schema: HowTo markup (neither competitor uses this)
```

---

# TEMPLATE E: BEST-FOR PAGES

## Source: peptibase.dev (6 pages claimed in sitemap)

**Note:** Unable to fetch live examples (404 errors). Template reconstructed from sitemap patterns.

### URL Pattern
```
/best-peptides-for-{use-case}
```

### Known/Likely Use Cases (from sitemap analysis)
1. weight-loss
2. muscle-growth
3. healing
4. anti-aging
5. sleep
6. cognitive

### Likely Title Formula
```
H1: "Best Peptides for {Use Case}"
Meta Title: "Best Peptides for {Use Case} - Top Recommendations | Peptibase"
```

### Likely Content Structure

| Section | Est. Words | Content Type |
|---------|-----------|--------------|
| Introduction | 100 | Why these peptides for this use case |
| Top Picks | 400 | 4-6 ranked peptide cards |
| Comparison Table | 200 | Quick comparison of top picks |
| How to Choose | 150 | Selection criteria |
| FAQs | 150 | 3-5 Q&A pairs |
| Related Categories | 50 | Links to similar pages |
| **Total** | **~1,000-1,200** | — |

### Pepcodex Adaptation

**Template: "Peptides Researched for {Condition}"**
```
/peptides-researched-for-{condition}

Sections:
- Introduction (research context, not recommendations)
- Research Evidence Summary (ranked by evidence grade)
- Evidence Comparison Table:
  - Peptide Name
  - Evidence Grade
  - Study Count
  - Clinical Trial Status
  - Key Findings
- Research Gaps (what's unknown)
- FAQs
- Related Research Areas
```

**Differentiator:** Frame as "researched for" rather than "best for" — maintains credibility positioning while capturing similar search intent.

---

# TEMPLATE F: GLOSSARY PAGES (COMPETITOR GAP)

## Source: Neither competitor has a glossary section

### Opportunity Template

```
Hub: /glossary
Pages: /glossary/{term-slug}
```

### Title Formula
```
H1: "What is {Term}?"
Meta Title: "{Term}: Definition & Research | Pepcodex"
```

### Content Structure

| Section | Est. Words |
|---------|-----------|
| Definition | 50-75 |
| In-Depth Explanation | 150-200 |
| Related Terms | 50 (linked) |
| Peptides Using This Term | 100 (linked list) |
| Research Context | 75 |
| **Total** | **~400-500** |

### Example Terms (100+ opportunities)
- Amino acid
- Bioavailability
- Half-life
- Subcutaneous
- Reconstitution
- Lyophilized
- GLP-1
- GH Secretagogue
- Peptide bond
- Bioregulator

### SEO Value
Captures:
- "what is {term}"
- "{term} definition"
- "{term} meaning peptides"

---

# URL MULTIPLICATION SUMMARY

## Current Pepcodex: ~188 URLs

## Competitor Strategies Applied to Pepcodex

| Strategy | Formula | New URLs |
|----------|---------|----------|
| Research Summary Subpage | 188 peptides × 1 | +188 |
| Related Research Subpage | 188 peptides × 1 | +188 |
| Comparison Pages | 188 peptides × 2-3 comps | +376-564 |
| Calculator URLs | 188 peptides × 2 calcs | +376 |
| Condition Pages | 188 peptides × 2 conditions | +376 |
| Glossary Pages | 100 terms | +100 |
| **Total New** | — | **~1,600-1,800** |

### Projected URL Surface

| Scenario | Total URLs | Comparison |
|----------|------------|------------|
| Current | 188 | Baseline |
| + Subpages | 564 | Matches peptibase |
| + Comparisons | 940 | Exceeds peptibase |
| + Calculators | 1,316 | Matches peptide-db |
| + All Strategies | ~2,000 | Exceeds both |

---

# CONTENT MODULE LIBRARY

## Reusable Components for All Templates

| Component | Description | Schema |
|-----------|-------------|--------|
| EvidenceGradeBadge | High/Moderate/Low/Very Low | — |
| PeptideCard | Name, category, evidence, CTA | Drug |
| ComparisonTable | Side-by-side attribute grid | — |
| FAQSection | 3-5 Q&A pairs | FAQPage |
| BreadcrumbNav | Auto-generated path | BreadcrumbList |
| DisclaimerFooter | Standard research disclaimer | — |
| RelatedLinks | 4-6 related page links | — |
| CTAButton | Primary/secondary actions | — |

---

# INTERNAL LINKING MATRIX

## Every Page Should Link To:

| From Page Type | Links To | Count |
|----------------|----------|-------|
| Main Peptide Page | Subpages, Calculator, Comparisons | 5-8 |
| Subpage | Main Page, Calculator, Related | 3-5 |
| Comparison | Both Peptide Pages, Related Comps | 6-10 |
| Calculator | Peptide Page, Other Calculators | 3-4 |
| Glossary | Related Terms, Related Peptides | 5-8 |
| Condition Page | Relevant Peptides, Comparisons | 8-12 |

## Hub & Spoke Model

```
/peptides (HUB)
  └── /peptides/{slug} (MAIN)
      ├── /peptides/{slug}/research-summary (SPOKE)
      ├── /peptides/{slug}/related-research (SPOKE)
      └── /compare/{slug}-vs-{other} (CROSS-LINK)

/calculator (HUB)
  ├── /calculator/reconstitution?peptide={slug} (SPOKE)
  └── /calculator/accumulation?peptide={slug} (SPOKE)

/glossary (HUB)
  └── /glossary/{term} (SPOKE)

/research-by-condition (HUB)
  └── /peptides-researched-for-{condition} (SPOKE)
```

---

# KEY TAKEAWAYS

## Template Patterns to Replicate

1. **Subpage multiplication** — 2-3 URLs per peptide with focused content
2. **Comparison network** — Dedicated pages for every meaningful pairing
3. **Calculator URL strategy** — Parameter-based URLs for each peptide
4. **Consistent section ordering** — Same structure across all pages of a type
5. **Schema depth** — 3-5 schema types per page template

## Pepcodex Adaptations (Credibility-First)

| Competitor Pattern | Pepcodex Version |
|--------------------|------------------|
| "How to Use" | "Research Summary" |
| "Alternatives" | "Related Research" |
| "Best For" | "Researched For" |
| Dosing Tables | Evidence Tables |
| Protocol Duration | Study Timeline |

## Implementation Priority

| Priority | Template | Est. URLs | Effort |
|----------|----------|-----------|--------|
| 1 | Comparison Pages | 100+ | Medium |
| 2 | Research Summary Subpage | 188 | Low |
| 3 | Related Research Subpage | 188 | Low |
| 4 | Calculator URLs | 376 | Medium |
| 5 | Glossary Pages | 100 | Medium |
| 6 | Condition Pages | 200+ | High |

---

## NEXT: Phase 3 - Strategy Library

Ready to create 10-25 strategy cards with specific actions, effort estimates, and implementation guidance.

---

*Phase 2 Complete | Generated 2026-02-01*
