"use client";

import React, { useState, useEffect } from "react";
import { Sliders, RefreshCw, AlertCircle, Percent, DollarSign, ArrowUpRight } from "lucide-react";
import { Tooltip, DataSourceBadge } from "./tooltip";
import { TOOLTIPS } from "@/utils/tooltips";

interface SensitivityCalculatorProps {
  baseAov: number;
  baseConvRate: number;
  baseClicks: number;
  loading: boolean;
}

export default function SensitivityCalculator({
  baseAov,
  baseConvRate,
  baseClicks,
  loading
}: SensitivityCalculatorProps) {
  // Slider states initialized from regional filters
  const [clicks, setClicks] = useState<number>(50000);
  const [aov, setAov] = useState<number>(50);
  const [convRate, setConvRate] = useState<number>(3.0);
  const [commission, setCommission] = useState<number>(15.0);

  // Sync state when props update
  useEffect(() => {
    if (baseClicks) setClicks(Math.round(baseClicks));
    if (baseAov) setAov(Math.round(baseAov));
    if (baseConvRate) setConvRate(Number(baseConvRate.toFixed(2)));
  }, [baseAov, baseConvRate, baseClicks]);

  // Derived calculations
  const projectedPurchases = Math.round(clicks * (convRate / 100));
  const projectedRevenue = projectedPurchases * aov;
  const creatorPayout = projectedRevenue * (commission / 100);
  const platformFee = projectedRevenue * 0.06; // Fixed 6% platform fee
  const railFee = projectedRevenue * 0.03;     // Fixed 3% gateway/rail fee
  const merchantGrossProfit = projectedRevenue - (creatorPayout + platformFee + railFee);
  
  const creatorRoi = creatorPayout > 0 ? (projectedRevenue / creatorPayout) : 0;
  const merchantMarginPct = projectedRevenue > 0 ? (merchantGrossProfit / projectedRevenue) * 100 : 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-[#0B1117] border border-[#1F2937] rounded-lg p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Margin Sensitivity Simulator</h2>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">Test variations in commission yields and transaction volumes</p>
        </div>
        <div className="flex items-center space-x-2">
          <Sliders className="h-4 w-4 text-[#38BDF8]" />
          <DataSourceBadge type="synthetic" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sliders Control Panel */}
        <div className="space-y-4">
          
          {/* Clicks Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono items-center">
              <Tooltip content={TOOLTIPS.SENSITIVITY.CLICKS} position="right">
                <span className="text-gray-400 font-semibold uppercase cursor-help">Traffic Volume (Clicks)</span>
              </Tooltip>
              <span className="text-white font-bold">{clicks.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="250000"
              step="1000"
              value={clicks}
              onChange={(e) => setClicks(Number(e.target.value))}
              className="w-full accent-[#38BDF8] h-1 bg-[#030712] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>1K</span>
              <span>250K</span>
            </div>
          </div>

          {/* AOV Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono items-center">
              <Tooltip content={TOOLTIPS.SENSITIVITY.AOV} position="right">
                <span className="text-gray-400 font-semibold uppercase cursor-help">Average Order Value (AOV)</span>
              </Tooltip>
              <span className="text-white font-bold">${aov}</span>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              step="1"
              value={aov}
              onChange={(e) => setAov(Number(e.target.value))}
              className="w-full accent-[#818CF8] h-1 bg-[#030712] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>$5</span>
              <span>$200</span>
            </div>
          </div>

          {/* Conversion Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono items-center">
              <Tooltip content={TOOLTIPS.SENSITIVITY.CVR} position="right">
                <span className="text-gray-400 font-semibold uppercase cursor-help">Conversion Rate %</span>
              </Tooltip>
              <span className="text-[#38BDF8] font-bold">{convRate}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.1"
              value={convRate}
              onChange={(e) => setConvRate(Number(e.target.value))}
              className="w-full accent-[#38BDF8] h-1 bg-[#030712] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>0.1%</span>
              <span>10%</span>
            </div>
          </div>

          {/* Commission Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono items-center">
              <Tooltip content={TOOLTIPS.SENSITIVITY.COMMISSION} position="right">
                <span className="text-gray-400 font-semibold uppercase cursor-help">Creator Commission Share</span>
              </Tooltip>
              <span className="text-[#818CF8] font-bold">{commission}%</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="35.0"
              step="0.5"
              value={commission}
              onChange={(e) => setCommission(Number(e.target.value))}
              className="w-full accent-[#818CF8] h-1 bg-[#030712] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>5.0%</span>
              <span>35%</span>
            </div>
          </div>

        </div>

        {/* Calculations Output Card */}
        <div className="bg-[#030712] border border-[#1F2937] p-4 rounded-lg flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-gray-400 block font-mono">Simulated Economics</span>
            
            {/* Net revenue */}
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-400 font-mono">Projected Revenue</span>
              <span className="text-lg font-black text-white font-mono">{formatCurrency(projectedRevenue)}</span>
            </div>
            
            {/* Creator payouts */}
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-400 font-mono">Creator Payout ({commission}%)</span>
              <span className="text-sm font-bold text-[#38BDF8] font-mono">{formatCurrency(creatorPayout)}</span>
            </div>

            {/* Platform & Rails */}
            <div className="flex justify-between items-baseline border-b border-[#1F2937] pb-2">
              <span className="text-xs text-gray-400 font-mono">Platform + Rails (9%)</span>
              <span className="text-sm font-mono text-gray-300">{formatCurrency(platformFee + railFee)}</span>
            </div>

            {/* Merchant Gross profit */}
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-xs font-semibold text-gray-300 font-mono">Brand Gross profit</span>
              <span className={`text-lg font-extrabold font-mono ${merchantMarginPct > 50 ? "text-emerald-400" : "text-amber-400"}`}>
                {formatCurrency(merchantGrossProfit)}
              </span>
            </div>
          </div>

          {/* Efficiency indices */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1F2937]/50 font-mono text-xs">
            <div className="bg-[#0B1117] border border-[#1f2937] p-2.5 rounded-md text-center">
              <span className="block text-[8px] text-gray-500 uppercase font-bold">Creator ROI</span>
              <span className="text-[#818CF8] font-black text-sm block mt-0.5">{creatorRoi.toFixed(1)}x</span>
            </div>
            <div className="bg-[#0B1117] border border-[#1f2937] p-2.5 rounded-md text-center">
              <span className="block text-[8px] text-gray-500 uppercase font-bold">Brand Margin %</span>
              <span className={`font-black text-sm block mt-0.5 ${merchantMarginPct > 50 ? "text-emerald-400" : "text-amber-400"}`}>
                {merchantMarginPct.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Dynamic health warning */}
          {merchantMarginPct < 60 && (
            <div className="bg-amber-950/20 border border-amber-900/60 p-2.5 rounded-md flex items-start space-x-2 text-[10px] text-amber-300 font-mono">
              <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <span>High Creator share or low conversion compromises brand margin health (&lt; 60%).</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
