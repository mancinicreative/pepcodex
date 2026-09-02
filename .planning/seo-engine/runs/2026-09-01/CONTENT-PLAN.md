# CONTENT-PLAN — L6 Blog Strategist (agent S)

*Run 2026-09-01. Read-only on `src/content` and `data/`. No builds. No new slugs.*

**Decision.** Keep all 140 live posts. Add **zero** URLs. Do not 301/merge twins (blocked on Lucas). Wave 2 Blog Optimizer differentiates same-slug `guides/` and `safety/` twins on the **blog half** first, then does a CTR/link/CTA pass on pages that already earn impressions. Do not publish news-vs-STAT. Do not publish media-saturated GLP-1 vs GLP-1 volume plays (B8 still holds).

**Quality bar (LOOPS.md L6).** A plan that publishes more without a ≤0 URL ledger fails. This ledger is **0 / 0 / 140**.

---

## 0. Net-URL ledger (this run)

| Action | Count | URLs | Notes |
|---|---:|---|---|
| **Adds** | **0** | — | No exception. No Lucas-approved add. |
| **noindex + sitemap-drop** | **0** | — | `noindex` without sitemap-drop does not save crawl budget. Lucas (2026-08-17): do not delete/301 a third of the blog. Silent stubs stay live and get a **job split**, not a robots tag. |
| **Merge-with-redirect** | **0 this run** | — | Stronger SEO for twins; **blocked on Lucas**. Already-shipped 301s (13+1 retired fabrications in `vercel.json`) stay; do not reverse them; do not restore those slugs. |
| **No change (URL identity)** | **140** | every `src/content/blog/*.mdx` | Optimize or differentiate in place. |

**Net sitemap delta from this plan: 0.**

**Already-retired GSC ghosts (not in the 140; do not recreate):**

| GSC page (2026-07-25 PAGE export) | Combined impr | 301 already in `vercel.json` | Why not restore |
|---|---:|---|---|
| `/blog/2025-peptide-approvals-record` | 314 | → `/blog` | Uncited year-in-review; fabrication class |
| `/blog/orforglipron-beats-oral-semaglutide` | 242 | → `/peptides/orforglipron` | Fabricated ATTAIN-2 head-to-head (commit `4f4f685`) |
| `/blog/ai-peptide-drug-discovery` | 116 | → `/blog` | Uncited; topic may return only as a **new** sourced post, which this ledger forbids |

Those three inflate a naive "blog impressions" total. They are not optimization targets.

---

## 1. Evidence, windows, censorship

**Live GSC/GA4 for this engine run: not on disk.** `.planning/seo-engine/runs/2026-09-01/MEASUREMENT.md` does not exist. Gate 0 remains **blocked on Lucas** (ADC `invalid_grant` / `invalid_rapt`). Numbers below are the last PAGE-dimension pull, not a 2026-09 snapshot.

| Source | Window | What it is |
|---|---|---|
| Worktree `gsc-pepcodex-com-page.json` | apex 2026-01-27 → 2026-07-22 (177d) | PAGE export. **Use this for demand.** |
| Worktree `gsc-www-pepcodex-com-page.json` | www 2026-05-28 → 2026-07-22 (56d) | PAGE export. Overlaps apex; do not add the two property totals as if independent site traffic. |
| `manifest.json` | pulled 2026-07-25 | Apex 31,704 impr / 81 clicks; www 5,884 / 40 |
| `BLOG-AUDIT.md` + `blog-checklist.csv` | scored 2026-08-17 on that pull | 140 posts; 5,694 blog impr / **0 clicks** (apex-centric; see below) |
| Query export | same pull | **Censored (A2).** Query dimension held ~33% of impressions / ~15% of clicks. **Never treat query-export silence as no demand.** Title/meta may use query rows *when present*; ranking in this plan does not. |

**Blog PAGE totals (this re-count, 2026-09-01):**

| Cut | Unique `/blog/` paths | Impressions | Clicks |
|---|---:|---:|---:|
| Apex PAGE | 35 | 6,110 | **0** |
| www PAGE | 13 | 275 | **0** |
| Combined by slug (incl. 3 retired 301s) | 40 slugs | 6,366 | **0** |
| Combined, live posts only | 37 slugs | 5,694 | **0** |

BLOG-AUDIT's 5,694 matches **live** posts. Combined 6,366 includes the three ghosts.

**A2 reminder:** 0 blog clicks is a PAGE fact, not a query-export artifact. The converting non-brand query on the **site** is still a **comparison** (`cagrilintide-vs-survodutide` / `survodutide vs cagrilintide`, ~14 PAGE clicks across properties). That URL already exists under `/compare/`. It does not justify a new blog slug.

