# Template / Schema / Accessibility / Claim-Spreader Audit

**Date:** 2026-09-02  
**Mode:** audit only (no code changes)  
**Scope:** all 32 `type=template` surfaces in `INVENTORY-COMPACT.json`, plus required extras (`src/layouts/*.astro`, `src/components/SEO/*.astro`, listed components, `src/pages/clinics/[city].astro`, `src/scripts/analytics.ts`, `src/pages/index.astro`, `src/pages/api/subscribe.ts`).  
**Independence:** did not read other auditor reports.

Inventory template files (TEMPLATE-1266 … TEMPLATE-1297):  
`BaseLayout`, `BlogLayout`, `CalculatorLayout`, `ComparisonLayout`, `ConditionLayout`, `DossierLayout`, `GlossaryLayout`, `GuideLayout`, `HubLayout`, `ProtocolLayout`, `SafetyLayout`, `DisclaimerBanner`, `SafetyBanner`, `EvidenceBadge`, `EvidenceChain`, `ClinicCard`, `FeaturedClinicCard`, `ExitIntentPopup`, `CookieConsent`, `AppWaitlistCTA`, SEO (`Organization`, `Drug`, `FAQ`, `Article`, `HowTo`, `ItemList`, `Breadcrumb`), `RatingCard`, `QualityChecklist`, `SourcesList`, `TrialTable`, `clinics/[city].astro`.

Also read: `JsonLd.astro`, `NewsletterForm.astro`, `SearchModal.astro` (mounted from BaseLayout), `InteractionMatrix.astro` (hardcoded “safe”), `Timeline.astro`, `src/pages/clinics/index.astro` (parent of city FAQs), `src/pages/peptides/[slug].astro` (does not pass `faqs` / `safetyInfo`).

---

## 1. Spreader claims (hardcoded, not from collections)

Full quote table: `SPREADER-CLAIMS.json` (40 items). Highest-blast findings:

### Sitewide (BaseLayout ≈ all HTML pages)

- Default meta: `Evidence-based peptide research library. Comprehensive dossiers with citations, not advice.` (`src/layouts/BaseLayout.astro` L16–17).
- Footer: `Evidence-based peptide research catalogue. Synthesising peer-reviewed literature for informed decisions, one drawer at a time.` (L335–337).
- Organization JSON-LD on every page (`OrganizationSchema.astro` L4–12): `PepCodex`, `https://www.pepcodex.com`, `logo: https://www.pepcodex.com/logo.png`, `sameAs: []`. **`public/` has no `logo.png`** (only `favicon.svg`, `og-default.png`).
- Disclaimer banner: `Educational content only. Not medical advice.` (`DisclaimerBanner.astro` L40–43).
- Cookie copy: `We use cookies to enhance your browsing experience and analyze site traffic.` (`CookieConsent.astro` L63–66).

### Dossiers (107 pages) — worst multipliers

`DossierLayout` hardcodes regulatory and route facts that ignore collection data:

```427:436:src/layouts/DossierLayout.astro
  <DrugSchema
    name={name}
    alternateName={aliases}
    description={summary}
    drugClass={categoryLabels[category]}
    administrationRoute="Subcutaneous injection"
    legalStatus="Research use only - not FDA approved for human use"
    molecularWeight={molecularInfo?.weight}
    url={articleUrl}
  />
```

```582:587:src/layouts/DossierLayout.astro
    <SafetyBanner
      peptideName={name}
      evidenceStrength={evidenceStrength}
      fdaStatus="Not FDA Approved"
      wadaStatus="WADA Prohibited"
    />
```

`safetyInfo` is declared on the layout (L107–130) and **never destructured or passed**. `src/pages/peptides/[slug].astro` also never passes `safetyInfo` or `faqs`.

`SafetyBanner.astro` L32–36 then always uses default warnings:

- `Not approved for human use by any regulatory agency`
- `Limited human clinical trial data`
- `Consult a healthcare provider before use`

At least 17 dossiers carry `regulatoryStatus.status: approved` in frontmatter (semaglutide, tirzepatide, liraglutide, tesamorelin, abaloparatide, dulaglutide, exenatide, hcg, hmg, octreotide, pasireotide, pt-141, teriparatide, and others). Those pages still show **Not FDA Approved**, **WADA Prohibited**, and **not approved by any regulatory agency**. Semaglutide’s own summary says it is FDA-approved (content L11–18 vs template banner).

