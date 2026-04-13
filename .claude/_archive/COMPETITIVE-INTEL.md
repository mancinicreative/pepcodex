# PEPCODEX COMPETITIVE INTELLIGENCE REPORT
## "Copy, Improve, Dominate" Analysis v2.0

**Generated:** 2026-02-01
**Product:** pepcodex.com (Astro 5.16 + MDX + Tailwind)
**Niche:** Peptide research database
**Current Status:** ~66 pages (15 peptides, 11 guides, 11 comparisons, 11 safety, 3 glossary)
**Guardrails:** Educational/evidence-first; no dosing protocols, medical advice, or sourcing

---

# EVIDENCE CLASSIFICATION

Throughout this document:
- **KNOWN** = Verified from direct observation or first-party data
- **LIKELY** = Strong inference from observable patterns
- **UNKNOWN** = Requires SEO tools (Ahrefs/Semrush) for verification

---

# PHASE 1: COMPETITOR CARDS

## Summary Table

| Dimension | peptide-db.com | peptibase.dev | peptracker.app |
|-----------|----------------|---------------|----------------|
| **Positioning** | "Open source peptide research database" | "Research-grade peptide database" | "Never miss a peptide dose" |
| **Content Type** | Database + Calculators | Database + Tools + Comparisons | Mobile app (tracking) |
| **Peptide Count** | 95 (KNOWN) | 97+ (KNOWN) | N/A (app) |
| **Sitemap URLs** | 731 (KNOWN) | 759 (KNOWN) | ~20 (LIKELY) |
| **Monetization** | None visible | Freemium likely (Members section) | Freemium ($X/mo premium) |
| **Trust Model** | Open source + 369 citations | MedicalWebPage schema + citations | App store reviews |
| **Primary Moat** | Community/GitHub transparency | Polished UX + tool suite | Native app lock-in |
| **Key Weakness** | No monetization = sustainability risk | Thin trust signals (no author bios) | Not a database (different market) |

---

## Competitor Card A: peptide-db.com

### Positioning & Offer
- **Audience:** Researchers, biohackers, peptide-curious
- **Core Promise:** "Community-owned, free forever" open-source database
- **Category Framing:** Research database with tools
- **Why People Choose:** Free, transparent (GitHub), comprehensive

### IA & UX (Conversion Engine)
- **Nav Model:** Home → Browse Peptides → Categories → Guides → Calculators
- **<60s Aha Path:** Homepage → "95 Peptides" stat → Browse → Click peptide → See dosing + refs
- **CTAs:** "Browse Peptides", "Explore Categories", "Join others researching X"
- **Content Modules:**
  - Quick stats bar (dose, frequency, cycle, storage)
  - Molecular structure visualization
  - Research indications by condition
  - Peptide interaction matrix
  - Timeline expectations
  - References with dates

### SEO Strategy (Traffic Engine)
- **Content Types:**
  - 126 peptide pages (KNOWN)
  - 250 calculator pages (peptide-specific URLs) (KNOWN)
  - 10 category filter pages (KNOWN)
  - 3 guide articles (KNOWN)
  - 3 blend calculator pages (KNOWN)
- **URL Structure:** `/peptides/[slug]`, `/calculator/[peptide]`, `/categories`
- **Internal Linking:** Related peptides, category tags, calculator cross-links
- **Intent Targeting:** Informational (research) > Commercial (none)

### Monetization (Money Engine)
- **Status:** None visible (KNOWN)
- **Model:** Open source, unclear funding
- **Risk:** Sustainability without revenue

### Moat & Weakness
- **Hard to Copy:** 369 scientific references, open source credibility
- **Easy to Copy:** Page templates, peptide data, calculator logic
- **Weaknesses:**
  - No monetization path
  - Thin guide content (only 3)
  - No author/expert credibility signals
  - Limited comparison pages
  - No email capture visible

---

## Competitor Card B: peptibase.dev

### Positioning & Offer
- **Audience:** Researchers, biohackers, clinicians
- **Core Promise:** "Research-grade peptide database"
- **Category Framing:** Comprehensive database + decision tools
- **Why People Choose:** Polished UX, tool suite, clinical framing

### IA & UX (Conversion Engine)
- **Nav Model:** Browse → Compare → Stacks → Calc → Quiz → Blog → Members
- **<60s Aha Path:** Homepage → Category cards → Click peptide → See dosing tabs
- **CTAs:** Newsletter signup ("Join 500+ researchers"), Members access
- **Content Modules:**
  - Key facts table
  - "What to Expect" overview
  - Clinical trial progress visualization
  - Community vs. Research dosing tabs
  - Related peptides carousel
  - FAQ sections with schema

### SEO Strategy (Traffic Engine)
- **Content Types:**
  - 71 peptide pages (KNOWN)
  - 71 "How to use" subpages (KNOWN)
  - 71 "Alternatives" subpages (KNOWN)
  - 54 comparison pages (KNOWN)
  - 11 category pages (KNOWN)
  - 6 "Best for" guide pages (KNOWN)
- **URL Structure:**
  - `/peptides/[name]`
  - `/peptides/[name]/how-to-use`
  - `/peptides/[name]/alternatives`
  - `/compare/[peptide-a]-vs-[peptide-b]`
  - `/best-peptides-for-[use-case]`
- **Internal Linking:** Heavy cross-linking between main pages, how-to, alternatives
- **Intent Targeting:** Mixed (informational + comparison intent)

### Monetization (Money Engine)
- **Status:** Freemium (LIKELY)
- **Signals:** "Members" section, newsletter capture
- **Conversion Event:** Email signup → Member conversion

