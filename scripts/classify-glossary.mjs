// Classifies glossary terms into KEEP-INDEXED vs NOINDEX candidates, cross-referenced
// against real GSC performance so nothing that earns gets de-indexed.
//
//   node scripts/classify-glossary.mjs           # report only
//   node scripts/classify-glossary.mjs --apply   # write noindex:true into frontmatter
import fs from 'fs';
import path from 'path';

const DIR = path.join('src', 'content', 'glossary');
const V2 = path.join('.planning', 'data', 'v2');
const APPLY = process.argv.includes('--apply');

const load = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')) : []);
const norm = (u) => u.replace(/^https?:\/\/(www\.)?pepcodex\.com/, '').replace(/\/$/, '');

// Peptide-specific vocabulary — these are on-mission and stay indexed regardless.
const PEPTIDE_SPECIFIC = /peptide|amylin|glp-?1|gip|igf|ghrp|ghrh|secretagogue|analog|agonist|antagonist|receptor|bioregulator|cytomax|cytogen|nootropic|melanocortin|somatropin|acylat|lipopeptid|oligopeptid|polypeptid|amino acid|sequence|reconstitut|subcutaneous|bacteriostatic|compounding|troche|lyophiliz/i;

// Generic science/medical vocabulary — competes with Wikipedia/NIH/Mayo, unwinnable at DR 3.3.
const GENERIC = /^(autophagy|gene expression|oxidative stress|telomerase|telomere|pharmacokinetics|pharmacodynamics|half-life|dalton|molecular weight|ic50|ec50|bioavailability|homeostasis|metabolism|mitochondria|inflammation|cytokine|apoptosis|angiogenesis|collagen|fibrosis|insulin resistance|adipose tissue|visceral fat|lean body mass|basal metabolic rate|cortisol|testosterone|estrogen|growth hormone|thyroid|a1c|hba1c|blood glucose|lipid profile|cholesterol|triglyceride|blood pressure|heart rate|bmi|placebo|double-blind|randomized|crossover|cohort|meta-analysis|systematic review|confidence interval|p-value|statistical significance|effect size|sample size|adverse event|contraindication|off-label|black box warning|gmp|iso|coa|purity|sterility|endotoxin|excipient|diluent|ph|osmolality|solubility|stability|degradation|oxidation|deamidation|aggregation)/i;

const rows = [];
for (const file of fs.readdirSync(DIR).filter((f) => /\.mdx?$/.test(f))) {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf-8');
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  const term = (fm?.[1].match(/^term:\s*["']?(.+?)["']?\s*$/m) || [])[1] || '';
  const slug = file.replace(/\.mdx?$/, '');
  const alreadyNoindex = /^noindex:\s*true/m.test(fm?.[1] || '');
  rows.push({ file, slug, term, alreadyNoindex });
}

// performance
const perf = {};
for (const tag of ['pepcodex-com', 'www-pepcodex-com']) {
  for (const r of load(path.join(V2, `gsc-${tag}-page.json`))) {
    const k = norm(r.page);
    if (!k.startsWith('/glossary/')) continue;
    perf[k] ??= { i: 0, c: 0, pos: [] };
    perf[k].i += r.impressions;
    perf[k].c += r.clicks;
    perf[k].pos.push(r.position);
  }
}

const classified = rows.map((r) => {
  const p = perf[`/glossary/${r.slug}`];
  const clicks = p?.c ?? 0;
  const impr = p?.i ?? 0;
  const bestPos = p ? Math.min(...p.pos) : null;

  let verdict, reason;
  if (clicks > 0) {
    verdict = 'KEEP';
    reason = `earns ${clicks} click(s) — protected`;
  } else if (bestPos !== null && bestPos <= 10) {
    // Any top-10 ranking is protected regardless of volume. Google placing a page on
    // page one is a signal worth more than the marginal crawl-budget saving of removing it.
    verdict = 'KEEP';
    reason = `ranks ${bestPos} (top-10) with ${impr} impressions — protected`;
  } else if (PEPTIDE_SPECIFIC.test(r.term) || PEPTIDE_SPECIFIC.test(r.slug)) {
    verdict = 'KEEP';
    reason = 'peptide-specific / on-mission';
  } else if (GENERIC.test(r.term) || GENERIC.test(r.slug.replace(/-/g, ' '))) {
    verdict = 'NOINDEX';
    reason = impr ? `generic term, ${impr} impr, best pos ${bestPos}` : 'generic term, never surfaced';
  } else {
    verdict = 'REVIEW';
    reason = impr ? `${impr} impr, best pos ${bestPos}` : 'no data, not clearly generic';
  }
  return { ...r, clicks, impr, bestPos, verdict, reason };
});

const by = (v) => classified.filter((c) => c.verdict === v);
console.log(`glossary terms: ${classified.length}`);
console.log(`  KEEP     ${by('KEEP').length}`);
console.log(`  NOINDEX  ${by('NOINDEX').length}`);
console.log(`  REVIEW   ${by('REVIEW').length}   <- ambiguous, left indexed`);

console.log('\n--- PROTECTED (earning or ranking well) ---');
by('KEEP')
  .filter((c) => c.clicks > 0 || c.impr >= 100)
  .sort((a, b) => b.clicks - a.clicks || b.impr - a.impr)
  .slice(0, 12)
  .forEach((c) => console.log(`  ${String(c.clicks).padStart(2)} clk ${String(c.impr).padStart(5)} impr  ${c.slug.padEnd(28)} ${c.reason}`));

console.log('\n--- NOINDEX CANDIDATES (top by wasted impressions) ---');
by('NOINDEX')
  .sort((a, b) => b.impr - a.impr)
  .slice(0, 15)
  .forEach((c) => console.log(`  ${String(c.impr).padStart(5)} impr  pos ${String(c.bestPos ?? '-').padStart(5)}  ${c.slug.padEnd(28)} ${c.reason}`));

const wasted = by('NOINDEX').reduce((a, c) => a + c.impr, 0);
const wastedClicks = by('NOINDEX').reduce((a, c) => a + c.clicks, 0);
console.log(`\n  de-indexing these removes ${wasted} impressions and ${wastedClicks} clicks from the index`);

fs.writeFileSync(path.join(V2, 'glossary-classification.json'), JSON.stringify(classified, null, 2));

if (APPLY) {
  let n = 0;
  for (const c of by('NOINDEX')) {
    if (c.alreadyNoindex) continue;
    const p = path.join(DIR, c.file);
    const raw = fs.readFileSync(p, 'utf-8');
    // Content files are CRLF on this machine — match either ending and preserve it,
    // otherwise the replace silently no-ops and reports success.
    const m = raw.match(/^---(\r?\n)/);
    if (!m) {
      console.log(`  SKIP (no frontmatter): ${c.file}`);
      continue;
    }
    const eol = m[1];
    const out = raw.replace(/^---(\r?\n)/, `---${eol}noindex: true${eol}`);
    if (out === raw) {
      console.log(`  SKIP (unchanged): ${c.file}`);
      continue;
    }
    fs.writeFileSync(p, out);
    n++;
  }
  console.log(`\nAPPLIED: added 'noindex: true' to ${n} files`);
} else {
  console.log('\n(report only — re-run with --apply to write frontmatter)');
}
