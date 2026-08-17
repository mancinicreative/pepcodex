# Claim audit of the 88 "clean" blog posts — results

*2026-08-17. Stratified sample of 20 posts, four independent agents, every verdict backed by a
verbatim quote from the fetched abstract or registry record. Raw data:
`.planning/data/v2/claims-audit.json`, `.planning/data/v2/citation-strength.json`.*

## Verdict: SYSTEMIC

The escalation rule was fixed **before** the run: 0–1 problems → contained · 2–4 → expand ·
**5+ → systemic**. Any single CONTRADICTED escalates on its own merits.

| Classification | Count | Meaning |
|---|---|---|
| SUPPORTED | 5 | claims match the cited sources |
| OVERSTATED | 3 | animal data as human, preliminary as established, non-primary estimand as headline |
| MISATTRIBUTED | 4 | real claim, wrong paper attached |
| **CONTRADICTED** | **8** | the cited source says something materially different |

**15 of 20 posts carry a material problem. 8 are contradicted by their own citations.**
That is triple the systemic threshold, with eight independent escalation triggers on top.

These 88 posts were the cohort we had *no evidence against* — every PMID in them resolves and
the build gate passes on all of them.

## The traffic-stratified control failed to separate

Sampling was 15 posts with GSC impressions and 5 with none, to test whether editorial attention
tracked traffic.

| Stratum | Problems |
|---|---|
| Zero-impression control | 4 / 5 |
| Top-traffic (1,004 / 432 / 261 / 242 impressions) | 3 / 5 |
| Mid-traffic batches | 8 / 10 |

Quality is **uniform across traffic levels**. Nobody was reviewing the pages that mattered more
carefully. The cause is the generation run, not editorial neglect of the tail — which means the
68 unsampled posts should be expected to fail at the same ~75% rate.

## The cheap triage shortcut does not exist

One agent proposed that citation *style* predicts correctness: posts citing real PMIDs check out,
posts citing bare domain URLs invent things. Within its own five posts that held. Across all
twenty it does not.

| Citation profile | Problem rate |
|---|---|
| Zero PMID/DOI/NCT — every source a bare URL | **3 / 3** |
| At least one real PMID/DOI/NCT | **12 / 17** |

A resolving PMID predicts almost nothing: 12 of 17 PMID-carrying posts still fail, 5 of them
CONTRADICTED. **`what-is-cjc-1295` and `what-is-epithalon` each cite a real paper that exists
specifically to refute the claim it is attached to.** There is no identifier-shaped signal that
separates good from bad here — only reading the papers does. That kills the cheap option and
sets the true cost of the remediation.

## Representative findings

**`survodutide-phase-2-mash-results`** — the post's table reports 83% MASH resolution at 6.0 mg.
The cited NEJM trial (PMID 38847460) reports **43%**. Off by 40 points. The post then claims a
"consistent dose-response… higher doses produced better outcomes" — the real trial found a
quadratic curve where 6.0 mg (43%) performed **worse** than 4.8 mg (62%). A fabricated number was
used to manufacture a mechanistic argument the data contradicts.

**`orforglipron-attain-1-results`** — two of its NEJM DOIs are fabricated. `10.1056/NEJMoa2404251`
and `10.1056/NEJMoa2306449` each return 404 at doi.org, "Resource not found" at CrossRef, and
zero PubMed hits. Control check confirms the method: real DOIs from the same journal resolve
normally. 1 of 12 claims supported.

**`cagrisema-nda-filed-glp1-amylin-combo`** — dated 2025-06-30, opens "Novo Nordisk has submitted
a New Drug Application." Novo announced the submission on **18 December 2025**, nearly six months
later. The post reported a regulatory event before it happened. Headline claims "exceeding 23%"
weight loss; the highest figure Novo reports is 22.7%, and the trial's primary estimand is 20.4%.

**`thymosin-alpha1-elderly-immune`** — describes an RCT of 240 adults aged 65–80. Three PubMed
searches return no such study. Its body cites `[ta1-elderly-2025]`, `[immunosenescence-review]`
and `[ta1-approval-status]` — **none of which exist in its own frontmatter.** Every quantitative
claim in the post has no source behind it at all.

## Two new mechanical gates, both validated on the sample

The audit produced failure classes the current gates structurally cannot see. Both are cheap.

