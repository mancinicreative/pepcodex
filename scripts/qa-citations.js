#!/usr/bin/env node
/**
 * QA Citation Validator
 * Validates that all citations in MDX content exist in the source pack
 *
 * Usage: node scripts/qa-citations.js <mdx-file> <source-pack.json>
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Citation patterns to match in MDX content
const CITATION_PATTERNS = [
  /\[PMID:\s*(\d+)\]/gi,           // [PMID: 12345678] or [PMID:12345678]
  /\[DOI:\s*([^\]]+)\]/gi,          // [DOI: 10.xxxx/xxxx]
  /\[NCT(\d+)\]/gi,                 // [NCT12345678]
  /\[NCT:\s*(\d+)\]/gi,             // [NCT: 12345678]
  /PMID:\s*(\d+)/g,                 // Inline PMID: 12345678
];

/**
 * Extract all citation references from MDX content
 * @param {string} mdxContent - The MDX content to parse
 * @returns {Set<string>} - Set of normalized citation IDs
 */
function extractCitations(mdxContent) {
  const citations = new Set();

  // Strip frontmatter
  const content = mdxContent.replace(/^---[\s\S]*?---\n?/, '');

  // PMID patterns
  const pmidPattern = /\[?PMID:?\s*(\d+)\]?/gi;
  let match;
  while ((match = pmidPattern.exec(content)) !== null) {
    citations.add(`PMID:${match[1]}`);
  }

  // DOI patterns
  const doiPattern = /\[DOI:\s*([^\]]+)\]/gi;
  while ((match = doiPattern.exec(content)) !== null) {
    citations.add(`DOI:${match[1].trim()}`);
  }

  // NCT patterns (clinical trials)
  const nctPattern = /\[?NCT:?\s*(\d+)\]?/gi;
  while ((match = nctPattern.exec(content)) !== null) {
    citations.add(`NCT${match[1]}`);
  }

  return citations;
}

/**
 * Extract all source IDs from source pack
 * @param {object} sourcePack - Parsed source pack object
 * @returns {Set<string>} - Set of source IDs
 */
function extractSourcePackIds(sourcePack) {
  const ids = new Set();

  // Add source IDs
  if (sourcePack.sources && Array.isArray(sourcePack.sources)) {
    for (const source of sourcePack.sources) {
      if (source.id) {
        ids.add(source.id);
      }
    }
  }

  // Add trial NCT IDs
  if (sourcePack.trials && Array.isArray(sourcePack.trials)) {
    for (const trial of sourcePack.trials) {
      if (trial.nctId) {
        ids.add(trial.nctId);
      }
    }
  }

  return ids;
}

/**
 * Normalize citation ID for comparison
 * @param {string} id - Citation ID to normalize
 * @returns {string} - Normalized ID
 */
function normalizeId(id) {
  // Remove spaces and normalize case
  return id.replace(/\s+/g, '').toUpperCase();
}

/**
 * Validate citations in MDX against source pack
 * @param {string} mdxContent - The MDX content
 * @param {string} sourcePackPath - Path to the source pack JSON
 * @returns {{passed: boolean, found: Array, missing: Array, unused: Array}}
 */
export function validateCitations(mdxContent, sourcePackPath) {
  // Load source pack
  let sourcePack;
  try {
    const content = readFileSync(sourcePackPath, 'utf-8');
    sourcePack = JSON.parse(content);
  } catch (err) {
    return {
      passed: false,
      error: `Failed to load source pack: ${err.message}`,
      found: [],
      missing: [],
      unused: []
    };
  }

  // Extract citations from both sources
  const mdxCitations = extractCitations(mdxContent);
  const sourcePackIds = extractSourcePackIds(sourcePack);

  // Create normalized maps for comparison
  const normalizedSourcePack = new Map();
  for (const id of sourcePackIds) {
    normalizedSourcePack.set(normalizeId(id), id);
  }

  const found = [];
  const missing = [];

  // Check each MDX citation against source pack
  for (const citation of mdxCitations) {
    const normalized = normalizeId(citation);
    if (normalizedSourcePack.has(normalized)) {
      found.push(citation);
    } else {
      missing.push(citation);
    }
  }

  // Find unused source pack entries (informational only)
  const normalizedMdx = new Set([...mdxCitations].map(normalizeId));
  const unused = [];
  for (const id of sourcePackIds) {
    if (!normalizedMdx.has(normalizeId(id))) {
      unused.push(id);
    }
  }

  return {
    passed: missing.length === 0,
    found,
    missing,
    unused
  };
}

/**
 * Pretty print validation results
 * @param {object} result - Validation result object
 * @param {string} mdxPath - Path to the MDX file
 * @param {string} packPath - Path to the source pack
 */
function printResults(result, mdxPath, packPath) {
  console.log('\n' + '='.repeat(60));
  console.log(`Citation Validation: ${mdxPath}`);
  console.log(`Source Pack: ${packPath}`);
  console.log('='.repeat(60) + '\n');

  if (result.error) {
    console.log(`[ERROR] ${result.error}\n`);
    return;
  }

  if (result.passed) {
    console.log('[PASS] All citations found in source pack!\n');
  } else {
    console.log('[FAIL] Some citations missing from source pack!\n');
  }

  console.log(`Citations in MDX: ${result.found.length + result.missing.length}`);
  console.log(`  Found in source pack: ${result.found.length}`);
  console.log(`  Missing from source pack: ${result.missing.length}`);
  console.log(`  Unused in source pack: ${result.unused.length} (info only)\n`);

  if (result.found.length > 0) {
    console.log('Found citations:');
    for (const c of result.found) {
      console.log(`  [OK] ${c}`);
    }
    console.log('');
  }

  if (result.missing.length > 0) {
    console.log('MISSING citations (add to source pack):');
    for (const c of result.missing) {
      console.log(`  [MISSING] ${c}`);
    }
    console.log('');
  }

  if (result.unused.length > 0) {
    console.log('Unused sources (info only, may be used in future):');
    for (const c of result.unused.slice(0, 10)) {
      console.log(`  [UNUSED] ${c}`);
    }
    if (result.unused.length > 10) {
      console.log(`  ... and ${result.unused.length - 10} more`);
    }
    console.log('');
  }
}

// CLI execution
if (process.argv[1] && process.argv[1].includes('qa-citations')) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node scripts/qa-citations.js <mdx-file> <source-pack.json>');
    process.exit(1);
  }

  const mdxPath = resolve(process.cwd(), args[0]);
  const packPath = resolve(process.cwd(), args[1]);

  let mdxContent;
  try {
    mdxContent = readFileSync(mdxPath, 'utf-8');
  } catch (err) {
    console.error(`Error reading MDX file: ${err.message}`);
    process.exit(1);
  }

  const result = validateCitations(mdxContent, packPath);
  printResults(result, args[0], args[1]);

  process.exit(result.passed ? 0 : 1);
}
