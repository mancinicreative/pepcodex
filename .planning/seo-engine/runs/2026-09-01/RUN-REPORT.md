# RUN-REPORT — PepCodex SEO Engine 2026-09-01

Conductor session. Branch `feat/scoring-and-freshness`. **Not merged. Not pushed.**

## Loop scoreboard

| Loop | Verdict | Iters | Artifact |
|---|---|---|---|
| L0 Measurement | **BLOCKED on Lucas** | 1 | `AUTH-BLOCKED.md`, `MEASUREMENT.md` (2026-07-25 data, labeled stale) |
| L1 Bot | PASS as diagnosis; WAF not applied | 1 | `BOT-DIAGNOSIS.md`, `BOT-WAF-DRAFT.md`. Localhost gtag skip **coded** in `BaseLayout.astro` — not live until deploy |
| L2 Crawl | **KEEP** (iter 2) | 2 | `judge/L2-iter2.md`, `ratchet/L2.md`. `REAL_BUILD_EXIT=0`, `GRAPH_EXIT=0`, broken 0 |
| L3 Technical SEO | not run | 0 | Vercel dashboard 307 still owner action |
| L4 Integrity | CRITICAL + I-04/I-06 written | 2 | 3 blogs rewritten; SURMOUNT-5 on compare; vk2735 22%→20.9% |
| L5 Freshness | PASS as scan; **FAIL as writer queue** | 1 | `research-scan/2026-09-01/` + `UPDATE-WORKLIST.md` (noise-gated) |
| L6 Traffic content | PASS as plan | 1 | `CONTENT-PLAN.md` — **0 new URLs** |
| L7 Funnel | **KEEP** | 1 | `judge/L7-iter1.md` — waitlist CTA in built dossier/calc/safety HTML |
| L8 Authority | **KEEP** | 2 | `judge/L8-iter1.md` — `llms.txt` 107/269/215/140, no trailing slash, live compare slugs |

## What actually ran

- `gsc:whoami` / `ga4:pull` / `gsc:repull` / `gsc:sites` → `invalid_rapt`
- `research:scan --days 90` → 107 peptides, 14.2 min, exit 0
- `graph:check` on **new** dist → **GRAPH_EXIT=0** (broken 0; tesamorelin calc in:1 depth 3)
- First rebuild attempt failed YAML (unquoted `:` in titles). Wrapper `REAL_BUILD_EXIT=0` was cmd parse-time `%ERRORLEVEL%` — ignore it. Honest rebuild: `cmd /v:on` → `REAL_BUILD_EXIT=0`, 1,209 HTML
- Integrity: rewrote `is-bpc-157-safe`, `thymulin-vaccine-response`, `tirzepatide-cancer-incidence`; SURMOUNT-5 on `tirzepatide-vs-semaglutide`; SURMOUNT-1 20.9% on `vk2735-vs-tirzepatide`

## Agent close (Wave 1)

| Agent | Artifact | Load-bearing result |
|---|---|---|
| Blog Strategist | `CONTENT-PLAN.md` | 140 posts stay; **0 adds**; 46 twins to differentiate; optimizer sets 1–7 sequenced |
| Integrity Auditor | `INTEGRITY-FINDINGS.md` | 3 CRITICAL live fabrications; SURMOUNT-5 absence is false; homepage “sources” |
| Link Guardian | `FALSE-LINKS.md` | `validate-links` 0 errors; missed TrialTable 404s (graph caught them); `currentSlug` + trailing slashes still live |

`graph:check` exit 1 is the L2 source of truth. Link Guardian correctly did not rebuild.

## Net URL delta

**0** (plan). No new content URLs shipped.

## Blocked on Lucas

1. **OAuth** — PowerShell line in `AUTH-BLOCKED.md` (Desktop client, quoted scopes)
2. Vercel dashboard apex→www **307 → 308** (code already 308)
3. Vercel Firewall — `BOT-WAF-DRAFT.md` (challenge SG, allowlist Google/Bing/ChatGPT)
4. GA4 data-filter click after re-pull
5. GSC Request indexing: `/peptides`, `/trials`, `/regulatory-tracker` (after crawl fixes ship)
6. Twin merge-with-redirect (blog/guide/safety) — default is differentiate only

## Wave 2 next (do not invert)

1. ~~Rebuild + `graph:check`~~ **KEEP**
2. ~~`currentSlug` / trailing slashes / tesamorelin inbound~~ **KEEP**
3. ~~Integrity CRITICAL three blogs + I-04/I-06~~ done (not rebuilt into a second graph after Set 1)
4. ~~Blog Optimizer Set 1~~ titles/H2/yield links done (blog H1 ≠ guide; no body fattening)
5. Freshness W2 slice (not glutathione) — scan read; no dossier ingest yet (skip Cureus/class SRs; oveporexton “approved” paper not written)
6. ~~Funnel CTA~~ **KEEP**
7. ~~`llms.txt` generator~~ **KEEP**
8. I-05 leftover: `wegovy-pill-launches-us.mdx` still has homepage/listing URLs (OASIS 1 path is not an NCT)

## Integrity added/stripped this run

- **Stripped:** NCT05765513-as-BPC, invented thymulin n=180 RCT, invented 125k tirzepatide-cancer cohort; `pmid-28013436` (opiorphin) left off the BPC post; two `verified: false` cancer sources removed
- **Cited (esummary this run):** 42198317, 40756949, 30915550, 34267654, 21030672, NCT07437547, 2657247, 8407057, 18476235, 40900093 (correct title), 40353578, 34170647, 35658024
- Ledger still 2,274 exists / 10 retired (full-tree `qa-pmids` ran in prebuild: 1294/514/577 resolve)
