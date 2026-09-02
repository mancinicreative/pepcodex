# TICK62 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/5-amino-1mq-vs-maritide.mdx`. Generated census stub (11/Low vs 21/Moderate; 0 vs 10 human; Total Sources 11/21) plus combination FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK60.md was **absent** at first dispatch (Test-Path False). TICK61.md claimed `5-amino-1mq-vs-aod-9604.mdx`. This tick first claimed `5-amino-1mq-vs-ct-388.mdx` as the next unlocked leftover, then TICK60.md landed on that same file. Restored TICK60's file with `node .planning\seo-engine\runs\2026-09-01\_tick60-write.mjs` (wrote 11163 bytes; 158 CRLF, 0 LF-only). Did not keep the colliding rewrite.

TICK64.md (read after restore) claimed `5-amino-1mq-vs-liraglutide.mdx`. Hard-locked: TICK58 `5-amino-1mq-vs-cagrilintide`, TICK59 `5-amino-1mq-vs-cagrisema`, TICK60 `5-amino-1mq-vs-ct-388`, TICK61 `5-amino-1mq-vs-aod-9604`, TICK64 `5-amino-1mq-vs-liraglutide`, TICK45 `5-amino-1mq-vs-semaglutide`, TICK47/48 `5-amino-1mq-vs-amycretin`, TICK44 `amycretin-vs-aod-9604`, TICK56 `amycretin-vs-slu-pp-332`, TICK57 `amycretin-vs-survodutide`, and `src/content/peptides/**`. Next unlocked generated census stub: `5-amino-1mq-vs-maritide.mdx` (`lastUpdated` 2026-02-12, census FAQ 11/21 sources and 0/10 human, source-count tables, combination FAQ, consult footer). Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path .planning\seo-engine\runs\2026-09-01\TICK60.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK61.md
Get-ChildItem src\content\comparisons -Filter "5-amino-1mq-vs-*.mdx"
Get-ChildItem src\content\comparisons -Filter "aod-9604-vs-*.mdx"
node .planning\seo-engine\runs\2026-09-01\_tick62-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick62-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick62-fetch3.mjs
node .planning\seo-engine\runs\2026-09-01\_tick60-write.mjs
node .planning\seo-engine\runs\2026-09-01\_tick62-maritide-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick62-maritide-fetch2.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-maritide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200 (some 429 then retry 200). NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (5-amino-1mq / 5-amino-1-methylquinolinium / maritide / maridebart / maridebart cafraglutide / amg 133 / amg133). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"5-Amino-1MQ"` count 0. `"5-amino-1-MQ"` count 0. `"5-Amino-1-methylquinolinium"` count 3 (39067875, 35013352, 33645410). `"MariTide"` / `"maritide"` count 7. `"AMG-133"` count 9. `"AMG 133"` count 9. `"AMG133"` count 5. `"maridebart cafraglutide"` / `"maridebart"` count 13 — not dumped. `"5-Amino-1MQ" AND "MariTide"` count 0. `"5-amino-1-methylquinolinium" AND "MariTide"` count 0. `"5-Amino-1MQ" AND "maridebart"` count 0.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice | DIO mice. Abstract names **5-amino-1-methylquinolinium** as the NNMTi used with a low-fat diet. Describes adiposity/weight change vs diet switch alone. **No body-weight percent.** Not a human RCT. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT in cancer-associated fibroblasts… urothelial bladder cancer | Title-matched NNMT. Used 5-Amino-1-methylquinolinium iodide in UBC mouse models. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase shows anti-proliferative activity in HeLa cells | **TITLE_MATCH false** (title does not name 5-amino). HeLa cells. Not quoted. |
| PMID 40549887 NCT05669599 | Once-Monthly Maridebart Cafraglutide for the Treatment of Obesity - A Phase 2 Trial | n=592 (465 obesity / 127 obesity-diabetes). 52 wk. **Treatment-policy** (ITT). Obesity: **−12.3%** (CI −15.0 to −9.7) **to −16.2%** (CI −18.9 to −13.5) vs **−2.5%** (CI −4.2 to −0.7). Obesity-diabetes: **−8.4%** to **−12.3%** vs **−1.7%**. HbA1c treatment-policy −1.2 to −1.6 vs 0.1 percentage points. CT.gov COMPLETED Phase 2; hasResults **false**. Lead sponsor Amgen. PubMed `NCT05669599` = 40549887 only. Registry enroll field missing this increment; n from the abstract. |
| PMID 41941715 | Discovery of AMG 133… Antibody-Drug Conjugate for the Treatment of Obesity | Medicinal chemistry. Names AMG 133. No human RCT percent. States AMG 133 was in Phase III with a profile that may support monthly administration. Quoted as mechanism / development status only. |
| PMID 38316982 NCT04478708 | A GIPR antagonist conjugated to GLP-1 analogues… | **TITLE_MATCH false.** PubMed `NCT04478708` = 38316982 only. CT.gov COMPLETED Phase 1; TEAE primary; hasResults **true**. No results-module percent quoted. |
| PMID 38388678 | Phase I results for AMG 133 | Title match. *Nat Rev Endocrinol* note. **No abstract numbers.** Not quoted. |
| PMID 42592044 | Design and therapeutic rationale of antibody-peptide conjugates… maridebart cafraglutide (AMG133) | Title match. Design/rationale. **Not quoted** as a trial result. |
| NCT06858878 MARITIME-2 | Phase 3 maridebart cafraglutide in T2D + obesity/overweight | ACTIVE_NOT_RECRUITING. Primary = % body-weight change week 72. hasResults **false**. PubMed 0. Design only. |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium / maritide / maridebart / maridebart cafraglutide / amg 133 / amg133 | All **NOT_FOUND**. |

## File

- `src/content/comparisons/5-amino-1mq-vs-maritide.mdx`
  - Stripped census FAQ (11/Low vs 21/Moderate; 0 vs 10 human), Evidence/Key Differences source-count tables (11/21), summary “11 total sources (0 human),” combination-as-unknown FAQ voice, and consult footer.
  - Dated 5-Amino-1MQ absence: street-name PubMed 0; chemical-name 3 hits, none a human obesity RCT; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted DIO mouse paper as naming the compound with **no percent**. Did not invent a mouse or human RCT percent.
  - Quoted MariTide Phase 2 treatment-policy ranges; did not collapse −12.3 to −16.2 into one headline percent.
  - Dated NCT04478708 / MARITIME-2 / later Phase 3 absences (hasResults false except NCT04478708, whose results module was not quoted; PubMed 0 for NCT06858878 as of 2026-09-02). No unpublished Phase 3 percent.
  - Dated H2H absence: PubMed `"5-Amino-1MQ" AND "MariTide"`, `"5-amino-1-methylquinolinium" AND "MariTide"`, and `"5-Amino-1MQ" AND "maridebart"` on 2026-09-02 returned 0.
  - openFDA: 5-amino NOT_FOUND; maritide / maridebart / amg 133 NOT_FOUND.
  - Linked `/peptides/5-amino-1mq`, `/peptides/maritide`, `/compare/5-amino-1mq-vs-semaglutide`, `/compare/maritide-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (186 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages). Select-String: leftover census FAQ strings, Consult, Who Might, `dosing`/`inject`/`protocol`, banned leftover percents, unescaped `P<`, `$1,000`, trailing-slash hrefs — all 0 except the FAQ question “Which has more clinical evidence.” Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not keep a colliding rewrite of locked `5-amino-1mq-vs-ct-388.mdx` (restored TICK60 write).
