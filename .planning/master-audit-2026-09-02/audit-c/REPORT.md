# Audit C — Clinic directory, consumer trust, affiliates, acquisition

**Auditor:** C (directory marketplace / affiliate / consumer-trust / clinic-acquisition)  
**Date:** 2026-09-02  
**Mode:** AUDIT ONLY — no site edits, no outreach, no enrollments, no forms  
**Live site inspected:** https://www.pepcodex.com  
**Repo freeze:** `feat/scoring-and-freshness` @ `f1b91e0`  
**Jurisdiction treated as primary:** United States  

This is a specialist packet for the lead auditor. It is not the consolidated report.

---

## 1. Scope, method, independence, and limits

**Lens.** Every clinic record, city page, `/clinics`, `/directory`, listing UI, trust/legal pages, and revenue-model adjacency (affiliate, featured, lead-gen, ads). The question is whether PepCodex has a *useful, honest directory product* — not whether the pages compile.

**Method.**

- Read 100% of 52 clinic MDX files (frontmatter + empty bodies).
- Read 100% of 60 city MDX files (frontmatter including `content` + `metaDescription`) and the shared city template FAQs/schema in `src/pages/clinics/[city].astro`.
- Read clinic/city Zod schemas, `ClinicCard`, `FeaturedClinicCard`, `/clinics` index, `/directory`, advertising/editorial/privacy/terms/about/contact/disclaimer/fda-notice, plus homepage, methodology, newsletter, cookie policy (partial), BaseLayout robots/footer, FAQSchema, OrganizationSchema, ExitIntentPopup, llms.txt / llms-full.txt, contact FormSubmit, subscribe API.
- Live-probed 2026-09-02: `/clinics`, `/clinics/new-york`, `/directory`, `/advertising-policy`, `/contact`. Confirmed `noindex, follow` on clinic URLs; `/directory` has no robots meta (indexable). `https://example.com/manhattan-peptide` returned **404**.
- Independently web-searched a stratified 11-clinic sample (featured, unverified, prestige address, nickname, orphan). Did not contact clinics, guess emails, create accounts, or submit forms.
- Checked current official FTC Endorsement Guides (16 CFR 255), FTC Fake Reviews Rule (Aug 2024), FDA compounding Category 2 / 503A bulks materials (May–July 2026 PCAC), FDA compounded GLP-1 notice, and Google Search spam policies (doorway, scaled content, site reputation, expired domain). State telehealth/advertising: high-level flag only — **LEGAL REVIEW**, not a 50-state memo.

**Independence.** Prior marketing briefs treated as untrusted. Frozen inventory used as the ID list, not as proof that `verifiedListing: true` means verified.

**Limits (must remain visible).**

- GSC/GA4 live pull **UNAVAILABLE**. No invented traffic, conversion, or revenue. Calculator framework only (section 14).
- Working tree ≠ production. Live `/clinics` and `/directory` matched this branch’s clinic/directory behavior on 2026-09-02; other site surfaces may differ.
- `src/pages/sponsors` directory listing empty/restricted.
- No private CMS, affiliate dashboards, or email.
- Remaining non-directory inventory is **SAMPLED** (metadata + grep for clinic/directory/verified leak), not an end-to-end claim audit of 1,221 editorial URLs.
- Individual web search was opened for 11/52 clinics; the other 41 share the same generator fingerprints (example.com + 555 + empty body + nickname formula). Status for all 52 is `FICTIONAL_PLACEHOLDER`.
- PCAC July 2026 *proposals* are FDA briefing positions, not independently confirmed final list decisions.

---

## 2. Coverage map

Canonical machine coverage: `COVERAGE.json` (1,343 `surface_id`s).

| Status | Count | Meaning |
|---|---|---|
| INSPECTED | 137 | Full file; live URL where the surface has one |
| SAMPLED | 1206 | Inventory title/url/robots + grep for directory/clinic/verified leak |
| INACCESSIBLE | 0 surfaces; 4 access limits | GSC, GA4, private CMS/affiliate dashboards, sponsors dir |

