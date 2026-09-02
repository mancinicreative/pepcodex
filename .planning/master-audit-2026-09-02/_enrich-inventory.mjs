import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const matter = require('gray-matter');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(ROOT, 'src/content');

function slugs(dir) {
  const abs = path.join(CONTENT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => f.replace(/\.mdx?$/, ''));
}

function fm(dir, slug) {
  const p = path.join(CONTENT, dir, slug + '.mdx');
  if (!fs.existsSync(p)) return null;
  return matter(fs.readFileSync(p, 'utf8')).data;
}

const blogs = slugs('blog');
const guides = slugs('guides');
const safety = slugs('safety');
const peptides = slugs('peptides');
const glossary = slugs('glossary');

function stripPrefix(s, prefixes) {
  for (const p of prefixes) {
    if (s.startsWith(p)) return s.slice(p.length);
  }
  return s;
}

const whatIsBlogs = blogs.filter((s) => s.startsWith('what-is-') || s.startsWith('what-are-'));
const pairs = [];

for (const b of whatIsBlogs) {
  const core = stripPrefix(b, ['what-is-', 'what-are-']);
  const peptideHit = peptides.find((p) => p === core || p === core.replace(/s$/, '') || p.replace(/-/g, '') === core.replace(/-/g, ''));
  const guideHit = guides.find((g) => g === b || g === core || g.includes(core));
  const safetyHit = safety.find((s) => s.includes(core) || s === core + '-safety');
  const glossHit = glossary.find((g) => g === core);
  pairs.push({
    blog: b,
    peptide: peptideHit || null,
    guide: guideHit || null,
    safety: safetyHit || null,
    glossary: glossHit || null,
    cannibalization_risk: [peptideHit, guideHit, safetyHit].filter(Boolean).length >= 1,
  });
}

// blog vs safety same-ish slugs
const blogSafety = [];
for (const b of blogs) {
  const s = safety.find((x) => x === b || x === b.replace(/-safety$/, '') + '-safety' || b.endsWith('-safety') && x === b);
  if (s) blogSafety.push({ blog: b, safety: s });
}

const vercel = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8').replace(/^\uFEFF/, ''),
);
const redirects = (vercel.redirects || []).map((r) => ({
  source: r.source,
  destination: r.destination,
  status: r.statusCode || (r.permanent ? 301 : null),
  permanent: r.permanent ?? null,
}));

let graph = null;
const graphPath = path.join(ROOT, '.planning/data/v2/graph-latest.json');
if (fs.existsSync(graphPath)) {
  const g = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
  const keys = Object.keys(g);
  graph = {
    top_keys: keys.slice(0, 40),
    node_count: g.nodes ? g.nodes.length : g.pages ? g.pages.length : null,
    summary_fields: {},
  };
  for (const k of ['generatedAt', 'generated_at', 'urlCount', 'htmlCount', 'orphanCount', 'brokenCount', 'maxDepth', 'stats', 'summary']) {
    if (g[k] !== undefined) graph.summary_fields[k] = typeof g[k] === 'object' ? Object.keys(g[k]).slice(0, 30) : g[k];
  }
  if (g.stats) graph.stats = g.stats;
  if (g.summary) graph.summary = g.summary;
}

const noindexBlogs = blogs.filter((s) => {
  const d = fm('blog', s);
  return d && d.robots === 'noindex';
});
const noindexGloss = glossary.filter((s) => {
  const d = fm('glossary', s);
  return d && d.noindex === true;
});

const peptideConditions = [];
for (const p of peptides) {
  const d = fm('peptides', p);
  if (d && Array.isArray(d.conditions)) {
    for (const c of d.conditions) {
      peptideConditions.push({ peptide: p, condition: c.slug || c, name: c.name || null });
    }
  }
}

fs.writeFileSync(
  path.join(OUT, 'CANNIBALIZATION-CANDIDATES.json'),
  JSON.stringify({ what_is_pairs: pairs, blog_safety_pairs: blogSafety }, null, 2),
);
fs.writeFileSync(path.join(OUT, 'VERCEL-REDIRECTS.json'), JSON.stringify(redirects, null, 2));
fs.writeFileSync(
  path.join(OUT, 'NOINDEX-LISTS.json'),
  JSON.stringify({ blogs: noindexBlogs, glossary: noindexGloss }, null, 2),
);
fs.writeFileSync(
  path.join(OUT, 'PEPTIDE-CONDITION-ROUTES.json'),
  JSON.stringify({ count: peptideConditions.length, routes: peptideConditions }, null, 2),
);
fs.writeFileSync(path.join(OUT, 'GRAPH-META.json'), JSON.stringify(graph, null, 2));
console.log(JSON.stringify({
  what_is_pairs: pairs.length,
  cannibal_flagged: pairs.filter((p) => p.cannibalization_risk).length,
  blog_safety_pairs: blogSafety.length,
  redirects: redirects.length,
  noindex_blogs: noindexBlogs,
  noindex_glossary: noindexGloss.length,
  peptide_conditions: peptideConditions.length,
  graph_keys: graph && graph.top_keys,
  graph_stats: graph && graph.stats,
}, null, 2));
