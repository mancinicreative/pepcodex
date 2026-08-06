# Corrections to the SEO audit — what the adversarial review overturned

*2026-07-24 · Produced by 3 independent contrarian agents auditing `SEO-AUDIT-FINDINGS.md`,*
*`SEO-GROWTH-STRATEGY.md`, `SEO-IMPROVEMENT-PLAN.md` against the same raw data.*

**Read this before acting on any of the other three documents.** Several load-bearing
conclusions did not survive scrutiny.

---

## A. Factual errors in the earlier documents

### A1. "16 months" is wrong — the window is **5.8 months**
GSC returned **177 days**: apex from 2026-01-27, www from 2026-05-28 (56 days). I requested 16
months; Google returned everything it had, which was less. Every "16mo" label and every
per-month figure derived by dividing by 16 is **~2.7x wrong**.

**Strategic consequence:** the site has **under six months of index history** and sits inside
Google's normal new-domain assessment period. Pronouncing "authority is the ceiling, reposition
the content strategy" on that basis is premature.

### A2. The query analysis used a **33% censored sample** presented as complete
- Query-dimension export totals **12,703** impressions.
- Page-dimension export totals **38,772** impressions.
- GSC withholds low-volume/rare queries for privacy. **67% of impressions are on queries never in the file.**

**This guts the central thesis.** "Median 1 impression per query", "2,800 unique queries",
"your top-10 profile is worth only 1,635 impressions", "you rank for queries nobody searches" —
all computed on the censored third. Worse: **the withheld set holds 103 of the 121 clicks at
0.414% CTR — 2.9x the visible set's 0.142%.** Whatever earns your clicks was invisible to the
cut I built the diagnosis on.

### A3. The apex→www redirect fix is a **no-op**
`vercel.json` **already declares `statusCode: 308`**, and it is committed in HEAD. The live 307
comes from **Vercel's dashboard domain-redirect**, which pre-empts `vercel.json`.
**This is an owner action in the Vercel dashboard, not a code change.** My "highest-leverage
single change" would have changed nothing.

### A4. The title-length finding is **Simpson's paradox**
- Crude: long-title pages look 3x worse (OR 0.34, p<1e-4).
- **Stratified by section: they look 1.9x better** (Mantel-Haenszel OR 1.894). `/compare/`
  long-title pages run 2.258% vs 0.936%.

**Honest conclusion: this data cannot detect a title-length effect in either direction.** The
apparent effect was section confounding. The title change is still defensible as general SERP
hygiene, but **must not be sold as a CTR win.**

### A5. "/blog/ is the worst section" is **not statistically supported**
`/blog/` 0.00% vs `/peptides/` 0.08%: Fisher p = 0.0367, which **fails** the Bonferroni threshold
(1.8e-3) implied by 28 pairwise comparisons; the confidence intervals overlap. Likewise
`/compare/` vs `/calculator/` p = 0.86 and `/peptides/` vs `/glossary/` p = 0.44.

The data supports only a **two-group split** — {home, compare, calculator, guide} vs
{peptides, glossary, blog, safety} — **not** the 8-way ranking table I published. Calling the
dossiers "working" and the glossary "a net liability" when their CTRs are statistically identical
was the sharpest logical break in the documents.

### A6. I dismissed the zero-click anomaly using a **statistical error**
I wrote "at 5-16 impressions per query, zero clicks is statistically unremarkable." That is
wrong — CTR is a **per-impression rate**; spreading impressions over more queries does not lower
it. Recomputed by position band: pos 1-3 **3.59%** · 3-5 **3.15%** · 5-8 **0.26%** ·
**8-11: 0.00% on 1,087 impressions**. That last one is genuinely anomalous and remains unexplained.

### A7. "Technically clean / 0 canonical mismatches" was an artifact of my own crawler
`crawl-site.mjs` seeds from the sitemap, so it can only ever see sitemap URLs. It was
**structurally blind** to indexed URLs the sitemap omits.

