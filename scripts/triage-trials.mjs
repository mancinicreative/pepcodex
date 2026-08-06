/**
 * Triage every trial record in data/source-packs/<slug>.json:trials[] against ClinicalTrials.gov.
 *
 * WHY THIS EXISTS — and why it is NOT a blind "overwrite our title with theirs":
 * pack.trials[] RENDERS (src/layouts/DossierLayout.astro, src/pages/trials/index.astro), and
 * src/utils/citation.ts turns each NCT into a live CT.gov link. A record can be wrong two ways:
 *   (a) the NCT is right but our title is sloppy/embellished  -> safe to overwrite from CT.gov
 *   (b) the NCT is wrong (points at another drug's trial)     -> overwriting the title would file a
 *       REAL competitor trial under this peptide and DESTROY the evidence that the record was bad.
 * (b) must never be auto-repaired. This script separates the two and repairs nothing.
 *
 * Output: .planning/citation-audit/trial-triage.json + TRIAL-TRIAGE.md
 * Usage:  node scripts/triage-trials.mjs
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const PACK_DIR = 'data/source-packs';
const DOSSIER_DIR = 'src/content/peptides';
const OUT_DIR = '.planning/citation-audit';
const UA = { 'User-Agent': 'PepCodex-triage/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchT(url, ms = 20000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { headers: UA, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

// --- aliases: a trial legitimately belongs to this peptide if it names the drug OR any alias ---
// Sources, in order: the dossier's public `aliases`, plus data/trial-match-aliases.json, a
// verification-only map of development codes / brand names / orthographic variants that appear in
// CT.gov intervention strings (e.g. "RGN-259", "Tβ4", "CagriSema"). Without it the matcher produced
// 26 false "wrong drug" hits on records that were entirely correct — every tb-500 Thymosin beta-4
// trial, and the TAK-448 kisspeptin analog. A weak alias list manufactures fake fabrications.
const MATCH_ALIASES = JSON.parse(fs.readFileSync('data/trial-match-aliases.json', 'utf-8'));
const aliasesFor = (slug) => {
  const p = path.join(DOSSIER_DIR, `${slug}.mdx`);
  const out = new Set([slug, slug.replace(/-/g, ' '), slug.replace(/-/g, '')]);
  if (fs.existsSync(p)) {
    const d = matter(fs.readFileSync(p, 'utf-8')).data;
    if (d.name) out.add(String(d.name));
    for (const a of d.aliases || []) out.add(String(a));
  }
  for (const a of MATCH_ALIASES[slug] || []) out.add(String(a));
  return [...out].map((s) => s.toLowerCase()).filter((s) => s.length >= 3);
};

const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3);

// containment: how much of the SHORTER title is present in the longer one. Registry titles are
// verbose; a correct short label should still be largely contained.
const sim = (a, b) => {
  const A = new Set(norm(a));
  const B = new Set(norm(b));
  if (!A.size || !B.size) return 0;
  let i = 0;
  for (const w of A) if (B.has(w)) i++;
  return i / Math.min(A.size, B.size);
};

// --- collect records: STRUCTURAL WALK, not `pack.trials` only ---
// Trial registrations are scattered across trials[], coreLibrary.trialRegistries[],
// coreLibrary.clinicalTrials[], coreLibrary.stealthBioTrials[], trialRegistries[],
// coreLibrary.clinicalTrialsRegistry[] and coreLibrary.primaryStudies[]. Triaging only trials[]
// left 57 registrations unchecked, 31 of which were fabricated (hCG trials pointing at sickle-cell
// and cerebral-malaria studies). Walk anything that carries a trial id, wherever it lives.
const records = [];
for (const f of fs.readdirSync(PACK_DIR).filter((x) => x.endsWith('.json'))) {
  const slug = f.replace(/\.json$/, '');
  const pack = JSON.parse(fs.readFileSync(path.join(PACK_DIR, f), 'utf-8'));
  const aliases = aliasesFor(slug);
  (function walk(node, p) {
    if (node == null || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach((x, i) => walk(x, `${p}[${i}]`));
    const raw = node.nctId || node.nct
      || (typeof node.id === 'string' && /^(NCT\d{8}|EUCTR|ACTRN|jRCT|ChiCTR|CTR\d|ISRCTN|NTR\d|DRKS)/i.test(node.id) ? node.id : null);
    if (raw) {
      const id = String(raw).toUpperCase();
      records.push({
        slug, file: `${PACK_DIR}/${f}`, jsonPath: p,
        nctId: /^NCT\d{8}$/.test(id) ? id : null,
        rawId: raw,
        title: node.title || '',
        phase: node.phase ?? null,
        status: node.status ?? null,
        enrollmentTarget: node.enrollmentTarget ?? null,
        aliases,
      });
    }
    Object.entries(node).forEach(([k, v]) => walk(v, `${p}.${k}`));
  })(pack, '');
}
const ids = [...new Set(records.filter((r) => r.nctId).map((r) => r.nctId))];
console.log(`Triage: ${records.length} trial records across ${new Set(records.map((r) => r.slug)).size} packs · ${ids.length} unique NCTs`);

// --- ground truth (briefTitle + officialTitle + acronym + interventions + status/phase/enrollment) ---
const FIELDS = [
  'NCTId', 'BriefTitle', 'OfficialTitle', 'Acronym', 'OverallStatus', 'Phase',
  'InterventionName', 'EnrollmentCount', 'Condition', 'StartDate', 'CompletionDate',
].join(',');

const gt = {};
let incomplete = false;
for (let i = 0; i < ids.length; i += 50) {
  const batch = ids.slice(i, i + 50);
  try {
    const res = await fetchT(
      `https://clinicaltrials.gov/api/v2/studies?filter.ids=${batch.join(',')}&fields=${FIELDS}&pageSize=100`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    for (const st of (await res.json()).studies || []) {
      const ps = st.protocolSection || {};
      const idm = ps.identificationModule || {};
      gt[(idm.nctId || '').toUpperCase()] = {
        brief: idm.briefTitle || '',
        official: idm.officialTitle || '',
        acronym: idm.acronym || '',
        status: ps.statusModule?.overallStatus || '',
        phase: (ps.designModule?.phases || []).join('/'),
        enrollment: ps.designModule?.enrollmentInfo?.count ?? null,
        conditions: ps.conditionsModule?.conditions || [],
        interventions: (ps.armsInterventionsModule?.interventions || []).map((x) => x.name || ''),
        startDate: ps.statusModule?.startDateStruct?.date || '',
        completionDate: ps.statusModule?.completionDateStruct?.date || '',
      };
    }
  } catch (e) {
    incomplete = true;
    console.error(`WARN: CT.gov batch ${i / 50 + 1} failed (${e.message})`);
  }
  await sleep(300);
  process.stdout.write(`\r  fetched ${Math.min(i + 50, ids.length)}/${ids.length}`);
}
console.log('');

// --- classify ---
const CLASS = {
  R_FAIL: 'NCT does not exist on CT.gov',
  OK: 'drug matches and title matches',
  AUTOFIX_TITLE: 'drug matches, stored title wrong -> safe to overwrite from CT.gov',
  BOGUS: 'drug does NOT match and title does NOT match -> fabricated record, needs judgment',
  COMPARATOR: 'drug does NOT match but title is plausible -> possible comparator, needs judgment',
  FOREIGN_REGISTRY: 'valid id in a non-CT.gov registry -> verify separately, do NOT delete',
  PLACEHOLDER: 'descriptive text where an id belongs -> not a trial record',
  MALFORMED: 'no usable trial id in any known registry',
};

// A trial id that is not an NCT is not automatically junk. jRCT2031210504 is SURPASS J-mono, a real
// tirzepatide trial; EUCTR / ANZCTR / ChiCTR / ISRCTN are equally real. Deleting these as
// "malformed" would destroy genuine evidence, so they get their own class and a separate check.
const FOREIGN_REGISTRIES = [
  { re: /^EUCTR\d{4}-\d{6}-\d{2}/i, name: 'EU-CTR' },
  { re: /^ACTRN\d{14}$/i, name: 'ANZCTR' },
  { re: /^jRCT[a-z0-9]+$/i, name: 'jRCT' },
  { re: /^(ChiCTR|CTR)\d+$/i, name: 'China' },
  { re: /^ISRCTN\d{8}$/i, name: 'ISRCTN' },
  { re: /^NTR\d+$/i, name: 'NTR' },
  { re: /^CTRI\/\d{4}\/\d+\/\d+$/i, name: 'CTRI-India' },
  { re: /^DRKS\d+$/i, name: 'DRKS' },
];

const out = [];
for (const r of records) {
  if (!r.nctId) {
    const raw = String(r.rawId || '').trim();
    const reg = FOREIGN_REGISTRIES.find((f) => f.re.test(raw));
    if (reg) out.push({ ...r, klass: 'FOREIGN_REGISTRY', registry: reg.name });
    else if (!raw || /^(historical|no registered trials|n\/a|none|tbd)$/i.test(raw) || !/\d/.test(raw))
      out.push({ ...r, klass: 'PLACEHOLDER' });
    else out.push({ ...r, klass: 'MALFORMED' });
    continue;
  }
  const g = gt[r.nctId];
  if (!g) {
    out.push({ ...r, klass: incomplete ? 'UNVERIFIED' : 'R_FAIL' });
    continue;
  }
  const hay = [g.brief, g.official, g.acronym, ...g.interventions, ...g.conditions].join(' ').toLowerCase();
  const drugMatch = r.aliases.some((a) => hay.includes(a));
  const best = Math.max(sim(r.title, g.brief), sim(r.title, g.official), g.acronym ? sim(r.title, g.acronym) : 0);
  // a stored short label that carries the registry's own acronym is CORRECT, not a mismatch
  const acronymOk = !!g.acronym && norm(r.title).includes(g.acronym.toLowerCase());
  const titleMatch = best >= 0.45 || acronymOk;

  let klass;
  if (drugMatch && titleMatch) klass = 'OK';
  else if (drugMatch && !titleMatch) klass = 'AUTOFIX_TITLE';
  else if (!drugMatch && titleMatch) klass = 'COMPARATOR';
  else klass = 'BOGUS';

  out.push({
    ...r, klass, drugMatch, titleMatch, acronymOk, sim: +best.toFixed(2),
    ctBrief: g.brief, ctOfficial: g.official, ctAcronym: g.acronym,
    ctStatus: g.status, ctPhase: g.phase, ctEnrollment: g.enrollment,
    ctInterventions: g.interventions, ctConditions: g.conditions,
    ctStartDate: g.startDate, ctCompletionDate: g.completionDate,
  });
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'trial-triage.json'), JSON.stringify(out, null, 2));

const counts = out.reduce((a, r) => ((a[r.klass] = (a[r.klass] || 0) + 1), a), {});
console.log('\n=== CLASSIFICATION ===');
for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(String(v).padStart(5), k.padEnd(14), CLASS[k] || '');
}

const perPack = {};
for (const r of out) {
  if (r.klass === 'OK') continue;
  (perPack[r.slug] ||= {})[r.klass] = (perPack[r.slug][r.klass] || 0) + 1;
}
console.log('\n=== PACKS NEEDING WORK ===');
Object.entries(perPack)
  .sort((a, b) => Object.values(b[1]).reduce((x, y) => x + y, 0) - Object.values(a[1]).reduce((x, y) => x + y, 0))
  .forEach(([k, v]) => console.log(String(Object.values(v).reduce((x, y) => x + y, 0)).padStart(4), k.padEnd(18), JSON.stringify(v)));

// markdown report
const L = [`# Trial Triage — ${new Date().toISOString().slice(0, 10)}`, '',
  `${records.length} trial records · ${ids.length} unique NCTs`, '',
  '| class | n | meaning |', '|---|---|---|',
  ...Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| \`${k}\` | ${v} | ${CLASS[k] || ''} |`), ''];
for (const k of ['R_FAIL', 'BOGUS', 'COMPARATOR', 'AUTOFIX_TITLE', 'FOREIGN_REGISTRY', 'PLACEHOLDER', 'MALFORMED', 'UNVERIFIED']) {
  const rows = out.filter((r) => r.klass === k);
  if (!rows.length) continue;
  L.push(`## ${k} (${rows.length})`, '');
  for (const r of rows) {
    L.push(`- **${r.slug}** \`${r.nctId || r.rawId}\` (${r.file} #${r.index})`);
    L.push(`  - stored: "${r.title}"`);
    if (r.ctBrief) L.push(`  - CT.gov: "${r.ctBrief}"${r.ctAcronym ? ` [${r.ctAcronym}]` : ''}`);
    if (r.ctInterventions?.length) L.push(`  - interventions: ${r.ctInterventions.join(', ')}`);
  }
  L.push('');
}
fs.writeFileSync(path.join(OUT_DIR, 'TRIAL-TRIAGE.md'), L.join('\n'));
console.log(`\nWrote ${OUT_DIR}/trial-triage.json + TRIAL-TRIAGE.md`);
if (incomplete) {
  console.error('\nFAIL: CT.gov coverage INCOMPLETE — triage is partial, do not act on it.');
  process.exit(1);
}