Other dossier multipliers:

- `InteractionMatrix.astro` L61: `Generally safe to combine based on known mechanisms` for every `compatible` row.
- `DossierLayout` L815–817: modified GRADE claim.
- L803–805: `All citations link to PubMed for verification.`
- L707 / `Timeline.astro`: `What to expect`.
- L716–717: Quality section eyebrow `Sourcing` (conflicts with banned sourcing guidance).
- `RatingCard.astro` L116–134: user-visible **Effectiveness** /100 scores. These are **not** emitted as `AggregateRating` JSON-LD (good).

### Clinic city pages (60) — FAQ JSON-LD of unverified clinics

Hardcoded Q&A in `src/pages/clinics/[city].astro` L47–67, also rendered in the page body L339–349 and as `FAQSchema`. Sample answers:

- `{city} has {count | 'multiple'} peptide therapy clinics offering services including BPC-157, semaglutide, and growth hormone secretagogues. … find verified providers`
- `Verified listings in our directory have been vetted for these criteria.`
- Typical offerings: BPC-157 for tissue repair, semaglutide/tirzepatide for metabolic health, CJC-1295 + ipamorelin for GH support
- `Yes, most peptide therapies require a prescription…`
- `Initial consultations typically range from $100-$300`

If `cityClinics.length === 0`, the FAQ still says **`multiple` clinics** (L50). Pages are `robots="noindex"` (L87–90) but FAQ JSON-LD still ships. Inventory: 52 clinic records, **50 `verifiedListing: true`**, **52 placeholder websites**. Cards print a **Verified** badge (`ClinicCard.astro` L38–44; `FeaturedClinicCard.astro` L45–51) plus a **Featured** ribbon (L32–36).

`clinics/index.astro` L41–61 (not in the 32-template list, parent hub): `Discover verified peptide therapy clinics… offering BPC-157, Semaglutide, and other research peptides`.

### Peptide–condition pages (295)

`src/pages/peptides/[peptide]/[condition].astro` L273–276 invents approval from evidence grade:

`{name} {high|moderate ? 'may have' : 'has not received'} regulatory approval for some indications but should only be used under qualified medical supervision.`

That is not `regulatoryStatus`.

### Home (`src/pages/index.astro`)

- L66, L75, L104: `Spring 2026` / `Vol. IV`
- L268: `No. 03 lands this summer.` (inconsistent volume numbering)
- L288–291: `We do not provide dosing, protocols, or sourcing information.` while footer links `/protocols` and dossiers render dose-in-study + quality/sourcing sections
- Drawer blurbs L42–47: `Anti-aging bioregulators`, `Healing and tissue regeneration`, etc.
- **No AppWaitlistCTA**

### Other layout disclaimers (mostly appropriate, still multiplied)

| Layout | Pages | Hardcoded string (abbrev.) |
|---|---|---|
| ComparisonLayout L184–187 | 269 | educational only; treatment decisions |
| BlogLayout L314–317 | 140 | not for diagnosis/treatment/prevention |
| GuideLayout L196–221 | 36 | same; plus hardcoded `/safety/glp1-safety-overview` for any peptide-tagged guide |
| GlossaryLayout L205–208 | 215 | educational glossary |
| ConditionLayout L248–251 | 15 | may or may not have regulatory approval |
| ProtocolLayout L87–91 | 3 | research documentation, not dosing |
| SafetyLayout L87–90, L224–226 | 31 | not intended to diagnose, treat, cure, or prevent |
| CalculatorLayout L42 | 4 | Educational tool only |

`NewsletterForm.astro` default: `Get Research Alerts` / `No spam, just evidence.` (L12–13). Condition + peptide-condition + conditions index pass `variant="compact"`, which **is not a defined variant** (`inline` \| `card` \| `full`) so those forms render **nothing**.

`ExitIntentPopup.astro` copy exists (`Before you go...` / `No spam, just science.`) but **the component is not imported anywhere** — live page count **0**.

---

## 2. Schema types

