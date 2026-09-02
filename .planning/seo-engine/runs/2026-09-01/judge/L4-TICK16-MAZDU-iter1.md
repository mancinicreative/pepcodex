# Judge — L4-TICK16-MAZDU, iter 1

**Loop:** L4 (Integrity) on `src/content/comparisons/mazdutide-vs-tirzepatide.mdx`
**Judge:** Kimi K3 (Agent J). Not the author. Mood: critic.
**Date:** 2026-09-02
**Verdict: KEEP**

---

## Criterion-by-criterion

| # | Criterion (from brief + LOOPS.md L4) | Result | Evidence |
|---|---|---|---|
| 1 | All four PMIDs independently efetched this run; topical match | PASS | Efetch 2026-09-02: 40421736 = NEJM 2025 GLORY-1 (NCT05607680, mazdutide in title); 42251595 = JAMA 2026 GLORY-2 (NCT06164873); 42628555 = Lancet D&E 2026 US phase 2 (Hsia, NCT06124807); 35658024 = NEJM 2022 SURMOUNT-1 (NCT04184622). All four name the drug in title/abstract. |
| 2 | No GLORY-1/GLORY-2 sibling mixup | PASS | Page attributes n=610 / 4+6 mg / 48 wk to GLORY-1 and 461 treated / 9 mg / 60 wk to GLORY-2. Abstracts confirm exactly that split. |
| 3 | GLORY-1 figures match abstract | PASS | n=610; treatment-policy primary at wk 32; −10.09/−12.55 vs +0.45%; ≥5% 73.9/82.0/10.5; wk 48 −11.00/−14.01 vs +0.30; ≥15% 35.7/49.5/2.0; AE d/c 1.5/0.5/1.0. All verbatim-consistent with PMID 40421736. `P&lt;0.001` escaped. |
| 4 | GLORY-2 figures match abstract; trials not collapsed into ~16–18% | PASS | 461 treated (307/154); 60 wk; −16.65% (CI −18.19 to −15.12) vs −1.50% (CI −3.43 to 0.43); diff −15.15% (CI −17.22 to −13.09); ≥5% 84.3 vs 33.1; vomiting 53.1/1.3, nausea 46.9/3.2, diarrhea 39.4/6.5; AE d/c 2.9 vs 0. GLORY-1 and GLORY-2 quoted in separate sections with separate numbers. |
| 5 | Hsia efficacy (hypothetical) estimand labelled; not presented as treatment-policy; −18.1% not equated with −20.9% | PASS | Section heading "US phase 2 (efficacy estimand, not treatment-policy)"; states abstract has no treatment-regimen/policy figure; quotes −7.3/−15.6/−18.1 vs −0.9, ETD −6.5 to −17.2 (`P&lt;0.0001`), 20% AE d/c at 16 mg; explicit in-body warning against interchanging with GLORY-1 treatment-policy or SURMOUNT-1 treatment-regimen. |
| 6 | SURMOUNT-1 figures match abstract | PASS | n=2539; 72 wk; treatment-regimen; −15.0/−19.5/−20.9 vs −3.1; ≥20% at 15 mg 57% (CI 53–61) vs 3%; AE d/c 6.2 vs 2.6. Matches PMID 35658024. |
| 7 | Strips landed: FAQ source census, consult-a-provider, unsourced A1c ranges, "who might consider" | PASS | Select-String: zero hits for `Consult`, `18 sources`, `76 sources`, `who might consider`, `11-12`/`11–12` (A1c range class). FAQ now 4 questions with no census. |
| 8 | Banned patterns absent: 16–18, 20–22, 28.7, TRIUMPH, 22.7, OSA 63%, unescaped `<`+digit | PASS | Select-String over the file: zero hits for `16-18`, `16–18`, `20-22`, `20–22`, `28.7`, `TRIUMPH`, `22.7`, `63%`, `OSA`, `<\d`. Positive control `GLORY`/`mazdutide`: 43 matching lines. |
| 9 | No invented NMPA date | PASS | Only two NMPA mentions, both disavowals ("did not re-fetch an NMPA letter" / "did not re-fetch NMPA, EMA, or PMDA letters"). No date, no approval claim for China. |
| 10 | No new URLs; scope = one file | PASS | `git diff --stat HEAD -- <file>`: 1 file, +80/−179. Citation-ID inventory: exactly 4 unique body IDs, all defined in frontmatter `sources:`; no dangling IDs. |
| 11 | Identifiers all fetched this run (no memory citations) | PASS | All 4 PMIDs were in the brief's fetch list and were re-fetched by Judge; `verifiedAt: 2026-09-02` on all four source entries. |
| 12 | YAML intact, not duplicated/broken | PASS | Single frontmatter document; one `faqs`, one `sources`; titles of the four source entries match fetched papers (GLORY-1 entry appends "(GLORY-1)" to the NEJM title — the NCT in the abstract confirms the trial name; acceptable). |

## Gaming check

The diff is +80/−179, a ~38% net shrink, so the husk-strip question is real. It fails the husk test in the right direction: the page retains Overview, Key Facts, four fully-cited trial sections, an efficacy comparison table, side effects, regulatory, cost, summary, and key takeaways — every surviving number traces to one of the four PMIDs fetched this run, and the deletions concentrate in exactly the invented classes the brief named (census FAQs, consult-a-provider, A1c ranges, who-might-consider, the collapsed ~16–18% framing). The remaining disavowal lines ("does not quote an unsourced 24-week percent range", "does not invent a matched nausea table") do not repeat the banned ~16–18 / ~20–22 trophies, so they pass the trophy rule; the "This increment did not re-fetch…" phrasing is process-talk leaking into reader-facing copy, a style nit worth a future cleanup pass but not an L4 integrity defect — it declines to claim rather than asserting an undated absence. No estimand swap, no sibling-trial mixup, no fabricated identifier, no new URL, no self-KEEP.

## Verdict

**KEEP.** All twelve criteria pass against independently re-fetched abstracts. Nits for a future pass (not blocking): reader-visible process-talk in the NMPA/regulatory lines; the GLORY-1 source title's parenthetical suffix.

Judge did not edit `src/content`. Judge did not mark LOOP-TASKS.md.
