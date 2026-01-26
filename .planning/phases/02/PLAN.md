---
phase: 02-content-templates
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/layouts/DossierLayout.astro
  - src/content/peptides/tirzepatide.mdx
  - src/layouts/ComparisonLayout.astro
  - src/layouts/GuideLayout.astro
  - src/layouts/SafetyLayout.astro
  - src/content/comparisons/tirzepatide-vs-semaglutide.mdx
  - src/content/guides/what-is-tirzepatide.mdx
  - src/content/safety/glp1-safety-overview.mdx
  - src/pages/compare/[...slug].astro
  - src/pages/guide/[...slug].astro
  - src/pages/safety/[...slug].astro
autonomous: true

must_haves:
  truths:
    - "Dossier pages render all 12 sections from Prompt A structure"
    - "Comparison pages display two peptides side-by-side with key metrics"
    - "Guide pages work for 'What is X' educational content"
    - "Safety pages display clinical trial information"
    - "All content types build without errors"
  artifacts:
    - path: "src/layouts/DossierLayout.astro"
      provides: "Enhanced dossier layout with 12-section navigation"
      contains: "pharmacokinetics|preclinical|methodology"
    - path: "src/layouts/ComparisonLayout.astro"
      provides: "Side-by-side peptide comparison layout"
      min_lines: 50
    - path: "src/layouts/GuideLayout.astro"
      provides: "Educational guide page layout"
      min_lines: 40
    - path: "src/layouts/SafetyLayout.astro"
      provides: "Safety/clinical trials page layout"
      min_lines: 50
    - path: "src/pages/compare/[...slug].astro"
      provides: "Dynamic route for comparison pages"
      exports: ["getStaticPaths"]
    - path: "src/pages/guide/[...slug].astro"
      provides: "Dynamic route for guide pages"
      exports: ["getStaticPaths"]
    - path: "src/pages/safety/[...slug].astro"
      provides: "Dynamic route for safety pages"
      exports: ["getStaticPaths"]
  key_links:
    - from: "src/pages/compare/[...slug].astro"
      to: "src/layouts/ComparisonLayout.astro"
      via: "import and render"
      pattern: "import ComparisonLayout"
    - from: "src/pages/guide/[...slug].astro"
      to: "src/layouts/GuideLayout.astro"
      via: "import and render"
      pattern: "import GuideLayout"
    - from: "src/pages/safety/[...slug].astro"
      to: "src/layouts/SafetyLayout.astro"
      via: "import and render"
      pattern: "import SafetyLayout"
---

<objective>
Complete all content templates for Phase 2: Dossier, Comparison, Guide, and Safety layouts with sample content and dynamic routes.

Purpose: Enable the site to render all four content types matching production requirements (TMPL-01 through TMPL-04).

Output: Four complete layouts, three dynamic routes, and sample content files for each type.
</objective>

<context>
@.planning/PROJECT.md
@.planning/REQUIREMENTS.md
@.planning/STATE.md

Existing files to reference:
@src/layouts/DossierLayout.astro - Current dossier layout (needs enhancement)
@src/layouts/BaseLayout.astro - Base layout to extend
@src/content/peptides/tirzepatide.mdx - Sample dossier content
@src/content/config.ts - Content collection schemas (already defined)
@src/components/EvidenceBadge.astro - Evidence strength badge component
@src/components/TableOfContents.astro - Table of contents component
@src/components/CitationTable.astro - Citation table component
</context>

<tasks>

<task type="auto">
  <name>Task 1: Enhance DossierLayout for 12-Section Structure</name>
  <files>
    src/layouts/DossierLayout.astro
    src/content/peptides/tirzepatide.mdx
  </files>
  <action>
Enhance DossierLayout.astro to support the full 12-section dossier structure:

**Layout enhancements:**
1. Add a section navigation component in the sidebar showing all 12 sections:
   - Overview (what it is, aliases) - from frontmatter
   - Mechanism of Action
   - Research Summary (human + preclinical counts)
   - Key Human Trials
   - Preclinical Evidence
   - Safety Profile
   - Pharmacokinetics
   - Regulatory Status
   - Related Peptides
   - Current Research Directions
   - Citation Table
   - Methodology Note

2. Update TableOfContents integration to highlight current section on scroll

3. Add a "Methodology Note" section at the bottom of every dossier with standard disclaimer text about evidence grading methodology (link to /methodology page)

4. Add "Related Peptides" section in sidebar that uses the existing `comparators` prop to show related peptides with links

