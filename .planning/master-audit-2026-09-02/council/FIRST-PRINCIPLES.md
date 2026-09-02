# Council — First Principles

**Seat:** First Principles (audit-of-audits).  
**Model:** Grok (xAI) substituting for Opus 5. This is not an Opus 5 opinion.  
**Date:** 2026-09-02  
**Mode:** AUDIT ONLY. No implementation. No invented metrics.  
**Freeze:** `feat/scoring-and-freshness` @ `f1b91e0`. Live site `https://www.pepcodex.com`.

The surface question is whether Audits A, B, and C finished. That is the wrong question. A finished packet that optimizes a library that still lies is a worse outcome than an incomplete packet that names the lie.

---

## 0. What this seat read

Required inputs, all opened:

- `.planning/master-audit-2026-09-02/INPUTS.md`
- `Agents.md`
- `.planning/STATE.md` (first 80 lines; later ledger/history used only as context, not as current GSC)
- `audit-a/REPORT.md` (full) + `STATUS.txt` (header)
- `audit-b/REPORT.md` sections 1–7 (plus the later “recommended sequence” only to judge whether B quietly re-centers SEO)
- `audit-c/REPORT.md` sections 1–9 (plus §13 quarantine order, because C’s product verdict lives there)
- Live policy pages in this tree: `src/pages/advertising-policy.astro`, `editorial-policy.astro`, plus `about.astro`, `methodology.astro`, `disclaimer.astro`, `fda-notice.astro`, `terms.astro`, `directory.astro`, homepage `index.astro`
- Frozen counts: `INVENTORY-SUMMARY.json`

Not treated as current performance: July 2026 GSC/GA4 figures. INPUTS and STATE both mark live ADC as `invalid_rapt`. Historical conversion notes in STATE (impressions → clicks; app CTAs on site: 0) are dated artifacts, not this audit’s measurements. This seat does not replace them.

A and B STATUS files say INCOMPLETE. C STATUS says COMPLETE for the clinic/directory slice. Coverage is therefore mixed. Do not claim the three audits jointly inspected 1,343 bodies line by line. They did not.

---

## 1. What problem is PepCodex actually solving?

Not “rank for peptide keywords.” Not “list clinics.” Not “be a compounding marketplace.”

The site’s own sentences, in this tree, define a **research library**:

- INPUTS audience line: “Evidence-based peptide research library. Comprehensive dossiers with citations, not advice.”
- About: synthesize peer-reviewed work into readable dossiers; every claim cited; uncertainty acknowledged.
- Methodology: do **not** provide medical advice, dosing protocols, or sourcing information.
- Editorial policy: exclude dosing, sourcing, personal medical advice, unsubstantiated claims, and content that could facilitate misuse. Accuracy standard: every cited source exists **and accurately represents the claim**.
- Advertising policy: no peptide-vendor ads; no dosing ads; no pay-for-play; sponsors have zero influence on grades; current sponsors = none (January 2026 page).
- Terms (June 2026): educational summaries and primary-source links. Explicitly **not** medical advice, dosing, sourcing, or “any form of healthcare services.” PepTracker is named as a **separate** local-first tracking app.

The portfolio job in `Agents.md` is narrower still: **maintenance of that library, plus a real CTA toward the app.** Crawl budget is a constraint on how the library is published, not a second product.

So the actual problem is:

> A reader who will be sold peptides, protocols, and “verified clinics” everywhere else on the internet needs one place that will not invent a paper, invent a clinic, or stamp an approved drug as research-only.

That is a truth product. Traffic is a distribution problem for that product. PepTracker is a downstream conversion product that only deserves the click if the page that sent it was honest.

Anything that makes the library faster, larger, or more “commercial” while the page is still false is not growth. It is amplification of harm.

---

## 2. What is the actual product? (library vs directory vs app funnel)

Three things are shipped. Only one is the product.

### 2.1 The research library — the real product

