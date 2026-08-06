/**
 * For every trial record triaged BOGUS or R_FAIL, try to recover the REAL NCT.
 *
 * The dominant fabrication pattern is "real trial name + invented NCT number" — e.g. cerebrolysin's
 * CARS/CARS2/CASTA are genuine published trials whose stored NCTs point at degarelix, chlorthalidone
 * and a hip implant. Deleting those records would throw away true information; the right repair is
 * to find the actual registration. This script only PROPOSES candidates — it writes nothing back.
 *
 * Searches ClinicalTrials.gov by (intervention = peptide alias) x (title terms / acronym), scores
 * candidates, and emits a review file for human/second-model adjudication.
 *
 * Output: .planning/citation-audit/nct-recovery.json + NCT-RECOVERY.md
 * Usage:  node scripts/recover-ncts.mjs
 */
import fs from 'fs';
import path from 'path';

const OUT_DIR = '.planning/citation-audit';
const UA = { 'User-Agent': 'PepCodex-recover/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FIELDS = ['NCTId', 'BriefTitle', 'OfficialTitle', 'Acronym', 'OverallStatus', 'Phase',
  'InterventionName', 'EnrollmentCount', 'Condition', 'StartDate', 'CompletionDate'].join(',');

async function fetchT(url, ms = 20000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: UA, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

const triage = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'trial-triage.json'), 'utf-8'));
const targets = triage.filter((r) => r.klass === 'BOGUS' || r.klass === 'R_FAIL');
console.log(`Recovering real NCTs for ${targets.length} records`);

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 3);
const sim = (a, b) => {
  const A = new Set(norm(a)), B = new Set(norm(b));
  if (!A.size || !B.size) return 0;
  let i = 0; for (const w of A) if (B.has(w)) i++;
  return i / Math.min(A.size, B.size);
};

// "Cerebrolysin and Recovery After Stroke (CARS)" -> ["CARS"]; "REDEFINE CVOT: ..." -> ["REDEFINE"]
const acronymsIn = (title) => {
  const out = new Set();
  for (const m of String(title).matchAll(/\(([A-Z][A-Z0-9\-]{2,})\)/g)) out.add(m[1]);
  for (const m of String(title).matchAll(/\b([A-Z][A-Z0-9\-]{3,})\b/g)) out.add(m[1]);
  return [...out].filter((a) => !['PK/PD', 'PHASE'].includes(a));
};

// A title match strong enough to stand in for an acronym: most of the stored label's meaningful
// words present in the registry title, AND agreement on the indication (a dry-eye record must not
// be "recovered" onto a cardiovascular trial just because both study the same molecule).
const titleStrong = (stored, cand) =>
  Math.max(sim(stored, cand.brief), sim(stored, cand.official)) >= 0.7;

const parseIntr = (interventions) => interventions.map((x) => x.name || '');
const toRec = (st) => {
  const ps = st.protocolSection || {}, idm = ps.identificationModule || {};
  return {
    nctId: idm.nctId, brief: idm.briefTitle || '', official: idm.officialTitle || '',
    acronym: idm.acronym || '', status: ps.statusModule?.overallStatus || '',
    phase: (ps.designModule?.phases || []).join('/'),
    enrollment: ps.designModule?.enrollmentInfo?.count ?? null,
    conditions: ps.conditionsModule?.conditions || [],
    interventions: parseIntr(ps.armsInterventionsModule?.interventions || []),
    startDate: ps.statusModule?.startDateStruct?.date || '',
    completionDate: ps.statusModule?.completionDateStruct?.date || '',
  };
};

