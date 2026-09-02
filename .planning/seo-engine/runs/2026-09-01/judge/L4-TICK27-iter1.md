# JUDGE — L4-TICK27 iter1 — amycretin-vs-semaglutide.mdx

**Verdict: KEEP**
Judge: Kimi K3 (adversarial; did not write TICK27). Date of every fetch below: **2026-09-02**.
File reviewed: `src/content/comparisons/amycretin-vs-semaglutide.mdx` (CRLF=190, LF_ONLY=0, no unescaped `<` before a digit — verified by byte scan).

## Independent re-fetch (commands actually run, 2026-09-02)

| # | Command | Result |
|---|---|---|
| 1 | `curl.exe -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=40550229,40550231&rettype=abstract&retmode=text"` | Both Lancet 2025;406(10499) abstracts returned, titles topical-match |
| 2 | `curl.exe -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=33567185,37952131&rettype=abstract&retmode=text"` | STEP 1 (NEJM 2021) + SELECT (NEJM 2023) abstracts returned, titles topical-match |
| 3 | `curl.exe -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=amycretin&retmode=json"` | `count: 21` — matches the page's dated claim; idlist includes 42532080/42532079 (correctly NOT cited) |
| 4 | `curl.exe ... api.fda.gov/drug/drugsfda.json?search=products.brand_name:"AMYCRETIN"` | HTTP 404 NOT_FOUND — dated absence claim true |
| 5 | `curl.exe ... drugsfda ... "OZEMPIC"` / `"WEGOVY"` | Ozempic → NDA213051, NDA209637; Wegovy → NDA215256, NDA218316 — all four NDAs on the page confirmed |
| 6 | `curl.exe ... clinicaltrials.gov/api/v2/studies/NCT05369390` / `NCT06064006` | COMPLETED, PHASE1, 144/ACTUAL, hasResults=false; COMPLETED, PHASE2, 125/ACTUAL, hasResults=false — both dated CT.gov sentences true |
| 7 | `npm run qa-pmids` (strict) | exit 0 — "PASS: every cited PMID (1312), NCT (556), and DOI (581) resolves" |
| 8 | `npm run qa:advice` | exit 0 — 932 files, no instructional voice |
| 9 | `npm run qa:claims` | exit 0 — STEP-1 cluster flags this file's "95%" string; that is the "95% CI" substring, not a competing efficacy value (known regex class, non-blocking) |
| 10 | `npm run qa:attached` | exit 0 — 443 OK / 3 MISMATCH / 1 DEAD, all four flagged items in unrelated blog files (retatrutide-phase-3-results-2026, semaglutide-vs-tirzepatide-2026, tesamorelin x2); zero flags on the touched file |

## Fail-condition battery (from the dispatch)

| Condition | Result | Evidence |
|---|---|---|
| Oral ~13%/~25% or any oral weight percent not in 40550229 | **PASS (absent)** | Grep `~13|~25|13%|25%` → 0 matches. My efetch of 40550229 confirms the abstract's FINDINGS report only TEAEs (364 in 89/144; GI 180/364); bodyweight to day 85 is listed as **exploratory** with no percent published. Page line: "The published abstract does not report a body-weight percent" — true. |
| Census FAQ (8/4 vs 67/52) | **PASS (gone)** | Grep `8/4|8 sources|4 human|67/52` → 0 matches. The word "census" survives only inside the disavowal "This page does not quote a live source census." Not the defect. |
| ~7% d/c hedge as data | **PASS (absent)** | Grep `~7` → 0 matches. SC section states "The abstract does not publish a discontinuation percent" — confirmed against 40550231 (abstract gives no d/c percent; only "a large number of participants withdrew… unrelated to treatment-emergent adverse events"). |
| Invented 2027+ / CagriSema timelines | **PASS (absent)** | Grep `2027|2028|CagriSema.*(2025|2026)` → 0 matches. CagriSema appears only as a two-molecule design contrast with an explicit "does not quote CagriSema trial percents." |
| Unresolved PMIDs | **PASS** | All 4 re-fetched live by me (rows 1–2). Titles match the YAML `sources[]` titles verbatim. qa-pmids strict exit 0. |
| Trailing-slash compare links | **PASS** | Grep for `](…/)` and trailing-slash hrefs → 0 matches. Links are `/peptides/amycretin`, `/peptides/semaglutide`, `/compare/amycretin-vs-tirzepatide`; all three targets exist on disk and `compare/[...slug].astro` getStaticPaths uses `comparison.slug` — link mirrors the route. |
| Dosing / purchasing / medical advice | **PASS** | qa:advice clean. Milligram figures on the page are trial-arm labels copied from the abstracts (60/20/5/1.25 mg; 2.4 mg), not instructions. No price row present (TICK6-PRICE correctly not started). |
| Implementer stamped own KEEP | **PASS** | TICK27.md header: "implementer note (not a KEEP)"; "Did not mark KEEP." LOOP-TASKS.md KEEP list stops at TICK26; no TICK27 entry. |

