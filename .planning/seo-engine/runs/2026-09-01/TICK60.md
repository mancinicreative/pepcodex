# TICK60 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/5-amino-1mq-vs-ct-388.mdx`. Generated census stub (11/Low vs 12/Moderate; 0 vs 6 human; Total Sources 11/12) plus truncated “$2.” overview, combination FAQ, and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK59.md (read after it landed; `_tick59-fetch.mjs` was the first signal) assigned `5-amino-1mq-vs-cagrisema.mdx`. TICK58.md assigned `5-amino-1mq-vs-cagrilintide.mdx`. Those files were not opened. Hard-locked: TICK58 cagrilintide, TICK59 cagrisema, TICK57 `amycretin-vs-survodutide`, TICK56 `amycretin-vs-slu-pp-332`, TICK45 `5-amino-1mq-vs-semaglutide`, TICK47/48 `5-amino-1mq-vs-amycretin`, TICK44 `amycretin-vs-aod-9604`, and `src/content/peptides/**`. Next unlocked generated census stub from the assigned leftover set: `5-amino-1mq-vs-ct-388.mdx` (`lastUpdated` 2026-02-12, census FAQ 11/12 sources and 0/6 human, source-count tables, truncated “$2.” overview, combination FAQ, consult footer). Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
node .planning\seo-engine\runs\2026-09-01\_tick60-inventory.mjs
node .planning\seo-engine\runs\2026-09-01\_tick60-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick60-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick60-fetch3.mjs
node .planning\seo-engine\runs\2026-09-01\_tick60-write.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-ct-388.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
node .planning\seo-engine\runs\2026-09-01\_tick60-grep.mjs
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (5-amino-1mq / 5-amino-1-methylquinolinium / ct-388 / ct388 / enicepatide / ro7795068). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"5-Amino-1MQ"` count 0. `"5-amino-1-MQ"` count 0. `"5-Amino-1-methylquinolinium"` count 3 (39067875, 35013352, 33645410). `"CT-388"` / `"CT388"` / `"CT 388"` count 2 (41319798, 34176426). `"enicepatide"` / `"RO7795068"` count 0. `"5-Amino-1MQ" AND "CT-388"` count 0. `"5-amino-1-methylquinolinium" AND "CT-388"` count 0. `"5-Amino-1MQ" AND "enicepatide"` count 0.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice | DIO mice. Abstract names **5-amino-1-methylquinolinium** as the NNMTi used with a low-fat diet. Describes adiposity/weight change vs diet switch alone. **No body-weight percent.** Not a human RCT. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT in cancer-associated fibroblasts… urothelial bladder cancer | Title-matched NNMT. Used 5-Amino-1-methylquinolinium iodide in UBC mouse models. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase shows anti-proliferative activity in HeLa cells | **TITLE_MATCH false** (title does not name 5-amino). HeLa cells. Not quoted. |
| PMID 41319798 NCT04838405 | Effects of CT-388, a once-weekly signaling-biased dual GLP-1/GIP receptor agonist… | Phase 1. Single-administration 0.5–7.5 mg or four once-weekly 5–12 mg. Day 29 mean percent change **−4.7% to −8.0% vs −0.5%**. Abstract does **not** publish per-arm percents and does **not** name an estimand. CT.gov COMPLETED Phase 1; enroll 129 actual; hasResults **false**. Lead sponsor Carmot Therapeutics, Inc. PubMed `NCT04838405` = 41319798 only. |
| PMID 34176426 | Emerging glucagon-like peptide 1 receptor agonists for the treatment of obesity | 2021 pipeline review. Title does **not** name CT-388. Abstract lists CT-388 among many compounds. **Not quoted** as a trial result. |
| NCT06525935 | Enicepatide (CT-388) obesity / overweight + comorbidity | COMPLETED Phase 2. Enroll 469 actual. Primary completion 2025-12-08 actual. hasResults **false**. PubMed 0. Design only. |
| NCT06628362 | Enicepatide (CT-388) overweight / obesity + T2D | ACTIVE_NOT_RECRUITING Phase 2. Enroll 447 actual. Primary completion 2026-05-29 actual. hasResults **false**. PubMed 0. Design only. |
| NCT07351045 Enith1 / NCT07351058 Enith2 | Enicepatide (RO7795068) Phase 3 | RECRUITING. Enroll 2000 / 1600 estimated. hasResults **false**. PubMed 0. Not quoted as results. |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium / ct-388 / ct388 / enicepatide / ro7795068 | All **NOT_FOUND**. |

## File

- `src/content/comparisons/5-amino-1mq-vs-ct-388.mdx`
  - Stripped census FAQ (11/Low vs 12/Moderate; 0 vs 6 human), Evidence/Key Differences source-count tables (11/12), summary “11 total sources (0 human),” truncated “$2.” overview, combination-as-unknown FAQ voice, and consult footer.
  - Dated 5-Amino-1MQ absence: street-name PubMed 0; chemical-name 3 hits, none a human obesity RCT; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted DIO mouse paper as naming the compound with **no percent**. Did not invent a mouse or human RCT percent.
  - Quoted CT-388 Phase 1 day-29 range **−4.7% to −8.0% vs −0.5%**. Did not collapse the range. Estimand not named.
  - Dated NCT06525935 / NCT06628362 / Enith1 / Enith2 absences (hasResults false; PubMed 0 as of 2026-09-02). No unpublished Phase 2 or Phase 3 percent.
  - Dated H2H absence: PubMed `"5-Amino-1MQ" AND "CT-388"` and `"5-amino-1-methylquinolinium" AND "CT-388"` on 2026-09-02 returned 0.
  - openFDA: 5-amino NOT_FOUND; CT-388 / enicepatide / ro7795068 NOT_FOUND.
  - Linked `/peptides/5-amino-1mq`, `/peptides/ct-388`, `/compare/5-amino-1mq-vs-semaglutide`, `/compare/ct-388-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a Roche acquisition price.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (158 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages). Select-String: leftover census FAQ strings, Consult, Who Might, `dosing`/`inject`/`protocol`, banned leftover percents, unescaped `P<`, `$1,000`, trailing-slash hrefs — all 0 except the FAQ question “Which has more clinical evidence” and the paper title “combined” / “once-weekly” in YAML. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-cagrisema.mdx`, `amycretin-vs-survodutide.mdx`, `amycretin-vs-slu-pp-332.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, `amycretin-vs-aod-9604.mdx`, or `src/content/peptides/**`.
