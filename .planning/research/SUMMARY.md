# Research Summary: Peptide Library

**Domain:** Evidence-based peptide education content site
**Researched:** 2026-01-19
**Confidence:** HIGH

## Executive Summary

Building an authoritative peptide research resource requires three core pillars: (1) citation integrity - every claim traceable to PubMed/DOI/NCT sources, (2) safety gates - hard blocks on dosing, protocols, and sourcing content, and (3) evidence grading - clear labels for study quality (human trials vs animal vs in-vitro).

The recommended stack is Astro for static generation (fastest builds, content-focused), Turso for trial tracker data, and n8n for content pipeline automation. Beehiiv handles newsletter, Pagefind handles search, Vercel handles deployment.

## Key Findings

### Stack (HIGH confidence)

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Framework | Astro 4 | Content-focused SSG, fastest builds, Content Collections perfect for programmatic generation |
| Styling | Tailwind CSS | Rapid development, consistent design system |
| Content | MDX | Components in markdown, ideal for citations/badges |
| Database | Turso | Edge-ready SQLite for trial tracker |
| Search | Pagefind | Static search, free, fast |
| Newsletter | Beehiiv | Simple API, good deliverability |
| Pipeline | n8n | Visual workflows, native API integrations |
| Deploy | Vercel | User preference, excellent DX |

### Content Model (HIGH confidence)

**12-Section Dossier Structure:**
1. Overview (what it is, aliases)
2. Mechanism of Action
3. Research Summary (human + preclinical counts)
4. Key Human Trials
5. Preclinical Evidence
6. Safety Profile
7. Pharmacokinetics
8. Regulatory Status
9. Related Peptides
10. Current Research Directions
11. Citation Table
12. Methodology Note

**Evidence Grading:**
- HIGH: Multiple RCTs, meta-analyses
- MODERATE: Limited RCTs, large observational
- LOW: Case series, small studies
- VERY LOW: Preclinical only, theoretical

### Safety Gates (CRITICAL)

**Banned Content Patterns:**
```
/\b(inject|dose|dosing|dosage|protocol|cycle|stack)\b/i
/\b(buy|purchase|source|vendor|supplier)\b/i
/\b(how to (use|take|administer))\b/i
/\d+\s*(mg|mcg|iu|units?)\s*(per|daily|weekly)/i
```

**Overclaim Patterns (flag for review):**
```
/\b(proven|guaranteed|cures?|definite(ly)?)\b/i
/\b(100%|always works|miracle)\b/i
```

### Pipeline Architecture (HIGH confidence)

**Workflow 1: Source Pack Builder**
- Input: Peptide name + aliases
- PubMed API → fetch metadata
- Europe PMC API → supplement OA flags
- ClinicalTrials.gov API → registered trials
- Output: JSON source pack

**Workflow 2: Draft Generator**
- Input: Source pack JSON
- Claude API with Prompt A template
- Output: MDX dossier draft

**Workflow 3: QA Gate**
- Citation validation (all PMIDs in source pack)
- Banned content scan
- Overclaim scan
- Evidence labeling check
- Output: Pass/Fail + issues

**Workflow 4: Publisher**
- Git commit MDX
- Update sitemap
- Trigger Vercel deploy

### Critical Pitfalls

1. **Citation Integrity**: Every [PMID:xxx] must exist in source pack - QA gate must verify
2. **Animal Study Labeling**: Preclinical results without clear "in mice" labels mislead readers
3. **Scope Creep to Protocols**: Users will ask for dosing - hard redirect to "consult healthcare provider"
4. **Source Quality**: PubMed alone misses important studies - supplement with Europe PMC and preprint servers

## Implications for Implementation

1. **Phase 1 priority**: Get build working, verify core site structure
2. **Phase 2 priority**: Complete 12-section template before pipeline
3. **Phase 3 priority**: QA gate is most critical workflow - must catch banned content
4. **Phase 4**: Search and trial tracker are polish, not blockers
5. **Phase 5**: Pipeline enables scale - 45 pages manually possible but painful

---
*Research complete: 2026-01-19*
