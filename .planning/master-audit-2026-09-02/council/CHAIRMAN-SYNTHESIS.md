# Council chairman synthesis — PepCodex master audit

**Date:** 2026-09-02  
**Chair:** Lead Auditor (this session).  
**Model substitution (loud):** All five council seats and the Judge ran on **Grok**. Codex / Opus 5 / Fable 5 were not available. The Karpathy-style **cross-family** council therefore did **not** run. Blind peer-review of anonymized A–E seats by a second family was **not** run. This council is weaker on cross-model diversity than the llm-council skill specifies. Seats still used clashing *lenses*.

## Where the Council Agrees

1. The product is a **research library** whose honest conversion is PepTracker, not a clinic marketplace and not peptide-vendor affiliates.
2. **Do not declare COMPLETE or passing.** Coverage was ID-reconciliation plus stratified reading, not freeze-mandated line-by-line inspection. GSC/GA4 live pull is blocked.
3. **P0 is the same three facts**, independently confirmed by auditors, templates pack, live-recon, Judge, and chair NCBI/live fetches:
   - Every dossier stamps **Not FDA Approved / WADA Prohibited / research-use-only** including live Ozempic/Wegovy.
   - **52/52 clinic records are fictional** (`example.com`, 555) with **50 Verified** badges.
   - Three `/protocols/*` pages attach **human doses to the wrong PubMed IDs**.
4. A fourth P0 the three auditors missed: live `/blog/cagrilintide-semaglutide-approval` still says **FDA has approved CagriSema** and quotes **22.7%**. This branch’s MDX was already rewritten. Production is the lie.
5. **Do not merge `feat/scoring-and-freshness` onto `main` as the fix.** Dual-tree hotfix. Outreach is **DRAFT — NOT SENT**. Vendor affiliates **REJECT**. Net URL count must not rise.

## Where the Council Clashes

- **Calculators:** Audit A REMOVE vs Audit B QUALIFY. Judge: legal/medical review; default is strip “desired dose” / do not add URLs. Expansionist wants to *keep* the tesamorelin calculator URL (live 200) as unit conversion only. Executor agrees: do not 301 that live URL this week.
- **Category 2:** Audit C collapsed withdrawn nominations into live Category 2. Regulatory pack + Judge: BPC-157/TB-500/Melanotan II are **withdrawn**, not live Category 2. Clinic menus as therapy remain HIGH either way.
- **Completeness theater:** Contrarian treats C’s COMPLETE stamp as fatal. First Principles cares more that P0 facts are true. Chair: both — auto-fail the *packet*, keep C’s clinic work.

## Blind spots the Council caught

- Peptide-condition pages invent approval from evidence grade (×295).
- InteractionMatrix: “Generally safe to combine.”
- Comparison FAQ JSON-LD with no visible FAQ.
- Live false-approval blogs not in this branch’s sitemap (CagriSema is the proof).
- `Access-Control-Allow-Origin: *` noted by Contrarian; **NEEDS EVIDENCE** as a security finding (GET-only recon; not intrusive-tested).

## The Recommendation

Treat this as an **INCOMPLETE FAIL (80/100)** that still has a **ship-ready P0 list**. Accuracy and reader safety override impressions. Monday: hotfix production `main` (schema/banners, quarantine clinics, unpublish protocol tables, take down or noindex the live CagriSema approval post). Do not sell listings. Do not send outreach. Do not publish more URLs.

## The One Thing to Do First

On **production `main`**, stop `DossierLayout` from telling every visitor — and Google’s JSON-LD — that Ozempic is “Not FDA Approved,” “WADA Prohibited,” and “research use only.” Then quarantine the fake clinics. Then kill the three protocol pages and the live CagriSema “FDA approved” post.
