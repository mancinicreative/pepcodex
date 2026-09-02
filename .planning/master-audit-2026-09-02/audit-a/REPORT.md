# Audit A — Medical Evidence Editor Report

**Project:** pepcodex.com (peptide-library working tree `feat/scoring-and-freshness` + live `https://www.pepcodex.com`)  
**Audit date:** 2026-09-02  
**Mode:** AUDIT ONLY  
**Jurisdiction:** United States primary  

---

## 1. Auditor name and specialization

**Auditor A** — skeptical medical evidence editor and fact-checker.

Lens: material medical, biological, safety, efficacy, regulatory, legal, credential, price, availability, and numerical claims. Citation-to-wording match. Animal→human, mechanism→benefit, association→causation, subgroup→population. Omitted risks. Titles/schema/FAQ/CTA stronger than body. Live vs working-tree mismatch.

This is not the consolidated report. Audits B and C were not read.

---

## 2. Inventory assigned, inspected, inaccessible, omitted

Frozen inventory: **1343** surfaces (`.planning/master-audit-2026-09-02/INVENTORY-COMPACT.json`).

| Status | Count | % of 1343 |
|---|---:|---:|
| INSPECTED | 252 | 18.8% |
| SAMPLED | 1091 | 81.2% |
| INACCESSIBLE | 0 | 0% |
| OMITTED | 0 | 0% |

**INSPECTED (required deep-read):** all 10 trust pages; homepage; `/directory`; `/clinics` index; `clinics/[city].astro` FAQ/schema (live Miami); all 52 clinic records (CSV + representative MDX); all 4 calculators; all 3 protocols (PMID-resolved); listed templates (BaseLayout, DossierLayout, ComparisonLayout, BlogLayout, CalculatorLayout, ProtocolLayout, FAQSchema, DrugSchema, OrganizationSchema, ClinicCard, FeaturedClinicCard, ExitIntentPopup, DisclaimerBanner, SafetyBanner, RatingCard, EvidenceChain, QualityChecklist); 20 named peptide dossiers (frontmatter + substantial body; live semaglutide, bpc-157, orforglipron); all 31 safety files (full read of GLP-1/BPC/TB-500/melanotan/retatrutide; claim-scan of the rest); all 36 guides (full read of what-is-bpc-157; claim-scan of the rest); 60 city pages via the single template that generates them.

**SAMPLED:** remaining peptides, comparisons, glossary, blog, peptide-condition, conditions, source-packs, indexes, APIs, machines — frontmatter title/description/dates/robots + first and last material body claim via extractor (`_sample-extract.json`). Stratified ≥20% of remaining peptides/comparisons/glossary/blog/peptide-condition.

**Live probes (2026-09-02):** `/`, `/peptides/semaglutide`, `/peptides/bpc-157`, `/peptides/orforglipron`, `/clinics/miami`, plus freeze probes `/clinics`, `/directory` (all HTTP 200 except apex 308). GSC/GA4 live pull UNAVAILABLE. DailyMed hostname DNS failed in-tool; boxed-warning wording taken from search-indexed DailyMed/FDA label excerpts and marked PARTIALLY SUPPORTED in the evidence ledger.

**Working tree ≠ live.** Production semaglutide shows 95 sources / last revised 13 Apr 2026; working tree 67 sources / 17 Aug 2026. Production orforglipron is still Investigational; working tree records Foundayo approval. Hardcoded false FDA/WADA banners are on **both**.

Coverage table: `COVERAGE.json`. Remaining not-line-by-line IDs: `COVERAGE.json` → `summary.remaining_not_line_by_line` and `STATUS.txt`.

---

## 3. Findings ledger (atomic)

Full records: `FINDINGS.json`. Highest-severity first.

