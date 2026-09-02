# TICK64 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/5-amino-1mq-vs-mazdutide.mdx`. Generated census stub (11/Low vs 18/High; 0 vs 12 human; Total Sources 11/18) plus combination FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK63.md was **absent** at first dispatch (Test-Path False), then landed claiming `5-amino-1mq-vs-liraglutide.mdx`. This tick had started that leftover, then restored TICK63's write via `_tick63-write.mjs` (148 CRLF, 0 LF-only) and did not keep that file. TICK62.md claims `5-amino-1mq-vs-maritide.mdx`. TICK60 locked `5-amino-1mq-vs-ct-388.mdx`. TICK61 locked `5-amino-1mq-vs-aod-9604.mdx`. Hard-locked also: TICK58 `5-amino-1mq-vs-cagrilintide`, TICK59 `5-amino-1mq-vs-cagrisema`, TICK45 `5-amino-1mq-vs-semaglutide`, TICK47/48 `5-amino-1mq-vs-amycretin`, and `src/content/peptides/**`. Next unlocked generated census stub: `5-amino-1mq-vs-mazdutide.mdx` (`lastUpdated` 2026-02-12, census FAQ 11/18 sources and 0/12 human, source-count tables, combination FAQ, consult footer). Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Get-ChildItem src\content\comparisons -Filter "5-amino-1mq-vs-*.mdx"
Get-ChildItem src\content\comparisons -Filter "aod-9604-vs-*.mdx"
Test-Path .planning\seo-engine\runs\2026-09-01\TICK62.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK63.md
Test-Path src\content\peptides\5-amino-1mq.mdx
Test-Path src\content\peptides\liraglutide.mdx
Test-Path src\content\peptides\mazdutide.mdx
node .planning\seo-engine\runs\2026-09-01\_tick64-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick64-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick64-fetch3.mjs
node .planning\seo-engine\runs\2026-09-01\_tick64-fetch4.mjs
node .planning\seo-engine\runs\2026-09-01\_tick64-fetch5.mjs
node .planning\seo-engine\runs\2026-09-01\_tick63-write.mjs
node .planning\seo-engine\runs\2026-09-01\_tick64-maz-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick64-maz-write.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-mazdutide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
node .planning\seo-engine\runs\2026-09-01\_tick64-maz-grep.mjs
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200 (429 then retry). CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (5-amino-1mq / 5-amino-1-methylquinolinium / mazdutide / ibi362 / ly3305677). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"5-Amino-1MQ"` count 0. `"5-amino-1-MQ"` count 0. `"5-Amino-1-methylquinolinium"` count 3 (39067875, 35013352, 33645410). `"5-Amino-1MQ" AND "mazdutide"` count 0. `"5-amino-1-methylquinolinium" AND "mazdutide"` count 0. `"mazdutide" AND GLORY-1[Title]` count 0 (GLORY-1 is in the conclusions line, not the title). `"mazdutide" AND GLORY-2[Title]` count 1 (42251595). `40421736[uid]` / `NCT05607680` → 40421736. `42251595[uid]` / `NCT06164873` → 42251595. `42628555[uid]` / `NCT06124807` → 42628555.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice | DIO mice. Abstract names **5-amino-1-methylquinolinium** as the NNMTi used with a low-fat diet. Describes adiposity/weight change vs diet switch alone. **No body-weight percent.** Not a human RCT. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT in cancer-associated fibroblasts… urothelial bladder cancer | Title-matched NNMT. Used 5-Amino-1-methylquinolinium iodide in UBC mouse models. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase shows anti-proliferative activity in HeLa cells | **TITLE_MATCH false** (title does not name 5-amino). HeLa cells. Not quoted. |
| PMID 40421736 NCT05607680 GLORY-1 | Once-Weekly Mazdutide in Chinese Adults with Obesity or Overweight | n=610. **Treatment-policy.** Wk 32: **−10.09% / −12.55% / +0.45%**; ≥5% 73.9 / 82.0 / 10.5%. Wk 48: −11.00% / −14.01% / +0.30%; ≥15% 35.7 / 49.5 / 2.0%. AE d/c 1.5 / 0.5 / 1.0%. CT.gov COMPLETED Phase 3; hasResults **false**. Lead sponsor Innovent Biologics (Suzhou) Co. Ltd. PubMed `NCT05607680` = 40421736 only. |
| PMID 42251595 NCT06164873 GLORY-2 | Treatment With 9-mg Mazdutide… The GLORY-2 Randomized Clinical Trial | 461 treated (307 / 154). 60 wk. **−16.65% vs −1.50%** (diff −15.15%). ≥5% 84.3 vs 33.1. Analyses in participants who received at least one administration. Abstract does **not** name treatment-policy vs efficacy. Vomiting 53.1 vs 1.3; nausea 46.9 vs 3.2; diarrhea 39.4 vs 6.5. AE d/c 2.9 vs 0. CT.gov UNKNOWN Phase 3; hasResults **false**. PubMed `NCT06164873` = 42251595 only. |
| PMID 42628555 NCT06124807 | Efficacy and safety of mazdutide… US-based… phase 2 | n=179. Primary = 32-week **efficacy (hypothetical) estimand**. **−7.3% / −15.6% / −18.1% vs −0.9%**. ETD −6.5 to −17.2%. 48-wk extra reductions **without abstract numbers**. 16 mg AE d/c 20%. CT.gov COMPLETED Phase 2; hasResults **true**. Lead sponsor Eli Lilly and Company. PubMed `NCT06124807` = 42628555 only. |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium / mazdutide / ibi362 / ly3305677 | All **NOT_FOUND**. |

Liraglutide fetches (SCALE PMID 26132939; LEADER PMID 27295427; Victoza ORIG AP 2010-01-25; Saxenda ORIG AP 2014-12-23) were run before TICK63 locked that leftover. Those figures were **not** written onto the mazdutide page. TICK63's liraglutide file was restored and left locked.

## File

- `src/content/comparisons/5-amino-1mq-vs-mazdutide.mdx`
  - Stripped census FAQ (11/Low vs 18/High; 0 vs 12 human), Evidence/Key Differences source-count tables (11/18), summary “11 total sources (0 human),” combination-as-unknown FAQ voice, consult footer, and “Phase 3 validated status.”
  - Dated 5-Amino-1MQ absence: street-name PubMed 0; chemical-name 3 hits, none a human obesity RCT; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted DIO mouse paper as naming the compound with **no percent**. Did not invent a mouse or human RCT percent.
  - Quoted GLORY-1 treatment-policy week-32 **−10.09% / −12.55% vs +0.45%**. Arms not collapsed. Escaped P&lt;.
  - Quoted GLORY-2 as −16.65% vs −1.50% in the treated set. Did not invent a treatment-policy label.
  - Quoted US phase 2 as a 32-week **efficacy (hypothetical) estimand**. Did not invent 48-week percents.
  - Dated H2H absence: PubMed `"5-Amino-1MQ" AND "mazdutide"` and `"5-amino-1-methylquinolinium" AND "mazdutide"` on 2026-09-02 returned 0.
  - openFDA: 5-amino NOT_FOUND; mazdutide / ibi362 / ly3305677 NOT_FOUND. No invented NMPA letter.
  - Linked `/peptides/5-amino-1mq`, `/peptides/mazdutide`, `/compare/5-amino-1mq-vs-semaglutide`, `/compare/mazdutide-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (169 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages). `_tick64-maz-grep.mjs`: leftover census FAQ strings, Consult, Who Might, `dosing`/`inject`/`protocol`/`dose`, unescaped `P<`, `$1,000`, trailing-slash hrefs, “Phase 3 validated” — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not keep the mid-tick liraglutide edit after TICK63 landed; restored `_tick63-write.mjs`.
