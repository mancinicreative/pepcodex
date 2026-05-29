# PepCodex Scoring Rubric — Source of Truth

**Version:** 2.2 (draft — Evidence axis tuned & locked; Effectiveness calibration pending)
**Date:** 2026-05-29
**Status:** Two-axis model defined — **Axis 1: Evidence Score** (5 dimensions, 20 elements, ~80 bands) and **Axis 2: Effectiveness Score** (4 elements). Deterministic bands defined for both. NOT yet calibrated against a test set; NOT yet implemented in the schema. Point *allocations* are an evidence-informed proposal to be validated in calibration; the *criteria* are grounded in the cited frameworks.

**The two axes are independent and always displayed together:** Evidence = *how proven*; Effectiveness = *how large the demonstrated effect is*. A compound can be highly effective but lightly proven (e.g., retatrutide) or modestly effective but definitively proven (e.g., semaglutide).

---

## Purpose

A reproducible, science-first method for scoring every compound (peptide, bioregulator, small molecule, etc.) in the PepCodex library on a 0–100 scale. The goal is that two independent reviewers scoring the same compound land within a few points of each other, and that every point traces to a defined criterion grounded in an established evidence framework.

**Design principle:** the score measures the *science* — what is known, studied, mechanistically understood, plausible, and experienced in the real world. It deliberately does **not** reward (or penalize for) regulatory/legal status. Whether a compound is FDA-approved, approved only abroad, or research-only is recorded as **non-scored informational metadata** (`regulatoryStatus`), never as a score input.

---

## The five dimensions and weights

The overall score is a weighted average of five dimension sub-scores, each itself 0–100:

| # | Dimension | Weight | Measures |
|---|---|---|---|
| 1 | **Research Depth** | 30% | Rigor/quality of the best human evidence |
| 2 | **Mechanism** | 20% | How well the molecular mechanism of action is understood |
| 3 | **Plausibility** | 20% | Whether claimed benefits follow from that mechanism |
| 4 | **Global Coverage** | 15% | How widely & independently it has been studied worldwide |
| 5 | **Community Experience** | 15% | Real-world usage signal (NOT efficacy/safety proof) |

```
Overall = ResearchDepth×0.30 + Mechanism×0.20 + Plausibility×0.20
        + GlobalCoverage×0.15 + CommunityExperience×0.15
```

Rounded to the nearest whole number.

**Philosophy ("research-led but fair"):** Research Depth is the single heaviest factor, but the Mechanism + Plausibility + Community trio (55% combined) lets a mechanistically sound, widely-studied, well-used compound score respectably even without large Western RCTs. A score of 80+ still requires genuine research depth.

### Overall score labels (descriptive — not medical advice)

| Range | Label |
|---|---|
| 80–100 | Well-evidenced |
| 60–79 | Emerging / moderate |
| 40–59 | Early / limited |
| 20–39 | Preliminary / speculative |
| 0–19 | Insufficient |

> The overall score reflects the **scientific evidence & profile** of a compound. It is **not** medical advice, a safety guarantee, an efficacy claim, or a recommendation to use.

---

## Cross-cutting scoring rules

1. **No double-counting.** Mechanism scores *bench/target facts*; Plausibility scores *the inferential bridge* from mechanism to claimed benefit; Research Depth scores *human outcome evidence*. The same fact must never earn points in two dimensions.
2. **Do not penalize old or non-Western human studies** on the basis of era or geography. Score them on their actual methods (randomization, blinding, attrition, sample size). A rigorous 1980s Soviet or Japanese RCT outranks a recent uncontrolled case series.
3. **Within a band, position by the band's quantitative cue** where one exists; otherwise use the descriptive anchor. Record the evidence used for each element so the score is auditable.
4. **When evidence is absent/unknown, score 0 for that element** — absence is not neutrality.
5. **Re-score date + sources** are recorded with every rating (`lastReviewed`, `reviewNotes`).

---

## Dimension 1 — Research Depth (30%)
*Rigor and quality of the best available human evidence, plus a small capped credit (1E, 10 pts) for the preclinical evidence foundation. Grounded in GRADE, Oxford CEBM 2011 Levels of Evidence, Cochrane RoB 2, AMSTAR-2. Element weights: 1A 35 · 1B 25 · 1C 15 · 1D 15 · 1E 10 = 100.*

