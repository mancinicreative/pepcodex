# GAP & SERP FEATURE AUDIT
## Phase 4 Execution: Pepcodex Current State vs Competitive Targets

**Generated:** 2026-02-01
**Audit Type:** Implementation gap analysis against Phase 4 competitive intelligence

---

# EXECUTIVE SUMMARY

| Category | Phase 4 Target | Current State | Gap |
|----------|---------------|---------------|-----|
| Total URLs | 500+ | ~338 | -162+ |
| Comparison Pages | 100 | 45 | -55 |
| Subpages | 100 (50+50) | 0 | -100 |
| Condition Pages | 15+ | 0 | -15 |
| Calculator URL Mult. | 100+ | 3 | -97 |
| FAQPage Schema Usage | All peptides | Component only | -72 deployments |
| HowTo Schema | Calculators | None | -3 implementations |
| Drug Schema | All peptides | None | -72 implementations |

**Priority Actions:**
1. Deploy FAQs on all peptide pages (infrastructure exists)
2. Create HowTo + Drug schema components (30 min each)
3. Add 55 comparison pages (content generation)
4. Create condition pages template + 15 pages
5. Implement calculator URL routing

---

# URL SURFACE GAP ANALYSIS

## Current Content Inventory

| Content Type | Count | Location |
|--------------|-------|----------|
| Peptide Dossiers | 72 | `src/content/peptides/*.mdx` |
| Comparison Pages | 45 | `src/content/comparisons/*.mdx` |
| Glossary Terms | 99 | `src/content/glossary/*.mdx` |
| Guides | 36 | `src/content/guides/*.mdx` |
| Safety Pages | 11 | `src/content/safety/*.mdx` |
| Blog Posts | 73 | `src/content/blog/*.mdx` |
| Calculators | 3 | `src/pages/calculator/*.astro` |
| **Total Content** | **339** | — |

## URL Gap by Type

### Comparison Pages
| Metric | Target | Current | Gap | Priority |
|--------|--------|---------|-----|----------|
| Total | 100 | 45 | -55 | P1 |
| High-value pairs created | 10 | ~8 | -2 | P1 |

**Missing high-value comparisons:**
- ✅ tirzepatide-vs-semaglutide (EXISTS)
- ✅ ozempic-vs-wegovy (EXISTS)
- ✅ bpc-157 vs tb-500 → kpv-vs-bpc-157 exists, need bpc-157-vs-tb-500
- ✅ cjc-1295-vs-sermorelin (EXISTS)
- ✅ mk-677-vs-cjc-1295 (EXISTS)
- ❌ ghrp-6-vs-ghrp-2 (MISSING)
- ❌ tesamorelin-vs-sermorelin (MISSING)
- ❌ bpc-157-vs-ghk-cu (MISSING - have tb-500-vs-ghk-cu)
- ❌ tirzepatide-vs-retatrutide (MISSING)
- ❌ sermorelin-vs-ipamorelin (MISSING)

### Subpages (NOT IMPLEMENTED)
| Subpage Type | Target | Current | Gap |
|--------------|--------|---------|-----|
| Research Summary | 50 | 0 | -50 |
| Related Research | 50 | 0 | -50 |
| **Total** | **100** | **0** | **-100** |

**Current URL structure:** `/peptides/[slug]` only
**Target URL structure:**
- `/peptides/[slug]/research-summary`
- `/peptides/[slug]/related-research`

### Condition Pages (NOT IMPLEMENTED)
| Metric | Target | Current | Gap |
|--------|--------|---------|-----|
| "Peptides researched for X" | 15 | 0 | -15 |

**Priority condition pages to create:**
1. peptides-for-weight-loss (5K+ vol)
2. peptides-for-muscle-growth (3K+ vol)
3. peptides-for-healing (2K+ vol)
4. peptides-for-anti-aging (2K+ vol)
5. peptides-for-sleep (1K+ vol)
6. peptides-for-gut-health (1K+ vol)
7. peptides-for-hair-growth (2K+ vol)
8. peptides-for-skin (2K+ vol)
9. peptides-for-inflammation (1K+ vol)
10. peptides-for-joint-pain (1K+ vol)

### Calculator URL Multiplication (NOT IMPLEMENTED)
| Metric | Target | Current | Gap |
|--------|--------|---------|-----|
| Parameter URLs | 100+ | 3 | -97 |

**Current:** Static routes only
- `/calculator/reconstitution`
- `/calculator/blend`
- `/calculator/accumulation`

**Target:** Dynamic parameter routing
- `/calculator/reconstitution?peptide=bpc-157`
- `/calculator/reconstitution/bpc-157` (SEO-friendly)

