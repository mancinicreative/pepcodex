# Regulatory/reference source records and safe repair review

September 5, 2026. These changes validate a representation and protect records from unsafe automated repair. They do not certify a document's authority, recency, or the claims in any source pack.

## Representation

`source-pack.schema.json` keeps the previous research-source definition unchanged and adds disjoint `regulatory` and `reference` variants. A regulatory record requires a stable local `REG:` identifier, title, authority, jurisdiction, official HTTPS URL, retrieval timestamp, specific support locator, document ID/version, document type, scope note, product, route and indication. Reference records use `REF:` and do not require product/route/indication.

Unknown document IDs, versions, jurisdiction or product-specific fields use an explicit object such as `{ "status": "unknown", "reason": "No version is displayed by the authority." }`. Publication/effective dates may be absent or explicitly unknown. A retrieval timestamp records the actual lookup, not the publication or effective date. Documents do not accept invented PMID/DOI fields or human-study/sample-size fields.

The historical FDA fixture is in `scripts/source-pack-documents.test.mjs`: [March 8, 2024 Wegovy cardiovascular indication announcement](https://www.fda.gov/news-events/press-announcements/fda-approves-first-treatment-reduce-risk-serious-heart-problems-specifically-adults-obesity-or), fetched September 5, 2026. The fixture supports the historical announcement and its first-paragraph indication scope. It is explicitly **not** the latest label. No current prescribing recommendations are inferred from that archived announcement.

`validateSourcePackData()` returns `verification: NOT_ASSESSED` and computed source counts. Regulatory/reference records are excluded from human/preclinical counts. A pack containing documents is rejected when declared human/preclinical counts disagree with explicitly classified research records. A syntactically valid `officialUrl` is not proof of an official host; authority, document identity, actual source support and current status require separate review.

## Consumer changes

| Consumer | New behavior |
| --- | --- |
| `verify-pack-sources.mjs` | Recognizes PMID-form `id` as well as legacy `pmid`. Regulatory/reference documents become `DOCUMENT_REVIEW`; other records without a PubMed identifier become `EXTERNAL_SOURCE_REVIEW`. Missing summaries become `UNVERIFIED` and incomplete retrieval exits nonzero. Neither lookup failure nor title similarity verifies a claim. |
| `resolve-pack-sources.mjs` | Checks the current pack so even stale `NO_PMID` audit rows cannot route documents into PubMed matching. Every fuzzy candidate requires `REVIEW`; absence is `UNRESOLVED`. The bounded 600-ID search records requested limit, result count, returned/summarized IDs, query translation and warnings. Truncation, missing batches and HTTP errors produce `PARTIAL` with nonzero exit in the coverage manifest. Alias/PubMed coverage never establishes nonexistence. |
| `apply-source-repairs.mjs` | No automatic deletion, PHANTOM deletion, fuzzy attachment, or blanket `verifiedAt` stamp remains. Documents stay preserved for authority review. Stale or missing source fingerprints require rerunning verification. Reviewed metadata edits require the exact current fingerprint and an explicit independent-review record. |

All three tools still operate on `sources[]`, not every legacy `coreLibrary` structure. The corpus inventory below makes that limitation explicit. Existing reports without fingerprints are stale inputs for mutation. Nothing in this migration makes older audit files safe to apply unchanged.

## Metadata-review contract

A proposed metadata edit can be accepted only when the verification row has a current `sourceFingerprint` and an explicit `review` object:

```json
{
  "decision": "APPROVE_METADATA_REPAIR",
  "reviewer": "Named independent reviewer",
  "sourceFingerprint": "Exact current SHA256 produced by the shared helper",
  "proposedRepairFingerprint": "Exact approved payload hash from repairPayloadFingerprint",
  "authorityUrl": "https://pubmed.ncbi.nlm.nih.gov/THE_INDEPENDENTLY_CHECKED_ID/",
  "supportLocator": "Exact identifier/title metadata reviewed"
}
```

The example above is a contract, not an executable approval or real source. The reviewer must inspect and bind the exact target using `repairPayloadFingerprint(verification, resolution)`. A later change to proposed DOI, title, year, authors, journal or attached match invalidates that approval even when the current pack has not changed. Attaching a PMID additionally requires `review.confirmedPmid` to equal the independently checked candidate. A fuzzy score is never approval. Review the paper identity, peptide/population, publication and metadata before writing an approval. Scientific effect sizes, safety claims, evidence grades and current regulatory status remain separate claim-review work.

`--apply` only writes packs with an approved, fingerprint-matched metadata correction. DOI-form `id` and `doi` are updated together when a reviewed DOI changes, including FIX_META and ATTACH. It preserves all unresolved records and emits `source-repair-plan.json`; review-required output exits 1. Ordinary dry runs write an audit plan, not source packs. New metadata-review provenance says claim support was not assessed. It does not certify the source as factual research input.

## Existing corpus baseline: preserve and report

The unchanged schema was run against all 46 source packs before migration. Only `oveporexton.json` passed; 45 were already invalid. There were 54 `sources[]` records: 29 explicitly pubmed and 25 with no type. Many other packs store legacy `coreLibrary` structures and lack schema-required `sources`, object-form `peptide` or `metadata`.

The 45 pre-existing invalid files are: 5-amino-1mq, aod-9604, bpc-157, bt5528, cagrilintide, cerebrolysin, cjc-1295, ct-388, dsip, ecnoglutide, epithalon, follistatin, ghk-cu, ghrp-6, glutathione, hcg, hmg, ipamorelin, kisspeptin, kpv, liraglutide, ll-37, maritide, mazdutide, melanotan-ii, mk-0616, mrna-4157, orforglipron, pemvidutide, pf-08653944, pt-141, retatrutide, rusfertide, selank, semaglutide, semax, sermorelin, slu-pp-332, ss-31, survodutide, tb-500, tesamorelin, thymosin-alpha-1, tirzepatide, zelenectide-pevedotin (all `.json`).

Specific modern-format pre-existing failures include incomplete completion dates in ecnoglutide/pemvidutide, an unsupported trial status in rusfertide, category/author formats in selank/semax, and authors/trial status in survodutide. These are reported, not silently coerced into fabricated dates or forced mass migration. No real source-pack files were changed by this implementation.

## Verification

Run `node --test scripts/source-pack-documents.test.mjs`. Fixtures cover historical regulatory/reference records without research IDs, explicit unknowns, malformed source types/dates/metadata, human-study count exclusion, preservation of the previous research contract and valid oveporexton pack, fuzzy/absence outcomes, stale-fingerprint repair rejection, a narrowly reviewed metadata decision, real consumer CLI preservation of a document mislabeled NO_PMID/PHANTOM, truncated search, and missing PubMed summaries. Network responses in consumer tests are mocked and only temporary fake packs are writable.

An independent content review and a planned, lossless legacy-format migration remain necessary. Passing this suite is not a full-site or full-corpus factual certification.
