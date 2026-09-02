# TICK51 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/amycretin-vs-mazdutide.mdx`. Fetch-or-strip. Do not start Judge. Do not stamp KEEP.

## Why this file

Assigned file was `amycretin-vs-maritide.mdx`. TICK49.md (read) cleaned `amycretin-vs-liraglutide.mdx`. TICK50.md was absent at first read, then appeared IN FLIGHT on **`amycretin-vs-maritide.mdx`** with `_tick50-fetch.mjs` already targeting MariTide / AMG 133 / maridebart. Hard-locked: TICK47+TICK48 `5-amino-1mq-vs-amycretin`, TICK50 `amycretin-vs-maritide`, TICK49 `amycretin-vs-liraglutide`, TICK46 `amycretin-vs-ct-388`, TICK45 `5-amino-1mq-vs-semaglutide`, KEEP `amycretin-vs-semaglutide` / `amycretin-vs-tirzepatide`, and `src/content/peptides/**`. Did **not** open the assigned maritide compare (path-checked only after TICK50 claimed it). Next unlocked leftover from the packet list: `amycretin-vs-mazdutide` (generated stub, `lastUpdated` 2026-02-12, census FAQ 8/Moderate vs 18/High, inverted 6-vs-12 human row, Total Sources 11/18, consult footer). No invented oral ~13/~25 or $1,000 row were present to strip.

