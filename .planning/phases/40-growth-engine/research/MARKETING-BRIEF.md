# MARKETING-BRIEF — Phase 40 Growth Engine

*Produced by market-scout (wave 1), 2026-08-17. Research only — recommendations, not implementations.*
*Feeds: Gates D1–D3, and the wave-2 blog-writer brief.*

---

## Reading this document

Every external claim carries a URL and an access date. Where a figure is **not** public,
this brief says "not public" rather than estimating it. Where a source is an affiliate
directory rather than the operator's own page, it is marked **second-hand** — those
directories are frequently stale and must not be treated as terms.

**One finding reorders everything below.** During this session the missing analytics
tooling was recovered to
`.planning/phases/40-growth-engine/research/recovered/`, including real Search Console
data. It says the site's problem is not conversion. It is that Google cannot see the site.

| Property | First data | Last data | Clicks | Impressions | Avg position |
|---|---|---|---|---|---|
| `https://pepcodex.com/` | 2026-01-27 | 2026-07-22 | **81** | 31,704 | 24.1 |
| `https://www.pepcodex.com/` | 2026-05-28 | 2026-07-22 | **40** | 5,884 | 35.4 |

Source: `.planning/phases/40-growth-engine/research/recovered/gsc-manifest.json` (pulled
2026-07-25) and `INDEXATION-DIAGNOSIS.md` (2026-07-24), both read 2026-08-17.

**121 clicks in roughly six months. 923 of 1,221 URLs (75.6%) have never received a single
impression.** Of 45 silent pages inspected through Google's URL Inspection API, 40 were
never crawled at all. `/peptides` — the hub linking all dossiers, with 1,222 inbound
internal links — has never been crawled.

This makes two things true at once, and the brief is built on both:

1. **No affiliate lane can pay at this traffic level.** The best compliant commission
   rates found below, applied to 121 clicks, produce a rounding error. Gate D1 is
   therefore not urgent, and treating it as urgent would trade the site's only real asset
   for approximately nothing. Section 3 shows the arithmetic.
2. **The funnel to the app is worth building now anyway**, because it costs no crawl
   budget, has no disclosure burden, and the one section of the site that Google indexes
   perfectly is the one that looks like a tool, not an article.

---

## 1. FUNNEL MAP

### 1.1 The four content intents, and which surfaces already serve them

The site has 12 content collections. Counted from `src/content/` on 2026-08-17:
105 peptides, 279 comparisons, 215 glossary, 140 blog, 60 cities, 52 clinics, 36 guides,
31 safety, 15 conditions, 3 calculators, 3 protocols.

| Intent | Reader's question | Surface that serves it | Indexation reality |
|---|---|---|---|
| **Research** | "What does the evidence actually say about X?" | `/peptides/[slug]`, `/safety/`, `/compare/` | 83% of `/peptides/` and 86% of `/compare/` silent |
| **News** | "What just happened with X?" | `/blog/`, `/trials`, `/regulatory-tracker` | 74% of `/blog/` silent; `/trials` and `/regulatory-tracker` never crawled |
| **Comparison** | "X or Y?" | `/compare/[...slug]` (279 pages) | 241 of 280 never seen |
| **Commercial-adjacent** | "How do I evaluate a provider / a test / my options?" | `/clinics/`, `/directory`, `/guide/` | 90% of `/clinics/` silent; 311 impressions, 2 clicks total |
| **Tool** | "Compute this for me" | `/calculator/reconstitution/[slug]` (3 pages) | **0% silent. 3 of 3 indexed. Highest impressions-per-page on the site (256).** |

The last row is the most important line in this brief. Three tool pages outperform 279
comparison pages on a per-page basis, and they are the only section with perfect
indexation. Tool-shaped, distinct, small — that is what fits inside a constrained crawl
budget, and it is also what converts to an app, because a tool user has already
demonstrated they want the job done rather than explained.

### 1.2 Where an app CTA is natural, and where it is damaging

PepTracker is pre-launch, so every pattern below must degrade to a waitlist (Section 4).

**Natural** — the reader has just finished a job the app continues:

- **After a reconstitution calculator result.** The user has computed something they will
  need again next week. "Keep this" is not a pitch; it is the obvious next step.
- **After the evidence/timeline section of a dossier**, where the reader has just learned
  what is being measured and over what horizon. The app tracks exactly that.
- **On safety pages, after the adverse-event section** — the honest framing is
  "log what you notice", which serves the reader whether or not they install.
- **In the newsletter**, which is already an owned channel and costs zero crawl budget.

**Damaging** — an app CTA here converts poorly and costs trust or rankings:

- **Above or inside the evidence grading.** The grade is the product. Putting a commercial
  interest adjacent to it invites exactly the "vendor masquerading as education" read that
  the audience explicitly complains about (`.planning/PMF-ANALYSIS.md`, sentiment themes).
- **On `/compare/` pages before the verdict.** Comparison intent is unresolved intent;
  interrupting it raises bounce.
- **On glossary pages.** A reader looking up a definition has ten seconds of intent. Also,
  `INDEXATION-DIAGNOSIS.md` recommends `noindex`ing 100–150 of these; do not invest in a
  surface slated for removal.
- **As an interstitial or exit-intent modal on YMYL pages.** `ExitIntentPopup.astro` already
  exists in `src/components/`. Google's page-experience guidance treats intrusive
  interstitials as a negative; on a site that already cannot get crawled, do not add a
  quality signal working against you.

### 1.3 What comparable sites actually do — verified

**Examine.com — the closest philosophical match, and it refuses all of this.**
Fetched `https://examine.com/about/` 2026-08-17. Verbatim, under "How is Examine funded?":

