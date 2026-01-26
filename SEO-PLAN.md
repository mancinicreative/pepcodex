# PepCodex SEO Master Plan

## Domain: pepcodex.com
## Stack: Astro 5.16.11 + MDX + Tailwind + Pagefind
## Status: Prelaunch | ~66 pages (15 peptides, 11 guides, 11 comparisons, 11 safety, 3 glossary)

---

# 1) PRIORITY LEVERS (80/20)

## Top 10 Actions Ranked by ROI

| Rank | Action | Impact | Effort | Why |
|------|--------|--------|--------|-----|
| 1 | Add JSON-LD structured data to all pages | 9 | M | Rich snippets = higher CTR before ranking |
| 2 | Build 20 more peptide pages (hit 35 total) | 9 | M | More indexable pages = more keyword surface |
| 3 | Create glossary hub + 50 term pages | 8 | M | Captures "what is X" queries at scale |
| 4 | Internal linking system (automated) | 8 | M | Distributes authority, reduces orphans |
| 5 | Optimize title tags with CTR formulas | 7 | S | Immediate CTR lift on existing pages |
| 6 | Add FAQ sections to peptide pages | 7 | S | Featured snippet eligibility |
| 7 | Submit to Google Search Console + request indexing | 7 | S | Faster discovery |
| 8 | Build 5 linkable assets (comparison tables, evidence tracker) | 8 | L | Attracts natural backlinks |
| 9 | Create "vs" comparison pages for top 20 peptide pairs | 7 | M | Captures comparison intent |
| 10 | Outreach to 30 resource pages/newsletters | 6 | L | Domain authority building |

## This Week Checklist (Max 12)

- [ ] Register pepcodex.com and update astro.config.mjs site URL
- [ ] Set up Google Search Console + submit sitemap
- [ ] Set up GA4 with basic events (scroll, search, outbound clicks)
- [x] Add Article schema to all peptide/guide pages
- [x] Add BreadcrumbList schema to all pages
- [ ] Add FAQPage schema where FAQ sections exist
- [ ] Audit all 15 peptide pages for unique meta descriptions
- [x] Create internal linking component (auto-inject related peptides)
- [ ] Add "Last Updated" visible on all pages (E-E-A-T signal)
- [ ] Create author/editorial team page (/team or /about expansion)
- [ ] Set up Ahrefs/Semrush free trial to pull initial keyword data
- [ ] Draft first 5 new peptide pages for tomorrow's expansion

---

# 2) TECHNICAL SEO BACKLOG

| Issue | Why It Matters | How to Detect | Fix Steps | Impact | Effort |
|-------|---------------|---------------|-----------|--------|--------|
| **No JSON-LD structured data** | Missing rich snippets, lower CTR | View source, search "application/ld+json" | Add Article, BreadcrumbList, FAQPage, Organization schemas via Astro component | 9 | M |
| **Site URL mismatch** | Config shows peptide-library.com, you want pepcodex.com | Check astro.config.mjs | Update `site` field to `https://pepcodex.com` | 8 | S |
| **No hreflang (future)** | Not needed now, but plan for international | N/A | Add when expanding beyond US/Canada | 3 | S |
| **Missing alt text on images** | Accessibility + image SEO | Grep for `<img` without alt | Add descriptive alt to all images, especially molecular diagrams | 6 | S |
| **No 404 page optimization** | Missed internal link opportunities | Visit /nonexistent-page | Create custom 404 with search + popular pages | 4 | S |
| **Thin content risk on programmatic pages** | Google may not index low-value pages | Check word count per page | Set minimum 300 words unique content per page | 7 | M |
| **No canonical override option** | Can't handle edge cases | Check frontmatter schema | Add optional `canonical` field to content config | 5 | S |
| **Core Web Vitals unknown** | May have LCP/CLS issues | PageSpeed Insights, GSC | Test post-build, optimize images, fonts | 7 | M |
| **No XML sitemap priority/frequency** | All pages treated equally | Check sitemap output | Configure sitemap integration with priorities | 4 | S |
| **No robots meta per page** | Can't noindex thin pages | Check frontmatter | Add optional `robots` field (index/noindex) | 5 | S |

### Structured Data Implementation Plan

```astro
// Create: src/components/SEO/JsonLd.astro
---
interface Props {
  type: 'Article' | 'FAQPage' | 'BreadcrumbList' | 'Organization';
  data: Record<string, any>;
}
const { type, data } = Astro.props;
---
<script type="application/ld+json" set:html={JSON.stringify(data)} />
```

