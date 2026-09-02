# TICK42 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/ozempic-vs-wegovy.mdx`. Same-molecule 67/52 census FAQ plus invented SUSTAIN 1.0–1.8% / 26% MACE / 20% MACE headlines. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK39 named this as the next leftover after `ozempic-vs-mounjaro.mdx`. Assigned file exists. TICK40.md is editing `amycretin-vs-vk2735.mdx`. TICK41.md was absent at dispatch; it appeared mid-run as `amycretin-vs-cagrilintide.mdx` (read; no collide). Did not pick tesamorelin / 5-amino-1mq / AOD-9604. Locked TICK39 `ozempic-vs-mounjaro`, TICK38 `maritide-vs-semaglutide`, TICK37 `cagrisema-vs-semaglutide`, TICK35–36 / TICK27–33 awaiting Judge, TICK32 `wegovy-vs-zepbound`, TICK36 `tirzepatide-vs-semaglutide`, TICK26 KEEP `maritide-vs-tirzepatide`, and `src/content/peptides/**` not opened.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\ozempic-vs-wegovy.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK41.md
Test-Path src\content\peptides\semaglutide.mdx
node .planning\seo-engine\runs\2026-09-01\_tick42-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick42-fetch2.mjs
node scripts\qa-banned-content.js src\content\comparisons\ozempic-vs-wegovy.mdx
node scripts\qa-comparison-counts.mjs
node scripts\qa-medical-advice.mjs
```

Per-query NCBI esearch (not OR-joined). First pass: two esearch 429s and two esummary 429s; retry in fetch2 STATUS 200. NCBI efetch STATUS 200 on all six PMIDs. Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started. Semaglutide dossier path-checked only; not opened.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 33567185 STEP 1 NCT03548935 | Once-Weekly Semaglutide in Adults with Overweight or Obesity | n=1961, 68 wk. **Primary estimand regardless of discontinuation/rescue.** 2.4 mg **−14.9% vs −2.4%** (ETD −12.4 pp; CI −13.4 to −11.5; P&lt;0.001). ≥5% 86.4% vs 31.5%; ≥10% 69.1% vs 12.0%; ≥15% 50.5% vs 4.9%. No ≥20% in abstract. GI d/c 4.5% vs 0.8%. Wilding esearch included this id. |
| PMID 27633186 SUSTAIN-6 NCT01720446 | Semaglutide and Cardiovascular Outcomes in Patients with Type 2 Diabetes | Esearch count 1 (Marso SUSTAIN-6 2016). n=3297; 104 wk; 0.5 mg or 1.0 mg vs placebo. Primary 108/1648 (**6.6%**) vs 146/1649 (**8.9%**); **HR 0.74** (0.58–0.95); P&lt;0.001 **for noninferiority**. Nonfatal MI 2.9% vs 3.9% (HR 0.74; P=0.12). Nonfatal stroke 1.6% vs 2.7% (HR 0.61; P=0.04). Retinopathy HR 1.76 (1.11–2.78; P=0.02). Not a 26% headline. Esummary this run had no DOI; DOI not invented. |
| PMID 37952131 SELECT NCT03574597 | Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes | n=17,604. MACE 569/8803 (**6.5%**) vs 701/8801 (**8.0%**); **HR 0.80** (0.72–0.90); P&lt;0.001. Follow-up 39.8 mo. AE d/c 16.6% vs 8.2%. Not a 20% headline. Lincoff esearch included this id. |
| PMID 33667417 STEP 2 NCT03552757 | Semaglutide 2.4 mg once a week in adults with overweight or obesity, and type 2 diabetes | n=1210, 68 wk, ITT. 2.4 mg **−9.6% vs −3.4%** (ETD −6.2 pp; CI −7.3 to −5.2; P&lt;0.0001). ≥5% 68.8% vs 28.5%. GI 63.5% / 57.5% / 34.3%. Davies esearch included this id. |
| PMID 33625476 STEP 3 NCT03611582 | Effect of Subcutaneous Semaglutide vs Placebo as an Adjunct to Intensive Behavioral Therapy… (STEP 3) | n=611, 68 wk. −16.0% vs −5.7% (difference −10.3 pp; CI −12.0 to −8.6; P&lt;0.001). ≥5/10/15% 86.6/75.3/55.8 vs 47.6/27.0/13.2. GI 82.8% vs 63.2%; GI d/c 3.4% vs 0%. Wadden esearch included this id. |
| PMID 28110911 SUSTAIN 1 NCT02054897 | Efficacy and safety of once-weekly semaglutide monotherapy versus placebo… (SUSTAIN 1) | Esearch count 1. mITT 387/388; 30 wk. HbA1c **−1.45% / −1.55% vs −0.02%**. Weight −3.73 / −4.53 kg vs −0.98 kg. Nausea 20%/24% vs 8%; diarrhea 13%/11% vs 2%. Not a 1.0–1.8% programme range. |

PIONEER / oral / Rybelsus: not fetched. Not quoted as results.

## File

- `src/content/comparisons/ozempic-vs-wegovy.mdx`
  - Stripped census FAQ (Semaglutide vs Semaglutide; 67 sources / 52 human), consult-combination, invented SUSTAIN 1–5 1.0–1.8% A1C row, SUSTAIN 7 without fetch, 26% MACE, 20% MACE, STEP rows without placebo, unfetched FDA years / indication / pediatric / insurance / shortage tables, unmatched boxed-warning list.
  - Kept both `peptideA` and `peptideB` as `semaglutide`. Did not invent two molecules.
  - Quoted SUSTAIN-1 mITT HbA1c with placebo. Quoted SUSTAIN-6 HR 0.74 (6.6% vs 8.9%) with the noninferiority P. Did not headline 26%.
  - Quoted STEP 1 treatment-policy **−14.9% vs −2.4%**. Quoted STEP 2 and STEP 3 with placebo.
  - Quoted SELECT HR 0.80 (6.5% vs 8.0%). Did not headline 20%.
  - Named PIONEER / Rybelsus only as not fetched / not this page. No oral percent pasted.
  - Linked `/peptides/semaglutide`, `/compare/ozempic-vs-mounjaro`, `/compare/wegovy-vs-zepbound` (no trailing slash). Did not open those files.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (195 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs` site scan: PASS. `qa-comparison-counts.mjs`: exit 0 (24 pre-existing amycretin-stub WARNs; this file not in that list). Select-String battery: census FAQ / Consult / Who Might / 26% / 20% / unescaped `P<` / trailing-slash hrefs = 0 on this file. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch TICK39 `ozempic-vs-mounjaro.mdx`, TICK40 `amycretin-vs-vk2735.mdx`, TICK41 `amycretin-vs-cagrilintide.mdx`, TICK38 `maritide-vs-semaglutide`, TICK37 `cagrisema-vs-semaglutide`, TICK32 `wegovy-vs-zepbound`, TICK36 `tirzepatide-vs-semaglutide`, TICK26 KEEP `maritide-vs-tirzepatide`, TICK35–36 / TICK27–33 awaiting-Judge files, tesamorelin / 5-amino-1mq / AOD-9604 compares, or `src/content/peptides/**`.
- Did not restore OSA 63%/6%, TRIUMPH 28.7%, REDEFINE 22.7/15.7, SURMOUNT-1 over 60%, or a SUSTAIN 1–5 range as a result.
- Did not fetch SUSTAIN 7, STEP 4, PIONEER, or an FDA-label year.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `ozempic-vs-wegovy.mdx` same-molecule census FAQ (67/52) and invented SUSTAIN / MACE percents stripped.
2. Same molecule kept: both brands are semaglutide. Not two drugs.
3. STEP 1 quoted as treatment-policy −14.9% vs −2.4% (PMID 33567185).
4. SUSTAIN-6 quoted as HR 0.74 (6.6% vs 8.9%); P is noninferiority, not a 26% headline (PMID 27633186).
5. SELECT quoted as HR 0.80 (6.5% vs 8.0%), not a 20% MACE headline (PMID 37952131).
6. No PIONEER / Rybelsus percent. No source census. No $1,000 row added or stripped. Links match getStaticPaths with no trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. tesamorelin / 5-amino-1mq / AOD-9604 left for a later tick.

## Blockers

- None for this file. Judge (not this implementer) owns KEEP/REVERT.
- TICK6-PRICE still blocked on Lucas.
- W3-M1 OAuth still blocked.
