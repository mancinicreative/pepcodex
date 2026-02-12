# Phase 29: Comparisons Batch 2 + Calculators - Research

**Researched:** 2026-02-12
**Domain:** Astro content collections, MDX generation, dynamic routing, SEO schema
**Confidence:** HIGH

## Summary

Phase 29 is the final phase of v4.0 Content Expansion. It involves two workstreams: (1) generating 180 new comparison pages to reach 280 total, and (2) converting 3 static calculator pages into dynamic routes serving 50 peptide-specific URLs each. Both workstreams are well-defined by existing patterns in the codebase.

The comparison generation is a proven pattern -- 100 comparisons already exist with a stable MDX frontmatter format, working ComparisonLayout, and FAQSchema integration. The challenge is scale (180 files) and determining valid peptide pairs. The calculator dynamic routes require converting existing static `.astro` pages into `[peptide].astro` dynamic routes with `getStaticPaths()`, pre-populating peptide-specific data.

**Primary recommendation:** Use scripted generation for the 180 comparison MDX files (too many for manual creation), and build dynamic calculator routes using existing Astro patterns already proven across 10+ page types in this codebase.

## Standard Stack

### Core (Already in Place)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.16+ | SSG/SSR framework | Already the project framework |
| @astrojs/mdx | latest | MDX content collections | Already configured |
| @astrojs/vercel | latest | Server adapter | Already deployed |
| @astrojs/sitemap | latest | Auto sitemap generation | Already configured |

### Supporting (Already in Place)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Tailwind CSS | v4 (via @tailwindcss/vite) | Styling | All pages |
| Zod | (via astro:content) | Schema validation | Content frontmatter |

### No New Dependencies Required
This phase requires zero new libraries. Everything is built on existing patterns.

## Architecture Patterns

### Existing Project Structure (Relevant Portions)
```
src/
  content/
    comparisons/         # 100 existing .mdx files (target: 280)
    peptides/            # 92 .mdx files (data source)
    config.ts            # Zod schemas for all collections
  pages/
    compare/
      index.astro        # Comparison listing page
      [...slug].astro    # Dynamic comparison pages
    calculator/
      index.astro        # Calculator hub
      reconstitution.astro  # Static (needs dynamic child)
      blend.astro           # Static (needs dynamic child)
      accumulation.astro    # Static (needs dynamic child)
      reconstitution/       # DOES NOT EXIST YET
      blend/                # DOES NOT EXIST YET
      accumulation/         # DOES NOT EXIST YET
  layouts/
    ComparisonLayout.astro  # Comparison page template
    BaseLayout.astro        # Base page template
  components/
    SEO/
      FAQSchema.astro       # FAQ structured data
      HowToSchema.astro     # HowTo structured data
      JsonLd.astro          # Generic JSON-LD wrapper
```

### Pattern 1: Comparison MDX File Format
**What:** Each comparison is an MDX file in `src/content/comparisons/` with standardized frontmatter.
**When to use:** For all 180 new comparison files.
**Example (verified from existing files):**
```yaml
---
title: "BPC-157 vs TB-500"
peptideA: "bpc-157"          # Peptide slug (must match content/peptides/)
peptideB: "tb-500"           # Peptide slug (must match content/peptides/)
category: "repair-recovery"  # One of: metabolic, repair-recovery, hormonal, longevity, cognitive, immune, other
lastUpdated: 2026-01-19
summary: "Comparison of two popular peptides..."
metaTitle: "BPC-157 vs TB-500 Comparison | PepCodex"
metaDescription: "Compare BPC-157 and TB-500..."
faqs:
  - question: "What is the main difference between BPC-157 and TB-500?"
    answer: "BPC-157 is derived from..."
  - question: "Are BPC-157 and TB-500 FDA approved?"
    answer: "Neither BPC-157 nor TB-500 is FDA approved..."
  - question: "Which has more research?"
    answer: "BPC-157 has more published preclinical studies..."
  - question: "Can BPC-157 and TB-500 be used together?"
    answer: "Some researchers study them in combination..."
---

## Overview
[2-3 paragraphs]

## Evidence Comparison
[Table format]

## Mechanism Comparison
[Table format]

## Regulatory Status
[Table format]

## Safety Concerns
[Shared concerns]

## Key Differences
[Table format]

## Summary
[Concluding paragraph]
```

