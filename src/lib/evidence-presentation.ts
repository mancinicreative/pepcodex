import type { EvidenceDisplay } from '../content/config';

export const NEUTRAL_GRADE = 'Clinical certainty not formally graded';
export const NEUTRAL_KEY = 'not-formally-graded';
export type EvidencePresentation = {
  selected: boolean;
  label: string;
  filterKey: string;
  color: string;
  countText: string;
  humanText: string | null;
  display?: EvidenceDisplay;
};
type Input = { evidenceStrength: string; evidenceDisplay?: EvidenceDisplay; sources?: { count: number; human: number } };

// Pure presentation only. Server consumers obtain this through the bound loader;
// browser search receives its validated serialized result from the search API.
export function presentEvidence(data: Input): EvidencePresentation {
  if (data.evidenceDisplay !== undefined) {
    const d = data.evidenceDisplay;
    if (!d || d.version !== 1 || d.clinicalCertainty !== NEUTRAL_KEY || d.selection?.unit !== 'publications'
      || !Number.isSafeInteger(d.selection.total) || d.selection.total < 0
      || !Array.isArray(d.selection.categories) || !d.selection.categories.length
      || d.selection.categories.some(row => !row || typeof row.key !== 'string' || typeof row.label !== 'string' || !row.label.trim() || !Number.isSafeInteger(row.count) || row.count < 0)
      || new Set(d.selection.categories.map(row => row.key)).size !== d.selection.categories.length
      || d.selection.categories.reduce((sum, row) => sum + row.count, 0) !== d.selection.total)
      throw new Error('Unsupported selected evidence presentation');
    return { selected: true, label: NEUTRAL_GRADE, filterKey: NEUTRAL_KEY, color: 'var(--ink-muted)', countText: `${d.selection.total} selected publications`, humanText: null, display: d };
  }
  const grades: Record<string, { label: string; color: string }> = {
    high: { label: 'High Evidence', color: 'var(--research)' },
    moderate: { label: 'Moderate Evidence', color: 'var(--primary-c)' },
    low: { label: 'Low Evidence', color: '#9a6418' },
    'very-low': { label: 'Very Low Evidence', color: 'var(--danger)' },
  };
  const grade = grades[data.evidenceStrength] || grades.low;
  return { selected: false, ...grade, filterKey: data.evidenceStrength, countText: `${data.sources?.count ?? 0} sources`, humanText: `${data.sources?.human ?? 0} human studies` };
}
