export interface EvidenceInventorySources {
  count?: number | null;
  human?: number | null;
  preclinical?: number | null;
  openAccess?: number | null;
  context?: string | null;
}

/** Inventory counts do not identify independent trials or establish benefit. */
export function evidenceInventory(sources?: EvidenceInventorySources | null) {
  const knownCount = (value: unknown): value is number =>
    typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
  return {
    totalLabel: knownCount(sources?.count) ? `${sources.count} sources` : 'Source count unknown',
    humanLabel: knownCount(sources?.human) ? `${sources.human} human evidence entries` : 'Human evidence count unknown',
    context: typeof sources?.context === 'string' && sources.context.trim() ? sources.context : undefined,
  };
}
