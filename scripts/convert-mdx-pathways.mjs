#!/usr/bin/env node
/**
 * Roll out the chip-flow MechanismPathways treatment across dossiers.
 *
 * Reads each peptide MDX's "### Scientific Pathways" section. For every
 *   **Name** *(Label)*
 *   ```
 *   A → B → C ↓ Outcome
 *   ```
 * block that is a GENUINELY LINEAR chain, it lifts the chain into structured
 * frontmatter (`mechanismPathways`) and removes the ASCII block from the body.
 * Blocks that branch (tree characters ├ └ │ | +-- , ASCII `v`/`-->` diagrams,
 * or multiple divergent ↓) are LEFT UNTOUCHED — flattening them would
 * misrepresent the science. No new claims are introduced: text is only moved.
 *
 * Usage:
 *   node scripts/convert-mdx-pathways.mjs            # dry run (report only)
 *   node scripts/convert-mdx-pathways.mjs --apply    # write changes
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const APPLY = process.argv.includes('--apply');
const dir = join(process.cwd(), 'src', 'content', 'peptides');

// characters/markers that indicate a branching tree (not a single linear chain)
const BRANCH = /[├└│|┌┐┼]|\+--|-->|(^|\s)v(\s|$)/m;

function cleanNode(s) {
  return s.replace(/\s+/g, ' ').trim();
}

// Parse a fenced block's text into a linear chain, or return null if not linear.
function parseChain(raw) {
  const text = raw.replace(/\r/g, '');
  if (BRANCH.test(text)) return null;
  // collapse the optional "↓ outcome" continuation into the arrow chain
  // join all lines, turning ↓ into → so a multi-line vertical chain becomes one
  let flat = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join(' ');
  flat = flat.replace(/↓/g, '→');
  if (!flat.includes('→')) return null;
  const nodes = flat.split('→').map(cleanNode).filter(Boolean);
  if (nodes.length < 2) return null;
  // guard: nodes shouldn't be absurdly long (a sign of prose, not a chain)
  if (nodes.some((n) => n.length > 60)) return null;
  const outcome = nodes.pop();
  return { steps: nodes, outcome };
}

// YAML-quote a scalar safely (single-quoted, doubling internal quotes)
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;

function toYaml(pathways) {
  const lines = ['mechanismPathways:'];
  for (const p of pathways) {
    lines.push(`  - name: ${q(p.name)}`);
    if (p.label) lines.push(`    label: ${q(p.label)}`);
    lines.push('    steps:');
    for (const s of p.steps) lines.push(`      - ${q(s)}`);
    if (p.outcome) lines.push(`    outcome: ${q(p.outcome)}`);
    lines.push('    outcomeSignal: research');
  }
  return lines.join('\n');
}

let filesConverted = 0;
let pathwaysConverted = 0;
let filesPartial = 0;
const skipped = [];

for (const e of readdirSync(dir)) {
  if (!e.endsWith('.mdx')) continue;
  const p = join(dir, e);
  const original = readFileSync(p, 'utf8');
  const fmMatch = original.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) continue;
  let [, fm, body] = fmMatch;

  // already converted? skip to avoid duplicates
  if (/^mechanismPathways:/m.test(fm)) continue;

  // locate the Scientific Pathways section in the body
  const secRe = /(^|\n)### Scientific Pathways\s*\n([\s\S]*?)(?=\n### |\n## |$)/;
  const sec = body.match(secRe);
  if (!sec) continue;
  const sectionText = sec[2];

  // find **Name** *(Label)* followed by a fenced block
  const blockRe = /\*\*(.+?)\*\*(?:\s*\*\((.+?)\)\*)?\s*\n```[^\n]*\n([\s\S]*?)\n```/g;
  const parsed = [];
  const consumed = []; // raw block strings to remove from body
  let leftovers = 0;
  let m;
  while ((m = blockRe.exec(sectionText)) !== null) {
    const [full, name, label, fence] = m;
    const chain = parseChain(fence);
    if (chain) {
      parsed.push({ name: cleanNode(name), label: label ? cleanNode(label) : undefined, ...chain });
      consumed.push(full);
    } else {
      leftovers++;
    }
  }

  if (parsed.length === 0) {
    if (leftovers > 0) skipped.push(`${e} (${leftovers} branching)`);
    continue;
  }

  // remove consumed blocks from the body
  let newBody = body;
  for (const block of consumed) {
    newBody = newBody.replace(block + '\n\n', '');
    newBody = newBody.replace(block + '\n', '');
    newBody = newBody.replace(block, '');
  }
  // if no fenced blocks remain in the section, drop the now-bare heading
  const stillHasFence = (() => {
    const s2 = newBody.match(secRe);
    return s2 ? /```/.test(s2[2]) : false;
  })();
  if (!stillHasFence) {
    newBody = newBody.replace(/(^|\n)### Scientific Pathways\s*\n/, '$1');
  }
  // tidy excess blank lines
  newBody = newBody.replace(/\n{3,}/g, '\n\n');

  const newFm = `${fm}\n${toYaml(parsed)}`;
  const rebuilt = `---\n${newFm}\n---\n${newBody}`;

  filesConverted++;
  pathwaysConverted += parsed.length;
  if (leftovers > 0) filesPartial++;

  if (APPLY) writeFileSync(p, rebuilt);
}

console.log(`${APPLY ? 'APPLIED' : 'DRY RUN'}`);
console.log(`Files converted:      ${filesConverted}`);
console.log(`Pathways converted:   ${pathwaysConverted}`);
console.log(`Files partial (some branching kept): ${filesPartial}`);
console.log(`Files skipped (only branching pathways): ${skipped.length}`);
if (skipped.length) console.log('  ' + skipped.join('\n  '));
