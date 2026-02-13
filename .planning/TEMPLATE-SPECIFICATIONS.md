# PEPCODEX TEMPLATE SPECIFICATIONS
## Phase 2 Deep Analysis Output

**Generated:** 2026-02-01
**Based on:** Live analysis of peptibase.dev and peptide-db.com

---

# TEMPLATE A: SUBPAGE - RESEARCH SUMMARY

## Competitor Reference
**Source:** peptibase.dev `/peptides/[slug]/how-to-use`
**Pepcodex Adaptation:** `/peptides/[slug]/research-summary`

### Why Adapt (Not Copy)
Peptibase's "how-to-use" focuses on dosing protocols. Pepcodex maintains credibility by NOT providing dosing. We adapt to "research summary" focusing on evidence synthesis.

---

## URL Structure

```
Pattern: /peptides/{slug}/research-summary
Example: /peptides/bpc-157/research-summary
Canonical: Self-referencing
```

## Meta Tags

```html
<title>{Peptide Name} Research Summary - Evidence & Studies | Pepcodex</title>
<meta name="description" content="Research summary for {Peptide Name}: {Evidence Grade} evidence from {X} studies. Key findings, mechanism overview, and study breakdown.">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
```

## Page Structure

### 1. Breadcrumb Navigation
```
Home > Peptides > {Peptide Name} > Research Summary
```

### 2. Hero Section
| Element | Content |
|---------|---------|
| H1 | "{Peptide Name} Research Summary" |
| Subtitle | "Evidence synthesis and key research findings for {Peptide Name}" |
| Evidence Badge | Large badge showing grade (High/Moderate/Low/Very Low) |

### 3. Content Sections

#### Section A: Quick Overview (~50 words)
```markdown
**Purpose:** 2-3 sentence summary of what this peptide is and primary research focus.
**Source Data:** Pull from main dossier overview field.
**Word Count:** 40-60 words
```

#### Section B: Research Highlights (~100 words)
```markdown
**Purpose:** Key findings from studies, framed as research outcomes (not benefits).
**Format:**
- Bulleted list of 4-6 findings
- Each finding cites study type: "(in animal models)" or "(in human trials)"

**Example:**
- Accelerated tendon healing observed in rat models (Sikiric et al., 2006)
- Improved gut barrier function in IBD mouse models (Seiwerth et al., 2019)
- Enhanced angiogenesis via VEGFR2 pathway (in vitro studies)
```

#### Section C: Evidence Grade Breakdown
```markdown
**Purpose:** Transparent evidence assessment.
**Format:** Card/box with:
- Evidence Grade Badge (large)
- Study Breakdown:
  - Human studies: {X}
  - Animal studies: {Y}
  - In-vitro studies: {Z}
- Grade Explanation: "Why this grade?" 1-2 sentences
- Link: "See our methodology"
```

#### Section D: Mechanism Summary (~75 words)
```markdown
**Purpose:** Simplified mechanism explanation from main dossier.
**Format:** Single paragraph, accessible language.
**Word Count:** 60-80 words
```

#### Section E: Research Timeline
```markdown
**Purpose:** When key studies were published.
**Format:** Simple timeline or list:
- 2003: First tendon healing study
- 2006: Muscle recovery research published
- 2019: Spinal cord injury studies
- 2020: Safety evaluation completed
```

#### Section F: Research Questions (FAQ)
```markdown
**Purpose:** FAQPage schema, featured snippet targeting.
**Format:** 4-5 Q&A pairs

**Required Questions:**
1. What is {Peptide Name}?
2. What research has been done on {Peptide Name}?
3. What is the evidence grade for {Peptide Name}?
4. How many studies exist for {Peptide Name}?
5. What are the main research areas for {Peptide Name}?

**Answer Format:** 2-3 sentences, include evidence grade when relevant.
```

### 4. CTAs

