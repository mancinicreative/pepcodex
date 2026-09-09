#!/usr/bin/env node
/**
 * Read-only known-template review queue. No pages are rewritten or certified.
 * node scripts/qa-comparison-semantics.mjs [--strict] [--json] [--file slug.mdx ...]
 * No --file means the current comparison collection. --strict fails on findings.
 * This supplements numeric agreement checks; it is not a complete content audit.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import matter from 'gray-matter';
import {inspectComparisonSemantics} from './lib/comparison-semantics.mjs';

const args = process.argv.slice(2), selected = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--strict' || args[i] === '--json') continue;
  if (args[i] !== '--file' || !args[i+1] || !/^[a-z0-9-]+\.mdx$/.test(args[i+1])) throw new Error('Use --strict, --json, or --file <comparison-slug.mdx>.');
  selected.push(args[++i]);
}
const directory = 'src/content/comparisons';
const files = [...new Set(selected.length ? selected : fs.readdirSync(directory).filter(x=>x.endsWith('.mdx')))].sort();
const cache = new Map(), inputs = [];
function read(file) {
  const raw = fs.readFileSync(file);
  inputs.push({path:file.replaceAll('\\','/'),sha256:crypto.createHash('sha256').update(raw).digest('hex')});
  return matter(raw.toString('utf8')).data;
}
function dossier(slug) {
  if (typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) return undefined;
  if (!cache.has(slug)) {
    const file = path.join('src/content/peptides',`${slug}.mdx`);
    cache.set(slug,fs.existsSync(file) ? read(file) : undefined);
  }
  return cache.get(slug);
}
const findings = [];
let faqAnswers = 0;
for (const file of files) {
  const page = read(path.join(directory,file));
  faqAnswers += page.faqs?.length || 0;
  for (const finding of inspectComparisonSemantics(page,dossier(page.peptideA),dossier(page.peptideB))) findings.push({file,...finding});
}
const report = {
  checked_at:new Date().toISOString(),pages:files.length,faqAnswers,
  status:findings.length ? 'REVIEW_REQUIRED' : 'NO_KNOWN_TEMPLATE_FINDINGS',
  affectedPages:new Set(findings.map(x=>x.file)).size,
  findings,inputs,
  limits:['Exact known FAQ templates only; no body/table/metadata or exhaustive semantic audit.','Source counts and grades are inventory data, not evidence of comparative efficacy.','No production, source-level, editorial or whole-page acceptance is implied.'],
};
if (args.includes('--json')) console.log(JSON.stringify(report,null,2));
else {
  console.log(`${report.status}: ${files.length} pages; ${findings.length} review signals across ${report.affectedPages} pages.`);
  for (const f of findings.slice(0,40)) console.log(`${f.file}: ${f.code}: ${f.detail}`);
  if (findings.length > 40) console.log(`Showing 40 of ${findings.length}; use --json for the complete queue.`);
}
process.exitCode = args.includes('--strict') && findings.length ? 1 : 0;
