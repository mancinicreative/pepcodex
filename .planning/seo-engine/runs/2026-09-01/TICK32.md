# TICK32 — implementer note (not a KEEP)

Loop: L4 cited-only on `wegovy-vs-zepbound.mdx`. Census FAQ, invented ≥5/10/15/20% range table, ~12–15% / ~15–18% hedges, unmatched AE percent grid, SELECT “20% MACE” headline, STEP 4 / SURMOUNT-4 “maintained vs regain” without numbers. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned file exists (`semaglutide-vs-tirzepatide.mdx` not used). Locked TICK19–31 compares and `src/content/peptides/**` not opened.

## Fetched this increment (2026-09-02)

Commands actually run:

```
node .planning\seo-engine\runs\2026-09-01\_tick32-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick32-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick32-fetch3.mjs
```

NCBI esearch STATUS 200 (per-query, not OR-joined). NCBI efetch STATUS 200. NCBI esummary STATUS 200. Title-matched before quoting.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 33567185 STEP 1 NCT03548935 | Once-weekly semaglutide in adults with overweight or obesity | n=1961, 68 wk. Primary estimand regardless of discontinuation/rescue. 2.4 mg **−14.9% vs −2.4%** (ETD −12.4 pp). ≥5% 86.4% vs 31.5%; ≥10% 69.1% vs 12.0%; ≥15% 50.5% vs 4.9%. No ≥20% in abstract. GI d/c 4.5% vs 0.8%. |
| PMID 37952131 SELECT NCT03574597 | Semaglutide and cardiovascular outcomes in obesity without diabetes | n=17,604. MACE **6.5% vs 8.0%**; **HR 0.80** (0.72–0.90); P&lt;0.001. Follow-up 39.8 mo. AE d/c 16.6% vs 8.2%. Not a 20% headline. |
| PMID 35658024 SURMOUNT-1 NCT04184622 | Tirzepatide once weekly for obesity | n=2539, 72 wk. **Treatment-regimen.** 5/10/15 mg −15.0/−19.5/−**20.9%** vs **−3.1%**. ≥20% at 15 mg **57%** (CI 53–61) vs 3%. AE d/c 4.3/7.1/6.2 vs 2.6. |
| PMID 40353578 SURMOUNT-5 NCT05822830 | Tirzepatide as compared with semaglutide for the treatment of obesity | Found via esearch `Aronne SURMOUNT-5` (id in result set), then esummary + efetch. n=751, 72 wk, open-label Phase 3b. MTD tirzepatide vs MTD semaglutide. LS mean **−20.2% vs −13.7%**. Waist −18.4 vs −13.0 cm. Category thresholds named; **no category percents** in abstract. No estimand label. |
| PMID 33667417 STEP 2 | Semaglutide 2.4 mg in overweight/obesity + T2D | n=1210, 68 wk. −9.6% vs −3.4%. ≥5% 68.8% vs 28.5%. |
| PMID 33625476 STEP 3 | Semaglutide vs placebo + intensive behavioral therapy | n=611, 68 wk. −16.0% vs −5.7%. ≥5/10/15% 86.6/75.3/55.8 vs 47.6/27.0/13.2. GI 82.8% vs 63.2%. |
| PMID 33755728 STEP 4 | Continued weekly semaglutide vs placebo (withdrawal) | Run-in −10.6%; 803 randomised. Wk 20–68: −7.9% vs +6.9%. |
| PMID 37385275 SURMOUNT-2 | Tirzepatide in obesity + T2D | n=938, 72 wk. **Treatment-regimen.** 10/15 mg −12.8/−14.7% vs −3.2%. ≥5% 79–83% vs 32% (abstract’s range). |
| PMID 37840095 SURMOUNT-3 | Tirzepatide after intensive lifestyle | n=579. **Treatment-regimen.** From randomisation −18.4% vs +2.5%. |
| PMID 38078870 SURMOUNT-4 | Continued tirzepatide for maintenance | Lead-in −20.9%; 670 randomised. Wk 36–88: −5.5% vs +14.0%. ≥80% maintained 89.5% vs 16.6%. Wk 0–88: −25.3% vs −9.9%. |

## File

- `src/content/comparisons/wegovy-vs-zepbound.mdx`
  - Stripped census FAQ (67/52 vs 76/68), consult-combination, invented ~12–15% / ~15–18% and ≥5/10/15/20% range table, unmatched AE grid (44% nausea etc.), SELECT 20% MACE headline, “over 4,500 / 5,000” enrollment hedges, unfetched FDA years, BMI cutoffs, shortage/CV-trial-ongoing rows.
  - Quoted STEP 1 treatment-policy primary estimand with placebo. Quoted SURMOUNT-1 treatment-regimen 15 mg and 57% (CI 53–61) ≥20%. Quoted SELECT HR 0.80 (6.5% vs 8.0%).
  - Quoted SURMOUNT-5 LS mean −20.2% vs −13.7% after fetch; did not invent category percents.
  - Quoted STEP 2–4 and SURMOUNT-2–4 exactly from this run’s abstracts (withdrawal trials keep their own windows).
  - Escaped P&lt;0.001 / P&lt;0.0001. Linked `/peptides/semaglutide`, `/peptides/tirzepatide` (no trailing slash).
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (187 CRLF, 0 LF-only).

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `orforglipron-vs-tirzepatide.mdx`, `pemvidutide-vs-tirzepatide.mdx`, `tirzepatide-vs-retatrutide.mdx`, `pemvidutide-vs-semaglutide.mdx`, `retatrutide-vs-survodutide.mdx`, `maritide-vs-tirzepatide.mdx`, `amycretin-vs-semaglutide.mdx`, `survodutide-vs-semaglutide.mdx`, `vk2735-vs-tirzepatide.mdx`, `cagrilintide-vs-semaglutide.mdx`, `retatrutide-vs-semaglutide.mdx`, or `src/content/peptides/**`.
- Did not restore OSA 63%/6%, TRIUMPH 28.7%, SCALE as ~8%, or SURMOUNT-1 “over 60% ≥20%.”
- Did not invent SURMOUNT-5 ≥10/15/20/25% percents.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## Blockers

- None for this file. Judge (not this implementer) owns KEEP/REVERT.