Frozen inventory: 107 peptide dossiers, 31 safety files, 36 guides, 269 comparisons, 215 glossary terms, 140 blog posts, 46 source-packs, plus trust pages and methodology. Homepage CTA goes to `/peptides` and `/methodology`, not clinics. That split is the product.

The library is YMYL. Its unit of value is **a claim a reader can check**. Identifier well-formedness is not that unit. STATE can report a full identifier ledger and the site can still attach a human dose to a trypanosome paper. Audit A did that check on the three `/protocols/*` pages (A-001–A-003). Editorial policy’s “every PMID represents the claim” sentence is false on those pages (A-017). Methodology’s “we do not provide dosing protocols” sentence is false on those pages and on the reconstitution calculators (A-011, B-011).

A library that cites the wrong paper is not a thin-content SEO problem. It is a counterfeit of the thing the brand promised.

### 2.2 The clinic directory — not a product

Audit C’s product assessment is the correct first-principles answer: **No. It is not a directory.** 52/52 records `FICTIONAL_PLACEHOLDER`; 52 `example.com` sites; 50 `verifiedListing: true`; 3 “Featured Partners”; 60 city pages whose shared FAQ says “verified” and “vetted,” including 12 cities with zero listings that still say “multiple.” `/directory` is indexable “Coming Soon” that still promises a curated verified list and telehealth. `/clinics` is live HTML with `noindex, follow` and sitemap exclusion.

Terms say the site does not provide healthcare services. The directory copy does. Advertising policy lists no sponsors and forbids pay-for-play; the clinic UI still sells Featured Listing Options. About forbids sourcing; city FAQs treat BPC-157 / CJC-1295 / ipamorelin as a typical menu and tell readers to look for FDA-registered compounders.

Deindex was a crawl-budget move. It did not make the HTML true. Direct visitors still load fiction wearing a green check.

A useful directory would require real NAP, a written verification protocol with a last-checked date, license jurisdiction, labeled paid placement, and a correction path. PepCodex has none of that machinery (Audit C §10). Building it would be a **new company**, not a fix to this one.

### 2.3 The app funnel — conversion, not the site

PepTracker is the intended owned-product conversion (Phase 40 brief; Agents.md; Audit A §9; Audit C §3). Waitlist CTAs exist in this branch (B-030). Current conversion is **unmeasured** (GSC/GA4 blocked). Historical planning notes said app CTAs on site were 0; that figure is not re-measured here.

The app is allowed to track user-entered doses. The **website** is not allowed to prescribe them. Calculators that take “desired dose (mcg)” and return draw volume, and protocol pages that invent human RCT doses, are the site impersonating the app — and impersonating a clinician.

**Verdict on identity:** PepCodex.com is a **research library whose business job is a truthful handoff to PepTracker**. The clinic directory is leftover demo data in production clothing. Treating all three as coequal “surfaces to grow” is how the product dissolves.

---

## 3. Did these audits address reader safety and truth first?

**On their strongest findings: yes. On their opportunity packets: not reliably.**

### Audit A (medical evidence) — the right lens

A named the failures that falsify the library:

| Class | Why it is first-principles, not SEO |
|---|---|
| A-001–A-003 | Human doses glued to unrelated PMIDs. Live PubMed links. Banned content **and** fabrication. |
| A-004 / A-005 | Every dossier stamped “Not FDA Approved” + “WADA Prohibited”; SafetyBanner defaults fire because `safetyInfo` is never passed. Live on approved GLP-1s. |
| A-006 / A-007 | Placeholder clinics marked Verified; city FAQ schema multiplied ×60. |
| A-009 | “Quality checklist” labeled **Sourcing** on research-chemical vials. Policy forbids this. |
| A-011 | Reconstitution calculators as dose tools. |
| A-014 / A-015 | Boxed warning reduced; melanoma called “theoretical” against cited case reports. |
| A-017 | Editorial policy claiming PMID-to-claim verification — falsified by the protocol pages. |

