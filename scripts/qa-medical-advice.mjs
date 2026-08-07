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
  /* "It can be used: monotherapy / combination" under an approval description is an INDICATION
   * LIST — it enumerates what a regulator authorised, not what a reader should do. An
   * "approved"/"indicated"/"authorised" nearby is a strong signal of that. */
  { name: 'may-be-considered', re: /\b(?:may|can|should|could)\s+be\s+(?:considered|used|added|combined|switched|substituted|initiated|started|continued|discontinued)\b/i,
    unless: /\b(?:approved|indicated|authoris|authoriz|licen[cs]ed)\b/i },
  { name: 'should-directive', re: /\b(?:patients?|users?|individuals?|clinicians?|you)\s+should\b/i },
  { name: 'recommended', re: /\brecommended\s+(?:per|for|as|in|when|first)\b/i },
  /* "first-line" alone is descriptive, not instructional. Trials are routinely run "as first-line
   * therapy in treatment-naive patients", which states a study population — pasireotide.mdx says
   * exactly that about a real head-to-head. It only becomes advice when paired with a
   * recommending verb, so require both. */
  { name: 'first-line', re: /\b(?:recommend\w*|prefer\w*|choose|select|opt for|should use)\b[^.]{0,60}\b(?:first|second|third)[- ]line\b|\b(?:first|second|third)[- ]line\b[^.]{0,40}\b(?:is recommended|should be|is preferred|is the choice)\b/i },
  /* "use" is deliberately absent from the verb list below: it is noun/verb ambiguous, and
   * "use for erectile dysfunction is not approved" is a factual statement, not an instruction. */
  /* The boundary must include "- " and "| " list/table markers, not just "* ".
   * It originally accepted only "* ", and semaglutide-safety.mdx:49 carried
   * "- **Pancreatitis** — Discontinue if suspected" — a bare clinical imperative on a safety page,
   * sitting UNFLAGGED next to an identical line that was flagged, purely because of the bullet
   * character. A gate that depends on markdown punctuation is not checking what it claims to. */
  /* Allow an OBJECT between the imperative verb and its condition: "Discontinue semaglutide if
   * pancreatitis is suspected" is the same instruction as "Discontinue if suspected", and a
   * pattern that only accepted the bare form missed it. */
  { name: 'imperative-monitoring', re: /(?:^|[.;:—–]\s*|[*\-|]\s+)(?:monitor|discontinue|titrate|screen)\s+(?:\w+\s+){0,2}(?:for|with|the|a|an|if|when|in|closely|careful)/i },
  /* "avoid" is split out and NOT addressee-exempt. The other clinical imperatives take a person or
   * a drug as their implied object; "avoid" just as readily governs a chemical process —
   * "Avoid acetylation when the free N-terminus is required" is synthesis guidance in a glossary
   * entry, with nobody in it. */
  { name: 'imperative-avoid', re: /(?:^|[.;:—–]\s*|[*\-|]\s+)avoid\s+(?:\w+\s+){0,2}(?:for|with|the|a|an|if|when|in|closely|careful)/i },
  /* Words may sit between the verb and the noun — the real line was "requires careful GLUCOSE
   * monitoring", which a pattern tolerating only "careful" missed. */
  /* "requires a prescription" / "requires medical supervision" describes what KIND of drug
   * something is — a regulatory fact, not a management instruction. Excluded explicitly, because
   * it appears in disclaimer lines and under "Administration" headings across the site. */
  { name: 'requires-management', re: /\brequires?\s+(?:\w+\s+){0,3}(?:monitoring|supervision|management|adjustment)\b/i,
    unless: /\brequires?\s+(?:a\s+)?(?:prescription|medical supervision|physician supervision|clinical supervision)\b|prescription[- ]only/i },
  { name: 'is-indicated-for-people', re: /\b(?:is|are)\s+indicated\s+(?:for|in)\s+(?:patients?|people|individuals|those)\b/i },
];

/* DISCLAIMERS — the site telling a reader to seek professional care. Never advice.
 * Role nouns must allow plurals: the real line is "consult qualified professionalS", and a
 * singular-only pattern flagged the site's own safety language as if it were advice. */
const DISCLAIMER = /\b(?:consult|speak (?:to|with)|talk to|seek|discuss|communicat\w+)\b[^.]{0,90}\b(?:healthcare|health care|doctors?|physicians?|clinicians?|providers?|professionals?|specialists?|pharmacists?|hepatologists?|gastroenterologists?|endocrinologists?|oncologists?|medical team)\b|not (?:constitute |intended as )?medical advice|educational purposes only|for informational purposes|requires? (?:a )?(?:prescription|medical supervision|physician oversight|clinical oversight|specialist supervision)/i;

