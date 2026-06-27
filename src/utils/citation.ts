// Resolve a raw citation reference into a safe, correctly-typed link descriptor.
//
// Dossier frontmatter stores citations in free-text `pmid`/`source` string fields.
// In practice those fields sometimes hold a trial registration (NCT########), a DOI,
// or a non-resolvable placeholder (N/A, TBD, ...). Rendering any truthy value straight
// into `pubmed.ncbi.nlm.nih.gov/<value>` produced broken, misleading links — e.g.
// "PMID:N/A" or an NCT id mislabeled as a PubMed id. This helper is the single source of
// truth for turning a raw reference into the right link (or no link at all).

export type CitationKind = 'pmid' | 'nct' | 'doi' | 'none';

export interface CitationLink {
  kind: CitationKind;
  href: string | null; // null => render no link
  label: string;       // human-facing label, e.g. "PMID:12345678" / "NCT04631991"
  source: string;      // normalized id (digits for pmid, full NCT, raw doi)
}

const NONE: CitationLink = { kind: 'none', href: null, label: '', source: '' };

// Values that explicitly mean "no citation exists" — never link these.
const PLACEHOLDERS = new Set([
  '', 'na', 'n/a', 'tbd', 'tbc', 'pending', 'unknown', 'none', 'null', 'placeholder',
]);

export function resolveCitation(raw?: string | null): CitationLink {
  if (raw == null) return NONE;
  const cleaned = String(raw).replace(/^PMID:?\s*/i, '').trim();
  if (PLACEHOLDERS.has(cleaned.toLowerCase())) return NONE;

  // ClinicalTrials.gov registration → CT.gov, not PubMed.
  const nct = cleaned.match(/^(NCT\d{8})$/i);
  if (nct) {
    const id = nct[1].toUpperCase();
    return { kind: 'nct', href: `https://clinicaltrials.gov/study/${id}`, label: id, source: id };
  }

  // DOI.
  if (/^10\.\d{4,9}\/\S+$/.test(cleaned)) {
    return { kind: 'doi', href: `https://doi.org/${cleaned}`, label: `DOI:${cleaned}`, source: cleaned };
  }

  // Numeric PubMed id.
  if (/^\d{1,9}$/.test(cleaned)) {
    return { kind: 'pmid', href: `https://pubmed.ncbi.nlm.nih.gov/${cleaned}/`, label: `PMID:${cleaned}`, source: cleaned };
  }

  // Anything else is not a resolvable citation — render no link rather than a broken one.
  return NONE;
}
