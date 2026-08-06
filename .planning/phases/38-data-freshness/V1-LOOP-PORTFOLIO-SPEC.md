# V1 Loop Portfolio — "Always-Current Directory" (approved spec)

*Phase 38 · approved by owner 2026-06-27 ("make 1-3 into 1" — freshness + discovery + content as one
sequenced program; monetization deferred). Companion to `LOOP-DESIGN-SPACE.md` (the full landscape) and
`DAILY-BRIEFING-LOOP.md` (the daily-blog spec).*

## Goal
Make PepCodex the most accurate **and** most up-to-date peptide directory by standing up an integrity-gated
automation program: discover new science/trials/approvals, keep existing data fresh, surface that freshness
visibly, and synthesise it into a daily evidence-graded post — every loop **drafts → opens a PR → a human
merges** (never writes live), and nothing publishes unless every cited PMID/NCT/DOI resolves.

## Non-negotiables (inherited, apply to every loop)
- **No fabrication.** Every factual claim cites a real, resolving, on-topic source. The prebuild
  `qa-pmids --strict` gate (+ the Phase 0 NCT/DOI extension) applies to all loop-generated content.
- **Banned content:** no dosing protocols, no sourcing/where-to-buy, no medical advice. Run `qa-banned-content`.
- **Evidence-graded:** high/moderate/low/very-low; preprints/press-releases labelled, never inflated.
- **Human merge before publish.** Loops write to a draft/branch + open a PR; CI re-runs the gates.
- **Revenue walled off from data** (no pay-to-rank, no vendor ads) — monetization is a later phase.

## The dependency chain (why this order)
Gate (trust) → Ingest (find) → Surface (show) → Synthesise (publish). The daily blog comes last because it
*consumes* the ingestion loops' diffs; no loop auto-drafts until the gate can catch a bad citation.

### Phase 0 — Foundation: the gate everything trusts
| Loop | What | Reuses |
|---|---|---|
| **Identifier-integrity gate v2** | Resolve-check every NCT (CT.gov) + DOI (Crossref/doi.org) on top of PMIDs; build-breaking in `--strict`. | `qa-pmids.mjs` walk+batch+bail skeleton + `qa-citations.js` regexes |
| **Retraction watch** | Flag any cited PMID/DOI that's been retracted (resolution alone misses this). | Crossref Retraction Watch CSV joined to the PMID/DOI index |
| **Staleness-literal sweeper** | Replace hardcoded "92 peptides / Updated Feb 2026" literals with build-derived values. | grep over `src/pages` + Astro collections |

### Phase 1 — Ingestion: loops that find new things (share the refresh-trials fetch→normalize→diff→PR pattern)
| Loop | What | Reuses |
|---|---|---|
| **Trials all-slug orchestrator** | Re-run `refresh-trials.mjs` across every pack on a schedule + surface a visible "last synced" date. | `refresh-trials.mjs` verbatim |
| **Source-pack backfill** | Scaffold the 72 missing packs so every dossier is loop-reachable + appears in `/trials`. | `refresh-trials` (+ a scaffold path) + `validate-source-pack.js` |
| **New-research radar** | Daily PubMed `reldate` + Europe PMC `SRC:PPR` preprint watch → per-dossier candidate studies (review queue). | `qa-pmids` esummary batch + alias-query builder |
| **CT.gov new-intervention radar** | Detect newly registered trials for interventions NOT in the 102-slug map → new-molecule stubs. | `refresh-trials` normalizer + slug/alias diff |
| **openFDA approval radar** | Daily `drugsfda` poll (NME/BLA, sort desc) for approvals/label changes of tracked peptides. | `refresh-trials` fetch pattern |

### Phase 2 — Surfacing: make freshness visible & provable
| Loop | What | Reuses |
|---|---|---|
| **"Last verified" heartbeat** | Re-verify a dossier (re-resolve IDs, re-check trial/reg status) → bump a real `lastVerified` only on pass → visible badge + `MedicalWebPage` `lastReviewed`. | `qa-pmids` per-dossier verify + `scoring.lastReviewed` + `DossierLayout` dateModified |
| **Public changelog** | Site-wide `/changelog` + per-dossier "Recent updates" from merged-PR metadata. | Git/PR history + a layout block |
| **Auto AI-citability feed** | Generate `llms.txt`/`llms-full.txt` + schema from verified content at build (never stale). | Build step replacing the hand-maintained string |

### Phase 3 — The payoff: synthesis
| Loop | What | Reuses |
|---|---|---|
| **Daily research-digest blog** | Synthesise the prior day's PubMed/EuropePMC/CT.gov/openFDA/(low-trust) funding deltas into ONE evidence-graded, fully-cited draft post (≥3 novel items or hold → weekly digest). | Blog schema + 155 exemplars + all QA gates; see `DAILY-BRIEFING-LOOP.md` |

## Cross-cutting decisions (owner-approved defaults)
1. **Execution infra (mixed):** GitHub Actions for the deterministic blocking gate (stand up `.github/workflows`
   — none exist yet); scheduled scripts (cron) for the structured-API fetchers; a Claude `/schedule` cloud
   agent for the daily-blog synthesis (the only step needing LLM judgment).
2. **Autonomy:** every loop drafts → PR → human merge. Exception: fabrication-proof pure-data refreshes
   (trials JSON, openFDA) may **auto-merge on green gate** once trusted, to cut review load.
3. **Cadence:** gate on every PR · discovery radars + blog **daily** (with the ≥3-item threshold → weekly
   digest fallback) · trials orchestrator + heartbeat **weekly**.

## Sources (curated — from RESEARCHER-CRITERIA.md + RESEARCH-RESOURCES.md)
PubMed/PMC · ClinicalTrials.gov · Europe PMC (preprints) · Crossref + Retraction Watch · openFDA ·
peptide-db.com (human-trial cross-check) · FDA Bulk Drug list · USADA/WADA · Lilly/Novo IR · BioPharma Dive
(lowest-trust; primary-source link required). Ahrefs/Brand-Radar = signal only, never a citation.

## Build sequence
Phase 0 → 1 → 2 → 3. Phase 0 first (it's the safety net every later loop depends on, and directly extends
the citation gate just shipped to prod). Each phase ships independently behind the draft→PR→merge model.
