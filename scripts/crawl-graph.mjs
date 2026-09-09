// Crawl-graph diagnostic loop.
//
// Builds the internal link graph from the BUILT output, computes click-depth from the
// homepage, optionally joins a dated GSC page export, and emits linking diagnostics.
// Impressions are observed search exposure, not index status. Snapshots distinguish
// graph changes from measurement changes; neither proves a causal traffic increase.
//
//   npm run build && node scripts/crawl-graph.mjs
//   node scripts/crawl-graph.mjs --compare      # diff against the previous snapshot
//   node scripts/crawl-graph.mjs --top=40
//
// The site's <=3 click policy is a local regression guard, not proof of Google crawl behavior.
import fs from 'fs';
import path from 'path';
import { loadMeasurement, pageMeasurement, comparableMeasurement, digest } from './crawl-graph-measurement.mjs';

// Data inputs are read-only. Select exactly one dated property, for example:
// --data-dir=.planning/data/runs/<run>-gsc --property=https://www.pepcodex.com/
// Without a valid measurement input, graph-only checks still run with UNKNOWN metrics.
const option = (name) => process.argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const DIST = option('dist') ?? path.join('dist', 'client');
const DATA = option('data-dir') ?? path.join('.planning', 'data', 'v2');
const OUTPUT = option('output-dir') ?? path.join('.planning', 'data', 'graph');
const SNAPDIR = path.join(OUTPUT, 'graph-snapshots');
const TOP = Number((process.argv.find((a) => a.startsWith('--top=')) || '').split('=')[1]) || 25;
const COMPARE = process.argv.includes('--compare');


// ---------- 1. build the graph ----------
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

if (!fs.existsSync(DIST)) {
  console.error(`ERROR: ${DIST} not found. Run \`npm run build\` first.`);
  process.exit(1);
}

const files = walk(DIST);
const toPath = (f) =>
  '/' + path.relative(DIST, f).replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\/$/, '');

const nodes = new Map(); // path -> { out:Set, in:Set, words, noindex, title }
for (const f of files) {
  const p = toPath(f) || '/';
  const html = fs.readFileSync(f, 'utf-8');
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const words = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  const noindex = /name="robots"[^>]*content="[^"]*noindex/i.test(html);
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]?.trim() ?? '';
  nodes.set(p, { out: new Set(), in: new Set(), words, noindex, title });
}

// Known non-page assets that legitimately live outside the HTML graph.
const ASSET_RE = /\.(xml|txt|json|png|jpg|jpeg|svg|webp|ico|pdf|css|js|woff2?|mp4|webm)$/i;
const broken = new Map(); // target -> Set(sources)

