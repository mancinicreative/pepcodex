# Update worklist — evidence-landscape changes, 2026-05-17 → 2026-08-17

*Produced 2026-08-17 by the freshness scout. Research only: nothing under `src/content/` or `data/` was touched.*

Every identifier below was fetched live in this session from PubMed E-utilities, ClinicalTrials.gov v2,
or openFDA `drugsfda.json` (openFDA `last_updated` **2026-08-14**). Nothing is recalled from memory.
Where something could not be confirmed it says so rather than being dropped.

**Counts — 20 High · 21 Medium · 9 Low across 19 dossiers.** Machine-readable per-dossier findings:
`new-findings/<slug>.json`. Dossiers needing no update do not appear.

Priority definitions: **High** = published trial results, approvals, label changes, or a compound
rename affecting a compound we cover. **Medium** = new registrations, status changes, registry results
postings, meta-analyses. **Low** = preclinical, protocols, low-tier syntheses.

---

## Estimand warning — read before writing any number from this list

Three of the High items report **two different effect sizes for the same endpoint**. This is the exact
class of error that put wrong figures in 60+ places on this site (SURMOUNT-1 22.5% vs 20.9%).

`survodutide` / SYNCHRONIZE-MASLD (PMID 42252333) states both outright:

| endpoint | treatment-regimen estimand (lead with this) | efficacy estimand (label as such) |
|---|---|---|
| body-weight change | **−8.7%** vs −1.4% placebo | −12.2% vs −1.0% placebo |
| ≥30% liver-fat reduction | **68.5%** vs 28.6% | 84.2% vs 24.3% |

`orforglipron` / ACHIEVE-2 (PMID 42259339) names the treatment-regimen estimand as primary with the
efficacy estimand "supportive" — so the treatment-regimen figure is the published headline.
Both `zenagamtide` phase 2 papers assess their primary outcome on the **efficacy estimand only**;
say so explicitly when citing them, because there is no treatment-regimen figure to prefer.

---

## High priority

### `amycretin` — the compound has been renamed
- **PMID 42532080** · 2026-07-30 · Lancet · DOI `10.1016/S0140-6736(26)01248-1` · NCT06542874
  Subcutaneous **zenagamtide** phase 2 in T2D. The abstract states plainly: *"Zenagamtide (formerly
  amycretin)"*.
  **Dossier says** name `Amycretin`, aliases `NNC0487-0111` / `Oral Amycretin` / `Subcutaneous Amycretin`,
  and (lastUpdated 2026-01-22) that *"Phase 1 oral and phase 1b/2a subcutaneous trials have been
  published"*. **Now true:** the compound carries the INN zenagamtide, and phase 2 T2D results are
  published for both routes. The dossier is discoverable under a name the literature is moving away from.
- **PMID 42532079** · 2026-07-30 · Lancet · DOI `10.1016/S0140-6736(26)01247-X` · NCT06542874
  Oral zenagamtide phase 2 in T2D, 36 weeks, 6/25/50 mg.

### `retatrutide` — first published phase 3
- **PMID 42250575** · 2026-06-06 · Lancet · DOI `10.1016/S0140-6736(26)00967-0` · NCT06354660
  **TRANSCEND-T2D-1**, phase 3, n=537, 40 weeks.
  **Dossier says** *"Phase 3 programme in obesity and type 2 diabetes (Eli Lilly)"* with no published
  phase 3 data. **Now true:** treatment-regimen HbA1c change −1.69% (4 mg), −1.86% (9 mg), −1.94%
  (12 mg) vs −0.81% placebo.

### `survodutide` — first published phase 3
- **PMID 42252333** · 2026-06-07 · Nature Medicine · DOI `10.1038/s41591-026-04479-3` · NCT06632457, NCT06632444
  **SYNCHRONIZE-MASLD**, phase 3, n=216, 48 weeks; both co-primary endpoints met.
  **Dossier says** (lastUpdated 2026-01-22) Breakthrough Therapy designation for MASH and *"Phase 3
  programmes in obesity and MASH"*. **Now true:** the MASH/MASLD phase 3 has read out and is published.
  Use the treatment-regimen figures in the table above.

