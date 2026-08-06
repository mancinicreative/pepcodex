/**
 * Monthly research scan: find everything published or registered about our peptides in a window,
 * and emit a per-peptide worklist for the content agents.
 *
 * DESIGN: discovery is deterministic, judgment is not. This script does ONLY the mechanical part —
 * asking PubMed and ClinicalTrials.gov what is new — so agents never have to guess what exists and
 * can never "remember" a paper into being. Every item it emits carries a real, resolving identifier
 * fetched from the registry in this run. Agents then decide what is worth writing about.
 *
 * Windowing is per-peptide: each dossier's own `lastUpdated` is the natural floor, so a dossier that
 * has been current since March isn't re-reviewed against six months of noise. `--days N` overrides.
 *
 * Usage:
 *   node scripts/monthly-research-scan.mjs                 # since each dossier's lastUpdated
 *   node scripts/monthly-research-scan.mjs --days 30       # fixed 30-day window
 *   node scripts/monthly-research-scan.mjs --slug bpc-157  # single peptide
 *
 * Output: .planning/research-scan/<date>/<slug>.json  +  SUMMARY.md
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { isRelevant, isDistinctive } from '../verification/matchers.mjs';
import { searchPerAlias } from '../verification/pubmed.mjs';

const args = process.argv.slice(2);
const DAYS = args.includes('--days') ? Number(args[args.indexOf('--days') + 1]) : null;
const ONLY = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : null;
const TODAY = new Date().toISOString().slice(0, 10);
const OUT = path.join('.planning/research-scan', TODAY);
const UA = { 'User-Agent': 'PepCodex-scan/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MATCH_ALIASES = JSON.parse(fs.readFileSync('data/trial-match-aliases.json', 'utf-8'));

async function fetchT(url, ms = 30000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: UA, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

// --- what we already cite, so the scan reports only what is genuinely NEW ---
const known = { pmid: new Set(), nct: new Set() };
function harvest(node) {
  if (node == null || typeof node !== 'object') return;
  if (Array.isArray(node)) return node.forEach(harvest);
  for (const [k, v] of Object.entries(node)) {
    if (typeof v === 'string') {
      if (/^\d{6,9}$/.test(v) && /pmid|id/i.test(k)) known.pmid.add(v);
      for (const m of v.matchAll(/NCT\d{8}/gi)) known.nct.add(m[0].toUpperCase());
      const pm = v.match(/^PMID:?\s*(\d{6,9})$/i); if (pm) known.pmid.add(pm[1]);
    } else harvest(v);
  }
}
for (const f of fs.readdirSync('data/source-packs').filter((x) => x.endsWith('.json'))) {
  harvest(JSON.parse(fs.readFileSync(`data/source-packs/${f}`, 'utf-8')));
}
for (const f of fs.readdirSync('src/content/peptides').filter((x) => x.endsWith('.mdx'))) {
  harvest(matter(fs.readFileSync(`src/content/peptides/${f}`, 'utf-8')).data);
}
console.log(`Already cited: ${known.pmid.size} PMIDs · ${known.nct.size} NCTs`);

// --- peptides in scope ---
const dossiers = fs.readdirSync('src/content/peptides').filter((x) => x.endsWith('.mdx'))
  .map((f) => {
    const d = matter(fs.readFileSync(`src/content/peptides/${f}`, 'utf-8')).data;
    return { slug: f.replace(/\.mdx$/, ''), name: d.name || f, lastUpdated: d.lastUpdated ? new Date(d.lastUpdated) : null,
      aliases: [...new Set([d.name, ...(d.aliases || []), ...(MATCH_ALIASES[f.replace(/\.mdx$/, '')] || [])])].filter(Boolean) };
  })
  .filter((p) => !ONLY || p.slug === ONLY);

const windowStart = (p) => {
  if (DAYS) return new Date(Date.now() - DAYS * 864e5);
  return p.lastUpdated || new Date(Date.now() - 30 * 864e5);
};
const fmt = (d) => d.toISOString().slice(0, 10).replace(/-/g, '/');

fs.mkdirSync(OUT, { recursive: true });
const summary = [];

for (const p of dossiers) {
  const from = windowStart(p);
  // Query terms: distinctive aliases only, and NEVER ORed into a single query. A generic phrase
  // ("gastric peptide") matches papers about other compounds, and PubMed silently term-splits an
  // unmatched quoted phrase inside an OR — six selank aliases returning 0/0/0/2/2/0 alone returned
  // 28,694 combined. searchPerAlias asks one at a time and unions the ids.
  const searchTerms = (p.aliases.filter(isDistinctive).length ? p.aliases.filter(isDistinctive) : [p.name]);
  const out = { slug: p.slug, name: p.name, windowFrom: from.toISOString().slice(0, 10), scannedAt: TODAY,
    newPapers: [], newTrials: [], updatedTrials: [] };

  // --- PubMed: papers entered since the window ---
  try {
    const RETMAX = 200;
    const dateFilter = `("${fmt(from)}"[EDAT] : "3000"[EDAT])`;
    const res = await searchPerAlias(searchTerms, { retmax: RETMAX, sort: 'date', filter: dateFilter, primary: p.name });
    const ids = res.ids;
    out.queriedAliases = res.perAlias;
    // Aliases that returned far more than the primary name are naming a category, not this
    // compound. Their results are discarded before anything reaches the worklist, and the alias is
    // reported so the dossier's alias list can be corrected at source.
    if (res.suspectGeneric.length) out.suspectGenericAliases = res.suspectGeneric;
    // Never let a cap look like completeness. A truncated window that says nothing reads as
    // "everything was covered", which is the quiet version of a false claim.
    if (res.truncated.length) {
      out.truncated = { perAlias: res.truncated,
        note: `Some aliases returned more hits than were retrieved (cap ${RETMAX}). Narrow the window (--days) or raise retmax for full coverage.` };
    }
    if (res.anyFailed) out.partialQuery = true;
    const fresh = ids.filter((id) => !known.pmid.has(id));
    if (fresh.length) {
      // RELEVANCE FILTER — do not trust the query. Uses the CANONICAL matcher from
      // verification/matchers.mjs rather than a local copy. This filter was previously
      // reimplemented here, and the local copy did not have the generic-phrase guard that
      // isDistinctive adds, so long-but-meaningless aliases like "gastric peptide" would still
      // have passed papers about entirely different compounds into the worklist.
      const names = [...new Set([String(p.name), p.slug.replace(/-/g, ' '), ...p.aliases])];
      const text = {};
      for (let k = 0; k < fresh.length; k += 100) {
        try {
          const ef = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${fresh.slice(k, k + 100).join(',')}`);
          if (ef.ok) {
            const xml = await ef.text();
            for (const c of xml.split(/<PubmedArticle[ >]/).slice(1)) {
              const pm = (c.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
              if (pm) text[pm] = c.replace(/<[^>]+>/g, ' ').toLowerCase();
            }
          }
        } catch (e) { /* fall back to title-only below */ }
        await sleep(400);
      }
      const su = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${fresh.join(',')}`);
      const j = su.ok ? (await su.json()).result || {} : {};
      for (const id of j.uids || []) {
        if (!j[id] || j[id].error) continue;
        const hay = text[id] || String(j[id].title || '').toLowerCase();
        if (!isRelevant(names, hay)) { out.filteredOut = (out.filteredOut || 0) + 1; continue; }
        const aid = (j[id].articleids || []).find((a) => a.idtype === 'doi');
        out.newPapers.push({ pmid: id, doi: aid ? aid.value : null, title: j[id].title || '',
          journal: j[id].fulljournalname || j[id].source || '', pubdate: j[id].pubdate || '',
          firstAuthor: ((j[id].authors || [])[0] || {}).name || '',
          pubTypes: (j[id].pubtype || []) });
      }
      await sleep(380);
    }
  } catch (e) { out.pubmedError = e.message; }

  // --- ClinicalTrials.gov: registrations updated since the window ---
  try {
    const url = `https://clinicaltrials.gov/api/v2/studies?query.intr=${encodeURIComponent(p.name)}`
      + `&filter.advanced=${encodeURIComponent(`AREA[LastUpdatePostDate]RANGE[${from.toISOString().slice(0, 10)},MAX]`)}`
      + `&fields=NCTId,BriefTitle,Acronym,OverallStatus,Phase,EnrollmentCount,Condition,InterventionName,LastUpdatePostDate,StartDate`
      + `&pageSize=40`;
    const res = await fetchT(url);
    if (res.ok) {
      for (const st of ((await res.json()).studies || [])) {
        const ps = st.protocolSection, idm = ps.identificationModule;
        const rec = { nctId: idm.nctId, title: idm.briefTitle || '', acronym: idm.acronym || '',
          status: ps.statusModule?.overallStatus || '', phase: (ps.designModule?.phases || []).join('/'),
          enrollment: ps.designModule?.enrollmentInfo?.count ?? null,
          conditions: ps.conditionsModule?.conditions || [],
          interventions: (ps.armsInterventionsModule?.interventions || []).map((x) => x.name || ''),
          lastUpdate: ps.statusModule?.lastUpdatePostDateStruct?.date || '' };
        (known.nct.has(rec.nctId.toUpperCase()) ? out.updatedTrials : out.newTrials).push(rec);
      }
    }
  } catch (e) { out.ctgovError = e.message; }
  await sleep(320);

  const worklist = path.join(OUT, `${p.slug}.json`);
  if (out.newPapers.length || out.newTrials.length || out.updatedTrials.length) {
    fs.writeFileSync(worklist, JSON.stringify(out, null, 2));
  } else if (fs.existsSync(worklist)) {
    // A nothing-found result must REMOVE any earlier worklist for this peptide, not silently leave
    // it behind. Both runs write into the same dated directory, so a re-run after a matcher fix
    // would otherwise leave the superseded file sitting there looking current — which is how a
    // scan that correctly found nothing still hands an agent 29 papers about vasoactive intestinal
    // peptide to write up. Absence of findings is itself a finding and must overwrite.
    fs.unlinkSync(worklist);
  }
  summary.push({ slug: p.slug, from: out.windowFrom, papers: out.newPapers.length, truncated: !!out.truncated,
    newTrials: out.newTrials.length, updatedTrials: out.updatedTrials.length });
  process.stdout.write(`\r  scanned ${summary.length}/${dossiers.length}  (${p.slug})            `);
}
console.log('');