**Required Schemas:**
1. **Organization** (on every page, in BaseLayout) ✅
2. **BreadcrumbList** (on every page) ✅
3. **Article** (peptide dossiers, guides, safety pages) ✅
4. **FAQPage** (pages with FAQ sections) ✅ (component ready)
5. **ItemList** (hub/listing pages) ✅

---

# 3) SITE ARCHITECTURE + INTERNAL LINKING

## Recommended Taxonomy

```
pepcodex.com/
├── /peptides/                    [Hub - all peptides A-Z]
│   └── /peptides/[slug]          [Dossier pages]
├── /category/
│   ├── /category/metabolic       [Category hub]
│   ├── /category/repair-recovery
│   ├── /category/hormonal
│   └── /category/longevity
├── /guide/                       [Hub - all guides]
│   └── /guide/[slug]             [Individual guides]
├── /compare/                     [Hub - all comparisons]
│   └── /compare/[slug]           [A vs B pages]
├── /safety/                      [Hub - all safety profiles]
│   └── /safety/[slug]            [Individual safety pages]
├── /glossary/                    [NEW - Hub for terms] ✅
│   └── /glossary/[term]          [NEW - Definition pages] ✅
├── /trials/                      [Clinical trials tracker]
├── /about/
├── /methodology/
├── /editorial-policy/
└── /newsletter/
```

## Internal Linking Rules by Page Type

| Page Type | Must Link To | Anchor Pattern |
|-----------|--------------|----------------|
| Peptide Dossier | Related peptides (comparators), its guide, its safety page, category hub, glossary terms | "Learn more about [peptide]", "[Peptide] safety profile", "Compare with [other]" |
| Guide | The peptide it covers, related guides, glossary terms | "See full [peptide] dossier", "Related: [guide title]" |
| Comparison | Both peptides being compared, their safety pages | "[Peptide A] dossier", "[Peptide B] dossier" |
| Safety | The peptide(s), related safety pages | "Full [peptide] evidence review" |
| Category Hub | All peptides in category, related categories | "[Peptide name]" (direct link) |
| Glossary Term | Related peptides that use this term, parent glossary | "See [peptide] for clinical data" |

## 20 Hub Pages to Create First

| Priority | Hub Page | Links To | Target Keywords |
|----------|----------|----------|-----------------|
| 1 | /peptides/ | All 35+ peptides | peptide database, peptide list |
| 2 | /glossary/ | All glossary terms | peptide glossary, peptide terms |
| 3 | /category/metabolic | Semaglutide, Tirzepatide, etc. | weight loss peptides, metabolic peptides |
| 4 | /category/repair-recovery | BPC-157, TB-500, etc. | healing peptides, recovery peptides |
| 5 | /compare/ | All comparison pages | peptide comparisons |
| 6 | /guide/ | All guides | peptide guides, learn about peptides |
| 7 | /safety/ | All safety pages | peptide safety, peptide side effects |
| 8 | /category/hormonal | GHRP-6, Ipamorelin, etc. | growth hormone peptides |
| 9 | /category/longevity | Epithalon, etc. | anti-aging peptides |
| 10 | /trials/ | Links to peptides with active trials | peptide clinical trials |
| 11 | /glossary/glp-1 | Semaglutide, Tirzepatide, Retatrutide | what is glp-1 |
| 12 | /glossary/bpc | BPC-157 | what is bpc |
| 13 | /glossary/ghrp | GHRP-6 related | what is ghrp |
| 14 | /glossary/receptor-agonist | Multiple peptides | receptor agonist meaning |
| 15 | /peptides/?filter=fda-approved | Semaglutide, Tirzepatide (filtered view) | fda approved peptides |
| 16 | /peptides/?filter=high-evidence | High evidence peptides | proven peptides, researched peptides |
| 17 | /compare/weight-loss-peptides | Semaglutide vs Tirzepatide vs Retatrutide | best weight loss peptide |
| 18 | /compare/recovery-peptides | BPC-157 vs TB-500 | best recovery peptide |
| 19 | /guide/peptide-evidence-guide | All peptides | how to read peptide research |
| 20 | /guide/peptide-categories-explained | All categories | types of peptides |

## Breadcrumb Rules

```
Home > Peptides > [Peptide Name]
Home > Peptides > [Category] > [Peptide Name]  (if accessed via category)
Home > Guides > [Guide Title]
Home > Compare > [Peptide A] vs [Peptide B]
Home > Safety > [Peptide] Safety
Home > Glossary > [Term]
```

## Related Entities Module (Add to All Pages) ✅

```astro
// Component: RelatedEntities.astro
// Displays at bottom of every content page:
// - 3 related peptides (from same category or comparators)
// - 2 related guides
// - 1 related comparison (if exists)
// - Link to glossary terms mentioned in content
```

