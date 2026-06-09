export const COST_RANKS = {
  Free: 0,
  "Under $5": 1,
  "Under $10": 2,
  Unknown: 3,
} as const;

export type CostLabel = keyof typeof COST_RANKS;

export function getCostRank(cost: string) {
  if (cost.toLowerCase().startsWith("free")) {
    return COST_RANKS.Free;
  }

  if (cost.toLowerCase().includes("under $5")) {
    return COST_RANKS["Under $5"];
  }

  if (cost.toLowerCase().includes("under $10")) {
    return COST_RANKS["Under $10"];
  }

  return COST_RANKS.Unknown;
}
