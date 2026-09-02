# TICK65 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/5-amino-1mq-vs-tirzepatide.mdx`. Generated census stub (11/Low vs 76/High; 0 vs 68 human; Total Sources 11/76) plus combination FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK62.md claims `5-amino-1mq-vs-maritide.mdx`. TICK63.md assigned `5-amino-1mq-vs-liraglutide.mdx` (awaiting Judge). TICK64.md also claims `5-amino-1mq-vs-liraglutide.mdx`. Hard-locked: TICK63/64 liraglutide, TICK60 `5-amino-1mq-vs-ct-388`, TICK61 `5-amino-1mq-vs-aod-9604`, TICK59 `5-amino-1mq-vs-cagrisema`, TICK58 `5-amino-1mq-vs-cagrilintide`, TICK45 `5-amino-1mq-vs-semaglutide`, TICK47/48 `5-amino-1mq-vs-amycretin`, TICK62 `5-amino-1mq-vs-maritide`, and `src/content/peptides/**`. Next unlocked generated census stub from the assigned leftover set: `5-amino-1mq-vs-tirzepatide.mdx` (`lastUpdated` 2026-02-12, census FAQ 11/76 sources and 0/68 human, source-count tables, combination FAQ, consult footer). Locked compares and peptide dossiers were not opened (path-checked only). No `aod-9604-vs-*` file was taken this tick.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
node .planning\seo-engine\runs\2026-09-01\_tick65-inventory.mjs
Test-Path src\content\comparisons\5-amino-1mq-vs-tirzepatide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-liraglutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-maritide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-cagrisema.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-cagrilintide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-ct-388.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-semaglutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-amycretin.mdx
Test-Path src\content\comparisons\tirzepatide-vs-semaglutide.mdx
Test-Path src\content\peptides\5-amino-1mq.mdx
Test-Path src\content\peptides\tirzepatide.mdx
node .planning\seo-engine\runs\2026-09-01\_tick65-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick65-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick65-fetch3.mjs
node .planning\seo-engine\runs\2026-09-01\_tick65-write.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-tirzepatide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
node .planning\seo-engine\runs\2026-09-01\_tick65-grep.mjs
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (5-amino-1mq / 5-amino-1-methylquinolinium) / 200 (tirzepatide generic; Mounjaro brand; Zepbound brand; NDA215866; NDA217806). fetch2 openFDA appl lookup timed out after abstracts + CT.gov; fetch3 retried NDA215866 / NDA217806 (STATUS 200). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"5-Amino-1MQ"` count 0. `"5-amino-1-MQ"` count 0. `"5-Amino-1-methylquinolinium"` count 3 (39067875, 35013352, 33645410). `"SURMOUNT-1"` count 58 — not dumped. `"SURMOUNT 1" AND tirzepatide` count 55 — not dumped. `"5-Amino-1MQ" AND "tirzepatide"` count 0. `"5-amino-1-methylquinolinium" AND "tirzepatide"` count 0. `NCT04184622` count 22. `35658024[uid]` count 1.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice | DIO mice. Abstract names **5-amino-1-methylquinolinium** as the NNMTi used with a low-fat diet. Describes adiposity/weight change vs diet switch alone. **No body-weight percent.** Not a human RCT. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT in cancer-associated fibroblasts… urothelial bladder cancer | Title-matched NNMT. Used 5-Amino-1-methylquinolinium iodide in UBC mouse models. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase shows anti-proliferative activity in HeLa cells | **TITLE_MATCH false** (title does not name 5-amino). HeLa cells. Not quoted. |
| PMID 35658024 NCT04184622 SURMOUNT-1 | Tirzepatide Once Weekly for the Treatment of Obesity | n=2539; 72 wk; no diabetes. Coprimary = percent weight change and ≥5% reduction. **Treatment-regimen estimand** (effects regardless of discontinuation; ITT). Mean **−15.0% / −19.5% / −20.9% vs −3.1%** (5/10/15 mg vs placebo; 95% CIs in abstract; P&lt;0.001). ≥5% 85%/89%/91% vs 35%. ≥20% at 10 mg 50% (46–54) and 15 mg **57%** (53–61) vs 3% (1–5). AE discontinuation 4.3%/7.1%/6.2% vs 2.6%. CT.gov COMPLETED Phase 3; hasResults **true**. Lead sponsor Eli Lilly and Company. PubMed `NCT04184622` count 22; this page quotes 35658024 only. |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium | Both **NOT_FOUND**. |
| openFDA drugsfda | generic tirzepatide; brand Mounjaro / Zepbound; NDA215866 / NDA217806 | Mounjaro NDA215866 ORIG AP **2022-05-13**. Zepbound NDA217806 ORIG AP **2023-11-08**. |

## File

- `src/content/comparisons/5-amino-1mq-vs-tirzepatide.mdx`
  - Stripped census FAQ (11/Low vs 76/High; 0 vs 68 human), Evidence/Key Differences source-count tables (11/76), summary “11 total sources (0 human),” combination-as-unknown FAQ voice, and consult footer.
  - Dated 5-Amino-1MQ absence: street-name PubMed 0; chemical-name 3 hits, none a human obesity RCT; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted DIO mouse paper as naming the compound with **no percent**. Did not invent a mouse or human RCT percent.
  - Quoted SURMOUNT-1 as treatment-regimen percents (−15.0% / −19.5% / −20.9% vs −3.1%) plus responder bands from the abstract. Estimand named as treatment-regimen.
  - Dated H2H absence: PubMed `"5-Amino-1MQ" AND "tirzepatide"` and `"5-amino-1-methylquinolinium" AND "tirzepatide"` on 2026-09-02 returned 0.
  - openFDA: 5-amino NOT_FOUND; Mounjaro / Zepbound original approvals dated from ORIG AP fields.
  - Linked `/peptides/5-amino-1mq`, `/peptides/tirzepatide`, `/compare/5-amino-1mq-vs-semaglutide`, `/compare/tirzepatide-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (132 CRLF, 0 LF-only).
  - First `qa-banned-content.js` FAIL on “dose” in “dose-escalation”; rewritten without that word, then PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages). `_tick65-grep.mjs`: leftover census FAQ strings, Consult, Who Might, `dosing`/`dose`/`inject`/`protocol`, unescaped `P<`, `$1,000`, trailing-slash hrefs — all 0 except the dated “not invented … obesity Phase 3” line. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `5-amino-1mq-vs-liraglutide.mdx`, `5-amino-1mq-vs-maritide.mdx`, `5-amino-1mq-vs-aod-9604.mdx`, `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-cagrisema.mdx`, `5-amino-1mq-vs-ct-388.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, other leftover `5-amino-1mq-vs-*` / `aod-9604-vs-*` census stubs, or `src/content/peptides/**`.
- Did not restore census 11/76 or 0/68, an invented 5-Amino-1MQ RCT percent, or an invented 5-Amino-1MQ obesity Phase 3.
- Did not cite PMID 33645410 (title miss), PMID 39067875 (not obesity), or dump the 58-hit SURMOUNT-1 / 55-hit SURMOUNT 1 / 22-hit NCT04184622 esearch lists.
- Did not invent a CT.gov enrollment field (full NCT enroll object was absent from the returned payload; n=2539 is from the journal abstract).
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `5-amino-1mq-vs-tirzepatide.mdx` census FAQ (11/0 vs 76/68) and consult footer stripped. TICK62 locked `5-amino-1mq-vs-maritide.mdx`. TICK63/64 locked `5-amino-1mq-vs-liraglutide.mdx`.
2. 5-Amino-1MQ: no human obesity RCT this run; street-name PubMed 0; CT.gov 0 as of 2026-09-02; DIO mouse abstract names the compound and publishes **no** percent (PMID 35013352).
3. SURMOUNT-1 quoted as treatment-regimen **−15.0% / −19.5% / −20.9% vs −3.1%** at 72 weeks (PMID 35658024). Estimand named.
4. ≥20% at 15 mg quoted as **57%** (95% CI 53–61), not a rounded headline above that interval.
5. openFDA: 5-amino NOT_FOUND; Mounjaro ORIG AP 2022-05-13; Zepbound ORIG AP 2023-11-08. H2H PubMed 0. No invented 5-Amino-1MQ obesity Phase 3.
6. No $1,000 row present to keep or strip (TICK6-PRICE). Links without trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed after stripping “dose”; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `5-amino-1mq-vs-*` (except TICK45/47/48/58/59/60/61/62/63/64/65 files) and `aod-9604-vs-*`. One file per tick.