Each of 72 peptides × 3 calculators = 216 potential URLs

### Glossary Terms
| Metric | Target | Current | Gap |
|--------|--------|---------|-----|
| Terms | 100 | 99 | -1 |

**Status:** ✅ NEARLY COMPLETE

---

# CONTENT DEPTH AUDIT

## DossierLayout Module Checklist

| Module | Phase 4 Target | Current | Status |
|--------|---------------|---------|--------|
| Quick stats bar | ✓ | ✓ Research Statistics card | ✅ |
| Overview/summary | ✓ | ✓ OverviewSection | ✅ |
| Mechanism of action | ✓ | ✓ MDX content | ✅ |
| Key benefits | ✓ | ✓ via evidenceChainedBenefits | ✅ |
| Molecular structure | ✓ | ✓ MolecularStructure component | ✅ |
| Research indications | ✓ | ✓ MDX content | ✅ |
| Dosing protocols | ✗ (skip) | ✗ (by design) | ✅ CORRECT |
| What to expect | ✓ | ✓ Timeline component | ✅ |
| Side effects | ✓ | ✓ SafetyBanner | ✅ |
| Quality checklist | ✓ | ✓ QualityChecklist component | ✅ |
| References | ✓ | ✓ References section | ✅ |
| Related peptides | ✓ | ✓ RelatedEntities component | ✅ |
| Evidence grade | ✓ | ✓ EvidenceBadge | ✅ DIFFERENTIATOR |
| Study breakdown | ✓ | ✓ sources.human/preclinical | ✅ DIFFERENTIATOR |
| Clinical trial links | ✓ | Partial (PMIDs) | ⚠️ |

**Content Depth: 13/14 modules implemented = 93% coverage**

### Missing/Incomplete:
1. **Clinical trial links to registries** - Currently link to PubMed, should also link to ClinicalTrials.gov for active trials

---

# SCHEMA IMPLEMENTATION AUDIT

## Current SEO Schema Components

| Schema Type | Component | Status | Usage |
|-------------|-----------|--------|-------|
| FAQPage | `FAQSchema.astro` | ✅ EXISTS | ❌ NOT DEPLOYED |
| Article | `ArticleSchema.astro` | ✅ EXISTS | ✅ All dossiers |
| Breadcrumb | `BreadcrumbSchema.astro` | ✅ EXISTS | ✅ All dossiers |
| ItemList | `ItemListSchema.astro` | ✅ EXISTS | ✅ Index pages |
| Organization | `OrganizationSchema.astro` | ✅ EXISTS | ✅ Site-wide |
| JsonLd | `JsonLd.astro` | ✅ EXISTS | ✅ Base wrapper |

## Missing Schema Components

| Schema Type | Priority | Impact | Effort |
|-------------|----------|--------|--------|
| HowTo | P1 | Medium | 30 min |
| Drug | P1 | Medium | 45 min |
| MedicalWebPage | P2 | Low | 30 min |

### FAQPage Schema Gap (CRITICAL)

**Problem:** FAQSchema component exists but is NOT used on any peptide pages.

**Current DossierLayout.astro imports:**
```astro
import ArticleSchema from '../components/SEO/ArticleSchema.astro';
import BreadcrumbSchema from '../components/SEO/BreadcrumbSchema.astro';
// FAQSchema NOT IMPORTED
```

**Fix Required:**
1. Add FAQ data to peptide frontmatter
2. Import FAQSchema in DossierLayout
3. Render FAQSchema with FAQ data

**Example FAQ data structure:**
```yaml
faqs:
  - question: "What is BPC-157?"
    answer: "BPC-157 is a synthetic pentadecapeptide derived from human gastric juice protein, studied primarily in animal models for tissue repair properties."
  - question: "Is BPC-157 FDA approved?"
    answer: "No, BPC-157 is not FDA approved. It has investigational new drug (IND) status for specific clinical trials but is not approved for general medical use."
```

### HowTo Schema (NOT IMPLEMENTED)

**Target:** Calculator pages

**Proposed component:**
```astro
// HowToSchema.astro
interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface Props {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
}
```

**Example for Reconstitution Calculator:**
```json
{
  "@type": "HowTo",
  "name": "How to Calculate Peptide Reconstitution",
  "description": "Calculate peptide concentration and syringe draw volume for reconstitution",
  "step": [
    {"@type": "HowToStep", "name": "Enter peptide amount", "text": "Input the total mg in your vial"},
    {"@type": "HowToStep", "name": "Enter water volume", "text": "Input mL of bacteriostatic water to add"},
    {"@type": "HowToStep", "name": "Enter desired dose", "text": "Input your target dose in mcg"},
    {"@type": "HowToStep", "name": "View results", "text": "Calculator shows concentration and syringe units to draw"}
  ]
}
```

