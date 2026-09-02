# TICK69 — implementer note (not a KEEP)

Chosen file: `src/content/comparisons/aod-9604-vs-ct-388.mdx`

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/aod-9604-vs-ct-388.mdx`. Generated census stub (12/Low vs 12/Moderate; 0 vs 6 human; Total Sources 12/12; FAQ claimed 6 human each) plus truncated “$2.” overview, combination FAQ, and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

TICK68.md claims `aod-9604-vs-cagrisema.mdx`. TICK67.md claims `aod-9604-vs-cagrilintide.mdx`. TICK66.md claims `aod-9604-vs-orforglipron.mdx` (awaiting Judge). Hard-locked: TICK66 orforglipron, TICK65 `5-amino-1mq-vs-tirzepatide`, TICK64 `5-amino-1mq-vs-mazdutide`, TICK63 `5-amino-1mq-vs-liraglutide`, TICK62 `5-amino-1mq-vs-maritide`, TICK60 `5-amino-1mq-vs-ct-388`, TICK61 `5-amino-1mq-vs-aod-9604`, TICK58/59 cagrilintide/cagrisema 5-amino pairs, TICK45 semaglutide, TICK47/48 amycretin, and `src/content/peptides/**`. Next unlocked leftover from the assigned `aod-9604-vs-*` set: `aod-9604-vs-ct-388.mdx` (`lastUpdated` 2026-02-12, census FAQ 12/12 sources and 0/6 human with a contradictory “6 each”, source-count tables, truncated “$2.” overview, combination FAQ, consult footer). Locked compares and peptide dossiers were not opened (path-checked only).

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\aod-9604-vs-ct-388.mdx
Test-Path src\content\peptides\aod-9604.mdx
Test-Path src\content\peptides\ct-388.mdx
Test-Path src\content\comparisons\amycretin-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-aod-9604.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-ct-388.mdx
Test-Path src\content\comparisons\amycretin-vs-ct-388.mdx
Test-Path src\content\comparisons\ct-388-vs-semaglutide.mdx
node .planning\seo-engine\runs\2026-09-01\_tick69-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick69-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick69-write.mjs
node scripts\qa-banned-content.js src\content\comparisons\aod-9604-vs-ct-388.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
node .planning\seo-engine\runs\2026-09-01\_tick69-grep.mjs
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200 (one NCT07351045 429 then retry 200). NCBI esummary STATUS 200. NCBI efetch STATUS 200 (several 429 then retry 200; one 400 then retry 200). CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (aod-9604 / aod9604 / ct-388 / ct388 / enicepatide / ro7795068). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"AOD-9604"` count 16 — not dumped. `"AOD9604"` count 22 — not dumped. `"AOD 9604"` count 16. `"CT-388"` / `"CT388"` / `"CT 388"` count 2 (41319798, 34176426). `"enicepatide"` / `"RO7795068"` count 0. `"AOD-9604" AND "CT-388"` count 0. `"AOD9604" AND "CT-388"` count 0. `"AOD-9604" AND "enicepatide"` count 0. `"AOD-9604" AND (randomized OR "clinical trial" OR "phase 3" OR "phase III" OR "phase 2")` count 1 (16625817). `"AOD9604"` with the same clinical-trial/phase-3 terms count 3 (42395176, 16931496, 16625817).

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 15134286 | AOD-9604 Metabolic | 2004 profile. Metabolic developing AOD-9604 for potential obesity treatment. By February 2002, **phase IIa trials were underway**. Abstract publishes **no enrollment, no percent**. |
| PMID 11146367 | Metabolic studies of a synthetic lipolytic domain (AOD9604) of human growth hormone | Obese Zucker **rats**. 19-day oral treatment. Weight-gain 15.8 ± 0.6 vs 35.6 ± 0.8 g. Not a human RCT percent. Treatment amount from the abstract not copied. |
| PMID 11673763 | Increase of fat oxidation and weight loss in obese mice… modified C-terminal fragment | **TITLE_MATCH false** (title does not name AOD). Abstract names **AOD9604**. Obese/lean **mice**, 14 days. Both hGH and AOD9604 reduced body-weight gain; increased fat oxidation. **No body-weight percent.** AOD9604 did not compete for the hGH receptor. |
| PMID 11713213 | The effects of human GH and its lipolytic fragment (AOD9604)… obese mice | Title match. Obese mice, 14 days. Reduced body weight and body fat. **No body-weight percent.** |
| PMID 16625817 | Obesity drugs in clinical development | **TITLE_MATCH false.** 2006 review. Lists AOD-9604 among then-in-development obesity drugs. Of **that set**, only rimonabant had completed phase III. Not an AOD-9604 Phase 3 result. |
| PMID 25208511 | Detection and in vitro metabolism of AOD9604 | Identity: C-terminal hGH 177-191 + N-terminal tyrosine. Doping-detection methods. No efficacy percent. |
| PMID 41319798 NCT04838405 | Effects of CT-388, a once-weekly signaling-biased dual GLP-1/GIP receptor agonist… | Phase 1. Single-administration 0.5–7.5 mg or four once-weekly 5–12 mg. Day 29 mean percent change **−4.7% to −8.0% vs −0.5%**. Abstract does **not** publish per-arm percents and does **not** name an estimand. CT.gov COMPLETED Phase 1; hasResults **false**. Lead sponsor Carmot Therapeutics, Inc. PubMed `NCT04838405` = 41319798 only. Enrollment field was not returned by the NCT dump this run; not invented. |
| PMID 34176426 | Emerging glucagon-like peptide 1 receptor agonists for the treatment of obesity | 2021 pipeline review. Title does **not** name CT-388. Abstract lists CT-388 among many compounds. **Not quoted** as a trial result. |
| NCT06525935 | Enicepatide (CT-388) obesity / overweight + comorbidity | COMPLETED Phase 2. Primary completion 2025-12-08 actual. hasResults **false**. PubMed 0. Design only. Enrollment not in this run’s NCT dump. |
| NCT06628362 | Enicepatide (CT-388) overweight / obesity + T2D | ACTIVE_NOT_RECRUITING Phase 2. Primary completion 2026-05-29 actual. hasResults **false**. PubMed 0. Design only. |
| NCT07351045 Enith1 / NCT07351058 Enith2 | Enicepatide (RO7795068) Phase 3 | RECRUITING. Primary completion 2028-07-24 / 2028-08-07 estimated. hasResults **false**. PubMed 0. Not quoted as results. |
| CT.gov search | AOD-9604 / AOD9604 / AOD 9604 | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic aod-9604 / aod9604 / ct-388 / ct388 / enicepatide / ro7795068 | All **NOT_FOUND**. |

## File

- `src/content/comparisons/aod-9604-vs-ct-388.mdx`
  - Stripped census FAQ (12/Low vs 12/Moderate; 0 vs 6 human; contradictory “6 each”), Evidence/Key Differences source-count tables (12/12), summary “12 total sources (0 human),” truncated “$2.” overview, combination-as-unknown FAQ voice, and consult footer.
  - Dated AOD-9604 absence: PubMed aliases returned 16/22/16 hits, none a human obesity RCT percent; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted 2004 profile as phase IIa underway by February 2002 with **no percent**. Did not invent a human RCT percent.
  - Quoted rodent weight-gain figures as rodent only. Did not copy the rat treatment-amount line. Did not headline the abstract’s “over 50%” phrase as a human percent.
  - Quoted 2006 review as listing AOD-9604; only rimonabant in that set had completed phase III. That is not an AOD Phase 3 result.
  - Quoted CT-388 Phase 1 day-29 range **−4.7% to −8.0% vs −0.5%**. Did not collapse the range. Estimand not named.
  - Dated NCT06525935 / NCT06628362 / Enith1 / Enith2 absences (hasResults false; PubMed 0 as of 2026-09-02). No unpublished Phase 2 or Phase 3 percent. Did not invent enrollment.
  - Dated H2H absence: PubMed `"AOD-9604" AND "CT-388"`, `"AOD9604" AND "CT-388"`, and `"AOD-9604" AND "enicepatide"` on 2026-09-02 returned 0.
  - openFDA: AOD-9604 / AOD9604 NOT_FOUND; CT-388 / enicepatide / ro7795068 NOT_FOUND.
  - Linked `/peptides/aod-9604`, `/peptides/ct-388`, `/compare/amycretin-vs-aod-9604`, `/compare/5-amino-1mq-vs-aod-9604`, `/compare/5-amino-1mq-vs-ct-388`, `/compare/amycretin-vs-ct-388` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a Roche acquisition price.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (212 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages). `_tick69-grep.mjs`: leftover census FAQ strings, Consult, Who Might, `dosing`/`inject`/`protocol`, unescaped `P<`, `$1,000`, `$2.`, trailing-slash hrefs — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `aod-9604-vs-orforglipron.mdx`, `aod-9604-vs-cagrilintide.mdx`, `aod-9604-vs-cagrisema.mdx`, `5-amino-1mq-vs-tirzepatide.mdx`, `5-amino-1mq-vs-mazdutide.mdx`, `5-amino-1mq-vs-liraglutide.mdx`, `5-amino-1mq-vs-maritide.mdx`, `5-amino-1mq-vs-ct-388.mdx`, `5-amino-1mq-vs-aod-9604.mdx`, `5-amino-1mq-vs-cagrisema.mdx`, `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, other leftover `aod-9604-vs-*` census stubs, or `src/content/peptides/**`.
- Did not restore census 12/12 or 0/6, an invented AOD-9604 RCT percent, or an invented AOD-9604 obesity Phase 3.
- Did not cite PMID 26275694 (rabbit OA), PMID 24976118 / 24124033 (seized-prep / WADA immunoassay), PMID 16931496 / 42395176 (reviews) as trial results, or PMID 34176426 (pipeline review) as a trial result.
- Did not dump the 16/22-hit AOD or later CT-388 Phase 3 search list into the page as results.
- Did not convert rat grams into a human percent.
- Did not invent enrollment for NCT04838405 / NCT06525935 / NCT06628362 (field absent from this run’s NCT dump).
- Did not invent a Roche “$2.” acquisition figure.
- Did not quote a Phase 2 or Phase 3 CT-388 / enicepatide percent.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Unlocked leftover cleaned: `aod-9604-vs-ct-388.mdx` census FAQ (12/0 vs 12/6, “6 each”) and consult footer stripped. TICK67 locked `aod-9604-vs-cagrilintide.mdx`. TICK68 locked `aod-9604-vs-cagrisema.mdx`.
2. AOD-9604: no human obesity RCT percent this run; CT.gov 0 as of 2026-09-02; 2004 profile says phase IIa underway by February 2002 with **no percent** (PMID 15134286).
3. Rodent only: rat 19-day weight-gain 15.8 ± 0.6 vs 35.6 ± 0.8 g (PMID 11146367); mouse weight-gain reduction with **no percent** (PMID 11673763; PMID 11713213).
4. CT-388 Phase 1 quoted as day 29 mean **−4.7% to −8.0% vs −0.5%** (PMID 41319798). Range not collapsed. Estimand not named.
5. Phase 2 NCT06525935 / NCT06628362: hasResults false and PubMed 0 as of 2026-09-02; design only. Enith1/Enith2 recruiting Phase 3; no unpublished percent.
6. openFDA: AOD-9604 NOT_FOUND; CT-388 / enicepatide / ro7795068 NOT_FOUND as of 2026-09-02. No invented approval year or AOD-9604 obesity Phase 3. No $1,000 row (TICK6-PRICE). Links without trailing slash. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `aod-9604-vs-*` (except TICK66/67/68 files and this file) and leftover `5-amino-1mq-vs-*` (except TICK45/47/48/58/59/60/61/62/63/64/65 files). One file per tick.
