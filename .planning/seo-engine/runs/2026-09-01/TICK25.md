# TICK25 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/retatrutide-vs-survodutide.mdx`. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Unlocked leftover with the highest-severity invented numbers after locked TICK19/21/23/24 files and KEEP compares were skipped.

Live defects before this increment: census FAQ (43/40 vs 34/30 sources); hedged 8 mg ~22% / 12 mg ~24%; survodutide 4.8 mg ~18–19% (the unsourced 48-week class); invented MASH “up to 83%”; consult-a-provider; invented 2025–2026 approval years; TRIUMPH named without a dated absence.

TICK13 residual (liraglutide-vs-semaglutide homology/half-life) still present but lower severity than these percents. Did not reopen KEEP trial numbers.

## File

- `src/content/comparisons/retatrutide-vs-survodutide.mdx`

## Stripped vs replaced

**Stripped**
- FAQ source census (43/40 vs 34/30).
- Consult-a-provider / combination-regimen wording.
- Hedged ~22% / ~24% / ~18–19% / ~18% summary rows.
- Unsourced “up to 83%” MASH resolution (not in PMID 38847460 or 42252333 abstracts). Not repeated in a disavowal sentence.
- Invented GI “common / dose-limiting” table without percents from a fetch.
- Expected-approval 2026+ / 2025–2026 timeline.

**Replaced (fetched this run)**
- Retatrutide phase 2: primary 24 wk 12 mg −17.5% vs −1.6%; 48 wk secondary 12 mg −24.2% vs −2.1%; combined 8 mg 48 wk −22.8%. Did not restore 4 mg 48-week −17.5%.
- SYNCHRONIZE-1 treatment-regimen: −12.2% / −13.0% vs −5.4% at 76 weeks. P&lt;0.001 escaped.
- Phase 2 obesity: **46 weeks**, 4.8 mg planned-treatment −14.9% vs −2.8%. No 48-week survodutide percent table.
- MASH phase 2: improvement in MASH without worsening of fibrosis 47% / 62% / 43% vs 14%.
- SYNCHRONIZE-MASLD: treatment-regimen ≥30% LFC 68.5% vs 28.6%; weight −8.7% vs −1.4%. Efficacy estimand labelled (84.2% / −12.2%). NCT is **NCT06309992**, not LIVERAGE NCT06632457.
- TRIUMPH: design only; dated 2026-09-02 PubMed absence; no obesity percent.
- openFDA drugsfda: no application for either name (2026-09-02).
- Links: `/peptides/retatrutide`, `/peptides/survodutide`, `/compare/tirzepatide-vs-retatrutide`, `/compare/survodutide-vs-tirzepatide` (no trailing slash).
- lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF.

## Fetched this increment (2026-09-02)

Commands actually run:

```
node .planning\seo-engine\runs\2026-09-01\_tick25-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick25-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick25-fetch3.mjs
node .planning\seo-engine\runs\2026-09-01\_tick25-fetch4.mjs
node .planning\seo-engine\runs\2026-09-01\_tick25-fetch5.mjs
```

