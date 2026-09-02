# Dissent log — Council Judge

**Rule:** disagreements resolved by source authority, not majority vote. Dissent preserved.

## D-001 — BPC protocol PMID count (“6/7 unrelated”)

- **A REPORT.md:** “6/7 BPC-157+TB-500 protocol PMIDs resolve to unrelated papers.”
- **A FINDINGS.json A-001:** lists six IDs as mismatched, including PMID 30915550 as “Gwyer D 2019 review of BPC-157, not Sikiric 2018,” and **does not** list PMID 25415472 as wrong.
- **Chair instruction:** check whether 30915550 and 25415472 are on-topic-but-misattributed vs wholly wrong. Do not accept 6/7 if the count is wrong.
- **Judge NCBI esummary 2026-09-02:**

| PMID | Stored claim | NCBI title / first author | Judge class |
|---|---|---|---|
| 30915550 | Sikiric 2018 animal, 10 mcg/kg | Gwyer D, *Cell Tissue Res* 2019, BPC 157 musculoskeletal review | **On-topic, mis-attributed** (wrong author, year, studyType, invented doses) |
| 25415472 | Chang 2014 in-vitro GH receptor in tendon fibroblasts | Chang CH, *Molecules* 2014, same title | **Correct match** |
| 7521621 | Sikiric 1994 human-rct 0.2–2.0 mg/day oral | Laudico AV, cancer pain, Philippines | Wholly unrelated + invented human RCT doses |
| 10401867 | Malinda 1999 TB-4 | Møller H, cryptorchidism editorial | Wholly unrelated |
| 15543145 | Bock-Marquette 2004 | Anton ES, ErbB4 neuroblast migration | Wholly unrelated |
| 22156923 | Goldstein 2012 TB-4 | Nakao A, pancreatic-cancer portal-vein invasion | Wholly unrelated |
| 32156553 | Sikiric 2020 IBD | Peña-Lucio EM, coffee-pulp fermentation | Wholly unrelated |

- **Resolution:** **Reject the 6/7 count.** Accept 5/7 wholly unrelated + 1/7 on-topic mis-attribution + 1/7 correct. Severity remains CRITICAL because of the fabricated human RCT on 7521621 and five domain-distant PubMed links.
- **Authority:** NCBI esummary > auditor summary phrasing.

## D-002 — Calculator action (REMOVE vs QUALIFY)

- **A-011:** REMOVE reconstitution calculators (`desired dose` → volume).
- **B-011:** QUALIFY (rename field; do not add URLs; no HowTo schema).
- **Judge:** The banned-content collision is FACT. Tesamorelin is an approved product with a manufacturer reconstitution method the page itself says is not interchangeable. Sister tools cover unapproved peptides. Action is a legal/product decision, not a fact dispute.
- **Disposition:** ACCEPT WITH REVISION. Severity HIGH. Action = **legal + medical review**; default operational recommendation is unpublish or strip “desired dose” / peptide-typical vials. Do not add calculators.

## D-003 — FDA Category 2 membership (C-007 vs regulatory pack vs A-008)

- **C-007:** “FDA Category 2 / significant-safety-risk pages list BPC-157 and LL-37 among others.”
- **A-008:** more careful — withdrawn nominations still documented; ipamorelin acetate remains 503B Category 2; FDA staff proposed NOT listing BPC-157.
- **Regulatory pack (FDA page content current 2026-04-22, Judge re-opened):** Live Category 2 table does **not** contain BPC-157, TB-500, Melanotan II, LL-37, CJC-1295. Those sit on **nominated but withdrawn**. Live Category 2 includes GHRP-2, GHRP-6, ibutamoren, ipamorelin acetate (503B), kisspeptin-10 (503A).
- **Resolution:** C-007 ACCEPT WITH REVISION. Authority = FDA compounding page, not Drug Topics or a collapsed “Category 2 concerns” phrase. Clinic menus offering those peptides as therapy remain HIGH regardless of table membership.

## D-004 — SS-31 / Forzinity (A-018)

- **A-018:** status `approved` without Barth-only qualifier; meta “in clinical trials.”
- **File (Judge):** `ss-31.mdx` `regulatoryStatus.notes` already states Forzinity NDA 215244, 19 Sep 2025, **Barth syndrome only**; other mitochondrial uses investigational.
- **FDA press (Judge re-opened):** accelerated approval 2025-09-19, ≥30 kg, knee extensor strength surrogate, confirmatory trial required.
- **Resolution:** ACCEPT WITH REVISION. The **metaDescription** (“in clinical trials. Updated Feb 2026”) is stale. The notes are already indication-specific. The dangerous part is A-004’s template: if someone “fixes” the banner to a generic FDA Approved chip, Barth-only will be lost. Do not flatten.

## D-005 — NCT07437547 (A-013)

