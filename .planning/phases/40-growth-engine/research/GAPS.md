# Coverage gaps — compounds with no dossier that had window events, 2026-05-17 → 2026-08-17

*Produced 2026-08-17 by the freshness scout. Research only.*

Discovery list, not a work order. Whether any of these deserves a dossier is an editorial call about
scope. Every identifier was fetched live this session from ClinicalTrials.gov v2 or openFDA
`drugsfda.json` (`last_updated` 2026-08-14).

Existing BUILD candidates live in `.planning/coverage/2026-08-06/build/*.json`. Of those twelve,
octreotide, dulaglutide and exenatide were written this session. The remaining nine were **not
re-researched** per brief — only window-dated new evidence for them is noted in the second table.

---

## New compounds — not covered, not already a BUILD candidate

### `ribupatide` (KAI-9531, Kailera Therapeutics) — strongest new candidate
Five registrations, four of them **phase 3**, all registered or updated inside the window. A phase 3
obesity programme this size with no dossier is the largest single coverage hole this scan found.

| NCT | phase | status | last update | note |
|---|---|---|---|---|
| NCT07284875 | PHASE3 | RECRUITING | 2026-07-22 | obesity/overweight with weight-related comorbidity |
| NCT07284901 | PHASE3 | RECRUITING | 2026-07-15 | once weekly, obesity |
| NCT07284979 | PHASE3 | RECRUITING | 2026-07-22 | **head-to-head vs semaglutide** and placebo |
| NCT07709910 | PHASE3 | NOT_YET_RECRUITING | 2026-07-17 | obesity + knee osteoarthritis (Fujian Shengdi) |
| NCT07458269 | PHASE2 | ACTIVE_NOT_RECRUITING | 2026-07-15 | KAI-9531, once weekly |

NCT07284979 matters most to existing content: it puts a compound we do not cover directly against
semaglutide, which we do.

### `olatorepatide` (Regeneron Pharmaceuticals)
| NCT | phase | status | last update |
|---|---|---|---|
| NCT07431086 | PHASE2 | ACTIVE_NOT_RECRUITING | 2026-06-17 |
| NCT07685808 | PHASE2 | NOT_YET_RECRUITING | 2026-07-06 |

Phase 2 obesity programme from a major sponsor. Watch, not urgent.

### `linaclotide` (LINZESS, AbbVie) — an **efficacy** supplement was approved
- **openFDA `NDA202811`** · SUPPL 23 · class **Efficacy** · status **AP 2026-05-21** · Label and Letter posted 2026-05-26.

An approved *efficacy* supplement means a new or expanded indication — a stronger regulatory event than
the labeling supplements elsewhere in this report. Linaclotide is a 14-amino-acid peptide and is in
scope for a peptide reference site. *Could not confirm what the new indication is* — openFDA gives the
submission record, not the label text.

### Also surfaced by `discover:gaps`, judged out of scope or lower value
`insulin aspart` (4 trials), `insulin icodec` (4), `insulin degludec` (2) — insulins, a category the
site does not cover. `Lutetium Lu 177 Vipivotide Tetraxetan` (3) and `SVN53-67/M57-KLH Peptide Vaccine`
(3), `MUC1 Peptide-Poly-ICLC Vaccine` (2) — oncology radioligands and peptide vaccines, adjacent to the
existing `225ac-dota-lm3` dossier but a different editorial lane. `Recombinant Interferon Alfa-2b` (3),
`Leuprorelin Acetate` (2) — leuprorelin is a GnRH analogue in the same family as the existing buserelin
and goserelin BUILD candidates and could join that batch.

---

## Window-dated new evidence for the 9 untouched BUILD candidates

Not re-researched. These are only the window events that surfaced while querying.