### 1A. Highest human study tier reached — 35 pts *(OCEBM 2011 + evidence pyramid)*
| Pts | Criterion |
|---|---|
| 0 | No studies / vendor claims only |
| 3 | In-vitro (cell/biochemical) only |
| 6 | Animal data present, no human data |
| 9 | Human case report(s), 1–2 |
| 12 | Human case series (≥3) or documented clinical observation |
| 15 | Single uncontrolled open-label human study |
| 18 | Controlled observational (cohort/case-control), n<100 |
| 22 | Controlled observational n≥100, or ≥2 observational studies |
| 25 | Single RCT, n<50 |
| 28 | Single adequately-powered RCT, n≥50 |
| 30 | ≥2 independent RCTs |
| 33 | Systematic review of RCTs |
| 35 | Meta-analysis of multiple RCTs |

### 1B. Risk-of-bias / methodological rigor of the best studies — 25 pts *(Cochrane RoB 2; AMSTAR-2)*
| Pts | Criterion |
|---|---|
| 0–6 | Best available study at **high** risk of bias, or only "critically low" reviews |
| 7–12 | Best study rated "some concerns" (RoB 2) |
| 13–18 | ≥1 RCT at **low** risk of bias on the relevant outcome |
| 19–25 | ≥1 low-RoB RCT **plus** a moderate/high-confidence systematic review (AMSTAR-2) |

### 1C. Sample size / statistical precision — 15 pts *(GRADE imprecision)*
| Pts | Criterion |
|---|---|
| 0–3 | Total human N < 50 |
| 4–7 | Total human N 50–300 |
| 8–11 | Total human N 300–1,000 |
| 12–15 | >1,000, adequately powered, narrow confidence intervals |

### 1D. Directness to intended human use — 15 pts *(GRADE indirectness)*
| Pts | Criterion |
|---|---|
| 0–4 | Evidence only indirect (surrogate endpoints, non-target population, different route) |
| 5–9 | Partially direct (right population OR right outcome, not both) |
| 10–15 | Direct — population, route, and outcome match the claimed use |

### 1E. Preclinical evidence foundation — 10 pts *(volume/rigor/replication of the animal + in-vitro study program — scores the body of preclinical work, NOT mechanism understanding, to avoid double-counting with Dimension 2)*
| Pts | Criterion |
|---|---|
| 0–2 | None, or a single weak animal/in-vitro study |
| 3–5 | Modest preclinical program (a few animal studies) |
| 6–8 | Substantial multi-study preclinical evidence across models |
| 9–10 | Extensive, independently-replicated preclinical program across multiple models/species |

---

## Dimension 2 — Mechanism (20%)
*How well the molecular mechanism of action is characterized. Grounded in Bradford Hill (experiment, specificity, biological gradient), pharmacology MoA standards, and GRADE indirectness.*

### 2A. Target identified & validated — 40 pts *(Hill "experiment"; PNAS MoA standard)*
| Pts | Criterion |
|---|---|
| 0 | Target unknown |
| 10 | Target inferred, no binding data |
| 20 | Named target with measured binding affinity (Ki/IC50) |
| 30 | Binding + functional confirmation (agonist/antagonist response) |
| 40 | Binding + genetic knockout/knockdown or antagonist abolishes the effect |

### 2B. Downstream pathway mapped — 30 pts *(Hill specificity/coherence)*
| Pts | Criterion |
|---|---|
| 0–6 | Pathway unknown / hand-wavy |
| 7–15 | Proximal signaling partially known |
| 16–23 | Most of the chain to the proximal effect characterized |
| 24–30 | Full pathway from target → physiological effect characterized |

### 2C. Dose–response demonstrated — 20 pts *(Hill "biological gradient")*
| Pts | Criterion |
|---|---|
| 0–4 | No dose–response data |
| 5–10 | Dose–response in a single model |
| 11–15 | Monotonic dose–response in ≥2 models or in vivo |
| 16–20 | Consistent monotonic dose–response across ≥2 independent models incl. in vivo |

