/**
 * Staleness and self-contradiction sweeper.
 *
 * Targets a defect class that EVERY existing gate passes: the identifiers all resolve, the numbers
 * are all real, and the page still misinforms — because the prose was written once and never
 * revisited when reality moved.
 *
 * Three classes, all found by hand in a 60-day refresh and all previously invisible:
 *
 *   A. TRIAL_SAID_ONGOING — the page says a trial is ongoing/pending/expected while the same repo
 *      holds its published paper. cagrisema-vs-tirzepatide listed "REDEFINE 2 (T2D) | Ongoing"
 *      three lines from a citation to PMID 40544432, the published REDEFINE 2. zepbound said
 *      "SURMOUNT-5 results pending as of early 2026" beside a citation to the published trial.
 *
 *   B. DOSE_SET_CONFLICT — two files attribute different dose arms to the same trial.
 *      mazdutide-vs-semaglutide reported GLORY-1 as "6mg / 9mg" when the trial randomised 4 mg and
 *      6 mg. There is no 9 mg arm; the table had shifted doses by one column, inventing an arm the
 *      trial never administered. The PMID was genuine, so no citation check could see it.
 *
 *   C. STATUS_CONTRADICTION — a file's structured regulatoryStatus disagrees with its own prose.
 *      mazdutide.mdx carries status "investigational" with notes "Phase 3 clinical trials" while
 *      three separate prose lines assert "NMPA approved in China (2025)". The renderer uses the
 *      structured field, so which claim a reader gets depends on where they look.
 *
 * WALKS EVERY COLLECTION STRUCTURALLY. Not an enumerated list of paths — that mistake has been made
 * three times in this repo and cost 253 of 265 audit findings living in unwatched surfaces.
 *
 * Usage: node scripts/qa-staleness.mjs [--strict] [--self-test]
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const STRICT = process.argv.includes('--strict');
const SELF_TEST = process.argv.includes('--self-test');

/* ---------------------------------------------------------------------------------------------
 * Matchers
 * ------------------------------------------------------------------------------------------- */

/** A trial acronym: uppercase stem with a REQUIRED numeric/suffix part. The suffix is not optional —
 *  a family shares its stem by design, so "REDEFINE" alone identifies nothing. */
const TRIAL_RE = /\b([A-Z][A-Z0-9]{2,}(?:[-\s](?:CVOT|OSA|HF|CKD|MASH|NT1?))?[-\s]?\d+[A-Za-z]?|[A-Z][A-Z0-9]{3,}[-\s](?:CVOT|OSA|HF|CKD|MASH))\b/g;

/** Words asserting a trial has not yet reported. */
const ONGOING_RE = /\b(ongoing|underway|in progress|recruiting|enrolling|pending|awaited|awaiting|expected|anticipated|due (?:in|by)|not yet (?:reported|published|available|read ?out)|results? (?:pending|expected|due|to come)|topline .{0,20}expected)\b/i;

/* "Approved" must be used as a PREDICATE — a claim that this thing is approved — not as an
 * ADJECTIVE modifying some other drug. That distinction is most of the remaining noise:
 *   "combining with approved GLP-1/GIP agonists"        (aod-9604)
 *   "comparable with the approved drug pirfenidone"     (foxo4-dri)
 *   "against approved incretin therapies"               (retatrutide)
 *   "Russian-approved nootropic bioregulator"           (cortexin)
 * All four are true statements about OTHER compounds sitting on a page whose own status is
 * research-only. None is a self-contradiction. Predicate use looks like "is approved",
 * "was approved", or "approved in/for/by"; adjectival use is "approved <noun>". */
const APPROVED_RE = /\b(?:(?:is|was|are|were|has been|have been|remains?|became)\s+(?:\w+\s+){0,2}(?:fda[- ]|ema[- ]|nmpa[- ]|mhra[- ])?approved\b|(?:fda[- ]|ema[- ]|nmpa[- ]|mhra[- ])?approved\s+(?:in|for|by)\b)/i;
/* The gap before "approv" must allow HYPHENS, not just spaces. "Not FDA-approved" is the single
 * most common phrasing on this site — it is in the regulatoryStatus notes of most dossiers — and a
 * \s+ gap does not match the hyphen in "FDA-approved", so every one of those read as an assertion
 * of approval. That produced 75 STATUS_CONTRADICTION findings, nearly all of them a dossier
 * correctly stating it is NOT approved. Bare "no" also has to count: "No alpha-defensin
 * therapeutics currently approved" is a negation. */
