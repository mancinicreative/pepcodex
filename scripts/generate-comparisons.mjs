#!/usr/bin/env node
/**
 * Generate Comparison MDX Files
 *
 * Reads peptide dossier frontmatter, determines valid comparison pairs,
 * and generates MDX comparison files with factual content derived from dossier data.
 *
 * Usage:
 *   node scripts/generate-comparisons.mjs              # Generate all new comparisons (up to 180)
 *   node scripts/generate-comparisons.mjs --dry-run    # Print what would be generated
 *   node scripts/generate-comparisons.mjs --limit 10   # Generate at most 10 comparisons
 *   node scripts/generate-comparisons.mjs --dry-run --limit 5
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import matter from 'gray-matter';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ROOT = resolve(import.meta.dirname, '..');
const PEPTIDES_DIR = join(ROOT, 'src', 'content', 'peptides');
const COMPARISONS_DIR = join(ROOT, 'src', 'content', 'comparisons');

const MAX_DEFAULT = 180;

const ONCOLOGY_EXCLUSIONS = new Set([
  'bt5528',
  'evx-01',
  'sulanemadlin',
  'murepavadin',
  '225ac-dota-lm3',
  'zelenectide-pevedotin',
  'mrna-4157',
]);

const EVIDENCE_LABELS = {
  'high': 'High',
  'moderate': 'Moderate',
  'low': 'Low',
  'very-low': 'Very Low',
};

const CATEGORY_LABELS = {
  'metabolic': 'Metabolic',
  'repair-recovery': 'Repair & Recovery',
  'hormonal': 'Hormonal',
  'longevity': 'Longevity',
  'cognitive': 'Cognitive',
  'immune': 'Immune',
  'other': 'Other',
};

// Related category pairs (bidirectional) for cross-category priority
const RELATED_CATEGORIES = [
  ['metabolic', 'hormonal'],
  ['repair-recovery', 'immune'],
];

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

let limit = MAX_DEFAULT;
const limitIdx = args.indexOf('--limit');
if (limitIdx !== -1 && args[limitIdx + 1]) {
  limit = parseInt(args[limitIdx + 1], 10);
  if (isNaN(limit) || limit < 1) {
    console.error('Error: --limit must be a positive integer.');
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Data loading
// ---------------------------------------------------------------------------

/** Load all peptide dossier frontmatter into a Map<slug, data>. */
function loadPeptides() {
  const map = new Map();
  const files = readdirSync(PEPTIDES_DIR).filter(f => f.endsWith('.mdx'));

  for (const file of files) {
    const raw = readFileSync(join(PEPTIDES_DIR, file), 'utf-8');
    const { data: fm } = matter(raw);
    const slug = file.replace('.mdx', '');
    map.set(slug, {
      slug,
      name: fm.name || slug,
      aliases: fm.aliases || [],
      category: fm.category || 'other',
      evidenceStrength: fm.evidenceStrength || 'very-low',
      comparators: fm.comparators || [],
      summary: fm.summary || '',
      sources: fm.sources || { count: 0, human: 0, preclinical: 0, openAccess: 0 },
      interactions: fm.interactions || [],
    });
  }

  return map;
}

/** Load existing comparison slugs into a Set. */
function loadExistingComparisons() {
  const set = new Set();
  if (!existsSync(COMPARISONS_DIR)) return set;

  const files = readdirSync(COMPARISONS_DIR).filter(f => f.endsWith('.mdx'));
  for (const file of files) {
    set.add(file.replace('.mdx', ''));
  }
  return set;
}

// ---------------------------------------------------------------------------
// Pair generation
// ---------------------------------------------------------------------------

/** Create a canonical slug for a pair (alphabetical order). */
function pairSlug(a, b) {
  return [a, b].sort().join('-vs-');
}

/** Check if two categories are related. */
function areCategoriesRelated(catA, catB) {
  return RELATED_CATEGORIES.some(
    ([x, y]) => (x === catA && y === catB) || (x === catB && y === catA)
  );
}

/**
 * Generate prioritized pairs from peptide data.
 * Returns an array of { slugA, slugB, priority } objects, deduplicated.
 */