---

## B. What was missed entirely

### B1. **76% of the site has never earned a single impression**
**923 of 1,221 pages.** Only **27 of 102** dossiers (26%) and **38 of 279** `/compare/` pages
(14%) have ever surfaced in Google. `/clinics/` 90% silent.

**This invalidates my #1 recommendation.** "Build more comparison pages" prescribes scaling a
system with an **86% failure rate that was never diagnosed.** The question is not *make more* —
it is *why can't Google see the ones you have?*

### B2. **Mobile is 67% of your clicks — I never pulled the device dimension**

| Device | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| **Mobile** | **81** | 7,836 | **1.03%** | ~17-22 |
| Desktop | 39 | 29,537 | **0.13%** | ~26-38 |

The headline "0.31% site-wide CTR" is a **desktop-bot-weighted average**. Your real audience
converts **~8x better** and ranks 9-15 positions higher. Mobile UX was never examined.

### B3. **Trailing-slash duplicate index — the largest technical fact in the dataset**
Google has indexed **both** `/path` and `/path/` for **178 URL pairs**. The 189 trailing-slash
URLs hold **24,300 impressions — 62.7% of the site's total** — and 26 of 121 clicks.
The sitemap contains **zero** trailing-slash URLs. So the sitemap declares the wrong URL form for
the pages that actually earn impressions. That is the first-order sitemap problem; missing
`lastmod` is second-order.

### B4. **AI assistants are already your #1 non-Google source**
- **chatgpt.com: 264 sessions** (157 "Unassigned" + 72 referral + 35 ai-assistant)
- google/organic: 233 sessions
- ChatGPT referral: **40% bounce, 327s average — the best-quality traffic on the site**
- ~285 AI sessions total including perplexity, doubao, coze, yuanbao, notebooklm

**The site already ships `llms.txt` and a 200KB `llms-full.txt` with a "How to Cite PepCodex"
section.** I treated AI purely as a disintermediation threat and never noticed the channel was
already built and working. A WAF rule aimed at "Direct" traffic would have been its first casualty.

### B5. **~667 GA4 sessions are your own localhost dev server**
`pageReferrer` shows `http://localhost:4321/` (340 sessions), `localhost:4322/peptides` (102),
`localhost:4321/peptides/bpc-157` (95), and more. `PUBLIC_GA_TRACKING_ID` is live in local dev
with no internal-traffic filter. Part of the "bot" traffic is self-inflicted and trivially fixed.

### B6. **The bots now have a fingerprint — and it's filterable today**
GA4 by country: **Singapore 5,410 sessions (62% of all traffic) at 97% bounce**, China 763 at
96%, Germany 353 at 95%; United States only 803. **GSC shows no Singapore at all** (USA 15,207
impressions, GBR 5,668). Plus Android Webview: 153 sessions, 99% bounce, 1.3s.

I asserted "bots" correctly but never identified them. Caveat the reviewer raised fairly:
consent-denied users also produce a high-bounce signature, so geo is the sound discriminator.

### B7. **The site has no conversion destination — the largest strategic omission**
`grep -rniE 'peptracker|apps.apple|play.google' src/` returns **only** `privacy.astro` and
`terms.astro`. The companion app appears solely in legal boilerplate. There is **no funnel** from
1,221 pages of research content to anything.

The newsletter form (in every layout) recorded **24 `form_start` events and zero completions** in
six months.

**The plan optimised traffic acquisition for a site with nothing for traffic to do.**

### B8. **The GLP-1 comparison recommendation is contradicted by your own data**
Sorting all 49 comparison pages with GSC data by position gives an unmissable rule: **every
top-ranking page compares two compounds mainstream health media does not cover** —
kristagen-vs-thymalin (3.3), cagrilintide-vs-survodutide (3.5), ll-37-vs-lactoferricin (3.5),
cardiogen-vs-ventfort (4.3), ovagen-vs-svetinorm (4.9), cortexin-vs-pinealon (5.9).

