# TICK73 — implementer note (not a KEEP)

Assigned file: `src/content/comparisons/5-amino-1mq-vs-pemvidutide.mdx`

Loop: L4 cited-only leftover compares. Generated census stub (11/Low vs 10/Moderate; 0 vs 3 human; Total Sources 11/10) plus truncated “showing 15.” body, combination FAQ, and consult footer. Fetch-or-strip. Do not start TICK6-PRICE. Do not mark KEEP.

Hard lock — not edited: `5-amino-1mq-vs-orforglipron.mdx` (TICK72), `5-amino-1mq-vs-vk2735.mdx` (TICK74), TICK60–TICK71 claimed files, `5-amino-1mq-vs-cagrisema`, `5-amino-1mq-vs-cagrilintide`, `5-amino-1mq-vs-semaglutide`, `5-amino-1mq-vs-amycretin`, `src/content/peptides/**`.

## Why this file

Dispatch named `src/content/comparisons/5-amino-1mq-vs-pemvidutide.mdx`. File existed (`Test-Path True`) and still carried the generated census stub (`lastUpdated` 2026-02-12; FAQ 11/10 sources and 0/3 human; source-count tables; truncated “**Pemvidutide:** … showing 15.”; combination FAQ; consult footer). Locked compares and peptide dossiers were path-checked only.

## Fetched this increment (2026-09-02)

Commands actually run:

```
git branch --show-current
Test-Path src\content\comparisons\5-amino-1mq-vs-pemvidutide.mdx
Test-Path src\content\peptides\5-amino-1mq.mdx
Test-Path src\content\peptides\pemvidutide.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-orforglipron.mdx
Test-Path src\content\comparisons\5-amino-1mq-vs-vk2735.mdx
node .planning\seo-engine\runs\2026-09-01\_tick73-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick73-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick73-write.mjs
node scripts\qa-banned-content.js src\content\comparisons\5-amino-1mq-vs-pemvidutide.mdx
node scripts\qa-medical-advice.mjs --strict
node scripts\qa-comparison-counts.mjs --strict
node .planning\seo-engine\runs\2026-09-01\_tick73-grep.mjs
```

Per-alias esearch (not OR-joined). NCBI esearch STATUS 200 (429 then retry on `"ALT-801"` and `"pemvidutide" AND MOMENTUM`). NCBI esummary STATUS 200. NCBI efetch STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (5-amino-1mq / 5-amino-1-methylquinolinium / pemvidutide / alt-801). Title-matched before quoting. Branch: `feat/scoring-and-freshness`. No `astro build`. Dev server not started.

Esearch `"5-Amino-1MQ"` count 0. `"5-amino-1-MQ"` count 0. `"5-Amino-1-methylquinolinium"` count 3 (39067875, 35013352, 33645410). `"pemvidutide"` count 13. `41237796[uid]` / `NCT05989711` → 41237796. `"5-Amino-1MQ" AND "pemvidutide"` count 0. `"5-amino-1-methylquinolinium" AND "pemvidutide"` count 0. `"pemvidutide" AND MOMENTUM` count 0. `NCT05295875` PubMed count 0.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 35013352 | Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice | DIO mice. Abstract names **5-amino-1-methylquinolinium** as the NNMTi used with a low-fat diet. Describes adiposity/weight change vs diet switch alone. **No body-weight percent.** Not a human RCT. |
| PMID 39067875 | NAD(+) metabolism enzyme NNMT in cancer-associated fibroblasts… urothelial bladder cancer | Title-matched NNMT. Used 5-Amino-1-methylquinolinium iodide in UBC mouse models. **Not an obesity RCT.** Not quoted as a weight result. |
| PMID 33645410 | Small molecule inhibitor of nicotinamide N-methyltransferase shows anti-proliferative activity in HeLa cells | **TITLE_MATCH false** (title does not name 5-amino). HeLa cells. Not quoted. |
| PMID 41237796 NCT05989711 IMPACT | Safety and efficacy of weekly pemvidutide versus placebo for metabolic dysfunction-associated steatohepatitis (IMPACT) | n assigned 212 / 1,557 screened. **ITT** dual primary. MASH resolution: **58% (1.2 mg) / 52% (1.8 mg) vs 20%**. Fibrosis co-primary **not met** (33% / 36% vs 28%; P=0.59 / 0.27). AE d/c 0 / 1% / 2%. CT.gov COMPLETED Phase 2; hasResults **false**. Lead sponsor Altimmune, Inc. Journal labels phase 2b. PubMed `NCT05989711` = 41237796 only. |
| PMID 39002641 NCT05006885 | Effect of pemvidutide… on MASLD | 94 randomised. Primary = relative LFC. Wk 12: **46.6% / 68.5% / 57.1% vs 4.4%**. Maximal weight −4.3% at 1.8 mg. CT.gov COMPLETED Phase 1; hasResults **false**. Not treated as confirmatory obesity. |
| PMID 41113119 NCT05292911 | Safety and efficacy of 24 weeks of pemvidutide in MASLD | 64 extension. LFC **56.3% / 75.2% / 76.4% vs 14.0%**. Body weight also reduced by 6.2%; abstract does **not** name the arm. CT.gov COMPLETED Phase 1; hasResults **false**. |
| NCT05295875 MOMENTUM | Efficacy and Safety of ALT-801 in the Treatment of Obesity | Official title names MOMENTUM and 48 weeks. COMPLETED Phase 2. Primary completion 2023-09-28. hasResults **false**. PubMed 0. **No obesity percent quoted.** Enrollment field was absent from this NCT payload; not invented. |
| NCT07795164 PERFORMA | Phase 3 Study… Pemvidutide in MASH | RECRUITING MASH Phase 3. hasResults **false**. No percents quoted. Not an obesity Phase 3. |
| CT.gov search | 5-Amino-1MQ / 5-amino-1-methylquinolinium / NNMT 5-amino | All **0** studies as of 2026-09-02. |
| openFDA drugsfda | generic 5-amino-1mq / 5-amino-1-methylquinolinium / pemvidutide / alt-801 | All **NOT_FOUND**. |

