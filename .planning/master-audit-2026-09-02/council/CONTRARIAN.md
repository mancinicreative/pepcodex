# Contrarian seat — master-audit 2026-09-02

**Seat:** Contrarian (LLM Council, audit-of-audits).  
**Model substitution:** this seat is **Grok**, not GPT-5.6-sol.  
**Date:** 2026-09-02. **Mode:** AUDIT ONLY.  
**Write path:** `.planning/master-audit-2026-09-02/council/CONTRARIAN.md` only.

Classification tags: **FACT** = stated in a named audit file, freeze file, or a repo line I opened. **INFERENCE** = my mapping. I did not re-fetch NCBI/FDA. I do not invent PMIDs; protocol PMIDs below are **Audit A’s** identifiers.

---

## Verdict

**No. The master audit must not be declared COMPLETE. It is not passing.**

INPUTS.md: “Do not claim completeness if material surfaces, databases, analytics, or private content were inaccessible.” Those inputs were inaccessible. Two of three main auditors still wrote as if the universe was closed. One of them stamped COMPLETE anyway.

This is not a “remaining polish” problem. It is a failed coverage contract plus missed multiplied P0s sitting in templates the freeze told every auditor to read.

---

## 1. Completeness they did not earn

### 1.1 The freeze contract (FACT)

`FROZEN-INVENTORY.md` required **every** auditor, not a specialist, to:

1. Reconcile 100% of 1343 `surface_id`s.  
2. Deep-read trust/legal, home, `/directory`, `/clinics`, city FAQ/schema, **all 52 clinic records**, **all 4 calculators**, **all 3 protocols**, named templates, `/fda-notice`, `/methodology`, `/editorial-policy`, `/advertising-policy`, `/disclaimer`, `/privacy`, `/terms`, `/cookie-policy`, `/about`, `/contact`, `/newsletter`, **`/regulatory-tracker`**, **`/trials`**.  
3. Deep-read **20 named dossiers end-to-end, file + live**.  
4. Deep-read **all 31 safety** and **all 36 guides**.  
5. Stratified ≥20% of remaining types.  
6. For every remaining surface: title/description/dates/robots + H1 + first and last material claim + schema/CTA.  
7. Open live sitemap/robots and sample live pages.

Specialization is a lens, not a skip list. That sentence is in the freeze. Audits B and C treated it as a skip list. Audit A treated “claim-scan” as deep-read.

### 1.2 STATUS vs REPORT (FACT)

| Packet | STATUS | What STATUS actually admits |
|---|---|---|
| Audit A | `INCOMPLETE` | 252 INSPECTED / 1091 SAMPLED; no WADA PDF; DailyMed DNS fail; GSC/GA4 blocked; no TrialTable NCT drug-match; no comparison/blog PMID resolve |
| Audit B | `INCOMPLETE` | 71/1343 INSPECTED (5.3%); named peptides 3/20; guides 1/36; safety 1/31; protocols **0/3**; clinic MDX **0/52**; templates 17/32; source-packs 0/46 |
| Audit C | **`COMPLETE`** (line 1 of `audit-c/STATUS.txt`) | 137 INSPECTED / 1206 SAMPLED; SAMPLED = inventory metadata + **grep for clinic/verified leak** |
| Templates | `COMPLETE` | Did not render pages; did not live-GET `logo.png` |
| Regulatory | `COMPLETE (with declared gaps)` | Retraction scan not run; PCAC votes UNKNOWN; DailyMed DNS fail |
| Live-recon | probed 29 URLs | Did not recrawl 1057 sitemap locs; no JS consent runtime |

**FACT:** C’s COMPLETE is false against the freeze. C’s own `COVERAGE.json` note says remaining surfaces were **not** an end-to-end claim audit. Freeze item 6 still applied. Grep is not H1 + first/last claim + schema/CTA.

**FACT:** A and B STATUS files say INCOMPLETE. Their REPORTS still ship ranked P0s, recommended sequences, and “bottom line for the lead” language that a Judge can launder into a passing master report.

**INFERENCE:** If the council votes COMPLETE from these packets, it is rubber-stamping STATUS theater.

### 1.3 Coverage stamps are inflated (FACT)

Audit A `COVERAGE.json` marks **every** safety and guide `INSPECTED` with the identical note: “Full file opened **or claim-scanned**; high-risk pages deep-read.” The REPORT says the opposite of a full read: GLP-1/BPC/TB-500/melanotan/retatrutide full; **claim-scan of the rest** of 31 safety; **one** guide (`what-is-bpc-157`) full; claim-scan of the other 35. That is not freeze item 4. That is a bulk `INSPECTED` stamp on a skim.

A’s required-peptide notes say “file **and/or** live URL.” Freeze said file **+** live. A’s own live-probe list is seven URLs. Named-20 live GETs in A: semaglutide, bpc-157, orforglipron. **Seventeen required dossiers were not live-fetched by the medical auditor.**

