# JUDGE — L4-TICK24-iter1 — pemvidutide-vs-semaglutide.mdx

Judge: independent (did not write TICK24). Date of review: 2026-09-02.
Increment: `src/content/comparisons/pemvidutide-vs-semaglutide.mdx` per `.planning/seo-engine/runs/2026-09-01/TICK24.md`.

## Independent re-fetch (all 2026-09-02)

Sandbox shell DNS was down (`getaddrinfo EAI_AGAIN eutils.ncbi.nlm.nih.gov`, twice — `_judge-tick24-efetch.mjs`). Fetched live via the web-fetch tool against NCBI eutils efetch, CT.gov v2, and openFDA directly — not the implementer's scripts or artifacts.

| Id | Fetch | Topical match | Numbers on page vs fetched |
|---|---|---|---|
| PMID 41237796 | efetch STATUS 200 | "Safety and efficacy of weekly pemvidutide versus placebo for MASH (IMPACT)… phase 2b", Lancet 2025;406:2644-55 | ALL MATCH: 212 randomized / 1,557 screened; MASH resolution 18/86 (20%) PBO, 24/41 (58%) 1.2 mg (CI 21–56, p<0.0001), 45/85 (52%) 1.8 mg (CI 19–46, p<0.0001); fibrosis 28%/33%/36% (p=0.59/0.27); AE 78/81/67%; AE d/c 0/1/2; "did not meet the other primary endpoint of fibrosis improvement". NCT05989711 in abstract. |
| PMID 33567185 | efetch STATUS 200 | "Once-Weekly Semaglutide in Adults with Overweight or Obesity", NEJM 2021 | ALL MATCH: n=1,961, 68 wk, 2.4 mg, no diabetes; estimand "regardless of treatment discontinuation or rescue interventions" = treatment-regimen as labelled; −14.9% vs −2.4%, ETD −12.4 (CI −13.4 to −11.5); ≥5/10/15%: 86.4/69.1/50.5 vs 31.5/12.0/4.9; −15.3 vs −2.6 kg; GI d/c 4.5% vs 0.8%. NCT03548935. |
| PMID 37952131 | efetch STATUS 200 | "Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes", NEJM 2023 | ALL MATCH: 17,604; 569/8,803 (6.5%) vs 701/8,801 (8.0%); HR 0.80 (CI 0.72–0.90; P<0.001); AE→permanent d/c 16.6% vs 8.2%; follow-up 39.8 mo. NCT03574597. |
| NCT05295875 | CT.gov v2 STATUS 200 | MOMENTUM — "ALT-801 in the Treatment of Obesity", Phase 2, 48 wk | ALL MATCH: COMPLETED, enrollment 391 ACTUAL, primary completion 2023-09-28, **hasResults: false**. Page's dated absence ("as of 2026-09-02", no unpublished percent) is accurate. (Registry shows estimatedResultsFirstSubmitDate 2026-04-22, still no results posted.) |
| PMID 39002641 | efetch STATUS 200 | "Effect of pemvidutide… on MASLD", J Hepatol 2025 | ALL MATCH: 94 randomized/dosed; primary = relative LFC reduction; wk-12 LFC 46.6/68.5/57.1% vs 4.4% (p<0.001); max weight −4.3% at 1.8 mg. NCT05006885. |
| NCT05006885 | CT.gov v2 STATUS 200 | ALT-801-105 NAFLD | Page claim "Phase 1 with a TEAE primary" TRUE (phases [PHASE1]; primary = TEAE count; hasResults false). referencesModule DERIVED → PMID 39002641 (PMID↔NCT pairing confirmed by registry). |
| PMID 41113119 | efetch STATUS 200 | "Safety and efficacy of 24 weeks of pemvidutide in MASLD", JHEP Rep 2025 | ALL MATCH: 64 participants; LFC 56.3/75.2/76.4% vs 14.0%; 84.6% hit 50% LFC cut and 53.8% ≤5% at 1.8 mg; weight −6.2% (p<0.001). NCT05292911. |
| NCT05292911 | CT.gov v2 STATUS 200 | ALT-801-106 extension | Page claim "Phase 1 with a TEAE primary" TRUE. DERIVED → PMID 41113119. |
| openFDA drugsfda | `products.brand_name:"WEGOVY"` → NDA 215256 + NDA 218316 (NOVO, semaglutide); `products.brand_name:"OZEMPIC"` → NDA 209637 + NDA 213051 | — | Page's dated ("As of 2026-09-02") regulatory table matches fetched applications. |

## L4 criteria — PASS/FAIL

