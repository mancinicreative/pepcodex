# TICK28 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/survodutide-vs-semaglutide.mdx`. Do not start TICK6-PRICE. Do not mark KEEP. Do not start Judge.

## Why this file

Assigned leftover after TICK25 named it: hedged ~18–19% (unsourced 48-week class), SELECT “20% MACE”, leftover “up to 83%” MASH, consult-a-provider, invented 2025–2026 approval years. lastUpdated was 2026-02-01.

Locked files not opened: orforglipron-vs-tirzepatide, pemvidutide-vs-tirzepatide, tirzepatide-vs-retatrutide, pemvidutide-vs-semaglutide, retatrutide-vs-survodutide, maritide-vs-tirzepatide, amycretin-vs-semaglutide, `src/content/peptides/**`.

## File

- `src/content/comparisons/survodutide-vs-semaglutide.mdx`

## Stripped vs replaced

**Stripped**
- FAQ mechanism/liver-boost claims without a fetch; “83% MASH resolution”; SELECT “20% MACE” headline.
- Consult-a-provider.
- Hedged ~18–19% / ~15% obesity table (46-week trial quoted as if it were the later unfetched table).
- Invented GI “common / observed heart-rate” table without fetched percents.
- Expected-approval 2025–2026; “semaglutide not pursued for MASH.”
- Banned percents not restored and not repeated in disavowal: SYNCHRONY; 48-wk ~18.7/~19.5; OSA 63%/6%; TRIUMPH 28.7%; SCALE as ~8%; amycretin oral ~13%/~25%.

**Replaced (fetched this run)**
- SYNCHRONIZE-1 treatment-regimen: −12.2% / −13.0% vs −5.4% at 76 weeks. P&lt;0.001 escaped.
- Phase 2 obesity: **46 weeks**, 4.8 mg planned-treatment −14.9% vs −2.8%. No 48-week survodutide percent table.
- STEP 1: 2.4 mg −14.9% vs −2.4% treatment-regimen at 68 weeks.
- T2D phase 2: 16 weeks; open-label semaglutide 1.0 mg (not STEP 1); HbA1c and DG6 −8.7% vs −5.3%.
- MASH phase 2: improvement without fibrosis worsening 47% / 62% / 43% vs 14%. Not a highest-dose resolution percent.
- SYNCHRONIZE-MASLD: treatment-regimen ≥30% LFC 68.5% vs 28.6%; weight −8.7% vs −1.4%. Efficacy estimand labelled. NCT is **NCT06309992**, not LIVERAGE NCT06632457.
- SELECT: HR 0.80 with 6.5% vs 8.0%; not a 20% headline.
- openFDA: survodutide NOT_FOUND; semaglutide NDA 213051 (Ozempic, Rybelsus). Wegovy brand query timed out — not named as fetched.
- Link: `/compare/survodutide-vs-tirzepatide` (no trailing slash). Layout already emits peptide dossier hrefs.
- lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (188 CRLF / 0 LF-only).

No list-price row on this file (TICK6-PRICE: nothing to strip).

## Fetched this increment (2026-09-02)

Commands actually run:

```
node .planning\seo-engine\runs\2026-09-01\_tick28-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick28-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick28-fetch3.mjs
node .planning\seo-engine\runs\2026-09-01\_tick28-fetch4.mjs
```

Per-alias esearch (not OR-joined). NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA generic survodutide 404 / semaglutide 200. Brand-name openFDA queries timed out (`_tick28-fetch3.mjs` threw; `_tick28-fetch4.mjs` logged FAIL UND_ERR_CONNECT_TIMEOUT). Title-matched before quoting.

