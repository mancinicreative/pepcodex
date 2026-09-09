import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { trialIntegrity } from '../../verification/trial-integrity.mjs';
import { scanSubject, validateImpactPacket, trialResults } from '../../verification/research-surveillance.mjs';
import { consumeDiscovery, discoveryDays, runResearchDiscovery } from '../lib/research-discovery-result.mjs';

const digest = value => createHash('sha256').update(value).digest('hex');
const subject = { slug: 'tb-500', name: 'TB-500', knownPmids: [], knownNcts: [], aliases: [] };
const end = '2026-09-04';
// Minimal fixture preserves actual self-description; no personal contacts or claim this is live data.
// Saved source SHA256: BF7023340EC1F9FC2E996FDA7BF533E2EA079AE20E5269EF00F1A6685339C0EF.
const marked = { protocolSection: {
  identificationModule: { nctId: 'NCT07487363', briefTitle: 'TB-500 cardiovascular biomarkers' },
  descriptionModule: { briefSummary: 'This fictional study is an example of a ClinicalTrials.gov-style record.',
    detailedDescription: 'This example record models common ClinicalTrials.gov data elements for an interventional study.' },
  statusModule: { overallStatus: 'RECRUITING' }, designModule: { phases: ['PHASE1', 'PHASE2'], enrollmentInfo: { count: 80, type: 'ESTIMATED' } },
}, hasResults: false };
const neutral = () => { const record = structuredClone(marked); record.protocolSection.descriptionModule = { briefSummary: 'A trial evaluating cardiovascular biomarkers.' }; return record; };
const transport = (records = [], failPubmed = false) => async url => {
  if (url.includes('esearch.fcgi')) {
    if (failPubmed) throw new Error('fixture PubMed unavailable');
    return { esearchresult: { count: '0', idlist: [], querytranslation: 'fixture' } };
  }
  if (url.includes('/studies/NCT')) return records[0];
  if (url.includes('clinicaltrials.gov')) return { studies: records, totalCount: records.length };
  throw new Error(`Unexpected fixture transport ${url}`);
};
const scan = (record, state = {}, known = false, fail = false) => scanSubject({ ...subject, knownNcts: known ? ['NCT07487363'] : [] }, state,
  { end, request: transport(record ? [record] : [], fail) });
const fixtureRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '.fixtures');
function scratch(t) {
  fs.mkdirSync(fixtureRoot, { recursive: true });
  const cwd = fs.mkdtempSync(path.join(fixtureRoot, 'handoff-'));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  return cwd;
}
function write(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2)); }

test('explicit narrative and raw provenance survive review packets without endorsing the record', async () => {
  const request = transport([marked]);
  const provenance = { sourceUrl: 'https://clinicaltrials.gov/api/v2/studies?query.intr=TB-500', retrievedAt: '2026-09-05T00:00:00Z',
    responseSha256: digest(JSON.stringify(marked)), rawFile: 'raw/000003.json', recordLocator: '$.studies[0]', nctId: 'NCT07487363' };
  request.provenanceFor = () => provenance;
  const result = await scanSubject(subject, {}, { end, request });
  const packet = JSON.parse(JSON.stringify(result.output.impactPackets[0]));
  assert.equal(result.output.status, 'SUCCESS_CHANGES');
  assert.equal(packet.kind, 'TRIAL_RECORD_INTEGRITY_ALERT');
  assert.equal(packet.reviewRequired, true);
  assert.equal(packet.record.evidenceEligibility, 'HOLD_FOR_INTEGRITY_REVIEW');
  assert.equal(packet.record.recordIntegrity.status, 'QUARANTINED_SELF_DESCRIBED_EXAMPLE');
  assert.equal(packet.record.recordIntegrity.signals[0].quote, marked.protocolSection.descriptionModule.briefSummary);
  assert.equal(packet.record.recordIntegrity.signals[0].field, 'protocolSection.descriptionModule.briefSummary');
  assert.deepEqual(packet.record.rawProvenance, provenance);
  assert.equal(result.output.counts.integrityFlaggedTrials, 1);
  assert.equal(result.output.newTrials[0].identityStatus, 'QUERY_CANDIDATE_REQUIRES_IDENTITY_REVIEW');
  const broken = structuredClone(packet); delete broken.record.recordIntegrity;
  assert.throws(() => validateImpactPacket(broken, packet));
});

