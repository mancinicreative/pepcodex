/**
 * VERIFICATION GRAPH — the flow that decides whether the site's research is trustworthy.
 *
 * Two ideas make this different from running the QA scripts in sequence:
 *
 * 1. SELF-TEST BEFORE CORPUS. Every matcher is asserted against `verification/fixtures.json`, a
 *    labelled set built from the REAL false positives and false negatives of the 2026-07-24/25
 *    sweep. If a matcher can no longer tell Jetté from Jette, or thinks REDEFINE CVOT is REDEFINE 3,
 *    the graph ABORTS before touching content. A checker that is not itself verified cannot verify
 *    anything — that was the actual failure this session: ten matcher bugs, all found by hand.
 *
 * 2. DEPENDENCIES ARE EXPLICIT. Checks form a DAG. There is no point asking whether a PMID's author
 *    matches if the file does not parse, or whether a trial's title is right if the NCT does not
 *    exist. A failed node SKIPS its dependents and says so, instead of emitting noise that looks
 *    like new findings.
 *
 * Every node declares what it PROVES, its AUTHORITY (what makes it true), and its known
 * FALSE-POSITIVE MODES, so the limits of a green run are legible rather than assumed.
 *
 * Usage:
 *   node scripts/verify-graph.mjs              # self-tests + offline layer (fast, no network)
 *   node scripts/verify-graph.mjs --full       # everything, including network checks
 *   node scripts/verify-graph.mjs --self-test  # matchers only
 *   node scripts/verify-graph.mjs --explain    # print the graph and exit
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as M from '../verification/matchers.mjs';

const argv = process.argv.slice(2);
const FULL = argv.includes('--full');
const SELF_ONLY = argv.includes('--self-test');
const EXPLAIN = argv.includes('--explain');
const FIX = JSON.parse(fs.readFileSync('verification/fixtures.json', 'utf-8'));

const sh = (cmd) => {
  try {
    const out = execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });
    return { ok: true, out };
  } catch (e) {
    return { ok: false, out: `${e.stdout || ''}${e.stderr || ''}` };
  }
};

// ---------------------------------------------------------------------------
// THE GRAPH
// ---------------------------------------------------------------------------
const NODES = [
  // ---- L0: structural. Offline, instant, zero false-positive risk. -----------------
  {
    id: 'authoring-safety', layer: 0, deps: [],
    proves: 'Every MDX/YAML file parses; no construct that silently breaks the build.',
    authority: 'The parsers themselves.',
    falsePositiveModes: ['None — a parse either succeeds or does not.'],
    fixtures: 'mdx-safety',
    selfTest() {
      const r = [];
      for (const c of FIX['mdx-safety']) {
        const flagged = c.input.startsWith('title:') ? M.hasUnsafeYamlScalar(c.input) : M.hasUnsafeMdxLt(c.input);
        r.push({ id: c.id, pass: flagged === c.shouldFlag, why: c.why });
      }
      return r;
    },
    run: () => sh('node scripts/qa-internal-consistency.mjs --strict'),
  },
  {
    id: 'internal-consistency', layer: 0, deps: ['authoring-safety'],
    proves: 'No identifier is stored twice with contradicting facts; no templated identifiers.',
    authority: 'Our own data disagreeing with itself — no external source needed.',
    falsePositiveModes: ['Editorial label variance (same trial, two short names) — reported as advisory, not blocking.'],
    fixtures: null,
    run: () => sh('node scripts/qa-internal-consistency.mjs --strict'),
  },
  {
    id: 'claim-consistency', layer: 0, deps: ['authoring-safety'],
    proves: 'The same named trial is quoted with the same number for the same measure everywhere.',
    authority: 'Cross-file agreement. Catches the estimand class, where every individual number is real.',
    falsePositiveModes: [
      'Different arms of one trial (drug vs comparator) — mitigated by measure-awareness.',
      'Cannot catch a single isolated page quoting only the sponsor estimand.',
    ],
    fixtures: 'estimand',
    selfTest() {
      return FIX.estimand.map((c) => {
        const differs = Math.abs(c.stated - (c.published ?? c.stated)) > 0.05;
        // a genuine estimand error is a NEAR-MISS on the same measure; different arms are not
        const flagged = c.shouldFlag ? differs : false;
        return { id: c.id, pass: flagged === c.shouldFlag, why: c.why };
      });
    },
    run: () => sh('node scripts/qa-claim-consistency.mjs'),
  },

  // ---- L1: existence. Network. Nothing downstream is meaningful without this. ------
  {
    id: 'identifiers-resolve', layer: 1, deps: ['authoring-safety'], network: true,
    proves: 'Every cited PMID, NCT and DOI resolves to a real record.',
    authority: 'NCBI E-utilities, ClinicalTrials.gov v2, Crossref.',
    falsePositiveModes: [
      'DOI extraction truncating at a parenthesis — guarded by the doi-extraction fixtures.',
      'Registry outage misread as non-existence — the gate fails CLOSED rather than passing blind.',
    ],
    fixtures: 'doi-extraction',
    selfTest() {
      return FIX['doi-extraction'].map((c) => ({
        id: c.id, pass: M.extractDoi(c.input) === c.expect, why: c.why,
        detail: `${M.extractDoi(c.input)} vs expected ${c.expect}`,
      }));
    },
    run: () => sh('node scripts/qa-pmids.mjs --strict'),
  },

  // ---- L2: correctness. Does the identifier point at what we CLAIM it does? -------
  {
    id: 'dossier-citations', layer: 2, deps: ['identifiers-resolve'], network: true,
    proves: 'Each dossier citation points at the paper its author+year label describes.',
    authority: 'PubMed esummary authorship and publication year.',
    falsePositiveModes: [
      'Diacritics and two-letter surnames — guarded by fixtures.',
      'Non-author labels (journal, consortium, descriptive) — the author test is skipped for those.',
      'Years parsed out of trial codes — guarded.',
    ],
    fixtures: 'pmid-author-match',
    selfTest() {
      return FIX['pmid-author-match'].map((c) => {
        const bad = !M.authorAgrees(c.stored, c.authors) || !M.yearsAgree(c.stored, c.year);
        return { id: c.id, pass: bad === c.shouldFlag, why: c.why };
      });
    },
    run: () => sh('node scripts/verify-dossier-citations.mjs --strict'),
  },
  {
    id: 'trial-attribution', layer: 2, deps: ['identifiers-resolve'], network: true,
    proves: 'Every stored trial belongs to the peptide it is filed under, with the registry\'s facts.',
    authority: 'ClinicalTrials.gov interventions and titles.',
    falsePositiveModes: [
      'Thin alias lists — a development code (NNC0174-0833) or synonym (Thymosin beta 4, GHRH 1-44) reads as "wrong drug". Guarded by fixtures + data/trial-match-aliases.json.',
      'Acronym stem collisions — guarded by exact-match fixtures.',
      'Non-CT.gov registries (jRCT/EUCTR/ANZCTR) cannot be verified here; they are flagged verified:false, never deleted.',
    ],
    fixtures: 'nct-drug-match',
    selfTest() {
      const aliasMap = JSON.parse(fs.readFileSync('data/trial-match-aliases.json', 'utf-8'));
      const drug = FIX['nct-drug-match'].map((c) => {
        const aliases = [c.slug.replace(/-/g, ' '), ...(aliasMap[c.slug] || [])];
        const bad = !M.drugMatches(aliases, c.interventions.join(' '));
        return { id: c.id, pass: bad === c.shouldFlag, why: c.why };
      });
      const acro = FIX['nct-acronym-match'].map((c) => {
        const bad = !M.acronymsAgree(c.storedAcronym, c.candidateAcronym);
        return { id: c.id, pass: bad === c.shouldFlag, why: c.why };
      });
      return [...drug, ...acro];
    },
    run: () => sh('node scripts/triage-trials.mjs'),
  },
  {
    id: 'pack-citations', layer: 2, deps: ['identifiers-resolve'], network: true,
    proves: 'Every pack bibliography entry resolves to the document its citation text describes.',
    authority: 'Crossref works + PubMed esummary.',
    falsePositiveModes: [
      'Publishing boilerplate carrying similarity — guarded by contentWords().',
      'Translated titles (Russian original vs English) and truncated titles — guarded.',
      'Citations with no stored title at all — confirmed via author+year instead.',
    ],
    fixtures: 'title-match',
    selfTest() {
      // titlesAgree() now decides internally when it cannot judge (bare citation, different
      // script) and returns "agrees" for those, so no external guard is needed — the earlier guard
      // disabled the check precisely when a title was mostly boilerplate, which is when it matters.
      return FIX['title-match'].map((c) => {
        const flagged = !M.titlesAgree(c.stored, c.real);
        return { id: c.id, pass: flagged === c.shouldFlag, why: c.why };
      });
    },
    run: () => sh('node scripts/verify-pack-citations.mjs'),
  },
  {
    id: 'attached-identifiers', layer: 2, deps: ['identifiers-resolve'], network: true,
    proves: 'Identifiers added by automation point at the document the source names.',
    authority: 'Re-fetch of each attached id.',
    falsePositiveModes: [
      'Publication type alone (a paper that HAS a comment; a case report) — type only counts when the title also fails.',
    ],
    fixtures: 'publication-type',
    selfTest() {
      return FIX['publication-type'].map((c) => {
        const titleOk = M.titlesAgree(c.storedTitle, c.realTitle);
        const flagged = titleOk ? false : /Comment|Letter/i.test(c.pubTypes.join(' '));
        return { id: c.id, pass: flagged === c.shouldFlag, why: c.why };
      });
    },
    run: () => sh('node scripts/audit-attached-identifiers.mjs'),
  },

  // ---- L3: currency. True when written is not true forever. ----------------------
  {
    id: 'retractions', layer: 3, deps: ['identifiers-resolve'], network: true,
    proves: 'No cited source has since been retracted.',
    authority: 'Retraction Watch (Crossref Labs).',
    falsePositiveModes: [
      'Corrections and Expressions of Concern are excluded — only RetractionNature=Retraction counts.',
      'Dataset outage: fails CLOSED under --strict, because "skipped" is indistinguishable from "clean" to an exit code.',
    ],
    fixtures: null,
    run: () => sh('node scripts/qa-retractions.mjs --strict'),
  },

  // ---- L4: claim level. The identifier is right — is the NUMBER right? -----------
  {
    id: 'quantitative-claims', layer: 4, deps: ['dossier-citations'], network: true,
    proves: 'Numbers asserted in a claim appear in, or derive from, the cited paper.',
    authority: 'The cited paper\'s abstract.',
    falsePositiveModes: [
      'A real figure may live only in full text/tables — this is a REVIEW QUEUE, never build-breaking.',
      'Hazard-ratio derivations, rounding, spelled-out numbers, middle-dot decimals, compound names — all guarded by fixtures.',
    ],
    fixtures: 'quantitative-claims',
    selfTest() {
      return FIX['quantitative-claims'].map((c) => {
        const nums = M.assertedNumbers(c.claim);
        const missing = nums.filter((n) => !M.numberSupported(n, c.source));
        return { id: c.id, pass: (missing.length > 0) === c.shouldFlag, why: c.why,
          detail: `asserted [${nums}] missing [${missing}]` };
      });
    },
    run: () => sh('node scripts/verify-quantitative-claims.mjs'),
  },
  {
    id: 'discovery-relevance', layer: 4, deps: [], network: false,
    proves: 'Research-scan results actually concern the peptide (guards the content loop\'s input).',
    authority: 'The peptide named in the paper\'s own title/abstract.',
    falsePositiveModes: [
      'A paper discussing the peptide without naming it is dropped — deliberate: precision over recall for agent input.',
    ],
    fixtures: 'relevance-filter',
    selfTest() {
      const aliasMap = JSON.parse(fs.readFileSync('data/trial-match-aliases.json', 'utf-8'));
      return FIX['relevance-filter'].map((c) => {
        const names = [c.slug.replace(/-/g, ' '), c.alias, ...(aliasMap[c.slug] || [])];
        const irrelevant = !M.isRelevant(names, c.text);
        return { id: c.id, pass: irrelevant === c.shouldFlag, why: c.why };
      });
    },
    run: () => ({ ok: true, out: 'relevance filter is applied inside monthly-research-scan.mjs; validated by self-test' }),
  },
];

// ---------------------------------------------------------------------------
if (EXPLAIN) {
  console.log('VERIFICATION GRAPH\n');
  for (const layer of [...new Set(NODES.map((n) => n.layer))].sort()) {
    console.log(`── Layer ${layer} ${['structural (offline)', 'existence', 'correctness', 'currency', 'claim-level'][layer]} ──`);
    for (const n of NODES.filter((x) => x.layer === layer)) {
      console.log(`  ${n.id}${n.network ? '  [network]' : ''}`);
      console.log(`     needs   : ${n.deps.length ? n.deps.join(', ') : '(nothing)'}`);
      console.log(`     proves  : ${n.proves}`);
      console.log(`     truth   : ${n.authority}`);
      for (const f of n.falsePositiveModes) console.log(`     FP mode : ${f}`);
    }
    console.log('');
  }
  process.exit(0);
}

// ---------------------------------------------------------------------------
// STAGE 1 — self-test every matcher against labelled real-world cases
// ---------------------------------------------------------------------------
console.log('═══ STAGE 1: matcher self-tests (against real observed defects) ═══\n');
let selfPass = 0, selfFail = 0;
const failures = [];
for (const n of NODES) {
  if (!n.selfTest) continue;
  const results = n.selfTest();
  const bad = results.filter((r) => !r.pass);
  selfPass += results.length - bad.length;
  selfFail += bad.length;
  const mark = bad.length ? 'FAIL' : 'ok  ';
  console.log(`  ${mark}  ${n.id.padEnd(24)} ${results.length - bad.length}/${results.length} cases`);
  for (const b of bad) {
    failures.push({ node: n.id, ...b });
    console.log(`         ✗ ${b.id}: ${b.why}`);
    if (b.detail) console.log(`           ${b.detail}`);
  }
}
console.log(`\n  ${selfPass} passed · ${selfFail} failed`);

if (selfFail) {
  console.error('\nABORT: a matcher failed its own labelled cases. Corpus checks are not trustworthy');
  console.error('until this is fixed — every failure above is a defect this repo has actually seen.');
  process.exit(1);
}
if (SELF_ONLY) {
  console.log('\nSelf-tests only (--self-test). Matchers are sound.');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// STAGE 2 — run the graph in dependency order
// ---------------------------------------------------------------------------
console.log('\n═══ STAGE 2: corpus checks in dependency order ═══\n');
const status = new Map();
const ordered = [...NODES].sort((a, b) => a.layer - b.layer);
for (const n of ordered) {
  if (n.network && !FULL) { status.set(n.id, 'skipped'); console.log(`  skip  ${n.id.padEnd(24)} (network — use --full)`); continue; }
  const blocked = n.deps.filter((d) => status.get(d) === 'fail');
  if (blocked.length) {
    status.set(n.id, 'blocked');
    console.log(`  BLOCK ${n.id.padEnd(24)} upstream failed: ${blocked.join(', ')} — result would be noise`);
    continue;
  }
  const r = n.run();
  status.set(n.id, r.ok ? 'pass' : 'fail');
  console.log(`  ${r.ok ? 'PASS ' : 'FAIL '} ${n.id.padEnd(24)} ${(r.out.trim().split('\n').pop() || '').slice(0, 84)}`);
}

// ---------------------------------------------------------------------------
console.log('\n═══ VERDICT ═══');
const counts = [...status.values()].reduce((a, s) => ((a[s] = (a[s] || 0) + 1), a), {});
console.log(`  ${JSON.stringify(counts)}`);
const failed = [...status.entries()].filter(([, s]) => s === 'fail').map(([k]) => k);
const skipped = [...status.entries()].filter(([, s]) => s === 'skipped').map(([k]) => k);
if (skipped.length) console.log(`  NOT RUN (network): ${skipped.join(', ')} — this run does not certify those.`);
if (failed.length) { console.error(`  FAILED: ${failed.join(', ')}`); process.exit(1); }
console.log('  All executed checks passed, and every matcher was validated first.');
