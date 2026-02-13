# PHASE 5: TRUST & CONTENT QA SYSTEM
## Pepcodex Competitive Intelligence

**Generated:** 2026-02-01
**Your Product:** pepcodex.com | Evidence-based peptide research database

---

## Purpose

Design systems for:
1. E-E-A-T signal implementation (Experience, Expertise, Authoritativeness, Trustworthiness)
2. Content quality standards and gates
3. Citation and evidence systems
4. Trust signals and credibility markers

---

# E-E-A-T AUDIT

## Current Competitor E-E-A-T Signals

| Signal | peptide-db.com | peptibase.dev | pepcodex.com |
|--------|----------------|---------------|--------------|
| **Experience** | | | |
| Author bylines | ✗ | ✗ | ? |
| Case studies | ✗ | ✗ | ✗ |
| First-person content | ✗ | ✗ | ✗ |
| **Expertise** | | | |
| Credentials shown | ✗ | ✗ | ? |
| Editorial team page | ✗ | ✗ | ✗ |
| Methodology page | ✗ | ✗ | ✗ |
| Medical review badges | ✗ | ✗ | ✗ |
| **Authoritativeness** | | | |
| Citations to sources | ✓ (369 refs) | ✓ (PubMed) | ✓ |
| Schema markup | Basic | Comprehensive | ? |
| External mentions | Unknown | Unknown | Unknown |
| **Trustworthiness** | | | |
| HTTPS | ✓ | ✓ | ✓ |
| Privacy policy | ✓ | ✓ | ? |
| Contact info | ✓ | ✓ | ✓ |
| Last updated dates | ✗ | ✓ (schema only) | ✗ |
| Disclaimers | ✓ | ✓ | ? |

---

## E-E-A-T Implementation Plan

### Experience Signals

| Signal | Implementation | Priority |
|--------|----------------|----------|
| Editorial voice | Write in authoritative third person | Medium |
| Research context | "Based on X studies published between Y-Z..." | High |
| Methodology transparency | "We evaluate evidence using..." | High |
| Limitations acknowledgment | "Current research is limited to..." | High |

### Expertise Signals

| Signal | Implementation | Priority |
|--------|----------------|----------|
| Editorial team page | `/about/editorial` with credentials | High |
| Review process | Describe content review workflow | Medium |
| Scientific advisory (future) | If available, showcase advisors | Low |
| Author schema | PersonSchema for contributors | Medium |

### Authoritativeness Signals

| Signal | Implementation | Priority |
|--------|----------------|----------|
| Citation depth | 10+ citations per peptide minimum | High |
| PubMed/DOI links | Direct links to sources | High |
| Clinical trial links | NCT identifiers linked | High |
| Evidence grading | High/Moderate/Low/Very Low | High |
| Schema markup | Drug, FAQPage, MedicalWebPage | High |

### Trustworthiness Signals

| Signal | Implementation | Priority |
|--------|----------------|----------|
| Disclaimers | Medical, general, FDA notice | High |
| Privacy policy | Comprehensive policy page | High |
| Terms of service | Clear terms | High |
| Last updated dates | Visible on every page | High |
| Contact information | info@pepcodex.com prominently | Medium |
| No sourcing | Never link to vendors | Critical |

---

# CONTENT QUALITY STANDARDS

## Quality Gates (Automated)

### Gate 1: Citation Validation

| Check | Requirement | Action if Fail |
|-------|-------------|----------------|
| PMID format | Valid 8-digit PMID | Block publication |
| DOI format | Valid DOI pattern | Block publication |
| NCT format | Valid NCT identifier | Block publication |
| Paywall flag | Must be marked if paywalled | Warning |
| Dead link check | URL returns 200 | Warning |

### Gate 2: Banned Content Scan

