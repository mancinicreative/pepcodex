# PepCodex SEO Findings — 16 months of Search Console + full site crawl

*2026-07-24 · Data: GSC API (both properties, 2026-01-27 → 2026-07-22) + crawl of all 1,221 URLs*
*Raw data: `.planning/data/gsc-*.csv`, `crawl-baseline.csv`*

## Headline

**The site is recovering, not dying — but it converts impressions to clicks terribly.**

| | Clicks | Impressions | CTR |
|---|---|---|---|
| Combined, 16mo | 121 | 38,772 | **0.31%** |

0.31% is roughly 5-10x below what these ranking positions should yield.

---

## 1. The impressions collapse PREDATES the www migration

I previously suspected the May domain migration caused the traffic loss. **That was wrong.**

| Month | apex impr | www impr | Total | Clicks |
|---|---|---|---|---|
| 2026-01 | 3,098 | 0 | 3,098 | 0 |
| 2026-02 | 14,847 | 0 | **14,847** | 19 |
| 2026-03 | 9,664 | 0 | 9,664 | 17 |
| 2026-04 | 2,935 | 0 | **2,935** | 21 |
| 2026-05 | 827 | 254 | 1,081 | 18 |
| 2026-06 | 185 | 1,721 | 1,906 | 17 |
| 2026-07 | 148 | 3,909 | **4,057** | **29** |

The −80% collapse ran **Feb → Apr**, finishing *before* the www handoff began 2026-05-28.

**And clicks tell the opposite story from impressions.** July has the **most clicks of any
month (29)** on a quarter of February's impressions. CTR went 0.13% (Feb) → 0.71% (Jul).

Reading: February's impression spike was largely **junk** — see §3. Losing it cost almost
nothing. The site is now trending up on the metric that matters.

## 2. The apex → www migration is working, but the redirect is wrong

Daily data shows a clean handoff starting 2026-05-28 (apex declining, www climbing). That part
is healthy.

**The problem:** apex → www is a **`307 Temporary Redirect`**. A 307 tells Google *"this move is
temporary, don't transfer authority."* Two months on, both properties remain alive and authority
stays split.

**Fix: change it to `301`/`308` (permanent).** Highest-leverage single change available.
On a site with Domain Rating 3.3, consolidating what little authority exists matters a lot.

## 3. The glossary generates worthless impressions

Top queries by impressions, with their ranking position:

| Query | Impressions | Clicks | Position |
|---|---|---|---|
| gene expression | 331 | 0 | **78.6** |
| zepbound for sleep apnea | 173 | 0 | 77.6 |
| what is gene expression | 159 | 0 | 78.0 |
| autophagy | 139 | 0 | **79.6** |
| gmp certified | 126 | 0 | 74.7 |
| telomerase | 121 | 0 | 51.5 |
| oxidative stress | 97 | 0 | **90.3** |
| pharmacokinetics | 79 | 0 | 87.8 |

Generic scientific terms, ranked **position 70-90** (page 8-9). They can never earn a click, they
drag site-wide CTR down, and they compete against Wikipedia and NIH — unwinnable, and off-mission.

216 glossary pages, **82% with truncated titles**. This section needs a strategy decision, not
just a title fix: either target peptide-specific long-tail intent, or `noindex` the generic terms.

## 4. Page-1 rankings that earn nothing — the real anomaly

| Page | Impressions | Position | Clicks |
|---|---|---|---|
| /peptides/semax/ | 1,686 | **7.9** | 0 |
| /blog/semax-neuroprotection-stroke/ | 1,133 | **8.2** | 0 |
| /safety/kpv-safety/ | 842 | **6.9** | 0 |
| /peptides/tesamorelin/ | 829 | 8.9 | 0 |
| /peptides/ghk-cu/ | 494 | 8.5 | 0 |

Position 7-9 is page one. Those should convert at 1-2% minimum. Getting **zero** clicks on 1,686
impressions is abnormal and points at the snippet — title, description, or intent mismatch — not
at ranking.

Aggregate: positions 4-10 hold **19,210 impressions but only 96 clicks (0.50% CTR)**.

## 5. Striking distance — the cheapest wins

Position 11-20, i.e. bottom of page 2. Small gains move these onto page 1:

| Page | Impressions | Position |
|---|---|---|
| /blog/semaglutide-vs-tirzepatide-2026 | 985 | 12.2 |
| /peptides/kisspeptin/ | 378 | 13.2 |
| /compare/ghrp-2-vs-ghrp-6/ | 338 | 18.2 |
| /glossary/secretagogue/ | 253 | 13.9 |
| /blog/cagrilintide-semaglutide-approval/ | 233 | 13.3 |
| /safety/tesamorelin-safety/ | 220 | 10.8 |

72 pages sit in this band with 5,597 impressions and **4 clicks total**.

## 6. Crawl: technically clean, one systemic content flaw

All 1,221 URLs: **0** non-200, **0** canonical mismatches, **0** noindex leaks, **0** missing
titles/descriptions/H1s, **100%** carry JSON-LD, 1 thin page, no orphans (median 61 internal links).

The single flaw: **570 titles exceed 60 characters** and get truncated in results.
**91% (521) are fixed by dropping the `" | PepCodex"` suffix** — one conditional in
[BaseLayout.astro:48](src/layouts/BaseLayout.astro:48). Only 49 need hand-rewriting.