test('description-only addition alerts; cited record routes to integrity review and removal remains on hold', async () => {
  const first = await scan(neutral(), {}, true);
  const changed = await scan(marked, first.nextState, true);
  assert.equal(changed.output.status, 'SUCCESS_CHANGES');
  assert.equal(changed.output.impactPackets[0].kind, 'CITED_RECORD_INTEGRITY_ALERT');
  assert.equal(changed.output.newTrials.length, 0);
  const repeated = await scan(marked, changed.nextState, true);
  assert.equal(repeated.output.status, 'SUCCESS_ZERO');
  const removed = await scan(neutral(), repeated.nextState, true);
  assert.equal(removed.output.impactPackets[0].kind, 'TRIAL_INTEGRITY_REVALIDATION');
  assert.equal(removed.output.impactPackets[0].record.evidenceEligibility, 'HOLD_FOR_INTEGRITY_REVIEW');
  const later = neutral(); later.protocolSection.statusModule.overallStatus = 'COMPLETED';
  const stillHeld = await scan(later, removed.nextState, true);
  assert.equal(stillHeld.output.impactPackets[0].kind, 'TRIAL_INTEGRITY_REVALIDATION');
  assert.equal(stillHeld.output.impactPackets[0].record.evidenceEligibility, 'HOLD_FOR_INTEGRITY_REVIEW');
});

test('partial retries preserve integrity packet IDs; later successful recurrence gets a new transition ID', async () => {
  const first = await scan(neutral());
  const partial = await scan(marked, first.nextState, false, true);
  const retry = await scan(marked, partial.nextState, false, true);
  const recovered = await scan(marked, retry.nextState);
  assert.equal(partial.output.status, 'PARTIAL');
  assert.deepEqual(partial.nextState, first.nextState);
  assert.equal(partial.output.impactPackets[0].packetId, retry.output.impactPackets[0].packetId);
  assert.equal(partial.output.impactPackets[0].packetId, recovered.output.impactPackets[0].packetId);
  const clear = await scan(neutral(), recovered.nextState);
  const recurrence = await scan(marked, clear.nextState);
  assert.notEqual(recovered.output.impactPackets[0].packetId, recurrence.output.impactPackets[0].packetId);
});

test('ordinary research vocabulary is not a fictional-record blacklist; quotations get contextual review', () => {
  for (const text of ['A randomized study of fictional stories and patient anxiety.', 'Simulation training for emergency clinicians.',
    'This study compares mock procedures with sham procedures.', 'This study investigates synthetic peptides.',
    'For example, eligible participants report fatigue.', 'This fictional narrative is used as a comprehension stimulus.']) {
    const record = neutral(); record.protocolSection.descriptionModule.briefSummary = text;
    assert.equal(trialIntegrity(record).status, 'NO_EXPLICIT_SELF_DESCRIPTION', text);
  }
  for (const text of ['Participants read: "This fictional study is an example."', '"This fictional study is an example." is the teaching vignette.',
    'Training material includes this example record models common registry fields.']) {
    const record = neutral(); record.protocolSection.descriptionModule.briefSummary = text;
    assert.equal(trialIntegrity(record).status, 'CONTEXT_REVIEW_REQUIRED', text);
  }
});

test('explicit hasResults remains distinct from results payload and unknown; signal-only changes alert', async () => {
  const absent = neutral(); delete absent.hasResults;
  assert.deepEqual(trialResults(absent), { hasResultsSignal: null, resultsPayloadAvailable: false, resultsPosted: null, resultsAvailabilityStatus: 'UNKNOWN' });
  const noResults = neutral();
  assert.equal(trialResults(noResults).resultsPosted, false);
  assert.equal(trialResults(noResults).hasResultsSignal, false);
  const posted = neutral(); posted.hasResults = true;
  assert.deepEqual(trialResults(posted), { hasResultsSignal: true, resultsPayloadAvailable: false, resultsPosted: true,
    resultsAvailabilityStatus: 'POSTED_SIGNAL_WITHOUT_PAYLOAD' });
  const first = await scan(noResults, {}, true), changed = await scan(posted, first.nextState, true);
  assert.equal(changed.output.status, 'SUCCESS_CHANGES');
  assert.equal(changed.output.impactPackets[0].record.material.hasResultsSignal, true);
  assert.equal(changed.output.updatedTrials[0].resultsPayloadAvailable, false);
  const withPayload = structuredClone(absent); withPayload.resultsSection = { participantFlowModule: {} };
  assert.equal(trialResults(withPayload).resultsPosted, true);
  assert.equal(trialResults(withPayload).hasResultsSignal, null);
  withPayload.hasResults = false;
  assert.equal(trialResults(withPayload).resultsAvailabilityStatus, 'SIGNAL_PAYLOAD_CONFLICT');
  assert.equal(trialResults(withPayload).resultsPosted, false);
});

