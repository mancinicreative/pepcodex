/**
 * Find peptides the site has NO dossier for.
 *
 * THE GAP THIS CLOSES: every other scan in this repo iterates over the 102 dossiers we already
 * have and asks "what is new about these?". None of them can see a compound we never wrote about.
 * A peptide that entered Phase 2 last month, a bioregulator we skipped, a newly-named analogue —
 * all invisible, because the question was never asked. This inverts the direction: ask the
 * registries what peptide therapeutics are ACTIVE, then subtract what we cover.
 *
 * DISCOVERY, NOT AUTHORSHIP. This emits candidates with counts and identifiers fetched in this run.
 * It never writes content and never decides what deserves a dossier — that is an editorial call
 * about scope, and the site deliberately does not cover every peptide in existence.
 *
 * Sources:
 *   - ClinicalTrials.gov: interventional studies updated in the window whose intervention is a
 *     DRUG, filtered to names that look like a compound rather than a procedure or device.
 *   - PubMed: papers in the window matching peptide-therapeutic terms, mined for compound-shaped
 *     tokens that recur across multiple distinct papers.
 *
 * Recurrence across distinct records is the signal that matters. A name appearing once is noise —
 * a typo, a local abbreviation, a one-off. A name appearing in several independent registrations
 * or papers is a real programme.
 *
 * Usage:
 *   node scripts/discover-coverage-gaps.mjs --days 60
 *   node scripts/discover-coverage-gaps.mjs --days 60 --min 3
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fold } from '../verification/matchers.mjs';

const args = process.argv.slice(2);
const argOf = (f, d) => (args.includes(f) ? args[args.indexOf(f) + 1] : d);
const DAYS = Number(argOf('--days', 60));
const MIN_RECURRENCE = Number(argOf('--min', 2));
const UA = { 'User-Agent': 'PepCodex-coverage/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TODAY = new Date().toISOString().slice(0, 10);
const OUT = path.join('.planning/coverage', TODAY);

// ---- what we already cover ------------------------------------------------------------------
const covered = new Set();
const MATCH_ALIASES = JSON.parse(fs.readFileSync('data/trial-match-aliases.json', 'utf-8'));
for (const f of fs.readdirSync('src/content/peptides').filter((x) => x.endsWith('.mdx'))) {
  const slug = f.replace(/\.mdx$/, '');
  const d = matter(fs.readFileSync(`src/content/peptides/${f}`, 'utf-8')).data;
  for (const n of [slug, slug.replace(/-/g, ' '), d.name, ...(d.aliases || []), ...(MATCH_ALIASES[slug] || [])]) {
    if (n) covered.add(fold(n).replace(/[^a-z0-9]/g, ''));
  }
}
// Also treat anything we already cite a trial for as covered.
for (const f of fs.readdirSync('data/source-packs').filter((x) => x.endsWith('.json'))) {
  covered.add(fold(f.replace(/\.json$/, '')).replace(/[^a-z0-9]/g, ''));
}
console.log(`Covered name forms: ${covered.size} across ${fs.readdirSync('src/content/peptides').length} dossiers\n`);

const isCovered = (name) => {
  const k = fold(name).replace(/[^a-z0-9]/g, '');
  if (!k) return true;
  if (covered.has(k)) return true;
  // A candidate that merely contains a covered name is a formulation of it, not a new compound.
  for (const c of covered) if (c.length >= 6 && (k.includes(c) || c.includes(k))) return true;
  return false;
};

/* Names that are not compounds. Procedures, dosage forms, comparators and study furniture dominate
 * intervention fields and would otherwise flood the report. */
