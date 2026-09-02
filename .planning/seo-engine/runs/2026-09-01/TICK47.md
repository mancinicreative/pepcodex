# TICK47 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/5-amino-1mq-vs-amycretin.mdx`. Census FAQ (11/Low vs 8/Moderate; 0 vs 4 human; table 0/6 human; Total Sources 11/11) plus consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK45.md assigned `5-amino-1mq-vs-semaglutide.mdx`. TICK46.md (in flight) assigned `amycretin-vs-ct-388.mdx`. TICK46 had treated this file as locked while TICK45.md was absent; TICK45 actually cleaned the semaglutide twin, so this file was unlocked. Next named leftover after those locks + TICK44 `amycretin-vs-aod-9604` / TICK43 `amycretin-vs-cagrisema` / TICK41 `amycretin-vs-cagrilintide` / TICK40 `amycretin-vs-vk2735` / KEEP TICK27/20: this 5-amino census stub (`lastUpdated` 2026-02-12). Locked files and `src/content/peptides/**` not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\peptides\5-amino-1mq.mdx
Test-Path src\content\peptides\amycretin.mdx
Test-Path src\content\comparisons\amycretin-vs-semaglutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-semaglutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-tirzepatide.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK45.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK46.md
node .planning\seo-engine\runs\2026-09-01\_tick47-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick47-fetch2.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-amycretin.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200 (PMID 39067875 first pass 429, retry 200). NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (5-amino-1mq / 5-amino-1-methylquinolinium / amycretin). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"5-Amino-1MQ"` count 0. `"5-amino-1-MQ"` count 0. `"5-Amino-1-methylquinolinium"` count 3 (39067875, 33645410, 35013352). `"amycretin"` count 21. Oral UID 40550229 count 1. SC UID 40550231 count 1. `"NNMTi"` count 10 — not dumped as 5-Amino-1MQ RCTs.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice | DIO mice. Abstract names **5-amino-1-methylquinolinium** as the NNMTi used with a low-fat diet. Describes adiposity/weight change vs diet switch alone. **No body-weight percent.** Not a human RCT. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT in cancer-associated fibroblasts… urothelial bladder cancer | Title-matched NNMT. Abstract used 5-Amino-1-methylquinolinium iodide in UBC mouse models. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase shows anti-proliferative activity in HeLa cells | **TITLE_MATCH false** (title does not name 5-amino). HeLa cells. Not quoted. |
| PMID 40550229 NCT05369390 | Safety, tolerability, pharmacokinetics, and pharmacodynamics of the first-in-class GLP-1 and amylin receptor agonist, amycretin: a first-in-human, phase 1… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; enroll 144 actual; hasResults **false**. |
| PMID 40550231 NCT06064006 | Amycretin, a novel, unimolecular GLP-1 and amylin receptor agonist administered subcutaneously | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 **−24.3% vs −1.1%**; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. CT.gov COMPLETED Phase 2; enroll 125 actual; hasResults **false**. |
| NCT06049329 | A Research Study of How a New Medicine Called Amycretin, Given as Tablets, Works in Japanese Men With Obesity | CT.gov `query.term` amycretin (1 study). COMPLETED Phase 1; enroll 36 actual; TEAE primary; hasResults **false**. PubMed NCT search count **0**. No weight percent. |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium / amycretin | All **NOT_FOUND**. |

## File

- `src/content/comparisons/5-amino-1mq-vs-amycretin.mdx`
  - Stripped census FAQ (11 sources / 0 human vs 8 / 4), inverted table (0/6 human), Total Sources 11/11, and consult-combination footer.
  - Dated 5-Amino-1MQ absence: street-name PubMed 0; chemical-name 3 hits, none a human obesity RCT; CT.gov 0 as of 2026-09-02.
  - Quoted DIO mouse paper as naming the compound with **no percent**. Did not invent a mouse or human RCT percent.
  - Quoted oral amycretin as TEAE-primary / exploratory day-85 weight with **no percent** in the abstract. Did not invent ~13/~25.
  - Quoted SC amycretin treatment-policy-adjacent estimated mean **−24.3% vs −1.1%** (60 mg, week 36; secondary; TEAE primary). Escaped P&lt;. Not labelled obesity Phase 3.
  - Named NCT06049329 as a completed Japanese oral Phase 1 with no published PMID and no invented percent.
  - openFDA: 5-amino NOT_FOUND; amycretin NOT_FOUND. No invented approval year.
  - Linked `/peptides/5-amino-1mq`, `/peptides/amycretin`, `/compare/amycretin-vs-semaglutide`, `/compare/5-amino-1mq-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **No ~$1,000/mo row** was present; none added. TICK6-PRICE not started.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (188 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: this filename not in the remaining 16 amycretin leftover mismatches (other `amycretin-vs-*` census stubs). Select-String battery: census FAQ strings, Consult, Who Might, 15–17%, ~13/~25, unescaped `P<`, trailing-slash hrefs — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch TICK46 `amycretin-vs-ct-388.mdx`, TICK45 `5-amino-1mq-vs-semaglutide.mdx`, TICK44 `amycretin-vs-aod-9604.mdx`, TICK43 `amycretin-vs-cagrisema.mdx`, TICK41 `amycretin-vs-cagrilintide.mdx`, TICK40 `amycretin-vs-vk2735.mdx`, TICK27/20 KEEP twins, or `src/content/peptides/**`.
- Did not restore oral ~13/~25, an amycretin obesity Phase 3, or a 5-Amino-1MQ RCT percent.
- Did not cite PMID 33645410 (title miss) or `"NNMTi"` class ids as 5-Amino-1MQ obesity RCTs.
- Did not invent a $1,000 row.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `5-amino-1mq-vs-amycretin.mdx` census FAQ (11/0 vs 8/4; table 0/6) and consult footer stripped.
2. 5-Amino-1MQ: no human obesity RCT this run; street-name PubMed 0; CT.gov 0 as of 2026-09-02; DIO mouse abstract names the compound and publishes **no** percent (PMID 35013352).
3. Oral amycretin: TEAE primary; day-85 weight exploratory; **no percent** in the abstract (PMID 40550229).
4. SC amycretin: 60 mg week 36 estimated mean **−24.3% vs −1.1%** (secondary; TEAE primary) (PMID 40550231). Not Phase 3.
5. openFDA: 5-amino NOT_FOUND; amycretin NOT_FOUND. NCT06049329 Japanese oral Phase 1 hasResults false; PubMed 0.
6. No $1,000 row present or added. Links without trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no $1,000 row on this page).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `amycretin-vs-*` (except TICK40/41/43/44/46 files and KEEP TICK20/27), other `5-amino-1mq-vs-*` (except TICK45 and this file), and `aod-9604-vs-*`. One file per tick.