---

# 4) KEYWORD UNIVERSE

## Keyword Clusters by Intent

### Cluster A: Definition/Explainer ("What is X")
| Keyword Pattern | Difficulty | Business Value | Cannibalization Risk |
|-----------------|------------|----------------|---------------------|
| what is [peptide] | Low-Med | 8 | Low (guide pages) |
| [peptide] meaning | Low | 6 | Low |
| what does [peptide] do | Low | 8 | Med (guide vs dossier) |
| [term] definition (glossary) | Low | 5 | Low |

### Cluster B: Mechanism/Science ("How does X work")
| Keyword Pattern | Difficulty | Business Value | Cannibalization Risk |
|-----------------|------------|----------------|---------------------|
| how does [peptide] work | Med | 8 | Med (guide vs dossier) |
| [peptide] mechanism of action | Med | 7 | Low |
| [peptide] receptor | Med-High | 6 | Low |

### Cluster C: Comparison ("X vs Y")
| Keyword Pattern | Difficulty | Business Value | Cannibalization Risk |
|-----------------|------------|----------------|---------------------|
| [peptide A] vs [peptide B] | Med | 9 | Low (dedicated pages) |
| [peptide] alternatives | Med | 8 | Med |
| best [category] peptide | High | 10 | High |

### Cluster D: Safety/Side Effects
| Keyword Pattern | Difficulty | Business Value | Cannibalization Risk |
|-----------------|------------|----------------|---------------------|
| [peptide] side effects | Med | 9 | Low (safety pages) |
| [peptide] safety | Med | 8 | Low |
| is [peptide] safe | Med | 8 | Low |
| [peptide] risks | Med | 7 | Low |

### Cluster E: Research/Evidence
| Keyword Pattern | Difficulty | Business Value | Cannibalization Risk |
|-----------------|------------|----------------|---------------------|
| [peptide] research | Med | 7 | Low |
| [peptide] studies | Med | 7 | Low |
| [peptide] clinical trials | Med-High | 8 | Low |
| [peptide] evidence | Low | 6 | Low |

### Cluster F: Benefits/Use Cases
| Keyword Pattern | Difficulty | Business Value | Cannibalization Risk |
|-----------------|------------|----------------|---------------------|
| [peptide] benefits | Med | 9 | Med (guide vs dossier) |
| [peptide] for [condition] | Med-High | 9 | Med |
| [peptide] results | Med | 8 | Med |

## FIRST 50 Pages to Publish (Priority Order)

### Tier 1: High Volume + Low Difficulty (Publish First)

| # | Page | Type | Target Keyword | Why First |
|---|------|------|----------------|-----------|
| 1 | /glossary/glp-1 | Glossary | what is glp-1 | Massive search volume, low competition |
| 2 | /guide/what-is-semaglutide | Guide | what is semaglutide | Ozempic interest, beginner query |
| 3 | /guide/what-is-tirzepatide | Guide | what is tirzepatide | Mounjaro interest |
| 4 | /compare/semaglutide-vs-tirzepatide | Compare | semaglutide vs tirzepatide | Top comparison query |
| 5 | /safety/semaglutide-safety | Safety | semaglutide side effects | Safety concerns are huge |
| 6 | /glossary/peptide | Glossary | what is a peptide | Foundational query |
| 7 | /guide/what-is-bpc-157 | Guide | what is bpc-157 | Already exists, optimize |
| 8 | /compare/bpc-157-vs-tb-500 | Compare | bpc-157 vs tb-500 | Already exists, optimize |
| 9 | /peptides/retatrutide | Dossier | retatrutide | Emerging interest |
| 10 | /safety/tirzepatide-safety | Safety | tirzepatide side effects | High search volume |

### Tier 2: Medium Volume + Strategic Value

| # | Page | Type | Target Keyword |
|---|------|------|----------------|
| 11 | /glossary/ghrp | Glossary | what is ghrp |
| 12 | /glossary/ghrh | Glossary | what is ghrh |
| 13 | /peptides/cjc-1295-dac | Dossier | cjc-1295 dac |
| 14 | /peptides/ipamorelin | Dossier | ipamorelin (exists, optimize) |
| 15 | /compare/ipamorelin-vs-cjc-1295 | Compare | ipamorelin vs cjc-1295 |
| 16 | /guide/peptide-categories | Guide | types of peptides |
| 17 | /glossary/bioavailability | Glossary | bioavailability meaning |
| 18 | /safety/bpc-157-safety | Safety | bpc-157 side effects |
| 19 | /peptides/selank | Dossier | selank peptide |
| 20 | /peptides/semax | Dossier | semax peptide |

