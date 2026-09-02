# TICK7-REDEFINE — implementer note (not a KEEP)

Loop: L4 cited-only. qa:claims near-miss families REDEFINE-2 mixed estimands + REDEFINE-4 23 vs 25.5.

## Fetched this increment (2026-09-02)

| Id | What the fetch showed | Used as |
|---|---|---|
| PMID 40544432 (efetch) | REDEFINE 2, Davies et al. NEJM 2025; n=1206 (904/302); week-68 treatment-policy −13.7% vs −3.4% (ETD −10.4 pp, 95% CI −11.2 to −9.5); HbA1c ≤6.5% 73.5% vs 15.9%; GI AE 72.5% vs 34.4%. Abstract does **not** state −15.7%/−3.1% trial-product. NCT05394519. | Quote treatment-policy + HbA1c + GI; strip trial-product row |
| PMID 40544433 (already known; not re-quoted beyond −20.4%/−3.0%) | Abstract lacks 22.7%, 40.4%, monotherapy −14.9%/−11.5% | Strip those percents |
| PubMed esearch REDEFINE 4 + cagrilintide + tirzepatide | **0 records** | Dated absence |
| CT.gov v2 NCT06131437 | Brief title CagriSema vs tirzepatide; COMPLETED; enrollment 809 ACTUAL; 84 weeks; masking NONE; primary = non-inferiority on % weight change week 84; hasResults **false**; last update 2026-02-06 | Design only |
| GlobeNewswire 3242381 | **Timed out** (curl exit 28). Not used. | Do not quote 23.0%/25.5%/20.2%/23.6% |

## Files

- `src/content/blog/cagrisema-nda-filed.mdx`
- `src/content/blog/cagrisema-nda-filed-glp1-amylin-combo.mdx`

## Not done

- W3-M1 OAuth.
- TICK6-PRICE (still waiting on Lucas).
- Company-topline REDEFINE 4 percents remain unquoted until a press/PDF fetch succeeds.