| CTA | Destination | Style |
|-----|-------------|-------|
| "View Full Research Profile" | /peptides/{slug} | Primary button |
| "Compare with Similar Peptides" | /peptides/{slug}/related-research | Secondary button |

### 5. Disclaimer Banner
```markdown
Standard research disclaimer (same as main dossier)
```

---

## Schema Markup

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "{Peptide Name} Research Summary",
  "description": "...",
  "lastReviewed": "2026-02-01",
  "mainEntity": {
    "@type": "Drug",
    "name": "{Peptide Name}",
    "description": "..."
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [...]
  }
}
```

**FAQPage Schema:**
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is {Peptide Name}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

---

## Component: ResearchSummaryPage.astro

```typescript
interface Props {
  peptide: {
    name: string;
    slug: string;
    overview: string;
    mechanism: string;
    evidenceGrade: 'high' | 'moderate' | 'low' | 'very-low';
    studyCount: {
      human: number;
      animal: number;
      invitro: number;
    };
    keyFindings: string[];
    researchTimeline: { year: number; event: string }[];
    faqs: { question: string; answer: string }[];
  };
}
```

---

## Internal Linking Requirements

| Link To | Count | Purpose |
|---------|-------|---------|
| Main peptide dossier | 1 | Primary CTA |
| Related research subpage | 1 | Secondary CTA |
| Calculator | 1 | Utility link |
| Methodology page | 1 | Trust signal |
| 3-5 related peptides | 3-5 | Discovery |

---

## Word Count Targets

| Section | Words |
|---------|-------|
| Quick Overview | 50 |
| Research Highlights | 100 |
| Evidence Breakdown | 50 |
| Mechanism Summary | 75 |
| Research Timeline | 50 |
| FAQs | 150 |
| **Total** | **~475** |

---

# TEMPLATE B: SUBPAGE - RELATED RESEARCH

## Competitor Reference
**Source:** peptibase.dev `/peptides/[slug]/alternatives`
**Pepcodex Adaptation:** `/peptides/[slug]/related-research`

---

## URL Structure

```
Pattern: /peptides/{slug}/related-research
Example: /peptides/bpc-157/related-research
```

## Meta Tags

```html
<title>{Peptide Name} Related Research - Similar Peptides | Pepcodex</title>
<meta name="description" content="Peptides with similar research profiles to {Peptide Name}. Compare mechanisms, evidence grades, and research areas.">
```

## Page Structure

### 1. Breadcrumb
```
Home > Peptides > {Peptide Name} > Related Research
```

### 2. Hero Section
| Element | Content |
|---------|---------|
| H1 | "{Peptide Name} Related Research" |
| Subtitle | "Peptides with similar mechanisms or research applications" |

### 3. Content Sections

#### Section A: This Peptide Card
```markdown
**Purpose:** Context for the current peptide.
**Content:**
- Peptide name + category badge
- Evidence grade badge
- 2-sentence description
- "View Full Profile" link
```

#### Section B: Similar Mechanisms (4-6 cards)
```markdown
**Purpose:** Peptides that work through related pathways.
**Selection Logic:** Same mechanism tags OR same category.
**Card Content:**
- Peptide name
- Category badge
- Evidence grade badge
- 1-2 sentence description
- "View Profile" button
- "Compare" button → /compare/{original}-vs-{this}
```

#### Section C: Same Research Area (6-8 cards)
```markdown
**Purpose:** Peptides researched for similar conditions.
**Selection Logic:** Overlapping research indication tags.
**Format:** Smaller cards in grid layout.
```

#### Section D: Evidence Comparison Table
```markdown
**Purpose:** Quick comparison of evidence quality.
**Columns:**
- Peptide Name (linked)
- Category
- Evidence Grade
- Study Count
- Action (Compare button)
```

### 4. CTAs

| CTA | Destination |
|-----|-------------|
| "Back to {Peptide Name}" | /peptides/{slug} |
| "Compare Tool" | /compare |

---

## Component: RelatedResearchPage.astro

```typescript
interface Props {
  peptide: Peptide;
  similarMechanisms: Peptide[];  // 4-6
  sameResearchArea: Peptide[];  // 6-8
}
```

---

## Internal Linking Requirements

| Link Type | Count |
|-----------|-------|
| Original peptide | 1 |
| Similar peptides (profile) | 4-6 |
| Similar peptides (compare) | 4-6 |
| Category page | 1 |
| Compare tool | 1 |

---

# TEMPLATE C: COMPARISON PAGES

## Competitor Reference
**Source:** peptibase.dev `/compare/{peptide-a}-vs-{peptide-b}`
**Live Example Analyzed:** Semaglutide vs Tirzepatide

---

## URL Structure

```
Pattern: /compare/{peptide-a}-vs-{peptide-b}
Example: /compare/bpc-157-vs-tb-500

