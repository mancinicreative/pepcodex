# Research surveillance contract (R06)

`npm run research:scan` reads local source references and the public PubMed / ClinicalTrials.gov APIs. It writes review worklists, never public content or evidence grades. Keep discovery and editorial support review separate.

## Commands

```sh
node scripts/monthly-research-scan.mjs --slug mazdutide --days 7 --known-limit 5
node scripts/monthly-research-scan.mjs --days 90
node --test scripts/tests/research-surveillance.test.mjs
```

`--end YYYY-MM-DD` must be a completed UTC day (default yesterday). `--days` explicitly overrides the window. Without it, each subject/source/alias/date-lane resumes its own successful watermark with fourteen days of overlap; first use covers 90 days. Dossier `lastUpdated` never controls surveillance. `--known-limit` defaults to 100 per subject/source, selecting never-checked and oldest-due IDs first; `--recheck-days` defaults to 30. `--out` provides an isolated artifact root, useful for bounded pilots. Do not run a whole-corpus scan concurrently with other NCBI jobs without coordinating the shared public API budget.

## Outputs and failure behavior

- Immutable runs: `.planning/research-scan/<UTC-run-date>/<timestamp-unique-id>/`. Each contains raw HTTP bodies/request metadata, inventory, per-subject JSON, summary and manifest.
- `.planning/research-scan/state-v2.json` stores per-query successful watermarks, source fingerprints, known-ID check dates, and emitted packet IDs. A subject advances only when every requested query and record batch succeeds. Successful other subjects may advance in a partially failed multi-subject run.
- `latest-attempt.json` always points to the latest completed attempt; `latest-successful.json` changes only when every attempted subject succeeds. **A successful single-subject run is not a whole-site baseline.** Always inspect manifest/inventory scope.
- The old `<date>/<slug>.json` and `<date>/SUMMARY.md` locations remain latest-attempt compatibility views. The run directory is authoritative and immutable; dated files may include subjects from different attempts. New consumers should use the manifest, not glob a date directory.
- `impact-queue/<stable-packet-id>.json` is a deduplicated correction/review queue. IDs include a per-record transition revision committed with successful state, so retries remain stable while a later A-to-B-to-A-to-B recurrence produces another review packet. Partial runs may expose findings but do not commit a new revision. New packets are completely written and synced before atomic publication; existing same-ID files must parse and match identity and material evidence. Corrupt or mismatched evidence fails closed before state or successful-pointer advancement. A packet is not approval to edit content; downstream review records its disposition separately.

Statuses: `SUCCESS_ZERO` (no newly queued material change for the declared scope), `SUCCESS_CHANGES`, `PARTIAL` (some usable source coverage and at least one failure), `FAILED` (no useful source coverage). Partial/failed runs exit 1, preserve that subject's prior state and never move the global successful pointer. Missing response IDs, malformed XML, non-OK HTTP, inconsistent counts, stalled pagination, or the PubMed 10,000 UID cap are failures, not zero findings. HTTP calls have 30-second deadlines, three bounded attempts for retryable errors, and at least 400 ms between starts. A lock rejects concurrent CLI runs; verify its PID before manually removing a stale lock.

Existing worklist arrays `newPapers`, `newTrials`, `updatedTrials` remain. `newPapers` means newly observed and not already cited anywhere in the site reference inventory, **not necessarily newly published**; a revised older record may be discovered now. Source dates, discovery lanes and exact queries remain separate. `correctedPapers`, `impactPackets`, `knownCoverage`, `queryCoverage`, `errors`, and `status` provide the missing reliability contract. Known trial baseline review is explicitly labeled, not called a proven change.

## What coverage does and does not mean

PubMed queries run one alias at a time in CRDT creation and LR completed-citation modification lanes. Both use a bounded date range; responses preserve query translation, warning/error lists and exact returned IDs. EFetch rechecks already-cited IDs regardless of discovery results. It parses article and book/chapter records, correction/retraction relationships and publication types. Book edition and chapter contribution dates stay separate; a DOI from a referenced paper cannot be assigned to the record. Missing abstracts are distinguished from missing records. A material change or existing citation alert becomes a review packet, even with no new PMID.

ClinicalTrials.gov queries paginate until no next token and reconcile unique NCT IDs with `totalCount`; known NCTs are also fetched directly. Full raw studies are retained. Material diffs include overall status/stopped reason, study dates, design/enrollment **count and estimated/actual type**, interventions, eligibility, outcomes, posted results and publication references. Administrative contact/location and last-update-date changes alone do not create a finding. Posted registry results are distinct from journal publications. Trial query candidates still require compound-identity review.

Primary names are searched as configured subject identities. Other alias candidates are quarantined until reviewed same-compound evidence exists in optional `data/research-alias-evidence.json`, keyed by subject slug. Each accepted item must contain `alias`, `status: validated`, `relationship: same-compound`, `sourceUrl`, `supportLocator`, `reviewedAt`, and `reviewer`. The existing trial-alias map contains parent compounds and combinations; it is not a synonym authority. Count imbalance raises a semantic review flag, not a wrong-identity verdict. No alias evidence is invented by this repair.

Known-ID rotation is seeded from each dossier and matching source pack; all content collections/source packs supply dependency locators and global cited/not-cited classification. IDs cited only on unrelated surfaces are not automatically added to every subject's rotating queue. The inventory and remaining due counts expose this boundary. Full-site claims require the separate R07 claim inventory, alias review and broader source surveillance; this scanner does not cover inaccessible full text, regulator updates, all journals, every registry or every alias.

## Primary API contracts checked 2026-09-05