### Drug Schema (NOT IMPLEMENTED)

**Target:** All peptide dossier pages

**Proposed component:**
```astro
// DrugSchema.astro
interface Props {
  name: string;
  alternateName: string[];
  description: string;
  drugClass: string;
  mechanismOfAction?: string;
  clinicalPharmacology?: string;
  legalStatus?: string;
}
```

**Fields to include:**
- `name`, `alternateName` (from frontmatter)
- `description` (summary)
- `drugClass`: "Peptide"
- `mechanismOfAction` (from content)
- `clinicalPharmacology` (from evidenceChainedBenefits)

**Fields to EXCLUDE (per PEPCODEX-ADAPTATIONS.md):**
- `administrationRoute`
- `dosageForm`
- `doseSchedule`
- `maximumIntake`
- `recommendedIntake`

---

# SERP FEATURE OPTIMIZATION AUDIT

## Featured Snippet Optimization

| Query Type | Current Optimization | Status |
|------------|---------------------|--------|
| "What is [peptide]" | Implicit in summary | ⚠️ NOT EXPLICIT |
| "How does [peptide] work" | In mechanism section | ⚠️ NOT STRUCTURED |
| "[A] vs [B]" | Comparison tables exist | ✅ PARTIAL |
| "Benefits of [peptide]" | In evidenceChainedBenefits | ⚠️ NOT LIST FORMAT |

### Snippet Optimization Requirements

**For paragraph snippets (definitions):**
- Add explicit "## What is [Peptide Name]?" H2 immediately after overview
- Follow with 40-60 word definition starting with "[Peptide] is..."
- Current: Relies on summary field, not structured as H2 + answer

**For list snippets (benefits):**
- Add "## Research Findings" or "## Studied Effects" H2
- Follow immediately with bulleted list
- Current: Benefits buried in evidenceChainedBenefits component, not scannable

**For table snippets (comparisons):**
- ✅ ComparisonLayout already has comparison tables
- Need to ensure table is immediately after H2 with "vs" or "comparison"

## People Also Ask (PAA) Coverage

| Topic | Common PAA Questions | Current Coverage |
|-------|---------------------|------------------|
| BPC-157 | "Is BPC-157 safe?" | ⚠️ In SafetyBanner, not FAQ |
| BPC-157 | "What does BPC-157 do?" | ⚠️ In summary, not FAQ |
| BPC-157 | "Is BPC-157 FDA approved?" | ✅ In FDA notice, SafetyBanner |
| Semaglutide | "How much weight can you lose?" | ❌ Not covered (dosing-adjacent) |
| General | "Are peptides safe?" | ✅ Full guide exists |

### PAA Action Items
1. Add FAQ sections to peptide pages with exact PAA questions
2. Use FAQSchema markup for rich results
3. Keep answers to 2-3 sentences, cite evidence grade

---

# COMPETITOR WEAKNESS EXPLOITATION STATUS

## Evidence Grading (DIFFERENTIATOR)

| Weakness | Pepcodex Implementation | Status |
|----------|------------------------|--------|
| No evidence grading | EvidenceBadge on all dossiers | ✅ STRONG |
| Grades in meta descriptions | Implicit in some | ⚠️ INCONSISTENT |
| Evidence comparison tables | In ComparisonLayout | ✅ PARTIAL |

**Action:** Add evidence grade to all meta descriptions
- Current: "Evidence review of BPC-157..."
- Target: "BPC-157 Research (Low Evidence) | Evidence review..."

## Study Type Labeling (DIFFERENTIATOR)

| Feature | Implementation | Status |
|---------|---------------|--------|
| "(in animal models)" labels | In evidenceChainedBenefits | ✅ |
| "(in human trials)" labels | In evidenceChainedBenefits | ✅ |
| Study breakdown counts | sources.human/preclinical | ✅ |

**Status:** ✅ FULLY IMPLEMENTED

## Methodology Transparency

| Feature | Implementation | Status |
|---------|---------------|--------|
| Methodology page | `/methodology` | ✅ COMPREHENSIVE |
| Link from every dossier | In Methodology Note section | ✅ |
| Evidence grading explained | On methodology page | ✅ |

**Status:** ✅ FULLY IMPLEMENTED

## Author Credentials

| Feature | Implementation | Status |
|---------|---------------|--------|
| Editorial team page | `/editorial-policy` | ✅ |
| Credentials displayed | Limited | ⚠️ |
| Medical review badges | Not implemented | ❌ |