Canonicalization: ALPHABETICAL ORDER
- ✓ /compare/bpc-157-vs-tb-500
- ✗ /compare/tb-500-vs-bpc-157 (redirect to alphabetical)
```

## Meta Tags

```html
<title>{Peptide A} vs {Peptide B}: Research Comparison | Pepcodex</title>
<meta name="description" content="Compare {Peptide A} and {Peptide B}: evidence grades, mechanisms, research areas, and study counts side-by-side.">
```

## Page Structure (From Live Analysis)

### 1. Breadcrumb
```
Home > Compare > {Peptide A} vs {Peptide B}
```

### 2. Hero Section
| Element | Content |
|---------|---------|
| Badge | "Comparison" |
| H1 | "{Peptide A} vs {Peptide B}" |
| Subtitle | "Side-by-side comparison of research evidence, mechanisms, and applications" |

### 3. Peptide Overview Cards (Side-by-Side)

**Card Content (each peptide):**
```markdown
- Peptide Name (linked to profile)
- Alternate names if applicable
- Evidence Grade badge (PEPCODEX ADDITION)
- Category badge
- 2-3 sentence description
- "View Profile" link
```

### 4. Key Comparison Insights
```markdown
**Format:** 3-5 bullet points highlighting key differences/similarities.
**Example:**
• Both peptides have Moderate evidence grades
• {Peptide A} has more human studies (X vs Y)
• Different mechanisms: {A mechanism} vs {B mechanism}
• Both researched for {shared indication}
```

### 5. Detailed Comparison Table

**CRITICAL: Pepcodex removes dosing rows, adds evidence rows**

| Attribute | {Peptide A} | {Peptide B} |
|-----------|-------------|-------------|
| Category | {category} | {category} |
| **Evidence Grade** | {grade + badge} | {grade + badge} |
| **Human Studies** | {count} | {count} |
| **Animal Studies** | {count} | {count} |
| Clinical Status | {status} | {status} |
| Mechanism of Action | {mechanism text} | {mechanism text} |
| Key Research Areas | {bulleted list} | {bulleted list} |
| Research Summary | {2-3 sentences} | {2-3 sentences} |

**REMOVED from competitor template:**
- ~~Common Dosing~~
- ~~Administration~~
- ~~Typical Duration~~
- ~~Best Time to Take~~
- ~~Side Effects~~

### 6. Research Questions (FAQ)
```markdown
**Required Questions:**
1. What is the difference between {A} and {B}?
2. Which has more research evidence, {A} or {B}?
3. Can {A} and {B} be researched together?

**Answer Format:** 3-4 sentences, cite evidence grades.
```

### 7. Related Comparisons
```markdown
**Purpose:** Link to other relevant comparison pages.
**Selection Logic:** Comparisons involving either peptide.
**Format:** 4-6 linked cards: "{X} vs {Y}"
```

### 8. Full Profile CTAs
```markdown
Two cards linking to each peptide's full profile.
```

### 9. Disclaimer
```markdown
Educational disclaimer banner.
```

---

## Schema Markup

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{Peptide A} vs {Peptide B}: Research Comparison",
  "description": "...",
  "author": {
    "@type": "Organization",
    "name": "Pepcodex"
  },
  "datePublished": "2026-02-01",
  "dateModified": "2026-02-01"
}
```

