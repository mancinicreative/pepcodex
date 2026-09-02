# TICK49 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/amycretin-vs-liraglutide.mdx`. Generated census stub (8/Moderate vs 18/High; inverted 6-vs-12 “more clinical evidence”; Total Sources 11/18 vs dossiers 12/18) plus combination-as-advice FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK48.md (read at dispatch) locked `5-amino-1mq-vs-amycretin.mdx`. TICK47.md was **absent** at dispatch. Hard-locked: TICK46 `amycretin-vs-ct-388`, TICK45 `5-amino-1mq-vs-semaglutide`, TICK44 `amycretin-vs-aod-9604`, KEEP `amycretin-vs-semaglutide` / `amycretin-vs-tirzepatide`, and `src/content/peptides/**`. Preferred leftover `5-amino-1mq-vs-amycretin.mdx` was already taken. This tick took the first remaining unlocked named leftover: `amycretin-vs-liraglutide` (generated stub, `lastUpdated` 2026-02-12, census FAQ, source-count tables, combination FAQ, consult footer). No invented oral ~13/~25 or $1,000 row were present to strip.

TICK47.md appeared later in the increment and assigned the same 5-amino file as TICK48. That is not this file. Locked compares and `src/content/peptides/**` were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\amycretin-vs-liraglutide.mdx
Test-Path src\content\peptides\amycretin.mdx
Test-Path src\content\peptides\liraglutide.mdx
Test-Path src\content\comparisons\amycretin-vs-semaglutide.mdx
Test-Path src\content\comparisons\liraglutide-vs-semaglutide.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK47.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK48.md
node .planning\seo-engine\runs\2026-09-01\_tick49-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick49-fetch2.mjs
node scripts\qa-banned-content.js src\content\comparisons\amycretin-vs-liraglutide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (amycretin) / 200 (liraglutide generic; Victoza brand; Saxenda brand; NDA022341; NDA206321). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"amycretin"` count 21 — not dumped. Esearch `"liraglutide"` count 5887 — not dumped. `"SCALE" AND liraglutide AND obesity` count 101. `"SCALE Obesity and Prediabetes"` count 2 (26132939, 26510028). `"LEADER" AND liraglutide AND cardiovascular` count 148. `"amycretin" AND "liraglutide"` count 6.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 NCT05369390 | Safety, tolerability, pharmacokinetics, and pharmacodynamics of the first-in-class GLP-1 and amylin receptor agonist, amycretin: a first-in-human… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; enroll 144 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT05369390` = 40550229 only. |
| PMID 40550231 NCT06064006 | Amycretin, a novel, unimolecular GLP-1 and amylin receptor agonist administered subcutaneously… | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 **−24.3% vs −1.1%**; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. Abstract does **not** name treatment-regimen. CT.gov COMPLETED Phase 2; enroll 125 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT06064006` = 40550231 only. |
| PMID 26132939 NCT01272219 SCALE | A Randomized, Controlled Trial of 3.0 mg of Liraglutide in Weight Management | n=3731; 56 wk; no T2D. 2:1 (2487 / 1244). Coprimary = body-weight change and ≥5% / >10% responders. Mean **−8.4±7.3 kg vs −2.8±6.5 kg** (difference −5.6 kg; 95% CI −6.0 to −5.1; P&lt;0.001, **LOCF**). ≥5% 63.2% vs 27.1%. >10% 33.1% vs 10.6%. Abstract reports **kg, not a mean percent**. Estimand not named as treatment-regimen. CT.gov COMPLETED Phase 3; enroll 3731 actual; hasResults **true**. PubMed `NCT01272219` count 7; this page quotes 26132939 only. |
| PMID 26510028 | Liraglutide in Weight Management | 2015 letter. **No abstract.** Not quoted. |
| PMID 27295427 NCT01179048 LEADER | Liraglutide and Cardiovascular Outcomes in Type 2 Diabetes | n=9340; median 3.8 yr. Primary MACE 608/4668 (13.0%) vs 694/4672 (14.9%); HR **0.87** (95% CI 0.78–0.97); P&lt;0.001 noninferiority; P=0.01 superiority. CV death 219 (4.7%) vs 278 (6.0%); HR 0.78 (95% CI 0.66–0.93). CT.gov COMPLETED Phase 3; enroll 9341 actual; hasResults **true**. |
| PMIDs 41054801, 42208956, 40206909, 42175595, 40949933, 42673585 | `"amycretin" AND "liraglutide"` (count 6) | Title-matched reviews / network meta-analyses. **Not** a head-to-head RCT. Not quoted as trial results. |
| openFDA drugsfda | generic amycretin / liraglutide; brand Victoza / Saxenda; NDA022341 / NDA206321 | Amycretin **NOT_FOUND**. Victoza NDA022341 ORIG AP **2010-01-25**. Saxenda NDA206321 ORIG AP **2014-12-23**. |

## File

- `src/content/comparisons/amycretin-vs-liraglutide.mdx`
  - Stripped census FAQ (8/18 sources; inverted 6-vs-12 human row), Evidence/Key Differences source-count tables (11/18), summary “8 total sources (4 human),” combination-as-advice voice, and consult footer.
  - Quoted oral first-in-human as TEAE-primary with **no** abstract weight percent. Did not restore oral ~13/~25.
  - Quoted subcutaneous phase 1b/2a secondary estimated means with placebo. Escaped P&lt;. Did not invent an estimand label.
  - Quoted SCALE as LOCF kilograms (−8.4 vs −2.8) plus responder percents from the abstract. Did **not** convert kilograms into a mean percent.
  - Quoted LEADER hazard ratios. Did not headline a rounded relative-risk percent.
  - Dated the H2H absence: PubMed `"amycretin" AND "liraglutide"` on 2026-09-02 returned 6 reviews; none is a randomised head-to-head obesity trial.
  - openFDA: amycretin NOT_FOUND; Victoza / Saxenda original approvals dated from ORIG AP fields. Did not invent an amycretin obesity Phase 3.
  - Linked `/peptides/amycretin`, `/peptides/liraglutide`, `/compare/amycretin-vs-semaglutide`, `/compare/liraglutide-vs-semaglutide` (no trailing slash). Did not edit those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (173 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: this filename gone (14 remaining mismatches are other amycretin census tables). Select-String: leftover census FAQ strings, Consult, Who Might, `dose`/`dosing`/`inject`/`protocol`, banned leftover percents, unescaped `P<`, `$1,000` — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `amycretin-vs-ct-388.mdx`, `5-amino-1mq-vs-amycretin.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `amycretin-vs-aod-9604.mdx`, `amycretin-vs-semaglutide.mdx`, `amycretin-vs-tirzepatide.mdx`, or `src/content/peptides/**`.