`SYNCHRONY[Title] AND survodutide` = **0**. `SYNCHRONIZE-1[Title] AND survodutide` missed PMID 42253238 (name is in the trial line); quoted after PMID efetch + `survodutide[Title] AND obesity AND once weekly` (id in the list) + title starts with Survodutide.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 42253238 NCT06066515 SYNCHRONIZE-1 | Survodutide Once Weekly for the Treatment of Adults with Obesity | n=725; 76 wk. **Treatment-regimen.** 3.6 mg −12.2% (CI −13.6 to −10.8); 6.0 mg −13.0% (−14.4 to −11.6); placebo −5.4% (−6.9 to −4.0). ≥5% 72.6/71.9/46.3% (P&lt;0.001). GI 80.9/89.7/47.9%. No deaths. CT.gov COMPLETED; enroll 726; hasResults **false**. Percents from the paper. |
| PMID 38330987 NCT04667377 | Survodutide obesity dose-finding phase 2 | 387 enrolled; 386 treated; **46 weeks**. Planned-treatment −6.2/−12.5/−13.2/−14.9% vs −2.8% placebo. GI 75% vs 42%. Not a 48-week table. CT.gov COMPLETED; enroll 387; hasResults true. |
| PMID 33567185 NCT03548935 STEP 1 | Once-Weekly Semaglutide in Adults with Overweight or Obesity | n=1961; 68 wk; no T2D. **Treatment-regimen.** −14.9% vs −2.4% (ETD −12.4; CI −13.4 to −11.5; P&lt;0.001). ≥5/10/15%: 86.4/69.1/50.5 vs 31.5/12.0/4.9. GI d/c 4.5% vs 0.8%. |
| PMID 37952131 NCT03574597 SELECT | Semaglutide CV outcomes in obesity without diabetes | n=17604. 569/8803 (6.5%) vs 701/8801 (8.0%). **HR 0.80** (CI 0.72–0.90; P&lt;0.001). AE d/c 16.6% vs 8.2%. Mean follow-up 39.8 mo. |
| PMID 38095657 NCT04153929 | Survodutide vs placebo and open-label semaglutide in T2D | 413 randomised; 16 wk. Semaglutide arm **1.0 mg open-label**. HbA1c −0.91 to −1.71% by DG; semaglutide −1.47%. Bodyweight up to −8.7% (DG6) vs −5.3% semaglutide. AE 77.8/52.5/52.0%. |
| PMID 38847460 NCT04771273 | Phase 2 survodutide in MASH and fibrosis | 293 treated; 48 wk. Primary: MASH improvement without fibrosis worsening 47/62/43% vs 14% (P&lt;0.001 quadratic). ≥30% LFC 63/67/57 vs 14. Fibrosis ≥1 stage 34/36/34 vs 22. Nausea 66 vs 23. **No “highest-dose resolution” percent in the abstract.** CT.gov COMPLETED; enroll 295; hasResults true. |
| PMID 42252333 NCT06309992 SYNCHRONIZE-MASLD | Survodutide in obesity + at-risk MASLD | Paper n=216 (CT.gov enroll 218); 48 wk. **Treatment-regimen leads:** ≥30% LFC 68.5% vs 28.6%; weight −8.7% vs −1.4%. Efficacy estimand: 84.2% vs 24.3%; −12.2% vs −1.0%. CT.gov COMPLETED; hasResults **false**. XML also listed LIVERAGE NCT06632457 — **RECRUITING**, enroll 1590 estimated; not this trial. |
| openFDA drugsfda | generic_name survodutide / semaglutide | Survodutide NOT_FOUND. Semaglutide NDA 213051 (Ozempic, Rybelsus). `products.brand_name:"WEGOVY"` timed out this increment. |

## Residual / not done

- Did not mark KEEP. Did not start Quality Judge. Did not run astro build.
- Did not touch locked compares or peptide dossiers.
- Did not restore SYNCHRONY, unsourced 48-wk ~18.7/~19.5, OSA 63%/6%, TRIUMPH 28.7%, SCALE as ~8%, or amycretin oral percents.
- No $1,000 row on this page (TICK6-PRICE still waiting; nothing to strip).
- Semaglutide MASH paper not fetched; “not pursued for MASH” was stripped rather than guessed.
- Wegovy openFDA row not retrieved (timeout). Page names only NDA 213051 brands.
- W3-M1 OAuth.

## Blockers

- W3-M1 OAuth still blocked on Lucas.
- TICK6-PRICE still blocked on Lucas.
- openFDA brand-name queries timed out this increment (Wegovy not quoted).
- Judge not started (brief).

## 8-line summary

1. Assigned file existed; cleaned in place; no substitute.
2. Replaced ~18–19% / ~15% with SYNCHRONIZE-1 treatment-regimen and STEP 1 −14.9% vs −2.4%.
3. Phase 2 obesity quoted as 46 weeks, 4.8 mg −14.9% vs −2.8%.
4. SELECT now HR 0.80 (6.5% vs 8.0%), not a 20% headline.
5. MASH 83% gone; primary 47/62/43% vs 14% from PMID 38847460.
6. SYNCHRONIZE-MASLD uses NCT06309992; LIVERAGE NCT06632457 labelled as a different trial.
7. FAQs no longer census/liver-boost/consult; openFDA dated; no approval year.
8. CRLF; P&lt; escaped; no KEEP stamp; no Judge; no astro build.