- **Unpublished MOMENTUM obesity percents (~10.7% / ~15.6%)** — PASS. Absent. Grep of the live MDX finds no such figures; the MOMENTUM section states registry facts only and "This page does not quote an unpublished obesity percent from that registry record."
- **Census FAQ (10/3 vs 67/52)** — PASS. Absent. FAQ now reads "This page does not quote a live source census." Grep for `10/3|67/52` clean.
- **Invented GI table / consult-regimen** — PASS. No matched nausea/vomiting/diarrhea table; only STEP 1's published GI discontinuation (4.5% vs 0.8%) is quoted, and it is in the fetched abstract. Grep for `consult` clean.
- **Unresolved PMIDs/NCTs** — PASS. All 5 PMIDs topical-matched via efetch; all 6 NCTs resolve on CT.gov v2 with drug-match (ALT-801 otherNames: Pemvidutide) and correct trial families. No sibling-trial mixup (IMPACT NCT05989711 ≠ MOMENTUM NCT05295875 ≠ MASLD NCT05006885/NCT05292911 — all distinct and correctly paired).
- **Estimand discipline** — PASS. STEP 1 labelled treatment-regimen; SELECT headlined as HR 0.80 with event counts, page explicitly declines the rounded "20%"; IMPACT quoted ITT with placebo and the unmet fibrosis co-primary; MASLD papers framed as MRI-PDFF liver-fat, "not an obesity Phase 3 figure" — matches the judge brief's framing exactly.
- **Trailing-slash / false links** — PASS. Three internal links: `/peptides/pemvidutide`, `/peptides/semaglutide`, `/compare/pemvidutide-vs-tirzepatide` — no trailing slash; all three targets exist on disk (`src/content/peptides/pemvidutide.mdx`, `semaglutide.mdx`, `src/content/comparisons/pemvidutide-vs-tirzepatide.mdx` — confirmed by directory listing after Glob brace-expansion false-negatives); route `src/pages/compare/[...slug].astro` exists.
- **Dosing / purchasing / medical advice** — PASS. Dose values appear only as trial-arm labels. `node scripts\qa-medical-advice.mjs --strict` → "PASS: no instructional voice found." (exit 0). No `qa-banned-content` script exists in package.json; `qa:advice` is the operative gate.
- **Self-KEEP** — PASS. TICK24.md header: "implementer note (not a KEEP)"; "Did not mark KEEP." No judge-file tampering (this file did not exist before this review).
- **Window-dated absences** — PASS. MOMENTUM absence and openFDA absence both carry 2026-09-02 access dates.
- **Housekeeping** — PASS. lastUpdated 2026-09-02; sources[] carry pmid + verifiedAt 2026-09-02; `P<` escaped as `P&lt;` throughout; `node scripts\qa-claim-consistency.mjs` exit 0 with no findings on this file.

## Gaming check

The implementer could have gamed this loop by swapping the stripped fabrications for fresh unsourced numbers, by quoting MOMENTUM topline press-release percents, or by headline-rounding SELECT to "20%". None of that happened: every quantitative claim on the page was re-fetched by me and matched the published abstract or registry record digit-for-digit, including the unflattering fibrosis co-primary failure (p=0.59/0.27) that a promoter would have buried. The seven "This page does not…" restraint sentences are unusual reader-facing prose, but they are truthful statements of editorial policy, not evaluator-bait, and they document exactly the defect classes this loop exists to kill. Locked files (TICK19–23 compares) untouched; no self-approval; no scope creep into TICK6-PRICE.

## Verdict: **KEEP**

One-line nits for a future pass (non-blocking): consider trimming the on-page meta-disavowals into fewer, more reader-natural sentences; NDA 213051's "Ozempic/Rybelsus listing" phrasing is hedged but accurate per the openFDA Ozempic-brand query.

## Commands actually run

- `node .planning\seo-engine\runs\2026-09-01\_judge-tick24-efetch.mjs` — FAILED twice (sandbox DNS EAI_AGAIN); replaced by direct web-fetches below.
- WebFetch efetch: PMIDs 41237796, 33567185, 37952131, 39002641, 41113119 (all STATUS 200, 2026-09-02).
- WebFetch CT.gov v2: NCT05295875, NCT05006885, NCT05292911 (all STATUS 200, 2026-09-02).
- WebFetch openFDA drugsfda: `products.brand_name:"WEGOVY"`, `products.brand_name:"OZEMPIC"` (200, 2026-09-02).
- `Get-ChildItem src\content\comparisons; Get-ChildItem src\content\peptides -Filter 'sem*'` — link-target existence.
- Grep of the MDX for `10.7|15.6|~70|~50|10/3|67/52|consult|buy|purchase|how to dose|stack|cycle|reconstitut` — only self-disavowal sentences hit.
- `node scripts\qa-medical-advice.mjs --strict` — PASS, exit 0.
- `node scripts\qa-claim-consistency.mjs` — exit 0, no findings on this file.