/* A REFERRAL is a disclaimer with different grammar.
 *
 * The disclaimer pattern keys on a "consult"-type verb, so it misses the form where the CLINICIAN
 * is the subject: "An allergist/immunologist can determine if desensitization is appropriate for
 * your specific situation." That performs exactly the protective function — it hands the decision
 * to a professional — and is common in FAQ answers. Reported by the editor working the glossary. */
const REFERRAL = /\b(?:an?\s+)?(?:allergist|immunologist|endocrinologist|oncologist|hepatologist|gastroenterologist|cardiologist|specialist|physician|doctor|clinician|prescriber|provider|healthcare team)\b[^.]{0,60}\b(?:can|will|should|must)\s+(?:determine|decide|assess|evaluate|advise|judge|weigh)/i;

/* REPORTING A CONSENSUS is not making a recommendation.
 *
 * "Surgical orchiopexy is now preferred as first-line treatment" describes what the field settled
 * on — and on the hcg page it is sourced, to the AUA Guideline cited in that same file. "Current
 * standard of care remains appropriate for most patients" is a caution against substituting an
 * investigational drug for established care. Both are the site describing practice, not directing
 * it, and both were reported as false positives by the editors. */
/* Bare "guidelines" is deliberately NOT in this list. It appears on both sides: "guidelines
 * recommend X" reports someone else's position, but "recommended per prescribing guidelines" is
 * the site making the recommendation and citing guidelines as backing — which is the original
 * pasireotide finding this whole gate was built for. Including the word suppressed it. */
const CONSENSUS = /\b(?:standard of care|standard treatment|current practice)\b|\bstandard\b[^.]{0,30}\b(?:monitoring|care|treatment|practice|follow-up)\b[^.]{0,30}\bremains?\b|\bis (?:now |currently )?(?:preferred|standard|the standard|established practice)\b|\brecommended for (?:older|younger|adult|pediatric|elderly|at-risk|high-risk)\b/i;

/* STRUCTURAL EXCLUSIONS — shapes that cannot be instruction whatever verbs they contain.
 *
 *  A QUESTION asks rather than directs. "Which patients should transition?" is a section heading
 *  on a news post.
 *  A HEADING is a label: "### Can Be Used" is a contents entry, not a recommendation.
 *  "considered a proven / established treatment" is EPISTEMIC — a statement about how much is
 *  known. That is the hedging this site should be doing, and the opposite of an instruction.
 *  "should know" / "should be aware" is informational framing: "What patients should know" is a
 *  metaDescription, not direction. */
const NOT_INSTRUCTION = /\?\s*$|^\s*#{1,6}\s|\bconsidered (?:a |an )?(?:proven|established|effective|safe|standard|experimental|investigational|unproven|preliminary|speculative)\b|\bshould (?:know|be aware|expect|understand|note)\b/i;

/* ADVICE REQUIRES AN ADDRESSEE.
 *
 * This is the sharpest available test and it came from an editor working the glossary: real advice
 * necessarily has someone it is addressed to. Five false positives in that collection were a verb
 * governing a molecule, a cell, an FDA designation or a pharmacokinetic parameter — "Avoid
 * acetylation when the free N-terminus is required", "The goal is appropriate autophagy",
 * "Understanding Vd helps determine if loading doses are appropriate". None has a person in it.
 *
 * A bare predicate has no addressee either: "- Requires medical management" and
 * "| Ensure safety | Require monitoring and reporting |" are predicates of the heading or row label
 * above them, not sentences directed at anyone.
 *
 * So a line only counts as instruction when it names a person who could act on it, or a specific
 * compound that a person would take. Every one of the passages actually rewritten in this pass
 * satisfies that; none of the false positives does. */
/* "men" must not match MEN 2 — Multiple Endocrine Neoplasia type 2, which appears in boxed-warning
 * and contraindication tables across the site. A negative lookahead for a following digit keeps
 * "men should" working while excluding the syndrome. */
const HAS_ADDRESSEE = /\b(?:patients?|users?|individuals?|people|clinicians?|prescribers?|physicians?|doctors?|you|your|providers?|someone|anyone|adults?|men(?!\s*\d)|women)\b/i;

/* A named compound also counts as an addressee-bearing subject: "Discontinue semaglutide if ..."
 * is an instruction even without a person noun. Built from the dossier slugs at load time so it
 * stays current as the corpus grows, rather than from a hand-listed vocabulary that would drift. */
const COMPOUND_NAMES = (() => {
  try {
    const names = fs.readdirSync('src/content/peptides')
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, '').replace(/-/g, '[- ]?'))
      .filter((n) => n.length >= 4);
    return new RegExp(`\\b(?:${names.join('|')})\\b`, 'i');
  } catch { return /$^/; }
})();