5. Add frontmatter fields to Props interface:
   - pharmacokinetics?: { halfLife?: string; bioavailability?: string; metabolism?: string }
   - relatedPeptides?: string[]

**Update tirzepatide.mdx:**
1. Restructure content to explicitly use all 12 sections with proper h2 headings
2. Add missing sections:
   - "Preclinical Evidence" section (separate from clinical)
   - "Pharmacokinetics" section with half-life, bioavailability info
   - "Related Peptides" section
3. Rename "Ongoing Research" to "Current Research Directions"
4. Rename "Evidence Library" to "Citation Table"
5. Add "Methodology Note" section at end

Keep existing Tailwind styling patterns. Use slate color palette for consistency.
  </action>
  <verify>
Run `npm run build` - should complete without errors.
Check that tirzepatide page renders at /peptides/tirzepatide with all 12 sections visible.
Verify sidebar shows section navigation.
  </verify>
  <done>
DossierLayout supports all 12 sections.
tirzepatide.mdx has all 12 sections with proper headings.
Build passes without errors.
  </done>
</task>

<task type="auto">
  <name>Task 2: Create ComparisonLayout and Sample Content</name>
  <files>
    src/layouts/ComparisonLayout.astro
    src/content/comparisons/tirzepatide-vs-semaglutide.mdx
    src/pages/compare/[...slug].astro
  </files>
  <action>
**Create ComparisonLayout.astro:**
1. Import BaseLayout, EvidenceBadge
2. Props interface:
   - title: string
   - peptideA: { name: string; slug: string; evidenceStrength: string }
   - peptideB: { name: string; slug: string; evidenceStrength: string }
   - category: string
   - lastUpdated: Date
   - summary: string
3. Layout structure:
   - Header with title ("X vs Y: Evidence Comparison")
   - Two-column grid for desktop (side-by-side), stacked for mobile
   - Each column shows peptide name with link to dossier, evidence badge
   - Comparison table placeholder (MDX content fills this via slot)
   - "Key Differences" section rendered from MDX
   - Links to both full dossiers at bottom
   - Disclaimer notice (same as dossier)
4. Style with Tailwind: grid layout, responsive breakpoints, consistent slate colors

**Create tirzepatide-vs-semaglutide.mdx:**
Frontmatter (matching config.ts schema):
- title: "Tirzepatide vs Semaglutide"
- peptideA: "tirzepatide"
- peptideB: "semaglutide"
- category: "metabolic"
- lastUpdated: 2026-01-19
- summary: "Evidence-based comparison of two leading GLP-1 receptor agonists"

