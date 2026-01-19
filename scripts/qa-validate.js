#!/usr/bin/env node
/**
 * QA Validation Orchestrator
 * Runs all QA validation scripts and produces a unified report
 *
 * Usage: node scripts/qa-validate.js <mdx-file> <source-pack.json>
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Import QA modules
import { scanBannedContent } from './qa-banned-content.js';
import { validateCitations } from './qa-citations.js';
import { checkEvidenceLabels } from './qa-evidence-labels.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Run all QA validations on an MDX file
 * @param {string} mdxPath - Path to the MDX file
 * @param {string} sourcePackPath - Path to the source pack JSON
 * @returns {object} - Unified QA report
 */
export function runQA(mdxPath, sourcePackPath) {
  const absoluteMdxPath = resolve(process.cwd(), mdxPath);
  const absolutePackPath = resolve(process.cwd(), sourcePackPath);

  // Read MDX content
  let mdxContent;
  try {
    mdxContent = readFileSync(absoluteMdxPath, 'utf-8');
  } catch (err) {
    return {
      passed: false,
      error: `Failed to read MDX file: ${err.message}`,
      mdxFile: mdxPath,
      sourcePackFile: sourcePackPath,
      checks: {},
      summary: { errors: 1, warnings: 0 }
    };
  }

  // Run all QA checks
  const bannedContent = scanBannedContent(mdxContent);
  const citations = validateCitations(mdxContent, absolutePackPath);
  const evidenceLabels = checkEvidenceLabels(mdxContent, absolutePackPath);

  // Aggregate results
  const passed = bannedContent.passed && citations.passed && evidenceLabels.passed;

  // Count errors and warnings
  let errors = 0;
  let warnings = 0;

  // Banned content violations are errors
  errors += bannedContent.banned.length;
  // Overclaims are warnings
  warnings += bannedContent.warnings.length;

  // Missing citations are errors
  errors += citations.missing ? citations.missing.length : 0;

  // Evidence labeling issues are errors
  errors += evidenceLabels.issues ? evidenceLabels.issues.length : 0;

  return {
    passed,
    mdxFile: mdxPath,
    sourcePackFile: sourcePackPath,
    checks: {
      bannedContent: {
        passed: bannedContent.passed,
        banned: bannedContent.banned,
        warnings: bannedContent.warnings
      },
      citations: {
        passed: citations.passed,
        found: citations.found || [],
        missing: citations.missing || [],
        unused: citations.unused || [],
        error: citations.error
      },
      evidenceLabels: {
        passed: evidenceLabels.passed,
        issues: evidenceLabels.issues || [],
        stats: evidenceLabels.stats,
        error: evidenceLabels.error
      }
    },
    summary: {
      errors,
      warnings
    }
  };
}

/**
 * Format check status for output
 * @param {boolean} passed - Whether the check passed
 * @returns {string} - Formatted status string
 */
function formatStatus(passed) {
  return passed ? '[PASS]' : '[FAIL]';
}

/**
 * Pretty print QA report
 * @param {object} report - QA report object
 */
function printReport(report) {
  const divider = '='.repeat(60);

  console.log('\n' + divider);
  console.log(`QA Report: ${report.mdxFile}`);
  console.log(`Source Pack: ${report.sourcePackFile}`);
  console.log(divider + '\n');

  if (report.error) {
    console.log(`[ERROR] ${report.error}\n`);
    return;
  }

  // Banned Content Check
  const bc = report.checks.bannedContent;
  console.log(`${formatStatus(bc.passed)} Banned Content: ${bc.banned.length} violations, ${bc.warnings.length} warnings`);
  if (bc.banned.length > 0) {
    for (const issue of bc.banned) {
      console.log(`       - ${issue.pattern}: ${issue.matches.slice(0, 5).join(', ')}${issue.matches.length > 5 ? '...' : ''}`);
    }
  }
  if (bc.warnings.length > 0) {
    for (const warn of bc.warnings) {
      console.log(`       - (warn) ${warn.pattern}: ${warn.matches.slice(0, 5).join(', ')}`);
    }
  }

  // Citations Check
  const cit = report.checks.citations;
  if (cit.error) {
    console.log(`[ERROR] Citations: ${cit.error}`);
  } else {
    console.log(`${formatStatus(cit.passed)} Citations: ${cit.found.length} found, ${cit.missing.length} missing`);
    if (cit.missing.length > 0) {
      console.log(`       - Missing: ${cit.missing.join(', ')}`);
    }
  }

  // Evidence Labels Check
  const ev = report.checks.evidenceLabels;
  if (ev.error) {
    console.log(`[ERROR] Evidence Labels: ${ev.error}`);
  } else {
    console.log(`${formatStatus(ev.passed)} Evidence Labels: ${ev.issues.length} issues`);
    if (ev.issues.length > 0) {
      for (const issue of ev.issues.slice(0, 3)) {
        console.log(`       - ${issue.sourceId}: ${issue.missingLabel}`);
      }
      if (ev.issues.length > 3) {
        console.log(`       ... and ${ev.issues.length - 3} more`);
      }
    }
  }

  console.log('');
  console.log('-'.repeat(60));

  // Overall result
  const overallStatus = report.passed ? 'PASSED' : 'FAILED';
  console.log(`\nOverall: ${overallStatus}`);
  console.log(`  Errors: ${report.summary.errors}`);
  console.log(`  Warnings: ${report.summary.warnings}`);
  console.log('');

  // Output JSON report path hint
  if (!report.passed) {
    console.log('Run with --json flag for machine-readable output.\n');
  }
}

/**
 * Output JSON report
 * @param {object} report - QA report object
 */
function printJsonReport(report) {
  console.log(JSON.stringify(report, null, 2));
}

// CLI execution
if (process.argv[1] && process.argv[1].includes('qa-validate')) {
  const args = process.argv.slice(2);

  // Check for --json flag
  const jsonOutput = args.includes('--json');
  const filteredArgs = args.filter(a => a !== '--json');

  if (filteredArgs.length < 2) {
    console.error('Usage: node scripts/qa-validate.js <mdx-file> <source-pack.json> [--json]');
    console.error('');
    console.error('Options:');
    console.error('  --json    Output results as JSON');
    process.exit(1);
  }

  const mdxPath = filteredArgs[0];
  const packPath = filteredArgs[1];

  const report = runQA(mdxPath, packPath);

  if (jsonOutput) {
    printJsonReport(report);
  } else {
    printReport(report);
  }

  process.exit(report.passed ? 0 : 1);
}
