// Condition-page references include study identifiers and primary-source documents.
// Keep this resolver local to condition routes; dossier citation behavior is separate.

/**
 * @typedef {{ kind: 'pmid' | 'doi' | 'nct' | 'source', href: string, source: string }} ConditionReference
 */

const PUBLIC_HOST = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
const PRIVATE_SUFFIX = /\.(?:local|localhost|internal|test|example|invalid)$/i;

/** @param {string} raw @returns {ConditionReference | null} */
export function resolveConditionReference(raw) {
  if (typeof raw !== 'string') return null;
  const value = raw.trim();

  if (/^https:\/\//i.test(value)) {
    // Reject credentials, local hosts, nonstandard ports, and characters a URL parser may normalize away.
    if (/[\u0000-\u0020\u007f<>"'\\]/.test(value)) return null;
    let url;
    try { url = new URL(value); } catch { return null; }
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || url.username || url.password || url.port ||
        !PUBLIC_HOST.test(host) || PRIVATE_SUFFIX.test(host)) return null;
    return {
      kind: 'source',
      href: url.href,
      source: host === 'fda.gov' || host === 'www.fda.gov' ? 'FDA source' : host,
    };
  }

  const pmid = value.match(/^(?:PMID:?\s*)?(\d{1,9})$/i);
  if (pmid) return { kind: 'pmid', href: `https://pubmed.ncbi.nlm.nih.gov/${pmid[1]}/`, source: pmid[1] };

  const nct = value.match(/^(NCT\d{8})$/i);
  if (nct) {
    const id = nct[1].toUpperCase();
    return { kind: 'nct', href: `https://clinicaltrials.gov/study/${id}`, source: id };
  }

  const doi = value.replace(/^DOI:\s*/i, '');
  if (/^10\.\d{4,9}\/[A-Za-z0-9][A-Za-z0-9._~!$&()*+,;=:/-]*$/i.test(doi) &&
      !/\/\/|\/\.{1,2}(?:\/|$)/.test(doi)) {
    return { kind: 'doi', href: `https://doi.org/${doi}`, source: doi };
  }

  return null;
}
