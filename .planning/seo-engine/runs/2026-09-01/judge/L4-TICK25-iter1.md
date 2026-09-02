# Judge — L4-TICK25-iter1 — KEEP

**Loop:** L4-TICK25 · **File:** `src/content/comparisons/retatrutide-vs-survodutide.mdx` · **Judge date:** 2026-09-02 · **Verdict: KEEP**

I did not write this increment. I did not read the implementer's fetch artifacts as evidence; I wrote and ran my own fetch (`_judge-tick25-fetch.mjs` / `.json`, this folder) hitting NCBI efetch, CT.gov v2, and openFDA directly.

## Commands actually run (2026-09-02)

```
node .planning\seo-engine\runs\2026-09-01\_judge-tick25-fetch.mjs
node -e "<print RESULTS sections of PMIDs 42253238 / 38847460 / 42252333 from _judge-tick25-fetch.json>"
node -e "<openFDA drugsfda for retatrutide + survodutide; esearch TRIUMPH-1[Title] AND retatrutide; TRIUMPH[Title] AND retatrutide>"
Select-String -Path src\content\comparisons\retatrutide-vs-survodutide.mdx -Pattern "SYNCHRONY","83%","28.7","18.7","19.5","~22","~24","census","consult","/compare/","/peptides/"
```

(The Grep tool returned false negatives on this file; banned-pattern scan done with Select-String.)

## Independent fetch evidence

| Id | Topical title match | Numbers on page vs fetched abstract/registry |
|---|---|---|
| PMID 37366315 | "Triple-Hormone-Receptor Agonist Retatrutide for Obesity - A Phase 2 Trial" (NEJM 2023) | n=338; primary 24 wk; 24 wk −7.2/−12.9/−17.3/−17.5 vs −1.6; 48 wk secondary −8.7/−17.1/−22.8/−24.2 vs −2.1; 12 mg ≥5/10/15% = 100/93/83 vs 27/9/2. **All verbatim.** Abstract names no estimand; page says so. |
| PMID 42253238 | "Survodutide Once Weekly for the Treatment of Adults with Obesity" (NEJM 2026, SYNCHRONIZE-1 Investigators) | n=725 (241/242/242); 76 wk; treatment-regimen −12.2% (−13.6 to −10.8) / −13.0% (−14.4 to −11.6) vs −5.4% (−6.9 to −4.0); ≥5% 72.6/71.9/46.3 P<0.001; GI 80.9/89.7/47.9; no deaths. **All verbatim.** |
| PMID 38847460 | "A Phase 2 Randomized Trial of Survodutide in MASH and Fibrosis" (NEJM 2024) | 293 treated; MASH improvement without fibrosis worsening 47/62/43% vs 14% (P<0.001 quadratic); ≥30% LFC 63/67/57 vs 14; fibrosis ≥1 stage 34/36/34 vs 22; nausea 66 vs 23, diarrhea 49 vs 23, vomiting 41 vs 4. **All verbatim.** No "83%" anywhere in this abstract — the old "83% MASH" was invented and is correctly gone. |
| PMID 42252333 | "Survodutide in adults with obesity and … MASLD: SYNCHRONIZE-MASLD … phase 3 trial" (Nat Med 2026) | n=216 (146 vs 70); 48 wk; treatment-regimen ≥30% LFC 68.5% vs 28.6%, weight −8.7% vs −1.4%; efficacy estimand 84.2% vs 24.3%, −12.2% vs −1.0% (all P<0.0001). **All verbatim; treatment-regimen leads, efficacy labelled.** |
| PMID 38330987 | Survodutide dose-finding phase 2 (Lancet Diabetes Endocrinol 2024) | 387 enrolled / 386 treated; **46 weeks**; planned-treatment −6.2/−12.5/−13.2/−14.9 vs −2.8; GI 75% vs 42%. **All verbatim.** |
| PMID 41090431 | TRIUMPH rationale-and-design (Diabetes Obes Metab 2026) | Four phase 3 studies, >5,800 participants, primary weight endpoint = % change; **no efficacy percent in abstract.** Page quotes design only. |
| NCT06309992 | CT.gov brief title: "…Survodutide… Obesity or Overweight and … NASH … (SYNCHRONIZE-MASLD)" | COMPLETED, enroll 218, hasResults false. Page's NCT is correct. |
| NCT06632457 | CT.gov brief title: "LIVERAGE™ - Cirrhosis … NASH/MASH Who Have Cirrhosis" | RECRUITING, enroll 1590. **Not** SYNCHRONIZE-MASLD; page correctly does not cite it. Sibling-trial mixup avoided. |
| NCT06066515 / NCT04881760 / NCT04667377 / NCT04771273 | SYNCHRONIZE-1 / retatrutide P2 / survodutide P2 / MASH P2 | Statuses, enrollments (726 / 338 / 387 / 295), hasResults flags match page statements. |
| openFDA drugsfda | `products.active_ingredients.name:retatrutide` / `:survodutide` | Both HTTP 404 (no application) on 2026-09-02 — page's dated claim holds. |
| PubMed esearch | `TRIUMPH-1[Title] AND retatrutide` → count 0; `TRIUMPH[Title] AND retatrutide` → 41090431, 38323122 | Page's dated absence claim is exact, including the search strings. |

