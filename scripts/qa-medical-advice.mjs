/**
 * Flag content that tells the reader what to DO, rather than describing what is known.
 *
 * "No medical advice" is a hard project rule, and nothing checked it. qa-banned-content covers
 * dosing terminology, sourcing, administration instructions and overclaims — all of which are
 * *topics*. Medical advice is not a topic, it is a VOICE: the same fact stated as "trials reported
 * X" is description, and stated as "X is appropriate for patients who Y" is a recommendation.
 *
 * Found on pasireotide.mdx, whose interaction entries read "Switching from octreotide to
 * pasireotide is appropriate for resistant patients", "First-line antidiabetic recommended per
 * prescribing guidelines" and "Monitor for additive effects". Every one passed every gate.
 *
 * THE HARD PART IS NOT FINDING THE VERBS, IT IS THE THREE-WAY DISTINCTION:
 *
 *   ADVICE      the site instructing a reader or clinician          -> flag
 *   REPORTING   the site describing what a label, guideline, trial
 *               or author said or did                               -> do not flag
 *   DISCLAIMER  the site telling a reader to seek professional care -> do not flag, ever
 *
 * The disclaimer case matters most. Nearly every page ends with "Consult a healthcare provider
 * before making any decisions" — that is the OPPOSITE of medical advice, and a naive matcher on
 * "consult" or "should" would flag the very sentence that keeps the site safe, on every page, and
 * be switched off within a day.
 *
 * A NEGATED recommendation is also not advice. "Melanotan II cannot be recommended for skin
 * protection" is the site declining to advise — exactly the posture this gate exists to encourage,
 * so flagging it would punish the right behaviour.
 *
 * Reports only. Turning advice into description is an authoring judgement, not a substitution.
 *
 * Usage: node scripts/qa-medical-advice.mjs [--strict] [--self-test]
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const STRICT = process.argv.includes('--strict');
const SELF_TEST = process.argv.includes('--self-test');

/* Instructional constructions — each is a way of telling someone what to do. */
const ADVICE = [
  { name: 'appropriateness-judgement', re: /\b(?:is|are|would be|remains?)\s+(?:generally\s+|often\s+|usually\s+)?(?:appropriate|advisable|preferable|the preferred (?:option|choice|agent))\b/i },
  { name: 'may-be-considered', re: /\b(?:may|can|should|could)\s+be\s+(?:considered|used|added|combined|switched|substituted|initiated|started|continued|discontinued)\b/i },
  { name: 'should-directive', re: /\b(?:patients?|users?|individuals?|clinicians?|you)\s+should\b/i },
  { name: 'recommended', re: /\brecommended\s+(?:per|for|as|in|when|first)\b/i },
  /* "first-line" alone is descriptive, not instructional. Trials are routinely run "as first-line
   * therapy in treatment-naive patients", which states a study population — pasireotide.mdx says
   * exactly that about a real head-to-head. It only becomes advice when paired with a
   * recommending verb, so require both. */
  { name: 'first-line', re: /\b(?:recommend\w*|prefer\w*|choose|select|opt for|should use)\b[^.]{0,60}\b(?:first|second|third)[- ]line\b|\b(?:first|second|third)[- ]line\b[^.]{0,40}\b(?:is recommended|should be|is preferred|is the choice)\b/i },
  /* "use" is deliberately absent from the verb list below: it is noun/verb ambiguous, and
   * "use for erectile dysfunction is not approved" is a factual statement, not an instruction. */
  { name: 'imperative-monitoring', re: /(?:^|[.;:]\s+|\*\s+)(?:monitor|avoid|discontinue|titrate|screen)\s+(?:for|with|the|a|an|if|when|in|closely|careful)/i },
  /* Words may sit between the verb and the noun — the real line was "requires careful GLUCOSE
   * monitoring", which a pattern tolerating only "careful" missed. */
  { name: 'requires-management', re: /\brequires?\s+(?:\w+\s+){0,3}(?:monitoring|supervision|management|adjustment)\b/i },
  { name: 'is-indicated-for-people', re: /\b(?:is|are)\s+indicated\s+(?:for|in)\s+(?:patients?|people|individuals|those)\b/i },
];