### `cagrisema` and `cagrilintide` — an entire programme is missing
The dossiers cover the **REDEFINE** obesity programme. The **REIMAGINE** type 2 diabetes programme
published three phase 3 trials in this window and appears nowhere.
- **PMID 42251860** · 2026-06-07 · Lancet Diabetes Endocrinol · DOI `10.1016/S2213-8587(26)00126-9` · NCT06323174
  **REIMAGINE 1** — CagriSema in T2D inadequately controlled on diet and exercise, n=189, 40 weeks.
- **PMID 42251859** · 2026-06-07 · Lancet Diabetes Endocrinol · DOI `10.1016/S2213-8587(26)00125-7` · NCT06065540
  **REIMAGINE 2** — CagriSema vs semaglutide vs cagrilintide, 30 countries, 68 weeks. First head-to-head
  against its own two components, and the first phase 3 **cagrilintide monotherapy** comparator data.
- **PMID 42251856** · 2026-06-07 · Lancet · DOI `10.1016/S0140-6736(26)01022-6` · NCT06323161
  **REIMAGINE 3** — CagriSema added to basal insulin, n=274, 40 weeks. An indication the dossier does
  not mention at all.

### `semaglutide` — new head-to-head as comparator
- **PMID 42251859** (REIMAGINE 2, above) puts semaglutide 2.4 mg and 1.0 mg head-to-head against a
  combination product in T2D. **Dossier** has no such comparison.

### `mazdutide` — new phase 3 at the higher dose
- **PMID 42251595** · 2026-08-04 · JAMA · DOI `10.1001/jama.2026.8142` · NCT06164873
  **GLORY-2**, phase 3, 9 mg, Chinese adults with obesity, n=461, 60 weeks. Body weight −16.65%
  (95% CI −18.19 to −15.12) vs −1.50% placebo; 84.3% vs 33.1% reached ≥5% loss.
  **Dossier says** NMPA approvals and the earlier programme; GLORY-2 is absent.

### `orforglipron` — two phase 3 papers plus an approved label change
- **PMID 42259339** · 2026-06-08 · Lancet · DOI `10.1016/S0140-6736(26)00800-7` · NCT06192108
  **ACHIEVE-2**, phase 3 non-inferiority vs dapagliflozin, n=962, 40 weeks.
- **PMID 42251769** · 2026-08-04 · JAMA · DOI `10.1001/jama.2026.9512` · NCT06109311
  **ACHIEVE-5**, orforglipron added to titrated insulin glargine, n=546. HbA1c −1.58/−1.88/−1.82%
  (3/12/36 mg) vs −0.79% placebo.
- **openFDA `NDA220934`** · SUPPL 3 · Labeling · status **AP 2026-08-04** · Eli Lilly · brand FOUNDAYO
  New Label and Medication Guide dated 2026-08-04.
  **Dossier says** regulatoryStatus `approved`, checked 2026-08-06, recording only the ORIG-1 approval
  of 2026-04-01. **Now true:** a labeling supplement was approved 2026-08-04 that the dossier does not
  record. *Could not confirm what the label change contains* — openFDA exposes the submission record,
  not a diff. Fetch the current label before describing it.

### `tirzepatide` and `dulaglutide` — SURPASS-CVOT results are public
- **NCT04255433** · results first posted **2026-07-08** · phase 3 · n=13,299 · COMPLETED
  Tirzepatide vs dulaglutide on major cardiovascular events. Full registry results now available, and
  for dulaglutide this is the largest active-comparator dataset it has.
  **Caution:** *no primary journal publication appeared in this window.* The in-window PubMed hits
  (42233554, 42233555, 42530340) are JACC and Diabetes Obes Metab **editorials and commentary**, not
  the trial paper. Cite the registry posting; do not imply a paper that this scan did not find.

