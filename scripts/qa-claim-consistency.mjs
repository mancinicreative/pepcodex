/**
 * Cross-surface claim consistency: does the same named trial get the same number everywhere?
 *
 * The dossiers and packs are now verified against PubMed and ClinicalTrials.gov. But 1,429 numeric
 * claims live in `comparisons/`, `glossary/`, `guides/` and `safety/` — 190 files that carry almost
 * no citations at all. Those numbers were copied from somewhere, and if a page states a figure that
 * disagrees with the verified dossier for the same trial, one of them is wrong.
 *
 * This needs no network call and has no false-positive risk in principle: if "STEP 1" is 14.9% on
 * one page and 16.9% on another, that is a contradiction regardless of which is right. It is exactly
 * the check that would have caught "22.7%" being attributed to REDEFINE-1 while the published paper
 * reports 20.4%.
 *
 * Usage: node scripts/qa-claim-consistency.mjs [--strict]
 * Output: .planning/citation-audit/claim-consistency.json + CLAIM-CONSISTENCY.md
 */
import fs from 'fs';
import path from 'path';

const STRICT = process.argv.includes('--strict');
const OUT = '.planning/citation-audit';

function walkFiles(d, out = []) {
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walkFiles(p, out);
    else if (/\.mdx?$/.test(e.name)) out.push(p);
  }
  return out;
}

// Named trial families we track. Requires the numeric/suffix part, because a family shares its stem
// by design — REDEFINE 1 and REDEFINE 2 are different trials with different results.
const TRIAL = /\b(STEP|SURMOUNT|SURPASS|REDEFINE|SUSTAIN|SELECT|ATTAIN|TRIUMPH|SYNCHRONIZE|PIONEER|OASIS|SCALE|TAZPOWER|MMPOWER|REDUCE-IT|FLOW|SOUL|ACHIEVE)[-\s]?(\d[A-Za-z]?|CVOT|J-mono|J-combo)\b/gi;
const norm = (t) => t.replace(/[-\s]+/g, '-').toUpperCase();

// A trial reports many different percentages legitimately — placebo arm, each dose arm, responder
// rates, discontinuation. Comparing all of them to each other just produces noise (SURMOUNT-1's
// 2.4% is placebo and 91% is a responder rate; neither contradicts its 22.5% weight loss). So a
// percentage is only compared against others describing the SAME measure, and only for the
// headline/primary measure, where a disagreement is a genuine copy error.
const MEASURES = [
  { key: 'weight-change', re: /\b(mean\s+)?(weight (loss|reduction|change)|body weight|lost)\b/i },
  { key: 'hba1c', re: /\bhba1c|a1c\b/i },
  // "25% or greater weight loss: 62.5%" is a RESPONDER RATE, not a mean weight change. Without the
  // "or greater/or more" forms these leaked in as if they were headline efficacy figures once
  // heading-scoped attribution was added.
  { key: 'responder', re: /(responder|achiev\w+|participants? (who )?(lost|reached)|≥\s?\d|at least \d+\s?%|\d+\s?%\s*(or (greater|more|above)))/i },
  { key: 'discontinuation', re: /\b(discontinu|withdrew|dropout)\w*/i },
  { key: 'adverse', re: /\b(adverse|nausea|vomit|gastrointestinal|side effect)\w*/i },
];
const measureOf = (line) => {
  // order matters: a line about "participants achieving ≥20% weight loss" is a responder rate
  for (const m of [MEASURES[3], MEASURES[4], MEASURES[2], MEASURES[1], MEASURES[0]]) if (m.re.test(line)) return m.key;
  return null;
};
const isComparator = (line) => /\bplacebo\b/i.test(line);

const claims = new Map(); // "TRIAL|pct" -> Set(files)
const perTrial = new Map(); // TRIAL -> Map(pct -> Set(files))

