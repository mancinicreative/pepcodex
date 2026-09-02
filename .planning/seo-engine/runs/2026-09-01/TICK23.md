# TICK23 — implementer note (not a KEEP)

Loop: L4 cited-only on `tirzepatide-vs-retatrutide.mdx`. Worst remaining leftover after TICK22: hedges (~20.9% / ~24.2%), invented 4 mg 48-week −17.5% row, invented nausea 20–30% table, consult / who-might, invented 2025–2027 timeline, unfetched NASH. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK22 leftovers were `tirzepatide-vs-retatrutide` hedges, `pemvidutide-vs-semaglutide` census, `amycretin-vs-semaglutide` FAQ census. This file had the most defect classes (hedged percents without placebo, wrong 4 mg 48-week row, invented GI table, who-might / consult, invented filing years, NASH without a fetch). Locked TICK19–22 files and KEEP compares not reopened.

## Fetched this increment (2026-09-02)

Commands: `node .planning\seo-engine\runs\2026-09-01\_tick23-fetch.mjs` then `_tick23-fetch2.mjs` then `_tick23-fetch3.mjs` then `_tick23-fetch4.mjs`. Per-alias esearch (not OR-joined). NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (retatrutide) / 200 (tirzepatide). Title-matched.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 37366315 NCT04881760 | Triple-hormone-receptor agonist retatrutide for obesity — phase 2 | n=338; 48 wk. **Primary = 24 wk.** LS mean 24 wk: −7.2/−12.9/−17.3/−17.5 vs −1.6% (1 / combined 4 / combined 8 / 12 mg). **48 wk secondary:** −8.7/−17.1/−22.8/−24.2 vs **−2.1%**. 12 mg ≥5/10/15%: 100/93/83 vs 27/9/2. GI dose-related, mostly mild–moderate. HR increase peaked wk 24 then declined. Abstract does **not** name treatment-regimen. **−17.5% is 12 mg at 24 wk, not 4 mg at 48 wk.** |
| PMID 42250575 NCT06354660 TRANSCEND-T2D-1 | Retatrutide vs placebo in T2D (diet/exercise) | n=537; 40 wk. **Treatment-regimen.** HbA1c −1.69/−1.86/−1.94 vs −0.81% (P&lt;0.0001). Weight −11.5/−13.9/−15.3 vs −2.6%. AE d/c 2–5% vs 0%. **T2D, not TRIUMPH obesity.** CT.gov COMPLETED; hasResults **false**. |
| PMID 41090431 TRIUMPH design | TRIUMPH registrational programme | Four phase 3 studies; **>5,800**. Primary weight end point = % body-weight change. **No efficacy percent.** PubMed `"TRIUMPH-1" retatrutide weight` = **1** (this paper). `retatrutide[Title] AND 28.7` = **0**. |
| PMID 42608321 | Phase 2 post-hoc CV biomarkers | NCT04881760 + NCT04867785. Lipoprotein / CRP analysis. **Not TRIUMPH.** Not used as a weight-loss percent (apoB −24.2% is not body weight). |
| PMID 35658024 SURMOUNT-1 NCT04184622 | Tirzepatide once weekly for obesity | n=2539; 72 wk. **Treatment-regimen.** 5/10/15 mg −15.0/−19.5/−20.9% vs −3.1%. ≥20% at 15 mg **57%** (CI 53–61). AE d/c 4.3/7.1/6.2 vs 2.6. |
| PMID 37385275 SURMOUNT-2 NCT04657003 | Tirzepatide for obesity in T2D | n=938; 72 wk. **Treatment-regimen.** 10/15 mg −12.8/−14.7% vs −3.2%. ≥5% 79–83% vs 32%. GI d/c &lt;5%. |
| openFDA drugsfda | generic_name retatrutide / tirzepatide | Retatrutide: NOT_FOUND. Tirzepatide: NDA 215866 Mounjaro; NDA 217806 Zepbound. |

TRIUMPH-search title checks (not used as efficacy): PMID 40563436 (review), 41160422 (TRANSCEND-CKD design), 38323122 (correspondence).

## File

- `src/content/comparisons/tirzepatide-vs-retatrutide.mdx`
  - Stripped ~20.9% / ~24.2% hedges, 4 mg 48-week −17.5% row, nausea 20–30% table, who-might / consult, 2025–2027 filing/approval timeline, unfetched NASH/SYNERGY, EMA “Approved,” “widely available.”
  - Quoted phase 2 primary (24 wk) vs secondary (48 wk) with placebo. Escaped P&lt;.
  - Quoted TRANSCEND-T2D-1 as **T2D treatment-regimen**, not obesity Phase 3.
  - Dated TRIUMPH absence without a percent. Did not write 28.7%.
  - Quoted SURMOUNT-1 treatment-regimen with placebo and 57% ≥20% at 15 mg.
  - Linked `/peptides/tirzepatide`, `/peptides/retatrutide`, `/compare/retatrutide-vs-semaglutide`, `/compare/tirzepatide-vs-semaglutide` (no trailing slash).
  - **Did not** strip ~$1,000-1,200/month (TICK6-PRICE still waiting).
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF.

## Not done

- Did not mark KEEP.
- Did not touch locked `cagrilintide-vs-tirzepatide.mdx`, `pemvidutide-vs-tirzepatide.mdx`, `amycretin-vs-tirzepatide.mdx`, `orforglipron-vs-tirzepatide.mdx`, or `judge/`.
- Did not stamp TICK19–22 KEEP.
- Did not redo KEEP compare bodies.
- Did not restore TRIUMPH 28.7%, OSA 63%, REDEFINE 22.7%, amycretin ~25%, orforglipron 36 mg −9.4%.
- Did not fetch PMID 38858523 (liver fat); NASH section stripped.
- W3-M1 OAuth.
- Remaining leftovers: `pemvidutide-vs-semaglutide` census, `amycretin-vs-semaglutide` FAQ census.
