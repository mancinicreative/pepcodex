# Council — Executor roadmap

**Seat:** Executor (implementation sequence, dual-tree ship, acceptance tests).  
**Substitution:** This packet was written by **Grok**, substituting for the GPT executor seat. It is an audit draft, not a ship ticket.  
**Date:** 2026-09-02. **Horizon:** 30 / 60 / 90 days from Monday 2026-09-07.  
**Mode:** AUDIT ONLY. No `src/` edits. No outreach. No production merge.  
**Inputs read:** audit-a findings table; audit-b findings table; audit-c §§3–8; `OUTREACH-PLAYBOOK.md` first 60 lines; templates `REPORT.md` P0s; live-recon `STATUS.txt` (branch ≠ live).

---

## Monday morning verdict

**The 90-day plan cannot be finished Monday morning.** P0 also cannot be “done” in one morning if “done” means production HTML no longer lies.

**There is a clear first step.** It can start Monday 2026-09-07 morning **if Lucas authorizes a production hotfix on `main`**. It does not require GSC, counsel, or an app-CTA copy decision. It does not require merging `feat/scoring-and-freshness`.

If Lucas is not available to ship `main`, Monday morning work is still defined: implement the same P0 diffs on this branch so they cannot be reintroduced, and prepare a **cherry-pick PR against `main`**, not a branch merge.

Do not start the week with outreach, featured-listing sales, affiliate enrollment, or “publish more.”

---

## Clear first step (Monday 09:00)

**Do not merge this branch to `main`.** Live-recon (2026-09-02): working tree `feat/scoring-and-freshness` @ `f1b91e0` is not production. Live still serves blogs and `/calculator/reconstitution/tesamorelin` that this-branch `vercel.json` 301s; live semaglutide title is **95 studies / Apr 13**, this branch **67 / Aug 17**; live orforglipron is still **investigational**; live `llms.txt` is stamped **2026-02-18**. Merging this branch as the “P0 fix” would ship a different URL set, different dossier numbers, and calculator/blog 301s onto URLs that are currently 200.

**Monday packet (both trees, same facts):**

1. **Stop the dossier spreader** (templates P0; A-004; A-005; B-002). `DossierLayout` hardcodes `fdaStatus="Not FDA Approved"`, `wadaStatus="WADA Prohibited"`, Drug JSON-LD `legalStatus="Research use only - not FDA approved for human use"`, `administrationRoute="Subcutaneous injection"`. `safetyInfo` is never passed, so `SafetyBanner` always fires “not approved for human use” / “limited human trial data.” Live `/peptides/semaglutide` already shows this contradiction in HTML + JSON-LD.
2. **Quarantine the fictional directory** (A-006, A-007; B-003; C-001–C-005, C-018). 52/52 records are `FICTIONAL_PLACEHOLDER`. Playbook hard stop: **first step is quarantine/removal, not outreach.** Do not email, call, or LinkedIn the 52 names; do not tell a nearby real clinic they are already listed.
3. **Unpublish or strip the three protocol pages** (A-001–A-003). All three are **in the live sitemap**. Human doses are attached to PMIDs that resolve to unrelated papers.

Those three items are the Monday morning sequence. Calculators, `X-Robots-Tag`, and `/directory` copy follow the same week, still before any monetization.

---

## Dual-tree rule (non-negotiable)

| Tree | What it is | P0 rule |
|---|---|---|
| Production `main` (Vercel, pepcodex.com) | Live HTML Google and humans see | Hotfix **here first**. Cherry-pick template/clinic/protocol diffs. Do not wait for this branch’s research cut. |
| `feat/scoring-and-freshness` | Grok/Hermes working copy. Not live. | Apply the **same** P0 diffs so a later merge cannot re-lie. Do not treat branch content (Foundayo, 67/76 study counts, extra blogs) as already live. |

Acceptance for any P0 item: **live GET** of the production URL **and** a local build of this branch both pass the test. Fixing only the branch leaves Ozempic labeled research-only on pepcodex.com.

---

## Sequencing law

**P0 (unsafe / deceptive / false regulatory) → P1 (unsupported claims + IA) → P2 (measurement + PepTracker CTA) → P3 (polish).**  
**Factual corrections before monetization.** Paid clinic SKUs, Featured, Verified-for-pay, lead-gen, newsletter sponsors, and any affiliate lane wait until P0 is live and P1 directory language is gone. Peptide-vendor affiliates stay **REJECT** (C-019; advertising policy).

**Hard nos (entire 90 days):**