**FAQPage Schema (required):**
```json
{
  "@type": "FAQPage",
  "mainEntity": [...]
}
```

**BreadcrumbList Schema (required):**
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

---

## Comparison Page Generation Logic

### Priority Pairings (Generate First)

**Tier 1: High-Traffic Pairs (20 pages)**
1. semaglutide-vs-tirzepatide
2. bpc-157-vs-tb-500
3. ozempic-vs-mounjaro (redirect to semaglutide-vs-tirzepatide)
4. cjc-1295-vs-ipamorelin
5. sermorelin-vs-ipamorelin
6. ghrp-2-vs-ghrp-6
7. mk-677-vs-ipamorelin
8. bpc-157-vs-ghk-cu
9. tesamorelin-vs-sermorelin
10. tirzepatide-vs-retatrutide
11. semaglutide-vs-liraglutide
12. epithalon-vs-thymalin
13. selank-vs-semax
14. melanotan-i-vs-melanotan-ii
15. igf-1-vs-igf-1-lr3
16. tb-500-vs-thymosin-beta-4
17. aod-9604-vs-hgh-fragment
18. pt-141-vs-melanotan-ii
19. ll-37-vs-kpv
20. mots-c-vs-ss-31

**Tier 2: Category-Based Pairs (80 pages)**
Generate all pairings within same category, limited to top 3 peptides per category matched against each other + top peptides from related categories.

### Generation Algorithm

```typescript
function generateComparisonPairs(peptides: Peptide[]): ComparisonPair[] {
  const pairs: ComparisonPair[] = [];

  // Group by category
  const byCategory = groupBy(peptides, 'category');

  for (const [category, categoryPeptides] of Object.entries(byCategory)) {
    // Sort by evidence grade, then study count
    const sorted = sortBy(categoryPeptides, ['evidenceGrade', 'studyCount']);
    const top5 = sorted.slice(0, 5);

    // Generate pairs within category
    for (let i = 0; i < top5.length; i++) {
      for (let j = i + 1; j < top5.length; j++) {
        pairs.push(createPair(top5[i], top5[j]));
      }
    }
  }

  return pairs;
}

function createPair(a: Peptide, b: Peptide): ComparisonPair {
  // Alphabetical ordering
  const [first, second] = [a, b].sort((x, y) => x.slug.localeCompare(y.slug));
  return {
    slug: `${first.slug}-vs-${second.slug}`,
    peptideA: first,
    peptideB: second
  };
}
```

---

## Word Count Targets

| Section | Words |
|---------|-------|
| Overview cards | 150 |
| Key insights | 75 |
| Comparison table | 300 |
| FAQs | 150 |
| Related comparisons | 50 |
| Profile CTAs | 50 |
| Disclaimer | 50 |
| **Total** | **~825** |

---

# TEMPLATE D: CALCULATOR PAGES

## Competitor Reference
**Source:** peptide-db.com `/calculator` and `/calculator/accumulation?peptide={slug}`

---

## URL Structure

### Hub Pages
```
/calculator - Reconstitution calculator hub
/calculator/blend - Blend calculator
/calculator/accumulation - Accumulation calculator
```

### Peptide-Specific URLs (URL Multiplication Strategy)
```
/calculator/reconstitution?peptide={slug} - Pre-filled reconstitution
/calculator/accumulation?peptide={slug} - Pre-filled accumulation

Example: /calculator/accumulation?peptide=bpc-157
```

**This generates 188 × 2 = 376 additional URLs**

---

## Meta Tags (Peptide-Specific)

