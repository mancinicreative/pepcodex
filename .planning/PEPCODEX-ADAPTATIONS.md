# PEPCODEX ADAPTATIONS: EVIDENCE-FIRST POSITIONING
## How Pepcodex Differs from Competitors

**Generated:** 2026-02-01
**Core Principle:** Transparent evidence synthesis without dosing advice

---

# THE PEPCODEX DIFFERENCE

## What Competitors Do → What Pepcodex Does Instead

| Competitor Pattern | Pepcodex Adaptation | Why |
|-------------------|---------------------|-----|
| "How to Use" subpages with dosing | "Research Summary" with evidence synthesis | Credibility + liability protection |
| "Alternatives" framed as recommendations | "Related Research" framed as similar studies | No recommendation liability |
| "Best Peptides for X" | "Peptides Researched for X" | Evidence framing, not advice |
| Dosing tables with mcg/mg amounts | Evidence tables with study counts | Never give dosing |
| Side effects as warnings | Research observations labeled by study type | Scientific framing |
| "What to Expect" timelines | "Research Timeline" showing when studies published | Historical context, not promises |
| User protocols/cycles | Study protocols cited from literature | Citation-backed only |

---

# EVIDENCE GRADE SYSTEM

## Grade Definitions (Pepcodex Unique)

| Grade | Badge Color | Criteria | Display |
|-------|-------------|----------|---------|
| **High** | Green | 2+ RCTs or meta-analysis, >500 participants | ████ HIGH |
| **Moderate** | Yellow | 1+ RCT or multiple observational | ███░ MODERATE |
| **Low** | Orange | Small human studies or consistent animal | ██░░ LOW |
| **Very Low** | Red | In-vitro only, animal only, or conflicting | █░░░ VERY LOW |

## Evidence Badge Component

```astro
---
// EvidenceGradeBadge.astro
interface Props {
  grade: 'high' | 'moderate' | 'low' | 'very-low';
  showBreakdown?: boolean;
  studyCount?: {
    human: number;
    animal: number;
    invitro: number;
  };
}

const gradeConfig = {
  high: { label: 'High', color: 'green', bars: 4 },
  moderate: { label: 'Moderate', color: 'yellow', bars: 3 },
  low: { label: 'Low', color: 'orange', bars: 2 },
  'very-low': { label: 'Very Low', color: 'red', bars: 1 }
};
---

<div class="evidence-badge evidence-{grade}">
  <span class="bars">{/* Visual bars */}</span>
  <span class="label">{gradeConfig[grade].label} Evidence</span>
  {showBreakdown && studyCount && (
    <div class="breakdown">
      <span>{studyCount.human} human</span>
      <span>{studyCount.animal} animal</span>
      <span>{studyCount.invitro} in-vitro</span>
    </div>
  )}
</div>
```

---

# CONTENT RULES: WHAT TO INCLUDE vs EXCLUDE

## ALWAYS Include

| Element | Purpose | Example |
|---------|---------|---------|
| Evidence grade | Core differentiator | "Moderate Evidence" badge |
| Study type labels | Transparency | "(in animal models)", "(human RCT)" |
| Study counts | Credibility | "Based on 12 studies (3 human, 9 animal)" |
| Citation links | Verifiability | PubMed/DOI links |
| Research limitations | Honesty | "No large-scale human trials exist" |
| Last updated date | Freshness | "Last reviewed: Feb 2026" |
| Methodology link | Trust | "How we grade evidence" |

## NEVER Include

| Element | Reason | Alternative |
|---------|--------|-------------|
| Dosing amounts (mcg, mg, IU) | Liability, not medical advice | Link to calculator (math only) |
| Protocol recommendations | Medical advice | "Study used X protocol" (citation) |
| "Best time to take" | Dosing advice | Remove entirely |
| Frequency recommendations | Dosing advice | Remove entirely |
| Cycle length advice | Protocol advice | "Studies ranged from X-Y weeks" |
| Purchase/sourcing info | Legal risk | Never mention |
| Vendor names | Legal risk | Never mention |
| "You should" language | Medical advice | "Research suggests" |
| Personal recommendations | Liability | Evidence-only framing |

---

# LANGUAGE GUIDELINES

## Competitor Language → Pepcodex Language

