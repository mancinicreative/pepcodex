# Audit B Report — Technical SEO, IA, Content, Accessibility, Analytics

**Auditor:** B (isolated)  
**Specialization:** Technical SEO, information architecture, content strategy, accessibility, analytics  
**Audit date:** 2026-09-02  
**Site:** https://www.pepcodex.com  
**Repo tree:** `feat/scoring-and-freshness` (HEAD at freeze `f1b91e0`) — not production `main`  
**Mode:** AUDIT ONLY. No site edits.

First-party Search Console and GA4 are **LIVE PULL BLOCKED** (`invalid_rapt`). Any impression, click, CTR, ranking, or conversion figure below is either **BASELINE UNAVAILABLE** or explicitly dated historical (2026-07-24/25). No invented volumes, KD, traffic, backlinks, or competitor performance.

---

## 1. Auditor name and specialization

Auditor B. Lens: crawlability and indexability, robots/sitemaps/canonicals/status codes, internal linking and crawl-graph depth, scaled/thin/doorway risk, titles/snippets/schema, trust and YMYL signals, accessibility and intrusive UX, analytics/consent, and whether additional URLs can earn impressions without worsening crawl budget.

Not in scope for this auditor: line-by-line medical claim verification (Audit A) or clinic outreach/monetization design as an operator (Audit C). Directory *quality of claims on the page* is in scope where it affects SEO, schema, and user safety.

---

## 2. Inventory assigned, inspected, inaccessible, and omitted

Frozen inventory: **1343 surfaces** (INVENTORY-SUMMARY.json). Machine table: `COVERAGE.json` (100% of `surface_id`s).

| Status | Count | Meaning in this audit |
|---|---|---|
| INSPECTED | 71 | Full or substantial file and/or live HTML read |
| SAMPLED | 1272 | Title/description/dates/robots + H1 + first/last claim + word count (applied to **all** MDX, not only 20%) |
| INACCESSIBLE | 0 of frozen IDs | — |
| OMITTED | 0 | — |

**Deep-read (file + live where a URL exists):** homepage; `/directory`; `/clinics` + `[city].astro` FAQ/schema; trust pages (`/about`, `/methodology`, `/editorial-policy`, `/advertising-policy`, `/disclaimer`, `/fda-notice`, `/privacy`, `/terms`, `/cookie-policy`, `/contact` live); BaseLayout, DossierLayout, ComparisonLayout, CalculatorLayout, BlogLayout; Organization/Drug/FAQ/Article/Breadcrumb/HowTo/ItemList schema; CookieConsent, AppWaitlistCTA, FeaturedClinicCard, ExitIntentPopup (unused); peptide-condition template; tesamorelin calculator MDX; semaglutide, bpc-157, pancragen openings; comparison samples (thin AOD-9604 vs semaglutide; thick tirzepatide vs semaglutide); BPC-157 blog vs guide pair; glossary `a1c`; Miami city MDX; `llms.txt.ts`; analytics.ts; `astro.config.mjs`; `vercel.json`; live robots/sitemaps.

**Sampled at ≥20% and actually 100% of type via frontmatter extraction:** remaining peptides, 295 peptide-condition, 269 comparisons, 215 glossary, 140 blog, 60 cities, 52 clinic records (inventory extra fields), 15 conditions, 46 source-packs (presence only).

**Live HTTP:** 52 URLs on 2026-09-02 (see `_work/live-probes.json`), including apex 308, sitemap-index, robots, `/clinics` noindex, `/directory`, a comparison, glossary noindex term, peptides, live-only blog `/blog/2025-glp1-year-review`, repo-not-in-sitemap blog `/blog/antimicrobial-peptide-funding` (200 anyway), calculators, trust, `llms.txt`, `/logo.png` 404, `/api/health`, vanity 308s, unknown path 404.

**Inaccessible (not frozen IDs, still material):**

- Current GSC and GA4 (ADC `invalid_rapt`).
- Core Web Vitals / CrUX / Lighthouse (not run; BASELINE UNAVAILABLE).
- Automated contrast (axe) (not run; BASELINE UNAVAILABLE).
- `src/pages/sponsors/` directory listing is empty — no public sponsor page in inventory.
- Production `main` source tree (inferred via live HTML/headers/sitemap only).
- Private CMS, email, affiliate dashboards: none in repo (UNAVAILABLE).

**Coverage percentages (frozen inventory):** 100% reconciled; 5.3% INSPECTED (71/1343); 94.7% SAMPLED. Mandate deep-reads not fully completed: 17/20 named peptides (frontmatter only), 35/36 guides, 30/31 safety, 3/3 protocols (word counts only), 15/32 templates, 52 clinic MDX bodies (fields sampled, not prose).

