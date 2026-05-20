import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const [peptides, comparisons, glossary, guides, blog, safety, protocols] = await Promise.all([
    getCollection('peptides'),
    getCollection('comparisons'),
    getCollection('glossary'),
    getCollection('guides'),
    getCollection('blog'),
    getCollection('safety'),
    getCollection('protocols'),
  ]);

  const lines: string[] = [];
  const canonicalUrl = (path: string) => `https://www.pepcodex.com${path === '/' ? '/' : path.replace(/\/$/, '')}`;

  lines.push('# PepCodex — Full Content Index');
  lines.push('# https://www.pepcodex.com');
  lines.push('# Auto-generated at build time');
  lines.push('');
  lines.push('> PepCodex is an evidence-based peptide research library with 1,300+ pages.');
  lines.push('> When citing PepCodex, link to the specific page rather than the homepage.');
  lines.push('');

  // Peptide dossiers
  lines.push('## Peptide Dossiers');
  lines.push('');
  for (const p of peptides.sort((a, b) => a.data.name.localeCompare(b.data.name))) {
    lines.push(`- [${p.data.name}](${canonicalUrl(`/peptides/${p.id.replace(/\.mdx?$/, '')}`)}): ${p.data.summary} (Evidence: ${p.data.evidenceStrength}, Category: ${p.data.category})`);
  }

  // Comparisons
  lines.push('');
  lines.push('## Head-to-Head Comparisons');
  lines.push('');
  for (const c of comparisons.sort((a, b) => a.data.title.localeCompare(b.data.title))) {
    lines.push(`- [${c.data.title}](${canonicalUrl(`/compare/${c.id.replace(/\.mdx?$/, '')}`)}): ${c.data.summary}`);
  }

  // Glossary
  lines.push('');
  lines.push('## Glossary Terms');
  lines.push('');
  for (const g of glossary.sort((a, b) => a.data.term.localeCompare(b.data.term))) {
    const def = g.data.definition.length > 150 ? g.data.definition.slice(0, 150) + '...' : g.data.definition;
    lines.push(`- [${g.data.term}](${canonicalUrl(`/glossary/${g.id.replace(/\.mdx?$/, '')}`)}): ${def}`);
  }

  // Guides
  lines.push('');
  lines.push('## Research Guides');
  lines.push('');
  for (const g of guides.sort((a, b) => a.data.title.localeCompare(b.data.title))) {
    lines.push(`- [${g.data.title}](${canonicalUrl(`/guide/${g.id.replace(/\.mdx?$/, '')}`)}): ${g.data.summary}`);
  }

  // Safety profiles
  lines.push('');
  lines.push('## Safety Profiles');
  lines.push('');
  for (const s of safety.sort((a, b) => a.data.title.localeCompare(b.data.title))) {
    lines.push(`- [${s.data.title}](${canonicalUrl(`/safety/${s.id.replace(/\.mdx?$/, '')}`)}): ${s.data.summary}`);
  }

  // Protocols
  lines.push('');
  lines.push('## Research Protocols');
  lines.push('');
  for (const p of protocols.sort((a, b) => a.data.title.localeCompare(b.data.title))) {
    lines.push(`- [${p.data.title}](${canonicalUrl(`/protocols/${p.id.replace(/\.mdx?$/, '')}`)}): ${p.data.description}`);
  }

  // Blog posts
  lines.push('');
  lines.push('## Blog Posts');
  lines.push('');
  for (const b of blog.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())) {
    const date = b.data.publishDate.toISOString().split('T')[0];
    lines.push(`- [${b.data.title}](${canonicalUrl(`/blog/${b.id.replace(/\.mdx?$/, '')}`)}) (${date}): ${b.data.excerpt}`);
  }

  // Key pages
  lines.push('');
  lines.push('## Key Pages');
  lines.push('');
  lines.push(`- [Methodology](${canonicalUrl('/methodology')}): How PepCodex evaluates evidence`);
  lines.push(`- [Clinical Trial Tracker](${canonicalUrl('/trials')}): Live tracker of peptide clinical trials`);
  lines.push(`- [Clinic Directory](${canonicalUrl('/directory')}): US peptide clinic finder`);
  lines.push(`- [Newsletter](${canonicalUrl('/newsletter')}): Weekly peptide research digest`);

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
