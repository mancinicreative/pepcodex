import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

// Read-only sample from the ten GSC detail URLs relayed by the coordinator.
// Do not infer the eleventh URL or treat this as the complete site inventory.
const slugs = ['liraglutide', 'mazdutide', 'humanin', 'hcg', 'cagrilintide', 'tb-500', 'semaglutide', 'pt-141', 'dsip', 'll-37'];
const startedAt = new Date().toISOString();
const directory = path.resolve('.planning/growth-program/runs/2026-09-05-r05-schema/live', startedAt.replaceAll(':', '-'));
await fs.mkdir(directory, { recursive: true });
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(m => [m[1].toLowerCase(), m[2] ?? m[3]]));
function types(value, found = []) {
  if (value && typeof value === 'object') {
    if (value['@type']) found.push(...[value['@type']].flat());
    for (const child of Object.values(value)) types(child, found);
  }
  return found;
}
async function inspect(slug) {
  const url = `https://www.pepcodex.com/peptides/${slug}`;
  const fetchedAt = new Date().toISOString();
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    const html = await response.text();
    await fs.writeFile(path.join(directory, `${slug}.html`), html);
    const ld = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
      .filter(m => attrs(m[1]).type === 'application/ld+json')
      .map(m => { try { return { data: JSON.parse(m[2]) }; } catch { return { parseError: true }; } });
    const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(m => attrs(m[0]));
    const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map(m => attrs(m[0]));
    return {
      url, fetchedAt, status: response.status, finalUrl: response.url,
      canonical: links.filter(x => x.rel?.toLowerCase() === 'canonical').map(x => x.href),
      metaRobots: meta.filter(x => /^(robots|googlebot)$/i.test(x.name || '')).map(x => ({ name: x.name, content: x.content })),
      xRobotsTag: response.headers.get('x-robots-tag'),
      htmlSha256: createHash('sha256').update(html).digest('hex'),
      types: [...new Set(ld.flatMap(x => types(x.data)))], jsonLd: ld,
    };
  } catch (error) {
    return { url, fetchedAt, outcome: 'FAILED', errorType: error?.name || 'Error' };
  }
}
const pages = [];
for (let i = 0; i < slugs.length; i += 2) {
  const batch = await Promise.allSettled(slugs.slice(i, i + 2).map(inspect));
  for (const result of batch) {
    if (result.status !== 'fulfilled') throw new Error('Unexpected inspection failure');
    pages.push(result.value);
    console.log(JSON.stringify({ url: result.value.url, status: result.value.status, types: result.value.types, outcome: result.value.outcome }));
  }
}
const report = {
  startedAt, completedAt: new Date().toISOString(), method: 'public GET; no browser or account mutation',
  selectionSource: 'Coordinator relayed GSC Product snippets detail: 10 visible URLs, reported total 11 invalid items, report updated 2026-09-03. This script did not independently access GSC.',
  unknownEleventhItem: true, coverage: '10 known URLs; GSC item inventory incomplete', pages,
};
await fs.writeFile(path.join(directory, 'LIVE-SCHEMA.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`REPORT=${path.join(directory, 'LIVE-SCHEMA.json')}`);
process.exitCode = pages.every(page => page.status === 200 && page.jsonLd.every(node => !node.parseError)) ? 0 : 1;
