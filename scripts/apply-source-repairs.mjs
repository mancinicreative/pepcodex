/**
 * Prepare source-pack metadata repairs; --apply only applies individually reviewed,
 * fingerprint-matched corrections. Fuzzy/absent/missing results never delete records.
 * Shape and metadata checks are distinct from verification of a scientific claim.
 */
import fs from 'node:fs';
import path from 'node:path';
import { decideSourceRepair, safeSourcePackPath, summarizeSourceCounts } from './lib/source-records.mjs';

const APPLY = process.argv.includes('--apply');
const OUT_DIR = '.planning/citation-audit';
const verification = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'source-verification.json'), 'utf8'));
const resolution = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'source-resolution.json'), 'utf8'));
const key = record => {
  if (!Number.isSafeInteger(record.index) || record.index < 0) throw new Error('Audit source index must be a nonnegative integer.');
  const file = safeSourcePackPath(record.file);
  return `${process.platform === 'win32' ? file.toLowerCase() : file}#${record.index}`;
};
function assertUnique(records, label) {
  const seen = new Set();
  for (const record of records) {
    const id = key(record);
    if (seen.has(id)) throw new Error(`Duplicate ${label} source target; no repair was applied.`);
    seen.add(id);
  }
}
// Independent approvals for the same original record cannot be composed into an
// unreviewed combined mutation. Reject aliases too, before touching any pack.
assertUnique(verification, 'verification');
assertUnique(resolution, 'resolution');
const resolved = new Map(resolution.map(record => [key(record), record]));
const packs = new Map();
const decisions = [];
for (const record of verification) {
  const file = safeSourcePackPath(record.file);
  if (!packs.has(file)) packs.set(file, JSON.parse(fs.readFileSync(file, 'utf8')));
  const source = packs.get(file).sources?.[record.index];
  if (!source) { decisions.push({ ...record, action: 'REVIEW', why: 'Source index no longer exists.' }); continue; }
  decisions.push({ ...record, ...decideSourceRepair(record, resolved.get(key(record)), source) });
}
const changed = new Set();
const counts = {};
for (const decision of decisions) {
  counts[decision.action] = (counts[decision.action] || 0) + 1;
  if (!['FIX_DOI', 'FIX_META', 'ATTACH'].includes(decision.action)) continue;
  const file = safeSourcePackPath(decision.file);
  const source = packs.get(file).sources[decision.index];
  if (decision.action === 'FIX_DOI') {
    source.doi = decision.realDoi;
    if (/^DOI:/i.test(source.id || '')) source.id = `DOI:${decision.realDoi}`;
  }
  if (decision.action === 'FIX_META') {
    source.title = decision.realTitle;
    if (decision.realJournal) source.journal = decision.realJournal;
    if (/^\d{4}$/.test(String(decision.realYear))) source.year = Number(decision.realYear);
    if (decision.realAuthors) source.authors = source.type ? decision.realAuthors.split('; ') : decision.realAuthors;
    if (decision.realDoi) {
      source.doi = decision.realDoi;
      if (/^DOI:/i.test(source.id || '')) source.id = `DOI:${decision.realDoi}`;
    }
  }
  if (decision.action === 'ATTACH') {
    source.pmid = decision.match.pmid;
    if (/^PMID:/i.test(source.id || '')) source.id = `PMID:${decision.match.pmid}`;
    source.title = decision.match.title;
    if (decision.match.journal) source.journal = decision.match.journal;
    if (/^\d{4}$/.test(String(decision.match.year))) source.year = Number(decision.match.year);
    if (decision.match.authors) source.authors = source.type ? decision.match.authors.split('; ') : decision.match.authors;
    if (decision.match.doi) {
      source.doi = decision.match.doi;
      if (/^DOI:/i.test(source.id || '')) source.id = `DOI:${decision.match.doi}`;
    }
  }
  source.metadataReview = { appliedAt: new Date().toISOString(), reviewer: decision.review.reviewer, authorityUrl: decision.review.authorityUrl, supportLocator: decision.review.supportLocator, sourceFingerprint: decision.review.sourceFingerprint, proposedRepairFingerprint: decision.review.proposedRepairFingerprint, claimSupport: 'NOT_ASSESSED' };
  const reviewedAt = decision.review.reviewedAt;
  const date = typeof reviewedAt === 'string' && reviewedAt.match(/^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/);
  if (date && Number.isFinite(Date.parse(reviewedAt)) && new Date(Date.UTC(Number(date[1]), Number(date[2]) - 1, Number(date[3]))).toISOString().slice(0, 10) === reviewedAt.slice(0, 10)) source.metadataReview.reviewedAt = reviewedAt;
  changed.add(file);
}
if (APPLY) {
  for (const file of changed) {
    const pack = packs.get(file);
    if (pack.metadata?.sourceCounts) pack.metadata.sourceCounts = summarizeSourceCounts(pack.sources);
    fs.writeFileSync(file, JSON.stringify(pack, null, 2) + '\n');
  }
}
fs.mkdirSync(OUT_DIR, { recursive: true });
const plan = { checkedAt: new Date().toISOString(), mode: APPLY ? 'APPLY_REVIEWED_METADATA' : 'DRY_RUN', counts, changedFiles: APPLY ? [...changed] : [], proposedFiles: [...changed], deletionAllowed: false, claimSupport: 'NOT_ASSESSED', decisions };
fs.writeFileSync(path.join(OUT_DIR, 'source-repair-plan.json'), JSON.stringify(plan, null, 2) + '\n');
console.log(`${plan.mode}: ${JSON.stringify(counts)}; ${changed.size} reviewed metadata repair file(s); no sources deleted.`);
if (decisions.some(d => ['REVIEW', 'DOCUMENT_REVIEW'].includes(d.action))) {
  console.error('REVIEW_REQUIRED: unresolved records remain preserved. Read source-repair-plan.json; no full verification is claimed.');
  process.exitCode = 1;
}