### Tier 3: Expand Coverage

| # | Page | Type | Target Keyword |
|---|------|------|----------------|
| 21-25 | 5 more peptide dossiers | Dossier | LL-37, Thymosin Alpha-1, DSIP, Delta Sleep, Follistatin |
| 26-30 | 5 glossary terms | Glossary | half-life, subcutaneous, intramuscular, reconstitution, lyophilized |
| 31-35 | 5 comparison pages | Compare | Top search volume pairs |
| 36-40 | 5 safety pages | Safety | For new peptides |
| 41-45 | 5 mechanism guides | Guide | How [peptide] works |
| 46-50 | 5 category explainers | Guide | Best [category] peptides |

## How to Get Actual Search Volume

1. **Google Search Console** (once live): Impressions = proxy for volume
2. **Google Keyword Planner** (free with Ads account): Exact ranges
3. **Google Trends**: Compare relative interest
4. **Ahrefs/Semrush free trial**: 7-day trials for volume data
5. **AlsoAsked.com**: Free "People Also Ask" scraping
6. **AnswerThePublic**: Free question mapping

---

# 5) ON-PAGE SOP

## Title Tag Formulas (10)

| # | Formula | Example | Best For |
|---|---------|---------|----------|
| 1 | [Peptide]: Evidence Review [Year] | Semaglutide: Evidence Review 2025 | Dossier pages |
| 2 | What is [Peptide]? Complete Guide | What is BPC-157? Complete Guide | Guide pages |
| 3 | [Peptide A] vs [Peptide B]: [Differentiator] | Semaglutide vs Tirzepatide: Key Differences | Comparison pages |
| 4 | [Peptide] Safety: Side Effects & Risks | Semaglutide Safety: Side Effects & Risks | Safety pages |
| 5 | [Term] Definition + Examples | GLP-1 Definition + Examples | Glossary pages |
| 6 | [Number] [Category] Peptides Compared | 8 Metabolic Peptides Compared | Category hubs |
| 7 | [Peptide] Research: [Number] Studies Reviewed | BPC-157 Research: 47 Studies Reviewed | High-evidence pages |
| 8 | Is [Peptide] Safe? Evidence-Based Answer | Is Tirzepatide Safe? Evidence-Based Answer | Safety alt |
| 9 | [Peptide] [Year]: What the Research Shows | Retatrutide 2025: What the Research Shows | Timely pages |
| 10 | [Peptide] Explained: Mechanism & Evidence | Epithalon Explained: Mechanism & Evidence | Technical guides |

## Meta Description Formulas (10)

| # | Formula | Character Target |
|---|---------|------------------|
| 1 | [Peptide] evidence review: [key stat]. [Differentiator]. Updated [Month Year]. | 150-160 |
| 2 | Learn what [peptide] is, how it works, and what [number] studies show. No hype, just evidence. | 150-160 |
| 3 | Compare [A] vs [B]: mechanisms, evidence strength, and key differences. Cited sources only. | 150-160 |
| 4 | [Peptide] safety profile: common side effects, warnings, and what research shows. [Number] sources cited. | 150-160 |
| 5 | [Term] explained simply. What it means, why it matters for peptides, with examples. | 140-150 |
| 6 | Browse [number] [category] peptides with evidence grades. Filter by research quality. | 140-150 |
| 7 | [Peptide] research summary: [number] human trials, [number] preclinical studies reviewed. | 150-160 |
| 8 | Is [peptide] safe? Review of [number] studies on side effects, risks, and contraindications. | 150-160 |
| 9 | [Peptide] [year] update: latest research, evidence grade, and what's changed. | 140-150 |
| 10 | [Peptide] mechanism of action explained. How it works at the receptor level. | 140-150 |

## H1/H2 Outline Patterns

### Pattern: Peptide Dossier Page
```
H1: [Peptide Name]: Evidence Dossier
H2: Overview
H2: Mechanism of Action
H2: Research Summary
  H3: Human Clinical Trials
  H3: Preclinical Studies
H2: Potential Benefits (What Research Suggests)
H2: Safety & Side Effects
H2: Frequently Asked Questions
H2: Sources & Citations
```

### Pattern: Guide Page
```
H1: What is [Peptide]?
H2: Quick Summary
H2: How [Peptide] Works
H2: What Research Shows
H2: Important Limitations
H2: Related Peptides
H2: Frequently Asked Questions
```

