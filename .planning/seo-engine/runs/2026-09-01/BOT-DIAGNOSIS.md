# BOT-DIAGNOSIS — Wave 1 (L1)

**Status: DIAGNOSIS ONLY.** Do not mark KEEP. Do not apply Vercel Firewall. Quality Judge has not run.

Pulled **2026-09-02T22:04:55Z** (`MEASUREMENT.md`, whoami `info@pepcodex.com`). GA4 property `521749549`, requested window 2025-05-02 → 2026-09-02 (monthly series starts **2026-01**). GSC windows: apex 2026-01-27 → 2026-08-31 (217d); www 2026-05-28 → 2026-08-31 (96d).

Do **not** add apex + www into one CTR. Country mismatch (GA4 sessions vs GSC clicks) is the discriminator. Consent-denied users can bounce; they do not invent 9k sessions from a country with **0** GSC clicks.

---

## 1. GA4 country vs GSC country

Sources: `.planning/data/ga4-country.json`, `.planning/data/ga4-city.json`, `.planning/data/v2/gsc-pepcodex-com-country.json`, `.planning/data/v2/gsc-www-pepcodex-com-country.json`.

| Country | GA4 sessions | Bounce | Avg duration | GSC apex impr / clicks | GSC www impr / clicks | Call |
|---|---:|---:|---:|---|---|---|
| **Singapore** | **9,009** | 93.9% | 2.6s | 147 / **0** | 220 / **0** | **Scraper.** See city split below. |
| United States | 1,170 | 75.2% | 65s | 15,606 / **56** | 28,349 / **104** | Mixed. Real search + AWS-city bots. |
| China | 1,050 | 93.1% | 8.0s | 220 / 0 | 148 / **6** | Mostly bot. **6 www clicks — do not WAF China.** |
| Canada | 423 | 57.0% | 70s | 867 / 2 | 1,011 / **10** | Looks human. |
| Mexico | 397 | 47.9% | 216s | 218 / 0 | 326 / 1 | Looks human (Cancun / Tulum). |
| Germany | 357 | 94.4% | 9.2s | 591 / **2** | 868 / 0 | Mostly bot. 2 apex clicks — **no DE country block.** |
| United Kingdom | 48 | 64.6% | 132s | 5,739 / **6** | 4,049 / **5** | Human. GSC large, GA4 tiny (bots drowned the mix). |
| India | 33 | 48.5% | 102s | 529 / 1 | 1,454 / 4 | Human. |
| Australia | 28 | 60.7% | 123s | 570 / 4 | 895 / 3 | Human. |

GA4 country file is capped at 50 rows (13,001 sessions). Channel total is 13,211.

### SG vs US/GB (the July pattern, live)

| | 2026-07 (corrections B6 / stale diagnosis) | **This pull** |
|---|---|---|
| GA4 Singapore | 5,410 (62%), 97% bounce | **9,009 (~68%)**, 93.9% bounce |
| GA4 United States | 803 | 1,170 |
| GA4 United Kingdom | (not highlighted) | 48 |
| GSC Singapore clicks | 0 (184 impr combined, stale file) | **Still 0** (147 + 220 = **367 impr**) |
| GSC USA clicks | apex 55 / www 30 | apex **56** / www **104** |
| GSC GBR clicks | (apex 5,668 impr in B6) | apex **6** clicks / www **5** |

Singapore **grew +3,599 GA4 sessions** since the July fingerprint and still has **zero GSC clicks**. Google *is* showing the site in SG SERPs (impressions doubled on www: 38 → 220). That is not “Singapore readers.” It is also why a **country-only edge block** is the wrong first click — see city split and WAF draft.

### Singapore is two populations

| City (GA4) | Sessions | Bounce | Duration | Read |
|---|---:|---:|---:|---|
| Singapore / Singapore | **8,294** | **99.6%** | **0.19s** | The scraper. |
| (not set) / Singapore | 742 | 30.2% | 29s | Different class. Do not assume bot. |

Country-average 2.6s is the 8,294 scrapes diluted by the 742. **Do not WAF “all of Singapore” without ASN/UA.** Filter **Country = Singapore** out of GA4 KPIs (0 GSC clicks). Challenge at the edge only after the Traffic-page sample in `BOT-WAF-DRAFT.md`.

### Other bot-shaped cities (do not country-block these countries)