```html
<title>{Peptide Name} Reconstitution Calculator | Pepcodex</title>
<meta name="description" content="Calculate {Peptide Name} reconstitution with our visual syringe guide. Enter vial size and water volume for accurate concentration.">
```

---

## Calculator Hub Page Structure

### 1. Hero
| Element | Content |
|---------|---------|
| Badge | "Research Tools" |
| H1 | "Peptide Calculators" |
| Subtitle | "Reconstitution, blending, and accumulation tools" |

### 2. Calculator Type Tabs
```
[Reconstitution] [Blend] [Accumulation]
```

### 3. Calculator Interface

**Reconstitution Calculator:**
```
Inputs:
- Peptide selector dropdown (pre-filled if ?peptide= param)
- Peptide amount (mg) - with quick buttons: 5, 10, 15, 20, 30
- BAC Water volume (mL) - with quick buttons: 1, 2, 3, 5
- Desired dose (mcg/mg toggle)
- Syringe size selector: 0.3mL, 0.5mL, 1mL

Outputs:
- Concentration (mg/mL)
- Doses per vial
- Visual syringe showing fill level
- Units to draw
```

**Accumulation Calculator:**
```
Inputs:
- Peptide selector (with half-life auto-populated)
- Dose (mcg/mg)
- Frequency dropdown
- Duration slider (1-52 weeks)

Outputs:
- Concentration graph over time
- Peak concentration
- Trough concentration
- Time to steady state
```

### 4. Reference Guide Sidebar
```
- Common vial sizes table
- Syringe types guide
- Reconstitution tips
```

### 5. CTA: Link Back to Peptide
```
"View {Peptide Name} Research Profile" → /peptides/{slug}
```

### 6. Disclaimer
```
Research purposes disclaimer
```

---

