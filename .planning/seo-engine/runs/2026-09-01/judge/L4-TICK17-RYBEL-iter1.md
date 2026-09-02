# Judge — L4-TICK17-RYBEL iter 1

**Loop:** L4 integrity on `src/content/comparisons/rybelsus-vs-ozempic.mdx`
**Judge:** Kimi K3 (Agent J). Not the author. Mood: critic.
**Bar:** LOOPS.md L4 + dispatch fail-list.
**Date:** 2026-09-02

## Independent evidence

- Efetched 31186300 / 31530666 / 31186120 myself (eutils, rettype=abstract). All three topical-match: PIONEER 1 (Diabetes Care 2019, Aroda), PIONEER 2 (Diabetes Care 2019, Rodbard), PIONEER 4 (Lancet 2019, Pratley, NCT02863419). PIONEER 4 comparator is subcutaneous **liraglutide** + placebo — not Ozempic. Page says so explicitly, three times.
- `git diff --stat HEAD`: 1 file, +60/−130. No new URLs.
- Select-String sweep: `1.5%` 0 · `3.7` 0 · `4.1 kg` 0 · `4 oz` 0 · `30.min` 0 · `89%` 0 · `consult` 0 · `67 sources` 0 · `28.7` 0 · `TRIUMPH` 0 · `22.7` 0 · `OASIS` 0. Positive control: PIONEER 40 hits, Rybelsus 15. `SUSTAIN` 2 hits — both disavowals, no invented Ozempic row.
- Raw `<` in file: **zero occurrences** (all `P&lt;` escaped). No unescaped `<`+digit possible.
- gray-matter parse: single frontmatter block, parses clean. Keys: title, peptideA, peptideB, category(metabolic), lastUpdated, summary, metaTitle, metaDescription, faqs(4), sources(3, type=journal, pmids correct). Schema-valid per `config.ts` comparisons.

## Per-criterion

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| 1 | PMIDs fetched + topical; PIONEER 4 not an Ozempic head-to-head | **PASS** | Independent efetch; page: "This is not an Ozempic trial." |
| 2 | PIONEER 1 leads TP −1.1% / −2.3 kg; −1.5%/−3.7 kg gone; trial-product −1.4%/−2.6 kg labelled; `P&lt;0.001` escaped | **PASS** | Page matches abstract figure-for-figure (n=703, baseline 8.0%, all six HbA1c values, d/c 2.3–7.4% vs 2.2%). |
| 3 | PIONEER 2 TP wk26 −1.3% vs −0.9%; −4.1 kg not quoted as TP weight | **PASS** | Page: "Superior weight loss was not confirmed at week 26 on the treatment-policy estimand"; wk52 trial-product −4.7/−3.8 kg matches abstract. |
| 4 | PIONEER 4 TP wk26 −1.2% vs −1.1% lira vs −0.2% pbo; weight −4.4/−3.1/−0.5 | **PASS** | ETDs, CIs, p-values, AE 80/74/67% all match Lancet abstract. −1.3% absent. |
| 5 | Strips executed; no invented Ozempic HbA1c range | **PASS** | Old ~1.4–1.6% table, 4 oz/30-min, ~1%/89%, consult, census FAQs all removed in diff. |
| 6 | No new URLs; no OSA 63% / TRIUMPH 28.7% / REDEFINE 22.7%; no trophy disavowal repeating −1.5%/−3.7 kg | **PASS** | Full-file read + sweep. Disavowals present cite no banned numbers. |

## Gaming check

The implementer did not game the loop: identifiers were genuinely re-fetched (my independent efetch confirms every quoted figure), treatment-policy estimands lead everywhere with trial-product figures labelled, and unfetchable content was stripped rather than cosmetically reworded — exactly what L4 orders. The one smell is self-referential editor-note prose in reader-facing copy ("This increment did not fetch a SUSTAIN Ozempic abstract", "This page does not invent a matched nausea-percent table", "Do not treat the trial-product −1.4% as the treatment-policy number") — it reads like notes left to survive a banned-pattern sweep rather than writing for a Google reader. But it contains no banned numbers, no false claims, and no trophy disavowals, so it trips no fail condition; it is a polish defect, not an integrity one. The page is not husk-stripped — three full trial sections, an efficacy table, per-trial safety lines, and takeaways survive — and the YAML is single-block and parses.

## Non-blocking observations (route to a future L6 polish pass)

1. Four body sentences + three FAQ clauses are process meta-commentary ("this increment", "this page does not quote…"). Rewrite reader-facing or delete.
2. FAQ "no published clinical data on using Rybelsus and Ozempic together" is an undated absence claim (carried over from the old page). Low risk — same molecule — but strictly wants a window date per the shared clause.
3. `oral-vs-injectable-semaglutide.mdx` remains open per the implementer note; not this loop's file.

## Verdict

**KEEP.** Every dispatch fail condition checked and clear; all quoted numbers verified against independently fetched abstracts; net URL delta 0; YAML valid. Meta-commentary prose is noted for a polish ticket, not grounds for retry.
