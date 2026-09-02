# TICK59 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/5-amino-1mq-vs-cagrisema.mdx`. Generated census stub (11/Low vs 14/High; 0 vs 6 human; Total Sources 11/14) plus combination FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

`qa-comparison-counts.mjs --strict` at dispatch was already PASS sitewide (268 pages). Hard-locked: TICK56 `amycretin-vs-slu-pp-332.mdx`, TICK57 `amycretin-vs-survodutide.mdx`, TICK58 `5-amino-1mq-vs-cagrilintide.mdx`, TICK45 `5-amino-1mq-vs-semaglutide`, TICK47/48 `5-amino-1mq-vs-amycretin`, TICK44 `amycretin-vs-aod-9604`, and `src/content/peptides/**`. Next unlocked generated census stub from the assigned leftover set: `5-amino-1mq-vs-cagrisema.mdx` (`lastUpdated` 2026-02-12, census FAQ 11/14 sources and 0/6 human, source-count tables, combination FAQ, consult footer). Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Get-ChildItem src\content\comparisons -Filter "5-amino-1mq-vs-*.mdx"
Get-ChildItem src\content\comparisons -Filter "aod-9604-vs-*.mdx"
Get-ChildItem .planning\seo-engine\runs\2026-09-01 -Filter "TICK5*.md"
node scripts\qa-comparison-counts.mjs --strict
Test-Path src\content\comparisons\5-amino-1mq-vs-cagrisema.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-cagrilintide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-semaglutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-amycretin.mdx
Test-Path src\content\comparisons\amycretin-vs-slu-pp-332.mdx
Test-Path src\content\comparisons\amycretin-vs-survodutide.mdx
Test-Path src\content\peptides\5-amino-1mq.mdx
Test-Path src\content\peptides\cagrisema.mdx
node .planning\seo-engine\runs\2026-09-01\_tick59-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick59-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick59-fetch3.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-cagrisema.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (5-amino-1mq / 5-amino-1-methylquinolinium / cagrisema / cagrilintide); semaglutide STATUS 200. Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"5-Amino-1MQ"` count 0. `"5-amino-1-MQ"` count 0. `"5-Amino-1-methylquinolinium"` count 3 (39067875, 35013352, 33645410). `"CagriSema"` count 70 — not dumped. `"cagrilintide" AND "semaglutide"` count 74 — not dumped. `"5-Amino-1MQ" AND "CagriSema"` count 0. `"5-amino-1-methylquinolinium" AND "CagriSema"` count 0. `"5-Amino-1MQ" AND "cagrilintide"` count 0.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice | DIO mice. Abstract names **5-amino-1-methylquinolinium** as the NNMTi used with a low-fat diet. Describes adiposity/weight change vs diet switch alone. **No body-weight percent.** Not a human RCT. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT in cancer-associated fibroblasts… urothelial bladder cancer | Title-matched NNMT. Used 5-Amino-1-methylquinolinium iodide in UBC mouse models. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase shows anti-proliferative activity in HeLa cells | **TITLE_MATCH false** (title does not name 5-amino). HeLa cells. Not quoted. |
| PMID 40544433 NCT05567796 REDEFINE 1 | Coadministered Cagrilintide and Semaglutide in Adults with Overweight or Obesity | n=3417 (2108 / 302 / 302 / 705). 68 wk. **Treatment-policy.** CagriSema **−20.4% vs −3.0%** (ETD −17.3; CI −18.1 to −16.6; P&lt;0.001). Cagrilintide-alone and semaglutide-alone arms named; **abstract does not publish those percents**. GI 79.6% vs 39.9%. No 22.7. CT.gov ACTIVE_NOT_RECRUITING Phase 3; hasResults **false**. PubMed `NCT05567796` = 41328546, 40544433. |
| PMID 40544432 NCT05394519 REDEFINE 2 | Cagrilintide-Semaglutide in Adults with Overweight or Obesity and Type 2 Diabetes | n=1206 (904 / 302). 68 wk. **Treatment-policy.** **−13.7% vs −3.4%** (ETD −10.4; CI −11.2 to −9.5; P&lt;0.001). HbA1c ≤6.5% 73.5% vs 15.9%. GI 72.5% vs 34.4%. Abstract does **not** state a trial-product percent. CT.gov COMPLETED Phase 3; hasResults **false**. PubMed `NCT05394519` = 40544432 only. |
| PMID 41328546 NCT05567796 | CagriSema Reduces Blood Pressure… REDEFINE 1 | Blood-pressure secondary/post hoc. **Not** quoted as a weight-change result. Not used for a monotherapy percent. |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium / cagrisema / cagrilintide | All **NOT_FOUND**. `semaglutide` found (Ozempic / Rybelsus) — not a CagriSema application. |

## File

- `src/content/comparisons/5-amino-1mq-vs-cagrisema.mdx`
  - Stripped census FAQ (11/Low vs 14/High; 0 vs 6 human), Evidence/Key Differences source-count tables (11/14), summary “11 total sources (0 human),” combination-as-unknown FAQ voice, consult footer, and “Phase 3 validated status.”
  - Dated 5-Amino-1MQ absence: street-name PubMed 0; chemical-name 3 hits, none a human obesity RCT; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted DIO mouse paper as naming the compound with **no percent**. Did not invent a mouse or human RCT percent.
  - Quoted REDEFINE 1 treatment-policy **−20.4% vs −3.0%**. Escaped P&lt;. Did not invent monotherapy percents or 22.7.
  - Quoted REDEFINE 2 treatment-policy **−13.7% vs −3.4%** as the type 2 diabetes programme. Did not invent a trial-product percent.
  - Dated H2H absence: PubMed `"5-Amino-1MQ" AND "CagriSema"`, `"5-amino-1-methylquinolinium" AND "CagriSema"`, and `"5-Amino-1MQ" AND "cagrilintide"` on 2026-09-02 returned 0.
  - openFDA: 5-amino NOT_FOUND; cagrisema NOT_FOUND; cagrilintide NOT_FOUND. Semaglutide products labelled as not CagriSema.
  - Linked `/peptides/5-amino-1mq`, `/peptides/cagrisema`, `/compare/5-amino-1mq-vs-semaglutide`, `/compare/5-amino-1mq-vs-cagrilintide`, `/compare/cagrisema-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (153 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (this filename never in a mismatch list). Select-String: leftover census FAQ strings, Consult, Who Might, `dosing`/`inject`/`protocol`, banned leftover percents, unescaped `P<`, `$1,000`, trailing-slash hrefs — all 0 except the FAQ question “Which has more clinical evidence.” Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `amycretin-vs-slu-pp-332.mdx`, `amycretin-vs-survodutide.mdx`, `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, `amycretin-vs-aod-9604.mdx`, KEEP `cagrisema-vs-semaglutide.mdx`, or `src/content/peptides/**`.
- Did not restore 22.7, REDEFINE 2 trial-product 15.7, or a 5-Amino-1MQ RCT percent.
- Did not quote cagrilintide-alone or semaglutide-alone percents from REDEFINE 1.
- Did not cite PMID 33645410 (title miss), PMID 39067875 (not obesity), or PMID 41328546 (BP paper) as weight results.
- Did not dump the 70-hit CagriSema or 74-hit cagrilintide+semaglutide esearch into the page.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `5-amino-1mq-vs-cagrisema.mdx` census FAQ (11/0 vs 14/6) and consult footer stripped. Count-QA was already PASS at dispatch; TICK58 had taken `5-amino-1mq-vs-cagrilintide.mdx`.
2. 5-Amino-1MQ: no human obesity RCT this run; street-name PubMed 0; CT.gov 0 as of 2026-09-02; DIO mouse abstract names the compound and publishes **no** percent (PMID 35013352).
3. REDEFINE 1 quoted as CagriSema treatment-policy **−20.4% vs −3.0%**; monotherapy arms named without percents (PMID 40544433).
4. REDEFINE 2 (type 2 diabetes) quoted as treatment-policy **−13.7% vs −3.4%**; no invented trial-product percent (PMID 40544432).
5. openFDA: 5-amino NOT_FOUND; cagrisema NOT_FOUND; cagrilintide NOT_FOUND as of 2026-09-02. No invented approval year or obesity Phase 3 for 5-Amino-1MQ.
6. No $1,000 row present to keep or strip (TICK6-PRICE). Links without trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `5-amino-1mq-vs-*` (except TICK45/47/48/58 files) and `aod-9604-vs-*`. One file per tick.
