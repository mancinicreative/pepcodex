# TICK27 — implementer note (not a KEEP)

Loop: L4 cited-only on `amycretin-vs-semaglutide.mdx`. Worst remaining leftover after TICK24: FAQ census (8/4 vs 67/52). Also strip invented percents / ~ hedges / unpublished results if present. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK24 leftovers named this file's FAQ census as the remaining unlocked defect. Live defects before this increment: census FAQ (8 sources / 4 human vs 67 / 52; Moderate vs High evidence grades); consult-a-provider; hedged `~7%` discontinuation; invented 2027+ / CagriSema 2025–2026 timelines; uncited “proven CV benefit”; invented GI Common/Common table. Oral ~13%/~25% were already absent and were not restored.

Locked TICK19/21/23/24/25/26 files and KEEP compares not reopened. Peptide dossiers not opened.

## Fetched this increment (2026-09-02)

Command: `node .planning\seo-engine\runs\2026-09-01\_tick27-fetch.mjs`

Per-alias esearch (not OR-joined). NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (amycretin) / 200 (semaglutide generic + Ozempic/Wegovy brand). Title-matched before quoting.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 oral FIH NCT05369390 | Amycretin first-in-human phase 1 | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. 364 TEAEs in 89 (62%) of 144; GI 180/364 (49%). CT.gov Phase 1, hasResults false. |
| PMID 40550231 SC phase 1b/2a NCT06064006 | Amycretin unimolecular GLP-1/amylin subcutaneous | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 −24.3% vs −1.1%; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. CT.gov Phase 2, hasResults false. |
| PMID 33567185 STEP 1 NCT03548935 | Once-weekly semaglutide in overweight or obesity | n=1961; 68 wk; no T2D. **Treatment-regimen.** −14.9% vs −2.4% (ETD −12.4; CI −13.4 to −11.5; P&lt;0.001). ≥5/10/15%: 86.4/69.1/50.5 vs 31.5/12.0/4.9. GI d/c 4.5% vs 0.8%. |
| PMID 37952131 SELECT NCT03574597 | Semaglutide CV outcomes in obesity without diabetes | n=17604. 569/8803 (6.5%) vs 701/8801 (8.0%). **HR 0.80** (CI 0.72–0.90; P&lt;0.001). AE d/c 16.6% vs 8.2%. Mean follow-up 39.8 mo. |
| openFDA drugsfda | generic_name / products.brand_name | Amycretin: NOT_FOUND. Semaglutide: NDA 209637 (Ozempic); NDA 213051 (Ozempic/Rybelsus listing); NDA 215256 and NDA 218316 (Wegovy). |

Esearch `amycretin` count 21 (2026-09-02). Mora 2026 T2D PMIDs 42532080 / 42532079 appeared in that list and were **not** fetched or cited.

## File

- `src/content/comparisons/amycretin-vs-semaglutide.mdx`
  - Stripped census FAQ (8/4 vs 67/52; Moderate/High evidence), consult, `~7%` d/c, invented 2027+ / CagriSema 2025–2026 timelines, uncited CV claim, invented GI table, speculative dosing/manufacturing advantages.
  - Quoted oral exploratory (no percent in abstract). Did not write ~13%/~25% even as a disavowal.
  - Quoted SC estimated means as secondary, not Phase 3 treatment-regimen. Escaped P&lt;.
  - Quoted STEP 1 treatment-regimen with placebo and responder cuts. Quoted SELECT HR 0.80 with event counts; did not headline 20%.
  - Linked `/peptides/amycretin`, `/peptides/semaglutide`, `/compare/amycretin-vs-tirzepatide` (no trailing slash).
  - lastUpdated 2026-09-02. YAML sources[] pmid + verifiedAt 2026-09-02. CRLF.

Select-String battery (positive control `amycretin|STEP 1|SELECT|−24.3|−14.9` = 57 lines): census FAQ strings, Consult, `~7%`, `~13`, `~25`, `2027`, TRIUMPH/REDEFINE/OSA/LEADER/SCALE/MOMENTUM/SYNCHRONY, unescaped `<\d`, trailing-slash hrefs — all 0. CRLF_LINES=190 LF_ONLY=0.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `orforglipron-vs-tirzepatide.mdx`, `pemvidutide-vs-tirzepatide.mdx`, `tirzepatide-vs-retatrutide.mdx`, `pemvidutide-vs-semaglutide.mdx`, `retatrutide-vs-survodutide.mdx`, `maritide-vs-tirzepatide.mdx`, or `src/content/peptides/**`.
- Did not fetch Mora 2026 T2D PMIDs 42532080 / 42532079.
- No $1,000 row on this page (TICK6-PRICE still waiting; nothing to strip).
- W3-M1 OAuth.
- Remaining leftovers sit on locked/Judge-pending compares, not this file.
