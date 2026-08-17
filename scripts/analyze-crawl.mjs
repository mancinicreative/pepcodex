// Summarises crawl-baseline.json by site section. Read-only analysis.
import fs from 'fs';

const rows = JSON.parse(fs.readFileSync('.planning/data/crawl-baseline.json', 'utf-8'));
const section = (u) => {
  const p = new URL(u).pathname.split('/').filter(Boolean);
  return p.length ? `/${p[0]}/` : '/(home)';
};
const med = (a) => {
  const b = [...a].sort((x, y) => x - y);
  return b.length ? b[Math.floor(b.length / 2)] : 0;
};

const g = {};
for (const r of rows) {
  const s = section(r.url);
  g[s] ??= { n: 0, long: 0, tl: [], wc: [], il: [] };
  g[s].n++;
  if (r.titleLen > 60) g[s].long++;
  g[s].tl.push(r.titleLen);
  g[s].wc.push(r.wordCount);
  g[s].il.push(r.internalLinks);
}

console.log('SECTION          PAGES  >60ch     %  medTitle  medWords  medLinks');
for (const [s, v] of Object.entries(g).sort((a, b) => b[1].n - a[1].n)) {
  console.log(
    s.padEnd(16) +
      String(v.n).padStart(6) +
      String(v.long).padStart(7) +
      String(Math.round((v.long / v.n) * 100)).padStart(6) +
      String(med(v.tl)).padStart(10) +
      String(med(v.wc)).padStart(10) +
      String(med(v.il)).padStart(10)
  );
}

const lens = rows.map((r) => r.titleLen).sort((a, b) => a - b);
console.log(
  `\nTitle length — min ${lens[0]} | median ${lens[Math.floor(lens.length / 2)]} | p90 ${lens[Math.floor(lens.length * 0.9)]} | max ${lens.at(-1)}`
);

console.log('\nWorst title overflows:');
rows
  .filter((r) => r.titleLen > 75)
  .sort((a, b) => b.titleLen - a.titleLen)
  .slice(0, 6)
  .forEach((r) => console.log(`  ${String(r.titleLen).padStart(3)}  ${r.title.slice(0, 84)}`));

const wc = rows.map((r) => r.wordCount).sort((a, b) => a - b);
console.log(
  `\nWord count — p10 ${wc[Math.floor(wc.length * 0.1)]} | median ${wc[Math.floor(wc.length / 2)]} | p90 ${wc[Math.floor(wc.length * 0.9)]}`
);

const il = rows.map((r) => r.internalLinks).sort((a, b) => a - b);
console.log(
  `Internal links — p10 ${il[Math.floor(il.length * 0.1)]} | median ${il[Math.floor(il.length / 2)]} | p90 ${il[Math.floor(il.length * 0.9)]}`
);

const dup = Object.entries(
  rows.reduce((a, r) => {
    (a[r.title] ??= []).push(r.url);
    return a;
  }, {})
).filter(([, v]) => v.length > 1);
console.log(`\nDuplicate titles: ${dup.length} group(s)`);
dup.forEach(([t, us]) => {
  console.log(`  "${t.slice(0, 70)}"`);
  us.forEach((u) => console.log(`     ${u}`));
});

const redir = rows.filter((r) => r.redirectedTo);
console.log(`\nRedirected: ${redir.length}`);
redir.forEach((r) => console.log(`  ${r.url}\n    -> ${r.redirectedTo}`));
