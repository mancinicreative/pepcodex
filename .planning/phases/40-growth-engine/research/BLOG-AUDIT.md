# BLOG-AUDIT — PepCodex blog corpus, 140 posts

*Audited 2026-08-17 by traffic-auditor. Research-only: no file under `src/`, `data/` or any
config was modified. Every count below comes from a structural scan of the working tree, not
from planning docs.*

**Artifacts**
- `blog-checklist.csv` — 140 rows, one per post, sorted by priority score
- `LINKGRAPH.md` — internal-link findings, dossier coverage, app-funnel audit
- `_scan-raw.json`, `_rows-final.json`, `_top20.json` — machine-readable scan output
- `recovered/` — the analytics harness as it existed on `origin/main` (evidence, see §1)

---

## 1. Analytics: toolkit restored, credentials expired, offline data only

**Verdict: no live pull is possible. The audit below runs on offline GSC/GA4 exports
dated 2026-07-25, covering 2026-01-27 → 2026-07-22.**

### What actually happened to `scripts/fetch-search-data.mjs`

The file was never deleted. `git log --all --diff-filter=D -- scripts/` returns **nothing** —
no script has ever been deleted from this repo. The file is missing from the checkout because
**the working branch is divergent from `origin/main`**:

```
git rev-list --left-right --count origin/main...HEAD  ->  7  25
merge-base: 253eb38 "feat(qa): retraction watch + staleness-literal sweeper"
```

`feat/scoring-and-freshness` (e813c1c, 2026-08-07) forked before the analytics work landed.
`origin/main` (455665c, 2026-08-09) carries the whole harness:
`fetch-search-data.mjs`, `gsc-pull.mjs`, `gsc-analyze.mjs`, `gsc-probe.mjs`,
`gsc-repull.mjs`, `gsc-index-diagnose.mjs`, `crawl-site.mjs`, `crawl-graph.mjs`,
`analyze-crawl.mjs` — plus npm scripts `gsc:sites`, `fetch:search`, `fetch:gsc`,
`fetch:ga4`, `gsc:whoami`, `graph`, `graph:check`, `gsc:index`, `gsc:repull`.

It is also checked out live at
`.claude/worktrees/cool-heisenberg-e12770/` (branch `claude/cool-heisenberg-e12770`,
identical SHA to `origin/main`). That worktree is where all the historical data lives.

The orchestrator has since restored the toolkit into `scripts/` on this branch. Copies of
the originals remain under `research/recovered/` as evidence.

### Credentials

Live pulls are **blocked**: ADC credentials are expired (`invalid_grant` / `invalid_rapt`).
Re-authorisation requires the owner to run the OAuth flow himself.
`recovered/GOOGLE-API-SETUP.md` documents the path and two ruled-out dead ends —
service-account keys are blocked by org policy `iam.disableServiceAccountKeyCreation`, and
plain `gcloud auth application-default login` cannot issue Search Console or Analytics
scopes because gcloud's shared client is registered for Cloud scopes only. A self-owned
OAuth client is the only route. **No OAuth was attempted and no credentials were created
during this audit.**

### Offline data that exists on disk

| Path | Date | Contents |
|---|---|---|
| `.claude/worktrees/cool-heisenberg-e12770/.planning/data/v2/` | **2026-07-25** | GSC page/query/date/country/device for both properties, `index-inspection.json`, `manifest.json` |
| `…/.planning/data/` (root) | 2026-07-24 | first GSC pull + GA4 (`ga4-landing-pages`, `ga4-channels`, `ga4-devices`, `ga4-events`, `ga4-monthly`), `crawl-baseline.json` (710 KB) |
| `.analytics/` (gitignored, main checkout) | **2026-05-14** | 5 hand-exported Search Console Coverage CSVs |
| `.planning/data/` (main checkout) | — | **empty** |

**Site totals, from `manifest.json` (pulled 2026-07-25):**

| Property | Window | Days | Impressions | Clicks | CTR | Avg position |
|---|---|---:|---:|---:|---:|---:|
| `https://pepcodex.com/` | 2026-01-27 → 07-22 | 177 | 31,704 | **81** | 0.26% | 24.1 |
| `https://www.pepcodex.com/` | 2026-05-28 → 07-22 | 56 | 5,884 | **40** | 0.68% | 35.4 |

**To get fresh data:** owner re-runs the OAuth login per `recovered/GOOGLE-API-SETUP.md`
Step 8, then `npm run fetch:search`. Nothing else is blocking — the code and the npm
wiring are in place.