| Component | `@type` | Used where | Verdict |
|---|---|---|---|
| OrganizationSchema | Organization | every BaseLayout page | OK type; **broken logo URL**; empty `sameAs` |
| DrugSchema | Drug + DrugClass | every dossier | **Wrong for most of this catalogue.** Research peptides, Khavinson cytamins, and many unapproved compounds are not schema.org `Drug`. `drugClass` is the **site category** (`Metabolic`, `Longevity`), not a real class. Hardcoded `Subcutaneous injection` and `Research use only - not FDA approved`. Approved drugs are still labeled research-only. Prefer `MedicalWebPage` + optional `Drug` **only** when `regulatoryStatus.status === 'approved'`, or no Drug entity. `DietarySupplement` is also wrong for Rx peptides. |
| ArticleSchema | Article | dossiers, glossary, calculators, peptide-condition | Weak. Glossary is a definition, calculators are tools, dossiers are closer to `MedicalWebPage` / `ScholarlyArticle`. Publisher logo 404s. |
| FAQSchema | FAQPage | city clinics (hardcoded); comparisons/dossiers if `faqs` passed | **Clinic FAQ is the live problem:** unverified clinics, invented prices, “vetted”. Dossier `faqs` prop is **never passed** from `[slug].astro`, so peptide FAQ schema is currently dead. Comparison FAQs come from content, not this auditor’s content pass. |
| HowToSchema | HowTo | **unused** (no imports) | Component ready to emit dosing HowTo; not currently on pages. **Do not wire it to reconstitution/protocol steps.** |
| ItemListSchema | ItemList | glossary index only | Reasonable. |
| BreadcrumbSchema | BreadcrumbList | most layouts | Many layouts concatenate `peptides/`, `blog/`, `compare/` **with trailing slash** while the site is `trailingSlash: 'never'` (lessons: each slash is a 308). Clinic breadcrumbs correctly use `/clinics` without a trailing slash. |
| — | AggregateRating | **not present** | RatingCard scores are HTML only. Do not add AggregateRating: they are not customer reviews. |
| — | MedicalWebPage | **not present** | Missing type that would fit dossiers/safety better than Article+Drug. |

`JsonLd.astro` L9: `<script type="application/ld+json" set:html={JSON.stringify(data)} />` — correct pattern.

---

## 3. Accessibility

**Present**

- Skip link: `BaseLayout.astro` L104 `Skip to main content` → `#main-content`. CSS in `global.css` L605–616 (focus reveals it; `--ink-paper` on `--primary-c`).
- `html lang="en"`.
- Main nav `aria-label="Main navigation"`; current page `aria-current="page"` on some desktop links.
- Mobile menu: `aria-expanded`, Escape, focus first link, Tab trap (`BaseLayout.astro` L416–470).
- Search modal: `role="dialog"`, `aria-modal`, Escape, backdrop click, arrow-key result list, Tab trap (`SearchModal.astro` L5–11, L448–580).
- Cookie dialog: `role="dialog" aria-modal aria-labelledby`.
- Disclaimer: `role="alert" aria-live="polite"`.
- EvidenceBadge `role="status"` + `aria-label`.
- `prefers-reduced-motion` in `global.css` L623+.
- Fonts: `<link rel="preload">` for Geist/Newsreader (not CSS `@import` of Google fonts).

**Gaps**

- Footer headings are **`h4` with no h2/h3** (`BaseLayout.astro` L347, L360, L378) — skipped levels on every page.
- Desktop **Research** menu is hover-only (`group-hover`). The trigger is a `<button>` without `aria-expanded`, `aria-controls`, or keyboard open. Keyboard/SR users cannot reach Comparisons/Guides/Safety/Glossary from desktop nav.
- Header search button (`L201`) has `aria-label="Search (Ctrl+K)"` but no visible close control in the search modal (Escape/backdrop only).
- **No `<img>` tags** in `src/**/*.astro`, so no missing `alt` on `<img>`. Decorative SVGs in nav/footer generally lack `aria-hidden="true"` (logo flask, Instagram path). Some vials/badges do have labels.
- Newsletter email fields have **no `<label>`** (placeholder only) — `NewsletterForm.astro` L28–35 and duplicates. Honeypot `website` is `aria-hidden` + `tabindex="-1"` (OK).
- Cookie modal: **Escape is a no-op** (`CookieConsent.astro` L305–310: “user must make a choice”). No Tab wrap/focus trap beyond initial focus. `body { overflow: hidden }` while open. Analytics toggle is a visual switch whose value is **ignored** on “Essential Only” (L291–297 sets `analytics: false` always; `analyticsEnabled` unused).
- Exit-intent (if mounted): `h3` with no h1/h2 in the overlay; no focus move into dialog; no focus trap; close is a button with `aria-label="Close popup"`.
- Disclaimer dismiss button has `focus:ring` classes but **no ring color token** (L65–66).
- `CalculatorLayout.astro` leftover dark utilities: `text-white`, `bg-white/5`, `border-white/10`, `text-amber-200/90` on paper `--bg: #f6f1e7` — **white-on-cream contrast failure**.
- Contrast tokens: `--ink` `#1f1a12` on `--paper` `#fbf7ee` is fine. `--ink-dim` `#8e8567` on paper is ~3.5:1 — eyebrow/footer-adjacent text may fail WCAG AA for small text. Footer uses `rgba(251,247,238,0.45)` on `--charcoal` `#1f1a12` — similarly thin.
- Blog reading time (`BlogLayout.astro` L88–89) is `Math.ceil(excerpt.length / 200) + 5`, not body words — a11y-adjacent honesty issue.

