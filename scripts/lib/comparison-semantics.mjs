/** Review signals for known generated FAQ templates, not a clinical evidence audit. */
export function inspectComparisonSemantics(page, A, B) {
  const findings = [];
  const normalized = value => String(value ?? '').replace(/\s+/g, ' ').trim();
  const esc = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (![page.peptideA,page.peptideB].every(slug=>typeof slug === 'string' && /^[a-z0-9-]+$/.test(slug))) return [{code:'INVALID_PAIR_METADATA', detail:'Comparison pair metadata is missing or invalid; inspect frontmatter before attempting dossier resolution.'}];
  if (!A || !B) return [{code:'MISSING_DOSSIER', detail:'Valid pair metadata references an unavailable dossier file.'}];
  for (const [index, faq] of (page.faqs || []).entries()) {
    const text = normalized(faq.answer);
    const add = (code, detail) => findings.push({code, faq_index:index, question:faq.question, detail});
    const winner = text.match(/has more clinical evidence with (\d+) human studies compared to (\d+)/);
    if (winner) {
      add('COUNT_BASED_CLINICAL_WINNER_TEMPLATE', 'Known template draws a clinical evidence ranking from counts; source-level review or neutral inventory wording is required.');
      if (+winner[1] <= +winner[2]) add('PRINTED_MORE_RELATION_FALSE', `${winner[1]} is not greater than ${winner[2]}.`);
    }
    const tie = text.match(/Both have similar numbers of human studies \((\d+) each\)/);
    if (tie) {
      const a = A.sources?.human, b = B.sources?.human;
      if (!Number.isInteger(a) || !Number.isInteger(b)) add('HUMAN_COUNT_UNAVAILABLE', 'The legacy each-count template cannot be checked because human-count metadata is missing.');
      else if (a !== +tie[1] || b !== +tie[1]) add('EACH_COUNT_DISAGREES_WITH_DOSSIERS', `Printed ${tie[1]} each; dossier metadata ${a}/${b}. Metadata counts are not independently verified study counts.`);
    }
    if (text.includes('but they differ in evidence strength.')) {
      const label = P => text.match(new RegExp(`${esc(normalized(P.name))} has (High|Moderate|Low|Very Low) evidence \\(`))?.[1];
      const a = label(A), b = label(B);
      if (a && a === b) add('DIFFERENCE_WITH_EQUAL_PRINTED_GRADES', `Both printed grade labels are ${a}; the categorical template does not substantiate its differing-strength premise.`);
    }
  }
  return findings;
}
