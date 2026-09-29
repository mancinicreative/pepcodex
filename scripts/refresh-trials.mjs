#!/usr/bin/env node
/**
 * Refresh a peptide's clinical trials from ClinicalTrials.gov (live, real data only).
 *
 * Fetches the public CT.gov v2 REST API, normalises it into the site's trial shape,
 * then merges into data/source-packs/<slug>.json:
 *   - UPDATES volatile fields (status / phase / dates / conditions / enrollment) on
 *     trials already in the pack, while PRESERVING curated `title` + `regions`;
 *   - ADDS genuinely new registered trials (by NCT id).
 * Every included trial traces to CT.gov; explicit reviewed exclusions remain excluded.
 *
 * Usage:
 *   node scripts/refresh-trials.mjs <slug>                       # dry run
 *   node scripts/refresh-trials.mjs <slug> --apply               # write the pack
 *   node scripts/refresh-trials.mjs <slug> --phase 2,3 --apply   # only Phase 2/3
 *   node scripts/refresh-trials.mjs <slug> --query "retatrutide OR LY3437943"
 *   flags: --max <n> (fetch cap, default 300) · --max-add <n> (new-trial cap, default 40)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));
const APPLY = args.includes('--apply');
const flag = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const queryOverride = flag('--query', null);
const phaseFilter = (flag('--phase', '') || '').split(',').map((s) => s.trim()).filter(Boolean); // e.g. ["2","3"]
const maxFetch = parseInt(flag('--max', '300'), 10);
const maxAdd = parseInt(flag('--max-add', '40'), 10);

if (!slug) {
  console.error('usage: node scripts/refresh-trials.mjs <slug> [--apply] [--phase 2,3] [--query "..."] [--max N] [--max-add N]');
  process.exit(1);
}

const packPath = join(process.cwd(), 'data', 'source-packs', `${slug}.json`);
if (!existsSync(packPath)) {
  console.error(`No source pack at ${packPath}. This script only refreshes existing packs.`);
  process.exit(1);
}
if (slug === 'tb-500' && APPLY) {
  console.error('TB-500 automatic refresh is disabled: this pack contains parent thymosin beta-4 registries that require molecule-scoped review before updating.');
  process.exit(1);
}
const pack = JSON.parse(readFileSync(packPath, 'utf8'));
pack.trials = Array.isArray(pack.trials) ? pack.trials : [];
// Curated exclusions survive refreshes, including records already in an old pack.
const exclusions = pack.trialExclusions ?? [];
if (!Array.isArray(exclusions) || exclusions.some((entry) =>
  !entry || !/^NCT\d{8}$/.test(entry.nctId || '') || typeof entry.reason !== 'string' || !entry.reason.trim())) {
  console.error('Invalid trialExclusions: each entry needs an NCT identifier and a review reason.');
  process.exit(1);
}
const excludedIds = new Set(exclusions.map((entry) => entry.nctId));
const excludedExisting = pack.trials.filter((trial) => excludedIds.has((trial.id || trial.nctId || '').toUpperCase())).length;
pack.trials = pack.trials.filter((trial) => !excludedIds.has((trial.id || trial.nctId || '').toUpperCase()));

// ---- build the intervention query (peptide name + aliases) ----
const peptideName = typeof pack.peptide === 'string' ? pack.peptide : (pack.peptide?.name || slug);
const aliases = Array.isArray(pack.aliases) ? pack.aliases : [];
const query = queryOverride || [peptideName, ...aliases].filter(Boolean).join(' OR ');

// ---- normalisers ----
function normStatus(s) {
  return (s || 'unknown').toLowerCase().replace(/_/g, ' ');
}
function normPhase(phases) {
  const values = (phases || []).map((value) => String(value).toUpperCase())
    .filter((value) => value !== 'NA')
    .map((value) => value.startsWith('EARLY_PHASE')
      ? 'early ' + value.replace('EARLY_PHASE', '')
      : value.replace('PHASE', ''));
  return values.length ? values.join('/') : 'N/A';
}

// ---- fetch CT.gov v2 ----
const url = `https://clinicaltrials.gov/api/v2/studies?query.intr=${encodeURIComponent(query)}`
  + `&filter.advanced=${encodeURIComponent('AREA[StudyType]INTERVENTIONAL')}`
  + `&pageSize=${Math.min(maxFetch, 1000)}&countTotal=true`;

const res = await fetch(url, { headers: { accept: 'application/json' } });
if (!res.ok) { console.error(`CT.gov API ${res.status}`); process.exit(1); }
const data = await res.json();
const studies = data.studies || [];

// ---- map + (optional) phase filter ----
const fetched = studies.filter((st) => !excludedIds.has(st.protocolSection?.identificationModule?.nctId)).map((st) => {
  const ps = st.protocolSection || {};
  const phases = ps.designModule?.phases || [];
  return {
    id: ps.identificationModule?.nctId,
    title: ps.identificationModule?.briefTitle || ps.identificationModule?.nctId,
    phase: normPhase(phases),
    _phaseNums: phases.map((p) => String(p).replace('EARLY_PHASE', '').replace('PHASE', '')),
    status: normStatus(ps.statusModule?.overallStatus),
    enrollment: ps.designModule?.enrollmentInfo?.count,
    enrollmentType: ps.designModule?.enrollmentInfo?.type,
    enrollmentTarget: ps.designModule?.enrollmentInfo?.type === 'ESTIMATED' ? ps.designModule.enrollmentInfo.count : undefined,
    conditions: ps.conditionsModule?.conditions || [],
    interventions: (ps.armsInterventionsModule?.interventions || []).map((i) => i.name).filter(Boolean),
    startDate: ps.statusModule?.startDateStruct?.date,
    startDateType: ps.statusModule?.startDateStruct?.type,
    completionDate: ps.statusModule?.completionDateStruct?.date,
    completionDateType: ps.statusModule?.completionDateStruct?.type,
    lastUpdateDate: ps.statusModule?.lastUpdatePostDateStruct?.date,
    hasResults: Boolean(st.hasResults),
    sourceUrl: `https://clinicaltrials.gov/api/v2/studies/${ps.identificationModule?.nctId}`,
  };
}).filter((t) => t.id && (phaseFilter.length === 0 || t._phaseNums.some((n) => phaseFilter.includes(n))));

// ---- merge ----
const byId = new Map();
for (const t of pack.trials) {
  const id = (t.id || t.nctId || '').toUpperCase();
  if (id) byId.set(id, t);
}
const added = [];
const updated = [];
const newQueue = [];

for (const f of fetched) {
  const nct = f.id.toUpperCase();
  if (byId.has(nct)) {
    const t = byId.get(nct);
    const before = JSON.stringify(t);
    t.status = f.status;
    t.phase = f.phase;
    // Update values and their qualifiers together; do not retain stale date types.
    for (const field of ['enrollment', 'enrollmentType', 'enrollmentTarget', 'startDate', 'startDateType',
      'completionDate', 'completionDateType', 'lastUpdateDate', 'hasResults', 'sourceUrl']) {
      if (f[field] !== undefined) t[field] = f[field];
      else delete t[field];
    }
    t.conditions = f.conditions;
    t.interventions = f.interventions;
    if (before !== JSON.stringify(t)) updated.push(nct);
  } else {
    newQueue.push(f);
  }
}
// newest first, capped
newQueue.sort((a, b) => String(b.startDate || '').localeCompare(String(a.startDate || '')));
// TB-500 is a fragment of thymosin beta-4; broad alias matches need molecule review.
const toAdd = slug === 'tb-500' ? [] : newQueue.slice(0, maxAdd);
for (const f of toAdd) {
  delete f._phaseNums;
  pack.trials.push(f);
  added.push(f.id);
}
const skipped = newQueue.length - toAdd.length;
const today = new Date().toISOString().slice(0, 10);

// ---- report ----
console.log(`${APPLY ? 'APPLIED' : 'DRY RUN'}  ·  ${slug}   query.intr="${query}"${phaseFilter.length ? `  phase=${phaseFilter.join('/')}` : ''}`);
console.log(`  CT.gov total interventional: ${data.totalCount}   fetched+matched: ${fetched.length}`);
console.log(`  reviewed exclusions: ${excludedIds.size}   removed from existing entries: ${excludedExisting}`);
console.log(`  pack before: ${byId.size}   updated: ${updated.length}   added: ${added.length}${skipped > 0 && slug !== 'tb-500' ? `   (skipped ${skipped} over --max-add ${maxAdd})` : ''}   pack after: ${pack.trials.length}`);
if (slug === 'tb-500' && newQueue.length) console.log(`  ${newQueue.length} new TB-500/parent-thymosin matches require molecule review before insertion`);
if (updated.length) console.log(`  updated: ${updated.join(', ')}`);
if (added.length) console.log(`  added:   ${added.join(', ')}`);

if (APPLY) {
  pack.trialsLastSynced = today;
  if (pack.metadata && typeof pack.metadata === 'object') pack.metadata.lastUpdated = today;
  writeFileSync(packPath, JSON.stringify(pack, null, 2) + '\n');
  console.log(`  wrote ${packPath}`);
} else {
  console.log('  (dry run — pass --apply to write)');
}
