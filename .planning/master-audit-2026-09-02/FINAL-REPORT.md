# PepCodex Master Audit — Consolidated Report

**Status: `INCOMPLETE` — Council FAIL 80/100**  
**Audit date:** 2026-09-02  
**Operating mode:** AUDIT ONLY (no site edits, no outreach, no enrollments, no purchases)  
**Lead Auditor / LLM Council Chair:** this session  
**Project:** `C:\Users\manci\OneDrive\Documents\00_Claude\peptide-library`  
**Live:** https://www.pepcodex.com  
**Working tree at freeze:** `feat/scoring-and-freshness` @ `f1b91e0` — **not production `main`**

Accuracy, reader safety, and transparency override traffic, conversion, publishing volume, and revenue. The acceptance bar was **not** lowered.

Packet index: [INDEX.md](INDEX.md).

---

## 1. Executive assessment

PepCodex is an English-language, US-primary **peptide research library** (dossiers, comparisons, guides, safety, glossary) with a **demo clinic directory** that is still live in HTML, a **coming-soon `/directory`**, and an intended conversion to **PepTracker** that is only partially wired.

Four facts, independently confirmed by source files, live HTML (2026-09-02), NCBI esummary, and FDA pages, override every growth idea:

1. **Every peptide dossier** hardcodes `fdaStatus="Not FDA Approved"`, `wadaStatus="WADA Prohibited"`, and Drug JSON-LD `legalStatus="Research use only - not FDA approved for human use"` plus `administrationRoute="Subcutaneous injection"`. Live `/peptides/semaglutide` shows an **FDA Approved** chip next to **Not FDA Approved / WADA Prohibited / limited human clinical trial data**. Semaglutide (Ozempic/Wegovy/Rybelsus) is FDA-approved. WADA 2026 Monitoring Program lists markers of semaglutide and tirzepatide — **not prohibited**. Classification: **FACT**.
2. **All 52 clinic records are fictional placeholders** (`https://example.com/…`, NANPA 555 numbers). **50** have `verifiedListing: true` and render a green **Verified** badge. City FAQs (×60) say listings were **vetted** and consultations cost **$100–$300**. When a city has **zero** clinics, the FAQ still says **“multiple.”** Live `/clinics/new-york` and `/clinics/miami` show this. Pages are `noindex, follow` — that hides them from Google, **not from people**. Classification: **FACT**.
3. **Three protocol pages** attach human doses to PubMed IDs that NCBI resolves to unrelated papers (Philippine cancer-pain, trypanosomes, coffee-pulp fermentation, intraocular lenses, etc.). Judge revision of Audit A’s “6/7 unrelated”: **5/7 wholly unrelated, 1/7 on-topic mis-attribution (PMID 30915550), 1/7 correct (PMID 25415472)**. The stored human RCT “0.2–2.0 mg/day oral BPC-157” on PMID **7521621** remains fabricated. Classification: **FACT**.
4. **Live production still publishes a false FDA approval.** Chair GET of https://www.pepcodex.com/blog/cagrilintide-semaglutide-approval on 2026-09-02: “The U.S. Food and Drug Administration has approved CagriSema…” and REDEFINE-1 **22.7%**. Citations are PubMed *search* URLs, not papers. This branch’s MDX was rewritten 2026-09-02 to “under FDA review, not approved” and REDEFINE-1 **20.4%** (PMID 40544433). FDA novel-drug table through 2026-08-28 does **not** list CagriSema. Novo filed an NDA 2025-12-18. Classification: **FACT** (live HTML); **FACT** (NDA filed, not on 2026 novel-drug table); remaining review outcome **UNKNOWN**.

**Do not merge this branch to production as the “fix.”** Live titles (`Semaglutide: 95 Studies…`, orforglipron still **Investigational**) do not match this tree (67 studies; Foundayo recorded in frontmatter). Cherry-pick P0 diffs onto `main`.

**Monetization:** research-chem / peptide-vendor affiliates **REJECT**. Featured clinic units on fake listings **must not be sold**. Outreach playbook is **DRAFT — NOT SENT**. First-party PepTracker waitlist is the only **PURSUE** conversion.

**Search (first-party, 2026-09-02):** www GSC **171 clicks / 47,722 impressions** over **96 days** (2026-05-28–2026-08-31). Apex property was **not** in this account. **72 clicks** are `/compare/*`; **39** are the homepage; glossary is **19,667 impressions / 9 clicks**. **16 noindexed clinic URLs still have 330 impressions and 3 clicks.** 686/1,057 live sitemap URLs have never impressed. GA4 topline is **70% Singapore** (9,009/12,821 sessions) and 91% Direct bounce — do not use it as “traffic.” Organic GA4 is 412 sessions across a longer window. Default content move remains **merge / 301 / noindex + sitemap drop**, not new URLs. Protect compare URLs that already click. Full tables: [FIRST-PARTY-DATA.md](FIRST-PARTY-DATA.md). Independent count 2026-09-02: **179/269** comparisons &lt;200 words; **264** titles contain “Which Has Better Evidence?”; **36** blog/guide identical slugs; **12** city pages with zero clinics.

---

## 2. Scope, inventory, and coverage report

Phase 0 freeze: 2026-09-02T19:47:18.517Z. Canonical files: `INVENTORY.json`, `INVENTORY-COMPACT.json`, `RECONCILIATION.json`, `LIVE-SITEMAP-URLS.json`.

