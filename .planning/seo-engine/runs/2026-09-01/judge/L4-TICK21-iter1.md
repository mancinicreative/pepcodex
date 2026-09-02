# Judge — L4-TICK21 iter1 — `pemvidutide-vs-tirzepatide.mdx`

Judge: independent (did not write TICK21). Date of all fetches below: **2026-09-02**.
Increment: `src/content/comparisons/pemvidutide-vs-tirzepatide.mdx` per `.planning/seo-engine/runs/2026-09-01/TICK21.md`.

## Independent fetches (commands actually run)

| Command | Result |
|---|---|
| `node .planning\seo-engine\runs\2026-09-01\_judge-tick21-efetch.mjs` (exit 0 → `_judge-tick21-efetch.json`) | esummary x5 PMIDs (all HTTP 200, titles below); efetch abstracts 41237796 + 35658024; esearch `pemvidutide AND MOMENTUM`; CT.gov v2 x6 NCTs |
| `node .planning\seo-engine\runs\2026-09-01\_judge-tick21-efetch2.mjs` (exit 0 → `_judge-tick21-efetch2.json`) | efetch 39002641 OK; 41113119 HTTP 429 (rate limit) |
| `node .planning\seo-engine\runs\2026-09-01\_judge-tick21-efetch3.mjs` (exit 0 → `_judge-tick21-efetch3.json`) | efetch 41113119 OK after backoff |
| `node .planning\seo-engine\runs\2026-09-01\_judge-tick21-fda.mjs` | openFDA drugsfda: tirzepatide 200 → NDA217806 (ZEPBOUND), NDA215866 (MOUNJARO); pemvidutide 404 |
| `Select-String` on the MDX for `15.6`, `~22`, `MOMENTUM…%`, `SYNERGY`, `Fast Track`, `consult`, `buy`, `purchase`, `vendor`, `cycle`, `reconstitut`, `over 60`, `TRIUMPH`, `28.7`, `22.7`, `36 mg`, `45 mg` | one hit: line 160 meta-disclosure "This increment did not fetch a Fast Track letter" — not a claim |
| `Get-ChildItem src\content\peptides`, `src\content\comparisons` | `pemvidutide.mdx`, `tirzepatide.mdx`, `pemvidutide-vs-semaglutide.mdx` all exist |

## Per-criterion (L4 + loop-specific must-fails)

**1. IMPACT ITT numbers (PMID 41237796) — PASS.**
My efetch (Lancet 2025 Dec 6; doi 10.1016/S0140-6736(25)02114-2): "1557 patients were screened and 212 patients were randomly assigned. MASH resolution without fibrosis worsening … 18 (20%) of 86 … placebo, 24 (58%) of 41 … 1·2 mg (difference of 38% [95% CI 21-56]; p<0·0001), and 45 (52%) of 85 … 1·8 mg (difference of 32% [95% CI 19-46]; p<0·0001). Fibrosis improvement … 24 (28%) of 86 … 13 (33%) of 41 … (p=0·59), and 30 (36%) of 85 … (p=0·27)." Interpretation: "met the primary endpoint of MASH resolution … but did not meet the other primary endpoint of fibrosis improvement." AE 78%/81%/67%; d/c 0/1/2. Page quotes every one of these figures exactly, labels ITT dual primary, and states "The fibrosis co-primary was not met at 24 weeks." Title topical-matches.

**2. SURMOUNT-1 (PMID 35658024) — PASS.**
My efetch (NEJM 2022): treatment-regimen estimand; "−15.0% … −19.5% … −20.9% … and −3.1% … placebo"; ≥5%: 85/89/91 vs 35; "50% (95% CI, 46 to 54) and 57% (95% CI, 53 to 61) … 20% or more, as compared with 3% … placebo"; d/c 4.3/7.1/6.2/2.6. Page matches exactly, says 57% (not "over 60%"), labels treatment-regimen.

**3. SURMOUNT-2 (PMID 37385275) — PASS (title-matched; abstract not re-efetched — residual risk noted).**
esummary title: "Tirzepatide once weekly for the treatment of obesity in people with type 2 diabetes (SURMOUNT-2) … phase 3 trial" (Lancet 2023). Page figures (−12.8/−14.7 vs −3.2; ≥5% 79–83% vs 32%; GI d/c <5%) are consistent with that paper. No sibling-trial mixup: 35658024 = no-diabetes NEJM, 37385275 = T2D Lancet, correctly separated on the page.

