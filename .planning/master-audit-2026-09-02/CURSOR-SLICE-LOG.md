# Cursor slice log — 2026-09-02

**Agent:** implementer (this session)
**Plan:** `.planning/master-audit-2026-09-02/CURSOR-IMPLEMENTATION-PLAN.md`
**Section executed:** Wave 0 · **W0-1** (Dossier FDA / WADA / Drug JSON-LD rubber stamp)
**Branch:** `feat/scoring-and-freshness` (dirty). Did **not** checkout `hotfix/p0-audit-2026-09-02` from `origin/main`.
**Commit:** none (Lucas did not ask). **Judge / KEEP:** none.

## Why this slice

Plan Git (`checkout -B hotfix/p0-audit-2026-09-02 origin/main` + PR into `main`) is blocked here: conductor locked the workspace to `feat/scoring-and-freshness`, no commit/push, and the working tree is already dirty. HANDOFF still says apply the same guards on this branch so a later merge cannot re-lie. W0-1 was the first unblocked implementation checkbox. Skipped leftover census / WAF apply / TICK6-PRICE / TICK37 KEEP.

## What changed

Banner + Drug JSON-LD now follow `regulatoryStatus` in frontmatter.

- `Drug` schema emits **only** when `status === 'approved'`. No `legalStatus`. No sitewide subcutaneous default — route is `molecularInfo.routes` or omitted.
- Safety banner no longer defaults to `Not FDA Approved` / `WADA Prohibited` / “not approved for human use by any regulatory agency.” WADA is omitted unless a real `wadaStatus` is passed (none in schema today — not invented).
- `[slug].astro` now passes `safetyInfo` (FDA label + first sentence of `regulatoryStatus.notes`). SS-31 notes still carry **Barth syndrome**.
- Labels: approved → `FDA Approved`; investigational → `Investigational`; compounding-restricted → `Compounding Restricted`; research-only → `Research Only`. Unapproved dossiers do not inherit a generic FDA Approved chip.

## Files touched

- `src/layouts/DossierLayout.astro`
- `src/components/SafetyBanner.astro`
- `src/pages/peptides/[slug].astro`
- `src/components/SEO/DrugSchema.astro` — read only; already omits empty fields

No dossier MDX, no lastUpdated bumps, no new URLs.

## Commands actually run

```text
git status -sb
git branch -vv
git log -3 --oneline
git diff -- src/layouts/DossierLayout.astro src/components/SafetyBanner.astro src/components/SEO/DrugSchema.astro src/pages/peptides/[slug].astro
node .planning/master-audit-2026-09-02/_w0-1-check.mjs
```

`_w0-1-check.mjs` was deleted after the run. Did **not** run `astro build` (other build terminals occupied; conductor prefer-not).

## Check results (source + frontmatter, not rendered HTML)

Template scan of the four W0-1 files: **CLEAN** of `Not FDA Approved`, `WADA Prohibited`, `Research use only - not FDA approved for human use`, hardcoded `Subcutaneous injection` / banner stamps.

Spot-check mapping:

| slug | status | banner | Drug schema | note contains |
|---|---|---|---|---|
| semaglutide, tirzepatide, liraglutide | approved | FDA Approved | yes | FDA-approved… |
| tesamorelin | approved | FDA Approved | yes | HIV-infected / lipodystrophy |
| pt-141 | approved | FDA Approved | yes | HSDD / premenopausal |
| ss-31 | approved | FDA Approved | yes | **Barth** |
| bpc-157, tb-500, melanotan-ii | research-only | Research Only | no | Category 2 / withdrawn nomination |
| retatrutide | investigational | Investigational | no | Not FDA-approved (Drugs@FDA) |

Local GET of built HTML is **not** done this slice.

## Next slice (unblocked)

**W0-2 · Quarantine fake clinics** — done this session (see below). Then **W0-3**.

## Blockers

- **Production hotfix PR** — needs a clean worktree from `origin/main`, commit, push, Lucas merge. Not this session.
- **WAF apply** — still Lucas.
- **TICK6-PRICE** — still blocked.
- **TICK37 KEEP** — UNCLOSED; do not Grok-stamp.
- Live GET acceptance for W0-1 still fails until the same guards ship on `main`.

---

# W0-2 · Quarantine fake clinics