| Bucket | Count |
|---|---:|
| Frozen surfaces | 1343 |
| Indexable (repo expectation) | 1112 |
| Noindex / non-public | 231 |
| Live sitemap URLs | 1057 |
| Intersection live ∩ repo-expected | 1050 |
| Live sitemap not in this branch | 7 (blogs) |
| Repo-expected not in live sitemap | 60 (49 blog, 10 peptide, 1 glossary) |

By type: peptide 107 · peptide-condition 295 · comparison 269 · guide 36 · safety 31 · glossary 215 · blog 140 · protocol 3 · condition 15 · calculator 4 · city-clinic-page 60 · clinic-record 52 · trust 10 · plus hubs, APIs, 32 templates, 46 source-packs.

Three **blind** auditors received the same freeze and did not read each other. Specialists (live-recon, regulatory, templates) wrote separate packs. Council Judge then audited the audits. Five council seats (Contrarian, First Principles, Expansionist, Outsider, Executor) wrote independent memos.

| Auditor | INSPECTED | SAMPLED | STATUS stamp | Judge on stamp |
|---|---:|---:|---|---|
| A health evidence | 252 (18.8%) | 1091 | INCOMPLETE | Correct |
| B technical SEO | 71 (5.3%) | 1272 | INCOMPLETE | Correct |
| C directory/monetization | 137 (10.2%) | 1206 | **COMPLETE** | **Rejected** |

100% of `surface_id`s have a coverage row. That is **ID reconciliation**, not freeze-mandated line-by-line inspection.

---

## 3. Inaccessible data and limitations

Must remain visible. **UNKNOWN / UNAVAILABLE — not guessed:**

- Apex / `sc-domain:pepcodex.com` Search Console. **www** GSC + GA4 were pulled **2026-09-02** (see FIRST-PARTY-DATA.md). Historical 2026-07-25 figures are superseded for www.
- CrUX / Lighthouse / axe. **BASELINE UNAVAILABLE.**
- Production `main` git tree (inferred from live HTML/headers/sitemap only).
- DailyMed HTML (DNS failed in-tool). Boxed warnings taken from FDA press and Drugs@FDA label PDFs.
- FDA PCAC 23–24 July 2026 **vote tally** (minutes not posted as of FDA page current 2026-08-06).
- 503B GLP-1 bulks **final** determination (May 2026 notice is a **proposal**).
- CagriSema FDA **decision** after the 2025-12-18 NDA (not on novel-drug table through 2026-08-28).
- Whether Featured clinic SKU has ever taken money (advertising policy: no current sponsors).
- Whether `gtag` fires a network hit before consent (HTML source order only; no JS runtime).
- Private CMS, email, affiliate dashboards: none in repo.
- Full PMID resolve of 269 comparisons and remaining blogs.
- Source-pack TrialTable NCT drug-match (except NCT07437547, which Judge confirmed is a real BPC-157 hamstring trial — **not** fabricated).
- HTTP status of every repo-not-in-live URL.

**Working tree ≠ live** is a limitation, not a footnote. Implementing only on this branch leaves production lying.

---

## 4. Council scorecard and pass/fail

**FAIL — 80 / 100.** Judge: [council/SCORECARD.md](council/SCORECARD.md). Chair agrees. Do not fake 90.

| Dimension | Max | Score |
|---|---:|---:|
| Inventory and coverage reconciliation | 15 | 10 |
| Claim accuracy and evidence quality | 25 | 20 |
| Fact / inference / hypothesis / anecdote separation | 10 | 8 |
| Freshness and jurisdiction | 10 | 8 |
| Technical SEO and content-opportunity rigor | 10 | 8 |
| Actionability and prioritization | 10 | 8 |
| Monetization integrity and disclosure | 10 | 9 |
| Clinic verification and outreach safeguards | 5 | 5 |
| Security, privacy, accessibility | 5 | 4 |
| **Total** | **100** | **80** |

**Auto-fail stamps (combined packet):**

1. Completeness claimed despite inaccessible material — `audit-c/STATUS.txt` line 1 `COMPLETE`.
2. Undisclosed material coverage gap — live CagriSema false-approval URL was not a CRITICAL in A/B/C FINDINGS.

No fabricated citations **in the audits**. No outreach sent. No payment-for-rank recommended. Authorization boundary held.

**LLM Council seats (all Grok; cross-family council unavailable):** Contrarian — do not pass; First Principles — library not directory; Expansionist — expand by contracting URLs then living `/regulatory-tracker` and `/trials`; Outsider — a stranger would not trust this; Executor — dual-tree Monday P0. Chairman synthesis: [council/CHAIRMAN-SYNTHESIS.md](council/CHAIRMAN-SYNTHESIS.md).

Cheapest repairs to **attempt** a re-score: C STATUS → INCOMPLETE; fix A-001 count; fix C-007 Category 2 membership; add live CagriSema CRITICAL; live-GET remaining title-overclaim blogs. Expected band after that **90–92 only if no further live false-approval pages appear**.

---

## 5. P0–P3 prioritized correction queue

Judge dispositions: [council/DISPOSITIONS.json](council/DISPOSITIONS.json). Dual-tree sequence: [council/EXECUTOR.md](council/EXECUTOR.md).

### P0 — unsafe, materially false, deceptive, or serious regulatory/privacy risk

Do these on **production `main` first**, and apply the same guards on this branch. Do **not** merge the branch.

