# TICK56 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/amycretin-vs-slu-pp-332.mdx`. Generated census stub (8/Moderate vs 6/Very Low; inverted 4-vs-0 “more clinical evidence”; Human Studies 6 vs 0; Total Sources 11/6 vs summary 8/6). Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned `amycretin-vs-slu-pp-332.mdx` present (`lastUpdated` 2026-02-12, census FAQ, source-count tables, combination FAQ, consult footer). TICK54.md and TICK55.md were **absent** at first glob (Test-Path False), then appeared mid-increment. Read both: TICK54 took `amycretin-vs-pemvidutide.mdx`; TICK55 took `amycretin-vs-retatrutide.mdx`. Neither took this file or `amycretin-vs-survodutide.mdx`. Hard-locked: TICK54 pemvidutide, TICK55 retatrutide, TICK53 orforglipron, TICK51/52 mazdutide, KEEP semaglutide / tirzepatide, and `src/content/peptides/**`. This tick took the assigned leftover. Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\amycretin-vs-slu-pp-332.mdx
Test-Path src\content\comparisons\amycretin-vs-survodutide.mdx
Test-Path src\content\comparisons\amycretin-vs-pemvidutide.mdx
Test-Path src\content\comparisons\amycretin-vs-retatrutide.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK54.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK55.md
Test-Path src\content\peptides\slu-pp-332.mdx
Test-Path src\content\peptides\amycretin.mdx
node .planning\seo-engine\runs\2026-09-01\_tick56-fetch.mjs
node -e (esummary title parse of saved NCBI JSON)
node scripts\qa-banned-content.js src\content\comparisons\amycretin-vs-slu-pp-332.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

`_tick56-fetch.mjs` failed twice: `getaddrinfo EAI_AGAIN eutils.ncbi.nlm.nih.gov`. Local DNS search suffix mapped that host to `127.0.0.1`. Abstracts and registries were therefore fetched with WebFetch (HTTP 200 except openFDA 404 = NOT_FOUND):

- NCBI esearch `"SLU-PP-332"` count 10
- NCBI esearch `"amycretin"` count 21
- NCBI esearch `40550229[uid]`, `40550231[uid]`, `36988910` each count 1
- NCBI esearch `"amycretin" AND "SLU-PP-332"` count **0**
- NCBI esearch `"SLU-PP332"` count 0; `"SLUPP332"` / `"SLU PP-332"` count 10 (same id family)
- NCBI esearch `"SLU-PP-332" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III")` count **0**
- NCBI esummary of 10 SLU ids + 40550229 + 40550231
- NCBI efetch 40550229, 40550231, 36988910, 41850449, 37739806, 37961903, 41688415, 41588687
- NCBI esearch NCT05369390 → 40550229 only; NCT06064006 → 40550231 only
- CT.gov v2 NCT05369390, NCT06064006
- CT.gov `query.term=SLU-PP-332` and `SLUPP332` → empty `studies` arrays
- CT.gov `query.term=amycretin` (also listed NCT06049329 Japanese oral; **not** quoted)
- openFDA drugsfda amycretin / slu-pp-332 / slupp332 → HTTP 404 NOT_FOUND

Per-alias esearch (not OR-joined). Title or abstract named the compound before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

| Id | Title / topical match | What the fetch showed |
|---|---|---|
| PMID 40550229 NCT05369390 | Title names amycretin. First-in-human, phase 1… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; enroll 144 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT05369390` = 40550229 only. |
| PMID 40550231 NCT06064006 | Title names amycretin. Subcutaneous phase 1b/2a… | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 **−24.3% vs −1.1%**; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. Abstract does **not** name treatment-regimen. CT.gov COMPLETED Phase 2; enroll 125 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT06064006` = 40550231 only. |
| PMID 36988910 | Title does **not** contain SLU-PP-332. Abstract names it. | Mouse + cell-line ERR pan-agonist. Increased mitochondrial function / respiration in a skeletal-muscle cell line; increased type IIa fibers and exercise endurance in mice. **No human RCT percent. No body-weight percent.** |
| PMID 37739806 | Title does **not** contain SLU-PP-332. Abstract names it. | Diet-induced obese or ob/ob mice. Qualitative: energy expenditure, fatty-acid oxidation, decreased fat mass, reduced obesity, improved insulin sensitivity. **No numeric percent. Not a human RCT.** |
| PMID 41850449 | Title names SLU-PP-332. SAR / chemistry. | Scaffold optimization. No human RCT percent. **Not quoted as efficacy.** |
| PMID 41688415 | Title names SLU-PP-332. In-vitro metabolites. | Human liver S9 doping-control metabolites. No human RCT percent. **Not quoted as efficacy.** |
| PMID 41588687 | Title names SLU-PP-332 and SLU-PP-915. In-vitro. | Liver S9/HLM metabolites. No human RCT percent. **Not quoted as efficacy.** |
| PMID 37961903 | Title does **not** contain SLU-PP-332. Abstract names it + SLU-PP-915. | Mouse pressure-overload heart-failure model. **Not quoted as an obesity result.** |
| CT.gov SLU-PP-332 / SLUPP332 | n=0 studies | No NCT. Do **not** invent obesity Phase 3. |
| openFDA drugsfda | generic amycretin / slu-pp-332 / slupp332 | All **NOT_FOUND** (HTTP 404) on 2026-09-02. |