### Pattern: Comparison Page
```
H1: [Peptide A] vs [Peptide B]: Complete Comparison
H2: Quick Comparison Table
H2: How They Differ
  H3: Mechanism Differences
  H3: Evidence Quality
  H3: Safety Profiles
H2: When Research Suggests Each
H2: Frequently Asked Questions
```

### Pattern: Safety Page
```
H1: [Peptide] Safety Profile
H2: Safety Summary
H2: Common Side Effects
H2: Serious Warnings
H2: Contraindications
H2: Drug Interactions
H2: What Research Shows
H2: Frequently Asked Questions
```

## Featured Snippet Targeting

| Snippet Type | How to Trigger | Example |
|--------------|----------------|---------|
| **Definition Box** | Start section with "[Term] is..." in 40-60 words | "BPC-157 is a synthetic peptide derived from..." |
| **Numbered List** | Use "Steps to..." or "Top X..." with `<ol>` | "3 key differences between X and Y: 1..." |
| **Bulleted List** | Use "Types of..." or "Benefits include:" with `<ul>` | "Types of metabolic peptides: * Semaglutide..." |
| **Table** | Use comparison data in `<table>` | Side-by-side peptide comparison |
| **FAQ** | Use exact "People Also Ask" questions as H3s | "Is semaglutide FDA approved?" |

## Image/Alt Text Rules

| Image Type | Alt Text Pattern | Example |
|------------|------------------|---------|
| Molecular diagram | "[Peptide] molecular structure diagram" | "Semaglutide molecular structure diagram" |
| Comparison chart | "Comparison of [A] vs [B] [metric]" | "Comparison of semaglutide vs tirzepatide efficacy" |
| Evidence badge | "[Peptide] evidence strength: [level]" | "BPC-157 evidence strength: moderate" |
| Category icon | "[Category] peptide category icon" | "Metabolic peptide category icon" |

## E-E-A-T On-Page Checklist (SEO Trust Signals)

- [ ] Author byline with link to author bio page
- [ ] "Medically reviewed by" or "Reviewed by" credit (if applicable)
- [ ] "Last updated: [Date]" visible near title
- [ ] "Sources: [Number]" count visible
- [ ] Link to /methodology in footer or content
- [ ] Link to /editorial-policy in footer
- [ ] Evidence strength badge prominently displayed
- [ ] Citations inline (not just at bottom)
- [ ] "This is not medical advice" disclaimer visible
- [ ] About page with team credentials

---

# 6) PROGRAMMATIC SEO

## 8 Page Templates

### Template 1: Peptide Dossier
- **Target Intent**: "[peptide] research", "[peptide] studies", "[peptide] evidence"
- **Required Unique Fields**: name, aliases, category, summary (300+ chars), mechanism (500+ chars), evidence summary
- **Minimum Content**: 800 words unique + structured data sections
- **Duplicate Avoidance**: Each peptide is unique; no risk
- **Schema**: Article, BreadcrumbList, FAQPage (if FAQ exists)
- **Internal Links**: Related peptides, category hub, safety page, guide, glossary terms

### Template 2: Guide/Explainer
- **Target Intent**: "what is [peptide]", "how does [peptide] work"
- **Required Unique Fields**: title, peptide reference, summary, content (1000+ words)
- **Minimum Content**: 1000 words unique
- **Duplicate Avoidance**: Different angle than dossier (beginner vs comprehensive)
- **Schema**: Article, BreadcrumbList, FAQPage
- **Internal Links**: Dossier, safety page, related guides

### Template 3: Comparison
- **Target Intent**: "[peptide A] vs [peptide B]"
- **Required Unique Fields**: peptideA, peptideB, comparison table data, unique analysis
- **Minimum Content**: 600 words unique analysis + structured table
- **Duplicate Avoidance**: Alphabetical ordering (BPC-157 vs TB-500, not TB-500 vs BPC-157)
- **Schema**: Article, BreadcrumbList, Table (implicit)
- **Internal Links**: Both peptide dossiers, both safety pages

### Template 4: Safety Profile
- **Target Intent**: "[peptide] side effects", "[peptide] safety"
- **Required Unique Fields**: peptides array, side effects list, warnings, contraindications
- **Minimum Content**: 500 words unique + structured lists
- **Duplicate Avoidance**: One safety page per peptide
- **Schema**: Article, BreadcrumbList, FAQPage
- **Internal Links**: Dossier, guide, related safety pages

### Template 5: Glossary Term (NEW) ✅
- **Target Intent**: "what is [term]", "[term] meaning", "[term] definition"
- **Required Unique Fields**: term, definition (100+ chars), extended explanation, related peptides
- **Minimum Content**: 300 words unique + examples
- **Duplicate Avoidance**: One page per term
- **Schema**: Article, BreadcrumbList, DefinedTerm (optional)
- **Internal Links**: All peptides using this term, related terms