---

## 4. Privacy

### GA vs consent (broken)

`BaseLayout.astro` L84–99 loads gtag **as soon as `PUBLIC_GA_TRACKING_ID` is set**, skipping only localhost:

```javascript
window.gtag('js', new Date());
window.gtag('config', GA_TRACKING_ID);
```

There is **no** `gtag('consent', 'default', { analytics_storage: 'denied' })` **before** that config. CookieConsent later (`L247–251`) may call `consent default denied` **after** the library has already configured — too late for Consent Mode v2. `applyConsent` (`L194–200`) can `consent update` granted/denied only if `window.gtag` exists.

First visit: GA script + config run, **then** the cookie banner appears. Declining tries to delete `_ga` / `_gid` / `_gat` cookies (`L203–212`) after the fact.

`BaseLayout.astro` L402–406 also `inject()` **Vercel Analytics with no consent gate**.

`src/scripts/analytics.ts` fires `search`, `comparison_click`, `newsletter_signup`, `external_link_click`, `scroll_depth` via `gtag('event', …)` with **no consent check** (only `typeof gtag === 'undefined'`). Search handler records `search_term` (L23).

Cookie banner claims GDPR/ePrivacy compliance in the file comment (`CookieConsent.astro` L5–9). Implementation does not match: analytics defaults **on** in the UI (`analytics-toggle` `checked`, L116), GA loads before choice, Vercel Analytics always on.

### `/api/subscribe` (`src/pages/api/subscribe.ts`)

Collects from JSON body:

- `email` (required; lowercased; sent to Beehiiv)
- `source` → Beehiiv `utm_source` (default `website`; waitlist uses `peptracker_waitlist`)
- `website` honeypot — if set, returns fake success and does not subscribe (L128–136)

Also derived: client IP (`clientAddress` / `x-real-ip` / rightmost XFF) for in-memory rate limit (5/min); per-email rate limit. Beehiiv payload also sets `utm_medium: organic`, `utm_campaign: pepcodex`, `reactivate_existing: true`, `send_welcome_email: true`.

CORS: allowlist (`PEPCODEX_ALLOWED_ORIGINS` or `https://www.pepcodex.com`), **not** `*`. Origin/referer check on POST.

Forms: POST `/api/subscribe` from `NewsletterForm` (also `fetch` JSON on submit). Fields: email, source hidden, website honeypot.

---

## 5. Intrusive UX — ExitIntentPopup

File: `src/components/ExitIntentPopup.astro`. **Not mounted** (no importer). If enabled:

- Copy: heading `Before you go...`; `Get evidence-based peptide research delivered to your inbox. No spam, just science.`
- Triggers: 6s arming delay; desktop `mouseleave` with `clientY < 10`; mobile/scroll `scrollPct > 0.9`
- Persistence: `localStorage['pep-newsletter-seen']` set **on show**, one-time
- Close: X, backdrop click, Escape
- Overlay `z-index: 9999`, `body` not locked; **no focus trap / no initial focus**
- Embeds `NewsletterForm variant="inline"`

Cookie + disclaimer already compete for attention sitewide. Do not mount exit-intent without fixing focus and stacking (cookie is `z-50`, disclaimer `z-40`, exit `9999` would cover both).

