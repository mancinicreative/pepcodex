# Fabrication Remediation Plan (Opus 5)

*Created 2026-07-24. Owner request: "full sweep of any fabricated data … make sure it's all real
data, real trials … come up with the system which verifies all the information. First, make sure we
have a quality gate on the current state of information." The ~400 new verified claims land AFTER
this plan completes, on a clean foundation.*

---

## 1. Verified findings (measured, not assumed)

Full-surface audit (`scripts/qa-fabrication-audit.mjs`) — 2,137 identifier records:
**265 findings · 177 critical.**

| Surface | Findings | Critical | Verdict |
|---|---|---|---|
| `data/source-packs/` | 239 | 165 | Catastrophic — never gated |
| `src/content/blog/` | 14 | 11 | Bad — never gated |
| `src/content/peptides/` | 12 | 1 | **Clean** — the 3-wave sweep held |

### 1.1 The dossiers are clean — confirmed independently
An author/year probe over all 565 dossier `keyFindings[].pmid` records: **541 pass, 24 suspect, 0 dead.**
Manual inspection of the 24 shows most are matcher false positives (`Jette L` vs `Jetté L`;
`Nature Communications 2025` in an author slot; `Multicenter pediatric study 2018` as a label).
**True suspects: ~10, needing a light review pass — not a rewrite.**

### 1.2 The damage is confined to surfaces the gate could not see
Root cause: `scripts/qa-pmids.mjs:14` hardcodes `src/content/peptides`. It has never once read
`data/source-packs/` or `src/content/blog/`. Those surfaces hold **more identifiers than the ones
it checks.**

### 1.3 Two distinct problems, different urgency

**(A) Fabricated trials — LIVE ON PRODUCTION.**
`pack.trials[]` (300 records / 30 packs) is rendered by `src/layouts/DossierLayout.astro:241` on every
dossier page and by `src/pages/trials/index.astro:45` on the trials index. 114 NCT findings sit here.
`src/utils/citation.ts` turns each NCT into a live ClinicalTrials.gov link, so a fabricated title ships
*with an authoritative link that contradicts it*:
- `NCT05803421` shown as "REDEFINE CVOT: CagriSema Cardiovascular Outcomes Trial" → actually an
  **orforglipron vs insulin glargine** study.
- `NCT04163354` shown as "Phase 1b Cagrilintide + Semaglutide PK/PD" → actually
  **glass ionomer sealant vs fluoride varnish for dental caries**.
- `NCT00833248` shown as "Cerebrolysin and Recovery After Stroke (CARS)" → actually
  **degarelix for prostate cancer**.

**(B) Poisoned bibliography — LATENT, and the reason this recurred.**
`pack.sources[]` (213 records, only 8 packs) is **not rendered anywhere**. But it is the "verified
research input" a content agent reads. 122 fabricated DOIs live here, plus — newly measured — **115 of
128 PMID records whose stored title does not match PubMed**:

| Pack | PMID records | Title mismatches |
|---|---|---|
| `ghrp-6` | 40 | 40 |
| `sermorelin` | 36 | 36 |
| `ghk-cu` | 23 | 23 |
| `aod-9604` | 16 | 16 |

`aod-9604` is 16/16. Its PMIDs resolve to *Actinobacillus* capsular polysaccharide export, "Aquarium
species: deadly invaders", and a Facebook smoking-cessation study. **These are not damaged
bibliographies; they are invented ones.**

This is the direct threat to the owner's next step: adding 400 claims on top of a poisoned well
launders fabrication into the clean dossiers.

### 1.4 The fake DOIs are convincingly formatted — verified, not assumed
`10.1038/sj.ijo.0802229`, `10.3748/wjg.v25.i28.3851`, `10.1210/jcem.83.5.4748` all *look* like real
publisher DOIs. Two independent authorities disagree: Crossref `/works` → 404, and the DOI handle
system `doi.org` (no redirect follow) → **404**, while controls `10.1056/NEJMoa2502081` and
`10.1038/nature12373` → **302**. The check is sound; there is no false-positive problem here.

> Method note: `curl -L https://doi.org/<doi>` is **not** a valid existence test — it follows the
> redirect and returns the *publisher's* status (NEJM gives 403). Always test without `-L`: 302 = exists.

---

## 2. Strategy

Deterministic repair first, judgment second. Most of this does not need an LLM:

- **ClinicalTrials.gov is authoritative for trial metadata.** Title/phase/status/enrollment/dates
  are not opinions — overwrite ours with theirs. No model required.
