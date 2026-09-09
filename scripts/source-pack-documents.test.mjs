import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { validateSourcePackData, validateSourcePack } from './validate-source-pack.js';
import { isDocumentSource, sourcePmid, sourceFingerprint, repairPayloadFingerprint, classifyBeforePubmed, summarizeSourceCounts, resolutionVerdict, decideSourceRepair, safeSourcePackPath } from './lib/source-records.mjs';

// Historical authority document, fetched September 5, 2026. This is not a current label.
export const announcement = {
  id: 'REG:FDA-WEGOVY-CV-2024-03-08', type: 'regulatory',
  title: 'FDA cardiovascular-risk indication announcement for Wegovy',
  authority: 'U.S. Food and Drug Administration', jurisdiction: 'United States',
  officialUrl: 'https://www.fda.gov/news-events/press-announcements/fda-approves-first-treatment-reduce-risk-serious-heart-problems-specifically-adults-obesity-or',
  retrievedAt: '2026-09-05T21:40:15Z', publicationDate: '2024-03-08',
  documentId: { status: 'unknown', reason: 'No separate document number displayed on the announcement.' },
  version: { status: 'unknown', reason: 'The webpage does not display a version identifier.' },
  documentType: 'historical approval announcement',
  supportLocator: 'First paragraph following the March 8, 2024 release date.',
  product: 'Wegovy (semaglutide)', route: 'injection',
  indication: 'Cardiovascular event risk reduction in adults with established cardiovascular disease plus overweight or obesity.',
  scopeNote: 'Evidence of the announcement on its stated date; not evidence of the latest prescribing information.',
  openAccess: true,
};
const packFor = sources => ({ peptide: { name: 'semaglutide', category: 'metabolic' }, sources, metadata: { generatedAt: '2026-09-05T21:40:15Z', sourceCounts: summarizeSourceCounts(sources) } });
const research = { id: 'PMID:37952131', type: 'pubmed', title: 'Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes', year: 2023, subjects: 'human', studyType: 'RCT' };
function temporary(t, sources = [announcement]) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pepcodex-document-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'data/source-packs'), { recursive: true });
  fs.mkdirSync(path.join(dir, '.planning/citation-audit'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'data/trial-match-aliases.json'), '{}');
  fs.writeFileSync(path.join(dir, 'data/source-packs/test.json'), JSON.stringify(packFor(sources)));
  return dir;
}
function run(script, cwd, args = [], mock = null) {
  return spawnSync(process.execPath, [...(mock ? ['--import', pathToFileURL(path.join(cwd, 'mock.mjs')).href] : []), fileURLToPath(new URL(script, import.meta.url)), ...args], { cwd, encoding: 'utf8', timeout: 20000 });
}
test('historical FDA announcement validates without research IDs, year or invented version', () => {
  const result = validateSourcePackData(packFor([announcement]));
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.match(result.verification, /NOT_ASSESSED/);
  assert.equal(result.computedSourceCounts.human, 0); assert.equal(result.computedSourceCounts.regulatory, 1);
  assert.equal(sourcePmid(announcement), null); assert.equal(classifyBeforePubmed(announcement), 'DOCUMENT_REVIEW');
});
test('reference documents validate with unknown jurisdiction and omit unsupported publication dates', () => {
  const reference = { ...announcement, type: 'reference', id: 'REF:EXAMPLE', jurisdiction: { status: 'unknown', reason: 'Not determined.' } };
  delete reference.product; delete reference.route; delete reference.indication; delete reference.publicationDate;
  assert.equal(validateSourcePackData(packFor([reference])).valid, true);
});
test('malformed documents fail; official source shape does not permit human-study fields', () => {
  for (const modify of [s => delete s.authority, s => delete s.route, s => delete s.supportLocator, s => s.retrievedAt = 'yesterday', s => s.version = null, s => s.type = 'pubmed', s => s.officialUrl = 'not-a-url', s => s.subjects = 'human', s => s.pmid = '12345678', s => s.doi = '10.1/fake']) {
    const source = structuredClone(announcement); modify(source);
    assert.equal(validateSourcePackData(packFor([source])).valid, false);
  }
  assert.equal(summarizeSourceCounts([{ ...announcement, subjects: 'human' }, research]).human, 1);
  const falselyCounted = packFor([announcement]); falselyCounted.metadata.sourceCounts.human = 1;
  assert.equal(validateSourcePackData(falselyCounted).valid, false);
});
test('existing research contract and previously valid repository pack remain valid', () => {
  assert.equal(validateSourcePackData(packFor([research])).valid, true);
  assert.equal(sourcePmid(research), '37952131');
  assert.equal(validateSourcePack(fileURLToPath(new URL('../data/source-packs/oveporexton.json', import.meta.url))).valid, true);
  assert.equal(validateSourcePackData(packFor([research, research])).valid, false);
});
test('absence and fuzzy matching produce review/unresolved, even with complete bounded search', () => {
  assert.equal(resolutionVerdict(null, true).verdict, 'UNRESOLVED');
  assert.equal(resolutionVerdict({ score: 1 }, true).verdict, 'REVIEW');
  assert.equal(resolutionVerdict({ score: 1 }, false).status, 'PARTIAL');
  assert.equal(resolutionVerdict({ score: 1 }, true).automaticAttachmentAllowed, false);
});
test('documents, stale evidence, old PHANTOM and fuzzy RESOLVED never authorize deletion or attachment', () => {
  assert.equal(decideSourceRepair({ klass: 'NO_PMID' }, { verdict: 'PHANTOM' }, announcement).action, 'DOCUMENT_REVIEW');
  for (const klass of ['DEAD', 'NO_PMID', 'UNVERIFIED', 'UNRELATED']) {
    const v = { klass, sourceFingerprint: sourceFingerprint(research) };
    assert.equal(decideSourceRepair(v, { verdict: 'PHANTOM' }, research).action, 'REVIEW');
    assert.equal(decideSourceRepair(v, { verdict: 'RESOLVED', match: { pmid: '99999999' } }, research).action, 'REVIEW');
  }
  assert.equal(decideSourceRepair({ klass: 'OK', sourceFingerprint: 'stale' }, null, research).action, 'REVIEW');
  assert.throws(() => safeSourcePackPath('../credentials.json'));
});
test('fingerprint-matched independent review permits only the specific metadata correction', () => {
  const fingerprint = sourceFingerprint(research);
  const v = { klass: 'DOI_WRONG', realDoi: '10.1056/NEJMoa2307563', sourceFingerprint: fingerprint,
    review: { decision: 'APPROVE_METADATA_REPAIR', reviewer: 'fixture reviewer', sourceFingerprint: fingerprint, authorityUrl: 'https://pubmed.ncbi.nlm.nih.gov/37952131/', supportLocator: 'Article identifiers' } };
  v.review.proposedRepairFingerprint = repairPayloadFingerprint(v, null);
  assert.equal(decideSourceRepair(v, null, research).action, 'FIX_DOI');
  assert.equal(decideSourceRepair(v, null, { ...research, title: 'changed' }).action, 'REVIEW');
  assert.equal(decideSourceRepair({ ...v, realDoi: '10.1056/changed-after-review' }, null, research).action, 'REVIEW');
});
test('metadata and attachment approval binds every proposed target field', () => {
  const v = { klass: 'METADATA_WRONG', sourceFingerprint: sourceFingerprint(research), realTitle: 'Reviewed title', realJournal: 'Reviewed journal', realYear: '2024', realAuthors: 'Reviewed Author', realDoi: '10.9999/reviewed',
    review: { decision: 'APPROVE_METADATA_REPAIR', reviewer: 'fixture reviewer', sourceFingerprint: sourceFingerprint(research), authorityUrl: 'https://pubmed.ncbi.nlm.nih.gov/37952131/', supportLocator: 'Reviewed metadata' } };
  v.review.proposedRepairFingerprint = repairPayloadFingerprint(v, null);
  assert.equal(decideSourceRepair(v, null, research).action, 'FIX_META');
  for (const field of ['realTitle', 'realJournal', 'realYear', 'realAuthors', 'realDoi']) assert.equal(decideSourceRepair({ ...v, [field]: 'changed after approval' }, null, research).action, 'REVIEW');
  const resolution = { match: { pmid: '12345678', title: 'Approved candidate', year: '2024', doi: '10.9999/candidate' } };
  const attach = { ...v, klass: 'UNRELATED', review: { ...v.review, confirmedPmid: '12345678' } };
  attach.review.proposedRepairFingerprint = repairPayloadFingerprint(attach, resolution);
  assert.equal(decideSourceRepair(attach, resolution, research).action, 'ATTACH');
  for (const field of ['pmid', 'title', 'year', 'doi']) assert.equal(decideSourceRepair(attach, { match: { ...resolution.match, [field]: 'changed after approval' } }, research).action, 'REVIEW');
});
test('reviewed metadata repair keeps DOI-form id and doi coherent in the real apply CLI', t => {
  const source = { ...research, id: 'DOI:10.9999/old', doi: '10.9999/old' };
  const dir = temporary(t, [source]), audit = path.join(dir, '.planning/citation-audit');
  const v = { file: 'data/source-packs/test.json', index: 0, klass: 'METADATA_WRONG', sourceFingerprint: sourceFingerprint(source), realTitle: 'Reviewed fixture title', realDoi: '10.9999/corrected',
    review: { decision: 'APPROVE_METADATA_REPAIR', reviewer: 'fixture reviewer', sourceFingerprint: sourceFingerprint(source), authorityUrl: 'https://pubmed.ncbi.nlm.nih.gov/37952131/', supportLocator: 'Fixture metadata' } };
  v.review.proposedRepairFingerprint = repairPayloadFingerprint(v, null);
  fs.writeFileSync(path.join(audit, 'source-verification.json'), JSON.stringify([v]));
  fs.writeFileSync(path.join(audit, 'source-resolution.json'), '[]');
  const result = run('./apply-source-repairs.mjs', dir, ['--apply']);
  assert.equal(result.status, 0, result.stderr);
  const changed = JSON.parse(fs.readFileSync(path.join(dir, 'data/source-packs/test.json'))).sources[0];
  assert.equal(changed.id, 'DOI:10.9999/corrected'); assert.equal(changed.doi, '10.9999/corrected');
  assert.equal(changed.metadataReview.proposedRepairFingerprint, v.review.proposedRepairFingerprint);
  assert.ok(Number.isFinite(Date.parse(changed.metadataReview.appliedAt)));
  assert.equal(Object.hasOwn(changed.metadataReview, 'reviewedAt'), false);
});
test('null and malformed source arrays fail explicitly without being treated as research', t => {
  assert.equal(classifyBeforePubmed(null), 'MALFORMED_SOURCE');
  assert.equal(summarizeSourceCounts([null]).malformed, 1);
  assert.equal(summarizeSourceCounts([null]).human, 0);
  assert.equal(validateSourcePackData({ sources: { some: 'invalid' } }).valid, false);
  assert.equal(validateSourcePackData(packFor([null])).valid, false);
  const dir = temporary(t, [null]);
  const result = run('./verify-pack-sources.mjs', dir);
  assert.equal(result.status, 1); assert.match(result.stderr, /malformed source records/);
  const records = JSON.parse(fs.readFileSync(path.join(dir, '.planning/citation-audit/source-verification.json')));
  assert.equal(records[0].klass, 'MALFORMED_SOURCE');
  fs.writeFileSync(path.join(dir, 'data/source-packs/test.json'), JSON.stringify({ sources: {} }));
  const badArray = run('./verify-pack-sources.mjs', dir);
  assert.equal(badArray.status, 1); assert.match(badArray.stderr, /malformed source records/);
});
test('linked source-pack files cannot redirect repairs outside the source directory', t => {
  const dir = temporary(t), root = path.join(dir, 'data/source-packs');
  const outside = path.join(dir, 'outside.json'), linked = path.join(root, 'linked.json');
  fs.writeFileSync(outside, '{"fixture":true}');
  try { fs.symlinkSync(outside, linked, 'file'); }
  catch (error) { if (['EPERM', 'EACCES', 'ENOSYS'].includes(error.code)) { t.skip('Platform does not permit creating a file symlink for this fixture.'); return; } throw error; }
  assert.throws(() => safeSourcePackPath(linked, root), /Linked or non-regular/);
  assert.equal(fs.readFileSync(outside, 'utf8'), '{"fixture":true}');
});
test('incomplete FIX_META and FIX_DOI proposals never fall through to an unreviewed attachment', () => {
  for (const incomplete of [{ klass: 'METADATA_WRONG', realTitle: '' }, { klass: 'DOI_WRONG', realDoi: '' }]) {
    const resolution = { match: { pmid: '12345678', title: 'Candidate title', doi: '10.9999/candidate' } };
    const v = { ...incomplete, sourceFingerprint: sourceFingerprint(research), review: { decision: 'APPROVE_METADATA_REPAIR', reviewer: 'fixture reviewer', sourceFingerprint: sourceFingerprint(research), authorityUrl: 'https://pubmed.ncbi.nlm.nih.gov/37952131/', supportLocator: 'Fixture metadata', confirmedPmid: '12345678' } };
    v.review.proposedRepairFingerprint = repairPayloadFingerprint(v, resolution);
    assert.equal(decideSourceRepair(v, resolution, research).action, 'REVIEW');
    resolution.match.title = 'Unreviewed replacement'; resolution.match.doi = '10.9999/unreviewed';
    assert.equal(decideSourceRepair(v, resolution, research).action, 'REVIEW');
  }
});
test('duplicate approved targets including absolute/relative aliases cannot compose unreviewed mutations', t => {
  const source = { ...research, doi: '10.9999/original' };
  const dir = temporary(t, [source]), audit = path.join(dir, '.planning/citation-audit');
  const file = path.join(dir, 'data/source-packs/test.json'), original = fs.readFileSync(file, 'utf8');
  const first = { file: 'data/source-packs/test.json', index: 0, klass: 'DOI_WRONG', realDoi: '10.9999/approved', sourceFingerprint: sourceFingerprint(source),
    review: { decision: 'APPROVE_METADATA_REPAIR', reviewer: 'fixture reviewer', sourceFingerprint: sourceFingerprint(source), authorityUrl: 'https://pubmed.ncbi.nlm.nih.gov/37952131/', supportLocator: 'First reviewed target' } };
  first.review.proposedRepairFingerprint = repairPayloadFingerprint(first, null);
  const second = { ...first, file, klass: 'METADATA_WRONG', realTitle: 'Separately approved title', realDoi: undefined, review: { ...first.review } };
  second.review.proposedRepairFingerprint = repairPayloadFingerprint(second, null);
  fs.writeFileSync(path.join(audit, 'source-verification.json'), JSON.stringify([first, second]));
  fs.writeFileSync(path.join(audit, 'source-resolution.json'), '[]');
  const result = run('./apply-source-repairs.mjs', dir, ['--apply']);
  assert.equal(result.status, 1); assert.match(result.stderr, /Duplicate verification source target/);
  assert.equal(fs.readFileSync(file, 'utf8'), original);
  fs.writeFileSync(path.join(audit, 'source-verification.json'), JSON.stringify([first]));
  fs.writeFileSync(path.join(audit, 'source-resolution.json'), JSON.stringify([{ file: first.file, index: 0 }, { file, index: 0 }]));
  const resolutionDuplicate = run('./apply-source-repairs.mjs', dir, ['--apply']);
  assert.equal(resolutionDuplicate.status, 1); assert.match(resolutionDuplicate.stderr, /Duplicate resolution source target/);
  assert.equal(fs.readFileSync(file, 'utf8'), original);
});
test('real verify and repair CLIs preserve a document against stale NO_PMID/PHANTOM input', t => {
  const dir = temporary(t);
  const result = run('./verify-pack-sources.mjs', dir);
  assert.equal(result.status, 0, result.stderr);
  const audit = path.join(dir, '.planning/citation-audit');
  const records = JSON.parse(fs.readFileSync(path.join(audit, 'source-verification.json')));
  assert.equal(records[0].klass, 'DOCUMENT_REVIEW');
  records[0].klass = 'NO_PMID';
  fs.writeFileSync(path.join(audit, 'source-verification.json'), JSON.stringify(records));
  fs.writeFileSync(path.join(audit, 'source-resolution.json'), JSON.stringify([{ file: records[0].file, index: 0, verdict: 'PHANTOM' }]));
  const file = path.join(dir, 'data/source-packs/test.json'), before = fs.readFileSync(file, 'utf8');
  const repaired = run('./apply-source-repairs.mjs', dir, ['--apply']);
  assert.equal(repaired.status, 1); assert.equal(fs.readFileSync(file, 'utf8'), before);
  const plan = JSON.parse(fs.readFileSync(path.join(audit, 'source-repair-plan.json')));
  assert.equal(plan.counts.DOCUMENT_REVIEW, 1); assert.equal(plan.deletionAllowed, false);
  const resolved = run('./resolve-pack-sources.mjs', dir);
  assert.equal(resolved.status, 0, resolved.stderr);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(audit, 'source-resolution.json'))), []);
});
test('truncated PubMed search is PARTIAL and exact title candidate still requires review', t => {
  const source = { title: 'Fixture research candidate', year: 2024 };
  const dir = temporary(t, [source]);
  const audit = path.join(dir, '.planning/citation-audit');
  fs.writeFileSync(path.join(audit, 'source-verification.json'), JSON.stringify([{ file: 'data/source-packs/test.json', slug: 'test', index: 0, title: source.title, klass: 'NO_PMID', sourceFingerprint: sourceFingerprint(source) }]));
  fs.writeFileSync(path.join(dir, 'mock.mjs'), `globalThis.fetch = async input => { const url = new URL(input); if (url.pathname.includes('esearch')) return { ok: true, json: async () => ({ esearchresult: { count: '601', idlist: ['12345678'], querytranslation: 'fixture bounded alias' } }) }; return { ok: true, json: async () => ({ result: { uids: ['12345678'], '12345678': { title: 'Fixture research candidate', pubdate: '2024', articleids: [] } } }) }; };`);
  const result = run('./resolve-pack-sources.mjs', dir, [], true);
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, /PARTIAL:/);
  const records = JSON.parse(fs.readFileSync(path.join(audit, 'source-resolution.json')));
  assert.equal(records[0].verdict, 'REVIEW'); assert.equal(records[0].status, 'PARTIAL');
  const coverage = JSON.parse(fs.readFileSync(path.join(audit, 'source-resolution-coverage.json')));
  assert.equal(coverage.status, 'PARTIAL'); assert.equal(coverage.coverage.test.totalCount, 601);
});
test('missing PubMed summary is UNVERIFIED, never DEAD', t => {
  const dir = temporary(t, [research]);
  fs.writeFileSync(path.join(dir, 'mock.mjs'), `globalThis.fetch = async () => ({ ok: true, json: async () => ({ result: { uids: [] } }) });`);
  const result = run('./verify-pack-sources.mjs', dir, [], true);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /PubMed coverage incomplete/);
  const records = JSON.parse(fs.readFileSync(path.join(dir, '.planning/citation-audit/source-verification.json')));
  assert.equal(records[0].klass, 'UNVERIFIED');
});
