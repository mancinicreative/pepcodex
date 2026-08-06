# GOAL — Make every page Google *can* rank reachable and crawlable

*Framed 2026-08-06 per `00_Claude/ops/task-loop.md`. Loop: `npm run graph:compare`.*

## Step 0 — Verifiability gate ✅

Success is machine-checkable. `scripts/crawl-graph.mjs` builds the internal link graph from
the built output, computes click-depth by BFS from `/`, joins it to real GSC impressions, and
snapshots every run. Pass/fail is a number, not an opinion. Autonomous work is safe here.

## Step 1 — The frame

**Objective.** Every indexable page is reachable from the homepage within 3 clicks and carries
enough internal links that Google will actually fetch it — because a page Google never crawls
cannot rank no matter how good it is.

**Why this and not CTR.** 923 of 1,221 pages have never received a single impression. URL
Inspection says 60% are "Discovered – currently not indexed" (Google chose not to fetch) and
40 of 45 sampled were *never crawled*. Crawl budget, not content quality, is the binding
constraint. Everything else is downstream.

### Success check (the evaluator)

| Metric | Baseline (2026-08-06) | Target |
|---|---|---|
| orphans (0 inbound) | 7 | **0** (excl. `google*.html` verification file) |
| unreachable from `/` | 158 | **0** |
| pages ≥4 clicks deep | 96 | **0** |
| max depth | 6 | **≤3** |
| indexable pages with ≤2 inbound links | 335 | **<100** |
| silent + deep/unreachable | 255 | **<50** |

