# Cursor implementation plan — PepCodex P0 hotfix

Paste this whole file into Cursor. Do **Wave 0 only** unless Lucas says continue.

You are implementing a **production hotfix** from the 2026-09-02 PepCodex audit. Accuracy and reader safety beat traffic. Do not add pages. Do not merge feature branches. Do not invent medical facts.

---

## Git (do this first)

Live site is **`main`** on Vercel (`https://www.pepcodex.com`).

Current checkout may be `feat/scoring-and-freshness`. **That branch is not production.** Live titles, study counts, orforglipron status, calculator 301s, and several blogs **differ**. Merging it is a regression.

```text
git fetch origin
git checkout -B hotfix/p0-audit-2026-09-02 origin/main
```

If `origin/main` is unavailable, stop and ask. Do not start from `feat/scoring-and-freshness`.

Open a PR **into `main`**. Do not self-merge. Lucas ships production.

After Wave 0 is on `main`, cherry-pick the **same template/clinic/robots/protocol guards** onto `feat/scoring-and-freshness` so a later merge cannot re-lie. Do not cherry-pick unrelated scoring/blog work the other way.

---

## Hard rules

- Net URL count must not rise.
- Do not bump `lastUpdated` / sitemap lastmod unless the claim actually changed.
- Do not wire `HowToSchema` or `AggregateRating`.
- Do not send clinic outreach, create accounts, or enroll in affiliates.
- Do not reindex `/clinics`. Keep `noindex, follow` and sitemap exclude.
- Do not flatten indication-specific approvals:
  - SS-31 / Forzinity = **Barth syndrome only**
  - Tesamorelin = **HIV-associated lipodystrophy**, not general fat loss
  - PT-141 / Vyleesi = **HSDD in premenopausal women**, not melanotan II
  - Orforglipron / Foundayo = **weight management**, not T2D; max **17.2 mg** (not 36 mg)
- Do not state Wegovy 7.2 mg US approval unless you open Drugs@FDA.
- Do not use press-release headlines as facts (SURMOUNT-1 22.5%, ATTAIN-1 12.4%, REDEFINE-1 22.7%). Treatment-regimen figures in project notes: 20.9% / 11.2% / 20.4% — verify on the paper before rewriting.
- `qa-pmids` does **not** walk `src/content/protocols/`. If you leave those pages up, you must extend the gate.
- Do not 301 live URLs that are 200 on production unless the task says so. This-branch `vercel.json` already 301s some live 200s (`/blog/2025-glp1-year-review`, tesamorelin calculator). **Do not copy those 301s onto `main`.**

**Approved spot-check (must not say research-only / WADA Prohibited / subcutaneous-only JSON-LD):**  
`semaglutide`, `tirzepatide`, `liraglutide`, `tesamorelin`, `pt-141`.  
On **production** `orforglipron` is still Investigational — do not invent Foundayo copy on `main` in Wave 0 except removing false “research-only” stamps if `regulatoryStatus` already says approved in **that tree**. If `main` still has Investigational, do not stamp FDA Approved.

**Unapproved spot-check (must not inherit a generic FDA Approved chip):**  
`bpc-157`, `tb-500`, `retatrutide`, `melanotan-ii`.

---

## Wave 0 — one PR, nine fixes

Ship together. Clinic quarantine without `X-Robots-Tag` still leaks (GSC 2026-09-02: 16 clinic URLs, 330 impressions, 3 clicks).

### W0-1 · Dossier FDA / WADA / Drug JSON-LD rubber stamp

**Bug.** `src/layouts/DossierLayout.astro` hardcodes:

```astro
<DrugSchema
  administrationRoute="Subcutaneous injection"
  legalStatus="Research use only - not FDA approved for human use"
/>
<SafetyBanner
  fdaStatus="Not FDA Approved"
  wadaStatus="WADA Prohibited"
/>
```

Live `/peptides/semaglutide` shows an FDA Approved chip **and** those strings. WADA 2026 Monitoring Program lists markers of semaglutide/tirzepatide — **not prohibited**. Rybelsus/Foundayo are oral.

**Do**
- Drive banner + JSON-LD from peptide `regulatoryStatus` in frontmatter.
- Emit `Drug` schema **only** when `regulatoryStatus.status === 'approved'`. Otherwise omit Drug `legalStatus` / do not claim research-use-only on approved drugs.
- Do not hardcode subcutaneous. Omit route unless the dossier has a real route field.
- Do not stamp WADA Prohibited on GLP-1s.
- Pass real `safetyInfo` into `SafetyBanner` from `[slug].astro` so defaults do not fire.
- SS-31: if approved in this tree, visible text must stay **Barth only**.

**Files:** `src/layouts/DossierLayout.astro`, `src/components/SafetyBanner.astro`, `src/components/SEO/DrugSchema.astro`, `src/pages/peptides/[slug].astro`

**Done when** local build of `/peptides/semaglutide` and `/peptides/tirzepatide` HTML + JSON-LD do **not** contain:

- `Not FDA Approved`
- `WADA Prohibited`
- `Research use only - not FDA approved for human use`
- `Subcutaneous injection` as a sitewide default

