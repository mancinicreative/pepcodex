/**
 * All-time literature discovery for dossiers that are below the citation floor.
 *
 * WHY THIS EXISTS, SEPARATELY FROM monthly-research-scan: that script answers "what is NEW since
 * the window?" and is the right tool for a refresh. It is the wrong tool here. A dossier left with
 * two citations after the fabrication sweep is not thin because the last 60 days were quiet — it is
 * thin because its original citations were invented and got stripped. The question for those is
 * "does a literature for this compound exist AT ALL", which is an all-time question.
 *
 * DISCOVERY IS SEPARATED FROM AUTHORSHIP, and that separation is the entire point. This script asks
 * the registries and writes down what came back, with a real resolving identifier fetched in this
 * run attached to every item. A content agent may then only choose among what it was handed. An
 * agent that both searches and writes can produce a citation that fits its narrative; an agent that
 * can only pick from registry-fetched items cannot invent one. That is the structural fix for the
 * fabrication class, as opposed to instructing agents to be careful.
 *
 * THE ANSWER "NONE" IS A RESULT, NOT A FAILURE. Several of these dossiers cover Khavinson
 * bioregulators whose entire cited basis was batch-fabricated. If PubMed genuinely holds nothing
 * about a compound, that is the single most important thing this script can report, and it must not
 * be smoothed over by a loose query that returns something plausible.
 *
 * Usage:
 *   node scripts/source-thin-dossiers.mjs                # every dossier under the floor
 *   node scripts/source-thin-dossiers.mjs --max 4        # only the very thinnest
 *   node scripts/source-thin-dossiers.mjs --slug vilon
 *   node scripts/source-thin-dossiers.mjs --self-test    # matcher fixtures only, no network
 *
 * Output: .planning/sourcing/<date>/<slug>.json + SUMMARY.md
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { isRelevant, isDistinctive, fold } from '../verification/matchers.mjs';

const args = process.argv.slice(2);
const argOf = (f, d) => (args.includes(f) ? args[args.indexOf(f) + 1] : d);
const FLOOR = Number(argOf('--floor', 10));      // project rule: dossiers need 10+ citations
const MAX = Number(argOf('--max', FLOOR));       // only look at dossiers at or below this
const ONLY = argOf('--slug', null);
const SELF_TEST = args.includes('--self-test');
const RETMAX = 200;

const TODAY = new Date().toISOString().slice(0, 10);
const OUT = path.join('.planning/sourcing', TODAY);
const UA = { 'User-Agent': 'PepCodex-sourcing/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MATCH_ALIASES = JSON.parse(fs.readFileSync('data/trial-match-aliases.json', 'utf-8'));

async function fetchT(url, ms = 30000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: UA, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

/* ---------------------------------------------------------------------------------------------
 * STAGE 0 — self-test the relevance matcher before trusting it.
 *
 * Same principle as verify-graph: a filter that has not been shown to work cannot be used to decide
 * what is real. Every case below is one this matcher actually got wrong at some point, or one it
 * must never start getting wrong. If any fails, we abort rather than emit a worklist built on a
 * broken filter — a bad filter here does not produce an error, it produces confident garbage that
 * an agent will happily cite.
 * ------------------------------------------------------------------------------------------- */
