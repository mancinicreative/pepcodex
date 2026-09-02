# TICK31 — implementer note (not a KEEP)

Loop: L4 cited-only on `retatrutide-vs-semaglutide.mdx`. Census FAQs, ~24% hedge, 48-week secondary presented as the result, invented GI/metabolic tables, SELECT “20% MACE” headline, TRIUMPH as if results existed. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned file. Census FAQ (43/40 vs 67/52 sources), unlabeled Phase 2 48-week table, ~24%, invented nausea ranges, fat-mass/liver-fat/A1C rows, SELECT 20% MACE, TRIUMPH “ongoing” without a fetch. Locked TICK19–30 files and `src/content/peptides/**` not opened.

## Fetched this increment (2026-09-02)

Commands: `node .planning\seo-engine\runs\2026-09-01\_tick31-fetch.mjs` then `_tick31-fetch2.mjs` then `_tick31-fetch3.mjs` then `_tick31-fetch4.mjs`. Per-alias esearch (not OR-joined). NCBI efetch STATUS 200 (first run EAI_AGAIN, retry 200). CT.gov v2 STATUS 200 after dropping invalid `PrimaryOutcomeMeasures` field (first batch 400). openFDA drugsfda STATUS 404 (retatrutide) / 200 (semaglutide NDAs). Title-matched.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 37366315 NCT04881760 | Triple-hormone-receptor agonist retatrutide for obesity — phase 2 | n=338; 48 wk. **Primary = 24 wk.** LS mean 24 wk: −7.2/−12.9/−17.3/−17.5 vs −1.6% (1 / combined 4 / combined 8 / 12 mg). **48 wk secondary:** −8.7/−17.1/−22.8/−24.2 vs **−2.1%**. 12 mg ≥5/10/15%: 100/93/83 vs 27/9/2. GI dose-related, mostly mild–moderate. HR increase peaked wk 24 then declined. Abstract does **not** name treatment-regimen. **−17.5% is 12 mg at 24 wk, not 4 mg at 48 wk.** CT.gov COMPLETED; hasResults true. |
| PMID 33567185 NCT03548935 STEP 1 | Once-weekly semaglutide in adults with overweight or obesity | n=1961; 68 wk; no diabetes. **Treatment-regimen** (regardless of discontinuation or rescue). **−14.9% vs −2.4%** (ETD −12.4 pp; 95% CI −13.4 to −11.5; P&lt;0.001). ≥5/10/15%: 86.4/69.1/50.5 vs 31.5/12.0/4.9. GI d/c 4.5% vs 0.8%. |
| PMID 33625476 NCT03611582 STEP 3 | Semaglutide vs placebo as adjunct to intensive behavioral therapy | n=611; 68 wk; IBT + initial low-calorie diet. **−16.0% vs −5.7%**. ≥5% 86.6% vs 47.6%. GI AE 82.8% vs 63.2%; GI d/c 3.4% vs 0%. Abstract does **not** name treatment-regimen. |
| PMID 36216945 NCT03693430 STEP 5 | Two-year effects of semaglutide (STEP 5) | n=304; 104 wk. **Treatment-regimen.** **−15.2% vs −2.6%** (ETD −12.6 pp; P&lt;0.0001). ≥5% 77.1% vs 34.4%. GI AE 82.2% vs 53.9%. |
| PMID 37952131 NCT03574597 SELECT | Semaglutide and CV outcomes in obesity without diabetes | n=17,604; mean follow-up 39.8 mo. Primary MACE 569/8803 (**6.5%**) vs 701/8801 (**8.0%**); **HR 0.80** (0.72–0.90); P&lt;0.001. AE d/c 16.6% vs 8.2%. Not a rounded relative-risk headline. |
| PMID 41090431 TRIUMPH design | TRIUMPH registrational programme | Four phase 3 studies; **>5,800**. Primary weight end point = % body-weight change. **No efficacy percent.** PubMed `"TRIUMPH-1" retatrutide weight` = **1** (this paper). `retatrutide[Title] AND 28.7` = **0**. |
| NCT05929066 / 05929079 / 05882045 / 05931367 / 06383390 | TRIUMPH-1/2/3/4 / Outcomes | 1–4 COMPLETED (2335 / 1152 / 1946 / 445 actual); hasResults **false**. Outcomes ACTIVE_NOT_RECRUITING; 10000 estimated; completion 2029-02 estimated; hasResults **false**. |
| openFDA drugsfda | generic_name / brand / NDA queries | Retatrutide: NOT_FOUND. Semaglutide: NDA 209637 Ozempic SC (ORIG AP 20171205); NDA 215256 Wegovy SC; NDA 218316 Wegovy oral tablets; NDA 213051 Rybelsus oral (+ Ozempic oral tablets listed on that NDA). |

## File

- `src/content/comparisons/retatrutide-vs-semaglutide.mdx`
  - Stripped census FAQ (43/40 vs 67/52), consult, ~24% hedge, invented nausea 25–45% table, fat-mass −39% / liver-fat −81% / A1C −2.0%, SELECT 20% MACE headline, “1,000–2,000+ per trial,” “FDA-approved since 2017,” “7+ years,” NASH/MASH row, undated TRIUMPH-as-results.
  - Quoted Phase 2 **primary 24 wk vs secondary 48 wk** with placebo. Escaped P&lt; and BMI &lt;30.
  - Quoted STEP 1 treatment-regimen −14.9% vs −2.4%. Labeled STEP 3 IBT+LCD. Quoted STEP 5 treatment-regimen −15.2% vs −2.6%.
  - Quoted SELECT HR 0.80 with 6.5% vs 8.0% event rates.
  - Dated TRIUMPH absence without a percent. Did not write 28.7%.
  - Linked `/peptides/retatrutide`, `/peptides/semaglutide` (no trailing slash).
  - **No** ~$1,000/month row on this page (TICK6-PRICE still waiting; nothing to strip).
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked TICK19–30 compares or `src/content/peptides/**`.
- Did not restore TRIUMPH 28.7%, OSA 63%/6%, SYNCHRONY, or amycretin oral ~13%/~25%. Did not repeat those percents in disavowal sentences.
- Did not fetch PMID 38858523 (liver fat); metabolic rows stripped.
- Did not fetch TRANSCEND-T2D-1.
- Drugs@FDA HTML overview pages not fetched (openFDA API used).
- W3-M1 OAuth.
- TICK6-PRICE.

## 8-line summary

1. Assigned compare cleaned; census FAQs, ~24%, invented GI/metabolic tables, and SELECT rounded MACE headline stripped.
2. Phase 2 12 mg −24.2% vs −2.1% labeled **48-week secondary**; **−17.5% is 12 mg at 24 weeks (primary)**.
3. STEP 1 quoted as treatment-regimen −14.9% vs −2.4% (PMID 33567185).
4. SELECT quoted as HR 0.80 (6.5% vs 8.0%), not a relative-risk headline (PMID 37952131).
5. TRIUMPH: design paper + CT.gov COMPLETED/hasResults false; dated 2026-09-02 absence; no unpublished weight percent.
6. Retatrutide openFDA 404; semaglutide NDAs 209637 / 215256 / 218316 / 213051 fetched.
7. Links `/peptides/retatrutide` and `/peptides/semaglutide`; CRLF; P&lt; escaped.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still waiting (no price row here).
- W3-M1 OAuth.
