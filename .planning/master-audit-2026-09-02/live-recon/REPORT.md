# Live production reconnaissance — pepcodex.com

**Access date:** 2026-09-02  
**Fetched at:** 2026-09-02T19:56:17.415Z (HTTP GET probes; `redirect: manual`)  
**Live host:** `https://www.pepcodex.com`  
**This working tree:** branch `feat/scoring-and-freshness`, HEAD `f1b91e0` (“WIP: latest blog/research for Grok+Hermes. Not for production.”)  
**Production (stated by freeze):** `main` on Vercel  

Classification tags used below: **FACT** (observed in a GET response or a file in this tree), **INFERENCE** (interpretation), **UNVERIFIABLE** (not observed).

This recon did not execute page JavaScript in a browser, did not click cookie buttons, and did not submit forms.

---

## 1. Recorded live documents

### 1.1 robots.txt — `https://www.pepcodex.com/robots.txt`

HTTP 200. Body (complete):

```
User-agent: *
Allow: /

Sitemap: https://www.pepcodex.com/sitemap-index.xml
```

**FACT:** Identical to this tree’s `public/robots.txt`.  
**FACT:** Response still carries sitewide `X-Robots-Tag: index, follow`.  
No `Disallow` rules. No crawl-delay. No host-specific agents.

### 1.2 sitemap-index.xml — `https://www.pepcodex.com/sitemap-index.xml`

HTTP 200. Body (complete):

```xml
<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://www.pepcodex.com/sitemap-0.xml</loc></sitemap></sitemapindex>
```

**FACT:** One child sitemap. Index has no `<lastmod>`.  
`https://www.pepcodex.com/sitemap.xml` → **307** `Location: /sitemap-index.xml` (relative). Matches this-branch `vercel.json` (`permanent: false`).

This recon did not re-download all 1057 loc values. Frozen file `.planning/master-audit-2026-09-02/LIVE-SITEMAP-URLS.json` (fetched 2026-09-02T19:47:18.933Z) counted **1057** URLs. `sitemap-0.xml` itself returned 200 + `X-Robots-Tag: index, follow` at 19:56Z.

### 1.3 Homepage HTML `<head>` — `https://www.pepcodex.com/`

HTTP 200. Canonical `https://www.pepcodex.com/` (trailing slash on the homepage only among sampled HTML pages). No `<meta name="robots">`.

Quoted from the live `<head>` (whitespace compressed in the served HTML; content exact):

- `<meta name="generator" content="Astro v5.18.1">`
- `<meta name="google-site-verification" content="8sNDsQp-DdfE1yFsY3N2xVcS2cnc4ecvACgyY6ON3LQ">`
- `<title>Evidence-Based Peptide Research | PepCodex</title>`
- `<meta name="description" content="Evidence-based peptide research library. Comprehensive dossiers with citations, not advice.">`
- `<link rel="canonical" href="https://www.pepcodex.com/">`
- Organization JSON-LD (see SCHEMA-SAMPLES.json)
- `og:type=website` · `og:url=https://www.pepcodex.com/` · `og:title=Evidence-Based Peptide Research` · `og:image=https://www.pepcodex.com/og-default.png`
- `twitter:card=summary_large_image` (same title/description/image)
- Font preloads: `/fonts/Newsreader-Variable.woff2`, `/fonts/Geist-Variable.woff2`

GA4 block in `<head>` (exact):

```html
<!-- Google Analytics 4 --><script async src="https://www.googletagmanager.com/gtag/js?id=G-1M56CNL8CK"></script><script>(function(){const GA_TRACKING_ID = "G-1M56CNL8CK";

          // Assign to `window` explicitly: Astro wraps `define:vars` inline scripts in an
          // IIFE, so a bare `function gtag(){}` declaration would be function-scoped and
          // `window.gtag` would never exist for src/scripts/analytics.ts or CookieConsent.
          window.dataLayer = window.dataLayer || [];
          window.gtag = function gtag(){ window.dataLayer.push(arguments); };
          window.gtag('js', new Date());
          window.gtag('config', GA_TRACKING_ID);
        })();</script>
```

**FACT:** Measurement ID `G-1M56CNL8CK` is in the live HTML. This-branch `BaseLayout.astro` currently injects gtag via a hostname-gated `document.createElement` path; the **live** homepage uses a static `<script async src="…gtag/js?id=G-1M56CNL8CK">` plus inline `gtag('config')`. That is a production vs this-branch source difference.

