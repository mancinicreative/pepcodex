# L4-TICK20-iter1 — amycretin-vs-tirzepatide — **KEEP**

Judge: Kimi K3 (Agent J). Did not write this increment. Mood: critic.
File: `src/content/comparisons/amycretin-vs-tirzepatide.mdx`
Bar: LOOPS.md L4. Brief: LOOP-TASKS.md #### TICK20. Implementer note: TICK20.md (not trusted; verified independently).

## Evidence this run (Judge's own fetches, not the note's)

- Efetch 2026-09-02, HTTP 200, 17,326 bytes: `runs/2026-09-01/_judge-tick20-efetch.txt` (PMIDs 40550229, 40550231, 35658024).
- `git diff --stat HEAD`: 1 file changed, 90 insertions, 117 deletions — modification, no new URL.
- Select-String banned patterns (`25%`, `~13`, `Consult`, `sources (`, `28.7`, `TRIUMPH`, `22.7`, `63%`, `over 60`, `<`+digit, `census`, `2027`, `5–7%`): **zero hits**. Positive control (`amycretin`/`SURMOUNT`): 48 hits — scan was live, not blind.
- Select-String `~`, `approximately`, `projected`, `annualized`, raw `P<`: zero hits. Only escaped `P&lt;0.0001` / `P&lt;0.001` present.

## Criterion-by-criterion

1. **Topical match / sibling mixup — PASS.** 40550229 = oral FIH (abstract: "single ascending doses of oral amycretin", NCT05369390 in text). 40550231 = SC 1b/2a (NCT06064006 in text). 35658024 = SURMOUNT-1 (NCT04184622, "excluding diabetes" — not SURMOUNT-2). File attributes exploratory-no-percent to oral and −24.3% to SC; correct per abstracts. YAML titles match fetched titles.
2. **Oral no-percent — PASS.** Fetched abstract's FINDINGS publish TEAEs only; bodyweight to day 85 is listed as exploratory with no percent. File states exactly that, dated 2026-09-02. No ~13% / ~25% restored (diff shows both stripped; scan confirms).
3. **SC estimated means — PASS.** Abstract contains "Part B (60 mg, -24·3% vs -1·1%; week 36)" plus C/D/E rows — all four match the file's table exactly. Primary = TEAEs and bodyweight = secondary stated in both. P escaped. File labels the numbers "estimated mean change versus placebo (not labelled as a Phase 3 treatment-regimen estimand)" — efficacy estimand is **not** presented as treatment-policy. Withdrawal sentence matches abstract.
4. **SURMOUNT-1 — PASS.** Treatment-regimen labelled. 15 mg −20.9% vs −3.1%, 5/10 mg −15.0/−19.5%, all CIs, ≥5% 91% vs 35%, ≥20% at 15 mg **57% (53–61)** vs 3% (1–5), ≥20% at 10 mg 50% (46–54), AE d/c 4.3/7.1/6.2/2.6 — every figure matches the abstract. No "over 60%".
5. **Strips — PASS.** Census FAQ ("8 sources / 76 sources"), consult-a-provider (both instances), 2027+ timeline tables, ~5–7% d/c, "Potentially >25%", ~22% summary — all visible as deletions in the diff; zero residue on scan.
6. **Standing bans — PASS.** No new URLs (diff is one modified file). No OSA 63%, TRIUMPH 28.7%, REDEFINE 22.7%. No unescaped `<` before a digit. CagriSema disavowal ("does not quote CagriSema trial percents") repeats no number — not a trophy. Internal links `/peptides/amycretin`, `/peptides/tirzepatide`, `/compare/amycretin-vs-semaglutide` all resolve to real slugs, no trailing slash.
7. **YAML — PASS.** Three sources, each `pmid` + `verifiedAt: '2026-09-02'`; NCTs match abstracts; no duplicate keys; lastUpdated 2026-09-02.

## Gaming check

The increment did the unglamorous thing L4 exists for: it deleted more than it wrote (117−/90+), shrinking a speculative marketing-shaped page into three fetched abstracts with estimand labels. No scope creep — TICK6-PRICE rows untouched (none present), no other compares edited, no KEEP self-marked. The one editorial liberty is "(SURMOUNT-1)" appended to the NEJM title in YAML; the abstract itself names SURMOUNT-1, so this is disambiguation, not fabrication — consistent with prior KEEPs. Absence claims carry fetch dates, satisfying the window rule. Nothing on the page outruns the three abstracts.

## Verdict

**KEEP.** Ratchet row may be appended by Conductor. TICK6-PRICE remains parked on Lucas; W3-M1 still OAuth-blocked.