### Moat & Weakness
- **Hard to Copy:** 54 comparison pages (content depth), tool ecosystem
- **Easy to Copy:** Template structure, data
- **Weaknesses:**
  - No visible author/expert credentials
  - Content depth thinner than peptide-db on individual pages
  - Limited blog content
  - "MedicalWebPage" schema without visible medical review process

---

## Competitor Card C: peptracker.app

### Positioning & Offer
- **Audience:** Active peptide users needing tracking
- **Core Promise:** "Never miss a peptide dose again"
- **Category Framing:** Mobile utility app, not database
- **Why People Choose:** Convenience, reminders, calculations

### IA & UX
- **Model:** Native iOS/Android app
- **<60s Aha Path:** Download → Create protocol → Get reminder
- **CTAs:** App Store download, premium upgrade

### Monetization
- **Model:** Freemium
  - Free: 2 protocols, 5 templates
  - Premium: Unlimited protocols, export, advanced scheduling

### Moat & Weakness
- **Hard to Copy:** Native app development, App Store presence
- **Easy to Copy:** Calculator logic, protocol templates
- **Relevance to Pepcodex:** Different market segment (users vs. researchers). **Not a direct SEO competitor.**

---

# PHASE 1.5: TECHNICAL SEO & INDEXATION AUDIT

## Competitor Technical Advantages

| Signal | peptide-db.com | peptibase.dev | pepcodex (current) |
|--------|----------------|---------------|-------------------|
| **Total Indexed URLs** | 731 (KNOWN) | 759 (KNOWN) | ~66 (KNOWN) |
| **Schema Types** | Article, Organization, BreadcrumbList | Drug, MedicalWebPage, FAQPage, BreadcrumbList | Article, BreadcrumbList, FAQPage, Organization |
| **Programmatic URL Density** | High (250 calculator URLs) | High (213 subpages) | Low |
| **Content Freshness Signals** | References with dates | "Last reviewed" in schema | Unknown |
| **Mobile Experience** | Responsive (SvelteKit) | Responsive | Responsive (Astro) |

## Tech Advantages They Have

1. **Peptibase:** FAQPage + Drug schema = potential for rich snippets
2. **Peptibase:** 3x URL surface with /how-to-use and /alternatives subpages per peptide
3. **Peptide-db:** 250 peptide-specific calculator URLs = massive keyword surface
4. **Both:** 6-7x more indexable pages than pepcodex currently

## Tech Mistakes We Can Exploit

1. **Peptide-db:** No FAQPage schema despite having FAQ content
2. **Peptide-db:** Thin guide section (only 3 articles)
3. **Peptibase:** "MedicalWebPage" schema without visible editorial review = E-E-A-T vulnerability
4. **Peptibase:** No visible "last updated" on pages (only in schema, not user-visible)
5. **Both:** No visible author bylines or credentials
6. **Both:** Limited "best for" and comparison content

## Our Technical Must-Dos (Prioritized)

| Priority | Action | Impact | Effort |
|----------|--------|--------|--------|
| 1 | Scale to 100+ peptide pages | 9 | M |
| 2 | Create 3 subpages per peptide (how-to-use, alternatives, safety) | 9 | M |
| 3 | Build peptide-specific calculator URLs | 8 | M |
| 4 | Implement visible "Last updated" on all pages | 7 | S |
| 5 | Add author/editorial team page with credentials | 7 | S |
| 6 | Add Drug schema alongside Article schema | 6 | S |
| 7 | Create glossary with 100+ terms | 7 | M |

---

# PHASE 2: PROGRAMMATIC SEO REVERSE ENGINEERING

## Competitor Template Patterns (OBSERVED)

### peptide-db.com Template: Peptide Page
```
URL: /peptides/[slug]
Modules:
- Quick stats bar (dose, frequency, cycle, storage)
- Overview section
- Molecular structure diagram
- Research indications (by condition)
- Dosing protocols (by route)
- Peptide interactions matrix
- Timeline expectations
- Safety information
- Quality checklist
- References (dated)
Estimated Words: 2,500-3,500
```

### peptibase.dev Template: Peptide Page
```
URL: /peptides/[slug]
Modules:
- Key facts table
- "What to Expect" section
- Mechanism of action
- Clinical trial progress bar
- Dosing tabs (Community vs. Research)
- Side effects
- References (PubMed links)
- Related peptides carousel
- FAQ (with schema)
Estimated Words: 1,200-1,500
```

### peptibase.dev Template: Comparison Page
```
URL: /compare/[peptide-a]-vs-[peptide-b]
Pattern: 54 pages following this structure
```

---

## 3 BETTER TEMPLATES FOR PEPCODEX

### Template 1: Enhanced Peptide Dossier

**URL Pattern:** `/peptides/[slug]`

**Page Outline (Above-the-Fold):**
1. Hero: Peptide name + evidence grade badge + one-line summary
2. Quick stats grid (6 metrics): Evidence level, Phase, Primary use, Key mechanism, Approval status, Last updated
3. Table of contents (sticky on scroll)

**Full Modules:**
1. **Evidence Summary** (NEW - competitors lack this)
   - Human trials count + links
   - Animal studies summary
   - Safety profile rating
   - "What we know vs. don't know" clarity box
2. **Mechanism of Action** - simplified + technical toggle
3. **Research Applications** - by condition/goal with evidence grades each
4. **Molecular Profile** - structure, sequence, weight, stability
5. **Interactions & Synergies** - compatibility matrix with evidence
6. **Timeline & Expectations** - what to realistically expect from research
7. **Safety Considerations** - side effects, contraindications, gaps
8. **Research References** - dated, PubMed linked, with recency indicator
9. **Related Peptides** - same category, comparators, alternatives
10. **FAQ** - with FAQPage schema