| ID | Action | Evidence | Disposition |
|---|---|---|---|
| P0-1 | Stop hardcoded Not FDA Approved / WADA Prohibited / Drug `legalStatus` / subcutaneous-only. Drive from `regulatoryStatus`. Do not flatten Barth-only Forzinity into a generic “FDA Approved” chip. | `DossierLayout.astro`; live `/peptides/semaglutide`; 17 dossiers with `status: approved` | ACCEPT (`M-REG-HARDCODE`) |
| P0-2 | Quarantine/remove 52 fictional clinic MDX records. Strip city FAQ + FAQPage (verified/vetted, $100–$300, “multiple” when 0, BPC-157 “for tissue repair”). Remove Verified badge and Featured ribbon. Keep `/clinics` noindex **and** sitemap-excluded. | 52/52 `example.com`; live NY/Miami; `verifiedListing` 50 | ACCEPT |
| P0-3 | Unpublish or 301 `/protocols/bpc-157-tb-500`, `/protocols/cjc-1295-ipamorelin`, `/protocols/gh-secretagogue-combinations` until every PMID title-matches and human milligram/mcg/kg tables are gone. Drop from sitemap. | NCBI 2026-09-02; all three in live sitemap | ACCEPT / ACCEPT WITH REVISION |
| P0-4 | Take down, noindex+sitemap-drop, or replace **live** `/blog/cagrilintide-semaglutide-approval`. It currently states FDA approval. Citations must not be PubMed keyword searches. | Chair GET 2026-09-02; FDA novel-drug table; Novo NDA filing | Judge-owned CRITICAL |
| P0-5 | Rewrite `/directory` so it does not promise a verified clinic/telehealth finder. Remove clinic-finder claims from live `llms.txt`. | Live 200, indexable, “Coming Soon” + verified copy | ACCEPT |
| P0-6 | Strip reconstitution “desired dose (mcg)” → draw volume, or unpublish the tools. Do **not** 301 live tesamorelin calculator this week (this-branch 301 ≠ live 200). Do not wire HowTo schema. | Calculator MDX; A-011 vs B-011 | ACCEPT WITH REVISION — legal/medical |
| P0-7 | Remove sitewide `X-Robots-Tag: index, follow` (or emit only on indexable routes). | `vercel.json`; live clinics/glossary/404 | ACCEPT |
| P0-8 | Delete InteractionMatrix copy “Generally safe to combine based on known mechanisms.” | `InteractionMatrix.astro` | ACCEPT |
| P0-9 | Stop peptide-condition pages from inferring regulatory approval from `evidenceStrength`. | `[peptide]/[condition].astro` ×295 | ACCEPT |
| P0-10 | Quality checklist labeled **Sourcing** / “Clear dosing instructions (12mg, 24mg, or 36mg)” on orforglipron — remove purchasing/dosing guidance. Live orforglipron still Investigational; Foundayo max **17.2 mg**. | `orforglipron.mdx`; FDA 2026-04-01 | ACCEPT |

### P1 — unsupported or outdated material claims and major directory inaccuracies

- Editorial policy claim that every PMID is verified to represent the nearby wording — falsified by protocols.
- BPC-157 metaDescription “no human trials yet” vs `sources.human: 2` vs summary “1 clinical study.”
- Semaglutide safety: boxed warning reduced to “theoretical thyroid tumors”; Foundayo absent from class safety (lastUpdated Jan 2026).
- Melanotan melanoma called “theoretical” despite cited case reports and FDA withdrawn-nomination language.
- SS-31 meta “in clinical trials” while notes already record Forzinity Barth-only 2025-09-19.
- Live vs repo source-count/date mismatch (semaglutide 95 vs 67).
- 36 blog/guide slug twins both 200/indexable.
- 179 thin comparisons; YAML `>-` leaked into ~71 meta descriptions.
- GA4 + Vercel Analytics load in `<head>` before cookie consent UI.
- No named author/reviewer (Organization as Article author).

### P2 — SEO, IA, content, conversion

- Merge/301 thin comparisons and `what-is-*` blog twins (keep the more accurate URL). **Net URL count down.**
- Canonical semaglutide vs tirzepatide = `/compare/tirzepatide-vs-semaglutide`; 301 the 2026 blog if it still shows SURMOUNT-1 **22.5%** (treatment-regimen headline in project lessons is **20.9%**, PMID 35658024 — **verify on the paper before rewriting**).
- Peptide-condition 295 URLs at depth 3: noindex+sitemap exclude or fold into dossiers.
- Organization JSON-LD `logo.png` 404; empty `sameAs` while footer links Instagram.
- Homepage “Spring 2026” in September; AppWaitlistCTA missing on home. Home is **39 GSC clicks** (23% of www clicks) — that CTA belongs here.
- www GSC/GA4 pulled 2026-09-02. Apex GSC still missing. Weekly `npm run fetch:search`.
- Living `/regulatory-tracker` and `/trials` on **existing** URLs.
- Snippet pass on high-imp low-CTR peptide URLs (ghk-cu, dsip, tb-500, retatrutide, bpc-157, orforglipron). No new “what are peptides” blogs.

### P3 — experiments and lower-impact

- Newsletter compact variant currently renders nothing (undefined variant).
- Hover-only Research menu.
- Unused ExitIntentPopup — do **not** mount it.
- 404 canonicalizing to `/404`.
- Breadcrumb JSON-LD relative/trailing-slash URLs.

