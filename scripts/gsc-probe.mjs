// Shared read-only access probe; exporters and URL inspection use this same module.
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createGoogleAccess, classifyGoogleError, loadEnvironment, safeError } from './lib/google-auth.mjs';
loadEnvironment();
let accessPromise;
export const googleAccess = () => accessPromise ??= createGoogleAccess();
export const mintToken = async () => (await googleAccess()).token();
export async function probe({ identityOnly = false, sitesOnly = false } = {}) {
  const access = await googleAccess();
  const report = { checkedAt: new Date().toISOString(), mode: access.mode, requestedScopes: access.requestedScopes, grantedScopes: access.grantedScopes, checks: {} };
  try {
    const user = await access.request('https://www.googleapis.com/oauth2/v2/userinfo');
    report.checks.identity = { status: 'SUCCESS', email: user.email ?? null };
  } catch (error) {
    report.checks.identity = { status: 'UNAVAILABLE', ...classifyGoogleError(error) };
    if (['REAUTH_REQUIRED', 'TOKEN_REJECTED'].includes(report.checks.identity.code)) throw error;
  }
  if (!identityOnly) {
    try {
      const data = await access.request('https://www.googleapis.com/webmasters/v3/sites');
      report.checks.gsc = { status: 'SUCCESS', properties: data.siteEntry ?? [] };
      if (!sitesOnly) {
        const sites = (process.env.GSC_SITE_URLS || 'https://pepcodex.com/,https://www.pepcodex.com/').split(',').map(s => s.trim()).filter(Boolean);
        report.checks.gsc.reads = [];
        const end = new Date(Date.now() - 4 * 86400000).toISOString().slice(0, 10);
        for (const site of sites) {
          if (!data.siteEntry?.some(entry => entry.siteUrl === site)) throw safeError('PROPERTY_PERMISSION', 'An expected GSC property is not visible. Check GSC_SITE_URLS and owner access.', 403);
          const sample = await access.request(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, { startDate: end, endDate: end, dimensions: [], dataState: 'final', type: 'web', rowLimit: 1 });
          report.checks.gsc.reads.push({ site, date: end, status: 'SUCCESS', rows: sample.rows?.length ?? 0 });
        }
      }
    } catch (error) {
      report.checks.gsc = { ...report.checks.gsc, status: 'FAILED', ...classifyGoogleError(error) };
      if (['REAUTH_REQUIRED', 'TOKEN_REJECTED'].includes(report.checks.gsc.code)) throw error;
    }
    if (!sitesOnly) {
      try {
        const property = process.env.GA4_PROPERTY_ID || '521749549';
        if (!/^\d+$/.test(property)) throw safeError('CLI_CONFIGURATION', 'Expected a numeric GA4 property ID, not a measurement ID.');
        const data = await access.request(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`, { dateRanges: [{ startDate: '7daysAgo', endDate: '3daysAgo' }], metrics: [{ name: 'sessions' }], limit: '1' });
        report.checks.ga4 = { status: 'SUCCESS', property, rowCount: data.rowCount ?? 0, metadata: data.metadata ?? null };
      } catch (error) { report.checks.ga4 = { status: 'FAILED', ...classifyGoogleError(error) }; }
    }
  }
  report.status = identityOnly ? report.checks.identity.status : Object.entries(report.checks).filter(([key]) => key !== 'identity').every(([,value]) => value.status === 'SUCCESS') ? 'SUCCESS' : 'FAILED';
  return report;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { const report = await probe(); console.log(JSON.stringify(report, null, 2)); if (report.status !== 'SUCCESS') process.exitCode = 1; }
  catch (error) { console.error(JSON.stringify(classifyGoogleError(error))); process.exitCode = 1; }
}
