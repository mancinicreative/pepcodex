# PRD #1 — Content Integrity, Dossier Currency, and CTR Recovery (FINAL)

**Site:** pepcodex.com · **Repo:** `C:\Users\manci\OneDrive\Documents\00_Claude\peptide-library` (worktree: `.claude\worktrees\cool-heisenberg-e12770`)
**Date:** 2026-08-17 (rev. 2 — post-adversarial-review) · **Author:** planning agent · **Status:** final for owner sign-off

**Change log vs. draft:** the adversarial review found the draft's core numbers wrong (baseline, dossier staleness, comparison count, triage sums), its sitemap arithmetic inverted (it proposed deleting pages already out of the sitemap while rewriting the pages whose deletion would actually shrink it), its effort estimates ~1.8x low, and its cheapest lever (CTR on 121 zero-click top-10 pages) absent. Every finding was independently re-verified against the repo on 2026-08-17 before being incorporated. This revision inverts WS2/WS3, cuts WS4 Tiers B and C, moves new content to PRD #2, and adds the CTR workstream.

---

## 1. Verified state (every number re-measured 2026-08-17; commands cited)

- **155 blog posts, 102 dossiers, 269 comparisons** on disk. [VERIFIED: `ls src/content/{blog,peptides,comparisons} | wc -l` → 155 / 102 / 269. Draft's "279 comparisons" was wrong.]
- **Citation baseline is 201 entries** (`.planning/citation-baseline.json`, `count: 201`, 201 entries). The draft's "202" appears in no artifact. Cohort ownership, measured: **NEEDS-REWRITE posts own 102 entries, UNSALVAGEABLE 93, FIXABLE 3, ss31 (untriaged) 3 = 201.** [VERIFIED: script over baseline × triage-results, 2026-08-17]
- **Triage covered 66 distinct posts, not 67.** `triage-results.json` has 67 rows; `peptide-hydrogel-joints` appears twice. Distinct verdicts: **31 UNSALVAGEABLE / 34 NEEDS-REWRITE / 1 FIXABLE.** [VERIFIED: dedup script, 2026-08-17]
- **`ss31-mitochondrial-heart-failure` was never triaged and is the most dangerous live post.** 3 placeholder source ids (`ss31-cardiac-study`, `elamipretide-mechanism`, `hf-mitochondria` — no PMID/DOI/URL), `evidenceLevel: high`, no noindex, in the sitemap, 128 impressions, body follows the semax fabrication pattern. It is the 3-entry "untriaged" residue in the baseline and resolves the draft's 88-vs-89 discrepancy: 155 = 66 triaged + ss31 + **88 posts with resolving identifiers**. [VERIFIED: frontmatter read + baseline join, 2026-08-17]
- **Sitemap reality: the 31 UNSALVAGEABLE posts are ALREADY excluded** (31/31 carry noindex; `noindexedBlogUrls()` feeds `SITEMAP_EXCLUDE` in `astro.config.mjs`). **The 34 NEEDS-REWRITE posts are ALL still in the sitemap** (0/34 noindex) and hold ~741 impressions / 0 clicks; **29 of 34 have zero impressions.** Deleting held posts changes the sitemap by 0; deleting zero-impression NR posts cuts 29 live URLs — the largest crawl win available in this plan. [VERIFIED: noindex scan per cohort, 2026-08-17 → NR 0/34, UNS 31/31]
- **Dossier staleness: 49 of 102 have top-level `lastUpdated` ≤ 2026-01-22; 53 are newer** (21 in 2026-02, 13 in 2026-04, 1 in 2026-05). The draft's "101 of 102 stale" was off by 52 — each dossier has two `lastUpdated` keys and the wrong one was read. WS4 is re-premised accordingly. [VERIFIED: frontmatter scan, 2026-08-17]
- **Enforcement gaps:** `scripts/qa-banned-content.js` exists but is wired into NO npm script; `qa-retractions.mjs` is manual-only (`npm run qa-retractions`), not in `npm run check` or `prebuild`. Every banned-content rule in this PRD is currently unenforced by the gate it names. [VERIFIED: `grep package.json`, 2026-08-17]
- **Traffic:** 121 clicks / ~38k impressions site-wide, but the two GSC properties cover **different windows** — apex 177 days from 2026-01-27 (81 clicks / 31,704 impr), www only 56 days from 2026-05-28 (40 clicks / 5,884 impr). Any per-page ranking mixing both is skewed toward apex-era pages; all prioritization below treats this as a known bias. [VERIFIED: manifest.json; draft presented one coherent window — wrong]
- **Section economics (both properties, window caveat above):** `/compare` earns 39 of 121 clicks (32%) from ~2,854 impressions — **1.37% CTR, ~17x the dossier rate** (/peptides 0.08%, /glossary 0.05%, /blog 0.00%). `/glossary` is the second-largest impression pool (10,786, 28%) at 5 clicks. **121 pages rank top-10 with zero clicks (11,452 impressions).** Blog: 6,385 impressions, zero clicks all-time. [VERIFIED: GSC page-level join]
- **cerebrolysin is the single largest page — 5,228 impressions (13.5% of site total)** — and Wikipedia pageviews rank it dead last of the tracked set (2,662/mo). First-party GSC and the external proxy disagree; GSC wins for prioritization. [VERIFIED: GSC + pageviews API]
- **FDA PCAC, 23–24 Jul 2026:** recommended six peptides for the 503A bulks list — BPC-157 (8-6), KPV, TB-500, MOTS-c, Epitalon (substance name; **collection slug is `epithalon`**, no `epitalon.mdx` exists), Semax. **Non-binding**; HHS sign-off + notice-and-comment rulemaking (8–12 months) pending. GHK-Cu, Melanotan II, Dihexa on the Feb 2027 agenda. [VERIFIED: external, this month; slug verified `ls src/content/peptides`]
- Demand momentum (Wikipedia pageviews/mo, May–Jul 2026): Retatrutide 52,229 (> semaglutide 46,530), BPC-157 25,269, Semax 12,494. Declining YoY, avoid: amycretin −64%, semaglutide −59%, tirzepatide −58%, NAD+ −52%, methylene blue −76%, NMN −40%. [VERIFIED: pageviews API]
- Best-quality channel is AI referral: chatgpt.com 264 sessions, 40% bounce, 327s dwell vs Google organic 233. GA4 topline is ~91% bot. [VERIFIED: GA4 per-channel]
- The mk-677 "10 bad sources" report was a parser false positive (globalRegions list). **But note the limits of "clean":** the baseline proves dossiers/comparisons have no *missing identifiers*, not that their claims are *supported* — the same unaudited-claims gap identified for the 88 blog posts applies in principle to 102 dossiers. WS1 now samples dossiers too. [VERIFIED: re-parse + baseline is 100% blog/ entries]
- GSC re-pull blocked on `gcloud auth application-default login` (expired); Vercel token expired. [VERIFIED: attempted]
- Owner decisions in force: affiliate monetization in scope (FTC 16 CFR Part 255); PepTracker funnel is a goal; fix existing posts before writing new ones. [VERIFIED: owner statements]

**Meta-lesson, adopted as process:** four draft numbers labeled [VERIFIED] failed to reproduce (202/201, 279/269, 101/49 stale, 67/66 triaged). Transcription is not verification. WS0 now commits a regeneration script; **no agent brief may carry a Section-1 number that the script did not print.**

## 2. Binding constraint

**Crawl budget.** 923 of 1,221 pages have never received one impression; 60% "Discovered – currently not indexed"; DR 3.3, domain <6 months. Crawl allocation, not quality, decides what ranks. Every workstream is **net-URL-neutral or negative**; this revision achieves a real −29 sitemap URLs (draft achieved 0 — its deletion targets were already excluded). Second constraint: **owner time.** Corrected core path is ~75–90 h (the draft claimed 115–135 h for a scope that actually cost 205–260 h; this revision cuts scope rather than restating fantasy numbers).

## 3. Objective

Make every indexed claim traceable to a real source that actually supports it, harvest the cheapest real traffic lever (titles/snippets on pages already ranking), and bring the six highest-value dossiers current. New content moves wholesale to PRD #2.

Numeric targets (8-week horizon):
- **0** indexed blog posts with claims known to diverge from cited sources (currently ≥34 + ss31).
- Citation baseline **≤ 10** (from 201; full execution lands ~0–3: NR 102 + UNS 93 + FIXABLE 3 + ss31 3 all resolved by rewrite, deletion, or fix).
- Sitemap URL count **≤ 1,055 + N** where N = owner-approved held-post rewrites re-entering (each a deliberate, logged +1). Never rises otherwise.
- **6** Tier-A dossiers refreshed with `lastUpdated` ≥ 2026-08; FDA paragraph present in all 9 PCAC-affected dossiers.
- Title/meta rewritten on the top-50-impression zero-click pages; movement measured (not promised) at week 8.

## 4. Non-goals

- **No new posts, dossiers, or comparison pages. Zero net-new URLs.** All new content, the app funnel, and affiliate execution move to PRD #2, gated on this PRD's exit criteria. (Draft's WS5 is cut: its URL-for-URL mechanism was arithmetically impossible — the pairing inventory was already de-sitemapped.)
- No dosing protocols, medical advice, or sourcing guidance.
- No redesign, template work (beyond title/meta strings), or schema changes.
- No re-litigating held owner decisions.
- Not resolving the Semax Russia approval year by picking a plausible date — stays [UNKNOWN] until a primary registry document is found.
- WS4 Tiers B and C are cut (see WS4 for why), not deferred-with-dates.

## 5. Workstreams

**Honest total: ~75–90 h core + up to ~35 h owner-gated rewrite option.** Estimates below include verification time; where the draft's number was found to be fantasy, the corrected basis is shown.

---

### WS0 — Emergency hold, number regeneration, data unblock (3 h; owner portion 1 h) [PARTIALLY BLOCKED ON HUMAN]

**Objective:** stop the one live known-bad page, make the plan's numbers mechanically reproducible, wire the dormant gates, restore live data.

1. **ss31 emergency hold (same day, agent, 30 min):** add `robots: noindex` frontmatter to `src/content/blog/ss31-mitochondrial-heart-failure.mdx` (CRLF-safe edit, verified by independent grep), confirm it enters `noindexedBlogUrls()` exclusion, rebuild, grep `dist/` for the meta tag. It then joins WS3 disposition. This post has fabrication-pattern claims at `evidenceLevel: high`, live and ranking — it does not wait for a workstream.
2. **Numbers regeneration script (1 h):** commit `scripts/regen-prd-numbers.mjs` printing: content counts, baseline count + per-cohort ownership, triage distinct counts, per-cohort noindex status, dossier staleness split, sitemap `<loc>` count from `dist/`. Its output block is pasted into `.planning/CITATION-AUDIT.md`, replacing the stale prose (202→201; 67→66 distinct; mk-677 open-item 4 closed; 88-vs-89 resolved as ss31).
3. **Wire the gates (30 min):** add `qa-banned-content.js` and `qa-retractions.mjs` to `npm run check` (retractions may be advisory/non-blocking initially; banned-content blocking). Without this, every "banned content" and "passive retraction coverage" claim in this PRD is fiction.
4. **Owner (1 h):** `gcloud auth application-default login` → `npm run gsc:whoami` → `npm run gsc:repull`. `vercel login` when convenient (not needed here).

**Evaluator:** ss31 noindex tag present in `dist/` (grep output logged); `node scripts/regen-prd-numbers.mjs` output committed and matching Section 1; `npm run check` includes banned-content (verify by injecting a dosing phrase in a scratch file → real exit 1, then revert); fresh GSC JSON with rows dated ≥ 2026-08-01.
**Effort:** 3 h. **Dependencies:** none. **Timeout rule:** if the owner auth stalls >3 days, WS2/WS4/WS5 prioritization proceeds on the 07-25 pull (known window-skew caveat) and re-ranks when fresh data lands.

---

### WS1 — Claims audit: sample of the 88 "resolving-identifier" posts + 5 dossiers (~21 h)

**Objective:** determine whether posts whose identifiers resolve actually say what their sources say. The triaged cohort ran 47% unsalvageable (31/66); assuming the rest is clean is the exact unverified confidence that produced this mess. **New:** dossiers get a spot-check too — "no missing identifiers" was the only evidence of their cleanliness, and that is not evidence of supported claims.

**Sampling:**
- **Stratum A** — every post among the 88 with ≥100 GSC impressions (est. 8–12; list from the fresh pull, or 07-25 pull under the timeout rule). ss31 is NOT in this stratum — it was never in the clean cohort and is already held by WS0.
- **Stratum B** — 10 posts from the remainder, seeded RNG (seed `20260807`, script committed).
- **Stratum C (new)** — 5 dossiers: cerebrolysin (13.5% of all impressions), semax, plus 3 seeded-random. Dossier claims tables cover the top 10 claims per dossier, not exhaustive.
- Sample ≈ 20 posts + 5 dossiers.

**Method per item:** claims table — every factual claim (top-10 for dossiers) → cited identifier → **verbatim supporting quote from the fetched abstract/record** → per-claim support verdict. Stored `.planning/data/v2/claims-audit/<slug>.json`. Item verdict: CLEAN / MATERIAL-DIVERGENCE / MINOR.

**Tooling (5 h, in estimate):** `scripts/qa-claim-quotes.mjs` — asserts every supporting quote is a **literal substring of the fetched PubMed/ClinicalTrials text**. **Honest scope statement (corrected from draft):** this gate mechanically blocks *fabricated quotes and identifiers* — a real, observed failure mode — but it CANNOT verify that a genuine quote *supports* the adjacent claim. Misattribution detection is and remains a reading task: the verifier's per-claim support verdict, plus the owner spot-check in WS2. The draft billed this tool as the primary control against fabrication laundering; it is one layer, not the control. (Reviewer partially overstated — "does not address that risk" is wrong for the fabricated-quote half — but the demotion stands.)

**Escalation rule (fixed now):**
- 0 material of 20 posts → stop; retraction coverage continues via the now-wired `qa-retractions` in `npm run check` (real, per WS0.3 — the draft's "passive coverage" cited a gate that never ran).
- 1–2 material → audit the offenders' generation cohort (`git log --diff-filter=A` dates), +10–20 h.
- ≥3 material → full audit of all 88 (+40–50 h), and **PRD #2 content work is frozen until it completes.** (Timing defect fixed: WS2 is now 4 posts from the already-triaged cohort, so nothing large is spent before this falsifier can fire.)
- Any dossier MATERIAL-DIVERGENCE → immediate owner escalation + audit of the top-10-impression dossiers.

**Evaluator:** `qa-claim-quotes.mjs` real exit 0 for every sampled item (exit captured inside log, grepped); per-claim support verdicts present; summary table committed to CITATION-AUDIT.md. An item without a claims table is unaudited, whatever anyone remembers reading.
**Effort:** 20 posts × 40 min ≈ 13 h + 5 dossiers × ~35 min ≈ 3 h + 5 h tooling ≈ **21 h** (draft said 15 h while itemizing 18.3 — corrected). Contingent per escalation.

**Agent brief (self-contained):**
> Repo: path given at dispatch. Task: for each assigned item in `src/content/blog/` or `src/content/peptides/`, extract factual claims and cited identifiers (frontmatter `sources:` + body), fetch the real abstract via PubMed E-utilities (`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=<PMID>&rettype=abstract&retmode=text`) or ClinicalTrials.gov API v2, and record into `.planning/data/v2/claims-audit/<slug>.json`: `{slug, claims:[{claim, id, quote, supportVerdict}], itemVerdict}`. `quote` must be copied verbatim from the fetched text; `supportVerdict` is your judgment: SUPPORTED / UNSUPPORTED / CONTRADICTED. **You have explicit permission to answer "could not verify" — do not guess, do not paraphrase a quote, do not soften a divergence. Fabricating a quote or identifier is the worst possible outcome and grounds for discarding all your output.** If an item's source has no fetchable identifier, its verdict is UNSUPPORTED — do NOT find a nearby real paper and attach it; attaching an identifier the post did not cite is laundering, not auditing. Do not edit any content file. Traps: content files are CRLF — regexes must match `\r?\n`; verify any file you write with an independent grep; capture real exit codes: `{ node scripts/qa-claim-quotes.mjs <file>; echo REAL_EXIT=$?; } > out.log 2>&1`, grep for `REAL_EXIT=0`. Report: per-item verdict table + the actual REAL_EXIT line per JSON.

**Done-means:** all 25 sampled items have committed claims-audit JSON with logged real exit 0; escalation decision recorded with the triggering numbers.

---

### WS2 — Rewrite the 4 NEEDS-REWRITE posts with impressions + the 1 FIXABLE (~14–17 h)

**Rescope (was 34 posts / 55–70 h in the draft).** Only 5 NR posts have any impressions — `zepbound-sleep-apnea-approval` 481, `retatrutide-phase3-enrollment` 131, `ai-peptide-drug-discovery` 116, `amycretin-phase2-results` 10, `aod9604-human-efficacy` 3 — and `ai-peptide-drug-discovery` is one of the 3 with no recovered identifier, so it goes to WS3 disposition. **Rewrite 4 posts** (625 of the cohort's 741 impressions) **+ fix the 1 FIXABLE post.** The other 29 NR posts (zero impressions each) go to WS3 deletion — see the inversion rationale there.

**STANDING WARNING (in every brief + PR template):** do NOT paste recovered PMIDs/NCTs into posts whose claims still diverge. A real identifier on a false claim makes fabrication look verified — strictly worse than the current state. Order: read the real source → rewrite claims to match → attach identifier. Any commit adding an identifier without a passing claims-audit JSON for that post is a defect.

**Pipeline per post:**
1. Writer agent: fetch recovered identifiers' abstracts (`triage-results.json`), rewrite so every claim is supported — including negative findings; if the honest article contradicts the old headline, write the honest article. Evidence grading + disclaimers required. Produce claims-audit JSON with per-claim support verdicts.
2. Verifier agent (separate session, no writer context): run `qa-claim-quotes.mjs`, read the diff, and independently judge each claim's `supportVerdict` against the fetched abstract. **Honest control statement:** writer≠verifier reduces sloppiness; it does NOT reliably catch correlated misattribution (both are LLMs reading the same abstract). Therefore:
3. **Owner spot-check:** Lucas reads 3 randomly-selected claim/quote/abstract triples per post (≈10 min/post). This is the only uncorrelated check in the pipeline and is budgeted, not aspirational.
4. `qa-source-identifiers.mjs --update-baseline` after each verified fix; baseline must strictly decrease (diff shows removals only).

**Evaluator:** per post — `qa-claim-quotes.mjs` real exit 0, all `supportVerdict: SUPPORTED`, `npm run check` (now incl. banned-content) real exit 0, baseline decremented. **Batch: the NR-with-impressions posts' 102-entry share resolves only in combination with WS3's deletions; end-state baseline target lives in Section 3 (≤10), not here — no more targets satisfiable at 70% completion.**
**Effort:** 4 × 3–4 h (draft's 1.5–2 h/post contradicted its own 40-min audit-only figure; rewrite = audit + read + rewrite + verify + baseline) + FIXABLE ~1 h + owner spot-checks ~1 h ≈ **14–17 h**.
**Dependencies:** WS1 tooling (first 5 h). Runs parallel to WS1 sampling thereafter.

**Agent brief (writer, self-contained):**
> Repo path as dispatched. Read `.planning/CITATION-AUDIT.md` and `.planning/data/v2/triage-results.json` first. For your assigned slug in `src/content/blog/`: fetch the recovered identifiers' real abstracts (PubMed E-utilities / ClinicalTrials.gov API v2); rewrite body and frontmatter `sources:` so every factual claim is supported by a source you fetched and read THIS session — report what the paper reports, including negative findings. Required: evidence grading, disclaimers. Banned: dosing protocols, medical advice, sourcing guidance, any identifier you did not fetch this session. **Never fabricate a source, PMID, DOI, NCT, date, or quote — fabrication is why 31 sibling posts are delisted. You may conclude "insufficient real evidence to support this post's premise" and report that instead of stretching.** Produce `.planning/data/v2/claims-audit/<slug>.json` (WS1 schema incl. supportVerdict). Traps: CRLF files (`\r?\n` in every regex; verify every edit with independent grep — a `\n`-only replace silently no-ops and reports success); real exit codes inside logs (`{ npm run check; echo REAL_EXIT=$?; } > check.log 2>&1`, grep it); derive any internal link from collection slugs, never display names (`slug` ≠ `name`: hcg, melanotan-i, mrna-4157, na-selank-amidate, na-semax-amidate); add or remove no URLs. Report: REAL_EXIT lines for both gates + grep proof of each frontmatter edit.

**Done-means:** 4 posts + 1 FIXABLE rewritten, all gates green with logged real exits, owner spot-checks logged, baseline strictly decreased, CITATION-AUDIT queue updated.

---

### WS3 — Deletions and disposition: 29 zero-impression NR posts + 31 held posts + 2 transfers (~9 h + owner-gated rewrites ~25–35 h)

**This is the inverted core of the plan (the review's biggest correction, verified).** The draft proposed deleting ~20 already-de-sitemapped held posts (crawl benefit: zero) while spending 55–70 h rewriting 29 zero-impression posts (whose deletion is the largest available crawl win). Reversed:

- **Delete the 29 zero-impression NEEDS-REWRITE posts.** All are live in the sitemap; removal is a real **−29 sitemap URLs**. 410 by default; 301 only where a topically-matching dossier exists (require an actual topical match, not a keyword match — decided per-slug in the memo).
- **Delete the 31 held UNSALVAGEABLE posts too** — but with honest accounting: this changes the sitemap by **0** (already excluded). The benefit is different and real: a served 410 removes the recurring fetch cost that noindex-in-place perpetuates (Google must fetch a page to read noindex; it stops fetching a 410). The draft claimed sitemap benefit here; there is none.
- **Owner-gated rewrite option:** of the held 31, ~10 URLs had proven demand (semax-neuroprotection-stroke 1,133 impr pos 8.2; dsip-sleep-quality-study 592; rest per GSC). Rewriting an honest article at the same URL re-adds it to the sitemap — **each is a deliberate, logged +1** against the −29. Condition: a real literature base exists (the honest Semax-stroke article from real Gusev-lab papers, and the honest "DSIP probably doesn't work" article, are both writable and are exactly the contrarian evidence-based content the positioning promises). Recommend approving only those with ≥100 impressions. Uses the WS2 pipeline; ~2.5–3.5 h each.
- **Transfers:** `ai-peptide-drug-discovery` (no identifier, 116 impr — rewrite candidate if a literature base exists, else delete) and `ss31-mitochondrial-heart-failure` (held by WS0; triage now; expected verdict unsalvageable-or-rewrite given the placeholder ids).

**Decision memo:** ~3 h (draft's 2 h for 31 slugs was 3.9 min/slug including 301-target checks; now 62 slugs — batch the zero-impression 29 as a default-delete table, spend the time on the ~12 judgment calls). [BLOCKED ON HUMAN: ratification.]

**Evaluator:** per-slug fate table committed; after execution `{ npm run build; echo REAL_BUILD_EXIT=$?; } > build.log 2>&1` with grep `REAL_BUILD_EXIT=0`, `npm run graph:check` real exit 0 (no regressing the 398-broken-links fix); **sitemap `<loc>` count = 1,084 − 29 + (approved rewrites), computed and logged before/after** (draft's "≤1,064" was unachievable — its deletions weren't in the sitemap); baseline entries for every deleted post removed.
**Effort:** memo 3 h + delete execution 6 h (62 files, inbound-reference sweeps, redirects, verification) + rewrites 25–35 h **only if owner approves**.
**Dependencies:** owner ratification; rewrites reuse WS2 pipeline after WS2.

**Agent brief (delete path, self-contained):**
> Repo path as dispatched. Input: the per-slug fate table in `.planning/CITATION-AUDIT.md`. For each DELETE slug: remove `src/content/blog/<slug>.mdx`; add the 410/301 per the mechanism the repo ACTUALLY uses — inspect `astro.config.mjs` and `vercel.json` first and report which one handles redirects before editing; verify the actual mechanism, never assume. Grep ALL of `src/` for inbound references to the slug (free-text related-post slugs have no referential integrity — ~330 live 404s shipped that way once) and remove or retarget them. Then `{ npm run build; echo REAL_BUILD_EXIT=$?; } > build.log 2>&1`, grep for `REAL_BUILD_EXIT=0`; run `npm run graph:check`; count sitemap `<loc>` before/after and report both numbers. Do not touch anything outside listed slugs and their inbound links. Files are CRLF; verify every edit with independent grep. Report: fate executed per slug, actual grep output, both real exit codes, both sitemap counts.

**Done-means:** all 62 slugs have an executed recorded fate; graph:check green with logged real exit; sitemap count matches the arithmetic exactly.

---

### WS4 — Dossier currency: Tier A only, 6 dossiers chosen by first-party GSC + mechanical FDA insert (~18 h)

**Rescope.** The draft's premise ("101 of 102 stale") was false — 53 dossiers are ≤6 months old. And its Tier A was chosen by Wikipedia pageviews, which ranks the site's biggest page (cerebrolysin, 5,228 impr) dead last. Corrected:

- **Tier A (6 dossiers, full evidence refresh, GSC-chosen):** cerebrolysin (5,228 impr), semax (1,713), ghk-cu (1,346 across both URL forms), tesamorelin (838), tb-500 (351), kpv (180). Re-rank against the fresh WS0 pull before dispatch.
- **FDA regulatory insert (mechanical, 12 dossiers × ~15 min = 3 h):** the remaining PCAC-affected dossiers (bpc-157, mots-c, **epithalon** — the slug; there is no epitalon.mdx — plus the Feb 2027 trio ghk-cu*, melanotan-ii, dihexa, and any Tier A member not already covered) get the regulatory paragraph only, without a full evidence refresh.
- **Tier B is CUT** (draft: "10 h" for 101 dossiers = 5.9 min each — real cost 34–50 h — AND crawl-negative: bumping `lastmod` on 101 unchanged pages advertises non-changes for recrawl on a crawl-starved site). Cut outright, not deferred.
- **Tier C confirmed cut** (draft already recommended this; ~60 h against pages earning ~zero impressions).

**Anti-fabrication pipeline:**
1. **Machine-fetched evidence packs:** `scripts/dossier-evidence-pull.mjs` (extend existing `refresh-trials.mjs`): date-bounded PubMed E-utilities (`mindate=2026/01/01`) + ClinicalTrials.gov per slug → raw responses to `data/source-packs/updates/<slug>-2026-08.json`. The network layer, not an agent, produces every candidate identifier.
2. **FDA constants file (fixes the draft's highest fabrication-pressure defect):** the draft told agents to cite "the FDA meeting materials URL from the pack" — but the pack is built from PubMed/CT.gov, which do not index FDA advisory-committee materials; the URL could never be there, directly prompting an agent to synthesize a plausible fda.gov URL + dates + vote count. Fix: the orchestrator hand-verifies and commits `data/regulatory/fda-pcac-2026-07.json` ONCE — meeting URL, dates, per-peptide votes, status language — and briefs cite regulatory facts ONLY from this file. It is part of the closed world.
3. **Closed-world rule, mechanically enforced:** writer may cite only identifiers in {pack ∪ pre-existing dossier ∪ constants file}. New `qa-pack-closure.mjs` (~3 h) diffs post-edit identifiers against that union; any novel identifier fails.
4. **Quote anchoring:** every NEW claim gets a claims-audit entry (WS1 tooling) with supportVerdict.
5. **Empty-pull honesty:** a thin pack yields "reviewed 2026-08; no major new controlled evidence" — explicitly permitted and preferred over reaching.

**Evaluator:** 6 Tier-A dossiers with `lastUpdated` ≥ 2026-08, `npm run check` + `qa-pack-closure` + `qa-claim-quotes` real exit 0 each; **regulatory sections verified by the verifier agent against `fda-pcac-2026-07.json` field-by-field (claims-audit entries citing that file)** — the grep for "non-binding" is retained only as a smoke test, not the evaluator (draft's grep-only check was satisfiable by the word appearing anywhere).
**Effort:** tooling 6 h (evidence-pull 3 + pack-closure 3) + 6 × ~1.5 h = 9 h + FDA inserts 3 h ≈ **18 h**. **Dependencies:** WS1 tooling; parallel to WS2/WS3. **Falsifier checkpoint:** if the first 6 packs return near-zero new items, Tier A collapses into the FDA-insert pass — reclaim ~9 h.

**Agent brief (Tier A, self-contained, per batch of 3):**
> Repo path as dispatched. For each assigned dossier in `src/content/peptides/` (slugs given exactly — note `epithalon`, not epitalon): read `data/source-packs/updates/<slug>-2026-08.json` (machine-fetched; if the FILE is missing, STOP and report — do not fetch ad hoc). Cite ONLY identifiers present in that pack, already in the dossier, or in `data/regulatory/fda-pcac-2026-07.json` — **any identifier from memory is fabrication, the worst possible outcome, and fails `qa-pack-closure`. If a fact you want to state has no source in those three places, you may not state it — report the gap instead; "could not verify" is always acceptable, guessing never is.** Integrate new findings with evidence grading; if the pack is thin, write the honest "no major new controlled evidence" line — explicitly permitted. For PCAC-affected dossiers: write the regulatory section STRICTLY from `fda-pcac-2026-07.json` fields (dates, vote, non-binding status, pending HHS + rulemaking) and produce a claims-audit entry per regulatory claim citing that file. Bump top-level `lastUpdated` (each dossier has TWO lastUpdated keys — edit the top-level frontmatter one; verify which you changed by grep). Banned: dosing protocols, medical advice, sourcing guidance. Traps: CRLF (`\r?\n`, independent grep after every edit); real exit codes inside logs; `slug` ≠ `name` for hcg, melanotan-i, mrna-4157, na-selank-amidate, na-semax-amidate; no new URLs. Report per dossier: what changed, what the pack contained, ACTUAL REAL_EXIT lines for `npm run check`, `qa-pack-closure.mjs`, `qa-claim-quotes.mjs`.

**Done-means:** 6 dossiers + 12 inserts pass all gates with logged real exits; verifier's field-by-field regulatory check committed; Tier B/C cuts recorded in `.planning/ROADMAP.md`.

---

### WS5 — CTR recovery: titles/metas on ranking zero-click pages (~12–15 h) [NEW — replaces the draft's new-content workstream]

**Objective:** the site's headline defect — **121 pages rank top-10 with 11,452 impressions and zero clicks** — is addressable by rewriting title tags and meta descriptions: zero new URLs, zero crawl cost, the cheapest lever available. The draft omitted it entirely while proposing 115+ h on the sections that convert worst.

**Scope:**
1. Pull the zero-click top-10 list + the top-50 pages by impressions from the fresh GSC data (window-skew caveat applies; prefer www-property recent data for post-308 reality).
2. Rewrite `metaTitle`/`metaDescription` per page: front-load the query intent, state the differentiator (evidence-graded, honest, current), fit pixel limits. Mobile-first — mobile is 67% of clicks at ~8x desktop CTR.
3. **Protect and study /compare** (1.37% CTR, 32% of all clicks): identify what its snippets do right and port the pattern. /compare pages are explicitly NOT deletion inventory (the draft nominated the converting section as scrap).
4. /glossary (10,786 impressions, 5 clicks): title-pattern pass on the top-20-impression glossary pages only; no per-page hand work beyond that.
5. Factual-claim rule: titles/descriptions are claims too — no promises the page doesn't support, no "study shows" phrasing for posts whose claims audit isn't green.

**Evaluator:** before/after title+meta diff table committed for every touched page; `npm run build` + `npm run check` real exit 0; no URL changes (`graph:check` green, sitemap count unchanged by this WS). Movement measured at week 8 via GSC re-pull: per-page CTR on the touched set vs the untouched top-10 zero-click remainder as a natural control. **No numeric CTR promise at DR 3.3 — the evaluator for shipping is the diff table; the evaluator for the bet is the week-8 comparison.** [ASSUMED: title/meta rewrites move CTR on already-ranking pages; standard but unproven here — that is what the control comparison tests.]
**Effort:** ~12–15 h (≈70–80 pages at 8–10 min + analysis + verification). **Dependencies:** WS0 data preferred; can start on 07-25 data for the apex-property pages.

**Agent brief (self-contained, per batch of ~15 pages):**
> Repo path as dispatched. Input: the page list with current title, meta, top queries, impressions, position (provided in the dispatch — do not re-derive). For each page, edit ONLY `metaTitle` and `metaDescription` frontmatter in the source file (locate the file from the collection slug — URLs mirror `getStaticPaths`; never guess a path from a display name). Titles ≤60 chars, descriptions ≤155; front-load the dominant query's intent; every phrase must be supported by the page's actual content — **no claims the page does not make, no invented specifics, no "study shows" language unless that page's claims audit is green.** Do not touch body content, URLs, or any other frontmatter key. Traps: CRLF files — `\r?\n` in any regex, independent grep after EVERY edit (a `\n`-only replace silently no-ops and reports success); real exit codes inside logs. Report: before/after table for every page + grep proof of each edit + REAL_EXIT lines for `npm run build` and `npm run check`.

**Done-means:** touched-page diff table committed; gates green with logged real exits; week-8 measurement scheduled in `.planning/CRAWL-GOAL.md` with the control-group definition written down now.

---

## 6. Sequence

```
Day 1:    WS0.1 ss31 hold (30 min) + WS0.2-0.3 regen script & gate wiring (agent)
          WS0.4 owner auth + repull (1 h, 3-day timeout rule)
Week 1:   WS1 tooling (5 h) → WS1 sample audit (16 h)
Week 1-2: WS2 rewrites, 4 posts + FIXABLE (14-17 h)            [parallel track 1]
Week 1-3: WS4 tooling + Tier A 6 + FDA inserts (18 h)          [parallel track 2]
Week 1-3: WS5 CTR pass (12-15 h)                               [parallel track 3]
Week 2:   WS3 decision memo (3 h) → owner ratification → delete execution (6 h)
Week 3-5: WS3 rewrite option if approved (25-35 h, WS2 pipeline)
Week 5:   WS1 escalation if triggered (freezes PRD #2 content, not WS4/WS5)
Week 8:   measurement checkpoint — GSC re-pull, WS5 control comparison, falsifier review
```
Dependency rules: WS1's tooling precedes any WS2/WS4 writing. WS3 deletions wait only on the owner memo. WS2, WS4, WS5 are independent parallel tracks for separate dispatches. Nothing in this PRD gates WS5 (CTR) on the integrity tracks except the "no study-shows language on unaudited posts" rule.

## 7. Falsifiers

1. **WS1 sample ≥50% material-divergence (≥10 of 20).** The 88 "clean" cohort was fiction; the whole blog corpus is condemned. Exposure is now small by design (WS2 = 4 posts from the already-triaged cohort), so the response is strategic, not budget-rescue: delete-or-hold the blog wholesale, re-plan around dossiers + /compare + PRD #2 from-scratch content. Checkpoint: end of week 2. (Draft defect fixed: the old plan scheduled 55–70 h of WS2 spend before this could fire.)
2. **Any dossier in Stratum C shows material divergence.** The "dossiers are clean" assumption dies; top-10-impression dossiers get audited before any further dossier work. Checkpoint: week 2.
3. **WS5 touched pages show no CTR movement vs control at week 8.** Then snippets aren't the blocker at DR 3.3 — authority is — and PRD #2 re-weights toward link acquisition and the AI-referral channel. Requires WS0 (post-308 data). Checkpoint: week 8.
4. **WS4 evidence pulls return near-zero new items.** Tier A collapses into the FDA-insert pass; reclaim ~9 h. Checkpoint: after the first 6 packs, week 1 of WS4.
5. **503A rulemaking materially changes.** Regulatory sections are written as "recommended, non-binding, pending" — stable either way; constants file gets one edit. Monitor at Sunday loops; not plan-fatal.
6. **Google deindexes further despite −29 net URLs.** Even clean content can't rank; effort re-weights to AI-referral + app funnel (PRD #2). Checkpoint: monthly `npm run gsc:index` sample.

## 8. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Fabrication laundering** — real identifiers attached to unsupported claims; passes every mechanical gate | Medium (the natural failure mode of LLM rewriting) | Fatal to positioning | Layered, honestly-rated controls: quote-substring gate (blocks fabricated quotes only), closed-world packs + constants file (blocks novel identifiers), verifier support-verdicts (correlated, weak), **owner spot-check of claim/quote/abstract triples (the only uncorrelated check — budgeted in WS2)** |
| CRLF silent no-op edits reported as success | High (bit 3×) | False "done" | `\r?\n` in every brief + mandatory independent grep + real-exit capture — in every brief verbatim |
| Owner time overrun | Medium (was High at draft scope; core cut ~40%) | Half-fixed corpus | 75–90 h core; traffic-descending order everywhere so partial completion still fixes what people see; deletions front-loaded |
| WS3 rewrites at ranking URLs lose rankings anyway | Medium | ~25–35 h for little | Owner-gated, ≥100-impr filter, each re-entry logged; keeping fabricated content ranking is not an option regardless |
| Honest rewrites less clickable than fabricated versions | Medium | Flat traffic | That IS the product; contrarian honest takes serve the AI-referral channel; do not soften |
| GSC stays stale (WS0.4 slips) | Medium | Prioritization on skewed pre-308 data | 3-day timeout → proceed on 07-25 pull; re-rank when fresh; window-skew caveat carried in every dispatch |
| WS5 titles overpromise relative to page content | Low-Med | New integrity surface | Brief bans unsupported phrasing; banned-content gate now actually wired (WS0.3) |
| Agent worktree/tooling failure mid-batch | Low | Rework | Per safety guardrails: stop and report, never destructive recovery |

## 9. Open questions

1. **[BLOCKED ON HUMAN]** WS3 ratification: default-delete the 29 zero-impression NR posts + all held 31; approve which of the ~10 proven-demand URLs get honest rewrites (each is a logged sitemap +1).
2. **[BLOCKED ON HUMAN]** ss31 final fate after triage (expected: delete or honest rewrite; it currently says `evidenceLevel: high` over placeholder ids).
3. **[UNKNOWN]** Semax Russia approval year (2011 vs ~1997 vs 1994 across our own pages). Stays uncertainty-stated until a primary registry document is found; the WS4 constants-file pattern is the right home once found.
4. **[RESOLVED — was draft OQ4]** 88-vs-89: triage covered 66 distinct posts (67 rows, 1 duplicate); ss31 was never triaged; 155 = 66 + ss31 + 88 resolving-identifier posts. WS0 commits this reconciliation.
5. **[ASSUMED]** Title/meta rewrites move CTR on already-ranking pages (WS5) — tested against a named control group at week 8, not taken on faith.
6. 410 vs 301 for deletions: default 301 only on genuine topical dossier match, else 410 — owner may prefer uniform 410; decided in the WS3 memo.
7. `qa-claim-quotes.mjs` paraphrase tolerance: v1 stays literal-substring-only — strictness is the point and claims must be written to quote-anchorable precision. Revisit only if it demonstrably blocks honest writing. (Reviewer's deeper criticism — that the tool can't judge support — is answered by the supportVerdict field + owner spot-check, not by loosening the substring rule.)
8. Affiliate program selection and FTC disclosure copy: moved to PRD #2 with the rest of new-content/monetization scope.