A marked `TOOL-1248` `/regulatory-tracker` and `TOOL-1251` `/trials` **SAMPLED**, not INSPECTED. Freeze listed both as required deep-reads.

Audit B `COVERAGE.json` marks those same two tools **INSPECTED** (“full or substantial file/live read”). B’s REPORT deep-read list does **not** include `/regulatory-tracker` or `/trials`. **INFERENCE:** B’s machine table awarded INSPECTED to pages the narrative never inspected.

A `SOURCE-PACK-1298` note: “title/H1/first+last claim reviewed.” Source-packs are JSON. They have no H1. **FACT:** coverage notes were generator-templated. They are not a reading log.

All three auditors report `INACCESSIBLE: 0` / `OMITTED: 0`. INPUTS.md lists GSC/GA4 as STALE / LIVE PULL BLOCKED, private CMS/affiliate dashboards UNAVAILABLE, working tree ≠ production. They gamed the taxonomy: blocked databases are “access limits, not surface_ids,” so the coverage table looks closed. INPUTS forbids claiming completeness in that state anyway.

### 1.4 Production was not the audit corpus (FACT)

Freeze item 1: working tree ≠ production. HEAD `f1b91e0` is “Not for production.”

Live-recon (2026-09-02): live semaglutide title **95** studies vs branch **67**; live tirzepatide **42** vs branch **76**; live `llms.txt` stamped **2026-02-18**; tesamorelin calculator **200** on production while this-branch `vercel.json` would **301** it; seven live-sitemap blogs not in this branch (`LIVE-NOT-IN-REPO.txt`).

A’s strongest protocol findings (`A-001`–`A-003`) are file-based. Those three URLs **are in the live sitemap** (`LIVE-SITEMAP-URLS.json` lines for `/protocols/bpc-157-tb-500`, `/protocols/cjc-1295-ipamorelin`, `/protocols/gh-secretagogue-combinations`). A’s live-probe list does **not** include them. B inspected **0/3** protocol bodies. C grepped them. **Nobody GET’d the live protocol HTML.** The CRITICAL medical finding was not confirmed on production.

Seven production-only blogs were not body-audited. One title was probed. That is not a live-site evidence audit.

---

## 2. Fatal auditor errors

### Audit A — medical seat that under-sampled the known failure classes

Caught real CRITICAL file issues on protocols, Drug/SafetyBanner hardcodes, clinic placeholders. Then stopped where this repo’s own lessons say fabrication lives.

**FACT (A REPORT §13):** Khavinson bioregulator cluster “was not re-resolved PMID-by-PMID.” Lessons already record cardiogen-class fake PMIDs and adjacent-compound citations (cerluten/stamakort/suprefort/svetinorm/ventfort: zero PubMed records naming them). B-022 only counts words (79–164) on nine thin dossiers. Word count is not a PMID audit.

**FACT:** 46 source-packs are remaining_not_line_by_line in A. Freeze: they “feed dossier/trial renderers. Inspect as claim sources.” A did not drug-match live TrialTable NCTs (STATUS). Lessons: fabricated NCT is worse than a fake PMID once the renderer linkifies `NCT########`. Declaring a medical evidence audit without walking source-packs is the 2026-07-24 failure, repeated.

**FACT:** A-004 lists WADA 2026 S0/S2/Monitoring facts as supporting sources. A EVIDENCE-LEDGER `E-009` status is **PARTIALLY SUPPORTED**; “Official PDF was not opened”; GLP-1 monitoring from “independent sports sites.” A then used that stack to justify a CRITICAL finding that live semaglutide is falsely labeled **WADA Prohibited**. The live banner contradiction is FACT (`E-010`). The WADA taxonomy A asserts is **not** primary-sourced in this increment.

**FACT:** DailyMed DNS failed; boxed-warning wording on A-014 is PARTIALLY SUPPORTED (`E-008`). A still wrote label percentages and pulmonary-aspiration omissions as HIGH findings. Direction may be right. The evidence grade is not what the severity implies.

**INFERENCE:** A’s 26 findings are a high-severity sample, not a medical audit of 107 dossiers + 295 peptide-condition pages + 269 comparisons + 140 blogs.

### Audit B — SEO seat that failed the freeze, then prescribed URL surgery without current GSC

**FACT:** 5.3% INSPECTED. Protocols 0. Clinics 0 line-read. Safety 1. Guides 1. Named peptides 3 (and one of those is pancragen, not even on the freeze named-20 list as a substitute for the 17 unread).

