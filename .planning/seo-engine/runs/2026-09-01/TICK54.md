# TICK54 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/amycretin-vs-pemvidutide.mdx`. Generated census stub (8/Moderate vs 10/Moderate; inverted 6-vs-3 “more clinical evidence”; Total Sources 11/10 vs summary 8/10; truncated “showing 15.”). Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned `amycretin-vs-pemvidutide.mdx` present (`lastUpdated` 2026-02-12, census FAQ, source-count tables, combination FAQ, consult footer). TICK52.md (read) cleaned `amycretin-vs-mazdutide.mdx`. TICK53.md was **absent** at dispatch (Test-Path False; packet said TICK53 in flight on `amycretin-vs-orforglipron.mdx`). Hard-locked: TICK53 `amycretin-vs-orforglipron`, TICK51/52 `amycretin-vs-mazdutide`, TICK50 `amycretin-vs-maritide`, TICK49 `amycretin-vs-liraglutide`, KEEP `amycretin-vs-semaglutide` / `amycretin-vs-tirzepatide`, and `src/content/peptides/**`. This tick took the assigned leftover. Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\amycretin-vs-pemvidutide.mdx
Test-Path src\content\comparisons\amycretin-vs-orforglipron.mdx
Test-Path src\content\comparisons\amycretin-vs-mazdutide.mdx
Test-Path src\content\comparisons\amycretin-vs-maritide.mdx
Test-Path src\content\comparisons\amycretin-vs-liraglutide.mdx
Test-Path src\content\comparisons\amycretin-vs-semaglutide.mdx
Test-Path src\content\comparisons\amycretin-vs-tirzepatide.mdx
Test-Path src\content\peptides\amycretin.mdx
Test-Path src\content\peptides\pemvidutide.mdx
Test-Path src\content\comparisons\pemvidutide-vs-semaglutide.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK52.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK53.md
node .planning\seo-engine\runs\2026-09-01\_tick54-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick54-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick54-fetch3.mjs
node .planning\seo-engine\runs\2026-09-01\_tick54-fetch4.mjs
node scripts\qa-banned-content.js src\content\comparisons\amycretin-vs-pemvidutide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI efetch STATUS 200. NCBI esummary STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (amycretin / pemvidutide / alt-801 / alt801). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"amycretin"` count 21 — not dumped. Esearch `"pemvidutide"` count 13 — not dumped. `"pemvidutide AND MOMENTUM"` count 0. `"amycretin" AND "pemvidutide"` count 1. `"MOMENTUM Trial" AND (pemvidutide OR ALT-801)` returned 429 — discarded; the per-alias MOMENTUM and NCT05295875 searches already returned 0.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 NCT05369390 | Safety, tolerability, pharmacokinetics, and pharmacodynamics of the first-in-class GLP-1 and amylin receptor agonist, amycretin: a first-in-human… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT05369390` = 40550229 only. |
| PMID 40550231 NCT06064006 | Amycretin, a novel, unimolecular GLP-1 and amylin receptor agonist administered subcutaneously… | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 **−24.3% vs −1.1%**; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. Abstract does **not** name treatment-regimen. CT.gov COMPLETED Phase 2; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT06064006` = 40550231 only. |
| PMID 41237796 NCT05989711 IMPACT | Safety and efficacy of weekly pemvidutide versus placebo for metabolic dysfunction-associated steatohepatitis (IMPACT)… | n=212 randomised. Dual primary at 24 weeks **ITT**. MASH resolution without fibrosis worsening: **58%** (24/41) 1.2 mg and **52%** (45/85) 1.8 mg vs **20%** (18/86) placebo (P&lt;0.0001). Fibrosis improvement without MASH worsening: 33% vs 28% (P=0.59) and 36% vs 28% (P=0.27) — **not met**. AE d/c 0 / 1% / 2%. CT.gov COMPLETED Phase 2; hasResults **false**. Lead sponsor Altimmune, Inc. PubMed `NCT05989711` = 41237796 only. |
| PMID 39002641 NCT05006885 | Effect of pemvidutide … on MASLD | n=94 randomised and dosed. Primary efficacy = relative **MRI-PDFF** liver-fat reduction at 12 weeks: 46.6 / 68.5 / 57.1 vs 4.4% (P&lt;0.001). Maximal abstract weight −4.3% at 1.8 mg. **Not** obesity Phase 3. CT.gov COMPLETED Phase 1; registry primary TEAEs; hasResults **false**. PubMed `NCT05006885` = 39002641 only. |
| PMID 41113119 NCT05292911 | Safety and efficacy of 24 weeks of pemvidutide in … MASLD | 64-participant extension. Primary efficacy = **MRI-PDFF** liver-fat at 24 weeks: 56.3 / 75.2 / 76.4 vs 14.0% (P&lt;0.001). Weight also −6.2%. **Not** obesity Phase 3. CT.gov COMPLETED Phase 1; hasResults **false**. PubMed `NCT05292911` = 41113119 only. |
| NCT05295875 MOMENTUM | Phase 2 48-week obesity (ALT-801 / MOMENTUM) | COMPLETED. Primary = relative body-weight change. hasResults **false**. PubMed `NCT05295875` = **0**. `pemvidutide AND MOMENTUM` = **0**. **No obesity percent quoted.** |
| NCT07795164 PERFORMA | Phase 3 MASH | RECRUITING. hasResults **false**. PubMed 0. Design only. |
| PMID 40081498 | `"amycretin" AND "pemvidutide"` (count 1) | Review. **Not** a head-to-head RCT. Not quoted as trial results. |
| PMID 21994418 | Phase I trial of ALT-801, an interleukin-2/T-cell receptor fusion protein… | Title-matched `"ALT-801"` but **wrong molecule** (oncology IL-2/TCR). Not cited. |
| PMID 35461369 | Effects of ALT-801 … translational mouse model | Mouse NASH. Not quoted as human results. |
| PMID 41352959 | Lancet comment on IMPACT | No abstract numbers. Not quoted as trial results. |
| PMID 41879841 | GRADE meta-analysis of pemvidutide in MASH | Fetched; not used as the lead figure (primary RCT is IMPACT). |
| openFDA drugsfda | generic amycretin / pemvidutide / alt-801 / alt801 | All **NOT_FOUND**. |

CT.gov `statusModule` on these records did not return `enrollmentInfo`. Published n came from abstracts (144 / 125 / 212 / 94 / 64). MOMENTUM enrollment was not invented.

## File

- `src/content/comparisons/amycretin-vs-pemvidutide.mdx`
  - Stripped census FAQ (8/10 sources; inverted 6-vs-3 human row), Evidence/Key Differences source-count tables (11/10), summary “8 total sources (4 human),” truncated “showing 15.”, combination-as-advice voice, and consult footer.
  - Quoted oral first-in-human as TEAE-primary with **no** abstract weight percent. Did not restore oral ~13/~25.
  - Quoted subcutaneous phase 1b/2a secondary estimated means with placebo. Escaped P&lt;. Did not invent an estimand label.
  - Quoted IMPACT **ITT** MASH resolution **58%/52% vs 20%**. Quoted fibrosis co-primary **not met** (33%/36% vs 28%). Re-fetched PMID 41237796 this increment.
  - Quoted MASLD papers as **MRI-PDFF** liver-fat studies. Did not treat −4.3% / −6.2% as obesity Phase 3.
  - Dated MOMENTUM absence: PubMed `NCT05295875` and `pemvidutide AND MOMENTUM` on 2026-09-02 returned 0; hasResults false. **No unpublished obesity percent.**
  - Dated H2H absence: PubMed `"amycretin" AND "pemvidutide"` on 2026-09-02 returned 1 review; not an RCT.
  - openFDA: amycretin NOT_FOUND; pemvidutide / ALT-801 NOT_FOUND.
  - Linked `/peptides/amycretin`, `/peptides/pemvidutide`, `/compare/amycretin-vs-semaglutide`, `/compare/pemvidutide-vs-semaglutide` (no trailing slash). Did not edit those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (222 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: this filename gone (6 remaining mismatches are other amycretin census tables). Select-String: leftover census FAQ strings, Consult, Who Might, `dose`/`dosing`/`inject`/`protocol`, banned leftover percents, unescaped `P<`, `$1,000` — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `amycretin-vs-orforglipron.mdx`, `amycretin-vs-mazdutide.mdx`, `amycretin-vs-maritide.mdx`, `amycretin-vs-liraglutide.mdx`, KEEP `amycretin-vs-semaglutide.mdx` / `amycretin-vs-tirzepatide.mdx`, or `src/content/peptides/**`.
- Did not restore OSA 63%/6%, TRIUMPH 28.7%, REDEFINE 22.7/15.7/23–25.5, SYNCHRONY, MOMENTUM unpublished obesity %, or amycretin oral ~13/~25.
- Did not dump the 21-hit amycretin or 13-hit pemvidutide esearch into the page.
- Did not quote PMID 21994418 (wrong ALT-801), 35461369 (mouse), 41352959 (comment), or 41879841 (meta-analysis) as trial results.
- Did not invent MOMENTUM or PERFORMA percents.
- Did not invent CT.gov enrollment counts (API `statusModule` omitted `enrollmentInfo`).
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `amycretin-vs-pemvidutide.mdx` census FAQ (8/10 vs inverted 6/3) and source-count tables (11/10) stripped.
2. Oral first-in-human quoted as TEAE-primary; day-85 weight exploratory; abstract publishes **no** percent (PMID 40550229).
3. Subcutaneous phase 1b/2a quoted as secondary estimated mean 60 mg week 36 **−24.3% vs −1.1%** (PMID 40550231). Estimand not named.
4. IMPACT ITT MASH resolution **58%/52% vs 20%**; fibrosis co-primary **not met** (33%/36% vs 28%) (PMID 41237796). Re-fetched this increment.
5. MASLD papers quoted as **MRI-PDFF** liver-fat (PMID 39002641, 41113119). Weight −4.3% / −6.2% not treated as obesity Phase 3.
6. MOMENTUM NCT05295875: hasResults false; PubMed 0 on 2026-09-02. No unpublished obesity percent. H2H PubMed 1 review, not an RCT. openFDA 404 both compounds.
7. Links without trailing slash. P&lt; escaped. CRLF. No $1,000 row added or stripped. This file dropped off `qa:counts`; 6 mismatches remain on other amycretin census tables.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- CT.gov `enrollmentInfo` missing on fetched records — abstract n used for published trials; MOMENTUM n not invented.
- W3-M1 OAuth.
- Remaining unlocked census leftovers: `amycretin-vs-retatrutide`, `amycretin-vs-slu-pp-332`, `amycretin-vs-survodutide`. `amycretin-vs-orforglipron` locked to TICK53. `amycretin-vs-mazdutide` locked to TICK51/52. `amycretin-vs-maritide` locked to TICK50. `amycretin-vs-liraglutide` locked to TICK49.
