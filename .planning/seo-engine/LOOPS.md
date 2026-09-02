# Graph loops — PepCodex SEO Engine

Each loop is a closed graph: **Strategist → Implementer → Quality Judge → (pass | rewrite)**.
The Conductor frames the loop *before* work. The Judge is not the author. Max **3** implementer iterations per loop; twice stuck → change approach; third fail → `FAILURE.md` and escalate.

Shared standing rules (all loops): `.planning/seo-engine/ORCHESTRATOR.md` §1. Evaluator-optimizer pattern: `00_Claude/ops/task-loop.md`. Crawl ratchet already live: `.planning/CRAWL-GOAL.md`.

Ratchet log path for every keep/revert:

`.planning/seo-engine/runs/<YYYY-MM-DD>/ratchet/<LOOP-ID>.md`

Row format:

```
| n | hypothesis | change (files) | evaluator output | keep/revert | notes |
```

---

## L0 — Measurement (GSC + GA4)

**Objective.** Make every later decision against numbers that are (a) fresh, (b) honestly windowed, (c) split so bots cannot masquerade as users.

**Success check (mechanical).**

- `.planning/data/v2/manifest.json` exists and records the **returned** first/last date per GSC property, not the requested window.
- Both properties pulled: `https://pepcodex.com/` and `https://www.pepcodex.com/`.
- Cuts present: page, query, date, device, country, page+query, searchAppearance.
- GA4 cuts present: country, city, sessionSource / sessionDefaultChannelGroup, hostname, landingPage, deviceCategory, eventName, new vs returning. If `ga4-pull.mjs` lacks a cut, the Measurement Steward **adds the report and re-pulls** — missing country is a failed loop, not a footnote.
- `MEASUREMENT.md` states the censorship warning: query dimension historically ~33% of impressions / ~15% of clicks. KPIs use **page** + **device** + **country**, never query-only.
- Bot-contaminated totals are labeled `UNTRUSTED`. Trusted KPIs: GSC clicks (esp. mobile US/GB), GSC impressions on www, GA4 sessions **after** Singapore/China/localhost exclusion.

**Strategist.** Plan the pull. List which scripts to run. Identify gaps vs `SEO-AUDIT-CORRECTIONS.md` (device, country, searchAppearance, page+query were missed on pass 1).

**Implementer.** Auth (owner), `gsc:repull`, `ga4:pull`, patch scripts, write `MEASUREMENT.md`.

**Judge.** Fail if: assumed 16 months; mixed apex+www without saying so; used query export as complete demand; no country cut; no real-range detection; cited a number not in the files. **Dispatch as Kimi K3** (AGENTS.md J).

**Protected.** Content, citations, production config.
**Mutable.** `scripts/ga4-pull.mjs`, `scripts/gsc-repull.mjs`, `.planning/data/**`, run artifacts.

**Gaming check.** Pulling more dimensions is not the goal. The goal is decisions that survive the next adversarial review.

**Blocked on Lucas.** OAuth. Do not fake data.

---

## L1 — Bot suppression (Singapore-class scraper)

**Objective.** Stop the Singapore scraper from drowning GA4 **without** harming Googlebot, Bingbot, ChatGPT/Perplexity referrals, or real US/GB mobile users. Secondary: exclude Lucas's localhost from GA4.

**Known fingerprint (2026-07, re-verify live):**

- GA4: Singapore 5,410 sessions (62%), 97% bounce; China 763 / 96%; Germany 353 / 95%; US 803.
- GSC: **zero Singapore**. USA 15,207 impressions, GBR 5,668. Geo mismatch = scraper, not "Singapore readers."
- Localhost referrers ~667 sessions (`localhost:4321`, `:4322`).
- Android Webview 153 sessions, 99% bounce, 1.3s.
- Direct 91% of sessions is **not** a WAF target — ChatGPT arrives messy and is the best non-Google traffic (264 sessions, 40% bounce, 327s).

**Success check.**

