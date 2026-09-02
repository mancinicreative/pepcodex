# PepCodex audit handoff — task list

**Give this file to whoever implements.** Full evidence packet is in the same folder; this file is the work order.

| | |
|---|---|
| Audit date | 2026-09-02 |
| Verdict | `INCOMPLETE` · Council **FAIL 80/100** · P0 facts still true |
| GSC/GA4 | **Pulled 2026-09-02** — www only. 171 clicks / 47,722 impr (2026-05-28–08-31). Apex still missing. See [FIRST-PARTY-DATA.md](FIRST-PARTY-DATA.md) |
| Live | https://www.pepcodex.com (`main` on Vercel) |
| Do not ship from | `feat/scoring-and-freshness` — cherry-pick P0 onto `main` |
| Mode until Lucas says otherwise | No outreach, no affiliates, no new URLs, no merge of this branch |

**Job of the site:** cited research library. Conversion = PepTracker waitlist. The clinic directory is demo data in production clothing. Do not grow it.

**Search, in one line:** comparisons + homepage earn the clicks; glossary + desktop generic queries eat impressions; 3 clicks already hit **fake clinic pages**; 65% of the sitemap has never impressed. Do not add URLs.

---

## Rules (do not skip)

1. **Hotfix `main` first.** Fixing only this branch leaves Ozempic labeled research-only on pepcodex.com.
2. **Do not merge this branch to `main`.** Live ≠ this tree (semaglutide 95 vs 67 studies; live orforglipron still Investigational; live tesamorelin calculator 200 while this branch 301s it).
3. **Acceptance = live GET + local build** of the same strings. One tree is not done.
4. **Net URL count must not rise.** Default is 301 / noindex + sitemap drop / delete from build.
5. **Do not bump `lastUpdated` / sitemap lastmod** unless the claim actually changed.
6. **Do not send clinic outreach.** Playbook is `audit-c/OUTREACH-PLAYBOOK.md` — `DRAFT — NOT SENT`. The 52 names are fictional; nearby real clinics have different legal names.
7. **Do not reindex `/clinics`.** Keep `noindex, follow` and sitemap-excluded.
8. **Do not wire `HowToSchema` or `AggregateRating`.**
9. **Do not flatten indication-specific approvals** (Forzinity = Barth only; Tesamorelin = HIV lipodystrophy; Vyleesi = HSDD in premenopausal women; Foundayo = weight management, not T2D).
10. **qa-pmids does not walk `src/content/protocols/`.** Extend the gate or the same PMID bug returns.

**Approved-dossier spot-check set (must not say research-only):** semaglutide, tirzepatide, liraglutide, tesamorelin, pt-141, orforglipron (Foundayo — **live page is still Investigational**), ss-31 (Forzinity, Barth-only).

**Unapproved spot-check set (must not inherit a generic “FDA Approved” chip):** bpc-157, tb-500, retatrutide, melanotan-ii.

---

## Hard nos (entire quarter)

- [ ] Merge `feat/scoring-and-freshness` → `main` as the P0 fix
- [ ] Email / call / LinkedIn the 52 clinic MDX names
- [ ] Research-chem or peptide-vendor affiliates
- [ ] New city pages, comparisons, peptide-condition URLs, or calculators
- [ ] “BPC-157 now legal” / “FDA approved peptides” posts
- [ ] Reindex `/clinics/*`
- [ ] Sell Featured / Verified
- [ ] State Wegovy 7.2 mg US approval until Drugs@FDA is opened
- [ ] Use press-release headlines as facts: SURMOUNT-1 **22.5%**, ATTAIN-1 **12.4%**, REDEFINE-1 **22.7%** (project lessons: treatment-regimen **20.9% / 11.2% / 20.4%**)

---

## Wave 0 — this week (P0)

Ship on **`main`**. Apply the same guards on this branch so a later merge cannot re-lie.

Lucas must push production. Agents may open a cherry-pick PR against `main`; they may not self-merge.

### T-01 · Stop the dossier rubber stamp

**Why:** Live `/peptides/semaglutide` shows **FDA Approved** next to **Not FDA Approved**, **WADA Prohibited**, “not approved for human use by any regulatory agency,” and Drug JSON-LD `legalStatus: "Research use only - not FDA approved for human use"` + `administrationRoute: "Subcutaneous injection"` (false for Rybelsus / Foundayo). WADA 2026 Monitoring Program lists markers of semaglutide and tirzepatide — **not prohibited**. S0 names BPC-157.

