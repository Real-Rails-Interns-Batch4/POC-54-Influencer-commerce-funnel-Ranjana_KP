import { type NextRequest } from "next/server";

// Force dynamic rendering — this route uses query parameters
export const dynamic = "force-dynamic";

// ─── World Bank / Macro Benchmarks ───────────────────────────────
const COUNTRY_BENCHMARKS: Record<string, any> = {
  US: { name: "United States", gdp_pc: 76398.0, internet: 91.8, mobile: 110.1, aov_base: 85.0, volume_weight: 1.0 },
  DE: { name: "Germany", gdp_pc: 48432.0, internet: 89.6, mobile: 118.5, aov_base: 75.0, volume_weight: 0.8 },
  BR: { name: "Brazil", gdp_pc: 8917.0, internet: 81.3, mobile: 102.4, aov_base: 30.0, volume_weight: 1.5 },
  IN: { name: "India", gdp_pc: 2410.0, internet: 52.4, mobile: 84.8, aov_base: 18.0, volume_weight: 2.2 },
  ID: { name: "Indonesia", gdp_pc: 4788.0, internet: 73.7, mobile: 133.2, aov_base: 22.0, volume_weight: 1.8 },
};

const VERTICAL_MULTIPLIERS: Record<string, any> = {
  Fashion: { aov_mult: 1.1, conv_mult: 1.1, ctr_mult: 1.2, commission: 0.18 },
  Beauty: { aov_mult: 0.9, conv_mult: 1.3, ctr_mult: 1.4, commission: 0.20 },
  Tech: { aov_mult: 2.5, conv_mult: 0.7, ctr_mult: 0.8, commission: 0.08 },
  Gaming: { aov_mult: 1.4, conv_mult: 0.8, ctr_mult: 0.9, commission: 0.10 },
  Home: { aov_mult: 1.8, conv_mult: 0.9, ctr_mult: 0.7, commission: 0.12 },
};

const CREATOR_TIERS: Record<string, any> = {
  Nano: { min_followers: 1000, max_followers: 10000, ctr: 0.045, conv: 0.052, commission_boost: 1.2 },
  Micro: { min_followers: 10000, max_followers: 100000, ctr: 0.032, conv: 0.040, commission_boost: 1.1 },
  Macro: { min_followers: 100000, max_followers: 1000000, ctr: 0.021, conv: 0.028, commission_boost: 0.9 },
  Mega: { min_followers: 1000000, max_followers: 10000000, ctr: 0.012, conv: 0.018, commission_boost: 0.7 },
};

