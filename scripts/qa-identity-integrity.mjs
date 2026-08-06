/**
 * Site-wide sweep for the defect classes found one-at-a-time during the August 2026 refresh.
 *
 * Each class below was discovered as a SINGLE instance by an agent or by hand. A single instance is
 * never the whole story here — the content was batch-generated, so a defect in one file is a defect
 * in its whole cohort. This walks every dossier and pack looking for the same shapes.
 *
 *   1. SEQUENCE_COLLISION — two dossiers claiming the same amino-acid sequence.
 *      Found: livagen and vesugen BOTH declared sequence KED, ~390 Da, "tripeptide". They are
 *      different compounds — Livagen is Lys-Glu-Asp-Ala, a tetrapeptide; KED is Vesugen. Every
 *      citation filed under the wrong one inherits the wrong identity, and no citation gate can see
 *      it because the PMIDs are real.
 *
 *   2. PLACEHOLDER_IDENTIFIER — a finding asserting a study result with pmid "N/A", "TBD", "" or
 *      similar. Found: testagen carries five, one typed `human-observational`. An assertion with a
 *      placeholder where its source should be is strictly worse than an uncited sentence, because
 *      the empty field signals that a source was expected and implies one exists.
 *
 *   3. STALE_SOURCE_COUNT — a `sources.count` / `human` block that disagrees with the citations
 *      actually present. Found: foxo4-dri advertised 18 sources against 1 real citation. These
 *      numbers are rendered as a credibility signal and are embedded into generated comparison
 *      pages, so a wrong count propagates.
 *
 *   4. DUPLICATE_TRIAL — the same NCT stored twice inside one pack. Found: cerebrolysin holds
 *      NCT00868283 and NCT00947531 twice each, ll-37 holds NCT02225366 twice. Duplicates inflate
 *      trial counts and let two records drift into disagreeing about one study.
 *
 *   5. GENERIC_ALIAS — a public alias that names a tissue rather than a compound
 *      ("Joint peptides", "Testicular peptide", "Gastric peptide"). These are misleading as
 *      published synonyms and they are what made literature scans return other compounds' papers.
 *
 * Usage: node scripts/qa-identity-integrity.mjs [--strict]
 */
import fs from 'fs';
import matter from 'gray-matter';
import { isDistinctive, fold } from '../verification/matchers.mjs';

const STRICT = process.argv.includes('--strict');
const findings = [];

const dossierFiles = fs.readdirSync('src/content/peptides').filter((f) => f.endsWith('.mdx'));
const dossiers = dossierFiles.map((f) => ({
  slug: f.replace(/\.mdx$/, ''),
  data: matter(fs.readFileSync(`src/content/peptides/${f}`, 'utf-8')).data,
}));

/* ---------------------------------------------------------------------------------------------
 * 1. SEQUENCE_COLLISION
 * Two compounds cannot share a sequence. Compared on the normalised letter string so that
 * "Lys-Glu-Asp" and "KED" and "K-E-D" are recognised as the same claim.
 * ------------------------------------------------------------------------------------------- */
const THREE_LETTER = { lys: 'K', glu: 'E', asp: 'D', ala: 'A', gly: 'G', arg: 'R', trp: 'W', pro: 'P',
  ser: 'S', thr: 'T', cys: 'C', val: 'V', leu: 'L', ile: 'I', met: 'M', phe: 'F', tyr: 'Y', his: 'H',
  asn: 'N', gln: 'Q' };

function normSeq(s) {
  const raw = String(s || '').trim();
  if (!raw) return null;
  // "Lys-Glu-Asp-Ala" -> KEDA
  const parts = raw.toLowerCase().split(/[-\s·]+/).filter(Boolean);
  if (parts.length > 1 && parts.every((p) => THREE_LETTER[p])) return parts.map((p) => THREE_LETTER[p]).join('');
  // Already a letter string, e.g. "KED"
  const letters = raw.toUpperCase().replace(/[^A-Z]/g, '');
  if (letters.length >= 2 && letters.length <= 60 && /^[ACDEFGHIKLMNPQRSTVWY]+$/.test(letters)) return letters;
  return null;
}