**Taxonomy + Filters:**
- Categories: metabolic, repair-recovery, hormonal, longevity, cognitive, immune, skin, sleep, sexual-health, bioregulators
- Evidence levels: FDA-approved, Phase III, Phase II, Phase I, Preclinical, Limited
- Primary mechanism: GLP-1, GHRP, healing, etc.

**Internal Linking Modules:**
- Breadcrumbs (Home > Peptides > [Category] > [Name])
- Related peptides grid (3-5)
- "Compare with" links (auto-generated)
- Glossary term links (inline)
- Category hub links

**Trust Modules:**
- Evidence grade methodology link
- "Last updated" with changelog
- Citation count + recency score
- Editorial policy link

**MVP Scope (Ship in 1-3 days):**
- Hero + quick stats + evidence summary + mechanism + references + FAQ
- Estimated: 1,500-2,000 words

**Deluxe Scope (2-4 weeks):**
- Full 10-module structure
- Interactive evidence explorer
- Comparison widget embed
- Estimated: 3,000-4,000 words

**Indexation Rules:**
- All peptide pages: index, follow
- Canonical: self-referencing
- noindex: if <500 words (thin content protection)

---

### Template 2: Peptide Comparison Hub

**URL Pattern:** `/compare/[peptide-a]-vs-[peptide-b]`

**Page Outline (Above-the-Fold):**
1. Title: "[Peptide A] vs [Peptide B]: Research Comparison"
2. Summary verdict box: "Key differences at a glance"
3. Side-by-side comparison table (6-8 key metrics)

**Full Modules:**
1. **Quick Comparison Table**
   - Evidence level, mechanism, primary use, side effect profile, approval status
2. **Detailed Mechanism Comparison** - how each works differently
3. **Research Evidence Comparison** - which has more/better evidence for what
4. **Use Case Breakdown** - "For [goal], [Peptide A/B] may be better because..."
5. **Safety Comparison** - side effect profiles head-to-head
6. **FAQ** - "Which is better for X?" format (PAA targeting)
7. **Verdict Summary** - balanced, evidence-based takeaway

**MVP Scope:**
- Comparison table + key differences + FAQ
- Estimated: 800-1,200 words

**Deluxe Scope:**
- Full 7-module structure + interactive comparison tool
- Estimated: 1,500-2,000 words

**Internal Linking:**
- Both peptide dossiers
- Related comparisons (same category)
- Category hub

**Indexation:**
- All comparison pages: index, follow
- Canonical: self-referencing
- Generate for top 50 peptide pairs by search volume

---

### Template 3: Glossary Term Page

**URL Pattern:** `/glossary/[term]`

**Page Outline:**
1. Term + pronunciation (if applicable)
2. One-sentence definition
3. Why it matters (context)
4. Related peptides that involve this term
5. See also (related terms)

**MVP Scope:**
- Definition + relevance + related peptides
- Estimated: 200-400 words
- Ship 50-100 terms in batch

**Indexation:**
- index, follow if unique content
- noindex if duplicate/near-duplicate
- Canonical: self-referencing

---

# PHASE 3: STRATEGY LIBRARY

## Strategy Card 1: Peptide-Specific Calculator URLs

**Strategy Name:** Calculator URL Multiplication
**Competitors Using:** peptide-db.com (250 URLs)
**Mechanism:** Each peptide gets its own calculator URL, capturing "[peptide] calculator" searches
**Evidence:** peptide-db.com sitemap shows 250 calculator URLs (KNOWN)
**Implementation Steps:**
1. Create `/calculator/[peptide]` route
2. Pre-populate calculator with that peptide's typical parameters
3. Include peptide-specific dosing notes
4. Add schema markup (HowTo)

**Make-It-Better:**
- Add comparison calculator (calculate multiple peptides)
- Save calculations to local storage
- Export to PDF

**Defensibility:** First-mover with richer calculator pages
**Risks:** Calculator queries may have low volume
**Metrics:** Organic impressions on calculator pages, conversions to peptide pages
**Time-to-Impact:** 2-4 weeks
**Effort:** 3 | **Impact:** 4

---

## Strategy Card 2: Subpage Multiplication (How-To + Alternatives)

**Strategy Name:** 3x URL Surface Per Entity
**Competitors Using:** peptibase.dev (71 × 3 = 213 subpages)
**Mechanism:** Each peptide has `/how-to-use` and `/alternatives` subpages, capturing long-tail queries
**Evidence:** peptibase.dev sitemap shows this pattern (KNOWN)
**Implementation Steps:**
1. Create dynamic routes: `/peptides/[slug]/how-to-use`, `/peptides/[slug]/alternatives`
2. Generate content programmatically from peptide data
3. Add unique intro/context per page

**Make-It-Better:**
- Add `/peptides/[slug]/evidence` page with full research breakdown
- Add `/peptides/[slug]/faq` dedicated page

**Defensibility:** 4x URL surface creates moat through breadth
**Risks:** Thin content penalty if pages aren't differentiated enough
**Metrics:** Indexed pages, organic impressions per subpage type
**Time-to-Impact:** 1-2 weeks
**Effort:** 2 | **Impact:** 5

---

## Strategy Card 3: "Best For" Category Pages

