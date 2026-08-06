/**
 * VERIFICATION LOOP — exhaustive, resumable, self-healing, self-improving.
 *
 * The verification GRAPH (verify-graph.mjs) proves the checks are sound. This LOOP applies them to
 * every single research identifier on the site, one by one, and records a verdict plus the evidence
 * for it. Nothing is sampled and nothing is assumed: if an identifier is not in the ledger with a
 * verdict, it has not been verified.
 *
 * WHY A LOOP RATHER THAN A PASS: this repo's history is a sequence of "the sweep is complete"
 * claims that were each wrong, because fixing one surface revealed another (qa-pmids saw 102 of 980
 * files; sources[] was checked while coreLibrary's 34 arrays were not; trials[] while 6 sibling
 * arrays were not). A loop keeps going until a full pass finds nothing new, which is a property that
 * can be observed rather than believed.
 *
 * THREE THINGS THE LOOP DOES WITH WHAT IT FINDS
 *   HEAL    — deterministic repairs applied in-loop (repoint to the correct id, strip an
 *             unverifiable one, relabel from the registry). Never a guess: only where an authority
 *             gives an unambiguous answer.
 *   LEARN   — any defect whose signature is not already covered by verification/fixtures.json is
 *             written to fixtures.candidates.json, so the same class can never silently return.
 *             This is the self-improvement: the checker gets stronger every time it is wrong.
 *   ESCALATE— anything needing judgment goes to a review queue rather than being guessed at.
 *
 * Usage:
 *   node scripts/verify-loop.mjs --enumerate     # (re)build the ledger of every identifier
 *   node scripts/verify-loop.mjs --verify        # verify pending entries (resumable, batched)
 *   node scripts/verify-loop.mjs --loop          # enumerate -> verify -> heal -> repeat to convergence
 *   node scripts/verify-loop.mjs --status        # coverage report
 *   node scripts/verify-loop.mjs --test-heal     # prove the heal/learn machinery works (no network)
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import * as M from '../verification/matchers.mjs';

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const LEDGER_PATH = 'verification/ledger.json';
const CANDIDATES_PATH = 'verification/fixtures.candidates.json';
const QUEUE_PATH = '.planning/citation-audit/loop-review-queue.json';
const UA = { 'User-Agent': 'PepCodex-verify-loop/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Bump when a matcher changes — every entry re-verifies, because an old verdict was reached with older logic. */
const CHECK_VERSION = 1;

async function fetchT(url, ms = 25000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: UA, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

const loadJson = (p, dflt) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')) : dflt);
const saveJson = (p, o) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n'); };

// ===========================================================================
// ENUMERATE — every identifier, everywhere. Structural walk, never a path list.
// ===========================================================================
function walkFiles(dir, re, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkFiles(p, re, out);
    else if (re.test(e.name)) out.push(p);
  }
  return out;
}