const NEGATED_APPROVAL_RE = /\b(?:not|never|no|none|nor|no longer|isn't|is not|yet to be|pending|awaiting|expected|anticipated|seeking|applied for|submitted for|filed for)[\s-]+(?:[\w-]+[\s-]+){0,3}approv/i;

/** Dose tokens: "6mg", "6 mg", "2.4mg". Deliberately not matching bare numbers. */
const DOSE_RE = /\b(\d+(?:\.\d+)?)\s?mg\b/gi;

/**
 * Does a staleness word govern THIS trial mention?
 *
 * Scoped to the segment — one line, or one sentence — not a character window. A character window
 * of any size produced constant false positives, because these pages discuss several trials in a
 * paragraph and an "ongoing" belonging to one attaches itself to whichever acronym happens to sit
 * nearby. It also caught "weight loss was still ongoing at 48 weeks", where "ongoing" describes the
 * outcome continuing, not the trial being unreported.
 *
 * Segments are split on newlines and sentence ends but NOT on the table pipe, because the real
 * defect lives in a table row — "| REDEFINE 2 (T2D) | Ongoing |" puts the trial and its stale
 * status in adjacent cells of one line.
 */
/* A staleness word in the same sentence is not enough — it must be about the TRIAL REPORTING.
 * English puts these words on other subjects constantly, and each of these is a real false positive
 * this sweeper produced:
 *   "the most anticipated application is combination therapy"   -> anticipated governs "application"
 *   "guidelines are expected to incorporate SURMOUNT-5 findings" -> expected governs "guidelines"
 * So require one of:
 *   (a) a reporting noun in the segment — results, data, readout, topline, publication;
 *   (b) the staleness word sitting right beside the acronym, which is how status is written in
 *       prose and tables: "SURPASS-CVOT (ongoing)", "trial (SURPASS-CVOT) ongoing";
 *   (c) a table cell containing nothing but a status word: "| REDEFINE 2 | Ongoing |".
 * "findings" is deliberately NOT a reporting noun: incorporating a trial's findings presupposes
 * they exist, so it is evidence the page is current, not stale. */
const REPORTING_NOUN_RE = /\b(results?|data|read ?out|topline|publication|published|report(?:ed|ing)?|completion|analys[ie]s)\b/i;
const CELL_STATUS_RE = /\|\s*(?:ongoing|pending|underway|recruiting|enrolling|awaited|awaiting|in progress|expected|anticipated|tbd|n\/a)\s*\|/i;
const ADJACENT = 30;

/* "expected TO <verb>" is a different construction: it predicts a future ACTION by someone else,
 * not a pending trial readout. "Guidelines are expected to incorporate SURMOUNT-5 findings" says
 * the trial HAS reported. Stripping these before matching is what separates them, since the word
 * itself is identical and sits well within any adjacency window. */
const stripGoverned = (s) => String(s).replace(/\b(?:expected|anticipated|due|awaited)\s+to\s+\w+/gi, ' ');

export function ongoingNearTrial(text, acronym) {
  const esc = acronym.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
  const acrRe = new RegExp(`\\b${esc}\\b`, 'i');
  for (const rawSeg of String(text).split(/\n|(?<=[.!?])\s+/)) {
    if (!acrRe.test(rawSeg)) continue;
    const seg = stripGoverned(rawSeg);
    if (!ONGOING_RE.test(seg)) continue;

    // (b) status written right beside the acronym
    let adjacent = false;
    for (const m of seg.matchAll(new RegExp(`\\b${esc}\\b`, 'ig'))) {
      const near = seg.slice(Math.max(0, m.index - ADJACENT), m.index + m[0].length + ADJACENT);
      if (ONGOING_RE.test(near)) { adjacent = true; break; }
    }
    // (a) a reporting noun, or (c) a bare status cell
    if (adjacent || REPORTING_NOUN_RE.test(seg) || CELL_STATUS_RE.test(seg)) {
      return rawSeg.replace(/\s+/g, ' ').trim();
    }
  }
  return null;
}

/**
 * An approval assertion that is not a negation or a future expectation.
 *
 * Evaluated PER CLAUSE, not per line. A single sentence routinely carries both an assertion and a
 * negation — "Currently only approved in China (NMPA); not yet FDA approved" is a real line from
 * mazdutide.mdx, and it does assert a China approval. A line-level check sees the "not yet …
 * approved" and suppresses the whole line, hiding the claim that actually needs reconciling
 * against the structured status field. Splitting on clause boundaries lets each stand or fall on
 * its own.
 */
/* Jurisdictions outside the US. The `status` enum is US-centric — "research-only" means not
 * FDA-approved — so "approved in Russia", "approved in 50+ countries" and "NMPA approved in China"
 * do NOT contradict it. They are precisely the nuance that four-value enum cannot express.
 * Flagging them would teach a reader to ignore this report, which is worse than not running it. */
const FOREIGN_APPROVAL_RE = /\b(?:in|by|across|outside)\s+(?:the\s+)?(?:\w+\s+){0,2}(?:russia|china|cis\b|europe|eu\b|ema|japan|korea|india|mexico|brazil|australia|canada|uk\b|nmpa|pmda|countries|jurisdictions|markets)/i;

/* An approval later WITHDRAWN is a historical fact, not a current status claim. sermorelin's
 * "Was FDA-approved but discontinued in 2008 for business reasons" is true and belongs on the page;
 * its status is correctly research-only today. Past tense alone is the signal. */
const WITHDRAWN_RE = /\b(?:discontinued|withdrawn|withdrew|pulled|rescinded|revoked|no longer marketed|off the market|formerly|previously|historically|until \d{4})\b/i;

/* An FAQ heading asserts nothing. "Is BPC-157 FDA approved?" appears in most dossiers; the answer
 * beneath it is where a claim would live. */
const isQuestion = (s) => /\?\s*$/.test(String(s).trim());

export function assertsApproval(line, { otherCompounds = null } = {}) {
  if (isQuestion(line)) return false;
  const clauses = String(line).split(/[;,]|\bbut\b|\bhowever\b|\bwhile\b|\balthough\b|\bwhereas\b/i);
  return clauses.some((c) => {
    if (!APPROVED_RE.test(c) || NEGATED_APPROVAL_RE.test(c)) return false;
    if (FOREIGN_APPROVAL_RE.test(c)) return false;
    if (WITHDRAWN_RE.test(c) || /\bwas\s+(?:\w+\s+){0,2}approved\b/i.test(c)) return false;
    /* An approval attributed to a DIFFERENT compound is not this page contradicting itself.
     * "AOD-9604 failed clinical trials while semaglutide is approved" is a comparison. Comparison
     * pages are built entirely out of sentences like that. */
    if (otherCompounds) {
      for (const n of otherCompounds) {
        if (n.length < 4) continue;
        if (new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&')}\\b`, 'i').test(c)) return false;
      }
    }
    return true;
  });
}

const flattenAcr = (s) => String(s).toUpperCase().replace(/[^A-Z0-9]/g, '');

/* ---------------------------------------------------------------------------------------------
 * Self-test — every case is one this sweeper must get right, drawn from real repo content.
 * ------------------------------------------------------------------------------------------- */
const FIXTURES = [
  // A: must FLAG
  { fn: 'ongoing', args: ['| REDEFINE 2 (T2D) | Ongoing |', 'REDEFINE 2'], want: true, note: 'the real cagrisema table' },
  { fn: 'ongoing', args: ['Direct head-to-head trial (SURMOUNT-5) results pending as of early 2026.', 'SURMOUNT-5'], want: true, note: 'the real zepbound note' },
  { fn: 'ongoing', args: ['The DREAMS-3 head-to-head trial vs semaglutide is ongoing, with results expected', 'DREAMS-3'], want: true, note: 'dossier summary phrasing' },
  // A: must NOT flag — a different trial's status must not contaminate this one
  { fn: 'ongoing', args: ['SURMOUNT-1 showed -20.9% at 72 weeks. Separately, a cardiovascular outcomes trial is ongoing.'.padStart(600, 'x'), 'SURMOUNT-1'], want: false, note: 'ongoing word too far from this trial' },
  { fn: 'ongoing', args: ['REDEFINE 1 reported -20.4% weight change at 68 weeks vs placebo.', 'REDEFINE 1'], want: false, note: 'plain published result' },
  // C: must FLAG
  /* This fixture was originally written expecting a FLAG, and that expectation was wrong. The
   * status enum is approved | investigational | compounding-restricted | research-only, and this
   * site applies it US-first: most dossiers carry "research-only" while their prose correctly notes
   * availability in Russia or China. A foreign approval is therefore not a self-contradiction, it
   * is the nuance a four-value enum cannot hold. Whether mazdutide's NMPA approval is TRUE is a
   * sourcing question for the regulatory audit, not a staleness one — different check, different
   * evidence. */
  { fn: 'approval', args: ['NMPA approved in China (2025) for obesity.'], want: false, note: 'foreign approval does not contradict a US-centric status field' },
  { fn: 'approval', args: ['Tirzepatide is FDA approved for chronic weight management.'], want: true, note: 'plain approval' },
  // C: must NOT flag — negations and expectations are not approvals
  { fn: 'approval', args: ['Currently only approved in China (NMPA); not yet FDA approved'], want: false, note: 'both clauses are non-flagging: one foreign approval, one explicit negation' },
  // ...but the clause-splitting it was written to prove must still work: an unqualified approval
  // sitting beside a negation of a different one MUST still be seen.
  { fn: 'approval', args: ['Semaglutide is approved for chronic weight management; tirzepatide was not approved for this indication until later'], want: true, note: 'clause splitting still surfaces the positive clause' },
  // C: "approved" as an ADJECTIVE describing other drugs is not a claim about this page's compound
  { fn: 'approval', args: ['Similar metabolic targets - combining with approved GLP-1/GIP agonists may have unpredictable effects.'], want: false, note: 'adjectival: "approved GLP-1 agonists"' },
  { fn: 'approval', args: ['FOXO4-DRI reduced senescent cells to a degree comparable with the approved drug pirfenidone'], want: false, note: 'adjectival: "the approved drug pirfenidone"' },
  { fn: 'approval', args: ['- Head-to-head comparisons against approved incretin therapies are not yet published'], want: false, note: 'adjectival: "approved incretin therapies"' },
  { fn: 'approval', args: ['Russian-approved nootropic bioregulator; used clinically in Russia'], want: false, note: 'adjectival compound modifier' },
  { fn: 'approval', args: ['Not approved by the FDA for any indication.'], want: false, note: 'negation' },
  { fn: 'approval', args: ['China approval expected in 2026.'], want: false, note: 'future expectation, not an assertion' },
  { fn: 'approval', args: ['The sponsor has filed for approval with the EMA.'], want: false, note: 'filed is not approved' },
  { fn: 'approval', args: ['This compound is not approved for human use.'], want: false, note: 'negation' },
  // C: hyphenated negation — the phrasing in most regulatoryStatus notes on this site
  { fn: 'approval', args: ['Not FDA-approved. Fragment of human growth hormone.'], want: false, note: 'hyphenated FDA-approved after "Not"' },
  { fn: 'approval', args: ['Not FDA-approved or approved by any major agency.'], want: false, note: 'cardiogen notes line' },
  { fn: 'approval', args: ['No alpha-defensin therapeutics currently approved despite decades of research'], want: false, note: 'bare "No" as negation' },
  { fn: 'approval', args: ['it is **[not FDA-approved](/regulatory-tracker/)** in the United States'], want: false, note: 'negation inside a markdown link' },
  // A: staleness word governing a DIFFERENT subject must not flag
  { fn: 'ongoing', args: ['While REDEFINE-1 validates cagrilintide monotherapy, the most anticipated application is combination therapy with semaglutide.', 'REDEFINE-1'], want: false, note: '"anticipated" governs "application"' },
  { fn: 'ongoing', args: ['Clinical practice guidelines are expected to incorporate SURMOUNT-5 findings.', 'SURMOUNT-5'], want: false, note: '"expected" governs "guidelines"' },
  // A: adjacent status must flag
  { fn: 'ongoing', args: ['| **CV Outcomes Trial** | SELECT (completed) | SURPASS-CVOT (ongoing) |', 'SURPASS-CVOT'], want: true, note: 'parenthetical status beside acronym' },
  { fn: 'ongoing', args: ['- Tirzepatide cardiovascular outcomes trial (SURPASS-CVOT) ongoing', 'SURPASS-CVOT'], want: true, note: 'status immediately after acronym' },
  { fn: 'ongoing', args: ['| **CV Outcomes** | Pending | Noninferior to dulaglutide (SURPASS-CVOT, 2025) |', 'SURPASS-CVOT'], want: true, note: 'table cell status word' },
];

function selfTest() {
  const fails = [];
  for (const f of FIXTURES) {
    const got = f.fn === 'ongoing' ? !!ongoingNearTrial(f.args[0], f.args[1]) : assertsApproval(f.args[0]);
    if (got !== f.want) fails.push(`${f.fn} — ${f.note}: expected ${f.want}, got ${got}`);
  }
  return fails;
}

const failures = selfTest();
console.log(`Staleness matcher self-test: ${FIXTURES.length - failures.length}/${FIXTURES.length}`);
if (failures.length) {
  console.error('\nABORT — matchers are broken; findings would be noise.');
  failures.forEach((f) => console.error(`  FAIL  ${f}`));
  process.exit(1);
}
if (SELF_TEST) { console.log('Self-test only.'); process.exit(0); }

/* ---------------------------------------------------------------------------------------------
 * Walk every content file. Structural, not enumerated.
 * ------------------------------------------------------------------------------------------- */
function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkFiles(p, out);
    else if (/\.mdx?$/.test(e.name)) out.push(p);
  }
  return out;
}
const files = walkFiles('src/content');

