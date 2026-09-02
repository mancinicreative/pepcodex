# JUDGE — L4-TICK36 iter1 — tirzepatide-vs-semaglutide.mdx

**Verdict: KEEP**
Judge: Kimi K3 (adversarial; did not write TICK36). Date of every fetch below: **2026-09-02**.
File reviewed: `src/content/comparisons/tirzepatide-vs-semaglutide.mdx` (CRLF=176, LF_ONLY=0, no unescaped `<` before a digit, no trailing-slash links — verified by byte scan).

## Independent re-fetch (commands actually run, 2026-09-02)

| # | Command | Result |
|---|---|---|
| 1 | `node .planning\seo-engine\runs\2026-09-01\judge\_judge-tick36-fetch.mjs` (my script: esummary + efetch per PMID, 33567185 / 35658024 / 37952131 / 40353578 / 34170647 / 41406444) | All 6 esummary STATUS 200 + efetch STATUS 200; every title topical-matches the YAML `sources[]` titles verbatim |
| 2 | `curl.exe -s ".../efetch.fcgi?db=pubmed&id=40353578&retmode=xml"` | `ELocationID EIdType="doi" ValidYN="Y">10.1056/NEJMoa2416394` — the DOI in frontmatter is real; first author Aronne LJ, NEJM 2025;393(1):26-36 |
| 3 | `curl.exe -s ".../esummary.fcgi?db=pubmed&retmode=json&id=33567185,35658024,37952131,34170647,41406444"` | First authors: Wilding JPH (2021), Jastreboff AM (2022), Lincoff AM (2023), Frías JP (2021), Nicholls SJ (2025) — all five match the page's Sources table, all NEJM |
| 4 | `npm run qa-pmids` (strict) | exit 0 — "PASS: every cited PMID (1327), NCT (560), and DOI (593) resolves" |
| 5 | `npm run qa:advice` | exit 0 — 932 files, no instructional voice |
| 6 | `npm run qa:claims` | exit 0 — touched file appears only in the "95%" cluster (the "95% CI" substring class; known non-blocking regex class, same as TICK27) |
| 7 | `npm run qa:attached` | exit 0 — zero flags on the touched file; flags are in unrelated files (see out-of-scope note) |
| 8 | `Select-String` battery on the file + `Get-ChildItem` target checks + `git diff HEAD` | See fail-condition table |

## Fail-condition battery (from the dispatch)

| Condition | Result | Evidence |
|---|---|---|
| Census FAQ (76/68 vs 67/52) | **PASS (gone)** | `git diff` shows the old FAQ lines "Tirzepatide has 76 sources (68 human studies)… Semaglutide has 67 sources (52 human studies)" deleted. Select-String `76/68`, `67/52` → clean. "census" survives only inside the disavowal "This page does not quote a live source census" (L27) — same accepted class as TICK27. |
| SELECT 20% MACE headline | **PASS (gone)** | Select-String `20% reduction`, `20% lower` → clean. Page quotes HR 0.80 (6.5% vs 8.0%) and states "This page does not headline a rounded relative-risk percent." My efetch of 37952131 confirms 569/8803 (6.5%) vs 701/8801 (8.0%), HR 0.80 (0.72–0.90; P<0.001), 39.8 mo, AE d/c 16.6% vs 8.2% — all exact. |
| SURMOUNT-1 "over 60%" | **PASS (gone)** | Select-String `over 60` → clean. Page quotes 57% (95% CI 53–61) vs 3% with "not a rounded headline above that interval." My efetch of 35658024: "57% (95% CI, 53 to 61) of participants in the … 15-mg groups had a reduction … of 20% or more, as compared with 3%" — exact. Treatment-regimen estimand named; −15.0/−19.5/−20.9 vs −3.1; AE d/c 4.3/7.1/6.2 vs 2.6 — all exact. |
| Invented SURPASS-2 kg / HbA1c-below-7% / ≥10% rows | **PASS (gone)** | Page now states the abstract does **not** publish absolute kg/arm, an HbA1c-below-7% rate, or a ≥10% weight-loss rate, "those rows were removed rather than guessed." My efetch of 34170647 confirms the disavowal is TRUE — the abstract gives HbA1c −2.01/−2.24/−2.30 vs −1.86, ETDs −0.15 (−0.28 to −0.03; P=0.02) / −0.39 (−0.51 to −0.26; P<0.001) / −0.45 (−0.57 to −0.32; P<0.001), weight ETDs −1.9/−3.6/−5.5 kg, nausea 17–22% vs 18%, diarrhea 13–16% vs 12%, vomiting 6–10% vs 8%, hypoglycemia <54 mg/dL 0.6/0.2/1.7 vs 0.4, SAE 5–7% vs 3% — and nothing else. Every quoted number exact; semaglutide 1 mg arm correctly flagged "not the 2.4 mg obesity dose." |
| Unresolved PMIDs | **PASS** | All 6 re-fetched live by me (rows 1–3); titles match YAML verbatim; qa-pmids strict exit 0. SURPASS-CVOT (41406444) correctly framed: mITT 6586 vs 6579, 801 (12.2%) vs 862 (13.1%), HR 0.92 (95.3% CI 0.83–1.01), P=0.003 noninferiority / P=0.09 superiority — "Noninferior, not superior, to dulaglutide… not a semaglutide comparison." Exact. |
| Trailing-slash compare links | **PASS** | Byte scan for `](…/)` → 0 matches. Links: `/peptides/tirzepatide`, `/peptides/semaglutide`, `/compare/wegovy-vs-zepbound`, `/blog/surmount-5-tirzepatide-vs-semaglutide` — all four targets confirmed on disk (`Get-ChildItem`). Reverse-order slug `semaglutide-vs-tirzepatide.mdx` NOT recreated; 301 `/compare/semaglutide-vs-tirzepatide` → `/compare/tirzepatide-vs-semaglutide` confirmed in `vercel.json` L252–256. |
| Dosing / purchasing / medical advice | **PASS** | qa:advice exit 0. Milligram figures are trial-arm labels copied from abstracts (5/10/15 mg; 1 mg; 1.7/2.4 mg MTD). Old FAQ's "Consult a qualified healthcare provider before considering any peptide regimen" removed; new FAQ: "This page does not recommend a combination." No price row on the page (TICK6-PRICE correctly not started — not failed per dispatch). |
| Implementer stamped own KEEP | **PASS** | TICK36.md header: "implementer note (not a KEEP)"; "Did not mark KEEP." LOOP-TASKS.md L604: "TICK36 = `tirzepatide-vs-semaglutide.mdx` awaiting Judge. Did not stamp KEEP." KEEP list stops at TICK35. |