| Don't Say | Say Instead |
|-----------|-------------|
| "Take 250mcg twice daily" | "Studies used doses ranging from X-Y" (cite) |
| "Best peptide for healing" | "Most-researched peptide for healing" |
| "Side effects include..." | "Adverse events observed in studies include..." |
| "You can expect..." | "Studies observed..." |
| "Recommended protocol" | "Protocol used in [Study Name]" |
| "Users report..." | "Studies found..." (or remove if anecdotal) |
| "Safe and effective" | "Well-tolerated in studies at [dose]" (cite) |
| "Benefits of X" | "Research findings for X" |
| "How to use X" | "Research on X" |

## Required Qualifiers

Every claim must include one of:
- "(Source: [Citation])"
- "(in animal models)"
- "(in human trials)"
- "(in vitro)"
- "(based on X studies)"

---

# PAGE-SPECIFIC ADAPTATIONS

## Research Summary Subpage

### Competitor: "How to Use" Sections
```
❌ Dosing Guidelines: 250-500mcg
❌ Frequency: 1-2x daily
❌ Best Time: Morning
❌ Protocol Duration: 4-12 weeks
```

### Pepcodex: "Research Summary" Sections
```
✓ Research Highlights (study findings, not protocols)
✓ Evidence Grade Breakdown
✓ Mechanism Summary
✓ Research Timeline (publication dates)
✓ Research Questions (FAQ)
```

---

## Comparison Pages

### Competitor Table Columns
```
❌ Common Dosing
❌ Administration
❌ Typical Duration
❌ Best Time to Take
❌ Side Effects (as warnings)
```

### Pepcodex Table Columns
```
✓ Evidence Grade (badge)
✓ Human Study Count
✓ Animal Study Count
✓ Clinical Status
✓ Mechanism of Action
✓ Key Research Areas
✓ Research Summary
```

---

## Condition Pages

### Competitor: "Best Peptides for X"
```
❌ "Best Peptides for Weight Loss"
❌ Ranked by effectiveness
❌ Dosing recommendations per peptide
❌ "Which one should you choose?"
```

### Pepcodex: "Peptides Researched for X"
```
✓ "Peptides Researched for Weight Loss"
✓ Ranked by evidence grade
✓ Study counts per peptide
✓ Research gaps section
✓ "Consult healthcare provider" messaging
```

---

# CALCULATOR ADAPTATIONS

## What Calculators CAN Do
- Mathematical conversion (mg to mcg)
- Concentration calculation (mg/mL)
- Volume calculation (mL to draw)
- Visual representation (syringe fill level)
- Half-life visualization (accumulation curves)

## What Calculators CANNOT Do
- Recommend doses
- Suggest protocols
- Advise frequency
- Recommend peptides for conditions
- Provide "typical" or "common" doses

## Calculator Disclaimer (Required)

```markdown
**Research Tool Only**

This calculator performs mathematical conversions for educational purposes.
It does not recommend doses, protocols, or peptide use. All peptide research
decisions should be made in consultation with qualified professionals.

Pepcodex does not provide medical advice.
```

---

# SCHEMA MARKUP ADAPTATIONS

## Drug Schema: What to Include/Exclude

### Include
```json
{
  "@type": "Drug",
  "name": "BPC-157",
  "alternateName": ["Body Protection Compound-157", "Pentadecapeptide"],
  "description": "Research peptide studied for...",
  "drugClass": "Peptide",
  "mechanismOfAction": "Promotes angiogenesis...",
  "clinicalPharmacology": "Studied in animal models for..."
}
```

### Exclude
```json
{
  // DO NOT INCLUDE:
  "administrationRoute": "...",  // Implies usage advice
  "dosageForm": "...",           // Implies usage advice
  "doseSchedule": "...",         // Dosing advice
  "maximumIntake": "...",        // Dosing advice
  "recommendedIntake": "..."     // Dosing advice
}
```

---

# FAQ ADAPTATIONS

## Competitor FAQ Style
```
Q: What is the recommended dose for BPC-157?
A: 250-500mcg twice daily...

Q: How long should I use BPC-157?
A: Typically 4-12 weeks...
```