---

## 6. “Verified” / “vetted” / “safe” / “effective”

| String | File | Live? |
|---|---|---|
| `Verified` badge | ClinicCard L43, FeaturedClinicCard L50 | Yes, 50/52 clinics |
| `verified providers` / `vetted for these criteria` | clinics/[city].astro L50, L54 | Yes, 60 city pages + FAQ JSON-LD |
| `verified peptide therapy clinics` | clinics/index.astro L42, L61 | Yes (noindex hub) |
| `Generally safe to combine…` | InteractionMatrix L61 | Yes, dossiers with compatible interactions |
| `Effectiveness` / `clinically demonstrated` | RatingCard L116–130 | Yes, dossiers with scoring |
| `research you can trust` | DossierLayout L850 | Yes, 107 |
| `Unverified anecdote` | DossierLayout L634, L669 | Yes — correctly cautious |
| `Evidence-based` (nav/footer/home/meta) | BaseLayout, index | Sitewide |

No template string `effective` as a medical guarantee except RatingCard’s axis name and methodology-style “clinically demonstrated” label driven by `scoring.effectiveness.basis`.

---

## 7. App waitlist CTA vs project goal

Project goal (CLAUDE.md): pepcodex.com exists as owned traffic for PepTracker; **app CTAs on site were 0** as of the Aug 2026 stamp; maintenance job is a real CTA toward the app.

**Present**

- `AppWaitlistCTA.astro` — restrained copy (`does not recommend doses or sources`, `no store listing yet`, `not a safety verdict`).
- Mounted only in:
  - `DossierLayout` L843 (`context="dossier"`) → **107**
  - `SafetyLayout` L204 (`context="safety"`) → **31**
  - `CalculatorLayout` L98 (`context="calculator"`) → **4**
- Total ≈ **142** pages. Same Beehiiv list as newsletter (`source="peptracker_waitlist"`). Footer note: `Same list as the research newsletter.`

**Absent (highest-traffic / highest-intent gaps)**

- Home (`index.astro`) — newsletter “No. 03” only; **no PepTracker**
- BaseLayout header/footer — Contact + Subscribe, **no app**
- BlogLayout (140), ComparisonLayout (269), GlossaryLayout (215), GuideLayout (36), ConditionLayout (15), ProtocolLayout (3)
- Peptide–condition pages (295)
- Clinic templates (60) — “Get Listed Free” for clinic owners, not the app

Net: CTA exists on dossiers/safety/calculators and is missing on the homepage and most of the graph. Crawl-budget constraint argues against new URLs; it does not argue against adding the existing component to `index.astro` / `BaseLayout`.

---

## 8. Other template defects (not invented)

- `HowToSchema.astro` and `ExitIntentPopup.astro` are dead code.
- `DossierLayout` `faqs` never wired from the peptide page.
- `NewsletterForm variant="compact"` used in ConditionLayout L339, conditions index, peptide-condition L341 — **silent empty CTA**.
- Quality checklist + clinic “FDA-registered compounding pharmacies” vs homepage `We do not provide … sourcing information.`
- GuideLayout hardcodes GLP-1 safety overview for non-GLP-1 peptides.
- ClinicCard `slug` is unused (cards are not links to a clinic URL).
- Organization/Article `logo.png` 404.

---

## Severity snapshot

1. **P0 — false regulatory labels × 107:** Not FDA Approved + WADA Prohibited + Drug `legalStatus` + default “not approved by any regulatory agency”, including FDA-approved drugs.
2. **P0 — clinic FAQ JSON-LD × 60:** verified/vetted, $100–$300, typical BPC-157 indications, “multiple clinics” when zero listed.
3. **P1 — GA/Vercel before consent** on every page.
4. **P1 — `Drug` + hardcoded SC injection** on every dossier.
5. **P1 — peptide-condition approval inferred from evidenceStrength × 295.**
6. **P2 — App CTA missing on home and most templates.**
7. **P2 — a11y:** Research dropdown, footer h4, unlabeled email, cookie keyboard, calculator white-on-paper.
8. **P3 — dead HowTo/ExitIntent; compact newsletter variant; trailing-slash breadcrumbs; missing logo.png.**

No `AggregateRating` and no live HowTo dosing schema were found. Those are absences to preserve, not gaps to fill.