**Not this quarter:** paid listings, outreach, vendor affiliates, new city pages, new calculators, reindexing `/clinics`.

---

## 6. Claim-to-source ledger

Full machine ledger: `council/DISPOSITIONS.json` (69 merged rows). Headline claims the chair re-opened:

| Claim on site | Status | Source opened 2026-09-02 |
|---|---|---|
| Semaglutide is FDA-approved (Ozempic/Wegovy/Rybelsus) | VERIFIED CURRENT | Drugs@FDA / dossier summary; **contradicted** by template banner |
| Semaglutide “Not FDA Approved” / “WADA Prohibited” | CONTRADICTED | Live HTML vs WADA 2026 Monitoring Program |
| CagriSema “FDA has approved” | CONTRADICTED | Live blog vs FDA 2026 novel-drug table; Novo NDA filing 2025-12-18 |
| REDEFINE-1 22.7% as the published headline | PARTIALLY SUPPORTED / estimand | Project lessons + PMID 40544433 treatment-policy **20.4%**; live page still 22.7% |
| Foundayo (orforglipron) approved 2026-04-01, max 17.2 mg, boxed warning, not T2D | VERIFIED CURRENT | FDA press 2026-04-01; NDA 220934; live dossier still Investigational |
| BPC-157 human RCT 0.2–2.0 mg/day, PMID 7521621 | CONTRADICTED | NCBI: Laudico 1994 cancer pain, Philippines |
| Protocol PMID 25415472 Chang 2014 BPC-157 tendon fibroblasts | VERIFIED CURRENT | NCBI matches stored title |
| Protocol PMID 30915550 as Sikiric 2018 animal | PARTIALLY SUPPORTED | NCBI: Gwyer 2019 BPC-157 **review**, not Sikiric animal |
| 52 clinics exist as named businesses | UNSUPPORTED | `example.com` 404; 555 numbers; 11-clinic web sample null |
| “Verified listings have been vetted” | UNSUPPORTED | No methodology, source, or last-checked date |
| Consults “typically $100–$300” | UNSUPPORTED | Hardcoded FAQ ×60 |
| Compounded drugs are FDA-approved | CONTRADICTED if implied | FDA compounding laws: compounded drugs are **not** FDA-approved |
| BPC-157 currently on live Category 2 table | OUTDATED | FDA page current 2026-04-22: **nominated but withdrawn** |
| Tesamorelin for general fat loss | CONTRADICTED if stated | Labeled HIV-associated lipodystrophy (Egrifta) |
| Vyleesi = melanotan II / unrestricted PT-141 | CONTRADICTED | Vyleesi = bremelanotide, HSDD in premenopausal women |

Only **FACT** above is written without a qualifier.

---

## 7. Outdated-information report

Do not bump dates without a material edit.

| Item | Page/live state | Current as of 2026-09-02 | Action |
|---|---|---|---|
| Live CagriSema blog | FDA approved; 22.7% | NDA filed, not on novel-drug table; 20.4% treatment-policy | REMOVE/REWRITE live |
| Live orforglipron | Investigational; 36 mg checklist | Foundayo 1 Apr 2026; max 17.2 mg | REWRITE live |
| Dossier FDA/WADA banners | All “not approved / prohibited” | Mix of approved, investigational, research-only | REWRITE template |
| BPC-157 compounding as “Category 2 banned” | If still worded that way | Withdrawn nomination ≠ listing ≠ legal to compound | QUALIFY |
| GLP-1 class safety | lastUpdated Jan 2026; ileus “under review” | Labels include ileus, pulmonary aspiration; Foundayo exists | REWRITE |
| SS-31 meta | “in clinical trials” | Forzinity Barth-only accelerated approval 2025-09-19 | QUALIFY meta |
| Live `llms.txt` | 2026-02-18, 92 dossiers, trailing slashes, superlative | Stale vs generator | Deploy without superlative |
| Homepage | “Spring 2026” / “No. 03 lands this summer” | Audit date September 2026 | Date or remove |
| Semaglutide meta | “Updated Feb 2026”; live 95 vs repo 67 | Two different dossiers | Do not ship branch as live |
| Trust pages | “Last updated January 2026” | Compounding/oral GLP-1 moved Apr–Jul 2026 | Update **after** content is current |
| Semaglutide 7.2 mg US approval | Secondary news in A | **Not independently confirmed against Drugs@FDA this audit** | EXPERT REVIEW |

---

## 8. Source-backed new-information report

Safe to add to **existing** URLs only. Not a license to mint pages.

1. **Foundayo label card** on `/peptides/orforglipron`: indication, 0.8→17.2 mg, boxed warning, not T2D, no combination with other GLP-1RAs. FDA 2026-04-01.
2. **WADA 2026 split:** S0 names BPC-157; S2 covers GHS/GHRH/TB-500 class; GLP-1s **monitored, not prohibited**. Cite the List.
3. **503A vs compounding-pharmacy explainer** on existing BPC-157 safety + `/fda-notice`: withdrawal from Category 2 ≠ 503A bulks list ≠ approval.
4. **Estimand footnotes** (ATTAIN-1 11.2% already in this-branch dossier; extend to STEP UP / REDEFINE / SURMOUNT headlines).
5. **Barth-only Forzinity** kept visible if the banner is ever “fixed.”
6. **Perioperative pulmonary aspiration** on existing GLP-1 safety (labeled risk).
7. **FDA 503B bulks proposal (2026-04-30)** excluding semaglutide/tirzepatide/liraglutide — **proposal, not final** — on `/regulatory-tracker`.
8. **NCT07437547** is a real BPC-157 hamstring trial (recruiting). May be cited as a trial **registration**, not as evidence of human benefit.

