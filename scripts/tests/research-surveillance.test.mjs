import test from 'node:test';
import assert from 'node:assert/strict';
import { scanSubject, fetchTrialPages, trialMaterial, windowFrom, selectAliases, dueKnown, renderSummary, validateImpactPacket } from '../../verification/research-surveillance.mjs';
import { parseSurveillanceRecords, searchSurveillance, fetchSurveillanceRecords } from '../../verification/pubmed.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const subject = { slug: 'example', name: 'Exampleptide', aliases: [], knownPmids: [], knownNcts: [] };
const options = request => ({ request, end: '2026-09-04' });
const article = (id, correction = '', title = 'Exampleptide research') => `<PubmedArticle><MedlineCitation><PMID Version="1">${id}</PMID><Article><Journal><Title>Fixture Journal</Title><JournalIssue><PubDate><Year>2001</Year></PubDate></JournalIssue></Journal><ArticleTitle>${title}</ArticleTitle><Abstract><AbstractText>Exampleptide experimental data.</AbstractText></Abstract><PublicationTypeList><PublicationType>Journal Article</PublicationType></PublicationTypeList></Article>${correction ? `<CommentsCorrectionsList><CommentsCorrections RefType="ErratumIn"><RefSource>Fixture correction</RefSource><PMID>${correction}</PMID></CommentsCorrections></CommentsCorrectionsList>` : ''}</MedlineCitation><PubmedData><ArticleIdList><ArticleId IdType="doi">10.9999/fixture</ArticleId></ArticleIdList></PubmedData></PubmedArticle>`;
const xml = records => `<PubmedArticleSet>${records.join('')}</PubmedArticleSet>`;
const trial = (number, overrides = {}) => ({ protocolSection: { identificationModule: { nctId: `NCT${String(number).padStart(8,'0')}`, briefTitle: 'Exampleptide study' }, statusModule: { overallStatus: 'RECRUITING', lastUpdatePostDateStruct: { date: '2026-09-01' } }, designModule: { phases: ['PHASE2'], enrollmentInfo: { count: 40, type: 'ESTIMATED' } }, ...overrides } });
function transport({ ids = [], correction = '', records, trials = [] } = {}) {
  return async url => {
    const u = new URL(url);
    if (u.pathname.endsWith('esearch.fcgi')) return { esearchresult: { count: String(ids.length), idlist: ids, querytranslation: u.searchParams.get('term'), warninglist: { phrasesignored: [] } } };
    if (u.pathname.endsWith('efetch.fcgi')) return xml(records || u.searchParams.get('id').split(',').map(id => article(id, correction)));
    if (/\/studies\/NCT/.test(u.pathname)) return trials.find(t => u.pathname.endsWith(t.protocolSection.identificationModule.nctId));
    return { studies: trials, totalCount: trials.length };
  };
}

test('zero window reports SUCCESS_ZERO; count of all-known records is not silent-zero failure', async () => {
  const zero = await scanSubject(subject, {}, options(transport()));
  assert.equal(zero.output.status, 'SUCCESS_ZERO');
  const s = { ...subject, knownPmids: ['12345678'] };
  const known = await scanSubject(s, {}, options(transport({ ids: ['12345678'] })));
  assert.equal(known.output.status, 'SUCCESS_ZERO');
  assert.equal(known.output.counts.knownPapersRetrieved, 1);
  assert.equal(known.output.newPapers.length, 0);
  assert.equal(known.output.silentZero, undefined);
});