**B8 reminder:** top-ranking `/compare/` pages are under-covered pairs (cardiogen-vs-vesugen, cagrilintide-vs-survodutide, ovagen-vs-svetinorm, kristagen-vs-thymalin class). Media-saturated GLP-1 vs GLP-1 is not the volume play. `/blog/semaglutide-vs-tirzepatide-2026` has ~1,004 PAGE impressions and **0 clicks** — visibility without conversion, not a reason to clone more GLP-1 matchups.

**Rewrite lag:** R1 `581936f`, R2 `9fed6fb`, and WIP `f1b91e0` (2026-08-17–22) already rewrote ~69 posts, including most of the impression leaders. GSC above **predates** those rewrites. CTR instructions below are hypotheses until a new PAGE pull exists.

Commands actually run this session (read-only): node PAGE aggregations on the worktree JSON; `git show --stat` on `581936f` / `9fed6fb` / `f1b91e0` / `4f4f685`; directory lists of `src/content/blog|guides|safety`; reads of BLOG-AUDIT, blog-checklist.csv, MARKETING-BRIEF, LINKGRAPH, SEO-AUDIT-CORRECTIONS, CRAWL-GOAL, STATE, RETIRED-POSTS. **No `astro build`. No `gsc:repull`.**

---

## 2. Ranked live posts (PAGE data)

Sort: combined PAGE impressions (apex+www, slug-normalized, trailing-slash collapsed), then clicks, then BLOG-AUDIT `priorityScore`. Clicks are 0 throughout.

**Prior pass:** `integrity` = body/sources already touched in R1/R2/`f1b91e0`. Optimizer must not re-expand those for word-count. `untouched` = still on the 2026-08-17 twin/stub problem.

### 2.1 Top 40 (37 with ≥1 PAGE impression + 3 conversion-shaped zeros)

