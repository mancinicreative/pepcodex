# TICK21 — implementer note (not a KEEP)

Loop: L4 cited-only on `pemvidutide-vs-tirzepatide.mdx`. Worst remaining leftover after TICK20: census FAQ + consult + ~15.6%/~22% hedges + invented AE/phase tables + zero YAML sources. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

`pemvidutide-vs-tirzepatide.mdx` hit every named leftover class (census FAQ, consult, hedged weight, invented tables) and had no `sources[]`. `tirzepatide-vs-retatrutide.mdx` is hedge/table-heavy but not census. `amycretin-vs-semaglutide.mdx` is FAQ-census only after the STEP-1 pass. Locked/KEEP compares not reopened.

## Fetched this increment (2026-09-02)

Commands: `node .planning\seo-engine\runs\2026-09-01\_tick21-fetch.mjs` then `_tick21-fetch2.mjs` then `_tick21-fetch3.mjs`. Per-alias esearch (not OR-joined). NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (pemvidutide) / 200 (tirzepatide). Title-matched.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 41237796 IMPACT NCT05989711 | Weekly pemvidutide vs placebo for MASH (IMPACT) 24-week phase 2b | n=212 (1,557 screened). ITT dual primary. MASH resolution w/o fibrosis worsening: 20% / 58% / 52% (PBO / 1.2 / 1.8 mg). Fibrosis improvement w/o MASH worsening: 28% / 33% / 36% (P=0.59 / 0.27). AE 78/81/67. AE d/c 0/1/2. Fibrosis co-primary **not met**. |
| PMID 39002641 NCT05006885 | Pemvidutide in MASLD 12-week RCT | n=94. Paper primary = LFC. −46.6/−68.5/−57.1% vs −4.4% (P&lt;0.001). Maximal weight −4.3% at 1.8 mg. CT.gov Phase 1, TEAE primary, hasResults false. |
| PMID 41113119 NCT05292911 | Pemvidutide MASLD 24-week extension | n=64. Paper primary = LFC. −56.3/−75.2/−76.4% vs −14.0%. 1.8 mg: 84.6% hit 50% LFC cut; 53.8% ≤5%. Weight also −6.2%. CT.gov Phase 1, TEAE primary. |
| PMID 35658024 SURMOUNT-1 NCT04184622 | Tirzepatide once weekly for obesity | n=2539, 72 wk. **Treatment-regimen.** 5/10/15 mg −15.0/−19.5/−20.9% vs −3.1%. ≥20% at 15 mg **57%** (CI 53–61). AE d/c 4.3/7.1/6.2 vs 2.6. |
| PMID 37385275 SURMOUNT-2 NCT04657003 | Tirzepatide for obesity in T2D | n=938, 72 wk. **Treatment-regimen.** 10/15 mg −12.8/−14.7% vs −3.2%. ≥5% 79–83% vs 32%. GI d/c &lt;5%. |
| NCT05295875 MOMENTUM | ALT-801 Phase 2 obesity, 48 weeks | COMPLETED. Enrollment 391 actual. hasResults **false**. PubMed `pemvidutide AND MOMENTUM` = **0**. |
| openFDA drugsfda | generic_name pemvidutide / tirzepatide | Pemvidutide: NOT_FOUND. Tirzepatide: NDA 215866 Mounjaro; NDA 217806 Zepbound. |

Esearch `pemvidutide` count 13. Reviews / empty Lancet companion / mouse ALT-801 (35461369) not used as efficacy sources.

## File

- `src/content/comparisons/pemvidutide-vs-tirzepatide.mdx`
  - Stripped census FAQ (10/3 vs 76/68), consult, ~15.6% / ~22%, invented nausea 12–33% table, lean-mass claim, SYNERGY-NASH, Fast Track, Phase 3 “not started.”
  - Quoted IMPACT ITT dual primary with placebo and the unmet fibrosis co-primary. Escaped P&lt;.
  - Quoted MASLD LFC as liver-fat endpoints, not obesity Phase 3. Dated MOMENTUM absence without repeating an unpublished percent.
  - Quoted SURMOUNT-1/2 treatment-regimen with placebo and 57% ≥20% at 15 mg.
  - Linked `/peptides/pemvidutide`, `/peptides/tirzepatide`, `/compare/pemvidutide-vs-semaglutide` (no trailing slash).
  - lastUpdated 2026-09-02. YAML sources[] pmid + verifiedAt 2026-09-02. CRLF.

## Not done

- Did not mark KEEP.
- Did not touch locked `amycretin-vs-tirzepatide.mdx`, `orforglipron-vs-tirzepatide.mdx`, or `judge/`.
- Did not redo KEEP compare bodies.
- Did not restore TRIUMPH 28.7%, OSA 63%, REDEFINE 22.7%, amycretin ~25%, orforglipron 36 mg −9.4%/45 mg −10.1%.
- No $1,000 row on this page (TICK6-PRICE still waiting; nothing to strip).
- Drugs@FDA HTML overview pages not fetched (openFDA API used).
- SYNERGY-NASH / SYNERGY-Outcomes not quoted (search was not a title-matched tirzepatide NASH results paper).
- W3-M1 OAuth.
- Remaining leftovers: `tirzepatide-vs-retatrutide` hedges, `pemvidutide-vs-semaglutide` census, `cagrilintide-vs-tirzepatide` census/~ranges, `amycretin-vs-semaglutide` FAQ census.
