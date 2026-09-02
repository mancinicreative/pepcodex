# JUDGE — L4-TICK32 iter1 — `wegovy-vs-zepbound.mdx`

Judge: independent (did not write TICK32). Date: 2026-09-02. Mood: critic.
Increment: `src/content/comparisons/wegovy-vs-zepbound.mdx` per `.planning/seo-engine/runs/2026-09-01/TICK32.md`.

## Independent fetch (commands actually run)

- `node .planning/seo-engine/runs/2026-09-01/judge/_judge-tick32-fetch.mjs` — efetch via repo-canonical `verification/pubmed.mjs fetchRecords`, NCBI eutils, 2026-09-02. All 10 quoted PMIDs returned records; every title topical-matched its claimed trial.
- `node -e` sentence extractions against the saved fetch output (SELECT, SURMOUNT-5, STEP 2/3/4, SURMOUNT-2/3/4, all NCT ids).
- `node .planning/seo-engine/runs/2026-09-01/judge/_judge-tick32-diffcheck.mjs` — `git diff HEAD` banned-pattern scan of removed vs added lines.
- `git diff HEAD -- src/content/comparisons/wegovy-vs-zepbound.mdx` — removed-lines verbatim review.
- CRLF audit via node; banned-pattern greps of the live file; slug existence check.

## Fail-list checks (from dispatch)

| Check | Result | Evidence |
|---|---|---|
| Census FAQ (67/52 vs 76/68) still live | PASS (gone) | Diff removed lines verbatim: `- Semaglutide has 67 sources (52 human studies)` / `- Tirzepatide has 76 sources (68 human studies)`. Live FAQ now: "This page does not quote a live source census." |
| SELECT "20% MACE" headline | PASS (gone) | Removed line: `- 20% reduction in major adverse cardiovascular events (MACE)`. Live page: "HR 0.80 (95% CI 0.72–0.90); 6.5% vs 8.0%". |
| SURMOUNT-1 "over 60%" | PASS (gone) | Zero hits live and in added lines. Page quotes 57% (95% CI 53–61) — my fetch: "57% (95% CI, 53 to 61) ... as compared with 3%". |
| OSA 63%/6% | PASS (absent) | Zero OSA/TRIUMPH hits live or in diff. The only "63" added is STEP 3's verified 63.2% placebo GI rate. |
| Invented SURMOUNT-5 category percents | PASS | Page: "it does **not** publish those category percents." My efetch confirms: abstract names ≥10/15/20/25% as secondary endpoints and says only "more likely ... to have weight reductions" — no percents. Honest, not a dodge. |
| Unresolved PMIDs | PASS | 10/10 returned; titles match (STEP 1 "Once-Weekly Semaglutide in Adults with Overweight or Obesity", SURMOUNT-1 "Tirzepatide Once Weekly for the Treatment of Obesity", SELECT "Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes", SURMOUNT-5 "Tirzepatide as Compared with Semaglutide for the Treatment of Obesity", + STEP 2/3/4, SURMOUNT-2/3/4). |
| NCT↔PMID pairing | PASS | All 10 NCTs appear inside their own fetched records (33567185↔NCT03548935, 35658024↔NCT04184622, 37952131↔NCT03574597, 40353578↔NCT05822830, 33667417↔NCT03552757, 33625476↔NCT03611582, 33755728↔NCT03548987, 37385275↔NCT04657003, 37840095↔NCT04657016, 38078870↔NCT04660643). No sibling-trial mixup. |
| Trailing-slash compare links | PASS | Zero `\](.../)` hits. Only two internal links: `/peptides/semaglutide`, `/peptides/tirzepatide`; both slugs exist on disk. |
| Dosing / purchasing / medical advice | PASS | No buy/purchase/"you should"/"consult your doctor" hits. Trial-arm doses are citation content; FAQ declines combination ("does not recommend a combination"); educational disclaimer present. |
| Implementer self-KEEP | PASS | TICK32.md header: "implementer note (not a KEEP)"; "Did not mark KEEP." |
| TICK6-PRICE | N/A per dispatch | No ~$1,000/month row on this page; not failed. |

## Number-by-number verification (page vs my 2026-09-02 efetch)

