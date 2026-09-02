# TICK53 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/amycretin-vs-orforglipron.mdx`. Generated census stub (8/Moderate vs 37/High; inverted 6-vs-28 “more clinical evidence”; Total Sources 11/37 vs summary 8/37) plus combination-as-advice FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned `amycretin-vs-orforglipron.mdx` present (`lastUpdated` 2026-02-12, census FAQ, source-count tables, combination FAQ, consult footer). TICK50.md (read) is on `amycretin-vs-maritide.mdx`. TICK52.md (read; was absent at first glob, then appeared) collided with TICK51 on **`amycretin-vs-mazdutide.mdx`**. Hard-locked: TICK51/TICK52 `amycretin-vs-mazdutide`, TICK50 `amycretin-vs-maritide`, TICK49 `amycretin-vs-liraglutide`, KEEP `amycretin-vs-semaglutide` / `amycretin-vs-tirzepatide`, and `src/content/peptides/**`. This tick took the assigned leftover. Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\amycretin-vs-orforglipron.mdx
Test-Path src\content\comparisons\amycretin-vs-mazdutide.mdx
Test-Path src\content\comparisons\amycretin-vs-maritide.mdx
Test-Path src\content\comparisons\amycretin-vs-liraglutide.mdx
Test-Path src\content\comparisons\amycretin-vs-semaglutide.mdx
Test-Path src\content\comparisons\amycretin-vs-tirzepatide.mdx
Test-Path src\content\peptides\amycretin.mdx
Test-Path src\content\peptides\orforglipron.mdx
Test-Path src\content\comparisons\orforglipron-vs-semaglutide.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK50.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK51.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK52.md
node .planning\seo-engine\runs\2026-09-01\_tick53-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick53-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick53-fetch3.mjs
node .planning\seo-engine\runs\2026-09-01\_tick53-fetch4.mjs
node .planning\seo-engine\runs\2026-09-01\_tick53-fetch5.mjs
node scripts\qa-banned-content.js src\content\comparisons\amycretin-vs-orforglipron.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (amycretin) / 200 (orforglipron generic; Foundayo brand; NDA220934). First openFDA pass timed out (UND_ERR_CONNECT_TIMEOUT); retry in `_tick53-fetch4.mjs` succeeded. Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"amycretin"` count 21 — not dumped. Esearch `"orforglipron"` count 128 — not dumped. `"LY3502970"` count 13. `"Foundayo"` count 6 (news/commentary; not quoted). `"ATTAIN-1"` count 6. `"amycretin" AND "orforglipron"` count 4.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 NCT05369390 | Safety, tolerability, pharmacokinetics, and pharmacodynamics of the first-in-class GLP-1 and amylin receptor agonist, amycretin: a first-in-human… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; enroll 144 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT05369390` = 40550229 only. |
| PMID 40550231 NCT06064006 | Amycretin, a novel, unimolecular GLP-1 and amylin receptor agonist administered subcutaneously… | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 **−24.3% vs −1.1%**; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. Abstract does **not** name treatment-regimen. CT.gov COMPLETED Phase 2; enroll 125 actual; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT06064006` = 40550231 only. |
| PMID 40960239 NCT05869903 ATTAIN-1 | Orforglipron, an Oral Small-Molecule GLP-1 Receptor Agonist for Obesity Treatment | n=3127; 72 wk; obesity without diabetes. **Treatment-regimen** estimand, ITT. 6/12/36 mg **−7.5 / −8.4 / −11.2% vs −2.1%** (P&lt;0.001). At 36 mg ≥10/15/20% 54.6 / 36.0 / 18.4 vs 12.9 / 5.9 / 2.8. AE d/c 5.3–10.3% vs 2.7%. GI most common, mostly mild to moderate; **no nausea %**. CT.gov ACTIVE_NOT_RECRUITING Phase 3; enroll 3127 actual; hasResults **true**. Lead sponsor Eli Lilly. PubMed `NCT05869903` = 40960239 and sibling 42577069. |
| PMID 37351564 NCT05051579 | Daily Oral GLP-1 Receptor Agonist Orforglipron for Adults with Obesity | n=272. Wk 26 (primary) **−8.6% to −12.6% vs −2.0%**. Wk 36 (secondary) **−9.4% to −14.7% vs −2.3%**. ≥10% by wk 36: 46–75% vs 9%. GI d/c 10–17% across groups. Abstract does **not** publish a 36 mg vs 45 mg split or an HbA1c table. CT.gov COMPLETED Phase 2; enroll 272 actual; hasResults **true**. PubMed `NCT05051579` = 37351564 and sibling 40481478. |
| PMID 42577069 | Orforglipron for obesity treatment in older patients ≥65 years… ATTAIN-1 and ATTAIN-2 | Title match orforglipron. Post hoc subgroup. Different mg labels (5.5 / 9 / 17.2). **Not quoted** as ATTAIN-1 primary. |
| PMID 40481478 | Treatment with orforglipron… CV risk biomarkers… | Title match orforglipron. Exploratory biomarkers; also NCT05048719. **Not quoted** as the obesity weight result. |
| PMIDs 42673585, 41948476, 41054801, 40949933 | `"amycretin" AND "orforglipron"` (count 4) | All **Review**. Titles name **neither** compound. **Not** a head-to-head RCT. Not quoted as trial results. |
| openFDA drugsfda | generic amycretin / orforglipron; brand Foundayo; NDA220934 | Amycretin **NOT_FOUND**. Orforglipron / Foundayo / NDA220934: FOUNDAYO; sponsor ELI LILLY AND CO; ORIG 1 AP **20260401**. Tablet strengths not copied. |

## File

- `src/content/comparisons/amycretin-vs-orforglipron.mdx`
  - Stripped census FAQ (8/37 sources; inverted 6-vs-28 human row), Evidence/Key Differences source-count tables (11/37), summary “8 total sources (4 human),” combination-as-advice voice, and consult footer.
  - Quoted oral first-in-human as TEAE-primary with **no** abstract weight percent. Did not restore oral ~13/~25.
  - Quoted subcutaneous phase 1b/2a secondary estimated means with placebo. Escaped P&lt;. Did not invent an estimand label.
  - Quoted ATTAIN-1 as **treatment-regimen** 36 mg week 72 **−11.2% vs −2.1%**. Did not collapse 6/12/36 mg into one percent.
  - Quoted phase 2 as the published week-36 **range −9.4% to −14.7% vs −2.3%**. Did **not** restore the overturned 36 mg −9.4% / 45 mg −10.1% table.
  - Dated H2H absence: PubMed `"amycretin" AND "orforglipron"` on 2026-09-02 returned 4 reviews; titles name neither compound; none is a randomised head-to-head obesity trial.
  - openFDA: amycretin NOT_FOUND; Foundayo NDA 220934 ORIG AP 2026-04-01. Did not copy tablet strengths. Did not invent an amycretin approval year.
  - Linked `/peptides/amycretin`, `/peptides/orforglipron`, `/compare/amycretin-vs-semaglutide`, `/compare/orforglipron-vs-semaglutide` (no trailing slash). Did not edit those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (196 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: this filename gone (8 remaining mismatches are other amycretin census stubs: pemvidutide, retatrutide, slu-pp-332, survodutide). Select-String: leftover census FAQ strings, Consult, Who Might, ~13/~25, unescaped `P<`, `$1,000`, trailing-slash hrefs — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `amycretin-vs-mazdutide.mdx` (TICK51 done / TICK52 collision), `amycretin-vs-maritide.mdx`, `amycretin-vs-liraglutide.mdx`, KEEP `amycretin-vs-semaglutide` / `amycretin-vs-tirzepatide`, or `src/content/peptides/**`.
- Did not restore oral amycretin ~13/~25 or the phase 2 36 mg / 45 mg HbA1c table.
- Did not dump the 21-hit amycretin or 128-hit orforglipron esearch into the page.
- Did not quote the four amycretin+orforglipron reviews as trial results.
- Did not quote sibling PMID 42577069 (ATTAIN-1/2 ≥65 subgroup) or PMID 40481478 (CV biomarkers).
- Did not copy Foundayo tablet strengths.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Assigned leftover cleaned: `amycretin-vs-orforglipron.mdx` census FAQ (8/37 vs inverted 6/28) and source-count tables (11/37) stripped.
2. Oral first-in-human quoted as TEAE-primary; day-85 weight exploratory; abstract publishes **no** percent (PMID 40550229).
3. Subcutaneous phase 1b/2a quoted as secondary estimated mean 60 mg week 36 **−24.3% vs −1.1%** (PMID 40550231). Estimand not named.
4. ATTAIN-1 quoted as treatment-regimen 36 mg week 72 **−11.2% vs −2.1%** (PMID 40960239). Re-fetched; not copied from TICK14.
5. Phase 2 quoted as week-36 range **−9.4% to −14.7% vs −2.3%** (PMID 37351564). Overturned 36 mg −9.4% / 45 mg −10.1% table not restored.
6. PubMed `"amycretin" AND "orforglipron"` on 2026-09-02: 4 reviews, no H2H RCT. openFDA: amycretin 404; Foundayo NDA 220934 ORIG AP 2026-04-01. Links without trailing slash. P&lt; escaped. CRLF. No $1,000 row added or stripped.
7. This file dropped off `qa:counts`; 8 mismatches remain on other amycretin census tables. TICK52’s mazdutide file not opened.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- TICK51 and TICK52 both wrote `amycretin-vs-mazdutide.mdx`; Judge should score that collision separately, not this tick.
- Remaining unlocked census leftovers: `amycretin-vs-pemvidutide`, `amycretin-vs-retatrutide`, `amycretin-vs-slu-pp-332`, `amycretin-vs-survodutide`.
