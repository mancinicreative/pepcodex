# First-party GSC + GA4 — PepCodex audit addendum

**Pulled:** 2026-09-02  
**GSC property:** `https://www.pepcodex.com/` only (permission `siteFullUser`)  
**GSC days with data:** 2026-05-28 → 2026-08-31 (**96 days**). Requested window was 16 months; Google returned no earlier rows.  
**Apex / `sc-domain:pepcodex.com`:** **NOT IN THIS ACCOUNT.** Do not invent that half.  
**GA4:** property `521749549`, requested 2025-05-01 → 2026-08-31 (217 daily rows).  
**Machine stats:** `FIRST-PARTY-STATS.json`  
**Raw files:** `.planning/data/gsc-www-pepcodex-com-*.json`, `ga4-*.json`

Classification: totals below are **FACT** from the APIs. “What to do” lines are **OPINION/RECOMMENDATION**. Query-dimension coverage is incomplete (Google censors queries): **51 of 171 clicks** appear in the query report. Absence of a query is not evidence of no demand.

---

## 1. Search Console totals (www)

| Metric | Value |
|---|---|
| Clicks | **171** |
| Impressions | **47,722** |
| CTR | **0.358%** |
| Pages with ≥1 impression | **484** |
| Live sitemap URLs | **1,057** |
| Sitemap URLs with **zero** GSC rows | **686 (65%)** |
| Queries returned | 4,117 |

### Month trend

| Month | Clicks | Impressions | CTR |
|---|---:|---:|---:|
| 2026-05 (4 days) | 1 | 254 | 0.39% |
| 2026-06 | 14 | 1,721 | 0.81% |
| 2026-07 | 44 | 9,798 | 0.45% |
| 2026-08 | 112 | 35,949 | 0.31% |

Last 28 days: **101 clicks / 33,004 impressions**. Previous 28: **48 / 12,242**. Impressions and clicks are rising. CTR is falling as generic/desktop impressions explode.

### Device

| Device | Clicks | Impressions | CTR | Avg position |
|---|---:|---:|---:|---:|
| Mobile | 100 | 7,243 | **1.38%** | 23.9 |
| Desktop | 71 | 40,316 | **0.18%** | 33.8 |
| Tablet | 0 | 163 | 0 | 41.4 |

Mobile is **58% of clicks** on **15% of impressions**. Desktop impressions are mostly unclicked (bots / ultra-broad queries). Do not optimize for desktop impression volume.

---

## 2. Where impressions go vs where clicks go

| Path prefix | Pages in GSC | Clicks | Impressions |
|---|---:|---:|---:|
| `/glossary` | 215 | **9** | **19,667** |
| `/peptides` | 70 | 27 | 15,697 |
| `/compare` | 120 | **72** | 4,232 |
| `/guide` | 10 | 13 | 2,711 |
| `/bioregulators` | 1 | 3 | 2,443 |
| `/blog` | 20 | 1 | 1,762 |
| `/` (home) | 1 | **39** | 1,394 |
| `/safety` | 10 | 0 | 864 |
| `/clinics` | 16 | **3** | **330** |
| `/calculator` | 3 | 0 | 70 |
| `/directory` | 0 | 0 | 0 |

**FACT:** Comparisons are the click engine (72/171 = 42% of clicks) on 9% of impressions. Glossary is the impression sink (41% of impressions, 5% of clicks). Home is the second click engine (39 clicks). Clinics are noindex in HTML and still took **3 clicks / 330 impressions** — consistent with sitewide `X-Robots-Tag: index, follow`.

**Do not add URLs.** 65% of the live sitemap has never impressed. Crawl budget is already spent on silent and low-CTR pages.

---

## 3. Pages that earn clicks (keep / improve, do not clone)

| URL | Clicks | Impr | CTR | Pos |
|---|---:|---:|---:|---:|
| `/` | 39 | 1,394 | 2.80% | 8.6 |
| `/guide` | 13 | 2,681 | 0.49% | 39.8 |
| `/compare/cagrilintide-vs-survodutide` | 10 | 224 | 4.46% | 7.0 |
| `/compare/follistatin-vs-igf-1-lr3` | 6 | 135 | 4.44% | 6.6 |
| `/compare/na-semax-amidate-vs-selank` | 6 | 281 | 2.14% | 8.0 |
| `/peptides/mazdutide` | 5 | 973 | 0.51% | 21.3 |
| Several other `/compare/*` | 3–4 each | — | 1–5% | ~7–13 |

---

## 4. High impression, weak CTR (rewrite title/H1/meta on **existing** URLs)

Threshold used: ≥200 impressions, CTR &lt; 1%, position ≤ 20.

| URL | Impr | Clicks | CTR | Pos |
|---|---:|---:|---:|---:|
| `/peptides/ghk-cu` | 2,437 | 4 | 0.16% | 14.6 |
| `/peptides/dsip` | 2,347 | 4 | 0.17% | 13.7 |
| `/peptides/tb-500` | 2,335 | 1 | 0.04% | 13.1 |
| `/peptides/retatrutide` | 1,425 | 1 | 0.07% | 6.8 |
| `/glossary/safety-profile` | 725 | 1 | 0.14% | 10.1 |
| `/peptides/bpc-157` | 578 | 1 | 0.17% | 9.1 |
| `/peptides/cartalax` | 509 | 1 | 0.20% | 7.4 |
| `/peptides/cagrilintide` | 397 | 0 | 0 | 8.2 |
| `/peptides/pinealon/cognitive-decline` | 370 | 0 | 0 | 10.7 |
| `/peptides/tesamorelin` | 232 | 0 | 0 | 7.6 |

