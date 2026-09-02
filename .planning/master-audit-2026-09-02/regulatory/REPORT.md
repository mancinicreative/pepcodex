# PepCodex Master Audit — Regulatory & Safety Current-State Evidence Pack

**Pack date:** 2026-09-02  
**Access date for all live fetches:** 2026-09-02  
**Author role:** Regulatory and Safety Current-State Researcher (independent of Audits A/B/C)  
**Mode:** AUDIT ONLY. Read-only. No site edits. No outreach.  
**Jurisdiction:** United States (FDA compounding / drug advertising). Site language English.  
**This is a dated evidence pack for the Council Judge, not a full site audit.**

## How to read this pack

- **FACT:** quoted or directly restated from an official source fetched on 2026-09-02.  
- **INFERENCE:** a mapping from that fact onto PepCodex pages. Not a regulator decision.  
- **UNKNOWN:** official source missing, incomplete, or not yet a final agency action. Never filled with a guess.  
- Advisory-committee votes, press vote tallies, and “peptides are legal again” claims are **not** FDA decisions.

Repo pages inspected (assigned): `src/pages/fda-notice.astro`, `src/pages/disclaimer.astro`, `src/pages/editorial-policy.astro`; FDA/compounding blogs under `src/content/blog/`; dossiers `semaglutide`, `tirzepatide`, `retatrutide`, `bpc-157`, `tb-500`, `tesamorelin`, `melanotan-ii`, `pt-141`, `orforglipron`. Also sampled clinic directory copy, safety pages, and pipeline blogs named in the task.

---

## 1. FDA human-drug compounding (503A / 503B) and peptide-relevant restrictions

### 1.1 Compounded drugs are not FDA-approved

| Field | Value |
|---|---|
| Source | https://www.fda.gov/drugs/human-drug-compounding/human-drug-compounding-laws |
| Publisher | U.S. FDA |
| Page “content current as of” | 2024-12-17 |
| Access date | 2026-09-02 |
| Classification | FACT |

**Exact quote (short):** “Compounded drugs are not FDA-approved. This means that FDA does not review these drugs to evaluate their safety, effectiveness, or quality before they reach patients.”

**Law structure (FACT, same page + 503A/503B pages):**

- **DQSA** (enacted 2013-11-27) updated FD&C Act compounding after the 2012 fungal meningitis outbreak.
- **503A:** state-licensed pharmacies/physicians; patient-specific prescriptions; exemption from premarket approval, CGMP, and adequate-directions-for-use labeling *if statutory conditions are met*.
- **503B:** voluntary outsourcing facilities; CGMP; may distribute with or without a patient-specific prescription (office stock); FDA risk-based inspection; adverse-event reporting.