**Agent:** implementer (this session)
**Plan:** `.planning/master-audit-2026-09-02/CURSOR-IMPLEMENTATION-PLAN.md` · Wave 0 · **W0-2**
**Evidence cited:** `audit-c/CLINIC-VERIFICATION.json` (52/52 `FICTIONAL_PLACEHOLDER`, 50 `verifiedListing: true`, 52 example.com / NANPA 555)
**Branch:** `feat/scoring-and-freshness` (dirty). Did **not** checkout `hotfix/p0-audit-2026-09-02` from `origin/main`.
**Commit:** none (Lucas did not ask). **Judge / KEEP:** none.
**Status:** **done** (source-level; local HTML GET skipped — no astro build)

## Why this slice

Plan W0-2: delete clinic records (do not use as a prospect list); delete city FAQ + FAQPage JSON-LD; remove Verified / Featured chrome; strip verified/vetted from `/clinics` index; keep `robots="noindex"` (`noindex, follow` via BaseLayout) and sitemap `/clinics/` exclude. City pages may remain as empty shells without invented NAP, prices, or peptide menus.

## What changed

- Deleted all 52 `src/content/clinics/*.mdx` placeholder records. Collection dir kept with `.gitkeep`. Pages no longer `getCollection('clinics')`.
- `[city].astro` is an empty noindex shell: no FAQ / FAQPage, no clinic cards, no Featured partners, no `$100–$300`, no “multiple” clinics, no peptide menu, no city `content` / `metaDescription` (those still say “verified providers” in city MDX — not rendered).
- `/clinics` index: verified/vetted/Featured copy and clinic-count stats removed. City links still mirror `getStaticPaths` (`city.id` minus `.mdx`, no trailing slash), guarded with a `Set` of real city slugs.
- `ClinicCard` / `FeaturedClinicCard`: Verified badge and Featured ribbon removed (cards unused after quarantine).
- `astro.config.mjs` sitemap `/clinics/` filter left in place. No new clinic URLs.

## Files touched

- `src/content/clinics/*.mdx` — deleted (52)
- `src/content/clinics/.gitkeep` — added
- `src/pages/clinics/[city].astro`
- `src/pages/clinics/index.astro`
- `src/components/ClinicCard.astro`
- `src/components/FeaturedClinicCard.astro`

No `BaseLayout.astro`. No lastUpdated bumps. No new URLs.

## Commands actually run

```text
Remove-Item -Path src\content\clinics\*.mdx
(Get-ChildItem src\content\clinics\*.mdx | Measure-Object).Count
rg -l "verifiedListing:\s*true" src --glob "*.mdx"
rg -n -i "example\.com|555-|Verified|Featured|\$100|FAQPage|faqItems|vetted|verifiedListing|getCollection\('clinics'\)" src/pages/clinics src/components/ClinicCard.astro src/components/FeaturedClinicCard.astro
rg -n "clinics" astro.config.mjs
rg -n "robots" src/pages/clinics
```

Did **not** run `astro build` / `graph:check` (conductor prefer-not; not sole occupant).

## Check results (source, not rendered HTML)

| Check | Result |
|---|---|
| Clinic MDX remaining | **0** |
| `verifiedListing: true` in `src/**/*.mdx` | **0** |
| FAQ / FAQPage / faqItems on clinic pages | **gone** |
| Verified badge / Featured ribbon | **gone** |
| `$100-$300` / “multiple” clinics | **gone** |
| `getCollection('clinics')` | **none** |
| `/clinics` sitemap exclude | **kept** (`!/\/clinics(\/|$)/`) |
| `robots="noindex"` → `noindex, follow` | **kept** (BaseLayout already emits follow) |

Leftover (not rendered): `src/content/cities/*.mdx` `metaDescription` / `content` still say “verified providers” and invent clinic scenes. Template no longer reads those fields.

Local GET of `/clinics/new-york` and `/clinics/miami` HTML is **not** done this slice.

## Next slice (unblocked)

**W0-3 · Unpublish three protocol pages** — `bpc-157-tb-500`, `cjc-1295-ipamorelin`, `gh-secretagogue-combinations`. Drop from sitemap; noindex; prefer 301 to parent dossiers; no dose tables live.

Then W0-4 (CagriSema post — already rewritten on this branch; still must live-GET `main`), W0-5…W0-9.

## Blockers