// ─── Seeded PRNG (Mulberry32) for deterministic synthetic data ───
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededRandInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function seededRandFloat(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

// ─── Synthetic Event Generation ──────────────────────────────────
interface EventRow {
  region: string;
  vertical: string;
  creator_tier: string;
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
}

function generateEvents(): EventRow[] {
  const rng = mulberry32(42);
  const events: EventRow[] = [];

  const countries = Object.keys(COUNTRY_BENCHMARKS);
  const verticals = Object.keys(VERTICAL_MULTIPLIERS);
  const tiers = Object.keys(CREATOR_TIERS);
  const platforms = ["TikTok Shop", "Instagram Reels", "YouTube Shorts"];

  for (let campaignIdx = 0; campaignIdx < 250; campaignIdx++) {
    const region = countries[seededRandInt(rng, 0, countries.length - 1)];
    const vertical = verticals[seededRandInt(rng, 0, verticals.length - 1)];
    const tier = tiers[seededRandInt(rng, 0, tiers.length - 1)];

    const countryStats = COUNTRY_BENCHMARKS[region];
    const vertStats = VERTICAL_MULTIPLIERS[vertical];
    const tierStats = CREATOR_TIERS[tier];

    let baseImpressions = 0;
    if (tier === "Nano") baseImpressions = seededRandInt(rng, 3000, 8000);
    else if (tier === "Micro") baseImpressions = seededRandInt(rng, 15000, 45000);
    else if (tier === "Macro") baseImpressions = seededRandInt(rng, 100000, 300000);
    else if (tier === "Mega") baseImpressions = seededRandInt(rng, 800000, 2000000);

    const mobileFactor = (countryStats.mobile || 100.0) / 100.0;
    const impressions = Math.floor(baseImpressions * mobileFactor);

    const ctr = tierStats.ctr * vertStats.ctr_mult * seededRandFloat(rng, 0.85, 1.15);
    const clicksCount = Math.floor(impressions * ctr);

    const convRate =
      tierStats.conv *
      vertStats.conv_mult *
      ((countryStats.internet || 70.0) / 100.0) *
      seededRandFloat(rng, 0.9, 1.1);

    const baseCommission = vertStats.commission * tierStats.commission_boost;
    const commissionRate = Math.max(0.05, Math.min(0.30, baseCommission));

    const aovBase = countryStats.aov_base * vertStats.aov_mult * seededRandFloat(rng, 0.9, 1.1);

    const numDays = seededRandInt(rng, 3, 7);
    for (let dayOffset = 0; dayOffset < numDays; dayOffset++) {
      const dayClicks = Math.floor((clicksCount / 5) * seededRandFloat(rng, 0.7, 1.3));
      let dayCarts = Math.floor(dayClicks * 0.12 * seededRandFloat(rng, 0.8, 1.2));
      let dayPurchases = Math.floor(dayClicks * convRate * seededRandFloat(rng, 0.8, 1.2));
      dayCarts = Math.max(dayPurchases, dayCarts);

      const totalValue = dayPurchases * aovBase;
      const creatorPay = totalValue * commissionRate;
      const platformFee = totalValue * 0.06;
      const railFee = totalValue * 0.03;
      const merchantMargin = totalValue - (creatorPay + platformFee + railFee);

      events.push({
        region,
        vertical,
        creator_tier: tier,
        impressions: Math.floor(impressions / 5),
        clicks: dayClicks,
        add_to_carts: dayCarts,
        purchases: dayPurchases,
        order_value: Math.round(totalValue * 100) / 100,
        creator_payout: Math.round(creatorPay * 100) / 100,
        platform_fee: Math.round(platformFee * 100) / 100,
        rail_fee: Math.round(railFee * 100) / 100,
        merchant_margin: Math.round(merchantMargin * 100) / 100,
        commission_rate: Math.round(commissionRate * 10000) / 10000,
        aov: Math.round(aovBase * 100) / 100,
        purchases_1d: Math.floor(dayPurchases * 0.50),
        purchases_7d: Math.floor(dayPurchases * 0.82),
        purchases_14d: Math.floor(dayPurchases * 0.93),
        purchases_30d: dayPurchases,
      });
    }
  }
  return events;
}

// ─── Cache the generated events at module scope ──────────────────
let cachedEvents: EventRow[] | null = null;
function getEvents(): EventRow[] {
  if (!cachedEvents) cachedEvents = generateEvents();
  return cachedEvents;
}

// ─── GET Handler ─────────────────────────────────────────────────
export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const region = searchParams.get("region") || "ALL";
  const vertical = searchParams.get("vertical") || "ALL";

  const allEvents = getEvents();

  // Filter
  const filtered = allEvents.filter((e) => {
    if (region !== "ALL" && e.region !== region) return false;
    if (vertical !== "ALL" && e.vertical !== vertical) return false;
    return true;
  });

  // Aggregate metrics
  let totalImp = 0, totalClk = 0, totalCrt = 0, totalPur = 0;
  let totalRev = 0, totalPay = 0, totalPlat = 0, totalRail = 0, totalMerch = 0;
  let aovSum = 0;

  for (const e of filtered) {
    totalImp += e.impressions;
    totalClk += e.clicks;
    totalCrt += e.add_to_carts;
    totalPur += e.purchases;
    totalRev += e.order_value;
    totalPay += e.creator_payout;
    totalPlat += e.platform_fee;
    totalRail += e.rail_fee;
    totalMerch += e.merchant_margin;
    aovSum += e.aov;
  }

  const avgAov = filtered.length > 0 ? aovSum / filtered.length : 0;
  const ctr = totalImp > 0 ? (totalClk / totalImp) * 100 : 0;
  const convRate = totalClk > 0 ? (totalPur / totalClk) * 100 : 0;

  const benchmarkConv = 2.2;
  const benchmarkCtr = 1.5;
  const convPerf = ((convRate - benchmarkConv) / benchmarkConv) * 100;
  const ctrPerf = ((ctr - benchmarkCtr) / benchmarkCtr) * 100;

  // Funnel stages
  const funnelStages = [
    { stage: "Impressions", count: totalImp, percent: 100.0, description: "Views on creator posts" },
    { stage: "Clicks", count: totalClk, percent: round(totalImp > 0 ? (totalClk / totalImp) * 100 : 0, 2), description: "Traffic redirected to store" },
    { stage: "Add to Cart", count: totalCrt, percent: round(totalClk > 0 ? (totalCrt / totalClk) * 100 : 0, 2), description: "High intent selection" },
    { stage: "Purchases", count: totalPur, percent: round(totalClk > 0 ? (totalPur / totalClk) * 100 : 0, 2), description: "Completed checkouts" },
    { stage: "Paid Creator", count: Math.round(totalPay), percent: round(totalRev > 0 ? (totalPay / totalRev) * 100 : 0, 2), description: "Creator payout share" },
  ];

  // Creator tiers comparison
  const tierAgg: Record<string, { imp: number; clk: number; crt: number; pur: number; rev: number; payout: number; commSum: number; count: number }> = {};
  for (const e of filtered) {
    if (!tierAgg[e.creator_tier]) {
      tierAgg[e.creator_tier] = { imp: 0, clk: 0, crt: 0, pur: 0, rev: 0, payout: 0, commSum: 0, count: 0 };
    }
    const t = tierAgg[e.creator_tier];
    t.imp += e.impressions;
    t.clk += e.clicks;
    t.crt += e.add_to_carts;
    t.pur += e.purchases;
    t.rev += e.order_value;
    t.payout += e.creator_payout;
    t.commSum += e.commission_rate * 100;
    t.count++;
  }

  const tierOrder: Record<string, number> = { Mega: 0, Macro: 1, Micro: 2, Nano: 3 };
  const tiersData = Object.entries(tierAgg)
    .map(([tierName, t]) => {
      const tCtr = t.imp > 0 ? (t.clk / t.imp) * 100 : 0;
      const tConv = t.clk > 0 ? (t.pur / t.clk) * 100 : 0;
      const tAov = t.pur > 0 ? t.rev / t.pur : 0;
      const tRoi = t.payout > 0 ? t.rev / t.payout : 0;
      const benchmarkRoi = 4.5;
      const roiPerf = ((tRoi - benchmarkRoi) / benchmarkRoi) * 100;

      return {
        tier: tierName,
        impressions: t.imp,
        clicks: t.clk,
        conversions: t.pur,
        revenue: round(t.rev, 2),
        payout: round(t.payout, 2),
        ctr: round(tCtr, 2),
        conversion_rate: round(tConv, 2),
        aov: round(tAov, 2),
        roi: round(tRoi, 2),
        roi_vs_benchmark: round(roiPerf, 1),
        avg_commission: round(t.count > 0 ? t.commSum / t.count : 0, 2),
      };
    })
    .sort((a, b) => (tierOrder[a.tier] ?? 4) - (tierOrder[b.tier] ?? 4));

  // Margin split
  const marginSplit = {
    creator: round(totalPay, 2),
    platform: round(totalPlat, 2),
    rails: round(totalRail, 2),
    merchant: round(totalMerch, 2),
    percentages: {
      creator: round(totalRev > 0 ? (totalPay / totalRev) * 100 : 0, 2),
      platform: round(totalRev > 0 ? (totalPlat / totalRev) * 100 : 0, 2),
      rails: round(totalRev > 0 ? (totalRail / totalRev) * 100 : 0, 2),
      merchant: round(totalRev > 0 ? (totalMerch / totalRev) * 100 : 0, 2),
    },
  };

  // Attribution windows
  let p1d = 0, p7d = 0, p14d = 0, p30d = 0;
  for (const e of filtered) {
    p1d += e.purchases_1d;
    p7d += e.purchases_7d;
    p14d += e.purchases_14d;
    p30d += e.purchases_30d;
  }

  const attributionData = [
    { window: "1-Day (Immediate)", conversions: p1d, revenue: round(p1d * avgAov, 2), percentage: round(p30d > 0 ? (p1d / p30d) * 100 : 0, 1) },
    { window: "7-Day (Standard)", conversions: p7d, revenue: round(p7d * avgAov, 2), percentage: round(p30d > 0 ? (p7d / p30d) * 100 : 0, 1) },
    { window: "14-Day (Extended)", conversions: p14d, revenue: round(p14d * avgAov, 2), percentage: round(p30d > 0 ? (p14d / p30d) * 100 : 0, 1) },
    { window: "30-Day (Full Cycle)", conversions: p30d, revenue: round(p30d * avgAov, 2), percentage: 100.0 },
  ];

  // World Bank context
  let countryContext: any;
  if (region !== "ALL" && COUNTRY_BENCHMARKS[region]) {
    const c = COUNTRY_BENCHMARKS[region];
    countryContext = {
      name: c.name,
      gdp_pc: c.gdp_pc,
      internet_penetration: c.internet,
      mobile_subscriptions: c.mobile,
    };
  } else {
    let totalGdp = 0, totalInt = 0, totalMob = 0, totalW = 0;
    for (const details of Object.values(COUNTRY_BENCHMARKS)) {
      const w = (details as any).volume_weight || 1.0;
      totalGdp += (details as any).gdp_pc * w;
      totalInt += (details as any).internet * w;
      totalMob += (details as any).mobile * w;
      totalW += w;
    }
    countryContext = {
      name: "Global Benchmark",
      gdp_pc: round(totalGdp / totalW, 2),
      internet_penetration: round(totalInt / totalW, 2),
      mobile_subscriptions: round(totalMob / totalW, 2),
    };
  }

  return Response.json({
    region,
    vertical,
    metrics: {
      total_clicks: totalClk,
      total_purchases: totalPur,
      total_revenue: round(totalRev, 2),
      creator_payout: round(totalPay, 2),
      avg_aov: round(avgAov, 2),
      conversion_rate: round(convRate, 2),
      conversion_vs_benchmark: round(convPerf, 1),
      ctr: round(ctr, 2),
      ctr_vs_benchmark: round(ctrPerf, 1),
    },
    funnel: funnelStages,
    tiers: tiersData,
    margin_split: marginSplit,
    attribution_windows: attributionData,
    macro_indicators: countryContext,
  });
}

function round(val: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}