- Did not touch locked `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-cagrisema.mdx`, `5-amino-1mq-vs-aod-9604.mdx`, `5-amino-1mq-vs-liraglutide.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, `amycretin-vs-aod-9604.mdx`, `amycretin-vs-survodutide.mdx`, `amycretin-vs-slu-pp-332.mdx`, or `src/content/peptides/**`.
- Did not restore REDEFINE 22.7/15.7/23–25.5 or a 5-Amino-1MQ RCT percent.
- Did not quote a Phase 3 MariTide percent or NCT04478708 results-module numbers.
- Did not cite PMID 33645410 (title miss), PMID 39067875 (not obesity), PMID 38316982 (title miss), PMID 38388678 (no numbers), or PMID 42592044 (design paper) as weight results.
- Did not dump the 13-hit maridebart esearch into the page.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `5-amino-1mq-vs-maritide.mdx` census FAQ (11/0 vs 21/10) and consult footer stripped. First claim on `5-amino-1mq-vs-ct-388.mdx` was a TICK60 collision; that file was restored.
2. 5-Amino-1MQ: no human obesity RCT this run; street-name PubMed 0; CT.gov 0 as of 2026-09-02; DIO mouse abstract names the compound and publishes **no** percent (PMID 35013352).
3. MariTide Phase 2 quoted as treatment-policy **−12.3% to −16.2% vs −2.5%** (obesity) and **−8.4% to −12.3% vs −1.7%** (obesity-diabetes) at 52 weeks (PMID 40549887).
4. MARITIME-2 and later Phase 3 records are design-only (hasResults false; NCT06858878 PubMed 0). No invented obesity Phase 3 percent.
5. openFDA: 5-amino NOT_FOUND; maritide / maridebart / AMG 133 NOT_FOUND as of 2026-09-02. No invented approval year.
6. No $1,000 row present to keep or strip (TICK6-PRICE). Links without trailing slash. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `5-amino-1mq-vs-*` (except TICK45/47/48/58/59/60/61/64 files and this file) and `aod-9604-vs-*`. One file per tick.
