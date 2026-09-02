# Council seat: Expansionist

**Model:** Grok (xAI) substituting for Fable 5.  
**Date:** 2026-09-02  
**Mode:** AUDIT ONLY. No site edits, no outreach, no enrollments.  
**Write surface:** this file only.

**Read for this seat:** `audit-b/OPPORTUNITIES.json` (all 25), `audit-b/IMPRESSION-SYSTEM.md`, `audit-c/AFFILIATE-MATRIX.md`, `audit-c/PAID-LISTING-MODEL.md`, `audit-a/REPORT.md` §§6–9, `MARKETING-BRIEF.md` first 80 lines (plus funnel/CTA and affiliate-arithmetic sections already in that brief). Live GSC/GA4: **BLOCKED** (`invalid_rapt`). **No search volume invented.** Historical July 2026 GSC figures are dated, not current.

---

## 1. Seat thesis

The other auditors correctly contracted. Crawl budget is binding; 1,112 frozen indexable surfaces is the problem, not the inventory to “fill.” The Expansionist job is not to mint URLs. It is to name the **upside they under-weighted**: concentration that makes a small set of *already-live* URLs do a job, plus a conversion path to PepTracker that does not need a landing page.

Two facts from the marketing brief still order this seat, even though the 2026-07-25 pull is stale:

1. Affiliate math at ~121 clicks / six months is a rounding error. Audit C’s **PURSUE** column is first-party PepTracker and unpaid citations — not vendors, not clinics.
2. The only site section historically described as 0% silent was **tool-shaped** (three reconstitution calculators; ~256 impressions/page in that pull). `/trials` and `/regulatory-tracker` were never crawled. That is not a volume forecast. It is a structural hint: Google fetched tools; it did not fetch the article farm.

**Expansion = fewer, truer, tool-shaped URLs that hand a completed job to the waitlist.** Anything that adds indexable URLs, city doorways, pairwise shells, or a buy path is not expansion. It is dilution with legal residue.

---

## 2. Verdict on the 25 opportunities

Codes: **DO NOW** (unlocks crawl or conversion) · **DO AFTER prune** · **HYGIENE** (must, but not a growth SKU) · **DEFER** · **VETO** (explicitly do not).