| # | Slug | Impr | Pos | Prior CSV | Action | One-line why |
|---:|---|---:|---:|---|---|---|
| 1 | `semax-neuroprotection-stroke` | 1133 | 8.2 | optimize | **optimize** (CTR/links/CTA, not another rewrite) | Site #1 blog URL; pos ~8 with 0 clicks; integrity pass 2026-08-17; still the CTR problem |
| 2 | `semaglutide-vs-tirzepatide-2026` | 1004 | 12.1 | optimize | **optimize** | Only comparison-shaped blog with demand; 0 clicks; do **not** spawn sibling GLP-1 vs GLP-1 URLs (B8) |
| 3 | `dsip-sleep-quality-study` | 592 | 10 | optimize | **optimize** | Page-2 edge; DSIP dossier has almost no other editorial; funnel-eligible (sleep log) |
| 4 | `zepbound-sleep-apnea-approval` | 481 | 73.1 | refresh | **optimize** | High demand, terrible position; R1 already refreshed sources — titles/internal links next, not a third body |
| 5 | `what-is-wegovy` | 432 | 76.6 | refresh | **differentiate-twin** | 432 impr vs guide twin (guide PAGE silent); R1 fattened blog (628w vs guide 390w) — **stop fattening**; split the job |
| 6 | `what-is-mk-677` | 261 | 34.3 | refresh | **differentiate-twin** | Real PAGE demand; R1 fattened blog vs thinner guide; lock distinct H1s |
| 7 | `cagrilintide-semaglutide-approval` | 233 | 13.3 | optimize | **optimize** | Page-2 adjacent approval literacy; WIP already estimand-cleaned |
| 8 | `cagrisema-nda-filed-glp1-amylin-combo` | 165 | 8.2 | optimize | **optimize** | Best position in the NDA cluster; dossier link now present in WIP — CTR + calculator/compare links |
| 9 | `retatrutide-phase3-enrollment` | 131 | 8.0 | optimize | **optimize** | Ranking enrolment story; keep as "how to read TRIUMPH," not a news tick |
| 10 | `ss31-mitochondrial-heart-failure` | 128 | 7.8 | optimize | **optimize** | Strong position, thin-to-rank historically; integrity pass done; CTR + `/peptides/ss-31` + `/safety/ss-31-safety` |
| 11 | `pemvidutide-impact-mash-resolution` | 114 | 10.2 | optimize | **optimize** | Solid PAGE foothold; not a new MASH URL |
| 12 | `what-is-ghk-cu` | 114 | 42.1 | refresh | **differentiate-twin** | Demand + twin; R1 rewrote blog; guide still the stub — do not clone depth onto `/guide/` |
| 13 | `oxytocin-autism-cognition` | 104 | 7.6 | optimize | **optimize** | Ranks; `relatedPeptides: oxytocin` has no dossier — render as text, do not invent a slug |
| 14 | `generic-saxenda-fda-approval` | 97 | 24.7 | optimize | **optimize** | Commercial-adjacent PAGE demand; stay on label/generic facts, no buying |
| 15 | `fda-compounding-oversight` | 90 | 8.2 | optimize | **optimize** | Regulatory evergreen; natural link to `/regulatory-tracker` (do not build B1 as a new post) |
| 16 | `thymosin-alpha1-elderly-immune` | 88 | 7.1 | optimize | **optimize** | Position 7, 0 clicks; WIP refreshed; title/meta next |
| 17 | `survodutide-phase-2-mash-results` | 73 | 10.7 | optimize | **optimize** | Point at existing `/compare/cagrilintide-vs-survodutide` (the converting pair) — do not write a blog vs-survodutide |
| 18 | `ll37-wound-healing` | 65 | 12.1 | optimize | **optimize** | Connect to `/peptides/ll-37` and `/compare/ll-37-vs-lactoferricin` (B8 winner class) |
| 19 | `tirzepatide-surmount-osa` | 63 | 6.3 | optimize | **optimize** | Best blog position in the audit; funnel-eligible (chronic tracking) |
| 20 | `peptide-protacs-emerge-cancer-treatment` | 57 | 13.0 | optimize | **optimize** | Guard failed related-peptide slugs; no new oncology URL |
| 21 | `orforglipron-attain-1-results` | 51 | 16.5 | optimize | **optimize** | Lead treatment-policy 11.2%; never restore `orforglipron-beats-oral-semaglutide` |
| 22 | `what-is-zepbound` | 31 | 58.5 | optimize | **differentiate-twin** | Brand-name demand; twin with `/guide/what-is-zepbound` |
| 23 | `ghkcu-stem-cell-differentiation` | 30 | 11.9 | optimize | **optimize** | Ranking GHK-Cu study post; link dossier + `what-is-ghk-cu` after the twin split |
| 24 | `what-is-tb-500` | 28 | 17.6 | optimize | **differentiate-twin** | Blog 28 impr + guide 10; both live — split jobs, do not merge |
| 25 | `glp1-safety-overview` | 23 | 16.0 | optimize | **differentiate-twin** | Exact-slug twin with `/safety/glp1-safety-overview` (blog ~2048w, safety ~1740w). Do **not** fatten either. Blog = class literacy; safety collection = AE tables |
| 26 | `what-is-tesamorelin` | 21 | 7.6 | optimize | **differentiate-twin** | Blog ranks; `/safety/tesamorelin-safety` separately has **220** PAGE impr — different URL, do not compete with it |
| 27 | `what-is-rybelsus` | 16 | 32.1 | keep | **differentiate-twin** | Identical twin (~364w both); PAGE demand exists |
| 28 | `what-is-cjc-1295` | 15 | 20.0 | keep | **differentiate-twin** | Identical twin (~300w); `/safety/cjc-1295-safety` already ranks (76 impr) — blog must not become a third safety page |
| 29 | `what-is-ipamorelin` | 10 | 7.2 | keep | **differentiate-twin** | Identical twin (~195w); safety collection already has `ipamorelin-safety` (27 impr) |
| 30 | `amycretin-phase2-results` | 10 | 13.5 | refresh | **optimize** | R2 touched; still 1-source historically — do not invent papers; link `/peptides/amycretin` |
| 31 | `peptide-evidence-levels-explained` | 9 | 4.6 | keep | **differentiate-twin** | Guide twin has **42** PAGE impr vs blog 9 — **guide owns GRADE**; blog becomes "how PepCodex applies a grade," not a second primer |
| 32 | `pemvidutide-eu-mash-approval` | 7 | 5.7 | keep | **leave** | Tiny PAGE; citation bar met; not a twin; do not expand into a new EU-approval URL |
| 33 | `wegovy-pill-launches-us` | 6 | 4.0 | keep | **leave** | News-shaped, 0 clicks, bar met; oral GLP-1 story already covered by `orforglipron-*` + `what-is-rybelsus` twin work |
| 34 | `what-is-ozempic` | 4 | 1.0 | keep | **differentiate-twin** | Identical twin; tiny PAGE; brand recall adjacent to B10 — split title from the guide |
| 35 | `aod9604-human-efficacy` | 3 | 8.7 | keep | **leave** | Honest negative-evidence post; not a twin (`aod-9604-safety` is the safety twin, separate slug) |
| 36 | `peptide-hydrogel-joints` | 3 | 3.0 | refresh | **leave** | 1-source / preclinical; not worth a depth campaign; do not add a joints URL |
| 37 | `tirzepatide-10-year-cvd-risk-analysis` | 2 | 4.0 | keep | **leave** | Post-hoc; bar met; 0 clicks |
| 38 | `best-peptide-for-weight-loss-2026` | 0 | — | keep | **optimize** (CTA + links) | Conversion-shaped ranking page with 0 PAGE yet; 1656w; natural funnel after the verdict |
| 39 | `is-bpc-157-safe` | 0 | — | keep | **optimize** (CTA + links) | Only blog→blog inbound in LINKGRAPH; 1138w; strongest safety-funnel blog |
| 40 | `surmount-5-tirzepatide-vs-semaglutide` | 0 | — | refresh | **optimize** | Head-to-head that matches the one converting intent class; R1 already sourced; internallink to `/compare/` + #2 blog, not a new slug |

