import fs from 'node:fs';
import path from 'node:path';

const compact = JSON.parse(fs.readFileSync('.planning/master-audit-2026-09-02/INVENTORY-COMPACT.json','utf8'));

function extract(file) {
  if (!file || !fs.existsSync(file)) return { missing: true };
  const t = fs.readFileSync(file, 'utf8');
  const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const y = m ? m[1] : '';
  const body = m ? t.slice(m[0].length) : t;
  const grab = (k) => {
    const r = y.match(new RegExp('^' + k + ':\\s*(.*)$', 'm'));
    return r ? r[1].replace(/^['\"]|['\"]$/g, '').trim() : null;
  };
  const clean = body.replace(/<[^>]+>/g, ' ').replace(/[#>*`\-]/g, ' ').replace(/\s+/g, ' ').trim();
  const first = clean.slice(0, 280);
  const last = clean.slice(-280);
  const flags = [];
  const lc = (y + '\n' + body).toLowerCase();
  const hits = [
    ['dose','dose|mcg/kg|mg/kg|iu/day'],
    ['buy','buy |purchase|vendor|research chemical'],
    ['safe','\\bsafe\\b|\\beffective\\b|\\bproven\\b|\\bcures\\b'],
    ['verified','verified listing|verified provider|vetted'],
    ['boxed','boxed warning|medullary|men 2'],
    ['wada','wada'],
    ['compound','compounding|503a|category 2'],
  ];
  for (const [name, re] of hits) {
    if (new RegExp(re, 'i').test(lc)) flags.push(name);
  }
  const pmids = [...(y + body).matchAll(/pmid[:\s\"']+(\d{7,8})/gi)].map(x => x[1]);
  return {
    title: grab('title') || grab('name') || grab('metaTitle'),
    desc: grab('description') || grab('summary') || grab('metaDescription'),
    evidence: grab('evidenceStrength'),
    lastUpdated: grab('lastUpdated'),
    first, last, flags,
    pmidCount: pmids.length,
    bodyLen: body.length,
  };
}

const byType = {};
const samples = [];
for (const s of compact) {
  (byType[s.type] ||= []).push(s);
}

function pickStratified(arr, frac) {
  if (!arr.length) return [];
  const n = Math.max(Math.ceil(arr.length * frac), Math.min(arr.length, 3));
  const out = [];
  const step = arr.length / n;
  for (let i = 0; i < n; i++) out.push(arr[Math.min(arr.length - 1, Math.floor(i * step))]);
  out.push(arr[0], arr[arr.length - 1]);
  const seen = new Set();
  return out.filter(x => { if (seen.has(x.surface_id)) return false; seen.add(x.surface_id); return true; });
}

const remainingTypes = ['peptide','comparison','glossary','blog','peptide-condition','city-clinic-page','condition','source-pack'];
const sampleSet = new Set();
for (const t of remainingTypes) {
  for (const s of pickStratified(byType[t] || [], 0.22)) sampleSet.add(s.surface_id);
}

const requiredPeptides = new Set(['semaglutide','tirzepatide','retatrutide','bpc-157','tb-500','tesamorelin','semax','epithalon','melanotan-ii','pt-141','orforglipron','cagrilintide','liraglutide','mk-677','ipamorelin','ghk-cu','thymosin-alpha-1','ss-31','mots-c','sermorelin']);

const out = [];
for (const s of compact) {
  const rec = { surface_id: s.surface_id, type: s.type, url: s.url, file: s.file, title: s.title, robots: s.robots };
  const isRequiredType = ['trust','template','safety','guide','protocol','calculator','clinic-record','home','directory'].includes(s.type) || (s.type === 'peptide' && requiredPeptides.has((s.file||'').replace(/^.*\//,'').replace('.mdx','')));
  if (isRequiredType) rec.intent = 'INSPECTED';
  else if (sampleSet.has(s.surface_id)) rec.intent = 'SAMPLED-DEEP';
  else rec.intent = 'SAMPLED-MIN';
  if (s.file && /\.(mdx|md|astro|json|ts)$/.test(s.file) && fs.existsSync(s.file)) {
    rec.extract = extract(s.file);
  } else rec.extract = { missing: !s.file };
  out.push(rec);
}

fs.writeFileSync('.planning/master-audit-2026-09-02/audit-a/_sample-extract.json', JSON.stringify(out, null, 0));
const flags = out.filter(x => x.extract && x.extract.flags && x.extract.flags.length);
const byFlag = {};
for (const x of flags) {
  for (const f of x.extract.flags) {
    (byFlag[f] ||= []).push(x.surface_id + ' ' + x.type);
  }
}
console.log('surfaces', out.length);
console.log('with flags', flags.length);
for (const [k,v] of Object.entries(byFlag)) console.log(k, v.length);
console.log('missing files', out.filter(x => x.extract && x.extract.missing).length);