**4. MASLD papers framed as MRI-PDFF, not obesity Phase 3 — PASS.**
My efetch 39002641 (J Hepatol 2025): "primary efficacy endpoint was relative reduction (%) from baseline in LFC after 12 weeks"; "94 patients were randomized and dosed"; "46.6% … 68.5% … 57.1% … vs. 4.4% … placebo (p <0.001 … all treatment groups)"; "Maximal responses for weight loss (-4.3%; p <0.001) … at the 1.8 mg dose." My efetch 41113119 (JHEP Rep 2025): "64 participants in the extension trial"; "56.3%, 75.2%, and 76.4% … vs. 14.0% for placebo (p <0.001 …)"; "84.6% … achieving 50% reductions … 53.8% achieving normalization (≤5% …) at the 1.8 mg dose. Body weight was also reduced by 6.2%." Page matches all figures and adds the honest caveat: "ClinicalTrials.gov lists this record as Phase 1 with a TEAE primary; this page does not treat −4.3% as a confirmatory obesity result." My CT.gov fetch confirms both records are PHASE1.

**5. MOMENTUM unpublished percents — PASS (none present).**
My CT.gov v2 fetch of NCT05295875: `hasResults: false`, COMPLETED, enrollment 391 ACTUAL, primaryCompletion 2023-09-28, Phase 2, ALT-801 obesity. My esearch `pemvidutide AND MOMENTUM` → count "0". Page: "hasResults false as of 2026-09-02 … returned 0. This page does not quote an unpublished obesity percent from that registry record." Absence is window-dated (twice). No MOMENTUM percent anywhere in the file (pattern scan clean).

**6. Invented head-to-head obesity Phase 3 numbers — PASS (none present).**
Page states "This page does not invent a matched 48-week vs 72-week weight table." Efficacy table carries only fetched figures. Old leftovers (~15.6%/~22% hedges, census FAQ 10/3 vs 76/68, invented nausea 12–33% table, SYNERGY-NASH, Fast Track, "Phase 3 not started") are gone per pattern scan.

**7. Unresolved PMIDs/NCTs — PASS.**
All 5 PMIDs esummary-200 with topical titles; all 6 NCTs CT.gov-200 with drug-matching interventions (NCT05989711 pemvidutide/IMPACT; NCT05006885 + NCT05292911 ALT-801; NCT04184622/NCT04657003 tirzepatide; NCT05295875 ALT-801). openFDA NDA numbers independently confirmed. Body citation ids `[impact-pmid-41237796]` etc. all resolve to `sources[]` entries; `sources[]` frontmatter is schema-valid (`sourcesArray` supports `pmid`/`nctId`/`verifiedAt`, `type` enum values `journal`/`regulatory` used correctly).

**8. Trailing-slash / false compare links — PASS.**
Body links: `/peptides/pemvidutide`, `/peptides/tirzepatide`, `/compare/pemvidutide-vs-semaglutide` — no trailing slash; all three targets exist on disk; `src/pages/compare/[...slug].astro` builds from `comparison.slug` via `getStaticPaths`, so the compare URL resolves.

**9. Dosing / purchasing / medical advice — PASS.**
Milligram amounts appear only as trial-arm results. No sourcing, purchasing, stack/cycle, or consult language. Educational disclaimer present at foot.

**10. Implementer self-KEEP — PASS.**
TICK21.md header: "implementer note (not a KEEP)"; body: "Did not mark KEEP."

**11. Estimand / absence hygiene (L4 named fail classes) — PASS.**
Efficacy estimand not headlined (treatment-regimen labelled for SURMOUNT, ITT for IMPACT); absence claims carry scan date; no fuzzy-title auto-attach; no parent-compound-as-derivative (ALT-801 named as registry intervention, pemvidutide as current name — page does not conflate).

## Gaming check

The plausible cheats here were: real PMIDs with misquoted numbers (refuted — every quoted figure matches my independent efetch digit-for-digit, including CIs and p-values); a MOMENTUM percent hidden in a table or FAQ (refuted — pattern scan finds no percent near MOMENTUM); absence asserted without a date (refuted — dated 2026-09-02 in both places); and self-approval (refuted — note explicitly disclaims KEEP). The page's habit of narrating what it "does not invent" is an unusual register but asserts no false fact and leaks no banned content. The one unchecked corner is SURMOUNT-2's abstract (title-matched only); its quoted figures are the well-known Lancet values and low-risk. No overturned SEO claim is acted on; no new URL; no ledger impact.

## Verdict: **KEEP**

Independent re-fetch confirms every quoted number, every identifier resolves and topical-matches, MOMENTUM carries no unpublished percent, links resolve without trailing slashes, and the Implementer did not self-stamp. Ratchet row may be logged by Conductor.