**INSPECTED (Audit C complete):** all 52 `clinic-record`; all 60 `city-clinic-page`; `DIRECTORY-1237` `/directory`; `DIRECTORY-1252` `/clinics`; home; trust/legal pages listed in freeze (about, advertising-policy, contact, cookie-policy, disclaimer, editorial-policy, fda-notice, methodology, privacy, terms); newsletter; llms.txt / llms-full.txt; api/health and api/subscribe; templates BaseLayout, ClinicCard, FeaturedClinicCard, FAQSchema, OrganizationSchema, ExitIntentPopup, `[city].astro`.

**SAMPLED remaining types:** peptide, peptide-condition, comparison, guide, safety, glossary, blog, protocol, condition, calculator, hub, index, category, error, tool, api/peptide-search, other templates, source-packs. Directory CTA leak into dossiers: **not found**. Leak into footer + llms files + contact + city metas: **found**.

Remaining `surface_id`s are every row in `COVERAGE.json` with `"status": "SAMPLED"`.

---

## 3. Product assessment: is this directory useful?

**No.** It is not a directory product. It is a local-SEO shell with demo data that was never replaced.

What a useful clinic directory must do for a reader: name a real, operating, licensed practice; show a public contact path that works; distinguish in-person vs telehealth and the license jurisdiction; say what was verified, by whom, and when; not invent menus, prices, or credentials; label paid placement; offer a way to correct or complain.

What PepCodex ships instead:

| Reader job | Actual state (2026-09-02) |
|---|---|
| Find a clinic near me | 52 invented names; 12 city pages with zero listings still claim “verified providers”; 4 listings never render because their city MDX is missing |
| Call / visit website | 555 numbers; `example.com` 404s |
| Trust “Verified” | 50/52 `verifiedListing: true` with no methodology, source, or date |
| Compare featured vs organic | “Featured Partners” ribbon; advertising policy does not define the SKU or label it Sponsored |
| Use `/directory` | Indexable “Coming Soon” that still promises verified clinics and telehealth |
| Use `/clinics` | Live fake listings, `noindex, follow`, sitemap-excluded |
| Correct a listing | Generic contact form only |

Business value today is negative: legal/reputation risk, policy contradiction (About/Terms ban sourcing and healthcare services), crawl-budget waste if reindexed, and a false start for clinic acquisition.

PepTracker remains the intended conversion. Homepage CTAs go to the catalogue and methodology, not clinics. That split is correct and should stay.

---

## 4. Clinic-record integrity (100% of 52)

Every record is frontmatter-only (body length 0). Shared shape:

- Trade name = city nickname or prestige geography + Wellness/Peptide/Longevity/Regenerative/Institute
- Street address in a real-looking building or corridor
- `website: https://example.com/...`
- Phone: either `(555) NXX-XXXX` (555 is not a valid area code) or `(NPA) 555-0xxx` (NANPA fictional exchange)
- `services` always includes “Peptide Therapy”
- `peptides` drawn from a shared pool (BPC-157 30×, NAD+ 24×, CJC-1295 23×, Semaglutide 21×, …)
- `verifiedListing: true` on 50; `false` only on Pacific Integrative Wellness (SF) and Northwest Peptide & Wellness (Seattle) — both still placeholders
- `featured: true` on three: Prime Wellness Scottsdale, Regenerative Health Institute (LA), Vitality Wellness Center (Miami)
- No ownership, license, NPI, clinician, hours, insurance, prices, last-checked, operating status, or telehealth flag
- `state` mixes abbreviations and full names (`TX` vs `Texas`, `New York` vs `NY`) — live NY page title-cases as “New York, New York”

**Orphans (no city page, never rendered by `[city].astro`):** Commonwealth Wellness Center (Richmond VA), Gold Coast Wellness (Fort Lauderdale), Treasure Valley Peptide Institute (Boise), Wasatch Wellness (Salt Lake City).

