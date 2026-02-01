# Peptide Dossier Format Checklist

Every peptide dossier must follow the BPC-157 template format exactly. Use this checklist to verify completeness.

---

## Required Frontmatter Fields

### Basic Info (Required)
- [ ] `name` - Full peptide name
- [ ] `aliases` - Array of alternative names `["alias1", "alias2"]`
- [ ] `category` - One of: `repair-recovery`, `metabolic`, `hormonal`, `immune`, `neurological`, `anti-aging`, `oncology`
- [ ] `evidenceStrength` - One of: `high`, `moderate`, `low`, `very-low`
- [ ] `lastUpdated` - Date in format `YYYY-MM-DD`
- [ ] `comparators` - Array of related peptide slugs for comparison
- [ ] `summary` - 1-2 sentence description of the peptide

### Sources (Required)
- [ ] `sources.count` - Total number of sources
- [ ] `sources.human` - Number of human studies
- [ ] `sources.preclinical` - Number of preclinical studies
- [ ] `sources.openAccess` - Number of open access papers

### SEO (Required)
- [ ] `metaTitle` - Format: "Peptide Name Evidence Dossier | PepCodex"
- [ ] `metaDescription` - Brief description for search engines

### Interactions (Required)
- [ ] `interactions` - Array of interaction objects:
  ```yaml
  - peptide: "slug-name"
    type: "synergistic" | "compatible" | "caution" | "avoid"
    description: "Explanation of interaction"
    source: "PMID" (optional)
  ```

### Molecular Info (Required)
- [ ] `molecularInfo.weight` - Molecular weight with units (e.g., "1,419.53 Da")
- [ ] `molecularInfo.chainLength` - Number of amino acids
- [ ] `molecularInfo.type` - Classification (e.g., "Pentadecapeptide")
- [ ] `molecularInfo.sequence` - Amino acid sequence
- [ ] `molecularInfo.aminoAcids` - Array of amino acid objects:
  ```yaml
  - { code: "G", name: "Glycine", position: 1, property: "polar" }
  ```
  - Valid properties: `polar`, `hydrophobic`, `positive`, `negative`, `modified`

### Evidence Chained Benefits (Required)
- [ ] `evidenceChainedBenefits` - Array (minimum 2-4 entries) with structure:
  ```yaml
  - mechanism:
      action: "Description of biological mechanism"
      confidence: "established" | "supported" | "emerging"
      directStudies: 5
    benefit:
      claim: "what it does (without subject)"
      qualifier: "shown to" | "appears to" | "may" | "suggested to"
    evidence:
      level: "high" | "moderate" | "low" | "very-low"
      humanStudies: 2
      animalStudies: 4
      cellStudies: 3
      keyFindings:
        - study: "Author et al. Year"
          type: "human-rct" | "human-observational" | "animal" | "in-vitro"
          finding: "Key finding description"
          pmid: "12345678"
  ```
  **IMPORTANT**: `keyFindings.type` must be one of: `human-rct`, `human-observational`, `animal`, `in-vitro`
  **DO NOT USE**: `review` (this will cause schema validation error)

### Conditions (Required)
- [ ] `conditions` - Array of condition objects:
  ```yaml
  - slug: "condition-slug"
    name: "Condition Name"
    researchSummary: "Multi-paragraph summary of research for this condition"
    relevantStudies: ["PMID1", "PMID2"]
    relatedPeptides: ["peptide-slug1", "peptide-slug2"]
  ```

### Timeline (Required)
- [ ] `timeline` - Array of period objects:
  ```yaml
  - period: "Week 1-2"
    effects: "Description of effects during this period based on research"
    source: "PMID:12345678"
  ```
  - Typically 4-5 periods covering different timeframes

### Quality Checklist (Required)
- [ ] `qualityChecklist.goodSigns` - Array of positive quality indicators
- [ ] `qualityChecklist.warningSigns` - Array of concerning but not disqualifying signs
- [ ] `qualityChecklist.badSigns` - Array of signs indicating poor quality/avoid

---

## MDX Content Structure (Required)

The MDX content after the frontmatter MUST follow this exact structure:

### 1. Mechanism of Action Header
```html
<h2 id="mechanism-of-action">Mechanism of Action</h2>
```

### 2. Intro Paragraph
Brief 1-2 sentence introduction to the mechanism.

### 3. "How It Works (Simplified)" Section
```markdown
### How It Works (Simplified)
```

### 4. Visual Cards Grid (4 cards)
Must use this exact structure with emerald/blue/violet/amber colors:
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-8">
  <div class="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl p-5 border border-emerald-500/20">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">1</div>
      <div class="font-semibold text-white">Title</div>
    </div>
    <p class="text-sm text-white/70">Description</p>
  </div>
  <!-- Card 2: blue-500 -->
  <!-- Card 3: violet-500 -->
  <!-- Card 4: amber-500 -->
</div>
```

### 5. Scientific Pathways Section
```markdown
### Scientific Pathways

**Pathway Name** *(Effect)*
```
pathway diagram in code block
```

**Key Research:** Citation with PMID link
```

### 6. Important Limitations Section
```markdown
### Important Limitations

- Limitation 1
- Limitation 2
- Limitation 3
```

### 7. NO Additional Sections
**DO NOT add any additional h2 sections after Important Limitations.**

The following sections are rendered automatically from frontmatter by DossierLayout:
- Evidence (from `evidenceChainedBenefits`)
- Timeline (from `timeline`)
- Quality Checklist (from `qualityChecklist`)
- Interactions (from `interactions`)
- References (from sources in frontmatter)

---

## Quick Validation Commands

Check for missing `molecularInfo`:
```bash
grep -L "molecularInfo:" src/content/peptides/*.mdx
```

Check for missing `evidenceChainedBenefits`:
```bash
grep -L "evidenceChainedBenefits:" src/content/peptides/*.mdx
```

Check for invalid keyFindings type "review":
```bash
grep -r "type: \"review\"" src/content/peptides/
```

---

## Common Errors to Avoid

1. **Schema validation error for keyFindings type**
   - Only use: `human-rct`, `human-observational`, `animal`, `in-vitro`
   - Never use: `review`

2. **Missing Evidence section in browser**
   - Caused by missing `evidenceChainedBenefits` frontmatter field

3. **Extra h2 sections after Important Limitations**
   - These cause duplicate content since DossierLayout renders sidebar sections from frontmatter

4. **Wrong visual card colors**
   - Must be in order: emerald (1), blue (2), violet (3), amber (4)