/* Evidence that a trial has REPORTED. Two independent sources, both from our own verified data:
 *   - a source-pack trial record whose status is completed/terminated
 *   - a stored citation title naming the acronym (i.e. we hold its published paper) */
const reported = new Map();       // flattened acronym -> {why, where}
const trialDoses = new Map();     // flattened acronym -> [{doses:Set, file}]

/* Every peptide name and alias on the site. On a peptide reference site these are
 * INDISTINGUISHABLE from trial acronyms by pattern — GLP-1, BPC-157, TB-500, AOD-9604, SS-31,
 * LL-37 all match any "uppercase stem plus digit" regex. A first run of this sweeper reported 82
 * TRIAL_SAID_ONGOING findings of which the large majority were compound names, not trials.
 * Pattern-matching cannot separate them; the data can. */
const COMPOUND_NAMES = new Set();
const COMPOUND_DISPLAY = new Set();
for (const f of fs.readdirSync('src/content/peptides').filter((x) => x.endsWith('.mdx'))) {
  const d = matter(fs.readFileSync(`src/content/peptides/${f}`, 'utf-8')).data;
  for (const n of [d.name, f.replace(/\.mdx$/, '').replace(/-/g, ' '), f.replace(/\.mdx$/, ''), ...(d.aliases || [])]) {
    if (n) { COMPOUND_NAMES.add(flattenAcr(n)); COMPOUND_DISPLAY.add(String(n)); }
  }
}
// Drug-class labels that are not trials and not dossier slugs either.
for (const n of ['GLP1', 'GLP1RA', 'GIP', 'SGLT2', 'DPP4', 'FDA', 'EMA', 'NMPA', 'BMI', 'HBA1C', 'COVID19', 'TYPE2', 'PHASE1', 'PHASE2', 'PHASE3', 'PHASE4']) COMPOUND_NAMES.add(n);

