# JUDGE — L4-TICK37 iter1 — cagrisema-vs-semaglutide.mdx

**Verdict: KEEP**
Judge: Kimi K3 (adversarial; did not write TICK37). Date of every fetch below: **2026-09-02**.
File reviewed: `src/content/comparisons/cagrisema-vs-semaglutide.mdx` (CRLF=157, LF_ONLY=0, no unescaped `<` before a digit, no trailing-slash links — verified by byte scan).

## Independent re-fetch (commands actually run, 2026-09-02)

| # | Command | Result |
|---|---|---|
| 1 | `node .planning\seo-engine\runs\2026-09-01\judge\_judge-tick37-fetch.mjs` (my script: esummary+efetch 40544433 / 33567185; three PubMed esearch 0-count claims; CT.gov v2 full NCT06131437; raw XML/JSON saved to `judge/_tick37-efetch-*.xml`, `_tick37-NCT06131437.json`) | Both PMIDs esummary 200 + efetch 200, titles topical-match YAML verbatim. CT.gov 200. All three esearches COUNT 0. |
| 2 | `curl.exe -s ".../drugsfda.json?search=products.active_ingredients.name:%22cagrilintide%22"` | HTTP 404 — no cagrilintide application. Page claim TRUE. |
| 3 | `curl.exe -s ".../drugsfda.json?search=products.brand_name:%22cagrisema%22"` | HTTP 404 — no CagriSema application. Page claim TRUE. |
| 4 | `curl.exe -s ".../drugsfda.json?search=products.brand_name:%22OZEMPIC%22&limit=100"` (same for RYBELSUS, WEGOVY; saved `_tick37-fda-*-all.json`) | OZEMPIC → NDA213051 [OZEMPIC\|RYBELSUS], NDA209637 [OZEMPIC]. RYBELSUS → NDA213051, NDA213182. WEGOVY → NDA215256, NDA218316. **All five NDAs on the page are real with correct brand attribution.** (Default limit=1 returns one app per brand; limit=100 required to see the full set.) |
| 5 | `npm run qa-pmids` | exit 0 — "PASS: every cited PMID (1327), NCT (560), and DOI (593) resolves" |
| 6 | `npm run qa:advice` | exit 0 — 932 files, no instructional voice |
| 7 | `npm run qa:claims` | exit 0 — touched file absent from all flagged clusters |
| 8 | `npm run qa:attached` | exit 0 — zero flags on the touched file (one visible flag is SURPASS-CVOT in TICK36's file, out of scope) |
| 9 | Byte scan + `git diff HEAD` + `Test-Path` on link targets + `Select-String` residual battery | See fail-condition table |

## Quote-exactness audit (page vs my efetch output)

**REDEFINE 1 (PMID 40544433, NCT05567796)** — every figure exact against the fetched abstract:
−20.4% vs −3.0%; ETD −17.3 pp; 95% CI −18.1 to −16.6; P<0.001; 21:3:3:7 randomisation (2,108 / 302 / 302 / 705; 3,417 total); Phase 3a, 68 wk, double-blind, placebo- and active-controlled; BMI ≥30 or ≥27 with complication, no diabetes; coprimary endpoints as stated; treatment-policy estimand "(consistent with the intention-to-treat principle)"; responder targets 5/20/25/30% "more likely" (P<0.001) with **no percents**; GI AEs 79.6% vs 39.9%, transient, mild-to-moderate. The page's two negative claims — "the abstract does not publish those responder percents" and "does not publish a weight-change percent for the semaglutide-alone arm" — are independently **TRUE** against my fetch.

**STEP 1 (PMID 33567185, NCT03548935)** — every figure exact:
−14.9% vs −2.4%; ETD −12.4 pp; 95% CI −13.4 to −11.5; P<0.001; ≥5/10/15%: 86.4/69.1/50.5 vs 31.5/12.0/4.9; −15.3 kg vs −2.6 kg; n=1,961; 68 wk; 2.4 mg + lifestyle; nausea/diarrhea most common; GI discontinuations 4.5% vs 0.8%. Primary estimand "assessed effects regardless of treatment discontinuation or rescue interventions" — page labels this treatment-regimen. Correct.

**NCT06131437** — CT.gov v2: COMPLETED, enrollment 809 ACTUAL, PHASE3, masking NONE, RANDOMIZED/PARALLEL, arms "CagriSema 2.4 mg/2.4 mg" vs "Tirzepatide 15 mg", primary "confirm non-inferiority … relative change in body weight" week 0→84, `hasResults: false`, acronym empty. Page's design-only framing exact; no percent quoted; absence dated 2026-09-02 with three named searches, all of which I re-ran and confirmed COUNT 0.

## Fail-condition battery (from the dispatch)

| Condition | Result | Evidence |
|---|---|---|
| Census FAQ / source-count tables | **PASS (gone)** | `git diff` shows "14 sources / 67 sources", "52 human studies compared to 6", "Evidence Level High/High" table, and "Phase 3 validated" weasel all deleted. Residual Select-String (`sources)`, `human studies`, `Evidence Level`, `Phase 3 validated`, `Preclinical`) → zero hits. |
| REDEFINE 4 / NCT06131437 percents as results | **PASS** | Page: "COMPLETED … hasResults is false as of 2026-09-02 … This page does not quote a percent from that registry record." My CT.gov fetch confirms hasResults false; my three PubMed esearches confirm 0. |
| Banned figures (22.7 / 15.7 / 23–25.5; SELECT "20% MACE"; STEP 1 wrong percents; invented CagriSema Phase 3 %) | **PASS** | Byte scan for `22.7`, `15.7`, `25.5`, `76 sources`, `67 sources`, `67 vs 52`, `20% MACE`, `REDEFINE 2` → zero hits. STEP 1 percents on page match abstract exactly. |
| Unresolved or wrong-drug PMID | **PASS** | Both PMIDs re-fetched live by me (row 1); titles match YAML verbatim; both are the correct drugs (cagrilintide+semaglutide / semaglutide). No sibling-trial mixup (REDEFINE 2 PMID 40544432 correctly absent — T2D sister trial, not in brief). |
| Trailing-slash internal links | **PASS** | Byte scan `](…/)` → 0. Links: `/peptides/cagrisema`, `/peptides/semaglutide`, `/compare/cagrisema-vs-tirzepatide` — all three targets `Test-Path` TRUE. |
| Medical advice / dosing / purchasing | **PASS** | qa:advice exit 0. Old FAQ "Do not use concurrently … would result in overdose" deleted (diff); new FAQ: "This page does not recommend a combination." Milligram figures are trial-arm labels copied from abstracts. Residual scan for `overdose`, `Do not use`, `not recommended for combination` → zero hits. No price row (TICK6-PRICE correctly not started — not failed per dispatch). |
| Implementer marked themselves KEEP | **PASS** | TICK37.md header: "implementer note (not a KEEP)"; "Did not mark KEEP." LOOP-TASKS.md KEEP chain stops at TICK36; no TICK37 KEEP line. |
| Overturned SEO claim / published more URLs | **PASS** | No new URL (existing file edited, 123+/34−). No SEO claims made. |

## L4 estimand audit (the core bar)

Treatment-policy leads for CagriSema (REDEFINE 1's own estimand, labelled on the page four times). Treatment-regimen leads for semaglutide obesity (STEP 1's primary estimand, labelled). No efficacy-estimand figure headlined anywhere. Cross-trial framing is explicitly disclaimed: "These are not a published head-to-head percent," "This page does not write a CagriSema-versus-semaglutide difference from those two placebo-controlled rows," "estimands and randomisation structures differ." The semaglutide-alone arm of REDEFINE 1 (n=302) is named without its percent being invented — the honest handling, verified against the abstract.

## Gaming check

The cheap way to "pass" this tick would have been: delete the census digits but leave the vague "High evidence" prose; quote the REDEFINE 1 semaglutide-alone arm with a percent pulled from memory (the abstract genuinely does not contain it — I checked); present −20.4% vs −14.9% as a head-to-head difference; or quietly keep the "Phase 3 validated" FDA weasel in one FAQ while cleaning the others. The implementer did none of these. Every stripped claim was replaced with a dated, true statement about what the source does and does not contain, and each disavowal independently checked out against my own fetches (responder percents absent, semaglutide-arm percent absent, STEP 1 any-GI percent absent, REDEFINE 4 results absent). The decorative-specificity risks an implementer could invent — five NDA numbers with brand attributions, the 21:3:3:7 ratio, all four arm sizes, every CI bound, the 809 enrollment, masking NONE — all reproduced exactly from live NCBI / CT.gov / openFDA responses I fetched myself (note: openFDA default limit=1 hides four of the five NDAs; the page's full list only matches reality at limit=100, which is how I verified it). The page carries many anti-regression sentences ("This page does not invent either figure," etc.) — a prose-style cost, but that is this loop's chosen defense, not an integrity defect. No scope creep: locked compares, `cagrisema-vs-tirzepatide.mdx`, and `src/content/peptides/**` untouched per the note; TICK6-PRICE not started; no new URLs.

## Verdict

**KEEP.** All eight dispatch fail-conditions pass; both PMIDs, the NCT, all three 0-count searches, and all five openFDA NDAs independently re-fetched and topical-matched; estimands correct and labelled (treatment-policy REDEFINE 1, treatment-regimen STEP 1); QA gates green (qa-pmids, qa:advice, qa:claims, qa:attached — touched file clean in all four). Conductor may stamp LOOP-TASKS.

Out-of-scope notes for future ticks (not this loop):
- The page's `openfda-semaglutide-2026-09-02` source URL is the OZEMPIC query only, while the NDA list spans three brand queries. All five NDAs verified real — a citation-completeness nit, not a fabrication. Not worth a retry loop.
- LOOP-TASKS.md has no TICK37 ledger line yet — Conductor action after this verdict.
