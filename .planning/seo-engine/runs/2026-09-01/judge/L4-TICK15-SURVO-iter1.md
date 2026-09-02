# L4-TICK15-SURVO iter1 — Quality Judge

Loop: L4-TICK15-SURVO, iteration 1
File: `src/content/comparisons/survodutide-vs-tirzepatide.mdx`
Judge: Agent J (Kimi K3). Did not write this increment. Mood: critic.
Judged: 2026-09-02. Bar: LOOPS.md L4.

## Identifier re-fetch (independent efetch, 2026-09-02)

Command: efetch.fcgi `db=pubmed&id=42253238,38330987,38095657,35658024,37385275&rettype=abstract&retmode=text` — full abstracts read, topical-matched, numbers compared digit-by-digit.

| PMID | Paper (from fetch) | Topical match | Page numbers vs abstract |
|---|---|---|---|
| 42253238 | le Roux et al, NEJM 2026;395(8):776-787, "Survodutide Once Weekly for the Treatment of Adults with Obesity", SYNCHRONIZE-1, NCT06066515 | PASS — phase 3 obesity, survodutide. NOT the MASLD paper | PASS — n=725 (241/242/242), 76 wk, treatment-regimen −12.2% (−13.6 to −10.8) / −13.0% (−14.4 to −11.6) / −5.4% (−6.9 to −4.0); ≥5% 72.6/71.9/46.3% P<0.001; GI 80.9/89.7/47.9%; no deaths — all exact |
| 38330987 | le Roux et al, Lancet Diabetes Endocrinol 2024;12(3):162-173, phase 2 dose-finding, NCT04667377 | PASS | PASS — 387 enrolled / 386 treated; **46 wk** (20 escalation + 26 maintenance); planned-treatment −6.2/−12.5/−13.2/−14.9 vs −2.8; GI 75% vs 42% — all exact |
| 38095657 | Blüher et al, Diabetologia 2024;67(3):470-482, T2D phase 2, NCT04153929 | PASS | PASS — 413 randomised, 16 wk; HbA1c DG1–DG6 −0.91/−1.46/−1.71/−1.56/−1.63/−1.68; semaglutide −1.47; bodyweight −8.7 (DG6) vs −5.3; AE 77.8/52.5/52.0 — all exact |
| 35658024 | Jastreboff et al, NEJM 2022;387(3):205-216, SURMOUNT-1, NCT04184622 | PASS | PASS — n=2539, 72 wk, −15.0/−19.5/−20.9 vs −3.1; ≥5% 85/89/91 vs 35; ≥20% 50/57 (CI 53–61) vs 3; AE d/c 4.3/7.1/6.2/2.6 — all exact |
| 37385275 | Garvey et al, Lancet 2023;402(10402):613-626, SURMOUNT-2, NCT04657003 | PASS | PASS — n=938, 72 wk, −12.8/−14.7 vs −3.2; ≥5% 79–83 vs 32; GI d/c <5% — all exact |

**Sibling-trial check: PASS.** 42253238 is the obesity phase 3 (SYNCHRONIZE-1), not SYNCHRONIZE-MASLD (42252333). The string "SYNCHRONY" appears nowhere (Select-String clean). SURMOUNT-1's 10 mg −19.5% is attributed only to tirzepatide.

## Banned-pattern scan (Select-String, file-scoped)

Patterns `18\.7, ~19, ~22, 2\.3%, SYNCHRONY, consult, 34 sources, 76 sources, <\d, 28\.7, TRIUMPH, 22\.7` → **zero matches**. PASS.
Positive control `SYNCHRONIZE / survodutide` → 48 matching lines. PASS.
List Price ~$1,000/month retained — explicitly allowed (TICK6-PRICE blocked on Lucas). Not a fail.

## Criterion-by-criterion (L4 bar + claimed outcomes)

1. Five PMIDs fetched and topical-matched — **PASS** (independent efetch above; topical match, not resolution-only).
2. SYNCHRONIZE-1 figures incl. n=725, 76 wk, treatment-regimen lead, CIs, ≥5%, GI, escaped P&lt;0.001 — **PASS**, exact to abstract.
3. Phase 2 obesity = 46 weeks, planned-treatment −14.9% vs −2.8% — **PASS**; no 48-week percent table restored; estimand labelled and matches the paper's primary analysis.
4. SURMOUNT-1 15 mg −20.9% vs −3.1% / SURMOUNT-2 15 mg −14.7% vs −3.2% — **PASS**; −19.5% never used as a survodutide figure.
5. Strips: tirzepatide HbA1c −2.3%, FAQ source census, consult-a-provider, ~19%/~22% summary — **PASS** (scan clean; FAQ now declines a census instead of fabricating one).
6. SYNCHRONIZE-MASLD / SURPASS-CVOT — **PASS**; named only inside "not re-fetched this increment" disavowals, zero percents/HRs from either.
7. No new URLs — **PASS**; `git diff --stat HEAD` = 1 file, 83 insertions / 111 deletions, uncommitted.
8. Escapes — **PASS**; `P&lt;0.001` ×2, `&lt;5%`; `<\d` scan clean.
9. Trophy disavowals repeating banned percents (TICK11 R2) — **PASS**; the one numeric disavowal (−19.5%) repeats a *sourced* tirzepatide figure already cited on-page, not a banned percent.
10. Duplicate YAML — **PASS**; single frontmatter block; the trailing `---` is an MDX horizontal rule before the disclaimer.
11. L4 estimand clause — **PASS**; treatment-regimen leads everywhere; planned-treatment labelled; no efficacy estimand headlined.
12. Absence claims window-dated ("fetched 2026-09-02", "this increment") — **PASS**; no eternal absences.

## Gaming check

The page was not husk-stripped: it retains full data sections for all five fetched trials across ~170 lines, with key-facts/efficacy/evidence/cost/summary tables and key takeaways; the diff trades 111 lines of unsourced content for 83 lines of fetched, estimand-labelled data. Every citation on the page was fetched this run and independently re-fetched by me — no identifier survives on resolution-only. YAML is a single valid block. One stylistic concern, not a fail: disavowal density is high (~12 "this page does not…" sentences, several inside FAQ answers), which reads auditor-facing rather than reader-facing; a future polish pass should convert them to positive statements or cut them, but none repeat banned percents, so the TICK11-R2 rule is not triggered.

## Verdict

**KEEP**

Commands actually run: efetch WebFetch (5 PMIDs, abstracts read in full); `Select-String` banned-pattern scan (12 patterns, 0 hits) and positive control (48 hits); `git diff --stat HEAD -- <file>` (1 file, 83+/111−); `git log --oneline -3 -- <file>`. Ratchet row for ratchet/L4.md is the Conductor's to write, not mine. Not marked KEEP in LOOP-TASKS.md.
