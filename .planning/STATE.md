# Project State: PepCodex

## Current Phase

**v5.0 Hardening & Enhancement** — COMPLETE

## Active Work

### v5.0 Hardening & Enhancement

**Strategy:** Fix quality scorecard from 62.5% → 75% by addressing security (BLOCKER), performance, and accessibility, then ship deferred UX features.

**Informed by:** Full Studio Pipeline Evaluation (2026-02-12)
**Artifacts:** `.planning/studio/` (8 evaluation reports)

### v5.0 Phase Execution Order

| Phase | Focus | Scorecard Impact | Status |
|-------|-------|------------------|--------|
| A | Security Hardening | Security 1→3 (+2) | COMPLETE |
| B | Performance Optimization | Performance 2→3 (+1) | COMPLETE |
| C | Accessibility Fixes | Accessibility 2→3 (+1) | COMPLETE |
| D | Navigation & UX | Usability 3→4 (+1) | COMPLETE |
| E | Content Quality | Content consistency | COMPLETE |
| F | Feature Enhancements | Clinics 10→52 | COMPLETE |

**Minimum viable v5.0:** Phases A + B + C (brings scorecard to 75%)

### v4.0 Content Expansion (COMPLETE)

| Phase | Focus | Pages Added | Status |
|-------|-------|-------------|--------|
| 23 | Comparisons Batch 1 + Condition Hubs | +70 | COMPLETE |
| 24 | Schema Deployments | +0 (enhancement) | COMPLETE |
| 25 | Glossary Expansion | +116 | COMPLETE |
| 26 | Bioregulators Batch 1 | +11 | COMPLETE |
| 27 | Bioregulators Batch 2 | +10 | COMPLETE |
| 28 | Weekly News Blog | +78 | COMPLETE |
| 28.1 | QA Audit (Dossiers + Comparisons) | +0 (quality fix) | COMPLETE |
| 29 | Comparisons Batch 2 + Calculators | +323 | COMPLETE |

## What's Done

### v1.0 Content Foundation (COMPLETE)
- Phase 1: Site Foundation ✓
- Phase 2: Content Templates ✓
- Phase 3: Pipeline Infrastructure ✓
- Phase 4: Features + Polish ✓
- Phase 5: First Content Batch ✓ (188 pages indexed)

### v2.0 Production Launch (COMPLETE)
- Phase 6: Deploy Infrastructure ✓
  - GitHub repo: mancinicreative/pepcodex
  - Vercel project: mancinicreative-pepcodex
  - Live at: https://pepcodex.com
  - Beehiiv newsletter integration working
  - develop branch created for staging
- Phase 7: Analytics Setup ✓
  - GA4 tracking: G-1M56CNL8CK
  - Google Search Console verified
  - Sitemap submitted
- Phase 8: Production Verification — Partial (can be completed during v4.0)

### v3.0 Operations & Growth (ON HOLD)
*Paused to prioritize v4.0 content expansion.*
- Phase 9-12: Operations, Content, Distribution, Monetization — On Hold

### v4.0 Content Expansion (IN PROGRESS)

**Phase 23: Comparisons Batch 1 + Condition Hubs ✓ COMPLETE**
- ✓ ConditionLayout.astro template created
- ✓ conditions content collection added to config.ts
- ✓ /conditions/ routing (index + [slug])
- ✓ 15 condition hub pages created
  - weight-loss, fat-loss, muscle-growth (metabolic)
  - healing, injury-recovery, joint-pain, skin, hair-growth, gut-health (repair-recovery)
  - anti-aging, longevity (longevity)
  - cognition, sleep (cognitive)
  - inflammation, immune-support (immune)