### `ghrp-6` — a phase 3 that missed its primary endpoint
- **PMID 42462342** · 2026-07-16 · J Clin Neurosci · DOI `10.1016/j.jocn.2026.112195`
  **COURAGE-2**, phase 3, EGF + GHRP-6 in acute ischaemic stroke, n=188. **Missed the primary
  endpoint** — no difference in mRS, Barthel index or survival in the ITT population. A severe-stroke
  subgroup (NIHSS≥15, n=27) showed benefit. Report the negative headline first; a 27-patient subgroup
  is hypothesis-generating, not evidence of efficacy.

### `mk-0616` (enlicitide) — phase 3 results posted
- **NCT05952856** · results first posted **2026-08-06** · phase 3 · n=2,912 · COMPLETED
  Enlicitide decanoate in adults with hypercholesterolaemia. The dossier has no phase 3 outcome data
  for this macrocyclic-peptide PCSK9 inhibitor.

### `liraglutide` — approved labeling supplement
- **openFDA `NDA206321`** · SUPPL 24 · Labeling · status **AP 2026-06-02** · Novo Nordisk · SAXENDA
  Label posted 2026-07-09. **Dossier** records no 2026 label change. Same caveat as orforglipron:
  fetch the label to learn what changed.

---

## Medium priority

| dossier | id | date | what changed |
|---|---|---|---|
| `semaglutide` | PMID 42225305 | 2026-06-01 | Oral semaglutide 25 mg vs orforglipron 36 mg, population-adjusted indirect comparison (OASIS 4 vs ATTAIN-1). Reports both estimands: −3.2 pts treatment-regimen, −3.0 pts efficacy, favouring oral semaglutide; discontinuation higher with orforglipron. Sponsor-aligned ITC — label it. |
| `semaglutide` | NCT06041217 | 2026-05-18 | STEP 12 results first posted (phase 3, n=242). No journal publication found. |
| `semaglutide` | NCT05132088 | 2026-08-14 | OASIS 2 results first posted (phase 3, n=201). |
| `semaglutide` | NCT05035082 | 2026-08-10 | REALYSE results first posted (phase 4, n=1,018). |
| `semaglutide`, `tirzepatide` | PMID 42296503 | 2026-06-16 | ACP living systematic review + network meta-analysis, 69 studies / 112,511 participants (Ann Intern Med, DOI `10.7326/ANNALS-24-03764`). Semaglutide and tirzepatide give greatest weight loss; semaglutide probably reduces mortality and MACE. Guideline-grade citation neither dossier has. |
| `tirzepatide` | PMID 42233927 | 2026-06-03 | SURMOUNT-1 post hoc CV biomarkers at 72 weeks (JACC). hsCRP −36.9/−46.9/−54.6% for 5/10/15 mg. |
| `tirzepatide` | PMID 42410309 | 2026-07-06 | Meta-analysis: tirzepatide **not** significantly better than GLP-1 RAs for MACE (HR 0.85, 95% CI 0.70–1.04), I²=90.4%, mostly observational. A negative result worth stating plainly. |
| `dulaglutide` | PMID 42573026 | 2026-08 | Tirzepatide vs dulaglutide cardiorenal outcomes in HFpEF, propensity-matched real-world (Clinical Cardiology). Observational — grade accordingly. |
| `cagrilintide` | PMID 42228334 | 2026-07 | Renal/hepatic impairment does not affect cagrilintide PK, safety or tolerability (Clin Pharmacokinet, phase 1). No special-population PK section exists. |
| `cagrisema` | NCT07357740 | 2026-07-09 | Phase 2 study **WITHDRAWN** — *"The study is withdrawn due to strategic reasons."* |
| `cagrisema` | NCT07357766 | 2026-07-09 | Phase 3 study **WITHDRAWN** — same stated reason. A withdrawn phase 3 is material to a pipeline dossier. |
| `orforglipron` | PMID 42338042 | 2026-06-23 | Pooled hepatic safety across seven phase 3 trials, 11,220 participants: no DILI / Hy's Law signal. Answers a common safety question the dossier cannot currently cite. |
| `orforglipron` | PMID 42577069 | 2026-07-14 | Post hoc subgroup, adults ≥65, ATTAIN-1 and ATTAIN-2 (n=616). No older-adult content in the dossier. |
| `orforglipron` | NCT05869903 | 2026-08-14 | **ATTAIN-1 results first posted.** This is the trial whose headline weight-loss figure the site previously had wrong (11.2% published vs 12.4% press release). Re-check the dossier figure against the posted registry result. |
| `liraglutide` | PMID 42419792 | 2026-07-08 | BMJ network meta-analysis of drugs for overweight/obesity. Class-level comparative citation. |
| `tesamorelin` | NCT03226821 | 2026-05-19 | Phase 4 **TERMINATED**, whyStopped *"lack of availability of the study drug"*, n=6, results posted. Dossier (lastUpdated 2026-01-21) reflects neither the termination nor the supply problem. |
| `octreotide` | NCT05281328 | 2026-06-01 | POSITANO (subcutaneous depot, phase 2/3, n=71) results first posted, after the dossier's 2026-08-05 update. |
| `oveporexton` | PMID 42573945 | 2026-08-10 | Meaningful-change analysis across the two phase 3 trials, **The First Light** (n=166) and **The Radiant Light** (n=105): 66.9% vs 25.7% and 57.6% vs 17.6% achieved meaningful attention improvement. This dossier previously carried *fabricated* trial names — use these verified ones. |
| `oveporexton` | NCT06505031 | 2026-07-16 | TAK-861 phase 3 in narcolepsy type 1 (n=105) results first posted. |
| `mk-0616` | NCT06575959 | 2026-05-29 | Enlicitide hepatic-impairment phase 1 (n=20) results posted. |