| BUILD candidate | id | date | event |
|---|---|---|---|
| teriparatide | openFDA `NDA021318` SUPPL 59 | AP **2026-08-03** | FORTEO (Lilly) labeling supplement; Label + Medication Guide 2026-08-11 |
| teriparatide | openFDA `NDA211939` SUPPL 21 | AP **2026-08-03** | BONSITY (Alvogen) labeling supplement, same date — a **coordinated class labeling change**, not a one-product edit |
| abaloparatide | NCT04167163 | results posted 2026-06-05 | phase 4, n=58, abaloparatide before total knee arthroplasty, COMPLETED |
| triptorelin | openFDA `NDA021288` SUPPL 47, `NDA022437` SUPPL 27, `NDA020715` SUPPL 52 | all AP **2026-06-26** | TRELSTAR (Verity) — three applications, one coordinated labeling change; Labels 2026-07-06 |
| somatropin | openFDA `BLA020604` SUPPL 104 | AP **2026-07-14** | SEROSTIM (EMD Serono) labeling supplement; Label 2026-07-29 |
| somatropin | NCT07259564 | 2026-05-22 | phase 2 **TERMINATED** — *"Adjustment of sponsor's product development strategy."* |
| somatropin | NCT07037420 | 2026-08-07 | phase 2 **TERMINATED** — *"This decision is based on strategic portfolio prioritization"* |
| somatropin | NCT04614337 | results posted 2026-06-17 | OraGrowtH210, LUM-201 in paediatric GH deficiency, phase 2, n=104 |
| terlipressin | openFDA `NDA022231` SUPPL 4 | AP **2026-06-10** | TERLIVAZ (Mallinckrodt) labeling supplement; Label 2026-06-16 |
| vasopressin | openFDA `ANDA213988` SUPPL 2 and 3 | AP **2026-06-03** | Dr Reddy's — **Manufacturing (CMC) only**, no labeling or efficacy change. Low value; noted so it is not mistaken for a label change. |
| vasopressin | NCT05824767 | results posted 2026-07-02 | DARK-Sepsis, phase 4, n=42 |
| goserelin | NCT03436745 | 2026-06-26 | phase 1 TERMINATED — *"Slow/insufficient accrual"* |
| buserelin, histrelin | — | — | No window events surfaced. |

The teriparatide and triptorelin entries are the notable ones: both are **coordinated multi-application
labeling changes approved on a single date**, which usually signals a class-wide safety or indication
edit rather than a sponsor-specific one.

---

## Scan-tooling bugs found

**1. `MB-231` is still surfacing as a candidate — the cell-line artifact is not fully fixed.**
`.planning/coverage/2026-08-17/candidates.json`, bottom row: `MB-231`, 0 trials, **2 papers**.
`scripts/discover-coverage-gaps.mjs:146-158` fixed the *ReferenceList* half of this bug by restricting
mining to `<ArticleTitle>` and `<AbstractText>`. But `MB-231` is the tail of the **MDA-MB-231** cell
line, which appears in abstract *body text*, so title/abstract mining still catches it. The token
pattern at line 160, `[A-Z]{2,4}-\d{2,5}`, has no way to tell it from a development code.
*Evidence it is an artifact:* I queried CT.gov for `MB-231` and got one unrelated study (NCT06271564,
topical magnetite/ZnO nanoparticles for oral lesions) — no peptide programme exists under this name.
*Suggested fix:* reject a candidate when the matched token is preceded by `[A-Z]{2,3}-` in the source
text (so `MDA-MB-231` never yields `MB-231`), or require a development-code candidate to also appear in
a CT.gov intervention field before it is reported.

**2. Alias collision on a generic descriptor produced a false compound match.**
`.planning/research-scan/2026-08-17/hexarelin.json` lists PMID 42462342, the COURAGE-2 stroke trial.
The match came through the phrase *"growth hormone releasing hexapeptide"*, but the abstract states the
drug studied is **GHRP-6**, a different hexapeptide. `isRelevant` passed it because the phrase is long
enough to look distinctive while actually being a structural descriptor shared by a whole family. This
is the same failure shape as `"gastric peptide"` and `"Intestinal peptide"` already recorded in
`.claude/rules/lessons.md`, so the existing self-calibrating genericity test in
`verification/pubmed.mjs` did not catch it — the alias returns few enough records not to trip the
volume heuristic. Recorded in `new-findings/hexarelin.json` as a do-not-cite entry.

**3. `monthly-research-scan.mjs` does not paginate ClinicalTrials.gov.**
`scripts/monthly-research-scan.mjs:179` sets `pageSize=40` and never reads `nextPageToken`, so any
compound with more than 40 registrations updated in the window is silently truncated on the trials side
— and unlike the PubMed side, there is no `truncated` flag for it. My own paginated queries returned
168 studies for semaglutide and 100 for tirzepatide against that cap of 40. The PubMed path already
handles this correctly (`out.truncated`, lines 105-108); the CT.gov path needs the same treatment.

**4. Implausible volume, as expected, on ubiquitous endogenous molecules.**
`glutathione` returned **643** new papers, `hcg` 183, `klotho` 95, `ll-37` 79. These are not broken
queries in the `NASA` sense — the compound genuinely is named in the abstracts — but they are basic
biochemistry literatures, not therapeutic evidence, and they dominate the summary table. Spot-checked
two: `klotho` PMID 42299884 is a dietary-protein RCT and `liraglutide` PMID 42244145 is an
**empagliflozin** kidney MRI trial. Neither is a finding for its dossier. A pubtype or
therapeutic-context filter at scan time would cut the triage burden substantially.

Items 1 and 3 are mechanical and cheap. Item 2 needs the same treatment the other generic-phrase
failures got: it belongs in `data/trial-match-aliases.json` as a removal, not in a blocklist.
