/** Narrow narrative triage, not a test of scientific validity or registry authenticity.
 * A registry identifier and a successful fetch never establish that a study is real.
 */
export function trialIntegrity(st) {
  const descriptions = st.protocolSection?.descriptionModule || {};
  const signals = [];
  // Match explicit self-identification, not ordinary words used in legitimate research.
  const marker = /\bthis\s+(?:fictional\s+(?:study|trial|record)\s+(?:is|was)\b|example\s+record\s+models\b)/ig;
  for (const field of ['briefSummary', 'detailedDescription']) {
    const text = descriptions[field];
    if (typeof text !== 'string') continue;
    marker.lastIndex = 0;
    for (const match of text.matchAll(marker)) {
      const leading = text.slice(0, match.index).trim();
      const direct = leading === '';
      const tail = text.slice(match.index);
      const end = tail.search(/[.!?](?:\s|$)/);
      const quote = tail.slice(0, end < 0 ? 500 : Math.min(end + 1, 500));
      signals.push({ ruleId: direct ? 'SELF_IDENTIFIED_EXAMPLE_OPENING_V1' : 'EXAMPLE_PHRASE_CONTEXT_V1',
        field: `protocolSection.descriptionModule.${field}`, quote,
        interpretation: direct ? 'EXPLICIT_SELF_DESCRIPTION' : 'CONTEXT_REVIEW_REQUIRED' });
    }
  }
  return { status: signals.some(s => s.interpretation === 'EXPLICIT_SELF_DESCRIPTION') ? 'QUARANTINED_SELF_DESCRIBED_EXAMPLE'
    : signals.length ? 'CONTEXT_REVIEW_REQUIRED' : 'NO_EXPLICIT_SELF_DESCRIPTION', signals,
    assessmentScope: 'Narrative self-identification only; absence of a marker does not validate evidence.' };
}
