import { CTR_BENCHMARK } from "./benchmarks";
import {
  computeMetrics,
  generateMockDataRow,
  generateMockDatasetFiltered,
  type MockDataRow,
} from "./generators";

export interface EdgeCaseDefinition {
  id: string;
  name: string;
  businessContext: string;
  apply: (row: MockDataRow) => MockDataRow;
}

function withEdgeCase(row: MockDataRow, name: string, overrides: Partial<MockDataRow>): MockDataRow {
  const merged = { ...row, ...overrides, is_edge_case: true, edge_case_name: name, is_synthetic: true as const };
  if (merged.impressions > 0 && merged.clicks >= 0) {
    const metrics = computeMetrics(
      merged.impressions,
      merged.clicks,
      merged.purchases,
      merged.aov,
      merged.commission_rate
    );
    return { ...merged, ...metrics };
  }
  return merged;
}

export const EDGE_CASES: EdgeCaseDefinition[] = [
  {
    id: "zero_conversions",
    name: "Zero Conversions",
    businessContext: "Traffic with no purchases — audience mismatch",
    apply: (row) => withEdgeCase(row, "Zero Conversions", { purchases: 0, add_to_carts: 0, order_value: 0, creator_payout: 0, platform_fee: 0, rail_fee: 0, merchant_margin: 0, purchases_1d: 0, purchases_7d: 0, purchases_14d: 0, purchases_30d: 0 }),
  },
  {
    id: "high_aov",
    name: "High AOV (>$500)",
    businessContext: "Premium/luxury product category",
    apply: (row) => withEdgeCase(row, "High AOV (>$500)", { aov: 650, purchases: Math.max(row.purchases, 5) }),
  },
  {
    id: "high_cvr",
    name: "High CVR (>10%)",
    businessContext: "Warm audience with 4-5x benchmark conversion",
    apply: (row) => {
      const clicks = Math.max(row.clicks, 100);
      const purchases = Math.max(Math.floor(clicks * 0.12), 12);
      return withEdgeCase(row, "High CVR (>10%)", { clicks, purchases });
    },
  },
  {
    id: "missing_attribution",
    name: "Missing Attribution",
    businessContext: "Null attribution window — data quality issue",
    apply: (row) => withEdgeCase(row, "Missing Attribution", { attribution_window: null as unknown as string }),
  },
  {
    id: "partial_data",
    name: "Partial Data",
    businessContext: "Clicks without purchases — high cart abandonment",
    apply: (row) => withEdgeCase(row, "Partial Data", { purchases: 0, add_to_carts: Math.max(row.add_to_carts, Math.floor(row.clicks * 0.2)), order_value: 0, creator_payout: 0, platform_fee: 0, rail_fee: 0, merchant_margin: 0 }),
  },
  {
    id: "negative_revenue",
    name: "Negative Revenue",
    businessContext: "Refunds or reporting errors",
    apply: (row) => withEdgeCase(row, "Negative Revenue", { order_value: -1200, merchant_margin: -1200, creator_payout: 0, platform_fee: 0, rail_fee: 0 }),
  },
  {
    id: "high_ctr",
    name: "High CTR (>5%)",
    businessContext: "Viral content with exceptional click-through",
    apply: (row) => {
      const impressions = Math.max(row.impressions, 10000);
      const clicks = Math.floor(impressions * 0.06);
      return withEdgeCase(row, "High CTR (>5%)", { impressions, clicks });
    },
  },
  {
    id: "low_ctr",
    name: "Low CTR (<0.5%)",
    businessContext: "Poor targeting on cold traffic",
    apply: (row) => {
      const impressions = Math.max(row.impressions, 50000);
      const clicks = Math.floor(impressions * 0.003);
      return withEdgeCase(row, "Low CTR (<0.5%)", { impressions, clicks, purchases: Math.floor(clicks * 0.01) });
    },
  },
  {
    id: "zero_clicks",
    name: "Zero Clicks",
    businessContext: "Impressions only — no engagement",
    apply: (row) => withEdgeCase(row, "Zero Clicks", { clicks: 0, add_to_carts: 0, purchases: 0, order_value: 0, creator_payout: 0, platform_fee: 0, rail_fee: 0, merchant_margin: 0, ctr: 0, conversion_rate: 0, ctr_vs_benchmark: roundPct(((0 - CTR_BENCHMARK) / CTR_BENCHMARK) * 100), conversion_vs_benchmark: 0 }),
  },
  {
    id: "outlier_cvr",
    name: "Outlier CVR (30%+)",
    businessContext: "Statistically improbable — small sample size",
    apply: (row) => {
      const clicks = Math.max(row.clicks, 20);
      const purchases = Math.max(Math.floor(clicks * 0.35), 7);
      return withEdgeCase(row, "Outlier CVR (30%+)", { clicks, purchases });
    },
  },
  {
    id: "attribution_discrepancy",
    name: "Attribution Discrepancy",
    businessContext: "7-day window captures less than 82% of conversions",
    apply: (row) => {
      const purchases = Math.max(row.purchases, 100);
      return withEdgeCase(row, "Attribution Discrepancy", {
        purchases,
        purchases_1d: Math.floor(purchases * 0.5),
        purchases_7d: Math.floor(purchases * 0.65),
        purchases_14d: Math.floor(purchases * 0.8),
        purchases_30d: purchases,
        attribution_window: "30-day",
      });
    },
  },
];

function roundPct(value: number) {
  return Math.round(value * 10) / 10;
}

export function generateEdgeCase(nameOrId?: string): MockDataRow {
  const base = generateMockDataRow({ campaignIndex: 999, seed: 999 });
  if (!nameOrId) {
    const edgeCase = EDGE_CASES[Math.floor(Math.random() * EDGE_CASES.length)];
    return edgeCase.apply(base);
  }

  const edgeCase = EDGE_CASES.find(
    (ec) => ec.id === nameOrId || ec.name === nameOrId
  );
  if (!edgeCase) {
    throw new Error(`Unknown edge case: ${nameOrId}`);
  }
  return edgeCase.apply(base);
}

export function generateAllEdgeCases(): MockDataRow[] {
  return EDGE_CASES.map((edgeCase, index) =>
    edgeCase.apply(generateMockDataRow({ campaignIndex: 900 + index, seed: 900 + index }))
  );
}

/** Dataset with regular rows plus all edge-case scenarios */
export function generateEdgeCaseData(count = 50, region?: string, vertical?: string): MockDataRow[] {
  return [...generateMockDatasetFiltered(count, region, vertical), ...generateAllEdgeCases()];
}

export function generateDatasetWithEdgeCases(count = 40): MockDataRow[] {
  return generateEdgeCaseData(count);
}
