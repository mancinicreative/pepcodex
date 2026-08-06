/**
 * Collapse each trial record onto ONE identifier field, and remove metadata that contradicts a
 * registry-verified value.
 *
 * Why: pack trial records carry both `id` and `nctId`, and both `enrollment` and `enrollmentTarget`.
 * The renderer reads `t.nctId || t.id`, so a stale `id` sitting beside a corrected `nctId` is
 * invisible on the page but still fabricated data on disk — and the next tool to read the pack may
 * pick the wrong one. Five records were left in exactly that state by the repair pass (the old
 * fabricated NCT beside the recovered real one). Duplicated fields that disagree are how a
 * fabrication survives a fix.
 *
 * Rules:
 *   id + nctId present            -> drop `id` (nctId is the verified identifier)
 *   id only, NCT-shaped           -> rename to `nctId`
 *   id only, foreign registry     -> leave as `id` (jRCT/EUCTR/ACTRN are real, just not CT.gov)
 *   enrollment vs enrollmentTarget-> on registry-verified records, drop the unverified `enrollment`
 *
 * Dry-run by default. Pass --apply to write.
 */
import fs from 'fs';

const APPLY = process.argv.includes('--apply');
const DIR = 'data/source-packs';
let droppedId = 0, renamed = 0, keptForeign = 0, droppedEnrollment = 0;
const conflicts = [];

for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
  const p = `${DIR}/${f}`;
  const pack = JSON.parse(fs.readFileSync(p, 'utf-8'));
  let touched = false;

  for (const t of pack.trials || []) {
    if (t.id && t.nctId) {
      if (String(t.id).toUpperCase() !== String(t.nctId).toUpperCase()) {
        conflicts.push({ pack: f, staleId: t.id, keptNct: t.nctId, title: (t.title || '').slice(0, 60) });
      }
      delete t.id;
      droppedId++;
      touched = true;
    } else if (t.id && !t.nctId) {
      if (/^NCT\d{8}$/i.test(String(t.id).trim())) {
        t.nctId = String(t.id).trim().toUpperCase();
        delete t.id;
        renamed++;
        touched = true;
      } else {
        keptForeign++;
      }
    }
    // A registry-verified record must not also carry an unverified, disagreeing enrollment figure.
    if (t.verifiedAt && t.enrollmentTarget != null && t.enrollment != null && t.enrollment !== t.enrollmentTarget) {
      delete t.enrollment;
      droppedEnrollment++;
      touched = true;
    }
  }

  if (touched && APPLY) fs.writeFileSync(p, JSON.stringify(pack, null, 2) + '\n');
}

console.log(`${APPLY ? 'APPLIED' : 'DRY RUN'} — dropped stale id ${droppedId} · renamed id->nctId ${renamed} · kept foreign-registry id ${keptForeign} · dropped contradicting enrollment ${droppedEnrollment}`);
if (conflicts.length) {
  console.log(`\n${conflicts.length} record(s) where the dropped id CONFLICTED with the verified NCT:`);
  for (const c of conflicts) console.log(`  ${c.pack}: removed fabricated ${c.staleId}, kept ${c.keptNct} — ${c.title}`);
}
if (!APPLY) console.log('\nNo files written. Re-run with --apply.');