### Template 6: Category Hub
- **Target Intent**: "[category] peptides", "best [category] peptide"
- **Required Unique Fields**: category name, description, peptide list with summaries
- **Minimum Content**: 400 words intro + dynamic peptide cards
- **Duplicate Avoidance**: Fixed categories only
- **Schema**: ItemList, BreadcrumbList
- **Internal Links**: All peptides in category, other category hubs

### Template 7: Trials Tracker (NEW)
- **Target Intent**: "[peptide] clinical trials", "peptide research [year]"
- **Required Unique Fields**: peptide, trial list (from ClinicalTrials.gov API or manual)
- **Minimum Content**: Dynamic trial data + 200 words context
- **Duplicate Avoidance**: One trials page per peptide (or combined)
- **Schema**: Article, BreadcrumbList
- **Internal Links**: Dossier, safety page

### Template 8: "Best Of" Roundup (NEW)
- **Target Intent**: "best [category] peptides [year]", "top peptides for [use case]"
- **Required Unique Fields**: category/use case, ranked peptide list with rationale
- **Minimum Content**: 800 words unique analysis + comparison table
- **Duplicate Avoidance**: Annual refresh (slug includes year) OR evergreen with lastUpdated
- **Schema**: Article, ItemList, BreadcrumbList
- **Internal Links**: All featured peptides, comparison pages

## Database Schema for Peptides/Supplements

```typescript
// Extend existing Zod schema in config.ts

// Core peptide fields (existing)
interface Peptide {
  name: string;
  slug: string;
  aliases: string[];
  category: 'metabolic' | 'repair-recovery' | 'hormonal' | 'longevity' | 'cognitive' | 'immune' | 'other';
  evidenceStrength: 'high' | 'moderate' | 'low' | 'very-low';
  fdaStatus: 'approved' | 'investigational' | 'none';
  lastUpdated: Date;

  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  canonical?: string;
  robots?: 'index' | 'noindex';

  // Content fields
  summary: string; // 300+ chars
  mechanism: string; // 500+ chars
  benefits: string[];
  sideEffects: string[];
  contraindications: string[];

  // Relationship fields
  comparators: string[]; // slugs of related peptides
  relatedTerms: string[]; // glossary term slugs

  // Source tracking
  sources: {
    count: number;
    human: number;
    preclinical: number;
    openAccess: number;
  };
}

// New glossary term collection ✅
interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string; // 100+ chars
  explanation: string; // 300+ chars
  relatedPeptides: string[]; // peptide slugs
  relatedTerms: string[]; // other glossary term slugs
  lastUpdated: Date;
  metaTitle?: string;
  metaDescription?: string;
}

// Supplement extension (future)
interface Supplement {
  name: string;
  slug: string;
  type: 'vitamin' | 'mineral' | 'amino-acid' | 'herbal' | 'other';
  // ... similar structure to Peptide
}
```

---

# 7) OFF-PAGE SEO

## 30 Link Opportunities by Category

### Resource Pages (10)
1. University biology/pharmacology department resource pages
2. Medical library "useful links" pages
3. Biohacking community resource lists
4. Longevity research organization link pages
5. Endocrinology society educational resources
6. Sports medicine research resource pages
7. Nutrition science department reading lists
8. Health journalism resource compilations
9. Medical writer resource pages
10. Continuing education course materials pages

### Academic/Research (5)
11. PubMed Commons discussions (link in comments)
12. ResearchGate project pages
13. Open access journal "related resources"
14. University course syllabi (as reference)
15. Research lab "useful links" pages

### Newsletters/Media (5)
16. Longevity-focused newsletters (Peter Attia, Rhonda Patrick adjacent)
17. Health tech newsletters
18. Medical news sites (as cited source)
19. Biohacking podcasts show notes
20. Health influencer "resources I use" pages

### Communities (5)
21. Reddit wiki pages (r/Peptides, r/longevity, r/Biohackers)
22. Discord server resource channels
23. Forum sticky threads
24. Facebook group pinned resources
25. Slack community shared resources

### Directories (5)
26. Health website directories
27. Science resource aggregators
28. Medical reference site lists
29. Startup directories (Product Hunt, etc.)
30. Niche health tool directories

## Outreach Scripts