Per-alias esearch (not OR-joined). NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (both names). Title-matched before quoting.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 37366315 NCT04881760 | Triple-hormone-receptor agonist retatrutide for obesity — phase 2 | n=338; 48 wk. **Primary = 24 wk.** LS mean 24 wk: −7.2/−12.9/−17.3/−17.5 vs −1.6% (1 / combined 4 / combined 8 / 12 mg). **48 wk secondary:** −8.7/−17.1/−22.8/−24.2 vs **−2.1%**. 12 mg ≥5/10/15%: 100/93/83 vs 27/9/2. GI dose-related, mostly mild–moderate. Abstract does **not** name treatment-regimen. **−17.5% is 12 mg at 24 wk, not 4 mg at 48 wk.** CT.gov COMPLETED; enroll 338; hasResults true. |
| PMID 38330987 NCT04667377 | Survodutide obesity dose-finding phase 2 | 387 enrolled; 386 treated; **46 weeks**. Planned-treatment −6.2/−12.5/−13.2/−14.9% vs −2.8% placebo. GI 75% vs 42%. Not a 48-week table. CT.gov COMPLETED; enroll 387; hasResults true. |
| PMID 42253238 NCT06066515 SYNCHRONIZE-1 | Survodutide once weekly for adults with obesity | n=725; 76 wk. **Treatment-regimen.** 3.6 mg −12.2% (CI −13.6 to −10.8); 6.0 mg −13.0% (−14.4 to −11.6); placebo −5.4% (−6.9 to −4.0). ≥5% 72.6/71.9/46.3% (P&lt;0.001). GI 80.9/89.7/47.9%. No deaths. CT.gov COMPLETED; enroll 726; hasResults **false**. Percents from the paper. Title search `SYNCHRONIZE-1[Title] AND survodutide` missed this paper (name is in the trial line, not the article title); quoted after PMID efetch + title names survodutide. |
| PMID 41090431 TRIUMPH design | TRIUMPH registrational programme | Four phase 3 studies; **>5,800**. Primary weight end point = % body-weight change. **No efficacy percent.** `TRIUMPH-1[Title] AND retatrutide` = **0**. `TRIUMPH[Title] AND retatrutide` = 41090431, 38323122. `retatrutide[Title] AND 28.7` = **0** (search only; 28.7 not written on the page). |
| PMID 38847460 NCT04771273 | Phase 2 survodutide in MASH and fibrosis | 293 treated; 48 wk. Primary: MASH improvement without fibrosis worsening 47/62/43% vs 14% (P&lt;0.001 quadratic). ≥30% LFC 63/67/57 vs 14. Fibrosis ≥1 stage 34/36/34 vs 22. Nausea 66 vs 23. **No “highest-dose resolution” percent in the abstract.** CT.gov COMPLETED; enroll 295; hasResults true. |
| PMID 42252333 NCT06309992 SYNCHRONIZE-MASLD | Survodutide in obesity + at-risk MASLD | n=216 (CT.gov enroll 218); 48 wk. **Treatment-regimen leads:** ≥30% LFC 68.5% vs 28.6%; weight −8.7% vs −1.4%. Efficacy estimand: 84.2% vs 24.3%; −12.2% vs −1.0%. CT.gov COMPLETED; hasResults **false**. XML also listed LIVERAGE NCT06632457 / NCT06632444 — **not** this trial (LIVERAGE-Cirrhosis RECRUITING, enroll 1590). |
| openFDA drugsfda | generic_name retatrutide / survodutide | Both NOT_FOUND. |

Not used as efficacy sources: PMID 40963161 (review; “weight loss up to 18.7%” is the banned hedge class), 39663847 (review), 42545725 (mediation post-hoc; no replacement resolution table), 38857788 (cirrhosis PK), 42642663 (erratum), 38323122 (correspondence).

## Residual risks

- **TICK13 residual** still live on `liraglutide-vs-semaglutide.mdx` (half-life ~13 h / ~165 h unsourced). Not taken; this file was higher severity.
- **Next unlocked leftovers (not edited):** `survodutide-vs-semaglutide.mdx` (~18–19% / SELECT “20% MACE” / leftover 83% MASH); `retatrutide-vs-semaglutide.mdx` (~24%); `cagrilintide-vs-semaglutide.mdx` (~6/~9/~11 and CagriSema ~15–24%); `wegovy-vs-zepbound.mdx` (76-source census + ~12–15/~15–18).
- **I-06 leftover** `vk2735-vs-tirzepatide.mdx` line still has ~22% next to a 20.9% table. REMAINING-PLAN lists that I-06 KEEP; LOOP-TASKS did not authorize that residual.
- Locked / Judge-pending: orforglipron-vs-tirzepatide, pemvidutide-vs-tirzepatide, tirzepatide-vs-retatrutide, pemvidutide-vs-semaglutide, amycretin-vs-semaglutide.
- SYNCHRONIZE-1 paper n=725 vs CT.gov 726; SYNCHRONIZE-MASLD paper n=216 vs CT.gov 218. Page quotes the paper for percents and dates the registry row.
- Did not fetch TRANSCEND-T2D-1, SURMOUNT, or a retatrutide MASH biopsy paper.
- TICK6-PRICE still waits on Lucas (no list-price row on this file).
- Did not stamp KEEP. Did not start a Quality Judge. Did not run astro build.

## Blockers

- W3-M1 OAuth still blocked on Lucas.
- TICK6-PRICE still blocked on Lucas.
- Judge pending on TICK19 / TICK21 / TICK23; TICK24 in flight on two other compares.