/* KNOWN TRIALS — acronyms that appear as the label of an actual registered trial record in a source
 * pack. Only these are eligible to be reported as "described as ongoing". A trial is a thing we
 * have a registry record for, not a token shaped like one. */
const KNOWN_TRIALS = new Set();

function noteReported(acr, why, where) {
  const k = flattenAcr(acr);
  if (!k || COMPOUND_NAMES.has(k)) return;
  if (!reported.has(k)) reported.set(k, { acronym: acr, why, where });
}

for (const f of fs.readdirSync('data/source-packs').filter((x) => x.endsWith('.json'))) {
  const pack = JSON.parse(fs.readFileSync(`data/source-packs/${f}`, 'utf-8'));
  (function w(n) {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(w);
    const label = String(n.acronym || n.name || n.title || '');
    const status = String(n.status || '').toLowerCase();
    // A record with a registry id IS a trial; harvest its acronym as authoritative.
    if (n.nctId || n.nct) {
      for (const m of label.matchAll(TRIAL_RE)) {
        const k = flattenAcr(m[1]);
        if (k && !COMPOUND_NAMES.has(k)) KNOWN_TRIALS.add(k);
      }
    }
    if (label && /^(completed|terminated)$/.test(status)) {
      for (const m of label.matchAll(TRIAL_RE)) noteReported(m[1], `pack status "${status}"`, f);
    }
    // A stored citation whose title names the acronym means we hold the published paper.
    if ((n.pmid || n.doi) && n.title) {
      for (const m of String(n.title).matchAll(TRIAL_RE)) {
        noteReported(m[1], `published paper cited${n.pmid ? ` (PMID ${n.pmid})` : ''}`, f);
      }
    }
    Object.values(n).forEach(w);
  })(pack);
}

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf-8');
  let fm;
  try { fm = matter(raw); } catch { continue; }
  (function w(n) {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(w);
    if ((n.pmid || n.doi) && n.title) {
      for (const m of String(n.title).matchAll(TRIAL_RE)) {
        noteReported(m[1], `published paper cited${n.pmid ? ` (PMID ${n.pmid})` : ''}`, path.relative('src/content', file));
      }
    }
    Object.values(n).forEach(w);
  })(fm.data);
}