### Pattern 2: File Naming Convention
**What:** Comparison files use `{peptideA-slug}-vs-{peptideB-slug}.mdx` with alphabetical ordering of slugs.
**Critical note:** Existing files do NOT consistently alphabetize. Some have `semaglutide-vs-tirzepatide.mdx` AND `tirzepatide-vs-semaglutide.mdx`. Both exist and are separate content files with different content. The convention appears to be: the "more well-known" or "topic" peptide goes first.
**Recommendation:** For batch generation, alphabetically sort slugs to avoid duplicates: `aod-9604-vs-bpc-157.mdx` not `bpc-157-vs-aod-9604.mdx` (unless a reverse already exists). Check against existing 100 files before generating.

### Pattern 3: Comparison Page Rendering (`[...slug].astro`)
**What:** The comparison page uses `getStaticPaths()` to enumerate all comparisons from the collection.
**Critical bug found:** The `[...slug].astro` file has a HARDCODED `peptideData` map with only 4 entries (tirzepatide, semaglutide, retatrutide, liraglutide). For all other peptides, it falls back to using the slug as the name (no capitalization) and defaults to `'moderate'` evidence strength.
**Impact:** This means peptide names display as raw slugs (e.g., "bpc-157" instead of "BPC-157") and evidence badges are incorrect for most comparisons.
**Fix required:** Replace the hardcoded map with a dynamic lookup from `getCollection('peptides')` to get real names and evidence strengths for all 92 peptides.
```typescript
// CURRENT (broken for most peptides):
const peptideData: Record<string, { name: string; evidenceStrength: ... }> = {
  'tirzepatide': { name: 'Tirzepatide', evidenceStrength: 'high' },
  // only 4 entries...
};

// NEEDED:
const allPeptides = await getCollection('peptides');
const peptideMap = Object.fromEntries(
  allPeptides.map(p => [p.slug, { name: p.data.name, evidenceStrength: p.data.evidenceStrength }])
);
```

### Pattern 4: Dynamic Calculator Routes with getStaticPaths
**What:** Astro SSR mode with `output: 'server'` still supports `getStaticPaths()` for pre-rendering specific routes.
**How it works:** In server mode, `getStaticPaths()` tells Vercel which paths to pre-render at build time. Pages with `getStaticPaths()` are statically generated while other pages are server-rendered.
**Example (from existing `[slug].astro` pages):**
```typescript
---
import { getCollection, getEntry } from 'astro:content';

export async function getStaticPaths() {
  const peptides = await getCollection('peptides');
  return peptides.map((peptide) => ({
    params: { slug: peptide.slug },
    props: { peptide },
  }));
}

// Support both static and SSR modes
let peptide = Astro.props.peptide;
if (!peptide) {
  const { slug } = Astro.params;
  peptide = await getEntry('peptides', slug as string);
}
```

### Pattern 5: Calculator Dynamic Route Structure
**What:** Each calculator type gets a `[peptide].astro` dynamic route under its directory.
**Structure:**
```
src/pages/calculator/
  reconstitution.astro          # Keep existing (generic)
  reconstitution/[peptide].astro  # NEW: peptide-specific
  blend.astro                   # Keep existing (generic)
  blend/[peptide].astro           # NEW: peptide-specific
  accumulation.astro            # Keep existing (generic)
  accumulation/[peptide].astro    # NEW: peptide-specific
```
**URL pattern:** `/calculator/reconstitution/bpc-157`, `/calculator/blend/semaglutide`, etc.
**Pre-population:** Each calculator page pre-fills with peptide-specific data (typical vial size, common water volume, typical dose range from research).

