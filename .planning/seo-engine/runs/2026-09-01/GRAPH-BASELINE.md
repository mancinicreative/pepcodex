# GRAPH-BASELINE — 2026-09-01

`npm run graph:check` against `dist/` last written **2026-08-17** (1,209 HTML pages in `dist/client`). Ran 10.0 min. **Exit 1.**

Snapshot: `.planning/data/v2/graph-snapshots/graph-2026-09-01T19-27-22.json`

## Metrics

| Metric | This run | CRAWL-GOAL target | Note |
|---|---|---|---|
| pages in build | 1,209 | — | |
| indexable | 1,111 (noindex 98) | — | |
| silent (0 impr) | **1,111 (100%)** | lagging | **JOIN ARTIFACT** — this checkout had no `.planning/data/v2/gsc-*-page.json` when the graph ran, so every page looks silent. Real silence is the 2026-07-24 diagnosis (~75%), not this number |
| broken targets | **4** (7 instances) | 0 | FAIL |
| orphans (real) | **1** tesamorelin reconstitution calc | 0 | `/glossary/off-label` + google verify file excluded |
| unreachable | 3 | 0 | same three |
| depth ≥4 | 0 | 0 | PASS |
| max depth | 3 | ≤3 | PASS |

## Broken links (Wave 2 — real)

| Dead target | From | Class |
|---|---|---|
| `/peptides/mrna-4157/v940` | dossier + `/trials` | extra path segment (likely alias/`data.name`) |
| `/peptides/thymosin alpha-1` | dossier + `/trials` | **space in URL** — display name, not slug `thymosin-alpha-1` |
| `/peptides/zelenectide pevedotin` | dossier + `/trials` | **space in URL** — same class |
| `/guides/peptide-evidence-levels-explained` | `/blog/dsip-sleep-quality-study` | `/guides/` does not exist; route is `/guide/` |

## Orphan

`/calculator/reconstitution/tesamorelin` — 690 words, 0 inbound. Hexarelin/igf-1-lr3 calcs are depth 3 with 1 inbound (they actually earned GSC clicks historically). Tesamorelin calc is a dead island.

## Wave 2 order

1. Stop emitting spaces and extra segments in trial/dossier links (slug from collection id).
2. Fix `/guides/` → `/guide/` in that blog post (and grep for more).
3. Link tesamorelin reconstitution calc from the tesamorelin dossier (reader-plausible, not footer spam).
4. Re-run `graph:check` after copying GSC page JSON into `.planning/data/v2/` so silence is real.

Do not treat 100% silent as a new indexation collapse.