---

## Low priority

| dossier | id | date | what changed |
|---|---|---|---|
| `cagrilintide` | PMID 42260119 | 2026-06 | Cross-species dorsal-vagal-complex atlas identifying neural mediators of cagrilintide's effect on energy balance (Nature Metabolism). Mechanism section predates it. |
| `survodutide` | PMID 42331726 | 2026-09 | Phase 2 secondary analysis of beta-cell function and insulin sensitivity. |
| `orforglipron` | NCT06010004 | 2026-06-30 | ACHIEVE-J long-term safety (phase 3, n=401) results posted. |
| `orforglipron` | NCT05931380 | 2026-07-20 | ATTAIN-J (phase 3, n=238) results posted. |
| `exenatide` | PMID 42310900 | 2026-09 | Paediatric obesity pharmacotherapy network meta-analysis. No paediatric section exists. |
| `tesamorelin` | PMID 42419889 | 2026-07-08 | TRIUMPH trial **protocol** (BMJ Open) — no results. Record as an ongoing trial, not as evidence. |
| `pemvidutide` | PMID 42529769 | 2026-06-29 | MASLD/MASH polyagonist meta-analysis (Cureus). Low-tier journal — use only as a pointer to the underlying RCTs, per the site's source-tier rules. |
| `hexarelin` | PMID 42462342 | 2026-07-16 | **Do not cite on this dossier.** The scan matched COURAGE-2 to hexarelin via *"growth hormone releasing hexapeptide"*, but the drug studied is GHRP-6, a different hexapeptide. Recorded so the false positive is not rediscovered as a finding. |
| `amycretin` | NCT06542874 | 2026-07-30 | Single registration underlying both zenagamtide phase 2 publications; no phase 2 T2D registration is cited. |

---

## Verified as no change

Checked directly and nothing in the window met the bar: `bpc-157` (10 in-window PubMed records, none a
clinical trial), `pasireotide` (12 records, no trial results; CT.gov returned 0 studies updated in
window), `tesamorelin` beyond the termination above, `VK2735` and `CT-388` (0 in-window PubMed records
for either name; CT-388 has 6 CT.gov registrations updated in window but no results posted).
