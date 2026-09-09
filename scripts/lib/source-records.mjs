import { createHash } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';

export const isDocumentSource = source => ['regulatory', 'reference'].includes(source?.type || source?.sourceType);
export const sourcePmid = source => {
  if (isDocumentSource(source)) return null;
  const value = String(source?.pmid || String(source?.id || '').match(/^PMID:(\d+)$/i)?.[1] || '').trim();
  return /^\d{1,9}$/.test(value) ? value : null;
};
export const sourceDoi = source => isDocumentSource(source) ? null : source?.doi || String(source?.id || '').match(/^DOI:(.+)$/i)?.[1] || null;
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
export const sourceFingerprint = source => createHash('sha256').update(JSON.stringify(canonical(source))).digest('hex');
export function safeSourcePackPath(file, root = path.resolve('data/source-packs')) {
  const resolved = path.resolve(file);
  const comparable = value => process.platform === 'win32' ? value.toLowerCase() : value;
  if (comparable(path.dirname(resolved)) !== comparable(root) || !resolved.endsWith('.json')) throw new Error('Source audit record does not reference a direct source-pack JSON file.');
  const stat = fs.lstatSync(resolved);
  if (stat.isSymbolicLink() || !stat.isFile()) throw new Error('Linked or non-regular source-pack files are not eligible for automatic repair.');
  if (comparable(path.dirname(fs.realpathSync(resolved))) !== comparable(fs.realpathSync(root))) throw new Error('Resolved source-pack path escapes the approved source-pack directory.');
  return resolved;
}
export function classifyBeforePubmed(source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return 'MALFORMED_SOURCE';
  if (isDocumentSource(source)) return 'DOCUMENT_REVIEW';
  if (!sourcePmid(source)) return 'EXTERNAL_SOURCE_REVIEW';
  return null;
}
export function summarizeSourceCounts(sources) {
  const counts = { total: sources.length, human: 0, preclinical: 0, openAccess: 0, regulatory: 0, reference: 0, malformed: 0 };
  for (const source of sources) {
    if (classifyBeforePubmed(source) === 'MALFORMED_SOURCE') { counts.malformed++; continue; }
    if (source.openAccess === true) counts.openAccess++;
    if (isDocumentSource(source)) { counts[source.type || source.sourceType]++; continue; }
    if (source.subjects === 'human') counts.human++;
    if (['animal', 'in-vitro'].includes(source.subjects)) counts.preclinical++;
  }
  return counts;
}
// Fuzzy matching proposes candidates. It cannot establish nonexistence or identity.
export function resolutionVerdict(candidate, coverageComplete) {
  return { verdict: candidate && candidate.score >= 0.35 ? 'REVIEW' : 'UNRESOLVED', status: coverageComplete ? 'SEARCH_COMPLETE_REVIEW_REQUIRED' : 'PARTIAL', automaticAttachmentAllowed: false };
}
// Bind review to the proposed target as well as the current source. Regenerating
// resolver/verification outputs after review must invalidate that old approval.
export function repairPayloadFingerprint(verification, resolution) {
  if (verification.klass === 'DOI_WRONG') return sourceFingerprint({ action: 'FIX_DOI', doi: verification.realDoi });
  if (verification.klass === 'METADATA_WRONG') return sourceFingerprint({ action: 'FIX_META', title: verification.realTitle, journal: verification.realJournal, year: verification.realYear, authors: verification.realAuthors, doi: verification.realDoi });
  return sourceFingerprint({ action: 'ATTACH', match: resolution?.match ?? null });
}
// No deletion from a failed lookup, absence, fuzzy match, or legacy PHANTOM verdict.
// Metadata edits require a fresh record fingerprint and explicit independent review.
export function decideSourceRepair(verification, resolution, source) {
  if (isDocumentSource(source)) return { action: 'DOCUMENT_REVIEW', why: 'Official/reference document requires authority and claim review, not PubMed repair.' };
  const fingerprint = sourceFingerprint(source);
  if (verification.sourceFingerprint !== fingerprint) return { action: 'REVIEW', why: 'Missing or stale source fingerprint; rerun verification.' };
  if (verification.klass === 'OK') return { action: 'KEEP', why: 'Metadata candidate retained; no claim-verification stamp added.' };
  const review = verification.review;
  if (!review || review.decision !== 'APPROVE_METADATA_REPAIR' || review.sourceFingerprint !== fingerprint || !review.reviewer || !review.supportLocator || !/^https:\/\//.test(review.authorityUrl || '')) return { action: 'REVIEW', why: 'Independent source/identity review is required before metadata repair.' };
  if (review.proposedRepairFingerprint !== repairPayloadFingerprint(verification, resolution)) return { action: 'REVIEW', why: 'The exact proposed repair payload is missing review or changed after approval.' };
  // Class-specific proposals cannot fall through to a different action whose
  // target was not included in the reviewed payload fingerprint.
  if (verification.klass === 'DOI_WRONG') return typeof verification.realDoi === 'string' && verification.realDoi.trim()
    ? { action: 'FIX_DOI' } : { action: 'REVIEW', why: 'DOI correction payload is incomplete; attachment is not authorized by this review.' };
  if (verification.klass === 'METADATA_WRONG') return typeof verification.realTitle === 'string' && verification.realTitle.trim()
    ? { action: 'FIX_META' } : { action: 'REVIEW', why: 'Metadata correction payload is incomplete; attachment is not authorized by this review.' };
  // Resolvers never authorize attachment. Review must name the independently checked PMID.
  if (resolution?.match?.pmid && review.confirmedPmid === resolution.match.pmid) return { action: 'ATTACH', match: resolution.match };
  return { action: 'REVIEW', why: 'No independently approved metadata correction; preserve source for investigation.' };
}
