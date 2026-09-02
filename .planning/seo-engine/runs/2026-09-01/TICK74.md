Assigned file: `src/content/comparisons/5-amino-1mq-vs-vk2735.mdx`

# TICK74 — implementer note (not a KEEP)

Loop: L4 cited-only leftover compares. One file: `src/content/comparisons/5-amino-1mq-vs-vk2735.mdx`. Generated census stub (11/Low vs 5/Moderate; 0 vs 1 human; Total Sources 11/5) plus combination FAQ and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned this tick. File existed (`Test-Path` True). Still `lastUpdated` 2026-02-12 with census FAQ (11 sources vs 5; 0 vs 1 human), Evidence/Key Differences source-count tables, summary “11 total sources (0 human),” combination-as-unknown FAQ, and consult footer. No invented ~ percents and no ~$1,000/month row were on the page. Hard-locked files path-checked only and not opened for edit: TICK72 `5-amino-1mq-vs-orforglipron.mdx`, TICK73 `5-amino-1mq-vs-pemvidutide.mdx`, TICK60–TICK71 claimed files, `5-amino-1mq-vs-cagrisema`, `5-amino-1mq-vs-cagrilintide`, `5-amino-1mq-vs-semaglutide`, `5-amino-1mq-vs-amycretin`, and `src/content/peptides/**`.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Get-ChildItem src\content\comparisons -Filter "5-amino-1mq-vs-*.mdx"
Test-Path src\content\comparisons\5-amino-1mq-vs-vk2735.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-orforglipron.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-pemvidutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-semaglutide.mdx
Test-Path src\content\comparisons\vk2735-vs-semaglutide.mdx
Test-Path src\content\comparisons\amycretin-vs-vk2735.mdx
Test-Path src\content\peptides\5-amino-1mq.mdx
Test-Path src\content\peptides\vk2735.mdx
node .planning\seo-engine\runs\2026-09-01\_tick74-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick74-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick74-write.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-vk2735.mdx
node .planning\seo-engine\runs\2026-09-01\_tick74-grep.mjs
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200. NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (5-amino-1mq / 5-amino-1-methylquinolinium / vk2735). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started. First openFDA pass timed out; fetch2 retried and returned 404 NOT_FOUND.

Esearch `"5-Amino-1MQ"` count 0. `"5-amino-1-MQ"` count 0. `"5-Amino-1-methylquinolinium"` count 3 (39067875, 35013352, 33645410). `"VK2735"` count 1 (41508550). `"VK-2735"` count 0. `"VENTURE" VK2735` count 1 (41508550). `"VANQUISH" VK2735` / `"VANQUISH-1"` / `"VANQUISH-2"` count 0. `NCT06068946` count 1 (41508550). `NCT05203237` / `NCT06828055` / `NCT07104500` / `NCT07104383` count 0. `"5-Amino-1MQ" AND "VK2735"` count 0. `"5-amino-1-methylquinolinium" AND "VK2735"` count 0.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice | DIO mice. Abstract names **5-amino-1-methylquinolinium** as the NNMTi used with a low-fat diet. Describes adiposity/weight change vs diet switch alone. **No body-weight percent.** Not a human RCT. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT in cancer-associated fibroblasts… urothelial bladder cancer | Title-matched NNMT. Used 5-Amino-1-methylquinolinium iodide in UBC mouse models. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase shows anti-proliferative activity in HeLa cells | **TITLE_MATCH false** (title does not name 5-amino). HeLa cells. Not quoted. |
| PMID 41508550 NCT06068946 VENTURE | Weekly Subcutaneous VK2735, a GIP/GLP-1 Receptor Dual Agonist… 13-Week VENTURE Study | Phase 2. Primary = % weight at week 13. Mean reduction 9.2 kg (2.5 mg; **9.1%**) to 14.6 kg (15 mg; **14.7%**); placebo 1.8 kg (**1.7%**). ≥5% 93% (130/140) vs 12% (4/34). ≥10% listed as secondary; **no figure published**. GI common. Abstract does **not** name treatment-regimen vs efficacy. CT.gov COMPLETED Phase 2; enroll 176 actual; primary completion 2024-02-27 actual; hasResults **false**. PubMed `NCT06068946` = 41508550 only. |
| NCT05203237 Phase 1 | Phase 1 Study to Evaluate the Safety and Tolerability of VK2735 | COMPLETED. Enrollment 92 actual. Primary completion 2024-11-04 actual. hasResults **false**. PubMed 0. Design only. |
| NCT06828055 Phase 2 oral | VK2735 for Weight Management Phase 2 (oral formulation) | COMPLETED. Enrollment 280 actual. Primary completion 2025-06-24 actual. hasResults **false**. PubMed 0. Design only. No oral percent. |
| NCT07104500 VANQUISH 1 | VK2735 for Weight Management Phase 3 | ACTIVE_NOT_RECRUITING. Enrollment 4500 estimated. Primary completion 2027-07-01 estimated. hasResults **false**. PubMed 0. |
| NCT07104383 VANQUISH 2 | VK2735 for Weight Management Type 2 Diabetes Phase 3 | ACTIVE_NOT_RECRUITING. Enrollment 1100 estimated. Same estimated completion. hasResults **false**. PubMed 0. |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino | All **0** studies as of 2026-09-02. |
| CT.gov search | VK2735 / VK-2735 | 5 studies: NCT07104500, NCT06068946, NCT05203237, NCT06828055, NCT07104383. |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium / vk2735 | All **NOT_FOUND**. |