| City | Country | Sessions | Bounce | Duration | Likely class |
|---|---|---:|---:|---:|---|
| Boardman | United States | 168 | 100% | 2.1s | AWS `us-west-2` scrape |
| San Jose | United States | 117 | 94.9% | 0.76s | Cloud / DC |
| Washington | United States | 20 | 100% | 0s | Bot-shaped |
| Butzbach | Germany | 74 | 100% | 0.01s | DC-shaped |
| Bayreuth | Germany | 34 | 100% | 0.03s | DC-shaped |
| Berlin | Germany | 72 | 98.6% | 0.15s | Bot-shaped |

US GSC is the trusted audience (160 clicks across properties). A US-country WAF is forbidden. Boardman is a later, narrower rule **after** logs name an ASN.

Cancun 351 / 46% / 226s and Hamilton (CA) 334 / 59% / 43s look engaged. Leave them in the “real” comparison.

### Scraper onset

`.planning/data/ga4-monthly.json`: Jan–Mar 218–466 sessions (Feb bounce 64%). **April 2,184 sessions, 96% bounce, 5.4s** — scraper arrives. Aug 3,594 / 90%. Sep 1–2 already 212 / 97.6%. Still live.

Landing pages that look like the same crawler (not WAF targets): `/glossary/dalton` 102 sess, 98% bounce, 0.13s; `/glossary/molecular-weight` 93 / 98% / 0.34s. Homepage 974 / 64% / 107s is mixed.

---

## 2. Hostname / referrer

`.planning/data/ga4-hostname.json` (limit 30):

| Hostname | Sessions | Bounce |
|---|---:|---:|
| `www.pepcodex.com` | 12,580 | 90.2% |
| `localhost` | **655** | 54.4% |

**No `*.vercel.app` preview host** in the cut. `vercel.com` as a *source* is 6 sessions (dashboard), not a preview hostname.

`.planning/data/ga4-referrer.json`: `pageReferrer` contains `localhost` on **26 rows / 735 sessions** (ports 4321, 4322, one 4323). Top: `http://localhost:4321/` 343 · `http://localhost:4322/peptides` 102 · `http://localhost:4321/peptides/bpc-157` 97 · `http://localhost:4322/` 66. Matches corrections **B5** (~667), still present.

Empty referrer: 11,928 sessions, 92.1% bounce, 9s — the Direct/scraper pile.

### Layer (a) — don’t send localhost hits

| Surface | Live / HEAD | Working tree (uncommitted) |
|---|---|---|
| `src/layouts/BaseLayout.astro` gtag | **Fires on localhost.** `git show HEAD` has no hostname skip. | **Skip coded** (`hostname === 'localhost' \|\| '127.0.0.1'`). `git status`: `M src/layouts/BaseLayout.astro` (not this Wave 1). |
| `src/scripts/analytics.ts` | No hostname guard. `init()` returns if `gtag` is undefined. | Untouched this wave. |
| Production | Whatever is deployed from `main` / last ship — **not** this uncommitted skip. | — |

**655 localhost hostname sessions are in this GA4 window.** Code guard is not live until Wave 2 commits and a deploy happens. Cookie consent (`CookieConsent.astro`) sets `analytics_storage: denied` *after* gtag loads; consent-denied pings can still look like bounce. Discriminator stays GSC-vs-GA4 country.

---

## 3. Channel / source / AI

`.planning/data/ga4-channels.json`, `ga4-sources.json`, `ga4-devices.json`, `ga4-new-returning.json`, `ga4-events.json`.

| Channel | Sessions | Bounce | Trust |
|---|---:|---:|---|
| Direct | **12,265** | 91.3% | **UNTRUSTED.** Not a WAF target (B4). |
| Organic Search | 412 | 39.1% | Directional people |
| Unassigned | 250 | 79.6% | UNTRUSTED (ChatGPT often lands here) |
| Referral | 192 | 37.5% | Directional people |
| AI Assistant | 54 | 51.9% | Directional; under-counts ChatGPT |
| Organic Social | 37 | 59.5% | Directional |
| Cross-network | 1 | 100% | ignore |

