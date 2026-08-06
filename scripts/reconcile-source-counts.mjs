/**
 * Recompute every dossier's `sources` block from the citations it actually carries.
 *
 * WHY: `sources.count` is a credibility claim rendered in at least eight places — the "N Sources"
 * badge, "Based on N cited sources" beneath the evidence score, the preclinical/clinical percentage
 * split, the homepage total, search results, condition pages, and every generated comparison table.
 * 86 of 102 dossiers overstated it, several absurdly: alpha-defensins declared 200 against 8 real
 * identifiers, 225ac-dota-lm3 declared 28 against 7, foxo4-dri declared 18 against 1.
 *
 * There was no original definition to recover. Only 2 of 102 matched "identifiers in the dossier"
 * and only 3 matched "dossier + full source pack", so the declared numbers were not a different
 * metric measured differently — they were invented, and inflated in one direction.
 *
 * THE DEFINITION THIS SCRIPT USES, and why:
 *
 *   count = distinct VERIFIED identifiers a reader can actually see and follow on this page
 *         = dossier frontmatter identifiers  ∪  the peptide's pack.trials[] registrations
 *
 * That is exactly what DossierLayout.astro renders: citations from frontmatter, plus the trial
 * table it builds by reading `pack.trials[]` (layout line ~241). The pack's `coreLibrary`
 * bibliography is deliberately EXCLUDED — it never reaches the page, and counting it would restore
 * the same gap in the other direction: bpc-157 would advertise 30 sources on a page displaying 8,
 * which is the sort of number a sceptical reader checks and catches.
 *
 * Only identifiers with ledger verdict "exists" count. An identifier that does not resolve is not a
 * source, and counting it is how the number got inflated in the first place.
 *
 * human / preclinical come from the study TYPE recorded on each finding, so they cannot exceed the
 * evidence actually claimed. A registered clinical trial counts as human. meta-analysis and review
 * are counted in `count` but in neither bucket, so the two percentages legitimately do not sum to
 * 100 — the layout already handles that.
 *
 * openAccess is resolved against PMC via NCBI elink rather than guessed. It is not rendered
 * anywhere today (only typed and passed through), but an unrendered field is still data, and 0
 * would assert "no open-access sources" which is false.
 *
 * Usage:
 *   node scripts/reconcile-source-counts.mjs            # dry run, prints the diff
 *   node scripts/reconcile-source-counts.mjs --apply
 *   node scripts/reconcile-source-counts.mjs --no-oa    # skip the PMC lookup (offline)
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const APPLY = process.argv.includes('--apply');
const NO_OA = process.argv.includes('--no-oa');
let oaResolved = false;   // did the PMC lookup actually produce data this run?
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = { 'User-Agent': 'PepCodex-counts/1.0 (mailto:admin@pepcodex.com)' };

// ---- verified identifiers only -------------------------------------------------------------
const ledger = JSON.parse(fs.readFileSync('verification/ledger.json', 'utf-8'));
const verified = new Set();
/* Identifiers per dossier FILE, from the ledger rather than by re-parsing.
 *
 * The ledger records every location an identifier appears, including `where: "body"`. Harvesting
 * only frontmatter undercounts: klotho carries five PMIDs entirely in prose and zero in
 * frontmatter, so a frontmatter-only count reported 0 for a dossier with real citations — the same
 * silent-zero shape this sweep has been correcting elsewhere. Four dossiers have body-only
 * identifiers. The body renders, so those citations are visible to a reader and count. */
const ledgerByFile = new Map();
for (const e of Object.values(ledger.entries)) {
  if (e.verdict !== 'exists') continue;
  const id = `${e.type}:${String(e.id).toUpperCase()}`;
  verified.add(id);
  for (const f of new Set((e.locations || []).map((l) => l.file))) {
    if (!ledgerByFile.has(f)) ledgerByFile.set(f, new Set());
    ledgerByFile.get(f).add(id);
  }
}

const HUMAN_TYPES = new Set(['human-rct', 'human-observational']);
const PRECLINICAL_TYPES = new Set(['animal', 'in-vitro']);

/** Collect identifiers, and the strongest study type seen for each. */
function harvest(node, ids, typeOf) {
  (function w(n) {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(w);
    const local = [];
    if (n.pmid && /^\d{6,9}$/.test(String(n.pmid))) local.push(`PMID:${n.pmid}`);
    if (n.doi && String(n.doi).startsWith('10.')) local.push(`DOI:${String(n.doi).toUpperCase()}`);
    const nct = n.nctId || n.nct;
    if (nct && /^NCT\d{8}$/i.test(String(nct))) local.push(`NCT:${String(nct).toUpperCase()}`);
    for (const id of local) {
      ids.add(id);
      // A trial registration is human evidence by definition even with no `type` field.
      const t = n.type || (id.startsWith('NCT') ? 'human-rct' : null);
      if (t && !typeOf.has(id)) typeOf.set(id, t);
    }
    Object.values(n).forEach(w);
  })(node);
}

