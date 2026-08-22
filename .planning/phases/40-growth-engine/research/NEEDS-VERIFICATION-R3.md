# Needs verification — round 3 (blog refresh batch, 2026-08-17)

Claims removed from or left out of the refreshed blog posts because no supporting identifier
exists in `verification/ledger.json`, `UPDATE-WORKLIST.md`, or `new-findings/*.json`.
Each needs a scout pass before it can return to the site.

## Removed from posts in this batch

### retatrutide-phase3-triple-agonist.mdx
- **Claims removed:** TRIUMPH-1 topline results — "28.3% / 25.9% / 19.0% mean weight loss
  vs 2.2% placebo at 80 weeks; n=2,339; ≥25/30/35% threshold rates; nausea/diarrhea/
  constipation/vomiting percentages; discontinuation 4.1-11.3%; 30.3% at 104 weeks in a
  BMI≥35 extension". Also the PR Newswire press-release source asserting these figures.
- **Why removed:** the retatrutide dossier (updated 2026-08-17) records no published TRIUMPH
  efficacy or safety results in PubMed or on ClinicalTrials.gov; the figures traced only to a
  press release, not to any verifiable identifier.
- **What is needed:** the TRIUMPH-1 primary publication (PMID) or a registry results posting
  for NCT05929066, verified for drug-match and estimand (treatment-regimen figure to lead).

### retatrutide-phase-3-results-2026.mdx
- **Claim removed:** "TRIUMPH-4: 28.7% mean weight loss at 68 weeks, 71.2 lbs average,
  WOMAC pain/function improvements — the first published phase 3 data."
- **Why removed:** no TRIUMPH-4 publication or registry results exist in any allowed source;
  PMID 41090431 (which the old post used for these results) is the program *design* paper.
- **What is needed:** TRIUMPH-4 primary publication (PMID) with estimand identified.
- **Also corrected without a flag:** phase 2a MASLD figures restated to the dossier's verified
  values (81-82% relative liver-fat reduction at 24 weeks; 79-86% normalization) — the old
  post said 48 weeks and 89-93%.

### semaglutide-fails-alzheimers-evoke-trial.mdx
- **Claim retained but downgraded, needs a source:** "EVOKE and EVOKE Plus did not meet
  their primary endpoints (CDR-SB); numerical trends favored semaglutide on some measures."
  Currently attributed to the sponsor's topline announcement with a dated verification note;
  effect sizes are deliberately not reported.
- **What is needed:** (a) the Novo Nordisk EVOKE topline announcement (news/press, with
  date) and (b) the primary EVOKE/EVOKE Plus publication (PMID) when it appears — at which
  point effect sizes can be added and the evidence grade revisited.
- **Sources removed:** four unverifiable placeholders (bare clinicaltrials.gov root URL,
  novonordisk.com/news root URL, and two generic Lancet Neurology / Nature Reviews
  Neuroscience titles with no identifiers).

### semaglutide-reduces-alcohol-cravings.mdx and glp1-alcohol-cravings-research.mdx
- **Claim constrained, needs a source:** STAR-T (NCT05891587) phase 2 *results* — reduced
  craving-related and drinking-related outcomes with semaglutide vs placebo. The posts now
  describe the trial record (n=80, completed, registration verified) and the direction of
  findings only, with an explicit note that specific effect sizes are withheld.
- **What is needed:** the STAR-T primary results publication (PMID; journal kind), verified
  for drug-match, with exact outcomes and effect sizes.
- **Removed from glp1-alcohol-cravings-research.mdx:** an untraceable "new study" combining
  mouse GLP-1 receptor knockout work with human neuroimaging of semaglutide users; an
  untraceable NIAAA statement; "NIH has funded at least two RCTs expected to begin enrolling
  late 2025, results by 2027". No identifiers existed for any of these.

### glp1-kidney-disease-outcomes.mdx
- **Claims removed:** the entire untraceable retrospective real-world cohort study —
  "148,432 adults with T2D; composite kidney outcome 8.2% vs 11.4% (HR 0.72); 40% eGFR
  decline HR 0.71; kidney failure HR 0.62; renal death HR 0.57; eGFR slopes −1.8 vs −2.9
  mL/min/1.73m2/yr; macroalbuminuria progression 12.4% vs 18.2%; regression 34.5% vs 22.1%;
  new-onset albuminuria 8.6% vs 14.3%; CKD-stage and SGLT2i subgroup HR tables; per-agent
  HRs (semaglutide 0.68, dulaglutide 0.73, liraglutide 0.76, exenatide 0.82); '28% relative
  risk reduction'". Note: the removed 12.4% figure was macroalbuminuria progression from
  this study — unrelated to ATTAIN-1's 12.4% (which was itself a press-release estimand).
- **Why removed:** no identifier for this study exists anywhere in the allowed sources; the
  old post's citation keys pointed at sources that were never in its frontmatter.
- **What is needed:** identification of the actual study (PMID/DOI), if it exists, with
  figures read from the paper.

### glp1-kidney-protection-confirmed.mdx
- **Claim removed:** "21% relative risk reduction in the composite kidney outcome" attributed
  to the Lancet Diabetes & Endocrinology meta-analysis (PMID 39608381). The identifier is
  verified as existing, but the pooled effect size could not be re-verified against any
  allowed source, and the site has been burned by numbers that pass an existence check while
  misstating the paper (wrong-estimand class).
- **What is needed:** the pooled kidney-composite effect size and CI read directly from
  PMID 39608381, plus which trials were pooled. If confirmed, the figure can return to the
  title and body.
- **Also removed:** a KDIGO 2024 guideline recommendation cited to a nonexistent source key;
  needs the guideline document (regulatory/guideline kind) if wanted back.

### fda-semaglutide-shortage-extended.mdx
- **Claims removed:** "shortage expected to persist through at least mid-2026" (contradicted
  by the FDA's February 2025 resolution — corrected, notice added); "Novo doubled production
  capacity over the past 18 months"; "compounded products represent 10-15% of dispensing
  volume"; "compounded products priced 50-80% below brand"; per-dose-strength availability
  claims; "PMC12164287 Global Rise of Compounded Weight-Loss Medicines" source (not in the
  verified ledger).
- **What is needed:** (a) verification of PMC12164287 / its DOI if the compounded-market
  framing is wanted back; (b) an identifiable market-data source for any market-share or
  pricing figures.

## Not flagged
- fda-compounded-semaglutide-warning.mdx and glp1-response-biomarkers.mdx required no claim
  removals — sourcing was extended from ledger-verified identifiers only.