**Caveat that governs this whole audit:** the data is ~3.5 weeks stale and predates whatever
`origin/main`'s 398-broken-link fix (commit `3050d3d`) did to crawl behaviour. Treat
impressions as a demand signal, not a current-state measurement.

---

## 2. State of the corpus

### Volume and shape

| | |
|---|---|
| Posts | **140** (`src/content/blog/*.mdx`) |
| Median word count | **634** |
| Under 800 words | **97 / 140 (69%)** |
| Under 500 words | **47 / 140 (34%)** |
| Categories | weekly-briefing 65 · guide 37 · research-digest 15 · safety 11 · deep-dive 6 · regulatory 6 |
| Intent mix | news 71 · commercial 37 · research 21 · educational 11 |

The corpus is **half news wire, half thin definitional stubs.** 65 weekly briefings chase
events that have already passed; 37 "guides" are mostly 150–450-word `what-is-X` pages.
There is very little in the middle — the durable, deep, referenceable format that actually
earns links and rankings.

### Citation health — better than expected

The site's rule is 2–4+ real citations per post.

| | |
|---|---|
| Posts with **0** frontmatter sources | **0** |
| Posts with exactly 1 source (below bar) | **12** |
| Posts meeting 2+ | **128 / 140 (91%)** |
| Posts where some source carries **no identifier at all** (no pmid/doi/nct/url) | **25** |

The 12 below the bar: `amycretin-phase2-results`, `antimicrobial-peptide-funding`,
`fda-compounded-semaglutide-warning`, `lilly-q2-tirzepatide-revenue`,
`peptide-biosensor-pathogen`, `peptide-cart-tumor-penetration`,
`peptide-drug-conjugate-solid-tumors`, `peptide-hydrogel-joints`,
`peptide-stapling-oral-delivery`, `selank-anxiolytic-study`,
**`semax-neuroprotection-stroke`**, `tesamorelin-liver-fat-hiv`.

That last one matters: it is the **highest-impression blog post on the site** and it rests
on a single citation.

### Freshness

- **90 / 140 posts carry no `lastUpdated`.** The field is optional in
  `src/content/config.ts:316`, so nothing enforces it — and with no `lastmod` in the sitemap
  either, Google has no recency signal for two-thirds of the corpus.
- **41 posts older than 6 months** use "ongoing / currently enrolling / results expected /
  anticipated in 20XX" language. Every one is a claim that has silently aged.

### Estimand risk: the 2026-07-25 remediation held

I grepped the corpus for the four superseded figures and their trials. **8 posts matched.
I opened every one and checked the surrounding lines. All 8 are correct.**

| Post | Verified |
|---|---|
| `best-peptide-for-weight-loss-2026` | line 170 leads with 20.4%, labels 22.7% as trial-product estimand |
| `cagrilintide-semaglutide-approval` | lines 57, 69 label 22.7% as trial-product, lead with 20.4% |
| `cagrisema-nda-filed-glp1-amylin-combo` | line 56 leads 20.4% treatment-policy, flags 22.7% |
| `cagrisema-nda-filed` | line 94 labels 22.7% trial-product; line 108 table row reads "(trial product)" |
| `cagrisema-phase3-endpoint` | line 60 labels 15.7% trial-product vs 13.7% treatment-policy (REDEFINE-2) |
| `orforglipron-14-percent-weight-loss` | line 73 leads NEJM 11.2%, labels 12.4% press-release efficacy estimand |
| `glp1-kidney-disease-outcomes` | 12.4% is macroalbuminuria progression — different metric, false positive |
| `tirzepatide-summit-heart-failure` | 15.7% is SUMMIT trial weight loss — different trial, false positive |

**Confirmed uncorrected stale figures: 0.** The estimand work documented in
`.claude/rules/lessons.md` is holding.

**Residual risk worth flagging (marked `WATCH` in the CSV, not `Y`):** in
`cagrisema-nda-filed` (line 108) and `tirzepatide-summit-heart-failure` (line 113) the figure
appears in a **table row** whose label is thinner than the prose caveat elsewhere in the same
post. A table row is what gets scraped into an AI answer or a featured snippet, stripped of
the paragraph that qualifies it. This is a formatting risk, not a factual error.

### SEO posture