function handoff(cwd, outputs, { complete = outputs.every(o => o.status.startsWith('SUCCESS_')), persistenceError = null } = {}) {
  const scanRoot = path.join(cwd, 'scan'), requestId = randomUUID(), runId = randomUUID(), runDir = path.join(scanRoot, '2026-09-05', runId);
  fs.mkdirSync(runDir, { recursive: true });
  write(path.join(runDir, 'inventory.json'), { attemptedSubjects: outputs.map(o => o.slug) });
  const subjects = outputs.map(output => {
    output = { ...structuredClone(output), runId };
    const outputFile = `${output.slug}.json`; write(path.join(runDir, outputFile), output);
    return { slug: output.slug, status: output.status, watermarksAdvanced: output.watermarksAdvanced, outputFile,
      outputSha256: digest(fs.readFileSync(path.join(runDir, outputFile))) };
  });
  const manifest = { schemaVersion: 2, handoffVersion: 1, requestId, runId, runDir, days: 60, end, requestedScope: { slug: null, knownLimit: 100, recheckDays: 30 },
    subjects, complete, persistenceError, exitCode: complete ? 0 : 1, inventorySha256: digest(fs.readFileSync(path.join(runDir, 'inventory.json'))) };
  const manifestFile = path.join(cwd, `${requestId}.json`); write(manifestFile, manifest);
  return { options: { manifestFile, requestId, scanRoot, days: 60, end, exitCode: manifest.exitCode }, manifest, outputs };
}

test('structured success dispatches unique trial/integrity packets; zero has coverage and no dispatch', async t => {
  const cwd = scratch(t), ordinary = (await scan(neutral())).output, integrity = (await scan(marked)).output;
  const normal = handoff(cwd, [ordinary]);
  let result = consumeDiscovery(normal.options);
  assert.equal(result.status, 'SUCCESS_CHANGES'); assert.equal(result.counts.newTrials, 1);
  assert.equal(result.dispatch[0].agent, 'Trials'); assert.equal(result.dispatch[0].reviewOnly, true);
  const held = handoff(cwd, [integrity]); result = consumeDiscovery(held.options);
  assert.equal(result.dispatch[0].agent, 'Integrity'); assert.equal(result.coverage[0].integrityFlaggedTrials, 1);
  const zero = handoff(cwd, [(await scan(null)).output]); result = consumeDiscovery(zero.options);
  assert.equal(result.status, 'SUCCESS_ZERO'); assert.equal(result.counts.reviewPackets, 0);
  assert.equal(result.coverage.length, 1); assert.deepEqual(result.dispatch, []);
});

test('structured partial/failure never substitutes zero or consumes an old successful pointer', async t => {
  const cwd = scratch(t), partial = handoff(cwd, [(await scan(marked, {}, false, true)).output]);
  write(path.join(partial.options.scanRoot, 'latest-successful.json'), { complete: true, requestId: 'old-successful-attempt' });
  let result = consumeDiscovery(partial.options);
  assert.equal(result.ok, false); assert.equal(result.exitCode, 1); assert.deepEqual(result.dispatch, []);
  assert.equal(result.triage[0].agent, 'Integrity'); assert.equal(result.triage[0].incompleteCoverage, true);
  fs.unlinkSync(partial.options.manifestFile); result = consumeDiscovery(partial.options);
  assert.equal(result.status, 'FAILED_HANDOFF'); assert.equal(result.counts, null);
  assert.deepEqual(result.triage, []);
});

