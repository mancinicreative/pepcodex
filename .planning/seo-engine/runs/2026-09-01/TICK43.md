# TICK43 — implementer note (not a KEEP)

Loop: L4 cited-only leftover census compare. One file: `src/content/comparisons/amycretin-vs-cagrisema.mdx`. Census FAQ (8/Moderate vs 14/High; inverted 6-vs-6 “more clinical evidence”) plus Total Sources 11/14 vs dossiers 12/14. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK41.md (read in flight) took `amycretin-vs-cagrilintide.mdx`. TICK40 `amycretin-vs-vk2735.mdx` awaiting Judge. Locked: TICK27 `amycretin-vs-semaglutide`, TICK20 KEEP `amycretin-vs-tirzepatide`, TICK42 `ozempic-vs-wegovy`, TICK39 `ozempic-vs-mounjaro`. This file was the next unlocked amycretin leftover: generated stub (`lastUpdated` 2026-02-12), census FAQ, source-count tables, combination “not recommended / potentially unsafe” voice, and consult footer. No invented 22.7 / 15.7 / 23–25.5 / oral ~13/~25 rows were present to strip.

`src/content/peptides/**` not opened. TICK41 file not edited.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
node scripts/qa-comparison-counts.mjs --strict
node .planning\seo-engine\runs\2026-09-01\_tick43-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick43-fetch2.mjs
node scripts\qa-banned-content.js src\content\comparisons\amycretin-vs-cagrisema.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (amycretin / cagrilintide / cagrisema). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"amycretin"` count 21 — not dumped. Esearch `"CagriSema"` count 70 — not dumped. Esearch `"cagrilintide"` count 97 — not dumped. `"REDEFINE 1" AND cagrilintide` = 1 (40544433). `"REDEFINE 2" AND cagrilintide` = 1 (40544432) — **not fetched, not cited**.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 NCT05369390 | Safety, tolerability, pharmacokinetics, and pharmacodynamics of the first-in-class GLP-1 and amylin receptor agonist, amycretin: a first-in-human… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; enroll 144 actual; hasResults **false**. PubMed `NCT05369390` = 40550229 only. |
| PMID 40550231 NCT06064006 | Amycretin, a novel, unimolecular GLP-1 and amylin receptor agonist administered subcutaneously… | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 **−24.3% vs −1.1%**; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. Abstract does **not** name treatment-regimen. CT.gov COMPLETED Phase 2; enroll 125 actual; hasResults **false**. PubMed `NCT06064006` = 40550231 only. |
| PMID 40544433 NCT05567796 REDEFINE 1 | Coadministered Cagrilintide and Semaglutide in Adults with Overweight or Obesity | n=3417; 68 wk; 21:3:3:7 (2108 / 302 / 302 / 705). **Treatment-policy.** CagriSema **−20.4% vs −3.0%** (ETD −17.3; CI −18.1 to −16.6; P&lt;0.001). Semaglutide-alone and cagrilintide-alone arms named; **abstract does not publish those percents**. Responder 5/20/25/30% “more likely”; **no percents**. GI 79.6% vs 39.9%. No 22.7. CT.gov ACTIVE_NOT_RECRUITING; enroll 3400 estimated; hasResults **false**. |
| PMID 41328546 NCT05567796 | CagriSema Reduces Blood Pressure in Adults With Overweight or Obesity: REDEFINE 1 | Title-matched as REDEFINE 1 blood-pressure secondary. **Not quoted.** PubMed `NCT05567796` = 40544433 + 41328546. |
| openFDA drugsfda | generic_name amycretin / cagrilintide / cagrisema | All three **NOT_FOUND**. |

## File

- `src/content/comparisons/amycretin-vs-cagrisema.mdx`
  - Stripped census FAQ (8/14 sources; inverted 6-vs-6 human row), Evidence/Key Differences source-count tables (11/14), summary “8 total sources (4 human),” combination “not recommended / potentially unsafe,” and consult footer.
  - Quoted oral first-in-human as TEAE-primary with **no** abstract weight percent. Did not restore oral ~13/~25.
  - Quoted subcutaneous phase 1b/2a secondary estimated means with placebo. Escaped P&lt;. Did not invent an estimand label.
  - Quoted REDEFINE 1 treatment-policy −20.4% vs −3.0% with placebo, ETD, CI. Named active-control arms without inventing their percents. Did not invent responder percents.
  - Linked `/peptides/amycretin`, `/peptides/cagrisema`, `/compare/amycretin-vs-semaglutide`, `/compare/cagrisema-vs-semaglutide` (no trailing slash). Did not edit those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (148 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS (first pass FAIL on “Fixed-dose”; rephrased; second pass PASS). `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: this filename gone (22 remaining mismatches are other amycretin census tables + `5-amino-1mq-vs-amycretin`). Select-String: leftover census FAQ strings, Consult, Who Might, banned leftover percents, `dose`, trailing-slash hrefs — all 0. Positive control 48. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `amycretin-vs-vk2735.mdx`, `amycretin-vs-semaglutide.mdx`, `amycretin-vs-tirzepatide.mdx`, TICK41 `amycretin-vs-cagrilintide.mdx`, `ozempic-vs-wegovy.mdx`, `ozempic-vs-mounjaro.mdx`, or `src/content/peptides/**`.
- Did not restore OSA 63%/6%, TRIUMPH 28.7%, REDEFINE 22.7/15.7/23–25.5, SYNCHRONY, MOMENTUM unpublished obesity, or amycretin oral ~13/~25.
- Did not dump the 21-hit amycretin or 70-hit CagriSema esearch into the page.
- Did not fetch or quote REDEFINE 2 PMID 40544432.
- Did not quote blood-pressure figures from PMID 41328546.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `amycretin-vs-cagrisema.mdx` census FAQ (8/14 vs inverted 6/6) and source-count tables (11/14) stripped.
2. Oral first-in-human quoted as TEAE-primary; day-85 weight exploratory; abstract publishes **no** percent (PMID 40550229).
3. Subcutaneous phase 1b/2a quoted as secondary estimated mean 60 mg week 36 **−24.3% vs −1.1%** (PMID 40550231). Estimand not named.
4. REDEFINE 1 quoted as treatment-policy **−20.4% vs −3.0%** at 68 weeks (PMID 40544433). Active-control percents not invented.
5. openFDA 404 for amycretin, cagrilintide, and CagriSema as of 2026-09-02. Links without trailing slash. P&lt; escaped. CRLF. No $1,000 row added or stripped.
6. PMID 41328546 title-matched as REDEFINE 1 BP secondary; not quoted. REDEFINE 2 esearch hit 40544432 not fetched.
7. This file dropped off `qa:counts`; 22 mismatches remain on other amycretin census tables plus `5-amino-1mq-vs-amycretin`.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `amycretin-vs-*.mdx` Total Sources 11-vs-12 rows (`aod-9604`, `ct-388`, `liraglutide`, `maritide`, `mazdutide`, `orforglipron`, `pemvidutide`, `retatrutide`, `slu-pp-332`, `survodutide`) and `5-amino-1mq-vs-amycretin.mdx`.