- ✓ 55 new high-priority comparison pages
  - GLP-1: 10 comparisons (survodutide, mazdutide, cagrilintide, amycretin, etc.)
  - Growth Hormone: 10 comparisons (tesamorelin, ghrp-2, hexarelin, cjc-1295, etc.)
  - Healing: 5 comparisons (bpc-157, tb-500, ghk variants)
  - Cognitive: 5 comparisons (semax, selank, dihexa, cortexin)
  - Bioregulators: 5 comparisons (epithalon, thymalin, thymogen)
  - Longevity: 5 comparisons (mots-c, humanin, ss-31, foxo4-dri)
  - Metabolic: 5 comparisons (5-amino-1mq, aod-9604, liraglutide)
  - Immune: 5 comparisons (thymosin-alpha-1, ll-37, thymulin)
  - Additional: 5 comparisons (pt-141, dsip, pasireotide, hcg, glutathione)
- Total comparisons: 45 → 100 (+55)

**Phase 24: Schema Deployments ✓ COMPLETE**
- ✓ FAQSchema deployed to top 20 peptide dossiers
- ✓ HowToSchema component created
- ✓ HowToSchema deployed to 3 calculators (reconstitution, blend, accumulation)
- ✓ DrugSchema component created
- ✓ DrugSchema deployed to all dossiers via DossierLayout
- ✓ FAQSchema support added to ComparisonLayout
- ✓ FAQs added to 20 high-traffic comparison pages

**Phase 25: Glossary Expansion ✓ COMPLETE**
- ✓ 116 new glossary terms added (99 → 215 total)
  - 40 mechanism terms (receptor types, signaling, pharmacology)
  - 20 study type terms (RCTs, meta-analysis, clinical trials)
  - 30 administration terms (PK/PD, dosing, injection)
  - 20 regulatory terms (FDA, IND, NDA, approvals)
  - 31 chemistry terms (structure, synthesis, modifications)
- ✓ 34 existing terms updated with improved content
- ✓ MDX syntax issues fixed (< and > symbols in tables)

**Phase 26: Bioregulators Batch 1 ✓ COMPLETE**
- ✓ 10 new bioregulator dossiers created
  - Synthetic tripeptides: vilon (KE), livagen (KED), vesugen (KED), cardiogen (AED), kristagen (EDG), chonluten (EDG), bronchogen (AEDL), testagen
  - Tissue extract complexes: prostatilen, retinalamin
- ✓ /bioregulators landing page with sequence reference table
- Total peptide dossiers: 72 → 82 (+10)

**Phase 27: Bioregulators Batch 2 ✓ COMPLETE**
- ✓ 10 more bioregulator dossiers created
  - Synthetic tripeptides: ovagen (EDL), pancragen (KEDW), stamakort
  - Cytamin supplements: vladonix, endoluten, cerluten, ventfort, svetinorm, suprefort, sigumir
- ✓ Bioregulators landing page already had all entries configured
- Total peptide dossiers: 82 → 92 (+10)
- Complete Khavinson bioregulator module: 20 total (5 original + 15 new)

**Phase 28: Weekly News Blog ✓ COMPLETE**
- ✓ 78 backdated weekly news posts created (Aug 2025 → Jan 2026)
- ✓ 3 posts per week (Mon/Wed/Fri schedule)
- ✓ Topics cover: GLP-1 trials, FDA regulatory, biotech news, research breakthroughs
- ✓ All posts use weekly-briefing category with proper frontmatter
- Total blog posts: 73 → 151 (+78)

**Phase 28.1: QA Audit ✓ COMPLETE**
- ✓ Created `scripts/qa-evidence-audit.mjs` — audits all 92 dossier evidence levels
- ✓ Created `scripts/qa-comparison-audit.mjs` — cross-checks comparisons vs dossiers
- ✓ Created `scripts/fix-comparison-mismatches.mjs` — automated evidence table fixes
- ✓ 42 dossier evidence levels corrected (applied systematic criteria: FDA-approved=high, Phase 3+=high, Phase 2=moderate, human data thresholds)
- ✓ 37 comparison files fixed for evidence level mismatches
- ✓ 1 invalid comparison removed (aod-9604-vs-frag-176-191 — no matching dossier)

