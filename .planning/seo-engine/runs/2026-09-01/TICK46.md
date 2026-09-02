# TICK46 — implementer note (not a KEEP)

Loop: L4 cited-only leftover census compare. One file: `src/content/comparisons/amycretin-vs-ct-388.mdx`. Census FAQ (8/Moderate vs 12/Moderate; inverted 4-vs-6 “more clinical evidence”) plus Total Sources 11/12 vs dossiers 12/12. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK44.md assigned `amycretin-vs-aod-9604.mdx`. TICK45.md (read after lock; `_tick45-fetch.mjs` was the only signal at start) assigned `5-amino-1mq-vs-semaglutide.mdx`. Those files were not opened. Locked: TICK43 `amycretin-vs-cagrisema`, TICK41 `amycretin-vs-cagrilintide`, TICK40 `amycretin-vs-vk2735`, TICK27 KEEP `amycretin-vs-semaglutide`, TICK20 KEEP `amycretin-vs-tirzepatide`, and `src/content/peptides/**`. This file was the next unlocked amycretin leftover: generated stub (`lastUpdated` 2026-02-12), census FAQ, source-count tables, truncated “$2.” overview, combination FAQ, and consult footer. No invented oral ~13/~25 rows were present to strip.

`src/content/peptides/**` not opened (path-checked only). TICK43–45 files not edited.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\peptides\amycretin.mdx
Test-Path src\content\peptides\ct-388.mdx
Test-Path src\content\comparisons\ct-388-vs-semaglutide.mdx
Test-Path src\content\comparisons\amycretin-vs-semaglutide.mdx
node scripts/qa-comparison-counts.mjs --strict
node .planning\seo-engine\runs\2026-09-01\_tick46-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick46-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick46-fetch3.mjs
node .planning\seo-engine\runs\2026-09-01\_tick46-fetch4.mjs
node scripts\qa-banned-content.js src\content\comparisons\amycretin-vs-ct-388.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (amycretin / ct-388 / ct388 / enicepatide / ro7795068). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"amycretin"` count 21 — not dumped. Esearch `"CT-388"` / `"CT388"` / `"CT 388"` count 2 each (41319798, 34176426). `"enicepatide"` / `"RO7795068"` = **0**.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 NCT05369390 | Safety, tolerability, pharmacokinetics, and pharmacodynamics of the first-in-class GLP-1 and amylin receptor agonist, amycretin: a first-in-human… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; enroll 144 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT05369390` = 40550229 only. |
| PMID 40550231 NCT06064006 | Amycretin, a novel, unimolecular GLP-1 and amylin receptor agonist administered subcutaneously… | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 **−24.3% vs −1.1%**; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. Abstract does **not** name treatment-regimen. CT.gov COMPLETED Phase 2; enroll 125 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT06064006` = 40550231 only. |
| PMID 41319798 NCT04838405 | Effects of CT-388, a once-weekly signaling-biased dual GLP-1/GIP receptor agonist, on weight loss and glycemic control… | Phase 1. Single-administration 0.5–7.5 mg or four once-weekly 5–12 mg. Day 29 mean percent change **−4.7% to −8.0% vs −0.5%**. Abstract does **not** publish per-arm percents and does **not** name an estimand. CT.gov COMPLETED Phase 1; enroll 129 actual; hasResults **false**. Primary on registry = TEAEs; body-weight change is secondary. Lead sponsor Carmot Therapeutics, Inc. PubMed `NCT04838405` = 41319798 only. |
| PMID 34176426 | Emerging glucagon-like peptide 1 receptor agonists for the treatment of obesity | 2022 pipeline review. Names CT-388 among many compounds. **Not quoted.** |
| NCT06525935 | Enicepatide (CT-388) obesity / overweight + comorbidity | COMPLETED Phase 2. Enroll 469 actual. Primary completion 2025-12-08 actual. hasResults **false**. PubMed 0. Other names CT-388 / RO7795068 / RG6640. Collaborator Hoffmann-La Roche. Design only. |
| NCT06628362 | Enicepatide (CT-388) overweight / obesity + T2D | ACTIVE_NOT_RECRUITING Phase 2. Enroll 447 actual. Primary completion 2026-05-29 actual. hasResults **false**. PubMed 0. Design only. |
| NCT07351045 / NCT07351058 | Enith1 / Enith2 Phase 3 (search list) | hasResults **false**. PubMed 0. Not quoted as results. |
| openFDA drugsfda | generic_name amycretin / ct-388 / ct388 / enicepatide / ro7795068 | All **NOT_FOUND**. |

## File

- `src/content/comparisons/amycretin-vs-ct-388.mdx`
  - Stripped census FAQ (8/12 sources; inverted 4-vs-6 human row), Evidence/Key Differences source-count tables (11/12), summary “8 total sources (4 human),” truncated “$2.” overview, combination-as-advice voice, and consult footer.
  - Quoted oral first-in-human as TEAE-primary with **no** abstract weight percent. Did not restore oral ~13/~25.
  - Quoted subcutaneous phase 1b/2a secondary estimated means with placebo. Escaped P&lt;. Did not invent an estimand label.
  - Quoted CT-388 Phase 1 day-29 range −4.7% to −8.0% vs −0.5%. Did not collapse the range. Estimand not named.
  - Dated NCT06525935 / NCT06628362 absences (hasResults false; PubMed 0 as of 2026-09-02). No unpublished Phase 2 percent.
  - Linked `/peptides/amycretin`, `/peptides/ct-388`, `/compare/amycretin-vs-semaglutide`, `/compare/ct-388-vs-semaglutide` (no trailing slash). Did not edit those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a Roche acquisition price.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (182 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: this filename gone (18 remaining mismatches are other amycretin census tables + `5-amino-1mq-vs-amycretin`). Grep: leftover census FAQ strings, Consult, Who Might, `dose`/`dosing`/`inject`/`protocol`, banned leftover percents, unescaped `P<`, trailing-slash hrefs — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `amycretin-vs-cagrisema.mdx`, `amycretin-vs-cagrilintide.mdx`, `amycretin-vs-vk2735.mdx`, `amycretin-vs-semaglutide.mdx`, `amycretin-vs-tirzepatide.mdx`, TICK44 `amycretin-vs-aod-9604.mdx`, TICK45 `5-amino-1mq-vs-semaglutide.mdx`, or `src/content/peptides/**`.
- Did not restore OSA 63%/6%, TRIUMPH 28.7%, REDEFINE 22.7/15.7/23–25.5, SYNCHRONY, MOMENTUM unpublished obesity, or amycretin oral ~13/~25.
- Did not dump the 21-hit amycretin esearch into the page.
- Did not quote PMID 34176426 or a Phase 2 / Phase 3 CT-388 percent.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `amycretin-vs-ct-388.mdx` census FAQ (8/12 vs inverted 4/6) and source-count tables (11/12) stripped.
2. Oral first-in-human quoted as TEAE-primary; day-85 weight exploratory; abstract publishes **no** percent (PMID 40550229).
3. Subcutaneous phase 1b/2a quoted as secondary estimated mean 60 mg week 36 **−24.3% vs −1.1%** (PMID 40550231). Estimand not named.
4. CT-388 Phase 1 quoted as day 29 mean **−4.7% to −8.0% vs −0.5%** (PMID 41319798). Range not collapsed. Estimand not named.
5. Phase 2 NCT06525935 / NCT06628362: hasResults false and PubMed 0 as of 2026-09-02; design only. No unpublished percent.
6. openFDA 404 for amycretin, CT-388, and enicepatide as of 2026-09-02. Links without trailing slash. P&lt; escaped. CRLF. No $1,000 row added or stripped.
7. This file dropped off `qa:counts`; 18 mismatches remain on other amycretin census tables plus `5-amino-1mq-vs-amycretin`.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: `amycretin-vs-liraglutide`, `amycretin-vs-maritide`, `amycretin-vs-mazdutide`, `amycretin-vs-orforglipron`, `amycretin-vs-pemvidutide`, `amycretin-vs-retatrutide`, `amycretin-vs-slu-pp-332`, `amycretin-vs-survodutide`, and `5-amino-1mq-vs-amycretin.mdx`.
