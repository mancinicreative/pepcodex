# PHASE 3: STRATEGY LIBRARY
## Pepcodex Competitive Intelligence

**Generated:** 2026-02-01
**Your Product:** pepcodex.com | Evidence-based peptide research database
**Priority:** Traffic (#1) → Revenue (#2)

---

## Strategy Card Format

Each card includes:
- **What:** Description of the strategy
- **Why:** Competitive rationale
- **Effort:** 1-5 (1=hours, 5=weeks)
- **Impact:** 1-5 (1=marginal, 5=transformative)
- **Test Signal:** How to validate it's working
- **Kill Trigger:** When to abandon
- **Roadmap Fit:** Integration with existing v4.0 phases

---

# URL EXPANSION STRATEGIES

## Strategy 1: Comparison Page Network

| Dimension | Detail |
|-----------|--------|
| **What** | Generate 100+ pages at `/compare/{peptide-a}-vs-{peptide-b}` |
| **Why** | peptibase has 66 comparison pages; captures "[A] vs [B]" search intent |
| **Effort** | 3 (template + data population) |
| **Impact** | 5 (high search volume, low competition) |
| **Test Signal** | 10 comparison pages indexed within 2 weeks |
| **Kill Trigger** | <500 impressions across all comparison pages after 60 days |
| **Roadmap Fit** | Add as Phase 16 (after Calculator Suite) |

**Implementation Notes:**
- Generate top 100 pairings by category overlap
- Use alphabetical ordering for canonicalization
- Include FAQPage schema (3 Q&A per page)
- Evidence grades as differentiator vs. peptibase dosing tables

---

## Strategy 2: Research Summary Subpages

| Dimension | Detail |
|-----------|--------|
| **What** | Add `/peptides/{slug}/research-summary` for all 188 peptides |
| **Why** | peptibase uses `/how-to-use` subpages; we adapt for evidence-first positioning |
| **Effort** | 2 (template + programmatic generation from existing data) |
| **Impact** | 4 (doubles peptide URL surface) |
| **Test Signal** | 50% of new pages indexed within 3 weeks |
| **Kill Trigger** | <100 total impressions from subpages after 60 days |
| **Roadmap Fit** | Add as Phase 15 (Subpage Multiplication) |

**Sections:**
- Research Highlights (key findings)
- Evidence Grade + Breakdown
- Study Timeline
- Research FAQs
- CTA: View Full Profile

---

## Strategy 3: Related Research Subpages

| Dimension | Detail |
|-----------|--------|
| **What** | Add `/peptides/{slug}/related-research` for all 188 peptides |
| **Why** | peptibase uses `/alternatives`; we frame as research connections |
| **Effort** | 2 (template + category-based population) |
| **Impact** | 4 (triples peptide URL surface with Strategy 2) |
| **Test Signal** | Cross-links driving 10%+ of page views |
| **Kill Trigger** | <50 clicks to related peptides after 60 days |
| **Roadmap Fit** | Add as Phase 15 (Subpage Multiplication) |

**Sections:**
- Similar Mechanisms (peptides with related pathways)
- Same Research Area (by condition)
- Evidence Comparison Table
- CTA: Compare Research Profiles

---

## Strategy 4: Calculator URL Multiplication

| Dimension | Detail |
|-----------|--------|
| **What** | Generate `/calculator/{type}?peptide={slug}` for all peptides |
| **Why** | peptide-db has 250+ calculator URLs capturing "[peptide] calculator" queries |
| **Effort** | 2 (already have calculators; add peptide parameter routing) |
| **Impact** | 4 (376+ new URLs targeting high-intent queries) |
| **Test Signal** | 5+ calculator pages ranking for "[peptide] calculator" |
| **Kill Trigger** | <200 total impressions from calculator pages after 60 days |
| **Roadmap Fit** | Extend Phase 14 (Calculator Suite) |

**Implementation:**
- Add peptide selector dropdown
- Pre-fill values from peptide data
- Add "View Research Profile" CTA
- Include HowTo schema (neither competitor uses this)

---

## Strategy 5: Glossary Hub

| Dimension | Detail |
|-----------|--------|
| **What** | Create `/glossary` hub + 100 term pages at `/glossary/{term}` |
| **Why** | Neither competitor has a glossary; captures "what is [term]" queries |
| **Effort** | 3 (term list + definitions + linking) |
| **Impact** | 3 (lower search volume but low competition) |
| **Test Signal** | 20 glossary pages ranking in top 20 for "[term] definition" |
| **Kill Trigger** | <50 total clicks from glossary after 90 days |
| **Roadmap Fit** | Add as Phase 19 (after Dossier UX Overhaul) |

**Starter Terms (20 high-value):**
1. Reconstitution
2. Lyophilized
3. Bacteriostatic water
4. Subcutaneous injection
5. Half-life
6. Bioavailability
7. Peptide bond
8. Amino acid sequence
9. GH secretagogue
10. GLP-1 agonist
11. Bioregulator
12. Peptide synthesis
13. MCG vs MG
14. Insulin syringe
15. Peptide stability
16. Cold chain
17. Peptide purity
18. Third-party testing
19. Certificate of analysis
20. Research-grade peptide

---

## Strategy 6: Condition Research Pages

| Dimension | Detail |
|-----------|--------|
| **What** | Create `/peptides-researched-for-{condition}` pages |
| **Why** | peptibase has 6 "best for" pages; we can have 20+ with evidence framing |
| **Effort** | 3 (template + condition-peptide mapping) |
| **Impact** | 5 (captures commercial-intent queries) |
| **Test Signal** | 3+ pages ranking top 10 for "peptides for [condition]" |
| **Kill Trigger** | <500 impressions across all condition pages after 60 days |
| **Roadmap Fit** | Aligns with Phase 20 (Programmatic SEO - Conditions) |

**Target Conditions (20):**
1. Weight loss
2. Muscle growth
3. Healing/recovery
4. Anti-aging
5. Cognitive enhancement
6. Sleep quality
7. Gut health
8. Inflammation
9. Joint health
10. Skin/collagen
11. Hair growth
12. Immune function
13. Energy/fatigue
14. Bone density
15. Cardiovascular
16. Neuroprotection
17. Metabolic health
18. Hormonal balance
19. Athletic performance
20. Longevity

---

# SCHEMA & TECHNICAL SEO STRATEGIES

## Strategy 7: Deep Schema Implementation

| Dimension | Detail |
|-----------|--------|
| **What** | Add 6+ schema types to all page templates |
| **Why** | peptibase has comprehensive schema; peptide-db has minimal |
| **Effort** | 2 (Astro component for each schema type) |
| **Impact** | 3 (rich snippets, E-E-A-T signals) |
| **Test Signal** | FAQPage rich results appearing in 30% of indexed pages |
| **Kill Trigger** | No rich results after 90 days despite valid markup |
| **Roadmap Fit** | Aligns with Phase 22 (SEO Polish) |

**Schema Types to Implement:**
1. Organization (already have?)
2. WebSite with SearchAction
3. MedicalWebPage with lastReviewed
4. Drug (per peptide)
5. FAQPage (3-5 Q&A per page)
6. BreadcrumbList
7. HowTo (calculators - unique to Pepcodex)
8. Article (blog/guides)

---

## Strategy 8: FAQPage Schema at Scale

| Dimension | Detail |
|-----------|--------|
| **What** | Add 5 FAQs to every peptide page with FAQPage schema |
| **Why** | peptibase shows FAQ rich results; peptide-db doesn't |
| **Effort** | 2 (template + programmatic FAQ generation) |
| **Impact** | 4 (SERP real estate, featured snippets) |
| **Test Signal** | FAQ rich results appearing for 20+ peptide pages |
| **Kill Trigger** | <10% of FAQs generating rich results after 90 days |
| **Roadmap Fit** | Phase 22 (SEO Polish) or Phase 16 (Dossier UX) |

**FAQ Templates per Peptide:**
1. What is {peptide}?
2. What research has been done on {peptide}?
3. What is the evidence grade for {peptide}?
4. How many studies exist for {peptide}?
5. What are the research areas for {peptide}?

---

# TRUST & CREDIBILITY STRATEGIES

## Strategy 9: Evidence Grade System (Differentiation)

| Dimension | Detail |
|-----------|--------|
| **What** | Prominently display evidence grades on all pages |
| **Why** | Neither competitor has systematic evidence grading |
| **Effort** | 2 (already built; needs prominent UX) |
| **Impact** | 4 (differentiation, E-E-A-T, trust) |
| **Test Signal** | "evidence grade" appearing in search queries driving traffic |
| **Kill Trigger** | Never - core brand differentiation |
| **Roadmap Fit** | Phase 16 (Dossier UX Overhaul) |

**Display Strategy:**
- Large badge in hero section
- Breakdown: X human studies, Y animal, Z in-vitro
- Link to methodology page

---

## Strategy 10: Methodology Page

| Dimension | Detail |
|-----------|--------|
| **What** | Create `/methodology` explaining evidence grading system |
| **Why** | Neither competitor has transparent methodology; E-E-A-T signal |
| **Effort** | 1 (single page, high-quality content) |
| **Impact** | 3 (trust, credibility, journalist citations) |
| **Test Signal** | Methodology page linked by external sites |
| **Kill Trigger** | Never - core trust infrastructure |
| **Roadmap Fit** | Add to Phase 13 (Legal Foundation) |

**Content:**
- How we grade evidence
- Study type hierarchy (RCT > observational > animal > in-vitro)
- Source quality scoring
- Conflict of interest disclosure
- Update frequency

---

## Strategy 11: Editorial Team Page

| Dimension | Detail |
|-----------|--------|
| **What** | Create `/team` or `/about/editorial` with author credentials |
| **Why** | Neither competitor shows author credentials; E-E-A-T gap |
| **Effort** | 1 (if real team exists) |
| **Impact** | 3 (trust, YMYL compliance) |
| **Test Signal** | Google Search Console showing improved YMYL metrics |
| **Kill Trigger** | N/A - required for YMYL content |
| **Roadmap Fit** | Add to Phase 13 (Legal Foundation) |

**Content:**
- Editorial guidelines
- Contributor credentials (if available)
- Medical review process (if applicable)
- Contact for corrections

---

## Strategy 12: Last Updated Dates

| Dimension | Detail |
|-----------|--------|
| **What** | Add visible "Last updated: {date}" to all content pages |
| **Why** | Neither competitor shows update dates prominently |
| **Effort** | 1 (frontmatter field + template update) |
| **Impact** | 2 (freshness signals, trust) |
| **Test Signal** | Google showing date in search results |
| **Kill Trigger** | Never - basic best practice |
| **Roadmap Fit** | Phase 16 (Dossier UX Overhaul) |

---

# CONTENT STRATEGIES

## Strategy 13: Bioregulator Focus (Content Gap)

| Dimension | Detail |
|-----------|--------|
| **What** | Create comprehensive coverage of bioregulator peptides |
| **Why** | Competitors have minimal bioregulator content |
| **Effort** | 3 (research + dossier creation) |
| **Impact** | 4 (untapped niche, growing interest) |
| **Test Signal** | Top 5 ranking for "[bioregulator] research" queries |
| **Kill Trigger** | <100 impressions for bioregulator pages after 90 days |
| **Roadmap Fit** | Content expansion priority |

**Target Bioregulators:**
1. Epithalon
2. Thymalin
3. Cortexin
4. Pinealon
5. Vilon
6. Livagen
7. Prostamax
8. Kristagen

---

## Strategy 14: GLP-1 Deep Coverage

| Dimension | Detail |
|-----------|--------|
| **What** | Comprehensive coverage of GLP-1 agonists (highest search volume) |
| **Why** | Semaglutide/Ozempic are trending; competitors cover but not deeply |
| **Effort** | 3 (extensive research required) |
| **Impact** | 5 (massive search volume, mainstream interest) |
| **Test Signal** | Page 1 rankings for any GLP-1 related queries |
| **Kill Trigger** | Never - too high value |
| **Roadmap Fit** | Content expansion priority |

**Target Peptides:**
1. Semaglutide (Ozempic, Wegovy)
2. Tirzepatide (Mounjaro)
3. Retatrutide
4. Liraglutide
5. Exenatide

---

# DISTRIBUTION STRATEGIES

## Strategy 15: Reddit Authority Building

| Dimension | Detail |
|-----------|--------|
| **What** | Build karma/authority in r/Peptides, r/Biohackers, r/longevity |
| **Why** | Community trust → direct traffic → citation links |
| **Effort** | 4 (ongoing time investment) |
| **Impact** | 4 (high-intent traffic, community trust) |
| **Test Signal** | 500+ karma, 5+ pepcodex mentions without removal |
| **Kill Trigger** | Account suspended or <10 referrals after 90 days |
| **Roadmap Fit** | Parallel to development work |

**Phases:**
1. Weeks 1-4: Lurk + helpful comments (no promotion)
2. Weeks 5-8: Value-first posts, subtle expertise signals
3. Weeks 9+: Strategic pepcodex links when genuinely helpful

---

## Strategy 16: Newsletter Growth

| Dimension | Detail |
|-----------|--------|
| **What** | Grow Beehiiv newsletter from 0 to 500+ subscribers |
| **Why** | Retention loop, sponsor revenue potential |
| **Effort** | 3 (content creation + lead capture optimization) |
| **Impact** | 4 (owned audience, monetization path) |
| **Test Signal** | 100 subscribers in first 60 days |
| **Kill Trigger** | <50 subscribers after 90 days |
| **Roadmap Fit** | v3.0 (on hold) - consider moving to v4.0 |

**Growth Tactics:**
- Exit-intent popup (not intrusive)
- Newsletter-exclusive research summaries
- "500+ researchers" social proof (once achieved)
- Content upgrade on high-traffic pages

---

# MONETIZATION STRATEGIES

## Strategy 17: Sponsor Directory Infrastructure

| Dimension | Detail |
|-----------|--------|
| **What** | Build `/directory` page with listing infrastructure (no pricing yet) |
| **Why** | Revenue path when traffic justifies; competitors have no directory |
| **Effort** | 2 (page + apply form + badge component) |
| **Impact** | 2 (revenue potential; impact depends on traffic) |
| **Test Signal** | 5+ unsolicited listing inquiries |
| **Kill Trigger** | N/A - build infrastructure, price later |
| **Roadmap Fit** | v4.0 Phase 21 (Location SEO - Cities) or new phase |

**Build Order:**
1. /directory page (placeholder listings)
2. SponsorBadge.astro component
3. /directory/apply form (goes to info@pepcodex.com)
4. Add pricing when traffic supports

---

## Strategy 18: Category Sponsorship Slots

| Dimension | Detail |
|-----------|--------|
| **What** | Add "Sponsored by" slot to category pages |
| **Why** | B2B revenue from testing labs, research companies |
| **Effort** | 1 (template slot, empty initially) |
| **Impact** | 2 (future revenue; depends on traffic) |
| **Test Signal** | Inbound sponsor inquiries |
| **Kill Trigger** | N/A - infrastructure for future |
| **Roadmap Fit** | Phase 21 (Location SEO) |

---

# QUICK WINS (LOW EFFORT, IMMEDIATE VALUE)

## Strategy 19: Meta Robots Optimization

| Dimension | Detail |
|-----------|--------|
| **What** | Add `max-snippet:-1, max-image-preview:large` to all pages |
| **Why** | peptibase uses this; maximizes SERP real estate |
| **Effort** | 1 (single template update) |
| **Impact** | 2 (improved snippet display) |
| **Test Signal** | Larger snippets appearing in SERPs |
| **Kill Trigger** | Never - free improvement |
| **Roadmap Fit** | Immediate (can do now) |

---

## Strategy 20: Sitemap in Robots.txt

| Dimension | Detail |
|-----------|--------|
| **What** | Add `Sitemap: https://pepcodex.com/sitemap.xml` to robots.txt |
| **Why** | Both competitors do this; crawl efficiency |
| **Effort** | 1 (one line) |
| **Impact** | 1 (basic SEO hygiene) |
| **Test Signal** | GSC showing sitemap discovered via robots.txt |
| **Kill Trigger** | Never - basic best practice |
| **Roadmap Fit** | Immediate |

---

## Strategy 21: Internal Linking Audit

| Dimension | Detail |
|-----------|--------|
| **What** | Ensure every peptide page links to 5+ related peptides |
| **Why** | Competitors link to 17-40+ pages internally |
| **Effort** | 2 (automated or semi-automated) |
| **Impact** | 3 (crawl depth, PageRank distribution) |
| **Test Signal** | Average internal links per page >15 |
| **Kill Trigger** | Never - fundamental SEO |
| **Roadmap Fit** | Phase 22 (SEO Polish) |

---

# STRATEGY PRIORITY MATRIX

## Effort vs Impact Grid

```
IMPACT
  5 │  14   │  1,6  │     │     │     │
    │ GLP-1 │ Comp, │     │     │     │
    │       │ Cond  │     │     │     │
  4 │  15   │  2,3  │  4  │  8  │     │
    │Reddit │Subpg  │Calc │FAQ  │     │
    │       │       │     │     │     │
  3 │  13   │  5,9  │ 7   │ 10  │     │
    │Bioreg │Gloss  │Schm │Meth │     │
    │       │Grade  │     │     │     │
  2 │       │ 17,18 │ 12  │ 19  │ 20  │
    │       │Spnsr  │Date │Meta │Robo │
    │       │       │     │     │     │
  1 │       │       │     │     │ 21  │
    │       │       │     │     │Link │
    └───────┴───────┴─────┴─────┴─────┘
        5       4       3      2      1
                    EFFORT
```

## Recommended Execution Order

### Tier 1: Quick Wins (Week 1)
| # | Strategy | Effort | Impact |
|---|----------|--------|--------|
| 19 | Meta Robots Optimization | 1 | 2 |
| 20 | Sitemap in Robots.txt | 1 | 1 |
| 12 | Last Updated Dates | 1 | 2 |

### Tier 2: High Impact, Low-Medium Effort (Weeks 2-4)
| # | Strategy | Effort | Impact |
|---|----------|--------|--------|
| 1 | Comparison Page Network | 3 | 5 |
| 2 | Research Summary Subpages | 2 | 4 |
| 3 | Related Research Subpages | 2 | 4 |
| 9 | Evidence Grade Prominence | 2 | 4 |

### Tier 3: Medium Effort, High Impact (Weeks 4-8)
| # | Strategy | Effort | Impact |
|---|----------|--------|--------|
| 4 | Calculator URL Multiplication | 2 | 4 |
| 6 | Condition Research Pages | 3 | 5 |
| 8 | FAQPage Schema at Scale | 2 | 4 |
| 14 | GLP-1 Deep Coverage | 3 | 5 |

### Tier 4: Ongoing / Parallel
| # | Strategy | Effort | Impact |
|---|----------|--------|--------|
| 15 | Reddit Authority Building | 4 | 4 |
| 16 | Newsletter Growth | 3 | 4 |
| 13 | Bioregulator Focus | 3 | 4 |

### Tier 5: Infrastructure (Build Now, Monetize Later)
| # | Strategy | Effort | Impact |
|---|----------|--------|--------|
| 10 | Methodology Page | 1 | 3 |
| 11 | Editorial Team Page | 1 | 3 |
| 17 | Sponsor Directory Infrastructure | 2 | 2 |

---

# INTEGRATION WITH V4.0 ROADMAP

## Current v4.0 Phases → Updated with Strategies

| Current Phase | Strategies to Add |
|---------------|-------------------|
| 13: Legal Foundation | +10 (Methodology), +11 (Editorial Team) |
| 14: Calculator Suite | +4 (URL Multiplication) |
| 15: Peptide Interactions | Keep as-is |
| **NEW 15.5: Subpage Multiplication** | +2, +3 (Research Summary, Related Research) |
| **NEW 15.7: Comparison Network** | +1 (100+ comparison pages) |
| 16: Dossier UX Overhaul | +9 (Evidence Grade), +12 (Last Updated) |
| 17: Content Migration | Keep as-is (lower priority) |
| 18: Multi-Peptide Protocols | Keep as-is |
| **NEW 18.5: Glossary Hub** | +5 (100 terms) |
| 19: Enhanced UX | Keep as-is |
| 20: Programmatic SEO | +6 (Condition Pages) |
| 21: Location SEO | +17, +18 (Sponsor Infrastructure) |
| 22: SEO Polish | +7 (Schema), +8 (FAQPage), +19, +20, +21 |

---

## NEXT: Phase 4 - Gap Analysis + SERP Features

Ready to analyze specific keyword gaps and SERP feature opportunities.

---

*Phase 3 Complete | Generated 2026-02-01*
