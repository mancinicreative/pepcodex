# TICK41 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/amycretin-vs-cagrilintide.mdx`. Census FAQ (8/Moderate vs 34/High; 6 vs 27 human) plus mismatched Total Sources tables (11/34 vs dossier 12/34) and a combination/consult stub. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK39.md assigned `ozempic-vs-mounjaro.mdx`. TICK40.md assigned `amycretin-vs-vk2735.mdx`. Those files were not opened. Remaining unlocked census leftover after those locks + TICK26–38 / KEEP TICK5–25: this generated stub (`lastUpdated` 2026-02-12). Locked TICK27 `amycretin-vs-semaglutide`, TICK20 KEEP `amycretin-vs-tirzepatide`, TICK22 KEEP `cagrilintide-vs-tirzepatide`, TICK30 `cagrilintide-vs-semaglutide`, TICK37 `cagrisema-vs-semaglutide`, and `src/content/peptides/**` not reopened.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\peptides\amycretin.mdx
Test-Path src\content\peptides\cagrilintide.mdx
Test-Path src\content\comparisons\amycretin-vs-cagrilintide.mdx
node .planning\seo-engine\runs\2026-09-01\_tick41-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick41-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick41-fetch3.mjs
node scripts\qa-banned-content.js src\content\comparisons\amycretin-vs-cagrilintide.mdx
node scripts\qa-medical-advice.mjs
node scripts\qa-comparison-counts.mjs
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200 (`"amycretin"` count 21; `"cagrilintide"` count 97). First-pass oral uid esearch 429 / batch efetch 502; retry in fetch2/fetch3 STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (amycretin) / 404 (cagrilintide). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 NCT05369390 | Safety, tolerability, pharmacokinetics, and pharmacodynamics of the first-in-class GLP-1 and amylin receptor agonist, amycretin: a first-in-human, phase 1… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; enroll 144 actual; hasResults **false**. |
| PMID 40550231 NCT06064006 | Amycretin, a novel, unimolecular GLP-1 and amylin receptor agonist administered subcutaneously | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 **−24.3% vs −1.1%**; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. CT.gov COMPLETED Phase 2; enroll 125 actual; hasResults **false**. |
| PMID 34798060 NCT03856047 | Once-weekly cagrilintide for weight management… dose-finding phase 2 trial | n=706 (100–102 per cagrilintide arm; 99 liraglutide 3.0 mg; 101 placebo); 26 wk. **Trial-product** 0.3–4.5 mg **6.0%–10.8% vs 3.0%** (ETD 3.0–7.8; P&lt;0.001). 4.5 mg **10.8% vs liraglutide 3.0 mg 9.0%** (ETD 1.8; P=0.03). Treatment-policy “similar”; **no separate treatment-policy percent table**. GI 41%–63% vs 32%; nausea 20%–47% vs 18%. No 2.4 mg row invented. CT.gov COMPLETED Phase 2; enroll 706 actual; hasResults true (results module not quoted). |
| PMID 40544433 NCT05567796 REDEFINE 1 | Coadministered Cagrilintide and Semaglutide in Adults with Overweight or Obesity | n=3417; 68 wk; 21:3:3:7 (2108 / 302 / 302 / 705). **Treatment-policy.** CagriSema **−20.4% vs −3.0%** (ETD −17.3; CI −18.1 to −16.6; P&lt;0.001). Cagrilintide-alone arm named (n=302); **abstract does not publish that arm’s percent**. GI 79.6% vs 39.9%. No 22.7. CT.gov ACTIVE_NOT_RECRUITING; enroll 3400 estimated; hasResults **false**. |
| openFDA drugsfda | generic_name amycretin / cagrilintide | Both **NOT_FOUND**. |

Esearch `"amycretin"` count 21 — later T2D papers not dumped. Esearch `"cagrilintide"` count 97 — not dumped.

## File

- `src/content/comparisons/amycretin-vs-cagrilintide.mdx`
  - Stripped census FAQ (8/Moderate vs 34/High; 6 vs 27 human), Evidence/Key Differences source-count tables (11/34), summary “8 total sources (4 human),” combination “not recommended” advice, and consult footer.
  - Quoted oral first-in-human as TEAE-primary / day-85 exploratory with **no percent**.
  - Quoted SC estimated means as **secondary** (TEAE primary), including 60 mg week 36 **−24.3% vs −1.1%**. Escaped P&lt;.
  - Quoted Phase 2 trial-product range **6.0%–10.8% vs 3.0%**; 4.5 mg vs liraglutide 9.0%. Did not invent a 2.4 mg monotherapy row.
  - Quoted REDEFINE 1 treatment-policy **−20.4% vs −3.0%** as CagriSema, not cagrilintide-alone.
  - Linked `/peptides/amycretin`, `/peptides/cagrilintide`, `/compare/amycretin-vs-semaglutide`, `/compare/cagrilintide-vs-tirzepatide` (no trailing slash). Did not edit those locked/KEEP twins.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (189 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs` site scan: PASS. `qa-comparison-counts.mjs`: this filename not in the remaining 24 amycretin-stub WARNs. Select-String battery (positive control 61): leftover census FAQ strings, Consult, Who Might, banned leftover percents, unescaped `\<\d`, trailing-slash hrefs — all 0 except the disavowal “does not quote a live source census.” Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch TICK39 `ozempic-vs-mounjaro.mdx`, TICK40 `amycretin-vs-vk2735.mdx`, TICK27 `amycretin-vs-semaglutide.mdx`, TICK20/22 KEEP twins, TICK30/37 cagrilintide/CagriSema-vs-semaglutide, TICK26–38 awaiting-Judge files, or `src/content/peptides/**`.
- Did not restore TRIUMPH, OSA 63%, REDEFINE 22.7/15.7, or oral amycretin ~13/~25. Did not repeat those percents in disavowal sentences.
- Did not quote a cagrilintide-alone percent from REDEFINE 1.
- Did not fetch later amycretin T2D papers from the 21-hit esearch.
- W3-M1 OAuth.
- TICK6-PRICE.

## 8-line summary

1. Assigned compare cleaned; census FAQs (8/34 sources; 6/27 human), source-count tables, consult, and “not recommended” combination FAQ stripped.
2. Oral first-in-human quoted as TEAE-primary; day-85 body weight exploratory; **no percent** in the abstract (PMID 40550229).
3. SC phase 1b/2a quoted as secondary estimated mean **−24.3% vs −1.1%** at 60 mg week 36 (PMID 40550231).
4. Cagrilintide Phase 2 quoted as trial-product **6.0%–10.8% vs 3.0%** at 26 weeks; 4.5 mg 10.8% vs liraglutide 9.0% (PMID 34798060).
5. REDEFINE 1 quoted as CagriSema treatment-policy **−20.4% vs −3.0%**; cagrilintide-alone arm named without a percent (PMID 40544433).
6. openFDA 404 for both compounds as of 2026-09-02. Links without trailing slash. CRLF. P&lt; escaped. No $1,000 row added or stripped.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Many generated census stubs remain (other `amycretin-vs-*`, `5-amino-1mq-vs-*`, `aod-9604-vs-*`). One file per tick.