### Script 1: Resource Page Inclusion
```
Subject: Resource suggestion for [Page Title]

Hi [Name],

I found your [resource page/guide] on [topic] while researching [related topic].

I noticed you link to [existing resource]. We recently published a comprehensive evidence database for peptide research at PepCodex.com that your readers might find useful.

Unlike most peptide sites, we:
- Grade evidence quality (high/moderate/low/very-low)
- Cite only peer-reviewed sources
- Include no dosing or sourcing information

Would you consider adding us to your resources? Happy to provide any additional information.

Best,
[Name]
```

### Script 2: Broken Link Building
```
Subject: Broken link on [Page Title]

Hi [Name],

I was reading your excellent article on [topic] and noticed the link to [broken resource] appears to be down.

If you're looking for a replacement, our evidence-based peptide database at PepCodex.com covers similar ground with [specific feature].

Either way, wanted to give you a heads up about the broken link.

Cheers,
[Name]
```

### Script 3: Data Asset Pitch
```
Subject: Free peptide research data for [Publication/Site]

Hi [Name],

I'm [Name] from PepCodex, an evidence-based peptide research database.

We just published [specific asset: e.g., "a comparison of all GLP-1 agonist clinical trials" or "an evidence strength index for 50 peptides"].

Given your coverage of [topic], thought this might be useful for an upcoming piece. Happy to provide the data, quotes, or collaborate on analysis.

No strings attached—just trying to get good data in front of people who'll use it well.

Best,
[Name]
```

## 6 Linkable Asset Ideas

| Asset | Description | Link Appeal | Effort |
|-------|-------------|-------------|--------|
| **Evidence Strength Index** | Sortable table of all peptides by evidence grade | High—unique data, citable | M |
| **Clinical Trial Tracker** | Live/updated list of ongoing peptide trials | High—journalists love this | L |
| **Peptide Interaction Checker** | Tool showing known interactions | Very High—utility drives links | L |
| **Research Visualization** | Interactive chart of studies over time | Med—visual content gets shared | M |
| **Comparison Matrix** | All peptides vs all peptides quick comparison | High—reference tool | M |
| **Glossary/Wiki** | Comprehensive peptide terminology | Med—educational resource | S |

## Monthly Link KPIs

| Metric | Target (Month 1-3) | Target (Month 4-6) | How to Track |
|--------|-------------------|-------------------|--------------|
| Outreach emails sent | 50/mo | 100/mo | Spreadsheet or CRM |
| Response rate | 10%+ | 15%+ | Track replies |
| Links acquired | 3-5/mo | 8-12/mo | Ahrefs/GSC backlinks report |
| Referring domains | +5/mo | +10/mo | Ahrefs |
| DR/DA of links | Any | 20+ average | Ahrefs |
| Brand mentions (unlinked) | Track | Convert 20% | Google Alerts, Ahrefs |

---

# 8) MEASUREMENT + ITERATION LOOP

## Weekly Tracking Dashboard

| Metric | Tool | What to Look For |
|--------|------|------------------|
| Indexed pages | GSC > Pages | Should match published pages |
| Total impressions | GSC > Performance | Week-over-week growth |
| Total clicks | GSC > Performance | Click growth |
| Avg CTR | GSC > Performance | Target 3%+ |
| Avg position | GSC > Performance | Movement toward page 1 |
| Top queries | GSC > Performance | New queries appearing |
| Core Web Vitals | GSC > Experience | All "Good" |
| Backlinks | Ahrefs/GSC | New referring domains |
| Errors | GSC > Pages | Fix crawl errors same day |

## Diagnostic Playbooks

### Indexing Issues
1. Check GSC > Pages > "Not indexed"
2. Look for "Discovered - not indexed" (low quality signal)
3. Check robots.txt isn't blocking
4. Manually request indexing for priority pages
5. Add internal links to orphan pages

### Ranking Drops
1. Check if site-wide or page-specific
2. Check for algorithm update timing (Search Engine Roundtable)
3. Check if competitors published similar content
4. Check for technical issues (speed, mobile)
5. Check for content decay (update stale pages)

### Cannibalization
1. Search site:[domain] [keyword] in Google
2. If multiple pages rank, check which has better metrics
3. Consolidate or differentiate content
4. Use canonical or noindex on weaker page

### CTR Problems
1. Compare CTR to position (position 1-3 should be 10%+)
2. Test new title tags (more specific, add year, add numbers)
3. Add FAQ schema for more SERP real estate
4. Check for SERP features stealing clicks

## A/B Tests to Run

| Test | How | Duration | Success Metric |
|------|-----|----------|----------------|
| Title tag variations | Change titles on 5 similar pages, compare CTR | 4 weeks | CTR improvement |
| Meta description length | Short vs long descriptions | 4 weeks | CTR improvement |
| Internal link anchor text | Exact match vs descriptive | 8 weeks | Ranking change |
| FAQ section addition | Add FAQ to 5 pages, compare | 4 weeks | Featured snippets, CTR |
| Last updated visibility | Prominent vs subtle date | 4 weeks | CTR, trust signals |

