/** Canonical origin. Internal links never carry a trailing slash (`trailingSlash: 'never'`). */
export const SITE_ORIGIN = 'https://www.pepcodex.com';

export function collectionSlug(entry: { slug?: string; id: string }): string {
  if (entry.slug) return entry.slug;
  return entry.id.replace(/\.mdx?$/, '');
}

export function absUrl(path: string): string {
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}${withSlash.replace(/\/+$/, '')}`;
}