- Do **not** send clinic outreach while listings are fictional (`OUTREACH-PLAYBOOK.md`: `DRAFT — NOT SENT`).
- Do **not** publish more URLs. Crawl budget is binding. Net URL count must not rise. Default for thin comparisons, peptide-condition shells, and duplicate `what-is-*` pairs is merge / 301 / `noindex, follow` + sitemap drop — not new pages.
- Do **not** reindex `/clinics/*`.
- Do **not** wire `HowToSchema` to reconstitution or protocol steps.
- Do **not** add `AggregateRating` from `RatingCard`.
- Do **not** bump `lastmod` / `lastUpdated` without a material edit.

---

## Day 0–7 — P0 on production `main` AND on this branch

Owner default: **Grok/Hermes** implement on this branch; **Lucas** opens/ships the `main` hotfix PR (only he pushes production). Counsel is **not** a gate on removing fiction or false FDA banners.

| ID | Work | Trees | Effort | Owner | Blocked on Lucas? | Acceptance test |
|---|---|---|---|---|---|---|
| P0-1 | Drive Drug schema + SafetyBanner + FDA/WADA badges from `regulatoryStatus` / a real `safetyInfo` object. Approved drugs must not say research-only. Unapproved must not inherit a single hardcoded string. Route must not be “Subcutaneous injection” on orals (Rybelsus, Foundayo). Prefer `Drug` JSON-LD only when `regulatoryStatus.status === 'approved'`; otherwise drop Drug or use `MedicalWebPage`. | **main + branch** | M (1d) | Grok code; Lucas ships `main` | **Ship to production** | Live GET `/peptides/semaglutide` and `/peptides/tirzepatide`: HTML has no “Not FDA Approved” / “WADA Prohibited” / “not approved by any regulatory agency”; JSON-LD `legalStatus` is not “Research use only - not FDA approved for human use”. Same strings absent on a local branch build of those slugs. Spot-check ≥3 approved + ≥3 unapproved. |
| P0-2 | Quarantine 52 clinic MDX records (delete from the build or empty the collection). Strip city FAQ body + FAQPage JSON-LD (verified/vetted, `$100–$300`, “multiple” when count is 0, BPC-157 “for tissue repair”). Remove Verified badge and Featured ribbon. Disable Call/Website on remaining cards. Keep `/clinics` `noindex, follow` **and** sitemap-excluded. | **main + branch** (live NY already matches this branch’s fiction) | M (1d) | Grok; Lucas ships | **Ship.** Legal review is a flag, not a reason to keep fiction live. | Live GET `/clinics/new-york` and `/clinics/miami`: no invented NAP, no Verified, no Featured, no FAQPage with consult prices. `example.com` clinic links = 0. `verifiedListing: true` count = 0. Graph: no new indexable clinic URLs. |
| P0-3 | Three protocol URLs (`/protocols/bpc-157-tb-500`, `/cjc-1295-ipamorelin`, `/gh-secretagogue-combinations`): drop from sitemap; `noindex, follow`; strip study tables whose PMIDs fail NCBI esummary drug-match (A-001–A-003). Prefer 301 to parent dossiers over leaving dose sentences up. | **main + branch** (all three in live sitemap) | S–M | Grok; Lucas ships | Ship | Live sitemap-0.xml no longer lists the three URLs. Live HTML of each is 301 or noindex **and** contains no `pubmed.ncbi.nlm.nih.gov/{wrong-pmid}` dose table. Re-fetch of previously cited PMIDs still domain-distant (replication test in Audit A §14). |
| P0-4 | `/directory` indexable “Coming Soon” still promises verified clinics + telehealth (A-019, B-013, C-009). Rewrite to a non-claim holding page or `noindex` + sitemap drop. Remove “US peptide clinic finder” / verified-directory lines from live `llms.txt` / `llms-full.txt`. Footer may keep a URL; it may not claim a vetted finder. | **main + branch** | S | Grok; Lucas ships | Ship | Live GET `/directory`: no “verified” / “vetted” / telehealth-protocol promise. Live `llms.txt` does not call `/directory` a clinic finder. |
| P0-5 | Reconstitution calculators: remove “desired dose (mcg)” → draw-volume (A-011, B-011). Educational dilution math without a dose-to-syringe product. Do not add more calculator URLs. Do **not** 301 live `/calculator/reconstitution/tesamorelin` from `main` until a written URL disposition exists (this-branch 301 is B-007; live is 200). | **main** = change the tool, keep the URL for now. **branch** = same UX change; **do not ship that 301 onto production this week.** | M | Grok; Lucas ships | Ship | Live tesamorelin calculator (still 200): no “desired dose” → volume output. Branch build matches. No new `/calculator/*` URLs. |
| P0-6 | Sitewide `X-Robots-Tag: index, follow` vs HTML `noindex` (B-001). Remove the blanket header or emit it only for indexable routes. Google may already prefer the meta; Bing/others and humans reading headers still see `index` on `/clinics/*`. | **main + branch** (`vercel.json` matches live) | S | Grok; Lucas ships | Ship | Live GET `/clinics/new-york` and `/glossary/autophagy`: response header is not `index, follow` (absent or `noindex, follow`). Indexable homepage still indexable. |
| P0-7 | InteractionMatrix “Generally safe to combine…” (templates). Gate or delete the sentence. | both | S | Grok | Ship | Phrase absent from live semaglutide/tirzepatide HTML. |