| ID | Title (short) | Verdict | Why this seat agrees or cuts |
|---|---|---|---|
| OPP-01 | One definition URL; 301 36 blog/guide twins | **DO NOW** | Cannibalization is anti-expansion. Keep the guide; 301 the blog. Newsletter on the survivor, not a third “what is.” |
| OPP-02 | Prune ~181 thin comparisons | **DO NOW** | Largest crawl gift in the set. Keep trial-level head-to-heads only. The comparison *product* is 10–20 pages with estimand tables, not 269 shells. |
| OPP-03 | Canonical sema vs tirz = `/compare/tirzepatide-vs-semaglutide` | **DO NOW** | The one vs-query worth owning. 301 the 2026 blog. Do **not** mint `/ozempic-vs-mounjaro`. Brand guides stay brand explainers. |
| OPP-04 | Fold 295 peptide-condition URLs into dossiers | **DO NOW** | Depth-3 satellites are not a condition product. Condition evidence belongs as dossier H2 + fragment IDs. |
| OPP-05 | Single `/conditions` hub; merge 15 thin articles | **DO AFTER prune** | Useful as a table (condition × peptide × grade × FDA status). Do it after OPP-04 so the hub does not link doomed satellites. |
| OPP-06 | noindex literature-empty bioregulators | **DO NOW** | Honest “not named in indexed literature” is a differentiator vendor sites will not ship. Do not write new Khavinson pages. Monetization: **REJECT**. |
| OPP-07 | BPC cluster: dossier + safety + one guide | **DO NOW** | Highest-recognition research peptide. Upside is *calm map of animal vs human vs not-approved*, not a fourth URL. Affiliate for BPC: **REJECT**. |
| OPP-08 | Refresh `/regulatory-tracker` (2026 compounding) | **DO NOW — under-weighted original data** | This is the news product. Dated timeline on an existing URL beats a blog farm. Proposal ≠ final. Not legal advice. |
| OPP-09 | Drug schema matches visible regulatory status | **DO NOW** | Approved-drug dossiers cannot rank as drugs while JSON-LD says research-only / all-subcutaneous. Zero new URLs. Highest machine-upside in the set. |
| OPP-10 | Remove sitewide `X-Robots-Tag: index, follow` | **DO FIRST** | Noindex is theater until the header agrees. Every prune in this list depends on it. |
| OPP-11 | Tesamorelin calculator: unit conversion, not dose | **DO NOW, constrained** | Keep **this** URL. Undo the branch 301 to `/peptides/tesamorelin` (vercel.json). Do **not** add BPC/semaglutide/hexarelin calculators. Copy: mass+volume → concentration. Waitlist only if it does not store a dose. |
| OPP-12 | Named editor + correction log on existing trust pages | **DO NOW** | YMYL trust is ranking. Owner supplies real names; do not generate bios. If no medical reviewer, say so. |
| OPP-13 | One homepage canonical; current copy; real featured URLs | **DO NOW — under-weighted conversion surface** | Depth 0 is the only guaranteed crawl. Today it is a magazine (“Spring 2026”, “No. 03 lands this summer”) with a generic newsletter. Featured paths should exist on production: dossiers, `/trials`, `/methodology`, one calculator. Do not boast URL count. Waitlist belongs here. |
| OPP-14 | Deploy current `llms.txt`; stop calling `/directory` a clinic directory | **DO AFTER prune** | Free machine distribution. Counts must match the retained indexable set, not 92 dossiers and trailing slashes. |
| OPP-15 | Fix Organization logo + sameAs | **HYGIENE** | Cheap entity fix (`logo.png` 404; `og-default.png` 200). Do it; do not call it growth. |
| OPP-16 | One public directory URL; do not reindex cities | **HYGIENE / DEFER as SKU** | Pick `/directory` as an honest “not operating” status page, or noindex it. **Do not reindex `/clinics`.** Paid listings: Audit C **DEFER** until 52 placeholders are gone. This seat does **not** argue directory revenue. |
| OPP-17 | City FAQPage only if clinic count > 0 and records real | **HYGIENE (P0-adjacent)** | “Multiple” clinics at count 0 is a lie, not a local-SEO tactic. Keep cities noindex. |
| OPP-18 | Repair comparison meta (YAML leak; unique titles) | **DO AFTER prune** | Only on the retained set. Do not put “better” in titles. |
| OPP-19 | Semaglutide snippet without stale study-count | **DO NOW** | Flagship approved-drug URL. Stable title = indications + grade, not “67 Studies / Feb 2026.” |
| OPP-20 | Orforglipron: one dossier; no more blogs | **DO NOW + Audit A label card** | Keep the dossier. **Under-weighted:** Foundayo label card on *this* URL (indication, 17.2 mg max, boxed warning, not T2D, no combo GLP-1s) — Audit A §6. That is news without a news URL. Confirm numbers in Audit A; do not headline press-release estimands. |
| OPP-21 | Retatrutide: dossier + one comparison, not a pairwise farm | **DO AFTER prune** | Same logic as OPP-02. Phase 3 status with citations; 301 166-word shells. |
| OPP-22 | `/fda-notice`: approved vs unapproved vs compounded | **DO NOW** | Three-bucket table with on-site examples is original explainer work. Legal review. Not legal advice. |
| OPP-23 | Analytics + consent + GSC reauth | **DO FIRST** | Conversion is unmeasured (B-030). Impressions cannot be managed. Distinct `waitlist_signup` event. Do not treat historical ~91% GA4 bots or 0.31% CTR as current. |
| OPP-24 | Internal links for 83 low-inbound indexable URLs | **DO AFTER prune** | Link only what you keep. **Under-weighted targets:** tesamorelin calculator, `/trials`, `/regulatory-tracker` (all low-inbound or historically uncrawled). Do not build hubs to justify doomed URLs. |
| OPP-25 | Do not pursue more cities, calculators, what-is blogs, pairwise shells | **ADOPT AS STANDING VETO** | This is the Expansionist veto. Those queries exist; answering them with programmatic URLs worsens crawl and YMYL. If anything, delete. |