### 2.2 Live posts with PAGE impressions (complete)

The 37 rows with impr ≥1 in §2.1 **are** the complete live PAGE set. Remaining 103 posts: 0 PAGE impressions in the 177-day apex window (query-export silence is not additional evidence of demand).

---

## 3. Twins — differentiate, do not fatten, do not merge

**46 exact-slug twins** (blog slug = `guides/` or `safety/` slug). Lucas: differentiate rather than fatten both. Merge-with-redirect blocked.

**Job split (binding for Optimizer + any later guide/safety editor):**

| Collection | Job | Must not |
|---|---|---|
| `/guide/[slug]` | Beginner definition: what the molecule is, aliases, approved vs research | Trial readouts, safety tables, "best for" |
| `/blog/[slug]` | Decision-support: how to read the evidence / what the dossier grade means / branded-drug vs research-chem distinction | A second "What is X?" H1 |
| `/safety/[slug]` | Adverse-event evidence, regulatory status, GRADE of harm | News tick; duplicating the guide definition |

**Where PAGE already picked a winner, the loser yields.** Yield = retitle + one distinct question + links to the winner and the dossier. Yield ≠ delete.

**Identical word counts (~copy twins):** `what-is-rybelsus`, `what-is-cjc-1295`, `what-is-ipamorelin`, `what-is-ozempic`, `what-is-semaglutide`, `what-is-retatrutide`, `what-is-bpc-157`, `what-is-melanotan`, `peptide-evidence-levels-explained`, `how-to-read-peptide-research`, `are-peptides-safe`, `how-do-peptides-work`, `how-do-glp-1-agonists-work`, `peptide-vs-protein`, `what-are-glp1-agonists`, `melanotan-safety`, `pt-141-safety`, `tirzepatide-safety`, `aod-9604-safety`, `recovery-peptides-safety`, `growth-hormone-peptides-safety`, `unregulated-peptides-safety`. First move: **H1, metaTitle, excerpt, first 80 words** — not a 1,200-word expansion of both files.

**Already-fattened blog halves (R1/`f1b91e0`) — do not add more depth to match:** `what-is-wegovy` (628 vs guide 390), `what-is-mk-677` (586 vs 290), `what-is-ghk-cu` (501 vs 197), `what-is-tb-500` (669 vs 200), `what-is-tesamorelin` (740 vs 185), `what-is-zepbound` (710 vs 462), `what-is-tirzepatide` (1043 vs 798), `glp1-safety-overview` (2048 vs safety 1740).

### Twin roster (all 46) — action is **differentiate-twin** unless noted

**Guide twins (36)**