**FACT:** B REPORT lists P0s as `B-002, B-003, B-011, B-012, B-025`. B-025 in `FINDINGS.json` is `PRELIMINARY FINDING`, `PARTIALLY SUPPORTED`, confidence medium, “did not re-open the NEJM PDF,” recommended `EXPERT REVIEW REQUIRED`. Elevating a SERP snippet to P0 is malpractice.

Worse: B REPORT SERP table says `/blog/semaglutide-vs-tirzepatide-2026` is “live, **not in this branch’s expected sitemap**.” `REPO-NOT-IN-LIVE.txt` **contains that URL**. The file **is** in this branch’s inventory. It is **absent from the live sitemap freeze**. B contradicted the freeze in the same finding used as P0. Live-recon did not GET that URL. **INFERENCE:** B audited Google’s snippet cache, not production HTML.

**FACT:** INPUTS: do not treat 2026-07-25 GSC numbers as current. B still concludes “index bloat … is the binding SEO constraint” from historical crawl-budget notes plus 181 sub-200-word comparisons. B-017 correctly says local `silent=1111` is missing GSC join. The major conclusion in §14 ignores B-017.

B listed the peptide-condition **template** as deep-read and still missed the invented-approval sentence (below). That is not a scope miss. That is a read miss.

### Audit C — directory seat that told the truth about clinics, then declared the whole audit done

Clinic work is the strongest packet: 52/52 `example.com`, 50 `verifiedListing: true`, 11/52 web-searched with no match, city FAQ lies, Featured unlabeled. Keep that.

**FACT:** C STATUS `COMPLETE` while 1206 surfaces are grep-sampled. Freeze forbade that skip.

**FACT:** C stamped **52/52** `FICTIONAL_PLACEHOLDER`. Placeholder websites/phones are FACT (`INVENTORY-SUMMARY.json`: 52 placeholder websites, 10 placeholder phones). Independent “no matching business” is FACT for the **11** named in C REPORT §5. The other **41** are pattern inference (same generator). C wrote it as a closed status for all 52. Close, not earned.

C did not deep-read DossierLayout, DrugSchema, protocols, calculators, or the 20 named peptides. Those were not optional.

### Templates / regulatory / live-recon — specialist packs, not a master pass

Templates found the two biggest remaining multiplied defects (peptide-condition approval inference; InteractionMatrix “safe”). Regulatory found orforglipron dossier **has no** “boxed”/“thyroid”/“MEN” string and Foundayo **does**. Live-recon proved live Drug `legalStatus` on semaglutide and ghost comparison FAQ JSON-LD.

Those packs do **not** fill A/B/C holes. Regulatory STATUS: retraction scan **not** run. Live-recon: 29 URLs, not 1057.

---

## 3. P0s they missed or under-ranked

P0 here = live or multiplied false medical/regulatory/safety/credential claim, or a known fabrication class left untested.

### P0-M1 — Peptide-condition pages invent approval from evidence grade ×295

**FACT (repo):** `src/pages/peptides/[peptide]/[condition].astro` L275:

`{name} {high|moderate ? 'may have' : 'has not received'} regulatory approval for some indications but should only be used under qualified medical supervision.`

That is not `regulatoryStatus`. Moderate-evidence research peptides are told they “may have” approval. Templates pack: P1, ×295. **A FINDINGS: absent. B FINDINGS: absent** (B-005 is depth/thinness only). **C: absent.**

**INFERENCE:** This is worse than another city FAQ. These URLs are **indexable** (inventory: 295 peptide-condition). Clinic pages are noindex. The auditors P0’d the noindexed lie and slept on the indexable one.

### P0-M2 — “Generally safe to combine” on dossiers

**FACT:** `InteractionMatrix.astro` L61: “Generally safe to combine based on known mechanisms” for every `compatible` row. Templates recorded it. A/B/C did not file it. Banned-content / medical-advice adjacent, multiplied on peptide pages. Not a P2 copy niggle.

### P0-M3 — Comparison FAQPage schema with no on-page FAQ

**FACT (live-recon §3 Page D):** `/compare/tirzepatide-vs-semaglutide` emits FAQ JSON-LD; after stripping scripts those questions are **absent** from visible body. ComparisonLayout emits FAQSchema and does not render a FAQ section. Invisible medical Q&A for machines. A sampled comparisons and did not file this. B counted templated FAQ strings, not schema-vs-DOM.

### P0-M4 — Live protocol URLs never fetched

**FACT:** three protocol URLs in live sitemap. A-001–A-003 CRITICAL on working-tree PMIDs (A’s esummary URLs are in `EVIDENCE-LEDGER.json`; I do not restate those PMIDs as my verification). No live GET. If production HTML still linkifies those IDs — likely, given other template matches — the live site is serving the fabrication class. **Unverified** is not “fine.” It is an open P0.

### P0-M5 — Source-packs + Khavinson left on the floor