**Count:** 14 DO NOW (including two DO FIRST), 5 DO AFTER prune, 3 HYGIENE (one also DEFER-as-SKU), 1 standing VETO. Nothing in the 25 is “ship a new indexable cluster.”

---

## 3. What is actually worth doing (sequenced)

**Wave 0 — instruments (no content):** OPP-23, OPP-10. Without GSC and a truthful robots header, every later “impact: high” is unfalsifiable.

**Wave 1 — give Google a smaller true graph:** OPP-01, OPP-02, OPP-03, OPP-04, OPP-06. Net URL count down by hundreds. Sitemap drops with the 301s. `graph:check` before any link commit.

**Wave 2 — make the survivors do a job:** OPP-08, OPP-09, OPP-11 (restore tesamorelin calculator; unit-conversion copy), OPP-07, OPP-19, OPP-20 (Foundayo card), OPP-22, OPP-12, OPP-13. This is the expansion wave: original data and tools **on existing URLs**.

**Wave 3 — polish the retained set:** OPP-05, OPP-18, OPP-21, OPP-14, OPP-24 (contextual links to calculator/trials/tracker), OPP-15.

**Never a wave:** OPP-16 as a marketplace, OPP-25 classes, vendor affiliates, extra reconstitution URLs, `/protocols` as a product (Audit A strongest finding: fabricated human doses on those three pages — remove/noindex, do not convert).

---

## 4. Missed original-data / tool ideas that reuse EXISTING URLs

Audit B §10 already allows living `/trials` and `/regulatory-tracker`, and forbids more calculators, more cities, and PubMed-duplicate “datasets.” This seat adds jobs those pages should do. **None of the following mint an indexable URL.**

### 4.1 `/trials` — the original dataset the site already has

`src/pages/trials/index.astro` already walks `data/source-packs/*.json` and renders a filterable table. Historical brief: this URL was never crawled. After Wave 1, it should be a depth-1 homepage/catalogue link (OPP-13 + OPP-24).

Upside, still on this URL:

- Last-checked date per NCT; flag rows that failed drug-match (do not silently relabel).
- Client-side filters only (status / phase / compound). No faceted URLs — B-024 already proves this pattern is safe on `/peptides`.
- Waitlist line after a filter action: “PepTracker will let you log the endpoints this registration names.” No dose, no source.

Do **not** publish `.planning` graph snapshots as a public dataset. Internal ratchet only.

### 4.2 `/regulatory-tracker` — living timeline (OPP-08, raised)

This is the freshness signal. Put 2026 compounding actions here (shortage end ≠ 503B final; proposal ≠ determination). Email “this row changed” through the existing Beehiiv list (tagged), not a `/blog/fda-compounding-{date}` slug. Repo compounding blogs that are not in live: do not republish as new slugs.

### 4.3 `/peptides` hub — tool UX without faceted URLs

Already filters category / evidence / compoundType in the client. Add two filters from data you already compute:

- Regulatory bucket: FDA-approved / investigational / research-only (must match visible dossier status, same source as OPP-09).
- Literature identity: “named in indexed PubMed” vs “no independent records naming this product” (source-census, not parent-compound aliases).

That is a tool. It is not 107 new landing pages.

### 4.4 Dossier chips, not satellite pages

On each retained `/peptides/{slug}`: human-N, last primary-source date, literature-named yes/no, FDA/WADA chips that match the body. Audit A already listed the content: WADA 2026 split, 503A vs “compounding pharmacy,” estimand footnotes, Barth-only Forzinity, perioperative GLP-1 aspiration. All of that is dossier/safety/methodology refresh.

