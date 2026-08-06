# Project State: PepCodex

*Last updated: 2026-07-25*

## VERIFIED END STATE (2026-08-06) — every line from a re-run, not a claim

**Ledger: 2,019 / 2,019 live identifiers verified (100%)** — 1,102 PMID · 512 DOI · 405 NCT.
Each was fetched from its authority individually; `verification/ledger.json` holds the verdict and
the evidence. 5 fabricated NCTs are `retired`, not erased. The loop CONVERGED in one round after the
specialist agents added 84 new identifiers.

### The verification graph + loop (built this session)
- `verification/matchers.mjs` — one canonical implementation per matching decision (was reimplemented
  in eight scripts, each with its own bugs).
- `verification/fixtures.json` — **47 labelled cases, all real**: every `shouldFlag:false` is a case a
  matcher once got wrong and would have destroyed real data; every `shouldFlag:true` is a defect
  actually found.
- `scripts/verify-graph.mjs` — DAG over 5 layers. **Stage 1 self-tests the matchers and ABORTS the
  run if any fails**, because a checker that is not itself verified cannot verify anything. It did
  abort on first run, catching 4 weaknesses in `titlesAgree`.
- `scripts/verify-loop.mjs` — exhaustive, resumable, `--test-heal` proves the heal/learn machinery
  (6/6). Version-gated: bump `CHECK_VERSION` and every past verdict re-opens.

### Estimand class — real numbers, wrong estimand (passes every fact-check)
| Trial | site said | published | places fixed |
|---|---|---|---|
| SURMOUNT-1 | 22.5% | **20.9%** (PMID 35658024) | 28 |
| SURMOUNT-2 | 15.7% | **14.7%** (PMID 37385275) | 15 |
| SURMOUNT-3 | 26.6% / 24.3% | **−18.4%** from randomization (PMID 37840095) | 6 |
| REDEFINE-1 | 22.7% | **20.4%** (PMID 40544433) | 4 |
| ATTAIN-1 | 12.4% | **11.2%** (PMID 40960239) | 9 |

### Defects found by the specialists that I had missed
- **5 records carried TWO conflicting NCT ids** — introduced BY my own repair pass (structural fix
  wrote `nctId`, the id-normaliser had already run). Renderer reads `nctId || id`, so stale
  fabrications sat invisible. Resolved against the registry; `DUAL_IDENTIFIER` added to the gate.
- **4 identifiers pointing at the wrong paper**: `41985146` (an NEJM *correspondence letter*) for
  SURPASS-CVOT, `31530668` (a *Plasmodium* knockout paper) for PIONEER 2, `31168921` (estimands
  methodology) for PIONEER 1, `38049096` (LGBT healthcare access) for SURMOUNT-4.
- **`sources` did not exist on the comparisons/glossary/conditions schemas** — Zod stripped any
  citation written there. Plumbed end-to-end; 129 citations attached, zero trials left uncited.
- **survodutide had 5 NCTs stored twice**; `semaglutide NCT04777396` still titled FLOW when the
  registry says EVOKE, with FLOW-derived endpoints attached.

### Monthly refresh — executed with 3 specialist agents
37 high-signal papers (RCT/meta/systematic) filtered from 942, 204 trial records, 50 uncited pages.
Result: 24 findings added across 12 dossiers, 88 trials added + 19 fact-synced + **76 rejected as
wrong-drug** (Ebselen ≠ glutathione; HMG-CoA reductase ≠ hMG; p21/CDKN1A gene ≠ P21 peptide).

### Trial notation normalised (2026-08-06)
50 records in `trials[]` carried raw CT.gov enums (`ACTIVE_NOT_RECRUITING`, `PHASE3`, `NA`) that the
`/trials` page could not sort or count. Mapped via `scripts/normalize-trial-notation.mjs` using the
canonical `normStatus`/`normPhase`. Status-card coverage 338/350. **This surfaced a gate bug**:
`normFact` reduced `"N/A"` to `"/"` while `"NA"` became `"na"`, so two spellings of the same value
read as a contradiction — fixed.

## Previous end state (2026-07-25)