- [PubMed User Guide](https://pubmed.ncbi.nlm.nih.gov/help/#create-date-crdt): CRDT is record creation; current guide documents LR as the most recent revision of a completed citation. Entry/publication dates are not a safe substitute for late-added records. The bounded live pilot returned different CRDT and LR sets, including revised older papers.
- [NCBI E-utilities parameters](https://www.ncbi.nlm.nih.gov/books/NBK25499/): search paging and PubMed UID retrieval limits. The implementation reports truncation and requires window partitioning rather than declaring a capped set complete.
- [ClinicalTrials.gov API](https://clinicaltrials.gov/data-api/api) and [study structure](https://clinicaltrials.gov/data-api/about-api/study-data-structure): live pilot JSON confirmed `studies`, `totalCount`, `protocolSection`, `enrollmentInfo.type`, and status date structures. Multi-page traversal is covered by a 45-record fixture; this small live pilot did not exercise a second page.
- The API documentation's linked `https://clinicaltrials.gov/api/oas/v2/ctg-oas-v2.yaml` returned HTTP 404 on this date. Do not claim that the YAML specification download succeeded. Keep the raw live contract observations and retest pagination against a larger bounded live cohort when needed.

## Validation

The Node fixture suite covers known-PMID corrections without new discoveries, overlap deduplication, late older publications, legitimate all-known unchanged windows, more than 40 trials, missing pages/repeated tokens, administrative-only edits, estimated versus actual enrollment, separate results/publications, 429/500, missing EFetch records, no-abstract records, truncated search/XML, cosmetic dossier edits, identity-evidence quarantine, book records, globally cited sources, rotating backlog, and actual CLI persistence/exit behavior under mocked HTTP. Tests are not an independent editorial or Kimi review.

The first bounded live pilots cover only **mazdutide** and **na-semax-amidate**, seven days ending 2026-09-04, with at most five due known IDs per source. Pilot artifacts are under `.planning/research-scan/r06-pilot/`; exact run results and coverage are summarized in `PILOT-REPORT.md` there. They do not certify the whole site.
## Registry narrative integrity and structured loop handoff

Trial summaries and impact packets now preserve `recordIntegrity` with source-field locators and
exact self-description excerpts. Narrow opening self-identification as a fictional study or example
record produces `QUARANTINED_SELF_DESCRIBED_EXAMPLE`; phrases in quoted or non-opening context
produce `CONTEXT_REVIEW_REQUIRED`. Ordinary words such as fictional, example, mock, simulation,
or synthetic do not independently classify a record. This is a review signal, not a comprehensive
fraud detector or a claim about current registry authenticity.

Every trial remains an unreviewed candidate. Flagged records use `HOLD_FOR_INTEGRITY_REVIEW` and
`TRIAL_RECORD_INTEGRITY_ALERT` (or `CITED_RECORD_INTEGRITY_ALERT` for already-cited records).
Removing a marker generates `TRIAL_INTEGRITY_REVALIDATION` and retains the hold in scanner state;
subsequent administrative or scientific changes cannot silently clear it. The scanner does not
automatically grant human review approval or write evidence counts/source packs. No new automatic
approval/reset mechanism is supplied here.

Description text and integrity signals are material. Existing state saved before this extension
has no narrative snapshot, so the first re-observation can produce a baseline comparison packet;
this must not be interpreted as proof that the registry narrative recently changed. Raw CLI
responses stay unchanged. `rawProvenance` links each trial packet to source URL, actual retrieval
time, response SHA-256, immutable-run-relative raw file, record locator, and NCT identifier.
Library callers lacking recorded HTTP provenance get explicit null, never invented provenance.
Trial totals in summaries remain candidate counts and include integrity-flagged candidates.

`hasResultsSignal` preserves the API's explicit boolean `hasResults`; `resultsPayloadAvailable`
separately describes whether a results-section object was returned. Compatibility field
`resultsPosted` uses the explicit signal, otherwise true when a payload exists, otherwise null
(unknown). A false signal alongside a payload is retained as `SIGNAL_PAYLOAD_CONFLICT`, not silently
reconciled. Signal-only changes are material. Posted results establish neither effectiveness nor
evidence quality, and a missing payload must not overwrite a true posting signal with false.

For machine consumers, invoke the CLI with both `--manifest-file <unique path>` and
`--request-id <unique 16-100 character safe ID>`. Existing paths fail closed. The CLI publishes the
invocation manifest atomically and exclusively after packet/subject persistence and before state
advancement. Consumers must also require subprocess completion with exit 0: a later state/pointer
error or interruption can leave a published but uncommitted handoff. An unavailable manifest
destination cannot consume the observation. Early failure can leave no manifest, which is an error.
Keep the stable scan root across invocations. Handoff version 1
extends schemaVersion 2 with request identity, declared scope, and hashes for inventory and subject
outputs. Original direct-CLI options/output and latest-attempt/latest-successful pointers remain.

Content-loop Layer 3 now consumes the exact manifest, checks invocation identity, hashes, inventory,
coverage/status consistency, and contained file paths, then dispatches unique packet IDs for review.
It never parses stdout or consumes a previous successful pointer as this attempt's result.
SUCCESS_ZERO records coverage without dispatch. Incomplete or failed subprocesses preserve real
partial packets as triage only, escalate discovery failure and return nonzero after saving the loop
report. Missing or invalid handoffs have unknown counts (null), not fabricated zero. Other loop
layers retain their existing behavior and were not redesigned in this change.

Fixtures: `node --test scripts/tests/research-surveillance.test.mjs scripts/tests/research-discovery-handoff.test.mjs`.
The latter runs the actual scanner CLI and actual content-loop entry point against mocked HTTP;
unrelated loop subprocesses are stubbed, so it does not claim live network or whole-loop validation.