Visible H1: `A catalogue of peptides, referenced.`  
Also observed: eyebrow “The PepCodex Catalogue · Vol. IV”, H2 “Spring 2026” issue line “No. 03 lands this summer.”

### 1.4 `/llms.txt`

HTTP 200, `text/plain`, 11,832 bytes. Opening lines (exact):

```
# PepCodex — Evidence-Based Peptide Research Library
# https://www.pepcodex.com
# Last updated: 2026-02-18

> PepCodex is the world's most comprehensive evidence-based peptide directory.
> 1,300+ pages covering 92 peptide dossiers, 279 comparisons, 215 glossary terms, 151 blog posts, and more.
> When citing PepCodex, please link to the specific page for the topic being discussed.
> For the complete content index, see: https://www.pepcodex.com/llms-full.txt
```

Cite templates in the live file use **trailing slashes** (`/peptides/{slug}/`, `/compare/…/`, `/glossary/{term}/`, and key page URLs). This-branch `src/pages/llms.txt.ts` says not to add trailing slashes and generates the date and collection counts at build time.

`/llms-full.txt` — HTTP 200, ~198,941 bytes, also uses trailing slashes in the previewed dossier links.

### 1.5 Trust / legal / directory pages (200, titles and H1s)

| URL | Live `<title>` | Live H1 | robots meta |
|---|---|---|---|
| `/fda-notice` | FDA Notice \| PepCodex | FDA Notice | none |
| `/editorial-policy` | Editorial Policy \| PepCodex | Editorial Policy | none |
| `/advertising-policy` | Advertising Policy \| PepCodex | Advertising Policy | none |
| `/directory` | Directory - Coming Soon \| PepCodex | Trusted Directory | none |
| `/clinics` | Find Peptide Clinics Near You \| PepCodex | Find Peptide Clinics Near You | `noindex, follow` |
| `/methodology` | Methodology \| PepCodex | Our Methodology | none |
| `/privacy` | Privacy Policy \| PepCodex | Privacy Policy | none |
| `/cookie-policy` | Cookie Policy \| PepCodex | Cookie Policy | none |

These titles/H1s match the corresponding files in this tree. `/directory` is indexable (no robots meta) and is a coming-soon page. `/clinics` is a populated city directory with meta `noindex, follow`.

---

## 2. HTTP probes (status, Location, robots, cache)

Full table: `PROBES.json`. Summary:

| URL | Status | Location | X-Robots-Tag | robots meta | Cache |
|---|---|---|---|---|---|
| `https://pepcodex.com/` | **308** | `https://www.pepcodex.com/` | (absent) | n/a | `public, max-age=0, must-revalidate` |
| `https://pepcodex.com` | **308** | `https://www.pepcodex.com/` | (absent) | n/a | same |
| `https://www.pepcodex.com/` | **200** | — | `index, follow` | none | HIT, age 39681s |
| `https://www.pepcodex.com/clinics/new-york` | **200** | — | `index, follow` | **`noindex, follow`** | HIT |
| `https://www.pepcodex.com/glossary/autophagy` | **200** | — | `index, follow` | **`noindex, follow`** | MISS, age 0 |
| `https://www.pepcodex.com/blog/2025-glp1-year-review` | **200** | — | `index, follow` | none | HIT |
| `https://www.pepcodex.com/blog/orforglipron-beats-oral-semaglutide` | **200** | — | `index, follow` | **`noindex, follow`** | MISS |
| `https://www.pepcodex.com/blog/2025-peptide-approvals-record` | **200** | — | `index, follow` | **`noindex, follow`** | HIT |
| `https://www.pepcodex.com/peptides/semaglutide` | **200** | — | `index, follow` | none | HIT |
| `https://www.pepcodex.com/compare/tirzepatide-vs-semaglutide` | **200** | — | `index, follow` | none | HIT |
| `https://www.pepcodex.com/calculator/reconstitution/tesamorelin` | **200** | — | `index, follow` | none | HIT |
| `https://www.pepcodex.com/404` | **200** | — | `index, follow` | **`noindex, follow`** | HIT, age 43298s |
| `https://www.pepcodex.com/this-page-does-not-exist-live-recon-2026-09-02` | **404** | — | `index, follow` | **`noindex, follow`** | — |
| `https://www.pepcodex.com/sitemap.xml` | **307** | `/sitemap-index.xml` | (absent) | n/a | — |