| Gate | Result |
|---|---|
| `qa-pmids --strict` | **PASS** — 1,084 PMIDs · 333 NCTs · 513 DOIs across 980 files |
| `qa-retractions --strict` | **PASS** — vs 29,530 retracted PMIDs / 60,092 DOIs |
| `qa:consistency` | **PASS** — 1,109 identifiers, 0 contradictions |
| `qa:dossiercites` | **565 / 565** verified (author + year vs PubMed) |
| `qa:trials` | **321 OK**, 0 fabricated (all 7 pack structures) |
| `qa:packcites` | **504 OK**, 7 manually-confirmed title variances |
| `qa:attached` | **249 / 249** blog identifiers verified |
| `qa:claims` | 2 residual flags, both legitimate (different trial arms) |
| **Build** | **`REAL_BUILD_EXIT=0`**, 1,220 pages, 0 errors |

**The retraction gate earned itself immediately.** Once scoped to all 980 files (it had been reading
682 PMIDs) it found PMID 34895470 / DOI `10.1016/S0140-6736(21)01640-8` — Shi Q et al., *Lancet*
2022, listed by PubMed as a **Retracted Publication** — cited as evidence in `semaglutide.json`.
That DOI contains parentheses, so it was ALSO invisible until the regex fix; the two bugs were
hiding each other. Removed; logged to `retracted-removed.json`.

**Still open (owner decisions, not verification gaps):**
1. **13 blog posts with zero verified sources** — invented compounds (`GHS-X`, `HP-5`, `AMP-247`),
   a "PREDICT-GLP study" of 4,200 patients, "PeptideGel Inc.". All have **zero inbound links**, so
   delete-with-301 is safe. List: `.planning/citation-audit/` + §"POSTS WITH ZERO VERIFIED SOURCES".
2. **50 files name a real trial with no citation** (`uncited-trial-claims.json`) — a link-up job
   using PMIDs the dossiers already carry, not new research.
3. **4-item full-text restore queue** (`FULLTEXT-RESTORE-QUEUE.md`) — figures withdrawn because the
   abstract could not confirm them and full text was paywalled.
4. Nothing committed yet.

## Phase 38b — Full fabrication sweep (2026-07-24)

Owner directive: "make sure all of the fabricated data is not there … come up with the system which
verifies all the information", ahead of directing app traffic to the site.

**Root cause.** `qa-pmids.mjs:14` hardcoded `src/content/peptides`, so `data/source-packs/` (which
RENDERS via `DossierLayout` + `/trials`) and `src/content/blog/` were never verified once. The same
enumeration mistake recurred twice more inside the packs — `sources[]` checked while `coreLibrary`'s
34 arrays were not, and `trials[]` checked while 6 other trial arrays were not. All three are now
structural walks; see `.claude/rules/lessons.md`.

**Verified end state** (every number from a re-run, not a claim):
- `qa-pmids --strict`: **PASS** — 1,035 PMIDs · 336 NCTs · 437 DOIs across **980 files** resolve
  (was: 102 files, and printing PASS while blind).
- Trial triage: **316 OK**, 0 fabricated (was 77 problem records incl. 21 wrong-drug NCTs).
- Pack citations: **504 OK / 512**; the 8 flagged are manually confirmed same-paper (truncated or
  translated titles).
- Internal consistency: **PASS** — 1,109 identifiers, 0 contradictions (1 advisory label variance).
- Dossiers were already clean: 541/565 keyFinding PMIDs passed author+year; the 24 suspects were
  matcher artefacts (diacritics, journal-in-author-field). The earlier 3-wave sweep held.

**What changed:** 10 fabricated NCTs repointed to the real trial, 19 scrambled titles corrected from
the registry, 14 unrecoverable trial records deleted, 159 poisoned `sources[]` records removed and 38
recovered, 150 `coreLibrary` citations repointed via `ecitmatch`, 36 unverifiable identifiers stripped
and flagged `verified:false`, 81 wrong trial facts + 41 wrong publication years reconciled to ground
truth, 1 blog post removed as wholly fabricated (redirect added).