**Foundayo card on `/peptides/orforglipron`** is the missed news-to-app moment: a moving investigational→labeled drug is exactly what a tracker is for. Still one URL.

### 4.5 Retained comparisons as estimand tables

The 10–20 comparisons that survive OPP-02 should look like tools: N, duration, population, **treatment-policy vs efficacy estimand**, AE table, labeled indications. That is original synthesis of published papers, not a new `/compare` farm. CTA only after the table, to the two dossiers — not “subscribe for more comparisons” (ComparisonLayout today).

### 4.6 Tesamorelin calculator — keep one tool URL

Inventory: **4** reconstitution MDX files (tesamorelin, cagrilintide, hexarelin, igf-1-lr3). Marketing brief described **3** live tool pages as the only 0% silent section. This branch **301s** `/calculator/reconstitution/tesamorelin` → dossier.

Expansionist cut:

- **Keep** tesamorelin (FDA-approved Egrifta; unit conversion; manufacturer instructions govern). Restore the URL; add inbound from `/peptides/tesamorelin` and `/safety/tesamorelin-safety` (OPP-24).
- **Do not keep as indexable tools** the research-vial calculators. They encode “desired dose” / volume-per-dose (B-011) and collide with the sourcing/dosing ban (Audit A §9). 301 or noindex+sitemap-drop. OPP-25 covers “more calculators”; it should also cover *these extras*.
- Never HowTo schema, never BPC presets, never syringe-unit “dosing apps.” Competitors (PepSync, PepPal) already occupy that SERP; PepCodex must not.

### 4.7 `/methodology` + `/editorial-policy` — original trust objects

Estimand explainer and GRADE key on `/methodology` (the marketing brief’s A2, as a refresh, not a blog). Dated correction log on `/editorial-policy` (OPP-12). These are citable. They are not a `/authors/*` farm.

### 4.8 `/newsletter` and Beehiiv — distribution with zero crawl

Monthly “what changed on `/trials` and `/regulatory-tracker`.” Existing `/newsletter` URL. Do not create an indexable archive of issues. Tag research vs waitlist separately (see §5).

### 4.9 `llms.txt` / `llms-full.txt` — machine citation, not a human landing

OPP-14. Assistants citing PepCodex is distribution that does not spend HTML crawl if the file stays accurate and slash-correct.

### 4.10 Explicitly not tools (reject even though they “convert”)

| Idea | Why rejected |
|---|---|
| QualityChecklist as an interactive “evaluate this vial” tool | Audit A §9: monetizes research-chem intent while policy forbids sourcing. Do not promote; consider removal from dossiers. Marketing brief’s “tools index” lesson does **not** license this component. |
| Interaction checker / stack builder / blend / cost / accumulation plotter | peptide-db clones. Dosing, stacking, or purchasing-adjacent. OPP-25 + banned content. |
| Lab-testing or COA affiliate widgets | Audit C **DEFER**; terms UNVERIFIABLE; looks like a buy path. Arithmetic still a rounding error. |
| Public crawl-graph / “1,300 pages” dashboard | Vanity. Homepage already treats comparison count as a boast. |
| `/api/peptide-search` as indexable search-result pages | Keep the JSON API. Do not mint SERP URLs. |
| Exit-intent modal | Component exists unused. Keep unused. Intrusive UX on YMYL. |

---

## 5. PepTracker conversion without new indexable pages

The conversion surface **already exists**. `AppWaitlistCTA.astro` posts to `/api/subscribe` with hidden `source="peptracker_waitlist"`. Copy is already the right product: local log, not doses or sources, no store listing yet, MedWatch for AEs. Audit A §9: the waitlist CTA is conversion, not a health claim. Audit C: PepTracker is the only **PURSUE**. B-030: unmeasured.

The miss is not a `/app` landing page. The miss is placement, tagging, and measurement on URLs that already rank-or-can-rank.

### 5.1 Do not create

