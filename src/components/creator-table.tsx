"use client";

import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TrendingUp, Users, Percent, DollarSign } from "lucide-react";

interface CreatorTierStats {
  tier: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  payout: number;
  ctr: number;
  conversion_rate: number;
  aov: number;
  roi: number;
  roi_vs_benchmark: number;
  avg_commission: number;
}

interface CreatorTableProps {
  data: CreatorTierStats[];
  loading: boolean;
}

const columnHelper = createColumnHelper<CreatorTierStats>();

export default function CreatorTable({ data, loading }: CreatorTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("tier", {
        header: () => <span className="text-gray-400">Creator Tier</span>,
        cell: (info) => (
          <div className="flex items-center space-x-2 py-1">
            <Users className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span className="font-semibold text-white">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("impressions", {
        header: () => <span className="text-right block">Impressions</span>,
        cell: (info) => (
          <span className="font-mono text-right block text-gray-300">
            {info.getValue().toLocaleString()}
          </span>
        ),
      }),
      columnHelper.accessor("ctr", {
        header: () => <span className="text-right block">CTR %</span>,
        cell: (info) => (
          <span className="font-mono text-right block text-gray-300">
            {info.getValue().toFixed(2)}%
          </span>
        ),
      }),
      columnHelper.accessor("conversion_rate", {
        header: () => <span className="text-right block">CVR %</span>,
        cell: (info) => (
          <span className="font-mono text-right block text-[#38BDF8] font-bold">
            {info.getValue().toFixed(2)}%
          </span>
        ),
      }),
      columnHelper.accessor("aov", {
        header: () => <span className="text-right block">Avg AOV</span>,
        cell: (info) => (
          <span className="font-mono text-right block text-gray-300">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("revenue", {
        header: () => <span className="text-right block">Revenue</span>,
        cell: (info) => (
          <span className="font-mono text-right block text-white font-bold">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("roi", {
        header: () => <span className="text-right block">Yield ROI</span>,
        cell: (info) => {
          const roi = info.getValue();
          const vsBenchmark = info.row.original.roi_vs_benchmark;
          return (
            <div className="text-right">
              <span className="font-mono text-[#818CF8] font-bold block">{roi.toFixed(1)}x</span>
              <span className={`text-[9px] font-mono block ${vsBenchmark >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {vsBenchmark >= 0 ? "+" : ""}{vsBenchmark.toFixed(1)}% vs industry
              </span>
            </div>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading || !data || data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center bg-[#0B1117] rounded-lg border border-[#1F2937]">
        <div className="text-gray-400 text-sm font-mono flex items-center space-x-2">
          <span className="h-4 w-4 rounded-full border-2 border-t-[#38BDF8] border-[#1F2937] animate-spin"></span>
          <span>Compiling Creator Cohorts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1117] border border-[#1F2937] rounded-lg p-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Creator Performance Metrics</h2>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">Segmented campaign conversion indices</p>
        </div>
        <div className="flex items-center space-x-2 bg-[#030712] border border-[#1F2937] px-2.5 py-1 rounded-md text-[10px] text-gray-400 font-mono">
          <TrendingUp className="h-3 w-3 text-[#38BDF8]" />
          <span>Macro Benchmark: 4.5x ROI</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-[#1F2937] pb-2">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="pb-3 text-[10px] uppercase font-semibold text-gray-400 tracking-wider font-mono"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[#1f2937]/50">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-[#030712]/50 transition-colors duration-200"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3.5 pr-2 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-[#1F2937] text-center text-[10px] font-mono text-gray-400">
        <div>
          <span className="block text-gray-500 uppercase text-[8px] font-bold">Nano Tiers</span>
          <span className="text-[#38BDF8] font-bold">High CVR (4.5%+)</span>
        </div>
        <div>
          <span className="block text-gray-500 uppercase text-[8px] font-bold">Micro Tiers</span>
          <span className="text-[#818CF8] font-bold">Peak ROI (5.0x+)</span>
        </div>
        <div>
          <span className="block text-gray-500 uppercase text-[8px] font-bold">Macro Tiers</span>
          <span className="text-white">Medium Yield</span>
        </div>
        <div>
          <span className="block text-gray-500 uppercase text-[8px] font-bold">Mega Tiers</span>
          <span className="text-gray-400">Pure Reach</span>
        </div>
      </div>
    </div>
  );
}