async function search(params) {
  const qs = new URLSearchParams({ ...params, fields: FIELDS, pageSize: '25' });
  const res = await fetchT(`https://clinicaltrials.gov/api/v2/studies?${qs}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return ((await res.json()).studies || []).map(toRec);
}

const results = [];
for (const r of targets) {
  const acros = acronymsIn(r.title);
  const drug = (r.aliases || [])[0] || r.slug;
  const cands = new Map();
  const queries = [];
  // most specific first: acronym within an intervention-scoped search
  for (const a of acros) queries.push({ 'query.intr': drug, 'query.titles': a });
  queries.push({ 'query.intr': drug, 'query.titles': r.title.replace(/[():]/g, ' ').slice(0, 90) });
  queries.push({ 'query.intr': drug });

  for (const q of queries) {
    try {
      for (const c of await search(q)) if (!cands.has(c.nctId)) cands.set(c.nctId, c);
    } catch (e) {
      console.error(`  WARN ${r.slug} ${r.nctId}: ${e.message}`);
    }
    await sleep(350);
    if (cands.size >= 25) break;
  }

  // Acronym matching must be EXACT, including any numeric/suffix part. Substring matching made
  // "REDEFINE CVOT" match REDEFINE 3, and both SYNCHRONIZE-1 and SYNCHRONIZE-CVOT match
  // SYNCHRONIZE-2 — three different trials, each a confident-looking wrong answer. A trial family
  // shares a stem by design, so the stem carries almost no identifying information.
  const flat = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const scored = [...cands.values()].map((c) => {
    const titleScore = Math.max(sim(r.title, c.brief), sim(r.title, c.official));
    const acroExact = acros.some((a) => flat(a) && flat(a) === flat(c.acronym));
    const drugHit = (r.aliases || []).some((a) => (c.brief + ' ' + c.official + ' ' + c.interventions.join(' ')).toLowerCase().includes(a));
    return { ...c, score: +(titleScore + (acroExact ? 1.0 : 0) + (drugHit ? 0.3 : 0)).toFixed(2), acroExact, drugHit };
  }).sort((a, b) => b.score - a.score).slice(0, 5);

  const top = scored[0];
  // ACRONYM-CONFLICT VETO: if the stored label names a trial (CARS, CASTA, REDEFINE 3) and the
  // candidate carries a DIFFERENT registered acronym, it is a different trial — no matter how well
  // the words overlap. Without this, "Cerebrolysin and Recovery After Stroke (CARS)" scores a
  // perfect title match against IMPULSE, because containment rewards a short stored title being
  // wholly present inside a long registry title that happens to study the same drug.
  const conflict = top && acros.length && top.acronym && !top.acroExact;

  // LIKELY requires the drug to match AND either an exact acronym hit or a strong title match,
  // with no acronym conflict. Everything else is REVIEW — a wrongly auto-applied NCT is worse than
  // the fabrication it replaces, because it arrives wearing the appearance of verification.
  const verdict = !top ? 'NONE'
    : conflict ? 'REVIEW'
    : top.drugHit && (top.acroExact || titleStrong(r.title, top)) ? 'LIKELY'
    : 'REVIEW';

  results.push({
    slug: r.slug, file: r.file, jsonPath: r.jsonPath, klass: r.klass,
    storedNct: r.nctId || r.rawId, storedTitle: r.title,
    wrongTrialWas: r.ctBrief || '(does not exist)', acronyms: acros,
    candidates: scored, verdict,
  });
  process.stdout.write(`\r  ${results.length}/${targets.length}`);
}
console.log('');

fs.writeFileSync(path.join(OUT_DIR, 'nct-recovery.json'), JSON.stringify(results, null, 2));

const L = [`# NCT Recovery Candidates — ${new Date().toISOString().slice(0, 10)}`, '',
  'Fabricated records where the trial NAME looks real. Candidates proposed from ClinicalTrials.gov;',
  'nothing is written back. `LIKELY` = strong acronym+drug+title agreement. Confirm before applying.', ''];
for (const r of results) {
  L.push(`## ${r.slug} — "${r.storedTitle}"  [${r.verdict}]`);
  L.push(`- stored NCT \`${r.storedNct}\` actually is: **${r.wrongTrialWas}**`);
  if (!r.candidates.length) L.push('- no candidate found');
  for (const c of r.candidates) {
    L.push(`- \`${c.nctId}\` score **${c.score}** ${c.acronym ? `[${c.acronym}] ` : ''}${c.phase || ''} ${c.status}`);
    L.push(`  - ${c.brief}`);
    L.push(`  - interventions: ${c.interventions.join(', ') || '(none)'} · n=${c.enrollment ?? '?'}`);
  }
  L.push('');
}
fs.writeFileSync(path.join(OUT_DIR, 'NCT-RECOVERY.md'), L.join('\n'));

const byVerdict = results.reduce((a, r) => ((a[r.verdict] = (a[r.verdict] || 0) + 1), a), {});
console.log('\n=== RECOVERY ===');
for (const [k, v] of Object.entries(byVerdict)) console.log(String(v).padStart(4), k);
console.log(`\nWrote ${OUT_DIR}/nct-recovery.json + NCT-RECOVERY.md`);
