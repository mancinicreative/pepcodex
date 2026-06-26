# PepCodex / PepTracker — Current-State Audit & Launch-Readiness Assessment

*Date: 2026-06-26 · Branch: `feat/peptracker-rebrand` · Auditor: Claude (verified against code + build + rendered UI)*

## Verdict

The app is in **strong shape**. The PepTracker "specimen catalogue" rebrand is fully realized and
polished; the core data-hub surfaces (dossier, faceted listing, regulatory tracker, trials tracker)
are excellent and functional; the production build is **green (exit 0, 1,223 pages)**. This is a
**launchable product** that needs a focused cleanup pass — not major construction — to hit "100% usable."

The gaps are **not** about visual quality or core functionality. They cluster into: (1) a handful of
broken/stub reachable surfaces, (2) information-architecture discoverability, (3) the flagship
two-axis scoring being only partially rolled out, and (4) one genuine trust/credibility risk.

## What's done & working (verified)

- **Rebrand:** 12/12 layouts + page templates on-brand; zero leftover dark/off-brand literals on paper
  surfaces; responsive sound (tables wrapped, mobile bottom-sheet modals). Visual pass on home / dossier /
  regulatory-tracker / peptides-listing = polished and distinctive.
- **Content depth:** 102 dossiers · 279 comparisons · 215 glossary · 155 blog · 31 safety · 36 guides ·
  15 condition hubs · 52 clinics · ~30 trial packs. 100% regulatory status populated.
- **Core features working:** search (Cmd+K → `/api/peptide-search.json`, Pagefind in prod), newsletter
  (Beehiiv + honeypot), faceted peptide listing (Category/Evidence/Type + A–Z), comparisons, trials
  tracker (ClinicalTrials.gov), regulatory tracker, blog, guides, safety, glossary, clinics, contact.
- **Already live (ahead of roadmap):** Vercel Web Analytics (`@vercel/analytics` v1.6.1 firing),
  two-axis scoring rubric v2.4 + `RatingCard` + qa-scoring build gate, methodology page, cookie consent.
- **Build gate:** prebuild validators pass (SEO canonical 0 errors; scoring validator 19/102 PASS;
  validate-cross-links). `npm run build` → exit 0.

## Gaps

### A. Broken / stub reachable surfaces (launch-blocking polish)
1. **`/directory` is a "Coming Soon" stub** linked in the primary header nav (BaseLayout.astro:167 desktop,
   :256 mobile). It overlaps the fully-working `/clinics` (52 listings). Footer does NOT link it. → broken promise.
2. **Dead `href="#"` anchors** — `peptides/[peptide]/[condition].astro:290,294,299` ("On This Page" jump
   links) point nowhere. Affects the programmatic peptide×condition pages.
3. **Dead code** — `src/scripts/analytics.ts:26-47,121` still tracks removed calculators (`trackCalculators()`).

### B. Information architecture / discoverability
4. **Flagship Regulatory Tracker is orphaned from nav** — reachable only via the tracker tab on `/trials`.
   100% data-populated, distinctive, PMF-flagged differentiator, but no primary nav entry.
5. **Methodology (scoring rubric) not in primary nav** — only in footer colophon. It's the credibility
   anchor for the two-axis scores; under-surfaced.
6. **Nav slot misallocation** — a stub ("Directory") occupies a primary slot while two real differentiators
   (Regulatory, Methodology) are buried.

### C. Flagship feature partially rolled out (not broken, incomplete)
7. **Two-axis scoring: 19/102 dossiers (18.6%)** carry the new `scoring:` block; the other 83 use the legacy
   single rating (renders clean via fallback). The differentiator is mostly invisible. The listing's
   "Evidence" facet uses the older `evidenceStrength` grading, separate from the new two-axis composite.
8. **Trials coverage ~30/102** peptides have ClinicalTrials.gov packs.

### D. Trust / credibility risk — SYSTEMIC (the dominant launch blocker) ⚠️ ESCALATED 2026-06-26
9. **Citation integrity is broken across ~80 of 102 dossiers — far beyond the bioregulators.**
   A prior session's audit (`.planning/citation-audit/`, scripts `audit-citations-*.mjs`) extracted all
   977 PMID occurrences (511 unique) and cross-checked against PubMed. Findings:
   - **15 PMIDs do not resolve on PubMed at all** (8 files incl. mainstream **liraglutide**, ghk-cu, selank,
     lactoferricin, prostatilen, retinalamin, livagen, kristagen). Likely fabricated/typo'd.
   - **185 YEAR_MISMATCH flags across 78 files** — the "PMID resolves to an unrelated paper" signal.
   - 576 POSSIBLE_MISATTRIB flags (heuristic; title-overlap noise inflates this — needs case review).
   - **Independently verified 2026-06-26:** PMID 25673378 (liraglutide) + 11024860 (ghk-cu) → no PubMed
     record; PMID 23687390 (225ac, claimed "Ginj 2006 SSTR antagonist") → actually a 2012 Huntington's
     sleep paper (Kuljis D et al., PMC3655901). Same fabrication pattern as cardiogen (already fixed).
   - These render as live "view on PubMed" links, so a wrong PMID actively misleads. The build's prebuild
     gate does NOT validate that frontmatter PMIDs resolve to real/relevant papers.
   - **Implication:** for an evidence-first site, this is the #1 launch blocker — bigger than rebrand
     polish or the scoring rollout. Adding MORE evidence-graded scoring on top of an unverified citation
     base compounds the risk. Remediation data largely already gathered (findings.json/md, pubmed-meta.json).

### E. Not-yet-built growth layer (post-launch, NOT required for "usable")
- Monetization (comparison/condition CTAs, clinic partnership/featured, Pro tier, Stripe, media kit, quiz).
- Distribution (programmatic SEO, lead magnets, social, backlinks).
- **Data-hub → apps bridge** (strategic pivot): no standalone app exists yet; no "Tools" surface; the
  "apps generate revenue" model has no entry point on the site.

## Open product decisions (owner to confirm)
1. **Launch scope** — clean launch now (fix A+B+D, scoring/growth as fast-follow) vs. complete flagship
   scoring first vs. include first monetization surface.
2. **Public name** — page titles/wordmarks say **"PepCodex"** while the visual identity is **PepTracker**.
   Is the name staying PepCodex (PepTracker = visual identity only), or rebranding the name too?
3. **Directory nav slot** — repoint to `/clinics` vs. hold as future monetization surface vs. build now.
4. **Citation-audit gate** — audit/label the ~20 flagged dossiers before prod merge, or fast-follow.