**Strategy Name:** Best-For Intent Capture
**Competitors Using:** peptibase.dev (6 pages)
**Mechanism:** Captures "best peptide for [X]" high-intent searches
**Evidence:** peptibase.dev has best-peptides-for-[weight-loss|healing|etc.] (KNOWN)
**Implementation Steps:**
1. Create `/best-peptides-for-[use-case]` pages
2. Rank peptides by evidence level for that use case
3. Include comparison table + individual sections

**Make-It-Better:**
- Add filtering by evidence level (show only FDA-approved, etc.)
- Add user quiz: "Find the right peptide for your goal"
- More use cases than competitors (15-20 vs. their 6)

**Defensibility:** More categories = more keyword coverage
**Risks:** Competitive keywords may take time to rank
**Metrics:** Rankings for "best [X] peptide" keywords
**Time-to-Impact:** 4-8 weeks
**Effort:** 3 | **Impact:** 5

---

## Strategy Card 4: Comparison Page Network

**Strategy Name:** VS Page Saturation
**Competitors Using:** peptibase.dev (54 pages)
**Mechanism:** Captures "[peptide A] vs [peptide B]" searches
**Evidence:** peptibase.dev sitemap shows 54 comparison pages (KNOWN)
**Implementation Steps:**
1. Identify top 50-100 peptide pairs by category proximity
2. Generate comparison pages programmatically
3. Add unique editorial summary per page

**Make-It-Better:**
- Interactive comparison tool (add any 2-3 peptides)
- Evidence-weighted scoring
- More pairs than competitors (100+ vs. 54)

**Defensibility:** Breadth of comparisons creates discovery moat
**Risks:** Some comparisons may have near-zero search volume
**Metrics:** Organic traffic to /compare/ directory
**Time-to-Impact:** 2-4 weeks
**Effort:** 3 | **Impact:** 5

---

## Strategy Card 5: Evidence Grade System (Trust Moat)

**Strategy Name:** Transparent Evidence Grading
**Competitors Using:** Neither prominently
**Mechanism:** Unique trust signal that differentiates from competitors; E-E-A-T signal for Google
**Evidence:** Both competitors mention "research" but lack systematic evidence framework
**Implementation Steps:**
1. Create evidence grading methodology (/methodology page)
2. Apply grades to all peptides
3. Display badges prominently
4. Link to supporting evidence

**Make-It-Better:**
- Interactive evidence explorer per peptide
- "What we don't know" transparency sections
- Evidence changelog per peptide

**Defensibility:** Hard to copy without genuine editorial process
**Risks:** Initial effort to establish grades
**Metrics:** E-E-A-T perception (manual review), trust-related user behavior (lower bounce, more pages/session)
**Time-to-Impact:** 2-4 weeks
**Effort:** 4 | **Impact:** 5

---

## Strategy Card 6: Newsletter + Content Digest

**Strategy Name:** Email-Driven Retention Loop
**Competitors Using:** peptibase.dev (LIKELY)
**Mechanism:** Captures visitors for re-engagement; builds owned audience
**Evidence:** "Join 500+ researchers" on peptibase.dev
**Implementation Steps:**
1. Create newsletter signup (on all pages, non-intrusive)
2. Build weekly digest: new peptides, research updates, comparisons
3. Track signups as conversion event

**Make-It-Better:**
- Research alerts: "Get notified when [peptide] research updates"
- Personalized digest based on saved peptides
- "What's new this week" page (SEO + email content)

**Defensibility:** Email list is owned audience
**Risks:** GDPR compliance, deliverability
**Metrics:** Signup rate, open rate, return visit rate
**Time-to-Impact:** 1-2 weeks setup, ongoing compound
**Effort:** 2 | **Impact:** 4

---

## Strategy Card 7: Open Source Positioning

**Strategy Name:** Community Credibility Play
**Competitors Using:** peptide-db.com (MIT license, GitHub)
**Mechanism:** Builds trust through transparency; attracts contributors
**Evidence:** peptide-db.com prominently links GitHub (KNOWN)
**Implementation Steps:**
1. Make data/code open source
2. Accept community contributions (with review)
3. Display contributor credits

**Make-It-Better:**
- Public roadmap + feature voting
- Community-driven error correction
- Contributor leaderboard

**Defensibility:** Community moat; hard to replicate culture
**Risks:** Maintenance burden; quality control
**Metrics:** GitHub stars, contributors, community corrections
**Time-to-Impact:** Ongoing compound
**Effort:** 3 | **Impact:** 3

---

## Strategy Card 8: FAQ Schema Saturation

**Strategy Name:** PAA/Featured Snippet Capture
**Competitors Using:** peptibase.dev (FAQPage schema)
**Mechanism:** FAQPage schema increases chance of featured snippets and PAA
**Evidence:** peptibase.dev uses FAQPage schema (KNOWN)
**Implementation Steps:**
1. Add 5-8 FAQs per peptide page
2. Implement FAQPage schema
3. Target "People Also Ask" questions

**Make-It-Better:**
- FAQ sections on ALL page types (comparisons, guides, glossary)
- Dynamic FAQ generation based on common questions
- More FAQs than competitors

**Defensibility:** Quality and quantity of FAQ coverage
**Risks:** Google may not always show FAQ snippets
**Metrics:** Featured snippet wins, PAA appearances
**Time-to-Impact:** 2-4 weeks
**Effort:** 2 | **Impact:** 4

---

## Strategy Card 9: Category + Filter Pages (Faceted SEO)

**Strategy Name:** Filtered View Indexation
**Competitors Using:** Both (category pages)
**Mechanism:** Category and filter pages capture categorical search intent
**Evidence:** /peptides?category=[x] patterns observed
**Implementation Steps:**
1. Create static category hub pages (not just query params)
2. Create filtered views: by evidence level, approval status, mechanism
3. Each filter combo = unique URL

