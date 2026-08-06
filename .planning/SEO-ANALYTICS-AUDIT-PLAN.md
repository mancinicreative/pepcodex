# SEO + Analytics Diagnostic Audit — Plan

*Drafted: 2026-07-24 · Status: PLAN (not yet executed) · Owner: Lucas*
*Not yet slotted into ROADMAP.md — assign a phase number when greenlit.*

**Goal:** Determine why pepcodex.com is / isn't performing — which pages earn
impressions and clicks, which are indexed but dead, which aren't indexed at all,
and where the funnel leaks — then produce a ranked, evidence-backed fix list.

---

## 0. Tooling reality (verified 2026-07-24, before planning)

This corrects the original premise. **Codex cannot do this job.**

| Capability | Status | Notes |
|---|---|---|
| Codex companion | Bash/code only | **No browser, no vision, no computer use.** Cannot read GSC/GA UIs. |
| `computer-use` MCP | **Disconnected** | Native desktop control unavailable this session. |
| Claude-in-Chrome | **No browser connected** (`list_connected_browsers` → `[]`) | This is the *right* tool (your logged-in Google sessions) but the extension isn't attached. |
| In-app Browser | Available | No Google session → **cannot** reach private GSC/GA data. |
| Ahrefs MCP | Connected but **"Insufficient plan"** | Every `gsc-*`, `site-audit-*`, `site-explorer-*` endpoint refused. Only the free public DR endpoint works. |

**Consequence:** no path to GSC or GA4 data is currently live. Phase 0 must
resolve access before Phases 2–3 can run. Phases 1 and 4 need no access and can
start immediately.

**Correct division of labour:** Fable orchestrates and interprets; **Codex's real
value here is bulk crawl + log/CSV crunching over 1,221 URLs** — shell work, which
it genuinely does well. Not the GSC/GA reading.

---

## 1. Findings already confirmed (no login required)

These came from public endpoints and the repo. They are facts, not hypotheses.

1. **Apex → www is a `307 Temporary Redirect`.**
   `https://pepcodex.com/` → `307` → `https://www.pepcodex.com/`.
   A temporary redirect is the wrong signal for a permanent domain move; it
   weakens consolidation of authority and canonicalization onto one host.
   **Should be `301`/`308`.** Strong candidate for the split you're seeing.

2. **This almost certainly explains your "two Search Console properties."**
   Apex and `www` are distinct GSC properties. With a 307 between them, clicks
   and impressions can register split across both, so each property shows a
   partial picture and neither tells the truth.

3. **GA4 *is* correctly installed in production** — `G-1M56CNL8CK` loads via
   `googletagmanager.com/gtag/js`. Vercel Analytics (`/_vercel/insights`) is also
   live. My initial hypothesis (missing `PUBLIC_GA_TRACKING_ID` in Vercel,
   silently no-oping every event in `src/scripts/analytics.ts`) was **wrong** —
   ruled out by inspecting production HTML directly.

4. **Sitemap coverage is good, but has no `<lastmod>` — zero of 1,221 URLs.**
   `robots.txt` is clean and points to `sitemap-index.xml` → `sitemap-0.xml`,
   1,221 URLs vs 1,222 built pages. But with no `lastmod`, Google has no recrawl
   priority signal — updated dossiers may sit stale in the index.

5. **Content distribution** (sitemap): 393 `/peptides/`, 280 `/compare/`,
   216 `/glossary/`, 156 `/blog/`, 61 `/clinics/`, 37 `/guide/`, 32 `/safety/`,
   16 `/conditions/`, plus ~30 utility pages.

6. **Domain Rating = 3.3** (Ahrefs, free endpoint). Very low authority. On a
   YMYL health topic competing against established medical publishers, this alone
   caps ranking regardless of content quality. Shapes what "working" can mean.

7. **Local build carries 314 cross-link warnings + 4 trailing-slash drift
   warnings** — internal linking is thin/broken in places, which matters for both
   crawl discovery and topical authority.

7b. **There has already been an indexing collapse.** `scripts/qa-seo.mjs` opens:
   *"Catches the regression class that collapsed indexing in spring 2026 —
   canonical host drift (non-www URLs once the site serves on www), trailingSlash
   config disagreement between Astro and Vercel, trailing-slash URL drift."*
   So the guard exists **because this already happened once.** That reframes the
   whole audit: the priority question is not just "why is growth slow" but
   **"has the site fully recovered from the spring-2026 collapse, and is the
   lingering 307 still suppressing it?"** GSC's 16-month window will show the
   collapse and the recovery curve directly.

