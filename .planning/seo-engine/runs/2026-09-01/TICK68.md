# TICK68 — implementer note (not a KEEP)

Chosen file: `src/content/comparisons/aod-9604-vs-cagrisema.mdx`

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/aod-9604-vs-cagrisema.mdx`. Generated census stub (12/Low vs 14/High; 0 vs 6 human; Total Sources 12/14) plus combination FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK67.md claims `aod-9604-vs-cagrilintide.mdx` (in progress at dispatch and still claimed at close). TICK66.md claims `aod-9604-vs-orforglipron.mdx`. TICK65.md claims `5-amino-1mq-vs-tirzepatide.mdx`. Hard-locked: TICK64 `5-amino-1mq-vs-mazdutide`, TICK63 `5-amino-1mq-vs-liraglutide`, TICK62 `5-amino-1mq-vs-maritide`, TICK61 `5-amino-1mq-vs-aod-9604`, TICK60 `5-amino-1mq-vs-ct-388`, TICK59 `5-amino-1mq-vs-cagrisema`, TICK58 `5-amino-1mq-vs-cagrilintide`, TICK45 `5-amino-1mq-vs-semaglutide`, TICK47/48 `5-amino-1mq-vs-amycretin`, and `src/content/peptides/**`. Next unlocked leftover from the preferred `aod-9604-vs-*` set: `aod-9604-vs-cagrisema.mdx` (`lastUpdated` 2026-02-12, census FAQ 12/14 sources and 0/6 human, source-count tables, combination FAQ, consult footer, “Phase 3 validated status”). Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
cmd /c "dir /b ...\comparisons\aod-9604-vs-*.mdx"
cmd /c "dir /b ...\comparisons\5-amino-1mq-vs-*.mdx"
cmd /c "dir /b ...\runs\2026-09-01\TICK6*.md"
Test-Path src\content\peptides\aod-9604.mdx
Test-Path src\content\peptides\cagrisema.mdx
Test-Path src\content\comparisons\amycretin-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-cagrisema.mdx
Test-Path src\content\comparisons\cagrisema-vs-semaglutide.mdx
Test-Path src\content\comparisons\aod-9604-vs-semaglutide.mdx
Test-Path src\content\comparisons\aod-9604-vs-cagrilintide.mdx
Test-Path src\content\comparisons\aod-9604-vs-cagrisema.mdx
node .planning\seo-engine\runs\2026-09-01\_tick68-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick68-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick68-write.mjs
node scripts\qa-banned-content.js src\content\comparisons\aod-9604-vs-cagrisema.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
node .planning\seo-engine\runs\2026-09-01\_tick68-grep.mjs
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200 (some 429 then retry 200). NCBI esummary STATUS 200. NCBI efetch STATUS 200 (some 429 then retry 200). CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (aod-9604 / aod9604 / cagrisema / cagrilintide) / 200 (semaglutide). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"AOD-9604"` count 16 — not dumped. `"AOD9604"` count 22 — not dumped. `"AOD 9604"` count 16. `"CagriSema"` count 70 — not dumped. `"cagrilintide" AND "semaglutide"` count 74 — not dumped. `"REDEFINE 1"` count 1 (40544433). `"AOD-9604" AND "CagriSema"` count 0. `"AOD9604" AND "CagriSema"` count 0. `"AOD-9604" AND "cagrilintide"` count 0. `"AOD-9604" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III" OR "phase 2")` count 1 (16625817). `"AOD9604"` with the same clinical-trial/phase-3 terms count 3 (42395176, 16931496, 16625817). `NCT05567796` count 2 (41328546, 40544433). `NCT05394519` count 1 (40544432).

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 15134286 | AOD-9604 Metabolic | 2004 profile. Metabolic developing AOD-9604 for potential obesity treatment. By February 2002, **phase IIa trials were underway**. Abstract publishes **no enrollment, no percent**. |
| PMID 11146367 | Metabolic studies of a synthetic lipolytic domain (AOD9604) of human growth hormone | Obese Zucker **rats**. 19-day oral treatment. Weight-gain 15.8 ± 0.6 vs 35.6 ± 0.8 g. Not a human RCT percent. Treatment-amount line from the abstract not copied. |
| PMID 11673763 | Increase of fat oxidation and weight loss in obese mice… modified C-terminal fragment | **TITLE_MATCH false** (title does not name AOD). Abstract names **AOD9604**. Obese/lean **mice**, 14 days. Both hGH and AOD9604 reduced body-weight gain; increased fat oxidation. **No body-weight percent.** AOD9604 did not compete for the hGH receptor. |
| PMID 16625817 | Obesity drugs in clinical development | **TITLE_MATCH false.** 2006 review. Lists AOD-9604 among then-in-development obesity drugs. Of **that set**, only rimonabant had completed phase III. Not an AOD-9604 Phase 3 result. |
| PMID 25208511 | Detection and in vitro metabolism of AOD9604 | Identity: C-terminal hGH 177-191 + N-terminal tyrosine. Doping-detection methods. No efficacy percent. |
| PMID 40544433 NCT05567796 REDEFINE 1 | Coadministered Cagrilintide and Semaglutide in Adults with Overweight or Obesity | n=3417 (2108 / 302 / 302 / 705). 68 wk. **Treatment-policy.** CagriSema **−20.4% vs −3.0%** (ETD −17.3; CI −18.1 to −16.6; P&lt;0.001). Cagrilintide-alone and semaglutide-alone arms named; **abstract does not publish those percents**. GI 79.6% vs 39.9%. CT.gov ACTIVE_NOT_RECRUITING Phase 3; hasResults **false**. Lead sponsor Novo Nordisk A/S. enrollmentInfo absent from the returned payload; n=3417 is from the journal abstract. PubMed `NCT05567796` = 41328546, 40544433. |
| PMID 40544432 NCT05394519 REDEFINE 2 | Cagrilintide-Semaglutide in Adults with Overweight or Obesity and Type 2 Diabetes | n=1206 (904 / 302). 68 wk. **Treatment-policy.** **−13.7% vs −3.4%** (ETD −10.4; CI −11.2 to −9.5; P&lt;0.001). HbA1c ≤6.5% 73.5% vs 15.9%. GI 72.5% vs 34.4%. Abstract does **not** state a trial-product percent. CT.gov COMPLETED Phase 3; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT05394519` = 40544432 only. |
| PMID 41328546 NCT05567796 | CagriSema Reduces Blood Pressure… REDEFINE 1 | Blood-pressure secondary/post hoc. **Not** quoted as a weight-change result. Not used for a monotherapy percent. |
| PMID 16931496 | Potential role of new therapies… overweight patients | **TITLE_MATCH false.** 2006 review. Lists AOD9604 among compounds then “in clinical trials.” No AOD percent. Not quoted as a trial result. |
| CT.gov search | AOD-9604 / AOD9604 / AOD 9604 | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic aod-9604 / aod9604 / cagrisema / cagrilintide | All **NOT_FOUND**. |
| openFDA drugsfda | generic semaglutide | Found (Ozempic / Rybelsus; NDA 213051 ORIG AP **2019-09-20**). Not a CagriSema application. |

## File

- `src/content/comparisons/aod-9604-vs-cagrisema.mdx`
  - Stripped census FAQ (12/Low vs 14/High; 0 vs 6 human), Evidence/Key Differences source-count tables (12/14), summary “12 total sources (0 human),” combination-as-unknown FAQ voice, consult footer, and “Phase 3 validated status.”
  - Dated AOD-9604 absence: PubMed aliases returned 16/22/16 hits, none a human obesity RCT percent; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted 2004 profile as phase IIa underway by February 2002 with **no percent**. Did not invent a human RCT percent.
  - Quoted rodent weight-gain figures as rodent only. Did not copy the rat treatment-amount line. Did not headline the abstract’s “over 50%” phrase as a human percent.
  - Quoted 2006 review as listing AOD-9604; only rimonabant in that set had completed phase III. That is not an AOD Phase 3 result.
  - Quoted REDEFINE 1 as **treatment-policy −20.4% vs −3.0%**. Escaped P&lt;. Did not invent monotherapy percents or 22.7.
  - Quoted REDEFINE 2 as **treatment-policy −13.7% vs −3.4%**. Did not invent a trial-product percent.
  - Dated H2H absence: PubMed `"AOD-9604" AND "CagriSema"`, `"AOD9604" AND "CagriSema"`, and `"AOD-9604" AND "cagrilintide"` on 2026-09-02 returned 0.
  - openFDA: AOD-9604 / AOD9604 NOT_FOUND; cagrisema / cagrilintide NOT_FOUND. Semaglutide products labelled as not CagriSema.
  - Linked `/peptides/aod-9604`, `/peptides/cagrisema`, `/compare/amycretin-vs-aod-9604`, `/compare/5-amino-1mq-vs-aod-9604`, `/compare/5-amino-1mq-vs-cagrisema`, `/compare/cagrisema-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (190 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages). `_tick68-grep.mjs`: leftover census FAQ strings, Consult, Who Might, `dosing`/`dose`/`inject`/`protocol`, unescaped `P<`, `$1,000`, trailing-slash hrefs — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `aod-9604-vs-cagrilintide.mdx`, `aod-9604-vs-orforglipron.mdx`, `5-amino-1mq-vs-tirzepatide.mdx`, `5-amino-1mq-vs-mazdutide.mdx`, `5-amino-1mq-vs-liraglutide.mdx`, `5-amino-1mq-vs-maritide.mdx`, `5-amino-1mq-vs-ct-388.mdx`, `5-amino-1mq-vs-aod-9604.mdx`, `5-amino-1mq-vs-cagrisema.mdx`, `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, other leftover `aod-9604-vs-*` census stubs, or `src/content/peptides/**`.
- Did not restore census 12/14 or 0/6, an invented AOD-9604 RCT percent, or an invented AOD-9604 obesity Phase 3.
- Did not cite PMID 26275694 (rabbit OA), PMID 24976118 / 24124033 (seized-prep / WADA immunoassay), PMID 41966639 / 41490200 (sports/ortho reviews), PMID 42395176 / 16931496 as trial results, or PMID 41328546 (BP paper) as a weight result.
- Did not dump the 16/22-hit AOD or 70-hit CagriSema esearch into the page.
- Did not convert rat grams into a human percent.
- Did not quote cagrilintide-alone or semaglutide-alone percents from REDEFINE 1.
- Did not invent a CT.gov enrollment field (enrollmentInfo was absent from the returned payload; n=3417 / n=1206 are from the journal abstracts).
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `aod-9604-vs-cagrisema.mdx` census FAQ (12/0 vs 14/6) and consult footer stripped. TICK67 locked `aod-9604-vs-cagrilintide.mdx`. TICK66 locked `aod-9604-vs-orforglipron.mdx`.
2. AOD-9604: no human obesity RCT percent this run; CT.gov 0 as of 2026-09-02; 2004 profile says phase IIa underway by February 2002 with **no percent** (PMID 15134286).
3. Rodent only: rat 19-day weight-gain 15.8 ± 0.6 vs 35.6 ± 0.8 g (PMID 11146367); mouse weight-gain reduction with **no percent** (PMID 11673763).
4. REDEFINE 1 quoted as treatment-policy **−20.4% vs −3.0%** at 68 weeks (PMID 40544433). REDEFINE 2 quoted as **−13.7% vs −3.4%** (PMID 40544432).
5. openFDA: AOD-9604 NOT_FOUND; cagrisema / cagrilintide NOT_FOUND. H2H PubMed 0. No invented AOD-9604 obesity Phase 3.
6. No $1,000 row present to keep or strip (TICK6-PRICE). Links without trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `aod-9604-vs-*` (except TICK66 orforglipron, TICK67 cagrilintide, this file) and leftover `5-amino-1mq-vs-*` (except TICK45/47/48/58/59/60/61/62/63/64/65 files). One file per tick.