- **PubMed is authoritative for a PMID's title/journal/year/authors and its real DOI.** Same.
- **Only two questions need judgment:** is a wrong-drug NCT a bogus entry or a legitimate comparator?
  And when a claim's only source turns out to be unrelated, what happens to the claim?

Sequencing is driven by harm: fix what users see (A) before what agents read (B), but **both must
land before the 400-claim refresh.**

---

## 3. Phases

### Phase 0 — Gate the current state (do first, blocks everything)
1. Commit outstanding gate work: `qa-pmids.mjs` fail-closed fix + 12s `AbortController` (this is also
   the fix that unsticks the hung production deploy), and `qa-fabrication-audit.mjs`.
2. **Fix root cause:** replace the hardcoded `src/content/peptides` path with a multi-surface walker
   covering `peptides` + `blog` + `comparisons` + `glossary` + `data/source-packs`.
3. Wire `npm run qa:fabrication` and put resolution checks in `prebuild`, build-breaking.

**Done when:** the gate reads every surface and fails on today's corpus (it *should* fail — that is proof).

### Phase 1 — Complete the measurement (close the audit's blind spots)
Current audit checks NCT title/drug match but **never title-checks PMIDs**, and never touches
`comparisons/` or `glossary/`. Build one unified verifier `scripts/verify-citations.mjs`:

| Check | Meaning | Source of truth | Verdict |
|---|---|---|---|
| **R** | identifier exists | CT.gov · PubMed · Crossref+doi.org | build-breaking |
| **T** | stored title matches | CT.gov `briefTitle` / PubMed title | build-breaking |
| **D** | intervention matches the drug | CT.gov `interventions` | review queue |
| **A** | first author matches | PubMed `authors` | review queue |
| **Y** | year matches (±1) | PubMed `pubdate` | review queue |

Requirements: on-disk ground-truth cache, resumable, batched (PubMed 150/req ~3req/s; CT.gov 50/req),
explicit coverage reporting, **fails closed on partial coverage**. Diacritic-insensitive author
matching (`Jetté`≡`Jette`) and tolerance for non-author labels in `study` fields — my probe's false
positives are the spec for this.

### Phase 2 — Deterministic repair (no LLM, fully reversible)

> **CORRECTION (2026-07-24, after running `scripts/triage-trials.mjs`).** This phase originally said
> "overwrite `pack.trials[]` titles from CT.gov." **That was wrong and would have caused real damage.**
> Triage of all 300 trial records shows the dominant failure is *real trial name + fabricated NCT*,
> not *real NCT + sloppy title*. Blind overwrite would have relabelled a **degarelix prostate-cancer
> trial as "Cerebrolysin and Recovery After Stroke (CARS)"** — filing a real competitor trial under
> the wrong peptide and erasing the evidence that the record was ever broken. Overwrite is only safe
> once drug-match is proven. The triage classes below encode that.

**Triage result (300 records / 19 packs / 287 unique NCTs) — `.planning/citation-audit/TRIAL-TRIAGE.md`:**

| Class | n | Meaning | Action |
|---|---|---|---|
| `OK` | 223 | drug + title both match | none |
| `COMPARATOR` | 34 | title matches CT.gov exactly (sim 1.0) but intervention isn't this peptide | **mostly false positives** — alias gaps (TAK-448 *is* a kisspeptin analog) + scope errors (competitor amylin trials filed under cagrilintide). Enrich aliases, re-triage, then decide scope. Not fabrication. |
| `BOGUS` | 21 | drug ≠ and title ≠ | **true fabrication**: real trial name, invented NCT. Repair by CT.gov search on acronym+intervention to recover the *real* NCT. Delete only if none exists. |
| `AUTOFIX_TITLE` | 12 | drug matches, title doesn't | right drug, **scrambled NCT→name mapping**. Safe to overwrite title, but must also emit the discarded name to an orphaned-claims worklist. |
| `MALFORMED` | 9 | no CT.gov-shaped id | **NOT fabrication** — legitimate non-CT.gov registries: `jRCT2031210504` (SURPASS J-mono, a real tirzepatide trial), `EUCTR2018-002231-14`, `ACTRN12610000287033`, `CTR20211515`. Deleting these destroys real data. Add multi-registry support. |
| `R_FAIL` | 1 | NCT doesn't exist | `survodutide NCT05179576` → delete or re-source |

**Worked examples of the scrambling** (all drug-correct, all NCT-wrong):
- `ss-31`: `NCT02367014` stored as "TAZPOWER-Barth" is really **MMPOWER**; `NCT03098797` stored as
  "ReCLAIM: Dry AMD" is really **TAZPOWER**. The NCTs and names were shuffled against each other.
