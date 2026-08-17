# PRD — Phase 40: Growth Engine

*Generated 2026-08-17 by executing `PRD-PROMPT.md`. Orchestrator: Fable 5.*
*Status: Wave 1 dispatched · Wave 2 pending wave-1 artifacts · Decision gates open.*

---

## 1. Objective and non-goals

**Objective:** Convert the verified corpus into a traffic and revenue engine — dossiers
current to within 3 months, blogs optimized for search intent that funnels to the
PepTracker app and compliant affiliate offers — without relaxing a single verification
gate built in Phase 39.

**Non-goals (this phase):**
- No canonical-host, trailing-slash, or URL-structure changes (spring-2026 indexing
  collapse; any structural SEO change is its own proposed phase).
- No affiliate integration is BUILT until Lucas selects partners (Gate D1).
- No rebuild of the verification loop — it exists (`npm run loop`, `verify:graph`);
  this phase schedules and consumes it.
- No dosing content, sourcing/purchasing guidance, or medical advice — anywhere,
  including affiliate-adjacent copy. `qa:advice` and `qa-banned-content` remain the law.
- No paid acquisition; organic + app cross-promo only.

## 2. Success checks (defined before work — ops/task-loop.md step 0)

| WS | Success check (mechanical) | Check exists? |
|----|---------------------------|---------------|
| A | `npm run check` exit 0 AND `npm run loop:offline` converges with 0 new criticals, run at phase close | Yes |
| B | Every dossier touched carries ≥1 new identifier dated in the window, verified into `verification/ledger.json` (count reported by `verify:graph`); freshness census: dossiers with window-dated evidence, before vs after | Yes |
| C | Per-post optimization checklist (from wave 1) with pass/fail columns; `qa-seo` + `qa:advice` + `qa-banned-content` no worse than HEAD per file; internal-link count dossier↔blog measured before/after by `validate-links` output | Checklist to be produced by traffic-auditor (wave 1) |
| D | Each new post: ≥2 verified citations (blog minimum), passes all gates, maps to a named funnel stage and keyword from the wave-1 brief; app CTA present where the brief says it belongs | Brief to be produced by market-scout (wave 1) |

Traffic/revenue outcomes (rankings, installs, affiliate income) are lagging signals —
they get a measurement plan in Gate D3, not a success check this phase can be graded on.

## 3. Workstreams

### A — Continuous fact-check (standing)
- **Scope:** run the existing loop; route findings: content defect → fix commit;
  matcher gap → fixture + matcher fix; new integrity class → gate proposal.
- **Worklist source:** `npm run loop:offline` output + `qa:staleness` WARNs (the 2
  TRIAL_SAID_ONGOING / 6 STATUS_CONTRADICTION currently advisory).
- **Owner:** fact-check-agent (wave 2). **Done:** success check A green; the 8
  advisory staleness findings resolved or explicitly deferred with reasons.

### B — Freshness, window 2026-05-17 → 2026-08-17
- **Scope:** (1) update existing dossiers with window-dated results/approvals/label
  changes; (2) write remaining BUILD dossiers — 9 of 12 remain: teriparatide +
  abaloparatide (pair, top priority), somatropin, vasopressin, terlipressin,
  octreotide-family GnRH set (buserelin, goserelin, histrelin, triptorelin).
- **Worklist source:** freshness-scout output (wave 1) + `.planning/coverage/2026-08-06/build/*.json`
  (already-verified evidence packets). Discovery/authorship separation: writers
  consume only identifiers present in these artifacts.
- **Owner:** freshness-scout (wave 1) → dossier-updater + dossier-writer (wave 2).
- **Done:** success check B; every new dossier ≥10 citations per house rule.

### C — Blog optimization (140 posts)
- **Scope:** stale figures (estimand discipline — published treatment-policy number
  leads), internal links blog→dossier and blog→app surfaces, titles/meta vs actual
  search intent, decayed posts refresh-or-retire (301) recommendations.
- **Worklist source:** traffic-auditor output (wave 1). GSC/GA4 status unknown —
  `scripts/fetch-search-data.mjs` is MISSING from the checkout though
  `.planning/GOOGLE-API-SETUP.md` describes it; auditor must first establish what
  analytics exist. Ahrefs MCP is plan-blocked except the free DR endpoint. If no
  analytics: optimize on crawl/on-page/internal-link evidence only, and Gate C1
  asks Lucas to restore the GSC pull.
