# TICK70 — implementer note (not a KEEP)

Chosen file: `src/content/comparisons/aod-9604-vs-tirzepatide.mdx`

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/aod-9604-vs-tirzepatide.mdx`. Generated census stub (12/Low vs 76/High; 0 vs 68 human; Total Sources 12/76) plus combination FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK69.md claims `aod-9604-vs-ct-388.mdx`. TICK68.md claims `aod-9604-vs-cagrisema.mdx`. TICK67.md claims `aod-9604-vs-cagrilintide.mdx`. TICK66.md claims `aod-9604-vs-orforglipron.mdx`. Hard-locked also: TICK65 `5-amino-1mq-vs-tirzepatide`, TICK64 `5-amino-1mq-vs-mazdutide`, TICK63 `5-amino-1mq-vs-liraglutide`, TICK62 `5-amino-1mq-vs-maritide`, TICK60 `5-amino-1mq-vs-ct-388`, TICK61 `5-amino-1mq-vs-aod-9604`, TICK58 `5-amino-1mq-vs-cagrilintide`, TICK59 `5-amino-1mq-vs-cagrisema`, TICK45 `5-amino-1mq-vs-semaglutide`, TICK47/48 `5-amino-1mq-vs-amycretin`, and `src/content/peptides/**`. Next unlocked leftover from the preferred `aod-9604-vs-*` set: `aod-9604-vs-tirzepatide.mdx` (`lastUpdated` 2026-02-12, census FAQ 12/76 sources and 0/68 human, source-count tables, combination FAQ, consult footer, “Phase 3 validated status”). Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\aod-9604-vs-tirzepatide.mdx
Test-Path src\content\peptides\aod-9604.mdx
Test-Path src\content\peptides\tirzepatide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-tirzepatide.mdx
Test-Path src\content\comparisons\amycretin-vs-aod-9604.mdx
Test-Path src\content\comparisons\cagrilintide-vs-tirzepatide.mdx
Test-Path src\content\comparisons\tirzepatide-vs-semaglutide.mdx
Test-Path src\content\comparisons\aod-9604-vs-cagrilintide.mdx
Test-Path src\content\comparisons\aod-9604-vs-cagrisema.mdx
Test-Path src\content\comparisons\aod-9604-vs-ct-388.mdx
node .planning\seo-engine\runs\2026-09-01\_tick70-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick70-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick70-write.mjs
node scripts\qa-banned-content.js src\content\comparisons\aod-9604-vs-tirzepatide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
node .planning\seo-engine\runs\2026-09-01\_tick70-grep.mjs
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200 (first three attempts EAI_AGAIN/ENOTFOUND, then 200). NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (aod-9604 / aod9604) and 200 (tirzepatide). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"AOD-9604"` count 16. `"AOD9604"` count 22. `"AOD 9604"` count 16. `"tirzepatide"` count 2457 — not dumped. `"SURMOUNT-1"` count 58 — not dumped. `"AOD-9604" AND "tirzepatide"` count 0. `"AOD9604" AND "tirzepatide"` count 0. `"AOD-9604" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III" OR "phase 2")` count 1 (16625817). `"AOD9604"` with the same clinical-trial/phase-3 terms count 3 (42395176, 16931496, 16625817). PubMed `NCT04184622` count 22 (includes 35658024).

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 15134286 | AOD-9604 Metabolic | 2004 development profile. Metabolic was developing AOD-9604 for obesity. By February 2002 phase IIa trials were underway. **No enrollment. No percent.** Not a human RCT. Not obesity Phase 3. |
| PMID 11146367 | Metabolic studies of a synthetic lipolytic domain (AOD9604) of human growth hormone | Obese Zucker rats. 19 days. Body-weight gain **15.8 ± 0.6 vs 35.6 ± 0.8 g**. Rodent grams, not a human RCT percent. Treatment-amount line not copied. |
| PMID 11673763 | Increase of fat oxidation and weight loss in obese mice… | **TITLE_MATCH false** (title does not name AOD). Abstract names **AOD9604**. 14-day obese mice. Reduced body-weight gain; **no percent**. Did not compete for the hGH receptor. |
| PMID 11713213 | The effects of human GH and its lipolytic fragment (AOD9604)… | TITLE_MATCH. 14-day obese mice and β3-AR knock-out. Reduce body weight and body fat; knock-out lacked the long-term body-weight change. **No percent.** |
| PMID 16625817 | Obesity drugs in clinical development | **TITLE_MATCH false**. 2006 review lists AOD-9604 as an hGH fragment. Of that set, only rimonabant had completed phase III. Not an AOD-9604 Phase 3 result. |
| PMID 25208511 | Detection and in vitro metabolism of AOD9604 | Identity/doping paper. C-terminal hGH 177-191 plus N-terminal tyrosine. **No efficacy percent.** |
| PMID 26275694 | Effect of Intra-articular Injection of AOD9604… Rabbit Osteoarthritis | TITLE_MATCH. Rabbit OA. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 24976118 | …case report on AOD9604 | TITLE_MATCH. Seized-preparation identity case. No efficacy percent. Not quoted as a weight result. |
| PMID 35658024 NCT04184622 SURMOUNT-1 | Tirzepatide Once Weekly for the Treatment of Obesity | n=2539; 72 wk including 20-week escalation; 1:1:1:1. **Treatment-regimen.** 5 mg **−15.0%** (CI −15.9 to −14.2); 10 mg **−19.5%** (CI −20.4 to −18.5); 15 mg **−20.9%** (CI −21.8 to −19.9) vs placebo **−3.1%** (CI −4.3 to −1.9); P&lt;0.001. ≥5%: 85% / 89% / 91% vs 35%. ≥20% at 10 mg 50%; at 15 mg **57%** vs 3%. AE discontinuation 4.3% / 7.1% / 6.2% vs 2.6%. No nausea-percent table. CT.gov COMPLETED Phase 3; hasResults true; lead sponsor Eli Lilly and Company; primary completion 2022-04-01 actual. |
| CT.gov search | AOD-9604 / AOD9604 / AOD 9604 | All **0** studies as of 2026-09-02. |
| CT.gov search | SURMOUNT-1 | NCT04184622 COMPLETED Phase 3 hasResults true; also NCT07481747 RECRUITING Phase 3 reusing the acronym — not quoted as the 2022 result. |
| openFDA drugsfda | generic aod-9604 / aod9604 | Both **NOT_FOUND**. |
| openFDA drugsfda | generic tirzepatide | Mounjaro NDA215866 ORIG AP 2022-05-13; Zepbound NDA217806 ORIG AP 2023-11-08. |

## File

- `src/content/comparisons/aod-9604-vs-tirzepatide.mdx`
  - Stripped census FAQ (12/Low vs 76/High; 0 vs 68 human), Evidence/Key Differences source-count tables (12/76), summary “12 total sources (0 human),” combination-as-unknown FAQ voice, consult footer, and “Phase 3 validated status.”
  - Dated AOD-9604 absence: street/chemical PubMed lists fetched; none a human obesity RCT percent; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted 2004 profile as phase IIa underway by February 2002 with **no percent** (PMID 15134286).
  - Quoted rat grams (15.8 ± 0.6 vs 35.6 ± 0.8). Did not invent a mouse or human RCT percent.
  - Quoted SURMOUNT-1 treatment-regimen **−20.9% vs −3.1%** at 15 mg / 72 weeks. Arms not collapsed. CIs kept. P&lt; escaped.
  - Dated H2H absence: PubMed `"AOD-9604" AND "tirzepatide"` and `"AOD9604" AND "tirzepatide"` on 2026-09-02 returned 0.
  - openFDA: aod-9604 / aod9604 NOT_FOUND; tirzepatide Mounjaro + Zepbound as of 2026-09-02.
  - Linked `/peptides/aod-9604`, `/peptides/tirzepatide`, `/compare/5-amino-1mq-vs-aod-9604`, `/compare/amycretin-vs-aod-9604`, `/compare/5-amino-1mq-vs-tirzepatide`, `/compare/cagrilintide-vs-tirzepatide`, `/compare/tirzepatide-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (181 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages). `_tick70-grep.mjs`: leftover census FAQ strings, Consult, Who Might, `dosing`/`inject`/`protocol`, unescaped `P<`, `$1,000`, trailing-slash hrefs, “Phase 3 validated,” combination FAQ — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `aod-9604-vs-ct-388.mdx`, `aod-9604-vs-cagrisema.mdx`, `aod-9604-vs-cagrilintide.mdx`, `aod-9604-vs-orforglipron.mdx`, `5-amino-1mq-vs-tirzepatide.mdx`, `5-amino-1mq-vs-mazdutide.mdx`, `5-amino-1mq-vs-liraglutide.mdx`, `5-amino-1mq-vs-maritide.mdx`, `5-amino-1mq-vs-ct-388.mdx`, `5-amino-1mq-vs-aod-9604.mdx`, `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-cagrisema.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, other leftover `aod-9604-vs-*` census stubs, or `src/content/peptides/**`.
- Did not restore census 12/76 or 0/68, an invented AOD-9604 RCT percent, or an invented AOD-9604 obesity Phase 3.
- Did not quote NCT07481747 as the 2022 SURMOUNT-1 result.
- Did not cite PMID 26275694 (rabbit OA) or PMID 24976118 (seized-vial case) as weight results.
- Did not dump the 2,457-hit tirzepatide esearch or the 58-hit SURMOUNT-1 list into the page.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `aod-9604-vs-tirzepatide.mdx` census FAQ (12/0 vs 76/68) and consult footer stripped. TICK69 locked `aod-9604-vs-ct-388.mdx`. TICK68 locked `aod-9604-vs-cagrisema.mdx`. TICK67 locked `aod-9604-vs-cagrilintide.mdx`.
2. AOD-9604: no human obesity RCT percent this run; CT.gov 0 as of 2026-09-02; 2004 profile names phase IIa with **no percent** (PMID 15134286).
3. Rodent only: rat 19-day weight-gain 15.8 ± 0.6 vs 35.6 ± 0.8 g (PMID 11146367); mouse weight-gain reduction with **no percent** (PMID 11673763; PMID 11713213).
4. SURMOUNT-1 quoted as treatment-regimen **15 mg −20.9% vs −3.1%** at 72 weeks (PMID 35658024). Arms not collapsed. CIs kept.
5. Responder bands quoted with intervals: ≥5% at 15 mg 91% (88–94) vs 35%; ≥20% at 15 mg 57% (53–61) vs 3%.
6. openFDA: AOD-9604 NOT_FOUND; Mounjaro ORIG AP 2022-05-13; Zepbound ORIG AP 2023-11-08. H2H PubMed 0. No $1,000 row added or stripped (TICK6-PRICE). Links without trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `aod-9604-vs-*` (except TICK66 orforglipron, TICK67 cagrilintide, TICK68 cagrisema, TICK69 ct-388, and this file) and leftover `5-amino-1mq-vs-*` (except TICK45/47/48/58/59/60/61/62/63/64/65 files). One file per tick.