- Did not restore OSA 63%/6%, TRIUMPH 28.7%, REDEFINE 22.7/15.7/23–25.5, or a 5-Amino-1MQ RCT percent.
- Did not quote a Phase 2 or Phase 3 CT-388 / enicepatide percent.
- Did not cite PMID 33645410 (title miss), PMID 39067875 (not obesity), or PMID 34176426 (pipeline review) as weight results.
- Did not invent a Roche “$2.” acquisition figure.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `5-amino-1mq-vs-ct-388.mdx` census FAQ (11/0 vs 12/6) and consult footer stripped. TICK59 locked `5-amino-1mq-vs-cagrisema.mdx`.
2. 5-Amino-1MQ: no human obesity RCT this run; street-name PubMed 0; CT.gov 0 as of 2026-09-02; DIO mouse abstract names the compound and publishes **no** percent (PMID 35013352).
3. CT-388 Phase 1 quoted as day 29 mean **−4.7% to −8.0% vs −0.5%** (PMID 41319798). Range not collapsed. Estimand not named.
4. Phase 2 NCT06525935 / NCT06628362: hasResults false and PubMed 0 as of 2026-09-02; design only. Enith1/Enith2 recruiting Phase 3; no unpublished percent.
5. openFDA: 5-amino NOT_FOUND; CT-388 / enicepatide / ro7795068 NOT_FOUND as of 2026-09-02. No invented approval year or obesity Phase 3 for 5-Amino-1MQ.
6. No $1,000 row present to keep or strip (TICK6-PRICE). Links without trailing slash. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `5-amino-1mq-vs-*` (except TICK45/47/48/58/59 files and this file) and `aod-9604-vs-*`. One file per tick.
