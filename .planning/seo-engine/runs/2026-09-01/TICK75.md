Assigned file: `src/content/comparisons/5-amino-1mq-vs-retatrutide.mdx`

# TICK75 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/5-amino-1mq-vs-retatrutide.mdx`. Generated census stub (11/Low vs 43/High; 0 vs 40 human; Total Sources 11/43) plus combination FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned `5-amino-1mq-vs-retatrutide.mdx` present (`lastUpdated` 2026-02-12, census FAQ 11/43 sources and 0/40 human, source-count tables, combination FAQ, consult footer). Hard-locked: TICK69 `aod-9604-vs-ct-388`, TICK72 `5-amino-1mq-vs-orforglipron`, TICK73 `5-amino-1mq-vs-pemvidutide`, TICK74 `5-amino-1mq-vs-vk2735`, TICK76 `5-amino-1mq-vs-survodutide`, TICK60–TICK71 claimed files, `5-amino-1mq-vs-cagrisema` / `cagrilintide` / `semaglutide` / `amycretin`, and `src/content/peptides/**`. This tick took the assigned leftover. Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\5-amino-1mq-vs-retatrutide.mdx
Test-Path src\content\peptides\5-amino-1mq.mdx
Test-Path src\content\peptides\retatrutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-semaglutide.mdx
Test-Path src\content\comparisons\retatrutide-vs-semaglutide.mdx
Test-Path src\content\comparisons\tirzepatide-vs-retatrutide.mdx
Test-Path (locked compares + TICK69/72/73/74/76 artifacts)
node .planning\seo-engine\runs\2026-09-01\_tick75-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick75-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick75-fetch3.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-retatrutide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200 (42608321 and 38858523 retried after 429). CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (5-amino-1mq / 5-amino-1-methylquinolinium / retatrutide). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"5-Amino-1MQ"` count 0. `"5-amino-1-MQ"` count 0. `"5-Amino-1-methylquinolinium"` count 3 (39067875, 35013352, 33645410). `"retatrutide"` count 176 — not dumped. `"5-Amino-1MQ" AND "retatrutide"` count 0. `"5-amino-1-methylquinolinium" AND "retatrutide"` count 0. `"TRIUMPH-1"[Title]` count 1 (22759797, treprostinil PAH; TITLE_MATCH false). `"TRIUMPH-1" retatrutide weight` count 1 (41090431). `retatrutide[Title] AND 28.7` count **0**. `retatrutide[Title] AND 28.3` count **0**.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice | DIO mice. Abstract names **5-amino-1-methylquinolinium** as the NNMTi used with a low-fat diet. Describes adiposity/weight change vs diet switch alone. **No body-weight percent.** Not a human RCT. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT in cancer-associated fibroblasts… urothelial bladder cancer | Title-matched NNMT. Used 5-Amino-1-methylquinolinium iodide in UBC mouse models. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase shows anti-proliferative activity in HeLa cells | **TITLE_MATCH false** (title does not name 5-amino). HeLa cells. Not quoted. |
| PMID 37366315 NCT04881760 | Triple-Hormone-Receptor Agonist Retatrutide for Obesity - A Phase 2 Trial | n=338; 48 wk. **Primary = 24 wk.** LS mean 24 wk: −7.2/−12.9/−17.3/**−17.5** vs −1.6% (1 / combined 4 / combined 8 / **12 mg**). **48 wk secondary:** −8.7/−17.1/−22.8/**−24.2** vs **−2.1%**. 12 mg ≥5/10/15%: 100/93/83 vs 27/9/2. GI related to assigned amount, mostly mild–moderate. HR increase peaked wk 24 then declined. Abstract does **not** name treatment-regimen. **−17.5% is 12 mg at 24 wk, not 4 mg at 48 wk** (combined 4 mg at 48 wk is −17.1%). CT.gov COMPLETED Phase 2; enroll 338 actual; hasResults **true** (quoted abstract, not results module). PubMed `NCT04881760` = 6 ids. |
| PMID 41090431 TRIUMPH design | Retatrutide for the treatment of obesity, obstructive sleep apnea and knee osteoarthritis: Rationale and design of the TRIUMPH registrational clinical trials | Four Phase 3 studies; **over 5,800**. Primary weight end point = % body-weight change. **No efficacy percent.** PubMed `"TRIUMPH-1" retatrutide weight` = **1** (this paper). `retatrutide[Title] AND 28.7` = **0**. `retatrutide[Title] AND 28.3` = **0**. |
| PMID 42250575 NCT06354660 TRANSCEND-T2D-1 | Efficacy and safety of retatrutide … TRANSCEND-T2D-1 | n=537; 40 wk. **Treatment-regimen.** HbA1c −1.69/−1.86/−1.94 vs −0.81% (P&lt;0.0001). Weight −11.5/−13.9/−15.3 vs −2.6%. AE d/c 2–5% vs 0%. **T2D, not TRIUMPH obesity.** CT.gov COMPLETED Phase 3; enroll 537 actual; hasResults **false**. PubMed `NCT06354660` = 42250575 only. |
| PMID 42608321 | Retatrutide-Associated Improvements in Cardiovascular Risk Biomarkers… | NCT04881760 + NCT04867785. Lipoprotein / CRP analysis. apoB up to **−24.2% is not body weight**. **Not TRIUMPH.** |
| PMID 38858523 | Triple hormone receptor agonist retatrutide for metabolic dysfunction-associated steatotic liver disease… | TITLE_MATCH true. MASLD substudy of NCT04881760. Quotes parent-trial 22.8%/24.2% and liver-fat percents. **Not TRIUMPH.** Liver-fat percents **not quoted** as body weight. |
| PMID 22759797 | Baseline NT-proBNP … TRIUMPH-1 (inhaled treprostinil, PAH) | TITLE_MATCH **false** for retatrutide. Wrong-drug `"TRIUMPH-1"[Title]` hit. Not quoted. |
| NCT04881760 extras 41589220 / 41216380 / 41201783 | WES scale; exit-interview qualitative; EBAQ scale | Phase 2 exit/PRO papers. Not used as obesity percents. |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium / retatrutide | All **NOT_FOUND**. |

## File

- `src/content/comparisons/5-amino-1mq-vs-retatrutide.mdx`
  - Stripped census FAQ (11/Low vs 43/High; 0 vs 40 human), Evidence/Key Differences source-count tables (11/43), summary “11 total sources (0 human)” / “43 total sources (40 human),” combination-as-unknown FAQ voice, and consult footer.
  - Dated 5-Amino-1MQ absence: street-name PubMed 0; chemical-name 3 hits, none a human obesity RCT; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3 or a percent.
  - Quoted DIO mouse paper as naming the compound with **no percent**. Did not invent a mouse or human RCT percent.
  - Quoted retatrutide phase 2 **week-24 primary** vs **week-48 secondary** with placebo. −24.2% vs −2.1% labelled secondary. −17.5% labelled 12 mg at 24 weeks, not 4 mg at 48. Combined 4 mg at 48 weeks is −17.1%.
  - Quoted TRANSCEND-T2D-1 as **T2D treatment-regimen**, not obesity Phase 3. Escaped P&lt;.
  - Dated TRIUMPH absence without a percent. Did not write 28.7% or 28.3% as a result. Logged both title searches = 0.
  - Labelled 42608321 apoB −24.2% as not body weight. Labelled 38858523 as MASLD substudy of the same phase 2; liver-fat percents not quoted.
  - Dated the H2H absence: PubMed `"5-Amino-1MQ" AND "retatrutide"` and `"5-amino-1-methylquinolinium" AND "retatrutide"` on 2026-09-02 returned 0.
  - openFDA: 5-amino NOT_FOUND; retatrutide NOT_FOUND.
  - Linked `/peptides/5-amino-1mq`, `/peptides/retatrutide`, `/compare/5-amino-1mq-vs-semaglutide`, `/compare/retatrutide-vs-semaglutide`, `/compare/tirzepatide-vs-retatrutide` (no trailing slash). Did not edit those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (200 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (this filename gone from census mismatches). Select-String: leftover census FAQ strings, Consult, Who Might, `dose`/`dosing`/`inject`/`protocol`, unescaped `P<`, `$1,000`, trailing-slash hrefs — all 0. 28.3/28.7 appear only as dated zero-hit searches. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `aod-9604-vs-ct-388.mdx`, `5-amino-1mq-vs-orforglipron.mdx`, `5-amino-1mq-vs-pemvidutide.mdx`, `5-amino-1mq-vs-vk2735.mdx`, `5-amino-1mq-vs-survodutide.mdx`, TICK60–TICK71 claimed files, `5-amino-1mq-vs-cagrisema.mdx` / `cagrilintide` / `semaglutide` / `amycretin`, or `src/content/peptides/**`.
- Did not restore TRIUMPH 28.7%/28.3%, OSA 63%/6%, a 4 mg 48-week −17.5% row, or a 5-Amino-1MQ RCT percent.
- Did not dump the 176-hit retatrutide esearch into the page.
- Did not quote 38858523 liver-fat percents as body weight.
- Did not cite PMID 22759797 (wrong-drug TRIUMPH-1).
- Did not quote NCT04881760 results-module percents (hasResults true; journal abstract used).
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Assigned leftover cleaned: `5-amino-1mq-vs-retatrutide.mdx` census FAQ (11/0 vs 43/40) and source-count tables stripped.
2. 5-Amino-1MQ: no human obesity RCT this run; street-name PubMed 0; CT.gov 0 as of 2026-09-02; DIO mouse abstract names the compound and publishes **no** percent (PMID 35013352).
3. Retatrutide phase 2: week-24 primary 12 mg **−17.5% vs −1.6%**; week-48 secondary 12 mg **−24.2% vs −2.1%** (PMID 37366315). −17.5% is not 4 mg at 48 weeks.
4. TRANSCEND-T2D-1 labelled **treatment-regimen** in type 2 diabetes, not TRIUMPH obesity (PMID 42250575). TRIUMPH design-only (PMID 41090431). `retatrutide[Title] AND 28.7` = 0; `AND 28.3` = 0.
5. PubMed H2H queries on 2026-09-02 returned 0. openFDA: both 404. Links without trailing slash. P&lt; escaped. CRLF. No $1,000 row added or stripped.
6. This file dropped off `qa:counts`; sitewide `--strict` PASS. Implementer QA on this file passed; not a KEEP.
7. Locked TICK69/72/73/74/76 files and peptide dossiers were path-checked only.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `5-amino-1mq-vs-*` / `aod-9604-vs-*` not on the hard-lock list. One file per tick.