test('known PMID correction creates impact packet without a new PMID and overlapping run deduplicates it', async () => {
  const s = { ...subject, knownPmids: ['12345678'] };
  const first = await scanSubject(s, {}, options(transport({ ids: ['12345678'] })));
  const changed = await scanSubject(s, first.nextState, options(transport({ ids: ['12345678'], correction: '23456789' })));
  assert.equal(changed.output.status, 'SUCCESS_CHANGES');
  assert.equal(changed.output.newPapers.length, 0);
  assert.equal(changed.output.correctedPapers[0].relationships[0].type, 'ErratumIn');
  assert.equal(changed.output.impactPackets.length, 1);
  const repeated = await scanSubject(s, changed.nextState, options(transport({ ids: ['12345678'], correction: '23456789' })));
  assert.equal(repeated.output.status, 'SUCCESS_ZERO');
  assert.equal(repeated.output.impactPackets.length, 0);
});

test('citation-only date, author, and journal corrections create review packets', async () => {
  const s = { ...subject, knownPmids: ['12345678'] }, original = article('12345678');
  const first = await scanSubject(s, {}, options(transport({ ids: ['12345678'], records: [original] })));
  for (const revised of [
    original.replace('<Year>2001</Year>', '<Year>2025</Year>'),
    original.replace('Fixture Journal', 'Corrected Journal'),
    original.replace('<PublicationTypeList>', '<AuthorList><Author><LastName>ChapterAuthor</LastName><Initials>AB</Initials></Author></AuthorList><PublicationTypeList>'),
    original.replace('</ArticleTitle>', '</ArticleTitle><ArticleDate DateType="Electronic"><Year>2024</Year></ArticleDate>'),
  ]) {
    const changed = await scanSubject(s, first.nextState, options(transport({ ids: ['12345678'], records: [revised] })));
    assert.equal(changed.output.status, 'SUCCESS_CHANGES');
    assert.equal(changed.output.correctedPapers.length, 1);
    assert.equal(changed.output.impactPackets[0].kind, 'CITED_RECORD_CHANGED');
    const repeat = await scanSubject(s, changed.nextState, options(transport({ ids: ['12345678'], records: [revised] })));
    assert.equal(repeat.output.status, 'SUCCESS_ZERO');
  }
});

test('A to B to A to B produces distinct transition packets; partial retries retain stable IDs', async () => {
  const s = { ...subject, knownPmids: ['12345678'] };
  const request = correction => transport({ ids: ['12345678'], correction });
  let current = await scanSubject(s, {}, options(request('')));
  const packets = [];
  for (const correction of ['23456789', '', '23456789']) {
    const changed = await scanSubject(s, current.nextState, options(request(correction)));
    assert.equal(changed.output.impactPackets.length, 1);
    packets.push(changed.output.impactPackets[0]);
    current = changed;
  }
  assert.deepEqual(packets.map(p => p.transitionRevision), [2, 3, 4]);
  assert.equal(new Set(packets.map(p => p.packetId)).size, 3);
  assert.equal(packets[0].fingerprint, packets[2].fingerprint);
  const base = request('');
  const failedRequest = async u => { if (u.includes('clinicaltrials')) throw new Error('HTTP 500'); return base(u); };
  const failed = await scanSubject(s, current.nextState, options(failedRequest));
  const failedAgain = await scanSubject(s, failed.nextState, { ...options(failedRequest), end: '2026-09-05' });
  const recovered = await scanSubject(s, failedAgain.nextState, options(base));
  assert.equal(failed.output.status, 'PARTIAL');
  assert.deepEqual(failed.nextState, current.nextState);
  assert.equal(failed.output.impactPackets[0].transitionRevision, 5);
  assert.equal(failed.output.impactPackets[0].packetId, failedAgain.output.impactPackets[0].packetId);
  assert.equal(failed.output.impactPackets[0].packetId, recovered.output.impactPackets[0].packetId);
  const repeated = await scanSubject(s, recovered.nextState, options(base));
  assert.equal(repeated.output.impactPackets.length, 0);
});

