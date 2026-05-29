// Validates two-axis scoring integrity for any dossier that has a `scoring` block
// (rubric v2.4 — see docs/scoring-rubric.md). Dossiers without `scoring` are skipped
// (migration in progress). ERROR (exit 1): weighted-overall mismatch, out-of-range
// sub-scores, basis/score inconsistency, community-reported score >50, missing citations.
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const WEIGHTS = {
  researchDepth: 0.30,
  mechanism: 0.20,
  plausibility: 0.20,
  globalCoverage: 0.15,
  communityExperience: 0.15,
};

const dir = path.resolve('src/content/peptides');
const files = fs.existsSync(dir)
  ? fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
  : [];
const errors = [];
let scored = 0;

for (const file of files) {
  const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf-8'));
  const s = data.scoring;
  if (!s) continue;
  scored++;

  // --- Evidence axis ---
  const ev = s.evidence ?? {};
  for (const k of Object.keys(WEIGHTS)) {
    const v = ev[k];
    if (typeof v !== 'number' || v < 0 || v > 100) {
      errors.push(`${file}: evidence.${k} = ${v} (must be 0–100)`);
    }
  }
  const calc = Object.entries(WEIGHTS).reduce((sum, [k, w]) => sum + (ev[k] ?? 0) * w, 0);
  if (typeof ev.overall !== 'number' || Math.abs(calc - ev.overall) > 1) {
    errors.push(`${file}: evidence.overall ${ev.overall} ≠ weighted ${calc.toFixed(1)} (±1)`);
  }

  // --- Effectiveness axis ---
  const eff = s.effectiveness ?? {};
  if (eff.basis === 'not-established') {
    if (eff.score != null) errors.push(`${file}: not-established must omit effectiveness.score`);
  } else {
    if (typeof eff.score !== 'number') {
      errors.push(`${file}: effectiveness.basis '${eff.basis}' requires a numeric score`);
    }
    if (!eff.confidence) {
      errors.push(`${file}: effectiveness '${eff.basis}' requires a confidence flag`);
    }
    if (eff.basis === 'community-reported' && (eff.score ?? 0) > 50) {
      errors.push(`${file}: community-reported score ${eff.score} exceeds the 50 cap`);
    }
  }

  // --- Citations ---
  if (!Array.isArray(s.citations) || s.citations.length === 0) {
    errors.push(`${file}: scoring.citations is empty`);
  }
}

console.log(`Scoring validator: ${scored}/${files.length} dossiers scored.`);
if (errors.length) {
  console.error(`\nFAIL: ${errors.length} scoring error(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('PASS: scoring integrity OK');
