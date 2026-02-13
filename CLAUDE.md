# PepCodex Project Guidelines

## Critical: Evidence-Based Sourcing

**ALL content on this website MUST be backed by accurate, verifiable sources.**

### Sourcing Requirements

1. **Only cite real sources** - Every citation must be a real, verifiable publication with:
   - Valid PubMed ID (PMID) or DOI
   - Real journal/trial registry entry
   - Actual publication date

2. **Use approved source tiers** - Refer to `data/RESEARCH-SOURCES.md` for:
   - 105 approved journals (Tier 1-6)
   - Key clinical trial programs (STEP, SELECT, SURMOUNT, etc.)
   - Essential databases (PubMed, ClinicalTrials.gov, etc.)
   - Key researchers to follow

   **IMPORTANT**: The 300+ resources in `data/RESEARCH-SOURCES.md` serve as a PRIMARY REFERENCE POINT for quality sourcing. You CAN cite sources outside this list, but they MUST meet the same quality standards:
   - Peer-reviewed journals with impact factor
   - Established clinical trial registries
   - Regulatory agency publications (FDA, EMA, etc.)
   - Recognized research institutions

3. **Citation format** - Blog and dossier sources must include:
   ```yaml
   sources:
     - id: "pmid-12345678"
       title: "Actual Paper Title"
       url: "https://pubmed.ncbi.nlm.nih.gov/12345678/"
       type: "journal"
   ```

4. **Sources are NOT limited to PubMed** - We have 300+ approved sources in `data/RESEARCH-SOURCES.md`:
   - **105 approved journals** (Tier 1-6 by impact factor)
   - **PubMed/PMC** - Primary for peer-reviewed research
   - **ClinicalTrials.gov** - For trial registrations and results
   - **FDA/EMA** - Regulatory documents, approval letters, labels
   - **Key clinical trial programs** - STEP, SELECT, SURMOUNT, SURPASS, etc.
   - **Manufacturer press releases** - For breaking trial results (cite cautiously)
   - **Medical news outlets** - STAT News, Endpoints News, etc. for context
   - **Conference abstracts** - ADA, EASD, ObesityWeek presentations
   - **Key researchers** - Named experts to follow for updates

   **Always check `data/RESEARCH-SOURCES.md` first** - it's our master reference for quality sourcing.

5. **Never fabricate** - If a source doesn't exist, don't cite it. Verify before citing.

6. **Expanding beyond the list** - Outside sources are welcome if they provide valuable insights:
   - Interesting takes from credible researchers, journalists, or institutions are fine
   - Vet for quality: Is the author credible? Is the outlet reputable? Is the claim verifiable?
   - Include proper link (PMID/DOI preferred, but direct URLs to quality sources work too)
   - Note the source type (journal, trial, regulatory, news, opinion, preprint)

### Quality Control

- Every blog post needs 2-4 real citations minimum
- Peptide dossiers need comprehensive sourcing (10+ citations typical)
- All claims must trace back to cited sources
- No placeholder or generic source titles

### Why This Matters

PepCodex positions itself as evidence-based. Our credibility depends on:
- Readers being able to verify any claim
- Citations leading to real research
- Maintaining scientific integrity

**DO NOT COMPROMISE ON THIS.**

---

## Content Standards

### Banned Content
- Dosing protocols
- Sourcing/purchasing guidance
- Medical advice
- Unverified health claims

### Required Elements
- Evidence grading (known/suggestive/early/unknown)
- Clear disclaimers
- Proper citations for all factual claims

---

## File Locations

- Research sources guide: `data/RESEARCH-SOURCES.md`
- Content guidelines: `.planning/CONTENT-GUIDELINES.md`
- State tracking: `.planning/STATE.md`
- Source pack schema: `data/schemas/source-pack.schema.json`

---

*Workflow orchestration, task management, and core principles are loaded from `.claude/rules/` automatically.*

*Last updated: 2026-02-09*
