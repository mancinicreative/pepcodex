# Frozen Audit Inventory — PepCodex

**Status: FROZEN** at 2026-09-02T19:47:18.517Z
**Do not mutate this inventory during Audits A/B/C.** Append notes only in your own report.

Canonical machine files (same folder):

- `INVENTORY.json` — full surfaces
- `INVENTORY-COMPACT.json` — id/type/url/file/title/indexable/robots
- `INVENTORY-SUMMARY.json` — counts
- `LIVE-SITEMAP-URLS.json` — production sitemap fetched 2026-09-02
- `LIVE-PROBES.json` — selected live HTTP statuses
- `RECONCILIATION.json` — repo vs live sitemap
- `CLINIC-RECORDS.csv` — all 52 clinic data records
- `LIVE-NOT-IN-REPO.txt` / `REPO-NOT-IN-LIVE.txt`

## Totals (working tree)

| Bucket | Count |
|---|---|
| Total surfaces | 1343 |
| Indexable (repo expectation) | 1112 |
| Noindex / non-public | 231 |
| Live production sitemap URLs | 1057 |
| Intersection live ∩ repo-expected | 1050 |
| Live sitemap not in this branch | 7 (all `/blog/`) |
| Repo-expected not in live sitemap | 60 (49 blog, 10 peptides, 1 glossary) |

### By type

peptide 107 · peptide-condition 295 · comparison 269 · guide 36 · safety 31 · glossary 215 · blog 140 · protocol 3 · condition 15 · calculator 4 · city-clinic-page 60 · clinic-record 52 · trust 10 · hub 1 · index 8 · directory 2 · conversion 1 · tool 2 · category 7 · home 1 · error 1 · machine 2 · api 3 · template 32 · source-pack 46

## Material access limits (must remain visible)

1. **Working tree ≠ production.** Branch `feat/scoring-and-freshness` is explicitly not for production. Live site is `main` on Vercel. Auditors must inspect both repo files and live URLs and record mismatches. Do not assume a local file is live.
2. **Search Console / GA4 live pull blocked.** First-party current metrics UNAVAILABLE. Stale 2026-07-25 artifacts may be cited only as historical, dated, and possibly superseded.
3. **Clinic records have no standalone URLs.** They render inside noindexed `/clinics/[city]` pages. `/directory` is a "coming soon" page. `/clinics` is noindex.
4. **Private content / CMS / email / affiliate dashboards:** none in repo. UNAVAILABLE.
5. **Source-packs** (`data/source-packs/*.json`) are not public URLs but they feed dossier/trial renderers. Inspect as claim sources.
6. **Templates** can place claims on many pages. Inspect every listed template; a template claim is a multiplied finding.
7. **`src/pages/sponsors`** exists as a directory in the tree listing; read access may be restricted. Record if inaccessible.

## Required inspection (every auditor)

Specialization is a *lens*, not a skip list. Every auditor must:

1. Reconcile **100% of `surface_id`s**: `INSPECTED` | `SAMPLED` | `INACCESSIBLE` | `OMITTED` with reason.
2. Deep-read (full file + live URL if any): all trust/legal pages; homepage; `/directory`; `/clinics` index; `src/pages/clinics/[city].astro` FAQ/schema; all 52 clinic records; all 4 calculators; all 3 protocols; `/fda-notice`; `/methodology`; `/editorial-policy`; `/advertising-policy`; `/disclaimer`; `/privacy`; `/terms`; `/cookie-policy`; `/about`; `/contact`; `/newsletter`; `/regulatory-tracker`; `/trials`; BaseLayout, DossierLayout, ComparisonLayout, BlogLayout, FAQSchema, DrugSchema, OrganizationSchema, ClinicCard, FeaturedClinicCard, ExitIntentPopup, DisclaimerBanner, SafetyBanner, RatingCard.
3. Deep-read these peptide dossiers end-to-end (file + live): semaglutide, tirzepatide, retatrutide, bpc-157, tb-500, tesamorelin, semax, epithalon, melanotan-ii, pt-141, orforglipron, cagrilintide, liraglutide, mk-677, ipamorelin, ghk-cu, thymosin-alpha-1, ss-31, mots-c, sermorelin.
4. Deep-read **all 31 safety pages** and **all 36 guides**.
5. Stratified sample remaining peptides, comparisons, glossary, blog, peptide-condition, city pages: at least 20% of each type, spread across categories, including first/last alphabetically and any `noindex` / `robots: noindex` items.
6. For every remaining surface, at minimum: frontmatter title/description/dates/robots + H1 + first material claim + last material claim + schema/CTA if present. Mark these `SAMPLED` not `INSPECTED` if not fully read.
7. Open live sitemap, robots.txt, and a sample of live pages. Record status codes. Do not crawl aggressively.

Failure to inspect a surface must appear in the coverage table. Never silently skip.

## What this freeze does not prove

Inventory existence ≠ claim accuracy. Sitemap presence ≠ indexation. `verifiedListing: true` ≠ independently verified clinic. A prior QA script PASS ≠ current public-page truth.
