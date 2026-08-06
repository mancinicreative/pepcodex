/**
 * Apply the trial repairs decided by triage-trials.mjs + recover-ncts.mjs.
 *
 * DECISION TABLE (nothing here is a guess — each branch is justified by verified ground truth):
 *   AUTOFIX_TITLE  -> overwrite title/phase/status/enrollment/dates from CT.gov. Drug already
 *                     matches, so the NCT is right and only our label was wrong. The discarded
 *                     label is logged to the orphan worklist: if prose elsewhere cites that trial
 *                     name, that claim now has no backing record and must be re-checked.
 *   LIKELY recovery-> replace the fabricated NCT with the recovered real one AND refresh every
 *                     metadata field from CT.gov.
 *   BOGUS (no confident recovery), R_FAIL, PLACEHOLDER
 *                  -> DELETE the record. A fabricated trial is worse than a missing one: it renders
 *                     with a live ClinicalTrials.gov link that lends it false authority. Deleting is
 *                     honest and git-reversible; the trial can be re-added later with real data.
 *   COMPARATOR     -> untouched here. Real trials for a different drug: a scope/editorial question,
 *                     not a fabrication. Reported, never auto-deleted.
 *
 * Dry-run by default. Pass --apply to write.
 * Usage: node scripts/apply-trial-repairs.mjs [--apply]
 */
import fs from 'fs';
import path from 'path';

const APPLY = process.argv.includes('--apply');
const OUT_DIR = '.planning/citation-audit';
const triage = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'trial-triage.json'), 'utf-8'));
const recovery = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'nct-recovery.json'), 'utf-8'));

// recovery keyed by the record it belongs to (jsonPath — records live in many arrays, not just trials[])
const recKey = (r) => `${r.file}#${r.jsonPath}`;
const recovered = new Map();
for (const r of recovery) if (r.verdict === 'LIKELY') recovered.set(recKey(r), r);

const plan = [];
for (const r of triage) {
  const key = recKey(r);
  if (r.klass === 'AUTOFIX_TITLE') {
    plan.push({ ...r, action: 'RETITLE', reason: 'drug matches; label was wrong' });
  } else if (r.klass === 'BOGUS' || r.klass === 'R_FAIL') {
    const rec = recovered.get(key);
    if (rec) plan.push({ ...r, action: 'REPOINT', to: rec.candidates[0], reason: `recovered real NCT (${rec.candidates[0].acroExact ? 'exact acronym' : 'title match'})` });
    else plan.push({ ...r, action: 'DELETE', reason: 'fabricated NCT, no confident real trial found' });
  } else if (r.klass === 'PLACEHOLDER') {
    plan.push({ ...r, action: 'DELETE', reason: 'descriptive text, not a trial record' });
  }
}

// --- group by file so each pack is rewritten once ---
const byFile = {};
for (const p of plan) (byFile[p.file] ||= []).push(p);

const orphanedNames = [];
let retitled = 0, repointed = 0, deleted = 0;
const planByPath = new Map();
for (const p of plan) planByPath.set(`${p.file}|${p.jsonPath}`, p);

for (const [file, items] of Object.entries(byFile)) {
  const pack = JSON.parse(fs.readFileSync(file, 'utf-8'));

  // Structural walk mirroring triage: repair in place, then drop DELETE-marked array elements.
  (function walk(node, p) {
    if (node == null || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((x, i) => walk(x, `${p}[${i}]`));
      const keep = node.filter((x, i) => planByPath.get(`${file}|${p}[${i}]`)?.action !== 'DELETE');
      if (keep.length !== node.length) {
        deleted += node.length - keep.length;
        node.length = 0; node.push(...keep);
      }
      return;
    }
    const it = planByPath.get(`${file}|${p}`);
    if (it) applyOne(node, it);
    Object.entries(node).forEach(([k, v]) => walk(v, `${p}.${k}`));
  })(pack, '');

  if (APPLY) fs.writeFileSync(file, JSON.stringify(pack, null, 2) + '\n');
}

function applyOne(t, it) {
  {
    if (it.action === 'DELETE') {
      if (it.title) orphanedNames.push({ slug: it.slug, name: it.title, why: it.reason });
      return;
    }
    const g = it.action === 'REPOINT' ? it.to : it;
    const newTitle = it.action === 'REPOINT' ? g.brief : it.ctBrief;
    if (it.title && it.title !== newTitle) orphanedNames.push({ slug: it.slug, name: it.title, why: `relabelled to "${newTitle}"` });

    if (it.action === 'REPOINT') {
      t.nctId = g.nctId;
      repointed++;
    } else {
      retitled++;
    }
    t.title = newTitle;
    const status = it.action === 'REPOINT' ? g.status : it.ctStatus;
    const phase = it.action === 'REPOINT' ? g.phase : it.ctPhase;
    const enrollment = it.action === 'REPOINT' ? g.enrollment : it.ctEnrollment;
    const conditions = it.action === 'REPOINT' ? g.conditions : it.ctConditions;
    const interventions = it.action === 'REPOINT' ? g.interventions : it.ctInterventions;
    const startDate = it.action === 'REPOINT' ? g.startDate : it.ctStartDate;
    const completionDate = it.action === 'REPOINT' ? g.completionDate : it.ctCompletionDate;
    if (status) t.status = status;
    if (phase) t.phase = phase;
    if (enrollment != null) t.enrollmentTarget = enrollment;
    if (conditions?.length) t.conditions = conditions;
    if (interventions?.length) t.interventions = interventions;
    if (startDate) t.startDate = startDate;
    if (completionDate) t.completionDate = completionDate;
    // provenance: this record was checked against the registry, and when
    t.verifiedAt = new Date().toISOString().slice(0, 10);
    t.verifiedAgainst = 'clinicaltrials.gov/api/v2';
  }
}

console.log(`${APPLY ? 'APPLIED' : 'DRY RUN'} — retitled ${retitled} · repointed ${repointed} · deleted ${deleted}`);
console.log('\nper file:');
for (const [file, items] of Object.entries(byFile)) {
  const c = items.reduce((a, i) => ((a[i.action] = (a[i.action] || 0) + 1), a), {});
  console.log(`  ${path.basename(file).padEnd(22)} ${JSON.stringify(c)}`);
}

// Any trial NAME we removed or relabelled may still be cited in dossier/blog prose. That prose now
// has no backing record and must be re-verified — otherwise deleting the record silently leaves an
// unsupported claim behind, which is the same failure in a different place.
if (APPLY) {
  fs.writeFileSync(path.join(OUT_DIR, 'orphaned-trial-names.json'), JSON.stringify(orphanedNames, null, 2));
}
console.log(`\n${orphanedNames.length} trial name(s) removed/relabelled -> prose citing them needs re-check`);
console.log(orphanedNames.map((o) => `  ${o.slug}: "${o.name}"`).join('\n'));
if (!APPLY) console.log('\nNo files written. Re-run with --apply.');
