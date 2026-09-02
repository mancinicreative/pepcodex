# TICK63 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/5-amino-1mq-vs-liraglutide.mdx`. Generated census stub (11/Low vs 18/High; 0 vs 12 human; Total Sources 11/18) plus combination FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK60.md assigned `5-amino-1mq-vs-ct-388.mdx`. TICK61.md assigned `5-amino-1mq-vs-aod-9604.mdx`. TICK62.md claimed `5-amino-1mq-vs-ct-388.mdx` again (TICK60 already took it; TICK62.md is a stub). Hard-locked: TICK61 `5-amino-1mq-vs-aod-9604`, TICK59 `5-amino-1mq-vs-cagrisema`, TICK58 `5-amino-1mq-vs-cagrilintide`, TICK60/62 `5-amino-1mq-vs-ct-388`, TICK45 `5-amino-1mq-vs-semaglutide`, TICK47/48 `5-amino-1mq-vs-amycretin`, TICK44 `amycretin-vs-aod-9604`, and `src/content/peptides/**`. Next unlocked generated census stub from the assigned leftover set: `5-amino-1mq-vs-liraglutide.mdx` (`lastUpdated` 2026-02-12, census FAQ 11/18 sources and 0/12 human, source-count tables, combination FAQ, consult footer). Locked compares and peptide dossiers were not opened (path-checked only). No `aod-9604-vs-*` file was taken this tick.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
node .planning\seo-engine\runs\2026-09-01\_tick63-inventory.mjs
Test-Path src\content\comparisons\5-amino-1mq-vs-liraglutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-cagrisema.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-cagrilintide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-ct-388.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-semaglutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-amycretin.mdx
Test-Path src\content\comparisons\amycretin-vs-aod-9604.mdx
Test-Path src\content\comparisons\liraglutide-vs-semaglutide.mdx
Test-Path src\content\peptides\5-amino-1mq.mdx
Test-Path src\content\peptides\liraglutide.mdx
node .planning\seo-engine\runs\2026-09-01\_tick63-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick63-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick63-fetch3.mjs
node .planning\seo-engine\runs\2026-09-01\_tick63-write.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-liraglutide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
node .planning\seo-engine\runs\2026-09-01\_tick63-grep.mjs
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200 (429 then retry on 39067875 / 26132939 / 27295427). CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (5-amino-1mq / 5-amino-1-methylquinolinium) / 200 (liraglutide generic; Victoza brand; Saxenda brand; NDA022341; NDA206321). fetch2 openFDA app lookup timed out after abstracts + CT.gov; fetch3 retried NDA022341 / NDA206321 (STATUS 200). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"5-Amino-1MQ"` count 0. `"5-amino-1-MQ"` count 0. `"5-Amino-1-methylquinolinium"` count 3 (39067875, 35013352, 33645410). `"SCALE Obesity and Prediabetes"` count 2 (26510028, 26132939). `"SCALE" AND liraglutide AND obesity` count 101 — not dumped. `"LEADER" AND liraglutide AND cardiovascular` count 148 — not dumped. `"5-Amino-1MQ" AND "liraglutide"` count 0. `"5-amino-1-methylquinolinium" AND "liraglutide"` count 0. `NCT01272219` count 7. `NCT01179048` count 37.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice | DIO mice. Abstract names **5-amino-1-methylquinolinium** as the NNMTi used with a low-fat diet. Describes adiposity/weight change vs diet switch alone. **No body-weight percent.** Not a human RCT. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT in cancer-associated fibroblasts… urothelial bladder cancer | Title-matched NNMT. Used 5-Amino-1-methylquinolinium iodide in UBC mouse models. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase shows anti-proliferative activity in HeLa cells | **TITLE_MATCH false** (title does not name 5-amino). HeLa cells. Not quoted. |
| PMID 26132939 NCT01272219 SCALE | A Randomized, Controlled Trial of 3.0 mg of Liraglutide in Weight Management | n=3731; 56 wk; no T2D. 2:1 (2487 / 1244). Coprimary = body-weight change and ≥5% / >10% responders. Mean **−8.4±7.3 kg vs −2.8±6.5 kg** (difference −5.6 kg; 95% CI −6.0 to −5.1; P&lt;0.001, **LOCF**). ≥5% 63.2% vs 27.1%. >10% 33.1% vs 10.6%. Abstract reports **kg, not a mean percent**. Estimand not named as treatment-regimen. CT.gov COMPLETED Phase 3; enroll 3731 actual; hasResults **true**. Lead sponsor Novo Nordisk A/S. PubMed `NCT01272219` count 7; this page quotes 26132939 only. |
| PMID 26510028 | Liraglutide in Weight Management | 2015 letter. **No abstract.** Not quoted. |
| PMID 27295427 NCT01179048 LEADER | Liraglutide and Cardiovascular Outcomes in Type 2 Diabetes | n=9340; median 3.8 yr. Primary MACE 608/4668 (13.0%) vs 694/4672 (14.9%); HR **0.87** (95% CI 0.78–0.97); P&lt;0.001 noninferiority; P=0.01 superiority. CV death 219 (4.7%) vs 278 (6.0%); HR 0.78 (95% CI 0.66–0.93). CT.gov COMPLETED Phase 3; enroll 9341 actual; hasResults **true**. Lead sponsor Novo Nordisk A/S. |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium | Both **NOT_FOUND**. |
| openFDA drugsfda | generic liraglutide; brand Victoza / Saxenda; NDA022341 / NDA206321 | Victoza NDA022341 ORIG AP **2010-01-25**. Saxenda NDA206321 ORIG AP **2014-12-23**. |

## File

- `src/content/comparisons/5-amino-1mq-vs-liraglutide.mdx`
  - Stripped census FAQ (11/Low vs 18/High; 0 vs 12 human), Evidence/Key Differences source-count tables (11/18), summary “11 total sources (0 human),” combination-as-unknown FAQ voice, and consult footer.
  - Dated 5-Amino-1MQ absence: street-name PubMed 0; chemical-name 3 hits, none a human obesity RCT; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted DIO mouse paper as naming the compound with **no percent**. Did not invent a mouse or human RCT percent.
  - Quoted SCALE as LOCF kilograms (−8.4 vs −2.8) plus responder percents from the abstract. Did **not** convert kilograms into a mean percent. Estimand not named.
  - Quoted LEADER hazard ratios. Did not headline a rounded relative-risk percent.
  - Dated H2H absence: PubMed `"5-Amino-1MQ" AND "liraglutide"` and `"5-amino-1-methylquinolinium" AND "liraglutide"` on 2026-09-02 returned 0.
  - openFDA: 5-amino NOT_FOUND; Victoza / Saxenda original approvals dated from ORIG AP fields.
  - Linked `/peptides/5-amino-1mq`, `/peptides/liraglutide`, `/compare/5-amino-1mq-vs-semaglutide`, `/compare/liraglutide-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (148 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages). Select-String / `_tick63-grep.mjs`: leftover census FAQ strings, Consult, Who Might, `dosing`/`inject`/`protocol`, unescaped `P<`, `$1,000`, trailing-slash hrefs — all 0 except the dated “not invented … obesity Phase 3” line. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `5-amino-1mq-vs-aod-9604.mdx`, `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-cagrisema.mdx`, `5-amino-1mq-vs-ct-388.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, `amycretin-vs-aod-9604.mdx`, other leftover `5-amino-1mq-vs-*` / `aod-9604-vs-*` census stubs, or `src/content/peptides/**`.
- Did not restore census 11/18 or 0/12, an invented 5-Amino-1MQ RCT percent, or an invented 5-Amino-1MQ obesity Phase 3.
- Did not cite PMID 33645410 (title miss), PMID 39067875 (not obesity), PMID 26510028 (letter, no abstract), or dump the 101-hit SCALE / 148-hit LEADER / 7-hit NCT01272219 / 37-hit NCT01179048 esearch lists.
- Did not convert SCALE kilograms into a percent.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `5-amino-1mq-vs-liraglutide.mdx` census FAQ (11/0 vs 18/12) and consult footer stripped. TICK61 locked `5-amino-1mq-vs-aod-9604.mdx`. TICK62 claimed already-cleaned `5-amino-1mq-vs-ct-388.mdx`.
2. 5-Amino-1MQ: no human obesity RCT this run; street-name PubMed 0; CT.gov 0 as of 2026-09-02; DIO mouse abstract names the compound and publishes **no** percent (PMID 35013352).
3. SCALE quoted as LOCF **−8.4 kg vs −2.8 kg** at 56 weeks (PMID 26132939). Abstract has no mean percent; kilograms not converted.
4. LEADER quoted as HR **0.87** (95% CI 0.78–0.97) (PMID 27295427). No rounded relative-risk headline.
5. openFDA: 5-amino NOT_FOUND; Victoza ORIG AP 2010-01-25; Saxenda ORIG AP 2014-12-23. H2H PubMed 0. No invented 5-Amino-1MQ obesity Phase 3.
6. No $1,000 row present to keep or strip (TICK6-PRICE). Links without trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `5-amino-1mq-vs-*` (except TICK45/47/48/58/59/60/61/63 files) and `aod-9604-vs-*`. One file per tick.