| Pattern | Example | Action if Found |
|---------|---------|-----------------|
| Dosing numbers | "250mcg", "500mg daily" | Block |
| Sourcing mentions | "buy", "vendor", "source" | Block |
| Protocol language | "cycle", "stack", "protocol" | Warning |
| Medical advice | "you should", "take this for" | Block |
| Brand recommendations | "Peptide Sciences", vendor names | Block |

### Gate 3: Evidence Labeling

| Check | Requirement | Action if Fail |
|-------|-------------|----------------|
| Study type labeled | Human/Animal/In-vitro marked | Block |
| Evidence grade present | H/M/L/VL assigned | Block |
| Citation count | Minimum 5 per peptide | Warning |
| Recent citation | At least 1 from last 3 years | Warning |

---

## Quality Standards (Manual)

### Content Checklist per Peptide

```markdown
## Pre-Publication Checklist

### Source Quality
- [ ] 5+ unique citations
- [ ] At least 1 human study (if available)
- [ ] Citations from last 5 years
- [ ] PubMed/DOI links verified
- [ ] Clinical trial links verified

### Evidence Labeling
- [ ] Evidence grade assigned (H/M/L/VL)
- [ ] Study breakdown included (X human, Y animal, Z in-vitro)
- [ ] Limitations acknowledged
- [ ] Animal studies clearly labeled

### Content Safety
- [ ] No dosing recommendations
- [ ] No sourcing mentions
- [ ] No medical advice
- [ ] Disclaimer present
- [ ] Study type labels on all claims

### Technical
- [ ] Title < 60 characters
- [ ] Meta description < 160 characters
- [ ] Schema markup validates
- [ ] Internal links present (5+)
- [ ] Last updated date set
```

---

# EVIDENCE GRADING SYSTEM

## Grade Definitions

| Grade | Definition | Criteria |
|-------|------------|----------|
| **High** | Strong evidence from well-designed human studies | 2+ RCTs or meta-analysis with >500 participants |
| **Moderate** | Some human evidence with limitations | 1+ RCT or multiple observational studies |
| **Low** | Limited human evidence, primarily animal | Small human studies or consistent animal evidence |
| **Very Low** | Minimal evidence, mostly preclinical | In-vitro, animal only, or conflicting results |

## Grade Display Component

```html
<EvidenceGrade grade="moderate">
  <GradeBadge />
  <GradeBreakdown>
    <StudyCount type="human">3</StudyCount>
    <StudyCount type="animal">27</StudyCount>
    <StudyCount type="invitro">12</StudyCount>
  </GradeBreakdown>
  <GradeNote>
    Limited human trials; most evidence from animal models
  </GradeNote>
</EvidenceGrade>
```

## Grade Assignment Workflow

```
1. Collect all citations for peptide
2. Categorize by study type (human RCT, human observational, animal, in-vitro)
3. Assess quality of human studies (sample size, design, bias)
4. Assign grade based on highest quality evidence
5. Document reasoning in internal notes
6. Flag for review if grade uncertain
```

---

# CITATION SYSTEM

## Citation Requirements

### Minimum Standards

| Content Type | Min Citations | Source Requirements |
|--------------|---------------|---------------------|
| Peptide dossier | 10 | 50%+ PubMed, include any human trials |
| Comparison page | 6 | 3 per peptide minimum |
| Mechanism section | 3 | Peer-reviewed only |
| Benefits section | 5 | Study citations, not reviews |
| Safety section | 3 | Include any adverse event reports |

### Citation Formatting

```markdown
## References

1. Author A, Author B. Title of study. *Journal Name*. Year;Volume(Issue):Pages. [PubMed](https://pubmed.ncbi.nlm.nih.gov/PMID/) | [DOI](https://doi.org/DOI) 🔓

2. Author C, et al. Another study title. *Different Journal*. Year. [PubMed](https://pubmed.ncbi.nlm.nih.gov/PMID/) 🔒

Legend: 🔓 Open access | 🔒 Paywalled
```

### Citation Metadata Schema