test('same-ID packet validation rejects parseable but mismatched evidence and identity', async () => {
  const scanned = await scanSubject(subject, {}, options(transport({ ids: ['12345678'] })));
  const expected = scanned.output.impactPackets[0];
  assert.doesNotThrow(() => validateImpactPacket(structuredClone(expected), expected));
  for (const modify of [
    p => { p.record.abstract = 'Tampered evidence'; },
    p => { delete p.record; },
    p => { p.id = '99999999'; },
    p => { p.transitionRevision++; },
  ]) {
    const corrupted = structuredClone(expected); modify(corrupted);
    assert.throws(() => validateImpactPacket(corrupted, expected), /invalid|incomplete|mismatched/);
  }
});

test('late-added older paper discovered through CRDT rather than publication date', async () => {
  const queries = [], base = transport({ ids: ['12345678'] });
  const result = await scanSubject(subject, {}, options(async u => { queries.push(u); return base(u); }));
  assert.equal(result.output.newPapers[0].pubdate, '2001');
  const terms = queries.filter(u => u.includes('esearch')).map(u => new URL(u).searchParams.get('term'));
  assert.ok(terms.some(t => t.includes('[crdt]')));
  assert.ok(terms.some(t => t.includes('[lr]')));
  assert.ok(terms.every(t => !t.includes('3000') && t.includes('2026/09/04')));
});

test('sources cited on another surface are not relabeled new sources', async () => {
  const s = { ...subject, knownAcrossSitePmids: ['12345678'], knownAcrossSiteNcts: ['NCT00000001'] };
  const result = await scanSubject(s, {}, options(transport({ ids: ['12345678'], trials: [trial(1)] })));
  assert.equal(result.output.newPapers.length, 0);
  assert.equal(result.output.newTrials.length, 0);
  assert.equal(result.output.updatedTrials[0].changeKind, 'CITED_TRIAL_BASELINE_REVIEW');
  assert.equal(result.output.counts.knownPapersRetrieved, 1);
});

test('clinical trial pagination retrieves more than 40 and reconciles totalCount', async () => {
  const all = Array.from({ length: 45 }, (_,i) => trial(i + 1));
  const result = await fetchTrialPages({ alias: 'Exampleptide', from: '2026-08-01', to: '2026-09-04', request: async u => new URL(u).searchParams.get('pageToken')
    ? { studies: all.slice(40), totalCount: 45 } : { studies: all.slice(0,40), totalCount: 45, nextPageToken: 'page2' } });
  assert.equal(result.complete, true);
  assert.equal(Object.keys(result.records).length, 45);
  assert.equal(result.pages.length, 2);
});

test('truncated trial pages and repeated token cannot claim complete coverage', async () => {
  for (const response of [{ studies: [trial(1)], totalCount: 45 }, { studies: [trial(1)], totalCount: 45, nextPageToken: 'again' }]) {
    const result = await fetchTrialPages({ alias: 'Exampleptide', from: '2026-08-01', to: '2026-09-04', request: async () => response });
    assert.equal(result.complete, false);
    assert.ok(result.error);
  }
});

test('administrative-only trial edit does not become an updated trial finding', async () => {
  const first = await scanSubject(subject, {}, options(transport({ trials: [trial(1)] })));
  const administrative = trial(1, { contactsLocationsModule: { centralContacts: [{ name: 'Changed contact' }] }, statusModule: { overallStatus: 'RECRUITING', lastUpdatePostDateStruct: { date: '2026-09-03' } } });
  const second = await scanSubject(subject, first.nextState, options(transport({ trials: [administrative] })));
  assert.equal(second.output.updatedTrials.length, 0);
  assert.equal(second.output.status, 'SUCCESS_ZERO');
  assert.equal(second.output.counts.unchangedTrials, 1);
});

