# TICK45 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/5-amino-1mq-vs-semaglutide.mdx`. Census FAQ (11/0 vs 67/52) plus invented 15–17% / SELECT 9.4% / GI 30–40% / 10,000+ / 20+ rows. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK43.md assigned `amycretin-vs-cagrisema.mdx`. TICK44.md (in flight) assigned `amycretin-vs-aod-9604.mdx`. Those files were not opened. Remaining unlocked leftover after those locks + TICK39–42 / KEEP TICK20/27: this 5-amino census stub with invented semaglutide percents (`lastUpdated` 2026-02-01). Locked `ozempic-vs-wegovy`, `ozempic-vs-mounjaro`, `amycretin-vs-cagrilintide`, `amycretin-vs-vk2735`, `amycretin-vs-semaglutide`, `amycretin-vs-tirzepatide`, and `src/content/peptides/**` not opened.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\peptides\5-amino-1mq.mdx
Test-Path src\content\peptides\semaglutide.mdx
Test-Path src\content\comparisons\amycretin-vs-semaglutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-tirzepatide.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK43.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK44.md
node .planning\seo-engine\runs\2026-09-01\_tick45-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick45-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick45-fetch3.mjs
node .planning\seo-engine\runs\2026-09-01\_tick45-fetch4.mjs
node .planning\seo-engine\runs\2026-09-01\_tick45-fetch5.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-semaglutide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (5-amino-1mq / 5-amino-1-methylquinolinium / brand Wegovy) / 200 (generic semaglutide; brand Ozempic). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"5-Amino-1MQ"` count 0. `"5-amino-1-MQ"` count 0. `"5-Amino-1-methylquinolinium"` count 3 (39067875, 33645410, 35013352). `"NNMTi"` count 10 — not dumped as 5-Amino-1MQ RCTs. STEP 1 UID 33567185 count 1. SELECT UID 37952131 count 1.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice | DIO mice. Abstract names **5-amino-1-methylquinolinium** as the NNMTi used with a low-fat diet. Describes adiposity/weight change vs diet switch alone. **No body-weight percent.** Not a human RCT. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT in cancer-associated fibroblasts… urothelial bladder cancer | Title-matched NNMT. Used 5-Amino-1-methylquinolinium iodide in UBC mouse models. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase shows anti-proliferative activity in HeLa cells | **TITLE_MATCH false** (title does not name 5-amino). HeLa cells. Not quoted. |
| PMID 33707534 | Combined nicotinamide N-methyltransferase inhibition and reduced-calorie diet… obese mice | From `"NNMTi"` esearch. **Title does not name 5-amino.** Abstract is class NNMTi; no 5-amino name; no percent. Not cited as 5-Amino-1MQ. |
| PMID 33567185 STEP 1 NCT03548935 | Once-Weekly Semaglutide in Adults with Overweight or Obesity | n=1961; 68 wk. **Primary estimand regardless of discontinuation/rescue.** 2.4 mg **−14.9% vs −2.4%** (ETD −12.4 pp; CI −13.4 to −11.5; P&lt;0.001). ≥5% 86.4% vs 31.5%; ≥10% 69.1% vs 12.0%; ≥15% 50.5% vs 4.9%. kg −15.3 vs −2.6. GI d/c 4.5% vs 0.8%. No ≥20% in abstract. CT.gov COMPLETED Phase 3; enroll 1961 actual; hasResults **true**. |
| PMID 37952131 SELECT NCT03574597 | Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes | n=17,604. MACE 569/8803 (**6.5%**) vs 701/8801 (**8.0%**); **HR 0.80** (0.72–0.90); P&lt;0.001. Follow-up 39.8 mo. AE d/c 16.6% vs 8.2%. **No weight percent in abstract.** Not a percent-reduction headline. CT.gov COMPLETED Phase 3; enroll 17604 actual; hasResults **true**. |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium; brand Wegovy; generic semaglutide; brand Ozempic | 5-amino queries **NOT_FOUND**. Wegovy brand **NOT_FOUND**. Semaglutide generic / Ozempic brand: **NDA213051** (Ozempic, Rybelsus). |

## File

- `src/content/comparisons/5-amino-1mq-vs-semaglutide.mdx`
  - Stripped census FAQ (11 sources / 0 human vs 67 / 52), consult-combination, invented 15–17% programme range, SELECT 9.4% weight, GI 30–40%, 10,000+ / 20+ / millions, STEP 2/3/4 rows (abstracts not fetched this increment), unfetched FDA years, and “seek proven treatments.”
  - Dated 5-Amino-1MQ absence: street-name PubMed 0; chemical-name 3 hits, none a human obesity RCT; CT.gov 0 as of 2026-09-02.
  - Quoted DIO mouse paper as naming the compound with **no percent**. Did not invent a mouse or human RCT percent.
  - Quoted STEP 1 treatment-policy **−14.9% vs −2.4%** with placebo, ETD, CI. Escaped P&lt;.
  - Quoted SELECT HR 0.80 (6.5% vs 8.0%). Did not invent a SELECT weight percent.
  - openFDA: 5-amino NOT_FOUND; NDA213051 Ozempic/Rybelsus; Wegovy brand NOT_FOUND (not invented).
  - Linked `/peptides/5-amino-1mq`, `/peptides/semaglutide`, `/compare/amycretin-vs-semaglutide`, `/compare/5-amino-1mq-vs-tirzepatide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Kept** the ~$1,000/mo semaglutide cost cell (TICK6-PRICE). Did not invent a 5-Amino-1MQ price. Did not strip the $1,000 row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (155 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: this filename not in the remaining 20 amycretin/5-amino-vs-amycretin census mismatches. Select-String battery: census FAQ strings, Consult, Who Might, 15–17%, ~13/~25, unescaped `P<`, trailing-slash hrefs — all 0. `$1,000/mo` still present. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch TICK43 `amycretin-vs-cagrisema.mdx`, TICK44 `amycretin-vs-aod-9604.mdx`, TICK42 `ozempic-vs-wegovy.mdx`, TICK39 `ozempic-vs-mounjaro.mdx`, TICK41 `amycretin-vs-cagrilintide.mdx`, TICK40 `amycretin-vs-vk2735.mdx`, TICK27/20 KEEP twins, or `src/content/peptides/**`.
- Did not restore OSA 63%/6%, TRIUMPH 28.7%, REDEFINE 22.7/15.7, amycretin oral ~13/~25, or a 15–17% STEP range.
- Did not fetch or quote STEP 2 / STEP 3 / STEP 4 abstracts.
- Did not cite PMID 33645410 (title miss) or PMID 33707534 (class NNMTi, no 5-amino name).
- Did not invent a Wegovy NDA after brand_name NOT_FOUND.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `5-amino-1mq-vs-semaglutide.mdx` census FAQ (11/0 vs 67/52) and invented 15–17% / SELECT 9.4% / GI 30–40% rows stripped.
2. 5-Amino-1MQ: no human obesity RCT this run; street-name PubMed 0; CT.gov 0 as of 2026-09-02; DIO mouse abstract names the compound and publishes **no** percent (PMID 35013352).
3. STEP 1 quoted as treatment-policy **−14.9% vs −2.4%** at 68 weeks (PMID 33567185).
4. SELECT quoted as HR 0.80 (6.5% vs 8.0%); no weight percent in the abstract (PMID 37952131).
5. openFDA: 5-amino NOT_FOUND; semaglutide NDA213051 (Ozempic, Rybelsus); Wegovy brand NOT_FOUND. No invented approval year.
6. **Kept** ~$1,000/mo (TICK6-PRICE). Links without trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (row kept, not stripped).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `amycretin-vs-*` (except TICK43/44 files), other `5-amino-1mq-vs-*`, and `aod-9604-vs-*`. One file per tick.