A’s “new information” list is correctly **no new URLs**: Foundayo label card, WADA split table, 503A vs compounding, estimand footnotes, Barth-only Forzinity, pulmonary aspiration. That is how a library updates.

A’s weakest call is calling homepage BPC-157/TB-500-beside-Ozempic a prominence judgment (A-024). For this seat it is product identity: the catalogue’s “specimens” teach the reader that unapproved recovery peptides and approved metabolic drugs are the same kind of object. That is how a library becomes a grey-market storefront without selling a vial.

### Audit B (SEO/IA) — right sequence, wrong center of gravity

B’s P0 list (B-002 Drug schema, B-003 city FAQ/verified fiction, B-011 calculators, B-012 BPC meta vs `sources.human: 2`, B-025 estimand snippet) is safety-shaped. Recommended sequence step 1 is “fix Drug schema and city FAQ/verified placeholders (safety).” That is correct.

Then B reverts to being an SEO auditor, which is its job — and that is where first principles must veto:

- The major conclusion in B §14 is that **index bloat is the binding SEO constraint**. Crawl budget is binding for *indexing*. It is not binding for *whether a reader is lied to*. A noindexed fake clinic still lies. A thin comparison that 301s away still had a false Drug schema on the keepers.
- 181/269 comparisons <200 words, 295 peptide-condition URLs, 36 blog/guide slug twins, 9 dossiers at 79–164 words: these are real IA defects. They are second. A smaller site that still stamps Ozempic “research use only” is a more efficient falsehood.
- B correctly refuses new reconstitution calculators and new city URLs. Keep those refusals.

B STATUS is INCOMPLETE on 17/20 named peptides, 35/36 guides, 30/31 safety files, and 0/3 protocol bodies. B must not be used as the medical-evidence record. It did not read the protocol PMIDs. A did.

### Audit C (directory / trust / affiliates) — correct “this is not a product”

C’s independent 11-clinic web sample, 0 independently confirmed, prestige-address fiction, FTC/FDA flags, and “Verified is a lie” are the right kind of work. C also noticed the policy hole: advertising and editorial pages do not mention clinic listings, Featured, Verified, or lead-gen, while the UI already sells Featured.

Where C drifts: it still drafts a future marketplace (paid-listing model, outreach playbook, affiliate matrix, “ethical free vs paid”). Even labeled DEFER / DRAFT — NOT SENT, those artifacts answer “how do we become a clinic directory later?” First principles answer: **we don’t, not as this company, not before the library is true, and maybe not after.** A post-trust directory is a different product with HIPAA-adjacent leads, state clinic-advertising law, fee-split risk, and a verification ops burden this repo does not have. Writing the SKU makes the next session treat “rebuild directory” as remaining work.

---

## 4. Which audit recommendations would make the product worse?

Worse = more likely to (a) lie to a reader, (b) facilitate misuse, (c) split the product into a marketplace the Terms already disclaim, or (d) spend the only scarce editorial attention on growth while the promise is still false.

### 4.1 Do not do these (would make the product worse)