**Empty city pages (FAQ still says “multiple” clinics):** Anaheim, Arlington, El Paso, Fort Worth, Fresno, Irvine, Long Beach, Mesa, Oakland, Riverside, Tulsa, Virginia Beach.

Duplicates: two “Queen City” brands (Charlotte vs Cincinnati) — nickname collision, not two locations of one company. No true duplicate files.

Full field dump: `CLINIC-VERIFICATION.json`.

---

## 5. Independent verification

**Sample (11), opened 2026-09-02, public web only:**

| Listed name | Listed address | Result |
|---|---|---|
| Alamo Wellness & Peptide Center | 18503 Blanco Rd, San Antonio | No match. Different: Alamo Peptides (research vendor), Alamo Slim Clinic (IH-10) |
| Manhattan Peptide Clinic | 445 Park Ave 9th Fl | No match. Real Park Ave peptide practice: Dr. GolBerg, **910** Park Ave |
| Prime Wellness Scottsdale | 7500 E Doubletree Ranch Rd | No match. “Prime Wellness” elsewhere is a DMV Dermestetics brand; Prime IV is a different chain |
| Vitality Wellness Center | 1234 Brickell Ave, Miami | No match. Vitality Wellness peptide programs are Idaho/telehealth. Real Brickell clinic: Strong Health, 1000 Brickell Plaza |
| Regenerative Health Institute | 9000 Wilshire, Beverly Hills | No match. Nearby different: Regenerative Medicine LA (Sunset), Regenuva (9025 Wilshire) |
| Beacon Wellness & Regenerative Health | 125 Summer St, Boston | No match. Copy claims “Harvard-affiliated expertise.” Not on HealingMaps 2026 Boston list |
| Pacific Integrative Wellness | 450 Sutter, SF | No match. Nearby different: Pacific Integrative **Psychiatry**, 447 Sutter |
| Treasure Valley Peptide Institute | 877 W Main, Boise | No match. Nearby different: Treasure Valley Aesthetics, Treasure Valley Pain & Hormones, Boise Biologics |
| Northwest Peptide & Wellness | 1200 Madison, Seattle | No match. Nearby different: Northwest Peptides research vendor; HealingMaps Seattle list is other clinics |
| Queen City Peptide Institute | 4525 Park Rd, Charlotte | No match. Not on MyPeptideMatch Charlotte list |
| Elite Wellness & Longevity Center | 875 N Michigan, Chicago | No match. Nearby different: Live Well Clinics, 980 N Michigan |

**Pattern evidence for the other 41:** identical `example.com` + 555 + empty body + nickname formula. IANA example.com is reserved for documentation. NANPA 555-01xx is reserved for fiction.

**Status for 52/52:** `FICTIONAL_PLACEHOLDER`.  
**INDEPENDENTLY_CONFIRMED:** 0.  
**Do not guess emails. Do not contact these names.**

Addresses often point at real prestige corridors (Hancock Center, Park Avenue, Brickell, Wilshire). That makes the fiction *more* deceptive, not less: a reader can believe the suite exists.

---

## 6. City pages and multiplied template claims

60 city files. Unique `content` strings: 60. Unique metas: 60. Lengths ~227–317 characters. Formula: “[City]’s wellness/healthcare landscape includes peptide therapy clinics serving [region]. From [neighborhood] to [neighborhood], providers offer comprehensive peptide services for [goals].”

**Every metaDescription includes “verified providers.”** That is 60 false statements even on empty cities.

Shared template (`[city].astro`) multiplies five FAQs, including:

- `{n}` or **“multiple”** peptide clinics (empty cities → “multiple”)
- “Use our directory to find **verified providers**”
- “**Verified listings** … have been **vetted for these criteria**” (licenses, FDA-registered compounders, labs, transparent pricing)
- Typical menus: BPC-157, semaglutide/tirzepatide, CJC-1295 + ipamorelin
- Consults “typically range from **$100–$300**” — unsourced, nationwide, copied into every city
- FAQPage JSON-LD (live NY page: `FAQPage=true`)

