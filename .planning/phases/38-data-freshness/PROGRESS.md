# Phase 38 — Scoring Rollout + Always-Current Directory

*Branch: `feat/scoring-and-freshness` (off `main` 7883b48, post-launch). Updated live.*

## Goal
The best, most accurate, most up-to-date peptide directory: (A) complete the two-axis scoring on
all 102 dossiers; (B) stand up integrity-gated automation loops (freshness, coverage, daily content,
monetization) so the directory stays current; (C) flag/add new studies + trials per dossier.

## Stream A — Scoring rollout (two-axis rubric v2.4)
Per-dossier workflow: score 5 dims (calibrated to semaglutide=98 / cerluten anchors) → weighted
overall → label → effectiveness basis/score/confidence → write `scoring:` block → independent verify
(math+enums+qa-rules+sanity) → also flag candidate new studies (PubMed, newer than lastUpdated).
Build gate: `qa-scoring` (math) + `qa-pmids --strict` (citations), now both in prebuild.

| Wave | Dossiers | Status | Commit |
|------|----------|--------|--------|
| 1 | liraglutide, tirzepatide, retatrutide, mazdutide, survodutide, orforglipron, tb-500, cjc-1295, ipamorelin, mk-677, ghk-cu, sermorelin | DONE — 12/12 clean, 55 new studies flagged | 2789245 |
| swave-aa | chelohart, chonluten, cortexin, ct-388, dihexa, dsip, ecnoglutide, endoluten, epithalon, evx-01, follistatin, ghk | RUNNING (wf_b51a0f3e-c83) — watch bioregulators score LOW | — |
| swave-ab | ghrp-2…kristagen (12) | queued | — |
| swave-ac | lactoferricin…na-semax-amidate (12) | queued | — |
| swave-ad | ovagen…retinalamin (12) | queued | — |
| swave-ae | rusfertide…svetinorm (12) | queued | — |
| swave-af | tesamorelin…zelenectide-pevedotin + bt5528 re-score (12) | queued | — |

**Coverage: 31 / 102 scored.** (19 pre-existing + 12 wave-1.) Target 102/102.

## Stream B — Automation roadmap (AUTOMATION-STRATEGY.md)
Delivered (workflow wf_56675611-8ba). Flagship loops in order:
1. **Citation-Integrity Gate** — step 1 DONE (`qa-pmids --strict` in prebuild, commit 90dbf7a; fabrication
   = build-breaking error). TODO: extend to DOI/NCT, weekly cloud-agent re-verify, claim-support check.
2. **CT.gov New-Intervention Radar** — weekly, fabrication-proof NCT stubs → review queue. Not built.
3. **Evidence-Freshness Poller** — "last verified" heartbeat. Not built.
4. **FDA Regulatory auto-refresh.** Not built.
- Monetization order: Calculator PWA+Pro → Beehiiv digest → clinic listings → B2B data API (gated to
  verified citations) → sponsor bridge.

## Data-refresh worklist
Scoring agents flag `candidateNewStudies` per dossier (55 from wave 1). Aggregate into a worklist;
add the strongest as new keyFindings (verified) in a later pass.

## Open items / gaps
- **Daily-briefing blog loop** (owner's specific ask) — the ideation lens FAILED (schema retry); needs a
  dedicated design. NOT yet specced.
- `qa-banned-content.js` is per-file → needs a corpus-runner wrapper before it can join the prebuild gate.
- Merge cadence to prod: scoring + gate work is on `feat/scoring-and-freshness`; merge to `main` (Vercel)
  at a sensible checkpoint (e.g., after the full scoring rollout, or in batches).
- bt5528 re-score (its old score was built on the fabricated 67%/45% ORR) — scheduled in swave-af.