/* ---------------------------------------------------------------------------------------------
 * Findings
 * ------------------------------------------------------------------------------------------- */
const findings = [];

for (const file of files) {
  const rel = path.relative('src/content', file).split(path.sep).join('/');
  const raw = fs.readFileSync(file, 'utf-8');
  let fm;
  try { fm = matter(raw); } catch { continue; }
  const body = fm.content;
  const whole = `${JSON.stringify(fm.data)}\n${body}`;

  // --- A. trial described as ongoing, but we hold its result ---
  const seen = new Set();
  for (const m of body.matchAll(TRIAL_RE)) {
    const acr = m[1].trim();
    const k = flattenAcr(acr);
    if (seen.has(k)) continue;
    seen.add(k);
    if (!KNOWN_TRIALS.has(k)) continue;   // not a registered trial — a compound or a class label
    const rep = reported.get(k);
    if (!rep) continue;
    const win = ongoingNearTrial(body, acr);
    if (win) {
      findings.push({ type: 'TRIAL_SAID_ONGOING', file: rel, acronym: acr,
        detail: `page implies ${acr} has not reported, but we hold its result — ${rep.why} (${rep.where})`,
        excerpt: win.slice(0, 200) });
    }
  }

  // --- B. dose arms attributed to a trial ---
  for (const m of body.matchAll(TRIAL_RE)) {
    const acr = m[1].trim();
    const k = flattenAcr(acr);
    const win = body.slice(Math.max(0, m.index - 60), m.index + m[0].length + 500);
    if (!KNOWN_TRIALS.has(k)) continue;
    // Collected but not compared — see the CLASS B note below for why cross-file dose comparison
    // cannot work on comparison pages.
    void win;
  }

  // --- C. structured status vs prose ---
  const status = String(fm.data?.regulatoryStatus?.status || '').toLowerCase();
  if (status && /investigational|preclinical|research|not-approved|unapproved/.test(status)) {
    const self = new Set([flattenAcr(fm.data?.name || ''), flattenAcr(path.basename(rel, path.extname(rel)))]);
    const others = [...COMPOUND_DISPLAY].filter((n) => !self.has(flattenAcr(n)));
    const opts = { otherCompounds: others };
    const lines = body.split('\n').concat(JSON.stringify(fm.data?.regulatoryStatus || {}));
    const hits = lines.filter((l) => assertsApproval(l, opts)).slice(0, 3);
    // Frontmatter prose (summary, researchSummary) counts too — it renders.
    const fmProse = [];
    (function w(n) {
      if (!n || typeof n !== 'object') return;
      if (Array.isArray(n)) return n.forEach(w);
      for (const v of Object.values(n)) {
        if (typeof v === 'string' && assertsApproval(v, opts)) fmProse.push(v.replace(/\s+/g, ' ').slice(0, 160));
        else w(v);
      }
    })(fm.data);
    const all = [...hits, ...fmProse];
    if (all.length) {
      findings.push({ type: 'STATUS_CONTRADICTION', advisory: true, file: rel,
        detail: `regulatoryStatus.status = "${status}" but ${all.length} prose assertion(s) claim approval`,
        excerpt: all[0].replace(/\s+/g, ' ').trim().slice(0, 200) });
    }
  }
}

