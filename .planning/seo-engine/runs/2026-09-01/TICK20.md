# TICK20-AMY-TIRZ — implementer note (not a KEEP)

Loop: L4 cited-only on `amycretin-vs-tirzepatide.mdx`. Worst remaining leftover: speculative ~25% annualized, hedged SURMOUNT dose table, FAQ source census, consult. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Select-String on remaining compares (excluding KEEP bodies + locked TICK19 `orforglipron-vs-tirzepatide.mdx`) showed `amycretin-vs-tirzepatide.mdx` with the most defect classes: invented 12-week/~25% rows, 15 mg ~20.9% hedges, census FAQ, consult footer.

## Fetched this increment (2026-09-02)

Command: `node .planning\seo-engine\runs\2026-09-01\_tick20-efetch.mjs` (NCBI efetch STATUS 200). Title-matched.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40550229 oral FIH NCT05369390 | Amycretin GLP-1 and amylin first-in-human phase 1 | n=144. Primary = TEAEs. Part C/D 12-week intervention; bodyweight to day 85 **exploratory**. Abstract **does not publish a percent**. GI 180/364 events. |
| PMID 40550231 SC phase 1b/2a NCT06064006 | Amycretin unimolecular GLP-1/amylin subcutaneous | n=125 (101/24). Primary = TEAEs. Secondary estimated mean: 60 mg wk 36 −24.3% vs −1.1%; 20 mg wk 36 −22.0% vs 1.9%; 5 mg wk 28 −16.2% vs 2.3%; 1.25 mg wk 20 −9.7% vs 2.0%. P&lt;0.0001 / P=0.0003. High withdrawals. |
| PMID 35658024 SURMOUNT-1 NCT04184622 | Tirzepatide once weekly for obesity | n=2539, 72 wk. **Treatment-regimen.** 5/10/15 mg −15.0/−19.5/−20.9% vs −3.1%. ≥20% at 15 mg **57%** (CI 53–61). AE d/c 4.3/7.1/6.2 vs 2.6. |

## File

- `src/content/comparisons/amycretin-vs-tirzepatide.mdx`
  - Stripped census FAQ, consult, ~13%/projected ~25%, hedged 5/10/15 mg table, ~5–7% d/c, theoretical >25%, ~22% summary, invented 2027 timeline.
  - Quoted oral exploratory (no percent in abstract). Quoted SC estimated means as secondary, not Phase 3 treatment-regimen.
  - Quoted SURMOUNT-1 treatment-regimen with placebo and 57% ≥20% at 15 mg. Escaped P&lt;.
  - Linked `/peptides/amycretin`, `/peptides/tirzepatide`, `/compare/amycretin-vs-semaglutide` (no trailing slash).
  - lastUpdated 2026-09-02. YAML sources[] pmid + verifiedAt 2026-09-02. CRLF.

## Not done

- Did not mark KEEP.
- Did not touch locked `orforglipron-vs-tirzepatide.mdx` or `judge/L4-TICK19-ORFOR-TIRZ-iter1.md`.
- Did not redo KEEP compare bodies.
- Did not restore TRIUMPH 28.7%, OSA 63%, REDEFINE 22.7%, SURMOUNT-1 “over 60% ≥20%”, orforglipron 36 mg −9.4%.
- Did not fetch Mora 2026 T2D phase 2 PMIDs 42532080 / 42532079 (efficacy-estimand HbA1c only in dossier).
- No price row on this page (TICK6-PRICE still waiting; nothing to strip).
- W3-M1 OAuth.
- Remaining census/consult leftovers: `pemvidutide-vs-*`, `cagrilintide-vs-tirzepatide`, `tirzepatide-vs-retatrutide` hedges, `amycretin-vs-semaglutide` FAQ still census.
