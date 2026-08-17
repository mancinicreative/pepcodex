# PepCodex SEO Improvement Plan

*2026-07-24 · Evidence base: 16mo GSC (both properties), GA4 521749549, 1,221-URL crawl*
*Companions: `SEO-AUDIT-FINDINGS.md` (what's broken), `SEO-GROWTH-STRATEGY.md` (why)*

---

# Part 0 — The question you asked: is the blog worth it?

## What the data says

| Section | Pages | Impressions | Clicks | CTR | Med pos | Impr/page | GA4 med duration |
|---|---|---|---|---|---|---|---|
| /(home) | 1 | 1,175 | 50 | **4.26%** | 9 | 1,175 | 114s |
| **/compare/** | 280 | 2,854 | **39** | **1.37%** | 8 | 10 | 6s* |
| **/calculator/** | 3 | 768 | 9 | **1.17%** | 8 | **256** | — |
| /guide/ | 37 | 1,201 | 6 | 0.50% | 45 | 32 | 24s |
| /peptides/ | 393 | 12,977 | 10 | 0.08% | 9 | 33 | 44s |
| /glossary/ | 216 | 10,786 | 5 | 0.05% | 46 | 50 | 0s* |
| **/blog/** | 156 | 6,385 | **0** | **0.00%** | 11 | 41 | 1s* |
| /safety/ | 32 | 1,830 | 0 | 0.00% | 7 | 57 | 5s* |

\* GA4 duration heavily contaminated by bot traffic — see Chunk 1.

Also notable, from GA4 engagement (real signal):
- `/trials/` — **340s** median session
- `/regulatory-tracker/` — **279s**, 55% bounce

## The verdict: keep the blog, but change what it is

**Not "delete it."** Three reasons the data argues against abandonment:

1. **Median position 11** — the blog ranks at the top of page 2. That is *close*. `/glossary/`
   sits at 46 by comparison. The blog is the second-best-ranked section on the site.
2. **It holds your longest content** (median 1,096 words vs 399 for dossiers) — the raw material
   is substantial.
3. **41 impressions/page** beats `/compare/`'s 10. Google *is* surfacing it.

**But its current form does not work.** Looking at titles — `oral-tirzepatide-phase1`,
`china-tirzepatide-biosimilar`, `fda-peptide-stability-guidance`, `2025-peptide-approvals-record` —
this is **news commentary**, and news commentary is the single worst category for a DR 3.3 site:

- It competes directly with Reuters, STAT News, Endpoints, and Fierce Biotech (DR 80–90).
- It decays: a "Phase 1 result" post is worthless in 12 months, but keeps consuming crawl budget.
- It is exactly what Google News carousels and AI Overviews absorb.
- It answers "what happened", which needs no click once the headline is read.

**Reposition the blog from news → evergreen decision-support.** That is the same shift the data
already validates for `/compare/` and `/calculator/`.

## The pattern across every section

| Works | Doesn't work |
|---|---|
| Comparisons (1.37% CTR) | News posts (0.00%) |
| Calculators (1.17%, 256 impr/page) | Generic glossary (0.05%, pos 46) |
| Trackers (`/trials/` 340s, `/regulatory-tracker/` 279s) | Safety pages (0.00%) |
| Homepage (4.26%) | — |

**Tools, comparisons and trackers earn clicks and hold attention. Reference articles and news do
not.** This is the organising principle of the whole plan: content that helps someone *decide*
survives AI Overviews; content that merely *informs* gets answered on the results page.

---

# Part 1 — Realistic CTR maths

Being honest about ceilings, because I overstated this once already.

**Current:** 38,772 impressions → 121 clicks = **0.31%**

**Scenario A — every section performs like `/compare/` (1.37%):**
38,772 × 1.37% ≈ **531 clicks** (4.4x). Requires content repositioning, not tweaks.

**Scenario B — technical hygiene only (titles, redirect, sitemap):**
Realistically lifts CTR on the ~1,635 impressions where you rank top-10. Even doubling that
band's CTR adds perhaps **20–40 clicks**. Worth an afternoon; not a growth strategy.

**Scenario C — repositioning + authority (12 months):**
Growth comes from *new impressions on queries with volume*, which needs DR above ~3.3. Not
forecastable from current data; treat as the long game.

**Read this honestly:** Part 3 (hygiene) is cheap and worth doing but will not change the
business. Part 4 (content strategy) is where traffic actually comes from.

---

# Part 2 — Execution chunks

Sized for a single session each, ordered by dependency. Each is self-contained.

## CHUNK 1 — Make the data trustworthy *(do first; everything else is measured against it)*

**Problem:** 91.5% of GA4 sessions are Direct with 92% bounce; April alone was 2,081 sessions at
a **1-second** average. Every dashboard number is currently unusable. Separately, all five custom
events in `src/scripts/analytics.ts` are absent from GA4.

**Tasks**
1. Enable GA4 bot filtering (Admin → Data Streams → configure tag → exclude known bots) and
   create a segment/exploration excluding Direct-with-<5s sessions for historical comparison.
2. Debug why `search`, `comparison_click`, `newsletter_signup`, `scroll_depth`,
   `external_link_click` never fire. Base gtag loads (verified in prod HTML), so suspect
   selector mismatch after the Phase 36 rebrand, or script execution order.
3. Add a filtered baseline snapshot to `.planning/data/` so future comparisons have a clean start.

**Research needed:** read `src/scripts/analytics.ts` against the current DOM of a live page;
confirm which selectors no longer match post-rebrand. Check Vercel logs for the Direct traffic's
user-agent pattern to confirm bot origin and whether it warrants WAF blocking.

**CTR impact:** none directly. **Enables measuring everything else.**
**Verification:** the five custom events appear in GA4 Realtime after a manual test session.

## CHUNK 2 — Technical hygiene *(cheap, contained, outward-facing)*

**Tasks**
1. **apex → www: 307 → 301.** Vercel config. Consolidates authority onto one host.
2. **Conditional title suffix** in `BaseLayout.astro:48` — append `" | PepCodex"` only when the
   result is ≤60 chars. Recovers **521 of 570** truncated titles in one line.
3. **Sitemap `<lastmod>`** — currently absent on all 1,221 URLs, so Google has no recrawl
   priority signal. Astro sitemap integration config.
4. **Merge duplicate:** `/glossary/off-label` and `/glossary/off-label-use` share an identical
   title and compete. 301 one to the other.

**Research needed:** confirm Vercel's redirect config location and that `permanent: true` emits
308 (acceptable) vs 301. Verify Astro's `@astrojs/sitemap` `lastmod` option against the content
collections' `lastUpdated` frontmatter.

**CTR impact:** modest and bounded — Scenario B above, ~20–40 clicks. The title fix is the
largest single component; un-truncated titles measurably lift CTR at fixed position.
**Verification:** re-run `scripts/crawl-site.mjs`; expect `>60ch` to drop 570 → 49. Re-run
`gsc-pull.mjs` after 4 weeks and compare CTR on affected pages against the unaffected control set.

## CHUNK 3 — The 49 remaining long titles + snippet quality

**Tasks**
1. Hand-rewrite the 49 titles still >60 chars after Chunk 2 (38 are `/peptides/`), prioritising
   pages with the most impressions.
2. Audit meta descriptions on the top-50 pages by impressions — currently 100% present but
   quality unaudited.

**Research needed:** for each target page, pull its actual query set from GSC
(`dimensions:['page','query']`) and write the title to match dominant query intent rather than
guessing. This is the difference between a cosmetic rewrite and a targeted one.

**CTR impact:** concentrated on high-impression pages, so higher per-page yield than Chunk 2.
**Verification:** per-page CTR delta 4 weeks post-change vs. the 4 weeks prior.

## CHUNK 4 — Glossary decision *(216 pages; needs your call)*

**Problem:** 216 pages, median position **46**, 0.05% CTR, 10,786 impressions, 5 clicks. GA4 shows
`/glossary/dalton` at 100% bounce / 0s — bot-dominated. They compete with Wikipedia and NIH for
terms like "autophagy", "gene expression", "oxidative stress" and cannot win.

**Options**
- **A (recommended): `noindex` the generic terms**, keep them published for readers and internal
  linking. Removes crawl waste and topical dilution; loses nothing that earns clicks.
- **B: Rewrite toward peptide-specific intent** — "half-life in peptide dosing" not "half-life".
  More work, retains some search upside.
- **C: Delete.** Not recommended — they serve real readers via internal links.

**Research needed:** classify all 216 by whether the term is peptide-specific (keep+index) or
general science (noindex). Cross-reference each against its GSC impressions and position to
confirm none is a hidden performer before deindexing.

**CTR impact:** *raises site-wide CTR by removing the denominator* — 10,786 impressions producing
5 clicks currently drags the average down. Also concentrates crawl budget on pages that convert.
**Verification:** site-wide CTR recomputed excluding glossary; confirm no ranking loss on retained
pages after 6 weeks.

## CHUNK 5 — Blog repositioning *(the strategic one)*

**Tasks**
1. **Audit all 156 posts** into three buckets: evergreen-and-valuable / news-that-decayed /
   consolidatable-into-a-better-page.
2. **Stop publishing pure news.** Redirect that effort into comparison and decision content.
3. **Consolidate decayed news** into evergreen hubs (e.g. twelve separate tirzepatide news posts →
   one maintained "Tirzepatide: trial timeline and regulatory status" page).
4. **Rewrite the survivors** toward decision intent.

**Research needed:**
- Per-post GSC query sets to identify which posts already attract decision-shaped queries.
- Identify which posts have any backlinks before redirecting (don't discard earned authority).
- Competitive check: for each proposed evergreen hub, who currently ranks top-5 and at what DR —
  target only where DR ≤ ~30 appears in the top 5, or the page cannot win.

**CTR impact:** highest of any chunk. Moving 6,385 impressions from 0.00% to even `/compare/`'s
1.37% is **~87 clicks** — more than half your current total, from one section.
**Verification:** blog-section CTR tracked monthly; target >0.5% within two quarters.

## CHUNK 6 — Double down on what works

**Tasks**
1. **Comparison expansion.** `/compare/` is your best converter (1.37%, best page hit 10% CTR at
   position 2.8). Build pairs with genuine search volume — the GLP-1 cluster especially
   (semaglutide / tirzepatide / retatrutide / survodutide / cagrilintide / orforglipron).
2. **Calculator expansion.** Highest impressions-per-page on the site (**256**) from only 3 pages.
   Tools also earn backlinks, which feeds Chunk 7.
3. **Promote the trackers.** `/trials/` (340s) and `/regulatory-tracker/` (279s) have outstanding
   engagement but almost no traffic — they are underexposed assets.

**Research needed:**
- Keyword research on "X vs Y" patterns across your peptide set; estimate volume and competition.
  Ahrefs is plan-blocked, so use GSC's own query data + Google autocomplete + People Also Ask.
- For each candidate comparison, check whether an existing `/compare/` page already covers it
  (280 exist — avoid cannibalisation).
- Identify which calculators researchers actually want (survey the query data for "calculate",
  "dosage", "reconstitution", "conversion").

**CTR impact:** builds on the site's proven-highest-CTR formats. New pages start from zero, so
this compounds over months rather than showing up next week.
**Verification:** new pages tracked as a cohort; compare their 90-day CTR against the site median.

## CHUNK 7 — Authority *(the real ceiling; continuous)*

**Problem:** DR 3.3. Nothing above lifts rankings for queries with volume without this.

**Tasks**
1. Package the trackers as linkable/citable assets.
2. Publish original analysis worth citing — you already hold 100+ scored dossiers with a
   two-axis rubric; that is a dataset nobody else has.
3. Outreach: peptide/longevity newsletters, researchers, communities.
4. Expert commentary on GLP-1 news (as *outreach*, not as blog posts — see Chunk 5).

**Research needed:** backlink gap analysis vs competitors; identify who links to comparable
resources and why. Requires a backlink tool — Ahrefs API is plan-blocked, so either upgrade or
use free tiers (Moz, Ubersuggest, Google's own link report in GSC).

**CTR impact:** indirect but the largest. Authority moves position; position moves CTR far more
than titles do. Moving a query from position 46 to position 8 changes CTR by ~10x.
**Verification:** DR tracked monthly; referring domains count; average position site-wide.

---

# Part 3 — Measurement

All pulls are automated and repeatable, no re-auth needed:

```bash
node scripts/gsc-pull.mjs --months=16    # both properties
node scripts/ga4-pull.mjs --months=16    # behavioural
node scripts/crawl-site.mjs              # technical baseline
node scripts/gsc-analyze.mjs             # diagnostic summary
```

**Cadence:** snapshot before each chunk lands; re-pull 4 weeks after. Keep a dated copy in
`.planning/data/` so changes are attributable rather than guessed at.

**Primary KPI:** organic sessions/month (currently ~47) — the only number bots can't distort once
Chunk 1 lands.
**Secondary:** site-wide CTR (0.31%), section CTR, average position, DR.

**Control-group discipline:** Chunks 2 and 3 touch subsets. Always compare changed pages against
an unchanged cohort over the same window, so a Google algorithm shift isn't mistaken for a win.

---

# Part 4 — Suggested order

| Order | Chunk | Effort | Expected impact |
|---|---|---|---|
| 1 | Chunk 1 — trustworthy data | Half day | Enables everything |
| 2 | Chunk 2 — technical hygiene | 1–2 hours | +20–40 clicks |
| 3 | Chunk 4 — glossary decision | Half day | Removes drag; needs your call |
| 4 | Chunk 5 — blog repositioning | Multi-session | **Highest near-term** |
| 5 | Chunk 3 — 49 titles | 2–3 hours | Concentrated CTR gain |
| 6 | Chunk 6 — comparisons/tools | Ongoing | Compounding |
| 7 | Chunk 7 — authority | Continuous | Largest, slowest |

**Open decisions needing your input:** the glossary option (A/B/C in Chunk 4), and whether to
stop publishing news-style blog posts entirely or taper.