- **Owner:** blog-optimizer (wave 2). **Done:** success check C.

### D — Growth content + monetization
- **REVISED by wave-1 evidence (2026-08-17).** The original premise — publish new
  posts — is contradicted by the recovered indexation diagnosis: 75.6% of pages
  never indexed, 923/1,221 pages with zero impressions; crawl budget, not content
  volume, is the binding constraint. `/calculator/` is the only section with 0%
  silent pages, and the only converting non-brand query is a comparison.
- **Scope (new):** (1) depth-and-connection pass on the auditor's 22 `optimize`
  posts + refresh window-news posts already ranking (retatrutide, cagrisema,
  cagrilintide posts get the new Phase 3 data); (2) execute the auditor's
  retire-301 list (35 posts) to concentrate crawl budget; (3) tool-shaped
  surfaces + app handoff (marketing brief §4) — the Examine.com precedent: no
  affiliates, own product carries monetization; PepCodex's product is PepTracker;
  (4) new posts ONLY where a lane shows demand evidence (e.g. the converting
  comparison shape), not a publishing push.
- **Phase KPI:** % of sitemap URLs with ≥1 GSC impression — baseline 24.4%.
- **Worklist source:** MARKETING-BRIEF.md + BLOG-AUDIT.md/blog-checklist.csv ×
  freshness findings. **Owner:** blog-optimizer (wave 2, BLOCKED on Gate D5
  merge). **Done:** success check D. Affiliate links: none this phase (Gate D1
  recommendation: defer all lanes; reject research-chem vendors permanently).

## 4. Agent roster

