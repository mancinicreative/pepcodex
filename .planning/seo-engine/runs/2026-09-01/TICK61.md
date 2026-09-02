# TICK61 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/5-amino-1mq-vs-aod-9604.mdx`. Older leftover (not a generated 11/x census stub): invented ~3% / 15–17% rows, invented obesity Phase 3, undated TGA/OTC claim, administration and availability copy, consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK59.md was **absent** at first dispatch (Test-Path False), then appeared mid-increment. Read it: TICK59 took `5-amino-1mq-vs-cagrisema.mdx`. TICK60.md was **absent** at dispatch and at close (Test-Path False). Hard-locked: TICK56 `amycretin-vs-slu-pp-332`, TICK57 `amycretin-vs-survodutide`, TICK58 `5-amino-1mq-vs-cagrilintide`, TICK59 `5-amino-1mq-vs-cagrisema`, TICK45 `5-amino-1mq-vs-semaglutide`, TICK47/48 `5-amino-1mq-vs-amycretin`, TICK44 `amycretin-vs-aod-9604`, and `src/content/peptides/**`. Next unlocked leftover from the assigned set that was not the next generated census stub (TICK59 took that): `5-amino-1mq-vs-aod-9604.mdx` (`lastUpdated` 2026-02-01, invented percents, invented Phase 3, TGA/OTC, administration/availability, consult footer). Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Get-ChildItem src\content\comparisons -Filter "5-amino-1mq-vs-*.mdx"
Get-ChildItem src\content\comparisons -Filter "aod-9604-vs-*.mdx"
Test-Path .planning\seo-engine\runs\2026-09-01\TICK59.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK60.md
Test-Path src\content\comparisons\5-amino-1mq-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-semaglutide.mdx
Test-Path src\content\comparisons\amycretin-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-cagrilintide.mdx
Test-Path src\content\peptides\5-amino-1mq.mdx
Test-Path src\content\peptides\aod-9604.mdx
node .planning\seo-engine\runs\2026-09-01\_tick61-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick61-fetch2.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-aod-9604.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 after fetch1 connect-timeout then fetch2 retry. Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"5-Amino-1MQ"` count 0. `"5-amino-1-MQ"` count 0. `"5-Amino-1-methylquinolinium"` count 3 (39067875, 35013352, 33645410). `"AOD-9604"` count 16 — not dumped. `"AOD9604"` count 22 — not dumped. `"AOD 9604"` count 16. `"5-Amino-1MQ" AND "AOD-9604"` count 0. `"5-amino-1-methylquinolinium" AND "AOD9604"` count 0. `"AOD-9604" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III" OR "phase 2")` count 1 (16625817). `"AOD9604"` with the same clinical-trial/phase-3 terms count 3 (42395176, 16931496, 16625817).

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice | DIO mice. Abstract names **5-amino-1-methylquinolinium** as the NNMTi used with a low-fat diet. Describes adiposity/weight change vs diet switch alone. **No body-weight percent.** Not a human RCT. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT in cancer-associated fibroblasts… urothelial bladder cancer | Title-matched NNMT. Used 5-Amino-1-methylquinolinium iodide in UBC mouse models. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase shows anti-proliferative activity in HeLa cells | **TITLE_MATCH false** (title does not name 5-amino). HeLa cells. Not quoted. |
| PMID 15134286 | AOD-9604 Metabolic | 2004 profile. Metabolic developing AOD-9604 for potential obesity treatment. By February 2002, **phase IIa trials were underway**. Abstract publishes **no enrollment, no percent**. |
| PMID 11146367 | Metabolic studies of a synthetic lipolytic domain (AOD9604) of human growth hormone | Obese Zucker **rats**. 19-day oral treatment. Weight-gain 15.8 ± 0.6 vs 35.6 ± 0.8 g. Not a human RCT percent. Treatment amount from the abstract not copied. |
| PMID 11673763 | Increase of fat oxidation and weight loss in obese mice caused by chronic treatment with human growth hormone or a modified C-terminal fragment | Obese/lean **mice**, 14 days. Both hGH and AOD9604 reduced body-weight gain; increased fat oxidation. AOD9604 did not compete for the hGH receptor. Not a human RCT percent. |
| PMID 11713213 | …AOD9604… obese mice and beta(3)-AR knock-out mice | Fetched; title-matched preclinical. Not quoted as an obesity RCT (11673763 already covers the mouse weight-gain class). |
| PMID 16625817 | Obesity drugs in clinical development | 2006 review. Lists AOD-9604 among then-in-development obesity drugs. Of **that set**, only rimonabant had completed phase III. Not an AOD-9604 Phase 3 result. |
| PMID 16931496 | Potential role of new therapies… | Review. Names AOD9604 as then in clinical trials. **No enrollment, no percent.** Not quoted as a trial result. |
| PMID 17971763 | Obesity: a review of currently used antiobesity drugs… | Review (Polish). Lists AOD9604 among compounds in clinical development. **No percent.** Not quoted as a trial result. |
| PMID 22435392 | Current updates in the medical management of obesity | Review/patent note. Names AOD9604. **No RCT percent.** Not quoted as a trial result. |
| PMID 25208511 | Detection and in vitro metabolism of AOD9604 | Identity: C-terminal hGH 177-191 + N-terminal tyrosine. Doping-detection methods. No efficacy percent. |
| PMID 26275694 | Effect of Intra-articular Injection of AOD9604… Rabbit Osteoarthritis Model | Rabbit OA. **Not body weight. Not a human RCT.** Not quoted as a weight result. |
| PMID 24976118 / 24124033 | Seized-prep case report; WADA hGH immunoassay | Title-matched AOD. No human obesity RCT percent. Not quoted as efficacy. |
| PMID 42395176 | Performance-enhancing peptides… GH-IGF1 axis | Review. Names AOD9604. **Not** a head-to-head RCT. Not quoted (carries self-administration language). |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino / AOD-9604 / AOD9604 / AOD 9604 | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium / aod-9604 / aod9604 | All **NOT_FOUND**. |