I recommended building semaglutide/tirzepatide/retatrutide comparisons — **the most
media-saturated compounds that exist.** Your data says the opposite: you win where big media
isn't.

### B9. "DR 3.3 is the hard ceiling" is **overstated**
At DR 3.3 the site holds **positions 3.3-7.7 on roughly twenty comparison pages.** Authority is
clearly sufficient to rank top-5 where no authoritative competitor exists. In those niches the
binding constraint is **demand, not authority** — conflating the two produced the "build
backlinks, slow and non-optional" platitude.

### B10. Brand SERP is not owned
Zero queries containing "pepcodex" appear in 2,857 rows, but brand-*recall* variants do and they
all convert: "peptide codex" (4 clicks, pos 4.4), "codex peptide" (pos 1.8), "pepdoc" (pos 4.5),
"pepco peptides" (pos 2.7). **Six of the www property's 40 clicks — 15% — are people trying and
failing to remember your brand name.**

### B11. Indexed URLs the sitemap omits
- **Six raw `.mdx` source files are indexed and receiving traffic**: `/clinics/{scottsdale,
  san-diego,honolulu,st-louis,irvine,pittsburgh}.mdx/` — 227 impressions, 2 clicks.
- **Eleven `/calculator/` URLs are indexed but absent from the sitemap** (e.g.
  `/calculator/reconstitution/igf-1-lr3` at 199 impressions).
- **Ten indexed URLs return live 404s.**
- `searchAppearance` returns **zero rows** — no rich result has ever been earned despite 100%
  JSON-LD coverage. 612 pages including all 155 blog posts carry no page-entity schema.

### B12. Internal linking was mis-measured
"Median 61 internal links, no orphans" counted **outbound** links inflated by repeated nav
markup. In reality **29 pages have zero inbound links and 487 (40%) have ≤2.**

### B13. Half of organic traffic is non-Google and unexamined
GA4 Organic Search = 245 sessions vs GSC = 121 clicks. Bing/DDG/Brave/Yandex are never mentioned.
"Our organic problem is a Google CTR problem" was asserted without checking the other half.

---

## C. What survives

- The site is **technically sound on the pages Google does see** (0 non-200 among sitemap URLs,
  schema present, no noindex leaks).
- **Engagement from real humans is genuinely good** — organic 44% bounce, duration rising
  49s → 244s; ChatGPT referrals 327s.
- **The glossary is bot-dominated and earns almost nothing** (though "worse than dossiers" is not
  statistically supported).
- **The custom GA4 events were genuinely broken** — root cause confirmed and fixed (Astro's
  `define:vars` IIFE meant `window.gtag` never existed; every event guard bailed).
- Traffic is small in absolute terms and the site is early-stage.

---

## D. Revised priorities

**Diagnose before prescribing. The old plan scaled things that were never diagnosed.**

1. **Why are 923 pages invisible?** (B1) — indexation is the actual bottleneck, not CTR.
2. **Fix the trailing-slash duplicate index** (B3) — 62.7% of impressions on URLs the sitemap
   doesn't declare.
3. **Filter localhost + Singapore/China bot traffic in GA4** (B5, B6) — cheap, makes data usable.
4. **Build a conversion destination** (B7) — otherwise traffic work is pointless.
5. **Mobile-first everything** (B2) — 67% of clicks, 8x better CTR, never examined.
6. **Lean into the AI-citation channel** (B4) — already the #1 non-Google source, already built.
7. **Own the brand SERP** (B10) — 15% of clicks are failed brand recall.
8. **More obscure-compound comparisons, not GLP-1** (B8) — follow the data.
9. Re-pull GSC with the **device and search-appearance dimensions**, and label windows honestly (A1).

**Demoted:** title-length work (A4 — no detectable effect), the 307 edit (A3 — no-op; do it in the
Vercel dashboard instead), "build backlinks" as a headline strategy (B9).