const NOT_A_COMPOUND = /\b(placebo|saline|vehicle|standard of care|usual care|control|questionnaire|survey|exercise|diet|training|education|counsel|surgery|surgical|device|scan|mri|ct\b|ultrasound|biopsy|blood sample|observation|no intervention|sham|physiotherapy|acupuncture|massage|supplement(ation)?|vitamin|placebo-controlled|water|glucose|insulin glargine|metformin)\b/i;
/* A compound name looks like a name or a development code, not a sentence. */
const COMPOUND_SHAPED = /^[A-Za-z][A-Za-z0-9][A-Za-z0-9 \-()/.]{1,38}$/;
/* WHO INN STEMS, not a development-code shape.
 *
 * The first version accepted any `XXX-####` token as a candidate, on the theory that development
 * codes name new compounds. They do — but overwhelmingly small molecules. That run surfaced
 * BLU-5937, MK-1084, ZEN-3694, RMC-6236 and BMS-986504, none of which is a peptide, and `acetate`
 * additionally pulled in abiraterone, a steroid. Nothing in a bare code distinguishes a peptide
 * from a kinase inhibitor, so no threshold on that pattern can work.
 *
 * INN stems can. The WHO assigns `-tide` to peptides, `-relin` to hypothalamic releasing-hormone
 * analogues, `-orexton` to orexin agonists; `-glutide`, `-lintide`, `-trutide`, `-dutide` are
 * sub-stems of `-tide`. A name carrying one of those was assigned it BECAUSE it is a peptide, which
 * is a fact about the compound rather than an inference from its formatting. Development codes are
 * still discoverable — via the trial's own intervention record once a compound has an INN — they
 * are just not evidence of peptide-ness on their own. */
const PEPTIDE_HINT = /(tide|relin|orexton|actide|pressin|cog?in$|somatropin|interferon|insulin\s|peptide)\b/i;

const hits = new Map();   // normalised name -> { display, ct: Set, pm: Set }
const note = (name, kind, ref) => {
  const k = fold(name).replace(/[^a-z0-9]/g, '');
  if (!k) return;
  if (!hits.has(k)) hits.set(k, { display: name, ct: new Set(), pm: new Set() });
  hits.get(k)[kind].add(ref);
};

// ---- ClinicalTrials.gov ----------------------------------------------------------------------
const from = new Date(Date.now() - DAYS * 864e5).toISOString().slice(0, 10);
console.log(`Scanning ClinicalTrials.gov for interventional peptide studies updated since ${from} ...`);
let token = null, pages = 0, studies = 0;
do {
  const url = new URL('https://clinicaltrials.gov/api/v2/studies');
  url.searchParams.set('query.term', 'peptide OR analogue OR agonist');
  url.searchParams.set('filter.advanced', `AREA[LastUpdatePostDate]RANGE[${from},MAX]`);
  url.searchParams.set('pageSize', '200');
  url.searchParams.set('fields', 'NCTId,BriefTitle,InterventionName,InterventionType,Phase');
  if (token) url.searchParams.set('pageToken', token);
  let j;
  try {
    const r = await fetch(url, { headers: UA });
    if (!r.ok) break;
    j = await r.json();
  } catch { break; }
  for (const s of j.studies || []) {
    studies++;
    const nct = s.protocolSection?.identificationModule?.nctId;
    for (const iv of s.protocolSection?.armsInterventionsModule?.interventions || []) {
      if (iv.type && iv.type !== 'DRUG' && iv.type !== 'BIOLOGICAL') continue;
      const nm = String(iv.name || '').trim();
      if (!nm || NOT_A_COMPOUND.test(nm) || !COMPOUND_SHAPED.test(nm)) continue;
      if (!PEPTIDE_HINT.test(nm)) continue;
      if (isCovered(nm)) continue;
      note(nm, 'ct', nct);
    }
  }
  token = j.nextPageToken;
  pages++;
  await sleep(300);
} while (token && pages < 25);
console.log(`  ${studies} studies scanned across ${pages} page(s)`);