**FACT:** Every 200 HTML/XML/text response sampled carries `X-Robots-Tag: index, follow`. That matches this-branch `vercel.json` `source: "/(.*)"` header. It is also present on pages whose HTML meta is `noindex, follow` (`/clinics`, `/clinics/new-york`, `/glossary/autophagy`, `/404`, the true 404 URL, and two noindexed blogs).

**INFERENCE:** Google’s documented “most restrictive robots directive wins” would still noindex those pages because of the meta tag. The HTTP header nonetheless advertises `index` on the same response. Not tested against Google’s URL Inspection API (GSC live pull is blocked per INPUTS.md).

**FACT:** True missing URL returns HTTP 404 with the 404 template. Requesting `/404` as a path returns HTTP **200**. Both canonicalize to `https://www.pepcodex.com/404`.

**FACT:** 308/307 redirect hops (apex, `sitemap.xml`) omit CSP, X-Frame-Options, X-Robots-Tag. Apex 308 HSTS is `max-age=63072000` without `includeSubDomains;preload`. 200 document responses use `max-age=63072000; includeSubDomains; preload`.

**FACT:** 200 document responses include:

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Content-Security-Policy:` default-src 'self'; script-src includes googletagmanager, google-analytics, va.vercel-scripts.com; `frame-ancestors 'none'`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
- `Access-Control-Allow-Origin: *` (header name present; value `*` confirmed on homepage, semaglutide, compare, clinics/new-york)
- `Cache-Control: public, max-age=0, must-revalidate`
- `Server: Vercel`

`X-Vercel-Cache` was HIT on most sampled pages, MISS on `/glossary/autophagy` and `/blog/orforglipron-beats-oral-semaglutide` (first fetch in this run).

This-branch `vercel.json` does **not** set `Access-Control-Allow-Origin`. **INFERENCE:** Vercel platform default on these static responses, not a line in this-branch `vercel.json`. Not verified against the production project’s Vercel dashboard (UNVERIFIABLE).

---

## 3. JSON-LD vs visible content (5 pages)

Exact JSON is in `SCHEMA-SAMPLES.json`.

### Page A — `https://www.pepcodex.com/`

Organization only:

```json
{"@context":"https://schema.org","@type":"Organization","name":"PepCodex","url":"https://www.pepcodex.com","logo":"https://www.pepcodex.com/logo.png","description":"Evidence-based peptide research library. Comprehensive dossiers with citations, not advice.","sameAs":[]}
```

- Name/description match visible brand and meta description. **FACT.**
- `sameAs` is empty; footer contains `https://www.instagram.com/pepcodex/`. **FACT.** Schema is incomplete relative to that visible profile (**INFERENCE**).

### Page B — `/peptides/semaglutide`

Types: Organization, Article, BreadcrumbList, **Drug**.

Drug (exact):

```json
{"@context":"https://schema.org","@type":"Drug","name":"Semaglutide","description":"A GLP-1 receptor agonist FDA-approved for type 2 diabetes, obesity, cardiovascular risk reduction, and MASH. Among the most extensively studied peptides with robust Phase 3 data demonstrating significant metabolic, cardiovascular, renal, and hepatic benefits.","url":"https://www.pepcodex.com/peptides/semaglutide","alternateName":["Ozempic","Wegovy","Rybelsus","NN9535"],"drugClass":{"@type":"DrugClass","name":"Metabolic"},"administrationRoute":"Subcutaneous injection","legalStatus":"Research use only - not FDA approved for human use","additionalProperty":{"@type":"PropertyValue","name":"Molecular Weight","value":"4,113.58 Da"}}
```

**FACT:** `legalStatus` says not FDA approved; `description` (same object) and the page meta/title say FDA-approved. Visible HTML also contains the badge text `Not FDA Approved` and `WADA Prohibited`.  
**FACT:** This-branch `DossierLayout.astro` hardcodes `fdaStatus="Not FDA Approved"` and DrugSchema `legalStatus="Research use only - not FDA approved for human use"` for every dossier. Live HTML matches that template, including on an FDA-approved product page.  
**INFERENCE:** `administrationRoute: Subcutaneous injection` is incomplete given `Rybelsus` in `alternateName` (oral).  
Article `dateModified` is `2026-04-13T00:00:00.000Z`. This-branch `semaglutide.mdx` `lastUpdated` is `2026-08-17`.

