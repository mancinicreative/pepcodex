/**
 * Strip all dosing information from comparison MDX files.
 *
 * Removes:
 * - Entire sections with "Dosing", "Dose", "Protocol" in headings
 * - Table rows with dose amounts, frequencies, timing
 * - Leaves route/administration info intact
 * - Cleans up empty tables and consecutive blank lines
 */

const fs = require('fs');
const path = require('path');

const comparisonsDir = path.join(__dirname, '..', 'src', 'content', 'comparisons');
const files = fs.readdirSync(comparisonsDir).filter(f => f.endsWith('.mdx'));

// Section headings to remove entirely (## or ### level)
const sectionRemovePatterns = [
  /^(#{2,3})\s+.*\b[Dd]os(ing|e|age)\b/,
  /^(#{2,3})\s+.*\b[Pp]rotocol\b/,
  /^(#{2,3})\s+.*\b[Dd]ose\s+[Ff]ormulation/,
];

// Table row patterns to remove (prescriptive dosing info)
const rowRemovePatterns = [
  /^\|\s*\*\*(?:Typical Dose|Dosing|Dose|Dose Range|Standard Dose|Common Dose|Recommended Dose)\*\*/i,
  /^\|\s*\*\*(?:Maximum Dose|Max Dose|Max dose|Target Dose|Starting dose|Doses Available|Dose Required|Higher doses)\*\*/i,
  /^\|\s*\*\*(?:Maximum dose|Max dose studied)\*\*/i,
  /^\|\s*\*\*Titration\b/i,
  /^\|\s*\*\*Frequency\*\*/i,
  /^\|\s*\*\*Timing\*\*/i,
  /^\|\s*Use\s*\|\s*Typical Dose/i,
  /^\|\s*\*\*Components\*\*\s*\|.*\d+(\.\d+)?\s*mg/i,
  // Dosing frequency / schedule rows
  /^\|\s*\*\*Dosing [Ff]requency\*\*/i,
  /^\|\s*\*\*Dosing \(research\)\*\*/i,
  /^\|\s*\*\*Dosing \(clinical\)\*\*/i,
  /^\|\s*\*\*Dosing [Ff]lexibility\*\*/i,
  /^\|\s*\*\*Exogenous dosing\*\*/i,
  /^\|\s*\*\*Repeated dosing\b/i,
  /^\|\s*\*\*Missed [Dd]ose\*\*/i,
  /^\|\s*\*\*Post-dose\b/i,
  /^\|\s*\*\*Weekly dosing\*\*/i,
  /^\|\s*\*\*Dose [Oo]ptions\*\*/i,
  /^\|\s*\*\*Dose [Nn]eeded\*\*/i,
  /^\|\s*\*\*Doses\*\*\s*\|.*\d+(\.\d+)?\s*mg/i, // "Doses" row with specific mg values
  /^\|\s*\*\*Titration [Pp]eriod\*\*/i,
];

// Table header rows that are part of dosing tables
const dosingTableHeaderPatterns = [
  /^\|\s*(?:Indication|Use|Parameter)\s*\|\s*(?:Typical )?Dose/i,
];

let totalFilesModified = 0;
let totalLinesRemoved = 0;
const modifiedFiles = [];

for (const file of files) {
  const filePath = path.join(comparisonsDir, file);
  const original = fs.readFileSync(filePath, 'utf8');
  const lines = original.split('\n');
  const output = [];

  let skipUntilLevel = null; // heading level we're skipping until
  let inDosingTable = false;
  let linesRemoved = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if we hit a heading
    const headingMatch = line.match(/^(#{1,4})\s/);

    if (headingMatch) {
      const level = headingMatch[1].length;

      // If we were skipping a section, check if this heading ends it
      if (skipUntilLevel !== null) {
        if (level <= skipUntilLevel) {
          // This heading is same level or higher — stop skipping
          skipUntilLevel = null;
        } else {
          // Sub-heading within skipped section — skip it too
          linesRemoved++;
          continue;
        }
      }

      // Check if this heading starts a dosing section
      const shouldRemove = sectionRemovePatterns.some(p => p.test(line));
      if (shouldRemove) {
        skipUntilLevel = level;
        linesRemoved++;
        continue;
      }
    }

    // If we're in a skipped section, skip this line
    if (skipUntilLevel !== null) {
      linesRemoved++;
      continue;
    }

    // Check for dosing table headers
    if (dosingTableHeaderPatterns.some(p => p.test(line))) {
      inDosingTable = true;
      linesRemoved++;
      continue;
    }

    // If in a dosing table, skip until we hit a non-table line
    if (inDosingTable) {
      if (line.startsWith('|') || line.match(/^\s*$/)) {
        linesRemoved++;
        continue;
      } else {
        inDosingTable = false;
      }
    }

    // Check for individual dosing table rows to remove
    const shouldRemoveRow = rowRemovePatterns.some(p => p.test(line));
    if (shouldRemoveRow) {
      linesRemoved++;
      continue;
    }

    output.push(line);
  }

  // Clean up empty tables (header + separator with no data rows)
  const cleaned = cleanEmptyTables(output);

  // Clean up consecutive blank lines (max 2)
  const final = cleanBlankLines(cleaned);

  const result = final.join('\n');

  if (result !== original) {
    fs.writeFileSync(filePath, result, 'utf8');
    totalFilesModified++;
    totalLinesRemoved += linesRemoved;
    modifiedFiles.push({ file, linesRemoved });
  }
}

function cleanEmptyTables(lines) {
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    // Check for table header + separator with no data rows
    if (
      lines[i] && lines[i].startsWith('|') &&
      lines[i + 1] && lines[i + 1].match(/^\|[\s\-:]+\|/) &&
      (!lines[i + 2] || !lines[i + 2].startsWith('|'))
    ) {
      // Empty table — skip header and separator
      i++; // skip separator too
      continue;
    }
    result.push(lines[i]);
  }
  return result;
}

function cleanBlankLines(lines) {
  const result = [];
  let blankCount = 0;
  for (const line of lines) {
    if (line.trim() === '') {
      blankCount++;
      if (blankCount <= 2) {
        result.push(line);
      }
    } else {
      blankCount = 0;
      result.push(line);
    }
  }
  return result;
}

console.log(`\n=== DOSING STRIP COMPLETE ===`);
console.log(`Files scanned: ${files.length}`);
console.log(`Files modified: ${totalFilesModified}`);
console.log(`Total lines removed: ${totalLinesRemoved}`);
console.log(`\nModified files:`);
modifiedFiles.forEach(({ file, linesRemoved }) => {
  console.log(`  ${file}: -${linesRemoved} lines`);
});