`npm run qa-seo` (`scripts/qa-seo.mjs`, confirmed read-only): **0 errors, 4 warnings**,
1,039 files scanned, canonical origin `https://www.pepcodex.com`. Canonical integrity is intact.

Blog metadata is in good shape and is **not** the bottleneck:

| | |
|---|---|
| Missing `metaTitle` | 0 |
| Missing `metaDescription` | 0 |
| `metaTitle` > 60 chars | 0 |
| `metaTitle` < 30 chars | 5 — `what-is-tb-500` (15), `what-is-tesamorelin` (20), `what-is-retatrutide` (20), `what-is-melanotan` (21), `melanotan-safety` (28) |
| `metaDescription` > 160 | 1 — `natriuretic-peptide-heart-failure` (161) |
| `metaDescription` < 120 | 8 |
| `robots: noindex` | 0 |

---

## 3. The finding that should drive wave 2

**5,694 blog impressions. 0 blog clicks. 177 days.**

Sitewide the picture is the same: 31,704 impressions → 81 clicks. And of the 18 clicks
attributable to a named query, the converting queries are almost entirely **brand or
navigational**:

| Clicks | Impressions | Position | Query |
|---:|---:|---:|---|
| 4 | 37 | 4.4 | peptide codex |
| 4 | 32 | 2.3 | survodutide vs cagrilintide |
| 3 | 37 | 3.4 | survodutide vs cagrilintide |
| 1 | 107 | 4.9 | pepdex |
| 1 | 4 | 1.8 | codex peptide |
| 1 | 4 | 4.5 | pepdoc |

The only non-brand query that converts is a **comparison** — twice, at position 2–3.
That is the one proven demand shape on this site, and the blog contains almost none of it.

Meanwhile 37 blog posts rank and earn impressions, several at **position 6–13**, and convert
nothing. `semax-neuroprotection-stroke` sits at position 8.2 on 1,133 impressions with zero
clicks. Its long-tail queries are answer-shaped — "semax amino acid sequence",
"semax enkephalinase inhibition", "semax ema approval" — the kind Google answers in the SERP.

**Read: the corpus has earned visibility it cannot convert.** The gap is not ranking. It is
(a) titles and descriptions that do not promise more than the snippet already gives,
(b) 634-median-word bodies that do not deserve the click, and (c) no internal linking to
carry a reader anywhere once they land. Wave 2 should be a **depth and CTR pass on 20 pages
that already rank**, not a publishing push.

---

## 4. Top 20 optimization targets

Priority = GSC impressions × page-1 proximity × content-gap multiplier. Full formula in
`_rows-final.json`; all 140 ranked rows in `blog-checklist.csv`.