Do **not** write “BPC-157 now legal” or “FDA approved peptides” posts. A PCAC vote is not a listing.

---

## 9. Technical SEO, accessibility, performance, analytics, and indexation

See Audit B + live-recon.

**Crawl / index**

- Apex `pepcodex.com` **308** → www (permanent). Historical July note of a 307 is **outdated** as of 2026-09-02.
- Sitewide `X-Robots-Tag: index, follow` conflicts with HTML `noindex, follow` on clinics, generic glossary, 404. Google’s spec: more restrictive wins for Googlebot; the header is still wrong.
- `/clinics/*` noindex + sitemap-excluded (correct for crawl budget). **Does not make the HTML truthful.**
- `/directory` is indexable “Coming Soon.”
- Branch `vercel.json` 301s URLs that are **200 + sitemapped** on production (e.g. `/blog/2025-glp1-year-review`, tesamorelin calculator).
- Local graph `silent=1111` / 0 impressions was **GSC not joined**. **Superseded:** live www GSC 2026-09-02 shows **484 pages with impressions** and **686/1,057 sitemap URLs with zero rows**.
- Do not use 2026-07-24 “923/1221 never impressed” as current. Use the 2026-09-02 www pull.

**Scaled-content / doorway risk (Google spam policies accessed 2026-09-02)**

- 179/269 comparisons &lt;200 words; 264 templated titles; 71 YAML-leaked descriptions.
- 295 peptide-condition URLs, depth 3, approval inferred from evidence grade.
- 36 identical blog/guide slugs.
- 60 city pages with shared FAQs; 12 with zero clinics still saying “multiple.”
- 215 glossary; 35 generic terms already noindex (keep).

**Schema**

- Drug JSON-LD false legalStatus + subcutaneous on all dossiers including orals (Rybelsus, Foundayo).
- FAQPage on city pages (false) and some comparisons (JSON-LD without visible FAQ — live-recon).
- Organization `logo.png` 404; `sameAs: []`.
- HowTo unused — **keep unused**.
- Ratings HTML only — **do not** emit AggregateRating.

**Analytics / privacy / a11y**

- `gtag('config', G-1M56CNL8CK)` in `<head>` before CookieConsent. Consent Mode default-denied, if any, is too late.
- `@vercel/analytics` in source.
- Skip link exists. Desktop Research menu is hover-only. Newsletter fields missing labels in some variants.
- Exit-intent component exists but is **not mounted** (live count 0). Do not mount.
- CrUX/Lighthouse **BASELINE UNAVAILABLE**.

---

## 10. Page-level refresh, merge, redirect, archive, and removal plan

**Net URL count must not rise.**

| Action | URLs | Note |
|---|---|---|
| REMOVE or 301 | 3 `/protocols/*` | Until PMIDs match |
| REMOVE/noindex live | `/blog/cagrilintide-semaglutide-approval` | False FDA approval |
| Quarantine from build | 52 clinic MDX + strip city FAQs | Keep `/clinics` noindex |
| 301 blog → guide | 36 `what-is-*` / explainer twins | Keep the more accurate page |
| 301 or noindex | ~179 thin `/compare/*` | Keep trial-level head-to-heads |
| 301 | `/blog/semaglutide-vs-tirzepatide-2026` → comparison | After estimand check |
| noindex + sitemap drop | 295 peptide-condition **or** fold into dossiers | Do not add more |
| noindex + sitemap drop | `/directory` until it is a real product | Or rewrite with zero clinic claims |
| KEEP URL, change tool | live tesamorelin calculator | Do not ship this-branch 301 |
| Do not execute | Any “retire 35 blogs” manifest | Lucas: fix, don’t delete a third of the blog — differentiate pairs |

---

## 11. Ranked blog and evergreen-content backlog

Full opportunity objects: `audit-b/OPPORTUNITIES.json` (25). Council Expansionist ranking (no invented volume):

**Do now (existing URLs):** P0 rewrites; Foundayo card; CagriSema live takedown; BPC cluster (dossier + safety + guide) with 503A distinction; GLP-1 class safety (aspiration, Foundayo, boxed warning wording from the **label**).

**Then:** living `/regulatory-tracker` and `/trials`; estimand tables on the **kept** comparisons; homepage as waitlist not a magazine.

**Do not pursue:** new `what-is` blogs; more city pages; more calculators; “peptides now legal”; vendor roundups; dual-fattening of blog/guide twins.

A blog is not approved because a keyword exists.

---

## 12. Sustainable impression-growth and content-monitoring system

Copied and adopted from Audit B with GSC still blocked. Full tables: `audit-b/IMPRESSION-SYSTEM.md`.

