/**
 * Reconcile identifiers stored more than once with disagreeing facts.
 *
 * When the same NCT appears twice in a pack with enrollment 1605 in one place and 1200 in another,
 * at least one is invented — and whichever a reader happens to hit becomes "the fact". The registry
 * is the arbiter, so every copy is overwritten from ClinicalTrials.gov / PubMed and the duplicates
 * are forced into agreement rather than left for a future reader to pick between.
 *
 * Dry-run by default; pass --apply to write.
 */
import fs from 'fs';

const APPLY = process.argv.includes('--apply');
const UA = { 'User-Agent': 'PepCodex-reconcile/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function fetchT(url, ms = 25000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: UA, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

// collect every stored NCT / PMID occurrence
const nctSeen = new Set(), pmidSeen = new Set();
const packs = {};
for (const f of fs.readdirSync('data/source-packs').filter((x) => x.endsWith('.json'))) {
  const file = `data/source-packs/${f}`;
  packs[file] = JSON.parse(fs.readFileSync(file, 'utf-8'));
  (function walk(n) {
    if (n == null || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(walk);
    const nct = n.nctId || n.nct || (typeof n.id === 'string' && /^NCT\d{8}$/i.test(n.id) ? n.id : null);
    if (nct) nctSeen.add(String(nct).toUpperCase());
    const idp = String(n.id || '').match(/^PMID:?\s*(\d{6,9})$/i);
    const pm = n.pmid && /^\d{6,9}$/.test(String(n.pmid)) ? String(n.pmid) : idp ? idp[1] : null;
    if (pm) pmidSeen.add(pm);
    Object.values(n).forEach(walk);
  })(packs[file]);
}

// ground truth
const gtN = {};
const ncts = [...nctSeen];
for (let i = 0; i < ncts.length; i += 50) {
  try {
    const res = await fetchT(`https://clinicaltrials.gov/api/v2/studies?filter.ids=${ncts.slice(i, i + 50).join(',')}&fields=NCTId,BriefTitle,OverallStatus,Phase,EnrollmentCount&pageSize=100`);
    for (const st of ((await res.json()).studies || [])) {
      const ps = st.protocolSection;
      gtN[ps.identificationModule.nctId.toUpperCase()] = {
        status: ps.statusModule?.overallStatus || null,
        phase: (ps.designModule?.phases || []).join('/') || null,
        enrollment: ps.designModule?.enrollmentInfo?.count ?? null,
      };
    }
  } catch (e) { console.error(`  WARN ct.gov batch: ${e.message}`); }
  await sleep(300);
}
const gtP = {};
const pms = [...pmidSeen];
for (let i = 0; i < pms.length; i += 150) {
  try {
    const res = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${pms.slice(i, i + 150).join(',')}`);
    const j = (await res.json()).result || {};
    for (const id of j.uids || []) if (j[id] && !j[id].error) gtP[id] = { year: (j[id].pubdate || '').slice(0, 4) };
  } catch (e) { console.error(`  WARN pubmed batch: ${e.message}`); }
  await sleep(400);
}

let fixedN = 0, fixedP = 0;
const changes = [];
for (const [file, pack] of Object.entries(packs)) {
  let touched = false;
  (function walk(n) {
    if (n == null || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(walk);
    const nctRaw = n.nctId || n.nct || (typeof n.id === 'string' && /^NCT\d{8}$/i.test(n.id) ? n.id : null);
    if (nctRaw) {
      const g = gtN[String(nctRaw).toUpperCase()];
      if (g) {
        for (const [ours, theirs, key] of [
          ['enrollment', g.enrollment, 'enrollment'],
          ['enrollmentTarget', g.enrollment, 'enrollmentTarget'],
        ]) {
          if (n[ours] != null && theirs != null && Number(n[ours]) !== Number(theirs)) {
            changes.push(`${file} ${nctRaw} ${key}: ${n[ours]} -> ${theirs}`);
            n[ours] = theirs; touched = true; fixedN++;
          }
        }
        if (n.status != null && g.status && String(n.status).toLowerCase().replace(/[\s_-]/g, '') !== g.status.toLowerCase().replace(/[\s_-]/g, '')) {
          changes.push(`${file} ${nctRaw} status: ${n.status} -> ${g.status}`);
          n.status = g.status; touched = true; fixedN++;
        }
        if (n.phase != null && g.phase && String(n.phase).toLowerCase().replace(/[^0-9/]/g, '') !== g.phase.toLowerCase().replace(/[^0-9/]/g, '')) {
          changes.push(`${file} ${nctRaw} phase: ${n.phase} -> ${g.phase}`);
          n.phase = g.phase; touched = true; fixedN++;
        }
      }
    }
    const idp = String(n.id || '').match(/^PMID:?\s*(\d{6,9})$/i);
    const pm = n.pmid && /^\d{6,9}$/.test(String(n.pmid)) ? String(n.pmid) : idp ? idp[1] : null;
    if (pm && gtP[pm]?.year && n.year != null && String(n.year) !== gtP[pm].year) {
      changes.push(`${file} PMID:${pm} year: ${n.year} -> ${gtP[pm].year}`);
      n.year = Number(gtP[pm].year) || gtP[pm].year; touched = true; fixedP++;
    }
    Object.values(n).forEach(walk);
  })(pack);
  if (touched && APPLY) fs.writeFileSync(file, JSON.stringify(pack, null, 2) + '\n');
}

console.log(`${APPLY ? 'APPLIED' : 'DRY RUN'} — trial facts corrected ${fixedN} · publication years corrected ${fixedP}`);
for (const c of changes.slice(0, 40)) console.log(`  ${c}`);
if (changes.length > 40) console.log(`  ... and ${changes.length - 40} more`);
if (!APPLY) console.log('\nNo files written. Re-run with --apply.');