**Phase 29: Comparisons Batch 2 + Calculators ✓ COMPLETE**
- ✓ Fixed hardcoded peptideData bug in `src/pages/compare/[...slug].astro` — now uses `getCollection('peptides')` for all 92 peptides
- ✓ Created `scripts/generate-comparisons.mjs` — pair generation with category/comparator logic
- ✓ Created `scripts/backfill-comparison-faqs.mjs` — FAQ templating for existing comparisons
- ✓ Created `data/calculator-presets.json` — 50 peptide presets with reconstitution/blend/accumulation data
- ✓ 179 new comparison pages generated (100 → 279 total, 1 invalid removed)
- ✓ 79 existing comparisons backfilled with FAQs
- ✓ 3 dynamic calculator routes created:
  - `/calculator/reconstitution/[peptide].astro` (44 peptides)
  - `/calculator/blend/[peptide].astro` (50 peptides)
  - `/calculator/accumulation/[peptide].astro` (50 peptides)
- ✓ DossierLayout cross-linking updated:
  - Comparison links use collection lookup (both slug orderings)
  - Calculator links section added for presets
- ✓ Build passes with 0 errors
- Total comparisons: 100 → 279 (+179)
- Total calculator URLs: 3 → 147 (+144)

### Pre-existing Assets (v4.0)
- ✓ Calculators (reconstitution, blend, accumulation) — now with 144 peptide-specific routes
- ✓ Legal pages (disclaimer, privacy, terms)
- ✓ ComparisonLayout template
- ✓ FAQSchema component (deployed to all comparisons)
- ✓ 5 existing bioregulator dossiers (epithalon, thymalin, thymogen, cortexin, pinealon)

## What's Next

**v5.0 Phase A: Security Hardening** — BLOCKER items from studio evaluation.
**v6.0 Growth & Monetization** — PLANNED (PMF Analysis complete, all 4 phases planned).

See `.planning/ROADMAP.md` for full v5.0 + v6.0 phase breakdown.
See `.planning/studio/` for v5.0 evaluation reports.
See `.planning/PMF-ANALYSIS.md` for v6.0 market analysis.

### v6.0 Growth & Monetization (PLANNED)

| Phase | Focus | Requirements | Dependencies | Status |
|-------|-------|-------------|--------------|--------|
| 31 | Analytics & Traffic Intelligence | ANLY-01 to ANLY-07 (7) | v5.0 Phase A | PLANNED |
| 32 | Monetization Foundation | MONET-01 to MONET-10 (10) | Phase 31 | PLANNED |
| 33 | Regulatory Status Tracker | REG-01 to REG-09 (9) | None | PLANNED |
| 34 | Distribution & Growth | DIST-01 to DIST-10 (10) | Phases 31, 32 | PLANNED |

**Total v6.0 requirements:** 36
**PMF Score targets:** Monetization 2→6, Audience Reach 4→7, Brand Awareness 3→5

## Quality Scorecard (v5.0 Phase C Update)

| Dimension | Score | Phase 4 Min | Status |
|---|---|---|---|
| Functional | 3 | 3 | PASS |
| Performance | 3 | 3 | PASS (was 2 — FIXED in Phase B) |
| Usability | 4 | 3 | PASS (was 3 — improved in Phase D) |
| Accessibility | 3 | 3 | PASS (was 2 — FIXED) |
| Security | 3 | 3 | PASS (was 1 — FIXED in Phase A) |
| Reliability | 3 | 3 | PASS |
| Maintainability | 3 | 2 | PASS |
| UX/Polish | 3 | 3 | PASS |

**Overall: 25/32 = 78.1%** (was 75%)

## v5.0 Minimum Fixes to Pass

1. Security headers + rate limiting + health fix → Security 1→3
2. Static output + font preloading → Performance 2→3
3. Skip-link + prefers-reduced-motion + breadcrumbs → Accessibility 2→3

**Projected score after minimum fixes: 24/32 = 75%**

## Context for Resume

v4.0 Content Expansion milestone COMPLETE.