| System | Owner | Source | Cadence | Alert | Outcome |
|---|---|---|---|---|---|
| GSC query mining | Lucas + operator | GSC www API (apex if added) | Weekly `npm run fetch:search` | sitemap URLs up, clicks flat; Singapore spike in GA4 | Refresh/merge list — **not** new blogs |
| Content decay | Content | GSC page + `lastUpdated` vs newer primary sources | Monthly | Clicks down **and** newer authoritative evidence | Rewrite/qualify; do not bump dates |
| Citations / broken links | Eng + content | `graph:check`, qa-pmids **including protocols** | Every link PR | Exit 1; PMID title mismatch | Fix before ship |
| Regulatory / safety | Content | FDA compounding, labels, WADA List, shortages | Weekly scan | New safety communication or list change | Patch existing URLs same day |
| Clinic re-verification | n/a until real listings | Board + SOS | 90 days | Any 555/example.com | Unpublish |
| Topic clusters | Content | Internal links matching `getStaticPaths` | Per PR | Depth &gt;3, orphans | graph:check |
| Expert review | Named reviewer (none today) | Medical/legal | On P0/P1 health diffs | Unqualified “approved/safe/effective” | Hold ship |

KPI: impressions are an **early** indicator. Business outcome is honest waitlist/app conversion, not URL count.

---

## 13. Directory data-quality and verification plan

**Current directory is not a product.** Quarantine first.

After quarantine, unpaid verification (from C’s model):

| Check | Source class | Pass |
|---|---|---|
| Entity name | State SOS / NPPES | Exact or documented DBA |
| License | State board | Active, matching name and state |
| Address | Board + official site | Not a virtual mailbox unless disclosed telehealth-only |
| Website | Official domain | Resolves; not example.com; not a vial cart |
| Phone | Board or official site | Not 555 |
| Menu | Official site only | No PepCodex-authored “typical peptides” |
| Sanctions | Board + OIG LEIE | No undisclosed exclusion |

Public definition:

> “Verified means PepCodex independently confirmed the named practice exists, a license is active in the stated jurisdiction, and the public contact worked on the last-checked date. It is not a medical endorsement and is not for sale.”

**Verified ≠ safe ≠ recommended ≠ FDA-approved compounding.** Last-checked ≤ 90 days or auto-unpublish.

---

## 14. Clinic prospecting and outreach playbook

**DRAFT — NOT SENT.** Full text: `audit-c/OUTREACH-PLAYBOOK.md`.

Hard stop: do not email, call, or LinkedIn the 52 names; do not invent `info@` addresses; do not tell nearby real clinics they are already listed. Name collisions with different real entities are documented in that file.

Pipeline only **after** quarantine:

`Quarantine → Discovered → Eligibility Checked → Listing Reviewed → Contact Verified → Outreach Approved → Initial Message Sent → Follow-Up Due → Responded → Listing Claimed → Data Verified → Paid Option Discussed → Activated / Declined / Paused / Do Not Contact`

Value proposition starts with **correcting facts**, not selling Featured. No ranking/traffic/lead guarantees. Easy decline. Opt-out. Review against anti-spam and professional advertising rules before any send (none authorized).

---

## 15. Free-versus-paid clinic listing model

**DRAFT for legal review. Not an offer.** Full table: `audit-c/PAID-LISTING-MODEL.md`.

Precondition: fictional inventory gone.

Payment must **never** purchase: verification badge, credential, safety/evidence rating, favorable review, medical endorsement, suppression of negatives, altered complaints, undisclosed organic rank, unsupported claims.

Sponsored units: visibly labeled, separate from organic sort. Organic sort: license current (filter), last-checked recency, completeness of **required** fields, distance — **documented and reproducible**.

Lead-gen / booking take-rate: **LEGAL REVIEW** (fee-split, corporate practice, PHI). Do not assume lawful.

---

## 16. Affiliate opportunity and conflict-risk matrix

Full matrix: `audit-c/AFFILIATE-MATRIX.md`. Commissions **UNVERIFIABLE** (terms not opened; no accounts).

| Category | Verdict |
|---|---|
| Research-chem / RUO peptide vendors | **REJECT** |
| Compounding-pharmacy paid widget / 503A finder | **REJECT** |
| Grey-market shops | **REJECT** |
| National peptide telehealth with Category 2 / withdrawn-bulk menus | **REJECT**; others **DEFER** + legal |
| FDA-approved GLP-1 manufacturer copay cards | **DEFER** (drug advertising; terms not opened) |
| Clinic lead-gen networks | **DEFER**; current 52 records **REJECT as inventory** |
| Display ads / newsletter founding partners (non-vendor) | **CAUTIOUS TEST** after fiction is gone; labeled; firewall |
| PepTracker first-party | **PURSUE** (not an affiliate of peptides) |
| Unpaid citations to PubMed / FDA / CT.gov | **PURSUE** |

Commission must never influence evidence grades. A disclosure page cannot cure a sourcing recommendation the editorial policy bans.

No conservative/base/upside dollar model: **BASELINE UNAVAILABLE** (no current sessions, EPC, or affiliate earnings). Calculator framework only: `revenue = sessions × eligible CTR × conversion × EPC`, all factors unknown.

---

## 17. Editorial-independence and disclosure policy

Adopt and **make true** (the live pages already claim some of this):

- Evidence grades, peptide coverage, and conclusions are independent of sponsors, affiliates, and paid listings.
- Material connections disclosed **next to** the link or unit, not only on `/advertising-policy`.
- Sponsored = labeled “Sponsored” (accessible text, not color alone).
- Featured ≠ Verified. If Featured exists, it is a paid SKU or it is removed. Advertising policy currently lists **no sponsors** while UI still sells Featured Listing Options on fake clinics — **fix the UI**.
- Corrections: dated note on the page; do not silently bump `lastUpdated`.
- Authors: name a human reviewer for YMYL pages or stop implying a “Research Team” with credentials the About page does not document.
- Conflicts register: any future partner, with dates.
- Banned: dosing protocols, purchasing guidance, medical advice, vendor recs — **enforce in templates**, not only in policy prose.