## L4 estimand audit (the core bar)

- **STEP 1 (33567185):** primary estimand quoted verbatim-class — "effects regardless of treatment discontinuation or rescue interventions"; −14.9% vs −2.4%, ETD −12.4 (CI −13.4 to −11.5; P<0.001), responders 86.4/69.1/50.5 vs 31.5/12.0/4.9, GI d/c 4.5% vs 0.8%. PASS.
- **SURMOUNT-1 (35658024):** treatment-regimen estimand named; 15 mg −20.9% vs −3.1%; ≥20% 57% (CI 53–61). PASS.
- **SURMOUNT-5 (40353578):** LS mean −20.2% (CI −21.4 to −19.1) vs −13.7% (CI −14.9 to −12.6); waist −18.4 vs −13.0 cm; page explicitly notes the abstract names ≥10/15/20/25% categories without percents and labels no estimand — both true against my fetch. PASS.
- **SURPASS-2 (34170647):** ETDs only, no invented absolute rows; comparator dose honesty (1 mg, T2D, open-label). PASS.
- **SELECT (37952131) / SURPASS-CVOT (41406444):** HR-led, correct comparators (placebo / dulaglutide), no cross-trial swap. Sibling-programme mixup check: SURPASS-2 (T2D, sema 1 mg) vs SURMOUNT-5 (obesity, MTD) vs SURPASS-CVOT (dulaglutide) are correctly separated on the page. PASS.

## Gaming check

The cheap way to "pass" this tick would have been cosmetic: delete the census FAQ digits but keep the invented SURPASS-2 kg/HbA1c<7%/≥10% table as vague prose, swap "over 60%" for a bare "57%" without the CI, or leave the SELECT 20% headline in the metaDescription. The implementer did none of these — every stripped claim is replaced by a *true, dated* statement about what the source does and does not contain, and each disavowal independently checked out against my own efetch output (the SURPASS-2 abstract genuinely lacks the three invented row classes; the SURMOUNT-5 abstract genuinely names the four category thresholds without percents and without an estimand label). The page carries anti-regression sentences ("not a rounded headline above that interval," "those rows were removed rather than guessed," "Placebo-controlled rows are not a substitute for the head-to-head") — a prose cost, but this loop's chosen defense, not an integrity defect. The decorative-specificity risks an implementer could invent (DOI 10.1056/NEJMoa2416394, six NCT ids, five first authors, every CI bound) all reproduced exactly from live NCBI responses I fetched myself. No scope creep: locked compares and `src/content/peptides/**` untouched per the note; the reverse-order slug was not recreated; no new URLs.

## Verdict

**KEEP.** All eight dispatch fail-conditions pass; all five mandatory PMIDs plus the sixth cited PMID (SURPASS-CVOT) independently re-fetched and topical-matched; estimands correct (STEP 1 treatment-policy-style primary named, SURMOUNT-1 treatment-regimen named, SURMOUNT-5 unlabelled-estimand honestly disclosed); QA gates green (qa-pmids strict, qa:advice, qa:claims, qa:attached — flags all pre-existing and out-of-scope). Conductor may stamp LOOP-TASKS.

Out-of-scope notes for future ticks (not this loop):
- qa:attached flagged DEAD PMID 42296503 in `src/content/blog/surmount-5-tirzepatide-vs-semaglutide.mdx` (the blog, not this increment's file). My esummary shows the PMID **resolves and topical-matches** ("Benefits and Harms of Pharmacologic Treatments… Living Systematic Review and Network Meta-analysis for the American College of Physicians," Ann Intern Med 2026 Aug) — the stored title is a truncated variant, so this is a stale-title/transient-fetch class, not a fabrication. Belongs to the blog's tick.
- Pre-existing qa:attached flags in `what-is-tb-500.mdx` (DEAD 23084823) and `what-is-tesamorelin.mdx` (MISMATCH NCT03226821) — same class as TICK27's out-of-scope note.
