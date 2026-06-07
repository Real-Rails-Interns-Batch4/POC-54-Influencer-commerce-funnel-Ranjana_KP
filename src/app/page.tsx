"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import FunnelChart from "@/components/funnel-chart";
import CreatorTable from "@/components/creator-table";
import MarginSplit from "@/components/margin-split";
import AttributionView from "@/components/attribution-view";
import SensitivityCalculator from "@/components/sensitivity-calculator";
import { AlertCircle, Terminal, HelpCircle } from "lucide-react";

// Local highly responsive self-healing mock fallback (as per Guardrails / 2-Hour Rule)
const getLocalFallbackData = (region: string, vertical: string) => {
  // Base benchmarks
  const countryBenchmarks: Record<string, any> = {
    ALL: { name: "Global Benchmark", gdp_pc: 28100, internet: 75.8, mobile: 109.8, aov_mult: 1.0, vol_mult: 1.0 },
    US: { name: "United States", gdp_pc: 76398, internet: 91.8, mobile: 110.1, aov_mult: 1.5, vol_mult: 1.0 },
    DE: { name: "Germany", gdp_pc: 48432, internet: 89.6, mobile: 118.5, aov_mult: 1.3, vol_mult: 0.8 },
    BR: { name: "Brazil", gdp_pc: 8917, internet: 81.3, mobile: 102.4, aov_mult: 0.5, vol_mult: 1.5 },
    IN: { name: "India", gdp_pc: 2410, internet: 52.4, mobile: 84.8, aov_mult: 0.3, vol_mult: 2.2 },
    ID: { name: "Indonesia", gdp_pc: 4788, internet: 73.7, mobile: 133.2, aov_mult: 0.4, vol_mult: 1.8 }
  };

  const vertMultipliers: Record<string, any> = {
    ALL: { aov_mult: 1.0, conv_mult: 1.0, ctr_mult: 1.0, comm: 15 },
    Fashion: { aov_mult: 1.1, conv_mult: 1.1, ctr_mult: 1.2, comm: 18 },
    Beauty: { aov_mult: 0.9, conv_mult: 1.3, ctr_mult: 1.4, comm: 20 },
    Tech: { aov_mult: 2.5, conv_mult: 0.7, ctr_mult: 0.8, comm: 8 },
    Gaming: { aov_mult: 1.4, conv_mult: 0.8, ctr_mult: 0.9, comm: 10 },
    Home: { aov_mult: 1.8, conv_mult: 0.9, ctr_mult: 0.7, comm: 12 }
  };

  const country = countryBenchmarks[region] || countryBenchmarks.ALL;
  const vert = vertMultipliers[vertical] || vertMultipliers.ALL;

  const scaledAov = 50 * country.aov_mult * vert.aov_mult;
  const rawClicks = Math.round(50000 * country.vol_mult * vert.ctr_mult);
  const conversionRate = 3.0 * vert.conv_mult * (country.internet / 80);
  const purchases = Math.round(rawClicks * (conversionRate / 100));
  const totalRevenue = purchases * scaledAov;
  const commission = vert.comm;
  const creatorPayout = totalRevenue * (commission / 100);
  
  const platform = totalRevenue * 0.06;
  const rails = totalRevenue * 0.03;
  const merchant = totalRevenue - (creatorPayout + platform + rails);

  return {
    region,
    vertical,
    metrics: {
      total_clicks: rawClicks,
      total_purchases: purchases,
      total_revenue: totalRevenue,
      creator_payout: creatorPayout,
      avg_aov: scaledAov,
      conversion_rate: conversionRate,
      conversion_vs_benchmark: ((conversionRate - 2.2) / 2.2) * 100,
      ctr: 2.1 * vert.ctr_mult * (country.mobile / 100),
      ctr_vs_benchmark: ((2.1 * vert.ctr_mult * (country.mobile / 100) - 1.5) / 1.5) * 100
    },
    funnel: [
      { stage: "Impressions", count: rawClicks * 40, percent: 100.0, description: "Views on creator posts" },
      { stage: "Clicks", count: rawClicks, percent: Number(((rawClicks / (rawClicks * 40)) * 100).toFixed(2)), description: "Traffic redirected to store" },
      { stage: "Add to Cart", count: Math.round(rawClicks * 0.12), percent: 12.0, description: "High intent selection" },
      { stage: "Purchases", count: purchases, percent: Number(conversionRate.toFixed(2)), description: "Completed checkouts" },
      { stage: "Paid Creator", count: Math.round(creatorPayout), percent: commission, description: "Creator payout share" }
    ],
    tiers: [
      { tier: "Mega", impressions: Math.round(rawClicks * 25), clicks: Math.round(rawClicks * 0.45), conversions: Math.round(purchases * 0.25), revenue: totalRevenue * 0.25, payout: creatorPayout * 0.12, ctr: 1.8, conversion_rate: conversionRate * 0.6, aov: scaledAov * 1.1, roi: (totalRevenue * 0.25) / (creatorPayout * 0.12 || 1), roi_vs_benchmark: 15.5, avg_commission: commission * 0.7 },
      { tier: "Macro", impressions: Math.round(rawClicks * 10), clicks: Math.round(rawClicks * 0.3), conversions: Math.round(purchases * 0.35), revenue: totalRevenue * 0.35, payout: creatorPayout * 0.35, ctr: 3.0, conversion_rate: conversionRate * 1.1, aov: scaledAov, roi: (totalRevenue * 0.35) / (creatorPayout * 0.35 || 1), roi_vs_benchmark: 45.2, avg_commission: commission * 1.0 },
      { tier: "Micro", impressions: Math.round(rawClicks * 4), clicks: Math.round(rawClicks * 0.2), conversions: Math.round(purchases * 0.3), revenue: totalRevenue * 0.3, payout: creatorPayout * 0.4, ctr: 5.0, conversion_rate: conversionRate * 1.5, aov: scaledAov * 0.95, roi: (totalRevenue * 0.3) / (creatorPayout * 0.4 || 1), roi_vs_benchmark: 52.8, avg_commission: commission * 1.1 },
      { tier: "Nano", impressions: Math.round(rawClicks * 1), clicks: Math.round(rawClicks * 0.05), conversions: Math.round(purchases * 0.1), revenue: totalRevenue * 0.1, payout: creatorPayout * 0.13, ctr: 5.0, conversion_rate: conversionRate * 2.0, aov: scaledAov * 0.9, roi: (totalRevenue * 0.1) / (creatorPayout * 0.13 || 1), roi_vs_benchmark: -8.5, avg_commission: commission * 1.2 }
    ],
    margin_split: {
      creator: creatorPayout,
      platform,
      rails,
      merchant,
      percentages: {
        creator: Number(((creatorPayout / totalRevenue) * 100).toFixed(2)),
        platform: 6.0,
        rails: 3.0,
        merchant: Number(((merchant / totalRevenue) * 100).toFixed(2))
      }
    },
    attribution_windows: [
      { window: "1-Day (Immediate)", conversions: Math.round(purchases * 0.50), revenue: totalRevenue * 0.50, percentage: 50.0 },
      { window: "7-Day (Standard)", conversions: Math.round(purchases * 0.82), revenue: totalRevenue * 0.82, percentage: 82.0 },
      { window: "14-Day (Extended)", conversions: Math.round(purchases * 0.93), revenue: totalRevenue * 0.93, percentage: 93.0 },
      { window: "30-Day (Full Cycle)", conversions: purchases, revenue: totalRevenue, percentage: 100.0 }
    ],
    macro_indicators: {
      name: country.name,
      gdp_pc: country.gdp_pc,
      internet_penetration: country.internet,
      mobile_subscriptions: country.mobile
    }
  };
};