/* REPORTING — the sentence attributes the statement to a document, a study or an author. */
const ATTRIBUTED = /\b(?:label|labell?ing|prescribing information|package insert|guideline|guidance|FDA|EMA|NICE|monograph|authors?|investigators?|trial|study|studies|paper|review|per the|according to|reported|observed|protocol specified)\b|were (?:randomi[sz]ed|assigned|given|treated|monitored)/i;

/* NEGATION — the site declining to recommend. The window is wide because the negator is often the
 * sentence subject: "No peptide in this class should be considered a substitute for ...". */
const NEGATED = /\b(?:cannot|can ?not|can't|should ?not|shouldn't|must ?not|is ?not|are ?not|isn't|aren't|neither|nor|no|never|not)\s+(?:\w+\s+){0,7}(?:recommend|advis|appropriate|consider|indicated|approved|establish|interpret|assume|substitute|replace|rely)/i;

/* The addressee rule applies to patterns that need a SUBJECT to be instructional. It must NOT
 * apply to the imperative mood or to explicit recommendation verbs, because those are
 * self-addressing: "Monitor for additive effects" names nobody and is unambiguously directed at
 * the reader, and "recommended per prescribing guidelines" is a recommendation with or without a
 * patient noun. Applying the rule to them suppressed four true positives, including the original
 * pasireotide findings this gate was built for. */
const ADDRESSEE_EXEMPT = new Set(['imperative-monitoring', 'recommended', 'first-line', 'should-directive', 'is-indicated-for-people']);

/* A TABLE CELL IS A LABEL, NOT A SENTENCE — so the addressee rule applies inside one even for the
 * imperatives that are otherwise exempt.
 *
 * Widening the imperative pattern to accept an object (needed for "Discontinue semaglutide if ...")
 * pulled in a run of table rows that are not clinical at all: cold-chain's "Monitor location and
 * conditions" is shipping logistics, lipidation's "Screen attachment sites" is protein engineering,
 * biomarker's "Monitor adverse effects" names a category of biomarker. A cell carries a fragment
 * whose subject is the row or column header, so requiring a person or a compound inside the cell
 * itself is the right test.
 *
 * The cost is accepted knowingly: a genuinely clinical cell like "| Diabetic retinopathy | Monitor
 * closely |" is also suppressed. That row reads as "this is a monitored risk", which is closer to
 * description than instruction, and losing it is cheaper than a gate that flags a courier's
 * temperature log. */
const IS_TABLE_CELL = /\|/;

/* A BULLET'S SUBJECT COMES FROM ITS HEADING.
 *
 * Two false positives survived every line-level rule because the line alone genuinely is ambiguous:
 *   "### Monitoring Technology"  ->  "- **Real-time GPS tracking** - Monitor location and conditions"
 *   "**Registry Studies:**"      ->  "- Monitor rare adverse events"
 * Both are imperatives with no addressee, and both describe a subject named above them — shipping
 * equipment, and what a study design does. Neither is directed at a person.
 *
 * But suppressing every addressee-less imperative bullet would lose real advice: the section that
 * read "## Monitoring Recommendations" over "- Monitor for gallbladder symptoms" has no person noun
 * anywhere in it either, and it was unambiguously instruction.
 *
 * The heading is what separates them. A section headed "Recommendations", "Precautions" or
 * "Management" is making recommendations; one headed "Monitoring Technology" is describing kit.
 * So an addressee-less imperative counts as instruction only under an instructional heading. */
/* "Considerations" is deliberately absent. It is far too weak a signal: the site has "Treatment
 * Considerations", "Seasonal Considerations" (shipping temperature ranges) and "Key Considerations"
 * (pharmacokinetics), and including the word made all three read as instructional sections. Only
 * headings that announce direction qualify. */
const INSTRUCTIONAL_HEADING = /\b(?:recommendation|precaution|guidance|advice|management|what to do|monitoring requirements|dosing|administration|when to (?:use|stop|start|switch))\b/i;

