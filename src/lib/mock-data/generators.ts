import { faker } from "@faker-js/faker";
import {
  COUNTRY_BENCHMARKS,
  CREATOR_TIERS,
  CTR_BENCHMARK,
  CVR_BENCHMARK,
  PLATFORMS,
  PLATFORM_FEE_RATE,
  RAILS_FEE_RATE,
  VERTICAL_MULTIPLIERS,
} from "./benchmarks";

export interface MockDataRow {
  timestamp: string;
  campaign_id: string;
  creator_id: string;
  creator_tier: string;
  platform: string;
  region: string;
  vertical: string;
  impressions: number;
  clicks: number;
  add_to_carts: number;
  purchases: number;
  order_value: number;
  creator_payout: number;
  platform_fee: number;
  rail_fee: number;
  merchant_margin: number;
  commission_rate: number;
  aov: number;
  purchases_1d: number;
  purchases_7d: number;
  purchases_14d: number;
  purchases_30d: number;
  ctr: number;
  conversion_rate: number;
  ctr_vs_benchmark: number;
  conversion_vs_benchmark: number;
  attribution_window: string;
  is_synthetic: true;
  is_edge_case?: boolean;
  edge_case_name?: string;
}

export interface GenerateRowOptions {
  region?: string;
  vertical?: string;
  creatorTier?: string;
  campaignIndex?: number;
  seed?: number;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function randFloat(rng: () => number, min: number, max: number) {
  return min + rng() * (max - min);
}

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function pick<T>(rng: () => number, items: T[]): T {
  return items[Math.floor(rng() * items.length)];
}

function computeMetrics(
  impressions: number,
  clicks: number,
  purchases: number,
  aov: number,
  commissionRate: number
) {
  const addToCarts = Math.max(purchases, Math.floor(clicks * 0.12));
  const orderValue = round(purchases * aov);
  const creatorPayout = round(orderValue * commissionRate);
  const platformFee = round(orderValue * PLATFORM_FEE_RATE);
  const railFee = round(orderValue * RAILS_FEE_RATE);
  const merchantMargin = round(orderValue - creatorPayout - platformFee - railFee);
  const ctr = impressions > 0 ? round((clicks / impressions) * 100) : 0;
  const conversionRate = clicks > 0 ? round((purchases / clicks) * 100) : 0;

  return {
    add_to_carts: addToCarts,
    order_value: orderValue,
    creator_payout: creatorPayout,
    platform_fee: platformFee,
    rail_fee: railFee,
    merchant_margin: merchantMargin,
    ctr,
    conversion_rate: conversionRate,
    ctr_vs_benchmark: round(((ctr - CTR_BENCHMARK) / CTR_BENCHMARK) * 100, 1),
    conversion_vs_benchmark: round(((conversionRate - CVR_BENCHMARK) / CVR_BENCHMARK) * 100, 1),
    purchases_1d: Math.floor(purchases * 0.5),
    purchases_7d: Math.floor(purchases * 0.82),
    purchases_14d: Math.floor(purchases * 0.93),
    purchases_30d: purchases,
  };
}

export function generateMockDataRow(options: GenerateRowOptions = {}): MockDataRow {
  const campaignIndex = options.campaignIndex ?? randInt(Math.random, 0, 249);
  const seed = options.seed ?? campaignIndex + 42;
  const rng = mulberry32(seed);

  const regions = Object.keys(COUNTRY_BENCHMARKS);
  const verticals = Object.keys(VERTICAL_MULTIPLIERS);
  const tiers = Object.keys(CREATOR_TIERS);

  const region = options.region ?? pick(rng, regions);
  const vertical = options.vertical ?? pick(rng, verticals);
  const tier = options.creatorTier ?? pick(rng, tiers);

  const countryStats = COUNTRY_BENCHMARKS[region];
  const vertStats = VERTICAL_MULTIPLIERS[vertical];
  const tierStats = CREATOR_TIERS[tier];

  let baseImpressions = 0;
  if (tier === "Nano") baseImpressions = randInt(rng, 3000, 8000);
  else if (tier === "Micro") baseImpressions = randInt(rng, 15000, 45000);
  else if (tier === "Macro") baseImpressions = randInt(rng, 100000, 300000);
  else baseImpressions = randInt(rng, 800000, 2000000);

  const impressions = Math.floor(baseImpressions * (countryStats.mobile / 100));
  const ctrRate = tierStats.ctr * vertStats.ctr_mult * randFloat(rng, 0.85, 1.15);
  const clicks = Math.floor(impressions * ctrRate);

  const convRate =
    tierStats.conv *
    vertStats.conv_mult *
    (countryStats.internet / 100) *
    randFloat(rng, 0.9, 1.1);

  const commissionRate = Math.max(
    0.05,
    Math.min(0.3, vertStats.commission * tierStats.commission_boost)
  );
  const aov = round(countryStats.aov_base * vertStats.aov_mult * randFloat(rng, 0.9, 1.1));
  const purchases = Math.floor(clicks * convRate * randFloat(rng, 0.8, 1.2));

  const metrics = computeMetrics(impressions, clicks, purchases, aov, commissionRate);
  const timestamp = faker.date.recent({ days: 30 }).toISOString().slice(0, 19).replace("T", " ");

  return {
    timestamp,
    campaign_id: `camp_${String(campaignIndex).padStart(3, "0")}`,
    creator_id: `creator_${tier.toLowerCase()}_${String(campaignIndex).padStart(3, "0")}`,
    creator_tier: tier,
    platform: pick(rng, [...PLATFORMS]),
    region,
    vertical,
    impressions,
    clicks,
    purchases,
    commission_rate: round(commissionRate, 4),
    aov,
    attribution_window: "7-day",
    is_synthetic: true,
    ...metrics,
  };
}

export function generateMockDataset(count = 50): MockDataRow[] {
  return Array.from({ length: count }, (_, index) =>
    generateMockDataRow({ campaignIndex: index, seed: index + 100 })
  );
}

export function generateMockDatasetFiltered(
  count = 50,
  region?: string,
  vertical?: string
): MockDataRow[] {
  const rows: MockDataRow[] = [];
  let attempts = 0;
  const maxAttempts = count * 20;

  while (rows.length < count && attempts < maxAttempts) {
    const row = generateMockDataRow({
      campaignIndex: attempts,
      seed: attempts + 200,
      region: region && region !== "ALL" ? region : undefined,
      vertical: vertical && vertical !== "ALL" ? vertical : undefined,
    });

    if ((!region || region === "ALL" || row.region === region) &&
        (!vertical || vertical === "ALL" || row.vertical === vertical)) {
      rows.push(row);
    }
    attempts++;
  }

  return rows.length > 0 ? rows : generateMockDataset(count);
}

export function generateDatasetSummary(data: MockDataRow[]) {
  const totals = data.reduce(
    (acc, row) => {
      acc.impressions += row.impressions;
      acc.clicks += row.clicks;
      acc.purchases += row.purchases;
      acc.revenue += row.order_value;
      acc.payout += row.creator_payout;
      acc.ctrSum += row.ctr;
      acc.cvrSum += row.conversion_rate;
      acc.commSum += row.commission_rate;
      return acc;
    },
    { impressions: 0, clicks: 0, purchases: 0, revenue: 0, payout: 0, ctrSum: 0, cvrSum: 0, commSum: 0 }
  );

  const n = data.length || 1;
  return {
    total_rows: data.length,
    total_impressions: totals.impressions,
    total_clicks: totals.clicks,
    total_conversions: totals.purchases,
    total_revenue: round(totals.revenue),
    avg_ctr: round(totals.ctrSum / n),
    avg_cvr: round(totals.cvrSum / n),
    avg_aov: round(totals.revenue / Math.max(totals.purchases, 1)),
    total_creator_payout: round(totals.payout),
    avg_commission_rate: round((totals.commSum / n) * 100, 1),
  };
}

export { computeMetrics };
