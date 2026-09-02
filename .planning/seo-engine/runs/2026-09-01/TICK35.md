# TICK35 — implementer note (not a KEEP)

Loop: L4 cited-only on `mazdutide-vs-semaglutide.mdx`. Census FAQs, invented `~7%` STEP discontinuation, unlabeled STEP 1 percent without placebo, SELECT mentioned without HR, unfetched NMPA months, market speculation. Re-fetch authentic mazdutide (TICK16 KEEP'd the tirzepatide twin). Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned file present. Locked TICK16/19/21/23–34 compares and `src/content/peptides/**` not opened. Fallback `maritide-vs-semaglutide.mdx` not used.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\peptides\mazdutide.mdx
Test-Path src\content\peptides\semaglutide.mdx
node .planning\seo-engine\runs\2026-09-01\_tick35-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick35-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick35-fetch3.mjs
node scripts\qa-banned-content.js src\content\comparisons\mazdutide-vs-semaglutide.mdx
node scripts\qa-medical-advice.mjs
node scripts\qa-comparison-counts.mjs
```

Per-alias esearch (not OR-joined). NCBI esummary STATUS 200. NCBI efetch STATUS 200 (STEP 1 first remainder 429, retry 200). CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (mazdutide) / 200 (semaglutide). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 40421736 NCT05607680 GLORY-1 | Once-Weekly Mazdutide in Chinese Adults with Obesity or Overweight | n=610; China; 48 wk. **Treatment-policy.** Coprimary **week 32**: −10.09 / −12.55 / +0.45%; ≥5% 73.9 / 82.0 / 10.5% (P&lt;0.001). **Week 48 also reported:** −11.00 / **−14.01** / +0.30%; ≥15% 35.7 / 49.5 / 2.0%. AE d/c 1.5 / 0.5 / 1.0%. GI most frequent; no nausea %. CT.gov COMPLETED; enroll 610 actual; hasResults **false**. |
| PMID 42251595 NCT06164873 GLORY-2 | 9-mg Mazdutide … GLORY-2 Randomized Clinical Trial | n=461 treated (307 vs 154); 60 wk; China. Abstract does **not** name treatment-policy vs efficacy. **−16.65% vs −1.50%** (diff −15.15%; P&lt;0.001). ≥5% 84.3 vs 33.1. AE d/c 2.9 vs 0. Vomiting 53.1 vs 1.3; nausea 46.9 vs 3.2; diarrhea 39.4 vs 6.5. CT.gov enroll 462 actual; overallStatus **UNKNOWN**; hasResults **false**. |
| PMID 42628555 NCT06124807 Hsia | Efficacy and safety of mazdutide … US-based … phase 2 | n=179 randomised. **Primary = 32-week efficacy (hypothetical) estimand.** −7.3 / −15.6 / **−18.1%** vs **−0.9%**. ETD −6.5% to −17.2%. 48-wk extra reductions **without abstract percents**. 16 mg AE d/c **20%**. No treatment-policy number. CT.gov COMPLETED; enroll 179 actual; hasResults true (quoted abstract, not results module). |
| PMID 33567185 NCT03548935 STEP 1 | Once-weekly semaglutide in adults with overweight or obesity | n=1961; 68 wk; no diabetes. **Treatment-regimen** (regardless of discontinuation or rescue). **−14.9% vs −2.4%** (ETD −12.4 pp; 95% CI −13.4 to −11.5; P&lt;0.001). ≥5/10/15%: 86.4 / 69.1 / 50.5 vs 31.5 / 12.0 / 4.9. GI d/c 4.5% vs 0.8%. CT.gov COMPLETED; enroll 1961 actual; hasResults true. |
| PMID 37952131 NCT03574597 SELECT | Semaglutide and CV outcomes in obesity without diabetes | n=17,604. Primary MACE 569/8803 (**6.5%**) vs 701/8801 (**8.0%**); **HR 0.80** (0.72–0.90); P&lt;0.001. Follow-up 39.8 mo. AE d/c 16.6% vs 8.2%. Not a rounded relative-risk headline. CT.gov COMPLETED; enroll 17604 actual; hasResults true. |
| openFDA drugsfda | generic_name / brand queries | Mazdutide: **NOT_FOUND**. Semaglutide: NDA 209637 Ozempic solution ORIG AP 20171205; NDA 215256 Wegovy solution ORIG AP 20210604; NDA 218316 Wegovy tablets ORIG AP 20251222; NDA 213051 Rybelsus ORIG AP 20190920. |

Esearch `"mazdutide"[Title]` count **24**. `"GLORY-2"[Title]` count **1** (42251595). `"GLORY-1"[Title]` count **0** (quoted via PMID 40421736 title match instead).

## File

- `src/content/comparisons/mazdutide-vs-semaglutide.mdx`
  - Stripped census FAQ (18/12 vs 67/52 High/High), consult-regimen FAQ, `~7%` STEP discontinuation hedge, STEP 1 −14.9% without placebo or estimand, SELECT named without HR, unfetched NMPA June/September months, “Ozempic/Rybelsus tablets” wording, invented Common/Common GI table, market-speculation rows (expected lower / shortages / promising / investigational-while-China-approved).
  - Quoted GLORY-1 **week 32 primary** vs **week 48 also-reported** treatment-policy, including 6 mg week 48 **−14.01% vs +0.30%**. Escaped P&lt;.
  - Quoted GLORY-2 9 mg **−16.65% vs −1.50%** at 60 weeks after this-run fetch (was not previously on this page; not copied from TICK16). Did not invent an estimand label. Did not collapse GLORY-1 and GLORY-2 into one range.
  - Quoted Hsia as **efficacy (hypothetical) estimand**; no treatment-policy number; no invented 48-week percent.
  - Quoted STEP 1 treatment-regimen **−14.9% vs −2.4%**. Quoted SELECT **HR 0.80** (6.5% vs 8.0%).
  - Linked `/peptides/mazdutide`, `/peptides/semaglutide`, `/compare/mazdutide-vs-tirzepatide` (no trailing slash). Did not edit the locked tirzepatide twin.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (206 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs` site scan: PASS. `qa-comparison-counts.mjs`: PASS. Select-String battery (positive control 66): census FAQ strings, Consult, `~7%`, `20% MACE`, unescaped `\<\d`, trailing-slash hrefs — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked compares (`wegovy-vs-zepbound`, `semaglutide-vs-tirzepatide`, TICK16/19/21/23–34 files) or `src/content/peptides/**`.
- Did not restore TRIUMPH 28.7%, OSA 63%/6%, or amycretin oral ~13%/~25%. Did not repeat those percents in disavowal sentences.
- Did not fetch NMPA letters or Drugs@FDA HTML overview pages (openFDA API used).
- Did not quote Hsia 48-week percents (abstract has none).
- W3-M1 OAuth.
- TICK6-PRICE.

## 8-line summary

1. Assigned compare cleaned; census FAQs, `~7%` hedge, unlabeled STEP 1, SELECT-without-HR, and unfetched NMPA months stripped.
2. GLORY-1 6 mg week 48 **−14.01% vs +0.30%** labelled treatment-policy; week 32 is the coprimary window (PMID 40421736).
3. GLORY-2 9 mg **−16.65% vs −1.50%** at 60 weeks quoted after this-run fetch; estimand not named in the abstract (PMID 42251595).
4. Hsia US phase 2 labelled **efficacy (hypothetical) estimand**; −18.1% vs −0.9% at 32 weeks; no treatment-policy number (PMID 42628555).
5. STEP 1 quoted as treatment-regimen **−14.9% vs −2.4%** (PMID 33567185).
6. SELECT quoted as **HR 0.80** (6.5% vs 8.0%), not a relative-risk headline (PMID 37952131).
7. Mazdutide openFDA 404; semaglutide NDAs 209637 / 215256 / 218316 / 213051 fetched. Links without trailing slash. CRLF. P&lt; escaped.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- NMPA decision letters not fetched — months stripped rather than guessed.
- W3-M1 OAuth.
