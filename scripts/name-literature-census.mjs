/**
 * Census: for every dossier, does PubMed contain ANY paper that names the compound?
 *
 * This asks one narrow question per peptide and nothing else, so it is fast enough to run across
 * the whole site and blunt enough to be hard to argue with. The question is deliberately not "is
 * the evidence good" — it is "does the subject of this page appear in the literature at all".
 *
 * WHY IT IS NEEDED, given that every identifier on the site already verifies: identifier
 * verification proves a citation POINTS at a real paper. It cannot prove the paper is ABOUT the
 * thing being cited for. Five thin dossiers were found citing real, resolving, topically adjacent
 * Khavinson-school papers — "Peptides and Ageing", "Peptide Regulation of Gene Expression" — none
 * of which names the branded compound the page describes. One cited a clinical trial of cortexin,
 * a different compound entirely. Every citation gate on this site passes that content.
 *
 * A zero here does not by itself mean a page is wrong; some compounds are legitimately discussed
 * only under a sequence name. It means the page cannot be sourced under its own title and needs a
 * human decision. That is why this reports and never edits.
 *
 * Usage: node scripts/name-literature-census.mjs [--out <path>]
 */
import fs from 'fs';
import matter from 'gray-matter';
import { isDistinctive } from '../verification/matchers.mjs';
import { countPerAlias } from '../verification/pubmed.mjs';