## File

- `src/content/comparisons/5-amino-1mq-vs-vk2735.mdx`
  - Stripped census FAQ (11/Low vs 5/Moderate; 0 vs 1 human), Evidence/Key Differences source-count tables (11/5), summary “11 total sources (0 human),” combination-as-unknown FAQ voice, and consult footer.
  - Dated 5-Amino-1MQ absence: street-name PubMed 0; chemical-name 3 hits, none a human obesity RCT; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted DIO mouse paper as naming the compound with **no percent**. Did not invent a mouse or human RCT percent.
  - Quoted VENTURE as 15 mg **14.7%** vs placebo **1.7%** at 13 weeks plus pooled ≥5% from the abstract. Estimand **not named** (abstract does not name one). Did not invent a ≥10% figure.
  - Dated NCT05203237 / NCT06828055 / VANQUISH 1/2 absences (hasResults false; PubMed 0 as of 2026-09-02). No unpublished oral percent.
  - Dated H2H absence: PubMed `"5-Amino-1MQ" AND "VK2735"` and `"5-amino-1-methylquinolinium" AND "VK2735"` on 2026-09-02 returned 0.
  - openFDA: 5-amino NOT_FOUND; vk2735 NOT_FOUND.
  - Linked `/peptides/5-amino-1mq`, `/peptides/vk2735`, `/compare/5-amino-1mq-vs-semaglutide`, `/compare/vk2735-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (169 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages). `_tick74-grep.mjs`: leftover census FAQ strings, Consult, Who Might, `dosing`/`dose`/`inject`/`protocol`, unescaped `P<`, `$1,000`, trailing-slash hrefs — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `5-amino-1mq-vs-orforglipron.mdx`, `5-amino-1mq-vs-pemvidutide.mdx`, TICK60–TICK71 claimed files, `5-amino-1mq-vs-cagrisema.mdx`, `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, or `src/content/peptides/**`.
- Did not restore census 11/5 or 0/1, an invented 5-Amino-1MQ RCT percent, or an invented 5-Amino-1MQ obesity Phase 3.
- Did not cite PMID 33645410 (title miss) or PMID 39067875 (not obesity) as a weight result.
- Did not quote a Phase 1, oral Phase 2, or VANQUISH percent.
- Did not invent a VENTURE estimand label or a ≥10% responder figure.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Assigned leftover cleaned: `5-amino-1mq-vs-vk2735.mdx` census FAQ (11/0 vs 5/1) and consult footer stripped. TICK72 locked `5-amino-1mq-vs-orforglipron.mdx`. TICK73 locked `5-amino-1mq-vs-pemvidutide.mdx`.
2. 5-Amino-1MQ: no human obesity RCT this run; street-name PubMed 0; CT.gov 0 as of 2026-09-02; DIO mouse abstract names the compound and publishes **no** percent (PMID 35013352).
3. VENTURE quoted as 15 mg **14.7%** vs placebo **1.7%** at 13 weeks; ≥5% 93% (130/140) vs 12% (4/34) (PMID 41508550). Estimand not named.
4. ≥10% listed as a secondary endpoint; abstract publishes **no** figure. Not invented.
5. Oral VK2735 (NCT06828055) and VANQUISH 1/2: hasResults false and PubMed 0 as of 2026-09-02; design only. No invented 5-Amino-1MQ obesity Phase 3.
6. openFDA NOT_FOUND for both names. H2H PubMed 0. No $1,000 row present to keep or strip (TICK6-PRICE). Links without trailing slash. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers: other `5-amino-1mq-vs-*` (except TICK45/47/48/58/59/60–65/72/73/this file) and leftover `aod-9604-vs-*`. One file per tick.