**Files**
- `src/layouts/DossierLayout.astro` (hardcoded `fdaStatus`, `wadaStatus`, DrugSchema props ~L427–436 and ~L582–587)
- `src/components/SafetyBanner.astro` (defaults fire because `safetyInfo` is never passed)
- `src/components/SEO/DrugSchema.astro`
- `src/pages/peptides/[slug].astro` (does not pass `safetyInfo`)
- `src/content/peptides/*.mdx` `regulatoryStatus` (source of truth)

**Do**
- Drive banner + JSON-LD from `regulatoryStatus`.
- Emit `Drug` only when `status === 'approved'`. Otherwise MedicalWebPage / no false `legalStatus`.
- Do not hardcode subcutaneous. Do not stamp WADA Prohibited on GLP-1s.
- SS-31: if you show FDA Approved, it must stay **Barth syndrome only** (Forzinity, NDA 215244, 2025-09-19).

**Done when**
- [ ] Live GET `/peptides/semaglutide` and `/peptides/tirzepatide`: those four false strings are gone from HTML and JSON-LD
- [ ] Same on a local build of this branch
- [ ] Spot-check ≥3 approved + ≥3 unapproved dossiers

**IDs:** A-004, A-005, B-002, templates P0, `M-REG-HARDCODE`

---

### T-02 · Quarantine the fake directory

**Why:** 52/52 clinic websites are `example.com`. 52/52 phones are 555. 50 `verifiedListing: true`. Live `/clinics/new-york` and `/clinics/miami` show Verified + Featured. City FAQ (×60) says listings were vetted, BPC-157 is “for tissue repair,” consults are `$100–$300`. If `cityClinics.length === 0` the copy still says **“multiple”** (12 cities, including Anaheim).

**Files**
- `src/content/clinics/*.mdx` (52)
- `src/pages/clinics/[city].astro` FAQ + FAQSchema ~L47–67, L339–349
- `src/pages/clinics/index.astro` (“verified” / “vetted”)
- `src/components/ClinicCard.astro` Verified badge
- `src/components/FeaturedClinicCard.astro` Featured ribbon
- Keep `/clinics` `robots="noindex"` and sitemap exclude in `astro.config.mjs`

**Do**
- Remove clinic records from the build (delete collection or empty it).
- Strip FAQ body + FAQPage JSON-LD.
- Remove Verified / Featured UI.
- Disable Call / Website on any leftover cards.
- Do **not** use these files as a prospect list.

**Done when**
- [ ] Live GET `/clinics/new-york` and `/clinics/miami`: no invented NAP, no Verified, no Featured, no $100–$300 FAQ
- [ ] `verifiedListing: true` count = 0; `example.com` clinic links = 0
- [ ] No new indexable clinic URLs

**IDs:** A-006, A-007, B-003, C-001–C-005

GSC 2026-09-02: **16 clinic URLs still have impressions (330) and 3 clicks** (Miami, Nashville, New Orleans) despite HTML noindex. Fix `X-Robots-Tag` in T-07 in the same ship.

---

### T-03 · Unpublish the three protocol pages

**Why:** Human doses are attached to PubMed IDs NCBI resolved on 2026-09-02 to unrelated papers. All three URLs are in the **live sitemap**. `ProtocolLayout` links `pubmed.ncbi.nlm.nih.gov/${pmid}`.

| URL | File | NCBI (do not re-cite as stored) |
|---|---|---|
| `/protocols/bpc-157-tb-500` | `src/content/protocols/bpc-157-tb-500.mdx` | **5/7 unrelated**, 30915550 = Gwyer 2019 review (not Sikiric 2018 animal), **25415472 Chang 2014 is correct**. PMID **7521621** is Laudico 1994 Philippine cancer-pain, stored as a BPC-157 human RCT 0.2–2.0 mg/day. |
| `/protocols/cjc-1295-ipamorelin` | `src/content/protocols/cjc-1295-ipamorelin.mdx` | Keep only **16352683** Teichman and **9849822** Raun after stripping `dosesUsed`. **16352684** is Morley vitamin D (sequential ID). |
| `/protocols/gh-secretagogue-combinations` | `src/content/protocols/gh-secretagogue-combinations.mdx` | Keep **9849822** Raun and **18981485** Nass. Remainder unrelated (trypanosome, IOL, NMDA, tamoxifen analog, etc.). |

**Do:** drop from sitemap; `noindex, follow`; prefer 301 to parent dossiers over leaving dose tables up. Extend `qa-pmids` to this collection.

**Done when**
- [ ] Live `sitemap-0.xml` does not list the three URLs
- [ ] Live HTML is 301 or noindex **and** has no dose table pointing at the wrong PMIDs

