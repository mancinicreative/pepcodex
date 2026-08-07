# Citation audit — findings, remediation queue, and the gate

*2026-08-07. Evidence: `.planning/data/v2/triage-results.json`, `triage-preclass.json`,
`citation-baseline.json`. Verification via PubMed E-utilities + ClinicalTrials.gov.*

## What happened

An audit of all 155 blog posts found **67 whose frontmatter `sources:` carry no PMID, DOI or
URL** — unverifiable by construction on a site whose entire positioning is evidence-based. Seven
agents then checked every factual claim in those 67 against primary sources.

| Verdict | Count | Meaning |
|---|---|---|
| **UNSALVAGEABLE** | **31** | central claims describe studies that do not exist |
| **NEEDS-REWRITE** | **34** | real topic, but claims overstate / misattribute / garble it |
| FIXABLE | **1** | claims check out; only needed the real identifier |

**Of the 15 posts ranking in Google, 10 were unsalvageable and none were fixable.**

### Two representative findings

**`/blog/semax-neuroprotection-stroke`** (1,133 impressions, position 8.2) describes a rat MCAO
study with 62%/48%/31% infarct reductions, rotarod recovery and apoptosis markers.
`semax AND rotarod` and `semax AND apoptosis` each return **zero** PubMed results. The "847 genes"
figure matches nothing — real DEG counts in that lab's papers are 394, 1539, 131, 152. Route and
dose are wrong for the literature cited (intraperitoneal, not intranasal), and the nearest real
paper performed **no behavioural testing at all**.

**`/blog/dsip-sleep-quality-study`** (592 impressions) claims a 120-participant, 4-week,
placebo-controlled intranasal trial. The real DSIP human literature is n=6, n=7 and n=16,
intravenous, from the 1980s–90s — and its largest genuine trial (PMID 1299794) concluded DSIP is
*"not likely to be of major therapeutic benefit"*, **the opposite of the post's claim**.

The topics are legitimate. The specific studies were invented.

## Why the existing gate missed it

`qa-pmids.mjs --strict` runs on every build and **passes** — 682 PMIDs, 48 NCTs and 11 DOIs all
resolve. That is real quality. But it verifies *identifiers that exist*. A citation with no
identifier has nothing to resolve, so it passes silently. That is the blind spot.

## The gate (now live)

`scripts/qa-source-identifiers.mjs --strict`, wired into `npm run check` → `prebuild`.

It runs as a **ratchet**, not a wall:
- `.planning/citation-baseline.json` records the 202 known offenders.
- The build fails only on citations **not** in that baseline — so the count can only go down.
- Fix a file, run `--update-baseline`, and it can never regress.

A gate failing all 202 would fail every build and be switched off within a day. This one blocks
new violations today while the backlog is worked down.

Verified with real exit codes (not a piped tail): clean tree → 0; injected fake source → **1**;
after restore → 0.

## Applied so far

- **31 unsalvageable posts** → `robots: noindex` + dropped from the sitemap. Still published for
  anyone holding a link; `noindex, follow` so they keep passing crawl paths.
- Verified in `dist/`: 31 emit the tag, **0** remain in the sitemap, sitemap 1,124 → 1,084.

## Remediation queue

**The triage recovered real, verified identifiers for 31 of the 34 rewritable posts** — so these
are grounded rewrites, not research from scratch. Examples:

| Post | Real source recovered |
|---|---|
| zepbound-sleep-apnea-approval | PMID 38912654 · NCT05412004 (SURMOUNT-OSA) |
| retatrutide-phase3-enrollment | PMID 37366315 · NCT04881760 |
| amycretin-phase2-results | PMID 40550229 · PMID 40550231 |
| aod9604-human-efficacy | PMID 11146367 |
| 2025-glp1-year-review | PMID 40544433 · NCT05567796 |
| **amgen-maritide-phase2** (FIXABLE) | PMID 40549887 · NCT05669599 |

**Do NOT simply paste these identifiers into the existing posts.** These are NEEDS-REWRITE
because the *claims* diverge from the sources. Attaching a real PMID to a wrong claim makes it
look verified while remaining false — strictly worse than the current state. The claims must be
rewritten to match what the papers actually report.

Three posts (incl. `ai-peptide-drug-discovery`) have **no supporting identifier at all** — the
triage correctly refused to invent one. Those are effectively unsalvageable in their current form.

## Open items

1. **Rewrite the 34** from the recovered sources, claims first. Highest-traffic first:
   zepbound-sleep-apnea-approval (481 impr), retatrutide-phase3-enrollment (131),
   ai-peptide-drug-discovery (116).
2. **Spot-check the 89 "clean" posts.** All 682 PMIDs resolve, but *a resolving PMID can still be
   attached to a claim it does not support* — the subtler failure the gate cannot catch. Given
   what the audit found, do not assume. Sample 10–15.
3. **Semax Russia approval year is unresolved.** Blog says 2011, dossier says ~1997, secondary
   sources say 1994. All three may be wrong. Needs a primary registry document — do not
   standardise on a guess.
4. **`peptides/mk-677.mdx` has 10 unverifiable sources** — the only dossier affected, and dossiers
   are the flagship content. Not yet triaged.
