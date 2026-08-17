# LINKGRAPH — PepCodex internal-link posture

*Built 2026-08-17 by traffic-auditor. All counts come from a structural walk of
`src/content/**` (12 collections) plus `src/**/*.astro|ts|tsx`, not from planning docs.
Scanner: scratchpad `scan.mjs`; raw output `_scan-raw.json`; per-post rows `_rows-final.json`.*

Parsing follows `scripts/validate-cross-links.mjs`: frontmatter relational fields
(`relatedPeptides`, `relatedGlossary`, `relatedTerms`, `peptideA/B`, `peptides`) are counted
as real links because the layouts render them as anchors. Body links are extracted separately
via `href="/…"` and `](/…)`.

---

## 1. The headline: the blog is a link sink with one inbound edge each

| Metric | Count | Method |
|---|---|---|
| Blog posts | 140 | `src/content/blog/*.mdx` |
| Posts with **zero** contextual inbound links | **139 / 140** | `_scan-raw.json` inbound map |
| The one exception | `/blog/glp1-safety-overview` | 1 inbound, from `src/content/blog/is-bpc-157-safe.mdx` |
| Posts with **zero body links** (all outbound is frontmatter-generated) | **135 / 140** | — |
| Posts that do have body links | 5 | `dsip-sleep-quality-study` (2), `is-bpc-157-safe` (2), `semaglutide-vs-tirzepatide-2026` (2), `semax-neuroprotection-stroke` (2), `what-is-tirzepatide` (4) |

### Why "orphan" needs a precise definition here

Every post **is** crawlable. `src/pages/blog/index.astro:7` calls `getCollection('blog')`
and renders **all 140** with no pagination, so each post has exactly one site-wide inbound
link — from a flat 140-item index. Four more get a homepage slot
(`src/pages/index.astro:12,42` — `.slice(0, 4)`), two get a featured slot
(`src/pages/blog/index.astro:91` — `featuredPosts.slice(0, 2)`).

So the accurate statement is: **no post is unreachable, and 139 of 140 are contextually
orphaned.** Nothing on the site links to a blog post *because of what it says*. PageRank
arriving at `/blog` is divided 140 ways and then flows straight back out.

### The structural cause — three missing edges, all verifiable

1. **`src/pages/blog/[slug].astro` has no related-posts widget.** Lines 42–43 pass only
   `relatedPeptides` and `relatedGlossary` to `BlogLayout`. There is no blog→blog surface
   anywhere in the codebase. That is why blog→blog links total **0** across 140 posts.
2. **`src/layouts/DossierLayout.astro` contains zero references to the blog collection**
   (grep for `blog` returns nothing). 105 dossiers link to 0 posts.
3. **Only 4 files in `src/` reference `getCollection('blog')`**: `pages/blog/index.astro`,
   `pages/blog/[slug].astro`, `pages/index.astro`, `pages/llms-full.txt.ts`. Category pages
   (`src/pages/category/[category].astro:19`) pull `peptides` only.

Link flow is therefore one-directional: blog → dossiers/glossary, never back, never sideways.
Outbound is healthy (median 5 links/post, range 1–9) and lands almost entirely on dossiers
and glossary terms. The corpus is donating equity to 105 dossiers and receiving none.

---

## 2. Dossiers with zero blog coverage — 62 of 105

Coverage = at least one blog post links to `/peptides/<slug>` from body or frontmatter.

**Zero-coverage dossiers that already earn impressions** (the highest-value gaps —
demand exists, no editorial support behind it):

| Impressions | Clicks | Dossier |
|---:|---:|---|
| 5,228 | 3 | **`cerebrolysin`** — the single highest-impression URL on the site |
| 384 | 1 | `igf-1-lr3` |
| 378 | 0 | `kisspeptin` |
| 154 | 1 | `ventfort` |
| 97 | 1 | `vk2735` |
| 73 | 0 | `chonluten` |
| 72 | 1 | `suprefort` |
| 69 | 0 | `cartalax` |
| 31 | 0 | `cortexin` |
| 15 | 0 | `glutathione` |
| 10 | 0 | `sulanemadlin` |
| 5 | 0 | `kpv` |
| 3 | 0 | `pasireotide` |
| 1 | 0 | `foxo4-dri` |