| Source | Sessions | Bounce | Duration |
|---|---:|---:|---:|
| `(direct)` | 12,265 | 91.3% | 11s |
| `google` | 396 | 38.1% | 162s |
| **`chatgpt.com`** | **280** | 59.6% | **139s** |
| `(not set)` | 81 | 97.5% | 77s |
| `steroidsourcetalk.cc` | 57 | 36.8% | 238s |
| `github.com` | 22 | 22.7% | 470s |
| `doubao.com` | 10 | 50% | 169s |
| `bing` | 10 | 80% | 37s |
| `perplexity` + `perplexity.ai` | 9 | ~56% | mixed |
| other AI (`openai`, `claude.ai`, `coze.cn`, `yuanbao`, `notebooklm`) | 8 | mixed | — |

AI-named sources sum **307**. ChatGPT is still the #1 non-Google source (B4). Quality is worse than July’s 264 / 40% / 327s but still the best non-Google pile. **A WAF on Direct would hit this channel.**

Devices (UNTRUSTED vs GSC): GA4 desktop 12,047 / 90% bounce vs mobile 1,154 / 71%. GSC clicks are mobile-majority (apex 55/84, www 100/171) at ~7–8× desktop CTR. Desktop GA4 is the bot surface.

New vs returning: new 12,796 / 89.3% bounce / 14s · **returning 290 / 42.4% / 374s** — the only GA4 user class that looks human.

Events: `page_view` 14,930 · `click` 43 · `form_start` 26 · `newsletter_signup` **1**. No app-CTA event.

---

## 4. Vercel logs / UA / ASN

**User-agents for SG IPs: not sampled. Do not invent them.**

What this wave actually reached:

| Check | Result |
|---|---|
| `vercel whoami` | `mancinicreative` (CLI 50.6.0) |
| `vercel logs --help` | Tails **runtime** logs for one deployment, 5 minutes. This site is static HTML. No CDN/UA/ASN there. |
| `GET /v1/security/firewall/config` | `{ active: null, draft: null, versions: [] }` — **no WAF rules live or drafted** |
| `GET /v1/security/firewall/events` | `{ actions: [] }` |
| `GET /v1/security/firewall/attack-status` | `{ anomalies: [] }` |
| Firewall **Traffic** page (UA, ASN, JA4, country) | Dashboard-only. Not opened. |

Likely class from behavior (not from a packet): Singapore-city + Direct + desktop + 0.19s + April onset = **datacenter scrape**, not Singtel residential. Confirm on the Traffic page before any Challenge. Common *candidates* (do not put these in a live rule until the page shows them): DO AS14061, AWS AS16509, Vultr AS20473, Alibaba AS45102. **Never** block AS16509 globally (that is all of AWS, including Boardman *and* real US users).

Owner click: Vercel → project **peptide-library** (`prj_lcEVX3TkmKwdJETeNqMWaeI19E7T`) → **Firewall** → **Traffic** → filter Country = Singapore → group by User Agent and ASN. Paste the top 10 into the WAF draft before enabling Rule 2.

---

## 5. Three layers

### (a) Code — stop localhost gtag (Wave 2, reversible)

Working tree already has the skip in `BaseLayout.astro`; **HEAD and production do not.** Wave 2: commit that skip (or re-apply if the dirty file is reverted). Optional belt: same `hostname` check at the top of `analytics.ts`. Also skip `*.vercel.app` if a later hostname pull ever shows it (none today).

**Do not do this in Wave 1.**

### (b) GA4 — comparison this week + optional IP filter (Lucas Admin)

Comparisons do **not** delete data. A country **Data filter** would hide the before/after WAF proof. Use a comparison.

**Exact clicks — comparison (do this):**