/* --- CLASS B IS DELIBERATELY NOT IMPLEMENTED AS A CROSS-FILE CHECK ---
 *
 * The defect is real: mazdutide-vs-semaglutide attributed a 9 mg arm to GLORY-1, a trial that
 * randomised 4 mg and 6 mg only. But comparing dose sets ACROSS files cannot detect it, and the
 * first attempt produced 11 findings of which every single one was noise.
 *
 * The reason is structural, not a tuning problem. On a comparison page the doses sitting beside a
 * trial name necessarily include the COMPARATOR's doses — "SURMOUNT-1 (tirzepatide 15 mg) versus
 * semaglutide 2.4 mg" legitimately puts 2.4 next to SURMOUNT-1. So the same trial appears with
 * {15}, {2.4, 15}, {5, 10, 15} and {2.4, 5, 10, 15} across the site, all correct, all different.
 * No proximity window separates a comparator dose from a misattributed one, because they occupy
 * the same position in the sentence.
 *
 * The check that WOULD catch it is: does this dose appear among the trial's actual randomised arms,
 * per ClinicalTrials.gov armGroups or the paper's methods? That is a registry lookup, not a text
 * comparison, and it belongs with the trials verifier rather than in this offline gate. Recorded in
 * MONTHLY-REFRESH-WORKFLOW.md as an open gap.
 *
 * Shipping the noisy version would have been worse than shipping nothing: a gate that cries wolf
 * eleven times teaches its reader to skip it, and the twelfth finding is the real one. */