**IDs:** A-001–A-003 (`M-A001` count revision: not “6/7 unrelated”)

---

### T-04 · Kill the live CagriSema “FDA approved” post

**Why:** Chair GET 2026-09-02 of https://www.pepcodex.com/blog/cagrilintide-semaglutide-approval still says the FDA **has approved** CagriSema and quotes REDEFINE-1 **22.7%**. Citations are PubMed *search* URLs. This branch’s MDX (`src/content/blog/cagrilintide-semaglutide-approval.mdx`) was already rewritten 2026-09-02 to “under FDA review, not approved” + **20.4%** (PMID 40544433). Novo filed an NDA 2025-12-18. CagriSema is **not** on the FDA 2026 novel-drug table through 2026-08-28. Remaining review outcome = UNKNOWN.

**Do on `main`:** unpublish, 301 to `/peptides/cagrilintide` or `/peptides/cagrisema` if that dossier exists, or noindex + sitemap drop + replace body. Do not ship this branch’s whole blog tree.

**Also live-GET these titles before claiming the class is clean** (do not guess bodies):
- `/blog/pemvidutide-eu-mash-approval`
- `/blog/pemvidutide-crl-more-data`
- `/blog/survodutide-fda-submission-mash`
- `/blog/wegovy-pill-launches-us`
- `/blog/fda-semaglutide-shortage-extended`

**Done when**
- [ ] Live GET of the CagriSema URL no longer states FDA approval or 22.7% as a published headline
- [ ] No PubMed keyword-search “sources”

**IDs:** Judge `M-LIVE-CAGRISEMA` (missed by A/B/C FINDINGS)

---

### T-05 · `/directory` and `llms.txt` must stop promising a verified finder

**Files:** `src/pages/directory.astro`, `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`, footer links in `BaseLayout.astro`

**Do:** rewrite to a non-claim holding page **or** `noindex` + sitemap drop. Footer may keep the URL. It may not say verified / vetted / telehealth protocols.

**Done when**
- [ ] Live GET `/directory`: no verified/vetted/telehealth-protocol promise
- [ ] Live `llms.txt` does not describe a US clinic finder

**IDs:** A-019, B-013, C-009

---

### T-06 · Reconstitution calculators — strip dosing product

**Files:** `src/content/calculators/*.mdx`, `src/layouts/CalculatorLayout.astro`, `src/pages/calculator/reconstitution/[slug].astro`

**Do:** remove “desired dose (mcg)” → draw volume. Dilution math only, or unpublish. **Do not 301 live `/calculator/reconstitution/tesamorelin` this week** (this-branch 301; live is 200). No new calculator URLs. No HowTo schema.

**Done when**
- [ ] Live tesamorelin calculator (still 200): no desired-dose → syringe output
- [ ] Branch UX matches; no new `/calculator/*`

**IDs:** A-011, B-011 (REMOVE vs QUALIFY → default = strip the dose product)

---

### T-07 · `X-Robots-Tag` vs HTML noindex

**File:** `vercel.json` headers `/(.*)` → `X-Robots-Tag: index, follow`

**Do:** remove the blanket header, or emit `noindex, follow` only on routes that are noindex.

**Done when**
- [ ] `curl -sI` live `/clinics/new-york` and `/glossary/autophagy`: header is absent or `noindex, follow`
- [ ] Homepage still indexable

**IDs:** B-001

---

### T-08 · Two more template lies

**Files**
- `src/components/InteractionMatrix.astro` — delete “Generally safe to combine based on known mechanisms”
- `src/pages/peptides/[peptide]/[condition].astro` ~L273–276 — stop inferring approval from `evidenceStrength` (×295 pages)

**Done when**
- [ ] Phrase absent from live semaglutide/tirzepatide HTML
- [ ] Peptide-condition pages do not say “may have regulatory approval” unless `regulatoryStatus` says so

**IDs:** templates P0/P1, A-023 class

---

### T-09 · Sourcing / dosing checklist copy

**Why:** Quality checklist eyebrow **Sourcing**; orforglipron checklist still “Clear dosing instructions (12mg, 24mg, or 36mg)” vs Foundayo max **17.2 mg**. Editorial policy bans sourcing and dosing. Live orforglipron is still Investigational.

**Files:** `src/layouts/DossierLayout.astro` quality section; `src/components/QualityChecklist.astro`; `src/content/peptides/orforglipron.mdx`

**Done when**
- [ ] No purchasing-guidance / mg-by-week “instructions” on live orforglipron
- [ ] Sourcing eyebrow gone or renamed to something that is not a buy guide