### Anti-Patterns to Avoid
- **Hand-creating 180 MDX files manually:** Use a generation script. Manual creation is error-prone at this scale.
- **Duplicating calculator JavaScript:** The existing calculator JS is vanilla client-side. For dynamic routes, share the same `<script>` blocks; only the initial values and SEO metadata change per peptide.
- **Ignoring the peptideData hardcoding bug:** If 280 comparisons display raw slugs instead of proper names, the user experience suffers. Fix this FIRST.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Generating 180 MDX files | Manually writing each file | Node.js generation script | Error-prone at scale; consistent format needed |
| Determining valid comparison pairs | Manual pair selection | Script using `getCollection('peptides')` + category matching | Need algorithmic pair selection from 92 peptides |
| FAQ generation for comparisons | Manual FAQ writing per file | Templatized FAQ generation based on peptide category and properties | 4 FAQs per 180 files = 720 FAQs; templates ensure consistency |
| Peptide data for calculators | Hardcoding peptide info | Data file or collection query | 50 peptides need preset values |
| Cross-linking audit | Manual link checking | Script to verify all comparison slugs have matching dossier pages | 280 comparisons = 560 dossier links to verify |

## Common Pitfalls

### Pitfall 1: Duplicate Comparison Pairs
**What goes wrong:** Creating `bpc-157-vs-tb-500.mdx` when `tb-500-vs-bpc-157.mdx` already exists, or creating both directions.
**Why it happens:** No canonical ordering enforcement. Existing comparisons have some reversed duplicates (e.g., `semaglutide-vs-tirzepatide` AND `tirzepatide-vs-semaglutide` both exist).
**How to avoid:** Before generating, build a set of existing comparison pairs (normalized to alphabetical slug order). Generate only pairs that don't already exist in either direction.
**Warning signs:** Build errors from Astro about duplicate slugs; SEO canonical issues from duplicate content.

### Pitfall 2: Category Assignment for Cross-Category Pairs
**What goes wrong:** When peptideA is "metabolic" and peptideB is "repair-recovery", which category does the comparison get?
**Why it happens:** The comparison schema requires a single `category` field.
**How to avoid:** Use a priority system: if EITHER peptide is in the same category, use that. For cross-category pairs, use the category of peptideA (the first/more prominent peptide). Or use "other" for truly cross-category pairs.
**Warning signs:** Comparisons not appearing in expected category filters.

### Pitfall 3: Astro Build Memory Limits with 280+ MDX Files
**What goes wrong:** Astro's build process may run out of memory when processing 280 MDX files in the comparisons collection plus 92 peptides plus all other collections.
**Why it happens:** MDX compilation is memory-intensive; each file is parsed, compiled, and rendered.
**How to avoid:** Keep comparison MDX content lightweight (tables + text, no imports, no components). Monitor build times. If needed, increase Node.js memory limit: `NODE_OPTIONS=--max-old-space-size=4096`.
**Warning signs:** Build failures with "JavaScript heap out of memory", build times exceeding 5 minutes.

### Pitfall 4: The peptideData Hardcoding Bug in `[...slug].astro`
**What goes wrong:** Peptide names display as raw slugs (e.g., "ghk-cu" instead of "GHK-Cu") and evidence badges show incorrect "moderate" for all non-hardcoded peptides.
**Why it happens:** The comparison page (`src/pages/compare/[...slug].astro`) has a hardcoded map of only 4 peptides.
**How to avoid:** Replace with dynamic lookup from `getCollection('peptides')` as described in Architecture Pattern 3.
**Warning signs:** All comparisons outside the 4 hardcoded ones show wrong names and evidence levels.

### Pitfall 5: Missing FAQs on Existing 80 Comparisons
**What goes wrong:** Only 20 of the existing 100 comparisons have FAQs. The requirement says "FAQs added to all comparisons."
**Why it happens:** Phase 24 only deployed FAQs to the top 20. The other 80 were left without.
**How to avoid:** The FAQs-for-all task must cover both the 80 existing comparisons WITHOUT FAQs AND the 180 new ones. Total: 260 comparisons need FAQs added.
**Warning signs:** FAQSchema not rendering on most comparison pages; missing FAQ rich results in Google Search.

