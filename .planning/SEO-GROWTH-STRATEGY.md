# PepCodex — What's actually limiting traffic, and what to do

*2026-07-24 · Derived from 16mo GSC (both properties), GA4 property 521749549, full 1,221-URL crawl*
*Companion to `SEO-AUDIT-FINDINGS.md`*

## Correction to the earlier finding

I previously wrote that CTR was the bottleneck and implied fixing titles could multiply traffic.
**The query-level data does not support that.** Here is what it shows.

## The core problem, in one table

| | Queries | Total impressions | Median impr/query |
|---|---|---|---|
| Where you rank **top-10** | 277 | 1,635 | **2** |
| Where you rank **40+** | 2,139 | 9,828 | 1 |

**You rank #1–10 for queries almost nobody searches, and #40–90 for queries people actually
search.** 2,800 unique queries, **median 1 impression each**. 86% of your queries produced 5 or
fewer impressions in six months.

Your entire top-10 ranking profile is worth **1,635 impressions**. Even at a perfect 30% CTR that
caps out around 200 clicks. **Title fixes cannot produce meaningful growth — the ranking profile
itself is the ceiling.** Still worth doing (it's one line), but it is hygiene, not strategy.

### What the long tail looks like

Real queries `/peptides/semax/` ranks for: *"semax enkephalinase inhibition"* (9 impressions),
*"semax amino acid sequence"* (16), *"semax randomized controlled trials western countries"* (8).
Excellent content, near-zero demand. That page's 1,686 impressions are spread across **hundreds**
of such queries — which also explains the "page-1 with zero clicks" anomaly I flagged earlier. At
5–16 impressions per query, zero clicks is statistically unremarkable, not a broken snippet.

### And where the volume actually is

| Query | Impressions | Your position |
|---|---|---|
| gene expression | 331 | 79 |
| zepbound for sleep apnea | 173 | 78 |
| autophagy | 139 | 80 |
| wegovy | 104 | 81 |
| telomerase | 121 | 52 |

Position 78–81 is page 8. **Domain Rating 3.3 is the hard ceiling here** — these terms are held
by Wikipedia, NIH, Mayo, and drug manufacturers.

## A second structural force: AI Overviews

Some numbers are genuinely anomalous and point somewhere specific:

| Query | Impressions | Position | Clicks |
|---|---|---|---|
| cerebrolysin fda approval status 2026 | 52 | **1.7** | **0** |
| cerebrolysin fda approval status united states | 166 | 8.5 | 0 |
| safety profile clinical outcome | 150 | 10.0 | 0 |

**Position 1.7 with zero clicks is not a title problem.** The most likely explanation is that
Google's AI Overview answers these factual questions directly on the results page. Your content
supplies the answer; the user never needs to click.

This matters strategically: **purely informational reference content is exactly what AI Overviews
disintermediate**, and that describes most of the glossary and much of the dossier corpus. GA4
already shows 36 "AI Assistant" sessions, so the referral channel exists but is small.

## What your own data proves works

| Page type | Evidence |
|---|---|
| **Comparisons** | *"survodutide vs cagrilintide"* — 69 impr, **position 2.8, 7 clicks (10% CTR)**. Best performer on the site. `/compare/cagrilintide-vs-survodutide` shows 7.27% and 8.82% CTR on other variants. |
| **Calculators** | `/calculator/reconstitution/hexarelin/` — 145 impr, 2.76% CTR. `/calculator/accumulation/retatrutide` — 4% CTR. |
| **Dossiers (engagement)** | `/peptides/slu-pp-332` holds users **246s**; `/peptides/bpc-157` 165s. |
| **Glossary** | `/glossary/dalton` — 74 sessions, **100% bounce, 0s**. Generic terms at position 70–90. Zero clicks. |

**Comparisons and tools convert. Generic reference content does not.** That is a decision-support
vs. lookup distinction — and it is precisely the line AI Overviews cannot easily cross, because a
comparison implies a judgement the user wants to inspect.

---

# Recommendations, ranked by expected impact

## 1. Reposition toward decision-support content *(highest impact, slowest)*

Your 280 `/compare/` pages are your best asset and your best-converting content. Lean in:

- Build comparison pages for peptide pairs people actually weigh up (GLP-1 class especially —
  semaglutide/tirzepatide/retatrutide/survodutide/cagrilintide have real search volume).
- Target *decision* queries: "X vs Y", "is X better than Y", "X or Y for [goal]".
- Extend the calculator set — tools earn links and can't be answered by an AI Overview.

## 2. Fix the glossary — it is a net liability *(high impact, cheap)*

216 pages ranking 70–90 on generic science terms, 100% bounce, zero clicks, attracting bots.
They dilute topical focus and waste crawl budget.

Options, in order of preference:
- **`noindex` the generic terms** (autophagy, gene expression, oxidative stress, half-life…) while
  keeping them for internal linking and reader support. Keeps UX, removes the dead weight.
- Or rewrite toward peptide-specific intent ("half-life in peptide dosing" not "half-life").
- Delete only as a last resort — they serve real readers via internal links.

## 3. Build authority — the actual ceiling *(highest long-term impact)*

DR 3.3 is what caps everything above. Nothing else fixes ranking for terms with volume. Realistic
routes for an evidence-based site:
- Original analysis worth citing — you already run trial trackers and a regulatory tracker; those
  are linkable assets if promoted.
- Data others reuse (charts, tables, structured trial summaries).
- Outreach to peptide/longevity communities, newsletters, and researchers.
- HARO-style expert commentary on GLP-1 news.

This is slow, unglamorous, and non-optional.

## 4. Fix the analytics so decisions can be measured *(cheap, do first)*

- **Filter bot traffic** — 91.5% of sessions are Direct with 92% bounce; April alone was 2,081
  sessions at a 1-second average. Every dashboard number is currently unusable.
- **Fix the dead custom events** — `search`, `comparison_click`, `newsletter_signup`,
  `scroll_depth`, `external_link_click` are defined in `src/scripts/analytics.ts` but none reach
  GA4. You are blind to conversions.

## 5. Technical hygiene *(cheap, small but real)*

- **307 → 301** on apex→www so authority consolidates onto one host.
- **Conditional title suffix** — one line in `BaseLayout.astro:48`, un-truncates 521 titles.
  Hygiene, not growth. Do it, but don't expect much.
- Add `<lastmod>` to the sitemap (absent on all 1,221 URLs).
- Merge `/glossary/off-label` and `/glossary/off-label-use` (duplicate titles, competing).

## 6. Striking distance *(modest, quick)*

72 pages sit at positions 11–20 with 5,597 impressions and 4 clicks. Worth a pass, but note the
same caveat: these are fragmented long-tail queries, so gains are measured in tens of clicks.

---

## Honest expectations

At ~47 organic sessions/month with DR 3.3, this is an **early-stage site**, not a broken one.
The content genuinely engages the people who find it (244s average session, and rising). The
constraint is that too few people find it, because the queries you win have no volume and the
queries with volume need authority you have not built yet.

Realistic sequencing: fix analytics and hygiene this week (days), reposition content toward
comparisons and tools over the next quarter (weeks), build authority continuously (months).
Traffic responds to #1 and #3 — not to #5.