test('mixed structured handoff includes cited PMID correction even with no new identifier for that correction', async t => {
  const cwd = scratch(t), s = { ...subject, knownPmids: ['12345678'], knownNcts: ['NCT07487363'] };
  const article = (id, correction = false) => `<PubmedArticle><MedlineCitation><PMID>${id}</PMID><Article><ArticleTitle>TB-500 fixture research</ArticleTitle><Abstract><AbstractText>TB-500 fixture only</AbstractText></Abstract><PublicationTypeList><PublicationType>Journal Article</PublicationType></PublicationTypeList></Article>${correction ? '<CommentsCorrectionsList><CommentsCorrections RefType="ErratumIn"><PMID>99999999</PMID></CommentsCorrections></CommentsCorrectionsList>' : ''}</MedlineCitation></PubmedArticle>`;
  const request = (changed, trials) => async url => {
    if (url.includes('esearch.fcgi')) return { esearchresult: { count: changed ? '2' : '1', idlist: changed ? ['12345678', '23456789'] : ['12345678'], querytranslation: 'fixture' } };
    if (url.includes('efetch.fcgi')) return `<PubmedArticleSet>${article('12345678', changed)}${changed ? article('23456789') : ''}</PubmedArticleSet>`;
    return { studies: trials, totalCount: trials.length };
  };
  const first = await scanSubject(s, {}, { end, request: request(false, [neutral()]) });
  const updated = neutral(); updated.protocolSection.designModule.enrollmentInfo.count = 81;
  const novel = neutral(); novel.protocolSection.identificationModule.nctId = 'NCT07000001';
  const changed = await scanSubject(s, first.nextState, { end, request: request(true, [updated, novel]) });
  const f = handoff(cwd, [changed.output]), result = consumeDiscovery(f.options);
  assert.equal(result.ok, true);
  assert.deepEqual(result.counts, { newPapers: 1, correctedPapers: 1, newTrials: 1, updatedTrials: 1, reviewPackets: 4 });
  assert.equal(result.dispatch.find(d => d.agent === 'Evidence').packetIds.length, 2);
  assert.equal(result.dispatch.find(d => d.agent === 'Trials').packetIds.length, 2);
  assert.equal(changed.output.correctedPapers[0].pmid, '12345678');
});

test('hash-valid subject errors contradicting SUCCESS and missing inventory coverage fail closed', async t => {
  const cwd = scratch(t), output = (await scan(null)).output;
  const contradiction = structuredClone(output); contradiction.errors.push({ source: 'fixture', error: 'not complete' });
  let f = handoff(cwd, [contradiction]);
  assert.match(consumeDiscovery(f.options).errors[0], /Success contains incomplete/);
  f = handoff(cwd, [output]);
  const inventoryFile = path.join(f.manifest.runDir, 'inventory.json');
  write(inventoryFile, { attemptedSubjects: [output.slug, 'missing-subject'] });
  f.manifest.inventorySha256 = digest(fs.readFileSync(inventoryFile)); write(f.options.manifestFile, f.manifest);
  assert.match(consumeDiscovery(f.options).errors[0], /does not cover attempted inventory/);
});

test('invalid/stale structured handoffs fail closed, even when stdout would imply success', async t => {
  const cwd = scratch(t), output = (await scan(neutral())).output;
  const cases = [
    ['old-request', f => { f.manifest.requestId = randomUUID(); }],
    ['wrong-version', f => { f.manifest.handoffVersion = 42; }],
    ['wrong-run', f => { f.manifest.runId = 'wrong-run'; }],
    ['scope', f => { f.manifest.days = 90; }],
    ['known-scope', f => { f.manifest.requestedScope.knownLimit = 1; }],
    ['missing-file', f => { fs.unlinkSync(path.join(f.manifest.runDir, 'tb-500.json')); }],
    ['hash', f => { fs.appendFileSync(path.join(f.manifest.runDir, 'tb-500.json'), ' '); }],
    ['unsafe-path', f => { f.manifest.subjects[0].outputFile = '../../outside.json'; }],
    ['missing-inventory-subject', f => { f.manifest.subjects = []; }],
    ['corrupt-json', f => { f.corrupt = true; }],
    ['success-contradiction', f => { f.manifest.complete = false; }],
  ];
  for (const [name, mutate] of cases) {
    const f = handoff(cwd, [output]); mutate(f); write(f.options.manifestFile, f.manifest);
    if (f.corrupt) fs.writeFileSync(f.options.manifestFile, '{');
    const result = consumeDiscovery(f.options);
    assert.equal(result.ok, false, name); assert.equal(result.counts, null, name); assert.deepEqual(result.dispatch, [], name);
  }
});