**Make-It-Better:**
- More filter dimensions than competitors
- Filter combination pages (e.g., /peptides/healing/fda-approved)
- Category comparison pages

**Defensibility:** Breadth of taxonomy
**Risks:** Thin content on narrow filter combos
**Metrics:** Indexed category pages, organic traffic
**Time-to-Impact:** 2-4 weeks
**Effort:** 3 | **Impact:** 4

---

## Strategy Card 10: Glossary + Definition Pages

**Strategy Name:** "What Is X" Query Capture
**Competitors Using:** Neither substantially
**Mechanism:** Captures definition queries; builds internal linking; establishes topical authority
**Evidence:** Neither competitor has substantial glossary section
**Implementation Steps:**
1. Create glossary hub (/glossary)
2. Generate 50-100 term pages
3. Auto-link terms in content

**Make-It-Better:**
- Visual aids (diagrams, simple explanations)
- Related peptides per term
- "Learn more" paths

**Defensibility:** First comprehensive glossary in space
**Risks:** Low individual page value
**Metrics:** Indexed glossary pages, internal link flow
**Time-to-Impact:** 1-2 weeks
**Effort:** 2 | **Impact:** 4

---

## Strategy Card 11: Clinical Trials Tracker

**Strategy Name:** Living Research Updates
**Competitors Using:** peptibase.dev (trial progress bars)
**Mechanism:** Captures "peptide clinical trial" queries; signals freshness
**Evidence:** peptibase.dev shows clinical trial progress visualization
**Implementation Steps:**
1. Create /trials page with all ongoing trials
2. Link to ClinicalTrials.gov
3. Show status per peptide

**Make-It-Better:**
- Automatic updates via ClinicalTrials.gov API
- "Subscribe to trial updates" per peptide
- Trial timeline visualization

**Defensibility:** Automated freshness
**Risks:** API reliability; maintenance
**Metrics:** Organic traffic to trials pages, email signups
**Time-to-Impact:** 2-4 weeks
**Effort:** 4 | **Impact:** 3

---

## Strategy Card 12: Stack/Protocol Pages

**Strategy Name:** Multi-Peptide Combination Content
**Competitors Using:** peptide-db.com (Wolverine Stack, KLOW Protocol)
**Mechanism:** Captures "peptide stack" queries; increases engagement depth
**Evidence:** peptide-db.com features named protocols (KNOWN)
**Implementation Steps:**
1. Create /stacks page with common combinations
2. Link to individual peptide pages
3. Add interaction warnings

**Make-It-Better:**
- Evidence-graded stacks (only well-documented combos)
- Stack builder tool (interactive)
- User-submitted stacks with community validation

**Defensibility:** Evidence-based curation
**Risks:** Protocol content may edge toward dosing (guardrail)
**Metrics:** Organic traffic to stack pages
**Time-to-Impact:** 2-4 weeks
**Effort:** 3 | **Impact:** 3

---

## Strategy Card 13: Interactive Comparison Tool

**Strategy Name:** Tool-Driven Engagement
**Competitors Using:** peptibase.dev (compare tool)
**Mechanism:** Increases time-on-site; captures comparison intent dynamically
**Evidence:** peptibase.dev /compare tool (KNOWN)
**Implementation Steps:**
1. Build comparison tool (select 2-3 peptides)
2. Generate comparison table dynamically
3. Save/share comparison URLs

**Make-It-Better:**
- More comparison dimensions
- Evidence-weighted scoring
- Exportable comparisons (PDF, image)

**Defensibility:** Better UX and features
**Risks:** Development effort
**Metrics:** Tool usage, time-on-site, return visits
**Time-to-Impact:** 2-4 weeks
**Effort:** 4 | **Impact:** 4

---

## Strategy Card 14: Mobile-First UX

**Strategy Name:** Mobile Experience Excellence
**Competitors Using:** Both (responsive)
**Mechanism:** Better mobile experience = lower bounce, better rankings (mobile-first indexing)
**Evidence:** Both sites are responsive (KNOWN)
**Implementation Steps:**
1. Audit mobile experience
2. Optimize for thumb-zone navigation
3. Reduce page weight for mobile

**Make-It-Better:**
- Truly native-feeling mobile experience
- Bottom navigation on mobile
- Offline reading (PWA)

**Defensibility:** UX quality
**Risks:** Development complexity
**Metrics:** Mobile bounce rate, mobile Core Web Vitals
**Time-to-Impact:** 2-4 weeks
**Effort:** 3 | **Impact:** 3

---

## Strategy Card 15: Author/Editorial Team Page

**Strategy Name:** E-E-A-T Authority Signal
**Competitors Using:** Neither (visible)
**Mechanism:** Google's E-E-A-T guidelines favor content with clear authorship/expertise
**Evidence:** Neither competitor shows author bylines or team credentials
**Implementation Steps:**
1. Create /team or /about page with editorial credentials
2. Add author bylines to content pages
3. Link to relevant credentials (LinkedIn, publications)

**Make-It-Better:**
- Medical/scientific advisors (even informal)
- Editorial review process disclosure
- Contributor guidelines for community submissions

**Defensibility:** Real expertise is hard to fake
**Risks:** Need to have or recruit credentialed contributors
**Metrics:** Manual review of E-E-A-T perception
**Time-to-Impact:** 1-2 weeks
**Effort:** 2 | **Impact:** 4

---

# PHASE 4: GAP ANALYSIS + SERP FEATURE TARGETING

## Opportunity Backlog (Ranked by Opportunity Score)

