/**
 * Resolve records that carry TWO different NCT ids.
 *
 * Introduced by an earlier repair in this same sweep: the structural pass wrote the verified NCT to
 * `nctId` but left the record's original `id`, and normalize-trial-ids.mjs had already run before
 * that pass so it never saw them. The renderer reads `nctId || id`, so the stale `id` is invisible
 * on the page but is still a wrong identifier in the data — and would become a live link the moment
 * anything read `id` first.
 *
 * Decides by asking the registry which id actually matches the stored title, rather than assuming
 * the newer field is right.
 */
import fs from 'fs';

const UA = { 'User-Agent': 'PepCodex-dualnct/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const APPLY = process.argv.includes('--apply');

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 3);
const sim = (a, b) => {
  const A = new Set(norm(a)), B = new Set(norm(b));
  if (!A.size || !B.size) return 0;
  let i = 0; for (const w of A) if (B.has(w)) i++;
  return i / Math.min(A.size, B.size);
};

async function ctgov(id) {
  const r = await fetch(`https://clinicaltrials.gov/api/v2/studies?filter.ids=${id}&fields=NCTId,BriefTitle,InterventionName`, { headers: UA });
  if (!r.ok) return null;
  const s = ((await r.json()).studies || [])[0];
  if (!s) return null;
  return {
    title: s.protocolSection.identificationModule.briefTitle || '',
    intr: (s.protocolSection.armsInterventionsModule?.interventions || []).map((x) => x.name || ''),
  };
}

const targets = [];
for (const f of fs.readdirSync('data/source-packs').filter((x) => x.endsWith('.json'))) {
  const file = `data/source-packs/${f}`;
  const j = JSON.parse(fs.readFileSync(file, 'utf-8'));
  (function w(o, p) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) return o.forEach((x, i) => w(x, `${p}[${i}]`));
    const a = String(o.id || ''), b = String(o.nctId || '');
    if (/^NCT\d{8}$/.test(a) && /^NCT\d{8}$/.test(b) && a !== b) targets.push({ file, path: p, id: a, nctId: b, title: o.title || '' });
    Object.entries(o).forEach(([k, v]) => w(v, `${p}.${k}`));
  })(j, '');
}
console.log(`records with two different NCT ids: ${targets.length}\n`);

const decisions = [];
for (const t of targets) {
  const [A, B] = [await ctgov(t.id), await ctgov(t.nctId)];
  await sleep(350);
  const sa = A ? +sim(t.title, A.title).toFixed(2) : -1;
  const sb = B ? +sim(t.title, B.title).toFixed(2) : -1;
  const keep = sb >= sa ? 'nctId' : 'id';
  decisions.push({ ...t, keep, keepId: keep === 'nctId' ? t.nctId : t.id, sa, sb,
    aTitle: A?.title || '(does not exist)', bTitle: B?.title || '(does not exist)' });
  console.log(`${t.file}${t.path}`);
  console.log(`  stored title : ${String(t.title).slice(0, 78)}`);
  console.log(`  id    ${t.id}  sim=${sa}  ${A ? A.title.slice(0, 60) : '(does not exist)'}`);
  console.log(`  nctId ${t.nctId}  sim=${sb}  ${B ? B.title.slice(0, 60) : '(does not exist)'}`);
  console.log(`  -> KEEP ${keep} (${keep === 'nctId' ? t.nctId : t.id}), drop the other\n`);
}

if (APPLY) {
  const byFile = {};
  for (const d of decisions) (byFile[d.file] ||= []).push(d);
  for (const [file, items] of Object.entries(byFile)) {
    const j = JSON.parse(fs.readFileSync(file, 'utf-8'));
    for (const it of items) {
      (function w(o, p) {
        if (!o || typeof o !== 'object') return;
        if (Array.isArray(o)) return o.forEach((x, i) => w(x, `${p}[${i}]`));
        if (p === it.path) {
          o.nctId = it.keepId;
          delete o.id;
          o.verifiedAt = '2026-07-25';
          o.verifiedAgainst = 'clinicaltrials.gov/api/v2';
        }
        Object.entries(o).forEach(([k, v]) => w(v, `${p}.${k}`));
      })(j, '');
    }
    fs.writeFileSync(file, JSON.stringify(j, null, 2) + '\n');
  }
  fs.writeFileSync('.planning/citation-audit/dual-nct-resolved.json', JSON.stringify(decisions, null, 2));
  console.log(`APPLIED — ${decisions.length} records collapsed to a single verified NCT.`);
} else {
  console.log('DRY RUN. Re-run with --apply.');
}
