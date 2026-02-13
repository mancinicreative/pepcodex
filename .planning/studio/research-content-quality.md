# Content Quality Tasks - Research

**Researched:** 2026-02-12
**Domain:** Content migration (evidence scale unification) + Build-time validation (cross-link validation)
**Confidence:** HIGH

## Summary

Research into two content quality tasks for PepCodex: (1) unifying the blog evidence scale to match the peptides scale, and (2) building a cross-link validation script for all slug reference fields across 12 content collections (872 files total).

The existing `scripts/` directory contains 11 scripts that establish a clear, proven pattern for frontmatter manipulation using `gray-matter` (already in devDependencies). Every script follows the same approach: `readFileSync` -> `matter(raw)` -> mutate `data` object -> `matter.stringify(content, data)` -> `writeFileSync`. This pattern is battle-tested across hundreds of files and should be reused exactly.

**Primary recommendation:** Follow the exact gray-matter parse/stringify pattern from `qa-evidence-audit.mjs` for the blog migration script. For cross-link validation, build a standalone Node.js script (not Astro API) that loads all collections via gray-matter and validates every slug reference field identified below.

---

## Task 1: Evidence Scale Unification

### Current State

**Two incompatible evidence scales exist:**

| Collection | Field | Values | Status |
|---|---|---|---|
| `peptides` | `evidenceStrength` | `high`, `moderate`, `low`, `very-low` | CANONICAL (keep) |
| `blog` | `evidenceLevel` | `known`, `suggestive`, `early`, `unknown` | MIGRATE (remove) |

**Blog evidenceLevel field usage (151 total blog files):**

| Value | Count | Maps To |
|---|---|---|
| `known` | 62 | `high` |
| `early` | 33 | `low` |
| `suggestive` | 9 | `moderate` |
| `unknown` | 0 | `very-low` |
| *(not set)* | 47 | *(leave as undefined -- field is optional)* |
| **Total** | **151** | |

**Decision: The mapping is:**
```
known     -> high
suggestive -> moderate
early     -> low
unknown   -> very-low
```

### Files That Need Changing

1. **`src/content/config.ts`** (line 199) -- Change blog schema `evidenceLevel` enum values from `['known', 'suggestive', 'early', 'unknown']` to `['high', 'moderate', 'low', 'very-low']`
2. **`src/layouts/BlogLayout.astro`** (lines 23, 56-61) -- Update Props interface type and `evidenceLabels` map to use new values
3. **`src/pages/blog/[slug].astro`** -- No change needed (passes `post.data.evidenceLevel` through)
4. **104 blog MDX files** -- Transform frontmatter `evidenceLevel` values
5. **47 blog MDX files** -- No change needed (field not set, optional in schema)

### Established Script Pattern (from existing codebase)

All scripts in `scripts/` follow this exact pattern. **Do not deviate.**

```javascript
// Pattern from qa-evidence-audit.mjs (lines 17-24, 87-91, 168-178)
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');

// Read all MDX files
const files = readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));

for (const file of files) {
  const filePath = join(BLOG_DIR, file);
  const raw = readFileSync(filePath, 'utf-8');
  const { data: fm, content } = matter(raw);

  // Mutate frontmatter
  if (fm.evidenceLevel) {
    fm.evidenceLevel = MAPPING[fm.evidenceLevel];
  }

  // Write back using matter.stringify
  const updated = matter.stringify(content, fm);
  writeFileSync(filePath, updated, 'utf-8');
}
```

**Key details from existing scripts:**
- `matter(raw)` returns `{ data, content }` where `content` is everything after the `---` frontmatter delimiters
- `matter.stringify(content, data)` reconstructs the full file with `---` delimiters
- All scripts use `import.meta.dirname` (ESM) for path resolution
- All scripts use `readdirSync().filter(f => f.endsWith('.mdx'))`
- The `fix-comparison-mismatches.mjs` script (line 170) shows the write-back pattern: `const updated = matter.stringify(newBody, fm); writeFileSync(filePath, updated, 'utf-8');`

### gray-matter Behavior Warning

