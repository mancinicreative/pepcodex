# TICK-FRESH-HIGH — W2-F High Dossier Implementer

Date: 2026-09-02  
Role: L5 freshness implementer (not Judge). **Do not stamp KEEP.**  
Net URL delta: **0** (existing dossiers + new `data/source-packs/*.json` files; `/trials` is one index).

## Slugs taken (≤3, unused vs LOOP-TASKS KEEP)

E1/TR1/R1/D1 already KEEP’d retatrutide, survodutide, oveporexton, orforglipron, cagrisema, cagrilintide, mazdutide, maritide.

| Slug | Why High | Files |
|---|---|---|
| `ecnoglutide` | PMID 42412371 “First Approvals” + 9 new NCTs | `src/content/peptides/ecnoglutide.mdx`, `data/source-packs/ecnoglutide.json` (new) |
| `rusfertide` | 2 new NCTs; TR1 residual “stretch rusfertide skipped” | `src/content/peptides/rusfertide.mdx`, `data/source-packs/rusfertide.json` (new) |
| `pemvidutide` | Named GRADE MA + IMPACT status + Phase 3 PERFORMA | `src/content/peptides/pemvidutide.mdx`, `data/source-packs/pemvidutide.json` (new) |

Also touched: `data/trial-match-aliases.json` (verification-only codes: XW003 / VRB-101 / TAK-121 / ALT-801; orthographic `econoglutide` for NCT07734311 brief-title typo). **Not** added as public dossier aliases. VRB-103 was **not** added as an ecnoglutide alias.

HARD LOCK: no `src/content/comparisons/**`, no blogs, no new peptide slugs, no scoring-number edits.

## IDs fetched this run (command + date)

Command: `node .planning/seo-engine/runs/2026-09-01/_fetch-fresh-high.mjs`  
Date: **2026-09-02**. Raw dump: `_fetch-fresh-high.json` (13 PMIDs, 15 NCTs, all HTTP 200).

PubMed `efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract` (eutils, UA PepCodex-verify/1.0):

| PMID | Topical? | Used |
|---|---|---|
| 42412371 | Yes — ecnoglutide named; journal “first approvals” in China | Cited as **journal**, not as NMPA/FDA |
| 42310888 | Yes — Phase 1 DDI; rosuvastatin AUC GMR 106% (94–120%), digoxin 84% (76–94%); exploratory 11.2% weight / 14 wk labelled as Phase 1 | Cited |
| 42137314 | Yes — Phase 1 DDI; metformin/warfarin AUC inside 80–125% bounds | Cited |
| 42603384 | Names ecnoglutide among 9 GLP-1s in an LC-HRMS method | **Skipped** (analytical) |
| 42651699 | Generic GLP-1 review; abstract does not name ecnoglutide | **Skipped** |
| 42660705 | Yes — rusfertide named; Blood Reviews | Cited; no new percent |
| 42547880 | Yes — ASH 2025 letter names rusfertide | Cited; no numeric endpoint |
| 42466131 | Abstract is schisandrin A / hycanthone small-molecule screen; **does not name rusfertide** | **Not attached** |
| 41879841 | Yes — pemvidutide GRADE MA | keyFinding `type: meta-analysis` |
| 42529769 | Cureus class SR of dual/triple polyagonists | **Skipped** (SOP) |
| 41696398 | SUD CT.gov SR; pemvidutide is 1 of 33 records, no pemvidutide endpoint | **Skipped** |
| 41661442 | PK-principles paper; pemvidutide listed among conjugated peptides | **Skipped** |
| 42195239 | MASLD incretin review; names tirzepatide/cotadutide/retatrutide, **not pemvidutide** | **Skipped** |

CT.gov `https://clinicaltrials.gov/api/v2/studies/<NCT>?format=json` (2026-09-02). Drug-match on intervention name **before** storing title:

| NCT | Intervention match | Status (norm) | hasResults | Pack |
|---|---|---|---|---|
| NCT07281937 | VRB-101 | completed | false | ecnoglutide |
| NCT07553299 | VRB-101 | active | false | ecnoglutide |
| NCT07243171 | ecnoglutide tablets | recruiting | false | ecnoglutide |
| NCT07628127 | VRB-101 (+ VRB-103) | recruiting | false | ecnoglutide |
| NCT07734311 | Ecnoglutide Injection | recruiting | false | ecnoglutide (brief title misspells Econoglutide; official title + intervention are Ecnoglutide) |
| NCT07434050 | XW003 injection | recruiting | false | ecnoglutide |
| NCT07387094 | XW003 injection | recruiting | false | ecnoglutide |
| NCT07073417 | XW003 injection vs semaglutide | active | false | ecnoglutide |
| NCT07143227 | XW003 injection | completed | false | ecnoglutide |
| NCT07648030 | Rusfertide | recruiting | false | rusfertide |
| NCT07765602 | Rusfertide (official title TAK-121) | not yet recruiting | false | rusfertide |
| NCT07795164 PERFORMA | Pemvidutide | recruiting | false | pemvidutide |
| NCT07009860 RESTORE | Pemvidutide | active | false | pemvidutide |
| NCT06987513 RECLAIM | Pemvidutide | completed | false | pemvidutide |
| NCT05989711 IMPACT | Pemvidutide | completed | false | pemvidutide (updatedTrials; figures stay PMID 41237796) |

openFDA (2026-09-02, `node` fetch):

- `GET https://api.fda.gov/drug/drugsfda.json?search=ecnoglutide` → **404** “No matches found!”
- `…?search=XW003` → **404**
- `GET https://api.fda.gov/drug/label.json?search=openfda.generic_name:ecnoglutide` → **404**

EMA medicines search (`https://www.ema.europa.eu/en/medicines?search_api_views_fulltext=ecnoglutide`) **timed out**. No EPAR retrieved.

## What changed

**ecnoglutide.mdx** — `lastUpdated` 2026-09-02; summary leads with journal-reported China approvals + dated regulator absence; `regulatoryStatus` stays **investigational** with openFDA 404 + EMA timeout; body adds DDI GMRs (treatment-policy Phase 3 percents not invented); lists fetched NCTs; did **not** copy milligram doses from 42310888; did **not** flip status to approved.

**rusfertide.mdx** — dated window note; VERIFY 77% still labelled sponsor topline (no new VERIFY paper in window); attached 42660705 / 42547880; added Japan/China Phase 2 NCTs; 42466131 rejected.

**pemvidutide.mdx** — summary + mash `conditions` + `keyFindings` `meta-analysis` for 41879841 (pooled MDs, labelled); PERFORMA/RECLAIM/RESTORE as registrations; RECLAIM no percent (`hasResults` false); IMPACT status COMPLETED, published numbers remain 41237796.

**Packs** — add-only new/updated NCTs from this fetch. Titles copied from CT.gov briefTitle after drug-match. No historical MOMENTUM/VERIFY rows invented.

## Gaps deferred

See `NEEDS-VERIFICATION-F-HIGH.md`. Unused High worklist slugs left for a later tick: `amycretin` (Annals GLP-1 SR 42673585 — not compound-specific), `pf-08653944` / `ct-388` (trials-only / status sync), filtered `tirzepatide` / `semaglutide` volume.

No `GAPS.md` — CONTENT-PLAN net URL 0; no new peptide dossiers.

## Commands actually run

```
node .planning/seo-engine/runs/2026-09-01/_fetch-fresh-high.mjs
node -e  (print papers + trials from _fetch-fresh-high.json)
node -e  (openFDA drugsfda/label for ecnoglutide / XW003)
```

WebFetch EMA timed out. **Not run:** `astro build`, `graph:check`, Judge, `qa:trials` (would rewrite global TRIAL-TRIAGE.md).

## Blockers

1. NMPA English product page / approval letter for ecnoglutide — journal-only; status left investigational.
2. RECLAIM, EVOLVE-2, NCT07143227 completed with `hasResults` false — no percents.
3. VERIFY Phase 3 still lacks a peer-reviewed paper in this window.
4. EMA search timeout — no EPAR claim either way.