test('trial brief title, official title and condition applicability changes are material', async () => {
  const initial = trial(1, { identificationModule: { nctId: 'NCT00000001', briefTitle: 'Exampleptide adults', officialTitle: 'Adult Trial' }, conditionsModule: { conditions: ['Adult condition'] } });
  const first = await scanSubject(subject, {}, options(transport({ trials: [initial] })));
  for (const modify of [
    t => { t.protocolSection.identificationModule.briefTitle = 'Exampleptide children'; },
    t => { t.protocolSection.identificationModule.officialTitle = 'Pediatric Trial'; },
    t => { t.protocolSection.conditionsModule.conditions = ['Different condition']; },
  ]) {
    const revised = structuredClone(initial); modify(revised);
    const changed = await scanSubject(subject, first.nextState, options(transport({ trials: [revised] })));
    assert.equal(changed.output.status, 'SUCCESS_CHANGES');
    assert.equal(changed.output.updatedTrials[0].changeKind, 'MATERIAL_TRIAL_CHANGE');
    assert.equal(changed.output.impactPackets[0].transitionRevision, 2);
    const repeat = await scanSubject(subject, changed.nextState, options(transport({ trials: [revised] })));
    assert.equal(repeat.output.status, 'SUCCESS_ZERO');
  }
});

test('enrollment estimated-to-actual and results change are material, publications remain separate', async () => {
  const a = trial(1), b = trial(1, { designModule: { phases: ['PHASE2'], enrollmentInfo: { count: 40, type: 'ACTUAL' } } });
  b.resultsSection = { participantFlowModule: { preAssignmentDetails: 'Fixture' } };
  assert.notDeepEqual(trialMaterial(a), trialMaterial(b));
  const first = await scanSubject(subject, {}, options(transport({ trials: [a] })));
  const second = await scanSubject(subject, first.nextState, options(transport({ trials: [b] })));
  assert.equal(second.output.updatedTrials[0].enrollmentType, 'ACTUAL');
  assert.equal(second.output.updatedTrials[0].resultsPosted, true);
  assert.deepEqual(second.output.updatedTrials[0].publications, []);
});

test('429 and 500 surface FAILED, no watermark advancement', async () => {
  for (const status of [429,500]) {
    const prior = { watermarks: { existing: '2026-07-01' } };
    const result = await scanSubject(subject, prior, options(async () => { throw new Error(`HTTP ${status}`); }));
    assert.equal(result.output.status, 'FAILED');
    assert.deepEqual(result.nextState, prior);
    assert.equal(result.output.watermarksAdvanced, false);
    assert.match(renderSummary([result.output], 'fixture', '2026-09-04'), new RegExp(`HTTP ${status}`));
  }
});

test('missing abstract record batch is PARTIAL, preserves state and reports missing IDs', async () => {
  const result = await scanSubject(subject, {}, options(transport({ ids: ['12345678'], records: [] })));
  assert.equal(result.output.status, 'PARTIAL');
  assert.deepEqual(result.nextState, {});
  assert.deepEqual(result.output.errors[0].missing, ['12345678']);
});

test('a record legitimately lacking an abstract is not a missing fetched record', () => {
  const record = article('12345678').replace(/<Abstract>.*?<\/Abstract>/, '');
  assert.equal(parseSurveillanceRecords(xml([record]))['12345678'].abstractAvailable, false);
});

test('ESearch truncation and unexpected response shape cannot become quiet zero', async () => {
  for (const response of [{ esearchresult: { count: '201', idlist: ['12345678'] } }, {}]) {
    const result = await searchSurveillance({ alias: 'Exampleptide', field: 'crdt', from: '2026-08-01', to: '2026-09-04', request: async () => response });
    assert.equal(result.complete, false);
    assert.ok(result.error);
  }
});

test('cosmetic dossier date is ignored; successful watermark overlaps and --days explicitly overrides', () => {
  assert.equal(windowFrom({ watermark: '2026-08-25', end: '2026-09-04', lastUpdated: '2026-09-04' }), '2026-08-11');
  assert.equal(windowFrom({ end: '2026-09-04', lastUpdated: '2026-09-04' }), '2026-06-07');
  assert.equal(windowFrom({ watermark: '2026-08-25', end: '2026-09-04', days: 2 }), '2026-09-03');
});

