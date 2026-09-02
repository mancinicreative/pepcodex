# TICK40 — implementer note (not a KEEP)

Loop: L4 cited-only leftover census compare. One file: `src/content/comparisons/amycretin-vs-vk2735.mdx`. `qa:counts` leftover (Total Sources 11/5 vs dossiers 12/5) plus census FAQ (8/5 sources; inverted 1-vs-6 human row). Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK37 left `qa:counts` failing on amycretin census tables. TICK39.md (read after dispatch; was absent at start) took `ozempic-vs-mounjaro.mdx`. This file was unlocked, still `lastUpdated` 2026-02-12, and was a generated census stub: FAQ source counts, Human Studies / Total Sources tables, inverted “more clinical evidence” FAQ, and a consult footer. No invented 22.7 / 15.7 / 23–25.5 / oral ~13/~25 rows were present to strip.

Locked TICK38 `maritide-vs-semaglutide`, TICK39 `ozempic-vs-mounjaro`, TICK37 `cagrisema-vs-semaglutide`, TICK35–36/32–33/31/30/29/28/27 awaiting Judge, TICK26 KEEP `maritide-vs-tirzepatide`, KEEP TICK19/21/23–25 and TICK5–18/20/22, and `src/content/peptides/**` not opened.

## Fetched this increment (2026-09-02)

Commands actually run:

```
node scripts/qa-comparison-counts.mjs --strict
git branch --show-current
node .planning\seo-engine\runs\2026-09-01\_tick40-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick40-fetch2.mjs
node scripts\qa-banned-content.js src\content\comparisons\amycretin-vs-vk2735.mdx
node scripts\qa-comparison-counts.mjs --strict
node scripts\qa-medical-advice.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (amycretin) / 404 (vk2735). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"amycretin"` count 21 — not dumped into the page. Esearch `"VK2735"` count 1 (41508550). `"VK-2735"` / `"VANQUISH" VK2735` / `"VANQUISH-1"` / `"VANQUISH-2"` = **0**.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 NCT05369390 | Safety, tolerability, pharmacokinetics, and pharmacodynamics of the first-in-class GLP-1 and amylin receptor agonist, amycretin: a first-in-human… | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov COMPLETED Phase 1; enroll 144 actual; hasResults **false**. PubMed `NCT05369390` = 40550229 only. |
| PMID 40550231 NCT06064006 | Amycretin, a novel, unimolecular GLP-1 and amylin receptor agonist administered subcutaneously… | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 −24.3% vs −1.1%; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. Abstract does **not** name treatment-regimen. CT.gov COMPLETED Phase 2; enroll 125 actual; hasResults **false**. PubMed `NCT06064006` = 40550231 only. |
| PMID 41508550 NCT06068946 VENTURE | Weekly Subcutaneous VK2735, a GIP/GLP-1 Receptor Dual Agonist… 13-Week VENTURE Study | Phase 2. Primary = % weight at week 13. Mean reduction 9.2 kg (2.5 mg; 9.1%) to 14.6 kg (15 mg; **14.7%**); placebo 1.8 kg (**1.7%**). ≥5% 93% (130/140) vs 12% (4/34). GI common. Abstract does **not** name treatment-regimen vs efficacy. CT.gov COMPLETED; enroll 176 actual; hasResults **false**. PubMed `NCT06068946` = 41508550 only. |
| NCT05203237 Phase 1 | Phase 1 Study to Evaluate the Safety and Tolerability of VK2735 | COMPLETED. Enrollment 92 actual. hasResults **false**. PubMed `NCT05203237` = **0**. Design only. |
| NCT06828055 Phase 2 oral | VK2735 for Weight Management Phase 2 (Venture Oral Dosing) | COMPLETED. Enrollment 280 actual. Primary completion 2025-06-24 actual. hasResults **false**. PubMed `NCT06828055` = **0**. Design only. No oral percent. |
| NCT07104500 VANQUISH 1 | VK2735 for Weight Management Phase 3 | ACTIVE_NOT_RECRUITING. Enrollment 4500 estimated. Primary completion 2027-07-01 estimated. hasResults **false**. PubMed `NCT07104500` = **0**. |
| NCT07104383 VANQUISH 2 | VK2735 for Weight Management Type 2 Diabetes Phase 3 | ACTIVE_NOT_RECRUITING. Enrollment 1100 estimated. Same estimated completion. hasResults **false**. PubMed `NCT07104383` = **0**. |
| openFDA drugsfda | generic_name amycretin / vk2735 | Both **NOT_FOUND**. |

## File

- `src/content/comparisons/amycretin-vs-vk2735.mdx`
  - Stripped census FAQ (8/5 sources; inverted 1-vs-6 human row), Evidence/Key Differences source-count tables (11/5), consult footer.
  - Quoted oral first-in-human as TEAE-primary with **no** abstract weight percent. Did not restore oral ~13/~25.
  - Quoted subcutaneous phase 1b/2a secondary estimated means with placebo. Escaped P&lt;. Did not invent an estimand label.
  - Quoted VENTURE 2.5 mg / 15 mg vs placebo and pooled ≥5%. Did not invent an estimand label.
  - Dated NCT05203237 / NCT06828055 / VANQUISH 1/2 absences (hasResults false; PubMed 0 as of 2026-09-02). No unpublished oral percent.
  - Linked `/peptides/amycretin`, `/peptides/vk2735`, `/compare/amycretin-vs-semaglutide`, `/compare/vk2735-vs-semaglutide` (no trailing slash). Did not edit those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (186 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: this filename gone (26 remaining mismatches are other amycretin census tables). Select-String: census FAQ strings, Consult, Who Might, banned leftover percents, trailing-slash hrefs — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `ozempic-vs-mounjaro.mdx`, `maritide-vs-semaglutide.mdx`, `cagrisema-vs-semaglutide.mdx`, TICK19–38 KEEP/awaiting-Judge files, or `src/content/peptides/**`.
- Did not restore OSA 63%/6%, TRIUMPH 28.7%, REDEFINE 22.7/15.7/23–25.5, SYNCHRONY, MOMENTUM unpublished obesity, amycretin oral ~13/~25, or SURMOUNT-1 over 60%.
- Did not dump the 21-hit amycretin esearch into the page.
- Did not quote a Phase 1, oral Phase 2, or VANQUISH percent.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `amycretin-vs-vk2735.mdx` census FAQ (8/5 vs inverted 1/6) and source-count tables (11/5) stripped.
2. Oral first-in-human quoted as TEAE-primary; day-85 weight exploratory; abstract publishes **no** percent (PMID 40550229).
3. Subcutaneous phase 1b/2a quoted as secondary estimated mean 60 mg week 36 **−24.3% vs −1.1%** (PMID 40550231). Estimand not named.
4. VENTURE quoted as 15 mg **14.7%** vs placebo **1.7%** at 13 weeks; ≥5% 93% (130/140) vs 12% (4/34) (PMID 41508550). Estimand not named.
5. Oral VK2735 (NCT06828055) and VANQUISH 1/2: hasResults false and PubMed 0 as of 2026-09-02; design only.
6. openFDA 404 for both names. Links without trailing slash. P&lt; escaped. CRLF. No $1,000 row added or stripped.
7. This file dropped off `qa:counts`; 26 mismatches remain on other amycretin census tables.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers include other `amycretin-vs-*.mdx` Total Sources 11-vs-12 rows (TICK39 named `ozempic-vs-wegovy.mdx` separately).