const RELEVANCE_FIXTURES = [
  // short alias collisions that produced real false positives in an earlier scan
  { names: ['NASA', 'N-Acetyl Selank Amidate'], text: 'a room-temperature maser using pentacene', want: false, note: 'NASA matched a maser paper' },
  { names: ['NASA', 'N-Acetyl Selank Amidate'], text: 'magnetosphere of Mars observed by NASA orbiters', want: false, note: 'NASA matched a Mars paper' },
  { names: ['AED', 'Cardiogen'], text: 'automated external defibrillator AED deployment in public spaces', want: false, note: 'AED matched defibrillators' },
  { names: ['EDL', 'Ovagen'], text: 'extensor digitorum longus EDL muscle contractile properties', want: false, note: 'EDL matched a leg muscle' },
  { names: ['P21'], text: 'p21 CDKN1A expression in colorectal carcinoma', want: false, note: 'P21 matched the CDKN1A gene' },
  // short names/aliases that MUST still resolve when peptide context is present
  { names: ['P21'], text: 'the CNTF-derived peptide P21 promotes neurogenesis', want: true, note: 'short name + peptide context' },
  { names: ['KPV'], text: 'the tripeptide KPV reduces intestinal inflammation', want: true, note: 'short name + tripeptide context' },
  { names: ['SS-31'], text: 'SS-31 peptide protects mitochondrial cristae', want: true, note: 'short name + peptide context' },
  // long names resolve on their own, no context word needed
  { names: ['bronchogen'], text: 'OX40-OX40L signalling in allergic airway inflammation', want: false, note: 'the bronchogen false-positive set' },
  { names: ['semaglutide'], text: 'semaglutide 2.4 mg once weekly in adults with overweight', want: true, note: 'long name, no context word required' },
  { names: ['thymalin'], text: 'Thymalin administration in elderly patients', want: true, note: 'long name word-boundary hit' },
  // substring must not count: "vilon" inside another word is not a hit
  { names: ['vilon'], text: 'pavilion architecture and daylighting', want: false, note: 'substring inside another word' },
  // GENERIC-PHRASE aliases. Long enough to clear any length threshold, but they name a tissue, not
  // a compound. Every one of these was a real false positive in the first thin-dossier scan.
  { names: ['Stamakort', 'Gastric peptide', 'Stomach bioregulator'], want: false, note: 'stamakort matched ghrelin via "gastric peptide"',
    text: 'Identification and characterization of a novel gastric peptide hormone: the motilin-related peptide' },
  { names: ['Stamakort', 'Gastric mucosa peptide'], want: false, note: 'stamakort matched a ghrelin cell paper',
    text: 'Characterisation of gastric ghrelin cells in man and other mammals' },
  { names: ['Cerluten', 'Brain cytamin', 'Cerebral peptides'], want: false, note: 'cerluten via "cerebral peptides"',
    text: 'cerebral peptides released during ischaemic stroke in the rat cortex' },
  { names: ['Ventfort', 'Vascular cytamin', 'Blood vessel peptides'], want: false, note: 'ventfort via "blood vessel peptides"',
    text: 'blood vessel peptides regulate angiogenesis in tumour microenvironments' },
  { names: ['Suprefort', 'Pancreatic cytamin', 'Pancreas peptides'], want: false, note: 'suprefort via "pancreas peptides"',
    text: 'pancreas peptides and islet regeneration after partial pancreatectomy' },
  // ...but the DISTINCTIVE alias in the same set must still work
  { names: ['Stamakort', 'Gastric peptide'], text: 'Stamakort administration in gastric mucosal atrophy', want: true, note: 'distinctive alias still matches' },
  { names: ['Cerluten', 'Brain cytamin'], text: 'Cerluten effects on retinal pigment epithelium', want: true, note: 'distinctive alias still matches' },
  // a legitimate long alias made of non-generic tokens must NOT be swept up by the generic guard
  { names: ['tesamorelin', 'growth hormone releasing hormone'], want: true, note: 'GHRH is a real alias, not a generic phrase',
    text: 'growth hormone releasing hormone analogue reduces visceral adipose tissue' },
  // PROXIMITY for short aliases: context must be near the hit, not merely somewhere in the abstract
  { names: ['Livagen', 'KED'], want: false, note: 'KED matched a plant protein paper via distant "peptide"',
    text: 'Evolutionary analysis of KED-rich proteins in plants. Comparative genomics of repeat-rich sequences across angiosperms, with implications for structural biology and, separately, for peptide engineering.' },
  { names: ['Livagen', 'KED'], text: 'Peptide KED: molecular-genetic aspects of neurogenesis regulation', want: true, note: 'KED with adjacent peptide context' },
  // Catalogue-code prefixes are not names. A single-letter token must not rescue a generic phrase.
  { names: ['Ventfort', 'A-14 vascular peptides'], want: false, note: '"A-14 vascular peptides" is a catalogue code plus generic words',
    text: 'A-14 vascular peptides were compared against synthetic angiogenic factors in rabbit cornea' },
  { names: ['Cerluten', 'A-5 brain peptides'], want: false, note: 'same shape, A-5 series',
    text: 'A-5 brain peptides and cortical plasticity following induced ischaemia' },
];

/* Direct assertions on isDistinctive itself — the predicate the disambiguation probe depends on.
 * If it drifts, the probe silently starts asking the wrong question, which is worse than failing. */
