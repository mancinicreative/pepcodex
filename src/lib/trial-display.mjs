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
  return label !== '-' && dateType === 'ESTIMATED' ? `${label} (estimated)` : label;
}

// Historical summaries and other registries are not ClinicalTrials.gov IDs.
export function isNctId(value) {
  return typeof value === 'string' && /^NCT\d{8}$/.test(value);
}
