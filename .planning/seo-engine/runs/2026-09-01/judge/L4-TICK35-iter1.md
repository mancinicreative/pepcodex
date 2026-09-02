# JUDGE — L4-TICK35-iter1

**Loop:** L4-TICK35 · `src/content/comparisons/mazdutide-vs-semaglutide.mdx`
**Judge:** independent (did not write the increment). Mood: critic.
**Date:** 2026-09-02 · **Verdict: KEEP**

## Independent re-fetch (commands actually run, 2026-09-02)

```
Invoke-RestMethod "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=40421736,42251595,42628555,33567185,37952131&retmode=json"   → ESUMMARY_OK
Invoke-RestMethod "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=40421736,42251595&rettype=abstract&retmode=text"              → EFETCH_GLORY_OK
Invoke-RestMethod "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=42628555,33567185,37952131&rettype=abstract&retmode=text"     → EFETCH_HSS_OK
Invoke-RestMethod "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:mazdutide&limit=1"                                              → 404
Invoke-RestMethod "https://api.fda.gov/drug/drugsfda.json?search=products.active_ingredients.name:%22semaglutide%22&limit=100"                        → TOTAL=6
Select-String -Path src\content\comparisons\mazdutide-vs-semaglutide.mdx -Pattern "medical advice","dosing","purchase","vendor","reconstitut","consult","census","SCALE","MACE","trailing"
Select-String … -Pattern "\]\(/[^)]*\)" ; "<\d" ; "High/High","18/12","67/52","~\s*7%","~\s*8%","20%"
Test-Path src\content\peptides\mazdutide.mdx / semaglutide.mdx / comparisons\mazdutide-vs-tirzepatide.mdx → True/True/True
```

Raw captures: `judge/_tick35-esummary.json`, `judge/_tick35-efetch-glory.txt`, `judge/_tick35-efetch-hsia-step-select.txt`.

Tooling note: the Grep tool returned false negatives on this file (missed "medical advice" on line 206). All string verdicts below rest on Select-String, not the Grep tool.

## Must-FAIL checklist

| # | Fail condition | Result | Evidence |
|---|---|---|---|
| 1 | census FAQ | **PASS (absent)** | Only "census" hit is line 28: "This page does not quote a live source census." No "18/12", "67/52", "High/High" anywhere. |
| 2 | SCALE as ~8% | **PASS (absent)** | No "SCALE", no "~8%" (Select-String). |
| 3 | SELECT 20% MACE headline | **PASS (absent)** | MACE appears only at lines 149/201 as "HR 0.80 (95% CI 0.72 to 0.90); 6.5% vs 8.0%". The two "20%" hits are Hsia 16 mg AE discontinuation — verified against the abstract, unrelated to MACE. |
| 4 | unlabeled Hsia as treatment-policy | **PASS** | Hsia labeled "efficacy (hypothetical) estimand" at summary, body, and cross-trial warning; page states "The abstract has no treatment-policy number." Abstract confirms: "evaluated using the efficacy (hypothetical) estimand." |
| 5 | unresolved PMIDs | **PASS** | All 5 resolve via esummary with topical title match (below). |
| 6 | trailing-slash compare links | **PASS** | Exactly 3 internal links: `/peptides/mazdutide`, `/peptides/semaglutide`, `/compare/mazdutide-vs-tirzepatide` — no trailing slash; all 3 targets exist on disk. |
| 7 | dosing / purchasing / medical advice | **PASS** | No dosing/purchasing/vendor/consult strings. "medical advice" only in the required disclaimer (line 206). |
| 8 | Implementer self-KEEP | **PASS** | TICK35.md header: "implementer note (not a KEEP)"; "Did not mark KEEP." No KEEP string in the MDX. |

## Claim-by-claim verification against this judge's fetches