test('aliases need evidence and same-compound relationship; related derivatives stay quarantined', () => {
  const s = { ...subject, aliases: ['Parent compound', 'Development code'] };
  const result = selectAliases(s, [{ alias: 'Development code', status: 'validated', relationship: 'same-compound', sourceUrl: 'https://example.org/record', supportLocator: 'Interventions', reviewedAt: '2026-09-04', reviewer: 'Fixture' }, { alias: 'Parent compound', status: 'validated', relationship: 'parent' }]);
  assert.deepEqual(result.aliases, ['Exampleptide', 'Development code']);
  assert.equal(result.quarantined[0].alias, 'Parent compound');
});

test('known recheck rotates oldest first and reports bounded backlog', async () => {
  assert.deepEqual(dueKnown(['3','1','2'], { 1: '2026-08-01', 2: '2026-09-03' }, '2026-09-04', 1), ['3']);
  const result = await scanSubject({ ...subject, knownPmids: ['12345678','23456789'] }, {}, { ...options(transport()), knownLimit: 1 });
  assert.equal(result.output.knownCoverage.selectedPmids.length, 1);
  assert.equal(result.output.knownCoverage.duePmidsRemaining, 1);
  const discovered = await scanSubject({ ...subject, knownPmids: ['12345678','23456789'] }, {}, { ...options(transport({ ids: ['23456789'] })), knownLimit: 1 });
  assert.equal(discovered.output.knownCoverage.duePmidsRemaining, 0);
});

test('non-OK CT.gov after successful PubMed is PARTIAL and does not advance any subject state', async () => {
  const base = transport({ ids: ['12345678'] });
  const result = await scanSubject(subject, {}, options(async u => { if (u.includes('clinicaltrials')) throw new Error('HTTP 500'); return base(u); }));
  assert.equal(result.output.status, 'PARTIAL');
  assert.deepEqual(result.nextState, {});
  assert.equal(result.output.newPapers.length, 1);
});

test('truncated XML fails explicitly and PubMed relationship identifiers are preserved', () => {
  assert.throws(() => parseSurveillanceRecords('<PubmedArticleSet>'), /Incomplete/);
  const result = parseSurveillanceRecords(xml([article('12345678','23456789')]));
  assert.equal(result['12345678'].relationships[0].pmid, '23456789');
});

test('book records retain chapter versus book dates and never borrow DOI from a referenced study', async () => {
  const result = await fetchSurveillanceRecords(['30000039'], { request: async () => xml(['<PubmedBookArticle><BookDocument><PMID>30000039</PMID><Book><BookTitle>Fixture Book</BookTitle><PubDate><Year>2006</Year></PubDate></Book><ArticleTitle>Fixture chapter</ArticleTitle><ContributionDate><Year>2026</Year></ContributionDate><ReferenceList><Reference><ArticleIdList><ArticleId IdType="doi">10.9999/unrelated-reference</ArticleId></ArticleIdList></Reference></ReferenceList></BookDocument><PubmedBookData><ArticleIdList><ArticleId IdType="pubmed">30000039</ArticleId></ArticleIdList></PubmedBookData></PubmedBookArticle>']) });
  assert.equal(result.complete, true);
  assert.equal(result.records['30000039'].recordType, 'PubmedBookArticle');
  assert.equal(result.records['30000039'].publicationDates.bookEditionDate, '2006');
  assert.equal(result.records['30000039'].pubdate, '2026');
  assert.equal(result.records['30000039'].doi, null);
});