for (const f of walkFiles('src/content')) {
  const raw = fs.readFileSync(f, 'utf-8');
  const label = path.relative(process.cwd(), f).replace(/\\/g, '/');
  // Attribute a percentage to the trial it sits with — but ALSO carry the scope of a markdown
  // heading, because a section titled "### SURMOUNT Trials" followed by a bullet "Up to 22% weight
  // loss" states a figure for that trial without ever repeating its name on the line. Line-only
  // attribution missed exactly that case. Scope resets at the next heading.
  let headingTrial = null;
  for (const line of raw.split(/\n|(?<=\.)\s+/)) {
    if (/^\s{0,3}#{1,6}\s/.test(line)) {
      const ht = [...new Set([...line.matchAll(TRIAL)].map((m) => norm(m[0])))];
      // a heading naming exactly one trial scopes the bullets beneath it
      headingTrial = ht.length === 1 ? ht[0] : null;
      continue;
    }
    let trials = [...line.matchAll(TRIAL)].map((m) => norm(m[0]));
    if (!trials.length && headingTrial) trials = [headingTrial];
    if (!trials.length) continue;
    const pcts = [...line.matchAll(/(\d{1,2}(?:\.\d)?)\s?%/g)].map((m) => m[1]);
    if (!pcts.length) continue;
    // only attribute when the line mentions exactly one trial — otherwise the pairing is ambiguous
    const uniq = [...new Set(trials)];
    if (uniq.length !== 1) continue;
    const measure = measureOf(line);
    if (measure !== 'weight-change') continue;   // primary endpoint only — where a mismatch matters
    // A line quoting the drug AND its placebo comparator carries two numbers; the smaller is the
    // placebo arm and must not be compared against the drug's effect.
    const vals = pcts.map(Number).filter((n) => Number.isFinite(n));
    const headline = isComparator(line) && vals.length > 1 ? [Math.max(...vals)] : vals;
    const t = uniq[0];
    if (!perTrial.has(t)) perTrial.set(t, new Map());
    for (const p of headline.map(String)) {
      const m = perTrial.get(t);
      if (!m.has(p)) m.set(p, new Set());
      m.get(p).add(label);
      claims.set(`${t}|${p}`, m.get(p));
    }
  }
}

// A trial legitimately reports several different percentages (weight loss, responder rate, AE rate),
// so multiple values are not automatically a contradiction. Report the spread and let a human judge,
// but escalate when the SAME kind of headline figure differs across files.
const findings = [];
for (const [trial, byPct] of perTrial) {
  if (byPct.size < 2) continue;
  const spread = [...byPct.entries()].map(([p, files]) => ({ pct: p, files: [...files] }));
  // suspicious when two values are close but not equal (14.9 vs 16.9) — that is a copy error,
  // whereas 14.9 vs 68 is likely two different measures
  const nums = spread.map((s) => Number(s.pct)).sort((a, b) => a - b);
  let near = false;
  for (let i = 1; i < nums.length; i++) if (nums[i] - nums[i - 1] > 0 && nums[i] - nums[i - 1] <= 3) near = true;
  findings.push({ trial, values: spread, nearMiss: near });
}
findings.sort((a, b) => (b.nearMiss - a.nearMiss) || b.values.length - a.values.length);

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'claim-consistency.json'), JSON.stringify(findings, null, 2));

const nearMiss = findings.filter((f) => f.nearMiss);
console.log(`Claim consistency: ${perTrial.size} named trials referenced with a percentage across src/content.`);
console.log(`  trials with more than one stated value: ${findings.length}`);
console.log(`  of those, NEAR-MISS values (<=3 points apart — the copy-error signature): ${nearMiss.length}`);

const L = [`# Cross-surface Claim Consistency — ${new Date().toISOString().slice(0, 10)}`, '',
  'The same named trial stated with different percentages in different files. Multiple values can be',
  'legitimate (weight loss vs responder rate vs AE rate). **Near-miss values a few points apart are',
  'the copy-error signature** and are listed first.', ''];
for (const f of findings) {
  L.push(`### ${f.trial}${f.nearMiss ? '  ⚠️ near-miss' : ''}`);
  for (const v of f.values) L.push(`- **${v.pct}%** — ${v.files.join(', ')}`);
  L.push('');
}
fs.writeFileSync(path.join(OUT, 'CLAIM-CONSISTENCY.md'), L.join('\n'));

if (nearMiss.length) {
  console.log('\nNEAR-MISS (review first):');
  for (const f of nearMiss.slice(0, 15)) {
    console.log(`  ${f.trial}: ${f.values.map((v) => v.pct + '%').join(' vs ')}`);
    for (const v of f.values) console.log(`      ${v.pct}% -> ${v.files.slice(0, 3).join(', ')}`);
  }
}
console.log(`\nWrote ${OUT}/CLAIM-CONSISTENCY.md`);
process.exit(STRICT && nearMiss.length ? 1 : 0);