### 2D. Directness of mechanistic evidence — 10 pts *(GRADE indirectness)*
| Pts | Criterion |
|---|---|
| 0–3 | Computational / predicted only |
| 4–7 | In-vitro only |
| 8–10 | Confirmed in in-vivo mammalian models |

---

## Dimension 3 — Plausibility (20%)
*Whether the claimed benefits reasonably follow from the established mechanism. Grounded in Bradford Hill (plausibility, coherence, analogy, specificity), GRADE surrogate-outcome indirectness, and the Howick/CAST caution that a real mechanism can yield an opposite net clinical effect.*

### 3A. Causal-chain completeness (mechanism → claimed benefit) — 40 pts *(Hill plausibility; GRADE surrogate indirectness)*
| Pts | Criterion |
|---|---|
| 0–10 | Claimed benefit is a single large speculative leap from the mechanism |
| 11–20 | Plausible, but ≥1 unproven intermediate link |
| 21–30 | Mechanism → surrogate marker established; surrogate → benefit inferred |
| 31–40 | Full chain: mechanism → surrogate → clinical outcome each independently supported |

### 3B. Coherence with known biology — 25 pts *(Hill "coherence")*
| Pts | Criterion |
|---|---|
| 0–5 | Claim directly contradicts established physiology |
| 6–11 | Conflicts with some known findings; tension unresolved |
| 12–18 | Neutral — neither supported nor contradicted |
| 19–24 | Consistent with disease biology + indirect-marker support |
| 25 | Fully coherent — aligns with established pathophysiology, nothing contradicting |

### 3C. Class / analogy support — 20 pts *(Hill "analogy")*
| Pts | Criterion |
|---|---|
| 0–4 | No analogous compounds / class evidence |
| 5–10 | Mixed evidence from related compounds |
| 11–16 | ≥1 same-class agent shows the analogous effect |
| 17–20 | Multiple same-class agents reliably produce the effect |

### 3D. Specificity vs over-extrapolation — 15 pts *(Hill "specificity"; Howick/CAST)*
| Pts | Criterion |
|---|---|
| 0–4 | Sweeping multi-system "cures everything" claim |
| 5–9 | Moderately broad claim; several downstream effects asserted |
| 10–15 | Tightly scoped, single-mechanism-consistent claim |

---

## Dimension 4 — Global Coverage (15%)
*How widely and independently the compound has been studied across the world's scientific community — replication, reach, and volume of research. Grounded in the independent-replication / reproducibility principle (GRADE consistency) and bibliometric breadth. Governance recognition is a small, jurisdiction-neutral component only.*

### 4A. Independent replication — 35 pts *(GRADE consistency / reproducibility)*
| Pts | Criterion |
|---|---|
| 0–6 | Single study, or all studies from one lab/author group |
| 7–16 | Findings repeated, but by the same group or within one country/cluster |
| 17–26 | Replicated by ≥1 fully independent group or in ≥2 countries |
| 27–35 | Robustly reproduced across multiple independent groups + countries |

### 4B. Geographic & institutional breadth — 25 pts
| Pts | Criterion |
|---|---|
| 0–6 | One lab / one country |
| 7–14 | 2–3 countries or institutions |
| 15–21 | 4–6 countries / multiple regions |
| 22–25 | Many countries / globally distributed research |

### 4C. Volume & diversity of global literature — 25 pts *(bibliometric breadth)*
*(study-count thresholds illustrative — tune in calibration)*
| Pts | Criterion |
|---|---|
| 0–6 | <5 studies total, narrow scope |
| 7–14 | 5–20 studies, some diversity of contexts |
| 15–21 | 20–100 studies, diverse populations/angles |
| 22–25 | >100 studies, broad and still growing |

### 4D. Governance recognition — 15 pts *(jurisdiction-neutral, minor signal)*
| Pts | Criterion |
|---|---|
| 0 | No governance review anywhere |
| 5 | Under formal investigation / clinical-trial registration with a regulator |
| 10 | Approved/registered by ≥1 national regulator (any jurisdiction) |
| 15 | Approved/registered by multiple national regulators |

---