Spot-check ≥3 approved + ≥3 unapproved.

---

### W0-2 · Quarantine fake clinics

**Bug.** 52/52 clinic MDX sites are `example.com`, phones are 555, 50 have `verifiedListing: true`. City FAQ (×60) claims vetted listings, `$100–$300` consults, BPC-157 “for tissue repair”, and says **“multiple”** when `cityClinics.length === 0`.

**Do**
- Remove clinic records from the build (delete `src/content/clinics/*.mdx` or stop collecting them). Do not use them as a prospect list.
- Delete FAQ array + FAQPage JSON-LD in `src/pages/clinics/[city].astro` (the `faqItems` block ~L47–67 and schema ~L339–349).
- Remove Verified badge / Featured ribbon (`ClinicCard.astro`, `FeaturedClinicCard.astro`).
- Strip “verified” / “vetted” from `src/pages/clinics/index.astro`.
- Keep `/clinics` `robots="noindex"` and sitemap exclude in `astro.config.mjs`.
- City pages may exist as empty/noindex shells. They must not invent NAP, prices, or peptide menus.

**Done when** `/clinics/new-york` and `/clinics/miami` have no example.com, no 555, no Verified, no Featured, no `$100-$300`, no “multiple” clinics, no FAQPage. Repo: `verifiedListing: true` count = 0.

---

### W0-3 · Unpublish three protocol pages

**Bug.** Human dose tables cite the wrong PMIDs. NCBI 2026-09-02:

| URL | File | Keep? |
|---|---|---|
| `/protocols/bpc-157-tb-500` | `src/content/protocols/bpc-157-tb-500.mdx` | Unpublish. PMID 7521621 is Laudico 1994 cancer-pain, stored as a BPC-157 human RCT. 5/7 PMIDs unrelated; 30915550 is Gwyer 2019 review mis-attributed; 25415472 Chang 2014 is the only title match. |
| `/protocols/cjc-1295-ipamorelin` | `src/content/protocols/cjc-1295-ipamorelin.mdx` | Unpublish until dose tables gone. 16352683 Teichman and 9849822 Raun are the only keepers, without `dosesUsed`. 16352684 is Morley vitamin D. |
| `/protocols/gh-secretagogue-combinations` | `src/content/protocols/gh-secretagogue-combinations.mdx` | Unpublish. Keepers if rewritten later: 9849822, 18981485 only. |

**Do:** drop from sitemap; `noindex`; prefer 301 to parent dossiers (`/peptides/bpc-157`, `/peptides/cjc-1295`, `/peptides/ipamorelin` or `/peptides/mk-677` as appropriate) over leaving dose tables live. Do not leave milligram/mcg/kg human tables on the site.

**Done when** the three URLs are not in the generated sitemap and HTML is 301 or noindex **without** a dose table.

---

### W0-4 · Live CagriSema “FDA approved” post

**Bug.** Production GET of `/blog/cagrilintide-semaglutide-approval` still says FDA **has approved** CagriSema and quotes REDEFINE-1 **22.7%**. Citations are PubMed *search* URLs. Novo filed an NDA 2025-12-18. CagriSema is **not** on the FDA 2026 novel-drug table through 2026-08-28. GSC: 9 impressions, 0 clicks — not a traffic asset.

On `feat/scoring-and-freshness` the MDX was already rewritten. **Do not merge that branch.** On `main`, either:

- Unpublish / 301 to `/peptides/cagrilintide` (or cagrisema dossier if it exists), or
- Replace body: not approved; NDA filed; no 22.7% as the published headline; cite real PMIDs not search URLs.

**Done when** that live URL no longer states FDA approval or 22.7%.

Also live-GET (do not guess) and fix if they still overclaim approval:

- `/blog/pemvidutide-eu-mash-approval`
- `/blog/pemvidutide-crl-more-data`
- `/blog/survodutide-fda-submission-mash`
- `/blog/wegovy-pill-launches-us`
- `/blog/fda-semaglutide-shortage-extended`

---

### W0-5 · `/directory` and `llms.txt`

**Files:** `src/pages/directory.astro`, `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`, footer in `BaseLayout.astro`

**Do:** holding page with **zero** verified/vetted/telehealth-protocol/clinic-finder claims, **or** `noindex` + sitemap drop. Footer may keep the link.

**Done when** `/directory` and `llms.txt` do not promise a US verified clinic finder.

---

### W0-6 · Calculators — strip dosing product

**Files:** `src/content/calculators/*.mdx`, `src/layouts/CalculatorLayout.astro`, `src/pages/calculator/reconstitution/[slug].astro`

**Do:** remove “desired dose (mcg)” → syringe/draw volume. Dilution math only, or unpublish. **Do not add a 301 for `/calculator/reconstitution/tesamorelin` on `main`** (live is 200; the feature branch 301s it). No HowTo schema. No new calculator URLs.

**Done when** remaining calculator pages cannot output a human dose in mcg.

---

### W0-7 · Sitewide `X-Robots-Tag: index, follow`