const isAdvice = (line, heading = '') => {
  if (NOT_INSTRUCTION.test(line)) return null;
  if (DISCLAIMER.test(line)) return null;
  if (REFERRAL.test(line)) return null;
  if (CONSENSUS.test(line)) return null;
  if (NEGATED.test(line)) return null;
  if (ATTRIBUTED.test(line)) return null;
  /* A pattern may carry its own `unless` — a context that makes THAT construction legitimate even
   * though the general shape is instructional. Kept per-pattern rather than in the global
   * exclusions, so an exemption earned by one construction does not silently excuse the others. */
  for (const p of ADVICE) {
    if (!p.re.test(line)) continue;
    if (p.unless && p.unless.test(line)) continue;
    const exempt = ADDRESSEE_EXEMPT.has(p.name) && !IS_TABLE_CELL.test(line);
    /* A table cell never borrows its section's heading as an addressee. The cell is a label whose
     * subject is its own row or column, so an instructional heading above the table does not make
     * every cell in it an instruction — cold-chain's shipping table sits under "Seasonal
     * Considerations", loading-dose's PK table under "Key Considerations". */
    const addressed = HAS_ADDRESSEE.test(line) || COMPOUND_NAMES.test(line)
      || (!IS_TABLE_CELL.test(line) && INSTRUCTIONAL_HEADING.test(heading));
    if (!exempt && !addressed) continue;
    /* An addressee-less imperative in a BULLET needs its heading to be instructional. Without that,
     * it is a predicate of whatever the section is about — GPS trackers, study designs — and not a
     * direction to anyone. */
    if (exempt && /^\s*[-*]\s/.test(line) && !addressed) continue;
    return p.name;
  }
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
  // must NOT flag — real false positives from the first site-wide sweep
  { t: 'Individuals should consult qualified professionals regarding their specific circumstances.', want: false, note: 'disclaimer with a plural role noun' },
  { t: 'Individuals should not interpret preclinical research as applicable to human self-treatment.', want: false, note: 'negated directive — a correct caution' },
  { t: 'What patients should know.', want: false, note: 'informational framing in a metaDescription' },
  { t: '- Switching from Zepbound: Which patients should transition?', want: false, note: 'a question heading' },
  { t: 'Neither is recommended for human use outside of clinical trials.', want: false, note: 'neither as negator' },
  { t: 'Despite the promising results, several important questions remain before pemvidutide can be considered a proven treatment.', want: false, note: 'epistemic, not clinical' },
  { t: '### Can Be Used', want: false, note: 'a markdown heading' },
  // must NOT flag — no addressee: the verb governs a molecule, a process, a designation or a parameter
  { t: 'Avoid acetylation when the free N-terminus is required for biological activity.', want: false, note: 'synthesis chemistry, no person' },
  { t: 'The goal is appropriate autophagy that maintains cellular health without over-degrading necessary components.', want: false, note: 'a cellular process' },
  { t: 'Understanding Vd helps determine if loading doses are appropriate for a given compartment model.', want: false, note: 'a pharmacokinetic parameter' },
  { t: '- Requires medical management', want: false, note: 'a bare predicate with no subject' },
  { t: '| Ensure safety | Require monitoring and reporting |', want: false, note: 'a table cell describing a regulatory pathway' },
  { t: 'Both have limited evidence and should be considered experimental.', want: false, note: 'epistemic caution — the correct posture' },
  // ...but a named compound IS an addressee-bearing subject even with no person noun
  { t: 'Discontinue semaglutide if pancreatitis is suspected.', want: true, note: 'named compound as subject' },
  // and the bullet-marker boundary must catch list items, not only asterisks
  { t: '- **Pancreatitis** — Discontinue if suspected in any patient', want: true, note: 'dash bullet, previously missed' },
  // must NOT flag — a referral is a disclaimer with the clinician as subject
  { t: 'An allergist/immunologist can determine if desensitization is appropriate for your specific situation.', want: false, note: 'referral, clinician as subject' },
  { t: 'Your prescriber will decide whether the combination is appropriate.', want: false, note: 'referral, second form' },
  // must NOT flag — reporting an established consensus is not making a recommendation
  { t: 'While meta-analyses show approximately 19% success rate, surgical orchiopexy is now preferred as first-line treatment.', want: false, note: 'consensus reporting, sourced to a guideline on the same page' },
  { t: '- Current standard of care remains appropriate for most patients', want: false, note: 'caution against substituting an investigational drug' },
  { t: 'It could improve responses to pneumococcal, shingles and other vaccines recommended for older adults.', want: false, note: 'reporting an existing vaccine schedule' },
  // must NOT flag — a property of the therapy that points at professional care
  { t: '- Requires monitoring: Fertility applications require physician oversight and ultrasound monitoring', want: false, note: 'requires physician oversight is disclaimer-shaped' },
  { t: '**Monitoring:** Standard heart failure monitoring remains appropriate', want: false, note: 'reporting that a trial did not change practice' },
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
    /* Track the nearest heading or bolded list label so a bullet can be judged against the subject
     * its section establishes, not just against its own words. */
    let heading = '';
    for (const line of String(text).split(/\n|(?<=[.!?])\s+/)) {
      const h = line.match(/^\s*#{1,6}\s+(.+)$/) || line.match(/^\s*\*\*([^*]{3,60}):?\*\*:?\s*$/);
      if (h) { heading = h[1]; continue; }
      const hit = isAdvice(line, heading);
      if (hit) findings.push({ file: rel, where, heading, pattern: hit, line: line.trim().slice(0, 150) });
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