/* WALK for `sequence`, do not reach for `data.sequence`.
 *
 * The first version of this check read the top-level field and returned a clean zero across all 102
 * dossiers — not because there are no collisions but because `sequence` is nested (vesugen carries
 * it several levels down). A checker that silently answers "nothing found" when it never looked is
 * the same failure the research scan had, and it is the same path-assumption mistake that left 878
 * of 980 files unverified earlier in this repo. Third occurrence; walk, never enumerate. */
function collectSequences(node, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) { node.forEach((x) => collectSequences(x, out)); return out; }
  for (const [k, v] of Object.entries(node)) {
    if (k === 'sequence' && typeof v === 'string' && v.trim()) out.push(v.trim());
    else collectSequences(v, out);
  }
  return out;
}

const bySeq = new Map();
let seqSeen = 0;
for (const d of dossiers) {
  for (const raw of [...new Set(collectSequences(d.data))]) {
    const seq = normSeq(raw);
    if (!seq) continue;
    seqSeen++;
    if (!bySeq.has(seq)) bySeq.set(seq, []);
    if (!bySeq.get(seq).some((x) => x.slug === d.slug)) bySeq.get(seq).push({ slug: d.slug, raw });
  }
}
if (!seqSeen) {
  findings.push({ type: 'CHECK_FOUND_NO_DATA',
    file: '(qa-identity-integrity)',
    detail: 'No sequence fields were found anywhere in 102 dossiers. That is far more likely to mean this check is looking in the wrong place than that the site records no sequences — treat a clean result here as unproven until a sequence is seen.' });
}
for (const [seq, list] of bySeq) {
  if (list.length < 2) continue;
  findings.push({ type: 'SEQUENCE_COLLISION', file: list.map((x) => x.slug).join(' + '),
    detail: `${list.length} dossiers claim sequence ${seq}: ` +
      list.map((x) => `${x.slug} ("${x.raw}")`).join('  VS  ') +
      '. At most one can be right; every citation on the others inherits a wrong identity.' });
}

/* ---------------------------------------------------------------------------------------------
 * 2. PLACEHOLDER_IDENTIFIER
 * Walk structurally: any node asserting a finding while its identifier field is a placeholder.
 * ------------------------------------------------------------------------------------------- */
const PLACEHOLDER = /^\s*(n\/?a|tbd|tba|none|null|pending|unknown|-{1,}|\?+)\s*$/i;
const ID_FIELDS = ['pmid', 'doi', 'nctId', 'nct', 'source'];

for (const d of dossiers) {
  const hits = [];
  (function walk(n, p) {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach((x, i) => walk(x, `${p}[${i}]`));
    for (const k of ID_FIELDS) {
      if (!(k in n) || typeof n[k] !== 'string' || !PLACEHOLDER.test(n[k])) continue;
      const text = String(n.finding || n.title || n.claim || n.summary || n.effects || '');
      /* A placeholder is HONEST when the accompanying text says no study exists. shlp-6's timeline
       * pairs `source: N/A` with "No dedicated short-term studies exist" and "No long-term studies
       * exist for SHLP-6" — that is the absence being stated plainly, which is exactly what this
       * site should do, and flagging it would punish the correct behaviour. The defect is a
       * placeholder attached to an ASSERTED result, as in testagen's "Elderly male subjects showed
       * changes in reproductive health markers". */
      if (/\b(no|not|none|never|lack(s|ing)?|absent|unknown|uncharacteri[sz]ed|unavailable|do(es)? not exist|no data)\b/i.test(text)
          && /\b(stud(y|ies)|data|trial|evidence|research|pharmacokinetics)\b/i.test(text)) continue;
      const assertion = text.replace(/\s+/g, ' ').slice(0, 110);
      hits.push(`${p}.${k}="${n[k]}"${n.type ? ` type=${n.type}` : ''}${assertion ? ` — "${assertion}"` : ''}`);
    }
    Object.entries(n).forEach(([k, v]) => walk(v, `${p}.${k}`));
  })(d.data, '');
  if (hits.length) {
    findings.push({ type: 'PLACEHOLDER_IDENTIFIER', file: `peptides/${d.slug}.mdx`,
      detail: `${hits.length} finding(s) assert a result with a placeholder identifier`,
      items: hits.slice(0, 6) });
  }
}

