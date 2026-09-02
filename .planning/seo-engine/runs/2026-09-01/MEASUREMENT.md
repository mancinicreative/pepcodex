# MEASUREMENT — live pull 2026-09-02

**Status: FRESH.** Live GSC + GA4 landed. `AUTH-BLOCKED.md` is superseded. The 2026-07-25 recovered series is **STALE** — comparison only.

Pulled at **2026-09-02T22:04:55Z** via `npm run gsc:repull` / `npm run ga4:pull` (`mintToken` SA impersonation). Whoami: **info@pepcodex.com** (`user-adc`). Quota project on ADC: none (do not run `set-quota-project`; it needs `cloud-platform`).

Source of record: `.planning/data/v2/manifest.json` (returned windows, not requested). GA4 property `521749549` in `.planning/data/ga4-*.json`.

Do **not** add apex + www into one site CTR. They overlap a host migration.

## Real windows (Google returned)

| Property | First | Last | Days | Clicks | Impressions | CTR | Avg pos |
|---|---|---|---|---|---|---|---|
| `https://pepcodex.com/` | 2026-01-27 | 2026-08-31 | 217 | **84** | 32,357 | 0.26% | 24.4 |
| `https://www.pepcodex.com/` | 2026-05-28 | 2026-08-31 | 96 | **171** | 47,722 | 0.358% | 32.3 |

`searchAppearance` cut: **0 rows** on both properties.

## Trusted vs untrusted

| Series | Trust | Why |
|---|---|---|
| GSC clicks (esp. mobile US/GB) | **TRUSTED** through 2026-08-31 | Search Console, not GA4 |
| GSC page-dimension impressions | **TRUSTED** for coverage | Completeness of pages Google showed |
| GSC totals (no dimension) | **TRUSTED** property KPI | Matches device/country click sums |
| GSC query-dimension | **CENSORED — not demand** | See ratio below. Never conclude “no demand” from a missing query |
| GSC page+query / page+device | **CENSORED** | Apex page+query holds 9 clicks vs 84 page-export clicks |
| GA4 sessions topline | **UNTRUSTED** | Direct 12,265 / 91.3% bounce; Singapore 9,009 / 93.9% bounce; localhost 655 |
| GA4 desktop sessions | **UNTRUSTED** | 12,047 desktop vs 1,154 mobile — opposite of GSC click mix |
| GA4 organic / google / referral / ChatGPT | directional | Bounce 38–60% — closer to people |
| 2026-07-25 recovered manifest | **STALE** | Last day 2026-07-22. Do not use as current |

**Primary KPI:** GSC mobile clicks on www + apex, US + GB, page or totals cut.  
**Do not use:** GA4 session totals, query-export demand, combined apex+www CTR.

## Query-export vs page-export (censorship)

Page export is the coverage series. Query export is a **subset**. KPIs use page + device + country.

| Property | Page impr / clicks | Query impr / clicks | Query share of page impr | Query share of page clicks |
|---|---|---|---|---|
| apex | 32,861 / 84 | 10,241 / 9 | **31.2%** | **10.7%** |
| www | 50,623 / 171 | 24,978 / 51 | **49.3%** | **29.8%** |

Apex is in the historical ~33% / ~15% band. WWW query share is higher on impressions but still misses **70% of clicks**. Query absence ≠ no demand.

## Device (GSC — use this, not GA4)

Apex (totals 84 / 32,357):

| Device | Clicks | Impressions | CTR | Pos |
|---|---|---|---|---|
| MOBILE | 55 | 7,088 | **0.776%** | 17.4 |
| DESKTOP | 28 | 25,075 | 0.112% | 26.5 |
| TABLET | 1 | 194 | 0.515% | 12.5 |

WWW (totals 171 / 47,722):

| Device | Clicks | Impressions | CTR | Pos |
|---|---|---|---|---|
| MOBILE | 100 | 7,243 | **1.381%** | 23.9 |
| DESKTOP | 71 | 40,316 | 0.176% | 33.8 |
| TABLET | 0 | 163 | 0% | 41.4 |

Mobile still earns most clicks at ~7–8× desktop CTR. WWW desktop impressions exploded since July (see baseline).

## Country (GSC)

Apex top: **USA 15,606 impr / 56 clicks**; GBR 5,739 / 6; AUS 570 / 4; CAN 867 / 2; DEU 591 / 2. Singapore **147 / 0**. China **220 / 0**.

WWW top: **USA 28,349 / 104**; CAN 1,011 / 10; CHN 148 / **6**; GBR 4,049 / 5; IND 1,454 / 4. Singapore **220 / 0**.