**Day 0–7 explicitly out of scope:** GSC re-pull (needs Lucas login; do not block P0 on it). App waitlist on homepage (needs Lucas CTA decision). Named medical reviewer (B-015; needs a real person). Foundayo label card on **production** orforglipron (content cut differs; that is Day 8–14 as a **scoped content PR**, not a branch merge). Thin-comparison 301s. Any paid listing.

**Day 0–7 exit:** Production no longer stamps FDA-approved drugs as research-only; production no longer presents fictional Verified clinics or protocol PMIDs as evidence; this branch has the same guards. Net new URLs = **0**.

---

## Day 8–30 — P1 factual repair + net URL reduction

Still no monetization. Still no outreach. Still no “publish more.”

| ID | Work | Effort | Owner | Lucas? | Acceptance |
|---|---|---|---|---|---|
| P1-1 | **URL disposition list** before any this-branch `vercel.json` 301s land on production (B-007). Live-not-in-repo: 7 blogs. Repo-not-in-live: 60 URLs (49 blog + approved-drug dossiers not on live sitemap). Decide keep-200 / 301 / noindex+sitemap-drop **per URL**. Lucas must approve production redirects. | M | Grok drafts; **Lucas signs the list** | **Yes — redirect list** | Written table. No 301 ships without a row. `graph:check` exit 0 on the branch that will deploy. |
| P1-2 | Production **orforglipron** is still investigational (A-010). Refresh **that live URL** with Foundayo facts (FDA 2026-04-01: indication, **17.2 mg max**, boxed warning, not T2D, no combo GLP-1). On this branch, **drop 12/24/36 mg quality-checklist doses** (label max 17.2). Do not invent 7.2 mg Wegovy US approval (Audit A: secondary only). | M | Grok; Lucas ships content PR | Ship + no-guess on 7.2 mg | Live `/peptides/orforglipron` states Foundayo + 17.2 mg max + boxed warning; no 36 mg “instructions.” Branch checklist matches label. |
| P1-3 | SS-31 / Forzinity: Barth-only accelerated approval qualifier (A-018). GLP-1 class safety: ileus, pulmonary aspiration, Foundayo presence; lastUpdated Jan 2026 is stale (A-014, A-021). Melanotan melanoma: not “theoretical” vs cited case reports (A-015). BPC-157: 503A/PCAC distinction on **existing** safety + guide + dossier (A-013, A-026, B-012). SURMOUNT-1 **20.9%** treatment-regimen vs live blog **22.5%** snippet (B-025) — verify PMID 35658024 then fix the **existing** blog or canonicalize to the comparison. Quality checklist eyebrow **Sourcing** (A-009). | L (batch of 10, max 3 concurrent editors, adversarial review) | Grok/Hermes editors; independent review | Ship | Each claim on the listed URLs matches a fetched label/abstract already in `sources[]` or fetched in the same increment. `qa-banned-content` + `graph:check` green. No new URLs. |
| P1-4 | **Net reduce, do not add:** 181/269 comparisons <200 words → `noindex, follow` + sitemap drop or 301 into a keeper (≥500 words, ~84). Stop peptide-condition growth (295 at depth 3). Collapse 36 `what-is-*` blog/guide pairs to **one** definition URL (301 the duplicate). Thin Khavinson dossiers 79–164 words (B-022): noindex, do not flesh out with parent-compound literature. | XL (2w) | Grok; Lucas approves disposition | **Yes — which URLs die** | Sitemap loc count **down**. `graph:check` exit 0. No depth>3. No new collection entries. Historical GSC “923 silent” is **not** the KPI until Gate 0 works. |
| P1-5 | Editorial policy vs A-001–A-003: stop claiming every PMID is claim-verified until protocols are gone (A-017). Homepage “Spring 2026” in September (B-010). Semaglutide meta “67 Studies” / “Updated Feb 2026” mismatches (B-021) — match title to the **tree being deployed**, do not copy live 95 onto this branch or branch 67 onto live without a source recount. | S–M | Grok | Ship | Policy sentence is true of remaining pages. Dates match `lastUpdated` after a material edit. |
| P1-6 | Peptide-condition template infers approval from `evidenceStrength` (templates P1). Stop. | M | Grok | Ship | 295 routes do not say “may have regulatory approval” unless `regulatoryStatus` says so. |