## 30/60/90 Day SEO Roadmap

### Days 1-30: Foundation
| Week | Output Target | Focus |
|------|---------------|-------|
| 1 | Domain live, GSC/GA4 setup, 15 existing pages optimized | Technical foundation |
| 2 | 10 new peptide pages, structured data on all pages | Content + technical |
| 3 | Glossary hub + 20 term pages, internal linking live | Architecture |
| 4 | 5 new comparison pages, first outreach batch (25 emails) | Content + links |

**Month 1 Totals**: 35 peptides, 20 glossary terms, 16 comparisons, full technical SEO, 25 outreach emails

### Days 31-60: Scale
| Week | Output Target | Focus |
|------|---------------|-------|
| 5 | 10 more peptide pages, 10 more glossary terms | Content velocity |
| 6 | 10 new guides, FAQ sections on all dossiers | Content depth |
| 7 | Link asset #1 (Evidence Index), 50 outreach emails | Link building |
| 8 | Category hub optimization, "best of" roundup pages | Hub authority |

**Month 2 Totals**: 45 peptides, 30 glossary terms, 21 guides, 1 link asset, 75 total outreach

### Days 61-90: Optimize
| Week | Output Target | Focus |
|------|---------------|-------|
| 9 | Update underperforming pages (bottom 20% by CTR) | Optimization |
| 10 | 10 more peptides, trials tracker launch | Content + features |
| 11 | Link asset #2 (Trial Tracker), 50 more outreach | Link building |
| 12 | Full audit, plan Month 4-6 based on data | Analysis |

**Month 3 Totals**: 55 peptides, 2 link assets, 125 total outreach, full optimization pass

---

# Budget Options

| Tier | Monthly Cost | What You Get |
|------|--------------|--------------|
| **Free** | $0 | GSC, GA4, Google Trends, free Ahrefs webmaster tools, manual outreach |
| **Starter** | $50-100 | Above + one paid tool (Ahrefs Lite OR Semrush trial rotation OR Screaming Frog) |
| **Growth** | $200-300 | Ahrefs Lite ($99) + Screaming Frog ($259/yr) + outreach tool (Hunter.io $49) |
| **Pro** | $500+ | Ahrefs Standard ($199) + Surfer SEO ($89) + outreach tool + VA for link building |

**My Recommendation**: Start at **Starter ($50-100)** for months 1-3, upgrade to **Growth** once you have GSC data showing traction.

---

# Monetization Notes

Since you asked about affiliate/lead-gen options:

| Model | How It Works for PepCodex | Effort | Revenue Potential |
|-------|---------------------------|--------|-------------------|
| **Display Ads** | Mediavine/AdThrive at 50k sessions, or Ezoic earlier | Low | $10-30 RPM |
| **Sponsorships** | Peptide-adjacent brands (labs, testing services, health brands) | Med | $500-2000/mo |
| **Affiliate** | Link to peptide testing services, health supplements, books | Med | Variable |
| **Lead Gen** | "Find a clinic" directory with paid listings | High | High potential |
| **Premium Content** | Gated research reports, API access | High | Subscription revenue |

**Best fit for educational site**: Sponsorships + Display Ads + selective affiliate (testing/supplements only, not peptide sourcing)

---

# Implementation Progress

## Completed ✅
- [x] Update astro.config.mjs site URL to pepcodex.com
- [x] Create JSON-LD structured data components (Organization, Breadcrumb, Article, FAQ, ItemList)
- [x] Add structured data to BaseLayout (Organization)
- [x] Add Article + Breadcrumb schema to DossierLayout
- [x] Create glossary content collection schema
- [x] Create glossary page templates and routes
- [x] Create RelatedEntities internal linking component
- [x] Add SEO fields to content schemas (canonical, robots)
- [x] Add glossary link to navigation
- [x] Create 3 sample glossary entries (GLP-1, Receptor Agonist, Peptide)
- [x] Rebrand from PEPTIDELIB to PEPCODEX

## Next Up
- [ ] Register pepcodex.com domain
- [ ] Set up Google Search Console
- [ ] Set up GA4
- [ ] Add more glossary terms (target: 20)
- [ ] Add FAQ sections to peptide dossiers
- [ ] Integrate RelatedEntities component into all layouts
- [ ] Create author/team page for E-E-A-T

---

*Last updated: January 2026*
