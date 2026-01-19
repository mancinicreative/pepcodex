#!/usr/bin/env node
/**
 * QA Evidence Labels Checker
 * Ensures preclinical evidence (animal/in-vitro studies) is properly labeled
 *
 * Usage: node scripts/qa-evidence-labels.js <mdx-file> <source-pack.json>
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Labels that indicate animal study context
const ANIMAL_LABELS = [
  /\bin (mice|rats?|rodents?|monkeys?|primates?|animals?)\b/i,
  /\b(mouse|rat|rodent|monkey|primate|animal)\s+(model|study|studies|data|experiment)/i,
  /\bpreclinical\b/i,
  /\bin vivo\b/i,
  /\b(murine|canine|porcine|bovine)\b/i,
];

// Labels that indicate in-vitro study context
const INVITRO_LABELS = [
  /\bin vitro\b/i,
  /\bcell (culture|line|lines)\b/i,
  /\b(cultured|isolated) cells?\b/i,
  /\blaboratory (study|studies|setting)\b/i,
  /\btest tube\b/i,
];

/**
 * Extract preclinical sources from source pack
 * @param {object} sourcePack - Parsed source pack
 * @returns {{animal: Array, inVitro: Array}}
 */
function getPreclinicalSources(sourcePack) {
  const animal = [];
  const inVitro = [];

  if (!sourcePack.sources || !Array.isArray(sourcePack.sources)) {
    return { animal, inVitro };
  }

  for (const source of sourcePack.sources) {
    if (source.subjects === 'animal') {
      animal.push(source);
    } else if (source.subjects === 'in-vitro') {
      inVitro.push(source);
    }
  }

  return { animal, inVitro };
}

/**
 * Find context around a citation in content
 * @param {string} content - MDX content
 * @param {string} sourceId - Source ID to find
 * @returns {Array} - Array of context objects
 */
function findCitationContexts(content, sourceId) {
  const contexts = [];
  const lines = content.split('\n');

  // Extract the numeric part for matching
  const idMatch = sourceId.match(/PMID:(\d+)|DOI:(.+)|NCT(\d+)/i);
  if (!idMatch) return contexts;

  const searchPatterns = [
    new RegExp(`\\[?PMID:?\\s*${idMatch[1]}\\]?`, 'gi'),
    new RegExp(`\\[?DOI:?\\s*${idMatch[2]}\\]?`, 'gi'),
    new RegExp(`\\[?NCT:?\\s*${idMatch[3]}\\]?`, 'gi'),
  ].filter((p, i) => idMatch[i + 1]); // Only use patterns that have a match

  for (let i = 0; i < lines.length; i++) {
    for (const pattern of searchPatterns) {
      if (pattern.test(lines[i])) {
        // Get surrounding context (2 lines before and after)
        const start = Math.max(0, i - 2);
        const end = Math.min(lines.length, i + 3);
        const context = lines.slice(start, end).join(' ').trim();

        contexts.push({
          line: i + 1,
          context: context.substring(0, 300)
        });
      }
    }
  }

  return contexts;
}

/**
 * Check if context contains appropriate labels
 * @param {string} context - Text context around citation
 * @param {string} subjectType - 'animal' or 'in-vitro'
 * @returns {boolean}
 */
function hasAppropriateLabel(context, subjectType) {
  const labels = subjectType === 'animal' ? ANIMAL_LABELS : INVITRO_LABELS;

  for (const pattern of labels) {
    if (pattern.test(context)) {
      return true;
    }
  }

  return false;
}

/**
 * Check evidence labels in MDX content
 * @param {string} mdxContent - The MDX content
 * @param {string} sourcePackPath - Path to the source pack JSON
 * @returns {{passed: boolean, issues: Array}}
 */
export function checkEvidenceLabels(mdxContent, sourcePackPath) {
  // Load source pack
  let sourcePack;
  try {
    const content = readFileSync(sourcePackPath, 'utf-8');
    sourcePack = JSON.parse(content);
  } catch (err) {
    return {
      passed: false,
      error: `Failed to load source pack: ${err.message}`,
      issues: []
    };
  }

  // Strip frontmatter
  const contentBody = mdxContent.replace(/^---[\s\S]*?---\n?/, '');

  // Get preclinical sources
  const { animal, inVitro } = getPreclinicalSources(sourcePack);
  const issues = [];

  // Check animal study citations
  for (const source of animal) {
    const contexts = findCitationContexts(contentBody, source.id);

    for (const ctx of contexts) {
      if (!hasAppropriateLabel(ctx.context, 'animal')) {
        issues.push({
          sourceId: source.id,
          subjects: 'animal',
          title: source.title,
          line: ctx.line,
          context: ctx.context,
          missingLabel: 'Animal study indicator (e.g., "in mice", "preclinical", "animal model")'
        });
      }
    }
  }

  // Check in-vitro study citations
  for (const source of inVitro) {
    const contexts = findCitationContexts(contentBody, source.id);

    for (const ctx of contexts) {
      if (!hasAppropriateLabel(ctx.context, 'in-vitro')) {
        issues.push({
          sourceId: source.id,
          subjects: 'in-vitro',
          title: source.title,
          line: ctx.line,
          context: ctx.context,
          missingLabel: 'In-vitro study indicator (e.g., "in vitro", "cell culture")'
        });
      }
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    stats: {
      animalSources: animal.length,
      inVitroSources: inVitro.length,
      issuesFound: issues.length
    }
  };
}

/**
 * Pretty print check results
 * @param {object} result - Check result object
 * @param {string} mdxPath - Path to the MDX file
 * @param {string} packPath - Path to the source pack
 */
function printResults(result, mdxPath, packPath) {
  console.log('\n' + '='.repeat(60));
  console.log(`Evidence Labels Check: ${mdxPath}`);
  console.log(`Source Pack: ${packPath}`);
  console.log('='.repeat(60) + '\n');

  if (result.error) {
    console.log(`[ERROR] ${result.error}\n`);
    return;
  }

  if (result.passed) {
    console.log('[PASS] All preclinical evidence is properly labeled!\n');
  } else {
    console.log('[FAIL] Some preclinical evidence lacks proper labels!\n');
  }

  if (result.stats) {
    console.log('Source Pack Stats:');
    console.log(`  Animal studies: ${result.stats.animalSources}`);
    console.log(`  In-vitro studies: ${result.stats.inVitroSources}`);
    console.log(`  Labeling issues: ${result.stats.issuesFound}\n`);
  }

  if (result.issues.length > 0) {
    console.log('Labeling Issues:');
    for (const issue of result.issues) {
      console.log(`\n  Source: ${issue.sourceId}`);
      console.log(`  Type: ${issue.subjects} study`);
      console.log(`  Line: ${issue.line}`);
      console.log(`  Missing: ${issue.missingLabel}`);
      console.log(`  Context: "${issue.context.substring(0, 150)}..."`);
    }
    console.log('');
  }
}

// CLI execution
if (process.argv[1] && process.argv[1].includes('qa-evidence-labels')) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node scripts/qa-evidence-labels.js <mdx-file> <source-pack.json>');
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

  const result = checkEvidenceLabels(mdxContent, packPath);
  printResults(result, args[0], args[1]);

  process.exit(result.passed ? 0 : 1);
}
