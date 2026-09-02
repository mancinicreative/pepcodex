# TICK50 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/amycretin-vs-maritide.mdx`. Census FAQ (8/Moderate vs 21/Moderate; inverted 6-vs-10 “more clinical evidence”; Total Sources 11/21 vs summary 8/21) plus consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK47.md + TICK49.md read first. Assigned `amycretin-vs-liraglutide.mdx` was already cleaned this session (`lastUpdated` 2026-09-02; SCALE kg / LEADER HR 0.87; no census). TICK49.md finished that file. Hard-locked: TICK48 `5-amino-1mq-vs-amycretin`, TICK46 `amycretin-vs-ct-388`, TICK45 `5-amino-1mq-vs-semaglutide`, TICK44 `amycretin-vs-aod-9604`, KEEP `amycretin-vs-semaglutide` / `amycretin-vs-tirzepatide`, files named in TICK47/TICK49, and `src/content/peptides/**`. Next named leftover: `amycretin-vs-maritide` (generated stub, `lastUpdated` 2026-02-12). Locked compares and peptide dossiers not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\peptides\amycretin.mdx
Test-Path src\content\peptides\maritide.mdx
Test-Path src\content\comparisons\amycretin-vs-liraglutide.mdx
Test-Path src\content\comparisons\amycretin-vs-semaglutide.mdx
Test-Path src\content\comparisons\maritide-vs-semaglutide.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK47.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK49.md
node .planning\seo-engine\runs\2026-09-01\_tick50-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick50-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick50-fetch3.mjs
node .planning\seo-engine\runs\2026-09-01\_tick50-fetch4.mjs
node scripts\qa-banned-content.js src\content\comparisons\amycretin-vs-maritide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (amycretin / maritide / maridebart / maridebart cafraglutide / amg 133 / amg133). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"amycretin"` count 21 — not dumped. `"MariTide"` / `"maritide"` count 7. `"AMG 133"` / `"AMG-133"` count 9. `"AMG133"` count 5. `"maridebart cafraglutide"` / `"maridebart"` count 13.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 NCT05369390 | Safety, tolerability, pharmacokinetics, and pharmacodynamics of the first-in-class GLP-1 and amylin receptor agonist, amycretin: a first-in-human… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT05369390` = 40550229 only. |
| PMID 40550231 NCT06064006 | Amycretin, a novel, unimolecular GLP-1 and amylin receptor agonist administered subcutaneously… | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 **−24.3% vs −1.1%**; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. Abstract does **not** name treatment-regimen. CT.gov COMPLETED Phase 2; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT06064006` = 40550231 only. |
| PMID 40549887 NCT05669599 | Once-Monthly Maridebart Cafraglutide for the Treatment of Obesity - A Phase 2 Trial | n=592. Primary = % body-weight change to week 52. Obesity cohort (465): **treatment-policy** (ITT) **−12.3%** (95% CI −15.0 to −9.7) **to −16.2%** (95% CI −18.9 to −13.5) vs **−2.5%** (95% CI −4.2 to −0.7). Obesity-diabetes (127): **−8.4%** (95% CI −11.0 to −5.7) **to −12.3%** (95% CI −15.3 to −9.2) vs **−1.7%** (95% CI −2.9 to −0.6). HbA1c treatment-policy −1.2 to −1.6 vs 0.1 percentage points. CT.gov COMPLETED Phase 2; hasResults **false**. PubMed `NCT05669599` = 40549887 only. |
| PMID 41941715 | Discovery of AMG 133, a Glucose-Dependent Insulinotropic Polypeptide Receptor Antagonist and Glucagon-Like Peptide 1 Receptor Agonist Antibody-Drug Conjugate… | Medicinal chemistry. Names AMG 133. No human RCT percent. States AMG 133 was in Phase III with a profile that may support monthly administration. Quoted as mechanism / development status only. |
| PMID 38316982 NCT04478708 | A GIPR antagonist conjugated to GLP-1 analogues… | **TITLE_MATCH false** (title does not name AMG 133 / MariTide / maridebart). Abstract names AMG 133 and NCT04478708; “dose-dependent weight loss”; **no percent**. Not quoted. PubMed `NCT04478708` = 38316982 only. CT.gov COMPLETED Phase 1; TEAE primary; hasResults **true**. No results-module percent quoted. |
| PMID 38388678 | Phase I results for AMG 133 | Title match. *Nat Rev Endocrinol* note. **No abstract numbers.** Not quoted. |
| NCT06858878 MARITIME-2 | Phase 3 maridebart cafraglutide in T2D + obesity/overweight | ACTIVE_NOT_RECRUITING. Primary = % body-weight change week 72. hasResults **false**. PubMed 0. Design only. |
| openFDA drugsfda | generic amycretin / maritide / maridebart / maridebart cafraglutide / amg 133 / amg133 | All **NOT_FOUND**. |

## File

- `src/content/comparisons/amycretin-vs-maritide.mdx`
  - Stripped census FAQ (8/21 sources; inverted 6-vs-10 human row), Evidence/Key Differences source-count tables (11/21), summary “8 total sources (4 human)” / “21 total sources (10 human),” and consult footer.
  - Quoted oral first-in-human as TEAE-primary with **no** abstract weight percent. Did not restore oral ~13/~25.
  - Quoted subcutaneous phase 1b/2a secondary estimated means with placebo. Escaped P&lt;. Did not invent an estimand label.
  - Quoted MariTide Phase 2 **treatment-policy** week-52 ranges (obesity and obesity-diabetes). Did **not** collapse either range into one percent.
  - Dated NCT04478708 / NCT06858878 absences (Phase 1 title-miss / no Phase 1 percent quoted; Phase 3 design-only; PubMed 0 on MARITIME-2).
  - openFDA: amycretin NOT_FOUND; maritide / maridebart / AMG 133 NOT_FOUND. No invented approval year.
  - Linked `/peptides/amycretin`, `/peptides/maritide`, `/compare/amycretin-vs-semaglutide`, `/compare/maritide-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (202 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS (rewrote “dose-ranging” / “starting dose” after first fail). `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: this filename gone (10 remaining mismatches are other `amycretin-vs-*` census stubs). Select-String: census FAQ strings, Consult, Who Might, ~13/~25, unescaped `P<`, trailing-slash hrefs, `$1,000` — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `5-amino-1mq-vs-amycretin.mdx`, `amycretin-vs-ct-388.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `amycretin-vs-aod-9604.mdx`, `amycretin-vs-liraglutide.mdx`, KEEP `amycretin-vs-semaglutide` / `amycretin-vs-tirzepatide`, or `src/content/peptides/**`.
- Did not restore oral amycretin ~13/~25.
- Did not cite PMID 38316982 (title miss) or PMID 38388678 (no numbers).
- Did not collapse MariTide −12.3% to −16.2% into one headline percent.
- Did not invent a MariTide Phase 3 result or an amycretin obesity Phase 3.
- Did not dump the 21-hit amycretin esearch into the page.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Assigned `amycretin-vs-liraglutide.mdx` already cleaned by TICK49; this tick cleaned unlocked leftover `amycretin-vs-maritide.mdx` (census FAQ 8/21 vs inverted 6/10; tables 11/21).
2. Oral amycretin: TEAE primary; day-85 weight exploratory; **no percent** in the abstract (PMID 40550229).
3. SC amycretin: 60 mg week 36 estimated mean **−24.3% vs −1.1%** (secondary; TEAE primary) (PMID 40550231). Estimand not named.
4. MariTide Phase 2: treatment-policy obesity cohort week 52 **−12.3% to −16.2% vs −2.5%** (PMID 40549887). Range not collapsed.
5. NCT04478708 Phase 1: title-miss PMID 38316982; no Phase 1 percent quoted. NCT06858878 MARITIME-2: hasResults false; PubMed 0. openFDA NOT_FOUND for both compounds.
6. No $1,000 row present or added. Links without trailing slash. P&lt; escaped. CRLF. No ~13/~25.
7. Implementer QA on this file passed; filename not in remaining `qa:counts` mismatches; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: `amycretin-vs-orforglipron`, `amycretin-vs-pemvidutide`, `amycretin-vs-retatrutide`, `amycretin-vs-slu-pp-332`, `amycretin-vs-survodutide` (and `amycretin-vs-mazdutide` if still a stub). One file per tick.
