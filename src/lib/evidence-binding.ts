import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import matter from 'gray-matter';
import {presentEvidence} from './evidence-presentation';

const hash = (bytes: Uint8Array | string) => createHash('sha256').update(bytes).digest('hex');
const fail = (message: string): never => { throw new Error(`Selected evidence binding: ${message}`); };
const plain = (x: unknown): x is Record<string, any> => x !== null && typeof x === 'object' && !Array.isArray(x);
const stable = (value: any): string => JSON.stringify(value, (_key, v) => plain(v) ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
export function canonicalEvidenceSource(bytes: Uint8Array): string {
  // Version utf8-lf-v1: strict UTF-8, CRLF to LF only. No trimming or prose changes.
  return new TextDecoder('utf-8', {fatal: true, ignoreBOM: true}).decode(bytes).replace(/\r\n/g, '\n');
}
function regularFile(root: string, relative: string): Buffer {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || relative.includes('\\') || relative.split('/').some(p => p === '..' || p === '.' || !p)) fail('Invalid bound path');
  let current = root;
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    const stat = fs.lstatSync(current);
    if (stat.isSymbolicLink()) fail(`Linked bound path: ${relative}`);
  }
  if (!fs.statSync(current).isFile()) fail(`Not a regular bound file: ${relative}`);
  return fs.readFileSync(current);
}

export function loadEvidencePresentation(subjectId: string, data: any, root = process.cwd()) {
  const registryPath = 'data/evidence-display/registry.json';
  // Registry is an installed build dependency, including for unassigned controls.
  // Its disappearance must not downgrade formerly selected content to legacy.
  const registryBytes = regularFile(root, registryPath);
  const registry = JSON.parse(canonicalEvidenceSource(registryBytes));
  if (!plain(registry) || registry.version !== 1 || registry.normalization !== 'utf8-lf-v1' || !plain(registry.records)) fail('Unsupported registry');
  // Version 1 is the reviewed two-subject adoption. Removing an entry must not
  // let stale caller data downgrade an assigned source to the legacy path.
  const boundSubjects = ['testagen', 'vilon'];
  if (Object.keys(registry.records).length !== boundSubjects.length || boundSubjects.some(id => !plain(registry.records[id]) || registry.records[id].subjectId !== id))
    fail('Required reviewed subject registry entry missing or mismatched');
  const entry = registry.records[subjectId];
  if (entry === undefined && data?.evidenceDisplay === undefined) return presentEvidence(data);
  if (!plain(entry) || entry.subjectId !== subjectId || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(subjectId)) fail('Subject identity missing or mismatched');
  if (data?.evidenceDisplay?.subjectId !== subjectId) fail('Display belongs to another subject or is missing');
  const raw = regularFile(root, `src/content/peptides/${subjectId}.mdx`);
  if (hash(canonicalEvidenceSource(raw)) !== entry.sourceSha256) fail('Adopted source changed');
  const parsed = matter(canonicalEvidenceSource(raw)).data;
  for (const key of ['sources', 'scoreReview', 'evidenceDisplay']) if (stable(parsed[key]) !== stable(data[key])) fail(`Parsed ${key} differs from bound source`);
  const reviewBytes = regularFile(root, entry.reviewManifestPath);
  // The same explicit text normalization applies to this checked-in JSON as to
  // MDX: Git CRLF conversion is harmless, every other byte change remains bound.
  const reviewText = canonicalEvidenceSource(reviewBytes);
  if (hash(reviewText) !== entry.reviewManifestSha256) fail('Review manifest changed');
  const review = JSON.parse(reviewText);
  if (!plain(review) || review.version !== 1 || !plain(review.records)) fail('Unsupported review manifest');
  const record = review.records[subjectId];
  if (!plain(record) || record.subjectId !== subjectId || record.sourceReviewId !== data.evidenceDisplay.sourceReviewId || record.sourceSha256 !== entry.sourceSha256) fail('Review/corpus identity mismatch');
  if (!Array.isArray(record.evidence) || !record.evidence.length || record.evidence.some((e: any) => !plain(e) || typeof e.path !== 'string' || !/^[a-f0-9]{64}$/.test(e.sha256))) fail('Missing owner review/source evidence hashes');
  return presentEvidence(data);
}
