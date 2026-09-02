# Sustainable impression-growth system (Audit B)

**Audit date:** 2026-09-02  
**Owner (default):** PepCodex operator (Lucas) until roles are named on `/about`.  
**Constraint:** Crawl budget is binding. Impressions are an early indicator, not the business outcome. Do not update dates without a material change.

**GSC / GA4 status:** **LIVE PULL BLOCKED** (`invalid_rapt`). All current impression/click/CTR/index-coverage KPIs are **BASELINE UNAVAILABLE**. Historical artifacts exist (GSC pull documented 2026-07-25; SEO-AUDIT-FINDINGS.md dated **2026-07-24**). Do not treat those numbers as current.

Instrumentation required before any “growth” loop: `npm run gsc:whoami` succeeds; `npm run gsc:repull` and `npm run ga4:pull` write dated files; graph join uses those files instead of zeros.

---

## 1. Search Console query mining

| Field | Value |
|---|---|
| Owner | Operator + whoever runs `npm run gsc:repull` |
| Data source | GSC API both properties (www and apex), after ADC reauth. Setup: `.planning/GOOGLE-API-SETUP.md` |
| Cadence | Weekly once auth works; monthly query export retained |
| Alert | Auth failure (`invalid_rapt`); week-over-week **indexable URL count in sitemap** rising while **non-brand clicks** (when available) flat |
| Review | Queries that already have a URL vs queries that would require a **new** URL. Default: refresh the existing dossier/guide |
| Outcome | List of pages to refresh or merge. **Not** a list of new blogs |
| KPI | Non-brand clicks, impressions — **BASELINE UNAVAILABLE** (formula: GSC clicks where query does not contain pepcodex/brand). Target: set only after 28 days of clean data |
| Limitation | GSC query dimension is historically censored (~33% impressions in project notes, dated 2026-07). Absence in queries ≠ no demand |

---

## 2. Content-decay detection

| Field | Value |
|---|---|
| Owner | Content lead |
| Data source | GSC page report (when available) + frontmatter `lastUpdated` vs source dates |
| Cadence | Monthly |
| Alert | Page with previously non-zero clicks (once baseline exists) losing clicks while lastUpdated unchanged and a newer primary source exists |
| Review | Open the source. Decay ≠ old date. Decay = newer authoritative evidence changes the claim |
| Outcome | Rewrite, qualify, or leave dated |
| KPI | Pages past review date — define review date as `lastUpdated + volatility window` (approved drugs 90 days; research peptides 180 days; glossary generic noindex: no review). **BASELINE UNAVAILABLE** for traffic recovery |

---

## 3. Citation and broken-link monitoring

| Field | Value |
|---|---|
| Owner | Engineering + content |
| Data source | `npm run graph:check`; existing qa-citations / qa-pmids (bodies only — frontmatter PMIDs still a known hole per lessons) |
| Cadence | Every PR that touches links or templates; weekly otherwise |
| Alert | graph:check exit 1; new 404s; broken PubMed links |
| Review | Internal links must match `getStaticPaths` slugs |
| Outcome | Zero new broken internal links |
| KPI | `brokenTargets` from graph-latest.json. **Current local snapshot 2026-09-02: 0** (working-tree dist, not GSC) |

---

## 4. Regulatory and safety-alert monitoring

| Field | Value |
|---|---|
| Owner | Editor |
| Data source | FDA compounding pages, Drug Safety communications, labels, ClinicalTrials.gov |
| Cadence | Weekly scan of FDA compounding index + approved-drug labels for GLP-1s; ad hoc on news |
| Alert | Shortage list change; 503B bulks final; warning letters naming compounds on-site |
| Review | Update `/regulatory-tracker` and the affected dossier the same week. Do not mint a news URL unless the tracker cannot hold the fact |
| Outcome | Dated tracker row with official URL |
| KPI | Days from official notice to on-page date. **BASELINE UNAVAILABLE** |

---

## 5. New guideline / systematic-review monitoring

| Field | Value |
|---|---|
| Owner | Editor (discovery script, not the writer — per project sourcing rules) |
| Data source | PubMed per-alias search (do not OR aliases); existing monthly-scan pipeline |
| Cadence | Monthly |
| Alert | Implausible hit counts; papers that do not name the peptide |
| Review | Hand only filtered, named-in-abstract hits to a writer |
| Outcome | Dossier `lastUpdated` only if a claim changed |
| KPI | Dossiers updated with a real source change / month |

---

## 6. Clinic status and license re-verification

| Field | Value |
|---|---|
| Owner | Directory owner (Audit C process) |
| Data source | Clinic official websites, licensing boards — **not** `example.com` |
| Cadence | Do not run outreach in audit-only mode. Until websites are real, cadence is **paused** |
| Alert | `verifiedListing: true` while website contains `example.com` (52/52 as of 2026-09-02) |
| Review | Remove verified badge; keep `/clinics` noindex |
| Outcome | Zero verified flags on placeholder records |
| KPI | `clinic_placeholder_websites` → 0 before any reindex. **Current: 52** |

---

## 7. Refresh triggers by volatility

| Class | Trigger | Window |
|---|---|---|
| FDA-approved GLP-1 / GHRH | Label, CVOT, shortage, compounding policy | 90 days or event |
| Phase 3 investigational | Primary paper or FDA action | Event-driven |
| Research-only peptides | New human study or safety notice | 180 days |
| Comparisons retained | New head-to-head RCT | Event-driven |
| Glossary generic (noindex) | None | n/a |
| Calculators | Label reconstitution change | Event-driven |
| Trust pages | Policy change only | Event-driven |

Do not refresh lastmod on a build stamp.

---