**Still deferred:** paid listings, Featured SKU, clinic schema redesign, telehealth, FormSubmit PHI, named author (needs a real name from Lucas).

---

## Day 31–60 — P2 measurement, consent, PepTracker CTA

P0 must already be live. P1 URL count must not be rising.

| ID | Work | Effort | Owner | Lucas? | Acceptance |
|---|---|---|---|---|---|
| P2-1 | **GSC/GA4 Gate 0.** ADC `invalid_rapt`. Lucas: Incognito, single account, Desktop OAuth client per `.planning/GOOGLE-API-SETUP.md` (~20 min). Then `npm run gsc:whoami` / `gsc:repull` / `ga4:pull` / `gsc:index`. Do not use 2026-07-25 exports as current. | S for Lucas; M for analysis | **Lucas auth**; Grok analysis | **Yes — GSC auth. Blocks all traffic claims.** | Fresh export in-repo. Bot-filtered GA4. URL Inspection on a sample of noindexed clinics, thin comparisons, and P0 URLs. |
| P2-2 | Consent Mode v2 **before** `gtag('config')`. Live homepage loads `G-1M56CNL8CK` in `<head>` with no prior `consent default denied` (B-014; live-recon §4). Vercel Analytics is ungated. `analytics.ts` events have no consent check. Cookie banner analytics toggle is ignored on “Essential Only.” | M | Grok; Lucas ships | Ship | First-load HTML: `gtag('consent','default',{analytics_storage:'denied'})` **before** config. Decline does not leave `_ga`. Vercel Analytics gated or documented as essential with policy text. |
| P2-3 | **App waitlist CTA** is the conversion path (project job; B-030; templates §7). Component exists on dossiers/safety/calculators (~142). **Absent on homepage, header/footer, blogs, comparisons.** Mount existing `AppWaitlistCTA` on `index.astro` + `BaseLayout` footer. Do not mint `/app`. Do not put clinic “Get Listed” on the home path. | S code; copy is Lucas | Grok wires; **Lucas supplies/approves CTA copy** | **Yes — app CTA.** | Live homepage has the waitlist. Beehiiv `source=peptracker_waitlist`. Event visible in GA4 **after** P2-1. Still 0 new URLs. |
| P2-4 | Privacy: name FormSubmit + Beehiiv; enable contact captcha; “do not submit medical information” on Directory Listing Request (C-010). Do not build clinic lead-gen. | S | Grok; Lucas policy dates | Ship | Privacy page names processors. `_captcha` not `false`. No PHI invite. |
| P2-5 | Organization `logo.png` 404; empty `sameAs` (B-008). Add a real logo file **or** stop emitting the URL. Instagram is in the footer. | S | Grok | Ship | `GET /logo.png` is 200 if schema cites it. |
| P2-6 | Named editor on `/about` (B-015). **Do not invent a reviewer.** | S once a name exists | Lucas | **Yes — a real person** | About names a human or stays silent. Article author may remain Organization until then. |

**Monetization in this window:** still **no**. After P2-1, the directory ROI calculator in Audit C §14 can be filled with real A (clicks to `/clinics`+`/directory`). Historical 2 clicks / 5.8 months on 61 URLs is not a business case to rebuild the directory.

---

## Day 61–90 — P3 polish; directory remains dark