- Did not touch locked `5-amino-1mq-vs-liraglutide.mdx`, `5-amino-1mq-vs-maritide.mdx`, `5-amino-1mq-vs-ct-388.mdx`, `5-amino-1mq-vs-aod-9604.mdx`, `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-cagrisema.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, or `src/content/peptides/**`.
- Did not restore census 11/18 or 0/12, an invented 5-Amino-1MQ RCT percent, or an invented 5-Amino-1MQ obesity Phase 3.
- Did not cite PMID 33645410 (title miss) or PMID 39067875 (not obesity) as weight results.
- Did not collapse GLORY-1 arms or convert the US phase 2 efficacy estimand into a treatment-policy headline.
- Did not invent unpublished 48-week US phase 2 percents.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `5-amino-1mq-vs-mazdutide.mdx` census FAQ (11/0 vs 18/12) and consult footer stripped. TICK63 locked `5-amino-1mq-vs-liraglutide.mdx` (restored). TICK62 locked `5-amino-1mq-vs-maritide.mdx`.
2. 5-Amino-1MQ: no human obesity RCT this run; street-name PubMed 0; CT.gov 0 as of 2026-09-02; DIO mouse abstract names the compound and publishes **no** percent (PMID 35013352).
3. GLORY-1 quoted as treatment-policy week 32 **−10.09% / −12.55% vs +0.45%** (PMID 40421736). Arms not collapsed.
4. GLORY-2 quoted as **−16.65% vs −1.50%** at 60 weeks in the treated set (PMID 42251595). Estimand not named in the abstract.
5. US phase 2 quoted as 32-week **efficacy (hypothetical) estimand** −7.3% / −15.6% / −18.1% vs −0.9% (PMID 42628555). No invented 48-week percent.
6. openFDA: 5-amino NOT_FOUND; mazdutide / IBI362 / LY3305677 NOT_FOUND as of 2026-09-02. H2H PubMed 0. No $1,000 row added or stripped (TICK6-PRICE). Links without trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `5-amino-1mq-vs-*` (except TICK45/47/48/58/59/60/61/62/63 files and this file) and `aod-9604-vs-*`. One file per tick.