- **A:** format real; drug-match not fully pulled.
- **Judge:** ClinicalTrials.gov NCT07437547 is “BPC 157 for Acute Hamstring Muscle Strain Repair,” intervention pentadecapeptide BPC 157, Hudson Biotech, recruiting. **Drug-match passes.**
- **Resolution:** Keep A-013 HIGH for the fake `PLIVA-IBD-Trials` ID (live ClinicalTrials.gov link), animal→human timeline, and synergistic stack. Do **not** treat NCT07437547 as fabricated.

## D-006 — B-025 SURMOUNT-1 22.5% (preliminary vs live)

- **B:** PRELIMINARY; snippet + project lessons; did not re-open NEJM.
- **Judge:** live `/blog/semaglutide-vs-tirzepatide-2026` table **does** say SURMOUNT-1 22.5% vs 2.4% and cites PMID 35658024. STEP 1 14.9% on the same page matches PMID 33567185. Judge did **not** re-open the NEJM PDF table; project lessons record treatment-regimen **20.9%** vs efficacy estimand 22.5%.
- **Resolution:** ACCEPT WITH REVISION. On-page 22.5% is FACT. Calling 22.5% the paper’s headline estimand remains NEEDS EXPERT REVIEW / label-the-estimand, not a fabrication finding. Cannibalization vs `/compare/tirzepatide-vs-semaglutide` is FACT.

## D-007 — Completeness (C COMPLETE vs A/B INCOMPLETE)

- **C STATUS.txt:** `COMPLETE` with access limits listed below.
- **Freeze + INPUTS:** GSC/GA4 live pull blocked; do not claim completeness if analytics/private content inaccessible.
- **A and B:** INCOMPLETE, correctly.
- **Resolution:** Reject C’s COMPLETE stamp (see REJECTED.md). Combined audit cannot inherit it. Judge STATUS is COMPLETE for *this judging assignment*, not for site-wide line-by-line coverage.

## D-008 — Featured listings: paid or demo?

- **C-004:** Featured ribbon + “priority placement” CTA; advertising policy has no clinic SKU; Current Sponsors empty.
- **A:** health-claim/monetization collision; Featured Partners are placeholders.
- **Judge:** No dashboard, invoice, or sponsor name in repo. Whether money changed hands is **UNVERIFIABLE**. Deception from fake Featured+Verified cards does not require a payment to be true.
- **Resolution:** ACCEPT the unlabeled ranking + fake businesses. Do not assert a live paid SKU as FACT.

## D-009 — WADA on approved GLP-1s (A-004)

- **A:** WADA 2026: semaglutide/tirzepatide monitored, not prohibited; BPC-157 S0; TB-500/Tβ4 S2. Official PDF “not opened.”
- **Judge:** Official 2026 List PDF extract: S0 explicitly names BPC-157. Official 2026 Monitoring Program PDF: “Markers of Semaglutide and Tirzepatide” in- and out-of-competition. Sport Integrity Australia 2026 update: urine monitoring of semaglutide includes tirzepatide.
- **Resolution:** A-004 WADA limb **ACCEPT** (no longer merely secondary). Tesamorelin is FDA-approved **and** a GHRH analogue — approved-drug ≠ WADA-permitted. A generic “WADA Prohibited” stamp is still false for semaglutide.

## D-010 — Live CagriSema approval blog (coverage)

- **A/B:** treated `/blog/cagrilintide-semaglutide-approval` as a repo-not-in-live sitemap mismatch / rewrite candidate. Working-tree body (lastUpdated 2026-09-02) says **not approved**, REDEFINE-1 **20.4%**.
- **Judge live GET 2026-09-02:** production title “CagriSema FDA Approved”; body “The U.S. Food and Drug Administration has approved CagriSema”; 22.7% at 68 weeks; PubMed search-links as “sources.”
- **Regulatory pack / Novo:** NDA filed 2025-12-18; not on FDA novel-drug 2026 list through 2026-08-28.
- **Resolution:** This is a **Judge-owned CRITICAL** (`M-LIVE-CAGRISEMA`). Majority silence is not evidence of absence. Production ≠ branch.

## D-011 — InteractionMatrix “Generally safe to combine”

- **Templates pack:** hardcoded for every `compatible` row.
- **A/B/C:** not a numbered finding.
- **Judge:** string exists at `InteractionMatrix.astro` L61. Multiplied onto dossiers that list compatible interactions (live BPC-157 “Compatible” rows).
- **Resolution:** ACCEPT as MEDIUM Judge/templates finding. Not majority-voted into existence.

## D-012 — Peptide-condition “may have regulatory approval”

- **Templates pack:** `{high|moderate ? 'may have' : 'has not received'} regulatory approval` from `evidenceStrength`, not `regulatoryStatus`.
- **Judge confirmed** `src/pages/peptides/[peptide]/[condition].astro` L275. 295 URLs.
- **B-005** covered thin/IA, not this sentence.
- **Resolution:** ACCEPT HIGH (`M-PC-APPROVAL`). Evidence grade is not an approval.

## D-013 — A-024 homepage featuring BPC-157

- **A** called it weakest; product choice vs false number.
- **Judge:** prominence is not a false citation. Keep MEDIUM, QUALIFY, do not elevate to CRITICAL.