const rows = [];
for (const f of fs.readdirSync('src/content/peptides').filter((x) => x.endsWith('.mdx'))) {
  const slug = f.replace(/\.mdx$/, '');
  const raw = fs.readFileSync(`src/content/peptides/${f}`, 'utf-8');
  const fm = matter(raw);
  const typeOf = new Map();
  const ids = new Set(ledgerByFile.get(`src/content/peptides/${f}`) || []);
  // Frontmatter walk is still needed for the study TYPE on each finding, which the ledger does not
  // record. Body citations therefore count toward the total but land in neither bucket, which is
  // correct: prose citations assert no study design.
  harvest(fm.data, ids, typeOf);

  // Trials the page renders from the pack — same source the layout reads.
  const packPath = `data/source-packs/${slug}.json`;
  if (fs.existsSync(packPath)) {
    const pack = JSON.parse(fs.readFileSync(packPath, 'utf-8'));
    for (const t of pack.trials || []) {
      const nct = t.nctId || t.id;
      if (nct && /^NCT\d{8}$/i.test(String(nct))) {
        const id = `NCT:${String(nct).toUpperCase()}`;
        ids.add(id);
        if (!typeOf.has(id)) typeOf.set(id, 'human-rct');
      }
    }
  }

  const live = [...ids].filter((id) => verified.has(id));
  const human = live.filter((id) => HUMAN_TYPES.has(typeOf.get(id))).length;
  const preclinical = live.filter((id) => PRECLINICAL_TYPES.has(typeOf.get(id))).length;

  rows.push({
    slug, file: `src/content/peptides/${f}`, raw,
    declared: fm.data.sources,
    /* openAccess starts as the DECLARED value, not 0.
     *
     * It used to start at 0 and only get filled when the PMC lookup ran. That meant `--no-oa`, and
     * any failure of the lookup, silently wrote a hard 0 to every dossier — asserting "no
     * open-access sources" for 91 pages on the strength of a request that never happened. It is the
     * same silent-zero shape this sweep has been correcting everywhere else, sitting in the tool
     * doing the correcting. Not computing a value is not the same as computing zero. */
    next: { count: live.length, human, preclinical, openAccess: fm.data.sources?.openAccess ?? 0 },
    pmids: live.filter((id) => id.startsWith('PMID:')).map((id) => id.slice(5)),
  });
}

// ---- open access, resolved rather than guessed ----------------------------------------------
if (!NO_OA) {
  const all = [...new Set(rows.flatMap((r) => r.pmids))];
  const oa = new Set();
  process.stdout.write(`Resolving open-access status for ${all.length} PMIDs via PMC`);
  /* SEPARATE &id= PARAMS, not a comma-joined list.
   *
   * elink with `id=a,b,c` returns ONE linkset covering all three, so "does this set have a PMC
   * link" is answered for the batch rather than per paper — and the naive read marks every id in
   * the batch as open access the moment one of them is. That reported 677 of 677 PMIDs as open
   * access, which is not a plausible rate for a corpus that includes NEJM and Lancet papers.
   * Passing `id=a&id=b&id=c` returns one linkset per id, which is the question actually being
   * asked. Verified against the API before relying on it. */
  /* BATCH SIZE 50, and failures are COUNTED.
   *
   * At 100 ids the request throws outright ("terminated") — verified against the API at 20, 50 and
   * 100. The old `catch {}` swallowed that silently, so six of seven batches failed and only the
   * tail resolved. The result looked like data and was not: every dossier with a non-zero
   * openAccess fell in the s-z tail of the alphabet, because those were the only PMIDs in the one
   * batch that survived. Open-access status does not correlate with alphabetical position, which is
   * what gave it away. */
  let batchFailures = 0;
  /* Retry before giving up. A single transient 5xx or reset should not veto the whole refresh —
   * but a batch that fails every attempt must still count, because silently dropping it is exactly
   * how the s-z artefact happened. */
  for (let i = 0; i < all.length; i += 50) {
    const batch = all.slice(i, i + 50);
    const qs = batch.map((id) => `id=${id}`).join('&');
    let got = false;
    for (let attempt = 0; attempt < 3 && !got; attempt++) {
      if (attempt) await sleep(1200 * attempt);
      try {
        const r = await fetch(
          `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&db=pmc&retmode=json&${qs}`,
          { headers: UA });
        if (!r.ok) continue;
        for (const set of (await r.json()).linksets || []) {
          const has = (set.linksetdbs || []).some((l) => (l.links || []).length);
          if (has) (set.ids || []).forEach((id) => oa.add(String(id)));
        }
        got = true;
      } catch { /* retry */ }
    }
    if (!got) batchFailures++;
    process.stdout.write(got ? '.' : 'x');
    await sleep(380);
  }

  if (batchFailures) {
    console.warn(`
  WARNING: ${batchFailures} PMC batch(es) failed. A partial result would understate open access
  for every dossier whose PMIDs were in a failed batch, so openAccess is left UNCHANGED.`);
    oaResolved = false;
  } else if (!oa.size) {
    console.warn('  WARNING: 0 of the queried PMIDs resolved in PMC. That is not a plausible result,');
    console.warn('  so the lookup is assumed to have failed and openAccess is left UNCHANGED.');
    oaResolved = false;
  } else {
    for (const r of rows) r.next.openAccess = r.pmids.filter((p) => oa.has(p)).length;
    oaResolved = true;
  }
}

