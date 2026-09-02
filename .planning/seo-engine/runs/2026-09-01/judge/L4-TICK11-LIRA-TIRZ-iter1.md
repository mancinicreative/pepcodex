# Judge — L4-TICK11-LIRA-TIRZ, iteration 1

Judge: Kimi K3 (Agent J). Did not write this increment. Mood: critic.
File reviewed in full: `src/content/comparisons/liraglutide-vs-tirzepatide.mdx` (working tree, 2026-09-02).
Implementer note: `../TICK11-LIRA-TIRZ.md`. Brief: `LOOP-TASKS.md` #### TICK11-LIRA-TIRZ.

## Independent verification performed

- Efetched all five PMIDs myself this session:
  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=26132939,35658024,37385275,27295427,41406444&rettype=abstract&retmode=text` (65,110 bytes returned). Every number below was checked against that fetch, not against the implementer note.
- PowerShell `Select-String -SimpleMatch` on the file for: `~8%`, `3x`, `3×`, `90%`, `2.5mg`, `2.5 mg`, `~40%`, `~30%`, `~1.0-1.5`, `~1.0–1.5`, `~2.0-2.3`, `~2.0–2.3`, `still being studied`, `28.7`, `63%`, `TRIUMPH`, `22.7`. Positive controls `SCALE` and `liraglutide` fired (many hits) — grep was live.
- `git diff --stat HEAD -- <file>`: `1 file changed, 75 insertions(+), 104 deletions(-)` — modification of an existing slug (file has commit history). No new URL.
- Raw-`<` scan: `Select-String '<'` on the file; repo-wide MDX **body** scan for `<\d` (frontmatter excluded); `git show HEAD:<file>` checked for pre-existing raw `<`.

## Criteria

1. **Five PMIDs fetched this run — PASS.**
   All five resolve and topical-match, no sibling mixup:
   - 26132939 = SCALE Obesity and Prediabetes (Pi-Sunyer, NEJM 2015;373:11-22, NN8022-1839). ✔
   - 35658024 = SURMOUNT-1 (Jastreboff, NEJM 2022;387:205-216). ✔
   - 37385275 = SURMOUNT-2 (Garvey, Lancet 2023;402:613-626). ✔
   - 27295427 = LEADER (Marso, NEJM 2016;375:311-22). ✔
   - 41406444 = SURPASS-CVOT (Nicholls, NEJM 2025;393:2409-2420). ✔

2. **SCALE quoted in kg, not ~8% — PASS.**
   Abstract: −8.4±7.3 kg vs −2.8±6.5 kg, diff −5.6 kg (95% CI −6.0 to −5.1); ≥5% 63.2%/27.1%; >10% 33.1%/10.6%; n=3731; 56 wk; no T2D. File line 110 matches every figure and explicitly declines the kg→% conversion. `~8%` survives only inside the negation "this page does not convert kg into ~8%" (line 110) — not a claim (see Residual R2).

3. **SURMOUNT-1 −20.9% vs −3.1% treatment-regimen; no invented ≥10% — PASS.**
   Abstract: −15.0/−19.5/−20.9% vs −3.1% (5/10/15 mg, treatment-regimen); ≥5% 91% (95% CI 88–94) vs 35%; ≥20% 57% (95% CI 53–61) vs 3%; AE d/c 6.2% (15 mg) vs 2.6%. File lines 116-121 match; line 121 correctly states the abstract publishes no ≥10% figure and does not invent one. No `90%` anywhere.

4. **LEADER with HR, not a rounded "13%" headline — PASS.**
   Abstract: n=9340; median 3.8 y; 608/4668 (13.0%) vs 694/4672 (14.9%); HR 0.87 (95% CI 0.78–0.97); P<0.001 noninferiority, P=0.01 superiority; NCT01179048. File line 131 matches verbatim-class, HR present, `P&lt;0.001` correctly escaped.

5. **SURPASS-CVOT noninferior-not-superior; "still being studied" gone — PASS.**
   Abstract: 13,299 randomised, 134 excluded, mITT 6586 vs 6579; 801 (12.2%) vs 862 (13.1%); HR 0.92 (95.3% CI 0.83–1.01); P=0.003 NI / P=0.09 superiority; NCT04255433. File line 133 matches, states "Noninferior, not superior, to dulaglutide." `still being studied`: zero hits.

6. **Stripped class absent — PASS.**
   `90%`, `2.5mg`/`2.5 mg`, `~1.0-1.5`, `~2.0-2.3` (both dash variants), `28.7`, `63%`, `TRIUMPH`, `22.7`: zero hits. `3x`/`3×` and `~40%`/`~30%` survive only inside explicit disavowals (lines 214, 145). No nausea table, no HbA1c deltas, no injections-per-month count, no starting dose.

7. **Price rows retained — PASS.**
   Line 154: `| **List Price (US)** | ~$1,300/month | ~$1,000-1,200/month |` present. TICK6-PRICE correctly not started.

8. **No new URLs; no resurrected claims — PASS.**
   Diff is 1 existing file, +75/−104. No OSA 63%, no TRIUMPH 28.7%, no REDEFINE 22.7%.

## Fail item

- **F1 (CRITICAL — build-breaking): unescaped `<` before a digit in MDX body, line 143.**
  `...few leading to discontinuation (<5%) [surmount-2-pmid-37385275].`
  This repo's documented lesson (`.claude/rules/lessons.md`, estimand-discipline section): "ALWAYS escape `<` before a digit in MDX bodies … MDX parses [it] as the start of a JSX tag and fails the whole build with 'Unexpected character' — 5 files, build exit 1, zero pages emitted." Evidence this is a new defect, not pre-existing: (a) `git show HEAD` of this file contains **zero** raw `<`; (b) a repo-wide scan of every `.mdx` **body** (frontmatter excluded) for `<\d` finds exactly one other hit, `pemvidutide-breakthrough-designation-mash.mdx:97`, which is backslash-escaped (`p\<0.0001`) — line 143 is the only unescaped instance in the repo; (c) the implementer escaped `P&lt;0.001` on line 131 of this same file, so the rule was known and applied inconsistently. As shipped, this increment fails the Verifier's `astro build` gate (`REAL_BUILD_EXIT=1`, zero pages). Judge may not edit content; the one-line fix for the retry is: line 143 `(<5%)` → `(&lt;5%)`.

## Gaming check

The implementer did not game the brief's letter: the disavowal sentences are honest (correct polarity, correct figures), every quoted number traces to my independent efetch, and the price rows were correctly left standing despite being adjacent to stripped content. Two smells worth naming, neither scored as gaming: (1) checklist-shaped compliance — the escape rule was applied exactly where the brief's example pointed (`P<0.001`) and missed one line away (`<5%`), which is precisely how "looked correct in review" defects have shipped in this repo before; (2) the negation sentences repeat the banned strings (`~8%`, `3×`, `~40% vs ~30%`) verbatim, keeping them alive for future grep-based audits and for any editor that pattern-matches on presence rather than polarity — the next loop should reword them away rather than carry the trophies.

## Residuals (not fails; next loop)

- **R1 (MED):** Line 57 "newer dual GIP/GLP-1 agonist **with superior efficacy**" and line 98 "**Superior weight loss**" — unsourced cross-trial superiority claims, the same semantic class as the stripped "3× relative efficacy," and they contradict the page's own "not a head-to-head" framing. Reword without the superiority adjective.
- **R2 (LOW):** Negation sentences at lines 110/145/214 retain `~8%`, `3×`, `~40% vs ~30%` literally. Truthful, but reword to drop the numbers.
- **R3 (LOW):** SCALE Diabetes / SCALE Maintenance rows were removed rather than re-fetched (implementer disclosed). Acceptable under cited-only; re-add only from a fetched abstract.

## Verdict

**RETRY-WITH-NEW-PLAN** — same plan, same file, one fix: escape line 143 `(<5%)` → `(&lt;5%)`, then re-run this judge.
Not REVERT: every content correction verified accurate against the independent fetch; reverting would restore the false ~8%/HbA1c/nausea-table claims.
Not KEEP: the increment as shipped breaks `astro build` per the repo's documented MDX lesson; the Verifier gate would bounce it anyway.

Conductor: do not mark KEEP in LOOP-TASKS.md until iter2 passes.