## L4 estimand audit (the core bar)

- **STEP 1 (33567185):** page quotes −14.9% vs −2.4%, ETD −12.4 (95% CI −13.4 to −11.5; P<0.001), responders 86.4/69.1/50.5 vs 31.5/12.0/4.9, −15.3 kg vs −2.6 kg, GI d/c 4.5% vs 0.8%, and names the **treatment-regimen** estimand ("regardless of treatment discontinuation or rescue interventions") — verbatim-consistent with the abstract's primary-estimand sentence. PASS.
- **SELECT (37952131):** 569/8,803 (6.5%) vs 701/8,801 (8.0%), HR 0.80 (0.72–0.90; P<0.001), AE d/c 16.6% vs 8.2%, 39.8 mo — all exact. Page explicitly refuses to headline a rounded "20% reduction." PASS.
- **Amycretin SC (40550231):** quoted as **secondary** endpoint with TEAE primary; all four arm pairs exact (−24.3/−1.1, −22.0/+1.9, −16.2/+2.3, −9.7/+2.0; P<0.0001 / P=0.0003). Page disclaims "not a confirmatory obesity Phase 3 treatment-regimen result." Early-phase estimated means are labelled, not swapped for a regimen estimand. PASS.
- **Amycretin oral (40550229):** no percent quoted; exploratory status named; TEAE counts exact. PASS.
- **Sibling-trial mixup check:** 40550229 = oral FIH, 40550231 = subcutaneous — adjacent Lancet PMIDs, correctly attributed (the classic swap this loop exists to catch). PASS.
- **Absence claims:** every one is window-dated ("as of 2026-09-02" / "on 2026-09-02") — openFDA 404, CT.gov hasResults false, PubMed count 21. PASS.

## Gaming check

The cheap way to "pass" this tick would have been cosmetic: delete the census FAQ numbers but keep the conference-extrapolated oral ~13% attributed to the Lancet paper, or keep the ~7% d/c as a vague hedge, or swap the disavowals for silence. The implementer did none of these — every stripped claim is replaced by a *true, dated* statement about what the source does and does not contain, and the page adds anti-regression guardrails ("does not quote a conference-extrapolated oral weight-change percent," "does not annualize early amycretin results," "does not invent a matched 36-week vs 68-week weight table"). The prose cost is real — the page now carries many meta-sentences about what it refuses to say — but that is this loop's chosen defense against re-fabrication, not an integrity defect, and each disavowal independently checked out against my own fetches. The one soft spot I probed hard: the "21 records" PubMed claim and the four NDA numbers are exactly the kind of decorative specificity an implementer could invent; both reproduced exactly from the live APIs. No unresolved identifiers, no self-KEEP, no scope creep into locked files (TICK19–26 files untouched per the note; nothing in the increment contradicts their KEEPs).

## Verdict

**KEEP.** All eight dispatch fail-conditions pass; all four mandatory PMIDs independently re-fetched and topical-matched; estimands correct (treatment-regimen leads for STEP 1; amycretin early-phase numbers labelled secondary/exploratory); QA gates green (qa-pmids strict, qa:advice, qa:claims, qa:attached — the last two with only pre-existing, out-of-scope flags). Conductor may stamp LOOP-TASKS.

Out-of-scope note for future ticks (not this loop): qa:attached flagged 3 MISMATCH + 1 DEAD in `retatrutide-phase-3-results-2026.mdx`, `semaglutide-vs-tirzepatide-2026.mdx`, `tesamorelin-liver-fat-hiv.mdx`, `what-is-tesamorelin.mdx`. Not introduced by TICK27.