8. **The rebrand IS live on production — `STATE.md` is stale.** `STATE.md` still
   says the Phase 36 PR is "awaiting merge", but prod serves the rebrand:
   Newsreader + Geist font preloads, and "specimen"/"Vol."/"vial"/"cobalt"
   markers throughout the HTML. So GA behavioural data *does* describe the
   current design. **Still needed: the merge date**, to segment GA pre/post and
   detect whether the redesign moved engagement or rankings.
   *(Another instance of the known trap — a git-falsifiable claim stored as a
   durable doc snapshot. `STATE.md` needs a correction pass.)*

---

## Phase 0 — Proper API access — **DECIDED: service-account API** *(harness built; grants pending)*

Lucas chose real API access over CSV exports or browser driving, so the pull is
repeatable and I can just read everything on demand.

**Built and verified (2026-07-24):**

- `scripts/fetch-search-data.mjs` — GSC + GA4 Data API client. Handles the 25k-row
  GSC pagination cap (full data, not a truncated top-N), loads `.env` without a
  dotenv dependency, and fails with a specific remedy instead of a stack trace.
  All error paths exercised.
- npm scripts: `gsc:sites`, `fetch:search`, `fetch:gsc`, `fetch:ga4`.
- devDeps: `googleapis`, `@google-analytics/data`. *(The 17 critical/high npm-audit
  findings are all pre-existing Astro/Vercel transitives — not from these.)*
- `.gitignore` hardened against service-account keys + `.planning/data/`.
- `.env.example` documents the three new vars.
- `npm run check` green after all changes (`REAL_CHECK_EXIT=0`).

**Pending — Lucas only** (account creation + private key handling are not mine to do):
follow `.planning/GOOGLE-API-SETUP.md`. ~15 min.

`npm run gsc:sites` will **definitively answer what the two GSC properties are**
rather than us guessing — it enumerates everything the service account can see.

---

## Phase 1 — Indexed-vs-existing baseline *(no access needed — can start now)*

- Crawl all 1,221 sitemap URLs: status code, canonical, `robots` meta, title,
  meta description, word count, internal inlink count.
- Flag: non-200s, canonical mismatches, `noindex` leaks, duplicate/missing
  titles + descriptions, thin pages, **orphan pages** (in sitemap, zero internal
  links).
- Verify trailing-slash consistency end-to-end (build already warns on 4).
- **Output:** `.planning/data/crawl-baseline.csv` + summary.
- **Engine:** Codex (bulk shell crawl) — this is its actual strength.

## Phase 2 — GSC diagnosis, both properties *(needs Phase 0)*

- Pull 16 months, **both properties**, and quantify the apex/www split directly.
- Segment by page type (`/peptides/`, `/compare/`, `/blog/`, `/glossary/`).
- Identify: high-impression/low-CTR (title+meta problem), striking-distance
  positions 8–20 (fastest wins), impressions trending to zero (decay), and
  indexed-but-zero-impression pages (no demand or no authority).
- Read Index Coverage: Discovered–not-indexed, Crawled–not-indexed, Duplicate
  w/o user-selected canonical. **On a 1,221-page site with DR 3.3, crawl-budget
  starvation is the hypothesis to test first.**
- **Engine:** Fable (interpretation).

## Phase 3 — GA4 behaviour diagnosis *(needs Phase 0)*

- Landing-page performance: entrances, engagement rate, avg. duration, exits.
- Which page types retain vs bounce; where the `/compare/` and `/peptides/`
  hubs leak.
- Do the custom events in `src/scripts/analytics.ts` (search, comparison_click,
  newsletter_signup, scroll_depth, external_link_click) actually register in GA4?
  **Verify they fire — code existing ≠ events landing.**
- Newsletter conversion by source/page.
- **Segment on the rebrand merge date** (Finding 8): the redesign is live, so
  compare engagement and rankings before vs after it shipped. This is the single
  most valuable cut in GA — it tells you whether Phase 36 helped or hurt.

## Phase 4 — Technical + content-quality crawl *(no access needed)*

- Structured data validity (`OrganizationSchema` + per-type schema).
- Core Web Vitals on representative page types.
- Resolve the 314 cross-link warnings — these are topical-authority leaks.
- Internal link graph: find hub pages with no inbound paths.
- **Engine:** Codex (bulk), Fable (prioritisation).

## Phase 5 — Synthesis

Ranked fix list, each item carrying: the evidence, expected impact, effort, and
a verification check. Delivered as `.planning/SEO-AUDIT-FINDINGS.md`.

---

## Quick wins already identifiable (pending confirmation)

1. Change apex→www `307` to `301`/`308`. *(Config-level, cheap, real.)*
2. Add `<lastmod>` to the sitemap. *(Astro sitemap integration config.)*
3. Fix the 4 trailing-slash drift warnings.
4. Work down the 314 missing cross-links.

**None of these are costly to undo — but all are outward-facing, so they land
only on your go-ahead.**
