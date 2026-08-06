/**
 * Apply repairs to data/source-packs/*.json `sources[]`.
 *
 * DECISION TABLE:
 *   OK                    -> keep, stamp provenance
 *   DOI_WRONG             -> replace the DOI with PubMed's (authoritative via articleids)
 *   METADATA_WRONG        -> right paper, invented title/journal/year -> overwrite all from PubMed
 *   RESOLVED (by corpus)  -> attach the verified PMID/DOI and PubMed's real title/journal/year
 *   REVIEW / PHANTOM      -> DELETE. The stored identifier is fabricated AND no paper matching the
 *                            stored title exists in that peptide's PubMed corpus. Kept records are
 *                            read by content agents as verified input, so an unverifiable record is
 *                            actively harmful; sources[] renders nowhere, so removal costs no page.
 *   UNRELATED (unresolved)-> DELETE, same reasoning.
 *
 * Everything deleted is written to a re-sourcing worklist so the claim can be re-cited properly
 * rather than quietly vanishing.
 *
 * Dry-run by default. Pass --apply to write.
 */
import fs from 'fs';
import path from 'path';

const APPLY = process.argv.includes('--apply');
const OUT_DIR = '.planning/citation-audit';
const verification = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'source-verification.json'), 'utf-8'));
const resolution = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'source-resolution.json'), 'utf-8'));

const key = (r) => `${r.file}#${r.index}`;
const resolved = new Map();
for (const r of resolution) resolved.set(key(r), r);

const TODAY = new Date().toISOString().slice(0, 10);
const decisions = [];
for (const v of verification) {
  const res = resolved.get(key(v));
  if (v.klass === 'OK') decisions.push({ ...v, action: 'KEEP' });
  else if (v.klass === 'DOI_WRONG') decisions.push({ ...v, action: 'FIX_DOI' });
  else if (v.klass === 'METADATA_WRONG') decisions.push({ ...v, action: 'FIX_META' });
  else if (res?.verdict === 'RESOLVED') decisions.push({ ...v, action: 'ATTACH', match: res.match });
  else decisions.push({ ...v, action: 'DELETE', why: res ? `${v.klass}/${res.verdict}` : v.klass });
}

const byFile = {};
for (const d of decisions) (byFile[d.file] ||= []).push(d);

const worklist = [];
let kept = 0, fixedDoi = 0, fixedMeta = 0, attached = 0, deleted = 0;

for (const [file, items] of Object.entries(byFile)) {
  const pack = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const sources = pack.sources || [];
  const drop = new Set();

  for (const it of items) {
    const s = sources[it.index];
    if (!s) continue;
    if (it.action === 'DELETE') {
      drop.add(it.index);
      deleted++;
      worklist.push({ slug: it.slug, title: it.title, storedPmid: it.pmid, storedDoi: it.doi, why: it.why });
      continue;
    }
    if (it.action === 'KEEP') { kept++; }
    if (it.action === 'FIX_DOI') {
      if (it.realDoi) { s.doi = it.realDoi; fixedDoi++; } else { delete s.doi; fixedDoi++; }
    }
    if (it.action === 'FIX_META') {
      if (it.realTitle) s.title = it.realTitle;
      if (it.realJournal) s.journal = it.realJournal;
      if (it.realYear) s.year = Number(it.realYear) || it.realYear;
      if (it.realAuthors) s.authors = it.realAuthors;
      if (it.realDoi) s.doi = it.realDoi; else delete s.doi;
      fixedMeta++;
    }
    if (it.action === 'ATTACH') {
      s.pmid = it.match.pmid;
      s.title = it.match.title;
      if (it.match.journal) s.journal = it.match.journal;
      if (it.match.year) s.year = Number(it.match.year) || it.match.year;
      if (it.match.authors) s.authors = it.match.authors;
      if (it.match.doi) s.doi = it.match.doi; else delete s.doi;
      attached++;
    }
    s.verifiedAt = TODAY;
    s.verifiedAgainst = 'pubmed/esummary';
  }

  pack.sources = sources.filter((_, i) => !drop.has(i));
  if (pack.metadata?.sourceCounts) delete pack.metadata.sourceCounts; // stale, contradicted the array
  if (APPLY) fs.writeFileSync(file, JSON.stringify(pack, null, 2) + '\n');
}

console.log(`${APPLY ? 'APPLIED' : 'DRY RUN'} — kept ${kept} · doi fixed ${fixedDoi} · metadata fixed ${fixedMeta} · pmid attached ${attached} · deleted ${deleted}`);
console.log('\nper pack:');
for (const [file, items] of Object.entries(byFile)) {
  const c = items.reduce((a, i) => ((a[i.action] = (a[i.action] || 0) + 1), a), {});
  console.log(`  ${path.basename(file).padEnd(20)} ${JSON.stringify(c)}`);
}
if (APPLY) {
  fs.writeFileSync(path.join(OUT_DIR, 'sources-to-recite.json'), JSON.stringify(worklist, null, 2));
  console.log(`\nWrote ${OUT_DIR}/sources-to-recite.json (${worklist.length} claims needing a real citation)`);
}
if (!APPLY) console.log('\nNo files written. Re-run with --apply.');