1. **Reindex or grow `/clinics` / city pages** (implicit growth reading of any “directory opportunity”). B and C already say no. Restate as a veto: 60 doorway-shaped URLs plus 52 fictional records are not a local-pack asset. They are a consumer-protection defect.
2. **Sell Featured / founding-partner clinic SKUs, lead-gen, booking fees, or telehealth listings** on this inventory — or on a “cleaned” inventory that has not yet passed a written, dated, unpaid verification protocol. C’s DEFER is not cautious enough if anyone reads PAID-LISTING-MODEL as a roadmap. First-principles verdict: **REJECT as a PepCodex.com product**, not defer. PepTracker remains the conversion.
3. **Outreach to the 52 names** (C’s playbook is labeled not-sent; keep it that way). They are not leads. Some strings collide with real nearby businesses. Contacting them would manufacture a relationship that does not exist.
4. **Peptide-vendor / research-chem affiliates.** C REJECT, advertising policy ban, INPUTS park, FDA compounding reality. Adding buy-links would invert the library into a store. Permanent reject, not a Gate D1 maybe.
5. **More reconstitution calculators, syringe presets, or “desired dose” UX** to compete with peptidecalcs / peppal / pepzilla. B said do not build more. First principles: the existing four already contradict editorial exclusions. Competing in that SERP is competing to give banned content.
6. **Publish more URLs** as a growth answer (Phase 40 original instinct; crawl-budget documents already killed it). Also: do not mint a new “GLP-1 comparison hub” URL if the job is to stop pairwise shells. Consolidation must net-reduce, not add a hub and keep the shells.
7. **Ship `feat/scoring-and-freshness` as if it were live.** A: production semaglutide 95 sources / 13 Apr 2026 vs working tree 67 / 17 Aug 2026; live orforglipron still investigational while the branch records Foundayo. Two dossiers under one URL is not “freshness.” It is a fork of the truth. Hardcoded FDA/WADA banners are on **both**.
8. **Treat identifier-ledger 100% as proof the library is true.** Editorial policy currently claims automated PMID/DOI/NCT existence checks **plus** claim-representation. The first can pass while the second fails (lessons already record this class: real papers about adjacent compounds; wrong-trial PMIDs; protocol IDs that resolve to the wrong science). A growth engine that “converts the verified corpus” (Phase 40 PRD) will convert the remaining lies faster.
9. **Execute B’s blog/guide collapse and 181-comparison 301s as an SEO batch without an A-class claim pass on the keepers.** Lucas already cancelled a 35-post retirement (STATE: “don’t delete a third of the blog — fix all”). First principles agrees that **fattening both twins** is also worse: two answers to one question is how estimands diverge. The product-preserving move is one canonical definition URL **after** the surviving text is true — not a URL-count raid that 301s a corrected page onto a still-false twin, and not dual-fattening. Word-count ≥500 is not a truth test (B’s ~84 “keepers”).
10. **noindex-as-enough for thin Khavinson dossiers (B-022) without asking whether the remaining text still presents parent-compound or adjacent-compound papers as support.** noindex does not save crawl budget (project rule) and does not un-teach a false citation. If a dossier cannot name its subject in the literature, the honest product is a dated “no primary literature found” on an existing URL, or removal — not a quieter false page.
11. **Newsletter / display “CAUTIOUS TEST” sponsorships (C §11) before the library’s stamps and protocols are fixed.** There are no current sponsors. Opening the commercial door while Featured already exists as unlabeled rank and Verified is a lie teaches the next partner that the firewall is copy, not operations.
12. **App waitlist CTAs on calculators that still output draw volume.** Conversion of unsafe intent is not the portfolio job. A CTA on a dossier that has stopped lying is.

### 4.2 Recommendations that look like growth but are actually library work (keep)

These do **not** make the product worse, provided they land on **existing** URLs and do not add vendor/clinic SKUs:

- Foundayo (orforglipron) label facts: indication, max dose, boxed warning, not a T2D approval (A).
- WADA 2026 split cited from the List, not blogs (A).
- 503A / Category 2 / PCAC distinction on existing BPC and FDA-notice pages — as qualification, never as “now legal” (A, B).
- Estimand footnotes extended to remaining press-release figures (A; B-025 still preliminary).
- Barth-only Forzinity qualifier on SS-31 (A).
- Perioperative pulmonary aspiration on the existing GLP-1 class safety page (A).
- Stop peptide-condition URL **growth**; fold unique payload into dossiers (B).
- Fix snippets that contradict the page (B-012, B-021, YAML-leaked descriptions).
- Named human editor/reviewer on `/about` — supplied by the owner, never invented (B-015).
- Remove sitewide `X-Robots-Tag: index, follow` conflict with HTML noindex (B-001) — a crawler-honesty fix, not a traffic play.
- Quarantine/removal of the 52 clinic MDX records and “verified” language in city metas, FAQs, `/directory`, llms files (C). Deletion is the clinic-ops step. Not email.

