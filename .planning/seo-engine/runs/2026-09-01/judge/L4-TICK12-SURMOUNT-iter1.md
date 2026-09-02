# L4-TICK12-SURMOUNT — Judge iter1 (Kimi K3, critic)

**Loop:** L4-TICK12-SURMOUNT, iteration 1
**File reviewed (in full):** `src/content/comparisons/cagrisema-vs-tirzepatide.mdx`
**Implementer note:** `.planning/seo-engine/runs/2026-09-01/TICK12-SURMOUNT.md` (explicitly "not a KEEP" — treated as claims to verify, not evidence)
**Brief:** `LOOP-TASKS.md` #### TICK12-SURMOUNT (TICK10 residual: SURMOUNT-2/3/4 + SURPASS-CVOT)
**Bar:** LOOPS.md L4 — numbers on the page match the cited paper's published estimand; no identifier introduced that was not fetched this run; no absence claim without a window date.

## Independent verification performed

- **efetch (this review, not the implementer's):** `efetch.fcgi?db=pubmed&id=37385275,37840095,38078870,41406444&rettype=abstract&retmode=text` — all four abstracts read in full.
- **Topical match:** PMID 37385275 = SURMOUNT-2 / NCT04657003 (Lancet 2023;402:613-626). PMID 37840095 = SURMOUNT-3 / NCT04657016 (Nat Med 2023;29:2909-2918). PMID 38078870 = SURMOUNT-4 / NCT04660643 (JAMA 2024;331:38-48). PMID 41406444 = SURPASS-CVOT / NCT04255433 (NEJM 2025;393:2409-2420). No sibling-trial or parent/derivative mixup.
- **CT.gov API v2 (this review):** NCT06131437 → overallStatus COMPLETED, enrollment 809 ACTUAL, masking NONE (open-label), `hasResults: false`. Matches every design claim on the page.
- **Select-String battery (Grep was not trusted — it false-negatived the positive control in this workspace):** positive control `SURMOUNT`/`CagriSema` = 53 lines. Banned `22.7`, `63%`, `28.7`, `TRIUMPH` = 0 hits. `<\d` (unescaped lt+digit) = 0 hits. FAQ census `14/6`, `76/68`, `14 of 6`, `76 of 68` = 0 hits. `2027` = 0 hits. `1,000` = 1 hit (Pricing row, line 215).
- **git:** `git diff --stat HEAD` → `1 file changed, 55 insertions(+), 63 deletions(-)` on the existing comparison file. Modification, not a new slug.

## Criteria

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| 1 | All four PMIDs fetched this run; page numbers match abstracts | **PASS** | I efetched all four independently; every quoted figure traced below. Frontmatter `verifiedAt: 2026-09-02` on surmount-2/3/4 + surpass-cvot is earned, not ceremonial. |
| 2 | SURMOUNT-2 15 mg: −14.7% vs −3.2% at 72 wk, treatment-regimen | **PASS** | Abstract: "−14·7% (0·5) [15 mg] … −3·2% (0·5) with placebo … The treatment-regimen estimand assessed effects regardless of treatment discontinuation." Page row matches, labeled "15 mg (T2D)" and treatment-regimen. |
| 3 | SURMOUNT-3: −18.4% vs +2.5% randomization→wk 72 after 12-wk lifestyle lead-in; MTD 10 or 15 mg, NOT 15 mg-only | **PASS** | Abstract: "tirzepatide maximum tolerated dose (10 or 15 mg) … −18.4% … and 2.5% … from randomization to week 72 … treatment regimen estimand." Page row carries all of this and explicitly disclaims "not a 15 mg-only arm." Select-String: no `SURMOUNT-3 … 15 mg`-only label. Old `SURMOUNT-3 \| 15mg` row is gone from the diff. |
| 4 | SURMOUNT-4: lead-in −20.9% at 36 wk; wk 36–88 −5.5% vs +14.0%; 89.5% vs 16.6% kept ≥80%; wk 0–88 −25.3% vs −9.9% labeled overall | **PASS** | Abstract: "mean weight reduction of 20.9% [36-wk lead-in] … −5.5% with tirzepatide vs 14.0% with placebo [wk 36→88] … 89.5% … maintained at least 80% … compared with 16.6% … week 0 to 88 was 25.3% … and 9.9%." Page row matches all five figures; −25.3% is labeled "Week 0–88 overall." Summary table still headlines −20.9% for SURMOUNT-1 — 25.3% is not passed off as SURMOUNT-1 anywhere. |
| 5 | SURPASS-CVOT HR 0.92 (95.3% CI 0.83–1.01), noninferior not superior | **PASS** | Abstract: "hazard ratio, 0.92; 95.3% confidence interval, 0.83 to 1.01; P=0.003 for noninferiority; P=0.09 for superiority." Page CV row: "Noninferior to dulaglutide, not superior — HR 0.92 (95.3% CI 0.83–1.01); P=0.003 noninferiority, P=0.09 superiority." Framing is correct — superiority P=0.09 did not clear. |
| 6 | FAQ 14/6 and 76/68 stripped; ~$1,000/month Pricing row retained | **PASS** | Select-String: zero census-count hits; FAQ now says "This page does not quote a live source census." Pricing row intact at line 215 (`Unknown \| ~$1,000/month`), per the standing TICK6-PRICE hold. |
| 7 | No new URLs; OSA 63% / TRIUMPH 28.7% / REDEFINE 22.7% not restored | **PASS** | git diff: 1 existing file modified. Select-String: no `22.7`, `63%`, `28.7`, `TRIUMPH`. "Obstructive sleep apnea" survives only as Zepbound's FDA approval indication in the FAQ — a regulatory-label fact, not the banned SURMOUNT-OSA result. |
| 8 | No unescaped `<`+digit (TICK11 lesson); SURMOUNT-3 not a 15 mg-only row | **PASS** | Select-String `<\d`: 0 hits (the abstract's `<5%` was not copied into the MDX). SURMOUNT-3 row explicitly MTD 10/15 mg. |
| 9 | NCT06131437 design claims (n=809 actual, COMPLETED, open-label, hasResults false, no percent quoted) | **PASS** | My CT.gov fetch confirms COMPLETED / 809 ACTUAL / masking NONE / hasResults false. Page quotes no head-to-head percent and dates the absence "as of 2026-09-02" in metaDescription, body, and Key Takeaways. |
| 10 | Estimands labeled; absence claims window-dated | **PASS (1 nit)** | Treatment-policy (REDEFINE) vs treatment-regimen (SURMOUNT) labeled throughout; efficacy estimand explicitly downgraded in the note. Nit: the REDEFINE 3 CV row says "not re-fetched this increment" — a disclosure, not a window date (source verifiedAt stays 2026-08-17, and the implementer declared the re-fetch not done). Declared, not hidden → residual, not a fail. |

## Gaming check

The cheap ways to game this loop were: (a) quietly promote SURMOUNT-4's −25.3% week-0–88 overall figure into the Summary as if it were SURMOUNT-1's headline — not done, the Summary keeps −20.9% at 72 weeks for SURMOUNT-1 and −25.3% appears only inside the SURMOUNT-4 row labeled "Week 0–88 overall"; (b) keep the tidy `15mg` dose column by mislabeling the SURMOUNT-3 MTD arm — the opposite happened, the dose column was deleted and the row carries an explicit anti-label; (c) bump `verifiedAt` stamps without fetching — I re-efetched all four PMIDs and re-pulled CT.gov myself, and every stamped figure matched; (d) strip the $1,000 pricing row to look maximally conservative — retained per instruction; (e) re-census the FAQ counts and present a fresh-looking number — declined, the FAQ now refuses to quote a census; (f) self-KEEP — the note is labeled "not a KEEP" and its "Not done" list (TICK6-PRICE, W3-M1 OAuth, REDEFINE 3 re-fetch, TICK11 Judge) matches what I found. The diff shape (−63/+55) is strip-and-cite; the only additions are fetch-backed rows, a CT.gov source entry, and honesty sentences about what the abstracts do not publish.

## Residuals (not fails — next loop candidates)

- REDEFINE 3 CV row carries process language ("not re-fetched this increment") instead of a window date; NCT05669755 re-fetch is declared not done. A future L4/L5 tick should re-fetch and either date the absence or update the row — and scrub the meta phrasing from public copy.
- Footer dropped "Consult a healthcare provider for treatment decisions." The educational-purposes disclaimer remains, so the disclaimer requirement is met, but the weaker footer is worth a qa:advice consistency look across comparisons.
- SURMOUNT-2's 10 mg arm (−12.8%) is not shown; page quotes only the 15 mg arm and labels it as such. Acceptable scope, noted for completeness.
- SURMOUNT table header "Result (fetched 2026-09-02)" also covers the SURMOUNT-1 row, which was re-fetched in TICK10 (same run date, judge KEEP `L4-TICK10-GI-iter1.md`) — defensible, noted so a future judge doesn't treat the header as evidence of a TICK12 fetch of 35658024.

## Verdict

**KEEP.** All 10 criteria pass on independently fetched evidence (four PubMed abstracts + one CT.gov record pulled by this Judge, not trusted from the note). Every SURMOUNT-2/3/4 and SURPASS-CVOT figure matches its abstract including estimand and arm labeling; banned strings absent under a positive-controlled Select-String battery; no unescaped `<`+digit; FAQ census stripped; $1,000 row intact; no new URLs; no self-KEEP.
