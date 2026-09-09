/** Research surveillance CLI. Contract: docs/research-surveillance.md.
 * No content writes. Failed/partial scans exit nonzero and cannot advance subject watermarks.
 */
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import matter from 'gray-matter';
import { scanSubject, renderSummary, shiftDate, validateImpactPacket } from '../verification/research-surveillance.mjs';

const args = process.argv.slice(2);
const value = name => {
  const index = args.indexOf(name);
  if (index < 0) return null;
  if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error(`Missing ${name} value`);
  return args[index + 1];
};
const integer = (name, fallback) => {
  const v = value(name);
  if (v === null) return fallback;
  if (!/^\d+$/.test(v) || Number(v) < 1 || Number(v) > 36500) throw new Error(`${name} requires a positive integer <= 36500`);
  return Number(v);
};
const today = new Date().toISOString().slice(0,10);
const end = value('--end') || shiftDate(today, -1), days = integer('--days', null), only = value('--slug');
const knownLimit = integer('--known-limit', 100), recheckDays = integer('--recheck-days', 30);
if (!/^\d{4}-\d{2}-\d{2}$/.test(end) || !Number.isFinite(Date.parse(end)) || new Date(end).toISOString().slice(0,10) !== end || end >= today) throw new Error('--end must be a real completed UTC day before today');
const allowed = new Set(['--end', '--days', '--slug', '--known-limit', '--recheck-days', '--out', '--manifest-file', '--request-id']);
for (let i = 0; i < args.length; i += 2) if (!allowed.has(args[i])) throw new Error(`Unknown argument ${args[i]}`);
const root = path.resolve(value('--out') || '.planning/research-scan');
const manifestFile = value('--manifest-file') ? path.resolve(value('--manifest-file')) : null;
const requestId = value('--request-id');
if (Boolean(manifestFile) !== Boolean(requestId) || (requestId && !/^[a-zA-Z0-9_-]{16,100}$/.test(requestId))) throw new Error('--manifest-file and a unique --request-id (16-100 safe characters) must be supplied together');
if (manifestFile && fs.existsSync(manifestFile)) throw new Error('Invocation manifest already exists; use a fresh request ID and manifest path');
const sha256 = body => createHash('sha256').update(body).digest('hex');
fs.mkdirSync(root, { recursive: true });
const lockPath = path.join(root, '.scanner.lock');
let lock;
try { lock = fs.openSync(lockPath, 'wx'); }
catch { throw new Error(`Scanner lock exists at ${lockPath}. Verify its recorded process before removing a stale lock; do not run simultaneous scans.`); }
fs.writeFileSync(lock, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));

