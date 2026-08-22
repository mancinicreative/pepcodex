# Needs verification — round 4 (research-peptide blog cluster, 2026-08-17)

Claims removed from or left out of the refreshed blog posts because no supporting identifier
exists in `verification/ledger.json` (verdict "exists"), `UPDATE-WORKLIST.md`, or
`new-findings/*.json`. Each needs a scout pass before it can return to the site.

## Removed from posts in this batch

### bpc-157-first-human-safety-data.mdx
- **Claim removed:** a 2025 intravenous BPC-157 pilot study in healthy volunteers
  (single ascending doses, no serious adverse events, PK measurements), previously tied
  to NCT05765513.
- **Why removed:** NCT05765513 registers an unrelated study ("HA35 Treatment the
  Gingival Discomfort..."), per the note already stored in the post's own frontmatter
  and in is-bpc-157-safe.mdx. No primary publication of any IV pilot is in the verified
  registry. The post now leans on PMID 42198317 (verified), which reports "fewer than
  30 human subjects across three uncontrolled pilot studies" without individual
  citations.
- **What is needed:** the individual publications (PMIDs) of the three pilot studies
  referenced by PMID 42198317, verified for drug-match; and, if one was IV-route, its
  correct registry number.
- **Also note:** is-bpc-157-safe.mdx (owned by the keep-verdict set, not edited here)
  still cites NCT05765513 in its body text while its own frontmatter marks the
  identifier unverifiable. That body text needs the same correction treatment.

### bpc-157-systematic-review-musculoskeletal.mdx
- **Claim removed:** a systematic review that "screened over 400 records and included
  67 studies" under PRISMA, plus per-tissue findings attributed to it, and three
  supporting sources with homepage-only URLs ("BPC 157 Enhances Tendon Healing in Rat
  Achilles Tendon Transection Model", "Mechanisms of BPC-157 Effects on Soft Tissue
  Healing", "Pentadecapeptide BPC 157 and Its Effects: A Review").
- **Why removed:** no such review or counts could be located in any allowed source. The
  post now uses the verified 2025 HSS Journal systematic review (PMID 40756949) and
  ledger-verified primary studies from the dossier.
- **What is needed:** if a musculoskeletal-specific preclinical systematic review with
  study counts exists, its PMID verified for title-match; otherwise nothing.

### oxytocin-autism-meta-analysis-optimal-dosing.mdx
- **Claim removed:** a dose-response meta-analysis of "38 randomized controlled trials,
  over 1,800 participants" reporting an inverted U-shaped dose-response with peak
  effect near 24 IU, age-moderated effects, and duration effects; also three placeholder
  sources with homepage-only URLs (Nature MP, JAMA Psychiatry, ClinicalTrials.gov).
- **Why removed:** no such meta-analysis is in any allowed source; the described
  figures could not be attributed. Post reframed away from dosing (banned framing) onto
  the verified pooled analyses (PMIDs 38815399, 37540265, 34827545).
- **What is needed:** if a genuine dose-response meta-analysis of intranasal oxytocin
  in ASD exists, its PMID verified for title and population match. Dosing-guidance
  framing stays out regardless.

### thymosin-alpha-1-aging-immunosenescence.mdx
- **Claims removed:** (a) dangling body citations [garaci-2024], [pinti-2023],
  [zadaxin-clinical] that resolved to no declared source; (b) COVID-19 claims ("some
  studies investigated its potential to improve outcomes in severe cases"); (c)
  "approved in over 35 countries" retained but the specific approval count remains
  uncited anywhere on the site.
- **What is needed:** (a) if Garaci 2024 and Pinti 2023 are real reviews, their PMIDs
  verified for author/year match; (b) verified PMIDs for Ta1 COVID-19 trials (several
  exist in the literature but none is in the ledger); (c) a regulatory or review source
  for the 35-country approval figure (also asserted in thymosin-alpha1-elderly-immune.mdx
  and the dossier).

### tb500-wound-healing-trial.mdx
- **Identifier not usable:** the fragment-identity paper (acetylated Tβ4 17–23,
  PMID 22962027 / DOI 10.1002/dta.1402) is cited in the working-tree rewrite of
  what-is-tb-500.mdx with verifiedAt 2026-08-17 but is absent from ledger.json,
  UPDATE-WORKLIST.md, and new-findings. This post states the fragment framing and
  links to the guide/dossier instead of citing the identifier directly.
- **What is needed:** ledger ingestion of PMID 22962027 (and the other what-is-tb-500
  additions: 23084823, 38382158, 42542926) so the framing can carry its citation here.
- **Also not usable for the same reason:** PMID 42538058 and 41373628 (cited in the
  working-tree rewrites of what-is-tesamorelin.mdx and thymosin-alpha1-elderly-immune.mdx
  respectively but absent from the ledger).

## Claims kept but flagged for a better source

- **FDA compounding ineligibility of BPC-157 (2023)** — asserted in
  bpc-157-first-human-safety-data.mdx and bpc-157-systematic-review-musculoskeletal.mdx
  (and pre-existing in is-bpc-157-safe.mdx) with no regulatory citation anywhere in the
  cluster. Needs the FDA docket/announcement URL as a `type: regulatory` source.
- **RGN-137 formulation name** for the thymosin beta-4 topical gel trials — carried
  over from the previous verified pass of tb500-wound-healing-trial.mdx; not present in
  ledger evidence for NCT00832091. Verify against the registry record's intervention
  details or drop the code name.