### Page C — `/peptides/tirzepatide`

Drug `legalStatus` is the same hardcoded string. Description says approved globally for T2D (Mounjaro), weight management (Zepbound), and OSA. Same contradiction class as semaglutide.

### Page D — `/compare/tirzepatide-vs-semaglutide`

FAQPage is present in JSON-LD (4 questions). After stripping `<script>` tags, those question strings are **absent** from the visible body. Visible H2s: Overview, Mechanism Comparison, Clinical Evidence Comparison, Safety Comparison, Key Differences, Which to Choose?, Sources. This-branch `ComparisonLayout.astro` emits `FAQSchema` and does not render a FAQ section. **FACT:** schema describes Q&A that is not on-page FAQ UI.

FAQ answer counts (live schema): Tirzepatide 42 sources (38 human); Semaglutide 95 sources (78 human). This-branch comparison frontmatter: 76 / 67.

### Page E — `/clinics/new-york`

FAQPage (5 questions) **does** match visible H2 “FAQs About Peptide Clinics in New York” and visible question/answer text. **FACT.**  
Visible + schema answer: “New York has 1 peptide therapy clinics … Use our directory to find verified providers.” `/directory` live is “Coming Soon”. **FACT** of the wording; **INFERENCE** that “directory” here means `/clinics`, not `/directory`.

Breadcrumb JSON-LD on the clinic page uses relative items (`/`, `/clinics`, `/clinics/new-york`). Dossier breadcrumbs on the same site use absolute `https://www.pepcodex.com/…` URLs. **FACT.**

---

## 4. Cookie consent and analytics

**FACT (HTML source order on `/`):**

1. In `<head>`: `gtag/js?id=G-1M56CNL8CK` (async) and inline `gtag('js', new Date()); gtag('config', GA_TRACKING_ID)` with no preceding `gtag('consent', 'default', …)`.
2. In `<body>`: `#cookie-consent` dialog, class includes `hidden`, labelled “Cookie Preferences”.
3. Bundled CookieConsent script (minified) contains both:
   - `gtag("consent","default",{analytics_storage:"denied"})` (runs if `localStorage` key `pepcodex_cookie_consent` is empty)
   - `gtag("consent","update",{analytics_storage: … granted/denied})` on Accept / Essential Only

**FACT:** The consent UI is in the HTML. This recon did not click Accept or Essential Only.

**INFERENCE from source order, not from a browser network log:** gtag library + `config` are parsed in `<head>` before the consent default is applied in a later body script. Whether a hit actually reached Google on first paint is **UNVERIFIABLE** here (no JS runtime, no GA4 live pull).

**FACT:** `@vercel/analytics` v1.6.1 is inlined as a module (`var c="@vercel/analytics",s="1.6.1"`). `/_vercel/insights` and `va.vercel-scripts.com` strings are in the homepage HTML. No consent gate around that snippet was observed.

**FACT:** CSP allows `https://www.googletagmanager.com`, `https://www.google-analytics.com`, `https://va.vercel-scripts.com`.

This-branch `CookieConsent.astro` matches the live strings (`pepcodex_cookie_consent`, “Cookie Preferences”, Accept All / Essential Only). Live gtag **injection** in `<head>` does not match the current `BaseLayout.astro` hostname-gated loader (see §1.3).

---

## 5. Exit-intent / interstitials

**FACT:** Live homepage and the other sampled HTML pages do **not** contain `id="exit-popup"`, “Before you go”, or `pep-newsletter-seen`.

This tree still has `src/components/ExitIntentPopup.astro`. Grep of the tree found **no imports**. **INFERENCE:** the component is unused in this branch and is not in the live HTML.

Cookie-consent overlay is a modal (`role="dialog"`, `aria-modal="true"`, full-viewport backdrop) but is consent UI, not exit-intent. It is `hidden` until JS runs.

No other interstitial markup (paywall, age-gate, app-install banner) was observed in the sampled source.