/* DISCLAIMERS — the site telling a reader to seek professional care. Never advice. */
const DISCLAIMER = /\b(?:consult|speak (?:to|with)|talk to|seek)\b[^.]{0,60}\b(?:healthcare|health care|doctor|physician|clinician|provider|professional|medical)\b|not (?:constitute |intended as )?medical advice|educational purposes only|for informational purposes/i;

/* REPORTING — the sentence attributes the statement to a document, a study or an author. */
const ATTRIBUTED = /\b(?:label|labell?ing|prescribing information|package insert|guideline|guidance|FDA|EMA|NICE|monograph|authors?|investigators?|trial|study|studies|paper|review|per the|according to|reported|observed|protocol specified)\b|were (?:randomi[sz]ed|assigned|given|treated|monitored)/i;

/* NEGATION — the site declining to recommend. The window is wide because the negator is often the
 * sentence subject: "No peptide in this class should be considered a substitute for ...". */
const NEGATED = /\b(?:cannot|can ?not|can't|should ?not|shouldn't|must ?not|is ?not|are ?not|isn't|aren't|no|never|not)\s+(?:\w+\s+){0,7}(?:recommend|advis|appropriate|consider|indicated|approved|establish)/i;

const isAdvice = (line) => {
  if (DISCLAIMER.test(line)) return null;
  if (NEGATED.test(line)) return null;
  if (ATTRIBUTED.test(line)) return null;
  for (const p of ADVICE) if (p.re.test(line)) return p.name;
  return null;
};

/* Every fixture is a real sentence from this repo, or a construction the matcher must never
 * mistake for one. */
const FIXTURES = [
  // must FLAG — the actual pasireotide interaction entries
  { t: 'Switching from octreotide to pasireotide is appropriate for resistant patients.', want: true, note: 'appropriateness judgement' },
  { t: 'Pasireotide may be considered after lanreotide failure due to superior SSTR5 affinity.', want: true, note: 'may be considered' },
  { t: 'First-line antidiabetic recommended per prescribing guidelines.', want: true, note: 'first-line plus recommended' },
  { t: 'Monitor for additive effects on tumor shrinkage.', want: true, note: 'imperative monitoring' },
  { t: 'Requires careful glucose monitoring as pasireotide suppresses insulin secretion.', want: true, note: 'requires monitoring with an intervening noun' },
  { t: 'Patients should discontinue if adverse effects develop.', want: true, note: 'patients should' },
  // must NOT flag — disclaimers, which appear on nearly every page
  { t: 'Consult a qualified healthcare provider before considering any peptide regimen.', want: false, note: 'the standard disclaimer' },
  { t: 'This comparison is for educational purposes only and is not medical advice.', want: false, note: 'explicit non-advice' },
  { t: 'Always consult a healthcare provider for treatment decisions.', want: false, note: 'disclaimer containing always' },
  { t: 'Treatment decisions should be made with a healthcare provider based on individual circumstances.', want: false, note: 'should plus disclaimer in one sentence' },
  // must NOT flag — reporting what a document, trial or author said
  { t: 'The FDA label recommends monitoring liver enzymes during the first six months.', want: false, note: 'attributed to the label' },
  { t: 'Trial protocol specified that participants should discontinue on grade 3 toxicity.', want: false, note: 'attributed to the protocol' },
  { t: 'The authors concluded that the combination may be considered in resistant disease.', want: false, note: 'attributed to authors' },
  { t: 'Semaglutide is indicated for patients with type 2 diabetes per its FDA label.', want: false, note: 'attributed indication' },
  { t: 'Participants were monitored for cardiovascular events over 72 weeks.', want: false, note: 'past-tense study description' },
  { t: 'Metformin appears in the published management literature for that effect.', want: false, note: 'the corrected pasireotide wording' },
  // must NOT flag — the site DECLINING to recommend
  { t: 'The lack of regulatory approval and safety data means Melanotan II cannot be recommended for skin protection.', want: false, note: 'negated recommendation' },
  { t: 'Epithalon is not recommended for any clinical indication.', want: false, note: 'plain negation' },
  { t: 'No peptide in this class should be considered a substitute for established therapy.', want: false, note: 'negated subject' },
  // must NOT flag — "use" as a noun
  { t: 'This is the only approved indication; use for erectile dysfunction or in men is not approved.', want: false, note: 'use is a noun here' },
  // must NOT flag — "first-line" as a trial population descriptor, from the real pasireotide page
  { t: 'Superior to octreotide LAR as first-line medical therapy in treatment-naive acromegaly.', want: false, note: 'first-line describing a trial population' },
  // ...but must still FLAG it when paired with a recommending verb
  { t: 'Metformin is recommended as first-line therapy for this indication.', want: true, note: 'first-line plus a recommending verb' },
];

