# TICK26 — implementer note (not a KEEP)

Loop: L4 cited-only on `maritide-vs-tirzepatide.mdx`. Worst leftover: census FAQ + Who Might / consult + invented `~14-17%` / `~15-17%` / `~20%+` / `15-22%` tables. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

ORIGINAL-ASK-STATUS dirty-compare row: `maritide-vs-tirzepatide` (`~20%+`; Who Might). Assigned file only. Locked TICK19–25 compares and `src/content/peptides/**` not opened.

## Fetched this increment (2026-09-02)

Commands: `node .planning\seo-engine\runs\2026-09-01\_tick26-fetch.mjs` then `_tick26-fetch2.mjs` then `_tick26-fetch3.mjs` then `_tick26-fetch4.mjs` then `_tick26-fetch5.mjs`. Per-alias esearch (not OR-joined). NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (maridebart / maritide) / 200 (tirzepatide). Title-matched.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40549887 NCT05669599 | Once-monthly maridebart cafraglutide Phase 2 | n=592 (obesity 465; obesity-diabetes 127); 52 wk. **Treatment-policy.** Obesity −12.3% (CI −15.0 to −9.7) to −16.2% (CI −18.9 to −13.5) vs −2.5% (CI −4.2 to −0.7). T2D −8.4% to −12.3% vs −1.7%. HbA1c −1.2 to −1.6 vs +0.1 pp. Abstract range, **no per-arm percent table**. GI common; no nausea %. CT.gov completed; hasResults **false**. |
| PMID 38316982 NCT04478708 | Phase 1 AMG 133 | Acceptable safety; dose-dependent weight loss; MAD maintained up to 150 days after last dose. **Abstract does not publish a percent.** Enrollment 110 actual; hasResults true (results module not quoted). |
| PMID 35658024 SURMOUNT-1 NCT04184622 | Tirzepatide once weekly for obesity | n=2539; 72 wk. **Treatment-regimen.** 5/10/15 mg −15.0/−19.5/−20.9% vs −3.1%. ≥20% at 15 mg **57%** (CI 53–61). AE d/c 4.3/7.1/6.2 vs 2.6. |
| PMID 37385275 SURMOUNT-2 NCT04657003 | Tirzepatide obesity + T2D | n=938; 72 wk. **Treatment-regimen.** 10/15 mg −12.8/−14.7% vs −3.2%. ≥5% 79–83% vs 32%. GI d/c &lt;5%. |
| NCT06858839 MARITIME-1 | Phase 3 obesity, no T2D | ACTIVE_NOT_RECRUITING. Enrollment 3853 actual. hasResults **false**. PubMed `NCT06858839` / `"MARITIME-1" maridebart` = **0**. |
| NCT06858878 MARITIME-2 | Phase 3 obesity + T2D | ACTIVE_NOT_RECRUITING. Enrollment 1105 actual. hasResults **false**. PubMed `NCT06858878` / `"MARITIME-2" maridebart` = **0**. |
| openFDA drugsfda | generic_name maridebart / maritide / tirzepatide | Maridebart and maritide: NOT_FOUND. Tirzepatide: NDA 215866 Mounjaro; NDA 217806 Zepbound. |

Not used as efficacy sources: PMID 38843460 (Drucker review), 39723966 (mouse gut), 40081498 (review), 40507574 (GIPR paradox review), 41941715 (discovery chemistry; no clinical %), 42592044 / 42492687 (reviews), 41337722–24 (letters, no abstract), 38388678 (Phase I results note, no abstract), 36509857 / 38871982 / 36608818 / 41093047 / 38763780 / 41054801 / 41287212 (reviews or mice). NCT06858852 is etomidate (wrong-drug search miss) — not cited.

## File

- `src/content/comparisons/maritide-vs-tirzepatide.mdx`
  - Stripped census FAQ (21/10 vs 76/68), Who Might, consult footer, `~14-17%` / `~15-17%` / `~20%+` / `15-22%` hedges, invented SURPASS 1.5–2.4% A1c, invented GI 12–33% table, `~21+` day half-life, “Phase 3 not yet initiated.”
  - Corrected mechanism: GIP antagonist + GLP-1 agonist, not a dual agonist.
  - Quoted Phase 2 treatment-policy range with placebo and the labelled T2D HbA1c range. Escaped P&lt; and &lt;5%.
  - Quoted Phase 1 as no-percent. Dated MARITIME-1/-2 absences without a percent.
  - Quoted SURMOUNT-1 treatment-regimen with placebo and 57% ≥20% at 15 mg. Quoted SURMOUNT-2 for the T2D parallel.
  - Linked `/peptides/maritide`, `/peptides/tirzepatide`, `/compare/maritide-vs-semaglutide` (no trailing slash).
  - **Did not** strip ~$1,000+/month (TICK6-PRICE still waiting).
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF.

## Not done

- Did not mark KEEP.
- Did not touch locked `orforglipron-vs-tirzepatide.mdx`, `pemvidutide-vs-tirzepatide.mdx`, `tirzepatide-vs-retatrutide.mdx`, `pemvidutide-vs-semaglutide.mdx`, `amycretin-vs-semaglutide.mdx`, `retatrutide-vs-survodutide.mdx`, or `src/content/peptides/**`.
- Did not restore TRIUMPH, OSA 63%/6%, REDEFINE 22.7%, SURMOUNT-1 “over 60% ≥20%”, SCALE ~8%, LEADER “13% reduction”, orforglipron −9.4/−10.1, survodutide ~18.7/~19.5, PIONEER 1, SYNCHRONY, MOMENTUM, amycretin ~13%/~25%.
- Did not quote a Phase 1 or Phase 3 percent.
- Did not quote NCT06131437 (not on this page).
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.