**IMPORTANT:** `matter.stringify()` may reformat YAML slightly (e.g., quote style, date formatting, array style). This is observed behavior from the existing scripts. The existing codebase already accepts this -- all 11 scripts use this pattern on production content. The migration script should include a `--dry-run` flag (like existing scripts) to preview changes before applying.

### BlogLayout.astro Changes Required

Current (lines 56-61):
```javascript
const evidenceLabels: Record<string, { label: string; color: string }> = {
  'known': { label: 'Known', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  'suggestive': { label: 'Suggestive', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  'early': { label: 'Early', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  'unknown': { label: 'Unknown', color: 'bg-white/20 text-white/70 border-white/20' },
};
```

Must change to (matching peptides evidence scale display pattern):
```javascript
const evidenceLabels: Record<string, { label: string; color: string }> = {
  'high': { label: 'High', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  'moderate': { label: 'Moderate', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  'low': { label: 'Low', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  'very-low': { label: 'Very Low', color: 'bg-white/20 text-white/70 border-white/20' },
};
```

Also update Props interface (line 23):
```typescript
evidenceLevel?: 'high' | 'moderate' | 'low' | 'very-low';
```

---

## Task 2: Cross-Link Validation Script

### Complete Slug Reference Field Map

Every field across all 12 collections that references slugs in another collection:

| Collection | Field | Type | Target Collection | Required? |
|---|---|---|---|---|
| **peptides** | `comparators` | `string[]` | peptides | default `[]` |
| **peptides** | `interactions[].peptide` | `string` | peptides | yes (within optional array) |
| **peptides** | `relatedTerms` | `string[]` | glossary | default `[]` |
| **peptides** | `conditions[].relatedPeptides` | `string[]` | peptides | optional |
| **comparisons** | `peptideA` | `string` | peptides | required |
| **comparisons** | `peptideB` | `string` | peptides | required |
| **guides** | `peptide` | `string` | peptides | optional |
| **guides** | `relatedTerms` | `string[]` | glossary | default `[]` |
| **safety** | `peptides` | `string[]` | peptides | default `[]` |
| **blog** | `relatedPeptides` | `string[]` | peptides | default `[]` |
| **blog** | `relatedGlossary` | `string[]` | glossary | default `[]` |
| **blog** | `peptide` | `string` | peptides | optional |
| **blog** | `relatedPeptidesForSafety` | `string[]` | peptides | default `[]` |
| **glossary** | `relatedPeptides` | `string[]` | peptides | default `[]` |
| **glossary** | `relatedTerms` | `string[]` | glossary | default `[]` |
| **clinics** | `peptides` | `string[]` | peptides | optional |
| **conditions** | `relatedConditions` | `string[]` | conditions | default `[]` |
| **protocols** | `peptides` | `string[]` | peptides | required |

**18 total slug reference fields across 8 collections.**

Collections with NO slug references: `cities`, `pages`.

### Collection File Counts

| Collection | File Count | Extension |
|---|---|---|
| blog | 151 | .mdx |
| cities | 60 | .mdx |
| clinics | 10 | .mdx |
| comparisons | 279 | .mdx |
| conditions | 15 | .mdx |
| glossary | 215 | .mdx |
| guides | 36 | .mdx |
| pages | 0 | -- |
| peptides | 92 | .mdx |
| protocols | 3 | .mdx |
| safety | 11 | .mdx |
| **Total** | **872** | |

### Script Architecture

**Use Node.js with gray-matter (NOT Astro API).** Rationale:
1. All existing QA scripts use this approach (consistency)
2. No need for Astro build context -- pure frontmatter reading
3. `gray-matter` is already a devDependency (`^4.0.3`)
4. Scripts run standalone via `node scripts/qa-cross-links.mjs`

**Algorithm:**
```
1. Load all slugs for each target collection into Sets:
   - peptideSlugs = Set of all filenames in src/content/peptides/ (minus .mdx)
   - glossarySlugs = Set of all filenames in src/content/glossary/
   - conditionSlugs = Set of all filenames in src/content/conditions/

2. For each collection with slug references:
   - Read each file
   - Parse frontmatter with gray-matter
   - For each slug reference field, check if value exists in target Set
   - Collect errors: { file, field, invalidSlug, targetCollection }

3. Report:
   - Total files scanned
   - Total slug references checked
   - Invalid references (grouped by collection)
   - Exit code 1 if any invalid found
```

