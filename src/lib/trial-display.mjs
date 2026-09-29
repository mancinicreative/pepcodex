// Registry dates are calendar dates, not local timestamps.
export function formatTrialMonth(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', {year: 'numeric', month: 'short', timeZone: 'UTC'});
}

// Keep the official visible label; normalize only its UI grouping key.
export function trialStatusKey(value) {
  const key = String(value || '').trim().toLowerCase().replaceAll('_', ' ');
  return key === 'active not recruiting' ? 'active' : key;
}

export function formatTrialCompletion(value, dateType) {
  const label = formatTrialMonth(value);
  if (label === '-') return label;
  if (dateType === 'ESTIMATED') return `${label} (estimated)`;
  if (dateType === 'ACTUAL') return label;
  return `${label} (date type unverified)`;
}

// Historical summaries and other registries are not ClinicalTrials.gov IDs.
export function isNctId(value) {
  return typeof value === 'string' && /^NCT\d{8}$/.test(value);
}

// Parent thymosin beta-4 registrations in the TB-500 pack are context, not TB-500 trials.
export function trialPeptidePresentation(packSlug, peptideName, nctId) {
  if (packSlug === 'tb-500') {
    if (nctId === 'NCT02668055') {
      return { label: 'TB4-labelled scaffold (identity unverified)', href: null };
    }
    return { label: 'Thymosin beta-4 (parent; not TB-500)', href: null };
  }
  return { label: peptideName, href: `/peptides/${packSlug}` };
}