Plus two hard gates on every increment:
- `REAL_BUILD_EXIT=0` read from **inside** the build log (never the wrapper's exit code)
- no drop in total indexed impressions attributable to the change

**Lagging indicator** (do not optimise directly, review monthly): silent pages 849 → <500, and
GSC "Discovered – not indexed" share falling. These move on Google's schedule, not ours.

### Protected / mutable

- **Mutable:** layouts, page templates, `astro.config.mjs`, sitemap config, internal linking,
  `noindex` flags, `scripts/`.
- **Protected:** `.planning/data/**` (the evidence base), citations/PMIDs and any factual
  content claim, published URLs (no deletions or slug changes without sign-off), anything that
  would ship without Lucas merging.

### Budget & stopping rule

Max 3 attempts per defect class. Stuck twice → change approach. Stuck three times → stop and
escalate with the partial result. Never stack a change on an unevaluated change.

## Step 2 — Ratchet log

| # | Hypothesis | Change | Result | Verdict |
|---|---|---|---|---|
| 1 | Sitemap has no recrawl priority signal | `lastmod` from frontmatter | 0 → 1,128 URLs dated | **KEEP** |
| 2 | Generic glossary terms waste budget at pos 46-82 | noindex 35 + drop from sitemap | −35 URLs, −2,852 impr, **0 clicks lost** | **KEEP** |
| 3 | /clinics/ is 90% silent, 2 clicks in 5.8mo | noindex 61 + drop from sitemap | sitemap 1,220 → 1,124 | **KEEP** |
| 4 | Dossiers don't link their own condition sub-pages | "Conditions Studied" block | unreachable 158 → 20, deep 96 → **0**, max depth 6 → 3 | **KEEP** |
| 5 | 5 dossiers' links broken — `currentSlug` derives from *display name*, not slug (hcg, melanotan-i, mrna-4157, na-selank-amidate, na-semax-amidate) | use real `slugProp` | unreachable 20 → 5 | **KEEP** |
| 6 | /protocols + /directory are orphan islands (5,082 words unreachable) | footer links | orphans 6 → 5 | **KEEP** |
| 7 | /protocols listing links to `protocol.data.slug` — a field the schema doesn't define, so every card rendered `/protocols/undefined` (**live 404 in production**) | use `protocol.id` to mirror getStaticPaths | orphans 5 → **2**, unreachable 5 → **2** | **KEEP** |

| 8 | The graph could not see links to targets that **don't exist** — a missing page has no node to be orphaned. This is how `/protocols/undefined` reached production | broken-link detection in `crawl-graph.mjs` | found **398 broken links / 295 dead targets** | **KEEP** |
| 9 | `relatedPeptides`/`relatedGlossary` are free-text slugs with no referential integrity | validate against collections in `BlogLayout`; render missing as plain text | 398 → 230 | **KEEP** |
| 10 | Clinic cards derive URLs from display names ("Thymosin Beta-4" → no such dossier; it's `tb-500`) | existence check before linking | −60 instances | **KEEP** |
| 11 | `/guides/` (plural) doesn't exist; route is `/guide/`. 32 content links carry trailing slashes → 308 hop each | fix typo; normalise trailing slashes | 230 → 162 | **KEEP** |
| 12 | `/clinics` index links `city.id`, which retains `.mdx` — **this is how raw .mdx URLs got indexed** | strip extension to mirror getStaticPaths | 162 → 102 | **KEEP** |
| 13 | `/regulatory-tracker` links `p.id` (same `.mdx` bug) + trailing slash | use `p.slug` | 102 → **0** | **KEEP** |
| 14 | Regressions must be blocked, not just reported | `--check` gate → `npm run graph:check` | exits 1 on any broken link/orphan/depth>3 | **KEEP** |
| 15 | Dossiers link comparisons only for *declared* `comparators` — 548 relationships exist, 286 declared, so ~half of /compare/ had no link from either peptide | "Compared With" derived from the collection | lowInbound 319 → **115** | **KEEP** |
| 16 | Dossiers don't link their own safety profiles | "Safety profile" block | 115 → 113 | **KEEP** |

### Scoreboard after increment 7

| Metric | Baseline | Final | Target | Status |
|---|---|---|---|---|
| **broken internal links** | **398** | **0** | 0 | ✅ |
| dead link targets | 295 | **0** | 0 | ✅ |
| orphans | 7 | **2** | 0 | ✅ both remaining intentional* |
| unreachable | 158 | **2** | 0 | ✅ same two |
| pages ≥4 clicks deep | 96 | **0** | 0 | ✅ |
| max depth | 6 | **3** | ≤3 | ✅ |
| ≤2 inbound links | 335 | **113** | <100 | ⚠️ stopped deliberately — see below |
| silent + deep/unreachable | 255 | **168** | <50 | ⏳ lagging, moves on Google's schedule |
| sitemap URLs | 1,220 | **1,124** | — | 96 no-value URLs removed |
| sitemap `lastmod` | 0 | **1,093** | — | recrawl priority signal added |

\* `/glossary/off-label` is a 301 redirect target and `/google…html` is the Search Console
verification file. Neither should be linked.

### Why ≤2-inbound stopped at 113, not <100

The remaining pages are at depth 2, linked from both their section index and their dossier.
They are genuinely discoverable. Clearing the last 13 would mean adding links for no reason
other than to move a number — which the gaming check above defines as a failure, not a pass.
**The target was a proxy I chose; the goal is crawlability, and crawlability is met.**

### Still open (not crawl-graph work)

- **Verify the bioregulator A-number errors** flagged by research (chelohart listed A-7, likely
  A-14; ventfort A-14, likely A-3; suprefort/visoluten both A-11). Citation-integrity issue —
  verify independently against primary sources before editing any content.
- **10 reversed-order duplicate comparison pages** cannibalising each other.
- **Nothing here is deployed.** All of it sits uncommitted in the worktree until merged.

### The loop is now self-healing

```bash
npm run graph          # report
npm run graph:compare  # did the last change help?
npm run graph:check    # exits 1 on any broken link, orphan, or depth>3
```

`graph:check` is the ratchet — every defect fixed above is now a build-breaking regression if
it returns. All of them originally shipped by looking correct in review.

## Step 3 — Critic pass

Metrics are hard here, so the critic is narrow: after each increment confirm the fix produced
*real* links to *real* URLs, not just a rendered section. Increment 5 exists precisely because
increment 4 rendered a section whose links 404'd for 5 dossiers — the section looked right and
the graph still said unreachable. **Trust the graph, not the diff.**

## Step 4 — Gaming check

*Is the metric still measuring what Lucas wants?*

Depth and inbound-count are proxies for "Google will fetch this." They can be gamed — dumping
1,200 links in every footer would zero the metrics and help nothing, because link equity would
be diluted to noise and the links would carry no editorial signal. Guard: every added link must
be one a reader would plausibly click. If an increment improves the number without improving
the site, revert it.

Second guard: reducing page count improves crawl focus but is not the objective. Deleting the
whole site would score perfectly. Reductions must be limited to pages that demonstrably earn
nothing (evidenced by GSC), never to pages that merely *look* unimportant.

## Step 5 — History

Every increment is a commit. Snapshots in `.planning/data/v2/graph-snapshots/` are the record;
this table is the summary. The transcript is not the record.

## Out of scope

Content strategy, CTR/title work, affiliate, app funnel. Those are downstream of crawlability
and tracked in `SEO-IMPROVEMENT-PLAN.md`.
