"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

interface FunnelStage {
  stage: string;
  count: number;
  percent: number;
  description: string;
}

interface FunnelChartProps {
  data: FunnelStage[];
  loading: boolean;
}

export default function FunnelChart({ data, loading }: FunnelChartProps) {
  if (loading || !data || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-[#0B1117] rounded-lg border border-[#1F2937]">
        <div className="text-gray-400 text-sm font-mono flex items-center space-x-2">
          <span className="h-4 w-4 rounded-full border-2 border-t-[#38BDF8] border-[#1F2937] animate-spin"></span>
          <span>Loading Funnel Engine...</span>
        </div>
      </div>
    );
  }

  // Map backend stages to ECharts format
  const chartData = data.map((d, index) => {
    // Custom color palette matching the fintech terminal spec
    const colors = [
      "#1e293b", // Slate-800 for impressions
      "#818cf8", // Indigo for clicks
      "#4f46e5", // Darker Indigo for Add to Cart
      "#38bdf8", // Electric Cyan for Purchases
      "#0ea5e9"  // Cyber Cyan for Creator Payouts
    ];
    return {
      name: d.stage,
      value: d.count,
      percent: d.percent,
      description: d.description,
      itemStyle: {
        color: colors[index % colors.length],
        borderColor: "#1F2937",
        borderWidth: 1,
        shadowColor: index === 3 ? "rgba(56, 189, 248, 0.4)" : "rgba(0,0,0,0)",
        shadowBlur: index === 3 ? 10 : 0
      }
    };
  });

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
        const d = data.find(item => item.stage === params.name);
        return `
          <div style="padding: 4px 8px;">
            <b style="color: ${params.color}; font-size: 13px;">${params.name}</b><br/>
            <span style="color: #9ca3af;">Volume:</span> <b>${params.value.toLocaleString()}</b><br/>
            <span style="color: #9ca3af;">Rate:</span> <b>${params.data.percent}%</b><br/>
            <i style="color: #6b7280; font-size: 10px;">${params.data.description}</i>
          </div>
        `;
      }
    },
    legend: {
      data: data.map(d => d.stage),
      textStyle: {
        color: "#9ca3af",
        fontFamily: "Inter, sans-serif",
        fontSize: 10
      },
      bottom: "2%"
    },
    series: [
      {
        name: "Funnel Yield",
        type: "funnel",
        left: "10%",
        top: "10%",
        bottom: "15%",
        width: "80%",
        min: 0,
        maxSize: "100%",
        sort: "descending",
        gap: 2,
        label: {
          show: true,
          position: "inside",
          formatter: function (params: any) {
            return `${params.name}\n${params.data.percent}%`;
          },
          textStyle: {
            color: "#ffffff",
            fontFamily: "Inter, sans-serif",
            fontWeight: "bold",
            fontSize: 10
          }
        },
        labelLine: {
          show: false
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: "#1F2937"
        },
        data: chartData
      }
    ]
  };

  return (
    <div className="bg-[#0B1117] rounded-lg border border-[#1F2937] p-5 glow-active-hover transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Commerce Conversion Funnel</h2>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">Discovery-to-purchase volume efficiency</p>
        </div>
        <div className="text-right text-[10px] text-gray-400 font-mono">
          Stage Yield Rate %
        </div>
      </div>
      
      <div className="h-[350px]">
        <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
      </div>

      <div className="grid grid-cols-5 gap-2 mt-4 pt-4 border-t border-[#1F2937] text-center">
        {data.map((stage, idx) => (
          <div key={stage.stage} className="space-y-0.5">
            <span className="text-[9px] text-gray-500 uppercase block font-semibold truncate">{stage.stage}</span>
            <span className="text-xs font-bold text-white font-mono block">{stage.count.toLocaleString()}</span>
            <span className="text-[9px] text-[#38BDF8] font-mono block">
              {idx === 0 ? "100%" : `${stage.percent}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