> "Examine is an entirely independent organization, and does not accept any money from
> outside sources."

and it lists what it does not allow:

> "Donors / Sponsors / Consulting clients / Advertisements / Affiliations"

> "100% of our revenue is generated from additional research syntheses that we sell to both
> health professionals and laypeople: Examine+ and Examine Clinician Edition. All of the
> information on the website is freely accessible."

Secondary reporting puts Examine+ at $29/month or $144/year
([Forbes, 2022-10-30](https://www.forbes.com/sites/elainepofeldt/2022/10/30/once-a-million-dollar-one-person-business-owner-sol-orwell-has-a-new-goal-for-his-nutrition-site-nine-figure-revenue/),
accessed 2026-08-17) — second-hand, and the price may have changed.

The transferable pattern is not the price. It is that the largest evidence-based
supplement site in the world monetizes **the depth of its own research**, sold to its own
audience, and treats "no affiliations" as the product feature that makes the rest
credible. PepCodex's equivalent depth-product is the app.

Also observed on that page: an inline mid-article email capture — "Don't miss out on the
latest research / Become an Examine Insider for FREE / I'm ready to learn". Free tier as
the intermediate step, product sold later. That is exactly the waitlist shape PepTracker
needs pre-launch.

**peptide-db.com — the direct competitor, and it is tool-led.**
Fetched `https://peptide-db.com` and `https://peptide-db.com/peptides/bpc-157` 2026-08-17.
Homepage states "167+ peptides, anabolics, SARMs, and research compounds. Dosing
protocols, molecular data, and scientific references — free forever" and counts
"101 peptides · 66 compounds · 14,000+ interaction pairs · 741 references".

Its navigation leads with **eight tools**, not articles: Reconstitution Calculator,
Compare Compounds, Interaction Checker, Blend Calculator, Accumulation Plotter, Cost
Calculator, AI Assistant, Stack Builder. Its BPC-157 page carries `h2` sections including
"Dosing Protocols", "What to Expect", "Quality Checklist", and "Community Research".

I checked its outbound links programmatically. On the homepage: **zero external links, and
zero occurrences of "affiliate", "sponsor", "advertis", "vendor", "buy", "discount" or
"coupon"**. On the BPC-157 page: the only external links are eight PubMed citations, and
again no monetization keywords. **peptide-db.com is currently unmonetized and carries no
vendor affiliates.**

Two conclusions, and they pull in opposite directions:
- Its differentiation is dosing and stacking — content PepCodex is constitutionally barred
  from publishing. Do not try to out-compete it there.
- Its *structure* is the lesson. Tools rank, get crawled, and are the natural handoff to an
  app. PepCodex's own indexation data independently confirms this on its own three
  calculator pages.

**drugs.com — could not verify.** `https://www.drugs.com/semaglutide.html` returned HTTP 403
to WebFetch and "Access Denied" to a real browser session on 2026-08-17. I have not
inspected its on-page furniture and therefore make **no claims** about its CTA, tool, or ad
model. Flagged as unverified; re-attempt from a residential connection if this comparator
matters.

**More Plates More Dates / Gorilla Mind — not verified this session.** The pattern is
widely described as content → owned supplement brand, but I did not fetch the properties
and will not describe a funnel I did not observe. Noted as a gap, not a finding.

### 1.4 The funnel, stated plainly

```
Google (the constraint: 24% of pages visible)
   │
   ├─ research intent  → dossier ──────┐
   ├─ news intent      → blog post ────┤
   ├─ comparison       → /compare/ ────┼─→ evidence read ─→ [waitlist CTA] ─→ email
   └─ tool intent      → calculator ───┘         │                              │
                                                 │                              ▼
                                                 └────────────────────→ app install at launch
```

Email is the load-bearing middle step, not an afterthought. Pre-launch there is no install
to convert to, and an owned list is the only asset that survives an indexing problem. The
site already has `NewsletterForm.astro` and `/api/subscribe` wired to Beehiiv.

---

## 2. KEYWORD LANES

### 2.1 A required caveat on evidence quality

There is no Ahrefs access (plan-blocked) and I did not obtain reliable volume data. **This
section contains no search-volume numbers, because I could not verify any.** What it
contains is demand *evidence* of three kinds: real GSC impression data from the site's own
recovered pull, verifiable news events in the freshness window, and the site's own existing
coverage gaps. Treat lane sizing as a hypothesis to be measured after Gate D3, not a
forecast.

**A second caveat that outranks the first:** `INDEXATION-DIAGNOSIS.md` states plainly that
"Build more comparison pages" is "actively wrong" because 241 of 280 existing comparison
pages have never been seen, and that adding URLs "dilutes the crawl budget further". Its
top recommendation is to *shrink* the crawlable surface to roughly half.

**Therefore the honest recommendation for Workstream D is: publish few, and publish them
as consolidating hubs or tools rather than as additional thin URLs.** The lanes below are
sized accordingly — ~8–12 titles each is what the PRD asked for and what is listed, but the
sequencing note at the end of each lane says which ones I would actually ship first, and
several are explicitly *replacements* for existing decayed posts rather than net-new URLs.

### 2.2 Lane A — Research intent → dossier → app

Funnel stage: top-of-funnel discovery, handing off to a dossier and then a tracking CTA.
These target the "what does the evidence actually say" intent that the site is built for
and that `PMF-ANALYSIS.md` records as the audience's stated frustration ("I want to know
what the REAL evidence says, not influencer testimonials").

| # | Post title | Intent | Links to dossier | Note |
|---|---|---|---|---|
| A1 | What the BPC-157 Human Evidence Base Actually Contains (and What It Doesn't) | Research | `bpc-157` | Highest-name-recognition peptide with no completed human RCTs for marketed uses |
| A2 | Reading an Evidence Grade: Why "Low" Doesn't Mean "Doesn't Work" | Research / methodology | links to `/methodology` + any dossier | Explains the site's core differentiator |
| A3 | Animal Study, Human Study, or Neither: A Field Guide to Peptide Citations | Research literacy | all dossiers | Trust-builder; strong E-E-A-T signal |
| A4 | Retatrutide's Phase 3 Programme, Trial by Trial | Research | `retatrutide` | See lane B — coordinate, do not duplicate |
| A5 | Every Peptide With a Completed Phase 3 Trial, and Every One Without | Research / hub | many | **Consolidating hub** — absorbs decayed posts |
| A6 | Thymosin Alpha-1: What the Immune Evidence Supports | Research | `thymosin-alpha-1` | On FDA's withdrawn-nomination list — ties to lane C |
| A7 | GHK-Cu: Separating Topical Cosmetic Evidence From Injectable Claims | Research | `ghk-cu` | The evidence split is the whole story |
| A8 | Why Half the Bioregulator Literature Doesn't Name the Compound It Studies | Research / integrity | bioregulator dossiers | Addresses the D4 liability head-on, honestly |
| A9 | Semaglutide vs Tirzepatide: What the Head-to-Head Trial Showed | Research / comparison | `semaglutide`, `tirzepatide` | Refresh existing, do not create new URL |
| A10 | What "Peptide" Means Legally vs Chemically | Research / explainer | `/regulatory-tracker` | From `CONTENT-IDEA-BACKLOG.md` #18 |

Ship first: **A5, A8, A2.** A5 and A8 reduce URL count or defuse a known liability; A2
strengthens the site's differentiator on a page that already exists.

App CTA placement for this lane: after the evidence/timeline block, never above it.

### 2.3 Lane B — Window news (2026-05-17 → 2026-08-17)

Funnel stage: topical authority and freshness signal. Coordinate with freshness-scout's
`UPDATE-WORKLIST.md` — **where an event updates an existing dossier, update the dossier
instead of writing a post.** That adds freshness without adding a URL.

Verified events inside the window:

| Event | Date | Source (accessed 2026-08-17) |
|---|---|---|
| Pharmacy Compounding Advisory Committee met on bulk substances incl. BPC-157 | 2026-07-23/24 | [FDA advisory committee calendar](https://www.fda.gov/advisory-committees/advisory-committee-calendar/july-23-24-2026-meeting-pharmacy-compounding-advisory-committee-07232026) — page referenced in search results; **I could not fetch it directly (404 via WebFetch), so the vote outcome is unverified** |
| FDA Category 2 / withdrawn-nomination bulk substances list, current as of 2026-04-22 | 2026-04-22 | [FDA, Certain Bulk Drug Substances…Significant Safety Risks](https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks) — **fetched and read in full** |
| Retatrutide TRIUMPH-2 and TRIUMPH-3 readouts | 2026-07-23 | Secondary reporting; see caveat below |
| CagriSema REIMAGINE programme presented at ADA | June 2026 | [PR Newswire](https://www.prnewswire.com/news-releases/novo-nordisks-cagrisema-2-4-mg--2-4-mg-demonstrated-significant-reduction-in-hba1c-and-weight-across-multiple-studies-in-the-reimagine-program-presented-at-ada-2026--302793443.html) — sponsor press release |
| Structure Therapeutics oral GLP-1 Phase 2 ACCESS II | 2026-06-29 | Secondary reporting |
| Retatrutide TRANSCEND-T2D-1 | June 2026 | Secondary reporting |

The FDA list is the strongest verified asset here, and it is worth quoting exactly. Under
**Category 2** ("may present significant safety risks") it currently names, among 14
substances: *Growth hormone releasing peptide-2 (GHRP-2), GHRP-6, Ibutamoren mesylate,
Ipamorelin acetate, Kisspeptin-10*. Under **"nominated but withdrawn"** it names 17,
including *AOD-9604, BPC-157, CJC-1295, Dihexa acetate, Epitalon, GHK-Cu (injectable),
KPV, Melanotan II, MOTS-C, Selank acetate, Semax, Thymosin beta-4 fragment (TB-500),
Thymosin-alpha 1*.

Note that a secondary source I checked claimed BPC-157 had been "added to Category 2".
FDA's own page lists it under *withdrawn nominations*, not Category 2. **The secondary
source was wrong.** This is the exact failure mode `.claude/rules/lessons.md` warns about;
lane B posts must cite fda.gov directly, never a compounding pharmacy's blog summary.

| # | Post title | Intent | Links to | Note |
|---|---|---|---|---|
| B1 | Which Peptides FDA Says May Present Significant Safety Risks — the Category 2 list, read carefully | News / regulatory | `/regulatory-tracker` + 13 dossiers | **Highest confidence. Primary source, fully verified, links to many dossiers, and it is a tool-shaped reference page.** |
| B2 | What the July 2026 Compounding Advisory Committee Actually Voted On | News | `bpc-157` | Verify the outcome from FDA minutes before writing |
| B3 | Retatrutide's Phase 3 Readouts: What Each TRIUMPH Trial Measured | News | `retatrutide` | Estimand discipline critical — see below |
| B4 | CagriSema at ADA 2026: Reading REIMAGINE Against REDEFINE | News | `cagrisema` | " |
| B5 | The Oral GLP-1 Field After Orforglipron's Approval | News | `orforglipron` | " |
| B6 | Nominated, Then Withdrawn: What Happened to 17 Peptides on FDA's Compounding List | News / regulatory | many | Companion to B1 |
| B7 | This Quarter in Peptide Trials (rolling) | News / hub | `/trials` | **Consolidating hub** — absorbs decayed news posts |
| B8 | What Changed in Peptide Regulation This Quarter (rolling) | News / hub | `/regulatory-tracker` | " |

**Estimand warning, load-bearing for this lane.** During research I repeatedly encountered
the figures **22.7%** for CagriSema REDEFINE-1 and **12.4%** for orforglipron. The repo's
own `.claude/rules/lessons.md` (2026-07-25) records that these are *sponsor efficacy
estimands*, and that the published treatment-policy figures are **20.4%** and **11.2%**
respectively. Press releases and trade coverage lead with the higher number. Any lane B
post must lead with the peer-reviewed figure and label the other. `qa:claims` is the gate.

### 2.4 Lane C — Compliant commercial-adjacent

Funnel stage: bottom-of-funnel intent that the site can serve **without** giving sourcing
or dosing guidance. This is the lane that would host affiliate links if Gate D1 ever
approves any — which is precisely why it must be written to stand on its own without them.

The compliance line: the site may teach a reader **how to evaluate**; it may not tell them
**where to buy** or **what to take**. "How to read a certificate of analysis" is on the
right side of that line. "Which vendor has the best COAs" is not.

| # | Post title | Intent | Links to | Compliance note |
|---|---|---|---|---|
| C1 | How to Read a Certificate of Analysis | Commercial-adjacent / literacy | `/methodology`, safety pages | Teaches evaluation, names no vendor |
| C2 | HPLC, Mass Spec, and What a Purity Number Does Not Tell You | Literacy | glossary | Pure method education |
| C3 | Questions to Ask a Provider Before Starting Any Peptide | Commercial-adjacent | `/clinics/`, safety | From `CONTENT-IDEA-BACKLOG.md` #19. **Must not become medical advice** — frame as questions, never answers |
| C4 | Compounded vs FDA-Approved: What the Distinction Actually Means | Regulatory literacy | `/regulatory-tracker` | High demand, high confusion |
| C5 | What a Telehealth Weight-Management Programme Includes | Landscape | `/clinics/` | Describe the market's structure; do not rank operators |
| C6 | GLP-1 Insurance Coverage: How Prior Authorization Works | Access | conditions pages | Process explainer, not advice |
| C7 | Red Flags in Peptide Marketing | Literacy | safety | Strong trust content; the site's natural voice |
| C8 | Third-Party Testing: What Independent Verification Can and Cannot Establish | Literacy | `/methodology` | Sets honest expectations |
| C9 | Why "Research Use Only" Is a Legal Status, Not a Safety Rating | Regulatory literacy | `/fda-notice` | Directly serves the confusion FDA's list creates |

Ship first: **C1, C7, C9.** All three are pure literacy content, all three are natural
`/guide/` material rather than blog posts, and C9 in particular converts a widespread
misunderstanding into the site's differentiator.

Note that the site already owns `QualityChecklist.astro` as a component — C1 and C8 may be
better delivered as an interactive checklist tool than as prose. Tools index; prose does
not. That is the lesson of the calculator pages.

---

## 3. AFFILIATE OPTION SPACE

### 3.1 The arithmetic that should be read before the options

The site produced **121 clicks in six months** (recovered GSC manifest, above). Suppose
Workstream D triples organic traffic — an aggressive target given the crawl-budget
diagnosis. That is roughly 60 clicks/month. Suppose 3% of those readers click an affiliate
link (generous for editorial placement) and 3% of clickers convert (generous for a
high-consideration health purchase). That is **0.05 conversions per month**.

At the best compliant commission rate found below, this lane earns **effectively zero
dollars per month** for as long as the indexation problem persists.

I have deliberately not dressed this up. The affiliate question is not currently a revenue
question — it is a *brand-integrity question with no offsetting revenue*. That asymmetry is
the single most important input to Gate D1.

### 3.2 Lane (a) — Lab testing / COA services

| Program | Operator | Commission | Cookie | Source | Verified? |
|---|---|---|---|---|---|
| Marek Health | Marek Health | "competitive", rate **not public** | 30 days (claimed) | [FlexOffers listing](https://www.flexoffers.com/affiliate-programs/marek-health-affiliate-program/) | **Second-hand** (affiliate directory), accessed 2026-08-17 |
| Everlywell | Everly Health | 12% new / 6% returning (claimed) | 45 days (claimed) | [Lasso listing](https://getlasso.co/affiliate/everlywell/) | **Second-hand**, accessed 2026-08-17 |
| InsideTracker | InsideTracker | 3% per sale (claimed) | not public | [LinkClicky listing](https://linkclicky.com/affiliate-program/insidetracker/) | **Second-hand**, accessed 2026-08-17 |

**I did not verify any of these against the operators' own affiliate pages.** Affiliate
directories are the least reliable class of source in this brief and are routinely stale by
years. Every figure above must be re-confirmed with the operator before it informs a
decision. Treat this table as "these programs plausibly exist", nothing more.

**Peptide-specific analytical labs** (Janoshik, Colmaric, MZ Biolabs and similar) — I did
**not** establish whether any operates an affiliate program. Unverified; gap flagged.

Fit assessment: this is the **most philosophically compatible** lane. A site whose value is
"verify things" pointing at "here is how you verify things" is coherent, and it never
touches the banned categories. It is also the lane where the reader's interest and the
site's interest are genuinely aligned. But note that peptide *purity* testing — the service
most relevant to this audience — is exactly the sub-lane where I could confirm no programs
at all, and general blood-panel testing (Everlywell, InsideTracker) is only loosely related
to why someone reads a peptide dossier.

### 3.3 Lane (b) — Regulated GLP-1 telehealth

Market structure, verified as real: Novo Nordisk has made Wegovy available through Hims &
Hers, LifeMD and Ro
([Fierce Healthcare](https://www.fiercehealthcare.com/health-tech/hims-hers-lifemd-stock-skyrockets-after-inking-deal-novo-nordisk-sell-wegovy), accessed 2026-08-17).
So these are, in the relevant sense, legitimate regulated channels for an FDA-approved drug
— not research-chemical sellers.

**However: I could not verify a single public affiliate program with public terms for any
GLP-1 telehealth operator.** Searches surfaced consumer comparison content and pricing
(Noom Med ~$209/mo, Ro ~$199/mo per
[U.S. News](https://health.usnews.com/best-diet/medication/top-glp-1-weight-loss-medication-providers), accessed 2026-08-17)
but no operator-published affiliate terms. I am reporting that as the finding rather than
substituting a directory's guess.

What this means practically: entering this lane would require **direct partnership
outreach**, not self-service signup — which is the same motion as the sponsorship model
already documented in `.planning/PRICING-AND-MEDIA-KIT.md` (Category Sponsor, $1,500/mo,
with a GLP-1 telehealth platform given as the worked example). **The existing sponsorship
deck is probably the better instrument for this lane than affiliate links**, because it is
flat-fee, disclosed in one place, and does not put a per-click commercial incentive on
individual editorial sentences.

Compliance restrictions publishers typically face in this category (branded-search bidding
bans, mandatory disclaimers, prohibited health claims) — **not verified**; these programs'
terms were not obtainable.

### 3.4 Lane (c) — Books / courses / tools

| Program | Commission | Source | Verified? |
|---|---|---|---|
| Amazon Associates, Health & Personal Care | **1%–3%, sources conflict** | Amazon's own rate card returned HTTP 503 on 2026-08-17; secondary sources ([Lasso](https://getlasso.co/amazon-affiliate-commission-rate/), [AzonPress](https://azonpress.com/amazon-affiliate-commission-rates/), accessed 2026-08-17) disagree between 1% and 3% | **Not verified — official card inaccessible** |

Whether it is 1% or 3% barely matters. On a health/personal-care basket, Amazon Associates
at this traffic level is not a revenue lane; it is a disclosure obligation with a tip jar
attached. Bookshop.org, Examine's own referral program (if any), Rupa Health, Fullscript
(practitioner-gated) and Thorne Professional were **not researched this session** — gap
flagged, but the arithmetic in 3.1 suggests the gap is not urgent.

### 3.5 Lane (d) — Research-chemical peptide vendors

**This is the only lane where the money is real, and it is the one the site must not take.**

Publicly advertised rates, from vendors' own affiliate pages as surfaced 2026-08-17:

| Vendor | Publicly advertised commission | Page |
|---|---|---|
| American Peptides | tiered 10% → **up to 35%** by monthly GMV | `https://www.americanpeptides.us/pages/affiliate-program` |
| PSPeptides | 18%, 90-day cookie | `https://pspeptides.com` |
| 99 Purity Peptides | 15% | `https://99puritypeptides.com/affiliates` |
| Improved Peptides | 20% first order, 10% recurring | `https://improvedpeptides.com/affiliate-program/` |
| Spartan Peptides | 10% | `https://spartanpeptides.com/spartan-affiliate/` |

(Surfaced via search on 2026-08-17; I did not individually fetch each page, so treat the
exact figures as advertised-not-verified. The *range* — 10–35% — is consistent across many
independent vendors and is the decision-relevant fact.)

So the temptation is precisely quantified: **the non-compliant lane pays roughly 5–35× the
compliant lanes.** Anyone evaluating this honestly should say that out loud. Here is the
case against it anyway.

**1. It breaks the site's own published promises — in two places, not one.**
`src/pages/editorial-policy.astro` lists under "What We Exclude": *"Sourcing, purchasing, or
vendor information."* `src/pages/advertising-policy.astro` lists under "What We Don't
Accept": *"Advertising for peptide vendors or sources."* These are public commitments on
indexed pages. Taking vendor affiliate money would require editing both — which is not a
quiet change, it is a retraction.

**2. FDA's position makes the product category itself unstable.**
FDA's bulk-substances page (fetched 2026-08-17, content current as of 2026-04-22) places
GHRP-2, GHRP-6, ibutamoren, ipamorelin acetate and kisspeptin-10 in **Category 2**,
defined as substances where "FDA has identified potential significant safety risks", and
records that BPC-157, TB-500, CJC-1295, epitalon, melanotan II, semax, selank, MOTS-C and
others were **nominated and withdrawn** — i.e. they are not permitted bulk substances for
compounding. These compounds are sold to consumers as "research use only" precisely because
they are not approved for human use. An affiliate link is a recommendation to buy; the site
would be earning a commission on human consumption of substances that are not legally
marketed for it.

**3. Counterparty risk is real and recent.** Secondary reporting encountered during this
research states that Amino Asylum was raided by FDA in June 2025 and went offline, and that
Peptide Sciences shut down around March 2026 ([pspeptides.com blog](https://pspeptides.com/blog/amino-club-alternatives/),
accessed 2026-08-17 — **second-hand and from a competitor, treat as unconfirmed**). Even
discounted, the pattern says this is a category where partners disappear, sometimes by
enforcement. Outstanding commissions are the least of it; the archived affiliate links stay
on the site.

**4. It destroys the only asset the site has.** `PMF-ANALYSIS.md` records the audience's own
words: *"Every peptide site is either a vendor masquerading as education, or bro-science"*
and lists **"No vendor affiliates"** as a *major trust advantage* versus competitors, noting
that Peptides.org "monetizes via vendor affiliate reviews — conflicts with 'trusted'
positioning." The moat is being the one that doesn't sell. There is no version of this
where the site takes vendor commissions and keeps that.

**5. Google's spam policy raises the algorithmic cost on a site that is already
crawl-starved.** Google requires that "Good affiliate sites add value by offering
meaningful content or features" and treats thin affiliation as a violation
([Google Search Essentials, spam policies](https://developers.google.com/search/docs/essentials/spam-policies), accessed 2026-08-17).
PepCodex would clear that bar on content quality — but see Section 6 for why adding a
commercial motive to YMYL pages is a different and larger risk than the spam policy alone.

### 3.6 FTC disclosure requirements — how they apply per lane

Two primary sources, both fetched 2026-08-17.

**16 CFR Part 255** ([eCFR](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255)).
§255.5(a), verbatim:

> "When there exists a connection between the endorser and the seller of the advertised
> product that might materially affect the weight or credibility of the endorsement, and
> that connection is not reasonably expected by the audience, such connection must be
> disclosed clearly and conspicuously. … A disclosure of a material connection does not
> require the complete details of the connection, but it must clearly communicate the
> nature of the connection sufficiently for consumers to evaluate its significance."

§255.0(f) defines the standard, verbatim:

> "'clear and conspicuous' means that a disclosure is difficult to miss (i.e., easily
> noticeable) and easily understandable by ordinary consumers. … A visual disclosure, by
> its size, contrast, location, the length of time it appears, and other characteristics,
> should stand out … In any communication using an interactive electronic medium, such as
> social media or the internet, **the disclosure should be unavoidable.** The disclosure
> should not be contradicted or mitigated by, or inconsistent with, anything else in the
> communication."

Practical consequence: a disclosure in the footer, on a separate policy page, or below the
fold does **not** satisfy this. It must sit adjacent to the link, before the click.

**FTC Health Products Compliance Guidance**, December 2022
([FTC](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance),
fetched 2026-08-17). It replaced the 1998 dietary-supplement advertising guide, and states
that health-benefit and safety claims "require substantiation in the form of competent and
reliable scientific evidence." Critically for a publisher, it defines advertising broadly:

> "advertising includes statements or depictions on packaging and labeling; in promotional
> materials …; on the internet and in other digital content; in social media and influencer
> marketing; … and indirectly through healthcare practitioners or other intermediaries."

So a dossier page that carries a commission link becomes, for the linked product's claims,
advertising — and the substantiation standard attaches.

Per lane:

| Lane | Disclosure burden | Claim-substantiation exposure |
|---|---|---|
| (a) Lab testing | Standard §255.5 disclosure adjacent to each link | Low — a test is a service; avoid claiming what results *mean* |
| (b) Telehealth | Standard disclosure; sponsorship model needs "Sponsored"/"Paid" labels per existing `advertising-policy.astro` | Moderate — do not repeat operator efficacy claims |
| (c) Books/tools | Standard disclosure | Low |
| (d) Vendors | Standard disclosure — **and this is where it bites.** A commission link next to an evidence grade is a material connection affecting the credibility of the grade itself | **High** — linking to purchase of an unapproved substance while describing its effects is the exact fact pattern the guidance addresses |

### 3.7 Recommendation

**Recommend: defer all four lanes this phase. Reject lane (d) permanently.**

Reasoning, in priority order:

1. **The revenue is not there yet** (§3.1). At 121 clicks/6mo, no lane pays. Taking on
   disclosure obligations, editorial-policy edits and YMYL trust risk for ~$0 is a bad
   trade at any integrity price.
2. **The constraint is indexation, not monetization** (`INDEXATION-DIAGNOSIS.md`). Effort
   spent on affiliate integration is effort not spent on the thing actually blocking
   growth. Fix crawlability, then revisit with real traffic data.
3. **Lane (d) is permanently off the table** — it contradicts two published policies,
   monetizes substances FDA has flagged or refused for compounding, and liquidates the
   documented moat. Not "not yet". No.
4. **When revenue is revisited, the ranking is: sponsorship (existing deck) > lane (a) >
   lane (b) > lane (c) > never (d).** Flat-fee sponsorship beats per-click affiliate for
   this site because it does not attach a commercial incentive to individual editorial
   sentences, it is disclosed once and prominently, and `PRICING-AND-MEDIA-KIT.md` already
   specifies it.
5. **The strongest monetization path is the Examine model** — sell your own depth to your
   own audience. For PepCodex that product is PepTracker. Section 4 is therefore the part
   of this brief with actual expected value.

> **PARTNER SELECTION IS THE OWNER'S DECISION (Gate D1).** Nothing above authorizes an
> integration. No affiliate link ships until Lucas selects lanes, and the verified-terms
> gaps flagged in §3.2–§3.4 must be closed with the operators directly before any lane is
> chosen on the strength of a commission rate.

---

## 4. APP CROSS-PROMO PATTERNS

PepTracker is pre-launch. **Every pattern below degrades to an email waitlist**, and none
of them should render a store badge until there is a store listing. The site already has
`NewsletterForm.astro`, `/api/subscribe` (Beehiiv), and `ExitIntentPopup.astro`.

Design constraint from the data: mobile delivers **67% of clicks and ranks 12 positions
better** than desktop (`INDEXATION-DIAGNOSIS.md`, device table). Every pattern is
mobile-first or it is pointless.

**P1 — Inline handoff after the evidence block.**
A single bordered card immediately following a dossier's evidence/timeline section:
"Tracking this? PepTracker logs what you notice against what the trials measured. Join the
waitlist." Real-world analogue: Examine's inline mid-article capture — "Become an Examine
Insider for FREE / I'm ready to learn" — observed on `https://examine.com/about/`
(2026-08-17), which uses a free tier as the intermediate step before a paid product.
Degrades to: email field only.

**P2 — Calculator-to-app handoff.** The highest-confidence pattern in this brief, because
it is the only surface with verified performance. `/calculator/reconstitution/[slug]` is
**0% silent, 3/3 indexed, 256 impressions per page** — the best-performing section of the
site. After a user computes a result: "Save this calculation." A computed result is a
created artifact; offering to keep it is a service, not a pitch.
Degrades to: "email me this result" — which is also the highest-intent email capture the
site could possibly have.

**P3 — Dossier sidebar persistent card.** A quiet, non-animated card in the existing
`SectionAside.astro` slot, below the table of contents. Always present, never interrupting.
Analogue: drugs.com is the canonical example of persistent sidebar tool promotion, **but I
could not verify its page furniture (403/Access Denied, 2026-08-17)** and so cite it only
as an unverified analogue.
Degrades to: waitlist link, no badge.

**P4 — End-of-post "what to do with this" block.** At the natural end of a blog post,
where intent is resolved and a CTA is not an interruption. This is the safest placement on
YMYL pages because it sits after the substance, not beside it.
Degrades to: newsletter subscribe with a PepTracker-specific tag so the launch announcement
can be segmented.

**P5 — Waitlist landing page with a real promise.** A dedicated `/peptracker` page that
states plainly what the app does, what it will not do (no dosing recommendations — the same
line the site already holds), and when. This is also a crawlable, tool-shaped, distinct
page — the exact profile that the indexation data says Google *does* crawl.
Degrades naturally: it *is* the degraded state; it upgrades to a download page at launch.

**P6 — Interactive COA checklist as a lead tool.** Build lane C1/C8 as an interactive
checklist (the site already has `QualityChecklist.astro`) rather than prose. Tools index;
prose on this site does not. Completing the checklist is the CTA moment.
Degrades to: static checklist + email capture for a PDF version.

**P7 — Newsletter as the primary launch channel.** The owned list is the only asset immune
to the crawl-budget problem. Every pattern above should tag its signups by source so the
launch email can be segmented by demonstrated interest.
Degrades: not applicable — this is the fallback layer itself.

**Anti-pattern, stated explicitly:** do not add an exit-intent modal on dossier or safety
pages. `ExitIntentPopup.astro` exists and the temptation will be to reuse it. On YMYL pages
on a domain already struggling for crawl priority, an intrusive interstitial adds a
negative quality signal against a conversion gain that 121 clicks cannot make material.

---

## 5. MEASUREMENT PLAN

### 5.1 Current state — substantially better than the PRD assumed

The PRD states `scripts/fetch-search-data.mjs` is missing. **That is no longer true.**
Verified 2026-08-17: the script is present at `scripts/fetch-search-data.mjs`, a copy sits
in `.planning/phases/40-growth-engine/research/recovered/` alongside `GOOGLE-API-SETUP.md`,
`gsc-manifest.json`, `INDEXATION-DIAGNOSIS.md` and `CRAWL-GOAL.md`, **and `package.json`
already exposes the full task set**:

```
gsc:sites    → fetch-search-data.mjs --list-sites
fetch:search → fetch-search-data.mjs
fetch:gsc    → fetch-search-data.mjs --gsc
fetch:ga4    → fetch-search-data.mjs --ga4
gsc:whoami   → fetch-search-data.mjs --whoami
gsc:index    → gsc-index-diagnose.mjs
gsc:repull   → gsc-repull.mjs
```

**Gate D3 is therefore much smaller than the PRD frames it.** The code is not missing and
does not need restoring. The open question is narrower: *do the service-account credentials
still authenticate?* `npm run gsc:whoami` answers that in one command. If it passes, D3 is
closed and Workstream C/D are measurable immediately. Recommend running it before wave 2.

What is already wired, verified by reading the source:

- **GA4** — `src/layouts/BaseLayout.astro` loads gtag, gated on `PUBLIC_GA_TRACKING_ID`
  (note the `PUBLIC_` prefix; the tag renders only when that env var is set).
- **Vercel Analytics** — injected in `BaseLayout.astro`; `@vercel/analytics ^1.6.1` in
  `package.json`.
- **Custom GA4 events** — `src/scripts/analytics.ts` already emits: `search`,
  `comparison_click`, `newsletter_signup` (with `location`), `external_link_click` (with
  `link_url`, `link_domain`, `page_path`), and `scroll_depth` (25/50/75/90).

That last one matters: **`external_link_click` already captures the telemetry any affiliate
lane would need**, and `newsletter_signup` already records placement. The instrumentation
for measuring CTA performance largely exists.

### 5.2 What must be added

| Need | Mechanism | Status |
|---|---|---|
| GSC query/page pull on a schedule | `npm run fetch:search` / `fetch:gsc` | **Built and wired — verify credentials via `npm run gsc:whoami` (Gate D3)** |
| Indexation census over time (the real KPI) | `npm run gsc:index` (`gsc-index-diagnose.mjs`) — already exists; track "% of sitemap with ≥1 impression" weekly | Script exists; cadence not scheduled |
| App CTA click tracking | New GA4 event `app_cta_click` with `{placement, page_path, surface_type}` | Not built |
| Waitlist conversion | Extend `newsletter_signup` with a `list` param distinguishing newsletter from PepTracker waitlist | Small edit to `analytics.ts` |
| Calculator→CTA funnel | `calculator_complete` → `app_cta_click` sequence | Not built |
| Affiliate telemetry | Reuse existing `external_link_click`; add a `rel="sponsored"` attribute convention | Exists, unused |
| App-store attribution | Apple App Store Connect campaign links / `pt`+`ct` params at launch | Blocked until launch |

### 5.3 The KPI that should replace the others

Given the diagnosis, the primary success metric for this phase is **not** clicks, installs
or revenue. It is:

> **percentage of sitemap URLs that have received ≥1 impression** — currently **24.4%**
> (298 of 1,221, as of 2026-07-22).

Every other metric is downstream of that number, and none of them can move much while it
stays at 24%. Report it weekly. If Workstream D adds URLs without moving this number up,
the phase is making the problem worse, and that is measurable rather than arguable.

Secondary: mobile clicks specifically (81 of 121 — the real audience), waitlist signups by
placement, and calculator page impressions as the leading indicator of whether tool-shaped
pages keep out-crawling article-shaped ones.

---

## 6. RISKS

### 6.1 YMYL and E-E-A-T — what Google actually says

From Google's own documentation, fetched 2026-08-17
([Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)):

- Google's systems reward content demonstrating "experience, expertise, authoritativeness,
  and trustworthiness", and state that **"trust is most important. The others contribute to
  trust."**
- For "Your Money or Your Life" topics — explicitly including **health** — Google gives
  "even more weight to content that aligns with strong E-E-A-T."
- The "Who, How, Why" framework asks whether it is "self-evident to your visitors who
  authored your content", and — decisively for this brief — whether content was "created
  primarily to help people" versus "primarily to attract search engine visits."

That last question is the one monetization puts at risk. Not because affiliate links are
banned — Google's [spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
(accessed 2026-08-17) permit them and require only that "Good affiliate sites add value by
offering meaningful content or features" — but because the *"why"* of a page is exactly what
changes when a commission attaches to it, and YMYL health is where Google applies the most
scrutiny.

### 6.2 Per-lane effect on algorithmic trust

| Lane | Effect on trust | Reasoning |
|---|---|---|
| **(a) Lab testing** | **Neutral to slightly positive** | "Here is how to verify things" reinforces the site's stated purpose. The commercial interest points *toward* rigour rather than away from it |
| **(b) Telehealth** | **Neutral if flat-fee and disclosed; negative if per-conversion** | A commission per patient acquired on a page describing a drug's efficacy is a material conflict on a YMYL page. Flat sponsorship, disclosed once, does not create the per-sentence incentive |
| **(c) Books/tools** | **Neutral** | Low stakes, low money, low signal either way |
| **(d) Research-chem vendors** | **Strongly negative** | Directs purchase of substances FDA has placed in Category 2 or refused for compounding, on pages whose entire ranking case is trustworthiness. Also contradicts two published policy pages, which is itself an inconsistency a quality rater would find |

### 6.3 Other risks this phase carries

**The dominant risk is not monetization at all — it is publishing more pages.**
`INDEXATION-DIAGNOSIS.md` is unambiguous that at DR 3.3 with 1,221 URLs and 75.6% never
crawled, adding URLs dilutes a crawl budget that is already the binding constraint, and it
names "build more comparison pages" as **"actively wrong"**. Workstream D as written adds
posts. The mitigation in Section 2 is to bias hard toward consolidating hubs, tools, and
refreshes of existing URLs over net-new thin posts — and to watch the §5.3 KPI to catch it
if this is going the wrong way.

**Estimand drift in news content** (§2.3) — sponsor press releases lead with the efficacy
estimand; the site must lead with the treatment-policy figure. Three separate figures across
the site were already wrong this way once (`.claude/rules/lessons.md`, 2026-07-25).

**Secondary-source contamination in the regulatory lane** — demonstrated live in this
research when a compounding-pharmacy blog misstated BPC-157's FDA status (§2.3). Lane B and
lane C posts cite fda.gov, ecfr.gov and ftc.gov directly or not at all.

**The five unsourceable bioregulator dossiers (Gate D4)** become a larger liability the
moment traffic and monetization increase, because "no vendor affiliates" is the defence that
currently makes the site's weakest content forgivable. Post A8 is one honest way to
address them; retirement is another. It is a Gate D4 decision, not a market-scout one.

---

## Verification notes and gaps

Stated plainly, per the house rule that a claim without a check is not a finding:

**Fetched and read in full:** examine.com/about, peptide-db.com homepage and BPC-157 page
(including programmatic link/keyword extraction), FDA bulk-substances Category 2 page,
eCFR 16 CFR 255 (§255.0(f) and §255.5(a) quoted verbatim), FTC Health Products Compliance
Guidance, Google helpful-content and spam-policy docs. All 2026-08-17.

**Blocked, and therefore claimed nothing about:** drugs.com (403 to WebFetch, "Access
Denied" to browser); Amazon Associates official rate card (503); FDA advisory-committee
calendar page for the July 2026 PCAC meeting (404 via WebFetch — the meeting's *outcome* is
unverified and B2 must confirm it from FDA minutes before publication).

**Second-hand only, flagged in place:** all lab-testing affiliate terms (§3.2), all
research-chem vendor commission rates (§3.5), Examine+ pricing, the Amino Asylum/Peptide
Sciences shutdown reports, and all retatrutide/CagriSema/Structure trial figures in §2.3.

**Not researched — genuine gaps:** More Plates More Dates funnel structure; Bookshop.org,
Rupa Health, Fullscript, Thorne Professional programs; peptide-specific analytical lab
affiliate programs; GLP-1 telehealth publisher compliance terms; Reddit/PAA question mining
at the depth originally scoped (a prior research pass was lost to a session restart and
was not repeated — the lanes in Section 2 are built on GSC data, verified news events and
the existing `CONTENT-IDEA-BACKLOG.md` instead of forum mining).

I have not substituted plausible numbers for any of the above.