| Section | Overlong | Fixed by suffix drop | Need rewrite |
|---|---|---|---|
| /glossary/ | 178 | 174 | 4 |
| /peptides/ | 176 | 138 | 38 |
| /compare/ | 142 | 142 | 0 |
| /safety/ | 31 | 26 | 5 |

Given §4 — page-1 rankings earning zero clicks — truncated titles are a prime suspect.

Also: `/glossary/off-label` and `/glossary/off-label-use` share an identical title and compete.

---

## Ranked actions

1. **Change apex→www from 307 to 301.** Config-level, consolidates authority. (§2)
2. **Conditional title suffix.** One line, fixes 521 pages, directly targets the CTR problem. (§6)
3. **Rewrite the 49 remaining long titles**, prioritising the page-1-zero-click pages in §4.
4. **Decide the glossary strategy** — 216 pages ranking 70-90 on generic terms. (§3)
5. **Add `<lastmod>` to the sitemap** — currently absent on all 1,221 URLs, so Google has no
   recrawl priority signal.
6. **Work the striking-distance list** in §5.
7. **Consider a Domain property** (`sc-domain:pepcodex.com`, DNS-verified) to unify reporting.

---

# GA4 findings (property 521749549) — these change the diagnosis

## 7. 91.5% of your analytics is bot traffic

| Channel | Sessions | Bounce | Share |
|---|---|---|---|
| **Direct** | **7,952** | **92%** | **91.5%** |
| Organic Search | 245 | 44% | 2.8% |
| Unassigned | 234 | 79% | 2.7% |
| Referral | 189 | 38% | 2.2% |
| AI Assistant | 36 | 58% | 0.4% |
| Organic Social | 35 | 60% | 0.4% |

Direct traffic by month, with quality:

| Month | Direct sessions | Avg duration | Bounce |
|---|---|---|---|
| 2026-03 | 169 | 4s | 96% |
| 2026-04 | **2,081** | **1s** | **99%** |
| 2026-06 | 1,926 | 10s | 92% |
| 2026-07 | 1,631 | 10s | 87% |

**2,081 sessions at a 1-second average with 99% bounce is not human.** Desktop accounts for
7,909 sessions vs 813 mobile — inverted for a consumer health site, another bot tell.

**Consequence: every headline GA4 number is meaningless until this is filtered.** Real human
traffic is roughly Organic + Referral + Social + AI ≈ **505 sessions over 16 months**, not 8,691.

## 8. Organic traffic never collapsed — and its quality is climbing sharply

| Month | Organic sessions | Avg duration | Bounce |
|---|---|---|---|
| 2026-02 | 35 | 110s | 60% |
| 2026-03 | 35 | 49s | 29% |
| 2026-04 | 46 | 79s | 24% |
| 2026-05 | 48 | 183s | 63% |
| 2026-06 | 31 | 207s | 39% |
| 2026-07 | 47 | **244s** | 49% |

Organic sessions have been **flat at 31-48/month all year** while impressions fell 80%. And
average session duration went **49s → 244s, a 5x rise**.

**This settles §1's open question.** The February impression spike was Google sampling a new
site on generic terms it was never going to rank for. When those impressions evaporated, real
traffic did not move — because they were never sending anyone. A 4-minute average session is
strong engagement for research content.

**The problem is not decline. It is scale.** ~47 organic sessions/month is the real number.

## 9. The custom analytics events are not firing

`src/scripts/analytics.ts` defines `search`, `comparison_click`, `newsletter_signup`,
`external_link_click`, and `scroll_depth`. **None appear in GA4.** The only events recorded are
GA4's own enhanced measurement:

```
page_view 10274 · session_start 8584 · first_visit 8276 · user_engagement 3603
scroll 907 · click 30 · form_start 24 · view_search_results 2
```

So conversion and interaction tracking is currently blind. Needs debugging separately
(the base gtag tag itself loads fine — verified in production HTML).

## 10. Pages where real users engage

| Landing page | Sessions | Bounce | Avg duration |
|---|---|---|---|
| /peptides/slu-pp-332 | 51 | 65% | **246s** |
| /peptides/bpc-157 | 98 | 60% | 165s | 
| / | 903 | 64% | 114s |
| /peptides/semax | 44 | 73% | 99s |
| /peptides | 154 | 40% | 122s |

Versus glossary pages that look purely bot-driven — `/glossary/dalton` (74 sessions, **100%**
bounce, **0s**), `/glossary/molecular-weight` (68, 99%, 0s), `/glossary/ic50` (47, 100%, 0s).

The dossiers work. The glossary does not — corroborating §3 from an independent data source.

---

## Revised priorities

1. **Filter bot traffic in GA4** — until then no behavioural metric can be trusted.
2. **307 → 301** on apex→www. (§2)
3. **Conditional title suffix** — 521 pages, targets the CTR bottleneck. (§6)
4. **Glossary strategy decision** — now confirmed by two independent sources. (§3, §10)
5. **Fix the dead custom events** — currently blind to conversions. (§9)
6. Rewrite the 49 remaining long titles, prioritising §4's page-1-zero-click pages.
7. Sitemap `<lastmod>`; striking-distance work (§5).

## Reframed summary

The site is **not in decline** — it is **small, technically sound, genuinely engaging to the few
who find it, and buried under bot noise that hides all of the above.** The bottleneck is
converting 38,772 impressions into more than 121 clicks.
