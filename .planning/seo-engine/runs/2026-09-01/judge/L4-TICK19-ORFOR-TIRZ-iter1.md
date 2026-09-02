# L4-TICK19-ORFOR-TIRZ — Quality Judge, iter1

**Verdict: KEEP**

Increment: `src/content/comparisons/orforglipron-vs-tirzepatide.mdx` (uncommitted diff vs HEAD: +72/−119).
Implementer note: `../TICK19-ORFOR-TIRZ.md`. Judge is not the author. Judged 2026-09-02.

## Independent fetches (judge-run, not trusted from implementer)

| # | Command (2026-09-02) | Result |
|---|---|---|
| 1 | `node .planning/seo-engine/runs/2026-09-01/judge/_tick19-efetch.mjs` (efetch XML, PMIDs 40960239 / 37351564 / 35658024) | All 3 resolve, NEJM, topical-match |
| 2 | `node -e "fetch(...efetch id=35658024...)"` — NCT grep | `NCT04184622` present; `SURMOUNT-1` named 2x |
| 3 | `curl.exe "https://api.fda.gov/drug/drugsfda.json?search=application_number:%22NDA220934%22&limit=1"` → `_tick19-fda2.json` | NDA220934, ELI LILLY, brand FOUNDAYO, generic ORFORGLIPRON; **ORIG 1, AP, 20260401**; SUPPL 3 AP 20260804 (labeling) |
| 4 | `node scripts/qa-medical-advice.mjs --strict` | PASS, 932 files, no instructional voice |
| 5 | `node scripts/qa-claim-consistency.mjs` | Touched file not flagged (near-misses are SYNCHRONIZE-1/OASIS-1 in other files) |
| 6 | `git diff HEAD -- src/content/comparisons/orforglipron-vs-tirzepatide.mdx` | Removed-content claims verified below |

Note: `products.application_number:"NDA220934"` returns NOT_FOUND (nested-field quirk); top-level `application_number` query resolves. The page's cited URL form (`openfda.generic_name:orforglipron`) is valid openFDA syntax; the identifier itself is what was verified.

## Criterion-by-criterion (LOOPS.md L4 + brief fail-list)

1. **Overturned phase-2 table (36 mg −9.4% / 45 mg −10.1% / HbA1c −1.6%) as headline — PASS (absent).**
   Diff shows the old `| 36mg | ~9.4% | / | 45mg | ~10.1% |` table deleted. Live text: "Week 36 mean change ranged from −9.4% to −14.7% vs −2.3% placebo. Week 26 (primary) ranged from −8.6% to −12.6% vs −2.0% placebo." PMID 37351564 abstract verbatim: "At week 36, the mean change ranged from -9.4% to -14.7% ... -2.3% with placebo. At week 26 ... -8.6% to -12.6% ... -2.0%." Page line "The abstract publishes a range, not a 36 mg vs 45 mg split" is accurate. No HbA1c figure anywhere.

2. **ATTAIN-1 numbers — PASS.** Page: "n=3127; 72 weeks; treatment-regimen estimand. −7.5% (6 mg), −8.4% (12 mg), −11.2% (36 mg) vs −2.1% placebo (P&lt;0.001). ≥10/15/20% at 36 mg: 54.6/36.0/18.4 vs 12.9/5.9/2.8. AE d/c 5.3–10.3% vs 2.7%." PMID 40960239 abstract matches digit-for-digit, incl. "treatment-regimen estimand" and NCT05869903. `<` escaped as `&lt;`.