**New tooling** (all dry-run by default): `qa-internal-consistency` (offline, now in `npm run check`),
`triage-trials`, `recover-ncts`, `apply-trial-repairs`, `normalize-trial-ids`, `verify-pack-citations`,
`fix-pack-citations`, `recover-deleted-citations`, `quarantine-unverified`, `reconcile-duplicates`,
`qa-fabrication-audit`.

**Open follow-ups:** worklists `sources-to-recite.json`, `corelibrary-to-recite.json`,
`orphaned-trial-names.json` list claims whose citation was removed and which need re-sourcing before
the +400-claim refresh.

### Phase 38c — Verification completed to 100% (2026-07-25)

| Surface | Verified |
|---|---|
| Dossier citations | **565 / 565** (author + year vs PubMed) |
| Pack trials (all 7 structures) | **321 OK · 0 fabricated** |
| Pack citations | 504 / 512; remaining 8 manually confirmed same-paper |
| Internal consistency | PASS — 1,109 identifiers, 0 contradictions |
| `qa-pmids --strict` | PASS — 1,035 PMIDs · 336 NCTs · 437 DOIs / 980 files |
| Build | `REAL_BUILD_EXIT=0`, 1,220 pages |

Closed out: tesamorelin's 3 "wrong drug" trials were an alias gap (it IS a GHRH 1-44 analog);
SURPASS J-mono/J-combo cross-referenced to NCT03861052/NCT03861039 so the gate can verify them;
5 remaining foreign-registry ids flagged `verified:false` rather than implied-checked; 7 misattributed
trials removed (petrelintide under cagrilintide, galantamine under cerebrolysin, generic GLP-1 trials
under semaglutide); lactoferricin Wakabayashi corrected 2014 → 1996.

**Four matcher bugs of my own, each of which manufactured false accusations:** surnames <3 chars
(Ng/Wu/Lu/El), `ø` not folded by NFD (Vilsbøll), years parsed out of trial codes (`TAK-861-2001`),
and compound names read as measurements (`MK-677` → "677"). Recorded in `.claude/rules/lessons.md`.

**New check — quantitative claims** (`verify-quantitative-claims.mjs`): 344 numeric claims tested
against the cited paper's abstract. Understands that "26% reduction" is a correct derivation of
HR 0.74, so it does not cry wolf. 8 items remain as a human review queue (deliberately not a build
gate — real figures often live only in full text).

### Phase 38d — Blog remediation + estimand sweep (2026-07-25)

Three specialist agents remediated 166 unverifiable blog `sources[]` entries across 65 posts; I then
audited what they and my own automation attached.

**My own auto-attach was wrong 63 times.** A 0.55 similarity threshold matched "Anxiolytic action of
Selank" to a paper on simulation fidelity in learning transfer. Repaired: 20 repointed to the correct
PMID, 32 identifiers stripped, 6 NCTs relabelled from the registry, 5 fabricated NCTs removed, 4
resolving-but-wrong-document DOIs handled (Wiley book *front matter*; a migraine review cited in a
sleep post). `audit-attached-identifiers.mjs` now re-checks every attached id.

**Gate bugs found and fixed:**
- `qa-retractions` scanned only `src/content/peptides` — 682 PMIDs — and reported PASS while
  `what-is-dihexa.mdx` cited PMID 25187433, **retracted for data integrity**. Now walks all 980 files
  (1,084 PMIDs · 514 DOIs) and fails closed when the dataset is unreachable.
- DOI regex `[^\s"')\]]+` truncated Elsevier/Lancet ids: `10.1016/S0140-6736(21)01324-6` →
  `10.1016/S0140-6736(21`, so a real citation was reported as fabricated. 47 such DOIs are cited.
- MDX broke on `P<0.001` (parsed as a JSX tag) — build exit 1, zero pages. 5 files escaped.

**Estimand sweep — a fabrication class that passes every fact-check.** Sponsor *efficacy estimands*
(modelled as if all adhered) were headlined where the published trial reported the
treatment-regimen/policy figure. Neither number is invented, so "did the trial say this?" passes:

