# Needs verification — blog refresh round 1 (2026-08-17)

Claims that could NOT be supported from the allowed sources (verification/ledger.json,
UPDATE-WORKLIST.md, new-findings/*.json) during the 10-post blog refresh. Each was either
left out of the post or restated without the unverifiable specifics. A scout should verify
these against primary sources before they are (re)added.

## glp1-dementia-risk-study.mdx

- **REMOVED from post:** "UK Clinical Practice Research Datalink cohort of 543,000 patients,
  5.8-year follow-up, HR 0.65 (95% CI 0.58-0.73), 35% lower dementia hazard vs sulfonylureas,
  42% risk reduction beyond three years of use." No identifier for this study exists in the
  ledger; the post previously cited a nonexistent source key `[dementia-study-2025]`. Needed:
  the actual PMID/DOI of a CPRD GLP-1/dementia cohort matching these figures, if it exists.
- **REMOVED source entry:** frontmatter source id `pmid-36693949` pointed at PMID 34135013,
  a GLP-1/SGLT2 **COVID-19 outcomes** paper — a real identifier irrelevant to dementia
  (third integrity class: real citation, wrong subject). Removed.
- **STILL UNRESOLVED (removed, was already flagged `verified: false`):** two source stubs —
  "Liraglutide and the Treatment of Alzheimer's Disease: A Systematic Review" and
  "Neuroprotective effects of liraglutide in Alzheimer's disease models". Their stored
  identifiers resolved to different documents in an earlier audit. Needed: correct PMIDs.
- Post now relies on PMID 39833406 (Xie, Nat Med 2025, ledger-verified; abstract fetched
  live 2026-08-17 confirming the neurocognitive-disorders finding and cohort sizes).

## semaglutide-soul-cardiovascular.mdx and oral-semaglutide-cv-approval.mdx

- **Claim kept (pre-existing site canon), source still weak:** the FDA approval of oral
  semaglutide (Rybelsus) for cardiovascular risk reduction. The approval post's
  `fda-approval` regulatory source URL
  (`fda.gov/drugs/news-events-human-drugs/fda-approves-oral-semaglutide-cardiovascular-risk-reduction`)
  is not a verified press release and no openFDA record for this supplement is in the
  worklist. Needed: the Drugs@FDA/openFDA supplement record (application number, supplement
  number, approval date) for the Rybelsus CV indication, so both posts can carry an exact
  date instead of undated approval language.

## semaglutide-fails-alzheimers-evoke-trial.mdx (NOT in this batch — flagged in passing)

- The EVOKE post's four sources are all placeholder URLs (clinicaltrials.gov root,
  novonordisk.com/news, journal homepages) with no identifiers. The glp1-dementia post now
  links to it. Needed: EVOKE / EVOKE Plus NCT numbers and, if published, the results paper
  PMID.

## zepbound-sleep-apnea-approval.mdx

- **Claim kept (pre-existing):** secondary-outcome specifics (65% Epworth reduction,
  7-8 mmHg systolic BP, 18-20% weight loss) are attributed to PMID 38912654 but were not
  re-verified against the paper in this pass. Low priority — identifier is verified and
  drug-matched.
