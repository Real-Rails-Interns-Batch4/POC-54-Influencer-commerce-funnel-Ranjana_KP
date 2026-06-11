export const COUNTRY_BENCHMARKS: Record<
  string,
  { name: string; gdp_pc: number; internet: number; mobile: number; aov_base: number; volume_weight: number }
> = {
  US: { name: "United States", gdp_pc: 76398, internet: 91.8, mobile: 110.1, aov_base: 85, volume_weight: 1.0 },
  DE: { name: "Germany", gdp_pc: 48432, internet: 89.6, mobile: 118.5, aov_base: 75, volume_weight: 0.8 },
  BR: { name: "Brazil", gdp_pc: 8917, internet: 81.3, mobile: 102.4, aov_base: 30, volume_weight: 1.5 },
  IN: { name: "India", gdp_pc: 2410, internet: 52.4, mobile: 84.8, aov_base: 18, volume_weight: 2.2 },
  ID: { name: "Indonesia", gdp_pc: 4788, internet: 73.7, mobile: 133.2, aov_base: 22, volume_weight: 1.8 },
};

export const VERTICAL_MULTIPLIERS: Record<
  string,
  { aov_mult: number; conv_mult: number; ctr_mult: number; commission: number }
> = {
  Fashion: { aov_mult: 1.1, conv_mult: 1.1, ctr_mult: 1.2, commission: 0.18 },
  Beauty: { aov_mult: 0.9, conv_mult: 1.3, ctr_mult: 1.4, commission: 0.20 },
  Tech: { aov_mult: 2.5, conv_mult: 0.7, ctr_mult: 0.8, commission: 0.08 },
  Gaming: { aov_mult: 1.4, conv_mult: 0.8, ctr_mult: 0.9, commission: 0.10 },
  Home: { aov_mult: 1.8, conv_mult: 0.9, ctr_mult: 0.7, commission: 0.12 },
};

export const CREATOR_TIERS: Record<
  string,
  { min_followers: number; max_followers: number; ctr: number; conv: number; commission_boost: number }
> = {
  Nano: { min_followers: 1000, max_followers: 10000, ctr: 0.045, conv: 0.052, commission_boost: 1.2 },
  Micro: { min_followers: 10000, max_followers: 100000, ctr: 0.032, conv: 0.040, commission_boost: 1.1 },
  Macro: { min_followers: 100000, max_followers: 1000000, ctr: 0.021, conv: 0.028, commission_boost: 0.9 },
  Mega: { min_followers: 1000000, max_followers: 10000000, ctr: 0.012, conv: 0.018, commission_boost: 0.7 },
};

export const PLATFORMS = ["TikTok Shop", "Instagram Reels", "YouTube Shorts"] as const;

export const CTR_BENCHMARK = 1.5;
export const CVR_BENCHMARK = 2.2;
export const PLATFORM_FEE_RATE = 0.06;
export const RAILS_FEE_RATE = 0.03;