**FACT:** 46/46 source-packs SAMPLED by A/B/C. 0 INSPECTED by B. A remaining list includes the entire SOURCE-PACK-* series. Khavinson PMIDs not re-resolved (A §13). This repo has already shipped unrelated-paper PMIDs and adjacent-compound citations that **pass identifier gates**. An evidence audit that does not re-open that class cannot pass.

### P0-M6 — Foundayo dossier missing boxed warning (branch file)

**FACT (regulatory pack):** `orforglipron.mdx` grep: no “boxed”, “thyroid”, or “MEN”. FDA press 2026-04-01: Foundayo boxed warning for thyroid C-cell tumors / MTC / MEN2. A-010 flags live investigational + 36 mg checklist vs 17.2 mg. A did **not** file “approved-drug dossier contains zero boxed-warning strings.” YMYL product page without the boxed warning is P0, not an “opportunity.”

### P0-M7 — Editorial policy vs fabricated citations, ranked HIGH

**FACT:** A-017: editorial policy claims every PMID is verified to represent the claim; falsified by A-001–A-003. Severity **HIGH**. That is a site-wide trust representation. FTC Health Products guidance (regulatory pack): disclaimers do not cure a false claim. Under-ranked.

### P0-M8 — Access-Control-Allow-Origin: * on live HTML

**FACT (live-recon):** `Access-Control-Allow-Origin: *` on homepage, semaglutide, compare, clinics/new-york. This-branch `vercel.json` does not set it. Project lessons: never `*` in production. A/B/C FINDINGS: absent. Not medical, still a production P0 the technical auditor was supposed to own.

### P0-M9 — Production-only and title-debt blogs

**FACT:** 7 live-sitemap blogs not in this branch: unread as bodies. Regulatory: `pemvidutide-eu-mash-approval`, `pemvidutide-crl-more-data`, `survodutide-fda-submission-mash` filenames/titles imply approval/CRL/submission; bodies (as read there) do not. Indexable YMYL URLs. A/B did not file as P0.

### P0-M10 — B-025 is not a P0 they found; it is a P0 they invented as complete

See §2. Do not let the Judge carry 22.5% as an audited live-page fact. Classification: **PRELIMINARY** in B’s own JSON.

### Under-ranked but caught (do not pretend these were missed)

False Drug `legalStatus` + Not FDA Approved + WADA Prohibited on live semaglutide: **caught** (A-004, B-002, templates, live-recon). Clinic Verified fiction: **caught** (A-006/A-007, B-003, C-001/C-002). Reconstitution “desired dose”: **caught** (A-011, B-011). These do not make the audit pass. They show the auditors could see a template lie when it was on the named list, then failed the next template over.

---

## 4. What “passing COMPLETE” would have required and still does not exist

1. GSC/GA4 reauth, or an explicit **BASELINE UNAVAILABLE — audit cannot close on SEO/conversion**.  
2. Official WADA 2026 PDF + Drugs@FDA/label PDFs (not search-indexed DailyMed).  
3. Live GET of all 20 named dossiers **and** the 3 sitemap protocol URLs **and** the 7 LIVE-NOT-IN-REPO blogs.  
4. Source-pack NCT/PMID drug-match + Khavinson PMID re-resolve.  
5. Peptide-condition + InteractionMatrix + Comparison FAQ schema filed as multiplied findings by the medical and SEO seats, not only the templates pack.  
6. Coverage tables that use INSPECTED for line-read files only; claim-scan = SAMPLED; blocked databases = INACCESSIBLE.  
7. C STATUS rewritten off COMPLETE.  
8. No master “pass” while production ≠ branch.

Until then the honest roll-up is: **partial, high-signal, incomplete, not passing.**

---

## 5. Direct answers

**Should the master audit be declared COMPLETE and passing?**  
No.

**Fatal auditor errors?**  
Coverage inflation (A INSPECTED=claim-scan; B INSPECTED on unread tools; C COMPLETE on grep). Freeze skip-list. Protocol CRITICAL without live GET. WADA/DailyMed PARTIAL used as CRITICAL support. B-025 P0 from a snippet, with a sitemap-membership error. Known fabrication classes (source-packs, Khavinson) not re-opened. INACCESSIBLE: 0 while GSC/GA4/DailyMed/WADA/production SHA were blocked.

**Where did they claim completeness they did not earn?**  
`audit-c/STATUS.txt` line 1 COMPLETE. A COVERAGE INSPECTED on 31 safety + 36 guides. B COVERAGE INSPECTED on `/regulatory-tracker` and `/trials`. All three: 0 INACCESSIBLE. Templates/regulatory COMPLETE are pack-scoped; they must not be promoted to master COMPLETE.

**Which P0s did they miss?**  
P0-M1 through P0-M9 above. The indexable 295-page approval invention and the untested fabrication classes are the ones that make a “pass” indefensible.

Do not ship a passing master report from this pile.
