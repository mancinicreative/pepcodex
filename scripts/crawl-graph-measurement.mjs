// A page export reports observed rows, not an index census. Missing rows stay unknown.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const digest = (value) => createHash('sha256').update(value).digest('hex');
const propertyKey = (value) => value?.replace(/\/$/, '');
const tag = (value) => value.replace(/^sc-domain:/, 'domain-').replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '').toLowerCase();
const dateOK = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value).toISOString().slice(0, 10) === value;

export function loadMeasurement({ dataDir, property }) {
  const provenance = { dataDir: path.resolve(dataDir), requestedProperty: property ?? null };
  const unavailable = (status, reason) => ({ status, reason, provenance, seen: new Map(), scope: null });
  if (!property) return unavailable('UNAVAILABLE', 'Select one GSC property with --property=URL; properties are never summed.');
  try {
    const manifestFile = path.join(dataDir, 'manifest.json');
    if (!fs.existsSync(manifestFile)) return unavailable('UNAVAILABLE', 'Dated manifest.json is missing.');
    const manifestBytes = fs.readFileSync(manifestFile);
    const manifest = JSON.parse(manifestBytes);
    const selected = Object.keys(manifest.properties ?? {}).filter((key) => propertyKey(key) === propertyKey(property));
    if (selected.length !== 1) return unavailable('INVALID', 'Requested property is missing or ambiguous in manifest.');
    const site = selected[0];
    if (site.startsWith('sc-domain:')) return unavailable('INVALID', 'Domain exports require a host-specific cut; use a URL-prefix property.');
    if (!['pepcodex.com', 'www.pepcodex.com'].includes(new URL(site).hostname)) return unavailable('INVALID', 'Property is not a supported PepCodex host.');
    const details = manifest.properties[site];
    const modern = manifest.schemaVersion === 2;
    const cut = details.cuts?.page;
    if (modern && cut?.status !== 'COMPLETE') return unavailable('INVALID', 'Selected page cut is not COMPLETE.');
    if (modern && manifest.scope?.site !== site) return unavailable('INVALID', 'Manifest scope does not match selected property.');
    const startDate = details.requested?.startDate ?? details.first;
    const endDate = details.requested?.endDate ?? details.last;
    if (!dateOK(startDate) || !dateOK(endDate) || startDate > endDate) return unavailable('INVALID', 'Valid, ordered measurement dates are required.');
    if (modern && (manifest.scope.startDate !== startDate || manifest.scope.endDate !== endDate)) return unavailable('INVALID', 'Manifest dates disagree with the selected page cut.');
    if (!manifest.pulledAt || !Number.isFinite(Date.parse(manifest.pulledAt))) return unavailable('INVALID', 'Valid pulledAt provenance is required.');
    const file = path.resolve(dataDir, cut?.file ?? `gsc-${tag(site)}-page.json`);
    const relative = path.relative(path.resolve(dataDir), file);
    if (relative.startsWith('..') || path.isAbsolute(relative)) return unavailable('INVALID', 'Page file must be inside selected data directory.');
    if (!fs.existsSync(file)) return unavailable('UNAVAILABLE', 'Selected page export is missing.');
    const bytes = fs.readFileSync(file);
    const sha256 = digest(bytes);
    if (modern && (!cut.sha256 || cut.sha256 !== sha256)) return unavailable('INVALID', 'Page export hash does not match manifest.');
    const rows = JSON.parse(bytes);
    if (!Array.isArray(rows)) return unavailable('INVALID', 'Page export must be an array.');
    if (modern && cut.rows !== rows.length) return unavailable('INVALID', 'Page row count does not match manifest.');
    const seen = new Map();
    for (const row of rows) {
      if (!row || typeof row.page !== 'string' || !Number.isFinite(row.impressions) || !Number.isFinite(row.clicks) || row.impressions < 0 || row.clicks < 0 || row.clicks > row.impressions) return unavailable('INVALID', 'Malformed page row or metrics; no rows joined.');
      const url = new URL(row.page);
      // Never collapse hosts or query variants into canonical graph paths.
      if (!row.page.startsWith(site.endsWith('/') ? site : `${site}/`)) return unavailable('INVALID', 'Page row lies outside selected property.');
      if (!['pepcodex.com', 'www.pepcodex.com'].includes(url.hostname)) return unavailable('INVALID', 'Property is not a supported PepCodex host.');
      if (url.search || url.hash) continue; // Query variants are not silently merged with canonical paths.
      const key = url.pathname.replace(/\/$/, '') || '/';
      if (seen.has(key)) return unavailable('INVALID', 'Duplicate normalized page rows; no implicit variant aggregation.');
      seen.set(key, { i: row.impressions, c: row.clicks });
    }
    const scope = { property: site, startDate, endDate, dimensions: ['page'], searchType: modern ? manifest.scope.type : 'web', dataState: modern ? manifest.scope.dataState : 'final', timezone: modern ? manifest.scope.timezone : 'America/Los_Angeles', filters: manifest.scope?.filters ?? null, provenanceVersion: modern ? 2 : 'legacy-inferred' };
    if (!scope.searchType || !scope.dataState || !scope.timezone) return unavailable('INVALID', 'Measurement scope metadata is incomplete.');
    Object.assign(provenance, { manifestFile: path.resolve(manifestFile), manifestSha256: digest(manifestBytes), pageFile: file, pageSha256: sha256, pulledAt: manifest.pulledAt, exportedRows: rows.length, joinedPaths: seen.size, legacyScopeAssumptions: modern ? null : 'web/final/Pacific from historical gsc-repull.mjs; legacy manifest does not bind file hash' });
    return { status: 'AVAILABLE', reason: 'Observed page rows only; absent rows are UNKNOWN, not zero or evidence of non-indexation.', provenance, scope, seen };
  } catch {
    return unavailable('INVALID', 'Cannot validate measurement input; check manifest structure, dates and selected files.');
  }
}

export function pageMeasurement(measurement, page) {
  const found = measurement.seen.get(page);
  return found ? { impressions: found.i, clicks: found.c, silent: found.i === 0, measurement: 'OBSERVED' } : { impressions: null, clicks: null, silent: null, measurement: measurement.status === 'AVAILABLE' ? 'NOT_RETURNED' : measurement.status };
}

export function comparableMeasurement(previous, current) {
  return previous?.measurement?.status === 'AVAILABLE' && current?.measurement?.status === 'AVAILABLE' &&
    JSON.stringify(previous.measurement.scope) === JSON.stringify(current.measurement.scope) &&
    previous.graphCohort === current.graphCohort;
}
