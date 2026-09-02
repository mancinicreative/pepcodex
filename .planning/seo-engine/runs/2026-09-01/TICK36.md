# TICK36 — implementer note (not a KEEP)

Loop: L4 cited-only on `tirzepatide-vs-semaglutide.mdx`. Live survivor after TICK34 no-op (deleted reverse-order slug). Census FAQ, SURPASS-2 kg / HbA1c&lt;7% / ≥10% rows not in the abstract, invented AE grid, ~ half-life hedges, “2.4 mg not available” vs SURMOUNT-5, SELECT without HR, SURPASS-CVOT “ongoing” vs “reported.” Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned file exists. `semaglutide-vs-tirzepatide.mdx` remains deleted (301 in `vercel.json`). Locked TICK19–35 compares, `wegovy-vs-zepbound.mdx`, and `src/content/peptides/**` not edited.

## Fetched this increment (2026-09-02)

Command actually run:

```
node .planning\seo-engine\runs\2026-09-01\_tick36-fetch.mjs
```

NCBI esearch `Aronne SURMOUNT-5` STATUS 200 (id `40353578` in result set; not OR-joined). NCBI esummary STATUS 200. NCBI efetch STATUS 200. Title-matched before quoting.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 33567185 STEP 1 NCT03548935 | Once-Weekly Semaglutide in Adults with Overweight or Obesity | n=1961, 68 wk. Primary estimand regardless of discontinuation/rescue. 2.4 mg **−14.9% vs −2.4%** (ETD −12.4 pp; CI −13.4 to −11.5; P&lt;0.001). ≥5/10/15% 86.4/69.1/50.5 vs 31.5/12.0/4.9. GI d/c 4.5% vs 0.8%. |
| PMID 35658024 SURMOUNT-1 NCT04184622 | Tirzepatide Once Weekly for the Treatment of Obesity | n=2539, 72 wk. **Treatment-regimen.** 5/10/15 mg −15.0/−19.5/−**20.9%** vs **−3.1%**. ≥20% at 15 mg **57%** (CI 53–61) vs 3%. AE d/c 4.3/7.1/6.2 vs 2.6. Not “over 60%.” |
| PMID 37952131 SELECT NCT03574597 | Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes | n=17,604. MACE **6.5% vs 8.0%**; **HR 0.80** (0.72–0.90); P&lt;0.001. Follow-up 39.8 mo. AE d/c 16.6% vs 8.2%. Not a 20% headline. |
| PMID 40353578 SURMOUNT-5 NCT05822830 | Tirzepatide as Compared with Semaglutide for the Treatment of Obesity | In esearch set. n=751, 72 wk, open-label Phase 3b. MTD tirzepatide vs MTD semaglutide. LS mean **−20.2% vs −13.7%**. Waist −18.4 vs −13.0 cm. Category thresholds named; **no category percents** in abstract. No estimand label. |
| PMID 34170647 SURPASS-2 NCT03987919 | Tirzepatide versus Semaglutide Once Weekly in Patients with Type 2 Diabetes | n=1879, 40 wk, open-label. Semaglutide **1 mg**. HbA1c −2.01/−2.24/−2.30 vs −1.86. Weight **ETD** −1.9/−3.6/−5.5 kg. Nausea 17–22% vs 18%; diarrhea 13–16% vs 12%; vomiting 6–10% vs 8%. Hypoglycemia &lt;54: 0.6/0.2/1.7 vs 0.4. SAE 5–7% vs 3%. Abstract has **no** absolute kg/arm, no HbA1c&lt;7%, no ≥10% rate. |
| PMID 41406444 SURPASS-CVOT NCT04255433 | Cardiovascular Outcomes with Tirzepatide versus Dulaglutide in Type 2 Diabetes | mITT 6586 vs 6579. Events 12.2% vs 13.1%. **HR 0.92** (95.3% CI 0.83–1.01); P=0.003 noninferiority; P=0.09 superiority. Not placebo. Not vs semaglutide. |

## File

- `src/content/comparisons/tirzepatide-vs-semaglutide.mdx`
  - Stripped census FAQ (76/68 vs 67/52), consult-combination, invented SURPASS-2 kg / HbA1c-below-7% / ≥10% table, unmatched AE grid (12–18% nausea etc.), ~5 / ~7 day half-life, “comparative data vs 2.4 mg not available,” “CVOT ongoing,” unfetched FDA-label years, boxed-warning list, who-might-choose.
  - Quoted SURPASS-2 HbA1c and weight ETDs only; GI and hypoglycemia from this run’s abstract. Escaped P&lt;0.001 and &lt;54.
  - Quoted SURMOUNT-5 LS mean −20.2% vs −13.7% after re-fetch; did not invent category percents.
  - Quoted STEP 1 treatment-policy primary estimand with placebo. Quoted SURMOUNT-1 treatment-regimen 15 mg and 57% (CI 53–61) ≥20%.
  - Quoted SELECT HR 0.80 (6.5% vs 8.0%). Quoted SURPASS-CVOT HR 0.92 vs dulaglutide (noninferior, not superior).
  - Linked `/peptides/tirzepatide`, `/peptides/semaglutide`, `/compare/wegovy-vs-zepbound`, `/blog/surmount-5-tirzepatide-vs-semaglutide` (no trailing slash). Did not recreate `/compare/semaglutide-vs-tirzepatide`.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (176 CRLF, 0 LF-only).

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `wegovy-vs-zepbound.mdx`, `mazdutide-vs-semaglutide.mdx`, `maritide-vs-semaglutide.mdx`, `vk2735-vs-semaglutide.mdx`, TICK19–31 KEEP/awaiting files, or `src/content/peptides/**`.
- Did not recreate the deleted reverse-order slug.
- Did not restore OSA percents, TRIUMPH, SCALE as a percent, or SURMOUNT-1 “over 60% ≥20%.”
- Did not invent SURMOUNT-5 ≥10/15/20/25% percents.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## Blockers

- None for this file. Judge (not this implementer) owns KEEP/REVERT.