---

## 3. Findings ledger

Atomic findings: `FINDINGS.json` (B-001–B-032). Severity mix: **2 CRITICAL, 14 HIGH, 10 MEDIUM, 6 LOW**.

| ID | Severity | One-line |
|---|---|---|
| B-001 | HIGH | Sitewide `X-Robots-Tag: index, follow` conflicts with HTML `noindex` |
| B-002 | CRITICAL | Drug schema hardcodes “research use only / not FDA approved” + subcutaneous on **all** dossiers |
| B-003 | CRITICAL | City FAQPage says “multiple” clinics when count is 0; 52/52 websites `example.com` with 50 `verifiedListing: true` |
| B-004 | HIGH | 181/269 comparisons <200 words; 265 templated titles; 73 YAML-leaked descriptions |
| B-005 | HIGH | 295 programmatic peptide-condition URLs at depth 3 |
| B-006 | HIGH | 36 blog/guide identical slugs, both 200/indexable |
| B-007 | HIGH | Branch `vercel.json` 301s URLs that are 200 + sitemapped on production |
| B-008 | MEDIUM | Organization `logo.png` 404; empty `sameAs` |
| B-009 | MEDIUM | Live `llms.txt` stale (2026-02-18), superlative, trailing slashes |
| B-010 | MEDIUM | Homepage canonical slash vs sitemap; “Spring 2026” in September |
| B-011 | HIGH | Reconstitution calculator “desired dose” / volume-per-dose |
| B-012 | HIGH | BPC-157 meta: “no human trials yet” vs `sources.human: 2` |
| B-013 | MEDIUM | Indexable `/directory` coming-soon vs noindex `/clinics` listings |
| B-014 | HIGH | GA loads before consent default; GSC/GA4 blocked |
| B-015 | HIGH | No named author/reviewer; Article author = Organization |
| B-016 | MEDIUM | Sitewide FDA “not evaluated” over approved-drug library |
| B-017 | MEDIUM | Local graph healthy; `silent=1111` is missing GSC join, not a live indexation fact |
| B-018 | LOW | Sitemap lastmod from frontmatter; 31 static URLs have none |
| B-019 | MEDIUM | Hover-only Research menu; unused exit-intent component |
| B-020 | LOW | Breadcrumb JSON-LD relative / trailing-slash URLs |
| B-021 | MEDIUM | Semaglutide title “67 Studies” + “Updated Feb 2026” vs lastUpdated Aug |
| B-022 | HIGH | Nine indexable dossiers at 79–164 words |
| B-023 | LOW | robots.txt Allow all; `/api` crawlable |
| B-024 | LOW | Peptide filters are client-side — no faceted URL explosion (positive) |
| B-025 | HIGH | Live comparison blog still uses SURMOUNT-1 22.5% in SERP snippet (estimand) |
| B-026 | MEDIUM | Miami “premier / world-class / verified” doorway copy |
| B-027 | LOW | 404 canonicalizes to `/404` |
| B-028 | LOW | HowTo schema unused (keep it that way) |
| B-029 | LOW | 35 generic glossary noindex is the right budget move |
| B-030 | MEDIUM | App waitlist CTA exists in branch; conversion unmeasured |
| B-031 | MEDIUM | 15 thin `/conditions/*` pages |
| B-032 | LOW | Apex 308 and vanity 308s are single-hop (positive) |

P0 (unsafe / deceptive / serious regulatory): **B-002, B-003, B-011, B-012, B-025**.  
P1 (unsupported / major IA): **B-001, B-004, B-005, B-006, B-007, B-014, B-015, B-022**.  
P2 (SEO/IA/conversion): remainder HIGH/MEDIUM.  
P3: LOW.

---

## 4. Evidence ledger

