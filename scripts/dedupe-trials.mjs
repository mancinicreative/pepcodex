/**
 * Collapse trial records that are duplicated WITHIN a single array of a source pack.
 *
 * SCOPE, and why it is narrow. Two shapes look like duplication and only one is a defect:
 *
 *   WITHIN one array  — the same NCT twice in `trials[]` or twice in `coreLibrary.clinicalTrials[]`.
 *     DossierLayout maps `pack.trials[]` straight into the rendered trial table, so this prints the
 *     same study twice on the page and double-counts it in every trial total. Five of these exist.
 *
 *   ACROSS arrays — once in a `coreLibrary.*` bibliography and once in `trials[]`. That is the
 *     design: coreLibrary is the pack's reference list, `trials[]` is what the dossier renders, and
 *     a registered trial legitimately belongs to both. 28 of these exist, they do not render twice,
 *     and qa-internal-consistency already proves their stored facts agree. Collapsing them would
 *     strip real bibliography entries to satisfy a gate that was asking the wrong question.
 *
 * MERGE RULE: keep the union of fields, and where two records disagree, prefer the value that
 * matches ClinicalTrials.gov. Deleting the shorter record wholesale would lose fields it uniquely
 * carries — and in one case would have kept the WRONG one: ll-37 trials[0] is titled "Intratumoral
 * Injections of LL37 for Melanoma" but carries the note "Safety and efficacy of topical LL-37 in
 * chronic venous leg ulcers", a note belonging to an entirely different study. A note that
 * contradicts its own record's subject is dropped rather than merged.
 *
 * Usage:
 *   node scripts/dedupe-trials.mjs           # dry run
 *   node scripts/dedupe-trials.mjs --apply
 */
import fs from 'fs';

const APPLY = process.argv.includes('--apply');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = { 'User-Agent': 'PepCodex-dedupe/1.0 (mailto:admin@pepcodex.com)' };

const normStatus = (s) => ({
  RECRUITING: 'recruiting', NOT_YET_RECRUITING: 'not yet recruiting',
  ENROLLING_BY_INVITATION: 'recruiting', ACTIVE_NOT_RECRUITING: 'active',
  COMPLETED: 'completed', TERMINATED: 'terminated', WITHDRAWN: 'withdrawn', SUSPENDED: 'suspended',
}[s] || (s || 'unknown').toLowerCase().replace(/_/g, ' '));
const normPhase = (ph) => {
  const n = (ph || []).map((x) => String(x).toUpperCase()).filter((x) => x !== 'NA')
    .map((x) => x.replace('EARLY_PHASE', '').replace('PHASE', '').trim()).filter(Boolean);
  return n.length ? n.join('/') : 'N/A';
};

async function registry(nct) {
  try {
    const r = await fetch(`https://clinicaltrials.gov/api/v2/studies/${nct}`, { headers: UA });
    if (!r.ok) return null;
    const p = (await r.json()).protocolSection || {};
    return {
      title: p.identificationModule?.briefTitle || '',
      status: normStatus(p.statusModule?.overallStatus),
      phase: normPhase(p.designModule?.phases),
      enrollment: p.designModule?.enrollmentInfo?.count ?? null,
      conditions: p.conditionsModule?.conditions || [],
    };
  } catch { return null; }
}

/** Content words, for deciding whether a free-text note is about this study at all. */
const words = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/)
  .filter((w) => w.length > 3 && !['with','from','that','this','study','trial','patients','safety','efficacy'].includes(w));

function noteBelongs(note, title, conditions) {
  if (!note) return true;
  /* Short generic notes ("Positive results; published 2011") share no content word with any study
   * title by construction. They assert nothing about subject matter and must not be discarded. */
  if (words(note).length < 4) return true;
  const subject = new Set([...words(title), ...conditions.flatMap(words)]);
  const nw = words(note);
  if (!nw.length || !subject.size) return true;
  // A note sharing no content word with its own study's title or conditions is about something else.
  return nw.some((w) => subject.has(w));
}

