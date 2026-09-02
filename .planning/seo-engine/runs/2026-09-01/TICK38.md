# TICK38 — implementer note (not a KEEP)

Loop: L4 cited-only on `maritide-vs-semaglutide.mdx`. Census FAQ (21/10 vs 67/52), invented study-count tables, wrong “both GLP-1 agonists” combination FAQ, consult footer. Re-fetch authentic maridebart (do not copy TICK26). Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned file present. Locked TICK19–36 / TICK26 / TICK32 / TICK35 / TICK36 / TICK37 compares and `src/content/peptides/**` not opened this increment.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\peptides\maritide.mdx
Test-Path src\content\peptides\semaglutide.mdx
Test-Path src\content\comparisons\maritide-vs-tirzepatide.mdx
node .planning\seo-engine\runs\2026-09-01\_tick38-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick38-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick38-fetch3.mjs
node .planning\seo-engine\runs\2026-09-01\_tick38-fetch4.mjs
node scripts\qa-medical-advice.mjs
node scripts\qa-comparison-counts.mjs
node scripts\qa-banned-content.js src\content\comparisons\maritide-vs-semaglutide.mdx
```

Per-alias esearch (not OR-joined). NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (maridebart / maritide) / 200 (semaglutide). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

First-pass NCBI title esearch failed (network); retry in fetch2 STATUS 200. Enrollment lives on `designModule.enrollmentInfo`, not `statusModule`.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40549887 NCT05669599 | Once-Monthly Maridebart Cafraglutide for the Treatment of Obesity - A Phase 2 Trial | n=592 (obesity 465; obesity-diabetes 127); 52 wk. **Treatment-policy (ITT).** Mechanism: “GLP-1 receptor agonism and GIP receptor antagonism” (not a dual agonist). Obesity −12.3% (CI −15.0 to −9.7) to −16.2% (CI −18.9 to −13.5) vs −2.5% (CI −4.2 to −0.7). T2D −8.4% to −12.3% vs −1.7%. HbA1c −1.2 to −1.6 vs 0.1 pp. Abstract **range only**, no per-arm table. GI common; no nausea %. CT.gov COMPLETED; enroll 592 actual; hasResults **false**. |
| PMID 38316982 NCT04478708 | GIPR antagonist conjugated to GLP-1 analogues … phase 1 | Acceptable safety; weight loss increased across ascending arms; MAD maintained up to 150 days after last administration. **Abstract does not publish a percent.** CT.gov COMPLETED; enroll 110 actual; hasResults true (results module not quoted). |
| PMID 33567185 NCT03548935 STEP 1 | Once-Weekly Semaglutide in Adults with Overweight or Obesity | n=1961; 68 wk; no diabetes. **Treatment-regimen** (regardless of discontinuation or rescue). **−14.9% vs −2.4%** (ETD −12.4 pp; 95% CI −13.4 to −11.5; P&lt;0.001). ≥5/10/15%: 86.4 / 69.1 / 50.5 vs 31.5 / 12.0 / 4.9. GI d/c 4.5% vs 0.8%. CT.gov COMPLETED; enroll 1961 actual; hasResults true. |
| PMID 37952131 NCT03574597 SELECT | Semaglutide and CV outcomes in obesity without diabetes | n=17,604. Primary MACE 569/8803 (**6.5%**) vs 701/8801 (**8.0%**); **HR 0.80** (0.72–0.90); P&lt;0.001. Follow-up 39.8 mo. AE d/c 16.6% vs 8.2%. Not a rounded relative-risk headline. CT.gov COMPLETED; enroll 17604 actual; hasResults true. |
| NCT06858839 MARITIME-1 | Phase 3 obesity, no T2D | ACTIVE_NOT_RECRUITING. Enrollment 3853 actual. Primary = % weight change week 72. hasResults **false**. PubMed `NCT06858839` / `"MARITIME-1"` = **0**. |
| NCT06858878 MARITIME-2 | Phase 3 obesity + T2D | ACTIVE_NOT_RECRUITING. Enrollment 1105 actual. Primary = % weight change week 72. hasResults **false**. PubMed `NCT06858878` / `"MARITIME-2"` = **0**. |
| openFDA drugsfda | generic_name / brand queries | Maridebart and maritide: **NOT_FOUND**. Semaglutide: NDA 209637 Ozempic ORIG AP 20171205; NDA 215256 Wegovy ORIG AP 20210604; NDA 218316 Wegovy tablets ORIG AP 20251222; NDA 213051 Rybelsus/Ozempic listing ORIG AP 20190920. |

Esearch `"maridebart cafraglutide"[Title]` count **5** (40549887 plus letters/reviews 42592044, 41337722–24; reviews/letters not used as efficacy). `"MariTide"[Title]` count **0**. `"MARITIME-1"[Title]` / `"MARITIME-2"[Title]` count **0**. `"MARITIME-1" maridebart` / `"MARITIME-2" maridebart` count **0**.

## File

- `src/content/comparisons/maritide-vs-semaglutide.mdx`
  - Stripped census FAQ (21/10 vs 67/52 Moderate/High), Human Studies / Total Sources tables, consult footer, “both are GLP-1 receptor agonists” combination FAQ, memory indication list (T2D / obesity / CV / MASH).
  - Corrected mechanism from PMID 40549887: GLP-1 agonist + GIP antagonist, not a dual agonist.
  - Quoted Phase 2 treatment-policy range with placebo (obesity and obesity-diabetes). Escaped P&lt;.
  - Quoted Phase 1 as no-percent after this-run fetch.
  - Quoted STEP 1 treatment-regimen **−14.9% vs −2.4%**. Quoted SELECT **HR 0.80** (6.5% vs 8.0%); did not headline 20%.
  - Dated MARITIME-1/-2 absences (hasResults false; PubMed 0) without a Phase 3 percent.
  - Linked `/peptides/maritide`, `/peptides/semaglutide`, `/compare/maritide-vs-tirzepatide` (no trailing slash). Did not edit the locked tirzepatide twin.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (197 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS (after dropping the word `dose`). `qa-medical-advice.mjs` site scan: PASS. `qa-comparison-counts.mjs`: no row for this file (census tables gone); remaining WARNs are amycretin pages, not this increment. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked compares (`mazdutide-vs-semaglutide`, `cagrisema-vs-semaglutide`, `tirzepatide-vs-semaglutide`, `wegovy-vs-zepbound`, `maritide-vs-tirzepatide`, TICK19–36 KEEP/awaiting-Judge files) or `src/content/peptides/**`.
- Did not restore TRIUMPH, OSA 63%, or REDEFINE 22.7%. Did not repeat those percents in disavowal sentences.
- Did not quote a Phase 1 or Phase 3 percent.
- Did not quote MARITIME-2-EXTENSION (NCT07684144) or MARITIME-SWITCH (NCT07575399) beyond the search hit; individual records for those two were not fetched for quoting.
- W3-M1 OAuth.
- TICK6-PRICE.

## 8-line summary

1. Assigned compare cleaned; census FAQs (21/10 vs 67/52), study-count tables, consult, and “both GLP-1 agonists” combination FAQ stripped.
2. Phase 2 treatment-policy obesity **−12.3% to −16.2% vs −2.5%** at 52 weeks; range only (PMID 40549887).
3. Mechanism quoted as GLP-1 agonism + GIP antagonism, not a dual agonist (same paper).
4. STEP 1 quoted as treatment-regimen **−14.9% vs −2.4%** (PMID 33567185).
5. SELECT quoted as **HR 0.80** (6.5% vs 8.0%), not a relative-risk headline (PMID 37952131).
6. MARITIME-1 (NCT06858839) and MARITIME-2 (NCT06858878) `hasResults` false and PubMed 0 as of 2026-09-02; design only.
7. Maridebart/maritide openFDA 404; semaglutide NDAs 209637 / 213051 / 215256 / 218316 fetched. Links without trailing slash. CRLF. P&lt; escaped. No $1,000 row added or stripped.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
