# TICK67 — implementer note (not a KEEP)

Chosen file: `src/content/comparisons/aod-9604-vs-cagrilintide.mdx`

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/aod-9604-vs-cagrilintide.mdx`. Generated census stub (12/Low vs 34/High; 0 vs 27 human; Total Sources 12/34) plus combination FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK66.md claims `aod-9604-vs-orforglipron.mdx`. TICK65.md claims `5-amino-1mq-vs-tirzepatide.mdx`. TICK64.md claims `5-amino-1mq-vs-mazdutide.mdx`. Hard-locked also: TICK63 `5-amino-1mq-vs-liraglutide`, TICK62 `5-amino-1mq-vs-maritide`, TICK60 `5-amino-1mq-vs-ct-388`, TICK61 `5-amino-1mq-vs-aod-9604`, TICK58 `5-amino-1mq-vs-cagrilintide`, TICK59 `5-amino-1mq-vs-cagrisema`, TICK45 `5-amino-1mq-vs-semaglutide`, TICK47/48 `5-amino-1mq-vs-amycretin`, and `src/content/peptides/**`. Next unlocked leftover from the preferred `aod-9604-vs-*` set: `aod-9604-vs-cagrilintide.mdx` (`lastUpdated` 2026-02-12, census FAQ 12/34 sources and 0/27 human, source-count tables, combination FAQ, consult footer, “Phase 3 validated status”). Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Get-ChildItem src\content\comparisons -Filter "aod-9604-vs-*.mdx"
Get-ChildItem src\content\comparisons -Filter "5-amino-1mq-vs-*.mdx"
Test-Path src\content\comparisons\aod-9604-vs-cagrilintide.mdx
Test-Path src\content\comparisons\aod-9604-vs-orforglipron.mdx
Test-Path src\content\comparisons\amycretin-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-cagrilintide.mdx
Test-Path src\content\comparisons\cagrilintide-vs-tirzepatide.mdx
Test-Path src\content\comparisons\cagrilintide-vs-semaglutide.mdx
Test-Path src\content\peptides\aod-9604.mdx
Test-Path src\content\peptides\cagrilintide.mdx
Test-Path .planning\seo-engine\runs\2026-09-01\TICK65.md
Test-Path .planning\seo-engine\runs\2026-09-01\TICK66.md
node .planning\seo-engine\runs\2026-09-01\_tick67-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick67-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick67-write.mjs
node scripts\qa-banned-content.js src\content\comparisons\aod-9604-vs-cagrilintide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
node .planning\seo-engine\runs\2026-09-01\_tick67-grep.mjs
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200 (429 then retry on PMID 40544433 and NCT03856047). CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (aod-9604 / aod9604 / cagrilintide). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"AOD-9604"` count 16. `"AOD9604"` count 22. `"AOD 9604"` count 16. `"cagrilintide"` count 97 — not dumped. `"CagriSema"` count 70 — not dumped. `"REDEFINE 1"` count 1 (40544433). `"AOD-9604" AND "cagrilintide"` count 0. `"AOD9604" AND "cagrilintide"` count 0. `"AOD-9604" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III" OR "phase 2")` count 1 (16625817). `"AOD9604"` with the same clinical-trial/phase-3 terms count 3 (42395176, 16931496, 16625817).

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 15134286 | AOD-9604 Metabolic | 2004 development profile. Metabolic was developing AOD-9604 for obesity. By February 2002 phase IIa trials were underway. **No enrollment. No percent.** Not a human RCT. Not obesity Phase 3. |
| PMID 11146367 | Metabolic studies of a synthetic lipolytic domain (AOD9604) of human growth hormone | Obese Zucker rats. 19 days. Body-weight gain **15.8 ± 0.6 vs 35.6 ± 0.8 g**. Rodent grams, not a human RCT percent. Treatment-amount line not copied. |
| PMID 11673763 | Increase of fat oxidation and weight loss in obese mice… | **TITLE_MATCH false** (title does not name AOD). Abstract names **AOD9604**. 14-day obese mice. Reduced body-weight gain; **no percent**. Did not compete for the hGH receptor. |
| PMID 16625817 | Obesity drugs in clinical development | **TITLE_MATCH false**. 2006 review lists AOD-9604 as an hGH fragment. Of that set, only rimonabant had completed phase III. Not an AOD-9604 Phase 3 result. |
| PMID 25208511 | Detection and in vitro metabolism of AOD9604 | Identity/doping paper. C-terminal hGH 177-191 plus N-terminal tyrosine. **No efficacy percent.** |
| PMID 26275694 | Effect of Intra-articular Injection of AOD9604… Rabbit Osteoarthritis | TITLE_MATCH. Rabbit OA. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 34798060 NCT03856047 | Once-weekly cagrilintide for weight management… phase 2 trial | n=706 (100–102 per cagrilintide arm; 99 liraglutide 3.0 mg; 101 placebo); 26 wk. **Trial-product** 0.3–4.5 mg **6.0%–10.8% vs 3.0%** (ETD 3.0–7.8; P&lt;0.001). 4.5 mg **10.8% vs liraglutide 3.0 mg 9.0%** (ETD 1.8; P=0.03). Treatment-policy “similar”; **no separate treatment-policy percent table**. GI 41%–63% vs 32%; nausea 20%–47% vs 18%. No 2.4 mg row invented. CT.gov COMPLETED Phase 2; enroll 706 actual; hasResults true; lead sponsor Novo Nordisk A/S. PubMed `NCT03856047` = 34798060 only. |
| PMID 40544433 NCT05567796 REDEFINE 1 | Coadministered Cagrilintide and Semaglutide in Adults with Overweight or Obesity | n=3417; 68 wk; 21:3:3:7 (2108 / 302 / 302 / 705). **Treatment-policy.** CagriSema **−20.4% vs −3.0%** (ETD −17.3; CI −18.1 to −16.6; P&lt;0.001). Cagrilintide-alone arm named (n=302); **abstract does not publish that arm’s percent**. GI 79.6% vs 39.9%. CT.gov ACTIVE_NOT_RECRUITING Phase 3; enroll 3400 estimated; hasResults **false**. Lead sponsor Novo Nordisk A/S. PubMed `NCT05567796` = 41328546, 40544433. |
| PMID 41328546 NCT05567796 | CagriSema Reduces Blood Pressure… REDEFINE 1 | Blood-pressure secondary/post hoc. **Not** quoted as a weight-change result. Not used for a cagrilintide-alone percent. |
| CT.gov search | AOD-9604 / AOD9604 / AOD 9604 | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic aod-9604 / aod9604 / cagrilintide | All **NOT_FOUND**. |

## File

- `src/content/comparisons/aod-9604-vs-cagrilintide.mdx`
  - Stripped census FAQ (12/Low vs 34/High; 0 vs 27 human), Evidence/Key Differences source-count tables (12/34), summary “12 total sources (0 human),” combination-as-unknown FAQ voice, consult footer, and “Phase 3 validated status.”
  - Dated AOD-9604 absence: street/chemical PubMed lists fetched; none a human obesity RCT percent; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted 2004 profile as phase IIa underway by February 2002 with **no percent** (PMID 15134286).
  - Quoted rat grams (15.8 ± 0.6 vs 35.6 ± 0.8). Did not invent a mouse or human RCT percent.
  - Quoted Phase 2 trial-product range **6.0%–10.8% vs 3.0%**; 4.5 mg vs liraglutide 9.0%. Escaped P&lt;. Did not invent a 2.4 mg monotherapy row.
  - Quoted REDEFINE 1 treatment-policy **−20.4% vs −3.0%** as CagriSema, not cagrilintide-alone.
  - Dated H2H absence: PubMed `"AOD-9604" AND "cagrilintide"` and `"AOD9604" AND "cagrilintide"` on 2026-09-02 returned 0.
  - openFDA: aod-9604 / aod9604 NOT_FOUND; cagrilintide NOT_FOUND.
  - Linked `/peptides/aod-9604`, `/peptides/cagrilintide`, `/compare/amycretin-vs-aod-9604`, `/compare/5-amino-1mq-vs-aod-9604`, `/compare/5-amino-1mq-vs-cagrilintide`, `/compare/cagrilintide-vs-tirzepatide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (189 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages). `_tick67-grep.mjs`: leftover census FAQ strings, Consult, Who Might, `dosing`/`inject`/`protocol`, unescaped `P<`, `$1,000`, trailing-slash hrefs, “Phase 3 validated,” combination FAQ — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `aod-9604-vs-orforglipron.mdx`, `5-amino-1mq-vs-tirzepatide.mdx`, `5-amino-1mq-vs-mazdutide.mdx`, `5-amino-1mq-vs-liraglutide.mdx`, `5-amino-1mq-vs-maritide.mdx`, `5-amino-1mq-vs-ct-388.mdx`, `5-amino-1mq-vs-aod-9604.mdx`, `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-cagrisema.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, or `src/content/peptides/**`.
- Did not restore census 12/34 or 0/27, an invented AOD-9604 RCT percent, or an invented AOD-9604 obesity Phase 3.
- Did not quote a cagrilintide-alone percent from REDEFINE 1.
- Did not cite PMID 26275694 (rabbit OA), PMID 41328546 (BP paper), or PMID 42395176 (title miss) as weight results.
- Did not dump the 97-hit cagrilintide esearch into the page.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `aod-9604-vs-cagrilintide.mdx` census FAQ (12/0 vs 34/27) and consult footer stripped. TICK66 locked `aod-9604-vs-orforglipron.mdx`. TICK65 locked `5-amino-1mq-vs-tirzepatide.mdx`.
2. AOD-9604: no human obesity RCT percent this run; CT.gov 0 as of 2026-09-02; 2004 profile names phase IIa with **no percent** (PMID 15134286).
3. Rodent only: rat 19-day weight-gain 15.8 ± 0.6 vs 35.6 ± 0.8 g (PMID 11146367); mouse weight-gain reduction with **no percent** (PMID 11673763).
4. Cagrilintide Phase 2 quoted as trial-product **6.0%–10.8% vs 3.0%** at 26 weeks (PMID 34798060). Arms not collapsed. No invented 2.4 mg row.
5. REDEFINE 1 quoted as CagriSema treatment-policy **−20.4% vs −3.0%** (PMID 40544433). Cagrilintide-alone arm named without a percent.
6. openFDA: AOD-9604 NOT_FOUND; cagrilintide NOT_FOUND as of 2026-09-02. H2H PubMed 0. No $1,000 row added or stripped (TICK6-PRICE). Links without trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `aod-9604-vs-*` (except TICK66 orforglipron and this file) and other `5-amino-1mq-vs-*` (except TICK45/47/48/58/59/60/61/62/63/64/65 files). One file per tick.