## Schema Markup: HowTo (UNIQUE - Neither Competitor Has This)

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Calculate {Peptide Name} Reconstitution",
  "description": "Step-by-step guide to calculating peptide reconstitution concentration",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Select peptide",
      "text": "Choose {Peptide Name} from the dropdown or navigate directly to this page"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Enter vial size",
      "text": "Enter the amount of lyophilized peptide in your vial (typically 5mg or 10mg)"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Enter water volume",
      "text": "Enter the amount of bacteriostatic water you'll add (typically 1-3mL)"
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "View results",
      "text": "The calculator shows concentration and syringe fill level for your desired dose"
    }
  ],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "Bacteriostatic water"
    },
    {
      "@type": "HowToTool",
      "name": "Insulin syringe"
    }
  ]
}
```

---

## Component: CalculatorPage.astro

```typescript
interface CalculatorPageProps {
  type: 'reconstitution' | 'blend' | 'accumulation';
  prefilledPeptide?: {
    name: string;
    slug: string;
    halfLife?: number; // in minutes
    defaultVialSizes?: number[]; // in mg
  };
}
```

---

## Internal Linking Requirements

| Link To | Purpose |
|---------|---------|
| Peptide profile page | "View Research Profile" |
| Other calculator types | Tab navigation |
| Methodology page | Trust signal |

---

# TEMPLATE E: CONDITION/RESEARCH AREA PAGES

## Competitor Reference
**Source:** peptibase.dev claimed `/best-peptides-for-{condition}` (404 on visit)
**Pepcodex Adaptation:** `/peptides-researched-for-{condition}`

---

## URL Structure

```
Pattern: /peptides-researched-for-{condition}
Examples:
- /peptides-researched-for-weight-loss
- /peptides-researched-for-healing
- /peptides-researched-for-cognitive-enhancement
```

**Note:** Use "researched for" framing, NOT "best for" - maintains credibility.

---

## Meta Tags

```html
<title>Peptides Researched for {Condition} - Evidence Summary | Pepcodex</title>
<meta name="description" content="Peptides with research evidence for {condition}. Ranked by evidence grade with study counts and key findings.">
```

---

## Page Structure

### 1. Hero
| Element | Content |
|---------|---------|
| H1 | "Peptides Researched for {Condition}" |
| Subtitle | "Evidence-based summary of peptide research related to {condition}" |
| Context | "X peptides have been studied for {condition} applications" |

### 2. Research Overview (~100 words)
```markdown
Brief context about the research landscape for this condition.
- How many peptides have been studied
- Range of evidence quality
- Note limitations (e.g., "most studies in animal models")
```

### 3. Evidence Summary Table (Ranked by Evidence Grade)

| Peptide | Evidence Grade | Human Studies | Animal Studies | Key Finding |
|---------|----------------|---------------|----------------|-------------|
| {Name} (linked) | {Badge} | {X} | {Y} | {1 sentence} |

**Sorting:** High → Moderate → Low → Very Low evidence

### 4. Peptide Cards (Top 5-8)
```markdown
For top peptides by evidence grade:
- Name + link
- Evidence grade badge
- Category badge
- 2-3 sentence research summary
- "View Research Profile" button
- "Compare" button (to another in this list)
```

### 5. Research Gaps Section
```markdown
**Purpose:** Intellectual honesty, E-E-A-T signal.
**Content:**
- What's NOT well-studied for this condition
- Limitations of current research
- Example: "No large-scale human trials exist for this application"
```

### 6. FAQs
```markdown
1. What peptides are most researched for {condition}?
2. What is the strongest evidence for peptides and {condition}?
3. Are there human studies for peptides and {condition}?
```

### 7. Related Research Areas
```markdown
Links to related condition pages.
Example: Healing page links to → Joint Health, Inflammation, Recovery
```

---

## Target Conditions (20 Pages)

| Priority | Condition | URL Slug |
|----------|-----------|----------|
| 1 | Weight Loss | weight-loss |
| 2 | Healing & Recovery | healing |
| 3 | Muscle Growth | muscle-growth |
| 4 | Anti-Aging | anti-aging |
| 5 | Cognitive Enhancement | cognitive-enhancement |
| 6 | Gut Health | gut-health |
| 7 | Sleep | sleep |
| 8 | Joint Health | joint-health |
| 9 | Skin Health | skin-health |
| 10 | Hair Growth | hair-growth |
| 11 | Inflammation | inflammation |
| 12 | Immune Function | immune-function |
| 13 | Energy & Fatigue | energy |
| 14 | Neuroprotection | neuroprotection |
| 15 | Cardiovascular | cardiovascular |
| 16 | Bone Health | bone-health |
| 17 | Metabolic Health | metabolic-health |
| 18 | Hormonal Balance | hormonal-balance |
| 19 | Athletic Performance | athletic-performance |
| 20 | Longevity | longevity |

---

# TEMPLATE F: GLOSSARY PAGES

## Competitor Reference
**Source:** Neither competitor has a glossary - THIS IS A GAP TO OWN

---

## URL Structure

```
Hub: /glossary
Terms: /glossary/{term-slug}

Examples:
- /glossary/reconstitution
- /glossary/half-life
- /glossary/subcutaneous-injection
```

---

## Glossary Hub Page

### Structure
```markdown
H1: Peptide Research Glossary
Subtitle: Definitions and explanations for peptide research terminology

