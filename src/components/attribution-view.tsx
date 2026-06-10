"use client";

import React, { useState } from "react";
import { Calendar, RefreshCw, BarChart2 } from "lucide-react";
import { Tooltip, DataSourceBadge } from "./tooltip";
import { TOOLTIPS } from "@/utils/tooltips";

interface AttributionWindow {
  window: string;
  conversions: number;
  revenue: number;
  percentage: number;
}

interface AttributionViewProps {
  data: AttributionWindow[];
  loading: boolean;
}

export default function AttributionView({ data, loading }: AttributionViewProps) {
  const [selectedWindow, setSelectedWindow] = useState<string>("7-Day (Standard)");

  if (loading || !data || data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center bg-[#0B1117] rounded-lg border border-[#1F2937]">
        <div className="text-gray-400 text-sm font-mono flex items-center space-x-2">
          <span className="h-4 w-4 rounded-full border-2 border-t-[#38BDF8] border-[#1F2937] animate-spin"></span>
          <span>Computing Attribution Latency...</span>
        </div>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  const activeData = data.find(d => d.window === selectedWindow) || data[1];

  return (
    <div className="bg-[#0B1117] border border-[#1F2937] rounded-lg p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Attribution Windows Comparison</h2>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">Capture rate of creator-attributed purchases</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-[#818CF8]" />
            <DataSourceBadge type="synthetic" />
          </div>
        </div>

        {/* Windows selection tabs with tooltips */}
        <div className="grid grid-cols-4 gap-1.5 mt-4">
          {data.map((item, idx) => {
            const tooltips = [
              TOOLTIPS.ATTRIBUTION.WINDOW_1D,
              TOOLTIPS.ATTRIBUTION.WINDOW_7D,
              TOOLTIPS.ATTRIBUTION.WINDOW_14D,
              TOOLTIPS.ATTRIBUTION.WINDOW_30D
            ];
            return (
              <Tooltip key={item.window} content={tooltips[idx]} position="bottom">
                <button
                  onClick={() => setSelectedWindow(item.window)}
                  className={`py-1.5 px-1 rounded-md text-[9px] font-mono font-bold tracking-tight transition-all duration-200 border cursor-help ${
                    selectedWindow === item.window
                      ? "bg-[#38BDF8]/10 border-[#38BDF8] text-[#38BDF8] glow-active"
                      : "bg-[#030712] border-[#1F2937] text-gray-400 hover:text-white"
                  }`}
                >
                  {item.window.split(" ")[0]}
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* Detailed Stats Panel */}
        <div className="bg-[#030712] border border-[#1F2937] p-3 rounded-lg mt-4 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-mono block">Attributed Revenue</span>
            <span className="text-lg font-black text-white font-mono">{formatCurrency(activeData.revenue)}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-mono block">Conversions</span>
            <span className="text-sm font-bold text-[#38BDF8] font-mono">{activeData.conversions.toLocaleString()}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-mono block">Capture Efficiency</span>
            <span className="text-sm font-bold text-[#818CF8] font-mono">{activeData.percentage}%</span>
          </div>
        </div>

        {/* Relative Bars comparing to 30-day baseline */}
        <div className="mt-4 space-y-2.5">
          {data.map((item) => {
            const isSelected = selectedWindow === item.window;
            return (
              <div key={item.window} className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className={isSelected ? "text-[#38BDF8] font-bold" : "text-gray-400"}>
                    {item.window}
                  </span>
                  <span className="text-gray-500">
                    {item.percentage}% ({formatCurrency(item.revenue)})
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#030712] border border-[#1f2937]/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isSelected ? "bg-[#38BDF8]" : "bg-[#818CF8]/50"
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[#1F2937] pt-3 mt-4 text-[10px] text-gray-400 leading-relaxed font-mono flex items-center space-x-2">
        <RefreshCw className="h-3.5 w-3.5 text-[#38BDF8] animate-spin-slow" />
        <span>Attribution window lengths impact creator ROI reporting and brand CAC.</span>
      </div>
    </div>
  );
}