### Scoring Formula
**OPPORTUNITY SCORE = (Traffic Potential + Revenue Potential + Speed to Rank + Defensibility) – Complexity**

Each factor: 1-5 scale

---

| Rank | Opportunity | Traffic | Revenue | Speed | Defensibility | Complexity | SCORE | Build |
|------|-------------|---------|---------|-------|---------------|------------|-------|-------|
| 1 | Scale to 50+ peptide dossiers | 5 | 3 | 4 | 4 | 3 | **13** | Content |
| 2 | Add /how-to-use + /alternatives subpages | 5 | 2 | 5 | 3 | 2 | **13** | Template |
| 3 | Create 50 comparison pages | 4 | 3 | 4 | 4 | 3 | **12** | Template |
| 4 | Build glossary (100 terms) | 4 | 1 | 5 | 5 | 2 | **13** | Content |
| 5 | 10 "Best for" category pages | 4 | 3 | 3 | 4 | 3 | **11** | Content |
| 6 | Peptide-specific calculator URLs | 3 | 2 | 4 | 4 | 3 | **10** | Tool |
| 7 | FAQ schema on all pages | 3 | 1 | 5 | 3 | 1 | **11** | Technical |
| 8 | Newsletter signup | 2 | 4 | 5 | 4 | 2 | **13** | Feature |
| 9 | Evidence grade system | 2 | 2 | 3 | 5 | 3 | **9** | Trust |
| 10 | Clinical trials tracker | 3 | 1 | 3 | 4 | 4 | **7** | Feature |

---

## SERP Feature Targets

| Target Query Pattern | SERP Feature | Module to Build | Priority |
|---------------------|--------------|-----------------|----------|
| "what is [peptide]" | Featured Snippet | Definition box at top of dossier | HIGH |
| "[peptide] side effects" | Featured Snippet / PAA | Safety section with bullet list | HIGH |
| "[peptide A] vs [peptide B]" | Featured Snippet | Quick comparison table | HIGH |
| "[peptide] benefits" | PAA | Benefits list in dossier | MEDIUM |
| "how does [peptide] work" | Featured Snippet | Mechanism section | MEDIUM |
| "best peptide for [X]" | PAA | Best-for page with rankings | HIGH |
| "[peptide] dosage" | PAA | (GUARDRAIL - redirect to research) | EXCLUDE |

---

## Top 10 Pages to Build (Detailed)

### 1. 35 More Peptide Dossiers
**Target Keywords:** [peptide name], "what is [peptide]"
**SERP Features:** Featured snippets, PAA
**Why It Wins:** Deeper evidence focus than competitors
**MVP:** 1,500 words per dossier, evidence summary + mechanism + refs
**Deluxe:** Full 10-module structure
**Internal Linking:** Category hubs, related peptides, comparisons
**Distribution:** Index immediately, share on newsletter
**Metrics:** Organic impressions, indexed pages

### 2. 50 Comparison Pages
**Target Keywords:** "[peptide A] vs [peptide B]"
**SERP Features:** Featured snippet (comparison table)
**Why It Wins:** More comparisons than peptibase (54)
**MVP:** 800 words per page, comparison table + verdict
**Internal Linking:** Both peptide dossiers, category hub
**Metrics:** Rankings for comparison keywords

### 3. 100 Glossary Terms
**Target Keywords:** "what is [term]", "[term] meaning"
**SERP Features:** Featured snippet (definition)
**Why It Wins:** Neither competitor has this
**MVP:** 200-400 words per term
**Internal Linking:** Related peptides, related terms
**Metrics:** Indexed glossary pages

### 4. 10 "Best For" Pages
**Target Keywords:** "best peptide for [weight loss/healing/etc.]"
**SERP Features:** PAA
**Why It Wins:** More use cases than peptibase (6)
**MVP:** 1,000 words with rankings table
**Metrics:** Rankings for "best [X] peptide"

### 5. Evidence Methodology Page
**Target Keywords:** N/A (trust page)
**Why It Wins:** E-E-A-T signal neither competitor has
**MVP:** 800 words explaining grading system
**Metrics:** Reduced bounce rate, increased pages/session

---

# PHASE 5: TRUST & CONTENT QA SYSTEM

## Editorial Policy Structure

### 1. Research Methodology Page (/methodology)
**Contents:**
- Evidence grading framework (5 levels)
- Source quality rubric
- Update frequency commitment
- What we cover vs. don't cover (guardrails)
- How to report errors

### 2. Evidence Grading Framework

| Grade | Label | Criteria |
|-------|-------|----------|
| A | Strong Evidence | Multiple RCTs in humans, consistent findings |
| B | Moderate Evidence | 1+ RCT or multiple controlled trials |
| C | Emerging Evidence | Phase I/II trials, strong preclinical |
| D | Limited Evidence | Preclinical only, case studies |
| F | Insufficient | No published research or contradictory |

### 3. Citation Rules
- All claims must link to source
- PubMed preferred; DOI links for journals
- No citing vendor websites for efficacy claims
- Recency indicator: studies <2 years, 2-5 years, >5 years
- Mark retracted/updated studies

### 4. "Last Updated" Policy
- All pages show visible "Last reviewed: [date]"
- Changelog for significant updates
- Auto-flag pages not updated in 6 months

### 5. Author/Reviewer Display
- Author byline on all content
- Reviewer badge for reviewed content
- Link to author bios

### 6. Guardrails (What We Don't Do)
- No specific dosing protocols or medical advice
- No sourcing recommendations or vendor links
- No claims of efficacy for unproven uses
- No content that encourages self-treatment
- Clear disclaimer on every page

