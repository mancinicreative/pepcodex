# TICK37 — implementer note (not a KEEP)

Loop: L4 cited-only on `cagrisema-vs-semaglutide.mdx`. Census FAQ stub (14/6 vs 67/52) plus combination/overdose voice. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned prefer. File was a generated census stub (`lastUpdated` 2026-02-12): FAQ source counts, “Phase 3 validated” FDA weasel, and “Do not use concurrently / overdose.” No invented 22.7 / 15.7 / 23–25.5 rows were present to strip. Locked TICK19–25 KEEP files, TICK30/32/33/35/36 Judge-pending compares, `cagrisema-vs-tirzepatide.mdx`, and `src/content/peptides/**` not reopened.

## Fetched this increment (2026-09-02)

Commands: `node .planning\seo-engine\runs\2026-09-01\_tick37-fetch.mjs` then `_tick37-fetch2.mjs` then `_tick37-fetch3.mjs`. Per-alias esearch (not OR-joined). NCBI efetch STATUS 200. CT.gov v2 STATUS 200 (full study after a fields= 400). openFDA drugsfda STATUS 404 (cagrilintide) / 200 (semaglutide brand queries). Title-matched.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40544433 REDEFINE 1 NCT05567796 | Coadministered cagrilintide and semaglutide in adults with overweight or obesity | n=3417; 68 wk; 21:3:3:7 (2108 / 302 / 302 / 705). **Treatment-policy.** CagriSema −20.4% vs −3.0% (ETD −17.3; CI −18.1 to −16.6; P&lt;0.001). Semaglutide-alone arm named (n=302); **abstract does not publish that arm’s percent**. Responder 5/20/25/30% “more likely”; **no percents**. GI 79.6% vs 39.9%. No 22.7. |
| PMID 33567185 STEP 1 NCT03548935 | Once-weekly semaglutide in adults with overweight or obesity | n=1961; 68 wk; no T2D. **Treatment-regimen** (effects regardless of discontinuation or rescue). −14.9% vs −2.4% (ETD −12.4; CI −13.4 to −11.5; P&lt;0.001). ≥5/10/15%: 86.4/69.1/50.5 vs 31.5/12.0/4.9. GI d/c 4.5% vs 0.8%. |
| NCT06131437 | CagriSema 2.4/2.4 vs tirzepatide 15 mg | COMPLETED. Enrollment 809 actual. Phase 3, randomised, parallel, **masking NONE**. Primary = confirm non-inferiority, relative weight, week 0–84. hasResults **false**. CT.gov acronym field empty. PubMed `NCT06131437` / `"REDEFINE 4" cagrilintide tirzepatide` / `"REDEFINE-4" cagrilintide` = **0**. |
| openFDA drugsfda | generic_name / products.brand_name | Cagrilintide: NOT_FOUND. Semaglutide: NDA 209637 (Ozempic); NDA 213051 (Ozempic/Rybelsus listing); NDA 213182 (Rybelsus); NDA 215256 (Wegovy); NDA 218316 (Wegovy). |

Esearch `"CagriSema"` count 70 — not dumped into the page. Esearch `"REDEFINE 1" AND cagrilintide` count 1 (40544433). A STEP 1 full-title esearch degraded to 554,137 hits and was **not** used; authorship is the PMID 33567185 efetch.

## File

- `src/content/comparisons/cagrisema-vs-semaglutide.mdx`
  - Stripped census FAQ (14/6 vs 67/52), Evidence/Key Differences source-count tables, “Phase 3 validated,” and combination/overdose advice.
  - Quoted REDEFINE 1 treatment-policy −20.4% vs −3.0% with placebo, ETD, CI. Escaped P&lt;. Named the semaglutide-alone arm without inventing its percent.
  - Quoted STEP 1 treatment-regimen −14.9% vs −2.4% with responder cuts and GI discontinuations.
  - Dated NCT06131437 absence (vs tirzepatide, not this pair) without a percent.
  - Linked `/peptides/cagrisema`, `/peptides/semaglutide`, `/compare/cagrisema-vs-tirzepatide` (no trailing slash).
  - **Did not** add or strip a ~$1,000/month row (none present; TICK6-PRICE still waiting).
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF.

## Checks run (not a KEEP)

- `node scripts/qa-medical-advice.mjs --strict` → PASS (sitewide; this file not flagged).
- `node scripts/qa-comparison-counts.mjs --strict` → FAIL 28 mismatches on **other** compares; this filename not in the list.
- Did not run `astro build`.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `tirzepatide-vs-semaglutide.mdx`, `wegovy-vs-zepbound.mdx`, `mazdutide-vs-semaglutide.mdx`, `maritide-vs-semaglutide.mdx`, `vk2735-vs-semaglutide.mdx`, `cagrilintide-vs-semaglutide.mdx`, `cagrilintide-vs-tirzepatide.mdx`, `cagrisema-vs-tirzepatide.mdx`, KEEP ticks 19/21/23/24/25, or `src/content/peptides/**`.
- Did not quote REDEFINE 2 PMID 40544432 or SELECT PMID 37952131 (not in this brief; not fetched for authorship).
- Did not quote a CagriSema-versus-semaglutide difference from the two placebo-controlled rows.
- Did not fetch Drugs@FDA HTML overview pages (openFDA API used).
- W3-M1 OAuth.
