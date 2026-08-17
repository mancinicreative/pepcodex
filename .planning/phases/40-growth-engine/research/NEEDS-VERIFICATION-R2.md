# Needs verification — round 2 (blog refresh batch, 2026-08-17)

Claims removed from or left out of the refreshed blog posts because no supporting identifier
exists in `verification/ledger.json`, `UPDATE-WORKLIST.md`, or `new-findings/*.json`.
Each needs a scout pass before it can return to the site.

## Removed from posts in this batch

### retatrutide-direct-comparison.mdx
- **Claim removed:** TRIUMPH-1 (NCT05929066) efficacy results — "2,339 adults randomized
  1:1:1:1; at 80 weeks mean weight loss 19.0%, 25.9%, 28.3% across doses vs 2.2% placebo"
  and discontinuation rates "4.1% at 4 mg to 11.3% at 12 mg vs 4.9% placebo".
- **Why removed:** the retatrutide dossier (updated 2026-08-17) states a dateless PubMed
  search for the TRIUMPH trials returns only the program design paper (PMID 41090431); no
  TRIUMPH efficacy publication or registry results posting is in the verified registry.
- **What is needed:** the TRIUMPH-1 primary publication (PMID) or a ClinicalTrials.gov
  results posting for NCT05929066, verified for drug-match and estimand.

### retatrutide-triumph-4-weight-loss-pain-relief.mdx
- **Claim removed:** TRIUMPH-4 results — 28.7% weight loss at 72 weeks vs ~4% placebo,
  WOMAC pain/function/stiffness improvements, GI tolerability comparisons vs tirzepatide.
- **Why removed:** same as above — no TRIUMPH-4 publication or registry results exist in
  any allowed source. The old post's four sources were bare domain URLs with no identifiers.
- **What is needed:** TRIUMPH-4 primary publication (PMID) with estimand identified.
  Also a verified source for the background claim "knee osteoarthritis affects ~250 million
  people globally" if that figure is wanted back.

### pemvidutide-breakthrough-designation-mash.mdx
- **Claims removed:** (a) MOMENTUM described as a biopsy-confirmed MASH trial with 74%
  MASH resolution / 47% fibrosis improvement / −75% MRI-PDFF — misattributed; MOMENTUM
  (NCT05295875) is the obesity trial. (b) Cross-trial comparison table: resmetirom "~30%
  MASH resolution", semaglutide "59-63%", survodutide "62-83%". (c) Speculative regulatory
  timeline table (BLA 2028, approval 2028-2029).
- **What is needed (only if the comparison is wanted back):** verified PMIDs for
  MAESTRO-NASH (resmetirom) and ESSENCE (semaglutide MASH), with resolution rates read
  from the papers, not press releases.

### amgen-maritide-phase2.mdx
- **Claims removed:** "phase 3 enrollment in late 2025, potential approval in 2028" and
  implied Amgen guidance. Replaced with registered MARITIME trials (NCT06858839,
  NCT06858878, both in ledger) and a dated no-results statement.
- **What is needed:** nothing, unless MARITIME topline results appear — then a verified
  publication or registry posting.

## Flags outside this batch (informational — not edited by this agent)

- `src/content/blog/retatrutide-phase3-triple-agonist.mdx` (title: "Retatrutide Phase 3
  Results Confirm Triple-Agonist Superiority", 30.3% figure) and
  `src/content/blog/retatrutide-phase-3-results-2026.mdx` (UNFOUND source "TRIUMPH-4
  Phase 3" per verify-blog-sources) both assert TRIUMPH results that the retatrutide
  dossier says are unpublished as of 2026-08-17. Same fabrication class as the claims
  removed above; these posts were not in this batch's scope.
