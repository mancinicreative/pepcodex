// Compares each frontmatter source title against the REAL title PubMed returns for that PMID.
//
//   node scripts/qa-source-titles.mjs                   # report
//   node scripts/qa-source-titles.mjs --strict          # exit 1 on NEW drift
//   node scripts/qa-source-titles.mjs --update-baseline
//
// WHY THIS EXISTS
// Two failure modes, both invisible to every other gate because the PMID resolves perfectly:
//
//   1. WRONG PAPER. PMID 25673352 was cited as the SCALE liraglutide trial. It is actually
//      "A radical psychiatrist and the law: the forensic career of Reg Ellery". PMID 37957351,
//      cited as sleep-apnea literature, is a paper on vocal timing in bats. The identifier
//      resolves, so `qa-pmids.mjs` passes it.
//   2. TITLE LAUNDERING. pmid-9141536's stored title replaced the compound name
//      "[Nle27]growth hormone-releasing hormone-(1-29)-NH2" with the generic "GHRH analog",
//      concealing that the sermorelin post's only adult-human citation is not a sermorelin study.
//      pmid-11735244 dropped "of adult rats", hiding that its evidence is animal.
//
// Similarity is token-overlap on the stored vs real title. Low overlap means the stored title
// describes a different paper than the one the PMID points at.
import fs from 'fs';
import path from 'path';

const STRICT = process.argv.includes('--strict');
const ROOT = path.join('src', 'content');
const COLLECTIONS = ['blog', 'peptides', 'comparisons', 'safety', 'guides', 'protocols', 'conditions'];

// Below this Jaccard overlap the stored title is not describing the same paper.
const THRESHOLD = 0.34;

const STOP = new Set(['the','a','an','of','in','on','for','and','or','to','with','by','from','at','as','is','are','was','were','be','its','their','study','trial','effects','effect']);

const norm = (s) =>
  new Set(
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/[\s-]+/)
      .filter((w) => w.length > 2 && !STOP.has(w))
  );

const jaccard = (a, b) => {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  return inter / (a.size + b.size - inter);
};

// Collect { pmid, title, file } from every frontmatter sources block.
const entries = [];