| ID | Work | Effort | Owner | Lucas? | Acceptance |
|---|---|---|---|---|---|
| P3-1 | A11y: keyboard Research menu (`aria-expanded`); footer heading order; newsletter `<label>`; cookie focus trap; calculator white-on-cream contrast (templates §3). | M | Grok | Ship | Keyboard can reach Comparisons/Guides/Safety. Labels present. No white-on-paper calculator text. |
| P3-2 | Breadcrumb JSON-LD trailing slashes vs `trailingSlash: 'never'` (B-020). Homepage canonical slash vs sitemap (B-010) — pick one, don’t add a second homepage URL. | S | Grok | Ship | Breadcrumb item URLs do not 308. |
| P3-3 | Dead code: do not mount `ExitIntentPopup`; do not wire `HowToSchema`. Fix `NewsletterForm variant="compact"` (renders nothing). | S | Grok | — | Compact forms either render or the prop is a real variant. Exit-intent still 0 pages. |
| P3-4 | Refresh **existing** `/regulatory-tracker` / FDA notice with 503B proposal (2026-04-30) and 2026-02-06 compounding statement. Label proposals vs finals. PCAC July 2026 votes remain UNKNOWN unless Federal Register is fetched. | M | Grok | Ship | Dates current; no “BPC-157 now legal” framing. |
| P3-5 | **Directory rebuild is not a 90-day deliverable.** If, and only if, P0–P2 hold and counsel has reviewed the Audit C checklist: design a **new** schema (C-012) with last-checked, license, unpaid Verified, Sponsored≠Featured. Discovery of real clinics is a **new public-source pipeline**, not the 52 MDX files (C-018). Playbook stages 0→5 require human + legal sign-off **before** any send. | XL; likely beyond day 90 | Lucas + counsel | **Yes — legal + whether a directory product exists at all** | Zero outreach this quarter unless Lucas + counsel explicitly authorize stage 5. Fictional names still never contacted. |

**Cautious tests still not scheduled:** labeled newsletter sponsorship (non-vendor), display ads. Both need counsel and a public sponsor list. **REJECT:** research-chem affiliates. **DEFER:** paid enhanced clinic profiles, booking fees, telehealth SKU.

---

## What is blocked on Lucas

| Block | Why it gates | What agents may do without it |
|---|---|---|
| **Production `main` ship** | P0 on this branch does not change pepcodex.com. Only Lucas pushes live. | Implement + PR against `main`; do not self-merge. |
| **GSC / GA4 auth** | `invalid_rapt`. No current impressions, CTR, index coverage, or waitlist conversion. | Sequence P0/P1 without traffic numbers. Do not invent volumes. |
| **Legal / counsel** | FTC 16 CFR 255 + Fake Reviews Rule on Verified/Featured; FDA compounding menus; state telehealth/ads; fee-split if lead-gen; FormSubmit PHI. | **Remove fiction and false banners without waiting.** Do not sell listings, send outreach, or reindex clinics. |
| **App CTA** | Homepage PepTracker waitlist is a product decision + copy. Component already exists. | Keep dossier/safety/calculator CTAs. Do not invent an `/app` doorway. |
| **Named author/reviewer** | YMYL. Cannot be fabricated. | Leave Organization as author. |
| **URL disposition / blog 301s** | This-branch redirects kill live 200s (B-007). | Draft the list. Do not deploy those 301s on `main` until signed. |
| **7.2 mg Wegovy US approval** | Secondary news only in Audit A. | Do not state US approval until Drugs@FDA is opened. |
| **Whether Featured ever paid** | Repo has no invoices. Assume unpaid demo. | Do not invoice or sell the SKU. |

---

## Effort rollup (agent-days, not calendar)

- Day 0–7 P0: **~4–6 agent-days** + Lucas ship window. Monday morning = P0-1 start + P0-2/P0-3 scoped, not all seven rows closed.
- Day 8–30: **~10–15 agent-days** (content batches of 10 + URL disposition + graph ratchet). Lucas: redirect list + content ships.
- Day 31–60: **~5–8 agent-days** after auth. Lucas: 20 min GSC + CTA copy + privacy dates.
- Day 61–90: **~5 agent-days** polish. Directory product: **not estimated** — not in this quarter unless Lucas changes the job.

Crawl-budget KPI (once Gate 0 works): % sitemap URLs with ≥1 impression. Baseline in project files was 24.4% (Aug 2026, **stale**). Do not treat graph `silent=1111` as live indexation (B-017).

---

## Executor will not recommend

- Sending the outreach playbook, guessing `info@` emails, or using MDX descriptions as personalization.
- Contacting name-collision businesses (Alamo Peptides, Dr. GolBerg, Strong Health, Pacific Integrative Psychiatry, etc.) as if they were PepCodex listings.
- Publishing more city pages, comparisons, peptide-condition URLs, or reconstitution calculators.
- Merging `feat/scoring-and-freshness` to `main` to “get P0 live.”
- Ranking-for-pay, Verified-for-pay, or Featured without the word **Sponsored** on a real inventory.
- Using press-release estimands (22.5% SURMOUNT-1, 12.4% ATTAIN-1, 22.7% REDEFINE-1) as headlines.

---

*End of Executor packet. Implementation remains unauthorized until Lucas says to leave audit-only.*
