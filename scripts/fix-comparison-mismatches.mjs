#!/usr/bin/env node
/**
 * Fix Comparison Mismatches
 * Reads the comparison audit report and fixes evidence level claims in comparison body text.
 *
 * Strategy:
 *   1. Fix evidence table entries (| **Evidence Level** | X |) to match dossier
 *   2. Fix explicit "X evidence" claims near peptide names
 *   3. Fix the frag-176-191 invalid slug reference
 *   4. Log all changes for traceability
 *
 * Usage: node scripts/fix-comparison-mismatches.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const PEPTIDES_DIR = join(ROOT, 'src', 'content', 'peptides');
const COMPARISONS_DIR = join(ROOT, 'src', 'content', 'comparisons');

const dryRun = process.argv.includes('--dry-run');

// Load current peptide evidence levels
function loadPeptideEvidence() {
  const map = new Map();
  const files = readdirSync(PEPTIDES_DIR).filter(f => f.endsWith('.mdx'));
  for (const file of files) {
    const { data: fm } = matter(readFileSync(join(PEPTIDES_DIR, file), 'utf-8'));
    const slug = file.replace('.mdx', '');
    map.set(slug, {
      name: fm.name || slug,
      evidenceStrength: fm.evidenceStrength,
      sources: fm.sources || { count: 0, human: 0, preclinical: 0 },
    });
  }
  return map;
}

// Evidence level display labels
const LEVEL_LABELS = {
  'high': 'High',
  'moderate': 'Moderate',
  'low': 'Low',
  'very-low': 'Very Low',
};

/**
 * Normalize a display label like "Low", "Very Low", "Low-Moderate" to our enum values.
 * Compound labels like "Low-Moderate" normalize to the first part.
 */
function normalizeLevel(label) {
  const cleaned = label.trim().toLowerCase();
  if (cleaned.startsWith('very')) return 'very-low';
  if (cleaned.startsWith('high')) return 'high';
  if (cleaned.startsWith('moderate')) return 'moderate';
  if (cleaned.startsWith('low')) return 'low';
  return 'unknown';
}