1. `BOT-DIAGNOSIS.md` names: top countries, bounce, duration, hostname, source, sample user-agent **if** Vercel logs available, likely ASN class (cloud vs residential). Consent-denied users can look like bounce — **GSC country vs GA4 country** is the discriminator; keep it.
2. **Analytics layer (do this; reversible):**
   - GA4 data filter / comparison excluding country in {Singapore, and others that fail the GSC-overlap test} AND hostname/referrer localhost.
   - Internal-traffic filter for `localhost`.
   - Code: do not fire gtag on `hostname === 'localhost'`.
   - A "real users" note in `MEASUREMENT.md` with before/after session counts.
3. **Edge layer (propose-first; Lucas clicks):**
   - Draft Vercel Firewall rule: challenge or block the scraper fingerprint (country + datacenter ASN **or** known UA), **never** User-Agent Googlebot/Google-InspectionTool/Bingbot/ChatGPT-User/PerplexityBot.
   - `robots.txt` is **not** a success criterion. Scrapers ignore it. Optional crawl-delay is hygiene only.
4. **Harm gate (must pass after any block):** GSC mobile clicks US+GB over the next measurable window do not drop for a reason attributable to the rule. ChatGPT referral sessions must remain in GA4. If a proposed WAF would challenge all "Direct," **reject the proposal**.

**Strategist.** Filter vs block vs challenge. Prefer filter-first (data usable this week) + targeted WAF (stops bandwidth). Never "block Direct." Never block all of Asia.

**Implementer.** Localhost gtag guard; GA4 filter instructions with exact Admin clicks; Firewall draft in `BOT-WAF-DRAFT.md` (not applied).

**Judge.** Fail if: robots.txt claimed as the fix; WAF would hit Googlebot or ChatGPT; no GSC-vs-GA4 country table; Singapore blocked with no ASN/UA nuance **and** no proof GSC has zero SG clicks (re-check live — if GSC later shows SG clicks, do not country-block).

**Protected.** Production Firewall until Lucas applies. Google crawlers.
**Mutable.** `src/scripts/analytics.ts` / BaseLayout gtag, docs, draft rules.

---

## L2 — Crawl graph

**Objective.** Every indexable page reachable from `/` in ≤3 clicks, zero broken internal links, no new orphans. Concentrate crawl on pages that can earn impressions.

**Success check (already built).**

```
npm run graph:check   # exit 1 on broken links / orphans / depth>3
npm run graph:compare # did this increment help?
```

Targets from `.planning/CRAWL-GOAL.md` (do not silently retarget):

| Metric | Target |
|---|---|
| broken internal links | 0 |
| orphans (excl. google verify file + intentional 301 targets) | 0 |
| unreachable from `/` | 0 |
| pages ≥4 clicks deep | 0 |
| max depth | ≤3 |