/* ---------------------------------------------------------------------------------------------
 * 3. STALE_SOURCE_COUNT
 * ------------------------------------------------------------------------------------------- */
/* ONE definition of "a source", shared with scripts/reconcile-source-counts.mjs.
 *
 * This check originally walked the dossier frontmatter only. The reconciler counts what the page
 * actually renders — ledger-verified identifiers anywhere in the file, INCLUDING the body, plus the
 * pack trials the layout reads. Those two definitions disagreed, so after the reconciler wrote
 * correct numbers this gate still flagged 32 dossiers as stale. A gate that contradicts the tool
 * that fixes it trains its reader to ignore both. The definition below is the renderer's. */
const ledgerCounts = new Map();
{
  const led = JSON.parse(fs.readFileSync('verification/ledger.json', 'utf-8'));
  for (const e of Object.values(led.entries)) {
    if (e.verdict !== 'exists') continue;
    const id = `${e.type}:${String(e.id).toUpperCase()}`;
    for (const file of new Set((e.locations || []).map((l) => l.file))) {
      if (!ledgerCounts.has(file)) ledgerCounts.set(file, new Set());
      ledgerCounts.get(file).add(id);
    }
  }
}
for (const d of dossiers) {
  const declared = d.data?.sources?.count;
  if (typeof declared !== 'number') continue;
  const ids = new Set(ledgerCounts.get(`src/content/peptides/${d.slug}.mdx`) || []);
  const packPath = `data/source-packs/${d.slug}.json`;
  if (fs.existsSync(packPath)) {
    for (const t of (JSON.parse(fs.readFileSync(packPath, 'utf-8')).trials || [])) {
      const nct = t.nctId || t.id;
      if (nct && /^NCT\d{8}$/i.test(String(nct))) ids.add(`NCT:${String(nct).toUpperCase()}`);
    }
  }
  if (declared !== ids.size) {
    findings.push({ type: 'STALE_SOURCE_COUNT', file: `peptides/${d.slug}.mdx`,
      detail: `sources.count declares ${declared} but ${ids.size} verified identifier(s) are rendered — this number appears as a credibility signal on the dossier, in search results, and in every generated comparison. Run \`npm run fix:counts -- --apply\`.` });
  }
}

/* ---------------------------------------------------------------------------------------------
 * 4. DUPLICATE_TRIAL — same NCT twice inside one pack
 * ------------------------------------------------------------------------------------------- */
/* Only duplication WITHIN ONE ARRAY is a defect.
 *
 * This check originally flagged any NCT appearing twice anywhere in a pack, which reported 33
 * findings of which 28 were legitimate: `coreLibrary.*` is the pack's bibliography and `trials[]`
 * is what DossierLayout renders, so a registered trial correctly belongs to both. Acting on those
 * would have stripped real bibliography entries. The 5 genuine cases were the same NCT twice in one
 * array — cerebrolysin printed two studies twice in its rendered trial table.
 *
 * Also checks that a record's `url` points at its OWN identifier. Four records carried a url for a
 * different NCT entirely — a dental sealant study, sickle-cell analgesia, asthma manual therapy —
 * the same stale trials as the dual-identifier defect found earlier, surviving in a different
 * field. These render as clickable links, so the reader lands on an unrelated study. */