summary.sort((a, b) => (b.papers + b.newTrials) - (a.papers + a.newTrials));
const totals = summary.reduce((a, s) => ({ papers: a.papers + s.papers, newTrials: a.newTrials + s.newTrials, updated: a.updated + s.updatedTrials }), { papers: 0, newTrials: 0, updated: 0 });

const L = [`# Monthly Research Scan — ${TODAY}`, '',
  `Peptides scanned: **${dossiers.length}** · new papers: **${totals.papers}** · new trials: **${totals.newTrials}** · updated trials: **${totals.updated}**`, '',
  'Window per peptide is its dossier `lastUpdated` unless `--days` was passed. Only identifiers NOT',
  'already cited anywhere in the repo are listed as new. Every item was fetched from the registry in',
  'this run, so each carries a real, resolving id.', '',
  '| peptide | since | new papers | new trials | updated trials |', '|---|---|---|---|---|',
  ...summary.filter((s) => s.papers || s.newTrials || s.updatedTrials)
    .map((s) => `| \`${s.slug}\` | ${s.from} | ${s.papers} | ${s.newTrials} | ${s.updatedTrials} |`)];
fs.writeFileSync(path.join(OUT, 'SUMMARY.md'), L.join('\n'));

console.log(`\n=== SCAN COMPLETE ===`);
console.log(`  peptides ${dossiers.length} · new papers ${totals.papers} · new trials ${totals.newTrials} · updated trials ${totals.updated}`);
console.log(`  worklists: ${OUT}/`);
console.log('\ntop by volume:');
summary.slice(0, 15).forEach((s) => console.log(`  ${s.slug.padEnd(18)} papers ${String(s.papers).padStart(3)} · new trials ${String(s.newTrials).padStart(2)} · updated ${String(s.updatedTrials).padStart(2)}`));