**Action:** Enhance editorial policy with specific credentials if available

## Publication Bias Acknowledgment

| Feature | Implementation | Status |
|---------|---------------|--------|
| "Research Limitations" section | Not explicit | ⚠️ |
| Publication bias noted | Partial | ⚠️ |

**Action:** Add explicit limitations section to dossier template noting:
- Publication bias in peptide literature
- Predominance of animal studies
- Limited long-term human safety data

---

# PRIORITY ACTION MATRIX

## Tier 1: Quick Wins (Low Effort, High Impact)

| Action | Effort | Impact | Blocker |
|--------|--------|--------|---------|
| Deploy FAQs to peptide pages | 2-4 hours | HIGH | Need FAQ content |
| Add evidence grade to meta descriptions | 1 hour | MEDIUM | None |
| Create HowToSchema component | 30 min | MEDIUM | None |
| Deploy HowTo to calculators | 1 hour | MEDIUM | HowToSchema |

## Tier 2: URL Multiplication (Medium Effort, High Impact)

| Action | Effort | Impact | Blocker |
|--------|--------|--------|---------|
| Create 55 more comparison pages | 6-8 hours | HIGH | Template exists |
| Create condition page template | 3 hours | HIGH | None |
| Generate 15 condition pages | 6 hours | HIGH | Template |
| Calculator URL parameter routing | 4 hours | MEDIUM | Routing logic |

## Tier 3: Schema Completeness (Medium Effort, Medium Impact)

| Action | Effort | Impact | Blocker |
|--------|--------|--------|---------|
| Create DrugSchema component | 45 min | MEDIUM | None |
| Deploy Drug schema to all peptides | 2 hours | MEDIUM | DrugSchema |
| Create MedicalWebPage schema | 30 min | LOW | None |

## Tier 4: Content Structure (Higher Effort)

| Action | Effort | Impact | Blocker |
|--------|--------|--------|---------|
| Create subpage system | 8 hours | HIGH | Route architecture |
| Generate 100 subpages | 4 hours | HIGH | Subpage system |
| Add limitations section to template | 1 hour | MEDIUM | None |

---

# IMPLEMENTATION SEQUENCE

## Week 1: Foundation
1. Create FAQ content for top 20 peptides
2. Deploy FAQSchema to DossierLayout
3. Create HowToSchema component
4. Deploy HowTo to calculator pages

## Week 2: Schema & Meta
1. Create DrugSchema component
2. Deploy Drug schema to all dossiers
3. Update all meta descriptions with evidence grades
4. Add limitations section to template

## Week 3: URL Expansion
1. Generate 55 more comparison pages
2. Create condition page template
3. Generate 10 condition pages
4. Implement calculator URL routing

## Week 4: Subpages
1. Create subpage routing system
2. Create research-summary template
3. Generate 50 research summary subpages
4. Create related-research template

---

# SUCCESS METRICS

## SERP Feature Targets (90 days)

| Metric | Current | Target | Method |
|--------|---------|--------|--------|
| FAQ rich results | 0 | 20+ | FAQSchema deployment |
| HowTo rich results | 0 | 3 | Calculator HowTo |
| Featured snippets | Unknown | 10+ | Content restructuring |
| Pages with Drug schema | 0 | 72 | DrugSchema deployment |

## URL Count Targets (90 days)

| Content Type | Current | Target | Delta |
|--------------|---------|--------|-------|
| Comparison pages | 45 | 100 | +55 |
| Condition pages | 0 | 15 | +15 |
| Subpages | 0 | 100 | +100 |
| Calculator URLs | 3 | 50 | +47 |
| **Total indexed** | ~338 | ~600 | +262 |

---

# APPENDIX: COMPONENT SPECIFICATIONS

## FAQSchema Integration

**File to modify:** `src/layouts/DossierLayout.astro`

```astro
// Add import
import FAQSchema from '../components/SEO/FAQSchema.astro';

// Add to Props interface
faqs?: Array<{ question: string; answer: string }>;

// Add to schema rendering
{faqs && faqs.length > 0 && <FAQSchema items={faqs} />}
```

## FAQ Content Template

For each peptide, create 5 standard FAQs:
1. "What is [Peptide Name]?" - Definition + evidence grade
2. "Is [Peptide Name] safe?" - Link to safety profile
3. "Is [Peptide Name] FDA approved?" - Regulatory status
4. "What research exists on [Peptide Name]?" - Study count summary
5. "How does [Peptide Name] work?" - Mechanism summary

---

*Gap & SERP Feature Audit Complete | Generated 2026-02-01*