function generatePairs(peptides) {
  const compareWorthy = new Map();
  for (const [slug, data] of peptides) {
    if (!ONCOLOGY_EXCLUSIONS.has(slug)) {
      compareWorthy.set(slug, data);
    }
  }

  const seen = new Set();
  const pairs = [];

  function addPair(slugA, slugB, priority) {
    const canonical = pairSlug(slugA, slugB);
    if (seen.has(canonical)) return;
    seen.add(canonical);
    // Ensure both peptides exist and are compare-worthy
    if (!compareWorthy.has(slugA) || !compareWorthy.has(slugB)) return;
    if (slugA === slugB) return;
    pairs.push({ slug: canonical, slugA, slugB, priority });
  }

  // Priority 1: Explicit comparators from dossier frontmatter
  for (const [slug, data] of compareWorthy) {
    for (const comp of data.comparators) {
      if (compareWorthy.has(comp)) {
        addPair(slug, comp, 1);
      }
    }
  }

  // Priority 2: Same-category pairs
  const byCategory = new Map();
  for (const [slug, data] of compareWorthy) {
    if (!byCategory.has(data.category)) byCategory.set(data.category, []);
    byCategory.get(data.category).push(slug);
  }
  for (const [, slugs] of byCategory) {
    for (let i = 0; i < slugs.length; i++) {
      for (let j = i + 1; j < slugs.length; j++) {
        addPair(slugs[i], slugs[j], 2);
      }
    }
  }

  // Priority 3: Cross-category pairs where categories are related
  const categoryEntries = [...byCategory.entries()];
  for (let i = 0; i < categoryEntries.length; i++) {
    for (let j = i + 1; j < categoryEntries.length; j++) {
      const [catA, slugsA] = categoryEntries[i];
      const [catB, slugsB] = categoryEntries[j];
      if (areCategoriesRelated(catA, catB)) {
        for (const a of slugsA) {
          for (const b of slugsB) {
            addPair(a, b, 3);
          }
        }
      }
    }
  }

  // Sort by priority
  pairs.sort((a, b) => a.priority - b.priority);

  return pairs;
}

// ---------------------------------------------------------------------------
// MDX content generation
// ---------------------------------------------------------------------------

/** Find interaction data between two peptides (if it exists in either dossier). */
function findInteraction(pepA, pepB) {
  const fromA = pepA.interactions.find(i => i.peptide === pepB.slug);
  const fromB = pepB.interactions.find(i => i.peptide === pepA.slug);
  return fromA || fromB || null;
}

/** Build a short intro sentence from summaries. */
function buildOverview(pepA, pepB) {
  // Extract first sentence from each summary
  const firstSentence = (s) => {
    const match = s.match(/^[^.]+\./);
    return match ? match[0].trim() : s.trim();
  };

  const introA = firstSentence(pepA.summary);
  const introB = firstSentence(pepB.summary);

  return [
    `${pepA.name} and ${pepB.name} are both studied in the peptide research space.`,
    '',
    `**${pepA.name}:** ${introA}`,
    '',
    `**${pepB.name}:** ${introB}`,
  ].join('\n');
}

/** Build the evidence comparison table. */
function buildEvidenceTable(pepA, pepB) {
  const labelA = EVIDENCE_LABELS[pepA.evidenceStrength] || pepA.evidenceStrength;
  const labelB = EVIDENCE_LABELS[pepB.evidenceStrength] || pepB.evidenceStrength;

  return [
    `| Aspect | ${pepA.name} | ${pepB.name} |`,
    '|--------|' + '-'.repeat(pepA.name.length + 2) + '|' + '-'.repeat(pepB.name.length + 2) + '|',
    `| **Evidence Level** | ${labelA} | ${labelB} |`,
    `| **Human Studies** | ${pepA.sources.human} | ${pepB.sources.human} |`,
    `| **Preclinical Studies** | ${pepA.sources.preclinical} | ${pepB.sources.preclinical} |`,
    `| **Total Sources** | ${pepA.sources.count} | ${pepB.sources.count} |`,
  ].join('\n');
}

/** Build key differences table. */
function buildKeyDifferences(pepA, pepB) {
  const catLabelA = CATEGORY_LABELS[pepA.category] || pepA.category;
  const catLabelB = CATEGORY_LABELS[pepB.category] || pepB.category;

  const rows = [
    `| Aspect | ${pepA.name} | ${pepB.name} |`,
    '|--------|' + '-'.repeat(pepA.name.length + 2) + '|' + '-'.repeat(pepB.name.length + 2) + '|',
    `| **Category** | ${catLabelA} | ${catLabelB} |`,
    `| **Evidence Strength** | ${EVIDENCE_LABELS[pepA.evidenceStrength] || pepA.evidenceStrength} | ${EVIDENCE_LABELS[pepB.evidenceStrength] || pepB.evidenceStrength} |`,
    `| **Total Sources** | ${pepA.sources.count} | ${pepB.sources.count} |`,
    `| **Human Studies** | ${pepA.sources.human} | ${pepB.sources.human} |`,
  ];

  return rows.join('\n');
}