| Blog slug | Blog PAGE | Other PAGE | Yield to | Why |
|---|---:|---|---|---|
| `what-is-wegovy` | 432 | guide silent | — | Blog keeps branded-drug evidence; guide stays molecule intro; distinct H1s |
| `what-is-mk-677` | 261 | silent | — | Blog = ibutamoren evidence/FDA Category 2 literacy; guide = what MK-677 is |
| `what-is-ghk-cu` | 114 | silent | — | Blog = topical vs injectable evidence split; guide = definition |
| `what-is-zepbound` | 31 | silent | — | Blog = tirzepatide brand / OSA indication literacy; guide = definition |
| `what-is-tb-500` | 28 | guide 10 | split | Both have PAGE; blog = fragment vs thymosin-beta-4 evidence; guide = definition |
| `what-is-tesamorelin` | 21 | silent (safety URL 220) | safety for AE | Blog must not become a safety page |
| `what-is-rybelsus` | 16 | silent | — | Identical copy; retitle blog to oral semaglutide evidence |
| `what-is-cjc-1295` | 15 | silent (safety 76) | safety for AE | |
| `what-is-ipamorelin` | 10 | silent (safety 27) | safety for AE | |
| `peptide-evidence-levels-explained` | 9 | **guide 42** | **guide** | Guide owns GRADE primer |
| `what-is-ozempic` | 4 | silent | — | Identical copy; blog → "Ozempic vs Wegovy vs Rybelsus: same molecule, three labels" **on this existing slug** |
| `what-is-tirzepatide` | 0 | silent | — | R1 already fattened; titles/job only; dosing table already stripped in R1 review |
| `what-is-semaglutide` | 0 | silent | — | Identical copy; yield definition to guide |
| `what-is-retatrutide` | 0 | silent | — | Identical ~181w; do not fatten into a TRIUMPH news post (those slugs exist) |
| `what-is-bpc-157` | 0 | silent | — | Yield definition to guide; `is-bpc-157-safe` owns safety-intent |
| `what-is-melanotan` | 0 | **guide 111** | **guide** | Guide already ranks; blog yields |
| `what-is-mounjaro` | 0 | silent | — | Brand twin of tirzepatide; do not triplicate with `what-is-tirzepatide` / `what-is-zepbound` — blog becomes label-difference page |
| `what-is-pt-141` | 0 | silent | — | Identical stub; safety twin is `pt-141-safety` |
| `what-is-ll-37` | 0 | silent | — | Yield definition to guide; `ll37-wound-healing` owns evidence |
| `what-is-humanin` | 0 | silent | — | `/safety/humanin-safety` has **213** PAGE impr — blog must not compete |
| `what-is-dihexa` | 0 | silent | — | `dihexa-memory-enhancement` owns the evidence story |
| `what-is-epithalon` | 0 | silent | — | Do not restore retired `epithalon-safety` blog slug |
| `what-is-sermorelin` | 0 | silent | — | |
| `what-is-thymalin` | 0 | silent | — | B8 pair `kristagen-vs-thymalin` already ranks — link it, don't clone |
| `what-are-gh-secretagogues` | 0 | silent | — | Class intro → guide; blog → how to read secretagogue evidence / Category 2 list **on this slug** |
| `what-are-glp1-agonists` | 0 | silent | — | Identical copy |
| `what-are-longevity-peptides` | 0 | silent | — | |
| `what-are-nootropic-peptides` | 0 | silent | — | |
| `what-are-recovery-peptides` | 0 | silent | — | |
| `how-do-glp-1-agonists-work` | 0 | silent | — | Mechanism → guide; blog must not become dosing |
| `how-do-peptides-work` | 0 | silent | — | Identical 512w |
| `how-to-read-peptide-research` | 0 | guide 31 | **guide** for the primer | Blog → "how PepCodex reads a paper" (funnel) |
| `peptide-clinical-trial-phases` | 0 | silent | — | |
| `peptide-vs-protein` | 0 | silent | — | Identical 602w |
| `are-peptides-safe` | 0 | silent | — | Yield generic safety Q to guide; blog points at `/safety/` hubs |
| `why-animal-studies-arent-enough` | 0 | silent | — | Funnel-eligible literacy; keep distinct from the guide copy |

**Safety twins (10)**

| Blog slug | Blog PAGE | Safety PAGE | Yield to | Why |
|---|---:|---|---|---|
| `glp1-safety-overview` | 23 | (same slug in safety; PAGE may be collapsed) | split | Both already long; **do not fatten**; blog = class overview, safety = AE/regulatory |
| `tesamorelin-safety` | 0 | **220 pos 10.8** | **safety** | Safety URL is a real ranking page; blog yields |
| `melanotan-safety` | 0 | silent | safety | Identical 228w; missing `/peptides/melanotan-i` link (slug ≠ name) |
| `pt-141-safety` | 0 | silent | safety | Identical 193w |
| `semaglutide-safety` | 0 | silent | safety | |
| `tirzepatide-safety` | 0 | silent | safety | Identical 446w |
| `aod-9604-safety` | 0 | silent | safety | `aod9604-human-efficacy` owns the efficacy story |
| `recovery-peptides-safety` | 0 | silent | safety | |
| `growth-hormone-peptides-safety` | 0 | silent | safety | |
| `unregulated-peptides-safety` | 0 | silent | safety | Funnel-eligible after AE framing; still yield tables to `/safety/` |

**Safety URLs that rank with no blog twin (link from existing posts; do not create blog copies):** `kpv-safety` 847, `humanin-safety` 213, `selank-safety` 182, `thymosin-alpha-1-safety` 178, `cjc-1295-safety` 76, `bpc-157-safety` 28, `ipamorelin-safety` 27.

---

## 4. Remaining 140 — optimize / differentiate-twin / leave

Every post not in the twin table and not in the top-40 optimize list is **leave** unless listed here.

**Leave (do not spend Wave 2 body budget):** manufacturing/revenue ticks (`lilly-*`, `novo-manufacturing-expansion`), 0-PAGE news that already met the citation bar after R2/R3 (`glp1-shortage-easing`, `glp1-telehealth-access`, `fda-peptide-stability-guidance`, `microneedle-peptide-delivery`, `natriuretic-peptide-heart-failure`, `new-gh-secretagogue-safety`, `oral-semaglutide-25mg-approval`, `orforglipron-14-percent-weight-loss`, `pemvidutide-eu-mash-approval`, `pentapeptide-hair-follicle`, `peptide-antibiotic-resistant-bacteria`, `thymulin-vaccine-response`, `tirzepatide-cancer-incidence`, `survodutide-fda-submission-mash`, `wegovy-pill-launches-us`, `dihexa-memory-enhancement`, `cagrisema-nda-filed` sibling of the ranking NDA post). Refresh `lastUpdated` only if Freshness Scout later puts a **fetched** identifier on the worklist.

