import { createHash } from 'node:crypto';
import { searchSurveillance, fetchSurveillanceRecords } from './pubmed.mjs';
import { isRelevant } from './matchers.mjs';
import { trialIntegrity } from './trial-integrity.mjs';

const DAY = 86400000;
export const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const shiftDate = (date, days) => new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY).toISOString().slice(0,10);
export function windowFrom({ watermark, end, days = null, overlap = 14 }) {
  // Dossier lastUpdated is deliberately not an input. An editorial edit is not a registry scan.
  return days !== null ? shiftDate(end, -(days - 1)) : watermark ? shiftDate(watermark, -overlap) : shiftDate(end, -89);
}

/** Only evidence-reviewed same-compound aliases enter discovery. Existing trial alias lists also
 * contain parent compounds and combinations, so they are candidates, not identity evidence.
 */
export function selectAliases(subject, evidence = []) {
  const validated = evidence.filter(x => x.status === 'validated' && x.relationship === 'same-compound'
    && typeof x.alias === 'string' && /^https:\/\//.test(x.sourceUrl || '') && x.supportLocator && x.reviewedAt && x.reviewer);
  const aliases = [...new Set([subject.name, ...validated.map(x => x.alias)])];
  return { aliases, evidence: validated, quarantined: (subject.aliases || []).filter(x => !aliases.includes(x)).map(alias => ({ alias, reason: 'Identity not independently validated for this subject; not searched as a synonym' })) };
}

export async function fetchTrialPages({ alias, from, to, request, pageSize = 100 }) {
  const records = {}, pages = [], tokens = new Set();
  let token = null, total = null, error = null;
  try {
    do {
      const url = new URL('https://clinicaltrials.gov/api/v2/studies');
      url.searchParams.set('query.intr', alias);
      url.searchParams.set('filter.advanced', `AREA[LastUpdatePostDate]RANGE[${from},${to}]`);
      url.searchParams.set('pageSize', String(pageSize));
      url.searchParams.set('countTotal', 'true');
      if (token) url.searchParams.set('pageToken', token);
      const j = await request(url.href, 'json');
      if (!Array.isArray(j.studies)) throw new Error('Missing ClinicalTrials.gov studies array');
      if (total === null) {
        if (!Number.isSafeInteger(j.totalCount) || j.totalCount < 0) throw new Error('Missing ClinicalTrials.gov totalCount');
        total = j.totalCount;
      } else if (j.totalCount !== undefined && total !== j.totalCount) throw new Error('Trial count changed during pagination');
      pages.push({ requestedToken: token, retrieved: j.studies.length, nextPageToken: j.nextPageToken ?? null, totalCount: j.totalCount ?? null });
      const before = Object.keys(records).length;
      for (const st of j.studies) {
        const id = st.protocolSection?.identificationModule?.nctId;
        if (!/^NCT\d{8}$/.test(id || '')) throw new Error('Malformed trial ID');
        records[id] = st;
      }
      token = j.nextPageToken || null;
      if (token && (tokens.has(token) || Object.keys(records).length === before)) throw new Error('Trial pagination stalled/repeated token');
      if (token) tokens.add(token);
    } while (token);
    if (Object.keys(records).length !== total) throw new Error(`Incomplete trial pagination: received ${Object.keys(records).length}/${total}`);
  } catch (e) { error = e.message; }
  return { alias, from, to, total, pages, records, complete: !error, error };
}

/** Administrative contact/location/verification edits are not evidence changes. Keep complete raw
 * snapshots, while comparing status, enrollment type, design, interventions, outcomes and results.
 */
export function trialResults(st) {
  const hasResultsSignal = typeof st.hasResults === 'boolean' ? st.hasResults : null;
  const resultsPayloadAvailable = Boolean(st.resultsSection && typeof st.resultsSection === 'object' && !Array.isArray(st.resultsSection));
  return { hasResultsSignal, resultsPayloadAvailable,
    resultsPosted: hasResultsSignal ?? (resultsPayloadAvailable ? true : null),
    resultsAvailabilityStatus: hasResultsSignal === false && resultsPayloadAvailable ? 'SIGNAL_PAYLOAD_CONFLICT'
      : resultsPayloadAvailable ? 'PAYLOAD_AVAILABLE' : hasResultsSignal === true ? 'POSTED_SIGNAL_WITHOUT_PAYLOAD'
        : hasResultsSignal === false ? 'NO_POSTED_RESULTS_SIGNAL' : 'UNKNOWN' };
}
export function trialMaterial(st) {
  const p = st.protocolSection || {}, s = p.statusModule || {};
  return { briefTitle: p.identificationModule?.briefTitle ?? null, officialTitle: p.identificationModule?.officialTitle ?? null,
    descriptions: Object.fromEntries(['briefSummary', 'detailedDescription'].map(key => [key,
      typeof p.descriptionModule?.[key] === 'string' ? p.descriptionModule[key].replace(/\s+/g, ' ').trim() : null])),
    recordIntegrity: trialIntegrity(st),
    conditions: p.conditionsModule ?? null, overallStatus: s.overallStatus ?? null, whyStopped: s.whyStopped ?? null,
    start: s.startDateStruct ?? null, primaryCompletion: s.primaryCompletionDateStruct ?? null, completion: s.completionDateStruct ?? null,
    design: p.designModule ?? null, interventions: p.armsInterventionsModule ?? null,
    outcomes: p.outcomesModule ?? null, eligibility: p.eligibilityModule ?? null,
    ...trialResults(st), results: st.resultsSection ?? null,
    resultsFirstPost: s.resultsFirstPostDateStruct ?? null, references: p.referencesModule?.references ?? [],
  };
}
export function trialSummary(st, provenance = null) {
  const p = st.protocolSection, s = p.statusModule || {};
  return { nctId: p.identificationModule.nctId, title: p.identificationModule.briefTitle || '', acronym: p.identificationModule.acronym || '',
    status: s.overallStatus || '', phase: (p.designModule?.phases || []).join('/'),
    enrollment: p.designModule?.enrollmentInfo?.count ?? null, enrollmentType: p.designModule?.enrollmentInfo?.type ?? null,
    ...trialResults(st), publications: p.referencesModule?.references ?? [],
    conditions: p.conditionsModule?.conditions || [], interventions: (p.armsInterventionsModule?.interventions || []).map(x => x.name),
    lastUpdate: s.lastUpdatePostDateStruct?.date || '', recordIntegrity: trialIntegrity(st),
    rawProvenance: provenance, evidenceEligibility: 'UNREVIEWED_CANDIDATE',
  };
}
const paperMaterial = r => ({ title: r.title, abstract: r.abstract, doi: r.doi, pubTypes: r.pubTypes, relationships: r.relationships,
  publicationDates: r.publicationDates ?? null, pubdate: r.pubdate ?? null,
  firstAuthor: r.firstAuthor ?? null, firstAuthorStatus: r.firstAuthorStatus ?? (r.firstAuthor ? 'present' : 'unknown'),
  journal: r.journal ?? null, bookTitle: r.bookTitle ?? null, recordType: r.recordType ?? null,
});

/** A same-ID file is usable only if its identity and actual review evidence match the packet.
 * Merely existing on disk is not proof an interrupted earlier write finished successfully.
 */
export function validateImpactPacket(existing, expected) {
  for (const key of ['packetId', 'subject', 'kind', 'id', 'fingerprint', 'transitionRevision', 'previousFingerprint']) {
    if (existing?.[key] !== expected[key]) throw new Error(`Existing impact packet ${expected.packetId} has invalid ${key}`);
  }
  const isTrial = /^NCT\d{8}$/.test(expected.id);
  const material = isTrial ? existing.record?.material : existing.record && paperMaterial(existing.record);
  if (isTrial && (hash(existing.record?.recordIntegrity) !== hash(expected.record?.recordIntegrity)
    || existing.record?.evidenceEligibility !== expected.record?.evidenceEligibility)) {
    throw new Error(`Existing impact packet ${expected.packetId} has missing or mismatched integrity review fields`);
  }
  if (!existing.record || (isTrial ? existing.record.nctId : existing.record.pmid) !== expected.id
      || !material || hash(material) !== expected.fingerprint || existing.reviewRequired !== true
      || !Array.isArray(existing.dependentFiles) || typeof existing.observedAt !== 'string') {
    throw new Error(`Existing impact packet ${expected.packetId} has incomplete or mismatched review evidence`);
  }
}
export function dueKnown(ids, checked, end, limit = 100, interval = 30) {
  return [...new Set(ids)].filter(id => !checked[id] || checked[id] <= shiftDate(end, -interval))
    .sort((a,b) => (checked[a] || '').localeCompare(checked[b] || '') || a.localeCompare(b)).slice(0, limit);
}

export async function scanSubject(subject, prior = {}, options) {
  const { request, end, days = null, overlap = 14, knownLimit = 100, recheckDays = 30, aliasEvidence = [] } = options;
  const state = structuredClone({ watermarks: {}, papers: {}, trials: {}, checkedPmids: {}, checkedNcts: {}, emitted: {}, ...prior });
  const selection = selectAliases(subject, aliasEvidence);
  const out = { schemaVersion: 2, slug: subject.slug, name: subject.name, scannedAt: end, scanEnd: end,
    scope: 'PubMed creation/revision queries and CT.gov updates for named aliases; rotating cited-ID rechecks. Not full-text or regulatory surveillance.',
    aliasEvidence: selection.evidence, queriedAliases: [], quarantinedAliases: selection.quarantined,
    newPapers: [], newTrials: [], updatedTrials: [], correctedPapers: [], impactPackets: [],
    queryCoverage: [], errors: [], counts: { retrievedPapers: 0, knownPapersRetrieved: 0, filteredOut: 0, unchangedPapers: 0, unchangedTrials: 0, integrityFlaggedTrials: 0 },
  };
  const queried = [], discoveredPmids = new Set(), trialRecords = {};
  for (const alias of selection.aliases) {
    for (const field of ['crdt', 'lr']) {
      const key = `pubmed:${field}:${hash(alias)}`, from = windowFrom({ watermark: state.watermarks[key], end, days, overlap });
      const result = await searchSurveillance({ alias, field, from, to: end, request });
      out.queryCoverage.push({ source: 'pubmed', key, ...result });
      out.queriedAliases.push({ alias, field, total: result.total, retrieved: result.ids.length, complete: result.complete });
      result.ids.forEach(id => discoveredPmids.add(id));
      queried.push({ key, complete: result.complete, from });
      if (!result.complete) out.errors.push({ source: 'pubmed', key, error: result.error || 'Incomplete query' });
    }
    const key = `ctgov:update:${hash(alias)}`, from = windowFrom({ watermark: state.watermarks[key], end, days, overlap });
    const trials = await fetchTrialPages({ alias, from, to: end, request });
    const { records, ...coverage } = trials;
    out.queryCoverage.push({ source: 'ctgov', key, ...coverage });
    Object.assign(trialRecords, records);
    queried.push({ key, complete: trials.complete, from });
    if (!trials.complete) out.errors.push({ source: 'ctgov', key, error: trials.error });
  }
  out.windowFrom = queried.map(q => q.from).sort()[0] ?? null;
  // A count imbalance is a review flag, never a scientific identity verdict.
  for (const q of out.queriedAliases.filter(q => q.alias !== subject.name)) {
    const primary = out.queriedAliases.find(x => x.alias === subject.name && x.field === q.field);
    if (primary?.complete && q.total > Math.max(15, primary.total * 10)) out.quarantinedAliases.push({ alias: q.alias, field: q.field, reason: 'Count imbalance requires semantic review; retrieved candidates retained for review' });
  }
  const knownPmids = new Set(subject.knownPmids || []), knownNcts = new Set(subject.knownNcts || []);
  const globallyKnownPmids = new Set(subject.knownAcrossSitePmids || []);
  const globallyKnownNcts = new Set(subject.knownAcrossSiteNcts || []);
  const pmidDue = dueKnown([...knownPmids], state.checkedPmids, end, knownLimit, recheckDays);
  const nctDue = dueKnown([...knownNcts], state.checkedNcts, end, knownLimit, recheckDays);
  out.knownCoverage = { totalPmids: knownPmids.size, selectedPmids: pmidDue, totalNcts: knownNcts.size, selectedNcts: nctDue,
    duePmidsRemaining: dueKnown([...knownPmids], state.checkedPmids, end, Infinity, recheckDays).length - pmidDue.length,
    dueNctsRemaining: dueKnown([...knownNcts], state.checkedNcts, end, Infinity, recheckDays).length - nctDue.length, recheckDays,
  };
  const fetched = await fetchSurveillanceRecords([...new Set([...discoveredPmids, ...pmidDue])], { request });
  out.errors.push(...fetched.failures.map(f => ({ source: 'pubmed-fetch', ...f })));
  out.counts.retrievedPapers = Object.keys(fetched.records).length;
  function emit(kind, id, material, record, transitionRevision, previousFingerprint) {
    const fingerprint = hash(material), packetId = hash([subject.slug, kind, id, transitionRevision, previousFingerprint, fingerprint]);
    if (state.emitted[packetId]) return;
    out.impactPackets.push({ packetId, subject: subject.slug, kind, id, fingerprint, transitionRevision, previousFingerprint, observedAt: end,
      dependentFiles: subject.referenceFiles?.[id] || [], reviewRequired: true, record });
    state.emitted[packetId] = end;
  }
  for (const [id, record] of Object.entries(fetched.records)) {
    const known = knownPmids.has(id) || globallyKnownPmids.has(id), previous = state.papers[id], material = paperMaterial(record), fingerprint = hash(material);
    // Recompute from retained citation data when upgrading the material contract; adding watched
    // metadata must not invent a change when the previous observation already had the same data.
    const previousFingerprint = previous?.record ? hash(paperMaterial(previous.record)) : previous?.fingerprint ?? null;
    const revision = (previous?.revision || 0) + (previousFingerprint === fingerprint ? 0 : 1);
    record.discoveryLanes = out.queryCoverage.filter(q => q.source === 'pubmed' && q.ids.includes(id)).map(q => ({ field: q.field, alias: q.alias, from: q.from, to: q.to }));
    if (known) { out.counts.knownPapersRetrieved++; state.checkedPmids[id] = end; }
    if (!known && !isRelevant(selection.aliases, `${record.title} ${record.abstract}`.toLowerCase())) { out.counts.filteredOut++; continue; }
    const alert = record.relationships.some(x => /erratum|retract|expressionofconcern|corrected|update/i.test(x.type)) || record.pubTypes.some(x => /retract|erratum|expression of concern/i.test(x));
    if (previousFingerprint === fingerprint) out.counts.unchangedPapers++;
    else if (alert || (known && previous)) {
      out.correctedPapers.push({ ...record, changeKind: alert ? 'CITATION_ALERT_REQUIRES_REVIEW' : 'CITED_RECORD_CHANGED' });
      emit(alert ? 'CITATION_ALERT' : 'CITED_RECORD_CHANGED', id, material, record, revision, previousFingerprint);
    } else if (!known) { out.newPapers.push(record); emit('NEW_PAPER', id, material, record, revision, previousFingerprint); }
    state.papers[id] = { fingerprint, revision, record, observedAt: end };
  }
  for (const id of nctDue) {
    if (trialRecords[id]) continue;
    try {
      const record = await request(`https://clinicaltrials.gov/api/v2/studies/${id}`, 'json');
      if (record.protocolSection?.identificationModule?.nctId !== id) throw new Error('Known NCT response identity mismatch');
      trialRecords[id] = record;
    } catch (e) { out.errors.push({ source: 'ctgov-known', id, error: e.message }); }
  }
  for (const [id, record] of Object.entries(trialRecords)) {
    const previous = state.trials[id], material = trialMaterial(record), fingerprint = hash(material), summary = trialSummary(record, request.provenanceFor?.(record) ?? null), known = knownNcts.has(id) || globallyKnownNcts.has(id);
    const previousFingerprint = previous?.fingerprint ?? null;
    const revision = (previous?.revision || 0) + (previousFingerprint === fingerprint ? 0 : 1);
    summary.identityStatus = known ? 'CITED_ID_REQUIRES_SUPPORT_REVIEW' : 'QUERY_CANDIDATE_REQUIRES_IDENTITY_REVIEW';
    const flagged = summary.recordIntegrity.signals.length > 0;
    const cleared = !flagged && Boolean(previous?.material?.recordIntegrity?.signals?.length);
    if (flagged) out.counts.integrityFlaggedTrials++;
    const integrityHold = flagged || Boolean(previous?.integrityHold) || cleared;
    if (integrityHold) summary.evidenceEligibility = 'HOLD_FOR_INTEGRITY_REVIEW';
    if (!flagged && integrityHold) summary.integrityReviewReason = 'MARKER_REMOVED_REVALIDATION_REQUIRED';
    const integrityKind = flagged ? (known ? 'CITED_RECORD_INTEGRITY_ALERT' : 'TRIAL_RECORD_INTEGRITY_ALERT')
      : integrityHold ? 'TRIAL_INTEGRITY_REVALIDATION' : null;
    if (known) state.checkedNcts[id] = end;
    if (previous?.fingerprint === fingerprint) out.counts.unchangedTrials++;
    else if (previous || known) {
      const changeKind = integrityKind || (previous ? 'MATERIAL_TRIAL_CHANGE' : 'CITED_TRIAL_BASELINE_REVIEW');
      out.updatedTrials.push({ ...summary, changeKind });
      emit(changeKind, id, material, { ...summary, material }, revision, previousFingerprint);
    } else { out.newTrials.push(summary); emit(integrityKind || 'NEW_TRIAL', id, material, { ...summary, material }, revision, previousFingerprint); }
    state.trials[id] = { fingerprint, revision, material, integrityHold, observedAt: end };
  }
  const successfulQueries = queried.filter(q => q.complete).length;
  out.status = out.errors.length ? (successfulQueries || out.counts.retrievedPapers || Object.keys(trialRecords).length ? 'PARTIAL' : 'FAILED')
    : out.impactPackets.length ? 'SUCCESS_CHANGES' : 'SUCCESS_ZERO';
  out.partialQuery = out.errors.length > 0;
  // Successful discovery can also recheck a known ID outside the rotating slice. Report the
  // actual remaining due set; on a failed subject all uncommitted checks remain due for retry.
  out.knownCoverage.duePmidsRemaining = dueKnown([...knownPmids], out.partialQuery ? (prior.checkedPmids || {}) : state.checkedPmids, end, Infinity, recheckDays).length;
  out.knownCoverage.dueNctsRemaining = dueKnown([...knownNcts], out.partialQuery ? (prior.checkedNcts || {}) : state.checkedNcts, end, Infinity, recheckDays).length;
  out.filteredOut = out.counts.filteredOut;
  out.watermarksAdvanced = !out.partialQuery;
  // Persist subject state only after every requested source and record batch succeeds. A partial
  // run can expose findings, but cannot make a failed window or unseen correction disappear.
  if (!out.partialQuery) for (const q of queried) state.watermarks[q.key] = end;
  return { output: out, nextState: out.partialQuery ? prior : state };
}

export function renderSummary(outputs, runId, end) {
  return [`# Research surveillance ${runId}`, '', `Bounded scan end: ${end} (UTC). Subjects attempted: ${outputs.length}.`,
    'SUCCESS refers only to the exact queries and selected known IDs below; quarantined aliases and rotating backlog are not covered. No result is a medical conclusion.', '',
    '| Subject | Status | From | New papers | Citation changes | New trials | Trial changes | Errors | Known PMID backlog | Known NCT backlog | Quarantined aliases |',
    '|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...outputs.map(o => `| ${o.slug} | ${o.status} | ${o.windowFrom} | ${o.newPapers.length} | ${o.correctedPapers.length} | ${o.newTrials.length} | ${o.updatedTrials.length} | ${o.errors.length} | ${o.knownCoverage.duePmidsRemaining} | ${o.knownCoverage.dueNctsRemaining} | ${o.quarantinedAliases.length} |`), '',
    ...outputs.flatMap(o => o.errors.map(e => `- ${o.slug}: ${e.source}: ${e.error}`)), '',
    'Trial totals are review candidates, not verified studies. Inspect per-subject integrityFlaggedTrials, recordIntegrity and rawProvenance before any evidence use. Marker removal requires revalidation.',
    'Inspect per-subject JSON for query translations, warnings, retrieved identifiers, missing batches and identity-review candidates. Raw HTTP responses are retained in this run.', ''].join('\n');
}
