# TICK55 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/amycretin-vs-retatrutide.mdx`. Generated census stub (8/Moderate vs 43/High; inverted 6-vs-40 “more clinical evidence”; Total Sources 11/43 vs summary 8/43). Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned `amycretin-vs-retatrutide.mdx` present (`lastUpdated` 2026-02-12, census FAQ, source-count tables, combination FAQ, consult footer). TICK53.md and TICK54.md were **absent** at dispatch (Test-Path False). Hard-locked: TICK53 `amycretin-vs-orforglipron`, TICK54 `amycretin-vs-pemvidutide`, TICK51+TICK52 `amycretin-vs-mazdutide`, TICK50 `amycretin-vs-maritide`, TICK49 `amycretin-vs-liraglutide`, KEEP `amycretin-vs-semaglutide` / `amycretin-vs-tirzepatide`, and `src/content/peptides/**`. This tick took the assigned leftover. Locked compares and peptide dossiers were not opened (path-checked only). Mid-increment lock lastUpdated on orforglipron/pemvidutide moved to 2026-09-02 (TICK53/54 writing); those files were not edited here.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\amycretin-vs-retatrutide.mdx
Test-Path src\content\peptides\amycretin.mdx
Test-Path src\content\peptides\retatrutide.mdx
Test-Path src\content\comparisons\amycretin-vs-semaglutide.mdx
Test-Path src\content\comparisons\retatrutide-vs-semaglutide.mdx
Test-Path src\content\comparisons\tirzepatide-vs-retatrutide.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK53.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK54.md
node .planning\seo-engine\runs\2026-09-01\_tick55-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick55-fetch2.mjs
node scripts\qa-banned-content.js src\content\comparisons\amycretin-vs-retatrutide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (amycretin) / 404 (retatrutide) after fetch1 timeout then fetch2 retry. Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"amycretin"` count 21 — not dumped. Esearch `"retatrutide"` count 176 — not dumped. `"amycretin" AND "retatrutide"` count 8. `"TRIUMPH-1"[Title]` count 1 (22759797, treprostinil PAH; TITLE_MATCH false). `"TRIUMPH-1" retatrutide weight` count 1 (41090431). `retatrutide[Title] AND 28.7` count **0**.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 NCT05369390 | Safety, tolerability, pharmacokinetics, and pharmacodynamics of the first-in-class GLP-1 and amylin receptor agonist, amycretin: a first-in-human… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; enroll 144 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT05369390` = 40550229 only. |
| PMID 40550231 NCT06064006 | Amycretin, a novel, unimolecular GLP-1 and amylin receptor agonist administered subcutaneously… | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 **−24.3% vs −1.1%**; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. Abstract does **not** name treatment-regimen. CT.gov COMPLETED Phase 2; enroll 125 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT06064006` = 40550231 only. |
| PMID 37366315 NCT04881760 | Triple-Hormone-Receptor Agonist Retatrutide for Obesity - A Phase 2 Trial | n=338; 48 wk. **Primary = 24 wk.** LS mean 24 wk: −7.2/−12.9/−17.3/**−17.5** vs −1.6% (1 / combined 4 / combined 8 / **12 mg**). **48 wk secondary:** −8.7/−17.1/−22.8/**−24.2** vs **−2.1%**. 12 mg ≥5/10/15%: 100/93/83 vs 27/9/2. GI related to assigned amount, mostly mild–moderate. HR increase peaked wk 24 then declined. Abstract does **not** name treatment-regimen. **−17.5% is 12 mg at 24 wk, not 4 mg at 48 wk** (combined 4 mg at 48 wk is −17.1%). CT.gov COMPLETED Phase 2; enroll 338 actual; hasResults **true** (quoted abstract, not results module). PubMed `NCT04881760` = 6 ids. |
| PMID 41090431 TRIUMPH design | Retatrutide for the treatment of obesity, obstructive sleep apnea and knee osteoarthritis: Rationale and design of the TRIUMPH registrational clinical trials | Four Phase 3 studies; **over 5,800**. Primary weight end point = % body-weight change. **No efficacy percent.** PubMed `"TRIUMPH-1" retatrutide weight` = **1** (this paper). `retatrutide[Title] AND 28.7` = **0**. |
| PMID 42250575 NCT06354660 TRANSCEND-T2D-1 | Efficacy and safety of retatrutide … TRANSCEND-T2D-1 | n=537; 40 wk. **Treatment-regimen.** HbA1c −1.69/−1.86/−1.94 vs −0.81% (P&lt;0.0001). Weight −11.5/−13.9/−15.3 vs −2.6%. AE d/c 2–5% vs 0%. **T2D, not TRIUMPH obesity.** CT.gov COMPLETED Phase 3; enroll 537 actual; hasResults **false**. PubMed `NCT06354660` = 42250575 only. |
| PMID 42608321 | Retatrutide-Associated Improvements in Cardiovascular Risk Biomarkers… | NCT04881760 + NCT04867785. Lipoprotein / CRP analysis. apoB up to **−24.2% is not body weight**. **Not TRIUMPH.** |
| PMID 38858523 | Triple hormone receptor agonist retatrutide for metabolic dysfunction-associated steatotic liver disease… | TITLE_MATCH true. MASLD substudy of NCT04881760. Quotes parent-trial 22.8%/24.2% and liver-fat percents. **Not TRIUMPH.** Liver-fat percents **not quoted** as body weight. |
| PMID 22759797 | Baseline NT-proBNP … TRIUMPH-1 (inhaled treprostinil, PAH) | TITLE_MATCH **false** for retatrutide. Wrong-drug `"TRIUMPH-1"[Title]` hit. Not quoted. |
| NCT04881760 extras 41589220 / 41216380 / 41201783 | WES scale; exit-interview qualitative; EBAQ scale | Phase 2 exit/PRO papers. Not used as obesity percents. |
| PMIDs 41054801, 42208956, 40206909, 40081498, 41948476, 40949933, 42444567, 42673585 | `"amycretin" AND "retatrutide"` (count 8) | All Review/synthesis. TITLE_MATCH for amycretin **in title** = false (named in abstracts). **Not** a head-to-head RCT. Not quoted as trial results. 42673585 synthesizes −23.9% / −22.1%; **not used**. |
| openFDA drugsfda | generic amycretin / retatrutide | Both **NOT_FOUND**. |

## File

- `src/content/comparisons/amycretin-vs-retatrutide.mdx`
  - Stripped census FAQ (8/43 sources; inverted 6-vs-40 human row), Evidence/Key Differences source-count tables (11/43), summary “8 total sources (4 human)” / “43 total sources (40 human),” combination-as-advice voice, and consult footer.
  - Quoted oral first-in-human as TEAE-primary with **no** abstract weight percent. Did not restore oral ~13/~25.
  - Quoted subcutaneous phase 1b/2a secondary estimated means with placebo. Escaped P&lt;. Did not invent an estimand label.
  - Quoted retatrutide phase 2 **week-24 primary** vs **week-48 secondary** with placebo. −24.2% vs −2.1% labelled secondary. −17.5% labelled 12 mg at 24 weeks, not 4 mg at 48. Combined 4 mg at 48 weeks is −17.1%.
  - Quoted TRANSCEND-T2D-1 as **T2D treatment-regimen**, not obesity Phase 3.
  - Dated TRIUMPH absence without a percent. Did not write 28.7% as a result. Logged `retatrutide[Title] AND 28.7` = 0.
  - Labelled 42608321 apoB −24.2% as not body weight. Labelled 38858523 as MASLD substudy of the same phase 2; liver-fat percents not quoted.
  - Dated the H2H absence: PubMed `"amycretin" AND "retatrutide"` on 2026-09-02 returned 8 reviews; none is a randomised head-to-head obesity trial.
  - openFDA: amycretin NOT_FOUND; retatrutide NOT_FOUND.
  - Linked `/peptides/amycretin`, `/peptides/retatrutide`, `/compare/amycretin-vs-semaglutide`, `/compare/retatrutide-vs-semaglutide`, `/compare/tirzepatide-vs-retatrutide` (no trailing slash). Did not edit those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (221 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: this filename gone (4 remaining mismatches are `amycretin-vs-slu-pp-332` and `amycretin-vs-survodutide`). Select-String: leftover census FAQ strings, Consult, Who Might, `dose`/`dosing`/`inject`/`protocol`, ~13/~25, unescaped `P<`, `$1,000` — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `amycretin-vs-orforglipron.mdx`, `amycretin-vs-pemvidutide.mdx`, `amycretin-vs-mazdutide.mdx`, `amycretin-vs-maritide.mdx`, `amycretin-vs-liraglutide.mdx`, KEEP `amycretin-vs-semaglutide.mdx` / `amycretin-vs-tirzepatide.mdx`, or `src/content/peptides/**`.
- Did not restore oral amycretin ~13/~25, TRIUMPH 28.7%, OSA 63%/6%, REDEFINE 22.7/15.7/23–25.5, or a 4 mg 48-week −17.5% row.
- Did not dump the 21-hit amycretin or 176-hit retatrutide esearch into the page.
- Did not quote the eight amycretin+retatrutide reviews as trial results (including 42673585 −23.9%/−22.1%).
- Did not quote 38858523 liver-fat percents as body weight.
- Did not cite PMID 22759797 (wrong-drug TRIUMPH-1).
- Did not quote NCT04881760 results-module percents (hasResults true; journal abstract used).
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Assigned leftover cleaned: `amycretin-vs-retatrutide.mdx` census FAQ (8/43 vs inverted 6/40) and source-count tables (11/43) stripped.
2. Oral first-in-human quoted as TEAE-primary; day-85 weight exploratory; abstract publishes **no** percent (PMID 40550229).
3. Subcutaneous phase 1b/2a quoted as secondary estimated mean 60 mg week 36 **−24.3% vs −1.1%** (PMID 40550231). Estimand not named.
4. Retatrutide phase 2: week-24 primary 12 mg **−17.5% vs −1.6%**; week-48 secondary 12 mg **−24.2% vs −2.1%** (PMID 37366315). −17.5% is not 4 mg at 48 weeks.
5. TRANSCEND-T2D-1 labelled **treatment-regimen** in type 2 diabetes, not TRIUMPH obesity (PMID 42250575). TRIUMPH design-only (PMID 41090431). `retatrutide[Title] AND 28.7` = 0.
6. PubMed `"amycretin" AND "retatrutide"` on 2026-09-02: 8 reviews, no H2H RCT. openFDA: both 404. Links without trailing slash. P&lt; escaped. CRLF. No $1,000 row added or stripped.
7. This file dropped off `qa:counts`; 4 mismatches remain on `amycretin-vs-slu-pp-332` and `amycretin-vs-survodutide`.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: `amycretin-vs-slu-pp-332`, `amycretin-vs-survodutide`. `amycretin-vs-orforglipron` / `amycretin-vs-pemvidutide` locked to TICK53/54. `amycretin-vs-mazdutide` collision (TICK51+TICK52). `amycretin-vs-maritide` / `amycretin-vs-liraglutide` awaiting Judge.
