# L4-TICK28 — Quality Judge, iter1

**Loop:** L4-TICK28 — `src/content/comparisons/survodutide-vs-semaglutide.mdx`
**Judge:** independent (did not write the increment). **Date:** 2026-09-02.
**Implementer note:** `.planning/seo-engine/runs/2026-09-01/TICK28.md` (explicitly not a KEEP).

## Must-fail scan (live file + `git diff HEAD`)

| Fail condition | Result | Evidence |
|---|---|---|
| SYNCHRONY (wrong family) | **absent — PASS** | grep `SYNCHRONY` = 0 hits; CT.gov NCT06066515 acronym is `SYNCHRONIZE™-1` |
| Unsourced 48-wk ~18.7/~19.5 or ~18–19% | **removed — PASS** | diff removed `-| **Weight Loss** | ~18-19% | ~15% |`; body now states "This page does not quote an unfetched 48-week percent table." Phase 2 quoted as **46 wk** (correct per abstract) |
| "83% MASH" unsourced headline | **removed — PASS** | diff removed FAQ answer "up to 83% MASH resolution" and table row `| **MASH Resolution** | Up to 83% (highest dose) |` |
| SELECT "20% MACE" headline | **removed — PASS** | diff removed "SELECT trial showing 20% MACE reduction"; body now HR 0.80 (6.5% vs 8.0%) |
| Census FAQ | **removed — PASS** | FAQ now: "This page does not quote a live source census." (disavowal, not a count) |
| Unresolved PMIDs/NCTs | **none — PASS** | all 7 PMIDs + 3 NCTs independently re-fetched 2026-09-02 (below); `qa-pmids --strict` PASS |
| Trailing-slash compare links | **none — PASS** | only in-page link is `/compare/survodutide-vs-tirzepatide`; target `.mdx` exists; route `src/pages/compare/[...slug].astro` maps `comparison.slug` — mirrors getStaticPaths |
| Dosing / purchasing / medical advice | **none — PASS** | grep clean; diff removed "Consult a healthcare provider"; `qa-medical-advice --strict` PASS (932 files) |
| Implementer self-KEEP | **none — PASS** | note header: "implementer note (not a KEEP)"; no TICK28 KEEP found in run dir |

## Independent re-fetch (commands actually run, 2026-09-02)

```
curl.exe eutils efetch db=pubmed rettype=abstract retmode=text for ids
  42253238, 33567185, 37952131, 38847460, 38330987, 38095657, 42252333
curl.exe clinicaltrials.gov/api/v2/studies/{NCT06066515,NCT06309992,NCT06632457}
curl.exe api.fda.gov/drug/drugsfda.json (survodutide ingredient; NDA213051)
node scripts/qa-pmids.mjs --strict
node scripts/qa-medical-advice.mjs --strict
node scripts/qa-claim-consistency.mjs
node scripts/validate-cross-links.mjs
```

Artifacts: `judge/_jfetch-<pmid>.txt`, `_jfetch-NCT*.json`, `_jfetch-fda-*.json|txt`.

