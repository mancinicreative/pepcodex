# NEEDS-VERIFICATION-F-HIGH-2 — 2026-09-02

Implementer did **not** invent these. Fetch log: `_fetch-fresh-high-2.json` + openFDA 404s / false-match note.

| Slug | Gap | Why not invented |
|---|---|---|
| pf-08653944 | Any human weight-loss percent | 10 fetched NCTs, all `hasResults` false. Scout JSON `newPapers: []`. |
| pf-08653944 | NCT07400679 PK/BA numbers | Completed (actual n=48); `hasResults` false. No Cmax/AUC quoted. |
| pf-08653944 | VESPER-JM / JW / China Phase 3 results | NCT07794774, NCT07794761, NCT07792954 not yet recruiting. |
| pf-08653944 | SOLIS-1 monotherapy vs combo percents | NCT07575932 recruiting; umbrella includes sibling PF-08653945 (not aliased). |
| pf-08653944 | Weekly MET097 VESPER-1 / NCT06857617 | Not in this slice’s worklist; not fetched 2026-09-02. Existing page mentions labelled as not re-fetched. |
| pf-08653944 | FDA/EMA/NMPA listing | Quoted openFDA `"PF-08653944"` and `generic_name:berobenatide` 404 on 2026-09-02. |
| ct-388 | Phase 2 obesity percent (NCT06525935) | Completed (actual n=469, primary completion 2025-12-08); `hasResults` false. |
| ct-388 | Phase 2 T2D HbA1c / weight (NCT06628362) | Active, not recruiting (actual n=447); `hasResults` false. |
| ct-388 | Enith1 / Enith2 / China Phase 3 percents | NCT07351045, NCT07351058, NCT07670416 recruiting; no results. |
| ct-388 | ZYNERGY combo percent | NCT07589686 not yet recruiting; petrelintide is a combo partner, not a CT-388 synonym. |
| ct-388 | New PubMed paper | Scout JSON `newPapers: []` for CT-388 / RG-6912 (window 2026-01-22 to 2026-09-01, scanned 2026-09-01). |
| ct-388 | FDA listing | `generic_name:enicepatide` 404. Unquoted `CT-388` hit unrelated ANDAs — discarded. |
| ct-388 | Whether RG-6912 = RG6640 | CT.gov other-name this run is RG6640. Public dossier alias remains RG-6912. No rename document fetched. |
| amycretin | Which trial produced Annals −23.9% | PMID 42673585 names amycretin; abstract does not name the trial or estimand. Heterogeneity precluded quantitative synthesis. |
| amycretin | New NCT | Scout JSON `newTrials: []` / `updatedTrials: []`. No pack created. |
| amycretin | FDA listing | `generic_name:zenagamtide` and `amycretin` 404 on 2026-09-02. |

## Not a new-peptide gap

CONTENT-PLAN net URL delta = 0. No `GAPS.md` row. `discover:gaps` not run this increment.