---

## 5. What should be done first — regardless of SEO

Order is ethical, then legal-truth, then product-narrowing, then measurement. Crawl budget and GSC re-auth do not move item 1.

### First: stop the live, multiplied lies

These are user-facing on production HTML or in the branch that is being treated as the working copy. They do not need impression data.

1. **Drug schema + dossier banners (A-004, A-005, B-002).** Stop hardcoding “Not FDA Approved,” “WADA Prohibited,” “research use only,” and `administrationRoute: Subcutaneous` on every peptide. Approved drugs must not carry research-only JSON-LD. SafetyBanner must not fire defaults because `safetyInfo` was never passed. This is one template bug multiplied across the catalogue — the cheapest harm reduction in the whole audit.
2. **Unpublish or gut `/protocols/*` (A-001–A-003).** Three pages. Human doses. Wrong PMIDs that resolve to oncology, parasitology, ophthalmology, fermentation. Editorial policy forbids dosing. Terms forbid dosing. These pages are not “thin.” They are the opposite of the product. Do not 301 them onto a guide that still contains a stack protocol. Take them down or replace with a non-dosing evidence summary whose citations have been opened.
3. **Quarantine clinic fiction (A-006, A-007, B-003, C entire).** Remove or replace the 52 records; stop rendering Verified/Featured; stop city FAQ schema; rewrite `/directory` so it does not promise a verified telehealth list. Keep noindex **and** stay out of the sitemap. Do not reindex as a victory lap.
4. **Stop the sourcing/dosing tools the policy already banned (A-009, A-011, B-011).** Quality checklist labeled Sourcing; reconstitution “desired dose.” Either remove the dose math from the public site or reduce the calculators to manufacturer-label reconstitution for named approved products (tesamorelin/Egrifta is the example B already noted) with no “desired dose” field. Research-vial arithmetic is facilitation of misuse.

### Second: make the remaining library match the labels

5. **Do not merge the working tree over live as a freshness deploy** until orforglipron/Foundayo, semaglutide source-count/date, and the hardcoded banners are reconciled. Two truths under one URL is worse than a stale page.
6. **Safety pages that understate labeled risk** (A-014 boxed warning / nausea / omitted pulmonary aspiration; A-015 melanotan melanoma “theoretical”; A-018 SS-31 “approved” without Barth-only accelerated-approval/surrogate qualifier; A-021 class page last updated January 2026 with Foundayo absent). These are existing URLs.
7. **Rewrite the editorial-policy accuracy paragraph** only after the protocol/schema/clinic defects are gone — or strike the sentence now. A policy that claims every PMID represents the claim, while three protocol pages prove otherwise, is itself a trust defect (A-017). Same for advertising policy vs Featured CTAs: either remove the sales UI or list what is actually for sale. “Current sponsors: none” plus a Featured ribbon is a contradiction.
8. **Named person.** YMYL library with Article author = Organization and no reviewer (B-015) is a gap. Fill with a real editor. Do not generate author URLs.

### Third: then crawl budget, then measurement, then app CTA

9. **Net-reduce only after the keepers are true.** Peptide-condition freeze, one definition URL per `what-is-*` pair, thin comparison shells — yes, as URL arithmetic, **after** steps 1–4. Owner constraint: do not silently execute the cancelled 35-post retirement. First-principles constraint: do not differentiate both halves into two slightly different medical pages.
10. **Re-auth GSC/GA4 (owner).** Required to know whether thin URLs earn human clicks. Not required to know that fake PMIDs and fake clinics are wrong. Do not wait on `invalid_rapt` to take down A-001.
11. **App waitlist on honest dossier/methodology surfaces**, not on dose calculators, not on clinic pages. Measurement after analytics works (B-030). No indexable `/app` doorway (B).