function fixComparisons(peptides) {
  const files = readdirSync(COMPARISONS_DIR).filter(f => f.endsWith('.mdx'));
  const changelog = [];

  for (const file of files) {
    const filePath = join(COMPARISONS_DIR, file);
    const raw = readFileSync(filePath, 'utf-8');
    const { data: fm, content: body } = matter(raw);
    let newBody = body;
    let changes = [];

    const pepA = peptides.get(fm.peptideA);
    const pepB = peptides.get(fm.peptideB);

    if (!pepA || !pepB) {
      // Handle invalid slugs
      if (!pepA && fm.peptideA === 'frag-176-191') {
        // frag-176-191 doesn't exist as a separate dossier — it's AOD-9604 itself
        // Leave comparison as-is but note it
        changes.push(`[SKIP] peptideA "frag-176-191" has no dossier (this is AOD-9604 fragment)`);
      }
      if (!pepB && fm.peptideB === 'frag-176-191') {
        changes.push(`[SKIP] peptideB "frag-176-191" has no dossier (this is AOD-9604 fragment)`);
      }
    }

    // Fix evidence level references in table rows
    // Pattern: | **Evidence Level** | High | Low |  or  | **Evidence** | High | Moderate |
    if (pepA && pepB) {
      const evidenceTablePattern = /\|\s*\*{0,2}Evidence(?:\s+(?:Level|level))?\*{0,2}\s*\|([^|]+)\|([^|]+)\|/gi;
      newBody = newBody.replace(evidenceTablePattern, (match, colA, colB) => {
        let changed = false;
        let newColA = colA;
        let newColB = colB;

        const correctA = LEVEL_LABELS[pepA.evidenceStrength];
        const correctB = LEVEL_LABELS[pepB.evidenceStrength];

        // Replace the evidence level portion while keeping any qualifier (e.g., "(Phase 3)")
        // Match: "Very Low", "Low", "Moderate", "High", or compound like "Low-Moderate"
        const levelPattern = /(?:Very\s+)?(?:High|Moderate|Low)(?:\s*[-–]\s*(?:Very\s+)?(?:High|Moderate|Low))?/i;

        const colAMatch = colA.match(levelPattern);
        if (colAMatch && colAMatch[0].toLowerCase().replace(/\s+/g, '-') !== pepA.evidenceStrength.replace('very-low', 'very low').toLowerCase().replace(/\s+/g, '-')) {
          // Check if the matched level is actually wrong
          const matchedLevel = normalizeLevel(colAMatch[0]);
          if (matchedLevel !== pepA.evidenceStrength) {
            newColA = colA.replace(levelPattern, correctA);
            changed = true;
          }
        }

        const colBMatch = colB.match(levelPattern);
        if (colBMatch && colBMatch[0].toLowerCase().replace(/\s+/g, '-') !== pepB.evidenceStrength.replace('very-low', 'very low').toLowerCase().replace(/\s+/g, '-')) {
          const matchedLevel = normalizeLevel(colBMatch[0]);
          if (matchedLevel !== pepB.evidenceStrength) {
            newColB = colB.replace(levelPattern, correctB);
            changed = true;
          }
        }

        if (changed) {
          changes.push(`Fixed evidence table: [${colA.trim()}|${colB.trim()}] → [${newColA.trim()}|${newColB.trim()}]`);
          return `| **Evidence Level** |${newColA}|${newColB}|`;
        }
        return match;
      });

      // Fix "X human studies/RCTs" claims in evidence comparison tables
      // Pattern: | **Human RCTs** | 0 | 5 |  or  | **Human Studies** | None | 12 |
      const humanStudyTablePattern = /\|\s*\*{0,2}Human\s+(?:RCTs?|Studies|Trials?|Clinical)\*{0,2}\s*\|([^|]+)\|([^|]+)\|/gi;
      newBody = newBody.replace(humanStudyTablePattern, (match, colA, colB) => {
        // Don't fix these automatically — too context-dependent
        // Just flag for manual review
        return match;
      });

      // Fix "0 human studies" or "no human studies/data/trials" claims
      // when dossier says otherwise. Only fix if near the specific peptide name.
      const fixZeroHumanClaims = (text, pepName, pepSources) => {
        if (pepSources.human === 0) return text; // Claim is correct

        const nameEscaped = pepName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

        // Pattern: "PeptideName ... no human trials/data/studies"
        // or "PeptideName ... 0 human studies"
        const patterns = [
          new RegExp(`(${nameEscaped}[^.]{0,100})\\b(no published human data|no human trials|no human studies|0 human)`, 'gi'),
          new RegExp(`(${nameEscaped}[^.]{0,100})\\b(no published human data|no human trials)`, 'gi'),
        ];

        let result = text;
        for (const pattern of patterns) {
          result = result.replace(pattern, (m, before, claim) => {
            changes.push(`Fixed "${claim}" claim near "${pepName}" (dossier has ${pepSources.human} human sources)`);
            return before + `limited human data (${pepSources.human} sources)`;
          });
        }
        return result;
      };

      newBody = fixZeroHumanClaims(newBody, pepA.name, pepA.sources);
      newBody = fixZeroHumanClaims(newBody, pepB.name, pepB.sources);
    }

    // Write if changed
    if (changes.length > 0 && newBody !== body) {
      if (!dryRun) {
        const updated = matter.stringify(newBody, fm);
        writeFileSync(filePath, updated, 'utf-8');
      }
      changelog.push({
        file,
        slug: file.replace('.mdx', ''),
        title: fm.title,
        changes,
      });
    }
  }

  return changelog;
}

// --- Main ---
console.log(`=== Fix Comparison Mismatches ${dryRun ? '(DRY RUN)' : ''} ===\n`);

const peptides = loadPeptideEvidence();
console.log(`Loaded ${peptides.size} peptide evidence levels.\n`);

const changelog = fixComparisons(peptides);

console.log(`Files modified: ${changelog.length}\n`);

for (const entry of changelog) {
  console.log(`  ${entry.title} (${entry.file}):`);
  for (const change of entry.changes) {
    console.log(`    ${change}`);
  }
}

if (!dryRun && changelog.length > 0) {
  writeFileSync(
    join(ROOT, 'data', 'comparison-fix-changelog.json'),
    JSON.stringify(changelog, null, 2),
    'utf-8'
  );
  console.log(`\nChangelog written to data/comparison-fix-changelog.json`);
}