test('book firstAuthor uses chapter authors only and is explicitly unknown when absent', () => {
  const editor = '<AuthorList Type="editors"><Author><LastName>BookEditor</LastName><Initials>ZZ</Initials></Author></AuthorList>';
  const chapterAuthors = '<AuthorList Type="authors"><Author><LastName>ChapterAuthor</LastName><Initials>AB</Initials></Author></AuthorList>';
  const makeBook = own => xml([`<PubmedBookArticle><BookDocument><PMID>30000039</PMID><Book><BookTitle>Fixture Book</BookTitle>${editor}</Book><ArticleTitle>Fixture chapter</ArticleTitle>${own}<ReferenceList><Reference>${chapterAuthors.replace('ChapterAuthor', 'ReferenceAuthor')}</Reference></ReferenceList></BookDocument></PubmedBookArticle>`]);
  const chapter = parseSurveillanceRecords(makeBook(chapterAuthors))['30000039'];
  assert.equal(chapter.firstAuthor, 'ChapterAuthor AB');
  assert.equal(chapter.firstAuthorStatus, 'present');
  for (const own of ['', editor]) {
    const missing = parseSurveillanceRecords(makeBook(own))['30000039'];
    assert.equal(missing.firstAuthor, '');
    assert.equal(missing.firstAuthorStatus, 'unknown');
  }
});

test('book title and chapter contribution date changes create citation review packets', async () => {
  const s = { ...subject, knownPmids: ['30000039'] };
  const book = '<PubmedBookArticle><BookDocument><PMID>30000039</PMID><Book><BookTitle>Fixture Book</BookTitle></Book><ArticleTitle>Exampleptide chapter</ArticleTitle><ContributionDate><Year>2024</Year></ContributionDate></BookDocument></PubmedBookArticle>';
  const first = await scanSubject(s, {}, options(transport({ ids: ['30000039'], records: [book] })));
  for (const changedBook of [book.replace('2024', '2025'), book.replace('Fixture Book', 'Corrected Book')]) {
    const changed = await scanSubject(s, first.nextState, options(transport({ ids: ['30000039'], records: [changedBook] })));
    assert.equal(changed.output.correctedPapers.length, 1);
    assert.equal(changed.output.status, 'SUCCESS_CHANGES');
  }
});