const groups = [];
for (const f of fs.readdirSync('data/source-packs').filter((x) => x.endsWith('.json'))) {
  const pack = JSON.parse(fs.readFileSync(`data/source-packs/${f}`, 'utf-8'));
  const byArray = new Map();          // "path.to.array" -> Map(nct -> [indices])
  (function w(node, p) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((x, i) => {
        if (x && typeof x === 'object') {
          const nct = x.nctId || x.nct || (typeof x.id === 'string' && /^NCT\d{8}$/i.test(x.id) ? x.id : null);
          if (nct) {
            if (!byArray.has(p)) byArray.set(p, new Map());
            const m = byArray.get(p);
            const k = String(nct).toUpperCase();
            if (!m.has(k)) m.set(k, []);
            m.get(k).push(i);
          }
        }
        w(x, `${p}[${i}]`);
      });
      return;
    }
    Object.entries(node).forEach(([k, v]) => w(v, p ? `${p}.${k}` : k));
  })(pack, '');

  for (const [arrPath, m] of byArray) {
    for (const [nct, idxs] of m) {
      if (idxs.length > 1) groups.push({ file: `data/source-packs/${f}`, arrPath, nct, idxs });
    }
  }
}

console.log(`${APPLY ? 'APPLYING' : 'DRY RUN'} — ${groups.length} within-array duplicate group(s)\n`);

const getArr = (obj, path) => path.split('.').reduce((o, k) => {
  const m = k.match(/^(.*?)\[(\d+)\]$/);
  return m ? o[m[1]][+m[2]] : o[k];
}, obj);

for (const g of groups) {
  const reg = await registry(g.nct);
  await sleep(350);
  const pack = JSON.parse(fs.readFileSync(g.file, 'utf-8'));
  const arr = getArr(pack, g.arrPath);
  const records = g.idxs.map((i) => arr[i]);

  // Union of fields; later records fill gaps but never overwrite a value that matches the registry.
  const merged = {};
  const dropped = [];
  for (const rec of records) {
    for (const [k, v] of Object.entries(rec)) {
      if (v === undefined || v === null || v === '') continue;
      if (!(k in merged)) { merged[k] = v; continue; }
      if (JSON.stringify(merged[k]) === JSON.stringify(v)) continue;
      if (reg && k in reg && JSON.stringify(reg[k]) === JSON.stringify(v)) merged[k] = v;   // registry wins
      else if (reg && k in reg && JSON.stringify(reg[k]) === JSON.stringify(merged[k])) { /* keep */ }
      else dropped.push(`${k}: kept ${JSON.stringify(merged[k]).slice(0, 60)} / discarded ${JSON.stringify(v).slice(0, 60)}`);
    }
  }
  // A note that is about a different study must not survive the merge.
  if (merged.notes && reg && !noteBelongs(merged.notes, reg.title, reg.conditions)) {
    const alt = records.map((r) => r.notes).find((n) => n && noteBelongs(n, reg.title, reg.conditions));
    dropped.push(`notes: discarded "${String(merged.notes).slice(0, 70)}" — shares no term with this study's title or conditions`);
    if (alt) merged.notes = alt; else delete merged.notes;
  }

  console.log(`${g.file} ${g.arrPath} ${g.nct}  (${g.idxs.length} copies -> 1)`);
  console.log(`   fields kept: ${Object.keys(merged).length}`);
  dropped.forEach((d) => console.log(`   ${d}`));

  if (APPLY) {
    arr[g.idxs[0]] = merged;
    for (const i of g.idxs.slice(1).sort((a, b) => b - a)) arr.splice(i, 1);
    fs.writeFileSync(g.file, JSON.stringify(pack, null, 2) + '\n');
  }
}

if (!APPLY) console.log('\nNo files written. Re-run with --apply.');