/** Build summary section with disclaimer. */
function buildSummary(pepA, pepB) {
  const labelA = EVIDENCE_LABELS[pepA.evidenceStrength] || pepA.evidenceStrength;
  const labelB = EVIDENCE_LABELS[pepB.evidenceStrength] || pepB.evidenceStrength;

  const lines = [
    `- **${pepA.name}:** ${labelA} evidence with ${pepA.sources.count} total sources (${pepA.sources.human} human)`,
    `- **${pepB.name}:** ${labelB} evidence with ${pepB.sources.count} total sources (${pepB.sources.human} human)`,
    '',
    '---',
    '',
    '*This comparison is for educational purposes only and is not medical advice. Consult a healthcare professional before making any decisions about peptide use.*',
  ];

  return lines.join('\n');
}

/** Determine the regulatory status description based on evidence level. */
function regulatoryDescription(pep) {
  if (pep.evidenceStrength === 'high') {
    return `${pep.name} has high-level clinical evidence, indicating FDA-approved or Phase 3 validated status`;
  }
  if (pep.evidenceStrength === 'moderate') {
    return `${pep.name} has moderate clinical evidence from human studies, though its regulatory status varies`;
  }
  return `${pep.name} has ${EVIDENCE_LABELS[pep.evidenceStrength] || pep.evidenceStrength} clinical evidence and is not FDA-approved for general use`;
}

/** Generate FAQ array for frontmatter. */
function generateFaqs(pepA, pepB) {
  const catLabelA = CATEGORY_LABELS[pepA.category] || pepA.category;
  const catLabelB = CATEGORY_LABELS[pepB.category] || pepB.category;
  const labelA = EVIDENCE_LABELS[pepA.evidenceStrength] || pepA.evidenceStrength;
  const labelB = EVIDENCE_LABELS[pepB.evidenceStrength] || pepB.evidenceStrength;

  const faqs = [];

  // FAQ 1: Main difference
  let diffAnswer;
  if (pepA.category === pepB.category) {
    diffAnswer = `Both ${pepA.name} and ${pepB.name} are categorized under ${catLabelA}, but they differ in evidence strength. ${pepA.name} has ${labelA} evidence (${pepA.sources.count} sources), while ${pepB.name} has ${labelB} evidence (${pepB.sources.count} sources).`;
  } else {
    diffAnswer = `${pepA.name} is a ${catLabelA} peptide while ${pepB.name} is a ${catLabelB} peptide. ${pepA.name} has ${labelA} evidence (${pepA.sources.count} sources) and ${pepB.name} has ${labelB} evidence (${pepB.sources.count} sources).`;
  }
  faqs.push({
    question: `What is the main difference between ${pepA.name} and ${pepB.name}?`,
    answer: diffAnswer,
  });

  // FAQ 2: Clinical evidence comparison
  let evidenceAnswer;
  if (pepA.sources.human > pepB.sources.human) {
    evidenceAnswer = `${pepA.name} has more clinical evidence with ${pepA.sources.human} human studies compared to ${pepB.sources.human} for ${pepB.name}. Overall, ${pepA.name} has ${labelA} evidence strength while ${pepB.name} has ${labelB}.`;
  } else if (pepB.sources.human > pepA.sources.human) {
    evidenceAnswer = `${pepB.name} has more clinical evidence with ${pepB.sources.human} human studies compared to ${pepA.sources.human} for ${pepA.name}. Overall, ${pepB.name} has ${labelB} evidence strength while ${pepA.name} has ${labelA}.`;
  } else {
    evidenceAnswer = `Both have similar numbers of human studies (${pepA.sources.human} each). ${pepA.name} has ${labelA} evidence strength and ${pepB.name} has ${labelB}.`;
  }
  faqs.push({
    question: `Which has more clinical evidence, ${pepA.name} or ${pepB.name}?`,
    answer: evidenceAnswer,
  });

  // FAQ 3: FDA approval
  const regA = regulatoryDescription(pepA);
  const regB = regulatoryDescription(pepB);
  faqs.push({
    question: `Are ${pepA.name} and ${pepB.name} FDA approved?`,
    answer: `${regA}. ${regB}. Always verify current regulatory status with official sources.`,
  });

  // FAQ 4: Combination
  const interaction = findInteraction(pepA, pepB);
  let comboAnswer;
  if (interaction) {
    const typeLabel = interaction.type === 'synergistic' ? 'potentially synergistic'
      : interaction.type === 'avoid' ? 'not recommended for combination'
      : interaction.type === 'caution' ? 'requiring caution if combined'
      : 'compatible';
    comboAnswer = `Based on available data, these peptides are considered ${typeLabel}. ${interaction.description} No combination has been validated in controlled human clinical trials.`;
  } else {
    comboAnswer = `There is no published research on combining ${pepA.name} and ${pepB.name}. The safety and efficacy of any combination is unknown without clinical data.`;
  }
  faqs.push({
    question: `Can ${pepA.name} and ${pepB.name} be combined?`,
    answer: comboAnswer,
  });

  return faqs;
}

