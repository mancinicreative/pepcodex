# TICK22 — implementer note (not a KEEP)

Loop: L4 cited-only on `cagrilintide-vs-tirzepatide.mdx`. Worst remaining leftover after TICK21: census FAQ + consult + invented ~9%/~11%/~15–22%/~22%/~20%+ tables. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK21 leftovers were `tirzepatide-vs-retatrutide` hedges, `pemvidutide-vs-semaglutide` census, `cagrilintide-vs-tirzepatide` census/~ranges, `amycretin-vs-semaglutide` FAQ census. This file had the most defect classes (census FAQ, consult, invented monotherapy and CagriSema ~ranges, invented GI table, invented 2025–2026 timeline). Locked TICK19/20/21 files and KEEP compares not reopened.

## Fetched this increment (2026-09-02)

Commands: `node .planning\seo-engine\runs\2026-09-01\_tick22-fetch.mjs` then `_tick22-fetch2.mjs` then `_tick22-fetch3.mjs`. Per-alias esearch (not OR-joined). NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (cagrilintide) / 200 (tirzepatide). Title-matched.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 34798060 NCT03856047 | Once-weekly cagrilintide Phase 2 dose-finding | n=706; 26 wk. **Trial-product** 0.3–4.5 mg 6.0%–10.8% vs placebo 3.0% (ETD 3.0–7.8; P&lt;0.001). 4.5 mg 10.8% vs liraglutide 3.0 mg 9.0% (ETD 1.8; P=0.03). Treatment-policy: “similar”; **no separate percent table**. GI 41%–63% vs 32%; nausea 20%–47% vs 18%. Abstract does **not** publish a 2.4 mg row. |
| PMID 40544433 REDEFINE 1 NCT05567796 | Coadministered cagrilintide and semaglutide | n=3417; 68 wk. **Treatment-policy.** CagriSema −20.4% vs −3.0% (ETD −17.3; CI −18.1 to −16.6; P&lt;0.001). Arms include cagrilintide 2.4 mg (n=302); **abstract does not publish that arm’s percent**. GI 79.6% vs 39.9%. No 22.7%. |
| PMID 35658024 SURMOUNT-1 NCT04184622 | Tirzepatide once weekly for obesity | n=2539; 72 wk. **Treatment-regimen.** 5/10/15 mg −15.0/−19.5/−20.9% vs −3.1%. ≥20% at 15 mg **57%** (CI 53–61). AE d/c 4.3/7.1/6.2 vs 2.6. |
| NCT06131437 | CagriSema 2.4/2.4 vs tirzepatide 15 mg | COMPLETED. Enrollment 809 actual. hasResults **false**. PubMed `NCT06131437` / `"REDEFINE 4" cagrilintide tirzepatide` / `"REDEFINE-4" cagrilintide` = **0**. |
| openFDA drugsfda | generic_name cagrilintide / tirzepatide | Cagrilintide: NOT_FOUND. Tirzepatide: NDA 215866 Mounjaro; NDA 217806 Zepbound. |

Not used as efficacy sources: PMID 34739660 (pyridoxine mice; wrong id), 37506727 (malaria vaccines), 37364590 (Phase 2 T2D CagriSema; HbA1c primary; not the invented ~15–22% table), 36883831 (review), 34288673 (chemistry), 33894838 (Phase 1b TEAEs). AM833 esearch hits were unrelated old PMIDs. NN9838 count 0.

## File

- `src/content/comparisons/cagrilintide-vs-tirzepatide.mdx`
  - Stripped census FAQ (34/27 vs 76/68), consult, ~9% / ~11% / CagriSema ~15–22% / semaglutide ~15% / 10 mg ~19.5% / 15 mg ~20.9% hedges, ~22% / ~20%+ strategy list, invented nausea/constipation table, CagriSema 2025–2026 timeline, “record / class-leading / aims to match.”
  - Quoted Phase 2 trial-product range with placebo and the labelled treatment-policy gap. Escaped P&lt;.
  - Quoted REDEFINE 1 as **combo**, not monotherapy. Dated NCT06131437 absence without a percent.
  - Quoted SURMOUNT-1 treatment-regimen with placebo and 57% ≥20% at 15 mg.
  - Linked `/peptides/cagrilintide`, `/peptides/tirzepatide`, `/compare/cagrisema-vs-tirzepatide` (no trailing slash).
  - **Did not** strip ~$1,000+/month (TICK6-PRICE still waiting).
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF.

## Not done

- Did not mark KEEP.
- Did not touch locked `pemvidutide-vs-tirzepatide.mdx`, `amycretin-vs-tirzepatide.mdx`, `orforglipron-vs-tirzepatide.mdx`, or `judge/`.
- Did not redo KEEP compare bodies.
- Did not restore TRIUMPH 28.7%, OSA 63%, REDEFINE 22.7%, amycretin ~25%, orforglipron 36 mg −9.4%.
- Did not quote REDEFINE-2 PMID 40544432 (not fetched this increment).
- Did not quote a cagrilintide-alone percent from REDEFINE 1 (not in the abstract).
- W3-M1 OAuth.
- Remaining leftovers: `tirzepatide-vs-retatrutide` hedges, `pemvidutide-vs-semaglutide` census, `amycretin-vs-semaglutide` FAQ census.