LEGAL REVIEW (C’s checklist) belongs after quarantine, not as a precondition to delete demo data. Deleting `example.com` listings is not healthcare advertising. Selling them would be.

---

## 6. What the audits did *not* settle (do not fill with guesses)

- Current impressions, clicks, CTR, index coverage, CWV, contrast: **BASELINE UNAVAILABLE**.
- Official WADA 2026 PDF not opened by A; GLP-1 “monitored not prohibited” is PARTIALLY SUPPORTED.
- DailyMed direct fetch failed in A; boxed-warning quotes are PARTIALLY SUPPORTED.
- Whether any of the 52 clinic names were ever intended as production, or whether Featured was ever paid: unknown. C: assume unpaid demo unless finance evidence appears. This seat agrees. Do not outreach to find out.
- Production vs branch for Drug JSON-LD on every live dossier: B verified the template in-repo; live peptide probes were not a full `legalStatus` scrape of all 107. A reports the false banners on live semaglutide. Replication: unauthenticated view-source of `/peptides/semaglutide` for both the visible stamps and JSON-LD.
- Khavinson cluster: A sampled, did not re-resolve PMID-by-PMID in this increment. Prior lessons say adjacent-compound citation is a live integrity class that identifier gates miss. Assume the class until disproven, do not “publish more bioregulators.”
- Comparisons: 269 bibliographies not PMID-resolved (A blind spot). Folding them for SEO without that pass can preserve wrong numbers on the 84 “keepers.”

None of these unknowns block items 1–4 in §5.

---

## 7. Falsifiers

This seat’s major conclusion — **the product is a research library, the directory is not a product, and safety/truth repairs on existing URLs come before any SEO or monetization recommendation** — would be falsified if:

- The live site’s primary user job, as shown by **current** first-party behavior (not July 2026 notes), were “find a clinic” or “calculate a research-vial dose,” **and** the owner restated the Terms/About/Editorial exclusions. That would mean the policies are the fiction. Today the policies and the homepage CTAs still point at the catalogue. The directory is the fiction.
- NCBI esummary on 2026-09-02 mapped protocol PMIDs to the stored titles (A already considers this unlikely; titles are domain-distant). Replication: re-fetch the same IDs; `ecitmatch` on stored author/year/journal.
- Production HTML no longer contains the hardcoded “Not FDA Approved” / “research use only” strings (B’s falsification test). A says a second unauthenticated fetch of `/peptides/semaglutide` still did.
- Independent public records showed the 52 clinics to be real operating practices with matching NAP. C’s 11-sample and IANA/NANPA fingerprints say the opposite.

---

## 8. Verdict

Audits A, B, and C produced usable packets. They did not, together, “finish” the job of protecting the reader. A and the P0 slices of B/C did the first-principles work: **the catalogue currently mislabels approved drugs, teaches doses from the wrong papers, inspects research vials, and badges fictional clinics as verified.** That is the product failure.

The rest of the packets — impression systems, comparison-keeper word counts, founding-partner SKUs, outreach drafts, cautious ad tests — are how a council would accidentally reconvene as a growth team.

**Actual product:** research library (citations, grades, regulatory status) with a later, honest PepTracker handoff.  
**Not the product:** clinic directory, compounding access narrative, reconstitution-as-a-service, affiliate pharmacy.  
**Do first, SEO or not:** fix multiplied template falsehoods; take down fabricated protocol doses; delete clinic fiction and “Verified”; stop sourcing/dosing tools. Then tell the truth on the URLs that remain. Then cut URLs. Then measure. Then convert.

Do not publish more. Do not reindex clinics. Do not sell Featured. Do not wait for Search Console to know that a fake PMID is fake.

---

*End of First Principles seat. Grok substituting for Opus 5. Write path: `.planning/master-audit-2026-09-02/council/FIRST-PRINCIPLES.md` only.*