**503A bulk-substance test** (https://www.fda.gov/drugs/human-drug-compounding/bulk-drug-substances-used-compounding-under-section-503a-fdc-act ; content current **2026-05-14**):

State-licensed compounders “may only compound drug products using bulk drug substances that: (1) Comply with an applicable USP or NF monograph…; (2) Are components of FDA-approved drug products if an applicable USP or NF monograph does not exist; or (3) Appear on FDA’s list of bulk drug substances that can be used in compounding (the 503A bulks list) if such a monograph does not exist and the substance is not a component of an FDA-approved drug product.”

**503B bulk-substance test** (https://www.fda.gov/drugs/human-drug-compounding/bulk-drug-substances-used-compounding-under-section-503b-fdc-act ; content current **2025-01-07**):

Outsourcing facilities “may not compound a drug product that includes a bulk drug substance unless: (1) The bulk drug substance appears on [the 503B bulks list], or (2) The drug product compounded from such bulk drug substance appears on FDA’s drug shortage list at the time of compounding, distribution and dispensing.”

**Interim Category 1 / 2 / 3** (same 503A page): Category 1 = nominated with enough information, no identified significant safety risk, enforcement discretion while evaluated. Category 2 = nominated with enough information **but FDA identified significant safety risks**; Category 1 discretion does **not** apply. Category 3 = insufficient nomination. FDA “does not intend to place bulk drug substances nominated on or after January 7, 2025, into these categories.”

### 1.2 Category 2 live table vs “nominated but withdrawn”

| Field | Value |
|---|---|
| Source | https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks |
| Publisher | U.S. FDA |
| Content current as of | **2026-04-22** |
| Access date | 2026-09-02 |
| Classification | FACT |

**Live Category 2 rows (still listed, not withdrawn):** include cesium chloride, chloral hydrate, diethylstilbestrol, domperidone, edetate disodium (except ophthalmic), germanium sesquioxide, **GHRP-2 (injectable and nasal, 503B)**, **GHRP-6 (503B)**, **ibutamoren mesylate (503A and 503B)**, **ipamorelin acetate (503B)**, **kisspeptin-10 (503A)**, neomycin sulfate (parenteral exceptions), quinacrine HCl intrauterine, tranilast (503B).

**“Nominated but withdrawn” table** — FDA’s words, not a 503A bulks-list placement. Relevant PepCodex peptides:

- **BPC-157:** “may pose risk for immunogenicity for certain routes… peptide-related impurities and active pharmaceutical ingredient (API) characterization. FDA has identified no, or only limited, safety-related information for the proposed routes of administration. Therefore, the agency lacks sufficient information to know whether the drug would cause harm when administered to humans.”
- **Thymosin beta-4 fragment (LKKTETQ), also known as TB-500:** “may pose risk for immunogenicity… aggregation as well as peptide-related impurities. FDA has not identified any human exposure data… FDA lacks important information… including whether it would cause harm if administered to humans.”
- **Melanotan II:** “may pose risk for immunogenicity… Published case reports discuss serious adverse events including melanoma, posterior reversible encephalopathy syndrome, sympathomimetic toxidrome and priapism.”
- Also withdrawn (PepCodex-covered): AOD-9604, cathelicidin LL-37, CJC-1295, dihexa acetate, emideltide (DSIP), epitalon, GHK-Cu (injectable), KPV, PEG-MGF, MOTs-C, selank acetate, semax (heptapeptide), thymosin-alpha 1.

**FACT:** Withdrawal from Category 2 is **not** placement on the 503A bulks list and is **not** FDA drug approval.  
**FACT:** BPC-157, TB-500, and Melanotan II are **not** in the live Category 2 table as of the 2026-04-22 page.  
**INFERENCE:** Calling them “Category 2 banned” as a current status is outdated; calling withdrawal a green light to compound is also wrong.

### 1.3 PCAC July 23–24, 2026 — meeting happened; votes not posted

| Field | Value |
|---|---|
| Source | 91 FR 20465 (2026-04-16); https://www.federalregister.gov/documents/2026/04/16/2026-07361/… ; FDA meeting page https://www.fda.gov/advisory-committees/advisory-committee-calendar/july-23-24-2026-meeting-pharmacy-compounding-advisory-committee-07232026 |
| Publisher | FDA / Federal Register |
| Dates | Notice 2026-04-16; meeting 2026-07-23 and 2026-07-24; meeting page content current **2026-08-06** |
| Access date | 2026-09-02 |

**FACT (91 FR 20465):** Committee to discuss 503A bulks-list nominations: July 23 — BPC-157 (UC), KPV (wound healing/inflammatory conditions), TB-500 (wound healing), MOTS-c (obesity and osteoporosis). July 24 — emideltide/DSIP, Semax, Epitalon.

**FACT (FDA briefing intro, https://www.fda.gov/media/193342/download):** “FDA is proposing that BPC-157 (free base) NOT be included on the 503A Bulks List.” Staff presentations (https://www.fda.gov/media/193773/download) also propose **not** to include TB-500 free base/acetate.

**FACT (FDA advisory-committee explainer on the meeting page):** “Advisory committees make **non-binding recommendations** to the FDA, which generally follows the recommendations but is **not legally bound** to do so.”

**UNKNOWN:** Official vote tally. The 2026-08-06 meeting page lists briefing docs, agenda, questions, roster, and staff slides. It does **not** list minutes, a transcript, or vote results. Secondary press reports of 8–6 recommendations are **not** used here as FDA decisions.

**FACT:** No final rule adding BPC-157 or TB-500 to the 503A bulks list was located on 2026-09-02.

### 1.4 GLP-1 shortage window closed; 503B exclusion proposed, not finalized

| Field | Value |
|---|---|
| Source | https://www.fda.gov/drugs/drug-alerts-and-statements/fda-clarifies-policies-compounders-national-glp-1-supply-begins-stabilize |
| Publisher | U.S. FDA |
| Content current as of | **2026-04-01** |
| Access date | 2026-09-02 |
| Classification | FACT |

Dated FDA statements on that page:

- **Tirzepatide injection shortage resolved** (re-determination **2024-12-19** after an earlier 2024-10-02 determination was remanded). 503A enforcement discretion through **2025-02-18**; 503B through **2025-03-19**. District court denied OFA preliminary injunction **2025-03-05**; 503A discretion then ended.
- **Semaglutide injection shortage resolved 2025-02-21.** 503A discretion through **2025-04-22**; 503B through **2025-05-22**. District court denied OFA PI on semaglutide **2025-04-24**; 503A discretion ended; 503B still ran to 2025-05-22.
- **2026-04-01 reminder:** 503A may not compound, regularly or in inordinate amounts, drugs that are **essentially copies** of a commercially available product. FDA may treat semaglutide + B12 as an essentially-a-copy combo when route matches and strengths are within 10%. Discretion for four or fewer such prescriptions per calendar month. **“Tirzepatide and semaglutide do not currently appear on the 503B bulks list or on FDA’s drug shortage list.”**

**503B clinical-need proposal (not a final list decision):**

| Field | Value |
|---|---|
| Source | 91 FR 23431 (2026-05-01), https://www.federalregister.gov/documents/2026/05/01/2026-08552/… ; FDA press https://www.fda.gov/news-events/press-announcements/fda-proposes-exclude-semaglutide-tirzepatide-and-liraglutide-503b-bulks-list |
| Dates | Proposal 2026-04-30 / FR 2026-05-01; comments originally due 2026-06-30; extended 91 FR 38719 (2026-06-26) |
| Classification | FACT that it is a **proposal**. Final determination: **UNKNOWN** (not located 2026-09-02). |

**Quote (FR summary):** “This notice identifies three bulk drug substances that FDA has considered and proposes **not** to include on the 503B Bulks List: semaglutide, tirzepatide, and liraglutide.”

**Liraglutide shortage (partial):** FDA compounding-policy page still listed liraglutide injection “in shortage” as of the 2025-02-21 snapshot on that page. FDA Drug Shortages homepage snippets accessed 2026-09-02 still showed liraglutide injection **Currently in Shortage** updates dated 2026-08-25 and 2026-08-27, plus an 2026-08-25 discontinuation line. Presentation-level status was **not** fully enumerated. **UNKNOWN** at SKU level.

**PepCodex pages this would affect:**  
`src/content/blog/fda-compounding-oversight.mdx`, `fda-compounded-semaglutide-warning.mdx`, `fda-semaglutide-shortage-extended.mdx`, `fda-tightens-peptide-compounding-rules.mdx`, `glp1-shortage-easing.mdx`, `src/content/peptides/{semaglutide,tirzepatide,bpc-157,tb-500,melanotan-ii,ipamorelin,cjc-1295,ghrp-2,ghrp-6,kisspeptin,mk-677}.mdx`, `src/pages/regulatory-tracker.astro`, `src/pages/clinics/index.astro`, `src/pages/clinics/[city].astro`.

**INFERENCE (not a finding of violation):** PepCodex compounding blogs sampled here generally track the shortage-end dates and the Category 2 withdrawal distinction. Clinic-directory copy that treats BPC-157 / TB-500 / CJC-1295 / ipamorelin as routinely offered from “FDA-registered compounding pharmacies” is the higher-risk mismatch (see §6).

---

## 2. FDA safety communications on compounded GLP-1s, and boxed warnings

### 2.1 Standing FDA communication on unapproved GLP-1s

| Field | Value |
|---|---|
| Source | https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss |
| Publisher | U.S. FDA |
| Content current as of | **2026-09-01** |
| Access date | 2026-09-02 |
| Classification | FACT |

**Quotes / listed facts:**

- “Compounded drugs should only be used in patients whose medical needs cannot be met by an FDA-approved drug.”
- “Compounded drugs are not FDA approved. This means the agency does not review compounded drugs for safety, effectiveness or quality before they are marketed.”
- **“Retatrutide and cagrilintide cannot be used in compounding under federal law. Additionally, these are not components of FDA-approved drugs and have not been found safe and effective for any condition.”** FDA has warned telehealth companies, API distributors, and outsourcing facilities over retatrutide.
- Salt forms: “semaglutide sodium and semaglutide acetate… are different active ingredients than are used in the approved drugs… we are not aware of any lawful basis for their use in compounding.”
- Multidose vials: discard within 28 days of first use.
- Cold chain: do not use injectable GLP-1s that arrive warm.
- Fraudulent labels: pharmacies named on the label that do not exist or did not compound the product.
- Dosing errors with compounded injectable semaglutide; some hospitalizations. Also reports of doses beyond the approved label.
- Adverse events **as of 2026-05-31:** **990** reports associated with compounded semaglutide; **more than 730** with compounded tirzepatide. Underreporting likely because 503A pharmacies that are not outsourcing facilities are not required to submit AEs to FDA.
- Illegal “research purposes” / “not for human consumption” sales of semaglutide, tirzepatide, **retatrutide, survodutide or mazdutide**.

Related FDA page (dosing errors): https://www.fda.gov/drugs/human-drug-compounding/fda-alerts-health-care-providers-compounders-and-patients-dosing-errors-associated-compounded (accessed 2026-09-02).

**PepCodex:** `fda-compounded-semaglutide-warning.mdx` (lastUpdated 2026-08-17) matches the 990 / 730 figures and salt-form / dosing / cold-chain points. `retatrutide.mdx` already says not approved and not for compounding-style retail. **Gap (INFERENCE):** FDA’s explicit “cannot be used in compounding” sentence for **cagrilintide** is easy to miss on CagriSema pages.

### 2.2 Boxed warning: thyroid C-cell tumors / MTC / MEN2

Current FDA labels (access 2026-09-02) still carry the class boxed warning for GLP-1 receptor agonists with rodent C-cell findings.

**Wegovy injection** (NDA 215256 label, e.g. https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/215256s033lbl.pdf, revised 02/2026):

> “WARNING: RISK OF THYROID C-CELL TUMORS … In rodents, semaglutide causes thyroid C-cell tumors at clinically relevant exposures. It is unknown whether WEGOVY causes thyroid C-cell tumors, including medullary thyroid carcinoma (MTC), in humans… WEGOVY is contraindicated in patients with a personal or family history of MTC or in patients with Multiple Endocrine Neoplasia syndrome type 2 (MEN 2).”

**Ozempic / Rybelsus / Ozempic tablets** (NDA 209637 / 213051 labels, 2026 revisions): same boxed warning language for semaglutide.

**Mounjaro** (NDA 215866, 2026 label https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/215866s044s045lbl.pdf):

> “Tirzepatide causes thyroid C-cell tumors in rats. It is unknown whether MOUNJARO causes thyroid C-cell tumors, including medullary thyroid carcinoma (MTC), in humans… MOUNJARO is contraindicated in patients with a personal or family history of MTC or in patients with Multiple Endocrine Neoplasia syndrome type 2 (MEN 2).”

**Zepbound:** same boxed warning (patient labeling on accessdata SPL).

**Foundayo (orforglipron)** — FDA press, 2026-04-01 (https://www.fda.gov/news-events/press-announcements/fda-approves-first-new-molecular-entity-under-national-priority-voucher-program):

> “The labeling for Foundayo includes a boxed warning for thyroid C-cell tumors. Foundayo should not be used in patients with a personal or family history of medullary thyroid cancer or in patients with Multiple Endocrine Neoplasia syndrome type 2.”

Also: “It should not be used in combination with another GLP-1 receptor agonist.”

**Saxenda (liraglutide):** boxed warning remains on 2026 labels.

**DailyMed:** host DNS failed on this machine. Label text above is from FDA label PDFs / FDA press, not DailyMed HTML.

**PepCodex mapping:**

- Present on `src/content/safety/semaglutide-safety.mdx`, `tirzepatide-safety.mdx`, liraglutide dossier, some guides (`what-is-wegovy.mdx`, `what-is-zepbound.mdx`).
- **`src/content/peptides/orforglipron.mdx`:** grep found **no** “boxed”, “thyroid”, or “MEN” string. **FACT about the file.** **INFERENCE:** the Foundayo boxed warning is not on the dossier as of this pack.
- **`src/content/peptides/semaglutide.mdx`:** grep found **no** “boxed” / “thyroid C-cell” in that dossier file (safety lives on a sibling safety page).
- `orforglipron.mdx` `qualityChecklist.goodSigns` still says “Clear dosing instructions (12mg, 24mg, or 36mg once daily)” — those are **trial** doses. FDA press states approved titration **0.8 → 2.5 → 5.5 mg**, then 9 / 14.5 / 17.2 mg. **FACT mismatch vs current FDA dosing description.** (Pack does not treat trial doses as fabricated; they are the wrong object for a “FDA-approved product” checklist.)

---

## 3. Tesamorelin (Egrifta) — labeled indication is HIV-associated lipodystrophy, not general fat loss

| Field | Value |
|---|---|
| Source | DailyMed index snippet for EGRIFTA SV (setid 3d783378-b02d-4f19-99dd-0fc91a042224), updated in index 2026-07-29; Drugs@FDA BLA 022505 (2010 approval) is the application the dossier cites |
| Publisher | NIH DailyMed / FDA |
| Access date | 2026-09-02 |
| DailyMed HTML | DNS failed; indication taken from DailyMed search-index extract |
| Classification | FACT (indication text); full current PI not re-downloaded as PDF |

**Quote (DailyMed highlights):** “EGRIFTA SV is a growth hormone-releasing factor (GHRF) analog indicated for the reduction of excess abdominal fat in HIV-infected adult patients with lipodystrophy.” Limitations of use include: “Not indicated for weight loss management.” “Long-term cardiovascular safety of EGRIFTA SV has not been established.” “There are no data to support improved compliance with anti-retroviral therapies…”

Contraindications listed in the same extract: disruption of the hypothalamic-pituitary axis; active malignancy; known hypersensitivity; pregnancy. Warnings include increased risk of neoplasms and elevated IGF-1.

**PepCodex:** `src/content/peptides/tesamorelin.mdx` `regulatoryStatus` (lastUpdated 2026-08-06) states FDA-approved as Egrifta (BLA 022505, 2010-11-10) “for the reduction of excess abdominal fat in HIV-infected patients with lipodystrophy. It is not approved for general weight loss, bodybuilding or anti-ageing use.” `src/content/blog/tesamorelin-liver-fat-hiv.mdx` (lastUpdated 2026-09-02) states the FDA label remains HIV lipodystrophy, not NAFLD, while discussing the Lancet HIV liver-fat RCT.

**INFERENCE:** Assigned tesamorelin pages align with the labeled indication. Off-label NAFLD discussion is labeled as trial evidence vs unchanged label.

---

## 4. Bremelanotide (Vyleesi) vs melanotan II / PT-141 research-use confusion

### 4.1 What is approved

| Field | Value |
|---|---|
| Source | FDA press, 2019-06-21, “FDA approves new treatment for hypoactive sexual desire disorder in premenopausal women”; label PDF excerpt (DailyMed setid 9146AE05-918B-483E-B86D-933485CE36EB) |
| Access date | 2026-09-02 |
| Classification | FACT |

**Indication:** Vyleesi (bremelanotide injection) for **premenopausal women with acquired, generalized hypoactive sexual desire disorder (HSDD)** not due to a co-existing medical/psychiatric condition, relationship problems, or a medication.

**Limitations of use (label):** “VYLEESI is not indicated for the treatment of HSDD in postmenopausal women or in men.” “VYLEESI is not indicated to enhance sexual performance.”

Dose (label): 1.75 mg SC in abdomen or thigh, as needed, ≥45 minutes before anticipated sexual activity.

**PepCodex `pt-141.mdx` `regulatoryStatus`:** FDA-approved as Vyleesi, NDA 210557, 2019-06-21, HSDD in premenopausal women; “use for erectile dysfunction or in men is not approved.” Aligns.

### 4.2 What is not approved

**Melanotan II** is not an FDA-approved drug. FDA Category 2 withdrawn table (content current 2026-04-22) records nominator withdrawal **and** FDA’s listed risks: immunogenicity / impurities plus published case reports of **melanoma, PRES, sympathomimetic toxidrome, and priapism**.

**PT-141** is the research code for bremelanotide. The approved product is a **prefilled autoinjector**. Compounded lyophilized “PT-141” is not Vyleesi.

**PepCodex `melanotan-ii.mdx`:** status `research-only`; notes Category 2 nomination withdrawn; “Significant safety concerns; not recommended for human use.” Aligns with FDA’s withdrawn-table language. Scoring notes still mention “FDA Category 2 restriction only” in one older scoring paragraph — **INFERENCE:** residual wording may overstate current Category 2 membership (the substance is on the **withdrawn** table, not the live Category 2 table).

**Clinic directory (`src/pages/clinics/index.astro`):** lists “PT-141: For sexual health and wellness” among peptides “most peptide clinics offer.” **INFERENCE:** that phrasing does not carry Vyleesi’s sex/indication limits.

---

## 5. Current approval status of named pipeline / new oral products

Rule used: **FDA / Drugs@FDA / FDA press / company official IR or press / NEJM / PubMed**. Blogs are not authority.

| Product | Official status as of 2026-09-02 | Classification | Key sources |
|---|---|---|---|
| **Oral semaglutide 25 mg / Wegovy tablets** | **FDA-approved 2025-12-22**, NDA **218316**, Novo Nordisk. Products: 1.5 / 4 / 9 / 25 mg tablets. Approval letter: reduce MACE in adults with established CV disease and obesity or overweight; reduce excess body weight and maintain weight reduction in adults with obesity or overweight plus ≥1 weight-related comorbidity. | FACT | Drugs@FDA NDA 218316; approval letter https://www.accessdata.fda.gov/drugsatfda_docs/appletter/2025/218316Orig1s000ltr.pdf |
| **Higher-dose oral semaglutide for T2D (25/50 mg as a T2D indication)** | **Not located as an approved T2D indication.** Rybelsus / Ozempic tablets remain the oral T2D franchise (NDA 213051). PIONEER PLUS is a published trial, not an approval. | FACT that T2D high-dose oral was not found on NDA 218316’s listed indications |
| **Orforglipron / Foundayo** | **FDA-approved 2026-04-01**, NDA **220934**, Eli Lilly. Listed as novel drug #11 of 2026. Indication: reduce excess body weight and maintain weight reduction long term in adults with obesity, or overweight with ≥1 weight-related comorbidity, with diet and activity. **Not described by FDA as approved for T2D.** Boxed warning for thyroid C-cell tumors (FDA press). | FACT | FDA press 2026-04-01; approval letter NDA 220934; https://www.fda.gov/drugs/novel-drug-approvals-fda/novel-drug-approvals-2026 (content current 2026-08-28) |
| **CagriSema (cagrilintide 2.4 mg / semaglutide 2.4 mg)** | **NDA filed** (Novo Nordisk, 2025-12-18). Company: “CagriSema is not approved in the US or EU” at filing. Novo Q1 2026 IR: “Submitted in the US.” **Not on FDA Novel Drug Approvals for 2026** through 2026-08-28. REDEFINE 1 published NEJM 2025; treatment-policy mean weight change **−20.4%** vs −3.0% placebo at 68 weeks (PMID 40544433). | FACT: filed, not listed as approved. Remaining FDA action: **UNKNOWN** | novonordisk.com news 2025-12-18; NEJM 10.1056/NEJMoa2502081; FDA novel-drug table |
| **Retatrutide** | **Not FDA-approved.** Lilly (updated story, 2026-07-23): “No. Retatrutide is not currently approved by the FDA.” Q2 2026 IR: clinical package complete to support registrations; **BLA planned Q1 2027**. FDA: “cannot be used in compounding.” TRANSCEND-T2D-1 published Lancet 2026 (PMID 42250575 per dossier). | FACT: not approved | https://www.lilly.com/news/stories/what-to-know-about-retatrutide ; Lilly Q2 2026 IR; FDA GLP-1 concerns page |
| **Pemvidutide** | **Not FDA-approved.** Altimmune: FDA **Breakthrough Therapy** (MASH, announced 2026-01-05) and **Fast Track** (MASH and AUD). PERFORMA Phase 3 **initiated** (company, 2026-08-03). Company: no NDA/MAA approval. | FACT: designations ≠ approval | ir.altimmune.com BTD release; pipeline page |
| **Survodutide** | **Not FDA-approved.** Boehringer (2026-06-03/07): “Survodutide is an investigational agent and has not been approved for use.” FDA Fast Track (May 2021) and Breakthrough Therapy (Sept 2024) for MASH (company-stated). SYNCHRONIZE-1 published NEJM 2026-06-07 (DOI 10.1056/NEJMoa2600751). LIVERAGE Phase 3 trials recruiting (NCT06632444, NCT06632457). **Not on FDA 2026 novel-drug table.** | FACT: not approved | boehringer-ingelheim.com; NEJM |

**PepCodex alignment (INFERENCE, assigned files only):**

- `semaglutide.mdx` regulatoryStatus: Wegovy tablets NDA 218316 approved 2025-12-22 — **matches Drugs@FDA**.
- `orforglipron.mdx`: Foundayo NDA 220934, 2026-04-01, weight management, not T2D — **matches FDA**. Residual issues: trial doses in qualityChecklist; no boxed warning in the dossier file.
- `cagrisema-nda-filed.mdx`: filing 2025-12-18, REDEFINE 1 20.4% — **matches Novo + NEJM**. Does not claim approval.
- `retatrutide.mdx`: investigational, no Drugs@FDA application as of 2026-08-06 dossier note. Still true as of Lilly 2026-07-23 page. TRIUMPH obesity **topline** later existed (Lilly 2025-12-11 and 2026-08-03); dossier said TRIUMPH had no PubMed records as of 2026-08-17 — that is a **literature-index** statement, not an approval claim. **UNKNOWN** whether peer-reviewed TRIUMPH papers exist after 2026-08-17; not required to invent them.
- Pemvidutide **filenames** `pemvidutide-eu-mash-approval.mdx` and `pemvidutide-crl-more-data.mdx` still imply approval/CRL; **bodies** (as read 2026-09-02) state not approved, no CRL, no filing. **INFERENCE:** URL/title debt vs corrected body.
- `survodutide-fda-submission-mash.mdx` title says “FDA Submission”; body describes BTD + Phase 3, not a located NDA. **INFERENCE:** title overreaches the body.

---

## 6. FTC endorsement / influencer / review rules (health directories and affiliate claims)

Assigned hub: https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews (accessed 2026-09-02). Hub HTML was thin; linked FTC documents were used.

### 6.1 What the FTC actually says

| Instrument | What it is | Date |
|---|---|---|
| 16 CFR Part 255, Guides Concerning the Use of Endorsements and Testimonials in Advertising | Guides (not a trade-regulation rule). FTC may treat noncompliance as unfair/deceptive under the FTC Act. Revised **2023-06**. | 2023-06-29 press; FR notice 2023-07-26 |
| 16 CFR Part 465, Trade Regulation Rule on the Use of Consumer Reviews and Testimonials | **Binding rule** on businesses (fake reviews, hijacked reviews, buying a particular sentiment, fake independent review sites, etc.) | Final rule materials linked from the hub; Q&A page https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers |
| Health Products Compliance Guidance | FTC health-claim substantiation: competent and reliable scientific evidence; testimonials are advertising claims | https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance |

**Material connections (FACT, Endorsement Guides FAQ):** Affiliate/commission relationships must be disclosed clearly and conspicuously. Example given: “I get commissions for purchases made through links in this post.”

**Endorsement content (FACT, same FAQ):** An endorsement must reflect the honest opinion of the endorser. Endorsers “shouldn’t talk about their experience with a product if they haven’t tried it, or make claims about a product that would require proof they don’t have.”

**16 CFR 465.6 (FACT, FTC Q&A):** Prohibits a business from misrepresenting that a website, organization, or entity it controls provides **independent** reviews or opinions about a category of businesses, products, or services, including its own.

**Health claims (FACT, Health Products Compliance Guidance):** Objective health/efficacy claims require substantiation the advertiser actually possesses. Disclaimers do not cure a false or unsubstantiated claim. Testimonials that imply typical results are treated as efficacy claims.

### 6.2 PepCodex surfaces this would affect (INFERENCE)

- `src/pages/editorial-policy.astro` — claims editorial independence, no financial interests in manufacturers/distributors, sponsors do not influence coverage. That is a **site representation**, not verified here.
- `src/pages/disclaimer.astro` / `fda-notice.astro` — “not medical advice,” “do not sell,” “do not provide sourcing.” Disclaimers do not, under FTC health-claim guidance, neutralize an efficacy claim elsewhere.
- Clinic directory: `src/pages/clinics/index.astro` states “We verify listings to ensure you're connecting with legitimate healthcare providers” and “Reputable clinics source their peptides from **FDA-registered compounding pharmacies**.” `src/pages/clinics/[city].astro` FAQ repeats compounding-pharmacy sourcing. INPUTS.md says clinics are currently deindexed; the copy still exists in repo.
- **INFERENCE:** “FDA-registered compounding pharmacies” is a common industry phrase. 503B outsourcing facilities register with FDA; 503A pharmacies are **state-licensed**. The phrase can read as FDA endorsement of the compounded peptide. FTC 465.6 is relevant if the directory is presented as independent clinic ratings.
- Affiliate: repo grep of `affiliate` in astro/mdx did **not** show live product-affiliate disclosures in content pages (only legal “affiliates” and scientific “unaffiliated”). INPUTS.md: affiliate/selling peptides **parked**. **FACT about the sampled files:** no product-affiliate disclosure language found. **UNKNOWN:** whether any live commercial relationship exists off-repo.

---

## 7. Google Search Central — helpful content and spam policies

| Page | URL | Last updated (page footer) | Access |
|---|---|---|---|
| Creating helpful, reliable, people-first content | https://developers.google.com/search/docs/fundamentals/creating-helpful-content | **2025-12-10 UTC** | 2026-09-02 |
| Spam policies for Google web search | https://developers.google.com/search/docs/essentials/spam-policies | **2026-08-28 UTC** | 2026-09-02 |

### 7.1 Helpful content / E-E-A-T / YMYL (FACT)

Google’s ranking systems “prioritize helpful, reliable information that's created to benefit people, and not content that's created to manipulate search engine rankings.”

Self-assessment questions include: original information; substantial description; not merely rewriting sources; titles that do not exaggerate; would you expect this in a printed encyclopedia.

**E-E-A-T:** experience, expertise, authoritativeness, trustworthiness. “Of these aspects, **trust is most important**.” “our systems give even more weight to content that aligns with strong E-E-A-T for topics that could significantly impact the **health**, financial stability, or safety of people… We call these ‘Your Money or Your Life’ topics, or **YMYL**.”

Search-engine-first warning signs include: lots of content on many topics hoping some ranks; extensive automation; mainly summarizing others; writing because a topic is trending; changing dates to seem fresh without substantial change.

AI/automation used “for the primary purpose of manipulating search rankings” is a **spam-policy** violation (scaled content), not merely low quality.

### 7.2 Spam policies most relevant to this site (FACT quotes)

**Scaled content abuse:** “when many pages are generated for the primary purpose of manipulating search rankings and not helping users… large amounts of unoriginal content that provides little to no value to users, no matter how it's created.” Examples include generative-AI mass pages, scraped/synonymized pages, stitching sources without value, “Creating multiple sites with the intent of hiding the scaled nature of the content.”

**Site reputation policy:** third-party content published on a host “mainly because of that host's already-established ranking signals.” August 2026 update noted for EEA treatment of manual actions vs separate ranking. Medical-site example of a low-quality third-party “best casinos” page is given as inconsistent.

**Expired domain abuse:** buying an expired domain “primarily to manipulate search rankings by hosting content that provides little to no value.” Example: “Commercial medical products being sold on a site previously used by a non-profit medical charity.”

**Doorway abuse:** pages created to rank for specific similar queries that lead users to intermediate pages “that aren't as useful as the final destination.” Examples include multiple city-targeted pages that funnel users to one page; “substantially similar pages that are closer to search results than a clearly defined, browseable hierarchy.”

**Thin affiliation:** affiliate pages that copy merchant descriptions without original value.

### 7.3 PepCodex mapping (INFERENCE only)

- Peptide dossiers + large blog set + city/clinic templates sit in **YMYL health**. Google’s rater concepts reward sourcing, author identity, and first-hand/editorial control — which `editorial-policy.astro` claims.
- **Doorway risk** is the clinic/city URL class (`src/pages/clinics/`, `src/content/cities/`), if many thin geo pages exist primarily to rank for “[city] peptide clinic.” INPUTS.md already deindexes clinics; `noindex` does not, per project rules, save crawl budget by itself.
- **Scaled-content risk** is a function of uniqueness and care per URL, not raw count. This pack does **not** grade writing quality.
- **Expired-domain / site-reputation / thin-affiliate:** no evidence in the assigned files of an expired-domain play or live product-affiliate network. **UNKNOWN** off-repo.

---

## 8. Retractions and safety notices touching peptides the site covers (sample)

**Coverage limit:** This is a **sample**, not a site-wide PMID-to-retraction join. No automated scan of every dossier PMID against PubMed `retracted publication`.

### 8.1 Confirmed withdrawal / retraction adjacent to site topics

| Item | Official record | On PepCodex? | Classification |
|---|---|---|---|
| “Stable Gastric Pentadecapeptide BPC 157 as a Therapy of Severe Electrolyte Disturbances in Rats” | PubMed PMID **39865815**, *Curr Neuropharmacol*, withdrawn at authors’ request; record titled “Withdrawn: …” (2025-01-24) | **Not cited** (repo grep of `39865815` = no hits) | FACT |
| International Journal of Obesity GLP-1 combination paper (May 2024), retracted after statistical critique (Retraction Watch 2026-02-23; journal action Dec) | Secondary (Retraction Watch). Full retraction notice not re-fetched from IJO | **Not systematically checked** against site PMIDs | UNKNOWN whether PepCodex cites it |

### 8.2 FDA safety / enforcement notices (not retractions)

- Compounded GLP-1 AE counts and quality issues: §2.1 (FACT).
- FDA warning letters posted ~2026-08-24 to research-peptide sellers (Peak Performance Peptides, Royal Peptides LLC, NuScience Peptides LLC, Peptide Partners LLC, TXP Innovations LLC dba Tex Peptides), subject “Unapproved New Drugs/Misbranded” (FDA warning-letter index, posted 2026-09-01). **FACT** that letters exist. This pack did not open each letter body. PepCodex states it does not sell or source.
- Melanotan II: FDA withdrawn Category 2 safety note listing melanoma, PRES, toxidrome, priapism (FACT, §1.2).
- BPC-157 FDA staff briefing (July 2026 PCAC): FAERS cases on compounded injectables mentioned in secondary Drug Topics coverage of FDA staff docs. Primary FAERS case list was **not** independently re-extracted from the 3.64 MB briefing PDF in this pack. Treat as **lead**, not counted fact.

### 8.3 What this sample does **not** show

- It does **not** prove PepCodex citations are clean.
- It does **not** prove they are dirty.
- A withdrawn BPC-157 paper exists in PubMed and is not used on the site (good for that PMID only).

---

## Crosswalk: assigned PepCodex legal/policy pages vs current official sources

| Page | Last updated on page | What it does | Gap vs 2026-09-02 official sources (INFERENCE) |
|---|---|---|---|
| `src/pages/fda-notice.astro` | January 2026 | DSHEA-style “not evaluated by FDA”; buckets peptides as approved / investigational / research chemical / dietary supplement; MedWatch; no sourcing | Does **not** mention 503A/503B, Category 2, GLP-1 shortage end, “essentially a copy,” or that retatrutide/cagrilintide cannot be compounded. DSHEA supplement bucket is legally real for some products; it is easy to misread as covering injectable research peptides. |
| `src/pages/disclaimer.astro` | January 2026 | Educational only; not medical advice; no dosing/sourcing | Standard. Does not substitute for labeled boxed warnings on product pages. |
| `src/pages/editorial-policy.astro` | January 2026 | Independence; citation verification; no dosing/sourcing; corrections policy | Claims “every cited source is verified to exist and accurately represent the claim” and automated PMID/DOI/NCT existence checks. Existence ≠ topical support (a known integrity class in this repo’s lessons). Not re-audited here. |
| Compounding blogs | various; several corrected 2026-09-01/02 | Shortage end dates, Category 2 withdrawal, no 2025/2026 “final BPC ban” document | Bodies sampled are closer to FDA pages than older titles. Residual risk is **filename/title** (`pemvidutide-eu-mash-approval`, `pemvidutide-crl-more-data`, `survodutide-fda-submission-mash`, `fda-semaglutide-shortage-extended`, `wegovy-pill-launches-us`). |
| Clinic directory | live in repo; deindexed per INPUTS | “FDA-registered compounding pharmacies”; lists BPC-157, semaglutide/tirzepatide, CJC/ipamorelin, PT-141, TB-4 as commonly offered | Highest compounding-law + FTC mismatch in the assigned set. |

---

## Unknowns (do not invent)

1. FDA PCAC **vote counts** and whether FDA will follow staff’s “do not include” proposal for BPC-157 / TB-500. No minutes on the 2026-08-06 meeting page.
2. Whether the 503B **proposal** excluding semaglutide / tirzepatide / liraglutide has been **finalized**.
3. CagriSema **FDA decision** after the 2025-12-18 NDA (not on the 2026 novel-drug list through 2026-08-28).
4. Liraglutide **presentation-level** shortage vs discontinuation as of 2026-09-02.
5. Full DailyMed HTML for Egrifta / Vyleesi / Foundayo (DNS failure). Indication text was recovered from FDA/DailyMed index; Foundayo boxed warning from FDA press.
6. Site-wide retraction incidence among cited PMIDs.
7. Any live affiliate, clinic-payment, or “verified listing” commercial terms (off-repo).
8. Whether TRIUMPH obesity trials have peer-reviewed papers after the dossier’s 2026-08-17 PubMed note.

---

## Method notes

- Official pages were opened with live fetch on 2026-09-02. Publication/update dates are the page’s own “content current as of,” FR citation date, or label revision date — not the access date.
- Secondary journalism (MedPage, Reuters, Drug Topics, STAT, compounding blogs) was used only as a **lead** to find the official URL. Status claims in this pack rest on FDA, Federal Register, Drugs@FDA, company IR/press, NEJM/PubMed, FTC, or Google Search Central.
- Did not read `.planning/master-audit-2026-09-02/audit-a|b|c` reports.
- Did not modify the site.