**Optimize later (after twin sets), 0 PAGE, still worth a light pass:** `tesamorelin-liver-fat-hiv` (1-source historically; funnel-eligible), `selank-anxiolytic-study` (1-source, 459w), `humanin-neuroprotective-trial`, `antimicrobial-peptide-funding` (1-source), `peptide-biosensor-pathogen` (1-source), `peptide-stapling-oral-delivery` (1-source), `peptide-cart-tumor-penetration` (1-source), `peptide-drug-conjugate-solid-tumors` (1-source), `fda-compounded-semaglutide-warning` (1-source). These are **citation hygiene**, not traffic plays. Worklist-lock to ledger/Scout ids; gaps → `NEEDS-VERIFICATION-*`, never invented.

**Do not "optimize" by writing news-vs-STAT.** Aged "ongoing / expected" language on 0-PAGE briefings is a Freshness/Evidence job when an identifier exists, not a reason to add URLs.

---

## 5. New-post candidates

### No approved new URLs

None of the following clears L6: named demand from **PAGE** data **or** a converting comparison shape, **plus** inbound from a page ≤2 clicks from `/`, **plus** net URL ≤ 0 (or a documented Lucas exception). There is no exception.

**Rejected (and why), so Writer (W) and Coverage (N) stop:**

| Idea | Why it fails |
|---|---|
| New cerebrolysin blog (dossier 5,228 PAGE impr, 0 blog coverage) | Demand is on **`/peptides/cerebrolysin`**, not a missing blog URL. A post is +1 URL. Cover by linking from existing ranking posts + dossier template (Link Guardian / Dossier), not a new slug |
| Blog copy of `survodutide vs cagrilintide` | Converting shape **already ships** at `/compare/cagrilintide-vs-survodutide` (~14 PAGE clicks). Duplicate is +1 URL and fights the page that works |
| More semaglutide/tirzepatide/retatrutide comparisons | **B8.** Site ranks where big media is absent. PAGE data did not overturn this |
| MARKETING lanes A5/B7 "consolidating hubs" as new blog slugs | New URLs, or merges. Merges blocked on Lucas |
| MARKETING B1 FDA Category 2 list as a new post | Tool-shaped and high-confidence **as an update to `/regulatory-tracker`**, not as `/blog/...` |
| ribupatide / olatorepatide dossiers-as-blog | `GAPS.md` coverage holes. No PAGE demand (URLs do not exist). Out of L6 unless CONTENT-PLAN (this file) later records a Lucas add **and** a matching drop |
| Restore `ai-peptide-drug-discovery` / approvals-record | Retired for integrity. 301s live. Recreate = +1 URL + fabrication risk |
| News commentary vs STAT/Reuters | Explicitly out of L6 |

Blog Writer (W): **do not write.** Return "no approved new URLs."

---

## 6. App CTA — existing posts that are natural funnel surfaces

PepTracker is pre-launch. Copy degrades to waitlist. No store badges. No dosing. No vendor links. **Not** a sticky banner on `what-is-*` twins until they are job-split.

