# TECHNICAL-SEO — W2-T1 owner-action (L3)

**Loop:** L3 Technical SEO hygiene  
**Increment:** W2-T1  
**Date:** 2026-09-02  
**Agent:** T (this file only). **No `src/` edits. No `vercel.json` edit. No `trailingSlash` change.**  
**Corrections layer (read before any SEO-audit remnant):** [`.planning/SEO-AUDIT-CORRECTIONS.md`](../../../SEO-AUDIT-CORRECTIONS.md)  
**Quality bar:** `.planning/seo-engine/LOOPS.md` L3. Protected: URL structure, host canonical config.  
**Verdict: not KEEP.** This is an owner-action + overturned-claims artifact. Quality Judge closes L3. Implementer does not self-pass.

Live GSC/GA4 for this engine run: **not on disk.** Gate 0 is `invalid_rapt` (`AUTH-BLOCKED.md`). Trailing-slash pair counts, `searchAppearance` rows, and brand-query clicks below are the **2026-07-25** export (apex 2026-01-27→2026-07-22 / 177d; www 2026-05-28→2026-07-22 / 56d). Do not treat them as current.

---

## 1. Scoreboard — done / owner-action / won't-do

| Item | Bucket | Act? |
|---|---|---|
| Apex→www status code | **Owner-action** | Dashboard only. `vercel.json` already `statusCode: 308`. Do not touch JSON. |
| Trailing-slash duplicate index (historically 178 pairs) | **Note only** | Do not change `trailingSlash: 'never'`. Canonical + sitemap already no-slash. |
| `searchAppearance` empty despite JSON-LD | **Diagnose only** | Do not spray more schema. Re-pull after OAuth. |
| Homepage title for brand recall (`peptide codex` / `pepdoc`) | **Hygiene allowed later** | Existing `/` title/description only. **No new microsite / no new URL.** |
| Sitemap `lastmod` from frontmatter | **Already in repo** | `astro.config.mjs` `serialize` + `buildLastmodMap()`. Keep. Do not re-implement. |
| Raw `/clinics/*.mdx` URLs | **Must not come back** | Five 301s already in `vercel.json`; sitemap excludes `.mdx` and `/clinics/`. |
| Title-length as CTR strategy | **Won't-do — overturned (A4)** | Suffix hygiene in `BaseLayout` may stay; do not sell as a CTR win. |
| 307 "fix" in `vercel.json` | **Won't-do — overturned (A3)** | Code change is a no-op. |
| More GLP-1 vs GLP-1 pages for volume | **Won't-do — overturned (B8)** | Not an L3 action. Judge fails anyone who ships this. |
| "16 months of data" planning | **Won't-do — overturned (A1)** | Window is 177d / 56d. |
| "DR 3.3 makes top-5 impossible" | **Won't-do — overturned (B9)** | Site already holds pos 3–7 on under-covered pairs. |
| Query-export silence = no demand | **Won't-do — overturned (A2)** | Query cut is censored. |

---

## 2. Owner-action — Vercel dashboard apex→www

**Corrections A3.** `vercel.json` already declares host redirect `pepcodex.com` → `https://www.pepcodex.com/:path*` with `statusCode: 308` (HEAD of this repo). The July diagnosis: the **live** 307 came from Vercel's **dashboard domain-redirect**, which pre-empts the file. Editing JSON again changes nothing. That is why L3 forbids a `vercel.json` "fix."

### Live check this increment (2026-09-02, `curl.exe -sI --max-redirs 0`)

| Request | Status | Location |
|---|---|---|
| `https://pepcodex.com/` | **308** Permanent Redirect | `https://www.pepcodex.com/` |
| `https://pepcodex.com/peptides/bpc-157` | **308** | `https://www.pepcodex.com/peptides/bpc-157` |
| `https://www.pepcodex.com/peptides/bpc-157/` | **308** | `/peptides/bpc-157` |

Edge: `Server: Vercel`, `X-Vercel-Id` `fra1`. The **public hop is 308 today.** That does **not** authorize a code change, and it does **not** close the owner action.