## Trust Modules (Add to All Templates)

1. **Evidence Badge** - Grade displayed prominently in header
2. **Last Updated** - Visible date with link to changelog
3. **Citation Count** - "Based on X studies" indicator
4. **Author Byline** - Link to author profile
5. **Methodology Link** - Footer link to /methodology
6. **Disclaimer** - Standard disclaimer box

---

# PHASE 6: LINK & MENTIONS ENGINE

## A. 10 Linkable Assets

| Asset | Type | Link-Earning Mechanism |
|-------|------|------------------------|
| 1. Peptide Evidence Tracker | Data visualization | Researchers cite data |
| 2. Clinical Trials Dashboard | Embedded widget | Blogs embed for updates |
| 3. "State of Peptide Research 2025" Report | Annual report | Media coverage |
| 4. Peptide Comparison Tool | Interactive tool | Cited in "how to choose" articles |
| 5. Glossary of Peptide Terms | Reference | Educational sites link |
| 6. Evidence Grading Methodology | Framework | Cited as standard |
| 7. Peptide Safety Database | Dataset | Researchers reference |
| 8. Category Deep Dives (e.g., "Complete Guide to GLP-1s") | Comprehensive guides | Resource page links |
| 9. Infographics (peptide mechanisms) | Visual content | Pinterest, blogs embed |
| 10. Open Source Data Repository | GitHub | Developer community |

## B. Outreach Target Categories

| Category | Examples | Angle |
|----------|----------|-------|
| Health Newsletters | Examine.com, Huberman newsletter | Resource mention |
| Longevity Researchers | Academic blogs, longevity Twitter | Data source |
| Biohacking Communities | r/Biohackers, Biohacker Summit | Comprehensive resource |
| Medical Writers | Freelance health writers | Citation source |
| Podcast Show Notes | Huberman, Attia | Background resource |
| Resource Pages | "Best peptide resources" lists | Inclusion request |

## C. PR Calendar (Quarterly)

| Quarter | Content | Hook |
|---------|---------|------|
| Q1 | "State of Peptide Research 2025" | Annual data roundup |
| Q2 | "FDA Peptide Watch: What's Changing" | Regulatory news |
| Q3 | "Peptide Safety Report" | Safety data compilation |
| Q4 | "Year in Review: Peptide Clinical Trials" | Research milestone roundup |

## D. Outreach Script Angles

**Angle 1: Resource Enhancement**
> "I noticed your article on [topic] mentions peptides. We've published a comprehensive evidence database at pepcodex.com that your readers might find useful as a reference."

**Angle 2: Data Citation**
> "We track clinical trial progress for 50+ peptides with evidence grades. If you're writing about peptide research, we'd be happy to provide updated data for your piece."

**Angle 3: Collaboration**
> "We're compiling our annual 'State of Peptide Research' report. Would you be interested in contributing a perspective or being cited as an expert source?"

## E. Link Metrics

| Metric | Baseline | Target (6mo) |
|--------|----------|--------------|
| Referring Domains | UNKNOWN | 50 |
| Backlinks | UNKNOWN | 200 |
| Brand Mentions | UNKNOWN | 100/month |
| Newsletter Mentions | 0 | 10 |

---

# PHASE 7: DISTRIBUTION LOOPS + RETENTION

## Distribution Loop 1: Content → Shares → Contributors → More Content

```
New peptide dossier published
    ↓
Shared on X/Reddit/newsletters
    ↓
Researchers discover and suggest corrections/additions
    ↓
Contributors add to data
    ↓
More comprehensive dossiers
    ↓
More shares (loop continues)
```

**MVP:** Accept corrections via email or GitHub issues
**Metrics:** Corrections submitted, contributor count

## Distribution Loop 2: Digest → Email Growth → Return Traffic → Rankings

```
Weekly "What's New" digest
    ↓
Subscribers return to site
    ↓
Higher engagement metrics (time, pages)
    ↓
Google sees quality signals
    ↓
Better rankings
    ↓
More subscribers
```

**MVP:** Weekly email with new/updated content
**Metrics:** Signup rate, open rate, return visit rate

## Distribution Loop 3: Embeddable Widget → Backlinks → Rankings → More Embeds

```
Create embeddable comparison widget/badge
    ↓
Blogs/forums embed
    ↓
Backlinks to pepcodex
    ↓
Better DA/rankings
    ↓
More discovery
    ↓
More embeds
```

**MVP:** Simple "Compare these peptides on Pepcodex" badge
**Metrics:** Embed count, referring domains

## Retention Mechanics

| Feature | Description | MVP | Next Version | Metrics |
|---------|-------------|-----|--------------|---------|
| Saved Peptides | Bookmark peptides to profile | LocalStorage list | Account system | Save rate |
| Research Alerts | "Notify when [peptide] updates" | Email signup per peptide | Push notifications | Alert signups |
| "What's New" Page | Weekly updated content feed | Static page | Dynamic feed | Return visits |
| Progress Tracker | "Research read" percentage | Cookie-based | Account-based | Completion rate |
| Weekly Digest | Email with new/updated content | Manual send | Automated | Open/click rates |

---

# PHASE 8: EXPERIMENT CADENCE + KILL LIST

## Weekly Experiment Cadence

### SEO Experiments (1/week)
| Week | Experiment | Hypothesis | Metric | Expected Lift |
|------|------------|------------|--------|---------------|
| 1 | Add FAQ schema to 10 peptide pages | FAQ schema increases PAA appearances | PAA wins | +5 appearances |
| 2 | Optimize 10 title tags with CTR formula | Better titles increase CTR | CTR | +15% CTR |
| 3 | Add "Last updated" to all pages | Freshness signals improve rankings | Avg position | +0.5 positions |
| 4 | Create 5 "best for" pages | Category pages capture comparison intent | Impressions | +1000/week |

