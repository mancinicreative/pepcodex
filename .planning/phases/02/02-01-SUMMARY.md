---
phase: 02-content-templates
plan: 01
subsystem: templates
tags: [astro, mdx, layouts, templates, content]
dependency-graph:
  requires: [01-site-foundation]
  provides: [dossier-layout-12-section, comparison-layout, guide-layout, safety-layout, dynamic-routes]
  affects: [content-pipeline, qa-gates]
tech-stack:
  added: []
  patterns: [12-section-dossier, side-by-side-comparison, educational-guide, safety-focused-layout]
key-files:
  created:
    - src/layouts/ComparisonLayout.astro
    - src/layouts/GuideLayout.astro
    - src/layouts/SafetyLayout.astro
    - src/content/comparisons/tirzepatide-vs-semaglutide.mdx
    - src/content/guides/what-is-tirzepatide.mdx
    - src/content/safety/glp1-safety-overview.mdx
    - src/pages/compare/[...slug].astro
    - src/pages/guide/[...slug].astro
    - src/pages/safety/[...slug].astro
  modified:
    - src/layouts/DossierLayout.astro
    - src/content/peptides/tirzepatide.mdx
decisions:
  - decision: "12-section dossier structure"
    date: 2026-01-19
    rationale: "Matches Prompt A requirements for comprehensive peptide coverage"
  - decision: "Scroll-based section highlighting"
    date: 2026-01-19
    rationale: "Improves navigation UX on long dossier pages"
  - decision: "Side-by-side comparison layout"
    date: 2026-01-19
    rationale: "Allows direct visual comparison of peptide properties"
  - decision: "Amber color accent for safety pages"
    date: 2026-01-19
    rationale: "Visual differentiation for safety-critical content"
metrics:
  duration: "~15 minutes"
  completed: 2026-01-19
---

# Phase 2 Plan 01: Content Templates Summary

**One-liner:** Four complete layout templates (Dossier/Comparison/Guide/Safety) with 12-section navigation, dynamic routes, and sample content for each type.

## What Was Built

### Task 1: Enhanced DossierLayout (12-Section Structure)
- **DossierLayout.astro:** Added sidebar section navigation for all 12 sections
- **Scroll-based highlighting:** IntersectionObserver highlights current section
- **Methodology Note:** Auto-included at bottom with GRADE explanation
- **Related Peptides:** Sidebar section for peptide links
- **Props extended:** Added `pharmacokinetics` and `relatedPeptides` optional props
- **tirzepatide.mdx:** Restructured with all 12 sections:
  1. Overview
  2. Mechanism of Action
  3. Research Summary
  4. Key Human Trials
  5. Preclinical Evidence
  6. Safety Profile
  7. Pharmacokinetics
  8. Regulatory Status
  9. Related Peptides
  10. Current Research Directions
  11. Citation Table
  12. Methodology Note

### Task 2: ComparisonLayout
- **ComparisonLayout.astro:** Side-by-side peptide comparison display
- **Header cards:** Each peptide with evidence badge and dossier link
- **Responsive:** Two-column on desktop, stacked on mobile
- **Footer:** Links to both full dossiers
- **Sample content:** `tirzepatide-vs-semaglutide.mdx` with SURPASS-2 data
- **Dynamic route:** `/compare/[...slug].astro`

### Task 3: GuideLayout and SafetyLayout
- **GuideLayout.astro:** Clean educational layout for "What is X" pages
  - Narrower max-width for readability
  - TableOfContents sidebar
  - "View full dossier" link when peptide specified
  - Related content sidebar

- **SafetyLayout.astro:** Clinical trial safety information display
  - Prominent warning banner at top
  - Amber/warning color accents throughout
  - Related peptides sidebar
  - FDA MedWatch reporting reminder
  - Strong disclaimers

- **Sample content:**
  - `what-is-tirzepatide.mdx`: Beginner-friendly guide
  - `glp1-safety-overview.mdx`: Comprehensive safety data

- **Dynamic routes:**
  - `/guide/[...slug].astro`
  - `/safety/[...slug].astro`

## Commits

| Hash | Description | Files |
|------|-------------|-------|
| (prior) | DossierLayout 12-section structure | Already in repo |
| d47e79d | ComparisonLayout and sample content | 3 files |
| 3d73a14 | GuideLayout, SafetyLayout, and sample content | 6 files |

## Verification Results

### Build Verification
```
npm run build - PASSED
14 pages built successfully:
- /peptides/tirzepatide/
- /compare/tirzepatide-vs-semaglutide/
- /guide/what-is-tirzepatide/
- /safety/glp1-safety-overview/
+ 10 other existing pages
```

### Requirements Check
- [x] TMPL-01: Dossier has 12 sections with navigation
- [x] TMPL-02: Comparison renders side-by-side
- [x] TMPL-03: Guide works for "What is X" content
- [x] TMPL-04: Safety displays clinical trial info with warnings

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] MDX parsing error in comparison content**
- **Found during:** Task 2
- **Issue:** `<7%` in table was interpreted as JSX tag
- **Fix:** Changed to "below 7%" to avoid MDX parsing conflict
- **Files modified:** `tirzepatide-vs-semaglutide.mdx`

## Notes for Future Phases

1. **Content Pipeline Integration:** These layouts are ready to receive content from the n8n pipeline (Phase 3)
2. **QA Gates:** The 12-section structure provides clear validation points for content QA
3. **SEO:** All layouts include proper meta props; sitemap auto-generates
4. **Accessibility:** All layouts use semantic HTML and proper ARIA labels

## Next Phase Readiness

Phase 2 complete. Ready for:
- **Phase 3:** Pipeline Infrastructure (source packs, n8n workflows)
- **Content Creation:** Templates ready to accept new peptide dossiers
