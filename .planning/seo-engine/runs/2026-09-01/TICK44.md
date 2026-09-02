# TICK44 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/amycretin-vs-aod-9604.mdx`. Generated census stub (8/Moderate vs 12/Low; inverted 4-vs-0 “more clinical evidence”; Total Sources 11/12 vs dossiers 12/12) plus consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK43.md (read after lock; fetch scripts already targeted CagriSema / REDEFINE) assigned `amycretin-vs-cagrisema.mdx`. Locked: TICK41 `amycretin-vs-cagrilintide`, TICK40 `amycretin-vs-vk2735`, TICK27 KEEP `amycretin-vs-semaglutide`, TICK20 KEEP `amycretin-vs-tirzepatide`, TICK42 `ozempic-vs-wegovy`. This file was the next unlocked amycretin leftover: generated stub (`lastUpdated` 2026-02-12), census FAQ, source-count tables, and consult footer. No invented ~ percents or $1,000 row were present to strip.

`src/content/peptides/**` not opened (path-checked only). TICK43 file not edited.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path .planning\seo-engine\runs\2026-09-01\TICK43.md
Test-Path src\content\peptides\amycretin.mdx
Test-Path src\content\peptides\aod-9604.mdx
Test-Path src\content\comparisons\amycretin-vs-aod-9604.mdx
Test-Path src\content\comparisons\amycretin-vs-semaglutide.mdx
node .planning\seo-engine\runs\2026-09-01\_tick44-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick44-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick44-fetch3.mjs
node .planning\seo-engine\runs\2026-09-01\_tick44-fetch4.mjs
node .planning\seo-engine\runs\2026-09-01\_tick44-fetch5.mjs
node scripts\qa-banned-content.js src\content\comparisons\amycretin-vs-aod-9604.mdx
node scripts\qa-medical-advice.mjs
node scripts\qa-comparison-counts.mjs
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200 (`"amycretin"` count 21; `"AOD-9604"` count 16; `"AOD9604"` count 22; `"AOD 9604"` count 16). Oral/SC uid esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200 (amycretin NCTs; AOD alias searches 0 studies). openFDA drugsfda STATUS 404 (amycretin) / 404 (aod-9604) / 404 (aod9604). First-pass openFDA timed out; retry in fetch2 STATUS 404. Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 NCT05369390 | Safety, tolerability, pharmacokinetics, and pharmacodynamics of the first-in-class GLP-1 and amylin receptor agonist, amycretin: a first-in-human, phase 1… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; enroll 144 actual; hasResults **false**. |
| PMID 40550231 NCT06064006 | Amycretin, a novel, unimolecular GLP-1 and amylin receptor agonist administered subcutaneously | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 **−24.3% vs −1.1%**; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. CT.gov COMPLETED Phase 2; enroll 125 actual; hasResults **false**. |
| PMID 15134286 | AOD-9604 Metabolic | 2004 profile. Metabolic developing AOD-9604 for potential obesity treatment. By February 2002, **phase IIa trials were underway**. Abstract publishes **no enrollment, no percent**. |
| PMID 11146367 | Metabolic studies of a synthetic lipolytic domain (AOD9604) of human growth hormone | Obese Zucker **rats**. 19-day oral treatment. Weight-gain 15.8 ± 0.6 vs 35.6 ± 0.8 g. Not a human RCT percent. Dose from the abstract not copied as a protocol. |
| PMID 11673763 | Increase of fat oxidation and weight loss in obese mice caused by chronic treatment with human growth hormone or a modified C-terminal fragment | Obese/lean **mice**, 14 days. Both hGH and AOD9604 reduced body-weight gain; increased fat oxidation. AOD9604 did not compete for the hGH receptor. Not a human RCT percent. |
| PMID 16625817 | Obesity drugs in clinical development | 2006 review. Lists AOD-9604 among then-in-development obesity drugs. Of **that set**, only rimonabant had completed phase III. Not an AOD-9604 Phase 3 result. |
| PMID 25208511 | Detection and in vitro metabolism of AOD9604 | Identity: C-terminal hGH 177-191 + N-terminal tyrosine. Doping-detection methods. No efficacy percent. |
| PMID 11713213 | …AOD9604… obese mice and beta(3)-AR knock-out mice | Fetched; title-matched preclinical. Not quoted (11673763 already covers the mouse weight-gain class). |
| PMID 24124033 / 41490200 / 41966639 / 42395176 / Gateways 15834452, 14685303, 14571286 | Title or list-name match | Fetched. No human obesity RCT percent. 41966639 / 42395176 carried incidental NCTs **not** AOD-9604 (see below). Not quoted as results. |
| NCT00267527 | A Study to Evaluate CJC 1295 in HIV Patients With Visceral Obesity | CT.gov STATUS 200. Intervention **CJC 1295**. Not AOD-9604. Not quoted. |
| NCT03150511 | Tesamorelin to Improve Functional Outcomes After Peripheral Nerve Injury | CT.gov STATUS 200. Intervention **tesamorelin**. Not AOD-9604. Not quoted. |
| CT.gov query.term | AOD-9604 / AOD9604 / AOD 9604 | All **0 studies** (2026-09-02). |
| openFDA drugsfda | generic_name amycretin / aod-9604 / aod9604 | All **NOT_FOUND**. |

