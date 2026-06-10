"use client";

import React, { useState } from "react";
import { Info, X } from "lucide-react";
import { SOURCE_ATTRIBUTION } from "@/utils/tooltips";

export function DataSourceFooter() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-1 px-3 py-2 text-[10px] font-mono text-gray-400 hover:text-[#38BDF8] transition-colors hover:bg-[#030712] rounded border border-[#1F2937] hover:border-[#38BDF8]"
      >
        <Info className="h-3 w-3" />
        <span>Data Sources & Attribution</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0B1117] border border-[#1F2937] rounded-lg max-w-3xl max-h-[85vh] overflow-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-white">{SOURCE_ATTRIBUTION.TITLE}</h2>
                <div className="space-y-1 mt-2">
                  <p className="text-[11px] text-gray-400 font-mono">
                    Version: {SOURCE_ATTRIBUTION.VERSION}
                  </p>
                  <p className="text-[11px] text-gray-400 font-mono">
                    Author: {SOURCE_ATTRIBUTION.AUTHOR}
                  </p>
                  <p className="text-[11px] text-[#38BDF8] font-mono">
                    Rail Category: {SOURCE_ATTRIBUTION.RAIL_CATEGORY}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Overview */}
            <div className="bg-[#030712] border border-[#1F2937] rounded-lg p-4">
              <h3 className="text-sm font-bold text-[#38BDF8] mb-2">Data Architecture Overview</h3>
              <p className="text-[11px] text-gray-300 leading-relaxed font-mono">
                {SOURCE_ATTRIBUTION.DATA_ENGINE}. {SOURCE_ATTRIBUTION.DETERMINISTIC}
              </p>
            </div>

            {/* Data Sources Grid */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3">Data Sources</h3>
              <div className="space-y-3">
                {SOURCE_ATTRIBUTION.DATA_SOURCES.map((source, idx) => (
                  <div
                    key={idx}
                    className="bg-[#030712] border border-[#1F2937] rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-[#38BDF8]">{source.name}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">{source.type}</p>
                      </div>
                      {idx === 0 && (
                        <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-[9px] text-emerald-400 font-mono">
                          Live API
                        </span>
                      )}
                      {idx === 1 && (
                        <span className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded text-[9px] text-indigo-400 font-mono">
                          Deterministic
                        </span>
                      )}
                      {idx === 2 && (
                        <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-[9px] text-cyan-400 font-mono">
                          Reference
                        </span>
                      )}
                    </div>

                    {/* Metrics */}
                    <div className="flex flex-wrap gap-1.5">
                      {source.metrics.map((metric, mIdx) => (
                        <span
                          key={mIdx}
                          className="px-2 py-1 bg-[#0B1117] rounded text-[9px] text-gray-300 font-mono border border-[#1F2937]"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>

                    {/* Description or additional info */}
                    {source.fallback && (
                      <div className="text-[10px] text-gray-400 border-t border-[#1F2937] pt-2 mt-2">
                        <span className="text-gray-500">Fallback: </span>
                        <span>{source.fallback}</span>
                      </div>
                    )}
                    {source.coverage && (
                      <div className="text-[10px] text-gray-400 border-t border-[#1F2937] pt-2 mt-2">
                        <span className="text-gray-500">Coverage: </span>
                        <span>{source.coverage}</span>
                      </div>
                    )}
                    {"url" in source && source.url && (
                      <div className="text-[10px] text-gray-400 border-t border-[#1F2937] pt-2 mt-2">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#38BDF8] hover:underline"
                        >
                          View API Documentation →
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Facts */}
            <div className="bg-[#030712] border border-[#1F2937] rounded-lg p-4">
              <h3 className="text-sm font-bold text-[#818CF8] mb-2">Key Facts</h3>
              <ul className="space-y-1 text-[10px] text-gray-300 font-mono">
                <li>• All synthetic commerce data is seeded (seed=42) for reproducibility across sessions</li>
                <li>• World Bank data is fetched live from https://api.worldbank.org/v2 with fallback benchmarks</li>
                <li>• Dashboard is fully functional in "Offline Fallback Mode" if API is unavailable</li>
                <li>• Macroeconomic context (GDP, internet penetration, mobile) calibrates all simulated metrics</li>
                <li>• Industry benchmarks (CTR 1.5%, CVR 2.2%, ROI 4.5x) sourced from public fintech research</li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
              <p className="text-[10px] text-amber-100 font-mono leading-relaxed">
                ⚠ All commerce event data (impressions, clicks, purchases, payouts) is synthetically
                generated for intelligence and analysis purposes. This POC is intended for visualization,
                simulation, and educational use cases in the Real Rails Intelligence ecosystem.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-[#38BDF8] hover:bg-[#22d3ee] text-black font-bold py-2.5 rounded-lg text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