test('valid-looking success with subprocess failure and queue persistence failure are not writer handoffs', async t => {
  const cwd = scratch(t), normal = handoff(cwd, [(await scan(neutral())).output]);
  let result = consumeDiscovery({ ...normal.options, exitCode: 1 });
  assert.equal(result.ok, false); assert.deepEqual(result.dispatch, []); assert.equal(result.triage.length, 1);
  const partial = (await scan(marked, {}, false, true)).output;
  const blocked = handoff(cwd, [partial], { complete: false, persistenceError: 'Corrupt impact queue packet' });
  result = consumeDiscovery(blocked.options); assert.equal(result.errors[0], 'Corrupt impact queue packet');
  assert.deepEqual(result.dispatch, []);
});

test('shell argument validation rejects injection and missing days before executing', t => {
  for (const value of ['0', '-1', '', undefined, '2;echo leak', '1.5', '36501']) assert.throws(() => discoveryDays(value));
  const cwd = scratch(t); let invoked = false;
  const result = runResearchDiscovery({ cwd, days: '14', execute(binary, args) {
    invoked = true; assert.equal(binary, process.execPath); assert.equal(args[2], '14');
    assert.ok(args.includes('--manifest-file')); assert.ok(args.includes('--request-id'));
    throw Object.assign(new Error('fixture spawn failure'), { status: 3, stdout: 'peptides 1 · new papers 99 · new trials 99 · updated trials 99' });
  } });
  assert.equal(invoked, true); assert.equal(result.status, 'FAILED_HANDOFF'); assert.equal(result.counts, null);
});

function cliFixture(t) {
  const cwd = scratch(t), bootstrap = path.join(cwd, 'transport.mjs');
  fs.mkdirSync(path.join(cwd, 'src/content/peptides'), { recursive: true });
  fs.mkdirSync(path.join(cwd, 'data/source-packs'), { recursive: true });
  fs.writeFileSync(path.join(cwd, 'src/content/peptides/tb-500.mdx'), '---\nname: TB-500\n---\nFixture only.');
  fs.writeFileSync(bootstrap, `import cp from 'node:child_process'; import { syncBuiltinESMExports } from 'node:module';
    cp.execSync = () => '1/1 CONVERGED after 1 round COVERAGE: 1/1 live identifiers verified (100%)'; syncBuiltinESMExports();
    globalThis.fetch = async url => {
      if (process.env.HANDOFF_MODE === 'failed') return new Response('fixture denied', {status:401});
      if (url.includes('esearch.fcgi')) return Response.json({esearchresult:{count:'0',idlist:[],querytranslation:'fixture'}});
      if (url.includes('clinicaltrials.gov')) {
        const record = ${JSON.stringify(marked)};
        if (process.env.HANDOFF_MODE === 'changed') record.protocolSection.statusModule.overallStatus = 'COMPLETED';
        return Response.json({studies: process.env.HANDOFF_MODE === 'zero' ? [] : [record], totalCount:process.env.HANDOFF_MODE === 'zero' ? 0 : 1});
      }
      throw new Error('Unexpected fixture request');
    };`);
  const scanner = fileURLToPath(new URL('../monthly-research-scan.mjs', import.meta.url));
  fs.mkdirSync(path.join(cwd, 'scripts'), { recursive: true });
  fs.writeFileSync(path.join(cwd, 'scripts/monthly-research-scan.mjs'), `import ${JSON.stringify(pathToFileURL(scanner).href)};`);
  return { cwd, bootstrap, scanner, env: mode => ({ ...process.env, HANDOFF_MODE: mode,
    NODE_OPTIONS: `--import=${pathToFileURL(bootstrap).href}` }) };
}