Possible explanations (do not pick one in code):

1. Dashboard redirect was already switched to Permanent.
2. `vercel.json` 308 is now the hop that wins.
3. A prior dashboard Temporary (307) was changed outside this increment.

**Lucas click (still required as verify-or-set):**

1. Vercel → pepcodex project → **Settings → Domains**.
2. Find apex `pepcodex.com` redirect to `www.pepcodex.com`.
3. Confirm the UI says **Permanent / 308**, not Temporary / 307.
4. If it still says Temporary: change to Permanent. Save. Do not add a second redirect in the repo.
5. Re-check: `curl.exe -sI --max-redirs 0 https://pepcodex.com/` → 308, `Location: https://www.pepcodex.com/`.
6. After Gate 0 OAuth: GSC URL Inspection on an apex URL — confirm Google sees the permanent hop (indexing lag is expected).

**Do not:** edit `vercel.json`, change `site` / canonical host, add a 301/308 pair in Astro, or "test" by flipping `trailingSlash`.

---

## 3. Trailing-slash duplicates — note only

**Corrections B3.** Google historically indexed **both** `/path` and `/path/` for **178 URL pairs**. The 189 slash URLs held **24,300 impressions — 62.7%** of the then-pooled total — and 26 of 121 clicks. The sitemap contained **zero** trailing-slash URLs. That mismatch (sitemap declares the no-slash form; Google was showing the slash form) is the first-order sitemap fact. Missing `lastmod` is second-order and is already wired (see §6).

**INDEXATION-DIAGNOSIS.md** later called the slash pile **legacy and resolving**: apex was 71.8% slash impressions vs www 18.1% with zero slash clicks; slash URLs already 308. Do not re-open that as a config experiment.

### What is already consistent (do not "fix")

| Surface | Form | Where |
|---|---|---|
| Astro | `trailingSlash: 'never'` | `astro.config.mjs` |
| Vercel | `"trailingSlash": false` | `vercel.json` |
| Canonical | `new URL(Astro.url.pathname, Astro.site)` on `https://www.pepcodex.com` | `BaseLayout.astro` — no trailing slash |
| Sitemap | filter + `serialize` strip `/`; `site` is www | `astro.config.mjs` |
| Live slash hop (2026-09-02) | 308 → no-slash path | see §2 table |

**L3 rule:** strengthen **canonical + sitemap consistency** as a note. Both already advertise **www + never-slash**. Internal hrefs that still emit a trailing slash cost a 308 hop (L2 residual class; not this increment). Do **not** change `trailingSlash`.

**After OAuth:** re-count GSC page-export pairs (`/path` vs `/path/`). If the 178-pair class is gone or collapsing, log the new count in MEASUREMENT. If it is still large, the lever is still **Google consolidating to the canonical**, not a config flip.

---

## 4. `searchAppearance` empty — diagnose, do not spray schema

**Corrections B11.** The 2026-07-25 GSC `searchAppearance` dimension returned **zero rows**. No rich result (FAQ, sitelink, article, etc.) had been recorded. That is **not** "missing JSON-LD." Organization JSON-LD is on every page (`BaseLayout` → `OrganizationSchema`). Dossier layouts also emit Article, Breadcrumb, FAQ, and Drug (`DossierLayout.astro`). B11 also noted **612 pages including all then-155 blog posts** carried no *page-entity* schema — Organization-only.

### Why empty `searchAppearance` is the expected GSC shape here

1. **The API only lists appearances Google actually showed.** Zero rows means zero earned features in that window, not a parse failure.
2. **YMYL / medical.** Drug + FAQ on peptide dossiers is the class Google is most conservative about. Extra types do not unlock a feature Google is withholding.
3. **Organization on every URL is not a rich-result type.** It will not fill `searchAppearance`.
4. **Blog half historically Organization-only.** Adding Article/FAQ sitewide to "cover" B11 is schema spray. L3 forbids it.
5. **This run cannot re-query GSC.** `AUTH-BLOCKED.md`. A 2026-09 empty-or-not claim without a new pull is invented.