`src/content/peptides/**` not opened (path-checked only). Locked compare files not edited. Mid-increment re-read showed TICK50 had written `amycretin-vs-maritide.mdx` (`lastUpdated` 2026-09-02); TICK50.md was still the short IN FLIGHT note.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\amycretin-vs-maritide.mdx
Test-Path src\content\peptides\amycretin.mdx
Test-Path src\content\peptides\maritide.mdx
Test-Path src\content\comparisons\amycretin-vs-semaglutide.mdx
Test-Path src\content\comparisons\maritide-vs-semaglutide.mdx
Test-Path src\content\comparisons\amycretin-vs-liraglutide.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK49.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK50.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK47.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK48.md
node .planning\seo-engine\runs\2026-09-01\_tick51-fetch.mjs
Test-Path src\content\comparisons\amycretin-vs-mazdutide.mdx
Test-Path src\content\peptides\mazdutide.mdx
Test-Path src\content\comparisons\mazdutide-vs-semaglutide.mdx
Test-Path src\content\comparisons\mazdutide-vs-tirzepatide.mdx
node .planning\seo-engine\runs\2026-09-01\_tick51-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick51-fetch3.mjs
node .planning\seo-engine\runs\2026-09-01\_tick51-fetch4.mjs
node scripts\qa-banned-content.js src\content\comparisons\amycretin-vs-mazdutide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (amycretin after two timeouts; mazdutide / ibi362 / ly3305677). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"amycretin"` count 21 — not dumped. Esearch `"mazdutide"` count 49 — not dumped. `"MARITIME"` count 20398 (token collision; not dumped). `"amycretin" AND "mazdutide"` count 4.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 NCT05369390 | Safety, tolerability, pharmacokinetics, and pharmacodynamics of the first-in-class GLP-1 and amylin receptor agonist, amycretin: a first-in-human… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; enroll 144 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT05369390` = 40550229 only. |
| PMID 40550231 NCT06064006 | Amycretin, a novel, unimolecular GLP-1 and amylin receptor agonist administered subcutaneously… | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 **−24.3% vs −1.1%**; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. Abstract does **not** name treatment-regimen. CT.gov COMPLETED Phase 2; enroll 125 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT06064006` = 40550231 only. |
| PMID 40549887 NCT05669599 | Once-Monthly Maridebart Cafraglutide for the Treatment of Obesity - A Phase 2 Trial | Fetched because the packet assigned maritide. Mechanism: GLP-1 agonism + GIP antagonism. Obesity cohort treatment-policy range **−12.3% to −16.2% vs −2.5%**. **Not written to a file** (TICK50 lock). CT.gov COMPLETED Phase 2; enroll 592 actual; hasResults **false**. Lead sponsor Amgen. |
| MARITIME CT.gov search | MARITIME-1 NCT06858839; MARITIME-2 NCT06858878; plus SWITCH / OSA / HF / CV / extensions | All hasResults **false**. Design only. **Not written** (TICK50 lock). |
| PMID 40421736 NCT05607680 GLORY-1 | Once-Weekly Mazdutide in Chinese Adults with Obesity or Overweight | n=610. **Treatment-policy.** Wk 32: −10.09 / −12.55 / +0.45%; ≥5% 73.9 / 82.0 / 10.5%. Wk 48: −11.00 / −14.01 / +0.30%; ≥15% 35.7 / 49.5 / 2.0%. AE d/c 1.5 / 0.5 / 1.0%. CT.gov COMPLETED Phase 3; enroll 610 actual; hasResults **false**. Lead sponsor Innovent Biologics. PubMed `NCT05607680` = 40421736 only. |
| PMID 42251595 NCT06164873 GLORY-2 | Treatment With 9-mg Mazdutide for Weight Reduction in Chinese Adults With Obesity: The GLORY-2 Randomized Clinical Trial | n=461 treated (307/154). Wk 60: **−16.65% vs −1.50%** (diff −15.15%). ≥5% 84.3 vs 33.1. AE d/c 2.9 vs 0. Vomiting 53.1 vs 1.3; nausea 46.9 vs 3.2; diarrhea 39.4 vs 6.5. Abstract does **not** name treatment-policy vs efficacy. CT.gov UNKNOWN Phase 3; enroll 462 actual; hasResults **false**. PubMed `NCT06164873` = 42251595 only. |
| PMID 42628555 NCT06124807 Hsia | Efficacy and safety of mazdutide in adults with obesity or overweight: a US-based, multicentre, phase 2… | n=179. Primary = 32-week **efficacy (hypothetical) estimand**. −7.3 / −15.6 / −18.1% vs −0.9%. ETD −6.5 to −17.2%. No treatment-policy number. 16 mg AE d/c 20%. 48-wk extra reductions without abstract numbers. CT.gov COMPLETED Phase 2; enroll 179 actual; hasResults **true**. Lead sponsor Eli Lilly. PubMed `NCT06124807` = 42628555 only. |
| PMID 42208956 / 41948476 / 41054801 / 40081498 | `"amycretin" AND "mazdutide"` (count 4) | All **Review**. No NCT. **Not** a head-to-head RCT. Not quoted as trial results. |
| openFDA drugsfda | generic amycretin / mazdutide / ibi362 / ly3305677 | All **NOT_FOUND** (amycretin after two UND_ERR_CONNECT_TIMEOUT retries). |

## File

- `src/content/comparisons/amycretin-vs-mazdutide.mdx`
  - Stripped census FAQ (8/18 sources; inverted 6-vs-12 human row), Evidence/Key Differences source-count tables (11/18), summary “8 total sources (4 human),” combination-as-advice voice, and consult footer.
  - Quoted oral first-in-human as TEAE-primary with **no** abstract weight percent. Did not restore oral ~13/~25.
  - Quoted subcutaneous phase 1b/2a secondary estimated means with placebo. Escaped P&lt;. Did not invent an estimand label.
  - Quoted GLORY-1 as **treatment-policy**. Did not collapse week 32 and week 48. Did not invent a nausea percent.
  - Quoted GLORY-2 week 60 means. Did **not** label treatment-policy (abstract silent).
  - Quoted Hsia as **efficacy (hypothetical)** estimand. Did not invent 48-week percents. Did not treat −18.1% as interchangeable with GLORY-1 or amycretin SC.
  - Dated H2H absence: PubMed `"amycretin" AND "mazdutide"` on 2026-09-02 returned 4 reviews; none is a randomised head-to-head obesity trial.
  - openFDA: amycretin / mazdutide / IBI362 / LY3305677 NOT_FOUND. NMPA not fetched. No invented approval year.
  - Linked `/peptides/amycretin`, `/peptides/mazdutide`, `/compare/amycretin-vs-semaglutide`, `/compare/mazdutide-vs-semaglutide` (no trailing slash). Did not edit those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (191 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: this filename gone (10 remaining mismatches are other amycretin census tables). Select-String: leftover census FAQ strings, Consult, Who Might, ~13/~25, unescaped `P<`, `$1,000` — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not edit assigned `amycretin-vs-maritide.mdx` (TICK50 IN FLIGHT / then wrote it). Maritide Phase 2 PMID 40549887 and MARITIME hasResults-false rows were fetched and logged only.
- Did not touch locked `5-amino-1mq-vs-amycretin.mdx`, `amycretin-vs-liraglutide.mdx`, `amycretin-vs-ct-388.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `amycretin-vs-semaglutide.mdx`, `amycretin-vs-tirzepatide.mdx`, or `src/content/peptides/**`.
- Did not restore OSA 63%/6%, TRIUMPH 28.7%, REDEFINE 22.7/15.7/23–25.5, SYNCHRONY, MOMENTUM unpublished obesity, or amycretin oral ~13/~25.
- Did not dump the 21-hit amycretin or 49-hit mazdutide esearch into the page.
- Did not quote the four amycretin+mazdutide reviews as trial results.
- Did not quote NCT06184568 / NCT06884293 percents (hasResults false).
- Did not invent GLORY-2 estimand or Hsia 48-week percents.
- Did not fetch NMPA letters.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Assigned `amycretin-vs-maritide.mdx` left untouched (TICK50 IN FLIGHT). Next unlocked leftover cleaned: `amycretin-vs-mazdutide.mdx` census FAQ (8/18 vs inverted 6/12) and source-count tables (11/18) stripped.
2. Oral first-in-human quoted as TEAE-primary; day-85 weight exploratory; abstract publishes **no** percent (PMID 40550229).
3. Subcutaneous phase 1b/2a quoted as secondary estimated mean 60 mg week 36 **−24.3% vs −1.1%** (PMID 40550231). Estimand not named.
4. GLORY-1 quoted as treatment-policy 6 mg week 48 **−14.01% vs +0.30%** (PMID 40421736). GLORY-2 9 mg week 60 **−16.65% vs −1.50%**; estimand not named (PMID 42251595).
5. Hsia quoted as **efficacy (hypothetical)** 16 mg week 32 −18.1% vs −0.9% (PMID 42628555). No treatment-policy number. No 48-week percent invented.
6. PubMed `"amycretin" AND "mazdutide"` on 2026-09-02: 4 reviews, no H2H RCT. openFDA 404 for amycretin / mazdutide / IBI362 / LY3305677. Links without trailing slash. P&lt; escaped. CRLF. No $1,000 row added or stripped.
7. This file dropped off `qa:counts`; 10 mismatches remain on other amycretin census tables. Maritide 40549887 / MARITIME fetched, not written.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Assigned maritide compare was TICK50's file; Judge should score TICK50's disk state, not this tick.
- Remaining unlocked census leftovers: `amycretin-vs-orforglipron`, `amycretin-vs-pemvidutide`, `amycretin-vs-retatrutide`, `amycretin-vs-slu-pp-332`, `amycretin-vs-survodutide`.