for (const col of COLLECTIONS) {
  const dir = path.join(ROOT, col);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f))) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const fm = raw.split(/\r?\n---\r?\n/)[0];
    const at = fm.search(/\r?\nsources:/);
    if (at < 0) continue;

    const rest = fm.slice(at).replace(/^\r?\nsources:\r?\n/, '');
    const block = [];
    for (const line of rest.split(/\r?\n/)) {
      if (/^[A-Za-z_][A-Za-z0-9_]*\s*:/.test(line)) break;
      block.push(line);
    }

    // Split into individual `- ...` entries.
    const items = [];
    let cur = null;
    for (const line of block) {
      if (/^\s*-\s/.test(line)) {
        if (cur) items.push(cur);
        cur = line;
      } else if (cur !== null) cur += '\n' + line;
    }
    if (cur) items.push(cur);

    for (const e of items) {
      // Skip non-citation list items (the `peptides` collection reuses `sources` as a stats object).
      if (!/(^|\s)(id|title)\s*:/.test(e)) continue;
      const pmid =
        (e.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d{6,9})/) || [])[1] ??
        (e.match(/(?:^|\s)pmid\s*:\s*['"]?(\d{6,9})/i) || [])[1] ??
        (e.match(/id\s*:\s*['"]?pmid[-:]?(\d{6,9})/i) || [])[1];
      if (!pmid) continue;
      // Titles may be plain scalars OR YAML folded/literal blocks (`>-`, `|`, ...), where the
      // text lives on the following indented lines. Reading only the `title:` line yields the
      // block marker itself and reports every such entry as drift — a false positive.
      let title = null;
      const lines = e.split('\n');
      const ti = lines.findIndex((l) => /(?:^|\s)title\s*:/.test(l));
      if (ti >= 0) {
        const inline = (lines[ti].match(/title\s*:\s*(.*)$/) || [])[1]?.trim() ?? '';
        if (/^[>|][-+]?\d*$/.test(inline)) {
          // Folded/literal block: take the indented continuation lines that follow.
          const parts = [];
          for (let i = ti + 1; i < lines.length; i++) {
            if (!/^\s{2,}\S/.test(lines[i])) break;
            if (/^\s*[a-z_]+\s*:/i.test(lines[i])) break; // next key at this level
            parts.push(lines[i].trim());
          }
          title = parts.join(' ').trim();
        } else {
          title = inline.replace(/^['"]|['"],?$/g, '').trim();
        }
      }
      if (!title) continue;
      entries.push({ pmid, title, file: `${col}/${file}` });
    }
  }
}

const pmids = [...new Set(entries.map((e) => e.pmid))];
console.log(`\nSOURCE TITLE DRIFT CHECK`);
console.log(`  citations with a PMID + title : ${entries.length} (${pmids.length} distinct PMIDs)`);

if (!pmids.length) {
  console.log(`\n  PASS: nothing to compare.\n`);
  process.exit(0);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// esummary accepts batched ids — 200 per call keeps us to a handful of requests.
async function fetchTitles(batch) {
  const url =
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${batch.join(',')}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'pepcodex-qa/1.0' } });
      if (res.ok) {
        const json = await res.json();
        const out = {};
        for (const id of batch) {
          const rec = json?.result?.[id];
          if (rec && !rec.error && rec.title) out[id] = rec.title;
        }
        return out;
      }
      await sleep(1500 * (attempt + 1));
    } catch {
      await sleep(1500 * (attempt + 1));
    }
  }
  return null; // undetermined — never treated as a failure
}

const real = {};
let undetermined = 0;
for (let i = 0; i < pmids.length; i += 200) {
  const batch = pmids.slice(i, i + 200);
  const got = await fetchTitles(batch);
  if (got === null) undetermined += batch.length;
  else Object.assign(real, got);
  await sleep(400); // E-utilities: stay under 3 req/sec
}

const drift = [];
let compared = 0;
for (const e of entries) {
  const realTitle = real[e.pmid];
  if (!realTitle) continue; // undetermined or PMID missing from PubMed (qa-pmids.mjs owns that)
  compared++;
  const score = jaccard(norm(e.title), norm(realTitle));
  if (score < THRESHOLD) drift.push({ ...e, realTitle, score });
}

console.log(`  compared against PubMed       : ${compared}`);
if (undetermined) console.log(`  undetermined (network)        : ${undetermined}`);
console.log(`  TITLE DRIFT (wrong paper?)    : ${drift.length}`);

// Always emit the full findings — the console caps at 30, but remediation needs every row.
if (drift.length) {
  const REPORT = path.join('.planning', 'data', 'v2', 'source-title-drift.json');
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(
    REPORT,
    JSON.stringify(
      {
        generated: new Date().toISOString().slice(0, 10),
        threshold: THRESHOLD,
        count: drift.length,
        rows: drift.sort((a, b) => a.score - b.score),
      },
      null,
      2
    )
  );
  console.log(`\n  full findings -> ${REPORT}`);
}

if (drift.length) {
  console.log(`\n  Stored title does not describe the paper the PMID points at:`);
  drift
    .sort((a, b) => a.score - b.score)
    .slice(0, 30)
    .forEach((d) => {
      console.log(`\n    ${d.file}  PMID ${d.pmid}  (overlap ${d.score.toFixed(2)})`);
      console.log(`      stored : ${d.title.slice(0, 110)}`);
      console.log(`      actual : ${d.realTitle.slice(0, 110)}`);
    });
}

// ---------------------------------------------------------------------------
// RATCHET
// ---------------------------------------------------------------------------
const BASELINE = path.join('.planning', 'source-title-baseline.json');
const current = new Set(drift.map((d) => `${d.file}::pmid-${d.pmid}`));

if (process.argv.includes('--update-baseline')) {
  fs.mkdirSync(path.dirname(BASELINE), { recursive: true });
  fs.writeFileSync(
    BASELINE,
    JSON.stringify(
      { updated: new Date().toISOString().slice(0, 10), threshold: THRESHOLD, count: current.size, entries: [...current].sort() },
      null,
      2
    )
  );
  console.log(`\n  baseline written: ${current.size} known offenders -> ${BASELINE}\n`);
  process.exit(0);
}

if (STRICT) {
  if (undetermined) {
    console.log(`\n  NOTE: ${undetermined} PMID(s) undetermined due to network; not counted either way.`);
  }
  if (!fs.existsSync(BASELINE)) {
    console.error(`\n  FAIL: no baseline at ${BASELINE}. Run with --update-baseline first.`);
    process.exit(1);
  }
  const baseline = new Set(JSON.parse(fs.readFileSync(BASELINE, 'utf8')).entries);
  const added = [...current].filter((k) => !baseline.has(k));
  const fixed = [...baseline].filter((k) => !current.has(k));

  if (fixed.length) console.log(`\n  ${fixed.length} previously-drifting title(s) corrected since the baseline.`);

  if (added.length) {
    console.error(`\n  FAIL: ${added.length} NEW source title(s) that do not match their PMID:`);
    added.slice(0, 20).forEach((k) => console.error(`    ${k}`));
    console.error(`\n  Either the PMID is wrong for the claim, or the title was altered. Fix the citation.`);
    process.exit(1);
  }
  console.log(`\n  PASS (ratchet): no new source-title drift. Backlog: ${current.size}.\n`);
} else {
  console.log(drift.length ? '\n  (report only — use --strict for the ratchet)\n' : '\n  PASS: every stored title matches its PMID.\n');
}
