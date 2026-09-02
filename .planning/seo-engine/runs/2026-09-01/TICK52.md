# TICK52 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/amycretin-vs-mazdutide.mdx`. Generated census stub (8/Moderate vs 18/High; inverted 6-vs-12 “more clinical evidence”; Total Sources 11/18 vs summary 8/18). Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned `amycretin-vs-mazdutide.mdx` present (`lastUpdated` 2026-02-12, census FAQ, source-count tables, combination FAQ, consult footer). TICK50.md (read at dispatch) is IN FLIGHT on `amycretin-vs-maritide.mdx`. TICK51.md was **absent** at dispatch (Test-Path False). Hard-locked: TICK49 `amycretin-vs-liraglutide`, TICK50/51 `amycretin-vs-maritide`, TICK47/48 `5-amino-1mq-vs-amycretin`, KEEP `amycretin-vs-semaglutide` / `amycretin-vs-tirzepatide`, and `src/content/peptides/**`. This tick took the assigned leftover. Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\amycretin-vs-mazdutide.mdx
Test-Path src\content\peptides\amycretin.mdx
Test-Path src\content\peptides\mazdutide.mdx
Test-Path src\content\comparisons\amycretin-vs-semaglutide.mdx
Test-Path src\content\comparisons\mazdutide-vs-semaglutide.mdx
Test-Path src\content\comparisons\mazdutide-vs-tirzepatide.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK50.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK51.md
Test-Path src\content\comparisons\amycretin-vs-liraglutide.mdx
Test-Path src\content\comparisons\amycretin-vs-maritide.mdx
node .planning\seo-engine\runs\2026-09-01\_tick52-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick52-fetch2.mjs
node scripts\qa-banned-content.js src\content\comparisons\amycretin-vs-mazdutide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI efetch STATUS 200. NCBI esummary STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (amycretin) / 404 (mazdutide). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"amycretin"` count 21 — not dumped. Esearch `"mazdutide"` count 49 — not dumped. `"GLORY-1"[Title]` count 0. `"GLORY-2"[Title]` count 1 (42251595). `"amycretin" AND "mazdutide"` count 4.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 NCT05369390 | Safety, tolerability, pharmacokinetics, and pharmacodynamics of the first-in-class GLP-1 and amylin receptor agonist, amycretin: a first-in-human… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; enroll 144 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT05369390` = 40550229 only. |
| PMID 40550231 NCT06064006 | Amycretin, a novel, unimolecular GLP-1 and amylin receptor agonist administered subcutaneously… | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 **−24.3% vs −1.1%**; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. Abstract does **not** name treatment-regimen. CT.gov COMPLETED Phase 2; enroll 125 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT06064006` = 40550231 only. |
| PMID 40421736 NCT05607680 GLORY-1 | Once-Weekly Mazdutide in Chinese Adults with Obesity or Overweight | n=610; China; 48 wk. **Treatment-policy.** Coprimary **week 32**: −10.09 / −12.55 / +0.45%; ≥5% 73.9 / 82.0 / 10.5% (P&lt;0.001). **Week 48 also reported:** −11.00 / **−14.01** / +0.30%; ≥15% 35.7 / 49.5 / 2.0%. AE d/c 1.5 / 0.5 / 1.0%. GI most frequent; no nausea %. CT.gov COMPLETED; enroll 610 actual; hasResults **false**. Lead sponsor Innovent Biologics. PubMed `NCT05607680` = 40421736 only. `"GLORY-1"[Title]` = 0; quoted via PMID title match. |
| PMID 42251595 NCT06164873 GLORY-2 | Treatment With 9-mg Mazdutide … GLORY-2 Randomized Clinical Trial | n=461 treated (307 vs 154); 60 wk; China. Abstract does **not** name treatment-policy vs efficacy. **−16.65% vs −1.50%** (diff −15.15%; P&lt;.001). ≥5% 84.3 vs 33.1. AE d/c 2.9 vs 0. Vomiting 53.1 vs 1.3; nausea 46.9 vs 3.2; diarrhea 39.4 vs 6.5. CT.gov enroll 462 actual; overallStatus **UNKNOWN**; hasResults **false**. PubMed `NCT06164873` = 42251595 only. |
| PMID 42628555 NCT06124807 Hsia | Efficacy and safety of mazdutide … US-based … phase 2 | n=179 randomised. **Primary = 32-week efficacy (hypothetical) estimand.** −7.3 / −15.6 / **−18.1%** vs **−0.9%**. ETD −6.5% to −17.2%. 48-wk extra reductions **without abstract percents**. 16 mg AE d/c **20%**. No treatment-policy number. CT.gov COMPLETED; enroll 179 actual; hasResults true (quoted abstract, not results module). Lead sponsor Eli Lilly. PubMed `NCT06124807` = 42628555 only. |
| PMIDs 41054801, 42208956, 40081498, 41948476 | `"amycretin" AND "mazdutide"` (count 4) | Title-matched reviews. Titles do not name both compounds. **Not** a head-to-head RCT. Not quoted as trial results. |
| openFDA drugsfda | generic amycretin / mazdutide | Both **NOT_FOUND**. |

## File

- `src/content/comparisons/amycretin-vs-mazdutide.mdx`
  - Stripped census FAQ (8/18 sources; inverted 6-vs-12 human row), Evidence/Key Differences source-count tables (11/18), summary “8 total sources (4 human),” combination-as-advice voice, and consult footer.
  - Quoted oral first-in-human as TEAE-primary with **no** abstract weight percent. Did not restore oral ~13/~25.
  - Quoted subcutaneous phase 1b/2a secondary estimated means with placebo. Escaped P&lt;. Did not invent an estimand label.
  - Quoted GLORY-1 **week 32 primary** vs **week 48 also-reported** treatment-policy, including 6 mg week 48 **−14.01% vs +0.30%**. Re-fetched this increment; not copied from TICK35.
  - Quoted GLORY-2 9 mg **−16.65% vs −1.50%** at 60 weeks after this-run fetch. Did not invent an estimand label. Did not collapse GLORY-1 and GLORY-2 into one range.
  - Quoted Hsia as **efficacy (hypothetical) estimand**; no treatment-policy number; no invented 48-week percent.
  - Dated the H2H absence: PubMed `"amycretin" AND "mazdutide"` on 2026-09-02 returned 4 reviews; none is a randomised head-to-head obesity trial.
  - openFDA: amycretin NOT_FOUND; mazdutide NOT_FOUND. Did not invent NMPA months.
  - Linked `/peptides/amycretin`, `/peptides/mazdutide`, `/compare/amycretin-vs-semaglutide`, `/compare/mazdutide-vs-semaglutide` (no trailing slash). Did not edit those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (193 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: this filename gone (10 remaining mismatches are other amycretin census tables). Select-String: leftover census FAQ strings, Consult, Who Might, `dose`/`dosing`/`inject`/`protocol`, banned leftover percents, unescaped `P<`, `$1,000` — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `amycretin-vs-liraglutide.mdx`, `amycretin-vs-maritide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, `amycretin-vs-semaglutide.mdx`, `amycretin-vs-tirzepatide.mdx`, or `src/content/peptides/**`.