| Agent | Wave | Model | Inputs | Output (all under `.planning/phases/40-growth-engine/research/`) | Boundaries |
|---|---|---|---|---|---|
| freshness-scout | 1 | opus | research:scan, discover:gaps, coverage triage, RESEARCH-RESOURCES.md | `UPDATE-WORKLIST.md` + per-slug JSON with verified identifiers | Read-only on content; API budget-aware; per-alias queries only |
| traffic-auditor | 1 | opus | blog tree, qa-seo, validate-links, GAP-SERP-AUDIT, GOOGLE-API-SETUP.md | `BLOG-AUDIT.md` + per-post checklist CSV | Read-only; NO canonical/slash proposals except as flagged risks |
| market-scout | 1 | opus | WebSearch, editorial-policy.astro, PRICING-AND-MEDIA-KIT.md, PMF-ANALYSIS.md | `MARKETING-BRIEF.md`: funnel map, keyword lanes, affiliate option space + compliance, app-CTA patterns | Research only; recommendations, not implementations |
| fact-check-agent | 2 | opus | loop outputs, staleness WARNs | fix commits | May edit content; runs no builds |
| dossier-updater | 2 | opus | UPDATE-WORKLIST.md | dossier edits + ledger additions | Only identifiers from worklist; ≤3 editors concurrent |
| dossier-writer | 2 | opus | build/*.json packets | new dossiers (teriparatide+abaloparatide first) | Only identifiers from packets; sourcing-rules skill format |
| blog-optimizer | 2 | opus | BLOG-AUDIT.md checklist | on-page edits, internal links, refresh/retire PRs | No slug/canonical changes; estimand rules |
| blog-writer | 2 | opus | MARKETING-BRIEF.md + UPDATE-WORKLIST.md | new posts, 2–4+ citations each | No affiliate links until Gate D1; no sourcing guidance |
| verifier | 2-close | opus | full tree | `npm run check` + `loop:offline` + sole-occupant build, REAL_BUILD_EXIT captured in-log | Runs ONLY when no other agent is active |

## 5. Dependency graph

```
freshness-scout ──┬─→ dossier-updater ─┐
                  └─→ dossier-writer ──┤
traffic-auditor ────→ blog-optimizer ──┼─→ verifier (sole occupant) → phase close
market-scout ──────┬→ blog-writer ─────┘
                   └→ GATES D1–D3 (Lucas) → affiliate implementation (post-gate)
```
Hard rule (2026-07-09 lesson): no wave-2 brief is composed, let alone dispatched,
until the wave-1 artifact it consumes exists on disk.

## 6. Decision gates — blocked on Lucas

- **D1 — Affiliate partners.** The site's own hard rule bans sourcing/purchasing
  guidance; affiliating with research-chemical peptide vendors would monetize the
  exact thing the site refuses to advise on, and would put FTC-disclosable links on
  pages whose value is integrity. Option space market-scout will price out:
  (a) lab-testing/COA services, (b) GLP-1 telehealth programs (regulated, on-label),
  (c) books/courses/tools, (d) research-chem vendors.
  **Recommendation (revised on wave-1 evidence, see MARKETING-BRIEF.md §3):
  defer ALL lanes this phase — compliant lanes (1–12% commissions) cannot clear a
  rounding error at 121 clicks/6 months, and the lane that pays (d, 10–35%)
  contradicts two published policy pages and monetizes substances on FDA Category 2
  / withdrawn-nomination lists. Reject (d) permanently. When revenue is revisited,
  flat-fee sponsorship from the existing media kit ranks above per-click affiliate.**
  Decision: confirm or override.
- **D2 — Scope policy.** Still unwritten (2026-08-06 finding). Insulin-class and
  interferon-class question decides whether somatropin/vasopressin-family BUILDs
  proceed. Recommendation: "therapeutic peptides + peptide-adjacent hormones ≤ 51
  aa OR peptide-derived", written into editorial-policy.astro.
- **D3 — Measurement.** Restore the GSC/GA4 pull (`fetch-search-data.mjs` is gone;
  setup doc exists). Without it, Workstream C/D outcomes are unmeasurable.
  Recommendation: restore before wave 2 blog work merges.
- **D4 — The 5 unsourceable bioregulator dossiers** (cerluten, stamakort, suprefort,
  svetinorm, ventfort): retire, merge into one class page, or reframe. They are a
  standing integrity liability on a site about to court more traffic.
- **D5 — Branch reconciliation (BLOCKS Workstream C).** `feat/scoring-and-freshness`
  is 25 ahead / 7 behind `origin/main` (merge-base 253eb38). Main carries the
  analytics harness, the 398-broken-links fix (3050d3d), "hold 31 blog posts whose
  cited studies do not exist" (3eb65df), comparison consolidation, and A-number
  fixes that OVERLAP this branch's work. Editing 140 blog files before merging
  guarantees a conflict swamp (traffic-auditor risk #1). Recommendation: finish +
  commit the in-flight dossier work, merge origin/main into this branch locally,
  resolve, run the full gate chain + sole-occupant build, THEN dispatch
  blog-optimizer. Decision: approve the merge.

## 7. Risks → incident each traces to

| Risk | Incident |
|---|---|
| Scanner surfaces junk candidates | 2026-08-06: ReferenceList mining produced MB-231 (cell line), MCT-24/CIR-20 (DOI fragments) — freshness-scout uses title+abstract only |
| Agents invent citations under content pressure | cardiogen fabrication class; required fields pressure (dosesUsed) — writers locked to pre-verified worklists |
| Parallel builds corrupt cache | this session: overlapping builds discarded; verifier runs sole-occupant |
| OR-joined alias queries explode | 28,694-hit NASA incident — `verification/pubmed.mjs` only |
| Estimand drift in new prose | SURMOUNT/REDEFINE/ATTAIN corrections — `qa:claims` + estimand rule in briefs |
| SEO structural change kills indexing | spring-2026 collapse — structural changes out of scope |
| Rate-limit blowout across concurrent agents | Codex review (validated): NCBI 3/s anon, openFDA 1k/day anon — wave-1 agents run staggered, keys noted in briefs |
| EMFILE under OneDrive | 2026-05-29 — ≤3 concurrent file editors, dev server off |

## 8. Budget and stopping rule

- 3 wave-1 agents (dispatched now, background, staggered API use), then ≤6 wave-2
  agents across ~2–3 sessions, ≤3 editing concurrently.
- Ratchet rule per agent: stuck twice → reset approach; three times → report and stop.
- Phase stops (exhaustion report, not silence) if: wave-1 artifacts show no analytics
  AND Lucas defers D3 (C/D reduce to on-page hygiene only), or `check` regresses and
  cannot be restored within one session.