GA4 country is the opposite picture (Singapore 9,009 sessions). GSC Singapore remains ~0 clicks. Do not treat GA4 country as search demand.

## Landing pages that earn GSC clicks

Not GA4 sessions. Page dimension, clicks > 0.

**Apex (84 clicks):** homepage 31; `cardiogen-vs-vesugen` 8; hexarelin reconstitution calc 4; glossary/safety-profile 4; retatrutide accumulation calc 3; cagrilintide reconstitution calc 3; `cagrilintide-vs-survodutide` 3 + trailing-slash twin 3; `ovagen-vs-svetinorm` 3; cerebrolysin 3. Clinics **`scottsdale.mdx/`** and **`st-louis.mdx/`** still 1 click each (raw-source URLs).

**WWW (171 clicks):** homepage 39; `/guide` 13 (2,681 impr, pos-heavy); `cagrilintide-vs-survodutide` 10; `follistatin-vs-igf-1-lr3` 6; `na-semax-amidate-vs-selank` 6; mazdutide 5; then 4-click comparisons (`ovagen-vs-svetinorm`, `thymogen-vs-vilon`, `vilon-vs-vladonix`) and dossiers DSIP / GHK-Cu. One blog click: `blog/survodutide-phase-2-mash-results`. High-impr low-click: `/glossary/peptide` 2 / 4,233; tb-500 1 / 2,335.

Pattern that survives the corrections doc: **under-covered comparison pairs and calculators click.** News-blog rows are still almost zero.

## GA4 (UNTRUSTED mix; requested window 2025-05-02 → 2026-09-02)

Monthly series on disk starts **2026-01**. Hostname: `www.pepcodex.com` 12,580 sessions (90.2% bounce); **localhost 655**.

| Channel | Sessions | Bounce | Label |
|---|---|---|---|
| Direct | 12,265 | 91.3% | UNTRUSTED |
| Organic Search | 412 | 39.1% | directional |
| Unassigned | 250 | 79.6% | UNTRUSTED |
| Referral | 192 | 37.5% | directional |
| AI Assistant | 54 | 51.9% | directional |
| Organic Social | 37 | 59.5% | directional |

Sources: `(direct)` 12,265 · `google` 396 · **`chatgpt.com` 280** · `steroidsourcetalk.cc` 57 · `github.com` 22. ChatGPT is larger than the AI Assistant channel (attribution split). Do not WAF Direct.

Country: Singapore 9,009 (93.9% bounce, city Singapore 8,294 at 99.6% bounce) · US 1,170 · China 1,050 · Canada 423 · Mexico 397 (Cancun 351) · Germany 357 · UK 48. Devices: desktop 12,047 vs mobile 1,154.

New vs returning: new 12,796 (89.3% bounce) · returning 290 (42.4% bounce, 374s). Returning is the only GA4 user class that looks human.

Events: `page_view` 14,930 · `click` 43 · `form_start` 26 · `newsletter_signup` **1**. No app-CTA event in this pull.

## vs 2026-07-25 STALE baseline

Baseline: `.planning/phases/40-growth-engine/research/recovered/gsc-manifest.json` pulled 2026-07-25T07:01:31Z (last day 2026-07-22).

| Property | STALE clicks / impr / last | FRESH clicks / impr / last | After 2026-07-22 |
|---|---|---|---|
| apex | 81 / 31,704 / 177d | 84 / 32,357 / 217d | **+3 clicks / +653 impr** over 40 days |
| www | 40 / 5,884 / 56d | 171 / 47,722 / 96d | **+131 clicks / +41,838 impr** over 40 days |

WWW impression growth is mostly **desktop** (35,427 of 41,838 post-baseline impr; mobile took 72 of 131 new clicks at 6,277 impr). WWW CTR fell 0.68% → 0.36% because impressions outran clicks. Apex is essentially flat.

## Auth notes (not a pull failure)

`npm run gsc:sites` (user ADC) listed only `https://www.pepcodex.com/` as `siteUnverifiedUser`. `gsc:repull` (SA `pepcodex-reader@…`) saw **both** properties and wrote both. Apex is live in the files. If a future user-ADC-only script is used, add `info@pepcodex.com` as a verified user on the apex property.

## Script change this run

`scripts/ga4-pull.mjs` — added `ga4-new-returning` (`newVsReturning`) to close the L0 cut list. Country, city, hostName, sessionSource were already present; re-pulled after the add. No other script rewrite.