const args = process.argv.slice(2);
const OUT = args.includes('--out') ? args[args.indexOf('--out') + 1] : '.planning/sourcing/NAME-LITERATURE-CENSUS.md';
const UA = { 'User-Agent': 'PepCodex-census/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MATCH_ALIASES = JSON.parse(fs.readFileSync('data/trial-match-aliases.json', 'utf-8'));

const ledger = JSON.parse(fs.readFileSync('verification/ledger.json', 'utf-8'));
const verifiedByFile = new Map();
for (const e of Object.values(ledger.entries)) {
  if (e.verdict !== 'exists') continue;
  for (const f of new Set((e.locations || []).map((l) => l.file))) {
    if (!verifiedByFile.has(f)) verifiedByFile.set(f, new Set());
    verifiedByFile.get(f).add(`${e.type}:${e.id}`);
  }
}

const rows = [];
const files = fs.readdirSync('src/content/peptides').filter((x) => x.endsWith('.mdx'));
console.log(`Census over ${files.length} dossiers — asking PubMed whether each name appears at all.\n`);

for (const f of files) {
  const slug = f.replace(/\.mdx$/, '');
  const d = matter(fs.readFileSync(`src/content/peptides/${f}`, 'utf-8')).data;
  const aliases = [...new Set([d.name, slug.replace(/-/g, ' '), ...(d.aliases || []), ...(MATCH_ALIASES[slug] || [])])]
    .filter(Boolean);
  /* Which aliases may answer "is this compound named at all"?
   *
   * Two exclusions, and both are load-bearing:
   *
   * 1. Generic phrases. "gastric peptide" matches thousands of papers about ghrelin and motilin.
   *
   * 2. SHORT aliases, however distinctive-looking. isRelevant can accept a short alias because it
   *    reads the abstract and demands a peptide-context word beside it. A bare count query has no
   *    abstract to read, so that safeguard does not exist here and the acronym collisions come
   *    straight back: querying "NASA" — an alias of N-Acetyl Selank Amidate — returned 28,692
   *    records about the space agency. Per-alias attribution is what made that visible; an ORed
   *    query would have reported the same number with no indication of where it came from.
   *
   * The floor is 6 characters, matching the strong-alias threshold in isRelevant. */
  const usable = aliases.filter((a) => isDistinctive(a) && String(a).length >= 6);
  const terms = usable.length ? usable : [d.name || slug];

  /* ONE ALIAS PER QUERY. Never OR them together.
   *
   * PubMed drops the quotation marks when a quoted phrase has no match and falls back to splitting
   * it into loose terms. Inside an OR that behaviour compounds catastrophically: six selank aliases
   * that each return 0, 0, 0, 2, 2 and 0 on their own returned 28,694 when ORed into a single query.
   * Nothing in the response says this happened — it is simply a large, confident, wrong number, and
   * it is the same mechanism behind the original "bronchogen" scan that came back with 60 papers on
   * OX40-OX40L signalling and phage-antibiotic synergy.
   *
   * Querying each alias alone costs more calls and removes the failure mode entirely: a per-alias
   * count cannot be inflated by its neighbours, and when one alias does degrade it is visible
   * instead of being smeared across the total. */
  const { perAlias, best, anyFailed } = await countPerAlias(terms);
  const count = !perAlias.length && anyFailed ? null : best.hits;

  const have = (verifiedByFile.get(`src/content/peptides/${f}`) || new Set()).size;
  rows.push({ slug, name: d.name || slug, hits: count, verified: have, terms: terms.length, perAlias, bestAlias: best.alias });
  const mark = count === null ? ' ??' : count === 0 ? '  0  <-- named nowhere in PubMed' : String(count).padStart(5);
  console.log(`  ${String(have).padStart(2)} cited  ${mark}  ${slug}${best.alias && best.alias !== (d.name || slug) ? `  (via "${best.alias}")` : ''}`);
}

const zero = rows.filter((r) => r.hits === 0);
const inconclusive = rows.filter((r) => r.hits === null);
const thin = rows.filter((r) => r.hits !== null && r.hits > 0 && r.hits < 5);

const md = [
  `# Name-literature census — ${new Date().toISOString().slice(0, 10)}`,
  '',
  'For each dossier: how many PubMed records name the compound, searching its distinctive aliases',
  'only. Generic descriptive aliases ("gastric peptide", "brain cytamin") are excluded, because they',
  'match large numbers of papers about entirely different compounds and would report coverage that',
  'does not exist.',
  '',
  '**This measures whether a subject is named in the literature, not whether the evidence is good.**',
  'It exists because identifier verification cannot detect the failure it targets: a citation can',
  'resolve perfectly, be a real paper by a real group on an adjacent topic, and still never mention',
  'the compound whose page it appears on.',
  '',
  `- dossiers: **${rows.length}**`,
  `- named in **zero** PubMed records: **${zero.length}**`,
  `- named in fewer than 5: **${thin.length}**`,
  `- inconclusive (PubMed did not answer): **${inconclusive.length}**`,
  '',
  '## Named in zero PubMed records',
  '',
  'These pages cannot be sourced under their own subject. Any citation currently on them is',
  'necessarily about something else — which is exactly what was found on five of them: real,',
  'resolving Khavinson-school papers ("Peptides and Ageing", "Peptide Regulation of Gene',
  'Expression") and, in one case, a clinical trial of cortexin, a different compound.',
  '',
  'Each needs an editorial decision. Retire the page, merge it into a single honest page about the',
  'bioregulator class, or reframe it explicitly as a marketed compound with no published literature',
  'under that name. Sourcing cannot resolve it.',
  '',
  '| slug | name | citations currently shown |',
  '|---|---|---|',
  ...zero.map((r) => `| \`${r.slug}\` | ${r.name} | ${r.verified} |`),
  '',
  '## Named in fewer than 5 records',
  '',
  '| slug | name | PubMed records naming it | citations currently shown |',
  '|---|---|---|---|',
  ...thin.sort((a, b) => a.hits - b.hits).map((r) => `| \`${r.slug}\` | ${r.name} | ${r.hits} | ${r.verified} |`),
  '',
];
if (inconclusive.length) {
  md.push('## Inconclusive — PubMed did not answer; re-run before drawing any conclusion', '',
    ...inconclusive.map((r) => `- \`${r.slug}\``), '');
}

fs.writeFileSync(OUT, md.join('\n'));
console.log(`\nZero-literature: ${zero.length} · under 5: ${thin.length} · inconclusive: ${inconclusive.length}`);
console.log(`Report: ${OUT}`);