The other **48 zero-coverage dossiers** have no impressions at all:
`225ac-dota-lm3, 5-amino-1mq, alixorexton, amycretin, bronchogen, cerluten, chelohart,
ct-388, dulaglutide, ecnoglutide, endoluten, evx-01, exenatide, follistatin, ghk, hcg, hmg,
klotho, kristagen, livagen, mazdutide, melanotan-i, mk-0616, mrna-4157, na-selank-amidate,
na-semax-amidate, octreotide, ovagen, oveporexton, p21, pancragen, peg-mgf, pf-08653944,
pinealon, prostatilen, retinalamin, rusfertide, shlp-2, shlp-6, sigumir, slu-pp-332,
stamakort, svetinorm, testagen, vesugen, vilon, visoluten, vladonix`.

A further **11 dossiers sit on a single post**: `bt5528, cardiogen, dsip, ghrp-2, hexarelin,
maritide, mots-c, murepavadin, thymogen, thymulin, zelenectide-pevedotin`.

### The distribution is the problem, not the total

| Dossier | Blog posts linking in | Impressions |
|---|---:|---:|
| `semaglutide` | **61** | 29 |
| `tirzepatide` | **51** | 0 |
| `bpc-157` | 14 | 0 |
| `liraglutide` | 14 | 0 |
| `retatrutide` | 12 | 116 |
| … | | |
| `cerebrolysin` | **0** | **5,228** |
| `ghk-cu` | 5 | 1,346 |

Editorial attention and search demand are close to **anti-correlated**. The two dossiers
carrying 112 of 140 posts' links between them earn 29 impressions combined; the dossier
earning 5,228 impressions has none.

---

## 3. Blogs not linking to their obvious dossier

10 posts name a peptide in their slug or title that has a live dossier, and do not link to it.
Ranked by the post's own impressions:

| Impressions | Post | Missing link |
|---:|---|---|
| 165 | `cagrisema-nda-filed-glp1-amylin-combo` | `/peptides/cagrisema` |
| 114 | `pemvidutide-impact-mash-resolution` | `/peptides/pemvidutide` |
| 51 | `orforglipron-attain-1-results` | `/peptides/orforglipron` |
| 10 | `amycretin-phase2-results` | `/peptides/amycretin` |
| 0 | `cagrisema-nda-filed` | `/peptides/cagrisema` |
| 0 | `melanotan-safety` | `/peptides/melanotan-i` |
| 0 | `motsc-human-trials` | `/peptides/mots-c` |
| 0 | `pemvidutide-breakthrough-designation-mash` | `/peptides/pemvidutide` |
| 0 | `retatrutide-triumph-4-weight-loss-pain-relief` | `/peptides/retatrutide` |
| 0 | `what-is-melanotan` | `/peptides/melanotan-i` |

Separately, **12 posts link to no dossier at all** (`internalLinksOutDossiers = 0` in the CSV).

### Broken and dangling blog links

- `npm run validate-links` (`scripts/validate-cross-links.mjs`, confirmed read-only —
  no `writeFile`/`mkdir`/`unlink` calls): **0 errors, 293 warnings, 157 info**, 3,687 refs checked.
- **100 of the 293 warnings are blog rows** — `relatedPeptides`/`relatedGlossary` slugs with
  no target. These render as nothing, so each is a link the layout was asked to draw and
  silently dropped. Repeat offenders: `amylin`, `angiogenesis`, `neuroprotection`,
  `gut-brain-axis`, `immunomodulation`, `growth-factors` in glossary;
  `oxytocin`, `insulin`, `pramlintide`, `defensins`, `cgrp-antagonists` in peptides.