### Pitfall 6: Dossier Comparator Links Breaking
**What goes wrong:** The DossierLayout generates comparison links using `name.toLowerCase().replace(/\s+/g, '-')` but some peptide names don't match their slugs.
**Why it happens:** Peptide names like "MK-677" have slugs "mk-677" (works), but names like "5-Amino-1MQ" have special formatting. The DossierLayout constructs comparison URLs from the display `name` prop, which may not match the actual comparison file slug.
**How to avoid:** When generating new comparisons, ensure file slugs match what the DossierLayout would generate. Alternatively, fix the DossierLayout to use slugs instead of name transforms.
**Warning signs:** Clicking "View comparison" on dossier pages leads to 404s.

### Pitfall 7: Calculator Pre-population Data Accuracy
**What goes wrong:** Pre-filling calculator values with incorrect typical amounts for specific peptides.
**Why it happens:** Different peptides come in different vial sizes (e.g., BPC-157 is typically 5mg, semaglutide 3mg, GHK-Cu 50mg).
**How to avoid:** Source typical vial sizes and research dose ranges from the existing dossier content. Do NOT include dosing recommendations -- only pre-fill with common vial sizes and water volumes.
**Warning signs:** Calculator shows unrealistic default values; content could be interpreted as dosing guidance.

## Code Examples

### Comparison MDX File Generation (Template)
```javascript
// scripts/generate-comparisons.js
import { readdir, readFile, writeFile, access } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

const COMPARISONS_DIR = 'src/content/comparisons';
const PEPTIDES_DIR = 'src/content/peptides';

async function getPeptideData() {
  const files = await readdir(PEPTIDES_DIR);
  const peptides = [];
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;
    const content = await readFile(join(PEPTIDES_DIR, file), 'utf-8');
    const { data } = matter(content);
    peptides.push({
      slug: file.replace('.mdx', ''),
      name: data.name,
      category: data.category,
      evidenceStrength: data.evidenceStrength,
    });
  }
  return peptides;
}

async function getExistingComparisons() {
  const files = await readdir(COMPARISONS_DIR);
  const pairs = new Set();
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;
    const slug = file.replace('.mdx', '');
    // Normalize: extract peptide slugs and sort alphabetically
    const parts = slug.split('-vs-');
    if (parts.length === 2) {
      const [a, b] = parts.sort();
      pairs.add(`${a}::${b}`);
    }
  }
  return pairs;
}
```

### Dynamic Calculator Route (`[peptide].astro`)
```astro
---
import { getCollection, getEntry } from 'astro:content';
import BaseLayout from '../../../layouts/BaseLayout.astro';
import HowToSchema from '../../../components/SEO/HowToSchema.astro';

// Pre-render top 50 peptides
export async function getStaticPaths() {
  const peptides = await getCollection('peptides');
  // Select top 50 by evidence strength and popularity
  const top50 = peptides
    .sort((a, b) => {
      const order = { high: 0, moderate: 1, low: 2, 'very-low': 3 };
      return (order[a.data.evidenceStrength] ?? 4) - (order[b.data.evidenceStrength] ?? 4);
    })
    .slice(0, 50);

  return top50.map((peptide) => ({
    params: { peptide: peptide.slug },
    props: { peptide },
  }));
}

let peptide = Astro.props.peptide;
if (!peptide) {
  const { peptide: slug } = Astro.params;
  peptide = await getEntry('peptides', slug as string);
}
if (!peptide) return Astro.redirect('/calculator/reconstitution');

// Peptide-specific preset data (from a data map)
const presetData = getPresetForPeptide(peptide.slug);
---

<BaseLayout
  title={`${peptide.data.name} Reconstitution Calculator`}
  description={`Calculate reconstitution volumes and draw amounts for ${peptide.data.name}. Pre-filled with typical values.`}
>
  <!-- Breadcrumb with peptide name -->
  <!-- Calculator UI with pre-filled values -->
  <!-- Back to generic calculator link -->
  <!-- Link to peptide dossier -->
</BaseLayout>
```

