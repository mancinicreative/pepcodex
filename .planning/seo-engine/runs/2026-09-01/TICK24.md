# TICK24 — implementer note (not a KEEP)

Loop: L4 cited-only on `pemvidutide-vs-semaglutide.mdx`. Worst remaining leftover after TICK23: census FAQ (10/3 vs 67/52) plus unpublished MOMENTUM ~10.7%/∼15.6%, collapsed ~70%/~50% liver fat, consult, invented GI table. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK23 leftovers were `pemvidutide-vs-semaglutide` census and `amycretin-vs-semaglutide` FAQ census. This file had more defect classes (census FAQ, unpublished MOMENTUM percents, invented liver-fat collapse, consult, lastUpdated 2026-02-01). `amycretin-vs-semaglutide.mdx` already had a STEP-1 pass. Locked TICK19–23 files and KEEP compares not reopened.

## Fetched this increment (2026-09-02)

Commands: `node .planning\seo-engine\runs\2026-09-01\_tick24-fetch.mjs` then `_tick24-fetch2.mjs` then `_tick24-fetch3.mjs` then `_tick24-fetch4.mjs`. Per-alias esearch (not OR-joined). NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (pemvidutide) / 200 (semaglutide brand queries). Title-matched.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 41237796 IMPACT NCT05989711 | Weekly pemvidutide vs placebo for MASH (IMPACT) 24-week phase 2b | n=212 (1,557 screened). ITT dual primary. MASH resolution w/o fibrosis worsening: 20% / 58% / 52% (PBO / 1.2 / 1.8 mg). Fibrosis improvement w/o MASH worsening: 28% / 33% / 36% (P=0.59 / 0.27). AE 78/81/67. AE d/c 0/1/2. Fibrosis co-primary **not met**. |
| PMID 39002641 NCT05006885 | Pemvidutide in MASLD 12-week RCT | n=94. Paper primary = LFC. −46.6/−68.5/−57.1% vs −4.4% (P&lt;0.001). Maximal weight −4.3% at 1.8 mg. CT.gov Phase 1, TEAE primary, hasResults false. |
| PMID 41113119 NCT05292911 | Pemvidutide MASLD 24-week extension | n=64. Paper primary = LFC. −56.3/−75.2/−76.4% vs −14.0%. 1.8 mg: 84.6% hit 50% LFC cut; 53.8% ≤5%. Weight also −6.2%. CT.gov Phase 1, TEAE primary. |
| PMID 33567185 STEP 1 NCT03548935 | Once-weekly semaglutide in overweight or obesity | n=1961; 68 wk; no T2D. **Treatment-regimen.** −14.9% vs −2.4% (ETD −12.4; CI −13.4 to −11.5; P&lt;0.001). ≥5/10/15%: 86.4/69.1/50.5 vs 31.5/12.0/4.9. GI d/c 4.5% vs 0.8%. |
| PMID 37952131 SELECT NCT03574597 | Semaglutide CV outcomes in obesity without diabetes | n=17604. 569/8803 (6.5%) vs 701/8801 (8.0%). **HR 0.80** (CI 0.72–0.90; P&lt;0.001). AE d/c 16.6% vs 8.2%. Mean follow-up 39.8 mo. |
| NCT05295875 MOMENTUM | ALT-801 Phase 2 obesity, 48 weeks | COMPLETED. Enrollment 391 actual. hasResults **false**. PubMed `pemvidutide AND MOMENTUM` = **0**. |
| openFDA drugsfda | generic_name / brand_name / products.brand_name | Pemvidutide: NOT_FOUND. Semaglutide: NDA 209637 (Ozempic); NDA 213051 (Ozempic/Rybelsus listing); NDA 215256 and NDA 218316 (Wegovy). `openfda.brand_name:wegovy` was 404; `products.brand_name:"WEGOVY"` was 200. |

Esearch `pemvidutide` count 13. `ALT-801` count 5 (includes mouse 35461369; not used as efficacy). Reviews not used as efficacy sources. NCT01774344 appeared only as a script typo (RESORCE / regorafenib) and was **not** cited.

## File

- `src/content/comparisons/pemvidutide-vs-semaglutide.mdx`
  - Stripped census FAQ (10/3 vs 67/52), consult, MOMENTUM ~10.7% / ~15.6%, collapsed ~70% / ~50% liver fat, invented nausea table, ~16% summary, survodutide/mazdutide Phase-3 landscape, developer “shortages / partnership” table.
  - Quoted IMPACT ITT dual primary with placebo and the unmet fibrosis co-primary. Escaped P&lt;.
  - Quoted MASLD LFC as liver-fat endpoints, not obesity Phase 3. Dated MOMENTUM absence without repeating an unpublished percent.
  - Quoted STEP 1 treatment-regimen with placebo and responder cuts. Quoted SELECT HR 0.80 with event counts; did not headline 20%.
  - Linked `/peptides/pemvidutide`, `/peptides/semaglutide`, `/compare/pemvidutide-vs-tirzepatide` (no trailing slash).
  - lastUpdated 2026-09-02. YAML sources[] pmid + verifiedAt 2026-09-02. CRLF.

## Not done

- Did not mark KEEP.
- Did not touch locked `tirzepatide-vs-retatrutide.mdx`, `cagrilintide-vs-tirzepatide.mdx`, `pemvidutide-vs-tirzepatide.mdx`, `amycretin-vs-tirzepatide.mdx`, `orforglipron-vs-tirzepatide.mdx`, or `judge/`.
- Did not stamp TICK19/21 KEEP.
- Did not redo KEEP compare bodies.
- Did not restore TRIUMPH 28.7%, OSA 63%, REDEFINE 22.7%, amycretin ~25%, orforglipron 36 mg −9.4%.
- No $1,000 row on this page (TICK6-PRICE still waiting; nothing to strip).
- Semaglutide MASH / liver-fat paper not fetched; the unsourced ~50% row was stripped rather than guessed.
- Drugs@FDA HTML overview pages not fetched (openFDA API used).
- W3-M1 OAuth.
- Remaining leftover: `amycretin-vs-semaglutide` FAQ census.
