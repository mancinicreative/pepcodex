# UPDATE-WORKLIST — 90-day scan 2026-09-01

Scan: `npm run research:scan -- --days 90` → `.planning/research-scan/2026-09-01/`  
**107/107 peptides, SCAN_EXIT=0.** Per-slug JSON written including zeros.

**Do not treat the headline counts as a writing queue.**

| Headline | Number | Honest reading |
|---|---|---|
| new papers | 2,008 | Inflated by generic names. Glutathione 423 includes NOD1/procyanidin, aluminum ions, PDT photosensitizers — **not glutathione-as-peptide-therapy** |
| new trials | 149 | Needs drug-match before pack merge |
| updated trials | 108 | Status/enrollment sync — Trials Analyst, High names first |

## Noise (do not hand to writers)

Matcher `isRelevant` still too loose for biochemical uniques. Sampled `glutathione.json`: first hits are unrelated toxicology/PDT. Same risk class: **hcg (277), ll-37 (199), klotho (154), kisspeptin (139), follistatin (80), humanin (63), alpha-defensins (32).** Re-filter with a stricter title-must-name-the-compound pass before any dossier edit. If a slug shows implausible volume vs its primary-name count, treat the worklist as **broken query**, not a busy month.

## W2 slice (cap: 3 editors × sets of 10, review required)

**Integrity first** (Agent I, fetched this run) — not the scan:

1. CRITICAL: `is-bpc-157-safe.mdx` still asserts NCT05765513 as IV BPC-157 (it is HA35 periodontitis)
2. CRITICAL: `thymulin-vaccine-response.mdx` invented 180-patient RCT
3. CRITICAL: `tirzepatide-cancer-incidence.mdx` invented 125k cohort; PMID 40900093 is a different paper
4. HIGH: `tirzepatide-vs-semaglutide.mdx` still says no 2.4 mg head-to-head — SURMOUNT-5 PMID 40353578 exists on the tirzepatide dossier
5. HIGH: journal-homepage “sources” on wegovy-pill / surmount-5 / orforglipron-attain-1
6. HIGH: SURMOUNT-1 22% leftover on `vk2735-vs-tirzepatide.mdx`

**Freshness (distinctive pipeline names only), prefer RCT/Clinical Trial pubTypes in the JSON:**

| Slug | Scan (since) | papers / new NCT / updated | Note |
|---|---|---|---|
| `retatrutide` | 2026-08-17 | 6 / 0 / 3 | Named; skip Cureus case-report shopping |
| `survodutide` | 2026-08-17 | 1 / 2 / 2 | |
| `amycretin` | 2026-08-17 | 1 / 0 / 0 | Zenagamtide rename already on dossier; Annals GLP-1 SR may not be compound-specific |
| `orforglipron` | 2026-08-17 | 3 / 3 / 8 | |
| `cagrisema` | 2026-08-17 | 3 / 1 / 4 | |
| `cagrilintide` | 2026-08-17 | 3 / 2 / 5 | |
| `tirzepatide` | 2026-08-17 | 66 / 9 / 10 | **Filter hard** — volume is real but mixed reviews |
| `semaglutide` | 2026-08-17 | 120 / 27 / 9 | **Filter to RCT / Phase 3 titles only**; do not ingest every Cureus/comment |
| `mazdutide` | 2026-08-17 | 1 / 4 / 1 | |
| `maritide` | 2026-01-22 | 7 / 2 / 10 | |
| `rusfertide` | 2026-04-13 | 3 / 2 / 0 | |
| `oveporexton` | 2026-08-17 | 2 / 0 / 1 | |
| `pf-08653944` | 2026-04-13 | 0 / 4 / 6 | trials-only |
| `ct-388` | 2026-01-22 | 0 / 0 / 7 | status sync |

Discovery/authorship split: writers may only cite PMIDs/NCTs in these JSON files after a human/agent topical check of the title. WebSearch is not a source.

## Graph / links (reconcile FALSE-LINKS.md + graph:check)

`validate-cross-links` **0 structural 404s** is not the same as `graph:check`. The source scan never saw `TrialTable` hrefs built from display names. `graph:check` on Aug-17 `dist/` found 7 instances / 4 dead targets.

**Patched this run (needs rebuild to KEEP):** `peptideSlug` from pack filename in `trials/index.astro`, `TrialTable.astro`, `DossierLayout.astro` trial maps. That is the space/slash class (`/peptides/thymosin alpha-1`, `zelenectide pevedotin`, `mrna-4157/v940` from `/trials`).

**Still open (FALSE-LINKS Wave 2 order):**

1. Replace name-derived `currentSlug` (`DossierLayout.astro:323`) with `slugProp` / `dossierSlug` — **6** dossiers diverge, including **amycretin** after the zenagamtide rename. Condition links already use `slugProp`; `#compare` / RelatedEntities lookups still miss.
2. Strip HTML trailing slashes: `DossierLayout` `/regulatory-tracker/`, `cardiogen.mdx` `/peptides/cartalax/`, `kristagen.mdx` `/peptides/chonluten/`. Then schema/Breadcrumb `siteBase…/` (308 in JSON-LD).
3. Set-guard peptide hrefs in Safety / Protocol / Guide / Calculator layouts (0 current misses; residual regression class).
4. Conditions Studied `c.slug` → `/peptides/mrna-4157/v940` if that path is still emitted after the trial-table fix.
5. Orphan: `/calculator/reconstitution/tesamorelin` (link from tesamorelin dossier).
6. `/guides/` in old dist — source DSIP post already `/guide/peptide-evidence-levels-explained`. Rebuild should clear it.
7. `llms.txt.ts` still lists 4 deleted compare-order URLs + trailing slashes (coordinate with L8; one editor).

## Blog optimizer (CONTENT-PLAN — 0 new URLs)

- **Set 1:** 10 high-PAGE exact-slug twins (`guides/` / `safety/`) — differentiate the blog half, do not fatten both.
- Sets 2–4: remaining twins (46 pairs total).
- Sets 5–7: CTR/links/CTA on impression leaders already rewritten in R1/R2. Not another depth rewrite.
- Writer (W) idle. Do not restore fabrication 301s.

## New peptides

**None approved.** CONTENT-PLAN net URL delta = 0. Gaps go to `GAPS.md` only if `discover:gaps` is run in a later wave.
