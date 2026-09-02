# TICK15-SURVO — implementer note (not a KEEP)

Loop: L4 cited-only on `survodutide-vs-tirzepatide.mdx`. Tick 13 KEEP landed; this increment follows TICK14 implementer work.

## Fetched this increment (2026-09-02)

| Id | What the fetch showed |
|---|---|
| PMID 42253238 SYNCHRONIZE-1 NCT06066515 | n=725; 76 wk; treatment-regimen. 3.6 mg −12.2% (95% CI −13.6 to −10.8); 6.0 mg −13.0% (−14.4 to −11.6); placebo −5.4% (−6.9 to −4.0). ≥5% 72.6/71.9/46.3%. GI 80.9/89.7/47.9%. No deaths. |
| PMID 38330987 phase 2 NCT04667377 | 387 enrolled; 386 treated; **46 weeks**. Planned-treatment −6.2/−12.5/−13.2/−14.9% vs −2.8% placebo. GI 75% vs 42%. Not a 48-week table. |
| PMID 38095657 NCT04153929 | T2D phase 2; 413 randomised; 16 wk. HbA1c −0.91 to −1.71% by dose group; semaglutide −1.47%. Bodyweight up to −8.7% (DG6) vs −5.3% semaglutide. AE 77.8/52.5/52.0%. |
| PMID 35658024 SURMOUNT-1 | n=2539; 72 wk. 5/10/15 mg −15.0/−19.5/−20.9% vs −3.1%. ≥20% at 15 mg 57% (CI 53–61). AE d/c 6.2% vs 2.6%. |
| PMID 37385275 SURMOUNT-2 | n=938; 72 wk. 10/15 mg −12.8/−14.7% vs −3.2%. ≥5% 79–83% vs 32%. GI d/c (&lt;5%). |

## File

- `src/content/comparisons/survodutide-vs-tirzepatide.mdx`
  - Removed duplicate YAML.
  - Replaced unsourced 48-week ~18.7/~19.5 table with SYNCHRONIZE-1 + 46-week phase 2.
  - Stripped invented tirzepatide HbA1c −2.3%; named MASH trial percents; FAQ source census; consult-a-provider; ~19% / ~22% summary.
  - List Price ~$1,000/month left (TICK6-PRICE waits on Lucas).

## Not done

- SYNCHRONIZE-MASLD PMID 42252333 not re-fetched this increment (no liver-fat %).
- SURPASS-CVOT not re-fetched.
- Drugs@FDA for survodutide not re-fetched.
- TICK6-PRICE.
- W3-M1 OAuth.