/** Build the full MDX file content. */
function buildMdx(pepA, pepB, category) {
  const title = `${pepA.name} vs ${pepB.name}`;
  const slug = pairSlug(pepA.slug, pepB.slug);
  const today = new Date().toISOString().split('T')[0];

  const labelA = EVIDENCE_LABELS[pepA.evidenceStrength] || pepA.evidenceStrength;
  const labelB = EVIDENCE_LABELS[pepB.evidenceStrength] || pepB.evidenceStrength;

  const summary = `Comparison of ${pepA.name} (${labelA} evidence) and ${pepB.name} (${labelB} evidence).`;

  const faqs = generateFaqs(pepA, pepB);

  // Build frontmatter object
  const frontmatter = {
    title,
    peptideA: pepA.slug,
    peptideB: pepB.slug,
    category,
    lastUpdated: today,
    summary,
    metaTitle: `${title} Comparison | PepCodex`,
    metaDescription: `Compare ${pepA.name} and ${pepB.name}. Evidence levels, research data, and key differences.`,
    faqs,
  };

  // Build MDX body
  const body = [
    '',
    '## Overview',
    '',
    buildOverview(pepA, pepB),
    '',
    '## Evidence Comparison',
    '',
    buildEvidenceTable(pepA, pepB),
    '',
    '## Key Differences',
    '',
    buildKeyDifferences(pepA, pepB),
    '',
    '## Summary',
    '',
    buildSummary(pepA, pepB),
    '',
  ].join('\n');

  return matter.stringify(body, frontmatter);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log(`=== Generate Comparisons ${dryRun ? '(DRY RUN) ' : ''}===\n`);

// Load data
const peptides = loadPeptides();
console.log(`Loaded ${peptides.size} peptide dossiers.`);

const existingComparisons = loadExistingComparisons();
console.log(`Found ${existingComparisons.size} existing comparisons.\n`);

// Generate candidate pairs
const allPairs = generatePairs(peptides);
console.log(`Total candidate pairs: ${allPairs.length}`);

// Filter out existing comparisons
// Check both orderings since existing files may not be alphabetically ordered
const newPairs = allPairs.filter(pair => {
  const [a, b] = pair.slug.split('-vs-');
  const altSlug = `${b}-vs-${a}`;
  return !existingComparisons.has(pair.slug) && !existingComparisons.has(altSlug);
});

console.log(`New pairs (after excluding existing): ${newPairs.length}`);

const toGenerate = newPairs.slice(0, limit);
console.log(`Will generate: ${toGenerate.length} (limit: ${limit})\n`);

if (toGenerate.length === 0) {
  console.log('Nothing to generate. All valid pairs already have comparisons.');
  process.exit(0);
}

// Ensure output directory exists
if (!dryRun && !existsSync(COMPARISONS_DIR)) {
  mkdirSync(COMPARISONS_DIR, { recursive: true });
}

// Generate comparisons
const generated = [];
const priorityLabels = { 1: 'comparator', 2: 'same-category', 3: 'cross-category' };

for (const pair of toGenerate) {
  const [slugA, slugB] = pair.slug.split('-vs-');
  const pepA = peptides.get(slugA);
  const pepB = peptides.get(slugB);

  if (!pepA || !pepB) {
    console.warn(`  [SKIP] Missing dossier for pair: ${pair.slug}`);
    continue;
  }

  // Determine category: shared category wins, otherwise use pepA's
  const category = pepA.category === pepB.category ? pepA.category : pepA.category;

  const filename = `${pair.slug}.mdx`;
  const filePath = join(COMPARISONS_DIR, filename);

  if (dryRun) {
    console.log(`  [DRY] ${filename}  (${pepA.name} vs ${pepB.name})  [${priorityLabels[pair.priority]}]`);
  } else {
    const content = buildMdx(pepA, pepB, category);
    writeFileSync(filePath, content, 'utf-8');
    console.log(`  [NEW] ${filename}  (${pepA.name} vs ${pepB.name})  [${priorityLabels[pair.priority]}]`);
  }

  generated.push({
    slug: pair.slug,
    nameA: pepA.name,
    nameB: pepB.name,
    category,
    priority: priorityLabels[pair.priority],
  });
}

// Summary
console.log('\n=== Summary ===');
console.log(`Total generated: ${generated.length}`);

const byCat = {};
const byPri = {};
for (const g of generated) {
  byCat[g.category] = (byCat[g.category] || 0) + 1;
  byPri[g.priority] = (byPri[g.priority] || 0) + 1;
}

console.log('\nBy category:');
for (const [cat, count] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${CATEGORY_LABELS[cat] || cat}: ${count}`);
}

console.log('\nBy priority:');
for (const [pri, count] of Object.entries(byPri).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${pri}: ${count}`);
}

if (dryRun) {
  console.log('\n(Dry run — no files were written.)');
}
