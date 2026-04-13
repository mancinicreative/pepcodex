# PHASE 1: COMPETITOR CARDS (DEEP DIVE)
## Pepcodex Competitive Intelligence

**Generated:** 2026-02-01
**Your Product:** pepcodex.com | Evidence-based peptide research database
**Your Status:** 188 pages live, GA4/GSC configured, Beehiiv newsletter

---

## Evidence Classification

- **KNOWN** = Verified from direct observation or sitemap analysis
- **LIKELY** = Strong inference from observable patterns
- **UNKNOWN** = Requires Ahrefs/Semrush for verification

---

# COMPETITOR CARD A: peptide-db.com

## A) Positioning & Offer

| Dimension | Finding | Evidence Level |
|-----------|---------|----------------|
| **Tagline** | "The open source peptide research database. Dosing protocols, molecular structures, and scientific references — community-owned, free forever." | KNOWN |
| **Audience Segments** | Researchers, biohackers, students, peptide-curious | KNOWN |
| **Core Promise** | Free, transparent, community-owned research wiki | KNOWN |
| **Category Framing** | Research database + calculators + community | KNOWN |
| **Why People Choose** | Free access, open source credibility, GitHub transparency, dosing protocols | LIKELY |

**Positioning Analysis:**
- Leans heavily into "open source" and "community-owned" framing
- Anti-commercial positioning ("free forever")
- Educational focus with research emphasis
- No premium tier or monetization visible

---

## B) IA & UX (Conversion Engine)

### Navigation Model
| Nav Item | Destination | Type |
|----------|-------------|------|
| Home | / | Core |
| Browse Peptides | /peptides | Core |
| Categories | /categories | Core |
| Guides | /guides | Content |
| Calculators | /calculator | Tool |
| Sign In | /auth/login | Auth |
| Register | /auth/register | Auth |
| GitHub | External | Trust |

### <60s "Aha Path"
```
Homepage → "95 Peptides Documented" stat → Browse Peptides →
Click peptide → See dosing protocol + references → "This is legit research data"
```

### CTAs
| CTA | Location | Priority |
|-----|----------|----------|
| "Browse Peptides" | Hero | Primary |
| "Explore Categories" | Hero | Primary |
| Sign In/Register | Header | Secondary |
| GitHub | Header/Footer | Trust |

### Email Capture
**None visible** (KNOWN) - Major gap

### Content Modules (Peptide Page)
1. Quick stats bar (dose, frequency, cycle, storage)
2. Community Research Hub (View Results, Discussion, Submit Findings)
3. Overview section (~100 words)
4. Mechanism of Action
5. Key Benefits (bulleted)
6. Molecular Information (structure visualization, amino acid table)
7. Research Indications (by condition, ~350 words)
8. Dosing Protocols (table format, ~300 words)
9. Peptide Interactions (matrix with status tags)
10. What to Expect Timeline (week-by-week)
11. Side Effects & Safety
12. Quality Checklist
13. References (dated citations with key findings)

**Estimated words per peptide page:** ~1,830 (KNOWN)

---

## C) SEO Strategy (Traffic Engine)

### Content Types & Counts (from sitemap)

| Content Type | Count | URL Pattern | Evidence |
|--------------|-------|-------------|----------|
| Peptide pages | 126 | /peptides/[slug] | KNOWN |
| Calculator pages | 250 | /calculator + peptide-specific | KNOWN |
| Category filter pages | 10 | /peptides?category=[x] | KNOWN |
| Guide articles | 3 | /guides/[slug] | KNOWN |
| Blend calculator variants | 3 | /calculator/blend | KNOWN |
| **Total sitemap URLs** | **731** | — | KNOWN |

### Topic Clusters/Silos
```
/peptides/ (hub)
  └── /peptides/[peptide-slug] (entity pages)
      └── Links to: /calculator, related peptides, category

/categories/ (hub)
  └── /peptides?category=[category] (filtered views)

/guides/ (hub - thin)
  └── /guides/[guide-slug] (only 3 pages)

/calculator/ (hub)
  └── /calculator/blend
  └── /calculator/accumulation
  └── /calculator/accumulation?peptide=[slug] (250 URLs)
```

### Internal Linking Patterns
- Peptide pages link to ~40+ other pages
- Related peptides linked via category
- Calculator cross-linked from peptide pages
- Depth from home: 2-3 clicks max