// ---- report + write --------------------------------------------------------------------------
const changed = rows.filter((r) => ['count', 'human', 'preclinical', 'openAccess']
  .some((k) => (r.declared?.[k] ?? -1) !== r.next[k]));

console.log(`\n${APPLY ? 'APPLYING' : 'DRY RUN'} — ${changed.length} of ${rows.length} dossiers change\n`);
const worst = [...changed].sort((a, b) => (b.declared.count - b.next.count) - (a.declared.count - a.next.count));
console.log('largest overstatements:');
for (const r of worst.slice(0, 12)) {
  console.log(`  ${r.slug.padEnd(22)} count ${String(r.declared.count).padStart(3)} -> ${String(r.next.count).padStart(3)}   human ${r.declared.human} -> ${r.next.human}   preclin ${r.declared.preclinical} -> ${r.next.preclinical}`);
}
const inflated = changed.filter((r) => r.declared.count > r.next.count).length;
const understated = changed.filter((r) => r.declared.count < r.next.count).length;
console.log(`\noverstated: ${inflated}   understated: ${understated}   unchanged count: ${changed.length - inflated - understated}`);
console.log(`openAccess: ${oaResolved ? 'refreshed from PMC' : 'NOT refreshed this run — existing values preserved'}`);
console.log(`declared total across site: ${rows.reduce((a, r) => a + (r.declared.count || 0), 0)} -> ${rows.reduce((a, r) => a + r.next.count, 0)}`);

if (!APPLY) { console.log('\nNo files written. Re-run with --apply.'); process.exit(0); }

let wrote = 0;
const skipped = [];
for (const r of changed) {
  let out = r.raw;
  /* LINE ENDINGS. 85 of 102 dossiers are CRLF (OneDrive + Windows). A `\n` in the block regex
   * matches none of them, so the first run of this script silently skipped exactly those 85 while
   * reporting "Wrote 102 dossiers" — a false completion claim produced by the script's own
   * bookkeeping rather than by the edit. Match either ending, and write back with the ending the
   * file already had so this does not churn every line in the diff. */
  const eol = out.includes('\r\n') ? '\r\n' : '\n';
  const block = out.match(/^sources:\r?\n(?:[ \t]+\w+: *-?\d+\r?\n)+/m);
  if (!block) { skipped.push(r.slug); continue; }

  const rebuilt = ['sources:',
    `  count: ${r.next.count}`,
    `  human: ${r.next.human}`,
    `  preclinical: ${r.next.preclinical}`,
    `  openAccess: ${r.next.openAccess}`, ''].join(eol);
  out = out.replace(block[0], rebuilt);

  /* The count is also baked into SEO text on 56 dossiers — "Alpha-Defensins: 200 Studies Reviewed
   * (2026)" and "covering 28 citations". Those render in search results, so correcting only the
   * structured field would leave the inflated number as the most public copy on the page. */
  out = out.replace(/(metaTitle: *['"][^'"]*?)\b\d+ Studies Reviewed/g, `$1${r.next.count} Studies Reviewed`);
  out = out.replace(/(metaTitle: *['"][^'"]*?)\b\d+ Sources Reviewed/g, `$1${r.next.count} Sources Reviewed`);
  out = out.replace(/covering \d+ citations/g, `covering ${r.next.count} citations`);
  out = out.replace(/covering \d+ sources/g, `covering ${r.next.count} sources`);
  out = out.replace(/based on \d+ cited sources/gi, `based on ${r.next.count} cited sources`);

  fs.writeFileSync(r.file, out);
  wrote++;
}
/* Report what happened, not what was attempted. */
console.log(`\nWrote ${wrote} dossiers; skipped ${skipped.length}.`);
if (skipped.length) {
  console.error('SKIPPED (sources block not in the expected shape) — these are NOT fixed:');
  skipped.forEach((s) => console.error(`  ${s}`));
  process.exitCode = 1;
}
