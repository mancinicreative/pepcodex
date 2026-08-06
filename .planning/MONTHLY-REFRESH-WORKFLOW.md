# Monthly Research Refresh — Workflow

*Created 2026-07-24. Repeatable process for keeping all 102 dossiers, trials, regulatory status and
the blog current, without reintroducing fabrication.*

---

## Principle

**Discovery is deterministic; judgment is not.** A script asks the registries what is new, so an
agent never has to recall whether a paper exists — it can only choose among items that were fetched
from PubMed / ClinicalTrials.gov in that run, each already carrying a resolving identifier. This is
the single structural defence against the failure mode that produced the July 2026 sweep: an agent
writing a plausible citation from memory.

Corollary rule for every agent below: **an agent may never introduce an identifier that is not in
its input worklist or that it has not itself fetched and confirmed.**

---

## Step 0 — Baseline must be green

```bash
npm run qa:consistency && npm run qa:dossiercites && npm run qa:trials && npm run qa:packcites
```
If any gate fails, fix that first. Refreshing on top of a broken baseline is how contamination
compounds — the packs were poisoned precisely because new content was layered onto unverified data.

## Step 1 — Scan (deterministic, no agents)

```bash
npm run research:scan -- --days 30
```
Writes `.planning/research-scan/<date>/<slug>.json` per peptide plus `SUMMARY.md`:
- `newPapers[]` — PubMed records entered since the window whose PMID we do not already cite
- `newTrials[]` — CT.gov registrations we have never referenced
- `updatedTrials[]` — trials we already list whose registry record changed (status, enrollment, phase)
- `filteredOut` — hits the relevance filter rejected (see below); a large number here is a signal
  that this peptide's aliases are ambiguous, not that the month was busy

Only genuinely new identifiers appear; anything already in the repo is filtered out.

### The relevance filter, and why it is not optional
**A search result is not evidence.** Two failures found while calibrating this scan, both of which
would have fed a content agent fabricated-adjacent material:

1. **PubMed degrades unmatched phrases.** When a quoted term has no match, PubMed silently falls back
   to loose term matching and returns a large, confident, entirely unrelated set. A `bronchogen`
   search returned 60 papers on OX40-OX40L signalling, daptomycin pneumonia and phage-antibiotic
   synergy. With the filter: **0**.
2. **Short aliases are acronym collisions.** `NASA` (an alias of N-Acetyl Selank Amidate) matched a
   room-temperature maser and a paper on Mars' magnetosphere. `AED` (Cardiogen) matched Automated
   External Defibrillators. `EDL` (Ovagen) matched the extensor digitorum longus muscle. `P21`
   matched the p21/CDKN1A gene across unrelated oncology papers.

So a paper only enters a worklist if it names the peptide *distinctly*: a name or alias of ≥6
characters on a word boundary, or a shorter one **plus** a peptide-context word. Calibration after
the fix — noise collapsed, real signal held:

| peptide | before | after |
|---|---|---|
| `bronchogen` | 60 | **0** |
| `na-selank-amidate` | 161 | **13** |
| `cardiogen` | 22 | **1** |
| `p21` | 179 | **24** |
| `tirzepatide` | 60 (truncated) | **121** |
| `ll-37` | 197 | **66** |

If a future peptide shows an implausible count, suspect its aliases before believing the month was
productive.

## Step 2 — Specialist agents (parallel, ≤3 concurrent)

Each agent owns ONE realm and receives only its own worklist. Concurrency is capped at 3 because
the repo lives on OneDrive and parallel file watchers exhaust Windows file handles; agents must also
never run `astro build`, since parallel builds corrupt the shared `.astro` cache.

| Agent | Realm | Input | Output |
|---|---|---|---|
| **A. Evidence analyst** | New papers → dossier `keyFindings` / `conditions` | `newPapers[]` | dossier edits + evidence grade |
| **B. Trials analyst** | Trial registrations and status changes | `newTrials[]`, `updatedTrials[]` | `data/source-packs/<slug>.json` edits |
| **C. Regulatory analyst** | Approvals, label changes, scheduling, WADA/FDA bulk list | openFDA, EMA, FDA press | `regulatoryStatus` edits |
| **D. Editorial** | Blog posts from the month's significant developments | A/B/C outputs only | new `src/content/blog/*.mdx` |
| **E. Verifier** | Independent re-check of everything A–D wrote | the diff | verdict per file |

**Agent D may only cite what A/B/C verified.** It does no discovery of its own — that separation is
what stops a narrative from acquiring a citation to fit it.

**Agent E is not optional and does not edit.** It re-resolves every identifier the others touched and
confirms topical match, because resolution alone never caught the fabrications — only topic matching
did.

### Standing brief clauses for every agent
- Never invent a PMID, DOI, NCT, URL, author, year, journal, enrollment, or effect size.
- Never attach an identifier without fetching it and confirming it points at the claimed document.
  A real identifier for the wrong paper is worse than none — it looks verified.
- A claim whose only source is removed must be removed or softened, never left standing.
- Banned content: dosing protocols, sourcing/where-to-buy, medical advice.
- Preprints and press releases must be labelled as such and never presented as published results.
- Registration of a trial is not evidence of efficacy.
- Do not run build commands.

## Step 3 — Gate before commit

```bash
npm run check          # consistency → cross-links → seo → scoring → citations (all strict)
npm run qa:dossiercites && npm run qa:packcites && npm run qa:trials
npm run qa-retractions # weekly-ish; catches a cited paper being retracted
{ npm run build; echo "REAL_BUILD_EXIT=$?"; } > build.log 2>&1
grep REAL_BUILD_EXIT build.log   # must be 0 — the wrapper's own exit code is NOT the build's
```

## Step 4 — Score reconciliation

Where the evidence base materially moved, recompute the dossier `scoring:` block. Conservative rule:
new corroborating evidence may raise a score; a corrected fabrication may only lower it.

## Step 5 — Human review, then merge

Agents produce a branch and a per-dossier delta report. No agent pushes to production.

---

## Cadence

- **Monthly:** full scan + agents A–E.
- **Weekly:** `qa-retractions` (a cited paper can be retracted at any time).
- **Every build:** `qa:consistency` (offline, fast) + `qa-pmids --strict`.

## Known gaps to close

- **50 files name a specific trial with zero citations** (`.planning/citation-audit/uncited-trial-claims.json`):
  25 comparisons, 20 glossary, 4 guides, 1 condition. Mostly reference pages listing a trial
  programme (STEP-1…STEP-5) rather than asserting novel findings, and their *numbers* are now
  cross-checked against the verified dossiers by `qa:claims`. Still: a reader cannot follow them to
  a source. Fix by having the Evidence agent attach the dossier's already-verified PMID for each
  named trial — no new research required, it is a link-up job.
- **Estimand labelling is not yet mechanically enforced.** `qa:claims` catches the *same* trial
  quoted with different numbers across files, but not a single isolated page quoting only the
  sponsor's efficacy estimand. The durable fix is to record both estimands in the dossier and have
  the render layer show which is which.
- Foreign registries (jRCT, EU CTR, ANZCTR, ChiCTR) have no automated verifier; 5 records are flagged
  `verified: false` pending one. Cross-reference to a CT.gov id where the trial is dual-registered —
  SURPASS J-mono/J-combo resolved that way.
- `news`/`regulatory` blog sources cannot be registry-resolved; they need a URL at authoring time.
- Quantitative claims (a %, an n, an endpoint) inside prose are still unverified by any gate — the
  identifier can be perfect while the number attached to it is invented. This is the largest
  remaining hole and the natural next mechanical check.