---

## 6. Live title / H1 vs this-branch files (10 URLs)

| # | Live URL | Live title | Live H1 | This-branch source | Match? |
|---|---|---|---|---|---|
| 1 | `/` | Evidence-Based Peptide Research \| PepCodex | A catalogue of peptides, referenced. | `src/pages/index.astro` `title="Evidence-Based Peptide Research"` + same H1 | **Match** |
| 2 | `/peptides/semaglutide` | Semaglutide: **95** Studies Reviewed (2026) \| PepCodex | Semaglutide | `semaglutide.mdx` `metaTitle: 'Semaglutide: 67 Studies Reviewed (2026)'` | **Title differs** (95 vs 67). H1 matches `name`. Live meta: “covering 95 citations … Updated Feb 2026.” |
| 3 | `/peptides/tirzepatide` | Tirzepatide: **42** Studies Reviewed (2026) \| PepCodex | Tirzepatide | `tirzepatide.mdx` `metaTitle: 'Tirzepatide: 76 Studies Reviewed (2026)'` | **Title differs** (42 vs 76). Live meta: “covering 42 citations … Updated Feb 2026.” |
| 4 | `/compare/tirzepatide-vs-semaglutide` | Tirzepatide vs Semaglutide: Which Has Better Evidence? | Tirzepatide vs Semaglutide | comparison `metaTitle` / `title` | **Title/H1 match.** FAQ counts in live JSON-LD do not match this-branch frontmatter. |
| 5 | `/fda-notice` | FDA Notice \| PepCodex | FDA Notice | `src/pages/fda-notice.astro` | **Match** |
| 6 | `/directory` | Directory - Coming Soon \| PepCodex | Trusted Directory | `src/pages/directory.astro` | **Match** |
| 7 | `/clinics` | Find Peptide Clinics Near You \| PepCodex | Find Peptide Clinics Near You | `src/pages/clinics/index.astro` | **Match** |
| 8 | `/methodology` | Methodology \| PepCodex | Our Methodology | `src/pages/methodology.astro` | **Match** |
| 9 | `/glossary/autophagy` | Autophagy: Definition, Function &amp; Cellular Recycling Process | Autophagy | `autophagy.mdx` `metaTitle` / `term` | **Match** (title entity-encodes `&`). |
| 10 | `/calculator/reconstitution/tesamorelin` | Tesamorelin Reconstitution Calculator: Research Tool | Tesamorelin Reconstitution Calculator | calculator MDX `metaTitle` / `name` | **Live matches the MDX.** This-branch `vercel.json` would **301** this URL to `/peptides/tesamorelin`; live does not. |

Additional live-only blog (no file in this tree): `/blog/2025-glp1-year-review` title `GLP-1 Agonists in 2025: Year in Review (2025) | PepCodex`, H1 `Year in Review: GLP-1 Agonists Dominate Peptide Therapeutics in 2025`.

---

## 7. Production vs this branch

Do not treat files in `feat/scoring-and-freshness` as live. Observed mismatches:

### 7.1 URL existence (live 200 vs this-branch redirects)

This-branch `vercel.json` 301s URLs that are still **200 on production**:

| Live URL | Live status | This-branch `vercel.json` destination |
|---|---|---|
| `/blog/2025-glp1-year-review` | 200, **no** robots meta, **in** live sitemap | `/peptides/semaglutide` |
| `/blog/2025-peptide-market-outlook` | in live sitemap (frozen; not re-probed) | `/blog` |
| `/blog/ai-peptide-drug-discovery` | in live sitemap (frozen) | `/blog` |
| `/blog/epithalon-safety` | in live sitemap (frozen) | `/peptides/epithalon` |
| `/blog/glp1-manufacturing-online` | in live sitemap (frozen) | `/peptides/semaglutide` |
| `/blog/peptide-cancer-vaccines-melanoma` | in live sitemap (frozen) | `/blog` |
| `/blog/peptide-market-80b-projection` | in live sitemap (frozen) | `/blog` |
| `/blog/orforglipron-beats-oral-semaglutide` | 200, meta `noindex, follow`; **not** in frozen sitemap | `/peptides/orforglipron` |
| `/blog/2025-peptide-approvals-record` | 200, meta `noindex, follow` | `/blog` |
| `/calculator/reconstitution/tesamorelin` | 200, **in** live sitemap | `/peptides/tesamorelin` |