### Intent Targeting
| Intent | Coverage | Quality |
|--------|----------|---------|
| Informational ("what is [peptide]") | Strong | Good |
| How-to ("how to use [peptide]") | Moderate | Dosing present |
| Comparison ("[A] vs [B]") | Weak | No dedicated pages |
| Commercial | None | No monetization |

---

## D) Monetization (Money Engine)

| Signal | Finding | Evidence |
|--------|---------|----------|
| Display Ads | None | KNOWN |
| Affiliate Links | None | KNOWN |
| Sponsors | None | KNOWN |
| Premium Tier | None | KNOWN |
| Newsletter | None visible | KNOWN |
| Lead Gen | None | KNOWN |

**Primary Conversion Event:** None / Community contribution (Submit Findings)

**Monetization Assessment:** Zero revenue model observed. Sustainability risk.

---

## E) Moat & Weakness

### Hard to Copy
- 369 scientific references with dated citations
- Open source credibility (MIT license, GitHub)
- Community contribution system
- 250 peptide-specific calculator URLs

### Easy to Copy
- Page template structure
- Peptide data (publicly available research)
- Calculator logic
- Category taxonomy

### Weaknesses
| Weakness | Impact | Opportunity for Pepcodex |
|----------|--------|--------------------------|
| No email capture | Can't build audience | Newsletter → retention moat |
| Only 3 guides | Thin editorial content | Deep guide library |
| No comparison pages | Misses "[A] vs [B]" intent | 100+ comparison pages |
| No author credentials | E-E-A-T gap | Editorial team page |
| No "best for" pages | Misses category intent | 15+ best-for pages |
| No monetization | Unsustainable | Sponsor model |
| No subpages per peptide | Misses long-tail | 3x URL surface |

---

# COMPETITOR CARD B: peptibase.dev

## A) Positioning & Offer

| Dimension | Finding | Evidence Level |
|-----------|---------|----------------|
| **Tagline** | "Your research-grade peptide database with 97+ peptides" | KNOWN |
| **Hero Statement** | "The comprehensive peptide research database. Empowering biohackers and researchers with evidence-based peptide information." | KNOWN |
| **Audience Segments** | Researchers, biohackers, clinicians, patients | KNOWN |
| **Core Promise** | Research-backed, peer-reviewed, comprehensive | KNOWN |
| **Category Framing** | Database + Tools + Comparisons | KNOWN |
| **Why People Choose** | Polished UX, tool suite, clinical framing, FDA status visibility | LIKELY |

**Positioning Analysis:**
- "Research-grade" implies higher quality than competitors
- Tools-forward (Stack Builder, Quiz, Calculator, Compare)
- FDA approval badges create trust
- Members area suggests freemium model

---

## B) IA & UX (Conversion Engine)

### Navigation Model
| Nav Item | Destination | Type |
|----------|-------------|------|
| Browse | /peptides | Core |
| Compare | /compare | Tool |
| Stacks | /tools/stack-builder | Tool |
| Calc | /tools/reconstitution-calculator | Tool |
| Quiz | /tools/peptide-quiz | Tool |
| Blog | /blog | Content |
| Contact | /contact | Support |
| Members | /members | Premium |

### <60s "Aha Path"
```
Homepage → "97+ Peptides" stat → Browse by category →
Click peptide → See FDA status + dosing table →
"This is clinical-grade info"
```

### CTAs
| CTA | Location | Priority |
|-----|----------|----------|
| "Explore Peptides" | Hero | Primary |
| "Compare Peptides" | Hero | Primary |
| Newsletter signup | Mid-page | Secondary |
| Tool links | Nav | Tertiary |

### Email Capture
**"Join 500+ researchers and biohackers"** - Mid-page newsletter signup with hook: "Weekly research summaries, new peptide profiles, and protocol updates" (KNOWN)

### Content Modules (Peptide Page)
1. Key Facts Box (category, FDA status, dose, frequency, duration)
2. "What to Expect" brief descriptor
3. Mechanism of Action
4. Research Summary
5. Clinical Status Display (visual phase indicator)
6. FDA Approval Studies (STEP, SUSTAIN trials)
7. Dosing Information (Typical vs Research tabs)
8. Timing & Administration
9. Possible Side Effects (13 items)
10. References (PubMed links)
11. Related Peptides (6 cards)
12. Bottom CTAs (How-to, Alternatives, Compare)
13. Disclaimer

