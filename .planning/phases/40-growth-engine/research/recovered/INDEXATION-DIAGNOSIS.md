# Indexation diagnosis — why 76% of PepCodex is invisible

*2026-07-24 · GSC URL Inspection API + re-pulled Search Analytics (honest date ranges) + built-output link graph*
*Data: `.planning/data/v2/` — `manifest.json` records the REAL windows*

## Verified date ranges (correcting "16 months")

| Property | First data | Last data | Days |
|---|---|---|---|
| apex `https://pepcodex.com/` | 2026-01-27 | 2026-07-22 | **177** |
| www `https://www.pepcodex.com/` | 2026-05-28 | 2026-07-22 | **56** |

**5.8 months, not 16.** The domain is young.

---

## The finding

| | Pages | % |
|---|---|---|
| In sitemap | 1,221 | 100% |
| Ever received ≥1 impression | 298 | 24.4% |
| **Never seen in search** | **923** | **75.6%** |

| Section | Total | Silent | % silent |
|---|---|---|---|
| /clinics/ | 61 | 55 | **90%** |
| /compare/ | 280 | 241 | **86%** |
| /guide/ | 37 | 32 | 86% |
| /peptides/ | 393 | 325 | **83%** |
| /blog/ | 156 | 115 | 74% |
| /glossary/ | 216 | 100 | 46% |
| **/calculator/** | 3 | **0** | **0%** |

## Google's own verdict (45 silent pages inspected)

| Verdict | Count | Meaning |
|---|---|---|
| **Discovered – currently not indexed** | 27 (60%) | Google knows the URL exists and **chose not to crawl it** |
| **URL is unknown to Google** | 13 (29%) | Not even discovered |
| Crawled – currently not indexed | 3 (7%) | Fetched, then rejected |
| Submitted and indexed | 1 | Indexed but ranks too low to ever surface |

**40 of 45 were never crawled at all.**

## It is not an internal-linking problem

Inbound internal links, measured from the built output, against Google's verdict:

| Verdict | n | Median inbound links |
|---|---|---|
| Discovered – not indexed | 27 | 3 |
| **URL unknown to Google** | 13 | **15** |
| Crawled – not indexed | 3 | 90 |

And the decisive cases — pages linked from **every page on the site** that Google has *still* never crawled:

| Page | Inbound links | Status (both properties) |
|---|---|---|
| **/peptides** (main hub) | 1,222 | Discovered – not indexed, **never crawled** |
| **/trials** (13,115 words, 340s engagement) | 1,222 | Never crawled |
| **/regulatory-tracker** (279s engagement) | 1,222 | Never crawled |
| /about | 1,222 | Never crawled |
| /category/hormonal, /category/immune | 1,222 | Never crawled |

Site-wide: 31 pages have zero inbound links and 473 of 1,223 have ≤2 — worth fixing, but it is
**not** what is causing this. Pages with maximal internal linking are equally uncrawled.

---

## Diagnosis: crawl-budget starvation

Google assigns each site a crawl allocation driven mainly by **authority** and **perceived value**.
PepCodex presents:

- **Domain Rating 3.3** — near-zero authority
- **1,221 URLs** — a large surface to crawl
- **5.8 months old** — no established crawl history
- **No `<lastmod>` on any sitemap URL** — no priority signal whatsoever
- **YMYL health topic** — held to a higher quality bar

Result: a small crawl budget spread across 1,221 URLs. Google fetches a fraction, and 75.6% never
get looked at. **"Discovered – currently not indexed" is Google explicitly saying it deprioritised
the fetch** — not that the content is poor.

**This is the actual bottleneck.** CTR optimisation, title length, and content repositioning all
operate on the 24% Google can see. None of them touch the 76% it cannot.

### The compounding failure

`/peptides` — the hub that links to all 393 dossiers — has never been crawled. Hub pages are the
primary discovery path for their spokes. An uncrawled hub means the dossiers behind it are far
harder to discover, which is consistent with 83% of `/peptides/` being silent.

### The one section with perfect coverage

`/calculator/` — **0% silent, 3 of 3 indexed**, and the highest impressions-per-page on the site
(256). Small, distinct, tool-shaped. That is what fits inside a constrained crawl budget.

---

## What to do, in order

### 1. Shrink the crawlable surface — the highest-leverage move
1,221 URLs is far too many for DR 3.3. Concentrate the budget on pages that can earn something.

- `noindex` generic glossary terms (~100–150 pages that compete with Wikipedia and earn ~nothing)
- Review `/clinics/` — 61 pages, **90% silent**, 311 impressions total, 2 clicks
- Consolidate decayed blog news into evergreen hubs (cuts URL count, raises per-page value)

**Target: roughly half the current URL count.** Fewer, better pages get crawled more often.

### 2. Add `<lastmod>` to the sitemap
Previously ranked as minor hygiene. Given the diagnosis it is now **a primary lever** — it is the
main signal Google uses to prioritise recrawl. Currently absent on all 1,221 URLs.

### 3. Manually request indexing for the ~20 pages that matter
GSC → URL Inspection → *Request Indexing*, for `/peptides`, `/trials`, `/regulatory-tracker`,
`/compare`, `/about`, plus the top dossiers and comparisons. Manual, but it bypasses the queue for
your most valuable pages. Do this today.

### 4. Split the sitemap by priority
Separate money pages (`/compare/`, `/calculator/`, top dossiers) from long-tail so Google's
attention lands where it matters.

### 5. Build authority
Crawl budget scales with authority — this is the long-run fix and the reason nothing else fully
resolves it. But note: **it is not the near-term constraint.** Items 1–4 work within the budget you
already have.

### 6. Then, and only then, revisit CTR work
Titles and snippets matter for the 24% Google can see. That is real but secondary.

---

## Corrections this supersedes

- **"Build more comparison pages"** — actively wrong. 241 of 280 existing comparison pages have
  never been seen. Adding more dilutes the crawl budget further.
- **"307 → 301 is the highest-leverage change"** — it is a no-op (`vercel.json` already declares
  308; the live 307 comes from Vercel's dashboard redirect, which pre-empts the file).
- **"Trailing-slash duplication is the largest technical fact"** — real in the pooled data, but
  legacy: apex is 71.8% slash impressions vs www at 18.1% with zero clicks. All slash URLs
  correctly 308-redirect. It is resolving on its own.
- **"CTR is the bottleneck"** — no. Indexation is.
- **`searchAppearance` returns 0 rows** — no rich result has ever been earned, despite 100% JSON-LD
  coverage. Worth investigating separately.

## Mobile, now measured

| Device | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|
| **Mobile** | **81 (67%)** | 7,836 | **1.03%** | **19.8** |
| Desktop | 39 (32%) | 29,537 | 0.13% | 32.0 |
| Tablet | 1 | 215 | 0.47% | 29.3 |

Mobile ranks **12 positions better** and converts **8x better**, while desktop absorbs 79% of
impressions (largely bot-inflated) and produces a third of the clicks. The "0.31% site-wide CTR"
figure is a desktop-weighted artifact. **Your real audience is mobile.**