Alphabetical listing:
A: [Amino acid] [Angiogenesis]
B: [Bacteriostatic water] [Bioavailability] [Bioregulator]
...
```

---

## Individual Term Page Structure

### Meta Tags
```html
<title>What is {Term}? Definition & Research | Pepcodex</title>
<meta name="description" content="{Term} definition: {40-word definition}. Learn how {term} relates to peptide research.">
```

### Page Structure

#### 1. Hero
| Element | Content |
|---------|---------|
| H1 | "What is {Term}?" |
| Quick Definition | 1-2 sentence definition |

#### 2. Detailed Explanation (~150 words)
```markdown
In-depth explanation accessible to non-experts.
Include:
- What it means in peptide context
- Why it matters for research
- Common examples
```

#### 3. Related Terms
```markdown
Links to 3-5 related glossary terms.
Example: "Half-life" links to → Bioavailability, Accumulation, Steady State
```

#### 4. Peptides Related to This Term
```markdown
"Peptides where {term} is relevant:"
- List of 3-5 peptide links
Example: "Half-life" → links to peptides where half-life is a key consideration
```

#### 5. FAQ (1-2 questions)
```markdown
1. What does {term} mean?
2. Why is {term} important in peptide research?
```

---

## Schema Markup: DefinedTerm

```json
{
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "name": "{Term}",
  "description": "{Definition}",
  "inDefinedTermSet": {
    "@type": "DefinedTermSet",
    "name": "Pepcodex Peptide Research Glossary",
    "url": "https://pepcodex.com/glossary"
  }
}
```

---

## Starter Terms (50 High-Value)

**Basic Concepts:**
1. Peptide
2. Amino acid
3. Peptide bond
4. Protein
5. Sequence

**Administration:**
6. Reconstitution
7. Lyophilized
8. Bacteriostatic water
9. Subcutaneous injection
10. Intramuscular injection
11. Insulin syringe
12. Vial

**Pharmacology:**
13. Half-life
14. Bioavailability
15. Steady state
16. Accumulation
17. Concentration
18. mcg vs mg
19. Titration

**Peptide Types:**
20. Bioregulator
21. GH secretagogue
22. GLP-1 agonist
23. Growth hormone
24. Melanocortin

**Research:**
25. Clinical trial
26. Preclinical
27. In-vitro
28. In-vivo
29. RCT
30. Double-blind
31. Placebo-controlled

**Mechanisms:**
32. Angiogenesis
33. Collagen synthesis
34. Receptor agonist
35. Receptor antagonist
36. Neuroprotection

**Quality:**
37. Purity
38. Third-party testing
39. Certificate of analysis
40. HPLC testing
41. Mass spectrometry

**Storage:**
42. Cold chain
43. Stability
44. Degradation
45. Oxidation

**Regulatory:**
46. FDA approved
47. Research chemical
48. Off-label
49. Investigational
50. WADA prohibited

---

# IMPLEMENTATION PRIORITY

## Phase 1: Foundation (Week 1-2)
- [ ] Create base page templates (Astro components)
- [ ] Implement schema markup utilities
- [ ] Build FAQ component with FAQPage schema

## Phase 2: Subpages (Week 3-4)
- [ ] Research Summary template
- [ ] Related Research template
- [ ] Generate for top 50 peptides

## Phase 3: Comparisons (Week 5-6)
- [ ] Comparison page template
- [ ] Generate Tier 1 (20 priority pairs)
- [ ] Generate Tier 2 (80 category pairs)

## Phase 4: Calculators (Week 7-8)
- [ ] Calculator hub page
- [ ] Peptide-specific URL routing
- [ ] HowTo schema implementation

## Phase 5: Condition Pages (Week 9-10)
- [ ] Condition page template
- [ ] Generate 20 condition pages
- [ ] Internal linking matrix

## Phase 6: Glossary (Week 11-12)
- [ ] Glossary hub
- [ ] Generate 50 term pages
- [ ] Cross-linking implementation

---

# URL COUNT PROJECTION

| Template Type | Count | Status |
|---------------|-------|--------|
| Research Summary subpages | 188 | Planned |
| Related Research subpages | 188 | Planned |
| Comparison pages | 100 | Planned |
| Calculator URLs | 376 | Planned |
| Condition pages | 20 | Planned |
| Glossary pages | 50 | Planned |
| **New URLs** | **922** | — |
| **Current** | **188** | Existing |
| **Total** | **1,110** | Target |

---

*Template Specifications Complete | Generated 2026-02-01*
