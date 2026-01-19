#!/usr/bin/env node
/**
 * QA Banned Content Scanner
 * Scans MDX content for banned patterns (dosing, sourcing, administration)
 * and overclaim patterns (proven, guaranteed, cures)
 *
 * Usage: node scripts/qa-banned-content.js <mdx-file>
 *        echo "content" | node scripts/qa-banned-content.js --stdin
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// BANNED PATTERNS - These BLOCK QA (hard fail)
const BANNED_PATTERNS = [
  {
    name: 'dosing-terminology',
    pattern: /\b(inject(ion)?s?|dose|dosing|dosage|protocol|cycle|stack(ing)?)\b/gi,
    description: 'Dosing/protocol terminology'
  },
  {
    name: 'sourcing-language',
    pattern: /\b(buy|purchase|vendor|supplier|where to (get|buy))\b/gi,
    description: 'Sourcing/purchasing language'
  },
  {
    name: 'sourcing-instructions',
    pattern: /\b(source|sourcing)\s+(peptide|compound|from|at)\b/gi,
    description: 'Peptide sourcing instructions'
  },
  {
    name: 'administration-instructions',
    pattern: /\b(how to (use|take|administer|inject))\b/gi,
    description: 'Administration instructions'
  },
  {
    name: 'specific-doses',
    pattern: /\d+\s*(mg|mcg|iu|units?)\s*(per|daily|weekly|twice|once)/gi,
    description: 'Specific dosing regimens'
  },
  {
    name: 'injection-routes',
    pattern: /\b(subcutaneous(ly)?|intramuscular(ly)?|iv|intravenous(ly)?)\s+(inject|admin)/gi,
    description: 'Injection route instructions'
  }
];

// OVERCLAIM PATTERNS - These WARN (soft fail, flagged for review)
const OVERCLAIM_PATTERNS = [
  {
    name: 'certainty-claims',
    pattern: /\b(proven|guaranteed|cures?|definite(ly)?)\b/gi,
    description: 'Unqualified certainty claims'
  },
  {
    name: 'extreme-claims',
    pattern: /\b(100%|always works?|miracle|amazing results?)\b/gi,
    description: 'Extreme efficacy claims'
  },
  {
    name: 'safety-overclaims',
    pattern: /\b(safe for everyone|no side effects?|completely safe)\b/gi,
    description: 'Overstated safety claims'
  }
];

/**
 * Find all matches of a pattern in content with line numbers
 * @param {string} content - The text content to search
 * @param {RegExp} pattern - The regex pattern to match
 * @returns {Array} - Array of matches with line numbers
 */
function findMatches(content, pattern) {
  const lines = content.split('\n');
  const matches = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0;
    let match;

    while ((match = pattern.exec(line)) !== null) {
      matches.push({
        text: match[0],
        line: i + 1,
        context: line.trim().substring(0, 100)
      });
    }
  }

  return matches;
}

/**
 * Scan MDX content for banned and overclaim patterns
 * @param {string} mdxContent - The MDX content to scan
 * @returns {{passed: boolean, banned: Array, warnings: Array}}
 */
export function scanBannedContent(mdxContent) {
  const banned = [];
  const warnings = [];

  // Strip frontmatter before scanning
  const contentWithoutFrontmatter = mdxContent.replace(/^---[\s\S]*?---\n?/, '');

  // Check banned patterns
  for (const { name, pattern, description } of BANNED_PATTERNS) {
    const matches = findMatches(contentWithoutFrontmatter, pattern);
    if (matches.length > 0) {
      banned.push({
        pattern: name,
        description,
        matches: matches.map(m => m.text),
        locations: matches.map(m => ({ line: m.line, context: m.context }))
      });
    }
  }

  // Check overclaim patterns
  for (const { name, pattern, description } of OVERCLAIM_PATTERNS) {
    const matches = findMatches(contentWithoutFrontmatter, pattern);
    if (matches.length > 0) {
      warnings.push({
        pattern: name,
        description,
        matches: matches.map(m => m.text),
        locations: matches.map(m => ({ line: m.line, context: m.context }))
      });
    }
  }

  return {
    passed: banned.length === 0,
    banned,
    warnings
  };
}

/**
 * Pretty print scan results
 * @param {object} result - Scan result object
 * @param {string} filePath - Path to the scanned file
 */
function printResults(result, filePath) {
  console.log('\n' + '='.repeat(60));
  console.log(`Banned Content Scan: ${filePath}`);
  console.log('='.repeat(60) + '\n');

  if (result.passed && result.warnings.length === 0) {
    console.log('[PASS] No banned content or overclaims detected!\n');
    return;
  }

  if (result.banned.length > 0) {
    console.log('[FAIL] BANNED CONTENT DETECTED:\n');
    for (const issue of result.banned) {
      console.log(`  Pattern: ${issue.pattern}`);
      console.log(`  Description: ${issue.description}`);
      console.log(`  Matches: ${issue.matches.join(', ')}`);
      console.log('  Locations:');
      for (const loc of issue.locations) {
        console.log(`    Line ${loc.line}: "${loc.context}..."`);
      }
      console.log('');
    }
  }

  if (result.warnings.length > 0) {
    console.log('[WARN] OVERCLAIMS DETECTED (review required):\n');
    for (const issue of result.warnings) {
      console.log(`  Pattern: ${issue.pattern}`);
      console.log(`  Description: ${issue.description}`);
      console.log(`  Matches: ${issue.matches.join(', ')}`);
      console.log('  Locations:');
      for (const loc of issue.locations) {
        console.log(`    Line ${loc.line}: "${loc.context}..."`);
      }
      console.log('');
    }
  }

  const status = result.passed ? '[PASS with warnings]' : '[FAIL]';
  console.log(`Overall: ${status}`);
  console.log(`  Banned violations: ${result.banned.length}`);
  console.log(`  Overclaim warnings: ${result.warnings.length}\n`);
}

// CLI execution
if (process.argv[1] && process.argv[1].includes('qa-banned-content')) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node scripts/qa-banned-content.js <mdx-file>');
    console.error('       echo "content" | node scripts/qa-banned-content.js --stdin');
    process.exit(1);
  }

  let content;
  let filePath;

  if (args[0] === '--stdin') {
    // Read from stdin
    content = readFileSync(0, 'utf-8');
    filePath = 'stdin';
  } else {
    filePath = resolve(process.cwd(), args[0]);
    try {
      content = readFileSync(filePath, 'utf-8');
    } catch (err) {
      console.error(`Error reading file: ${err.message}`);
      process.exit(1);
    }
  }

  const result = scanBannedContent(content);
  printResults(result, filePath);

  // Exit with code based on banned content (warnings don't fail)
  process.exit(result.passed ? 0 : 1);
}
