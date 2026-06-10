"use client";

import React, { useState } from "react";
import { Download, Info, Globe, Tags, Coins, BarChart3, ShieldAlert } from "lucide-react";
import { Tooltip, InfoIcon, DataSourceBadge } from "./tooltip";
import { TOOLTIPS } from "@/utils/tooltips";

interface SidebarProps {
  region: string;
  setRegion: (region: string) => void;
  vertical: string;
  setVertical: (vertical: string) => void;
  metrics: {
    total_clicks: number;
    total_purchases: number;
    total_revenue: number;
    creator_payout: number;
    avg_aov: number;
    conversion_rate: number;
    conversion_vs_benchmark: number;
    ctr: number;
    ctr_vs_benchmark: number;
  };
  macroStats: {
    name: string;
    gdp_pc: number;
    internet_penetration: number;
    mobile_subscriptions: number;
  };
  loading: boolean;
  isSynthetic?: boolean;
}

export default function Sidebar({
  region,
  setRegion,
  vertical,
  setVertical,
  metrics,
  macroStats,
  loading,
  isSynthetic = true
}: SidebarProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const countries = [
    { code: "ALL", name: "Global Benchmark" },
    { code: "US", name: "United States" },
    { code: "DE", name: "Germany" },
    { code: "BR", name: "Brazil" },
    { code: "IN", name: "India" },
    { code: "ID", name: "Indonesia" }
  ];

  const categories = [
    { code: "ALL", name: "All Verticals" },
    { code: "Fashion", name: "Fashion & Apparel" },
    { code: "Beauty", name: "Beauty & Cosmetics" },
    { code: "Tech", name: "Consumer Tech" },
    { code: "Gaming", name: "Gaming & Esports" },
    { code: "Home", name: "Home & Lifestyle" }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleDownload = () => {
    const url = `/api/download?region=${region}&vertical=${vertical}`;
    window.open(url, "_blank");
  };

  return (
    <aside className="w-full lg:w-[30%] bg-[#0B1117] border-b lg:border-b-0 lg:border-r border-[#1F2937] p-6 flex flex-col justify-between overflow-y-auto h-full space-y-6">
      
      {/* SECTION A: Title & Metrics */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8] animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-[#38BDF8] font-semibold">Distribution & Demand</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Influencer commerce funnel</h1>
          <p className="text-xs text-gray-400 mt-1">Real-time creator economy rail analytics</p>
        </div>

        {/* High-level metrics grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#030712] border border-[#1F2937] p-3 rounded-lg relative overflow-hidden">
            <div className="flex justify-between items-start">
              <Tooltip content={TOOLTIPS.METRICS.TOTAL_REVENUE} position="right">
                <span className="text-[10px] uppercase font-semibold text-gray-400">Total Revenue</span>
              </Tooltip>
              <Coins className="h-3.5 w-3.5 text-[#818CF8]" />
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {loading ? "..." : formatCurrency(metrics.total_revenue)}
            </div>
            <div className="text-[9px] text-[#38BDF8] mt-1 font-mono">
              Creator pay: {loading ? "..." : formatCurrency(metrics.creator_payout)}
            </div>
            <DataSourceBadge type={isSynthetic ? "synthetic" : "hybrid"} className="mt-2" />
          </div>

          <div className="bg-[#030712] border border-[#1F2937] p-3 rounded-lg relative overflow-hidden">
            <div className="flex justify-between items-start">
              <Tooltip content={TOOLTIPS.METRICS.CONVERSION_RATE} position="left">
                <span className="text-[10px] uppercase font-semibold text-gray-400">Avg Conversion</span>
              </Tooltip>
              <BarChart3 className="h-3.5 w-3.5 text-[#38BDF8]" />
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {loading ? "..." : `${metrics.conversion_rate.toFixed(2)}%`}
            </div>
            <div className={`text-[9px] mt-1 font-mono ${metrics.conversion_vs_benchmark >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {loading ? "..." : `${metrics.conversion_vs_benchmark >= 0 ? "+" : ""}${metrics.conversion_vs_benchmark.toFixed(1)}% vs benchmark`}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: Why This Matters */}
      <div className="bg-[#030712] border border-[#1F2937] p-4 rounded-lg relative">
        <div className="flex items-center space-x-2 text-[#38BDF8] text-xs font-semibold uppercase tracking-wider mb-2">
          <Info className="h-4 w-4" />
          <span>Why This Matters</span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          Useful for DTC founders and everyday viewers alike. Platforms are compressing merchant margins; influencer networks act as critical distribution conduits. Understanding funnel leakages ensures brand survival and optimizes capital allocation.
        </p>
      </div>

      {/* SECTION C: Who Controls the Rail */}
      <div className="bg-[#030712] border border-[#1F2937] p-4 rounded-lg relative">
        <div className="flex items-center space-x-2 text-[#818CF8] text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldAlert className="h-4 w-4" />
          <span>Who Controls the Rail</span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          Platform giants (TikTok Shop, Instagram, YouTube) and creator networks act as the gatekeepers of discovery-to-purchase flow, dictating terms, fees, and algorithmic reach that determine whether a brand or creator captures margin or surrenders it.
        </p>
      </div>

      {/* SECTION D: Functional Filters */}
      <div className="space-y-4">
        <div className="border-t border-[#1F2937] pt-4">
          <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider block mb-3">Controls & Calibration</span>
          
          {/* Region selector */}
          <div className="space-y-1.5 mb-3">
            <div className="flex justify-between items-center">
              <label className="text-[11px] text-gray-400 flex items-center space-x-1">
                <Globe className="h-3 w-3 text-[#38BDF8]" />
                <span>Geographic Filter</span>
              </label>
              <button
                onMouseEnter={() => setShowTooltip("region")}
                onMouseLeave={() => setShowTooltip(null)}
                className="text-gray-500 hover:text-white"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </div>
            
            {showTooltip === "region" && (
              <div className="bg-slate-900 border border-[#1F2937] text-[10px] text-gray-300 p-2 rounded mb-2 leading-relaxed">
                Applies World Bank macro factors (GDP pc: ${macroStats.gdp_pc.toLocaleString()}, Internet: {macroStats.internet_penetration}%) to scale simulated values.
              </div>
            )}

            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-[#030712] border border-[#1F2937] text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Vertical selector */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] text-gray-400 flex items-center space-x-1">
                <Tags className="h-3 w-3 text-[#818CF8]" />
                <span>Campaign Category</span>
              </label>
              <button
                onMouseEnter={() => setShowTooltip("vertical")}
                onMouseLeave={() => setShowTooltip(null)}
                className="text-gray-500 hover:text-white"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </div>

            {showTooltip === "vertical" && (
              <div className="bg-slate-900 border border-[#1F2937] text-[10px] text-gray-300 p-2 rounded mb-2 leading-relaxed">
                Filters creator campaign categories which scale Average Order Value (AOV) and conversion yields.
              </div>
            )}

            <select
              value={vertical}
              onChange={(e) => setVertical(e.target.value)}
              className="w-full bg-[#030712] border border-[#1F2937] text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-[#818CF8] focus:ring-1 focus:ring-[#818CF8]"
            >
              {categories.map((cat) => (
                <option key={cat.code} value={cat.code}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* World Bank Macro indicators panel */}
        <div className="bg-[#030712] border border-[#1F2937] p-3 rounded-lg text-xs space-y-1.5 font-mono">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              World Bank Context: {macroStats.name}
            </span>
            <DataSourceBadge type="live" />
          </div>
          <div className="flex justify-between">
            <Tooltip content={TOOLTIPS.DATA_SOURCES.WORLD_BANK} position="right">
              <span className="text-gray-400">GDP Per Capita:</span>
            </Tooltip>
            <span className="text-white">${Math.round(macroStats.gdp_pc).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Internet Users:</span>
            <span className="text-[#38BDF8]">{macroStats.internet_penetration}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Mobile Coverage:</span>
            <span className="text-[#818CF8]">{macroStats.mobile_subscriptions}%</span>
          </div>
        </div>
      </div>

      {/* SECTION E: Download Sample Data */}
      <button
        onClick={handleDownload}
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#1F2937] to-[#111827] hover:from-[#38BDF8] hover:to-[#818CF8] text-white hover:text-[#030712] font-semibold text-xs py-3 px-4 rounded-lg flex items-center justify-center space-x-2 border border-[#1F2937] hover:border-transparent transition-all duration-300 shadow-md glow-cyan-hover"
      >
        <Download className="h-4 w-4" />
        <span>Download Raw Dataset (CSV)</span>
      </button>

    </aside>
  );
}
