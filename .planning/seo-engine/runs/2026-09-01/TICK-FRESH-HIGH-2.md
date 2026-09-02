# TICK-FRESH-HIGH-2 — W2-F High Dossier Implementer slice 2

Date: 2026-09-02  
Role: L5 freshness implementer (not Judge). **Do not stamp KEEP.**  
Net URL delta: **0** (existing dossiers + add-only NCTs on existing packs).

## Slugs taken (≤3, unused vs slice 1)

Slice 1 (`TICK-FRESH-HIGH.md`) holds **ecnoglutide, rusfertide, pemvidutide** — not reopened.

| Slug | Why High | Files |
|---|---|---|
| `pf-08653944` | Trials-only High; 4 new + 6 updated NCTs | `src/content/peptides/pf-08653944.mdx`, `data/source-packs/pf-08653944.json` |
| `ct-388` | Status-sync High; 0 papers, 7 updated NCTs | `src/content/peptides/ct-388.mdx`, `data/source-packs/ct-388.json` |
| `amycretin` | 1 window paper (Annals class SR) | `src/content/peptides/amycretin.mdx` only (no new NCTs; no pack created) |

Also touched: `data/trial-match-aliases.json` (verification-only: berobenatide / MET097 for pf-08653944; enicepatide / RO7795068 / RG6640 / RG-6912 for ct-388). **Not** added as public dossier aliases. PF-08653945 and petrelintide were **not** added as aliases.

HARD LOCK: no `src/content/comparisons/**`, no blogs, no new peptide slugs, no scoring-number edits. Slice 1 files not touched.

## IDs fetched this run (command + date)

Command: `node .planning/seo-engine/runs/2026-09-01/_fetch-fresh-high-2.mjs`  
Date: **2026-09-02**. Raw dump: `_fetch-fresh-high-2.json` (1 PMID, 17 NCTs, all HTTP 200).

PubMed `efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract` (eutils, UA PepCodex-verify/1.0):

| PMID | Topical? | Used |
|---|---|---|
| 42673585 | Yes — abstract names amycretin among emerging multiagonists; placebo-subtracted −23.9% (95% CI −29.3% to −18.5%); heterogeneity precluded quantitative synthesis | Cited as **review**, not as a new primary RCT; estimand not named in abstract |

CT.gov `https://clinicaltrials.gov/api/v2/studies/<NCT>?format=json` (2026-09-02). Drug-match on intervention name **or otherNames** before storing title:

| NCT | Intervention match | Status (norm) | hasResults | Pack |
|---|---|---|---|---|
| NCT07794774 VESPER-JM | Berobenatide (otherNames MET097, PF-08653944) | not yet recruiting | false | pf-08653944 **add** |
| NCT07794761 VESPER-JW | Berobenatide (otherNames MET097, PF-08653944) | not yet recruiting | false | pf-08653944 **add** |
| NCT07792954 | Berobenatide (otherName PF-08653944) | not yet recruiting | false | pf-08653944 **add** |
| NCT07519135 | PF-08653944 (otherName MET097) | recruiting | false | pf-08653944 **add** |
| NCT07575932 SOLIS-1 | PF-08653944 **and** PF-08653945 | recruiting | false | pf-08653944 **add**; 45 not aliased |
| NCT07400679 | PF-08653944 (otherName MET097) | completed | false | pf-08653944 **add** |
| NCT07400653 VESPER-5 | PF-08653944 (otherName MET097) | active | false | pf-08653944 status-sync |
| NCT07311850 VESPER-4 | MET097 (otherName PF-08653944) | active | false | pf-08653944 status-sync |
| NCT07508241 | PF-08653944 (otherName MET097) | active | false | pf-08653944 status-sync |
| NCT07595549 VESPER-6 | PF-08653944 | recruiting | false | pf-08653944 status-sync |
| NCT06525935 | Enicepatide (otherNames CT-388, RO7795068, RG6640) | completed | false | ct-388 **add** |
| NCT06628362 | Enicepatide (otherNames CT-388, RO7795068, RG6640) | active | false | ct-388 **add** |
| NCT07351045 Enith1 | Enicepatide | recruiting | false | ct-388 status-sync |
| NCT07351058 Enith2 | Enicepatide | recruiting | false | ct-388 status-sync |
| NCT07670416 | Enicepatide | recruiting | false | ct-388 status-sync |
| NCT07626515 | Enicepatide | recruiting | false | ct-388 status-sync |
| NCT07589686 ZYNERGY | Enicepatide + Petrelintide | not yet recruiting | false | ct-388 status-sync; petrelintide not aliased |

openFDA (2026-09-02):

- Quoted `drugsfda?search="PF-08653944"` → **404**
- `openfda.generic_name:berobenatide` → **404**
- `openfda.generic_name:enicepatide` → **404**
- `openfda.generic_name:zenagamtide` and `amycretin` → **404**
- Unquoted `CT-388` → 200 but **unrelated ANDAs** (phenylephrine, levonorgestrel, triamterene) — discarded

## What changed

**pf-08653944.mdx** — `lastUpdated` 2026-09-02; summary lists new Japan/China Phase 3 IDs and dated absence of papers/results; `regulatoryStatus` stays **investigational** with quoted openFDA 404; body status-syncs VESPER-4/5 to active-not-recruiting; weekly vs monthly labelled from official titles; no weight percent invented; NCT06857617 / NCT06712836 labelled not re-fetched.

**ct-388.mdx** — dated window note (0 papers); NCT06525935 completed / NCT06628362 active-not-recruiting, both hasResults false; Enith1/Enith2 recruiting; RG6640 recorded as CT.gov other-name only.

**amycretin.mdx** — attached 42673585 as `type: review`; −23.9% labelled class-SR placebo-subtracted, not a new primary RCT and not a named estimand; no new NCT pack.

**Packs** — add-only new NCTs; titles from CT.gov briefTitle after drug-match. No historical VESPER-1 rows invented.

## Gaps deferred

See `NEEDS-VERIFICATION-F-HIGH-2.md`. Unused High worklist leftover (not this slice): noise-gated `tirzepatide` / `semaglutide` volume.

No `GAPS.md` — CONTENT-PLAN net URL 0; no new peptide dossiers.

## Commands actually run

```
node .planning/seo-engine/runs/2026-09-01/_fetch-fresh-high-2.mjs
Invoke-WebRequest  (openFDA drugsfda for pf-08653944 / berobenatide / MET097 / enicepatide / CT-388 / zenagamtide / amycretin)
node -e  (openFDA inspect; unquoted CT-388 = unrelated ANDAs)
node -e  (quoted PF-08653944 + generic_name fielded searches → 404)
node -e  (JSON.parse packs + aliases)
```

**Not run:** `astro build`, `graph:check`, Judge, `qa:trials`.

## Blockers

1. All 17 fetched NCTs have `hasResults` false — no new treatment-policy percents.
2. PMID 42673585 does not name the amycretin trial or estimand behind −23.9%.
3. NMPA/FDA/EMA product pages not retrieved; status left investigational on all three slugs.
4. Unquoted openFDA token search is unsafe (CT-388 false matches).
