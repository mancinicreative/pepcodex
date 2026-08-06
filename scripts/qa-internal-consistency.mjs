/**
 * Offline consistency gate: catches fabrication that needs NO network call.
 *
 * Every check here is a self-contradiction in our own data. If the same identifier is stored twice
 * with different facts, at least one of them is invented — no external lookup required to know that.
 * These are cheap, deterministic, and have essentially no false-positive risk, which makes them the
 * right thing to run on every build (the network-bound checks are slower and outage-prone).
 *
 * Found by an independent review pass after the identifier sweep had already "finished":
 *   - NCT05394519 (REDEFINE 2) stored as enrollment 1605/active in one array and 1200/completed in
 *     another, inside the same pack.
 *   - PMID 2119355 claimed by BOTH ghrp-6 and sermorelin as two different papers, with two
 *     different titles and two different DOIs.
 *
 * Usage: node scripts/qa-internal-consistency.mjs [--strict]
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const STRICT = process.argv.includes('--strict');
const problems = [];

// ---------- collect every identifier occurrence with its surrounding facts ----------
const occ = new Map(); // "NCT:xxx" -> [{ where, facts }]
const note = (kind, id, where, facts) => {
  const k = `${kind}:${String(id).toUpperCase()}`;
  if (!occ.has(k)) occ.set(k, []);
  occ.get(k).push({ where, facts });
};

const FACT_KEYS = ['title', 'phase', 'status', 'enrollment', 'enrollmentTarget', 'year', 'doi', 'journal'];
const factsOf = (o) => {
  const f = {};
  for (const k of FACT_KEYS) if (o[k] != null && o[k] !== '') f[k] = o[k];
  return f;
};

for (const f of fs.readdirSync('data/source-packs').filter((x) => x.endsWith('.json'))) {
  const file = `data/source-packs/${f}`;
  const pack = JSON.parse(fs.readFileSync(file, 'utf-8'));

  // sources.count / metadata counts that disagree with the actual array
  if (pack.sources && !Array.isArray(pack.sources) && typeof pack.sources.count === 'number') {
    // sources is a summary object elsewhere; nothing to compare
  }
  for (const [key, val] of Object.entries(pack)) {
    if (val && typeof val === 'object' && !Array.isArray(val) && typeof val.count === 'number') {
      const arr = Array.isArray(pack[key]) ? pack[key] : null;
      if (arr && arr.length !== val.count) {
        problems.push({ type: 'COUNT_MISMATCH', file, detail: `${key}.count=${val.count} but ${key} has ${arr.length} entries` });
      }
    }
  }

  (function walk(node, p) {
    if (node == null || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach((x, i) => walk(x, `${p}[${i}]`));
    const nct = node.nctId || node.nct || (typeof node.id === 'string' && /^NCT\d{8}$/i.test(node.id) ? node.id : null);
    if (nct) note('NCT', nct, `${f}${p}`, factsOf(node));
    const idPmid = String(node.id || '').match(/^PMID:?\s*(\d{6,9})$/i);
    const pmid = node.pmid && /^\d{6,9}$/.test(String(node.pmid)) ? String(node.pmid) : idPmid ? idPmid[1] : null;
    if (pmid) note('PMID', pmid, `${f}${p}`, factsOf(node));
    Object.entries(node).forEach(([k, v]) => walk(v, `${p}.${k}`));
  })(pack, '');
}

// dossier frontmatter too — the same study should not be described two ways
for (const f of fs.readdirSync('src/content/peptides').filter((x) => x.endsWith('.mdx'))) {
  const d = matter(fs.readFileSync(`src/content/peptides/${f}`, 'utf-8')).data;
  (function walk(node) {
    if (node == null || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(walk);
    if (node.pmid && /^\d{6,9}$/.test(String(node.pmid))) note('PMID', node.pmid, f, factsOf(node));
    Object.values(node).forEach(walk);
  })(d);
}

// ---------- 1. same identifier, conflicting facts ----------
const CONFLICT_KEYS = ['enrollment', 'enrollmentTarget', 'status', 'phase', 'year', 'doi'];
// Normalise away notation differences so the report shows real disagreements, not formatting.
// "PHASE3"/"phase 3"/"3" are the same claim; "active"/"active_not_recruiting" are the same
// recruitment family. A gate that cries wolf on formatting gets ignored, which is how the
// substantive conflicts (enrollment 1605 vs 1200) stayed invisible.
const normFact = (key, v) => {
  let s = String(v).toLowerCase().trim();
  if (key === 'phase') {
    // "N/A" and "NA" are the same claim. Stripping non-digits turned "N/A" into "/" while "NA"
    // fell through to "na", so the two spellings of "not applicable" read as a contradiction —
    // a gate bug, not a data defect. Collapse both before comparing.
    const p = s.replace(/phase/g, '').trim();
    if (p === '' || /^n\/?a$/.test(p) || p === 'not applicable') return 'na';
    return p.replace(/[^0-9/]/g, '') || p;
  }
  if (key === 'status') return s.replace(/[\s_-]+/g, '').replace(/^active.*/, 'active').replace(/^(completed|terminated|withdrawn|suspended|recruiting|enrolling.*|notyetrecruiting|unknown.*)$/, '$1');
  if (key === 'doi') return s.replace(/^doi:/, '');
  return s;
};
for (const [id, list] of occ) {
  if (list.length < 2) continue;
  for (const key of CONFLICT_KEYS) {
    const vals = new Map();
    for (const o of list) {
      if (o.facts[key] == null) continue;
      const v = normFact(key, o.facts[key]);
      if (!vals.has(v)) vals.set(v, []);
      vals.get(v).push(o.where);
    }
    if (vals.size > 1) {
      problems.push({ type: 'CONFLICT', id, key,
        detail: [...vals.entries()].map(([v, w]) => `${key}=${v} (${w.join(', ')})`).join('  VS  ') });
    }
  }
  // two different titles for the same identifier is only a problem if they are really different
  const titles = [...new Set(list.map((o) => (o.facts.title || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()).filter(Boolean))];
  if (titles.length > 1) {
    const words = titles.map((t) => new Set(t.split(' ').filter((w) => w.length > 3)));
    let minOverlap = 1;
    for (let i = 0; i < words.length; i++) for (let j = i + 1; j < words.length; j++) {
      let hit = 0; for (const w of words[i]) if (words[j].has(w)) hit++;
      minOverlap = Math.min(minOverlap, hit / Math.max(1, Math.min(words[i].size, words[j].size)));
    }
    if (minOverlap < 0.4) {
      // Advisory, not build-breaking: the same trial legitimately carries an editorial short label
      // ("REDEFINE 1: CagriSema vs Semaglutide in Obesity") alongside the registry's own verbose
      // title. That is a style inconsistency worth a human glance, NOT a factual contradiction the
      // way a differing enrollment count is. Only the numeric/status conflicts below fail a build.
      problems.push({ type: 'LABEL_VARIANCE', advisory: true, id, key: 'title',
        detail: list.filter((o) => o.facts.title).map((o) => `"${o.facts.title}" (${o.where})`).join('  VS  ') });
    }
  }
}

// ---------- 1b. one record carrying TWO different identifiers ----------
// A record with `id: NCT-A` and `nctId: NCT-B` is two claims about one study, and at most one can
// be right. This was introduced BY a repair pass in this repo: the structural fix wrote the verified
// NCT into `nctId` but left the original `id`, and the id-normaliser had already run. The renderer
// reads `nctId || id`, so the stale id was invisible on the page while still being a wrong
// identifier in the data — five records, each stale id pointing at an unrelated study (a dental
// sealant trial, a sickle-cell analgesia trial, asthma manual therapy).
for (const f of fs.readdirSync('data/source-packs').filter((x) => x.endsWith('.json'))) {
  const file = `data/source-packs/${f}`;
  (function w(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) return o.forEach(w);
    const a = String(o.id || ''), b = String(o.nctId || '');
    if (/^NCT\d{8}$/i.test(a) && /^NCT\d{8}$/i.test(b) && a.toUpperCase() !== b.toUpperCase()) {
      problems.push({ type: 'DUAL_IDENTIFIER', file,
        detail: `one record carries id=${a} AND nctId=${b} — at most one can describe this study` });
    }
    Object.values(o).forEach(w);
  })(JSON.parse(fs.readFileSync(file, 'utf-8')));
}