| Page claim | Fetched abstract says | Result |
|---|---|---|
| GLORY-1 treatment-policy, wk32 coprimary −10.09/−12.55/+0.45%, ≥5% 73.9/82.0/10.5 | "treatment-policy estimand analysis… regardless of early discontinuation… and the initiation of new antiobesity therapies"; identical numbers | PASS |
| GLORY-1 wk48 −11.00/**−14.01**/+0.30%, ≥15% 35.7/49.5/2.0, AE d/c 1.5/0.5/1.0 | Identical in abstract | PASS |
| GLORY-1 "no nausea percent", GI most frequent, Innovent funding | Abstract: GI "most frequently reported… mostly mild to moderate"; no nausea %; "Funded by Innovent Biologics" | PASS |
| GLORY-2 9 mg 60 wk −16.65% vs −1.50%, diff −15.15%, ≥5% 84.3 vs 33.1, AE d/c 2.9 vs 0, vomiting 53.1/nausea 46.9/diarrhea 39.4 | Identical in abstract (JAMA 2026;336(5):377-388) | PASS |
| GLORY-2 estimand deliberately unlabeled | Abstract names no estimand; page: "This page does not invent that label." Correct restraint | PASS |
| Hsia 179 allocated (32/48/51/48), 32-wk efficacy (hypothetical) −7.3/−15.6/−18.1 vs −0.9, ETD −6.5 to −17.2, no 48-wk percents, 16 mg AE d/c 20%, Lilly funding | Identical in abstract (Lancet Diabetes Endocrinol 2026) | PASS |
| STEP 1 treatment-regimen −14.9% vs −2.4%, ETD −12.4 (CI −13.4 to −11.5), 86.4/69.1/50.5 vs 31.5/12.0/4.9, GI d/c 4.5% vs 0.8%, Novo funding | Identical in abstract; estimand description matches verbatim | PASS |
| SELECT n=17,604, MACE 569/8803 (6.5%) vs 701/8801 (8.0%), HR 0.80 (0.72–0.90), f/u 39.8 mo, AE d/c 16.6% vs 8.2% | Identical in abstract | PASS |
| Mazdutide NOT_FOUND on openFDA drugsfda | generic_name:mazdutide → HTTP 404 | PASS |
| Semaglutide NDAs 209637 (2017-12-05), 215256 (2021-06-04), 218316 (2025-12-22), 213051 (2019-09-20) | All 4 confirmed via active_ingredients query with matching ORIG AP dates (query also returns NDA213182 + ANDA220314; page does not claim exhaustiveness) | PASS |

## Observations (LOW — not gating)

1. Mechanism table cites `[step-1-pmid-33567185]` for "Semaglutide = GLP-1"; the STEP 1 abstract never names the receptor — the SELECT abstract on the same page does ("a glucagon-like peptide-1 receptor agonist"). Claim is true and sourced on-page; the pin is imprecise.
2. FAQ "no published clinical data on using mazdutide and semaglutide together" is an undated absence claim. Adjacent to the scan-date/window rule; recommend stamping a date next increment.
3. ~15 meta-disavowal sentences ("This page does not invent…") is heavy; consider consolidating into one methods note in a future pass. Not a violation — none assert false facts.

## Gaming check

The increment did not achieve green checks by hollowing the page: stripped fabrications (census FAQ, ~7% STEP hedge, unfetched NMPA months) were replaced with five independently re-fetched trials whose every quoted figure I re-pulled from NCBI and matched digit-for-digit, including CI bounds and discontinuation rates. Restraint is evidenced, not performative — GLORY-2's estimand is left unlabeled because the JAMA abstract genuinely names none, and Hsia's missing 48-week percents are flagged rather than invented. The disavowal density noted above is the only smell, and it pads prose, not facts. No overturned SEO claim, no URL-ledger issue (no new URL), no self-KEEP, no wrapper exit-code trust (no build run). The openFDA claim was phrased from a generic_name query that returns only 1 of 6 semaglutide applications, but the four NDAs the page lists all verify with exact dates, so the page states nothing false.

## Verdict

**KEEP.** All 8 must-fail conditions pass; 12/12 claim rows verified against independent fetches. Three LOW observations logged for the next editor; none meet the L4 fail bar. Conductor may stamp LOOP-TASKS.
