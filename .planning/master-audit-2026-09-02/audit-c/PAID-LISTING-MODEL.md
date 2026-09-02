# Ethical free vs paid clinic listing model (DRAFT)

**Date:** 2026-09-02  
**Status:** DRAFT for legal review. Not live policy. Not an offer.  
**Precondition:** The current 52 records are fictional. This model applies only **after** those records are quarantined/removed and a real verification pipeline exists. Selling this SKU on the present inventory would be selling placement on fake clinics.

Payment must never purchase: verification badge, credential, safety/evidence rating, favorable review, medical endorsement, suppression of negatives, altered complaints, undisclosed organic ranking, or unsupported claims.

---

## 1. Feature table

| Capability | Free listing | Paid enhanced profile | Paid sponsored unit |
|---|---|---|---|
| Eligible to appear at all | Yes, after independent verification | Same eligibility gate — **pay does not skip verification** | Same |
| Legal name, address, public contact, license jurisdiction | Required | Required | Required |
| Last-checked date + verification source | Required, public | Required, public | Required, public |
| Organic sort (distance, recency of verification, completeness) | Yes | Yes — **same algorithm** | Does not enter organic sort |
| “Verified” badge | Only if independent checks pass | Same rule; **not a paid SKU** | Forbidden on the ad unit unless the underlying listing is independently verified — badge still unpaid |
| Extra photos, hours, accepted insurance (self-reported, labeled) | Limited | Yes, labeled “clinic-reported” | No extra claims beyond the approved ad |
| Longer description | Short | Longer, still no unapproved-drug claims | Ad copy pre-reviewed |
| Priority / top slot | No | No (profile richness ≠ rank) | Yes, **labeled Sponsored** |
| In organic results for the city | If verified | If verified | Separate “Sponsored” block above or beside, never mixed unlabeled |
| Peptide menu | Only items the clinic can document (license + pharmacy pathway) | Same | Same restrictions |
| Evidence grade of any peptide | Never on the listing card | Never | Never |
| Dossier / blog placement | No | No | Only as labeled sponsor module, never in body copy |
| Lead form to PepCodex | No default | Optional, with privacy notices | Optional |
| Ability to suppress complaints | No | No | No |

---

## 2. Inclusion criteria (free or paid)

A listing may go live only if **all** of the following are true:

1. Legal entity exists in a public registry (state SOS, or equivalent) **or** a named licensed clinician is the responsible party.
2. At least one professional license (MD/DO/NP/PA/ND as applicable) is **independently retrieved** from the state board, current, and in the jurisdiction of the listed address **and** of any advertised telehealth states.
3. Public business contact is a working official page or board-listed phone — not a guessed email, not example.com, not 555.
4. Operating status is open (not “coming soon,” not a suite hotel lobby with no tenant match).
5. In-person vs telehealth is explicit; telehealth lists every state of licensure.
6. No invented peptide menu. If a menu is shown, it is copied from the clinic’s own current public page or a signed clinic attestation, and it does not advertise Category 2 / non-compoundable bulk substances as available therapy unless counsel has approved that display.
7. Clinic agrees to PepCodex clinic terms (section 7).
8. PepCodex has a last-checked date ≤ 90 days (or the listing auto-unpublishes).

Fail any gate → do not list, even if they pay.

---

## 3. Verification methodology (unpaid)

Minimum independent checks (not self-attestation):

| Check | Source class | Pass |
|---|---|---|
| Entity name | State SOS / NPPES | Exact or documented DBA |
| License | State medical/nursing board lookup | Active, matching name, matching state |
| Address | Board, clinic site, and one map/registry | Not a virtual mailbox unless telehealth-only and disclosed |
| Website | Clinic’s official domain | Resolves; not example.com; not a vendor cart |
| Phone | Board or official site | Not 555; matches official |
| Operating | Official site hours or board | Open |
| Menu | Official site only | No PepCodex-authored “typical peptides” |
| Sanctions | Board + OIG LEIE sample | No undisclosed exclusion |

Store: `verified_at`, `verified_by` (role, not a public personal email), `sources[]` (URLs), `fails[]`.  
**Verified ≠ recommended. Verified ≠ safe. Verified ≠ FDA-approved compounding.** Public definition:

> “Verified means PepCodex independently confirmed the named practice exists, a license is active in the stated jurisdiction, and the public contact worked on the last-checked date. It is not a medical endorsement and is not for sale.”

Re-check cadence: 90 days or immediately on complaint.

---

## 4. Organic ranking methodology (independent of payment)

Publish the sort. Suggested default:

1. License current (hard filter, not a sort).
2. Last-checked recency.
3. Completeness of required fields (not paid fields).
4. Distance / city match.
5. Alphabetical tie-break.

**Forbidden in organic sort:** `featured`, bid, recency of payment, NPS PepCodex bought, number of peptide SKUs, willingness to advertise BPC-157.

Paid units live in a separate list labeled **Sponsored**. If JS fails, sponsored still says Sponsored.

---

## 5. Sponsorship labels

- Use the word **Sponsored** (FTC: clear and conspicuous; a significant minority of the audience must understand the connection).
- Do not use: Featured Partner, Verified Partner, Trusted, Premier, Preferred (unless those words are defined as unpaid and unused for paid SKUs).
- Logo + “Sponsored listing — this clinic paid for this placement. It did not pay for verification or for PepCodex evidence grades.”
- Newsletter: existing “Sponsored” label; no clinic in editorial briefings.

---

## 6. Correction / appeal

