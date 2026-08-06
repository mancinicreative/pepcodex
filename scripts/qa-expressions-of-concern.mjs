/**
 * Flag cited papers that carry an Expression of Concern, a correction, or a retraction notice.
 *
 * WHY THIS IS SEPARATE FROM qa-retractions: that gate matches PMIDs against the Retraction Watch
 * database, which lists papers that have been RETRACTED. An Expression of Concern is a weaker and
 * far more common signal — the editors are telling readers that the reliability of the paper is
 * under question while the investigation runs. The paper is still published, still resolves, still
 * says what it said. Every citation check on this site passes it.
 *
 * That gap surfaced on a page whose entire point was a correction. The exenatide dossier's most
 * valuable paragraph is that a 2017 phase 2 Parkinson's signal (PMID 28781108) failed to replicate
 * in the 2025 phase 3 (PMID 39919773) — and the phase 3 carries an Expression of Concern from the
 * Lancet editors (PMID 42330995, 27 June 2026), which states no reason. Citing the null result to
 * correct the internet, while not mentioning that the null result is itself under editorial
 * question, would have been its own species of overclaim.
 *
 * PubMed records this in the CommentsCorrections block of the CITED paper, so it is discoverable
 * without any external database: efetch each PMID we cite and read the back-references.
 *
 * This REPORTS and never edits. An Expression of Concern is not grounds to delete a citation —
 * it is grounds to say so on the page.
 *
 * Usage: node scripts/qa-expressions-of-concern.mjs [--strict]
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const STRICT = process.argv.includes('--strict');
const UA = { 'User-Agent': 'PepCodex-eoc/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Back-reference types worth surfacing, and what each means to a reader.
 * "CommentIn" is deliberately EXCLUDED: a commentary or editorial responding to a paper is normal
 * scientific discourse and says nothing about reliability. Flagging it would bury the signals that
 * matter — the FOXO4-DRI paper was once flagged purely for having a comment attached. */
const CONCERN_TYPES = {
  ExpressionOfConcernIn: 'editors have published an Expression of Concern about this paper',
  RetractionIn: 'this paper has been RETRACTED',
  ErratumIn: 'this paper has a published erratum',
  CorrectedandRepublishedIn: 'this paper was corrected and republished',
  RepublishedIn: 'this paper was republished',
};

// ---- every PMID the site cites, from the verification ledger ----------------------------------
const ledger = JSON.parse(fs.readFileSync('verification/ledger.json', 'utf-8'));
const pmids = [];
const whereCited = new Map();
for (const e of Object.values(ledger.entries)) {
  if (e.type !== 'PMID' || e.verdict !== 'exists') continue;
  pmids.push(String(e.id));
  whereCited.set(String(e.id), [...new Set((e.locations || []).map((l) => l.file))]);
}
console.log(`Checking ${pmids.length} cited PMIDs for editorial concern notices...`);

const findings = [];
let failed = 0;
for (let i = 0; i < pmids.length; i += 100) {
  const batch = pmids.slice(i, i + 100);
  let ok = false;
  for (let attempt = 0; attempt < 3 && !ok; attempt++) {
    if (attempt) await sleep(1200 * attempt);
    try {
      const r = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&id=${batch.join(',')}`,
        { headers: UA });
      if (!r.ok) continue;
      const xml = await r.text();
      for (const chunk of xml.split(/<PubmedArticle[ >]/).slice(1)) {
        const pm = (chunk.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
        if (!pm) continue;
        for (const [type, meaning] of Object.entries(CONCERN_TYPES)) {
          const m = chunk.match(new RegExp(`RefType="${type}"[\\s\\S]{0,400}?<RefSource>([^<]*)</RefSource>(?:[\\s\\S]{0,120}?<PMID[^>]*>(\\d+)</PMID>)?`));
          if (m) {
            findings.push({ pmid: pm, type, meaning, notice: m[1], noticePmid: m[2] || null,
              files: whereCited.get(pm) || [] });
          }
        }
      }
      ok = true;
    } catch { /* retry */ }
  }
  if (!ok) failed++;
  process.stdout.write(ok ? '.' : 'x');
  await sleep(380);
}
console.log('');

/* A failed batch means we did not look, which is not the same as finding nothing. Say so. */
if (failed) {
  console.warn(`\nWARNING: ${failed} batch(es) failed — this report is INCOMPLETE. Re-run before relying on it.`);
}

const serious = findings.filter((f) => f.type === 'ExpressionOfConcernIn' || f.type === 'RetractionIn');
const minor = findings.filter((f) => !serious.includes(f));

fs.mkdirSync('.planning/citation-audit', { recursive: true });
fs.writeFileSync('.planning/citation-audit/editorial-concerns.json', JSON.stringify(findings, null, 2) + '\n');

console.log(`\nChecked ${pmids.length} PMIDs. Expressions of Concern / retractions: ${serious.length}. Errata: ${minor.length}.`);

if (serious.length) {
  console.error('\nEDITORIAL CONCERN on cited papers — the page should SAY SO, not drop the citation:\n');
  for (const f of serious) {
    console.error(`  • PMID ${f.pmid} — ${f.meaning}`);
    console.error(`      notice: ${f.notice}${f.noticePmid ? ` (PMID ${f.noticePmid})` : ''}`);
    console.error(`      cited in: ${f.files.slice(0, 4).join(', ')}${f.files.length > 4 ? ` +${f.files.length - 4} more` : ''}`);
  }
}
if (minor.length) {
  console.warn(`\nErrata on ${minor.length} cited paper(s) — check the corrected values are the ones quoted:`);
  for (const f of minor.slice(0, 15)) console.warn(`  • PMID ${f.pmid}: ${f.notice}`);
}
if (!findings.length) console.log('\nPASS: no editorial concern notices on any cited paper.');
console.log(`\nWritten to .planning/citation-audit/editorial-concerns.json`);
process.exit(STRICT && serious.length ? 1 : 0);