## Pass/fail vs the must-fail list

1. **SYNCHRONY (wrong family)** — PASS. Absent from file.
2. **Unsourced 48-wk ~18.7/~19.5 or ~22/~24** — PASS. Absent. Every percent on the page traced verbatim to a fetched abstract above.
3. **"83% MASH"** — PASS. Absent. The one remaining "83%" (line 106) is the retatrutide 12 mg ≥15% weight-responder rate, verbatim from PMID 37366315 — different trial, different endpoint, sourced.
4. **TRIUMPH 28.7% as a result** — PASS. Absent. TRIUMPH is design-only with a dated (2026-09-02) absence and exact search strings; my esearch reproduced both counts.
5. **Census FAQ** — PASS. No FAQ quotes source counts. The only "census" hit (line 26) is the disavowal "This page does not quote a live source census."
6. **Unresolved PMIDs/NCTs** — PASS. 6/6 PMIDs efetch 200 with topical title match; 6/6 NCTs CT.gov 200 with matching titles. All 6 body citation ids map to `sources[]` entries with `verifiedAt: 2026-09-02`; no dangling ids.
7. **Trailing-slash compare links** — PASS. Line 83: `/peptides/retatrutide`, `/peptides/survodutide`, `/compare/tirzepatide-vs-retatrutide`, `/compare/survodutide-vs-tirzepatide` — no trailing slashes.
8. **Dosing / purchasing / medical advice** — PASS. No dose schedule, no sourcing language; the combination FAQ declines to recommend ("There is no published clinical data… does not recommend a combination").
9. **Implementer stamped their own KEEP** — PASS. TICK25.md header: "implementer note (not a KEEP)"; body: "Did not stamp KEEP."

## L4 judge-specific bars (LOOPS.md)

- Absence claims carry window dates (TRIUMPH 2026-09-02; openFDA 2026-09-02) — PASS.
- Efficacy estimand not headlined — SYNCHRONIZE-1 and SYNCHRONIZE-MASLD lead with treatment-regimen; efficacy estimand labelled; retatrutide P2 abstract names no estimand and the page discloses that — PASS.
- No sibling-trial mixup (LIVERAGE vs SYNCHRONIZE-MASLD correctly separated; SYNCHRONIZE-1 vs phase 2 46-wk correctly separated) — PASS.
- No fuzzy-title auto-attach; every identifier fetched this run — PASS.
- `P&lt;0.001` / `P&lt;0.0001` escaped in MDX — PASS.

## Gaming check

The plausible cheats here were: (a) swapping in real PMIDs while keeping the old invented numbers — refuted, every percent on the page appears verbatim in my independently fetched abstracts, including CIs and responder counts; (b) resurrecting the banned "83%" under a new label — the surviving 83% is a weight-responder figure from a different trial and matches the abstract, not a MASH claim; (c) quietly dropping the wrong-NCT problem — instead the page cites NCT06309992, which CT.gov confirms is SYNCHRONIZE-MASLD, while NCT06632457 is LIVERAGE-Cirrhosis; (d) paper-vs-registry enrollment gaps (725 vs 726; 216 vs 218) are disclosed inline rather than smoothed over. The page is somewhat heavy on meta-disavowal sentences ("This page does not quote/invent/restore…"), which is a style cost, not an integrity defect, and is the honest pattern for a cited-only leftover. No gaming detected.

## Verdict: KEEP

Residual notes for the Conductor (not this loop's failures): TICK13 residual on `liraglutide-vs-semaglutide.mdx` and the other unlocked leftovers listed in TICK25.md (`survodutide-vs-semaglutide`, `retatrutide-vs-semaglutide`, `cagrilintide-vs-semaglutide`, `wegovy-vs-zepbound`, I-06 leftover on `vk2735-vs-tirzepatide`) remain open work; TICK6-PRICE stays blocked on Lucas per instructions.