- **Production hotfix PR** — needs a clean worktree from `origin/main`, commit, push, Lucas merge. Not this session.
- **WAF apply** — still Lucas.
- **TICK6-PRICE** — still blocked.
- **TICK37 KEEP** — UNCLOSED; do not Grok-stamp.
- Live GET acceptance for W0-2 still fails until the same quarantine ships on `main`.
- City MDX “verified providers” copy leftover — not this slice unless W0-5/directory work reopens it.

---

# W0-3 · Unpublish three protocol pages

**Agent:** implementer (this session)
**Plan:** `.planning/master-audit-2026-09-02/CURSOR-IMPLEMENTATION-PLAN.md` · Wave 0 · **W0-3** (HANDOFF T-03)
**Evidence cited:** plan W0-3 table (NCBI 2026-09-02): PMID 7521621 Laudico 1994 stored as BPC-157 RCT; 16352684 Morley vitamin D; combo keepers 9849822 / 18981485 only.
**Branch:** `feat/scoring-and-freshness` (dirty). Did **not** checkout `hotfix/p0-audit-2026-09-02` from `origin/main`.
**Commit:** none (Lucas did not ask). **Judge / KEEP:** none.
**Status:** **done** (source-level; local HTML GET / `graph:check` skipped — no astro build)

## Why this slice

Plan W0-3: drop from sitemap; noindex; prefer 301 to parent dossiers over leaving dose tables live. Unpublishing is the fix, not rewriting dose tables. Net URL −3.

## What changed

- Deleted the three protocol MDX files so `getStaticPaths` emits no HTML (no mg/mcg/kg tables).
- `vercel.json` 301s to existing dossiers: `/peptides/bpc-157`, `/peptides/cjc-1295`, `/peptides/mk-677`.
- `astro.config.mjs` `SITEMAP_EXCLUDE` lists all three URLs (`noindex` alone does not save crawl budget).
- Shared unpublished Set filters `[slug].astro`, `/protocols` index, and `llms-full.txt`. Index empty-state links only parent slugs that exist in the peptides collection.
- Collection dir kept with `.gitkeep`. `/protocols` index remains (footer still links it; BaseLayout not edited).

## Files touched

- `src/content/protocols/bpc-157-tb-500.mdx` — deleted
- `src/content/protocols/cjc-1295-ipamorelin.mdx` — deleted
- `src/content/protocols/gh-secretagogue-combinations.mdx` — deleted
- `src/content/protocols/.gitkeep` — added
- `src/lib/unpublished-protocols.ts` — added
- `src/pages/protocols/[slug].astro`
- `src/pages/protocols/index.astro`
- `src/pages/llms-full.txt.ts`
- `vercel.json`
- `astro.config.mjs`

No `BaseLayout.astro`. No lastUpdated bumps. No new URLs. No clinic-template glue (protocol templates do not link `/clinics/`).

## Commands actually run

```text
git status -sb
git ls-files src/content/protocols src/pages/protocols src/layouts/ProtocolLayout.astro
rg -n -i "bpc-157-tb-500|cjc-1295-ipamorelin|gh-secretagogue-combinations|/protocols/" src scripts astro.config.mjs vercel.json
node -e "require('./vercel.json')"  (redirects printed)
Test-Path src\content\peptides\{bpc-157,cjc-1295,ipamorelin,mk-677}.mdx
rg -n "href=.*/protocols/" src --glob "*.{astro,ts,mdx}"
rg -n "clinics/" src/layouts/ProtocolLayout.astro src/pages/protocols
```

Did **not** run `astro build` / `graph:check` (not sole occupant; conductor prefer-not). Template grep used instead.

## Check results (source, not rendered HTML)

| Check | Result |
|---|---|
| Protocol MDX remaining | **0** (`.gitkeep` only) |
| `getStaticPaths` unpublished Set | **filters all three** |
| vercel 301 destinations | existing peptide dossiers |
| Sitemap exclude | **three URLs listed** |
| hrefs to unpublished slugs in templates/content | **none** (only exclude/redirect/Set) |
| `/protocols` index cards | **0** (empty state → parent dossiers, Set-guarded) |
| `llms-full.txt` protocol section | omitted when collection empty |
| Clinic MDX leftovers in protocol templates | **none** |

Local GET of the three URLs / generated sitemap is **not** done this slice.

## Next slice (unblocked)