// ---------- 2. templated / patterned identifiers ----------
// Fabricated ids tend to be typed by hand: runs of consecutive digits, or repeated blocks.
const SEQ = /(0123456|1234567|2345678|3456789|123456|234567|345678|456789|12345678)/;
for (const [id] of occ) {
  const bare = id.split(':')[1] || '';
  const digits = bare.replace(/\D/g, '');
  if (SEQ.test(digits)) problems.push({ type: 'PATTERNED_ID', id, detail: 'identifier contains a sequential digit run — typical of a hand-invented id' });
}

// ---------- report ----------
const blocking = problems.filter((p) => !p.advisory);
const advisory = problems.filter((p) => p.advisory);
const byType = problems.reduce((a, p) => ((a[p.type] = (a[p.type] || 0) + 1), a), {});
console.log(`Internal consistency: ${occ.size} distinct identifiers checked.`);

if (advisory.length) {
  console.warn(`\nADVISORY: ${advisory.length} label variance(s) — same record, different editorial titles (non-blocking):`);
  for (const p of advisory.slice(0, 20)) console.warn(`  • ${p.id}\n      ${p.detail}`);
}
if (!blocking.length) {
  console.log(`\nPASS: no contradicting facts, count mismatches, or patterned identifiers.`);
  process.exit(0);
}
console.error(`\n${STRICT ? 'FAIL' : 'WARN'}: ${blocking.length} internal contradiction(s): ${JSON.stringify(byType)}`);
for (const p of blocking.slice(0, 60)) {
  console.error(`  • [${p.type}] ${p.id || p.file}${p.key ? ` (${p.key})` : ''}`);
  console.error(`      ${p.detail}`);
}
if (blocking.length > 60) console.error(`  ... and ${blocking.length - 60} more`);
process.exit(STRICT ? 1 : 0);
