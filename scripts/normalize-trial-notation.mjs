/**
 * Convert raw ClinicalTrials.gov enum values in pack `trials[]` to the site's notation.
 *
 * WHY: src/pages/trials/index.astro sorts via a lowercase `statusOrder` map and counts the summary
 * cards with `lc(t.status) === 'completed'`; src/components/TrialTable.astro filters on
 * `data-status` / `data-phase`. A record storing "ACTIVE_NOT_RECRUITING" lowercases to
 * "active_not_recruiting", which is in neither map — so it sorts to the bottom with rank 99, is
 * excluded from every status card count, and breaks the phase dropdown.
 *
 * Records written directly from the CT.gov API (by a repair pass or an agent) carry the raw enum,
 * while records created through scripts/refresh-trials.mjs are already normalised — hence the mix.
 *
 * THIS IS NOTATION ONLY. The mapping is exactly `normStatus`/`normPhase` from
 * scripts/refresh-trials.mjs, as documented in data/source-packs/TRIALS-REFRESH.md. No factual
 * value (enrollment, dates, conditions, interventions, title, nctId) is read or written.
 *
 * Usage: node scripts/normalize-trial-notation.mjs [--apply]
 */
import fs from 'fs';

const APPLY = process.argv.includes('--apply');
const DIR = 'data/source-packs';

// --- canonical mapping, copied verbatim from scripts/refresh-trials.mjs ---
function normStatus(s) {
  const map = {
    RECRUITING: 'recruiting', NOT_YET_RECRUITING: 'not yet recruiting',
    ENROLLING_BY_INVITATION: 'recruiting', ACTIVE_NOT_RECRUITING: 'active',
    COMPLETED: 'completed', TERMINATED: 'terminated', WITHDRAWN: 'withdrawn', SUSPENDED: 'suspended',
  };
  return map[s] || (s || 'unknown').toLowerCase().replace(/_/g, ' ');
}
function normPhase(phases) {
  const nums = (phases || []).map((x) => String(x).toUpperCase())
    .filter((x) => x !== 'NA').map((x) => x.replace('EARLY_PHASE', '').replace('PHASE', '').trim()).filter(Boolean);
  return nums.length ? nums.join('/') : 'N/A';
}

// The pack stores `phase` as a STRING ("PHASE1/PHASE2"); refresh-trials receives an ARRAY from the
// API. Split on "/" so the identical mapping applies to the stored form.
const normPhaseString = (p) => normPhase(String(p).split('/'));

// Only raw-enum shapes are touched; anything already in site notation is left exactly as-is.
const isRawStatus = (v) => typeof v === 'string' && /^[A-Z][A-Z_]*$/.test(v);
const isRawPhase = (v) => typeof v === 'string' && /^(EARLY_PHASE\d?|PHASE\d|NA)(\/(EARLY_PHASE\d?|PHASE\d|NA))*$/.test(v);

let statusChanged = 0, phaseChanged = 0, recordsTouched = 0;
const perPack = {}, statusMap = {}, phaseMap = {};

for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
  const file = `${DIR}/${f}`;
  const pack = JSON.parse(fs.readFileSync(file, 'utf-8'));
  let touched = 0;

  for (const t of pack.trials || []) {
    let changed = false;
    if (isRawStatus(t.status)) {
      const to = normStatus(t.status);
      if (to !== t.status) { statusMap[`${t.status} -> ${to}`] = (statusMap[`${t.status} -> ${to}`] || 0) + 1; t.status = to; statusChanged++; changed = true; }
    }
    if (isRawPhase(t.phase)) {
      const to = normPhaseString(t.phase);
      if (to !== t.phase) { phaseMap[`${t.phase} -> ${to}`] = (phaseMap[`${t.phase} -> ${to}`] || 0) + 1; t.phase = to; phaseChanged++; changed = true; }
    }
    if (changed) { touched++; recordsTouched++; }
  }

  if (touched) {
    perPack[f] = touched;
    if (APPLY) fs.writeFileSync(file, JSON.stringify(pack, null, 2) + '\n');
  }
}

console.log(`${APPLY ? 'APPLIED' : 'DRY RUN'} — ${recordsTouched} records normalised (${statusChanged} status, ${phaseChanged} phase)\n`);
console.log('status mappings:');
for (const [k, v] of Object.entries(statusMap).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)}  ${k}`);
console.log('\nphase mappings:');
for (const [k, v] of Object.entries(phaseMap).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)}  ${k}`);
console.log('\nper pack:');
for (const [k, v] of Object.entries(perPack).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)}  ${k}`);
if (!APPLY) console.log('\nNo files written. Re-run with --apply.');