- `/app`, `/peptracker`, `/waitlist`, `/download` as indexable pages.
- Store-listing doorway blogs.
- A second domain’s marketing site linked as a crawl sink.
- If a dedicated waitlist URL is ever required for ads, **noindex + sitemap exclude**. Google must fetch to read noindex; do not advertise it.

Pre-launch the product **is** email. Post-launch, flip the same CTAs from waitlist copy to store links. Same URLs.

### 5.2 Where the handoff is natural (job already completed)

| Existing URL class | Placement | Copy job |
|---|---|---|
| Tesamorelin calculator (only retained tool) | After the result, existing `context="calculator"` | “Keep this calculation.” Must not persist a dose. |
| Retained dossiers | After evidence/timeline, **not** above the grade, **not** beside QualityChecklist | Existing `context="dossier"`: log observations against the evidence horizon. |
| Safety pages | After adverse-event section | Existing `context="safety"` + MedWatch. |
| `/trials` | After the table / a filter | Log named endpoints. New context string; same component; **same URL**. |
| `/regulatory-tracker` | End of timeline | “Email me when this row changes” = newsletter tag, not app-as-legal-alert. |
| Homepage `/` | Replace magazine subscribe | Explicit waitlist **or** two labeled choices (research list vs app waitlist). Featured: real production URLs, `/trials`, `/methodology`, calculator. |
| Surviving what-is **guides** for tracked compounds | Footer only | Definition intent is short; one line, not a second form. |
| Retained comparisons | **After** the estimand table | One line into the two dossiers, not “new comparison dossiers” (that farm is being killed). |

### 5.3 Where a CTA is damaging (do not “expand” into these)

- Above or inside evidence grades (vendor-masquerading-as-education read; marketing brief 1.2).
- Comparison pages *before* the table/verdict.
- Glossary (many already noindex; ten-second intent).
- City / clinic / `/directory` (fiction; Audit C).
- `/protocols/*` (fabricated doses — remove, do not convert).
- Peptide-condition satellites (OPP-04).
- Thin comparisons slated for 301 (do not add waitlist chrome to URLs you are deleting).
- Exit-intent / interstitials.

### 5.4 Fix the implementation bugs that leak conversion

1. **Same list as research newsletter.** The waitlist component currently says so. IMPRESSION-SYSTEM already requires a distinct `peptracker_waitlist` Beehiiv tag (and a distinct research list if both exist). That is ops on `/api/subscribe`, not a new page.
2. **Double ask.** DossierLayout renders `AppWaitlistCTA` then a full “Get Research Alerts” `NewsletterForm`. CalculatorLayout does the same. One ask per page. Default: waitlist on dossier/calculator/safety; research newsletter on `/newsletter`, blog, homepage-as-choice.
3. **Generic `source="website_form"`** on homepage and most layouts. Use the existing hidden field: `peptracker_waitlist:home`, `:dossier:{slug}`, `:calculator:tesamorelin`, `:safety:{slug}`, `:trials`. Enables a later onboarding email without extra URLs.
4. **Homepage is not in the waitlist graph.** `AppWaitlistCTA` is not used on any `src/pages/*` file; only layouts. Depth 0 currently sells a seasonal issue. That is the highest-leverage CTA miss in the repo.
5. **ComparisonLayout newsletter copy** promises more comparison dossiers — the opposite of OPP-02.
6. **Measure** `waitlist_signup` (OPP-23). Until GA4/GSC work, do not invent a conversion rate. Do not treat July 2026 81+40 clicks as a funnel baseline for 2026-09.

### 5.5 What PepTracker is allowed to be, on-site

Terms/privacy already describe a **local-first** log (user-entered protocols, reminders, calculations, exports; V1 no account backend). Site CTAs must stay inside that: log what trials measured, keep a reconstitution **concentration**, log what you notice. They must not: recommend a dose, name a vendor, score a clinic, or ingest PHI through Beehiiv.

Calculator → waitlist is valid only after OPP-11 (unit conversion). A “keep this dose” CTA is a protocol, and protocols are banned.