test('CLI keeps immutable raw runs, deduplicates queue and preserves successful pointer on failure', { timeout: 30000 }, () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'pepcodex-scanner-fixture-'));
  const root = path.join(cwd, 'outputs');
  const script = fileURLToPath(new URL('../monthly-research-scan.mjs', import.meta.url));
  const bootstrap = path.join(cwd, 'mock-transport.mjs');
  fs.mkdirSync(path.join(cwd, 'src/content/peptides'), { recursive: true });
  fs.mkdirSync(path.join(cwd, 'data/source-packs'), { recursive: true });
  fs.writeFileSync(path.join(cwd, 'src/content/peptides/example.mdx'), '---\nname: Exampleptide\nlastUpdated: 2026-09-04\n---\nFixture content');
  fs.writeFileSync(bootstrap, `globalThis.fetch = async (url) => {
    if (process.env.SCANNER_FIXTURE_FAIL === '1') return new Response('denied', { status: 401 });
    const u = new URL(url);
    if (process.env.SCANNER_FIXTURE_FAIL === 'partial' && u.hostname === 'clinicaltrials.gov') return new Response('fixture unavailable', { status: 500 });
    if (u.pathname.endsWith('esearch.fcgi')) return Response.json({esearchresult:{count:'1',idlist:['12345678'],querytranslation:u.searchParams.get('term')}});
    if (u.pathname.endsWith('efetch.fcgi')) return new Response(${JSON.stringify(xml([article('12345678')]))}.replace('Exampleptide research', process.env.SCANNER_FIXTURE_VARIANT === 'B' ? 'Exampleptide revised' : 'Exampleptide research'));
    return Response.json({studies:[],totalCount:0});
  };`);
  try {
    const run = (fail, variant = 'A') => spawnSync(process.execPath, ['--import', pathToFileURL(bootstrap).href, script, '--slug', 'example', '--out', root], {
      cwd, encoding: 'utf8', timeout: 12000, env: { ...process.env, SCANNER_FIXTURE_FAIL: fail === true ? '1' : fail || '0', SCANNER_FIXTURE_VARIANT: variant },
    });
    const first = run(false);
    assert.equal(first.status, 0, first.stderr || first.stdout);
    const pointerFile = path.join(root, 'latest-successful.json');
    const initial = JSON.parse(fs.readFileSync(pointerFile, 'utf8'));
    assert.ok(fs.readdirSync(path.join(initial.runDir, 'raw')).length >= 6);
    assert.equal(fs.readdirSync(path.join(root, 'impact-queue')).length, 1);
    const second = run(false);
    assert.equal(second.status, 0, second.stderr || second.stdout);
    assert.equal(fs.readdirSync(path.join(root, 'impact-queue')).length, 1);
    const pointer = fs.readFileSync(pointerFile, 'utf8'), state = fs.readFileSync(path.join(root, 'state-v2.json'), 'utf8');
    const failed = run(true);
    assert.equal(failed.status, 1, failed.stderr || failed.stdout);
    assert.equal(fs.readFileSync(pointerFile, 'utf8'), pointer);
    assert.equal(fs.readFileSync(path.join(root, 'state-v2.json'), 'utf8'), state);
    const attempt = JSON.parse(fs.readFileSync(path.join(root, 'latest-attempt.json'), 'utf8'));
    assert.equal(attempt.complete, false);
    assert.equal(attempt.subjects[0].status, 'FAILED');
    assert.ok(fs.existsSync(path.join(initial.runDir, 'manifest.json')));
    assert.equal(fs.existsSync(path.join(root, '.scanner.lock')), false);

    // A partial run can queue a real new transition without committing its observation state.
    // Reproduce interruption corruption at that exact ID before the successful retry.
    const partial = run('partial', 'B');
    assert.equal(partial.status, 1, partial.stderr || partial.stdout);
    const pendingManifest = JSON.parse(fs.readFileSync(path.join(root, 'latest-attempt.json'), 'utf8'));
    const pending = JSON.parse(fs.readFileSync(path.join(pendingManifest.runDir, 'example.json'), 'utf8')).impactPackets[0];
    assert.equal(pending.transitionRevision, 2);
    const queueFile = path.join(root, 'impact-queue', `${pending.packetId}.json`);
    const validPacket = fs.readFileSync(queueFile, 'utf8');
    fs.writeFileSync(queueFile, '{"interrupted":');
    const blocked = run(false, 'B');
    assert.equal(blocked.status, 1, blocked.stderr || blocked.stdout);
    assert.equal(fs.readFileSync(pointerFile, 'utf8'), pointer);
    assert.equal(fs.readFileSync(path.join(root, 'state-v2.json'), 'utf8'), state);
    const blockedManifest = JSON.parse(fs.readFileSync(path.join(root, 'latest-attempt.json'), 'utf8'));
    assert.equal(blockedManifest.complete, false);
    assert.equal(blockedManifest.subjects[0].watermarksAdvanced, false);
    assert.match(blockedManifest.persistenceError, /Corrupt existing impact packet/);
    assert.equal(fs.readFileSync(queueFile, 'utf8'), '{"interrupted":');
    // Explicit restoration is a fixture operation; the scanner never discards corrupt evidence.
    fs.writeFileSync(queueFile, validPacket);
    const recovered = run(false, 'B');
    assert.equal(recovered.status, 0, recovered.stderr || recovered.stdout);
    assert.equal(fs.readdirSync(path.join(root, 'impact-queue')).length, 2);
    assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'state-v2.json'), 'utf8')).subjects.example.papers['12345678'].revision, 2);
  } finally {
    // Only the exact mkdtemp-owned fixture tree is removed.
    const resolved = fs.realpathSync(cwd), tempRoot = fs.realpathSync(os.tmpdir());
    assert.ok(resolved.startsWith(`${tempRoot}${path.sep}`) && path.basename(resolved).startsWith('pepcodex-scanner-fixture-'));
    fs.rmSync(resolved, { recursive: true, force: true });
  }
});