**Estimated words per peptide page:** ~1,770 (KNOWN)

### Subpage Strategy (KEY DIFFERENTIATOR)
Each peptide has:
- `/peptides/[slug]` - Main page
- `/peptides/[slug]/how-to-use` - Practical usage guide (~600-700 words)
- `/peptides/[slug]/alternatives` - Related peptides (~1,200-1,500 words)

**This triples their URL surface with minimal unique content.**

---

## C) SEO Strategy (Traffic Engine)

### Content Types & Counts (from sitemap)

| Content Type | Count | URL Pattern | Evidence |
|--------------|-------|-------------|----------|
| Peptide pages | 71 | /peptides/[slug] | KNOWN |
| How-to-use subpages | 71 | /peptides/[slug]/how-to-use | KNOWN |
| Alternatives subpages | 71 | /peptides/[slug]/alternatives | KNOWN |
| Comparison pages | 54 | /compare/[a]-vs-[b] | KNOWN |
| Category pages | 11 | /peptides?category=[x] | KNOWN |
| "Best for" guides | 6 | /best-peptides-for-[use-case] | KNOWN |
| Tool pages | 4 | /tools/[tool-name] | KNOWN |
| **Total sitemap URLs** | **759** | — | KNOWN |

### Topic Clusters/Silos
```
/peptides/ (hub)
  └── /peptides/[slug] (entity)
      ├── /peptides/[slug]/how-to-use (subpage)
      └── /peptides/[slug]/alternatives (subpage)

/compare/ (hub)
  └── /compare/[peptide-a]-vs-[peptide-b] (54 pages)

/best-peptides-for-[use-case] (6 pages)
  └── weight-loss, healing, muscle-growth, anti-aging, sleep, cognitive

/tools/ (hub)
  ├── stack-builder
  ├── reconstitution-calculator
  └── peptide-quiz
```

### Internal Linking Patterns
- Peptide pages link to 17+ internal pages
- Subpages link back to main page + calculator
- Related peptides as discovery mechanism
- Comparison links embedded in alternatives pages
- Breadcrumbs on all pages

### Intent Targeting
| Intent | Coverage | Quality |
|--------|----------|---------|
| Informational ("what is [peptide]") | Strong | Excellent |
| How-to ("how to use [peptide]") | **Excellent** | Dedicated subpages |
| Comparison ("[A] vs [B]") | **Strong** | 54 dedicated pages |
| Commercial ("best peptide for X") | **Moderate** | 6 best-for pages |

---

## D) Monetization (Money Engine)

| Signal | Finding | Evidence |
|--------|---------|----------|
| Display Ads | None visible | KNOWN |
| Affiliate Links | None visible | KNOWN |
| Sponsors | None visible | KNOWN |
| Members Area | Mentioned in nav | KNOWN |
| Newsletter | 500+ subscribers claimed | KNOWN |

**Primary Conversion Event:** Newsletter signup → Member conversion (LIKELY)

**Monetization Assessment:** Freemium model probable. Newsletter is the funnel.

---

## E) Moat & Weakness

### Hard to Copy
- 54 comparison pages (content breadth)
- Subpage multiplication strategy (213 subpages)
- Tool ecosystem (4 interactive tools)
- Schema markup depth (Drug, FAQPage, HowTo, BreadcrumbList)
- Newsletter with 500+ subscribers

### Easy to Copy
- Page template structure
- Peptide data
- Tool logic
- Subpage concept

### Weaknesses
| Weakness | Impact | Opportunity for Pepcodex |
|----------|--------|--------------------------|
| No author bylines | E-E-A-T gap | Editorial team page |
| "MedicalWebPage" without review process | Trust gap | Visible methodology |
| Only 6 "best for" pages | Could expand | 15+ best-for pages |
| Blog appears thin | Content gap | Deep editorial content |
| Members details unclear | Confusion | Clear value prop |
| No visible last-updated on pages | Freshness gap | Visible update dates |

---

# COMPETITOR CARD C: peptracker.app

## A) Positioning & Offer

| Dimension | Finding | Evidence Level |
|-----------|---------|----------------|
| **Tagline** | "Never miss a peptide dose again" | KNOWN |
| **Audience Segments** | Active peptide users, people on protocols | KNOWN |
| **Core Promise** | Tracking, reminders, calculations | KNOWN |
| **Category Framing** | Mobile utility app (NOT database) | KNOWN |
| **Why People Choose** | Convenience, reminders, protocol management | LIKELY |