**W0-4 · Live CagriSema “FDA approved” post** — already rewritten on this branch; still must live-GET `main`. Then W0-5…W0-9.

## Blockers

- **Production hotfix PR** — needs a clean worktree from `origin/main`, commit, push, Lucas merge. Not this session. Live sitemap still lists these three until `main` ships the 301 + exclude.
- **WAF apply** — still Lucas.
- **TICK6-PRICE** — still blocked.
- **TICK37 KEEP** — UNCLOSED; do not Grok-stamp.
- HANDOFF T-03 also asked to extend `qa-pmids` over `src/content/protocols/` — **not done** (plan W0-3 did not list it; files are gone). Same PMID bug returns if MDX is restored without the unpublished Set.
- Live GET acceptance for W0-3 still fails until the same 301s ship on `main`.

---

# W0-4 · Live CagriSema “FDA approved” post

**Agent:** implementer (this session)
**Plan:** `.planning/master-audit-2026-09-02/CURSOR-IMPLEMENTATION-PLAN.md` · Wave 0 · **W0-4** (HANDOFF T-04 / Judge `M-LIVE-CAGRISEMA`)
**Branch:** `feat/scoring-and-freshness` (dirty). Did **not** checkout `origin/main`. Did **not** live-GET pepcodex.com.
**Commit:** none (Lucas did not ask). **Judge / KEEP:** none.
**Status:** **verified on this branch** (no MDX edit). Live URL on `main` remains **blocked on Lucas**.

## Why this slice

Prior W0-3 note claimed the branch MDX was already rewritten and only needed a live-GET on `main`. Plan: do not trust that note. Verify `src/content/blog/cagrilintide-semaglutide-approval.mdx` against the bug (FDA **has approved** + REDEFINE-1 **22.7%** + PubMed *search* URLs). Rewrite only if the branch still overclaims without a fetched approval letter.

## What changed

**No content edit.** Branch source already matches the cited-only KEEP quote. Production GET skipped (owner ship check; this session cannot checkout `main` or ship).

## Verify — target URL source (`cagrilintide-semaglutide-approval.mdx`)

Select-String counts on `src/content/blog/cagrilintide-semaglutide-approval.mdx` (2026-09-02):

| Pattern | Count |
|---|---|
| `FDA approved` / `FDA-approved` / `has approved` | **0** |
| `22.7` | **0** |
| `pubmed.ncbi.nlm.nih.gov/?` (search URLs) | **0** |

Present instead: excerpt + meta “under FDA review, not approved”; body “**CagriSema is not currently approved by the FDA or any other regulator**”; REDEFINE 1 treatment-policy **−20.4% vs −3.0%** (estimated difference −17.3 pp; 95% CI −18.1 to −16.6) with PMID **40544433** / NCT05567796; NCT06131437 design-only (no head-to-head percent; `hasResults` false). Source `url` for the trial paper is `https://pubmed.ncbi.nlm.nih.gov/40544433/` (PMID page, not a keyword search).

Sibling Cagri blogs on this branch (`cagrilintide-redefine-1-amylin-validated`, `cagrisema-nda-filed`, `cagrisema-nda-filed-glp1-amylin-combo`, `cagrisema-phase3-endpoint`): same two patterns **0 / 0**. Dossier `src/content/peptides/cagrisema.mdx` `regulatoryStatus.status: investigational`.

## Fetches this run (discovery ≠ authorship)

| Source | Result | Date |
|---|---|---|
| PubMed esummary + efetch PMID **40544433** | Garvey WT et al., *N Engl J Med* 2025 Aug 14;393(7):635-647. Title names cagrilintide + semaglutide. Treatment-policy: −20.4% CagriSema vs −3.0% placebo at week 68; n=3417; NCT05567796. Abstract does not report monotherapy percents. | 2026-09-02 |
| CT.gov v2 NCT**06131437** | Brief title CagriSema vs tirzepatide; PHASE3 INTERVENTIONAL; COMPLETED; actual enrollment **809**; `hasResults`: **false**. Design-only — no percent quoted. | 2026-09-02 |
| openFDA `drugsfda` brand_name:CagriSema | **404 NOT_FOUND** | 2026-09-02 |
| openFDA `drugsfda` generic_name:cagrilintide | **404 NOT_FOUND** | 2026-09-02 |
| openFDA `label` brand_name:CagriSema | **404 NOT_FOUND** | 2026-09-02 |
| openFDA `label` generic_name:cagrilintide | **404 NOT_FOUND** | 2026-09-02 |