### 5.6 Monetization adjacency (so conversion is not crowded out)

- **Vendor / RUO / compounding affiliates:** REJECT (policy + FDA posture + Audit C). Disclosure cannot cure a sourcing recommendation.
- **Paid clinic listings:** DEFER. Model in `PAID-LISTING-MODEL.md` is not live policy and is radioactive on 52 `example.com` records. Payment must never buy Verified or grades. Reindexing `/clinics` is not a conversion strategy.
- **Newsletter sponsorship, non-vendor:** CAUTIOUS TEST only after the directory fiction is gone and the firewall is executed. Off dossiers.
- **Manufacturer copay cards, lab affiliates, AdSense:** DEFER. Terms not opened; traffic cannot pay for the disclosure burden.
- **Examine.com pattern (from the brief):** sell the depth of your own research to your own audience. PepTracker is that product. “No vendor affiliates” is the feature.

Affiliate arithmetic from the brief (dated, still directional): even an aggressive traffic triple on ~121 clicks / 6 months does not produce a material compliant-affiliate line. Do not trade the moat for it.

---

## 6. Under-weighted upside (what other auditors left on the table)

1. **Tool-shaped existing URLs are the impression engine**, not blogs. `/trials`, `/regulatory-tracker`, tesamorelin calculator. Historical: calculators crawled; trackers not. Link them from `/`. Do not 301 the calculator in this branch.
2. **Homepage is a conversion surface**, not a catalogue brag. Featured briefs currently include `semaglutide-vs-tirzepatide-2026` (OPP-03 cannibal) and a magazine issue line. Featured peptides lead with BPC-157 / TB-500 / PT-141 alongside GLP-1s — a recovery-stack billboard. Prefer approved-drug flagships + tesamorelin (has the tool) + one honest BPC link into the safety page.
3. **Waitlist is built and idle.** Measurement, tags, and homepage placement beat any new landing.
4. **Foundayo / orforglipron label card** is Audit A new-information that OPP-20 under-states as “don’t add blogs.”
5. **Client-side filters** are the safe way to add tool UX (already true on `/peptides`).
6. **Literature-empty honesty** (OPP-06) is marketable. Vendor sites will not say “this name has no independent papers.”
7. **Schema that matches labels** (OPP-09) is how approved drugs become entities. That is expansion Google can use without a new URL.
8. **Double newsletter** wastes the only conversion moment on the best pages.

---

## 7. Standing rejects (this seat will not “find upside” here)

- New city pages, new calculators, new what-is blogs, new pairwise GLP-1/retatrutide shells (OPP-25).
- Reindexing `/clinics` or selling the current 52 records.
- Research-chem, grey-market, or compounding-pharmacy affiliates.
- “BPC-157 now legal” / “FDA approved peptides” posts (Audit A §7). A PCAC vote is not an approval.
- Protocol pages as a growth surface.
- QualityChecklist, stack/interaction/cost tools, HowTo schema on calculators.
- Invented search volume, KD, or traffic forecasts. GSC baseline = UNAVAILABLE as of 2026-09-02.
- Net URL count up without a larger removal.

---

## 8. Limits

- No current impressions, clicks, CTR, or waitlist counts. Do not set numeric traffic targets until 28 days of clean GSC (IMPRESSION-SYSTEM).
- Working tree `feat/scoring-and-freshness` ≠ production `main`. Branch 301s (tesamorelin calculator; some blogs) can destroy live conversion URLs if shipped blindly.
- Medical numbers (estimands, Foundayo label details, WADA list lines) stay Audit A’s to verify before copy.
- This seat does not authorize implementation.

**Bottom line:** Of the 25, almost all the high-impact items are contraction or hygiene. The worth-doing expansion is Wave 2 on URLs that already exist: tracker + trials table + one honest calculator + schema that tells the truth + a waitlist that is actually asked, tagged, and measured. PepTracker does not need a new page. It needs the job the reader just finished, on the page they are already on.