**Won't-do:** new schema components, FAQ blocks written for rich results, MedicalWebPage / speakable / sitelink-searchbox experiments, or "100% JSON-LD coverage" as a KPI.

**Owner after OAuth:** `gsc:repull` includes `searchAppearance`. If still empty, leave it. If a type appears, record the type + page — do not add more markup to chase a second type.

---

## 5. Brand SERP — homepage hygiene, not a microsite

**Corrections B10.** Query export (censored — A2) showed **zero** rows containing `pepcodex`, but recall variants converted:

| Query (2026-07-25 query export) | Note |
|---|---|
| `peptide codex` | 4 clicks, pos 4.4 |
| `codex peptide` | pos 1.8 |
| `pepdoc` | pos 4.5 |
| `pepco peptides` | pos 2.7 |

Six of the www property's 40 clicks (**15%**) were people failing to remember the brand. That is a **homepage title/description** job, not a `/peptide-codex` or `/pepdoc` URL.

**Current `/` title** (`src/pages/index.astro` → `BaseLayout`): `Evidence-Based Peptide Research` → branded `Evidence-Based Peptide Research | PepCodex` (fits the 60-char suffix rule). Default description does not include the recall strings.

**Allowed later (not this increment; no `src/` in W2-T1):** one homepage `<title>` / meta description pass that includes **PepCodex** plus a recall token (`peptide codex` as natural language, not keyword stuffing). H1 may stay editorial. **Forbidden:** new brand microsite, new slug, blog-as-brand-hub, or a second domain.

Title suffix truncation in `BaseLayout` (drop ` | PepCodex` when branded length > 60) is **hygiene**, not a CTR strategy (A4 / Simpson). Do not reopen title-length as L3 work.

---

## 6. Already in repo — do not re-implement as L3

| Hygiene | Status | Leave it |
|---|---|---|
| Sitemap `lastmod` from `lastUpdated` / `publishDate` | Wired in `astro.config.mjs` `serialize` | July INDEXATION "no lastmod on 1,221 URLs" is **stale**. Keep the map. |
| Clinics out of sitemap + `noindex, follow` | `SITEMAP_EXCLUDE` / clinics filter | `noindex` without sitemap-drop does not save crawl budget. Do not put clinics back. |
| Clinic `.mdx` 301s | Five rows in `vercel.json` | Do not delete. Do not emit `.mdx` hrefs again. |
| `site: 'https://www.pepcodex.com'` | `astro.config.mjs` | Do not flip canonical host. |
| Brand suffix ≤60 | `BaseLayout.astro` | Hygiene only. |

---

## 7. Overturned — Judge fails the increment if anyone acts on these as true

These are the load-bearing reversals in [`.planning/SEO-AUDIT-CORRECTIONS.md`](../../../SEO-AUDIT-CORRECTIONS.md). They also sit in `LOOPS.md` L3. Acting on them (or on `SEO-AUDIT-FINDINGS.md` / `SEO-GROWTH-STRATEGY.md` / `SEO-IMPROVEMENT-PLAN.md` without this layer) is an L3 fail.

| Overturned claim | Section | Why it is dead | What a fail looks like |
|---|---|---|---|
| **"16 months of data"** | A1 | Google returned **177 days** (apex from 2026-01-27) and **56 days** (www from 2026-05-28). Requested 16 months; returned everything it had. Per-month figures divided by 16 are ~2.7× wrong. | Any plan, title test, or "authority ceiling" that uses a 16-month window or 16-month rates. |
| **"Title length is the CTR bottleneck"** | A4 | Crude long-title OR 0.34; **stratified by section they look 1.9× better** (MH OR 1.894). `/compare/` long titles 2.258% vs 0.936%. Data cannot detect a length effect. | Shipping a sitewide title-shortening pass sold as a CTR win. Suffix hygiene without that claim is allowed. |
| **"More GLP-1 vs GLP-1 for volume"** | B8 | Top positions are **under-covered pairs** (kristagen-vs-thymalin 3.3, cagrilintide-vs-survodutide 3.5, …). Sema/tirz/reta are media-saturated. | New or cloned semaglutide-vs-tirzepatide (etc.) URLs "for volume." Existing `/blog/semaglutide-vs-tirzepatide-2026` is optimize-in-place, not a reason to add siblings. |
| **"DR 3.3 makes top-5 impossible"** | B9 | Site already holds **positions 3.3–7.7 on ~20 comparison pages**. Authority is enough where no authoritative competitor exists. Binding constraint there is **demand**, not DR. | "Build backlinks first or we cannot rank" as the L3/L6 strategy; using DR to justify publishing more. |
| **Query-export silence = no demand** | A2 | Query dimension historically held ~33% of impressions / ~15% of clicks (MEASUREMENT apex: page 32,193 impr / 81 clicks vs query 9,784 / **7** — **30% impr, 9% clicks**). Withheld set held most clicks. | "Nobody searches X" because X is missing from the query file. KPIs are **page + device + country**. |

