# TICK48 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/5-amino-1mq-vs-amycretin.mdx`. Generated census stub (11/Low vs 8/Moderate; inverted 0-vs-4 “more clinical evidence”; Human Studies 0/6 vs Summary 0/4; Total Sources 11/11) plus consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK46.md (read) locked `amycretin-vs-ct-388.mdx`. TICK47.md was absent at dispatch and stayed absent. Hard-locked: TICK45 `5-amino-1mq-vs-semaglutide`, TICK44 `amycretin-vs-aod-9604`, TICK43 `amycretin-vs-cagrisema`, KEEP `amycretin-vs-semaglutide` / `amycretin-vs-tirzepatide`. TICK46 had treated this file as locked while TICK45.md was absent; TICK45 actually cleaned vs-semaglutide. This file was the unlocked 5-amino leftover: generated stub (`lastUpdated` 2026-02-12), census FAQ, source-count tables, and consult footer. No invented ~ percents or $1,000 row were present to strip.

`src/content/peptides/**` not opened (path-checked only). Locked compare files not edited.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\peptides\5-amino-1mq.mdx
Test-Path src\content\peptides\amycretin.mdx
Test-Path src\content\comparisons\amycretin-vs-semaglutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-semaglutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-tirzepatide.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK46.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK47.md
node .planning\seo-engine\runs\2026-09-01\_tick48-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick48-fetch2.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-amycretin.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200 (`"5-Amino-1MQ"` count 0; `"5-amino-1-MQ"` count 0; `"5-Amino-1-methylquinolinium"` count 3; first `"amycretin"` 429 then retry 200 count 21). Oral/SC/DIO uid esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200 (amycretin NCTs; 5-amino alias searches 0 studies). openFDA drugsfda STATUS 404 (5-amino-1mq / 5-amino-1-methylquinolinium / amycretin). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 NCT05369390 | Safety, tolerability, pharmacokinetics, and pharmacodynamics of the first-in-class GLP-1 and amylin receptor agonist, amycretin: a first-in-human, phase 1… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; enroll 144 actual; hasResults **false**. |
| PMID 40550231 NCT06064006 | Amycretin, a novel, unimolecular GLP-1 and amylin receptor agonist administered subcutaneously | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 **−24.3% vs −1.1%**; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. CT.gov COMPLETED Phase 2; enroll 125 actual; hasResults **false**. |
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice | DIO mice. Abstract names **5-amino-1-methylquinolinium** as the NNMTi used with a low-fat diet. Describes adiposity/weight change vs diet switch alone. **No body-weight percent.** Not a human RCT. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT in cancer-associated fibroblasts… urothelial bladder cancer | Title-matched NNMT. Used 5-Amino-1-methylquinolinium iodide in UBC mouse models. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase shows anti-proliferative activity in HeLa cells | **TITLE_MATCH false** (title does not name 5-amino). HeLa cells. Not quoted. |
| NCT06049329 | A Research Study of How a New Medicine Called Amycretin, Given as Tablets, Works in Japanese Men With Obesity | CT.gov STATUS 200. Official title: oral NNC0487-0111 in Japanese participants with obesity. COMPLETED Phase 1; enroll 36 actual; TEAE primary; hasResults **false**. PubMed NCT search count **0**. No percent invented. |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino | All **0** studies as of 2026-09-02. |
| CT.gov search | amycretin | 1 study (NCT06049329). |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium / amycretin | All **NOT_FOUND**. |

Esearch `"amycretin"` count 21 — later papers not dumped.

## File

- `src/content/comparisons/5-amino-1mq-vs-amycretin.mdx`
  - Stripped census FAQ (11/8 sources; inverted 0-vs-4 human row), Evidence/Key Differences source-count tables (11/11; 0/6 human), summary “11 total sources (0 human)” / “8 total sources (4 human),” and consult footer.
  - Dated 5-Amino-1MQ absence: street-name PubMed 0; chemical-name 3 hits, none a human obesity RCT; CT.gov 0 as of 2026-09-02.
  - Quoted DIO mouse paper as naming the compound with **no percent**. Did not invent a mouse or human RCT percent.
  - Quoted oral first-in-human as TEAE-primary / day-85 exploratory with **no percent**. Did not write ~13/~25.
  - Quoted SC estimated means as **secondary** (TEAE primary), including 60 mg week 36 **−24.3% vs −1.1%**. Escaped P&lt;.
  - Quoted NCT06049329 as registry-only (TEAE primary; hasResults false; PubMed 0). No invented percent.
  - openFDA: 5-amino NOT_FOUND; amycretin NOT_FOUND. No invented approval year.
  - Linked `/peptides/5-amino-1mq`, `/peptides/amycretin`, `/compare/amycretin-vs-semaglutide`, `/compare/5-amino-1mq-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (186 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: this filename not in the remaining 16 amycretin census mismatches. Select-String battery: census FAQ strings, Consult, Who Might, ~13/~25, unescaped `P<`, trailing-slash hrefs — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch TICK46 `amycretin-vs-ct-388.mdx`, TICK45 `5-amino-1mq-vs-semaglutide.mdx`, TICK44 `amycretin-vs-aod-9604.mdx`, TICK43 `amycretin-vs-cagrisema.mdx`, KEEP `amycretin-vs-semaglutide` / `amycretin-vs-tirzepatide`, other leftover `amycretin-vs-*` / `5-amino-1mq-vs-*` / `aod-9604-vs-*` census stubs, or `src/content/peptides/**`.
- Did not restore oral amycretin ~13/~25.
- Did not cite PMID 33645410 (title miss) or PMID 39067875 as a weight result.
- Did not invent a 5-Amino-1MQ or amycretin obesity Phase 3.
- Did not run an `"NNMTi"` class esearch this increment (not claimed on the page).
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `5-amino-1mq-vs-amycretin.mdx` census FAQ (11/8 sources; 0-vs-4 / 0-vs-6 human) and consult footer stripped.
2. 5-Amino-1MQ: no human obesity RCT this run; street-name PubMed 0; CT.gov 0 as of 2026-09-02; DIO mouse abstract names the compound and publishes **no** percent (PMID 35013352).
3. Oral first-in-human quoted as TEAE-primary; day-85 body weight exploratory; **no percent** in the abstract (PMID 40550229).
4. SC phase 1b/2a quoted as secondary estimated mean **−24.3% vs −1.1%** at 60 mg week 36 (PMID 40550231).
5. NCT06049329 quoted as completed Phase 1 registry row only (hasResults false; PubMed 0). openFDA NOT_FOUND for both compounds. No invented approval year or obesity Phase 3.
6. **No $1,000 row** on this page (none added or stripped). Links without trailing slash. P&lt; escaped. CRLF. No ~13/~25.
7. Implementer QA on this file passed; filename not in remaining `qa:counts` mismatches; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Generated census stubs remain (other `amycretin-vs-*`, other `5-amino-1mq-vs-*`, `aod-9604-vs-*`). One file per tick.