3. **SURMOUNT-1 numbers — PASS.** Page: "n=2539; 72 weeks; treatment-regimen. −15.0/−19.5/−20.9% vs −3.1%. ≥20%: 50% (10 mg), 57% (15 mg; 95% CI 53–61) vs 3%. AE d/c 4.3/7.1/6.2/2.6." PMID 35658024 abstract matches exactly, incl. NCT04184622 (judge fetch #2).

4. **Estimand — PASS.** Both phase-3 leads labeled treatment-regimen, matching abstracts. No efficacy-estimand headlined. Phase 2 claims no estimand.

5. **Foundayo regulatory claim — PASS.** Page: "NDA 220934 ORIG 1 AP 2026-04-01 (Drugs@FDA accessed 2026-09-02)." openFDA (fetch #3): ORIG 1, submission_status AP, submission_status_date 20260401, brand FOUNDAYO, sponsor Eli Lilly. "Tablet strengths are not copied from the API" — accurate restraint (6 strengths exist; page omits them).

6. **Invented head-to-head percents — PASS (absent).** Old metaDescription "Head-to-head evidence comparison" replaced with "Cross-trial comparison ... Not a head-to-head RCT." Old "Key point: Tirzepatide shows greater weight loss, likely due to dual agonism" and "~10% vs ~20%+" summary deleted. Live page disclaims head-to-head in summary, Overview, and Key Takeaways #1.

7. **Unpublished results — PASS.** All three papers published NEJM (2025/2023/2022). No press-release numbers.

8. **Unresolved identifiers — PASS.** PMIDs 40960239, 37351564, 35658024 resolve and topical-match (titles contain orforglipron/tirzepatide). NCT05869903, NCT05051579, NCT04184622 each appear inside their cited PMID's record. NDA220934 resolves. No sibling-trial mixup (ATTAIN-1 vs ATTAIN class, SURMOUNT-1 vs -2) — each NCT sits in its own paper's abstract.

9. **Trailing-slash / false links — PASS.** Only one body link: `/compare/orforglipron-vs-semaglutide` — no trailing slash; target `src/content/comparisons/orforglipron-vs-semaglutide.mdx` exists; route mirrors `getStaticPaths` in `src/pages/compare/[...slug].astro` (`params: { slug: comparison.slug }`).

10. **Dangling citation IDs — PASS.** Body cites `[attain-1-pmid-40960239]`, `[orforglipron-p2-pmid-37351564]`, `[surmount-1-pmid-35658024]`, `[drugsfda-nda-220934]`; all four defined in frontmatter `sources:`.

11. **Banned content — PASS.** `qa-medical-advice --strict` clean. Old "Consult a qualified healthcare provider before considering any peptide regimen" FAQ deleted. No dosing protocol, no purchasing guidance. Trial-dose mentions are trial-design reporting. ~$1,000+/month price row retained — **explicitly not a fail condition** (TICK6-PRICE blocked on Lucas).

12. **Census/memory claims — PASS.** Old "37 sources (28 human studies) / 76 sources (68 human studies)" FAQ replaced with "This page does not quote a live source census." Old indication lists ("T2D, obesity, obstructive sleep apnea" / "chronic weight management only") replaced with "Labeled indication lists are not copied from memory."

13. **Identifiers not fetched this run — PASS.** Implementer note lists exactly the 4 fetches; judge re-fetched all 4 independently. No extra IDs introduced.

14. **Self-KEEP — PASS (absent).** Implementer note header: "implementer note (not a KEEP)". `LOOP-TASKS.md` contains no TICK19 entry. No self-stamp.

15. **Window-scoped absence — PASS.** "There is no published clinical data on using orforglipron and tirzepatide together" is a combination-absence claim, not a windowed-scan claim; no undated "no publication found" tied to a scan window.

## Gaming check

The implementer cited only the four identifiers they fetched, and the judge's independent re-fetch reproduces every number on the page digit-for-digit — the note's fetch table is honest, not decorative. No estimand swap: both phase-3 headlines are treatment-regimen, matching the abstracts, and the old efficacy-flavored cross-trial ranking ("Tirzepatide shows greater weight loss, likely due to dual agonism") was deleted rather than re-labeled. The banned phase-2 percents are not repeated inside the disavowal — the disavowal ("The abstract publishes a range, not a 36 mg vs 45 mg split") names no numbers, and −9.4% appears only as the published range floor. The one retained soft spot, the ~$1,000+/month tirzepatide price row, is carried under an explicit Lucas-blocked ticket and was excluded from this loop's fail conditions by the Conductor. No metric-gaming detected.

## Verdict

**KEEP.** All 15 criteria PASS with independently fetched evidence. No revert, no retry. Conductor may stamp LOOP-TASKS against this file.

Judge artifact: `.planning/seo-engine/runs/2026-09-01/judge/L4-TICK19-ORFOR-TIRZ-iter1.md`
Fetch evidence: `_tick19-efetch.mjs`, `_tick19-fda.json` (NOT_FOUND quirk), `_tick19-fda2.json` (NDA220934 record).