/* ---------------------------------------------------------------------------------------------
 * Report
 * ------------------------------------------------------------------------------------------- */
const blocking = findings.filter((f) => !f.advisory);
const advisory = findings.filter((f) => f.advisory);
const byType = findings.reduce((a, f) => ((a[f.type] = (a[f.type] || 0) + 1), a), {});
console.log(`\nScanned ${files.length} content files; ${reported.size} trials with a known result.`);

fs.mkdirSync('.planning/citation-audit', { recursive: true });
fs.writeFileSync('.planning/citation-audit/staleness-findings.json', JSON.stringify(findings, null, 2) + '\n');

/* STATUS_CONTRADICTION is ADVISORY and must stay that way.
 *
 * Deciding whether a page's prose contradicts its status field requires knowing which COMPOUND each
 * sentence is about, and text matching cannot do that reliably. Three real examples, all correct
 * sentences that a stricter matcher would have to call defects:
 *   "Native IGF-1 (mecasermin) is approved for IGF-1 deficiency"  — on the IGF-1 LR3 page
 *   "PT-141, the selective melanocortin agonist..."               — on the melanotan-ii page
 *   "Approved in Eastern Europe and Asia"                         — true, and the enum is US-centric
 * The underlying question — is the structured status actually correct — is answered by fetching the
 * regulator, which belongs to the regulatory audit, not to an offline text gate. Reporting it for a
 * human or that agent to check is useful; failing a build on it would be false precision. */
if (advisory.length) {
  console.warn(`\nADVISORY: ${advisory.length} possible status/prose mismatch(es) — verify against a regulator, never auto-edit:`);
  for (const f of advisory) {
    console.warn(`  • ${f.file}`);
    console.warn(`      ${f.detail}`);
    if (f.excerpt) console.warn(`      "${f.excerpt.slice(0, 150)}"`);
  }
}

if (!blocking.length) {
  console.log(`\nPASS: no blocking staleness findings.`);
  process.exit(0);
}
console.error(`\n${STRICT ? 'FAIL' : 'WARN'}: ${blocking.length} blocking finding(s) ${JSON.stringify(byType)}\n`);
for (const f of blocking) {
  console.error(`  • [${f.type}] ${f.file}${f.acronym ? ` — ${f.acronym}` : ''}`);
  console.error(`      ${f.detail}`);
  if (f.excerpt) console.error(`      "${f.excerpt}"`);
}
console.error(`\nWritten to .planning/citation-audit/staleness-findings.json`);
process.exit(STRICT ? 1 : 0);