Content sections:
- Overview (what's being compared)
- Mechanism Comparison (table: dual vs single agonist)
- Clinical Evidence Comparison (SURPASS-2 head-to-head data)
- Safety Comparison (GI side effects, boxed warnings)
- Key Differences (bullet points)
- Which to Choose? (evidence-based guidance, NOT medical advice)
- Sources

**Create dynamic route src/pages/compare/[...slug].astro:**
1. Use getStaticPaths with getCollection('comparisons')
2. Import ComparisonLayout
3. Pass frontmatter props to layout
4. Render Content in slot
  </action>
  <verify>
Run `npm run build` - should complete without errors.
Check /compare/tirzepatide-vs-semaglutide renders with side-by-side layout.
Verify links to individual dossiers work.
  </verify>
  <done>
ComparisonLayout.astro exists with side-by-side grid layout.
Sample comparison content exists.
Dynamic route renders comparison pages.
TMPL-02 requirement satisfied.
  </done>
</task>

<task type="auto">
  <name>Task 3: Create GuideLayout, SafetyLayout, and Sample Content</name>
  <files>
    src/layouts/GuideLayout.astro
    src/layouts/SafetyLayout.astro
    src/content/guides/what-is-tirzepatide.mdx
    src/content/safety/glp1-safety-overview.mdx
    src/pages/guide/[...slug].astro
    src/pages/safety/[...slug].astro
  </files>
  <action>
**Create GuideLayout.astro:**
1. Import BaseLayout, EvidenceBadge
2. Props interface:
   - title: string
   - peptide?: string (optional link to dossier)
   - category?: string
   - lastUpdated: Date
   - summary: string
3. Layout structure:
   - Clean article layout (narrower max-width than dossier)
   - Title as h1
   - Summary as lead paragraph
   - If peptide prop exists, show "See full dossier" link
   - Sidebar with TableOfContents
   - "Related Reading" section at bottom (can be populated via MDX)
   - Disclaimer notice
4. Optimized for long-form educational content ("What is X" pages)

**Create what-is-tirzepatide.mdx:**
Frontmatter:
- title: "What is Tirzepatide?"
- peptide: "tirzepatide"
- category: "metabolic"
- lastUpdated: 2026-01-19
- summary: "An introduction to tirzepatide, a dual GIP/GLP-1 receptor agonist"

Content (educational, beginner-friendly):
- Introduction (what tirzepatide is, plain language)
- How Does Tirzepatide Work? (simplified mechanism)
- What is it Used For? (approved indications)
- How is it Administered? (weekly injection, dose titration)
- What Does the Research Show? (summary of key trials)
- Is it Safe? (link to safety page)
- Key Takeaways (bullet points)
- Learn More (link to full dossier)

**Create SafetyLayout.astro:**
1. Import BaseLayout
2. Props interface:
   - title: string
   - peptides: string[] (related peptides)
   - lastUpdated: Date
   - summary: string
3. Layout structure:
   - Header with title and "Safety Information" badge
   - Alert box at top: "This information is for educational purposes only"
   - Two-column layout: main content + sidebar
   - Sidebar shows "Related Peptides" with links to dossiers
   - Clinical trial information sections (rendered from MDX)
   - Sources section at bottom
   - Strong disclaimer notice (more prominent than other layouts)
4. Visual indicators: amber/warning color accents for safety content

**Create glp1-safety-overview.mdx:**
Frontmatter:
- title: "GLP-1 Agonist Safety Overview"
- peptides: ["tirzepatide", "semaglutide"]
- lastUpdated: 2026-01-19
- summary: "Clinical trial safety data for GLP-1 receptor agonists"

Content:
- Overview (what GLP-1 agonists are)
- Common Side Effects (GI effects table)
- Serious Adverse Events (pancreatitis, thyroid warnings)
- Boxed Warnings (FDA black box warnings explained)
- Contraindications
- Drug Interactions (if known)
- Clinical Trial Data (key safety findings from trials)
- Post-Marketing Surveillance (what's being monitored)
- Sources

**Create dynamic routes:**

src/pages/guide/[...slug].astro:
1. getStaticPaths with getCollection('guides')
2. Import and use GuideLayout
3. Pass props, render Content

src/pages/safety/[...slug].astro:
1. getStaticPaths with getCollection('safety')
2. Import and use SafetyLayout
3. Pass props, render Content
  </action>
  <verify>
Run `npm run build` - should complete without errors.
Check /guide/what-is-tirzepatide renders with educational layout.
Check /safety/glp1-safety-overview renders with safety-focused layout.
Verify all links work (to dossiers, between pages).
  </verify>
  <done>
GuideLayout.astro exists for "What is X" pages.
SafetyLayout.astro exists with clinical trial information display.
Sample content exists for both types.
Dynamic routes render guide and safety pages.
TMPL-03 and TMPL-04 requirements satisfied.
  </done>
</task>

</tasks>

<verification>
After all tasks complete:

1. **Build verification:**
   ```bash
   npm run build
   ```
   Should complete without errors, generating pages for all content types.

2. **Page count verification:**
   Build output should show new pages:
   - /peptides/tirzepatide (enhanced)
   - /compare/tirzepatide-vs-semaglutide
   - /guide/what-is-tirzepatide
   - /safety/glp1-safety-overview

3. **Visual verification (dev server):**
   ```bash
   npm run dev
   ```
   Visit each page type and verify:
   - Dossier shows all 12 sections with proper navigation
   - Comparison shows side-by-side layout
   - Guide shows clean educational layout
   - Safety shows clinical trial information with warning styling

4. **Requirements check:**
   - TMPL-01: Dossier has 12 sections
   - TMPL-02: Comparison renders side-by-side
   - TMPL-03: Guide works for "What is X"
   - TMPL-04: Safety displays clinical trial info
</verification>

<success_criteria>
- All four layout files exist and are syntactically valid
- All four sample content files exist with proper frontmatter
- All three dynamic routes work (peptides already existed)
- `npm run build` passes with no errors
- Each content type renders with appropriate layout structure
- Sidebar navigation works on dossier pages
- Links between related content work (dossier <-> comparison <-> guide <-> safety)
</success_criteria>

<output>
After completion, create `.planning/phases/02/02-01-SUMMARY.md` documenting:
- Files created/modified
- Key implementation decisions
- Any deviations from plan
- Verification results
</output>
