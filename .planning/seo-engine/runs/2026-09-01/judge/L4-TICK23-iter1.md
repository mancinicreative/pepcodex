# JUDGE — L4-TICK23-iter1

**Loop:** L4-TICK23 · **File:** `src/content/comparisons/tirzepatide-vs-retatrutide.mdx`
**Judge date:** 2026-09-02 · **Mood:** critic · **I did not write this increment.**

## Independent fetches (commands actually run, 2026-09-02)

| Command | Result |
|---|---|
| `curl.exe esummary.fcgi?db=pubmed&id=37366315,41090431,42250575,42608321,35658024,37385275` | All 6 resolve; titles topical-match sources[] |
| `curl.exe efetch.fcgi?db=pubmed&id=37366315&rettype=abstract&retmode=text` | NEJM 2023 phase 2 abstract — full text below |
| `curl.exe efetch.fcgi?db=pubmed&id=35658024&rettype=abstract&retmode=text` | SURMOUNT-1 abstract |
| `curl.exe efetch.fcgi?db=pubmed&id=42250575&rettype=abstract&retmode=text` | TRANSCEND-T2D-1 abstract |
| `curl.exe efetch.fcgi?db=pubmed&id=41090431&rettype=abstract&retmode=text` | TRIUMPH design abstract |
| `curl.exe clinicaltrials.gov/api/v2/studies/NCT04881760` | "A Study of LY3437943 in Participants Who Have Obesity or Are Overweight" — COMPLETED |
| `curl.exe clinicaltrials.gov/api/v2/studies/NCT06354660` | "…(TRANSCEND-T2D-1)" — COMPLETED |
| `curl.exe esearch "TRIUMPH-1" retatrutide weight` | count=1, only PMID 41090431 (design paper) |
| `curl.exe esearch retatrutide[Title] AND 28.7` | count=0 |
| `git diff --stat HEAD -- <file>` | +126/−206, single file, net strip-down |

## Fail-condition checklist (must-fail list)

1. **TRIUMPH 28.3%/28.7% as a result — PASS (absent).** Grep `28\.[37]` → no match. Page: "The abstract publishes no efficacy percent… This page does not quote an unpublished TRIUMPH obesity percent." My efetch of 41090431 confirms design-only (four phase 3, >5,800 participants, endpoints named, zero efficacy data). My esearch `retatrutide[Title] AND 28.7` → 0.
2. **−17.5% as 4 mg at 48 wk — PASS (absent).** Page: "Week 24: … −17.5% (12 mg)" and "Week 48: … −17.1% (combined 4 mg) … −24.2% (12 mg), −2.1% placebo." Matches fetched abstract verbatim: primary = 24 wk; 48 wk secondary; LS means −7.2/−12.9/−17.3/−17.5 vs −1.6 at 24 wk; −8.7/−17.1/−22.8/−24.2 vs −2.1 at 48 wk. Page explicitly disclaims the old wrong row.
3. **Unpublished results as data — PASS.** TRIUMPH presented as design paper with dated absence ("PubMed search on 2026-09-02 … returned only this design paper"). I re-ran the search: count=1, the design paper. Window-scoped, dated — satisfies the absence rule.
4. **Unresolved PMIDs/NCTs — PASS.** 6/6 PMIDs resolve with topical-matching titles; both retatrutide NCTs resolve on CT.gov v2 with matching titles/status. (SURMOUNT NCTs named inside fetched abstracts: NCT04184622, and 37385275 esummary title matches SURMOUNT-2.)
5. **Trailing-slash compare links — PASS.** Grep `\]\(/[^)]*/\)` → no match. All four links (`/peptides/tirzepatide`, `/peptides/retatrutide`, `/compare/retatrutide-vs-semaglutide`, `/compare/tirzepatide-vs-semaglutide`) resolve to real files (Glob confirmed all four exist).
6. **Dosing/purchasing/medical advice — PASS.** Grep for buy/purchase/"you should take"/consult-physician → no match. Who-might/consult sections are gone. Mg figures appear only as trial-arm reporting. `P&lt;` / `&lt;5%` correctly escaped (grep `<[0-9]` → no match).
7. **Implementer self-KEEP — PASS.** TICK23.md header says "not a KEEP"; LOOP-TASKS.md has zero TICK23 entries.

## Targeted re-verification

- **SURMOUNT-1 (35658024):** fetched abstract confirms n=2539, 72 wk, treatment-regimen named, −15.0/−19.5/−20.9% vs −3.1%, ≥20% = 50% (10 mg) and **57% (95% CI 53–61)** at 15 mg vs 3% — page quotes 57%, not "over 60%". AE d/c 4.3/7.1/6.2 vs 2.6 matches.
- **Retatrutide phase 2 (37366315):** page correctly labels 24 wk primary / 48 wk secondary, correctly states the abstract names no estimand, ≥5/10/15% at 12 mg = 100/93/83 vs 27/9/2 matches, HR-peak-at-24-wk matches.
- **TRANSCEND-T2D-1 (42250575):** fetched abstract confirms T2D (not obesity), phase 3, n=537, 40 wk, treatment-regimen, HbA1c −1.69/−1.86/−1.94 vs −0.81 (p<0.0001), weight −11.5/−13.9/−15.3 vs −2.6, AE d/c 2–5% vs 0%. Page labels it "not a TRIUMPH obesity readout" — correct.
- **TICK6-PRICE:** `~$1,000-1,200/month (US)` row retained — per instructions, **not failed**.

## Gaming check

The page leans on defensive meta-language ("This page does not restore…", "on this page", "in this increment") — ugly prose, but it is not gaming: every load-bearing number was re-fetched independently and matches the source abstracts exactly, including the two figures most often corrupted in this repo (−24.2% as 48-wk secondary, 57% ≥20%). The diff is a net deletion (+126/−206) confined to the assigned file, consistent with the claimed strip-down of the invented 4 mg row, nausea table, who-might/consult, filing timeline, and unfetched NASH. Absence claims carry scan dates and were re-run by me with identical results. sources[] titles for 42250575/35658025 are shortened/annotated versions of the PubMed titles — topical match holds, PMIDs resolve; noted, not a fabrication. No scope creep into locked files is visible in the increment diff.

## Verdict: **KEEP**

All seven must-fail conditions PASS with independent fetch evidence. Estimands labelled, absence dated, links resolve, no banned content, no self-KEEP.
