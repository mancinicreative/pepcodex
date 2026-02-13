#!/usr/bin/env node
/**
 * QA Evidence Audit Script
 * Reads every peptide dossier and outputs a report flagging evidence level inconsistencies.
 *
 * Decision criteria:
 *   high     = FDA-approved or Phase 3+ trials
 *   moderate = Phase 2 or multiple RCTs
 *   low      = Phase 1 or animal-only with some human data
 *   very-low = preclinical/in-vitro only
 *
 * Usage: node scripts/qa-evidence-audit.mjs [--fix]
 *   --fix  Auto-update dossier frontmatter evidence levels
 *
 * Output: data/evidence-audit-report.json
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const PEPTIDES_DIR = join(ROOT, 'src', 'content', 'peptides');
const OUTPUT_PATH = join(ROOT, 'data', 'evidence-audit-report.json');

// Known FDA-approved compounds (evidence = high)
const FDA_APPROVED = new Set([
  'semaglutide', 'tirzepatide', 'liraglutide', 'tesamorelin',
  'pasireotide', 'hcg', 'hmg', 'pt-141', // bremelanotide (Vyleesi)
]);

// Compounds with Phase 3+ data (evidence = high per plan criteria)
const PHASE_3_PLUS = new Set([
  'retatrutide', 'survodutide', 'cagrilintide', 'cagrisema',
  'orforglipron', 'mazdutide', 'mrna-4157',
]);

// Compounds with Phase 2 data (evidence = moderate)
const PHASE_2 = new Set([
  'pemvidutide', 'vk2735', 'maritide', 'amycretin', 'ct-388',
  'oveporexton', 'alixorexton', 'zelenectide-pevedotin',
]);

/**
 * Suggest an evidence level based on source counts and known regulatory status.
 */
function suggestEvidenceLevel(slug, sources, ecbHuman, ecbAnimal, ecbCell) {
  // FDA-approved = high
  if (FDA_APPROVED.has(slug)) return 'high';

  // Phase 3+ trials = high (per plan criteria)
  if (PHASE_3_PLUS.has(slug)) return 'high';

  // Phase 2 trials = moderate
  if (PHASE_2.has(slug)) return 'moderate';

  const humanStudies = sources.human || 0;
  const preclinical = sources.preclinical || 0;
  const totalECBHuman = ecbHuman || 0;

  // Multiple human RCTs or substantial human data
  if (humanStudies >= 10 || totalECBHuman >= 5) return 'moderate';

  // Some human data (3+ sources or 2+ ECB human)
  if (humanStudies >= 3 || totalECBHuman >= 2) return 'low';

  // Animal-only with at least some studies
  if (preclinical >= 5 && humanStudies === 0) return 'very-low';

  // Minimal data but some human
  if (humanStudies > 0) return 'low';

  return 'very-low';
}

