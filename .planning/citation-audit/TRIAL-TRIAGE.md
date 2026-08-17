# Trial Triage — 2026-08-17

464 trial records · 423 unique NCTs

| class | n | meaning |
|---|---|---|
| `OK` | 448 | drug matches and title matches |
| `COMPARATOR` | 10 | drug does NOT match but title is plausible -> possible comparator, needs judgment |
| `FOREIGN_REGISTRY` | 5 | valid id in a non-CT.gov registry -> verify separately, do NOT delete |
| `AUTOFIX_TITLE` | 1 | drug matches, stored title wrong -> safe to overwrite from CT.gov |

## COMPARATOR (10)

- **ct-388** `NCT07670416` (data/source-packs/ct-388.json #undefined)
  - stored: "A Study to Evaluate the Effects of Enicepatide in Participants With Obesity or Overweight, With or Without Type 2 Diabetes"
  - CT.gov: "A Study to Evaluate the Effects of Enicepatide in Participants With Obesity or Overweight, With or Without Type 2 Diabetes"
  - interventions: Enicepatide, Placebo
- **ct-388** `NCT07351058` (data/source-packs/ct-388.json #undefined)
  - stored: "A Clinical Study to Evaluate the Effects of Enicepatide (RO7795068) in Participants With Obesity or Overweight and Type 2 Diabetes"
  - CT.gov: "A Clinical Study to Evaluate the Effects of Enicepatide (RO7795068) in Participants With Obesity or Overweight and Type 2 Diabetes" [Enith2]
  - interventions: Placebo, Enicepatide
- **ct-388** `NCT07351045` (data/source-packs/ct-388.json #undefined)
  - stored: "A Clinical Study to Evaluate the Effects of Enicepatide (RO7795068) in Participants With Obesity or Overweight Without Type 2 Diabetes"
  - CT.gov: "A Clinical Study to Evaluate the Effects of Enicepatide (RO7795068) in Participants With Obesity or Overweight Without Type 2 Diabetes" [Enith1]
  - interventions: Placebo, Enicepatide
- **ct-388** `NCT07626515` (data/source-packs/ct-388.json #undefined)
  - stored: "A Study to Evaluate Safety, Tolerability, and Pharmacokinetics of Enicepatide in Generally Healthy Adult Chinese Participants"
  - CT.gov: "A Study to Evaluate Safety, Tolerability, and Pharmacokinetics of Enicepatide in Generally Healthy Adult Chinese Participants"
  - interventions: Enicepatide, Placebo
- **ct-388** `NCT07589686` (data/source-packs/ct-388.json #undefined)
  - stored: "A Dose-Finding Study of Petrelintide With Enicepatide (RO7795068) in Adults With Obesity or Overweight"
  - CT.gov: "A Dose-Finding Study of Petrelintide With Enicepatide (RO7795068) in Adults With Obesity or Overweight" [ZYNERGY]
  - interventions: Petrelintide, Enicepatide, Petrelintide-matching Placebo, Enicepatide-matching Placebo
- **glutathione** `NCT05654922` (data/source-packs/glutathione.json #undefined)
  - stored: "Study to Evaluate ARINA-1 in the Prevention of Bronchiolitis Obliterans Progression in Participants With Bilateral Lung Transplant"
  - CT.gov: "Study to Evaluate ARINA-1 in the Prevention of Bronchiolitis Obliterans Progression in Participants With Bilateral Lung Transplant"
  - interventions: ARINA-1, Standard of care only
- **liraglutide** `NCT07225829` (data/source-packs/liraglutide.json #undefined)
  - stored: "A Trial to Investigate the Safety and Efficacy of Intra-articular 4P004 Injection in Subjects With Knee Synovitis and Osteoarthritis"
  - CT.gov: "A Trial to Investigate the Safety and Efficacy of Intra-articular 4P004 Injection in Subjects With Knee Synovitis and Osteoarthritis" [INFLAM MOTION]
  - interventions: 4P004, Placebo (NaCl 0.9%)
- **pf-08653944** `NCT07311850` (data/source-packs/pf-08653944.json #undefined)
  - stored: "Efficacy and Safety of MET097 Once-Weekly in People With Overweight or Obesity"
  - CT.gov: "Efficacy and Safety of MET097 Once-Weekly in People With Overweight or Obesity" [VESPER-4]
  - interventions: MET097, Placebo
- **semaglutide** `NCT07539415` (data/source-packs/semaglutide.json #undefined)
  - stored: "A Phase 1 Clinical Trial to Assess the Safety of DWRX5003 and Relative Bioavailability to DWC202502 and DWC202503 in Healthy Adult Volunteers"
  - CT.gov: "A Phase 1 Clinical Trial to Assess the Safety of DWRX5003 and Relative Bioavailability to DWC202502 and DWC202503 in Healthy Adult Volunteers"
  - interventions: DWRX5003, DWC202502, DWC202503, DWRX5003P
- **thymosin-alpha-1** `NCT07675980` (data/source-packs/thymosin-alpha-1.json #undefined)
  - stored: "Thymosin-α1 for Recurrent Implantation Failure"
  - CT.gov: "Thymosin-α1 for Recurrent Implantation Failure" [Thy-α1 for RIF]
  - interventions: Thymosin Alpha1, Placebo Control

## AUTOFIX_TITLE (1)

- **cerebrolysin** `NCT06339411` (data/source-packs/cerebrolysin.json #undefined)
  - stored: "Exploring Cerebrolysin in Late Thrombectomy for Stroke: Blood-brain Barrier Biomarkers and Imaging Insights"
  - CT.gov: "Cerebrolysin After Reperfusion in Extended-window EndoVascular Thrombectomy" [CARE-EVT]
  - interventions: Cerebrolysin, Normal saline placebo

## FOREIGN_REGISTRY (5)

- **semaglutide** `jRCT2031180040` (data/source-packs/semaglutide.json #undefined)
  - stored: "Japanese Post-Marketing Surveillance - Ozempic"
- **semaglutide** `EUCTR2019-002632-28` (data/source-packs/semaglutide.json #undefined)
  - stored: "EU Post-Authorization Safety Study - Semaglutide"
- **tb-500** `EUCTR2018-002231-14` (data/source-packs/tb-500.json #undefined)
  - stored: "SEER-3: RGN-259 for Neurotrophic Keratopathy"
- **tb-500** `ACTRN12610000287033` (data/source-packs/tb-500.json #undefined)
  - stored: "Tβ4 in Horse Tendon Injuries"
- **tirzepatide** `CTR20211515` (data/source-packs/tirzepatide.json #undefined)
  - stored: "China Phase 1 PK"