**Final State (v4.0 Complete):**
- ~1,048+ unique URLs (excluding peptide x condition cross-pages)
- 92 peptide dossiers (72 + 20 bioregulators) ✓
- 279 comparisons (45 + 55 Phase 23 + 179 Phase 29) ✓
- 215 glossary terms (99 + 116 new) ✓
- 15 condition hub pages ✓
- 1 bioregulators landing page (20 entries) ✓
- 151 blog posts (73 + 78 weekly news) ✓
- 147 calculator URLs (3 static + 144 dynamic) ✓
- Schema markup deployed (FAQSchema, HowToSchema, DrugSchema) ✓
- QA audit tools created for ongoing use ✓
- All dossier evidence levels systematically verified ✓

**Key Documents:**
- Plan: `C:\Users\manci\.claude\plans\piped-crunching-stardust.md`
- Requirements: `.planning/REQUIREMENTS.md`
- Roadmap: `.planning/ROADMAP.md`
- Bioregulator module spec: `style influence/Peptide-Glass/.../Pasted-BIOREGULATORS-MODULE-MUST-INCLUDE...`
- Research resources: `.planning/RESEARCH-LOG.md`, `.planning/CONTENT-BACKLOG.md`

## Progress

```
v1.0 Phases:
Phase 1: Site Foundation      [████████] 100%
Phase 2: Content Templates    [████████] 100%
Phase 3: Pipeline Infra       [████████] 100%
Phase 4: Features + Polish    [████████] 100%
Phase 5: First Content Batch  [████████] 100%

v2.0 Phases:
Phase 6: Deploy Infrastructure [████████] 100% ✓
Phase 7: Analytics Setup       [████████] 100% ✓
Phase 8: Production Verify     [░░░░░░░░] 0%  (partial)

v3.0 Phases (ON HOLD):
Phase 9-12: Operations         [░░░░░░░░] ON HOLD

v4.0 Phases (COMPLETE):
Phase 23: Comparisons + Hubs   [████████] 100% ✓
Phase 24: Schema Deployments   [████████] 100% ✓
Phase 25: Glossary Expansion   [████████] 100% ✓
Phase 26: Bioregulators 1      [████████] 100% ✓
Phase 27: Bioregulators 2      [████████] 100% ✓
Phase 28: Weekly News Blog     [████████] 100% ✓
Phase 28.1: QA Audit            [████████] 100% ✓
Phase 29: Comparisons + Calc   [████████] 100% ✓

v5.0 Phases (PLANNED):
Phase A: Security Hardening    [████████] 100% ✓
Phase B: Performance Optim.    [████████] 100% ✓
Phase C: Accessibility Fixes   [████████] 100% ✓
Phase D: Navigation & UX       [████████] 100% ✓
Phase E: Content Quality       [████████] 100% ✓
Phase F: Feature Enhancements  [████████] 100% ✓

v6.0 Phases (PLANNED):
Phase 31: Analytics & Traffic  [░░░░░░░░] 0%
Phase 32: Monetization Found.  [░░░░░░░░] 0%
Phase 33: Regulatory Tracker   [░░░░░░░░] 0%
Phase 34: Distribution Growth  [░░░░░░░░] 0%
```

**v4.0 CONTENT EXPANSION: COMPLETE**
**v5.0 HARDENING: COMPLETE (6 phases, all done)**
**v6.0 GROWTH & MONETIZATION: PLANNED (4 phases, 36 requirements)**

## Blockers

None

## Session Log