---

## 18. “Do not pursue” list

- Reindex `/clinics/*` or add more city/doorway pages.
- Use the 52 MDX records as a prospect list or send outreach.
- Research-chem / peptide-vendor affiliates.
- “Find a compounding pharmacy” widgets.
- Additional reconstitution/syringe calculators.
- “BPC-157 now legal” / “FDA approved peptides” news posts.
- Wiring HowTo schema to protocols or calculators.
- AggregateRating from internal scores.
- Mounting ExitIntentPopup.
- Publishing more URLs because a keyword exists.
- Merging `feat/scoring-and-freshness` onto `main` as a P0 hotfix.
- Dual-fattening blog/guide twins.
- Treating `qa-pmids` PASS as proof that **protocol** PMIDs match (the gate did not walk that collection).
- Treating identifier-ledger 100% as claim-to-wording match.
- Updating dates without a material change.

---

## 19. KPI dictionary and dashboard specification

www GSC + GA4 baselines set **2026-09-02**. Apex GSC still **UNAVAILABLE**. GA4 topline is not a human-traffic baseline (70% Singapore).

| KPI | Definition / formula | Source | Baseline | Target | Cadence | Owner | Limitations |
|---|---|---|---|---|---|---|---|
| Indexed pages by type | Count of URLs in GSC “indexed” by path prefix | GSC Inspection / page report | UNAVAILABLE | Set after 28d clean data | Weekly | Lucas | Sitemap ≠ indexed |
| Index exclusions | Excluded − user-selected noindex | GSC | UNAVAILABLE | Clinics remain excluded | Weekly | Eng | |
| Non-brand impressions / clicks | GSC www clicks/impr; query grain is censored (51/171 clicks named) | GSC `https://www.pepcodex.com/` | **171 clicks / 47,722 impr** (2026-05-28–2026-08-31) | Do not chase generic `peptides` (pos 72) | Weekly | Operator | Apex missing; query dimension incomplete |
| Content refresh recovery | Δ clicks 28d after material rewrite | GSC page | UNAVAILABLE | Recover, don’t just lastmod | Per refresh | Content | Needs baseline |
| Orphan / internal-link coverage | graph:check orphans, depth&gt;3 | `graph-latest.json` | 2 orphans / 0 deep in 2026-09-02 local graph | 0 orphans | Per PR | Eng | Local dist, not Google |
| Structured-data validity | 0 false Drug.legalStatus on approved drugs | Rich Results / view-source | Fail (live semaglutide) | 0 | Per deploy | Eng | |
| Core Web Vitals | CrUX p75 | CrUX | UNAVAILABLE | Meet thresholds | Monthly | Eng | Not run |
| Verified / claimed / complete / stale listings | After real directory exists | Internal DB | 0 real listings | n/a this quarter | 90d | Directory | |
| Clinic response / activation | Outreach responded / sent | CRM | Do not start | n/a | — | — | Outreach not authorized |
| Directory search-to-profile | n/a while fiction | — | UNAVAILABLE | — | — | — | |
| Affiliate CTR / EPC | n/a; vendors REJECT | — | UNAVAILABLE | 0 vendor clicks | — | — | |
| Revenue / 1k sessions | revenue / sessions × 1000 | GA4 + payments | UNAVAILABLE | App waitlist first | — | — | GA4 2026-09-02: 12,821 sessions, **9,009 Singapore**, Direct bounce 91%; 1 newsletter signup |
| Partner concentration | max partner / total | Payments | 0 sponsors | &lt;40% if any | Quarterly | Operator | |
| Citation coverage | % material claims with matching PMID/FDA | qa + protocols walk | Protocols fail | 100% of remaining protocols | Per PR | Content | |
| Pages past review date | lastUpdated + volatility window | Frontmatter | Not instrumented | 0 P0 pages stale | Monthly | Content | |
| Unsupported claims corrected | P0/P1 closed | This ledger | Open | P0=0 on live | Weekly | Chair | |
| Affiliate disclosure coverage | labeled / affiliate links | Crawl | 0 affiliates | 100% if any | Monthly | Editor | |
| Sponsored-label compliance | labeled / paid units | Crawl | Featured unlabeled on fakes | 100% | Monthly | Editor | |
| Ranking-integrity | organic sort independent of pay | Code review | No real organic clinic sort | Documented sort | Per change | Eng | |
| Corrections received/resolved | inbox | Contact form | UNAVAILABLE | SLA 7d | Monthly | Editor | FormSubmit third party |

---

## 20. Prioritized 30/60/90-day roadmap

Factual corrections **before** monetization. Detail: `council/EXECUTOR.md`. Horizon from Monday **2026-09-07**.

**Days 0–7 (production `main` + same guards on this branch):** P0-1 through P0-10. Lucas ships `main`. Do not merge this branch. No GSC required to stop lying.

**Days 8–30:** P1 rewrites on **production** content (orforglipron Foundayo card as a **scoped** content PR, not a branch merge); 36 twin 301s after choosing the keeper; start thin-comparison contraction; extend qa-pmids to protocols; consent-gated gtag; named reviewer or stop implying one.

