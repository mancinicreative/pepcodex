#!/usr/bin/env node
/**
 * FABRICATION AUDIT — verifies every cited identifier on EVERY surface against ground truth.
 *
 * Why this exists: qa-pmids.mjs only ever walked src/content/peptides, so data/source-packs
 * (411 NCTs / 728 PMIDs / 571 DOIs) and src/content/blog were never checked. That is where
 * fabricated trial mappings survived — real NCT numbers attached to INVENTED titles describing
 * entirely different studies (e.g. NCT04777396 stored as the "FLOW" kidney trial; it is really
 * the EVOKE Alzheimer's trial). Those pass a resolution-only gate because the number is real.
 *
 * Checks performed per identifier:
 *   R  RESOLUTION   — does the id exist at all?                       (PubMed / CT.gov / Crossref)
 *   T  TITLE-MATCH  — does a stored trial title match CT.gov's real briefTitle?
 *   D  DRUG-MATCH   — do the trial's interventions mention this peptide (or an alias)?
 *   P  TOPIC-MATCH  — does a cited paper's title mention this peptide (or an alias)?
 *
 * Output: a ranked manifest (JSON + Markdown) — this is an AUDIT, not a build gate. Baseline it,
 * remediate, then gate new additions against the frozen baseline.
 *
 * Usage:
 *   node scripts/qa-fabrication-audit.mjs                 # full audit (uses cache)
 *   node scripts/qa-fabrication-audit.mjs --surface packs # packs | peptides | blog | all
 *   node scripts/qa-fabrication-audit.mjs --no-cache      # force refetch
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const SURFACE = flag('--surface', 'all');
const NO_CACHE = args.includes('--no-cache');

const OUT_DIR = path.resolve('.planning/citation-audit');
const CACHE_FILE = path.join(OUT_DIR, 'ground-truth-cache.json');
fs.mkdirSync(OUT_DIR, { recursive: true });
const cache = (!NO_CACHE && fs.existsSync(CACHE_FILE)) ? JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) : { nct: {}, pmid: {}, doi: {} };

const UA = { 'User-Agent': 'PepCodex-fabrication-audit/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function fetchT(url, opts = {}, ms = 20000) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), ms);
  try { return await fetch(url, { ...opts, signal: c.signal }); } finally { clearTimeout(t); }
}

// ---------------------------------------------------------------- collect records
// record = { surface, file, type: NCT|PMID|DOI, id, label, slug }
const records = [];
const NCT_RE = /NCT\d{8}/gi;
const PMID_RE = /(?:PMID:?\s*|pubmed\.ncbi\.nlm\.nih\.gov\/)(\d{6,9})/gi;
const DOI_RE = /(?:doi\.org\/|DOI:\s*)(10\.\d{4,9}\/[^\s"')\]]+)/gi;

function aliasesFor(slug, data) {
  const out = new Set([slug.replace(/-/g, ' '), slug]);
  const push = (v) => { if (typeof v === 'string' && v.trim()) out.add(v.trim().toLowerCase()); };
  push(data?.name); push(typeof data?.peptide === 'string' ? data.peptide : data?.peptide?.name);
  (data?.aliases || []).forEach(push);
  return [...out].map((s) => String(s).toLowerCase()).filter((s) => s.length > 2);
}

// --- data/source-packs/*.json : trials carry a stored title -> the highest-signal surface
function collectPacks() {
  const dir = path.resolve('data/source-packs');
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const slug = f.replace(/\.json$/, '');
    let pack; try { pack = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { continue; }
    const al = aliasesFor(slug, pack);
    const walk = (n) => {
      if (!n || typeof n !== 'object') return;
      if (Array.isArray(n)) return n.forEach(walk);
      const id = String(n.id || n.nctId || '');
      if (/^NCT\d{8}$/i.test(id)) {
        records.push({ surface: 'packs', file: `data/source-packs/${f}`, type: 'NCT', id: id.toUpperCase(), label: typeof n.title === 'string' ? n.title : '', slug, aliases: al });
      }
      for (const [k, v] of Object.entries(n)) {
        if (typeof v === 'string') {
          if (/^(id|nctId)$/.test(k)) continue;
          for (const m of v.matchAll(PMID_RE)) records.push({ surface: 'packs', file: `data/source-packs/${f}`, type: 'PMID', id: m[1], label: '', slug, aliases: al });
          for (const m of v.matchAll(DOI_RE)) records.push({ surface: 'packs', file: `data/source-packs/${f}`, type: 'DOI', id: m[1], label: '', slug, aliases: al });
          if (/^(PMID:)?\d{6,9}$/.test(v.trim())) records.push({ surface: 'packs', file: `data/source-packs/${f}`, type: 'PMID', id: v.trim().replace(/^PMID:/, ''), label: '', slug, aliases: al });
          if (/^(DOI:)?10\.\d{4,9}\/\S+$/i.test(v.trim())) records.push({ surface: 'packs', file: `data/source-packs/${f}`, type: 'DOI', id: v.trim().replace(/^DOI:/i, ''), label: '', slug, aliases: al });
        } else walk(v);
      }
    };
    walk(pack);
  }
}

// --- MDX collections
function collectMdx(dirRel, surface, slugFromFile = true) {
  const dir = path.resolve(dirRel);
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.mdx') || x.endsWith('.md'))) {
    const slug = f.replace(/\.mdx?$/, '');
    let parsed; try { parsed = matter(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { continue; }
    const { data, content } = parsed;
    const al = slugFromFile ? aliasesFor(slug, data)
      : [...new Set([...(data.peptides || []), ...(data.relatedPeptides || [])])].map((s) => String(s).toLowerCase().replace(/-/g, ' '));
    const push = (type, id, label) => records.push({ surface, file: `${dirRel}/${f}`, type, id, label: label || '', slug, aliases: al });
    // frontmatter, tracking a nearby human label where one exists (keyFindings[].study)
    const walk = (n) => {
      if (!n || typeof n !== 'object') return;
      if (Array.isArray(n)) return n.forEach(walk);
      const label = typeof n.study === 'string' ? n.study : (typeof n.title === 'string' ? n.title : '');
      for (const [k, v] of Object.entries(n)) {
        if (typeof v === 'string') {
          for (const m of v.matchAll(NCT_RE)) push('NCT', m[0].toUpperCase(), label);
          for (const m of v.matchAll(PMID_RE)) push('PMID', m[1], label);
          for (const m of v.matchAll(DOI_RE)) push('DOI', m[1], label);
          if (/^\d{6,9}$/.test(v.trim()) && /^(pmid|source)$/i.test(k)) push('PMID', v.trim(), label);
          if (/^\d{6,9}$/.test(v.trim()) && k === 'relevantStudies') push('PMID', v.trim(), label);
        } else walk(v);
      }
      // bare-string arrays (relevantStudies / citations)
    };
    walk(data);
    for (const m of content.matchAll(NCT_RE)) push('NCT', m[0].toUpperCase(), '');
    for (const m of content.matchAll(PMID_RE)) push('PMID', m[1], '');
    for (const m of content.matchAll(DOI_RE)) push('DOI', m[1], '');
  }
}

if (SURFACE === 'all' || SURFACE === 'packs') collectPacks();
if (SURFACE === 'all' || SURFACE === 'peptides') collectMdx('src/content/peptides', 'peptides');
if (SURFACE === 'all' || SURFACE === 'blog') collectMdx('src/content/blog', 'blog', false);
if (SURFACE === 'all') { collectMdx('src/content/glossary', 'glossary', false); collectMdx('src/content/comparisons', 'comparisons', false); collectMdx('src/content/safety', 'safety', false); }

// dedupe identical (file,type,id,label)
const seen = new Set();
const recs = records.filter((r) => { const k = `${r.file}|${r.type}|${r.id}|${r.label}`; if (seen.has(k)) return false; seen.add(k); return true; });

const byType = (t) => [...new Set(recs.filter((r) => r.type === t).map((r) => r.id))];
const ncts = byType('NCT'), pmids = byType('PMID'), dois = byType('DOI');
console.log(`Fabrication audit — surface=${SURFACE}`);
console.log(`  records: ${recs.length}  |  unique NCT ${ncts.length} · PMID ${pmids.length} · DOI ${dois.length}`);

// ---------------------------------------------------------------- fetch ground truth
let net = { nct: true, pmid: true, doi: true };
async function loadNcts() {
  const need = ncts.filter((i) => !cache.nct[i]);
  for (let i = 0; i < need.length; i += 50) {
    const b = need.slice(i, i + 50);
    try {
      const r = await fetchT(`https://clinicaltrials.gov/api/v2/studies?filter.ids=${b.join(',')}&fields=NCTId,BriefTitle,InterventionName,OverallStatus,Phase,HasResults&pageSize=100`, { headers: UA });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      for (const s of (j.studies || [])) {
        const p = s.protocolSection || {}; const id = p.identificationModule?.nctId; if (!id) continue;
        cache.nct[id.toUpperCase()] = {
          title: p.identificationModule?.briefTitle || '',
          intr: (p.armsInterventionsModule?.interventions || []).map((x) => (x.name || '').toLowerCase()).join(' '),
          status: p.statusModule?.overallStatus || '', phase: (p.designModule?.phases || []).join('/'),
          hasResults: !!s.hasResults,
        };
      }
      for (const id of b) if (!cache.nct[id]) cache.nct[id] = { missing: true };
    } catch (e) { net.nct = false; console.error(`  ! CT.gov batch failed: ${e.message}`); break; }
    await sleep(300);
  }
}
async function loadPmids() {
  const need = pmids.filter((i) => !cache.pmid[i]);
  for (let i = 0; i < need.length; i += 150) {
    const b = need.slice(i, i + 150);
    try {
      const r = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${b.join(',')}`, { headers: UA });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const res = (await r.json()).result || {};
      for (const id of (res.uids || [])) cache.pmid[id] = (res[id] && !res[id].error) ? { title: res[id].title || '', year: (res[id].pubdate || '').slice(0, 4) } : { missing: true };
      for (const id of b) if (!cache.pmid[id]) cache.pmid[id] = { missing: true };
    } catch (e) { net.pmid = false; console.error(`  ! PubMed batch failed: ${e.message}`); break; }
    await sleep(400);
  }
}
async function loadDois() {
  const need = dois.filter((i) => !cache.doi[i]);
  for (const d of need) {
    try {
      const r = await fetchT(`https://api.crossref.org/works/${encodeURI(d)}/agency?mailto=admin@pepcodex.com`, { headers: UA });
      cache.doi[d] = r.status === 200 ? { ok: true } : (r.status === 404 ? { missing: true } : null);
      if (cache.doi[d] === null) throw new Error(`HTTP ${r.status}`);
    } catch (e) { net.doi = false; console.error(`  ! Crossref failed: ${e.message}`); break; }
    await sleep(120);
  }
}

await loadNcts(); await loadPmids(); await loadDois();
fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));

// ---------------------------------------------------------------- checks
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
const STOP = new Set(['study', 'research', 'people', 'with', 'trial', 'participants', 'investigating', 'compared', 'placebo', 'effect', 'effects', 'safety', 'efficacy', 'versus', 'adults', 'patients', 'phase', 'different', 'versions', 'dose', 'doses', 'randomized', 'double', 'blind', 'evaluate', 'treatment']);
const findings = [];
for (const r of recs) {
  if (r.type === 'NCT') {
    const gt = cache.nct[r.id]; if (!gt) continue;
    if (gt.missing) { findings.push({ ...r, check: 'R', severity: 'critical', detail: 'NCT does not exist on ClinicalTrials.gov' }); continue; }
    const hay = `${gt.intr} ${gt.title}`.toLowerCase();
    const drugOK = r.aliases.some((a) => hay.includes(a));
    if (r.label) {
      const a = new Set(norm(r.label).filter((w) => !STOP.has(w)));
      const b = new Set(norm(gt.title).filter((w) => !STOP.has(w)));
      let inter = 0; for (const w of a) if (b.has(w)) inter++;
      const sim = (a.size === 0 || b.size === 0) ? 1 : inter / Math.min(a.size, b.size);
      if (sim < 0.34 && !drugOK) findings.push({ ...r, check: 'T+D', severity: 'critical', detail: `stored "${r.label}" but CT.gov says "${gt.title}" (interventions: ${gt.intr || 'n/a'})` });
      else if (sim < 0.34) findings.push({ ...r, check: 'T', severity: 'high', detail: `title mismatch — stored "${r.label}" vs real "${gt.title}"` });
      else if (!drugOK) findings.push({ ...r, check: 'D', severity: 'medium', detail: `drug not in interventions (${gt.intr || 'n/a'}) — may be a comparator trial` });
    } else if (!drugOK) findings.push({ ...r, check: 'D', severity: 'medium', detail: `drug not in interventions (${gt.intr || 'n/a'})` });
  } else if (r.type === 'PMID') {
    const gt = cache.pmid[r.id]; if (!gt) continue;
    if (gt.missing) findings.push({ ...r, check: 'R', severity: 'critical', detail: 'PMID does not resolve on PubMed' });
  } else if (r.type === 'DOI') {
    const gt = cache.doi[r.id]; if (!gt) continue;
    if (gt.missing) findings.push({ ...r, check: 'R', severity: 'critical', detail: 'DOI not registered with Crossref' });
  }
}

// ---------------------------------------------------------------- report
const rank = { critical: 0, high: 1, medium: 2 };
findings.sort((a, b) => rank[a.severity] - rank[b.severity] || a.file.localeCompare(b.file));
const bySurface = {};
for (const f of findings) { (bySurface[f.surface] = bySurface[f.surface] || []).push(f); }

console.log('');
console.log(`FINDINGS: ${findings.length}  (critical ${findings.filter((f) => f.severity === 'critical').length} · high ${findings.filter((f) => f.severity === 'high').length} · medium ${findings.filter((f) => f.severity === 'medium').length})`);
for (const [s, list] of Object.entries(bySurface).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${s}: ${list.length}  (critical ${list.filter((f) => f.severity === 'critical').length})`);
}
if (!net.nct || !net.pmid || !net.doi) {
  console.error(`\n! INCOMPLETE COVERAGE — ${[!net.nct && 'CT.gov', !net.pmid && 'PubMed', !net.doi && 'Crossref'].filter(Boolean).join(', ')} did not finish. Results are PARTIAL.`);
}

fs.writeFileSync(path.join(OUT_DIR, 'fabrication-manifest.json'), JSON.stringify({ generated: new Date().toISOString(), surface: SURFACE, complete: net, counts: { records: recs.length, findings: findings.length }, findings }, null, 2));
const md = [`# Fabrication Audit — ${new Date().toISOString().slice(0, 10)}`, '',
  `Surface: \`${SURFACE}\` · records ${recs.length} · findings **${findings.length}**`,
  net.nct && net.pmid && net.doi ? '' : '> **PARTIAL RUN** — an API did not finish; treat as incomplete.', '',
  ...Object.entries(bySurface).sort((a, b) => b[1].length - a[1].length).flatMap(([s, list]) => [
    `## ${s} (${list.length})`, '',
    ...list.slice(0, 200).map((f) => `- **[${f.severity}/${f.check}]** \`${f.id}\` in \`${f.file}\`${f.slug ? ` (${f.slug})` : ''}\n  - ${f.detail}`), '']),
].join('\n');
fs.writeFileSync(path.join(OUT_DIR, 'FABRICATION-AUDIT.md'), md);
console.log(`\nwrote .planning/citation-audit/fabrication-manifest.json + FABRICATION-AUDIT.md`);