Unsourced local-regulatory color, e.g. Phoenix: “Arizona's favorable regulatory environment has attracted numerous integrative medicine practices.” **LEGAL REVIEW** — Audit C did not verify Arizona compounding/telehealth law and this sentence should not exist without a citation.

Population badge uses `(population / 1e6).toFixed(1)M+` (NY live: “Pop. 8.3M+”).

City pages are `robots="noindex"` → BaseLayout emits `noindex, follow`. Sitemap filter drops `/clinics`. Historical note in template: 61 URLs, 311 impressions, 2 clicks in 5.8 months. Deindex was a crawl-budget decision, not a truthfulness fix. Pages remain live for direct visitors.

---

## 7. Consumer-trust, “Verified,” and misleading claims

**Verified is a lie in the current data.** It is a boolean in frontmatter, default false, set true on 50 placeholders, rendered as a green check badge. Index copy: “We verify listings to ensure you're connecting with legitimate healthcare providers.” That sentence is false.

**Featured is unlabeled commercial ranking.** Ribbon says “Featured,” not “Sponsored.” CTAs sell “priority placement.” Advertising policy does not define the product.

**Credential fiction:** board-certified physicians (Vitality Miami); Harvard-affiliated expertise (Beacon Boston); stem-cell therapy (Regenerative LA); diabetes prevention (Texas Metabolic); performance enhancement (Prime Scottsdale). No named person to license-check.

**Menu fiction:** NAD+ listed as a peptide; Dihexa, LL-37, MK-677, Kisspeptin, DSIP, Epithalon on “offered” lists with no formulary source.

**Product contradiction:** `/directory` (indexable) says the trusted directory is coming soon; `/clinics` already lists 52 “verified” clinics. llms.txt calls `/directory` a clinic directory; llms-full.txt calls it a “US peptide clinic finder.”

Homepage and peptide dossiers do **not** push clinic CTAs. Editorial “verified” in blogs means citation `verifiedAt`, not clinic badges. Keep that split.

---

## 8. Legal and regulatory

Not legal advice. Flags for counsel.

### FTC (US)

- **16 CFR 255 Endorsement Guides** (eCFR current through Aug 2026; 2023 revision): endorsements must reflect honest opinions; unexpected material connections disclosed clearly and conspicuously; “independent” review/ranking sites with pay-to-play or undisclosed ties are called out. A Verified badge is an endorsement of quality.
- **Fake Reviews and Testimonials Rule** (FTC, 14 Aug 2024): prohibits reviews/testimonials by someone who does not exist; prohibits misrepresenting that a website the business controls provides independent reviews of a category including its own products/services. Whether a *clinic listing* is a “testimonial” is a counsel question; inventing businesses with quality badges is still Section 5 deception.
- Featured-for-pay without “Sponsored” is a material-connection problem **if money changes hands**. Today Featured is demo data plus a sales CTA — still a disclosure failure if anyone reasonably reads it as earned ranking.

### FDA compounding and drug advertising

- PepCodex FDA Notice already says content is not FDA-evaluated and the site does not say where to obtain substances.
- Directory copy does the opposite at clinic level: named (fake) providers “offer” BPC-157, TB-500, MK-677, Semax, Epithalon, MOTS-c, KPV, LL-37, Kisspeptin, DSIP, compounded GLP-1s, and “research peptides.”
- FDA “Certain Bulk Drug Substances … Significant Safety Risks” includes **BPC-157** and **LL-37** among Category 2 concerns ([FDA page](https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks)).
- 503A Category 2 list (FDA PDF updated **14 May 2026**) includes **Ibutamoren Mesylate** and **Kisspeptin-10**.
- PCAC **23–24 July 2026** agenda: BPC-157, KPV, TB-500, MOTS-c, emideltide/DSIP, Semax, Epitalon — FDA briefing packages proposed **not** including several of these on the 503A bulks list. Treat as FDA *proposal* unless counsel confirms the vote/final.
- FDA compounded GLP-1 notice: compounded drugs are not FDA-approved; **retatrutide and cagrilintide cannot be used in compounding**; quality/AE concerns on compounded semaglutide ([FDA](https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss)).
- Index advice to look for “FDA-registered compounding pharmacies” plus a BPC-157 menu is a compounding-access narrative. **LEGAL REVIEW.**