## Dimension 5 — Community Experience (15%)
*A real-world usage signal — explicitly NOT evidence of efficacy or safety. Grounded in FDA Real-World Evidence/Real-World Data framework, patient-reported-outcome principles, and pharmacovigilance (FAERS-style) signal detection. Anecdote/case experience sits at the bottom of the evidence hierarchy and is hypothesis-generating only.*

### 5A. Scale of real-world use — 35 pts *(RWD volume signal)*
| Pts | Criterion |
|---|---|
| 0–6 | Negligible / no documented use |
| 7–16 | Niche but persistent use (single community) |
| 17–26 | Broad discussion across multiple independent venues |
| 27–35 | Large, well-documented population-level use |

### 5B. Longevity / track record — 30 pts
| Pts | Criterion |
|---|---|
| 0–6 | <1 year |
| 7–14 | 1–3 years |
| 15–22 | 3–7 years |
| 23–30 | >7 years of sustained real-world use |

### 5C. Consistency of reported experience — 20 pts *(consistency signal — capped for self-selection bias)*
| Pts | Criterion |
|---|---|
| 0–4 | Contradictory reports |
| 5–10 | Mixed / inconsistent |
| 11–16 | Broadly consistent themes |
| 17–20 | Highly consistent across independent sources |

### 5D. Real-world tolerability signal — 15 pts *(FAERS-style spontaneous reporting; asymmetric)*
| Pts | Criterion |
|---|---|
| 0–4 | Recurring reports of serious adverse effects |
| 5–9 | Isolated / minor adverse reports |
| 10–15 | No notable recurring adverse signal over substantial exposure |

> **Note on 5D:** a top score means *absence of a reported signal*, which is **not proof of safety** — display it with that caption.

### Community Experience guardrails (mandatory)
1. Always labeled **"real-world usage signal — NOT evidence of efficacy or safety."**
2. The **15% weight cap is structural** — a high Community score can never move a clinically-unproven compound into a "Well-evidenced" tier on its own.
3. Display a disclaimer adjacent to the sub-score: real-world reports cannot establish causation, cannot estimate incidence, and are not medically confirmed.
4. **Forbidden verbs** in any auto-generated community text: "works," "effective," "safe," "proven," "treats." Permitted: "users report," "anecdotally associated with," "hypothesis-generating only."
5. Render Community Experience visually distinct from and subordinate to the clinical-evidence dimensions.

---

# Axis 2 — Effectiveness Score (separate from the Evidence Score above)

The five dimensions above are **Axis 1: the Evidence Score** — how *proven* a compound is. This is **Axis 2: the Effectiveness Score** — how *large the demonstrated effect is when it works*. The two are scored and displayed **independently and always together** (e.g., "Evidence 100 · Effectiveness 77").

**Scoring gate.** The Effectiveness Score is computed **only when ≥1 quantified *human* efficacy estimate exists.** With no human efficacy data the value is **"Not Established"** — *not* a low number (a low number would falsely imply a measured-but-small effect). This keeps preclinical/anecdotal hype off the axis.

**Normalization rule (cross-indication comparability).** Never compare raw effect sizes across different conditions — placebo response and outcome variance are disease-specific. Judge each compound's effect **relative to placebo and to the best existing option *within its own primary indication***, then map onto the shared category bands below. The *category* (trivial → transformative), not the absolute number, is the comparable unit across conditions.

**Confidence.** Shown as a separate **flag** (High / Moderate / Low, from GRADE/CINeMA certainty of the effect estimate) and carried by the Evidence Score — it does **not** cap the Effectiveness number. This lets a large effect from immature evidence show its true magnitude while its thinner proof stays visible on the Evidence axis.

### E1. Effect-size magnitude — primary outcome — 30 pts *(Cohen's d; GRADE RR>2/RR>5; NNT)*
| Pts | Criterion |
|---|---|
| 0–6 | Trivial — Cohen's d <0.2 / RR ~1.0–1.5 / NNT >100 |
| 7–15 | Small–moderate — d ~0.2–0.5 / RR ~1.5–2 / NNT ~20–100 |
| 16–24 | Moderate–large — d ~0.5–0.8 / RR ~2–5 / NNT ~10–20 |
| 25–30 | Large / transformative — d ≥0.8 / RR >5 / NNT <10 |

