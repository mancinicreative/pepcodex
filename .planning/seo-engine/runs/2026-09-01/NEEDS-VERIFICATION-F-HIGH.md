# NEEDS-VERIFICATION-F-HIGH — 2026-09-02

Implementer did **not** invent these. Fetch log: `_fetch-fresh-high.json` + openFDA 404s.

| Slug | Gap | Why not invented |
|---|---|---|
| ecnoglutide | NMPA approval letter / English product page / label | PMID 42412371 is a *Drugs* review titled “First Approvals.” openFDA drugsfda/label 404 on 2026-09-02. EMA search timed out. Status left **investigational**. |
| ecnoglutide | EVOLVE-2 (NCT07281937) treatment-policy weight | Phase 2 completed; `hasResults` false. No percent. |
| ecnoglutide | SLIMMER-UP-SWITCH (NCT07073417) vs semaglutide | Open-label Phase 2; `hasResults` false. |
| ecnoglutide | NCT07143227 adolescent Phase 1 results | Completed; `hasResults` false. |
| ecnoglutide | EMA EPAR | Search timed out 2026-09-02. |
| rusfertide | VERIFY Phase 3 peer-reviewed percent | Scan window 2026-04-13 to 2026-09-01: no VERIFY paper. 77% stays labelled sponsor topline. |
| rusfertide | NCT07648030 / NCT07765602 results | Phase 2 regional; `hasResults` false. |
| rusfertide | PMID 42466131 | Fetched; small-molecule hepcidin-mimetic screen; abstract does not name rusfertide. |
| pemvidutide | RECLAIM (NCT06987513) AUD endpoint | Completed; `hasResults` false. No heavy-drinking-day percent. |
| pemvidutide | RESTORE (NCT07009860) ALD VCTE | Active, not recruiting; `hasResults` false. |
| pemvidutide | PERFORMA (NCT07795164) Phase 3 histology / outcomes | Recruiting; no results. |
| pemvidutide | 41879841 fibrosis-histology responder rate | Abstract has ELF MD only; no histologic fibrosis responder %. |
| pemvidutide | Cureus 42529769 class MA | SOP skip. |
| amycretin | PMID 42673585 Annals GLP-1 SR | Worklist High leftover; title is class SR, not compound-specific. Not this set. |

## Not a new-peptide gap

CONTENT-PLAN net URL delta = 0. No `GAPS.md` row. `discover:gaps` not run this increment.
