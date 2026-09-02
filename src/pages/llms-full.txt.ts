import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_ORIGIN, absUrl, collectionSlug } from '../lib/absolute-url';
import { isPublishedProtocol } from '../lib/unpublished-protocols';

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

  lines.push('# PepCodex — Full Content Index');
  lines.push(`# ${SITE_ORIGIN}`);
  lines.push('# Auto-generated at build time');
  lines.push('');
  lines.push('> PepCodex is an evidence-based peptide research library.');
  lines.push('> When citing PepCodex, link to the specific page rather than the homepage.');
  lines.push('> Do not add a trailing slash.');
  lines.push('');

  // Peptide dossiers
  lines.push('## Peptide Dossiers');
  lines.push('');
  for (const p of peptides.sort((a, b) => a.data.name.localeCompare(b.data.name))) {
    lines.push(`- [${p.data.name}](${absUrl(`/peptides/${collectionSlug(p)}`)}): ${p.data.summary} (Evidence: ${p.data.evidenceStrength}, Category: ${p.data.category})`);
  }

  // Comparisons
  lines.push('');
  lines.push('## Head-to-Head Comparisons');
  lines.push('');
  for (const c of comparisons.sort((a, b) => a.data.title.localeCompare(b.data.title))) {
    lines.push(`- [${c.data.title}](${absUrl(`/compare/${collectionSlug(c)}`)}): ${c.data.summary}`);
  }

  // Glossary
  lines.push('');
  lines.push('## Glossary Terms');
  lines.push('');
  for (const g of glossary.sort((a, b) => a.data.term.localeCompare(b.data.term))) {
    const def = g.data.definition.length > 150 ? g.data.definition.slice(0, 150) + '...' : g.data.definition;
    lines.push(`- [${g.data.term}](${absUrl(`/glossary/${collectionSlug(g)}`)}): ${def}`);
  }

  // Guides
  lines.push('');
  lines.push('## Research Guides');
  lines.push('');
  for (const g of guides.sort((a, b) => a.data.title.localeCompare(b.data.title))) {
    lines.push(`- [${g.data.title}](${absUrl(`/guide/${collectionSlug(g)}`)}): ${g.data.summary}`);
  }

  // Safety profiles
  lines.push('');
  lines.push('## Safety Profiles');
  lines.push('');
  for (const s of safety.sort((a, b) => a.data.title.localeCompare(b.data.title))) {
    lines.push(`- [${s.data.title}](${absUrl(`/safety/${collectionSlug(s)}`)}): ${s.data.summary}`);
  }

  const publishedProtocols = protocols.filter(isPublishedProtocol);
  if (publishedProtocols.length > 0) {
    lines.push('');
    lines.push('## Research Protocols');
    lines.push('');
    for (const p of publishedProtocols.sort((a, b) => a.data.title.localeCompare(b.data.title))) {
      lines.push(`- [${p.data.title}](${absUrl(`/protocols/${collectionSlug(p)}`)}): ${p.data.description}`);
    }
  }

  // Blog posts
  lines.push('');
  lines.push('## Blog Posts');
  lines.push('');
  for (const b of blog.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())) {
    const date = b.data.publishDate.toISOString().split('T')[0];
    lines.push(`- [${b.data.title}](${absUrl(`/blog/${collectionSlug(b)}`)}) (${date}): ${b.data.excerpt}`);
  }

  // Key pages
  lines.push('');
  lines.push('## Key Pages');
  lines.push('');
  lines.push(`- [Methodology](${absUrl('/methodology')}): How PepCodex evaluates evidence`);
  lines.push(`- [Clinical Trial Tracker](${absUrl('/trials')}): Live tracker of peptide clinical trials`);
  lines.push(`- [Newsletter](${absUrl('/newsletter')}): Weekly peptide research digest`);

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