## File

- `src/content/comparisons/5-amino-1mq-vs-aod-9604.mdx`
  - Stripped invented ~3% AOD-9604 and 15–17% semaglutide rows, invented obesity Phase 3 / “failed Phase 3” / Phase 2b-endpoint headlines, undated TGA/OTC claim, administration table, cost/availability / research-chemical copy, combination-as-advice voice, and consult footer.
  - Dated 5-Amino-1MQ absence: street-name PubMed 0; chemical-name 3 hits, none a human obesity RCT; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted DIO mouse paper as naming the compound with **no percent**. Did not invent a mouse or human RCT percent.
  - Quoted AOD-9604 2004 profile (phase IIa underway by February 2002; no percent). Dated CT.gov 0-study searches (2026-09-02). Did not invent a human RCT percent or an obesity Phase 3.
  - Quoted rodent weight-gain figures as rodent only. Did not copy the rat treatment-amount line.
  - Quoted 2006 review as listing AOD-9604; only rimonabant in that set had completed phase III. That is not an AOD Phase 3 result.
  - Dated H2H absence: PubMed `"5-Amino-1MQ" AND "AOD-9604"` and `"5-amino-1-methylquinolinium" AND "AOD9604"` on 2026-09-02 returned 0.
  - openFDA: 5-amino NOT_FOUND; AOD-9604 / AOD9604 NOT_FOUND.
  - Linked `/peptides/5-amino-1mq`, `/peptides/aod-9604`, `/compare/5-amino-1mq-vs-semaglutide`, `/compare/amycretin-vs-aod-9604` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (178 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages; this filename never in a census-mismatch list). Select-String: leftover census FAQ strings, Consult, Who Might, `dosing`/`inject`/`protocol`/`dose`, leftover invented percents, unescaped `P<`, `$1,000`, trailing-slash hrefs — all 0 except dated “not invented / not restored” lines for Phase 3 and a prior TGA/OTC claim. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `amycretin-vs-slu-pp-332.mdx`, `amycretin-vs-survodutide.mdx`, `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-cagrisema.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, `amycretin-vs-aod-9604.mdx`, other leftover `5-amino-1mq-vs-*` / `aod-9604-vs-*` census stubs, or `src/content/peptides/**`.
- Did not restore invented ~3% / 15–17%, an AOD-9604 obesity Phase 3, or the TGA/OTC claim.
- Did not cite PMID 33645410 (title miss), PMID 39067875 (not obesity), PMID 26275694 (rabbit OA), PMID 16931496 / 17971763 / 22435392 / 42395176 (reviews) as trial results, or PMID 11713213 as an obesity RCT.
- Did not dump the 16/22-hit AOD esearch into the page.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `5-amino-1mq-vs-aod-9604.mdx` invented percent rows, invented Phase 3, TGA/OTC, administration/availability, and consult footer stripped. TICK59 took `5-amino-1mq-vs-cagrisema.mdx`. TICK60.md absent.
2. 5-Amino-1MQ: no human obesity RCT this run; street-name PubMed 0; CT.gov 0 as of 2026-09-02; DIO mouse abstract names the compound and publishes **no** percent (PMID 35013352).
3. AOD-9604 2004 profile quoted as phase IIa underway by February 2002 with **no percent** (PMID 15134286).
4. 2006 review lists AOD-9604; only rimonabant in that set had completed phase III (PMID 16625817). No invented AOD obesity Phase 3.
5. Rodent only: rat 19-day weight-gain 15.8 ± 0.6 vs 35.6 ± 0.8 g (PMID 11146367); mouse weight-gain reduction (PMID 11673763). Not human RCT percents.
6. openFDA: 5-amino NOT_FOUND; AOD-9604 NOT_FOUND as of 2026-09-02. H2H PubMed 0. No $1,000 row added or stripped (TICK6-PRICE). Links without trailing slash. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- TICK60.md still absent at close. Remaining unlocked census leftovers: other `5-amino-1mq-vs-*` (except TICK45/47/48/58/59 files) and `aod-9604-vs-*`. One file per tick.