| Trial | was | published | fixed |
|---|---|---|---|
| SURMOUNT-1 | 22.5% | **20.9%** (PMID 35658024) | 13 places / 8 files |
| REDEFINE-1 | 22.7% | **20.4%** (PMID 40544433) | 4 places / 3 files |
| ATTAIN-1 | 12.4% | **11.2%** (PMID 40960239) | 9 places / 2 files |

New offline gate `qa:claims` (`qa-claim-consistency.mjs`) compares the same named trial's *same
measure* across all 980 files. Measure-aware, so a placebo arm or responder rate is never compared
against a weight-loss figure.

### Monthly refresh workflow — built
`npm run research:scan -- --days 30` + `.planning/MONTHLY-REFRESH-WORKFLOW.md` (5 specialist agent
roles; Editorial may only cite what Evidence/Trials/Regulatory verified; Verifier never edits).
Discovery is deterministic so an agent can only choose among registry-fetched items — it cannot
recall a paper into existence. Relevance filtering was essential: unfiltered, `bronchogen` returned
60 papers on OX40-OX40L signalling and daptomycin pneumonia, and the alias `NASA` (N-Acetyl Selank
Amidate) matched a maser and a Mars paper.

## Current Phase

**v6.0 Phase 38 — Data Integrity, Scoring & Freshness** — citation-integrity sweep + two-axis scoring
COMPLETE on branch `feat/scoring-and-freshness` (off prod `main`). **Open decisions:** merge to Vercel
prod, and resume the loop-automation brainstorm.
*(Phase 36 PepTracker rebrand merged to prod earlier this session.)*

### Phase 38: Data Integrity, Scoring & Freshness (branch `feat/scoring-and-freshness`)

**Two-axis scoring rollout — COMPLETE.** All 102 dossiers carry a rubric-v2.4 `scoring:` block
(Evidence axis: RD .30 / Mech .20 / Plaus .20 / GC .15 / CE .15 → weighted overall + label; Effectiveness
axis: basis/score/confidence). `qa-scoring` (math) + `qa-pmids --strict` (PMID resolution) both in
prebuild and build-breaking.

**Citation-integrity sweep — COMPLETE (all 102 dossiers independently verified).** Every PMID checked for
topical+claim match (not just resolution); every NCT for drug-match. Fixed: wrong-drug NCTs (an HIV study,
a lactoferrin ICU study, an eye study cited as drug trials), invented trial names presenting unpublished
"Phase 3 results" as fact, inflated efficacy numbers, copy-paste contamination (regulatory notes/aliases
from the wrong drug), claims pinned to non-supporting papers. Khavinson bioregulators verified clean.

| Step | Commit |
|------|--------|
| Render guard `src/utils/citation.ts` (NCT→CT.gov, N/A→no link) + oveporexton/alixorexton; qa-pmids placeholder worklist | 8a3098b |
| Citation wave 1 — 14 NCT-bearing dossiers | d343ee4 |
| Citation wave 2 — 44 (A–M) | 03577c7 |
| Citation wave 3 — 44 (M–V) | ab6a19d |
| Score reconciliation — 41 evidence-changed dossiers triaged; 2 effectiveness scores adjusted | 138ffa0 |