**File:** `vercel.json` headers `/(.*)` → `X-Robots-Tag: index, follow`

**Do:** delete that blanket header, or emit `noindex, follow` only on routes that are noindex (`/clinics*`, generic glossary, 404). Homepage must stay indexable.

**Done when** `curl -sI https://www.pepcodex.com/clinics/new-york` does not send `X-Robots-Tag: index, follow`.

---

### W0-8 · Two template lies

1. `src/components/InteractionMatrix.astro` — delete **“Generally safe to combine based on known mechanisms.”**
2. `src/pages/peptides/[peptide]/[condition].astro` ~L275 — stop inferring approval from `evidenceStrength`:

```js
peptide.data.evidenceStrength === 'high' || peptide.data.evidenceStrength === 'moderate' ? 'may have' : 'has not received'
```

Use `regulatoryStatus` only, or drop the approval sentence.

**Done when** those strings are gone from a peptide-condition page build.

---

### W0-9 · Sourcing / dosing checklist

**Files:** `src/layouts/DossierLayout.astro` quality section, `src/components/QualityChecklist.astro`, `src/content/peptides/orforglipron.mdx` if present on `main`

**Do:** remove eyebrow **Sourcing** and any “Clear dosing instructions (12mg, 24mg, or 36mg)” / buy-guide copy. Editorial policy already bans sourcing and dosing. Do not add Foundayo 36 mg. Foundayo max is **17.2 mg** if you mention a dose at all — Wave 0 may simply **delete** the instruction list.

**Done when** orforglipron (if in tree) has no mg-by-week shopping checklist.

---

## Wave 0 acceptance (PR description must include)

```text
[ ] Branched from origin/main, not feat/scoring-and-freshness
[ ] npm test / graph:check / qa-banned-content / qa-pmids green (or document skip)
[ ] Local GET semaglutide + tirzepatide: no research-only / WADA Prohibited / subcutaneous default JSON-LD
[ ] Local GET bpc-157: not showing a generic FDA Approved chip
[ ] Clinics: no example.com, Verified, Featured, $100-$300 FAQ
[ ] Three /protocols/* gone from sitemap
[ ] CagriSema post does not say FDA approved
[ ] vercel.json does not blanket X-Robots-Tag: index, follow
[ ] No new URLs
[ ] No lastUpdated bumps on untouched files
[ ] Did not copy feature-branch 301s that would kill live 200s
```

---

## Wave 1 — only after Wave 0 is on production

Second PR. Still no new URLs. Still no clinic outreach.

1. **Protect click-winning compares** (GSC www 2026-05-28–08-31). Do **not** 301:
   - `/compare/cagrilintide-vs-survodutide` (10 clicks)
   - `/compare/follistatin-vs-igf-1-lr3`
   - `/compare/na-semax-amidate-vs-selank`
   - `/compare/ovagen-vs-svetinorm`
   - `/compare/thymogen-vs-vilon`
   - `/compare/vilon-vs-vladonix`
   - `/compare/5-amino-1mq-vs-slu-pp-332`
2. Noindex or 301 the rest of the thin `/compare/*` (179/269 are &lt;200 words). Net sitemap **down**.
3. Homepage: remove “Spring 2026”; mount existing `AppWaitlistCTA`. Home is **39 GSC clicks**.
4. Snippet-only rewrites (title/meta/H1, no new pages), mobile-first:
   - `/peptides/ghk-cu` 2437 impr / 4 clicks
   - `/peptides/dsip` 2347 / 4
   - `/peptides/tb-500` 2335 / 1
   - `/peptides/retatrutide` 1425 / 1 pos 6.8
   - `/peptides/bpc-157` 578 / 1 pos 9.1
   - `/peptides/cagrilintide` 397 / 0 pos 8.2
   - `/peptides/tesamorelin` 232 / 0 pos 7.6
   - `/peptides/orforglipron` 54 / 0 pos 8.5 — Foundayo card **on this URL** if you are now on a tree that may say Investigational: approved 2026-04-01 NDA 220934, max 17.2 mg, boxed warning, not T2D. Do not add 36 mg.
5. Generic glossary (`/glossary/safety-profile` 725 impr / 1 click): keep/expand **noindex**. Do not write “what are peptides” blogs (pos ~60).
6. Consent-gate `gtag` in `BaseLayout.astro` **before** `gtag('config')`.
7. Extend `scripts/qa-pmids.mjs` to `src/content/protocols/` if any protocol files remain.

---

## Do not do (Cursor)

- Merge `feat/scoring-and-freshness` → `main`
- New city / compare / peptide-condition / calculator / blog URLs
- Research-chem affiliates, Featured listings, clinic emails
- Mount `ExitIntentPopup`
- Reindex `/clinics`
- “BPC-157 now legal” posts
- Dual-fattening blog and guide twins

---

## If you need evidence

Same folder: `HANDOFF.md`, `FIRST-PARTY-DATA.md`, `FINAL-REPORT.md`.  
NCBI PMID table: `council/DISSENT-LOG.md`.  
Do not treat those as extra work. Wave 0 is the work.