// ---- PubMed ----------------------------------------------------------------------------------
console.log(`Scanning PubMed for peptide-therapeutic papers since ${from} ...`);
const fmt = from.replace(/-/g, '/');
try {
  const q = `("peptide therapeutics"[tiab] OR "peptide drug"[tiab] OR "peptide analogue"[tiab] OR bioregulator[tiab]) AND ("${fmt}"[EDAT] : "3000"[EDAT])`;
  const es = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=300&term=${encodeURIComponent(q)}`, { headers: UA });
  const ids = es.ok ? ((await es.json()).esearchresult?.idlist || []) : [];
  await sleep(380);
  console.log(`  ${ids.length} papers retrieved`);
  for (let i = 0; i < ids.length; i += 100) {
    const ef = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${ids.slice(i, i + 100).join(',')}`, { headers: UA });
    if (ef.ok) {
      const xml = await ef.text();
      for (const c of xml.split(/<PubmedArticle[ >]/).slice(1)) {
        const pm = (c.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
        /* MINE THE TITLE AND ABSTRACT ONLY — never the whole record.
         *
         * efetch returns <ReferenceList>, which on a review can be 61 KB against a 1.6 KB abstract.
         * Stripping tags from the whole chunk therefore mined the bibliography, and every name any
         * cited paper mentioned became a "candidate". That produced three pure artefacts: MB-231
         * from the MDA-MB-231 cell line, and MCT-24 and CIR-20 from DOI fragments
         * (10.1158/1535-7163.MCT-24-0002, 10.1158/2326-6066.CIR-20-0527). It also attributed a
         * spaceflight-manufacturing paper to teriparatide and an oral-semaglutide formulation paper
         * to exenatide. A compound discussed in a paper's references is not what that paper is
         * about. */
        const title = (c.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || '';
        const abstract = [...c.matchAll(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g)].map((m) => m[1]).join(' ');
        const text = `${title} ${abstract}`.replace(/<[^>]+>/g, ' ');
        // Compound-shaped tokens: a name ending in a peptide-drug suffix, or a development code.
        for (const m of text.matchAll(/\b([A-Z][a-z]{3,}(?:tide|relin|orexton)|[A-Z]{2,4}-\d{2,5})\b/g)) {
          const nm = m[1];
          if (isCovered(nm) || NOT_A_COMPOUND.test(nm)) continue;
          note(nm, 'pm', pm);
        }
      }
    }
    await sleep(380);
  }
} catch (e) { console.warn(`  PubMed scan failed: ${e.message} — coverage report is INCOMPLETE`); }

// ---- report ----------------------------------------------------------------------------------
const rows = [...hits.values()]
  .map((h) => ({ name: h.display, trials: h.ct.size, papers: h.pm.size, total: h.ct.size + h.pm.size,
    refs: [...h.ct].slice(0, 4), pmids: [...h.pm].slice(0, 4) }))
  .filter((r) => r.total >= MIN_RECURRENCE)
  .sort((a, b) => b.trials - a.trials || b.papers - a.papers);

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'candidates.json'), JSON.stringify(rows, null, 2) + '\n');

const md = [
  `# Coverage gaps — compounds with no dossier (${TODAY}, ${DAYS}-day window)`, '',
  'Every other scan in this repo asks "what is new about the peptides we cover". This one asks the',
  'question none of them can: **what is active that we do not cover at all**. Candidates below appear',
  `in at least ${MIN_RECURRENCE} distinct registrations or papers — a name seen once is noise.`, '',
  '**This is a discovery list, not a work order.** The site deliberately does not cover every peptide',
  'in existence; whether any of these deserves a dossier is an editorial call about scope. Nothing',
  'here has been verified beyond "this name appears on real records fetched in this run".', '',
  `- candidates above threshold: **${rows.length}**`,
  `- trials scanned: ${studies}`, '',
  '| candidate | trials | papers | example refs |',
  '|---|---|---|---|',
  ...rows.slice(0, 60).map((r) => `| ${r.name} | ${r.trials} | ${r.papers} | ${[...r.refs, ...r.pmids].slice(0, 3).join(', ')} |`),
  '',
];
fs.writeFileSync(path.join(OUT, 'SUMMARY.md'), md.join('\n'));

console.log(`\nCandidates with no dossier (>= ${MIN_RECURRENCE} refs): ${rows.length}`);
rows.slice(0, 25).forEach((r) => console.log(`  ${String(r.trials).padStart(3)} trials  ${String(r.papers).padStart(3)} papers   ${r.name}`));
console.log(`\nReport: ${path.join(OUT, 'SUMMARY.md')}`);
