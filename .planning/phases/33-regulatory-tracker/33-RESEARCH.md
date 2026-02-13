# Phase 33: Regulatory Status Tracker — Research

## Purpose

Create a unique, high-value regulatory content feature that no competitor offers. The FDA compounding crackdown and GLP-1 regulatory changes have created massive consumer confusion. A real-time regulatory tracker positions PepCodex as the definitive source for "what's actually legal."

## Market Context

### The Regulatory Confusion Problem
- **FDA compounding crackdown** (Jan 2025+): Banned compounding of tirzepatide, restricted semaglutide compounding, created exemptions and exceptions that confuse consumers
- **State-by-state variation**: Some states allow compounding that the FDA restricts at federal level
- **Patent cliff approaching**: Semaglutide (Ozempic) patents start expiring 2031-2032, but formulation patents extend further
- **New approvals pipeline**: Orforglipron, survodutide, amycretin all in late-stage trials
- **Generic launches**: Liraglutide generic (Aug 2025) showed appetite for affordable alternatives
- **Consumer frustration**: "The FDA ban stuff is so confusing — what's actually legal?"

### Why No Competitor Has This
- Peptides.org: Vendor-focused, not regulatory
- AllAboutPeptides: Clinical content only
- Peptide Initiative: Database but no regulatory layer
- WebMD/Healthline: Generic, no peptide-specific regulatory tracking
- Examine.com: Supplements, not therapeutics/regulatory

### Viral/Share Potential
- Health journalists need a single source for peptide regulatory status
- Clinic newsletters would link to/embed a regulatory tracker
- Reddit communities constantly ask "is X still legal to compound?"
- Social media content: "Here's the current FDA status of every popular peptide"

## Regulatory Status Categories

### Approval Status (per peptide)
| Status | Description | Example |
|--------|------------|---------|
| **FDA Approved** | Full NDA/BLA approval for specific indication | Semaglutide (Ozempic, Wegovy) |
| **FDA Pipeline** | In active clinical trials (Phase 1-3) | Orforglipron, survodutide |
| **Research Only** | No FDA pathway initiated, animal/in-vitro data only | BPC-157, TB-500 |
| **Off-Label** | Approved for one indication, used for others | Tesamorelin (lipodystrophy → anti-aging) |
| **Withdrawn/Restricted** | Previously available, now restricted | — |

### Compounding Status (per peptide)
| Status | Description |
|--------|------------|
| **Compounding Allowed** | On FDA compounding list, 503A/503B pharmacies can produce |
| **Compounding Restricted** | FDA has restricted or banned compounding |
| **Compounding Uncertain** | Regulatory status unclear or in litigation |
| **Not Applicable** | Never compounded (approved generics available) |
| **State Variation** | Federal restriction but some states allow |

### Patent Status
| Field | Purpose |
|-------|---------|
| **Primary Patent Expiry** | When base compound patent expires |
| **Formulation Patent** | Extended protection for delivery method |
| **Biosimilar Eligibility** | When biosimilar/generic competition expected |

## Data Schema (Proposed)

```yaml
# Content collection: regulatory-status
schema:
  peptide_slug: string          # links to peptide dossier
  fda_status: enum              # approved | pipeline | research_only | off_label | restricted
  fda_indication: string[]      # approved indications
  fda_approval_date: date       # NDA/BLA approval date
  nda_number: string            # FDA NDA/BLA number
  compounding_status: enum      # allowed | restricted | uncertain | not_applicable | state_variation
  compounding_notes: string     # explanation of current status
  compounding_updated: date     # last verified date
  patent_expiry: date           # primary patent expiration
  formulation_patents: string[] # formulation/delivery patents
  biosimilar_date: date         # expected biosimilar eligibility
  trial_phase: enum             # phase_1 | phase_2 | phase_3 | approved | none
  trial_ids: string[]           # ClinicalTrials.gov NCT numbers
  expected_decision: date       # expected FDA decision date (for pipeline)
  last_verified: date           # when this data was last verified
  sources: source[]             # regulatory sources (FDA letters, press releases)
```

## Initial Data Population (92 Peptides)

### FDA Approved (estimate: ~15 peptides)
- Semaglutide (Ozempic, Wegovy, Rybelsus)
- Tirzepatide (Mounjaro, Zepbound)
- Liraglutide (Victoza, Saxenda — generic available)
- Tesamorelin (Egrifta)
- Exenatide (Byetta, Bydureon)
- Octreotide (Sandostatin)
- Pasireotide (Signifor)
- Lanreotide (Somatuline)
- And others in dossier collection

### FDA Pipeline (estimate: ~8-10 peptides)
- Orforglipron (Eli Lilly — expected Q2 2026)
- Survodutide (Boehringer Ingelheim)
- Amycretin (Novo Nordisk)
- Mazdutide (Innovent Biologics)
- Cagrilintide (Novo Nordisk)
- Retatrutide (Eli Lilly)

### Research Only (estimate: ~60+ peptides)
- BPC-157, TB-500, GHK-Cu, Epithalon, Thymosin Alpha-1
- All bioregulators (20 Khavinson peptides)
- Most cognitive peptides (Semax, Selank, Dihexa)
- Most longevity peptides (MOTS-c, Humanin, SS-31)

## Page Designs (Conceptual)

### /regulatory-tracker (Main Page)
- Filterable table: peptide name, FDA status, compounding status, last updated
- Color-coded status badges (green=approved, yellow=pipeline, gray=research, red=restricted)
- Sort by: name, status, last updated, category
- Filter by: status, category, compounding status

### /regulatory-tracker/pipeline (FDA Pipeline Page)
- Timeline view of peptides in clinical trials
- Expected decision dates
- Trial progress (Phase 1 → 2 → 3 → NDA → Decision)
- Links to ClinicalTrials.gov entries

### DossierLayout Regulatory Badge
- Small badge next to evidence badge on each dossier
- Shows FDA status + compounding status at a glance
- Links to full regulatory details

## Implementation Approach

### Option A: Content Collection (Recommended)
- New `regulatory-status` collection in `src/content/config.ts`
- MDX files per peptide with regulatory frontmatter
- Static pages at build time (Astro SSG)
- Pros: Consistent with existing architecture, version controlled
- Cons: Manual updates needed

### Option B: Data File + Dynamic Pages
- JSON/YAML data file with all regulatory statuses
- Dynamic page generation from data
- Pros: Easier to update programmatically
- Cons: Less rich content per entry

**Recommendation**: Option A with a JSON index for the tracker table. Content collection for rich pages, data file for the filterable table view.

## Dependencies

- None — this phase can run in parallel with phases 31-32
- Enhances DossierLayout (built in v1.0-v4.0)
- Uses existing content collection patterns

## References

- PMF Analysis: `.planning/PMF-ANALYSIS.md` (Gap Analysis, Information Crisis sections)
- FDA compounding rules: peptide-drug-summit.com
- ClinicalTrials.gov API for trial status
- FDA Orange Book for patent data
- Existing dossier collection: `src/content/peptides/`

---
*Created: 2026-02-12*