| Evidence | Date | What it supports |
|---|---|---|
| Frozen inventory, reconciliation, live sitemap 1057 URLs | 2026-09-02T19:47Z | URL universe; 7 live-not-in-repo blogs; 60 repo-not-in-live |
| 52 live fetches (`_work/live-probes.json`) | 2026-09-02 | Status, `X-Robots-Tag`, meta robots, canonical, JSON-LD types |
| `sitemap-0.xml` | 2026-09-02 | 1057 URLs, 1026 lastmod |
| `graph-latest.json` | local dist snapshot 2026-09-02 | Depth, orphans, inbound; impressions **all 0** (GSC not joined) |
| Frontmatter extraction all MDX | 2026-09-02 | Word counts, title dups, robots |
| Comparison template counts | 2026-09-02 | 265/269 “Which Has Better Evidence?”; 73 YAML `>-`; 76 combo FAQs |
| Google Search Central spam policies | accessed 2026-09-02 | Scaled content abuse; doorway abuse |
| Google robots meta spec | accessed 2026-09-02 | Conflicting robots → more restrictive in Googlebot |
| FDA compounding / 503B proposal | FDA 2026-04-30; statement 2026-02-06 (page labeled 2026-09-01) | Fresh compounding topic for *existing* regulatory URLs |
| STAT BPC-157 | 2026-02-03 | Independent “scant evidence” coverage |
| Psychology Today BPC-157 | 2026-08-29 | Three small human studies, ~30 people, not RCTs |
| SERP reconstitution calculators | 2026-09-02 | Competitor tools are dose/syringe presets |
| Historical GSC writeup `.planning/SEO-AUDIT-FINDINGS.md` | **2026-07-24** | 16 months combined 121 clicks / 38,772 impressions **historical only** |
| Historical indexation notes | **2026-07-24/25** | “Discovered – not indexed” pattern **historical only** |

Googlebot: if HTML `noindex` and HTTP `index` conflict, Google’s spec says the **more restrictive** rule applies — so B-001 may still noindex in Google. That does **not** make the header correct.

---

## 5. Outdated-information list

| Item | Why outdated | Action |
|---|---|---|
| Live `llms.txt` “Last updated: 2026-02-18”, 92 dossiers, trailing slashes, “world’s most comprehensive” | Repo generator is newer; live file is production-stale | Deploy generator; drop superlative |
| Homepage “Spring 2026” | Audit date 2026-09-02 | Date or remove volume line |
| Semaglutide meta “Updated Feb 2026” | `lastUpdated` 2026-08-17 | Match visible date to frontmatter |
| BPC-157 meta “no human trials yet” / “Updated Feb 2026” | Contradicts `sources.human: 2`; lastUpdated Jan 22 | Rewrite snippet |
| Live blog SURMOUNT-1 **22.5%** in SERP extract | Published treatment-regimen figure in project lessons is 20.9% (PMID 35658024) — **verify in Audit A**; do not treat 22.5% as the paper’s headline | Canonicalize to comparison page; label estimand |
| Trust pages “Last updated: January 2026” (disclaimer, FDA notice) vs privacy “June 2026” | Possible genuine last edit; not proof of fake dates | Only change if policy text actually changed |
| Drug schema “not FDA approved” on approved drugs | False today | B-002 |
| City “verified” / consultation **$100–$300** | Unsourced, not dated | Remove |
| Historical GSC July 2026 | Cannot be used as current performance | Re-pull |

Do **not** bump `lastmod` or `lastUpdated` without a material edit.

---

## 6. New-information opportunities

These are facts that could be added to **existing** URLs. They are not a license to mint pages.

1. **FDA 503B bulks proposal (2026-04-30)** excluding semaglutide, tirzepatide, liraglutide from the 503B bulks list (comment period cited to 2026-06-29; treat final status as UNKNOWN until the Federal Register docket is re-checked). Belongs on `/regulatory-tracker` and existing compounding blogs — not a new URL.
2. **FDA 2026-02-06 statement** of intent to restrict non-approved GLP-1 APIs and misleading “generic/same as” advertising. Same cluster.
3. **SURMOUNT-5** head-to-head (PMID 40353578, already on `/compare/tirzepatide-vs-semaglutide` in this branch). Ensure production comparison, not the 2026 blog, is the canonical URL.
4. **BPC-157 independent reviews (2026)** STAT and Psychology Today: literature concentrated in one group; human N tiny. Use as *context that independent reviewers exist*, not as PepCodex’s own clinical conclusion. Update dossier + safety + guide.
5. **Tesamorelin / Egrifta** manufacturer reconstitution is not interchangeable with research-vial math (already stated in calculator MDX). Elevate that on the dossier, not a new calculator.

Details: `OPPORTUNITIES.json` items tagged `existing`.

---

## 7. Content and blog opportunities

**Threshold:** A blog is not approved because a keyword exists. Crawl budget is binding. **Default is merge/redirect/noindex, not publish.**

Defensible work (full records in `OPPORTUNITIES.json`):

