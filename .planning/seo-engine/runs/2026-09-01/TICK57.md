# TICK57 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/amycretin-vs-survodutide.mdx`. Generated census stub (8/Moderate vs 34/High; inverted 6-vs-30 “more clinical evidence”; Total Sources 11/34 vs summary 8/34). Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned `amycretin-vs-survodutide.mdx` present (`lastUpdated` 2026-02-12, census FAQ, source-count tables, combination FAQ, consult footer). TICK55.md (read) cleaned `amycretin-vs-retatrutide.mdx`. TICK56.md was **absent** at dispatch (Test-Path False; packet said TICK56 in flight on `amycretin-vs-slu-pp-332.mdx`). Hard-locked: TICK55 `amycretin-vs-retatrutide`, TICK56 `amycretin-vs-slu-pp-332`, TICK54 `amycretin-vs-pemvidutide`, TICK53 `amycretin-vs-orforglipron`, TICK51+TICK52 `amycretin-vs-mazdutide`, KEEP `amycretin-vs-semaglutide` / `amycretin-vs-tirzepatide`, and `src/content/peptides/**`. This tick took the assigned leftover. Locked compares and peptide dossiers were not opened (path-checked only). Mid-increment `amycretin-vs-slu-pp-332.mdx` lastUpdated was already 2026-09-02 (TICK56 writing); that file was not edited here.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\amycretin-vs-survodutide.mdx
Test-Path src\content\comparisons\amycretin-vs-slu-pp-332.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK55.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK56.md
Get-ChildItem src\content\comparisons -Filter amycretin-vs-*.mdx
node .planning\seo-engine\runs\2026-09-01\_tick57-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick57-fetch2.mjs
node scripts\qa-banned-content.js src\content\comparisons\amycretin-vs-survodutide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (amycretin / survodutide) after fetch1 timeout then fetch2 retry. Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"amycretin"` count 21 — not dumped. Esearch `"survodutide"` count 77 — not dumped. `"amycretin" AND "survodutide"` count 4. `"SYNCHRONIZE-1" survodutide` count 6. `"SYNCHRONIZE-1"[Title]` count 3 (41187967, 39495965, 41424209 — **not** 42253238). `"SYNCHRONY" survodutide` count **0**. `"SYNCHRONY"[Title]` count 4072 — discarded (generic word). `survodutide[Title] AND 18.7` count 1 (40963161). `survodutide[Title] AND 19.5` count **0**. `survodutide[Title] AND 12.2` count 2 (42253238, 42252333).

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 NCT05369390 | Safety, tolerability, pharmacokinetics, and pharmacodynamics of the first-in-class GLP-1 and amylin receptor agonist, amycretin: a first-in-human… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; enroll 144 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT05369390` = 40550229 only. |
| PMID 40550231 NCT06064006 | Amycretin, a novel, unimolecular GLP-1 and amylin receptor agonist administered subcutaneously… | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 **−24.3% vs −1.1%**; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. Abstract does **not** name treatment-regimen. CT.gov COMPLETED Phase 2; enroll 125 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT06064006` = 40550231 only. |
| PMID 42253238 NCT06066515 SYNCHRONIZE-1 | Survodutide Once Weekly for the Treatment of Adults with Obesity | Title does **not** contain SYNCHRONIZE; conclusions name SYNCHRONIZE-1. n=725 (241/242/242). 76 wk. **Primary analysis = treatment-regimen.** Mean: **−12.2%** (3.6 mg; 95% CI −13.6 to −10.8), **−13.0%** (6.0 mg; −14.4 to −11.6), **−5.4%** placebo (−6.9 to −4.0). ≥5%: 72.6 / 71.9 / 46.3 (P&lt;0.001). GI 80.9 / 89.7 / 47.9. No deaths. CT.gov COMPLETED Phase 3; acronym SYNCHRONIZE-1; enroll **726** actual; hasResults **false**. Lead sponsor Boehringer Ingelheim. PubMed `NCT06066515` = 42253238, 41187967, 39495965. |
| PMID 38330987 NCT04667377 | Glucagon and GLP-1 receptor dual agonist survodutide for obesity… phase 2 | n=387 enrolled / 386 treated. **46 weeks** (not 48). Planned-treatment: −6.2 / −12.5 / −13.2 / **−14.9** vs −2.8% (0.6 / 2.4 / 3.6 / 4.8 mg). GI 75% vs 42%. CT.gov COMPLETED Phase 2; enroll 387 actual; hasResults **true** (quoted abstract, not results module). |
| PMID 38847460 NCT04771273 | A Phase 2 Randomized Trial of Survodutide in MASH and Fibrosis | 48 wk histology. n=293 dosed. MASH improvement no fibrosis worsening: 47 / 62 / 43 vs 14% (P&lt;0.001 quadratic). ≥30% liver fat: 63 / 67 / 57 vs 14%. Fibrosis ≥1 stage: 34 / 36 / 34 vs 22. **Not body weight. Not SYNCHRONIZE-1.** CT.gov COMPLETED Phase 2; enroll 295 actual; hasResults **true**. |
| PMID 42252333 SYNCHRONIZE-MASLD | Survodutide in adults with obesity and MASLD: SYNCHRONIZE-MASLD… | n=216 (146/70); 48 wk. Liver fat ≥30%: efficacy 84.2% vs 24.3%; **treatment-regimen 68.5% vs 28.6%**. Weight: **efficacy −12.2% vs −1.0%**; **treatment-regimen −8.7% vs −1.4%**. **Not SYNCHRONIZE-1.** Abstract NCTs NCT06632457 / NCT06632444 — not quoted as obesity Phase 3. |
| PMID 39495965 SYNCHRONIZE-1/-2 design | Survodutide for treatment of obesity: rationale and design… | Design only. NCT06066515 / NCT06066528. **No efficacy percent.** |
| PMID 41187967 SYNCHRONIZE-1 baseline | …Baseline characteristics… SYNCHRONIZE-1 | n=725; mean BMI 37.9. **Not an efficacy readout.** |
| PMID 41216778 SYNCHRONIZE-2 baseline | Baseline characteristics… SYNCHRONIZE-2 | T2D obesity cohort. **No efficacy percent.** |
| PMID 39453356 SYNCHRONIZE-CVOT | …Rationale and Design of the SYNCHRONIZE Cardiovascular Outcomes Trial | Design only. NCT06077864. **No efficacy percent.** |
| PMID 41424209 | Operationalising disease modification… SYNCHRONIZE-1 | Letter. No abstract. Not quoted. |
| PMID 40963161 | Survodutide: A Dual GLP-1/Glucagon Agonist Reshaping Cardiometabolic Care | Review. TITLE_MATCH true for survodutide. Cites “weight loss up to **18.7%**.” **Not quoted as a trial result.** This is the `18.7` title hit. |
| PMID 38095657 NCT04153929 | Dose-response effects on HbA1c and bodyweight… type 2 diabetes | 16-week T2D. **Not quoted** as obesity Phase 3. |
| PMIDs 41054801, 42208956, 40081498, 41948476 | `"amycretin" AND "survodutide"` (count 4) | All Review. **Not** a head-to-head RCT. Not quoted as trial results. |
| openFDA drugsfda | generic amycretin / survodutide | Both **NOT_FOUND**. |

## File

- `src/content/comparisons/amycretin-vs-survodutide.mdx`
  - Stripped census FAQ (8/34 sources; inverted 6-vs-30 human row), Evidence/Key Differences source-count tables (11/34), summary “8 total sources (4 human)” / “34 total sources (30 human),” combination-as-advice voice, and consult footer.
  - Quoted oral first-in-human as TEAE-primary with **no** abstract weight percent. Did not restore oral ~13/~25.
  - Quoted subcutaneous phase 1b/2a secondary estimated means with placebo. Escaped P&lt;. Did not invent an estimand label.
  - Quoted SYNCHRONIZE-1 as **treatment-regimen** −12.2% / −13.0% vs −5.4% at 76 weeks. Named SYNCHRONIZE, not SYNCHRONY. Labelled paper n=725 vs CT.gov 726.
  - Quoted phase 2 obesity as **46 weeks** planned-treatment −14.9% vs −2.8% at 4.8 mg. Dated the 18.7 review hit and the 19.5 zero. **No unsourced 48-week ~18.7 / ~19.5 table.**
  - Quoted MASH phase 2 as histology, not body weight.
  - Quoted SYNCHRONIZE-MASLD with **both** estimands labelled. Did not collapse its efficacy −12.2% into SYNCHRONIZE-1.
  - Dated H2H absence: PubMed `"amycretin" AND "survodutide"` on 2026-09-02 returned 4 reviews; none is a randomised head-to-head obesity trial.
  - Dated SYNCHRONY absence: `"SYNCHRONY" survodutide` = 0 on 2026-09-02.
  - openFDA: amycretin NOT_FOUND; survodutide NOT_FOUND.
  - Linked `/peptides/amycretin`, `/peptides/survodutide`, `/compare/amycretin-vs-semaglutide`, `/compare/survodutide-vs-semaglutide`, `/compare/survodutide-vs-tirzepatide` (no trailing slash). Did not edit those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (221 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages; this filename gone). Select-String: leftover census FAQ strings, Consult, Who Might, body `dose`/`dosing`/`inject`/`protocol` (YAML paper title still has “dose-finding”), unescaped `P<`, `$1,000` — all 0 in body. SYNCHRONY / 18.7 / 19.5 appear only as dated “not this / not quoted” lines. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `amycretin-vs-retatrutide.mdx`, `amycretin-vs-slu-pp-332.mdx`, `amycretin-vs-pemvidutide.mdx`, `amycretin-vs-orforglipron.mdx`, `amycretin-vs-mazdutide.mdx`, KEEP `amycretin-vs-semaglutide.mdx` / `amycretin-vs-tirzepatide.mdx`, or `src/content/peptides/**`.
- Did not restore oral amycretin ~13/~25, unsourced 48-week ~18.7/~19.5, or a SYNCHRONY trial.
- Did not dump the 21-hit amycretin or 77-hit survodutide esearch into the page.
- Did not quote the four amycretin+survodutide reviews as trial results.
- Did not quote PMID 40963161 “up to 18.7%” as a trial result.
- Did not quote 38095657 (16-week T2D), 41187967 (baseline), 41216778 (SYNCHRONIZE-2 baseline), 39453356 (CVOT design), or 41424209 (letter) as efficacy.
- Did not quote NCT04667377 or NCT04771273 results-module percents (hasResults true; journal abstract used).
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Assigned leftover cleaned: `amycretin-vs-survodutide.mdx` census FAQ (8/34 vs inverted 6/30) and source-count tables (11/34) stripped.
2. Oral first-in-human quoted as TEAE-primary; day-85 weight exploratory; abstract publishes **no** percent (PMID 40550229).
3. Subcutaneous phase 1b/2a quoted as secondary estimated mean 60 mg week 36 **−24.3% vs −1.1%** (PMID 40550231). Estimand not named.
4. SYNCHRONIZE-1 (not SYNCHRONY) quoted as **treatment-regimen −12.2% / −13.0% vs −5.4% at 76 weeks** (PMID 42253238). `"SYNCHRONY" survodutide` = 0.
5. Phase 2 obesity is **46 weeks** planned-treatment −14.9% vs −2.8% (PMID 38330987). No unsourced 48-week ~18.7/~19.5. `survodutide[Title] AND 19.5` = 0. 18.7 hit is review 40963161, not quoted.
6. SYNCHRONIZE-MASLD labelled with both estimands (PMID 42252333). H2H PubMed 4 reviews, not an RCT. openFDA 404 both compounds. Links without trailing slash. P&lt; escaped. CRLF. No $1,000 row added or stripped.
7. This file dropped off `qa:counts`; that gate now PASSES 268 pages (TICK56 appears to have already rewritten `amycretin-vs-slu-pp-332`).
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- TICK56.md still absent at close; `amycretin-vs-slu-pp-332` lastUpdated already 2026-09-02 (not opened). Locked TICK53/54/51+52 files left to their Judges.
