# Project State: PepCodex

## Current Phase

**Phase 29: Comparisons Batch 2 + Calculators** — ✓ COMPLETE (v4.0 Content Expansion COMPLETE)

## Active Work

### v4.0 Content Expansion

**Strategy:** Scale from ~593 to ~1,132 high-quality indexable pages through:
1. 235 new comparison pages (+URL multiplication)
2. 20 bioregulator dossiers (+niche authority)
3. 78 weekly news blog posts (+fresh content)
4. 141 glossary terms (+authority signals)
5. 15 condition hub pages (+topic coverage)
6. 50 calculator dynamic routes (+utility SEO)
7. Schema deployments (+SERP features)

### Phase Execution Order

| Phase | Focus | Pages Added | Status |
|-------|-------|-------------|--------|
| 23 | Comparisons Batch 1 + Condition Hubs | +70 | ✓ COMPLETE |
| 24 | Schema Deployments | +0 (enhancement) | ✓ COMPLETE |
| 25 | Glossary Expansion | +116 | ✓ COMPLETE |
| 26 | Bioregulators Batch 1 | +11 | ✓ COMPLETE |
| 27 | Bioregulators Batch 2 | +10 | ✓ COMPLETE |
| 28 | Weekly News Blog | +78 | ✓ COMPLETE |
| 28.1 | QA Audit (Dossiers + Comparisons) | +0 (quality fix) | ✓ COMPLETE |
| 29 | Comparisons Batch 2 + Calculators | +323 | ✓ COMPLETE |

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

v4.0 Content Expansion is COMPLETE. Next milestone: v5.0 Feature Enhancement.

## Cut List (Deferred to v5.0)

Per content expansion pivot decision:
- **Peptide interactions matrix** — Defer to v5.0
- **Dossier UX overhaul** — Defer to v5.0
- **Content migration (guides/safety → blog)** — Defer to v5.0
- **Multi-peptide protocols** — Defer to v5.0
- **City pages (location SEO)** — Defer to v5.0
- **Community features** — Defer to v5.0

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

v4.0 Phases (ACTIVE):
Phase 23: Comparisons + Hubs   [████████] 100% ✓
Phase 24: Schema Deployments   [████████] 100% ✓
Phase 25: Glossary Expansion   [████████] 100% ✓
Phase 26: Bioregulators 1      [████████] 100% ✓
Phase 27: Bioregulators 2      [████████] 100% ✓
Phase 28: Weekly News Blog     [████████] 100% ✓
Phase 28.1: QA Audit            [████████] 100% ✓
Phase 29: Comparisons + Calc   [████████] 100% ✓
```

**v4.0 CONTENT EXPANSION: COMPLETE**

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

---
*Last updated: 2026-02-12*