const DISTINCTIVE_FIXTURES = [
  { alias: 'Ventfort', want: true }, { alias: 'Stamakort', want: true },
  { alias: 'Lys-Glu-Asp', want: true }, { alias: 'Hepatogen', want: true },
  { alias: 'growth hormone releasing hormone', want: true },
  { alias: 'thymosin beta 4', want: true },
  { alias: 'Gastric peptide', want: false }, { alias: 'Stomach bioregulator', want: false },
  { alias: 'Brain cytamin', want: false }, { alias: 'Cerebral peptides', want: false },
  { alias: 'Blood vessel peptides', want: false }, { alias: 'Vascular cytamin', want: false },
  { alias: 'Pancreatic cytamin', want: false }, { alias: 'Pancreas peptides', want: false },
  { alias: 'Testis bioregulator', want: false }, { alias: 'Gonad peptide', want: false },
  { alias: 'A-14 vascular peptides', want: false }, { alias: 'A-5 brain peptides', want: false },
];

function selfTest() {
  const fails = [];
  for (const f of RELEVANCE_FIXTURES) {
    const got = isRelevant(f.names, f.text);
    if (got !== f.want) fails.push(`isRelevant — ${f.note}: expected ${f.want}, got ${got}`);
  }
  for (const f of DISTINCTIVE_FIXTURES) {
    const got = isDistinctive(f.alias);
    if (got !== f.want) fails.push(`isDistinctive — "${f.alias}": expected ${f.want}, got ${got}`);
  }
  return fails;
}

const TOTAL_FIXTURES = RELEVANCE_FIXTURES.length + DISTINCTIVE_FIXTURES.length;
const failures = selfTest();
console.log(`Matcher self-test: ${TOTAL_FIXTURES - failures.length}/${TOTAL_FIXTURES}`);
if (failures.length) {
  console.error('\nABORT — the relevance filter is broken. A worklist built on it would be confident garbage.');
  failures.forEach((f) => console.error(`  FAIL  ${f}`));
  process.exit(1);
}
if (SELF_TEST) { console.log('Self-test only; no network calls made.'); process.exit(0); }

/* ---------------------------------------------------------------------------------------------
 * STAGE 1 — enumerate what is actually thin, from the verification ledger.
 * The ledger is the only surface that knows which identifiers SURVIVED verification, which is the
 * count that matters. Counting identifiers in the file would happily count fabricated ones.
 * ------------------------------------------------------------------------------------------- */
const ledger = JSON.parse(fs.readFileSync('verification/ledger.json', 'utf-8'));
const verifiedByFile = new Map();
for (const e of Object.values(ledger.entries)) {
  if (e.verdict !== 'exists') continue;
  for (const file of new Set((e.locations || []).map((l) => l.file))) {
    if (!verifiedByFile.has(file)) verifiedByFile.set(file, new Set());
    verifiedByFile.get(file).add(`${e.type}:${e.id}`);
  }
}

// Everything already cited anywhere, so the worklist reports only genuinely new leads.
const known = { pmid: new Set(), nct: new Set() };
for (const e of Object.values(ledger.entries)) {
  if (e.type === 'PMID') known.pmid.add(String(e.id));
  if (e.type === 'NCT') known.nct.add(String(e.id).toUpperCase());
}

const dossiers = fs.readdirSync('src/content/peptides').filter((x) => x.endsWith('.mdx'))
  .map((f) => {
    const slug = f.replace(/\.mdx$/, '');
    const d = matter(fs.readFileSync(`src/content/peptides/${f}`, 'utf-8')).data;
    return {
      slug,
      name: d.name || slug,
      verified: (verifiedByFile.get(`src/content/peptides/${f}`) || new Set()).size,
      aliases: [...new Set([d.name, slug.replace(/-/g, ' '), ...(d.aliases || []), ...(MATCH_ALIASES[slug] || [])])].filter(Boolean),
    };
  })
  .filter((p) => (ONLY ? p.slug === ONLY : p.verified <= MAX))
  .sort((a, b) => a.verified - b.verified);

console.log(`\nDossiers at or below ${MAX} verified identifiers: ${dossiers.length} (floor is ${FLOOR})`);
fs.mkdirSync(OUT, { recursive: true });