**IDs:** A-009, A-010

---

**Wave 0 exit:** Production no longer stamps approved drugs as research-only; no fictional Verified clinics; no wrong-PMID dose tables; no live “FDA approved CagriSema.” This branch has the same guards. **Net new URLs = 0.**

---

## Wave 1 — days 8–30 (P1)

Still no monetization. Still no outreach. Still no publish-more.

Lucas must **sign a URL disposition list** before any this-branch `vercel.json` 301 lands on production (7 live-not-in-repo blogs; 60 repo-not-in-live URLs).

| ID | Task | Files / notes | Done when |
|---|---|---|---|
| T-10 | **URL disposition table** (keep-200 / 301 / noindex+sitemap-drop). Lucas signs. | `vercel.json`, live sitemap vs `RECONCILIATION.json` | No 301 ships without a row. `graph:check` exit 0 |
| T-11 | Production **orforglipron** Foundayo card: indication, **17.2 mg max**, boxed warning, not T2D, no combo GLP-1. Scoped content PR on `main`, not a branch merge | Live `/peptides/orforglipron`; FDA press 2026-04-01 NDA 220934 | Live page states Foundayo + 17.2 mg + boxed warning; no 36 mg instructions |
| T-12 | Content batch (sets of 10, max 3 concurrent, adversarial review): SS-31 Barth-only **meta**; GLP-1 class safety (ileus, pulmonary aspiration, Foundayo) `src/content/safety/glp1-safety-overview.mdx` lastUpdated Jan 2026; melanotan melanoma not “theoretical”; BPC-157 503A/PCAC on **existing** dossier + safety + guide (withdrawal ≠ listing ≠ legal); SURMOUNT-1 22.5% on live `/blog/semaglutide-vs-tirzepatide-2026` — verify PMID 35658024 then fix or 301 to `/compare/tirzepatide-vs-semaglutide`; BPC-157 meta “no human trials yet” vs `sources.human: 2` | Do not invent 7.2 mg Wegovy US approval | Each claim matches a fetched label/abstract. `qa-banned-content` + `graph:check` green. No new URLs |
| T-12b | **Snippet pass on existing URLs only** (mobile-first titles): `/peptides/ghk-cu` (2,437 impr / 4 clicks), `dsip` (2,347/4), `tb-500` (2,335/1), `retatrutide` (1,425/1, pos 6.8), `bpc-157` (578/1, pos 9.1), `cagrilintide` (397/0, pos 8.2), `tesamorelin` (232/0, pos 7.6), `orforglipron` (54/0, pos 8.5 — Foundayo). Do not add blogs for `what are peptides` (pos ~60). | GSC 2026-09-02 | Title/meta match visible H1; no stronger claim than body; no new URLs |
| T-13 | **Net reduce, but protect click winners.** ~179/269 thin comparisons → noindex+sitemap drop or 301. **Do not 301** URLs that already click: `/compare/cagrilintide-vs-survodutide` (10 clicks), `follistatin-vs-igf-1-lr3`, `na-semax-amidate-vs-selank`, `ovagen-vs-svetinorm`, `thymogen-vs-vilon`, `vilon-vs-vladonix`, `5-amino-1mq-vs-slu-pp-332`. Collapse 36 blog/guide twins. Stop peptide-condition growth. Generic glossary: keep/expand noindex (`safety-profile` has 725 impr / 1 click). | GSC: `/compare` = 72 clicks; `/glossary` = 19,667 impr / 9 clicks; 686/1057 sitemap URLs have 0 GSC rows | Sitemap loc count **down**. Click-winning compare URLs still 200. `graph:check` exit 0 |
| T-14 | Editorial policy: stop claiming every PMID is claim-verified until protocols are gone (`src/pages/editorial-policy.astro`). Homepage “Spring 2026” (`src/pages/index.astro`). Semaglutide title/date: match the **tree being deployed**, do not copy live 95 onto this branch | | Policy sentence is true of remaining pages |
| T-15 | Extend `scripts/qa-pmids.mjs` (and friends) to `src/content/protocols/` | Known hole | Gate fails if a protocol PMID title does not match |

---

## Wave 2 — days 31–60 (P2)

P0 must already be live. URL count must not be rising.