- Did not restore OSA 63%/6%, TRIUMPH 28.7%, REDEFINE 22.7/15.7/23–25.5, SYNCHRONY, or amycretin oral ~13/~25.
- Did not dump the 21-hit amycretin or 49-hit mazdutide esearch into the page.
- Did not quote the four amycretin+mazdutide reviews as trial results.
- Did not invent NMPA approval months.
- Did not quote Hsia 48-week percents (abstract has none).
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `amycretin-vs-mazdutide.mdx` census FAQ (8/18 vs inverted 6/12) and source-count tables (11/18) stripped.
2. Oral first-in-human quoted as TEAE-primary; day-85 weight exploratory; abstract publishes **no** percent (PMID 40550229).
3. Subcutaneous phase 1b/2a quoted as secondary estimated mean 60 mg week 36 **−24.3% vs −1.1%** (PMID 40550231). Estimand not named.
4. GLORY-1 6 mg week 48 **−14.01% vs +0.30%** labelled treatment-policy; week 32 is the coprimary window (PMID 40421736). Re-fetched; not copied from TICK35.
5. GLORY-2 9 mg **−16.65% vs −1.50%** at 60 weeks quoted after this-run fetch; estimand not named in the abstract (PMID 42251595).
6. Hsia US phase 2 labelled **efficacy (hypothetical) estimand**; −18.1% vs −0.9% at 32 weeks; no treatment-policy number (PMID 42628555).
7. PubMed `"amycretin" AND "mazdutide"` on 2026-09-02: 4 reviews, no H2H RCT. openFDA: both 404. Links without trailing slash. P&lt; escaped. CRLF. No $1,000 row added or stripped.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- NMPA decision letters not fetched — months not invented.
- W3-M1 OAuth.
- Remaining unlocked census leftovers: `amycretin-vs-orforglipron`, `amycretin-vs-pemvidutide`, `amycretin-vs-retatrutide`, `amycretin-vs-slu-pp-332`, `amycretin-vs-survodutide`. `amycretin-vs-maritide` locked to TICK50/51. `amycretin-vs-liraglutide` locked to TICK49 awaiting Judge.
