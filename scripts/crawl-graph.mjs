// Crawl-graph diagnostic loop.
//
// Builds the internal link graph from the BUILT output, computes click-depth from the
// homepage, joins it to real GSC index status, and emits a prioritised worklist of the
// pages Google cannot or will not reach. Snapshots each run so successive runs show
// whether the situation is improving.
//
//   npm run build && node scripts/crawl-graph.mjs
//   node scripts/crawl-graph.mjs --compare      # diff against the previous snapshot
//   node scripts/crawl-graph.mjs --top=40
//
// Why click-depth: Google allocates crawl by perceived importance, and depth from the
// homepage is one of the strongest proxies it uses. Pages >3 clicks deep on a
// low-authority domain are routinely never fetched — which is exactly this site's problem.
import fs from 'fs';
import path from 'path';

const DIST = path.join('dist', 'client');
const V2 = path.join('.planning', 'data', 'v2');
const SNAPDIR = path.join(V2, 'graph-snapshots');
const TOP = Number((process.argv.find((a) => a.startsWith('--top=')) || '').split('=')[1]) || 25;
const COMPARE = process.argv.includes('--compare');

const load = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')) : []);
const norm = (u) => u.replace(/^https?:\/\/(www\.)?pepcodex\.com/, '').replace(/\/$/, '') || '/';

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
const seen = new Map(); // path -> {impressions, clicks}
for (const tag of ['pepcodex-com', 'www-pepcodex-com']) {
  for (const r of load(path.join(V2, `gsc-${tag}-page.json`))) {
    const k = norm(r.page);
    const cur = seen.get(k) ?? { i: 0, c: 0 };
    cur.i += r.impressions;
    cur.c += r.clicks;
    seen.set(k, cur);
  }
}

const rows = [...nodes.entries()].map(([p, n]) => {
  const s = seen.get(p);
  return {
    path: p,
    depth: depth.get(p) ?? null, // null = unreachable by link from home
    inbound: n.in.size,
    outbound: n.out.size,
    words: n.words,
    noindex: n.noindex,
    impressions: s?.i ?? 0,
    clicks: s?.c ?? 0,
    silent: !s || s.i === 0,
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
  byDepth[k] ??= { n: 0, silent: 0, impr: 0 };
  byDepth[k].n++;
  if (r.silent) byDepth[k].silent++;
  byDepth[k].impr += r.impressions;
}

console.log('================ CRAWL GRAPH ================');
console.log(`pages in build      ${rows.length}`);
console.log(`indexable           ${indexable.length}   (noindex: ${rows.length - indexable.length})`);
console.log(`silent (0 impr)     ${indexable.filter((r) => r.silent).length}`);

console.log('\n---- CLICK DEPTH vs SILENCE (the core signal) ----');
console.log('DEPTH         PAGES   SILENT   % silent   IMPRESSIONS');
for (const k of Object.keys(byDepth).sort((a, b) => (a === 'unreachable' ? 1 : b === 'unreachable' ? -1 : +a - +b))) {
  const v = byDepth[k];
  console.log(
    String(k).padEnd(13) + String(v.n).padStart(6) + String(v.silent).padStart(9) +
      String(((v.silent / v.n) * 100).toFixed(0) + '%').padStart(11) + String(v.impr).padStart(14)
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
line('silent AND deep/unreachable', silentDeep);
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
  silent: indexable.filter((r) => r.silent).length,
  brokenTargets: broken.size,
  brokenLinkInstances: brokenTotal,
  lowInbound: indexable.filter((r) => r.inbound <= 2).length,
  orphans: orphans.length,
  unreachable: unreachable.length,
  deep: deep.length,
  silentDeep: silentDeep.length,
  medianDepth: (() => {
    const d = indexable.map((r) => r.depth).filter((x) => x !== null).sort((a, b) => a - b);
    return d.length ? d[Math.floor(d.length / 2)] : null;
  })(),
  totalImpressions: rows.reduce((a, r) => a + r.impressions, 0),
  totalClicks: rows.reduce((a, r) => a + r.clicks, 0),
};

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
fs.writeFileSync(path.join(SNAPDIR, `graph-${stamp}.json`), JSON.stringify({ summary, rows }, null, 2));
fs.writeFileSync(path.join(V2, 'graph-latest.json'), JSON.stringify({ summary, rows }, null, 2));

if (COMPARE) {
  const snaps = fs.readdirSync(SNAPDIR).filter((f) => f.endsWith('.json')).sort();
  if (snaps.length >= 2) {
    const prev = JSON.parse(fs.readFileSync(path.join(SNAPDIR, snaps.at(-2)), 'utf-8')).summary;
    console.log(`\n---- CHANGE vs ${snaps.at(-2)} ----`);
    for (const k of Object.keys(summary)) {
      const a = prev[k], b = summary[k];
      if (typeof a !== 'number' || typeof b !== 'number' || a === b) continue;
      const d = b - a;
      // Metrics where LOWER is better. Everything else (impressions, clicks) improves upward.
      const lowerIsBetter = [
        'silent', 'orphans', 'unreachable', 'deep', 'silentDeep', 'medianDepth',
        'brokenTargets', 'brokenLinkInstances', 'lowInbound',
      ];
      const good = lowerIsBetter.includes(k) ? d < 0 : d > 0;
      console.log(`  ${k.padEnd(20)} ${String(a).padStart(6)} -> ${String(b).padStart(6)}  ${d > 0 ? '+' : ''}${d}  ${good ? 'better' : 'WORSE'}`);
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

  if (failures.length) {
    console.error('\n❌ GRAPH CHECK FAILED');
    failures.forEach((f) => console.error(`  ${f}`));
    process.exit(1);
  }
  console.log('\n✅ GRAPH CHECK PASSED — no broken links, no orphans, nothing deeper than 3 clicks');
}
