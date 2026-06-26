#!/usr/bin/env node
/**
 * Citation Integrity Audit — VERIFY pass.
 *
 * Reads .planning/citation-audit/extract.json, takes every unique PMID that
 * appears OUTSIDE the scoring block, and batch-queries NCBI E-utilities
 * esummary for REAL metadata (title, authors, year, journal, pubtypes).
 *
 * Then, for each non-scoring occurrence, compares the claimed
 * author-surname / year / topic against the real metadata and assigns a
 * mismatch confidence. Writes:
 *   - .planning/citation-audit/pubmed-meta.json   (raw ground truth)
 *   - .planning/citation-audit/findings.json      (flagged occurrences)
 *   - .planning/citation-audit/findings.md        (human triage report)
 *
 * Network: NCBI esummary, <=200 ids per request, throttled. No edits.
 */
import fs from 'fs';
import path from 'path';

const OUT_DIR = '.planning/citation-audit';
const extract = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'extract.json'), 'utf8'));

const NCBI = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';
const BATCH = 180;
const SLEEP_MS = 400; // be polite (no API key => <=3/sec)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Verify ALL unique PMIDs (scoring + non-scoring) so we can also sanity-check,
// but flagging focuses on non-scoring. Numeric, length 4-8.
const pmids = extract.allPmids.filter((p) => /^\d{4,8}$/.test(p));

async function fetchBatch(ids, attempt = 0) {
  const url = `${NCBI}?db=pubmed&retmode=json&id=${ids.join(',')}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'PepCodex-citation-audit/1.0 (mailto:mancini.creative@gmail.com)' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    return json.result || {};
  } catch (e) {
    if (attempt < 3) {
      await sleep(1500 * (attempt + 1));
      return fetchBatch(ids, attempt + 1);
    }
    console.error('Batch failed:', e.message);
    return {};
  }
}

const meta = {}; // pmid -> {title, year, authors:[], journal, pubtypes:[], error}
let fetched = 0;
for (let i = 0; i < pmids.length; i += BATCH) {
  const chunk = pmids.slice(i, i + BATCH);
  const result = await fetchBatch(chunk);
  for (const id of chunk) {
    const r = result[id];
    if (!r || r.error) {
      meta[id] = { error: r?.error || 'not-found' };
      continue;
    }
    meta[id] = {
      title: r.title || '',
      year: (r.pubdate || '').match(/\d{4}/)?.[0] || '',
      authors: (r.authors || []).map((a) => a.name),
      journal: r.fulljournalname || r.source || '',
      pubtypes: r.pubtype || [],
    };
  }
  fetched += chunk.length;
  process.stdout.write(`fetched ${fetched}/${pmids.length}\n`);
  await sleep(SLEEP_MS);
}

fs.writeFileSync(path.join(OUT_DIR, 'pubmed-meta.json'), JSON.stringify(meta, null, 2));

// ---- Matching / flagging ----
const STOP = new Set('the a an of and or in on for to with from study trial review effects effect human humans patients peptide al et version not paper journal vol no pp'.split(' '));

function keywords(s) {
  return new Set(
    (s || '')
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP.has(w))
  );
}

// Extract a claimed author surname + year from context near a citation.
function claimedYear(ctx) {
  const m = ctx.match(/\b(19|20)\d{2}\b/);
  return m ? m[0] : '';
}
function claimedSurnames(ctx) {
  // Capitalized words that look like surnames (heuristic)
  const names = [...ctx.matchAll(/\b([A-Z][a-z]{3,})\b/g)].map((m) => m[1]);
  return names;
}

const findings = [];
for (const rec of extract.records) {
  if (rec.inScoring) continue; // leave scoring block intact
  const m = meta[rec.pmid];
  const f = { ...rec, real: m };
  const flags = [];

  if (!m || m.error) {
    flags.push('PMID_NOT_FOUND');
  } else {
    // year check
    const cy = claimedYear(rec.context);
    if (cy && m.year && Math.abs(+cy - +m.year) > 1) {
      flags.push(`YEAR_MISMATCH(claim ${cy} vs real ${m.year})`);
    }
    // author surname check
    const surnames = claimedSurnames(rec.context);
    const realAuthorStr = (m.authors || []).join(' ').toLowerCase();
    const hasAuthor = surnames.some((s) => realAuthorStr.includes(s.toLowerCase()));
    const sawAnyName = surnames.length > 0;
    // topic overlap between context and real title
    const ctxKw = keywords(rec.context);
    const titleKw = keywords(m.title);
    let overlap = 0;
    for (const w of titleKw) if (ctxKw.has(w)) overlap++;
    const overlapRatio = titleKw.size ? overlap / titleKw.size : 0;

    if (sawAnyName && !hasAuthor && overlapRatio < 0.12) {
      flags.push(`POSSIBLE_MISATTRIB(author-not-in-list, title-overlap=${overlap})`);
    } else if (overlapRatio < 0.08 && titleKw.size >= 4) {
      flags.push(`LOW_TOPIC_OVERLAP(${overlap}/${titleKw.size})`);
    }
  }

  if (flags.length) {
    f.flags = flags;
    findings.push(f);
  }
}

fs.writeFileSync(path.join(OUT_DIR, 'findings.json'), JSON.stringify(findings, null, 2));

// Markdown triage report (grouped by file)
const byFile = {};
for (const f of findings) (byFile[f.file] ||= []).push(f);
const notFound = findings.filter((f) => f.flags.includes('PMID_NOT_FOUND'));

let md = `# Citation Audit — Findings (auto-flagged)\n\n`;
md += `Generated: ${new Date().toISOString()}\n\n`;
md += `Unique PMIDs queried: **${pmids.length}**\n`;
md += `Non-scoring occurrences flagged: **${findings.length}**\n`;
md += `PMIDs that do NOT resolve on PubMed: **${notFound.length}**\n\n`;
md += `> Auto-flags are HEURISTIC. Each must be human-verified before edits.\n\n`;

md += `## A. PMIDs that do not resolve (highest priority)\n\n`;
const nfSeen = new Set();
for (const f of notFound) {
  if (nfSeen.has(f.file + f.pmid)) continue;
  nfSeen.add(f.file + f.pmid);
  md += `- **${f.file}:${f.line}** PMID \`${f.pmid}\` → ${f.real?.error || 'not found'}\n  - ctx: ${f.context}\n`;
}

md += `\n## B. Flagged by file (mismatch heuristics)\n\n`;
for (const file of Object.keys(byFile).sort()) {
  md += `### ${file}\n\n`;
  for (const f of byFile[file]) {
    md += `- **L${f.line}** PMID \`${f.pmid}\` — ${f.flags.join('; ')}\n`;
    if (f.real && !f.real.error) {
      md += `  - REAL: ${f.real.year} · ${(f.real.authors || []).slice(0, 2).join(', ')}${(f.real.authors||[]).length>2?' et al.':''} · "${(f.real.title || '').slice(0, 110)}" · ${f.real.journal}\n`;
    }
    md += `  - CLAIM ctx: ${f.context.slice(0, 240)}\n`;
  }
  md += `\n`;
}

fs.writeFileSync(path.join(OUT_DIR, 'findings.md'), md);

console.log(`\nDONE. queried=${pmids.length} flagged=${findings.length} not-found=${[...new Set(notFound.map(f=>f.pmid))].length}`);
console.log(`Wrote pubmed-meta.json, findings.json, findings.md to ${OUT_DIR}`);