`"ALT-801"` PubMed returned 5 ids including oncology-era ALT-801 papers (35461369, 21994418, 20383346) and CT.gov returned NCT01326871 / NCT01625260 (urothelial / BCG). Those are a different ALT-801. **Not cited.**

## File

- `src/content/comparisons/5-amino-1mq-vs-pemvidutide.mdx`
  - Stripped census FAQ (11/Low vs 10/Moderate; 0 vs 3 human), Evidence/Key Differences source-count tables (11/10), summary “11 total sources (0 human),” truncated “showing 15.”, combination-as-unknown FAQ voice, and consult footer.
  - Dated 5-Amino-1MQ absence: street-name PubMed 0; chemical-name 3 hits, none a human obesity RCT; CT.gov 0 as of 2026-09-02. Did not invent a human obesity Phase 3.
  - Quoted DIO mouse paper as naming the compound with **no percent**. Did not invent a mouse or human RCT percent.
  - Quoted IMPACT ITT MASH resolution **58% / 52% vs 20%**. Fibrosis co-primary not met. Escaped P&lt;.
  - Quoted MASLD LFC papers as liver-fat Phase 1 registry records, not obesity Phase 3.
  - MOMENTUM: registry-only; unpublished obesity percent banned. Truncated “15.” stripped and not restored.
  - Dated H2H absence: PubMed `"5-Amino-1MQ" AND "pemvidutide"` and `"5-amino-1-methylquinolinium" AND "pemvidutide"` on 2026-09-02 returned 0.
  - openFDA: 5-amino NOT_FOUND; pemvidutide / alt-801 NOT_FOUND.
  - Linked `/peptides/5-amino-1mq`, `/peptides/pemvidutide`, `/compare/5-amino-1mq-vs-semaglutide`, `/compare/pemvidutide-vs-semaglutide` (no trailing slash). Did not edit those files. Peptide dossiers path-checked only.
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting. Did not invent a price row.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF (172 CRLF, 0 LF-only).
  - `qa-banned-content.js` on this file: PASS. `qa-medical-advice.mjs --strict`: PASS. `qa-comparison-counts.mjs --strict`: PASS (268 pages). `_tick73-grep.mjs`: leftover census FAQ strings, Consult, Who Might, `dosing`/`inject`/`protocol`/`dose`, unescaped `P<`, `$1,000`, trailing-slash hrefs, “Phase 3 validated”, MOMENTUM percent — all 0. Implementer checks only; not a KEEP.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `5-amino-1mq-vs-orforglipron.mdx`, `5-amino-1mq-vs-vk2735.mdx`, TICK60–TICK71 claimed files, `5-amino-1mq-vs-cagrisema.mdx`, `5-amino-1mq-vs-cagrilintide.mdx`, `5-amino-1mq-vs-semaglutide.mdx`, `5-amino-1mq-vs-amycretin.mdx`, or `src/content/peptides/**`.
- Did not restore census 11/10 or 0/3, the truncated “showing 15.”, an invented 5-Amino-1MQ RCT percent, or an invented obesity Phase 3.
- Did not cite PMID 33645410 (title miss) or PMID 39067875 (not obesity) as weight results.
- Did not cite oncology ALT-801 records as pemvidutide.
- Did not invent MOMENTUM enrollment or an unpublished obesity percent.
- Did not run `astro build`.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.

## 8-line summary

1. Assigned leftover cleaned: `5-amino-1mq-vs-pemvidutide.mdx` census FAQ (11/0 vs 10/3), source-count tables, truncated “showing 15.”, and consult footer stripped.
2. 5-Amino-1MQ: no human obesity RCT this run; street-name PubMed 0; CT.gov 0 as of 2026-09-02; DIO mouse abstract names the compound and publishes **no** percent (PMID 35013352).
3. IMPACT quoted as ITT MASH resolution **58% (1.2 mg) / 52% (1.8 mg) vs 20%**; fibrosis co-primary not met (PMID 41237796).
4. MASLD LFC papers quoted as MRI-PDFF, not obesity Phase 3 (PMID 39002641; PMID 41113119).
5. MOMENTUM: completed Phase 2 registry record; PubMed 0 on 2026-09-02; unpublished obesity percent not used.
6. openFDA: 5-amino NOT_FOUND; pemvidutide / ALT-801 NOT_FOUND as of 2026-09-02. H2H PubMed 0. No $1,000 row added or stripped (TICK6-PRICE). Links without trailing slash. P&lt; escaped. CRLF.
7. Implementer QA on this file passed; not a KEEP.
8. Artifact: this file. Judge not started. KEEP not stamped.

## Blockers

- Quality Judge has not scored this increment.
- TICK6-PRICE still blocked on Lucas (no price row here).
- W3-M1 OAuth.
- Remaining unlocked census leftovers are other ticks’ files. This tick edited only the assigned compare.
