# PepCodex Project Guidelines

## Current Status (2026-04-13)
- **Phase:** v6.0 Phase 35 — Content Refresh & New Dossiers
- **Active:** 6 new dossiers, 15 dossier updates, 10 blog posts, regulatory reclassification
- **See:** `.planning/STATE.md`, `.planning/phases/35-content-refresh/`

## Content Rules (HARD)

- **Evidence-based sourcing is non-negotiable.** When writing any content, invoke the `sourcing-rules` skill for citation format, approved source tiers, and quality thresholds. Never fabricate sources, PMIDs, DOIs, or publication dates.
- **Banned content:** dosing protocols, sourcing/purchasing guidance, medical advice, unverified health claims.
- **Required on every dossier/blog:** evidence grading (`high`/`moderate`/`low`/`very-low`), disclaimers, citations for all factual claims.

## Crawl budget is the binding constraint (HARD — read before adding pages)

Measured 2026-08: **923 of 1,221 pages had never received a single impression.** Google's URL
Inspection API says 60% are "Discovered – currently not indexed" (Google chose not to fetch)
and 40 of 45 sampled were *never crawled*. At Domain Rating 3.3 on a domain under 6 months
old, crawl allocation — not content quality — decides what ranks.

- **Adding pages makes this worse.** Never "publish more" as a growth answer without removing
  or consolidating pages. Net URL count is the number that matters.
- **Every new page needs a real inbound link path** from a page ≤2 clicks from `/`. Sitemap
  presence alone produces "Discovered – not indexed". Silence rises hard with click-depth:
  depth 0 → 0% silent, depth 2 → 74%, depth 5+ → 100%.
- **`noindex` does NOT save crawl budget** — Google must fetch the page to read the tag. To
  reduce crawl demand you must also drop the URL from the sitemap (see `SITEMAP_EXCLUDE` and
  the `/clinics/` rule in `astro.config.mjs`).
- **Use `noindex, follow`, never `nofollow`** — de-indexed pages must keep passing crawl paths.
- Deindexed today: 35 generic glossary terms (`noindex: true` frontmatter) + all `/clinics/`.
  Anything ranking top-10 is protected regardless of volume.

### The graph loop (use it — do not eyeball linking)

```bash
npm run build && npm run graph:compare   # did the change help?
npm run graph:check                      # exits 1 on broken links / orphans / depth>3
```

**Run `npm run graph:check` before any commit that touches links or templates.** It is the
regression gate for 398 broken internal links, 158 unreachable pages, and 96 over-deep pages
that were fixed in Aug 2026 — every one of which shipped by looking correct in review.

**Internal links must mirror `getStaticPaths` exactly.** Three separate live defects came from
not doing this: `protocol.data.slug` (a field the schema never defined → `/protocols/undefined`,
a live 404), `city.id` and `p.id` (both retain the `.mdx` extension → the raw-source URLs Google
indexed). Never hand-derive a URL from a display name or a raw file id.

**Never render a link to a free-text slug without checking it resolves.** `relatedPeptides`,
`relatedGlossary`, and interaction targets have no referential integrity; linking them blind
produced ~330 live 404s. Guard with a `Set` of real collection slugs and render misses as text.

**Internal links must not carry a trailing slash** — `trailingSlash: 'never'` means each one
costs a 308 redirect hop.

`scripts/crawl-graph.mjs` builds the link graph from `dist/`, computes click-depth by BFS from
`/`, joins real GSC impressions, and snapshots each run so successive runs prove whether a
change helped. Goal + evaluator + ratchet log: `.planning/CRAWL-GOAL.md`.

**Trust the graph, not the diff.** A rendered link section that points at URLs which 404 looks
correct in review and still leaves pages unreachable — that has already happened twice here
(`currentSlug` derived from display name; `protocol.data.slug` undefined).

## Project-Specific Conventions

- Astro + MDX static site. Content in `src/content/peptides/`, `src/content/blog/`, `src/content/comparisons/`.
- Schemas: `src/content/config.ts` (Zod) + `data/schemas/source-pack.schema.json`.
- QA scripts in `scripts/` (qa-citations, qa-banned-content, validate-cross-links).
- Build: `npm run build` (output: static). Dev: `npm run dev`.
- **Never trust a wrapper's exit code.** Capture the real one inside the log:
  `{ npm run build; echo "REAL_BUILD_EXIT=$?"; } > log 2>&1` then grep the log. This repo has
  shipped broken builds reported as green.
- **Content files are CRLF.** Frontmatter regexes must match `\r?\n` — a `\n`-only replace
  silently no-ops *and reports success*.
- **`slug` ≠ `name`.** Derive URLs from the collection slug (`entry.slug` / `entry.id`), never
  from `data.name` — 5 dossiers diverge (hcg, melanotan-i, mrna-4157, na-selank-amidate,
  na-semax-amidate).

## Search/analytics data (live, repeatable)

Auth is keyless: user ADC → IAM `generateAccessToken` impersonating
`pepcodex-reader@wired-dahlia-496320-e6.iam.gserviceaccount.com` (org policy blocks SA keys;
gcloud's shared OAuth client refuses non-Cloud scopes). Setup: `.planning/GOOGLE-API-SETUP.md`.

```bash
npm run gsc:whoami   # which Google account am I?
npm run gsc:repull   # GSC, both properties, REAL date ranges + device/country
npm run ga4:pull     # GA4 behavioural
npm run gsc:index    # URL Inspection — why pages aren't indexed
```

- **GSC query data is censored** — the query dimension holds ~33% of impressions and ~15% of
  clicks. Never conclude "no demand" from absence there.
- **GA4 topline is ~91% bots** (Singapore 5,410 sessions at 97% bounce, plus ~667 from the
  owner's localhost dev server). Trust GSC clicks and per-channel GA4 cuts.
- **Mobile is 67% of clicks** at 8x desktop CTR. Desktop impressions are bot-inflated.
- Findings: `.planning/SEO-AUDIT-FINDINGS.md`, corrections in `SEO-AUDIT-CORRECTIONS.md`,
  indexation in `INDEXATION-DIAGNOSIS.md`.

## File Locations

- Research sources: `data/RESEARCH-SOURCES.md`
- State tracking: `.planning/STATE.md`
- Active roadmap: `.planning/ROADMAP.md`
- Archived docs: `.planning/_archive/`, `.claude/_archive/`
- Lessons: `.claude/rules/lessons.md` (update after any correction)

---

*Operating modes, workflow, verification rules — inherited from global `~/.claude/CLAUDE.md` and `.claude/rules/`. Don't duplicate here.*
