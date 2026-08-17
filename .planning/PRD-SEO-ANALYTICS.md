# PRD #2 — SEO, Analytics, and Search Measurement (FINAL)

**Site:** pepcodex.com · **Repo worktree:** `C:\Users\manci\OneDrive\Documents\00_Claude\peptide-library\.claude\worktrees\cool-heisenberg-e12770`
**Date:** 2026-08-17 · **Owner:** Lucas · **Status:** Final for execution (v2, post-adversarial-review)

**Revision note:** Every number below was recomputed from the repo data files on 2026-08-17. The draft's headline figures (121 pages / 11,452 impressions; 38,772 impressions; "~11,000 impressions/mo stranded") did not survive recomputation and are corrected here. The former WS2 (redirect verdict tracking) is cut: the data shows consolidation completed before the fix shipped.

---

## 1. Verified state

- **121 clicks / 37,588 impressions** across both GSC properties, 2026-01-27 → 2026-07-22 (apex 81/31,704 over 177 days; www 40/5,884 over 56 days) [VERIFIED: `.planning/data/v2/manifest.json`, re-read 2026-08-17]. The two property windows differ 3.2x — never present the sum as one homogeneous period.
- **Merged top-10 zero-click set: 113 pages / 9,511 impressions** (paths normalized across properties; the draft's 121/11,452 double-counted 59 paths appearing in both properties) [VERIFIED: recomputed 2026-08-17 from `gsc-*-page.json`, impression-weighted position ≤10, clicks = 0]
- **Priority tier (expected clicks ≥2 at band CTRs pos 1–3 ≈10%, 4–6 ≈3%, 7–10 ≈1.5% [ASSUMED: industry-typical curves]): 17 pages / 6,897 impressions.** Two of the 17 (`/blog/semax-neuroprotection-stroke` 1,133 impr, `/blog/2025-peptide-approvals-record` 314 impr) carry `noindex` holds from the citation-integrity audit — **live tier = 15 pages / 5,450 impressions**, three of which (`/peptides/semax` 1,713, `/safety/kpv-safety` 847, `/peptides/tesamorelin` 838) hold 62% of it [VERIFIED: recomputed + frontmatter grep 2026-08-17]
- **The apex "stranded equity" premise is dead.** Apex's last 28 days in the pull: 184 impressions / 4 clicks (prior 28d: 217/6). www's last 28 days: 4,423 / 27 (prior 28d: 1,461/13). Consolidation onto www was already 3x-ing BEFORE the 308 shipped [VERIFIED: recomputed from `gsc-*-date.json` 2026-08-17]. The "~11,000 impressions/mo" figure was the apex all-time total averaged over 177 days dominated by Jan–May, when apex was the only verified property — 60x the actual pre-fix run rate. The repo had already ruled on this: `INDEXATION-DIAGNOSIS.md` line 140 calls the redirect fix "a no-op"; `SEO-AUDIT-CORRECTIONS.md` A3 demotes it [VERIFIED].
- 923 of 1,221 sitemap pages had never received an impression as of July; sitemap is now 1,084 URLs, so both numerator and denominator must be re-measured — the 923/1,084 pairing was never measured [VERIFIED: `INDEXATION-DIAGNOSIS.md` + this correction]
- `/peptides` (1,222 inbound links) was never crawled — internal linking is not the whole indexation story; monitoring must track Google's verdicts [VERIFIED: URL Inspection result in `INDEXATION-DIAGNOSIS.md`]
- Crawl-graph loop live: broken links 398→0, unreachable 158→2, max depth 6→3; `npm run graph:check` gates regressions [VERIFIED: `.planning/CRAWL-GOAL.md`]
- GA4 gtag scoping bug fixed this week — **all custom events were dead before the fix**; any pre-fix event data (including the newsletter's "24 form_start / 0 completions") is unreliable [VERIFIED: this week's fix + corollary]
- GA4 topline ~91% bot (Singapore ~5,410 sessions, ~667 owner-localhost) and chatgpt.com referral ~264 sessions with best-on-site engagement — **provenance: earlier one-off analysis, NOT reproducible by `npm run ga4:pull`**, which pulls only yearMonth/landingPage/channelGroup/eventName/deviceCategory — no source, country, or hostname dimension [VERIFIED: read `scripts/ga4-pull.mjs` 2026-08-17]. These figures are treated as [UNKNOWN provenance] until WS1 tooling reproduces or corrects them.
- `scripts/gsc-index-diagnose.mjs` hardcodes `SITE = 'https://www.pepcodex.com/'`, accepts only `--sample=N`, draws a fresh random sample each run from the frozen `crawl-baseline.json`, and persists no per-URL rows [VERIFIED: read the script 2026-08-17]. The draft's WS4 monitor cannot run on this tooling as written.
- Mobile = 67% of clicks at ~8x desktop CTR — but desktop impressions are bot-inflated, so the ratio is confounded; it does not prove mobile UX is good [VERIFIED: GSC device dimension + this week's bot findings]
- The site has **no conversion destination**: PepTracker appears only in `privacy.astro`/`terms.astro`; whether the newsletter form works is [UNKNOWN] (its zero-completion record predates the gtag fix) [VERIFIED: `SEO-AUDIT-CORRECTIONS.md` B7 grep]
- Brand-recall misses account for 6 of the www property's 40 clicks: 'peptide codex' pos 4.4, 'codex peptide' 1.8, 'pepdoc' 4.5, 'pepco peptides' 2.7 [VERIFIED: `SEO-AUDIT-CORRECTIONS.md` B10]
- Six raw `.mdx` clinic URLs are indexed (227 impr, 2 clicks); eleven `/calculator/` URLs are indexed but missing from the sitemap; calculator is the only section at 0% silent, and two calculator pages sit in the 15-page tier [VERIFIED: B11 + tier recompute]
- searchAppearance returns 0 rows — no rich result ever earned despite 100% JSON-LD coverage [VERIFIED: `SEO-AUDIT-CORRECTIONS.md`]
- Withheld (censored) GSC queries hold 103 of the 121 clicks at 0.414% CTR vs the visible set's 0.142% [VERIFIED: `SEO-AUDIT-CORRECTIONS.md`]
- 88 blog posts have resolving PMIDs but unaudited claims; the citation gate structurally cannot catch claim-mismatch [VERIFIED: this month's triage]
- Google ADC auth (custom OAuth client → impersonated SA) expires on a ~16-hour clock and is currently expired; Vercel token expired [VERIFIED: `.planning/GOOGLE-API-SETUP.md` + owner statement]
- `vercel.json` once declared 308 while the live response was 307 because a dashboard redirect pre-empted the file — the live redirect must be re-verified recurringly, not assumed from config [VERIFIED: `SEO-AUDIT-CORRECTIONS.md` A3]
- URL Inspection API quota ~2,000/day, 600/min [VERIFIED: script header comment; matches Google's published default]

## 2. Binding constraint

**Crawl budget at DR 3.3 on a <6-month domain** — Google's allocation, not content quality, decides what ranks. Every workstream here needs zero new pages and zero crawl budget, or protects/monitors the budget. Secondary operational constraint: **the measurement tooling does not yet have the dimensions its own evaluators need** (source, country, hostname; panel-based inspection) — so tooling is built first (WS1), and no evaluator in this PRD references a number its named command cannot produce. Tertiary: both Google and Vercel auth are expired; one 10-minute human action gates the measurement half.

## 3. Objective

Within 4 weeks of active work (verdict checkpoints at week 8, because Google moves on its own clock): (a) measurement tooling that can actually produce every number this PRD tracks; (b) a frozen, dated baseline with a bright line between July reference values and freshly measured ones; (c) the redirect question closed with the data already in hand; (d) first clicks on the 15-page live tier; (e) a longitudinal indexation monitor with a fixed panel and a CSV the script itself writes; (f) bot noise removed at source where cheap (localhost guard) and AI crawlers protected before any blocking ships; (g) an honest AI-citation report including the llms.txt fetch verdict; (h) a mobile audit with a defined, repeatable lab environment; (i) a conversion destination, so the traffic this PRD grows has somewhere to go.

## 4. Non-goals

- No new content pages, no new URLs. (Binding constraint. The conversion workstream edits existing templates only.)
- No blog citation remediation — PRD #1's scope. (WS6 feeds it a priority signal, nothing more.)
- No link building / DR growth.
- No paid tooling (Ahrefs MCP is plan-blocked).
- No country-level firewall blocks, ever. No ASN challenge rules until the measurement to detect friendly-fire exists (deferred inside WS5, not cut).
- No affiliate implementation — owner has approved it in principle; it needs its own PRD with FTC 16 CFR Part 255 treatment. Parked, not forgotten.
- No speculative "LLM SEO" beyond what server logs verify.
- No redirect-verdict tracking campaign (former WS2) — cut; see WS2 step 6 for the 15-minute closure.

---

## 5. Workstreams

### WS0 — Restore credentials [BLOCKED ON HUMAN]

**Objective:** Unblock every API-dependent workstream. **Effort:** 10 minutes of Lucas's time; the Google half recurs on a ~16-hour clock whenever pulls are needed.

Lucas runs, in PowerShell (plain `gcloud auth application-default login` is BLOCKED by Google's shared-client scope policy — use exactly this):

```powershell
& "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth application-default login --client-id-file="C:\Users\manci\.gcp\pepcodex-oauth-client.json" --scopes="https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/userinfo.email"
```

Sign in with the one account owning both GSC properties and the GA4 property (watch `authuser`). Then `vercel login`.

**Evaluator:** `npm run gsc:whoami` prints the impersonated SA identity; `vercel whoami` prints the account. Actual output of both pasted into `.planning/STATE.md`.
**Done-means:** Both succeed; output recorded.

---

### WS1 — Measurement tooling build [NEW — was implicit and unbudgeted in the draft]

**Objective:** Make the scripts able to produce the numbers the rest of this PRD tracks. The draft conflated "script exists" with "capability exists"; this workstream closes that gap before anything is measured.
**Effort:** 2 sessions. **Dependencies:** none to write the code; WS0 to test against live APIs.

**Build list (all repo work):**
1. **`scripts/ga4-pull.mjs` — three new reports:** `ga4-sources` (dimension `sessionSource` × `sessionMedium`, metrics sessions/engagedSessions/bounceRate/averageSessionDuration), `ga4-geo` (dimensions `country`,`city` × sessions/bounceRate), `ga4-hostnames` (dimension `hostName` × sessions). Plus an AI-referral block filtered to `chatgpt.com, chat.openai.com, perplexity.ai, claude.ai, gemini.google.com, copilot.microsoft.com`, printed and written as `ga4-ai-referrals.{json,csv}`. A referrer with zero rows is reported as zero, never omitted.
2. **New `scripts/gsc-index-monitor.mjs`** (leave the diagnose script as the one-off it is): reads a fixed panel from `.planning/data/index-panel.json` (20 www URLs — top hubs incl. `/peptides`, `/blog`, `/compare`, top dossiers, plus 10 known "Discovered – not indexed" pages from the July diagnosis), adds `--rotate=30` random silent URLs drawn from the **current** sitemap in `dist/` (not the frozen `crawl-baseline.json`) minus the impressioned set, and **the script itself appends** per-URL rows (`date,url,source[panel|rotate],verdict,coverageState,lastCrawlTime`) to `.planning/data/index-monitor.csv`. On auth failure it appends a single `date,BLOCKED-AUTH` row and exits nonzero. Panel is www-only: apex equity has already moved (184 impr/28d), so per-property routing for apex inspection is not built — recorded as a deliberate cut, not an oversight.
3. **New `scripts/check-redirect.mjs`:** requests `https://pepcodex.com/` and one deep apex URL, asserts status 308 and `location` on www, appends a dated row to `.planning/data/redirect-liveness.csv`, exits 1 on anything else. Wired into `npm run check`. Rationale: a Vercel dashboard redirect silently pre-empted `vercel.json` once already [VERIFIED: A3].
4. **gtag production-hostname guard** in the base layout: init only when `location.hostname === 'www.pepcodex.com'`. TRAP: Astro `define:vars` wraps inline scripts in an IIFE — a bare function declaration is not global; this exact bug killed all events until this month. Verify by grepping `dist/` for the guard and confirming the measurement id still has no trailing newline.

**Evaluator:** Each new report/script run once against live APIs with actual output pasted (row counts + first rows). `{ npm run build; echo "REAL_BUILD_EXIT=$?"; } > build.log 2>&1` and grep `REAL_BUILD_EXIT=0`; `npm run graph:check` exit 0; committed from inside the nested repo.
**Agent brief (self-contained):** Working dir `C:\Users\manci\OneDrive\Documents\00_Claude\peptide-library\.claude\worktrees\cool-heisenberg-e12770`. Build items 1–4 above. TRAPS: (1) content files and some configs are CRLF — verify every edit with an independent grep and paste the grep output; (2) never trust a wrapper exit code — capture the real one inside the log; (3) if live-API testing fails on auth, report "blocked: WS0 gcloud command needed" and deliver the code with a dry-run flag tested against the existing JSON fixtures — never fabricate API output. Fabricating a metric or a test result is the worst possible outcome.
**Done-means:** All four items merged; live smoke-test output (or an explicit BLOCKED-AUTH note) recorded in `.planning/STATE.md`.

---

### WS2 — Baseline freeze (and redirect-question closure)

**Objective:** One immutable, dated snapshot every later claim compares against — with a bright line between July reference values and today's measurements.
**Effort:** 1 session. **Dependencies:** WS0, WS1.

**Procedure:** run `npm run gsc:repull`, `npm run ga4:pull` (now with sources/geo/hostnames), `node scripts/gsc-index-monitor.mjs` (first panel run), `npm run build && npm run graph`, `node scripts/check-redirect.mjs`; copy outputs to `.planning/data/baselines/2026-08-DD/`; write `manifest.json` (command run, **date ranges as returned by the API — never as requested**, git SHA, sitemap count, graph metrics); commit from inside the nested repo. Baseline files are never edited afterward — corrections are a new dated baseline.

**Tracked-metric table — two columns, deliberately:**

| Metric | July 2026 reference (pre-308 pull — context only) | Measured this baseline (fill from commands; else NOT-MEASURABLE + missing capability) |
|---|---|---|
| Apex 28d clicks / impressions | 4 / 184 | — |
| www 28d clicks / impressions | 27 / 4,423 | — |
| Combined 28d clicks / impressions | 31 / 4,607 | — |
| Top-10 zero-click pages (merged, dedup) / impressions | 113 / 9,511 | — |
| Live priority tier / impressions | 15 / 5,450 | — |
| Silent pages / sitemap total | 923 / 1,221 (July frame — NOT comparable to 1,084 sitemap) | — (recompute both) |
| Fixed-panel: crawled within 30d (of 20) | [UNKNOWN — no panel existed] | — |
| GA4 sessions: google organic / chatgpt.com / other AI / Singapore / localhost | 233 / 264 / — / 5,410 / ~667 [UNKNOWN provenance] | — |
| Mobile click share / mobile-vs-desktop CTR | 67% / ~8x (confounded by bot desktop impr.) | — |
| Redirect liveness | 308 (verified at fix time) | — |

**Step 6 — close the redirect question (replaces the draft's entire 8-week WS2):** one paragraph in the baseline README recording: apex ran 184 impressions in its final pre-fix 28 days (vs 217 prior) while www ran 4,423 (vs 1,461) — consolidation onto www was substantially complete before the 308 shipped; no ~11,000/mo was stranded at fix time; the repo's own audit docs had already demoted the redirect [VERIFIED: recompute + INDEXATION-DIAGNOSIS.md line 140 + A3]. The only ongoing obligation is the `check-redirect.mjs` liveness assert (WS1 item 3), because the 307 regression mechanism (dashboard pre-emption) has fired once before. The draft's PROVEN/DISPROVEN evaluator is cut: its threshold was ambiguous by ~6x, its apex signal (a 92-impression swing) was inside GSC noise, and its PROVEN condition was already satisfied pre-fix — it could only have manufactured a false success.

**Agent brief:** Working dir as WS1. Run the commands, fill ONLY the right column. Verbatim rule: **if a command cannot produce a cell, write NOT-MEASURABLE and name the missing dimension or capability — never copy the left column into the right.** Record API-returned date ranges. Note in the manifest that GSC query data is censored (~33% of impressions). On auth failure: stop, report "blocked: WS0", fabricate nothing.
**Done-means:** Baseline directory committed; table's right column filled with real values or NOT-MEASURABLE; redirect-closure paragraph written; `.planning/STATE.md` updated.

---

### WS3 — CTR rescue: 15 live pages, plus the brand-SERP quick win

**Objective:** Earn first clicks from rankings already owned. Descoped from the draft's "121 pages / 3 sessions" to the tier the data supports: **15 live pages / 5,450 impressions**, ~62% of it in three pages.
**Effort:** 1 session (rewrites + brand fix) + a 15-minute week-8 check. **Dependencies:** none for the edits (the 2026-07-25 pull suffices to identify pages); WS2 for before/after measurement.

**Honesty box (from the repo's own corrections, `.planning/SEO-AUDIT-CORRECTIONS.md`):** (a) A4: title-length effects in our data are Simpson's-paradox artifacts — this workstream is a cheap bet, not a proven lever; (b) the withheld queries hold 103/121 clicks at 3x the visible set's CTR, so titles are being tuned against the visible third, which demonstrably converts worse — front-load the page's topic, not just its visible queries; (c) ceiling: ~5,450 impressions at a doubled CTR is roughly **18 clicks/month** — priced accordingly at one session, not three.

**Interventions:**
1. Title rewrites on the 15 live-tier pages (list from the 2026-08-17 recompute; **excludes** `/blog/semax-neuroprotection-stroke` and `/blog/2025-peptide-approvals-record` — both carry `noindex` holds for fabricated/unsalvageable claims, and making a fabrication more clickable is the nightmare outcome): ≤60 chars, topic front-loaded, one honest concrete differentiator ("evidence-graded", real study counts, year). No claim the page's cited sources don't support — content rules bind metadata.
2. Meta descriptions: 140–155 chars, one real number from the page, one scope statement.
3. Record each page's template group ({home, compare, calculator, guide} vs {peptides, glossary, blog, safety} per A5) in the tracking CSV so week-8 results can be read per group.
4. Brand SERP (B10): ensure homepage title/meta and `WebSite` JSON-LD `name`/`alternateName` naturally cover "PepCodex" and "peptide codex"; verify the site ranks #1 for its own name variants at week 8. ~30 minutes; 6 of www's 40 clicks are brand-recall misses.
5. SERP render check on 5 sample pages at week 8: is Google rewriting our titles? (Diagnostic either way.)

**Cut from the draft:** structured-data additions (searchAppearance = 0 rows despite 100% JSON-LD coverage — known-dead work [VERIFIED]); the edited-vs-control 2x-CTR evaluator (control set ≈ 2.6 expected clicks over the window — a ratio against ~2.6 expected events is noise, and undefined if control lands on 0).

**Evaluator (honest, low-power, stated as such):** Success = **≥5 of the 15 edited pages earn their first click within 8 weeks of the edit** (per-page GSC pull windowed post-edit) AND brand queries resolve to position 1. The unedited remainder's numbers are reported for context but no causal claim is made — the sample lacks power. If 0–1 pages click by week 8, record the negative result and stop; do not extend to more pages.
**Agent brief:** Working dir as WS1. Edit ONLY `title`/`description` frontmatter of the 15 listed files under `src/content/` (map URL→file via collection slug, never display name — 5 dossiers diverge: hcg, melanotan-i, mrna-4157, na-selank-amidate, na-semax-amidate). HARD EXCLUSION: any file whose frontmatter contains `robots` noindex — check each file before editing and log the check. TRAPS: (1) files are CRLF — a `\n`-anchored regex silently no-ops and reports success; after every edit run an independent grep for the new string AND absence of the old, and **paste the raw grep output per file** (a summary line is not acceptable — this repo has a recorded incident of an auditor claiming a check it never ran); (2) real build exit from inside the log; (3) `npm run graph:check` exit 0 before commit; commit from inside the nested repo. Record the edit date per page in the CSV. Never fabricate a title claim; when unsure, use the weaker phrasing.
**Done-means:** ≤15 pages edited with per-page grep evidence; brand fix shipped; build + graph green from the log; edit dates recorded; week-8 table written.

---

### WS4 — Indexation monitoring loop + index hygiene

**Objective:** A standing weekly monitor that detects regression and recovery mechanically, plus cleanup of the stray indexed URLs the draft ignored.
**Effort:** monitor is built in WS1 — this WS is the panel file + first runs (0.5 session) + 15 min/week; hygiene fixes 0.5 session. **Dependencies:** WS1 (script), WS0 (auth).

**Monitor:** weekly `node scripts/gsc-index-monitor.mjs --rotate=30` (50 inspections/week vs ~2,000/day quota [VERIFIED: script header]). Headline metric: **fixed-panel crawl rate** (of 20, how many have `lastCrawlTime` within 30 days) — chosen because `/peptides` proved inbound links alone don't buy a crawl. Graph half unchanged and already enforced: `graph:check` pre-commit, monthly `graph:compare`.

**Index hygiene (one-off, zero new URLs — removes junk URLs):**
- The six indexed raw `.mdx` clinic URLs: serve 308s to the canonical clinic URLs, or 410 if the canonicals are themselves deindexed — implemented in `vercel.json`/routing config, verified by `curl -sI` on all six, output pasted.
- The eleven indexed `/calculator/` URLs absent from the sitemap: add them (calculator is the only 0%-silent section and holds two tier pages — it earns its sitemap slots).

**Evaluator:** `index-monitor.csv` gains ≥4 weekly row-sets (a `BLOCKED-AUTH` row counts as a row — missed weeks are recorded, not interpolated); first monthly summary reports fixed-panel crawl rate, silent-count trend against the current sitemap, verdict distribution. Direction of success: Discovered-not-indexed share falling, panel crawl rate rising, over ~3 months — weekly noise is not signal. Hygiene: all six `.mdx` URLs return 308/410 (curl output pasted); calculator URLs present in the built sitemap (grep of `dist/` pasted).
**Agent brief:** Working dir as WS1. Build `.planning/data/index-panel.json` (20 www URLs per WS1 spec, chosen from `INDEXATION-DIAGNOSIS.md` + current `dist/` sitemap; exact live URLs, no trailing slash — `trailingSlash: 'never'`). Run the monitor; the CSV is written by the script — paste the console tally AND the last 5 CSV rows as proof they match. Hygiene edits per above with curl/grep evidence. On auth failure the script writes BLOCKED-AUTH — report it, never skip silently.
**Done-means:** Panel committed; ≥4 weekly runs in the CSV; hygiene shipped with evidence; first monthly summary written.

---

### WS5 — Bot filtering: ship the safe half now, defer the blocking half until it's measurable

**Objective:** Remove bot noise without harming the site's best traffic. The draft budgeted 1 session for what is really 3–4; this version ships the cheap safe parts now and gates the risky part on measurement that WS1 creates.
**Effort now:** covered by WS1 item 4 (gtag guard) + 0.5 session (allowlist) + ~20 min Lucas (GA4 UI). **Deferred phase:** 1–2 sessions, earliest 2 weeks after WS2. **Dependencies:** Vercel half on `vercel login`; GA4 admin on Lucas (UI-only, API scope is read-only).

**Ship now:**
1. gtag production-hostname guard (WS1 item 4) — kills the ~667 localhost sessions at source.
2. Vercel: verify the target is project **`mancinicreative-pepcodex`** via `vercel projects ls` + domain attachment (four projects exist; a dashboard edit already failed once on this exact confusion). Then ALLOWLIST rules only, highest priority: `Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, ClaudeBot, Claude-User, anthropic-ai` plus Vercel's verified-bot category where available. First post-login action: confirm the plan actually exposes ASN rules and verified-bot allowlisting [ASSUMED from Vercel's standard feature set — if not, fallback is user-agent rules, which are weaker; record which].
3. Lucas (GA4 Admin UI): define internal traffic IP; set the Internal Traffic filter from Testing to **Active**; confirm "Exclude known bots" on. Affects future data only — historical stays polluted; annotate.

**Deferred (explicitly not cut):** ASN Challenge rules. Preconditions: (a) `ga4-geo`/`ga4-sources` pulls live (WS1) so blast radius on chatgpt referral and Singapore volume is measurable weekly; (b) offending ASNs read from actual Vercel request logs. The draft's candidate ASN list is **deleted** — pre-naming plausible ASNs beside an instruction to find the real ones is an anchoring hazard. When shipped: Challenge not Deny; 7-day watch; rollback same-day if chatgpt referral or GSC crawl-stats fetches drop >10%.

**Evaluator (shipped half):** allowlist rules screenshot/config export with rule order visible; `dist/` grep showing the hostname guard; GA4 filter status Active (Lucas screenshot). **Evaluator (deferred half, when it ships):** 14 days after: Singapore sessions <500/mo, localhost 0, chatgpt referral within ±20% of trend, crawl fetches not down >10% — all four from the WS1-built pulls, none of which existed when the draft promised them.
**Agent brief (repo+CLI half):** Working dir as WS1. Verify project identity before ANY firewall change and paste `vercel projects ls` output. Allowlist only — shipping any Challenge/Deny rule in this phase is out of scope and must be refused. Report actual rule configuration as exported/screenshotted, not from memory.
**Done-means:** Guard + allowlist live with evidence; GA4 filters Active; deferred phase's preconditions written into `.planning/STATE.md` as the gate.

---

### WS6 — AI-citation channel: measure honestly, and point PRD #1 at the right pages

**Objective:** The chatgpt.com referral is (per the one-off analysis [UNKNOWN provenance]) the site's best-quality channel. Build reproducible measurement, settle the llms.txt question with logs, and cross-check what AI actually lands on against the unaudited-claims list.
**Effort:** 0.5 session (reporting on WS1's tooling) + monthly. **Dependencies:** WS1 (ga4-sources), WS0/WS5 (`vercel login` for the log half).

**Bright line maintained:**
- KNOWN once WS1 lands: AI-referral sessions/engagement by source, from `ga4-ai-referrals` — **first pull must attempt to reconcile the 264-session figure; if it differs, report the discrepancy and adopt the reproducible number as baseline.**
- KNOWABLE (blocked on vercel login): whether GPTBot/ClaudeBot/PerplexityBot fetch the site, which paths, and whether `/llms.txt` or `/llms-full.txt` is EVER requested — from Vercel request logs by user-agent. Falsifiable claim on record: "AI crawlers fetch llms.txt." First pull settles it.
- SPECULATED: that llms.txt influences citations — no provider documents consuming it. No further llms.txt investment until logs show fetches; if 2 monthly pulls show zero fetches, stop maintaining freshness as a priority and record the negative result.

**The cross-check the draft missed:** join `ga4-ai-referrals` landing pages (and AI-crawler top-fetched paths, once logs are readable) against the 88 unaudited-claims posts and the 34 needs-rewrite list. Any overlap = a page AI currently cites whose claims nobody has verified — the nightmare scenario — and becomes PRD #1's top of queue. ~20-minute join; only this PRD has the traffic side.

**Evaluator:** Monthly report: AI-referral sessions by source (zeros reported as zeros), landing-page list, crawler fetch counts, llms.txt verdict (yes/no + count), and the overlap list handed to PRD #1. Growth signal: any month >350 sessions (against whatever the reconciled baseline is).
**Agent brief:** Working dir as WS1. Report only from `ga4-ai-referrals` output and Vercel logs — never from GA4 topline (~91% bot) and never from the draft's unreproducible 264. Paste the actual output block. Blocked halves reported as blocked with the unblocking command.
**Done-means:** First monthly report written with reconciliation note, llms.txt verdict (or blocked note), and the PRD #1 overlap list.

---

### WS7 — Mobile UX audit

**Objective:** 67% of clicks are mobile and mobile UX has never been examined. Judge mobile on its own merits (the 8x CTR ratio is confounded by bot-inflated desktop impressions — not evidence of quality).
**Effort:** 2–3 sessions (the draft's 1–2 ignored Lighthouse setup and screenshot volume). **Dependencies:** none — starts day 1.

**Defined lab environment (the draft had none, making its ≥85 bar meaningless):** `npx lighthouse@12` pinned, `--form-factor=mobile` with default mobile screen emulation and default `simulate` throttling, **median of 3 runs per page**, Lighthouse version + machine recorded in the findings file. Scores are used comparatively (before/after fixes) and against the bar with the lab-only caveat stated.
**Scope:** 4 templates ≈ 95% of URLs — dossier, blog, comparison, home/hub. 2 exemplars each (chosen by collection slug, not display name), against built output via `npm run preview` (never the dev server).
1. Lighthouse runs: performance/accessibility scores, LCP/CLS/INP, tap-target and font-size failures.
2. Manual 375px pass in the browser pane: horizontal scroll, sticky overlap, table overflow (dossiers are table-heavy — prime suspect), consent-banner obstruction. Screenshot every defect; a claimed pass requires the screenshot too.
3. CrUX: **cut from the critical path.** It needs an API key the project doesn't have (the ADC/impersonation path doesn't cover it), and at ~47 organic sessions/month the origin is almost certainly below threshold [ASSUMED]. If Lucas creates a free key (~2 min) it's one call; otherwise record "skipped: no key; origin likely below threshold" and rely on lab data, saying so.

**Evaluator:** Findings table: template × {LCP, CLS, INP, tap-target P/F, horizontal-scroll P/F, defects+screenshots, LH version}. Hard bars: **zero horizontal scroll at 375px on all 4 templates** and tap-target pass; performance ≥85 (median-of-3, pinned version) as a lab-only target. Every defect fixed (if CSS/template-cheap) or ticketed with hours.
**Agent brief:** Working dir as WS1. Build with real-exit-capture, `npm run preview`, audit the 8 exemplars per the environment spec. Fixes limited to template/CSS — never content claims. Fix commits need `graph:check` exit 0 + real build exit from the log. "No defects" requires the passing screenshots. Report the table with actual numbers; never report a score you did not run.
**Done-means:** `.planning/MOBILE-AUDIT.md` committed with the table, screenshots, environment spec; cheap fixes shipped and verified; remainder ticketed.

---

### WS8 — Conversion destination [NEW — was the draft's largest omission]

**Objective:** Give the traffic somewhere to go. `SEO-AUDIT-CORRECTIONS.md` B7 calls this "the largest strategic omission" — PepTracker appears nowhere outside legal boilerplate, and the newsletter's zero completions were recorded while ALL events were dead, so nobody knows if the form even works. Both owner decisions ("PepTracker funnel is a goal"; "fix before growing") already exist. Zero new pages; template edits only — passes the crawl-budget constraint that selected every other workstream.
**Effort:** 2 sessions. **Dependencies:** none for the template work; WS1's working gtag for event verification.

1. **PepTracker funnel:** add an honest, clearly-labeled PepTracker CTA to the dossier template and home page (the templates behind the pages that actually earn clicks). No fabricated app claims; link to the real listing/landing destination Lucas confirms. [Destination URL: confirm with Lucas — the app's store status is [UNKNOWN] to this PRD.]
2. **Newsletter diagnosis:** test the form end-to-end with a real test submission. The "24 form_start / 0 completions" record predates the gtag fix and is unreliable [VERIFIED corollary] — the form may work fine, may be broken; find out, fix if broken.
3. **Conversion events:** now that gtag actually fires, register `peptracker_click` and `newsletter_submit` as GA4 key events so this PRD's channels can finally be judged on conversions, not sessions.
4. **Affiliate:** approved in principle by owner; parked to its own PRD (FTC disclosure design is not a side-quest). One line in STATE.md so it isn't lost.

**Evaluator:** CTA present in built output (grep of `dist/` pasted) and live (curl); test submission succeeds end-to-end with the confirmation observed; both events visible in GA4 Realtime during the test (screenshot); `graph:check` exit 0 (new internal links must resolve).
**Agent brief:** Working dir as WS1. Template edits only — no content-claim changes, no new pages. Every link must mirror real routes (trap: `/protocols/undefined` shipped once from a hand-derived URL). CRLF grep-verification per edit with output pasted. The PepTracker destination URL comes from Lucas — if unconfirmed, build behind a single constant and report blocked on that one string; do not invent a store URL.
**Done-means:** Funnel live with evidence; form verdict (works/fixed) with test proof; events firing; affiliate parked in writing.

---

## 6. Sequence

```
Day 1:    WS0 [BLOCKED ON HUMAN: gcloud + vercel login — 10 min, gates half the plan]
          WS3 rewrites (needs no auth) · WS7 audit starts (needs no auth)
Week 1:   WS1 tooling build (code needs no auth; live smoke-test after WS0)
Week 2:   WS2 baseline freeze + redirect closure · WS4 panel + first run + hygiene
          WS5 safe half (guard, allowlist, GA4 UI) · WS8 conversion build
Week 3–4: WS6 first AI-channel report + PRD-#1 overlap list · WS7 completes
          WS4 weekly runs continue (15 min/wk)
Week 8:   Checkpoints on Google's clock: WS3 first-click verdict · WS4 first monthly
          summary · WS5 deferred-phase go/no-go (preconditions met?)
```

Active work compresses to ~4 weeks (the reviewer's cut is accepted); the week-8 checkpoints remain because GSC outcomes move on Google's schedule, not ours. Dependency spine: **WS0 → WS1 → {WS2, WS4-monitor, WS5-deferred, WS6}**; WS3, WS7, WS8 start day 1.

## 7. Falsifiers — what kills each bet, and when to quit

- **WS3:** 0–1 of 15 pages clicked by week 8 → titles are not the constraint (consistent with A4's prior); record the negative result, do not extend to the remaining 98 zero-click pages.
- **WS4:** 3 monthly summaries with flat panel crawl rate while graph metrics stay perfect → internal structure is exhausted as a lever; the remaining lever is external (DR), out of scope — say so and stop tuning internals.
- **WS5 (deferred phase, if shipped):** chatgpt referral or crawl fetches down >10% within 7 days → roll back same-day; the noise is cheaper than the loss.
- **WS6:** 2 monthly log pulls with zero llms.txt fetches → stop prioritizing llms-full freshness; record the negative. AI-referral reconciliation failing badly (real number <100/mo) → the "best channel" narrative was an artifact; re-rank channel priorities honestly.
- **WS8:** if the PepTracker destination cannot be confirmed within 2 weeks, ship the newsletter half alone and mark the funnel blocked-on-Lucas — do not invent a destination.
- **Plan-level:** WS0 blocked >2 weeks → the measurement half is dead on the vine; escalate to Lucas as the single highest-leverage 10 minutes available.

## 8. Risks

1. **Attribution soup:** five significant changes shipped the same week in August. No claim of the form "X worked" gets made without a change-specific signal; everything else is labeled [ASSUMED]. (This risk already claimed one victim: the draft's redirect-verdict design, which would have attributed a pre-existing trend to the 308.)
2. **Fabrication under done-means pressure:** the draft's baseline table pre-filled the answers next to a "fill the table" requirement, and three cells were unmeasurable by the named command — a walk toward copied numbers stamped "measured." Mitigated structurally: two-column table, NOT-MEASURABLE rule verbatim in the brief, WS1 building the capabilities first, raw command output required as evidence throughout, and the recorded local incident (an auditor claiming a comparison it never ran) cited in the briefs that batch-edit files.
3. **Auth friction becomes abandonment:** ~16-hour Google clock. Mitigation: batch pulls weekly; BLOCKED-AUTH rows keep the record honest; blocker surfaced at session open per dispatch protocol.
4. **Firewall friendly-fire:** mitigated by allowlist-first, the deferred-phase measurement gate, Challenge-not-Deny, and the project-identity check (`mancinicreative-pepcodex`).
5. **Ceiling honesty:** WS3's addressable base is 5,450 impressions ≈ ~18 clicks/month at a doubled CTR — priced at one session. The real click upside this cycle is WS8 giving existing clicks somewhere to convert, and indexation recovery, which moves on Google's clock.
6. **CRLF silent no-op:** the batch-edit shape that has bitten three times. Per-edit independent grep with pasted output is a hard requirement in every editing brief.

## 9. Open questions

1. Which ASNs actually source the Singapore traffic? [UNKNOWN — first Vercel log read answers it; no Challenge rule ships before then, and no candidate ASNs are named anywhere in this PRD]
2. Does anything fetch llms.txt? [UNKNOWN — first log pull; falsifiable claim on record]
3. Does the reproducible GA4 source pull reconcile the 264-session chatgpt figure? [UNKNOWN — WS6 first report]
4. Does the newsletter form actually work? [UNKNOWN — its failure record predates the gtag fix; WS8 tests it]
5. What is the PepTracker funnel destination URL? [Lucas — gates WS8 item 1]
6. Does the Vercel plan expose ASN rules and verified-bot allowlisting? [ASSUMED yes — verify immediately after `vercel login`; fallback is user-agent rules]
7. Consolidate GSC into a Domain property to end split measurement? [Decision for Lucas — park until after the WS2 baseline lands so the frame stays stable; the apex property is now near-dormant (184 impr/28d), which lowers the cost of waiting]

---

## Appendix — reviewer findings kept vs. rejected

Adopted in full: WS2 cut (three independent reasons all reproduced from repo data); WS3 descope to 15 pages with noindex exclusion and control-group evaluator removed; structured-data step cut; WS1 two-column table + NOT-MEASURABLE rule; tooling gap promoted to its own workstream; ASN candidate list deleted; BLOCKED-AUTH rows; script-written CSV; conversion destination, brand SERP, .mdx/calculator hygiene, 308 liveness check, and the unaudited-88 cross-check added; effort estimates corrected in both directions.

Rejected (with reason): the flat "cut to 4 weeks" is only partially adopted — active work is 4 weeks, but week-8 checkpoints remain because GSC outcomes lag on Google's schedule regardless of our effort. The reviewer's note that the ~2,000/day Inspection quota claim survives was confirmed and kept as-is.