for (const f of fs.readdirSync('data/source-packs').filter((x) => x.endsWith('.json'))) {
  const pack = JSON.parse(fs.readFileSync(`data/source-packs/${f}`, 'utf-8'));
  const byArray = new Map();
  (function walk(node, p) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((x, i) => {
        if (x && typeof x === 'object') {
          const nct = x.nctId || x.nct || (typeof x.id === 'string' && /^NCT\d{8}$/i.test(x.id) ? x.id : null);
          if (nct) {
            if (!byArray.has(p)) byArray.set(p, new Map());
            const m = byArray.get(p);
            const k = String(nct).toUpperCase();
            m.set(k, (m.get(k) || 0) + 1);
          }
          // url must point at this record's own identifier
          const id = String(x.nctId || x.nct || '').toUpperCase();
          for (const key of ['url', 'link']) {
            const inUrl = (String(x[key] || '').match(/NCT\d{8}/i) || [])[0];
            if (id && inUrl && id !== inUrl.toUpperCase()) {
              findings.push({ type: 'IDENTIFIER_URL_MISMATCH', file: `data/source-packs/${f}`,
                detail: `${p}[${i}] has nctId ${id} but its ${key} points at ${inUrl.toUpperCase()} — this renders as a link to an unrelated study` });
            }
          }
        }
        walk(x, `${p}[${i}]`);
      });
      return;
    }
    Object.entries(node).forEach(([k, v]) => walk(v, p ? `${p}.${k}` : k));
  })(pack, '');

  for (const [arrPath, m] of byArray) {
    for (const [nct, n] of m) {
      if (n > 1) {
        findings.push({ type: 'DUPLICATE_TRIAL', file: `data/source-packs/${f}`,
          detail: `${nct} appears ${n}x inside ${arrPath} — a single array, so it renders twice and double-counts. Run \`node scripts/dedupe-trials.mjs --apply\`.` });
      }
    }
  }
}

/* ---------------------------------------------------------------------------------------------
 * 5. GENERIC_ALIAS — published synonyms that name a tissue, not a compound
 * ------------------------------------------------------------------------------------------- */
for (const d of dossiers) {
  const bad = (d.data.aliases || []).filter((a) => !isDistinctive(a));
  if (bad.length) {
    findings.push({ type: 'GENERIC_ALIAS', advisory: true, file: `peptides/${d.slug}.mdx`,
      detail: `${bad.length} public alias(es) name a tissue or category rather than a compound: ` +
        bad.map((a) => `"${a}"`).join(', ') + ' — misleading as published synonyms, and the cause of literature-scan false positives' });
  }
}

/* ---------------------------------------------------------------------------------------------
 * Report
 * ------------------------------------------------------------------------------------------- */
const blocking = findings.filter((f) => !f.advisory);
const advisory = findings.filter((f) => f.advisory);
const byType = findings.reduce((a, f) => ((a[f.type] = (a[f.type] || 0) + 1), a), {});

console.log(`Identity integrity: ${dossiers.length} dossiers, ${fs.readdirSync('data/source-packs').filter((x) => x.endsWith('.json')).length} packs.`);
console.log(JSON.stringify(byType, null, 2));

fs.mkdirSync('.planning/citation-audit', { recursive: true });
fs.writeFileSync('.planning/citation-audit/identity-findings.json', JSON.stringify(findings, null, 2) + '\n');

if (advisory.length) {
  console.warn(`\nADVISORY (${advisory.length}) — alias hygiene, non-blocking:`);
  for (const f of advisory) console.warn(`  • ${f.file}\n      ${f.detail}`);
}
if (!blocking.length) {
  console.log('\nPASS: no identity-integrity defects.');
  process.exit(0);
}
console.error(`\n${STRICT ? 'FAIL' : 'WARN'}: ${blocking.length} blocking finding(s)\n`);
for (const f of blocking) {
  console.error(`  • [${f.type}] ${f.file}`);
  console.error(`      ${f.detail}`);
  (f.items || []).forEach((i) => console.error(`        - ${i}`));
}
console.error(`\nWritten to .planning/citation-audit/identity-findings.json`);
process.exit(STRICT ? 1 : 0);