- Did not restore OSA 63%/6%, TRIUMPH 28.7%, REDEFINE 22.7/15.7/23–25.5, SYNCHRONY, MOMENTUM unpublished obesity, or amycretin oral ~13/~25.
- Did not dump the 21-hit amycretin or 5887-hit liraglutide esearch into the page.
- Did not quote the six amycretin+liraglutide reviews as trial results, PMID 26510028, or NMA mixed percents.
- Did not convert SCALE kilograms into a percent.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `amycretin-vs-liraglutide.mdx` census FAQ (8/18 vs inverted 6/12) and source-count tables (11/18) stripped.
2. Oral first-in-human quoted as TEAE-primary; day-85 weight exploratory; abstract publishes **no** percent (PMID 40550229).
3. Subcutaneous phase 1b/2a quoted as secondary estimated mean 60 mg week 36 **−24.3% vs −1.1%** (PMID 40550231). Estimand not named.
4. SCALE quoted as LOCF **−8.4 kg vs −2.8 kg** at 56 weeks (PMID 26132939). Abstract has no mean percent; kilograms not converted.
5. LEADER quoted as HR **0.87** (95% CI 0.78–0.97) (PMID 27295427). No rounded relative-risk headline.
6. PubMed `"amycretin" AND "liraglutide"` on 2026-09-02: 6 reviews, no H2H RCT. openFDA: amycretin 404; Victoza 2010-01-25; Saxenda 2014-12-23. Links without trailing slash. P&lt; escaped. CRLF. No $1,000 row added or stripped.
7. This file dropped off `qa:counts`; 14 mismatches remain on other amycretin census tables.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: `amycretin-vs-maritide`, `amycretin-vs-mazdutide`, `amycretin-vs-orforglipron`, `amycretin-vs-pemvidutide`, `amycretin-vs-retatrutide`, `amycretin-vs-slu-pp-332`, `amycretin-vs-survodutide`. TICK47 and TICK48 both assigned `5-amino-1mq-vs-amycretin.mdx`.
