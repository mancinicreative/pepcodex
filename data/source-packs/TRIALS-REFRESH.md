# Clinical Trials Refresh Workflow

Keep `data/source-packs/*.json` → `trials[]` current with **ClinicalTrials.gov**.
Powers the Clinical Trial Tracker (`/trials`) and each dossier's "What is being studied now".

> **Hard rule:** real data only. Every trial traces to a live ClinicalTrials.gov
> record (NCT id). The tool never invents NCT ids, statuses, phases, or dates — it
> only reads the public CT.gov v2 API.

## The tool — one command per peptide
`scripts/refresh-trials.mjs` fetches the public CT.gov v2 REST API, normalises it into
the site's trial shape, and merges into the pack:
- **UPDATES** volatile fields (status / phase / dates / conditions / enrollment) on
  trials already in the pack, **preserving curated `title` + `regions`**;
- **ADDS** genuinely new registered trials (by NCT id), newest first, capped by `--max-add`;
- stamps `trialsLastSynced`.

```
node scripts/refresh-trials.mjs <slug>                     # dry run (report only)
node scripts/refresh-trials.mjs <slug> --apply             # write the pack
node scripts/refresh-trials.mjs <slug> --phase 3,4 --apply # only Phase 3/4 (blockbusters)
node scripts/refresh-trials.mjs <slug> --query "x OR y"    # override the search terms
# flags: --max <n> fetch cap (default 300) · --max-add <n> new-trial cap (default 40)
```
The query defaults to the pack's `peptide` name + `aliases` joined with `OR`
(e.g. `retatrutide OR LY3437943`). CT.gov synonym-expands, so the code names resolve too.

## Candidate peptides
Only compounds with registered trials:
- any peptide whose `regulatoryStatus` is `approved` or `investigational`, **or**
- any peptide that already has a source pack with a non-empty `trials[]`.

Research-only bioregulators / lab compounds have no registry trials — skip them.

## Volume guard (blockbusters)
Approved blockbusters (semaglutide, tirzepatide, liraglutide, hCG…) have hundreds–thousands
of trials. Don't bulk-import them — the refresh still **updates every existing entry's
status**, and for new additions use `--phase 3,4` and a small `--max-add` (e.g. 10–15) to
keep the pack curated to headline trials. Mid-stage compounds (retatrutide, survodutide,
cagrilintide…) can sync in full.

## Per-peptide steps
1. **Dry-run**: `node scripts/refresh-trials.mjs <slug>` — review `updated` / `added`.
2. **Apply**: re-run with `--apply` (add `--phase`/`--max-add` for blockbusters).
3. **Relevance review (REQUIRED)** — CT.gov intervention search is *fuzzy*: it returns
   any trial where the term appears (as a comparator, a background drug, or via a
   look-alike code/abbreviation). After applying, eyeball the new titles+interventions:
   ```
   node -e 'const p=require("./data/source-packs/<slug>.json"); p.trials.forEach(t=>console.log(t.id,"|",(t.interventions||[]).join(","),"|",t.title))'
   ```
   Drop false positives. Observed traps:
   - short/ambiguous aliases — `TB4`→Symbicort *TBH*, `MT-2`→oncology codes, `Kiss`→a
     *kissing* study, `HMG`→HMG-CoA statins, `CAMP`→cyclic-AMP, `Lys-Pro-Val`→amino-acid studies;
   - **same-class confusion** — `sermorelin` pulls *tesamorelin*/generic-GHRH trials;
   - **common molecules** — `glutathione`, `hCG`, `hMG` return hundreds of trials where
     the compound is incidental (antioxidant background, IVF protocols, pregnancy tests).
   For these, prefer reverting to the curated pack (`git checkout -- <pack>`) over
   importing noise, or constrain hard with `--query "<specific term>"` + `--phase`.
4. **Build**: `npm run build` — `/trials` + the dossier trial sections pick up the change.

## Field mapping (CT.gov v2 → pack trial)
| CT.gov (protocolSection) | pack | notes |
|---|---|---|
| `identificationModule.nctId` | `id` | dedupe key |
| `identificationModule.briefTitle` | `title` | new trials only; existing keep curated titles |
| `statusModule.overallStatus` | `status` | `ACTIVE_NOT_RECRUITING`→`active`, `RECRUITING`→`recruiting`, `NOT_YET_RECRUITING`→`not yet recruiting`, `ENROLLING_BY_INVITATION`→`recruiting`, `COMPLETED`/`TERMINATED`/`WITHDRAWN`/`SUSPENDED` kept |
| `designModule.phases` | `phase` | `["PHASE3"]`→`"3"`, `["PHASE1","PHASE2"]`→`"1/2"`, none→`"N/A"` |
| `conditionsModule.conditions` | `conditions` | shown under the title in the ledger |
| `armsInterventionsModule.interventions[].name` | `interventions` | |
| `designModule.enrollmentInfo.count` | `enrollment` | |
| `statusModule.startDateStruct.date` | `startDate` | |
| `statusModule.primaryCompletionDateStruct.date` | `completionDate` | shown in the "Completion" column |

Only `INTERVENTIONAL` studies are fetched (`filter.advanced=AREA[StudyType]INTERVENTIONAL`).

## Optional: deeper look-ups
The **ClinicalTrials.gov MCP** (`search_trials`, `get_trial_details`) is handy for ad-hoc
exploration or pulling full eligibility/endpoint detail on a single NCT — but the script
above is the source of truth for refreshing packs.

## Cadence
Quarterly, or when a tracked compound hits a milestone (new phase, readout, approval).
`trialsLastSynced` on each pack records the last refresh.

## Verification
- `npm run build` green.
- Spot-check `/trials` counts and a couple of dossiers.
- Every `id` resolves at `clinicaltrials.gov/study/<NCT>` (no fabricated trials).