Esearch `"amycretin"` count 21 — later T2D papers not dumped. AOD alias counts not dumped.

## File

- `src/content/comparisons/amycretin-vs-aod-9604.mdx`
  - Stripped census FAQ (8/12 sources; inverted 4-vs-0 human row), Evidence/Key Differences source-count tables (11/12), summary “8 total sources (4 human),” and consult footer.
  - Quoted oral first-in-human as TEAE-primary / day-85 exploratory with **no percent**.
  - Quoted SC estimated means as **secondary** (TEAE primary), including 60 mg week 36 **−24.3% vs −1.1%**. Escaped P&lt;. Did not write ~13/~25.
  - Quoted AOD-9604 2004 profile (phase IIa underway by February 2002; no percent). Dated CT.gov 0-study searches (2026-09-02). Did not invent a human RCT percent or an obesity Phase 3.
  - Quoted rodent weight-gain figures as rodent only. Did not copy the rat µg/kg line as a protocol.
  - Linked `/peptides/amycretin`, `/peptides/aod-9604`, `/compare/amycretin-vs-semaglutide` (no trailing slash). Did not edit those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (211 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs` site scan: PASS. `qa-comparison-counts.mjs`: this filename not in the remaining 20 amycretin-stub WARNs (plus `5-amino-1mq-vs-amycretin`). Select-String: census FAQ strings, Consult, Who Might, ~13/~25, trailing-slash hrefs, unescaped `P<` — all 0 on this file. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch TICK43 `amycretin-vs-cagrisema.mdx`, TICK41 `amycretin-vs-cagrilintide.mdx`, TICK40 `amycretin-vs-vk2735.mdx`, TICK27 `amycretin-vs-semaglutide.mdx`, TICK20 KEEP twin, TICK42 `ozempic-vs-wegovy.mdx`, other leftover `amycretin-vs-*` / `5-amino-1mq-vs-*` / `aod-9604-vs-*` census stubs, or `src/content/peptides/**`.
- Did not restore oral amycretin ~13/~25. Did not quote incidental CJC-1295 / tesamorelin NCTs as AOD-9604.
- Did not invent an AOD-9604 obesity Phase 3.
- W3-M1 OAuth.
- TICK6-PRICE.

## 8-line summary

1. Assigned compare cleaned; census FAQs (8/12 sources; 4-vs-0 human), source-count tables, consult footer stripped.
2. Oral first-in-human quoted as TEAE-primary; day-85 body weight exploratory; **no percent** in the abstract (PMID 40550229).
3. SC phase 1b/2a quoted as secondary estimated mean **−24.3% vs −1.1%** at 60 mg week 36 (PMID 40550231).
4. AOD-9604 2004 profile quoted as phase IIa underway by February 2002 with **no percent** (PMID 15134286).
5. Rodent papers quoted as rat/mouse weight-gain only (PMID 11146367, 11673763). CT.gov alias searches 0 studies on 2026-09-02. No invented human RCT percent or obesity Phase 3.
6. openFDA 404 for amycretin / aod-9604 / aod9604 as of 2026-09-02. Links without trailing slash. CRLF. P&lt; escaped. No $1,000 row added or stripped.
7. Implementer QA on this file passed; filename dropped off `qa:counts`; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Generated census stubs remain (other `amycretin-vs-*`, `5-amino-1mq-vs-*` including `5-amino-1mq-vs-amycretin`, `aod-9604-vs-*`). One file per tick.
