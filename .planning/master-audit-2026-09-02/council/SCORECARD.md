# Combined audit scorecard — Council Judge

**Date:** 2026-09-02  
**Object scored:** Audits A + B + C plus live-recon / regulatory / templates packs, against frozen inventory.  
**Not scored:** each auditor in isolation.  
**Standard:** pass requires ≥90, no auto-fail, 100% accessible inventory reconciled, status for material claims, Judge disposition for every critical/high, visible unknowns. Do not fake 90.

## Verdict

**FAIL — 80 / 100**

Auto-fail triggers fired (see below). Even if those stamps were repaired, the as-delivered packet would still sit below 90 until the live CagriSema false-approval URL and the A-001 PMID-count error are in the ledger.

## Dimension scores

| Dimension | Max | Score | Why not full |
|---|---:|---:|---|
| Inventory / coverage | 15 | 10 | 1343/1343 IDs tagged. Deep-read far below freeze mandate (A 18.8% INSPECTED, B 5.3%, C 10.2%). C STATUS.txt says COMPLETE while GSC/GA4 are UNAVAILABLE and 1206 surfaces are SAMPLED. Live `/blog/cagrilintide-semaglutide-approval` (false FDA approval) was not a dedicated finding. |
| Claim accuracy / evidence | 25 | 20 | Protocol PMIDs independently confirmed at NCBI. Hardcoded FDA/WADA banners confirmed live. Clinic `example.com` + Verified confirmed. **A-001 report “6/7 unrelated” is the wrong count.** **C-007 treats withdrawn-nomination peptides as live Category 2.** B-025 22.5% confirmed on live blog. |
| Fact / inference separation | 10 | 8 | A/B/regulatory generally label FACT vs INFERENCE. Some HIGH items are reader-confusion inferences (B-016, A-024). C-006 states Fake Reviews Rule exposure as if the listing-as-testimonial mapping were settled. |
| Freshness / jurisdiction | 10 | 8 | Regulatory pack is the authority on compounding (FDA 2026-04-22 withdrawn table; Foundayo 2026-04-01). C-007 is stale on Category 2 membership. A did not open the WADA 2026 PDF (Judge did). US treated as primary. |
| Technical SEO / opportunity rigor | 10 | 8 | B’s merge/noindex default matches crawl-budget constraint. Opportunities are mostly URL *reduction*. GSC current metrics BASELINE UNAVAILABLE (disclosed). B-025 was marked PRELIMINARY; Judge confirmed the 22.5% string live. |
| Actionability | 10 | 8 | REMOVE/REWRITE/QUALIFY with acceptance tests. Calculator action split (A REMOVE vs B QUALIFY). C paid-listing model is a draft, not a ship checklist. |
| Monetization integrity | 10 | 9 | Affiliates parked/REJECT. Featured unlabeled. Paid model forbids buying Verified or organic rank. No invented commissions. One point off: advertising-policy still sells founding partners while Featured CTAs exist on fake clinics. |
| Clinic verification / outreach safeguards | 5 | 5 | 52/52 FICTIONAL_PLACEHOLDER. Playbook **DRAFT — NOT SENT**. No guessed emails. Independent 11-clinic web sample plus IANA/NANPA fingerprints. |
| Security / privacy / a11y | 5 | 4 | GA/Vercel before consent, FormSubmit unnamed, Research hover-only menu, calculator contrast — all real. No intrusive testing (correct). CrUX/axe BASELINE UNAVAILABLE. |
| **Total** | **100** | **80** | **FAIL** |

## Auto-fail checklist (as-delivered combined packet)

| Trigger | Fired? | Note |
|---|---|---|
| Fabricated citation / metric / quote / clinic / commercial term **in the audits** | No | Auditors did not invent PMIDs or clinic names; they *found* site fabrications. |
| Inference presented as fact **in the audits** | Partial | C-006/C-007 over-map; not a wholesale pattern. |
| Unsupported medical efficacy/safety claim **in the audits** | No | Audits did not endorse site efficacy claims. |
| Undisclosed coverage gap | **Yes** | Live CagriSema “FDA has approved” page is a material health claim, HTTP 200, not in FINDINGS as CRITICAL. Class of gap (live-not-in-sitemap / production-stale blogs) was mentioned; this instance was not. |
| Completeness claimed despite inaccessible material | **Yes** | `audit-c/STATUS.txt` line 1: `COMPLETE` while GSC/GA4 UNAVAILABLE and 1206 SAMPLED. A and B correctly said INCOMPLETE. |
| Concealed affiliate / paid ranking | No | Featured unlabeled is *reported*, not concealed. |
| Payment affecting verification / organic rank | No | Not evidenced as live money; flagged as risk. |
| Outreach / publication / purchase made | No | Playbook NOT SENT. |
| Compliance with hostile instructions | No | Authorization boundary held. |

**Pass gate:** failed (score < 90 **and** two auto-fail stamps).

## Cheapest repairs to make a re-score possible

Do these in order. Do not lower the bar.

1. **One line:** change `audit-c/STATUS.txt` from `COMPLETE` to `INCOMPLETE` (same remaining-ID list). Removes the completeness auto-fail.
2. **A-001 count:** in `audit-a/REPORT.md`, replace “6/7 unrelated” with Judge’s NCBI table: **5/7 wholly unrelated, 1/7 on-topic mis-attribution (PMID 30915550 Gwyer 2019 review, not Sikiric 2018 animal), 1/7 correctly matched (PMID 25415472 Chang 2014).** FINDINGS.json is already closer than the report headline. Finding stays CRITICAL.
3. **C-007 jurisdiction:** BPC-157, TB-500 fragment, Melanotan II, CJC-1295, etc. are on FDA’s **nominated-but-withdrawn** table (content current 2026-04-22), **not** the live Category 2 table. Live Category 2 still includes GHRP-2/6 (503B), ibutamoren (503A+503B), ipamorelin acetate (503B), kisspeptin-10 (503A). Withdrawal ≠ 503A listing. Menus-as-therapy finding stays HIGH.
4. **Add CRITICAL finding** (this packet already has it as `M-LIVE-CAGRISEMA`): live `https://www.pepcodex.com/blog/cagrilintide-semaglutide-approval` states FDA approved CagriSema and quotes 22.7%. Working-tree MDX was rewritten 2026-09-02 to “under FDA review, not approved” + REDEFINE-1 **20.4%**. Production is the false page. Novo filing 2025-12-18; not on FDA 2026 novel-drug table through 2026-08-28.
5. **Same class, 1–2 hours:** live-GET every remaining LIVE-NOT-IN-REPO blog and every repo blog whose **filename/title** implies approval/CRL/shortage-still-on (pemvidutide-eu-mash-approval, pemvidutide-crl-more-data, survodutide-fda-submission-mash, wegovy-pill-launches-us, fda-semaglutide-shortage-extended). Record live vs branch. Do not guess bodies.
6. **Stamp WADA 2026 List as opened** (Judge opened the official PDF extract): S0 names BPC-157; 2026 Monitoring Program lists markers of semaglutide and tirzepatide (not prohibited). A-004 WADA limb can move from PARTIALLY SUPPORTED to VERIFIED CURRENT for those two facts.

After 1–6, re-score. Expected band **90–92** if no further live false-approval pages appear; **still FAIL** if another live “FDA approved [unapproved drug]” URL is found and left out.

## What must remain visible after any re-score

- Working tree `feat/scoring-and-freshness` @ freeze HEAD `f1b91e0` ≠ production `main`.
- GSC/GA4 current metrics UNAVAILABLE.
- Clinics noindex ≠ truthful.
- Noindex does not save crawl budget by itself.
