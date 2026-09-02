Assigned file: `src/content/comparisons/5-amino-1mq-vs-orforglipron.mdx`

# TICK72 — implementer note (not a KEEP)

Chosen file: `src/content/comparisons/5-amino-1mq-vs-orforglipron.mdx`

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/5-amino-1mq-vs-orforglipron.mdx`. Generated census stub (11/Low vs 37/High; 0 vs 28 human; Total Sources 11/37) plus combination FAQ, “Phase 3 validated status,” and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Dispatch assigned this path. File existed and still contained census FAQ (11/Low vs 37/High; 0 vs 28 human), Evidence/Key Differences source-count tables (11/37; 0/28 human; 10/1 preclinical), “FDA-approved or Phase 3 validated status,” combination-as-compatible FAQ, and consult footer (`lastUpdated` 2026-02-12). Hard-locked this increment: `5-amino-1mq-vs-pemvidutide.mdx` (TICK73), `5-amino-1mq-vs-vk2735.mdx` (TICK74), TICK60–TICK71 claimed files, `5-amino-1mq-vs-cagrisema`, `5-amino-1mq-vs-cagrilintide`, `5-amino-1mq-vs-semaglutide`, `5-amino-1mq-vs-amycretin`, and `src/content/peptides/**`. Locked compares and peptide dossiers were not opened for edit (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\5-amino-1mq-vs-orforglipron.mdx
Test-Path src\content\peptides\5-amino-1mq.mdx
Test-Path src\content\peptides\orforglipron.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-semaglutide.mdx
Test-Path src\content\comparisons\orforglipron-vs-semaglutide.mdx
Test-Path src\content\comparisons\amycretin-vs-orforglipron.mdx
Test-Path src\content\comparisons\aod-9604-vs-orforglipron.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-pemvidutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-vk2735.mdx
node .planning\seo-engine\runs\2026-09-01\_tick72-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick72-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick72-efetch-amino.mjs
node .planning\seo-engine\runs\2026-09-01\_tick72-write.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-orforglipron.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
node .planning\seo-engine\runs\2026-09-01\_tick72-grep.mjs
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200 (one `"5-amino-1-methylquinolinium"` 429 then retry 200). NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (5-amino-1mq / 5-amino-1-methylquinolinium) and STATUS 200 (orforglipron / Foundayo / NDA220934). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"5-Amino-1MQ"` count 0. `"5-amino-1-MQ"` count 0. `"5-Amino-1-methylquinolinium"` count 3 (39067875, 35013352, 33645410). `"orforglipron"` count 128 — not dumped. `"LY3502970"` count 13 — not dumped. `"ATTAIN-1"` count 6. `"Foundayo"` count 6. `"5-Amino-1MQ" AND "orforglipron"` count 0. `"5-amino-1-methylquinolinium" AND "orforglipron"` count 0. `"5-Amino-1MQ" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III")` count 0. Same clinical-trial terms with `"5-amino-1-methylquinolinium"` count 0.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition… DIO mice | TITLE_MATCH (NNMT). Abstract names **5-amino-1-methylquinolinium**. DIO **mice**. Whole-body adiposity and weight loss vs diet switch alone. Abstract publishes **no body-weight percent**. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT… urothelial bladder cancer | TITLE_MATCH (NNMT). Used 5-Amino-1-methylquinolinium iodide in UBC **mouse** models. Not an obesity RCT. Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase… HeLa cells | **TITLE_MATCH false.** HeLa-cell paper. Not quoted. |
| PMID 40960239 NCT05869903 | Orforglipron, an Oral Small-Molecule GLP-1 Receptor Agonist for Obesity Treatment | TITLE_MATCH. Phase 3; 3127 adults with obesity without diabetes; 72 weeks. **Treatment-regimen estimand**, ITT. Mean change −7.5% (6 mg), −8.4% (12 mg), −11.2% (36 mg) vs −2.1% placebo (P&lt;0.001). At 36 mg: ≥10% 54.6% vs 12.9%; ≥15% 36.0% vs 5.9%; ≥20% 18.4% vs 2.8%. AE discontinuation 5.3–10.3% vs 2.7%. |
| PMID 37351564 NCT05051579 | Daily Oral GLP-1 Receptor Agonist Orforglipron for Adults with Obesity | TITLE_MATCH. Phase 2; 272 adults; 36 weeks. Week 26 −8.6% to −12.6% vs −2.0%. Week 36 −9.4% to −14.7% vs −2.3%. ≥10% by week 36: 46–75% vs 9%. GI discontinuation 10–17%. Abstract does **not** publish a 36 mg vs 45 mg split. |
| PMID 42577069 | Orforglipron… ≥65 years… ATTAIN-1 and ATTAIN-2 | TITLE_MATCH. Post-hoc subgroup. **Not quoted** as the primary ATTAIN-1 result. |
| PMID 42225305 | Oral Semaglutide 25 mg Versus Orforglipron 36 mg… ITC | TITLE_MATCH. Population-adjusted indirect comparison. Not a 5-Amino-1MQ trial. Not quoted as H2H. |
| PMID 40481478 | (PubMed on NCT05051579) | Not fetched as a quote. Not used as the obesity weight result. |
| NCT05869903 ATTAIN-1 | CT.gov v2 | ACTIVE_NOT_RECRUITING Phase 3. Enrollment 3127 ACTUAL. hasResults **true**. Lead sponsor Eli Lilly and Company. Primary completion 2025-07-25 actual. PubMed 40960239, 42577069. |
| NCT05051579 | CT.gov v2 | COMPLETED Phase 2. Enrollment 272 ACTUAL. hasResults **true**. Lead sponsor Eli Lilly and Company. PubMed 37351564, 40481478. |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium | Both **NOT_FOUND**. |
| openFDA drugsfda | generic orforglipron / brand Foundayo / NDA220934 | Foundayo NDA220934, ELI LILLY AND CO, ORIG AP **2026-04-01**. |

## File

- `src/content/comparisons/5-amino-1mq-vs-orforglipron.mdx`
  - Stripped census FAQ (11/Low vs 37/High; 0 vs 28 human), Evidence/Key Differences source-count tables (11/37; 0/28; 10/1), summary “11 total sources (0 human),” combination-as-compatible FAQ voice, consult footer, and “FDA-approved or Phase 3 validated status.”
  - Dated 5-Amino-1MQ absence: street-name aliases 0; chemical-name 3 hits, none a human obesity RCT percent; RCT/Phase 3 queries 0; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted DIO mouse paper as naming 5-amino-1-methylquinolinium with **no percent** (PMID 35013352). Did not invent a human RCT percent.
  - PMID 39067875 noted as UBC mouse / CAF paper, not quoted as a weight result. PMID 33645410 title-miss, not quoted.
  - Quoted ATTAIN-1 treatment-regimen 36 mg −11.2% vs −2.1% at 72 weeks, plus published responder bands (PMID 40960239). Did not substitute PMID 42577069 subgroup percents.
  - Quoted phase 2 as the published week-36 range −9.4% to −14.7% vs −2.3%, not a 36 mg / 45 mg table (PMID 37351564). Did not quote PMID 40481478.
  - Dated H2H absence: PubMed `"5-Amino-1MQ" AND "orforglipron"` and `"5-amino-1-methylquinolinium" AND "orforglipron"` on 2026-09-02 returned 0. PMID 42225305 noted as an oral-semaglutide ITC, not a 5-Amino-1MQ H2H.
  - openFDA: 5-Amino-1MQ NOT_FOUND; Foundayo NDA 220934 ORIG AP 2026-04-01.
  - Linked `/peptides/5-amino-1mq`, `/peptides/orforglipron`, `/compare/5-amino-1mq-vs-semaglutide`, `/compare/5-amino-1mq-vs-aod-9604`, `/compare/aod-9604-vs-orforglipron`, `/compare/orforglipron-vs-semaglutide` (no trailing slash). Did not edit those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (154 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages). `_tick72-grep.mjs`: leftover census FAQ strings, Consult, Who Might, `dosing`/`dose`/`inject`/`protocol`, unescaped `P<`, `$1,000`, trailing-slash hrefs, invented 5-Amino-1MQ Phase 3 claim — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `5-amino-1mq-vs-pemvidutide.mdx`, `5-amino-1mq-vs-vk2735.mdx`, TICK60–TICK71 claimed files, `5-amino-1mq-vs-cagrisema.mdx`, `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, or `src/content/peptides/**`.
- Did not restore census 11/37 or 0/28, an invented 5-Amino-1MQ RCT percent, or an invented 5-Amino-1MQ obesity Phase 3.
- Did not cite PMID 39067875 or PMID 33645410 as obesity results.
- Did not dump the 128-hit orforglipron or 13-hit LY3502970 lists onto the page as results.
- Did not quote PMID 42577069 subgroup percents or PMID 40481478 as the obesity weight result.
- Did not quote PMID 42225305 as a head-to-head RCT.
- Did not invent ACHIEVE-J or ATTAIN-2 obesity percents.
- Did not copy Foundayo tablet strengths.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Assigned leftover cleaned: `5-amino-1mq-vs-orforglipron.mdx` census FAQ (11/0 vs 37/28) and consult footer stripped. TICK73 locked pemvidutide. TICK74 locked vk2735.
2. 5-Amino-1MQ: no human obesity RCT percent this run; street-name aliases 0; chemical-name 3 papers, none a human obesity RCT; CT.gov 0 as of 2026-09-02.
3. DIO mouse only: abstract names 5-amino-1-methylquinolinium and publishes **no** percent (PMID 35013352). No invented 5-Amino-1MQ obesity Phase 3.
4. ATTAIN-1 quoted as treatment-regimen 36 mg week 72 **−11.2% vs −2.1%** (PMID 40960239 / NCT05869903). Responder bands copied from the abstract, not rounded.
5. Phase 2 quoted as week-36 range **−9.4% to −14.7% vs −2.3%** (PMID 37351564). Range not collapsed. No 36 mg / 45 mg table invented.
6. openFDA: 5-Amino-1MQ NOT_FOUND; Foundayo NDA 220934 ORIG AP 2026-04-01 as of 2026-09-02. No $1,000 row (TICK6-PRICE). Links without trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other leftover `5-amino-1mq-vs-*` except this file and TICK45/47/48/58/59/60/61/62/63/64/65/73/74 claims; leftover `aod-9604-vs-*` except TICK66–TICK71 claims. One file per tick.
