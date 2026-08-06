# Codex (gpt-5.6-sol) — Adversarial Review of Phase 39 Workstream A

*Independent adversarial review requested 2026-07-24. Model: gpt-5.6-sol, read-only, repo-pinned.*

---

# Adversarial Review of Workstream A

## Verdict

Workstream A is not safe to execute as written. It confuses identifier validity with evidence validity, uses editorial timestamps as data-ingestion cursors, relies on a refresh script that can preserve incorrect trial names, and places substantive verification after prose generation. That is the wrong order for a corpus recovering from fabricated-but-resolving citations.

The central claim—“Research → Update → Review” across all 102 dossiers in one week—is not an execution architecture. It lacks durable source records, canonical deduplication, claim-level provenance, checkpoints, failure semantics, and a human-review budget. Running it now would create a large amount of plausible-looking text whose integrity cannot be mechanically established.

There are already direct counterexamples in the current checkout:

- `scripts/refresh-trials.mjs` deliberately preserves curated titles while overwriting API-derived fields.
- In `data/source-packs/semaglutide.json`, `NCT04777396` is titled “FLOW: Kidney Outcomes in T2D with CKD,” while its refreshed conditions and interventions say early Alzheimer’s disease and semaglutide. ClinicalTrials.gov identifies that NCT as the EVOKE Alzheimer’s trial, not FLOW. The identifier resolves; the association is false. [ClinicalTrials.gov: NCT04777396](https://clinicaltrials.gov/study/NCT04777396)
- `scripts/refresh-trials-all.mjs` catches per-pack failures, continues applying later packs, prints the failed slugs, and still exits successfully.
- `scripts/qa-pmids.mjs --strict` is fail-open on network failure. A complete NCBI, CT.gov, or Crossref outage can produce warnings followed by a final `PASS`.
- That citation gate scans only `src/content/peptides/*.mdx`. It does not validate `data/source-packs/*.json` or `src/content/blog/*.mdx`, even though Workstream A explicitly writes both.
- The current checkout contains 102 canonical dossiers, but a direct frontmatter scan finds **86**, not 67, with `lastUpdated` in `2026-01`. The freshness statistics embedded in the planning material are already stale.
- The source-pack validator and the source packs do not agree. `data/schemas/source-pack.schema.json` requires `peptide` to be an object and trials to contain `nctId`; current packs commonly use a string peptide and newly added trials use `id`. `scripts/validate-source-pack.js` is not in `npm run check`.
- The representative dossier contains multiple uncited or loosely cited quantitative and regulatory claims. `src/content/peptides/semaglutide.mdx` has structured PMIDs for some findings but also free prose about approvals, price, patent expiry, caloric-intake reductions, adverse-event percentages, and lean-mass loss without an exact claim-to-source mapping.

The plan should not proceed until these structural problems are fixed.

## 1. Failure modes at scale

### API and ingestion failures

| Failure | Concrete mechanism | Consequence |
|---|---|---|
| Shared PubMed rate limit | NCBI allows 3 E-utility requests/second per IP without a key and 10/second with a key. `audit-citations-verify.mjs` and `qa-pmids.mjs` each throttle to about 2.5 requests/second, but the plan introduces separate agents without a shared limiter. Two concurrent workers already exceed the anonymous limit. NCBI also recommends large jobs run at night or on weekends. [NCBI E-utilities guidance](https://www.ncbi.nlm.nih.gov/books/NBK25497/) | HTTP errors, temporary blocking, incomplete batches, and non-reproducible discovery. |
| openFDA daily quota | Anonymous openFDA access is 240 requests/minute but only 1,000 requests/day/IP; a key raises the daily quota to 120,000. Three endpoint families across 102 dossiers already consume 306 requests before aliases, pagination, retries, or validation. [openFDA limits](https://open.fda.gov/apis/authentication/) | An apparently successful partial sweep can exhaust the daily quota midway through the corpus. |
| Crossref policy drift | As of 21 July 2026, Crossref’s public/polite limits differ for single-record and list requests: public 5/1 per second and polite 10/3 per second. Clients are expected to inspect rate headers and handle HTTP 429. The scripts use fixed sleeps and do not inspect those headers. [Crossref’s current limits](https://community.crossref.org/t/refining-rest-api-limits-for-improved-stability-and-reliability/16137) | Fixed throttles become wrong when endpoint class or API policy changes. |
| CT.gov truncation | CT.gov v2 supports pages up to 1,000 and returns pagination tokens. `refresh-trials.mjs` requests one page, defaults to 300, and never follows `nextPageToken`. [CT.gov migration guide](https://clinicaltrials.gov/data-api/about-api/api-migration) | Broad aliases silently lose results beyond the first 300. `totalCount` can reveal the loss, but the script does not fail on it. |
| CT.gov freshness race | CT.gov refreshes Monday–Friday, generally by 9 a.m. ET, and exposes `dataTimestamp` specifically so clients can tell whether refresh completed. The script does not record or check it. [ClinicalTrials.gov API](https://clinicaltrials.gov/data-api/api) | Two runs on the same date may observe different registry states. |
| Europe PMC pagination | Europe PMC supports `pageSize` up to 1,000 with `cursorMark`; the plan specifies no cursor storage, overlap window, or retry policy. [Europe PMC API](https://europepmc.org/RestfulWebService) | Large or generic queries can be silently truncated or restarted from page one. |
| No timeouts in refresh clients | `refresh-trials.mjs`, `refresh-trials-all.mjs`, `audit-citations-verify.mjs`, and `qa-retractions.mjs` do not consistently use abort-bound fetches. | A single stalled endpoint can block an agent indefinitely. |
| Fail-open verification | `qa-pmids.mjs` catches resolver exceptions and continues. If all resolvers are unavailable, it can print `PASS` because no explicit unresolved record was accumulated. `qa-retractions.mjs` exits zero when its dataset is unavailable. | “Green” means either “verified” or “verification did not run.” Those states are indistinguishable to the build. |

### Search and matching failures

1. **`lastUpdated` is not a discovery cursor.** It is changed by editorial work, rescoring, or unrelated cleanup. Searching PubMed “since `lastUpdated`” can miss:

   - Older papers indexed after that date.
   - Early-online papers whose issue date predates the edit.
   - Corrections, expressions of concern, or result updates.
   - Evidence skipped because a cosmetic edit advanced `lastUpdated`.
   - Previously discovered candidates that were rejected or left unresolved.

   Each source needs an independent cursor based on that source’s update semantics, plus an overlap window.

2. **Alias expansion causes contamination.** `refresh-trials.mjs` joins the peptide name and every alias with `OR`. Brand names, family terms, common acronyms, and combination products return:

   - Comparator-only arms.
   - Background medications.
   - Class-level studies.
   - CagriSema studies duplicated into both cagrilintide and semaglutide packs.
   - Generic “anti-obesity medication” trials in which the tracked peptide is not required.
   - Acronym collisions.

   A query hit is not an entity match.

3. **The same evidence arrives repeatedly.**

   - PubMed and Europe PMC often expose the same paper.
   - A DOI and PMID may identify the same publication.
   - A preprint can later become a journal paper.
   - CT.gov, a publication, a sponsor release, and BioPharma Dive can describe the same trial event.
   - A multi-intervention trial legitimately belongs to several dossiers.

   The plan has no canonical evidence-event model. Deduplicating only by PMID, DOI, or NCT independently will still double-count publications and inflate source totals or scoring.

4. **Publication updates are not new studies.** Errata, protocols, design papers, subanalyses, conference abstracts, and primary results can share trial names and NCTs. The plan does not distinguish them.

5. **The selection policy contradicts itself.** `.planning/RESEARCHER-CRITERIA.md` says a single animal study is a red-flag skip, but its BPC-157 example says to add a single rat study to the dossier. It also says “score 2+ to cover,” while the decision matrix says Early/High/New should be monitored without coverage. Different agents will make different decisions from the same evidence.

### Partial failure and resumability

`refresh-trials-all.mjs --apply` is a concrete example of unsafe partial application:

1. It writes each pack immediately.
2. It catches failures.
3. It continues to later packs.
4. It has no rollback.
5. It has no run manifest.
6. It exits zero even when `failed.length > 0`.

A process terminated after pack 17 leaves a half-refreshed corpus. Re-running stamps additional dates and may select a different top 40 new trials. There is no way to prove which API response produced which file.

The findings proposed in the plan have no JSON Schema, schema version, stable identifier, provenance hash, run ID, or status machine. A partially written `<slug>.json` can be consumed as if complete.

### Idempotency and non-determinism

The current design is not idempotent:

- `trialsLastSynced` and `metadata.lastUpdated` change on every `--apply`, even when no substantive field changed.
- New CT.gov results are capped at 40 after sorting only by `startDate`. Ties inherit API response order.
- API indexes change during a multi-day run.
- LLM evidence grades and recommendations are not tied to a rubric version or deterministic inputs.
- A changed alias list changes the result set without recording the query version.
- A failed batch followed by a rerun may produce different findings while overwriting the original evidence.
- DOI case, URL forms, PMID/PMC cross-links, and preprint-to-publication relationships are not normalized.

An idempotency key should at least include:

```text
source + canonical-record-id + source-version/update-date + dossier + claim-type
```

### Git and agent conflicts

“Commit per wave” does not define file ownership. A trial can affect multiple source packs, a paper can affect multiple dossiers, regulatory changes can affect shared pages, and the blog consumes the same findings.

Likely conflicts include:

- Research regenerating a findings file while Update consumes it.
- Two writers touching the same dossier for research and regulatory changes.
- Trial refresh and manual title correction touching the same source pack.
- Blog generation consuming unmerged dossier changes.
- Multiple agents modifying shared counts or navigation.
- OneDrive conflict copies. The existing citation extractor already contains special logic to exclude files matching ` N.mdx`, which proves this is not hypothetical.

Use isolated worktrees or branches with exclusive dossier ownership. Do not let multiple agents edit the same paths concurrently.

### Context limits

A reviewer cannot reliably validate an entire dossier, a large source pack, multiple abstracts or full texts, and a generated diff in one context window. `semaglutide.mdx` alone is 762 lines, and its source pack is much larger. The likely failure is selective attention: the reviewer checks the newly obvious citation and misses copied names, secondary claims, or unrelated fields.

Verification must consume small claim packets, not whole-corpus prose.

## 2. The three-agent split is wrong

The proposed split assigns units of work incorrectly:

- Discovery is naturally **source-centric**.
- Verification is naturally **claim–citation-pair-centric**.
- Composition is naturally **dossier-centric**.
- Final release review is naturally **small-PR-centric**.

The plan forces all four into a dossier pipeline.

### Problems with Research → Update → Review

1. **Verification happens too late.** The writer turns unverified findings into polished prose before topical and numerical support is established. That creates anchoring pressure: reviewers are more likely to rationalize a plausible paragraph than reject the underlying evidence.

2. **The Update agent is deliberately blinded.** “Consumes Agent 1’s findings only—never invents its own sources” prevents source invention, but also prevents the writer from reading enough source context to represent limitations accurately. A `why-it-matters` string is not an adequate substitute for methods, arms, endpoints, estimands, or publication status.

3. **The reviewer is asked to reconstruct missing provenance.** The reviewer must discover whether a number “actually appears” in a paper, but the finding contract contains no quoted evidence span, section, table, endpoint path, or source snapshot.

4. **A non-editing reviewer creates ping-pong.** Independence is valuable for semantic decisions, but `clean | needs_work` is too coarse. It guarantees repeated handoffs for typos, missing qualifiers, enum issues, or one unsupported number.

5. **No terminal escalation rule exists.** Research and Review can disagree indefinitely about evidence grade or support. There is no “one bounce, then human adjudication” rule.

### Better decomposition

1. **Source ingestion worker — deterministic, no LLM prose**

   Fetches and snapshots PubMed, Europe PMC, CT.gov, Crossref, and official regulatory records with source-specific cursors and retry logic.

2. **Entity-resolution worker — deterministic plus review queue**

   Canonicalizes PMID/PMCID/DOI/preprint versions and maps each record to zero or more peptides. It rejects false alias hits before any writing.

3. **Evidence verifier — claim packet generation**

   Extracts study design, population, intervention, comparator, endpoint, timepoint, result, sample size, trial ID, and publication status. It attaches a source locator and confidence. No dossier prose is written here.

4. **Human evidence adjudication — before writing**

   Required for new quantitative efficacy/safety claims, regulatory changes, score changes, unpublished results, and ambiguous entity matches.

5. **Dossier writer**

   Receives only accepted claim packets. It may contextualize them but may not change values, publication status, or evidence grade.

6. **Independent release reviewer**

   Reviews the diff against accepted packets. It can directly fix formatting, schema, links, and wording that does not alter meaning. Semantic defects return as claim-level findings such as `WRONG_ENTITY`, `UNSUPPORTED_NUMBER`, or `STATUS_OVERCLAIM`, not a generic `needs_work`.

7. **Escalation**

   One semantic bounce is permitted. A second disagreement goes to the human owner/reviewer.

## 3. What is missing entirely

The plan lacks all of the following:

- A versioned schema for `findings/<slug>.json`.
- A claim-level provenance model.
- A canonical PMID–PMCID–DOI–preprint–NCT crosswalk.
- Per-source cursors and overlap windows.
- Raw-response snapshots or content hashes.
- Query versions and alias-registry versions.
- A central rate limiter shared across agents.
- Retry rules for 429, 500, timeouts, and malformed responses.
- Checkpointing and a resumable run manifest.
- Atomic writes.
- A nonzero exit policy for partial failure.
- A distinction between “verified,” “not checked,” “unavailable,” and “failed.”
- A golden adversarial test set containing the known HIV, lactoferrin, ophthalmology, and copied-title failures.
- A regression test for `NCT04777396` being mislabeled as FLOW.
- Full-text access rules for quantitative verification.
- A policy for paywalled papers whose abstract omits the claimed endpoint.
- Correction and expression-of-concern monitoring, not just retractions.
- Preprint-to-publication replacement logic.
- Trial protocol versus result-publication classification.
- Registry-results versus peer-reviewed-results classification.
- Regulatory jurisdiction and effective-date modeling.
- A rule preventing investor releases, aggregators, legal blogs, or news sites from becoming final claim sources.
- Prompt-injection and untrusted-source handling.
- Human-review capacity and turnaround estimates.
- A rollback plan.
- A staging or canary strategy.
- A precise definition of `lastUpdated`, `lastVerified`, `lastScored`, and `trialsLastSynced`.
- A policy for no-change reviews. A dossier should not receive a content `lastUpdated` bump merely because it was searched.
- A scoring-change audit trail. `qa-scoring.mjs` checks arithmetic, not whether the component scores or labels are justified.
- Coverage of blog and source-pack citations in the build gate.
- Coverage of PMC IDs. `qa-pmids.mjs` accepts `PMC...` as a citation value but never resolves it.
- URL verification. Arbitrary HTTP URLs are accepted as citation values but are not checked for identity, status, or content.
- A ban on uncited new prose. The current schema permits claims in summaries, FAQs, timelines, interactions, conditions, and MDX body without exact claim-level citations.

## 4. Fabrication hardening must be mechanical

The current schema cannot support reliable claim verification. New or changed factual claims should have a sidecar record such as:

```json
{
  "claimId": "semaglutide.step1.weight-loss.68w",
  "dossier": "semaglutide",
  "claimText": "Mean weight loss was 14.9% at 68 weeks.",
  "citationId": "PMID:33567185",
  "trialId": "NCT03548935",
  "entity": "semaglutide",
  "publicationStatus": "peer-reviewed",
  "metrics": [
    {
      "value": 14.9,
      "unit": "percent",
      "endpoint": "body-weight change",
      "timepoint": "68 weeks",
      "arm": "semaglutide"
    }
  ],
  "sourceLocator": {
    "source": "pubmed-abstract",
    "path": "abstract/results",
    "responseHash": "sha256:..."
  }
}
```

### Required checks

| Failure class | Mechanical check | Data source | False-positive risk | Enforcement |
|---|---|---|---|---|
| Citation is about a different drug | `qa-entity-support.mjs`: construct a curated alias/code registry per dossier. For NCTs, require the tracked entity in CT.gov `interventions[].name` or a reviewed combination mapping. For publications, compare the entity against title, abstract, MeSH, substances, registry IDs, and linked NCT interventions. | CT.gov v2 record; PubMed EFetch XML; Europe PMC core metadata/full text; curated alias registry. | Class-level mechanism papers, comparator arms, metabolites, combination products, and papers using only a development code. | Exact NCT intervention mismatch: build-breaking. Strong contradictory publication match: build-breaking. Missing/ambiguous entity evidence: review queue. |
| Quantitative claim not present | `qa-claim-numerics.mjs`: require structured value, unit, endpoint, timepoint, arm, sample size, and phase. Search the cited abstract, PMC/Europe PMC JATS, CT.gov results paths, or stored licensed evidence excerpt. Verify all dimensions together, not just the number token. | PubMed EFetch abstract; PMC/Europe PMC full-text XML; CT.gov `resultsSection`; official label tables where applicable. | Rounding, adjusted versus unadjusted results, subgroup values, percentage points versus relative percent, table-only results, split sample sizes. | For new/edited claims: missing locator or contradictory values are build-breaking. Paywalled/unavailable support blocks publication and enters human review; it must not pass on trust. |
| Invented trial name | `qa-trial-names.mjs`: require every trial label in new content to be represented as a structured `trialRef` tied to an NCT. Compare the displayed label/acronym against CT.gov `briefTitle`, `officialTitle`, `acronym`, and documented secondary IDs. Prefer rendering canonical names from cached CT.gov data. | CT.gov identification module and record history; publication registry identifiers. | Sponsor branding can differ from registry titles; acronyms can be added after first registration. | Unmapped or conflicting trial name: build-breaking. A manually approved display alias needs explicit provenance and reviewer identity. |
| Unpublished result presented as published fact | `qa-publication-status.mjs`: assign every result one status: `peer-reviewed`, `preprint`, `registry-results`, `conference`, `press-release`, or `protocol-only`. Crosswalk NCT publications, PubMed registry IDs, DOI metadata, Europe PMC source type, and CT.gov results posting. Enforce status-specific rendering templates and qualifiers. | CT.gov results/publications; PubMed; Crossref; Europe PMC; sponsor release only as the release record. | PubMed indexing delays, online-ahead-of-print records, accepted manuscripts, secondary analyses. | Status/wording mismatch is build-breaking. Ambiguous early-online status goes to review. Press releases and registry results may be described only with explicit unpublished/registry language. |

### The existing gates also need repair

- Replace live, fail-open build resolution with a two-tier design:

  1. A scheduled fetch job updates a checked or artifacted metadata cache and fails if coverage is incomplete.
  2. CI validates all citations against that complete cache deterministically.

- Record resolver coverage:

```json
{
  "expected": 741,
  "resolved": 741,
  "failed": 0,
  "skipped": 0,
  "sourceTimestamp": "..."
}
```

A build must fail if `skipped > 0`; “API unavailable” cannot be equivalent to “verified.”

- Expand citation extraction to:

  - `src/content/peptides`
  - `src/content/blog`
  - `data/source-packs`
  - guides, safety pages, and protocols if Workstream A can affect them

- Normalize DOI case and punctuation.
- Resolve PMC IDs.
- Validate publication type and correction/retraction status.
- Add “changed-claims-only” enforcement so legacy debt can remain in a review queue while no new unsupported claims enter.

## 5. Realism: the proposed sweep blows up

The bottleneck is not HTTP throughput. It is evidence adjudication and human review.

At `CHUNK=3`, 102 dossiers require 34 waves. Even an implausibly low 45 minutes for research, writing, and review per dossier gives approximately 25.5 hours of ideal wall-clock execution with three dossiers processed in parallel. At 60–120 minutes per dossier, it becomes 34–68 ideal hours before retries, API outages, merge conflicts, full-text retrieval, blog drafting, or human review.

A human spending only ten minutes per dossier adds 17 hours. Genuine claim-level review will be much higher. Ten changed claims per dossier at five minutes each is 85 human hours. Quantitative or regulatory claims regularly require more than five minutes.

The plan has no token budget, API-call budget, candidate cap, or review-hour budget. “Everything published since each dossier’s `lastUpdated`” is unbounded for broad compounds such as semaglutide and for ambiguous names.

### What should be cut

For the first run:

- Do not refresh all 102 dossiers semantically.
- Do not change scoring automatically.
- Do not add new molecules.
- Do not draft multiple blog posts from raw discovery output.
- Do not ingest BioPharma Dive, peptide-db, legal blogs, or investor relations into publishable claims. They can generate discovery leads only.
- Do not automate compounding/regulatory classification until jurisdiction and source contracts exist.
- Do not add every newly matched CT.gov record. Update existing canonical trials first; new trial associations require entity verification.

A realistic first release is:

1. Repair the integrity infrastructure and regression-test known failures.
2. Reconcile the source-pack schema and writer.
3. Correct the known trial-title/NCT contamination.
4. Refresh volatile fields for already accepted trials in the 30 existing packs.
5. Select 15–25 dossiers using risk and value:

   - FDA-approved or clinically used compounds.
   - High traffic.
   - High source density.
   - Material regulatory activity.
   - Known historical integrity problems.
   - Oldest genuinely reviewed content.

6. Publish one human-approved weekly “What Changed” digest based only on accepted change events.

The current freshness count makes prioritization more urgent, not bulk automation safer: the checkout now appears to have 86 January-dated dossiers. The correct response is a risk-ranked queue, not a one-week corpus rewrite.

## 6. Alternative execution architecture

### Phase 0 — freeze and define

- Create one immutable run ID, for example `refresh-2026-08`.
- Record the starting commit SHA, alias-registry version, query version, schema version, and source cursors.
- Define “changed claim,” “verified,” and “no change.”
- Assign exclusive file ownership. One worktree/branch per batch; no shared MDX edits.
- Keep content `lastUpdated` separate from evidence `lastVerified`.

### Phase 1 — harden before discovery

Implement and regression-test:

- `qa-entity-support.mjs`
- `qa-claim-numerics.mjs`
- `qa-trial-names.mjs`
- `qa-publication-status.mjs`
- complete citation-surface extraction
- fail-closed verification coverage
- source-pack schema reconciliation
- atomic JSON writes
- nonzero partial-failure exits

The golden fixture set must include the historical wrong-drug NCTs and the current `NCT04777396`/FLOW mismatch.

### Phase 2 — source-centric ingestion

Run one coordinated client per source, not one autonomous researcher per dossier.

Suggested conservative client limits:

- NCBI: global 2 requests/second without a key; batch metadata requests; use a 14–30 day overlap.
- Crossref: polite pool, begin below 5 requests/second, inspect current rate headers, and honor 429/`Retry-After`.
- openFDA: use an API key; cap well below 240/minute; record daily usage.
- CT.gov: one request at a time, page through all results, check `dataTimestamp`, and use a deterministic sort.
- Europe PMC: `cursorMark` pagination and persisted cursors.

Each response is written as a raw immutable record with:

- source
- request parameters
- request hash
- fetched timestamp
- source update timestamp
- HTTP status
- retry count
- response hash
- next-page cursor

Checkpoint after every successful page, not after every dossier.

### Phase 3 — canonicalization and deduplication

Create canonical evidence records:

- Publication identity: PMID, PMCID, DOI, Europe PMC ID, preprint ID.
- Trial identity: NCT plus source-record version.
- Event identity: trial registration, results posting, publication, approval, label change, correction, retraction.

Relationships should be many-to-many:

```text
evidence record ↔ trial ↔ peptide ↔ claim
```

A CagriSema trial can map to cagrilintide and semaglutide without being copied into two unrelated evidence records. A preprint and its journal article should be linked as versions, not counted as two independent studies.

### Phase 4 — verify before writing

Generate claim packets only after:

1. Entity match passes.
2. Study type is classified.
3. Publication status is established.
4. Metrics are grounded to source locations.
5. Trial names are canonical.
6. Conflicts and duplicates are identified.

Risk tiers:

- **Tier 0:** volatile registry metadata for an already accepted trial.
- **Tier 1:** non-quantitative descriptive update from a primary source.
- **Tier 2:** quantitative efficacy/safety, score change, or new trial association.
- **Tier 3:** regulatory status, unpublished result, withdrawal, or claim removal.

### Phase 5 — human review point one

Before prose generation:

- Tier 0 can proceed mechanically if the NCT association was previously approved.
- Tier 1 receives sampled human review.
- Tier 2 and Tier 3 require explicit human acceptance of the claim packet.
- Regulatory changes require the official regulatory source, jurisdiction, effective date, and reviewer approval.
- Any paywalled quantitative claim remains blocked until a human can inspect the relevant source.

This is where fabricated claims should die—not after they have been written into polished MDX.

### Phase 6 — dossier writing

Process accepted claim packets in batches of no more than five dossiers per PR.

Writer constraints:

- May not introduce citations absent from accepted packets.
- May not alter numerical fields.
- May not promote evidence grade or publication status.
- Must preserve claim IDs in a sidecar manifest.
- Must not bump `lastUpdated` for a no-change verification.
- Must produce a per-claim diff report: added, softened, removed, unchanged.

### Phase 7 — deterministic gates

Per batch:

1. Validate claim-packet schema.
2. Validate source-pack schema.
3. Validate entity support.
4. Validate metrics.
5. Validate trial names.
6. Validate publication status and wording.
7. Validate citation resolution from the complete cache.
8. Validate retractions/corrections.
9. Run cross-links, SEO, scoring math, banned-content checks, and Astro schema/build.
10. Fail if any verification step reports skipped or incomplete coverage.

### Phase 8 — human review point two

The human reviews:

- The accepted claim packet.
- The exact prose diff.
- Any removed or softened claim.
- Any regulatory or scoring change.
- Any unpublished/preprint wording.
- The generated changelog entry.

The reviewer is not asked to rediscover evidence from scratch. They verify that the prose accurately represents already adjudicated evidence.

### Phase 9 — merge and resume

The run manifest should track:

```text
discovered → normalized → entity_matched → evidence_verified
→ human_accepted → drafted → gated → human_approved → merged
```

A rerun resumes from the last durable state. It never overwrites earlier raw evidence. Merge only small, independently reversible PRs.

### Phase 10 — blog

Generate the blog only from merged evidence events. Start weekly.

A blog item must reference the same accepted claim packet as the dossier update. It must not independently reinterpret raw APIs or sponsor releases. If there are fewer than three material accepted events, publish nothing.

## Bottom line

The plan’s most dangerous assumption is that a resolved identifier plus a final independent review is enough. The repository already proves otherwise. `NCT04777396` resolves, its live registry data were fetched, and the false “FLOW” title survived because the refresh process preserved curated text. That is not an edge case; it is the exact failure class Workstream A will multiply.

Do not run the 102-dossier sweep. Build a source-centric ingestion layer, claim-level evidence packets, pre-write human adjudication, and fail-closed mechanical gates first. Then refresh a risk-ranked subset in small, resumable PRs.
