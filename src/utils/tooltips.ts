// Tooltip content library for all dashboard components

export const TOOLTIPS = {
  // Funnel Stages
  FUNNEL: {
    IMPRESSIONS: "Total number of times the creator's post was viewed across social platforms",
    CLICKS: "Click-through rate (CTR) — how many viewers clicked the product link",
    ADD_TO_CART: "High-intent users who added items to their cart but haven't purchased yet",
    PURCHASES: "Completed transactions attributed within the selected attribution window",
    PAID_CREATOR: "Total payout to the creator after platform and rail fees applied"
  },

  // Margin Split Components
  MARGIN: {
    CREATOR: "Creator earnings: commission % of total GMV (includes platform fees deducted)",
    PLATFORM: "Platform fee: typically 6% of GMV (TikTok Shop, Instagram Shopping, etc.)",
    RAILS: "Payment rail costs: 3% for credit card processing, fraud, chargebacks",
    MERCHANT: "Merchant keeps: residual after creator, platform, and rail costs"
  },

  // Attribution Windows
  ATTRIBUTION: {
    WINDOW_1D: "1-Day Window: Captures immediate purchases (usually ~50% of total revenue)",
    WINDOW_7D: "7-Day Window (Standard): Industry benchmark attribution window (~82% capture)",
    WINDOW_14D: "14-Day Window (Extended): Long-tail purchase decisions (~93% capture)",
    WINDOW_30D: "30-Day Window (Full Cycle): Complete customer journey (100% baseline)"
  },

  // Creator Tiers
  TIERS: {
    NANO: "Nano creators (1K-10K followers): Highest CTR but lowest volume — niche authority",
    MICRO: "Micro creators (10K-100K followers): Best ROI often here — trusted but scalable",
    MACRO: "Macro creators (100K-1M followers): High volume with declining per-creator efficiency",
    MEGA: "Mega creators (1M+ followers): Massive reach but lowest CTR % — general appeal"
  },

  // Sensitivity Sliders
  SENSITIVITY: {
    CLICKS: "Adjust traffic volume (site visits). More clicks → more purchase opportunities",
    AOV: "Adjust average order value. Higher AOV increases revenue per purchase",
    CVR: "Adjust conversion rate (% of clickers who buy). Impacts total purchases",
    COMMISSION: "Adjust creator commission %. Higher commission reduces merchant margin"
  },

  // Metrics
  METRICS: {
    TOTAL_REVENUE: "Gross Merchandise Value (GMV) — total revenue before all fees and splits",
    CONVERSION_RATE: "% of clicks that result in purchases (how many visitors actually buy)",
    CTR: "Click-through rate — % of impressions that result in clicks to product link",
    CREATOR_PAYOUT: "Total cash paid to the creator after platform and payment processing fees",
    AVG_AOV: "Average Order Value — total revenue divided by number of purchases",
    ROI: "Return on Investment for creator — revenue generated per $ of creator payout"
  },

  // Data Sources
  DATA_SOURCES: {
    WORLD_BANK: "Live macroeconomic data from World Bank Open Data (GDP, internet penetration, mobile subscriptions)",
    SYNTHETIC: "Deterministically generated synthetic commerce events using seeded PRNG (Mulberry32, seed=42) for reproducibility",
    BENCHMARKS: "Industry standard benchmarks — CTR 1.5%, CVR 2.2%, ROI 4.5x — based on public fintech research"
  }
};

export const SOURCE_ATTRIBUTION = {
  TITLE: "POC-54 Influencer Commerce Funnel",
  VERSION: "1.0.0",
  AUTHOR: "Ranjana KP",
  RAIL_CATEGORY: "Distribution & Demand",
  DATA_SOURCES: [
    {
      name: "World Bank Open Data",
      type: "Live API",
      url: "https://api.worldbank.org/v2",
      metrics: ["GDP per capita (USD)", "Internet penetration (%)", "Mobile subscriptions (per 100)"],
      fallback: "Static high-fidelity benchmarks on API timeout",
      regions: ["US", "Germany", "Brazil", "India", "Indonesia"]
    },
    {
      name: "Synthetic Commerce Events",
      type: "Deterministic PRNG",
      algorithm: "Mulberry32 (seed=42)",
      metrics: ["250 campaigns", "~1,250 event rows", "5 product verticals", "4 creator tiers"],
      coverage: "5 geographic regions × 5 verticals × 3-7 days per campaign"
    },
    {
      name: "Industry Benchmarks",
      type: "Static Reference",
      metrics: ["CTR: 1.5%", "CVR: 2.2%", "ROI: 4.5x"],
      source: "Public fintech & creator economy research",
      purpose: "Baseline comparison for performance metrics"
    }
  ],
  DATA_ENGINE: "Next.js API Route (/api/data) with client-side fallback (getLocalFallbackData)",
  DETERMINISTIC: "All synthetic data is seeded (seed=42) for reproducible results across sessions"
};

export function getSourceBadgeLabel(isLive: boolean, isSynthetic: boolean): string {
  if (isLive) return "Live Data";
  if (isSynthetic) return "Synthetic Data";
  return "Hybrid Data";
}

export function getSourceTooltip(dataType: "live" | "synthetic" | "hybrid"): string {
  switch (dataType) {
    case "live":
      return "This data is fetched live from World Bank API. Falls back to static benchmarks if API is unavailable.";
    case "synthetic":
      return "This is deterministically generated synthetic data using Mulberry32 PRNG (seed=42) for reproducible results.";
    case "hybrid":
      return "This data combines live World Bank macroeconomic indicators with synthetic commerce events.";
  }
}

export const SYNTHETIC_DATA_DISCLAIMER = `
All commerce event data (impressions, clicks, purchases, payouts) is synthetically generated using a deterministic 
seeded random number generator (Mulberry32, seed=42) for reproducibility and testing. Macroeconomic context 
(GDP, internet penetration, mobile) is sourced live from World Bank Open Data API.

This POC is for intelligence and analysis purposes only.
`;