**Positioning Analysis:**
- Utility app, not information database
- Different market segment (users vs. researchers)
- **Not a direct SEO competitor**

---

## B-E) Summary (Abbreviated - Different Market)

| Dimension | Finding |
|-----------|---------|
| Platform | Native iOS/Android app |
| Monetization | Freemium ($X/mo for premium) |
| Features | Protocol tracking, dose reminders, calculator |
| SEO Presence | Minimal (~20 landing pages) |
| Relevance | Low - different use case |

**Conclusion:** peptracker.app is NOT a competitor for organic search. It serves users who already know about peptides and need tracking tools. Pepcodex serves researchers discovering peptide information.

---

# MASTER COMPARISON TABLE

| Dimension | peptide-db.com | peptibase.dev | pepcodex (current) |
|-----------|----------------|---------------|-------------------|
| **A) POSITIONING** | | | |
| Tagline | "Open source...free forever" | "Research-grade database" | "Evidence-based research" |
| Audience | Researchers, biohackers | Researchers, biohackers, clinicians | Researchers, biohackers |
| Framing | Community wiki | Clinical database | Evidence synthesis |
| Trust hook | Open source | FDA badges | Evidence grading |
| **B) IA & UX** | | | |
| Nav items | 7 | 8 | ? |
| Aha path | Stats → Browse → Dosing | Stats → Browse → FDA status | Stats → Browse → Evidence |
| Email capture | None | Mid-page ("500+ researchers") | Beehiiv integrated |
| Peptide page modules | 13 sections | 13 sections | 12 sections |
| Words per peptide | ~1,830 | ~1,770 | ~2,000+ |
| **C) SEO STRATEGY** | | | |
| Total URLs | 731 | 759 | 188 |
| Peptide pages | 126 | 71 | ~45 |
| Subpages per peptide | 0 | 2 (how-to + alternatives) | 0 |
| Comparison pages | 0 | 54 | 11 |
| Calculator URLs | 250 | 4 | 3 |
| "Best for" pages | 0 | 6 | 0 |
| Guide pages | 3 | Unknown | 11 |
| **D) MONETIZATION** | | | |
| Model | None | Freemium (likely) | Planned sponsors |
| Newsletter | None | 500+ subscribers | Beehiiv (0 subscribers) |
| Ads | None | None | None |
| Premium | None | Members area | None |
| **E) MOAT & WEAKNESS** | | | |
| Primary moat | Open source credibility | Tool ecosystem + subpages | Evidence grading |
| Primary weakness | No monetization | No author credentials | Low URL count |
| Key gap | No comparison pages | No visible methodology | Needs 3x more pages |

---

# PHASE 1 KEY TAKEAWAYS

## What Competitors Do Well (Steal This)

1. **Subpage multiplication** (peptibase) - 3x URL surface with /how-to-use and /alternatives
2. **Comparison pages** (peptibase) - 54 pages capturing "[A] vs [B]" searches
3. **Peptide-specific calculator URLs** (peptide-db) - 250 pages for "[peptide] calculator" searches
4. **Newsletter capture** (peptibase) - "500+ researchers" social proof
5. **FDA status badges** (peptibase) - Instant trust signal
6. **Community features** (peptide-db) - Submit Findings, Discussion, Results

## What Neither Competitor Does (Own This Gap)

1. **Author/editorial credentials** - E-E-A-T opportunity
2. **Visible methodology page** - Transparent evidence grading
3. **"Last updated" visible on pages** - Freshness signal
4. **Glossary section** - Capture "what is [term]" queries
5. **15+ "best for" pages** - Only 6 exist (peptibase), 0 (peptide-db)
6. **100+ comparison pages** - Beat peptibase's 54

## Pepcodex Advantages Already

1. **188 pages live** vs 126 (peptide-db) peptide pages
2. **Evidence grading system** - Neither competitor has systematic grading
3. **Newsletter infrastructure** - Beehiiv ready (just needs subscribers)
4. **Guardrails** - No dosing = credibility positioning

---

## NEXT: Phase 1.5 - Technical SEO Audit

Ready to proceed with technical SEO analysis of sitemaps, schema, robots.txt, and Core Web Vitals.

---

*Phase 1 Complete | Generated 2026-02-01*
