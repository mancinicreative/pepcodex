# Rejected items — Council Judge

Rejected means the **claim as stated** is not accepted into the merged ledger as truth. Underlying site defects may still be accepted under a revised row (see DISPOSITIONS.json).

## Audit-process claims (rejected)

| ID | Claim | Why rejected | What remains |
|---|---|---|---|
| C-STATUS-COMPLETE | `audit-c/STATUS.txt` “COMPLETE” | GSC/GA4 live pull UNAVAILABLE; 1206 surfaces SAMPLED; freeze forbids completeness claims when material databases are inaccessible. Access limits in the same file do not convert SAMPLED into INSPECTED. | C’s clinic/directory INSPECTED work stands. Combined packet is INCOMPLETE. |
| A-001 count “6/7 unrelated” | Report headline that 6 of 7 BPC protocol PMIDs are unrelated papers | NCBI: 5 wholly unrelated, 1 on-topic mis-attribution (30915550), 1 correct (25415472). | Finding A-001 remains CRITICAL under `M-A001` with revised count. |
| C-007 “BPC-157 is Category 2” as **current** list membership | Live Category 2 table includes BPC-157 / LL-37 | FDA page 2026-04-22: BPC-157, TB-500 fragment, Melanotan II, LL-37, CJC-1295 are **nominated but withdrawn**, not live Category 2 rows. | Menus advertising those peptides as clinic therapy: still HIGH (`M-COMPOUND-MENUS`). |
| Graph `silent=1111` as current non-indexation | Local graph impressions all 0 | GSC was not joined (INPUTS.md). Historical July 2026 “923 never impressed” is dated. B-017 already warned; reject any use of silent=1111 as a live indexation fact. | Local graph depth/orphan numbers for this-branch dist may be used as local-only. |
| 2026-07-24/25 GSC/GA4 figures as current KPIs | Any “current traffic is X” | INPUTS.md: last first-party pull 2026-07-25; ADC `invalid_rapt`. A/B correctly dated them historical. | Historical citations allowed only with the date attached. |

## Findings not rejected (for clarity)

Do **not** read this file as rejecting A-001–A-003, A-004, clinic fiction, or Drug schema. Those are ACCEPT / ACCEPT WITH REVISION.

A-024 (homepage BPC prominence) is **not** rejected; it is a weak but real prominence finding (QUALIFY).

A-025 (privacy scope PepTracker) is NEEDS EXPERT REVIEW, not REJECT.

B-025 is ACCEPT WITH REVISION, not REJECT: the 22.5% string is on the live page.

C-006 (FTC Rule application to listings) is NEEDS EXPERT REVIEW for the legal mapping, not a rejection of the fake-Verified facts.

## Opportunities rejected (unsafe, duplicative, commercially motivated, or “publish more”)

Default from INPUTS.md: crawl budget is binding; do not recommend publishing more.

| Item | Source | Why rejected |
|---|---|---|
| Reindex `/clinics/*` or add city URLs | implied growth move, not recommended by B/C | Doorway + fake NAP. Keep noindex **and** do not treat deindex as a truth fix. |
| Use 52 clinic MDX records as an outreach / prospect list | C playbook explicitly forbids; anyone reversing that | Fictional names collide with real nearby businesses. |
| Research-chemical / RUO peptide-vendor affiliates | C AFFILIATE-MATRIX REJECT | Sourcing ban, FDA unapproved-drug adjacency, cannot be cured by disclosure. |
| Compounding-pharmacy “find a 503A” paid widget | C matrix | Drug-distribution adjacency. |
| Additional reconstitution calculators / syringe presets | B OPP text; SERP of peppal/pepzilla | Dosing tool. Banned-content adjacent. Net URL must not rise. |
| “BPC-157 now legal” / “FDA approved peptides” posts | A §7 | PCAC vote ≠ listing ≠ approval. |
| Wire `HowToSchema` to calculators or protocols | B-028 KEEP | Medical-instruction schema. Absence is correct. |
| Mount `ExitIntentPopup` | templates / B-019 | Unused; a11y trap; would cover cookie UI. |
| New `/app` or `/peptracker` indexable marketing URL | B-030 | Conversion without new indexable doorway. |
| Pay-for-Verified or pay-for-organic-rank clinic SKU | C PAID-LISTING-MODEL forbids | Ranking integrity. |
| Third “what is {peptide}” URL | B OPP-01 | Cannibalization. 301, don’t mint. |
| Treating SURMOUNT-1 **22.5%** or REDEFINE-1 **22.7%** as unlabeled headlines | B-025, live CagriSema blog | Estimand / press-release figures. Quote published treatment-policy numbers or label the estimand. |
| Shipping `feat/scoring-and-freshness` to production as a sync side effect | A-020, B-007, Agents.md | Working tree ≠ live. Owner has not authorized production push. |

## Opportunities accepted as *IA reduction* (not new URLs)

These are **not** rejected, provided they drop net URL count and do not invent claims:

- Collapse 36 blog/guide `what-is-*` pairs (OPP-01).
- noindex/301 thin comparisons (OPP-02); keep trial-level head-to-heads.
- Canonicalize semaglutide-vs-tirzepatide to `/compare/tirzepatide-vs-semaglutide` (OPP-03).
- Refresh **existing** orforglipron dossier + Foundayo label card (A §6; no new URL).
- 503A-vs-withdrawal explainer on existing BPC safety / FDA notice.
- Named editor on `/about` (one page, not 20 author URLs).

## Commercial terms

No affiliate program was enrolled. No commission rates were invented. Any future rate table in planning docs is **UNVERIFIABLE** and is not a finding of a live deal.