1. Open [GA4 property 521749549](https://analytics.google.com/analytics/web/#/p521749549).
2. Left rail → **Reports** → **Life cycle** → **Acquisition** → **Traffic acquisition**.
3. Top of the report → **Compare** (two-rectangle) → **Create new comparison**.
4. Name: `exclude-scraper-localhost`.
5. Condition 1: **Exclude** → dimension **Country** → **exactly matches** → `Singapore`.
6. **Add condition**: **Exclude** → **Hostname** → **exactly matches** → `localhost`.
7. Optional third (US cloud scrape, not a country block): **Exclude** → **City** → **exactly matches** → `Boardman`.
8. Apply. Save as a reusable comparison. Do **not** convert it to a Data filter.

Second comparison, name `real-channels`: **Include** **Session default channel group** in `{Organic Search, Referral, AI Assistant, Organic Social}`. Expected ballpark: ~695 sessions in this window vs 13.2k topline.

**Exact clicks — Data filter (localhost / Lucas IP only, not Singapore):**

GA4 Data filters cannot exclude a hostname. Internal traffic is IP-only.

1. Admin (bottom-left gear) → **Data collection and modification** → **Data streams** → the web stream for `G-1M56CNL8CK`.
2. **Configure tag settings** → **Show all** → **Define internal traffic**.
3. Create rule `Lucas home` — Lucas pastes his current public IP (do not guess). Traffic type value: `internal`.
4. Admin → **Data collection and modification** → **Data filters** → **Create filter** → type **Internal traffic** → name `Internal — owner IP`.
5. Leave state **Testing** 48h, then **Active** only if Lucas accepts that his own home browsing disappears from totals.

**Do not** create a Data filter on Country = Singapore. We need that series to prove the WAF.

### (c) Edge — draft only

See `BOT-WAF-DRAFT.md`. Challenge **Singapore + datacenter ASN** (or known UA) after the Traffic-page sample. Allowlist first. **Never** challenge all Direct. **Never** block all of Asia. **Never** country-block China or Germany (GSC clicks exist).

`public/robots.txt` is `Allow: /` + sitemap. Scrapers ignore it. **Not a success criterion.** Optional crawl-delay is hygiene only.

---

## 6. Do-not-harm list

Never challenge, deny, rate-limit, or `robots.txt`-block:

- `Googlebot`
- `Google-InspectionTool`
- `AdsBot-Google`
- `bingbot`
- `ChatGPT-User`
- `GPTBot`
- `PerplexityBot`
- `ClaudeBot` (citation crawler; AI channel)
- US / GB **mobile organic** (GSC: apex mobile 55 clicks, www mobile 100; USA+GB clicks 56+6 and 104+5)
- `chatgpt.com` / Perplexity / Doubao **referrals** (they arrive as Referral / Unassigned / AI Assistant, often with empty-looking Direct)

Harm gate after any later WAF apply: GSC mobile clicks on www+apex for US+GB do not drop for a reason attributable to the rule; `chatgpt.com` source sessions remain in GA4.

---

## 7. What “real users” means in MEASUREMENT

| Series | This window | Trust |
|---|---|---|
| GA4 sessions topline (~13.2k) | UNTRUSTED | Direct 12,265 + SG 9,009 |
| GA4 after Exclude SG | ~4.2k | Still has localhost + China/DE bots |
| GA4 after Exclude SG + hostname localhost | ~3.5k if localhost is not already inside SG | Better, still mixed |
| Organic + Referral + AI + Social | **695** | Directional people |
| Returning users | **290** / 42% / 374s | Best GA4 user class |
| GSC clicks apex / www | **84 / 171** | **TRUSTED** (do not sum for CTR) |
| GSC SG clicks | **0 / 0** | Confirms scraper, not readers |

---

## Commands actually run (this agent)

- `cmd /c dir /b .planning\data\v2` and `dir /b .planning\data\ga4*`
- `node -e` over `ga4-referrer.json` / `ga4-sources.json` / `ga4-country.json` / `ga4-hostname.json` (localhost referrer 735; AI sources 307)
- `vercel --version` (50.6.0), `vercel whoami` (`mancinicreative`), `vercel logs --help`
- `git show HEAD:src/layouts/BaseLayout.astro` (no localhost skip); `git status -- short` / `git diff --stat` on that file (`M`, +11/−9)
- `Invoke-RestMethod` GET firewall `config`, `events`, `attack-status` (all empty)
- Reads: `MEASUREMENT.md`, `SEO-AUDIT-CORRECTIONS.md` B4–B6, `LOOPS.md` L1, `analytics.ts`, `BaseLayout.astro`, `CookieConsent.astro`, `public/robots.txt`, GA4/GSC JSON listed above

**Did not:** `gsc:repull`, `ga4:pull`, `astro build`, Firewall apply, Quality Judge, invent UAs.

## Blockers

- Firewall **Traffic** page (UA/ASN for SG) is owner-dashboard; API events are empty because no rules exist.
- `BaseLayout.astro` is already dirty with an uncommitted localhost skip — Wave 2 must not fight a second editor.
- GA4 Admin comparison / internal-IP filter is Lucas.
- Do not apply WAF until the Traffic-page sample is pasted into the draft.
