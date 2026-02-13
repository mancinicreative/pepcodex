#!/usr/bin/env node
/**
 * QA Comparison Audit Script
 * Cross-checks every comparison against dossier data to find mismatches.
 *
 * Checks:
 *   1. Evidence strength claims vs dossier evidenceStrength
 *   2. Study count claims vs dossier sources fields
 *   3. Peptide slug references are valid
 *   4. FAQs present (flags missing)
 *
 * Usage: node scripts/qa-comparison-audit.mjs
 * Output: data/comparison-audit-report.json
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const PEPTIDES_DIR = join(ROOT, 'src', 'content', 'peptides');
const COMPARISONS_DIR = join(ROOT, 'src', 'content', 'comparisons');
const EVIDENCE_REPORT = join(ROOT, 'data', 'evidence-audit-report.json');
const OUTPUT_PATH = join(ROOT, 'data', 'comparison-audit-report.json');

// Evidence level display names used in prose
const EVIDENCE_LABELS = {
  'high': ['high', 'strong', 'robust', 'extensive'],
  'moderate': ['moderate', 'moderate-level', 'substantial'],
  'low': ['low', 'limited', 'minimal'],
  'very-low': ['very low', 'very-low', 'preliminary', 'preclinical only', 'preclinical-only'],
};

/**
 * Load all peptide dossier frontmatter into a map.
 */
function loadPeptides() {
  const peptides = new Map();
  const files = readdirSync(PEPTIDES_DIR).filter(f => f.endsWith('.mdx'));

  for (const file of files) {
    const raw = readFileSync(join(PEPTIDES_DIR, file), 'utf-8');
    const { data: fm } = matter(raw);
    const slug = file.replace('.mdx', '');
    peptides.set(slug, {
      slug,
      name: fm.name || slug,
      evidenceStrength: fm.evidenceStrength,
      sources: fm.sources || { count: 0, human: 0, preclinical: 0, openAccess: 0 },
      category: fm.category,
      comparators: fm.comparators || [],
    });
  }

  return peptides;
}

/**
 * Parse number claims from comparison body text.
 * Looks for patterns like "X human studies", "X RCTs", "X clinical trials", etc.
 */
function extractStudyClaims(bodyText, peptideSlug, peptideName) {
  const claims = [];
  const lines = bodyText.split('\n');

  // Patterns matching study count claims
  const patterns = [
    /(\d+)\s+human\s+(?:studies|trials?|RCTs?)/gi,
    /(\d+)\s+(?:clinical|human)\s+(?:studies|trials?)/gi,
    /(\d+)\s+(?:published\s+)?(?:preclinical|animal)\s+(?:studies|trials?)/gi,
    /(\d+)\s+(?:total\s+)?sources?/gi,
    /(\d+)\s+(?:peer-reviewed\s+)?(?:publications?|papers?|citations?)/gi,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line is in a context about the specific peptide
    // (within 2 lines of the peptide name or in a table row with it)
    const nearbyContext = lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 3)).join(' ');
    const nameRegex = new RegExp(peptideName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
    const slugRegex = new RegExp(peptideSlug.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');

    if (!nameRegex.test(nearbyContext) && !slugRegex.test(nearbyContext)) continue;

    for (const pattern of patterns) {
      let match;
      pattern.lastIndex = 0;
      while ((match = pattern.exec(line)) !== null) {
        claims.push({
          line: i + 1,
          text: line.trim(),
          claimedCount: parseInt(match[1], 10),
          matchedPattern: match[0],
        });
      }
    }
  }

  return claims;
}

/**
 * Check if body text references an evidence level that contradicts the dossier.
 */
