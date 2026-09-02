# Judge — L2 iter 2

Evaluator: `npm run graph:check` on **new** `dist/` (rebuild 2026-09-01, `REAL_BUILD_EXIT=0` via `cmd /v:on`).

| Metric | Aug-17 dist (iter 1) | This dist | Gate |
|---|---|---|---|
| pages | 1,209 | 1,209 | net URL 0 |
| broken internal links | 7 instances / 4 targets | **0** | pass |
| orphans (gate) | tesamorelin calc | **0** (excl. verify html + `/glossary/off-label`) | pass |
| max depth | 3 | 3 | pass |
| GRAPH_EXIT | 1 | **0** | pass |

Dead targets from iter 1 **gone:** `/peptides/thymosin alpha-1`, `/peptides/zelenectide pevedotin`, `/peptides/mrna-4157/v940`, `/guides/peptide-evidence-levels-explained`. Tesamorelin reconstitution calc is depth 3 / inbound 1 (same class as hexarelin and igf-1-lr3).

100% silent remains a **missing GSC-join artifact** (no live page JSON in this checkout). Do not treat as indexation collapse.

Verdict: **KEEP.**
