export interface DataDictionaryField {
  name: string;
  type: string;
  description: string;
  businessMeaning: string;
  format?: string;
  validRange?: [number, number];
  validValues?: string[];
  example: string | number | boolean;
  unit?: string;
  nullable: boolean;
}

export interface DataDictionaryEntity {
  entity: string;
  description: string;
  fields: DataDictionaryField[];
}

export const DATA_DICTIONARY: DataDictionaryEntity[] = [
  {
    entity: "Campaign",
    description: "Creator campaign metadata and lifecycle attributes",
    fields: [
      { name: "campaign_id", type: "string", description: "Unique campaign identifier", businessMeaning: "Groups daily funnel events under one creator campaign", format: "camp_NNN", example: "camp_042", nullable: false },
      { name: "creator_id", type: "string", description: "Creator account identifier", businessMeaning: "Links performance to a specific influencer account", format: "creator_{tier}_{NNN}", example: "creator_micro_042", nullable: false },
      { name: "creator_tier", type: "enum", description: "Influencer reach tier", businessMeaning: "Segments creators by follower count and engagement profile", validValues: ["Nano", "Micro", "Macro", "Mega"], example: "Micro", nullable: false },
      { name: "platform", type: "enum", description: "Commerce platform", businessMeaning: "Distribution rail where the campaign ran", validValues: ["TikTok Shop", "Instagram Reels", "YouTube Shorts"], example: "TikTok Shop", nullable: false },
      { name: "region", type: "enum", description: "Geographic market", businessMeaning: "Country where impressions and purchases occurred", validValues: ["US", "DE", "BR", "IN", "ID"], example: "US", nullable: false },
      { name: "vertical", type: "enum", description: "Product category", businessMeaning: "Campaign vertical affecting AOV and conversion benchmarks", validValues: ["Fashion", "Beauty", "Tech", "Gaming", "Home"], example: "Beauty", nullable: false },
      { name: "timestamp", type: "datetime", description: "Event timestamp", businessMeaning: "When the daily campaign metrics were recorded", format: "YYYY-MM-DD HH:MM:SS", example: "2025-06-01 14:30:00", nullable: false },
      { name: "is_synthetic", type: "boolean", description: "Synthetic data flag", businessMeaning: "Marks records generated for POC/demo purposes", example: true, nullable: false },
    ],
  },
  {
    entity: "Impressions",
    description: "Top-of-funnel reach metrics",
    fields: [
      { name: "impressions", type: "integer", description: "Total post views", businessMeaning: "Audience exposure before any click action", validRange: [0, 5000000], example: 125000, unit: "views", nullable: false },
    ],
  },
  {
    entity: "Clicks",
    description: "Mid-funnel traffic metrics",
    fields: [
      { name: "clicks", type: "integer", description: "Store link clicks", businessMeaning: "Users who left the platform for the merchant storefront", validRange: [0, 500000], example: 4200, unit: "clicks", nullable: false },
      { name: "ctr", type: "float", description: "Click-through rate", businessMeaning: "Clicks divided by impressions, compared to 1.5% benchmark", validRange: [0, 100], example: 3.36, unit: "%", nullable: false },
      { name: "ctr_vs_benchmark", type: "float", description: "CTR performance vs benchmark", businessMeaning: "Percent deviation from industry CTR benchmark", example: 124.0, unit: "%", nullable: false },
    ],
  },
  {
    entity: "Conversions",
    description: "Purchase funnel progression",
    fields: [
      { name: "add_to_carts", type: "integer", description: "Add-to-cart events", businessMeaning: "High-intent shoppers who selected products", validRange: [0, 100000], example: 504, nullable: false },
      { name: "purchases", type: "integer", description: "Completed purchases", businessMeaning: "Final conversion count for the period", validRange: [0, 50000], example: 120, nullable: false },
      { name: "conversion_rate", type: "float", description: "Click-to-purchase rate", businessMeaning: "Purchases divided by clicks, compared to 2.2% benchmark", validRange: [0, 100], example: 2.86, unit: "%", nullable: false },
      { name: "conversion_vs_benchmark", type: "float", description: "CVR performance vs benchmark", businessMeaning: "Percent deviation from industry conversion benchmark", example: 30.0, unit: "%", nullable: false },
    ],
  },
  {
    entity: "Revenue",
    description: "Order value and revenue health",
    fields: [
      { name: "order_value", type: "float", description: "Gross order value", businessMeaning: "Total revenue before fee splits", validRange: [0, 1000000], example: 8400.0, unit: "USD", nullable: false },
      { name: "aov", type: "float", description: "Average order value", businessMeaning: "Mean transaction size for the campaign day", validRange: [0, 2000], example: 70.0, unit: "USD", nullable: false },
    ],
  },
  {
    entity: "Creator Payout",
    description: "Creator compensation",
    fields: [
      { name: "creator_payout", type: "float", description: "Creator commission payment", businessMeaning: "Revenue share paid to the influencer", validRange: [0, 500000], example: 1512.0, unit: "USD", nullable: false },
      { name: "commission_rate", type: "float", description: "Applied commission rate", businessMeaning: "Percentage of order value paid to creator", validRange: [0.05, 0.30], example: 0.18, unit: "ratio", nullable: false },
    ],
  },
  {
    entity: "Platform Fee",
    description: "Platform take rate",
    fields: [
      { name: "platform_fee", type: "float", description: "Platform service fee", businessMeaning: "Fixed 6% platform margin on order value", validRange: [0, 100000], example: 504.0, unit: "USD", nullable: false },
    ],
  },
  {
    entity: "Rails Fee",
    description: "Payment processing fees",
    fields: [
      { name: "rail_fee", type: "float", description: "Payment rails fee", businessMeaning: "Fixed 3% payment processing cost", validRange: [0, 50000], example: 252.0, unit: "USD", nullable: false },
    ],
  },
  {
    entity: "Merchant Margin",
    description: "Remaining merchant economics",
    fields: [
      { name: "merchant_margin", type: "float", description: "Merchant net margin", businessMeaning: "Revenue remaining after creator, platform, and rails fees", example: 6132.0, unit: "USD", nullable: false },
    ],
  },
  {
    entity: "Attribution Window",
    description: "Conversion latency buckets",
    fields: [
      { name: "attribution_window", type: "string", description: "Primary attribution window", businessMeaning: "Default window used for reporting conversions", validValues: ["1-day", "7-day", "14-day", "30-day"], example: "7-day", nullable: true },
      { name: "purchases_1d", type: "integer", description: "1-day attributed purchases", businessMeaning: "Conversions within 24 hours (~50% of total)", example: 60, nullable: false },
      { name: "purchases_7d", type: "integer", description: "7-day attributed purchases", businessMeaning: "Cumulative conversions within 7 days (~82%)", example: 98, nullable: false },
      { name: "purchases_14d", type: "integer", description: "14-day attributed purchases", businessMeaning: "Cumulative conversions within 14 days (~93%)", example: 112, nullable: false },
      { name: "purchases_30d", type: "integer", description: "30-day attributed purchases", businessMeaning: "Full cumulative conversion count (100%)", example: 120, nullable: false },
    ],
  },
  {
    entity: "Edge Case Flags",
    description: "Markers for synthetic edge-case scenarios",
    fields: [
      { name: "is_edge_case", type: "boolean", description: "Edge case row flag", businessMeaning: "Identifies rows injected to test anomalous scenarios", example: false, nullable: false },
      { name: "edge_case_name", type: "string", description: "Edge case scenario name", businessMeaning: "Human-readable label for the injected scenario", example: "Zero Conversions", nullable: true },
    ],
  },
];

/** @deprecated Use DATA_DICTIONARY — kept for backwards compatibility */
export const dataDictionary = DATA_DICTIONARY;

export function getAllFieldsFlattened(): Array<DataDictionaryField & { entity: string }> {
  return DATA_DICTIONARY.flatMap((entity) =>
    entity.fields.map((field) => ({
      entity: entity.entity,
      ...field,
    }))
  );
}