Also overturned for L3 (do not re-litigate as technical work):

- **A3** — `vercel.json` 308 is already correct; dashboard was the 307 source.
- **A5** — "/blog/ is the worst section" is not Bonferroni-supported; do not noindex the blog as hygiene.
- **A7** — "0 canonical mismatches" was a sitemap-seeded crawler artifact.

---

## 8. Blocked on Lucas

1. **OAuth** — Desktop client line in `AUTH-BLOCKED.md`. Then `gsc:whoami` → `gsc:sites` → `gsc:repull` → `ga4:pull`. Needed to refresh trailing-slash pair counts, `searchAppearance`, and brand-query rows.
2. **Vercel Domains UI** — confirm apex→www is Permanent (308). §2. Live hop is already 308; dashboard still needs a human eyeball so Temporary cannot come back.
3. **Not this loop:** Firewall (`BOT-WAF-DRAFT.md`), GA4 filter click, GSC Request indexing on `/peptides` `/trials` `/regulatory-tracker`.

---

## 9. Commands actually run

```
curl.exe -sI --max-redirs 0 https://pepcodex.com/
curl.exe -sI --max-redirs 0 https://pepcodex.com/peptides/bpc-157
curl.exe -sI --max-redirs 0 https://www.pepcodex.com/peptides/bpc-157/
```

Read (not edited): `.planning/SEO-AUDIT-CORRECTIONS.md`, `LOOPS.md` L3, `ORCHESTRATOR.md` §1, `vercel.json`, `astro.config.mjs`, `BaseLayout.astro`, `src/pages/index.astro`, `OrganizationSchema.astro`, `ArticleSchema.astro`, `DrugSchema.astro`, `AUTH-BLOCKED.md`, `MEASUREMENT.md`, `INDEXATION-DIAGNOSIS.md`, `REMAINING-PLAN.md`.

**Not run:** `astro build`, `graph:check`, `gsc:repull`, any write under `src/` or `vercel.json`.

---

## 8-line summary (for Conductor)

1. Artifact: `.planning/seo-engine/runs/2026-09-01/TECHNICAL-SEO.md` — **not KEEP**.
2. Corrections layer is `SEO-AUDIT-CORRECTIONS.md`; Judge fails A1 / A2 / A4 / B8 / B9 acting-as-true.
3. `vercel.json` already 308; **do not edit JSON**. Owner: Vercel Domains → Permanent. Live HEAD 2026-09-02 already 308 to www.
4. Trailing slash: historically 178 pairs / 62.7% impr on slash URLs. `trailingSlash: 'never'` stays. Canonical + sitemap already www/no-slash; live slash hop is 308.
5. `searchAppearance` was empty in the 2026-07-25 pull despite Organization (+ dossier Article/FAQ/Drug). Diagnose only; no schema spray. Re-pull after OAuth.
6. Brand SERP: `peptide codex` / `pepdoc` — homepage title/description hygiene later; **no microsite**.
7. Lastmod + clinic `.mdx` 301s + sitemap excludes are already in repo; not L3 work.
8. Blocked: Lucas OAuth + dashboard confirm. No src edits this increment.