No approval letter. CagriSema stays investigational. No 22.7% in the fetched abstract.

## Sibling “also live-GET” list — **this-branch source only**

Skipped production GET (blocked on Lucas). Branch MDX titles already walk back overclaim. Select-String `FDA approved|FDA-approved|has approved|EMA approved|has authori[sz]ed`:

| File | fda_ish | 22.7 | Note |
|---|---|---|---|
| `pemvidutide-eu-mash-approval.mdx` | 0 | 0 | Title is IMPACT Phase 2b, not EU approval |
| `pemvidutide-crl-more-data.mdx` | 0 | 0 | “Designations, Not Approvals” |
| `survodutide-fda-submission-mash.mdx` | 0 | 0 | Breakthrough designation, not approval |
| `wegovy-pill-launches-us.mdx` | 0 | 0 | Correction notice; does not assert US launch / 50 mg approval |
| `fda-semaglutide-shortage-extended.mdx` | 1 | 0 | Hit is “Compounded drugs are **not** FDA approved” — not an overclaim |

Did **not** edit those five files.

## Files touched

None in `src/content/**`. This append only.

## Commands actually run

```text
git branch --show-current
git status -sb
Select-String -Path src/content/blog/cagrilintide-semaglutide-approval.mdx -Pattern "FDA approved|FDA-approved|has approved"
Select-String -Path src/content/blog/cagrilintide-semaglutide-approval.mdx -Pattern "22\.7"
Select-String -Path src/content/blog/cagrilintide-semaglutide-approval.mdx -Pattern "pubmed\.ncbi\.nlm\.nih.gov/\?"
Get-ChildItem src/content/blog -Filter "*cagri*" | Select-String ...
eutils esummary + efetch PMID 40544433
clinicaltrials.gov/api/v2/studies/NCT06131437
Invoke-WebRequest api.fda.gov/drug/drugsfda.json + label.json (CagriSema, cagrilintide)
Select-String sibling W0-4 blog list
```

Did **not** curl `https://www.pepcodex.com/blog/cagrilintide-semaglutide-approval`. Did **not** run `astro build` / Quality Judge / TICK37 KEEP.

## W0-5 size check (not started)

Plan files: `src/pages/directory.astro` (5764 B), `src/pages/llms.txt.ts` (4566 B), `src/pages/llms-full.txt.ts` (4081 B), footer in `BaseLayout.astro`.

`directory.astro` still promises a “curated list of **verified** health clinics” and “**telehealth** providers” / “peptide **protocols**.” `llms-full.txt.ts` still emits “US peptide clinic finder.” `llms.txt.ts` still lists “Clinic Directory.” That is a multi-file copy + possible noindex/sitemap slice, and `BaseLayout.astro` is forbidden this session. **Not a small unblocked glue slice.** Stopped.

## Next slice (unblocked)

**W0-5 · `/directory` and `llms.txt`** — holding page with zero verified/vetted/telehealth-protocol/clinic-finder claims, **or** `noindex` + sitemap drop. Footer may keep the link (do not require a BaseLayout edit). Then W0-6…W0-9. Do not start Wave 1.

## Blockers

- **Live GET of `/blog/cagrilintide-semaglutide-approval` on production `main`** — **blocked on Lucas**. Chair GET 2026-09-02 still said FDA has approved + 22.7%. This session cannot checkout `main` or ship. Acceptance “that live URL no longer states FDA approval or 22.7%” is unmet until the same body (or a 301 to `/peptides/cagrilintide` or `/peptides/cagrisema`) is on `main`.
- **Production hotfix PR** — clean worktree from `origin/main`, commit, push, Lucas merge. Not this session. Do not merge this branch.
- **WAF apply** — still Lucas.
- **TICK37 KEEP** — UNCLOSED; do not Grok-stamp.

---

# W0-5 · `/directory` and `llms.txt`

**Agent:** implementer (this session)
**Plan:** `.planning/master-audit-2026-09-02/CURSOR-IMPLEMENTATION-PLAN.md` · Wave 0 · **W0-5** (HANDOFF T-05 / P0-4)
**Branch:** `feat/scoring-and-freshness` (dirty). Did **not** checkout `origin/main`. Did **not** live-GET pepcodex.com.
**Commit:** none (Lucas did not ask). **Judge / KEEP:** none.
**Status:** **done** (source-level). Live GET on production still **blocked on Lucas**.