**1. Dangling citation keys** — body text cites `[key]` with no matching `id:` in frontmatter.
Swept all 155 posts: **14 live posts affected**, 336 body citation keys checked. Two of the 14
were in the audit sample; the audit independently flagged both (`thymosin-alpha1-elderly-immune`
CONTRADICTED, `tirzepatide-surmount-osa` MISATTRIBUTED). 2/2 predictive. The other 12 were never
audited and are unsourced by the same construction:

```
fda-peptide-stability-guidance · fda-semaglutide-shortage-extended
fda-tightens-peptide-compounding-rules · ghkcu-stem-cell-differentiation
glp1-alcohol-cravings-research · glp1-dementia-risk-study
glp1-kidney-disease-outcomes · glp1-kidney-protection-confirmed
thymosin-alpha-1-aging-immunosenescence · thymulin-vaccine-response
tirzepatide-cancer-incidence · tirzepatide-summit-heart-failure
```

**2. DOIs hiding inside `url:` fields.** `qa-pmids.mjs` resolves the `doi:` field. It never sees
`url: https://www.nejm.org/doi/full/10.1056/NEJMoa2404251`, so a fabricated DOI passes as a valid
"URL identifier" — exactly how `orforglipron-attain-1-results` shipped. Extract any DOI pattern
from URL fields and resolve it.

**3. Source-title drift.** Two frontmatter titles were altered from the real PubMed title in ways
that strip a qualifier — `pmid-9141536` replaced the compound name `[Nle27]GHRH-(1-29)-NH2` with
the generic "GHRH analog", concealing that the sermorelin post's only adult-human citation is not
a sermorelin study. Comparing each frontmatter title to the PubMed `esummary` title catches this
class for one API call per source.

## Trap recorded

ClinicalTrials.gov `NCT07487363` is returned by a TB-500 query and its own brief summary states
it is a **fictional example record**. It must never be cited. A resolving NCT proves nothing on
its own — `NCT05869903` resolves fine while being the wrong trial for the post citing it.

## Real PMIDs attached to entirely unrelated papers

The synthesis pass re-verified four citations independently. These are not near-misses:

| Cited as | PMID actually is |
|---|---|
| the SCALE liraglutide trial | 25673352 — *"A radical psychiatrist and the law: the forensic career of Reg Ellery"* |
| sleep-apnea literature | 34817598 — *"State of the Journal, 2021"* (Am J Occup Ther) |
| sleep-apnea literature | 37957351 — a bat vocal-timing paper (Commun Biol) |
| supporting CJC-1295 losing pulsatility | 17018654 — *"Pulsatile secretion of GH **persists** during continuous stimulation by CJC-1295"* |

And `survodutide-phase-2-mash-results` cites DOI `10.1056/NEJMoa2401943` for survodutide;
Crossref returns that DOI as the **tirzepatide** MASH trial. It resolves cleanly, so the gate
passed it. A resolving identifier is not evidence of anything.

## The failure has a shape, and it is post-type

Date does not predict failure. Traffic does not predict failure. Two things do:

- **Breaking trial-news posts** carry the invented trials, dose arms and regulatory events —
  6 of the 8 CONTRADICTED.
- **Evergreen `what-is-X` explainers** fail quietly instead: real PMIDs cover the background
  biology while the distinguishing content — comparison tables, WADA status, half-life figures,
  "development discontinued" narratives — carries no citation at all. Roughly half of every
  explainer is uncited.

Operational rule: **a post is suspect whenever its distinguishing content is not covered by a
source that identifies a specific document.**

## What this changes

PRD #1 assumed a rewrite queue of 34 posts against a mostly-sound remainder. The remainder is not
sound. At the observed rate the real exposure is roughly **66 of the 88** plus the 34 already
queued — and no mechanical shortcut narrows it, because resolving identifiers do not predict
correctness.

"Rewrite from recovered sources" is also the wrong remedy for the CONTRADICTED tier. In 8 of 20
posts the number, the trial arm or the event was **invented, not misremembered** — there is no
source to rewrite from.

**The cost of holding the whole blog is zero clicks.** Verified across both GSC properties:
`/blog/` pages have **0 clicks all-time** against 6,385 impressions (6,110 apex + 275 www).
Under the crawl-budget rule, removing those URLs is a gain, not a sacrifice.

The decision this forces is scope, not method, and it belongs to Lucas.
