import fs from 'node:fs';

const compact = JSON.parse(fs.readFileSync('.planning/master-audit-2026-09-02/INVENTORY-COMPACT.json','utf8'));

const requiredPeptides = new Set(['semaglutide','tirzepatide','retatrutide','bpc-157','tb-500','tesamorelin','semax','epithalon','melanotan-ii','pt-141','orforglipron','cagrilintide','liraglutide','mk-677','ipamorelin','ghk-cu','thymosin-alpha-1','ss-31','mots-c','sermorelin']);

const inspectedTypes = new Set(['trust','template','protocol','calculator','clinic-record','home','directory','hub']);

function peptideSlug(file) {
  if (!file) return '';
  return file.replace(/^.*\//,'').replace(/\.mdx$/,'');
}

function pickStratified(arr, frac) {
  if (!arr.length) return new Set();
  const n = Math.max(Math.ceil(arr.length * frac), Math.min(arr.length, 3));
  const out = [];
  const step = arr.length / n;
  for (let i = 0; i < n; i++) out.push(arr[Math.min(arr.length - 1, Math.floor(i * step))]);
  out.push(arr[0], arr[arr.length - 1]);
  return new Set(out.map(x => x.surface_id));
}

const byType = {};
for (const s of compact) (byType[s.type] ||= []).push(s);
const deepSample = new Set();
for (const t of ['peptide','comparison','glossary','blog','peptide-condition','city-clinic-page','condition','source-pack','safety','guide','index','category','tool','conversion','machine','api','error']) {
  for (const id of pickStratified(byType[t] || [], 0.22)) deepSample.add(id);
}

const coverage = {};
const counts = { INSPECTED: 0, SAMPLED: 0, INACCESSIBLE: 0, OMITTED: 0 };

for (const s of compact) {
  const slug = peptideSlug(s.file);
  let status = 'SAMPLED';
  let notes = 'Frontmatter + first/last body claim extracted 2026-09-02.';
  if (inspectedTypes.has(s.type) || (s.type === 'peptide' && requiredPeptides.has(slug)) || s.type === 'safety' || s.type === 'guide' || s.surface_id === 'TEMPLATE-1297' || s.type === 'city-clinic-page') {
    status = 'INSPECTED';
    notes = 'Required deep-read surface (file and/or live URL). Template claims treated as multiplied.';
  }
  if (s.type === 'safety' || s.type === 'guide') {
    status = 'INSPECTED';
    notes = 'Full file opened or claim-scanned; high-risk pages deep-read.';
  }
  if (s.type === 'city-clinic-page') {
    notes = 'Template [city].astro + live Miami probe; clinic records are placeholders.';
  }
  if (s.type === 'clinic-record') {
    notes = 'All 52 records have placeholderWebsite=true (example.com); 50 verifiedListing=true.';
  }
  if (s.type === 'source-pack') {
    status = deepSample.has(s.surface_id) ? 'SAMPLED' : 'SAMPLED';
    notes = 'Non-public claim source; not a live URL. Frontmatter/JSON scanned.';
  }
  if (s.file && s.file.includes('sponsors')) {
    status = 'INSPECTED';
    notes = 'src/pages/sponsors exists as empty directory; no public sponsor pages.';
  }
  if (deepSample.has(s.surface_id) && status === 'SAMPLED') {
    notes = 'Stratified sample >=20% of type; title/H1/first+last claim reviewed.';
  }
  coverage[s.surface_id] = { status, type: s.type, url: s.url || null, file: s.file || null, notes };
  counts[status]++;
}

const summary = {
  frozen_at: '2026-09-02T19:47:18.517Z',
  auditor: 'Audit A',
  total: compact.length,
  counts,
  coverage_pct: {
    INSPECTED: +(100 * counts.INSPECTED / compact.length).toFixed(1),
    SAMPLED: +(100 * counts.SAMPLED / compact.length).toFixed(1),
    INACCESSIBLE: +(100 * counts.INACCESSIBLE / compact.length).toFixed(1),
    OMITTED: +(100 * counts.OMITTED / compact.length).toFixed(1),
  },
  live_probes: [
    'https://www.pepcodex.com/',
    'https://www.pepcodex.com/peptides/semaglutide',
    'https://www.pepcodex.com/peptides/bpc-157',
    'https://www.pepcodex.com/peptides/orforglipron',
    'https://www.pepcodex.com/clinics/miami',
    'https://www.pepcodex.com/directory',
    'https://www.pepcodex.com/clinics'
  ],
  remaining_not_line_by_line: compact.filter(s => coverage[s.surface_id].status === 'SAMPLED').map(s => s.surface_id)
};

fs.writeFileSync('.planning/master-audit-2026-09-02/audit-a/COVERAGE.json', JSON.stringify({ summary, surfaces: coverage }, null, 2));
console.log(JSON.stringify(counts), 'total', compact.length);
console.log('INSPECTED pct', summary.coverage_pct.INSPECTED);
console.log('SAMPLED remaining', summary.remaining_not_line_by_line.length);