/* ---------------------------------------------------------------------------------------------
 * STAGE 2 — discover, filter, classify.
 * ------------------------------------------------------------------------------------------- */
const summary = [];

for (const p of dossiers) {
  /* Build the query from DISTINCTIVE aliases only.
   *
   * A generic phrase contributes nothing but noise to a PubMed query, and the noise is not
   * harmless: "Testagen OR Testicular peptide OR Gonad peptide OR Testis bioregulator" returned
   * 68,645 hits, and the two papers that genuinely name Testagen were nowhere in the top 200 that
   * relevance-sorting handed back. The generic terms did not widen the net, they buried the catch.
   * Filtering the RESULTS was never going to fix that — by then the real papers had already been
   * crowded out of the response. So the filter has to move up into the query itself. */
  const searchable = p.aliases.filter(isDistinctive);
  const dropped = p.aliases.filter((a) => !isDistinctive(a));
  const term = (searchable.length ? searchable : [p.name]).map((a) => `"${a}"`).join(' OR ');
  const rec = {
    slug: p.slug, name: p.name, verifiedNow: p.verified, floor: FLOOR, scannedAt: TODAY,
    aliasesUsed: searchable, aliasesDropped: dropped, candidates: [], trials: [], notes: [],
  };
  if (dropped.length) rec.notes.push(`Query built from ${searchable.length} distinctive alias(es); dropped ${dropped.length} generic phrase(s) that would only add noise: ${dropped.map((a) => `"${a}"`).join(', ')}.`);

  // --- PubMed, all time ---
  let rawHits = 0;
  try {
    const es = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=${RETMAX}&sort=relevance&term=${encodeURIComponent(`(${term})`)}`);
    const esj = es.ok ? (await es.json()).esearchresult || {} : {};
    const ids = esj.idlist || [];
    rawHits = Number(esj.count || 0);
    await sleep(380);

    if (rawHits > RETMAX) {
      // Never let a cap read as completeness.
      rec.notes.push(`PubMed reports ${rawHits} total hits; only the ${RETMAX} most relevant were retrieved.`);
    }

    // Fetch titles + abstracts so relevance is judged on real text, not on the query having run.
    const text = {};
    for (let k = 0; k < ids.length; k += 100) {
      const ef = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${ids.slice(k, k + 100).join(',')}`);
      if (ef.ok) {
        const xml = await ef.text();
        for (const c of xml.split(/<PubmedArticle[ >]/).slice(1)) {
          const pm = (c.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
          if (!pm) continue;
          const title = (c.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || '';
          const year = (c.match(/<PubDate>[\s\S]*?<Year>(\d{4})<\/Year>/) || [])[1] || '';
          const journal = (c.match(/<Title>([\s\S]*?)<\/Title>/) || [])[1] || '';
          const ptypes = [...c.matchAll(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g)].map((m) => m[1]);
          text[pm] = {
            blob: c.replace(/<[^>]+>/g, ' '),
            title: title.replace(/<[^>]+>/g, '').trim(),
            year, journal: journal.replace(/<[^>]+>/g, '').trim(), ptypes,
          };
        }
      }
      await sleep(380);
    }

    for (const id of ids) {
      const t = text[id];
      if (!t) continue;
      if (!isRelevant(p.aliases, t.blob)) continue;      // the guard that stops confident garbage
      rec.candidates.push({
        pmid: id, title: t.title, year: t.year, journal: t.journal,
        publicationTypes: t.ptypes,
        alreadyCited: known.pmid.has(id),
        humanStudy: /randomi[sz]ed|clinical trial|patients|participants|volunteers/i.test(t.blob),
      });
    }
  } catch (e) {
    rec.notes.push(`PubMed query failed: ${e.message} — this is INCONCLUSIVE, not evidence of absence.`);
    rec.pubmedError = true;
  }

  // --- ClinicalTrials.gov ---
  try {
    const ct = await fetchT(`https://clinicaltrials.gov/api/v2/studies?query.intr=${encodeURIComponent(p.name)}&pageSize=50&fields=NCTId,BriefTitle,OverallStatus,Phase,InterventionName`);
    if (ct.ok) {
      for (const s of (await ct.json()).studies || []) {
        const idm = s.protocolSection?.identificationModule || {};
        const intr = (s.protocolSection?.armsInterventionsModule?.interventions || []).map((x) => x.name || '').join(' ');
        const blob = `${idm.briefTitle || ''} ${intr}`;
        if (!isRelevant(p.aliases, blob)) continue;      // same guard; wrong-drug trials are the classic error
        rec.trials.push({
          nctId: idm.nctId, title: idm.briefTitle,
          status: s.protocolSection?.statusModule?.overallStatus,
          alreadyCited: known.nct.has(String(idm.nctId).toUpperCase()),
        });
      }
    }
    await sleep(350);
  } catch (e) {
    rec.notes.push(`ClinicalTrials.gov query failed: ${e.message} — inconclusive.`);
  }

  const fresh = rec.candidates.filter((c) => !c.alreadyCited);
  const freshTrials = rec.trials.filter((t) => !t.alreadyCited);
  rec.rawPubmedHits = rawHits;
  rec.relevantCount = rec.candidates.length;
  rec.newCount = fresh.length;

  /* -------------------------------------------------------------------------------------------
   * DISAMBIGUATION PROBE — the decisive question, asked separately.
   *
   * A large raw hit count with zero relevant results is ambiguous on its own: it could mean the
   * query degraded to loose term matching (broken alias set), or it could mean the compound simply
   * has no literature and PubMed matched the generic words instead. Those demand opposite responses
   * — fix the aliases, versus escalate the dossier — so guessing between them is not acceptable.
   *
   * The probe resolves it in one call: search the DISTINCTIVE NAME ALONE, unquoted by any alias.
   * If that returns zero, no paper in PubMed names this compound and NO-LITERATURE is a real
   * finding. If it returns hits while the full-alias query found nothing relevant, the alias set is
   * genuinely broken and the verdict must not be trusted.
   *
   * This exists because the first run of this script could not tell the two apart and reported six
   * LEARN flags that a human then had to resolve by hand. Resolving it by hand once is fine;
   * leaving the loop unable to resolve it is what makes the next run cost the same again.
   * ----------------------------------------------------------------------------------------- */
  if (rawHits >= 50 && rec.relevantCount === 0 && !rec.pubmedError) {
    const distinctive = p.aliases.filter((a) => isDistinctive(a) && String(a).length >= 6);
    const probeTerm = distinctive.map((a) => `"${a}"`).join(' OR ') || `"${p.name}"`;
    try {
      const pr = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=0&term=${encodeURIComponent(probeTerm)}`);
      rec.nameOnlyHits = pr.ok ? Number((await pr.json()).esearchresult?.count || 0) : null;
      await sleep(380);
    } catch { rec.nameOnlyHits = null; }

    if (rec.nameOnlyHits === 0) {
      rec.notes.push(`CONFIRMED: PubMed returns 0 hits for the distinctive name alone (${probeTerm}). The ${rawHits} raw hits came from generic alias phrases matching unrelated papers. No paper in PubMed names this compound.`);
    } else if (rec.nameOnlyHits === null) {
      rec.notes.push('Disambiguation probe failed — verdict INCONCLUSIVE, do not treat as unsourceable.');
      rec.probeFailed = true;
    } else {
      rec.notes.push(`LEARN: ${rawHits} raw hits and 0 relevant, but the distinctive name alone returns ${rec.nameOnlyHits} hits. The alias set is broken — fix it and re-run before trusting this verdict.`);
      rec.learnSignal = true;
    }
  }

  /* Alias hygiene is itself a reportable defect: a generic phrase listed as a public alias is a
   * scientific misstatement on the page, quite apart from what it does to a query. */
  const genericAliases = p.aliases.filter((a) => !isDistinctive(a));
  if (genericAliases.length) {
    rec.genericAliases = genericAliases;
    rec.notes.push(`Alias hygiene: ${genericAliases.length} alias(es) name a tissue, not a compound — ${genericAliases.map((a) => `"${a}"`).join(', ')}. These inflate queries and are misleading as published synonyms.`);
  }

  rec.verdict = rec.pubmedError || rec.probeFailed ? 'INCONCLUSIVE'
    : rec.learnSignal ? 'ALIASES-BROKEN'
    : rec.relevantCount === 0 ? 'NO-LITERATURE'
    : fresh.length === 0 ? 'FULLY-CITED'
    : p.verified + fresh.length >= FLOOR ? 'SOURCEABLE'
    : 'PARTIAL';

  fs.writeFileSync(path.join(OUT, `${p.slug}.json`), JSON.stringify(rec, null, 2) + '\n');
  summary.push({
    slug: p.slug, name: p.name, have: p.verified, raw: rawHits,
    relevant: rec.relevantCount, new: fresh.length, newTrials: freshTrials.length,
    verdict: rec.verdict, learn: !!rec.learnSignal,
  });
  console.log(`  ${String(p.verified).padStart(2)} → +${String(fresh.length).padStart(3)}  ${rec.verdict.padEnd(14)} ${p.slug}${rec.learnSignal ? '  [LEARN]' : ''}`);
}

/* ---------------------------------------------------------------------------------------------
 * STAGE 3 — write the worklist.
 * ------------------------------------------------------------------------------------------- */
const byVerdict = summary.reduce((a, s) => ((a[s.verdict] = (a[s.verdict] || 0) + 1), a), {});
const md = [
  `# Thin-dossier sourcing scan — ${TODAY}`,
  '',
  `Scanned **${summary.length}** dossiers holding at or below **${MAX}** verified identifiers.`,
  `Citation floor is **${FLOOR}** (project rule: a dossier needs 10+).`,
  '',
  'Every candidate below carries an identifier fetched from PubMed or ClinicalTrials.gov during this',
  'run and passed a relevance filter that was itself self-tested first. A content agent may cite ONLY',
  'from these lists — it must not search independently, because an agent that both searches and writes',
  'can produce a citation that fits its narrative.',
  '',
  '## Verdicts',
  '',
  '| verdict | meaning | count |',
  '|---|---|---|',
  `| SOURCEABLE | enough real new papers to clear the floor | ${byVerdict.SOURCEABLE || 0} |`,
  `| PARTIAL | real papers exist, but not enough to reach ${FLOOR} | ${byVerdict.PARTIAL || 0} |`,
  `| FULLY-CITED | everything relevant is already cited; thinness is real, not fixable | ${byVerdict['FULLY-CITED'] || 0} |`,
  `| NO-LITERATURE | no paper names this compound — an editorial problem, not a sourcing one | ${byVerdict['NO-LITERATURE'] || 0} |`,
  `| ALIASES-BROKEN | the alias set is wrong; verdict withheld until fixed | ${byVerdict['ALIASES-BROKEN'] || 0} |`,
  `| INCONCLUSIVE | the registry did not answer; retry, do not conclude | ${byVerdict.INCONCLUSIVE || 0} |`,
  '',
  '## Per dossier',
  '',
  '| slug | verified now | raw hits | relevant | new | new trials | verdict |',
  '|---|---|---|---|---|---|---|',
  ...summary.map((s) => `| \`${s.slug}\` | ${s.have} | ${s.raw} | ${s.relevant} | ${s.new} | ${s.newTrials} | ${s.verdict}${s.learn ? ' ⚠︎LEARN' : ''} |`),
  '',
];

const learners = summary.filter((s) => s.learn);
if (learners.length) {
  md.push('## ⚠︎ LEARN signals — alias sets to fix before trusting the verdict', '',
    'These returned a large raw hit count and zero relevant papers, which is the signature of a query',
    'that degraded to loose term matching rather than a compound with no literature. Fix the alias set',
    'in `data/trial-match-aliases.json` and re-run before treating any of these as unsourceable.', '',
    ...learners.map((s) => `- \`${s.slug}\` — ${s.raw} raw hits, 0 relevant`), '');
}

const none = summary.filter((s) => s.verdict === 'NO-LITERATURE' && !s.learn);
if (none.length) {
  md.push('## NO-LITERATURE — escalate to an editorial decision', '',
    'PubMed holds no paper naming these compounds, and the alias set is not the reason. A dossier',
    'cannot be sourced into existence. Each needs a decision: retire it, or reframe it explicitly as',
    'a compound with no published human or animal literature.', '',
    ...none.map((s) => `- \`${s.slug}\` (${s.name}) — currently shows ${s.have} verified identifier(s)`), '');
}

fs.writeFileSync(path.join(OUT, 'SUMMARY.md'), md.join('\n'));
console.log(`\nWorklist: ${path.join(OUT, 'SUMMARY.md')}`);
console.log(JSON.stringify(byVerdict, null, 2));