```typescript
interface Citation {
  pmid?: string;           // PubMed ID
  doi?: string;            // DOI
  nct?: string;            // ClinicalTrials.gov ID
  title: string;
  authors: string[];
  journal: string;
  year: number;
  studyType: 'rct' | 'observational' | 'meta-analysis' | 'animal' | 'invitro' | 'case-report';
  sampleSize?: number;
  isPaywalled: boolean;
  keyFinding: string;      // 1-sentence summary
}
```

---

# TRUST SIGNALS IMPLEMENTATION

## Page-Level Trust Signals

### Header/Above the Fold

| Signal | Implementation |
|--------|----------------|
| Evidence grade badge | Prominent in hero section |
| Last updated date | Below title |
| Citation count | "Based on X studies" |

### Footer/Bottom of Page

| Signal | Implementation |
|--------|----------------|
| Medical disclaimer | Standard disclaimer text |
| FDA notice | Link to /fda-notice |
| Editorial policy link | Link to /about/editorial |
| Contact | info@pepcodex.com |

### Sidebar/Sticky

| Signal | Implementation |
|--------|----------------|
| Evidence grade | Always visible |
| Methodology link | "How we grade evidence" |
| Report issue | "Report inaccuracy" link |

---

## Site-Level Trust Infrastructure

### Required Pages

| Page | URL | Purpose |
|------|-----|---------|
| Disclaimer | /disclaimer | General + medical disclaimer |
| Privacy Policy | /privacy | Data handling policies |
| Terms of Service | /terms | Usage terms |
| FDA Notice | /fda-notice | FDA compliance statement |
| Editorial Policy | /about/editorial | How content is created |
| Methodology | /methodology | Evidence grading system |
| Contact | /contact | Contact form + info |

### Disclaimer Banner Component

```typescript
// DisclaimerBanner.astro
<aside class="disclaimer-banner">
  <p>
    <strong>Research purposes only.</strong> This content synthesizes
    published research and is not medical advice. Consult a healthcare
    provider before making health decisions.
    <a href="/disclaimer">Full disclaimer</a>
  </p>
</aside>
```

**Placement:** Bottom of every peptide page, above footer.

---

## Editorial Team Page

### Structure

```markdown
# Editorial Policy

## Our Mission
Pepcodex synthesizes peer-reviewed research into accessible peptide
information. We prioritize transparency, evidence quality, and
scientific accuracy.

## How We Create Content

### Research Process
1. Systematic literature search (PubMed, ClinicalTrials.gov)
2. Evidence quality assessment
3. Draft creation with citation requirements
4. QA gate validation
5. Publication with evidence grade

### Evidence Grading
We use a four-tier evidence grading system...
[Link to /methodology]

## Editorial Standards
- No dosing or protocol recommendations
- No sourcing or vendor information
- All claims cite peer-reviewed sources
- Study types clearly labeled
- Limitations acknowledged

## Corrections Policy
If you identify an error, contact info@pepcodex.com.
We review and correct within 48 hours.

## Last Updated
[Date]
```

---

## Methodology Page

### Structure