### Fixing the Hardcoded peptideData in `[...slug].astro`
```astro
---
import { getCollection, getEntry } from 'astro:content';
import ComparisonLayout from '../../layouts/ComparisonLayout.astro';

export async function getStaticPaths() {
  const comparisons = await getCollection('comparisons');
  return comparisons.map((comparison) => ({
    params: { slug: comparison.slug },
    props: { comparison },
  }));
}

let comparison = Astro.props.comparison;
if (!comparison) {
  const { slug } = Astro.params;
  comparison = await getEntry('comparisons', slug as string);
}

if (!comparison) {
  return Astro.redirect('/404');
}

const { Content } = await comparison.render();

// FIXED: Dynamic lookup from peptides collection instead of hardcoded map
const allPeptides = await getCollection('peptides');
const peptideMap = new Map(
  allPeptides.map(p => [p.slug, { name: p.data.name, evidenceStrength: p.data.evidenceStrength }])
);

const peptideAData = peptideMap.get(comparison.data.peptideA);
const peptideBData = peptideMap.get(comparison.data.peptideB);

const peptideA = {
  name: peptideAData?.name || comparison.data.peptideA,
  slug: comparison.data.peptideA,
  evidenceStrength: peptideAData?.evidenceStrength || 'moderate' as const,
};

const peptideB = {
  name: peptideBData?.name || comparison.data.peptideB,
  slug: comparison.data.peptideB,
  evidenceStrength: peptideBData?.evidenceStrength || 'moderate' as const,
};
---
```

### FAQ Template for Comparison Generation
```yaml
faqs:
  - question: "What is the main difference between {PeptideA} and {PeptideB}?"
    answer: "{PeptideA} is a {typeA} primarily researched for {useA}, while {PeptideB} is a {typeB} studied for {useB}."
  - question: "Which has more research evidence, {PeptideA} or {PeptideB}?"
    answer: "{PeptideA} has {evidenceA} evidence while {PeptideB} has {evidenceB} evidence based on available studies."
  - question: "Are {PeptideA} and {PeptideB} FDA approved?"
    answer: "{FDA status for both, specific to each peptide.}"
  - question: "Can {PeptideA} and {PeptideB} be used together?"
    answer: "{Based on interaction data if available, or standard cautionary statement.}"
```

## Critical Findings

### 1. Comparison Pair Math
- 92 peptides in the collection
- 100 comparisons already exist
- NOT all 92 peptides should be compared with all others (that would be C(92,2) = 4,186 pairs)
- The requirement says "180 additional" for a total of 280
- Strategy: Generate pairs for peptides within the same category AND for peptides that share a `comparators` field reference
- Some peptides are clinical/oncology (225ac-dota-lm3, bt5528, evx-01, etc.) -- these should NOT be compared with recreational peptides

### 2. Existing Comparison Inventory
- 100 total files in `src/content/comparisons/`
- 20 have FAQs (Phase 24)
- 80 need FAQs added
- 180 new files need FAQs from creation
- Total FAQ work: 260 comparison files

### 3. Category Distribution of Existing Comparisons
- Metabolic: ~38 (largest group)
- Hormonal: ~24
- Cognitive: ~10
- Longevity: ~10
- Repair-Recovery: ~10
- Immune: ~8

### 4. Calculator Route Feasibility
- No dynamic calculator routes exist yet
- Existing calculators are fully static `.astro` files with inline `<script>` tags
- Each calculator is ~300-500 lines of Astro + client-side JS
- Dynamic routes need: `getStaticPaths()`, peptide-specific SEO metadata, peptide-specific preset values
- The generic calculators should remain accessible at `/calculator/reconstitution` etc.

### 5. Top 50 Peptides for Calculator Routes
The 50 peptides for calculator `getStaticPaths` should be selected based on:
- Evidence strength (high/moderate first)
- Search volume potential (well-known peptides)
- Practical relevance (peptides people actually reconstitute)
- Exclude: oncology compounds (225ac-dota-lm3, bt5528, etc.), mRNA therapies, clinical trial-only compounds

