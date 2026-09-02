# Clinic prospecting and outreach playbook

**DRAFT — NOT SENT**

**Date:** 2026-09-02  
**Authorization:** None. Audit C did not contact clinics, guess emails, submit forms, or create accounts.  
**This file is not a mail-merge. Do not send.**

---

## Hard stop

The current 52 `src/content/clinics/*.mdx` records are **fictional placeholders** (example.com websites, 555 numbers, no matching public businesses in a stratified independent search).  

**First step is quarantine/removal of fake records, not outreach.**

Do not:

- email, call, or LinkedIn the 52 names;
- use those addresses as if they were tenants;
- invent `info@` emails from the slug;
- “personalize” with the MDX `description` (it is generated marketing copy);
- tell a real nearby clinic “you’re already listed on PepCodex.”

Name collisions with **different real entities** (do not contact as if they were the listing):

| Fake listing | Nearby different real entity (public web, 2026-09-02) |
|---|---|
| Alamo Wellness & Peptide Center | Alamo Peptides (vendor); Alamo Slim Clinic |
| Manhattan Peptide Clinic | Dr. GolBerg Wellness, 910 Park Avenue |
| Vitality Wellness Center (Brickell) | Strong Health, 1000 Brickell Plaza; Idaho “Vitality Wellness” telehealth |
| Regenerative Health Institute (9000 Wilshire) | Regenerative Medicine LA; Regenuva 9025 Wilshire |
| Pacific Integrative Wellness (450 Sutter) | Pacific Integrative Psychiatry, 447 Sutter |
| Treasure Valley Peptide Institute | Treasure Valley Aesthetics; Treasure Valley Pain & Hormones; Boise Biologics |
| Northwest Peptide & Wellness | Northwest Peptides (vendor) |
| Elite Wellness (875 N Michigan) | Live Well Clinics, 980 N Michigan |

Contacting those real entities with copy written for the fake listing would be false.

---

## Pipeline (future, after quarantine)

Use these stages. Do not skip to Outreach.

```
0  Quarantine / Remove fictional MDX
1  Discovered          (public source only)
2  Eligibility Checked (inclusion criteria)
3  Listing Reviewed    (internal QA)
4  Contact Verified    (official page contact, not guessed)
5  Outreach Approved   (human sign-off + legal)
6  Outreach Sent       (NOT THIS AUDIT)
7  Reply / Claim
8  Verification complete
9  Live free listing
10 Sponsored unit      (optional, labeled, never buys Verified)
```

Exit at any stage to `Rejected` or `Legal Hold`.

---

## Stage 0 — Quarantine (do this first)

- Unpublish `/clinics` cards or delete the 52 files **only when implementation is authorized** (this audit does not edit the site).
- Remove Verified/Featured language from city FAQs and `/directory`.
- Do not redirect fake names to real clinics (that implies a relationship).

---

## Stage 1 — Discovered

**Allowed sources (public):**

- State medical board license lookups
- NPPES NPI registry
- State SOS entity search
- Clinic’s own official website
- CMS / hospital directories where applicable
- FDA compounding-related public pages (for what *not* to promote)

**Disallowed sources:**

- The current PepCodex MDX folder
- Scraped “peptide clinic” SEO farms without license checks
- Purchased email lists
- Research-chem vendor “preferred clinic” pages

Record for each prospect: legal name, DBA, city, source URL, discovery date, discoverer. No email until Stage 4.

---

## Stage 2 — Eligibility Checked

See `PAID-LISTING-MODEL.md` inclusion criteria. Automatic rejects:

- RUO / research-chem storefronts
- No identifiable licensed clinician
- Telehealth claiming all 50 states without a license map
- Menus that only exist on a vendor blog
- Duplicate of an already rejected entity

---

## Stage 3 — Listing Reviewed

Internal QA against the clinic’s official page. PepCodex does not write a peptide menu the clinic did not publish. No “Harvard-affiliated” unless the institution’s public directory says so.

---

## Stage 4 — Contact Verified

Use **only** a contact path printed on the official site or board profile:

- `/contact` page form (do not submit during audit)
- Board-listed practice phone
- Published general inbox if and only if it is on that official page (`info@` on a real domain)

**Do not** generate `hello@{slug}.com`. If there is no public contact, the prospect stays at Stage 4. There is no “find the doctor on LinkedIn” step in this playbook (that is personal contact, not business contact).

---

## Stage 5 — Outreach Approved

Required before any send:

- [ ] Stage 0 complete for the old inventory
- [ ] Counsel has approved healthcare advertising copy for the target state
- [ ] Template contains no “you’re already listed” unless a **real** live listing exists
- [ ] Template contains no peptide dosing, no sourcing, no “we’ll send you patients” fee language unless counsel approved a lawful fee
- [ ] Named approver (human)
- [ ] Suppression list includes the collision table above

---

## Stage 6 — Outreach Sent

**Not executed. Do not execute from this file.**

When (and if) a later authorized operator writes mail, they must draft from verified public contact pages in that future session — not from this audit. This packet **intentionally contains no email bodies, no subject lines, and no personalization tokens**, because those would be fabricated for fake or unverified recipients.

Lawful future mail, in principle, would be a short invitation to *apply* for a free listing, pointing at a public criteria page — not a claim that PepCodex already verified them.

---

## What “Get Listed Free” on the live site is today

Live `/clinics` and `/clinics/[city]` CTAs point at `/contact` (FormSubmit). That is not a verified intake. It is a generic form with captcha off. Do not treat inbound mail as Stage 7 until Stage 0 is done and a real application form exists.

---

## Metrics (when authorized; no invented baselines)

- Prospects in each stage
- % failing license check
- Time-to-unpublish on “this isn’t us”
- Zero use of the 52 fictional names as a funnel