These are **striking-distance** URLs. Fix snippets and (for approved drugs) the false “Not FDA Approved” banner. Do not mint new pages for the same queries.

`/peptides/orforglipron`: 54 impressions, position **8.5**, 0 clicks. Live page still says Investigational; Foundayo approved 2026-04-01. Title/H1 refresh on **this URL**.

`/peptides/semaglutide`: 404 impressions, 1 click, position 24. False research-only JSON-LD is on this live URL.

---

## 5. P0 URLs in search (do not wait for volume)

| URL | GSC | Action |
|---|---|---|
| `/blog/cagrilintide-semaglutide-approval` | 9 impr, 0 clicks, pos 17 | Still **false FDA approval** on live HTML. Unpublish. Traffic is not a reason to keep it. |
| `/blog/semaglutide-vs-tirzepatide-2026` | 19 impr, 0 clicks, pos 5.3 | Estimand check then 301 to comparison if the 22.5% table is still live. |
| `/clinics/*` (16 URLs in GSC) | 330 impr, **3 clicks** (Miami, Nashville, New Orleans) | Fake listings are getting clicks. Quarantine + fix `X-Robots-Tag`. |
| `/protocols/bpc-157-tb-500` | 0 GSC rows | Still unpublish (wrong PMIDs). Not a traffic asset. |
| `/directory` | 0 GSC rows | Still rewrite claims. Not indexed-useful yet. |
| `/compare/tirzepatide-vs-semaglutide` | 0 GSC rows | Canonical comparison may be unused; the 2026 blog is the one Google shows. |

---

## 6. Queries (incomplete grain)

Top **clicks** (query report; 51 of 171 clicks only):

- `peptide codex` — 8 clicks, pos 3.8 (brand)
- `survodutide vs cagrilintide` — 4
- `mazdutide peptide` / `vladonix` — 3 each
- Head-to-head strings (`tesamorelin vs mk677`, `selank vs selank amidate`, `n-acetyl selank amidate vs selank`)

Top **impressions**, almost no clicks (position 30–70 graveyard — do not write “what are peptides” blogs):

- `peptides` 1,689 impr, 0 clicks, pos 72
- `dsip clinical trials` 1,279 impr, 0 clicks, pos 9.8 — **this one is close**; improve `/peptides/dsip`, do not add a blog
- `peptide` / `what are peptides` / `tirzepatide` / `research chemicals` — generic, page 5–7

---

## 7. GA4 (do not use topline for decisions)

| Cut | Sessions | Bounce | Note |
|---|---:|---:|---|
| All | 12,821 | — | 16-month request |
| Direct | 12,265 | 91% | Treat as junk until proven otherwise |
| Organic Search | **412** | 39% | Closest to real search users |
| Referral | 192 | 38% | |
| AI Assistant | 54 | 52% | |
| Singapore | **9,009 (70%)** | 94%, 2.6s | Bot/scanner. Exclude. |
| United States | 1,170 | 75% | |
| localhost | 655 | 54% | Owner/dev. Exclude. |
| Desktop | 12,047 | 90% | Matches Direct+SG pattern |
| Mobile | 1,154 | 71%, 55s | Closer to humans |

**Organic 412 sessions vs GSC 171 clicks** are **not** the same window (GA4 includes months before GSC’s first row). Do not reconcile them into one rate.

Newsletter: **1** `newsletter_signup` in the whole GA4 window. `form_start` 26. Conversion is effectively zero. Homepage waitlist CTA is the conversion work, not more URLs.

Landing pages with ~98–100% bounce and &lt;1s duration (`/glossary/dalton`, `/glossary/molecular-weight`, `/glossary/ic50`) are bot or accidental. They also dominate GSC glossary impressions. Keep generic glossary **noindex**.

---

## 8. What this changes in the audit

Still true, now with numbers:

1. **Do not publish more URLs.** 686 sitemap URLs have never impressed. Glossary already wastes the impression budget.
2. **Comparisons that already click should be kept and made accurate**, not bulk-deleted. Thin zero-click comparisons can still be noindexed. Do not 301 the click-winning URLs (`cagrilintide-vs-survodutide`, selank/amidate, follistatin, ovagen, vilon pairs).
3. **Clinic noindex is leaking.** 3 clicks on fictional city pages. P0-2 + P0-7 (`X-Robots-Tag`) are search-visible, not theoretical.
4. **Homepage is 23% of GSC clicks.** Put PepTracker waitlist there (T-18). Spring 2026 copy is still on that URL.
5. **Mobile CTR is the real search channel.** Title/meta tests belong on mobile-winning peptide and compare URLs.
6. **GA4 topline is still ~70% Singapore.** Use GSC clicks + GA4 organic/US only.
7. **CagriSema false-approval post is not a traffic asset** (9 impressions). Removing it is not a traffic sacrifice.

---

## 9. KPI baselines (www GSC, 2026-09-02)

| KPI | Baseline | Window | Limitation |
|---|---|---|---|
| Non-brand GSC clicks | 171 total; query-grain brand-ish ~11 (`peptide codex` etc.) | 2026-05-28–2026-08-31 | Apex missing; query grain 51/171 clicks |
| Non-brand impressions | 47,722 | same | Desktop inflated |
| CTR | 0.358% overall; mobile 1.38% | same | |
| Pages with impressions | 484 / 1,057 sitemap | same | Not the same as “indexed” |
| Organic GA4 sessions | 412 | 2025-05-01–2026-08-31 | Different window than GSC |
| Newsletter signups | 1 | GA4 window | |
| Clinic GSC clicks | 3 | GSC window | Should go to 0 after quarantine |

Apex GSC remains **BASELINE UNAVAILABLE**.