export default function DashboardPage() {
  const [region, setRegion] = useState<string>("ALL");
  const [vertical, setVertical] = useState<string>("ALL");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallbackMode, setIsFallbackMode] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/data?region=${region}&vertical=${vertical}`);
        if (!res.ok) {
          throw new Error("API responded with an error");
        }
        const json = await res.json();
        setData(json);
        setIsFallbackMode(false);
      } catch (err) {
        // Switch to local self-healing mock fallback
        const fallback = getLocalFallbackData(region, vertical);
        setData(fallback);
        setIsFallbackMode(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [region, vertical]);

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col font-sans">
      
      {/* Dashboard Top Header bar */}
      <header className="bg-[#0B1117] border-b border-[#1F2937] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Terminal className="h-5 w-5 text-[#38BDF8]" />
          <span className="font-mono text-sm font-semibold tracking-wider text-white">REAL RAILS INTELLIGENCE LIBRARY // POC-54</span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          {isFallbackMode ? (
            <div className="flex items-center space-x-1.5 bg-amber-950/20 border border-amber-900/50 px-2.5 py-1 rounded-md text-amber-400">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Offline Fallback Mode Active</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 bg-emerald-950/20 border border-emerald-900/50 px-2.5 py-1 rounded-md text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>DuckDB Core Engine Connected</span>
            </div>
          )}
          <span className="text-gray-500 font-mono">v1.0.0</span>
        </div>
      </header>

      {/* 2-Column Split Dashboard Shell */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Intelligence Sidebar (30% width on large screens) */}
        <Sidebar
          region={region}
          setRegion={setRegion}
          vertical={vertical}
          setVertical={setVertical}
          metrics={data?.metrics || {
            total_clicks: 0,
            total_purchases: 0,
            total_revenue: 0,
            creator_payout: 0,
            avg_aov: 0,
            conversion_rate: 0,
            conversion_vs_benchmark: 0,
            ctr: 0,
            ctr_vs_benchmark: 0
          }}
          macroStats={data?.macro_indicators || {
            name: "Loading...",
            gdp_pc: 0,
            internet_penetration: 0,
            mobile_subscriptions: 0
          }}
          loading={loading}
        />

        {/* Main Stage (70% width on large screens) */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6 lg:max-h-[calc(100vh-60px)]">
          
          {/* Top Stage Grid (Funnel + Margin Doughnut) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <FunnelChart
                data={data?.funnel || []}
                loading={loading}
              />
            </div>
            <div>
              <MarginSplit
                data={data?.margin_split || null}
                loading={loading}
              />
            </div>
          </div>

          {/* Middle Stage: Creator Comparison Table */}
          <CreatorTable
            data={data?.tiers || []}
            loading={loading}
          />

          {/* Bottom Grid: Attribution Comparison + Sensitivity Simulation */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div>
              <AttributionView
                data={data?.attribution_windows || []}
                loading={loading}
              />
            </div>
            <div className="xl:col-span-2">
              <SensitivityCalculator
                baseAov={data?.metrics?.avg_aov || 50}
                baseConvRate={data?.metrics?.conversion_rate || 3.0}
                baseClicks={data?.metrics?.total_clicks || 50000}
                loading={loading}
              />
            </div>
          </div>

        </main>

      </div>
    </div>
  );
}