### E2. Clinical meaningfulness vs MCID — 25 pts *(MCID; responder analysis)*
| Pts | Criterion |
|---|---|
| 0–6 | Below the indication's MCID (statistically significant but trivial) |
| 7–14 | Meets the MCID |
| 15–21 | Exceeds MCID, or majority cross a moderate responder threshold (e.g., ACR20/50) |
| 22–25 | Far exceeds MCID (≥2×) or high responder bar (e.g., ACR70-level) |

### E3. Outcome relevance — patient-centered vs surrogate — 15 pts *(GRADE outcome-importance / indirectness)*
| Pts | Criterion |
|---|---|
| 0–4 | Surrogate biomarker only |
| 5–10 | Intermediate / functional endpoint |
| 11–15 | Hard patient-relevant outcome (symptoms, function, morbidity/mortality) |

### E4. Relative effectiveness vs best existing option — 30 pts *(comparative effectiveness: superiority vs non-inferiority; NMA SUCRA/P-score)*
| Pts | Criterion |
|---|---|
| 0 | Worse than standard of care |
| 1–8 | Comparable / non-inferior to existing options, or superiority vs placebo on a surrogate only |
| 9–18 | Superior to placebo on a clinical outcome (no head-to-head) |
| 19–26 | Top-tier in indirect comparison (high NMA SUCRA/P-score) vs active comparators |
| 27–30 | Head-to-head superiority over standard of care |

*Effectiveness Score = E1 + E2 + E3 + E4, out of 100.*

### Effectiveness guardrails (mandatory)
1. Labeled **"demonstrated effect magnitude — not a recommendation, endorsement, or safety claim."**
2. Always displayed **paired with the Evidence Score** and the confidence flag — never alone.
3. **"Not Established"** wherever no quantified human efficacy estimate exists.
4. Prefer ARR/NNT and SMD over relative risk reduction (RRR inflates apparent size at low baseline risk).
5. Surrogate-only effects are flagged and scored low on E3 regardless of magnitude.

---

## How to score a compound (procedure)

**Axis 1 — Evidence Score:**
1. Gather the evidence base (literature, trials, regulatory records, community sources).
2. For each of the 20 elements, find the matching band and record the points **plus the specific evidence** that justifies it (PMID/DOI/URL or source note).
3. Sum each dimension's elements → five 0–100 sub-scores.
4. Apply the weights → Evidence Score 0–100. Apply the label.

**Axis 2 — Effectiveness Score:**
5. If no quantified human efficacy estimate exists → mark **"Not Established"** and stop. Otherwise score E1–E4 (within the primary indication, relative to placebo + best alternative) → Effectiveness Score 0–100, and record the confidence flag (High/Moderate/Low).

**Both axes:**
6. Record `lastReviewed` and `reviewNotes` (a 1–3 sentence rationale per axis).
7. Anything ambiguous → score conservatively and flag for human review.

---

## Future work (not in this document)

- **Calibration** (next step): score ~5 spread compounds (semaglutide, thymalin, BPC-157, a research-chemical, thymosin α-1) element-by-element on **both axes** to pressure-test bands and tune anchors before locking. (Evidence axis already calibrated 2026-05-29; Effectiveness axis pending.)
- **Evidence-axis tuning** (resolved 2026-05-29): ① preclinical evidence foundation added as element **1E (10 pts)** — preclinical-only compounds are no longer all floored (FOXO4-DRI Research Depth ~8 → ~14); ② science-first ordering **confirmed** — BPC-157 below thymalin accepted; the gap narrows (~49 vs ~52) once BPC-157's large preclinical program is credited, but ordering holds.
- **Schema migration**: extend `ratings` from the current 1–5 / 4-field model to the two-axis model — Evidence (5 dimensions, element-level 0–100) + Effectiveness (4 elements 0–100 or "Not Established", plus a confidence flag); map `evidenceStrength` to the Research Depth axis to end the current contradiction.
- **Re-scoring workflow**: re-score all ~102 dossiers against this rubric — one dossier per dedicated agent, each agent producing the 20 element scores with cited evidence, written to the dossier's `ratings` block. This document is the agent's scoring manual.
- **Public methodology page**: adapt this document into `/methodology` as a public E-E-A-T asset.

