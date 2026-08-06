# Phase 39 Workstream A — Opus Counter-Plan

*Synthesis of 5 independent adversarial reviews of `.planning/phases/39-refresh-and-app/PLAN.md`.
Written 2026-07-24. Every mechanical claim below was re-verified against the working tree at
`1f2e0af` (branch `feat/scoring-and-freshness`) before inclusion.*

Paths are repo-relative to `C:\Users\manci\OneDrive\Documents\00_Claude\peptide-library\`.

---

## Verdict

**Do not run Workstream A as written.** The plan is directionally right and its two hardest-won
lessons are correctly internalised (CHUNK=3 with the dev server off; `REAL_BUILD_EXIT` captured
inside the log). But it fails on one structural point that makes everything else moot:

> The plan names last week's failure class in its own text — *"confirm topical + claim match
> (the failure mode that fabricated-but-resolving citations exploit)"* — and then defends against
> it with an LLM promise and the same four gates that already let it through.

Three compounding facts, all verified:

1. **The gate fails open.** In `scripts/qa-pmids.mjs`, the line that records NCT failures
   (`for (const id of nctIds) if (!found.has(id)) failures.push(...)`, line 139) sits *inside* the
   same `try` as the fetch loop. Any non-200 from CT.gov throws at line 132, skips line 139
   entirely, prints `WARN: NCT resolution skipped`, and falls through to line 163:
   `PASS: every cited PMID, NCT, and DOI resolves`. Exit 0. The DOI resolver has the same shape.
   This is the build-breaking gate that *is* the moat, and it degrades silently to a no-op under
   exactly the load a 102-dossier sweep creates.
2. **Two of the plan's four write targets have no gate at all.** `qa-pmids.mjs:14` and
   `qa-retractions.mjs:16` both hardcode `src/content/peptides`. Nothing resolve-checks
   `src/content/blog` (155 posts, never machine-checked once) or `data/source-packs/*.json`
   (1,084 trial entries). `validate-source-pack.js` is not in `npm run check` (verified:
   `check = validate-cross-links && qa-seo && qa-scoring && qa-pmids --strict`). Agent 2 is
   specced to write to both.
3. **`.github/` does not exist.** Verified: no directory. The plan's safety story is
   "drafts → PR → human merge", but a PR in this repo carries zero automatic verification. The
   gate is a social convention — and `.claude/rules/lessons.md` records that exact convention
   failing three times on 2026-06-26 (waves B1/aa/ab shipped with `npm run build` exit 1 while
   reporting "green").

Add the un-budgeted human cost (~400 new claims × topical check ≈ 13–50h of concentrated owner
attention, which the plan allocates zero hours to) and the honest conclusion is: **the plan would
reproduce last week's failure at 102× scale, behind a gate reading PASS, in a diff too large to
review.**

**What to do instead:** a Week 0 hardening + tooling track (~2–3 days of non-LLM work), then a
triaged run over ~20–25 dossiers instead of 102, on a *freeze-then-write* architecture where the
writer is mechanically confined to identifiers and numbers present in a frozen evidence ledger.
Ship the machine-only freshness track (trials/openFDA/retractions) immediately and separately —
it delivers most of the visible freshness value in a day with near-zero integrity exposure.

---

## Critical issues (ranked)

### C1 — `qa-pmids.mjs` NCT and DOI gates fail OPEN and still print PASS
**Severity: critical. Verified in file.**

`scripts/qa-pmids.mjs` lines 126–142 (NCT) and 144–154 (DOI): the failure-recording loop is inside
the `try`. A single 429/503/Cloudflare interstitial skips the check for the entire class and the
script prints `PASS`. The PMID resolver partially fails open too — a throw at batch 3 of 5 leaves
batches 3–5 unchecked. The plan's per-wave commit gate is `npm run check`; one 429 during a wave
produces a green gate over unverified citations. Nobody re-runs a passing gate.

Compounding: the plan runs CHUNK=3 with Agent 1 doing per-dossier `esearch`, Agent 3 re-resolving
every added id, and `qa-pmids` at each wave gate — 4+ concurrent NCBI clients from one residential
IP against a documented anonymous ceiling of 3 req/s. The 429 is not hypothetical; it is the
expected case, and it lands precisely on the fail-open path.

### C2 — Nothing mechanically verifies claim support; Agent 3 as specced cannot do it
**Severity: critical. Named in all five reviews.**

Agent 3's duties include *"Confirm quantitative claims (%/n/endpoint/phase) actually appear in the
cited source"* with no artifact, no script, no verdict file the gate reads. NCBI `esummary` (what
`qa-pmids` uses) returns title/authors/journal/date — not abstracts, and certainly not results
tables. The failures from last week (59.1% vs a real 52%; a fabricated "2-year BMD study";
"8-fold BDNF"; cagrisema's topline 22.7% vs the published 20.4%) are numbers that live in a
results section. An agent asked to "confirm" with no source text in hand produces a confident
`clean` from its own priors.

This is not speculative: `.claude/rules/lessons.md` already records a design auditor returning
91/100 PASS for a comparison it never performed, and the owner's response
("never claim something you never did") is the governing rule here.

**The fix is representational, not procedural:** freeze the source text before any prose is
written, require every drafted edge to carry a `supportQuote` copied verbatim from the frozen
text, and verify by string containment. That converts fabrication from a *detection* problem into
a *representation* problem — the writer can only assert what is in the ledger.

### C3 — Two write targets with zero citation gate, and the plan puts an LLM on both
**Severity: critical. Verified.**

- **`data/source-packs/*.json`** — Agent 2 is told to *"Add newly registered trials to
  `data/source-packs/<slug>.json` (real NCTs only)"*. No resolver walks that directory. No
  drug-match check exists. `validate-source-pack.js` is not in `npm run check`, and
  `LOOP-DESIGN-SPACE.md` line 29 records that `data/schemas/source-pack.schema.json` is already
  behind the live pack shape (`coreLibrary`, `metadata.lastUpdated`, `trialsLastSynced`), so it
  cannot be enabled as-is. `src/utils/citation.ts` renders any well-formed NCT as a live
  ClinicalTrials.gov link — a hallucinated-but-real NCT for the wrong drug ships as an
  authoritative trial link and passes every gate in the repo. This is the *exact* shape of last
  week's worst failures (an HIV study, an ophthalmology study, a lactoferrin ICU study).
- **`src/content/blog/`** — 155 posts, never resolve-checked. The blog Zod schema
  (`src/content/config.ts:294-299`) types `sources[].id` as a bare `z.string()`, so
  `"STEP-UP topline, Novo IR"` is schema-valid; one review measured 493 of 495 existing source ids
  as unresolvable slugs. `validate-cross-links.mjs` touches blog only for
  `relatedPeptides`/`relatedGlossary`, at severity *warning*. Agent 2 drafts blog posts from the
  newest, least-settled material into the least-gated, most-shareable surface on the site.

### C4 — No CI, so the "PR gate" is a convention that has already failed three times
**Severity: critical. Verified: no `.github` directory.**

Every gate runs only when a human or agent remembers to run it, locally, on OneDrive, mid-agent-run,
on a residential IP. `npm run check` also omits the two hard non-negotiables it claims to enforce:
`qa-banned-content.js` is wired only as an *advisory* PostToolUse hook (`.claude/settings.json`),
and Zod enum validity is caught only by `astro build`, which is not in `check`. Across ~34 waves
the probability of at least one un-gated merge approaches 1.

### C5 — Human review capacity is the binding constraint, and the plan budgets zero hours
**Severity: critical.**

Topical/claim matching is the *only* thing that caught last week's fabrications — every fake id
resolved. Agent 3 is the same model class that wrote the content, checking work of the kind it just
produced. That leaves the owner. ~4 new findings × 102 dossiers ≈ 400 claims; at 2 min/claim that
is ~13h, at a realistic 15–30 min/dossier of genuine paper-opening it is 25–50h — inside a 14-day
window, with zero hours allocated.

Compounding, and measured: a `gray-matter` → `matter.stringify` round-trip rewrites 29 lines of
`semaglutide.mdx`, 51 of `tesamorelin.mdx`, 21 of `bpc-157.mdx` — pure quote-style churn in the
hand-written `scoring` block, ~10:1 noise-to-signal against the real added lines. An un-reviewable
diff is an unreviewed diff. **The gate that stopped the last fabrication wave is the one this
plan's scale removes.**

### C6 — The discovery query reproduces the fabrication mechanism at 10× volume
**Severity: critical. Measured live across all 102 slugs.**

Agent 1 does `esearch` from the name+aliases OR-query. The alias sets are catastrophically
ambiguous in PubMed: `p21.mdx` (name "P21") returns 886 hits dominated by the CDKN1A tumour
suppressor, not the CNTF-derived peptide; `ll-37.mdx` carries alias `CAMP` → 1,489 hits of cyclic
AMP / the CAMP gene; `hmg.mdx` carries `HMG` → 207 hits of HMG-CoA reductase / statin literature;
`glutathione.mdx` returns 6,598 hits of general redox biology. And 67 of 102 dossiers sit at
`lastUpdated` 2026-01, so "everything since lastUpdated" is a ~6-month window: `semaglutide[tiab]`
alone returns 1,267 records.

An agent handed 1,489 records with no cap, no ranking, and no publication-type filter either blows
the budget or silently samples the first N and reports as if it saw everything. **Silent sampling
is invisible in the output.** This is the same mechanism as "claims pinned to papers that did not
support them" — pointed at the research step, upstream of everything.

### C7 — "Prune superseded claims" is the one operation every gate in the repo is blind to
**Severity: high.**

All existing mechanisms are additive-verification: does the id resolve (`qa-pmids`), was it
retracted (`qa-retractions`), does the arithmetic hold (`qa-scoring`), does the enum exist
(`astro build`). **Deletion passes all of them trivially** — a dossier with a well-supported claim
removed is *greener* than one with it present. A model that decides a claim is "no longer
supported" because it did not find the paper in its candidate window silently degrades the product,
and the reviewer sees one red line among hundreds. Absence of evidence is also the one thing an LLM
structurally cannot establish.

### C8 — Scoring authority inside the per-dossier agent produces 102 uncalibrated nudges
**Severity: high.**

`scripts/qa-scoring.mjs` validates only internal arithmetic (composite within ±1 of the weighted
sum, sub-scores 0–100, community ≤50, citations non-empty). It has **no cross-dossier calibration
check**. An agent that raises `researchDepth` 62→68 and recomputes the composite passes perfectly
while drifting off the semaglutide=98 anchor scale. Phase 38's own data is the counter-evidence:
score reconciliation run as a *separate batch pass* over 41 evidence-changed dossiers moved only 2
(commit `138ffa0`) — a ~5% base rate. Distributing a rare, calibrated, batchable judgement across
102 independent agents converts it into 102 chances for silent inflation on the site's most
user-visible number, with a green gate.

### C9 — Uniform sweep over a radically non-uniform corpus, which is itself fabrication pressure
**Severity: high. Measured.**

Probing all 102 dossiers against PubMed with a date floor at each dossier's own `lastUpdated`:
**24 return ZERO new records** (alixorexton, bronchogen, cartalax, cerluten, chelohart, ct-388,
dihexa, dsip, endoluten, evx-01, na-semax-amidate, pancragen, pf-08653944, retinalamin, sigumir,
suprefort, svetinorm, testagen, thymogen, ventfort, vesugen, visoluten, vk2735, vladonix);
27 more return 1–5. That is **51/102 with ≤5 candidates**. The top 5 dossiers hold 74% of all
candidate records; the top 10 hold 88%.

Running Research → Update → Review uniformly spends the majority of the budget on guaranteed
no-ops — and an agent dispatched at a dossier with no new evidence, under a brief saying "pull in
new studies", is under implicit pressure to return *something*. That pressure is pointed at the
24 weakest-evidence dossiers in the corpus, which are exactly the Khavinson-bioregulator tier where
`.claude/rules/lessons.md` already records fabricated PMIDs (cardiogen) and an untriaged sibling
(vesugen). Fabrication rate scales with topic obscurity; this design maximises effort exactly where
obscurity is highest.

### C10 — No idempotency, no ledger, no checkpointing
**Severity: high.**

`src/content/config.ts:164-168` defines `keyFindings` as `{study, type, finding, pmid?}` — no
stable id, no dedup key. Re-run Agent 2 after a partial failure (the expected case across an
8+ hour run) and "Wilding JPH et al. 2021 (STEP 1)" gets re-added as "Wilding et al., STEP 1
(2021)". Both resolve; `qa-pmids` passes; `qa-scoring` only checks arithmetic; `astro build` only
checks enums. The duplicate is invisible to every gate and inflates the study counts that drive
`researchDepth` (weight 0.30). Meanwhile research — the expensive stage — is treated as an
intermediate and never banked: Phase 38 flagged "55 new studies" in wave 1 and they now exist only
as a sentence in `PROGRESS.md`.

### C11 — Prereq #0 exists only as an uncommitted working-tree edit, on a dirty tree, with 3 stale worktrees
**Severity: high. Verified.**

`git show HEAD:scripts/qa-pmids.mjs | grep -c AbortController` → **0**. The working-tree copy has
it. The fix that unsticks production is one `git checkout .` or stash mishap from destruction, and
the plan defers it to ~Aug 7 — two more weeks of stale prod.

The tree it sits in also carries 7 deleted root docs (`CLAUDE.md`, `README.md`, `SEO-PLAN.md`,
`COMPETITIVE-INTEL.md`, `DOSSIER_CHECKLIST.md`, `DOSSIER_UPDATE_PROGRESS.md`,
`LAUNCH-OPERATIONS.md`), 6 modified source-packs, and untracked `.claude/rules/`. `git worktree list`
shows three live worktrees at June commits `d343ee4` / `81f4cf2` — all predating the wave-2/wave-3
citation fixes and the scoring reconciliation. An agent landing in one would "correct" already
corrected citations. `.claude/rules/lessons.md` already records a themed commit sweeping in
unrelated working-tree edits (2026-05-29 rebrand); a 102-file wave commit would delete `README.md`
inside a content diff nobody reads the file list of.

### C12 — `lastUpdated` bumped before verification; freshness becomes structurally dishonest
**Severity: high.**

Agent 2's spec includes "Bump `lastUpdated`"; Agent 3 runs after. Partial failure across an 8h run
is the expected case, and when it happens you are left with dossiers whose content was edited and
whose date says verified, with nothing distinguishing reviewed from unreviewed edits. The freshness
date is the exact trust signal `LOOP-DESIGN-SPACE.md` identifies as the competitive bar. Making it
structurally dishonest is worse than leaving it stale.

### C13 — Cheap, verified checks the plan omits entirely

Each of these was probed live and would have caught a specific documented failure:

| Check | Measured on current corpus | Catches |
|---|---|---|
| **NCT drug-match** — CT.gov `fields=...InterventionName,InterventionOtherName,BriefTitle,Acronym` vs name+aliases | 3 flags / 48 cited NCTs (**6.3% noise floor**); flags are genuinely worth review (`pf-08653944.mdx` cites NCT06712836/NCT06857617 whose interventions are MET097) | Every NCT failure from last week |
| **Numeric traceability** — efetch abstract, literal presence of each number | 344 numeric keyFindings w/ PMID; **86.3% all-numbers-present**, 11.6% partial, ~1% true zero after excluding digits from the peptide's own name | "59.1% vs 52%", cagrisema's 22.7%, "8-fold BDNF" |
| **Unpublished-as-fact** — CT.gov `hasResults` | **40/48 cited NCTs have `hasResults:false`**; retatrutide asserts 34 phase statements with **zero NCTs anywhere in the file** | Invented trial names + unpublished Phase 3 as fact |
| **Trial-name/phase anchoring** — CT.gov acronym set + PubMed `PublicationType` | 22 dossiers assert 52 trial-name tokens, unverified; **27/102 assert a Phase with no NCT anywhere** | "ORCHESTRA-NT1 Phase 3" (oveporexton) |
| **PMID drug-topic** — efetch title+abstract+MeSH vs name/aliases | **141/604 citation slots flag (23.3%) across 44 dossiers** — too noisy to block until baselined; but `vesugen.mdx` flags 2/2 | The Khavinson-batch fabrication tier |
| **Cross-dossier crosstalk** — offline 8-gram shingles over `regulatoryStatus.notes`, `aliases[]`, `conditions[].researchSummary` | not yet run | Copy-paste contamination from the wrong drug |

**The 23.3% figure is the load-bearing one for sequencing:** if the refresh runs first, the report
shows ~141 pre-existing flags plus whatever the agents add, and nobody can tell them apart. The new
fabrication hides inside the old debt. **The baseline must be measured and frozen before any agent
edits content.**

### C14 — Medium-severity issues worth fixing but not worth re-litigating

- **Derived counters drift silently.** 101/102 dossiers hardcode a study count
  (`semaglutide.mdx:24` — `'Semaglutide: 95 Studies Reviewed (2026)'`, with `sources.count: 95`);
  99/102 hardcode `Updated <Month> <Year>` in `metaDescription`. Semaglutide's already says
  "Updated Feb 2026" against `lastUpdated: 2026-04-13`. Adding studies is the sweep's core action
  and breaks all of them invisibly. `qa-comparison-audit.mjs` already cross-checks comparison-page
  counts against dossier `sources` — and is **not** in `npm run check`.
- **`preprint` has no `keyFindings` slot.** `src/content/config.ts:165` enumerates
  `human-rct | human-observational | animal | in-vitro | meta-analysis | review`. Lines 239/256/298
  (`sources[].type`) *do* include `preprint`. Europe PMC `SRC:PPR` is an explicit Agent-1 source,
  so an agent holding a bioRxiv preprint must either mislabel it (silently promoting it to
  peer-reviewed in the rendered badge) or invent `preprint` → off-enum → build failure. Agents
  demonstrably guess in this exact field (`review`, `cell`, 2026-06-26).
- **42% of edges are structurally unverifiable.** `config.ts:31` types
  `conditions[].relevantStudies` as `z.array(z.string())` — 623 bare PMIDs attached to
  multi-paragraph `researchSummary` prose with no sentence mapping. Agent 2 is told to append to
  it. Every append creates an edge no reviewer or script can ever verify.
- **Cross-source dedup.** One study routinely appears as a preprint DOI, a PMID, an NCT, and a
  press release. With no canonicalization, four entries land, all four resolve, and
  `researchDepth` (weight 0.30) inflates from one study with zero fabricated identifiers.
- **`refresh-trials.mjs` has the Prereq-#0 bug.** Line 72: `await fetch(url, {headers:{accept:...}})`
  — no `signal`. `refresh-trials-all.mjs:47`: `execFileSync('node', cmd, {encoding:'utf8'})` — no
  `timeout`. One hung socket stalls a 31-pack `--apply` sweep partway through, some packs written,
  no record of where it stopped.
- **72/102 dossiers have no source pack.** `refresh-trials.mjs:41` hard-exits
  ("This script only refreshes existing packs"), and `refresh-trials-all.mjs` enumerates the pack
  directory, so it never sees them. The trials half of the sweep is a silent no-op on 71% of the
  corpus — or an LLM hand-authors 72 JSON files in an undocumented shape with no working validator.
- **OneDrive is in the write path.** `audit-citations-extract.mjs:24` carries the comment
  *"Exclude OneDrive conflict copies like `vilon 2.mdx`"* — this has already happened. Astro globs
  `src/content/peptides/*.mdx`, so a conflict copy is a live duplicate page on a `-2` slug. Tree is
  currently clean of them, so this is preventable rather than latent.
- **28 placeholder citation values across 10 dossiers.** `npm run check` emits them as a
  non-blocking worklist today: `testagen.mdx` has five `pmid: "N/A"` plus
  `source: "Theoretical based on bioregulator model"`; `ovagen.mdx` has three
  `source: "Russian preclinical research"`; `vk2735.mdx` has `pmid: "NA"`. Cross-referenced against
  the evidence probe, 3 of those 10 have **zero** new PubMed records. A "pull in new science" sweep
  does nothing for them; what they need is the opposite operation.

---

## Revised architecture

### Governing principle

**Freeze, then write.** Evidence is fetched by script and frozen to disk *before* any prose exists.
The drafting agent is mechanically confined to identifiers and numbers present in the frozen
ledger, and every drafted claim must carry a verbatim `supportQuote` from it. Verification then
becomes a **string-containment check**, not a re-research task an LLM can fake.

Second principle: **the commit unit is not the reasoning unit.** The plan runs discovery,
adjudication, drafting, and verification all at file granularity, which is why the reviewer cannot
report precisely and why one bad edge invalidates a whole dossier. Correct units:

| Stage | Unit | Why |
|---|---|---|
| Harvest | **slug** | one alias-OR query per peptide |
| Adjudicate | **candidate source** | one RESEARCHER-CRITERIA judgement per paper, cacheable — 58 of 696 cited ids already appear in >1 dossier |
| Freeze | **identifier** | immutable, hashed |
| Draft | **claim edge** | 1,491 edges exist today; a defect is ~200 bytes, not 16 KB |
| Mechanical verify | **claim edge** | scripts decide per-edge |
| Blind review | **claim edge** (residue only) | LLM judgement spent only where machines cannot decide |
| Apply + gate + review | **file / PR** | Zod validates whole files; `sources.count` ↔ `metaTitle` consistency is file-scoped |

### Track 0 — Week 0: unstick, harden, measure (NO content work)

Non-LLM. ~2–3 days. Nothing in Tracks A–D may start until this is done.

1. **Land Prereq #0 today.** Commit **only** `scripts/qa-pmids.mjs` (explicit path — never
   `git add -A`), PR to main, confirm the Vercel deploy goes green, and **separately confirm the
   deployed build actually contains the June citation corrections through `138ffa0`** — that has
   never been verified and it determines whether the integrity work is live at all.
2. **Reconcile the tree.** Deliberately commit or restore the 7 deleted root docs and the 6
   modified source-packs; commit `.claude/rules/`; `git worktree remove` the three stale worktrees
   at `d343ee4`/`81f4cf2` (verify `pwd` first).
3. **Fix the fail-open gate** (G1 below) and the `encodeURI` → `encodeURIComponent` DOI bug
   (`qa-pmids.mjs:147`; real DOIs contain `#`/`?`/`&` and get truncated into false "fabricated"
   flags).
4. **Stand up `.github/workflows/content-gate.yml`** and **move the network resolvers out of
   `prebuild` into it** — that permanently resolves the Prereq-#0 hazard class rather than patching
   this instance, and puts the checks on a clean checkout, on a non-residential IP, with API keys.
5. **Get free API keys** (NCBI 3→10 req/s; openFDA 1,000/day→120k/day) and build
   `scripts/lib/ratelimit.mjs` — one shared throttled fetch enforcing a global token bucket via a
   lock file, so the cap is per-IP not per-process.
6. **Build the deterministic tooling** (below) and **the new gates** (G1–G14).
7. **Measure and freeze the baseline.** Run every new gate against the *current* corpus and write
   each surviving flag to `data/citation-context.json` as `{slug, id, reason}` with a
   **human-written** reason. This is the step that makes every later flag binary and actionable.
   Includes triaging `vesugen.mdx` (2/2 flagged) and the rest of the Khavinson batch — open in
   `lessons.md` since 2026-05-31.
8. **Curate + human-approve a `pubmedQuery` per high-volume slug**, stored in
   `data/source-packs/<slug>.json`, with explicit NOT-terms (p21 → `"P021"[tiab] OR
   "Ac-DGGLAG-NH2"[tiab]`, NOT CDKN1A senses; ll-37 → drop the `CAMP` alias from the query).
   Approve once; every future run inherits it.
9. **One mechanical "normalize frontmatter quoting" commit** across all 102 dossiers, so refresh
   diffs are pure signal instead of 10:1 churn.
10. **Move OneDrive out of the write path**: run the refresh in a git worktree outside the synced
    tree (e.g. `C:\dev\pepcodex-refresh`), push the branch, merge from the OneDrive clone.

**Deterministic tooling to build in Track 0** (LLM-free; this is where most of the risk reduction
lives):

| Script | Job |
|---|---|
| `scripts/evidence-delta.mjs` | Zero-LLM triage: per-slug PubMed (`datetype=edat`, 30-day overlap) + Europe PMC + CT.gov delta → `.planning/phases/39-refresh-and-app/delta/<slug>.json` + a ranked report. A probe version ran the whole corpus in under 2 minutes. |
| `scripts/discover-evidence.mjs` | Harvest: forked from `refresh-trials.mjs`'s fetch/normalize skeleton. Writes **verbatim API payloads** to `candidates/<slug>.raw.json`, committed, so recall is auditable after the fact. Encodes the RESEARCHER-CRITERIA threshold *into the query* — adding `AND (randomizedcontrolledtrial[pt] OR meta-analysis[pt] OR systematic[sb])` cut `semaglutide` from 1,267 to 144 (8.8×), which maps directly onto the doc's "Score 2+ to cover" rule. Hard cap 25 candidates/slug; records `{totalMatched, triaged, filterUsed}` so sampling is **visible**. |
| `scripts/freeze-evidence.mjs` | Two-phase commit: efetch abstract XML, PMC full text when OA, CT.gov `protocolSection`+`resultsSection`, Crossref `/works/{doi}` → `evidence-ledger/<id>.json`, hashed, immutable. Precedent already on disk: `.planning/citation-audit/pubmed-meta.json` (236 KB). |
| `scripts/apply-finding.mjs` | The **only** writer of dossier frontmatter. Targets an explicit block by jsonPath, rejects duplicate ids, rejects off-enum values pre-write (mirrors `config.ts`), re-serializes without reformatting churn (use the `yaml` package's Document API, not `matter.stringify`). |
| `scripts/stamp-verified.mjs` | The **only** writer of `lastUpdated` / `scoring.lastReviewed`. Runs only against a `verdict: clean` artifact for that slug. |
| `scripts/refresh-trials.mjs --init` | Scaffolds a pack for the 72 missing dossiers purely from CT.gov payloads. **No LLM authors pack JSON at any point.** Requires reconciling `data/schemas/source-pack.schema.json` to the live shape first. |

Also in Track 0: port the 12s `AbortController` into `refresh-trials.mjs:72`; add
`{timeout: 60000, killSignal:'SIGKILL', maxBuffer: 4*1024*1024}` to `refresh-trials-all.mjs:47`;
write `.qa/trials-progress.json` after each pack so a killed sweep resumes.

### Track A — machine-only freshness (ship immediately, auto-mergeable on green)

Zero LLM claims, fabrication-proof by construction. Delivers most of the *visible* freshness value
in a day.

- `npm run refresh-trials-all -- --apply` across all packs + the 72 `--init` scaffolds
- openFDA approval sweep — **one bulk call** sorted `submissions.submission_status_date:desc`
  joined locally against the slug/alias map, not 102 per-peptide queries (also sidesteps the
  verified-broken date-range bracket filter)
- `qa-retractions.mjs` sweep
- `qa-source-counts.mjs --fix` — recompute `sources.*` from actual citations
- staleness-literal sweep into dossier frontmatter (derive `metaTitle` count and
  `metaDescription` month at build time)
- one corpus-wide `regulatory-delta.json` from the FDA Bulk Drug list / WADA / IR pages — fetched
  **once**, not once per dossier

**This is the only track where auto-merge-on-green is defensible.** Put that question to the owner
explicitly (see Open questions).

### Track B — evidence additions (the agent pipeline, ~20–25 dossiers, human-reviewed)

Only slugs whose `evidence-delta` contains **≥1 human RCT, meta-analysis, or regulatory action**
enter this track. Everything else is routed to Track C or to a recorded no-op.

```
HARVEST      script, per slug     → candidates/<slug>.raw.json  (verbatim payloads, committed)
ADJUDICATE   LLM,   per SOURCE    → decisions.json  {id, verdict, evidenceScore, redFlags, reason}
                                     — must justify every EXCLUSION, not just inclusions; cached
                                       and reused across dossiers (58/696 ids span >1 dossier)
CANONICALIZE script, per cluster  → one entry per study: preferredId (PMID>DOI>NCT>URL) +
                                     alternateIds[]; a preprint and its published version are ONE
                                     study; a press release never increments any count
FREEZE       script               → evidence-ledger/<id>.json  (immutable, hashed)
DRAFT        LLM,   per EDGE      → edges/<slug>.json
                                     {edgeId, jsonPath, citedId, claimText, supportQuote,
                                      supportField, type, scoreImpact?}
                                     — NEVER touches the .mdx; may cite ONLY ledger ids; may state
                                       ONLY numbers present in supportQuote
VERIFY       script, per EDGE     → verify/<slug>.json  (G3–G8 below; no LLM)
BLIND REVIEW LLM,   residue only  → given {claimText, citedId} ONLY — never the drafter's rationale,
                                     never the diff. Answers yes/no/partial + quote.
RECONCILE    script               → diffs blind verdict vs drafter assertion; conflicts route out
APPLY        script, per file     → apply-finding.mjs writes frontmatter deterministically
STAMP        script, per file     → stamp-verified.mjs writes lastUpdated only on clean
GATE + PR    CI, ≤5 dossiers/PR   → content-gate.yml on a clean checkout
HUMAN        per PR               → reviews the generated TABLE, not the YAML
```

**Reviewer authority is asymmetric, not absolute.** The plan's "Agent 3 never edits" forces a
16 KB-file verdict for a 200-byte defect and guarantees ping-pong, because the common outcome
("unsupported → cut it") needs no new evidence. So: the reviewer **MAY** delete a claim edge, soften
a `benefitQualifier`, or downgrade an `evidence.level` in place — all monotonically
safety-increasing. It **MAY NOT** add a claim, add a citation, or raise a grade. Cap bounces at
**one** round trip; anything unresolved goes to a human queue file. (The plan's `needs_work` loop
currently has no termination condition.)

**Blind-review calibration:** log a per-wave disagreement rate. **A 0% disagreement rate is a
failed review, not a clean one** — re-run with a deliberately corrupted canary claim seeded in.

**Idempotency + checkpointing:**
- `edgeId = sha1(slug | jsonPath | citedId)`; `apply-finding.mjs` refuses an already-applied
  edgeId and refuses any id already present anywhere in the target file.
- Append-only `.planning/phases/39-refresh-and-app/ledger.jsonl`, one row per
  `{slug, stage, status, artifact, dossierContentHash, ts}`. The runner skips any `(slug, stage)`
  already done; the content hash invalidates stale research if the dossier changed underneath.
  Stages: `pending | harvested | adjudicated | frozen | drafted | verified | reviewed | applied |
  stamped | committed`.
- **Findings are committed the moment research returns**, as their own `chore(research):` commit,
  separate from any content edit. Research is the expensive stage; a run that dies before DRAFT
  must still bank a reusable evidence worklist.
- Per-dossier commits inside a ≤5-dossier PR branch, so a killed session loses at most one dossier.
- Commit with **explicit path lists only** — `git add src/content/peptides/<slug>.mdx`, never
  `git add -A` or `git add src/`.

**PR review ergonomics.** Every PR carries a machine-generated table so the owner reviews the
table, not the YAML, and checks off rows:

| id | type | claim as written | supportQuote (verbatim) | source title | score delta |

Cap: **≤5 dossiers per PR** (~5 PRs at 25 dossiers). Sequencing note: no dossier enters Track B
until the owner has approved its `pubmedQuery`.

### Track C — integrity repair (no discovery, higher moat value per hour than any addition)

- The **28 placeholder citation values across 10 dossiers** (`testagen`, `ovagen`, `vk2735`,
  `ct-388`, `pt-141`, `shlp-6`, `5-amino-1mq`, `aod-9604`, `amycretin`, `chonluten`): find a real
  supporting id or downgrade/remove the claim and re-label the grade. 1–2 sessions.
- The **141 frozen topic-flag baseline** — triage, with `vesugen` and the Khavinson batch first.
- The **27 dossiers asserting a Phase with no NCT** — anchor or soften.
- The **493 free-text blog `sources[].id`** — backfill or re-type.

This is the work the M4 B2B data API is already hard-gated behind, so it is not detour work.

### Track D — removals / superseded claims (human-led, separate PRs)

Split out of the content pass entirely. Every removal must carry `supersededBy` (a resolving id for
the newer contradicting source) plus the verbatim removed text, logged to
`removals/<slug>.json`. `qa-removals.mjs` (G11) fails when a dossier's citation count drops without
a matching entry. Removals get their own PRs — different risk profile, different reviewer mindset.
Retraction-driven removals (from `qa-retractions.mjs`) are the only category safe to batch, because
the justification is machine-generated.

### Scoring — one calibrated pass, after all content lands

Stripped from the drafting agent entirely. Drafters emit
`scoreImpact: {axis, direction, magnitude, why, evidenceIds}` into the edges file. After Track B
merges, run one pass with **every evidence-changed dossier visible simultaneously** and the anchors
(semaglutide=98 / cerluten) in context, then let `qa-scoring.mjs` validate the arithmetic.
Expect ~5% to move; **a proposal to move more than ~15% is a signal the pass itself has drifted.**
Add `scoring.changeLog[] = {date, axis, from, to, drivenBy:[ids], rationale}` and require any
subscore *increase* to be backed by added `scoring.citations[]` ids that PASS every new gate.
Score *decreases* stay unrestricted — correcting inflation must always be cheaper than causing it.

### Blog — its own mini-phase, week 1, decoupled

Two posts seeded from whatever `evidence-delta` surfaces. Reads **only the frozen ledger and the
merged diff — never the drafting agent's memory** (that is how an inflated number propagates into a
second artifact and gains apparent independent corroboration). Reuse the "≥3 novel verifiable items
or hold" threshold already specified in `.planning/phases/38-data-freshness/DAILY-BRIEFING-LOOP.md`
rather than inventing a new rule. Same `supportQuote` requirement, same gate.

### Changelog as a product, not a commit byproduct

Every touched dossier emits a structured `changelog[]` frontmatter entry —
`{date, studiesAdded:[ids], claimsPruned:[...], scoreDelta, signalGrade}` — rendered as a
"Recent updates" block by `src/layouts/DossierLayout.astro` (which already emits `dateModified`
~line 387). One artifact serves three jobs: the E-E-A-T freshness signal, the weekly digest input,
and the reviewer's diff summary. This is a one-time chance to generate ~25 changelog entries; if
they exist only as commit prose the value is thrown away.

### Pilot before committing to the full run

Before Track B goes wide, pilot **5 dossiers chosen adversarially**: `semaglutide` (the volume
case, 1,267 candidates), a Khavinson bioregulator (the known fabrication-batch case), a dossier
with no source pack (72/102 — the missing-infrastructure case), `cagrisema` (the
recently-corrected regression case), and one expected to have zero new evidence (the false-positive
case). Measure four numbers the plan currently assumes: tokens/dossier, wall-clock/dossier,
**owner review minutes/dossier**, and the blind reviewer's false-clean rate against a claim you
deliberately corrupt. **Those numbers decide the schedule — not the calendar.**

---

## New gates required

Wired into `.github/workflows/content-gate.yml` and (for the non-network ones) `npm run check`.
Every gate takes `--since <ref>` so it is **diff-scoped**: pairs new or moved in this PR are
blocking; pre-existing pairs report separately as inherited debt. All reuse the `walk()` +
batch + `AbortController` skeleton in `scripts/qa-pmids.mjs`.

| # | Script | Checks | Data source | Disposition |
|---|---|---|---|---|
| **G1** | `scripts/qa-pmids.mjs` *(harden, not new)* | Track `checked/total` per identifier class; 3× backoff with jitter honouring `Retry-After`; **never print PASS for an unchecked class** — in `--strict` exit 1 with `GATE INCOMPLETE: NCT resolution unverified (0/48 checked)`. Emit `.qa/gate-report.json`. Genuine-outage escape hatch becomes an explicit `--allow-outage` a human passes. Fix `encodeURI`→`encodeURIComponent` (line 147); batch Crossref via `works?filter=doi:a,doi:b`. Add `--dirs peptides,blog,comparisons` + a JSON walker over `data/source-packs/*.json`. | NCBI esummary · CT.gov v2 · Crossref | **BUILD-BREAKING** |
| **G2** | `scripts/qa-nct-drug-match.mjs` | Every cited NCT's `BriefTitle + OfficialTitle + Acronym + InterventionName + InterventionOtherName`, normalized, must contain the dossier's `name` or an alias (len ≥3). Non-match = block unless `(slug, NCT)` is in `data/citation-context.json` with a written reason. | CT.gov v2 `filter.ids` **with an expanded `fields=` list — same HTTP call `qa-pmids` already makes** | **BUILD-BREAKING** (6.3% measured noise floor) |
| **G3** | `scripts/qa-claim-support.mjs` | For every edge added in this run: `citedId ∈ ledger`; `supportQuote` is a literal substring of the frozen ledger entry after whitespace/case normalization; every numeral in `claimText` also appears in `supportQuote`. | `evidence-ledger/*.json` (local, no network) | **BUILD-BREAKING** — this is the gate that replaces Agent 3's promise |
| **G4** | `scripts/qa-claim-numbers.mjs` | Corpus-wide: for every `keyFinding` / `timeline[].effects` with a numeric token and a PMID, assert word-boundaried literal presence in the fetched abstract. Excludes digits inside the peptide's own name/aliases and bare 4-digit years. **Zero numbers found = block; partial = review-queue row.** Header must state the recall caveat: catches "the number is not in the paper", not "the number describes a different arm". | NCBI efetch abstract XML | Block on new/zero · queue on partial (86.3% clean; ~40 queue rows corpus-wide) |
| **G5** | `scripts/qa-trial-claims.mjs` | **NAME:** acronym-shaped tokens in `keyFindings[].study` must appear in the linked PMID's title/abstract, in the drug's CT.gov acronym set (`query.intr=<name OR aliases>&fields=NCTId,Acronym` — verified to return TRIUMPH-1..9 for retatrutide), or in the allowlist. **PHASE:** any "Phase N" must be anchored to an NCT whose `designModule.phases` matches, or a PMID whose `PublicationType` includes "Clinical Trial, Phase N". **UNPUBLISHED:** a quantitative token anchored to an NCT with `hasResults:false` and no PMID = block. Stoplist for journal/org tokens (NEJM, JAMA, AUA, JCEM). | CT.gov v2 · NCBI efetch `PublicationType` | Block on new · queue for the 27-dossier unanchored backlog |
| **G6** | `scripts/qa-study-type.mjs` *(fold into G4's efetch payload — zero extra API cost)* | `human-rct` requires `PublicationType` ∋ "Randomized Controlled Trial"/"Clinical Trial"; `meta-analysis` ∋ "Meta-Analysis"; `review` ∋ "Review"; `animal`/`in-vitro` must NOT carry "Randomized Controlled Trial". | NCBI efetch `PublicationType` + MeSH | Warn-only one wave (PubMed indexing lags ~weeks on new papers), then **BUILD-BREAKING** on new/changed rows |
| **G7** | `scripts/qa-duplicate-citations.mjs` | Same PMID/NCT/DOI twice in one `evidenceChainedBenefits` block, twice in `scoring.citations`, or an added id already present anywhere in the target file. | local frontmatter | **BUILD-BREAKING** |
| **G8** | `scripts/qa-crosstalk.mjs` | 8-gram shingle sets over `summary`, `regulatoryStatus.notes`, `conditions[].researchSummary`, `interactions[].description`, `timeline[].effects`, `aliases[]`. **Exact alias collision across two dossiers = block** (an alias belongs to exactly one compound); ≥3 consecutive shared shingles = queue. Boilerplate ignore-list seeded on first run. | local, offline — no network, no rate limit | Block on alias collision · queue on prose overlap |
| **G9** | `scripts/qa-source-counts.mjs` | Recompute `sources.{count,human,preclinical,openAccess}` from the actual citation sets; fail on mismatch. Fail when a numeral in `metaTitle`/`metaDescription` adjacent to `studies\|citations` disagrees with `sources.count`, or a hardcoded `Updated <Month> <Year>` disagrees with `lastUpdated`. | local frontmatter | **BUILD-BREAKING** |
| **G10** | `scripts/qa-banned-content-all.mjs` | Corpus runner over `src/content/{peptides,blog,comparisons}` reusing the exported `scanBannedContent()`. First run snapshots current hits to `.qa/banned-baseline.json`; the gate fails **only on hits not in the baseline** (patterns like `\b(dose\|dosing\|protocol)\b` legitimately match "dose-ranging study"). | `scripts/qa-banned-content.js` | **BUILD-BREAKING** on new hits |
| **G11** | `scripts/qa-removals.mjs` | A dossier's total citation count may not drop without a matching entry in `removals/<slug>.json` carrying `supersededBy` + the verbatim removed text, per dropped id. | git diff + `removals/*.json` | **BUILD-BREAKING** |
| **G12** | `scripts/qa-preflight.mjs` | Orchestrator step 0: `git status --porcelain` empty for tracked paths; no file in `src/content/**` or `data/**` matching `/ \d+\.(mdx\|json)$/` (OneDrive conflict copies); no stale worktree; branch assert. | git + fs | **BUILD-BREAKING**, run before dispatch |
| **G13** | `scripts/validate-source-pack.js` *(existing, reconcile then enable)* | Ajv against `data/schemas/source-pack.schema.json` — **reconcile the schema to the live shape first** (`coreLibrary`, `metadata.lastUpdated`, `trialsLastSynced`). | local JSON | **BUILD-BREAKING** once reconciled; add to `npm run check` |
| **G14** | `.github/workflows/content-gate.yml` | Runs G1–G13 + `validate-cross-links` + `qa-seo` + `qa-scoring` + `qa-retractions` + `qa-comparison-audit` + a full `astro build` with `{ npm run build; echo "REAL_BUILD_EXIT=$?"; } > build.log 2>&1` and a grep for `REAL_BUILD_EXIT=0`. Required status check on PRs to `main`. Network resolvers move here, **out of `prebuild`**. | CI, clean checkout, own API keys | **REQUIRED CHECK** |

**Schema changes required before ingest:**
- `src/content/config.ts:165` — add `preprint` to the `keyFindings[].type` enum, add a visually
  distinct `DossierLayout` badge, and enforce that a preprint can never raise `evidence.level`.
  *(Alternative: forbid preprints from `keyFindings` entirely and confine them to `sources[]`,
  where `preprint` already exists at lines 239/256/298 — decide before the run, not during.)*
- `src/content/config.ts:294-299` — tighten blog `sources[].id` from `z.string()` to the same
  resolvable-identifier pattern as `qa-pmids`' `isResolvableCitation`, keeping the human-readable
  slug in a new optional `key` field. Warn-only first to size the 493-entry backfill.
- `src/content/config.ts:31` — widen `conditions[].relevantStudies` to
  `z.array(z.union([z.string(), z.object({pmid: z.string(), supports: z.string()})]))` so **new**
  entries carry their supported claim while 623 legacy strings still parse.

**Hard deny-path:** LLM writes to `data/source-packs/**` are forbidden (hook-enforced). Trials
enter only via `refresh-trials.mjs`, machine-sourced from CT.gov, keyed by NCT, idempotent
(lines 96–121 already merge correctly). Agent tasks become "invoke the script and report the diff".

---

## What to cut

| Cut | Replace with | Why |
|---|---|---|
| **102-dossier uniform sweep** | ~20–25 dossiers whose `evidence-delta` contains ≥1 human RCT / meta-analysis / regulatory action | 24 dossiers have **zero** new records, 51 have ≤5, top 10 hold 88% of candidates. Uniform effort at zero-evidence dossiers is fabrication pressure aimed at the weakest tier. |
| **Agent 1 as an LLM retriever** | `scripts/discover-evidence.mjs` — verbatim payloads to disk; the LLM's first involvement is **adjudication** of candidates it did not retrieve | A script cannot hallucinate a PMID. Discovery is the one step where determinism is free, and V1-LOOP-PORTFOLIO-SPEC already assigns it to scripts. |
| **Agent-driven pruning** | Track D: flagged human queue with `supersededBy` + `removals/<slug>.json` | Absence of evidence is not something an LLM can establish, and deletion passes every existing gate. |
| **Score adjustment inside the content pass** | `scoreImpact` metadata → one calibrated batch pass afterwards | Measured base rate of legitimate movement: 2/41 (~5%). `qa-scoring` cannot see cross-dossier drift. |
| **Blog drafting inside Workstream A** | Own mini-phase, week 1, 2 posts, seeded from the ledger | Batched at the end = never happens; blog has been dead since 2026-02-18 and should not depend on the slowest track. |
| **LLM writes to `data/source-packs/**`** | `refresh-trials.mjs` / `--init`, script-only | This is the exact vector for a wrong-drug NCT rendering as an authoritative link. |
| **Agent 3 re-resolving ids, checking enums, checking banned content, checking score math** | G1, G6/`astro build`, G10, `qa-scoring` | Four of five of its listed duties are machine work. Every deterministic duty in an LLM's context is attention taken from claim-support — the one duty only an LLM can do, and the one the moat rests on. |
| **`lastUpdated` bumped by the drafting agent** | `scripts/stamp-verified.mjs`, gated on a `clean` verdict | Partial failure is expected; dates must be true, not aspirational. |
| **Per-dossier fetching of corpus-wide prose sources** (FDA Bulk Drug list, WADA, IR, BioPharma Dive) | One corpus-wide pass → `regulatory-delta.json`, read from disk by every slug | Up to 102 redundant fetches of the same PDF, in the lowest-trust tier. |
| **102 per-peptide openFDA queries** | One bulk `sort=submissions.submission_status_date:desc` sweep, joined locally | 1 call instead of 102; also sidesteps the verified-broken date-range bracket filter and the 1,000/day anonymous per-IP cap. |
| **The 2-week calendar as the planning unit** | **Owner review-minutes** as the planning unit | At ~6h/week and 20 min/dossier that is ~18 dossiers/week. If the owner cannot review it, it should not be generated. |
| **Deferring Prereq #0 to ~Aug 7** | Land it today, as a single-file commit | It exists only as an uncommitted working-tree edit (`HEAD` has 0 `AbortController`), and prod has been stale since `253eb38`. |
| **The per-edit `claude-post-edit-qa.mjs` hook during sweeps** | G10 as a blocking pre-PR/CI check | Hundreds of node processes against OneDrive-synced files — the exact pressure that produced EMFILE in May — for advisory output nobody acts on. |

**Keep as written:** CHUNK=3 with the dev server off (correctly internalises the EMFILE incident),
and capturing `REAL_BUILD_EXIT` inside the redirected log (correctly internalises the three
broken-builds-reported-green incident). The gap is not judgement about *known* failures — it is
that the *new* failure modes this scale introduces have no mechanism yet.

---

## Open questions

For the second model (Codex gpt-5.6-sol) and/or the owner. Ordered by how much they change the plan.

1. **Blocking threshold for G2 (NCT drug-match).** Measured noise floor is 6.3% (3/48), and all
   three flags look genuinely worth review. Block from day one with a written-reason allowlist, or
   run warn-only for one wave first? What is the right escalation for `pf-08653944` citing two NCTs
   whose interventions are MET097 — alias gap or wrong-drug attribution?
2. **How much of the 141-flag topic baseline must be triaged before Track B starts?** Full triage is
   the honest answer but may be a week. Is there a defensible minimum (the zero-hit dossiers +
   the Khavinson batch, ~15 flags) that unblocks the refresh without letting new fabrication hide
   inside old debt?
3. **Preprint policy.** Add `preprint` to the `keyFindings` enum (schema change + badge + a rule
   that it can never raise `evidence.level`), or forbid preprints from `keyFindings` entirely and
   confine them to `sources[]` where the type already exists? The second is zero-schema-change but
   loses the strongest early signal.
4. **`relevantStudies` (623 unverifiable edges).** Widen the schema to `{pmid, supports}` objects
   (additive, legacy strings still parse), or require an inline `[PMID:x]` marker in the specific
   `researchSummary` sentence? Which is cheaper to enforce mechanically, and does either need a
   migration of the 623 legacy entries or only apply to new additions?
5. **Concurrency and the write path.** The plan mandates CHUNK=3, but June demonstrably committed
   waves of 12, and `lessons.md` is ambiguous ("≤3 agents safe *without* the dev server"). Resolve
   empirically with one 6-agent wave, dev server off — or is the correct move to take OneDrive out
   of the write path entirely (worktree at `C:\dev\pepcodex-refresh`), which makes the question
   moot and also kills the conflict-copy risk?
6. **Where the gate lives.** `.github/workflows` as a required PR check is clearly right, but prod
   deploys via Vercel `prebuild`. Should the network resolvers move **permanently** out of
   `prebuild` into CI (fixes the Prereq-#0 hazard class forever, but a direct-to-main push would
   then deploy ungated), or stay in `prebuild` with the `--allow-outage` escape hatch?
7. **Autonomy line for Track A.** Trials refresh, openFDA approvals, retraction sweeps and
   source-count recomputation are fabrication-proof by construction. Auto-merge on green, or the
   same hard human-merge gate as content? (`LOOP-DESIGN-SPACE.md` open question #2 asks the same
   thing and is still unanswered.)
8. **Is any score movement in scope for Phase 39 at all**, or is the calibrated pass deferred to a
   later phase entirely? Given 2/41 moved last time, the expected yield of a Phase-39 scoring pass
   is roughly one dossier.
9. **Cost ceiling.** Realistic envelope for the full 102 sweep was estimated at 25–50h machine
   time and 20–45M tokens — repeated weekly-rate-limit territory on a Max plan, meaning it cannot
   run as one continuous push regardless of design. What budget is actually acceptable, and does
   the limit force serialization that the ledger/checkpointing design must accommodate?
10. **Owner review-minutes available per week.** This single number sets the dossier count, the PR
    size, and the schedule. Everything else in this plan is downstream of it.
11. **Workstream B (the `/app` tab)** is small, independent, and blocked only on five owner
    answers, with an Apple store window of ~7/25–26 — **this week**. Should it ship now, fully
    decoupled, rather than sitting behind a content sweep scheduled for August?
12. **Anything in this counter-plan that is over-engineering?** 14 gates plus 6 new scripts is
    ~2–3 days of non-LLM work before a single dossier is touched. Which gates could be deferred to
    a second wave without re-opening a failure class that has already fired?

---

## Appendix — verification of the mechanical claims in this document

All checked at `1f2e0af` on branch `feat/scoring-and-freshness`, 2026-07-24:

- `npm run check` = `validate-cross-links && qa-seo && qa-scoring && qa-pmids --strict` — no
  banned-content runner, no `astro build`, no retraction sweep, no source-pack validation.
- `.github/` — **absent**.
- 102 dossiers · 30 source-packs · 155 blog posts.
- `git show HEAD:scripts/qa-pmids.mjs | grep -c AbortController` → **0**; working tree → present.
  Prereq #0 is uncommitted.
- `git worktree list` → 3 stale worktrees at `d343ee4` / `81f4cf2` (June, pre-citation-fix).
- `git status --porcelain` → 7 deleted root docs, 6 modified source-packs, untracked
  `.claude/rules/`.
- `qa-pmids.mjs:139` (NCT failure recording) is inside the `try` opened at line 126; `:163` prints
  PASS unconditionally. `:147` uses `encodeURI`. `:14` hardcodes `src/content/peptides`.
- `qa-retractions.mjs:16` hardcodes `src/content/peptides`.
- `refresh-trials.mjs:72` — bare `fetch`, no `signal`. `:41` — hard-exit on missing pack.
  `refresh-trials-all.mjs:47` — `execFileSync` with no `timeout`.
- `src/content/config.ts:165` — `keyFindings[].type` enum lacks `preprint`; `:239/:256/:298`
  (`sources[].type`) include it. `:31` — `relevantStudies: z.array(z.string())`. `:295` — blog
  `sources[].id: z.string()`.
- `src/content/peptides/semaglutide.mdx:24` — `metaTitle: 'Semaglutide: 95 Studies Reviewed (2026)'`
  against `sources.count: 95` (`:20`) and `lastUpdated: 2026-04-13` (`:10`).

Measurements attributed to the five source reviews (corpus probes: candidate volumes, 141/604 topic
flags, 40/48 `hasResults:false`, 86.3% numeric traceability, 6.3% NCT-match noise floor, 493/495
blog source ids, 1,491 claim edges) are reported as measured by those reviews and were not
independently re-run here.
