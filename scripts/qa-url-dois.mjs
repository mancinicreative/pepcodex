// Resolves DOIs that are hiding inside `url:` fields, which the DOI gate never inspects.
//
//   node scripts/qa-url-dois.mjs                   # report
//   node scripts/qa-url-dois.mjs --strict          # exit 1 on NEW unresolvable DOIs
//   node scripts/qa-url-dois.mjs --update-baseline
//
// WHY THIS EXISTS
// `qa-pmids.mjs` resolves the `doi:` field. It has no view of
// `url: https://www.nejm.org/doi/full/10.1056/NEJMoa2404251` — and `qa-source-identifiers.mjs`
// counts that entry verifiable because a URL is present. So a fabricated DOI passes both gates
// while looking maximally credible to a reader.
//
// That is exactly how `orforglipron-attain-1-results` shipped: TWO invented NEJM DOIs
// (10.1056/NEJMoa2404251, 10.1056/NEJMoa2306449), each returning 404 at doi.org, "Resource not
// found" at Crossref, and zero PubMed hits. Control: 10.1056/NEJMoa2416394 resolves 302.
import fs from 'fs';
import path from 'path';

const STRICT = process.argv.includes('--strict');
const ROOT = path.join('src', 'content');
const COLLECTIONS = ['blog', 'peptides', 'comparisons', 'safety', 'guides', 'protocols', 'conditions'];

// DOIs are `10.<registrant>/<suffix>`. Stop at whitespace, quotes, or closing markup.
const DOI_IN_URL = /https?:\/\/[^\s'"]*?\/(10\.\d{4,9}\/[^\s'"<>)]+)/gi;

const found = new Map(); // doi -> Set("collection/file")

for (const col of COLLECTIONS) {
  const dir = path.join(ROOT, col);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f))) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const fm = raw.split(/\r?\n---\r?\n/)[0];
    for (const m of fm.matchAll(DOI_IN_URL)) {
      // Trim trailing punctuation that commonly rides along in URLs.
      const doi = m[1].replace(/[.,;)]+$/, '');
      if (!found.has(doi)) found.set(doi, new Set());
      found.get(doi).add(`${col}/${file}`);
    }
  }
}

const dois = [...found.keys()];
console.log(`\nURL-EMBEDDED DOI CHECK`);
console.log(`  DOIs found inside url: fields : ${dois.length}`);

if (!dois.length) {
  console.log(`\n  PASS: nothing to resolve.\n`);
  process.exit(0);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Crossref is the authority on whether a DOI is registered. doi.org alone can 302 to a
// publisher error page, so we confirm against the API and treat 404 as decisive.
async function resolveDoi(doi) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
        headers: { 'User-Agent': 'pepcodex-qa/1.0 (mailto:mancini.creative@gmail.com)' },
      });
      if (res.status === 404) return { ok: false, reason: 'Crossref 404 — not registered' };
      if (res.ok) {
        const json = await res.json();
        return { ok: true, title: json?.message?.title?.[0] ?? '(untitled)' };
      }
      // 5xx / rate limit — back off and retry rather than reporting a false failure.
      await sleep(1200 * (attempt + 1));
    } catch (e) {
      await sleep(1200 * (attempt + 1));
    }
  }
  return { ok: null, reason: 'network — could not determine' };
}

const bad = [];
const undetermined = [];
let okCount = 0;

for (const doi of dois) {
  const r = await resolveDoi(doi);
  if (r.ok === true) okCount++;
  else if (r.ok === false) bad.push({ doi, files: [...found.get(doi)], reason: r.reason });
  else undetermined.push({ doi, files: [...found.get(doi)] });
  await sleep(250); // stay polite to Crossref
}

console.log(`  resolve OK                    : ${okCount}`);
console.log(`  UNRESOLVABLE (fabricated?)    : ${bad.length}`);
if (undetermined.length) console.log(`  undetermined (network)        : ${undetermined.length}`);

if (bad.length) {
  console.log(`\n  DOIs that are not registered anywhere:`);
  bad.forEach((b) => console.log(`    ${b.doi}\n      ${b.reason}\n      in: ${b.files.join(', ')}`));
}

// ---------------------------------------------------------------------------
// RATCHET
// ---------------------------------------------------------------------------
const BASELINE = path.join('.planning', 'url-doi-baseline.json');
const current = new Set(bad.flatMap((b) => b.files.map((f) => `${f}::${b.doi}`)));

if (process.argv.includes('--update-baseline')) {
  fs.mkdirSync(path.dirname(BASELINE), { recursive: true });
  fs.writeFileSync(
    BASELINE,
    JSON.stringify(
      { updated: new Date().toISOString().slice(0, 10), count: current.size, entries: [...current].sort() },
      null,
      2
    )
  );
  console.log(`\n  baseline written: ${current.size} known offenders -> ${BASELINE}\n`);
  process.exit(0);
}

if (STRICT) {
  // Never fail the build on a network problem — that produces a gate people switch off.
  if (undetermined.length) {
    console.log(`\n  NOTE: ${undetermined.length} DOI(s) undetermined due to network; not counted either way.`);
  }
  if (!fs.existsSync(BASELINE)) {
    console.error(`\n  FAIL: no baseline at ${BASELINE}. Run with --update-baseline first.`);
    process.exit(1);
  }
  const baseline = new Set(JSON.parse(fs.readFileSync(BASELINE, 'utf8')).entries);
  const added = [...current].filter((k) => !baseline.has(k));
  const fixed = [...baseline].filter((k) => !current.has(k));

  if (fixed.length) console.log(`\n  ${fixed.length} previously-unresolvable DOI(s) fixed since the baseline.`);

  if (added.length) {
    console.error(`\n  FAIL: ${added.length} NEW url-embedded DOI(s) that do not resolve:`);
    added.slice(0, 20).forEach((k) => console.error(`    ${k}`));
    console.error(`\n  An unregistered DOI is a fabricated citation. Find the real paper, or cut the claim.`);
    process.exit(1);
  }
  console.log(`\n  PASS (ratchet): no new unresolvable url-embedded DOIs. Backlog: ${current.size}.\n`);
} else {
  console.log(bad.length ? '\n  (report only — use --strict for the ratchet)\n' : '\n  PASS: every url-embedded DOI is registered.\n');
}