- `semaglutide`: "SELECT" → `NCT03552757` is really **STEP 2**; "FLOW" → `NCT04777396` is really **EVOKE**.
- `ll-37`: "Venous Leg Ulcers" → `NCT02225366` is really **intratumoral LL37 for melanoma**.

**Repair order:**
1. `AUTOFIX_TITLE` (12) — overwrite title/phase/status/enrollment/dates from CT.gov; log discarded names.
2. `BOGUS` (21) — CT.gov search to recover the real NCT for the named trial; human-confirm each.
3. `MALFORMED` (9) — teach the verifier EU CTR / ANZCTR / jRCT / ChiCTR id formats; verify separately.
4. `COMPARATOR` (34) — enrich aliases first; whatever survives is a scope decision, not a fix.
5. **DOIs in `pack.sources[]`** → resolve the sibling PMID via PubMed `articleids`, take the real DOI;
   if PubMed has none, **drop the field** (a missing DOI is honest, a fabricated one is not).
   **Caveat:** only valid where the PMID itself is sound — in the 4 gutted packs it is not (§3, Phase 3).
6. **PMID metadata in `pack.sources[]`** → overwrite title/journal/year/authors from PubMed, *only*
   where the paper is topically related to the peptide. Where it is not (aod-9604's *Actinobacillus*
   paper), there is nothing to repair — the citation is void and the claim it supported is orphaned.

Every write is idempotent and re-runnable. Commit per pack, gate green between.

### Phase 2b — Internal-consistency checks (added; found by Codex)
Detectable with **no network call**, and missed by every identifier check:
- Same NCT/PMID appearing 2+ times with **conflicting** enrollment / status / phase / title
  (Codex found this in `cagrilintide`; each conflict proves at least one side is fabricated).
- `sources.count` disagreeing with the actual array length (`ghk-cu`: claims 36, has 35).
- Templated identifiers (`10.3390/ijms21234567`, `10.21203/rs.3.rs-1234567`) and patterned PMIDs/PMCIDs.
- DOI prefix contradicting the stated journal (a `10.1006/meth.` DOI on a paper said to be in
  *Molecular and Cellular Endocrinology*).
These are cheap, deterministic, zero-false-positive, and belong in the build gate.

### Phase 3 — Judgment queue (what deterministic repair cannot decide)
1. **Wrong-drug NCTs (~39 D findings)** — delete, or retain explicitly labelled as a comparator trial.
2. **The 4 gutted packs** (`aod-9604`, `ghrp-6`, `sermorelin`, `ghk-cu`, 115/128 fabricated) —
   **recommendation: quarantine `sources[]` wholesale and rebuild from real PubMed searches.**
   Patching a fabricated bibliography record-by-record preserves its structure and invites
   partially-correct results; regeneration from a real query is cheaper *and* more trustworthy.
3. **Orphaned claims** — where a claim's only support was a fabricated citation, the claim goes too
   unless a real source is found. Never leave a claim standing on a deleted source.
4. **~10 true dossier suspects** from §1.1.

Codex runs this queue as an independent second opinion; disagreements escalate to the owner.

### Phase 4 — Prevention (so this cannot recur)
- Unified gate in `prebuild`, build-breaking, covering every surface.
- Add provenance to the source-pack schema (`verifiedAt`, `verifiedBy`, `verificationMethod`);
  records without it cannot ship.
- Add a `sources[]` renderer-or-delete decision: data that ships nowhere but is trusted as input is
  exactly how this rotted unseen.

### Phase 5 — Verify and ship
Re-run the full audit → **zero critical**. `npm run check` green. Full `npm run build` with
`REAL_BUILD_EXIT=0` captured *inside* the log (per `.claude/rules/lessons.md` — a trailing grep's exit
code is not the build's). Then push, unsticking prod.

**Only then** does the 400-claim content refresh begin.

---

## 4. Division of labour

- **Opus 5 (lead):** verifier + repair-script design, deterministic execution, adjudication, final call.
- **Codex (contrarian / gap-filler):** independent adversarial review of this plan; hunts fabrication
  classes not covered by R/T/D/A/Y; second-opinions the Phase 3 judgment queue. Not a backup — a
  disagreeing peer. Known constraints: needs `< /dev/null`, `-C <repo>`, `--sandbox read-only`;
  model `gpt-5.6-sol`.

## 5. Explicitly out of scope
App tab (Workstream B), the 400 new claims, blog restructuring. All wait for a clean foundation.

## 6. Non-negotiables
No claim without a real, resolving, **topically correct** source. No dosing/sourcing/medical advice.
Schema-valid (`astro build` is the arbiter). No agent pushes to prod. When a source dies, the claim
it supported dies with it unless independently re-sourced.