test('actual scanner CLI publishes exact manifests with hashed raw provenance and preserves state on failure', { timeout: 20000 }, t => {
  const f = cliFixture(t), scanRoot = path.join(f.cwd, '.planning/research-scan');
  const run = mode => {
    const requestId = randomUUID(), manifestFile = path.join(f.cwd, `${requestId}.json`);
    const processResult = spawnSync(process.execPath, [f.scanner, '--days', '14', '--end', end, '--manifest-file', manifestFile, '--request-id', requestId],
      { cwd: f.cwd, env: f.env(mode), encoding: 'utf8', timeout: 10000 });
    return { processResult, manifestFile, result: consumeDiscovery({ manifestFile, requestId, scanRoot, days: 14, end, exitCode: processResult.status }) };
  };
  const first = run('marked'); assert.equal(first.processResult.status, 0, first.processResult.stderr);
  assert.equal(first.result.dispatch[0].agent, 'Integrity');
  const manifest = JSON.parse(fs.readFileSync(first.manifestFile));
  const packet = JSON.parse(fs.readFileSync(path.join(manifest.runDir, 'tb-500.json'))).impactPackets[0];
  const raw = fs.readFileSync(path.join(manifest.runDir, packet.record.rawProvenance.rawFile));
  assert.equal(digest(raw), packet.record.rawProvenance.responseSha256);
  assert.equal(JSON.parse(raw).studies[0].protocolSection.descriptionModule.briefSummary, marked.protocolSection.descriptionModule.briefSummary);
  assert.equal(packet.record.rawProvenance.recordLocator, '$.studies[0]');
  assert.match(packet.record.rawProvenance.retrievedAt, /^\d{4}-\d{2}-\d{2}T/);
  const second = run('marked'); assert.equal(second.result.status, 'SUCCESS_ZERO');
  assert.notEqual(first.result.runId, second.result.runId);
  const before = fs.readFileSync(path.join(scanRoot, 'latest-successful.json'), 'utf8');
  const state = fs.readFileSync(path.join(scanRoot, 'state-v2.json'), 'utf8');
  const failed = run('failed'); assert.equal(failed.processResult.status, 1); assert.equal(failed.result.status, 'INCOMPLETE');
  assert.equal(fs.readFileSync(path.join(scanRoot, 'latest-successful.json'), 'utf8'), before);
  assert.equal(fs.readFileSync(path.join(scanRoot, 'state-v2.json'), 'utf8'), state);
  assert.equal(first.result.status, 'SUCCESS_CHANGES'); // exact invocation remains usable after later failure
  const immutable = fs.readFileSync(first.manifestFile, 'utf8');
  const collision = spawnSync(process.execPath, [f.scanner, '--days', '14', '--end', end, '--manifest-file', first.manifestFile, '--request-id', manifest.requestId],
    { cwd: f.cwd, env: f.env('changed'), encoding: 'utf8', timeout: 10000 });
  assert.equal(collision.status, 1); assert.match(collision.stderr, /Invocation manifest already exists/);
  assert.equal(fs.readFileSync(first.manifestFile, 'utf8'), immutable);
  const badParent = path.join(f.cwd, 'not-a-directory'); fs.writeFileSync(badParent, 'fixture');
  const stateBeforeDestinationFailure = fs.readFileSync(path.join(scanRoot, 'state-v2.json'), 'utf8');
  const blocked = spawnSync(process.execPath, [f.scanner, '--days', '14', '--end', end, '--manifest-file', path.join(badParent, 'result.json'), '--request-id', randomUUID()],
    { cwd: f.cwd, env: f.env('changed'), encoding: 'utf8', timeout: 10000 });
  assert.equal(blocked.status, 1); assert.equal(fs.existsSync(path.join(badParent, 'result.json')), false);
  assert.equal(fs.readFileSync(path.join(scanRoot, 'state-v2.json'), 'utf8'), stateBeforeDestinationFailure);
  assert.equal(fs.readFileSync(path.join(scanRoot, 'latest-successful.json'), 'utf8'), before);
});

test('actual content-loop Layer 3 and exit behavior use scanner structured success/zero/failure', { timeout: 30000 }, t => {
  const f = cliFixture(t), script = fileURLToPath(new URL('../content-loop.mjs', import.meta.url));
  for (const [mode, status, code] of [['marked', 'SUCCESS_CHANGES', 0], ['marked', 'SUCCESS_ZERO', 0], ['failed', 'INCOMPLETE', 1]]) {
    const result = spawnSync(process.execPath, [script, '--days', '14'], { cwd: f.cwd, env: f.env(mode), encoding: 'utf8', timeout: 12000 });
    assert.equal(result.status, code, result.stderr || result.stdout);
    const report = JSON.parse(fs.readFileSync(path.join(f.cwd, '.planning/loop', `${new Date().toISOString().slice(0,10)}.json`)));
    assert.equal(report.discovery.status, status);
    if (code) { assert.ok(report.escalate.some(e => e.gate === 'discovery')); assert.deepEqual(report.discovery.dispatch, []); }
    else if (status === 'SUCCESS_CHANGES') assert.equal(report.dispatch[0].agent, 'Integrity');
    else assert.deepEqual(report.dispatch, []);
  }
});
