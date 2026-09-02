# TICK39 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/ozempic-vs-mounjaro.mdx`. Highest-severity unlocked leftover after locked TICK26–38 / KEEP TICK5–25 files: census FAQ (`67 sources` / `52 human` vs `76 sources` / `68 human`) plus invented SUSTAIN 1.0–1.8% / SURPASS 1.8–2.4% / 4–6 kg / 5–12 kg / 8,000+ / 7,000+ rows and a stale “CVOT ongoing.” Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned leftover after grep of `src/content/comparisons/*.mdx` for census FAQs (`76 sources`, `67/52`, `Who Might`), invented `~` percents, and unpublished results. This file matched the census strings exactly and carried unsourced T2D program ranges. Locked TICK26–38 compares, KEEP TICK5–25 compares, TICK6-PRICE rows, and `src/content/peptides/**` not opened.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Get-ChildItem -Name "src\content\comparisons\*.mdx"
node .planning\seo-engine\runs\2026-09-01\_tick39-fetch.mjs
node -e (efetch PMID 41406444 body-only)
node -e (esummary PMID 27633186 title/author)
Test-Path src\content\peptides\semaglutide.mdx
Test-Path src\content\peptides\tirzepatide.mdx
node scripts\qa-banned-content.js src\content\comparisons\ozempic-vs-mounjaro.mdx
node scripts\qa-comparison-counts.mjs
node scripts\qa-medical-advice.mjs
```

NCBI esearch `Marso semaglutide SUSTAIN-6 2016` STATUS 200 (id `27633186` only; not OR-joined). NCBI esummary STATUS 200. NCBI efetch STATUS 200. Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 34170647 SURPASS-2 NCT03987919 | Tirzepatide versus Semaglutide Once Weekly in Patients with Type 2 Diabetes | n=1879, 40 wk, open-label. Semaglutide **1 mg**. HbA1c −2.01/−2.24/−2.30 vs −1.86. Weight **ETD** −1.9/−3.6/−5.5 kg. Nausea 17–22% vs 18%; diarrhea 13–16% vs 12%; vomiting 6–10% vs 8%. Hypoglycemia &lt;54 mg/dL: 0.6/0.2/1.7 vs 0.4. SAE 5–7% vs 3%. Abstract has **no** absolute kg/arm, no HbA1c&lt;7%, no ≥10% rate, no estimand label. |
| PMID 27633186 SUSTAIN-6 NCT01720446 | Semaglutide and Cardiovascular Outcomes in Patients with Type 2 Diabetes | Esearch count 1. Marso SP. n=3297; 104 wk; 0.5 mg or 1.0 mg vs placebo. Primary 108/1648 (**6.6%**) vs 146/1649 (**8.9%**); **HR 0.74** (0.58–0.95); P&lt;0.001 **for noninferiority**. Nonfatal MI 2.9% vs 3.9% (HR 0.74; P=0.12). Nonfatal stroke 1.6% vs 2.7% (HR 0.61; P=0.04). Retinopathy complications HR 1.76 (1.11–2.78; P=0.02). Not a 26% headline. |
| PMID 41406444 SURPASS-CVOT NCT04255433 | Cardiovascular Outcomes with Tirzepatide versus Dulaglutide in Type 2 Diabetes | mITT 6586 vs 6579 (13,299 randomised; 134 excluded). Events 12.2% vs 13.1%. **HR 0.92** (95.3% CI 0.83–1.01); P=0.003 noninferiority; P=0.09 superiority. Not placebo. Not vs semaglutide. Not ongoing. |

## File

- `src/content/comparisons/ozempic-vs-mounjaro.mdx`
  - Stripped census FAQ (67/52 vs 76/68), consult-combination, invented SUSTAIN/SURPASS A1C and kg ranges, 8,000+/7,000+ enrollment, unmatched Common/Common AE grid, unfetched FDA years, boxed-warning list, SELECT-without-HR, “CVOT ongoing.”
  - Quoted SURPASS-2 HbA1c and weight ETDs only; GI and hypoglycemia from this run’s abstract. Escaped P&lt;0.001 and &lt;54. Reworded the hypoglycemia threshold to `mg/dL` so `qa-banned-content` does not read `54 mg per` as a dose.
  - Quoted SUSTAIN-6 HR 0.74 (6.6% vs 8.9%) with the noninferiority P. Did not headline 26%.
  - Quoted SURPASS-CVOT HR 0.92 vs dulaglutide (noninferior, not superior).
  - Linked `/peptides/semaglutide`, `/peptides/tirzepatide`, `/compare/tirzepatide-vs-semaglutide`, `/compare/wegovy-vs-zepbound` (no trailing slash). Did not open those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (131 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs` site scan: PASS. `qa-comparison-counts.mjs`: exit 0 (28 pre-existing amycretin/5-amino census-row WARNs; this file not in that list). Select-String battery (positive control 37): census FAQ strings, Consult, Who Might, banned leftover percents, unescaped `\<\d`, trailing-slash hrefs — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `cagrisema-vs-semaglutide`, `maritide-vs-semaglutide`, `mazdutide-vs-semaglutide`, `tirzepatide-vs-semaglutide`, `wegovy-vs-zepbound`, `vk2735-vs-semaglutide`, `retatrutide-vs-semaglutide`, `cagrilintide-vs-semaglutide`, `vk2735-vs-tirzepatide`, `survodutide-vs-semaglutide`, `amycretin-vs-semaglutide`, `maritide-vs-tirzepatide`, KEEP TICK5–25 compares, or `src/content/peptides/**`.
- Did not restore OSA 63%/6%, TRIUMPH 28.7%, REDEFINE 22.7/15.7, SYNCHRONY, MOMENTUM unpublished obesity, amycretin oral ~13/~25, or SURMOUNT-1 over 60%.
- Did not quote SELECT, STEP 1, SURMOUNT-1, or SURMOUNT-5 (not fetched this increment; T2D-brand page).
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `ozempic-vs-mounjaro.mdx` census FAQ (67/52 vs 76/68) and invented T2D program ranges stripped.
2. SURPASS-2 quoted as HbA1c −2.01/−2.24/−2.30 vs −1.86 and weight ETD −1.9/−3.6/−5.5 kg vs semaglutide 1 mg (PMID 34170647).
3. SUSTAIN-6 quoted as HR 0.74 (6.6% vs 8.9%); P is noninferiority, not a 26% headline (PMID 27633186).
4. SURPASS-CVOT quoted as HR 0.92 vs dulaglutide (noninferior, not superior); “ongoing” removed (PMID 41406444).
5. No source census, consult, SELECT-without-HR, or unfetched FDA years remain on this file.
6. Links match getStaticPaths slugs with no trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Remaining unlocked leftovers after this tick include `ozempic-vs-wegovy.mdx` (same-molecule 67/52 census) and unsourced `~` percents on tesamorelin / 5-amino-1mq / AOD-9604 compares.

## Blockers

- None for this file. Judge (not this implementer) owns KEEP/REVERT.
- TICK6-PRICE still blocked on Lucas.
- W3-M1 OAuth still blocked.