- Collapse 36 `what-is-*` blog/guide pairs to one definition URL.
- Keep ~84 comparisons with ≥500 words; noindex+301 the 181 thin shells.
- Stop peptide-condition URL growth; fold into dossiers.
- noindex thin Khavinson dossiers (B-022).
- One GLP-1 approved-drug comparison hub instead of many pairwise shells.
- Refresh `/regulatory-tracker` with 2026 compounding actions.
- Fix snippets (B-012, B-021, YAML leak).
- Named editor on `/about` (not 20 author URLs).
- Do **not** build more reconstitution calculators to compete with syringe-preset apps.

SERP notes (2026-09-02, English, tool = unlocalized web search; **not** a ranked US-mobile SERP export):

| Query | PepCodex URL seen | Other pages answering the job |
|---|---|---|
| semaglutide vs tirzepatide | `/blog/semaglutide-vs-tirzepatide-2026` (live, not in this branch’s expected sitemap) | NEJM SURMOUNT-5; Drugs.com/GoodRx-class pages (not fetched as full pages) |
| BPC-157 | dossier/guide exist | STAT 2026-02-03; Psychology Today 2026-08-29; clinic marketing |
| peptide reconstitution calculator | tesamorelin calculator live | peptidecalcs.com, peppal.app, pepzilla.app — dose/syringe tools |
| FDA compounding GLP-1 | repo blogs exist | FDA.gov 2026-04-30 / 2026-02-06 |

---

## 8. Directory opportunities

The directory is **not** an indexation opportunity today.

- `/directory`: coming soon, **indexable**, promises “verified” clinics.
- `/clinics` + 60 cities: **noindex**, excluded from sitemap (correct budget move).
- 52 records: **52 placeholder websites**, 10 placeholder phones, **50 verifiedListing true**, 3 featured.
- 12 cities have **zero** clinics but still get templated FAQs saying “multiple”.
- Miami copy: “premier destination”, “world-class”, “verified providers”.

**Do not reindex city pages** until official clinic websites replace `example.com` and “verified” is defined with a last-checked date. **Do not add more city URLs.** Opportunity is data repair + one honest IA URL, not local-pack SEO.

---

## 9. Monetization opportunities and conflicts

Audit B does not design commissions. Conflicts visible on SEO/trust surfaces:

- Advertising policy allows founding partners and featured clinic listings; `/advertising-policy` lists **no current sponsors**. Featured clinic CTA: “Featured listings appear at the top with enhanced visibility.”
- `verifiedListing` on placeholder records would make a paid “verified” badge deceptive.
- Affiliate/selling peptides is parked (INPUTS). Do not add affiliate modules to dossiers or calculators.
- App waitlist (this branch) is the intended conversion; it must not be an indexable `/app` doorway.
- Comparison FAQs “can they be used together?” plus calculator “desired dose” are monetizable in the grey-market SERP and should **not** be.

Recommendation labels: **DEFER** directory paid listings until records are real; **REJECT** ranking-for-pay on city pages; **PURSUE** waitlist event only after analytics works.

---

## 10. Unknowns and missing inputs

1. Current GSC index coverage, queries, impressions, CTR, device split — **BASELINE UNAVAILABLE**.
2. Current GA4 human sessions, conversion events, bot fraction — **BASELINE UNAVAILABLE**.
3. CrUX / LCP / INP / CLS — **BASELINE UNAVAILABLE**.
4. Contrast ratios — **BASELINE UNAVAILABLE**.
5. Whether production `main` `vercel.json` still lacks the 301s present in this branch.
6. Final FDA determination on 503B bulks list after the 2026 comment period.
7. Whether `PUBLIC_GA_TRACKING_ID` is set on production (GA snippet is conditional).
8. Real clinic websites/licenses (Audit C).
9. Named human authors (owner must supply; do not fabricate).
10. Indexation status of noindex pages under conflicting `X-Robots-Tag` in Bing/other crawlers.
11. Full body read of 31 safety + 36 guides + 17 named peptides (remaining).

---

## 11. Strongest finding

**B-002 + B-003 together:** the site simultaneously (a) tells machines that FDA-approved drugs are “research use only / not FDA approved / subcutaneous injection,” and (b) tells users that placeholder `example.com` clinics are “verified” and that empty cities have “multiple” peptide clinics, with unsourced $100–$300 consult prices in FAQPage schema.

That is a YMYL integrity failure independent of traffic. It is also the kind of scaled, templated, location-and-entity markup Google’s spam policies describe. Crawl-budget strategy (noindex clinics) is the right *direction* and does not excuse the on-page falsehoods for anyone who still loads the HTML.

---

## 12. Weakest finding

