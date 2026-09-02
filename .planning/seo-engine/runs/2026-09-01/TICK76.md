Assigned file: `src/content/comparisons/5-amino-1mq-vs-survodutide.mdx`

# TICK76 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/5-amino-1mq-vs-survodutide.mdx`. Generated census stub (11/Low vs 34/High; 0 vs 30 human; Total Sources 11/34) plus combination FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned by Conductor. Hard-locked (path-checked only; not opened): TICK69 `aod-9604-vs-ct-388.mdx`; TICK72 `5-amino-1mq-vs-orforglipron.mdx`; TICK73 `5-amino-1mq-vs-pemvidutide.mdx`; TICK74 `5-amino-1mq-vs-vk2735.mdx`; TICK75 `5-amino-1mq-vs-retatrutide.mdx`; TICK60–TICK71 claimed files; `5-amino-1mq-vs-cagrisema.mdx`; `5-amino-1mq-vs-cagrilintide.mdx`; `5-amino-1mq-vs-semaglutide.mdx`; `5-amino-1mq-vs-amycretin.mdx`; `src/content/peptides/**`. Assigned leftover: `5-amino-1mq-vs-survodutide.mdx` (`lastUpdated` 2026-02-12, census FAQ 11/34 sources and 0/30 human, source-count tables, combination FAQ, consult footer). Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\5-amino-1mq-vs-survodutide.mdx
Test-Path src\content\comparisons\aod-9604-vs-ct-388.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-orforglipron.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-pemvidutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-vk2735.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-retatrutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-cagrisema.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-cagrilintide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-semaglutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-amycretin.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-ct-388.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-tirzepatide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-mazdutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-liraglutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-maritide.mdx
Test-Path src\content\comparisons\survodutide-vs-tirzepatide.mdx
Test-Path src\content\comparisons\survodutide-vs-semaglutide.mdx
Test-Path src\content\peptides\5-amino-1mq.mdx
Test-Path src\content\peptides\survodutide.mdx
node .planning\seo-engine\runs\2026-09-01\_tick76-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick76-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick76-write.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-survodutide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
node .planning\seo-engine\runs\2026-09-01\_tick76-grep.mjs
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (5-amino-1mq / 5-amino-1-methylquinolinium / survodutide / bi456906); fetch1 openFDA timed out, fetch2 retried to NOT_FOUND. Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"5-Amino-1MQ"` count 0. `"5-amino-1-MQ"` count 0. `"5-Amino-1-methylquinolinium"` count 3 (39067875, 35013352, 33645410). `"survodutide"` count 77 — not dumped. `"BI 456906"` count 10. `"SYNCHRONIZE-1"` count 9. `"SYNCHRONY"` count 17871 (neural/oscillation papers; wrong family). `"5-Amino-1MQ" AND survodutide` count 0. `"5-amino-1-methylquinolinium" AND survodutide` count 0. `"5-Amino-1MQ" AND "SYNCHRONIZE-1"` count 0. `NCT06066515` count 3 (42253238, 41187967, 39495965).

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice | DIO mice. Abstract names **5-amino-1-methylquinolinium** as the NNMTi used with a low-fat diet. Describes adiposity/weight change vs diet switch alone. **No body-weight percent.** Not a human RCT. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT in cancer-associated fibroblasts… urothelial bladder cancer | Title-matched NNMT. Used 5-Amino-1-methylquinolinium iodide in UBC mouse models. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase shows anti-proliferative activity in HeLa cells | **TITLE_MATCH false** (title does not name 5-amino). HeLa cells. Not quoted. |
| PMID 42253238 NCT06066515 SYNCHRONIZE-1 | Survodutide Once Weekly for the Treatment of Adults with Obesity | Phase 3; n=725 (241 / 242 / 242); 76 wk; no diabetes. **Treatment-regimen estimand.** Mean **−12.2% (95% CI −13.6 to −10.8) / −13.0% (−14.4 to −11.6) vs −5.4% (−6.9 to −4.0)** (3.6 mg / 6.0 mg / placebo). ≥5% 72.6% / 71.9% / 46.3% (P&lt;0.001). GI 80.9% / 89.7% / 47.9%. No deaths. CT.gov COMPLETED Phase 3; hasResults **false**. Lead sponsor Boehringer Ingelheim. Enrollment field absent from this run’s NCT dump; n=725 is from the journal abstract. PubMed `NCT06066515` = 42253238, 41187967, 39495965; this page quotes 42253238 only. |
| PMID 38330987 NCT04667377 | Glucagon and GLP-1 receptor dual agonist survodutide for obesity… phase 2 trial | 387 enrolled; 386 treated; **46 weeks**. Planned-treatment −6.2% / −12.5% / −13.2% / −14.9% vs −2.8% placebo. GI 75% vs 42%. Not a 48-week table. CT.gov COMPLETED Phase 2; hasResults **true**. |
| PMID 38095657 NCT04153929 | …survodutide… HbA(1c) and bodyweight… type 2 diabetes | Phase 2; 413 randomised; 16 wk. HbA1c −0.91% to −1.71% by group; semaglutide −1.47%. Bodyweight up to −8.7% (DG6) vs −5.3% semaglutide. AE 77.8% / 52.5% / 52.0%. CT.gov COMPLETED Phase 2; hasResults **true**. |
| PMID 42642663 / 42599381 / 39453356 | SYNCHRONIZE-MASLD correction; SYNCHRONIZE-CN design; SYNCHRONIZE CVOT design | Title-matched only. Full abstracts **not** fetched. Not quoted as percents. |
| `"SYNCHRONY"` | Neural synchrony / oscillation papers | Count 17871. Sample titles are not survodutide. **Wrong family. Not quoted.** |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino | All **0** studies as of 2026-09-02. |
| CT.gov NCT06077864 | Phase 3 cardiovascular-safety record | COMPLETED; hasResults **false**. Design only. Not quoted as a result. |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium / survodutide / bi456906 | All **NOT_FOUND**. |

## File

- `src/content/comparisons/5-amino-1mq-vs-survodutide.mdx`
  - Stripped census FAQ (11/Low vs 34/High; 0 vs 30 human), Evidence/Key Differences source-count tables (11/34), summary “11 total sources (0 human),” combination-as-unknown FAQ voice, and consult footer.
  - Dated 5-Amino-1MQ absence: street-name PubMed 0; chemical-name 3 hits, none a human obesity RCT; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3 or a human obesity RCT percent.
  - Quoted DIO mouse paper as naming the compound with **no percent**. Did not invent a mouse or human RCT percent.
  - Quoted SYNCHRONIZE-1 as treatment-regimen percents (−12.2% / −13.0% vs −5.4%) plus responder and GI bands from the abstract. Estimand named as treatment-regimen.
  - Quoted Phase 2 obesity as **46 weeks** planned-treatment percents. Did not write an unsourced 48-week ~18.7 / ~19.5 table.
  - Quoted the 16-week T2D paper as labelled groups, not as the obesity lead.
  - Dated H2H absence: PubMed `"5-Amino-1MQ" AND survodutide` and `"5-amino-1-methylquinolinium" AND survodutide` on 2026-09-02 returned 0.
  - Banned SYNCHRONY as a survodutide family (17871-hit neural-synchrony dump).
  - openFDA: 5-amino NOT_FOUND; survodutide / bi456906 NOT_FOUND.
  - Linked `/peptides/5-amino-1mq`, `/peptides/survodutide`, `/compare/survodutide-vs-tirzepatide`, `/compare/survodutide-vs-semaglutide`, `/compare/5-amino-1mq-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (174 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages). `_tick76-grep.mjs`: leftover census FAQ strings, Consult, Who Might, `dosing`/`dose`/`inject`/`protocol`, unescaped `P<`, `$1,000`, 18.7, 19.5, trailing-slash hrefs — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `aod-9604-vs-ct-388.mdx`, `5-amino-1mq-vs-orforglipron.mdx`, `5-amino-1mq-vs-pemvidutide.mdx`, `5-amino-1mq-vs-vk2735.mdx`, `5-amino-1mq-vs-retatrutide.mdx`, TICK60–TICK71 claimed files, `5-amino-1mq-vs-cagrisema.mdx`, `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, or `src/content/peptides/**`.
- Did not restore census 11/34 or 0/30, an invented 5-Amino-1MQ RCT percent, or an invented 5-Amino-1MQ obesity Phase 3.
- Did not cite PMID 33645410 (title miss), PMID 39067875 (not obesity), or dump the 77-hit survodutide / 17871-hit SYNCHRONY esearch lists.
- Did not quote SYNCHRONIZE-MASLD / SYNCHRONIZE-CN / SYNCHRONIZE-CVOT percents (full abstracts not fetched).
- Did not invent NCT06066515 enrollment (field absent from this run’s NCT dump).
- Did not write an unsourced 48-week ~18.7 / ~19.5 table or treat SYNCHRONY as this programme.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Assigned leftover cleaned: `5-amino-1mq-vs-survodutide.mdx` census FAQ (11/0 vs 34/30) and consult footer stripped. Locked TICK69/72–75 and TICK60–71 files not opened.
2. 5-Amino-1MQ: no human obesity RCT percent this run; street-name PubMed 0; CT.gov 0 as of 2026-09-02; DIO mouse abstract names the compound and publishes **no** percent (PMID 35013352).
3. SYNCHRONIZE-1 quoted as treatment-regimen **−12.2% / −13.0% vs −5.4%** at 76 weeks (PMID 42253238). Estimand named. Unsourced 48-week ~18.7 / ~19.5 not written. SYNCHRONY banned as wrong family.
4. Phase 2 obesity quoted as 46-week planned-treatment **−6.2% / −12.5% / −13.2% / −14.9% vs −2.8%** (PMID 38330987). Not a 48-week table.
5. openFDA: 5-amino NOT_FOUND; survodutide / bi456906 NOT_FOUND as of 2026-09-02. No invented approval year or 5-Amino-1MQ obesity Phase 3.
6. No $1,000 row present to keep or strip (TICK6-PRICE). Links without trailing slash. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `5-amino-1mq-vs-*` / `aod-9604-vs-*` not in the TICK60–75 lock list. One file per tick.
