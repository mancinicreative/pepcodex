# Phase 3: Pipeline Infrastructure Summary

**Plans Completed:** 03-01, 03-02, 03-03
**Date:** 2026-01-19
**Duration:** ~30 minutes

## One-liner

Source pack JSON schema with validation, QA scripts for banned content/citations/evidence labels, unified orchestrator producing pass/fail reports.

## What Was Built

### 03-01: Source Pack Schema

**Files Created:**
- `data/schemas/source-pack.schema.json` - JSON Schema (draft-07) defining source pack structure
- `scripts/validate-source-pack.js` - Validates source packs against schema using ajv
- `data/source-packs/tirzepatide.json` - Sample source pack with 12 real citations

**Schema Structure:**
```json
{
  "peptide": { "name", "aliases", "category" },
  "sources": [{ "id", "type", "title", "authors", "journal", "year", "studyType", "subjects", "sampleSize", "openAccess", "url" }],
  "trials": [{ "nctId", "title", "status", "phase", "conditions", "interventions" }],
  "metadata": { "generatedAt", "sourceCounts" }
}
```

### 03-02: QA Validation Scripts

**Files Created:**
- `scripts/qa-banned-content.js` - Scans for dosing/protocol/sourcing language
- `scripts/qa-citations.js` - Validates citations against source pack
- `scripts/qa-evidence-labels.js` - Checks animal/in-vitro studies are labeled

**Banned Patterns Implemented:**
- Dosing terminology: inject, dose, dosing, protocol, cycle, stack
- Sourcing language: buy, purchase, vendor, supplier
- Specific doses: Xmg daily/weekly patterns
- Administration instructions: how to use/take/inject
- Injection routes: subcutaneous/intramuscular injection

**Overclaim Patterns (Warnings):**
- Certainty claims: proven, guaranteed, cures
- Extreme claims: 100%, always works, miracle
- Safety overclaims: safe for everyone, no side effects

### 03-03: QA Orchestrator

**Files Created:**
- `scripts/qa-validate.js` - Runs all QA scripts, produces unified report

**Features:**
- Combines all three QA validators
- Human-readable console output
- JSON output with `--json` flag
- Exit code 0 for pass, 1 for fail
- Error and warning counts

## Usage

```bash
# Validate source pack
node scripts/validate-source-pack.js data/source-packs/tirzepatide.json

# Run individual QA checks
node scripts/qa-banned-content.js src/content/peptides/tirzepatide.mdx
node scripts/qa-citations.js src/content/peptides/tirzepatide.mdx data/source-packs/tirzepatide.json
node scripts/qa-evidence-labels.js src/content/peptides/tirzepatide.mdx data/source-packs/tirzepatide.json

# Run full QA suite
node scripts/qa-validate.js src/content/peptides/tirzepatide.mdx data/source-packs/tirzepatide.json
node scripts/qa-validate.js src/content/peptides/tirzepatide.mdx data/source-packs/tirzepatide.json --json
```

## Sample Source Pack Data

The tirzepatide.json contains:
- **12 sources** (10 human studies, 2 preclinical)
- **4 clinical trials** (SYNERGY-NASH, SUMMIT, OSA study, T2D comparison)
- **Real PMIDs**: 30170872, 34170647, 35658024, 33882206, 34186022, etc.

## Test Results

```
============================================================
QA Report: src/content/peptides/tirzepatide.mdx
Source Pack: data/source-packs/tirzepatide.json
============================================================

[FAIL] Banned Content: 3 violations, 0 warnings
       - dosing-terminology: dose, Dose, dosing...
       - specific-doses: 5 mg once, 15 mg once
       - injection-routes: Subcutaneous inject
[PASS] Citations: 3 found, 0 missing
[PASS] Evidence Labels: 0 issues

Overall: FAILED
  Errors: 3
  Warnings: 0
```

**Note:** Current tirzepatide.mdx contains a Dosing section which is correctly flagged. Content will need cleaning to pass QA.

## Commits

| Hash | Message |
|------|---------|
| c0cf14e | feat(03-01): source pack schema and validation tooling |
| b99541f | feat(03-02): QA validation scripts for content pipeline |
| b34c664 | feat(03-03): QA orchestrator for unified validation |

## Dependencies Added

```json
{
  "devDependencies": {
    "ajv": "^8.x",
    "ajv-formats": "^3.x"
  }
}
```

## Decisions Made

1. **ajv for validation** - Standard JSON Schema validator, supports draft-07, good error messages
2. **Separate QA scripts** - Each can run standalone for debugging, combined in orchestrator
3. **JSON output flag** - Enables machine consumption by n8n workflows
4. **ESM modules** - Consistent with Astro project using `"type": "module"`

## What's Next

Phase 3 remaining plans:
- **03-04:** n8n Source Pack Builder workflow (PubMed, Europe PMC, ClinicalTrials.gov APIs)
- **03-05:** n8n Draft Generator and QA Gate workflows

These require n8n setup and can be handled separately from local script development.

## Deviations from Plan

None - plan executed exactly as written.
