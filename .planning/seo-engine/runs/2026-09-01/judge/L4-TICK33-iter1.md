# JUDGE — L4-TICK33 iter1 — vk2735-vs-semaglutide.mdx

**Verdict: KEEP**

Judge did not write this increment. Mood: critic. All identifiers below were re-fetched independently by the Judge on 2026-09-02 (not copied from the Implementer's note or scripts).

## Independent fetches (commands actually run)

```
node .planning\seo-engine\runs\2026-09-01\judge\_judge-tick33-fetch.mjs    # efetch 4 PMIDs, per-alias esearch, CT.gov v2 x5
node .planning\seo-engine\runs\2026-09-01\judge\_judge-tick33-fetch2.mjs   # CT.gov primaryCompletionDateStruct/acronym/officialTitle/outcomes
node scripts\qa-banned-content.js src\content\comparisons\vk2735-vs-semaglutide.mdx   # PASS, exit 0
node scripts\qa-medical-advice.mjs                                        # PASS, 932 files, exit 0
git diff HEAD -- src/content/comparisons/vk2735-vs-semaglutide.mdx        # scope + removal check
```

Raw evidence: `_judge-tick33-fetch.json`, `_judge-tick33-fetch2.json` (same dir). NCBI efetch/esearch HTTP 200; CT.gov v2 HTTP 200 on all five records.

## PASS/FAIL per L4 criterion

| # | Criterion | Result | Evidence (fetch vs page) |
|---|---|---|---|
| 1 | VENTURE (PMID 41508550) figures | **PASS** | efetch title topical-matches ("Weekly Subcutaneous VK2735… 13-Week VENTURE Study"). Abstract: "9.2 kg (2.5 mg dose) to 14.6 kg (15 mg dose), corresponding to 9.1% and 14.7%… placebo… 1.8 kg (1.7%)"; "93% (130/140)… 12% (4/34)"; GI AEs "decreased in reported frequency after dose titration"; diabetes ineligible. Page quotes all exactly. |
| 2 | VENTURE estimand honesty | **PASS** | Abstract names no estimand; page says "The abstract does **not** name a treatment-regimen vs efficacy estimand" and headlines "estimand not named in the abstract". Correct handling — no efficacy-estimand headlining, no invented label. |
| 3 | STEP 1 (PMID 33567185) | **PASS** | Title match. Abstract: n=1961, 68 wk, "primary estimand… regardless of treatment discontinuation or rescue interventions" (treatment-regimen); −14.9% vs −2.4%; ETD −12.4 (95% CI −13.4 to −11.5; P<0.001); 86.4/69.1/50.5 vs 31.5/12.0/4.9; −15.3 vs −2.6 kg; GI d/c 4.5% vs 0.8% (59 vs 5). Page matches every figure and labels the estimand. |
| 4 | SELECT (PMID 37952131) | **PASS** | Title match. Abstract: "A total of 17,604 patients… 8803… 8801"; "569 of the 8803 (6.5%)… 701 of the 8801 (8.0%) (hazard ratio, 0.80; 95% CI 0.72 to 0.90; P<0.001)"; follow-up 39.8 mo; AE d/c 16.6% vs 8.2% (1461 vs 718). Page quotes HR + absolute rates and explicitly refuses a rounded relative-risk headline. No "20% MACE" anywhere on the page. |
| 5 | OASIS 1 (PMID 37385278) | **PASS** | Title match. Abstract: n=667 randomised, 68 wk, oral 50 mg, "regardless of treatment discontinuation or use of other bodyweight-lowering therapies (an intention-to-treat analysis)"; −15.1% vs −2.4%; ETD −12.7 (−14.2 to −11.3; p<0.0001); ≥5% 85% vs 26%; GI AE 80% vs 46%. Page matches, labels treatment-policy/ITT. |
| 6 | Oral/VANQUISH design-only + dated absences | **PASS** | CT.gov: NCT05203237 COMPLETED 92 actual, start 2021-12-14, hasResults false, official title confirms SAD/MAD dual GLP-1/GIP in healthy/increased-BMI adults. NCT06828055 COMPLETED 280 actual, start 2024-12-18, primary completion 2025-06-24 ACTUAL, hasResults false, official title confirms 13-week oral formulation. NCT07104500 acronym **VANQUISH 1**, ACTIVE_NOT_RECRUITING, 4500 estimated, 78-wk, no T2D, primary completion 2027-07-01 ESTIMATED, hasResults false. NCT07104383 **VANQUISH 2**, 1100 estimated, T2D, same dates, hasResults false. Page matches all fields. Judge esearch (per-alias, no OR-join): NCT05203237=0, NCT06828055=0, NCT07104500=0, NCT07104383=0, "VK2735"=1, "VK-2735"=0. Every absence on the page is dated 2026-09-02. No unpublished oral percent quoted. |
| 7 | Census FAQ gone | **PASS** | Diff removed lines: "VK2735 has 5 sources (1 human studies)… Semaglutide has 67 sources (52 human studies)". Live FAQ now: "This page does not quote a live source census." Grep: no 67/52, no 5/1. |
| 8 | Unpublished oral ~3.3% gone | **PASS** | Diff removed: "\| Weight Loss \| ~3.3% (single dose study) \|". Live page: "This page does not quote an unpublished oral VK2735 weight-loss percent." |
| 9 | No unresolved identifiers | **PASS** | All 4 PMIDs efetch 200 + topical title match; all 5 NCTs CT.gov 200. No sibling-trial mixup: VANQUISH 1/2 NCTs correctly paired (acronym/briefTitle + T2D status match). |
| 10 | Links resolve, no trailing slash | **PASS** | Grep: zero trailing-slash internal links. Targets exist: `src/content/peptides/vk2735.mdx`, `semaglutide.mdx`, `src/content/comparisons/vk2735-vs-tirzepatide.mdx`, `src/pages/compare/` route. |
| 11 | No dosing / purchasing / medical advice | **PASS** | `qa-banned-content.js` on the file: PASS exit 0. `qa-medical-advice.mjs`: PASS, 932 files, exit 0. Old "Consult a healthcare provider" footer removed per diff; new footer is educational-only. Milligram figures appear only inside trial quotations, which is citation, not guidance. |
| 12 | No self-KEEP | **PASS** | TICK33.md header: "implementer note (not a KEEP)", "Do not mark KEEP". No TICK33 entry in LOOP-TASKS.md, no ratchet row, no prior judge file. |
| 13 | MDX/schema hygiene | **PASS** | `P&lt;0.001` / `P&lt;0.0001` escaped; grep finds no raw `<` in stats. comparisons Zod schema permits sources[].type journal/trial, pmid, doi, nctId, verifiedAt — frontmatter valid. lastUpdated 2026-09-02. |
| 14 | Scope lock | **PASS** | `git diff --stat HEAD` on the increment: 1 file, +120/−107. Implementer's not-done list consistent with the run's other judge files. |

## Nits (not failing)

- FAQ answer contains process-talk: "This increment did not complete an openFDA fetch." Honest and not a false fact — openFDA genuinely failed (implementer disclosed rather than invented) — but reader-facing copy could drop the word "increment" in a future pass.
- VENTURE CT.gov line on the page ("primary completion 2024-02-27 actual") is correct against `primaryCompletionDateStruct`; Judge's first pass misread `completionDateStruct` (study completion 2024-04-02) and nearly raised a false accusation. Recorded here so the next judge doesn't repeat it.

## Gaming check

The Implementer's note matches the diff line-for-line: every claimed removal (census FAQ, `~14.7%` on a 2.4 mg VK2735 row, `~3.3%` oral, hedged `~14.9%`/`~15.1%`, invented `~7%` discontinuation, `~15%` expected-efficacy, "impressive early weight loss", consult footer, developer-partnership speculation) appears in the diff's removed lines, and every claimed quote appears verbatim in the Judge's independent efetch/CT.gov pulls — including the two places where honest labeling was the whole game (VENTURE's unnamed estimand; SELECT as HR 0.80 with 6.5%/8.0% instead of a "20% reduction" headline). The heavy "this page does not quote X" negation style is defensive but accurate and makes re-introduction of the stripped claims harder; it is not inflating any metric. No identifier was introduced that wasn't fetched this run; absences are window-dated; no self-KEEP; no scope creep into locked files.

## Verdict

**KEEP.** All 14 criteria PASS against independent fetches. Conductor may stamp LOOP-TASKS and add the ratchet row.