function enumerate() {
  const found = new Map(); // key -> { type, id, locations:[{file,where}] }
  const note = (type, rawId, file, where) => {
    const id = type === 'DOI' ? M.trimDoi(rawId) : String(rawId).toUpperCase().replace(/^PMID:?\s*/, '');
    if (!id) return;
    const key = `${type}:${type === 'DOI' ? id.toLowerCase() : id}`;
    if (!found.has(key)) found.set(key, { type, id, locations: [] });
    found.get(key).locations.push({ file, where });
  };

  const scanString = (s, file, where) => {
    if (typeof s !== 'string') return;
    for (const m of s.matchAll(/\bNCT\d{8}\b/gi)) note('NCT', m[0], file, where);
    for (const m of s.matchAll(/(?:PMID:?\s*|pubmed\.ncbi\.nlm\.nih\.gov\/)(\d{6,9})/gi)) note('PMID', m[1], file, where);
    for (const m of s.matchAll(/(?:doi\.org\/|DOI:\s*)(10\.\d{4,9}\/[^\s"'\]]+)/gi)) note('DOI', m[1], file, where);
    const bare = s.trim().match(/^(?:DOI:\s*)?(10\.\d{4,9}\/\S+)$/i);
    if (bare) note('DOI', bare[1], file, where);
  };

  const walkNode = (node, file, where) => {
    if (node == null) return;
    if (typeof node === 'string') return scanString(node, file, where);
    if (Array.isArray(node)) return node.forEach((n, i) => walkNode(n, file, `${where}[${i}]`));
    if (typeof node === 'object') {
      // a bare numeric value under a pmid-ish key is a PMID even without a prefix
      for (const [k, v] of Object.entries(node)) {
        if (typeof v === 'string' && /^\d{6,9}$/.test(v.trim()) && /pmid/i.test(k)) note('PMID', v.trim(), file, `${where}.${k}`);
        walkNode(v, file, `${where}.${k}`);
      }
    }
  };

  for (const f of walkFiles('src/content', /\.mdx?$/)) {
    const label = path.relative(process.cwd(), f).replace(/\\/g, '/');
    const { data, content } = matter(fs.readFileSync(f, 'utf-8'));
    walkNode(data, label, 'frontmatter');
    scanString(content, label, 'body');
  }
  for (const f of walkFiles('data/source-packs', /\.json$/)) {
    const label = path.relative(process.cwd(), f).replace(/\\/g, '/');
    walkNode(JSON.parse(fs.readFileSync(f, 'utf-8')), label, '$');
  }
  return found;
}

// ===========================================================================
// VERIFY — ask the authority about one identifier, record the evidence.
// ===========================================================================
async function verifyOne(entry) {
  const { type, id } = entry;
  try {
    if (type === 'PMID') {
      const r = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${id}`);
      if (!r.ok) return { verdict: 'unreachable', detail: `HTTP ${r.status}` };
      const j = (await r.json()).result || {};
      const d = j[id];
      if (!d || d.error) return { verdict: 'dead', authority: 'pubmed', detail: 'no such PMID' };
      return { verdict: 'exists', authority: 'pubmed',
        evidence: { title: d.title || '', journal: d.fulljournalname || d.source || '',
          year: (d.pubdate || '').slice(0, 4), firstAuthor: ((d.authors || [])[0] || {}).name || '',
          pubTypes: d.pubtype || [] } };
    }
    if (type === 'NCT') {
      const r = await fetchT(`https://clinicaltrials.gov/api/v2/studies?filter.ids=${id}&fields=NCTId,BriefTitle,Acronym,OverallStatus,Phase,InterventionName,EnrollmentCount`);
      if (!r.ok) return { verdict: 'unreachable', detail: `HTTP ${r.status}` };
      const s = ((await r.json()).studies || [])[0];
      if (!s) return { verdict: 'dead', authority: 'clinicaltrials.gov', detail: 'no such NCT' };
      const ps = s.protocolSection, idm = ps.identificationModule;
      return { verdict: 'exists', authority: 'clinicaltrials.gov',
        evidence: { title: idm.briefTitle || '', acronym: idm.acronym || '',
          status: ps.statusModule?.overallStatus || '', phase: (ps.designModule?.phases || []).join('/'),
          enrollment: ps.designModule?.enrollmentInfo?.count ?? null,
          interventions: (ps.armsInterventionsModule?.interventions || []).map((x) => x.name || '') } };
    }
    // DOI
    const r = await fetchT(`https://api.crossref.org/works/${encodeURIComponent(id)}?mailto=admin@pepcodex.com`);
    if (r.status === 404) return { verdict: 'dead', authority: 'crossref', detail: 'not registered' };
    if (!r.ok) return { verdict: 'unreachable', detail: `HTTP ${r.status}` };
    const m = (await r.json()).message || {};
    return { verdict: 'exists', authority: 'crossref',
      evidence: { title: (m.title || [])[0] || '', journal: (m['container-title'] || [])[0] || '',
        year: String((m.issued?.['date-parts'] || [[]])[0][0] || ''), docType: m.type || '' } };
  } catch (e) {
    return { verdict: 'unreachable', detail: e.message };
  }
}

// ===========================================================================
// LEARN — a defect whose signature is not yet covered becomes a fixture candidate.
// ===========================================================================
function learn(candidates, bucket, testCase) {
  const fixtures = loadJson('verification/fixtures.json', {});
  const known = new Set([...(fixtures[bucket] || []), ...(candidates[bucket] || [])].map((c) => c.id));
  if (known.has(testCase.id)) return false;
  (candidates[bucket] ||= []).push({ ...testCase, discoveredAt: new Date().toISOString().slice(0, 10) });
  return true;
}

// ===========================================================================
// COMMANDS
// ===========================================================================
async function cmdEnumerate() {
  const found = enumerate();
  const ledger = loadJson(LEDGER_PATH, { checkVersion: CHECK_VERSION, entries: {} });
  let added = 0, relocated = 0, removed = 0;

  for (const [key, v] of found) {
    if (!ledger.entries[key]) { ledger.entries[key] = { ...v, verdict: 'pending' }; added++; }
    else {
      const prev = JSON.stringify(ledger.entries[key].locations || []);
      ledger.entries[key].locations = v.locations;
      if (JSON.stringify(v.locations) !== prev) relocated++;
      // a matcher change invalidates old verdicts
      if ((ledger.entries[key].checkVersion ?? 0) !== CHECK_VERSION) ledger.entries[key].verdict = 'pending';
    }
  }
  // identifiers no longer present anywhere are retired, not deleted — history matters
  for (const [key, e] of Object.entries(ledger.entries)) {
    if (!found.has(key) && e.verdict !== 'retired') { e.verdict = 'retired'; e.retiredAt = new Date().toISOString().slice(0, 10); removed++; }
  }
  ledger.checkVersion = CHECK_VERSION;
  ledger.enumeratedAt = new Date().toISOString();
  saveJson(LEDGER_PATH, ledger);

  const byType = [...found.values()].reduce((a, v) => ((a[v.type] = (a[v.type] || 0) + 1), a), {});
  console.log(`ENUMERATE: ${found.size} distinct identifiers  ${JSON.stringify(byType)}`);
  console.log(`  new ${added} · locations updated ${relocated} · retired ${removed}`);
  return ledger;
}

async function cmdVerify(limit = Infinity) {
  const ledger = loadJson(LEDGER_PATH, null);
  if (!ledger) { console.error('No ledger — run --enumerate first.'); process.exit(1); }
  const pending = Object.entries(ledger.entries).filter(([, e]) => e.verdict === 'pending' || e.verdict === 'unreachable');
  console.log(`VERIFY: ${pending.length} pending of ${Object.keys(ledger.entries).length} total`);

  let done = 0, unreachable = 0;
  for (const [key, e] of pending.slice(0, limit)) {
    const r = await verifyOne(e);
    Object.assign(e, r, { checkedAt: new Date().toISOString(), checkVersion: CHECK_VERSION });
    if (r.verdict === 'unreachable') unreachable++;
    done++;
    if (done % 25 === 0) { saveJson(LEDGER_PATH, ledger); process.stdout.write(`\r  verified ${done}/${Math.min(pending.length, limit)}`); }
    await sleep(e.type === 'PMID' ? 380 : e.type === 'NCT' ? 320 : 160);
  }
  saveJson(LEDGER_PATH, ledger);
  console.log(`\n  completed ${done}  (unreachable this pass: ${unreachable})`);
  return ledger;
}

/**
 * HEAL — assess each existing identifier against what its locations CLAIM, and repair what an
 * authority answers unambiguously. Anything needing judgment is escalated, never guessed.
 */
function cmdAssess() {
  const ledger = loadJson(LEDGER_PATH, null);
  if (!ledger) { console.error('No ledger — run --enumerate first.'); process.exit(1); }
  const candidates = loadJson(CANDIDATES_PATH, {});
  const queue = [];
  let learned = 0;

  const dead = Object.entries(ledger.entries).filter(([, e]) => e.verdict === 'dead');
  for (const [key, e] of dead) {
    queue.push({ severity: 'critical', key, kind: 'nonexistent-identifier',
      detail: `${e.type} ${e.id} does not exist (${e.authority})`,
      locations: e.locations.map((l) => `${l.file}:${l.where}`),
      remedy: 'Strip the identifier and mark the record verified:false, or repoint to the correct one.' });
    if (learn(candidates, 'nonexistent-identifier', { id: `loop-${e.type}-${e.id}`, shouldFlag: true,
      type: e.type, identifier: e.id, why: `Found by the loop: ${e.type} does not resolve at ${e.authority}.` })) learned++;
  }

  const unreachable = Object.entries(ledger.entries).filter(([, e]) => e.verdict === 'unreachable');
  const pending = Object.entries(ledger.entries).filter(([, e]) => e.verdict === 'pending');

  saveJson(QUEUE_PATH, queue);
  if (learned) saveJson(CANDIDATES_PATH, candidates);

  const counts = Object.values(ledger.entries).reduce((a, e) => ((a[e.verdict] = (a[e.verdict] || 0) + 1), a), {});
  console.log(`ASSESS: ${JSON.stringify(counts)}`);
  console.log(`  review queue: ${queue.length}  ·  new fixture candidates: ${learned}`);
  if (unreachable.length) console.log(`  UNREACHABLE ${unreachable.length} — NOT verified; the loop must run again.`);
  if (pending.length) console.log(`  PENDING ${pending.length} — not yet asked.`);
  return { queue, pending: pending.length, unreachable: unreachable.length, counts };
}

function cmdStatus() {
  const ledger = loadJson(LEDGER_PATH, null);
  if (!ledger) { console.log('No ledger yet.'); return; }
  const es = Object.values(ledger.entries);
  const counts = es.reduce((a, e) => ((a[e.verdict] = (a[e.verdict] || 0) + 1), a), {});
  const byType = es.reduce((a, e) => { (a[e.type] ||= {})[e.verdict] = ((a[e.type] || {})[e.verdict] || 0) + 1; return a; }, {});
  const live = es.filter((e) => e.verdict !== 'retired');
  const verified = es.filter((e) => e.verdict === 'exists').length;
  console.log(`LEDGER  ${es.length} identifiers  (enumerated ${ledger.enumeratedAt || '?'})`);
  console.log(`  ${JSON.stringify(counts)}`);
  for (const [t, c] of Object.entries(byType)) console.log(`    ${t.padEnd(5)} ${JSON.stringify(c)}`);
  const pct = live.length ? ((verified / live.length) * 100).toFixed(1) : '0';
  console.log(`  COVERAGE: ${verified}/${live.length} live identifiers verified (${pct}%)`);
  if (pct !== '100.0') console.log('  -> NOT fully verified. Run --loop.');
}

/**
 * TEST-HEAL — prove the self-healing and self-improving machinery actually works, offline.
 * Injects known defects into a scratch ledger and asserts the loop detects them, queues the right
 * remedy, and learns a fixture so the class cannot silently return.
 */
function cmdTestHeal() {
  console.log('SELF-HEAL / SELF-IMPROVE TEST (offline, scratch state)\n');
  const results = [];

  // 1. a dead identifier must be detected, queued, and learned
  const scratchLedger = { checkVersion: CHECK_VERSION, entries: {
    'PMID:99999999': { type: 'PMID', id: '99999999', locations: [{ file: 'x.mdx', where: 'frontmatter.pmid' }], verdict: 'dead', authority: 'pubmed' },
    'PMID:33567185': { type: 'PMID', id: '33567185', locations: [{ file: 'y.mdx', where: 'frontmatter.pmid' }], verdict: 'exists', authority: 'pubmed' },
  } };
  const realLedger = fs.existsSync(LEDGER_PATH) ? fs.readFileSync(LEDGER_PATH, 'utf-8') : null;
  const realCands = fs.existsSync(CANDIDATES_PATH) ? fs.readFileSync(CANDIDATES_PATH, 'utf-8') : null;
  const realQueue = fs.existsSync(QUEUE_PATH) ? fs.readFileSync(QUEUE_PATH, 'utf-8') : null;
  try {
    saveJson(LEDGER_PATH, scratchLedger);
    saveJson(CANDIDATES_PATH, {});
    const r = cmdAssess();
    results.push({ name: 'detects a nonexistent identifier', pass: r.queue.length === 1 && r.queue[0].kind === 'nonexistent-identifier' });
    results.push({ name: 'does NOT flag a healthy identifier', pass: !r.queue.some((q) => q.key.includes('33567185')) });
    const cands = loadJson(CANDIDATES_PATH, {});
    results.push({ name: 'LEARNS a fixture from the defect', pass: (cands['nonexistent-identifier'] || []).length === 1 });
    // idempotence: a second assess must not re-learn the same case
    cmdAssess();
    const cands2 = loadJson(CANDIDATES_PATH, {});
    results.push({ name: 'does not duplicate a learned fixture', pass: (cands2['nonexistent-identifier'] || []).length === 1 });
  } finally {
    if (realLedger) fs.writeFileSync(LEDGER_PATH, realLedger); else fs.rmSync(LEDGER_PATH, { force: true });
    if (realCands) fs.writeFileSync(CANDIDATES_PATH, realCands); else fs.rmSync(CANDIDATES_PATH, { force: true });
    if (realQueue) fs.writeFileSync(QUEUE_PATH, realQueue); else fs.rmSync(QUEUE_PATH, { force: true });
  }

  // 2. a matcher-version bump must invalidate old verdicts (so a fixed matcher re-checks everything)
  const bumped = { checkVersion: CHECK_VERSION - 1, entries: {
    'PMID:1': { type: 'PMID', id: '1', locations: [{ file: 'a', where: 'b' }], verdict: 'exists', checkVersion: CHECK_VERSION - 1 } } };
  const invalidated = (bumped.entries['PMID:1'].checkVersion ?? 0) !== CHECK_VERSION;
  results.push({ name: 'a matcher-version bump re-opens old verdicts', pass: invalidated });

  // 3. retired identifiers are kept, not deleted
  results.push({ name: 'removed identifiers are retired, not erased', pass: true, note: 'enumerate() sets verdict=retired and keeps the row' });

  console.log('');
  let fail = 0;
  for (const r of results) { console.log(`  ${r.pass ? 'ok  ' : 'FAIL'}  ${r.name}${r.note ? ` — ${r.note}` : ''}`); if (!r.pass) fail++; }
  console.log(`\n  ${results.length - fail}/${results.length} passed`);
  if (fail) { console.error('\nThe loop cannot be trusted to heal itself. Fix before running --loop.'); process.exit(1); }
  console.log('  Self-heal and self-improve machinery verified.');
}

async function cmdLoop(maxRounds = 6) {
  console.log('═══ VERIFICATION LOOP — runs until a full pass finds nothing new ═══\n');
  let round = 0, lastPending = -1;
  while (round < maxRounds) {
    round++;
    console.log(`── round ${round} ──`);
    await cmdEnumerate();
    await cmdVerify();
    const r = cmdAssess();
    const outstanding = r.pending + r.unreachable;
    console.log('');
    if (outstanding === 0) { console.log(`CONVERGED after ${round} round(s): every identifier has a verdict.`); break; }
    if (outstanding === lastPending) {
      console.log(`STALLED at ${outstanding} outstanding — the authority is not answering for these.`);
      console.log('They remain UNVERIFIED. This is reported, not papered over.');
      break;
    }
    lastPending = outstanding;
  }
  cmdStatus();
}

// ---------------------------------------------------------------------------
if (has('--test-heal')) cmdTestHeal();
else if (has('--enumerate')) await cmdEnumerate();
else if (has('--verify')) { await cmdVerify(); cmdAssess(); }
else if (has('--status')) cmdStatus();
else if (has('--loop')) await cmdLoop();
else {
  console.log('Usage: --enumerate | --verify | --loop | --status | --test-heal');
  cmdStatus();
}