## File

- `src/content/comparisons/amycretin-vs-slu-pp-332.mdx`
  - Stripped census FAQ (8/6 sources; 4-vs-0 human; inverted evidence voice), Evidence/Key Differences source-count tables (11/6), summary “8 total sources (4 human)” / “6 total sources (0 human)”, combination-as-advice voice, and consult footer.
  - Quoted oral first-in-human as TEAE-primary with **no** abstract weight percent. Did not restore oral ~13/~25.
  - Quoted subcutaneous phase 1b/2a secondary estimated means with placebo. Escaped P&lt;. Did not invent an estimand label.
  - Quoted SLU-PP-332 mouse papers without inventing a ~ percent. No human RCT percent in fetched abstracts. Did not invent obesity Phase 3.
  - Dated H2H absence: PubMed `"amycretin" AND "SLU-PP-332"` on 2026-09-02 returned 0. PubMed SLU-PP-332 × randomized/clinical-trial/phase-3 returned 0. CT.gov SLU-PP-332/SLUPP332 empty.
  - openFDA: amycretin 404; SLU-PP-332 404. Did not invent an approval year.
  - Linked `/peptides/amycretin`, `/peptides/slu-pp-332`, `/compare/amycretin-vs-semaglutide` (no trailing slash). Did not edit those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (189 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (census rows gone). Select-String: leftover census FAQ strings, Consult, Who Might, ~13/~25, unescaped `P<`, `$1,000`, trailing-slash hrefs — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `amycretin-vs-pemvidutide.mdx`, `amycretin-vs-retatrutide.mdx`, `amycretin-vs-orforglipron.mdx`, `amycretin-vs-mazdutide.mdx`, KEEP `amycretin-vs-semaglutide` / `amycretin-vs-tirzepatide`, or `src/content/peptides/**`.
- Did not take `amycretin-vs-survodutide.mdx` (assigned file was present).
- Did not restore oral amycretin ~13/~25.
- Did not invent an SLU-PP-332 human weight percent or obesity Phase 3.
- Did not quote PMID 41850449 / 41688415 / 41588687 as efficacy, or PMID 37961903 as an obesity result.
- Did not dump the 21-hit amycretin or 10-hit SLU-PP-332 esearch into the page.
- Did not quote NCT06049329 (Japanese oral amycretin; no paper fetched this increment).
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Assigned leftover cleaned: `amycretin-vs-slu-pp-332.mdx` census FAQ (8/6 vs inverted 4/0) and source-count tables (11/6) stripped.
2. Oral first-in-human quoted as TEAE-primary; day-85 weight exploratory; abstract publishes **no** percent (PMID 40550229). Re-fetched.
3. Subcutaneous phase 1b/2a quoted as secondary estimated mean 60 mg week 36 **−24.3% vs −1.1%** (PMID 40550231). Estimand not named. No ~13/~25.
4. SLU-PP-332: PMID 36988910 and 37739806 name the compound in the abstract (titles do not). Mouse exercise-capacity / metabolic-syndrome findings; **no human RCT percent**. No invented ~ percent. No obesity Phase 3.
5. PubMed `"amycretin" AND "SLU-PP-332"` on 2026-09-02: 0. SLU-PP-332 × randomized/clinical-trial/phase-3: 0. CT.gov SLU-PP-332/SLUPP332: empty. openFDA both 404.
6. Links without trailing slash. P&lt; escaped. CRLF. No $1,000 row added or stripped.
7. This file dropped off `qa:counts`; sitewide `--strict` now PASS. Locked TICK54/55 files not opened.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Node NCBI fetch blocked on this machine (`eutils` DNS → 127.0.0.1). WebFetch used instead.
- Remaining unlocked census leftover at dispatch: `amycretin-vs-survodutide` (TICK55 did not take it).