| # | Slug | Impr | Pos | Words | Cites | Verdict | The specific fix |
|---:|---|---:|---:|---:|---:|---|---|
| 1 | `semax-neuroprotection-stroke` | 1,133 | 8.2 | 609 | **1** | optimize | Site's #1 blog page, resting on **1 citation**, no `lastUpdated`. Add sources and answer the actual long-tail set (sequence, EMA status, PK, RCT quality). Already links `/peptides/semax/` at line 52 — but with a trailing slash, see §7 item 7 |
| 2 | `semaglutide-vs-tirzepatide-2026` | 1,004 | 8.8 | 1,141 | 5 | optimize | Comparison intent — the one shape that converts. Only 2 outbound links. Wire to `/compare/`, both dossiers, and the calculator |
| 3 | `dsip-sleep-quality-study` | 592 | 10.4 | 965 | 3 | optimize | Fix the broken `/guides/` → `/guide/` link (line-level, see LINKGRAPH §3); `dsip` dossier has only this one post |
| 4 | `cagrilintide-semaglutide-approval` | 233 | 13.3 | 708 | 2 | optimize | Page-2 edge; thin at 708w on a high-interest approval story |
| 5 | `retatrutide-phase3-enrollment` | 131 | 8.0 | 611 | 2 | optimize | Position 8 on an enrolment story that is now ~12 months old — refresh the trial status |
| 6 | `ss31-mitochondrial-heart-failure` | 128 | 7.8 | 547 | 3 | optimize | Position 7.8, 547 words. Weakest depth-to-rank ratio in the set |
| 7 | `cagrisema-nda-filed-glp1-amylin-combo` | 165 | 7.1 | 1,188 | 4 | optimize | Best-written of the group; does **not** link `/peptides/cagrisema`. One-line fix |
| 8 | `oxytocin-autism-cognition` | 104 | 8.2 | 605 | 3 | optimize | `relatedPeptides: oxytocin` fails validation — no such dossier. Link renders as nothing |
| 9 | `thymosin-alpha1-elderly-immune` | 88 | 7.1 | 745 | 3 | optimize | Position 7.1 and no click. Title/description rewrite |
| 10 | `what-is-mk-677` | 261 | 34.3 | **264** | 3 | refresh | 261 impressions against 264 words. Real demand, no substance behind it |
| 11 | `fda-compounding-oversight` | 90 | 8.2 | 917 | 2 | optimize | Regulatory evergreen; needs a citation and a date stamp |
| 12 | `tirzepatide-surmount-osa` | 63 | 6.3 | 618 | 3 | optimize | Best position in the corpus (6.3). 1 of 3 sources has no identifier |
| 13 | `pemvidutide-impact-mash-resolution` | 114 | 10.2 | 1,212 | 4 | optimize | Solid post; missing `/peptides/pemvidutide` link |
| 14 | `ll37-wound-healing` | 65 | 12.1 | 665 | 3 | optimize | `ll-37` dossier earns 23 impr; connect the pair |
| 15 | `what-is-wegovy` | 432 | 76.6 | **336** | 3 | refresh | 432 impressions at position 77 on 336 words. Highest-demand stub in the corpus |
| 16 | `survodutide-phase-2-mash-results` | 73 | 10.7 | 931 | 4 | optimize | Phase 2 post while phase 3 data now exists — check against the freshness scan |
| 17 | `zepbound-sleep-apnea-approval` | 481 | 73.1 | 1,050 | 3 | refresh | 481 impressions at position 73. Query set ("zepbound for sleep apnea", 173 impr) is answerable — it just is not ranking |
| 18 | `peptide-protacs-emerge-cancer-treatment` | 57 | 13.0 | 1,087 | 4 | optimize | `relatedPeptides: peptide-drug-conjugates` fails validation |
| 19 | `orforglipron-attain-1-results` | 51 | 11.6 | 1,142 | 4 | optimize | Missing `/peptides/orforglipron`; 2 of 4 sources carry no identifier |
| 20 | `generic-saxenda-fda-approval` | 97 | 24.7 | 996 | 4 | optimize | Commercial intent, page-3 — closest thing to a money query in the set |

**Pattern across all 20:** median 917 words, every one already ranking, every one at zero
clicks, and **all 20 have zero contextual inbound links.** The fix is the same fix twenty
times — deepen, retitle, and connect.

---

## 5. Verdict distribution

| Verdict | Count | Meaning |
|---|---:|---|
| `refresh` | 55 | Below the citation bar, aged, or ranking too low for its demand |
| `retire-301` | **35** | Under ~500 words, zero impressions in 177 days |
| `keep` | 28 | Bar met, no demand signal yet |
| `optimize` | 22 | Already ranking — the wave-2 target set |

The 35 retire candidates are almost entirely the `what-is-X` / `X-safety` stub family:
`what-is-retatrutide` (144w), `pt-141-safety` (149w), `what-is-pt-141` (156w),
`tesamorelin-safety` (163w), `what-are-glp1-agonists` (175w), `aod-9604-safety` (176w),
`what-is-semaglutide` (190w), `what-is-bpc-157` (196w) … through `humanin-neuroprotective-trial`
(490w). Each duplicates its dossier at a fraction of the depth, and each is a page Google has
crawled and declined to rank in six months.

**Retiring them is a redirect decision, not a content decision.** See §7.

---

## 6. Internal links and the app funnel

Full detail in `LINKGRAPH.md`. The three numbers that matter:

- **139 of 140 posts have zero contextual inbound links.** All are reachable — `/blog` lists
  every post with no pagination — but nothing links to a post *because of what it says*.
  `src/pages/blog/[slug].astro` has no related-posts widget and
  `src/layouts/DossierLayout.astro` contains no reference to the blog collection.
- **62 of 105 dossiers have zero blog coverage** — including `cerebrolysin`, the site's
  highest-impression URL at 5,228. Meanwhile `semaglutide` (61 posts) and `tirzepatide`
  (51 posts) absorb 112 posts' worth of links and earn 29 impressions between them.
  Editorial effort and search demand are close to anti-correlated.
- **Zero pages funnel to PepTracker.** Exhaustive grep found the app named only in
  `privacy.astro` and `terms.astro` — the two pages legally required to name it — plus one
  CSS comment. No App Store link, no Google Play link, no download CTA, no app-install event
  in the GA4 export. 31,700 impressions per 177 days convert to nothing.