### Google spam policies

Source: [Spam Policies for Google Web Search](https://developers.google.com/search/docs/essentials/spam-policies) (documentation dated 2026-08-28 in search results).

| Policy | Fit |
|---|---|
| Doorway abuse | 60 `[city] peptide clinics` pages, same FAQ, formulaic unique sentences — classic doorway *if indexed to rank*. Currently noindex + sitemap-excluded. |
| Scaled content abuse | Same set: many pages, little user value, generated local SEO. noindex mitigates ranking, not the content factory. |
| Site reputation abuse | Clinic block is first-party, not third-party parasite SEO. Future paid clinic microsites on pepcodex.com would need review. |
| Expired domain abuse | Not evidenced for pepcodex.com. |
| Thin affiliation | Research-chem affiliate modules would fit; currently parked/banned by advertising policy. |

Reindexing this inventory would recreate the crawl-budget failure the project already measured.

### State telehealth / clinic advertising (high level)

US default: telehealth requires licensure in the **patient’s** state; advertising of medical services, board certification, and testimonials is board-regulated (CA, TX, FL among others). Some states regulate health-care referral services and fee-splitting. **Do not assume** paid clinic leads, referral fees, or national telehealth listings are lawful. `/directory` already promises “Remote consultations with licensed physicians specializing in peptide protocols” with no state map. **LEGAL REVIEW** before any telehealth SKU. This is not a 50-state survey.

### Payment must never purchase

Verification badge, credential, safety/evidence grade, favorable review, medical endorsement, suppression of negatives, complaint alteration, undisclosed organic rank, or unsupported claims. Current `featured` boolean already buys rank in the template. `verifiedListing` is a separate boolean that must stay unpaid — and today it is applied to fiction.

---

## 9. Privacy and health-related lead data

Current collection points relevant to a directory:

- **Contact form** → FormSubmit.co → `info@pepcodex.com`. Subjects include Directory Listing Request, Partnership, Content Correction. `_captcha` is `false`. Free text can contain health information. Privacy policy does not name FormSubmit.
- **Newsletter / waitlist** → `/api/subscribe` → Beehiiv (credentials server-side). Privacy policy discusses newsletters; Beehiiv is not named in the pages read.
- **GA4, cookies** — cookie policy + privacy.
- **PepTracker** — local-first; not a clinic-lead store.

PepCodex is not, on these facts, a HIPAA covered entity. If it becomes a referral service that collects patient health information to send to clinics, HIPAA/state medical-privacy analysis changes. **LEGAL REVIEW** before lead-gen.

Risks if directory lead-gen launches on this stack: PHI in FormSubmit, no DPA on file in repo, no “do not submit medical information” banner, no clinic-lead retention schedule, bot spam (`_captcha=false`).

Draft privacy questions: `PAID-LISTING-MODEL.md`.

---

## 10. Correction, appeal, claim, reporting, audit trail

**What exists:** editorial corrections policy (content, not listings); contact subject “Content Correction”; advertising policy “report a concern about a sponsorship” with no mailbox other than contact.

**What does not exist:** clinic claim flow; public complaint URL; identity proof for a practice; last-checked timestamps; verification-source field; changelog; takedown SLA; appeal of a rejected listing; process to handle “this invented name collides with our real DBA.”

Without that machinery, even a future real directory cannot be operated ethically. Draft: `PAID-LISTING-MODEL.md`.

---

## 11. Revenue-model review

No live affiliate or clinic-billing dashboard in repo. Advertising policy: currently accepting founding partners; **Current Sponsors = none**. Do not invent commission rates. Programs not opened → terms **UNVERIFIABLE**.

| Model | Reader value | Business value | Ops burden | Medical / reputational / privacy / jurisdictional risk | COI | Disclosure today | Expert review | Verdict |
|---|---|---|---|---|---|---|---|---|
| Research-chem / peptide-vendor affiliate | Negative (sourcing) | Would conflict with parked-affiliate constraint and advertising policy | High (compliance) | **Severe** — FDA compounding, unapproved drugs | Direct | Policy bans vendor ads | Would contaminate evidence grades if allowed | **REJECT** |
| FDA-approved drug info (no buy link) | High if cited | Indirect (trust) | Editorial | Low if no coupon/affiliate | Low | Already editorial | Existing methodology | Not an affiliate product |
| Labeled newsletter sponsorship (non-vendor) | Medium if labeled | Possible | Medium | Medium if health claims | Firewall required | Policy says “Sponsored”; no current sponsors | Keep evidence grades unpaid | **CAUTIOUS TEST** only after counsel; no clinic/vendor |
| Paid enhanced clinic profiles | Only if listings are real | Possible ARPU | High verification | High — healthcare advertising, kickback/fee-split | Rank vs pay | Missing | Required | **DEFER**; illegal to sell on fictional inventory |
| Labeled sponsored clinic placement | Same | Possible | High | High | Rank vs pay | Featured ≠ Sponsored | Required | **DEFER** |
| Clinic subscription tools (scheduling, profile CMS) | Possible later | SaaS | High | PHI, state licensing | Lower if no rank sale | N/A | Required | **DEFER** |
| Booking / lead-gen fees | Reader may want booking | Classic marketplace take-rate | High (license, PHI, SLA) | **Severe** — referral-fee / corporate-practice / telehealth | Payola risk | None | Required | **DEFER / LEGAL REVIEW**; do not assume lawful |
| Sponsored education (CME-like, non-vendor) | Medium | Medium | Medium | Claims substantiation | Firewall | Policy allows educational partnerships | Required | **CAUTIOUS TEST** |
| Display / newsletter ads (non-health-drug) | Low–medium | Low | Low | Brand adjacency | Firewall | Policy incomplete on display | — | **CAUTIOUS TEST** only off-directory |

**GSC/GA4 UNAVAILABLE** — no revenue forecast. Calculator in section 14.

Site constraint: affiliate/selling peptides **parked** until PepTracker converts; crawl budget binding; clinics deindexed. Audit C agrees those constraints are the correct business order. A directory relaunch is not a growth answer to crawl poverty.

Details: `AFFILIATE-MATRIX.md`, `PAID-LISTING-MODEL.md`.

---

## 12. Editorial independence, COI, and disclosure

Live editorial-policy and advertising-policy (January 2026) already say: sponsors have zero influence on coverage, grades, or takedowns; no peptide-vendor ads; no pay-for-play reviews; no dosing ads.

**Gaps:** they do not mention clinic listings, Featured, Verified, lead-gen, or affiliates. They claim “we list all current sponsors on this page” with none listed. Clinic CTAs already sell Featured.

**Draft policy** (full text in `PAID-LISTING-MODEL.md`, section “Editorial-independence and disclosure policy draft”):

- Payment never buys Verified, grades, suppression, or organic rank.
- Sponsored clinic units labeled **Sponsored** (not Featured/Partner/Verified).
- Organic order is a published, non-pay algorithm.
- Evidence grades and dossier copy are firewalled from clinic sales.
- COI: no equity in listed clinics or peptide vendors; staff cannot accept clinic compensation for coverage.
- Public sponsor list, updated when money is accepted.

Do not ship the draft without counsel.

---

## 13. Recommendations (quarantine first)

Ordered. Audit only — not an implementation ticket.

1. **Treat all 52 MDX records as unsafe demo data.** Do not outreach, do not reindex, do not sell Featured, do not use names as a CRM.
2. **Quarantine/removal** of fictional records is the first clinic-ops step. Playbook: `OUTREACH-PLAYBOOK.md` (`DRAFT — NOT SENT`).
3. **Stop claiming verification** in city metas, FAQs, index copy, `/directory`, and llms files — even while noindex.
4. **Do not reindex `/clinics`.** Crawl budget is the binding constraint; 60 doorway-shaped URLs were already a measured miss.
5. **Do not build growth on “publish more city pages.”**
6. **Keep peptide-vendor affiliates REJECTED.** Aligns with existing advertising policy and FDA compounding reality.
7. **PepTracker remains the conversion.** Directory, if ever rebuilt, is a post-trust product: real licenses, last-checked dates, unpaid Verified, labeled Sponsored only.
8. **LEGAL REVIEW** before any: paid clinic SKU, lead-gen/referral fee, telehealth listing, compounding-menu display, “Verified provider” language, FormSubmit health leads.

Ethical free-vs-paid model (for a *future* real directory only): `PAID-LISTING-MODEL.md`.

---

## 14. Open questions, calculator framework, legal-review flags

### Open / unverified

- Who generated the 52 records, and were they ever intended as production?
- Did any of the three `featured` clinics ever pay? Repo shows no invoices. Assume unpaid demo unless finance evidence appears.
- PCAC July 2026 final votes on BPC-157/TB-500/etc. — briefing *proposals* read; final Federal Register action not confirmed here.
- Whether live `main` differs in clinic files from this branch — live NY page matched the fictional Manhattan record.
- Current GSC impressions for `/clinics/*` after deindex — UNAVAILABLE.

### Revenue calculator (no invented numbers)

Inputs to pull when ADC/GSC works, then compute — do not fill now:

```
A = GSC clicks to /clinics + /directory (human, 28-day, after bot filter)
B = GA4 conversions on /contact where subject = Directory Listing Request
C = cost of independent verification labor per listing (hours × rate)
D = legal review retainer for healthcare advertising / fee-split opinion
E = expected complaint/takedown hours per 100 listings
F = PepTracker waitlist conversions from the same sessions (opportunity)

Break-even paid listing ARPU ≥ (C+D/N+E) / take-rate
Lead-gen only after counsel says the fee is not an unlawful referral.
If A is ~0 (historical 2 clicks / 5.8 months on 61 URLs), directory ROI is negative at any ARPU.
```

### LEGAL REVIEW checklist (do not treat as cleared)

- [ ] FTC Section 5 + 16 CFR 255 + Fake Reviews Rule as applied to listings/Verified/Featured
- [ ] FDA compounding / unapproved-drug advertising for displayed peptide menus
- [ ] State medical-board advertising (at least CA, TX, FL, NY, AZ)
- [ ] Telehealth licensure and standard of care if remote listings
- [ ] Fee-splitting / kickback / corporate practice of medicine if lead-gen or booking fees
- [ ] Whether a national “clinic finder” is a regulated referral service
- [ ] Privacy: FormSubmit, PHI in listing requests, future HIPAA
- [ ] WADA/USADA adjacency for performance/MK-677 menus
- [ ] Google spam if city pages are reindexed

### Files in this packet

| File | Role |
|---|---|
| `REPORT.md` | This document |
| `FINDINGS.json` | C-001 … C-022 |
| `COVERAGE.json` | All 1343 surface_ids |
| `CLINIC-VERIFICATION.json` | All 52 clinics |
| `AFFILIATE-MATRIX.md` | PURSUE / CAUTIOUS TEST / DEFER / REJECT |
| `PAID-LISTING-MODEL.md` | Ethical free vs paid + editorial draft |
| `OUTREACH-PLAYBOOK.md` | `DRAFT — NOT SENT` |
| `STATUS.txt` | Coverage completeness |

**Bottom line for the lead:** The directory is not a marketplace of clinics. It is 52 fictional placeholders wearing Verified badges, plus 60 city templates that claim those placeholders were vetted. Acquisition starts with deletion, not email.