**B-025** (SURMOUNT-1 22.5% on a live blog) is a **preliminary** finding from a search snippet plus project lessons, not a re-opened NEJM table. It could be wrong if the live page was already corrected below the fold or if the snippet is stale. Confidence medium. It still correctly shows **cannibalization** of the comparison intent.

**B-016** (overbroad FDA notice) is an inference about reader confusion, not a citation error.

---

## 13. Likely blind spot

- **Production HTML vs this branch.** Live `llms.txt`, live 200s on URLs this branch 301s, and live tesamorelin calculator mean Audit B’s template reads can describe code that is **not** what Googlebot fetched. Findings about DossierLayout Drug schema were verified in **repo**; live peptide JSON-LD types were Organization-only in the homepage probe — dossiers were not fully body-scraped for Drug JSON-LD on production. **Falsification test:** view-source `/peptides/semaglutide` on production for `legalStatus`.
- **GSC silence.** Historical July 2026 “923 never-impressed URLs” may have changed. The local graph’s `silent: 1111` is an artifact of impressions=0.
- **Accessibility** without a browser keyboard pass on production CSS.
- **Safety/guide bodies** not line-read (Audit A overlap).

---

## 14. Evidence that could falsify a major conclusion

Major conclusion: **index bloat from thin programmatic comparisons, peptide-condition pages, and duplicate what-is URLs is the binding SEO constraint, and the fix is net URL reduction — not publishing more.**

This would be falsified if a **current** GSC export (post-reauth) showed that thin comparisons and peptide-condition URLs already earn material **non-brand clicks** with acceptable CTR, while hub/dossier pages do not. Until that export exists, the working rule remains the measured 2026-08 crawl-budget constraint in project files plus the 2026-09-02 inventory of 1057 live sitemap URLs and 181 sub-200-word comparisons.

A second major conclusion (Drug schema is live and false) is falsified if production dossier HTML does not contain the hardcoded `legalStatus` string.

---

## Technical SEO snapshot (supporting sections 3–4)

**Crawlability:** `robots.txt` Allow all. Static HTML. `trailingSlash: never`. Client-side peptide filters (no parameter URLs). No pagination. Clinics excluded from sitemap. Glossary noindex terms excluded. Graph (local): 0 broken targets, median depth 2, no depth>3, 83 low-inbound, 2 indexable unreachable (`/glossary/off-label` already 301s live; Google verification HTML).

**Indexability:** HTML `noindex, follow` on clinics, 35 glossary terms, 1 blog, 404. HTTP header still `index, follow` on everything probed. Homepage canonical has a trailing slash; sitemap loc does not.

**Status/redirects:** Apex 308 www. Vanity 308s single-hop. `sitemap.xml` 307. Production ≠ this branch for several 301s (B-007). `/calculator/reconstitution/bpc-157` live **404** (not in the four calculator files). Tesamorelin calculator live **200**.

**Scaled content (people-first test):**

| Type | n | Distinct useful content? |
|---|---|---|
| Comparisons | 269 | **Mostly no.** 181 <200 words, stamped titles/FAQs. ~84 may be keepers. |
| Glossary | 215 | Mixed. Generic 35 correctly noindexed; remainder often real definitions (median 618 words). |
| Peptide-condition | 295 | **Programmatic.** Unique payload is a short `researchSummary`. Doorway-adjacent. |
| City pages | 60 | **No as SEO.** Frontmatter blurbs + cloned FAQs; correctly noindexed. |
| Thin peptides | 9 | **No.** 79–164 words. |

**Trust:** Methodology and editorial pages exist and are linked. No person, no reviewer, no public correction log. Advertising policy is clear but unused. App CTA in branch is the conversion path; measurement is down.

**Accessibility:** Skip-link, `lang=en`, reduced-motion, cookie `role=dialog`, mobile menu focus trap. Failures: hover-only desktop Research, footer h4s, consent race, unused exit-intent, contrast unmeasured.

**Analytics:** GA4 + Vercel Analytics + custom events (search, comparison_click, newsletter_signup, external_link, scroll_depth). Consent default is late. **No current numbers.**

---

## Recommended sequence (not implementation)

1. Fix Drug schema and city FAQ/verified placeholders (safety).  
2. Remove sitewide `X-Robots-Tag: index`.  
3. Repair GSC/GA4 auth.  
4. Net-reduce URLs: thin comparisons, peptide-condition, duplicate what-is blogs, thin bioregulators.  
5. Align production redirects with an explicit URL disposition list.  
6. Then measure impressions. Do not publish more first.
