// Only enable after the named pilot's evidence and destination are accepted.
// Keep these separate from public environment variables and merchant marketing copy.
export const affiliatePilot = Object.freeze({
  enabled: false,
  referralUrl: '',
  approvedOrigin: '',
  approvals: Object.freeze({
    pageReview: false,
    productTest: false,
    partnerTerms: false,
    privacyAndMeasurement: false,
    release: false,
  }),
});

export function approvedPilotUrl(config) {
  if (config?.enabled !== true) return null;
  const required = ['pageReview', 'productTest', 'partnerTerms', 'privacyAndMeasurement', 'release'];
  if (!required.every(key => config.approvals?.[key] === true)) return null;
  try {
    const url = new URL(config.referralUrl);
    const origin = new URL(config.approvedOrigin);
    if (url.protocol !== 'https:' || url.username || url.password || url.hash) return null;
    if (origin.protocol !== 'https:' || origin.origin !== config.approvedOrigin) return null;
    if (url.origin !== origin.origin) return null;
    return url.href;
  } catch {
    return null;
  }
}