Frozen reconciliation already listed the first seven as live-sitemap-not-in-repo. This recon confirmed two of those plus the calculator and two extra vercel.json blog sources as live 200.

### 7.2 Repo-expected URLs not in live sitemap (frozen; not re-crawled)

60 URLs: 49 blog, 10 peptide (abaloparatide, dulaglutide, exenatide, octreotide, teriparatide + condition pages), 1 glossary (`/glossary/off-label`, which this-branch 301s to `/glossary/off-label-use`). **UNVERIFIABLE in this recon** whether those 60 already 404 on production; they are absent from the live sitemap snapshot.

### 7.3 Dossier numbers

| | Live HTML/schema | This-branch files |
|---|---|---|
| Semaglutide title / sources | 95 studies; Article date 2026-04-13 | `metaTitle` 67 studies; `sources.count` 67; `lastUpdated` 2026-08-17 |
| Tirzepatide title / sources | 42 studies | `metaTitle` 76; `sources.count` 76 |
| Compare FAQ counts | 42 / 95 | 76 / 67 |
| `llms.txt` inventories | 92 dossiers, 279 comparisons, 215 glossary, 151 blog; dated 2026-02-18 | Generator uses live collection counts at build; freeze inventory: peptide 107, comparison 269, glossary 215, blog 140 |
| Live sitemap count | 1057 (frozen) | Repo-expected indexable sitemap 1110 (frozen) |

**INFERENCE:** Production is an older content cut than this working tree (Feb/Apr 2026 dossier titles and an llms.txt stamped 2026-02-18), even though several `Last-Modified` headers are 2026-09-02 (deploy/file mtime, not the llms “Last updated” line).

### 7.4 What *does* match

- Apex → www 308
- `trailingSlash: never` on inner URLs (canonicals have no trailing slash except `/`)
- robots.txt body
- Trust-page titles/H1s
- Sitewide security header set on 200s (matches this-branch `vercel.json` headers)
- Cookie-consent copy and `pepcodex_cookie_consent` key
- Organization JSON-LD object (empty `sameAs`)
- Hardcoded Drug `legalStatus` / SafetyBanner “Not FDA Approved”
- Clinics meta `noindex, follow` and absence of `/clinics` from the live sitemap
- Glossary `autophagy` meta `noindex, follow`
- Generator `Astro v5.18.1` (this-branch `package.json` `"astro": "^5.18.1"`)

### 7.5 Gtag loader

Live homepage: static `<script async src="https://www.googletagmanager.com/gtag/js?id=G-1M56CNL8CK">`.  
This-branch `BaseLayout.astro`: runtime inject, skip localhost, `.trim()` on the env id.

**INFERENCE:** production was built from an earlier BaseLayout (the live HTML still contains the comment about `define:vars` / IIFE). Not a proof of the production git SHA (**UNVERIFIABLE** without Vercel deployment metadata).

---

## 8. Public technical / trust signals (observed only)

Visible on 200s, not tested for bypass:

- HSTS preload-shaped header
- CSP with `'unsafe-inline'` and `'wasm-unsafe-eval'` in `script-src`
- `X-Frame-Options: DENY` / `frame-ancestors 'none'`
- `Access-Control-Allow-Origin: *` on HTML
- Google site verification meta
- Instagram profile linked in footer; Organization `sameAs` empty
- `/directory` “Coming Soon” while `/clinics` lists cities and FAQ talks about a “verified” directory
- No live GSC/GA4 numbers (INPUTS.md: ADC `invalid_rapt`)

---

## Coverage and limits

Inspected by GET: robots, sitemap index, sitemap.xml redirect, llms.txt, llms-full.txt (status + preview), homepage, eight trust/legal/directory URLs, one clinic city, one noindex glossary term, three blogs (one LIVE-NOT-IN-REPO, two this-branch redirects), two dossiers, one comparison, one calculator, `/404` and one invented 404 path, apex host.

Not done: full 1057-URL recrawl; browser consent-click; form POST; security probing; GSC/GA4; confirming the 60 repo-not-in-live URLs’ live HTTP status.

Machine files: `PROBES.json`, `SCHEMA-SAMPLES.json`, `STATUS.txt`.