- **Score reconciliation:** of 41 evidence-changed dossiers, 39 held; 2 moved (cagrilintide effectiveness
  93→84 after REDEFINE-1 corrected from fabricated head-to-head to placebo-controlled; evx-01 effectiveness
  58→55 after CR 25%→17%). Scores were robust because the scoring agents had already discounted most
  fabrications (e.g. oveporexton's fake Phase 3 was never credited).
- **Loop-automation portfolio:** design space mapped in
  `.planning/phases/38-data-freshness/LOOP-DESIGN-SPACE.md` (13 candidate loops, grounded in
  `.planning/RESEARCHER-CRITERIA.md` + `RESEARCH-RESOURCES.md`). Brainstorm PARKED pending owner's
  V1-thrust decision. Specs: `AUTOMATION-STRATEGY.md`, `DAILY-BRIEFING-LOOP.md`.

---

### (history) Phase 36: PepTracker Brand Re-skin (branch `feat/peptracker-rebrand`)

## Active Work

### Phase 36: PepTracker Brand Re-skin (branch `feat/peptracker-rebrand`)

**Goal:** Re-skin the entire site from dark glassmorphism → the PepTracker "specimen catalogue"
brand (cream paper, warm ink, single cobalt accent, five signals, Newsreader/Geist/Geist Mono,
vial motifs, editorial Vol./plates/drawers/specimen-sheet language).
**Plan:** `.planning/phases/36-peptracker-rebrand/PLAN.md`
**Source:** PepTracker Brand System v3 + PepCodex Home/Dossier mockups (refs in `.design-refs/`).

| Chunk | Focus | Commit | Status |
|-------|-------|--------|--------|
| 1 | Tokens + self-hosted fonts + shell (global.css, BaseLayout) | 46f902d | DONE |
| 2 | Vial component + paper/editorial component sweep (~25) | a0adf7f | DONE |
| 3 | Home as the catalogue | 5e1d5d2 | DONE |
| 4 | Dossier as a specimen sheet | 9711979 | DONE |
| 5 | Remaining content layouts (8) | 0778be7 | DONE |
| 6 | Listing + utility pages (28) | b918f96 | DONE |
| — | Lazyweb design-improve: sticky-header ledgers (trials, regulatory) | 5bba6d9 | DONE |
| 7 | Dossier two-column specimen sheet + chip-flow MechanismPathways (88 dossiers) | eb1acaa | DONE |
| 8 | Newsletter exit-popup → one-time, no mid-read triggers | c38cade | DONE |

- **Brand-coverage audit (2026-05-29):** static sweep (templates + content) + visual pass of all
  35 page templates → PASS. One leftover fixed (GLP-1 safety boxed warning → danger tokens).
  Workflow + results in `.planning/phases/36-peptracker-rebrand/BRAND-AUDIT.md`.
- **Pushed** `feat/peptracker-rebrand` (→ c38cade) to origin; PR into `main` to open (gh not installed —
  manual link). Production unchanged until merged.
- Full build green: astro + pagefind, **1,223 pages, 0 errors**.
- Lazyweb chain run (brainstorm → research → improve); reports in `.lazyweb/` (gitignored).
- **Design backlog** (needs greenlight): Plates⇄Ledger view toggle on listings; comparison/interaction
  matrix as color-coded grid; "Appears in N comparisons/conditions" backlinks; evidence reading-key legend.
- **Note:** a pre-existing uncommitted `pepcodex.com → www.pepcodex.com` domain change sits in the working
  tree (SEO schema, api/subscribe, llms*.ts) — left untouched, not part of the rebrand.

### Content-integrity fix: cardiogen dossier (2026-05-31)

- **Problem:** `src/content/peptides/cardiogen.mdx` asserted a fabricated "cardiac tripeptide" story.
  All 8 PMIDs across `evidenceChainedBenefits`/`conditions`/`timeline` were fake (each resolves to an
  unrelated paper on PubMed), and the cardiac/cardiomyocyte framing has **no** PubMed-indexed support.
- **Fix (option a — honest reframe):** rewrote body + frontmatter to present AED (Ala-Glu-Asp) as a
  Khavinson **anti-aging gene-expression** peptide studied **only in vitro in non-cardiac cells**
  (MSCs, renal, skin fibroblasts, neuronal, THP-1). Replaced the 8 fake PMIDs with the 9 real ones
  (all independently re-verified against NCBI esummary). Removed the fabricated cardiac `conditions`
  (their PMIDs rendered as **live PubMed links to unrelated papers**) and the fabricated `timeline`;
  collapsed `mechanismPathways` to one honest non-cardiac chain; added a "no cardiac data" callout.
- **Untouched:** the `scoring:` block (already corrected in commit 1e9075d's batch — 9 real PMIDs +
  note that the 8 cardiac PMIDs are fabricated).
- **Verify:** qa-banned-content PASS; build content-sync + validate-cross-links + qa-seo + qa-scoring PASS.
- **FOLLOW-UP FLAG:** sibling Khavinson tripeptide dossiers (vesugen, and likely the full
  20-dossier bioregulator module from Phases 26–27) share the same author-year + sequential-PMID
  pattern — **needs the same fabricated-citation audit** before trusting their evidence blocks.

### Phase 35: Content Refresh & New Dossiers (PAUSED)

**Goal:** Bring PepCodex current with Feb-Mar 2026 developments. New dossiers for recently approved/near-approval peptides, update 15+ stale dossiers, publish high-priority blog posts.

**Informed by:** 10-agent research swarm (`.planning/RESEARCH-SWARM-2026-03-19.md`)
**Plan:** `.planning/phases/35-content-refresh/PLAN.md`

| Sub-Phase | Focus | Target | Status |
|-----------|-------|--------|--------|
| A | New Dossiers | 6 peptides (92→98): rusfertide, PF-08653944, klotho, MK-0616, ecnoglutide, PEG-MGF | Not started |
| B | Dossier Updates | 15 existing dossiers refreshed with Feb-Mar 2026 data | Not started |
| C | Blog Posts | 10 articles (trending topics + misinformation) | Not started |
| D | Regulatory Updates | Category 1/2 reclassification (RFK Jr: 14→15 legal) | Not started |

### Infra Hardening (2026-04-13, this session)

- Archived 27 stale `.claude/` + `.planning/` docs → `_archive/` (~11K tokens off every session)
- Slimmed `.claude/CLAUDE.md` 152→30 lines; sourcing rules → on-demand skill
- Added `npm run check` as `prebuild` gate (validate-cross-links)
- Added SessionStart + PostToolUse hooks (`.claude/settings.json`)
- Recent commits: 104d086, df94a7d, b8f565b, d25e466, 02b6a23

---

## Completed Milestones

### v5.0 Hardening & Enhancement — COMPLETE (2026-02-12)

Scorecard 62.5% → 78.1%. All 6 phases (A-F) shipped.

| Phase | Focus | Scorecard Impact | Status |
|-------|-------|------------------|--------|
| A | Security Hardening | Security 1→3 (+2) | COMPLETE |
| B | Performance Optimization | Performance 2→3 (+1) | COMPLETE |
| C | Accessibility Fixes | Accessibility 2→3 (+1) | COMPLETE |
| D | Navigation & UX | Usability 3→4 (+1) | COMPLETE |
| E | Content Quality | Content consistency | COMPLETE |
| F | Feature Enhancements | Clinics 10→52 | COMPLETE |

**Artifacts:** `.planning/studio/` (8 evaluation reports)

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
- 2026-05-31: Content-integrity fix — cardiogen.mdx reframed off fabricated cardiac claims/8 fake PMIDs to 9 verified non-cardiac AED in-vitro sources. Flagged rest of Khavinson bioregulator module for the same citation audit.
- 2026-06-27: Two-axis scoring rollout COMPLETE — all 102 dossiers scored (rubric v2.4); qa-scoring + qa-pmids --strict wired into prebuild (build-breaking). Final wave incl. bt5528 re-score on corrected ORR.
- 2026-06-27: Citation-integrity sweep COMPLETE — all 102 dossiers independently verified for PMID topical-match + NCT drug-match (waves 8a3098b / d343ee4 / 03577c7 / ab6a19d). Render guard `src/utils/citation.ts` added; qa-pmids extended to flag placeholder/free-text citations. Fabrications fixed: wrong-drug NCTs, invented trials/Phase-3 results, inflated efficacy, copy-paste contamination.
- 2026-06-27: Score reconciliation COMPLETE (138ffa0) — 41 evidence-changed dossiers triaged; 2 effectiveness scores adjusted (cagrilintide 93→84, evx-01 58→55), 39 held; all gates green.
- 2026-06-27: Loop-automation design space mapped (LOOP-DESIGN-SPACE.md, 13 loops). OPEN: merge `feat/scoring-and-freshness` → prod (Vercel); resume loop brainstorm + pick V1 thrust.

---
*Last updated: 2026-06-27*
