# TICK10-GI — implementer note (not a KEEP)

Loop: L4 cited-only leftover after TICK9 Judge residual (GI range table + unsourced responder/HbA1c rows). Do not start TICK6-PRICE.

## Fetched this increment (2026-09-02)

| Id | What the fetch showed |
|---|---|
| PMID 40544433 | GI AE 79.6% vs 39.9%. Mean −20.4% vs −3.0%. Abstract says ≥20%/≥25%/≥30% were more likely vs placebo; **does not publish those percents**. No nausea split. No discontinuation %. |
| PMID 35658024 | 15 mg −20.9% vs −3.1% at 72 weeks. ≥20% at 15 mg: **57% (95% CI 53–61)** vs 3% placebo. AE discontinuation 4.3%/7.1%/**6.2%**/2.6% (5/10/15 mg / placebo). GI most common; **no nausea/vomiting percents**. |
| PMID 40544432 | Re-fetched for the existing REDEFINE 2 −13.7% vs −3.4% row (n=1206). Not used to invent an HbA1c delta; abstract reports 73.5% vs 15.9% with HbA1c ≤6.5%, not −2.3%. |

## File

- `src/content/comparisons/cagrisema-vs-tirzepatide.mdx`
  - Stripped nausea ~40–45% / vomiting / diarrhea / constipation range table.
  - Stripped GI/overall discontinuation range table.
  - Stripped ≥20% ~55% / ≥25% ~35/~36% / HbA1c −2.3%.
  - Quoted REDEFINE 1 GI class percents and SURMOUNT-1 15 mg AE discontinuation.
  - ≥20% row: SURMOUNT-1 57% with CI; REDEFINE 1 labeled as unpublished in the abstract.
  - Replaced “REDEFINE Pivotal Ongoing” with NCT06131437 design-only (hasResults false).
  - Stripped unsourced REDEFINE 1 baseline BMI ~38 (not in the abstract). SURMOUNT-1 BMI 38.0 is in the abstract but the comparison row was dropped rather than half-filled.
  - Regulatory: dropped invented “Expected Approval 2025-2026”; “Phase 3 ongoing” → published REDEFINE 1/2, not FDA-approved.
  - **Did not** strip ~$1,000/month (TICK6-PRICE still waiting on Lucas).

## Not done

- TICK6-PRICE.
- W3-M1 OAuth.
- SURMOUNT-2/3/4 percents and SURPASS-CVOT HR in this file were not re-fetched this increment (pre-existing; not this residual).
- FAQ “14 sources / 6 human studies” counts not re-census’d.
