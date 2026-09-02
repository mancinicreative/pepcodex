# BOT-WAF-DRAFT — Vercel Firewall (owner applies)

**Do not apply from git. Do not apply this wave.** Vercel Firewall is a dashboard click. `GET /v1/security/firewall/config` on 2026-09-02 returned `{ active: null, draft: null, versions: [] }` — nothing is live.

Project: **peptide-library** (`prj_lcEVX3TkmKwdJETeNqMWaeI19E7T`, team `team_Y3mAgWHs1DVqLRyrlmZjghtr`).

Companion: `BOT-DIAGNOSIS.md`. GSC Singapore clicks this pull: **0 / 0**. City Singapore 8,294 @ 99.6% / 0.19s is the scrape. Singapore `(not set)` 742 @ 30% / 29s is not proven bot.

---

## Intent

Stop the Singapore-city scraper from fetching HTML/JS (bandwidth + GA4 pollution) without touching Google, Bing, AI-citation crawlers, ChatGPT/Perplexity **referrals**, or US/GB mobile organic.

Success is **not** “we blocked Singapore.” Success is: GA4 Singapore-*city* sessions collapse **and** GSC US+GB mobile clicks + `chatgpt.com` source sessions do not.

---

## Owner click 0 — sample before any Challenge

`vercel logs` (CLI 50.6.0) only tails **function** runtime logs. This site is static. The REST events endpoint is empty (no rules). **UA/ASN live on the dashboard only.**

1. Vercel Dashboard → team that owns **peptide-library** → project **peptide-library**.
2. **Firewall** → **Traffic**.
3. Filter **Country = Singapore**. Window: last 7 days (or last 24h if volume is high).
4. Group by **User Agent**. Group by **ASN**. Group by **JA4** if shown.
5. Paste the top 10 of each here (or a new `BOT-WAF-SAMPLE.md`) before enabling Rule 2.

Decision from the sample:

| What the Traffic page shows | What to enable |
|---|---|
| One or few **cloud** ASNs + non-browser or identical UA, matching the 8k city scrape | Rule 2 = **Country SG AND ASN in {those}** + Challenge |
| Mix of cloud **and** residential (Singtel / StarHub / M1) | Challenge **cloud ASN only**. Do not country-challenge. |
| UA is `Googlebot` / `ChatGPT-User` / `PerplexityBot` / `bingbot` | Those rows are allowlist. Do not use them as the scrape fingerprint. |
| No SG traffic in the window | Scraper paused; keep analytics filter only. Re-check in 7 days. |

Until that paste exists, **Rule 2 stays off.** A country-only Challenge is the fallback in §Fallback, not the default.

---

## Proposed rules (priority order)

Create under **Firewall** → **Configure** → **Custom Rules** → **Add**. Higher priority first.

### Rule 1 — Bypass crawlers (enable now; harmless)

**Name:** `allow-search-and-ai-crawlers`  
**If** User-Agent **contains** any of (case-insensitive):

- `Googlebot`
- `Google-InspectionTool`
- `AdsBot-Google`
- `bingbot`
- `ChatGPT-User`
- `GPTBot`
- `PerplexityBot`
- `ClaudeBot`

**Then:** **Bypass** (Allow).  
**Not:** Challenge, Deny, Rate limit.

This rule must sit **above** any SG rule. It is the do-not-harm list.

Also Bypass (same rule or a second): path **exactly matches** `/robots.txt`, `/sitemap-index.xml`, or path **starts with** `/sitemap-` — so a later Challenge cannot starve Google of the sitemap.

### Rule 2 — Challenge the scrape (off until sample)

**Name:** `challenge-sg-datacenter`  
**If all:**

- Country **equals** `SG` / Singapore  
- **AND** ASN **equals** `{TBD — paste from Traffic page}`  
- **AND** User-Agent does **not** match Rule 1 (redundant if Rule 1 is higher priority)

**Then:** **Challenge** (JS / Bot Management). **Not Deny** on the first week.

If the sample names a single UA string that is clearly not a browser and not on the allowlist, you may use **Country + UA** instead of ASN. Prefer ASN: UAs rotate.

**Do not** fill ASN with a guess (AS14061 / AS16509 / AS20473 / AS45102 are candidates only).

### Rule 3 — later, optional (US AWS city)

Only after Rule 2 is stable **and** Traffic page shows Boardman / `us-west-2` as a distinct scrape (GA4: Boardman 168 / 100% / 2.1s).

**If** ASN = `{the Boardman ASN from the page}` **AND** Country = `US` **AND** path is not sitemap/robots — still too wide if that ASN is all of AWS.

Safer: **Challenge** if **IP** is in the /24s the Traffic page lists for Boardman, or if Vercel exposes **City = Boardman** as a condition. If the UI has no City condition, **skip Rule 3** rather than Challenge all of AS16509.

---

## Explicitly rejected rules

| Proposal | Why reject |
|---|---|
| Challenge / Deny all **Direct** | ChatGPT and other AI land messy. Best non-Google source is `chatgpt.com` (280 sess / 139s). Corrections B4. |
| Country-block **China + Singapore + Germany** | www GSC China **6 clicks**. Apex GSC Germany **2 clicks**. |
| Country-block **all of Asia** | India / HK / AU have GSC clicks. |
| Country-Deny Singapore with no ASN/UA | Singapore `(not set)` 742 sess look engaged; GSC now has **367 SG impressions**. Challenge-without-sample is the fallback, not the plan. |
| `robots.txt` Disallow for SG | Not how robots.txt works. Scrapers ignore it. Not a success criterion. |
| Change `vercel.json` 308 | Already correct. Live 307 is a dashboard domain redirect (`SEO-AUDIT-CORRECTIONS` A3). |
| Rate-limit `/` globally | Hits US/GB mobile organic. |

---

## Fallback if Lucas wants an edge action this week without a sample

1. Enable **Rule 1 only** (Bypass). Zero user harm.
2. Add a **Log** custom rule: Country = Singapore, action **Log** (no Challenge). Wait 48h. The events API / Traffic page will then have something to group.
3. **Only then** promote to Challenge with the ASN filled in.

If even Log is skipped: ship analytics only (`BOT-DIAGNOSIS.md` §5a–5b). Dashboards become usable; the bot still hits origin. That is an acceptable L1 outcome.

If someone enables a **country-only Challenge** anyway: 7-day harm gate below. Revert (delete Rule 2) if GSC later shows **SG clicks** (Judge criterion) or if US/GB mobile clicks drop.

---

## Verify after 7 days (if anything is challenged)

| Check | Pass |
|---|---|
| GSC mobile clicks, www + apex, US + GB | Not down for a reason attributable to the rule |
| GA4 source `chatgpt.com` | Still present (not zeroed) |
| GA4 city Singapore / Singapore | Down **>80%** vs this pull (8,294) |
| GA4 country Singapore `(not set)` | Must not vanish if Rule 2 was ASN-scoped |
| Firewall events | Allowlist UAs show **Bypass**, not Challenge |

---

## Analytics-only path (no WAF)

Skip Rules 2–3. Wave 2: commit the `BaseLayout.astro` localhost skip (already in the working tree, **not** in HEAD). Lucas: GA4 comparison `exclude-scraper-localhost`. The bot still costs bandwidth; numbers become honest.

---

## Do-not-harm list (copy onto the Bypass rule)

`Googlebot` · `Google-InspectionTool` · `AdsBot-Google` · `bingbot` · `ChatGPT-User` · `GPTBot` · `PerplexityBot` · `ClaudeBot` · US/GB mobile organic · chatgpt.com / Perplexity referrals.
