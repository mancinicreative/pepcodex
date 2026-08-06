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
import { isRelevant, fold } from '../verification/matchers.mjs';

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
];

function selfTest() {
  const fails = [];
  for (const f of RELEVANCE_FIXTURES) {
    const got = isRelevant(f.names, f.text);
    if (got !== f.want) fails.push(`${f.note}: expected ${f.want}, got ${got}`);
  }
  return fails;
}

const failures = selfTest();
console.log(`Relevance matcher self-test: ${RELEVANCE_FIXTURES.length - failures.length}/${RELEVANCE_FIXTURES.length}`);
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
  const term = [...new Set(p.aliases)].map((a) => `"${a}"`).join(' OR ');
  const rec = {
    slug: p.slug, name: p.name, verifiedNow: p.verified, floor: FLOOR, scannedAt: TODAY,
    aliasesUsed: p.aliases, candidates: [], trials: [], notes: [],
  };

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
   * LEARN signal — implausible volume means a broken matcher, not a busy field.
   * The cheapest available check on a query is whether its shape makes sense. If PubMed returns
   * hundreds of hits and the relevance filter keeps almost none, the query degraded to loose term
   * matching and the alias set is the thing that needs fixing.
   * ----------------------------------------------------------------------------------------- */
  if (rawHits >= 50 && rec.relevantCount === 0 && !rec.pubmedError) {
    rec.notes.push(`LEARN: ${rawHits} raw hits, 0 relevant. The query degraded to loose term matching — the alias set for this peptide needs review before this result is trusted as "no literature".`);
    rec.learnSignal = true;
  }

  rec.verdict = rec.pubmedError ? 'INCONCLUSIVE'
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
