# Dossier Pipeline Process

*How new peptide dossiers are created and published*
*Created: 2026-01-27*

---

## Pipeline Overview

```
Peptide Queue → Source Pack → Draft Generation → QA Gate → Publishing → Distribution
```

**Tools Used:**
- n8n (workflow automation)
- Claude API (draft generation)
- Git/GitHub (version control)
- Vercel (hosting)
- Beehiiv (email)

---

## Stage 1: Source Pack Creation

**Trigger:** Add peptide name to queue (n8n workflow)

**Actions:**
1. Search PubMed for peptide name
2. Search Europe PMC for additional papers
3. Search ClinicalTrials.gov for active/completed trials
4. Search FDA for regulatory status
5. Compile results into JSON

**Output:** `source-packs/[peptide-name].json`

**Source Pack Schema:**
```json
{
  "peptide": "semaglutide",
  "created": "2026-01-27",
  "sources": [
    {
      "id": "pubmed-12345678",
      "type": "journal",
      "title": "Study title",
      "authors": ["Author 1", "Author 2"],
      "journal": "Journal Name",
      "year": 2024,
      "doi": "10.1000/example",
      "url": "https://pubmed.ncbi.nlm.nih.gov/12345678",
      "abstract": "Study abstract...",
      "study_type": "RCT",
      "sample_size": 1000,
      "key_findings": ["Finding 1", "Finding 2"]
    }
  ],
  "trials": [
    {
      "id": "NCT12345678",
      "title": "Trial title",
      "phase": "Phase 3",
      "status": "Completed",
      "sponsor": "Company Name",
      "conditions": ["Obesity", "Type 2 Diabetes"],
      "url": "https://clinicaltrials.gov/study/NCT12345678"
    }
  ],
  "regulatory": {
    "fda_status": "Approved",
    "approval_date": "2021-06-04",
    "brand_names": ["Ozempic", "Wegovy", "Rybelsus"],
    "approved_indications": ["Type 2 Diabetes", "Weight Management"]
  }
}
```

**Quality Checks:**
- Minimum 5 sources required
- At least 1 human study required (or flag as "animal-only")
- Clinical trial data if available
- Regulatory status confirmed

---

## Stage 2: Draft Generation

**Input:** Source pack JSON

**Processing:** Claude API generates 12-section dossier

**Prompt Structure:**
```
You are writing a peptide research dossier for PepCodex.

PEPTIDE: [name]
SOURCE PACK: [json]

Write a comprehensive dossier following this structure:

1. Quick Summary (2-3 sentences, evidence grade)
2. Mechanism of Action (how it works)
3. Research Summary (what studies show)
4. Clinical Trials (active and completed)
5. Regulatory Status (FDA, EMA)
6. Safety Profile (known side effects)
7. Evidence Quality (grade and rationale)
8. Current Research (ongoing studies)
9. Comparisons (vs similar peptides)
10. Key Citations (formatted list)
11. FAQ (common questions)
12. Last Updated (date)

RULES:
- Every claim must cite a source from the pack
- Mark animal studies clearly
- No dosing or protocol information
- No sourcing or vendor information
- Use evidence language (known/suggestive/early)
- Grade evidence honestly
```

**Output:** MDX draft with frontmatter

**Frontmatter Schema:**
```yaml
---
peptide: "semaglutide"
displayName: "Semaglutide"
aliases: ["Ozempic", "Wegovy", "Rybelsus"]
category: "metabolic"
evidenceGrade: "known"
lastUpdated: 2026-01-27
summary: "150-200 character summary"
relatedPeptides: ["tirzepatide", "liraglutide"]
sources:
  - id: "pubmed-12345678"
    title: "Study title"
    url: "https://..."
    type: "journal"
---
```

---

## Stage 3: QA Gate

**Automated Checks:**

### 3.1 Citation Validation
- Every factual claim maps to a source in frontmatter
- Source IDs are valid and consistent
- URLs are accessible

