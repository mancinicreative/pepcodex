# NEEDS-VERIFICATION — W2-F-D1 (2026-09-02)

Dossier Updater did **not** invent these. They remain gaps after applying E1/TR1/R1 KEEP packets to summary + body + anecdotal only.

## Do not fill from press or memory

| Slug | Gap | Why not invented |
|---|---|---|
| retatrutide | TRIUMPH obesity efficacy (including any 28.3% / 28.7% figure) | E1: PMID 42608321 is phase 2 post-hoc CV biomarkers, **not** TRIUMPH. No TRIUMPH efficacy paper in the 2026-09-01 window. |
| survodutide | Which SYNCHRONIZE-MASLD figures the erratum changed | PMID 42642663 fetched; erratum text does not state what changed. Treatment-regimen −8.7% vs −1.4% left unchanged. |
| survodutide | NCT07754461 / NCT07768813 results | Registrations only (Phase 3 T2D recruiting; Phase 1 formulation not yet recruiting). No results. |
| oveporexton | Phase 3 primary MWT/ESS (or any FDA-press effect size) | NCT06505031 / NCT06470828 COMPLETED with results-first-posted dates; primary papers not indexed. Press-page numbers not copied. Dosing from the FDA press (including “twice daily”) not copied. |
| oveporexton | DEA CSA Federal Register scheduling notice | 0 hits as of 2026-09-01. Marketing not started. |
| oveporexton | EMA EPAR | No product page as of 2026-09-01 (oveporexton / orzeyful 404). |
| oveporexton | First Light / Radiant Light = NCT mapping | R1: neither NCT06470828 nor NCT06505031 carries those acronyms. Names kept as PMID 42573945 labels only. |
| orforglipron | ACHIEVE-J treatment-regimen HbA1c or weight change | PMID 42607698 abstract does not report those figures. Open-label safety, not a weight-loss headline. |
| orforglipron | PMID 42607699 commentary numbers | E1 skipped (commentary without extractable trial numbers). |
| cagrisema / cagrilintide | Percent-weight conversion of Khan kg differences | PMID 42608559 is pooled kg (GRADE). Not converted to %. |
| mazdutide | Hsia US Phase 2 treatment-policy / treatment-regimen figure | PMID 42628555 abstract reports the efficacy (hypothetical) estimand only. |
| maritide | New efficacy from Yie 42592044 | Design review, not efficacy. Discovery 41941715 already attached. |

## Left for a scoring pass (not this increment)

- `oveporexton` `evidenceStrength` remains `moderate`.
- `oveporexton` `scoring.notes` still contain E1 text (“no approval yet”, “investigational, not marketed”). `regulatoryStatus` (R1 KEEP) is `approved`. Scores were not rescored.

## Not touched

- `keyFindings` arrays (E1 KEEP)
- `regulatoryStatus` objects (R1 KEEP)
- `data/source-packs/**`
- No astro build