function checkEvidenceLevelClaims(bodyText, peptideSlug, peptideName, actualLevel) {
  const mismatches = [];
  const lines = bodyText.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    // Check if this line references the peptide
    const nameRegex = new RegExp(peptideName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').toLowerCase());
    const slugRegex = new RegExp(peptideSlug.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').toLowerCase());

    if (!nameRegex.test(line) && !slugRegex.test(line)) continue;

    // Check for evidence level mentions that don't match
    for (const [level, labels] of Object.entries(EVIDENCE_LABELS)) {
      if (level === actualLevel) continue; // Skip the correct level

      for (const label of labels) {
        const labelRegex = new RegExp(`\\b${label}\\b`, 'i');
        if (labelRegex.test(line)) {
          // Check it's about evidence, not something else
          if (/evidence|data|research|studies|clinical/i.test(line)) {
            mismatches.push({
              line: i + 1,
              text: lines[i].trim(),
              claimedLevel: level,
              actualLevel,
              matchedLabel: label,
            });
          }
        }
      }
    }
  }

  return mismatches;
}

/**
 * Check a specific study count claim like "0 human studies" against dossier.
 */
function checkStudyCountClaims(bodyText, peptideSlug, peptideName, dossierSources) {
  const mismatches = [];
  const lines = bodyText.split('\n');

  // Patterns: "N human studies/RCTs/trials"
  const humanPatterns = [
    /(\d+)\s+human\s+(?:studies|trials?|RCTs?)/gi,
    /(\d+)\s+(?:clinical|human)\s+(?:studies|trials?)/gi,
    /no\s+(?:published\s+)?human\s+(?:studies|data|trials?)/gi,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nearbyContext = lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 3)).join(' ');

    const nameRegex = new RegExp(peptideName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
    if (!nameRegex.test(nearbyContext)) continue;

    for (const pattern of humanPatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(line)) !== null) {
        if (match[0].startsWith('no') || match[0].startsWith('No')) {
          // "no human studies" claim → check if dossier has human > 0
          if (dossierSources.human > 0) {
            mismatches.push({
              line: i + 1,
              text: line.trim(),
              peptide: peptideName,
              claimed: '0 human studies',
              actual: `${dossierSources.human} human sources in dossier`,
              severity: 'high',
            });
          }
        } else {
          const claimed = parseInt(match[1], 10);
          // Flag if significantly different (allow ±2 margin for different counting methods)
          if (Math.abs(claimed - dossierSources.human) > 2) {
            mismatches.push({
              line: i + 1,
              text: line.trim(),
              peptide: peptideName,
              claimed: `${claimed} human studies`,
              actual: `${dossierSources.human} human sources in dossier`,
              severity: Math.abs(claimed - dossierSources.human) > 5 ? 'high' : 'medium',
            });
          }
        }
      }
    }
  }

  return mismatches;
}

