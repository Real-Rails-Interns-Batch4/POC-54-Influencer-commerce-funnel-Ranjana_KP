"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import { DataSourceBadge } from "./tooltip";
import { TOOLTIPS } from "@/utils/tooltips";

interface MarginPercentages {
  creator: number;
  platform: number;
  rails: number;
  merchant: number;
}

interface MarginSplitProps {
  data: {
    creator: number;
    platform: number;
    rails: number;
    merchant: number;
    percentages: MarginPercentages;
  };
  loading: boolean;
}

export default function MarginSplit({ data, loading }: MarginSplitProps) {
  if (loading || !data) {
    return (
      <div className="h-[280px] flex items-center justify-center bg-[#0B1117] rounded-lg border border-[#1F2937]">
        <div className="text-gray-400 text-sm font-mono flex items-center space-x-2">
          <span className="h-4 w-4 rounded-full border-2 border-t-[#38BDF8] border-[#1F2937] animate-spin"></span>
          <span>Loading Margin Rails...</span>
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

  const chartData = [
    { name: "Merchant Margin", value: data.merchant, percent: data.percentages.merchant, color: "#10b981", tooltip: TOOLTIPS.MARGIN.MERCHANT }, // Emerald
    { name: "Creator Share", value: data.creator, percent: data.percentages.creator, color: "#38bdf8", tooltip: TOOLTIPS.MARGIN.CREATOR }, // Electric Cyan
    { name: "Platform Fee", value: data.platform, percent: data.percentages.platform, color: "#818cf8", tooltip: TOOLTIPS.MARGIN.PLATFORM }, // Indigo
    { name: "Rail Costs", value: data.rails, percent: data.percentages.rails, color: "#4b5563", tooltip: TOOLTIPS.MARGIN.RAILS } // Slate Grey
  ];

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      backgroundColor: "#0B1117",
      borderColor: "#1F2937",
      textStyle: {
        color: "#f3f4f6",
        fontFamily: "Inter, sans-serif",
        fontSize: 11
      },
      formatter: function (params: any) {
        return `
          <div style="padding: 6px 10px; max-width: 240px;">
            <b style="color: ${params.color}; font-size: 12px;">${params.name}</b><br/>
            <span style="color: #9ca3af;">Payout:</span> <b>${formatCurrency(params.value)}</b><br/>
            <span style="color: #9ca3af;">Share:</span> <b>${params.data.percent}%</b><br/>
            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #374151; font-size: 10px; color: #9ca3af;">
              ℹ ${params.data.tooltip}
            </div>
          </div>
        `;
      }
    },
    series: [
      {
        name: "Margin Share",
        type: "pie",
        radius: ["55%", "75%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: "#0B1117",
          borderWidth: 2
        },
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 11,
            fontWeight: "bold",
            color: "#ffffff",
            formatter: "{b}\n{d}%"
          }
        },
        labelLine: {
          show: false
        },
        data: chartData.map(d => ({
          name: d.name,
          value: d.value,
          percent: d.percent,
          itemStyle: { color: d.color }
        }))
      }
    ]
  };

  return (
    <div className="bg-[#0B1117] rounded-lg border border-[#1F2937] p-5 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Margin Share Breakdown</h2>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">Economic yield split across distribution partners</p>
        </div>
        <DataSourceBadge type="synthetic" />
      </div>

      <div className="flex items-center justify-between my-2">
        {/* Doughnut Chart Stage */}
        <div className="h-[150px] w-[150px] relative">
          <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Brand Keep</span>
            <span className="text-sm font-extrabold text-[#10b981] font-mono">
              {data.percentages.merchant.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Legend Panel */}
        <div className="flex-1 pl-4 space-y-2.5">
          {chartData.map((item) => (
            <div key={item.name} className="flex justify-between items-center text-[11px]">
              <div className="flex items-center space-x-1.5 min-w-0">
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-gray-400 truncate">{item.name}</span>
              </div>
              <div className="text-right font-mono font-semibold pl-2">
                <span className="text-white block">{formatCurrency(item.value)}</span>
                <span className="text-gray-500 text-[9px] block">{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#1F2937] pt-3 text-[10px] text-gray-400 leading-relaxed font-mono flex items-center space-x-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]"></span>
        <span>Brand captures bulk margin but relies heavily on creator payout loops.</span>
      </div>
    </div>
  );
}