| ID | Task | Blocked on Lucas? | Done when |
|---|---|---|---|
| T-16 | **www GSC+GA4 already pulled 2026-09-02.** Remaining: add info@pepcodex.com as Full on apex/`sc-domain:pepcodex.com` if that property exists, then `node scripts/fetch-search-data.mjs --gsc`. Weekly: `npm run fetch:search`. Filter GA4 to exclude Singapore + localhost. | Apex property access | Apex export in `.planning/data/` or documented “no apex property” |
| T-17 | Consent Mode **before** `gtag('config')` in `src/layouts/BaseLayout.astro`. Gate Vercel Analytics. `src/scripts/analytics.ts` must respect consent. “Essential Only” must not leave `_ga` | Ship | First-load HTML: `gtag('consent','default',{analytics_storage:'denied'})` before config |
| T-18 | Mount existing `AppWaitlistCTA` on homepage + footer. Do not mint `/app`. Do not put clinic “Get Listed” on the home path | **Yes — CTA copy** | Live homepage has waitlist. 0 new URLs |
| T-19 | Privacy: name FormSubmit + Beehiiv; contact captcha; “do not submit medical information” | Ship | Privacy names processors |
| T-20 | Organization schema: add real `public/logo.png` **or** stop citing it. Fill `sameAs` from footer Instagram | Ship | `GET /logo.png` is 200 if schema cites it |
| T-21 | Named human on `/about` — **do not invent** | **Yes — a real person** | About names a human or stays silent |

---

## Wave 3 — days 61–90 (P3)

Directory stays dark. No outreach unless Lucas + counsel explicitly authorize.

| ID | Task | Done when |
|---|---|---|
| T-22 | A11y: keyboard Research menu; newsletter `<label>`; calculator contrast | Keyboard reaches Comparisons/Guides/Safety |
| T-23 | Breadcrumb JSON-LD trailing slashes vs `trailingSlash: 'never'` | Breadcrumb URLs do not 308 |
| T-24 | Do **not** mount `ExitIntentPopup`. Fix `NewsletterForm variant="compact"` (currently renders nothing) | Compact forms work or the prop is valid |
| T-25 | Refresh **existing** `/regulatory-tracker` + `/fda-notice`: 503B proposal (2026-04-30) is a **proposal**; PCAC July 2026 votes = UNKNOWN unless minutes are fetched. BPC-157/TB-500/Melanotan II = FDA **nominated-but-withdrawn** (page current 2026-04-22), **not** live Category 2. Live Category 2 still includes GHRP-2/6 (503B), ibutamoren, ipamorelin acetate (503B), kisspeptin-10 (503A) | No “now legal” framing |

Paid listings / newsletter sponsors: only after Wave 0 is live-clean and counsel signs `audit-c/PAID-LISTING-MODEL.md`. Verified is never for sale. Vendor affiliates stay **REJECT** (`audit-c/AFFILIATE-MATRIX.md`).

---

## Blocked on Lucas (agents cannot close these)

| Block | Why | Agents may still |
|---|---|---|
| Push `main` | Only Lucas ships production | Open a cherry-pick PR |
| GSC/GA4 ADC | `invalid_rapt` | Sequence P0/P1 with no traffic numbers |
| Counsel | FTC Verified/Featured; compounding menus; fee-split; PHI | **Remove fiction and false banners without waiting** |
| App CTA copy | Homepage waitlist is a product decision | Keep existing dossier/safety/calculator CTAs |
| Named reviewer | Cannot fabricate YMYL expertise | Leave Organization as author |
| Redirect list | This-branch 301s kill live 200s | Draft the table, do not deploy on `main` |
| Directory product | Whether a real directory exists at all | Keep `/clinics` dark |

---

## Evidence if a task is disputed

| Need | File |
|---|---|
| Full 23-section report | `FINAL-REPORT.md` |
| Judge dispositions | `council/DISPOSITIONS.json` |
| Score / auto-fail | `council/SCORECARD.md` |
| NCBI PMID table | `council/DISSENT-LOG.md` |
| Dual-tree 30/60/90 | `council/EXECUTOR.md` |
| Clinic verification | `audit-c/CLINIC-VERIFICATION.json` · `CLINIC-RECORDS.csv` |
| Outreach (do not send) | `audit-c/OUTREACH-PLAYBOOK.md` |
| Affiliate verdicts | `audit-c/AFFILIATE-MATRIX.md` |
| Template multipliers | `templates/SPREADER-CLAIMS.json` |
| FDA pack | `regulatory/REPORT.md` |
| Live vs branch | `live-recon/REPORT.md` · `RECONCILIATION.json` |
| Packet map | `INDEX.md` |

Audit status remains **`INCOMPLETE`**. Closing Wave 0 on production does not make the audit complete; it does make the live site stop lying about the facts we already proved.