- **1 hard-broken body link**: `src/content/blog/dsip-sleep-quality-study.mdx` →
  `/guides/peptide-evidence-levels-explained`. The route is `/guide/` (singular,
  `src/pages/guide/[...slug].astro`); `/guides/` does not exist. This is the same
  plural-route class that commit `3050d3d` fixed 32 times on `origin/main`.

---

## 4. App cross-promotion: there is none

**Zero pages on this site funnel to PepTracker.** This is a complete, verified absence,
not a shortfall.

Exhaustive grep across `src/` and `public/` for
`apps.apple.com | play.google.com | itunes.apple.com | testflight | "app store" |
"google play" | "download the app" | "get the app" | PepTracker`:

| File | Lines | What it actually is |
|---|---|---|
| `src/pages/privacy.astro` | 26, 27, 80, 82, 85, 86, 96, 98, 105, 255, 264, 266, 268, 269 | Privacy policy prose describing local-first app data handling |
| `src/pages/privacy.astro` | 382 | "App Store or Google Play subscription" — billing legalese |
| `src/pages/terms.astro` | 24, 25, 53, 66–72, 77, 90, 121 | Terms of service sections covering the app |
| `src/pages/terms.astro` | 91, 95, 96 | Subscription cancellation legalese |
| `src/styles/global.css` | — | A comment string only |
| `src/content/blog/how-to-read-peptide-research.mdx` | 43 | **False positive** — the GRADE handbook URL `gdt.gradepro.org/app/handbook/` |

**Findings:**
- **0** App Store or Google Play install links anywhere on 1,212 pages.
- **0** download buttons, app CTAs, banners, or interstitials.
- **0** mentions of PepTracker in any of the 140 blog posts, 105 dossiers, 215 glossary
  terms, 279 comparisons, or any hub/index page.
- PepTracker appears **only** in the two legal pages that are contractually obliged to
  name it, plus a CSS comment.

The site currently earns ~31,700 impressions and 81 clicks per 177 days and converts
**none** of it toward the app. There is no measurement of this either — no UTM-tagged
outbound, no app-install event in the GA4 event export
(`.claude/worktrees/cool-heisenberg-e12770/.planning/data/ga4-events.json`).

---

## 5. What wave 2 may and may not touch

**Safe to add** (content-layer, reversible, no route surface change):
- body links inside `.mdx` bodies pointing at existing `/peptides/…`, `/glossary/…`,
  `/compare/…`, `/blog/…` targets;
- corrections to `relatedPeptides` / `relatedGlossary` slugs that currently fail the
  validator (the 100 blog warnings above);
- the single `/guides/` → `/guide/` typo in `dsip-sleep-quality-study.mdx`.

**Note on the 4 existing body links:** all four carry a trailing slash
(`/peptides/semax/`, `/safety/semax-safety/`, `/safety/dsip-safety/`,
`/guides/peptide-evidence-levels-explained/`) while `astro.config.mjs:12` and
`vercel.json:4` both set trailing slashes to *never*. New body links added in wave 2 must be
written **without** a trailing slash. `scripts/qa-seo.mjs` will not catch a mistake here —
it only inspects URLs written with the full canonical origin, so root-relative paths bypass
the guard.

**Out of bounds for blog optimization — document only, never execute here:**
- canonical host, `trailingSlash`, slug changes, redirects. `scripts/qa-seo.mjs`
  exists because a canonical/trailing-slash regression collapsed indexing in spring 2026.
  It currently passes with **0 errors / 4 warnings** (trailing-slash drift confined to
  `src/pages/llms.txt.ts` (109 URLs), `llms-full.txt.ts` (4), `regulatory-tracker.astro` (1),
  `trials/index.astro` (1)). Those 4 are cosmetic and belong to a separate SEO workstream.
- The 35 `retire-301` verdicts in `blog-checklist.csv` are **recommendations to a human**,
  not a licence to write redirects. Every one of them creates a redirect rule; that is
  route surface.
- Adding a related-posts widget, dossier→blog surfacing, or an app CTA component are all
  **template changes**, not content edits. They are the highest-leverage fixes in this
  document and they belong to whoever owns `src/layouts/` and `src/pages/`.
