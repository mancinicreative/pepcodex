# TICK58 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/5-amino-1mq-vs-cagrilintide.mdx`. Generated census stub (11/Low vs 34/High; 0 vs 27 human; Total Sources 11/34) plus combination FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

`qa-comparison-counts.mjs` at dispatch only flagged locked `amycretin-vs-slu-pp-332.mdx` and `amycretin-vs-survodutide.mdx` (TICK56/57 in flight; TICK56.md and TICK57.md both Test-Path False). Hard-locked: those two, TICK55 `amycretin-vs-retatrutide`, TICK40–54 amycretin/5-amino files awaiting Judge, TICK45 `5-amino-1mq-vs-semaglutide`, TICK47/48 `5-amino-1mq-vs-amycretin`, TICK44 `amycretin-vs-aod-9604`, and `src/content/peptides/**`. Next unlocked generated census stub from the assigned leftover set: `5-amino-1mq-vs-cagrilintide.mdx` (`lastUpdated` 2026-02-12, census FAQ 11/34 sources and 0/27 human, source-count tables, combination FAQ, consult footer). Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\5-amino-1mq-vs-cagrilintide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-semaglutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-amycretin.mdx
Test-Path src\content\comparisons\cagrilintide-vs-semaglutide.mdx
Test-Path src\content\comparisons\cagrilintide-vs-tirzepatide.mdx
Test-Path src\content\comparisons\amycretin-vs-slu-pp-332.mdx
Test-Path src\content\comparisons\amycretin-vs-survodutide.mdx
Test-Path src\content\peptides\5-amino-1mq.mdx
Test-Path src\content\peptides\cagrilintide.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK56.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK57.md
node .planning\seo-engine\runs\2026-09-01\_tick58-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick58-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick58-fetch3.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-cagrilintide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (5-amino-1mq / 5-amino-1-methylquinolinium / cagrilintide). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"5-Amino-1MQ"` count 0. `"5-amino-1-MQ"` count 0. `"5-Amino-1-methylquinolinium"` count 3 (39067875, 35013352, 33645410). `"cagrilintide"` count 97 — not dumped. `"5-Amino-1MQ" AND "cagrilintide"` count 0. `"5-amino-1-methylquinolinium" AND "cagrilintide"` count 0.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice | DIO mice. Abstract names **5-amino-1-methylquinolinium** as the NNMTi used with a low-fat diet. Describes adiposity/weight change vs diet switch alone. **No body-weight percent.** Not a human RCT. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT in cancer-associated fibroblasts… urothelial bladder cancer | Title-matched NNMT. Used 5-Amino-1-methylquinolinium iodide in UBC mouse models. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase shows anti-proliferative activity in HeLa cells | **TITLE_MATCH false** (title does not name 5-amino). HeLa cells. Not quoted. |
| PMID 34798060 NCT03856047 | Once-weekly cagrilintide for weight management… dose-finding phase 2 trial | n=706 (100–102 per cagrilintide arm; 99 liraglutide 3.0 mg; 101 placebo); 26 wk. **Trial-product** 0.3–4.5 mg **6.0%–10.8% vs 3.0%** (ETD 3.0–7.8; P&lt;0.001). 4.5 mg **10.8% vs liraglutide 3.0 mg 9.0%** (ETD 1.8; P=0.03). Treatment-policy “similar”; **no separate treatment-policy percent table**. GI 41%–63% vs 32%; nausea 20%–47% vs 18%. No 2.4 mg row invented. CT.gov COMPLETED Phase 2; enroll 706 actual; hasResults true (results module not quoted). PubMed `NCT03856047` = 34798060 only. |
| PMID 40544433 NCT05567796 REDEFINE 1 | Coadministered Cagrilintide and Semaglutide in Adults with Overweight or Obesity | n=3417; 68 wk; 21:3:3:7 (2108 / 302 / 302 / 705). **Treatment-policy.** CagriSema **−20.4% vs −3.0%** (ETD −17.3; CI −18.1 to −16.6; P&lt;0.001). Cagrilintide-alone arm named (n=302); **abstract does not publish that arm’s percent**. GI 79.6% vs 39.9%. No 22.7. CT.gov ACTIVE_NOT_RECRUITING Phase 3; enroll 3400 estimated; hasResults **false**. |
| PMID 41328546 NCT05567796 | CagriSema Reduces Blood Pressure… REDEFINE 1 | Blood-pressure secondary/post hoc. **Not** quoted as a weight-change result. Not used for a cagrilintide-alone percent. |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium / cagrilintide | All **NOT_FOUND**. |

## File

- `src/content/comparisons/5-amino-1mq-vs-cagrilintide.mdx`
  - Stripped census FAQ (11/Low vs 34/High; 0 vs 27 human), Evidence/Key Differences source-count tables (11/34), summary “11 total sources (0 human),” combination-as-unknown FAQ voice, and consult footer.
  - Dated 5-Amino-1MQ absence: street-name PubMed 0; chemical-name 3 hits, none a human obesity RCT; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted DIO mouse paper as naming the compound with **no percent**. Did not invent a mouse or human RCT percent.
  - Quoted Phase 2 trial-product range **6.0%–10.8% vs 3.0%**; 4.5 mg vs liraglutide 9.0%. Escaped P&lt;. Did not invent a 2.4 mg monotherapy row.
  - Quoted REDEFINE 1 treatment-policy **−20.4% vs −3.0%** as CagriSema, not cagrilintide-alone.
  - Dated H2H absence: PubMed `"5-Amino-1MQ" AND "cagrilintide"` and `"5-amino-1-methylquinolinium" AND "cagrilintide"` on 2026-09-02 returned 0.
  - openFDA: 5-amino NOT_FOUND; cagrilintide NOT_FOUND.
  - Linked `/peptides/5-amino-1mq`, `/peptides/cagrilintide`, `/compare/5-amino-1mq-vs-semaglutide`, `/compare/cagrilintide-vs-tirzepatide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (157 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS (first pass FAIL on body “dose-finding”; rephrased; second pass PASS). `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (this filename never in the dispatch mismatch list). Select-String: leftover census FAQ strings, Consult, Who Might, `dosing`/`inject`/`protocol`, banned leftover percents, unescaped `P<`, `$1,000`, trailing-slash hrefs — all 0 except the FAQ question “Which has more clinical evidence” and the paper title “dose-finding” in YAML. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `amycretin-vs-slu-pp-332.mdx`, `amycretin-vs-survodutide.mdx`, `amycretin-vs-retatrutide.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, `amycretin-vs-aod-9604.mdx`, KEEP `cagrilintide-vs-semaglutide.mdx` / `cagrilintide-vs-tirzepatide.mdx`, or `src/content/peptides/**`.
- Did not restore OSA 63%/6%, TRIUMPH 28.7%, REDEFINE 22.7/15.7/23–25.5, or a 5-Amino-1MQ RCT percent.
- Did not quote a cagrilintide-alone percent from REDEFINE 1.
- Did not cite PMID 33645410 (title miss), PMID 39067875 (not obesity), or PMID 41328546 (BP paper) as weight results.
- Did not dump the 97-hit cagrilintide esearch into the page.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `5-amino-1mq-vs-cagrilintide.mdx` census FAQ (11/0 vs 34/27) and consult footer stripped. Count-QA leftovers at dispatch were the two locked amycretin stubs.
2. 5-Amino-1MQ: no human obesity RCT this run; street-name PubMed 0; CT.gov 0 as of 2026-09-02; DIO mouse abstract names the compound and publishes **no** percent (PMID 35013352).
3. Cagrilintide Phase 2 quoted as trial-product **6.0%–10.8% vs 3.0%** at 26 weeks; 4.5 mg 10.8% vs liraglutide 9.0% (PMID 34798060).
4. REDEFINE 1 quoted as CagriSema treatment-policy **−20.4% vs −3.0%**; cagrilintide-alone arm named without a percent (PMID 40544433).
5. openFDA: 5-amino NOT_FOUND; cagrilintide NOT_FOUND as of 2026-09-02. No invented approval year or obesity Phase 3 for 5-Amino-1MQ.
6. No $1,000 row present to keep or strip (TICK6-PRICE). Links without trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `5-amino-1mq-vs-*` (except TICK45/47/48 files) and `aod-9604-vs-*`. One file per tick.