| Id | Topical match | Page quote vs fetched abstract |
|---|---|---|
| PMID 42253238 SYNCHRONIZE-1 (NEJM 2026) | "Survodutide Once Weekly for the Treatment of Adults with Obesity" | n=725 (241/242/242), 76 wk, treatment-regimen −12.2% (−13.6 to −10.8) / −13.0% (−14.4 to −11.6) vs −5.4% (−6.9 to −4.0); ≥5% 72.6/71.9/46.3 (P<0.001); GI 80.9/89.7/47.9; no deaths — **exact** |
| PMID 33567185 STEP 1 (NEJM 2021) | "Once-Weekly Semaglutide in Adults with Overweight or Obesity" | n=1961, 68 wk, treatment-regimen −14.9% vs −2.4%, ETD −12.4 (−13.4 to −11.5); 86.4/69.1/50.5 vs 31.5/12.0/4.9; GI d/c 4.5% vs 0.8% — **exact** |
| PMID 37952131 SELECT (NEJM 2023) | "Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes" | 569/8803 (6.5%) vs 701/8801 (8.0%); HR 0.80 (0.72–0.90; P<0.001); d/c 16.6% vs 8.2%; 39.8 mo — **exact**; no "20%" anywhere |
| PMID 38847460 MASH ph2 (NEJM 2024) | "A Phase 2 Randomized Trial of Survodutide in MASH and Fibrosis" | 293 treated, 48 wk; 47/62/43% vs 14% (P<0.001 quadratic); LFC 63/67/57 vs 14; fibrosis 34/36/34 vs 22; nausea 66 vs 23 — **exact**; abstract contains no resolution percent (83% correctly not re-introduced) |
| PMID 38330987 ph2 obesity (Lancet D&E 2024) | dose-finding phase 2, NCT04667377 | 387 enrolled / 386 treated; **46 weeks**; planned-treatment −6.2/−12.5/−13.2/−14.9% vs −2.8%; GI 75% vs 42% — **exact** |
| PMID 38095657 T2D (Diabetologia 2024) | survodutide vs placebo + open-label semaglutide, NCT04153929 | 413 randomised; 16 wk; semaglutide 1.0 mg open-label; HbA1c DG1–DG6 −0.91/−1.46/−1.71/−1.56/−1.63/−1.68%; sema −1.47%; BW −8.7% (DG6) vs −5.3%; AE 77.8/52.5/52.0% — **exact** |
| PMID 42252333 SYNCHRONIZE-MASLD (Nat Med 2026) | title names SYNCHRONIZE-MASLD | n=216, 48 wk; **treatment-regimen leads** 68.5% vs 28.6% and −8.7% vs −1.4%; efficacy estimand labelled 84.2% vs 24.3% and −12.2% vs −1.0% — **exact, estimand order correct** |
| NCT06066515 | acronym `SYNCHRONIZE™-1` | COMPLETED, enrollment 726 actual, hasResults false — **exact** |
| NCT06309992 | briefTitle "(SYNCHRONIZE-MASLD)" | COMPLETED, 218 actual, hasResults false — **exact** |
| NCT06632457 (LIVERAGE) | "LIVERAGE™ - Cirrhosis" | RECRUITING, 1590 estimated — page disavowal ("separate recruiting cirrhosis trial (estimated enrollment 1590)") **accurate** |
| openFDA drugsfda | survodutide → HTTP 404 NOT_FOUND; NDA213051 products list OZEMPIC + RYBELSUS | page claims match fetched record, dated 2026-09-02 — **exact** |

## Gates

- `qa-pmids --strict`: **PASS** — 1313 PMIDs / 558 NCTs / 581 DOIs resolve.
- `qa-medical-advice --strict`: **PASS** — no instructional voice (932 files).
- `qa-claim-consistency`: exit 0. Near-miss notes on this file (14.9%, 2.4%, 95%) are informational; 14.9% coincidence is real in both source papers (STEP 1 semaglutide and survodutide ph2 4.8 mg), both verified above.
- `validate-cross-links`: **PASS** — 0 errors / 3766 refs.
- Schema: `sources[]` entries conform to `sourcesArray` in `src/content/config.ts` (`type: journal`, `pmid`, `verifiedAt` valid).
- CRLF: 188 CRLF / 0 LF-only (matches claim). `P&lt;0.001` escaped; no raw `P<0`.
- Scope: increment diff is this one file (+141/−79). Other dirty content files belong to other TICKs, out of scope here.

## Gaming check

The cheap way to "pass" this loop would be swapping unsourced numbers for fetched-but-mismatched ones, headlining the sponsor efficacy estimand, or leaving disavowals while keeping the old headlines in a table. None of that happened: every quoted figure was reproduced digit-for-digit from my own efetch/CT.gov/openFDA calls this session; treatment-regimen leads in SYNCHRONIZE-1, STEP 1, and SYNCHRONIZE-MASLD with the efficacy estimand explicitly labelled; the LIVERAGE disavowal is itself factually correct; absences are window-dated ("fetched 2026-09-02", "This increment did not retrieve a Wegovy row"). Residual cosmetic nit, not a fail: FAQ answers lean meta ("This page does not quote a live source census") — honest but written for the audit trail more than the reader; a future pass could phrase them reader-first without re-introducing a census. Wegovy absence is honestly disclosed rather than guessed.

## Verdict: **KEEP**

Every must-fail condition is clean, all 10 identifiers topical-match with exact numeric agreement, all four gates pass, and the increment is scoped to the assigned file. No revert, no retry.