**Template placements (Funnel agent U, higher leverage, zero URLs):** after calculator result; after dossier evidence/timeline; after safety AE section; newsletter. Homepage currently uses `getCollection('blog')` only for a count — it no longer features posts (LINKGRAPH's four homepage slots are gone). That is a crawl/funnel template issue, not an Optimizer edit.

**Blog end-of-post (P4) — Optimizer may add CTA only on this list:**

| Priority | Slug | Why it is natural |
|---|---|---|
| 1 | `is-bpc-157-safe` | Reader just finished a safety-evidence job; "log what you notice" |
| 2 | `glp1-safety-overview` | After class AE literacy, not beside the grade |
| 3 | `unregulated-peptides-safety` | After AE framing; yield tables to `/safety/` |
| 4 | `how-to-read-peptide-research` | After the method; waitlist as "keep reading with a tracker" |
| 5 | `why-animal-studies-arent-enough` | Same literacy job |
| 6 | `peptide-evidence-levels-explained` | Only **after** twin split (blog = how PepCodex grades) |
| 7 | `semaglutide-vs-tirzepatide-2026` | After the verdict, never above it (MARKETING 1.2) |
| 8 | `best-peptide-for-weight-loss-2026` | After rankings |
| 9 | `surmount-5-tirzepatide-vs-semaglutide` | After head-to-head |
| 10 | `tirzepatide-surmount-osa` | Chronic outcome tracking |
| 11 | `zepbound-sleep-apnea-approval` | Same |
| 12 | `dsip-sleep-quality-study` | Sleep log |
| 13 | `tesamorelin-liver-fat-hiv` | Biomarker tracking |
| 14 | `retatrutide-phase3-enrollment` | "Track what the trials measure" |
| 15 | `ss31-mitochondrial-heart-failure` | After evidence, not as a vendor pitch |
| 16 | `semax-neuroprotection-stroke` | After the evidence grade |

**Do not put CTA on:** remaining identical `what-is-*` copies; manufacturing news; oncology preclinical; glossary-like 150–300w stubs.

Event: Funnel agent should emit `app_cta_click` with `{placement, page_path, surface_type}`. Optimizer does not invent GA4 wiring.

---

## 7. What Wave 2 Blog Optimizer should do first (sets of 10)

**Constraints (AGENTS.md O):** assigned `src/content/blog/*.mdx` only. No new slugs, no 301s, no retire, no affiliates, no dosing. Independent adversarial review per set. Worklist-locked. `qa:advice` + banned-content clean. Internal links: `getStaticPaths` slugs, **no trailing slash**, free-text related-\* guarded with a `Set`.

**Do not re-rewrite R1/R2/`f1b91e0` bodies for length.** Those 69 files had an integrity/estimand pass. Touch them for: twin H1/meta, CTR title/description, real internal links, lastUpdated, CTA if listed.

**Parallelization:** a Guide/Safety editor may take the **paired** `src/content/guides/` or `src/content/safety/` file in the same set (different paths). Do not send two editors to one file. If no second editor, Optimizer still splits the **blog** half so it stops cannibalizing.

### Set 1 — first (high-PAGE twins)

`what-is-wegovy` · `what-is-mk-677` · `what-is-ghk-cu` · `what-is-tb-500` · `what-is-tesamorelin` · `what-is-zepbound` · `what-is-rybelsus` · `what-is-cjc-1295` · `what-is-ipamorelin` · `peptide-evidence-levels-explained`

Success: each blog H1 ≠ the guide H1; blog links the guide + the real peptide slug; `peptide-evidence-levels-explained` yields the primer to `/guide/peptide-evidence-levels-explained`; no word-count race on the seven already-fattened files.

### Set 2 — remaining high-confusion what-is twins

`what-is-ozempic` · `what-is-semaglutide` · `what-is-tirzepatide` · `what-is-retatrutide` · `what-is-bpc-157` · `what-is-melanotan` · `what-is-mounjaro` · `what-is-pt-141` · `what-is-ll-37` · `what-is-humanin`

Success: `what-is-melanotan` **yields** (guide has 111 PAGE impr); `what-is-humanin` does not compete with `/safety/humanin-safety` (213 impr); `what-is-mounjaro` is a label-difference page, not a fourth tirzepatide definition; `what-is-tirzepatide` is titles/job only.

### Set 3 — class / how-to guide twins

`what-is-dihexa` · `what-is-epithalon` · `what-is-sermorelin` · `what-is-thymalin` · `what-are-gh-secretagogues` · `what-are-glp1-agonists` · `what-are-longevity-peptides` · `what-are-nootropic-peptides` · `what-are-recovery-peptides` · `how-do-glp-1-agonists-work`

Success: class blogs do not become buying guides; GH secretagogue blog may cite FDA Category 2 **from fda.gov** if Scout/Regulatory already verified the page this run — otherwise link `/regulatory-tracker` and leave the list off.

### Set 4 — last guide twins + first safety twins

`how-do-peptides-work` · `how-to-read-peptide-research` · `peptide-clinical-trial-phases` · `peptide-vs-protein` · `are-peptides-safe` · `why-animal-studies-arent-enough` · `tesamorelin-safety` · `glp1-safety-overview` · `melanotan-safety` · `unregulated-peptides-safety`

Success: `tesamorelin-safety` **yields** to `/safety/tesamorelin-safety` (220 impr); `glp1-safety-overview` not fattened; CTA allowed on `how-to-read-peptide-research`, `why-animal-studies-arent-enough`, `glp1-safety-overview`, `unregulated-peptides-safety`. `melanotan-safety` links `/peptides/melanotan-i` (not a name-derived slug).

### Set 5 — remaining safety twins + first CTR pass

`pt-141-safety` · `semaglutide-safety` · `tirzepatide-safety` · `aod-9604-safety` · `recovery-peptides-safety` · `growth-hormone-peptides-safety` · `semax-neuroprotection-stroke` · `semaglutide-vs-tirzepatide-2026` · `dsip-sleep-quality-study` · `is-bpc-157-safe`

Success: six safety blogs yield tables to `/safety/[slug]`; four ranking posts get mobile-first title/meta (promise more than the SERP snippet), body links without trailing slash, CTA on the three funnel-listed slugs (`semax`, `sema-vs-tirz`, `is-bpc-157-safe`). Confirm `relatedGlossary`/`relatedPeptides` against live collections (`oxytocin`, `ema-approval`, `insulin` class — miss = text).

### Set 6 — rest of PAGE-ranking optimize list

`zepbound-sleep-apnea-approval` · `cagrilintide-semaglutide-approval` · `cagrisema-nda-filed-glp1-amylin-combo` · `retatrutide-phase3-enrollment` · `ss31-mitochondrial-heart-failure` · `pemvidutide-impact-mash-resolution` · `oxytocin-autism-cognition` · `generic-saxenda-fda-approval` · `fda-compounding-oversight` · `thymosin-alpha1-elderly-immune`

Success: each names and links its real dossier + one B8-style `/compare/` if a real pair exists; CTA only on `zepbound-sleep-apnea-approval` and `retatrutide-phase3-enrollment` from this set.

### Set 7 — remaining PAGE + conversion-shaped zeros

`survodutide-phase-2-mash-results` · `ll37-wound-healing` · `tirzepatide-surmount-osa` · `peptide-protacs-emerge-cancer-treatment` · `orforglipron-attain-1-results` · `ghkcu-stem-cell-differentiation` · `amycretin-phase2-results` · `best-peptide-for-weight-loss-2026` · `surmount-5-tirzepatide-vs-semaglutide` · `tesamorelin-liver-fat-hiv`

Success: survodutide post links **existing** `/compare/cagrilintide-vs-survodutide`; ATTAIN-1 leads 11.2%; CTA on OSA, best-of, SURMOUNT-5, tesamorelin-liver; no new comparison slugs.

**Stop after Set 7 unless Judge passes and Lucas wants the 0-PAGE citation-hygiene tail.** That tail is not traffic work.

**Not Optimizer (hand off):** related-posts widget; dossier→blog surfacing; restore homepage featured posts; sitemap `lastmod`; Vercel 307; WAF; recreating retired slugs; any `src/content/guides|safety` edit unless Conductor assigns a second editor to those paths.

---

## 8. Inbound path (existing URLs only)

Every live post is reachable via `/blog` (unpaginated). Click-depth from `/` is 2 if global nav still includes Blog. Homepage no longer slices four posts — Link Guardian should restore **featured existing slugs** (prefer #1–#3 PAGE leaders + `is-bpc-157-safe`), not add URLs.

Optimizer body links that help crawl without new pages: ranking blogs → matching `/peptides/<entry.slug>`, `/safety/<existing>`, `/compare/<existing pair>`, `/calculator/reconstitution/<existing>`. Guard misses as text. Prefer B8 pairs over GLP-1 vs GLP-1.

Cerebrolysin coverage gap (5,228 dossier impr, 0 blog links): add a **contextual** link from `semax-neuroprotection-stroke` and any nootropic twin **only if** the sentence is on-subject. That is an inbound path to a page that already exists.

---

## 9. Blockers

1. **Live PAGE/GA4 pull blocked on Lucas** (Gate 0). This plan uses 2026-07-25 PAGE data. Rewrites from 2026-08-17 are invisible in GSC until a new pull.
2. **Twin merge-with-redirect blocked on Lucas.** Default is differentiate-only.
3. **No Lucas-approved URL add.** Writer (W) is idle.
4. **Do not restore 301'd fabrication slugs** even though they still show PAGE impressions.
5. **Integrity debt on 1-source posts** is a Scout/Verifier job, not an invitation to invent PMIDs.
6. **Template CTA / related-posts / homepage featured** sit outside Optimizer. Funnel (U) and Link Guardian own them.
7. **`MEASUREMENT.md` for 2026-09-01 is absent** — if Measurement Steward lands a newer PAGE export, re-rank before Set 6 (query export still censored).

---

## 10. Judge notes (so this plan can fail honestly)

- Ledger adds = 0. If an Implementer ships a new `src/content/blog/*.mdx` slug, L6 fails.
- If Optimizer fattens both halves of a twin, L6 fails (Lucas rule).
- If demand is argued from query-export silence, L6 fails (A2).
- If the next idea is "more GLP-1 vs GLP-1," L6 fails (B8) unless a newer PAGE export shows those URLs earning clicks comparable to under-covered pairs.
- If CTA appears only in privacy/terms, L7 fails (separate loop) — this plan names 16 existing blog surfaces so that cannot be the only path.

*Agent S. Artifact: `.planning/seo-engine/runs/2026-09-01/CONTENT-PLAN.md`.*