| ID | Sev | Surface | Issue |
|---|---|---|---|
| A-001 | CRITICAL | PROTOCOL-1094 | 6/7 BPC-157+TB-500 protocol PMIDs resolve to unrelated papers; invented human 0.2–2.0 mg/day “RCT”. |
| A-002 | CRITICAL | PROTOCOL-1095 | CJC-1295+ipamorelin protocol: sequential/wrong PMIDs with human mcg/kg doses. |
| A-003 | CRITICAL | PROTOCOL-1096 | GH-secretagogue protocol: Bowers/Falutz/Chapman/etc. PMIDs are trypanosome, haemochromatosis, IOL, NMDA, tamoxifen papers. |
| A-004 | CRITICAL | TEMPLATE-1271 | Every dossier hardcodes “Not FDA Approved” + “WADA Prohibited” + DrugSchema “research use only / subcutaneous”. **Live on Ozempic/Wegovy.** |
| A-005 | CRITICAL | TEMPLATE-1278 | SafetyBanner defaults (“not approved for human use”, “limited human trial data”) always fire because `safetyInfo` is never passed. |
| A-006 | CRITICAL | CLINIC-RECORD-1226 + all 52 | Placeholder clinics (`example.com`, 555 numbers) marked Verified; 3 Featured Partners. **Live Miami.** |
| A-007 | CRITICAL | TEMPLATE-1297 | City FAQ schema: “verified providers have been vetted”; typical BPC-157 offering; $100–$300 consults. Multiplied ×60. |
| A-008 | HIGH | TEMPLATE-1297 | “Peptides from FDA-registered compounding pharmacies” + BPC-157 “for tissue repair” as clinic standard. |
| A-009 | HIGH | TEMPLATE-1271 / PEPTIDE-0026 | Quality checklist labeled **Sourcing**; teaches inspection of research-chemical BPC-157 vials. **Live.** |
| A-010 | HIGH | PEPTIDE-0229 | Orforglipron: live still investigational; quality checklist 12/24/**36 mg** vs Foundayo max **17.2 mg** (FDA 2026-04-01). |
| A-011 | HIGH | CALCULATOR-1115 + 3 siblings | Reconstitution calculators take “desired dose (mcg)” and return draw volume. |
| A-012 | HIGH | PEPTIDE-0334 | TB-500 graded **moderate** / “shown to” using parent Tβ4 papers; sequence LKKTETQ vs chainLength 43. |
| A-013 | HIGH | PEPTIDE-0026 | BPC-157 rodent timeline as “what to expect”; synergistic stack; fake NCT `PLIVA-IBD-Trials`. |
| A-014 | HIGH | SAFETY-0730 | Semaglutide boxed warning reduced to “theoretical thyroid tumors”; nausea 15–20% vs live body 30–45% vs Wegovy label ~40%+; pulmonary aspiration omitted. |
| A-015 | HIGH | SAFETY-0723 / PEPTIDE-0194 | Melanotan melanoma called “theoretical” despite cited case reports (PMID 24355990, 19575725) and FDA compounding note. |
| A-016 | HIGH | DIRECTORY-1252 | Clinics index meta: “verified” clinics offering BPC-157. |
| A-017 | HIGH | TRUST-1239 | Editorial policy claims every PMID is verified to represent the claim — falsified by A-001–A-003. |
| A-018 | HIGH | PEPTIDE-0318 | SS-31 “approved” without Barth-only accelerated-approval / surrogate-endpoint qualifier (Forzinity 2025-09-19). |
| A-019 | MEDIUM | DIRECTORY-1237 | `/directory` “coming soon” still promises a curated verified clinic list. |
| A-020 | MEDIUM | PEPTIDE-0283 | Live vs repo source-count and date mismatch; peptide `faqs` never rendered. |
| A-021 | MEDIUM | SAFETY-0716 | GLP-1 class safety last updated 2026-01-19; ileus “under review”; Foundayo absent. |
| A-022 | MEDIUM | PEPTIDE-0283 | Nausea incidence inconsistent across safety page vs dossier FAQ/body. |
| A-023 | MEDIUM | TEMPLATE-1287 | JSON-LD `administrationRoute: Subcutaneous injection` on oral drugs. |
| A-024 | MEDIUM | HOME-1228 | Homepage features BPC-157/TB-500 as equal “specimens” beside approved GLP-1s. |
| A-025 | LOW | TRUST-1246 | Privacy policy bundles PepTracker app; data-flow not verified here. |
| A-026 | MEDIUM | GUIDE-0684 | BPC-157 explainer true on “not approved” but silent on 2026 503A/PCAC status. |

**Classification used:** only FACT may be unqualified. Protocol dose sentences are UNSUPPORTED. GLP-1 efficacy numbers checked against PubMed titles (STEP 1 14.9%, SURMOUNT-1 paper is Jastreboff 2022, ATTAIN-1 11.2% treatment-regimen-style figure in the dossier — not the 12.4% press-release estimand). No “safe/effective/proves” language is endorsed.

---

## 4. Evidence ledger

See `EVIDENCE-LEDGER.json`. Headline verifications:

- Protocol PMIDs **opened via NCBI esummary** and do not match stored authors/titles (A-001–A-003).
- STEP 1 (33567185), SUSTAIN 1/6, SELECT, FLOW, ESSENCE, ATTAIN-1, Hsieh BPC-157 animal, Hjuler melanotan melanoma **do** resolve to the claimed papers.
- FDA Foundayo approval 2026-04-01 and Forzinity accelerated approval 2025-09-19 **opened**.
- FDA compounding safety-risks page **opened** (current 2026-04-22).
- DailyMed direct fetch **failed** (DNS); boxed-warning wording is PARTIALLY SUPPORTED.
- Official WADA PDF **not** opened; GLP-1 “monitored not prohibited” is PARTIALLY SUPPORTED from secondary reproductions. BPC-157 as S0 example appears in multiple reproductions of the 2026 List.

None found in this search: retractions of the major GLP-1 outcome trials cited above.

---

## 5. Outdated-information list

| Item | Page state | Current as of 2026-09-02 | Action |
|---|---|---|---|
| Orforglipron live | Investigational, NDA submitted, Apr 13 2026 | FDA approved Foundayo 1 Apr 2026; max 17.2 mg; boxed warning | REWRITE live + drop 36 mg “dosing instructions” |
| Semaglutide live vs repo | 95 sources / Apr 13 vs 67 / Aug 17 | Two different dossiers under one URL | Do not ship branch as if it were live |
| GLP-1 safety pages | lastUpdated Jan 2026; ileus “under review” | Labels include ileus, pulmonary aspiration; Foundayo exists | REWRITE |
| BPC-157 compounding | “research only” / clinics recommend 503A compounding | Nomination withdrawn Apr 2026; not on 503A list; FDA staff proposed against listing Jul 2026; PCAC vote is not a listing | QUALIFY |
| SS-31 meta | “in clinical trials” | Forzinity accelerated approval Barth-only Sep 2025 | QUALIFY |
| Retatrutide safety | Feb 2026 Phase 3 | Still investigational (none found in this search showing US approval) | KEEP status; refresh AE table from later Phase 3 if published |
| Semaglutide 7.2 mg | STEP UP 20.7% in dossier | Pharmacy Times notes Mar 2026 Wegovy HD approval — **not independently confirmed against Drugs@FDA in this increment** | EXPERT REVIEW / RE-CITE before stating US approval of 7.2 mg |
| FDA Notice / legal pages | “Last updated January 2026” | Compounding and oral GLP-1 landscape moved in Apr–Jul 2026 | Update dates only after content is current |

---

## 6. New-information opportunities

Evidence-defensible, **no new URLs required** (crawl budget):

1. **Foundayo (orforglipron) label card** on the existing dossier: indication, 17.2 mg max, boxed warning, not approved for T2D, no combination with other GLP-1RAs. Source: FDA 2026-04-01.
2. **WADA 2026 split table** on existing safety/methodology: S0 BPC-157; S2 GHS/GHRH/TB-500; GLP-1s monitored not prohibited. Cite the List, not blogs.
3. **503A vs “compounding pharmacy” explainer** on existing BPC-157 safety + FDA notice: withdrawal from Category 2 ≠ legal to compound.
4. **Estimand footnote** already good on ATTAIN-1 11.2%; extend to STEP UP 7.2 mg and any remaining press-release figures.
5. **Barth-only Forzinity** qualifier on SS-31.
6. **Pulmonary aspiration / perioperative GLP-1** on existing class safety page (labeled risk).

Do not “publish more” pages.

---

## 7. Content and blog opportunities (evidence-defensible only)

- Refresh existing `what-is-bpc-157` / BPC safety with PCAC/503A distinction (A-026).
- Refresh existing orforglipron dossier to live (A-010) without a new URL.
- Do **not** write “BPC-157 now legal” or “FDA approved peptides” posts. A July 2026 advisory vote is not an approval.
- Blog URLs in live sitemap but not this branch (7 posts) and branch-only blogs (49) are a **mismatch**, not a content idea.

---

## 8. Directory opportunities

**Negative:** the directory is a medical-legal liability, not an opportunity, until placeholders are gone.

If rebuilt later: real NAP only; no “Verified” without a written protocol; no BPC-157/CJC/ipamorelin as default offerings; no FAQ schema until facts are city-specific; keep noindex **and** drop from sitemap (already partly done). `/directory` “coming soon” copy must not say verified.

---

## 9. Monetization opportunities and conflicts

- **Health-claim/monetization collision:** Featured clinic partners (Prime Wellness Scottsdale, Regenerative Health LA, Vitality Wellness Miami) are placeholders with `example.com` and a “Featured” ribbon plus Verified badge. Advertising policy says no pay-for-play and lists “current sponsors: none”. The UI still sells “Featured Listing Options”.
- **Quality checklist + reconstitution calculators** monetize research-chemical intent while disclaimer forbids sourcing/dosing.
- **App waitlist CTA** on calculators/dossiers is conversion, not a health claim, and is the stated business path. It is not a finding against CTAs themselves.
- Affiliate peptide sales remain parked per INPUTS.md — good. Do not add vendor links.

---

## 10. Unknowns and missing inputs

- Live GSC/GA4: UNAVAILABLE (`invalid_rapt`).
- DailyMed/openFDA full current labels: DailyMed DNS failed; boxed-warning quotes are from indexed copies.
- Official WADA 2026 PDF not opened.
- Whether 52 clinic names correspond to any real business: not contacted (authorization).
- NCT07437547 drug-match for BPC-157 hamstring trial: format is real; intervention match not fully pulled.
- Semaglutide 7.2 mg US approval: secondary news only.
- Source-pack trial tables on live semaglutide (many NCT07x IDs) not individually drug-matched.
- Private CMS/email/affiliate dashboards: none in repo.
- `src/pages/sponsors/` empty directory — inspected, no pages.

---

## 11. Strongest finding

**A-001–A-003 together with A-004 live.**

Three `/protocols/*` pages attach human doses to PubMed IDs that resolve to oncology, parasitology, ophthalmology, and fermentation papers. Independently, the dossier template stamps **every** peptide — including live semaglutide — “Not FDA Approved” and “WADA Prohibited”, while the same page says FDA Approved. Both are user-facing, multiplied, and currently true of production HTML.

---

## 12. Weakest finding

**A-025** (privacy policy mentioning PepTracker) and **A-024** (homepage featuring BPC-157). A-024 is a prominence/risk-perception judgment, not a false number. A-025 is an unverified privacy-scope question.

---

## 13. Likely blind spot

- **Comparisons and peptide-condition pages** inherit dossier numbers and FAQ-capable schema (`ComparisonLayout` emits FAQSchema). I sampled ≥20% but did not PMID-resolve 269 comparison bibliographies.
- **Source-packs** (`data/source-packs/*.json`) feed TrialTable; live semaglutide shows NCT IDs I did not drug-match.
- **Blog vs dossier estimands** (historically 12.4% vs 11.2% orforglipron) — ATTAIN-1 on the dossier is 11.2% (correct direction); blogs not fully re-audited for residual press-release figures.
- **Khavinson bioregulator cluster** (known prior fabrication class) was not re-resolved PMID-by-PMID in this increment beyond noting the lesson and sampling.

---

## 14. Evidence that could falsify one major conclusion

Major conclusion: **protocol PMIDs are the wrong papers, not merely sloppy formatting.**

This would be falsified if NCBI esummary were serving a corrupted ID mapping on 2026-09-02 (unlikely: titles are domain-distant) **or** if the live/rendered citation resolver rewrote those IDs before display (it does not; ProtocolLayout links `pubmed.ncbi.nlm.nih.gov/${study.pmid}`). Re-fetch of the same IDs on a second day, or PubMed `ecitmatch` on the stored author/year/journal, would be the replication test.

A second major conclusion — **live semaglutide is labeled Not FDA Approved / WADA Prohibited** — would be falsified if the 2026-09-02 HTML snapshot were a personalization/A-B variant. A second unauthenticated fetch of `/peptides/semaglutide` should still contain those strings; it did in this session.

---

*End of Audit A report. JSON companions: FINDINGS.json, COVERAGE.json, EVIDENCE-LEDGER.json, STATUS.txt.*
