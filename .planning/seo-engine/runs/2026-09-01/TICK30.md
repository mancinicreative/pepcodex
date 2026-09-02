# TICK30 — implementer note (not a KEEP)

Loop: L4 cited-only on `cagrilintide-vs-semaglutide.mdx`. Census FAQ + invented ~6%/~9%/~11%/~15–24% tables + false “no published combo data” + unpublished 2025–2026 / vs-tirzepatide claims. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned file. Live defects before this increment: census FAQ (34/27 vs 67/52 High/High); consult; false FAQ that no combination data exist; hedged monotherapy ~6/~9/~11 and CagriSema ~15–24%; STEP 1 extras without a labelled estimand; ~160/~165 h half-life; invented Common/Common GI table; CagriSema 2025–2026 timeline; “comparable to or exceeding tirzepatide”; “Ozempic/Rybelsus tablets” wording.

Locked TICK19/21/23–29 files, TICK22 KEEP `cagrilintide-vs-tirzepatide.mdx`, and `cagrisema-vs-tirzepatide.mdx` not opened. Peptide dossiers not opened.

## Fetched this increment (2026-09-02)

Commands: `node .planning\seo-engine\runs\2026-09-01\_tick30-fetch.mjs` then `_tick30-fetch2.mjs`.

Per-alias esearch (not OR-joined). NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (cagrilintide) / 200 (semaglutide brands). Title-matched before quoting.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 34798060 NCT03856047 | Once-weekly cagrilintide Phase 2 dose-finding | n=706; 26 wk. **Trial-product** 0.3–4.5 mg 6.0%–10.8% vs placebo 3.0% (ETD 3.0–7.8; P&lt;0.001). 4.5 mg 10.8% vs liraglutide 3.0 mg 9.0% (ETD 1.8; P=0.03). Treatment-policy: “similar”; **no separate percent table**. GI 41%–63% vs 32%; nausea 20%–47% vs 18%. Abstract does **not** publish a 1.2 / 2.4 mg row. |
| PMID 40544433 REDEFINE 1 NCT05567796 | Coadministered cagrilintide and semaglutide | n=3417; 68 wk. **Treatment-policy.** CagriSema −20.4% vs −3.0% (ETD −17.3; CI −18.1 to −16.6; P&lt;0.001). Arms include semaglutide 2.4 mg (n=302) and cagrilintide 2.4 mg (n=302); **abstract does not publish those arm percents**. GI 79.6% vs 39.9%. No 22.7 / 15.7 / 23–25.5. |
| PMID 33567185 STEP 1 NCT03548935 | Once-weekly semaglutide in overweight or obesity | n=1961; 68 wk; no T2D. **Treatment-regimen.** −14.9% vs −2.4% (ETD −12.4; CI −13.4 to −11.5; P&lt;0.001). ≥5/10/15%: 86.4/69.1/50.5 vs 31.5/12.0/4.9. GI d/c 4.5% vs 0.8%. |
| PMID 37952131 SELECT NCT03574597 | Semaglutide CV outcomes in obesity without diabetes | n=17604. 569/8803 (6.5%) vs 701/8801 (8.0%). **HR 0.80** (CI 0.72–0.90; P&lt;0.001). AE d/c 16.6% vs 8.2%. Mean follow-up 39.8 mo. |
| NCT06131437 | CagriSema vs tirzepatide | COMPLETED. Enrollment 809 actual. hasResults **false**. PubMed `NCT06131437` = **0**. CT.gov payload had no acronym field. |
| openFDA drugsfda | generic_name / products.brand_name | Cagrilintide: NOT_FOUND. Ozempic NDA 209637 SC solution. Rybelsus oral tablet. Wegovy NDA 215256 SC solution and NDA 218316 oral tablet. |

`"REDEFINE 4" cagrilintide` esearch count 5 — title-checked, none is NCT06131437 results: PMID 42503495 (REDEFINE 1 post hoc), 42009015 (REDEFINE 5), 41328546 (REDEFINE 1 BP), 40544432 (REDEFINE 2 T2D). Not quoted.

Esearch `cagrilintide` count 97 (2026-09-02). AM833 hits were unrelated old PMIDs.

## File

- `src/content/comparisons/cagrilintide-vs-semaglutide.mdx`
  - Stripped census FAQ (34/27 vs 67/52), consult, false “no published combo data,” ~6% / ~9% / ~11% / CagriSema ~15–24%, ~160/~165 h, invented GI Common table, CagriSema 2025–2026 timeline, “match or exceed tirzepatide,” “Ozempic tablets.”
  - Quoted Lau **trial-product** range with placebo and the labelled treatment-policy gap. Escaped P&lt;.
  - Quoted REDEFINE 1 as **combo vs placebo**, not monotherapy. Did not write 22.7 / 15.7 / 23–25.5 even as a disavowal.
  - Quoted STEP 1 treatment-regimen with placebo and responder cuts. Quoted SELECT HR 0.80 with event counts.
  - Dated NCT06131437 absence without a percent.
  - Linked `/peptides/cagrilintide`, `/peptides/semaglutide`, `/compare/cagrilintide-vs-tirzepatide`, `/compare/cagrisema-vs-tirzepatide` (no trailing slash).
  - No ~$1,000/month row on this page (TICK6-PRICE still waiting; nothing to strip).
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF.

Select-String battery (positive control `cagrilintide|STEP 1|SELECT|REDEFINE|−20.4|−14.9|6.0` = 52 lines): census FAQ strings, Consult, `~6%`/`~9%`/`~11%`/`~15`, `22.7`/`15.7`/`25.5`, `2025-2026`, TRIUMPH/OSA/LEADER/SCALE/MOMENTUM/SYNCHRONY, unescaped `<\d`, trailing-slash hrefs — all 0. CRLF_LINES=158 LF_ONLY=0.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `orforglipron-vs-tirzepatide.mdx`, `pemvidutide-vs-tirzepatide.mdx`, `tirzepatide-vs-retatrutide.mdx`, `pemvidutide-vs-semaglutide.mdx`, `retatrutide-vs-survodutide.mdx`, `maritide-vs-tirzepatide.mdx`, `amycretin-vs-semaglutide.mdx`, `survodutide-vs-semaglutide.mdx`, `vk2735-vs-tirzepatide.mdx`, `cagrilintide-vs-tirzepatide.mdx`, `cagrisema-vs-tirzepatide.mdx`, or `src/content/peptides/**`.
- Did not quote REDEFINE 5 PMID 42009015 or REDEFINE 2 PMID 40544432 (title-check only).
- Did not quote a cagrilintide-alone or semaglutide-alone percent from REDEFINE 1 (not in the abstract).
- Did not relabel Lau 6.0%–10.8% as treatment-policy; the abstract attaches that range to trial-product.
- W3-M1 OAuth.
- Remaining leftovers sit on locked/Judge-pending compares, not this file.