### 6. SSR + getStaticPaths Behavior
- `astro.config.mjs` uses `output: 'server'` with `vercel()` adapter
- In server mode, pages WITH `getStaticPaths()` are pre-rendered (static HTML at build)
- Pages WITHOUT `getStaticPaths()` are server-rendered on demand
- All existing dynamic pages (peptides, comparisons, blog, etc.) use `getStaticPaths()`
- The "Support both static and SSR modes" pattern (check `Astro.props` then fallback to `getEntry`) is used consistently

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hardcoded peptideData map | Dynamic collection lookup | Should fix NOW | Correct names/evidence for all 280 comparisons |
| Static calculator URLs | Dynamic [peptide] routes | Phase 29 | 150 new indexable pages |
| Manual comparison creation | Scripted generation | Phase 29 | Scale from 100 to 280 efficiently |

## Open Questions

1. **Pair Selection Algorithm**
   - What we know: Need 180 new pairs from 92 peptides, staying within meaningful comparisons
   - What's unclear: Exact criteria for "valid pair" -- same category only? Same category + shared comparators? Cross-category allowed?
   - Recommendation: Generate pairs where peptides share a category OR where one peptide lists the other in its `comparators` field. Exclude oncology/clinical-only compounds from general comparisons. Cap at 180 total new files.

2. **Calculator Preset Data Source**
   - What we know: Each peptide-specific calculator page needs default values (vial size, water volume)
   - What's unclear: Where to source typical vial sizes -- this data doesn't exist in the current collection schema
   - Recommendation: Create a `data/calculator-presets.json` with typical vial sizes for top 50 peptides. Source from common research supply catalogs. Avoid anything that could be interpreted as dosing guidance.

3. **Duplicate Comparison Handling**
   - What we know: Some reverse-direction comparisons exist (e.g., `semaglutide-vs-tirzepatide` AND `tirzepatide-vs-semaglutide`)
   - What's unclear: Is this intentional (SEO for both search directions) or accidental?
   - Recommendation: Treat existing reverse pairs as intentional (they have different content). For NEW comparisons, generate only one direction per pair (alphabetical) to avoid duplication.

4. **Content Quality at Scale**
   - What we know: 180 new comparisons need substantive content, not thin filler
   - What's unclear: How much unique content can be generated vs. templatized
   - Recommendation: Use a template structure but require unique content in Overview, Evidence Comparison, and Key Differences sections. Mechanism and Regulatory sections can be more templatized. Minimum 300 words unique content per page.

## Sources

### Primary (HIGH confidence)
- **Codebase inspection** - Direct reading of all relevant files:
  - `src/content/config.ts` - Collection schemas (comparison, peptide)
  - `src/content/comparisons/*.mdx` - All 100 existing comparison files
  - `src/content/peptides/*.mdx` - All 92 peptide files
  - `src/pages/compare/[...slug].astro` - Comparison page rendering
  - `src/pages/calculator/*.astro` - All 4 calculator pages
  - `src/layouts/ComparisonLayout.astro` - Comparison layout template
  - `src/layouts/DossierLayout.astro` - Dossier page with comparison links
  - `src/components/SEO/FAQSchema.astro` - FAQ schema component
  - `astro.config.mjs` - SSR/output configuration
  - `vercel.json` - Redirect rules
  - `.planning/STATE.md` - Current project state

### Secondary (MEDIUM confidence)
- Astro documentation on `getStaticPaths` in server mode (verified from existing codebase patterns)
- SSR + pre-rendering behavior (verified from 10+ existing dynamic pages using this pattern)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - zero new dependencies, all patterns verified from codebase
- Architecture: HIGH - all patterns directly observed in existing code
- Pitfalls: HIGH - identified from direct code inspection (hardcoded map bug, missing FAQs on 80 files)
- Calculator routes: HIGH - pattern matches 10+ existing dynamic pages
- Pair selection: MEDIUM - algorithm needs design; criteria partially defined by requirements

**Research date:** 2026-02-12
**Valid until:** 2026-03-12 (stable codebase, no Astro major version expected)