Plus: `REAL_BUILD_EXIT=0`. No drop in total indexed impressions attributable to the change (lagging; do not wait — just don't delete ranking URLs).

**Strategist.** One defect class per increment (the CRAWL-GOAL ratchet). Hypothesis required.

**Implementer.** Templates/layouts. Links must mirror `getStaticPaths`. Guard free-text slugs with a `Set`. No trailing slash.

**Judge.** Trust the graph, not the rendered section. Fail if links 404, if URLs come from `data.name`, if footer spam "fixed" inbound counts, if `noindex` used *instead of* sitemap exclusion when the goal was budget.

**Protected.** Citations, factual claims, published slugs (no delete/rename without Lucas).
**Mutable.** layouts, `astro.config.mjs` sitemap exclude, `scripts/crawl-graph.mjs` only if the graph itself is blind.

**Gaming check.** Dumping sitewide links zeros metrics and dilutes equity. Every added link must be one a reader would click.

---

## L3 — Technical SEO hygiene

**Objective.** Fix remaining *real* technical defects that survive `SEO-AUDIT-CORRECTIONS.md`. Do not re-litigate overturned claims.

**Still in play (verify live, then act):**

- Vercel **dashboard** apex→www is 307; `vercel.json` already 308. Owner action. Document, do not "fix" in JSON again.
- Trailing-slash duplicate index historically 178 pairs / 62% of impressions on slash URLs. Confirm current GSC. Do not change `trailingSlash`. Strengthen canonical + sitemap consistency only.
- Title suffix hygiene is allowed as hygiene, **not** sold as a CTR strategy (Simpson's paradox).
- Sitemap `lastmod` from frontmatter — keep if present; restore if missing.
- Raw `.mdx` URLs indexed (clinics) — must not come back.
- `searchAppearance` empty despite JSON-LD — diagnose, don't spray more schema.
- Brand SERP: people search "peptide codex" / "pepdoc". Homepage title/description may help; no new brand microsite.

**Overturned — Judge fails the loop if Implementer acts on these as if true:**

- "16 months of data"
- "Title length is the CTR bottleneck"
- "Build more semaglutide vs tirzepatide comparisons to win volume"
- "DR 3.3 makes top-5 impossible" (site already holds pos 3–7 on under-covered pairs)
- Query-export "nobody searches what you rank for" as complete

**Success check.** Each change has a before/after crawl or GSC note. `qa-seo` not worse. No canonical-host or trailingSlash config change.

**Protected.** URL structure, host canonical config.
**Mutable.** titles/descriptions on existing pages, sitemap lastmod, docs for owner Vercel click.

---

## L4 — Integrity (false links + false facts)

**Objective.** Anything a reader or Googlebot can click is real and on-subject. Numbers on the page match the cited paper's published estimand.

**Success check.**

- `FALSE-LINKS.md`: every broken internal target, `.mdx` URL, trailing-slash hop, unguarded related-\* slug, 404 that GSC still lists — status fixed or explicitly deferred.
- `INTEGRITY-FINDINGS.md` classes: fabricated id, real id wrong paper, wrong-drug NCT, estimand swap, parent-compound cited as derivative, window-scoped absence, journal-homepage "source," dangling body citation IDs.
- After W2: `qa:claims`, `qa-pmids --strict`, `qa:attached` on touched files; Verifier re-fetches every new identifier.
- No identifier introduced that was not in a worklist or fetched this run.

**Strategist.** Severity order: live 404s and wrong-drug links first (they look authoritative). Then estimands. Then absences.

**Implementer.** Strip unverifiable ids (`verified: false`) rather than delete citation text when the text is a real lead. Do not overwrite a stored label from a registry until drug-match passes. Escape `P<0.001` in MDX.

**Judge.** Fail on: "all PMIDs resolve" offered as topical proof; absence claim without window date; efficacy estimand headlined; sibling-trial PMID mixup (REDEFINE-1 vs -2 class); auto-attach by fuzzy title.

**Protected.** Ledger fabrications marked `retired` stay retired (do not resurrect).
**Mutable.** content + packs + templates that emit links.

---

## L5 — Freshness (last 90 days of peptide evidence)

**Objective.** Dossiers, trial packs, and regulatory fields reflect what PubMed / CT.gov / openFDA actually published in the window, without inventing coverage.

**Window.** Run date minus 90 days (this engine's default). Do not reuse a 2026-08-17 worklist as if it were current — rescan.

**Success check.**

- `npm run research:scan -- --days 90` wrote per-slug JSON **including zero-finding files** (absence must overwrite stale worklists).
- Relevance filter applied; implausible volumes investigated as alias bugs (`NASA`, `AED`, `P21`, "intestinal peptide").
- Worklist items are fetched identifiers with title/abstract, not memories.
- Every dossier touched has ≥1 window-dated identifier verified into the ledger **or** a dated negative ("scanned YYYY-MM-DD, 0 relevant hits").
- New peptides: only if `discover:gaps` + CONTENT-PLAN allow a new URL. Otherwise add a stub row to `GAPS.md` and stop.
- Editorial/blog in this loop cites only A/B/C outputs.

**Strategist.** Rank High (published results, approvals, INN renames, label changes) / Medium (new NCTs, status) / Low (preclinical). Cap W2 to what 3 editors can finish with review.

**Implementer.** Evidence Analyst, Trials Analyst, Regulatory Analyst, then Dossier Updater. Discovery/authorship split is structural.

**Judge.** Fail on: OR-joined alias queries; unfiltered PubMed dumped to a writer; "no publication" from a 90-day search written as eternal; press-release number as headline; preprint unlabeled.

**Protected.** Scoring may only drop after a corrected fabrication; new corroboration may raise, conservatively, in a separate pass.
**Mutable.** dossiers, source-packs, regulatory fields, scan artifacts.

**API budget.** NCBI ~3/s anon; openFDA 1k/day. Stagger. Use `verification/pubmed.mjs` only.

---

## L6 — Traffic content (blogs + existing comparisons)

**Objective.** Earn clicks from pages Google already can see, and from decision-support shapes that historically convert — without growing the URL pile.

**What the data allows:**

- Keep the blog; change what it *is*: evergreen decision-support, not news commentary vs STAT/Reuters.
- Lucas: do **not** delete/301 a third of the posts. Differentiate same-slug twins in `guides/` / `safety/` rather than fatten both halves. Merge-with-redirect is stronger SEO but **blocked on Lucas**.
- New posts only with: named keyword/intent from GSC **page** data or a converting comparison shape, inbound link from ≤2 clicks of `/`, net URL delta ≤ 0 (or approved exception), ≥2 verified citations, app CTA if the brief says so.
- Do not build media-saturated GLP-1 vs GLP-1 pages as a volume play. The site ranks where big media is absent (kristagen-vs-thymalin class). Use that rule unless new GSC overturns it.
- Comparisons and calculators convert. Generic glossary: already partly noindexed — do not add generic terms.

**Success check.**

- `CONTENT-PLAN.md` has a net-URL ledger (adds, noindex+sitemap-drop, no change).
- Each optimized post: title/meta from page+query where available; internal links to real slugs; estimand-correct figures; no banned content; lastUpdated bumped.
- `qa-seo` + `qa:advice` + `qa-banned-content` no worse than HEAD on touched files.
- Graph not regressed.
- If a new URL shipped: `graph:check` still green and a homepage-path ≤2 clicks exists in `dist/`.

**Strategist.** Rank existing URLs by (mobile clicks + impressions + striking-distance position 11–20). News posts → rewrite toward "how to read the trial / X vs Y / what the label actually says," not "this week in peptides."

**Implementer.** Blog Optimizer first. Blog Writer last and rare. Sets of 10, independent review, worklist-locked.

**Judge.** Fail if: published more as the strategy; new URL with no inbound path; news-decay post added; demand claimed from query-export silence; duplicate twin fattened; affiliate/research-chem CTA.

**Protected.** Slugs (no silent rename). Published URLs.
**Mutable.** MDX bodies/frontmatter, internal links, meta.

---

## L7 — App funnel (PepTracker)

**Objective.** A reader who just did a job the app continues can continue it. Zero extra URLs.

**Natural placements (from MARKETING-BRIEF):** after calculator result; after dossier evidence/timeline; after safety adverse-event section; newsletter. Not a sticky banner on every glossary term.

**Success check.** Grep the built HTML (not just source) for a real waitlist/app href on calculator + dossier templates. No sourcing/purchasing language. `qa:advice` clean. No CTA on pages that would imply PepTracker doses for you.

**Strategist.** Copy that degrades to waitlist if the app isn't in stores.

**Implementer.** Templates. One pattern, reused.

**Judge.** Fail if CTA only in privacy/terms (the 2026-07 failure). Fail if CTA is a peptide vendor.

**Protected.** Affiliate policy.
**Mutable.** layouts, a small MDX snippet component.

---

## L8 — Authority (slow, recommend)

**Objective.** Increase the chance Google spends crawl budget here: linkable unique assets, AI-citation feeds that aren't stale, brand-recall SERP.

**Success check.** `AUTHORITY.md` with 3–7 specific, evidence-backed moves. No outreach emails sent (propose-first). If `llms.txt` still hardcodes stale dossier counts, a generator patch is in-scope (it is a lie on a public file — reversible, should fix).

**In play:** original trial-tracker analysis; keep `/llms.txt` generated from collections; do not spam directories; ChatGPT is already a channel — citeable structure over blog volume.

**Judge.** Fail on "guest post + HARO" generic lists with no PepCodex artifact attached.

**Protected.** Live site outreach.
**Mutable.** `llms.txt.ts` generator, recommendations doc.