const fails = FIXTURES.filter((f) => !!isAdvice(f.t) !== f.want)
  .map((f) => `${f.note}: expected ${f.want}, got ${!!isAdvice(f.t)}`);
console.log(`Advice-voice self-test: ${FIXTURES.length - fails.length}/${FIXTURES.length}`);
if (fails.length) {
  console.error('\nABORT — the matcher is wrong; findings would be noise.');
  fails.forEach((f) => console.error(`  FAIL  ${f}`));
  process.exit(1);
}
if (SELF_TEST) { console.log('Self-test only.'); process.exit(0); }

/* Walk every collection structurally — not an enumerated list of paths. */
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.mdx?$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = walk('src/content');
const findings = [];
for (const file of files) {
  const rel = path.relative('src/content', file).split(path.sep).join('/');
  let fm;
  try { fm = matter(fs.readFileSync(file, 'utf-8')); } catch { continue; }

  const scan = (text, where) => {
    for (const line of String(text).split(/\n|(?<=[.!?])\s+/)) {
      const hit = isAdvice(line);
      if (hit) findings.push({ file: rel, where, pattern: hit, line: line.trim().slice(0, 150) });
    }
  };
  // Frontmatter prose renders, so it is in scope.
  (function w(n, p) {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach((x, i) => w(x, `${p}[${i}]`));
    for (const [k, v] of Object.entries(n)) {
      if (typeof v === 'string' && v.length > 25) scan(v, `frontmatter.${p ? `${p}.` : ''}${k}`);
      else w(v, p ? `${p}.${k}` : k);
    }
  })(fm.data, '');
  scan(fm.content, 'body');
}

const byFile = findings.reduce((a, f) => ((a[f.file] = (a[f.file] || 0) + 1), a), {});
const byPattern = findings.reduce((a, f) => ((a[f.pattern] = (a[f.pattern] || 0) + 1), a), {});

fs.mkdirSync('.planning/citation-audit', { recursive: true });
fs.writeFileSync('.planning/citation-audit/medical-advice.json', JSON.stringify(findings, null, 2) + '\n');

console.log(`\nScanned ${files.length} files.`);
if (!findings.length) { console.log('PASS: no instructional voice found.'); process.exit(0); }

console.error(`\n${STRICT ? 'FAIL' : 'WARN'}: ${findings.length} passage(s) read as instruction rather than description`);
console.error(`  by pattern: ${JSON.stringify(byPattern)}`);
console.error(`  files affected: ${Object.keys(byFile).length}\n`);
for (const [file, n] of Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 20)) {
  console.error(`  ${String(n).padStart(3)}  ${file}`);
  for (const f of findings.filter((x) => x.file === file).slice(0, 2)) {
    console.error(`         [${f.pattern}] ${f.where}`);
    console.error(`         "${f.line}"`);
  }
}
console.error(`\nWritten to .planning/citation-audit/medical-advice.json`);
process.exit(STRICT ? 1 : 0);
