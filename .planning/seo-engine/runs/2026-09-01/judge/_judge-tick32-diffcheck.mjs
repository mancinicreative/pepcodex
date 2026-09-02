import { execSync } from 'node:child_process';

const d = execSync('git diff HEAD -- src/content/comparisons/wegovy-vs-zepbound.mdx', { encoding: 'utf8' });
const lines = d.split(/\r?\n/);
const removed = lines.filter((l) => l.startsWith('-') && !l.startsWith('---')).join('\n');
const added = lines.filter((l) => l.startsWith('+') && !l.startsWith('+++')).join('\n');
console.log('DIFF TOTAL LINES:', lines.length);

const pats = ['67', '76/68', 'over 60', '20% MACE', '20% reduction', '4,500', '5,000', '12\u201315', '15\u201318', '44%', 'census', 'OSA', '63'];
for (const p of pats) {
  const esc = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('.{0,70}' + esc + '.{0,90}', 'gi');
  const rm = removed.match(re);
  const ad = added.match(re);
  console.log(`PATTERN ${JSON.stringify(p)} | removed-lines hits: ${rm ? rm.length : 0} | added-lines hits: ${ad ? ad.length : 0}`);
  if (ad) for (const a of ad.slice(0, 3)) console.log('   ADDED CTX:', a.replace(/\s+/g, ' '));
}
