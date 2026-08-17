# PRD-Generating Prompt — Phase 40: Growth Engine

*Written 2026-08-17. This prompt is executed by the orchestrator (Fable 5) to produce
`PRD.md` in this directory. It is kept so the PRD can be regenerated or audited: the
PRD's quality is a function of this prompt's constraints.*

---

## The prompt

You are the product lead for PepCodex (pepcodex.com), an evidence-based peptide
reference site (Astro/MDX, 105 dossiers, 140 blog posts, 1,212 pages). Write a PRD
for **Phase 40: Growth Engine** — the initiative that turns a verified content corpus
into a traffic and revenue engine while keeping the verification discipline that
Phase 39 built.

### Read before writing (in this order)

1. `.planning/STATE.md` — the verified end state: 2,199-identifier ledger, the
   verification graph, the estimand class, the gates now in `npm run check`.
2. `.planning/phases/39-refresh-and-app/CODEX-REVIEW.md` — the adversarial review
   whose findings were validated by execution. Its constraints are LAW for this PRD:
   shared rate limiters, verification-before-prose, no editorial-timestamp cursors,
   pagination handling, fail-closed gates.
3. `.claude/CLAUDE.md` + `.claude/rules/lessons.md` — hard content bans and the
   fabrication-class lessons. The discovery/authorship separation is structural:
   scripts fetch candidates from registries; agents may only choose among what they
   were handed.
4. `.planning/coverage/2026-08-06/TRIAGE.md` — the 12 BUILD candidates.
5. `.planning/CONTENT-IDEA-BACKLOG.md`, `.planning/GAP-SERP-AUDIT.md`,
   `.planning/RESEARCHER-CRITERIA.md`, `.planning/RESEARCH-RESOURCES.md`.
6. The stale-memory finding: `scripts/fetch-search-data.mjs` is MISSING from the
   current checkout although memory and `.planning/GOOGLE-API-SETUP.md` describe it.
   GSC/GA4 access must be re-established or declared absent — the PRD must not
   assume analytics exist until an agent proves they do.

### The four workstreams the PRD must cover

- **A — Continuous fact-check.** The loop already exists (`npm run loop`,
  `verify:graph`, the qa gates). The PRD defines its cadence and what "new finding"
  routes where. Do not rebuild what exists; schedule and staff it.
- **B — Freshness (past 2–3 months).** New trial results, approvals, label changes,
  new compounds worth dossiers. Window: 2026-05-17 → 2026-08-17. Uses
  `research:scan` + `discover:gaps` + the coverage triage. Every proposed update
  carries its identifier BEFORE prose is written.
- **C — Blog optimization.** 140 existing posts: which decay, which rank, which
  lack internal links to dossiers/app surfaces, which have wrong estimands or
  stale figures. Canonical/trailing-slash changes are HIGH RISK (spring-2026
  indexing collapse) — on-page content and internal links only, unless a
  structural change is separately approved.
- **D — Growth content + monetization.** New posts chosen for search intent that
  leads to (1) PepTracker app installs and (2) affiliate revenue. HARD CONSTRAINT:
  the site bans sourcing/purchasing guidance and medical advice. Affiliate
  partnerships with gray-market peptide vendors would contradict the site's own
  banned-content rule and its positioning. The PRD must present the compliant
  option space (lab testing, telehealth, books/courses, adjacent products) with
  evidence, and mark PARTNER SELECTION as blocked-on-Lucas. FTC disclosure
  requirements are stated, not assumed.

### Agent team requirements

- Two waves. Wave 1 is research-only (no content edits) and produces worklists with
  identifiers. Wave 2 implements from those worklists and MUST NOT begin until the
  wave-1 artifact it depends on exists (2026-07-09 lesson: never dispatch build
  briefs that depend on in-flight research).
- One agent per task, narrow scope, no two agents touch the same file. Max 3
  file-editing agents concurrently (OneDrive EMFILE lesson). No `npm run build`
  while any other agent runs.
- Every brief is self-contained: absolute paths, the relevant lessons folded in,
  done-means-done, act-don't-ask, report format specified, and the agent must cite
  artifacts for every claim of completion.
- All registry access goes through `verification/pubmed.mjs` patterns (per-alias
  queries, never OR-joined) and respects: NCBI 3/s anonymous, openFDA 1,000/day
  anonymous, CT.gov v2 pagination via `nextPageToken`.

### PRD structure (exactly these sections)

1. Objective (one sentence) and Non-goals
2. Success checks per workstream — the evaluator defined BEFORE work, per
   `ops/task-loop.md`. If a workstream's success cannot be verified, the PRD says
   what check must be built first.
3. Workstreams A–D: scope, worklist source, owner agent, definition of done
4. Agent roster: name, wave, inputs, outputs, boundaries
5. Dependency graph between agents (what blocks what)
6. Decision gates — everything blocked on Lucas, stated as questions with options
   and a recommendation each
7. Risks and the specific lesson/incident each one traces to
8. Budget: agent count, expected sessions, and the stopping rule

### Quality bar

Before finalizing, run a critic pass against these criteria and revise: (a) every
success check is mechanically verifiable or names the check to build; (b) no
workstream depends on data not yet proven to exist; (c) every risk cites its
incident; (d) the affiliate conflict is presented as a decision, not silently
resolved; (e) nothing in the PRD asks an agent to both discover and author.
