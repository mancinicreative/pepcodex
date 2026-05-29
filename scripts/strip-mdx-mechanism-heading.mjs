#!/usr/bin/env node
/**
 * One-off: remove the redundant inline mechanism heading from dossier MDX bodies.
 * The dossier specimen-sheet layout now renders the section title in the
 * left-margin editorial aside, so the leading
 *   <h2 id="mechanism-of-action">Mechanism of Action</h2>
 * inside the MDX body is duplicate chrome. The wrapping <section> carries the
 * `mechanism-of-action` anchor id instead. Strips ONLY that exact line (plus a
 * trailing blank line) so the body opens directly with its prose.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(process.cwd(), 'src', 'content', 'peptides');
const RE = /<h2 id="mechanism-of-action">Mechanism of Action<\/h2>\r?\n(\r?\n)?/;

let changed = 0;
for (const e of readdirSync(dir)) {
  if (!e.endsWith('.mdx')) continue;
  const p = join(dir, e);
  const before = readFileSync(p, 'utf8');
  const after = before.replace(RE, '');
  if (after !== before) { writeFileSync(p, after); changed++; }
}
console.log(`Mechanism headings stripped: ${changed}`);