## 8. Topic clusters (keep, don’t expand)

Connect **existing** URLs only:

- Approved GLP-1: dossiers + one comparison + brand guides (`/guide/what-is-ozempic` etc.) + regulatory tracker.
- BPC-157: dossier + safety + one guide.
- Tesamorelin: dossier + safety + one calculator (if retained).
- Methodology / editorial / about = trust cluster.

Do not add location × service × peptide doorway clusters.

---

## 9. Internal-linking rules

1. Mirror collection slugs; never `data.name` or raw file ids.  
2. No trailing slash (`trailingSlash: 'never'`).  
3. Guard `relatedPeptides` / glossary against missing slugs (render text if missing).  
4. Every retained indexable URL: inbound from a page at depth ≤2 from `/`.  
5. Do not add links to URLs slated for 301/noindex.  
6. Run `npm run graph:check` before any link/template commit.

**Current local graph 2026-09-02:** median depth 2; 0 pages depth >3; 83 low-inbound; 2 indexable unreachable (one is live-301 `/glossary/off-label`).

---

## 10. Original research / tools / datasets

Allowed without new URL sprawl:

- Trials table (`/trials`) and regulatory timeline (`/regulatory-tracker`) as living pages.  
- Graph snapshots already in `.planning/data/v2/`.  

Not allowed: more calculators, more city pages, downloadable “datasets” that duplicate PubMed.

---

## 11. Author, reviewer, methodology, correction, update transparency

| Field | Value |
|---|---|
| Owner | Operator (must supply real names) |
| Data source | `/about`, `/methodology`, `/editorial-policy` |
| Cadence | On each correction; quarterly otherwise |
| Alert | Medical claim change without a correction note |
| Review | Public dated correction list |
| Outcome | Named editor; “no medical reviewer” if none |
| KPI | Correction log entries with dates. **Current: none visible** |

---

## 12. Newsletter and professional distribution

| Field | Value |
|---|---|
| Owner | Operator |
| Data source | Beehiiv/subscribe API; GA4 `newsletter_signup` (when GA works) |
| Cadence | Existing newsletter; do not create indexable archive spam |
| Alert | Form errors; consent not recorded |
| Review | Sponsored newsletter labeled per `/advertising-policy` |
| Outcome | Waitlist tagged `peptracker_waitlist` distinct from research newsletter if both exist |
| KPI | Signups. **BASELINE UNAVAILABLE** |

---

## 13. Ethical partnership / digital PR

| Field | Value |
|---|---|
| Owner | Operator |
| Data source | `/advertising-policy` (no current sponsors listed 2026-09-02) |
| Cadence | Opportunistic |
| Alert | Partner asking to change evidence grades |
| Review | Editorial firewall already written — enforce it |
| Outcome | No paid ranking of city pages; no affiliate in dossiers |
| KPI | n/a until a partner exists |

---

## KPI dictionary (Audit B slice)

| KPI | Definition | Formula | Source | Baseline | Target | Cadence | Owner | Limitations |
|---|---|---|---|---|---|---|---|---|
| Sitemap URL count | Indexable URLs advertised | count `<url>` in sitemap-0.xml | Live sitemap | **1057** on 2026-09-02 | Down or flat until GSC shows coverage; never up without removals | Each deploy | Eng | Sitemap ≠ indexed |
| HTML noindex + header agreement | No conflicting robots | % noindex pages without `X-Robots-Tag: index` | Live headers | **0%** of sampled noindex pages (all had index header) | 100% | Each deploy | Eng | Google may still honor meta |
| Graph broken targets | Internal 404 targets | graph summary.brokenTargets | graph-latest.json | **0** (local dist 2026-09-02) | 0 | Each link PR | Eng | Local dist ≠ production |
| Low-inbound indexable | inbound ≤2 | graph | graph-latest.json | **83** | Decrease after prune | Monthly | SEO | |
| Median click depth | BFS from `/` | graph.medianDepth | graph | **2** | ≤2 | Monthly | SEO | |
| Non-brand impressions | GSC | — | GSC | **BASELINE UNAVAILABLE** | Set after 28 days | Weekly | Operator | Query dimension censored |
| Non-brand clicks | GSC | — | GSC | **BASELINE UNAVAILABLE** | Set after 28 days | Weekly | Operator | |
| CTR | clicks/impressions | — | GSC | **BASELINE UNAVAILABLE** (historical 0.31% combined 16mo **as of 2026-07-24**, not current) | — | Weekly | Operator | Historical only |
| Indexed vs sitemap | Coverage report | — | GSC | **BASELINE UNAVAILABLE** | — | Monthly | SEO | July 2026 diagnosis is historical |
| CWV LCP/INP/CLS | CrUX | — | CrUX/PSI | **BASELINE UNAVAILABLE** | — | Monthly | Eng | Not measured this audit |
| Structured-data validity | Rich Results / schema | Drug legalStatus matches visible status | Manual / test | **Fail** in this branch (hardcoded research-only) | Pass on approved drugs | Each schema change | Eng | Live HTML not fully scraped for Drug JSON-LD |
| Waitlist signups | tagged form | count | GA4/Beehiiv | **BASELINE UNAVAILABLE** | — | Weekly | Operator | Event not distinct yet |
| Placeholder clinic websites | example.com count | 52 | inventory 2026-09-02 | **52** | 0 before reindex | Until fixed | Directory | |
| Thin comparisons in sitemap | body <200 words and indexable | 181 MDX | content-signals | **181** | 0 in sitemap | After prune | Content | Word count is MDX body not rendered chrome |

Treat impressions as an early indicator. The outcome that matters for this site is **indexed useful URLs that can convert to the app**, not more URLs.