function auditPeptides() {
  const files = readdirSync(PEPTIDES_DIR).filter(f => f.endsWith('.mdx'));
  const report = {
    generatedAt: new Date().toISOString(),
    totalDossiers: files.length,
    flagged: [],
    summary: { high: 0, moderate: 0, low: 0, 'very-low': 0 },
    changelog: [],
    peptides: {},
  };

  for (const file of files) {
    const filePath = join(PEPTIDES_DIR, file);
    const raw = readFileSync(filePath, 'utf-8');
    const { data: fm } = matter(raw);

    const slug = file.replace('.mdx', '');
    const name = fm.name || slug;
    const currentLevel = fm.evidenceStrength || 'unknown';
    const sources = fm.sources || { count: 0, human: 0, preclinical: 0, openAccess: 0 };

    // Count evidence from evidenceChainedBenefits
    let ecbHumanTotal = 0;
    let ecbAnimalTotal = 0;
    let ecbCellTotal = 0;
    let ecbFindings = [];

    if (fm.evidenceChainedBenefits && Array.isArray(fm.evidenceChainedBenefits)) {
      for (const b of fm.evidenceChainedBenefits) {
        if (b.evidence) {
          ecbHumanTotal += b.evidence.humanStudies || 0;
          ecbAnimalTotal += b.evidence.animalStudies || 0;
          ecbCellTotal += b.evidence.cellStudies || 0;
          if (b.evidence.keyFindings) {
            ecbFindings.push(...b.evidence.keyFindings);
          }
        }
      }
    }

    // Count PMIDs and DOIs from ECB keyFindings
    const pmids = ecbFindings.filter(f => f.pmid).map(f => f.pmid);
    const uniquePmids = [...new Set(pmids)];

    const suggested = suggestEvidenceLevel(slug, sources, ecbHumanTotal, ecbAnimalTotal, ecbCellTotal);

    const entry = {
      slug,
      name,
      file,
      currentEvidenceStrength: currentLevel,
      suggestedEvidenceStrength: suggested,
      mismatch: currentLevel !== suggested,
      sources,
      ecbCounts: {
        human: ecbHumanTotal,
        animal: ecbAnimalTotal,
        cell: ecbCellTotal,
      },
      uniquePmids: uniquePmids.length,
      category: fm.category || 'unknown',
    };

    report.peptides[slug] = entry;
    report.summary[currentLevel] = (report.summary[currentLevel] || 0) + 1;

    if (entry.mismatch) {
      report.flagged.push({
        slug,
        name,
        file,
        current: currentLevel,
        suggested,
        reason: buildReason(slug, sources, ecbHumanTotal, currentLevel, suggested),
      });
    }
  }

  return report;
}

function buildReason(slug, sources, ecbHuman, current, suggested) {
  if (FDA_APPROVED.has(slug)) {
    return `FDA-approved compound should be "${suggested}" (currently "${current}")`;
  }
  if (PHASE_3_PLUS.has(slug)) {
    return `Phase 3+ trial data → "${suggested}" (currently "${current}")`;
  }
  const h = sources.human || 0;
  return `${h} human sources + ${ecbHuman} ECB human studies → "${suggested}" (currently "${current}")`;
}

function applyFixes(report) {
  let fixed = 0;
  for (const flag of report.flagged) {
    const filePath = join(PEPTIDES_DIR, flag.file);
    const raw = readFileSync(filePath, 'utf-8');
    const { data: fm, content } = matter(raw);

    fm.evidenceStrength = flag.suggested;
    const updated = matter.stringify(content, fm);
    writeFileSync(filePath, updated, 'utf-8');

    report.changelog.push({
      slug: flag.slug,
      name: flag.name,
      from: flag.current,
      to: flag.suggested,
      reason: flag.reason,
    });
    fixed++;
  }
  return fixed;
}

// --- Main ---
const doFix = process.argv.includes('--fix');

console.log('=== PepCodex Evidence Audit ===\n');
console.log(`Scanning ${PEPTIDES_DIR}...\n`);

const report = auditPeptides();

console.log(`Total dossiers: ${report.totalDossiers}`);
console.log(`Distribution: high=${report.summary.high}, moderate=${report.summary.moderate}, low=${report.summary.low}, very-low=${report.summary['very-low']}`);
console.log(`Flagged mismatches: ${report.flagged.length}\n`);

if (report.flagged.length > 0) {
  console.log('--- Flagged Items ---');
  for (const f of report.flagged) {
    console.log(`  ${f.name} (${f.slug}): ${f.current} → ${f.suggested}`);
    console.log(`    Reason: ${f.reason}`);
  }
  console.log('');
}

if (doFix && report.flagged.length > 0) {
  const fixed = applyFixes(report);
  console.log(`Applied ${fixed} evidence level fixes.\n`);

  // Re-run to confirm
  const recheck = auditPeptides();
  console.log(`Post-fix mismatches: ${recheck.flagged.length}`);
  report.postFixMismatches = recheck.flagged.length;
}

writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2), 'utf-8');
console.log(`Report written to: ${OUTPUT_PATH}`);