| Event | SLA (draft) | Public? |
|---|---|---|
| Factual error reported by anyone | Acknowledge 3 business days; fix or explain 10 | Correction note on listing |
| Clinic claims “this is not us” / defamation | Unpublish within 1 business day pending review | Yes |
| License lapsed / death / closure | Unpublish same day as confirmed | Yes |
| Patient safety complaint | Do not adjudicate care; point to the board; unpublish if license action | Process page |
| Rejected applicant appeal | One written appeal; human review; no paid fast-track | No (privacy) |

Audit trail: who changed what field, when, source URL. Retain even after unpublish.

---

## 7. Clinic terms checklist (for counsel to turn into a contract)

- [ ] Attestation of authority to bind the practice
- [ ] License numbers and states; duty to notify lapse in 5 business days
- [ ] No unapproved-drug claims in clinic-supplied copy
- [ ] PepCodex may unpublish immediately
- [ ] Payment does not buy Verified, rank, or grade
- [ ] Indemnity for clinic-supplied copy
- [ ] No scraping of PepCodex dossiers onto the clinic site as if endorsed
- [ ] Privacy: no PHI through PepCodex without a BAA (default: no PHI)
- [ ] Telehealth: clinic warrants licensure in every state it accepts
- [ ] Governing law / advertising-law compliance is the clinic’s
- [ ] Public correction rights reserved to PepCodex

---

## 8. COI policy (directory)

- Sales team compensated on paid **units**, never on Verified counts or evidence grades.
- Editorial/research staff: no clinic commission, no clinic equity, no vendor equity.
- Verification staff ≠ sales staff.
- Annual public COI note on advertising-policy.

---

## 9. Privacy questions (must answer before launch)

1. Is PepCodex a HIPAA covered entity or business associate if it passes patient messages to clinics?
2. FormSubmit.co: DPA, subprocessors, retention, location — acceptable for listing requests? (Current contact form uses it with captcha off.)
3. Will listing-request forms forbid medical history?
4. CCPA/state consumer health-data laws (e.g. WA My Health My Data, NV, CT) if leads include health intent?
5. Retention of failed verification files (licenses, IDs)?
6. Clinic staff logins: MFA, least privilege, no shared passwords?
7. Can a patient request deletion of a lead that was never a customer of PepCodex?

Default conservative answers until counsel: **no patient lead passing; clinic-ops email only; no PHI; named processors in the privacy policy.**

---

## 10. Legal-review checklist (pre-launch)

- [ ] FTC 16 CFR 255 + Fake Reviews Rule as applied to listings and “Verified”
- [ ] State medical-board advertising (launch states)
- [ ] Telehealth licensure advertising
- [ ] Fee-split / kickback / corporate practice if any lead or booking fee
- [ ] Whether the product is a regulated “referral service”
- [ ] FDA compounding / unapproved drug claims on menus
- [ ] WADA/USADA if performance menus remain
- [ ] Accessibility of Sponsored label on mobile (67% of historical clicks were mobile — historical, not current)
- [ ] Insurance: media / professional liability for directory errors

**Do not assume referral or healthcare advertising is lawful.**

---

## 11. Pre-launch trust tests

1. Mystery shop: can a reviewer confirm 10 listings from board sites without using the clinic’s own PDF?
2. Negative test: a paid applicant that fails license check is refused; sales cannot override.
3. Label test: ≥80% of a small reader panel identify Sponsored as paid (informal; not a substitute for FTC “clear and conspicuous”).
4. Broken-contact test: 555 / example.com / 404 website auto-fail QA.
5. Collision test: invented names that fuzzy-match real DBAs are blocked.
6. Dossier firewall test: paying does not change a peptide evidence grade in staging.
7. Complaint test: “this isn’t us” unpublishes within the SLA on staging.
8. noindex/index decision is **not** a trust test — a noindexed lie is still a lie.

If any test fails, do not launch.

---

## 12. Editorial-independence and disclosure policy draft

*Draft — not live. Would replace/extend `/editorial-policy` and `/advertising-policy` after counsel.*

### Purpose

PepCodex publishes peptide research summaries. Any commercial relationship, including clinic listings, is subordinate to accuracy and to US law on advertising, compounding, and endorsements.

### Firewall

Sponsors, advertisers, listed clinics, and affiliate partners (if any) do not:

- choose which peptides are covered;
- set or appeal evidence grades;
- pre-clear editorial copy;
- require removal of safety information or complaints;
- buy a Verified badge, credential, or organic rank.

### Permitted commercial units (after legal approval)

- Labeled **Sponsored** profile or display unit for a verified clinic.
- Labeled newsletter sponsorship by a non-vendor organization.
- First-party PepTracker conversion.

### Forbidden commercial units

- Peptide vendor / research-chem affiliate.
- Pay-for-play dossiers or “best peptide” awards.
- Dosing or sourcing ads.
- Any unit that implies FDA approval or medical endorsement by PepCodex.

### Disclosure

- Sponsored units labeled **Sponsored** adjacent to the unit.
- Public list of paying clinics and sponsors on `/advertising-policy`, dated.
- Material connections disclosed per 16 CFR 255.
- “Verified” defined on-page as independent existence/license checks, not a recommendation.

### Corrections

- Listing errors follow the clinic correction SLA.
- Editorial errors follow the existing editorial corrections policy.
- Significant listing fabrications (the 2026 placeholder set) are removed, not “corrected” in place.

### COI

Team members do not hold equity in peptide manufacturers, distributors, or listed clinics. Exceptions, if any, are published.

### Enforcement

Violations: unpublish the unit, refund if required by law, and a public note if readers were misled.

---

## 13. What this draft does not authorize

- Launching paid listings on the current 52 files.
- Reindexing `/clinics`.
- Outreach.
- Adding city pages.