### Conversion Experiments (1/week)
| Week | Experiment | Hypothesis | Metric | Expected Lift |
|------|------------|------------|--------|---------------|
| 1 | Newsletter popup on exit intent | Captures abandoning visitors | Signups | +20% |
| 2 | Inline newsletter box in dossiers | In-content CTAs convert better | Signups | +10% |
| 3 | "Save peptide" feature | Increases engagement | Time on site | +15% |
| 4 | Comparison tool prominence | Tool usage increases engagement | Tool usage | +50% |

### Distribution Experiments (1/week)
| Week | Experiment | Hypothesis | Metric | Expected Lift |
|------|------------|------------|--------|---------------|
| 1 | Share new dossier on r/Peptides | Reddit drives targeted traffic | Referral traffic | +500 visits |
| 2 | Pitch to 3 newsletters | Newsletter mentions drive links | Mentions | +1-2 mentions |
| 3 | Tweet thread on peptide comparison | Twitter drives awareness | Followers | +100 |
| 4 | Post on biohacking forums | Forum traffic is qualified | Referral traffic | +200 visits |

---

## KILL LIST (Do NOT Build in Next 30 Days)

| Tempting Idea | Why It's Tempting | Why NOT Now |
|---------------|-------------------|-------------|
| 1. Mobile app | peptracker has one | Different market; database first |
| 2. User accounts/login | Enables personalization | Premature complexity; localStorage first |
| 3. Vendor directory | Revenue potential | Guardrail violation; trust risk |
| 4. Dosing calculator with protocols | Users want it | Guardrail violation; research calculator only |
| 5. AI chatbot for peptide questions | Cool feature | Liability risk; premature |
| 6. Forum/community features | Engagement | Moderation burden; premature |
| 7. Affiliate program | Revenue | No traffic yet; premature |
| 8. Multi-language support | Larger market | Focus on English first |
| 9. Premium content tier | Revenue | No audience yet |
| 10. Native mobile widgets | Engagement | No users yet |

---

# FINAL DELIVERABLE: SHIPPING QUEUE

## Next 10 Builds (Prioritized)

| Rank | Build | Scope (MVP) | Acceptance Criteria | Est Hours | Dependencies | Metric It Moves | Why Ranked Here |
|------|-------|-------------|---------------------|-----------|--------------|-----------------|-----------------|
| 1 | **Add 35 more peptide dossiers** | 1,500 words each with evidence summary, mechanism, refs | 35 pages live, indexed, no 404s | 40h | Peptide data | Indexed pages (+35) | Core content = foundation |
| 2 | **Create /how-to-use + /alternatives subpages** | Template routes, 400 words each | 30 subpages per type live | 16h | Peptide pages | Indexed pages (+90) | 3x URL surface, low effort |
| 3 | **Build 50 comparison pages** | 800 words each, comparison table | 50 pages live, indexed | 24h | Peptide pairs data | Impressions (comparison keywords) | Captures comparison intent |
| 4 | **Create glossary hub + 50 terms** | 200-400 words per term | 50 terms live, auto-linked in content | 12h | Term list | Indexed pages (+50) | Low effort, high breadth |
| 5 | **Add FAQ schema to all peptide pages** | 5-8 FAQs per page with schema | FAQPage schema validated | 8h | FAQ content | Featured snippet wins | Quick technical SEO win |
| 6 | **Newsletter signup system** | Form on all pages, email capture | Signups tracked in analytics | 6h | Email service | Email signups | Retention/owned audience |
| 7 | **"Last updated" visible on all pages** | Date badge with changelog link | All pages show date | 4h | None | E-E-A-T perception | Trust signal, low effort |
| 8 | **Author/Editorial team page** | /team page with bios | Page live, linked from footer | 4h | Author info | E-E-A-T perception | Trust signal |
| 9 | **5 "Best for" category pages** | 1,000 words each with rankings | 5 pages live | 10h | Category data | Impressions (best X keywords) | High-intent capture |
| 10 | **Peptide-specific calculator URLs** | /calculator/[peptide] routes | 50 calculator pages live | 12h | Calculator component | Indexed pages (+50) | Tool-based discovery |

---

## Total Estimated Hours: 136h

**Week 1 Focus:** Builds 1-4 (content foundation)
**Week 2 Focus:** Builds 5-8 (technical + trust)
**Week 3 Focus:** Builds 9-10 (category + tools)

---

# QUESTIONS FOR YOU (Before Finalizing)

1. **Traffic baseline:** Do you have any GSC/GA data from a staging or preview deploy? This would help prioritize which keywords are already being discovered.

2. **Content velocity:** Can you produce 35 peptide dossiers in 1-2 weeks, or should we reduce MVP scope?

3. **Email service:** Which email provider are you considering for newsletter? (Affects signup implementation)

4. **Author credentials:** Do you have access to anyone with science/medical credentials for E-E-A-T purposes?

5. **Monetization priority:** Is revenue (ads, sponsorships, premium) a near-term goal or is traffic-first the strategy?

6. **Reddit/X presence:** Do you have existing accounts in peptide communities for distribution?

7. **Budget for tools:** Would you pay for Ahrefs/Semrush to validate keyword volumes, or working blind?

8. **Calculator scope:** Your existing SEO plan mentions calculators. Are these already built, or need development?

---

*Report generated by Claude for pepcodex competitive analysis.*
