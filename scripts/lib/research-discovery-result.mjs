import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { validateImpactPacket } from '../../verification/research-surveillance.mjs';

const digest = value => createHash('sha256').update(value).digest('hex');
const requireThat = (condition, message) => { if (!condition) throw new Error(message); };
const success = status => ['SUCCESS_ZERO', 'SUCCESS_CHANGES'].includes(status);
const inside = (root, file) => {
  const relative = path.relative(root, file);
  return relative !== '' && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
};
export function discoveryDays(value) {
  requireThat(/^\d+$/.test(String(value)) && Number(value) > 0 && Number(value) <= 36500, 'Discovery days must be a positive integer <= 36500');
  return Number(value);
}

/** Consume only the exact invocation handoff. A previous successful pointer is never a fallback.
 * Counts describe unreviewed candidates; dispatch is a review request, not evidence endorsement.
 */
export function consumeDiscovery({ manifestFile, requestId, scanRoot, days, end, slug = null, knownLimit = 100, recheckDays = 30, exitCode }) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    requireThat(manifest.schemaVersion === 2 && manifest.handoffVersion === 1, 'Unsupported discovery manifest contract');
    requireThat(manifest.requestId === requestId && typeof requestId === 'string' && requestId.length >= 16, 'Stale or mismatched discovery request ID');
    requireThat(manifest.days === days && manifest.end === end && manifest.requestedScope?.slug === slug
      && manifest.requestedScope?.knownLimit === knownLimit && manifest.requestedScope?.recheckDays === recheckDays, 'Discovery scope/window mismatch');
    requireThat(/^[a-zA-Z0-9_-]+$/.test(manifest.runId || ''), 'Invalid discovery run ID');
    const root = fs.realpathSync(scanRoot), runDir = fs.realpathSync(manifest.runDir);
    requireThat(inside(root, runDir) && path.basename(runDir) === manifest.runId, 'Discovery run path outside expected scan root or mismatched ID');
    requireThat(Array.isArray(manifest.subjects) && manifest.subjects.length > 0, 'Missing attempted discovery subjects');
    const inventoryPath = fs.realpathSync(path.join(runDir, 'inventory.json'));
    requireThat(inside(runDir, inventoryPath), 'Discovery inventory escapes run directory');
    const inventoryBytes = fs.readFileSync(inventoryPath);
    requireThat(digest(inventoryBytes) === manifest.inventorySha256, 'Discovery inventory hash mismatch');
    const inventory = JSON.parse(inventoryBytes);
    requireThat(Array.isArray(inventory.attemptedSubjects) && JSON.stringify([...inventory.attemptedSubjects].sort()) ===
      JSON.stringify(manifest.subjects.map(s => s.slug).sort()), 'Discovery manifest does not cover attempted inventory');
    if (slug) requireThat(manifest.subjects.length === 1 && manifest.subjects[0].slug === slug, 'Requested discovery subject missing');
    const rows = [], seenSubjects = new Set(), packets = new Map();
    const counts = { newPapers: 0, correctedPapers: 0, newTrials: 0, updatedTrials: 0, reviewPackets: 0 };
    for (const entry of manifest.subjects) {
      requireThat(/^[a-zA-Z0-9_-]+$/.test(entry.slug || '') && !seenSubjects.has(entry.slug), 'Invalid/duplicate discovery subject');
      seenSubjects.add(entry.slug);
      requireThat(entry.outputFile === `${entry.slug}.json`, 'Invalid discovery subject output path');
      const outputPath = fs.realpathSync(path.join(runDir, entry.outputFile));
      requireThat(inside(runDir, outputPath), 'Discovery subject output escapes run directory');
      const bytes = fs.readFileSync(outputPath);
      requireThat(digest(bytes) === entry.outputSha256, 'Discovery subject output hash mismatch');
      const output = JSON.parse(bytes);
      requireThat(output.schemaVersion === 2 && output.slug === entry.slug && output.runId === manifest.runId && output.scanEnd === end,
        'Discovery subject identity/version/window mismatch');
      requireThat(['SUCCESS_ZERO', 'SUCCESS_CHANGES', 'PARTIAL', 'FAILED'].includes(output.status) && output.status === entry.status,
        'Invalid or contradictory discovery subject status');
      for (const key of ['newPapers', 'correctedPapers', 'newTrials', 'updatedTrials', 'impactPackets', 'errors', 'queryCoverage', 'quarantinedAliases']) {
        requireThat(Array.isArray(output[key]), `Missing discovery array ${key}`);
      }
      requireThat(output.knownCoverage && output.queryCoverage.length > 0, 'Missing discovery coverage');
      requireThat(output.watermarksAdvanced === entry.watermarksAdvanced && output.partialQuery === !success(output.status), 'Contradictory discovery watermark/partial flags');
      if (success(output.status)) {
        requireThat(output.errors.length === 0 && output.watermarksAdvanced === true && output.queryCoverage.every(q => q.complete === true), 'Success contains incomplete discovery coverage/errors');
        requireThat((output.status === 'SUCCESS_CHANGES') === (output.impactPackets.length > 0), 'Discovery zero/change status contradicts packets');
      } else requireThat(output.errors.length > 0 && output.watermarksAdvanced === false, 'Failure missing errors or advances failed subject watermark');
      const candidateIds = new Set();
      for (const key of Object.keys(counts).filter(k => k !== 'reviewPackets')) {
        counts[key] += output[key].length;
        for (const candidate of output[key]) candidateIds.add(candidate.pmid || candidate.nctId);
      }
      for (const packet of output.impactPackets) {
        requireThat(/^[a-f0-9]{64}$/.test(packet.packetId || '') && packet.subject === output.slug && candidateIds.has(packet.id), 'Invalid review packet identity or missing candidate');
        validateImpactPacket(packet, packet);
        const previous = packets.get(packet.packetId);
        requireThat(!previous || JSON.stringify(previous) === JSON.stringify(packet), 'Conflicting duplicate review packet');
        packets.set(packet.packetId, packet);
      }
      requireThat([...candidateIds].every(id => output.impactPackets.some(p => p.id === id)), 'Discovery candidate lacks review packet');
      rows.push({ slug: output.slug, status: output.status, queryCoverage: output.queryCoverage, knownCoverage: output.knownCoverage,
        quarantinedAliases: output.quarantinedAliases, integrityFlaggedTrials: output.counts?.integrityFlaggedTrials ?? 0, errors: output.errors });
    }
    const complete = !manifest.persistenceError && rows.every(r => success(r.status));
    requireThat(manifest.complete === complete && manifest.exitCode === (complete ? 0 : 1), 'Contradictory discovery manifest completion');
    const groups = new Map();
    for (const packet of packets.values()) {
      const agent = /INTEGRITY/.test(packet.kind) || packet.record?.evidenceEligibility === 'HOLD_FOR_INTEGRITY_REVIEW' ? 'Integrity'
        : /^NCT\d{8}$/.test(packet.id) ? 'Trials' : 'Evidence';
      if (!groups.has(agent)) groups.set(agent, { agent, input: path.resolve(manifestFile), runId: manifest.runId, reviewOnly: true, packetIds: [] });
      groups.get(agent).packetIds.push(packet.packetId);
    }
    counts.reviewPackets = packets.size;
    const ok = complete && exitCode === 0;
    return { ok, exitCode: ok ? 0 : 1, status: ok ? (packets.size ? 'SUCCESS_CHANGES' : 'SUCCESS_ZERO') : 'INCOMPLETE',
      requestId, runId: manifest.runId, manifestFile: path.resolve(manifestFile), counts, coverage: rows,
      dispatch: ok ? [...groups.values()] : [], triage: ok ? [] : [...groups.values()].map(group => ({ ...group, incompleteCoverage: true })),
      errors: ok ? [] : [manifest.persistenceError || `Discovery incomplete or subprocess failed (exit ${exitCode})`],
      evidenceUse: 'REVIEW_ONLY_NO_AUTOMATIC_ENDORSEMENT' };
  } catch (error) {
    return { ok: false, exitCode: 1, status: 'FAILED_HANDOFF', requestId, manifestFile: path.resolve(manifestFile),
      counts: null, coverage: [], dispatch: [], triage: [], errors: [error.message], evidenceUse: 'REVIEW_ONLY_NO_AUTOMATIC_ENDORSEMENT' };
  }
}

/** The only subprocess boundary for Layer 3 research discovery. Other loop layers are unchanged. */
export function runResearchDiscovery({ days = 60, cwd = process.cwd(), execute = execFileSync } = {}) {
  days = discoveryDays(days);
  const requestId = randomUUID(), end = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const manifestFile = path.join(cwd, '.planning/loop/discovery', `${requestId}.json`);
  const scanRoot = path.join(cwd, '.planning/research-scan');
  const args = ['scripts/monthly-research-scan.mjs', '--days', String(days), '--end', end, '--manifest-file', manifestFile, '--request-id', requestId];
  let exitCode = 0, stdout = '', stderr = '';
  try { stdout = execute(process.execPath, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }); }
  catch (error) { exitCode = Number.isInteger(error.status) ? error.status : null; stdout = String(error.stdout || ''); stderr = String(error.stderr || error.message); }
  return { ...consumeDiscovery({ manifestFile, requestId, scanRoot, days, end, exitCode }), processExitCode: exitCode,
    diagnostics: { stdout: String(stdout), stderr } };
}