```markdown
# Methodology: How We Grade Evidence

## Overview
Pepcodex uses a systematic approach to evaluate peptide research
quality. Our evidence grading system helps readers understand
the strength of available evidence.

## Evidence Grade Levels

### High Evidence
Strong support from well-designed human studies.
- 2+ randomized controlled trials
- Or meta-analysis with >500 participants
- Consistent findings across studies

### Moderate Evidence
Some human evidence with limitations.
- 1+ RCT or multiple observational studies
- May have smaller sample sizes
- Generally consistent findings

### Low Evidence
Limited human evidence, primarily animal research.
- Small human studies
- Consistent animal model results
- Limited translation to humans

### Very Low Evidence
Minimal evidence, mostly preclinical.
- In-vitro studies only
- Animal studies with mixed results
- Insufficient data for conclusions

## Study Type Classification

### Human Studies
- Randomized controlled trials (RCTs)
- Observational studies
- Case reports
- Meta-analyses

### Preclinical Studies
- Animal models (labeled by species when known)
- In-vitro (cell culture) studies
- Computational/modeling studies

## Source Quality Assessment

### Preferred Sources
1. PubMed-indexed journals
2. ClinicalTrials.gov registered trials
3. Cochrane reviews
4. FDA approval documents

### Source Flags
- 🔓 Open access
- 🔒 Paywalled
- ⚠️ Preprint (not peer-reviewed)

## Limitations We Acknowledge

1. **Publication bias**: Positive results more likely published
2. **Animal translation**: Animal findings may not apply to humans
3. **Regulatory status**: Most peptides lack FDA approval
4. **Funding bias**: Industry-funded studies may have conflicts

## Update Process
Content is reviewed and updated quarterly or when
significant new research is published.

---
*Last updated: [Date]*
```

---

# CONTENT QA WORKFLOW

## Automated Pipeline (n8n)

```
Source Pack Collection
├── PubMed API search
├── ClinicalTrials.gov search
├── Europe PMC search
└── Google Scholar (limited)
        ↓
QA Gate 1: Citation Validation
├── PMID format check
├── DOI format check
├── Dead link check
└── Duplicate removal
        ↓
Draft Generation (Claude)
├── Evidence synthesis
├── Study type labeling
├── Evidence grade assignment
└── Structured output
        ↓
QA Gate 2: Banned Content Scan
├── Dosing pattern scan
├── Sourcing term scan
├── Medical advice scan
└── Protocol language scan
        ↓
QA Gate 3: Quality Validation
├── Citation count check
├── Evidence labeling check
├── Schema validation
└── Word count check
        ↓
Publication
├── Generate schema markup
├── Set last updated date
├── Add to sitemap
└── Submit to Google
```

## Manual Review Triggers

| Trigger | Reason | Action |
|---------|--------|--------|
| New peptide | First-time coverage | Full manual review |
| Evidence grade change | Quality assessment | Editorial review |
| User report | Error flagged | Investigate + correct |
| Quarterly review | Freshness | Update check |
| Major study published | New evidence | Evidence reassessment |

---

# TRUST METRICS TO TRACK

## Internal Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Citations per page | >10 average | Monthly audit |
| Human study % | >20% of citations | Monthly audit |
| Pages with evidence grade | 100% | Dashboard |
| Last updated < 6 months | 80% of pages | Dashboard |
| Broken citation links | <2% | Weekly scan |
| Banned content violations | 0 | Per publish |

## External Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Domain authority | Trending up | Monthly (Ahrefs free) |
| External citations | 10+ sites linking | Monthly |
| Reddit mentions | Positive sentiment | Manual monitoring |
| Journalist inquiries | 1+ per quarter | Email tracking |

---

# COMPARISON: PEPCODEX TRUST ADVANTAGE

## What Pepcodex Does That Competitors Don't

| Trust Signal | peptide-db | peptibase | pepcodex |
|--------------|------------|-----------|----------|
| Evidence grading system | ✗ | ✗ | ✓ |
| Study type labeling | Partial | Partial | ✓ |
| Methodology page | ✗ | ✗ | ✓ |
| Transparent limitations | ✗ | ✗ | ✓ |
| No dosing (liability reduction) | ✗ | ✗ | ✓ |
| Publication bias acknowledgment | ✗ | ✗ | ✓ |
| Source quality scores | ✗ | ✗ | ✓ |

## Trust Positioning Statement

> "Pepcodex is the only peptide database that transparently grades
> evidence quality, labels study types, and acknowledges research
> limitations. We synthesize research — we don't give medical advice."

---

## NEXT: Phase 6 - Link & Mentions Engine

Ready to design backlink acquisition and citation building strategies.

---

*Phase 5 Complete | Generated 2026-02-01*