for (const f of files) {
  const from = toPath(f) || '/';
  const html = fs.readFileSync(f, 'utf-8');
  for (const m of html.matchAll(/<a[^>]+href="(\/[^"#?]*)"/g)) {
    const to = m[1].replace(/\/$/, '') || '/';
    if (to === from) continue;
    if (!nodes.has(to)) {
      // A link to a path that produced no page. This is the class of defect that
      // shipped /protocols/undefined to production as a live 404 — the graph could not
      // see it, because a target that does not exist has no node to be orphaned.
      if (ASSET_RE.test(to) || fs.existsSync(path.join(DIST, to.replace(/^\//, '')))) continue;
      if (!broken.has(to)) broken.set(to, new Set());
      broken.get(to).add(from);
      continue;
    }
    nodes.get(from).out.add(to);
    nodes.get(to).in.add(from);
  }
}

// ---------- 2. click depth (BFS from /) ----------
const depth = new Map([['/', 0]]);
let frontier = ['/'];
while (frontier.length) {
  const next = [];
  for (const cur of frontier) {
    for (const nb of nodes.get(cur)?.out ?? []) {
      if (!depth.has(nb)) {
        depth.set(nb, depth.get(cur) + 1);
        next.push(nb);
      }
    }
  }
  frontier = next;
}

// ---------- 3. join to real search data ----------
const search = loadMeasurement({ dataDir: DATA, property: option('property') });
const { seen: _seen, ...measurement } = search;

const rows = [...nodes.entries()].map(([p, n]) => {
  return {
    path: p,
    depth: depth.get(p) ?? null, // null = unreachable by link from home
    inbound: n.in.size,
    outbound: n.out.size,
    words: n.words,
    noindex: n.noindex,
    ...pageMeasurement(search, p),
  };
});

// ---------- 4. problem classes ----------
const indexable = rows.filter((r) => !r.noindex);
const orphans = indexable.filter((r) => r.inbound === 0);
const unreachable = indexable.filter((r) => r.depth === null);
const deep = indexable.filter((r) => r.depth !== null && r.depth >= 4);
const silentDeep = indexable.filter((r) => r.silent && (r.depth === null || r.depth >= 3));
const deadEnds = indexable.filter((r) => r.outbound <= 1);
const thin = indexable.filter((r) => r.words < 300);

const depthDist = {};
for (const r of indexable) {
  const k = r.depth === null ? 'unreachable' : String(r.depth);
  depthDist[k] = (depthDist[k] || 0) + 1;
}

// silent rate per depth — the key diagnostic
const byDepth = {};
for (const r of indexable) {
  const k = r.depth === null ? 'unreachable' : String(r.depth);
  byDepth[k] ??= { n: 0, observed: 0, unknown: 0, silent: 0, impr: 0 };
  byDepth[k].n++;
  if (r.impressions === null) byDepth[k].unknown++;
  else byDepth[k].observed++;
  if (r.silent) byDepth[k].silent++;
  byDepth[k].impr += r.impressions;
}

console.log('================ CRAWL GRAPH ================');
console.log(`pages in build      ${rows.length}`);
console.log(`indexable           ${indexable.length}   (noindex: ${rows.length - indexable.length})`);
console.log(`measurement         ${measurement.status}: ${measurement.reason}`);
if (measurement.scope) console.log(`scope               ${JSON.stringify(measurement.scope)}`);
if (measurement.provenance.legacyScopeAssumptions) console.log(`legacy provenance   ${measurement.provenance.legacyScopeAssumptions}`);
console.log(`observed zero impr  ${search.seen.size ? indexable.filter((r) => r.silent === true).length : 'UNKNOWN (no observed rows)'}`);
console.log(`unknown impressions ${indexable.filter((r) => r.impressions === null).length}`);

console.log('\n---- CLICK DEPTH vs SILENCE (the core signal) ----');
console.log('DEPTH         PAGES  UNKNOWN  ZERO  % zero observed  OBSERVED IMPRESSIONS');
for (const k of Object.keys(byDepth).sort((a, b) => (a === 'unreachable' ? 1 : b === 'unreachable' ? -1 : +a - +b))) {
  const v = byDepth[k];
  console.log(
    String(k).padEnd(13) + String(v.n).padStart(6) + String(v.unknown).padStart(9) + String(v.silent).padStart(6) +
      String(v.observed ? ((v.silent / v.observed) * 100).toFixed(0) + '%' : 'UNKNOWN').padStart(18) + String(v.observed ? v.impr : 'UNKNOWN').padStart(22)
  );
}

// ---- broken internal links (highest severity: these are live 404s for users) ----
const brokenTotal = [...broken.values()].reduce((a, s) => a + s.size, 0);
if (broken.size) {
  console.log('\n---- BROKEN INTERNAL LINKS (live 404s) ----');
  console.log(`  ${broken.size} distinct dead targets across ${brokenTotal} link instances`);
  [...broken.entries()]
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, TOP)
    .forEach(([target, srcs]) => {
      console.log(`  ${String(srcs.size).padStart(4)}x  ${target}`);
      [...srcs].slice(0, 2).forEach((s) => console.log(`          from ${s}`));
    });
} else {
  console.log('\n---- BROKEN INTERNAL LINKS ----\n  none');
}

console.log('\n---- PROBLEM CLASSES ----');
const line = (l, a) => console.log(`  ${l.padEnd(42)} ${String(a.length).padStart(5)}`);
line('orphans (0 inbound links)', orphans);
line('unreachable from homepage by links', unreachable);
line('deep (>=4 clicks from home)', deep);
if (indexable.some((r) => r.impressions !== null)) line('observed zero AND deep/unreachable', silentDeep);
else console.log('  observed zero AND deep/unreachable        UNKNOWN');
line('dead ends (<=1 outbound link)', deadEnds);
line('thin (<300 words)', thin);

if (orphans.length) {
  console.log('\n---- ORPHANS (nothing links to these) ----');
  orphans.slice(0, TOP).forEach((r) => console.log(`  d${String(r.depth ?? '-').padStart(2)}  ${r.words}w  ${r.path}`));
}

if (unreachable.length) {
  console.log('\n---- UNREACHABLE BY LINK FROM HOMEPAGE ----');
  unreachable.slice(0, TOP).forEach((r) => console.log(`  in:${String(r.inbound).padStart(4)}  ${r.words}w  ${r.path}`));
}

console.log('\n---- WORST OFFENDERS (silent + deep + valuable) ----');
silentDeep
  .filter((r) => r.words >= 500)
  .sort((a, b) => b.words - a.words)
  .slice(0, TOP)
  .forEach((r) =>
    console.log(`  depth ${String(r.depth ?? 'X').padStart(2)}  in:${String(r.inbound).padStart(4)}  ${String(r.words).padStart(5)}w  ${r.path}`)
  );

// ---------- 5. snapshot + trend ----------
fs.mkdirSync(SNAPDIR, { recursive: true });
const summary = {
  pages: rows.length,
  indexable: indexable.length,
  observedPages: rows.filter((r) => r.impressions !== null).length,
  unknownPages: rows.filter((r) => r.impressions === null).length,
  silent: indexable.some((r) => r.impressions !== null) ? indexable.filter((r) => r.silent === true).length : null,
  brokenTargets: broken.size,
  brokenLinkInstances: brokenTotal,
  lowInbound: indexable.filter((r) => r.inbound <= 2).length,
  orphans: orphans.length,
  unreachable: unreachable.length,
  deep: deep.length,
  silentDeep: indexable.some((r) => r.impressions !== null) ? silentDeep.length : null,
  medianDepth: (() => {
    const d = indexable.map((r) => r.depth).filter((x) => x !== null).sort((a, b) => a - b);
    return d.length ? d[Math.floor(d.length / 2)] : null;
  })(),
  // Observed built-page sums, never property totals or a complete cohort baseline.
  observedImpressions: rows.some((r) => r.impressions !== null) ? rows.reduce((a, r) => a + (r.impressions ?? 0), 0) : null,
  observedClicks: rows.some((r) => r.clicks !== null) ? rows.reduce((a, r) => a + (r.clicks ?? 0), 0) : null,
};

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const snapshot = { schemaVersion: 2, generatedAt: new Date().toISOString(), graphCohort: digest(JSON.stringify(rows.map((r) => [r.path, r.noindex]).sort())), measurement, summary, rows };
const previousFiles = fs.readdirSync(SNAPDIR).filter((f) => f.endsWith('.json')).sort();
fs.writeFileSync(path.join(SNAPDIR, `graph-${stamp}.json`), JSON.stringify(snapshot, null, 2));
fs.writeFileSync(path.join(OUTPUT, 'graph-latest.json'), JSON.stringify(snapshot, null, 2));

if (COMPARE) {
  if (previousFiles.length) {
    const previous = JSON.parse(fs.readFileSync(path.join(SNAPDIR, previousFiles.at(-1)), 'utf-8'));
    const prev = previous.summary;
    const comparable = comparableMeasurement(previous, snapshot);
    const analyticsKeys = new Set(['silent', 'silentDeep', 'observedPages', 'unknownPages', 'observedImpressions', 'observedClicks']);
    console.log(`\n---- CHANGE vs ${previousFiles.at(-1)} ----`);
    if (!comparable) console.log('  Measurement comparison SKIPPED: unavailable or different property/window/scope/page cohort. Graph changes only.');
    else console.log('  Same-window measurement changes describe observed export coverage, not click growth caused by this graph change.');
    for (const k of Object.keys(summary)) {
      if (!comparable && analyticsKeys.has(k)) continue;
      const a = prev[k], b = summary[k];
      if (typeof a !== 'number' || typeof b !== 'number' || a === b) continue;
      const d = b - a;
      // Metrics where LOWER is better. Everything else (impressions, clicks) improves upward.
      const lowerIsBetter = [
        'silent', 'orphans', 'unreachable', 'deep', 'silentDeep', 'medianDepth',
        'brokenTargets', 'brokenLinkInstances', 'lowInbound',
      ];
      const direction = analyticsKeys.has(k) || !lowerIsBetter.includes(k) ? 'changed' : d < 0 ? 'better' : 'WORSE';
      console.log(`  ${k.padEnd(20)} ${String(a).padStart(6)} -> ${String(b).padStart(6)}  ${d > 0 ? '+' : ''}${d}  ${direction}`);
    }
  } else {
    console.log('\n(only one snapshot so far — run again after changes to see a trend)');
  }
}

console.log(`\nsnapshot: ${path.join(SNAPDIR, `graph-${stamp}.json`)}`);
console.log('re-run after any linking change with --compare to see whether it helped.');

// ---------- 6. regression gate ----------
// `--check` makes this a CI/pre-commit guard rather than a report. Broken internal links and
// orphans are defects that were fixed once and must not silently return — every one of them
// reached production by looking correct in review.
if (process.argv.includes('--check')) {
  const failures = [];
  if (!nodes.has('/')) failures.push('homepage is missing from the built HTML graph');
  if (broken.size > 0) {
    failures.push(`${brokenTotal} broken internal link(s) across ${broken.size} dead target(s)`);
    [...broken.entries()].slice(0, 10).forEach(([t, s]) => failures.push(`    ${t}  <- ${[...s][0]}`));
  }
  // Two orphans are intentional and permanently excluded: a 301 redirect target and the
  // Search Console verification file. Anything beyond those is a real regression.
  const INTENTIONAL_ORPHANS = new Set(['/glossary/off-label']);
  const realOrphans = orphans.filter((r) => !INTENTIONAL_ORPHANS.has(r.path) && !/^\/google[0-9a-f]+\.html$/.test(r.path));
  if (realOrphans.length) {
    failures.push(`${realOrphans.length} orphan page(s) with no inbound links`);
    realOrphans.slice(0, 10).forEach((r) => failures.push(`    ${r.path}`));
  }
  if (deep.length) failures.push(`${deep.length} page(s) more than 3 clicks from the homepage`);
  const realUnreachable = unreachable.filter((r) => !INTENTIONAL_ORPHANS.has(r.path) && !/^\/google[0-9a-f]+\.html$/.test(r.path));
  if (realUnreachable.length) {
    failures.push(`${realUnreachable.length} page(s) unreachable from homepage (including isolated link cycles)`);
    realUnreachable.slice(0, 10).forEach((r) => failures.push(`    ${r.path}`));
  }

  if (failures.length) {
    console.error('\n❌ GRAPH CHECK FAILED');
    failures.forEach((f) => console.error(`  ${f}`));
    process.exit(1);
  }
  console.log('\n✅ GRAPH CHECK PASSED — no broken links, no unintended orphans/unreachable pages, nothing deeper than 3 clicks');
}
if (process.argv.includes('--require-measurement') && measurement.status !== 'AVAILABLE') {
  console.error(`\nMEASUREMENT CHECK FAILED: ${measurement.status}`);
  process.exitCode = 1;
}
