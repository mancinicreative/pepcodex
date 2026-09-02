# TICK66 — implementer note (not a KEEP)

Chosen file: `src/content/comparisons/aod-9604-vs-orforglipron.mdx`

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/aod-9604-vs-orforglipron.mdx`. Generated census stub (12/Low vs 37/High; 0 vs 28 human; Total Sources 12/37) plus combination FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK65.md was **absent** at dispatch and at close (Test-Path False). TICK64.md claims `5-amino-1mq-vs-mazdutide.mdx`. TICK63.md claims `5-amino-1mq-vs-liraglutide.mdx`. TICK62.md claims `5-amino-1mq-vs-maritide.mdx`. Hard-locked: TICK60 `5-amino-1mq-vs-ct-388`, TICK61 `5-amino-1mq-vs-aod-9604`, TICK58 `5-amino-1mq-vs-cagrilintide`, TICK59 `5-amino-1mq-vs-cagrisema`, TICK45 `5-amino-1mq-vs-semaglutide`, TICK47/48 `5-amino-1mq-vs-amycretin`, and `src/content/peptides/**`. The 5-amino family is crowded. Next unlocked leftover from the assigned set: `aod-9604-vs-orforglipron.mdx` (`lastUpdated` 2026-02-12, census FAQ 12/37 sources and 0/28 human, source-count tables, combination FAQ, consult footer). Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\aod-9604-vs-orforglipron.mdx
Test-Path src\content\peptides\aod-9604.mdx
Test-Path src\content\peptides\orforglipron.mdx
Test-Path src\content\comparisons\orforglipron-vs-semaglutide.mdx
Test-Path src\content\comparisons\amycretin-vs-orforglipron.mdx
Test-Path src\content\comparisons\amycretin-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-aod-9604.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK65.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK64.md
node .planning\seo-engine\runs\2026-09-01\_tick66-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick66-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick66-write.mjs
node scripts\qa-banned-content.js src\content\comparisons\aod-9604-vs-orforglipron.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
node .planning\seo-engine\runs\2026-09-01\_tick66-grep.mjs
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (aod-9604 / aod9604) / 200 (orforglipron generic; Foundayo brand; NDA220934). Fetch1 openFDA timed out (UND_ERR_CONNECT_TIMEOUT); fetch2 retried and succeeded. Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"AOD-9604"` count 16 — not dumped. `"AOD9604"` count 22 — not dumped. `"AOD 9604"` count 16. `"orforglipron"` count 128 — not dumped. `"LY3502970"` count 13. `"ATTAIN-1"` count 6. `"Foundayo"` count 6 (news/commentary; not quoted). `"AOD-9604" AND "orforglipron"` count 0. `"AOD9604" AND "orforglipron"` count 0. `"AOD-9604" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III" OR "phase 2")` count 1 (16625817). `"AOD9604"` with the same clinical-trial/phase-3 terms count 3 (42395176, 16931496, 16625817).

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 15134286 | AOD-9604 Metabolic | 2004 profile. Metabolic developing AOD-9604 for potential obesity treatment. By February 2002, **phase IIa trials were underway**. Abstract publishes **no enrollment, no percent**. |
| PMID 11146367 | Metabolic studies of a synthetic lipolytic domain (AOD9604) of human growth hormone | Obese Zucker **rats**. 19-day oral treatment. Weight-gain 15.8 ± 0.6 vs 35.6 ± 0.8 g. Not a human RCT percent. Treatment amount from the abstract not copied. |
| PMID 11673763 | Increase of fat oxidation and weight loss in obese mice… modified C-terminal fragment | **TITLE_MATCH false** (title does not name AOD). Abstract names **AOD9604**. Obese/lean **mice**, 14 days. Both hGH and AOD9604 reduced body-weight gain; increased fat oxidation. **No body-weight percent.** AOD9604 did not compete for the hGH receptor. |
| PMID 16625817 | Obesity drugs in clinical development | **TITLE_MATCH false.** 2006 review. Lists AOD-9604 among then-in-development obesity drugs. Of **that set**, only rimonabant had completed phase III. Not an AOD-9604 Phase 3 result. |
| PMID 25208511 | Detection and in vitro metabolism of AOD9604 | Identity: C-terminal hGH 177-191 + N-terminal tyrosine. Doping-detection methods. No efficacy percent. |
| PMID 40960239 NCT05869903 ATTAIN-1 | Orforglipron, an Oral Small-Molecule GLP-1 Receptor Agonist for Obesity Treatment | n=3127; 72 wk; obesity without diabetes. **Treatment-regimen** estimand, ITT. 6/12/36 mg **−7.5 / −8.4 / −11.2% vs −2.1%** (P&lt;0.001). At 36 mg ≥10/15/20% 54.6 / 36.0 / 18.4 vs 12.9 / 5.9 / 2.8. AE d/c 5.3–10.3% vs 2.7%. GI most common, mostly mild to moderate; **no nausea %**. CT.gov ACTIVE_NOT_RECRUITING Phase 3; enroll 3127 actual; hasResults **true**. Lead sponsor Eli Lilly. PubMed `NCT05869903` = 40960239 and sibling 42577069. |
| PMID 37351564 NCT05051579 | Daily Oral GLP-1 Receptor Agonist Orforglipron for Adults with Obesity | n=272. Wk 26 (primary) **−8.6% to −12.6% vs −2.0%**. Wk 36 (secondary) **−9.4% to −14.7% vs −2.3%**. ≥10% by wk 36: 46–75% vs 9%. GI d/c 10–17% across groups. Abstract does **not** publish a 36 mg vs 45 mg split or an HbA1c table. CT.gov COMPLETED Phase 2; enroll 272 actual; hasResults **true**. PubMed `NCT05051579` = 37351564 and sibling 40481478. |
| PMID 42577069 | Orforglipron for obesity treatment in older patients ≥65 years… ATTAIN-1 and ATTAIN-2 | Title match orforglipron. Post hoc subgroup. **Not quoted** as ATTAIN-1 primary. |
| PMID 40481478 | Treatment with orforglipron… CV risk biomarkers… | Title match orforglipron (via NCT search). Exploratory biomarkers. **Not quoted** as the obesity weight result. |
| PMID 42225305 | Oral Semaglutide 25 mg Versus Orforglipron 36 mg… Population-Adjusted Indirect Treatment Comparison | Title match orforglipron. **Not** an AOD-9604 trial. **Not** a randomised head-to-head. Not quoted as a trial result. |
| CT.gov search | AOD-9604 / AOD9604 / AOD 9604 | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic aod-9604 / aod9604 | Both **NOT_FOUND**. |
| openFDA drugsfda | generic orforglipron; brand Foundayo; NDA220934 | FOUNDAYO; sponsor ELI LILLY AND CO; ORIG 1 AP **20260401**. Tablet strengths not copied. |

## File

- `src/content/comparisons/aod-9604-vs-orforglipron.mdx`
  - Stripped census FAQ (12/Low vs 37/High; 0 vs 28 human), Evidence/Key Differences source-count tables (12/37), summary “12 total sources (0 human),” combination-as-unknown FAQ voice, and consult footer.
  - Dated AOD-9604 absence: PubMed aliases returned 16/22/16 hits, none a human obesity RCT percent; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted 2004 profile as phase IIa underway by February 2002 with **no percent**. Did not invent a human RCT percent.
  - Quoted rodent weight-gain figures as rodent only. Did not copy the rat treatment-amount line. Did not headline the abstract’s “over 50%” phrase as a human percent.
  - Quoted 2006 review as listing AOD-9604; only rimonabant in that set had completed phase III. That is not an AOD Phase 3 result.
  - Quoted ATTAIN-1 as **treatment-regimen** 36 mg week 72 **−11.2% vs −2.1%**. Did not collapse 6/12/36 mg into one headline percent.
  - Quoted phase 2 as the published week-36 **range −9.4% to −14.7% vs −2.3%**. Did **not** invent a 36 mg / 45 mg table.
  - Dated H2H absence: PubMed `"AOD-9604" AND "orforglipron"` and `"AOD9604" AND "orforglipron"` on 2026-09-02 returned 0.
  - openFDA: AOD-9604 / AOD9604 NOT_FOUND; Foundayo NDA 220934 ORIG AP 2026-04-01. Did not copy tablet strengths. Did not invent an AOD-9604 approval year.
  - Linked `/peptides/aod-9604`, `/peptides/orforglipron`, `/compare/amycretin-vs-aod-9604`, `/compare/5-amino-1mq-vs-aod-9604`, `/compare/amycretin-vs-orforglipron`, `/compare/orforglipron-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (190 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages). `_tick66-grep.mjs`: leftover census FAQ strings, Consult, Who Might, `dosing`/`inject`/`protocol`, unescaped `P<`, `$1,000`, trailing-slash hrefs — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `5-amino-1mq-vs-maritide.mdx`, `5-amino-1mq-vs-liraglutide.mdx`, `5-amino-1mq-vs-ct-388.mdx`, `5-amino-1mq-vs-aod-9604.mdx`, `5-amino-1mq-vs-cagrisema.mdx`, `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, `5-amino-1mq-vs-mazdutide.mdx`, other leftover `aod-9604-vs-*` census stubs, or `src/content/peptides/**`.
- Did not restore census 12/37 or 0/28, an invented AOD-9604 RCT percent, or an invented AOD-9604 obesity Phase 3.
- Did not cite PMID 26275694 (rabbit OA), PMID 24976118 / 24124033 (seized-prep / WADA immunoassay), PMID 16931496 / 17971763 / 22435392 / 42395176 (reviews) as trial results, PMID 42577069 (ATTAIN-1/2 ≥65 subgroup), PMID 40481478 (CV biomarkers), or PMID 42225305 (ITC) as a head-to-head RCT.
- Did not dump the 16/22-hit AOD or 128-hit orforglipron esearch into the page.
- Did not convert rat grams into a human percent.
- Did not copy Foundayo tablet strengths.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `aod-9604-vs-orforglipron.mdx` census FAQ (12/0 vs 37/28) and consult footer stripped. TICK64 locked `5-amino-1mq-vs-mazdutide.mdx`. TICK65.md absent.
2. AOD-9604: no human obesity RCT percent this run; CT.gov 0 as of 2026-09-02; 2004 profile says phase IIa underway by February 2002 with **no percent** (PMID 15134286).
3. Rodent only: rat 19-day weight-gain 15.8 ± 0.6 vs 35.6 ± 0.8 g (PMID 11146367); mouse weight-gain reduction with **no percent** (PMID 11673763).
4. ATTAIN-1 quoted as treatment-regimen **−11.2% vs −2.1%** at 36 mg / 72 weeks (PMID 40960239). Phase 2 quoted as week-36 range **−9.4% to −14.7% vs −2.3%** (PMID 37351564).
5. openFDA: AOD-9604 NOT_FOUND; Foundayo ORIG AP 2026-04-01. H2H PubMed 0. No invented AOD-9604 obesity Phase 3.
6. No $1,000 row present to keep or strip (TICK6-PRICE). Links without trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- TICK65.md still absent at close. Remaining unlocked census leftovers: other `aod-9604-vs-*` (except this file) and leftover `5-amino-1mq-vs-*` (except TICK45/47/48/58/59/60/61/62/63/64 files). One file per tick.