- STEP 1: −14.9% vs −2.4%, ETD −12.4 pp (CI −13.4 to −11.5), P<0.001; ≥5/10/15% 86.4/69.1/50.5 vs 31.5/12.0/4.9; GI d/c 4.5% vs 0.8%; n=1961, 68 wk — **exact**. Page's "abstract does not report a ≥20% rate" — confirmed true.
- SURMOUNT-1: treatment-regimen label matches abstract wording; −15.0/−19.5/−20.9% vs −3.1%; ≥5% 85/89/91 vs 35; ≥20% 57% (CI 53–61) vs 3; AE d/c 4.3/7.1/6.2 vs 2.6 — **exact**.
- SELECT: n=17,604; 569/8803 (6.5%) vs 701/8801 (8.0%); HR 0.80 (0.72–0.90); follow-up 39.8 mo; AE d/c 16.6% vs 8.2% — **exact**.
- SURMOUNT-5: n=751; phase 3b open-label; MTD tirzepatide 10/15 vs semaglutide 1.7/2.4; LS mean −20.2% (CI −21.4 to −19.1) vs −13.7% (CI −14.9 to −12.6); waist −18.4 vs −13.0 cm — **exact**. Page's "abstract does not label treatment-regimen vs efficacy" — confirmed (no "estimand" in abstract).
- STEP 2 (−9.6 vs −3.4, ETD −6.2, CI −7.3 to −5.2, p<0.0001, ≥5% 68.8 vs 28.5), STEP 3 (−16.0 vs −5.7, −10.3 pp, 86.6/47.6, 75.3/27.0, 55.8/13.2, GI 82.8/63.2, d/c 3.4/0), STEP 4 (run-in −10.6%, 803 randomised, −7.9 vs +6.9, −14.8 pp), SURMOUNT-2 (−12.8/−14.7 vs −3.2, ≥5% 79–83 vs 32), SURMOUNT-3 (−18.4 vs +2.5, ETD −20.8), SURMOUNT-4 (lead-in −20.9%, 670 randomised, −5.5 vs +14.0, −19.4%, 89.5 vs 16.6, wk0–88 −25.3 vs −9.9) — **all exact** (Lancet middle-dot decimals decoded from `&#xb7;` entities).

## L4 bar (LOOPS.md)

- Estimand discipline: treatment-policy (STEP 1) and treatment-regimen (SURMOUNT-1/2/3) lead their rows; SURMOUNT-5's missing label is disclosed, not papered over. PASS.
- No absence claim without a fetch date: both absence statements are scoped "abstract fetched 2026-09-02". PASS.
- No identifier introduced outside a fetch: all 10 PMIDs carry `verifiedAt: '2026-09-02'` and were re-resolved by me this run. PASS.
- Frontmatter vs `comparisons` Zod schema (`src/content/config.ts` L223–240): title/peptideA/peptideB/category(metabolic)/lastUpdated/summary/faqs/sources all valid; sources entries use only schema fields. PASS.
- CRLF: 187 CRLF, 0 LF-only — implementer's claim verified. `P&lt;0.001` escaped throughout. PASS.

## Gaming check

This is a subtraction-heavy increment, and subtraction can be a way to dodge verification — but here the deletions are exactly the classes the strategist named (census counts, invented ≥5/10/15/20% range table, unmatched AE grid, SELECT relative-risk headline, enrollment hedges), and the diff's added lines contain zero banned-pattern hits. What survived is not hollowed: ten trials each quoted from this run's fetch with estimand labels where the abstract provides them. The easiest place to game — SURMOUNT-5's "more likely to reach ≥10/15/20/25%" — is quoted with an explicit, accurate "does not publish those category percents" note rather than invented numbers. The census FAQ was replaced with a refusal-to-answer-numerically, not a softer fabrication. Scope claim (only this file; locked compares and `src/content/peptides/**` untouched by this tick) is consistent with the per-file diff I reviewed; the wider working-tree changes belong to other ticks and are outside this loop's review.

## Verdict

**KEEP.** Every fail-list item is absent, every quoted number re-fetched and exact, estimands honest, links resolve, schema valid. Ratchet row warranted.

| 1 | Strip fabricated census/AE/MACE/range content from wegovy-vs-zepbound; quote 10 fetched trials exactly | `src/content/comparisons/wegovy-vs-zepbound.mdx` | Judge efetch 2026-09-02: 10/10 PMIDs topical-match, all numbers exact; banned-pattern scan of live file + diff clean | keep | TICK6-PRICE untouched per dispatch |
