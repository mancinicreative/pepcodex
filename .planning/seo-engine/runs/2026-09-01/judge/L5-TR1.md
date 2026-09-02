# Judge L5 — W2-F-TR1 (trial packs)

*Adversarial, ≠ author ([TR1 implementer](5168d495-2fe4-4c19-a6f9-9c6a4edd38a2)). Bar: LOOPS.md L5.*

**Verdict: KEEP**

## Bar

- Named survodutide NCTs present: NCT07754461 (phase 3 T2D recruiting), NCT07768813 (phase 1, not yet recruiting, enrollment 44, **no results invented**).
- Oveporexton NCT06470828 completed Phase 3; pack has no “approved” language.
- `qa:trials`: touched packs 0 R_FAIL / 0 BOGUS.
- Adds were per-NCT CT.gov v2 fetch + drug-match, not unfiltered `refresh-trials` dump (orforglipron query had 17–32 extras — correctly `--max-add 0` then named adds).

## Net URL

New file `data/source-packs/oveporexton.json` is **not** a new public URL. `/trials` is a single index that concatenates packs. Dossier `/peptides/oveporexton` already existed. Delta 0.

## Residual (not FAIL)

- No `cagrisema.json` (correct — would double-count on `/trials`). CagriSema-matched NCTs landed on `cagrilintide.json`.
- Stretch rusfertide / pf-08653944 skipped.
- `qa:trials` rewrote `TRIAL-TRIAGE.md` as a side effect; pre-existing COMPARATOR packs were not “fixed” in this increment (correct).

## Fail checks that did not fire

Unfiltered PubMed/CT.gov dump; stem-matched SYNCHRONIZE family; invented results on Phase 1; new content URL.
