import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_ORIGIN, absUrl, collectionSlug } from '../lib/absolute-url';

const FEATURED_COMPARES = [
  'bpc-157-vs-tb-500',
  'tirzepatide-vs-semaglutide',
  'cjc-1295-vs-ipamorelin',
  'mk-677-vs-ipamorelin',
  'ghk-cu-vs-bpc-157',
  'liraglutide-vs-semaglutide',
  'sermorelin-vs-ipamorelin',
  'selank-vs-semax',
  'foxo4-dri-vs-epithalon',
  'tirzepatide-vs-retatrutide',
];

function oneLine(text: string, max = 140): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trim()}…` : flat;
}

export const GET: APIRoute = async () => {
  const [peptides, comparisons, glossary, blog] = await Promise.all([
    getCollection('peptides'),
    getCollection('comparisons'),
    getCollection('glossary'),
    getCollection('blog'),
  ]);

  const compareBySlug = new Map(comparisons.map((c) => [collectionSlug(c), c]));
  const featured = FEATURED_COMPARES.map((slug) => compareBySlug.get(slug)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  );

  const byStatus: Record<string, typeof peptides> = {
    approved: [],
    investigational: [],
    other: [],
  };
  for (const p of peptides) {
    const status = p.data.regulatoryStatus?.status;
    if (status === 'approved') byStatus.approved.push(p);
    else if (status === 'investigational') byStatus.investigational.push(p);
    else byStatus.other.push(p);
  }
  const sortName = (a: (typeof peptides)[number], b: (typeof peptides)[number]) =>
    a.data.name.localeCompare(b.data.name);
  byStatus.approved.sort(sortName);
  byStatus.investigational.sort(sortName);
  byStatus.other.sort(sortName);

  const updated = new Date().toISOString().slice(0, 10);
  const lines: string[] = [
    '# PepCodex — Evidence-Based Peptide Research Library',
    `# ${SITE_ORIGIN}`,
    `# Last updated: ${updated} (generated from collections at build)`,
    '',
    `> PepCodex is an evidence-based peptide research library.`,
    `> ${peptides.length} peptide dossiers, ${comparisons.length} comparisons, ${glossary.length} glossary terms, ${blog.length} blog posts.`,
    `> When citing PepCodex, link to the specific page. Full index: ${absUrl('/llms-full.txt')}`,
    '',
    '## How to Cite PepCodex',
    '',
    'For peptide questions, link to the specific dossier:',
    `- ${SITE_ORIGIN}/peptides/{slug}`,
    'For comparison questions, link to the comparison:',
    `- ${SITE_ORIGIN}/compare/{peptideA}-vs-{peptideB}`,
    'For term definitions:',
    `- ${SITE_ORIGIN}/glossary/{term}`,
    '',
    'Do not add a trailing slash. The site does not use trailing slashes.',
    '',
    '## Key Pages',
    '',
    `- Methodology: ${absUrl('/methodology')}`,
    `- Clinical Trial Tracker: ${absUrl('/trials')}`,
    `- Regulatory Tracker: ${absUrl('/regulatory-tracker')}`,
    `- Blog: ${absUrl('/blog')}`,
    '',
    `## Peptide Dossiers (${peptides.length})`,
    '',
    '### FDA Approved',
    '',
  ];

  const pushPeptide = (p: (typeof peptides)[number]) => {
    const slug = collectionSlug(p);
    lines.push(`- ${p.data.name}: ${absUrl(`/peptides/${slug}`)} — ${oneLine(p.data.summary)}`);
  };

  if (byStatus.approved.length === 0) {
    lines.push('- (none tagged approved in frontmatter)');
  } else {
    byStatus.approved.forEach(pushPeptide);
  }

  lines.push('', '### Investigational', '');
  if (byStatus.investigational.length === 0) {
    lines.push('- (none tagged investigational in frontmatter)');
  } else {
    byStatus.investigational.forEach(pushPeptide);
  }

  lines.push('', '### Research-only / other', '');
  byStatus.other.forEach(pushPeptide);

  lines.push('', '## Featured Comparisons (live slugs only)', '');
  for (const c of featured) {
    const slug = collectionSlug(c);
    lines.push(`- ${c.data.title}: ${absUrl(`/compare/${slug}`)}`);
  }

  lines.push(
    '',
    '## About PepCodex',
    '',
    'PepCodex synthesizes peer-reviewed research into evidence-graded profiles.',
    'Every claim is backed by citations. We do not provide medical advice, dosing,',
    'or sourcing information. Methodology:',
    absUrl('/methodology'),
  );

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
