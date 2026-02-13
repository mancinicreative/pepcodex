#!/usr/bin/env node
/**
 * Backfill Comparison FAQs
 * Adds FAQs to existing comparison MDX files that are missing them.
 *
 * For each comparison missing FAQs (no `faqs` array or empty array):
 *   - Reads peptide dossier data for both sides
 *   - Generates 4 factual FAQs based on dossier data
 *   - Updates frontmatter and writes the file back
 *
 * Usage: node scripts/backfill-comparison-faqs.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const PEPTIDES_DIR = join(ROOT, 'src', 'content', 'peptides');
const COMPARISONS_DIR = join(ROOT, 'src', 'content', 'comparisons');

const dryRun = process.argv.includes('--dry-run');

// --- Display helpers ---

const EVIDENCE_LABELS = {
  'high': 'High',
  'moderate': 'Moderate',
  'low': 'Low',
  'very-low': 'Very Low',
};

const CATEGORY_LABELS = {
  'repair-recovery': 'tissue repair and recovery',
  'metabolic': 'metabolic health',
  'longevity': 'longevity and anti-aging',
  'immune': 'immune modulation',
  'cognitive': 'cognitive function',
  'sexual-health': 'sexual health',
  'growth-hormone': 'growth hormone secretion',
  'skin-hair': 'skin and hair health',
  'sleep': 'sleep regulation',
  'antimicrobial': 'antimicrobial defense',
  'muscle': 'muscle growth',
  'neuroprotection': 'neuroprotection',
};

function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category.replace(/-/g, ' ');
}

function getEvidenceLabel(level) {
  return EVIDENCE_LABELS[level] || level;
}

// --- Peptide loader ---

function loadPeptideDossiers() {
  const map = new Map();
  const files = readdirSync(PEPTIDES_DIR).filter(f => f.endsWith('.mdx'));

  for (const file of files) {
    const raw = readFileSync(join(PEPTIDES_DIR, file), 'utf-8');
    const { data: fm } = matter(raw);
    const slug = file.replace('.mdx', '');
    map.set(slug, {
      name: fm.name || slug,
      category: fm.category || 'unknown',
      evidenceStrength: fm.evidenceStrength || 'unknown',
      compoundType: fm.compoundType || null,
      sources: fm.sources || { count: 0, human: 0, preclinical: 0 },
    });
  }

  return map;
}

// --- FDA status determination ---

function getFDAStatus(evidenceStrength, name) {
  if (evidenceStrength === 'high') {
    return `${name} is FDA-approved for specific indications`;
  }
  return `${name} is not FDA-approved and remains a research compound`;
}

// --- FAQ generation ---

function generateFAQs(comparisonFm, pepA, pepB) {
  const nameA = pepA.name;
  const nameB = pepB.name;
  const levelA = getEvidenceLabel(pepA.evidenceStrength);
  const levelB = getEvidenceLabel(pepB.evidenceStrength);
  const categoryLabel = getCategoryLabel(comparisonFm.category);

  // FAQ 1: Main difference
  const differenceAnswer = buildDifferenceAnswer(nameA, nameB, pepA, pepB, categoryLabel);

  // FAQ 2: Clinical evidence
  const evidenceAnswer =
    `${nameA} has ${pepA.sources.count} sources (${pepA.sources.human} human studies), rated ${levelA} evidence. ` +
    `${nameB} has ${pepB.sources.count} sources (${pepB.sources.human} human studies), rated ${levelB} evidence.`;

  // FAQ 3: FDA approval
  const fdaStatusA = getFDAStatus(pepA.evidenceStrength, nameA);
  const fdaStatusB = getFDAStatus(pepB.evidenceStrength, nameB);
  let fdaAnswer;
  if (pepA.evidenceStrength === 'high' && pepB.evidenceStrength === 'high') {
    fdaAnswer = `Both ${nameA} and ${nameB} are FDA-approved for specific indications. Consult prescribing information for approved uses.`;
  } else if (pepA.evidenceStrength === 'high' || pepB.evidenceStrength === 'high') {
    fdaAnswer = `${fdaStatusA}. ${fdaStatusB}. Only FDA-approved medications have undergone the full regulatory review process.`;
  } else {
    fdaAnswer = `Neither ${nameA} nor ${nameB} is FDA-approved. Both remain research compounds without regulatory approval for clinical use.`;
  }

  // FAQ 4: Combination use
  const combinationAnswer =
    `There is no published clinical data on the safety or efficacy of using ${nameA} and ${nameB} together. ` +
    `Without controlled human studies evaluating this combination, the safety profile is unknown. ` +
    `Consult a qualified healthcare provider before considering any peptide regimen.`;

  return [
    {
      question: `What is the main difference between ${nameA} and ${nameB}?`,
      answer: differenceAnswer,
    },
    {
      question: `Which has more clinical evidence, ${nameA} or ${nameB}?`,
      answer: evidenceAnswer,
    },
    {
      question: `Are ${nameA} and ${nameB} FDA approved?`,
      answer: fdaAnswer,
    },
    {
      question: `Can ${nameA} and ${nameB} be used together?`,
      answer: combinationAnswer,
    },
  ];
}

function buildDifferenceAnswer(nameA, nameB, pepA, pepB, categoryLabel) {
  const parts = [];

  // Category context
  parts.push(`Both ${nameA} and ${nameB} are researched in the context of ${categoryLabel}`);

  // Evidence level comparison
  if (pepA.evidenceStrength === pepB.evidenceStrength) {
    parts[0] += `, both with ${getEvidenceLabel(pepA.evidenceStrength)} evidence strength.`;
  } else {
    parts[0] += `.`;
    parts.push(
      `${nameA} has ${getEvidenceLabel(pepA.evidenceStrength)} evidence while ${nameB} has ${getEvidenceLabel(pepB.evidenceStrength)} evidence.`
    );
  }

  // Compound type if available
  if (pepA.compoundType && pepB.compoundType && pepA.compoundType !== pepB.compoundType) {
    parts.push(`${nameA} is classified as a ${pepA.compoundType} while ${nameB} is a ${pepB.compoundType}.`);
  }

  return parts.join(' ');
}

// --- Main ---

function main() {
  console.log(`=== Backfill Comparison FAQs ${dryRun ? '(DRY RUN)' : ''} ===\n`);

  const peptides = loadPeptideDossiers();
  console.log(`Loaded ${peptides.size} peptide dossiers.\n`);

  const comparisonFiles = readdirSync(COMPARISONS_DIR).filter(f => f.endsWith('.mdx'));
  console.log(`Found ${comparisonFiles.length} comparison files.\n`);

  let updated = 0;
  let skippedHasFaqs = 0;
  let skippedMissingPeptide = 0;
  const results = [];

  for (const file of comparisonFiles) {
    const filePath = join(COMPARISONS_DIR, file);
    const raw = readFileSync(filePath, 'utf-8');
    const { data: fm, content: body } = matter(raw);

    // Skip if FAQs already exist and are non-empty
    if (fm.faqs && Array.isArray(fm.faqs) && fm.faqs.length > 0) {
      skippedHasFaqs++;
      continue;
    }

    const pepA = peptides.get(fm.peptideA);
    const pepB = peptides.get(fm.peptideB);

    // Skip gracefully if either peptide dossier doesn't exist
    if (!pepA || !pepB) {
      const missing = [];
      if (!pepA) missing.push(fm.peptideA);
      if (!pepB) missing.push(fm.peptideB);
      console.log(`  [SKIP] ${file} — missing dossier(s): ${missing.join(', ')}`);
      skippedMissingPeptide++;
      continue;
    }

    // Generate FAQs
    const faqs = generateFAQs(fm, pepA, pepB);
    fm.faqs = faqs;

    // Write updated file
    if (!dryRun) {
      const output = matter.stringify(body, fm);
      writeFileSync(filePath, output, 'utf-8');
    }

    updated++;
    results.push({
      file,
      title: fm.title,
      peptideA: pepA.name,
      peptideB: pepB.name,
    });

    console.log(`  [${dryRun ? 'WOULD UPDATE' : 'UPDATED'}] ${fm.title} (${file})`);
  }

  // Summary
  console.log(`\n=== Summary ===`);
  console.log(`  Total comparison files: ${comparisonFiles.length}`);
  console.log(`  Already had FAQs:       ${skippedHasFaqs}`);
  console.log(`  Missing peptide data:   ${skippedMissingPeptide}`);
  console.log(`  ${dryRun ? 'Would update' : 'Updated'}:           ${updated}`);

  if (dryRun && updated > 0) {
    console.log(`\nRe-run without --dry-run to apply changes.`);
  }
}

main();