## Pepcodex FAQ Style
```
Q: What is BPC-157?
A: BPC-157 is a synthetic peptide derived from gastric juice protein,
   studied primarily in animal models for tissue repair and healing
   applications. Current evidence is Moderate based on 3 human studies
   and 40+ animal studies.

Q: What research has been done on BPC-157?
A: BPC-157 has been studied in rat models for tendon healing (Sikiric 2006),
   muscle repair (Novinscak 2008), and gastrointestinal protection
   (Seiwerth 2019). Limited human data exists.

Q: What is the evidence grade for BPC-157?
A: Pepcodex rates BPC-157 as Moderate evidence. This means there are
   some human studies with limitations, supported by extensive animal
   research. See our methodology for grading criteria.
```

---

# DISCLAIMER COMPONENTS

## Standard Page Disclaimer

```astro
---
// DisclaimerBanner.astro
---
<aside class="disclaimer-banner" role="complementary">
  <p>
    <strong>Research Information Only.</strong>
    This content synthesizes published research and is not medical advice.
    Pepcodex does not recommend peptide use, dosing, or protocols.
    Consult qualified healthcare providers for medical decisions.
  </p>
  <a href="/disclaimer">Full Disclaimer</a> |
  <a href="/methodology">Our Methodology</a>
</aside>
```

## Calculator Disclaimer

```astro
---
// CalculatorDisclaimer.astro
---
<aside class="calculator-disclaimer">
  <p>
    <strong>Mathematical Tool Only.</strong>
    This calculator performs unit conversions for educational purposes.
    It does not recommend doses, protocols, or peptide use.
    All research decisions require professional guidance.
  </p>
</aside>
```

## Comparison Page Disclaimer

```astro
---
// ComparisonDisclaimer.astro
---
<aside class="comparison-disclaimer">
  <p>
    <strong>Research Comparison Only.</strong>
    This comparison presents published research data. Neither peptide
    is recommended over the other. Individual research and professional
    consultation is required for any decisions.
  </p>
</aside>
```

---

# INTERNAL LINKING: EVIDENCE-FIRST APPROACH

## Link Anchor Text Guidelines

### Don't Use
- "Click here for dosing"
- "Recommended protocol"
- "Best option"
- "Start with this"

### Use Instead
- "View research profile"
- "Compare evidence"
- "See study breakdown"
- "Research summary"
- "Evidence comparison"

---

# META DESCRIPTION TEMPLATES

## Peptide Profile
```
{Peptide Name} research profile: {Evidence Grade} evidence from {X} studies.
Mechanism, research areas, and evidence synthesis. Updated {Month Year}.
```

## Comparison Page
```
{Peptide A} vs {Peptide B}: Compare evidence grades, study counts, and
research findings. Side-by-side research comparison.
```

## Condition Page
```
Peptides researched for {condition}: Evidence summary of {X} peptides
with study counts and evidence grades. Research synthesis.
```

## Calculator
```
{Peptide Name} reconstitution calculator: Convert mg to mcg,
calculate concentration. Research tool for educational purposes.
```

---

# TRUST SIGNALS CHECKLIST

## Every Pepcodex Page Must Have:

- [ ] Evidence grade badge (where applicable)
- [ ] Study type labels on claims
- [ ] Last updated date
- [ ] Disclaimer banner
- [ ] Link to methodology
- [ ] Citation links (PubMed/DOI)
- [ ] "Research purposes" framing

## Every Pepcodex Page Must NOT Have:

- [ ] Dosing recommendations
- [ ] Protocol advice
- [ ] Sourcing information
- [ ] "You should" language
- [ ] Effectiveness claims without citations
- [ ] Unlabeled study types
- [ ] Medical advice

---

# IMPLEMENTATION CHECKLIST

## Before Publishing Any Page:

```markdown
## Content Safety Check

### Language Review
- [ ] No dosing amounts (mcg, mg, IU) as recommendations
- [ ] No "you should" or "recommended" language
- [ ] No sourcing/vendor mentions
- [ ] All claims cite sources
- [ ] Study types labeled (human/animal/in-vitro)

### Evidence Display
- [ ] Evidence grade assigned and displayed
- [ ] Study breakdown included
- [ ] Limitations acknowledged
- [ ] Methodology linked

### Trust Signals
- [ ] Disclaimer banner present
- [ ] Last updated date set
- [ ] Citations linked (PubMed/DOI)
- [ ] Contact for corrections included

### Technical
- [ ] Schema validates
- [ ] Internal links present (5+)
- [ ] Meta description <160 chars
- [ ] Title <60 chars
```

---

*Pepcodex Adaptations Guide Complete | Generated 2026-02-01*
