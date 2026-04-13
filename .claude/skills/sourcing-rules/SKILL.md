---
name: sourcing-rules
description: Evidence-based sourcing rules for PepCodex content. Use when writing/editing any blog post, peptide dossier, or making factual claims that require citations. Defines approved source tiers, citation format, and quality control thresholds.
---

# Evidence-Based Sourcing — PepCodex

**ALL content MUST be backed by accurate, verifiable sources. Never fabricate.**

## Sourcing Requirements

1. **Only cite real sources** — every citation must have:
   - Valid PubMed ID (PMID) or DOI
   - Real journal/trial registry entry
   - Actual publication date

2. **Approved source tiers** — see `data/RESEARCH-SOURCES.md` (300+ resources):
   - 105 journals (Tier 1-6 by impact factor)
   - PubMed/PMC, ClinicalTrials.gov, FDA/EMA
   - Clinical trial programs (STEP, SELECT, SURMOUNT, SURPASS)
   - Manufacturer press releases (cite cautiously)
   - Medical news (STAT News, Endpoints News) for context
   - Conference abstracts (ADA, EASD, ObesityWeek)

   Outside sources OK if: peer-reviewed w/ impact factor, established trial registry, regulatory agency, recognized research institution.

3. **Citation format**:
   ```yaml
   sources:
     - id: "pmid-12345678"
       title: "Actual Paper Title"
       url: "https://pubmed.ncbi.nlm.nih.gov/12345678/"
       type: "journal"  # journal | trial | regulatory | news | opinion | preprint
   ```

## Quality Thresholds

- Blog posts: **2–4 real citations minimum**
- Peptide dossiers: **10+ citations typical**
- All claims must trace back to cited sources
- No placeholder or generic source titles

## Banned Content

- Dosing protocols
- Sourcing/purchasing guidance
- Medical advice
- Unverified health claims

## Required Elements

- Evidence grading: `high` / `moderate` / `low` / `very-low`
- Clear disclaimers
- Proper citations for all factual claims

## Reference Files

- `data/RESEARCH-SOURCES.md` — master source list
- `data/schemas/source-pack.schema.json` — citation schema