function atomicJSON(file, content) {
  const tmp = `${file}.${randomUUID()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(content, null, 2));
  fs.renameSync(tmp, file);
}
function readJSON(file, fallback) { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback; }
function publishPacket(file, packet) {
  const validateExisting = () => {
    let existing;
    try { existing = JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch { throw new Error(`Corrupt existing impact packet: ${file}. Preserve it for investigation; no scanner state advanced.`); }
    validateImpactPacket(existing, packet);
  };
  if (fs.existsSync(file)) { validateExisting(); return; }
  const tmp = `${file}.${randomUUID()}.tmp`;
  let descriptor;
  try {
    descriptor = fs.openSync(tmp, 'wx');
    fs.writeFileSync(descriptor, JSON.stringify(packet, null, 2));
    fs.fsyncSync(descriptor);
    fs.closeSync(descriptor); descriptor = undefined;
    // A same-directory hard link publishes a completely written inode atomically and cannot
    // replace an existing packet. Interrupted writes can leave only an unreferenced temp file.
    try { fs.linkSync(tmp, file); }
    catch (e) { if (e.code !== 'EEXIST') throw e; validateExisting(); }
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor);
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  }
}
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(x => x.isDirectory() ? walk(path.join(dir,x.name)) : [path.join(dir,x.name)]); }
function identifiers(text) {
  const pmids = new Set(), ncts = new Set();
  for (const m of text.matchAll(/(?:PMID\s*[:=]?\s*|pubmed\.ncbi\.nlm\.nih\.gov\/|["']?pmid["']?\s*:\s*["']?)(\d{1,9})/gi)) pmids.add(m[1]);
  for (const m of text.matchAll(/NCT\d{8}/gi)) ncts.add(m[0].toUpperCase());
  for (const m of text.matchAll(/["'](?:pubmedId|pmid|id)["']\s*:\s*["'](\d{6,9})["']/gi)) pmids.add(m[1]);
  return { pmids: [...pmids], ncts: [...ncts] };
}

try {
  const runId = `${new Date().toISOString().replace(/[:.]/g,'-')}-${randomUUID().slice(0,8)}`;
  const dateDir = path.join(root, today), runDir = path.join(dateDir, runId), rawDir = path.join(runDir, 'raw');
  fs.mkdirSync(rawDir, { recursive: true });
  const stateFile = path.join(root, 'state-v2.json');
  const previous = readJSON(stateFile, { schemaVersion: 2, subjects: {} });
  if (previous.schemaVersion !== 2 || !previous.subjects) throw new Error('Unsupported scanner state; preserve it and migrate explicitly');
  const nextState = structuredClone(previous);
  const trialAliases = readJSON('data/trial-match-aliases.json', {});
  const evidence = readJSON('data/research-alias-evidence.json', {});
  const referenceFiles = {};
  for (const file of [...walk('src/content'), ...walk('data/source-packs')].filter(f => /\.(mdx?|json)$/.test(f))) {
    const ids = identifiers(fs.readFileSync(file, 'utf8'));
    for (const id of [...ids.pmids, ...ids.ncts]) (referenceFiles[id] ||= []).push(file.replaceAll('\\', '/'));
  }
  const dossiers = fs.readdirSync('src/content/peptides').filter(f => f.endsWith('.mdx')).map(f => {
    const slug = f.replace(/\.mdx$/, ''), text = fs.readFileSync(path.join('src/content/peptides', f), 'utf8'), data = matter(text).data;
    const packFile = path.join('data/source-packs', `${slug}.json`);
    const known = identifiers(text + '\n' + (fs.existsSync(packFile) ? fs.readFileSync(packFile, 'utf8') : ''));
    return { slug, name: data.name || slug, aliases: [...new Set([...(data.aliases || []), ...(trialAliases[slug] || [])])], knownPmids: known.pmids, knownNcts: known.ncts,
      knownAcrossSitePmids: Object.keys(referenceFiles).filter(id => /^\d+$/.test(id)),
      knownAcrossSiteNcts: Object.keys(referenceFiles).filter(id => /^NCT/.test(id)), referenceFiles };
  }).filter(s => !only || s.slug === only);
  if (!dossiers.length) throw new Error(`No dossier matched --slug ${only}`);
  let sequence = 0, lastRequest = 0;
  const provenance = new WeakMap();
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const request = async (url, format) => {
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      const wait = Math.max(0, 400 - (Date.now() - lastRequest));
      if (wait) await sleep(wait);
      const number = String(++sequence).padStart(6, '0'), startedAt = new Date().toISOString();
      const rawFile = path.join(rawDir, `${number}.${format === 'json' ? 'json' : 'xml'}`);
      lastRequest = Date.now();
      try {
        const response = await fetch(url, { headers: { 'User-Agent': 'PepCodex-surveillance/2.0 (mailto:admin@pepcodex.com)' }, signal: AbortSignal.timeout(30000) });
        const body = await response.text();
        fs.writeFileSync(rawFile, body);
        const completedAt = new Date().toISOString(), responseSha256 = sha256(body);
        fs.writeFileSync(path.join(rawDir, `${number}.request.json`), JSON.stringify({ url, attempt, startedAt, status: response.status, completedAt, responseSha256 }, null, 2));
        if (!response.ok) {
          lastError = new Error(`HTTP ${response.status} from ${new URL(url).hostname}; raw ${number}`);
          if (![429,500,502,503,504].includes(response.status)) throw lastError;
        } else {
          if (format !== 'json') return body;
          const parsed = JSON.parse(body);
          const remember = (record, recordLocator) => {
            if (record && typeof record === 'object') provenance.set(record, { sourceUrl: url, retrievedAt: completedAt,
              responseSha256, rawFile: path.relative(runDir, rawFile).replaceAll('\\', '/'), recordLocator,
              nctId: record.protocolSection?.identificationModule?.nctId ?? null });
          };
          remember(parsed, '$');
          if (Array.isArray(parsed?.studies)) parsed.studies.forEach((record, index) => remember(record, `$.studies[${index}]`));
          return parsed;
        }
      } catch (error) {
        lastError = error;
        if (!fs.existsSync(path.join(rawDir, `${number}.request.json`))) fs.writeFileSync(path.join(rawDir, `${number}.request.json`), JSON.stringify({ url, attempt, startedAt, error: error.message }, null, 2));
        if (/HTTP (?!429|500|502|503|504)\d+/.test(error.message)) throw error;
      }
      if (attempt < 3) await sleep(attempt * 1000);
    }
    throw lastError;
  };
  request.provenanceFor = record => provenance.get(record) ?? null;
  const outputs = [];
  fs.writeFileSync(path.join(runDir, 'inventory.json'), JSON.stringify({ totalDossiers: fs.readdirSync('src/content/peptides').filter(f => f.endsWith('.mdx')).length,
    attemptedSubjects: dossiers.map(s => s.slug), citedReferenceIdsAcrossSite: Object.keys(referenceFiles).length,
    knownIdScope: 'Per-subject dossier and matching source pack. Other surfaces are dependency locators, not a claim that all their citations were rechecked.' }, null, 2));
  for (const subject of dossiers) {
    const { output, nextState: subjectState } = await scanSubject(subject, previous.subjects[subject.slug] || {}, { request, end, days, knownLimit, recheckDays, aliasEvidence: evidence[subject.slug] || [] });
    output.runId = runId; output.scannedAt = new Date().toISOString();
    outputs.push(output);
    nextState.subjects[subject.slug] = subjectState;
    console.log(`${subject.slug}: ${output.status}; ${output.impactPackets.length} review packets; ${output.errors.length} errors`);
  }
  const queueDir = path.join(root, 'impact-queue'); fs.mkdirSync(queueDir, { recursive: true });
  let persistenceError = null;
  try {
    for (const output of outputs) for (const packet of output.impactPackets) {
      publishPacket(path.join(queueDir, `${packet.packetId}.json`), { ...packet, runId, coverageStatus: output.status });
    }
  } catch (e) {
    persistenceError = e.message;
    for (const output of outputs) {
      output.errors.push({ source: 'impact-queue', error: persistenceError });
      output.status = output.status === 'FAILED' ? 'FAILED' : 'PARTIAL';
      output.partialQuery = true; output.watermarksAdvanced = false;
    }
  }
  for (const output of outputs) {
    fs.writeFileSync(path.join(runDir, `${output.slug}.json`), JSON.stringify(output, null, 2));
    atomicJSON(path.join(dateDir, `${output.slug}.json`), output);
  }
  const summary = renderSummary(outputs, runId, end);
  fs.writeFileSync(path.join(runDir, 'SUMMARY.md'), summary);
  fs.writeFileSync(path.join(dateDir, 'SUMMARY.md'), summary);
  const complete = !persistenceError && outputs.every(o => o.status.startsWith('SUCCESS_'));
  const manifest = { schemaVersion: 2, handoffVersion: 1, requestId, runId, runDir, end, days,
    inventorySha256: sha256(fs.readFileSync(path.join(runDir, 'inventory.json'))),
    requestedScope: { slug: only, knownLimit, recheckDays }, completedAt: new Date().toISOString(), complete, persistenceError,
    exitCode: complete ? 0 : 1, subjects: outputs.map(o => ({ slug: o.slug, status: o.status, watermarksAdvanced: o.watermarksAdvanced,
      outputFile: `${o.slug}.json`, outputSha256: sha256(fs.readFileSync(path.join(runDir, `${o.slug}.json`))) })), rawRequests: sequence };
  fs.writeFileSync(path.join(runDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  if (manifestFile) {
    fs.mkdirSync(path.dirname(manifestFile), { recursive: true });
    const temp = `${manifestFile}.${randomUUID()}.tmp`;
    try {
      fs.writeFileSync(temp, JSON.stringify(manifest, null, 2), { flag: 'wx' });
      fs.linkSync(temp, manifestFile); // Exclusive atomic handoff; never consume/replace a previous invocation.
    } finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
  }
  // Publish the invocation before state advancement: an unavailable handoff destination must
  // not consume the observation. Consumers still require the completed subprocess exit code,
  // since a later state/pointer error or interruption can leave a published handoff uncommitted.
  if (!persistenceError) atomicJSON(stateFile, nextState);
  atomicJSON(path.join(root, 'latest-attempt.json'), manifest);
  if (complete) atomicJSON(path.join(root, 'latest-successful.json'), manifest);
  console.log(`Run ${complete ? 'complete for declared scope' : 'INCOMPLETE'}: ${runDir}`);
  process.exitCode = complete ? 0 : 1;
} finally {
  fs.closeSync(lock);
  fs.unlinkSync(lockPath);
}