## Why this slice

`/directory` was an indexable “Coming Soon” that promised verified clinics and telehealth. `llms-full.txt` advertised a “US peptide clinic finder.” W0-2 already deleted the 52 fake clinic MDX; that copy was a public lie. Plan: holding page **or** `noindex, follow` **and** sitemap drop. Did both. Footer kept `/directory`. Did not edit `BaseLayout.astro` (localhost gtag skip left intact).

## What changed

- `directory.astro`: honest holding page. `robots="noindex"` → BaseLayout emits `noindex, follow`. No verified / vetted / telehealth / Featured / “Want to be listed” / Coming Soon. Denial copy only (“not a clinic finder”). Links: `/peptides`, `/trials`, `/methodology` (no trailing slash; real routes).
- `llms.txt.ts`: removed Key Pages line `Clinic Directory: …/directory`.
- `llms-full.txt.ts`: removed `[Clinic Directory](…/directory): US peptide clinic finder`.
- `astro.config.mjs` `SITEMAP_EXCLUDE`: added `https://www.pepcodex.com/directory` (noindex alone does not save crawl budget).

Net sitemap URL: **−1**. No new clinic URLs.

## Files touched

- `src/pages/directory.astro`
- `src/pages/llms.txt.ts`
- `src/pages/llms-full.txt.ts`
- `astro.config.mjs`

No `BaseLayout.astro`. No lastUpdated bumps. No new URLs.

## Commands actually run

```text
rg -n -i "clinic finder|verified providers|telehealth directory|US peptide clinic|Clinic Directory|verified clinic|peptide clinic finder" src --glob "!src/content/cities/**" --glob "!src/content/blog/**" --glob "!src/content/glossary/**"
rg -n -i "clinic finder|verified providers|telehealth directory|US peptide clinic|Clinic Directory|verified clinic|peptide clinic finder|Want to be listed|coming soon.*clinic" src --glob "!src/content/cities/**" --glob "!src/content/blog/**" --glob "!src/content/glossary/**"
rg -n -i "clinic finder|verified providers|telehealth directory|US peptide clinic|Clinic Directory|verified clinic|peptide clinic finder|telehealth provider" src/pages/llms.txt.ts src/pages/llms-full.txt.ts src/pages/directory.astro
rg -n -i "clinic" src/pages/llms.txt.ts src/pages/llms-full.txt.ts
```

Did **not** run `astro build` / `graph:check` / Quality Judge. Did **not** curl production.

## Check results (source, not rendered HTML)

| Check | Result |
|---|---|
| `/directory` verified / vetted / telehealth / Featured | **gone** |
| `llms.txt` “Clinic Directory” | **gone** |
| `llms-full.txt` “US peptide clinic finder” | **gone** |
| `SITEMAP_EXCLUDE` `/directory` | **added** |
| `robots="noindex"` → `noindex, follow` | **set** (BaseLayout already emits follow) |
| Footer `/directory` | **kept** (no BaseLayout edit) |
| Localhost gtag skip | **untouched** |
| llms clinic-count boasts | **none** (only “Clinical Trial Tracker”) |

Leftover (not this slice): `src/content/cities/*.mdx` `metaDescription` still says “verified providers” (W0-2: template no longer renders those fields). `/clinics` index title still “Peptide Clinic Directory” (honest empty-shell copy; already noindex + sitemap-excluded).

## Next slice (unblocked)

**W0-6 · Calculators — strip dosing product** — `src/content/calculators/*.mdx`, `CalculatorLayout.astro`, reconstitution `[slug].astro`. Dilution math only, or unpublish. Do **not** add a 301 for `/calculator/reconstitution/tesamorelin` on `main`. No HowTo schema. No new calculator URLs. Then W0-7…W0-9. Do not start Wave 1.

## Blockers

- **Live GET of `/directory` and `llms.txt` on production `main`** — **blocked on Lucas**. Source is clean; pepcodex.com still serves the old finder copy until the same files ship on `main`.
- **Production hotfix PR** — clean worktree from `origin/main`, commit, push, Lucas merge. Not this session. Do not merge this branch.
- **WAF apply** — still Lucas.
- **TICK37 KEEP** — UNCLOSED; do not Grok-stamp.