---

## 7. Structural risks found — documented, NOT to be fixed in wave 2

These are real and some are high-value. **None belongs to a blog content pass.**

1. **The working branch is 25 ahead / 7 behind `origin/main`** and is missing commit
   `3050d3d` ("eliminate 398 broken internal links, make every page reachable"). Wave 2 will
   be editing content that production has already moved past. Whoever owns the branch should
   reconcile this **before** an editor touches 140 files. This is the single largest risk to
   the whole effort.

2. **Redirects for the 35 retire candidates are route surface.** A canonical/trailing-slash
   regression collapsed this site's indexing in spring 2026; `scripts/qa-seo.mjs` exists
   because of it. Retirement recommendations in the CSV are input to a human decision, not a
   licence to write redirect rules.

3. **Sitemap has 1,221 URLs and zero `<lastmod>`**, while 90 of 140 posts have no
   `lastUpdated` to derive one from. Recency is invisible to Google across most of the site.
   Fixing this is a sitemap/schema change.

4. **`src/pages/blog/index.astro` renders all 140 posts unpaginated.** Every post gets an
   equal, near-worthless share of one page's equity. Correct fix is a related-posts widget
   plus dossier→blog surfacing — both template changes.

5. **293 cross-link validator warnings** (100 on blog rows) are frontmatter slugs pointing at
   collection entries that do not exist. These render as nothing. Correcting the *slug values*
   is content work and is in scope; adding the *missing glossary/dossier entries* they point
   at (`amylin`, `angiogenesis`, `neuroprotection`, `gut-brain-axis`, `oxytocin`) is a
   content-creation decision for a separate pass.

6. **4 trailing-slash warnings** in `llms.txt.ts` (109 URLs), `llms-full.txt.ts` (4),
   `regulatory-tracker.astro` (1), `trials/index.astro` (1). Cosmetic, non-index-blocking,
   and adjacent to the exact regression class that broke this site. Belongs to an SEO
   workstream with its own verification, never to a content wave.

7. **Every body link in the blog uses a trailing slash, against the site's own config.**
   `astro.config.mjs:12` and `vercel.json:4` both set trailing slashes to *never*. All four
   body links in the corpus disagree:
   `semax-neuroprotection-stroke.mdx:52` → `/peptides/semax/`, `/safety/semax-safety/`;
   `dsip-sleep-quality-study.mdx:57` → `/safety/dsip-safety/`, `/guides/peptide-evidence-levels-explained/`.
   Each costs a redirect hop on the site's two highest-impression blog pages.
   **`scripts/qa-seo.mjs` does not catch these** — it only tests URLs written with the full
   canonical origin, so root-relative paths bypass the guard entirely. Normalising four
   links is trivially safe; **extending the guard to root-relative paths is a change to the
   gate that protects the canonical surface**, and belongs to the SEO workstream, not here.

8. **25 posts carry sources with no identifier at all** — no PMID, DOI, NCT, or URL. Every
   citation gate on the site passes them because there is nothing to resolve. This is the
   third integrity class described in `.claude/rules/lessons.md`: real-looking citations that
   assert nothing checkable. Worth a dedicated verification pass, not an editorial one.

---

## 8. Recommendation for wave 2

Do **not** publish. Do a depth-and-connection pass on the 22 `optimize` posts:

1. **Deepen the top 20** to 1,200–1,800 words against their actual GSC query sets — the
   queries are in `.claude/worktrees/cool-heisenberg-e12770/.planning/data/v2/gsc-*-query.json`
   and they show exactly what readers asked.
2. **Rewrite titles and descriptions** for CTR. Position 6–13 with zero clicks across 5,694
   impressions is a promise problem, not a ranking problem.
3. **Add body links** — 135 of 140 posts have none. Start with the 10 posts that name a
   dossier they do not link to, and the 12 that link to no dossier at all.
4. **Fix the 100 failing frontmatter slugs** so the links the layout tries to draw actually
   render.
5. **Lead with comparison content.** "survodutide vs cagrilintide" is the only non-brand
   query on this entire site that converts, and it does so at position 2–3.

Everything else — retirement redirects, the related-posts widget, dossier→blog surfacing,
the app CTA, sitemap `lastmod`, and the branch reconciliation — is structural. Each is worth
doing. None of them is a blog edit.
