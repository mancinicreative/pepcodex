/**
 * W0-3 / T-03 — these protocol slugs stay out of getStaticPaths until
 * rewritten without human dose tables and with topical-matched PMIDs.
 * Destinations are existing peptide dossiers (no new URLs).
 */
export const UNPUBLISHED_PROTOCOL_SLUGS = new Set([
  'bpc-157-tb-500',
  'cjc-1295-ipamorelin',
  'gh-secretagogue-combinations',
]);

export const UNPUBLISHED_PROTOCOL_REDIRECTS: Record<string, string> = {
  'bpc-157-tb-500': '/peptides/bpc-157',
  'cjc-1295-ipamorelin': '/peptides/cjc-1295',
  'gh-secretagogue-combinations': '/peptides/mk-677',
};

export function protocolCollectionSlug(entry: { slug?: string; id: string }): string {
  if (entry.slug) return entry.slug;
  return entry.id.replace(/\.mdx?$/, '');
}

export function isPublishedProtocol(entry: { slug?: string; id: string }): boolean {
  return !UNPUBLISHED_PROTOCOL_SLUGS.has(protocolCollectionSlug(entry));
}
