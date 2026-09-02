# TICK71 — implementer note (not a KEEP)

Chosen file: `src/content/comparisons/aod-9604-vs-liraglutide.mdx`

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/aod-9604-vs-liraglutide.mdx`. Generated census stub (12/Low vs 18/High; 0 vs 12 human; Total Sources 12/18) plus combination FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK70.md claims `aod-9604-vs-tirzepatide.mdx`. TICK69.md claims `aod-9604-vs-ct-388.mdx`. TICK68.md claims `aod-9604-vs-cagrisema.mdx`. TICK67.md claims `aod-9604-vs-cagrilintide.mdx`. TICK66.md claims `aod-9604-vs-orforglipron.mdx`. Hard-locked also: TICK65 `5-amino-1mq-vs-tirzepatide`, TICK64 `5-amino-1mq-vs-mazdutide`, TICK63 `5-amino-1mq-vs-liraglutide`, TICK62 `5-amino-1mq-vs-maritide`, TICK60 `5-amino-1mq-vs-ct-388`, TICK61 `5-amino-1mq-vs-aod-9604`, TICK58 `5-amino-1mq-vs-cagrilintide`, TICK59 `5-amino-1mq-vs-cagrisema`, TICK45 `5-amino-1mq-vs-semaglutide`, TICK47/48 `5-amino-1mq-vs-amycretin`, and `src/content/peptides/**`. Next unlocked leftover from the preferred `aod-9604-vs-*` set: `aod-9604-vs-liraglutide.mdx` (`lastUpdated` 2026-02-12, census FAQ 12/18 sources and 0/12 human, source-count tables, combination FAQ, consult footer, “Phase 3 validated status”). Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\peptides\aod-9604.mdx
Test-Path src\content\peptides\liraglutide.mdx
Test-Path src\content\comparisons\amycretin-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-liraglutide.mdx
Test-Path src\content\comparisons\liraglutide-vs-semaglutide.mdx
Test-Path src\content\comparisons\liraglutide-vs-tirzepatide.mdx
Test-Path src\content\comparisons\aod-9604-vs-semaglutide.mdx
Test-Path src\content\comparisons\aod-9604-vs-liraglutide.mdx
node .planning\seo-engine\runs\2026-09-01\_tick71-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick71-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick71-write.mjs
node scripts\qa-banned-content.js src\content\comparisons\aod-9604-vs-liraglutide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
node .planning\seo-engine\runs\2026-09-01\_tick71-grep.mjs
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200 (plain-text SCALE/LEADER abstracts truncated by collaborator lists; XML re-fetch STATUS 200). CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (aod-9604 / aod9604) / 200 (liraglutide generic; Victoza brand; Saxenda brand; NDA022341; NDA206321). Fetch1 openFDA timed out (UND_ERR_CONNECT_TIMEOUT); fetch2 retried and succeeded. Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"AOD-9604"` count 16 — not dumped. `"AOD9604"` count 22 — not dumped. `"AOD 9604"` count 16. `"AOD-9604" AND "liraglutide"` count 2 (16625817, 14571286). `"AOD9604" AND "liraglutide"` count 2 (same). `"SCALE Obesity and Prediabetes"` count 2 (26510028, 26132939). `"LEADER" AND liraglutide AND cardiovascular` count 148 — not dumped. `"AOD-9604" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III" OR "phase 2")` count 1 (16625817). `"AOD9604"` with the same clinical-trial/phase-3 terms count 3 (42395176, 16931496, 16625817). `NCT01272219` count 7. `NCT01179048` count 37.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 15134286 | AOD-9604 Metabolic | 2004 profile. Metabolic developing AOD-9604 for potential obesity treatment. By February 2002, **phase IIa trials were underway**. Abstract publishes **no enrollment, no percent**. |
| PMID 11146367 | Metabolic studies of a synthetic lipolytic domain (AOD9604) of human growth hormone | Obese Zucker **rats**. 19-day oral treatment. Weight-gain 15.8 ± 0.6 vs 35.6 ± 0.8 g. Not a human RCT percent. Treatment-amount line from the abstract not copied. |
| PMID 11673763 | Increase of fat oxidation and weight loss in obese mice… modified C-terminal fragment | **TITLE_MATCH false** (title does not name AOD). Abstract names **AOD9604**. Obese/lean **mice**, 14 days. Both hGH and AOD9604 reduced body-weight gain; increased fat oxidation. **No body-weight percent.** AOD9604 did not compete for the hGH receptor. |
| PMID 16625817 | Obesity drugs in clinical development | **TITLE_MATCH false.** 2006 review. Lists AOD-9604 among then-in-development obesity drugs and lists liraglutide among GLP-1 analogues then in development. Of **that set**, only rimonabant had completed phase III. Not an AOD-9604 Phase 3 result. Not an H2H RCT. |
| PMID 14571286 | Gateways to clinical trials | **TITLE_MATCH false.** 2003 catalog listing. Names AOD-9604 and liraglutide among many other compounds. **No trial percent.** Not an H2H RCT. |
| PMID 25208511 | Detection and in vitro metabolism of AOD9604 | Identity: C-terminal hGH 177-191 + N-terminal tyrosine. Doping-detection methods. No efficacy percent. |
| PMID 26132939 NCT01272219 SCALE | A Randomized, Controlled Trial of 3.0 mg of Liraglutide in Weight Management | n=3731; 56 wk; no T2D. 2:1 (2487 / 1244). Coprimary = body-weight change and ≥5% / >10% responders. Mean **−8.4±7.3 kg vs −2.8±6.5 kg** (difference −5.6 kg; 95% CI −6.0 to −5.1; P&lt;0.001, **LOCF**). ≥5% 63.2% vs 27.1%. >10% 33.1% vs 10.6%. Abstract reports **kg, not a mean percent**. Estimand not named as treatment-regimen. Serious events 6.2% vs 5.0%. CT.gov COMPLETED Phase 3; hasResults **true**. Lead sponsor Novo Nordisk A/S. enrollmentInfo **absent** from this run’s NCT payload; n=3731 is from the journal abstract. PubMed `NCT01272219` count 7; this page quotes 26132939 only. |
| PMID 27295427 NCT01179048 LEADER | Liraglutide and Cardiovascular Outcomes in Type 2 Diabetes | n=9340; median 3.8 yr. Primary MACE 608/4668 (13.0%) vs 694/4672 (14.9%); HR **0.87** (95% CI 0.78–0.97); P&lt;0.001 noninferiority; P=0.01 superiority. CV death 219 (4.7%) vs 278 (6.0%); HR 0.78 (95% CI 0.66–0.93). All-cause death 381 (8.2%) vs 447 (9.6%); HR 0.85 (95% CI 0.74–0.97). CT.gov COMPLETED Phase 3; hasResults **true**. Lead sponsor Novo Nordisk A/S. enrollmentInfo **absent** from this run’s NCT payload; n=9340 is from the journal abstract. |
| PMID 26510028 | Liraglutide in Weight Management | 2015 letter. **No abstract.** Not quoted. |
| CT.gov search | AOD-9604 / AOD9604 / AOD 9604 | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic aod-9604 / aod9604 | Both **NOT_FOUND**. |
| openFDA drugsfda | generic liraglutide; brand Victoza / Saxenda; NDA022341 / NDA206321 | Victoza NDA022341 ORIG AP **2010-01-25**. Saxenda NDA206321 ORIG AP **2014-12-23**. Generic-name hit also returned later ANDAs and Xultophy; those are not quoted as SCALE/LEADER. |

## File

- `src/content/comparisons/aod-9604-vs-liraglutide.mdx`
  - Stripped census FAQ (12/Low vs 18/High; 0 vs 12 human), Evidence/Key Differences source-count tables (12/18), summary “12 total sources (0 human),” combination-as-unknown FAQ voice, consult footer, and “Phase 3 validated status.”
  - Dated AOD-9604 absence: PubMed aliases returned 16/22/16 hits, none a human obesity RCT percent; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted 2004 profile as phase IIa underway by February 2002 with **no percent**. Did not invent a human RCT percent.
  - Quoted rodent weight-gain figures as rodent only. Did not copy the rat treatment-amount line. Did not headline the abstract’s “over 50%” phrase as a human percent.
  - Quoted 2006 review as listing AOD-9604; only rimonabant in that set had completed phase III. That is not an AOD Phase 3 result.
  - Quoted SCALE as LOCF kilograms (−8.4 vs −2.8) plus responder percents from the abstract. Did **not** convert kilograms into a mean percent. Estimand not named.
  - Quoted LEADER hazard ratios. Did not headline a rounded relative-risk percent.
  - Dated H2H: PubMed `"AOD-9604" AND "liraglutide"` and `"AOD9604" AND "liraglutide"` on 2026-09-02 each returned 2 records (16625817, 14571286). Both are listings, not a randomised H2H obesity RCT.
  - openFDA: AOD-9604 / AOD9604 NOT_FOUND; Victoza / Saxenda original approvals dated from ORIG AP fields.
  - Linked `/peptides/aod-9604`, `/peptides/liraglutide`, `/compare/amycretin-vs-aod-9604`, `/compare/5-amino-1mq-vs-aod-9604`, `/compare/5-amino-1mq-vs-liraglutide`, `/compare/aod-9604-vs-semaglutide`, `/compare/liraglutide-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (199 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages). `_tick71-grep.mjs`: leftover census FAQ strings, Consult, Who Might, `dosing`/`dose`/`inject`/`protocol`, unescaped `P<`, `$1,000`, trailing-slash hrefs — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `aod-9604-vs-tirzepatide.mdx`, `aod-9604-vs-ct-388.mdx`, `aod-9604-vs-cagrisema.mdx`, `aod-9604-vs-cagrilintide.mdx`, `aod-9604-vs-orforglipron.mdx`, `5-amino-1mq-vs-tirzepatide.mdx`, `5-amino-1mq-vs-mazdutide.mdx`, `5-amino-1mq-vs-liraglutide.mdx`, `5-amino-1mq-vs-maritide.mdx`, `5-amino-1mq-vs-ct-388.mdx`, `5-amino-1mq-vs-aod-9604.mdx`, `5-amino-1mq-vs-cagrisema.mdx`, `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, other leftover `aod-9604-vs-*` census stubs, or `src/content/peptides/**`.
- Did not restore census 12/18 or 0/12, an invented AOD-9604 RCT percent, or an invented AOD-9604 obesity Phase 3.
- Did not cite PMID 26275694 (rabbit OA), PMID 24976118 / 24124033 (seized-prep / WADA immunoassay), PMID 41966639 / 41490200 (sports/ortho reviews), PMID 42395176 / 16931496 as trial results, or PMID 26510028 (letter, no abstract).
- Did not dump the 16/22-hit AOD or 148-hit LEADER esearch into the page.
- Did not convert rat grams or SCALE kilograms into a human percent.
- Did not invent a CT.gov enrollment field (enrollmentInfo was absent from the returned payload; n=3731 / n=9340 are from the journal abstracts).
- Did not treat the two co-mention listings as an H2H RCT.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `aod-9604-vs-liraglutide.mdx` census FAQ (12/0 vs 18/12) and consult footer stripped. TICK70 locked `aod-9604-vs-tirzepatide.mdx`. TICK69 locked `aod-9604-vs-ct-388.mdx`. TICK68 locked `aod-9604-vs-cagrisema.mdx`.
2. AOD-9604: no human obesity RCT percent this run; CT.gov 0 as of 2026-09-02; 2004 profile says phase IIa underway by February 2002 with **no percent** (PMID 15134286).
3. Rodent only: rat 19-day weight-gain 15.8 ± 0.6 vs 35.6 ± 0.8 g (PMID 11146367); mouse weight-gain reduction with **no percent** (PMID 11673763).
4. SCALE quoted as LOCF **−8.4 kg vs −2.8 kg** at 56 weeks (PMID 26132939). Abstract has no mean percent; kilograms not converted.
5. LEADER quoted as HR **0.87** (95% CI 0.78–0.97) (PMID 27295427). No rounded relative-risk headline.
6. openFDA: AOD-9604 NOT_FOUND; Victoza ORIG AP 2010-01-25; Saxenda ORIG AP 2014-12-23. H2H PubMed 2 listings, not an RCT. No invented AOD-9604 obesity Phase 3. No $1,000 row (TICK6-PRICE). Links without trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `aod-9604-vs-*` (except TICK66 orforglipron, TICK67 cagrilintide, TICK68 cagrisema, TICK69 ct-388, TICK70 tirzepatide, and this file) and leftover `5-amino-1mq-vs-*` (except TICK45/47/48/58/59/60/61/62/63/64/65 files). One file per tick.