**Days 31–60:** www GSC/GA4 already live (2026-09-02). Add apex property if it exists. Homepage waitlist CTA (home = 39 GSC clicks). Living `/regulatory-tracker` + `/trials`. Graph join to the new GSC files. Filter Singapore/localhost out of GA4 dashboards. Still **no** clinic outreach.

**Days 61–90:** Polish, a11y, leftover twins. Paid listing / newsletter sponsors only if P0 is live-clean and counsel signs the firewall. Vendor affiliates still REJECT.

Blocked on Lucas: production ship; `gcloud auth application-default login`; counsel before any listing SKU; app-CTA copy; named medical reviewer; disposition of this-branch 301s that would kill live 200s.

---

## 21. Decision log

**Assumptions**

- US is the primary jurisdiction (site language, FDA/FTC, compounding).
- Crawl budget remains binding (project files + historical GSC).
- PepTracker is the intended conversion, not peptide sales.
- `noindex` does not equal “not deceptive.”

**Unknowns** — see §3.

**Disagreements** — `council/DISSENT-LOG.md`:

- D-001: A’s “6/7 unrelated” **rejected**; 5/7 + 1 mis-attributed + 1 correct. Still CRITICAL.
- D-002: Calculators REMOVE vs QUALIFY → legal/medical; default strip desired-dose.
- D-003: C-007 live Category 2 membership **revised** to withdrawn table.
- D-004: SS-31 notes already Barth-only; stale **meta** is the bug; don’t flatten banners.
- D-005: NCT07437547 is a real BPC-157 trial; keep A-013 for other defects.

**Expert review required**

- Medical: protocol replacement (if any), calculator fate, boxed-warning wording from full labels, melanotan case-report language, Barth-only display.
- Legal: clinic fiction takedown vs “demo data” labeling; FTC mapping of Verified badges; fee-split if lead-gen ever launches; Featured as advertising.
- Privacy: FormSubmit, waitlist PII, GA before consent.
- Regulatory: compounding menu display; Foundayo vs live orforglipron.

---

## 22. Audit-of-audit report

Independent Judge: [council/JUDGE-REPORT.md](council/JUDGE-REPORT.md). Rejected process claims: [council/REJECTED.md](council/REJECTED.md).

**Sampled / rechecked by Judge (not inherited):** all protocol PMIDs at NCBI; live semaglutide/orforglipron/bpc-157 HTML; live CagriSema blog; live comparison blog 22.5%; Foundayo FDA press; compounding Category 2 page; WADA 2026 S0 + Monitoring Program; NCT07437547; city FAQ ternary; InteractionMatrix; peptide-condition approval ternary; calculators; gtag vs consent.

**Recurring error → sample expanded:** A-001 count error; C-007 Category 2 mismatch; then Judge hunted live title-overclaim blogs and found CagriSema.

**Residual risks**

- Other live blogs whose **titles** imply approval/CRL/shortage may still be false on production while this branch is fixed.
- Source-pack / Khavinson / remaining comparison PMIDs not re-resolved this increment.
- Template multipliers can reintroduce P0 after a content-only fix.
- Dual-tree drift: fixing only the branch leaves production lying.

**Coverage gaps:** listed in §2–§3. Freeze deep-read mandate was **not** met by B; A used claim-scan as INSPECTED; C grepped non-directory surfaces.

**Council model gap:** all seats Grok. Cross-family council (GPT / Opus / Fable) **did not run**.

---

## 23. Machine-readable appendices

| File | Contents |
|---|---|
| `INVENTORY.json` | Frozen surfaces |
| `INVENTORY-COMPACT.json` | id/type/url/file |
| `RECONCILIATION.json` | Live vs repo |
| `CLINIC-RECORDS.csv` | 52 clinics |
| `CANNIBALIZATION-CANDIDATES.json` | what-is pairs |
| `audit-a/FINDINGS.json` | A-001–A-026 |
| `audit-b/FINDINGS.json` | B-001–B-032 |
| `audit-c/FINDINGS.json` | C-001–C-022 |
| `audit-b/OPPORTUNITIES.json` | 25 opportunities |
| `audit-c/CLINIC-VERIFICATION.json` | Per-clinic status |
| `council/DISPOSITIONS.json` | 69 merged rows + Judge dispositions |
| `live-recon/PROBES.json` | Live HTTP |
| `regulatory/SOURCES.json` | Official sources |
| `templates/SPREADER-CLAIMS.json` | 40 hardcoded claims |
| `FIRST-PARTY-DATA.md` / `FIRST-PARTY-STATS.json` | www GSC + GA4 2026-09-02 |

---

## Completion rule

**`INCOMPLETE`**

Missing for `COMPLETE` / pass:

- Apex / domain-property GSC (www pulled 2026-09-02)
- Line-by-line inspection of remaining SAMPLED bodies (comparisons, blogs, peptide-conditions, source-packs)
- DailyMed full labels
- Live-GET of remaining title-overclaim blogs
- Production `main` checkout
- C STATUS stamp repair
- Score ≥90 with no auto-fail

P0 facts above are still **true** and **actionable**. Do not wait for a passing score to stop labeling Ozempic as research-only, to quarantine fake clinics, to unpublish wrong-PMID protocols, or to take down the live CagriSema “FDA approved” post.

No website changes, outreach, purchases, or enrollments were made in this audit.
