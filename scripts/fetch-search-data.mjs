// Pulls Google Search Console + GA4 data into .planning/data/ for offline analysis.
//
// Auth (either mode):
//   1. User ADC — `gcloud auth application-default login` (default here; the org
//      policy iam.disableServiceAccountKeyCreation blocks downloadable SA keys)
//   2. Service-account key via GOOGLE_APPLICATION_CREDENTIALS
//
// Config:
//   GSC_SITE_URLS   -> comma-separated properties (see --list-sites)
//   GA4_PROPERTY_ID -> numeric property id (NOT the G-XXXX measurement id)
//
// Modes:
//   node scripts/fetch-search-data.mjs --whoami       # which Google account am I?
//   node scripts/fetch-search-data.mjs --list-sites   # enumerate visible GSC properties
//   node scripts/fetch-search-data.mjs --gsc          # Search Console only
//   node scripts/fetch-search-data.mjs --ga4          # GA4 only
//   node scripts/fetch-search-data.mjs                # both
//   ...--months=16                                    # lookback (GSC max 16)
//
// Writes JSON + CSV per dataset. .planning/data/ is gitignored.
import fs from 'fs';
import path from 'path';

// Astro loads .env automatically; a plain node script does not. Load it here so
// `npm run fetch:search` works from a normal checkout without extra flags.
// Existing process.env values win, so CI/shell overrides still apply.
function loadDotEnv(file = '.env') {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue; // skips blanks and # comments
    const key = m[1];
    if (process.env[key] !== undefined && process.env[key] !== '') continue;
    let val = m[2].trim().replace(/\s+#.*$/, '');
    if (/^(['"]).*\1$/s.test(val)) val = val.slice(1, -1);
    if (val !== '') process.env[key] = val;
  }
}
loadDotEnv();

const OUT_DIR = path.join('.planning', 'data');
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const argVal = (name, dflt) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : dflt;
};

const MONTHS = Math.min(Number(argVal('months', 16)) || 16, 16);
const infoOnly = has('--list-sites') || has('--whoami');
const wantGsc = has('--gsc') || (!has('--ga4') && !infoOnly);
const wantGa4 = has('--ga4') || (!has('--gsc') && !infoOnly);

const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const GA4_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
// Requested purely so `--whoami` can confirm WHICH Google account is authenticated.
// With several Google accounts in play, logging in as the wrong one is the most
// common failure: it succeeds, then silently shows zero properties.
const USERINFO_SCOPE = 'https://www.googleapis.com/auth/userinfo.email';
// cloud-platform is deliberately NOT requested. Neither Search Console nor the GA4
// Data API is a Cloud API, and including it subjects the credential to Google Cloud
// session control — a 16-hour default reauth clock on Workspace/Cloud Identity
// accounts that forces an interactive browser login roughly daily and would silently
// break any headless run. Omitting the scope avoids that subsystem entirely.
const LOGIN_SCOPES = [GSC_SCOPE, GA4_SCOPE, USERINFO_SCOPE].join(',');
// Login MUST supply our own OAuth client. gcloud's shared ADC client
// (764086051850-...) is registered only for Google Cloud scopes, so requesting
// webmasters/analytics through it returns "This app is blocked" — gcloud says so in
// its own log before the browser even opens. See .planning/GOOGLE-API-SETUP.md.
//
// Quoting is mandatory: PowerShell 5.1 splits unquoted comma-separated arguments.
const OAUTH_CLIENT_FILE =
  process.env.GCP_OAUTH_CLIENT_FILE || 'C:\\Users\\manci\\.gcp\\pepcodex-oauth-client.json';
const LOGIN_CMD =
  `gcloud auth application-default login --client-id-file="${OAUTH_CLIENT_FILE}" --scopes="${LOGIN_SCOPES}"`;

// ---------- helpers ----------
function die(msg, hint) {
  console.error(`\n  ERROR  ${msg}`);
  if (hint) console.error(`         ${hint}`);
  process.exit(1);
}

function ymd(d) {
  return d.toISOString().slice(0, 10);
}

function dateRange(months) {
  const end = new Date();
  end.setDate(end.getDate() - 2); // GSC lags ~2 days
  const start = new Date(end);
  start.setMonth(start.getMonth() - months);
  return { start: ymd(start), end: ymd(end) };
}

function ensureOut() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function writeJson(name, data) {
  const p = path.join(OUT_DIR, `${name}.json`);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
  return p;
}

function writeCsv(name, rows, columns) {
  if (!rows.length) return null;
  const cols = columns ?? Object.keys(rows[0]);
  const esc = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
  const p = path.join(OUT_DIR, `${name}.csv`);
  fs.writeFileSync(p, csv);
  return p;
}

function slug(s) {
  return s.replace(/^sc-domain:/, 'domain-').replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '').toLowerCase();
}

// Two supported auth modes, in priority order:
//   1. Service-account key  (GOOGLE_APPLICATION_CREDENTIALS)
//   2. User ADC from `gcloud auth application-default login`
// Mode 2 is the fallback when an org policy blocks service-account key creation
// (iam.disableServiceAccountKeyCreation, now on by default for new orgs). It
// authenticates as the human, who already owns the GSC/GA4 properties — so it
// also removes the need to grant access to a robot account at all.
let AUTH_MODE = null; // set by checkCreds(); used to tailor error hints

function adcPath() {
  const appData = process.env.APPDATA || path.join(process.env.HOME ?? '', '.config');
  return path.join(appData, 'gcloud', 'application_default_credentials.json');
}

function checkCreds() {
  const key = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (key) {
    if (!fs.existsSync(key)) die(`Credentials file not found: ${key}`);
    AUTH_MODE = 'service-account';
    return { mode: AUTH_MODE, path: key };
  }
  const adc = adcPath();
  if (fs.existsSync(adc)) {
    AUTH_MODE = 'user-adc';
    return { mode: AUTH_MODE, path: adc };
  }

  die(
    'No Google credentials found.',
    `Run:  ${LOGIN_CMD}` +
      '\n         (or set GOOGLE_APPLICATION_CREDENTIALS to a service-account key)' +
      '\n         Full walkthrough: .planning/GOOGLE-API-SETUP.md'
  );
}

// Confirms which Google identity the stored credentials belong to, before we
// trust any data pulled with them.
async function whoami() {
  const { mode, path: credPath } = checkCreds();
  const { google } = await import('googleapis');
  const auth = new google.auth.GoogleAuth({ scopes: [USERINFO_SCOPE] });

  console.log(`\n  auth mode:   ${mode}`);
  console.log(`  credentials: ${credPath}`);

  if (mode === 'service-account') {
    const j = JSON.parse(fs.readFileSync(credPath, 'utf-8'));
    console.log(`  identity:    ${j.client_email}`);
    console.log(`  project:     ${j.project_id}\n`);
    return;
  }

  try {
    const client = await auth.getClient();
    const res = await client.request({ url: 'https://www.googleapis.com/oauth2/v3/userinfo' });
    console.log(`  SIGNED IN AS: ${res.data.email}`);
    console.log(`  verified:     ${res.data.email_verified ? 'yes' : 'no'}`);
  } catch {
    console.log('  SIGNED IN AS: (unknown — the userinfo.email scope was not granted)');
    console.log(`  To enable this check, re-run:\n    ${LOGIN_CMD}`);
  }

  const j = JSON.parse(fs.readFileSync(credPath, 'utf-8'));
  console.log(`  quota project: ${j.quota_project_id ?? '(none — run: gcloud auth application-default set-quota-project <ID>)'}\n`);
}

// User ADC tokens carry the scopes granted at login; passing scopes here is a
// no-op for them. Surface that clearly instead of letting it fail as a raw 403.
function scopeHint(mode) {
  return mode === 'user-adc'
    ? '\n         Your gcloud login may lack the needed scope. Re-run:' +
      `\n         ${LOGIN_CMD}`
    : '';
}

// ---------- Search Console ----------
async function gscClient() {
  const { google } = await import('googleapis');
  const auth = new google.auth.GoogleAuth({ scopes: [GSC_SCOPE] });
  return google.searchconsole({ version: 'v1', auth });
}

async function listSites() {
  checkCreds();
  const sc = await gscClient();
  const res = await sc.sites.list();
  const sites = res.data.siteEntry ?? [];
  if (!sites.length) {
    die(
      'Zero Search Console properties visible.',
      (AUTH_MODE === 'user-adc'
        ? 'This Google account owns no GSC properties — did you log in as the right one?'
        : 'Add the service-account email as a user in Search Console > Settings > Users and permissions, on EACH property.') +
        scopeHint(AUTH_MODE)
    );
  }
  console.log(`\n  Search Console properties visible (auth: ${AUTH_MODE}) — ${sites.length}:\n`);
  for (const s of sites) {
    console.log(`    ${s.siteUrl}`);
    console.log(`      permission: ${s.permissionLevel}`);
  }
  console.log(`\n  Set them in .env:\n    GSC_SITE_URLS=${sites.map((s) => s.siteUrl).join(',')}\n`);
  return sites;
}

// GSC caps at 25k rows/request; page through with startRow.
async function gscQuery(sc, siteUrl, { start, end, dimensions, searchType = 'web' }) {
  const ROW_LIMIT = 25000;
  const rows = [];
  let startRow = 0;
  for (;;) {
    let res;
    try {
      res = await sc.searchanalytics.query({
        siteUrl,
        requestBody: { startDate: start, endDate: end, dimensions, rowLimit: ROW_LIMIT, startRow, type: searchType },
      });
    } catch (err) {
      const code = err?.code ?? err?.response?.status;
      if (code === 403) {
        die(
          `403 on "${siteUrl}" — no read access to this property.`,
          (AUTH_MODE === 'user-adc'
            ? 'Your Google account is not a user on this Search Console property.'
            : 'Search Console > Settings > Users and permissions > Add user (Restricted is enough).') +
            scopeHint(AUTH_MODE)
        );
      }
      throw err;
    }
    const batch = res.data.rows ?? [];
    rows.push(...batch);
    if (batch.length < ROW_LIMIT) break;
    startRow += ROW_LIMIT;
  }
  return rows.map((r) => {
    const out = {};
    dimensions.forEach((d, i) => { out[d] = r.keys[i]; });
    out.clicks = r.clicks;
    out.impressions = r.impressions;
    out.ctr = Number((r.ctr * 100).toFixed(3));
    out.position = Number(r.position.toFixed(2));
    return out;
  });
}

async function fetchGsc() {
  checkCreds();
  const raw = process.env.GSC_SITE_URLS;
  if (!raw) {
    die('GSC_SITE_URLS is not set.', 'Run `node scripts/fetch-search-data.mjs --list-sites` to discover them.');
  }
  const sites = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const sc = await gscClient();
  const { start, end } = dateRange(MONTHS);
  console.log(`\n  Search Console — ${start} to ${end} (${MONTHS} months), ${sites.length} propert${sites.length === 1 ? 'y' : 'ies'}`);

  const CUTS = [
    { name: 'by-date', dimensions: ['date'] },
    { name: 'by-page', dimensions: ['page'] },
    { name: 'by-query', dimensions: ['query'] },
    { name: 'by-page-query', dimensions: ['page', 'query'] },
    { name: 'by-device', dimensions: ['device'] },
    { name: 'by-country', dimensions: ['country'] },
  ];

  const summary = [];
  for (const site of sites) {
    const tag = slug(site);
    console.log(`\n    ${site}`);
    for (const cut of CUTS) {
      const rows = await gscQuery(sc, site, { start, end, dimensions: cut.dimensions });
      const base = `gsc-${tag}-${cut.name}`;
      writeJson(base, { site, range: { start, end }, dimensions: cut.dimensions, rowCount: rows.length, rows });
      writeCsv(base, rows);
      const clicks = rows.reduce((a, r) => a + r.clicks, 0);
      const impr = rows.reduce((a, r) => a + r.impressions, 0);
      console.log(`      ${cut.name.padEnd(14)} ${String(rows.length).padStart(7)} rows` +
        (cut.name === 'by-date' ? `   clicks=${clicks}  impressions=${impr}` : ''));
      if (cut.name === 'by-date') summary.push({ site, clicks, impressions: impr, days: rows.length });
    }
  }

  if (summary.length > 1) {
    console.log(`\n  Property split (this is the apex-vs-www question):`);
    const totC = summary.reduce((a, s) => a + s.clicks, 0) || 1;
    for (const s of summary) {
      console.log(`    ${s.site.padEnd(38)} clicks=${String(s.clicks).padStart(7)} (${((s.clicks / totC) * 100).toFixed(1)}%)  impressions=${s.impressions}`);
    }
  }
  return summary;
}

// ---------- GA4 ----------
async function fetchGa4() {
  checkCreds();
  const propId = process.env.GA4_PROPERTY_ID;
  if (!propId) {
    die(
      'GA4_PROPERTY_ID is not set.',
      'GA4 Admin > Property Settings > Property ID. Numeric (e.g. 421234567) — NOT the G-XXXXXXXX measurement id.'
    );
  }
  if (/^G-/i.test(propId)) {
    die(
      `GA4_PROPERTY_ID is "${propId}" — that's a measurement id, not a property id.`,
      'Use the numeric Property ID from GA4 Admin > Property Settings.'
    );
  }

  const { BetaAnalyticsDataClient } = await import('@google-analytics/data');
  const client = new BetaAnalyticsDataClient();
  const { start, end } = dateRange(MONTHS);
  console.log(`\n  GA4 — property ${propId}, ${start} to ${end}`);

  const REPORTS = [
    {
      name: 'landing-pages',
      dimensions: ['landingPagePlusQueryString'],
      metrics: ['sessions', 'engagedSessions', 'engagementRate', 'averageSessionDuration', 'bounceRate', 'screenPageViews'],
      limit: 5000,
    },
    {
      name: 'channels',
      dimensions: ['sessionDefaultChannelGroup'],
      metrics: ['sessions', 'engagedSessions', 'engagementRate', 'totalUsers'],
      limit: 100,
    },
    {
      name: 'daily',
      dimensions: ['date'],
      metrics: ['sessions', 'totalUsers', 'engagementRate', 'screenPageViews'],
      limit: 1000,
    },
    {
      name: 'events',
      dimensions: ['eventName'],
      metrics: ['eventCount', 'totalUsers'],
      limit: 200,
    },
    {
      name: 'devices',
      dimensions: ['deviceCategory'],
      metrics: ['sessions', 'engagementRate', 'bounceRate'],
      limit: 50,
    },
    {
      name: 'country',
      dimensions: ['country'],
      metrics: ['sessions', 'engagedSessions', 'bounceRate', 'averageSessionDuration'],
      limit: 50,
    },
    {
      name: 'hostname',
      dimensions: ['hostName'],
      metrics: ['sessions', 'bounceRate'],
      limit: 30,
    },
    {
      name: 'sources',
      dimensions: ['sessionSource'],
      metrics: ['sessions', 'engagedSessions', 'bounceRate', 'averageSessionDuration'],
      limit: 80,
    },
    {
      name: 'referrer',
      dimensions: ['pageReferrer'],
      metrics: ['sessions', 'bounceRate', 'averageSessionDuration'],
      limit: 100,
    },
  ];

  for (const rep of REPORTS) {
    let response;
    try {
      [response] = await client.runReport({
        property: `properties/${propId}`,
        dateRanges: [{ startDate: start, endDate: end }],
        dimensions: rep.dimensions.map((name) => ({ name })),
        metrics: rep.metrics.map((name) => ({ name })),
        limit: rep.limit,
      });
    } catch (err) {
      const msg = String(err?.message ?? err);
      // User ADC needs a billing/quota project attached; service accounts don't.
      if (/quota project|user project|USER_PROJECT_DENIED/i.test(msg)) {
        die(
          'GA4 rejected the request: no quota project attached to your credentials.',
          'Run:  gcloud auth application-default set-quota-project <YOUR_PROJECT_ID>' +
            '\n         (the GCP project where you enabled the Analytics Data API)'
        );
      }
      if (/PERMISSION_DENIED|403/.test(msg)) {
        die(
          `GA4 permission denied on property ${propId}.`,
          (AUTH_MODE === 'user-adc'
            ? 'Your Google account lacks Viewer on this GA4 property — or the property id is wrong.'
            : 'GA4 Admin > Property Access Management > add the service-account email as Viewer.') +
            scopeHint(AUTH_MODE)
        );
      }
      if (/API has not been used|SERVICE_DISABLED/.test(msg)) {
        die('The Google Analytics Data API is not enabled in this GCP project.', 'Enable "Google Analytics Data API" in the console.');
      }
      throw err;
    }

    const rows = (response.rows ?? []).map((r) => {
      const out = {};
      rep.dimensions.forEach((d, i) => { out[d] = r.dimensionValues[i].value; });
      rep.metrics.forEach((m, i) => {
        const v = r.metricValues[i].value;
        out[m] = Number.isNaN(Number(v)) ? v : Number(v);
      });
      return out;
    });

    const base = `ga4-${rep.name}`;
    writeJson(base, { propertyId: propId, range: { start, end }, rowCount: rows.length, rows });
    writeCsv(base, rows);
    console.log(`    ${rep.name.padEnd(14)} ${String(rows.length).padStart(6)} rows`);

    if (rep.name === 'events') {
      // The custom events in src/scripts/analytics.ts only matter if they actually land.
      const expected = ['search', 'comparison_click', 'newsletter_signup', 'external_link_click', 'scroll_depth'];
      const seen = new Set(rows.map((r) => r.eventName));
      const missing = expected.filter((e) => !seen.has(e));
      if (missing.length) {
        console.log(`      NOTE custom events defined in code but absent from GA4: ${missing.join(', ')}`);
      }
    }
  }
}

// ---------- main ----------
(async () => {
  ensureOut();
  try {
    if (has('--whoami')) {
      await whoami();
      return;
    }
    if (has('--list-sites')) {
      // Show the identity first — if it's the wrong Google account, the property
      // list below is the symptom and this line is the cause.
      await whoami().catch(() => {});
      await listSites();
      return;
    }
    if (wantGsc) await fetchGsc();
    if (wantGa4) await fetchGa4();
    console.log(`\n  Done. Data in ${OUT_DIR}/\n`);
  } catch (err) {
    console.error('\n  UNEXPECTED ERROR');
    console.error(err?.stack ?? err);
    process.exit(1);
  }
})();
