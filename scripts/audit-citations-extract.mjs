#!/usr/bin/env node
/**
 * Citation Integrity Audit — EXTRACTION pass (read-only).
 *
 * Scans every canonical peptide dossier (excludes OneDrive " N.mdx" conflict
 * copies), and extracts every PMID occurrence with:
 *   - file, line number, raw line
 *   - whether the PMID sits inside the `scoring:` frontmatter block
 *   - a short surrounding-context snippet (for claim matching)
 *
 * Writes a machine-readable manifest to .planning/citation-audit/extract.json
 * and a human summary to .planning/citation-audit/extract.md.
 *
 * NO network calls here. NO edits. Pure read + extract.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PEPTIDES_DIR = path.join(ROOT, 'src/content/peptides');
const OUT_DIR = path.join(ROOT, '.planning/citation-audit');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Exclude OneDrive conflict copies like "vilon 2.mdx", "endoluten 3.mdx"
const DUPE_RE = / \d+\.mdx$/;

const files = fs
  .readdirSync(PEPTIDES_DIR)
  .filter((f) => f.endsWith('.mdx') && !DUPE_RE.test(f))
  .sort();

const PMID_INLINE_RE = /\b(?:pmid|PMID)\s*[:=]?\s*["']?(\d{4,8})\b/g;
// also catch bare pubmed URLs
const PMID_URL_RE = /pubmed\.ncbi\.nlm\.nih\.gov\/(\d{4,8})/g;

const records = [];
const perFile = [];

for (const file of files) {
  const full = path.join(PEPTIDES_DIR, file);
  const raw = fs.readFileSync(full, 'utf8');
  const lines = raw.split(/\r?\n/);

  // Locate frontmatter boundaries (first two '---' lines)
  let fmStart = -1;
  let fmEnd = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (fmStart === -1) fmStart = i;
      else {
        fmEnd = i;
        break;
      }
    }
  }

  // Locate the `scoring:` block within frontmatter. It is a top-level key
  // (column-0 "scoring:") OR nested. We treat the scoring block as the region
  // from a line matching /^\s*scoring:/ until the next line at the SAME OR
  // LOWER indentation that starts a new key (or frontmatter end).
  let scoringStart = -1;
  let scoringEnd = -1;
  let scoringIndent = -1;
  const fmLimit = fmEnd === -1 ? lines.length : fmEnd;
  for (let i = fmStart + 1; i < fmLimit; i++) {
    const m = lines[i].match(/^(\s*)scoring:\s*$/);
    if (m) {
      scoringStart = i;
      scoringIndent = m[1].length;
      break;
    }
  }
  if (scoringStart !== -1) {
    scoringEnd = fmLimit; // default: to end of frontmatter
    for (let i = scoringStart + 1; i < fmLimit; i++) {
      const line = lines[i];
      if (line.trim() === '') continue;
      const indent = line.match(/^(\s*)/)[1].length;
      // a new key at same-or-lower indentation ends the scoring block
      if (indent <= scoringIndent && /^\s*[\w"-]/.test(line)) {
        scoringEnd = i;
        break;
      }
    }
  }

  const fileRecords = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const inScoring =
      scoringStart !== -1 && i > scoringStart && i < scoringEnd;
    const inFrontmatter = fmStart !== -1 && i > fmStart && i < fmLimit;

    let m;
    PMID_INLINE_RE.lastIndex = 0;
    while ((m = PMID_INLINE_RE.exec(line)) !== null) {
      fileRecords.push(makeRec(file, i, lines, m[1], inScoring, inFrontmatter, 'pmid-field'));
    }
    PMID_URL_RE.lastIndex = 0;
    while ((m = PMID_URL_RE.exec(line)) !== null) {
      fileRecords.push(makeRec(file, i, lines, m[1], inScoring, inFrontmatter, 'pubmed-url'));
    }
  }

  records.push(...fileRecords);
  perFile.push({
    file,
    scoringStart: scoringStart + 1, // 1-based for humans
    scoringEnd: scoringEnd === -1 ? null : scoringEnd,
    total: fileRecords.length,
    inScoring: fileRecords.filter((r) => r.inScoring).length,
    bodyOrCitations: fileRecords.filter((r) => !r.inScoring).length,
  });
}

function makeRec(file, idx, lines, pmid, inScoring, inFrontmatter, kind) {
  const ctxStart = Math.max(0, idx - 2);
  const ctxEnd = Math.min(lines.length - 1, idx + 2);
  const context = lines.slice(ctxStart, ctxEnd + 1).join(' ⏎ ').replace(/\s+/g, ' ').slice(0, 400);
  return {
    file,
    line: idx + 1,
    pmid,
    inScoring,
    inFrontmatter,
    kind,
    raw: lines[idx].trim().slice(0, 200),
    context,
  };
}

// Unique PMIDs that appear OUTSIDE the scoring block (the audit target)
const targetPmids = [
  ...new Set(records.filter((r) => !r.inScoring).map((r) => r.pmid)),
].sort();
const allPmids = [...new Set(records.map((r) => r.pmid))].sort();

fs.writeFileSync(
  path.join(OUT_DIR, 'extract.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), files: files.length, records, perFile, targetPmids, allPmids }, null, 2)
);

// Human summary
let md = `# Citation Audit — Extraction Pass\n\n`;
md += `Generated: ${new Date().toISOString()}\n\n`;
md += `Canonical dossiers scanned: **${files.length}**\n`;
md += `Total PMID occurrences: **${records.length}**\n`;
md += `Unique PMIDs (all): **${allPmids.length}**\n`;
md += `Unique PMIDs OUTSIDE scoring block (audit target): **${targetPmids.length}**\n\n`;
md += `## Per-file counts (non-scoring PMID occurrences)\n\n`;
md += `| File | scoring block lines | total PMIDs | in-scoring | body/citations |\n|---|---|---|---|---|\n`;
for (const f of perFile.sort((a, b) => b.bodyOrCitations - a.bodyOrCitations)) {
  const sc = f.scoringStart > 0 ? `${f.scoringStart}-${f.scoringEnd ?? '?'}` : 'none';
  md += `| ${f.file} | ${sc} | ${f.total} | ${f.inScoring} | ${f.bodyOrCitations} |\n`;
}
fs.writeFileSync(path.join(OUT_DIR, 'extract.md'), md);

console.log(`Scanned ${files.length} dossiers`);
console.log(`Total PMID occurrences: ${records.length}`);
console.log(`Unique PMIDs (all): ${allPmids.length}`);
console.log(`Unique target PMIDs (non-scoring): ${targetPmids.length}`);
console.log(`Wrote ${path.join('.planning/citation-audit', 'extract.json')} and extract.md`);