---

## References (frameworks this rubric derives from)

- **GRADE** — GRADE Working Group; GRADE Handbook (gradeworkinggroup.org; gdt.gradepro.org/app/handbook); Cochrane Handbook ch. 14.
- **GRADE indirectness** — Guyatt GH et al. "GRADE guidelines: 8. Rating the quality of evidence—indirectness." *J Clin Epidemiol.* 2011;64(12):1303–1310. DOI 10.1016/j.jclinepi.2011.04.014; PMID 21802903.
- **Oxford CEBM 2011 Levels of Evidence** — cebm.net / cebm.ox.ac.uk.
- **Cochrane Risk of Bias 2 (RoB 2)** — cochrane.org (RoB 2 resources).
- **AMSTAR-2** — Shea BJ et al., 2017 (systematic-review appraisal).
- **Bradford Hill criteria** — Hill AB. "The Environment and Disease: Association or Causation?" *Proc R Soc Med.* 1965;58(5):295–300. PMID 14283879; DOI 10.1177/003591576505800503.
- **Mechanistic reasoning caution** — Howick J, Glasziou P, Aronson JK. *J R Soc Med.* 2010;103(11):433–441 (DOI 10.1258/jrsm.2010.100146); follow-up 2013;106(3):81–86 (PMID 23481429). Includes the CAST example (real mechanism, increased mortality).
- **MoA target validation** — Gregori-Puigjané E et al. *PNAS.* 2012;109(28):11178–11183. PMID 22711801.
- **FDA Real-World Evidence framework** — FDA, Dec 2018 (fda.gov/media/120060/download) and RWE guidance.
- **FDA Patient-Reported Outcome guidance** — fda.gov.
- **FAERS / pharmacovigilance signal detection** — FDA Adverse Event Reporting System public dashboard + Q&A (explicit: reports cannot establish causation or incidence).
- **Evidence hierarchy placement of anecdote/case reports** — standard EBM hierarchy references.

### Axis 2 — Effectiveness frameworks
- **Effect size (Cohen's d / SMD)** — Cohen 1988 conventional thresholds (d = 0.2 small / 0.5 medium / 0.8 large; "crude" per Cohen).
- **NNT / ARR / RRR** — Oxford CEBM (Number Needed to Treat); ARR/NNT preferred over RRR (RRR inflates at low baseline risk).
- **Minimal Clinically Important Difference (MCID)** — JAMA Guide to Statistics & Methods (statistical vs clinical significance).
- **GRADE large magnitude of effect** — Guyatt GH et al. "GRADE guidelines: 9. Rating up the quality of evidence." *J Clin Epidemiol.* 2011;64(12):1311–1316. PMID 21802902 (RR>2 ↑1 level; RR>5 ↑2 levels).
- **Comparative effectiveness / non-inferiority** — FDA Non-Inferiority Clinical Trials guidance (superiority vs non-inferiority distinction).
- **Network meta-analysis ranking (SUCRA / P-score)** — Salanti et al. 2011 (SUCRA); Rücker & Schwarzer 2015, BMC Med Res Methodol (P-score). Rankings must be read with certainty.
- **CINeMA (confidence in NMA)** — Nikolakopoulou et al. 2020, PLOS Medicine (GRADE extended to network estimates).
- **Responder analysis** — e.g., ACR20/50/70 response criteria.

*Effectiveness verification note:* frameworks retrieved 2026-05-29. The Salanti 2011 SUCRA paper and GRADE Guidance 34 full texts were paywalled (definitions confirmed via Cochrane/GRADE handbooks); some OR→d conversion cutoffs are base-rate-dependent approximations. Effectiveness point allocations are an evidence-informed proposal pending calibration.

*Verification note:* All frameworks above were retrieved from primary/official sources during research (2026-05-29). The Howick 2010 full text was paywalled (citation confirmed, not read in full). Two secondary-sourced regulatory figures (WHO-Listed-Authority count; NMPA reference-country status) are not used as scoring inputs in this version and should be re-verified before any public regulatory claims. Point allocations are an evidence-informed proposal pending calibration.