function auditComparisons(peptides) {
  const files = readdirSync(COMPARISONS_DIR).filter(f => f.endsWith('.mdx'));
  const report = {
    generatedAt: new Date().toISOString(),
    totalComparisons: files.length,
    mismatches: [],
    warnings: [],
    missingFAQs: [],
    invalidSlugs: [],
    summary: {
      evidenceLevelMismatches: 0,
      studyCountMismatches: 0,
      invalidSlugRefs: 0,
      missingFAQCount: 0,
    },
    comparisons: {},
  };

  for (const file of files) {
    const filePath = join(COMPARISONS_DIR, file);
    const raw = readFileSync(filePath, 'utf-8');
    const { data: fm, content: bodyText } = matter(raw);
    const slug = file.replace('.mdx', '');

    const entry = {
      slug,
      file,
      title: fm.title,
      peptideA: fm.peptideA,
      peptideB: fm.peptideB,
      category: fm.category,
      hasFAQs: Boolean(fm.faqs && fm.faqs.length > 0),
      faqCount: fm.faqs ? fm.faqs.length : 0,
      issues: [],
    };

    // Check peptide slugs exist
    const pepA = peptides.get(fm.peptideA);
    const pepB = peptides.get(fm.peptideB);

    if (!pepA) {
      entry.issues.push({
        type: 'invalid-slug',
        severity: 'high',
        message: `peptideA "${fm.peptideA}" not found in peptides collection`,
      });
      report.invalidSlugs.push({ file, slug: fm.peptideA, field: 'peptideA' });
      report.summary.invalidSlugRefs++;
    }

    if (!pepB) {
      entry.issues.push({
        type: 'invalid-slug',
        severity: 'high',
        message: `peptideB "${fm.peptideB}" not found in peptides collection`,
      });
      report.invalidSlugs.push({ file, slug: fm.peptideB, field: 'peptideB' });
      report.summary.invalidSlugRefs++;
    }

    // Check evidence level claims in body text
    if (pepA) {
      const evMismatches = checkEvidenceLevelClaims(bodyText, fm.peptideA, pepA.name, pepA.evidenceStrength);
      for (const m of evMismatches) {
        entry.issues.push({
          type: 'evidence-level-mismatch',
          severity: 'medium',
          peptide: pepA.name,
          ...m,
        });
        report.summary.evidenceLevelMismatches++;
      }

      const scMismatches = checkStudyCountClaims(bodyText, fm.peptideA, pepA.name, pepA.sources);
      for (const m of scMismatches) {
        entry.issues.push({ type: 'study-count-mismatch', ...m });
        report.summary.studyCountMismatches++;
      }
    }

    if (pepB) {
      const evMismatches = checkEvidenceLevelClaims(bodyText, fm.peptideB, pepB.name, pepB.evidenceStrength);
      for (const m of evMismatches) {
        entry.issues.push({
          type: 'evidence-level-mismatch',
          severity: 'medium',
          peptide: pepB.name,
          ...m,
        });
        report.summary.evidenceLevelMismatches++;
      }

      const scMismatches = checkStudyCountClaims(bodyText, fm.peptideB, pepB.name, pepB.sources);
      for (const m of scMismatches) {
        entry.issues.push({ type: 'study-count-mismatch', ...m });
        report.summary.studyCountMismatches++;
      }
    }

    // Check for missing FAQs
    if (!entry.hasFAQs) {
      report.missingFAQs.push({ file, slug, title: fm.title });
      report.summary.missingFAQCount++;
    }

    if (entry.issues.length > 0) {
      report.mismatches.push({
        file,
        slug,
        title: fm.title,
        issues: entry.issues,
      });
    }

    report.comparisons[slug] = entry;
  }

  return report;
}

// --- Main ---
console.log('=== PepCodex Comparison Audit ===\n');

console.log('Loading peptide dossiers...');
const peptides = loadPeptides();
console.log(`Loaded ${peptides.size} peptides.\n`);

console.log('Auditing comparisons...');
const report = auditComparisons(peptides);

console.log(`Total comparisons: ${report.totalComparisons}`);
console.log(`Evidence level mismatches: ${report.summary.evidenceLevelMismatches}`);
console.log(`Study count mismatches: ${report.summary.studyCountMismatches}`);
console.log(`Invalid slug references: ${report.summary.invalidSlugRefs}`);
console.log(`Missing FAQs: ${report.summary.missingFAQCount}\n`);

if (report.mismatches.length > 0) {
  console.log('--- Flagged Comparisons ---');
  for (const m of report.mismatches) {
    console.log(`\n  ${m.title} (${m.file}):`);
    for (const issue of m.issues) {
      if (issue.type === 'evidence-level-mismatch') {
        console.log(`    [EV] ${issue.peptide}: claims "${issue.claimedLevel}" but dossier says "${issue.actualLevel}" (line ${issue.line})`);
      } else if (issue.type === 'study-count-mismatch') {
        console.log(`    [SC] ${issue.peptide}: claims ${issue.claimed}, actual ${issue.actual} (line ${issue.line})`);
      } else if (issue.type === 'invalid-slug') {
        console.log(`    [SLUG] ${issue.message}`);
      }
    }
  }
  console.log('');
}

if (report.missingFAQs.length > 0) {
  console.log(`--- ${report.missingFAQs.length} Comparisons Missing FAQs ---`);
  for (const m of report.missingFAQs.slice(0, 10)) {
    console.log(`  ${m.title} (${m.file})`);
  }
  if (report.missingFAQs.length > 10) {
    console.log(`  ... and ${report.missingFAQs.length - 10} more`);
  }
  console.log('');
}

writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2), 'utf-8');
console.log(`Report written to: ${OUTPUT_PATH}`);