### 3.2 Banned Content Scan
Reject if contains:
- Dosing information ("take X mg", "inject X units")
- Protocol details ("cycle", "stack", "taper")
- Sourcing information (vendor names, "where to buy")
- Medical advice ("you should", "recommended for")

**Banned Patterns:**
```
/\d+\s*(mg|mcg|iu|units?)/i
/inject(ion)?s?\s*(daily|weekly|monthly)/i
/cycle|stack|taper|pct/i
/buy|source|vendor|supplier/i
/you should|recommended for|consult your/i
```

### 3.3 Overclaim Scanner
Flag for review if contains:
- "proven" (use "research suggests" instead)
- "guaranteed" (never use)
- "cures" (use "may help with" instead)
- "safe" without qualifier (use "no serious adverse events in trials")

### 3.4 Evidence Labeling
- Animal studies must be marked as such
- In-vitro studies must be marked as such
- Human trial sample sizes noted
- Study type (RCT, observational, case report) specified

**QA Output:**
```json
{
  "passed": true,
  "warnings": [],
  "errors": [],
  "score": 95
}
```

If score < 80 or any errors: Block publication, return for revision.

---

## Stage 4: Publishing

**Pre-Publish Checklist:**
- [ ] QA score ≥ 80
- [ ] No errors flagged
- [ ] Frontmatter complete
- [ ] All sources verified
- [ ] Evidence grade assigned
- [ ] Related peptides linked

**Publishing Process:**
```bash
# 1. Add dossier to content
git add src/content/peptides/[peptide].mdx

# 2. Commit with standard message
git commit -m "content: add [peptide] dossier

Sources: [count] papers, [count] trials
Evidence grade: [grade]"

# 3. Push to main
git push origin main

# 4. Vercel auto-deploys
# Wait ~2 minutes for deployment
```

**Post-Deploy Verification:**
1. Visit pepcodex.com/peptides/[peptide]
2. Confirm page loads correctly
3. Check all internal links work
4. Verify sitemap updated

---

## Stage 5: Distribution

**Immediately After Publishing:**

### 5.1 Email Announcement
Send via Beehiiv:
```
Subject: New: [Peptide] Research Dossier

Just published: our full research dossier on [peptide].

[One sentence on why it matters]

Read the full dossier: [link]

— PepCodex
```

### 5.2 Instagram Carousel
Create using INSTAGRAM-CAROUSELS.md template:
- "[Peptide]: What Research Shows"
- 8 slides summarizing key findings
- CTA to full dossier

### 5.3 Internal Linking
Update existing content:
- Add to related peptides' "See Also" sections
- Link from relevant category pages
- Add to comparison pages if applicable

### 5.4 Search Console
- Check indexing status after 24 hours
- Submit URL if not indexed

---

## Workflow Triggers

| Trigger | Action |
|---------|--------|
| Add to queue | Start source pack creation |
| Source pack complete | Start draft generation |
| Draft complete | Start QA gate |
| QA passed | Enable publishing |
| Published | Trigger distribution |

---

## Error Handling

### Source Pack Failures
- **No sources found:** Flag for manual research
- **API timeout:** Retry 3 times, then flag
- **Duplicate peptide:** Skip, notify

### Draft Generation Failures
- **API error:** Retry with exponential backoff
- **Output too short:** Regenerate with expanded prompt
- **Missing sections:** Return for completion

### QA Failures
- **Banned content:** Return for revision with specific flags
- **Low score:** Return with detailed feedback
- **Citation mismatch:** Return for source verification

### Publishing Failures
- **Git conflict:** Resolve manually
- **Deploy failure:** Check Vercel logs, retry
- **Page 404:** Verify file path, rebuild

---

## Monitoring

**Daily Checks:**
- New dossiers published
- QA failures logged
- Deploy status

**Weekly Metrics:**
- Dossiers in queue
- Average QA score
- Time from queue to publish

---

*Document the n8n workflow visually in separate file if needed*