- 2026-01-19: v1.0 complete — 188 pages indexed
- 2026-01-26: v2.0 milestone started — production launch
- 2026-01-27: Phase 6 complete — site live at pepcodex.com
- 2026-01-27: Phase 7 complete — GA4 + Search Console configured
- 2026-01-27: v3.0 milestone started — operations & growth
- 2026-01-30: v3.0 paused — competitive analysis prioritized
- 2026-01-30: Competitive analysis complete (vs Peptide-db.com)
- 2026-01-30: v4.0 milestone initialized — competitive features focus
- 2026-02-01: v4.0 pivoted — content expansion over features
- 2026-02-01: GSD planning complete — 7 phases, 62 requirements
- 2026-02-01: Planning docs updated (PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md)
- 2026-02-01: Phase 23 COMPLETE — 55 comparisons + 15 condition hubs + ConditionLayout
- 2026-02-01: Phase 24 COMPLETE — Schema deployments (FAQSchema, HowToSchema, DrugSchema)
- 2026-02-01: Phase 25 COMPLETE — 116 new glossary terms (99 → 215 total)
- 2026-02-01: Phase 26 COMPLETE — 10 bioregulator dossiers + /bioregulators page
- 2026-02-02: Phase 27 COMPLETE — 10 more bioregulator dossiers (Ovagen→Sigumir), bioregulator module complete with 20 total
- 2026-02-02: Phase 28 COMPLETE — 78 weekly news blog posts (backdated Aug 2025 → Jan 2026)
- 2026-02-12: Phase 28.1 COMPLETE — QA audit: 42 dossier evidence levels corrected, 37 comparison files fixed, audit tooling created
- 2026-02-12: Phase 29 COMPLETE — 179 new comparisons, 144 calculator URLs, DossierLayout cross-linking, all FAQs backfilled
- 2026-02-12: v4.0 Content Expansion milestone COMPLETE — ~1,048+ unique URLs
- 2026-02-12: Full Studio Pipeline Evaluation COMPLETE — 8 artifacts in `.planning/studio/`
- 2026-02-12: Quality scorecard: 20/32 = 62.5% (Security BLOCKER at 1/4)
- 2026-02-12: v5.0 Roadmap written — 6 phases (A-F), 26 work items
- 2026-02-12: STATE.md updated for v5.0 kickoff
- 2026-02-12: PMF Analysis complete — PMF-ANALYSIS.md with market data, competitive landscape, gap analysis
- 2026-02-12: v6.0 Growth & Monetization planned — 4 phases (31-34), 36 requirements
- 2026-02-12: Phase directories created: 31-analytics-intelligence, 32-monetization-foundation, 33-regulatory-tracker, 34-distribution-growth
- 2026-02-12: RESEARCH.md and PLAN.md written for all 4 v6.0 phases
- 2026-02-12: Phase A COMPLETE — 5 security fixes, scorecard 62.5% → 68.75%
- 2026-02-12: Phase B COMPLETE — Static output, font preload, weight reduction, dead CSS removal, fixed getStaticPaths bugs in [category] and protocols/[slug]. Scorecard 68.75% → 71.9%. Build: 1,332 pages.
- 2026-02-12: Phase C COMPLETE — Skip-link, prefers-reduced-motion, breadcrumbs on all 9 layouts, aria-current on nav links, focus trap + ESC on mobile menu, slide-fade animation. Scorecard 71.9% → 75% TARGET REACHED.
- 2026-02-12: Phase D COMPLETE — Unified Cmd+K to SearchModal, added Protocols + Bioregulators to Research dropdown, all 7 categories on homepage, dynamic homepage stats from collections. Scorecard 75% → 78.1%.
- 2026-02-12: ROADMAP.md updated — v6.0 replaces deferred v3.0 placeholder with PMF-informed phases
- 2026-02-12: REQUIREMENTS.md updated — 36 new v6 requirements (ANLY, MONET, REG, DIST)
- 2026-02-12: PROJECT.md updated — current milestone v5.0, next milestone v6.0
- 2026-02-12: v5.0 Phase A COMPLETE — 5 security fixes: CSP/HSTS/security headers, rate limiting (5/min/IP), health endpoint sanitized, CORS restricted to pepcodex.com, honeypot bot protection on newsletter forms
- 2026-02-12: Phase E COMPLETE — Cross-link validator upgraded (3 severity levels, 0 structural errors in 3,683 refs), safety articles expanded 11→31 (+20 new covering top peptides). Evidence scales already unified, glossary auto-linking already active.
- 2026-02-12: Phase F COMPLETE — Clinics expanded 10→52 (+42 across US cities). Content migration skipped (separate collections are a feature). Protocol expansion skipped (not part of site direction). Related peptides + blog nav already implemented.
- 2026-02-12: v5.0 HARDENING MILESTONE COMPLETE — Scorecard 62.5% → 78.1%. All 6 phases (A-F) done.

---
*Last updated: 2026-02-12*