### Existing Precedent

The `qa-comparison-audit.mjs` script (lines 239-260) already validates `peptideA` and `peptideB` slugs against the peptides collection. The cross-link script generalizes this pattern to ALL collections.

```javascript
// From qa-comparison-audit.mjs lines 239-260
const pepA = peptides.get(fm.peptideA);
const pepB = peptides.get(fm.peptideB);

if (!pepA) {
  entry.issues.push({
    type: 'invalid-slug',
    severity: 'high',
    message: `peptideA "${fm.peptideA}" not found in peptides collection`,
  });
  report.invalidSlugs.push({ file, slug: fm.peptideA, field: 'peptideA' });
}
```

### Script Output Format

Follow the existing report pattern (JSON output + console summary):

```
=== PepCodex Cross-Link Validation ===

Loaded slugs: peptides=92, glossary=215, conditions=15
Scanning 872 content files across 8 collections...

[OK] peptides: 92 files, 0 invalid references
[FAIL] comparisons: 279 files, 2 invalid references
  comparisons/aod-9604-vs-frag-176-191.mdx: peptideB "frag-176-191" not in peptides
  ...
[OK] blog: 151 files, 0 invalid references

Total: 872 files scanned, 1,247 references checked, 2 invalid

Report written to: data/cross-link-report.json
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| YAML frontmatter parsing | Custom regex parser | `gray-matter` (already installed) | Handles edge cases: multiline strings, nested objects, arrays, dates |
| File path resolution | Hardcoded paths | `import.meta.dirname` + `path.resolve` | Consistent with all 11 existing scripts |
| Dry-run flag | Separate scripts for check vs apply | Single script with `--dry-run` flag | Pattern from `fix-comparison-mismatches.mjs` and `generate-comparisons.mjs` |

---

## Common Pitfalls

### Pitfall 1: gray-matter.stringify reformats YAML
**What goes wrong:** `matter.stringify()` may change quote styles, date formats, or array formatting
**Why it happens:** gray-matter uses js-yaml under the hood which has its own serialization preferences
**How to avoid:** This is accepted behavior in the codebase (all 11 scripts use it). Include `--dry-run` to preview. Run `git diff` after to verify only intended changes.
**Warning signs:** Massive diff touching every line of frontmatter

### Pitfall 2: Blog files without evidenceLevel field
**What goes wrong:** Script crashes or adds empty field to files that don't have it
**Why it happens:** 47 of 151 blog files have no `evidenceLevel` field (it's optional)
**How to avoid:** Check `if (fm.evidenceLevel)` before transforming. Never add the field to files that don't have it.
**Warning signs:** File diff shows `evidenceLevel: undefined` or `evidenceLevel: null`

### Pitfall 3: Nested slug references in peptides.interactions
**What goes wrong:** Validation script only checks top-level fields, misses `interactions[].peptide`
**Why it happens:** Most slug refs are simple arrays, but `interactions` is an array of objects with a `peptide` property
**How to avoid:** Explicitly handle nested structure: `fm.interactions?.forEach(i => check(i.peptide))`
**Warning signs:** Invalid interaction slugs silently pass validation

### Pitfall 4: Forgetting conditions[].relatedPeptides inside peptides collection
**What goes wrong:** The `conditions` field inside the peptides schema has its own `relatedPeptides` sub-array
**Why it happens:** It's a nested schema within peptides, easy to miss
**How to avoid:** Walk `fm.conditions?.forEach(c => c.relatedPeptides?.forEach(check))`

### Pitfall 5: Execution order matters
**What goes wrong:** Running cross-link validation before evidence migration, or building before updating schema
**Why it happens:** Schema change + content change + layout change must be coordinated
**How to avoid:** Execute in this order: (1) Create migration script, (2) Run with --dry-run to verify, (3) Update config.ts schema, (4) Run migration script, (5) Update BlogLayout.astro, (6) Build to verify

---

## Code Examples

### Migration Script Skeleton (verified pattern from codebase)

```javascript
#!/usr/bin/env node
/**
 * Migrate blog evidenceLevel from old scale to unified peptides scale.
 *
 * Mapping: known->high, suggestive->moderate, early->low, unknown->very-low
 *
 * Usage: node scripts/migrate-evidence-scale.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');
const dryRun = process.argv.includes('--dry-run');

const MAPPING = {
  'known': 'high',
  'suggestive': 'moderate',
  'early': 'low',
  'unknown': 'very-low',
};

const files = readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
let migrated = 0;
let skipped = 0;

for (const file of files) {
  const filePath = join(BLOG_DIR, file);
  const raw = readFileSync(filePath, 'utf-8');
  const { data: fm, content } = matter(raw);

  if (!fm.evidenceLevel) {
    skipped++;
    continue;
  }

  const oldValue = fm.evidenceLevel;
  const newValue = MAPPING[oldValue];

  if (!newValue) {
    console.warn(`  [WARN] ${file}: unknown evidenceLevel "${oldValue}"`);
    continue;
  }

  fm.evidenceLevel = newValue;
  migrated++;

  if (!dryRun) {
    const updated = matter.stringify(content, fm);
    writeFileSync(filePath, updated, 'utf-8');
  }

  console.log(`  [${dryRun ? 'DRY' : 'OK'}] ${file}: ${oldValue} -> ${newValue}`);
}

console.log(`\nMigrated: ${migrated}, Skipped (no field): ${skipped}`);
```

### Cross-Link Validation Script Skeleton

```javascript
#!/usr/bin/env node
/**
 * Cross-Link Validation: Checks all slug references across all collections.
 *
 * Usage: node scripts/qa-cross-links.mjs
 * Output: data/cross-link-report.json
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const CONTENT = join(ROOT, 'src', 'content');

function loadSlugs(collectionName) {
  const dir = join(CONTENT, collectionName);
  if (!existsSync(dir)) return new Set();
  return new Set(
    readdirSync(dir)
      .filter(f => f.endsWith('.mdx'))
      .map(f => f.replace('.mdx', ''))
  );
}

function loadFrontmatter(collectionName) {
  const dir = join(CONTENT, collectionName);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => {
      const raw = readFileSync(join(dir, f), 'utf-8');
      const { data } = matter(raw);
      return { file: f, data };
    });
}

// Load all target slug sets
const slugSets = {
  peptides: loadSlugs('peptides'),
  glossary: loadSlugs('glossary'),
  conditions: loadSlugs('conditions'),
};

// Define validation rules per collection
const RULES = [
  { collection: 'peptides', field: 'comparators', target: 'peptides', path: (fm) => fm.comparators || [] },
  { collection: 'peptides', field: 'interactions[].peptide', target: 'peptides',
    path: (fm) => (fm.interactions || []).map(i => i.peptide) },
  { collection: 'peptides', field: 'relatedTerms', target: 'glossary', path: (fm) => fm.relatedTerms || [] },
  { collection: 'peptides', field: 'conditions[].relatedPeptides', target: 'peptides',
    path: (fm) => (fm.conditions || []).flatMap(c => c.relatedPeptides || []) },
  { collection: 'comparisons', field: 'peptideA', target: 'peptides', path: (fm) => [fm.peptideA].filter(Boolean) },
  { collection: 'comparisons', field: 'peptideB', target: 'peptides', path: (fm) => [fm.peptideB].filter(Boolean) },
  { collection: 'guides', field: 'peptide', target: 'peptides', path: (fm) => [fm.peptide].filter(Boolean) },
  { collection: 'guides', field: 'relatedTerms', target: 'glossary', path: (fm) => fm.relatedTerms || [] },
  { collection: 'safety', field: 'peptides', target: 'peptides', path: (fm) => fm.peptides || [] },
  { collection: 'blog', field: 'relatedPeptides', target: 'peptides', path: (fm) => fm.relatedPeptides || [] },
  { collection: 'blog', field: 'relatedGlossary', target: 'glossary', path: (fm) => fm.relatedGlossary || [] },
  { collection: 'blog', field: 'peptide', target: 'peptides', path: (fm) => [fm.peptide].filter(Boolean) },
  { collection: 'blog', field: 'relatedPeptidesForSafety', target: 'peptides', path: (fm) => fm.relatedPeptidesForSafety || [] },
  { collection: 'glossary', field: 'relatedPeptides', target: 'peptides', path: (fm) => fm.relatedPeptides || [] },
  { collection: 'glossary', field: 'relatedTerms', target: 'glossary', path: (fm) => fm.relatedTerms || [] },
  { collection: 'clinics', field: 'peptides', target: 'peptides', path: (fm) => fm.peptides || [] },
  { collection: 'conditions', field: 'relatedConditions', target: 'conditions', path: (fm) => fm.relatedConditions || [] },
  { collection: 'protocols', field: 'peptides', target: 'peptides', path: (fm) => fm.peptides || [] },
];
```

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---|---|---|---|
| `gray-matter` | `^4.0.3` | YAML frontmatter parse/stringify | Already in devDependencies, used by all 11 existing scripts |
| Node.js `fs` | built-in | File system operations | All scripts use `readFileSync`/`writeFileSync` (sync, not async) |
| Node.js `path` | built-in | Path resolution | All scripts use `resolve(import.meta.dirname, '..')` |

### Not Needed
| Library | Why Not |
|---|---|
| `ajv` | Only used for JSON schema validation (source-pack), not needed here |
| `glob` | `readdirSync().filter()` is sufficient -- all content is flat (no subdirs per collection) |
| Astro API | Scripts run outside of Astro build context |

---

## Architecture Patterns

### Script Conventions (from 11 existing scripts)

1. **File**: `scripts/[verb]-[noun].mjs` (ESM, `.mjs` extension)
2. **Shebang**: `#!/usr/bin/env node`
3. **JSDoc header**: Purpose, usage, output path
4. **ROOT constant**: `resolve(import.meta.dirname, '..')`
5. **CLI flags**: `process.argv.includes('--dry-run')`, `process.argv.includes('--fix')`
6. **Report output**: JSON to `data/[name]-report.json`
7. **Console output**: Header line `=== Script Name ===`, summary stats, flagged items
8. **Exit code**: 0 for success, 1 for failures found

### Migration Script Naming

Following existing patterns:
- `fix-comparison-mismatches.mjs` (fixes content)
- `backfill-comparison-faqs.mjs` (backfills missing data)
- Proposed: `migrate-blog-evidence-scale.mjs`

### Validation Script Naming

Following existing patterns:
- `qa-evidence-audit.mjs` (audits evidence)
- `qa-comparison-audit.mjs` (audits comparisons)
- Proposed: `qa-cross-links.mjs`

---

## Open Questions

1. **Should the field be renamed from `evidenceLevel` to `evidenceStrength` in blog schema?**
   - Currently peptides uses `evidenceStrength`, blog uses `evidenceLevel`
   - The values will be unified, but the field names differ
   - Renaming the field would require updating BlogLayout.astro Props, the [slug].astro page, and all blog files
   - Recommendation: Keep `evidenceLevel` as the field name in blog (different concept: blog evidence level is about the article's claims, peptide evidence strength is about the compound). But the values should use the same scale.

2. **Should cross-link validation run in CI/build?**
   - Currently no pre-build validation scripts in package.json
   - Could add to `prebuild` script alongside pagefind
   - Recommendation: Start as standalone script, consider CI integration later

---

## Sources

### Primary (HIGH confidence)
- **Codebase inspection**: All 11 files in `scripts/` directory read and analyzed
- **`src/content/config.ts`**: Complete schema for all 12 collections (314 lines)
- **`src/layouts/BlogLayout.astro`**: Current evidenceLevel usage (304 lines)
- **`package.json`**: devDependencies confirmed gray-matter ^4.0.3, ajv ^8.17.1

### Data (HIGH confidence -- direct file counts)
- 151 blog files total (104 with evidenceLevel, 47 without)
- 62 known + 33 early + 9 suggestive + 0 unknown = 104 files with evidenceLevel
- 872 total content files across 12 collections
- 18 slug reference fields across 8 collections

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - gray-matter already in use, pattern verified across 11 scripts
- Architecture: HIGH - following exact patterns from existing codebase
- Pitfalls: HIGH - identified from reading actual code and understanding gray-matter behavior
- Data counts: HIGH - computed from direct grep/file counts on actual content

**Research date:** 2026-02-12
**Valid until:** Indefinite (based on codebase analysis, not external dependencies)
